#!/usr/bin/env node
/**
 * generer-acces-local.mjs — LA FICHE D'ACCÈS LOCALE D'UN PRODUIT : LES VALEURS QUE LA FICHE VERSIONNÉE NE PORTE JAMAIS
 * (TF-2605, décision R-58 du 16/11/2026). Copié chez chaque produit sous `forge\generer-acces-local.mjs`
 * (gabarits\HERITAGE.json, copie conforme) ; se joue au déploiement, depuis la racine du produit :
 *
 *   node forge/generer-acces-local.mjs [--produit <dossier>] [--env <fichier>]... [--sortie docs/projet/ACCES-TEST.local.md]
 *
 * LE FAIT. Le 12/11/2026, le porteur refuse la fiche `ACCES-TEST.md` réécrite : sans identifiants ni mots de passe dans
 * le fichier, il ne peut pas se connecter. R-23 interdit toute valeur dans la fiche VERSIONNÉE, et il a ses raisons : le
 * 06/09, un identifiant de démonstration écrit dans la fiche d'un dépôt public s'est retrouvé affiché sur une page de
 * connexion servie sur Internet. Aucune règle ne prévoyait le fichier LOCAL, ignoré par git, qui porte les valeurs.
 *
 * CE QUE FAIT LE GESTE. Il lit `docs/projet/ACCES-TEST.md` (qui nomme des VARIABLES), les valeurs dans les fichiers
 * d'environnement du produit (`.env` puis `.env.local`, ou ceux de `--env`), et écrit `docs/projet/ACCES-TEST.local.md` :
 * la même fiche, où chaque variable des colonnes identifiant, mot de passe, secret, clé, jeton et mécanisme est remplacée par
 * sa valeur, plus une colonne « Essai de connexion » par ligne qui porte une adresse. Il s'arrête AVANT d'écrire au
 * premier refus : le produit n'est pas un dépôt git, la fiche locale n'est pas IGNORÉE (`git check-ignore`), elle est SUIVIE
 * (`git ls-files`), la fiche versionnée est absente, ou la cible est le pilot. Une valeur d'un fichier d'environnement ne
 * sort jamais sur la sortie standard : le verdict ne cite que des NOMS de variables.
 *
 * Sortie : une ligne JSON { outil, verdict, fichier, variables_resolues, variables_absentes, lignes_avec_essai } ; exit 0 =
 * écrit, 1 = refus (message sans valeur), 2 = usage.
 *
 * CE QUE LE GESTE NE COUVRE PAS (dit, non tu) :
 *   · la « connexion d'essai » est une CONSIGNE ÉCRITE par ligne (ouvrir l'adresse, saisir l'identifiant et le mot de passe
 *     de la ligne), pas une connexion jouée : le protocole de connexion est celui de chaque produit, et ce geste ne l'invente pas ;
 *   · la fraîcheur : la fiche locale est régénérée au déploiement (ETAPE-MEP.md), rien ne la régénère d'elle-même, et rien ne
 *     compare ses valeurs à celles d'un environnement réel ;
 *   · une valeur absente des fichiers d'environnement du poste s'écrit « (non renseignée : NOM) » et se liste au verdict : elle
 *     n'est pas un échec, la fiche dit ce qui manque ;
 *   · le fichier garde des valeurs EN CLAIR sur le poste du porteur : il ne se copie ni ne se transmet, et le contrôle R-23
 *     d'`oracle-conformite-projet` refuse qu'il soit suivi par git ou non ignoré.
 * Recette : scripts\generer-acces-local.test.mjs. Aucun hachage.
 */
import { existsSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve, relative } from "node:path";

const args = process.argv.slice(2);
const sortie = (o, code) => { console.log(JSON.stringify({ outil: "generer-acces-local", ...o })); process.exit(code); };
const refus = (message) => sortie({ verdict: "REFUS", message }, 1);
const valeursOption = (nom) => args.flatMap((a, i) => (a === nom && i + 1 < args.length ? [args[i + 1]] : []));
const USAGE = "node forge/generer-acces-local.mjs [--produit <dossier>] [--env <fichier>]... [--sortie docs/projet/ACCES-TEST.local.md]";
const CONNUES = ["--produit", "--env", "--sortie", "--aide", "--help"];
if (args.includes("--aide") || args.includes("--help")) sortie({ usage: USAGE }, 2);
const inconnue = args.find((a, i) => (a.startsWith("--") && !CONNUES.includes(a)) || (!a.startsWith("--") && !["--produit", "--env", "--sortie"].includes(args[i - 1])));
if (inconnue) sortie({ verdict: "ERREUR", message: `argument inconnu « ${inconnue.slice(0, 40)} » — ${USAGE}` }, 2);

// ---- le produit : --produit, sinon le premier dossier portant `forge/` en remontant depuis le dossier de travail
function produitDe(depart) {
  for (let d = resolve(depart); ; d = dirname(d)) {
    if (existsSync(join(d, "forge")) && !existsSync(join(d, "gabarits", "HERITAGE.json"))) return d;
    if (dirname(d) === d) return null;
  }
}
const demande = valeursOption("--produit")[0];
const produit = demande ? resolve(demande) : produitDe(process.cwd());
if (produit && existsSync(join(produit, "gabarits", "HERITAGE.json")))
  refus("la cible est le pilot lui-même : ce geste écrit la fiche locale d'un PRODUIT, le pilot n'en porte pas (.env jamais transmis)");
if (!produit || !existsSync(produit)) refus("aucun produit trouvé (pas de dossier forge/ en remontant depuis le dossier de travail) : désigner le produit avec --produit <dossier>");

