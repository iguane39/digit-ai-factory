#!/usr/bin/env node
/**
 * oracle-parite-configuration.mjs — le gabarit d'environnement couvre-t-il ce que le code LIT ?
 *
 * ============================================================================================
 * POURQUOI (TF-0589 et TF-0588, lot produit-02 du 25/08/2026)
 * ============================================================================================
 *
 * LE FAIT, mesuré par le produit sur son propre dépôt : `.env` portait ONZE clés, `.env.example`
 * n'en documentait que SEPT. Les quatre clés ajoutées deux jours plus tôt étaient invisibles pour
 * quiconque reprend le dépôt. *Un gabarit incomplet est PIRE qu'un gabarit absent : il donne
 * l'illusion d'un contrat complet.* R-13 exige le gabarit ; rien ne vérifiait qu'il couvre quoi
 * que ce soit.
 *
 * LE SUJET VOISIN QUE CET ORACLE SERT AUSSI (TF-0588). Le même run a payé TROIS aller-retours et
 * DEUX jetons créés pour rien parce que les secrets attendus étaient décrits EN PROSE, dans une
 * conversation : nom de variable dicté de mémoire (`RAILWAY_TOKEN` quand le client attend
 * `RAILWAY_API_TOKEN`), portées à cocher racontées au lieu d'être écrites. La règle qui en sort est
 * *avant de demander un secret, en préparer le réceptacle* — la clé VIDE dans le gabarit committé,
 * avec en commentaire où la créer, quelles portées, et la commande qui vérifie la portée accordée.
 * La demande à l'humain se réduit alors à « colle la valeur ici ». Cet oracle est la moitié
 * mécanisable de cette règle : il refuse qu'une clé existe sans son réceptacle.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ
 * ============================================================================================
 *
 *   PC1 · toute clé présente dans `.env` a son entrée, VALEUR VIDE, dans le gabarit committé.
 *         C'est le sens qui a coûté : quatre clés réelles invisibles au repreneur.
 *   PC2 · toute clé LUE PAR LE CODE a son entrée au gabarit. Plus large que PC1 : une clé lue et
 *         absente des deux fichiers est un défaut que `.env` ne révèle pas, puisqu'il est local.
 *   PC3 · une clé du gabarit que RIEN ne lit est signalée — pas accusée. Le sens inverse compte
 *         autant : un gabarit qui accumule des clés mortes redevient illisible, et le repreneur ne
 *         sait plus lesquelles servent.
 *   PC4 · un secret attendu porte, en commentaire au-dessus de sa clé, DE QUOI l'obtenir : où le
 *         créer, ou la commande qui vérifie la portée accordée. C'est la moitié mécanisable de
 *         TF-0588 — la prose dans une conversation ne survit pas à la conversation.
 *
 * NON JUGÉ, et déclaré :
 *   · la VALEUR d'une clé : ce contrôle ne lit jamais un `.env` pour son contenu, seulement pour
 *     ses NOMS de clés. Un contrôle qui lirait les valeurs deviendrait lui-même un chemin de fuite,
 *     même raisonnement que `oracle-secrets-hors-perimetre` ;
 *   · si une clé lue par le code est OBLIGATOIRE ou optionnelle : le code seul le dit, et
 *     l'inférer produirait des faux positifs sur les clés à valeur de repli ;
 *   · les clés lues par un chemin dynamique (`process.env[nom]`) : indétectables par balayage, et
 *     c'est écrit plutôt que promis.
 *
 * Usage : node oracle-parite-configuration.mjs [dossier] [--json]
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP (aucun gabarit, aucun `.env`, rien à juger).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const cible = args.find((a) => !a.startsWith("--")) || join(ICI, "..");

/** Les noms de gabarit admis. La liste est FERMÉE : deviner ferait juger un fichier au hasard. */
export const GABARITS = [".env.example", ".env.exemple", ".env.sample", ".env.template", ".env.dist"];

/** Ce qu'on ne balaie pas : ni utile, ni bon marché. */
const SAUTES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next",
  "vendor", ".pytest_cache", ".ruff_cache", "output", "old", "Old"]);

