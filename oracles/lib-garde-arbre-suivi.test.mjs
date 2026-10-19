#!/usr/bin/env node
/**
 * lib-garde-arbre-suivi.test.mjs — recette de la garde de l'arbre suivi (TF-1690, 14/10/2026).
 *
 * Joue des recettes JOUETS dans un dépôt git jetable sous le dossier temporaire, jamais dans ce
 * dépôt. Les deux sens : la garde NOMME la recette qui écrit dans un fichier suivi — contenu changé,
 * fichier réécrit à l'identique (le cas d'EXTENSIONS-JUGEES.json), fins de ligne seules réécrites (le
 * cas de l'étude HTML), fichier suivi supprimé — et se TAIT sur une recette qui écrit sous le dossier
 * temporaire ou dans un fichier non suivi. Hors d'un dépôt git, elle se déclare non jouée.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { creerGarde, releverSuivis, ENV_SANS_GIT } from "./lib-garde-arbre-suivi.mjs";

const casse = [];
const veut = (cond, quoi) => { if (!cond) casse.push(quoi); };
// ENV_SANS_GIT : joué depuis un hameçon, GIT_DIR ferait committer la fixture dans le VRAI dépôt.
const git = (dir, ...args) => spawnSync("git", ["-c", "core.autocrlf=true", "-c", "user.name=recette", "-c", "user.email=recette@exemple.invalid", ...args], { cwd: dir, encoding: "utf8", env: ENV_SANS_GIT });

if (spawnSync("git", ["--version"], { encoding: "utf8" }).status !== 0) {
  console.log("[NON JOUÉ] 12 cas — aucun git sur ce poste : la garde de l'arbre suivi ne peut pas être éprouvée");
  process.exit(0);
}

const depot = mkdtempSync(join(tmpdir(), "garde-arbre-"));
const ailleurs = mkdtempSync(join(tmpdir(), "garde-ailleurs-"));
const attendre = (ms) => { const fin = Date.now() + ms; while (Date.now() < fin) { /* l'horloge du disque avance */ } };
try {
  git(depot, "init", "-q");
  writeFileSync(join(depot, "referentiel.json"), "{ \"version\": 1 }\n", "utf8");
  writeFileSync(join(depot, "etude.html"), "<p>un</p>\r\n<p>deux</p>\r\n", "utf8");
  writeFileSync(join(depot, "a-supprimer.md"), "# bientôt absent\n", "utf8");
  writeFileSync(join(depot, "voisin.md"), "# écrit par une autre session\n", "utf8");
  writeFileSync(join(depot, "propre.json"), "{ \"propre\": 1 }\n", "utf8");
  git(depot, "add", "-A");
  git(depot, "commit", "-q", "-m", "fixture");
  const garde = creerGarde(depot);
  veut(garde.jouee, "la garde ne joue pas dans un dépôt git — elle ne verrait rien");

  // ROUGE 1 : une recette jouet qui CHANGE un fichier suivi — elle est nommée, avec le chemin.
  attendre(20);
  garde.jouer("recette-qui-ecrit", () => writeFileSync(join(depot, "referentiel.json"), "{ \"version\": 2 }\n", "utf8"));
  // ROUGE 2 : écrit PUIS remet à l'identique — le cas d'EXTENSIONS-JUGEES.json, invisible à git status.
  const brut = readFileSync(join(depot, "referentiel.json"), "utf8");
  attendre(20);
  garde.jouer("recette-qui-remet", () => { writeFileSync(join(depot, "referentiel.json"), "{ ceci n'est pas du json", "utf8"); writeFileSync(join(depot, "referentiel.json"), brut, "utf8"); });
  // ROUGE 3 : ne réécrit que les fins de ligne — le cas de l'étude HTML régénérée en place.
  attendre(20);
  garde.jouer("recette-fins-de-ligne", () => writeFileSync(join(depot, "etude.html"), "<p>un</p>\n<p>deux</p>\n", "utf8"));
  // ROUGE 4 : supprime un fichier suivi.
  attendre(20);
  garde.jouer("recette-qui-supprime", () => unlinkSync(join(depot, "a-supprimer.md")));
  // VERT 1 : écrit sous le dossier temporaire — le remède, ce que les deux recettes font désormais.
  attendre(20);
  garde.jouer("recette-sur-copie", () => writeFileSync(join(ailleurs, "copie.json"), "{}", "utf8"));
  // VERT 2 : écrit un fichier NON suivi — hors du périmètre de la garde, et c'est déclaré.
  attendre(20);
  garde.jouer("recette-non-suivi", () => writeFileSync(join(depot, "diagnostic.log"), "trace\n", "utf8"));

  const nommees = new Map(garde.ecritures.map((e) => [e.nom, e.chemins]));
  veut((nommees.get("recette-qui-ecrit") || []).includes("referentiel.json"),
    "cas rouge : une recette qui change un fichier suivi n'est PAS nommée avec son chemin");
  veut((nommees.get("recette-qui-remet") || []).includes("referentiel.json"),
    "cas rouge : une recette qui écrit puis remet un fichier suivi n'est PAS nommée — le cas d'EXTENSIONS-JUGEES.json passerait");
  veut((nommees.get("recette-fins-de-ligne") || []).includes("etude.html"),
    "cas rouge : une recette qui réécrit les seules fins de ligne n'est PAS nommée — le cas de l'étude HTML passerait");
  veut((nommees.get("recette-qui-supprime") || []).includes("a-supprimer.md"),
    "cas rouge : une recette qui supprime un fichier suivi n'est PAS nommée");
  veut(!nommees.has("recette-sur-copie"), "cas vert : une recette qui travaille sous le dossier temporaire est accusée à tort");
  veut(!nommees.has("recette-non-suivi"), "cas vert : une recette qui écrit un fichier non suivi est accusée à tort");
  veut(garde.ecritures.length === 4, `la garde a nommé ${garde.ecritures.length} recette(s), 4 attendues — une écriture est imputée à la mauvaise recette`);

  // TF-1878 (19/10/2026) — LA GARDE SE BORNE AUX ÉCRITURES DES RECETTES ELLES-MÊMES. Une autre session qui
  // écrit un fichier suivi pendant un passage de 18 à 20 minutes était imputée à la recette en cours. La
  // contre-épreuve : une recette suspecte est REJOUÉE seule ; un chemin qu'elle ne réécrit pas est tiers.
  // Le tiers est simulé par un appel : il n'écrit que la PREMIÈRE fois, comme une session qui passe.
  let appels = 0;
  attendre(20);
  garde.jouer("recette-propre-et-voisin-actif", () => {
    appels++;
    if (appels === 1) writeFileSync(join(depot, "voisin.md"), "# réécrit par la session voisine\n", "utf8");
  });
  const apresTiers = garde.ecritures.map((e) => e.nom);
  veut(!apresTiers.includes("recette-propre-et-voisin-actif"),
    "cas vert : l'écriture d'une AUTRE session pendant une recette propre est imputée à cette recette (TF-1878)");
  veut((garde.concurrentes || []).some((c) => c.nom === "recette-propre-et-voisin-actif" && c.chemins.includes("voisin.md")),
    "cas vert : l'écriture d'un tiers n'est pas NOMMÉE comme présumée concurrente — elle serait tue, et un silence se lit comme un vert");
  // Rouge : la recette écrit son propre fichier à CHAQUE passage, le tiers une fois — seul le premier est imputé.
  let passes = 0;
  attendre(20);
  garde.jouer("recette-fautive-et-voisin-actif", () => {
    passes++;
    writeFileSync(join(depot, "propre.json"), `{ "propre": ${passes + 1} }\n`, "utf8");
    if (passes === 1) writeFileSync(join(depot, "voisin.md"), "# encore la session voisine\n", "utf8");
  });
  const fautive = garde.ecritures.find((e) => e.nom === "recette-fautive-et-voisin-actif");
  veut(fautive && fautive.chemins.length === 1 && fautive.chemins[0] === "propre.json",
    `cas rouge : une recette qui écrit un fichier suivi à chaque passage doit être imputée sur ce seul fichier — reçu ${JSON.stringify(fautive)}`);

  // NON JOUÉE : hors d'un dépôt git, la garde le dit au lieu de rendre un vert.
  veut(releverSuivis(ailleurs) === null && creerGarde(ailleurs).jouee === false,
    "hors d'un dépôt git, la garde se dit jouée — son silence se lirait comme un vert");
} finally {
  rmSync(depot, { recursive: true, force: true });
  rmSync(ailleurs, { recursive: true, force: true });
}

if (casse.length) {
  console.log(`Self-test garde-arbre-suivi : ${12 - casse.length}/12 PASS · CASSE : ${casse.join(" · ")}`);
  process.exit(1);
}
console.log("Self-test garde-arbre-suivi : 12/12 PASS (garde jouée dans un dépôt git ; quatre cas rouges nommés avec leur chemin — contenu changé, "
  + "fichier écrit puis remis, fins de ligne seules réécrites, fichier supprimé ; deux cas verts tus — écriture "
  + "sous le dossier temporaire, fichier non suivi ; aucune écriture imputée à la mauvaise recette ; hors git, "
  + "garde déclarée non jouée ; TF-1878 : l'écriture d'une autre session pendant une recette propre n'est pas imputée "
  + "mais NOMMÉE, et une recette fautive qui subit la même écriture n'est imputée que sur son propre fichier)");
