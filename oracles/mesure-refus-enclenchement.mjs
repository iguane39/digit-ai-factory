#!/usr/bin/env node
/**
 * mesure-refus-enclenchement.mjs — COMBIEN DE CLÔTURES LE JUGE D'ENCLENCHEMENT AURAIT-IL REFUSÉES,
 * ET COMBIEN À TORT ? (TF-1319, décision humaine D-5 (b) du 17/10/2026.)
 *
 * ============================================================================================
 * LA DÉCISION QUI FAIT NAÎTRE CETTE MESURE
 * ============================================================================================
 *
 * D-5 (b) : construire l'outil qui consigne un verdict par contrôle (`ledger.mjs consigner`, chez
 * forge-agents), et garder le juge d'enclenchement (`oracle-enclenchement.mjs`) INFORMATIF jusqu'à
 * ce que ses refus à tort soient mesurés sur plusieurs runs. Le motif : sur les deux seuls runs
 * réels qui le subissaient, le juge rendait FAIL parce qu'un lanceur y était consigné en UNE entrée
 * — un regroupement, pas un oubli. Un juge des juges qui accuse à tort se fait contourner (étude du
 * 19/08, §5) : on ne l'arme qu'après avoir compté ce qu'il aurait bloqué, et pourquoi.
 *
 * Cette mesure ne rend PAS le juge bloquant et ne décide PAS du seuil : elle compte. Le passage en
 * bloquant reste une décision humaine, prise sur ses chiffres.
 *
 * ============================================================================================
 * CE QUI EST COMPTÉ, RUN CLOS PAR RUN CLOS
 * ============================================================================================
 *
 * Un run = un `run_open` et ce qui le suit jusqu'au suivant (même découpage que le juge). Seuls les
 * runs CLOS (un `run_close`) sont des clôtures que le juge aurait pu refuser. Pour chacun :
 *   · `verdict_cloture` — le verdict que le juge a rendu À LA CLÔTURE, s'il est consigné au run
 *     (`oracles_verdict` nommant `oracle-enclenchement`) : c'est l'histoire, elle prime ;
 *   · `verdict_rejoue` — le juge rejoué AUJOURD'HUI sur le même run (promesse lue à la version que
 *     le run a consignée, comme le juge le fait toujours) : sert quand la clôture ne l'a pas joué ;
 *   · `aurait_refuse` — le verdict retenu (clôture, sinon rejoué) est FAIL ;
 *   · `avec_outil` — le run a consigné au moins un verdict par `ledger.mjs consigner`
 *     (`consigne_par`). LA POPULATION QUI COMPTE EST CELLE-LÀ : un run antérieur à l'outil échoue
 *     par regroupement, et le compter mêlerait le défaut que l'outil corrige à celui du juge ;
 *   · `qualification` — le jugement porté sur un refus, consigné au run par une entrée
 *     `type: qualification_enclenchement` : `qualification: "fonde" | "a_tort"` et sa `cause`
 *     (la dernière du run prime). « fonde » : un contrôle dû n'a pas tourné, ou son verdict n'a pas
 *     été consigné. « a_tort » : le run était complet et bloquer sa clôture aurait été une erreur —
 *     promesse mal lue, nom servi non reconnu, forge mobilisée mal déclarée par l'outillage… Le
 *     juge ne se qualifie pas lui-même : la machine ne sait pas distinguer un oubli d'une erreur
 *     de juge, c'est précisément ce qu'on mesure ;
 *   · `indices` — ce que la machine VOIT sans trancher : `regroupement` quand le juge rejoué trouve
 *     les oracles manquants CITÉS par une entrée qui ne les sert pas (le défaut d'avant l'outil) ;
 *     `forge_sans_aucun_verdict:<forges>` quand une forge mobilisée n'a AUCUN de ses oracles promis
 *     au ledger — mobilisée pour un outil plutôt que pour ses oracles, ou oubliée en entier ;
 *   · `promesses_bornees` — quand le run déclare les parties qu'il mobilise d'une forge-outil
 *     (`parties_mobilisees`, TF-1841), la borne que le juge a appliquée : parties, oracles promis,
 *     oracles découverts. Un run sans déclaration est mesuré sur la promesse entière.
 *
 * Totaux, pour tous les runs clos, ceux AVEC l'outil et ceux SANS : runs clos, runs jugés (PASS ou
 * FAIL), refus, refus qualifiés à tort, fondés, non qualifiés, et `taux_refus_a_tort` = à tort /
 * qualifiés — `null` tant qu'aucun refus n'est qualifié, jamais 0 par défaut.
 *
 * ============================================================================================
 * CE QUI N'EST PAS COMPTÉ — DIT, JAMAIS TU
 * ============================================================================================
 *
 *   · un run qui ne déclare pas `schema_ledger` précède le schéma : compté « antérieur », jamais
 *     jugé (le juge rend SKIP, motif dit) ;
 *   · un run non clos n'est pas une clôture ;
 *   · deux runs du même ledger au même identifiant : le juge ne sait rejouer que le premier, le
 *     second sort « non rejouable », avec son verdict de clôture s'il en a un ;
 *   · la JUSTESSE d'une qualification : elle est consignée par le run, cette mesure la lit.
 *
 * Usage : node oracles\mesure-refus-enclenchement.mjs [<ledger.jsonl> …] [--produits <dossier>]
 *           [--racine <racine-du-parc>]
 *   sans ledger nommé : chaque `<dossier>\*\forge\ledger.jsonl`, hors dépôts `digit-ai-*` ;
 *   `--produits` : où chercher (défaut : la racine du parc) ; `--racine` : comme le juge.
 * Sortie : JSON sur stdout, résumé d'une ligne sur stderr. Exit 0 : mesure faite (une population
 * vide est un résultat) · 2 : aucun ledger lisible. Jamais 1 : mesurer n'est pas juger. N'écrit rien.
 *
 * Recette à double sens : `oracles\mesure-refus-enclenchement.test.mjs`.
 */
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { juger, lireLedger, segmentsDeRun, nomNormalise, racineParDefaut, ORACLE as JUGE } from "./oracle-enclenchement.mjs";

