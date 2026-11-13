#!/usr/bin/env node
/**
 * relever-appelants.mjs — quels contrôles du dépôt ne sont APPELÉS par rien (TF-1096, 14/09/2026).
 *
 * LE FAIT. Le relevé des restes archivés du 14/09 a trouvé sept contrôles écrits ou spécifiés
 * qu'aucune étape n'appelle : ils existent, ils sont peut-être justes, et ils ne protègent aucun
 * livrable. `oracle-controles-injoignables` (CI1) demande déjà qu'un contrôle soit CITÉ par un
 * autre fichier — mais une citation dans une doctrine ou dans sa propre recette ne l'exécute pas.
 * Ce relevé pose la question plus étroite : qui l'APPELLE ?
 *
 * CE QUI COMPTE COMME APPELANT : un fichier EXÉCUTABLE ou de CÂBLAGE du dépôt (`.mjs`, `.cjs`,
 * `.js`, `.json`, `.ps1`, `.sh`, `.py`) qui nomme le contrôle, hors le contrôle lui-même, hors sa
 * recette (`*.test.mjs`, `self-test*.mjs`) et hors le harnais qui joue les recettes
 * (`oracles/self-tests.mjs`). Une mention en `.md` est une DOCTRINE, pas un appel.
 *
 * CE QUI N'EST PAS JUGÉ : qu'un appel soit ATTEINT (une branche morte nomme sans exécuter), ni
 * qu'un contrôle sans appelant soit fautif — un outil à la main de l'humain en a légitimement
 * aucun. Le relevé NOMME ; il ne condamne pas (exit 0 toujours, sauf entrée illisible : 2).
 *
 * D-97 (a) du 29/10/2026 — LES COPIES DE TRAVAIL D'AGENTS NE SONT PAS DES APPELANTS. Le relevé
 * parcourait `.claude/worktrees`, où chaque agent laisse une copie complète du dépôt : chaque
 * contrôle y paraissait appelé par sa propre copie. Mesuré le 29/10 : 911 contrôles et 0 sans
 * appelant, contre 102 et 2 une fois les copies écartées. Le zéro était faux depuis la première
 * copie de travail.
 *
 * ET LE CODE MORT NE SE LIMITE PAS AUX CONTRÔLES. `--tous-scripts` relève tout script (`.mjs`,
 * `.cjs`, `.js`, `.py`, `.ps1`, `.sh`) qu'aucun fichier exécutable, de câblage ou page HTML ne
 * nomme ; un module Python compte comme appelé quand un autre l'importe par son nom, même en import
 * relatif, ou qu'un `pyproject.toml` le déclare ; les environnements Python (`.venv`) sont écartés. Le fait :
 * 4 forges comptaient 0 contrôle selon la convention de nom, alors qu'elles portent des scripts.
 *
 * TF-2488 (13/11/2026, lot pd) — CHAQUE DÉCLARATION NOMME SA NATURE. Le relevé ne connaissait que deux
 * états, « appelé » et « sans appelant », et mêlait sous le second ce qui se joue en recette, ce qu'un
 * document prescrit et ce que rien ne nomme : 9 des 12 oracles relevés sans appelant le 13/11 étaient
 * joués à la demande ou en recette. Quatre natures, de la plus forte à la plus faible :
 *   - `executable`   : un fichier exécutable ou de câblage le nomme (le sens historique d'« appelant ») ;
 *   - `registre`     : le registre machine de quality-oracles l'inscrit (`registre-oracles.json`, lu par
 *                      `run-oracles.mjs`) — le registre FAIT FOI : sur `oracle-clip` et `oracle-restitution`,
 *                      le relevé disait « sans appelant » là où le registre les inscrit ;
 *   - `recette`      : seul un test, un self-test ou le harnais des recettes le nomme ;
 *   - `prescription` : seul un document `.md` en prescrit l'appel (une ligne qui lance `node` ou `python`
 *                      sur son nom) ; une mention sans commande reste `citation` ; rien ne le nomme : `aucune`.
 * Un contrôle d'une des deux premières natures est APPELÉ. Les autres restent dans `sansAppelant`, avec leur
 * nature, leurs `recettes` et leurs `prescriptions` nommées : `nombre_sans_appelant` ne change pas de sens.
 * Le registre se lit par `--registre <fichier>` ; à défaut, `$FORGE_ROOT` ou le parent du dépôt relevé, puis
 * `digit-ai-forge-agents/.claude/skills/quality-oracles/references/registre-oracles.json`.
 *
 * Usage : node scripts/relever-appelants.mjs [--racine <dépôt>] [--depot <nom>] [--tous-scripts] [--registre <fichier>] [--json]
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative, basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const EST_CONTROLE = /^(oracle|verifier|check|hook)-[\w-]+\.mjs$/;
const EST_SCRIPT = /\.(mjs|cjs|js|py|ps1|sh)$/i;
const EST_APPELANT = /\.(m?js|cjs|json|ps1|sh|py)$/i;
const EST_APPELANT_TOUS = /\.(m?js|cjs|json|ps1|sh|py|html?|toml|cfg)$/i;
const EST_RECETTE = (f) => /\.test\.mjs$/.test(f) || /(^|[\\/])self-tests?(-[\w-]+)?\.mjs$/.test(f) || /(^|\/)test_[\w-]+\.py$/.test(f);
const ECARTES = new Set(["node_modules", ".git", "output", "input", ".oracles", "_oracles"]);
/** Écartés par chemin relatif : les copies de travail des agents (D-97 (a)). */
const ECARTES_CHEMIN = new Set([".claude/worktrees"]);
/** En mode `--tous-scripts`, les jeux d'essai ne sont pas du code livré. */
const ECARTES_TOUS = new Set(["fixtures", "__pycache__", "vendor", ".venv", "venv", "site-packages"]);

