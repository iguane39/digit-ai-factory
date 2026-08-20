#!/usr/bin/env node
/**
 * oracle-catalogues.mjs — intégrité du catalogue de services (source unique + vues générées).
 * Règles :
 *  K1  catalogues\catalogue.jsonl existe, 1re ligne méta `pilot/catalogue@1`, JSONL valide
 *  K2  chaque service porte tous les champs requis, non vides (dont challenge_date — nullable interdit)
 *  K3  ids uniques, format `cat-<3 lettres>-<2 chiffres>` — jamais réutilisés (CONTRAT-INTERFACE §3 bis)
 *  K4  statut ∈ {prouve, declare} ; cycle_de_vie ∈ {experimental, production, deprecated}
 *  K5  les dix forges sont couvertes (au moins un service chacune)
 *  K6  vues synchronisées avec la source (generer-vues.mjs --check, exit 0)
 *  K7  chaque forge du catalogue est routée par CONTRAT-INTERFACE.md (cohérence points d'entrée)
 * Usage : node oracle-catalogues.mjs [racine] | --self-test  — exit 0 PASS / 1 FAIL / 2 erreur.
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const CHAMPS = ["id", "forge", "nom", "intention", "entrees", "sorties", "point_entree", "preuve", "statut", "cycle_de_vie", "challenge_date"];
const STATUTS = new Set(["prouve", "declare"]);
const CYCLES = new Set(["experimental", "production", "deprecated"]);
// TF-0412 (20/08) : `seo` renommée `seo-geo` le 19/08 (TF-0390) — la clé suit le nom courant
// de la forge, le fait de couverture est inchangé. Une clé périmée ici rend K5 rouge en permanence.
const DIX_FORGES = ["conception", "design", "development", "tests", "agents", "ops", "data", "audit", "seo-geo", "organization"];

/** Valide un fichier catalogue (règles K1-K5). forgesAttendues paramétrable pour le self-test. */
export function validerCatalogue(chemin, forgesAttendues = DIX_FORGES) {
  const findings = [];
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });

  if (!existsSync(chemin)) { ko("K1", `${chemin} absent`); return findings; }
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  let meta;
  try { meta = JSON.parse(lignes[0]); } catch { ko("K1", "1re ligne : JSON invalide"); return findings; }
  if (meta.schema !== "pilot/catalogue@1") { ko("K1", `schéma méta inattendu : ${meta.schema}`); return findings; }
  ok("K1", `méta valide (v${meta.version}, ${lignes.length - 1} services)`);

  const services = [];
  for (const [i, l] of lignes.slice(1).entries()) {
    try { services.push(JSON.parse(l)); }
    catch { ko("K1", `ligne ${i + 2} : JSON invalide`); }
  }

  let k2 = 0, k4 = 0;
  const ids = new Map();
  for (const s of services) {
    for (const c of CHAMPS) {
      const v = s[c];
      const vide = v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length);
      if (vide) { ko("K2", `${s.id ?? "?"} : champ « ${c} » manquant ou vide`); k2++; }
    }
    if (!/^cat-[a-z]{3}-\d{2}$/.test(s.id ?? "")) ko("K3", `id non conforme : ${s.id}`);
    ids.set(s.id, (ids.get(s.id) ?? 0) + 1);
    if (!STATUTS.has(s.statut)) { ko("K4", `${s.id} : statut « ${s.statut} » hors {prouve, declare}`); k4++; }
    if (!CYCLES.has(s.cycle_de_vie)) { ko("K4", `${s.id} : cycle_de_vie « ${s.cycle_de_vie} » hors référentiel`); k4++; }
  }
  if (!k2) ok("K2", "tous les champs requis présents et non vides");
  const doublons = [...ids.entries()].filter(([, n]) => n > 1);
  doublons.length
    ? doublons.forEach(([id, n]) => ko("K3", `id dupliqué : ${id} (${n} occurrences)`))
    : ok("K3", `${ids.size} ids uniques au format cat-xxx-nn`);
  if (!k4) ok("K4", "statuts et cycles de vie dans les référentiels fermés");

  const couvertes = new Set(services.map((s) => s.forge));
  const manquantes = forgesAttendues.filter((f) => !couvertes.has(f));
  manquantes.length
    ? ko("K5", `forges sans service au catalogue : ${manquantes.join(", ")}`)
    : ok("K5", `${forgesAttendues.length} forges couvertes`);
  return findings;
}

