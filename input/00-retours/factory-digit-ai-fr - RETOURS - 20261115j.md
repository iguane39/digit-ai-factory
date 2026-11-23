# Retours forges — factory-digit-ai-fr — 20261115j

> **Annoté à la réception le 23/11/2026** : ce lot a été refusé à la porte le 23/11/2026 (les deux lignes du sidecar portaient une famille du référentiel au lieu d'une clé de classe). Clés choisies à la lecture des retours : RP-52 devient `livrable-derive-non-regenere` (famille `versionnement-livrable`) ; RP-53 devient `oracle-faux-positif` (famille `regle-morte`). Reportées au sidecar et à la section « La règle qui aurait évité le retour ». Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : run `forge-digit-ai-fr-20261114a`, page complète de la forge des tests construite par un agent `constructeur` avec le texte refait.
- **Références ledger** : forge/ledger.jsonl seq 258, 259.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La page complète de la forge des tests est construite et vérifiée. Deux frictions sont apparues. La première : la copie du catalogue embarquée dans le produit est périmée face au catalogue du pilot, et la page servie afficherait de faux comptes. La seconde : deux règles du socle des pages HTML gênent une page de site.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-52 : la copie embarquée du catalogue ne suit pas le catalogue du pilot.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-52 | **majeur** | générique | **La copie du catalogue embarquée dans le produit est restée à la version 1.8.0 du 19/08/2026.** `vendor/digit-ai-factory/catalogues/catalogue.jsonl` y compte 8 services pour la forge des tests, dont 6 prouvés. Le catalogue du pilot (commit 220b184, 06/11/2026) en compte 10, dont 8 prouvés. Le contenu « outils » du site se dérive de la copie embarquée : la page servie afficherait des comptes faux, alors que le texte validé suit le pilot. Preuve : rapport du constructeur du 15/11/2026 ; relevé des lignes de la forge dans les deux fichiers. | Rafraîchir la copie embarquée à chaque version du catalogue du pilot, à l'ouverture d'un run. Faire échouer le contrôle d'héritage quand elle diverge. |

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Ce chapitre porte un retour, RP-53 : deux règles du socle gênent une page de site.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-53 | **mineur** | générique | **La règle L3 de `check_html.py` réserve le mot courant « pastille » comme nom de classe.** Un marqueur décoratif qui double un mot visible, déjà légendé, échoue et doit être renommé. Par ailleurs, `render_page.py` exige deux déclarations différentes pour une même mesure étroite voulue : `data-colonne-ok` pour la largeur, et `data-mesure-lecture` pour les éléments voisins. Preuve : la page `signature-b2.html` du 15/11/2026, où le marqueur est devenu `station-statut` et la présentation porte les deux déclarations. | Restreindre L3 aux classes sans texte visible équivalent. Accepter une seule déclaration de mesure voulue, pour la largeur comme pour les voisins. |

## La règle qui aurait évité le retour

- RP-52 : le contrôle d'héritage ne compare pas la copie embarquée du catalogue à sa source. Classe : `livrable-derive-non-regenere` (famille `versionnement-livrable`).
- RP-53 : des règles écrites pour les documents s'appliquent à une page de site. Classe : `oracle-faux-positif` (famille `regle-morte`).

## Remarques restées au produit

- La page porte les comptes du texte validé (10 services, 8 prouvés), tirés du catalogue du pilot. Généralisable : non, la cause générale est RP-52.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
