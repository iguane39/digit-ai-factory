// Self-test TF-0142 (double sens) — n'exécute AUCUN install réel (déterminisme/offline) : la
// LOGIQUE (détection deps, choix de port libre, écriture du contrat, verdict healthcheck) est
// exercée sur les projets-fixtures synthétiques de `fixtures/`, copiés dans un dossier
// temporaire à chaque test pour ne jamais polluer les fixtures versionnées. L'exécution réelle
// (npm ci / uv sync) est testée via un exécuteur MOCK — jamais un vrai `spawn`.

import { mkdtempSync, rmSync, cpSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createServer } from "node:net";
import assert from "node:assert/strict";

import {
  PORT_EXCLUS_DEFAUT,
  PORT_DEPART_DEFAUT,
  detecterFront,
  detecterBack,
  detecterAppASGI,
  portEstLibre,
  trouverPortLibre,
  lireEnvForgeTests,
  ecrireEnvForgeTests,
  calculerHealthcheck,
  preparerEnvironnement,
} from "./preparer-environnement.mjs";

const ICI = new URL(".", import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, "$1");
const FIXTURES = join(ICI, "fixtures");

const tests = [];
const test = (nom, fn) => tests.push({ nom, fn });

function copierFixture(nom) {
  const dossier = mkdtempSync(join(tmpdir(), "forge-tf0142-"));
  cpSync(join(FIXTURES, nom), dossier, { recursive: true });
  return dossier;
}

// --------------------------------------------------------------------------------------------
// VERT — projet complet (front + back détectables) : contrat correct, port libre choisi.
// --------------------------------------------------------------------------------------------

test("detecterFront/detecterBack : projet complet détecte les deux, rien installé", () => {
  const front = detecterFront(join(FIXTURES, "projet-complet"));
  const back = detecterBack(join(FIXTURES, "projet-complet"));
  assert.equal(front.present, true);
  assert.equal(front.a_installer, true, "node_modules absent dans la fixture : doit être détecté à installer");
  assert.equal(back.present, true);
  assert.equal(back.a_installer, true, ".venv absent dans la fixture : doit être détecté à installer");
});

test("detecterAppASGI : trouve app = FastAPI() et dérive module:attribut", () => {
  const back = detecterBack(join(FIXTURES, "projet-complet"));
  const app = detecterAppASGI(back.dossier);
  assert.ok(app, "app ASGI doit être trouvée dans la fixture projet-complet");
  assert.equal(app.attribut, "app");
  assert.equal(app.module, "app.main");
  assert.equal(app.type, "FastAPI");
});

