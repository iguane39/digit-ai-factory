# Retours forges — Produit-12 — 20261125e

> Annoté par le pilot le 28/11/2026 (D-247 (a)) : les noms de 2 correspondants des clients du produit, en titre de documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : hors run — mise en production de la version 0.9.4 sur le GO « 245a » du porteur, puis déplacement des signatures déjà déposées et rechargement du référentiel, le 25/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 527 (entrée `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

La 0.9.4 est en production (contrôle 12 sur 12) et les 307 signatures déjà déposées sont rangées à part. Le rechargement manuel du référentiel a révélé un défaut ancien du produit : le lancement du rangement à la main gèle toute l'application pendant l'indexation.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : le défaut tient à une route du produit, pas à une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le lancement manuel du rangement (route `POST /api/stockage/rangement` et bouton de l'écran Stockage) appelle le traitement de façon synchrone dans un handler async : l'indexation de 108 449 documents a bloqué l'application d'environ 14:44 à 15:00, avec un 502 du proxy à 300 s (seq 527) | non corrigé : le travail doit passer dans un fil, avec une réponse 202 et un test de non-blocage de `/sante` ; inscrit en action, et dans le dossier de MEP la consigne de ne pas relancer le rangement à la main d'ici là | non | propre à une route du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot.

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

Le déplacement de fichiers par la copie synchronisée du Dropbox s'est vérifié en ligne par l'API du produit : 10 sur 10 d'un échantillon lus à leur nouvelle place 5 minutes après le geste, sans fichier perdu entre-temps.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
