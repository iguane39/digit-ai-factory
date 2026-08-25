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

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const lireArg = (nom, defaut) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : defaut; };
const BASE = resolve(lireArg("--base", join(ICI, "..")));
const RACINES = lireArg("--racines", "input,output").split(",").map((s) => s.trim()).filter(Boolean);
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
  "input/00-retours/old": "Lots de retours déjà ingérés au registre TODO (ids TF frappés). Conservés figés : l'empreinte du lot garantit l'idempotence d'ingestion, et l'histoire ne se réécrit pas.",
  "input/01-candidatures": "Candidatures hors lot de retours : `candidature-*.tf.jsonl`, `revue-*.tf.jsonl`, et leurs formes `.normalise.tf.jsonl` produites par `normaliser-lot.mjs`. À la racine : à ingérer ; ingérées ou traitées par un autre canal → `old\\`.",
  "input/01-candidatures/old": "Candidatures ingérées (ids TF frappés) ou traitées par un autre canal — archive figée, jamais ré-ingérée.",
  "input/02-entrants-html": "Livrables HTML fournis comme référence ou source d'extraction (best practices, modèles de rapport) — nom d'origine conservé, il porte déjà marque et date.",
  "input/03-artefacts": "Pièces que la forge a déclarées manquantes et que l'humain remet (TF-0364) — aucun sidecar exigé du remettant, notice `LISEZMOI.md` ; le pilot écrit le sidecar de rattachement en traitant.",
  "input/04-outillage": "Scripts et paquets fournis par l'humain — à INSTRUIRE avant tout usage : un outillage entrant ne s'exécute jamais sans instruction (étude ou candidature).",
  "input/04-outillage/old": "Outillage entrant déjà instruit, remplacé ou écarté — archive.",
  "input/05-entrants-media": "Médias fournis (captures, vidéos) en appui d'un retour ou d'une insatisfaction — les binaires lourds restent hors git ; notice `LISEZMOI.md`.",
  "output": "Livrables du pilot, en familles numérotées (D-15/D-16) : **une seule version à la racine de chaque famille, les antérieures en `old\\`**. Les deux familles `05-` sont une collision DÉCLARÉE, pas à corriger (TF-0339) : la prochaine famille prend `06-`. Correspondance des anciens chemins : `LISEZMOI.md`.",
  "output/01-revues-et-propositions": "Revues d'écosystème (fiches d'audit des forges rejouées, synthèse trans-forges) et propositions de forge — rapports, maquettes HTML, notes ; un document par revue, nommage R-4 daté.",
  "output/02-schema-ecosysteme": "Schéma d'écosystème des forges (HTML autoportant), régénéré à chaque changement de périmètre (forge née, renommée) ; versions antérieures en `old\\`.",
  "output/02-schema-ecosysteme/old": "Versions antérieures du schéma d'écosystème (PNG puis HTML) — figées, jamais modifiées.",
  "output/03-etudes": "Études d'opportunité au gabarit `gabarits\\ETUDE-OPPORTUNITE.md` (jugées par `oracles\\oracle-etude-opportunite.mjs`, sections + O0-O4 + verdict unique + plan de revue), cartographies et études datées `AAAAMMJJ-etude-*.md`.",
  "output/04-plans": "Plans stratégiques, synthèses de mandat et de campagne (format `gabarits\\RESTITUTION.md`), notes de migration — livrables R-4 datés.",
  "output/05-catalogues-readmes-forges": "Sections « catalogue de services » proposées aux README des treize forges, générées depuis `catalogues\\catalogue.jsonl` ; `LISEZMOI.md` explique la remise à chaque forge.",
  "output/05-insatisfactions": "Dossiers d'instruction des insatisfactions (TF-0287) : un dossier `INS-XXXX\\` par insatisfaction, chemins portés par `insatisfactions\\REGISTRE.jsonl` (registre à événements figés — ne jamais déplacer).",
  "output/05-insatisfactions/INS-0001": "Instruction de l'insatisfaction INS-0001 (menus de produit-07) — `INSTRUCTION.md` à six blocs (`gabarits\\AGENT-INSATISFACTION.md`) : reproduction, cause racine, gates en défaut.",
};

// Dossiers MACHINE : journaux d'oracles (`.oracles\`, `_oracles\` — TF-0428) — régénérés à
// chaque exécution, jamais lus par un humain. Comptés au README du parent, sans README propre.
// Les SIDECARS de contrôle ne sont pas du contenu : ils accompagnent un fichier et se lisent par
// l'outil qui les écrit. Les lister doublerait chaque table et noierait les livrables (convention
// TF-0065, étendue au sceau de jugement de TF-0523 — qui est VERSIONNÉ, contrairement à un cache :
// un sceau non versionné ne survivrait pas au clonage, et n'avertirait donc personne).
const EST_SIDECAR = (nom) => /\.(jugement|oracles|oracles-cache)\.json$/i.test(nom)
  || /\.oracles-historique\.jsonl$/i.test(nom);
