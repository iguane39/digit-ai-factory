# Retours forges — Produit-12 — 20261125b

> Annoté par le pilot le 28/11/2026 (D-247 (a)) : les noms de 2 correspondants des clients du produit, en titre de documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : hors run — seconde synthèse demandée par le porteur le 25/11/2026, premier brouillon de la 0.9.3
- **Références ledger** : `forge\ledger.jsonl` seq 506 et 507 (entrées `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

Le premier brouillon de la 0.9.3 a la forme promise et un fond faux : une plainte de locataire transmise par la propriétaire reçoit la réponse prévue pour un artisan. Le job des issues compte comme inutile le premier brouillon de Claude vraiment envoyé. Les 2 défauts sont propres au produit.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : les défauts tiennent à la rédaction et à la mesure des issues du produit, pas à une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Brouillon 220 : plainte de locataire transmise par la propriétaire, classée « Rendez-vous d'intervention » (65), rédigée sur le modèle d'artisan avec 4 passages entre crochets ; supprimé par la gestionnaire (seq 506) | pas encore : au prochain run de version, écarter le modèle quand le mail ne correspond pas à sa situation, et ajouter le cas au corpus `backend/evals/redaction.eval.jsonl` | non | propre à la rédaction du produit |
| Brouillon 219 envoyé retouché le 25/11 à 10:02 (similarité 0,361) alors que le job l'a classé « déjà répondu » le 24/11 ; une issue enregistrée ne se recalcule pas (seq 507, complète seq 503) | pas encore : même run de version que seq 503, avec recalcul des issues « déjà répondu » déjà enregistrées | non | propre à la mesure des issues du produit |

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

La signature en image et l'historique du fil de la 0.9.3 sont constatés dans un vrai brouillon de production, lu dans la boîte : image de 37 443 octets par `cid:`, historique sous le texte, objet à un seul préfixe.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
