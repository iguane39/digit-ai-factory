#!/usr/bin/env node
/**
 * designation-projet.mjs — relève, dans le texte d'un lot, la forme par laquelle un produit SE DÉSIGNE
 * lui-même et qu'aucune table ne connaît, pour qu'un humain la QUALIFIE avant qu'elle voyage
 * (TF-1540, campagne du 12/10/2026).
 *
 * LE FAIT. Le 01/10/2026, la relecture avant publication a trouvé le sigle que deux produits emploient
 * pour se nommer dans 22 fichiers suivis du pilot, publiés depuis le 08/09. Ni la table des clients ni
 * celle des produits ne le portait ; la porte des noms ne juge que ce que les tables connaissent, donc
 * rien ne l'a arrêté. Un produit se nomme lui-même dans une phrase que ses lots reprennent : « <nom>
 * tient une séquence RT-nn » (19 fichiers sur 298 lots lus le 12/10/2026, pour une seule forme inconnue). Cette phrase est la source de la
 * désignation ; c'est elle que ce relevé lit.
 *
 * LE MODÈLE est celui des noms de personnes (TF-1357) : un AVERTISSEMENT, jamais un refus. Seul le porteur
 * sait si la forme désigne une identité à protéger ; le relevé demande, il ne tranche pas. La forme est
 * NOMMÉE à l'écran ; l'événement d'ingestion n'en porte que le NOMBRE.
 *
 * CE QUI N'EST PAS RELEVÉ : un pseudonyme (« Produit-11 », « Client-A »), un émetteur forge, un mot sans
 * majuscule ni chiffre (« le pilot »). Seule la phrase « tient une séquence » est lue : une désignation
 * écrite autrement n'est pas vue, et c'est dit ici plutôt que deviné ailleurs.
 *
 * Usage : node todo/designation-projet.mjs <fichier> — imprime le relevé (exit 0 vide, 1 sinon).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EST_EMETTEUR_FORGE } from "./anonymiser-entrant.mjs";

export const MOTIF_DESIGNATION = /(?<![\p{L}\d_-])([\p{L}\d][\p{L}\d_.-]{1,30})\s+tient\s+une\s+s[ée]quence/giu;
const PSEUDONYME = /^[\p{L}]+-(?:\d{1,3}|[A-Z])$/u;

/** Chaque désignation à qualifier, dans l'ordre d'apparition, sans doublon. */
export function relever(texte) {
  const vues = new Set();
  for (const m of String(texte).matchAll(MOTIF_DESIGNATION)) {
    const forme = m[1].replace(/[.-]+$/, "");
    if (PSEUDONYME.test(forme) || EST_EMETTEUR_FORGE.test(forme)) continue;
    if (!/[\p{Lu}\d]/u.test(forme)) continue;
    vues.add(forme);
  }
  return [...vues];
}

/** Les désignations à qualifier de plusieurs textes (le nom déposé et le contenu), sans doublon. */
export function aQualifier(textes) {
  const toutes = new Set();
  for (const t of textes) for (const f of relever(t)) toutes.add(f);
  return [...toutes];
}

export function messageAQualifier(formes, ou = "") {
  if (!formes.length) return null;
  return `[DÉSIGNATION DE PROJET À QUALIFIER] ${formes.length} forme(s)${ou ? ` dans ${ou}` : ""} : ${formes.join(", ")}\n`
    + "  Le lot désigne son projet par une forme que les tables ne connaissent pas. Nom ou sigle à protéger ? "
    + "L'inscrire au canal confidentiel AVANT l'enregistrement du lot ; code interne public ou faux positif : rien à faire (TF-1540).";
}

if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === String(process.argv[1]).replace(/\//g, "\\").toLowerCase()) {
  if (!process.argv[2]) { console.error("usage : node todo/designation-projet.mjs <fichier>"); process.exit(2); }
  const formes = relever(readFileSync(process.argv[2], "utf8"));
  console.log(formes.length ? messageAQualifier(formes, process.argv[2]) : `aucune désignation de projet à qualifier dans ${process.argv[2]}`);
  process.exit(formes.length ? 1 : 0);
}