export const OUTIL = "mesure-refus-enclenchement";
export const VERSION = "1.0.0";
export const TYPE_QUALIFICATION = "qualification_enclenchement";
export const QUALIFICATIONS = { fonde: "fonde", "fondé": "fonde", a_tort: "a_tort", "à_tort": "a_tort", "a tort": "a_tort", "à tort": "a_tort" };
//: La marque que `ledger.mjs consigner` (forge-agents) pose sur chaque entrée qu'il écrit.
export const MARQUE_CONSIGNER = "ledger.mjs consigner";

export const NON_JUGE = [
  "la JUSTESSE d'une qualification : elle est consignée par le run (`qualification_enclenchement`), cette mesure la lit sans la refaire",
  "le seuil de passage en bloquant : il se DÉCIDE (D-5 (b) du 17/10/2026), cette mesure ne fait que compter",
  "un run non clos : ce n'est pas une clôture que le juge aurait pu refuser",
];

const nonVide = (v) => (typeof v === "string" ? v.trim() !== "" : v !== undefined && v !== null);
//: Même identité de run que le juge (`idDeRun`, non exportée par lui) : le champ `run`, sinon le seq.
const idDeRun = (runOpen) => (nonVide(runOpen.run) ? String(runOpen.run) : `seq ${runOpen.seq}`);

/** Les ledgers de produits sous un dossier : `<dossier>/<produit>/forge/ledger.jsonl`, hors `digit-ai-*`. */
export function ledgersDesProduits(dossier) {
  let entrees = [];
  try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return []; }
  return entrees
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !/^digit-ai-/.test(e.name))
    .map((e) => join(dossier, e.name, "forge", "ledger.jsonl"))
    .filter((p) => existsSync(p))
    .sort();
}

