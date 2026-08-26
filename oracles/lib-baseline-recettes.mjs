/**
 * lib-baseline-recettes.mjs — le CLIQUET du nombre de cas par recette (TF-0681).
 *
 * ============================================================================================
 * LE FAIT, ET IL EST ARRIVÉ DANS CE DÉPÔT
 * ============================================================================================
 *
 * Le 26/08/2026, un fichier de recette a été ÉCRASÉ en en écrivant un nouveau. **Onze cas ont
 * disparu** — le lot passe son propre juge, un produit conforme ne reçoit rien, l'artefact hors
 * racine demande une déclaration, l'idempotence par contenu, et sept autres.
 *
 * **LE HARNAIS A RENDU TOUT VERT.** Il a joué le fichier, lu sa ligne de résumé, compté un OK.
 * Le compte d'une recette est **AUTO-DÉCLARÉ** : le fichier annonce lui-même son total, et rien
 * ne sait ce que ce total valait la veille. Le seul signal a été un caractère dans l'état du
 * gestionnaire de versions, remarqué par hasard.
 *
 * *Un dépôt qui se mesure par des recettes est aveugle à la disparition de ses recettes.* C'est
 * la classe de N-38 sur un autre objet : la couverture existe, elle est verte, et elle rassure
 * sur une surface qu'elle ne couvre plus.
 *
 * ============================================================================================
 * CE QUE CE CLIQUET FERME, ET CE QU'IL NE FERME PAS
 * ============================================================================================
 *
 * IL FERME LA DISPARITION. Une baisse du nombre de cas est un ÉCHEC. Retirer un cas devient un
 * geste ÉCRIT — `--appliquer` inscrit la nouvelle valeur et la date — jamais un effet de bord.
 *
 * IL NE FERME PAS LE MENSONGE. Le compte reste auto-déclaré : une recette pourrait annoncer un
 * chiffre qu'elle ne joue pas. Fermer ce trou-là demanderait d'instrumenter chaque recette, et
 * c'est un autre dispositif. **La borne est déclarée, pas comblée au juge.**
 *
 * IL NE JUGE PAS CE QU'IL NE SAIT PAS LIRE. Une recette dont le résumé ne porte aucun compte
 * lisible est rendue NON JUGÉE, avec son nom — jamais tenue pour conforme par défaut. *Le
 * silence d'une sonde n'est pas un verdict*, et une recette qui change son format de sortie
 * sortirait autrement du cliquet sans que personne ne le voie.
 *
 * ============================================================================================
 * L'ASYMÉTRIE, ET POURQUOI ELLE EST DANS CE SENS
 * ============================================================================================
 *
 * Une HAUSSE inscrit la nouvelle valeur automatiquement : c'est un cliquet, et rien n'est perdu
 * en montant. Exiger un geste humain à chaque cas ajouté produirait une friction dont on se
 * débarrasse en désactivant le contrôle — le plus sûr moyen de le rendre inutile.
 *
 * Une BAISSE échoue. **L'effet de bord de l'écriture automatique est réel et il est borné** : le
 * fichier de baseline change pendant une exécution du harnais, et seulement vers le haut.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Le compte de cas lu dans la ligne de résumé d'une recette. Deux formes cohabitent dans ce
 * dépôt et les DEUX sont admises — imposer une forme unique ferait sortir du cliquet toutes les
 * recettes existantes le jour où on la publierait :
 *   · « … : 24 PASS, 0 FAIL »   → 24
 *   · « … : 14/14 PASS (…) »    → 14
 *
 * Rend `null` quand rien n'est lisible. `null` n'est pas `0` : zéro cas serait un fait, illisible
 * est un aveu.
 */
export function compteDe(resume) {
  if (typeof resume !== "string") return null;
  // LE RATIO NU passe en premier, et il n'exige PAS le mot « PASS ». Mesure du premier passage :
  // exiger « PASS » laissait 39 recettes sur 73 hors du cliquet, dont deux familles parfaitement
  // comptables — « 14/14 tests verts », « Recette cadence : 16/16 cas ». Une règle qui impose une
  // forme que le dépôt n'emploie pas mesure l'écart à son auteur, pas la couverture.
  const ratio = /(\d{1,4})\s*\/\s*(\d{1,4})/.exec(resume);
  if (ratio) return Number(ratio[1]);
  const pass = /(\d{1,4})\s*PASS/i.exec(resume);
  if (pass) return Number(pass[1]);
  return null;
}

/** La baseline sur disque. Un fichier absent n'est pas une erreur : c'est un premier passage. */
export function lire(chemin) {
  if (!existsSync(chemin)) return {};
  try {
    const brut = JSON.parse(readFileSync(chemin, "utf8"));
    return brut && typeof brut === "object" && !Array.isArray(brut) ? brut : {};
  } catch {
    return {};
  }
}

/**
 * Confronte les résultats du harnais à la baseline.
 *
 * `resultats` : `[{ nom, statut, resume }]`. Seules les recettes qui ont RÉUSSI sont comptées —
 * une recette en échec a déjà son verdict, et lire son compte partiel ferait baisser la baseline
 * pour une raison qui n'a rien à voir avec la disparition d'un cas.
 *
 * Rend `{ baisses, montees, nonLus, baseline }`. La décision d'écrire appartient à l'appelant.
 */
export function confronter(resultats, baseline, jour) {
  const baisses = [];
  const montees = [];
  const nonLus = [];
  const suivante = { ...baseline };

  for (const r of resultats) {
    if (r.statut !== "OK") continue;
    const vu = compteDe(r.resume);
    if (vu === null) {
      nonLus.push(r.nom);
      continue;
    }
    const connu = baseline[r.nom];
    const avant = connu && Number.isInteger(connu.cas) ? connu.cas : null;
    if (avant === null) {
      suivante[r.nom] = { cas: vu, vu_le: jour };
      montees.push({ nom: r.nom, avant: null, vu });
    } else if (vu > avant) {
      suivante[r.nom] = { cas: vu, vu_le: jour };
      montees.push({ nom: r.nom, avant, vu });
    } else if (vu < avant) {
      baisses.push({ nom: r.nom, avant, vu, perdus: avant - vu });
    }
  }
  return { baisses, montees, nonLus, baseline: suivante };
}

/** Écrit la baseline, triée par nom — un fichier versionné dont l'ordre bouge est illisible. */
export function ecrire(chemin, baseline) {
  const trie = Object.fromEntries(Object.keys(baseline).sort().map((k) => [k, baseline[k]]));
  writeFileSync(chemin, JSON.stringify(trie, null, 1) + "\n", "utf8");
}
