#!/usr/bin/env node
/**
 * indices-uniques.mjs — deux livrables d'un même dossier ne partagent pas un indice, et c'est vérifié
 * APRÈS CHAQUE RAPATRIEMENT du pilot (TF-1359, décision humaine D-21 (b) du 26/09/2026).
 *
 * LE FAIT, mesuré le 24/09/2026 : deux synthèses du 23/09 ont pris le même indice « d », une sur
 * chaque poste — l'une jamais publiée, l'autre publiée à 21:19. `scripts\allouer-indice.mjs` lit le
 * disque du poste et ne peut pas voir une synthèse non publiée de l'autre. La règle qui juge
 * l'unicité existe depuis le 02/09 (R-4 d'`oracle-conformite-projet`, TF-0750), et AUCUNE étape de
 * la synchronisation ne la jouait : ni `bootstrap --pull`, ni `readme-dossiers`, ni la porte de
 * publication. Deux restitutions ont vécu 16 heures sous un même nom, et seul un passage à la main
 * de l'oracle l'a vu.
 *
 * CE QUE FAIT CE MODULE : il appelle R-4 — jamais une copie de sa logique, pour qu'un correctif de la
 * règle serve aussi ici — et ne garde que les constats d'UNICITÉ. R-4 entière rend aussi les rouges
 * anciens de nommage (des livrables antérieurs à la convention) ; les afficher à chaque ouverture
 * noierait le seul constat que la synchronisation peut créer.
 *
 * LE PASSIF N'EST PAS REJUGÉ À CHAQUE OUVERTURE. Mesuré le 26/09 sur le pilot : 22 indices déjà
 * partagés dans `output\`, du 15/08 au 21/09. `--depuis <commit>` ne garde que les collisions dont un
 * livrable a changé depuis ce commit — ce qu'un tirage, un rebase ou une fusion vient d'apporter ;
 * le reste est compté comme passif, dit, jamais présenté en défaut neuf.
 *
 * Appelant : `oracles\hook-ouverture.mjs`, juste après `bootstrap.mjs --pull`, avec la tête relevée à
 * l'ouverture précédente.
 * Usage : node scripts/indices-uniques.mjs [<dépôt>] [--depuis <commit>] [--json]
 * Exit : 0 aucun indice partagé (neuf, sous --depuis) · 1 au moins un · 2 non jugeable.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
// Le message de R-4 pour l'unicité (TF-0750), et lui seul : c'est le contrat que la recette tient.
export const RE_UNICITE = /porté par \d+ livrables de radical distinct/;

/** Les constats d'unicité d'indice de R-4 sur `depot`, ou null si R-4 est illisible. */
export function collisionsDIndice(depot) {
  const oracle = join(ICI, "..", "oracles", "oracle-conformite-projet.mjs");
  const r = spawnSync(process.execPath, [oracle, depot, "--regles", "R-4"], { encoding: "utf8", cwd: depot, maxBuffer: 64 * 1024 * 1024 });
  let o;
  try { o = JSON.parse(r.stdout); } catch { return null; }
  const constats = o.findings || o.checks || o.constats || [];
  return constats.filter((c) => c.regle === "R-4" && c.statut === "FAIL" && RE_UNICITE.test(String(c.message)));
}

/** Les radicaux (nom sans extension) des livrables d'output/ et docs/ changés depuis `sha`, ou null. */
export function radicauxChangesDepuis(depot, sha) {
  const r = spawnSync("git", ["-C", depot, "-c", "core.quotepath=false", "diff", "--name-only", "-z", sha, "HEAD", "--", "output", "docs"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) return null;
  return new Set(r.stdout.split("\0").filter(Boolean).map((p) => p.split("/").pop().replace(/\.[^.]+$/, "")));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const iDepuis = args.indexOf("--depuis");
  const depuis = iDepuis >= 0 ? args[iDepuis + 1] : null;
  const valeurDepuis = iDepuis >= 0 ? iDepuis + 1 : -1;
  const depot = resolve(args.find((a, i) => !a.startsWith("--") && i !== valeurDepuis) || join(ICI, ".."));
  const toutes = collisionsDIndice(depot);
  const changes = depuis ? radicauxChangesDepuis(depot, depuis) : null;
  if (toutes === null || (depuis && changes === null)) {
    if (args.includes("--json")) console.log(JSON.stringify({ outil: "indices-uniques", depot, depuis, collisions: null }, null, 1));
    else console.error(`[NON JUGÉ] ${toutes === null ? "R-4 illisible" : `commit « ${depuis} » introuvable`} sur ${depot}`);
    process.exit(2);
  }
  const neuves = depuis ? toutes.filter((x) => [...changes].some((rad) => String(x.message).includes(`« ${rad} »`))) : toutes;
  const passif = toutes.length - neuves.length;
  if (args.includes("--json")) console.log(JSON.stringify({ outil: "indices-uniques", depot, depuis, collisions: neuves, passif }, null, 1));
  else {
    if (!neuves.length) console.log(`PASS — aucun indice partagé${depuis ? ` par un livrable changé depuis ${depuis.slice(0, 8)}` : ""} (${depot})${passif ? ` ; passif : ${passif} indice(s) partagé(s) antérieur(s), non rejugé(s)` : ""}`);
    for (const x of neuves) console.log(`[DÉFAUT] ${x.ou} ${x.message}`);
  }
  process.exit(neuves.length ? 1 : 0);
}
