# Retours forges — Produit-12 — 20261125a

- **Contexte** : hors run — synthèse demandée par le porteur le 25/11/2026 depuis la mise en production de la 0.9.3
- **Références ledger** : `forge\ledger.jsonl` seq 503 (entrée `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

La mesure des issues des brouillons surestime les « déjà répondu ». Les 5 brouillons classés ainsi le 24/11 reçoivent une réponse partie avant l'arrivée de leur mail, de 28 minutes à 8 jours plus tôt. Le défaut est propre au produit.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : le défaut tient à l'appariement des envois par le job des issues du produit, pas à une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le job des issues classe « déjà répondu » un brouillon dont la réponse rattachée est partie avant la réception du mail : 204, 209, 214, 218 et 219 le 24/11 à 19:53 | pas encore : au prochain run de version, ne retenir qu'un envoi parti entre la réception du mail et le dépôt du brouillon (`relire_compte`, issues_brouillons.py ligne 189), avec un cas de test par brouillon faux | non | propre à la mesure des issues du produit |

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

Le job des issues passé au déploiement de la 0.9.3 a mesuré les deux premiers brouillons de Claude repris en partie dans la réponse envoyée (211 et 215), sans intervention.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
