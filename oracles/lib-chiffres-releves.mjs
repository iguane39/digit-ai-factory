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
export const DECLARE_NON_MESURE = /non mesur|non recompt|non v[ée]rifi|projet[ée]|estim|environ|hypoth|à mesurer|\bcible\b|objectif|attendue?s?\b|vis[ée]e?s?\b|d'ici|plafond|seuil|au plus|au moins/i;

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

// ---- D-131 (a) du 02/11/2026 (TF-2056) — LES CHIFFRES D'UN GAIN ÉCRIT AU REGISTRE ----------------------------------------------------------------
// S90 juge le texte d'une restitution ; `gains_constates`, le champ qu'un tour écrit à la clôture d'un item, n'était jugé par personne. Le fait :
// le 02/11/2026, « 813 Markdown suivis, 4 accusés » sans sortie à l'appui ; la mesure rejouée en donnait 1 209 et 5. Ici, TOUT chiffre du gain
// compte (pas seulement les cinq natures de S90 : « 4 accusés » n'en est pas une), sauf ce qui n'est pas un compte : dates, heures, années,
// numéros de règle ou de tâche (TF-2056, D-131, S90), SHA, versions, chemins, numéros de loi ou de section (« n° 3 », « § 4 »).
// Le chiffre se compare comme S90 le fait (`nombresDuTexte` : « 1 209 » et « 1209 », « 21,4 » et « 21.4 » sont le même) ; une clause qui le dit non
// mesuré, estimé ou visé (`DECLARE_NON_MESURE`) n'est pas accusée. NON JUGÉ : que le chiffre retrouvé soit le bon, un total calculé dans le gain
// (accusé à tort, d'où un simple avertissement), un chiffre en lettres.
const DATES = [
  /\b\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?Z?)?/g,                                  // dates et instants ISO
  /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,                                                                      // dates 02/11/2026
  /(?<![\w/\\.-])(?:0?[1-9]|[12]\d|3[01])\/(?:0[1-9]|1[0-2])(?![\w/\\.-])/g,                          // dates 02/11 ; 22/22 et 13/14 restent des comptes
  /\b\d{1,2}\s?(?:h\s?\d{2}|:\d{2})\b/g,                                                                 // heures 14h15, 14:15
];
const RATIO = /(?<![\w/\\.-])(\d{1,6})\/(\d{1,6})(?![\w/\\.-])/g;                                         // « 22/22 » : deux comptes, lus un à un
const NON_COMPTES = [
  /\b(?:20[2-3]\d)\b/g,                                                                                  // années
  /\bv?\d+\.\d+\.\d+(?:\.\d+)*\b/g,                                                                      // versions 2.57.0
  /\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b/g,                                                // SHA
  /\b\d{6,}[A-Za-z]\b/g,                                                                                 // lots 20261102n
  /\b[A-Za-z_]+-?\d[\w-]*\b/g,                                                                           // TF-2056, D-131, S90, K2, md5
  /(?:n°|\bno\.?|§)\s*\d+/gi,                                                                            // « n° 3 », « § 4 »
  /\S*[\\/]\S*/g,                                                                                        // chemins et URL
];
const NOMBRE_GAIN = /\d(?:[\d   ]*\d)?(?:[.,]\d+)?/g;
// Un nombre rapporté par un agent et MARQUÉ tel est la forme que la doctrine prescrit (AGENT-CAMPAGNE.md, TF-1009 et TF-1802 : « rapporté par l'agent, non recompté ») :
// la clause qui le dit n'est pas accusée, comme celle qui le dit non mesuré.
const DECLARE_RAPPORTE = new RegExp(`${DECLARE_NON_MESURE.source}|rapport[ée]s? (?:par|de)\\b|selon (?:l'|le )?(?:agent|rapport)|d'après (?:l'|le )?(?:agent|rapport)`, "i");
/**
 * Les chiffres d'un gain : [{ chiffre, forme, morceaux, extrait }]. `forme` est la graphie comparable de `nombresDuTexte` ; `morceaux`, les nombres
 * qu'un bloc « 5 12 » contient quand l'espace sépare deux nombres plutôt qu'il ne groupe des milliers (le bloc est lu connu si tous ses morceaux le sont).
 */
export function chiffresDeGains(texte) {
  const out = [], vus = new Set();
  for (const clause of String(texte || "").split(/[;\n]|\.\s/)) {
    if (DECLARE_RAPPORTE.test(clause)) continue;
    // Les dates sortent d'abord ; un ratio de comptes (« 22/22 ») est ensuite lu côté par côté, avant que la règle des chemins ne l'emporte.
    let lue = clause.replace(/`/g, " ");
    for (const re of DATES) lue = lue.replace(re, " ");
    lue = lue.replace(RATIO, "$1, $2");
    for (const re of NON_COMPTES) lue = lue.replace(re, " ");
    for (const m of lue.matchAll(NOMBRE_GAIN)) {
      const [forme, ...morceaux] = [...nombresDuTexte(m[0])];
      if (vus.has(forme)) continue;
      vus.add(forme);
      const i = clause.indexOf(m[0].trim());
      out.push({ chiffre: m[0].trim(), forme, morceaux, extrait: clause.slice(Math.max(0, i - 25), i + m[0].length + 25).trim() });
    }
  }
  return out;
}