const git = (...a) => spawnSync("git", ["-C", produit, ...a], { encoding: "utf8" });
const fiche = join(produit, "docs", "projet", "ACCES-TEST.md");
if (!existsSync(fiche)) refus("docs/projet/ACCES-TEST.md est absent : la fiche versionnée nomme les variables que la fiche locale résout");
const relSortie = (valeursOption("--sortie")[0] || "docs/projet/ACCES-TEST.local.md").replaceAll("\\", "/");
const cibleLocale = resolve(produit, relSortie);
if (relative(produit, cibleLocale).startsWith("..")) refus("la fiche locale doit vivre DANS le produit : le chemin demandé en sort");
const relCible = relative(produit, cibleLocale).replaceAll("\\", "/");

// ---- les refus, AVANT d'écrire quoi que ce soit
if (git("rev-parse", "--is-inside-work-tree").status !== 0)
  refus("le produit n'est pas un dépôt git : impossible de prouver que la fiche locale sera ignorée, rien n'est écrit");
if (git("ls-files", "--error-unmatch", "--", relCible).status === 0)
  refus(`${relCible} est SUIVI par git : une fiche qui porte des valeurs ne se versionne jamais. Remède : \`git rm --cached "${relCible}"\`, puis ré-essayer`);
if (git("check-ignore", "-q", "--", relCible).status !== 0)
  refus(`${relCible} n'est PAS ignoré par git : un \`git add .\` l'embarquerait avec ses valeurs. Remède : ajouter \`${relCible}\` au .gitignore (motif du socle, gabarits/gitignore-produit), puis ré-essayer`);

// ---- les valeurs : .env puis .env.local (le second l'emporte), ou les fichiers de --env
const demandesEnv = valeursOption("--env");
const fichiersEnv = (demandesEnv.length ? demandesEnv : [".env", ".env.local"]).map((f) => resolve(produit, f));
const valeurs = new Map();
let fichiersLus = 0;
for (const f of fichiersEnv) {
  if (!existsSync(f)) continue;
  fichiersLus++;
  for (const ligne of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(ligne);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"') && v.length >= 2) || (v.startsWith("'") && v.endsWith("'") && v.length >= 2)) v = v.slice(1, -1);
    valeurs.set(m[1], v);
  }
}

// ---- la fiche locale : la fiche versionnée, les variables des colonnes d'accès remplacées par leur valeur
const COLONNE_D_ACCES = /identifiant|mot de passe|motdepasse|secret|cl[ée]|jeton|token|m[ée]canisme/i;
const NOM_DE_VARIABLE = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/;
const cellules = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
const resolues = new Set(), absentes = new Set();
let lignesAvecEssai = 0;
const remplacer = (cellule) => cellule.replace(/`([^`]+)`/g, (tout, nom) => {
  const nu = nom.replace(/[{}<>]/g, "").trim();
  if (!NOM_DE_VARIABLE.test(nu)) return tout;
  if (valeurs.has(nu) && valeurs.get(nu) !== "") { resolues.add(nu); return `\`${valeurs.get(nu)}\``; }
  absentes.add(nu);
  return `(non renseignée : ${nu})`;
});
const sansFrontmatter = readFileSync(fiche, "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
const sortieLignes = [];
let entete = null; // les en-têtes du tableau en cours, ou null hors tableau
let avecAdresse = false;
for (const ligne of sansFrontmatter.split(/\r?\n/)) {
  if (!ligne.trim().startsWith("|")) { entete = null; avecAdresse = false; sortieLignes.push(ligne); continue; }
  const c = cellules(ligne);
  if (entete === null) {                                           // première ligne du tableau : l'en-tête
    entete = c; avecAdresse = c.some((x) => /adresse/i.test(x));
    sortieLignes.push(avecAdresse ? `${ligne.trimEnd()} Essai de connexion |` : ligne);
    continue;
  }
  if (c.every((x) => /^:?-+:?$/.test(x))) { sortieLignes.push(avecAdresse ? `${ligne.trimEnd()}---|` : ligne); continue; }
  const neuves = c.map((x, i) => (entete[i] && COLONNE_D_ACCES.test(entete[i]) ? remplacer(x) : x));
  if (avecAdresse) {
    const iAdresse = entete.findIndex((x) => /adresse/i.test(x));
    const adresse = (neuves[iAdresse] || "").replace(/`/g, "").trim();
    neuves.push(adresse && !/^[{<(]/.test(adresse) ? `ouvrir ${adresse}, saisir l'identifiant puis le mot de passe de cette ligne` : "adresse non renseignée : rien à essayer");
    if (adresse && !/^[{<(]/.test(adresse)) lignesAvecEssai++;
  }
  sortieLignes.push(`| ${neuves.join(" | ")} |`);
}
const banniere = [
  "> **FICHE LOCALE — elle porte des VALEURS : ignorée par git, jamais commitée, jamais copiée, jamais transmise** (TF-2605).",
  `> Générée le ${new Date().toISOString().slice(0, 10)} par \`generer-acces-local.mjs\` depuis \`docs/projet/ACCES-TEST.md\` (les variables) et ${fichiersLus} fichier(s) d'environnement du poste (les valeurs).`,
  "> À régénérer à chaque déploiement : `node forge/generer-acces-local.mjs`. La fiche versionnée reste sans valeur (R-23).",
  "",
];
const cibleTmp = `${cibleLocale}.tmp`;
writeFileSync(cibleTmp, banniere.concat(sortieLignes).join("\n"), "utf8");
renameSync(cibleTmp, cibleLocale);
sortie({ verdict: "OK", fichier: relCible, variables_resolues: resolues.size, variables_absentes: [...absentes].sort(), lignes_avec_essai: lignesAvecEssai, fichiers_d_environnement_lus: fichiersLus }, 0);