/** La dernière qualification VALIDE du run, et les invalides (dites, jamais appliquées). */
export function qualificationDuRun(entrees) {
  const toutes = entrees.filter((e) => e && e.type === TYPE_QUALIFICATION);
  const invalides = [];
  let retenue = null;
  for (const q of toutes) {
    const cle = typeof q.qualification === "string" ? QUALIFICATIONS[q.qualification.trim().toLowerCase()] : null;
    if (!cle || !nonVide(q.cause)) { invalides.push(q.seq); continue; }
    retenue = { qualification: cle, cause: q.cause, seq: q.seq, ...(Array.isArray(q.oracles) ? { oracles: q.oracles } : {}) };
  }
  return { retenue, invalides };
}

/** Le verdict du juge consigné AU RUN (le dernier), ou null. */
export function verdictALaCloture(entrees) {
  const v = entrees.filter((e) => e && e.type === "oracles_verdict" && nomNormalise(e.oracle) === JUGE && nonVide(e.verdict)).pop();
  return v ? { verdict: String(v.verdict).trim().toUpperCase(), seq: v.seq } : null;
}

/** La mesure d'UN run clos. */
export function mesurerRun(ledger, segment, { racine, rejouable = true } = {}) {
  const run = idDeRun(segment.run_open);
  const ligne = { ledger, run, schema_ledger: segment.run_open.schema_ledger ?? null };
  const consignesParOutil = segment.entrees.filter((e) => e && e.type === "oracles_verdict" && e.consigne_par === MARQUE_CONSIGNER).length;
  ligne.avec_outil = consignesParOutil > 0;
  ligne.entrees_consignees_par_outil = consignesParOutil;
  if (!nonVide(segment.run_open.schema_ledger)) {
    return { ...ligne, statut: "anterieur", motif: "le run_open ne déclare pas `schema_ledger` : le run précède le schéma, le juge ne le juge pas" };
  }
  const cloture = verdictALaCloture(segment.entrees);
  ligne.verdict_cloture = cloture ? cloture.verdict : null;
  if (cloture) ligne.verdict_cloture_seq = cloture.seq;
  ligne.verdict_rejoue = null;
  ligne.indices = [];
  if (rejouable) {
    const r = juger({ ledger, run, racine });
    ligne.verdict_rejoue = r.verdict;
    if (r.verdict === "SKIP" && r.motif) ligne.motif_rejoue = r.motif;
    const en1 = (r.findings || []).filter((f) => f.regle === "EN1" && f.statut === "FAIL");
    if (en1.length) ligne.manquants = Object.fromEntries(en1.map((f) => [f.forge, f.manquants || []]));
    if (en1.some((f) => f.cites_sans_etre_servis && Object.keys(f.cites_sans_etre_servis).length)) ligne.indices.push("regroupement");
    // Une forge dont AUCUN oracle promis n'a de verdict : mobilisée pour un outil (le journal de
    // forge-agents, par exemple) plutôt que pour ses oracles, ou oubliée en entier. Mesuré le
    // 17/10/2026 sur les 7 runs jugés du parc : forge-agents y promet jusqu'à 48 oracles.
    // TF-1841 : la promesse comptée est celle que le juge a retenue — BORNÉE aux parties déclarées
    // quand le run en déclare (`parties_mobilisees`), entière sinon. La borne est relevée à la ligne.
    if (r.mesures && r.mesures.promesses_bornees) ligne.promesses_bornees = r.mesures.promesses_bornees;
    const promesses = (r.mesures && r.mesures.promesses) || {};
    const entieres = en1.filter((f) => Number.isInteger(promesses[f.forge]) && promesses[f.forge] > 0
      && (f.manquants || []).length + Object.keys(f.suspendus || {}).length >= promesses[f.forge]).map((f) => f.forge);
    if (entieres.length) ligne.indices.push(`forge_sans_aucun_verdict:${entieres.join(",")}`);
  } else {
    ligne.motif_rejoue = `un autre run du même ledger porte l'identifiant « ${run} » : le juge ne sait rejouer que le premier`;
  }
  const retenu = ligne.verdict_cloture || ligne.verdict_rejoue;
  ligne.verdict_retenu = retenu;
  ligne.source_verdict = ligne.verdict_cloture ? "cloture" : retenu ? "rejoue" : null;
  ligne.juge = retenu === "PASS" || retenu === "FAIL";
  ligne.aurait_refuse = retenu === "FAIL";
  const { retenue, invalides } = qualificationDuRun(segment.entrees);
  ligne.qualification = retenue ? retenue.qualification : null;
  if (retenue) { ligne.qualification_cause = retenue.cause; ligne.qualification_seq = retenue.seq; }
  if (invalides.length) ligne.qualifications_ignorees = invalides;
  if (retenue && !ligne.aurait_refuse) ligne.qualification_sans_refus = true;
  return { ...ligne, statut: "mesure" };
}

