// lib-confidentiel.mjs — OÙ VIVENT LES TABLES DE PSEUDONYMISATION, et pourquoi il n'y a qu'un endroit.
//
// Jusqu'au 07/09/2026, les deux tables (clients : `_noms-interdits.json` ; produits :
// `_produits-pseudonymes.json`) étaient deux fichiers libres à la racine du parc, hors de tout
// dépôt. Deux postes travaillant le même jour les ont étendues chacun de leur côté, sans aucun
// lien entre les deux (D-28, synthèse 20260907k) : la mesure disait « même numéro pour les mêmes
// produits », rien ne le garantissait pour le suivant.
//
// Depuis D-28 (a), les tables vivent dans le CANAL CONFIDENTIEL : un dépôt git PRIVÉ
// (`digit-ai-confidentiel`), cloné en `<racine du parc>\_confidentiel\`, tiré par le bootstrap à
// chaque ouverture, poussé à chaque extension. Ce module est le SEUL endroit qui sait où les lire :
//   1. les variables `FORGE_NOMS_INTERDITS` / `FORGE_PRODUITS_PSEUDO` priment (recettes, tables jetables) ;
//   2. sinon `<racine>\_confidentiel\tables\noms-interdits.json` et `…\produits-pseudonymes.json` ;
//   3. sinon, et seulement si le canal n'est pas cloné, les deux anciens fichiers libres — en le
//      DISANT (`origine: "ancien"`), pour qu'un poste en retard sache qu'il doit cloner le canal et
//      fusionner (`scripts\fusionner-tables-confidentielles.mjs`).
// La racine du parc = `FORGE_ROOT`, sinon le parent du pilot.
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PILOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const racineParc = () => process.env.FORGE_ROOT || join(PILOT, "..");
export const dossierCanal = (racine = racineParc()) => process.env.FORGE_CONFIDENTIEL || join(racine, "_confidentiel");

/** Les chemins des deux tables, et d'où ils viennent (`env` | `canal` | `ancien`). */
export function cheminsTables(racine = racineParc()) {
  const canal = dossierCanal(racine);
  const auCanal = { clients: join(canal, "tables", "noms-interdits.json"), produits: join(canal, "tables", "produits-pseudonymes.json") };
  const anciens = { clients: join(racine, "_noms-interdits.json"), produits: join(racine, "_produits-pseudonymes.json") };
  const clients = process.env.FORGE_NOMS_INTERDITS || (existsSync(auCanal.clients) ? auCanal.clients : anciens.clients);
  const produits = process.env.FORGE_PRODUITS_PSEUDO || (existsSync(auCanal.produits) ? auCanal.produits : anciens.produits);
  const origine = process.env.FORGE_NOMS_INTERDITS || process.env.FORGE_PRODUITS_PSEUDO ? "env" : existsSync(auCanal.produits) ? "canal" : "ancien";
  return { clients, produits, canal, origine };
}

// TF-2130 (04/11/2026) — UNE ENTRÉE DE LA TABLE DES PRODUITS PEUT ÊTRE UN OBJET. Un produit dont le
// nom est aussi un mot courant s'inscrit `{ pseudo, formes }` : seules ses graphies déclarées sont
// des mentions, à la casse exacte et en mot entier, comme la porte de publication les juge. Le
// 05/11, l'accueil lisait encore la valeur comme une chaîne et aurait renommé trois lots
// « [object Object] - RETOURS - … ». Tout lecteur de la table passe donc par ces deux fonctions.
/** Le pseudonyme d'une entrée : la valeur elle-même, ou son champ `pseudo` ; sinon `null`. */
export const pseudoDe = (v) => (typeof v === "string" ? v
  : (v && typeof v === "object" && typeof v.pseudo === "string" ? v.pseudo : null));
/** Les graphies déclarées d'une entrée objet, ou `null` : la clé nue vaut alors seule. */
export const formesDe = (v) => {
  if (!v || typeof v !== "object" || Array.isArray(v) || !Array.isArray(v.formes)) return null;
  const f = v.formes.filter((x) => typeof x === "string" && x.trim());
  return f.length ? f : null;
};
