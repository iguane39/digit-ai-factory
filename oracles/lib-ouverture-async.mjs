/**
 * lib-ouverture-async — passe en `async` le hook d'ouverture de la factory déclaré dans le
 * `.claude/settings.json` d'un produit (TF-1635, 13/10/2026).
 *
 * LE FAIT : l'extension VS Code abandonne une session dont l'initialisation dépasse 60 s, et le CLI
 * n'annonce sa disponibilité qu'APRÈS la fin des hooks SessionStart synchrones. Le pilot est passé
 * en `async` le 13/10 (commit 9bfc8153), mais `.claude/settings.json` d'un produit est en mode
 * `presence_et_motif` : jamais recopié. Mesuré le 13/10 sur le poste : 19 produits sur 19 portaient
 * encore le hook synchrone à 240 s, donc 19 ouvertures vouées au même échec.
 *
 * LA RÉPARATION EST CHIRURGICALE : seule l'entrée SessionStart qui appelle
 * `forge/hooks/factory.mjs ouverture` est touchée (ajout de `async: true` et de `--contexte-json`).
 * Permissions, serveurs MCP et autres hooks, que le produit personnalise, restent intacts ;
 * l'indentation et les fins de ligne du fichier sont gardées. C'est le produit qui se met à jour
 * lui-même : la fonction est appelée par le hook d'ouverture qui tourne DANS le produit.
 *
 * Retour : { etat: "absent" | "illisible" | "sans_hook" | "deja" | "corrige", detail? }.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export const MOTIF_HOOK_OUVERTURE = /forge\/hooks\/factory\.mjs\s+ouverture\b/;

/**
 * TF-1755 (15/10/2026) — UN HOOK AJOUTÉ AU GABARIT APRÈS L'INSTALLATION D'UN PRODUIT L'ATTEINT À SON OUVERTURE.
 *
 * LE FAIT, mesuré le 15/10 sur 21 produits du poste : publication-hebergee câblé chez 2, droits-accordes
 * chez 2, ecriture chez 8. `.claude/settings.json` est en `presence_et_motif`, jamais recopié : chaque
 * entrée neuve du gabarit attendait un geste du produit, qui ne venait pas.
 *
 * LA FUSION EST CHIRURGICALE ET N'AJOUTE QUE CE QUI MANQUE. Une entrée du gabarit se reconnaît à sa
 * commande `forge/hooks/factory.mjs <nom>` ; elle est absente si AUCUNE commande du produit, sous le même
 * événement, n'appelle ce nom. Elle s'ajoute au groupe du produit qui porte le même `matcher`, sinon en
 * groupe neuf portant le `matcher` du gabarit. Rien n'est retiré, rien n'est modifié : permissions,
 * serveurs MCP, hooks du produit, délais qu'il a réglés restent intacts ; indentation, BOM et fins de
 * ligne sont gardés.
 *
 * LES EXCLUSIONS SE DÉCLARENT DANS LE FICHIER MÊME, sous `_hooks_factory_exclus` : une liste d'objets
 * `{ "commande": "forge/hooks/factory.mjs <nom>", "motif": "…" }` (ou de chaînes). Un nom exclu n'est
 * jamais ajouté. Comme la commande y est écrite en toutes lettres, le motif exigé par le contrat
 * d'héritage (`gabarits/HERITAGE.json`) est tenu : un écart DÉCLARÉ n'est pas un oubli.
 *
 * Retour : { etat: "absent" | "illisible" | "gabarit_illisible" | "deja" | "corrige", ajoutes: [noms], exclus: [noms] }.
 */
export const MOTIF_COMMANDE_FACTORY = /forge\/hooks\/factory\.mjs\s+([\w-]+)/;

export function nomsExclus(j) {
  return [].concat(j?._hooks_factory_exclus || [])
    .map((x) => (String(typeof x === "string" ? x : x?.commande || "").match(MOTIF_COMMANDE_FACTORY) || [])[1])
    .filter(Boolean);
}

