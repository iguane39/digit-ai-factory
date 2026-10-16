#!/usr/bin/env node
// revues-datees — un plan de revue daté se rappelle à sa date (TF-1831, 16/10/2026).
//
// LE FAIT. Toute étude d'opportunité porte un plan de revue daté (oracle-etude-opportunite E7), et
// rien ne le rappelle : relu le 16/10/2026, aucun script du pilot ne lisait une date de revue. Une
// revue sans invocateur reste une intention, même raison que la revue hebdomadaire et la cadence
// des récidives que l'ouverture rappelle déjà.
//
// LA RÈGLE. Un item du registre peut porter `revue_le` (AAAA-MM-JJ) et `revue_commande` (la mesure
// à rejouer). Il est DÛ quand `revue_le` est atteinte et qu'aucun `revue_jouee_le` postérieur ou
// égal ne la solde ; un item `ecarte` n'est jamais dû. L'ouverture du pilot publie les revues dues
// avec leur commande ; jouer la mesure et consigner `revue_jouee_le` reste un geste du tour.
//
// Usage : node todo/revues-datees.mjs [--jour AAAA-MM-JJ] [--registre <TODO.jsonl>]  · exit 0.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Les items dont la revue datée est due au jour donné, triés par date de revue. */
export function revuesDues(etat, jour) {
  const dues = [];
  for (const e of etat.values()) {
    if (!e || !DATE.test(String(e.revue_le || "")) || e.statut === "ecarte") continue;
    if (e.revue_le > jour) continue;
    if (DATE.test(String(e.revue_jouee_le || "")) && e.revue_jouee_le >= e.revue_le) continue;
    dues.push({ id: e.id, revue_le: e.revue_le, commande: e.revue_commande || null, titre: e.titre || "" });
  }
  return dues.sort((a, b) => a.revue_le.localeCompare(b.revue_le));
}

/** Les items dont la revue est datée et pas encore due, pour dire la prochaine. */
export function revuesAVenir(etat, jour) {
  return [...etat.values()].filter((e) => e && DATE.test(String(e.revue_le || "")) && e.statut !== "ecarte" && e.revue_le > jour
    && !(DATE.test(String(e.revue_jouee_le || "")) && e.revue_jouee_le >= e.revue_le))
    .map((e) => ({ id: e.id, revue_le: e.revue_le })).sort((a, b) => a.revue_le.localeCompare(b.revue_le));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ICI = dirname(fileURLToPath(import.meta.url));
  const args = process.argv.slice(2);
  const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const jour = val("--jour") || new Date().toISOString().slice(0, 10);
  const { etatCourant } = await import(pathToFileURL(join(ICI, "revue-hebdo.mjs")).href);
  const etat = etatCourant(readFileSync(val("--registre") || join(ICI, "TODO.jsonl"), "utf8"));
  const dues = revuesDues(etat, jour), avenir = revuesAVenir(etat, jour);
  process.stdout.write(JSON.stringify({ outil: "revues-datees", jour, dues, a_venir: avenir }, null, 1) + "\n");
}
