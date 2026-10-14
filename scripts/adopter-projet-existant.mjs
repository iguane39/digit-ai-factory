#!/usr/bin/env node
/**
 * adopter-projet-existant.mjs — LE GESTE QUI MANQUAIT ENTRE « JE N'AI RIEN » ET « JE REPARS D'UN
 * DOSSIER VIDE » (TF-1286, décision humaine D-2 (b) du 22/09/2026).
 *
 * ============================================================================================
 * LE TROU, NOMMÉ PAR LE RETOUR QUI L'A TROUVÉ
 * ============================================================================================
 *
 * `PROMPT-PRODUIT.md` est explicitement le prompt canonique d'un NOUVEAU produit, et il exige un
 * dossier VIDE : « Créer un dossier vide pour le produit, y copier ce fichier ». `REGLES-PROJET.md`
 * renvoyait le cas d'un projet existant à plus tard — « Rattrapage des projets existants : au
 * prochain run de version de chacun » —, c'est-à-dire à un run qui, pour un projet jamais
 * instrumenté, n'arrive jamais de lui-même. Il n'existait donc AUCUN geste nommé pour le cas
 * d'entrée le plus fréquent d'un patrimoine existant.
 *
 * L'outil voisin le confirme par sa garde : `recopier-heritage.mjs` REFUSE un dossier sans
 * `forge\`, et il a raison — « un dépôt jamais instancié n'hérite de rien ». Les deux gardes se
 * regardaient : la recopie exigeait l'instanciation, l'instanciation exigeait un dossier vide.
 *
 * ============================================================================================
 * TROIS PROPRIÉTÉS, ET AUCUNE N'EST NÉGOCIABLE
 * ============================================================================================
 *
 *   · **IDEMPOTENT** — deux passages donnent le même état. Ce qui existe n'est pas recréé.
 *   · **NON DESTRUCTIF** — aucun fichier préexistant n'est écrasé, aucun n'est DÉPLACÉ. Un
 *     projet vivant porte des conventions que son équipe a choisies ; les remplacer par celles du
 *     dispositif au premier contact serait le contraire d'une adoption.
 *   · **IL DIT TOUT CE QU'IL LAISSE** — chaque artefact préexistant est NOMMÉ, avec l'écart entre
 *     ce qu'il est et ce que le contrat d'héritage attend. Un écart tu est indiscernable d'un
 *     oubli (loi transverse n° 3), et c'est ce qui a coûté au produit de TF-0655 de devoir
 *     déduire un emplacement puis écrire dans le fichier lui-même qu'il l'avait deviné.
 *
 * ============================================================================================
 * CE QU'IL POSE, ET D'OÙ IL LE TIENT
 * ============================================================================================
 *
 * La liste n'est pas écrite ici : elle est LUE dans `gabarits\HERITAGE.json`, le contrat que les
 * produits héritent et que `relever-heritage.mjs` mesure. Un artefact ajouté au contrat est donc
 * posé par ce script sans qu'un geste soit nécessaire — et deux listes qui divergent au premier
 * ajout sont un défaut que le parc compte par ailleurs.
 *
 * S'y ajoutent les répertoires que les règles de projet exigent et qu'aucun artefact ne porte :
 * `input\`, `output\`, `docs\` (R-1, R-2, R-3), et `forge\retours\` que R-47 attend.
 *
 * L'ÉCART INITIAL EST CONSIGNÉ LÀ OÙ LE CONTRAT LE PRÉVOIT : `forge\travaux\ECARTS-ASSUMES.md`,
 * le carnet des écarts assumés du produit. Pas un fichier inventé pour l'occasion — c'est
 * exactement le défaut que TF-0655 a payé.
 *
 * GARDES : refuse de s'exécuter sur le pilot ; refuse un dossier portant DÉJÀ `forge\` et renvoie
 * à `recopier-heritage.mjs`, dont c'est le domaine ; refuse un dossier inexistant.
 *
 * TYPE « documentaire » (TF-1439, décision humaine D-32 (a) du 28/09/2026). Le fait, remonté par
 * le lot Produit-78 20260928a (RP-5) : sur un projet sans logiciel ni site, l'adoption posait
 * `robots.txt` et `llms.txt`, que le contrat ne doit pourtant qu'au « produit à surface web »
 * (`conditionnel` de `HERITAGE.json`, R-27), et R-13 exigeait une variable dans `.env.example` :
 * la session en a déclaré une pour passer. `--type documentaire` écarte ces deux artefacts, écrit
 * l'écart au carnet avec ses quatre champs et pose `type_projet: documentaire` dans son en-tête,
 * que `oracle-conformite-projet` lit (R-13, R-27). La déclaration se CONFRONTE au dépôt : un seul
 * signal de logiciel ou de site (code, manifeste de dépendances, fichier de site) la fait refuser
 * ici, et rougir R-13 là-bas — un produit web ne s'exempte pas en se disant documentaire.
 *
 * Usage : node <PILOT_ROOT>\scripts\adopter-projet-existant.mjs <racine du projet> [--essai] [--type documentaire]
 *         node <PILOT_ROOT>\scripts\adopter-projet-existant.mjs <clone du tiers> --hors-depot <socle> [--essai]  (TF-1658)
 *         node <PILOT_ROOT>\scripts\adopter-projet-existant.mjs --verifier-tiers <socle>  (exit 0 intact, 1 écrit, 2 sans objet)
 *   À lancer PAR LE PROJET, depuis son dépôt — le pilot n'écrit jamais chez un produit de
 *   lui-même, et l'adoption est un geste que le projet demande.
 * Exit : 0 adopté (ou rien à faire) · 1 refusé par une garde · 2 usage.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(join(ICI, ".."));

/** Les répertoires que les règles de projet exigent et qu'aucun artefact du contrat ne porte. */
export const REPERTOIRES = [
  { chemin: "input", regle: "R-1" },
  { chemin: "output", regle: "R-2" },
  { chemin: "docs", regle: "R-3" },
  { chemin: join("forge", "retours"), regle: "R-47" },
  { chemin: join("forge", "travaux"), regle: "R-20 bis" },
];

