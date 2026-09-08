#!/usr/bin/env node
/**
 * relever-heritage.mjs — l'état de l'héritage chez TOUS les produits du parc, sans rien y écrire.
 *
 * ============================================================================================
 * POURQUOI (TF-0626, décision humaine du 25/08/2026 — « mesurer d'abord, décider ensuite »)
 * ============================================================================================
 *
 * LE FAIT QUI L'A FAIT NAÎTRE. En corrigeant le résolveur de produits (TF-0623), la localisation
 * a cessé d'être aveugle — et la première mesure possible a rendu, pour deux produits, SIX et SEPT
 * artefacts d'héritage absents sur huit. Parmi les absents : le gabarit de restitution et le hook
 * qui la juge. Un produit qui ne les a pas rend ses travaux hors du format prescrit SANS QU'AUCUN
 * CONTRÔLE NE LE REFUSE.
 *
 * CE QUI REND LE RELEVÉ NÉCESSAIRE PLUTÔT QU'UNE SUITE DE GESTES. R-47 existe, elle est câblée à
 * l'ingestion, sa recette est verte — et elle rendait « non vérifié » sur les cibles qu'elle ne
 * savait pas trouver. Le parc croyait donc avoir un juge de conformité là où il n'en avait pas, et
 * personne ne pouvait le savoir. Avant de décider quoi recopier et où, il faut un état DATÉ,
 * exhaustif sur ce qui est localisable, et opposable.
 *
 * ============================================================================================
 * CE QU'IL FAIT, ET SURTOUT CE QU'IL NE FAIT PAS
 * ============================================================================================
 *
 * IL N'ÉCRIT RIEN CHEZ AUCUN PRODUIT. Pas un fichier, pas une ligne, pas un `.gitignore`. Il lit
 * des noms de fichiers et vérifie des existences. La recopie est un geste HUMAIN, produit par
 * produit (N-5 : seuls les produits se modifient eux-mêmes), et un relevé qui se mettrait à
 * réparer serait exactement le geste qu'aucun contrôle ne pourrait annuler.
 *
 * IL NE LIT AUCUN CONTENU, sauf pour les artefacts en `copie_conforme` dont il compare
 * l'EMPREINTE à celle de la source — c'est la seule façon de distinguer « présent » de « présent
 * et à jour », et cette distinction est le cœur du sujet : un produit qui porte une COPIE PÉRIMÉE
 * du gabarit est plus dangereux qu'un produit qui n'en a pas, parce qu'il croit être conforme.
 * L'empreinte est calculée sur les lignes normalisées (`lib-empreinte`), donc insensible aux fins
 * de ligne — sans quoi tout le parc paraîtrait divergent sous Windows.
 *
 * IL DÉCLARE CE QU'IL NE VOIT PAS. Un produit rangé au-delà de la profondeur bornée n'est pas
 * relevé, et le relevé le DIT plutôt que de laisser croire à l'exhaustivité.
 *
 * Usage : node scripts\relever-heritage.mjs [--md <fichier>] [--json]
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { empreinteFichier } from "./lib-empreinte.mjs";
import { PROFONDEUR_MAX, SAUTES } from "../todo/localiser-produit.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const racine = process.env.FORGE_ROOT || join(PILOT, "..");

/** Les dépôts du pilot et des forges ne sont pas des produits : ils ne reçoivent pas l'héritage. */
const PAS_UN_PRODUIT = /^(digit-ai|_archive-)/i;

const enfants = (d) => {
  try { return readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()); }
  catch { return []; }
};

//: Les dossiers qu'on ne fouille jamais en cherchant un artefact ailleurs : ils portent des copies
//: de tout, et y trouver un `robots.txt` ne dirait rien de ce que le produit SERT.
const JAMAIS_FOUILLES = new Set([
  ".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next", "old", "Old",
  "coverage", ".oracles", "input", "output", "forge",
]);

