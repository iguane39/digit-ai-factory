#!/usr/bin/env node
/**
 * oracle-controles-injoignables.mjs — un contrôle que RIEN n'appelle n'est pas un contrôle.
 *
 * ============================================================================================
 * POURQUOI (TF-0583, lot produit-02 du 25/08/2026)
 * ============================================================================================
 *
 * DEUX DÉFAUTS CUMULÉS, mesurés sur un dépôt produit, et le second explique pourquoi le premier
 * n'avait jamais été remarqué :
 *
 *   1. `build/check-contrast.mjs` était cité par ZÉRO fichier du dépôt — ni le workflow, ni le
 *      manifeste de paquets, ni aucune documentation. Il existait, il était juste ;
 *   2. sa ligne 23 codait le chemin du navigateur EN DUR
 *      (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`), chemin absent de la
 *      machine de travail. Il échouait au lancement, sans message exploitable.
 *
 * *Un oracle que rien n'appelle n'est pas un oracle, c'est un fichier.* Et la bonne pratique
 * existait DANS LE MÊME DÉPÔT, à un dossier de distance : son voisin `build/ci/oracle-consent.mjs`
 * énumérait des candidats avec une variable d'environnement en tête et un message explicite si
 * rien n'était trouvé.
 *
 * LA FAMILLE EST DÉJÀ CONNUE DU PARC, et c'est ce qui rend la règle générique plutôt qu'anecdotique.
 * Le 25/08 au matin, un garde de rédaction existait et n'avait pas été appelé — septième morsure
 * d'une classe d'octets. Le même jour, un contrôle de conformité déclarait « non vérifié » sur des
 * cibles qu'il ne savait pas localiser. *Le mécanisme existait ; personne ne l'avait branché.*
 *
 * ============================================================================================
 * CE QUI EST JUGÉ
 * ============================================================================================
 *
 *   CI1 · un fichier qui SE PRÉSENTE comme un contrôle — nom en `oracle-*`, `check-*`, `verifier-*`,
 *         `valider-*`, ou `*-oracle` — est cité par au moins un AUTRE fichier du dépôt. Un fichier
 *         que rien n'appelle et qui n'est pas un point d'entrée déclaré est signalé.
 *   CI2 · aucun contrôle ne code en dur le chemin d'un outil externe (navigateur, interpréteur,
 *         binaire). Le motif attendu est : variable d'environnement d'abord, liste de repli
 *         ensuite, échec BRUYANT sinon.
 *   CI3 · chaque oracle DÉCLARE ses codes de sortie, « je ne peux pas mesurer » compris. Un oracle
 *         qui ne le nomme pas laisse choisir entre PASS et FAIL — et le FAIL fait passer une panne
 *         d'environnement pour un défaut du produit (TF-0648).
 *   CI5 · chaque contrôle POSSÈDE un chemin d'échec explicite — une sortie non nulle écrite dans sa
 *         source (`process.exit(<non 0>)`, `process.exitCode =`, `sys.exit(<non 0>)`,
 *         `raise SystemExit(<non 0>)`, `exit 1`). Être DÉCLARÉ (CI3) n'est pas être RENDU : un
 *         contrôle sans chemin d'échec ne sait que réussir ou planter en trace brute, et il rassure
 *         au lieu de juger (TF-0795, 05/09/2026 — deux contrôles d'un produit déclaraient leurs
 *         codes et n'avaient AUCUN `sys.exit` conditionnel ; CI3 les tenait pour conformes).
 *
 * NON JUGÉ, et déclaré :
 *   · si le contrôle est JUSTE : ce n'est pas le sujet. Un contrôle faux mais joué se corrige ;
 *     un contrôle juste que rien ne joue ne se corrige jamais, faute d'être vu ;
 *   · les appels par découverte dynamique — un lanceur qui balaie un dossier et joue ce qu'il
 *     trouve. Ils sont indétectables par citation, et c'est pourquoi CI1 SIGNALE au lieu d'accuser
 *     dès qu'un lanceur de ce genre existe dans le dépôt ;
 *   · les chemins d'outil dans un fichier de TEST : une fixture peut nommer un chemin faux exprès.
 *
 * Usage : node oracle-controles-injoignables.mjs [dossier] [--json]
 * Exit : 0 = PASS · 1 = FAIL.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const cible = args.find((a) => !a.startsWith("--")) || join(ICI, "..");

const SAUTES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build_out",
  ".next", "vendor", ".pytest_cache", ".ruff_cache", "old", "Old", "output"]);

/** Ce qui SE PRÉSENTE comme un contrôle. Le nom est la promesse ; cet oracle la prend au mot. */
export const SE_PRESENTE_COMME_UN_CONTROLE = (nom) =>
  /^(oracle|check|verifier|valider|verify|lint)[-_]/i.test(nom) || /[-_](oracle|check)\.(mjs|cjs|js|py)$/i.test(nom);