/** Le contrat d'héritage, LU et jamais recopié. Rend `[]` si le pilot ne le porte pas. */
export function contratHeritage(pilot = PILOT) {
  const p = join(pilot, "gabarits", "HERITAGE.json");
  if (!existsSync(p)) return [];
  try { return JSON.parse(readFileSync(p, "utf8")).artefacts || []; } catch { return []; }
}

/** Un dossier est-il « vivant » — porte-t-il autre chose que ce que l'adoption y mettrait ? */
export function estVivant(racine) {
  let noms = [];
  try { noms = readdirSync(racine); } catch { return false; }
  const ignorables = new Set([".git", ".gitignore", "PROMPT-PRODUIT.md", "PROMPT-PRODUIT-EXISTANT.md", ".DS_Store"]);
  return noms.some((n) => !ignorables.has(n));
}

// ---- TF-1439 · LE TYPE DE PROJET « documentaire » ---------------------------------------------
/** Le seul type que l'adoption sait poser, et que la conformité sait lire. */
export const TYPE_DOCUMENTAIRE = "documentaire";
/** Le `conditionnel` du contrat d'héritage qu'un projet documentaire écarte (R-27). */
export const CONDITION_SITE = "produit à surface web";
/** Où vit la déclaration : l'en-tête du carnet des écarts assumés, que l'adoption pose toujours. */
export const CARNET = "forge/travaux/ECARTS-ASSUMES.md";

// Les SIGNAUX qui contredisent un projet documentaire. Un projet sans logiciel ni site ne porte
// ni fichier de code, ni manifeste de dépendances, ni fichier de site. Sont hors du compte :
// `forge\` (le dispositif lui-même, dont les juges hérités sont des `.mjs`), `input\` (les
// entrants sont des données, pas le logiciel du projet) et les répertoires d'outillage.
const EXT_LOGICIEL = new Set(["py", "js", "mjs", "cjs", "ts", "tsx", "jsx", "go", "rs", "java", "rb", "php", "cs",
  "kt", "swift", "scala", "c", "cpp", "h", "vue", "svelte", "sh", "ps1", "ipynb"]);
const MANIFESTES = new Set(["package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
  "pyproject.toml", "poetry.lock", "uv.lock", "requirements.txt", "pipfile", "pipfile.lock", "cargo.toml",
  "cargo.lock", "go.mod", "go.sum", "composer.json", "composer.lock", "gemfile", "gemfile.lock", "pom.xml",
  "build.gradle", "dockerfile", "docker-compose.yml", "docker-compose.yaml"]);
const FICHIERS_DE_SITE = new Set(["robots.txt", "llms.txt", "sitemap.xml"]);
const HORS_SIGNAUX = new Set([".git", "node_modules", ".venv", "venv", "__pycache__", ".claude", "forge", "input"]);

/**
 * Les signaux de logiciel ou de site que porte un dossier, en chemins relatifs à barres obliques,
 * triés. Lecture seule, six niveaux au plus (la profondeur de `oracle-conformite-projet`). Une
 * racine web déclarée (`racine_web:` de `docs/projet/PARAMETRAGE.md`) est aussi un signal.
 */
