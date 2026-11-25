# Retours forges — Produit-87 — 20261123c

- **Contexte** : autre — retour du porteur sur le support de Design Authority de Prism (indice c du 23/11/2026), hors run.
- **Références ledger** : sans objet, aucun run ouvert.
- **Références hors run** : `forge/hors-run.jsonl` seq 6 (entrée `type: retour`, TF-2260).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>\input\00-retours\_arrivee\` par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : remis le 2026-11-23

Ce lot porte **1 retour**. Il fait suite à une correction du porteur : une diapositive « Pourquoi » donnait l'échéance sans sa cause.

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-6 | mineur | générique | **Une diapositive « Pourquoi » a affiché une échéance sans sa cause.** Le support `Client-A - PRM - Presentation Design Authority - 20261123c.pptx` (diapositive 4) donnait plusieurs éléments sur l'échéance de fin décembre 2026 : jours restants, jours ouvrés et quatre impératifs pour la séance. Il ne disait jamais pourquoi la production devait être en place à cette date. Le porteur, mot pour mot : « Super slide, sauf qu'elle n'explique pas pourquoi on doit être en prod à fin 2026. Recommence. » L'oracle des supports DA avait rendu PASS : il juge la présence des faits attendus (« fin décembre 2026 » était présent), pas qu'une échéance porte sa cause. La cause existait dans le dépôt : production historique hors du support Microsoft (Functions 1.x depuis le 14/09/2026, .NET Framework 4.6.2 le 12/01/2027). Correction : indice d, avec une frise des fins de support. | Règle candidate : une diapositive, une section ou un document qui pose une échéance la relie à sa cause, ou dit que la cause est inconnue. Piste de juge : l'oracle des supports DA, ou l'oracle d'écriture, signale un titre « Pourquoi » ou « échéance » dont le texte ne porte aucun lien de cause (« parce que », « car », « sort du support », « fin de… »). |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-6** : une échéance affichée se relie à sa cause. À la diapositive 4 de l'indice c, la date et ses conséquences étaient prouvées, mais sa cause était absente, et aucun contrôle ne la cherchait.

## Rattachement

Registre interrogé le 23/11/2026 dans `todo/CLASSES.json` du pilot, par les mots « pourquoi », « cause », « justif », « explique », « motif » et « contexte ». Aucune des 331 classes ne décrit une échéance ou une contrainte affichée sans sa cause. La plus proche, `decision-ecrite-dans-le-vocabulaire-de-l-auteur`, vise une décision nommée sans dire pourquoi elle existe, pas une échéance. Classe proposée : `echeance-affichee-sans-sa-cause`.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Diapositive 4 de l'indice c sans la cause de l'échéance | Indice d : frise des fins de support (26/04/2022, 14/09/2026, 12/01/2027), faits relus dans `docs/REPRISE.md` et la documentation de la reprise ; oracle des supports DA PASS, rendu PowerPoint relu en image | oui | remonté en RT-6 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit : le support `Client-A - PRM - Presentation Design Authority - 20261123c.pptx` sort d'un générateur dérivé de `construire-da-regles-communes-ia.mjs` (projet commun Produit-64), sans identifiant `gd-…`. Son défaut est porté par RT-6.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La règle des indices (aucun livrable réécrit en place) a gardé l'indice c intact à côté de l'indice d, ce qui permet de comparer les deux versions de la diapositive.

## Ordre recommandé

1. **RT-6** : une règle d'écriture et un juge par mots de cause, sur un défaut que l'oracle de présence des faits ne peut pas voir.
