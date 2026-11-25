# Retours forges — Produit-82 — 20261125a

- **Contexte** : le porteur relève que la page Conversation n'a pas d'historique des conversations, et demande l'éditeur du modèle en préfixe ; run `Produit-82-20261110-version`, étape `version-20261125-historique-conversations`.
- **Références ledger** : `forge\ledger.jsonl` seq 315, 318
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-25

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Forge conception, dérivation des exigences

Le retour porte sur la dérivation des exigences depuis une intention qui nomme un outil à remplacer.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-48 | majeur | générique | La décision D-29 (a), amendée par le porteur le 13/11/2026 (ledger seq 282), visait des personnes qui se passent d'un abonnement aux outils de conversation du marché. La dérivation a produit EF-56 à EF-69 sans la liste des conversations passées, fonction de base de ces outils. ENF-36 effaçait même le fil à la fermeture de l'onglet. Le porteur l'a relevé le 25/11/2026, 12 jours plus tard (ledger seq 315 et 318). **RT-48** : clé proposée `fonction-de-reference-non-derivee`. | Dans `redige-les-exigences`, quand l'entrant nomme un outil de référence ou un usage à remplacer, inventorier les fonctions de base de cet outil. Chacune est rendue retenue, ou écartée avec son motif, avant de clore la surface. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La page Conversation n'avait pas d'historique des conversations, alors que le porteur l'attendait (ledger seq 315) | EF-70 ajoutée ; panneau « Vos conversations » à gauche, conversations gardées dans le stockage local du navigateur, par identité et organisation, jamais en base ; ENF-36 et EF-59 amendées | oui, porté par RT-48 | corrigée, tests en cours |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La décision D-29 (a) disait « jamais en base » : elle a tranché sans question où garder l'historique.

## Ordre recommandé

1. RT-48 : chaque produit qui remplace un outil connu risque la même absence.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot suit une correction humaine. La règle qui l'aurait évité : une intention qui nomme l'outil à remplacer fait dériver les fonctions de base de cet outil, chacune retenue ou écartée avec motif.
