#!/usr/bin/env node
/**
 * oracle-skills.mjs — les skills et hooks qui S'EXÉCUTENT sont-ils ceux que les dépôts VERSIONNENT ?
 *
 * Pourquoi il existe. Un skill vit en deux exemplaires : la source, versionnée dans une forge,
 * et la copie installée sous `~/.claude/skills/`, qui est celle que la session invoque
 * réellement. Rien ne les liait. Mesure du 15/08, en livrant la règle L14 : sur 20 skills
 * versionnés, **4 divergeaient et 5 n'étaient pas installés du tout**. Autrement dit, neuf
 * skills sur vingt n'étaient pas ce que le dépôt croyait livrer — dont `quality-oracles`, cité
 * comme loi transversale : la version qui s'exécutait n'était pas la version versionnée.
 *
 * C'est la maladie de R-35 d'un cran plus haut : non pas un contrôle que rien n'appelle, mais
 * un correctif livré qui n'atteint jamais l'endroit où il servirait. Une règle corrigée dans un
 * dépôt et absente de la copie installée n'a strictement aucun effet.
 *
 * Règles (binaires) :
 *   K1  tout skill versionné dans une forge est installé ;
 *   K2  la copie installée est IDENTIQUE à sa source (hors artefacts d'atelier et fins de ligne) ;
 *   K3  deux forges ne revendiquent pas le même nom de skill — sinon « la » source n'existe pas ;
 *   K4  un skill installé SANS source versionnée est DÉCLARÉ, jamais mis en échec : il
 *       appartient à l'humain, l'oracle n'a pas à en juger ;
 *   K5  une copie installée EN AVANCE sur sa source (version déclarée plus haute) interdit
 *       l'application : c'est le dépôt qui est en retard, pas la copie.
 *   K6  même contrat pour les HOOKS (`<forge>\.claude\hooks\` → `~\.claude\hooks\`) : divergence
 *       en échec, hook installé sans source versionnée déclaré et non jugé (comme K4), copie en
 *       avance protégée (comme K5).
 *   K7  le CÂBLAGE d'un hook versionné — déclaré, JAMAIS en échec : `<forge>\.claude\settings.json`
 *       dit ce que la forge attend, `~\.claude\settings.json` dit ce qui s'exécute vraiment ;
 *       l'écart est nommé avec la commande qui le poserait.
 *
 * K6 (TF-0290). Le gate C7 `qo-gate-write.mjs` — celui qui bloque l'écriture de TOUT livrable,
 * cinq blocages réels dans la seule journée du 15/08 — ne vivait qu'en copie installée : aucune
 * forge ne le versionnait, donc aucune correction n'était traçable ni rejouable, et un effacement
 * de `~\.claude` l'aurait détruit en silence. Le trou était invisible PAR CONSTRUCTION : K1-K5 ne
 * regardent que les skills. Un hook est un fichier, pas un dossier : K6 compare fichier à fichier.
 *
 * K7 (TF-0297). K6 juge l'INTÉGRITÉ d'un hook installé, pas son CÂBLAGE : un hook sain, copie
 * conforme à sa source, mais qu'aucun `settings.json` ne référence ne s'exécute JAMAIS. C'est la
 * loi transverse n°1 appliquée aux hooks — toute affordance est câblée ou n'existe pas. État réel
 * du poste au 17/08, découvert en livrant K6 : ce même `qo-gate-write.mjs` est désormais versionné
 * chez forge-agents, mais ni installé ni câblé — et rien ne le disait. K7 confronte les deux
 * câblages, celui que les forges DÉCRIVENT et celui qui S'EXÉCUTE, et rend l'écart lisible.
 *
 * Pourquoi K7 est DÉCLARATIF et jamais FAIL. Cet oracle se joue à l'ouverture de TOUT run (R-35) :
 * un FAIL y suspend l'ouverture. Or l'état actuel — C7 versionné, non câblé — est une décision
 * humaine PENDANTE : câbler un hook engage toutes les sessions du poste (R-29, dépenses et gates
 * restent humains). Un K7 bloquant briquerait donc toutes les ouvertures de run tant que cette
 * décision n'est pas prise, et un gate qu'on apprend à contourner ne protège plus rien (précédent
 * R-33 bis). K7 rend PASS avec ses constats en clair, et `non_juge` dit pourquoi il ne bloque pas.
 * Le passage de K7 en bloquant sera une décision humaine, pas une décision d'oracle.
 *
 * Ce que K7 ne touche pas. `--appliquer` n'écrit JAMAIS dans le `settings.json` installé : poser un
 * câblage est un acte humain. Et le settings installé PORTE des entrées personnelles (hooks de
 * tableau de bord, réglages) : elles ne sont ni jugées, ni listées, ni comptées — même prudence que
 * K4. Seul le câblage ATTENDU par les forges est confronté.
 *
 * Ce qui est EXCLU du diff (TF-0289), et déclaré comme tel au verdict : les sidecars d'oracles
 * (`*.oracles*.json[l]`, convention TF-0065 « hors dépôt ») et les artefacts d'atelier. Mesure du
 * 15/08 : K2 annonçait « 8 fichier(s) » chez experts-forge dont 2 vrais, « 12 » chez
 * ameliore-le-design dont 8 vrais — et le message tronquait à 4, donc le vrai défaut pouvait ne
 * pas être affiché du tout. Un contrôle qui noie sa trouvaille dans son propre bruit ne trouve
 * rien : les divergences de CONTENU sont désormais listées ENTIÈREMENT, en tête.
 *
 * Ce qu'il ne juge PAS : le contenu d'un skill, sa qualité, son opportunité. Et il ne peut pas
 * EMPÊCHER une édition de la copie installée — il la voit au run suivant, il ne la verrouille
 * pas. Un verrou réel demanderait un lien symbolique, écarté le 15/08 : 20 sources dans 3
 * dépôts vers un seul dossier, des jonctions qui cassent au premier déplacement de dépôt.
 *
 * Usage : node oracle-skills.mjs [--racine <dossier des forges>] [--installes <dossier>]
 *                               [--installes-hooks <dossier>] [--settings-installe <fichier>]
 *         node oracle-skills.mjs --appliquer   # copie source → installé (K1, K2 et K6)
 *         node oracle-skills.mjs --purger      # orphelins de la copie → quarantaine datée (K2)
 *         node oracle-skills.mjs --self-test
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 *
 * --purger (TF-0254). `--appliquer` copie la source VERS la copie installée, il ne touche
 * jamais à ce que la copie contient EN PLUS (sauvegardes `.avant-*`, lockfiles générés à
 * l'usage, fixtures locales d'un run) : 11 orphelins constatés sur 3 skills après application,
 * K2 restait FAIL. `--purger` déplace ces orphelins sous `<installes>\.quarantaine\<horodatage>\
 * <skill>\` — un déplacement, jamais une suppression sèche — et le liste au verdict (`purge`).
 */
import {
  existsSync, readFileSync, readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync,
  mkdtempSync, renameSync,
} from "node:fs";
import { basename, dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, tmpdir } from "node:os";

const VERSION = "1.2.0"; // 1.2.0 : K7 (câblage des hooks, déclaratif — TF-0297)
const ORACLE = "oracle-skills";
const ICI = dirname(fileURLToPath(import.meta.url));

