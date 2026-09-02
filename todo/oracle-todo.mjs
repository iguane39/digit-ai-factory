#!/usr/bin/env node
/**
 * oracle-todo.mjs — juge l'intégrité du registre TODO-FORGE (todo/TODO.jsonl + archive).
 * Contrat : JSON sur stdout {oracle, version, verdict, findings[], non_juge[]}, exit 0/1/2.
 * Règles :
 *  R1  chaque ligne est un événement JSON valide {ev: creation|maj, ts, id}
 *  R2  exactement UNE creation par id ; toute maj vient après sa creation ; id = TF-\d{4}
 *  R3  les ids ne se réutilisent jamais (unicité globale actifs + archive)
 *  R4  creation : champs requis (titre, contenu, demandeur, source, date_demande,
 *      forges_cibles_initiales non vide, score{gain,preuve,effort,valeur}) et statut=candidat
 *  R5  transitions de statut légales : candidat→decide|ecarte · decide→en_cours|corrige|ecarte
 *      · en_cours→corrige|ecarte · corrige→archive · ecarte→archive
 *  R6  candidat→decide exige decideur + date_decision (la décision est humaine, tracée)
 *  R7  clôture en corrige exige gains_constates + corrections_realisees + date_correction ;
 *  R12 clôture en corrige postérieure au 02/09/2026 14:00 Z exige `descente` (regle | oracle | digest |
 *      non_mecanisable) — une correction qui ne redescend pas chez les producteurs se rouvre (TF-0757) ;
 *      clôture en ecarte exige motif_ecart + decideur + date_decision (TF-0157, 13/08 —
 *      la mémoire des refus est structurée, une idée déjà tranchée ne se re-paye pas)
 *  R8  l'archive ne contient que des items dont l'état final est archive
 *  R9  ts non décroissants par id
 *  R10 toute creation issue d'une session externe (demandeur préfixé run-, produit- ou mission-)
 *      est couverte par un événement ingestion (les N créations précédant l'ingestion,
 *      cf. ingerer-lot.mjs) — l'écriture directe contourne l'écrivain unique (TF-0049).
 *      S'applique aux événements postérieurs au 2026-08-09T00:00:00Z : les 7 créations
 *      du 08/08 (TF-0042..48) précèdent la règle et le circuit de remise, constat consigné.
 *  R11 aucun `ts` POSTÉRIEUR à l'heure d'exécution — un horodatage qui n'est pas encore
 *      arrivé n'a pas été mesuré, il a été composé (TF-0413, 20/08).
 *  R9 bis — RECTIFICATION DÉCLARÉE d'un horodatage (TF-0413, patron R-42/TF-0410). Un
 *      événement `ev: "rectification_horodatage"` porte `entrees: [{id, ts_consigne,
 *      ts_reel_estime, cause}]` : R9 se juge alors sur `ts_reel_estime`, et l'écart s'IMPRIME
 *      `[RECTIFIÉ]` au verdict. L'histoire ne se réécrit pas — on rectifie par AJOUT.
 *      Bornes, qui empêchent ce mécanisme de devenir un effaceur : la déclaration ne couvre que
 *      des événements qui la PRÉCÈDENT dans le fichier ; `ts_consigne` doit correspondre
 *      EXACTEMENT à un ts porté par l'id visé, sinon elle ne couvre rien et le dit ; les quatre
 *      champs sont dus ; elle n'agit QUE sur l'horodatage — transitions, champs de clôture et
 *      couverture d'ingestion restent jugés comme avant.
 *
 * R11, le fait qui la fait naître. Mesuré le 20/08 en rapprochant chaque commit touchant
 * `todo\TODO.jsonl` du dernier `ts` qu'il ajoute : les événements écrits par l'OUTILLAGE
 * (`ingerer-lot.mjs`, `ts` porteur de millisecondes) collent au commit à la minute près
 * (0, 0, -1, -4 min) ; ceux composés À LA MAIN (minute pleine, secondes `:00Z`) sont
 * systématiquement EN AVANCE — +449, +386, +353, +314, +308, +299, +259, +190, +180, +173
 * minutes sur six jours. Aucun n'est en retard : ce n'est pas une horloge qui dérive, c'est
 * une heure qu'on invente. Conséquence : aucune durée n'est calculable au registre (délai
 * candidat→décidé, cadence d'un lot) et le rapprochement registre↔git est faux par
 * construction. R11 CONSTATE le défaut ; `todo\journaliser.mjs` en supprime la CAUSE en
 * stampant le `ts` — les deux se cumulent, le contrôle ne remplace pas l'outil.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
// Les drapeaux ne sont pas des chemins : sans ce tri, `--rectifications` était lu comme le
// fichier des actifs, et l oracle rendait un PASS sur un registre VIDE — un faux vert.
const positionnels = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const actifs = positionnels[0] || join(ICI, "TODO.jsonl");
const archive = positionnels[1] || join(ICI, "TODO-ARCHIVE.jsonl");
const findings = [];
// Les rectifications declarees s'IMPRIMENT : un ecart couvert cesse de bloquer, il ne
// disparait jamais du rapport (patron R-42, TF-0410/TF-0411).
const notes = [];
const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
const ok = (regle, message) => findings.push({ regle, statut: "PASS", ou: "-", message });

const TRANSITIONS = {
  candidat: ["decide", "ecarte"], decide: ["en_cours", "corrige", "ecarte"],
  en_cours: ["corrige", "ecarte"], corrige: ["archive"], ecarte: ["archive"], archive: [],
};

function lire(fichier) {
  if (!existsSync(fichier)) return [];
  return readFileSync(fichier, "utf8").split("\n").filter((l) => l.trim()).map((l, i) => {
    try { return { ligne: i + 1, ...JSON.parse(l) }; }
    catch { ko("R1", `${fichier}:${i + 1}`, "ligne non-JSON"); return null; }
  }).filter(Boolean);
}

const SEUIL_R10 = "2026-08-09T00:00:00Z";
const SEUIL_R7_ECART = "2026-08-13T00:00:00Z"; // naissance de TF-0157
const SEUIL_R12_DESCENTE = "2026-09-02T14:00:00Z"; // TF-0757 : les clôtures antérieures restent de la prose, déclaré
// R11 : entrée en vigueur POSTÉRIEURE au dernier horodatage inventé du registre
// (2026-08-20T18:21:00Z) — les événements en deçà sont l'antériorité que TF-0413 a mesurée,
// jamais réécrite (patron R-42 : on ne corrige pas l'histoire, on cesse d'en produire).
// Le seuil est surchargeable par `TODO_SEUIL_R11` — POUR LA RECETTE, et pour elle seule :
// tant que l'horloge réelle n'a pas dépassé le seuil de naissance, aucune fixture ne peut
// démontrer le sens VERT de la règle (un ts au-dessus du seuil et pourtant pas dans le
// futur). Une surcharge n'éteint pas la règle et ne passe pas inaperçue : elle est ANNONCÉE
// dans le `non_juge` du verdict, donc lisible par quiconque relit le rapport.
const SEUIL_R11_DEFAUT = "2026-08-20T18:30:00Z";
const SEUIL_R11 = process.env.TODO_SEUIL_R11 || SEUIL_R11_DEFAUT;
// Tolérance d'horloge, pas une licence : deux minutes couvrent le décalage d'un poste, pas
// les 3 à 7 heures d'avance mesurées.
const TOLERANCE_R11_MS = 120000;
const MAINTENANT = Date.now();
const RE_EXTERNE = /^(run|produit|mission)-/;

/**
 * Rectifications déclarées : clé `id|ts_consigne` → { reel, cause }. Une déclaration ne vaut
 * que pour ce qui la précède — on ne se dédouane pas d'avance — et son `ts_consigne` doit
 * coller à l'histoire, sinon elle ne couvre rien.
 */