/**
 * Le même artefact, trouvé AILLEURS qu'à l'endroit prescrit — ou `null`.
 *
 * Cherché sur DEUX niveaux seulement, et jamais dans les dossiers ci-dessus : au-delà, on ne
 * trouve plus l'artefact du produit mais une copie de quelque chose. La fonction rend le CHEMIN
 * relatif tel qu'on le lit, parce que c'est lui l'information — pas le fait qu'un fichier de ce
 * nom existe quelque part (TF-0654).
 */
export function trouverAilleurs(dossierProduit, cible, profondeur = 2) {
  const nom = String(cible).replaceAll("\\", "/").split("/").pop();
  if (!nom) return null;
  const descendre = (d, niveau) => {
    if (niveau > profondeur) return null;
    for (const e of enfants(d)) {
      if (JAMAIS_FOUILLES.has(e.name) || e.name.startsWith(".")) continue;
      const candidat = join(d, e.name, nom);
      if (existsSync(candidat)) return relative(dossierProduit, candidat).replaceAll("\\", "/");
      const plusLoin = descendre(join(d, e.name), niveau + 1);
      if (plusLoin) return plusLoin;
    }
    return null;
  };
  return descendre(dossierProduit, 1);
}

/**
 * Tous les produits du parc, reconnus à leur `forge\` — le marqueur qu'un run de forge a eu lieu.
 * On ne descend pas SOUS un produit : ses sous-dossiers ne sont pas des produits.
 */
export function produitsDuParc(base, profondeurMax = PROFONDEUR_MAX) {
  const trouves = [];
  const descendre = (d, niveau) => {
    if (niveau > profondeurMax) return;
    for (const e of enfants(d)) {
      if (SAUTES.has(e.name)) continue;
      const c = join(d, e.name);
      if (niveau === 1 && PAS_UN_PRODUIT.test(e.name)) continue;
      if (existsSync(join(c, "forge"))) { trouves.push(c); continue; }
      descendre(c, niveau + 1);
    }
  };
  descendre(base, 1);
  return trouves;
}

/**
 * La racine WEB que le produit a DÉCLARÉE — ligne `racine_web:` du frontmatter de
 * `docs/projet/PARAMETRAGE.md` — ou null s'il n'a rien déclaré.
 *
 * TF-0793 (03/09/2026, lot du produit 02) : TF-0654 demandait cette déclaration et promettait
 * que le relevé cesserait de compter l'artefact « hors racine ». Le produit a déclaré
 * (`racine_web: site`, 01/09) et le relevé rendait toujours « 2 HORS RACINE » : AUCUN script ne
 * lisait la ligne — seul le gabarit d'émission des travaux la citait. Un contrôle qui prescrit
 * un geste et ne le lit jamais apprend au produit à l'ignorer. Lecture volontairement étroite :
 * une seule ligne, dans le frontmatter seulement, un chemin relatif au dépôt ; rien n'est deviné.
 */
export function racineWebDeclaree(dossierProduit) {
  const param = join(dossierProduit, "docs", "projet", "PARAMETRAGE.md");
  if (!existsSync(param)) return null;
  const texte = readFileSync(param, "utf8").replace(/^﻿/, "");
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texte);
  if (!fm) return null;
  const m = /^racine_web\s*:\s*["']?([^"'\r\n#]+?)["']?\s*$/m.exec(fm[1]);
  if (!m) return null;
  const rel = m[1].trim().replace(/^[.][\\/]/, "").replace(/[\\/]+$/, "");
  return rel && rel !== "." ? rel : null;
}