/** Les totaux d'une population de runs clos. */
export function totaux(lignes) {
  const mesures = lignes.filter((l) => l.statut === "mesure");
  const refus = mesures.filter((l) => l.aurait_refuse);
  const aTort = refus.filter((l) => l.qualification === "a_tort").length;
  const fondes = refus.filter((l) => l.qualification === "fonde").length;
  return {
    runs_clos: lignes.length,
    anterieurs_au_schema: lignes.filter((l) => l.statut === "anterieur").length,
    juges: mesures.filter((l) => l.juge).length,
    non_juges: mesures.filter((l) => !l.juge).length,
    refus: refus.length,
    refus_a_tort: aTort,
    refus_fondes: fondes,
    refus_non_qualifies: refus.length - aTort - fondes,
    taux_refus_a_tort: aTort + fondes ? Math.round((aTort / (aTort + fondes)) * 1000) / 1000 : null,
  };
}

/** La mesure sur une liste de ledgers. */
export function mesurer({ ledgers, racine = racineParDefaut() } = {}) {
  const nonJuge = [...NON_JUGE];
  const lignes = [];
  const illisibles = [];
  for (const ledger of ledgers) {
    let lu;
    try { lu = lireLedger(ledger); } catch (e) { illisibles.push(`${ledger} : ${e.message}`); continue; }
    if (lu.illisibles.length) nonJuge.push(`${ledger} : ${lu.illisibles.length} ligne(s) en JSON invalide, ni lues ni comptées`);
    const segments = segmentsDeRun(lu.entrees);
    const vus = new Set();
    for (const s of segments) {
      const id = idDeRun(s.run_open);
      const rejouable = !vus.has(id);
      vus.add(id);
      if (!s.entrees.some((e) => e && e.type === "run_close")) continue;
      lignes.push(mesurerRun(ledger, s, { racine, rejouable }));
    }
  }
  if (illisibles.length) nonJuge.push(`ledger(s) illisible(s), non comptés : ${illisibles.join(" ; ")}`);
  return {
    outil: OUTIL,
    version: VERSION,
    racine,
    ledgers: ledgers.length - illisibles.length,
    totaux: {
      tous: totaux(lignes),
      avec_outil: totaux(lignes.filter((l) => l.avec_outil)),
      sans_outil: totaux(lignes.filter((l) => !l.avec_outil)),
    },
    runs: lignes,
    non_juge: nonJuge,
  };
}

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().split("\\").join("/")
     === resolve(process.argv[1]).toLowerCase().split("\\").join("/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const AVEC_VALEUR = ["--produits", "--racine"];
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : null; };
  const racine = valeur("--racine") ? resolve(valeur("--racine")) : racineParDefaut();
  const nommes = args.filter((a, i) => !a.startsWith("--") && !AVEC_VALEUR.includes(args[i - 1])).map((a) => resolve(a));
  const ledgers = nommes.length ? nommes : ledgersDesProduits(valeur("--produits") ? resolve(valeur("--produits")) : racine);
  const r = mesurer({ ledgers, racine });
  console.log(JSON.stringify(r, null, 1));
  const t = r.totaux;
  console.error(`${OUTIL} : ${r.ledgers} ledger(s), ${t.tous.runs_clos} run(s) clos — `
    + `avec l'outil : ${t.avec_outil.refus} refus sur ${t.avec_outil.juges} jugé(s), ${t.avec_outil.refus_a_tort} à tort, ${t.avec_outil.refus_non_qualifies} non qualifié(s) ; `
    + `sans l'outil : ${t.sans_outil.refus} refus sur ${t.sans_outil.juges} jugé(s)`);
  process.exit(r.ledgers ? 0 : 2);
}