function collecterRectifications(evenements, ou) {
  const carte = new Map();
  const vus = new Set(); // `id|ts` déjà rencontrés dans le fichier, en amont
  for (const e of evenements) {
    if (e.ev !== "rectification_horodatage") { if (e.id && e.ts) vus.add(`${e.id}|${e.ts}`); continue; }
    const entrees = Array.isArray(e.entrees) ? e.entrees : null;
    if (!entrees || !entrees.length) { ko("R9", `${ou}:${e.ligne}`, "rectification sans `entrees` — rien de déclaré, rien de couvert"); continue; }
    for (const d of entrees) {
      const manquants = ["id", "ts_consigne", "ts_reel_estime", "cause"].filter((c) => !d || !d[c]);
      if (manquants.length) {
        ko("R9", `${ou}:${e.ligne}`, `rectification incomplète (${manquants.join(", ")} absent(s)) — une déclaration incomplète est un écart, jamais une couverture`);
        continue;
      }
      const cle = `${d.id}|${d.ts_consigne}`;
      if (!vus.has(cle)) {
        ko("R9", `${ou}:${e.ligne} (${d.id})`, `rectification sans cible ANTÉRIEURE : aucun événement ${d.id} au ts ${d.ts_consigne} avant cette ligne — on ne rectifie pas ce qui n'est pas écrit, et on ne se dédouane pas d'avance`);
        continue;
      }
      carte.set(cle, { reel: d.ts_reel_estime, cause: String(d.cause) });
    }
  }
  return carte;
}

