# Retours forges — Produit-65 — 20261002e

- **Contexte** : le 02/10/2026, le commanditaire a tranché « 63 » : remonter à la factory que la contre-lecture d'un plan de production ne comparait pas les paramètres de lancement à la fiche de mise en production. Le retour d'expérience du même jour (`docs/ops/Produit-03 - Rapport - Retour d experience de la mise en production - 20261002c.md`, fiche P16) confirme le manque sur 3 votes de production.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 02/10/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une contre-lecture de plan qui ne lit pas les paramètres de lancement

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-77 | majeur | générique | **La contre-lecture lisait le plan, jamais les paramètres avec lesquels il avait été lancé.** Le 28/09, la décision `D-54 (a)` fixe le seuil de créations de la chaîne d'infrastructure à 11, pour que la chaîne refuse d'elle-même un plan fautif. Le 29/09 à 10h02, la relance de production 15452 tourne avec `seuilCreations` à 12. Ce fut sans effet ce jour-là, le plan comptant 11 créations. Mais la contre-lecture de la session avait lu le plan seul, et rien dans la méthode ne lui demandait de comparer les paramètres saisis par l'exploitant à la fiche. Preuve : paramètres relus dans l'API Azure DevOps, 12 pour 15362 (28/09) et 15452 (29/09), 1 pour 15502, 0 pour 15670. C'est la même classe que `RA-49` du lot `20261001b`, qui demandait une ligne « Ne vérifie pas » sur tout critère d'approbation : la contre-lecture ne disait pas qu'elle ne lisait pas les paramètres | Que toute contre-lecture qui autorise un geste irréversible lise, en plus de l'artefact jugé, les paramètres de l'exécution qui l'a produit, et les compare à la valeur écrite dans la fiche ou la décision ; et qu'elle publie la liste de ce qu'elle ne compare pas |

## La règle qui aurait évité le retour

La règle existe en partie : `RA-49` exige qu'une vérification publie ce qu'elle ne vérifie pas. Elle ne dit pas que les paramètres de lancement font partie de ce qu'on vérifie. La règle manquante : une contre-lecture lit l'artefact ET les paramètres qui l'ont produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le seuil saisi au lancement n'était pas celui de la fiche | la fiche de mise en production nomme le seuil attendu ; le retour d'expérience du 02/10 propose un contrôle qui bloque le vote tant que la contre-lecture n'est pas publiée | oui | remonté ci-dessus en `RA-77` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Confirmations positives

- La relecture des paramètres par l'API a rendu le manque mesurable sur 4 exécutions, en une commande.

## Ordre recommandé

1. `RA-77` : un seul retour.