export function signauxLogicielOuSite(racine, pilot = PILOT) {
  const trouves = [];
  // TF-1614 (lot Produit-79 20261007a, RP-5) : un `robots.txt` ou un `llms.txt` IDENTIQUE à son gabarit
  // est ce que l'adoption a posé elle-même, pas un site que le projet a bâti. Le compter rendait la
  // déclaration « documentaire » impossible après une adoption sans `--type` (la session déclarait
  // FORGE_ROOT pour passer). Dès que le fichier est instancié ou modifié, il redevient un signal.
  const poseParAdoption = (chemin, nom) => {
    if (nom !== "robots.txt" && nom !== "llms.txt") return false;
    const gab = join(pilot, "gabarits", "web", nom);
    if (!existsSync(gab)) return false;
    const norm = (t) => t.replace(/^﻿/, "").replace(/\r\n/g, "\n").trimEnd();
    try { return norm(readFileSync(chemin, "utf8")) === norm(readFileSync(gab, "utf8")); } catch { return false; }
  };
  const parcourir = (d, rel, prof) => {
    if (prof > 6) return;
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) { if (!HORS_SIGNAUX.has(e.name.toLowerCase())) parcourir(join(d, e.name), r, prof + 1); continue; }
      const nom = e.name.toLowerCase();
      const ext = nom.includes(".") ? nom.split(".").pop() : "";
      if (EXT_LOGICIEL.has(ext)) trouves.push(`${r} (code)`);
      else if (MANIFESTES.has(nom)) trouves.push(`${r} (manifeste)`);
      else if (FICHIERS_DE_SITE.has(nom) && !poseParAdoption(join(d, e.name), nom)) trouves.push(`${r} (fichier de site)`);
    }
  };
  parcourir(racine, "", 0);
  const param = join(racine, "docs", "projet", "PARAMETRAGE.md");
  if (existsSync(param)) {
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(param, "utf8").replace(/^﻿/, ""));
    const web = fm && /^racine_web\s*:\s*["']?([^"'\r\n#]+?)["']?\s*$/m.exec(fm[1]);
    if (web) trouves.push(`docs/projet/PARAMETRAGE.md (racine web déclarée : ${web[1].trim()})`);
  }
  return trouves.sort();
}

// ---- TF-1659 · LA RACINE SERVIE ------------------------------------------------------------------
// LE FAIT (13/10/2026) : sur un dépôt à deux sous-projets (`FRONT/`, servi depuis `FRONT/public/`, et
// `BACK/`), l'essai à blanc annonçait `robots.txt` et `llms.txt` à la racine du DÉPÔT, où ils ne seront
// jamais servis : le contrôle de présence serait passé sans que la surface publiée change. L'adoption
// relève donc la racine servie AVANT de poser la surface web : la racine déclarée (`racine_web:` de
// `docs/projet/PARAMETRAGE.md`) si elle existe, sinon les dossiers aux noms de racine servie des cadres
// courants (`public`, `wwwroot`, `static`, `site`), trois niveaux au plus, hors outillage. Une seule
// trouvée : la surface y est posée. Plusieurs : rien n'est posé, l'ambiguïté est consignée au carnet.
// Aucune : la racine du dépôt, comme avant.
const NOMS_RACINE_SERVIE = new Set(["public", "wwwroot", "static", "site"]);
export function racinesServies(racine) {
  const param = join(racine, "docs", "projet", "PARAMETRAGE.md");
  if (existsSync(param)) {
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(param, "utf8").replace(/^﻿/, ""));
    const web = fm && /^racine_web\s*:\s*["']?([^"'\r\n#]+?)["']?\s*$/m.exec(fm[1]);
    if (web) return [web[1].trim().replace(/\\/g, "/").replace(/^\.\/|\/+$/g, "")].filter(Boolean);
  }
  const trouves = [];
  const parcourir = (d, rel, prof) => {
    if (prof > 3) return;
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (!e.isDirectory() || HORS_SIGNAUX.has(e.name.toLowerCase()) || e.name.startsWith(".")) continue;
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (NOMS_RACINE_SERVIE.has(e.name.toLowerCase())) { trouves.push(r); continue; }
      if (!["docs", "output", "test", "tests", "dist", "build", "bin", "obj"].includes(e.name.toLowerCase())) parcourir(join(d, e.name), r, prof + 1);
    }
  };
  parcourir(racine, "", 1);
  return trouves.sort();
}

/** L'écart de surface web, consigné au carnet quand une racine servie a été relevée hors de la racine. */
export function blocSurfaceWeb(servies, quand) {
  const une = servies.length === 1;
  return ["", `## Surface web : racine servie ${une ? `relevée sous \`${servies[0]}\`` : "AMBIGUË"} (TF-1659) — ${quand}`, "",
    une
      ? `\`robots.txt\` et \`llms.txt\` sont posés sous \`${servies[0]}/\`, la racine que le projet sert, et non à la racine du dépôt, où ils ne seraient jamais servis. À déclarer à l'ouverture du run : \`racine_web: ${servies[0]}\` dans l'en-tête de \`docs/projet/PARAMETRAGE.md\`, que lisent la conformité et le relevé d'héritage.`
      : `Plusieurs racines servies candidates : ${servies.map((s) => `\`${s}\``).join(", ")}. \`robots.txt\` et \`llms.txt\` ne sont posés NULLE PART : à la racine du dépôt, ils passeraient le contrôle de présence sans changer la surface publiée. À trancher au premier run : déclarer \`racine_web:\` dans \`docs/projet/PARAMETRAGE.md\`, puis rejouer la recopie d'héritage.`,
    ""].join("\n");
}

