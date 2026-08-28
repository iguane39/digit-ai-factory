#!/usr/bin/env node
/**
 * archiver.mjs — déplace les items CLOS (corrige | ecarte) vers TODO-ARCHIVE.jsonl,
 * pour que le registre actif ne porte que le reste-à-faire (TF-0092, mandat du 11/08).
 *
 * Contrat (oracle-todo) : transition R5 corrige|ecarte → archive appendée AVANT le
 * déplacement ; l'archive reçoit l'HISTOIRE COMPLÈTE de l'item (creation → archive),
 * ordre de lignes préservé (R9) ; un id ne vit jamais des deux côtés (R3).
 * Événements d'ingestion (R10) : une ingestion couvre les N créations qui la précèdent.
 * Elle part avec son lot si TOUT le lot part, reste sinon. R10 ne couvrant que les
 * créations EXTERNES (demandeur run-/produit-/mission-, ts ≥ 2026-08-09) : un lot partagé
 * n'est bloquant que s'il enverrait une créATION EXTERNE à l'archive sans son ingestion
 * (R10 y échouerait) → ABANDON fail-closed. Les membres internes d'un lot partagé
 * partent librement — leur couverture n'est exigée nulle part.
 *
 * Usage : node todo/archiver.mjs [--constat]   (--constat : liste sans écrire)
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SRC = join(ICI, "TODO.jsonl"), ARC = join(ICI, "TODO-ARCHIVE.jsonl");
const constat = process.argv.includes("--constat");
// Items volontairement RETENUS malgré leur clôture, avec le motif : ils partiront quand leur
// lot partira. Un silence ici se lirait « rien à archiver », ce qui est faux.
const retenus = [];

const lignes = readFileSync(SRC, "utf8").split("\n").filter((l) => l.trim());
const evts = lignes.map((l, i) => ({ i, brut: l, ...JSON.parse(l) }));

// état final par id
const etats = new Map();
for (const e of evts) if (e.id) {
  if (e.ev === "creation") etats.set(e.id, { ...e });
  else if (e.ev === "maj" && etats.has(e.id)) Object.assign(etats.get(e.id), e);
}
const archivables = new Set([...etats.values()].filter((e) => ["corrige", "ecarte"].includes(e.statut)).map((e) => e.id));
if (!archivables.size) { console.log("rien à archiver — le registre ne porte que du reste-à-faire"); process.exit(0); }

// couverture des ingestions : les N créations qui précèdent immédiatement chaque ingestion
const couvertures = new Map(); // index de ligne d'ingestion -> ids couverts
{
  const recentes = [];
  for (const e of evts) {
    if (e.ev === "creation") recentes.push(e.id);
    else if (e.ev === "ingestion") couvertures.set(e.i, (e.creations > 0 ? recentes.splice(-e.creations) : []));
  }
}
const SEUIL_R10 = "2026-08-09T00:00:00Z";
const RE_EXTERNE = /^(run|produit|mission)-/;
const estExterne = (id) => {
  const e = etats.get(id);
  return e && RE_EXTERNE.test(e.demandeur || "") && e.ts >= SEUIL_R10;
};
for (const [i, ids] of couvertures) {
  const partentDuLot = ids.filter((id) => archivables.has(id));
  const lotEntierPart = partentDuLot.length === ids.length;
  // l'ingestion ne part qu'avec un lot entier ; un externe qui partirait sans elle
  // perdrait sa couverture R10 côté archive → abandon
  const externesOrphelins = lotEntierPart ? [] : partentDuLot.filter(estExterne);
  if (externesOrphelins.length) {
    // 22/08 — la protection R10 est juste, sa PORTÉE ne l'était pas : un seul lot partagé
    // (un item clos, son voisin encore en cours) abandonnait l'archivage des 157 autres, et
    // le registre actif restait noyé sous les items faits. Le lot concerné est désormais
    // RETENU, le reste part. Un défaut n'emporte pas tout le traitement — même doctrine que
    // le regroupement des constats ailleurs dans la forge.
    for (const id of externesOrphelins) archivables.delete(id);
    retenus.push(...externesOrphelins.map((id) => `${id} (lot de l'ingestion ligne ${i + 1} : un membre reste actif)`));
  }
}

// 22/08 — Une RECTIFICATION suit ses cibles. Elle déclare des écarts SUR DES ITEMS : laissée
// dans l'actif alors que ses items partent, elle viole R9 (« rectification sans cible
// ANTÉRIEURE ») et fait tomber le registre entier en FAIL — constaté au premier archivage réel.
// Les entrées dont l'item part sont recopiées dans une rectification jumelle, placée avec eux ;
// celles dont l'item reste demeurent dans l'actif. Aucun écart n'est perdu : chacun reste
// imprimé du côté où vit son item.
function scinderRectification(evenement, partId) {
  if (evenement.ev !== "rectification_horodatage" || !Array.isArray(evenement.entrees)) return null;
  const partent = evenement.entrees.filter((x) => partId.has(x.id));
  const restent = evenement.entrees.filter((x) => !partId.has(x.id));
  if (!partent.length) return null;
  return { partent, restent };
}

if (retenus.length) {
  console.log(retenus.length + " item(s) clos RETENUS (couverture R10 de leur lot) :");
  for (const motif of retenus) console.log("  - " + motif);
}
if (constat) {
  console.log(`${archivables.size} item(s) archivable(s) : ${[...archivables].sort().join(", ")}`);
  process.exit(0);
}

// 1) transitions → archive, appendées au registre actif (histoire complète avant déplacement)
const ts = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const transitions = [...archivables].sort().map((id) => JSON.stringify({ ev: "maj", ts, id, statut: "archive" }));
appendFileSync(SRC, transitions.join("\n") + "\n");

// 2) partition, ordre préservé
const toutes = readFileSync(SRC, "utf8").split("\n").filter((l) => l.trim());
const restent = [], partent = [];
{
  const recentes = [];
  for (const l of toutes) {
    const e = JSON.parse(l);
    if (e.ev === "ingestion") {
      const ids = e.creations > 0 ? recentes.splice(-e.creations) : [];
      (ids.length && ids.every((id) => archivables.has(id)) ? partent : restent).push(l);
      continue;
    }
    // 28/08 — `scinderRectification` etait DEFINIE depuis le 22/08 et JAMAIS APPELEE : la loi
    // transverse n° 1 du noyau dit qu'une affordance est cablee ou n'existe pas, et celle-ci
    // n'existait pas. Un evenement `rectification_horodatage` ne porte pas de champ `id` — il
    // tombait donc dans `restent` par le seul jeu de `e.id && …`, sans que rien ne le decide.
    // MESURE DU JOUR : le premier archivage a deplacer un item PORTEUR de rectifications a laisse
    // cinq d'entre elles orphelines dans l'actif, et `oracle-todo` est passe de PASS a FAIL sur
    // R9 « rectification sans cible ANTERIEURE ». Le commentaire de la fonction annoncait
    // exactement ce defaut, six jours avant qu'il ne se produise.
    if (e.ev === "rectification_horodatage") {
      const scindee = scinderRectification(e, archivables);
      if (!scindee) { restent.push(l); continue; }
      partent.push(JSON.stringify({ ...e, entrees: scindee.partent }));
      if (scindee.restent.length) restent.push(JSON.stringify({ ...e, entrees: scindee.restent }));
      continue;
    }
    if (e.ev === "creation") recentes.push(e.id);
    (e.id && archivables.has(e.id) ? partent : restent).push(l);
  }
}
writeFileSync(SRC, restent.length ? restent.join("\n") + "\n" : "");
appendFileSync(ARC, partent.join("\n") + "\n");
console.log(`${archivables.size} item(s) archivé(s) (${partent.length} événements) — actifs restants : ${new Set(restent.map((l) => JSON.parse(l).id).filter(Boolean)).size} item(s)`);