/**
 * TF-0882 — UN MOTIF D'EXCLUSION COUVERT PAR PLUS LARGE EST TENU.
 *
 * Un motif exigé (`*.oracles.json`) est TENU si une autre ligne du fichier, prise comme glob,
 * attrape tout ce qu'il attrape (`*.oracles*.json`). La couverture se prouve par TÉMOINS : on
 * fabrique depuis le motif exigé quelques chemins qu'il désigne — l'étoile valant rien, un mot,
 * puis un mot composé — et la ligne candidate doit les attraper TOUS. Un témoin qui échappe suffit
 * à refuser : mieux vaut demander une ligne de trop que déclarer protégé ce qui ne l'est pas.
 *
 * DEUX BORNES, chacune contre un dégât précis :
 *   · une NÉGATION (`!forge/**`) ne se couvre jamais : dans un `.gitignore`, c'est l'ORDRE des
 *     lignes qui décide du résultat, pas leur présence (leçon TF-0850 : insérer trois graphies
 *     APRÈS `!forge/**` aurait ré-ignoré onze fichiers que le dépôt portait déjà) ;
 *   · une ligne de NÉGATION ne couvre rien non plus — elle ré-inclut, elle n'exclut pas.
 *
 * Un motif à barre oblique finale (`.venv/`) est aussi cherché sans elle : dans un `.gitignore`,
 * `.venv` couvre le dossier comme le fichier.
 */