// ---- TF-1658 · LE DÉPÔT D'UN TIERS (audit, coaching) ---------------------------------------------
// LE FAIT (13/10/2026) : sur le clone d'un dépôt client développé par un tiers, l'essai annonçait 25
// écritures dans son arbre de travail (CLAUDE.md, hooks, robots.txt, forge/**…), et la démarche
// proposée allait jusqu'au commit local. Le porteur, coach et auditeur, a dû arrêter la session : « ne
// pousse jamais sur le repo, le projet est géré par un autre développeur ». Avec `--hors-depot
// <dossier>`, le socle est posé dans un dossier frère sous git local, et le clone du tiers devient un
// ENTRANT en lecture seule : chemin, commit et état relevés dans `forge/DEPOT-TIERS.json`. La règle
// propre à ce mode, jugée par `--verifier-tiers` et à chaque ouverture : rien de nouveau sous le clone
// du tiers (`git status --porcelain` identique au relevé), son HEAD inchangé.
export const FICHIER_TIERS = "forge/DEPOT-TIERS.json";
/** Le mode hors dépôt, consigné au carnet du socle. */
export function blocDepotTiers(tiers, quand) {
  return ["", `## Dépôt d'un tiers en lecture seule — socle hors dépôt (TF-1658) — ${quand}`, "",
    `Le projet étudié vit dans \`${tiers}\`, un dépôt que cette session ne possède pas (audit, coaching). Le socle, les livrables et les lots de retours vivent ICI, sous git local ; le dépôt du tiers est un ENTRANT : il se lit, il ne s'écrit jamais, et rien ne s'y pousse. Son chemin, son commit et son état au relevé sont dans \`${FICHIER_TIERS}\`.`,
    `Règle jugée : aucune écriture sous le clone du tiers (\`git status --porcelain\` identique au relevé, HEAD inchangé) — \`node <PILOT_ROOT>\\scripts\\adopter-projet-existant.mjs --verifier-tiers .\` depuis ce socle, et à chaque ouverture de session.`,
    ""].join("\n");
}
const gitLire = (d, ...a) => {
  const r = spawnSync("git", ["-C", d, ...a], { encoding: "utf8" });
  return r.status === 0 ? (r.stdout || "").trim() : null;
};
export function releverTiers(tiers) {
  const porcelain = gitLire(tiers, "status", "--porcelain");
  return {
    schema: "pilot/depot-tiers@1",
    chemin: tiers,
    git: porcelain !== null,
    commit: gitLire(tiers, "rev-parse", "HEAD"),
    branche: gitLire(tiers, "rev-parse", "--abbrev-ref", "HEAD"),
    origin: gitLire(tiers, "remote", "get-url", "origin"),
    porcelain_initial: porcelain === null ? null : porcelain.split(/\r?\n/).filter(Boolean),
    releve_le: new Date().toISOString(),
    regle: "lecture seule : aucune écriture sous ce clone (git status --porcelain identique au relevé, HEAD inchangé) — jugé par adopter-projet-existant.mjs --verifier-tiers et à chaque ouverture",
  };
}
/** Juge la règle du mode hors dépôt. Rend `{ verdict: PASS|FAIL|SANS_OBJET, message, nouvelles }`. */
export function verifierDepotTiers(socle) {
  const f = join(socle, ...FICHIER_TIERS.split("/"));
  if (!existsSync(f)) return { verdict: "SANS_OBJET", message: `aucun ${FICHIER_TIERS} : ce projet n'est pas en mode hors dépôt`, nouvelles: [] };
  let t; try { t = JSON.parse(readFileSync(f, "utf8")); } catch (e) { return { verdict: "FAIL", message: `${FICHIER_TIERS} illisible : ${e.message}`, nouvelles: [] }; }
  if (!existsSync(t.chemin)) return { verdict: "SANS_OBJET", message: `clone du tiers absent de ce poste (${t.chemin})`, nouvelles: [] };
  if (!t.git) return { verdict: "SANS_OBJET", message: `le dossier du tiers n'est pas un dépôt git (${t.chemin}) : l'écriture n'y est pas mesurable`, nouvelles: [] };
  const avant = new Set(t.porcelain_initial || []);
  const maintenant = (gitLire(t.chemin, "status", "--porcelain") || "").split(/\r?\n/).filter(Boolean);
  const nouvelles = maintenant.filter((l) => !avant.has(l));
  const head = gitLire(t.chemin, "rev-parse", "HEAD");
  const headBouge = t.commit && head && head !== t.commit;
  if (nouvelles.length || headBouge) {
    return { verdict: "FAIL", nouvelles,
      message: `écriture sous le dépôt du tiers ${t.chemin} : ${nouvelles.length} entrée(s) nouvelle(s) à git status${nouvelles.length ? ` (${nouvelles.slice(0, 5).join(" ; ")})` : ""}${headBouge ? `, HEAD ${t.commit.slice(0, 8)} → ${head.slice(0, 8)}` : ""}. Remède : retirer ces écritures du clone du tiers (elles appartiennent à son développeur) et les refaire dans le socle` };
  }
  return { verdict: "PASS", nouvelles: [], message: `dépôt du tiers intact depuis le relevé du ${t.releve_le} (${t.chemin}, HEAD ${String(t.commit || "?").slice(0, 8)})` };
}