// Artefacts d'atelier : produits par l'exécution, jamais par l'auteur. Les comparer ferait
// diverger deux copies identiques dès qu'on a joué un oracle d'un côté.
const IGNORES = new Set(["__pycache__", ".oracles", ".pytest_cache", "node_modules", ".venv"]);
// Sauvegardes laissées à côté d'un fichier édité (`SKILL.md.bak-20260407`). Elles n'ont rien à
// faire dans un dépôt et ne sont pas non plus un défaut de la copie : on ne les compare pas, et
// surtout on ne les EFFACE pas — c'est un fichier de l'humain, pas un artefact de la forge.
const IGNORE_MOTIF = /\.bak(?:[-.]\w+)?$/i;
// Sidecars d'oracles (TF-0289). Le hook C7 dépose à côté de chaque fichier jugé son cache, son
// journal et son historique — `SKILL.md.oracles.json`, `.oracles-cache.json`,
// `_oracles-journal-historique.jsonl`. Convention TF-0065 : ils vivent HORS dépôt, sont
// régénérables, et ne sont jamais exécutés. Les comparer faisait diverger deux copies identiques
// dès qu'un oracle avait tourné d'un seul côté : 6 des 8 « divergences » annoncées chez
// experts-forge le 15/08. Le séparateur autorisé devant `oracles` est `.` ou `_`, JAMAIS `-` :
// `references/registre-oracles.json` est un référentiel versionné, pas un sidecar, et une
// divergence dessus doit rester un échec (fixture rouge dédiée).
const SIDECAR_ORACLES = /[._]oracles[\w-]*\.jsonl?$/i;
// Ce que le diff écarte, en une phrase — reprise TELLE QUELLE dans le verdict : une exclusion
// muette est un mensonge par omission, l'oracle doit dire ce qu'il ne regarde pas.
const LIBELLE_EXCLUS = "hors sidecars d'oracles (*.oracles*.json[l], convention TF-0065) et artefacts d'atelier (__pycache__, .venv, node_modules, .pytest_cache, .bak) : gitignorés, régénérables, jamais exécutés";
// Deux conventions de chemin coexistent : forge-agents publie sous `.claude/skills/`,
// conception et design sous `skills/`. Les deux sont lues — imposer l'une des deux serait un
// autre chantier, et l'oracle n'a pas à trancher une convention pour pouvoir mesurer.
const SOUS_CHEMINS = [join(".claude", "skills"), "skills"];
// Les hooks n'ont qu'une convention : `<forge>\.claude\hooks\`, à côté du `settings.json` qui les
// câble. Une seule est lue — inventer la seconde avant qu'elle existe serait deviner.
const SOUS_CHEMIN_HOOKS = join(".claude", "hooks");
// Le câblage d'un hook (K7) : `<forge>\.claude\settings.json` versionné dit ce que la forge
// ATTEND, `~\.claude\settings.json` dit ce qui s'exécute. Même dossier que les hooks, à côté
// d'eux — c'est le fichier que le harnais lit, pas une convention inventée ici.
const SOUS_CHEMIN_SETTINGS = join(".claude", "settings.json");
// Une commande de hook peut faire 2 Ko (une ligne de shell avec du Python embarqué). Le NOM du
// hook est la trouvaille, la commande n'est qu'un indice de recopie : elle se résume.
const PLAFOND_COMMANDE = 160;

const NON_JUGE = [
  "le CONTENU d'un skill, sa qualité, son opportunité — cet oracle compare deux copies, il ne lit pas",
  "les skills personnels de l'humain (sans source versionnée) : déclarés par K4, jamais jugés",
  "les hooks installés sans source versionnée : déclarés par K6, jamais jugés (même contrat que K4)",
  `les sidecars d'oracles et les artefacts d'atelier : le diff de K2 et K6 est calculé ${LIBELLE_EXCLUS} (TF-0289)`,
  "un hook sans version déclarée ne peut pas bénéficier de la protection « en avance » : la comparaison de versions demande qu'elle soit écrite des DEUX côtés (même limite que K5 pour un skill sans frontmatter)",
  "une édition FUTURE de la copie installée — l'oracle la verra au run suivant, il ne la verrouille pas",
  "le CÂBLAGE des hooks (K7) est DÉCLARÉ, jamais mis en échec : cet oracle s'ouvre à tout run (R-35) et un FAIL y suspend l'ouverture, alors que câbler un hook engage toutes les sessions du poste — c'est une décision humaine (R-29). Bloquer sur une décision pendante briquerait toutes les ouvertures, et un gate qu'on apprend à contourner ne protège plus rien (R-33 bis). Le passage de K7 en bloquant est une décision humaine, pas une décision d'oracle",
  "les entrées PERSONNELLES du `settings.json` installé (tableau de bord, réglages, hooks de l'humain) : ni jugées, ni listées, ni comptées — seul le câblage attendu par les forges est confronté (même prudence que K4)",
  "un câblage versionné qui référence un script HORS `<forge>\\.claude\\hooks\\` (ex. `.queue/gates/*.sh`) : il est de portée PROJET, chargé par le harnais quand la session s'ouvre dans ce dépôt, le settings utilisateur n'a pas à le porter — K7 ne confronte que les hooks dont une forge versionne le fichier",
  "K7 confronte sur le NOM du fichier de hook, pas sur le chemin complet : la copie installée vit ailleurs que sa source, comparer les chemins ne dirait rien. Conséquence assumée et déclarée : deux scripts homonymes dans deux arborescences se confondraient — un constat de trop, jamais un blocage",
  "`--appliquer` n'écrit JAMAIS dans le `settings.json` installé : il pose le FICHIER d'un hook (K6), il ne le câble pas",
];

function racineForges() {
  return process.env.FORGE_ROOT || resolve(ICI, "..", "..");
}

function listeSkills(dossier) {
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dossier, d.name, "SKILL.md")))
    .map((d) => d.name);
}

/** Toutes les sources versionnées : nom -> [chemins], pour que K3 puisse voir un doublon. */
function sources(racine) {
  const par_nom = new Map();
  if (!existsSync(racine)) return par_nom;
  for (const depot of readdirSync(racine, { withFileTypes: true })) {
    if (!depot.isDirectory() || !depot.name.startsWith("digit-ai-forge-")) continue;
    for (const sous of SOUS_CHEMINS) {
      const base = join(racine, depot.name, sous);
      for (const nom of listeSkills(base)) {
        if (!par_nom.has(nom)) par_nom.set(nom, []);
        par_nom.get(nom).push(join(base, nom));
      }
    }
  }
  return par_nom;
}

/** Toutes les sources de hooks versionnées : chemin relatif au dossier de hooks -> [chemins].
 *  Un hook est un FICHIER (`qo-gate-write.mjs`), pas un dossier : la clé est son chemin relatif,
 *  ce qui couvre aussi un éventuel sous-dossier sans avoir à le prévoir. */
function sourcesHooks(racine) {
  const par_nom = new Map();
  if (!existsSync(racine)) return par_nom;
  for (const depot of readdirSync(racine, { withFileTypes: true })) {
    if (!depot.isDirectory() || !depot.name.startsWith("digit-ai-forge-")) continue;
    const base = join(racine, depot.name, SOUS_CHEMIN_HOOKS);
    if (!existsSync(base)) continue;
    for (const rel of fichiers(base)) {
      if (!par_nom.has(rel)) par_nom.set(rel, []);
      par_nom.get(rel).push(join(base, rel));
    }
  }
  return par_nom;
}

/** Version déclarée dans un texte : frontmatter `version: "1.2.3"` d'un SKILL.md, ou
 *  `const VERSION = "1.2.3"` d'un script de hook. Rien d'autre — un « v1.2 » en prose n'est pas
 *  une déclaration, et deviner ferait de K5/K6 un garde-fou qui se déclenche au hasard. */