function* fichiers(dir, racine, ecartes = ECARTES) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (ecartes.has(e.name)) continue;
    const p = join(dir, e.name);
    const rel = relative(racine, p).split("\\").join("/");
    if (e.isDirectory()) { if (!ECARTES_CHEMIN.has(rel)) yield* fichiers(p, racine, ecartes); }
    else yield rel;
  }
}

const RACINE_REGISTRE = ".claude/skills/quality-oracles";
const SCRIPT_DE_REGISTRE = /\.(mjs|cjs|js|py)$/i;

/** Les scripts que le registre machine de quality-oracles inscrit, en { depot, chemin } (TF-2488). Illisible : null. */
export function lireRegistre(fichier) {
  let d;
  try { d = JSON.parse(readFileSync(fichier, "utf8")); } catch { return null; }
  const inscrits = new Set();
  for (const o of Array.isArray(d && d.oracles) ? d.oracles : []) {
    for (const t of Array.isArray(o && o.cmd) ? o.cmd : []) {
      const m = String(t).match(/^\{(forges|pilot|skilldir)\}\/(.+)$/);
      if (!m || !SCRIPT_DE_REGISTRE.test(m[2])) continue;
      if (m[1] === "forges") { const [depot, ...reste] = m[2].split("/"); inscrits.add(`${depot}/${reste.join("/")}`); }
      else if (m[1] === "pilot") inscrits.add(`digit-ai-factory/${m[2]}`);
      else inscrits.add(`digit-ai-forge-agents/${RACINE_REGISTRE}/${m[2]}`);
    }
  }
  return { fichier, inscrits };
}

/** Où chercher le registre quand la ligne de commande n'en nomme aucun : le dépôt frère du relevé. */
export function registreParDefaut(racine) {
  const forges = process.env.FORGE_ROOT || dirname(resolve(racine));
  const f = join(forges, "digit-ai-forge-agents", RACINE_REGISTRE, "references", "registre-oracles.json");
  return existsSync(f) ? f : null;
}

/**
 * Rend { controles, mode, registre, sansAppelant: [{controle, nature, recettes[], prescriptions[], cite_en_doctrine}],
 *        appeles: [{controle, nature, appelants[]}] }.
 * `registre` : fichier du registre de quality-oracles lu (TF-2488), ou null ; `depot` : nom du dépôt relevé, tel
 * que le registre l'écrit (par défaut le nom du dossier).
 */
