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
 *  R7  clôture en corrige exige gains_constates + corrections_realisees + date_correction
 *  R8  l'archive ne contient que des items dont l'état final est archive
 *  R9  ts non décroissants par id
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const actifs = process.argv[2] || join(ICI, "TODO.jsonl");
const archive = process.argv[3] || join(ICI, "TODO-ARCHIVE.jsonl");
const findings = [];
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

function replier(evenements, ou) {
  const etats = new Map();
  for (const e of evenements) {
    if (e.ev === "ingestion") { if (!e.lot_sha) ko("R1", `${ou}:${e.ligne}`, "ingestion sans lot_sha"); continue; }
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
      etats.set(e.id, { ...e });
    } else if (e.ev === "maj") {
      const etat = etats.get(e.id);
      if (!etat) { ko("R2", `${ou}:${e.ligne}`, `maj sans creation préalable pour ${e.id}`); continue; }
      if (e.ts < etat.ts) ko("R9", e.id, `ts décroissant (${e.ts} après ${etat.ts})`);
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
      }
      Object.assign(etat, e);
    } else ko("R1", `${ou}:${e.ligne}`, `ev inconnu : ${e.ev}`);
  }
  return etats;
}

const etatsActifs = replier(lire(actifs), "TODO.jsonl");
const etatsArchive = replier(lire(archive), "TODO-ARCHIVE.jsonl");
for (const id of etatsActifs.keys())
  if (etatsArchive.has(id)) ko("R3", id, "id présent dans les actifs ET l'archive");
for (const [id, e] of etatsArchive)
  if (e.statut !== "archive") ko("R8", id, `dans l'archive avec statut ${e.statut}`);

if (!findings.some((f) => f.statut === "FAIL")) {
  ok("R1-R9", `${etatsActifs.size} item(s) actif(s), ${etatsArchive.size} archivé(s) — registre intègre`);
}
const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({
  oracle: "oracle-todo", version: "1.0.0", verdict: echecs ? "FAIL" : "PASS", findings,
  non_juge: [
    "la pertinence des scores (gain/effort) est un jugement humain, pas une règle",
    "la véracité des gains_constates n'est pas vérifiée dans le monde — seule leur présence l'est",
  ],
}, null, 1));
process.exit(echecs ? 1 : 0);
