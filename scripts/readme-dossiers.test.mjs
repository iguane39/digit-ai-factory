#!/usr/bin/env node
/**
 * readme-dossiers.test.mjs — TF-0503 : la table des README ne porte AUCUNE date, donc un commit
 * ne la périme plus. Et la dérive de STRUCTURE reste un défaut.
 *
 * Le fait fondateur, mesuré sept fois sur sept le 22/08/2026. La table portait une colonne
 * « Dernier commit ». Régénérée par le hook AVANT le commit, elle annonçait « non versionné »
 * pour les fichiers que ce commit était justement en train de versionner ; le hook la
 * régénérait après, et l'arbre de travail ressortait SALE d'un commit qui venait de tout
 * prendre. TF-0451 (21/08) avait atténué l'effet — une dérive de date seule devenait un
 * avertissement à `--check` — mais le hook, lui, réécrivait le fichier quand même : l'effet
 * revenait par la porte de l'écriture.
 *
 * La cause est retirée par décision humaine du 22/08 : « ne fais pas de boucle sur les dates
 * des fichiers et/ou dossiers pour ne pas faire grossir inutilement les traitements ou les
 * changements ». Plus de colonne, donc plus de `git log` sur l'arbre à chaque écriture, plus de
 * balayage par dossier, et plus de tolérance à maintenir : ce qui fait DÉFAUT est la structure
 * (fichier apparu, disparu, renommé) et le rôle non rédigé.
 *
 * La recette mesure les deux sens : la table est SANS date (et sans le mot qui la remplaçait),
 * un vrai commit ne change RIEN au README (c'est le défaut d'origine, joué en dépôt réel), et
 * une dérive de structure est TOUJOURS refusée.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "readme-dossiers.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// TF-1133 (15/09/2026) — LE GÉNÉRATEUR PSEUDONYMISE CE QU'IL ÉCRIT (D-37), DONC CETTE RECETTE LUI
// DONNE DES TABLES, ET CE SONT LES SIENNES. Sans elles, il lisait celles du canal confidentiel de ce
// poste (origine « canal » mesurée) ; sur un clone frais, sans canal, il refusait à bon droit
// d'écrire un index qu'il ne pouvait pas pseudonymiser, et la recette tombait sur ENOENT au premier
// README attendu. Tables INVENTÉES, sous un dossier temporaire, désignées pour ce processus et ses
// sous-processus seulement : jamais lues, copiées ni exportées depuis le canal (TF-0957).
const TABLES = mkdtempSync(join(tmpdir(), "readme-tables-"));
writeFileSync(join(TABLES, "_noms-interdits.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
writeFileSync(join(TABLES, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
process.env.FORGE_NOMS_INTERDITS = join(TABLES, "_noms-interdits.json");
process.env.FORGE_PRODUITS_PSEUDO = join(TABLES, "_produits-pseudonymes.json");

const T = mkdtempSync(join(tmpdir(), "readme-sans-dates-"));
mkdirSync(join(T, "input", "sous"), { recursive: true });
mkdirSync(join(T, "output"), { recursive: true });
writeFileSync(join(T, "input", "a.md"), "# Document A\n", "utf8");
writeFileSync(join(T, "input", "b.md"), "# Document B\n", "utf8");

const lancer = (extra = []) =>
  spawnSync(process.execPath, [OUTIL, "--base", T, "--racines", "input,output", ...extra],
    { encoding: "utf8" });
const git = (...a) => spawnSync("git", ["-C", T, ...a], { encoding: "utf8" });

// Un dépôt git RÉEL : c'est la seule façon de rejouer le défaut d'origine, qui n'apparaissait
// qu'au moment où un fichier passait de « inconnu de git » à « versionné ».
git("init", "-q", "-b", "main");
git("config", "user.email", "recette@local");
git("config", "user.name", "recette");
git("config", "commit.gpgsign", "false");

// Mise en place : générer, puis rédiger les rôles (un rôle non rédigé est un défaut à part).
lancer();
const README = join(T, "input", "README.md");
for (const chemin of [README, join(T, "input", "sous", "README.md"), join(T, "output", "README.md")]) {
  writeFileSync(chemin, readFileSync(chemin, "utf8")
    .replace(/<!-- ROLE:DEBUT -->[\s\S]*?<!-- ROLE:FIN -->/,
      "<!-- ROLE:DEBUT -->\nDossier de recette.\n<!-- ROLE:FIN -->"), "utf8");
}
// Le générateur PRÉSERVE le rôle mais réécrit sa mise en forme — sans ce second passage, le
// témoin ne serait pas ce que `--check` attend, et la recette mesurerait son échafaudage.
lancer();

check("mise en place : arbre régénéré et rôles rédigés → --check PASS", () => {
  const r = lancer(["--check"]);
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${(r.stderr || "").slice(0, 200)}`);
});

check("la table ne porte AUCUNE colonne de date — ni en-tête, ni « non versionné », ni date ISO", () => {
  const t = readFileSync(README, "utf8");
  if (/Dernier commit/.test(t)) throw new Error("l'en-tête « Dernier commit » est encore là");
  if (/non versionné/.test(t)) throw new Error("« non versionné » subsiste — la colonne a survécu");
  if (/\d{4}-\d{2}-\d{2}/.test(t)) throw new Error("une date ISO subsiste dans la table");
  const entete = t.split("\n").find((l) => l.startsWith("| Élément"));
  if (!entete) throw new Error("en-tête de table introuvable");
  const colonnes = entete.split("|").filter((c) => c.trim()).length;
  if (colonnes !== 4) throw new Error(`${colonnes} colonnes, 4 attendues (Élément, Type, Taille, Titre / nature)`);
});

check("aucun appel à `git log` : le générateur ne lit plus l'historique", () => {
  const src = readFileSync(OUTIL, "utf8");
  const appels = src.split("\n").filter((l) => !l.trim().startsWith("*") && !l.trim().startsWith("//"));
  if (appels.some((l) => /"log"/.test(l))) throw new Error("un appel `git log` subsiste dans le code exécuté");
});

// LE DÉFAUT D'ORIGINE, joué tel quel : un commit qui versionne les fichiers ne doit RIEN changer.
check("TF-0503 — un commit qui versionne les fichiers ne change PAS le README (le défaut d'origine)", () => {
  const avant = readFileSync(README, "utf8");
  git("add", "-A");
  const c = git("commit", "-q", "-m", "recette : tout versionner");
  if (c.status !== 0) throw new Error(`le commit de recette a échoué : ${(c.stderr || "").slice(0, 150)}`);
  const r = lancer();
  if (r.status !== 0) throw new Error(`régénération en échec : ${(r.stderr || "").slice(0, 200)}`);
  if (readFileSync(README, "utf8") !== avant) throw new Error("le README a changé APRÈS le commit — le cycle est encore là");
  const v = lancer(["--check"]);
  if (v.status !== 0) throw new Error(`--check refuse après le commit (exit ${v.status}) : ${(v.stderr || "").slice(0, 200)}`);
});

const temoin = readFileSync(README, "utf8");

check("dérive de STRUCTURE (une ligne de fichier retirée) → --check REFUSE, avec son motif", () => {
  writeFileSync(README, temoin.split("\n").filter((l) => !l.startsWith("| `b.md`")).join("\n"), "utf8");
  const r = lancer(["--check"]);
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1 — la structure n'est plus jugée`);
  if (!/périmé/.test(r.stderr || "")) throw new Error("le motif du refus n'est pas dit");
});

check("un fichier AJOUTÉ au dossier reste un défaut", () => {
  writeFileSync(README, temoin, "utf8");
  writeFileSync(join(T, "input", "c.md"), "# Document C\n", "utf8");
  const r = lancer(["--check"]);
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1`);
});

check("`--strict` a disparu sans casser l'appel : le drapeau est ignoré, le verdict est le même", () => {
  writeFileSync(README, temoin, "utf8");
  rmSync(join(T, "input", "c.md"), { force: true });
  lancer();
  const sans = lancer(["--check"]);
  const avec = lancer(["--check", "--strict"]);
  if (sans.status !== avec.status) throw new Error(`verdicts divergents : ${sans.status} vs ${avec.status}`);
  if (sans.status !== 0) throw new Error(`exit ${sans.status} attendu 0`);
});

// ---- TF-0914 : UN INDEX SUIVI NE PORTE PAS LE NOM D'UN FICHIER QUE LE DÉPÔT NE PORTE PAS -----
//
// Le 08/09, un lot déposé par un produit dont le nom réel n'est PAS connu du canal confidentiel
// est resté non suivi le temps d'un arbitrage ; le hook a écrit ce nom dans l'index, qui est
// suivi et publié. La pseudonymisation ne pouvait rien : elle ne substitue que ce qu'elle
// connaît. La règle qui supprime la classe : hors de l'histoire du dépôt, hors de l'index.
//
// LES DEUX SENS, sur le même dossier et dans le même état de départ :
//   · non suivi  → ABSENT de la table, et son NOMBRE dit au pied (jamais par omission) ;
//   · suivi      → PRÉSENT, dès le commit qui le versionne et sans autre geste.
const NOM_NON_SUIVI = "Client-X_Reporting - RETOURS - 20260908z.md";
writeFileSync(join(T, "input", NOM_NON_SUIVI), "# Retours d un produit dont le nom n est pas au canal\n", "utf8");
lancer();

check("TF-0914 : un fichier NON SUIVI n'entre pas dans l'index, et le pied DIT combien ont été écartés", () => {
  const t = readFileSync(README, "utf8");
  if (t.includes(NOM_NON_SUIVI)) throw new Error("le nom d'un fichier non suivi est écrit dans un index suivi et publié");
  if (!/1 fichier\(s\) présent\(s\) sur le poste et NON suivi\(s\) par git/.test(t))
    throw new Error("l'index tait ce qu'il a écarté — un index muet se lit comme un index complet (loi n° 3)");
});

check("TF-0914 : le MÊME fichier, une fois COMMIS, entre dans l'index sans autre geste", () => {
  git("add", "-A");
  const c = git("commit", "-q", "-m", "recette : versionner le lot");
  if (c.status !== 0) throw new Error(`commit de recette en échec : ${(c.stderr || "").slice(0, 150)}`);
  lancer();
  const t = readFileSync(README, "utf8");
  if (!t.includes(NOM_NON_SUIVI)) throw new Error("un fichier SUIVI reste absent de l'index — la règle a mordu trop large");
  if (/NON suivi\(s\) par git/.test(t)) throw new Error("le pied annonce encore un écart alors qu'il n'y en a plus");
});

// TF-1050 — UN LIVRABLE À STRUCTURE CLOSE NE REÇOIT AUCUN INDEX. Le cas du 11/09 en miniature :
// une définition de modèle à trois niveaux. Marquée `.no-index`, elle ne reçoit rien et son
// parent la compte pour un ; la même sans marqueur reçoit un README par niveau (le défaut).
{
  const B = mkdtempSync(join(tmpdir(), "readme-clos-"));
  for (const d of ["clos", "ouvert"]) {
    mkdirSync(join(B, "input", d, "definition", "tables"), { recursive: true });
    writeFileSync(join(B, "input", d, "definition", "tables", "Dim Bien.tmdl"), "table\n", "utf8");
  }
  writeFileSync(join(B, "input", "clos", ".no-index"), "", "utf8");
  spawnSync(process.execPath, [OUTIL, "--base", B, "--racines", "input"], { encoding: "utf8" });
  check("TF-1050 vert — le dossier marqué `.no-index` ne reçoit AUCUN README, à aucun niveau", () => {
    for (const d of ["clos", "clos/definition", "clos/definition/tables"])
      if (existsSync(join(B, "input", d, "README.md"))) throw new Error(`un README est écrit dans le livrable à structure close : ${d}`);
  });
  check("TF-1050 — le parent le compte comme UN livrable à structure close", () => {
    const t = readFileSync(join(B, "input", "README.md"), "utf8");
    if (!/`clos\\` \| livrable à structure close \(1 fichier\)/.test(t)) throw new Error("le parent ne déclare pas le livrable clos comme une entrée unique");
  });
  check("TF-1050 rouge — le même dossier SANS marqueur reçoit un README par niveau (le défaut d'origine)", () => {
    for (const d of ["ouvert", "ouvert/definition", "ouvert/definition/tables"])
      if (!existsSync(join(B, "input", d, "README.md"))) throw new Error(`le témoin sans marqueur n'a pas son README en ${d} — la recette ne prouve plus rien`);
  });
  rmSync(B, { recursive: true, force: true });
}

// TF-1126 — UN FORMAT TIERS SE RECONNAÎT À SON MANIFESTE, SANS MARQUEUR. Le cas du 15/09 en
// miniature : un projet Power BI (`.pbip` à la racine, un `.SemanticModel\` et un `.Report\`) que
// personne n'a marqué. Il ne reçoit aucun README, et son décompte de fichiers ne bouge pas ; un
// dossier ordinaire voisin reçoit toujours le sien (le sens vert qui prouve que la règle ne mord
// pas trop large). Et un élément de format reconnu à son seul nom, hors projet, est clos aussi.
{
  const B = mkdtempSync(join(tmpdir(), "readme-tiers-"));
  const P = join(B, "output", "Projet Power BI");
  mkdirSync(join(P, "Modele.SemanticModel", "definition", "tables"), { recursive: true });
  mkdirSync(join(P, "Modele.Report", "definition"), { recursive: true });
  writeFileSync(join(P, "Modele.pbip"), "{}\n", "utf8");
  writeFileSync(join(P, "Modele.SemanticModel", "definition", "tables", "Dim.tmdl"), "table\n", "utf8");
  writeFileSync(join(P, "Modele.Report", "definition", "report.json"), "{}\n", "utf8");
  mkdirSync(join(B, "output", "ordinaire", "sous"), { recursive: true });
  writeFileSync(join(B, "output", "ordinaire", "sous", "note.md"), "# note\n", "utf8");
  mkdirSync(join(B, "output", "Seul.SemanticModel", "definition"), { recursive: true });
  writeFileSync(join(B, "output", "Seul.SemanticModel", "definition", "model.tmdl"), "model\n", "utf8");
  const compte = (d) => { let n = 0; for (const e of readdirSync(d, { withFileTypes: true })) n += e.isDirectory() ? compte(join(d, e.name)) : 1; return n; };
  const avant = compte(P);
  spawnSync(process.execPath, [OUTIL, "--base", B, "--racines", "output"], { encoding: "utf8" });
  check("TF-1126 vert — le projet au manifeste tiers ne reçoit AUCUN README, à aucune profondeur, et garde son décompte", () => {
    for (const d of ["", "Modele.SemanticModel", "Modele.SemanticModel/definition", "Modele.SemanticModel/definition/tables", "Modele.Report", "Modele.Report/definition"])
      if (existsSync(join(P, d, "README.md"))) throw new Error(`un README est écrit dans le format tiers : ${d || "(racine)"}`);
    const apres = compte(P);
    if (apres !== avant) throw new Error(`décompte ${avant} → ${apres}`);
  });
  check("TF-1126 — le parent nomme le manifeste qui a clos le dossier", () => {
    const t = readFileSync(join(B, "output", "README.md"), "utf8");
    if (!/`Projet Power BI\\` \| livrable à structure close \(3 fichiers\) .*manifeste tiers `Modele\.pbip`/.test(t)) throw new Error("le parent ne déclare pas le projet comme livrable clos par son manifeste");
    if (!/`Seul\.SemanticModel\\` \| livrable à structure close .*reconnu à son nom/.test(t)) throw new Error("l'élément de format reconnu à son nom n'est pas déclaré clos");
  });
  check("TF-1126 vert — un dossier ordinaire voisin reçoit toujours son README, à chaque niveau", () => {
    for (const d of ["ordinaire", "ordinaire/sous"])
      if (!existsSync(join(B, "output", d, "README.md"))) throw new Error(`README manquant en ${d} — la règle mord trop large`);
    if (existsSync(join(B, "output", "Seul.SemanticModel", "README.md"))) throw new Error("README écrit dans un élément de format reconnu à son nom");
  });
  rmSync(B, { recursive: true, force: true });
}

// TF-1055 — UN DOSSIER IGNORÉ PAR GIT N'A PAS DE LIEN DANS L'INDEX SUIVI. Le sas d'arrivée est
// ignoré ; son README aussi. L'index suivi du parent y pointait : lien mort sur tout clone frais.
{
  const B = mkdtempSync(join(tmpdir(), "readme-ignore-"));
  const gb = (...a) => spawnSync("git", ["-C", B, ...a], { encoding: "utf8" });
  gb("init", "-q", "-b", "main");
  mkdirSync(join(B, "input", "sas"), { recursive: true });
  mkdirSync(join(B, "input", "suivi"), { recursive: true });
  writeFileSync(join(B, ".gitignore"), "input/sas/\n", "utf8");
  writeFileSync(join(B, "input", "sas", "lot.md"), "# lot\n", "utf8");
  writeFileSync(join(B, "input", "suivi", "doc.md"), "# doc\n", "utf8");
  gb("add", ".gitignore", "input/suivi/doc.md");
  spawnSync(process.execPath, [OUTIL, "--base", B, "--racines", "input"], { encoding: "utf8" });
  const t = readFileSync(join(B, "input", "README.md"), "utf8");
  check("TF-1055 rouge → vert — le dossier ignoré n'a PAS de lien vers un README qu'aucun clone ne porte", () => {
    if (/\]\(sas\/README\.md\)/.test(t)) throw new Error("l'index suivi pointe encore vers le README d'un dossier ignoré");
    if (!/`sas\\` \| dossier ignoré par git/.test(t)) throw new Error("le dossier ignoré n'est pas déclaré comme tel");
  });
  check("TF-1055 vert — un dossier SUIVI garde son lien", () => {
    if (!/\]\(suivi\/README\.md\)/.test(t)) throw new Error("le lien d'un dossier suivi a disparu — la règle mord trop large");
  });
  rmSync(B, { recursive: true, force: true });
}

rmSync(T, { recursive: true, force: true });
rmSync(TABLES, { recursive: true, force: true });
console.log(`\nreadme-dossiers, table sans dates (TF-0503) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
