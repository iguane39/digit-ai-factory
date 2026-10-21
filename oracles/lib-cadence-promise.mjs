/**
 * lib-cadence-promise.mjs — UNE CADENCE PROMISE A UN PORTEUR QUI SURVIT À LA SESSION (TF-1915, 21/10/2026).
 *
 * LE FAIT. Une page d'agenda livrée le 16/09/2026 servait « La liste est relevée chaque semaine », et son
 * script se disait « relevé hebdomadaire ». Rien ne le lançait : 0 cron dans 8 workflows, 0 tâche planifiée
 * au poste, 0 appel serveur. Un seul relevé en 32 jours, constaté le 18/10 sur la question de l'exploitant.
 * La promesse était servie aux visiteurs ; le traitement n'avait eu lieu qu'une fois, à la main.
 *
 * CE QUI EST CONFRONTÉ. Une PROMESSE de cadence est une ligne où un mot de cadence (« chaque semaine »,
 * « hebdomadaire », « quotidien », « tous les jours », « chaque mois », « every week », « daily »…) côtoie,
 * à moins de 60 caractères, un participe de mise à jour (mis à jour, relevé, actualisé, rafraîchi, synchronisé,
 * régénéré, updated, refreshed) : « ouvert tous les jours » n'est pas une promesse de traitement. Elle se
 * cherche dans les textes SERVIS (pages et gabarits, contenus de site, fichiers de traduction) et dans les
 * COMMENTAIRES des scripts (jamais leurs chaînes). Un PORTEUR est ce qui lance un traitement sans session :
 * workflow `on: schedule` avec `cron:`, pipeline planifié (GitLab, Azure), crontab, minuterie systemd,
 * `crons` de Vercel ou Cloudflare, fonction planifiée Netlify, `CronJob` Kubernetes, tâche planifiée
 * Windows (export XML, `Register-ScheduledTask`, `schtasks /create`) — ou une DÉCLARATION écrite
 * `porteur-cadence: <où vit la planification>` pour un porteur hors dépôt (serveur, interface web d'une CI).
 *
 * LE RAPPROCHEMENT. Une promesse portée par un SCRIPT est tenue si un porteur nomme ce script (par son nom
 * de fichier, ou par un script `npm run` qui l'appelle), ou si le script déclare son porteur. Une promesse
 * portée par un TEXTE SERVI ne nomme pas son script : ses PRODUCTEURS sont les scripts du dépôt qui nomment le
 * fichier de la page, et l'un d'eux doit être lancé par un porteur (ou déclarer le sien). Une page sans
 * producteur repérable (fichier composé ailleurs, nom construit) est tenue dès qu'un porteur ou une
 * déclaration existe au dépôt : limite déclarée.
 *
 * Sévérité : AVERTISSEMENT (règle neuve, bruit mesuré d'abord — précédent D-70 (b)), jamais un échec.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename, extname, relative } from "node:path";
import { spawnSync } from "node:child_process";

export const MOT_CADENCE = new RegExp([
  String.raw`\b(?:chaque|tous\s+les|toutes\s+les)\s+(?:\d+\s+)?(?:jours?|nuits?|semaines?|mois|heures?|minutes|matins?|soirs?|ann[ée]es?|trimestres?|lundis?|mardis?|mercredis?|jeudis?|vendredis?|samedis?|dimanches?)(?![\wà-ÿ])`,
  String.raw`\b(?:hebdomadaires?|hebdomadairement|quotidien(?:ne)?s?|quotidiennement|journali[eè]re?s?|mensuel(?:le)?s?|mensuellement|bimensuel(?:le)?s?|nocturnes?)(?![\wà-ÿ])`,
  String.raw`\b(?:every\s+(?:\d+\s+)?(?:days?|nights?|weeks?|months?|hours?|minutes|mornings?|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|daily|weekly|monthly|nightly|hourly)(?![\wà-ÿ])`,
].join("|"), "gi");
// Le vocabulaire est étroit par choix, et MESURÉ (21/10/2026, 15 produits du poste) : avec les verbes larges
// (sync, backup, publié, recalculé, importé…), 150 lignes signalées dont l'immense majorité décrivait le monde ou
// le système d'un client (« Daily backup + GFS retention », « des centaines d'AO publiés chaque jour »), pas une
// promesse du produit sur lui-même. Restent les participes d'une mise à jour de contenu.
export const VERBE_TRAITEMENT = /(?:\bmis(?:e|es)?\s+à\s+jour|\bmise\s+à\s+jour|\bmettons\s+à\s+jour|\bactualis[ée]e?s?(?![\wà-ÿ])|\brafra[iî]chi(?:e|s|es)?(?![\wà-ÿ])|\brelev[ée]e?s?(?![\wà-ÿ])|\bsynchronis[ée]e?s?(?![\wà-ÿ])|\bupdated(?![\wà-ÿ])|\brefreshed(?![\wà-ÿ])|\bre-?generated(?![\wà-ÿ])|\br[ée]g[ée]n[ée]r[ée]e?s?(?![\wà-ÿ]))/i;
export const DECLARATION = /porteur-cadence\s*:\s*(\S.{2,})/i;

const EXT_SERVIS = new Set([".html", ".htm", ".xhtml", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".njk", ".hbs", ".handlebars", ".ejs", ".liquid", ".twig", ".php", ".erb", ".j2", ".jinja", ".jinja2"]);
const EXT_SCRIPTS = new Set([".py", ".js", ".mjs", ".cjs", ".ts", ".sh", ".bash", ".ps1", ".psm1", ".rb", ".go", ".java", ".cs", ".bat", ".cmd"]);
const DOSSIERS_CONTENU = /(?:^|\/)(?:content|_posts|posts|pages|blog|site)\//i;
const DOSSIERS_TRADUCTION = /(?:^|\/)(?:locales?|i18n|lang|langs|messages|translations)\//i;
// Hors jugement, chacun pour son motif : `forge/`, `factory/` et `gabarits/` portent la doctrine et les copies du
// pilot ; `input/` des entrants (données) ; `output/` des livrables documentaires, non servis par le produit ;
// les tests et fixtures décrivent des cas, ils ne promettent rien. `dist/` est une sortie compilée. `build/` n'est
// écarté que pour les TEXTES SERVIS (pages générées, doublons de leur source) : chez le produit de l'incident, il
// porte les SCRIPTS du site, dont le relevé de l'agenda (`build/releve-agenda.mjs`, « Relevé hebdomadaire »). Les
// dossiers de livrables (`livrables/`, `old/`) portent des rapports remis, pas des pages servies.
const HORS = /(?:^|\/)(?:\.git|node_modules|\.venv|venv|__pycache__|dist|\.next|\.nuxt|vendor|\.claude|\.oracles|forge|factory|gabarits|input|output|tests?|__tests__|fixtures?|spec)\//i;
const GENERE = /(?:^|\/)(?:build|_site|livrables?|old)\//i;
const FICHIER_TEST = /\.(?:test|spec)\.[a-z]+$|\.min\.js$|\.map$/i;
const TAILLE_MAX = 2 * 1024 * 1024;

export function fichiersDuDepot(racine) {
  let liste = null;
  if (existsSync(join(racine, ".git"))) {
    const r = spawnSync("git", ["-C", racine, "ls-files", "-co", "--exclude-standard", "-z"], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
    if (r.status === 0) liste = r.stdout.split("\0").filter(Boolean);
  }
  if (!liste) {
    liste = [];
    const visiter = (d, prof) => {
      if (prof > 8) return;
      let entrees = [];
      try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
      for (const e of entrees) {
        const p = join(d, e.name);
        if (e.isDirectory()) { if (!HORS.test(relative(racine, p).replaceAll("\\", "/") + "/")) visiter(p, prof + 1); }
        else liste.push(relative(racine, p).replaceAll("\\", "/"));
      }
    };
    visiter(racine, 0);
  }
  return liste.map((r) => r.replaceAll("\\", "/"));
}

function lire(racine, rel) {
  try {
    const p = join(racine, rel);
    if (statSync(p).size > TAILLE_MAX) return null;
    return readFileSync(p, "utf8");
  } catch { return null; }
}

/** Nature d'un fichier pour la recherche de promesses : texte servi, script, ou rien. */
export function natureDuFichier(rel) {
  if (HORS.test(rel) || FICHIER_TEST.test(rel)) return null;
  const ext = extname(rel).toLowerCase();
  if (EXT_SCRIPTS.has(ext)) return "script";
  if (GENERE.test(rel)) return null;
  if (EXT_SERVIS.has(ext)) return "texte_servi";
  if ((ext === ".md" || ext === ".mdx") && DOSSIERS_CONTENU.test(rel)) return "texte_servi";
  if (ext === ".json" && DOSSIERS_TRADUCTION.test(rel)) return "texte_servi";
  return null;
}

