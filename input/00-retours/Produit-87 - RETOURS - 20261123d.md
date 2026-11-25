# Retours forges — Produit-87 — 20261123d

- **Contexte** : autre — deuxième retour du porteur sur la diapositive « Pourquoi » du support de Design Authority de Prism (indice d du 23/11/2026), hors run.
- **Références ledger** : sans objet, aucun run ouvert.
- **Références hors run** : `forge/hors-run.jsonl` seq 7 (entrée `type: retour`, TF-2260).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>\input\00-retours\_arrivee\` par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : remis le 2026-11-23

Ce lot porte **1 retour**. Il suit une correction du porteur : la cause qu'une session avait déduite du dépôt a été présentée comme la raison principale d'une décision du porteur.

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-7 | majeur | générique | **Une cause déduite du dépôt a été affichée comme la raison principale d'une décision du porteur.** La diapositive 4 de l'indice d (`Client-A - PRM - Presentation Design Authority - 20261123d.pptx`) devait dire pourquoi la production doit être en place avant fin 2026, et le porteur n'avait pas donné cette raison. La session l'a déduite du dépôt : la production historique sort du support Microsoft (Functions 1.x depuis le 14/09/2026, .NET Framework 4.6.2 le 12/01/2027). Les faits étaient exacts, mais la session en a fait le titre et la conclusion de la diapositive. Le porteur, mot pour mot : « Ce n'est pas ça la raison principale, c'est la réinternalisation de l'appli. Corrige. » La restitution précédente disait pourtant qu'aucune pièce ne donnait la raison. La question n'a été posée qu'après livraison, en action, au lieu d'être posée avant d'écrire. | Règle candidate : quand un livrable doit énoncer la raison d'un choix du porteur et qu'aucune pièce ne la donne, la session la demande avant de construire, ou bien elle présente sa déduction comme un facteur prouvé, jamais comme LA raison. Piste de juge : le hook de restitution signale une restitution qui livre et qui dit en même temps « aucune pièce ne donne » la raison d'un choix du porteur. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-7** : une raison qui engage le porteur et n'est écrite nulle part se demande, elle ne se déduit pas. Une déduction du dépôt reste un facteur, présenté comme tel.

## Rattachement

Registre interrogé le 23/11/2026 dans `todo/CLASSES.json` du pilot, par les mots « pourquoi », « cause », « motif », « raison », « intention » et « déduit ». Aucune classe ne décrit une raison du porteur remplacée par une déduction de la session. La plus proche, `intention-sans-usager`, vise une intention écrite sans son usager. Classe proposée : `raison-du-porteur-deduite-au-lieu-d-etre-demandee`. Ce retour suit RT-6 (lot 20261123c) sur la même diapositive : RT-6 corrigeait l'absence de cause, RT-7 corrige la cause remplacée.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Diapositive 4 de l'indice d centrée sur la fin du support Microsoft | Indice e : la réinternalisation devient la raison principale, avec un tableau avant / après sur quatre domaines (code, livraison, hébergement, identité) ; la fin de support devient le facteur aggravant, sur une ligne « S'y ajoute » ; bandeaux de l'ordre du jour, de l'intercalaire, de « Prism en une page » et de la feuille de route alignés | oui | remonté en RT-7 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit : le support `Client-A - PRM - Presentation Design Authority - 20261123d.pptx` sort d'un générateur dérivé de `construire-da-regles-communes-ia.mjs` (projet commun Produit-64), sans identifiant `gd-…`. Son défaut est porté par RT-7.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La règle des indices a gardé les indices c et d intacts : les trois versions de la diapositive « Pourquoi » se comparent côte à côte.

## Ordre recommandé

1. **RT-7** : demander la raison avant d'écrire coûte une question ; la déduire coûte une diapositive refaite et la confiance du porteur.
