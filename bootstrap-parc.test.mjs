#!/usr/bin/env node
// bootstrap-parc.test.mjs — TF-0629 : le balayage des dépôts pièges de `bootstrap.mjs`, éprouvé.
//
// POURQUOI CE FICHIER EXISTE. Le 25/08, `grep -rln "SECOND CLONE" oracles/ scripts/` ne rendait
// RIEN : le harnais du pilot jouait 68 recettes et AUCUNE ne touchait `bootstrap.mjs`. Or ce
// fichier porte le balayage qui déclare les dépôts pièges de la racine du parc — celui qui existe
// parce qu'un dépôt fantôme a été compté comme vivant par tout oracle de parc (TF-0533).
//
// CE QUE L'ABSENCE DE RECETTE A COÛTÉ, et c'est un compte, pas une impression : CINQ trous dans ce
// seul balayage — trois le 23/08 (TF-0534), un le 25/08 sur la table d'alias qui oubliait le pilot
// (TF-0628), un le 25/08 sur les liens symboliques invisibles aux deux versants (TF-0631). Tous
// trouvés À L'ŒIL, en regardant la racine du parc. Aucun par un contrôle.
// *Un contrôle non couvert dont on sait qu'il a livré cinq trous n'est pas un contrôle : c'est une
// intention.*
//
// COMMENT ON ÉPROUVE UN BALAYAGE QUI LIT LE DISQUE RÉEL. `bootstrap.mjs` fait
// `readdirSync(racine)` et interroge des origins git. La recette monte donc un PARC FACTICE —
// répertoires temporaires, dépôts git locaux, origins posées à la main — et s'y branche par
// `--racine`, `--sans-pilot` et `--sans-skills`, trois drapeaux que l'en-tête du fichier documente
// déjà comme « recette ». L'affordance était écrite ; elle n'était pas câblée (loi transverse n° 1).
//
// AUCUN RÉSEAU : `BOOTSTRAP_SOURCE` pointe un dossier local de dépôts nus. Les forges de la liste
// n'y sont pas, leurs clones échouent, et c'est sans importance — la section jugée ici vient après.
//
// Les six branches couvertes, une par cas :
//   1. SECOND CLONE reconnu PAR ALIAS (origin sous un ancien nom du pilot) — TF-0628 ;
//   2. mise de côté (`_archive-`) — un dépôt archivé reste déclaré, il ne disparaît pas ;
//   3. répertoire NON versionné portant un nom de l'écosystème ;
//   4. dépôt hors liste avec SON PROPRE origin — ni forge, ni clone, ni mise de côté ;
//   5. LIEN SYMBOLIQUE — invisible à `isDirectory()` comme à `isFile()` (TF-0631) ;
//   6. puits de redirection raté (`null`) — le versant fichiers (TF-0598).
//
// Joué par oracles/self-tests.mjs (invariant I2 : tout `*.test.mjs` du dépôt est joué).

