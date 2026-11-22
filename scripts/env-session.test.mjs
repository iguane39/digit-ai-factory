#!/usr/bin/env node
/**
 * env-session.test.mjs — recette de `env-session.mjs`, la voie que propose le refus de `oracles\hook-gardes-commande.mjs` (TF-2721, 22/11/2026).
 *
 * Sens vert : le relevé rend les variables ordinaires en clair, `--noms` rend les seuls noms, `--var` rend une variable ordinaire, `--presente` répond oui ou non.
 * Sens rouge : AUCUNE valeur de jeton (par le nom de la variable ou par la forme de la valeur) n'apparaît sur la sortie standard ni sur la sortie d'erreur, quelle
 * que soit l'option ; une longueur de valeur n'est jamais révélée ; un usage faux est refusé. Les valeurs sont FICTIVES : aucune vraie variable n'est lue pour la preuve.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { aMasquer, MASQUE, nomSecret, principal, releve, valeurAffichable, valeurJeton } from "./env-session.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "env-session.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

// Des valeurs FICTIVES, reconnaissables : si l'une d'elles sort, le script a fui.
const ENV = {
  FORGE_ROOT: "C:\\dev",
  CLAUDE_CODE_MESSAGING_TOKEN: "jeton-fictif-messagerie-0001",
  MON_API_KEY: "cle-fictive-0002",
  PASSWORD_BASE: "mdp-fictif-0003",
  SANS_NOM_EVOCATEUR: "ghp_fictifFICTIFfictifFICTIF0004abcdef",
  VALEUR_OPAQUE: "AbCdEfGhIjKlMnOpQrStUvWxYz0123456789fictif",
  GIT_AUTHOR_NAME: "Auteur Fictif",
  VIDE: "",
  NODE_ENV: "test",
};
const FUITES = ["jeton-fictif-messagerie-0001", "cle-fictive-0002", "mdp-fictif-0003", "ghp_fictif", "AbCdEfGhIjKlMnOp"];
const lancer = (args) => { const e = { ...ENV, PATH: process.env.PATH, SystemRoot: process.env.SystemRoot }; const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env: e }); return { code: r.status, out: r.stdout || "", err: r.stderr || "" }; };

check("vert — le relevé rend les variables ordinaires en clair (FORGE_ROOT, NODE_ENV, un nom en AUTHOR n'est pas un secret) et une variable vide reste vide", () => {
  const r = lancer([]);
  att(r.code === 0 && /^FORGE_ROOT=C:\\dev$/m.test(r.out) && /^NODE_ENV=test$/m.test(r.out) && /^GIT_AUTHOR_NAME=Auteur Fictif$/m.test(r.out), r.out.slice(0, 300));
  att(/^VIDE=$/m.test(r.out), "une variable vide n'est pas rendue vide");
});
check("rouge — aucune valeur de jeton ne sort, ni par le nom de la variable, ni par la forme de la valeur, dans aucune option", () => {
  for (const args of [[], ["--noms"], ["--var", "CLAUDE_CODE_MESSAGING_TOKEN"], ["--var", "SANS_NOM_EVOCATEUR"], ["--var", "VALEUR_OPAQUE"], ["--filtre", "KEY"], ["--filtre", "token"], ["--presente", "MON_API_KEY"]]) {
    const r = lancer(args);
    for (const f of FUITES) att(!r.out.includes(f) && !r.err.includes(f), `${args.join(" ") || "(sans option)"} : « ${f} » est sorti`);
  }
  const rel = lancer([]).out;
  att(rel.includes(`CLAUDE_CODE_MESSAGING_TOKEN=${MASQUE}`) && rel.includes(`SANS_NOM_EVOCATEUR=${MASQUE}`) && rel.includes(`VALEUR_OPAQUE=${MASQUE}`), "les jetons ne sont pas remplacés par le masque");
  att(!/\*{9,}|\*{7}$/m.test(rel.replace(/\*{8}/g, "")), "la longueur d'une valeur est révélée par le masque");
});
check("vert — `--noms` rend les seuls noms ; `--var` rend une variable ordinaire et dit « absente » pour une inconnue ; `--presente` rend oui (exit 0) ou non (exit 1)", () => {
  const n = lancer(["--noms"]); att(n.out.split("\n").includes("FORGE_ROOT") && !/=/.test(n.out), `noms : ${n.out.slice(0, 200)}`);
  att(lancer(["--var", "NODE_ENV"]).out.trim() === "NODE_ENV=test", "--var d'une variable ordinaire");
  att(/absente/.test(lancer(["--var", "N_EXISTE_PAS"]).out), "--var d'une variable inconnue");
  const oui = lancer(["--presente", "MON_API_KEY"]), non = lancer(["--presente", "N_EXISTE_PAS"]), vide = lancer(["--presente", "VIDE"]);
  att(oui.code === 0 && oui.out.trim() === "oui" && non.code === 1 && non.out.trim() === "non" && vide.code === 1, `presente : ${oui.code}/${non.code}/${vide.code}`);
});
check("le jugement : nom évocateur, forme de jeton (préfixes, valeur opaque de 32 caractères et plus), chemin et phrase jamais pris pour un jeton", () => {
  for (const n of ["X_TOKEN", "GITHUB_PAT", "AWS_SECRET_ACCESS_KEY", "DB_PASSWORD", "MA_CLE_API_KEY", "SIGNING_KEY"]) att(nomSecret(n), `${n} n'est pas jugé secret`);
  for (const n of ["FORGE_ROOT", "GIT_AUTHOR_NAME", "PATH", "NODE_ENV", "KEYBOARD_LAYOUT"]) att(!nomSecret(n), `${n} est jugé secret`);
  att(valeurJeton("ghp_abcdefghijklmnop") && valeurJeton("github_pat_abcdef") && valeurJeton("sk-abcdefghij") && valeurJeton("eyJhbGciOiJIUzI1NiJ9.x") && valeurJeton("A".repeat(40)), "une forme de jeton n'est pas reconnue");
  att(!valeurJeton("C:\\Users\\x\\un\\chemin\\assez\\long\\pour\\depasser\\trente-deux") && !valeurJeton("une phrase ordinaire avec des espaces et plus de trente-deux caractères"), "un chemin ou une phrase est pris pour un jeton");
  att(aMasquer("X_TOKEN", "a") && !aMasquer("FORGE_ROOT", "C:\\dev") && valeurAffichable("VIDE", "") === "", "aMasquer / valeurAffichable");
  const r = releve({ B: "2", A: "1", T_TOKEN: "x" }, { filtre: "t" });
  att(r.lignes.join("|") === `T_TOKEN=${MASQUE}` && r.total === 1, `filtre : ${r.lignes}`);
});
check("rouge — usage faux : option inconnue, valeur manquante (exit 2), et `principal` n'écrit rien sur la sortie d'erreur en usage normal", () => {
  att(lancer(["--tout"]).code === 2 && lancer(["--var"]).code === 2 && lancer(["--presente"]).code === 2, "un usage faux est accepté");
  const sorties = []; principal(["--noms"], { A: "1" }, (t) => sorties.push(t), () => { throw new Error("écrit sur la sortie d'erreur"); });
  att(sorties.join() === "A", "principal --noms");
});

console.log(`\nenv-session (TF-2721) : ${pass} PASS, ${fail} FAIL — cas rouges : jeton par le nom, jeton par la forme, longueur non révélée, usage faux`);
process.exit(fail ? 1 : 0);
