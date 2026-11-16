# Retours forges — digit-ai-marketing — 20261112g

- **Contexte** : autre — décision humaine D-181 (a) du 12/11/2026 : ligne L12 et scripts de la série inscrits au référentiel du produit. Lot reconstruit le 12/11/2026 depuis le ledger seq 733 par une session parallèle, qui avait écrasé par erreur le lot d'origine de même nom avant son ingestion (ledger seq 742).
- **Références ledger** : `forge\ledger.jsonl` seq 733 (entrée `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 1 vue régénérée, 21 constats de rendu relevés, 34 sur la vue précédente. Ce lot remonte 1 retour, tiré de 1 entrée du ledger, au pilot.

---

## Pilot (`digit-ai-factory`)

Une vue que le pilot génère chez le produit échoue à la critique de rendu, et le produit ne peut pas la corriger.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-230 | majeur | générique | **`docs/projet/ARCHITECTURE.html`, régénérée par `generer-architecture.mjs`, échoue à `run-oracles-design --rendu`.** Faits : le 12/11/2026, après une modification de `ARCHITECTURE.md`, `render_page` rend FAIL : 2 constats V1 (à 390 px, le bouton `#theme-toggle` porte la page à 418 px de large) et 19 constats V4 (flèches du schéma qui traversent une boîte qui n'est ni leur départ ni leur arrivée, et 18 éléments exemptés en bloc par `data-overlap-ok` sans valeur), dans les 2 thèmes. Témoin : la même vue régénérée depuis l'`ARCHITECTURE.md` d'avant la modification rend les mêmes 21 constats ; ils viennent du générateur, pas du contenu. La vue précédente, générée le 11/09, en portait 34 et échouait aussi à `oracle-slop` et `oracle-tokens`. Le produit ne peut pas corriger une vue déclarée jamais éditée. (ledger seq 733) | `generer-architecture.mjs` pose le bouton de bascule dans le flux du bandeau à 390 px, route les flèches du schéma autour des boîtes, et passe `run-oracles-design --rendu` sur sa fixture. Classe à créer : `vue-generee-refusee-par-la-critique-de-rendu`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-230 | `grep -c "RA-230" todo/TODO.jsonl` | 0 | aucun : le lot d'origine n'avait pas été ingéré |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le ledger porte le retour en entier, ce qui a permis de reconstruire ce lot sans perte de fait.

## Ordre recommandé

1. RA-230.

## La règle qui aurait évité le retour

Aucune règle ne juge le rendu d'une vue générée par le pilot avant qu'elle n'arrive chez un produit ; la colonne « Proposition esquissée » propose la classe `vue-generee-refusee-par-la-critique-de-rendu`.
