# Retours forges — Produit-12 — 20261124b

- **Contexte** : hors run — vérification demandée par le porteur le 24/11/2026 après une alerte « IA retombée sur les règles locales »
- **Références ledger** : `forge\ledger.jsonl` seq 487 (entrée `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

Une alerte de repli a fait croire au porteur que les brouillons ne passaient plus par l'IA. Les relevés de production montrent le contraire : 11 brouillons sur 11 rédigés par Claude le 24/11. Le seul repli concerne 1 classement sur 30, et il reste un défaut du produit.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : le repli tient à la lecture de la réponse de classement par le produit, pas à une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un classement a reçu de Claude du texte libre au lieu de « identifiant confiance » ; le mail est passé aux règles locales et l'alerte de repli est partie (24/11, 12:39) | pas encore : même run de version que les défauts de rédaction (seq 484), avec une sortie contrainte ou un réessai unique avant le repli | non | propre au classement du produit |

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

Le repli de l'IA se décide appel par appel : le classement suivant et les 11 rédactions du jour sont repartis vers Claude sans intervention, et l'alerte a prévenu le porteur dans la minute.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
