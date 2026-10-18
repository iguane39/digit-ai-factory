/**
 * lib-enumeration-liste.mjs — E-11 SUR UN TEXTE MARKDOWN : UNE ÉNUMÉRATION DEVIENT UNE LISTE
 * (TF-1847, retour Produit-79 RP-10 du 17/10/2026).
 *
 * LE FAIT. `references\ECRITURE.md` E-11 dit « un paragraphe qui énumère devient une liste », et son
 * juge n'existait que pour HTML (L12, TF-1621, TF-1665) et PPTX (TF-1390). Une restitution Markdown
 * dont le guide enchaînait 3 à 6 gestes par étape dans un paragraphe, et dont une option portait
 * « Comment faire : 1) … 2) … 3) … » sur une ligne de tableau, a été jugée affichable, 0 bloquant.
 * Retour humain, mot pour mot : « J'ai déjà dit que lorsqu'il y avait des listes, il devait y avoir
 * des puces et sous-puces affichées, ce qui n'est pas le cas ici. »
 *
 * UNE SEULE IMPLÉMENTATION, DEUX JUGES : `oracle-synthese` (S80, restitutions) et `oracle-ecriture`
 * (EC-12, tout autre Markdown du pilot). Les motifs vivent ici, une fois (R3).
 *
 * CE QUI EST JUGÉ, ET CE QUI NE L'EST PAS.
 *   · une énumération numérotée EN LIGNE : trois marqueurs « 1) … 2) … 3) » (ou « (1) … (2) … (3) »)
 *     consécutifs sur une même ligne, hors code, hors citation entre guillemets français ;
 *   · une étape de GUIDE (section « Guide ») qui enchaîne trois gestes ou plus sans sous-puce, ou
 *     dont une sous-puce en enchaîne trois.
 * NON JUGÉ : un paragraphe qui énumère sans numéroter (« A, B, C et D »), un raisonnement coupé en
 * puces à tort (le sens inverse d'E-11), le nombre exact de gestes d'une étape — il est approché par
 * un vocabulaire fermé de verbes d'action et par les connecteurs d'enchaînement.
 */

/** Une ligne de séparation de tableau (`|---|---|`) : de la mise en page. */
const estSeparateurTableau = (l) => /\|/.test(l) && /-/.test(l) && /^[\s:|-]+$/.test(l);

/**
 * Les lignes d'un Markdown hors front matter et hors blocs de code, chacune avec son numéro (à
 * partir de 1) et sa version « nue » : spans de code, citations « … » et "…", adresses retirés.
 */
