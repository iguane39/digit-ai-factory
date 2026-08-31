#!/usr/bin/env node
/**
 * allouer-indice.mjs — l'ALLOCATION d'indice livrée comme une fonction, pas seulement la
 * violation comme un verdict (TF-0691, 28/08/2026).
 *
 * LE FAIT QUI LE REND NÉCESSAIRE, mesuré sur un dépôt de produit le 27/08 : un générateur de
 * fiche portait son nom de sortie dans une CONSTANTE (`const BASE = "… - Dev - 20260827a"`) et
 * a réécrit le même fichier quatre fois en 80 minutes — trois contenus différents sous un seul
 * nom, dont deux poussés. `verifier-jugement.mjs` n'y pouvait rien PAR CONSTRUCTION : il compare
 * un livrable à un sceau posé au premier passage d'oracles, or un générateur écrit son nom de
 * sortie AVANT tout passage d'oracle — il n'y a pas de sceau à ce moment-là. C'est la
 * reproduction exacte du défaut fondateur de TF-0523, quatre jours après son remède, par la voie
 * que le remède ne couvre pas.
 *
 * LE CONTRAT (règle 5 des règles de projet — une nouvelle version = un NOUVEAU fichier daté) :
 *   · rien n'existe pour ce jour                  → indice `a` ;
 *   · un fichier du jour porte le MÊME contenu    → SON indice — une re-génération à contenu
 *     inchangé n'est pas une nouvelle version, sinon l'outil pond un fichier par lancement ;
 *   · sinon                                       → l'indice SUIVANT le dernier pris.
 *
 * LA COMPARAISON SE FAIT SUR UNE FORME CANONIQUE où l'indice est neutralisé, parce que la
 * référence imprimée DANS le document (`REF-…-20260827a`, nom de fichier auto-cité) contient
 * l'indice : sans neutralisation, deux contenus identiques différeraient toujours d'une lettre
 * et l'outil allouerait un indice neuf à chaque lancement — le défaut qu'il existe pour fermer.
 *
 * Usage comme module (la voie prévue — tout générateur de la bibliothèque l'importe au lieu de
 * porter une constante) :
 *   import { allouerIndice } from "<pilot>/scripts/allouer-indice.mjs";
 *   const indice = allouerIndice({ dossier, prefixe: "Client - Fiche - Dev - ",
 *                                  jour: "20260831", contenu, extension: ".html" });
 *   const nom = `${prefixe}${jour}${indice}${extension}`;
 *
 * Ce que ce module NE fait PAS, et c'est déclaré :
 *   · il n'écrit RIEN — il rend une lettre, le générateur écrit ;
 *   · il ne juge pas le contenu — `verifier-jugement.mjs` reste le juge de l'édition manuelle ;
 *   · il ne voit pas deux générateurs qui écrivent le même nom EN MÊME TEMPS — la fenêtre
 *     existe, comme pour toute allocation par lecture du disque.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const LETTRES = "abcdefghijklmnopqrstuvwxyz";

/** La forme canonique : chaque occurrence de `<jour><lettre>` perd sa lettre. */
export const canonique = (texte, jour) =>
  String(texte).replaceAll(new RegExp(`${jour}[a-z]`, "g"), jour);

/**
 * Rend l'indice à employer pour écrire `${prefixe}${jour}<indice>${extension}` dans `dossier`.
 * Voir le contrat en tête de fichier.
 */
export function allouerIndice({ dossier, prefixe, jour, contenu, extension = ".html" }) {
  if (!/^\d{8}$/.test(String(jour))) throw new Error(`jour attendu AAAAMMJJ, reçu « ${jour} »`);
  const motif = new RegExp(
    `^${String(prefixe).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${jour}([a-z])${String(extension).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
  const pris = existsSync(dossier)
    ? readdirSync(dossier).map((f) => f.match(motif)).filter(Boolean)
      .map((m) => ({ lettre: m[1], nom: m[0] }))
      .sort((a, b) => a.lettre.localeCompare(b.lettre))
    : [];
  if (!pris.length) return "a";
  const mienne = canonique(contenu, jour);
  for (const { lettre, nom } of pris) {
    let existant;
    try { existant = readFileSync(join(dossier, nom), "utf8"); } catch { continue; }
    if (canonique(existant, jour) === mienne) return lettre;
  }
  const derniere = pris[pris.length - 1].lettre;
  const suivant = LETTRES.indexOf(derniere) + 1;
  return suivant < LETTRES.length ? LETTRES[suivant] : "z";
}
