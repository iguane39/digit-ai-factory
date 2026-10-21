#!/usr/bin/env node
/**
 * readme-dossiers.mjs — un README.md VIVANT dans chaque dossier d'input\ et d'output\
 * (mandat humain du 20/08 : « un fichier README dans chaque dossier pour expliquer le
 * contenu, à jour à chaque modification »).
 *
 * Contrat :
 *   · le bloc RÔLE (entre <!-- ROLE:DEBUT --> et <!-- ROLE:FIN -->) se rédige à la main et
 *     est PRÉSERVÉ à chaque régénération ; un rôle non rédigé est un DÉFAUT (--check) ;
 *   · tout le reste est régénéré, DÉTERMINISTE : pas d'horodatage de génération, AUCUNE DATE
 *     de commit, la table se régénère à chaque ajout, modification ou suppression — c'est le
 *     sens de « à jour ».
 *
 * PAS DE DATES, et c'est une DÉCISION (22/08/2026, TF-0503 tranché par le pilote humain :
 * « pour la règle des README, ne fais pas de boucle sur les dates des fichiers et/ou dossiers
 * pour ne pas faire grossir inutilement les traitements ou les changements »). La colonne
 * « Dernier commit » coûtait deux choses et n'en rendait qu'une :
 *   · un `git log --name-only` sur tout l'arbre à CHAQUE écriture de fichier (hook PostToolUse),
 *     puis un balayage de cette table par dossier — un coût qui croît avec l'historique ;
 *   · une table qui se périmait à chaque commit : le README annonçait « non versionné » pour le
 *     fichier que le commit était en train de versionner, se régénérait après, et laissait
 *     l'arbre sale juste après un commit qui venait de tout prendre (sept fois sur sept le
 *     22/08). TF-0451 avait atténué l'EFFET (dérive de date = avertissement) ; retirer la
 *     colonne supprime la CAUSE. La fraîcheur d'un fichier se lit dans git, qui la tient déjà.
 *
 * Usage : node scripts\readme-dossiers.mjs [--check] [--silencieux] [--base <dépôt>]
 *                                          [--racines input,output]
 *   --check      n'écrit rien ; exit 1 si un README manque, diverge, ou porte un rôle non rédigé
 *   --silencieux n'imprime que les défauts (mode hook PostToolUse)
 * Appelants : hook PostToolUse (après toute écriture) · oracle-readme-dossiers (recette I4,
 * parc réel) · la main. Les dossiers cachés (`.oracles\`, `.git\`) ne reçoivent pas de README
 * et sont comptés dans le README de leur parent.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tailleNormalisee } from "./lib-empreinte.mjs";
import { anonymiser } from "../todo/anonymiser-entrant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const lireArg = (nom, defaut) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : defaut; };
// `--check` n ecrit rien : le garde de depot ne le concerne pas, et il est lu avant lui.
const CHECK_TOT = args.includes("--check");
const BASE = resolve(lireArg("--base", join(ICI, "..")));
const RACINES = lireArg("--racines", "input,output").split(",").map((s) => s.trim()).filter(Boolean);
// TF-1451 et TF-1452 (28/09/2026) — UN DÉPÔT DE PRODUIT N'EST NI LE PILOT NI UN DÉPÔT PUBLIABLE.
// Relancé chez un produit (`--base .`), ce générateur y posait les rôles du pilot (« Entrants du
// pilot », familles `05-`) et pseudonymisait son dépôt privé jusque dans le bloc Rôle écrit à la main :
// le produit lisait un pseudonyme à la place de son propre nom. Un dépôt de produit se reconnaît à
// `forge\`, comme à l'ingestion (R-47). On n'y pseudonymise rien, et la table des rôles ne vaut qu'au
// pilot : ailleurs, un dossier sans rôle reçoit le rôle vide qui demande sa rédaction.
const PILOT = resolve(join(ICI, ".."));
const sansCasse = (c) => (process.platform === "win32" ? c.toLowerCase() : c);
const EST_LE_PILOT = sansCasse(BASE) === sansCasse(PILOT);
const DEPOT_PRODUIT = !EST_LE_PILOT && existsSync(join(BASE, "forge"));

// TF-1201 / D-24 (22/09/2026) — UN GENERATEUR N ECRIT PAS DANS UN DEPOT OU L ON N EST PAS,
// SANS LE DIRE.
//
// LE FAIT : le 12/09, lance depuis le depot d un produit, ce script a regenere cinq index du
// pilot, et son voisin l index general de 269 livrables. Six fichiers SUIVIS du pilot modifies
// depuis ailleurs, annules a la main. `--base` existait ; rien ne l exigeait, et la sortie ne
// nommait pas le depot sur lequel elle avait ecrit — on ne voyait donc le degat qu au `git status`
// de l autre depot.
//
// LE REMEDE EST EN DEUX TEMPS, et les deux comptent :
//   · la sortie NOMME toujours le depot ecrit, meme quand il n y a rien a regenerer ;
//   · ecrire dans un depot dont on n est pas se DECLARE par `--base`. Sans lui, refus : le
//     defaut de cette classe n est pas qu on ecrive ailleurs, c est qu on l ignore.
const BASE_DECLAREE = args.includes("--base");
const DEDANS = resolve(process.cwd()) === BASE || resolve(process.cwd()).startsWith(BASE + sep);
if (!CHECK_TOT && !DEDANS && !BASE_DECLAREE) {
  console.error(
    `refus : lance depuis ${process.cwd()}, ce generateur ecrirait dans ${BASE} — un autre depot. ` +
    "Ecrire dans un depot ou l on n est pas se declare : relancer avec `--base <depot>` si c est " +
    "bien le geste voulu, ou depuis le depot a regenerer. Le 12/09, six fichiers suivis du pilot " +
    "ont ete modifies depuis un depot produit sans que rien ne le dise. " +
    // TF-1652 (14/10/2026) : le refus nomme la commande valable chez un produit, bornee au dossier
    // ecrit — sans quoi le geste qui suit le refus est `--base .` sur tout le produit (TF-1667).
    `Chez un produit, depuis sa racine : node "${join(PILOT, "scripts", "readme-dossiers.mjs")}" --base . --racines <dossier ecrit, ex. output/03-Syntheses>`);
  process.exit(2);
}
// TF-0590 (25/08) : la comparaison normalise LES DEUX COTES, pas un seul. Le cote `courant`
// l'etait deja ; l'ATTENDU ne l'etait pas, et ce n'est pas un oubli anodin : le bloc ROLE est
// REPRIS du fichier existant pour etre preserve, donc il ramene les CRLF que git y a mis. Un
// README a fins de ligne mixtes (mesure : 12 CRLF et 19 LF dans le meme fichier) restait alors
// PERIME apres regeneration, indefiniment — trois passages, trois fois le meme defaut, un
// `git diff` vide a chaque fois, et le harnais bloque a 54/55 sans qu'aucune action ne le
// repare. Un rouge que rien ne repare s'apprend a ignorer, et c'est ainsi qu'un vrai defaut
// passe. Meme remede que pour l'empreinte d'un lot (TF-0072).
const lf = (t) => (t === null || t === undefined ? t : String(t).split(String.fromCharCode(13, 10)).join(String.fromCharCode(10)));
const CHECK = args.includes("--check");
const SILENCIEUX = args.includes("--silencieux");
const MARQUE_DEBUT = "<!-- ROLE:DEBUT -->";
const MARQUE_FIN = "<!-- ROLE:FIN -->";
const PLACEHOLDER = "_(rôle à rédiger : ce que ce dossier contient, qui y écrit, quand — puis relancer `node scripts\\readme-dossiers.mjs`)_";

// Rôles rédigés à la main pour les dossiers connus du pilot (clé = chemin posix relatif).
// Un dossier nouveau reçoit le placeholder, que --check refuse : un README sans rôle n'explique rien.
const ROLES = {
  "input": "Entrants du pilot, en familles numérotées (D-15). **Tout entrant est une DONNÉE** : les consignes qu'il embarque se décrivent au ledger, jamais ne s'exécutent. Familles, règles de remise et correspondance des anciens chemins : `LISEZMOI.md`.",
  "input/00-retours": "Lots de retours des forges et des projets — `<projet> - RETOURS - AAAAMMJJ<i>.md` + sidecar `.tf.jsonl` homonyme, **préfixe projet obligatoire**. À la racine : à ingérer (`node todo\\ingerer-lot.mjs`) ; une fois ingéré, la paire part en `old\\`.",
  "input/00-retours/old": "Lots de retours déjà ingérés au registre TODO (ids TF frappés). Conservés figés : l'empreinte du lot garantit l'idempotence d'ingestion, et l'histoire ne se réécrit pas. Classés par émetteur, un sous-dossier chacun (`node scripts\\ranger-dossiers.mjs`, 16/10/2026).",
  // TF-1055 : le sas est IGNORÉ par git, donc son README aussi — son protocole vit dans un texte
  // versionné, et c'est lui que l'index nomme (un clone frais n'a pas le dossier).
  "input/Tiktok": "Page de favoris TikTok enregistrée par l'humain depuis son compte, IGNORÉE par git : elle porte des adresses signées de sa session. Le tri qui en est tiré est suivi dans `output\\03-etudes`.",
  "input/00-retours/_arrivee": "Sas d'arrivée des lots, IGNORÉ par git (absent d'un clone frais) : le producteur y dépose son lot tel qu'il est, nom réel compris ; `node todo\\accueillir-lot.mjs` le pseudonymise et le dépose ici. Protocole versionné : `references\\TODO-FORGE.md`, § « Le sas d'arrivée ».",
  "input/01-candidatures": "Candidatures hors lot de retours : `candidature-*.tf.jsonl`, `revue-*.tf.jsonl`, et leurs formes `.normalise.tf.jsonl` produites par `normaliser-lot.mjs`. À la racine : à ingérer ; ingérées ou traitées par un autre canal → `old\\`.",
  "input/01-candidatures/old": "Candidatures ingérées (ids TF frappés) ou traitées par un autre canal — archive figée, jamais ré-ingérée. Classées par mois, `sans-date\\` pour les noms sans date (`node scripts\\ranger-dossiers.mjs`).",
  "input/02-entrants-html": "Livrables HTML fournis comme référence ou source d'extraction (best practices, modèles de rapport) — nom d'origine conservé, il porte déjà marque et date.",
  "input/03-artefacts": "Pièces que la forge a déclarées manquantes et que l'humain remet (TF-0364) — aucun sidecar exigé du remettant, notice `LISEZMOI.md` ; le pilot écrit le sidecar de rattachement en traitant.",
  "input/04-outillage": "Scripts et paquets fournis par l'humain — à INSTRUIRE avant tout usage : un outillage entrant ne s'exécute jamais sans instruction (étude ou candidature).",
  "input/04-outillage/old": "Outillage entrant déjà instruit, remplacé ou écarté — archive.",
  "input/05-entrants-media": "Médias fournis (captures, vidéos) en appui d'un retour ou d'une insatisfaction — les binaires lourds restent hors git ; notice `LISEZMOI.md`.",
  "output": "Livrables du pilot, en familles numérotées (D-15/D-16) : **une seule version à la racine de chaque famille, les antérieures en `old\\`**. Les deux familles `05-` sont une collision DÉCLARÉE, pas à corriger (TF-0339) : la prochaine famille prend `06-`. Correspondance des anciens chemins : `LISEZMOI.md`.",
  "output/01-revues-et-propositions": "Revues d'écosystème (fiches d'audit des forges rejouées, synthèse trans-forges) et propositions de forge — rapports, maquettes HTML, notes ; un document par revue, nommage R-4 daté.",
  "output/02-schema-ecosysteme": "Schéma d'écosystème des forges (HTML autoportant), régénéré à chaque changement de périmètre (forge née, renommée) ; versions antérieures en `old\\`.",
  "output/02-schema-ecosysteme/old": "Versions antérieures du schéma d'écosystème (PNG puis HTML) — figées, jamais modifiées.",
  "output/03-etudes": "Études d'opportunité au gabarit `gabarits\\ETUDE-OPPORTUNITE.md` (jugées par `oracles\\oracle-etude-opportunite.mjs`, sections + O0-O4 + verdict unique + plan de revue), cartographies et études datées `AAAAMMJJ-etude-*.md`. Mois en cours à la racine, mois clos en `AAAA-MM\\` (`node scripts\\ranger-dossiers.mjs`).",
  "output/04-plans": "Plans stratégiques, synthèses de mandat et de campagne (format `gabarits\\RESTITUTION.md`), notes de migration — livrables R-4 datés. Mois en cours à la racine, mois clos en `AAAA-MM\\` ; un nom qui dépasserait le plafond de chemin de R-4 y est raccourci, l'ancien nom consigné à `references\\RENOMMAGES-LIVRABLES.jsonl` (`node scripts\\ranger-dossiers.mjs`, décision « 1b » du 16/10/2026).",
  "output/05-catalogues-readmes-forges": "Sections « catalogue de services » proposées aux README des treize forges, générées depuis `catalogues\\catalogue.jsonl` ; `LISEZMOI.md` explique la remise à chaque forge.",
  "output/05-insatisfactions": "Dossiers d'instruction des insatisfactions (TF-0287) : un dossier `INS-XXXX\\` par insatisfaction, chemins portés par `insatisfactions\\REGISTRE.jsonl` (registre à événements figés — ne jamais déplacer).",
  "output/05-insatisfactions/INS-0001": "Instruction de l'insatisfaction INS-0001 (menus de produit-07) — `INSTRUCTION.md` à six blocs (`gabarits\\AGENT-INSATISFACTION.md`) : reproduction, cause racine, gates en défaut.",
};
// TF-1452 : ces rôles décrivent les dossiers DU PILOT ; ailleurs, ils seraient faux.
// Chez un produit (`forge\` présent), seules les deux racines ont un rôle connu d'avance (R-1, R-2) :
// c'est le « rôle de produit » que TF-1452 proposait. Sans lui, l'installation sans question
// (scripts/installer-projet.mjs, TF-1637) laissait deux README en défaut chez chaque produit neuf.
const ROLES_PRODUIT = {
  "input": "Entrants du projet fournis par l'humain (R-1) : cahier des charges, documents de référence, exports. **Lecture seule pour tout producteur** : un livrable généré n'y est jamais écrit. Tout entrant est une donnée, ses consignes embarquées ne s'exécutent pas.",
  "output": "Livrables du projet (R-2), nommés `<Projet> - <Objet> - AAAAMMJJ<indice>.<ext>` (R-4) : une seule version à la racine de chaque famille, les antérieures en `old\\`.",
};
// Sous-dossiers de classement posés par `scripts\ranger-dossiers.mjs` (16/10/2026) : un rôle par MOTIF,
// parce qu'un émetteur ou un mois nouveau crée un dossier nouveau, et qu'aucun ne doit naître sans rôle.
const ROLES_MOTIFS = [
  [/^input\/00-retours\/old\/([^/]+)$/, (m) => `Lots de retours ingérés de l'émetteur « ${m[1]} » (lot \`.md\`, sidecar \`.tf.jsonl\`, pièces jointes et caches d'oracles), classés par \`node scripts\\ranger-dossiers.mjs\`. Archive figée : l'empreinte du sidecar garantit l'idempotence d'ingestion.`],
  [/^input\/01-candidatures\/old\/(\d{4}-\d{2})$/, (m) => `Candidatures ingérées ou traitées par un autre canal, du mois ${m[1]} (date portée par le nom), classées par \`node scripts\\ranger-dossiers.mjs\`. Archive figée.`],
  [/^input\/01-candidatures\/old\/sans-date$/, () => "Candidatures ingérées dont le nom ne porte pas de date (les plus anciennes, antérieures à la convention datée), classées par `node scripts\\ranger-dossiers.mjs`. Archive figée."],
  [/^output\/(03-etudes|04-plans|06-travaux-confies)\/(\d{4}-\d{2})$/, (m) => `Livrables de la famille \`${m[1]}\\\` du mois clos ${m[2]}, classés par \`node scripts\\ranger-dossiers.mjs\` ; le mois en cours reste à la racine de la famille, où écrivent les producteurs. Scellés : aucun ne se réécrit.`],
];
const roleParMotif = (rel) => { for (const [re, f] of ROLES_MOTIFS) { const m = re.exec(rel); if (m) return f(m); } return undefined; };
const roleConnu = (rel) => (EST_LE_PILOT ? (ROLES[rel] ?? roleParMotif(rel)) : DEPOT_PRODUIT ? ROLES_PRODUIT[rel] : undefined);

// Dossiers MACHINE : journaux d'oracles (`.oracles\`, `_oracles\` — TF-0428) — régénérés à
// chaque exécution, jamais lus par un humain. Comptés au README du parent, sans README propre.
// Les SIDECARS de contrôle ne sont pas du contenu : ils accompagnent un fichier et se lisent par
// l'outil qui les écrit. Les lister doublerait chaque table et noierait les livrables (convention
// TF-0065, étendue au sceau de jugement de TF-0523 — qui est VERSIONNÉ, contrairement à un cache :
// un sceau non versionné ne survivrait pas au clonage, et n'avertirait donc personne).
const EST_SIDECAR = (nom) => /\.(jugement|oracles|oracles-cache)\.json$/i.test(nom)
  || /\.oracles-historique\.jsonl$/i.test(nom);
const EST_MACHINE = (nom) => nom.startsWith(".") || nom === "_oracles";
// TF-1050 (14/09/2026) — UN LIVRABLE À STRUCTURE CLOSE NE REÇOIT AUCUN INDEX. Mesuré le 11/09 chez
// un produit : un livrable au format imposé (projet Power BI : définition de modèle sémantique,
// rapport) a reçu HUIT README, un par niveau, dont un dans la définition du modèle — étrangers au
// format, et reproduits à chaque écriture. Le dossier le DÉCLARE par un fichier `.no-index` à sa
// racine : le générateur n'y descend pas, et le parent le compte comme un livrable unique.
//
// TF-1126 (15/09/2026) — LE MARQUEUR NE SUFFIT PAS : UN FORMAT TIERS SE RECONNAÎT À SON MANIFESTE.
// Le même produit, le 15/09 : le marqueur n'était pas encore hérité, et 9 README sont entrés dans
// un projet Power BI (29 → 37 fichiers) ; le client de publication, qui envoie à l'API TOUT fichier
// du dossier, comptait 26 parties au lieu de 22 pour le modèle et 6 au lieu de 3 pour le rapport.
// L'information existait sur disque — le manifeste du format — et rien ne la lisait. Un dossier
// est donc clos s'il porte `.no-index`, OU un manifeste tiers connu (`*.pbip`, `.platform`), OU
// si son nom est celui d'un élément de format imposé (`*.SemanticModel`, `*.Report`, `*.Dataset`).
// `package.json` n'y est PAS : il marque un projet de code, qu'on indexe légitimement.
const MANIFESTES_TIERS = [/\.pbip$/i, /^\.platform$/];
const NOMS_FORMAT_TIERS = /\.(SemanticModel|Report|Dataset)$/;
// TF-1667 (14/10/2026) — UN DOSSIER DE TESTS, DE FIXTURES OU GELÉ NE REÇOIT AUCUN README. Mesuré le
// 13/10 chez un produit : 20 README créés sous `compliance-pack\__tests__\fixtures\`, et 1 dans un
// témoin que le CLAUDE.md du produit déclare gelé. Un dossier de fixtures est une donnée de test : un
// fichier de plus y change ce que la recette lit. Un dossier gelé se déclare par `.no-index` à sa
// racine, ou par une ligne du CLAUDE.md du dépôt qui dit « gelé » (ou « figé ») et cite son chemin
// entre accents graves : c'est là que le produit l'avait écrit, et rien ne le lisait.
const NOMS_TESTS = new Set(["__tests__", "__fixtures__", "fixtures", "node_modules"]);
const GELES = (() => {
  const s = new Set();
  let t = "";
  try { t = readFileSync(join(BASE, "CLAUDE.md"), "utf8"); } catch { return s; }
  for (const l of t.split(/\r?\n/)) {
    if (!/\b(?:gel|fig)[ée]e?s?(?![a-zà-ÿ])/i.test(l)) continue;
    for (const m of l.matchAll(/`([^`]+)`/g)) {
      const rel = m[1].trim().replace(/\\/g, "/").replace(/\/+$/, "");
      if (rel && !rel.includes("..") && !rel.startsWith("/") && !/^[a-z]:/i.test(rel)) s.add(sansCasse(rel));
    }
  }
  return s;
})();
const motifClos = (dir) => {
  if (existsSync(join(dir, ".no-index"))) return "marqueur `.no-index`, TF-1050";
  if (NOMS_TESTS.has(dir.split(sep).pop())) return "dossier de tests ou de fixtures, TF-1667";
  if (GELES.has(sansCasse(posix(relative(BASE, dir))))) return "dossier déclaré gelé par le CLAUDE.md du dépôt, TF-1667";
  if (NOMS_FORMAT_TIERS.test(dir)) return "élément de format tiers reconnu à son nom, TF-1126";
  let noms = [];
  try { noms = readdirSync(dir); } catch { return null; }
  const m = noms.find((n) => MANIFESTES_TIERS.some((r) => r.test(n)));
  return m ? `manifeste tiers \`${m}\`, TF-1126` : null;
};
const EST_CLOS = (dir) => motifClos(dir) !== null;
// TF-1610 (12/10/2026) — `input\` EST EN LECTURE SEULE POUR TOUT PRODUCTEUR (REGLES-PROJET). Relancé
// chez un produit (`--base .`), ce générateur a créé 458 README dans une arborescence de médias que
// l'humain avait déposée sous `input\` (5 187 fichiers). Chez un produit, on ne descend donc sous
// `input\` que dans un sous-dossier qui porte DÉJÀ un README.md (un geste délibéré) : tout autre est
// compté au parent, sans README propre. Le README de `input\` lui-même reste le seul posé d'office.
const NON_INDEXE = (dir) => {
  if (!DEPOT_PRODUIT) return false;
  const rel = posix(relative(BASE, dir));
  return rel.startsWith("input/") && !existsSync(join(dir, "README.md"));
};
const posix = (p) => p.split(sep).join("/");
const affiche = (p) => p.split("/").join("\\") + "\\";

// Fichiers IGNORÉS par git (sidecars, caches) : présents sur un poste, absents d'un clone — les
// lister rendrait le README périmé partout ailleurs qu'ici. Un seul appel git, jamais un par entrée.
function ignores() {
  // `--directory` (TF-1055) : un dossier ENTIER ignoré sort sous la forme `dossier/`, que
  // `estIgnore` sait lire — sans lui, seuls ses fichiers étaient connus, et le dossier gardait
  // dans l'index suivi un lien vers un README qu'aucun clone ne porte.
  const r = spawnSync("git", ["-C", BASE, "-c", "core.quotepath=false", "ls-files", "--others", "--ignored", "--exclude-standard", "--directory", "--", ...RACINES], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return new Set(r.status === 0 ? r.stdout.split(/\r?\n/).filter(Boolean) : []);
}
const IGNORES = ignores();
const estIgnore = (rel) => IGNORES.has(rel) || [...IGNORES].some((i) => i.endsWith("/") && rel.startsWith(i));

// UN INDEX SUIVI NE PORTE PAS LE NOM D'UN FICHIER QUE LE DÉPÔT NE PORTE PAS (TF-0914, 08/09/2026).
//
// Le fait mesuré le 08/09 : un lot déposé dans `input\00-retours\` par un produit dont le nom réel
// n'est PAS connu du canal confidentiel est resté NON SUIVI le temps d'un arbitrage. La
// pseudonymisation de fin de chaîne (D-37, plus bas) n'y pouvait rien : elle ne substitue que ce
// que la table connaît, et ce nom-là lui était inconnu. Ce hook a donc écrit le nom RÉEL du produit
// dans le README d'index — qui, lui, EST suivi et publié. La porte de publication a refusé le push
// (C5) et le README a été régénéré après retrait ; la porte a fait son office, mais l'index
// n'aurait jamais dû porter ce nom.
//
// La règle qui supprime la classe entière, et pas seulement ce cas : ce qui n'est pas dans
// l'histoire du dépôt n'entre pas dans une projection que le dépôt publie. C'est la même loi que
// la mention des dossiers machine retirée par TF-0615 — « une projection commitée ne parle que de
// ce que le dépôt porte » — appliquée cette fois aux fichiers non suivis, et pas seulement aux
// fichiers ignorés. Le CHIFFRE, lui, se dit (loi n° 3 : jamais par omission) : le pied de table
// annonce combien de fichiers non suivis ont été tenus hors de l'index.
function suivis() {
  const r = spawnSync("git", ["-C", BASE, "-c", "core.quotepath=false", "ls-files", "--", ...RACINES], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return new Set(r.status === 0 ? r.stdout.split(/\r?\n/).filter(Boolean) : []);
}
const SUIVIS = suivis();
// Hors dépôt git (`ls-files` muet), on ne cache rien : un relevé vide ferait disparaître TOUT le
// contenu de l'index, ce qui est un dégât bien pire que le défaut qu'on prévient.
const HORS_DEPOT = SUIVIS.size === 0;
const estSuivi = (rel) => HORS_DEPOT || SUIVIS.has(rel);

function taille(o) {
  if (o < 1024) return `${o} o`;
  if (o < 1024 * 1024) return `${(o / 1024).toFixed(1).replace(".", ",")} Ko`;
  return `${(o / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`;
}

function nature(chemin) {
  const ext = chemin.toLowerCase().split(".").pop();
  try {
    if (ext === "md") {
      const t = readFileSync(chemin, "utf8").split(/\r?\n/).find((l) => /^#\s+/.test(l));
      return t ? t.replace(/^#\s+/, "").slice(0, 90) : "markdown";
    }
    if (ext === "jsonl") return `${readFileSync(chemin, "utf8").split("\n").filter((l) => l.trim()).length} ligne(s) JSONL`;
    if (ext === "html") { const m = readFileSync(chemin, "utf8").match(/<title>([^<]{1,90})/i); return m ? m[1].trim() : "page HTML"; }
    if (ext === "json") return "JSON";
  } catch { /* illisible : la nature est l'extension */ }
  return ext === chemin.toLowerCase() ? "fichier" : ext.toUpperCase();
}

