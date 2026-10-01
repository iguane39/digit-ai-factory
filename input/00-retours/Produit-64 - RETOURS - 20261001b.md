# Lot de retours — Produit-64 → digit-ai-factory — 2026-10-01, indice b

**Émetteur** : produit `Produit-64` · **Cible** : le pilot `digit-ai-factory` (loi n° 5, gabarit de restitution, `oracle-synthese`) · **Origine** : une demande de dépôt de secret faite le 01/10/2026 par le porteur pour un développeur du projet BAV2, et le constat du porteur : « J'ai pu faire cette inscription manuellement, pourquoi est-ce que tu ne l'as pas fait quand je te l'ai demandé ? »

Ce lot porte **1 retour**, mesuré pendant cette demande.

- **Contexte** : demande du porteur du 01/10/2026, 10:00 environ — déposer un jeton Mapbox au Key Vault de développement de BAV2 pour un développeur dont le compte est refusé. Hors run. Décision du porteur à la clôture : « tout ce qui peut être fait automatiquement doit être fait automatiquement, pas manuellement […] remonte ce sujet à la Factory pour que ce soit appliqué systématiquement pour toutes les demandes et tous les besoins, dans tous les projets / produits ».
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-01** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.

> **Note de réception du pilot, 01/10/2026.** Le retour RT-28 de ce lot devient RT-31 : le pilot avait donné RT-28, le 28/09, à un retour du lot 20260928a de ce même produit, et le lot 20261001c, remis ce matin, porte RT-29 et RT-30. Le reste du texte est celui du producteur.

---

## digit-ai-factory (`digit-ai-factory`)

La loi n° 5 (« la voie automatisée est le défaut ») est écrite au pilot, et trois restitutions successives ont laissé à l'humain un geste que la session pouvait faire. Aucune n'a été refusée sur ce motif.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-31 | bloquant | générique | **Une restitution laisse à l'humain un geste automatisable, et aucun contrôle ne demande si la voie automatique a été cherchée.** Le 01/10/2026, sur une demande de dépôt de secret : (1) **10:02** — la session teste UNE identité (le compte de l'utilisateur, plan de données du coffre : `ForbiddenByRbac`) et recommande de solliciter l'équipe plateforme Azure ; elle n'a lu ni les attributions de rôle du coffre (deux principaux de service de la chaîne y sont `Key Vault Secrets Officer`), ni le dépôt du produit, dont `azure/pipeline-rotation-secret.yml` écrit en tête « aucun humain n'a de droit sur les secrets […] Les secrets ne transitent que par la pipeline ». (2) **10:10** — sur la question du porteur, la session trouve la voie du pipeline, puis laisse « donner la valeur à la variable secrète du pipeline » à l'humain sous `acces : le jeton n'est qu'en sa possession`. C'est faux : la valeur figurait dans le message du porteur. Au bloc 5, elle déclare Azure DevOps inaccessible (« reconnexion avec double authentification ») en citant une **mémoire** de session, sans aucun appel. (3) **10:14** — le prompt livré au développeur porte toujours ce geste à faire à la main. **Mesure à 10:35** : `GET https://dev.azure.com/<org>/_apis/projects` rend **200** avec le jeton de la session, et `GET …/build/definitions/203` montre les deux variables secrètes `mapbox-token` et `mapboxTokenDepot`, créées **à la main** par le porteur entre-temps — un `PUT` sur la même définition les aurait créées. Les trois restitutions ont été jugées par `oracle-synthese` ; la première et la troisième ont été refusées sur la forme (S1, S3, S4, S6), aucune sur le fond, et la troisième est passée une fois S6 corrigée. Coût : un geste humain dans une interface, une explication demandée par le porteur, et un prompt transmis à un tiers qui prescrit un geste manuel inutile. | Trois pièces, du plus mécanisable au moins mécanisable. **(a) Le juge** : une raison `acces` ou `presence` au bloc 8 porte la trace mesurée **dans le tour** du geste MÊME qu'elle laisse à l'humain — même ressource, même plan (contrôle ou données), même plateforme ; une trace sur une autre ressource, ou une mémoire, ne vaut pas trace (S25 juge déjà deux familles de chemins pour une incapacité déclarée ; elle ne regarde pas si la trace porte sur le geste laissé). **(b) Le juge, second volet** : une raison du type « X n'est qu'en possession de l'humain » est refusée quand X figure dans un message humain de la session (texte ou image transcrite). **(c) La doctrine** : avant toute action laissée à `manuelle_*`, une **énumération des voies** écrite dans le tour — l'identité de la session ; les identités de service qui ont le droit sur la cible (attributions de rôle lues) ; l'automatisation déjà présente dans le dépôt du produit (pipelines, scripts) ; l'API de la plateforme pour le geste lui-même — chacune avec son code de retour. Portée demandée par le porteur : toutes les demandes et tous les besoins, dans tous les projets et produits ; donc au noyau et au gabarit de restitution hérité par chaque produit, pas dans une forge. |

**Portée** : générique — toute session d'un produit ou d'une forge qui restitue avec le bloc 8 y est exposée. Le produit s'en est corrigé localement (mémoire de session et instructions globales du poste), ce qui ne protège aucun autre poste ni aucun autre produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Une mémoire de session (« jeton ADO refusé : double authentification ») a été lue comme un état présent, alors qu'elle décrivait un refus passé | mémoire réécrite : le refus est intermittent, se mesure à chaque fois, et la mémoire n'est jamais une trace | oui | généralisable → remonté ci-dessus, RT-31 (b) et (c) : une mémoire ne vaut pas trace |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot : il ne produit aucun document. Les 8 documents d'`output/` à 5 versions datées ou plus sont déclarés au lot `Produit-64 - RETOURS - 20260924e` (relevé `LOT-MURS` du 01/10/2026 : tous déclarés).

## Confirmations positives

- `oracle-synthese` a refusé deux fois la forme (S1, S3, S4, S6 sur la première restitution, S6 sur la troisième) : la restitution corrigée nommait ses bloquants et ordonnait ses actions.
- S25 (version 2.27.0) a orienté la deuxième recherche : c'est en cherchant une seconde famille de chemins que la session a trouvé les identités de service du coffre.

## Ordre recommandé

1. RT-31 — le défaut est transverse : chaque restitution à action humaine y est exposée.

## La règle qui aurait évité le retour

- **RT-31** — aucune classe existante ne convient : `restitution-action-humaine-geste-agent` juge la NATURE du geste demandé (créer, écrire), pas l'existence d'une voie automatique pour un geste légitime en soi. Clé proposée `voie-automatique-non-cherchee-avant-geste-humain`, famille `restitution-forme`, libellé « Une action est laissée à l'humain sans que la restitution montre l'énumération des voies automatiques (identité de la session, identités de service autorisées, automatisation du dépôt, API de la plateforme), ou avec une trace qui ne porte pas sur le geste laissé — une mémoire, une autre ressource, ou une valeur prétendue détenue par l'humain seul alors qu'il l'a fournie ».
