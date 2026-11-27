# Retours forges — Produit-12 — 20261126a

- **Contexte** : hors run — synthèse des brouillons 221 à 230 demandée par le porteur le 26/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 529, 530 et 531 (entrées `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

La mesure des issues sous-estime les brouillons utilisés : la similarité s'effondre au-delà de 200 caractères, et un transfert interne compte comme une réponse. La rédaction a 3 défauts nouveaux : salutation au nom de la boîte, réponse à l'adresse relais de l'extranet, contresens. Les 3 retours sont propres au produit.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : les défauts tiennent à la mesure des issues et à la rédaction du produit, pas à une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `issues_brouillons.similarite` appelle `SequenceMatcher` avec `autojunk` par défaut : le 221, salutation et première phrase reprises, noté 0,014 au lieu de 0,44 ; le seuil seul classe aussi « retouché » le 223, resté intact dans les brouillons (seq 529) | pas encore : au prochain run de version, `autojunk=False`, issue déduite d'abord de la trace dans les dossiers, issues enregistrées recalculées | non | propre à la mesure des issues du produit |
| Un transfert interne à un collègue est apparié comme réponse et compté « réécrit » à 0,0 : 186, 202, 212, 216, et 224 au prochain passage (seq 530) | pas encore : même run de version, un envoi qui ne va pas à l'expéditeur du mail n'est pas une réponse | non | propre à la mesure des issues du produit |
| Brouillons 221 à 230 : 227 salue la gestionnaire par son propre nom ; 221 répond à l'adresse relais du formulaire de l'extranet, revenue en erreur ; 226 contresens ; 228 rédigé pour un mail adressé à un tiers ; 225 engage le cabinet (seq 531) | pas encore : consigne et choix du destinataire au prochain run de version ; cas 221, 226, 227, 228 au corpus `backend/evals/redaction.eval.jsonl` | non | propre à la rédaction du produit |

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

La lecture des dossiers de la boîte, en lecture seule, donne le sort de chaque brouillon sans ambiguïté sur 10 cas sur 10 : présent dans « Brouillons », présent dans « Éléments supprimés », ou parti avec un envoi sur le même fil.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
