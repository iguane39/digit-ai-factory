#!/usr/bin/env node
/**
 * appliquer-export.mjs — applique au registre un export de décisions produit par TODO.html.
 *
 * Entrée : TF-decisions-*.json {schema:1, type:"decisions-todo-forge", sceau_source,
 * exporte_le, decisions:[{id, decider, commentaire}]}.
 * Règles : validation intégrale AVANT écriture (id inconnu, schéma faux → rejet ATOMIQUE
 * motivé) ; `decider:true` sur un item NON candidat = rejet (la transition serait illégale) ;
 * decider:true → maj statut decide (decideur « humain — export TODO.html », date du fichier) ;
 * commentaire → champ commentaire_humain (concaténé, jamais écrasé) ; IDEMPOTENT par
 * empreinte du fichier (événement ingestion). Après écriture : oracle + vue + page régénérées.
 *
 * Usage : node appliquer-export.mjs <TF-decisions.json> [--registre <TODO.jsonl>]
 * Exit : 0 appliqué (ou déjà appliqué) · 1 rejeté · 2 erreur.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const exportPath = process.argv[2];
const iReg = process.argv.indexOf("--registre");
const registre = resolve(iReg > 0 ? process.argv[iReg + 1] : join(ICI, "TODO.jsonl"));
if (!exportPath || !existsSync(exportPath)) { console.error("usage : appliquer-export.mjs <TF-decisions.json> [--registre <TODO.jsonl>]"); process.exit(2); }

const brut = readFileSync(exportPath, "utf8");
const exportSha = createHash("sha256").update(brut).digest("hex");
let doc;
try { doc = JSON.parse(brut.replace(/^﻿/, "")); } catch { console.error("[REJET] export non-JSON"); process.exit(1); }

const motifs = [];
if (doc.schema !== 1 || doc.type !== "decisions-todo-forge") motifs.push("schema/type inattendus");
if (!Array.isArray(doc.decisions) || !doc.decisions.length) motifs.push("decisions absentes ou vides");

// État courant du registre (pour valider ids et statuts AVANT toute écriture)
const evenements = readFileSync(registre, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
if (evenements.some((e) => e.ev === "ingestion" && e.lot_sha === exportSha)) {
  console.log(`[DÉJÀ APPLIQUÉ] empreinte ${exportSha.slice(0, 12)} — 0 modification (idempotence)`);
  process.exit(0);
}
const etats = new Map();
for (const e of evenements) {
  if (e.ev === "creation") etats.set(e.id, { ...e });
  else if (e.ev === "maj" && etats.has(e.id)) Object.assign(etats.get(e.id), e);
}
for (const d of doc.decisions ?? []) {
  if (!etats.has(d.id)) motifs.push(`${d.id} : inconnu du registre`);
  else if (d.decider && etats.get(d.id).statut !== "candidat")
    motifs.push(`${d.id} : decider sur un item en statut ${etats.get(d.id).statut} — transition illégale`);
  if (!d.decider && !d.commentaire) motifs.push(`${d.id} : ni décision ni commentaire`);
}
if (motifs.length) {
  console.error(`[REJET ATOMIQUE] ${exportPath} — registre intact. Motifs :\n  - ${motifs.join("\n  - ")}`);
  process.exit(1);
}

const ts = new Date().toISOString();
const dateDecision = String(doc.exporte_le || ts).slice(0, 10);
const lignes = [];
let decides = 0, commentes = 0;
for (const d of doc.decisions) {
  const maj = { ev: "maj", ts, id: d.id };
  if (d.decider) { maj.statut = "decide"; maj.decideur = "humain — export TODO.html"; maj.date_decision = dateDecision; decides++; }
  if (d.commentaire) {
    const existant = etats.get(d.id).commentaire_humain;
    maj.commentaire_humain = existant ? `${existant} | ${dateDecision} : ${d.commentaire}` : `${dateDecision} : ${d.commentaire}`;
    commentes++;
  }
  lignes.push(JSON.stringify(maj));
}
lignes.push(JSON.stringify({ ev: "ingestion", ts, lot_sha: exportSha, fichier: String(exportPath), decisions: doc.decisions.length }));
appendFileSync(registre, lignes.join("\n") + "\n");

execFileSync("node", [join(ICI, "oracle-todo.mjs"), registre, join(dirname(registre), "TODO-ARCHIVE.jsonl")], { encoding: "utf8" });
if (registre === resolve(join(ICI, "TODO.jsonl"))) {
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
  execFileSync("node", [join(ICI, "generer-page.mjs")], { encoding: "utf8" });
}
console.log(`[OK] export appliqué — ${decides} décidé(s), ${commentes} commenté(s) (empreinte ${exportSha.slice(0, 12)})`);
