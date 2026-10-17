#!/usr/bin/env node
/**
 * verifier-exigences-fatales.mjs — le dossier de MEP tient les trois exigences FATALES du référentiel
 * d'audit de la maison que la doctrine de construction contredisait : déploiement par chaîne exclusive,
 * sauvegarde des actifs critiques, fournisseur d'identité (M-16, M-17, M-18 ; TF-1212 ; décision humaine
 * D-3 (a) du 17/10/2026).
 *
 * LE FAIT. Le 09/09/2026, un produit déclaré prêt (cinq étapes closes, oracles au vert, contrat de fin
 * de construction tenu) a échoué 12 contrôles fatals sur 175 au référentiel d'audit de la même maison.
 * Trois venaient de la doctrine elle-même : elle admettait une route de déploiement manuelle « à
 * porte », son oracle de mise en production ne regardait aucune sauvegarde, et elle ne disait rien du
 * fournisseur d'identité. La construction validait ce que l'audit refusait.
 *
 * LES EXIGENCES, TEXTE EXACT (forge-audit, `core/controls/`, pack controls-core 1.0.0, criticité Fatal) :
 *   CTL-D09-01 « Tout déploiement vers un environnement géré transite exclusivement par un pipeline
 *              CI/CD automatisé ; chaque exécution produit un journal immuable et horodaté (auteur,
 *              version, cible, résultat). »
 *   CTL-D05-09 « Chaque actif de données critique est sauvegardé conformément à un objectif de perte de
 *              données (RPO) explicitement déclaré, et la restauration est testée périodiquement. »
 *   CTL-D12-06 « Un objectif de perte de données tolérée (RPO) et de délai de restauration (RTO) est
 *              déclaré pour chaque actif critique, et la capacité de restauration est testée
 *              périodiquement avec preuve de conformité. »
 *   CTL-D16-09 « La base de données fait l'objet de sauvegardes régulières conformes à un RPO déclaré,
 *              et la procédure de restauration est testée périodiquement avec preuve de conformité au
 *              RTO. »
 *   CTL-D03-01 « L'authentification de tout accès humain est déléguée à un fournisseur d'identité
 *              central, avec MFA activé. »
 *
 * CE QUI EST JUGÉ, HORS LIGNE, sur les fichiers d'un produit qui porte un dossier de MEP :
 *   PE-1  le dossier porte la section « Chaîne de déploiement » (M-16) ;
 *   PE-2  elle nomme la chaîne (un fichier de pipeline du produit, ou la chaîne de l'hébergeur
 *         déclenchée par la poussée) ET cite une exécution (identifiant, numéro ou adresse) — ou dit
 *         « aucun environnement géré : <motif> », ou « Dérogation : <motif> » adossée à une décision
 *         (partiel au référentiel) ;
 *   PE-3  aucune commande de déploiement DIRECT vers un environnement géré (`railway up`, `az webapp
 *         deploy`, `vercel --prod`, `terraform apply`…) n'est prescrite par le dossier, ni
 *         `docker compose up` sous un titre de production. Une section dont le titre (ou un titre
 *         parent) porte une date antérieure au 17/10/2026 n'est pas accusée : elle décrit un run passé
 *         qui ne se réécrit pas (comme R-42) ; elle est comptée en antériorité ;
 *   SR-1  le dossier porte la section « Sauvegarde et restauration » (M-17) ;
 *   SR-2  elle cite la déclaration `forge-ops/sauvegarde@1` du produit (un `.json` présent), ou dit
 *         « aucun actif de données critique : <motif> » — refusé si le produit persiste des données
 *         (base relevée dans ses manifestes ou son code) ;
 *   SR-3  la déclaration citée passe l'oracle O-19 de forge-ops (`oracle-ops.mjs --sauvegarde`) ;
 *   FI-1  le dossier porte la section « Fournisseur d'identité » (M-18) ;
 *   FI-2  elle nomme le fournisseur d'identité central ET le MFA — ou dit « aucun accès humain
 *         authentifié : <motif> » ;
 *   FI-3  une authentification locale relevée dans le code (champ mot de passe, hachage de mot de
 *         passe) est soit absente, soit couverte par une procédure de compte local écrite à la section
 *         (secours, bris de glace) ; « aucun accès humain » est refusé quand le code en porte une.
 *
 * SÉVÉRITÉ. Le verbe rend son refus (exit 1). Le câblage de l'oracle de MEP (TM11, TM12, TM13
 * d'`oracle-trace-mutation-mep`) le lit en AVERTISSEMENT : règle neuve opposable à tous les produits,
 * précédent D-70 (b) ; le passage en blocage est une décision humaine, prise sur le taux d'accusation
 * mesuré (`ETAPE-MEP.md` § 3 terdecies).
 *
 * Usage : node scripts/verifier-exigences-fatales.mjs <produit> [--regle pipeline|sauvegarde|identite]
 *                                                      [--document <dossier.md>]
 * Sortie : JSON · exit 0 = conforme · 1 = au moins un refus · 2 = rien à juger (aucun dossier de MEP).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
export const ENTREE = "2026-10-17";
const REF = "ETAPE-MEP.md § 3 terdecies (TF-1212)";

const NON_JUGE = [
  "que la chaîne citée ait RÉELLEMENT déployé la version servie : le verbe exige qu'elle soit nommée et qu'une exécution soit citée, il ne lit pas le journal du moteur de chaîne",
  "un déploiement manuel fait sans être écrit au dossier : seules les commandes que le dossier PRESCRIT sont lues ; l'inventaire des accès de déploiement direct sur chaque environnement (vérification de CTL-D09-01) reste un geste d'audit",
  "une commande de déploiement direct absente de la liste du verbe, ou écrite hors d'un bloc ou d'un segment de code",
  "la VÉRITÉ de la déclaration de sauvegarde : O-19 juge ce qu'elle déclare, jamais la plateforme ; et la criticité des actifs reste au produit",
  "la configuration réelle du fournisseur d'identité et la politique MFA : le verbe exige qu'elles soient nommées, la capture de la configuration (preuve de CTL-D03-01) reste un geste d'audit",
  "une authentification locale écrite autrement que par un champ mot de passe ou une bibliothèque de hachage connue",
  "un dossier de MEP plus profond que quatre niveaux sous le produit",
];

const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next", "output", "input", "forge", ".terraform", "coverage", "old"]);
const lire = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const relDe = (racine, p) => relative(racine, p).split("\\").join("/");

function parcourir(racine, profondeur, filtre, ignores = IGNORES) {
  const out = [];
  const marcher = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!ignores.has(e.name) && reste > 0) marcher(p, reste - 1); }
      else if (e.isFile() && filtre(e.name, p)) out.push({ chemin: p, rel: relDe(racine, p) });
    }
  };
  marcher(racine, profondeur);
  return out;
}

function dossiersMep(racine) {
  return parcourir(racine, 4, (n) => /^DOSSIER-MEP.*\.md$/i.test(n),
    new Set(["node_modules", ".git", ".venv", "venv", "dist", "build", ".next", "old"])).map((f) => f.chemin);
}

// ---- Lecture d'un dossier : titres, sections, code ------------------------------------------------

/** Une date lue dans un titre : AAAA-MM-JJ, AAAAMMJJ (identifiant de run), JJ/MM/AAAA. */
export function dateDuTitre(t) {
  let m = /\b(20\d{2})-(\d{2})-(\d{2})\b/.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /\b(\d{2})\/(\d{2})\/(20\d{2})\b/.exec(t);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  m = /(?:^|[^\d])(20\d{2})(0[1-9]|1[0-2])([0-3]\d)(?:[a-z]\b|[^\d]|$)/.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return null;
}