/**
 * Le type de projet DÉCLARÉ : ligne `type_projet:` de l'en-tête du carnet des écarts assumés, et
 * nulle part ailleurs (une mention dans le corps n'est pas une déclaration). Rend `{ type, ou }`,
 * ou null si rien n'est déclaré.
 */
export function typeProjetDeclare(racine) {
  const f = join(racine, ...CARNET.split("/"));
  if (!existsSync(f)) return null;
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(f, "utf8").replace(/^﻿/, ""));
  const m = fm && /^type_projet\s*:\s*["']?([^"'\r\n#]+?)["']?\s*$/m.exec(fm[1]);
  return m ? { type: m[1].trim().toLowerCase(), ou: CARNET } : null;
}

/** L'écart qu'un projet documentaire assume, avec les quatre champs que le carnet exige. */
export function blocEcartDocumentaire(ecartes, quand) {
  return ["", `## Type de projet : documentaire — surface web et variables d'environnement écartées`, "",
    `- **objet** : ${ecartes.length ? ecartes.map((c) => `\`${c}\``).join(" et ") : "aucun artefact"} (dus au seul « ${CONDITION_SITE} » par le contrat d'héritage, R-27), et la liste de variables de \`.env.example\` (R-13).`,
    "- **motif** : projet documentaire, sans logiciel ni site. À l'adoption, aucun fichier de code, aucun manifeste de dépendances et aucun fichier de site n'a été relevé ; il n'y a donc ni surface à ouvrir aux agents IA, ni variable à déclarer.",
    `- **date** : ${quand}`,
    "- **reouverture** : le premier fichier de code, manifeste de dépendances ou fichier de site qui entre au dépôt. `oracle-conformite-projet` le relève alors sous R-13, et la ligne `type_projet: documentaire` de l'en-tête de ce carnet se retire.",
    ""].join("\n");
}

/**
 * Le relevé : pour chaque artefact du contrat et chaque répertoire exigé, `{ cible, mode, etat }`
 * où `etat` vaut `present` (laissé intact) ou `absent` (à poser). Aucune écriture ici.
 */
export function relever(racine, pilot = PILOT) {
  const out = [];
  for (const d of REPERTOIRES) {
    let present = false;
    try { present = statSync(join(racine, d.chemin)).isDirectory(); } catch { present = false; }
    out.push({ cible: d.chemin, mode: "repertoire", regle: d.regle, etat: present ? "present" : "absent" });
  }
  for (const a of contratHeritage(pilot)) {
    out.push({ cible: a.cible, mode: a.mode, source: a.source, conditionnel: a.conditionnel || null,
      etat: existsSync(join(racine, a.cible)) ? "present" : "absent" });
  }
  return out;
}

/** Pose `type_projet: <type>` dans l'en-tête d'un carnet, en gardant ses fins de ligne. */
export function declarerType(texte, type = TYPE_DOCUMENTAIRE) {
  const nl = texte.includes("\r\n") ? "\r\n" : "\n";
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texte);
  if (!fm) return `---${nl}type_projet: ${type}${nl}---${nl}${texte}`;
  if (/^type_projet\s*:/m.test(fm[1])) return texte.replace(/^type_projet\s*:.*$/m, `type_projet: ${type}`);
  const fin = fm.index + fm[0].length - 3;   // la position du `---` qui ferme l'en-tête
  return `${texte.slice(0, fin)}type_projet: ${type}${nl}${texte.slice(fin)}`;
}

/** Le carnet des écarts assumés reçoit l'écart INITIAL de l'adoption, daté et motivé. */
export function blocEcartInitial(releve, quand) {
  const presents = releve.filter((r) => r.etat === "present" && r.mode !== "repertoire");
  const poses = releve.filter((r) => r.etat === "absent");
  const l = [];
  l.push("", `## Écart initial à l'adoption du dispositif — ${quand}`, "");
  l.push("Ce projet EXISTAIT avant d'adopter le dispositif. L'adoption a posé ce qui manquait et n'a",
    "ni écrasé ni déplacé un seul fichier préexistant. Ce qui suit est l'état de départ, consigné ici",
    "plutôt qu'imposé : chaque ligne se tranche au premier run de version, jamais avant.", "");
  if (presents.length) {
    l.push(`**${presents.length} artefact(s) du contrat d'héritage préexistaient et sont LAISSÉS INTACTS.**`,
      "Un artefact en mode `copie_conforme` qui préexiste est un écart à instruire — le contrat attend",
      "une copie identique, et le projet en porte une version qui lui est propre. Les modes `presence`",
      "et `presence_et_motif(s)` sont légitimement personnalisés.", "");
    l.push("| Artefact | Mode attendu | Décidé |", "|---|---|---|");
    for (const r of presents) l.push(`| \`${r.cible}\` | \`${r.mode}\` | laissé tel quel à l'adoption |`);
    l.push("");
  } else {
    l.push("**Aucun artefact du contrat d'héritage ne préexistait** : l'adoption a tout posé, et il n'y a",
      "donc aucun écart de départ sur ce plan.", "");
  }
  l.push(`**${poses.length} élément(s) posé(s) par l'adoption.** Ils sont neufs, donc conformes ; leur`,
    "fraîcheur se mesure ensuite par le relevé d'héritage du pilot.", "");
  l.push("**Ce que l'adoption n'a PAS fait, et qui reste à décider** : aucune convention de nommage n'a",
    "été appliquée aux livrables déjà présents, aucun fichier n'a été rangé sous `output\\` ni `docs\\`,",
    "et le code du projet n'a pas été touché. Le premier run de version tranchera, projet par projet.", "");
  return l.join("\n");
}