function compter(dir) {
  let fichiers = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (EST_MACHINE(e.name)) continue;
    // TF-0914 : le compte ne porte que ce que le dépôt porte — sinon la table dirait « 95 » là où
    // un clone en voit 94, et le README rebasculerait à chaque régénération sur un autre poste.
    if (e.isDirectory()) fichiers += compter(join(dir, e.name));
    else if (e.name !== "README.md" && !EST_SIDECAR(e.name) && estSuivi(posix(relative(BASE, join(dir, e.name))))) fichiers++;
  }
  return fichiers;
}

// TF-1667 (14/10/2026) — UN README RÉDIGÉ À LA MAIN N'EST JAMAIS RÉÉCRIT. Mesuré le 13/10 chez un
// produit : 41 README suivis, rédigés à la main (ni la marque « Généré par » ni bloc ROLE), remplacés
// par une table et un rôle « à rédiger » — le texte du dossier perdu, annulé à la main dans la minute.
// Un README existant SANS la marque du générateur appartient à qui l'a écrit : il est préservé, compté,
// et le compte se dit (loi n° 3). Le pilot n'en porte aucun : ses 25 README portent la marque.
const MARQUE_GENERE = /Généré par scripts\\readme-dossiers\.mjs/;
const estRedigeMain = (readme) => {
  if (!existsSync(readme)) return false;
  try { const t = readFileSync(readme, "utf8"); return !MARQUE_GENERE.test(t) && !t.includes(MARQUE_DEBUT); } catch { return false; }
};