export function lignesAnalysables(texte) {
  const src = String(texte).replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let dansCode = false, dansFrontMatter = false;
  for (let i = 0; i < src.length; i++) {
    const brut = src[i];
    if (i === 0 && /^---\s*$/.test(brut)) { dansFrontMatter = true; continue; }
    if (dansFrontMatter) { if (/^(---|\.\.\.)\s*$/.test(brut)) dansFrontMatter = false; continue; }
    if (/^\s*(```|~~~)/.test(brut)) { dansCode = !dansCode; continue; }
    if (dansCode || estSeparateurTableau(brut)) continue;
    out.push({ n: i + 1, brut, nu: nu(brut) });
  }
  return out;
}

/** Une ligne sans ce qui CITE : code, citation entre guillemets, adresse. */
function nu(l) {
  return String(l)
    .replace(/`[^`]*`/g, " ")
    .replace(/«[^»]*»/g, " ")
    .replace(/"[^"\n]*"/g, " ")
    .replace(/https?:\/\/\S+|www\.\S+/g, " ");
}

// ── A. L'énumération numérotée en ligne ────────────────────────────────────────────────────────

const MARQUEUR = /(?<![\p{L}\p{N}.,/\\_-])\(?(\d{1,2})\)(?=\s+\S)/gu;

/** Le nombre de marqueurs 1), 2), 3)… consécutifs, dans l'ordre, sur une ligne nue. */
export function suiteNumerotee(ligneNue) {
  let attendu = 1;
  for (const m of String(ligneNue).matchAll(MARQUEUR)) if (Number(m[1]) === attendu) attendu++;
  return attendu - 1;
}

/**
 * Les lignes qui portent une énumération numérotée en ligne d'au moins `minimum` éléments.
 * @returns {{ligne:number, elements:number, cellule:boolean, extrait:string}[]}
 */
export function enumerationsEnLigne(texte, minimum = 3) {
  const res = [];
  for (const l of lignesAnalysables(texte)) {
    const elements = suiteNumerotee(l.nu);
    if (elements >= minimum)
      res.push({ ligne: l.n, elements, cellule: /^\s*\|/.test(l.brut), extrait: l.brut.replace(/\s+/g, " ").trim().slice(0, 110) });
  }
  return res;
}

// ── B. L'étape de guide qui enchaîne ───────────────────────────────────────────────────────────

// Le vocabulaire des gestes est FERMÉ : des verbes où le lecteur agit de ses mains sur un écran, un
// champ ou un terminal, à l'impératif (vous) et à l'infinitif. Un verbe hors liste n'est pas compté :
// la règle préfère manquer un cas que crier sur une phrase.
const RACINES_GESTES = [
  "ouvr(?:ez|ir)", "ferm(?:ez|er)", "cliqu(?:ez|er)", "saisi(?:ssez|r)", "coll(?:ez|er)", "copi(?:ez|er)",
  "s[ée]lectionn(?:ez|er)", "choisi(?:ssez|r)", "coch(?:ez|er)", "d[ée]coch(?:ez|er)", "activ(?:ez|er)",
  "d[ée]sactiv(?:ez|er)", "appuy(?:ez|er)", "tap(?:ez|er)", "renseign(?:ez|er)", "ajout(?:ez|er)",
  "valid(?:ez|er)", "enregistr(?:ez|er)", "connect(?:ez|er)", "acc[ée]d(?:ez|er)", "all(?:ez|er)",
  "d[ée]pos(?:ez|er)", "lanc(?:ez|er)", "ex[ée]cut(?:ez|er)", "entr(?:ez|er)", "remplissez", "remplir",
  "nomm(?:ez|er)", "cr[ée]{1,2}(?:z|r)", "t[ée]l[ée]charg(?:ez|er)", "import(?:ez|er)", "export(?:ez|er)",
  "param[ée]tr(?:ez|er)", "autoris(?:ez|er)", "accept(?:ez|er)", "confirm(?:ez|er)", "glisse(?:z|r)",
  "d[ée]velopp(?:ez|er)", "rafra[iî]chi(?:ssez|r)", "not(?:ez|er)", "cherch(?:ez|er)", "recherch(?:ez|er)",
  "filtr(?:ez|er)", "trouv(?:ez|er)", "pass(?:ez|er)", "bascul(?:ez|er)", "survol(?:ez|er)", "visit(?:ez|er)",
  "ins[ée]r(?:ez|er)", "supprim(?:ez|er)", "modifi(?:ez|er)", "d[ée]fil(?:ez|er)", "fa(?:ites|ire)", "mett(?:ez|re)",
  "positionn(?:ez|er)", "indiqu(?:ez|er)", "d[ée]sign(?:ez|er)", "retourn(?:ez|er)", "reven(?:ez|ir)", "attend(?:ez|re)",
  "v[ée]rifi(?:ez|er)", "rep[ée]r(?:ez|er)", "s[ée]lectionnez", "ex[ée]cutez", "reconnect(?:ez|er)",
];
const RE_GESTE = new RegExp(`(?<![\\p{L}\\p{N}])(?:${RACINES_GESTES.join("|")})(?![\\p{L}\\p{N}])`, "giu");
const RE_ENCHAINEMENT = /(?<![\p{L}\p{N}])(?:puis|ensuite|enfin)(?![\p{L}\p{N}])|→|›|⟶/giu;

/** Le texte d'une étape ou d'une sous-puce, privé de sa clôture « Résultat attendu : … » et de ses citations. */
function sansCloture(t) {
  return nu(String(t)).replace(/r[ée]sultat attendu[\s\S]*$/i, "");
}

/**
 * Le nombre de gestes que chaîne un texte : le plus grand de ses verbes d'action et de ses
 * enchaînements + 1 (« Ouvrez A, puis B, puis C » chaîne trois gestes avec un seul verbe).
 */
export function gestesDe(t) {
  const s = sansCloture(t);
  const verbes = (s.match(RE_GESTE) || []).length;
  const liens = (s.match(RE_ENCHAINEMENT) || []).length;
  return Math.max(verbes, liens ? liens + 1 : 0);
}

/**
 * Les étapes de la section « Guide » : une ligne numérotée, ses lignes de suite, ses sous-puces.
 * @returns {{ligne:number, texte:string, sousPuces:{ligne:number, texte:string}[]}[]}
 */
export function etapesDeGuide(texte) {
  const lignes = String(texte).replace(/\r\n?/g, "\n").split("\n");
  const iTitre = lignes.findIndex((l) => /^#{1,4}[ \t]*Guide\b/i.test(l));
  if (iTitre < 0) return [];
  const etapes = [];
  let enCode = false;
  for (let i = iTitre + 1; i < lignes.length; i++) {
    const l = lignes[i];
    if (/^#{1,4}\s/.test(l)) break;
    if (/^\s*(```|~~~)/.test(l)) { enCode = !enCode; continue; }
    if (enCode) continue;
    if (/^\s*\d{1,2}[.)]\s+\S/.test(l)) { etapes.push({ ligne: i + 1, texte: l.trim(), sousPuces: [], retrait: 0 }); continue; }
    if (!etapes.length || !l.trim()) continue;
    const derniere = etapes[etapes.length - 1];
    const puce = /^(\s*)[-*+•]\s+\S/.exec(l);
    // Une puce plus indentée que la première sous-puce de l'étape est imbriquée : elle prolonge la sous-puce
    // qui la porte (« Résultat attendu : » suivi d'une liste) au lieu d'en ouvrir une autre.
    const imbriquee = puce && derniere.sousPuces.length && puce[1].length > derniere.retrait + 1;
    if (puce && !imbriquee) {
      if (!derniere.sousPuces.length) derniere.retrait = puce[1].length;
      derniere.sousPuces.push({ ligne: i + 1, texte: l.replace(/^\s*[-*+•]\s+/, "").trim() });
    } else if (derniere.sousPuces.length) derniere.sousPuces[derniere.sousPuces.length - 1].texte += " " + l.replace(/^\s*[-*+•]\s+/, "").trim();
    else derniere.texte += " " + l.trim();
  }
  return etapes;
}

const SEUIL_GESTES = 3;

/**
 * Les défauts de forme des étapes d'un guide : une étape sans sous-puce qui enchaîne trois gestes
 * ou plus, une sous-puce qui en enchaîne trois.
 * @returns {{ligne:number, gestes:number, forme:"etape"|"sous-puce", extrait:string}[]}
 */
export function etapesQuiEnchainent(texte) {
  const res = [];
  for (const e of etapesDeGuide(texte)) {
    if (!e.sousPuces.length) {
      const g = gestesDe(e.texte);
      if (g >= SEUIL_GESTES) res.push({ ligne: e.ligne, gestes: g, forme: "etape", extrait: e.texte.slice(0, 110) });
      continue;
    }
    for (const s of e.sousPuces) {
      const g = gestesDe(s.texte);
      if (g >= SEUIL_GESTES) res.push({ ligne: s.ligne, gestes: g, forme: "sous-puce", extrait: s.texte.slice(0, 110) });
    }
  }
  return res;
}

/**
 * Les étapes de guide dont la clôture « Résultat attendu » n'est pas la DERNIÈRE sous-puce, alors que
 * l'étape porte des sous-puces (S53).
 */
export function etapesSansClotureEnDerniere(texte) {
  const RE = /^\s*(?:\*\*|__)?r[ée]sultat attendu/i;
  return etapesDeGuide(texte)
    .filter((e) => e.sousPuces.length && !RE.test(e.sousPuces[e.sousPuces.length - 1].texte))
    .map((e) => ({ ligne: e.ligne, extrait: e.texte.slice(0, 110) }));
}
