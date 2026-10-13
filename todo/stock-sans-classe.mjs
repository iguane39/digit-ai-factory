#!/usr/bin/env node
/**
 * stock-sans-classe.mjs — LE STOCK D'ITEMS OUVERTS SANS CLASSE SE MESURE ET SE PUBLIE (TF-1301, 13/10/2026).
 *
 * LE FAIT, mesuré le 22/09/2026 en exécutant A-11. La porte posée sur `journaliser.mjs` refuse toute
 * CRÉATION sans classe : elle ne peut rien pour le stock déjà écrit. Le relevé complet comptait 16 items
 * sans classe, dont 8 qui n'étaient pas des candidatures (statut decide ou en_cours) — hors de portée de la
 * porte, et hors du compteur qu'elle existe pour rendre lisible. Le motif vaut plus que le cas : chaque
 * porte posée au chemin d'écriture laisse derrière elle un stock que rien ne garde.
 *
 * CE QUE FAIT CET OUTIL (voie (b) de la décision, la voie du mandat global du 13/10 : mesurer et publier,
 * sans classer à la place du producteur). Il replie le registre en son état courant et compte, par statut,
 * les items OUVERTS (candidat, decide, en_cours) qui ne portent ni `classe` ni `classe_a_creer`. L'ouverture
 * du pilot (`oracles/hook-ouverture.mjs`) en publie le compte à chaque session.
 *
 * NON JUGÉ (déclaré). Que la classe portée soit la BONNE : seul son existence est comptée. Les items clos
 * (corrige, ecarte, non_clos) : leur stock sans classe est connu et n'est pas rouvert ici.
 *
 * Usage : node todo/stock-sans-classe.mjs [--json]      Exit : toujours 0 (c'est une mesure, pas une porte).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { etatCourant } from "./revue-hebdo.mjs";

export const STATUTS_OUVERTS = ["candidat", "decide", "en_cours"];

/** Compte les items ouverts sans classe, par statut. `etat` : Map id → événement replié. */
export function stockSansClasse(etat) {
  const parStatut = Object.fromEntries(STATUTS_OUVERTS.map((s) => [s, []]));
  for (const e of etat.values()) {
    if (!STATUTS_OUVERTS.includes(e.statut)) continue;
    if (e.classe || e.classe_a_creer) continue;
    parStatut[e.statut].push(e.id);
  }
  const total = STATUTS_OUVERTS.reduce((n, s) => n + parStatut[s].length, 0);
  return { total, parStatut };
}

/** Une ligne lisible : « 8 item(s) ouvert(s) sans classe (decide 6, en_cours 2) ». */
export function ligneStock(stock) {
  if (!stock.total) return "aucun item ouvert sans classe (candidat, decide, en_cours)";
  const detail = STATUTS_OUVERTS.filter((s) => stock.parStatut[s].length).map((s) => `${s} ${stock.parStatut[s].length}`).join(", ");
  return `${stock.total} item(s) ouvert(s) sans classe (${detail}) : ${STATUTS_OUVERTS.flatMap((s) => stock.parStatut[s]).join(", ")}`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const registre = join(dirname(fileURLToPath(import.meta.url)), "TODO.jsonl");
  const stock = stockSansClasse(etatCourant(readFileSync(registre, "utf8")));
  console.log(process.argv.includes("--json") ? JSON.stringify(stock) : ligneStock(stock));
  process.exit(0);
}