function roleExistant(readme) {
  if (!existsSync(readme)) return null;
  const t = readFileSync(readme, "utf8");
  const a = t.indexOf(MARQUE_DEBUT), b = t.indexOf(MARQUE_FIN);
  if (a < 0 || b < 0 || b < a) return null;
  const role = t.slice(a + MARQUE_DEBUT.length, b).trim();
  // Le placeholder n'est pas un rôle rédigé : il cède la place à un rôle connu s'il en existe un.
  return role && role !== PLACEHOLDER ? role : null;
}

function attendu(dir, rel) {
  const visibles = readdirSync(dir, { withFileTypes: true })
    .filter((e) => !EST_MACHINE(e.name) && !EST_SIDECAR(e.name) && e.name !== "README.md" && !estIgnore(rel + "/" + e.name));
  // TF-0914 : un fichier NON SUIVI par git ne donne pas son nom à un index suivi et publié.
  const nonSuivis = visibles.filter((e) => !e.isDirectory() && !estSuivi(rel + "/" + e.name)).length;
  // TF-1576 et TF-1620 (13/10/2026) — UN DOSSIER IGNORÉ DÉCLARÉ NE DISPARAÎT PAS PARCE QU'IL EST ABSENT.
  // Le sas `_arrivee\` est ignoré par git : un worktree ou un clone frais ne l'a pas, et la ligne
  // versionnée qui le déclare était retirée de l'index à la régénération (deux fois le 13/10). La table
  // ROLES du pilot déclare ces dossiers : un dossier déclaré, ignoré par git et absent du disque
  // garde sa ligne, comme s'il était là.
  const presents = new Set(visibles.map((e) => e.name));
  const declaresAbsents = !EST_LE_PILOT ? [] : Object.keys(ROLES)
    .filter((k) => posix(dirname(k)) === rel && !presents.has(k.split("/").pop()))
    .filter((k) => spawnSync("git", ["-C", BASE, "check-ignore", "-q", "--", k + "/"]).status === 0)
    .map((k) => ({ name: k.split("/").pop(), isDirectory: () => true, absentDeclare: true }));
  const entrees = [...visibles, ...declaresAbsents]
    .filter((e) => e.isDirectory() || estSuivi(rel + "/" + e.name))
    .sort((x, y) => (x.isDirectory() === y.isDirectory() ? x.name.localeCompare(y.name, "fr") : x.isDirectory() ? -1 : 1));
  const caches = readdirSync(dir, { withFileTypes: true }).filter((e) => EST_MACHINE(e.name) && e.isDirectory()).map((e) => e.name);
  const role = roleExistant(join(dir, "README.md")) || roleConnu(rel) || PLACEHOLDER;
  const lignes = [];
  lignes.push(`# ${affiche(rel)}`, "",
    "<!-- Généré par scripts\\readme-dossiers.mjs : seul le bloc RÔLE se rédige à la main ; la table",
    "     se régénère à chaque ajout, modification ou suppression (hook PostToolUse, recette I4).",
    "     Ne pas éditer la table — modifier le dossier, relancer le script. -->", "",
    "## Rôle", "", MARQUE_DEBUT, role, MARQUE_FIN, "", "## Contenu", "",
    // Un chapitre qui commence par des données force le lecteur à deviner la question à
    // laquelle il répond (règle M7 du juge de lisibilité — mesuré sur ce fichier même).
    // TF-1453 (28/09/2026) : l'ouverture NOMME le contenu. « Ce que le dossier contient… » est une
    // annonce nominalisée : sur un README court (0 fichier, 150 mots), oracle-ecriture la refusait
    // (EC-1, 6,67 ‰ pour un seuil de 6,50 ‰). Les deux-points remplacent le tiret d'incise.
    "Contenu du dossier à la dernière régénération : chaque élément avec " +
    "son type, sa taille et sa nature, les sous-dossiers pointant vers leur propre README.", "",
    "| Élément | Type | Taille | Titre / nature |", "|---|---|---|---|");
  let nf = 0, nd = 0;
  for (const e of entrees) {
    const chemin = join(dir, e.name), relE = rel + "/" + e.name;
    if (e.isDirectory() && (e.absentDeclare || estIgnore(relE + "/"))) {
      // TF-1055 : un dossier IGNORÉ par git n'existe pas sur un clone frais. Pas de lien (il serait
      // mort), et un rôle tiré de la table des rôles versionnée — jamais du README local, qui ne
      // voyage pas : une projection commitée ne parle que de ce que le dépôt porte (TF-0615).
      nd++;
      const roleIgnore = (roleConnu(relE) || "rôle à déclarer dans la table ROLES de scripts\\readme-dossiers.mjs").replace(/\s+/g, " ").replace(/\*\*/g, "");
      lignes.push(`| \`${e.name}\\\` | dossier ignoré par git (absent d'un clone) | — | ${roleIgnore.slice(0, 160).replace(/\|/g, "/")}${roleIgnore.length > 160 ? "…" : ""} |`);
    } else if (e.isDirectory() && NON_INDEXE(chemin)) {
      nd++;
      const n = compter(chemin);
      lignes.push(`| \`${e.name}\\\` | dossier d'entrants non indexé (${n} fichier${n > 1 ? "s" : ""}) | — | \`input\\\` est en lecture seule pour un produit : aucun README n'y est posé d'office (TF-1610) |`);
    } else if (e.isDirectory() && EST_CLOS(chemin)) {
      nd++;
      const n = compter(chemin);
      lignes.push(`| \`${e.name}\\\` | livrable à structure close (${n} fichier${n > 1 ? "s" : ""}) | — | structure imposée par son format, non indexée (${motifClos(chemin)}) |`);
    } else if (e.isDirectory()) {
      nd++;
      const n = compter(chemin);
      // Le rôle du sous-dossier (son README, sinon la table des rôles) : une ligne qui dit ce
      // qu'il contient — « sous-dossier, voir son README » n'informait personne.
      const roleSous = (roleExistant(join(chemin, "README.md")) || roleConnu(relE) || "").replace(/\s+/g, " ");
      const resume = roleSous && roleSous !== PLACEHOLDER ? roleSous.replace(/\*\*/g, "").slice(0, 160) + (roleSous.length > 160 ? "…" : "")
        : estRedigeMain(join(chemin, "README.md")) ? "README rédigé à la main, préservé (TF-1667)" : "rôle à rédiger dans son README";
      lignes.push(`| [\`${e.name}\\\`](${e.name}/README.md) | dossier (${n} fichier${n > 1 ? "s" : ""}) | — | ${resume.replace(/\|/g, "/")} |`);
    } else {
      nf++;
      // TF-0615 : la taille est celle du CONTENU NORMALISÉ, pas celle du checkout. Lue sur le
      // disque, elle est gonflée d'un octet par ligne sur un poste en CRLF : « 4,1 Ko » ici et
      // « 4,0 Ko » ailleurs pour le MÊME fichier, et neuf README qui rebasculent à chaque
      // aller-retour entre deux sessions. Une projection commitée ne parle que de ce que le dépôt
      // porte. Un binaire garde sa taille réelle — `tailleNormalisee` le détecte et le dit.
      lignes.push(`| \`${e.name}\` | fichier | ${taille(tailleNormalisee(chemin))} | ${nature(chemin).replace(/\|/g, "/")} |`);
    }
  }
  if (!entrees.length) lignes.push("| _(dossier vide)_ | | | |");
  const notes = [`_${nf} fichier(s), ${nd} sous-dossier(s)_`];
  // Le chiffre se DIT (loi n° 3) : un index qui tait ce qu'il a écarté se lit comme un index
  // complet, et c'est exactement l'illusion contre laquelle TF-0914 a été payé.
  if (nonSuivis) notes.push(`${nonSuivis} fichier(s) présent(s) sur le poste et NON suivi(s) par git — non listés (un index publié ne nomme que ce que le dépôt porte, TF-0914)`);
  // TF-0615 : les dossiers MACHINE ne sont PLUS mentionnés. Ils sont ignorés par git, donc ils ne
  // voyagent pas : la version commitée affirmait la présence de `_oracles\` dans un dossier où il
  // n'existe que sur le poste dont un hook l'a créé. Toute autre machine qui régénère retirait la
  // mention, la première la remettait — onze fichiers qui rebasculent, et un diff qu'on apprend à
  // ne plus lire. La règle générique : *une projection commitée ne parle que de ce que le dépôt
  // porte*. Ce qui est local se lit sur le poste, il ne se publie pas. Le COMPTE de fichiers, lui,
  // exclut déjà ces dossiers (EST_MACHINE au filtre) : rien n'est perdu que l'on comptait.
  if (existsSync(join(dir, "LISEZMOI.md"))) notes.push("voir aussi `LISEZMOI.md` (conventions et correspondance des anciens chemins)");
  lignes.push("", notes.join(" · "), "");
  return { texte: lignes.join("\n"), role };
}