const EXT_CODE = /\.(mjs|cjs|js|ts|tsx|jsx|py)$/i;

/**
 * LES FICHIERS DE TEST NE PORTENT PAS LE CONTRAT DE CONFIGURATION, et les compter ferait accuser
 * un dépôt pour ses FIXTURES. Mesure sur le parc avant livraison (N-23) : sur forge-tests, 5 des 7
 * constats restants venaient de fichiers de recette — `ZZ_CLE_API_PROJET`, `ZZ_JETON_DASHBOARD`,
 * `PROFIL_2_USER`… des variables fabriquées EXPRÈS pour éprouver un contrôle. Une fixture n'est pas
 * une clé que le repreneur doit renseigner, et l'exiger au gabarit rendrait le gabarit faux.
 * L'exclusion est nommée, donc vérifiable (N-13).
 */
export const EST_UN_FICHIER_DE_TEST = (chemin) => {
  const n = String(chemin).replaceAll("\\", "/").toLowerCase();
  return /(^|\/)(tests?|recette|recettes|spec|specs|__tests__|fixtures?)\//.test(n)
    || /(^|\/)test_[^/]*$/.test(n)
    || /[.-](test|spec)\.[a-z]+$/.test(n);
};

/**
 * Les clés d'un fichier d'environnement, par leur NOM SEUL. Aucune valeur n'est lue ni rendue —
 * un contrôle qui lirait les valeurs deviendrait lui-même un chemin de fuite.
 */
export function clesDeFichier(chemin) {
  if (!existsSync(chemin)) return null;
  const cles = new Map();
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/);
  let commentaire = [];
  for (const ligne of lignes) {
    const nue = ligne.trim();
    if (!nue) { commentaire = []; continue; }
    if (nue.startsWith("#")) { commentaire.push(nue.slice(1).trim()); continue; }
    const m = nue.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/);
    if (m) {
      // LE COMMENTAIRE DE FIN DE LIGNE COMPTE AUTANT QUE CELUI DU DESSUS, et l'ignorer était un
      // FAUX POSITIF de PC4 : le gabarit du pilot écrit `GEMINI_API_KEY= # à fournir : clé Google
      // AI Studio…`, qui dit exactement où l'obtenir — et l'oracle l'accusait de se taire. Trouvé
      // en le jouant sur le pilot lui-même avant livraison (N-23).
      const enFin = (m[2].match(/#(.*)$/) || [, ""])[1].trim();
      cles.set(m[1], [commentaire.join(" "), enFin].filter(Boolean).join(" "));
      // LE BLOC DE COMMENTAIRE COUVRE TOUTES LES CLÉS CONSÉCUTIVES QU'IL INTRODUIT, jusqu'à la
      // prochaine ligne vide. C'est ainsi qu'un gabarit s'écrit vraiment : « renseigne ces deux
      // lignes » au-dessus d'un couple identifiant/mot de passe. Le premier jet vidait le
      // commentaire dès la première clé, et accusait donc la SECONDE de se taire — faux positif
      // mesuré sur le gabarit de forge-tests, où un seul commentaire introduit le couple.
    } else commentaire = [];
  }
  return cles;
}

