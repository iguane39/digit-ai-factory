#!/usr/bin/env node
/**
 * verifier-jeu-livrables.mjs — UN FORMAT DÉCLARÉ QUI MANQUE SE VOIT, quel que soit le
 * générateur employé (TF-0702, 28/08/2026).
 *
 * LE FAIT QUI L'IMPOSE. La famille `gd-fiche-securite` déclare deux formats, html et pdf. Un
 * produit a remis sa fiche SANS pdf le 25/08, puis le 27/08 — deux jours et quatre jours après
 * que la factory a corrigé son générateur (TF-0506). La correction n'a pas pu l'atteindre : le
 * générateur du produit est une RÉÉCRITURE en Python, qui lit un gabarit imposé par son client
 * et que l'outil Node de la factory ne sait pas consommer. PROPAGER LES GÉNÉRATEURS NE MARCHE
 * PAS ; propager les ORACLES marche — un oracle est agnostique du langage, et la preuve est au
 * dossier : ce produit appelle déjà `verifier-pdf.mjs` de la factory depuis Python, via
 * subprocess, et s'arrête sur son code de retour.
 *
 * CE QUE CE CONTRÔLE FAIT : pour chaque livrable .html/.md qui porte son marqueur de famille
 * (`Gabarit : gd-… · version du gabarit x.y.z` — rendu prescrit par G4, TF-0690), il lit les
 * `formats` que le catalogue déclare pour cette famille, et ÉCHOUE si un fichier frère du même
 * nom de base manque pour l'un d'eux. Il aurait refusé les deux remises du 25 et du 27/08 sans
 * rien savoir du générateur employé — c'est toute sa raison d'être.
 *
 * Usage : node scripts\verifier-jeu-livrables.mjs <dossier|fichier> [--catalogue <jsonl>] [--json]
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP motivé (rien à juger n'est pas un vert).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");
const iC = args.indexOf("--catalogue");
const CATALOGUE = iC > -1 ? args[iC + 1] : join(PILOT, "gabarits", "documents", "catalogue.jsonl");
const cible = args.find((a, i) => !a.startsWith("--") && (iC === -1 || i !== iC + 1)) || null;

const ID_GABARIT = /gabarit\s*:\s*(gd-[a-z0-9-]+)/i;
/** Seuls les fichiers porteurs du marqueur de famille sont jugés — un texte libre ne l'est pas. */
const PORTEURS = new Set([".html", ".htm", ".md"]);

const sortir = (verdict, code, findings, motif = null) => {
  console.log(JSON.stringify({
    outil: "verifier-jeu-livrables", version: "1.0.0", verdict, motif, findings,
    non_juge: [
      "un document SANS marqueur de famille (`Gabarit : gd-…`) : la famille ne se devine pas — " +
      "c'est G4 (TF-0690) qui fait porter le marqueur, et ce contrôle en dépend, frontière déclarée",
      "le CONTENU des fichiers du jeu : seule leur EXISTENCE est jugée — un pdf présent mais vide " +
      "ou périmé relève du sceau (verifier-jugement.mjs) et des oracles de la famille",
      "les familles hors catalogue `gd-…` (gabarits de clients, formes locales d'un produit) : " +
      "leur contrat de formats vit chez elles",
    ],
  }, null, jsonOnly ? 0 : 1));
  process.exit(code);
};

if (!cible) sortir("ERREUR", 2, [], "usage : node scripts\\verifier-jeu-livrables.mjs <dossier|fichier> [--catalogue <jsonl>] [--json]");
if (!existsSync(cible)) sortir("SKIP", 2, [], `cible introuvable : ${cible} — rien n'a été jugé`);
if (!existsSync(CATALOGUE)) sortir("SKIP", 2, [], `catalogue introuvable : ${CATALOGUE} — sans lui, aucun contrat de formats à opposer`);

// Le contrat : id de famille → formats déclarés. Une ligne illisible est ignorée (l'en-tête du
// catalogue n'est pas une famille), une famille sans `formats` n'impose rien.
const familles = new Map();
for (const l of readFileSync(CATALOGUE, "utf8").split(/\r?\n/)) {
  if (!l.trim()) continue;
  try {
    const o = JSON.parse(l);
    if (o.id && Array.isArray(o.formats)) familles.set(o.id.toLowerCase(), o.formats.map((f) => String(f).toLowerCase()));
  } catch { /* en-tête ou ligne libre */ }
}
if (!familles.size) sortir("SKIP", 2, [], `aucune famille porteuse de formats dans ${CATALOGUE}`);

const fichiers = [];
if (statSync(cible).isFile()) fichiers.push(cible);
else {
  const marcher = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith(".") || e.name === "node_modules" || e.name.toLowerCase() === "old") continue;
      const c = join(d, e.name);
      if (e.isDirectory()) marcher(c);
      else if (PORTEURS.has(extname(e.name).toLowerCase())) fichiers.push(c);
    }
  };
  marcher(cible);
}

const findings = [];
let juges = 0, echecs = 0;
for (const f of fichiers) {
  let texte;
  try { texte = readFileSync(f, "utf8"); } catch { continue; }
  const m = ID_GABARIT.exec(texte);
  if (!m) continue;                                  // sans marqueur, pas de contrat — déclaré au non_juge
  const id = m[1].toLowerCase();
  const formats = familles.get(id);
  if (!formats) {
    echecs += 1;
    findings.push({ statut: "FAIL", ou: f, message: `le document se réclame de « ${id} », famille ` +
      "INCONNUE du catalogue — soit le marqueur est faux, soit la famille n'est pas recensée : " +
      "dans les deux cas le contrat de formats est invérifiable, et le dire vaut mieux qu'un vert" });
    continue;
  }
  juges += 1;
  const base = join(dirname(f), basename(f, extname(f)));
  const manquants = formats.filter((ext) => !existsSync(`${base}.${ext}`)
    && !(ext === "html" && existsSync(`${base}.htm`)));
  if (manquants.length) {
    echecs += 1;
    findings.push({ statut: "FAIL", ou: f, message: `jeu INCOMPLET pour ${id} : le catalogue déclare ` +
      `[${formats.join(", ")}], il manque ${manquants.map((x) => `« ${basename(base)}.${x} »`).join(" et ")} ` +
      "à côté de ce fichier. Un format déclaré est dû quel que soit le générateur employé — c'est " +
      "précisément le contrôle qui aurait refusé les remises sans pdf des 25 et 27/08 (TF-0702)" });
  } else {
    findings.push({ statut: "PASS", ou: f, message: `jeu complet pour ${id} : [${formats.join(", ")}] tous présents` });
  }
}

if (!juges && !echecs) sortir("SKIP", 2, findings, `aucun document porteur d'un marqueur de famille sous ${cible} — rien à juger, et ce n'est pas un vert`);
sortir(echecs ? "FAIL" : "PASS", echecs ? 1 : 0, findings, `${juges + echecs} document(s) confronté(s) au catalogue`);
