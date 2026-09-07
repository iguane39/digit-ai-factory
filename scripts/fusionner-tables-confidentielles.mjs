#!/usr/bin/env node
// fusionner-tables-confidentielles.mjs — fait entrer dans le CANAL CONFIDENTIEL les entrées que les
// deux anciens fichiers libres d'un poste portent encore, puis met ces fichiers hors d'usage.
//
//   node scripts/fusionner-tables-confidentielles.mjs [--essai]
//
// Le fait (D-28, 07/09/2026) : deux postes ont étendu chacun leur copie des tables sans lien entre
// elles. Ce script se joue UNE FOIS par poste, après que le canal (`<racine>\_confidentiel\`) a été
// cloné : pour chaque table, chaque clé de l'ancien fichier absente du canal y est ajoutée avec SON
// pseudonyme — sauf conflit, qui est nommé et laissé à l'humain :
//   · même clé, pseudonyme différent des deux côtés ;
//   · pseudonyme déjà porté au canal par une autre clé (sinon deux produits sous un même numéro).
// DEUX PASSES : tout est d'abord évalué, rien n'est écrit tant qu'UN conflit existe dans l'une des
// deux tables (un canal à moitié fusionné serait pire que pas fusionné). Sans conflit et sans
// --essai, le canal est écrit et les anciens fichiers renommés `*.fusionne-<date>.json` (jamais
// supprimés : R-29). Le commit et le push du canal restent un geste explicite, nommé en sortie.
// Exit 0 = fusionné ou rien à fusionner · 1 = conflit(s) · 2 = illisible.
import { readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import { racineParc, dossierCanal } from "./lib-confidentiel.mjs";

const essai = process.argv.includes("--essai");
const racine = racineParc(), canal = dossierCanal(racine);
const lire = (p) => JSON.parse(readFileSync(p, "utf8"));
if (!existsSync(join(canal, "tables"))) { console.error(`illisible : le canal n'est pas cloné en ${canal} — git clone <dépôt privé> "${canal}" d'abord`); process.exit(2); }
const jour = new Date().toISOString().slice(0, 10);
const rapport = { canal, essai, tables: {}, conflits: [], ajouts: 0 };
const normal = (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "");

// Passe 1 : évaluer, sans écrire.
const plans = [];
const paires = [
  ["clients", join(racine, "_noms-interdits.json"), join(canal, "tables", "noms-interdits.json")],
  ["produits", join(racine, "_produits-pseudonymes.json"), join(canal, "tables", "produits-pseudonymes.json")],
];
for (const [quoi, ancien, neuf] of paires) {
  if (!existsSync(ancien)) { rapport.tables[quoi] = "aucun ancien fichier — rien à fusionner"; continue; }
  const a = lire(ancien), n = lire(neuf);
  let ajouts = 0;
  if (quoi === "produits") {
    const portes = new Map(Object.entries(n.produits).map(([k, v]) => [v, k]));
    for (const [k, v] of Object.entries(a.produits || {})) {
      if (k in n.produits) { if (n.produits[k] !== v) rapport.conflits.push(`produits : clé « ${k} » → ${v} ici, ${n.produits[k]} au canal`); continue; }
      if (portes.has(v) && normal(portes.get(v)) !== normal(k)) { rapport.conflits.push(`produits : ${v} est déjà porté au canal par « ${portes.get(v)} », l'ancien fichier le donne à « ${k} »`); continue; }
      n.produits[k] = v; portes.set(v, k); ajouts++;
    }
    if (ajouts) n.date_derniere_extension = jour;
  } else {
    for (const champ of ["noms", "identifiants", "sigles"]) for (const x of a[champ] || []) if (!(n[champ] || []).includes(x)) { (n[champ] ||= []).push(x); ajouts++; }
    for (const [k, v] of Object.entries(a.pseudonymes || {})) {
      if (k in (n.pseudonymes || {})) { if (n.pseudonymes[k] !== v) rapport.conflits.push(`clients : « ${k} » → ${v} ici, ${n.pseudonymes[k]} au canal`); continue; }
      (n.pseudonymes ||= {})[k] = v; ajouts++;
    }
  }
  rapport.tables[quoi] = `${ajouts} entrée(s) de l'ancien fichier absente(s) du canal`;
  rapport.ajouts += ajouts;
  plans.push({ ancien, neuf, contenu: n });
}

// Passe 2 : écrire seulement si aucune table n'est en conflit.
if (!essai && rapport.conflits.length === 0) {
  for (const p of plans) { writeFileSync(p.neuf, JSON.stringify(p.contenu, null, 2) + "\n", "utf8"); renameSync(p.ancien, p.ancien.replace(/\.json$/, `.fusionne-${jour}.json`)); }
}
rapport.suite = rapport.conflits.length ? `${rapport.conflits.length} conflit(s) à arbitrer par l'humain — RIEN n'a été écrit, ni renommé`
  : essai ? "essai : rien n'a été écrit"
  : plans.length ? `${rapport.ajouts} ajout(s) écrit(s) au canal, anciens fichiers renommés *.fusionne-${jour}.json — reste à : git -C "${canal}" add -A && git commit && git push`
  : "aucun ancien fichier : rien à faire";
console.log(JSON.stringify(rapport, null, 1));
process.exit(rapport.conflits.length ? 1 : 0);
