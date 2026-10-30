/**
 * lib-chiffres-releves.mjs — un chiffre affirmé dans une réponse a-t-il été lu dans le tour ? (S90, D-100 (a) du 29/10/2026)
 *
 * LE FAIT, relevé par l'œil critique du 29/10/2026 sur 7 lots de sessions : 9 chiffres ou états affirmés sans mesure, puis corrigés
 * par l'humain ou par la mesure : une durée de « 15 minutes » reprise d'une note périmée (46 secondes mesurées), un abonnement à
 * 599 $ sorti d'une confusion, « 84 sur 100 » annoncé sans relecteur, « 339 entrées et 25 motifs » jamais comptés. S84 relève l'heure
 * du bloc 1 ; aucune règle ne relevait les autres chiffres.
 *
 * CE QUI EST LU : une durée, un coût, un score ou un pourcentage, un volume, un compte d'objets nommés. Ce chiffre est « relevé »
 * s'il apparaît, à l'identique, dans une sortie d'outil ou un message humain du tour. Une ligne qui le dit non mesuré, estimé, projeté
 * ou visé n'est pas accusée.
 *
 * NON JUGÉ : qu'un chiffre retrouvé soit le bon (il peut venir d'une autre sortie) ; un total calculé dans la réponse (accusé à tort,
 * d'où une règle avertissante) ; un chiffre écrit en lettres ; un état sans chiffre (« publié »).
 */

const NORMALISE = (s) => String(s).replace(/[\s  ]/g, "").replace(/,/g, ".").replace(/\.$/, "");

/** Les nombres d'un texte, sous forme comparable : « 1 568 082 » et « 1568082 » sont le même, « 21,4 » et « 21.4 » aussi. */
export function nombresDuTexte(texte) {
  const out = new Set();
  for (const m of String(texte || "").matchAll(/\d(?:[\d   ]*\d)?(?:[.,]\d+)?/g)) {
    out.add(NORMALISE(m[0]));
    // « 2026 10 29 » ou deux nombres séparés d'une espace forment un faux bloc : chaque morceau compte aussi.
    for (const p of m[0].split(/[\s  ]+/)) out.add(NORMALISE(p));
  }
  return out;
}

const NOMBRE = String.raw`\d(?:[\d   ]*\d)?(?:[.,]\d+)?`;
const FIGURES = [
  ["durée", new RegExp(String.raw`(?<![\d.,:/-])(${NOMBRE})\s*(?:minutes?|min\b|secondes?|heures?|jours?|semaines?)`, "giu")],
  ["coût", new RegExp(String.raw`(?<![\d.,:/-])(${NOMBRE})\s*(?:\$|€|euros?\b|dollars?\b)`, "giu")],
  ["score", new RegExp(String.raw`(?<![\d.,:/-])(${NOMBRE})\s*(?:sur\s*100\b|/\s*100\b|%)`, "giu")],
  ["volume", new RegExp(String.raw`(?<![\d.,:/-])(${NOMBRE})\s*(?:jetons?\b|tokens?\b|Ko\b|Mo\b|Go\b)`, "gu")],
  ["compte", new RegExp(String.raw`(?<![\d.,:/-])(${NOMBRE})\s+(?:fichiers?|lignes?|tests?|cas\b|commits?|sessions?|demandes?|refus\b|erreurs?|d[ée]fauts?|produits?|scripts?|contr[ôo]les?|entr[ée]es\b|items?\b|occurrences?)`, "giu")],
];
const DECLARE_NON_MESURE = /non mesur|non recompt|non v[ée]rifi|projet[ée]|estim|environ|hypoth|à mesurer|\bcible\b|objectif|attendue?s?\b|vis[ée]e?s?\b|d'ici|plafond|seuil|au plus|au moins/i;

/**
 * Les chiffres d'une réponse qu'aucune sortie du tour ne montre : [{ nature, chiffre, ligne }]. Le bloc 1 (l'heure, jugée par S84) et le
 * bloc 9 (les traces), les blocs de code et les lignes qui déclarent le chiffre non mesuré sont hors du jugement.
 */
export function chiffresSansReleve(texte, nombres) {
  const connus = nombres instanceof Set ? nombres : new Set(nombres);
  const out = [];
  let dansCode = false, horsBloc = false;
  for (const ligne of String(texte || "").split(/\r?\n/)) {
    if (/^\s*```/.test(ligne)) { dansCode = !dansCode; continue; }
    if (dansCode) continue;
    const titre = /^#{1,4}\s*\**\s*(\d)[.)]?\s/.exec(ligne);
    if (titre) { horsBloc = titre[1] === "1" || titre[1] === "9"; continue; }
    if (horsBloc || DECLARE_NON_MESURE.test(ligne)) continue;
    // Une cible de lien (« Lot%200%20 » se lisait « 200% ») et le code en ligne (chemins, commandes) ne sont pas des chiffres affirmés.
    const lue = ligne.replace(/\]\([^)]*\)/g, "]").replace(/`[^`]*`/g, " ");
    for (const [nature, re] of FIGURES) {
      for (const m of lue.matchAll(re)) {
        const chiffre = NORMALISE(m[1]);
        if (!connus.has(chiffre)) out.push({ nature, chiffre: m[0].trim(), ligne: ligne.trim().slice(0, 140) });
      }
    }
  }
  return out;
}