const globVersRegex = (glob) => {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") { if (glob[i + 1] === "*") { re += ".*"; i++; } else re += "[^/]*"; }
    else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${re}$`);
};
const temoinsDe = (motif) => [...new Set(["", "a", "a-b"].map((jeton) => motif.replace(/\*+/g, jeton)))];
export function estCouvertParPlusLarge(motif, lignes) {
  if (motif.startsWith("!")) return false;
  const familles = [temoinsDe(motif)];
  if (motif.endsWith("/")) familles.push(temoinsDe(motif.slice(0, -1)));
  for (const ligne of lignes) {
    if (ligne.startsWith("!") || ligne === motif) continue;
    let re;
    try { re = globVersRegex(ligne); } catch { continue; }
    if (familles.some((temoins) => temoins.every((t) => re.test(t)))) return true;
  }
  return false;
}

/**
 * TF-0851 / TF-0848 (08/09) — LE DISQUE N'EST PAS L'HISTOIRE, et R-47 ne lisait que le disque.
 *
 * Deux faits mesurés le 06/09 chez deux produits différents, même classe. (1) `forge/retours/
 * CLASSES.json` était PRÉSENT, conforme à une version du pilot, et NON SUIVI par git : il n'a pu
 * arriver que par une recopie d'héritage, et `git status` le rangeait en « Untracked ». (2) Trois
 * artefacts en copie conforme étaient CONFORMES au pilot et NON COMMIS : `recopier-heritage
 * --essai` les rendait [CONFORME], `git status` les rendait « modified », et R-47 comptait
 * « 11 artefacts présents et à jour » — verdict identique qu'ils soient versionnés ou non.
 *
 * CE QUE ÇA COÛTE : un `git restore` ramène l'héritage de la veille, un `git clone` (CI, autre
 * poste) livre les artefacts périmés, et la session suivante ne peut pas distinguer ces recopies
 * de travaux du produit — elle arbitre à l'aveugle entre les commettre et les jeter. Le relevé du
 * parc, lui, mesure ce même disque : il mesure l'état d'un POSTE, pas l'état d'un produit.
 *
 * CE QUI EST FAIT ICI, et pas plus : l'état de l'artefact DANS L'HISTOIRE est relevé et COMPTÉ À
 * PART — `non_suivi` (présent, conforme, hors histoire), `non_commis` (suivi, mais l'arbre de
 * travail diverge de HEAD), `commis`. Le verdict de R-47 n'est pas retourné par ce relevé : la
 * décision de le faire basculer appartient au pilot (TF-0848 le dit en toutes lettres), et le
 * comptage à part en est le préalable. Ce qui change dès aujourd'hui, c'est que le silence cesse.
 */
function etatDansHistoire(dossierProduit, cible) {
  if (!cible || !existsSync(cible) || !existsSync(join(dossierProduit, ".git"))) return {};
  const rel = relative(dossierProduit, cible).replaceAll("\\", "/");
  const suivi = spawnSync("git", ["-C", dossierProduit, "ls-files", "--error-unmatch", "--", rel],
    { encoding: "utf8", timeout: 20000 });
  if (suivi.status !== 0) {
    return { histoire: "non_suivi", geste_git: `git add "${rel}"`,
      note_histoire: "présent, conforme, HORS HISTOIRE — ce poste l'a, le dépôt ne l'a pas : un clone neuf repartirait sans lui" };
  }
  const propre = spawnSync("git", ["-C", dossierProduit, "diff", "--quiet", "HEAD", "--", rel],
    { encoding: "utf8", timeout: 20000 });
  if (propre.status === 1) {
    return { histoire: "non_commis", geste_git: `git add "${rel}" && git commit`,
      note_histoire: "conforme sur le DISQUE, divergent de HEAD — une recopie n'est TENUE qu'une fois commise ; un `git restore` ramènerait la version d'avant" };
  }
  return { histoire: "commis" };
}

/** L'état d'UN artefact chez UN produit : absent, présent-divergent, ou conforme. */
export function etatArtefact(dossierProduit, artefact, racinePilot) {
  const sortie = {};
  const etat = etatSurDisque(dossierProduit, artefact, racinePilot, sortie);
  return { ...etat, ...etatDansHistoire(dossierProduit, sortie.cible) };
}

function etatSurDisque(dossierProduit, artefact, racinePilot, sortie = {}) {
  let cible = join(dossierProduit, String(artefact.cible).replaceAll("/", "\\"));
  // TF-0793 — LA DÉCLARATION SE LIT. Quand la cible manque à la racine du dépôt et que le produit
  // a déclaré sa racine web, l'artefact se cherche SOUS cette racine, et c'est là qu'il se juge
  // (présence, motifs ou conformité, comme à la racine). Le chemin déclaré est nommé au relevé.
  let sousRacineWeb = null;
  if (!existsSync(cible)) {
    const racineWeb = racineWebDeclaree(dossierProduit);
    if (racineWeb) {
      const sous = join(dossierProduit, racineWeb.replaceAll("/", "\\"), String(artefact.cible).replaceAll("/", "\\"));
      if (existsSync(sous)) { cible = sous; sousRacineWeb = racineWeb; }
    }
  }
  // TF-0710 (01/09) — UN ALIAS DE TRANSITION EST UNE CIBLE ACCEPTÉE, PAS UN DÉFAUT. Quand la
  // cible canonique manque mais que l'alias déclaré au contrat existe, c'est LUI la copie du
  // produit : le juger absent forcerait tout le parc à migrer le jour de la publication, et
  // c'est exactement le renommage en cascade que l'item corrige.
  if (!existsSync(cible) && artefact.alias_accepte) {
    const alias = join(dossierProduit, String(artefact.alias_accepte).replaceAll("/", "\\"));
    if (existsSync(alias)) cible = alias;
  }
  // Le chemin RÉELLEMENT jugé, une fois toutes les résolutions faites (racine web, alias) : c'est
  // lui, et pas la cible du contrat, dont l'état dans l'histoire git se relève (TF-0851).
  sortie.cible = cible;
  if (!existsSync(cible)) {
    // LE TROISIEME CAS, CELUI QUI N'AVAIT PAS DE NOM (TF-0654, 26/08/2026).
    //
    // LE FAIT, remonte par un produit et VERIFIE ici : `robots.txt` et `llms.txt` etaient comptes
    // ABSENT, gravite majeur. Ils ne l'etaient pas — ils vivent en `site/robots.txt` et
    // `site/llms.txt`, et repondent 200 en production. La racine WEB de ce produit est `site/`,
    // le repertoire reellement servi ; ce n'est pas la racine du depot.
    //
    // La sonde ne connaissait que DEUX lectures : « le produit a une surface web et le fichier
    // manque » ou « il n'a pas de surface web et l'absence est legitime ». Aucune des deux n'etait
    // vraie. CE QUE CA COUTAIT SI ON AVAIT APPLIQUE LE TRAVAIL CONFIE : deux fichiers deposes a la
    // racine du depot, JAMAIS SERVIS, et un relevé passe au vert — le pire des deux mondes, une
    // exigence qu'on croit satisfaite par des fichiers morts.
    //
    // CE QUE CET ETAT FAIT, ET CE QU'IL NE FAIT PAS : il NOMME l'endroit ou le fichier a ete
    // trouve, et il ne DEVINE PAS la racine web. Deviner reviendrait a affirmer ce que la donnee
    // ne porte pas — un `site/` peut etre servi comme il peut etre un dossier d'archives. Ce que
    // le produit doit faire est donc DECLARER sa racine web, pas recopier un fichier qu'il a deja.
    const ailleurs = trouverAilleurs(dossierProduit, artefact.cible);
    if (ailleurs) return { etat: "hors_racine", trouve_a: ailleurs };
    return { etat: "absent" };
  }
  // TF-0649 — LE RELEVE ET R-47 DOIVENT DIRE LA MEME CHOSE. Ce module rendait « present » pour
  // tout mode autre que `copie_conforme`, alors que l'oracle de conformite, lui, VERIFIE les
  // motifs exiges. Deux consommateurs du meme contrat qui rendent deux verdicts differents sur le
  // meme fichier, c'est la double verite que le parc a payee dix fois. Le mode est donc jugé ici
  // aussi — un socle se verifie, il ne se suppose pas.
  if (artefact.mode === "presence_et_motifs") {
    const lignes = new Set(readFileSync(cible, "utf8").split(/\r?\n/)
      .map((l) => l.trim()).filter((l) => l && !l.startsWith("#")));
    // TF-0882 (08/09/2026) — UN MOTIF EST TENU S'IL EST PRÉSENT **OU COUVERT PAR PLUS LARGE**.
    // Le contrôle comparait des lignes NUES, à l'exacte graphie. Mesuré le 06/09 chez un produit
    // ancien : `*.oracles*.json` et `*.oracles*.jsonl` couvraient STRICTEMENT les trois motifs de
    // sidecars exigés, comptés « 3 absents sur 6 » ; la mise en conformité a donc écrit trois
    // lignes redondantes à côté des deux qui faisaient déjà le travail. `HERITAGE.json` pose
    // pourtant le raisonnement INVERSE pour `.env` — « exiger une graphie exacte ferait crier sur
    // une protection équivalente » : le relevé contredisait la règle qu'il applique ailleurs.
    const absents = (artefact.motifs_exiges || []).filter((m) => !lignes.has(m) && !estCouvertParPlusLarge(m, lignes));
    return absents.length ? { etat: "incomplet", motifs_absents: absents } : { etat: "present" };
  }
  if (artefact.mode !== "copie_conforme") return sousRacineWeb ? { etat: "present", sous_racine_web: sousRacineWeb } : { etat: "present" };
  const source = join(racinePilot, String(artefact.source).replaceAll("/", "\\"));
  if (!existsSync(source)) return { etat: "present", note: "source introuvable au pilot — non comparable" };
  const a = empreinteFichier(source, 12);
  const b = empreinteFichier(cible, 12);
  // LES EMPREINTES NE S'APPELLENT PLUS `source` ET `produit` (TF-0645, 26/08). Le contrat
  // `HERITAGE.json` donne a `source` un sens PRECIS : le CHEMIN de l'artefact chez le pilot.
  // Ce retour l'ecrasait par une EMPREINTE, et le releve perdait le chemin en route — si bien
  // que `emettre-travaux.mjs` le REFABRIQUAIT par chirurgie de chaine sur la cible, avec deux
  // cas particuliers rustines a la main. Un champ qui porte deux sens dans deux fichiers voisins
  // ne se documente pas : il se renomme.
  if (a === b) return { etat: "conforme", empreinte: a };
  return { etat: "divergent", empreinte_pilot: a, empreinte_produit: b,
    cause: attribuerDivergence(artefact.source, readFileSync(cible, "utf8"), racinePilot) };
}

/**
 * TF-0711 (01/09) — DIRE QUI A BOUGÉ, au lieu d'un « diverge » symétrique.
 *
 * Le fait mesuré à la minute, le 30/08 : une copie posée à 08:56 était déclarée périmée à
 * 09:12 parce que le PILOT avait publié une version neuve à 09:01 — et le message accusait la
 * copie comme si le produit avait failli. Le même scénario s'est rejoué dans l'heure. Deux
 * situations opposées — « le produit n'a pas recopié » et « le pilot vient de publier » —
 * sortaient dans le même mot, et le produit ne pouvait pas savoir laquelle le concernait.
 *
 * LA MESURE REMPLACE LA DÉCLARATION : plutôt que de faire porter une version à chaque gabarit,
 * on confronte la copie du produit à l'HISTORIQUE GIT de la source chez le pilot. Si la copie
 * correspond à une version publiée — la divergence vient du pilot, qui a avancé depuis ; sinon
 * — la copie a été modifiée côté produit, ou tirée d'un état jamais publié. Borne déclarée :
 * la recherche s'arrête aux 30 dernières révisions de la source, et un pilot sans git (ou une
 * source jamais commitée) rend une attribution inconnue, dite comme telle.
 */
/**
 * TF-0849 (08/09) — LA VERSION QU'UN ARTEFACT DÉCLARE, quand il en déclare une. Un JSON porte
 * `version` et `date` ; un document versionné porte un en-tête « version X.Y.Z » ou un
 * frontmatter. `null` quand rien n'est déclaré — auquel cas la date du commit reste la seule
 * mesure disponible, et le message le dit comme telle.
 */
function versionDeclaree(contenu) {
  const t = String(contenu);
  try {
    const j = JSON.parse(t);
    if (j && (j.version || j.date)) return [j.version, j.date].filter(Boolean).join(" du ");
  } catch { /* pas un JSON : on lit l'en-tête */ }
  const enTete = t.slice(0, 2000);
  const m = /(?:^|\n)[^\n]*?\bversion\s*:?\s*(?:\*\*)?\s*(\d+\.\d+\.\d+)/i.exec(enTete)
    || /(?:^|\n)[^\n]*?\bv(\d+\.\d+\.\d+)\b/.exec(enTete);
  if (!m) return null;
  const d = /(\d{4}-\d{2}-\d{2})/.exec(enTete);
  return m[1] + (d ? ` du ${d[1]}` : "");
}

export function attribuerDivergence(sourceRel, contenuProduit, racinePilot) {
  const posix = String(sourceRel).replaceAll("\\", "/");
  const log = spawnSync("git", ["-C", racinePilot, "log", "-n", "30", "--format=%H %cs", "--", posix],
    { encoding: "utf8", timeout: 30000 });
  if (log.status !== 0) return { qui: "inconnu", detail: "historique git du pilot illisible — attribution impossible, dite plutôt que devinée" };
  const norm = (t) => String(t).split("\r\n").join("\n").trimEnd();
  const attendu = norm(contenuProduit);
  for (const ligne of (log.stdout || "").split("\n").filter((l) => l.trim())) {
    const [h, date] = ligne.trim().split(/\s+/);
    const montre = spawnSync("git", ["-C", racinePilot, "show", `${h}:${posix}`],
      { encoding: "utf8", timeout: 30000, maxBuffer: 16 * 1024 * 1024 });
    if (montre.status === 0 && norm(montre.stdout) === attendu) {
      // TF-0849 (08/09/2026) — LE MESSAGE DISAIT « VERSION PUBLIÉE LE X » LÀ OÙ IL MESURE
      // « ÉTAT PORTÉ PAR LE COMMIT DU X ». Le mécanisme n'était pas faux, la PHRASE l'était : la
      // date rendue est celle du COMMIT qui portait ce contenu, pas la version que l'artefact
      // DÉCLARE — et elle est systématiquement la plus RÉCENTE des deux, exactement le sens qui
      // pousse à croire sa copie fraîche. Mesure du 06/09 chez un produit : l'oracle écrivait
      // « votre copie correspond à la version publiée le 2026-09-05 » pour un fichier qui portait
      // `version 1.0.0, date 2026-09-03, 32 classes`, quand la source du pilot portait
      // `1.2.0, 2026-09-05, 37 classes` ; le lot de travaux lu dans la même minute écrivait, lui,
      // « correspond à la version du 03/09 ». Deux dates pour le même fichier, à deux jours
      // d'écart, dans les deux documents que le produit lit côte à côte — et l'écart n'était
      // visible qu'en ouvrant le JSON, geste qu'aucune consigne ne demande.
      // Deux corrections indépendantes : NOMMER ce qui est mesuré, et CITER les deux versions
      // déclarées quand l'artefact en porte une. Le message machine dit désormais ce que la prose
      // humaine du lot disait déjà — au lieu de la contredire.
      const vProduit = versionDeclaree(contenuProduit);
      const source = spawnSync("git", ["-C", racinePilot, "show", `HEAD:${posix}`],
        { encoding: "utf8", timeout: 30000, maxBuffer: 16 * 1024 * 1024 });
      const vPilot = source.status === 0 ? versionDeclaree(source.stdout) : null;
      const versions = vProduit || vPilot
        ? ` · versions DÉCLARÉES — votre copie : ${vProduit || "aucune"} · pilot : ${vPilot || "aucune"}`
        : "";
      return { qui: "pilot", detail: `votre copie correspond à l'état publié PAR LE COMMIT du ${date} ` +
        `(date du commit, pas la version que le fichier déclare)${versions} — ` +
        "le PILOT a avancé depuis : recopier suffit (aucune faute côté produit)" };
    }
  }
  return { qui: "produit", detail: "votre copie ne correspond à AUCUNE des 30 dernières versions publiées — " +
    "elle a été modifiée côté produit, ou tirée d'un état jamais publié : ne pas écraser sans lire la différence" };
}

