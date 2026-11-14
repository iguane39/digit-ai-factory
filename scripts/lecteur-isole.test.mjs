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
import { argumentsLecteurIsole, ARGUMENTS_TEMOIN, clesPayantes, juger, premierMot, resoudreCli } from "./lecteur-isole.mjs";

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
const args = process.argv.slice(2);
let q = ""; process.stdin.setEncoding("utf8"); process.stdin.on("data", (c) => q += c);
process.stdin.on("end", () => {
  const isole = args.includes("--setting-sources") && args.includes("--tools") && args.includes("--strict-mcp-config");
  const s = process.env.FAUX_SCENARIO || "sain";
  const fuite = /CLAUDE\\.md/.test(q);
  let r;
  if (s === "muette") process.exit(1);
  if (!isole) r = s === "temoin-muet" ? "AUCUN" : "# digit-ai-factory — noyau de pilotage";
  else if (fuite) r = s === "fuite" ? "# digit-ai-factory — noyau de pilotage" : "AUCUN";
  else r = s === "piege-rate" ? "OUI" : "NON.";
  process.stdout.write(JSON.stringify({ type: "result", is_error: false, result: r, total_cost_usd: 0.01 }));
});
`, "utf8");
const jouer = (scenario, env = {}, extra = []) => {
  const e = { ...process.env, QO_JUGE_CLI: FAUSSE_CLI, FAUX_SCENARIO: scenario, ...env };
  for (const k of ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"]) if (!(k in env)) delete e[k];
  return spawnSync(process.execPath, [SCRIPT, "--recette", "--racine", base, ...extra], { encoding: "utf8", env: e });
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
    att(r.status === 3 && /lancement « témoin »/.test(r.stderr), `exit ${r.status} : ${r.stderr}`);
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
} finally { rmSync(base, { recursive: true, force: true }); }

console.log(`\nlecteur-isole (TF-2553) : ${ok} PASS, ${ko} FAIL — cas rouges : fuite de contexte, piège raté, témoin muet, clé d'API refusée, CLI muette`);
process.exit(ko ? 1 : 0);
