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
 * Usage : node scripts/relever-appelants.mjs [--racine <dépôt>] [--json]
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const EST_CONTROLE = /^(oracle|verifier|check|hook)-[\w-]+\.mjs$/;
const EST_APPELANT = /\.(m?js|cjs|json|ps1|sh|py)$/i;
const EST_RECETTE = (f) => /\.test\.mjs$/.test(f) || /(^|[\\/])self-tests?(-[\w-]+)?\.mjs$/.test(f);
const ECARTES = new Set(["node_modules", ".git", "output", "input", ".oracles", "_oracles"]);

function* fichiers(dir, racine) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (ECARTES.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* fichiers(p, racine);
    else yield relative(racine, p).split("\\").join("/");
  }
}

/** Rend { controles, sansAppelant: [{controle, cite_en_doctrine}], appeles: [{controle, appelants[]}] }. */
export function relever(racine) {
  const tous = [...fichiers(racine, racine)];
  const controles = tous.filter((f) => EST_CONTROLE.test(basename(f)) && !EST_RECETTE(f));
  const lus = new Map();
  const lire = (f) => { if (!lus.has(f)) { try { lus.set(f, readFileSync(join(racine, f), "utf8")); } catch { lus.set(f, ""); } } return lus.get(f); };
  const appeles = [], sansAppelant = [];
  for (const c of controles) {
    const nom = basename(c);
    const appelants = tous.filter((f) => f !== c && EST_APPELANT.test(f) && !EST_RECETTE(f) && lire(f).includes(nom));
    if (appelants.length) appeles.push({ controle: c, appelants });
    else sansAppelant.push({ controle: c, cite_en_doctrine: tous.some((f) => /\.md$/i.test(f) && lire(f).includes(nom)) });
  }
  return { controles: controles.length, sansAppelant, appeles };
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--racine");
  const racine = i >= 0 ? args[i + 1] : join(ICI, "..");
  if (!racine || !existsSync(racine) || !statSync(racine).isDirectory()) { console.error(`racine illisible : ${racine}`); process.exit(2); }
  const r = relever(racine);
  if (args.includes("--json")) { console.log(JSON.stringify(r, null, 1)); process.exit(0); }
  console.log(`relever-appelants — ${r.controles} contrôle(s), ${r.sansAppelant.length} sans appelant exécutable :`);
  for (const s of r.sansAppelant) console.log(`  - ${s.controle}${s.cite_en_doctrine ? " (cité en doctrine seulement)" : " (cité nulle part)"}`);
  process.exit(0);
}
