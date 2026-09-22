#!/usr/bin/env node
/**
 * oracle-invariants-traduction.mjs — juge qu'une traduction CONSERVE ce qui ne doit pas bouger,
 * et qu'elle est bien écrite dans la langue cible. Il ne juge PAS la fidélité du sens.
 *
 * POURQUOI CET ORACLE, ET POURQUOI SI ÉTROIT (TF-1232, 22/09/2026). Un produit du parc traduit
 * chaque semaine, du français vers le portugais, les descriptions d'événements qu'il republie, et
 * son exploitant a demandé que la factory en vérifie la justesse. Aucun des 57 domaines du
 * registre d'oracles ne couvrait une traduction ; le juge rédactionnel le plus proche n'accepte
 * aucun texte de référence, alors qu'une fidélité est par définition une comparaison à une source.
 * L'item nommait trois issues recevables ; celle-ci est retenue : SANS référence humaine, la
 * fidélité du SENS n'est pas mesurable par une machine qui ne triche pas — un modèle qui la
 * « jugerait » rendrait un avis, pas un verdict, et un avis promu en verdict est exactement ce que
 * le registre refuse. Ce qui, en revanche, se mesure sans aucun modèle et sans aucune dépense :
 *
 *   F1  nombres     — chaque nombre de la source se retrouve dans la cible (prix, horaires,
 *                     jauges, numéros) ; les séparateurs de milliers et de décimales, qui
 *                     changent d'une langue à l'autre, sont neutralisés avant de comparer ;
 *   F2  mois        — chaque mois nommé dans la source a son équivalent dans la cible (table
 *                     fermée fr / pt / es / en / it / de) : un « 12 octobre » devenu « 12 de
 *                     novembro » garde son nombre et perd sa date ;
 *   F3  adresses    — chaque URL et chaque courriel de la source est présent, à l'identique ;
 *   F4  invariants  — chaque terme de la liste d'invariants fournie (toponymes, organisateurs,
 *                     noms de lieux) présent dans la source l'est aussi dans la cible, verbatim ;
 *   F5  langue      — la cible n'est pas une recopie de la source, et sa densité de mots-outils
 *                     la désigne comme écrite dans la langue cible plutôt que dans la source.
 *
 * Usage :
 *   node oracle-invariants-traduction.mjs --paires <paires.json> --langue-cible pt [--langue-source fr] [--invariants <liste.json>]
 *     <paires.json> : [{ "id": "…", "source": "…", "cible": "…" }, …]
 *     <liste.json>  : [ "Ponte de Lima", "Câmara Municipal", … ]  (facultatif)
 *   node oracle-invariants-traduction.mjs --self-test
 * Contrat : JSON {oracle, domaine, artefact, verdict, findings[], non_juge[]} · exit 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// ── F2 · la table FERMÉE des mois. Une donnée de langue stable, pas un référentiel périssable :
// les noms de mois ne changent pas d'une saison à l'autre. Index 0 = janvier.
export const MOIS = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  de: ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"],
};

// ── F5 · les mots-outils, par langue : articles, prépositions, conjonctions, pronoms fréquents.
// Ils ne se traduisent pas mot à mot et ne voyagent pas d'une langue à l'autre — c'est ce qui en
// fait un bon témoin de la langue EFFECTIVE d'un texte, bien meilleur qu'un vocabulaire de contenu.
export const MOTS_OUTILS = {
  fr: ["le", "la", "les", "des", "du", "un", "une", "et", "est", "dans", "pour", "avec", "sur", "au", "aux", "ce", "cette", "qui", "que", "pas", "par", "en", "il", "elle", "nous", "vous"],
  pt: ["o", "os", "as", "um", "uma", "e", "é", "no", "na", "nos", "nas", "para", "com", "ao", "aos", "do", "dos", "da", "das", "que", "não", "por", "em", "ele", "ela", "você"],
  es: ["el", "los", "las", "un", "una", "y", "es", "en", "para", "con", "del", "al", "que", "no", "por", "este", "esta", "lo", "se", "su"],
  en: ["the", "a", "an", "and", "is", "in", "for", "with", "on", "of", "to", "that", "this", "not", "by", "it", "we", "you", "are", "be"],
  it: ["il", "lo", "gli", "la", "le", "un", "una", "e", "è", "nel", "nella", "per", "con", "del", "della", "che", "non", "da", "di", "si"],
  de: ["der", "die", "das", "und", "ist", "in", "für", "mit", "auf", "den", "dem", "ein", "eine", "nicht", "von", "zu", "es", "sie", "wir", "sind"],
};

const minus = (s) => String(s || "").toLocaleLowerCase("fr");
const mots = (s) => minus(s).match(/[\p{L}]+/gu) || [];

/** F1 — la liste des nombres d'un texte, chacun ramené à sa suite de chiffres. */
export function nombres(texte) {
  // Un nombre peut porter des séparateurs de milliers (espace, espace insécable, espace fine,
  // point) et une virgule ou un point décimal. Ce qui compte est la SUITE DE CHIFFRES : « 1 500,50 »
  // et « 1.500,50 » disent le même prix. Une heure « 21h30 » donne 21 et 30, et c'est voulu.
  const bruts = String(texte || "").match(/\d(?:[\d   .,]*\d)?/g) || [];
  return bruts.map((n) => n.replace(/[^\d]/g, "")).filter(Boolean);
}