/**
 * Les lignes de COMMENTAIRE d'un script (numéros à partir de 0) : `#`, `//`, `/* … *\/`, `<# … #>`, `REM`, `::`,
 * et la docstring d'ouverture d'un module Python. Les chaînes d'un script ne sont pas lues : mesuré le 21/10/2026,
 * un générateur de rapport ou un fichier d'articles en porte des centaines (« le relevé quotidien fournit… »),
 * qui décrivent et ne promettent rien.
 */
export function lignesDeCommentaire(texte, ext) {
  const lignes = String(texte).split(/\r?\n/);
  const garde = new Set();
  const diese = new Set([".py", ".sh", ".bash", ".ps1", ".psm1", ".rb"]);
  const barres = new Set([".js", ".mjs", ".cjs", ".ts", ".go", ".java", ".cs"]);
  let bloc = null; // fin attendue d'un bloc de commentaire ouvert
  let docstringPossible = ext === ".py";
  lignes.forEach((l, i) => {
    const t = l.trim();
    if (bloc) { garde.add(i); if (t.includes(bloc)) bloc = null; return; }
    if (docstringPossible) {
      if (!t || t.startsWith("#")) { if (t) garde.add(i); return; }
      docstringPossible = false;
      const q = t.startsWith('"""') ? '"""' : t.startsWith("'''") ? "'''" : null;
      if (q) { garde.add(i); if (!t.slice(3).includes(q)) bloc = q; return; }
    }
    if (diese.has(ext) && t.startsWith("#")) { garde.add(i); return; }
    if ((ext === ".ps1" || ext === ".psm1") && t.startsWith("<#")) { garde.add(i); if (!t.includes("#>")) bloc = "#>"; return; }
    if (barres.has(ext)) {
      if (t.startsWith("//") || t.startsWith("*")) { garde.add(i); return; }
      if (t.startsWith("/*")) { garde.add(i); if (!t.includes("*/")) bloc = "*/"; return; }
    }
    if ((ext === ".bat" || ext === ".cmd") && /^(?:rem\b|::)/i.test(t)) garde.add(i);
  });
  return garde;
}