/** Les clés d'environnement LUES par le code, avec le fichier où on les lit. */
export function clesLuesParLeCode(racine) {
  const lues = new Map();
  const motifs = [
    /process\.env\.([A-Z_][A-Z0-9_]*)/g,
    /process\.env\[\s*["']([A-Z_][A-Z0-9_]*)["']\s*\]/g,
    /os\.environ\.get\(\s*["']([A-Z_][A-Z0-9_]*)["']/g,
    /os\.environ\[\s*["']([A-Z_][A-Z0-9_]*)["']\s*\]/g,
    /os\.getenv\(\s*["']([A-Z_][A-Z0-9_]*)["']/g,
  ];
  const descendre = (d, niveau) => {
    if (niveau > 6) return;
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (SAUTES.has(e.name)) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) { descendre(p, niveau + 1); continue; }
      if (!EXT_CODE.test(e.name)) continue;
      if (EST_UN_FICHIER_DE_TEST(p)) continue;
      let texte = "";
      try { texte = readFileSync(p, "utf8"); } catch { continue; }
      for (const motif of motifs) {
        motif.lastIndex = 0;
        let m;
        while ((m = motif.exec(texte)) !== null) {
          if (DU_SYSTEME.has(m[1])) continue;
          if (!lues.has(m[1])) lues.set(m[1], relative(racine, p).replaceAll("\\", "/"));
        }
      }
    }
  };
  descendre(racine, 1);
  return lues;
}

/**
 * LES VARIABLES DU SYSTÈME NE SONT PAS DE LA CONFIGURATION DE PROJET, et les compter ferait accuser
 * tout dépôt qui lit son environnement d'exécution. Liste FERMÉE et nommée : deviner par un motif
 * (« tout ce qui est en majuscules ») attraperait les vraies clés. Mesure qui l'a imposée : joué sur
 * le pilot, l'oracle rendait 10 constats dont `USERPROFILE` et `HOME` — deux variables que le
 * système fournit et qu'aucun `.env.example` n'a à documenter. Lues avant d'être crues (N-23).
 */
export const DU_SYSTEME = new Set([
  "HOME", "USERPROFILE", "PATH", "TEMP", "TMP", "TMPDIR", "SHELL", "COMSPEC", "PWD", "OS",
  "USER", "USERNAME", "LOGNAME", "HOSTNAME", "COMPUTERNAME", "LANG", "LC_ALL", "TZ", "TERM",
  "CI", "NODE_ENV", "NODE_OPTIONS", "PYTHONPATH", "PYTHONIOENCODING", "VIRTUAL_ENV",
  "GITHUB_ACTIONS", "GITHUB_WORKSPACE", "GITHUB_TOKEN", "RUNNER_OS", "APPDATA", "LOCALAPPDATA",
  "PROGRAMFILES", "SYSTEMROOT", "WINDIR", "MSYS_NO_PATHCONV", "COLUMNS", "NO_COLOR", "FORCE_COLOR",
]);

/**
 * UN DÉPÔT PEUT DÉCLARER QU'UNE FAMILLE DE CLÉS EST DOCUMENTÉE AILLEURS, et l'oracle l'écoute au
 * lieu de deviner. La directive s'écrit en commentaire du gabarit :
 *
 *     # cles-documentees-ailleurs: FORGE_TESTS_* — dérivées du code dans `.env.forge-tests.exemple`
 *
 * POURQUOI ELLE EXISTE, et c'est une mesure et non une commodité. Joué sur le parc avant livraison
 * (N-23), l'oracle a rendu 36 constats sur forge-tests — et ils étaient FAUX. Cette forge PRESCRIT
 * les clés `FORGE_TESTS_*` au projet qu'elle AUDITE : elles sont documentées dans un gabarit DÉRIVÉ
 * DU CODE (`forge_tests/gabarit_env.py`), déposé chez le projet, précisément pour qu'aucune liste
 * recopiée ne se périme. Son propre gabarit écrit d'ailleurs, en tête, « deux fichiers, DEUX RÔLES
 * DISTINCTS ». Accuser cette architecture aurait fait crier l'oracle sur la bonne pratique — et un
 * contrôle bruyant se fait contourner, jamais corriger (R-33 bis).
 *
 * LA DÉCLARATION EST NOMMÉE ET RENDUE : le rapport dit toujours combien de clés une directive a
 * écartées et laquelle. Une exclusion silencieuse serait un angle mort ; celle-ci est un aveu.
 */
export function familiesDeclarees(texteGabarit) {
  const familles = [];
  for (const ligne of String(texteGabarit || "").split(/\r?\n/)) {
    const m = ligne.match(/^#\s*cles-documentees-ailleurs\s*:\s*(.+)$/i);
    if (!m) continue;
    for (const brut of m[1].split(/[,;]/)) {
      const motif = brut.trim().split(/\s+[-\u2014]\s+/)[0].trim();
      if (motif) familles.push(motif);
    }
  }
  return familles;
}

/** Une clé appartient-elle à une famille déclarée ? Le `*` ne couvre que la FIN du nom. */
export const couvertePar = (cle, familles) => familles.some((f) => f.endsWith("*")
  ? cle.startsWith(f.slice(0, -1))
  : cle === f);

/** Une clé porte-t-elle un nom de secret ? Seuls ceux-là doivent dire OÙ les obtenir (PC4). */
export const EST_UN_SECRET = (nom) => /(TOKEN|SECRET|KEY|PASSWORD|PASSWD|CREDENTIAL|API_?KEY|CLE)/i.test(nom);

//: Ce qui vaut « de quoi l'obtenir » : un lieu, une commande, ou l'aveu qu'il vient d'ailleurs.
const DIT_OU_L_OBTENIR = /https?:\/\/|\bcr[ée]er?\b|(?<![^\x00-\x7f\w])port[ée]e?s?|\bscope\b|\bconsole\b|\bdashboard\b|(?<![^\x00-\x7f\w])à fournir|\bfourni par\b|`[^`]+`/i;

export function juger(racine) {
  const gabaritNom = GABARITS.find((g) => existsSync(join(racine, g)));
  const gabarit = gabaritNom ? clesDeFichier(join(racine, gabaritNom)) : null;
  const reel = clesDeFichier(join(racine, ".env"));
  const lues = clesLuesParLeCode(racine);
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => F.push({ regle, statut: "FAIL", message });
  const so = (regle, message) => F.push({ regle, statut: "SANS_OBJET", message });

  if (!gabarit) {
    // R-13 juge l'ABSENCE du gabarit ; ici on ne la double pas, on la renvoie à son juge.
    so("PC0", `aucun gabarit d'environnement (${GABARITS.join(", ")}) — son absence est le sujet de R-13, `
      + "pas de cet oracle : deux vérités sur le même objet en valent zéro");
    return { verdict: "SKIP", findings: F, gabarit: null };
  }

  // PC1 — les clés RÉELLES sont couvertes.
  if (!reel) so("PC1", "aucun `.env` sur ce poste — rien à confronter, et ce n'est pas un défaut du dépôt");
  else {
    const manquantes = [...reel.keys()].filter((k) => !gabarit.has(k));
    if (manquantes.length) {
      ko("PC1", `${manquantes.length} clé(s) du \`.env\` absente(s) de \`${gabaritNom}\` : ${manquantes.join(", ")}. `
        + "Un gabarit incomplet est PIRE qu'un gabarit absent : il donne l'illusion d'un contrat complet, et un "
        + "repreneur ne peut pas savoir ce qu'il ignore. Les ajouter VALEUR VIDE au gabarit — jamais la valeur.");
    } else ok("PC1", `les ${reel.size} clé(s) du \`.env\` sont toutes au gabarit`);
  }

  // PC2 — les clés LUES PAR LE CODE sont couvertes. Plus large : une clé lue et absente des deux
  // fichiers est un défaut qu'un `.env` local ne révèle jamais.
  const familles = familiesDeclarees(readFileSync(join(racine, gabaritNom), "utf8"));
  const brutManquantes = [...lues.keys()].filter((k) => !gabarit.has(k) && !(reel && reel.has(k)));
  const luesManquantes = brutManquantes.filter((k) => !couvertePar(k, familles));
  if (familles.length) {
    F.push({ regle: "PC2 bis", statut: "SANS_OBJET",
      message: `${brutManquantes.length - luesManquantes.length} clé(s) écartée(s) par la directive `
        + `« cles-documentees-ailleurs » du gabarit (${familles.join(", ")}). L'exclusion est DÉCLARÉE `
        + "par le dépôt et rendue ici : une exclusion silencieuse serait un angle mort, celle-ci est un aveu." });
  }
  if (luesManquantes.length) {
    ko("PC2", `${luesManquantes.length} clé(s) LUE(s) par le code et absente(s) du gabarit : `
      + `${luesManquantes.map((k) => `${k} (${lues.get(k)})`).join(", ")}. Un \`.env\` local ne révèle pas ce défaut : `
      + "il n'est visible que du repreneur, au moment où il ne peut plus le demander.");
  } else ok("PC2", `les ${lues.size} clé(s) lue(s) par le code sont couvertes`);

  // PC3 — le sens INVERSE : une clé du gabarit que rien ne lit. Signalée, jamais accusée.
  const mortes = [...gabarit.keys()].filter((k) => !lues.has(k) && !(reel && reel.has(k)));
  if (mortes.length) {
    F.push({ regle: "PC3", statut: "AVERTISSEMENT",
      message: `${mortes.length} clé(s) du gabarit que RIEN ne lit : ${mortes.join(", ")}. Ce n'est pas un défaut `
        + "en soi — une clé peut être lue par un déploiement, un conteneur ou un service tiers. C'est signalé parce "
        + "qu'un gabarit qui accumule des clés mortes redevient illisible, et le repreneur ne sait plus lesquelles servent." });
  } else ok("PC3", "aucune clé morte au gabarit");

  // PC4 — un secret attendu dit OÙ l'obtenir. La moitié mécanisable de TF-0588.
  const secrets = [...gabarit.keys()].filter(EST_UN_SECRET);
  const muets = secrets.filter((k) => !DIT_OU_L_OBTENIR.test(gabarit.get(k) || ""));
  if (!secrets.length) so("PC4", "aucune clé de secret au gabarit — rien à documenter");
  else if (muets.length) {
    ko("PC4", `${muets.length} secret(s) sur ${secrets.length} sans DE QUOI l'obtenir en commentaire : ${muets.join(", ")}. `
      + "Décrire un secret attendu EN PROSE, dans une conversation, a coûté trois aller-retours et deux jetons créés "
      + "pour rien le 25/08 : la prose ne survit pas à la conversation et laisse le nom exact à l'interprétation. "
      + "Écrire au-dessus de la clé où la créer, quelles portées exactes, et la commande qui vérifie la portée accordée — "
      + "la demande à l'humain se réduit alors à « colle la valeur ici ».");
  } else ok("PC4", `les ${secrets.length} secret(s) du gabarit disent où les obtenir`);

  return {
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS",
    findings: F, gabarit: gabaritNom,
    compte: { gabarit: gabarit.size, reel: reel ? reel.size : null, lues: lues.size },
  };
}

export const NON_JUGE = [
  "la VALEUR d'une clé : ce contrôle ne lit jamais un `.env` pour son contenu, seulement pour ses NOMS de clés — un contrôle qui lirait les valeurs deviendrait lui-même un chemin de fuite",
  "si une clé lue par le code est OBLIGATOIRE ou optionnelle : le code seul le dit, et l'inférer produirait des faux positifs sur toute clé à valeur de repli",
  "les clés lues par un chemin DYNAMIQUE (`process.env[nom]` où `nom` est une variable) : indétectables par balayage, et c'est déclaré plutôt que promis",
  "les clés lues UNIQUEMENT dans des fichiers de TEST (`tests/`, `recette/`, `test_*`, `*.test.*`) : une variable de fixture n'est pas un contrat de configuration, et l'exiger au gabarit rendrait le gabarit faux. Exclusion nommée dans `EST_UN_FICHIER_DE_TEST`, mesurée sur le parc — 5 constats sur 7 venaient de là chez une forge",
  "les VARIABLES DU SYSTÈME (`HOME`, `USERPROFILE`, `CI`, `NODE_ENV`…) sont écartées par une liste FERMÉE et nommée (`DU_SYSTEME`) : elles ne sont pas de la configuration de projet, et les compter ferait accuser tout dépôt qui lit son environnement d'exécution. Une exclusion nommée signale une cause non traitée (N-13) — ici la cause EST la nature de la variable, et elle est déclarée",
  "PC3 AVERTIT sans bloquer : une clé que le code ne lit pas peut être lue par un déploiement, un conteneur ou un service tiers — accuser ferait crier l'oracle sur des gabarits justes",
];

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const r = juger(cible);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-parite-configuration", version: "1.0.0",
      cible: String(cible), ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-parite-configuration — ${cible}`);
    console.log(`verdict : ${r.verdict}${r.gabarit ? ` (gabarit ${r.gabarit})` : ""}`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SKIP" ? 2 : 0);
}
