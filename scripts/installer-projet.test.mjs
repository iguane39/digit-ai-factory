#!/usr/bin/env node
/**
 * installer-projet.test.mjs — recette de `installer-projet.mjs` (TF-1637).
 *
 * Les deux sens sur chaque promesse, sur des projets FABRIQUÉS, bootstrap non joué (il clone le
 * réseau ; le bout en bout se joue à part, sur un poste simulé) :
 *   · un dossier vide ou un projet existant est installé, et ses fichiers d'avant sont intacts
 *     octet pour octet ;
 *   · le second passage ne repose rien (idempotence) ;
 *   · le dossier personnel, le pilot et un dossier absent ne sont jamais adoptés ;
 *   · sans bootstrap joué, la bannière ne dit JAMAIS « opérationnelle » (le sens rouge de la
 *     promesse affichée) ;
 *   · les README d'`input\` et `output\` d'un produit reçoivent leur rôle (R-1, R-2).
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import * as INSTALLATEUR from "./installer-projet.mjs";
const { installer, RESEAU_PASSAGER } = INSTALLATEUR;
const banniere = INSTALLATEUR.banniere;   // TF-1696 : lu par l'espace de noms, absent sur l'ancien code

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
const SCRIPT = join(ICI, "installer-projet.mjs");
let ok = 0, ko = 0;
const att = (cond, msg) => { if (cond) ok++; else { ko++; console.log(`  ✗ ${msg}`); } };
const empreinte = (f) => createHash("sha256").update(readFileSync(f)).digest("hex"); // empreinte-brute-ok : prouve qu'aucun octet d'un fichier du projet n'a bougé, fins de ligne comprises
const base = mkdtempSync(join(tmpdir(), "installer-projet-"));
const ctl = (r, quoi) => r.controles.find((c) => c.quoi === quoi);

try {
  // 1. Projet existant : installé, fichiers d'avant intacts, git local posé, hameçons câblés.
  const p1 = join(base, "projet-existant");
  mkdirSync(join(p1, "src"), { recursive: true });
  writeFileSync(join(p1, "src", "app.js"), "export const a = 1;\n");
  writeFileSync(join(p1, "README.md"), "# Mon projet\n");
  const avant = { app: empreinte(join(p1, "src", "app.js")), readme: empreinte(join(p1, "README.md")) };
  const r1 = installer({ projet: p1, sansBootstrap: true });
  att(r1.nature.startsWith("socle Factory posé"), `projet existant : nature « socle Factory posé… » attendue, lu « ${r1.nature} »`);
  att(ctl(r1, "adoption du projet")?.ok === true, "projet existant : adoption verte");
  att(empreinte(join(p1, "src", "app.js")) === avant.app && empreinte(join(p1, "README.md")) === avant.readme, "projet existant : un fichier d'avant a changé");
  att(existsSync(join(p1, ".git")), "projet existant : dépôt git local non créé");
  att(ctl(r1, "hameçons du projet")?.ok === true, "projet existant : hameçons non câblés");
  att(ctl(r1, "README d'input\\ et output\\")?.ok === true, "projet existant : README d'input/output sans rôle (R-1, R-2)");
  att(readFileSync(join(p1, "input", "README.md"), "utf8").includes("Entrants du projet"), "projet existant : rôle d'input\\ absent du README");

  // 1 bis. TF-1696 (15/10/2026) — l'installateur JOUE la conformité et la rend comme reste à faire.
  // Le fait : « OPÉRATIONNELLE », 8/8 verts, exit 0, au même instant qu'oracle-conformite-projet rendait
  // FAIL (R-12, R-13, R-20) sur le même projet. Rouge sur l'ancien code : aucun champ `conformite`.
  att(r1.conformite?.verdict === "FAIL", `TF-1696 : la conformité n'est pas jouée par l'installateur (lu ${JSON.stringify(r1.conformite)})`);
  att(["R-13", "R-20"].every((x) => (r1.conformite?.fails || []).some((f) => f.regle === x)), `TF-1696 : les FAIL de conformité ne sont pas rendus (lu ${JSON.stringify((r1.conformite?.fails || []).map((f) => f.regle))})`);
  if (typeof banniere === "function") {
    const b = banniere({ ...r1, operationnelle: true, sortieBootstrap: "" });
    att(/OPÉRATIONNELLE/.test(b) && !/prête à être utilisée/.test(b), "TF-1696 : bannière « prête à être utilisée » sur un projet que la conformité juge FAIL");
    att(/reste\(s\) à faire avant l'ouverture du run/.test(b) && /R-20/.test(b) && /ouvrir-run\.mjs/.test(b), "TF-1696 : la bannière ne liste pas les restes à faire ni le geste qui les pose");
    const v = banniere({ ...r1, operationnelle: true, sortieBootstrap: "", conformite: { verdict: "PASS", fails: [] } });
    att(/prête à être utilisée/.test(v) && !/reste\(s\) à faire/.test(v), "TF-1696 sens vert : une conformité PASS ne doit rien ajouter");
  } else att(false, "TF-1696 : la bannière n'est pas exportée, son texte n'est pas jugeable");

  // 2. Sens rouge de la bannière : bootstrap non joué → jamais « opérationnelle ».
  att(r1.operationnelle === false, "sans bootstrap, l'installation s'est dite opérationnelle");
  const cli = spawnSync(process.execPath, [SCRIPT, p1, "--sans-bootstrap"], { encoding: "utf8" });
  att(cli.status === 1, `CLI sans bootstrap : exit 1 attendu, lu ${cli.status}`);
  att(/INSTALLATION INCOMPLÈTE/.test(cli.stdout) && !/OPÉRATIONNELLE —/.test(cli.stdout), "CLI sans bootstrap : bannière « INCOMPLÈTE » attendue, seule");

  // 3. Idempotence : le second passage voit forge\ et ne repose rien.
  const settingsAvant = empreinte(join(p1, ".claude", "settings.json"));
  const r2 = installer({ projet: p1, sansBootstrap: true });
  att(r2.nature === "instrumenté", `second passage : nature « instrumenté » attendue, lu « ${r2.nature} »`);
  att(empreinte(join(p1, ".claude", "settings.json")) === settingsAvant, "second passage : .claude/settings.json réécrit");

  // 4. Dossier vide (nouveau produit) : installé.
  const p2 = join(base, "produit-neuf");
  mkdirSync(p2);
  const r3 = installer({ projet: p2, sansBootstrap: true });
  att(ctl(r3, "adoption du projet")?.ok === true && existsSync(join(p2, "forge")), "dossier vide : socle non posé");

  // 5. Gardes : dossier personnel, pilot, dossier absent — rien n'est posé.
  const rh = installer({ projet: homedir(), sansBootstrap: true });
  att(ctl(rh, "projet")?.ok === false && !existsSync(join(homedir(), "forge", "travaux", "ECARTS-ASSUMES.md")), "dossier personnel : adopté au lieu d'être refusé");
  const rp = installer({ projet: PILOT, sansBootstrap: true });
  att(rp.nature === "pilot" && !ctl(rp, "adoption du projet"), "pilot : adoption jouée sur le pilot");
  att(!rp.conformite, "TF-1696 : la conformité d'un PRODUIT est jouée sur le pilot");
  const ra = installer({ projet: join(base, "absent"), sansBootstrap: true });
  att(ctl(ra, "projet")?.ok === false && !existsSync(join(base, "absent")), "dossier absent : créé ou jugé vert");

  // 6. Usage : une option inconnue est refusée en exit 2.
  att(spawnSync(process.execPath, [SCRIPT, "--oui"], { encoding: "utf8" }).status === 2, "option inconnue : exit 2 attendu");

  // 7. Seconde tentative du bootstrap : la signature réseau passager se reconnaît, et elle ne se
  // confond ni avec un refus d'accès à un dépôt privé ni avec un défaut réel (sinon la reprise
  // masquerait un défaut, ou tournerait pour rien).
  att(RESEAU_PASSAGER.test("fatal: unable to access 'https://github.com/x/y.git/': Empty reply from server"), "réseau : « Empty reply from server » non reconnu");
  att(RESEAU_PASSAGER.test("fatal: unable to access 'https://github.com/x/y.git/': Failed to connect to github.com port 443"), "réseau : « Failed to connect » non reconnu");
  att(!RESEAU_PASSAGER.test("fatal: could not read Username for 'https://github.com': terminal prompts disabled"), "réseau : un refus d'accès est pris pour un incident réseau");
  att(!RESEAU_PASSAGER.test("[DEFAUT] digit-ai-forge-tests — DIVERGÉ (2 devant, 3 derrière)"), "réseau : un défaut réel est pris pour un incident réseau");
} finally {
  rmSync(base, { recursive: true, force: true });
}

console.log(`installer-projet : ${ok}/${ok + ko} tests verts — cas rouges : sans bootstrap la bannière ne dit pas « opérationnelle » (exit 1), dossier personnel refusé, refus d'accès non pris pour un incident réseau`);
process.exit(ko ? 1 : 0);