/** F2 — les mois nommés d'un texte, par leur index (0 à 11). */
export function moisNommes(texte, langue) {
  const table = MOIS[langue];
  if (!table) return null;
  const vus = [];
  for (const m of mots(texte)) {
    const i = table.indexOf(m);
    if (i >= 0) vus.push(i);
  }
  return vus;
}

/** F3 — les URL et les courriels d'un texte. */
export function adresses(texte) {
  const s = String(texte || "");
  const urls = s.match(/\bhttps?:\/\/[^\s<>"')]+/gi) || [];
  const courriels = s.match(/\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g) || [];
  return [...urls.map((u) => u.replace(/[.,;:!?]+$/, "")), ...courriels];
}

/** Ce qui manque de `attendus` dans `obtenus`, en multiensemble : deux « 12 » en source en exigent deux en cible. */
function manquants(attendus, obtenus) {
  const reste = new Map();
  for (const o of obtenus) reste.set(o, (reste.get(o) || 0) + 1);
  const absents = [];
  for (const a of attendus) {
    if (reste.get(a)) reste.set(a, reste.get(a) - 1);
    else absents.push(a);
  }
  return absents;
}

/** F5 — la densité de mots-outils d'une langue dans un texte, en part des mots. */
export function densite(texte, langue) {
  const liste = new Set(MOTS_OUTILS[langue] || []);
  const m = mots(texte);
  if (!m.length) return 0;
  return m.filter((x) => liste.has(x)).length / m.length;
}

/** Juge UNE paire. Rend des constats {regle, statut, message}. */
export function jugerPaire(paire, { langueSource = "fr", langueCible, invariants = [] }) {
  const out = [];
  const { source = "", cible = "" } = paire;
  const ko = (regle, message) => out.push({ regle, statut: "FAIL", ou: paire.id, message });

  const absentsNombres = manquants(nombres(source), nombres(cible));
  if (absentsNombres.length) ko("F1", `nombre(s) de la source absent(s) de la cible : ${absentsNombres.join(", ")} — un prix, une heure ou une jauge qui change est un fait faux, quelle que soit la qualité du reste`);

  const ms = moisNommes(source, langueSource);
  const mc = moisNommes(cible, langueCible);
  if (ms && mc) {
    const perdus = manquants(ms, mc).map((i) => `${MOIS[langueSource][i]} (${MOIS[langueCible][i]} attendu)`);
    if (perdus.length) ko("F2", `mois de la source sans équivalent dans la cible : ${perdus.join(", ")} — la date garde son nombre et perd son mois`);
  }

  const absentsAdresses = manquants(adresses(source), adresses(cible));
  if (absentsAdresses.length) ko("F3", `adresse(s) de la source absente(s) ou altérée(s) dans la cible : ${absentsAdresses.join(", ")}`);

  const absentsInvariants = invariants.filter((t) => source.includes(t) && !cible.includes(t));
  if (absentsInvariants.length) ko("F4", `invariant(s) déclaré(s) présent(s) dans la source et absent(s) de la cible, à l'identique : ${absentsInvariants.join(", ")}`);

  // F5 — deux défauts distincts, deux messages : la RECOPIE (la cible est la source) et la LANGUE
  // (la cible est écrite, mais pas dans la langue demandée).
  const phrases = (t) => String(t).split(/(?<=[.!?])\s+/).map((p) => p.trim()).filter((p) => mots(p).length >= 5);
  const recopiees = phrases(source).filter((p) => cible.includes(p));
  if (recopiees.length) ko("F5", `${recopiees.length} phrase(s) de la source recopiée(s) telle(s) quelle(s) dans la cible — non traduite(s) : « ${recopiees[0].slice(0, 70)}… »`);
  else if (mots(cible).length >= 8) {
    const dc = densite(cible, langueCible), ds = densite(cible, langueSource);
    if (dc <= ds) ko("F5", `la cible ne se lit pas en « ${langueCible} » : densité de mots-outils ${(dc * 100).toFixed(0)} % contre ${(ds * 100).toFixed(0)} % pour « ${langueSource} »`);
  }

  if (!out.length) out.push({ regle: "F1-F5", statut: "PASS", ou: paire.id, message: "nombres, mois, adresses et invariants conservés ; cible écrite dans la langue demandée" });
  return out;
}

export const NON_JUGE = [
  "la FIDÉLITÉ DU SENS : ce qui est dit, ce qui est ajouté ou perdu hors des invariants mesurés. Sans référence humaine, aucune machine ne le mesure sans rendre un avis déguisé en verdict (TF-1232, troisième issue retenue)",
  "le registre, le ton et la terminologie hors des invariants déclarés : un terme de contenu mal choisi passe",
  "les nombres écrits en toutes lettres (« deux », « dois ») : F1 ne lit que les chiffres",
  "les noms propres NON déclarés dans la liste d'invariants : F4 ne juge que ce qu'on lui donne",
  "la langue d'un texte de moins de huit mots : F5 n'y mesure pas la densité, trop instable sur si peu",
];

function juger(paires, options) {
  const findings = paires.flatMap((p) => jugerPaire(p, options));
  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  return { oracle: "oracle-invariants-traduction", domaine: "Traduction : invariants et langue effective", verdict, findings, non_juge: NON_JUGE };
}

function selfTest() {
  const fr = "Concert à Ponte de Lima le 12 octobre à 21h30. Entrée 1 500,50 € par groupe de 10 personnes. Réservation sur https://exemple.org/billets ou contact@exemple.org avant le 5 octobre.";
  const pt = "Concerto em Ponte de Lima no dia 12 de outubro às 21h30. Entrada 1.500,50 € por grupo de 10 pessoas. Reserva em https://exemple.org/billets ou contact@exemple.org antes do dia 5 de outubro.";
  const opts = { langueSource: "fr", langueCible: "pt", invariants: ["Ponte de Lima"] };
  const cas = [
    ["verte : traduction fidèle aux invariants", { id: "v", source: fr, cible: pt }, null],
    ["rouge F1 : un prix changé", { id: "r1", source: fr, cible: pt.replace("1.500,50", "1.050,50") }, "F1"],
    ["rouge F2 : un mois changé", { id: "r2", source: fr, cible: pt.replace("12 de outubro", "12 de novembro") }, "F2"],
    ["rouge F3 : une adresse perdue", { id: "r3", source: fr, cible: pt.replace(" ou contact@exemple.org", "") }, "F3"],
    ["rouge F4 : un toponyme traduit", { id: "r4", source: fr, cible: pt.replace("Ponte de Lima", "Pont de Lima") }, "F4"],
    ["rouge F5 : la cible recopie la source", { id: "r5", source: fr, cible: fr }, "F5"],
    ["rouge F5 : la cible est écrite en français", { id: "r6", source: "Le concert commence à 21h30 dans la salle.", cible: "Le spectacle débute à 21h30 dans la grande salle avec les musiciens." }, "F5"],
  ];
  let echecs = 0;
  for (const [nom, paire, regleAttendue] of cas) {
    const f = jugerPaire(paire, opts);
    const fails = f.filter((x) => x.statut === "FAIL").map((x) => x.regle);
    const ok = regleAttendue ? fails.includes(regleAttendue) : fails.length === 0;
    if (!ok) echecs++;
    console.log(`  [${ok ? "PASS" : "FAIL"}] ${nom}${ok ? "" : ` — constats : ${JSON.stringify(f)}`}`);
  }
  // Les séparateurs neutralisés : « 1 500,50 » (espace fine) et « 1.500,50 » sont le même prix.
  const sep = nombres("1 500,50").join() === nombres("1.500,50").join();
  if (!sep) echecs++;
  console.log(`  [${sep ? "PASS" : "FAIL"}] F1 neutralise les séparateurs de milliers et de décimales`);
  console.log(`\noracle-invariants-traduction : ${cas.length + 1 - echecs} PASS, ${echecs} FAIL`);
  process.exit(echecs ? 1 : 0);
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) selfTest();
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const fichier = opt("--paires");
  const langueCible = opt("--langue-cible");
  const sortir = (code, corps) => { process.stdout.write(JSON.stringify(corps, null, 1) + "\n"); process.exit(code); };
  if (!fichier || !langueCible || !existsSync(fichier)) {
    sortir(2, { oracle: "oracle-invariants-traduction", artefact: fichier, verdict: "NON_JUGEABLE", findings: [],
      non_juge: ["usage : --paires <paires.json> --langue-cible <code> [--langue-source fr] [--invariants <liste.json>]"] });
  }
  if (!MOTS_OUTILS[langueCible]) sortir(2, { oracle: "oracle-invariants-traduction", artefact: fichier, verdict: "NON_JUGEABLE", findings: [], non_juge: [`langue cible « ${langueCible} » hors de la table fermée : ${Object.keys(MOTS_OUTILS).join(", ")}`] });
  const paires = JSON.parse(readFileSync(fichier, "utf8"));
  const invariants = opt("--invariants") ? JSON.parse(readFileSync(opt("--invariants"), "utf8")) : [];
  const r = juger(paires, { langueSource: opt("--langue-source") || "fr", langueCible, invariants });
  sortir(r.verdict === "FAIL" ? 1 : 0, { ...r, artefact: fichier });
}
