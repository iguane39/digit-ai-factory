#!/usr/bin/env node
/**
 * relever-campagnes-tests.mjs — une campagne de tests de produit se prouve menée à son terme, ou se dit non menée
 * (TF-2727, 15/11/2026).
 *
 * LE FAIT (rapport du 15/11/2026, lecture seule des produits). 31 rapports d'audit de forge-tests sur 6 produits, du 01/09 au
 * 09/11/2026 : tous PARTIEL, la boucle `en_cours`, 30 à zéro tour ; le dernier arrêté au tour 4 le 09/09 avec 17 anomalies
 * restantes ; un seul `forge/journal-boucle.jsonl` sur le poste, arrêté au 06/09. La dernière campagne menée à son terme
 * restait celle du 17/08/2026, et rien ne le disait : le journal de tours est la seule trace qu'une campagne a eu lieu, et les
 * produits ne le tenaient plus.
 *
 * CE QU'IL FAIT. Pour chaque produit donné (ou, avec `--parc <racine>`, chaque dossier de la racine qui porte
 * `forge/etapes/tests/`), il LIT, sans rien écrire :
 *   - les rapports `forge/etapes/tests/rapport*.json` : leur verdict (PASS, PARTIEL, FAIL), l'état de la section `boucle` de
 *     forge-tests (la forge qui prescrit la fin de campagne est celle qui la juge : le pilot la lit, il ne la recalcule pas,
 *     `references/ETAPES-RUN.md`), leur date (celle du nom `rapport-AAAAMMJJ…`, sinon celle du fichier) ;
 *   - le journal `forge/journal-boucle.jsonl` du produit : le nombre de tours qu'il porte.
 * Il rend, par produit et au total :
 *   - `partiels_sans_tour` : les rapports PARTIEL ou FAIL d'un produit dont le journal n'a AUCUN tour — la campagne s'est
 *     arrêtée au premier audit, ou son journal ne se tient plus ; c'est le signalement demandé, et il fait sortir l'outil en 1 ;
 *   - `campagnes_terminees` : les produits dont le DERNIER rapport porte une boucle `terminee`, avec sa date, et ceux terminés
 *     depuis `--depuis` (défaut : 7 jours avant `--le`) — le relevé hebdomadaire qui manquait à la vitrine.
 *
 * Usage : node scripts/relever-campagnes-tests.mjs <produit> [...] | --parc <racine> [--depuis AAAA-MM-JJ] [--le AAAA-MM-JJ] [--json]
 * Exit : 0 aucun rapport sans tour · 1 au moins un rapport PARTIEL ou FAIL sans tour · 2 rien à relever ou option illisible.
 *
 * NON JUGÉ, et c'est déclaré (voir `NON_JUGE`). L'outil ne rejoue aucun audit, n'écrit chez aucun produit et ne planifie rien :
 * le relevé hebdomadaire est ce qu'il rend quand on le lance, pas une routine installée.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

export const NON_JUGE = [
  "qu'une campagne soit réellement terminée : la fin se lit dans la section `boucle` du dernier rapport (forge-tests la publie, le pilot ne la recalcule pas, TF-0360) ; un rapport sans section `boucle` (forge-tests d'avant le 18/08/2026) n'est jamais compté terminé",
  "le CONTENU du journal : un tour est une ligne JSON lisible de `forge/journal-boucle.jsonl`, rien de plus ; qu'il relate bien les tours du rapport n'est pas vérifié",
  "un journal tenu ailleurs que `forge/journal-boucle.jsonl` : seul le chemin de `outillage-tests-e2e/appels-reels.mjs` est lu",
  "la planification : l'outil rend le relevé de la semaine quand on le lance ; aucune routine ne le lance seule, et le pilot n'en installe pas sans décision",
  "un rapport illisible : compté (`rapports_illisibles`), jamais accusé ni ignoré en silence",
];

const JOUR = /^\d{4}-\d{2}-\d{2}$/;
const jourLocal = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const enJour = (j) => Date.parse(`${j}T00:00:00Z`);
const moinsJours = (j, n) => new Date(enJour(j) - n * 86400000).toISOString().slice(0, 10);

/** La date d'un rapport : celle de son nom (`rapport-AAAAMMJJ…`), sinon celle du fichier. */
export function dateDuRapport(nom, chemin) {
  const m = /(\d{4})(\d{2})(\d{2})/.exec(nom);
  if (m) { const j = `${m[1]}-${m[2]}-${m[3]}`; if (!Number.isNaN(enJour(j))) return j; }
  try { return jourLocal(statSync(chemin).mtime); } catch { return null; }
}

/** Les tours d'un journal : ses lignes JSON lisibles. */
export function toursDuJournal(chemin) {
  if (!existsSync(chemin)) return { existe: false, tours: 0 };
  let n = 0;
  for (const l of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue;
    try { const o = JSON.parse(l); if (o && typeof o === "object") n += 1; } catch { /* ligne illisible : pas un tour */ }
  }
  return { existe: true, tours: n };
}

