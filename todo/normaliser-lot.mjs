#!/usr/bin/env node
/**
 * normaliser-lot.mjs — convertit un sidecar de retours au format R10, sans rien décider.
 *
 * TF-0196. Constat du 14/08 : le lot `bourse-aux-vacants - RETOURS - 20260814a` a été REJETÉ
 * en bloc par `ingerer-lot.mjs` (rejet atomique, registre intact — le garde-fou a bien joué),
 * sur six motifs par ligne. Le produit émettait `{id, statut, origine, lot, ts, reference,
 * gravite, titre, preuve, proposition}` là où `gabarits\RETOURS-FORGES.md` prescrit
 * `{schema:1, titre, contenu, demandeur, source, date_demande, forges_cibles_initiales}`.
 * La conversion s'est faite à la main. Elle se refera à chaque lot tant qu'elle n'est pas
 * outillée.
 *
 * Arbitrage tenu ici, et c'est le point important : **l'ingesteur reste STRICT**. On ne le
 * rend pas tolérant — son rejet atomique est ce qui garantit qu'aucune candidature mal formée
 * n'entre au registre. On ajoute une pièce AMONT, explicite, qui produit un DÉRIVÉ : l'original
 * reçu n'est jamais modifié (« un lot remis ne se modifie plus »).
 *
 * Ce que ce script ne fait PAS, délibérément :
 *   - il n'ingère rien (c'est `ingerer-lot.mjs`, écrivain unique du registre) ;
 *   - il n'invente aucun champ qu'il ne peut pas dériver : `forges_cibles_initiales` se lit
 *     dans le titre, et si le titre ne nomme aucune forge, la ligne est REFUSÉE avec son motif
 *     plutôt que rangée sous une forge au hasard ;
 *   - il ne note rien : le score par défaut est celui de l'ingesteur, la gravité déclarée par
 *     le produit sert seulement de `gain`, l'effort reste à l'humain qui décidera.
 *
 * Usage : node normaliser-lot.mjs <sidecar-produit.tf.jsonl> [--sortie <fichier>]
 * Sortie : `<nom>.normalise.tf.jsonl` à côté de l'original, prêt pour `ingerer-lot.mjs`.
 * Exit : 0 = converti · 1 = au moins une ligne refusée (rien n'est écrit) · 2 = erreur d'usage.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const source = process.argv[2];
const iSortie = process.argv.indexOf("--sortie");
if (!source || !existsSync(source)) {
  console.error("usage : node normaliser-lot.mjs <sidecar-produit.tf.jsonl> [--sortie <fichier>]");
  process.exit(2);
}
const destination = iSortie > 0
  ? process.argv[iSortie + 1]
  : join(dirname(source), basename(source).replace(/\.tf\.jsonl$/, "") + ".normalise.tf.jsonl");

// Forges connues de l'écosystème : sert à dériver la cible depuis le titre, jamais à deviner.
const FORGES = [
  "forge-agents-security", "forge-agents", "forge-audit", "forge-conception", "forge-data",
  "forge-design", "forge-development", "forge-observability", "forge-ops", "forge-organization",
  "forge-seo", "forge-tests", "forge-websec", "digit-ai-forge-pilot", "pilot",
];
// Gravité déclarée par le produit -> `gain`. L'effort n'est PAS dérivé : il est décidé.
const GAIN = { bloquant: 3, majeur: 3, mineur: 1 };

const lignes = readFileSync(source, "utf8").split("\n").filter((l) => l.trim());
const refus = [];
const sorties = [];

lignes.forEach((ligne, i) => {
  let c;
  try { c = JSON.parse(ligne); } catch { refus.push(`ligne ${i + 1} : JSON invalide`); return; }
  // Déjà au format R10 : on ne retouche pas ce qui est conforme.
  if (c.schema === 1) { sorties.push(c); return; }
  const titre = String(c.titre || "").trim();
  if (!titre) { refus.push(`ligne ${i + 1} : aucun titre — rien à convertir`); return; }
  const cibles = FORGES.filter((f) => titre.toLowerCase().includes(f));
  if (!cibles.length) {
    refus.push(
      `ligne ${i + 1} : aucune forge nommée dans le titre — la cible ne se devine pas, ` +
      `ajouter « <forge> : » en tête du titre côté produit (gabarit RETOURS-FORGES)`
    );
    return;
  }
  const preuve = String(c.preuve || "").trim();
  const proposition = String(c.proposition || "").trim();
  if (!preuve) { refus.push(`ligne ${i + 1} : aucune preuve — un retour sans fait observé n'est pas instruisable`); return; }
  const reference = String(c.reference || `ligne ${i + 1}`);
  const gravite = String(c.gravite || "majeur");
  sorties.push({
    schema: 1,
    titre,
    contenu:
      `[${reference}, gravité ${gravite} déclarée par le produit] PREUVE : ${preuve}` +
      (proposition ? ` — PROPOSITION ESQUISSÉE : ${proposition}` : ""),
    demandeur: String(c.origine || "produit non nommé"),
    source: `lot ${c.lot || basename(source)}${c.ts ? ` (émis ${c.ts})` : ""}`,
    date_demande: String(c.ts || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    forges_cibles_initiales: [cibles[0]],
    // `preuve` et `effort` ne se dérivent pas d'un lot : l'ingesteur pose son défaut, et
    // l'humain tranche à la décision. Seul le `gain` reprend la gravité DÉCLARÉE.
    score: { gain: GAIN[gravite] ?? 2, preuve: 3, effort: 3 },
    preuve_du_cout: preuve.slice(0, 300),
  });
});

if (refus.length) {
  console.error(
    `[REFUS] ${basename(source)} — rien n'a été écrit. Motifs :\n  - ${refus.join("\n  - ")}`
  );
  process.exit(1);
}
writeFileSync(destination, sorties.map((s) => JSON.stringify(s)).join("\n") + "\n", "utf8");
console.log(
  `[OK] ${sorties.length} candidature(s) normalisée(s) -> ${destination}\n` +
  "     l'original n'a pas été modifié ; ingérer avec : node ingerer-lot.mjs <ce fichier>"
);