// Un traitement DATÉ (« relevé le 27/09/2026 », « relevé du 21 septembre », `"releve":"27/09/2026"`) a eu lieu une
// fois : il ne promet rien. Mesuré le 21/10/2026, il faisait 5 des 9 lignes signalées d'un produit, voisin d'horaires
// d'ouverture (« tous les jours 09:00–13:00 ») ou d'un volume (« 2 900 recherches mensuelles »).
const DATE_APRES = /^\s*(?:"\s*:\s*"|:\s*|(?:le|du|au|en|on)\s+)\d/i;
const VERBE_G = new RegExp(VERBE_TRAITEMENT.source, "gi");
const verbeNonDate = (fenetre) => {
  VERBE_G.lastIndex = 0;
  let v;
  while ((v = VERBE_G.exec(fenetre))) if (!DATE_APRES.test(fenetre.slice(v.index + v[0].length))) return true;
  return false;
};

/** Les promesses de cadence d'un texte : une par ligne au plus, mot de cadence ET verbe de traitement non daté à 60 caractères. */
export function promessesDuTexte(texte, seulement = null) {
  const out = [];
  String(texte).split(/\r?\n/).forEach((ligne, i) => {
    if (seulement && !seulement.has(i)) return;
    MOT_CADENCE.lastIndex = 0;
    let m;
    while ((m = MOT_CADENCE.exec(ligne))) {
      const fenetre = ligne.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60);
      if (verbeNonDate(fenetre)) {
        const debut = Math.max(0, m.index - 60);
        out.push({ ligne: i + 1, cadence: m[0], extrait: ligne.slice(debut, m.index + m[0].length + 60).replace(/\s+/g, " ").trim() });
        break;
      }
    }
  });
  return out;
}