const EST_MACHINE = (nom) => nom.startsWith(".") || nom === "_oracles";
const posix = (p) => p.split(sep).join("/");
const affiche = (p) => p.split("/").join("\\") + "\\";

// Fichiers IGNORÉS par git (sidecars, caches) : présents sur un poste, absents d'un clone — les
// lister rendrait le README périmé partout ailleurs qu'ici. Un seul appel git, jamais un par entrée.
function ignores() {
  const r = spawnSync("git", ["-C", BASE, "-c", "core.quotepath=false", "ls-files", "--others", "--ignored", "--exclude-standard", "--", ...RACINES], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return new Set(r.status === 0 ? r.stdout.split(/\r?\n/).filter(Boolean) : []);
}
const IGNORES = ignores();
const estIgnore = (rel) => IGNORES.has(rel) || [...IGNORES].some((i) => i.endsWith("/") && rel.startsWith(i));

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
    if (e.isDirectory()) fichiers += compter(join(dir, e.name)); else if (e.name !== "README.md" && !EST_SIDECAR(e.name)) fichiers++;
  }
  return fichiers;
}

function roleExistant(readme) {
  if (!existsSync(readme)) return null;
  const t = readFileSync(readme, "utf8");
  const a = t.indexOf(MARQUE_DEBUT), b = t.indexOf(MARQUE_FIN);
  if (a < 0 || b < 0 || b < a) return null;
  const role = t.slice(a + MARQUE_DEBUT.length, b).trim();
  return role || null;
}

function attendu(dir, rel) {
  const entrees = readdirSync(dir, { withFileTypes: true })
    .filter((e) => !EST_MACHINE(e.name) && !EST_SIDECAR(e.name) && e.name !== "README.md" && !estIgnore(rel + "/" + e.name))
    .sort((x, y) => (x.isDirectory() === y.isDirectory() ? x.name.localeCompare(y.name, "fr") : x.isDirectory() ? -1 : 1));
  const caches = readdirSync(dir, { withFileTypes: true }).filter((e) => EST_MACHINE(e.name) && e.isDirectory()).map((e) => e.name);
  const role = roleExistant(join(dir, "README.md")) || ROLES[rel] || PLACEHOLDER;
  const lignes = [];
  lignes.push(`# ${affiche(rel)}`, "",
    "<!-- Généré par scripts\\readme-dossiers.mjs : seul le bloc RÔLE se rédige à la main ; la table",
    "     se régénère à chaque ajout, modification ou suppression (hook PostToolUse, recette I4).",
    "     Ne pas éditer la table — modifier le dossier, relancer le script. -->", "",
    "## Rôle", "", MARQUE_DEBUT, role, MARQUE_FIN, "", "## Contenu", "",
    "| Élément | Type | Taille | Titre / nature |", "|---|---|---|---|");
  let nf = 0, nd = 0;
  for (const e of entrees) {
    const chemin = join(dir, e.name), relE = rel + "/" + e.name;
    if (e.isDirectory()) {
      nd++;
      const n = compter(chemin);
      // Le rôle du sous-dossier (son README, sinon la table des rôles) : une ligne qui dit ce
      // qu'il contient — « sous-dossier, voir son README » n'informait personne.
      const roleSous = (roleExistant(join(chemin, "README.md")) || ROLES[relE] || "").replace(/\s+/g, " ");
      const resume = roleSous && roleSous !== PLACEHOLDER ? roleSous.replace(/\*\*/g, "").slice(0, 160) + (roleSous.length > 160 ? "…" : "") : "rôle à rédiger dans son README";
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
    if (e.isDirectory() && !EST_MACHINE(e.name)) yield* dossiers(join(dir, e.name));
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
for (const racine of RACINES) {
  const abs = join(BASE, racine);
  if (!existsSync(abs)) { defauts.push(`${racine}\\ : racine absente`); continue; }
  for (const dir of dossiers(abs)) {
    const rel = posix(relative(BASE, dir));
    const readme = join(dir, "README.md");
    const { texte: texteBrut, role } = attendu(dir, rel);
    const texte = lf(texteBrut);
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

if (!SILENCIEUX && ecrits.length) console.log(`README régénérés (${ecrits.length}) : ${ecrits.join(" · ")}`);
if (!SILENCIEUX && !ecrits.length && !CHECK) console.log("README à jour, rien à régénérer");
if (defauts.length) {
  console.error(`[readme-dossiers] ${defauts.length} défaut(s) :\n  - ${defauts.join("\n  - ")}`);
  process.exit(1);
}
if (CHECK && !SILENCIEUX) console.log("[check] PASS : tous les README d'input\\ et output\\ sont présents, à jour et rédigés");