/** Les lignes d'un dossier, chacune avec la pile de ses titres et l'état « dans un bloc de code ». */
function analyser(texte) {
  const lignes = texte.split(/\r?\n/);
  const pile = [];
  let code = false;
  return lignes.map((l, i) => {
    if (/^\s*```/.test(l)) { code = !code; return { i, l, code: false, fence: true, pile: [...pile] }; }
    if (!code) {
      const m = /^(#{1,6})\s+(.*\S)\s*$/.exec(l);
      if (m) {
        const niveau = m[1].length;
        while (pile.length && pile[pile.length - 1].niveau >= niveau) pile.pop();
        pile.push({ niveau, texte: m[2], i });
        return { i, l, code: false, titre: true, pile: [...pile] };
      }
    }
    return { i, l, code, pile: [...pile] };
  });
}

function sections(texte, motif) {
  const a = analyser(texte);
  const titres = a.filter((x) => x.titre);
  return titres.filter((t) => motif.test(t.pile[t.pile.length - 1].texte)).map((t) => {
    const niveau = t.pile[t.pile.length - 1].niveau;
    const fin = titres.find((u) => u.i > t.i && u.pile[u.pile.length - 1].niveau <= niveau);
    return { titre: t.pile[t.pile.length - 1].texte, ligne: t.i + 1, corps: a.slice(t.i + 1, fin ? fin.i : a.length).map((x) => x.l).join("\n") };
  });
}

// ---- M-16 : chaîne de déploiement exclusive -------------------------------------------------------

const FICHIERS_CHAINE = (n, p) => {
  const q = p.split("\\").join("/");
  return (/\/\.github\/workflows\/[^/]+\.ya?ml$/i.test(q))
    || /^azure-pipelines.*\.ya?ml$/i.test(n) || /^\.gitlab-ci\.ya?ml$/i.test(n) || /^bitbucket-pipelines\.ya?ml$/i.test(n)
    || (/\/\.circleci\/config\.ya?ml$/i.test(q)) || /^cloudbuild\.ya?ml$/i.test(n) || /^Jenkinsfile$/.test(n);
};
const DEPLOIE = /deploy|d[ée]ploi|railway\s+up|webapps-deploy|containerapp|static-web-apps|swa\s+deploy|vercel|netlify|flyctl|gcloud\s+run|terraform\s+apply|supabase\s+db\s+push|docker\s+push|az\s+webapp/i;

/** Les chaînes du produit : `[{ rel, deploie }]`. */
export function releverChaines(racine) {
  const ign = new Set([...IGNORES].filter((x) => x !== "forge"));
  return parcourir(racine, 5, FICHIERS_CHAINE, ign).map(({ chemin, rel }) => ({ rel, deploie: DEPLOIE.test(lire(chemin)) }));
}

/** Les commandes de déploiement DIRECT vers un environnement géré (jamais l'environnement local). */
export const COMMANDES_DIRECTES = [
  [/\brailway\s+up\b/i, "railway up"],
  [/\baz\s+webapp\s+(?:deploy|up)\b/i, "az webapp deploy/up"],
  [/\baz\s+webapp\s+deployment\s+source\b/i, "az webapp deployment source"],
  [/\baz\s+containerapp\s+(?:up|update)\b/i, "az containerapp up/update"],
  [/\baz\s+staticwebapp\b[^\n`]*\bdeploy/i, "az staticwebapp … deploy"],
  [/\bswa\s+deploy\b/i, "swa deploy"],
  [/\bfunc\s+azure\s+functionapp\s+publish\b/i, "func azure functionapp publish"],
  [/\baz\s+deployment\s+(?:group|sub)\s+create\b/i, "az deployment … create"],
  [/\bvercel\b[^\n`]*--prod\b/i, "vercel --prod"],
  [/\bnetlify\s+deploy\b/i, "netlify deploy"],
  [/\bfly(?:ctl)?\s+deploy\b/i, "fly deploy"],
  [/\bgcloud\s+(?:run|app)\s+deploy\b/i, "gcloud … deploy"],
  [/\bgit\s+push\s+heroku\b/i, "git push heroku"],
  [/\bsupabase\s+db\s+push\b/i, "supabase db push"],
  [/\bterraform\s+apply\b/i, "terraform apply"],
  [/\bkubectl\s+(?:apply|set\s+image)\b/i, "kubectl apply/set image"],
  [/\bhelm\s+(?:upgrade|install)\b/i, "helm upgrade/install"],
];
const COMPOSE_UP = /\bdocker(?:-compose|\s+compose)\b[^\n`]*\bup\b/i;
const TITRE_PRODUCTION = /production|mise en prod|\bprod\b/i;
const TITRE_LOCAL = /staging|qualif|recette|local/i;

/** Les commandes directes prescrites par un dossier : `[{ commande, ligne, anterieure, date }]`. */
export function commandesDirectes(texte) {
  const out = [];
  for (const x of analyser(texte)) {
    if (x.titre || x.fence) continue;
    const morceaux = x.code ? [x.l] : [...x.l.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    for (const brut of morceaux) {
      const m = brut.trim();
      if (!m || /^(#|\/\/|REM\b|::)/i.test(m)) continue;
      const titres = x.pile.map((p) => p.texte);
      const dates = titres.map(dateDuTitre).filter(Boolean);
      const anterieure = dates.some((d) => d < ENTREE);
      for (const [re, nom] of COMMANDES_DIRECTES) {
        if (re.test(m)) out.push({ commande: nom, ligne: x.i + 1, anterieure, date: dates.find((d) => d < ENTREE) || null });
      }
      const dernier = titres[titres.length - 1] || "";
      if (COMPOSE_UP.test(m) && titres.some((t) => TITRE_PRODUCTION.test(t)) && !TITRE_LOCAL.test(dernier)) {
        out.push({ commande: "docker compose up (sous un titre de production)", ligne: x.i + 1, anterieure, date: dates.find((d) => d < ENTREE) || null });
      }
    }
  }
  return out;
}

const SECTION_CHAINE = /cha[iî]ne de d[ée]ploiement|pipeline de d[ée]ploiement|d[ée]ploiement par (?:la )?cha[iî]ne/i;
const AUCUN_ENV_GERE = /aucun environnement g[ée]r[ée]\s*[:\-—–]\s*(\S.{9,})/i;
const DEROGATION = /d[ée]rogation\s*[:\-—–]\s*\S/i;
const DECISION = /\b(?:D-\d+|TF-\d{3,5})\b|d[ée]cision humaine du/i;
const CHAINE_HEBERGEUR = /(?:d[ée]clench[ée]e?|d[ée]ploie|d[ée]ploy[ée]e?)\s+(?:par|à|a|sur|au)\s+(?:la\s+|chaque\s+)?pouss[ée]e|d[ée]ploiement automatique|auto-?deploy/i;
const EXECUTION = /(?:ex[ée]cution|\brun\b|\bbuild\b|d[ée]ploiement|journal)[^\n]*?(?:#\d{2,}|\b\d{3,}\b|https?:\/\/\S+|\b[0-9a-f]{7,40}\b)/i;

function jugerChaine(racine, nom, texte, ko, ok, mesure) {
  const s = sections(texte, SECTION_CHAINE);
  const cmds = commandesDirectes(texte);
  const actives = cmds.filter((c) => !c.anterieure);
  mesure.commandes_directes += actives.length;
  mesure.commandes_anterieures += cmds.length - actives.length;
  const ref = `${REF}, M-16 ; CTL-D09-01 « Tout déploiement vers un environnement géré transite exclusivement par un pipeline CI/CD automatisé ; chaque exécution produit un journal immuable et horodaté (auteur, version, cible, résultat). »`;
  let derogation = false;
  const chaines = releverChaines(racine);
  mesure.chaines = chaines.length;
  if (!s.length) {
    ko("PE-1", nom, `le dossier ne porte aucune section « Chaîne de déploiement » : il ne dit ni quelle chaîne déploie, ni quelle exécution a déployé${chaines.length ? ` (chaîne(s) relevée(s) dans le produit : ${chaines.slice(0, 3).map((c) => c.rel).join(", ")})` : ""} — ${ref}`);
  } else {
    const corps = s.map((x) => x.titre + "\n" + x.corps).join("\n");
    if (AUCUN_ENV_GERE.test(corps)) {
      ok("PE-2", nom, `aucun environnement géré déclaré : ${AUCUN_ENV_GERE.exec(corps)[1].trim().slice(0, 120)}`);
    } else if (DEROGATION.test(corps) && DECISION.test(corps)) {
      derogation = true;
      ok("PE-2", nom, "dérogation déclarée et adossée à une décision — « partiel » au référentiel d'audit (exceptions documentées et dérogées), jamais « conforme »");
    } else {
      const nommee = chaines.find((c) => corps.includes(c.rel) || corps.includes(c.rel.split("/").pop()));
      const hebergeur = CHAINE_HEBERGEUR.test(corps);
      if (!nommee && !hebergeur) {
        ko("PE-2", nom, `la section ne nomme aucune chaîne : ni un fichier de pipeline du produit${chaines.length ? ` (relevés : ${chaines.slice(0, 4).map((c) => c.rel).join(", ")})` : " (aucun relevé)"}, ni la chaîne de l'hébergeur déclenchée par la poussée — ${ref}`);
      } else if (nommee && !nommee.deploie && !hebergeur) {
        ko("PE-2", nom, `la chaîne nommée (${nommee.rel}) ne porte aucune étape de déploiement : elle contrôle, elle ne déploie pas — ${ref}`);
      } else if (!EXECUTION.test(corps)) {
        ko("PE-2", nom, `la section nomme la chaîne mais ne cite aucune EXÉCUTION (identifiant, numéro ou adresse du run) : le journal immuable et horodaté de CTL-D09-01 n'est pas localisé — ${ref}`);
      } else {
        ok("PE-2", nom, `chaîne nommée (${nommee ? nommee.rel : "chaîne de l'hébergeur déclenchée par la poussée"}) et exécution citée`);
      }
    }
  }
  if (actives.length) {
    const liste = actives.slice(0, 4).map((c) => `\`${c.commande}\` (ligne ${c.ligne})`).join(", ") + (actives.length > 4 ? ", …" : "");
    if (derogation) ok("PE-3", nom, `commande(s) de déploiement direct couvertes par la dérogation déclarée : ${liste}`);
    else ko("PE-3", nom, `le dossier prescrit ${actives.length} commande(s) de déploiement DIRECT vers un environnement géré : ${liste}. La route manuelle n'existe plus : la commande s'exécute DANS la chaîne (secret de la chaîne, porte d'approbation ou poussée d'un commit nommé), jamais depuis un poste — ${ref}`);
  } else if (s.length) {
    ok("PE-3", nom, `aucune commande de déploiement direct prescrite${cmds.length ? ` (${cmds.length} antérieure(s) au ${ENTREE}, sous un titre daté, non accusée(s))` : ""}`);
  }
}

// ---- M-17 : sauvegarde et restauration ------------------------------------------------------------

const SECTION_SAUVEGARDE = /sauvegarde/i;
const AUCUN_ACTIF = /aucun actif(?: de donn[ée]es)?(?: critique)?\s*[:\-—–]\s*(\S.{9,})/i;
const MANIFESTES = (n) => /^(package\.json|requirements[^/]*\.txt|pyproject\.toml|Pipfile|(docker-)?compose[^/]*\.ya?ml|railway\.(json|toml)|fly\.toml)$/i.test(n) || /\.(tf|bicep)$/i.test(n);
const PERSISTANCE_MANIFESTE = /better-sqlite3|"sqlite3?"|\bpsycopg|\basyncpg\b|"pg"|\bmysql|\bmariadb\b|\bmongo(?:db|ose)\b|\bprisma\b|\bsqlalchemy\b|@supabase\/supabase-js|\bpostgres(?:ql)?\b|azurerm_(?:postgresql|mssql|mysql|cosmosdb)\w*|\bimage:\s*["']?(?:postgres|mysql|mariadb|mongo)/i;
const CODE = (n) => /\.(py|m?js|cjs|ts|tsx|jsx|php|cs|java|go|rb|vue|svelte|html?|cshtml)$/i.test(n);
const PERSISTANCE_CODE = /\bsqlite3\.connect\b|\bcreate_engine\s*\(|\bnew\s+Database\s*\(|\bDATABASE_URL\b|\bPrismaClient\b|\bmongoose\.connect\b/;

function relevePersistance(racine) {
  const vus = [];
  for (const { chemin, rel } of parcourir(racine, 5, MANIFESTES)) { if (PERSISTANCE_MANIFESTE.test(lire(chemin))) vus.push(rel); }
  for (const { chemin, rel } of parcourir(racine, 6, CODE)) {
    const t = lire(chemin);
    if (t.length < 2_000_000 && PERSISTANCE_CODE.test(t)) vus.push(rel);
    if (vus.length > 6) break;
  }
  return vus;
}

/**
 * L'oracle O-19 de forge-ops : la variable explicite `FORGE_OPS_ORACLE` d'abord — désigné et absent,
 * il est introuvable, sans repli silencieux sur un autre —, puis FORGE_ROOT, puis le dépôt frère.
 */
export function oracleOps(env = process.env) {
  if (env.FORGE_OPS_ORACLE) return existsSync(env.FORGE_OPS_ORACLE) ? env.FORGE_OPS_ORACLE : null;
  const candidats = [env.FORGE_ROOT && join(env.FORGE_ROOT, "digit-ai-forge-ops", "oracles", "oracle-ops.mjs"),
    join(ICI, "..", "..", "digit-ai-forge-ops", "oracles", "oracle-ops.mjs")].filter(Boolean);
  return candidats.find((c) => existsSync(c)) || null;
}

function jugerSauvegarde(racine, chemin, nom, texte, ko, ok, mesure, nonJuge) {
  const s = sections(texte, SECTION_SAUVEGARDE);
  const ref = `${REF}, M-17 ; CTL-D05-09, CTL-D12-06 et CTL-D16-09 (sauvegarde conforme à un RPO déclaré, RTO déclaré, restauration testée périodiquement avec preuve)`;
  if (!s.length) { ko("SR-1", nom, `le dossier ne porte aucune section « Sauvegarde et restauration » : aucun actif de données n'est déclaré sauvegardé, ni déclaré absent — ${ref}`); return; }
  const corps = s.map((x) => x.titre + "\n" + x.corps).join("\n");
  const aucun = AUCUN_ACTIF.exec(corps);
  if (aucun) {
    const persiste = relevePersistance(racine);
    mesure.persistance = persiste.length;
    if (persiste.length) ko("SR-2", nom, `« aucun actif de données critique » déclaré, mais le produit persiste des données (${persiste.slice(0, 4).join(", ")}) : déclarer l'actif et sa sauvegarde — ${ref}`);
    else ok("SR-2", nom, `aucun actif de données critique déclaré : ${aucun[1].trim().slice(0, 120)}`);
    return;
  }
  const citees = [...corps.matchAll(/([A-Za-z0-9_.\-\/\\]+\.json)\b/g)].map((m) => m[1].replace(/^`|`$/g, ""));
  const trouvee = citees.map((c) => [c, isAbsolute(c) ? c : resolve(racine, c), resolve(dirname(chemin), c)])
    .map(([c, a, b]) => ({ cite: c, chemin: existsSync(a) ? a : existsSync(b) ? b : null })).find((x) => x.chemin);
  if (!trouvee) {
    ko("SR-2", nom, `la section ne cite aucune déclaration de sauvegarde présente dans le produit (format forge-ops/sauvegarde@1${citees.length ? ` ; citées mais absentes : ${citees.slice(0, 3).join(", ")}` : ""}) ni « aucun actif de données critique : <motif> » — ${ref}`);
    return;
  }
  ok("SR-2", nom, `déclaration de sauvegarde citée : ${trouvee.cite}`);
  const o = oracleOps();
  if (!o) {
    nonJuge.push(`SR-3 : oracle O-19 de forge-ops introuvable (FORGE_OPS_ORACLE, FORGE_ROOT, dépôt frère) — le contenu de ${trouvee.cite} n'est PAS jugé, et c'est dit plutôt que tu`);
    mesure.o19 = "injoignable";
    return;
  }
  const r = spawnSync(process.execPath, [o, "--sauvegarde", trouvee.chemin, "--json-only"], { encoding: "utf8", timeout: 60000 });
  let j = null; try { j = JSON.parse(r.stdout || ""); } catch { /* dit ci-dessous */ }
  mesure.o19 = j ? j.verdict : `illisible (exit ${r.status})`;
  if (!j) { nonJuge.push(`SR-3 : O-19 n'a pas rendu de verdict lisible (exit ${r.status}) — ce n'est pas un constat sur ce produit`); return; }
  if (j.verdict === "PASS") ok("SR-3", nom, `O-19 PASS sur ${trouvee.cite}`);
  else ko("SR-3", nom, `O-19 ${j.verdict} sur ${trouvee.cite} : ${(j.findings || []).filter((f) => f.sev === "bloquant").slice(0, 3).map((f) => f.msg).join(" · ")} — ${ref}`);
}

// ---- M-18 : fournisseur d'identité ----------------------------------------------------------------

const SECTION_IDENTITE = /fournisseur d['’]identit|\bIdP\b|identit[ée] (?:centrale|f[ée]d[ée]r[ée]e)/i;
const AUCUN_ACCES = /aucun acc[èe]s humain(?: authentifi[ée])?\s*[:\-—–]\s*(\S.{9,})/i;
const IDPS = /\bEntra\b|Azure AD|Microsoft (?:Entra|identity)|Google (?:Workspace|Identity|Cloud Identity)|\bOkta\b|\bAuth0\b|Keycloak|Cognito|\bOIDC\b|OpenID|\bSAML\b|WorkOS|ProConnect|FranceConnect|Supabase Auth|Clerk|Ping ?Identity|OneLogin|JumpCloud/i;
const MFA = /\bMFA\b|\b2FA\b|multifacteur|multi-facteurs?|double authentification|second facteur|authentification forte|acc[èe]s conditionnel/i;
const COMPTE_LOCAL = /comptes?\s+locau?x?/i;
const PROCEDURE = /proc[ée]dure|secours|bris de glace|break-?glass|urgence/i;
const AUTH_LOCALE = /\btype\s*=\s*["']password["']|\bbcrypt\b|\bargon2\b|\bpasslib\b|\bpassword_hash\s*\(|\bhashpw\s*\(|\bpbkdf2_hmac\b|\b(?:check|generate)_password_hash\b/i;

function releveAuthLocale(racine) {
  const vus = [];
  for (const { chemin, rel } of parcourir(racine, 6, CODE)) {
    const t = lire(chemin);
    if (t.length < 2_000_000 && AUTH_LOCALE.test(t)) vus.push(rel);
    if (vus.length > 6) break;
  }
  return vus;
}

function jugerIdentite(racine, nom, texte, ko, ok, mesure) {
  const s = sections(texte, SECTION_IDENTITE);
  const ref = `${REF}, M-18 ; CTL-D03-01 « L'authentification de tout accès humain est déléguée à un fournisseur d'identité central, avec MFA activé. »`;
  if (!s.length) { ko("FI-1", nom, `le dossier ne porte aucune section « Fournisseur d'identité » : il ne dit ni qui authentifie les accès humains, ni avec quel MFA, ni qu'il n'y en a aucun — ${ref}`); return; }
  const corps = s.map((x) => x.titre + "\n" + x.corps).join("\n");
  const locale = releveAuthLocale(racine);
  mesure.auth_locale = locale.length;
  const aucun = AUCUN_ACCES.exec(corps);
  if (aucun) {
    if (locale.length) ko("FI-3", nom, `« aucun accès humain authentifié » déclaré, mais le code porte une authentification locale (${locale.slice(0, 4).join(", ")}) — ${ref}`);
    else ok("FI-2", nom, `aucun accès humain authentifié : ${aucun[1].trim().slice(0, 120)}`);
    return;
  }
  const idp = IDPS.exec(corps);
  if (!idp) ko("FI-2", nom, `la section ne nomme aucun fournisseur d'identité central (Entra ID, Google, Okta, Auth0, Keycloak, OIDC/SAML…) — « non conforme = authentification locale ou MFA absent » — ${ref}`);
  else if (!MFA.test(corps)) ko("FI-2", nom, `fournisseur d'identité nommé (${idp[0]}) sans MFA déclaré — « partiel = délégation sans MFA systématique » — ${ref}`);
  else ok("FI-2", nom, `fournisseur d'identité central nommé (${idp[0]}) et MFA déclaré`);
  if (locale.length) {
    if (COMPTE_LOCAL.test(corps) && PROCEDURE.test(corps)) ok("FI-3", nom, `authentification locale relevée (${locale.slice(0, 2).join(", ")}) couverte par une procédure de compte local écrite`);
    else ko("FI-3", nom, `le code porte une authentification locale (${locale.slice(0, 4).join(", ")}) que la section ne couvre pas : la retirer, ou écrire la procédure du compte local (secours, bris de glace) — « aucun compte local applicatif hors procédure » — ${ref}`);
  }
}

// ---- Le jugement ----------------------------------------------------------------------------------

export const REGLES = { pipeline: "PE", sauvegarde: "SR", identite: "FI" };

export function jugerProduit(racine, { document = null, regle = null } = {}) {
  const findings = [];
  const nonJuge = [];
  const mesure = { dossiers: 0, refus: 0, chaines: 0, commandes_directes: 0, commandes_anterieures: 0 };
  const dossiers = document ? [resolve(racine, document)] : dossiersMep(racine);
  mesure.dossiers = dossiers.length;
  if (!dossiers.length) return { findings, mesure, nonJuge, rienAJuger: true, motif: "aucun DOSSIER-MEP*.md sous ce produit : l'étape de mise en production n'a pas été atteinte, rien à juger (M-16, M-17, M-18 sans objet)" };
  const veut = (r) => !regle || r === regle;
  for (const chemin of dossiers) {
    const nom = relDe(racine, chemin) || chemin;
    const texte = lire(chemin);
    const ko = (r, ou, message) => findings.push({ regle: r, statut: "FAIL", ou, message });
    const ok = (r, ou, message) => findings.push({ regle: r, statut: "PASS", ou, message });
    if (veut("pipeline")) jugerChaine(racine, nom, texte, ko, ok, mesure);
    if (veut("sauvegarde")) jugerSauvegarde(racine, chemin, nom, texte, ko, ok, mesure, nonJuge);
    if (veut("identite")) jugerIdentite(racine, nom, texte, ko, ok, mesure);
  }
  mesure.refus = findings.filter((f) => f.statut === "FAIL").length;
  return { findings, mesure, nonJuge, rienAJuger: false, motif: null };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === resolve(process.argv[1]).toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeur = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const regle = valeur("--regle");
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify({ outil: "verifier-exigences-fatales", version: "1.0.0",
    regle: `M-16, M-17, M-18 (${REF})${regle ? ` — ${regle}` : ""}`, ...corps, non_juge: [...(corps.non_juge_ici || []), ...NON_JUGE] }, null, 1) + "\n"); process.exit(code); };
  if (regle && !REGLES[regle]) sortir({ verdict: "NON_JUGEABLE", message: `--regle inconnue « ${regle} » (attendu : ${Object.keys(REGLES).join(", ")})` }, 2);
  const cible = args.filter((a, i) => !a.startsWith("--") && !["--document", "--regle"].includes(args[i - 1]))[0] || process.cwd();
  if (!existsSync(cible) || !statSync(cible).isDirectory()) sortir({ verdict: "NON_JUGEABLE", message: `produit introuvable : ${cible}` }, 2);
  const r = jugerProduit(cible, { document: valeur("--document"), regle });
  sortir({ cible, verdict: r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS", motif: r.motif || undefined, mesure: r.mesure, findings: r.findings, non_juge_ici: r.nonJuge },
    r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
}