export function fusionnerHooksDuGabarit(chemin, cheminGabarit) {
  if (!existsSync(chemin)) return { etat: "absent", ajoutes: [], exclus: [] };
  let gabarit;
  try { gabarit = JSON.parse(readFileSync(cheminGabarit, "utf8").replace(/^﻿/, "")); } catch (e) { return { etat: "gabarit_illisible", detail: e.message, ajoutes: [], exclus: [] }; }
  const brut = readFileSync(chemin, "utf8");
  let j;
  try { j = JSON.parse(brut.replace(/^﻿/, "")); } catch (e) { return { etat: "illisible", detail: e.message, ajoutes: [], exclus: [] }; }
  if (!j || typeof j !== "object" || Array.isArray(j)) return { etat: "illisible", detail: "racine non objet", ajoutes: [], exclus: [] };
  const exclus = nomsExclus(j);
  const ajoutes = [];
  for (const [evenement, groupesG] of Object.entries(gabarit.hooks || {})) {
    for (const gG of groupesG || []) {
      for (const hG of gG.hooks || []) {
        const nom = (String(hG.command || "").match(MOTIF_COMMANDE_FACTORY) || [])[1];
        if (!nom || exclus.includes(nom)) continue;
        j.hooks = j.hooks && typeof j.hooks === "object" ? j.hooks : {};
        const groupesP = Array.isArray(j.hooks[evenement]) ? j.hooks[evenement] : (j.hooks[evenement] = []);
        const present = groupesP.some((g) => (g?.hooks || []).some((h) => (String(h?.command || "").match(MOTIF_COMMANDE_FACTORY) || [])[1] === nom));
        if (present) continue;
        let cible = groupesP.find((g) => (g?.matcher ?? null) === (gG.matcher ?? null) && Array.isArray(g?.hooks));
        if (!cible) { cible = { ...(gG.matcher !== undefined ? { matcher: gG.matcher } : {}), hooks: [] }; groupesP.push(cible); }
        cible.hooks.push({ ...hG });
        ajoutes.push(nom);
      }
    }
  }
  if (!ajoutes.length) return { etat: "deja", ajoutes, exclus };
  const eol = brut.includes("\r\n") ? "\r\n" : "\n";
  const indent = (brut.match(/\n([ \t]+)"/) || [, "  "])[1];
  let sortie = JSON.stringify(j, null, indent).replace(/\n/g, eol);
  if (/\r?\n$/.test(brut)) sortie += eol;
  writeFileSync(chemin, (brut.startsWith("﻿") ? "﻿" : "") + sortie);
  return { etat: "corrige", ajoutes, exclus };
}

export function passerOuvertureEnAsync(chemin) {
  if (!existsSync(chemin)) return { etat: "absent" };
  const brut = readFileSync(chemin, "utf8");
  let j;
  try { j = JSON.parse(brut.replace(/^﻿/, "")); } catch (e) { return { etat: "illisible", detail: e.message }; }
  const groupes = j?.hooks?.SessionStart;
  if (!Array.isArray(groupes)) return { etat: "sans_hook" };
  let trouve = false, change = false;
  for (const g of groupes) for (const h of (g?.hooks || [])) {
    if (typeof h?.command !== "string" || !MOTIF_HOOK_OUVERTURE.test(h.command)) continue;
    trouve = true;
    if (!/--contexte-json\b/.test(h.command)) { h.command = `${h.command} --contexte-json`; change = true; }
    if (h.async !== true) { h.async = true; change = true; }
  }
  if (!trouve) return { etat: "sans_hook" };
  if (!change) return { etat: "deja" };
  const eol = brut.includes("\r\n") ? "\r\n" : "\n";
  const indent = (brut.match(/\n([ \t]+)"/) || [, "  "])[1];
  let sortie = JSON.stringify(j, null, indent).replace(/\n/g, eol);
  if (/\r?\n$/.test(brut)) sortie += eol;
  writeFileSync(chemin, (brut.startsWith("﻿") ? "﻿" : "") + sortie);
  return { etat: "corrige" };
}