export function relever(base, contrat, racinePilot) {
  return produitsDuParc(base).map((dossier) => {
    const artefacts = contrat.artefacts.map((a) => ({
      // `source` est PORTE jusqu'ici, tel que le contrat l'ecrit : c'est le chemin que le
      // consommateur doit citer, et le deduire de la cible est faux des que les deux ne se
      // repondent pas (TF-0645).
      cible: a.cible, source: a.source, mode: a.mode, ...etatArtefact(dossier, a, racinePilot),
    }));
    const compte = (e) => artefacts.filter((x) => x.etat === e).length;
    return {
      produit: relative(base, dossier).replaceAll("\\", "/"),
      dossier,
      absents: compte("absent"),
      divergents: compte("divergent"),
      // `hors_racine` compte A PART, et surtout PAS parmi les conformes (TF-0654) : un fichier
      // trouvé ailleurs n'est pas un fichier tenu — il est peut-être servi, peut-être pas, et
      // c'est précisément ce que le produit doit DÉCLARER. Le noyer dans les conformes rendrait
      // le relevé vert sur une question ouverte ; le compter absent ferait recopier un fichier
      // qui existe déjà, au mauvais endroit. Il lui faut sa propre colonne.
      hors_racine: compte("hors_racine"),
      // `incomplet` (TF-0649) : le fichier existe mais ne porte pas les motifs du socle. Il compte
      // comme un manque, pas comme un conforme — un `.gitignore` present et vide protege autant
      // qu'un `.gitignore` absent.
      incomplets: compte("incomplet"),
      // TF-0851 / TF-0848 : l'état dans l'HISTOIRE se compte À PART, comme `hors_racine`. Ni un
      // manque (le produit a fait le geste), ni un artefact tenu (le dépôt ne le porte pas). Le
      // relevé du parc mesurait l'état d'un POSTE en croyant mesurer l'état d'un produit.
      hors_histoire: artefacts.filter((x) => x.histoire === "non_suivi").length,
      non_commis: artefacts.filter((x) => x.histoire === "non_commis").length,
      conformes: compte("conforme") + compte("present"),
      total: artefacts.length,
      artefacts,
    };
  }).sort((x, y) => (y.absents + y.divergents + y.hors_racine) - (x.absents + x.divergents + x.hors_racine));
}

