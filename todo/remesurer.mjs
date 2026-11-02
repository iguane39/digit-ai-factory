#!/usr/bin/env node
// remesurer — une correction de coût ou de durée se remesure en service, une semaine après sa clôture
// (D-118 (a) du 02/11/2026, TF-1954).
//
// LE FAIT. Une correction du pre-push a été close le 13/10/2026 sur un gain mesuré à blanc (36 s, 52 s,
// 41 s) ; 25 envois réels du pilot ont ensuite attendu jusqu'au 20/10, dont 9 coupés par le délai de
// 600 s. Troisième occurrence de la classe : rien ne remesurait un gain une fois en service. Dans le
// même esprit, un avertissement d'ouverture a survécu à la clôture de son item.
//
// LA RÈGLE. Une clôture PEUT porter `remesure` (facultatif) :
//   { commande, duree_max_s | sortie, avertissement, apres_jours }
//   - commande       : la mesure, rejouée depuis la racine du pilot sur l'objet installé ;
//   - duree_max_s    : la durée visée en secondes ; au-delà, c'est un écart ;
//   - sortie         : expression régulière que la sortie doit porter ; absente, c'est un écart ;
//   - avertissement  : expression régulière d'un avertissement d'ouverture censé avoir disparu ;
//   - apres_jours    : le délai depuis `date_correction`, 7 par défaut.
// Une remesure est DUE à sa date et se joue une fois : le résultat s'ajoute à
// `todo/observabilite/remesures.jsonl`. L'ouverture du pilot joue les dues, au plus 2 par ouverture, et
// publie les écarts. Un écart se signale, il ne rouvre rien : la décision revient à la session.
//
// Usage : node todo/remesurer.mjs [--jouer] [--jour AAAA-MM-JJ] [--registre <TODO.jsonl>] [--journal <f>]
// Sortie : JSON {dues, jouees} · exit 0, 1 si un écart est constaté par --jouer.
import { readFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const JOURNAL = join(ICI, "observabilite", "remesures.jsonl");
const DELAI_MS = 60_000;

/** Le contrat du champ, partagé avec la règle R18 d'oracle-todo : rend les défauts, [] si le champ tient. */
export function defautsRemesure(r) {
  if (!r || typeof r !== "object" || Array.isArray(r)) return ["`remesure` n'est pas un objet"];
  const d = [];
  const texte = (x) => typeof x === "string" && x.trim().length > 0;
  if (!texte(r.commande) && !texte(r.avertissement)) d.push("ni `commande` ni `avertissement` : rien à remesurer");
  if (texte(r.commande) && r.duree_max_s === undefined && r.sortie === undefined) d.push("`commande` sans valeur visée (`duree_max_s` ou `sortie`)");
  if (r.duree_max_s !== undefined && !(Number(r.duree_max_s) > 0)) d.push("`duree_max_s` n'est pas un nombre positif");
  for (const champ of ["sortie", "avertissement"]) {
    if (r[champ] === undefined) continue;
    try { new RegExp(r[champ]); } catch { d.push(`\`${champ}\` n'est pas une expression régulière valide`); }
  }
  if (r.apres_jours !== undefined && !(Number.isInteger(r.apres_jours) && r.apres_jours >= 0)) d.push("`apres_jours` n'est pas un entier positif ou nul");
  return d;
}

const dateDue = (e) => {
  const t = Date.parse(`${e.date_correction}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  const n = e.remesure.apres_jours === undefined ? 7 : e.remesure.apres_jours;
  return new Date(t + n * 86_400_000).toISOString().slice(0, 10);
};

/** Les ids déjà remesurés, lus au journal. */
export function dejaJouees(chemin = JOURNAL) {
  if (!existsSync(chemin)) return new Set();
  const vus = new Set();
  for (const l of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    try { const e = JSON.parse(l); if (e.id) vus.add(e.id); } catch { /* ligne illisible : ignorée */ }
  }
  return vus;
}

/** Les items clos en corrige dont la commande de remesure est due au jour donné et pas encore jouée. */
export function remesuresDues(etat, jour, jouees = new Set()) {
  const dues = [];
  for (const e of etat.values()) {
    if (e.statut !== "corrige" || !e.remesure || !e.remesure.commande || jouees.has(e.id)) continue;
    const due = dateDue(e);
    if (due && due <= jour) dues.push({ id: e.id, titre: e.titre, due, ...e.remesure });
  }
  return dues.sort((a, b) => a.due.localeCompare(b.due));
}

/** Joue une remesure. `lancer` se remplace en recette ; il rend { code, sortie, duree_s }. */
export function jouerRemesure(d, lancer = lancerCommande) {
  const r = lancer(d.commande);
  const ecarts = [];
  if (r.code !== 0) ecarts.push(`la commande sort en ${r.code}`);
  if (d.duree_max_s !== undefined && r.duree_s > Number(d.duree_max_s)) ecarts.push(`${r.duree_s} s pour ${d.duree_max_s} s visées`);
  if (d.sortie !== undefined && !new RegExp(d.sortie).test(r.sortie || "")) ecarts.push(`la sortie ne porte pas « ${d.sortie} »`);
  return { id: d.id, commande: d.commande, code: r.code, duree_s: r.duree_s, ecarts };
}

function lancerCommande(commande) {
  const t0 = Date.now();
  const r = spawnSync(commande, { shell: true, cwd: join(ICI, ".."), encoding: "utf8", timeout: DELAI_MS });
  return { code: r.status === null ? 124 : r.status, sortie: `${r.stdout || ""}${r.stderr || ""}`, duree_s: Math.round((Date.now() - t0) / 100) / 10 };
}

/** Les avertissements censés avoir disparu avec leur item, et que le texte du relevé porte encore. */
export function avertissementsSurvivants(etat, texteDuReleve, jour) {
  const restes = [];
  for (const e of etat.values()) {
    if (e.statut !== "corrige" || !e.remesure || !e.remesure.avertissement) continue;
    const due = dateDue(e);
    if (!due || due > jour) continue;
    let motif; try { motif = new RegExp(e.remesure.avertissement); } catch { continue; }
    if (motif.test(texteDuReleve)) restes.push({ id: e.id, titre: e.titre, avertissement: e.remesure.avertissement });
  }
  return restes;
}

/** Joue au plus `max` remesures dues et les consigne au journal. */
export function jouerDues(etat, jour, { journal = JOURNAL, max = 2, lancer = lancerCommande } = {}) {
  const dues = remesuresDues(etat, jour, dejaJouees(journal));
  const jouees = dues.slice(0, max).map((d) => jouerRemesure(d, lancer));
  if (jouees.length) {
    mkdirSync(dirname(journal), { recursive: true });
    for (const j of jouees) appendFileSync(journal, JSON.stringify({ ts: new Date().toISOString(), ...j }) + "\n", "utf8");
  }
  return { dues: dues.length, jouees };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const valeur = (nom, defaut) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : defaut; };
  const { etatCourant } = await import(pathToFileURL(join(ICI, "revue-hebdo.mjs")).href);
  const etat = etatCourant(readFileSync(valeur("--registre", join(ICI, "TODO.jsonl")), "utf8"));
  const jour = valeur("--jour", new Date().toISOString().slice(0, 10));
  const journal = valeur("--journal", JOURNAL);
  if (args.includes("--jouer")) {
    const r = jouerDues(etat, jour, { journal });
    console.log(JSON.stringify({ outil: "remesurer", ...r }));
    process.exit(r.jouees.some((j) => j.ecarts.length) ? 1 : 0);
  }
  console.log(JSON.stringify({ outil: "remesurer", dues: remesuresDues(etat, jour, dejaJouees(journal)) }));
}
