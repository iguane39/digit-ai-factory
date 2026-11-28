# Retours forges — Produit-12 — 20261122a

> Annoté par le pilot le 28/11/2026 (D-247 (a)) : les noms de 2 correspondants des clients du produit, en titre de documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : inspection production v0.9.0 — statut des brouillons déposés dans la boîte de la gestionnaire, 14 jours après son activation (08/11 au 22/11/2026)
- **Références ledger** : `forge\ledger.jsonl` seq 401, 402, 403, 404, 405, 406, 407 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## development (`digit-ai-forge-development`)

Une fonction d'IA en production n'a rien produit pendant 14 jours sans qu'aucun contrôle ne le voie : le repli silencieux a pris sa place, et le test de connexion validait un autre modèle que celui servi.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-37 | majeur | produit+générique | Les 188 brouillons rédigés en production du 09/11 au 22/11 sont le modèle d'entrée tel quel : similarité modèle/brouillon de 0,94 à 1,00, seules les variables diffèrent, aucun passage entre crochets traité alors que la consigne le demande. Le connecteur Claude rend une chaîne vide sur toute erreur HTTP ou réseau, sans trace, et le modèle part ; la statistique IA compte pourtant 188 appels « claude ». Le test de connexion joue le dernier modèle du catalogue (claude-haiku-4-5), la rédaction un autre (claude-sonnet-5) : il réussit toutes les 6 heures sans rien prouver sur la rédaction. Preuve : ledger seq 401, `backend/app/fournisseurs/ia_claude.py` (`_texte`, `tester`), comparaison des 188 brouillons à leurs modèles par l'API de production | Règle de gabarit de développement : un repli d'IA se trace avec son motif et se compte comme repli, jamais sous le fournisseur prévu ; le test de connexion joue le modèle réglé de chaque traitement ; la recette d'une fonction d'IA échoue si la sortie est identique à l'entrée alors que le fournisseur est actif. Aucune règle du socle ne le couvre aujourd'hui (§ 4 de quality-oracles) |

## observability (`digit-ai-forge-observability`)

L'indicateur qui devait dire ce que la gestionnaire fait des brouillons est resté vide sans alerte.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-38 | majeur | produit+générique | Le job quotidien qui relit les envois et classe chaque brouillon (tel quel, retouché, non envoyé) n'a enregistré aucune issue en 14 jours, pour 182 brouillons déposés dont au moins 88 au-delà du délai de 7 jours. Son échec éventuel ne s'écrit que dans le journal applicatif en base ; l'interface n'en montre que les 10 dernières lignes, toutes prises par la relève toutes les 5 minutes, et aucune route ne relance le job. La page affiche « Aucune issue connue pour l'instant », qui se lit comme une attente normale. Preuve : ledger seq 402, page /statistiques-emails de production lue le 22/11 à 10:10, `backend/app/services/issues_brouillons.py`, `backend/app/planificateur.py` | Tout job planifié expose son dernier passage (heure, bilan, erreur) en supervision, et un indicateur vide alors que sa population ne l'est pas déclenche une alerte au lieu d'un état vide neutre |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 41 brouillons adressés à des collègues : la règle « échange interne » compare le domaine de l'expéditeur au seul domaine de la boîte, alors que l'agence en a deux (ledger seq 403) | à corriger en 0.9.1 : liste des domaines internes en paramètre | non | règle métier propre au cabinet |
| 33 brouillons adressés à des expéditeurs automatiques, noreply compris (ledger seq 404) | à corriger en 0.9.1 : filtre noreply et liste d'automates | non | propre au classement du courrier du produit |
| 65 brouillons avec une variable brute « {{…}} », 173 avec plusieurs alternatives du modèle (ledger seq 405) | à corriger en 0.9.1 | non | propre aux modèles du cabinet |
| statistique « mails reçus » à 0 : date stockée au format des en-têtes de mail et filtrée en ISO (ledger seq 406) | à corriger en 0.9.1 | non | défaut de code du produit |
| 95 brouillons sur 33 fils : le regroupement par fil ne vaut qu'au sein d'une relève (ledger seq 407) | à corriger en 0.9.1 | non | logique propre au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot : le statut du 22/11 est une note de produit.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres Correspondant-A | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres Correspondant-B | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees Correspondant-A | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees Correspondant-B | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

La relève toutes les 5 minutes a tourné sans interruption du 08/11 au 22/11, les 182 dépôts sont arrivés dans le dossier réglé de la boîte, et les tests récurrents des connexions mail, Dropbox et IA ont passé toutes les 6 heures (dernier le 22/11 à 04:53).

## Ordre recommandé

1. RS-37, parce que la fonction de rédaction est le cœur de la valeur du produit et que la règle tient en trois contrôles de recette.
2. RS-38, parce que sans indicateur lisible la mesure du temps rendu au cabinet reste impossible.
