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
 *  K8  chaque script cité en point d'entrée (node x.mjs, python x.py) existe dans le dépôt de sa forge (TF-2015)
 *  K9  la version et la date du catalogue disent son contenu : le contenu des services est celui que `versions.jsonl`
 *      a scellé sous cette version (TF-2667 ; la version 1.8.0 du 19/08 a porté 83, 91, 98 puis 111 services)
 * Usage : node oracle-catalogues.mjs [racine] | --self-test  — exit 0 PASS / 1 FAIL / 2 erreur.
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { empreinteServices, lireJournal, comparerVersions, sceller } from "../catalogues/generer-vues.mjs";

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

/**
 * K8 (TF-2015, 29/10/2026) — un script cité en point d'entrée (`node <x>.mjs`, `python <x>.py`) existe
 * dans le dépôt de sa forge. Deux fois le 29/10, un antislash mangé par le shell a écrit
 * « node oraclesoracle-exposition-statique.mjs » et « node scriptsanonymiser.mjs », et --check rendait PASS :
 * il juge la synchronisation des vues, jamais ce qu'elles disent. Un chemin à accolades ou à chevrons
 * (`oracle-{a,b}.mjs`, `<artefact>`) n'est pas résolu ; une forge dont le dépôt est absent du parc est
 * comptée non jugée, jamais PASS ni FAIL.
 */
export function validerPointsEntree(services, racineParc) {
  const findings = [];
  let juges = 0, nonJuges = 0;
  const casses = [];
  for (const s of services) {
    const depot = join(racineParc, `digit-ai-forge-${s.forge}`);
    for (const m of String(s.point_entree ?? "").matchAll(/\b(?:node|python)\s+([^\s<>{}|;·]+\.(?:mjs|js|py))(?=\s|$)/g)) {
      if (!existsSync(depot)) { nonJuges++; continue; }
      juges++;
      if (!existsSync(join(depot, m[1].replaceAll("\\", "/")))) casses.push(`${s.id} : « ${m[1]} » introuvable dans digit-ai-forge-${s.forge}`);
    }
  }
  for (const c of casses) findings.push({ regle: "K8", statut: "FAIL", message: `${c} — séparateur de dossier perdu, ou script renommé` });
  if (!casses.length) findings.push({ regle: "K8", statut: juges ? "PASS" : "SKIP", message: `${juges} script(s) de point d'entrée résolu(s) dans le dépôt de leur forge${nonJuges ? `, ${nonJuges} non jugé(s) : dépôt de forge absent du parc` : ""}` });
  return findings;
}

/**
 * K9 (TF-2667, 16/11/2026) — un catalogue change de contenu sans changer de version ni de date : les deux
 * instantanés vendus à un produit (83 services le 24/08, 111 le 15/11) portaient la même étiquette
 * « v1.8.0 du 19/08/2026 ». `versions.jsonl` (ajout seul) scelle, par version, l'empreinte des lignes de
 * services. Le contenu courant doit être celui de la version que la méta nomme, et cette version la dernière
 * scellée ; les versions du journal montent strictement et leurs dates ne reculent pas. Le remède est dans
 * le message : `node catalogues/generer-vues.mjs --sceller`.
 */