/** Les porteurs planifiés d'un dépôt : ce qui lance un traitement sans session, avec le texte qui le décrit. */
export function porteursDuTexte(rel, texte) {
  const t = String(texte);
  const nom = basename(rel).toLowerCase();
  const ext = extname(rel).toLowerCase();
  if (/^\.github\/workflows\/[^/]+\.ya?ml$/i.test(rel) && /^\s*schedule\s*:/m.test(t) && /\bcron\s*:/.test(t)) return "workflow planifié (on: schedule)";
  if (nom === ".gitlab-ci.yml" && (/CI_PIPELINE_SOURCE\s*==\s*["']schedule["']/.test(t) || /^\s*-\s*schedules\s*$/m.test(t))) return "pipeline GitLab planifié";
  if (/azure-pipelines/i.test(nom) && /^\s*schedules\s*:/m.test(t) && /\bcron\s*:/.test(t)) return "pipeline Azure planifié";
  if (nom === "crontab" || /\.(?:cron|crontab)$/.test(nom) || /(?:^|\/)cron\.d\//.test(rel)) return "crontab";
  if (ext === ".timer" && /OnCalendar|OnUnitActiveSec|OnBootSec/.test(t)) return "minuterie systemd";
  if (nom === "vercel.json" && /"crons"\s*:/.test(t)) return "crons Vercel";
  if (nom === "netlify.toml" && /\bschedule\s*=/.test(t)) return "fonction planifiée Netlify";
  if (/^wrangler\.(?:toml|json)$/.test(nom) && /\bcrons\b/.test(t)) return "déclencheur planifié Cloudflare";
  if ((ext === ".yml" || ext === ".yaml") && /^\s*kind\s*:\s*CronJob\b/m.test(t)) return "CronJob Kubernetes";
  if (/compose/i.test(nom) && /ofelia\.job/.test(t)) return "planificateur ofelia";
  if (ext === ".xml" && /<(?:CalendarTrigger|TimeTrigger)\b/.test(t)) return "tâche planifiée Windows (export)";
  if (EXT_SCRIPTS.has(ext) && /Register-ScheduledTask|New-ScheduledTaskTrigger|schtasks(?:\.exe)?\s+\/create/i.test(t)) return "tâche planifiée Windows (script)";
  if (EXT_SCRIPTS.has(ext) && /from\s+["']@netlify\/functions["'][\s\S]{0,4000}\bschedule\s*\(/.test(t)) return "fonction planifiée Netlify";
  return null;
}

/**
 * Le constat d'un dépôt : promesses, porteurs, déclarations, et promesses sans porteur.
 * Retour : { promesses: [{fichier, nature, ligne, cadence, extrait}], porteurs: [{fichier, nature}],
 *            declarations: [{fichier, ligne, texte}], sansPorteur: [...promesses] }.
 */
export function cadencesSansPorteur(racine) {
  const fichiers = fichiersDuDepot(racine);
  const promesses = [], porteurs = [], declarations = [];
  const textesPorteurs = [];
  let scriptsNpm = {};
  const pkg = lire(racine, "package.json");
  if (pkg) { try { scriptsNpm = JSON.parse(pkg).scripts || {}; } catch { /* manifeste illisible : pas d'expansion */ } }
  for (const rel of fichiers) {
    if (/(?:^|\/)(?:node_modules|\.git)\//.test(rel)) continue;
    const nature = natureDuFichier(rel);
    const ext = extname(rel).toLowerCase();
    const peutPorter = /^\.github\//.test(rel) || /\.(?:ya?ml|toml|json|xml|timer|cron|crontab)$/i.test(rel) || basename(rel) === "crontab" || /(?:^|\/)cron\.d\//.test(rel) || EXT_SCRIPTS.has(ext);
    if (!nature && !peutPorter) continue;
    const texte = lire(racine, rel);
    if (texte === null) continue;
    if (!HORS.test(rel)) {
      const porteur = porteursDuTexte(rel, texte);
      if (porteur) {
        porteurs.push({ fichier: rel, nature: porteur });
        // Un `npm run x` / `pnpm x` / `yarn x` du porteur s'étend à la commande du script npm qu'il nomme.
        const etendu = texte.replace(/\b(?:npm\s+run|pnpm(?:\s+run)?|yarn(?:\s+run)?)\s+([\w:.-]+)/g, (m0, n) => `${m0} ${scriptsNpm[n] || ""}`);
        textesPorteurs.push(etendu);
      }
    }
    if (!nature) continue;
    texte.split(/\r?\n/).forEach((l, i) => { const d = l.match(DECLARATION); if (d) declarations.push({ fichier: rel, ligne: i + 1, texte: d[1].trim().slice(0, 160) }); });
    const seulement = nature === "script" ? lignesDeCommentaire(texte, ext) : null;
    for (const p of promessesDuTexte(texte, seulement)) promesses.push({ fichier: rel, nature, ...p });
  }
  const tousPorteurs = textesPorteurs.join("\n").toLowerCase();
  const echappe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const lanceParUnPorteur = (fichier) => {
    const nom = basename(fichier).toLowerCase();
    const radical = nom.replace(/\.[^.]+$/, "");
    // Le radical seul (`python -m releve`, `npm run build`) compte s'il est un mot entier, jamais un dossier :
    // `build/console/releve.py` ne lance pas `build/build.mjs` (faux « lancé » mesuré le 21/10/2026).
    return tousPorteurs.includes(nom) || (radical.length >= 4 && new RegExp(`[\\\\/\\s"'=.]${echappe(radical)}(?![\\w/\\\\-])`).test(tousPorteurs));
  };
  // Les PRODUCTEURS d'une page : les scripts du dépôt qui nomment son fichier (`agenda.html`). Le fait du 18/10 : deux
  // workflows planifiés existaient (mesure, indexation), aucun ne lançait le script de l'agenda ; « un porteur existe
  // au dépôt » n'aurait rien vu. Une page sans producteur repérable retombe sur cette règle large, et c'est dit.
  const scripts = fichiers.filter((rel) => EXT_SCRIPTS.has(extname(rel).toLowerCase()) && !HORS.test(rel) && !FICHIER_TEST.test(rel));
  const texteScripts = new Map();
  const producteurs = (page) => {
    const nom = basename(page).toLowerCase();
    return scripts.filter((s) => {
      if (!texteScripts.has(s)) texteScripts.set(s, (lire(racine, s) || "").toLowerCase());
      return texteScripts.get(s).includes(nom);
    });
  };
  const sansPorteur = promesses.filter((p) => {
    if (declarations.some((d) => d.fichier === p.fichier)) return false;
    if (p.nature === "texte_servi") {
      const prod = producteurs(p.fichier);
      p.producteurs = prod;
      if (!prod.length) return !porteurs.length && !declarations.length;
      return !prod.some((s) => lanceParUnPorteur(s) || declarations.some((d) => d.fichier === s));
    }
    return !lanceParUnPorteur(p.fichier);
  });
  return { promesses, porteurs, declarations, sansPorteur };
}