function versionDeclaree(texte) {
  const m = texte.match(
    /^\s*(?:\/\/\s*|#\s*|\*\s*)?(?:(?:export\s+)?(?:const|let|var)\s+)?version\s*[:=]\s*["']?v?([\d]+(?:\.[\d]+)*)/im);
  return m ? m[1] : null;
}

/** Version déclarée en frontmatter du SKILL.md, si elle existe. */
function version(dossier) {
  const f = join(dossier, "SKILL.md");
  if (!existsSync(f)) return null;
  return versionDeclaree(readFileSync(f, "utf8"));
}

/** Version déclarée dans un fichier de hook, si elle existe. */
function versionFichier(f) {
  return existsSync(f) ? versionDeclaree(readFileSync(f, "utf8")) : null;
}

/** -1, 0, 1 — comparaison numérique segment par segment (« 2.10.0 » > « 2.9.0 »). */
function comparerVersions(a, b) {
  const xa = a.split(".").map(Number), xb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(xa.length, xb.length); i += 1) {
    const d = (xa[i] || 0) - (xb[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

function fichiers(dossier, prefixe = "") {
  const out = [];
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    if (IGNORES.has(e.name) || IGNORE_MOTIF.test(e.name) || SIDECAR_ORACLES.test(e.name)) continue;
    const rel = prefixe ? `${prefixe}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...fichiers(join(dossier, e.name), rel));
    else out.push(rel);
  }
  return out.sort();
}

/** Identiques ? Les fins de ligne ne comptent pas : git les normalise, l'auteur n'y est pour rien. */
function memeContenu(a, b) {
  const x = readFileSync(a);
  const y = readFileSync(b);
  if (x.equals(y)) return true;
  const texte = (buf) => buf.toString("utf8").replace(/\r\n/g, "\n");
  return texte(x) === texte(y);
}

/** Écarts structurés : manquants (à copier), divergents (contenu différent), orphelins (en
 *  trop dans la copie — ni versionnés, ni à copier, à purger). */
function analyserEcarts(src, dst) {
  const fs_src = fichiers(src);
  const fs_dst = existsSync(dst) ? fichiers(dst) : [];
  const set_dst = new Set(fs_dst);
  const set_src = new Set(fs_src);
  const manquants = [];
  const divergents = [];
  for (const f of fs_src) {
    if (!set_dst.has(f)) { manquants.push(f); continue; }
    if (!memeContenu(join(src, f), join(dst, f))) divergents.push(f);
  }
  const orphelins = fs_dst.filter((f) => !set_src.has(f));
  return { manquants, divergents, orphelins };
}

/** Écart RACONTÉ (TF-0289) : combien, de quelle nature, et lesquels.
 *
 *  L'ancienne forme concaténait les trois natures puis tronquait à 4 — donc quand un skill portait
 *  6 fichiers absents et 2 vraies divergences de contenu, le message affichait 4 absents et
 *  passait les deux divergences sous silence. Le défaut que K2 existe pour trouver était le seul
 *  à ne pas être montré. Les divergences de CONTENU passent donc en tête et ne sont JAMAIS
 *  tronquées ; les manquants et les orphelins, qui se résument par un compte, sont plafonnés.
 */
const PLAFOND_LISTE = 4;
function decrireEcart({ manquants, divergents, orphelins }) {
  const total = manquants.length + divergents.length + orphelins.length;
  const borner = (liste, suffixe) => (liste.length > PLAFOND_LISTE
    ? [...liste.slice(0, PLAFOND_LISTE).map((f) => `${f} ${suffixe}`), `et ${liste.length - PLAFOND_LISTE} autre(s) ${suffixe}`]
    : liste.map((f) => `${f} ${suffixe}`));
  const nature = [
    divergents.length ? `${divergents.length} divergence(s) de contenu` : null,
    manquants.length ? `${manquants.length} absent(s) de la copie` : null,
    orphelins.length ? `${orphelins.length} en trop dans la copie` : null,
  ].filter(Boolean).join(", ");
  return {
    total,
    nature,
    liste: [
      ...divergents, // jamais tronqués : c'est la trouvaille
      ...borner(manquants, "(absent de la copie)"),
      ...borner(orphelins, "(en trop dans la copie)"),
    ].join(", "),
  };
}

function copier(src, dst) {
  for (const f of fichiers(src)) {
    const cible = join(dst, f);
    mkdirSync(dirname(cible), { recursive: true });
    copyFileSync(join(src, f), cible);
  }
}

/** Horodatage de quarantaine — à la seconde, pour que deux purges le même jour ne collisionnent
 *  pas. Jamais devinée : lue sur l'horloge au moment de l'appel. */
function horodatageQuarantaine() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

/** Déplace (jamais ne supprime) les fichiers orphelins de `dst` sous une quarantaine datée. */
function purgerOrphelins(dst, nom, orphelins, racineQuarantaine, horodatage) {
  const deplaces = [];
  for (const f of orphelins) {
    const source = join(dst, f);
    const cible = join(racineQuarantaine, horodatage, nom, f);
    mkdirSync(dirname(cible), { recursive: true });
    renameSync(source, cible);
    deplaces.push(f);
  }
  return deplaces;
}

/** K6 (TF-0290) — les HOOKS installés sont-ils ceux que les forges versionnent ?
 *
 *  Même contrat que K1/K2/K4/K5 pour les skills, transposé au fichier : divergence en échec en
 *  disant QUEL fichier et QUELLE copie s'exécute, copie en avance protégée, hook installé sans
 *  source versionnée déclaré et non jugé (il appartient à l'humain), hook versionné non installé
 *  déclaré aussi — installer un hook est un acte humain, `--appliquer` le pose sur demande.
 *  Pas de purge ici : un fichier installé sans source n'est pas un orphelin d'un dossier de
 *  skill, c'est peut-être le hook personnel de l'humain. On ne déplace pas ce qu'on ne juge pas.
 *  Écrit dans `findings` et `applique` du jugement principal.
 */
function jugerHooks(racine, installes, appliquer, findings, applique) {
  const par_nom = sourcesHooks(racine);
  const poses = existsSync(installes) ? fichiers(installes) : [];
  const set_poses = new Set(poses);
  const personnels = poses.filter((rel) => !par_nom.has(rel));
  const absents = [];
  let compares = 0;
  let echec = false;

  for (const [rel, chemins] of [...par_nom].sort()) {
    const src = chemins[0];
    const dst = join(installes, rel);
    if (chemins.length > 1) {
      // Même raison que K3 : sans source unique, il n'y a rien à comparer et surtout rien à
      // appliquer — `--appliquer` prendrait la première venue, c'est-à-dire arbitrerait en
      // silence un conflit entre deux forges.
      echec = true;
      findings.push({
        regle: "K6", statut: "FAIL", ou: rel,
        message: `hook revendiqué par ${chemins.length} sources (${chemins.map((c) => relative(racine, c)).join(", ")}) — « la » source n'existe pas, la copie installée ne peut pas être arbitrée`,
      });
      continue;
    }
    if (!set_poses.has(rel)) {
      if (appliquer) {
        mkdirSync(dirname(dst), { recursive: true });
        copyFileSync(src, dst);
        applique.push(`hook ${rel} (installé)`);
        continue;
      }
      absents.push(`${rel} (source : ${relative(racine, src)})`);
      continue;
    }
    compares += 1;
    if (memeContenu(src, dst)) continue;
    // Protection K5 transposée : une copie installée qui déclare une version PLUS HAUTE est en
    // avance, et l'écraser détruirait du travail au nom de la synchronisation.
    const vs = versionFichier(src), vd = versionFichier(dst);
    if (vs && vd && comparerVersions(vd, vs) > 0) {
      echec = true;
      findings.push({
        regle: "K6", statut: "FAIL", ou: rel,
        message: `la copie installée du hook est EN AVANCE (${vd} > ${vs}) — protection K5 : \`--appliquer\` refuse d'écraser une version par une plus ancienne, c'est la SOURCE qui doit être mise à jour d'abord`,
      });
      continue;
    }
    if (appliquer) { copyFileSync(src, dst); applique.push(`hook ${rel} (remis à niveau)`); continue; }
    echec = true;
    findings.push({
      regle: "K6", statut: "FAIL", ou: rel,
      message: `la copie installée ${join(installes, rel)} DIVERGE de sa source ${relative(racine, src)} — c'est la COPIE INSTALLÉE qui s'exécute à chaque outil, la version versionnée n'a aucun effet (\`--appliquer\` pour la remettre à niveau) · diff calculé ${LIBELLE_EXCLUS}`,
    });
  }

  // Déclarations — toujours émises, échec ou pas : ce qui n'est pas jugé doit être DIT, sinon
  // l'absence de verdict se lit comme une absence de sujet (c'est ainsi que le gate C7 est resté
  // invisible jusqu'au 15/08).
  const declarations = [];
  if (compares) declarations.push(`${compares} hook(s) installé(s) comparé(s) à leur source versionnée`);
  else declarations.push(`aucun hook installé sous ${installes} — rien à comparer`);
  if (personnels.length) declarations.push(`${personnels.length} hook(s) installé(s) sans source versionnée, déclarés et non jugés : ${personnels.join(", ")}`);
  if (absents.length) declarations.push(`${absents.length} hook(s) versionné(s) NON installé(s), déclarés — poser un hook est un acte humain (\`--appliquer\` l'installe) : ${absents.join(", ")}`);
  findings.push({
    regle: "K6", statut: "PASS", ou: "(déclarations)",
    message: echec
      ? `${declarations.join(" · ")} — voir les échecs K6 ci-dessus pour les divergences`
      : `${declarations.join(" · ")} — aucune divergence`,
  });
}

/** Les entrées de hook d'un `settings.json` — `{ erreur }` si le fichier manque ou ne se lit pas.
 *
 *  Forme lue (celle du harnais) : `hooks: { <Événement>: [ { matcher?, hooks: [ { command } ] } ] }`.
 *  Tout est défensif : un settings.json est un fichier que l'humain édite à la main, et un oracle
 *  qui plante sur une virgule en trop ne dit plus rien du tout — il déclare, il ne casse pas.
 */
function lireCablages(fichier) {
  if (!fichier || !existsSync(fichier)) return { erreur: `absent (${fichier})` };
  let brut;
  try { brut = JSON.parse(readFileSync(fichier, "utf8")); }
  catch (e) { return { erreur: `illisible (${e.message})` }; }
  const entrees = [];
  const hooks = brut && typeof brut === "object" ? brut.hooks : null;
  if (hooks && typeof hooks === "object") {
    for (const [evenement, groupes] of Object.entries(hooks)) {
      for (const groupe of Array.isArray(groupes) ? groupes : []) {
        const matcher = groupe && typeof groupe.matcher === "string" ? groupe.matcher : null;
        for (const h of Array.isArray(groupe?.hooks) ? groupe.hooks : []) {
          if (h && typeof h.command === "string") entrees.push({ evenement, matcher, commande: h.command });
        }
      }
    }
  }
  return { entrees };
}

/** Le câblage ATTENDU par les forges : toutes les entrées des `settings.json` versionnés. */
function cablagesVersionnes(racine) {
  const entrees = [];
  const illisibles = [];
  if (!existsSync(racine)) return { entrees, illisibles };
  for (const depot of readdirSync(racine, { withFileTypes: true })) {
    if (!depot.isDirectory() || !depot.name.startsWith("digit-ai-forge-")) continue;
    const f = join(racine, depot.name, SOUS_CHEMIN_SETTINGS);
    if (!existsSync(f)) continue;
    const lu = lireCablages(f);
    if (lu.erreur) { illisibles.push(`${depot.name} : ${lu.erreur}`); continue; }
    for (const e of lu.entrees) entrees.push({ ...e, forge: depot.name });
  }
  return { entrees, illisibles };
}

function resumerCommande(commande) {
  const plat = commande.replace(/\s+/g, " ").trim();
  return plat.length > PLAFOND_COMMANDE ? `${plat.slice(0, PLAFOND_COMMANDE)}…` : plat;
}

/** K7 (TF-0297) — un hook versionné est-il CÂBLÉ ?
 *
 *  K6 compare deux copies d'un fichier ; K7 compare deux CÂBLAGES. Un hook dont la copie installée
 *  est parfaite mais qu'aucun `settings.json` ne référence ne s'exécute jamais : c'est un gate mort
 *  qui se lit comme un gate sain (loi transverse n°1).
 *
 *  DÉCLARATIF PAR CONSTRUCTION : ce jugement n'émet que des findings PASS. Voir `non_juge` pour la
 *  raison de gouvernance (R-35, R-29, R-33 bis). N'écrit jamais dans le settings installé, même
 *  sous `--appliquer` : câbler est un acte humain.
 */
function jugerCablage(racine, fichierSettings, appliquer, findings) {
  const hooks = sourcesHooks(racine);
  const attendus = cablagesVersionnes(racine);
  const installe = lireCablages(fichierSettings);
  const declarations = [];
  if (attendus.illisibles.length) {
    declarations.push(`${attendus.illisibles.length} settings.json versionné(s) non exploitable(s), déclarés : ${attendus.illisibles.join(" ; ")}`);
  }

  if (hooks.size === 0) {
    declarations.push(`aucun hook versionné sous ${racine} — aucun câblage à confronter`);
  } else {
    // Confrontation par NOM de fichier : la source vit dans une forge, la copie installée ailleurs.
    const manquants = [], nulle_part = [], hors_source = [];
    let cables = 0;
    for (const [rel, chemins] of [...hooks].sort()) {
      const nom = basename(rel);
      const decl = attendus.entrees.filter((e) => e.commande.includes(nom));
      const pose = (installe.entrees || []).filter((e) => e.commande.includes(nom));
      if (decl.length && installe.erreur) continue; // confrontation non concluante, dite plus bas
      if (decl.length && pose.length) { cables += 1; continue; }
      if (decl.length) {
        const d = decl[0];
        const ou = [d.evenement, d.matcher ? `matcher « ${d.matcher} »` : null].filter(Boolean).join(", ");
        manquants.push(`${nom} — attendu par ${d.forge} (settings versionné : ${ou}) commande « ${resumerCommande(d.commande)} », ABSENT du câblage installé : reporter cette entrée dans ${fichierSettings}`);
        continue;
      }
      if (pose.length) {
        hors_source.push(`${nom} (source : ${relative(racine, chemins[0])})`);
        continue;
      }
      if (!installe.erreur) nulle_part.push(`${nom} (source : ${relative(racine, chemins[0])})`);
    }
    if (installe.erreur) {
      declarations.push(`câblage installé ${installe.erreur} — la confrontation n'est pas concluante : ${hooks.size} hook(s) versionné(s) ne peuvent être ni confirmés câblés ni déclarés non câblés`);
    } else {
      if (cables) declarations.push(`${cables} hook(s) versionné(s) attendu(s) par une forge ET câblé(s) dans le settings installé`);
      if (manquants.length) declarations.push(`${manquants.length} CÂBLAGE(S) MANQUANT(S) — le hook est versionné et attendu, mais rien ne l'exécute (loi transverse n°1) : ${manquants.join(" ; ")}`);
      if (nulle_part.length) declarations.push(`${nulle_part.length} hook(s) versionné(s) dont le câblage n'est décrit NULLE PART — ni dans un settings.json versionné, ni dans le câblage installé : ${nulle_part.join(", ")} — un gate versionné que rien n'appelle ne s'exécute jamais (décrire l'entrée attendue dans le settings.json versionné de sa forge la rendrait recâblable)`);
      if (hors_source.length) declarations.push(`${hors_source.length} hook(s) câblé(s) dans le settings installé sans qu'aucun settings.json versionné le décrive — le câblage existe mais n'est pas reproductible depuis les dépôts : ${hors_source.join(", ")}`);
      if (!cables && !manquants.length && !nulle_part.length && !hors_source.length) {
        declarations.push(`${hooks.size} hook(s) versionné(s), aucun écart de câblage`);
      }
    }
  }
  declarations.push("le câblage personnel de l'humain n'est ni listé ni compté (même prudence que K4)");
  if (appliquer) declarations.push(`\`--appliquer\` n'a PAS touché ${fichierSettings} : câbler un hook est un acte humain (R-29)`);
  findings.push({
    regle: "K7", statut: "PASS", ou: "(déclarations)",
    message: `${declarations.join(" · ")} — K7 DÉCLARE, il ne met jamais en échec (voir non_juge)`,
  });
}

function juger(racine, installes, appliquer = false, purger = false,
               installesHooks = join(dirname(installes), "hooks"),
               settingsInstalle = join(dirname(installes), "settings.json")) {
  const findings = [];
  const par_nom = sources(racine);
  if (par_nom.size === 0) {
    // Ni skills, ni hooks : sans forge sous cette racine il n'y a rien à comparer, et le dire
    // vaut mieux que de rendre un PASS sur K6 seul — un non-jugement muet se lit comme un vert.
    return {
      verdict: "SKIP", findings,
      motif: `aucune source de skill sous ${racine} — les hooks et leur câblage ne sont pas jugés non plus (K6 et K7 sans racine de forges n'ont rien à comparer)`,
    };
  }
  const applique = [];
  const purge = [];
  const racineQuarantaine = join(installes, ".quarantaine");
  const horodatage = horodatageQuarantaine();

  // K3 d'abord : sans source unique, K1 et K2 n'ont pas de sens pour ce nom.
  const ambigus = new Set();
  for (const [nom, chemins] of par_nom) {
    if (chemins.length > 1) {
      ambigus.add(nom);
      findings.push({
        regle: "K3", statut: "FAIL", ou: nom,
        message: `revendiqué par ${chemins.length} sources (${chemins.map((c) => relative(racine, c)).join(", ")}) — « la » source n'existe pas, la copie installée ne peut pas être arbitrée`,
      });
    }
  }

  for (const [nom, chemins] of [...par_nom].sort()) {
    if (ambigus.has(nom)) continue;
    const src = chemins[0];
    const dst = join(installes, nom);
    if (!existsSync(dst)) {
      if (appliquer) { copier(src, dst); applique.push(`${nom} (installé)`); continue; }
      findings.push({
        regle: "K1", statut: "FAIL", ou: nom,
        message: `versionné dans ${relative(racine, src)} mais JAMAIS installé — la session ne peut pas l'invoquer (\`--appliquer\` pour l'installer)`,
      });
      continue;
    }
    let { manquants, divergents, orphelins } = analyserEcarts(src, dst);

    // --purger : les orphelins ne sont ni copiés par --appliquer ni un défaut de contenu — ce
    // sont des fichiers que la copie installée porte EN PLUS (sauvegarde, lockfile, fixture
    // locale). On les déplace, jamais on ne les efface, et ils sortent du calcul de l'écart.
    if (purger && orphelins.length) {
      const deplaces = purgerOrphelins(dst, nom, orphelins, racineQuarantaine, horodatage);
      purge.push(`${nom} : ${deplaces.length} orphelin(s) mis en quarantaine sous ${relative(installes, join(racineQuarantaine, horodatage, nom))} (${deplaces.join(", ")})`);
      orphelins = [];
    }

    const diff = decrireEcart({ manquants, divergents, orphelins });
    if (diff.total) {
      // K5 — GARDE-FOU, et il a servi le jour même de son écriture. `prompt-analyzer-l99`
      // installé était en 2.2.0 quand la source du dépôt en était à 2.1.0 : un
      // `--appliquer` naïf aurait ÉCRASÉ une version par une plus ancienne, c'est-à-dire
      // détruit du travail au nom de la synchronisation. La copie installée n'est pas
      // toujours la copie en retard, et l'oracle ne doit jamais le présumer.
      const vs = version(src), vd = version(dst);
      if (vs && vd && comparerVersions(vd, vs) > 0) {
        findings.push({
          regle: "K5", statut: "FAIL", ou: nom,
          message: `la copie installée est EN AVANCE (${vd} > ${vs}) — c'est le DÉPÔT qui est en retard ; \`--appliquer\` refuse d'écraser une version par une plus ancienne, la source doit être mise à jour d'abord`,
        });
        continue;
      }
      if (appliquer) { copier(src, dst); applique.push(`${nom} (${diff.total} fichier(s) remis à niveau)`); continue; }
      findings.push({
        regle: "K2", statut: "FAIL", ou: nom,
        message: `la copie installée DIVERGE de ${relative(racine, src)} sur ${diff.total} fichier(s) — ${diff.nature} : ${diff.liste} — c'est la copie qui s'exécute · diff calculé ${LIBELLE_EXCLUS}`,
      });
    }
  }

  // K6 : les hooks, même contrat que les skills (TF-0290).
  jugerHooks(racine, installesHooks, appliquer, findings, applique);
  // K7 : leur CÂBLAGE — déclaré, jamais en échec (TF-0297).
  jugerCablage(racine, settingsInstalle, appliquer, findings);

  // K4 : ce qui est installé sans source versionnée appartient à l'humain. Déclaré, pas jugé.
  const personnels = listeSkills(installes).filter((n) => !par_nom.has(n));

  const vues = new Set(findings.map((f) => f.regle));
  const total = par_nom.size;
  for (const [regle, message] of [
    ["K1", `${total} skill(s) versionné(s), tous installés`],
    ["K2", `chaque copie installée est identique à sa source (${LIBELLE_EXCLUS})`],
    ["K3", "aucun nom de skill revendiqué par deux forges"],
    ["K5", "aucune copie installée en avance sur sa source"],
  ]) if (!vues.has(regle)) findings.push({ regle, statut: "PASS", message });
  findings.push({
    regle: "K4", statut: "PASS",
    message: personnels.length
      ? `${personnels.length} skill(s) personnel(s) sans source versionnée, déclarés et non jugés : ${personnels.join(", ")}`
      : "aucun skill installé sans source versionnée",
  });
  findings.sort((a, b) => a.regle.localeCompare(b.regle) || (a.statut === "FAIL" ? -1 : 1));

  return {
    verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS",
    findings,
    applique: appliquer ? applique : undefined,
    purge: purger ? purge : undefined,
  };
}

// ---- self-test : chaque règle dans les DEUX sens ----------------------------------------------
function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "skills-"));
  const racine = join(base, "forges");
  const inst = join(base, "installes");
  const poser = (chemin, contenu) => { mkdirSync(dirname(chemin), { recursive: true }); writeFileSync(chemin, contenu); };

  const src = join(racine, "digit-ai-forge-agents", ".claude", "skills");
  poser(join(src, "alpha", "SKILL.md"), "# alpha\n");
  poser(join(src, "alpha", "scripts", "x.py"), "print(1)\n");
  poser(join(inst, "alpha", "SKILL.md"), "# alpha\n");
  poser(join(inst, "alpha", "scripts", "x.py"), "print(1)\n");

  const cas = [];
  const echoue = (r, regle) => r.findings.some((f) => f.regle === regle && f.statut === "FAIL");

  let r = juger(racine, inst);
  cas.push(["vert  — source et copie identiques", r.verdict === "PASS"]);

  // K2 bis : les fins de ligne ne sont PAS un écart — git les normalise, pas l'auteur.
  writeFileSync(join(inst, "alpha", "SKILL.md"), "# alpha\r\n");
  r = juger(racine, inst);
  cas.push(["K2    — CRLF vs LF n'est pas un écart", !echoue(r, "K2")]);

  // K2 : un vrai écart de contenu.
  writeFileSync(join(inst, "alpha", "scripts", "x.py"), "print(2)\n");
  r = juger(racine, inst);
  cas.push(["K2    — copie installée divergente", echoue(r, "K2")]);

  // --appliquer remet à niveau, et le verdict repasse au vert.
  juger(racine, inst, true);
  r = juger(racine, inst);
  cas.push(["      — --appliquer remet la copie à niveau", r.verdict === "PASS"]);

  // K1 : versionné, jamais installé.
  poser(join(src, "beta", "SKILL.md"), "# beta\n");
  r = juger(racine, inst);
  cas.push(["K1    — skill versionné non installé", echoue(r, "K1")]);
  juger(racine, inst, true);
  cas.push(["      — --appliquer l'installe", existsSync(join(inst, "beta", "SKILL.md"))]);

  // K3 : deux forges revendiquent le même nom.
  poser(join(racine, "digit-ai-forge-design", "skills", "beta", "SKILL.md"), "# beta bis\n");
  r = juger(racine, inst);
  cas.push(["K3    — même nom dans deux forges", echoue(r, "K3")]);
  // …et --appliquer REFUSE de trancher : la copie ne doit pas bouger.
  const avant = readFileSync(join(inst, "beta", "SKILL.md"), "utf8");
  juger(racine, inst, true);
  cas.push(["K3 bis— --appliquer n'arbitre pas un doublon",
            readFileSync(join(inst, "beta", "SKILL.md"), "utf8") === avant]);

  // K5 : la copie installée est EN AVANCE. C'est le cas réel du 15/08 —
  // prompt-analyzer-l99 installé en 2.2.0, source du dépôt en 2.1.0. Les deux sens comptent :
  // en avance -> refus d'appliquer ET contenu préservé ; en retard -> comportement normal.
  const frontmatter = (v, titre) => ["---", `version: "${v}"`, "---", `# ${titre}`, ""].join("\n");
  poser(join(src, "gamma", "SKILL.md"), frontmatter("1.0.0", "gamma"));
  poser(join(inst, "gamma", "SKILL.md"), frontmatter("2.2.0", "gamma ameliore"));
  r = juger(racine, inst);
  cas.push(["K5    — copie installée en avance sur sa source", echoue(r, "K5")]);
  const avantG = readFileSync(join(inst, "gamma", "SKILL.md"), "utf8");
  juger(racine, inst, true);
  cas.push(["K5 bis— --appliquer n'écrase PAS une version plus récente",
            readFileSync(join(inst, "gamma", "SKILL.md"), "utf8") === avantG]);
  // Sens inverse : source en avance, l'application se fait normalement.
  poser(join(src, "gamma", "SKILL.md"), frontmatter("3.0.0", "gamma refondu"));
  juger(racine, inst, true);
  cas.push(["K5 ter— source en avance : l'application se fait",
            /3\.0\.0/.test(readFileSync(join(inst, "gamma", "SKILL.md"), "utf8"))]);

  // Une sauvegarde laissée dans la copie n'est ni comparée ni effacée — cas réel :
  // `SKILL.md.bak-20260407` traînait à côté de prompt-analyzer-l99.
  poser(join(inst, "alpha", "SKILL.md.bak-20260407"), "# vieille version\n");
  r = juger(racine, inst);
  cas.push(["      — une sauvegarde .bak n'est pas un écart",
            !r.findings.some((f) => f.regle === "K2" && f.statut === "FAIL" && f.ou === "alpha")]);

  // --purger (TF-0254) : `--appliquer` copie la source vers la copie mais ne touche jamais aux
  // orphelins que la copie porte EN PLUS (sauvegarde `.avant-*`, lockfile généré, fixture
  // locale) — 11 constatés sur 3 skills le 15/08, K2 restait FAIL après application.
  poser(join(src, "delta", "SKILL.md"), "# delta\n");
  poser(join(inst, "delta", "SKILL.md"), "# delta\n");
  poser(join(inst, "delta", "SKILL.md.avant-purge"), "# delta ancienne\n"); // sauvegarde orpheline
  poser(join(inst, "delta", "package-lock.json"), "{}\n"); // lockfile jamais versionné
  r = juger(racine, inst);
  cas.push(["K2    — orphelins dans la copie installée", echoue(r, "K2")]);

  // Rouge : --appliquer SEUL ne purge rien, les orphelins restent, K2 reste FAIL.
  juger(racine, inst, true);
  r = juger(racine, inst);
  cas.push(["      — --appliquer seul laisse les orphelins (rouge)",
            echoue(r, "K2")
            && existsSync(join(inst, "delta", "package-lock.json"))
            && existsSync(join(inst, "delta", "SKILL.md.avant-purge"))]);

  // Vert : --purger déplace les orphelins en quarantaine datée — jamais de suppression —
  // et K2 repasse au vert.
  const rPurge = juger(racine, inst, false, true);
  r = juger(racine, inst);
  cas.push(["      — --purger déplace les orphelins, K2 repasse au vert", !echoue(r, "K2")]);
  cas.push(["      — les orphelins ne sont pas supprimés du disque, seulement déplacés",
            !existsSync(join(inst, "delta", "package-lock.json"))
            && !existsSync(join(inst, "delta", "SKILL.md.avant-purge"))
            && (rPurge.purge || []).some((m) => m.includes("delta") && m.includes("package-lock.json"))]);
  const quarantaine = join(inst, ".quarantaine");
  const retrouve = existsSync(quarantaine)
    && readdirSync(quarantaine, { recursive: true }).some((f) => String(f).includes("package-lock.json"));
  cas.push(["      — les fichiers purgés sont retrouvables sous .quarantaine", retrouve]);

  // K4 : un skill personnel est déclaré, jamais mis en échec.
  poser(join(inst, "perso", "SKILL.md"), "# perso\n");
  r = juger(racine, inst);
  cas.push(["K4    — skill personnel déclaré, non jugé",
            !r.findings.some((f) => f.regle === "K4" && f.statut === "FAIL")
            && r.findings.some((f) => f.regle === "K4" && /perso/.test(f.message))]);

  // ---- TF-0289 : les sidecars d'oracles ne sont pas des divergences, et les VRAIES ne sont plus
  // tronquées. Base neuve : les cas précédents laissent volontairement un doublon K3 derrière eux,
  // donc plus aucun verdict global vert n'y est possible.
  const base2 = mkdtempSync(join(tmpdir(), "skills-sidecars-"));
  const racine2 = join(base2, "forges");
  const inst2 = join(base2, ".claude", "skills");
  const src2 = join(racine2, "digit-ai-forge-agents", ".claude", "skills");
  poser(join(src2, "sigma", "SKILL.md"), "# sigma\n");
  poser(join(src2, "sigma", "references", "registre-oracles.json"), '{"oracles":[]}\n');
  poser(join(inst2, "sigma", "SKILL.md"), "# sigma\n");
  poser(join(inst2, "sigma", "references", "registre-oracles.json"), '{"oracles":[]}\n');
  // Sidecars du hook C7 déposés du SEUL côté où un oracle a tourné — cas réel des 15 fichiers
  // trouvés sous experts-forge, contre-expertise et write-an-expert le 15/08.
  poser(join(inst2, "sigma", "SKILL.md.oracles.json"), '{"verdict":"PASS"}\n');
  poser(join(inst2, "sigma", "SKILL.md.oracles-cache.json"), "{}\n");
  poser(join(inst2, "sigma", ".oracles-cache.json"), "{}\n");
  poser(join(inst2, "sigma", "_oracles-journal-historique.jsonl"), "{}\n");
  poser(join(inst2, "sigma", "references", "regles.md.oracles-historique.jsonl"), "{}\n");
  poser(join(inst2, "sigma", "__pycache__", "x.pyc"), "octets\n");
  r = juger(racine2, inst2);
  cas.push(["K2    — sidecars d'oracles et __pycache__ ne sont pas des écarts (TF-0289)",
            r.verdict === "PASS"]);

  // Rouge : une VRAIE divergence de contenu reste détectée sous le bruit des sidecars.
  writeFileSync(join(inst2, "sigma", "SKILL.md"), "# sigma trafique dans la copie\n");
  r = juger(racine2, inst2);
  const k2 = r.findings.find((f) => f.regle === "K2" && f.statut === "FAIL");
  cas.push(["K2    — une vraie divergence de SKILL.md reste détectée",
            Boolean(k2) && k2.message.includes("1 divergence(s) de contenu : SKILL.md")]);
  cas.push(["K2    — le verdict DÉCLARE ce qu'il exclut (message ET non_juge)",
            Boolean(k2) && /sidecars d'oracles/.test(k2.message)
            && NON_JUGE.some((l) => /sidecars d'oracles/.test(l))]);

  // Garde-fou du motif : `references/registre-oracles.json` est un référentiel VERSIONNÉ, pas un
  // sidecar — le séparateur `-` ne doit pas ouvrir l'exclusion, sinon TF-0289 rendrait aveugle
  // exactement là où K2 sert.
  writeFileSync(join(inst2, "sigma", "SKILL.md"), "# sigma\n");
  writeFileSync(join(inst2, "sigma", "references", "registre-oracles.json"), '{"oracles":["trafique"]}\n');
  r = juger(racine2, inst2);
  const k2b = r.findings.find((f) => f.regle === "K2" && f.statut === "FAIL");
  cas.push(["K2    — `registre-oracles.json` n'est PAS un sidecar : sa divergence échoue",
            Boolean(k2b) && /references\/registre-oracles\.json/.test(k2b.message)]);

  // Troncature : 6 vraies divergences de contenu + 6 fichiers absents de la copie. L'ancienne
  // forme listait les absents d'abord puis coupait à 4 — les 6 divergences pouvaient n'apparaître
  // NULLE PART, c'est-à-dire le défaut cherché rendu invisible par le message même qui l'annonce.
  for (let i = 1; i <= 6; i += 1) {
    poser(join(src2, "sigma", "scripts", `d${i}.mjs`), `export const n = ${i};\n`);
    poser(join(inst2, "sigma", "scripts", `d${i}.mjs`), `export const n = ${i * 10};\n`);
    poser(join(src2, "sigma", "absents", `a${i}.md`), `# a${i}\n`);
  }
  r = juger(racine2, inst2);
  const k2c = r.findings.find((f) => f.regle === "K2" && f.statut === "FAIL");
  cas.push(["K2    — les 6 vraies divergences sont TOUTES visibles, jamais tronquées",
            Boolean(k2c) && [1, 2, 3, 4, 5, 6].every((i) => k2c.message.includes(`scripts/d${i}.mjs`))]);
  cas.push(["K2    — les absents restent plafonnés et COMPTÉS, pas listés à l'infini",
            Boolean(k2c) && /et 2 autre\(s\) \(absent de la copie\)/.test(k2c.message)]);

  // ---- TF-0290 : K6, les HOOKS. Le gate C7 `qo-gate-write.mjs` a bloqué cinq écritures le 15/08
  // sans qu'aucune forge le versionne — et K1-K5 ne pouvaient pas le voir : ils ne regardent que
  // les skills. Un hook est un fichier : la comparaison se fait fichier à fichier.
  const base3 = mkdtempSync(join(tmpdir(), "hooks-"));
  const racine3 = join(base3, "forges");
  const inst3 = join(base3, ".claude", "skills");
  const instH = join(base3, ".claude", "hooks");
  const src3 = join(racine3, "digit-ai-forge-agents", ".claude", "skills");
  const srcH = join(racine3, "digit-ai-forge-agents", ".claude", "hooks");
  const hook = (v, corps) => `#!/usr/bin/env node\nconst VERSION = "${v}";\n// ${corps}\n`;
  poser(join(src3, "omega", "SKILL.md"), "# omega\n");
  poser(join(inst3, "omega", "SKILL.md"), "# omega\n");
  poser(join(srcH, "qo-gate-write.mjs"), hook("1.0.0", "gate C7"));
  poser(join(instH, "qo-gate-write.mjs"), hook("1.0.0", "gate C7"));
  r = juger(racine3, inst3, false, false, instH);
  cas.push(["K6    — hook installé identique à sa source versionnée",
            r.verdict === "PASS"
            && r.findings.some((f) => f.regle === "K6" && /1 hook\(s\) installé\(s\) comparé/.test(f.message))]);

  // Rouge : la copie installée a été éditée — c'est ELLE que le harnais exécute à chaque outil.
  writeFileSync(join(instH, "qo-gate-write.mjs"), hook("1.0.0", "gate C7 trafique en local"));
  r = juger(racine3, inst3, false, false, instH);
  const k6 = r.findings.find((f) => f.regle === "K6" && f.statut === "FAIL");
  cas.push(["K6    — hook installé divergent de sa source", Boolean(k6)]);
  cas.push(["K6    — le verdict nomme le FICHIER et dit quelle copie s'exécute",
            Boolean(k6) && k6.message.includes("qo-gate-write.mjs")
            && /COPIE INSTALLÉE qui s'exécute/.test(k6.message)]);
  juger(racine3, inst3, true, false, instH);
  r = juger(racine3, inst3, false, false, instH);
  cas.push(["K6    — --appliquer remet le hook à niveau",
            !r.findings.some((f) => f.regle === "K6" && f.statut === "FAIL")
            && readFileSync(join(instH, "qo-gate-write.mjs"), "utf8")
               === readFileSync(join(srcH, "qo-gate-write.mjs"), "utf8")]);

  // Un hook installé SANS source versionnée appartient à l'humain : déclaré, jamais mis en échec
  // (même contrat que K4 pour un skill personnel).
  poser(join(instH, "mon-hook-perso.mjs"), "// hook de l'humain\n");
  r = juger(racine3, inst3, false, false, instH);
  cas.push(["K6    — hook sans source versionnée : déclaré, non jugé",
            r.verdict === "PASS"
            && r.findings.some((f) => f.regle === "K6" && /mon-hook-perso\.mjs/.test(f.message))]);

  // TF-0289 vaut aussi pour K6 : un sidecar déposé à côté d'un hook n'est pas un écart.
  poser(join(instH, "qo-gate-write.mjs.oracles-cache.json"), "{}\n");
  r = juger(racine3, inst3, false, false, instH);
  cas.push(["K6    — un sidecar d'oracle à côté d'un hook n'est pas un écart",
            r.verdict === "PASS"
            && !r.findings.some((f) => f.regle === "K6" && /oracles-cache/.test(f.message))]);

  // Protection K5 transposée : la copie installée déclare une version PLUS HAUTE — l'écraser
  // détruirait du travail au nom de la synchronisation. Les deux sens comptent.
  poser(join(srcH, "qo-gate.mjs"), hook("1.0.0", "gate C6"));
  poser(join(instH, "qo-gate.mjs"), hook("2.3.0", "gate C6 ameliore sur le poste"));
  r = juger(racine3, inst3, false, false, instH);
  cas.push(["K6    — copie installée d'un hook EN AVANCE sur sa source",
            r.findings.some((f) => f.regle === "K6" && f.statut === "FAIL" && /EN AVANCE/.test(f.message))]);
  const avantH = readFileSync(join(instH, "qo-gate.mjs"), "utf8");
  juger(racine3, inst3, true, false, instH);
  cas.push(["K6 bis— --appliquer n'écrase PAS un hook installé plus récent",
            readFileSync(join(instH, "qo-gate.mjs"), "utf8") === avantH]);
  poser(join(srcH, "qo-gate.mjs"), hook("3.0.0", "gate C6 refondu au dépôt"));
  juger(racine3, inst3, true, false, instH);
  cas.push(["K6 ter— source de hook en avance : l'application se fait",
            /3\.0\.0/.test(readFileSync(join(instH, "qo-gate.mjs"), "utf8"))]);

  // Hook versionné mais JAMAIS installé : déclaré, pas mis en échec — poser un hook est un acte
  // humain (il faut aussi le câbler dans settings.json). `--appliquer` le pose sur demande.
  poser(join(srcH, "gates", "g0-budget.sh"), "#!/bin/bash\nexit 0\n");
  r = juger(racine3, inst3, false, false, instH);
  cas.push(["K6    — hook versionné non installé : déclaré, jamais en silence",
            r.verdict === "PASS"
            && r.findings.some((f) => f.regle === "K6" && /NON installé\(s\)/.test(f.message)
                                      && /g0-budget\.sh/.test(f.message))]);
  juger(racine3, inst3, true, false, instH);
  cas.push(["K6    — --appliquer installe le hook versionné absent",
            existsSync(join(instH, "gates", "g0-budget.sh"))]);

  // Deux forges revendiquent le même hook : `--appliquer` ne tranche pas (même raison que K3).
  poser(join(racine3, "digit-ai-forge-tests", ".claude", "hooks", "qo-gate-write.mjs"),
        hook("1.0.0", "autre gate, autre forge"));
  r = juger(racine3, inst3, false, false, instH);
  cas.push(["K6    — même nom de hook dans deux forges : la source n'existe pas",
            r.findings.some((f) => f.regle === "K6" && f.statut === "FAIL" && /2 sources/.test(f.message))]);
  const avantD = readFileSync(join(instH, "qo-gate-write.mjs"), "utf8");
  juger(racine3, inst3, true, false, instH);
  cas.push(["K6 bis— --appliquer n'arbitre pas un hook revendiqué deux fois",
            readFileSync(join(instH, "qo-gate-write.mjs"), "utf8") === avantD]);

  // ---- TF-0297 : K7, le CÂBLAGE. Un hook dont la copie installée est parfaite mais qu'aucun
  // `settings.json` ne référence ne s'exécute JAMAIS (loi transverse n°1). K7 est DÉCLARATIF par
  // construction — chaque cas vérifie donc AUSSI que le verdict reste PASS : un K7 bloquant
  // briquerait toutes les ouvertures de run sur une décision humaine pendante (R-35, R-33 bis).
  const base4 = mkdtempSync(join(tmpdir(), "cablage-"));
  const racine4 = join(base4, "forges");
  const inst4 = join(base4, ".claude", "skills");
  const instH4 = join(base4, ".claude", "hooks");
  const settings4 = join(base4, ".claude", "settings.json"); // le câblage INSTALLÉ
  const src4 = join(racine4, "digit-ai-forge-agents", ".claude", "skills");
  const srcH4 = join(racine4, "digit-ai-forge-agents", ".claude", "hooks");
  const settingsV4 = join(racine4, "digit-ai-forge-agents", ".claude", "settings.json"); // VERSIONNÉ
  const cablage = (commandes) => JSON.stringify(
    { hooks: { PostToolUse: [{ matcher: "Write|Edit", hooks: commandes.map((c) => ({ type: "command", command: c })) }] } },
    null, 1);
  // Entrée personnelle de l'humain : elle vit dans le settings installé et ne référence AUCUN hook
  // versionné. Elle ne doit apparaître dans aucun message — ni jugée, ni listée, ni comptée.
  const CMD_PERSO = 'node -e "tableau-de-bord-perso"';
  const k7de = (r) => r.findings.find((f) => f.regle === "K7");
  poser(join(src4, "kappa", "SKILL.md"), "# kappa\n");
  poser(join(inst4, "kappa", "SKILL.md"), "# kappa\n");
  poser(join(srcH4, "qo-gate-write.mjs"), hook("1.0.0", "gate C7"));
  poser(join(instH4, "qo-gate-write.mjs"), hook("1.0.0", "gate C7"));
  // Le settings versionné déclare le gate C7 ET un gate de portée PROJET (`.queue/gates/…`, cas
  // réel de forge-agents) : ce dernier n'est pas un hook versionné sous `.claude\hooks\`, il est
  // chargé quand la session s'ouvre dans le dépôt — K7 n'a pas à le réclamer au poste.
  poser(settingsV4, cablage(["node ~/.claude/hooks/qo-gate-write.mjs --niveau note",
                             "bash .queue/gates/g0-budget.sh"]));
  poser(settings4, cablage(["node C:/Users/humain/.claude/hooks/qo-gate-write.mjs --niveau note",
                            CMD_PERSO]));

  r = juger(racine4, inst4, false, false, instH4, settings4);
  let k7 = k7de(r);
  cas.push(["K7    — hook versionné, attendu par sa forge ET câblé : aucun écart",
            r.verdict === "PASS" && Boolean(k7) && k7.statut === "PASS"
            && /1 hook\(s\) versionné\(s\) attendu\(s\) par une forge ET câblé/.test(k7.message)
            && !/CÂBLAGE\(S\) MANQUANT/.test(k7.message)]);
  cas.push(["K7    — le câblage PERSONNEL de l'humain n'est ni listé ni compté",
            Boolean(k7) && !k7.message.includes("tableau-de-bord-perso")]);
  cas.push(["K7    — un câblage de portée PROJET n'est pas réclamé au poste",
            Boolean(k7) && !/g0-budget/.test(k7.message)]);

  // Rouge (déclaratif) : le câblage installé perd l'entrée du gate C7 — c'est l'état réel du poste
  // au 17/08. Le hook est versionné, attendu, sain… et rien ne l'exécute.
  poser(settings4, cablage([CMD_PERSO]));
  r = juger(racine4, inst4, false, false, instH4, settings4);
  k7 = k7de(r);
  cas.push(["K7    — hook versionné et attendu, ABSENT du câblage installé : déclaré",
            Boolean(k7) && /CÂBLAGE\(S\) MANQUANT\(S\)/.test(k7.message)
            && k7.message.includes("qo-gate-write.mjs")]);
  cas.push(["K7    — le constat nomme la commande et le geste qui la poserait",
            Boolean(k7) && k7.message.includes("--niveau note")
            && k7.message.includes(settings4)]);
  cas.push(["K7    — DÉCLARATIF : câblage manquant, et le verdict reste PASS (R-35, R-33 bis)",
            r.verdict === "PASS"
            && !r.findings.some((f) => f.regle === "K7" && f.statut !== "PASS")]);

  // Hook versionné dont le câblage n'est décrit NULLE PART — ni settings versionné, ni installé.
  poser(join(srcH4, "qo-gate.mjs"), hook("1.0.0", "gate C6"));
  r = juger(racine4, inst4, false, false, instH4, settings4);
  k7 = k7de(r);
  cas.push(["K7    — hook versionné dont le câblage n'est décrit NULLE PART",
            r.verdict === "PASS" && Boolean(k7) && /NULLE PART/.test(k7.message)
            && /qo-gate\.mjs \(source/.test(k7.message)]);

  // Câblé au poste sans qu'aucun settings versionné le décrive : le câblage existe mais n'est pas
  // reproductible depuis les dépôts — l'effacement du settings installé le perdrait sans trace.
  poser(join(srcH4, "hook-maison.mjs"), hook("1.0.0", "hook maison"));
  poser(settings4, cablage([CMD_PERSO, "node ~/.claude/hooks/hook-maison.mjs"]));
  r = juger(racine4, inst4, false, false, instH4, settings4);
  k7 = k7de(r);
  cas.push(["K7    — câblé au poste sans description versionnée : déclaré, non reproductible",
            r.verdict === "PASS" && Boolean(k7)
            && /sans qu'aucun settings\.json versionné le décrive/.test(k7.message)
            && k7.message.includes("hook-maison.mjs")]);

  // `--appliquer` pose des FICHIERS de hook, il ne CÂBLE rien : câbler engage toutes les sessions
  // du poste, c'est un acte humain (R-29). Vérifié à l'octet.
  const avantS = readFileSync(settings4);
  const rApp = juger(racine4, inst4, true, false, instH4, settings4);
  cas.push(["K7    — --appliquer ne touche JAMAIS au settings installé (R-29)",
            readFileSync(settings4).equals(avantS)
            && /n'a PAS touché/.test(k7de(rApp).message)]);

  // Settings installé absent : K7 ne peut ni confirmer ni infirmer un câblage — il le DIT, au lieu
  // de déclarer à tort que tout est décâblé.
  r = juger(racine4, inst4, false, false, instH4, join(base4, ".claude", "settings-absent.json"));
  k7 = k7de(r);
  cas.push(["K7    — câblage installé absent : confrontation non concluante, dite et non devinée",
            r.verdict === "PASS" && Boolean(k7) && /absent/.test(k7.message)
            && /n'est pas concluante/.test(k7.message)
            && !/CÂBLAGE\(S\) MANQUANT/.test(k7.message)]);

  // Un settings.json versionné cassé à la main ne fait pas planter l'oracle : il est déclaré.
  poser(settingsV4, "{ hooks: pas du json,\n");
  r = juger(racine4, inst4, false, false, instH4, settings4);
  k7 = k7de(r);
  cas.push(["K7    — settings.json versionné illisible : déclaré, l'oracle ne plante pas",
            r.verdict === "PASS" && Boolean(k7) && /non exploitable/.test(k7.message)
            && k7.message.includes("digit-ai-forge-agents")]);

  let bons = 0;
  for (const [nom, tenu] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom}`);
    if (tenu) bons += 1;
  }
  console.log(`Self-test oracle-skills : ${bons}/${cas.length}`);
  return bons === cas.length ? 0 : 1;
}

// ---- entrée -----------------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.includes("--self-test")) process.exit(selfTest());

const lire = (drapeau, defaut) => {
  const i = args.indexOf(drapeau);
  return i >= 0 && args[i + 1] ? resolve(args[i + 1]) : defaut;
};
const racine = lire("--racine", racineForges());
const installes = lire("--installes", join(homedir(), ".claude", "skills"));
// Les hooks installés sont le frère du dossier des skills (`~\.claude\hooks`) — déduit plutôt que
// redemandé, pour qu'un `--installes` de test emmène ses hooks avec lui.
const installes_hooks = lire("--installes-hooks", join(dirname(installes), "hooks"));
// Le câblage installé est le frère des deux autres (`~\.claude\settings.json`) — même déduction.
const settings_installe = lire("--settings-installe", join(dirname(installes), "settings.json"));
const appliquer = args.includes("--appliquer");
const purger = args.includes("--purger");

const { verdict, findings, motif, applique, purge } = juger(
  racine, installes, appliquer, purger, installes_hooks, settings_installe);
process.stdout.write(JSON.stringify(
  { oracle: ORACLE, version: VERSION, racine, installes, installes_hooks, settings_installe, verdict, motif, applique, purge, findings, non_juge: NON_JUGE },
  null, 1) + "\n");
process.exit(verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0);
