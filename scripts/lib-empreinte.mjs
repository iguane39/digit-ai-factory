/**
 * lib-empreinte.mjs — LE calcul d'empreinte du pilot, en un seul endroit (TF-0615, 25/08/2026).
 *
 * ============================================================================================
 * POURQUOI CE FICHIER EXISTE
 * ============================================================================================
 *
 * Une empreinte de contenu doit être indifférente à la FIN DE LIGNE. Avec `core.autocrlf`, git
 * repose un fichier en CRLF au checkout d'un poste et en LF sur un autre : aucun octet de contenu
 * n'a bougé, et pourtant le sha256 des octets bruts diffère. Un sceau qui dépend du réglage local
 * ne prouve plus rien — il devient décoratif, et deux sessions finissent par se soupçonner
 * mutuellement d'avoir édité à la main une vue que personne n'a touchée.
 *
 * LA CLASSE A ÉTÉ PAYÉE CINQ FOIS, ET LA CINQUIÈME PARCE QUE LES QUATRE PREMIÈRES N'AVAIENT PAS
 * PRODUIT DE FONCTION :
 *   · TF-0072 (forge-seo) — fins de ligne non normalisées avant hachage ;
 *   · TF-0253 (pilot) — le MÊME défaut, deux mois plus tard, dans une autre forge : 12 faux
 *     positifs de boîte d'entrée pour zéro édition réelle ;
 *   · TF-0359 — extension du même correctif à l'idempotence d'ingestion ;
 *   · TF-0474 — le constat qui nomme la classe : « cinq mécanismes d'empreinte coexistent sans
 *     format commun, la même classe est redécouverte forge par forge » ; il a produit un REGISTRE
 *     (`references/EMPREINTES.md`) et un CONTRÔLE (`oracle-empreintes`), mais pas de fonction ;
 *   · TF-0615 (celui-ci) — onze fichiers générés qui rebasculent entre deux postes, parce que
 *     TROIS générateurs de vues du registre hachaient encore les octets bruts. Mesure :
 *     `TODO-ARCHIVE.jsonl` fait 1 554 831 octets et 0 CRLF sur un poste, 1 557 156 et 2 325 CRLF
 *     sur l'autre — l'écart est EXACTEMENT le nombre de retours chariot, et les deux sceaux
 *     diffèrent pour un registre identique.
 *
 * Un registre qui déclare les sites empêche d'en OUBLIER un ; il n'empêche pas d'en écrire un
 * SIXIÈME à la main. C'est ce que cette fonction ferme : le calcul n'existe plus qu'ici, et
 * `oracle-empreintes` (règle E4) refuse désormais tout site qui hache un fichier sans passer par
 * elle ou sans normaliser lui-même.
 *
 * ============================================================================================
 * CE QUI EST NORMALISÉ, ET CE QUI NE L'EST PAS
 * ============================================================================================
 *
 * Normalisé : les fins de ligne CRLF → LF. Rien d'autre. En particulier PAS les espaces de fin de
 * ligne, PAS la casse, PAS l'ordre des clés d'un JSON — ce sont des différences de CONTENU, et une
 * empreinte qui les absorberait cesserait de détecter une édition réelle. La borne est étroite
 * exprès : on absorbe ce que le TRANSPORT ajoute, jamais ce que l'auteur écrit.
 *
 * Un fichier BINAIRE ne se normalise pas — `empreinteBinaire` existe pour ça et le dit dans son
 * nom, plutôt que de laisser un appelant croire qu'il normalise quelque chose.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

/** Le texte, fins de ligne ramenées en LF. La seule normalisation admise. */
export const normaliserLignes = (texte) => String(texte).split("\r\n").join("\n");

/**
 * sha256 hexadécimal d'un TEXTE, fins de ligne normalisées.
 * @param {string} texte
 * @param {number} [longueur] tronque le sceau (12 hex est la convention des vues générées)
 */
export function empreinteTexte(texte, longueur) {
  const hex = createHash("sha256").update(normaliserLignes(texte)).digest("hex");
  return longueur ? hex.slice(0, longueur) : hex;
}

/**
 * sha256 d'un FICHIER texte, fins de ligne normalisées. C'est l'appel que la quasi-totalité des
 * sites veut. Un fichier absent rend `"absent"` — un sceau qui mentirait sur un fichier manquant
 * serait pire que pas de sceau, et les vues générées attendent déjà ce mot.
 * @param {string} chemin
 * @param {number} [longueur]
 */
export function empreinteFichier(chemin, longueur) {
  if (!existsSync(chemin)) return "absent";
  return empreinteTexte(readFileSync(chemin, "utf8"), longueur);
}

/**
 * sha256 des OCTETS BRUTS d'un fichier, sans aucune normalisation.
 *
 * Deux usages LÉGITIMES, et aucun autre :
 *   · un fichier BINAIRE, où « fin de ligne » ne veut rien dire ;
 *   · la COMPATIBILITÉ avec des empreintes consignées avant la normalisation (TF-0253) — la
 *     boîte d'entrée accepte l'une OU l'autre forme, sans quoi la migration créait le faux
 *     positif inverse.
 * Tout autre appel est un site à corriger, pas un cas particulier.
 */
export function empreinteBinaire(chemin, longueur) {
  if (!existsSync(chemin)) return "absent";
  // C'est LA fonction du brut : son nom le dit et son doc l'explique.
  const hex = createHash("sha256").update(readFileSync(chemin)).digest("hex");   // empreinte-brute-ok
  return longueur ? hex.slice(0, longueur) : hex;
}

/**
 * TAILLE d'un fichier texte en octets, indifférente à la fin de ligne (TF-0615, second volet).
 *
 * Le premier volet du même défaut : les README de dossiers rapportent une taille lue sur le
 * disque, donc gonflée d'un octet par ligne sur un poste en CRLF. « 4,1 Ko » d'un côté, « 4,0 Ko »
 * de l'autre, pour le même fichier — et neuf README qui rebasculent à chaque aller-retour. Une
 * projection commitée ne parle que de ce que le dépôt porte : la taille rapportée est donc celle
 * du contenu normalisé, pas celle du checkout local.
 */
export function tailleNormalisee(chemin) {
  if (!existsSync(chemin)) return 0;
  const brut = readFileSync(chemin);
  // Heuristique de binaire volontairement simple : un octet nul n'apparaît pas dans du texte
  // UTF-8. Un binaire garde sa taille réelle — la normaliser n'aurait aucun sens.
  if (brut.includes(0)) return brut.length;
  return Buffer.byteLength(normaliserLignes(brut.toString("utf8")), "utf8");
}
