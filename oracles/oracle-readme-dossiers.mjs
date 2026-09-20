#!/usr/bin/env node
/**
 * oracle-readme-dossiers.mjs — juge que chaque dossier d'input\ et d'output\ porte un
 * README.md présent, À JOUR (régénération identique) et RÉDIGÉ (rôle écrit à la main).
 * Oracle d'ÉTAT (I4) : il juge le parc réel, le générateur étant la seule source de la forme.
 *
 * Règles : RD1 aucun README absent · RD2 aucun README périmé · RD3 aucun rôle non rédigé.
 * Usage : node oracle-readme-dossiers.mjs [--base <dépôt>]   → verdict JSON, exit 0/1
 *         node oracle-readme-dossiers.mjs --self-test          → arbre éphémère, double sens
 * Remède nommé : node scripts\readme-dossiers.mjs (puis rédiger le rôle dans le bloc ROLE).
 */
// Exit : 0 = conforme · 1 = defaut MESURE · 2 = SANS_OBJET, et c'est son SEUL chemin « je ne peux
// pas mesurer » (TF-1133, 15/09/2026) : les tables de pseudonymisation sont introuvables. Le
// générateur pseudonymise tout index qu'il écrit (D-37) et refuse d'écrire celui qu'il ne peut pas
// pseudonymiser ; sans les tables, la fraîcheur d'un README n'est donc pas mesurable. C'est le cas
// d'un clone frais et d'un runner hébergé, où le canal confidentiel n'existe pas par construction :
// l'oracle y rendait 21 « périmés » sur un arbre à jour. Le dire vaut mieux qu'un rouge sur un parc
// absent — et un contrat muet laisserait croire qu'un 1 peut être une panne d'environnement (TF-0648).
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cheminsTables } from "../scripts/lib-confidentiel.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const GENERATEUR = join(ICI, "..", "scripts", "readme-dossiers.mjs");
const args = process.argv.slice(2);

function juger(base, racines) {
  const argv = [GENERATEUR, "--check", "--base", base];
  if (racines) argv.push("--racines", racines);
  const r = spawnSync(process.execPath, argv, { encoding: "utf8" });
  const lignes = (r.stderr || "").split("\n").map((l) => l.trim()).filter((l) => l.startsWith("- "));
  const findings = [];
  const par = (motif, regle, libelle) => {
    const hits = lignes.filter((l) => motif.test(l));
    hits.length ? findings.push({ regle, statut: "FAIL", message: `${hits.length} README ${libelle} : ${hits.map((h) => h.slice(2)).join(" · ")}` })
      : findings.push({ regle, statut: "PASS", message: `aucun README ${libelle}` });
  };
  par(/: absent$/, "RD1", "absent");
  par(/: périmé/, "RD2", "périmé");
  par(/rôle non rédigé/, "RD3", "au rôle non rédigé");
  if (r.status !== 0 && !findings.some((f) => f.statut === "FAIL"))
    findings.push({ regle: "RD1", statut: "FAIL", message: `générateur en échec : ${(r.stderr || r.stdout).slice(0, 200)}` });
  return findings;
}

const NON_JUGE = [
  "la justesse du rôle rédigé — l'oracle tient la présence et la fraîcheur, pas le fond",
  "les dossiers cachés (`.oracles\\`, `.git\\`) : journaux machine, comptés au README du parent, sans README propre",
  "sans les tables de pseudonymisation (canal confidentiel absent : clone frais, runner hébergé), RD1 à RD3 ne sont PAS jugés — SANS_OBJET, exit 2, motif écrit (TF-1133)",
];