test("preparerEnvironnement (VERT) : projet complet -> statut pret, contrat correct, port != 4173", async () => {
  const dossier = copierFixture("projet-complet");
  try {
    const contrat = await preparerEnvironnement(dossier, { executer: false });
    assert.equal(contrat.statut, "pret", `manques inattendus : ${JSON.stringify(contrat.manques)}`);
    assert.equal(contrat.manques.length, 0);
    assert.ok(contrat.port_front, "un port front doit être choisi (front détecté)");
    assert.notEqual(contrat.port_front, 4173, "TF-0137 : jamais le port par défaut de vite preview");
    assert.equal(contrat.app_asgi.module, "app.main");
    assert.equal(contrat.env_forge_tests.FORGE_TESTS_APP, "app.main:app");
    assert.equal(contrat.env_forge_tests.FORGE_TESTS_BASE_URL, `http://localhost:${contrat.port_front}`);
    // executer:false -> les deps ne sont PAS réellement installées : healthcheck reste
    // INCOMPLET sur ce seul critère (deps_presentes), distinct du contrat (app/port/env) qui,
    // lui, est complet. Le healthcheck ne ment jamais sur l'état réel des dépendances.
    assert.equal(contrat.healthcheck.deps_presentes, false);
    assert.equal(contrat.healthcheck.app_declaree, true);
    assert.equal(contrat.healthcheck.port_libre_trouve, true);
    assert.equal(contrat.healthcheck.verdict, "INCOMPLET");

    // Le contrat et le .env sont bien écrits DANS LE PROJET (pas dans forge-tests, pas ailleurs).
    assert.ok(existsSync(join(dossier, "contrat-audit.json")));
    const relu = JSON.parse(readFileSync(join(dossier, "contrat-audit.json"), "utf8"));
    assert.equal(relu.statut, "pret");
    const env = lireEnvForgeTests(dossier);
    assert.equal(env.valeurs.FORGE_TESTS_APP, "app.main:app");
  } finally {
    rmSync(dossier, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------------------
// ROUGE — projet sans app détectable : contrat incomplet NOMMANT ce qui manque, jamais menteur.
// --------------------------------------------------------------------------------------------

test("preparerEnvironnement (ROUGE) : projet sans back -> bloque_question, manque nommé, jamais de valeur inventée", async () => {
  const dossier = copierFixture("projet-incomplet");
  try {
    const contrat = await preparerEnvironnement(dossier, { executer: false });
    assert.equal(contrat.statut, "bloque_question");
    assert.ok(contrat.manques.length >= 1);
    const manqueApp = contrat.manques.find((m) => m.champ === "FORGE_TESTS_APP");
    assert.ok(manqueApp, "le manque FORGE_TESTS_APP doit être nommé explicitement");
    assert.ok(manqueApp.raison.length > 10, "la raison doit être motivée, pas vide");
    // Le contrat ne ment jamais : pas de FORGE_TESTS_APP fabriqué.
    assert.equal(contrat.env_forge_tests.FORGE_TESTS_APP, undefined);
    assert.equal(contrat.app_asgi, null);
    assert.equal(contrat.healthcheck.verdict, "INCOMPLET");
    // Le front, lui, EST détectable ici : un port doit quand même être choisi (pas un blocage
    // global — seul ce qui manque réellement est signalé).
    assert.ok(contrat.port_front, "le front de la fixture est détectable, un port doit être choisi malgré le blocage back");
  } finally {
    rmSync(dossier, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------------------
// Port dédié libre — preuve fonctionnelle réelle (pas un mock) : le picker évite un port occupé.
// --------------------------------------------------------------------------------------------

test("trouverPortLibre : évite un port réellement occupé et jamais 4173", async () => {
  const serveur = createServer();
  await new Promise((resolve) => serveur.listen(PORT_DEPART_DEFAUT, "127.0.0.1", resolve));
  try {
    assert.equal(await portEstLibre(PORT_DEPART_DEFAUT), false, "le port tenu par ce test doit être vu occupé");
    const port = await trouverPortLibre({ depart: PORT_DEPART_DEFAUT });
    assert.notEqual(port, PORT_DEPART_DEFAUT, "le port occupé par ce test ne doit jamais être choisi");
    assert.notEqual(port, 4173);
    assert.equal(PORT_EXCLUS_DEFAUT.includes(4173), true);
  } finally {
    await new Promise((resolve) => serveur.close(resolve));
  }
});

// --------------------------------------------------------------------------------------------
// Exécution réelle documentée, jamais appelée en self-test : mode testé par MOCK.
// --------------------------------------------------------------------------------------------

test("preparerEnvironnement({executer:true}) : installs déclenchés via un exécuteur MOCK, jamais un vrai spawn", async () => {
  const dossier = copierFixture("projet-complet");
  try {
    const appels = [];
    const executeurMock = async (commande, args, cwd) => {
      appels.push({ commande, args, cwd });
      return { commande: `${commande} ${args.join(" ")}`, cwd, code: 0, sortie: "(mock)" };
    };
    const contrat = await preparerEnvironnement(dossier, { executer: true, executeur: executeurMock });
    assert.equal(appels.length, 2, "front (npm ci) + back (uv sync) attendus");
    assert.deepEqual(appels.map((a) => a.commande).sort(), ["npm", "uv"]);
    assert.equal(contrat.installations.length, 2);
    assert.ok(contrat.installations.every((i) => i.code === 0));
    assert.equal(contrat.healthcheck.deps_presentes, true);
    assert.equal(contrat.healthcheck.verdict, "PASS", "app + port + deps réunis -> healthcheck complet");
  } finally {
    rmSync(dossier, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------------------
// Le contrat projet n'écrase jamais une valeur déjà posée par un humain.
// --------------------------------------------------------------------------------------------

test("ecrireEnvForgeTests : ne remplace pas une valeur humaine préexistante", () => {
  const dossier = mkdtempSync(join(tmpdir(), "forge-tf0142-env-"));
  try {
    mkdirSync(dossier, { recursive: true });
    writeFileSync(join(dossier, ".env.forge-tests"), "FORGE_TESTS_APP=custom.module:custom_app\n", "utf8");
    const resultat = ecrireEnvForgeTests(dossier, { FORGE_TESTS_APP: "app.main:app", FORGE_TESTS_BASE_URL: "http://localhost:41800" });
    assert.equal(resultat.valeurs.FORGE_TESTS_APP, "custom.module:custom_app", "valeur humaine préservée");
    assert.equal(resultat.valeurs.FORGE_TESTS_BASE_URL, "http://localhost:41800", "valeur nouvelle ajoutée");
  } finally {
    rmSync(dossier, { recursive: true, force: true });
  }
});

test("calculerHealthcheck : INCOMPLET si le port n'a pas pu être trouvé alors qu'un front existe", () => {
  const hc = calculerHealthcheck({
    front: { present: true, a_installer: false },
    back: { present: false, a_installer: false },
    installations: [],
    port: null,
    appDetecte: { module: "app.main", attribut: "app" },
    envValeurs: { FORGE_TESTS_APP: "app.main:app" },
  });
  assert.equal(hc.port_libre_trouve, false);
  assert.equal(hc.verdict, "INCOMPLET");
});

// --------------------------------------------------------------------------------------------
// Exécution
// --------------------------------------------------------------------------------------------

let echecs = 0;
for (const { nom, fn } of tests) {
  try {
    await fn();
    console.log(`  PASS  ${nom}`);
  } catch (err) {
    echecs += 1;
    console.error(`  FAIL  ${nom}`);
    console.error(`        ${err.message}`);
  }
}
console.log(`\n${tests.length - echecs}/${tests.length} tests verts`);
process.exit(echecs ? 1 : 0);
