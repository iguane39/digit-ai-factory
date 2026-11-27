# Retours forges — Produit-12 — 20261127a

> Annoté à la réception (pilot, 27/11/2026) : les noms de 2 correspondants des clients du produit, en titre de 4 documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : hors run — synthèse des brouillons 231 à 235 demandée par le porteur le 27/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 534 et 535 (entrées `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

La rédaction a 3 défauts nouveaux : elle traite la titulaire de la boîte en tiers, elle invente une règle du cabinet, et elle passe à côté de l'ultimatum d'un mail. Le remplacement d'un brouillon par un autre du même fil retire aussi la réponse due à un autre correspondant. Les 2 retours sont propres au produit.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : les défauts tiennent à la rédaction et au remplacement des brouillons du produit, pas à une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Brouillons 231 à 235 : 234 traite la titulaire de la boîte en tiers et déclare que la procédure d'expulsion ne relève pas du cabinet ; 232 invente une règle (pas d'échange par téléphone) ; 233 ignore l'ultimatum de retrait du mandat au 1er décembre (seq 534) | pas encore : nom de la titulaire fourni à la rédaction, aucune règle hors réponse type et fil, échéance du mail traitée d'abord, au prochain run de version ; cas 232, 233, 234 au corpus `backend/evals/redaction.eval.jsonl` | non | propre à la rédaction du produit |
| Le brouillon 231, réponse à une locataire, a été retiré et remplacé par le 234, réponse à une autre personne du même fil (seq 535) | pas encore : ne remplacer un brouillon du fil que si le nouveau mail vient du même correspondant | non | propre au dépôt des brouillons du produit |

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

Le tri des mails sans brouillon tient sur 16 cas sur 16 : 9 mails venus d'un collègue de l'agence, 3 factures EDF automatiques, 2 invitations d'agenda, 1 mail auquel un collègue a déjà répondu sur le même fil, 1 publicité mise en revue. Le brouillon 235 répond juste, en deux phrases, à un accord donné en une ligne.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
