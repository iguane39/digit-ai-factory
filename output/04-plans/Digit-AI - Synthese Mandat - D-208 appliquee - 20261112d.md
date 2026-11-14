## 0. Synthèse d'ouverture

Votre réponse D-208 (a) est appliquée et publiée. Le script qui fusionne clé par clé les fichiers de secrets entre dans l'héritage des produits, en copie conforme. La règle de reprise multi-poste porte désormais une exception écrite : un développeur peut sauvegarder ses propres secrets, par ce script et ses gardes. Le canal de reprise lui-même reste fermé aux secrets. Rien n'attend de décision de votre part.

## 1. En-tête d'identification

Synthèse du mandat « 208a », sur le pilot, le 12/11/2026 à 17:06, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de distribuer le script aux produits et d'écrire l'exception à la règle, sans ouvrir le canal de reprise aux secrets. Test rétro : le script est déclaré à l'héritage, l'exception est écrite et bornée, et les recettes qui lisent l'héritage et la reprise restent vertes.

## 3. Décisions attendues

Rien n'attend de décision nouvelle de votre part : ce tour applique votre réponse.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

Le geste tient en 2 fichiers du pilot, rejoués avant la publication.
- L'héritage des produits passe en 1.60.0. Le script de fusion y est déclaré en copie conforme, sous `forge/fusionner-env.mjs`, avec son motif.
- La règle 4 de la reprise multi-poste (`REGLES-PROJET.md`) porte l'exception D-208 (a). La sauvegarde de ses propres secrets est permise hors du canal, par ce script seul. Le script fusionne sans perte et refuse un conflit sans choix. Il exige un fichier ignoré par git et n'imprime aucune valeur.
- Recettes rejouées vertes : fusion 9 PASS, recopie de l'héritage 22 PASS, relevé de l'héritage 49 PASS, hooks des produits 50/50, reprise 11 PASS, conformité 237 PASS. Le contrôle des règles sans juge reste rouge sur une autre règle, comme avant ce tour.
- TF-2440 est clos, avec votre réponse citée au registre, qui reste PASS.

Relecture d'intention : sans objet, une réponse appliquée par 2 éditions du pilot, sans consigne passée à un agent.

## 5. Non traité

- L'appel du script par la sauvegarde du produit qui l'a demandé — motif : hors_mandat, ce script de sauvegarde vit dans le dépôt du produit, où le pilot n'écrit pas sans run demandé.

## 8. Prochaines actions

Trois actions suivent, aucune ne vous revient.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Chez le produit qui l'a demandé, faire appeler `forge/fusionner-env.mjs` par sa sauvegarde, et lire la destination dans une variable de poste | TF-2439 | auto_ia | hors_mandat : écriture chez un produit, à faire par sa propre session | `forge/fusionner-env.mjs fusionner <fichier-du-poste> <copie> --ecrire` | si rien n'est fait, sa sauvegarde continue d'écraser des clés |
| A-2 | Lancer la campagne qui corrige les 11 candidats triés en A-2, en commençant par le hameçon d'anonymisation du pilot | TF-2457 | auto_ia | hors_mandat : posée au tour précédent, non demandée ici | `todo/TODO.jsonl`, décisions du 12/11 ; agents de campagne en arbres de travail | si rien n'est fait, un commit peut encore emporter les lignes non enregistrées d'une autre session |
| A-3 | Trier les 8 candidats nés de la dernière campagne | TF-2458 | auto_ia | hors_mandat : posée au tour précédent, non demandée ici | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, les rouges de digit-ai-schemas restent au self-test |

Ordre : le produit d'abord, parce que sa sauvegarde perd des clés aujourd'hui ; puis la campagne, qui ferme un défaut d'enregistrement ; le tri en dernier, parce qu'il ne bloque rien.

## 9. Traces

- `gabarits/HERITAGE.json` 1.60.0 et `REGLES-PROJET.md` : le commit de ce tour, publié avec cette synthèse et vérifié par `git rev-list --count origin/main..main` à 0.
- `todo/TODO.jsonl` : la clôture de TF-2440 ; oracle du registre PASS.
