#!/usr/bin/env node
/**
 * hook-sessions.test.mjs — recette de l'identité de session et du registre des sessions d'un produit (D-218 (b) du 14/11/2026,
 * mandat 20261114n, 15/11/2026). Joué par oracles/self-tests.mjs (I2).
 *
 * Fixtures à double sens, une section par item du mandat :
 *   I1 — l'identité : la source unique de `lib-session.mjs`, la variable posée au fichier `CLAUDE_ENV_FILE` et rejouée avant la
 *        commande, la signature de `lib-decisions.mjs` (rouge : le mutant qui relit la seule variable héritée signe du nom de la mère).
 */
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ID_POSABLE, SOURCES, VARIABLE_SESSION, court, ligneVariable, poserVariable, sessionCourante, signature } from "./lib-session.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "hook-sessions-"));
const MERE = "74dc7ecb-d93f-4110-bebc-19bf7aa9011b", ENFANT = "0e40d4f5-1111-4222-8333-944445555666";
/** L'environnement de la recette, sans l'identité de la session qui la joue : ses cas n'en dépendent pas. */
const ENV_NU = (() => { const e = { ...process.env }; for (const k of [VARIABLE_SESSION, "CLAUDE_CODE_SESSION_ID", "CLAUDE_ENV_FILE", "CLAUDE_PROJECT_DIR"]) delete e[k]; return e; })();
const envAvec = (vars) => ({ ...ENV_NU, ...vars });

