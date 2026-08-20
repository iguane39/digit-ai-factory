#!/usr/bin/env node
/**
 * journaliser.mjs — écrit des événements au registre TODO-FORGE en STAMPANT leur horodatage.
 *
 * Pourquoi cet outil existe (TF-0413, 20/08/2026). Les événements composés à la main dans
 * `TODO.jsonl` portaient un `ts` inventé : mesuré en rapprochant chaque commit du dernier `ts`
 * qu'il ajoute, +449, +386, +353, +314, +308, +299, +259, +190, +180, +173 minutes d'AVANCE sur
 * six jours — aucun en retard. Les événements écrits par l'outillage (`ingerer-lot.mjs`)
 * collaient au commit à la minute près. La cause n'est donc pas une horloge : c'est la
 * composition à la main d'un champ que seule une machine peut remplir honnêtement.
 * `oracle-todo` R11 CONSTATE le défaut ; ce script en supprime la CAUSE. Les deux se cumulent
 * — le contrôle ne remplace pas l'outil, et l'outil ne dispense pas du contrôle.
 *
 * Ce qu'il refuse, et pourquoi : un événement qui porte déjà un `ts`. Accepter « sauf si tu
 * insistes » rendrait l'outil contournable par la voie la plus commode, c'est-à-dire par celle
 * qui a produit le défaut. L'heure d'un fait rapporté (décision prise hier, correction d'avant-
 * hier) est une DONNÉE : elle se consigne dans `date_decision`, `date_correction`, ou tout
 * champ nommé — jamais dans `ts`, qui est l'heure de CONSIGNATION.
 *
 * Usage :
 *   node todo\journaliser.mjs --fichier <evenements.json> [--registre <TODO.jsonl>] [--essai]
 *
 *   <evenements.json> : un objet, ou un tableau d'objets, SANS champ `ts`.
 *   --essai : affiche ce qui serait écrit, n'écrit rien.
 *
 * Garanties :
 *   · horodatages strictement croissants au sein d'un même lot (millisecondes réelles) ;
 *   · écriture ATOMIQUE au sens du verdict : si `oracle-todo` passait avant et échoue après,
 *     le fichier est remis exactement dans son état d'origine et le rapport dit pourquoi ;
 *   · le registre n'est jamais laissé à moitié écrit — la taille d'origine est reprise.
 *
 * Sortie : JSON {outil, ecrits[], verdict_avant, verdict_apres, message} · exit 0 / 1.
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync, statSync, truncateSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
const ESSAI = args.includes("--essai");
const fichier = valeur("--fichier");
const REGISTRE = valeur("--registre") || join(ICI, "TODO.jsonl");
const ORACLE = join(ICI, "oracle-todo.mjs");

function sortir(code, corps) {
  process.stdout.write(JSON.stringify({ outil: "journaliser", ...corps }, null, 1) + "\n");
  process.exit(code);
}

if (!fichier) sortir(1, { message: "usage : node journaliser.mjs --fichier <evenements.json> [--registre <f>] [--essai]" });
if (!existsSync(fichier)) sortir(1, { message: `fichier d'événements introuvable : ${fichier}` });

let entrants;
try { entrants = JSON.parse(readFileSync(fichier, "utf8")); }
catch (e) { sortir(1, { message: `événements illisibles : ${e.message}` }); }
if (!Array.isArray(entrants)) entrants = [entrants];
if (!entrants.length) sortir(1, { message: "aucun événement à journaliser" });

// Refus AVANT toute écriture : un lot qui contient un `ts` n'est pas écrit à moitié.
const porteurs = entrants.map((e, i) => (e && e.ts !== undefined ? i : -1)).filter((i) => i >= 0);
if (porteurs.length) {
  sortir(1, {
    message: `${porteurs.length} événement(s) portent déjà un \`ts\` (rang ${porteurs.join(", ")}) — refusé, ` +
      "aucune écriture. `ts` est l'heure de CONSIGNATION : elle est stampée ici. L'heure d'un " +
      "fait rapporté est une donnée — `date_decision`, `date_correction`, ou un champ nommé (TF-0413)",
  });
}

const verdict = (f) => {
  const r = spawnSync(process.execPath, [ORACLE, f], { encoding: "utf8" });
  try { return JSON.parse(r.stdout || "{}").verdict || "ILLISIBLE"; } catch { return "ILLISIBLE"; }
};

// Horodatages stampés, strictement croissants au sein du lot.
let dernier = 0;
const lignes = entrants.map((e) => {
  let t = Date.now();
  if (t <= dernier) t = dernier + 1;
  dernier = t;
  return JSON.stringify({ ...e, ts: new Date(t).toISOString() });
});

if (ESSAI) sortir(0, { message: "essai — rien écrit", ecrits: lignes });

const avant = verdict(REGISTRE);
const taille = existsSync(REGISTRE) ? statSync(REGISTRE).size : 0;
appendFileSync(REGISTRE, lignes.join("\n") + "\n", "utf8");
const apres = verdict(REGISTRE);

if (avant === "PASS" && apres !== "PASS") {
  truncateSync(REGISTRE, taille);
  sortir(1, {
    verdict_avant: avant, verdict_apres: apres, ecrits: [],
    message: `le registre passait et ne passe plus (${apres}) — écriture ANNULÉE, fichier repris à ${taille} octets. ` +
      "Jouer `node todo\\oracle-todo.mjs` pour lire le constat, corriger les événements, recommencer",
  });
}

sortir(0, {
  verdict_avant: avant, verdict_apres: apres,
  ecrits: lignes.map((l) => { const o = JSON.parse(l); return `${o.ts} ${o.id || "?"} ${o.ev || "?"} ${o.statut || ""}`.trim(); }),
  message: `${lignes.length} événement(s) journalisé(s) dans ${REGISTRE}` +
    (avant !== "PASS" ? ` — ATTENTION : le registre était déjà ${avant} avant cette écriture` : ""),
});
