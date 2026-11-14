/**
 * lib-lecteur-declare.mjs — où un document déclare son lecteur (TF-2346, 10/11/2026, RP-209).
 *
 * LE FAIT. EC-10 (oracle-ecriture) et G10 (D11, oracle-gabarits-documents) lisaient le lecteur d'un document dans
 * son seul en-tête YAML (`role_destinataire` ou `lecteur`). Un livrable Markdown remis à un client porte alors un
 * en-tête d'auteur que le client voit en ouvrant le fichier ; le 30/09/2026, la contre-visite commerciale d'un modèle
 * de fichier de consignes l'a demandé retiré, et le retirer rendait EC-10 SKIP : l'en-tête a été gardé, réécrit en
 * termes neutres pour le client.
 *
 * LES TROIS PLACES, dans cet ordre, la première qui répond fait foi :
 *   1. l'en-tête YAML du fichier (comportement d'origine) ;
 *   2. un commentaire HTML que le rendu masque : `<!-- lecteur : … -->` ou `<!-- role_destinataire : … -->` ;
 *   3. un sidecar hors du fichier livré, à côté de lui : `<fichier>.lecteur.json`, `{ "lecteur": "…" }`
 *      (clé `role_destinataire` admise).
 * Rien n'est inventé : sans déclaration aux trois places, la fonction rend null et la règle appelante garde son SKIP.
 */
import { existsSync, readFileSync } from "node:fs";

const RE_YAML = /^\s*(?:role_destinataire|lecteur)\s*:\s*(.+)$/im;
const RE_COMMENTAIRE = /<!--\s*(?:role_destinataire|lecteur)\s*:\s*([\s\S]*?)-->/i;

/** Le lecteur déclaré par `texte` (en-tête YAML ou commentaire HTML), ou null. */
export function lecteurDansLeTexte(texte) {
  const t = String(texte ?? "");
  const enTete = /^﻿?---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(t);
  if (enTete) {
    const y = RE_YAML.exec(enTete[1]);
    if (y && y[1].trim()) return y[1].trim();
  }
  const c = RE_COMMENTAIRE.exec(t);
  if (c && c[1].trim()) return c[1].replace(/\s+/g, " ").trim();
  return null;
}

/** Le lecteur déclaré dans le sidecar `<chemin>.lecteur.json`, ou null (absent, illisible, vide). */
export function lecteurDansLeSidecar(chemin) {
  if (!chemin) return null;
  const f = `${chemin}.lecteur.json`;
  if (!existsSync(f)) return null;
  try {
    const j = JSON.parse(readFileSync(f, "utf8"));
    const v = j.lecteur ?? j.role_destinataire;
    return typeof v === "string" && v.trim() ? v.trim() : null;
  } catch { return null; }
}

/** Le lecteur déclaré pour `texte` (fichier `chemin`, s'il existe), aux trois places. */
export function lecteurDeclare(texte, chemin = "") {
  return lecteurDansLeTexte(texte) ?? lecteurDansLeSidecar(chemin);
}