// ---- exécution ------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const contrat = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
  const lignes = relever(racine, contrat, PILOT);
  const totalManques = lignes.reduce((n, l) => n + l.absents + l.divergents + l.hors_racine + l.incomplets, 0);

  if (args.includes("--json")) {
    console.log(JSON.stringify({ outil: "relever-heritage", racine: String(racine),
      contrat: contrat.version, produits: lignes.length, manques: totalManques, lignes }, null, 1));
  } else {
    for (const l of lignes) {
      const drapeau = l.absents + l.divergents + l.hors_racine + l.incomplets === 0 ? "CONFORME" : `${l.absents} absent(s)`
        + (l.divergents ? `, ${l.divergents} DIVERGENT(s)` : "")
        + (l.hors_racine ? `, ${l.hors_racine} HORS RACINE` : "")
        + (l.incomplets ? `, ${l.incomplets} INCOMPLET(s)` : "");
      // TF-0851 : l'état dans l'HISTOIRE se dit à côté du verdict de contenu, jamais à sa place.
      const histoire = (l.hors_histoire ? ` · ${l.hors_histoire} HORS HISTOIRE (présents, non suivis par git)` : "")
        + (l.non_commis ? ` · ${l.non_commis} NON COMMIS (conformes sur le disque, divergents de HEAD)` : "");
      console.log(`${l.produit.padEnd(50)} ${drapeau}${histoire}`);
    }
    console.log(`\n${lignes.length} produit(s) relevé(s), ${totalManques} manque(s) au total — contrat v${contrat.version}`);
    console.log(`NON RELEVÉ : tout produit rangé au-delà de ${PROFONDEUR_MAX} niveaux sous ${racine}, ` +
      "et tout produit absent de ce poste. Aucune écriture n'a été faite chez aucun produit.");
  }

  const iMd = args.indexOf("--md");
  if (iMd >= 0 && args[iMd + 1]) {
    writeFileSync(args[iMd + 1], rendreMarkdown(lignes, contrat, racine, totalManques), "utf8");
    console.log(`\nrelevé écrit : ${args[iMd + 1]}`);
  }
}