import { mkdirSync, mkdtempSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const BOOTSTRAP = join(ICI, "bootstrap.mjs");
const base = mkdtempSync(join(tmpdir(), "tf0629-"));
const echecs = [];
const nonJuge = [];

const git = (dir, ...args) =>
  execFileSync("git", ["-C", dir, "-c", "user.email=test@test", "-c", "user.name=test", ...args],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

/** Une ligne du rapport qui nomme `quoi`, ou `null`. Le rapport est la SEULE sortie jugée ici. */
const ligneSur = (rapport, quoi) =>
  rapport.split("\n").find((l) => l.includes(quoi)) || null;

try {
  const dépôtsNus = join(base, "nus");
  const parc = join(base, "parc");
  mkdirSync(dépôtsNus, { recursive: true });
  mkdirSync(parc, { recursive: true });

  // -- le pilot factice, et son dépôt nu ------------------------------------------------------
  const nuPilot = join(dépôtsNus, "digit-ai-factory.git");
  mkdirSync(nuPilot);
  git(nuPilot, "init", "--bare", "--initial-branch=main", ".");

  const pilot = join(parc, "digit-ai-factory");
  git(base, "clone", "--quiet", nuPilot, pilot);
  writeFileSync(join(pilot, "REGLES-PROJET.md"), "# règles\n", "utf8");
  git(pilot, "add", "-A");
  git(pilot, "commit", "--quiet", "-m", "socle");
  writeFileSync(join(pilot, "CONTRAT-INTERFACE.md"), "# contrat\n", "utf8");
  git(pilot, "add", "-A");
  git(pilot, "commit", "--quiet", "-m", "second commit");
  git(pilot, "push", "--quiet", "origin", "main");

  // -- CAS 1 : le second clone, reconnu par ALIAS et non par son nom (TF-0628) -----------------
  // Son origin porte `digit-ai-forge-pilot`, un ANCIEN nom du pilot. Deux chaînes différentes de
  // celle du pilot vivant : sans la table d'alias, aucun rapprochement — et c'est exactement le
  // défaut mesuré le 25/08. Le nom du répertoire, lui, ne dit rien d'utile : il est choisi ici
  // SANS suffixe `_old`, pour que le hasard du nommage ne puisse pas sauver le contrôle.
  const clone = join(parc, "copie-du-pilot");
  git(base, "clone", "--quiet", nuPilot, clone);
  git(clone, "reset", "--hard", "--quiet", "HEAD~1");        // 1 commit de retard, déterministe
  git(clone, "remote", "set-url", "origin", join(dépôtsNus, "digit-ai-forge-pilot.git"));

  // -- CAS 2 : une mise de côté, avec son propre origin inconnu --------------------------------
  const archive = join(parc, "_archive-vieille-chose");
  const nuAutre = join(dépôtsNus, "autre-chose.git");
  mkdirSync(nuAutre);
  git(nuAutre, "init", "--bare", "--initial-branch=main", ".");
  git(base, "clone", "--quiet", nuAutre, archive);

  // -- CAS 3 : un répertoire NON versionné au nom de l'écosystème ------------------------------
  mkdirSync(join(parc, "digit-ai-pas-un-depot"));

  // -- CAS 4 : un dépôt de l'écosystème HORS LISTE, avec son propre origin ---------------------
  const autonome = join(parc, "digit-ai-autonome");
  git(base, "clone", "--quiet", nuAutre, autonome);

  // -- CAS 5 : un lien symbolique (TF-0631) ----------------------------------------------------
  // Un lien symbolique de répertoire demande sous Windows un privilège qui n'est pas garanti :
  // la première tentative rend EPERM sur ce poste. Une JONCTION, elle, n'en demande aucun — et
  // c'est la même chose pour ce qu'on mesure ici : vérifié, un `Dirent` de jonction rend
  // `isDirectory:false | isFile:false | isSymbolicLink:true`, exactement la signature qui faisait
  // tomber l'entrée entre les deux versants du balayage. Le repli n'affaiblit donc pas le cas.
  // Si les DEUX échouent, le cas est DÉCLARÉ non jugé — jamais tenu pour vert par omission.
  let lienPose = false;
  for (const forme of ["dir", "junction"]) {
    try {
      symlinkSync(join(parc, "cible-absente"), join(parc, "lien-oublie"), forme);
      lienPose = true;
      break;
    } catch (e) {
      if (forme === "junction") {
        nonJuge.push("le cas LIEN SYMBOLIQUE : ni lien ni jonction créables sur ce poste "
          + `(${e.code || e.message}) — le contrôle n'est PAS jugé ici`);
      }
    }
  }

  // -- CAS 6 : un puits de redirection raté ----------------------------------------------------
  writeFileSync(join(parc, "null"), "corps d'une réponse qu'on croyait jeter\n", "utf8");

  // -- exécution, sans réseau et sans toucher au vrai poste ------------------------------------
  const r = spawnSync(process.execPath,
    [BOOTSTRAP, "--racine", parc, "--sans-pilot", "--sans-skills"],
    { encoding: "utf8", env: { ...process.env, BOOTSTRAP_SOURCE: dépôtsNus } });
  const rapport = r.stdout || "";

  // -- les six jugements ------------------------------------------------------------------------
  const l1 = ligneSur(rapport, "copie-du-pilot");
  if (!l1) echecs.push("CAS 1 (second clone par alias) : le dépôt n'est déclaré NULLE PART");
  else if (!/SECOND CLONE de digit-ai-factory/.test(l1))
    echecs.push(`CAS 1 : déclaré, mais pas comme second clone du pilot — « ${l1.slice(0, 120)} »`);
  else if (!/1 commit\(s\) de retard/.test(l1))
    echecs.push(`CAS 1 : second clone annoncé SANS son retard — c'est le chiffre qui rend l'avertissement actionnable — « ${l1.slice(0, 140)} »`);
  else if (!/registre mort/.test(l1))
    echecs.push("CAS 1 : second clone annoncé sans dire ce qu'on risque en y travaillant");

  const l2 = ligneSur(rapport, "_archive-vieille-chose");
  if (!l2) echecs.push("CAS 2 (mise de côté) : un dépôt archivé qui n'apparaît PLUS n'est pas un progrès — c'est un piège redevenu silencieux");
  else if (!/mise de côté/.test(l2)) echecs.push(`CAS 2 : déclaré sous un autre motif — « ${l2.slice(0, 120)} »`);

  const l3 = ligneSur(rapport, "digit-ai-pas-un-depot");
  if (!l3) echecs.push("CAS 3 (répertoire non versionné) : non déclaré");
  else if (!/NON versionné/.test(l3)) echecs.push(`CAS 3 : déclaré sous un autre motif — « ${l3.slice(0, 120)} »`);

  const l4 = ligneSur(rapport, "digit-ai-autonome");
  if (!l4) echecs.push("CAS 4 (dépôt hors liste) : non déclaré — il tombe entre toutes les branches, comme `digit-ai-queue` avant TF-0535");
  else if (!/HORS LISTE/.test(l4)) echecs.push(`CAS 4 : déclaré sous un autre motif — « ${l4.slice(0, 120)} »`);

  if (lienPose) {
    const l5 = ligneSur(rapport, "lien-oublie");
    if (!l5) echecs.push("CAS 5 (lien symbolique) : non déclaré — `isDirectory()` et `isFile()` sont faux tous les deux, il tombe entre les deux versants");
    else if (!/LIEN SYMBOLIQUE/.test(l5)) echecs.push(`CAS 5 : déclaré sous un autre motif — « ${l5.slice(0, 120)} »`);
    else if (!/N'EXISTE PAS/.test(l5)) echecs.push("CAS 5 : lien déclaré sans dire que sa cible est absente");
  }

  const l6 = ligneSur(rapport, "null — FICHIER");
  if (!l6) echecs.push("CAS 6 (puits de redirection raté) : non déclaré");

  // -- LA BORNE : le contrôle ne s'invente pas de cible ------------------------------------------
  // Sans ce cas, une règle qui crierait sur TOUT passerait les six précédents. Le pilot factice
  // est un dépôt normal du parc : il ne doit apparaître dans AUCUN avertissement de ce balayage.
  const faussePositive = rapport.split("\n").filter((l) =>
    /^\[avert\]/.test(l) && /digit-ai-factory —/.test(l));
  if (faussePositive.length)
    echecs.push(`BORNE : le dépôt normal est déclaré suspect — « ${faussePositive[0].slice(0, 140)} »`);
} catch (err) {
  echecs.push(`harnais : ${String(err).slice(0, 400)}`);
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* Windows : verrou git résiduel toléré */ }
}

for (const n of nonJuge) console.log(`  NON JUGÉ — ${n}`);
if (echecs.length) {
  console.error("bootstrap — balayage du parc (TF-0629) : FAIL\n  - " + echecs.join("\n  - "));
  process.exit(1);
}
// SEPT cas quand tout est jouable : les six branches plus la borne. Le compte SOUSTRAIT ce qui
// n'a pas pu etre joue, et la ligne NON JUGE le nomme juste au-dessus : un cas absent ne se
// confond jamais avec un cas vert.
const TOTAL = 7;
const joues = TOTAL - nonJuge.length;
const couvert = ["second clone par alias (avec son retard)", "mise de cote", "non versionne",
  "hors liste", ...(nonJuge.length ? [] : ["lien symbolique"]), "puits rate", "la borne"].join(", ");
console.log(`bootstrap - balayage du parc (TF-0629) : ${joues}/${TOTAL} - ${couvert}`);