export function relever(racine, { tous = false, registre = null, depot = basename(resolve(racine)) } = {}) {
  const reg = registre ? lireRegistre(registre) : null;
  const tous_ = [...fichiers(racine, racine, tous ? new Set([...ECARTES, ...ECARTES_TOUS]) : ECARTES)];
  const estCible = tous ? (f) => EST_SCRIPT.test(f) : (f) => EST_CONTROLE.test(basename(f));
  const estAppelant = tous ? EST_APPELANT_TOUS : EST_APPELANT;
  const controles = tous_.filter((f) => estCible(f) && !EST_RECETTE(f));
  // Œil critique du 29/10/2026 : un hook git (`.git/hooks/pre-commit`, sans extension) et un workflow
  // (`.github/workflows/*.yml`) appellent aussi des scripts ; sans eux, `pre-commit-index.mjs` et
  // `verifications-lundi.mjs` passaient pour du code mort.
  const crochets = [];
  try { for (const n of readdirSync(join(racine, ".git", "hooks"))) if (!n.endsWith(".sample")) crochets.push(`.git/hooks/${n}`); } catch { /* pas de dépôt git ou pas de hooks */ }
  const estCablage = (f) => estAppelant.test(f) || /^\.github\/workflows\/[^/]+\.ya?ml$/i.test(f);
  const candidats = [...tous_.filter(estCablage), ...crochets];
  const lus = new Map();
  const lire = (f) => { if (!lus.has(f)) { try { lus.set(f, readFileSync(join(racine, f), "utf8")); } catch { lus.set(f, ""); } } return lus.get(f); };
  const appeles = [], sansAppelant = [];
  for (const c of controles) {
    const nom = basename(c);
    const stem = nom.replace(/\.py$/i, "");
    // « from paquet.module import x », « import module », et l'import relatif « from . import a, module ».
    const module = /\.py$/i.test(nom) ? new RegExp(`\\b(import|from)\\s+[\\w.]*\\b${stem}\\b|\\bimport\\s+[\\w\\s.,()]*\\b${stem}\\b`) : null;
    const nomme = (t) => t.includes(nom) || (module && module.test(t));
    const appelants = candidats.filter((f) => f !== c && !EST_RECETTE(f) && nomme(lire(f)));
    if (appelants.length) { appeles.push({ controle: c, nature: "executable", appelants }); continue; }
    // TF-2488 : le registre de quality-oracles inscrit le contrôle ; il fait foi, le relevé ne le contredit pas.
    if (reg && reg.inscrits.has(`${depot}/${c}`)) { appeles.push({ controle: c, nature: "registre", appelants: [reg.fichier.split("\\").join("/")] }); continue; }
    // Ni exécutable ni registre : la recette qui le joue et le document qui en prescrit l'appel se NOMMENT.
    const recettes = tous_.filter((f) => f !== c && EST_RECETTE(f) && estAppelant.test(f) && nomme(lire(f)));
    const lancement = new RegExp(`\\b(node|python3?|py)\\b[^\\n]*${nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    const docs = tous_.filter((f) => /\.md$/i.test(f) && lire(f).includes(nom));
    const prescriptions = docs.filter((f) => lancement.test(lire(f)));
    const nature = recettes.length ? "recette" : prescriptions.length ? "prescription" : docs.length ? "citation" : "aucune";
    sansAppelant.push({ controle: c, nature, recettes, prescriptions, cite_en_doctrine: docs.length > 0 });
  }
  return { controles: controles.length, mode: tous ? "tous-scripts" : "controles", registre: reg ? reg.fichier : null, sansAppelant, appeles };
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--racine");
  const racine = i >= 0 ? args[i + 1] : join(ICI, "..");
  if (!racine || !existsSync(racine) || !statSync(racine).isDirectory()) { console.error(`racine illisible : ${racine}`); process.exit(2); }
  const j = args.indexOf("--registre");
  const registre = j >= 0 ? args[j + 1] : registreParDefaut(racine);
  if (j >= 0 && (!registre || !existsSync(registre))) { console.error(`registre illisible : ${registre}`); process.exit(2); }
  const k = args.indexOf("--depot"); // nom du dépôt tel que le registre l'écrit : un arbre de travail ne porte pas le nom du dépôt
  const r = relever(racine, { tous: args.includes("--tous-scripts"), registre, ...(k >= 0 && args[k + 1] ? { depot: args[k + 1] } : {}) });
  // `nombre_sans_appelant` : le scalaire que lit la sonde hebdomadaire du plan des récidives (TF-1165).
  if (args.includes("--json")) { console.log(JSON.stringify({ nombre_sans_appelant: r.sansAppelant.length, ...r }, null, 1)); process.exit(0); }
  console.log(`relever-appelants — ${r.controles} ${r.mode === "tous-scripts" ? "script(s)" : "contrôle(s)"}, ${r.sansAppelant.length} sans appelant exécutable ni inscription au registre${r.registre ? ` (${r.registre})` : " (registre de quality-oracles non lu)"} :`);
  const DIT = { recette: (s) => `joué en recette seulement : ${s.recettes.join(", ")}`, prescription: (s) => `appel prescrit par un document : ${s.prescriptions.join(", ")}`, citation: () => "cité en doctrine seulement", aucune: () => "cité nulle part" };
  for (const s of r.sansAppelant) console.log(`  - ${s.controle} [${s.nature}] (${DIT[s.nature](s)})`);
  process.exit(0);
}
