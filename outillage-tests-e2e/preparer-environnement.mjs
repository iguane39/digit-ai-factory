// TF-0142 — Harnais de préparation d'environnement d'audit (plan e2e §4 phase 0).
//
// Rend un projet MESURABLE avant un audit forge-tests : détecte les dépendances front/back,
// choisit un port de service front DÉDIÉ et libre (jamais 4173 — cf. TF-0137, la classe de
// collision qui a causé D-01), renseigne/valide le contrat projet (`.env.forge-tests` :
// FORGE_TESTS_APP=module:attribut, FORGE_TESTS_BASE_URL), et produit `contrat-audit.json`.
//
// Doctrine (G-1) : ce harnais PRÉPARE, il n'audite pas — il tourne AVANT forge-tests, qui
// reste lecture seule. Il écrit DANS LE PROJET cible (deps, .env.forge-tests, contrat-audit
// .json), jamais dans forge-tests lui-même : c'est un outil du pilot/ops.
//
// Un projet où l'app n'est pas détectable ne reçoit jamais un contrat qui ment : le statut
// bascule `bloque_question` et chaque champ manquant porte sa raison — jamais un contrat
// silencieusement incomplet.

import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createServer } from "node:net";
import { spawn } from "node:child_process";

// TF-0137 : le port par défaut de `vite preview` est le plus probable à entrer en collision
// (c'est la cause racine de D-01) — jamais choisi ici, même par accident de plage.
export const PORT_EXCLUS_DEFAUT = [4173];
export const PORT_DEPART_DEFAUT = 41800;
export const CHAMPS_CONTRAT_REQUIS = ["FORGE_TESTS_APP", "FORGE_TESTS_BASE_URL"];

// ---------------------------------------------------------------------------------------------
// Détection des dépendances
// ---------------------------------------------------------------------------------------------

/** Front détecté par `package.json` (racine du projet ou sous-dossier `frontend/`). */
export function detecterFront(racineProjet) {
  const candidats = [join(racineProjet, "frontend", "package.json"), join(racineProjet, "package.json")];
  const cheminPackage = candidats.find((c) => existsSync(c));
  if (!cheminPackage) return { present: false };
  const dossier = join(cheminPackage, "..");
  const nodeModules = join(dossier, "node_modules");
  return {
    present: true,
    dossier,
    package_json: cheminPackage,
    node_modules_present: existsSync(nodeModules),
    commande_install: "npm ci",
    a_installer: !existsSync(nodeModules),
  };
}

/** Back détecté par `pyproject.toml` (racine du projet ou sous-dossier `backend/`). */
export function detecterBack(racineProjet) {
  for (const sousDossier of ["backend", "."]) {
    const pyproject = join(racineProjet, sousDossier, "pyproject.toml");
    if (existsSync(pyproject)) {
      const dossier = join(pyproject, "..");
      const venv = join(dossier, ".venv");
      return {
        present: true,
        dossier,
        pyproject,
        venv_present: existsSync(venv),
        commande_install: "uv sync",
        a_installer: !existsSync(venv),
      };
    }
  }
  return { present: false };
}

/**
 * Cherche une instance ASGI/WSGI reconnaissable (`app = FastAPI(...)` / `Flask(...)`) sous le
 * dossier back, et dérive `module:attribut` depuis le chemin relatif du fichier qui la déclare.
 * Bornée en profondeur (protection contre une arborescence pathologique) ; retourne `null` sans
 * fabriquer de deviner — un module qu'on ne trouve pas reste un manque nommé, jamais une valeur
 * inventée.
 */
export function detecterAppASGI(dossierBack, { profondeurMax = 5 } = {}) {
  if (!dossierBack || !existsSync(dossierBack)) return null;
  return chercherAppRecursif(dossierBack, dossierBack, 0, profondeurMax);
}

