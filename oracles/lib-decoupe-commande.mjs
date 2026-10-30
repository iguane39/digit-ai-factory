/**
 * lib-decoupe-commande.mjs — lire une commande de shell sans se tromper d'écriture (D-101 (b) du 29/10/2026).
 *
 * LE FAIT, relevé par l'œil critique du 29/10/2026 : 4 refus du hook de fin de tour tenaient à des commandes mal lues. Un
 * `awk '/^> /{print; n++} n>40{exit}' f` était coupé sur le « ; » de son programme, et « n>40{exit} » devenait une écriture vers
 * « 40{exit} ». Un `rm -rf "$S/x"` ou un `mkdir -p "$W/y"` dont la variable désignait le dossier temporaire, posée dans la même
 * commande, comptait comme une écriture dans le dépôt, parce que la variable n'était pas lue.
 *
 * NON JUGÉ : une variable posée par une commande précédente (le shell du poste n'en garde aucune d'un appel à l'autre), une
 * substitution de commande. L'erreur tombe du côté sûr : une cible inconnue reste comptée comme une écriture.
 */

/**
 * Les commandes simples d'une ligne : coupée sur `&&`, `||`, `|`, `;` et les fins de ligne, HORS guillemets. Un guillemet resté
 * ouvert (`echo l'ami > f`) rend le découpage naïf : mieux vaut relever une écriture de trop que d'en cacher une.
 */
export function decouperCommande(commande) {
  const s = String(commande || "");
  const out = [];
  let cur = "", q = null;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (q) { cur += c; if (c === q && (q === "'" || s[k - 1] !== "\\")) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === ";" || c === "\n") { out.push(cur); cur = ""; continue; }
    if (c === "|") { out.push(cur); cur = ""; if (s[k + 1] === "|") k++; continue; }
    if (c === "&" && s[k + 1] === "&") { out.push(cur); cur = ""; k++; continue; }
    cur += c;
  }
  if (q) return s.split(/&&|\|\||\||[;\n]/);
  out.push(cur);
  return out;
}

const AFFECTATION = /(?:^|[\s;&(])\$?([A-Za-z_]\w*)\s*=\s*("[^"]*"|'[^']*'|[^\s;&|)]+)/g;

/**
 * Remplace `$NOM` et `${NOM}` par sa valeur, pour les seules variables POSÉES DANS LA COMMANDE et qui désignent le dossier
 * temporaire. Les autres restent telles quelles, donc comptées.
 */
export function resoudreTemporaires(commande, estTemporaire) {
  const cmd = String(commande || "");
  const vars = new Map();
  for (const [, nom, brute] of cmd.matchAll(AFFECTATION)) {
    const v = brute.replace(/^["']|["']$/g, "");
    if (estTemporaire(v)) vars.set(nom, v);
  }
  if (!vars.size) return cmd;
  return cmd.replace(/\$\{([A-Za-z_]\w*)\}|\$([A-Za-z_]\w*)/g, (m, a, b) => vars.get(a || b) ?? m);
}
