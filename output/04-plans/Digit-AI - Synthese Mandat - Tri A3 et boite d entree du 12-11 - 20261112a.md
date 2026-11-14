## 0. Synthèse d'ouverture

Le tri A-3 est fait : les 12 candidats du 10/11 sont décidés par le pilot, chacun avec la voie de correction retenue, et la correction elle-même reste à lancer. Avant le tri, j'ai traité le bloquant que l'ouverture signalait. 7 lots attendaient au sas depuis 34 h : ils sont accueillis et ingérés, et ils apportent 15 candidats neufs. Un 8e lot, qui attendait depuis 38 h, est refusé à l'ingestion parce que sa forme est ancienne. Seule une dérogation humaine peut le faire entrer : c'est la décision qui vous revient.

## 1. En-tête d'identification

Synthèse du mandat « A3 », sur le pilot, le 12/11/2026 à 09:37, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de trier les candidats nés des deux campagnes du 10/11 pour que leur correction puisse partir. Test rétro : chaque candidat finit décidé avec une voie de correction nommée, ou posé à l'humain avec son motif.

## 3. Décisions attendues

Les bloquants qui retiennent la suite :
- le lot de retours du 10/11 du produit pseudonymisé Produit-84, refusé à l'ingestion, qui attend au sas ; votre réponse à la décision ci-dessous le lève.

> **D-206 — Faut-il ingérer par dérogation le lot de retours du 10/11 de Produit-84, écrit sur un gabarit ancien sans ses sections « Remarques restées au produit » et « Retours sur les documents produits », alors que ce produit est introuvable sur le poste ?**
> - **De quoi s'agit-il** : un lot de retours déposé à `input/00-retours/` il y a 38 h, qui porte un seul retour : le préjugement d'une restitution ne savait pas juger une réponse courte.
> - **Le problème** : `todo/ingerer-lot.mjs` le refuse, parce que 2 sections obligatoires manquent. Les remplir, c'est affirmer à la place du produit ce qu'il a gardé chez lui. Or ce produit n'est pas localisable sous `C:\dev`, donc personne ne peut le lui demander. Tant qu'il n'est pas ingéré, chaque ouverture de session le signale comme bloquant.
> - **Pourquoi vous** : l'outil d'ingestion réserve ce contournement à une décision humaine, avec un motif écrit qu'il inscrit au registre.
> - **Recommandation : (a)** — le retour qu'il porte est réel, la dérogation ne vaut que pour ce lot, et le défaut qu'il signale semble déjà couvert par le pré-vol d'une réponse courte. Source consultée : `todo/ingerer-lot.mjs`, option `--derogation-fichier`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ingérer par dérogation | le lot entre au registre avec le motif écrit, son retour devient un candidat, le bloquant disparaît des ouvertures | un candidat à trier, probablement déjà couvert | écarter le candidat |
| (b) Laisser au sas | le lot attend qu'un lot conforme du même produit prenne sa suite | le bloquant reste à chaque ouverture, et le retour n'est pas pris | ingérer plus tard par dérogation |

> **Sans réponse** : le lot reste au sas, et chaque ouverture de session le signale comme bloquant.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

Le tri et la boîte d'entrée ont été traités dans cet ordre, parce que l'ouverture classait la boîte en bloquant.
- La boîte d'entrée : 7 lots accueillis au sas (14 fichiers), sans refus et sans nom ni adresse à qualifier, puis ingérés. Ils créent 15 candidats, de TF-2430 à TF-2444. L'oracle du registre reste PASS après chaque ingestion.
- Le lot du 10/11 de Produit-84 : refusé 3 fois par l'ingestion. J'avais d'abord annoté 2 sections manquantes à sa place. Je les ai retirées, parce qu'elles affirmaient ce que seul le produit sait. Le fichier est revenu à son état reçu, 21 lignes.
- Le tri des 12 candidats : tous décidés sous R-58, aucun ne touche à la dépense, à la publication ni à la doctrine. En tête, le faux négatif de sécurité de forge-tests (TF-2403) : 4 avis connus ne sont pas vus en mode vif.
- Les 13 types de livrable à ajouter au registre de forge-organization s'instruiront un par un : alias d'un type existant, type neuf motivé, ou type propre au produit.
- Le constat d'oracle-pptx sur l'ordre du zip se mesure d'abord dans PowerPoint. Ouvert sans réparation, c'est un faux positif à retirer.

Relecture d'intention : sans objet, un tri au registre sans consigne passée à un agent.

## 5. Non traité

- Le lot du 10/11 de Produit-84 — motif : dependance_bloc_3, il attend votre réponse à la décision du bloc 3.
- La correction des 12 candidats décidés — motif : hors_mandat, la demande portait sur le tri.

## 8. Prochaines actions

Trois actions suivent, dont une seule vous revient.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à la décision sur le lot rejeté | D-206 | manuelle_utilisateur | decision | options au bloc 3 de `output/04-plans/Digit-AI - Synthese Mandat - Tri A3 et boite d entree du 12-11 - 20261112a.md` ; répondre « 206a » ou « 206b » | si rien n'est fait, le bloquant reste à chaque ouverture |
| A-2 | Lancer la campagne qui corrige les 12 candidats décidés, en commençant par le faux négatif de sécurité | TF-2403 | auto_ia | hors_mandat : la demande portait sur le tri | `todo/TODO.jsonl`, décisions du 12/11 ; agents de campagne en arbres de travail, comme le 10/11 | si rien n'est fait, 4 avis de sécurité connus restent invisibles en mode vif |
| A-3 | Trier les 15 candidats arrivés ce matin par les lots | TF-2430 | auto_ia | hors_mandat : nés pendant ce tour | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, les retours de 5 produits attendent leur décision |

Ordre : la décision d'abord, parce qu'elle seule vous revient ; puis la campagne, qui ferme un faux négatif de sécurité ; le tri en dernier, parce qu'il ne bloque rien.

## 9. Traces

- `todo/TODO.jsonl` : 14 événements d'ingestion, 15 candidats et 12 décisions ; oracle du registre PASS.
- `decisions/REGISTRE.jsonl` : D-206 réservée.
- `input/00-retours/` : les 14 fichiers des 7 lots ingérés ; le lot rejeté reste non suivi, en attente.
- Le commit de ce tour et cette synthèse sont publiés ensemble, vérifiés par `git rev-list --count origin/main..main` à 0.