/** Un fichier de test : ni un contrôle à brancher, ni un lieu où un chemin faux est un défaut. */
export const EST_UN_TEST = (chemin) => {
  const n = String(chemin).replaceAll("\\", "/").toLowerCase();
  return /(^|\/)(tests?|recette|recettes|spec|specs|__tests__|fixtures?)\//.test(n)
    || /(^|\/)test_[^/]*$/.test(n) || /[.-](test|spec)\.[a-z]+$/.test(n);
};

/**
 * UN CHEMIN D'OUTIL EXTERNE CODÉ EN DUR. Le motif cherche un chemin absolu désignant un exécutable
 * — c'est ce qui rend un contrôle injouable ailleurs que sur la machine de son auteur.
 */
export const CHEMIN_OUTIL_EN_DUR = /["'`][A-Za-z]:[\\/][^"'`\n]{4,}\.(exe|cmd|bat)["'`]|["'`]\/(usr|opt|Applications)\/[^"'`\n]{4,}["'`]/;

//: La bonne forme : une variable d'environnement consultée pour trouver l'outil.
const PAR_VARIABLE = /process\.env\.[A-Z_]*(?:CHROME|CHROMIUM|EDGE|BROWSER|PLAYWRIGHT|PUPPETEER|NODE|PYTHON|BIN)[A-Z_]*|os\.environ(?:\.get\(|\[)\s*["'][A-Z_]*(?:CHROME|BROWSER|PYTHON|BIN)[A-Z_]*/;

const EXT = /\.(mjs|cjs|js|ts|py)$/i;

function fichiers(racine) {
  const sortie = [];
  const descendre = (d, niveau) => {
    if (niveau > 6) return;
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (SAUTES.has(e.name)) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) descendre(p, niveau + 1);
      else sortie.push(p);
    }
  };
  descendre(racine, 1);
  return sortie;
}

/**
 * Un dépôt possède-t-il un LANCEUR PAR DÉCOUVERTE — un fichier qui balaie un dossier et joue ce
 * qu'il trouve ? S'il en a un, une absence de citation ne prouve plus rien, et CI1 le dit.
 */
export function aUnLanceurParDecouverte(textes) {
  return [...textes.values()].some((t) => /readdirSync\([^)]*\)[\s\S]{0,200}?(oracle|check|test)/i.test(t)
    || /glob\.glob\(|Path\([^)]*\)\.rglob\(/.test(t));
}

export function juger(racine) {
  const tous = fichiers(racine);
  const textes = new Map();
  for (const p of tous) {
    if (!EXT.test(p) && !/\.(ya?ml|json|md|toml|cfg|ini|sh|ps1)$/i.test(p)) continue;
    try { textes.set(p, readFileSync(p, "utf8")); } catch { /* illisible : ignoré */ }
  }
  const controles = tous.filter((p) => EXT.test(p) && SE_PRESENTE_COMME_UN_CONTROLE(basename(p)) && !EST_UN_TEST(p));
  const rel = (p) => relative(racine, p).replaceAll("\\", "/");
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => F.push({ regle, statut: "FAIL", message });
  const so = (regle, message) => F.push({ regle, statut: "SANS_OBJET", message });

  if (!controles.length) {
    so("CI0", `aucun fichier ne se présente comme un contrôle sous ${racine} — rien à joindre`);
    return { verdict: "PASS", findings: F, controles: 0 };
  }

  // ---- CI1 : est-il cité par quelqu'un ? --------------------------------------------------
  const decouverte = aUnLanceurParDecouverte(textes);
  const orphelins = controles.filter((p) => {
    const nom = basename(p);
    const sansExt = nom.replace(EXT, "");
    for (const [autre, t] of textes) {
      if (autre === p) continue;
      if (t.includes(nom) || new RegExp(`\\b${sansExt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(t)) return false;
    }
    return true;
  });
  if (!orphelins.length) ok("CI1", `les ${controles.length} contrôle(s) du dépôt sont cités par au moins un autre fichier`);
  else if (decouverte) {
    F.push({ regle: "CI1", statut: "AVERTISSEMENT",
      message: `${orphelins.length} contrôle(s) sur ${controles.length} cité(s) par AUCUN autre fichier : `
        + `${orphelins.map(rel).join(", ")}. Ce dépôt possède un lanceur par DÉCOUVERTE (il balaie un dossier `
        + "et joue ce qu'il trouve), donc l'absence de citation ne prouve rien — c'est signalé et non accusé." });
  } else {
    ko("CI1", `${orphelins.length} contrôle(s) sur ${controles.length} cité(s) par AUCUN autre fichier du dépôt : `
      + `${orphelins.map(rel).join(", ")}. Un contrôle que rien n'appelle n'est pas un contrôle, c'est un fichier — `
      + "et sa présence donne l'assurance trompeuse que le sujet est couvert. Le brancher à une cible de "
      + "vérification, ou l'ôter. Mesuré le 25/08 : un vérificateur de contraste cité par zéro fichier, "
      + "pendant qu'un texte à ratio 1,0 vivait en production.");
  }

  // ---- CI2 : le chemin d'outil externe ---------------------------------------------------
  const enDur = [];
  for (const p of controles) {
    const t = textes.get(p) || "";
    const lignes = t.split(/\r?\n/);
    for (const [i, ligne] of lignes.entries()) {
      if (!CHEMIN_OUTIL_EN_DUR.test(ligne)) continue;
      if (/outil-en-dur-ok/.test(ligne)) continue;
      // UN CHEMIN CITÉ DANS UN COMMENTAIRE N'EST PAS UN CHEMIN CODÉ EN DUR — c'est souvent
      // l'inverse : le commentaire DÉCRIT le défaut pour l'interdire. Mesure sur le pilot avant
      // livraison (N-23) : les 2 constats rendus étaient tous deux de la prose, dont l'un dans
      // l'en-tête de CET oracle, qui cite le chemin Edge du cas fondateur. Accuser la doctrine
      // qui décrit un défaut est la forme la plus sûre de se faire désactiver.
      if (/^\s*(\/\/|#|\*|<!--)/.test(ligne)) continue;
      enDur.push(`${rel(p)}:${i + 1}`);
    }
  }
  if (!enDur.length) ok("CI2", "aucun contrôle ne code en dur le chemin d'un outil externe");
  else {
    const avecVariable = controles.filter((p) => PAR_VARIABLE.test(textes.get(p) || "")).map(rel);
    ko("CI2", `${enDur.length} chemin(s) d'outil externe codé(s) EN DUR dans un contrôle : ${enDur.join(", ")}. `
      + "Un contrôle qui code le chemin de son navigateur ou de son interpréteur ne tourne que sur la machine de "
      + "son auteur, et il échoue ailleurs SANS message exploitable — donc personne ne le rebranche. La forme "
      + "attendue : variable d'environnement d'abord, liste de repli ensuite, échec BRUYANT sinon."
      + (avecVariable.length ? ` La bonne pratique existe DÉJÀ dans ce dépôt : ${avecVariable.join(", ")}.` : "")
      + " Un chemin volontairement littéral se marque `outil-en-dur-ok` en fin de ligne.");
  }

  // ---- CI3 — « JE NE PEUX PAS MESURER » N'EST PAS « LA MESURE EST MAUVAISE » (TF-0648) --------
  //
  // LE FAIT, remonté par un produit. Un oracle a échoué en local sur « Failed to launch the browser
  // process: Code: 0 », avec un **stderr VIDE**. Cause réelle : 81 processus de navigateur ouverts
  // empêchaient d'en lancer un de plus. Le même oracle passait au vert en intégration continue, où
  // aucun navigateur ne tourne.
  //
  // CE QUE ÇA A COÛTÉ : un diagnostic entier pour établir qu'il ne s'agissait PAS d'une régression
  // introduite par les modifications en cours, puis l'obligation de rapporter le contrôle comme
  // « ni passé ni échoué » — un verdict qu'aucun tableau de bord ne sait lire et qu'aucune étape ne
  // sait consommer.
  //
  // LE MÉCANISME EXISTE DÉJÀ DANS CE PARC : le lanceur d'oracles mappe l'exit 2 sur SKIP. Ce qui
  // manquait, c'est que les oracles s'en SERVENT et le DISENT. Un contrat d'oracle qui ne nomme pas
  // son code « je ne peux pas mesurer » laisse son auteur choisir entre 0 et 1 — et le 1 fait passer
  // une panne d'environnement pour un défaut du produit.
  //
  // CE QUI EST JUGÉ : la PRÉSENCE de la déclaration dans l'en-tête, jamais que l'oracle l'emploie
  // correctement — un oracle peut dire que le contrat manque, jamais qu'il est tenu. Mesure d'entrée
  // (N-23) sur le pilot : 23 oracles sur 31 déclaraient déjà leurs codes ; six vrais oracles ne le
  // faisaient pas, et ce sont eux que cette règle a fait écrire.
  // Ce qui compte est une DÉCLARATION explicite, pas la présence des chiffres quelque part dans le
  // fichier : une ligne qui commence par « Exit : » ou « Code de sortie : » et nomme au moins 0 et
  // 1. Un oracle SANS chemin « je ne peux pas mesurer » satisfait la règle en le DISANT — c'est
  // même la forme la plus utile, puisqu'elle interdit de lire un 1 comme une panne d'environnement.
  // LE MOTIF EST CALÉ SUR CE QUE LE DÉPÔT ÉCRIT, pas sur ce qu'il devrait écrire. Relevé avant de
  // livrer : les formes en usage sont « exit 0/1/2 », « exit 0 = PASS · 1 = FAIL · 2 = SKIP » et
  // « exit 0 PASS · 1 FAIL · 2 non jugeable ». Un premier jet exigeait la déclaration en TÊTE de
  // ligne et rejetait les trois, parce que la maison l'écrit après « Sortie : » ou « Contrat : ».
  // Une règle qui impose une forme que le dépôt n'emploie pas ne mesure pas la conformité : elle
  // mesure l'écart à son auteur.
  const DECLARE_SES_CODES = /\bexit\b[^\n]{0,50}?\b0\b[^\n]{0,50}?\b1\b|codes? de sortie[^\n]{0,50}?\b0\b/i;
  const SANS_CONTRAT = controles
    .filter((p) => /oracles[\\/]oracle-[^\\/]*\.mjs$/.test(p) && !/\.test\.mjs$/.test(p))
        // LE FICHIER ENTIER, ET NON SES 4 000 PREMIERS CARACTERES. Premier jet : la fenetre coupait
    // avant la declaration de deux oracles dont l'en-tete depasse cette taille — mesure faite,
    // 5 329 et 7 996 caracteres. Ils etaient donc accuses de ne pas declarer ce qu'ils declaraient.
    // Le motif est assez precis pour lire tout le fichier sans risque : il exige « exit » puis 0
    // puis 1 sur la MEME ligne, ce qu'un `process.exit(2)` ne produit jamais.
    .filter((p) => !DECLARE_SES_CODES.test(textes.get(p) || ""))
    .map(rel);
  if (!SANS_CONTRAT.length) ok("CI3", "chaque oracle déclare ses codes de sortie, « je ne peux pas mesurer » compris");
  else ko("CI3", `${SANS_CONTRAT.length} oracle(s) ne déclarent pas leurs codes de sortie dans leur en-tête : `
    + `${SANS_CONTRAT.join(", ")}. Un oracle qui ne nomme pas son code « je ne peux pas mesurer » laisse choisir `
    + "entre PASS et FAIL — et le FAIL fait passer une panne d'environnement pour un défaut du produit. Mesuré : "
    + "un oracle a échoué sur un navigateur impossible à lancer, avec un stderr VIDE, et le contrôle a dû être "
    + "rapporté « ni passé ni échoué » — un verdict qu'aucune étape ne sait consommer (TF-0648)");

  // ---- CI4 : une RECETTE l'exerce-t-elle ? (TF-0679, 26/08/2026) --------------------------
  //
  // CI1 demande « quelqu'un le cite-t-il ? ». CI4 demande AUTRE CHOSE, et l'écart entre les deux
  // est exactement là où ce défaut vit : un contrôle peut être INVOQUÉ — par une chaîne
  // d'intégration, par une commande de la documentation — et n'être joué par AUCUNE RECETTE.
  // Il pourrit alors sans bruit.
  //
  // LE FAIT. Deux scripts d'audit portaient TROIS défauts dormants, tous antérieurs au chantier
  // qui les a découverts : ils pilotaient un panneau retiré de la page depuis longtemps, donc ils
  // levaient une exception AVANT d'avoir rendu leur verdict ; leur liste de pages nommait en
  // français des pages à identifiants localisés, soit dix codes 404 à chaque exécution, un bruit
  // qui noyait les vrais constats ; et un hôte tiers était compté comme panne réseau à chaque
  // audit local, donc l'oracle criait toujours. Un contrôle qui crie toujours ne dit plus rien.
  //
  // MESURE D'ENTRÉE, et elle a décidé de la publication : sur ce dépôt, 0 contrôle sur 39 est
  // sans recette — l'invariant I1 le tient déjà. Sur le produit d'où vient le constat :
  // **26 contrôles, ZÉRO recette**, dont les deux scripts du fait fondateur. La règle ne mesure
  // donc pas l'écart à son auteur : elle est muette là où la discipline existe, et elle mord là
  // où le défaut a réellement coûté.
  // CE QUI COMPTE COMME RECETTE se lit SUR LE DÉPÔT, jamais sur une convention choisie ici.
  // Premier jet : `EST_UN_TEST`, qui ne reconnaît que `*.test.mjs` parce que CI1 s'en sert pour
  // EXCLURE les tests de la liste des contrôles. Résultat mesuré : `oracle-ecosysteme.mjs`
  // accusé de n'avoir aucune recette alors que `self-test-ecosysteme.mjs` le joue dans les deux
  // sens et le nomme à sa ligne 17. *Une règle qui impose une forme que le dépôt n'emploie pas
  // mesure l'écart à son auteur.* Le motif retenu est celui du harnais lui-même, qui est
  // l'autorité sur ce que ce dépôt appelle une recette.
  const MARQUEUR_RECETTE_INTERNE = '"--self' + '-test"';
  const EST_UNE_RECETTE = (p) => {
    const n = basename(p);
    return /\.test\.(mjs|cjs|js|ts|py)$/i.test(n) || /^(self-test|test_)/i.test(n)
      || /[\\/]tests?[\\/]/i.test(p);
  };
  const recettes = tous.filter((p) => EXT.test(p) && EST_UNE_RECETTE(p));
  const textesRecettes = recettes.map((p) => textes.get(p) || "").filter(Boolean);
  const exerce = (p) => {
    const nom = basename(p);
    const sansExt = nom.replace(EXT, "");
    if (textesRecettes.some((t) => t.includes(nom) || t.includes(sansExt))) return true;
    // Un contrôle qui porte sa propre recette interne s'exerce lui-même : c'est la forme que ce
    // dépôt emploie pour ses oracles, et l'ignorer accuserait la discipline qu'on veut répandre.
    //
    // LE MARQUEUR EST ASSEMBLÉ, JAMAIS ÉCRIT D'UN BLOC, et le motif vaut d'être lu. Le harnais
    // reconnaît un oracle « à recette interne » en cherchant cette chaîne EXACTE dans sa source.
    // L'écrire ici en clair a fait croire que CET oracle portait une recette interne : le harnais
    // a cessé de jouer ses fixtures et l'a lancé sur le dépôt — il mesurait alors le parc au lieu
    // de prouver qu'il sait échouer. Constaté par le cliquet, dont l'entrée est passée de 19 cas
    // à illisible. *Une sonde qui, par sa seule présence, change la façon dont on l'interroge
    // mesure autre chose que ce qu'elle croit.*
    return (textes.get(p) || "").includes(MARQUEUR_RECETTE_INTERNE);
  };
  const nus = controles.filter((p) => !exerce(p));
  if (!nus.length) ok("CI4", `les ${controles.length} contrôle(s) sont exercés par une recette, ou portent la leur`);
  else ko("CI4", `${nus.length} contrôle(s) sur ${controles.length} qu'AUCUNE recette n'exerce : `
    + `${nus.slice(0, 8).map(rel).join(", ")}${nus.length > 8 ? `, +${nus.length - 8}` : ""}. `
    + "Être cité (CI1) n'est pas être joué : un contrôle invoqué par une chaîne d'intégration mais "
    + "qu'aucune recette n'exerce POURRIT SANS QUE RIEN NE LE SIGNALE — sélecteur disparu de la "
    + "page, liste d'URL périmée, hôte tiers compté comme panne. Mesuré : deux scripts d'audit "
    + "portant TROIS défauts dormants, dont un qui les faisait échouer AVANT tout verdict (TF-0679)");

  // ---- CI5 — ÊTRE DÉCLARÉ N'EST PAS ÊTRE RENDU (TF-0795, 05/09/2026) -----------------------------
  //
  // LE FAIT, mesuré par un produit en écrivant les recettes double sens de ses contrôles : deux
  // scripts déclaraient leurs codes de sortie dans leur en-tête et n'avaient AUCUN `sys.exit`
  // conditionnel — aucun chemin d'échec n'existait, ils ne pouvaient que réussir ou planter en
  // trace brute sur données absentes. CI3 rendait PASS : elle lit la DÉCLARATION, pas l'existence
  // d'un chemin. Le sens rouge de ces contrôles n'existait pas, et c'est la recette qui l'a révélé —
  // le mécanisme même que TF-0679 décrit (un contrôle qui ne sait pas échouer rassure au lieu de
  // juger ; trois défauts dormants ont coûté un chantier entier avant d'être vus).
  //
  // CE QUI EST JUGÉ : la PRÉSENCE, dans la source du contrôle, d'une sortie non nulle écrite —
  // `process.exit(<expr non 0>)`, `process.exitCode = …`, `sys.exit(<expr non 0>)`,
  // `raise SystemExit(<expr non 0>)`, `exit <n≠0>` en shell. Une expression (`echecs ? 1 : 0`,
  // `1 if ko else 0`) compte : elle porte le 1. NON JUGÉ, et déclaré : que ce chemin soit
  // CONDITIONNEL et atteignable — un `sys.exit(1)` inconditionnel passe cette règle et fait un
  // contrôle qui échoue toujours ; c'est CI4 et la recette double sens qui l'attrapent.
  const A_UN_CHEMIN_D_ECHEC = [
    /process\.exit\(\s*(?!0\s*\))[^)]*\)/,               // process.exit(1) · process.exit(echecs ? 1 : 0) · process.exit(code)
    /process\.exitCode\s*=/,
    /\bsys\.exit\(\s*(?!0\s*\))[^)]*\)/,                 // sys.exit(1) · sys.exit(1 if ko else 0) · sys.exit(code)
    /\braise\s+SystemExit\(\s*(?!0\s*\))[^)]*\)/,
    /^\s*exit\s+[1-9][0-9]*\b/m,                          // shell
    /\bDie\(|\bthrow\s+new\s+Error\(.*exit/i,             // formes rares, comptées large plutôt qu'accusées
  ];
  const sansEchec = controles
    .filter((p) => /\.(mjs|cjs|js|py|sh|ps1)$/i.test(p))
    .filter((p) => !A_UN_CHEMIN_D_ECHEC.some((re) => re.test((textes.get(p) || "").replace(/^\s*(#|\/\/|\*).*$/gm, ""))))
    .map(rel);
  if (!sansEchec.length) ok("CI5", "chaque contrôle possède un chemin d'échec explicite (sortie non nulle écrite dans sa source)");
  else ko("CI5", `${sansEchec.length} contrôle(s) sur ${controles.length} SANS chemin d'échec : ${sansEchec.slice(0, 8).join(", ")}${sansEchec.length > 8 ? `, +${sansEchec.length - 8}` : ""}. `
    + "Aucune sortie non nulle n'est écrite dans leur source : ils ne savent que réussir ou planter en trace brute, et un contrôle qui ne sait pas "
    + "échouer rassure au lieu de juger. Être déclaré (CI3) n'est pas être rendu — écrire le chemin d'échec (sys.exit(1) / process.exit(1) sous condition) "
    + "et le jouer dans une recette double sens (TF-0795)");

  return { verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F, controles: controles.length };
}

export const NON_JUGE = [
  "CI5 juge la PRÉSENCE d'une sortie non nulle écrite dans la source, jamais qu'elle soit CONDITIONNELLE ni atteignable : un exit(1) inconditionnel passe et fait un contrôle qui échoue toujours — c'est CI4 et la recette double sens du contrôle qui l'attrapent (TF-0795)",
  "si le contrôle est JUSTE : ce n'est pas le sujet. Un contrôle faux mais joué se corrige ; un contrôle juste que rien ne joue ne se corrige jamais, faute d'être vu",
  "les appels par DÉCOUVERTE DYNAMIQUE (un lanceur qui balaie un dossier) : indétectables par citation. Dès qu'un tel lanceur existe dans le dépôt, CI1 SIGNALE au lieu d'accuser, et le dit",
  "un chemin cité dans un COMMENTAIRE : le commentaire décrit souvent le défaut pour l'interdire, et accuser la doctrine qui le décrit est la forme la plus sûre de se faire désactiver. Exclusion mesurée : les 2 constats du premier passage sur le pilot étaient tous deux de la prose",
  "les chemins d'outil dans un fichier de TEST : une fixture peut nommer un chemin faux exprès, et l'accuser ferait crier l'oracle sur une recette juste",
  "un contrôle appelé depuis un système d'intégration EXTERNE au dépôt (une tâche planifiée, un pipeline hébergé ailleurs) : la citation n'est pas dans le dépôt, donc invisible ici",
  "CI4 compte comme EXERCÉ un contrôle que le harnais joue sur le parc réel. C'est défendable — cela aurait attrapé le défaut fondateur, un script qui levait une exception AVANT tout verdict — mais cela prouve seulement qu'il NE SE CASSE PAS, jamais qu'il sait ÉCHOUER quand il le doit. La preuve du double sens est l'objet de l'invariant I1, pas de cette règle",
  "CI4 ne dit pas si la recette qui exerce un contrôle le fait BIEN : elle peut le nommer sans jouer son sens rouge. Le compte de cas d'une recette, lui, est tenu par le cliquet de `lib-baseline-recettes.mjs` (TF-0681) — un autre dispositif, sur un autre objet",
];

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const r = juger(cible);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-controles-injoignables", version: "1.0.0",
      cible: String(cible), ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-controles-injoignables — ${cible}`);
    console.log(`verdict : ${r.verdict} (${r.controles} contrôle(s) examiné(s))`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
