/**
 * lib-produits-hors-table.mjs — les produits actifs que la table des pseudonymes ne connaît pas (D-102 (a) du 29/10/2026).
 *
 * LE FAIT, relevé par l'œil critique du 29/10/2026 : 17 produits sur 40 absents de la table, dont un produit actif de 11 sessions
 * sur la période. Un produit ne s'inscrit qu'à l'accueil de son premier lot (`todo/ingerer-lot.mjs`) : tant qu'il n'a rien remis, la
 * porte de publication des noms ne connaît pas le sien, et l'extraction de l'œil critique l'a laissé en clair dans ses fichiers de travail.
 *
 * CE QUE FAIT CE MODULE : il compte les produits du dernier relevé de démarrage (`.oracles/produits-au-demarrage.json`) qui ont un
 * commit depuis `JOURS_ACTIF` jours et que `pseudonymeProduit` rend hors table. Il N'INSCRIT RIEN : l'inscription reste le geste de
 * l'accueil du premier lot, choix tenu par la décision. Il ne sert que l'écran du relevé d'ouverture, jamais un fichier suivi.
 *
 * NON JUGÉ : un produit sans dépôt git ou absent du relevé de démarrage ; un produit actif sans commit (travail non enregistré).
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { spawnSync } from "node:child_process";

export const JOURS_ACTIF = 14;
/** Le marqueur de `scripts/lib-pseudonyme-produit.mjs`, répété ici pour ne pas charger la table quand elle manque. */
const HORS_TABLE = "(produit hors table)";

const dernierCommitGit = (p) => {
  const r = spawnSync("git", ["log", "-1", "--format=%ct"], { cwd: p, encoding: "utf8", timeout: 5000 });
  const s = Number(String(r.stdout || "").trim());
  return r.status === 0 && Number.isFinite(s) ? s * 1000 : null;
};

/**
 * Rend { produits, actifs, horsTable: [chemin relatif au parc] } ; `pseudonyme` et `ecosysteme` viennent de l'appelant, `dernierCommit`
 * se remplace en recette. Un produit de l'écosystème garde son nom par règle (TF-1505) : il n'est jamais compté.
 */
export function produitsActifsHorsTable(pilot, { pseudonyme, ecosysteme = new Set(), maintenant = Date.now(), dernierCommit = dernierCommitGit } = {}) {
  const f = join(pilot, ".oracles", "produits-au-demarrage.json");
  if (!existsSync(f)) return { produits: 0, actifs: 0, horsTable: [] };
  const chemins = Object.keys(JSON.parse(readFileSync(f, "utf8")).produits || {});
  const parc = join(pilot, "..");
  const actifs = chemins.filter((p) => !ecosysteme.has(basename(p))).filter((p) => { const t = dernierCommit(p); return t !== null && maintenant - t <= JOURS_ACTIF * 864e5; });
  const horsTable = actifs.map((p) => relative(parc, p).replaceAll("\\", "/")).filter((r) => pseudonyme(r) === HORS_TABLE).sort();
  return { produits: chemins.length, actifs: actifs.length, horsTable };
}
