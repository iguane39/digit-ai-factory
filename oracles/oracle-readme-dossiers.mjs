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
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

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
];

if (args.includes("--self-test")) {
  const base = mkdtempSync(join(tmpdir(), "readme-"));
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
  } catch (e) { casse.push(`harnais : ${String(e).slice(0, 200)}`); }
  finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ") : "Self-test readme-dossiers : 5/5 (absent, non rédigé, à jour, périmé après ajout, régénéré — rôle manuel préservé)");
  process.exit(casse.length ? 1 : 0);
}

const iBase = args.indexOf("--base");
const base = iBase >= 0 ? args[iBase + 1] : join(ICI, "..");
const findings = juger(base);
const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
console.log(JSON.stringify({ oracle: "oracle-readme-dossiers", version: "1.0.0", cible: base, verdict, findings, non_juge: NON_JUGE,
  remede: "node scripts\\readme-dossiers.mjs — puis rédiger le bloc ROLE des README signalés" }, null, 1));
process.exit(verdict === "PASS" ? 0 : 1);
