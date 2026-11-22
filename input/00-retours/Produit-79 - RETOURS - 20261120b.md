# Retours forges — Produit-79 — 20261120b

> Réindexé à la réception le 22/11/2026 par le pilot : remis sous l indice 20261120a, déjà porté par un autre lot du même produit reçu le 21/11 ; contenu inchangé, indice suivant libre.

- **Contexte** : diagnostic des cautions Beds24 et Stripe, le 20/11/2026, sur le poste Dell XPS 16 ; la mise à l'arrêt n'a pas pu se faire, faute de clé en écriture sur ce poste
- **Références ledger** : `forge\ledger.jsonl` seq 1244, 1246 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`<PILOT_ROOT>`)

Le juge de la synchro entre postes rend PASS alors que le coffre de secrets du Drive ne porte pas les clés que le produit déclare.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-38 — coffre de reprise incomplet jugé conforme | majeur | générique | 20/11/2026 vers 20:45 : sur le poste Dell XPS 16, le `.env` et `SECRETS\.env` du Drive portent 2 clés (`FORGE_ROOT`, `RAILWAY_PROJET_TOKEN`), relevées par `env-masque.mjs --cles`. `BEDS24_REFRESH_TOKEN` et `STRIPE_RESTRICTED_KEY`, citées par `docs\projet\PARAMETRAGE.md` et par le ledger (seq 393, 843), manquent. `node forge/synchro-poste.mjs verifier` rend pourtant PASS de V1 à V6. Conséquence mesurée : l'arrêt des empreintes de caution, urgent (prochaine le 22/11), n'a pas pu se faire depuis ce poste et revient à l'exploitant. | Règle qui aurait évité le retour : aucune exécutée ; classe à créer `coffre-de-reprise-sans-controle-des-cles-declarees` (famille `secret-hors-perimetre`). Proposition : un contrôle V7 du juge de synchro, et RP7 d'`oracle-reprise`, comparent les clés du coffre à celles que `PARAMETRAGE.md` déclare et nomment chaque clé absente. |

## Rattachement

Registre interrogé le 20/11/2026 vers 21:05 : aucune lecture de `todo\CLASSES.json` dans ce tour, le rattachement se fait à l'accueil du lot par le pilot.

Items recoupés : aucun.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le guide de mise en place du 14/10/2026 (étape 6) affirme « jamais deux empreintes en même temps » ; mesuré le 20/11 : 2 empreintes ouvertes à la fois sur 2 réservations, 2 600 € bloqués, 0 € encaissé (seq 1244) | non corrigée : rapport de diagnostic du 20/11 et décision 998 posée à l'exploitant | non : la règle de durée des empreintes et l'absence de libération par Beds24 sont propres à ce produit | reste au produit, la solution passera par un run de version |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La route `GET /channels/stripe/charges` de l'API Beds24, lue avec le seul jeton de lecture, a donné l'état réel de chaque charge Stripe (capturée, libérée, échéance) sans clé Stripe.
