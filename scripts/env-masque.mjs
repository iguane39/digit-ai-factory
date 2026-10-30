#!/usr/bin/env node
/**
 * env-masque.mjs — LIRE UN `.env` SANS EN MONTRER UNE VALEUR (décision humaine D-106 (b) du 29/10/2026).
 *
 * `oracles\hook-fichiers-env.mjs` refuse qu'une session lise ou affiche un `.env` : ce script est la voie
 * qu'il propose à la place. Il lit le fichier lui-même, et ne rend à la session que ce qui ne porte aucun
 * secret.
 *
 * Usage :
 *   node scripts\env-masque.mjs <fichier>           chaque valeur remplacée par ******** (vide : <vide>)
 *   node scripts\env-masque.mjs <fichier> --cles    la liste des seules clés, une par ligne
 *
 * Ce qui est rendu, ligne à ligne :
 *   · `CLE=valeur`, `export CLE=valeur` → `CLE=********` (ou `CLE=<vide>` si la valeur est vide : savoir qu'une
 *     clé n'est pas renseignée n'est pas un secret) ; la longueur de la valeur n'est jamais révélée ;
 *   · `# CLE=valeur` (clé commentée) → `# CLE=********` : une clé mise en commentaire est un secret tout autant ;
 *   · tout autre commentaire → `# …` : un commentaire libre peut porter une valeur, son texte n'est pas rendu ;
 *   · ligne vide → ligne vide ; ligne qui n'est pas une affectation → `<ligne non reconnue>`.
 * Avec `--cles` : les clés des affectations actives, sans les clés commentées.
 *
 * Jamais une valeur sur la sortie standard ni sur la sortie d'erreur : les messages d'erreur ne citent que le
 * chemin donné. Exit 0 rendu · 1 usage ou fichier illisible.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const AFFECTATION = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_.\-]*)\s*=(.*)$/;
const COMMENTAIRE_AFFECTATION = /^\s*#\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_.\-]*)\s*=(.*)$/;

/** Rend le texte masqué d'un contenu de `.env` (ou, avec `cles`, la liste des clés). Pur : aucune lecture. */
export function masquer(contenu, { cles = false } = {}) {
  const lignes = String(contenu).replace(/^﻿/, "").split(/\r?\n/);
  if (lignes.length && lignes[lignes.length - 1] === "") lignes.pop();
  const sortie = [];
  for (const ligne of lignes) {
    const a = AFFECTATION.exec(ligne);
    if (a) {
      if (cles) sortie.push(a[1]);
      else sortie.push(`${a[1]}=${a[2].trim() === "" ? "<vide>" : "********"}`);
      continue;
    }
    if (cles) continue;
    const c = COMMENTAIRE_AFFECTATION.exec(ligne);
    if (c) { sortie.push(`# ${c[1]}=${c[2].trim() === "" ? "<vide>" : "********"}`); continue; }
    if (/^\s*#/.test(ligne)) { sortie.push("# …"); continue; }
    if (ligne.trim() === "") { sortie.push(""); continue; }
    sortie.push("<ligne non reconnue>");
  }
  return sortie.join("\n") + (sortie.length ? "\n" : "");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const cles = args.includes("--cles");
  const fichiers = args.filter((a) => !a.startsWith("--"));
  if (fichiers.length !== 1 || args.some((a) => a.startsWith("--") && a !== "--cles")) {
    process.stderr.write("usage : node scripts/env-masque.mjs <fichier> [--cles]\n");
    process.exit(1);
  }
  let contenu;
  try { contenu = readFileSync(fichiers[0], "utf8"); } catch {
    process.stderr.write(`env-masque : fichier illisible : ${fichiers[0]}\n`);
    process.exit(1);
  }
  process.stdout.write(masquer(contenu, { cles }));
}