function replier(evenements, ou) {
  const rectifs = collecterRectifications(evenements, ou);
  const rectifiesVus = new Set();
  const etats = new Map();
  const creationsRecentes = []; // fenêtre pour la couverture d'ingestion (R10)
  const externesNonCouvertes = [];
  for (const e of evenements) {
    // R11 — avant tout le reste : un ts inventé fausse aussi R9 et les seuils datés.
    if (typeof e.ts === "string" && e.ts >= SEUIL_R11) {
      const t = Date.parse(e.ts);
      if (Number.isFinite(t) && t > MAINTENANT + TOLERANCE_R11_MS) {
        const avance = Math.round((t - MAINTENANT) / 60000);
        ko("R11", `${ou}:${e.ligne}${e.id ? ` (${e.id})` : ""}`,
          `ts postérieur à l'heure d'exécution de ${avance} min (${e.ts}) — un horodatage ` +
          "qui n'est pas encore arrivé n'a pas été mesuré : passer par todo\\journaliser.mjs, " +
          "qui stampe le ts (TF-0413)");
      }
    }
    if (e.ev === "rectification_horodatage") continue; // jugée par collecterRectifications
    // Horodatage EFFECTIF : le réel estimé quand une rectification déclarée le remplace.
    const rect = e.id && e.ts ? rectifs.get(`${e.id}|${e.ts}`) : null;
    if (rect) rectifiesVus.add(`${e.id}|${e.ts}`);
    const tsEffectif = rect ? rect.reel : e.ts;
    if (e.ev === "ingestion") {
      if (!e.lot_sha) ko("R1", `${ou}:${e.ligne}`, "ingestion sans lot_sha");
      // l'ingestion couvre les N créations qui la précèdent immédiatement
      // (garde : splice(-0) viderait tout — une ingestion sans creations ne couvre rien)
      if (e.creations > 0) for (const c of creationsRecentes.splice(-e.creations)) {
        const i = externesNonCouvertes.indexOf(c);
        if (i >= 0) externesNonCouvertes.splice(i, 1);
      }
      continue;
    }
    if (!e.id || !/^TF-\d{4}$/.test(e.id)) { ko("R2", `${ou}:${e.ligne}`, `id invalide : ${e.id}`); continue; }
    if (e.ev === "creation") {
      if (etats.has(e.id)) { ko("R2", e.id, "seconde creation pour le même id"); continue; }
      for (const champ of ["titre", "contenu", "demandeur", "source", "date_demande"])
        if (!e[champ]) ko("R4", e.id, `creation sans ${champ}`);
      if (!Array.isArray(e.forges_cibles_initiales) || !e.forges_cibles_initiales.length)
        ko("R4", e.id, "creation sans forges_cibles_initiales");
      if (!e.score || [e.score.gain, e.score.preuve, e.score.effort, e.score.valeur].some((v) => typeof v !== "number"))
        ko("R4", e.id, "creation sans score complet {gain, preuve, effort, valeur}");
      if (e.statut !== "candidat") ko("R4", e.id, `creation en statut ${e.statut} — tout entre en candidat`);
      creationsRecentes.push(e.id);
      if (RE_EXTERNE.test(e.demandeur || "") && e.ts >= SEUIL_R10) externesNonCouvertes.push(e.id);
      etats.set(e.id, { ...e, ts: tsEffectif });
    } else if (e.ev === "maj") {
      const etat = etats.get(e.id);
      if (!etat) { ko("R2", `${ou}:${e.ligne}`, `maj sans creation préalable pour ${e.id}`); continue; }
      if (tsEffectif < etat.ts) {
        ko("R9", e.id, `ts décroissant (${tsEffectif}${rect ? ` [RECTIFIÉ depuis ${e.ts}]` : ""} après ${etat.ts})`);
      }
      if (e.statut && e.statut !== etat.statut) {
        const legales = TRANSITIONS[etat.statut] || [];
        if (!legales.includes(e.statut))
          ko("R5", e.id, `transition illégale ${etat.statut} → ${e.statut}`);
        if (e.statut === "decide" && !(e.decideur || etat.decideur))
          ko("R6", e.id, "passage en decide sans decideur — la décision est humaine et tracée");
        if (e.statut === "corrige") {
          const fusion = { ...etat, ...e };
          for (const champ of ["gains_constates", "corrections_realisees", "date_correction"])
            if (!fusion[champ]) ko("R7", e.id, `clôture en corrige sans ${champ}`);
        }
        // TF-0157 (13/08) : un écart sans motif structuré est une mémoire perdue — la
        // ré-instruction se re-paye à chaque réouverture. Symétrique de R6 pour decide.
        // Datée comme R10 : les 5 écarts antérieurs (TF-0003/13/41 du 11/08, TF-0129/130
        // du 12/08) précèdent la règle — constat consigné, jamais réécrits.
        // R12 (TF-0757, 02/09/2026) — UNE CORRECTION CLOSE SANS DESCENTE SE ROUVRE. Trois récidives
        // en quatre jours sur un seul projet : les retours MONTENT au registre et ne REDESCENDENT pas
        // sous une forme qu'un producteur rencontre au moment où il produit — un registre de
        // candidatures n'est pas une redescente. Toute clôture en corrige postérieure au seuil porte
        // donc `descente` : la règle générique écrite au socle ou au gabarit (`regle`), l'oracle
        // qui la contrôle (`oracle`), la ligne du digest hérité par les produits (`digest`), ou
        // l'énoncé explicite qu'elle n'est pas mécanisable et pourquoi (`non_mecanisable`). Une
        // correction qui vit dans le registre du pilot et nulle part chez le producteur n'est pas
        // câblée (loi transverse n° 1).
        if (e.statut === "corrige" && tsEffectif >= SEUIL_R12_DESCENTE) {
          const d = { ...etat, ...e }.descente;
          const porte = d && typeof d === "object" && ["regle", "oracle", "digest", "non_mecanisable"].some((k) => typeof d[k] === "string" && d[k].trim().length >= 10);
          if (!porte) ko("R12", e.id, "clôture en corrige sans `descente` — nommer la règle, l'oracle ou le digest par lequel la correction REDESCEND chez les producteurs, ou déclarer non_mecanisable avec son motif (TF-0757)");
        }
        if (e.statut === "ecarte" && e.ts >= SEUIL_R7_ECART) {
          const fusion = { ...etat, ...e };
          for (const champ of ["motif_ecart", "decideur", "date_decision"])
            if (!fusion[champ]) ko("R7", e.id, `clôture en ecarte sans ${champ} (TF-0157)`);
        }
      }
      Object.assign(etat, e, { ts: tsEffectif });
    } else ko("R1", `${ou}:${e.ligne}`, `ev inconnu : ${e.ev}`);
  }
  for (const [cle, r] of rectifs) {
    if (!rectifiesVus.has(cle)) continue; // déjà signalé à la collecte s'il n'a pas de cible
    notes.push(`[RECTIFIÉ] ${cle.split("|")[0]} : ts consigné ${cle.split("|")[1]} → réel estimé ${r.reel} — ${r.cause}`);
  }
  for (const id of externesNonCouvertes)
    ko("R10", id, "creation de session externe sans événement ingestion — l'écriture directe contourne l'écrivain unique (passer par un sidecar + ingerer-lot.mjs)");
  return etats;
}