function chercherAppRecursif(dossier, racine, profondeur, profondeurMax) {
  if (profondeur > profondeurMax) return null;
  let entrees;
  try {
    entrees = readdirSync(dossier, { withFileTypes: true });
  } catch {
    return null;
  }
  // Fichiers avant sous-dossiers : un `main.py` au niveau courant est un signal plus fort
  // qu'un fichier trouvé au hasard d'une profondeur plus grande.
  const fichiers = entrees.filter((e) => e.isFile() && e.name.endsWith(".py"));
  for (const fichier of fichiers) {
    const chemin = join(dossier, fichier.name);
    const contenu = readFileSync(chemin, "utf8");
    const trouve = contenu.match(/^(\w+)\s*=\s*(FastAPI|Flask)\s*\(/m);
    if (trouve) {
      const relatif = relative(racine, chemin).replace(/\.py$/, "").split(sep).join(".");
      return { module: relatif, attribut: trouve[1], type: trouve[2], fichier: chemin };
    }
  }
  for (const sousDossier of entrees.filter((e) => e.isDirectory())) {
    if (sousDossier.name === "node_modules" || sousDossier.name === ".venv" || sousDossier.name.startsWith(".")) continue;
    const trouve = chercherAppRecursif(join(dossier, sousDossier.name), racine, profondeur + 1, profondeurMax);
    if (trouve) return trouve;
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Port dédié libre (TF-0137)
// ---------------------------------------------------------------------------------------------

/** Vrai test réseau local (127.0.0.1) : bind puis relâche — jamais un simple "port supposé libre". */
export function portEstLibre(port) {
  return new Promise((resolve) => {
    const serveur = createServer();
    serveur.once("error", () => resolve(false));
    serveur.once("listening", () => serveur.close(() => resolve(true)));
    serveur.listen(port, "127.0.0.1");
  });
}

export async function trouverPortLibre({ depart = PORT_DEPART_DEFAUT, exclus = PORT_EXCLUS_DEFAUT, max = 100 } = {}) {
  for (let i = 0; i < max; i += 1) {
    const port = depart + i;
    if (exclus.includes(port)) continue;
    // eslint-disable-next-line no-await-in-loop -- sondage séquentiel volontaire, un port à la fois
    if (await portEstLibre(port)) return port;
  }
  throw new Error(`aucun port libre trouvé entre ${depart} et ${depart + max - 1} (exclus : ${exclus.join(", ")})`);
}

// ---------------------------------------------------------------------------------------------
// Contrat projet `.env.forge-tests`
// ---------------------------------------------------------------------------------------------

export function lireEnvForgeTests(racineProjet) {
  const chemin = join(racineProjet, ".env.forge-tests");
  if (!existsSync(chemin)) return { chemin, existe: false, valeurs: {} };
  const valeurs = {};
  for (const ligne of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    const trouve = ligne.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (trouve) valeurs[trouve[1]] = trouve[2];
  }
  return { chemin, existe: true, valeurs };
}

/** Fusionne (n'écrase jamais une valeur déjà présente et non vide — un humain a pu la poser à la main). */
export function ecrireEnvForgeTests(racineProjet, valeursProposees) {
  const chemin = join(racineProjet, ".env.forge-tests");
  const existant = lireEnvForgeTests(racineProjet).valeurs;
  const fusion = { ...valeursProposees, ...existant };
  const contenu = Object.entries(fusion)
    .map(([cle, valeur]) => `${cle}=${valeur}`)
    .join("\n") + "\n";
  writeFileSync(chemin, contenu, "utf8");
  return { chemin, valeurs: fusion };
}

// ---------------------------------------------------------------------------------------------
// Exécution des installs (mode réel — documenté, jamais appelé en self-test)
// ---------------------------------------------------------------------------------------------

/** Exécuteur réel (spawn). Injecté par défaut ; remplaçable par un mock en test. */
export function executeurReel(commande, args, cwd) {
  return new Promise((resolve, reject) => {
    const processus = spawn(commande, args, { cwd, shell: true });
    let sortie = "";
    processus.stdout?.on("data", (d) => { sortie += d; });
    processus.stderr?.on("data", (d) => { sortie += d; });
    processus.on("close", (code) => resolve({ commande: `${commande} ${args.join(" ")}`, cwd, code, sortie: sortie.slice(-2000) }));
    processus.on("error", reject);
  });
}

async function installerSiNecessaire(dependance, executeur) {
  if (!dependance.present || !dependance.a_installer) return null;
  const [commande, ...args] = dependance.commande_install.split(" ");
  return executeur(commande, args, dependance.dossier);
}

// ---------------------------------------------------------------------------------------------
// Healthcheck (composite — jamais un HTTP réel non sollicité en v0)
// ---------------------------------------------------------------------------------------------

export function calculerHealthcheck({ front, back, installations, port, appDetecte, envValeurs }) {
  const depsInstallees = (dep, prefixe) =>
    !dep.present || !dep.a_installer || installations.some((i) => i && i.commande.startsWith(prefixe) && i.code === 0);
  const depsPresentes = depsInstallees(front, "npm") && depsInstallees(back, "uv");
  const portLibreTrouve = !front.present || port !== null;
  const appDeclaree = !!appDetecte || !!envValeurs.FORGE_TESTS_APP;
  return {
    deps_presentes: depsPresentes,
    port_libre_trouve: portLibreTrouve,
    app_declaree: appDeclaree,
    verdict: depsPresentes && portLibreTrouve && appDeclaree ? "PASS" : "INCOMPLET",
  };
}

// ---------------------------------------------------------------------------------------------
// Orchestrateur
// ---------------------------------------------------------------------------------------------

/**
 * @param {string} racineProjet dossier du projet à préparer
 * @param {object} options
 * @param {boolean} [options.executer=false] lance réellement les installs (npm ci / uv sync)
 * @param {function} [options.executeur] exécuteur de commande (mock possible pour test)
 * @param {boolean} [options.ecrire=true] écrit `.env.forge-tests` et `contrat-audit.json`
 * @param {function} [options.trouverPort] injectable pour test déterministe
 */
export async function preparerEnvironnement(racineProjet, options = {}) {
  const { executer = false, executeur = executeurReel, ecrire = true, trouverPort = trouverPortLibre } = options;

  const front = detecterFront(racineProjet);
  const back = detecterBack(racineProjet);
  const app = back.present ? detecterAppASGI(back.dossier) : null;

  const manques = [];
  if (!app) {
    manques.push({
      champ: "FORGE_TESTS_APP",
      raison: back.present
        ? "aucun fichier .py du backend ne déclare une instance FastAPI/Flask reconnaissable (`nom = FastAPI(...)`)"
        : "aucun backend détecté (pyproject.toml absent de <projet>/backend ou <projet>)",
    });
  }

  let port = null;
  if (front.present) port = await trouverPort();

  const envValeursProposees = {};
  if (app) envValeursProposees.FORGE_TESTS_APP = `${app.module}:${app.attribut}`;
  if (port) envValeursProposees.FORGE_TESTS_BASE_URL = `http://localhost:${port}`;

  let env = lireEnvForgeTests(racineProjet);
  if (ecrire && Object.keys(envValeursProposees).length) {
    env = ecrireEnvForgeTests(racineProjet, envValeursProposees);
  }
  const envValeursFinales = env.valeurs || {};

  for (const champ of CHAMPS_CONTRAT_REQUIS) {
    if (!envValeursFinales[champ] && !manques.some((m) => m.champ === champ)) {
      manques.push({ champ, raison: "non renseigné dans .env.forge-tests et non déductible du projet" });
    }
  }

  const installations = [];
  if (executer) {
    const resFront = await installerSiNecessaire(front, executeur);
    if (resFront) installations.push(resFront);
    const resBack = await installerSiNecessaire(back, executeur);
    if (resBack) installations.push(resBack);
  }

  const healthcheck = calculerHealthcheck({ front, back, installations, port, appDetecte: app, envValeurs: envValeursFinales });

  const contrat = {
    genere_le: new Date().toISOString(),
    projet: racineProjet,
    dependances: { front, back },
    port_front: port,
    app_asgi: app,
    env_forge_tests: envValeursFinales,
    installations,
    healthcheck,
    manques,
    statut: manques.length ? "bloque_question" : "pret",
  };

  if (ecrire) {
    writeFileSync(join(racineProjet, "contrat-audit.json"), JSON.stringify(contrat, null, 2) + "\n", "utf8");
  }
  return contrat;
}

// ---------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------

async function main() {
  const [, , racineProjet, ...reste] = process.argv;
  if (!racineProjet) {
    console.error("usage: node preparer-environnement.mjs <racine-projet> [--executer] [--json]");
    process.exit(2);
  }
  const executer = reste.includes("--executer");
  const contrat = await preparerEnvironnement(racineProjet, { executer });
  if (reste.includes("--json")) {
    console.log(JSON.stringify(contrat, null, 2));
  } else {
    console.log(`statut : ${contrat.statut}`);
    console.log(`port front : ${contrat.port_front ?? "—"}`);
    console.log(`app ASGI : ${contrat.app_asgi ? `${contrat.app_asgi.module}:${contrat.app_asgi.attribut}` : "non détectée"}`);
    if (contrat.manques.length) {
      console.log("manques :");
      for (const m of contrat.manques) console.log(`  - ${m.champ} : ${m.raison}`);
    }
  }
  process.exit(contrat.statut === "pret" ? 0 : 3);
}

// N'exécute le CLI que si CE fichier est le script lancé (pas quand le self-test l'importe).
if ((process.argv[1] || "").replace(/\\/g, "/").endsWith("outillage-tests-e2e/preparer-environnement.mjs")) {
  main();
}
