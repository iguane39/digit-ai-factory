#!/usr/bin/env node
/**
 * verifier-ouverture-cli.test.mjs — recette à double sens de la sonde d'initialisation (TF-1635,
 * critères (a), (b) et (d), 14/10/2026).
 *
 * Toujours joué : la préparation des hooks (synchrones réels aux chemins absolus, asynchrones ralentis,
 * sommeil injecté sous une étiquette distincte — le CLI fusionne deux hooks de même commande, et le
 * 14/10 un sommeil identique à l'attente d'un hook asynchrone avait disparu derrière elle).
 * Joué si le CLI `claude` est sur le poste, sinon déclaré NON JOUÉ avec son compte :
 *   · vert — pilot et produit, hooks synchrones réels et tirage ralenti à 40 s : initialisation sous 30 s ;
 *   · rouge — la même sonde sur le produit, un sommeil de 25 s injecté dans la partie bloquante et un
 *     seuil de 12 s : la sonde DOIT échouer. Le critère (d) littéral (70 s, seuil 30 s) a été joué à la
 *     main le 14/10 : FAIL, « aucune réponse d'initialisation en 35000 ms » ; la recette en joue une
 *     version courte pour ne pas coûter 35 s au harnais.
 * Aucun appel de modèle : la sonde n'envoie que la requête d'initialisation.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SONDE = join(ICI, "verifier-ouverture-cli.mjs");
const { hooksSonde, versionCli } = await import(new URL("./verifier-ouverture-cli.mjs", import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const reglages = { hooks: { SessionStart: [{ matcher: "startup|resume", hooks: [
  { type: "command", command: "node oracles/hook-ouverture.mjs --contexte-json", timeout: 240, async: true },
  { type: "command", command: "node oracles/hook-produits-intacts.mjs --empreinte", timeout: 45 },
] }] } };
check("préparation — synchrone réel au chemin absolu, asynchrone ralenti, sommeil injecté sous une commande distincte", () => {
  const s = hooksSonde(reglages, "C:\\base", { ralenti: 70, sommeil: 70 });
  const tous = s.hooks.SessionStart.flatMap((g) => g.hooks);
  const sync = tous.filter((h) => h.async !== true).map((h) => h.command);
  if (!sync.some((c) => c.includes(join("C:\\base", "oracles/hook-produits-intacts.mjs")) && c.includes("--empreinte"))) throw new Error(`hook synchrone réel absent : ${sync.join(" | ")}`);
  const asyncs = tous.filter((h) => h.async === true);
  if (asyncs.length !== 1 || !/tirage-ralenti/.test(asyncs[0].command) || /hook-ouverture/.test(asyncs[0].command)) throw new Error("le hook asynchrone n'est pas remplacé par le tirage ralenti");
  const commandes = tous.map((h) => h.command);
  if (new Set(commandes).size !== commandes.length) throw new Error("deux hooks portent la même commande : le CLI en fusionnerait un (le sommeil injecté disparaîtrait)");
  if (!sync.some((c) => /sommeil-injecte/.test(c))) throw new Error("le sommeil injecté n'est pas dans la partie bloquante");
});

const CAS_CLI = 2;
if (!versionCli()) {
  console.log(`[NON JOUÉ] ${CAS_CLI} cas — verifier-ouverture-cli : le CLI \`claude\` est absent de ce poste`);
} else {
  const jouer = (...a) => spawnSync(process.execPath, [SONDE, "--json", ...a], { encoding: "utf8", timeout: 180000 });
  const lire = (r) => { try { return JSON.parse(r.stdout); } catch { return null; } };
  const vert = jouer("--seuil", "30", "--ralenti", "40");
  const jv = lire(vert);
  check("(a)(b) vert — pilot et produit, hooks synchrones réels et tirage ralenti à 40 s : initialisation sous 30 s", () => {
    if (!jv || vert.status !== 0 || jv.verdict !== "PASS") throw new Error(`exit ${vert.status} — ${JSON.stringify(jv && jv.resultats).slice(0, 300)}`);
    console.log(`    (mesure : ${jv.resultats.map((r) => `${r.cible} ${r.ms} ms`).join(", ")}, ${jv.cli})`);
  });
  const rouge = jouer("--seuil", "12", "--ralenti", "40", "--sommeil-injecte", "25", "--cibles", "produit");
  const jr = lire(rouge);
  check("(d) rouge — un sommeil de 25 s injecté dans la partie bloquante doit échouer au seuil de 12 s", () => {
    if (!jr || rouge.status !== 1 || jr.verdict !== "FAIL") throw new Error(`exit ${rouge.status}, verdict ${jr && jr.verdict} : le sommeil injecté n'a pas été vu`);
  });
}

console.log(`\nverifier-ouverture-cli, initialisation sous le délai du client : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