export function validerVersions(chemin, journal) {
  const findings = [];
  const ko = (message) => findings.push({ regle: "K9", statut: "FAIL", message });
  const REMEDE = "node catalogues/generer-vues.mjs --sceller monte la version, date le contenu et régénère les vues";
  let entrees;
  try { entrees = lireJournal(journal); } catch (e) { ko(`journal des versions illisible (${journal}) : ${e.message}`); return findings; }
  if (!entrees.length) { ko(`journal des versions absent ou vide (${journal}) : ${REMEDE}`); return findings; }
  const SEMVER = /^\d+\.\d+\.\d+$/;
  const ISO = /^\d{4}-\d{2}-\d{2}$/;
  entrees.forEach((e, i) => {
    if (!e || !SEMVER.test(e.version ?? "") || !ISO.test(e.genere ?? "") || !/^[0-9a-f]{64}$/.test(e.empreinte ?? "") || !Number.isInteger(e.services)) ko(`versions.jsonl ligne ${i + 1} : version, genere, empreinte (sha256) ou services mal formés`);
    else if (i > 0 && comparerVersions(entrees[i - 1].version, e.version) >= 0) ko(`versions.jsonl ligne ${i + 1} : version ${e.version} réutilisée ou en recul après ${entrees[i - 1].version} — une version ne se rejoue jamais`);
    else if (i > 0 && e.genere < entrees[i - 1].genere) ko(`versions.jsonl ligne ${i + 1} : date ${e.genere} antérieure à celle de la version précédente (${entrees[i - 1].genere})`);
  });
  if (findings.length) return findings;
  let meta;
  try { meta = JSON.parse(readFileSync(chemin, "utf8").split(/\r?\n/)[0]); } catch { ko("1re ligne du catalogue illisible"); return findings; }
  const derniere = entrees.at(-1);
  if (meta.version !== derniere.version) ko(`le catalogue porte la version ${meta.version}, la dernière version scellée est ${derniere.version} : ${REMEDE}`);
  else if (meta.genere !== derniere.genere) ko(`le catalogue porte la date ${meta.genere}, la version ${derniere.version} a été scellée le ${derniere.genere} : ${REMEDE}`);
  else {
    const { empreinte, services } = empreinteServices(chemin);
    if (empreinte !== derniere.empreinte) ko(`le contenu diffère de la version ${meta.version} scellée le ${derniere.genere} (${derniere.services} services scellés, ${services} aujourd'hui) à en-tête égal : ${REMEDE}`);
  }
  if (!findings.length) findings.push({ regle: "K9", statut: "PASS", message: `contenu conforme à la version ${meta.version} scellée le ${meta.genere} (${derniere.services} services, ${entrees.length} version(s) au journal)` });
  return findings;
}