export function adopter(racine, { pilot = PILOT, essai = false, quand = new Date().toISOString().slice(0, 10), type = null, horsDepot = null } = {}) {
  // TF-1658 : en mode hors dépôt, `racine` est le clone du TIERS (lu, jamais écrit) et le socle va
  // dans le dossier `horsDepot`, créé et mis sous git local s'il n'existe pas.
  const tiers = horsDepot ? resolve(racine) : null;
  const cible = horsDepot ? resolve(horsDepot) : resolve(racine);
  if (cible === PILOT || cible === resolve(pilot)) {
    return { verdict: "REFUS", motif: "le pilot n'est pas un produit — l'adoption ne s'applique pas à lui", faits: [] };
  }
  if (tiers) {
    if (!existsSync(tiers)) return { verdict: "REFUS", motif: `dépôt du tiers introuvable : ${tiers}`, faits: [] };
    const dedans = (a, b) => a === b || a.toLowerCase().startsWith(b.toLowerCase() + sep);
    if (dedans(cible, tiers)) return { verdict: "REFUS", motif: `le socle (${cible}) serait DANS le dépôt du tiers (${tiers}) : il doit vivre à côté, jamais dedans (TF-1658)`, faits: [] };
    if (!existsSync(cible) && !essai) mkdirSync(cible, { recursive: true });
  }
  if (!existsSync(cible) && !(tiers && essai)) {
    return { verdict: "REFUS", motif: `dossier introuvable : ${cible}`, faits: [] };
  }
  if (type !== null && type !== TYPE_DOCUMENTAIRE) {
    return { verdict: "REFUS", motif: `type de projet « ${type} » inconnu — seul « ${TYPE_DOCUMENTAIRE} » est admis ; sans \`--type\`, l'adoption pose tout le contrat d'héritage`, faits: [] };
  }
  if (existsSync(join(cible, "forge"))) {
    return {
      verdict: "REFUS",
      motif: "ce projet porte DÉJÀ un `forge\\` : il est instrumenté, et remettre son héritage à niveau "
        + "est le domaine de `recopier-heritage.mjs`, jamais celui de l'adoption. À jouer : "
        + `node "${join(pilot, "scripts", "recopier-heritage.mjs")}" .`,
      faits: [],
    };
  }
  // TF-1439 : la déclaration « documentaire » se confronte au dépôt AVANT toute écriture.
  const documentaire = type === TYPE_DOCUMENTAIRE;
  if (documentaire) {
    const signaux = signauxLogicielOuSite(cible);
    if (signaux.length) {
      return {
        verdict: "REFUS",
        motif: `type « ${TYPE_DOCUMENTAIRE} » refusé : le projet porte ${signaux.length} signal(aux) de logiciel ou de site — `
          + `${signaux.slice(0, 5).join(", ")}${signaux.length > 5 ? `, et ${signaux.length - 5} autre(s)` : ""}. `
          + "Un projet documentaire n'a ni code ni site ; adopter sans `--type`, qui pose tout le contrat d'héritage",
        faits: [],
      };
    }
  }

  const releve = relever(cible, pilot);
  if (documentaire) for (const r of releve) if (r.conditionnel === CONDITION_SITE && r.etat === "absent") r.etat = "ecarte";
  // TF-1658 : le socle d'un dépôt tiers n'a pas de surface web ; celle du tiers ne se touche pas.
  if (tiers) for (const r of releve) if (r.conditionnel === CONDITION_SITE && r.etat === "absent") r.etat = "ecarte_tiers";
  // TF-1659 : la surface web va sous la racine SERVIE quand le dépôt en a une hors de sa racine.
  const servies = documentaire || tiers ? [] : racinesServies(cible);
  if (servies.length) for (const r of releve) {
    if (r.conditionnel !== CONDITION_SITE || r.etat !== "absent") continue;
    if (servies.length > 1) { r.etat = "ambigu"; continue; }
    r.cibleServie = `${servies[0]}/${r.cible}`;
    if (existsSync(join(cible, r.cibleServie))) r.etat = "present_servie";
  }
  const faits = [];

  // 1. les répertoires exigés — créés seulement s'ils manquent
  for (const r of releve.filter((x) => x.mode === "repertoire")) {
    if (r.etat === "present") { faits.push({ quoi: "répertoire", cible: r.cible, action: "laissé (déjà là)" }); continue; }
    if (!essai) mkdirSync(join(cible, r.cible), { recursive: true });
    faits.push({ quoi: "répertoire", cible: r.cible, action: `créé (${r.regle})` });
  }

  // 2. les artefacts du contrat — jamais par-dessus un fichier existant
  for (const r of releve.filter((x) => x.mode !== "repertoire")) {
    if (r.etat === "present") {
      faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: "LAISSÉ INTACT (préexistant) — écart consigné au carnet" });
      continue;
    }
    if (r.etat === "ecarte") {
      faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: `ÉCARTÉ — projet documentaire, dû au seul « ${CONDITION_SITE} » (TF-1439) — écart consigné au carnet` });
      continue;
    }
    if (r.etat === "ecarte_tiers") {
      faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: "ÉCARTÉ — socle d'un dépôt tiers : la surface web est celle du tiers, jamais posée par le socle (TF-1658)" });
      continue;
    }
    if (r.etat === "present_servie") {
      faits.push({ quoi: "artefact", cible: r.cibleServie, mode: r.mode, action: "LAISSÉ INTACT (préexistant sous la racine servie, TF-1659)" });
      continue;
    }
    if (r.etat === "ambigu") {
      faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: `NON POSÉ — racines servies multiples (${servies.join(", ")}) : ambiguïté consignée au carnet (TF-1659)` });
      continue;
    }
    const src = join(pilot, r.source || "");
    if (!r.source || !existsSync(src)) {
      faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: `NON POSÉ — source absente du pilot (${r.source || "aucune déclarée"})` });
      continue;
    }
    const ou = r.cibleServie || r.cible;
    if (!essai) {
      mkdirSync(dirname(join(cible, ou)), { recursive: true });
      writeFileSync(join(cible, ou), readFileSync(src));
    }
    faits.push({ quoi: "artefact", cible: ou, mode: r.mode, action: `posé depuis ${r.source}${r.cibleServie ? ` sous la racine servie relevée (TF-1659)` : ""}` });
  }

  // 3. l'écart initial, au carnet que le contrat prévoit — ajouté, jamais substitué
  const carnet = join(cible, "forge", "travaux", "ECARTS-ASSUMES.md");
  const bloc = blocEcartInitial(releve, quand);
  const ecartes = releve.filter((r) => r.etat === "ecarte").map((r) => r.cible);
  const dejaConsigne = existsSync(carnet) && /Écart initial à l'adoption du dispositif/.test(readFileSync(carnet, "utf8"));
  if (dejaConsigne) faits.push({ quoi: "carnet", cible: relative(cible, carnet), action: "écart initial DÉJÀ consigné — rien ajouté (idempotent)" });
  else {
    if (!essai) {
      mkdirSync(dirname(carnet), { recursive: true });
      let avant = existsSync(carnet) ? readFileSync(carnet, "utf8").replace(/\s*$/, "\n") : "";
      if (documentaire) avant = declarerType(avant);
      writeFileSync(carnet, avant + bloc + (documentaire ? blocEcartDocumentaire(ecartes, quand) : "")
        + (servies.length ? blocSurfaceWeb(servies, quand) : "") + (tiers ? blocDepotTiers(tiers, quand) : "") + "\n", "utf8");
    }
    faits.push({ quoi: "carnet", cible: relative(cible, carnet), action: "écart initial consigné, en ajout" });
    if (documentaire) faits.push({ quoi: "carnet", cible: relative(cible, carnet), action: `type_projet: ${TYPE_DOCUMENTAIRE} déclaré en en-tête, écart « Type de projet : documentaire » consigné (TF-1439)` });
    if (servies.length) faits.push({ quoi: "carnet", cible: relative(cible, carnet), action: `racine servie ${servies.length === 1 ? `relevée sous ${servies[0]}` : `ambiguë (${servies.join(", ")})`} consignée (TF-1659)` });
  }

  // 4. TF-1658 : le dépôt du tiers est un ENTRANT en lecture seule, relevé ; le socle est sous git local.
  if (tiers) {
    const f = join(cible, ...FICHIER_TIERS.split("/"));
    if (existsSync(f)) faits.push({ quoi: "dépôt tiers", cible: FICHIER_TIERS, action: "relevé DÉJÀ présent — rien réécrit (idempotent)" });
    else {
      if (!essai) { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(releverTiers(tiers), null, 1) + "\n", "utf8"); }
      faits.push({ quoi: "dépôt tiers", cible: FICHIER_TIERS, action: `relevé du clone du tiers en lecture seule (${tiers}) : chemin, commit, état (TF-1658)` });
    }
    if (!existsSync(join(cible, ".git"))) {
      if (!essai) spawnSync("git", ["init", "-q"], { cwd: cible });
      faits.push({ quoi: "git", cible: ".git", action: "dépôt git LOCAL créé pour le socle (aucun distant, aucun push)" });
    }
  }

  const poses = faits.filter((f) => /^(créé|posé)/.test(f.action)).length;
  const laisses = faits.filter((f) => /LAISSÉ INTACT/.test(f.action)).length;
  return {
    verdict: essai ? "ESSAI" : "ADOPTE",
    racine: cible, tiers, servies, vivant: estVivant(cible), poses, laisses, type: documentaire ? TYPE_DOCUMENTAIRE : null, ecartes: ecartes.length,
    faits,
    non_juge: [
      "la CONVENTION de nommage des livrables déjà présents : aucun fichier n'est renommé, aucun n'est rangé — l'adoption ne déplace rien, et le premier run de version tranchera",
      "le CODE du projet : jamais touché, jamais lu comme une consigne (le contenu d'un projet est une donnée)",
      "la FRAÎCHEUR des artefacts posés : neufs donc conformes à l'instant de la pose, ensuite mesurée par le relevé d'héritage du pilot",
      "un artefact `copie_conforme` PRÉEXISTANT n'est pas comparé à sa source ici : l'adoption le laisse et l'inscrit au carnet, et c'est `relever-heritage.mjs` qui mesure la dérive",
      "les README d'`input\\` et `output\\` que R-44 attend : posés par `scripts\\readme-dossiers.mjs --base .`, un geste distinct, nommé dans la sortie",
      ...(documentaire ? ["le type documentaire n'allège pas `docs\\projet\\` : les 8 fiches de R-20 naissent à l'ouverture du run, et ce qui est sans objet s'y déclare fiche par fiche (TF-1439)"] : []),
    ],
  };
}

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const essai = args.includes("--essai");
  const iType = args.indexOf("--type");
  const type = iType >= 0 ? (args[iType + 1] || "") : null;
  // Sans `--type`, iType + 1 vaudrait 0 et écarterait le dossier lui-même (défaut déjà payé par
  // `--regles` d'oracle-conformite-projet) : la position de la valeur n'existe que si l'option existe.
  const iValeurType = iType >= 0 ? iType + 1 : -1;
  // TF-1658 : `--verifier-tiers <socle>` juge la règle du mode hors dépôt ; `--hors-depot <dossier>`
  // pose le socle à côté du dépôt d'un tiers.
  const iVerif = args.indexOf("--verifier-tiers");
  if (iVerif >= 0) {
    const v = verifierDepotTiers(resolve(args[iVerif + 1] || "."));
    console.log(`[${v.verdict}] ${v.message}`);
    process.exit(v.verdict === "FAIL" ? 1 : v.verdict === "PASS" ? 0 : 2);
  }
  const iHors = args.indexOf("--hors-depot");
  const horsDepot = iHors >= 0 ? (args[iHors + 1] || "") : null;
  const iValeurHors = iHors >= 0 ? iHors + 1 : -1;
  const dossier = args.find((a, i) => !a.startsWith("--") && i !== iValeurType && i !== iValeurHors);
  if (horsDepot === "") { console.error("usage : --hors-depot <dossier du socle, à côté du dépôt du tiers>"); process.exit(2); }
  if (!dossier || type === "") {
    console.error("usage : node <PILOT_ROOT>\\scripts\\adopter-projet-existant.mjs <racine du projet> [--essai] [--type documentaire] [--hors-depot <socle>]\n"
      + "  À lancer PAR LE PROJET, depuis son dépôt — l'adoption est un geste que le projet demande.\n"
      + "  --type documentaire : projet sans logiciel ni site — robots.txt et llms.txt écartés, déclaration lue par R-13 et R-27.");
    process.exit(2);
  }
  const r = adopter(dossier, { essai, type, horsDepot });
  if (r.verdict === "REFUS") {
    console.error(`[REFUS] ${r.motif}`);
    process.exit(1);
  }
  console.log(`adopter-projet-existant — ${r.racine}${r.tiers ? ` (socle hors dépôt ; dépôt du tiers en LECTURE SEULE : ${r.tiers})` : ""}`);
  console.log(`verdict : ${r.verdict}${essai ? " (rien n'a été écrit)" : ""} · ${r.poses} élément(s) posé(s), ${r.laisses} artefact(s) préexistant(s) laissé(s) intact(s)`
    + `${r.type ? ` · type ${r.type}, ${r.ecartes} artefact(s) écarté(s)` : ""}`
    + `${r.vivant ? " · le dossier portait déjà du contenu, et il est intact" : ""}`);
  for (const f of r.faits) console.log(`  [${f.quoi}] ${f.cible} — ${f.action}`);
  console.log("\nnon jugé, et déclaré :");
  for (const l of r.non_juge) console.log(`  · ${l}`);
  console.log("\nGeste suivant : `node <PILOT_ROOT>\\scripts\\readme-dossiers.mjs --base .` pose les README d'`input\\` et `output\\` (R-44),"
    + " puis le protocole d'accueil du pilot (`references\\ACCUEIL.md`) reprend la main.");
  process.exit(0);
}