if (args.includes("--self-test")) {
  const base = mkdtempSync(join(tmpdir(), "readme-"));
  // TF-1133 : le générateur pseudonymise ce qu'il écrit ; la recette lui donne des tables INVENTÉES,
  // les siennes, désignées pour ce processus et ses sous-processus. Sans elles, elle lisait les
  // tables réelles du canal de ce poste, et échouait sur un clone frais (RD2 au lieu de RD1 et RD3).
  const tables = mkdtempSync(join(tmpdir(), "readme-tables-"));
  writeFileSync(join(tables, "_noms-interdits.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
  writeFileSync(join(tables, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(tables, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(tables, "_produits-pseudonymes.json");
  const casse = [];
  try {
    mkdirSync(join(base, "input", "sous"), { recursive: true });
    mkdirSync(join(base, "output"));
    writeFileSync(join(base, "input", "a.md"), "# Document A\n");
    writeFileSync(join(base, "input", "sous", "b.jsonl"), '{"x":1}\n');
    const etat = (nom, attendu, regles) => {
      const f = juger(base, "input,output");
      const fails = new Set(f.filter((x) => x.statut === "FAIL").map((x) => x.regle));
      const ok = attendu === "PASS" ? fails.size === 0 : regles.every((r) => fails.has(r));
      if (!ok) casse.push(`${nom} : attendu ${attendu}${regles ? " sur " + regles.join("/") : ""}, obtenu ${fails.size ? [...fails].join("/") : "PASS"}`);
    };
    etat("sans README", "FAIL", ["RD1"]);
    spawnSync(process.execPath, [GENERATEUR, "--base", base, "--racines", "input,output", "--silencieux"], { encoding: "utf8" });
    etat("générés mais rôles non rédigés", "FAIL", ["RD3"]);
    for (const d of ["input", "input/sous", "output"]) {
      const p = join(base, d, "README.md");
      writeFileSync(p, readFileSync(p, "utf8").replace(/<!-- ROLE:DEBUT -->[\s\S]*?<!-- ROLE:FIN -->/, "<!-- ROLE:DEBUT -->\nRôle rédigé pour la recette.\n<!-- ROLE:FIN -->"));
    }
    spawnSync(process.execPath, [GENERATEUR, "--base", base, "--racines", "input,output", "--silencieux"], { encoding: "utf8" });
    etat("rédigés et à jour", "PASS");
    writeFileSync(join(base, "input", "c.md"), "# Nouveau\n");
    etat("fichier ajouté sans régénération", "FAIL", ["RD2"]);
    spawnSync(process.execPath, [GENERATEUR, "--base", base, "--racines", "input,output", "--silencieux"], { encoding: "utf8" });
    etat("régénéré après ajout", "PASS");
    const role = readFileSync(join(base, "input", "README.md"), "utf8");
    if (!/Rôle rédigé pour la recette/.test(role)) casse.push("le rôle rédigé à la main n'a pas survécu à la régénération");
    // TF-1133 — le MODE RÉEL, dans les deux sens : tables présentes → jugé (PASS sur l'arbre à
    // jour) ; tables absentes → SANS_OBJET, exit 2, et le motif le dit. Un parc absent ne rend pas
    // rouge, et un parc présent n'est jamais déclaré sans objet.
    const modeReel = (env) => {
      const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--base", base], { encoding: "utf8", env: { ...process.env, ...env } });
      let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie non JSON : le code tranche */ }
      return { code: r.status, verdict: j?.verdict, motif: j?.motif || "" };
    };
    const avec = modeReel({});
    if (avec.code !== 0 || avec.verdict !== "PASS") casse.push(`mode réel, tables présentes : attendu PASS exit 0, obtenu ${avec.verdict} exit ${avec.code}`);
    const sans = modeReel({ FORGE_NOMS_INTERDITS: join(tables, "absente.json") });
    if (sans.code !== 2 || sans.verdict !== "SANS_OBJET" || !/tables de pseudonymisation introuvables/.test(sans.motif))
      casse.push(`mode réel, tables absentes : attendu SANS_OBJET exit 2 avec son motif, obtenu ${sans.verdict} exit ${sans.code}`);
  } catch (e) { casse.push(`harnais : ${String(e).slice(0, 200)}`); }
  finally {
    try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ }
    try { rmSync(tables, { recursive: true, force: true }); } catch { /* toléré */ }
  }
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ") : "Self-test readme-dossiers : 7/7 (absent, non rédigé, à jour, périmé après ajout, régénéré — rôle manuel préservé ; mode réel jugé avec les tables, SANS_OBJET sans elles)");
  process.exit(casse.length ? 1 : 0);
}

const iBase = args.indexOf("--base");
const base = iBase >= 0 ? args[iBase + 1] : join(ICI, "..");
// TF-1133 — CRITÈRE « PARC ABSENT » de cet oracle : l'une des deux tables de pseudonymisation est
// introuvable là où `lib-confidentiel` la cherche (variable, canal, anciens fichiers).
const tables = cheminsTables();
const manquantes = [["clients", tables.clients], ["produits", tables.produits]].filter(([, c]) => !existsSync(c));
if (manquantes.length) {
  const motif = `tables de pseudonymisation introuvables (${manquantes.map(([n, c]) => `${n} : ${c}`).join(" ; ")}) — `
    + "le canal confidentiel n'est pas sur ce poste (clone frais, runner hébergé). Le générateur refuse d'écrire un index qu'il ne "
    + "peut pas pseudonymiser (D-37) : la fraîcheur des README n'est pas mesurable ici, rien n'est jugé (TF-1133)";
  console.log(JSON.stringify({ oracle: "oracle-readme-dossiers", version: "1.0.0", cible: base, verdict: "SANS_OBJET", motif, findings: [], non_juge: NON_JUGE }, null, 1));
  process.exit(2);
}
const findings = juger(base);
const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
console.log(JSON.stringify({ oracle: "oracle-readme-dossiers", version: "1.0.0", cible: base, verdict, findings, non_juge: NON_JUGE,
  remede: "node scripts\\readme-dossiers.mjs — puis rédiger le bloc ROLE des README signalés" }, null, 1));
process.exit(verdict === "PASS" ? 0 : 1);
