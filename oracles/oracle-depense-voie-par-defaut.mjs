#!/usr/bin/env node
/**
 * oracle-depense-voie-par-defaut.mjs — UN AUDIT LANCÉ SANS OPTION NE COÛTE RIEN (**R-34**).
 *
 * ============================================================================================
 * POURQUOI CE CONTRÔLE EXISTE, ET POURQUOI IL EST VERT LE JOUR DE SA NAISSANCE
 * ============================================================================================
 *
 * R-34 pose qu'un pan d'audit appelant un modèle payant n'entre JAMAIS dans la voie par défaut :
 * il s'active explicitement, sous plafond de dépense, et le rapport publie ce qu'il a consommé.
 * Son corollaire est ce qui rend la règle utile au quotidien : **un audit lancé sans option ne
 * coûte rien**, et c'est ce qui permet de le rejouer sans arbitrage.
 *
 * Écrite le 24/08/2026, la règle n'était jouée par RIEN — mesuré le 22/09 par
 * `oracle-regle-sans-juge`, qui la comptait parmi les règles que la discipline seule tient. La
 * décision humaine D-17 (a) a tranché : écrire le contrôle plutôt que l'exemption.
 *
 * IL REND VERT SUR LE PARC, et c'est un état, pas une réussite : aucun appel payant n'a été trouvé
 * dans la forge d'audit au jour de sa naissance. C'est donc un CLIQUET — il n'existe pas pour
 * constater un défaut présent, mais pour que le jour où un pan payant arrivera, il n'arrive pas
 * dans la voie par défaut sans que personne le voie. Ses fixtures rouges sont la seule preuve
 * qu'il sait échouer, et elles comptent plus que son vert.
 *
 * ============================================================================================
 * CE QUI EST MESURÉ
 * ============================================================================================
 *
 *   DP1 · aucun appel à un modèle PAYANT n'est atteignable sans option. Un appel est reconnu par
 *         sa marque d'accès — une clé d'API, un point d'entrée d'API distante, un client de SDK —
 *         et il est réputé GARDÉ si le fichier lit une option de ligne de commande, ou si l'appel
 *         vit dans une fonction qu'un garde d'option protège. Un appel au niveau module n'est
 *         gardé par rien : il part au chargement.
 *   DP2 · tout fichier portant un appel payant PUBLIE ce qu'il consomme — le mot du coût, des
 *         jetons ou du plafond doit s'y lire. Un pan qui dépense sans le dire rend le plafond
 *         invérifiable après coup.
 *
 * Recette à double sens : `oracles\oracle-depense-voie-par-defaut.test.mjs`.
 *
 * Usage : node oracles\oracle-depense-voie-par-defaut.mjs [<racine du parc>] [--json]
 *   exit 0 PASS · exit 1 FAIL · exit 2 SANS OBJET — « je ne peux pas mesurer » a son code a lui,
 *   sans quoi une panne d'environnement se lit comme un defaut de l'artefact juge (TF-0648).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

/** Les dépôts dont la voie par défaut est jugée : ceux qui AUDITENT, donc ceux qui peuvent dépenser. */
export const DEPOTS_AUDITEURS = ["digit-ai-forge-audit", "digit-ai-forge-agents"];

/** La marque d'un appel à un modèle payant. Une clé, un point d'entrée distant, un client de SDK.
 *  Gemini et Azure OpenAI ajoutés le 03/11/2026 : le motif ne reconnaissait qu'Anthropic et OpenAI,
 *  et un appel à Gemini dans un dépôt auditeur passait sans être vu (étude 20261103 OpenAI et Gemini). */