/** Règles K6-K9 (environnement réel uniquement). */
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
  const services = readFileSync(join(racine, "catalogues", "catalogue.jsonl"), "utf8").split(/\r?\n/).filter((l) => l.trim()).slice(1).map((l) => JSON.parse(l));
  findings.push(...validerPointsEntree(services, join(racine, "..")));
  findings.push(...validerVersions(join(racine, "catalogues", "catalogue.jsonl"), join(racine, "catalogues", "versions.jsonl")));
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

  // K8 (TF-2015) : un parc jetable avec un dépôt de forge qui porte oracles/oracle-x.mjs. Le chemin
  // juste PASS ; le même dont l'antislash est perdu FAIL (le cas réel du 29/10) ; un chemin à
  // accolades n'est pas résolu ; une forge absente du parc n'est jamais FAIL.
  const parc = join(dossier, "parc");
  mkdirSync(join(parc, "digit-ai-forge-alpha", "oracles"), { recursive: true });
  writeFileSync(join(parc, "digit-ai-forge-alpha", "oracles", "oracle-x.mjs"), "", "utf8");
  const k8 = (point_entree, forge = "alpha") => validerPointsEntree([{ id: "cat-aaa-01", forge, point_entree }], parc)[0];
  resultats.push({ fixture: "K8/chemin juste", attendu: "PASS", obtenu: k8("node oracles\\oracle-x.mjs <f>").statut });
  resultats.push({ fixture: "K8/antislash perdu", attendu: "FAIL", obtenu: k8("node oraclesoracle-x.mjs <f>").statut });
  resultats.push({ fixture: "K8/accolades non résolues", attendu: "SKIP", obtenu: k8("node oracles\\oracle-{x,y}.mjs").statut });
  resultats.push({ fixture: "K8/forge absente du parc", attendu: "SKIP", obtenu: k8("node oraclesoracle-x.mjs", "beta").statut });

  // TF-2246 (06/11/2026) : l'oracle de l'arrêt d'urgence rejoué en course (forge-agents-security, TF-2217)
  // était livré et découvert par sa forge, mais absent du catalogue du pilot. Le catalogue RÉEL le cite.
  const reel = readFileSync(join(ICI, "..", "catalogues", "catalogue.jsonl"), "utf8").split(/\r?\n/).filter((l) => l.trim()).slice(1).map((l) => JSON.parse(l));
  resultats.push({ fixture: "catalogue réel/oracle-arret-en-course de forge-agents-security (TF-2246)", attendu: "PASS",
    obtenu: reel.some((s) => s.forge === "agents-security" && /oracle-arret-en-course\.mjs/.test(s.point_entree)) ? "PASS" : "FAIL" });

  // K9 (TF-2667) : deux instantanés à en-tête égal (version et date identiques) dont le contenu diffère.
  // Le journal scelle l'instantané A ; B ajoute un service sans monter la version → FAIL. Le remède que le
  // message recommande (`sceller`) est JOUÉ sur B et doit faire passer K9 ; le rejouer ne change plus rien.
  const ecrire = (nom, lignes) => { const f = join(dossier, nom); writeFileSync(f, lignes.join("\n") + "\n", "utf8"); return f; };
  const metaK9 = JSON.stringify({ schema: "pilot/catalogue@1", version: "0.0.1", genere: "2026-08-12" });
  const svcB = service({ id: "cat-bbb-01", forge: "beta" });
  const instA = ecrire("k9-a.jsonl", [metaK9, service({})]);
  const instB = ecrire("k9-b.jsonl", [metaK9, service({}), svcB]);
  const ligneJ = (version, genere, source) => JSON.stringify({ version, genere, ...empreinteServices(source) });
  const journalA = ecrire("k9-journal-a.jsonl", [ligneJ("0.0.1", "2026-08-12", instA)]);
  const k9 = (cat, jr, motif) => { const f = validerVersions(cat, jr); return f.some((x) => x.statut === "FAIL" && (!motif || motif.test(x.message))) ? "FAIL" : f.every((x) => x.statut === "PASS") ? "PASS" : "?"; };
  resultats.push({ fixture: "K9/vert : contenu = version scellée", attendu: "PASS", obtenu: k9(instA, journalA) });
  resultats.push({ fixture: "K9/rouge : 2 instantanés à en-tête égal, contenu différent", attendu: "FAIL", obtenu: k9(instB, journalA, /le contenu diffère de la version 0\.0\.1 .*à en-tête égal.*--sceller/) });
  resultats.push({ fixture: "K9/rouge : version montée à la main sans scellé", attendu: "FAIL", obtenu: k9(ecrire("k9-v.jsonl", [metaK9.replace("0.0.1", "0.0.2"), service({})]), journalA, /dernière version scellée est 0\.0\.1/) });
  resultats.push({ fixture: "K9/rouge : journal en recul (0.0.2 puis 0.0.1)", attendu: "FAIL", obtenu: k9(instA, ecrire("k9-journal-r.jsonl", [ligneJ("0.0.2", "2026-08-13", instA), ligneJ("0.0.1", "2026-08-14", instA)]), /réutilisée ou en recul/) });
  resultats.push({ fixture: "K9/rouge : journal absent", attendu: "FAIL", obtenu: k9(instA, join(dossier, "absent.jsonl"), /absent ou vide/) });
  const instC = ecrire("k9-c.jsonl", [metaK9, service({}), svcB]);
  const journalC = ecrire("k9-journal-c.jsonl", [ligneJ("0.0.1", "2026-08-12", instA)]);
  const scelle = sceller({ source: instC, journal: journalC, jour: "2026-11-16" });
  resultats.push({ fixture: "K9/remède : --sceller monte la version (0.1.0) et date le contenu", attendu: "scelle 0.1.0 2026-11-16", obtenu: `${scelle.action} ${scelle.version} ${scelle.genere}` });
  resultats.push({ fixture: "K9/remède : après --sceller, K9 passe", attendu: "PASS", obtenu: k9(instC, journalC) });
  resultats.push({ fixture: "K9/remède : --sceller rejoué ne change plus rien", attendu: "inchange", obtenu: sceller({ source: instC, journal: journalC, jour: "2026-12-01" }).action });
  resultats.push({ fixture: "K9/catalogue réel : contenu = dernière version scellée", attendu: "PASS", obtenu: k9(join(ICI, "..", "catalogues", "catalogue.jsonl"), join(ICI, "..", "catalogues", "versions.jsonl")) });

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
    oracle: "oracle-catalogues", version: "1.1.0", verdict: echecs ? "FAIL" : "PASS", findings,
    non_juge: ["la véracité métier des preuves citées (relève des oracles des forges)", "la qualité des intentions rédigées"],
  }, null, 1));
  process.exit(echecs ? 1 : 0);
}
