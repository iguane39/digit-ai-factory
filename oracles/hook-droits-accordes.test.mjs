#!/usr/bin/env node
/**
 * hook-droits-accordes.test.mjs — le contrôle des droits accordés se joue à l'ÉCRITURE du script (TF-1528).
 * Deux sens sur le fait du 16/09/2026 : un script d'octroi fautif (identifiant Graph écrit de mémoire,
 * échec masqué, succès annoncé sans relecture) est signalé dès l'écriture, exit 0 ; son remède (identifiant
 * officiel, échec non masqué, relecture avant l'annonce) est JOUÉ et ne signale plus rien. Un script
 * ordinaire reste muet, et une extension hors scripts n'est pas visée. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fichierVise } from "./hook-droits-accordes.mjs";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-droits-accordes.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const D = mkdtempSync(join(tmpdir(), "droits-"));
const NL = String.fromCharCode(10);
const ecrire = (nom, lignes) => { const f = join(D, nom); writeFileSync(f, lignes.join(NL) + NL, "utf8"); return f; };
const jouer = (f) => { const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ tool_name: "Write", tool_input: { file_path: f } }) }); return { code: r.status, out: (r.stdout || "") + (r.stderr || "") }; };

const APP = "00000003-0000-0000-c000-000000000000";
const FAUX = "18a4783c-866b-4cc7-a460-3d0e455740fd";   // écrit de mémoire : le fait du 16/09
const VRAI = "18a4783c-866b-4cc7-a460-3d5e5662c884";   // Application.ReadWrite.OwnedBy, table officielle

const fautif = ecrire("octroi-fautif.sh", [
  `az ad app permission add --id ${APP} --api-permissions ${FAUX}=Role 2>/dev/null || true`,
  "echo consentie",
]);
const corrige = ecrire("octroi-corrige.sh", [
  "set -e",
  `az ad app permission add --id ${APP} --api-permissions ${VRAI}=Role`,
  "az ad app permission list --id $APP_ID --query \"[].resourceAccess\" -o tsv",
  "echo ok",
]);
const ordinaire = ecrire("build.sh", ["npm ci", "npm run build", "echo termine"]);

check("rouge — un script d'octroi fautif est signalé à l'écriture (DA-1, DA-2, DA-3), le hook rend 0", () => {
  const r = jouer(fautif);
  if (r.code !== 0) throw new Error(`exit ${r.code} : un avertissement ne bloque jamais`);
  for (const regle of ["DA-1", "DA-2", "DA-3"]) if (!r.out.includes(regle)) throw new Error(`${regle} absent : ${r.out.slice(0, 300)}`);
  if (!/TF-1528.*non bloquant/.test(r.out)) throw new Error("l'avertissement ne se dit pas non bloquant");
});
check("vert — le remède (identifiant officiel, échec non masqué, relecture avant l'annonce) ne signale plus rien", () => {
  const r = jouer(corrige);
  if (r.code !== 0 || r.out.trim()) throw new Error(`exit ${r.code}, sortie : ${r.out.slice(0, 300)}`);
});
check("vert — un script ordinaire (aucun identifiant Graph, aucun octroi) reste muet", () => {
  const r = jouer(ordinaire);
  if (r.code !== 0 || r.out.trim()) throw new Error(`bruit sur un script ordinaire : ${r.out.slice(0, 200)}`);
});
check("fichierVise — scripts et infrastructure oui ; Markdown, images, node_modules, old, .oracles non", () => {
  for (const p of ["a/deploy.sh", "a/octroi.ps1", "infra/main.bicep", "infra/main.tf", "ci/pipeline.yml", "scripts/grant.py", "scripts/grant.mjs"])
    if (!fichierVise({ tool_input: { file_path: p } })) throw new Error(`${p} non visé`);
  for (const p of ["a/NOTE.md", "a/logo.png", "node_modules/x/i.js", "old/octroi.sh", "a/.oracles/x.js"])
    if (fichierVise({ tool_input: { file_path: p } })) throw new Error(`${p} visé à tort`);
});
check("un fichier absent ou une entrée illisible ne font rien (exit 0)", () => {
  const r = jouer(join(D, "absent.sh"));
  const s = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "pas du json" });
  if (r.code !== 0 || r.out.trim() || s.status !== 0) throw new Error("bruit ou échec sur une entrée vide");
});

rmSync(D, { recursive: true, force: true });
console.log(`${NL}hook-droits-accordes (TF-1528) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