/** Règles K6-K7 (environnement réel uniquement). */
function validerEnvironnement(racine) {
  const findings = [];
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });

  const generateur = join(racine, "catalogues", "generer-vues.mjs");
  const check = spawnSync(process.execPath, [generateur, "--check"], { encoding: "utf8" });
  check.status === 0
    ? ok("K6", "vues synchronisées avec la source (generer-vues.mjs --check exit 0)")
    : ko("K6", `vues désynchronisées : ${(check.stderr || check.stdout || "").trim()}`);

  const contrat = join(racine, "CONTRAT-INTERFACE.md");
  if (!existsSync(contrat)) ko("K7", "CONTRAT-INTERFACE.md absent");
  else {
    const texte = readFileSync(contrat, "utf8").toLowerCase();
    const lignes = readFileSync(join(racine, "catalogues", "catalogue.jsonl"), "utf8").split(/\r?\n/).filter((l) => l.trim()).slice(1);
    const forges = new Set(lignes.map((l) => JSON.parse(l).forge));
    const absentes = [...forges].filter((f) => !texte.includes(f));
    absentes.length
      ? ko("K7", `forges du catalogue absentes du CONTRAT-INTERFACE : ${absentes.join(", ")}`)
      : ok("K7", `${forges.size} forges du catalogue routées par le contrat`);
  }
  return findings;
}

function selfTest() {
  const dossier = mkdtempSync(join(tmpdir(), "oracle-catalogues-"));
  const meta = JSON.stringify({ schema: "pilot/catalogue@1", version: "0.0.1", genere: "2026-08-12" });
  const service = (sur) => JSON.stringify({
    id: "cat-aaa-01", forge: "alpha", nom: "N", intention: "I", entrees: ["e"], sorties: ["s"],
    point_entree: "p", preuve: "pr", statut: "prouve", cycle_de_vie: "production", challenge_date: "2026-08-12", ...sur,
  });
  const resultats = [];

  // fixture VERTE : catalogue minimal conforme (2 forges attendues, 2 couvertes) → PASS attendu
  const verte = join(dossier, "verte.jsonl");
  writeFileSync(verte, [meta, service({}), service({ id: "cat-bbb-01", forge: "beta" })].join("\n"), "utf8");
  const fVerte = validerCatalogue(verte, ["alpha", "beta"]);
  resultats.push({ fixture: "verte", attendu: "PASS", obtenu: fVerte.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS" });

  // fixture ROUGE : id dupliqué + statut hors référentiel + challenge_date null + forge non couverte → FAIL sur K2, K3, K4, K5
  const rouge = join(dossier, "rouge.jsonl");
  writeFileSync(rouge, [meta, service({}), service({ statut: "certifie", challenge_date: null })].join("\n"), "utf8");
  const fRouge = validerCatalogue(rouge, ["alpha", "beta"]);
  const reglesTouchees = new Set(fRouge.filter((f) => f.statut === "FAIL").map((f) => f.regle));
  for (const r of ["K2", "K3", "K4", "K5"])
    resultats.push({ fixture: `rouge/${r}`, attendu: "FAIL", obtenu: reglesTouchees.has(r) ? "FAIL" : "PASS" });

  rmSync(dossier, { recursive: true, force: true });
  const rates = resultats.filter((r) => r.attendu !== r.obtenu);
  console.log(JSON.stringify({ oracle: "oracle-catalogues", mode: "self-test", verdict: rates.length ? "FAIL" : "PASS", resultats }, null, 1));
  process.exit(rates.length ? 1 : 0);
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (process.argv.includes("--self-test")) selfTest();
  const racine = process.argv[2] || join(ICI, "..");
  let findings;
  try {
    findings = [
      ...validerCatalogue(join(racine, "catalogues", "catalogue.jsonl")),
      ...validerEnvironnement(racine),
    ];
  } catch (e) {
    console.log(JSON.stringify({ oracle: "oracle-catalogues", verdict: "ERREUR", message: String(e) }, null, 1));
    process.exit(2);
  }
  const echecs = findings.filter((f) => f.statut === "FAIL").length;
  console.log(JSON.stringify({
    oracle: "oracle-catalogues", version: "1.0.0", verdict: echecs ? "FAIL" : "PASS", findings,
    non_juge: ["la véracité métier des preuves citées (relève des oracles des forges)", "la qualité des intentions rédigées"],
  }, null, 1));
  process.exit(echecs ? 1 : 0);
}