export const RE_APPEL_PAYANT = /ANTHROPIC_API_KEY|OPENAI_API_KEY|GEMINI_API_KEY|api\.anthropic\.com|api\.openai\.com|\.openai\.azure\.com|generativelanguage\.googleapis\.com|new\s+(?:Anthropic|OpenAI|AzureOpenAI|GoogleGenAI)\s*\(|from\s+["']@anthropic-ai\/|from\s+["']openai["']|from\s+["']@google\/(?:genai|generative-ai)["']|import\s+anthropic\b|import\s+openai\b|from\s+google\s+import\s+genai\b|import\s+google\.generativeai\b/;

/** Un garde d'option : le fichier lit un drapeau de ligne de commande avant d'agir. */
export const RE_GARDE_OPTION = /(?:argv|args|process\.argv|sys\.argv)[^\n]{0,80}(?:includes|indexOf|in\s|contains)[^\n]{0,40}["'`]--/;

/** La publication de ce qui est consommé. */
export const RE_PUBLIE_LA_DEPENSE = /\bco[ûu]ts?\b|\bjetons?\b|\btokens?\b|\bplafond\b|\bbudget\b|\bconsomm/i;

// TF-2113 (04/11/2026) — NOMMER UNE CLÉ POUR L'ÉCARTER N'EST PAS L'APPELER. `make-it-better/scripts/lancer.mjs:57` déclare la liste
// `VARIABLES_ECARTEES = ['ANTHROPIC_API_KEY', …]` puis fait `delete env[k]` : le script RETIRE la clé de l'environnement du tour
// (l'abonnement, jamais l'API payante), et l'oracle l'accusait d'un appel payant « au niveau module » (DP1 FAIL). Une ligne qui retire la
// clé (`delete process.env.X`, `os.environ.pop`, `del os.environ[…]`), la nomme dans une liste d'écartement (nom en ECART, RETIR, EXCLU,
// SUPPR…, valeur en liste), ou construit un environnement SANS elle (`{ X, ...reste } = env`, `k !== 'X'`) n'est pas un appel. Une vraie
// LECTURE (`process.env.X`, `env['X']`, `os.environ.get('X')`, `getenv('X')`) reste accusée, même dans un fichier qui écarte aussi la clé.
const MARQUE_CLE = /(?:ANTHROPIC|OPENAI|GEMINI)_API_KEY/;
const CLE = "(?:ANTHROPIC|OPENAI|GEMINI)_API_KEY";
const RE_LECTURE_CLE = new RegExp(`(?:env|environ)\\s*(?:\\.\\s*(?:get\\s*\\(\\s*)?|\\[\\s*|\\(\\s*)["'\`]?${CLE}|getenv\\s*\\(\\s*["'\`]${CLE}`);
/** Les gestes qui RETIRENT une variable, ou construisent un environnement SANS elle : leur texte est ôté avant de relire la ligne. */
const RE_GESTES_D_ECARTEMENT = [
  /\bdelete\s+[\w.]*env\s*(?:\.\s*\w+|\[[^\]]*\])/g,                                   // delete process.env.X · delete env['X']
  /\bdel\s+[\w.]*environ\s*\[[^\]]*\]/g,                                               // del os.environ['X']
  /\b[\w.]*(?:environ|env)\s*\.\s*pop\s*\([^)]*\)/g,                                   // os.environ.pop('X', None)
  new RegExp(`\\{[^}]*${CLE}[^}]*\\.\\.\\.\\w+[^}]*\\}\\s*=\\s*(?:process\\.)?env\\b`, "g"),   // const { X, ...reste } = process.env
  new RegExp(`(?:!==?|\\bnot\\s+in\\b)\\s*[\\[({]?\\s*["'\`]${CLE}["'\`]`, "g"),               // k !== 'X' · k not in ('X',)
];
const RE_LISTE_ECARTEMENT = /^\s*(?:export\s+)?(?:(?:const|let|var)\s+)?\w*(?:ECART|RETIR|EXCLU|SUPPR|ENLEV|INTERD|SCRUB|STRIP|DROP|DENY|BLOCK|IGNOR)\w*\s*(?::[^=]+)?=\s*(?:new\s+(?:Set|Array)\s*\(\s*|frozenset\s*\(\s*|set\s*\(\s*)?[\[({]/i;
const profondeur = (l) => (l.match(/[\[({]/g) || []).length - (l.match(/[\])}]/g) || []).length;

/** Les lignes du texte qui portent la marque d'un appel payant, privées des lignes qui ÉCARTENT la clé (TF-2113). Rend [{ ligne, texte }]. */
export function lignesPayantes(texte) {
  const sortie = [];
  let reste = 0;   // profondeur restant à fermer d'une liste d'écartement ouverte plus haut
  String(texte).split(/\r?\n/).forEach((l, i) => {
    if (/^\s*(?:\/\/|\*|#)/.test(l)) return;                         // un commentaire n'appelle rien
    const ouvre = RE_LISTE_ECARTEMENT.test(l);
    const enListe = reste > 0 || ouvre;
    if (ouvre) reste = Math.max(0, profondeur(l)); else if (reste > 0) reste = Math.max(0, reste + profondeur(l));
    if (!RE_APPEL_PAYANT.test(l)) return;
    let ligne = l;
    for (const re of RE_GESTES_D_ECARTEMENT) ligne = ligne.replace(re, "");
    if (!RE_APPEL_PAYANT.test(ligne)) return;                         // il ne restait que le geste d'écartement
    if (enListe && MARQUE_CLE.test(ligne) && !RE_LECTURE_CLE.test(ligne) && !RE_APPEL_PAYANT.test(ligne.replace(new RegExp(CLE, "g"), ""))) return;   // la clé n'est que NOMMÉE dans la liste
    sortie.push({ ligne: i + 1, texte: l });
  });
  return sortie;
}


/** Un appel payant AU NIVEAU MODULE n'est gardé par rien : il part au chargement. */
export function appelsAuNiveauModule(texte) {
  return lignesPayantes(texte)
    .filter(({ texte: l }) => /^(?:export\s+)?(?:const|let|var|from|import)\b/.test(l) || /^\S/.test(l));
}

export function fichiersDe(racine) {
  const trouves = [];
  const marcher = (d) => {
    let entrees;
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|\.venv|output|input|old|dist)$/.test(e.name)) marcher(p); }
      else if (/\.(mjs|cjs|js|py)$/.test(e.name)) trouves.push(p);
    }
  };
  marcher(racine);
  return trouves;
}

export function juger(racineDuParc, { depots = DEPOTS_AUDITEURS } = {}) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });

  const presents = depots.map((d) => join(racineDuParc, d)).filter((p) => existsSync(p));
  if (!presents.length) {
    return {
      verdict: "SANS_OBJET", lus: 0,
      findings: [{ regle: "DP0", statut: "SKIP", message: `aucun dépôt auditeur sous ${racineDuParc} — ce poste ne porte pas la forge d'audit, rien à mesurer ici` }],
    };
  }

  const nonGardes = [], muets = [];
  let lus = 0, porteurs = 0;
  for (const depot of presents) {
    for (const f of fichiersDe(depot)) {
      if (/\.test\.mjs$|[\\/]fixtures[\\/]/.test(f)) continue;       // une fixture écrit le défaut à dessein
      let t = "";
      try { t = readFileSync(f, "utf8"); } catch { continue; }
      lus += 1;
      if (!lignesPayantes(t).length) continue;
      porteurs += 1;
      const rel = relative(racineDuParc, f);
      const auModule = appelsAuNiveauModule(t);
      if (auModule.length) nonGardes.push({ rel, ligne: auModule[0].ligne, cause: "au niveau module" });
      else if (!RE_GARDE_OPTION.test(t)) nonGardes.push({ rel, ligne: 0, cause: "aucune option lue dans le fichier" });
      if (!RE_PUBLIE_LA_DEPENSE.test(t)) muets.push(rel);
    }
  }

  // ---- DP1 -------------------------------------------------------------------------------------
  if (nonGardes.length) {
    ko("DP1", nonGardes.map((n) => `${n.rel}${n.ligne ? `:${n.ligne}` : ""}`).join(", "),
      `${nonGardes.length} appel(s) à un modèle payant ATTEIGNABLE(s) sans option : `
      + nonGardes.map((n) => `${n.rel}${n.ligne ? `:${n.ligne}` : ""} — ${n.cause}`).join(" ; ")
      + `. R-34 pose qu'un pan payant s'active explicitement : son corollaire opposable est qu'un audit `
      + `lancé sans option ne coûte rien, et c'est ce qui permet de le rejouer sans arbitrage`);
  } else {
    ok("DP1", `${porteurs} fichier(s) portent un appel payant sur ${lus} lus, tous gardés par une option — `
      + "un audit lancé sans option ne coûte rien");
  }

  // ---- DP2 -------------------------------------------------------------------------------------
  if (muets.length) {
    ko("DP2", muets.join(", "),
      `${muets.length} fichier(s) appellent un modèle payant sans PUBLIER ce qu'ils consomment : ${muets.join(", ")}. `
      + "Un pan qui dépense sans le dire rend son plafond invérifiable après coup, et le rapport ne peut plus "
      + "être opposé à personne");
  } else {
    ok("DP2", porteurs ? `les ${porteurs} fichier(s) porteurs publient ce qu'ils consomment`
      : "aucun appel payant trouvé — il n'y a donc rien à publier, et le corollaire de R-34 tient par construction");
  }

  return { verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F, lus, porteurs };
}

export const NON_JUGE = [
  "le PLAFOND DE DÉPENSE lui-même (gate budget G0) : cet oracle lit du code, il ne connaît ni le montant configuré ni ce qui a été réellement dépensé. La règle garde donc une part que seule une mesure d'exécution atteindrait, et elle est déclarée plutôt que promise",
  "les modèles payants appelés par un chemin que le motif ne connaît pas — un client maison, une passerelle interne, un appel HTTP brut vers un domaine tiers. La liste des marques est COURTE et écrite : la deviner plus large produirait des faux positifs sur tout fichier parlant d'API",
  "les dépôts hors de la liste des auditeurs : un produit qui appellerait un modèle payant n'est pas jugé ici, parce que R-34 vise les PANS D'AUDIT et que l'étendre sans mandat serait écrire une règle que personne n'a posée",
  "le fait qu'une option lue soit BIEN celle qui garde l'appel : DP1 constate qu'un fichier porteur lit au moins une option, jamais que cette option protège la bonne ligne. La borne est basse et assumée ; son contraire — aucune option lue du tout — est certain",
  "l'ÉCARTEMENT d'une clé (TF-2113) est reconnu à sa forme — `delete process.env.X`, `os.environ.pop`, `{ X, ...reste } = env`, `k !== 'X'`, une liste dont le nom dit l'écartement (ECART, RETIR, EXCLU, SUPPR…) — jamais à son effet : une liste mal nommée qui servirait à LIRE la clé reste accusée, et une liste d'écartement qui ne serait jamais appliquée n'est pas détectée",
  "les recettes `*.test.mjs` et les fixtures, écartées par construction : une fixture écrit le défaut à dessein pour prouver que l'oracle sait échouer",
];

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const racine = resolve(args.find((a) => !a.startsWith("--")) || process.env.FORGE_ROOT || join(ICI, "..", ".."));
  const r = juger(racine);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-depense-voie-par-defaut", version: "1.0.0", regle: "R-34", parc: racine, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-depense-voie-par-defaut (R-34) — ${racine}`);
    console.log(`verdict : ${r.verdict} (${r.lus ?? 0} fichier(s) lus, ${r.porteurs ?? 0} porteur(s) d'un appel payant)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
