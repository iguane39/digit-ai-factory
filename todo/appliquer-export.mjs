#!/usr/bin/env node
/**
 * appliquer-export.mjs — applique au registre un LOT de décisions humaines.
 *
 * Requalifié le 18/08 (TF-0328). Ce fichier a été écrit pour consommer un export produit par
 * les cases à décider de TODO.html — colonnes RETIRÉES le 12/08 sous mandat humain, les
 * décisions se prenant hors page. Le consommateur est alors resté sans émetteur : du code
 * vivant et testé que rien n'alimentait, pendant que `references\TODO-FORGE.md` continuait
 * de prescrire le dispositif retiré — et un item entier (TF-0318) a été instruit sur cette
 * prémisse. Le canal garde sa valeur (la gouvernance admet le mandat humain PAR LOT), mais son
 * émetteur est désormais l'HUMAIN, qui produit le fichier par le moyen de son choix : le format
 * ci-dessous est le contrat, il n'est plus la sortie d'une page.
 *
 * Entrée : TF-decisions-*.json {schema:1, type:"decisions-todo-forge", sceau_source,
 * exporte_le, decisions:[{id, decider, commentaire}]}.
 * Règles : validation intégrale AVANT écriture (id inconnu, schéma faux → rejet ATOMIQUE
 * motivé) ; `decider:true` sur un item NON candidat = rejet (la transition serait illégale) ;
 * decider:true → maj statut decide (decideur « humain — lot de décisions appliqué (<fichier>) »,
 * date du fichier) ;
 * commentaire → champ commentaire_humain (concaténé, jamais écrasé) ; IDEMPOTENT par
 * empreinte du fichier (événement ingestion). Après écriture : oracle + vue + page régénérées.
 *
 * Usage : node appliquer-export.mjs <TF-decisions.json> [--registre <TODO.jsonl>]
 * Exit : 0 appliqué (ou déjà appliqué) · 1 rejeté · 2 erreur.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { empreinteTexte } from "../scripts/lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const exportPath = process.argv[2];
const iReg = process.argv.indexOf("--registre");
const registre = resolve(iReg > 0 ? process.argv[iReg + 1] : join(ICI, "TODO.jsonl"));
if (!exportPath || !existsSync(exportPath)) { console.error("usage : appliquer-export.mjs <TF-decisions.json> [--registre <TODO.jsonl>]"); process.exit(2); }

const brut = readFileSync(exportPath, "utf8");
// TF-0615 : fonction partagee, fins de ligne normalisees. Un export rendu a un tiers puis
// reimporte depuis un poste au checkout different aurait sinon un sceau different sans qu'un
// octet ait bouge.
const exportSha = empreinteTexte(brut);
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
  if (d.decider) { maj.statut = "decide"; maj.decideur = `humain — lot de décisions appliqué (${basename(exportPath)})`; maj.date_decision = dateDecision; decides++; }
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
