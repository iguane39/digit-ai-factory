/**
 * lib-indice-nom.mjs — L'INDICE D'UN NOM DE LIVRABLE DATÉ, ÉCRIT UNE SEULE FOIS (TF-2685, 22/11/2026).
 *
 * LE FAIT. `<jour><indice>` : l'indice est une lettre, « a » à « z ». Au 27e nom d'un même jour, l'allocateur
 * (`scripts\allouer-indice.mjs`) rend « za » à « zz » (TF-2681, 16/11/2026), et le juge de lot
 * (`gabarits\oracle-lot-retours.mjs`) les lit. Six autres lecteurs portaient encore `\d{8}[a-z]?` : un lot
 * « … - RETOURS - 20261115za.md » n'était ni un lot pour la boîte d'entrée (B6 le sautait sans le dire), ni pour
 * l'accueil, ni pour le relevé des produits, et R-4 refusait le nom d'un livrable que l'allocateur venait de proposer.
 * La cause : l'expression vivait en copie dans chaque fichier, et la correction de TF-2681 n'a atteint que deux copies.
 *
 * LA RÈGLE. Un lecteur de nom de livrable daté compose son expression avec ce module, il ne réécrit pas l'indice.
 * `gabarits\oracle-lot-retours.mjs` garde sa propre copie (il voyage chez les produits, sans accès à `oracles\`) :
 * `lib-indice-nom.test.mjs` vérifie qu'elle lit les mêmes noms.
 */

/** Un indice : une lettre, ou « za » à « zz » (TF-2681). Source d'expression, à insérer dans une `RegExp`. */
export const INDICE = "(?:z[a-z]|[a-z])";

/** Le jour AAAAMMJJ et son indice facultatif, source d'expression sans groupe capturant. */
export const JOUR_INDICE = `\\d{8}${INDICE}?`;

/** Le nom d'un lot de retours : 1 = préfixe, 2 = jour, 3 = indice (vide si absent). */
export const NOM_DE_LOT = new RegExp(`^(.*) - RETOURS - (\\d{8})(${INDICE}?)\\.md$`, "i");
