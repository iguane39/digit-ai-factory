/**
 * lib-decision-lue.mjs — UNE RECOMMANDATION QUI CHANGE UNE VALEUR CITE LA DÉCISION QUI L'ACCOMPAGNE
 * (TF-1645, 14/10/2026). Une source, deux lecteurs : `oracle-livrable-conseil.mjs` (LC6, le
 * diagnostic) et `oracle-fiche-constat-precos.mjs` (CP7, la fiche).
 *
 * LE FAIT (lot `Produit-64 - RETOURS - 20261012f`, RT-41). Le 12/10/2026, une session a recommandé de
 * passer un service de traitement de 2 vCPU à 0,25 vCPU, sur la seule utilisation moyenne du
 * processeur (3 à 31 millicœurs). Le dépôt du produit justifiait ces 2 cœurs par une mesure, dans un
 * commentaire de son code d'infrastructure : un budget de latence de 5 secondes, et 144 secondes de
 * consolidation à 0,5 cœur. La recommandation aurait cassé ce budget ; elle a été retirée au tour
 * suivant. *Une valeur commentée comme décision prise après mesure ne se renverse pas sur une
 * métrique d'usage seule.*
 *
 * LA RÈGLE. Une recommandation qui MODIFIE une valeur chiffrée d'un produit (dimensionnement,
 * configuration, nombre d'exemplaires, rétention, seuil) porte un renvoi `[décision : …]` : soit
 * l'endroit où la décision qui accompagne cette valeur est écrite (bloc d'infrastructure, ADR,
 * décision consignée), soit `[décision : aucune — cherché <où>]`. Le renvoi prouve que la lecture a
 * été faite ; il ne prouve pas qu'elle a été bien faite.
 *
 * CE QUI EST RECONNU COMME UN CHANGEMENT DE VALEUR, ET C'EST UN VOCABULAIRE FERMÉ. Un verbe de
 * changement (passer, réduire, ramener, augmenter, abaisser, relever, diminuer, redimensionner,
 * descendre, monter, porter à, fixer à) ET un nombre suivi d'une unité de taille, de capacité, de
 * durée ou de quantité. Un changement dit sans chiffre (« passer en mode dev ») n'est pas vu : c'est
 * le faux négatif déclaré des deux juges.
 */
const NORMALISER = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const VERBES_CHANGEMENT = /\b(?:passer|passe|reduire|reduit|reduisez|ramener|ramene|augmenter|augmente|abaisser|abaisse|relever|releve|diminuer|diminue|redimensionner|redimensionne|descendre|monter|porter a|fixer a)\b/;
export const VALEUR_CHIFFREE = /\b\d+(?:[.,]\d+)?\s*(?:v?cpu|vcores?|coeurs?|cœurs?|cores?|millicoeurs?|millicœurs?|gio|go|gb|gib|mio|mo|mb|mib|tio|to|tb|replicas?|repliques?|instances?|exemplaires?|noeuds?|pods?|workers?|threads?|connexions?|ms|s|secondes?|min|minutes?|h|heures?|jours?|mois|%|dtu|ru)(?![\p{L}])/u;
export const RENVOI_DECISION = /\[\s*d[ée]cision\s*:\s*[^\]\s][^\]]*\]/i;

/** Vrai si le texte recommande de changer une valeur chiffrée. */
export function changeUneValeur(texte) {
  const t = NORMALISER(texte);
  return VERBES_CHANGEMENT.test(t) && VALEUR_CHIFFREE.test(t);
}

/** Vrai si le texte porte le renvoi à la décision lue. */
export const citeLaDecision = (texte) => RENVOI_DECISION.test(String(texte));

export const MESSAGE_REGLE = "une recommandation qui change une valeur chiffrée d'un produit cite la décision qui accompagne "
  + "cette valeur dans son code ou ses décisions : `[décision : <où elle est écrite>]`, ou `[décision : aucune — cherché <où>]`. "
  + "Le 12/10/2026, une réduction de 2 à 0,25 vCPU recommandée sur la seule utilisation moyenne aurait cassé un budget de "
  + "latence mesuré et documenté dans le code (TF-1645)";