export function rendreMarkdown(lignes, contrat, base, totalManques) {
  const t = [];
  t.push("| Produit | Absents | Divergents | Hors racine | Conformes | Ce qui manque |");
  t.push("|---|---|---|---|---|---|");
  for (const l of lignes) {
    const manque = l.artefacts.filter((a) => a.etat === "absent").map((a) => a.cible);
    const diverge = l.artefacts.filter((a) => a.etat === "divergent").map((a) => `${a.cible} (PÉRIMÉ)`);
    const ailleurs = l.artefacts.filter((a) => a.etat === "hors_racine")
      .map((a) => `${a.cible} → trouvé à \`${a.trouve_a}\` : racine web à DÉCLARER`);
    t.push(`| \`${l.produit}\` | ${l.absents} | ${l.divergents} | ${l.hors_racine} | ${l.conformes}/${l.total} | `
      + `${[...diverge, ...manque, ...ailleurs].join(" · ") || "—"} |`);
  }
  return t.join("\n") + `\n\n${lignes.length} produits relevés · ${totalManques} manques · contrat v${contrat.version}`
    + `\n\nNON RELEVÉ : tout produit rangé au-delà de ${PROFONDEUR_MAX} niveaux sous \`${base}\`, et tout`
    + " produit absent de ce poste. Aucune écriture n'a été faite chez aucun produit.\n";
}
