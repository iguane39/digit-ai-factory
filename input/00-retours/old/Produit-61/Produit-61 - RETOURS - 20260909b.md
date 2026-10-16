# Retours forges — Produit-61 — 20260909b

- **Contexte** : retour humain du 09/09/2026 après lecture de l'audit — la maison qui a construit le produit lui remonte aujourd'hui des remédiations qu'elle aurait dû voir pendant la construction
- **Références ledger** : `forge\ledger.jsonl` seq 125 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier, son sidecar, l'étude jointe et le rapport d'audit dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-09

Ce lot ne remonte pas une friction d'outil : il remonte un écart entre ce que la maison déclare fini et ce que la même maison juge conforme. Il se lit avec l'étude jointe, qui porte le croisement chiffré, et avec le rapport d'audit, qui porte les 175 verdicts et leurs preuves.

L'identifiant RP-9 est le neuvième retour adressé au pilot par ce produit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le produit a franchi toutes les portes de la construction, puis échoué 125 contrôles du référentiel d'audit de la même maison.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-9 | bloquant | générique | Le produit a été construit en cinq étapes, toutes closes avec oracles au vert et contrat de fin de construction tenu. Le référentiel d'audit de la même maison, appliqué quatre jours plus tard, rend 76 non conformes, 49 partiels et 12 contrôles fatals non tenus sur 175. Trois causes mesurées : le contrat de fin de construction ne contient aucun des 175 contrôles et le run n'a pas d'étape d'audit ; cinq dimensions du référentiel n'ont aucun propriétaire dans le run et portent 40 des 125 écarts, alors que deux forges dédiées existent et n'ont jamais été mobilisées (5 forges sur 14 déclarées à l'ouverture n'ont jamais servi) ; enfin la doctrine de construction contredit le référentiel sur trois contrôles fatals, dont le déploiement, que la doctrine veut manuel à porte et que le contrôle veut exclusivement par pipeline. Preuve complète et chiffrée dans l'étude jointe. | quatre pistes détaillées dans l'étude : faire entrer le référentiel dans le contrat de fin de construction ou ajouter une étape d'audit ; faire du journal d'ouverture une déclaration de couverture dimension par dimension, « aucune » étant une réponse valide ; trancher les trois contradictions doctrine contre référentiel ; faire de l'audit un entrant du brief plutôt qu'un verdict de sortie |

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec le verdict de généralisation de chacune.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le tableau de routage du produit n'envoyait jamais vers la forge d'audit | ligne de routage ajoutée, avec la chaîne complète de la forge d'audit et la distinction d'avec la mesure de couverture | oui | déjà remonté au lot précédent du jour, RP-8 |
| Les 125 écarts de l'audit n'avaient pas de plan opposable | plan de 125 actions produit par la forge, chacune avec son critère de clôture | non | le plan appartient au produit, la méthode appartient à la forge |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot : l'étude jointe suit la doctrine documentaire du socle, sans gabarit de la bibliothèque. Vérifié par le pilot du run, le 09/09/2026.

## Confirmations positives

- Les dimensions où une forge dédiée est intervenue pendant la construction sont exactement celles où l'audit trouve le moins : documentation, schéma de base de données, interface et accessibilité, modèles et prompts. La qualité des forges n'est pas en cause, seule leur mobilisation l'est.
- Le référentiel d'audit s'est révélé applicable tel quel à un produit qu'il n'avait jamais vu, sans adaptation du corpus ni dérogation.
- Le contrôle des critères de clôture a refusé un plan incomplet : cent vingt-cinq actions seraient parties sans critère opposable.

## Ordre recommandé

1. RP-9, avant tout autre retour du produit : il conditionne la valeur de tous les runs suivants, chez ce produit comme chez les autres.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit un retour humain direct. Aucune règle du socle ne relie le contrat de fin de construction au référentiel d'audit de la maison : les deux corpus vivent côte à côte sans qu'aucun contrôle ne les confronte, et c'est précisément ce trou que le commanditaire a nommé. La classe la plus proche du référentiel est `auteur-juge-son-contrat` — la maison juge son produit avec un contrat qui ignore son propre référentiel d'audit ; le pilot est invité à créer, s'il la juge distincte, « fin de construction déclarée sans le référentiel qui la jugera ».