try {
  // ---- I1 — l'identité de session --------------------------------------------------------------------------------------------
  check("I1 — l'ordre des sources : explicite, puis hook, puis la variable du SessionStart, puis la variable héritée, sinon inconnue", () => {
    const env = { [VARIABLE_SESSION]: ENFANT, CLAUDE_CODE_SESSION_ID: MERE };
    const cas = [
      [sessionCourante({ explicite: "manuel", entree: { session_id: "S-hook" }, env }), "manuel", SOURCES.ARGUMENT],
      [sessionCourante({ entree: { session_id: "S-hook" }, env }), "S-hook", SOURCES.HOOK],
      [sessionCourante({ env }), ENFANT, SOURCES.SESSION_START],
      [sessionCourante({ env: { CLAUDE_CODE_SESSION_ID: MERE } }), MERE, SOURCES.HERITEE],
      [sessionCourante({ env: {} }), null, SOURCES.INCONNUE],
      [sessionCourante({ entree: { session_id: "  " }, env: { [VARIABLE_SESSION]: " " } }), null, SOURCES.INCONNUE],
    ];
    for (const [s, id, source] of cas) att(s.id === id && s.source === source && s.court === court(id), `attendu ${id}/${source}, lu ${JSON.stringify(s)}`);
    const sig = signature({ env });
    att(sig.session === "0e40d4f5" && sig.session_source === SOURCES.SESSION_START, JSON.stringify(sig));
  });

  // Une réservation de D-N au registre du pilot, jouée dans un processus dont l'environnement est celui d'une session enfant.
  const reserverDans = (dossierOracles, env) => {
    const registre = join(T, `registre-${Math.random().toString(36).slice(2)}.jsonl`);
    const url = pathToFileURL(join(dossierOracles, "lib-decisions.mjs")).href;
    const code = `import(${JSON.stringify(url)}).then((m) => m.reserverAuPilot({ question: "Faut-il garder la version du jeudi pour la revue ?", fichier: ${JSON.stringify(registre)} }))`
      + ".catch((e) => { console.error(e.message); process.exit(1); })";
    const r = spawnSync(process.execPath, ["-e", code], { encoding: "utf8", env });
    const entree = existsSync(registre) ? JSON.parse(readFileSync(registre, "utf8").trim().split("\n").at(-1)) : null;
    return { r, entree };
  };
  const ENV_ENFANT = envAvec({ CLAUDE_CODE_SESSION_ID: MERE, [VARIABLE_SESSION]: ENFANT });
  check("I1 vert — une session enfant qui a posé sa variable réserve une D-N signée de son propre nom (lib-decisions.mjs, ligne 111)", () => {
    const { r, entree } = reserverDans(ICI, ENV_ENFANT);
    att(r.status === 0 && entree?.session === "0e40d4f5" && entree?.session_source === SOURCES.SESSION_START, `exit ${r.status} ${r.stderr} ${JSON.stringify(entree)}`);
  });
  check("I1 rouge — le mutant qui relit la seule variable héritée (la ligne 111 d'avant) signe la D-N du nom de la mère (RP-25)", () => {
    const m = join(T, "mutant", "oracles");
    mkdirSync(m, { recursive: true });
    for (const f of ["lib-decisions.mjs", "lib-session.mjs"]) copyFileSync(join(ICI, f), join(m, f));
    const source = readFileSync(join(m, "lib-decisions.mjs"), "utf8");
    const ligne = "const session = (s) => signature({ explicite: s });";
    att(source.includes(ligne), "la ligne visée par la chirurgie est introuvable : le témoin est vide");
    writeFileSync(join(m, "lib-decisions.mjs"), source.replace(ligne, 'const session = (s) => ({ session: String(s || process.env.CLAUDE_CODE_SESSION_ID || "").slice(0, 8) || null });'), "utf8");
    const { r, entree } = reserverDans(m, ENV_ENFANT);
    att(r.status === 0 && entree?.session === "74dc7ecb", `le mutant devait signer du nom de la mère : exit ${r.status} ${r.stderr} ${JSON.stringify(entree)}`);
  });
  check("I1 vert — sans variable posée, la D-N reste signée de la variable héritée, et la source le dit : heritee_possible", () => {
    const { r, entree } = reserverDans(ICI, envAvec({ CLAUDE_CODE_SESSION_ID: MERE }));
    att(r.status === 0 && entree?.session === "74dc7ecb" && entree?.session_source === SOURCES.HERITEE, `exit ${r.status} ${JSON.stringify(entree)}`);
  });

  check("I1 — la variable se pose en ajout au fichier CLAUDE_ENV_FILE, et se refuse sans fichier ou pour un identifiant qui demanderait des guillemets", () => {
    const f = join(T, "env-session.sh");
    writeFileSync(f, "export AUTRE_HOOK=1", "utf8");                       // un autre hook a écrit sans saut de ligne final
    const ok = poserVariable(ENFANT, { CLAUDE_ENV_FILE: f });
    att(ok.pose && readFileSync(f, "utf8") === `export AUTRE_HOOK=1\n${ligneVariable(ENFANT)}\n`, `contenu : ${JSON.stringify(readFileSync(f, "utf8"))}`);
    att(!poserVariable(ENFANT, {}).pose, "posée sans CLAUDE_ENV_FILE");
    const refus = poserVariable("a b; rm -rf x", { CLAUDE_ENV_FILE: f });
    att(!refus.pose && /non posable/.test(refus.raison) && !ID_POSABLE.test("a b"), JSON.stringify(refus));
    att(readFileSync(f, "utf8").split("\n").filter(Boolean).length === 2, "le refus a écrit au fichier");
  });

  // Le harnais rejoue le fichier avant chaque commande Bash (documentation, « Persist environment variables ») : une session enfant
  // hérite FORGE_SESSION_ID et CLAUDE_CODE_SESSION_ID de sa mère, son SessionStart pose sa variable, la commande lit la sienne.
  const bash = ["bash"].find((b) => { const r = spawnSync(b, ["--version"], { encoding: "utf8" }); return !r.error && r.status === 0; });
  if (!bash) console.log("  [NON JOUÉ] I1 — rejeu du fichier par bash : aucun bash sur ce poste (ni pour ni contre)");
  else check("I1 vert — le fichier rejoué avant la commande recouvre la variable héritée de la mère : la commande lit l'identifiant de l'enfant", () => {
    const f = join(T, "env-enfant.sh");
    att(poserVariable(ENFANT, { CLAUDE_ENV_FILE: f }).pose, "variable non posée");
    const lib = pathToFileURL(join(ICI, "lib-session.mjs")).href;
    const node = process.execPath.replaceAll("\\", "/");
    const commande = `source "${f.replaceAll("\\", "/")}"; "${node}" -e 'import("${lib}").then((m) => console.log(JSON.stringify(m.sessionCourante())))'`;
    const r = spawnSync(bash, ["-c", commande], { encoding: "utf8", env: envAvec({ CLAUDE_CODE_SESSION_ID: MERE, [VARIABLE_SESSION]: MERE }) });
    let s = null; try { s = JSON.parse(r.stdout.trim()); } catch { /* le cas le dit */ }
    att(r.status === 0 && s?.id === ENFANT && s?.source === SOURCES.SESSION_START, `exit ${r.status} ${r.stdout}${r.stderr}`);
    const sans = spawnSync(bash, ["-c", commande.replace(/^source "[^"]+"; /, "")], { encoding: "utf8", env: envAvec({ CLAUDE_CODE_SESSION_ID: MERE, [VARIABLE_SESSION]: MERE }) });
    let s2 = null; try { s2 = JSON.parse(sans.stdout.trim()); } catch { /* le cas le dit */ }
    att(s2?.id === MERE, `rouge : sans le fichier rejoué, la commande devait lire l'identifiant hérité de la mère, lu ${sans.stdout}${sans.stderr}`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(T, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nhook-sessions (D-218 (b)) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