const etatsActifs = replier(lire(actifs), "TODO.jsonl");
const etatsArchive = replier(lire(archive), "TODO-ARCHIVE.jsonl");
for (const id of etatsActifs.keys())
  if (etatsArchive.has(id)) ko("R3", id, "id présent dans les actifs ET l'archive");
for (const [id, e] of etatsArchive)
  if (e.statut !== "archive") ko("R8", id, `dans l'archive avec statut ${e.statut}`);

if (!findings.some((f) => f.statut === "FAIL")) {
  ok("R1-R11", `${etatsActifs.size} item(s) actif(s), ${etatsArchive.size} archivé(s) — registre intègre`
    + (notes.length ? ` ; ${notes.length} horodatage(s) RECTIFIÉ(s) par déclaration — ${notes.slice(0, 3).join(" · ")}${notes.length > 3 ? ` · … (${notes.length - 3} de plus, tous imprimés par --rectifications)` : ""}` : ""));
}
// `--rectifications` : la liste ENTIÈRE des écarts couverts par déclaration. Le résumé en
// borne l affichage à trois ; ce drapeau existe pour que « … et N de plus » soit toujours
// dépliable — une note qu on ne peut pas lire équivaut à une note effacée.
if (process.argv.includes("--rectifications")) {
  for (const n of notes) console.error(n);
  if (!notes.length) console.error("aucune rectification déclarée");
}
const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({
  oracle: "oracle-todo", version: "1.2.0", verdict: echecs ? "FAIL" : "PASS", findings,
  non_juge: [
    "la pertinence des scores (gain/effort) est un jugement humain, pas une règle",
    "la véracité des gains_constates n'est pas vérifiée dans le monde — seule leur présence l'est",
    "R11 ne juge que l'AVANCE sur l'heure d'exécution : un ts en RETARD (antidaté) reste hors de portée, comme un ts faux mais plausible — seul l'impossible est refusé",
    `R11 : les événements antérieurs au ${SEUIL_R11} ne sont pas jugés (antériorité mesurée par TF-0413) ; un ts inventé DANS cette fenêtre lui échappe, et c'est assumé plutôt que de mettre en échec un registre entier (R-33 bis)`,
    ...(SEUIL_R11 === SEUIL_R11_DEFAUT ? [] : [`R11 : seuil SURCHARGÉ par TODO_SEUIL_R11 (${SEUIL_R11} au lieu de ${SEUIL_R11_DEFAUT}) — verdict rendu sous un seuil qui n'est pas celui du registre`]),
  ],
}, null, 1));
process.exit(echecs ? 1 : 0);
