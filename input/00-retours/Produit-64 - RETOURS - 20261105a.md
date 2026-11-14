# Lot de retours — Produit-64 → digit-ai-factory (restitution affichée avec 16 règles en échec) — 2026-11-05, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, préjugement de la restitution (`oracles/hook-restitution.mjs --prejuger`) et gabarit `gabarits/RESTITUTION.md`.

**Origine** : session de conversation du 05/11/2026, vers 09:50 (heure de Paris). Erreur relevée par le porteur, qui a répondu à la restitution : « Le prompt de restitution n'est pas conforme aux attentes ».

Ce lot porte **1 retour** (RT-74).

- **Contexte** : une session de conversation de ce produit, hors run (revue L99 d'un prompt).
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-11-05** dans le sas d'arrivée du pilot. Les empreintes SHA-256 ont été comparées des deux côtés après la copie. L'original reste ici, dans l'historique du produit.

---

## digit-ai-factory (préjugement de la restitution)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-74 | majeur | générique | **Une restitution a été affichée avec 16 règles en échec, parce que le préjugement les rendait en simples codes sous « affichable: true ».** Le 05/11/2026, `node oracles/hook-restitution.mjs --prejuger forge/travaux/RESTITUTION-20261105a-…md` a rendu `"affichable":true,"bloquants":[]` et `"avertissements":["S11","S12","S13","S14","S37","S18","S23","S16","S42","S43","S48","S30","S31","S32","S54","S79","S84"]`, sans aucun message. La session a lu « affichable » comme « conforme » et a affiché le texte tel quel. Le porteur l'a refusé. Joué ensuite, `oracle-synthese.mjs` sur le même fichier rend `"verdict":"FAIL"` : décisions sans numéro (S30), sans coût ni exclusion (S31), sans option par défaut (S32), action humaine sans commande (S13), nom de livrable au-delà du plafond R-4 (S42), ligne de remontée absente (S48), etc. | 1) `--prejuger` rend, pour chaque avertissement, son message, comme le fait déjà `systemMessage` en fin de tour (lignes 2307-2308 de `hook-restitution.mjs`). 2) Le champ `affichable` ne vaut `true` que sans avertissement, ou se renomme `refus_au_hook: false`, pour ne plus se lire comme un verdict de conformité. 3) Le gabarit (§ « Préjuger, puis afficher ») dit qu'un avertissement se corrige avant l'affichage, sauf motif écrit. 4) Fixture : le brouillon du 05/11 en rouge (16 FAIL), le brouillon corrigé en vert. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-74** : classe `constat-non-bloquant-jamais-lu` (famille `hook-ou-gate`) : un contrôle constate des échecs, sort sans bloquer, et personne ne les lit. Ici, la sortie existe, mais elle est réduite à des codes et placée sous un champ qui se lit comme un feu vert.

## Rattachement

Registre interrogé le 05/11/2026 : `grep -iE "prejuger|préjug" todo/TODO.jsonl | grep -iE "avertis|affichable"` → 8 lignes rendues, toutes hors sujet (TF-1847, TF-1849, TF-1936 à TF-1938, TF-1944). Items voisins : TF-1647 et TF-1666 (classe `restitution-jugee-apres-affichage`, qui a créé le préjugement), et TF-1944 (relecteur neuf de la restitution, candidat).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Restitution de la revue L99 du 05/11/2026 | les 16 règles en échec sont corrigées ; les deux livrables sont renommés sous le plafond R-4 ; `oracle-synthese` est rejoué jusqu'à 0 échec avant le nouvel affichage | oui | proposé à la factory en RT-74 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de documents de la bibliothèque sur ce lot.

## Documents mûrs

Déclaration reprise du lot `20261026b`, sans changement : aucune nouvelle série n'atteint 5 versions datées dans ce tour.

| Document | Versions | Verdict |
|---|---|---|
| Guide développeur POC-to-Prod | 30 | remonté : sa forme est la famille `gd-guide-de-reference` du pilot depuis le 28/09/2026 (règle R-57) |
| Modèle Rapport d'audit POC-to-Prod | 22 | reste au produit, parce qu'il est régénéré par `propager-pack.mjs` à chaque version du pack Client-A ; ses versions suivent le pack, pas une forme manquante |
| Catalogue ADR Client-A par domaine | 5 | reste au produit, parce qu'il est régénéré à chaque bump du dépôt de gouvernance Client-A (outils `actualiser-catalogue-depot.mjs`) |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA | 6 | reste au produit, parce qu'il est déjà rendu par le générateur de la famille `gd-guide-de-reference` ; ses versions suivent le parc des produits Client-A |
| Propositions ADR par domaine | 16 | reste au produit, parce qu'il porte des propositions d'ADR propres à Client-A ; la série est close depuis le 30/06/2026 |
| Schéma Process POC-to-Prod End-to-end | 14 | reste au produit, parce que c'est un schéma de la méthode Client-A ; la série est close depuis le 08/07/2026 |
| Référentiel POC-to-Prod - Audit | 10 | reste au produit, parce que son contenu est le référentiel Client-A, et que sa forme générique vit au produit d'audit `digit-ai-forge-audit` |
| Compliance Pack - Format & Contenus des contraintes | 10 | reste au produit, parce qu'il décrit le pack Client-A ; série close depuis le 10/07/2026 |
| Process Ingénierie POC-to-Prod - Consolidation et cible | 7 | reste au produit, parce qu'il est propre à la méthode Client-A ; série close depuis le 01/09/2026 |
| Matrice Contraintes ADR Light-Complet | 6 | reste au produit, parce qu'elle est propre au périmètre Client-A ; série close depuis le 08/07/2026 |
