# Retours forges — Produit-12 — 20261124c

- **Contexte** : hors run — proposition de brouillon avec signature et historique du fil, demandée par le porteur le 24/11/2026 avant implémentation
- **Références ledger** : `forge\ledger.jsonl` seq 488, 489 (entrées `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

Le porteur veut que chaque brouillon porte la signature de la gestionnaire, puis tout le fil en dessous. La proposition est bâtie sur un mail réel et attend sa validation (D-241). En lisant les brouillons de production, un défaut d'objet est apparu : 33 brouillons sur les 50 derniers doublent le préfixe de réponse. Les deux retours restent au produit.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : les deux constats portent sur l'assemblage des brouillons par le produit, pas sur une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le brouillon s'arrête à la formule de politesse (E-119 du 08/11) et ne cite pas le mail reçu : la gestionnaire ajoute sa signature et rouvre le mail pour suivre le fil (seq 488) | pas encore : proposition sur le mail réel 408 dans `output/04-evolutions/`, implémentation au run de version après D-241 | non | évolution propre au produit |
| L'objet par défaut « Re: {{sujet}} » double le préfixe : 33 brouillons sur 50 portent « Re: Re: » ou « Re: RE: » (seq 489) | pas encore : préfixer seulement un objet qui n'en porte pas, dans le même run de version | non | propre à l'assemblage des brouillons |

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

La proposition se juge sur pièce sans toucher à la boîte réelle : un fichier .eml construit depuis l'API en lecture seule s'ouvre dans Outlook comme le futur brouillon.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
