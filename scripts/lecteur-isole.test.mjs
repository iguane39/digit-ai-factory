#!/usr/bin/env node
/**
 * lecteur-isole.test.mjs — recette à double sens de `scripts\lecteur-isole.mjs` (TF-2553, TF-2555, 14/11/2026).
 *
 * Aucun appel de modèle : une fausse CLI (un `.js` posé sous `QO_JUGE_CLI`) joue le lecteur selon un scénario. Ce que la recette
 * prouve : (1) la ligne de commande du lecteur isolé porte les cinq verrous de la décision et jamais `--bare` ; (2) la recette
 * TIENT quand le témoin cite le CLAUDE.md, que le lecteur isolé répond AUCUN et que le piège rend NON ; (3) elle ÉCHOUE, pour la
 * bonne raison, quand le lecteur isolé laisse fuir le contexte, quand le piège rend OUI, ou quand le témoin est muet (une sonde qui
 * ne voit pas la fuite ne prouve rien) ; (4) elle REFUSE de jouer (exit 2) sous une clé d'API, qui ferait facturer à l'usage ;
 * (5) une CLI absente ou muette est un exit 3, jamais un verdict.
 * La preuve d'usage sur de vraies lectures (le relevé du produit, TF-2555) est jointe à `references\LECTEUR-ISOLE-ABONNEMENT.md`.
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { argumentsLecteurIsole, ARGUMENTS_TEMOIN, clesPayantes, codeDeBlanc, jetonsEntree, juger, messageDeBlanc, premierMot, resoudreCli } from "./lecteur-isole.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "lecteur-isole.mjs");
let ok = 0, ko = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); ok++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); ko++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };

const base = mkdtempSync(join(tmpdir(), "lecteur-isole-"));
// La fausse CLI lit sa question sur l'entrée standard et répond selon FAUX_SCENARIO. Elle distingue le lecteur isolé du témoin
// par la présence de `--setting-sources`, comme la vraie CLI distingue un contexte chargé d'un contexte vide.
const FAUSSE_CLI = join(base, "fausse-cli.js");
writeFileSync(FAUSSE_CLI, `
const { existsSync, readFileSync } = require("node:fs");
const args = process.argv.slice(2);
let q = ""; process.stdin.setEncoding("utf8"); process.stdin.on("data", (c) => q += c);
process.stdin.on("end", () => {
  const isole = args.includes("--setting-sources") && args.includes("--tools") && args.includes("--strict-mcp-config");
  const s = process.env.FAUX_SCENARIO || "sain";
  const fuite = /CLAUDE\\.md/.test(q);
  // La fausse CLI cite la première ligne du CLAUDE.md du dossier de lancement quand il existe (le marqueur), sinon une ligne fixe.
  const ligneContexte = existsSync("CLAUDE.md") ? readFileSync("CLAUDE.md", "utf8").split(/\\r?\\n/)[0] : "# digit-ai-factory — noyau de pilotage";
  const blanc = /CODE : (\\S+)/.exec(q);
  let r;
  if (s === "muette") process.exit(1);
  if (blanc) r = s === "tronque" ? "INCONNU" : blanc[1];
  else if (!isole) r = s === "temoin-muet" ? "AUCUN" : ligneContexte;
  else if (fuite) r = s === "fuite" ? ligneContexte : "AUCUN";
  else r = s === "piege-rate" ? "OUI" : "NON.";
  const entree = isole ? (s === "contexte-injecte" ? 9000 : 150) : 20000;
  const sortie = { type: "result", is_error: false, result: r, total_cost_usd: 0.01 };
  if (s !== "sans-jetons") sortie.usage = { input_tokens: entree, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
  process.stdout.write(JSON.stringify(sortie));
});
`, "utf8");
const jouer = (scenario, env = {}, extra = [], avecRacine = true) => {
  const e = { ...process.env, QO_JUGE_CLI: FAUSSE_CLI, FAUX_SCENARIO: scenario, ...env };
  for (const k of ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"]) if (!(k in env)) delete e[k];
  return spawnSync(process.execPath, [SCRIPT, "--recette", ...(avecRacine ? ["--racine", base] : []), ...extra], { encoding: "utf8", env: e });
};

try {
  check("la ligne de commande du lecteur isolé porte les cinq verrous de la décision, jamais --bare", () => {
    const a = argumentsLecteurIsole();
    for (const f of ["-p", "--setting-sources", "--system-prompt", "--tools", "--disable-slash-commands", "--strict-mcp-config"]) att(a.includes(f), `${f} absent : ${a}`);
    att(a[a.indexOf("--setting-sources") + 1] === "" && a[a.indexOf("--tools") + 1] === "", "--setting-sources et --tools doivent recevoir la chaîne vide");
    att(!a.includes("--bare") && !ARGUMENTS_TEMOIN.includes("--bare"), "--bare est employé : il exige une clé d'API et laisse l'abonnement de côté");
    att(!ARGUMENTS_TEMOIN.includes("--setting-sources") && !ARGUMENTS_TEMOIN.includes("--tools"), "le témoin porte un verrou : il n'est plus un témoin");
    const c = spawnSync(process.execPath, [SCRIPT, "--commande"], { encoding: "utf8" });
    att(c.status === 0 && /--setting-sources "" --system-prompt/.test(c.stdout) && /--tools ""/.test(c.stdout) && !/--bare/.test(c.stdout), `--commande : ${c.stdout}`);
  });
  check("vert — témoin qui cite, lecteur isolé AUCUN, piège NON : la recette tient (exit 0) et rapporte le coût de la CLI", () => {
    const r = jouer("sain");
    att(r.status === 0 && /TENU/.test(r.stdout) && /3 lancements/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
    att(/0\.03 USD/.test(r.stdout) && /non recompté/.test(r.stdout), `le coût n'est pas rapporté comme tel : ${r.stdout}`);
  });
  check("vert — --json rend le relevé en JSON (3 lancements, aucun défaut, coût rapporté) que la preuve d'usage du document cite", () => {
    const r = jouer("sain", {}, ["--json"]);
    const j = JSON.parse(r.stdout);
    att(r.status === 0 && j.lancements === 3 && Array.isArray(j.defauts) && j.defauts.length === 0 && j.cout_usd_rapporte_par_la_cli === 0.03, `exit ${r.status} : ${r.stdout}`);
    const f = JSON.parse(jouer("fuite", {}, ["--json"]).stdout);
    att(f.defauts.length === 1 && /AUCUN/.test(f.defauts[0]), `la fuite n'est pas dans le JSON : ${JSON.stringify(f)}`);
  });
  check("rouge — le lecteur isolé laisse fuir le contexte (il cite le CLAUDE.md) : défaut nommé, exit 1", () => {
    const r = jouer("fuite");
    att(r.status === 1 && /\[DÉFAUT\] le lecteur ISOLÉ n'a pas répondu AUCUN/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
  });
  check("rouge — le piège rend OUI (le contexte du pilot a été lu) : défaut nommé, exit 1", () => {
    const r = jouer("piege-rate");
    att(r.status === 1 && /\[DÉFAUT\] le lecteur ISOLÉ n'a pas répondu NON/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
  });
  check("rouge — le témoin est muet (il répond AUCUN sans isolement) : la sonde ne prouve rien, exit 1", () => {
    const r = jouer("temoin-muet");
    att(r.status === 1 && /\[DÉFAUT\] le TÉMOIN ne cite pas/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
  });
  check("refus — sous ANTHROPIC_API_KEY ou ANTHROPIC_AUTH_TOKEN la recette ne joue pas (exit 2) et ne demande jamais la valeur", () => {
    for (const k of ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"]) {
      const r = jouer("sain", { [k]: "valeur-factice" });
      att(r.status === 2 && /REFUSÉ/.test(r.stderr) && r.stderr.includes(k) && /facturation passe à l'usage/.test(r.stderr), `${k} : exit ${r.status} ${r.stderr}`);
      att(!r.stderr.includes("valeur-factice") && !r.stdout.includes("valeur-factice"), `${k} : la valeur est répétée`);
    }
    att(clesPayantes({ ANTHROPIC_API_KEY: "x" }).length === 1 && clesPayantes({ CLAUDE_CODE_OAUTH_TOKEN: "x" }).length === 0, "le jeton d'abonnement ne doit pas être refusé");
  });
  check("CLI muette (exit 1, aucune sortie) : exit 3, jamais un verdict ; sans argument : usage exit 2", () => {
    const r = jouer("muette");
    att(r.status === 3 && /lancement « à blanc »/.test(r.stderr), `exit ${r.status} : ${r.stderr}`);
    const u = spawnSync(process.execPath, [SCRIPT], { encoding: "utf8" });
    att(u.status === 2 && /usage/.test(u.stderr), `usage : exit ${u.status} ${u.stderr}`);
  });
  check("le jugement et la résolution de la CLI : premier mot sans ponctuation ni casse, QO_JUGE_CLI prime, .js lancé par node", () => {
    att(premierMot("Non.") === "non" && premierMot("  AUCUN\nautre") === "aucun" && premierMot("") === "", "premier mot");
    att(juger({ temoin: "# digit-ai-factory", fuite: "AUCUN", piege: "NON" }).length === 0, "un cas sain est accusé");
    att(juger({ temoin: "", fuite: "AUCUN", piege: "NON" }).length === 1, "un témoin vide n'est pas accusé");
    const cli = resoudreCli({ QO_JUGE_CLI: "x.js" }, () => true);
    att(cli[0] === process.execPath && cli[1] === "x.js", `résolution : ${cli}`);
    att(resoudreCli({ QO_JUGE_CLI: "claude-xyz" }, () => true)[0] === "claude-xyz", "un exécutable est lancé tel quel");
  });
  // ---- TF-2729 : la CLI se résout par bin/claude.exe, la recette s'arrête sous Windows au lieu de retomber sur claude.CMD, et un lancement à blanc vérifie le message entier ----
  const PAQUET = join("APP", "npm", "node_modules", "@anthropic-ai", "claude-code");
  const existent = (...chemins) => (p) => chemins.some((c) => p === c);
  check("rouge → vert — TF-2729 : bin/claude.exe passe avant cli.js, cli.js sert quand l'exe manque, et sous Windows rien d'autre : null (jamais claude.CMD) ; hors Windows, `claude`", () => {
    const exe = join(PAQUET, "bin", "claude.exe"), js = join(PAQUET, "cli.js");
    const env = { APPDATA: "APP" };
    const les2 = resoudreCli(env, existent(exe, js), "win32");
    att(les2.length === 1 && les2[0] === exe, `l'exe ne passe pas avant cli.js : ${les2}`);
    const seulJs = resoudreCli(env, existent(js), "win32");
    att(seulJs[0] === process.execPath && seulJs[1] === js, `cli.js n'est pas le repli : ${seulJs}`);
    att(resoudreCli(env, existent(), "win32") === null, "sous Windows sans exe ni cli.js, la résolution doit rendre null (la recette s'arrête), pas claude.CMD");
    att(resoudreCli({}, existent(), "win32") === null, "sans APPDATA non plus");
    const linux = resoudreCli(env, existent(join(PAQUET, "bin", "claude")), "linux");
    att(linux.length === 1 && /claude$/.test(linux[0]), `hors Windows, le binaire du paquet : ${linux}`);
    att(resoudreCli(env, existent(), "linux")[0] === "claude", "hors Windows sans paquet : claude");
    att(resoudreCli({ ...env, QO_JUGE_CLI: "forcee.exe" }, existent("forcee.exe", exe), "win32")[0] === "forcee.exe", "QO_JUGE_CLI ne prime plus");
  });
  check("rouge — TF-2729 : un message qui n'arrive pas entier (le lanceur le tronque) arrête la recette (exit 3, aucun des trois lancements joué) ; --a-blanc le dit seul", () => {
    const r = jouer("tronque");
    att(r.status === 3 && /lancement « à blanc »/.test(r.stderr) && /n'arrive pas entier/.test(r.stderr) && /recette NON jouée/.test(r.stderr), `exit ${r.status} : ${r.stdout}${r.stderr}`);
    att(!/TENU|DÉFAUT/.test(r.stdout), "un verdict a été rendu sur un message tronqué");
    const seul = spawnSync(process.execPath, [SCRIPT, "--a-blanc", "--racine", base], { encoding: "utf8", env: { ...process.env, QO_JUGE_CLI: FAUSSE_CLI, FAUX_SCENARIO: "tronque" } });
    att(seul.status === 3 && /ÉCHEC/.test(seul.stderr), `--a-blanc sur message tronqué : exit ${seul.status} ${seul.stderr}`);
  });
  check("vert — TF-2729 : un message entier passe le lancement à blanc, --a-blanc seul rend TENU (exit 0), et le message de blanc est long avec son code sur la DERNIÈRE ligne seulement", () => {
    const seul = spawnSync(process.execPath, [SCRIPT, "--a-blanc", "--racine", base], { encoding: "utf8", env: { ...process.env, QO_JUGE_CLI: FAUSSE_CLI, FAUX_SCENARIO: "sain" } });
    att(seul.status === 0 && /lancement à blanc : TENU/.test(seul.stdout), `exit ${seul.status} : ${seul.stdout}${seul.stderr}`);
    const m = messageDeBlanc("BLANC-XYZ");
    att(m.length > 5000 && m.trim().split("\n").at(-1) === "CODE : BLANC-XYZ" && m.split("BLANC-XYZ").length === 2, `forme du message de blanc : ${m.length} caractères`);
    att(/^BLANC-[0-9A-Z]{8}$/.test(codeDeBlanc()) && codeDeBlanc() !== codeDeBlanc(), "le code de blanc n'est pas aléatoire");
  });
  // ---- TF-2714 : le marqueur injecté et les jetons d'entrée prouvent l'isolement objectivement ----
  check("vert — TF-2714 : sans --racine, la recette joue depuis un dossier jetable au CLAUDE.md marqué : le témoin cite le marqueur, l'isolé non (TENU), le marqueur est dit au relevé", () => {
    const r = jouer("sain", {}, ["--json"], false);
    const j = JSON.parse(r.stdout);
    att(r.status === 0 && /^MARQUEUR-[0-9A-Z]{8}$/.test(j.marqueur) && j.defauts.length === 0, `exit ${r.status} : ${r.stdout}${r.stderr}`);
    att(j.temoin.includes(j.marqueur) && !j.fuite.includes(j.marqueur), `témoin « ${j.temoin} », fuite « ${j.fuite} »`);
    att(j.jetons_entree_rapportes_par_la_cli.temoin === 20000 && j.jetons_entree_rapportes_par_la_cli.fuite === 150 && j.ratio_jetons_max_provisoire === 0.25, JSON.stringify(j.jetons_entree_rapportes_par_la_cli));
  });
  check("rouge — TF-2714 : un lecteur isolé qui rend le marqueur du CLAUDE.md est refusé par une chaîne cherchée, avec le marqueur nommé (exit 1)", () => {
    const r = jouer("fuite", {}, [], false);
    att(r.status === 1 && /a rendu le marqueur MARQUEUR-[0-9A-Z]{8}/.test(r.stdout) && /chaîne, non déclarée/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
  });
  check("rouge — TF-2714 : un contexte automatique qui passe (le lecteur répond AUCUN et NON, mais reçoit 9000 jetons contre 20000 au témoin) est détecté par la mesure, exit 1", () => {
    const r = jouer("contexte-injecte", {}, [], false);
    att(r.status === 1 && /jetons d'entrée contre 20000 au témoin, plus de 25 %/.test(r.stdout) && /TF-2714/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
    att(!/n'a pas répondu/.test(r.stdout), "le défaut vient d'une réponse déclarative : la mesure n'est pas ce qui l'a trouvé");
  });
  check("vert — TF-2714 : une CLI qui ne rapporte aucun jeton laisse la recette tenir, et le dit (contrôle par les jetons NON joué) ; le jugement pur accepte marqueur et jetons", () => {
    const r = jouer("sans-jetons", {}, [], false);
    att(r.status === 0 && /contrôle par les jetons NON joué/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
    att(juger({ temoin: "# MARQUEUR-A", fuite: "AUCUN", piege: "NON", marqueur: "MARQUEUR-A", jetons: { temoin: 20000, fuite: 150, piege: 160 } }).length === 0, "un cas sain avec marqueur et jetons est accusé");
    att(juger({ temoin: "AUCUN", fuite: "AUCUN", piege: "NON", marqueur: "MARQUEUR-A" }).length === 1, "un témoin qui ne cite pas le marqueur n'est pas accusé");
    att(juger({ temoin: "# MARQUEUR-A", fuite: "AUCUN", piege: "NON", marqueur: "MARQUEUR-A", jetons: { temoin: 20000, fuite: 5001, piege: 100 } }).length === 1, "la borne de 25 % ne se tient pas à 5001 sur 20000");
    att(jetonsEntree({ input_tokens: 3, cache_creation_input_tokens: 10, cache_read_input_tokens: 100 }) === 113 && jetonsEntree(undefined) === null && jetonsEntree({}) === null, "jetonsEntree");
  });
} finally { rmSync(base, { recursive: true, force: true }); }

console.log(`\nlecteur-isole (TF-2553) : ${ok} PASS, ${ko} FAIL — cas rouges : fuite de contexte, piège raté, témoin muet, clé d'API refusée, CLI muette, message tronqué (TF-2729), marqueur rendu et contexte automatique mesuré par les jetons (TF-2714)`);
process.exit(ko ? 1 : 0);
