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
 *  R13 (03/09/2026, mandat d'amélioration continue) toute `classe` portée par une création
 *      est une clé de todo/CLASSES.json (FAIL sinon : une clé hors référentiel ne se compte pas) ;
 *      toute création marquée `recidive_de` est SIGNALÉE — statut AVERT, jamais FAIL : la
 *      récidive est une mesure de la descente, refuser le registre qui la porte la cacherait.
 *      Entre avertissante (doctrine v2.5.0 de RESTITUTION.md) : se durcira sur corpus propre.
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
const avert = (regle, ou, message) => findings.push({ regle, statut: "AVERT", ou, message });
let recidivesVues = 0, classesVues = 0;

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
// R14 (TF-0956) : un DOUBLON STRICT (titre ET contenu identiques à une création antérieure) entré
// après ce seuil sans être écarté ni marqué `doublon_de` est un FAIL. Mesuré au 14/09 : 11 groupes
// de doublons stricts (dont les six du 08/09) existent avant lui — antériorité DÉCLARÉE et comptée.
const SEUIL_R14 = process.env.TODO_SEUIL_R14 || "2026-09-14T12:00:00Z";
// R13 : le référentiel de classes — surchargeable par --classes pour la recette.
const iClasses = process.argv.indexOf("--classes");
const CLASSES_PATH = iClasses > 0 ? process.argv[iClasses + 1] : join(ICI, "CLASSES.json");
let CLASSES = null;
let CLASSES_BRUTES = null;
try {
  CLASSES_BRUTES = JSON.parse(readFileSync(CLASSES_PATH, "utf8")).classes || [];
  CLASSES = new Set(CLASSES_BRUTES.map((c) => c.cle));
} catch { CLASSES = null; CLASSES_BRUTES = null; }
// R15 (D-3 (c), décision humaine du 16/09/2026) — UNE CLASSE FERMÉE SANS PORTEUR EXÉCUTABLE
// N'EST PAS UNE PROTECTION, C'EST UNE INTENTION.
//
// LE FAIT, et c'est la question que l'humain a posée le 15/09 : « pourquoi ces défauts arrivent
// encore ». Mesure du 16/09 sur les 86 familles du référentiel — 56 nomment un contrôle qui
// EXISTE, 30 nomment un contrôle « à créer ». Un producteur ne rencontre nulle part une famille
// dont le juge reste à écrire : elle est fermée au registre et absente de son chemin.
//
// POURQUOI UN CLIQUET ET NON UN REFUS. Refuser les 30 d'un coup mettrait un tiers du référentiel
// au rouge du jour au lendemain, et la leçon N4 du noyau dit ce qui arrive ensuite — le contrôle
// est désactivé dans la semaine. Le cliquet arrête l'hémorragie d'abord : une famille CRÉÉE à
// partir du seuil nomme un juge qui existe, ou elle ne se crée pas. Les 30 antérieures sont
// DÉCLARÉES et comptées au `non_juge`, jamais mises à zéro ni tues — elles se résorbent au rythme
// des corrections qui les fondent.
const SEUIL_R15 = process.env.TODO_SEUIL_R15 || "2026-09-16";
// Un oracle « à créer », « aucun », vide ou réduit à un tiret n'est pas un porteur exécutable.
// La liste est COURTE et écrite : deviner par heuristique classerait mal, et un classement faux
// sur un cliquet bloquant coûte plus qu'un classement absent.
const SANS_PORTEUR = /^\s*(?:$|-\s*$|(?:à|a)\s*cr[ée]er\b|aucun\b|n[ée]ant\b|non\s+m[ée]canis)/i;
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
      // R13 — classe hors référentiel : FAIL ; récidive marquée : AVERT (mesure, pas défaut du registre)
      if (e.classe) {
        classesVues++;
        if (CLASSES === null) ko("R13", e.id, `classe « ${e.classe} » portée mais référentiel ${CLASSES_PATH} illisible — une clé ne se juge pas sans référentiel`);
        else if (!CLASSES.has(String(e.classe))) ko("R13", e.id, `classe « ${e.classe} » absente de todo/CLASSES.json — une clé hors référentiel ne se compte pas ; la créer dans le référentiel (datée, sourcée) ou corriger la création par rectification`);
      }
      if (Array.isArray(e.recidive_de) && e.recidive_de.length) {
        recidivesVues++;
        avert("R13", e.id, `RÉCIDIVE de ${e.recidive_de.join(", ")} (classe « ${e.classe} ») — la descente n'a pas tenu chez « ${e.demandeur} » ; à lire au tableau de bord todo/RECIDIVES.md, jamais à effacer`);
      }
      etats.set(e.id, { ...e, ts: tsEffectif, ts_creation: tsEffectif });
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

// R14 (TF-0956, 14/09/2026) — UN DOUBLON STRICT NE COMPTE PAS COMME UN ITEM. Le 08/09, six
// candidatures identiques mot pour mot à six autres sont entrées en une commande, et aucune règle
// n'a bronché. Le statut `ecarte` (R5, R7 : motif obligatoire) existe pour les sortir des mesures ;
// un doublon qui ne le porte pas, ni `doublon_de`, fausse chaque compte d'items ouverts.
const normTexte = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
const parEmpreinte = new Map();
let r14Anterieurs = 0;
for (const [id, e] of [...etatsActifs, ...etatsArchive].sort((a, b) => a[0].localeCompare(b[0]))) {
  const cle = `${normTexte(e.titre)} | ${normTexte(e.contenu)}`;
  const premier = parEmpreinte.get(cle);
  if (!premier) { parEmpreinte.set(cle, id); continue; }
  if (String(e.ts_creation || "") < SEUIL_R14) { r14Anterieurs++; continue; }
  if (e.statut === "ecarte" || e.doublon_de) continue;
  ko("R14", id, `titre ET contenu identiques à ${premier} — doublon strict entré sans être écarté : le passer en ecarte (motif_ecart, R7) ou le marquer doublon_de, sans quoi il compte comme un item ouvert de plus (TF-0956)`);
}

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
// ---- R15 (D-3 (c), 16/09/2026) — LE CLIQUET DES FAMILLES SANS PORTEUR EXÉCUTABLE -----------
let r15Anterieures = 0;
let r15Portees = 0;
if (CLASSES_BRUTES === null) {
  avert("R15", "-", `référentiel ${CLASSES_PATH} illisible — le cliquet des porteurs ne se joue pas`);
} else {
  for (const c of CLASSES_BRUTES) {
    const sansPorteur = SANS_PORTEUR.test(String(c.oracle || ""));
    if (!sansPorteur) { r15Portees++; continue; }
    if (String(c.creee_le || "") < SEUIL_R15) { r15Anterieures++; continue; }
    ko("R15", c.cle, `famille créée le ${c.creee_le} SANS porteur exécutable — son champ \`oracle\` vaut « ${String(c.oracle || "").slice(0, 60)} ». `
      + "Une famille fermée dont le juge reste à écrire n'est pas une protection : le producteur ne la rencontre nulle part sur son chemin, "
      + "et c'est la cause mesurée des récidives du 15/09. Nommer le contrôle qui la joue, ou ne pas créer la famille (décision humaine D-3 (c) du 16/09/2026)");
  }
  if (!findings.some((f) => f.regle === "R15" && f.statut === "FAIL"))
    ok("R15", `${r15Portees} famille(s) portée(s) par un contrôle existant, ${r15Anterieures} antérieure(s) au cliquet — aucune famille neuve sans porteur`);
}

const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({
  oracle: "oracle-todo", version: "1.3.0", verdict: echecs ? "FAIL" : "PASS", findings,
  non_juge: [
    `R13 : ${classesVues} création(s) classée(s), ${recidivesVues} récidive(s) marquée(s) — la récidive est AVERTISSANTE, elle mesure la descente et ne met jamais le registre en échec ; la JUSTESSE d'une classe déclarée par un producteur n'est pas jugée`,
    `R14 : ${r14Anterieurs} doublon(s) strict(s) créé(s) avant ${SEUIL_R14} — antériorité déclarée, non jugés ; un doublon à la reformulation près (même défaut, autres mots) n'est pas un doublon strict et relève du rapprochement, qui signale sans juger`,
    `R15 : ${r15Anterieures} famille(s) de défaut créée(s) avant ${SEUIL_R15} sans porteur exécutable — antériorité DÉCLARÉE, non jugée, et jamais mise à zéro. Chacune est une protection écrite que personne ne joue : le producteur ne la rencontre nulle part sur son chemin, et c'est la cause mesurée des récidives du 15/09. Elles se résorbent au rythme des corrections qui les fondent, et ce compte est l'indicateur à faire baisser`,
    "la pertinence des scores (gain/effort) est un jugement humain, pas une règle",
    "la véracité des gains_constates n'est pas vérifiée dans le monde — seule leur présence l'est",
    "R11 ne juge que l'AVANCE sur l'heure d'exécution : un ts en RETARD (antidaté) reste hors de portée, comme un ts faux mais plausible — seul l'impossible est refusé",
    `R11 : les événements antérieurs au ${SEUIL_R11} ne sont pas jugés (antériorité mesurée par TF-0413) ; un ts inventé DANS cette fenêtre lui échappe, et c'est assumé plutôt que de mettre en échec un registre entier (R-33 bis)`,
    ...(SEUIL_R11 === SEUIL_R11_DEFAUT ? [] : [`R11 : seuil SURCHARGÉ par TODO_SEUIL_R11 (${SEUIL_R11} au lieu de ${SEUIL_R11_DEFAUT}) — verdict rendu sous un seuil qui n'est pas celui du registre`]),
  ],
}, null, 1));
process.exit(echecs ? 1 : 0);
