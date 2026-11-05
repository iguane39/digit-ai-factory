# Retours forges — Produit-84 — 20261104e

- **Contexte** : question du porteur du 04/11/2026, mot pour mot : « Logiquement le format générique de la Factory, ce n'est pas celui généré. Comme exemple, pour la Factory, tu as celui-ci : C:\dev\Produit-68. Pourquoi ce n'est pas ce format qui est utilisé par défaut par la Factory ? Sachant que cela avait déjà été demandé et demandé en correction sur le projet Produit-68 ? »
- **Références ledger** : `forge\ledger.jsonl` seq 182.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-04
- **Complétude** : 1 entrée `type: retour` écrite depuis le lot 20261104d (seq 182), relue le 04/11/2026 à 11:04 dans `forge\ledger.jsonl` ; elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le format attendu.** Le porteur désigne comme format générique de la Factory le rapport `C:\dev\Produit-68\Produit-68 - Rapport d'audit - 20260924d.html` : 826 Ko, application HTML à moteur JavaScript (18 dimensions, 184 règles, schéma d'architecture, traçabilité, informations attendues par le RUN).
- **L'historique.** Ce rapport suit le format de référence du commanditaire, par décision humaine du 20/09/2026. Il a été corrigé le 24/09 à la demande du porteur (largeur, schéma). Le lot `Produit-68 - RETOURS - 20260924a` n'a remonté que les angles morts des oracles ; il a déclaré « propres à la mission » les outils de mise au format (`socle-format.mjs`, `schema-routage.js`).
- **Aujourd'hui.** forge-audit rend toujours son propre format : l'audit de ce produit est sorti deux fois dans une forme que le porteur ne reconnaît pas.

## Factory (`digit-ai-factory`) et forge audit (`digit-ai-forge-audit`) — format par défaut du rapport d'audit

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-45 | bloquant | générique | **Le format de rapport d'audit demandé et corrigé sur Produit-68 n'est jamais devenu celui de la Factory.** (1) `git grep` sur `digit-ai-forge-audit` (HEAD, 04/11/2026 11:03) : 0 occurrence de `socle-format`, `schema-routage` ou Produit-68. (2) Le lot Produit-68 du 24/09 classe ces outils « propres à la mission » et ne remonte que RG-7 à RG-10 et RP-53, sur les oracles de page : la demande de portage n'a jamais été écrite. (3) L'entrée `gd-rapport-audit` du catalogue, adossée à TF-0999 et TF-1005 (décision D-2 du 10/09/2026), fait de la sortie de `build-rapport.mjs` la forme de référence. Le porteur dit l'inverse : « le format générique de la Factory, ce n'est pas celui généré ». (4) Le 04/11/2026, l'audit complet de ce produit a été rendu deux fois par `build-rapport.mjs`, chaque fois hors du format attendu. Ledger seq 182. | Faire du format d'Produit-68 20260924d le rendu par défaut de forge-audit : son moteur, `socle-format.mjs` et `schema-routage.js` portés dans la forge, alimentés par `rapport-data.json`, et jugés par une porte comme celle du projet commun Client-A. Corriger l'entrée `gd-rapport-audit`, et relire avec le porteur l'arbitrage D-2, dont la lecture est contredite. Qu'une demande humaine de correction d'un livrable de forge se remonte comme demande de portage dans la forge, et pas seulement comme angles morts d'oracles. Règle qui aurait évité le retour : aucune ; la remontée du 24/09 a suivi la forme du lot, qui ne demande que des classes de défaut. **RT-45** : classe proposée `correction-de-livrable-restee-au-produit`. |

## Rattachement

Registre interrogé le 04/11/2026 au pilot, `todo/TODO.jsonl` :

- Produit-68 : 22 items (TF-1328, TF-1368 à TF-1394) ; aucun ne demande de porter le format du rapport dans forge-audit.
- `format de référence|socle-format|gabarit de référence` : TF-1490 seulement, sur la charte d'un deck.
- TF-0999 et TF-1005 (corrigés) : arbitrage D-2 lu comme « le moteur fait foi ». RT-45 en conteste la lecture, sur la parole du porteur.

Items recoupés : TF-0999, TF-1005, TF-1368 à TF-1372 (RG-7 à RG-10, RP-53).

## Remarques restées au produit

- Refaire le rapport de ce produit au format d'Produit-68, ou au modèle Client-A : geste de ce produit, une fois tranchée la forme qui fait foi. Généralisable : non ; la cause générale est RT-45.

## Retours sur les documents produits

- `gd-rapport-audit` : la forme de référence déclarée au catalogue n'est pas celle que le porteur attend (RT-45).

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les lots de Produit-68 sont archivés au pilot avec leurs remarques restées au produit : c'est ce qui a permis de retrouver en quelques minutes où la demande s'était perdue.

## Ordre recommandé

1. RT-45 : seul retour du lot ; il conditionne la forme de tous les audits à venir.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-45 : aucune ; la remontée du 24/09 a suivi la forme du lot, qui ne demande que des classes de défaut.
