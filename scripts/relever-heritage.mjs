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

/** L'état d'UN artefact chez UN produit : absent, présent-divergent, ou conforme. */
export function etatArtefact(dossierProduit, artefact, racinePilot) {
  let cible = join(dossierProduit, String(artefact.cible).replaceAll("/", "\\"));
  // TF-0710 (01/09) — UN ALIAS DE TRANSITION EST UNE CIBLE ACCEPTÉE, PAS UN DÉFAUT. Quand la
  // cible canonique manque mais que l'alias déclaré au contrat existe, c'est LUI la copie du
  // produit : le juger absent forcerait tout le parc à migrer le jour de la publication, et
  // c'est exactement le renommage en cascade que l'item corrige.
  if (!existsSync(cible) && artefact.alias_accepte) {
    const alias = join(dossierProduit, String(artefact.alias_accepte).replaceAll("/", "\\"));
    if (existsSync(alias)) cible = alias;
  }
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
    const absents = (artefact.motifs_exiges || []).filter((m) => !lignes.has(m));
    return absents.length ? { etat: "incomplet", motifs_absents: absents } : { etat: "present" };
  }
  if (artefact.mode !== "copie_conforme") return { etat: "present" };
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
      return { qui: "pilot", detail: `votre copie correspond à la version publiée le ${date} — ` +
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
      console.log(`${l.produit.padEnd(50)} ${drapeau}`);
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
