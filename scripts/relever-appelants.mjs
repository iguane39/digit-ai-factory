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
 * Usage : node scripts/relever-appelants.mjs [--racine <dépôt>] [--tous-scripts] [--json]
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";
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

/** Rend { controles, mode, sansAppelant: [{controle, cite_en_doctrine}], appeles: [{controle, appelants[]}] }. */
export function relever(racine, { tous = false } = {}) {
  const tous_ = [...fichiers(racine, racine, tous ? new Set([...ECARTES, ...ECARTES_TOUS]) : ECARTES)];
  const estCible = tous ? (f) => EST_SCRIPT.test(f) : (f) => EST_CONTROLE.test(basename(f));
  const estAppelant = tous ? EST_APPELANT_TOUS : EST_APPELANT;
  const controles = tous_.filter((f) => estCible(f) && !EST_RECETTE(f));
  const lus = new Map();
  const lire = (f) => { if (!lus.has(f)) { try { lus.set(f, readFileSync(join(racine, f), "utf8")); } catch { lus.set(f, ""); } } return lus.get(f); };
  const appeles = [], sansAppelant = [];
  for (const c of controles) {
    const nom = basename(c);
    const stem = nom.replace(/\.py$/i, "");
    // « from paquet.module import x », « import module », et l'import relatif « from . import a, module ».
    const module = /\.py$/i.test(nom) ? new RegExp(`\\b(import|from)\\s+[\\w.]*\\b${stem}\\b|\\bimport\\s+[\\w\\s.,()]*\\b${stem}\\b`) : null;
    const nomme = (t) => t.includes(nom) || (module && module.test(t));
    const appelants = tous_.filter((f) => f !== c && estAppelant.test(f) && !EST_RECETTE(f) && nomme(lire(f)));
    if (appelants.length) appeles.push({ controle: c, appelants });
    else sansAppelant.push({ controle: c, cite_en_doctrine: tous_.some((f) => /\.md$/i.test(f) && lire(f).includes(nom)) });
  }
  return { controles: controles.length, mode: tous ? "tous-scripts" : "controles", sansAppelant, appeles };
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--racine");
  const racine = i >= 0 ? args[i + 1] : join(ICI, "..");
  if (!racine || !existsSync(racine) || !statSync(racine).isDirectory()) { console.error(`racine illisible : ${racine}`); process.exit(2); }
  const r = relever(racine, { tous: args.includes("--tous-scripts") });
  // `nombre_sans_appelant` : le scalaire que lit la sonde hebdomadaire du plan des récidives (TF-1165).
  if (args.includes("--json")) { console.log(JSON.stringify({ nombre_sans_appelant: r.sansAppelant.length, ...r }, null, 1)); process.exit(0); }
  console.log(`relever-appelants — ${r.controles} ${r.mode === "tous-scripts" ? "script(s)" : "contrôle(s)"}, ${r.sansAppelant.length} sans appelant exécutable :`);
  for (const s of r.sansAppelant) console.log(`  - ${s.controle}${s.cite_en_doctrine ? " (cité en doctrine seulement)" : " (cité nulle part)"}`);
  process.exit(0);
}