/** Relève UN produit : ses rapports, son journal, ce qui s'en déduit. */
export function releverProduit(racine) {
  const dossier = join(racine, "forge", "etapes", "tests");
  const journal = toursDuJournal(join(racine, "forge", "journal-boucle.jsonl"));
  const rapports = [];
  let illisibles = 0;
  if (existsSync(dossier)) {
    for (const nom of readdirSync(dossier).filter((f) => /^rapport.*\.json$/i.test(f)).sort()) {
      const chemin = join(dossier, nom);
      let j;
      try { j = JSON.parse(readFileSync(chemin, "utf8")); } catch { illisibles += 1; continue; }
      if (!j || typeof j !== "object") { illisibles += 1; continue; }
      const boucle = j.boucle && typeof j.boucle === "object" ? j.boucle : null;
      rapports.push({
        fichier: nom, date: dateDuRapport(nom, chemin), verdict: String(j.verdict ?? "inconnu").toUpperCase(),
        boucle: boucle ? String(boucle.statut ?? boucle.etat ?? "inconnu").toLowerCase() : null,
      });
    }
  }
  rapports.sort((a, b) => String(a.date).localeCompare(String(b.date)) || a.fichier.localeCompare(b.fichier));
  const dernier = rapports[rapports.length - 1] || null;
  const sansTour = journal.tours === 0 ? rapports.filter((r) => r.verdict === "PARTIEL" || r.verdict === "FAIL") : [];
  return {
    produit: basename(resolve(racine)), rapports: rapports.length, rapports_illisibles: illisibles, journal,
    dernier_rapport: dernier, partiels_sans_tour: sansTour,
    campagne_terminee: !!dernier && dernier.boucle === "terminee" ? { date: dernier.date, fichier: dernier.fichier } : null,
  };
}

/** Les produits d'une racine : les dossiers qui portent `forge/etapes/tests/`. */
export function produitsDe(racine) {
  let entrees = [];
  try { entrees = readdirSync(racine, { withFileTypes: true }); } catch { return []; }
  return entrees.filter((e) => e.isDirectory() && !/^[._]/.test(e.name) && e.name !== "node_modules"
    && existsSync(join(racine, e.name, "forge", "etapes", "tests"))).map((e) => join(racine, e.name)).sort();
}

export function relever(produits, { depuis, le }) {
  const parProduit = produits.map(releverProduit);
  const sansTour = parProduit.flatMap((p) => p.partiels_sans_tour.map((r) => ({ produit: p.produit, ...r })));
  const terminees = parProduit.filter((p) => p.campagne_terminee).map((p) => ({ produit: p.produit, ...p.campagne_terminee }));
  return {
    le, depuis,
    mesure: { produits: parProduit.length, rapports: parProduit.reduce((n, p) => n + p.rapports, 0),
      rapports_illisibles: parProduit.reduce((n, p) => n + p.rapports_illisibles, 0), partiels_sans_tour: sansTour.length,
      produits_avec_journal: parProduit.filter((p) => p.journal.tours > 0).length,
      campagnes_terminees: terminees.length, terminees_depuis: terminees.filter((t) => t.date && t.date >= depuis && t.date <= le).length },
    partiels_sans_tour: sansTour, campagnes_terminees: terminees, produits: parProduit,
  };
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (lanceEnDirect) {
  const argv = process.argv.slice(2);
  const valeur = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const AVEC = ["--parc", "--depuis", "--le"];
  const cibles = argv.filter((a, i) => !a.startsWith("--") && !AVEC.includes(argv[i - 1]));
  const le = valeur("--le") || jourLocal();
  const depuis = valeur("--depuis") || (JOUR.test(le) ? moinsJours(le, 7) : "");
  const sortie = (o, code) => { console.log(JSON.stringify({ outil: "relever-campagnes-tests", ...o, non_juge: NON_JUGE }, null, 1)); process.exit(code); };
  if (!JOUR.test(le) || !JOUR.test(depuis) || Number.isNaN(enJour(le)) || Number.isNaN(enJour(depuis)))
    sortie({ verdict: "ERREUR", message: `option illisible — --le et --depuis attendent AAAA-MM-JJ (lu « ${le} », « ${depuis} »)` }, 2);
  const parc = valeur("--parc");
  const produits = [...cibles.map((c) => resolve(c)), ...(parc ? produitsDe(resolve(parc)) : [])];
  if (!produits.length) sortie({ verdict: "SKIP", message: "aucun produit à relever : donner des dossiers de produit, ou --parc <racine> (dossiers portant forge/etapes/tests/)" }, 2);
  const r = relever(produits, { depuis, le });
  sortie({ verdict: r.mesure.partiels_sans_tour ? "FAIL" : "PASS", ...r }, r.mesure.partiels_sans_tour ? 1 : 0);
}
