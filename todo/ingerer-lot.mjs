#!/usr/bin/env node
/**
 * ingerer-lot.mjs — ingère un sidecar de candidatures (*.tf.jsonl) dans le registre TODO-FORGE.
 *
 * Contrat (campagne du 08/08) :
 *  - les candidatures arrivent SANS id : les ids TF sont frappés ICI (écrivain unique) ;
 *  - validation de TOUTES les lignes AVANT toute écriture — une ligne invalide = rejet
 *    ATOMIQUE et motivé du fichier entier, registre intact ;
 *  - IDEMPOTENT : l'empreinte sha256 du sidecar est consignée en événement `ingestion` —
 *    ré-ingérer le même lot ne crée rien ;
 *  - tout entre en statut CANDIDAT : l'automatique s'arrête là, la décision reste humaine ;
 *  - après écriture : oracle-todo rejoué + vue régénérée (registre par défaut uniquement).
 *
 * Usage : node ingerer-lot.mjs <sidecar.tf.jsonl> [--registre <TODO.jsonl>]
 * Exit : 0 = ingéré (ou déjà ingéré, 0 création) · 1 = sidecar rejeté · 2 = erreur.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const sidecarPath = process.argv[2];
const iReg = process.argv.indexOf("--registre");
const registre = resolve(iReg > 0 ? process.argv[iReg + 1] : join(ICI, "TODO.jsonl"));
const archive = join(dirname(registre), "TODO-ARCHIVE.jsonl");
if (!sidecarPath || !existsSync(sidecarPath)) { console.error("usage : ingerer-lot.mjs <sidecar.tf.jsonl> [--registre <TODO.jsonl>]"); process.exit(2); }

const contenu = readFileSync(sidecarPath, "utf8");
// Empreinte NORMALISEE en LF (idiome TF-0253, etendu par TF-0359) : avec core.autocrlf=true,
// git repose un sidecar en CRLF au checkout sans qu'un octet de contenu ait bouge. Une
// empreinte prise sur les octets bruts ne reconnait alors plus le lot deja ingere, et
// l'idempotence tombe : le meme lot recree ses candidatures en doublon — l'incident du
// 13/08 (32 doublons) par un autre chemin. La forme brute reste acceptee en lecture pour
// les ingestions ANTERIEURES a cette normalisation, jamais ecrite pour les nouvelles.
const lotSha = createHash("sha256").update(contenu.split("\r\n").join("\n")).digest("hex");
const lotShaBrut = createHash("sha256").update(contenu).digest("hex");
const lignes = contenu.split("\n").filter((l) => l.trim());

// ---- validation intégrale AVANT toute écriture (rejet atomique) ----------------------------
const motifs = [];
const candidatures = lignes.map((l, i) => {
  let c;
  try { c = JSON.parse(l); } catch { motifs.push(`ligne ${i + 1} : JSON invalide`); return null; }
  if (c.schema !== 1) motifs.push(`ligne ${i + 1} : schema attendu 1, reçu ${c.schema}`);
  if (c.id) motifs.push(`ligne ${i + 1} : une candidature ne porte JAMAIS d'id (frappé à l'ingestion)`);
  for (const champ of ["titre", "contenu", "demandeur", "source", "date_demande"])
    if (!c[champ]) motifs.push(`ligne ${i + 1} : champ ${champ} manquant`);
  if (!Array.isArray(c.forges_cibles_initiales) || !c.forges_cibles_initiales.length)
    motifs.push(`ligne ${i + 1} : forges_cibles_initiales manquant ou vide`);
  return c;
});
if (motifs.length) {
  console.error(`[REJET ATOMIQUE] ${sidecarPath} — registre intact. Motifs :\n  - ${motifs.join("\n  - ")}`);
  process.exit(1);
}

// ---- idempotence : lot déjà ingéré ? ------------------------------------------------------
const lireEv = (f) => (existsSync(f) ? readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : []);
const evenements = lireEv(registre);
if (evenements.some((e) => e.ev === "ingestion" && (e.lot_sha === lotSha || e.lot_sha === lotShaBrut))) {
  console.log(`[DÉJÀ INGÉRÉ] empreinte ${lotSha.slice(0, 12)} — 0 création (idempotence)`);
  process.exit(0);
}

// ---- frappage des ids à la suite (actifs + archive, jamais réutilisés) ---------------------
const ids = [...evenements, ...lireEv(archive)].filter((e) => e.id).map((e) => parseInt(e.id.slice(3), 10));
let prochain = (ids.length ? Math.max(...ids) : 0) + 1;
const ts = new Date().toISOString();
const nouvelles = candidatures.map((c) => {
  const score = c.score && [c.score.gain, c.score.preuve, c.score.effort].every((v) => typeof v === "number")
    ? { ...c.score, valeur: Math.round((c.score.gain * c.score.preuve / c.score.effort) * 10) / 10 }
    : { gain: 3, preuve: 1, effort: 3, valeur: 1, par_defaut: true };
  return JSON.stringify({
    ev: "creation", ts, id: `TF-${String(prochain++).padStart(4, "0")}`,
    titre: c.titre, contenu: c.contenu, demandeur: c.demandeur, source: c.source,
    date_demande: c.date_demande, statut: "candidat",
    forges_cibles_initiales: c.forges_cibles_initiales, forges_cibles_reelles: null,
    score, preuve_du_cout: c.preuve_du_cout ?? null,
    decideur: null, date_decision: null, date_correction: null, corrections_realisees: null,
    gains_constates: null, version_forge_corrigee: null, produits_beneficiaires: null,
  });
});
nouvelles.push(JSON.stringify({ ev: "ingestion", ts, lot_sha: lotSha, fichier: String(sidecarPath), creations: nouvelles.length }));
appendFileSync(registre, nouvelles.join("\n") + "\n");

// ---- contrôles post-écriture ---------------------------------------------------------------
execFileSync("node", [join(ICI, "oracle-todo.mjs"), registre, archive], { encoding: "utf8" });
if (registre === resolve(join(ICI, "TODO.jsonl")))
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
console.log(`[OK] ${nouvelles.length - 1} candidature(s) ingérée(s) en CANDIDAT (lot ${lotSha.slice(0, 12)}) — la décision reste humaine`);
