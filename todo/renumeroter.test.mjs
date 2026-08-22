#!/usr/bin/env node
/**
 * renumeroter.test.mjs — TF-0481 : la renumérotation d'un id collisionné devient une COMMANDE,
 * traçable et refusable, au lieu d'une édition de JSON à la main.
 *
 * Le fait fondateur, payé TROIS FOIS. Le préflight de TF-0394 refuse une ingestion quand le
 * registre distant a AVANCÉ. C'est juste, et ça reste. Mais c'est un check-then-act : il regarde
 * AVANT d'écrire, et ne peut rien contre deux sessions qui frappent les mêmes numéros avant que
 * l'une ait poussé.
 *   · avant TF-0394 — première renumérotation manuelle, qui a motivé l'item ;
 *   · 22/08 matin — cinq candidatures renumérotées, trois commits de rattrapage ;
 *   · 22/08 soir — `TF-0514` frappé pendant qu'une autre session publiait le sien, renuméroté à la
 *     main en éditant du JSON.
 *
 * Le coût mesuré n'est donc pas la collision, c'est la RENUMÉROTATION MANUELLE. Cette recette fige
 * ce que l'outil garantit, et surtout ce qu'il REFUSE — un outil de réparation qui accepte tout
 * fabrique le désordre qu'il prétend réparer.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "renumeroter.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "renum-"));
const REG = join(T, "TODO.jsonl");
const ARC = join(T, "TODO-ARCHIVE.jsonl");
const MOTIF = "collision avec une session parallele le 22/08/2026 : elle avait publie son propre TF-0514";

const creation = (id) => JSON.stringify({
  ev: "creation", ts: "2026-08-22T10:00:00.000Z", id, titre: "T", contenu: "C",
  demandeur: "d", source: "source d origine", date_demande: "2026-08-22", statut: "candidat",
  forges_cibles_initiales: ["pilot"], forges_cibles_reelles: null,
  score: { gain: 3, preuve: 3, effort: 3, valeur: 3 }, preuve_du_cout: "p",
  decideur: null, date_decision: null, date_correction: null, corrections_realisees: null,
  gains_constates: null, version_forge_corrigee: null, produits_beneficiaires: null,
});

const poser = () => {
  writeFileSync(REG, [creation("TF-9100"), creation("TF-9101")].join("\n") + "\n", "utf8");
  writeFileSync(ARC, creation("TF-9050") + "\n", "utf8");
};

const lancer = (...extra) => {
  const r = spawnSync(process.execPath, [OUTIL, ...extra, "--registre", REG], { encoding: "utf8" });
  let j = null;
  try { j = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout };
};

poser();
check("renumérotation nominale : l'id change, l'ancien disparaît, le verdict ne se dégrade pas", () => {
  const r = lancer("TF-9101", "TF-9900", "--motif", MOTIF);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${JSON.stringify(r.j)}`);
  const t = readFileSync(REG, "utf8");
  if (!t.includes('"id":"TF-9900"')) throw new Error("le nouvel id n'est pas écrit");
  if (t.includes('"id":"TF-9101"')) throw new Error("l'ancien id subsiste — deux items pour un");
  // L'invariant qui compte n'est pas « PASS » mais « pas PIRE » : `oracle-todo` resout l'archive
  // depuis sa propre place, donc un registre de recette isole ne peut pas etre PASS dans l'absolu.
  // Ce que l'outil doit garantir, c'est qu'une renumerotation ne DEGRADE pas le verdict.
  if (r.j.verdict_apres !== r.j.verdict_avant) throw new Error(`verdict passe de ${r.j.verdict_avant} a ${r.j.verdict_apres} — la renumerotation a degrade le registre`);
});

check("le MOTIF est consigné dans l'item, pas seulement à l'écran", () => {
  const t = readFileSync(REG, "utf8");
  if (!/RENUMÉROTÉ de TF-9101 en TF-9900 : collision avec une session parallele/.test(t)) {
    throw new Error("le motif n'est pas dans le champ `source` de la création — un id qui change sans raison lisible vaut moins qu'un id absent");
  }
  if (!t.includes("source d origine")) throw new Error("la source d'origine a été écrasée — l'histoire s'annote, elle ne se réécrit pas");
});

poser();
check("REFUS : motif trop court — une renumérotation sans raison est le défaut qu'on répare", () => {
  const r = lancer("TF-9101", "TF-9900", "--motif", "collision");
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/trop court/.test(r.j.message)) throw new Error("le refus ne dit pas que le motif est trop court");
  if (readFileSync(REG, "utf8").includes("TF-9900")) throw new Error("le refus a quand même écrit");
});

check("REFUS : le nouvel id est DÉJÀ PRIS dans le registre actif", () => {
  const r = lancer("TF-9101", "TF-9100", "--motif", MOTIF);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/DÉJÀ PRIS/.test(r.j.message)) throw new Error("le refus ne dit pas que l'id est pris");
});

check("REFUS : le nouvel id est DÉJÀ PRIS dans l'ARCHIVE — l'histoire compte aussi", () => {
  const r = lancer("TF-9101", "TF-9050", "--motif", MOTIF);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un id archivé reste pris`);
  if (!/DÉJÀ PRIS/.test(r.j.message)) throw new Error("le refus ne dit pas que l'id est pris");
});

check("REFUS : l'ancien id est absent du registre — rien à renuméroter", () => {
  const r = lancer("TF-9777", "TF-9900", "--motif", MOTIF);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/absent du registre/.test(r.j.message)) throw new Error("le refus ne dit pas que l'ancien id est absent");
});

check("--essai n'écrit rien et dit ce qu'il aurait fait", () => {
  const avant = readFileSync(REG, "utf8");
  const r = lancer("TF-9101", "TF-9900", "--motif", MOTIF, "--essai");
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0`);
  if (r.j.lignes_reecrites !== 1) throw new Error(`${r.j.lignes_reecrites} ligne(s) annoncée(s), 1 attendue`);
  if (readFileSync(REG, "utf8") !== avant) throw new Error("--essai a écrit");
});

check("aucune sauvegarde ne fuit à côté du registre", () => {
  poser();
  lancer("TF-9101", "TF-9900", "--motif", MOTIF);
  if (existsSync(REG + ".renum.bak")) throw new Error("la sauvegarde de travail est restée sur le disque");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nrenumeroter (TF-0481) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
