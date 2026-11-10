# Retours forges — Produit-86 — 20261110a

- **Contexte** : clôture du run `20261110a-lot-1-surface-api`. Le lot 1 de l'inventaire de la surface de Produit-84 est livré en préproduction : 3 tests d'API en lecture seule, un double de l'API au lab, la clé publique au mandat. Une faille du PEP a été corrigée en cours de run.
- **Références ledger** : `forge\ledger.jsonl` seq 793, 805, 832 et 841 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 10/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 10/11/2026 est `todo/CLASSES.json` du pilot. Chaque retour se rattache à une classe existante :

- RP-57 : `deux-regles-du-socle-inconciliables` ;
- RP-58 : `auteur-juge-son-contrat` ;
- RP-59 : `controle-vrai-sur-le-mauvais-invariant` ;
- RP-60 : `registre-doublon-non-detecte`.

## digit-ai-factory

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-57 | majeur | générique | Une demande entre produits n'a pas pu être traitée d'office. Le seul jeton de gestion Supabase de Produit-84 est dans son `.env`, et le contrat d'agent de campagne (`gabarits/AGENT-CAMPAGNE.md`) interdit toute lecture du `.env`. Le jeton global du poste vise une autre organisation : 1 appel, 403, le 10/11/2026 à 07:41 UTC (ledger seq 793). Il a fallu une décision du porteur (D-487 b) pour un script filtrant. | Un geste du socle qui lit une variable du `.env` dans le seul environnement d'un sous-processus, sans l'imprimer, ouvert aux agents de campagne pour des appels en lecture seule, et tracé par nom et empreinte. |

## digit-ai-forge-agents-security

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-58 | bloquant | générique | Le PEP de Produit-86 croyait l'impact déclaré par l'agent. Une action déclarée « faible » sur un type « moyen » du catalogue obtenait un ticket sans approbateur. Le constructeur du lot 1 l'a relevé ; c'est corrigé en E-136 (`c35bd14`), avec un test de bout en bout qui rougit sans la règle (ledger seq 805). | Un contrôle MC du dossier Gate A : le niveau de risque d'une action est tiré du catalogue côté serveur, et la déclaration de l'agent ne peut que le relever. |

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-59 | majeur | générique | Le premier audit du 10/11/2026 a rendu l'api à 0 % sur 173 éléments. La sonde observait l'instance `app.main:app`, alors que chaque test bâtit son application par `creer_app()`. Aucun refus nommé, car `application.py` ne refuse pas quand une instance module existe à côté de la fabrique. Avec `FORGE_TESTS_APP=app.main:creer_app`, 173 sur 173 (ledger seq 832). | Refuser par son nom un relevé vide quand une fabrique existe, même si une instance module est présente. |

## digit-ai-forge-agents

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-60 | mineur | générique | La session a rejoué un script de clôture pour lire un avertissement. Le ledger a reçu 6 doublons (seq 835 à 840 pour 830 à 834), et aucun type de rectification ne désigne un doublon (ledger seq 841). | Un type `rectification_doublon` qui cite les seq annulées, ou un refus par `ledger.mjs` d'une entrée identique à une autre du même run, hors seq et ts. |

## La règle qui aurait évité le retour

- `auteur-juge-son-contrat` (RP-58) : celui qui demande une action n'en fixe pas le niveau de contrôle.
- `controle-vrai-sur-le-mauvais-invariant` (RP-59) : une mesure vide sur une suite verte dit d'abord qu'elle n'a rien observé.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `ranger-cle-api --ajouter-au-perimetre` exige une résolution DNS que le conteneur servi n'a pas | contournée par la même fonction avec la résolution du poste ; correction au prochain run | non : propre à la commande du produit | reste au produit, parce que c'est son code |
| Fiche de mission à 5 066 px et file d'approbation à 110 px par ligne (oracle-exploitabilite X1, X2) | à corriger au prochain run | non : propre aux écrans du produit | reste au produit, parce que c'est son portail |
| 3 modèles désignés par alias dans `config/model-gateway.json` (pan prompts) | à épingler au prochain run | non : propre à la configuration du produit | reste au produit, parce que c'est sa configuration |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261109a) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le balayage des secrets du produit a pris les fichiers d'une copie de travail restée dans le dépôt, avant tout commit.
- L'oracle d'exploitabilité a révélé 2 défauts d'écran dès que la file d'approbation a eu un volume réel.
