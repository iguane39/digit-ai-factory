# Retours forges — Produit-12 — 20261122d

- **Contexte** : autre — décision de dépense d'IA D-84 et mesure réelle du coût de rédaction et de classement, 22/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 430, 434 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

Une décision de dépense a été posée avec un coût mensuel estimé par un ratio de caractères, et le porteur l'a jugée insuffisante. La mesure réelle qui a suivi a trouvé un défaut que l'estimation ne pouvait pas voir : le modèle récent réfléchit par défaut, et l'appel du produit n'aboutit pas.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-44 | majeur | produit+générique | Retour humain sur D-84, mot pour mot : « Tu devrais rappeler le modèle utilisé, le coût et fournir une estimation par rapport à des abaques, 2$/mois, ce n'est pas suffisant comme estimation ». La décision donnait un coût par brouillon et un total mensuel. Elle ne nommait pas le modèle, ne citait ni prix unitaire sourcé ni volumes mesurés, et ne proposait pas de scénarios. Le prix repris du barème de production (3 et 15 USD par million de tokens) était faux : le tarif public de `claude-sonnet-5` est de 2 et 10. Le ratio de 4 caractères par token était faux aussi : `count_tokens` mesure 2,17. Preuve : ledger seq 418, 430 ; plan 20261122b, section 6 bis | Une décision de dépense d'IA nomme le modèle et son prix unitaire, avec la source et sa date. Elle compte les tokens par l'API (`count_tokens`, ou l'`usage` d'un essai réel borné), part de volumes mesurés et rend une table de scénarios par modèle et par volume. Aucune règle du socle ne le demande aujourd'hui (§ 4 de quality-oracles) |

## development (`digit-ai-forge-development`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-45 | majeur | produit+générique | Un appel d'IA écrit sans régler l'effort ni la réflexion, avec une limite de 1 500 tokens, tourne sur un modèle récent qui réfléchit par défaut. Sur 20 rédactions réelles, 15 s'arrêtent à la limite et 12 rendent un texte vide, sans erreur levée, et `stop_reason` n'est jamais lu (`ia_claude.py`, lignes 96 à 109). En effort `low`, 20 rédactions sur 20 aboutissent. Le tarif et la liste des modèles sont écrits en dur sans date de source (`config_ia.py`, ligne 47). Preuve : ledger seq 431, 432, 434 | Le gabarit d'un connecteur d'IA règle l'effort par traitement. Il lit `stop_reason` et trace un arrêt à `max_tokens` ou un refus comme un échec. Un tarif ou une liste de modèles écrits en dur portent leur date de source et une alerte de péremption |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Barème faux et catalogue sans les modèles actuels (seq 432) | action P-23 du plan 20261122b | oui, par RS-45 | la correction reste au produit, la classe remonte |
| Tokens estimés à 4 caractères au lieu de 2,17 (seq 433) | lecture de l'`usage`, action P-3 | non | propre au journal du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres BERNARD | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres SAS CREER PROMOTION | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees BERNARD | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees SAS CREER PROMOTION | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

L'essai réel borné, autorisé par la décision de dépense, a coûté 0,68 USD. Il a mesuré en une fois le coût, le comportement de réflexion du modèle et un premier niveau de qualité : une estimation par caractères n'aurait vu aucun des trois.

## Ordre recommandé

1. RS-45, parce qu'il touche tout produit qui appelle un modèle récent avec un réglage ancien.
2. RS-44, parce qu'il évite un aller-retour humain à chaque décision de dépense.

## La règle qui aurait évité le retour

- RS-44 suit un retour humain, et aucune règle du socle, d'un gabarit ou d'un oracle ne couvre l'estimation de coût d'une décision. La règle § 4 de quality-oracles s'applique : définir un oracle d'estimation de dépense. Classe proposée, à créer au pilot : `estimation-de-cout-sans-abaque` (famille `restitution-forme`), pour une décision de dépense chiffrée sans modèle, sans prix sourcé et daté, sans volume mesuré ni scénario.
- RS-45 : classe proposée, à créer au pilot : `appel-ia-sans-reglage-du-modele-cible` (famille `contrat-interface-forge`), pour un appel d'IA dont l'effort, la réflexion et la limite de sortie ne sont pas réglés pour le modèle servi, et dont l'arrêt n'est pas lu.
