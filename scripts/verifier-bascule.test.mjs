#!/usr/bin/env node
/**
 * verifier-bascule.test.mjs — M-6 / TF-0482 : les deux côtés d'une bascule de domaine.
 *
 * L'INCIDENT DU 18/08. Le renommage d'un hôte a été livré avec une redirection 301 DURE vers un
 * domaine qui NE RÉSOLVAIT PAS ENCORE. Le site est devenu injoignable. Aucun gate ne pouvait le
 * voir : M-1…M-5 s'exercent contre UNE SEULE BASE — la nouvelle URL. On ne voit pas ce qu'on
 * n'interroge pas.
 *
 * CETTE RECETTE NE TOUCHE PAS AU RÉSEAU PUBLIC, et c'est délibéré : un contrôle qui dépend d'un
 * domaine tiers échoue le jour où ce domaine tousse, et on apprend alors à l'ignorer — le même
 * défaut que TF-0515, corrigé le même jour.
 *
 * LES SERVEURS VIVENT DANS UN PROCESSUS SÉPARÉ, et ce n'est pas un raffinement : deux jets
 * précédents les hébergeaient DANS le processus de test.
 *   · le premier appelait l'outil par `spawnSync`, ce qui GÈLE la boucle d'événements : les
 *     requêtes de l'outil n'étaient jamais servies, et trois contrôles échouaient sur « pas de
 *     réponse » — un faux rouge fabriqué par la recette ;
 *   · le second passait en asynchrone, et trois contrôles mouraient alors sur un code de sortie
 *     Windows 0xC0000409, non reproductible en isolant le même cas. Un harnais qui SERT et APPELLE
 *     interfère avec ce qu'il mesure, et un test dont on doit expliquer les échecs ne prouve rien.
 * Le serveur est donc un processus à part, qui annonce ses ports sur sa sortie. La recette ne fait
 * plus qu'appeler et comparer.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFile } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-bascule.mjs");
let pass = 0, fail = 0;
const check = async (nom, fn) => {
  try { await fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// Le décor, en un seul processus enfant : quatre serveurs, et leurs URL annoncées en JSON.
const DECOR = `
const { createServer } = require('node:http');
const ecoute = (repondre) => new Promise(r => { const s = createServer(repondre); s.listen(0, '127.0.0.1', () => r(s)); });
const url = s => 'http://127.0.0.1:' + s.address().port;
(async () => {
  const vivant = await ecoute((q, r) => { r.writeHead(200, {'content-type':'text/plain'}); r.end('ok'); });
  const cible = url(vivant);
  const casse = await ecoute((q, r) => { r.writeHead(503); r.end('indisponible'); });
  const redirige = await ecoute((q, r) => { r.writeHead(301, { location: cible + q.url }); r.end(); });
  const perdChemin = await ecoute((q, r) => { r.writeHead(301, { location: cible + '/' }); r.end(); });
  let boucleUrl = null;
  const boucle = await ecoute((q, r) => { r.writeHead(301, { location: boucleUrl + q.url }); r.end(); });
  boucleUrl = url(boucle);
  process.stdout.write(JSON.stringify({ vivant: cible, casse: url(casse), redirige: url(redirige),
    perdChemin: url(perdChemin), boucle: boucleUrl }) + '\\n');
})();
`;

const decor = spawn(process.execPath, ["-e", DECOR], { stdio: ["ignore", "pipe", "pipe"] });
const urls = await new Promise((resoudre, rejeter) => {
  let tampon = "";
  const minuteur = setTimeout(() => rejeter(new Error("le décor n'a pas annoncé ses ports en 10 s")), 10000);
  decor.stdout.on("data", (d) => {
    tampon += d.toString();
    const i = tampon.indexOf("\n");
    if (i < 0) return;
    clearTimeout(minuteur);
    try { resoudre(JSON.parse(tampon.slice(0, i))); } catch (e) { rejeter(e); }
  });
});

/** Appel non bloquant : le décor est ailleurs, mais on ne gèle rien pour autant. */
const lancer = (...a) => new Promise((resoudre) => {
  execFile(process.execPath, [OUTIL, ...a, "--delai", "4000"],
    { encoding: "utf8", timeout: 30000 }, (err, stdout) => {
      let j = null;
      try { j = JSON.parse(stdout || "null"); } catch { /* sortie illisible */ }
      resoudre({ code: err ? (err.code ?? 1) : 0, j });
    });
});

await check("--avant : une CIBLE qui ne résout pas est REFUSÉE — c'est l'incident du 18/08", async () => {
  const r = await lancer("--avant", "--cible", "https://cible-inexistante-tf0482.invalid");
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  const t = JSON.stringify(r.j);
  if (!/non résolvante/.test(t)) throw new Error("le motif ne dit pas que la cible ne résout pas");
  if (!/panne programmée/.test(t)) throw new Error("le message ne dit pas le coût");
});

await check("--avant : une CIBLE qui répond 200 passe", async () => {
  const r = await lancer("--avant", "--cible", urls.vivant);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${JSON.stringify(r.j && r.j.findings).slice(0, 220)}`);
});

await check("--avant : une CIBLE qui répond 503 est REFUSÉE — résoudre ne suffit pas", async () => {
  const r = await lancer("--avant", "--cible", urls.casse);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un domaine qui résout mais sert une erreur reste une panne`);
  if (!/répond 503/.test(JSON.stringify(r.j))) throw new Error("le motif ne cite pas le code de réponse");
});

await check("--apres : un ANCIEN hôte qui redirige vers un emplacement vivant, chemin préservé, passe", async () => {
  const r = await lancer("--apres", "--historique", urls.redirige, "--chemin", "/rapport/x?y=1");
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${JSON.stringify(r.j && r.j.findings).slice(0, 250)}`);
});

await check("--apres : une redirection qui PERD LE CHEMIN est refusée — le trafic profond finit sur l'accueil", async () => {
  const r = await lancer("--apres", "--historique", urls.perdChemin, "--chemin", "/rapport/x?y=1");
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/CHEMIN PERDU/.test(JSON.stringify(r.j))) throw new Error("le motif ne nomme pas la perte de chemin");
});

await check("--apres : une BOUCLE de redirection est déclarée, pas suivie indéfiniment", async () => {
  const r = await lancer("--apres", "--historique", urls.boucle, "--chemin", "/x");
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/trop longue/.test(JSON.stringify(r.j))) throw new Error("la boucle n'est pas déclarée comme chaîne trop longue");
});

await check("--apres : un ANCIEN hôte qui ne résout plus est REFUSÉ — le trafic connu tombe dans le vide", async () => {
  const r = await lancer("--apres", "--historique", "https://ancien-hote-tf0482.invalid");
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/ANCIEN hôte non résolvant/.test(JSON.stringify(r.j))) throw new Error("le motif ne nomme pas l'ancien hôte");
});

await check("les deux moments sont EXCLUSIFS : ni zéro ni deux", async () => {
  const zero = await lancer("--cible", urls.vivant);
  if (zero.code !== 2) throw new Error(`aucun moment donné : exit ${zero.code} attendu 2 (non jugeable)`);
  const deux = await lancer("--avant", "--apres", "--cible", urls.vivant, "--historique", urls.vivant);
  if (deux.code !== 2) throw new Error(`deux moments donnés : exit ${deux.code} attendu 2 (non jugeable)`);
});

decor.kill();
console.log(`\nverifier-bascule (TF-0482) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