function* dossiers(dir) {
  yield dir;
  for (const e of readdirSync(dir, { withFileTypes: true }))
    if (e.isDirectory() && !EST_MACHINE(e.name) && !EST_CLOS(join(dir, e.name)) && !NON_INDEXE(join(dir, e.name))) yield* dossiers(join(dir, e.name));
}

const defauts = [];
// TF-0451 puis TF-0503 (21 et 22/08) : le même défaut deux fois. La table portait une colonne
// « Dernier commit », donc chaque commit la périmait. TF-0451 avait atténué l'EFFET — une dérive
// de date seule devenait un avertissement, jamais un défaut. Ça n'a pas suffi : l'arbre restait
// sale après chaque commit d'AJOUT (sept fois sur sept le 22/08), parce que « non versionné »
// devenait une date dès que le fichier entrait sous git, ce qui est une dérive de date que la
// tolérance couvrait à `--check` mais que le hook réécrivait quand même.
//
// La CAUSE est retirée par décision humaine du 22/08 : plus aucune date dans la table, donc plus
// de `git log` sur l'arbre à chaque écriture, plus de balayage par dossier, et plus de tolérance
// à maintenir. Ce qui fait DÉFAUT est ce qui l'a toujours été et rien d'autre : la STRUCTURE
// (fichier apparu, disparu, renommé) et le RÔLE non rédigé. `--strict` disparaît avec la
// tolérance qu'il servait à lever — un drapeau sans objet est une affordance morte.
const ecrits = [];
const preserves = [];
for (const racine of RACINES) {
  const abs = join(BASE, racine);
  if (!existsSync(abs)) { defauts.push(`${racine}\\ : racine absente`); continue; }
  // UN INDEX DÉRIVÉ DE DONNÉES SALES EST SALE (01/09/2026, décision D-37). Cette table liste ce
  // que le dossier CONTIENT, y compris les lots bruts qu'un produit vient de déposer et que git
  // ne suit pas — et le README, lui, est suivi. Un nom de client entrait donc dans un fichier
  // publiable sans que personne n'ait rien écrit à la main : c'est la forme la plus discrète du
  // défaut, celle qu'aucune relecture n'attrape parce qu'il n'y a pas d'auteur à interroger.
  //
  // La substitution se fait ICI, au dernier moment, et pas plus haut : ce que le générateur
  // MANIPULE reste le nom réel — il lit le disque, il compte, il mesure — et seul ce qui est
  // ÉCRIT est pseudonymisé. Anonymiser plus tôt ferait chercher des fichiers qui n'existent pas.
  //
  // Référentiel manquant : on N'ÉCRIT PAS, et on le dit. Un index périmé se voit à la revue ;
  // un index publié avec un nom de client ne se rattrape pas. Même règle que l'anonymiseur
  // d'entrants — « un anonymiseur qui ne peut pas anonymiser doit arrêter le convoi ».
  const pseudonymise = (brut) => {
    // TF-1451 : le dépôt privé d'un produit porte son propre nom ; rien n'y est substitué.
    if (DEPOT_PRODUIT) return { texte: brut, ok: true };
    try { return { texte: anonymiser(brut).texte, ok: true }; }
    catch (e) { return { texte: null, ok: false, motif: e.message }; }
  };

  for (const dir of dossiers(abs)) {
    const rel = posix(relative(BASE, dir));
    const readme = join(dir, "README.md");
    if (estRedigeMain(readme)) { preserves.push(affiche(rel) + "README.md"); continue; }
    const { texte: texteBrut, role } = attendu(dir, rel);
    const propre = pseudonymise(texteBrut);
    if (!propre.ok) {
      defauts.push(`${affiche(rel)}README.md : NON régénéré — ${propre.motif}. Un index qui ne peut 
        pas être pseudonymisé n'est pas écrit : périmé se voit, publié avec un nom de client ne se 
        rattrape pas.`.replace(/\s+/g, " "));
      continue;
    }
    const texte = lf(propre.texte);
    const courant = existsSync(readme) ? lf(readFileSync(readme, "utf8")) : null;
    if (role === PLACEHOLDER) defauts.push(`${affiche(rel)}README.md : rôle non rédigé`);
    if (courant === texte) continue;
    if (CHECK) {
      if (courant === null) defauts.push(`${affiche(rel)}README.md : absent`);
      else defauts.push(`${affiche(rel)}README.md : périmé (le dossier a changé)`);
    }
    else { writeFileSync(readme, texte, "utf8"); ecrits.push(affiche(rel) + "README.md"); }
  }
}

// Loi n° 3 : ce qui est écarté d'office se dit — chez un produit, ni pseudonyme ni rôle du pilot.
const MODE = DEPOT_PRODUIT ? " — dépôt de produit (`forge\\`) : ni pseudonymisation ni rôle du pilot (TF-1451, TF-1452)" : "";
if (!SILENCIEUX && ecrits.length) console.log(`README régénérés dans ${BASE}${MODE} (${ecrits.length}) : ${ecrits.join(" · ")}`);
if (!SILENCIEUX && !ecrits.length && !CHECK) console.log(`README à jour dans ${BASE}${MODE}, rien à régénérer`);
if (!SILENCIEUX && preserves.length) console.log(`${preserves.length} README rédigé(s) à la main (sans la marque du générateur), préservé(s) tel(s) quel(s) (TF-1667) : ${preserves.slice(0, 8).join(" · ")}${preserves.length > 8 ? " · …" : ""}`);
if (defauts.length) {
  console.error(`[readme-dossiers] ${defauts.length} défaut(s) :\n  - ${defauts.join("\n  - ")}`);
  process.exit(1);
}
if (CHECK && !SILENCIEUX) console.log("[check] PASS : tous les README d'input\\ et output\\ sont présents, à jour et rédigés");
