# Retours forges — digit-ai-marketing — 20261125c

- **Contexte** : questionnaires de satisfaction Qualiopi d'un client du produit, dont la question 1 et la rubrique 4 reprennent le modèle d'un autre organisme, à la demande du porteur ; versions remplacées rangées sous `old/`.
- **Références ledger** : `forge\ledger.jsonl` seq 846 (entrée `type: retour`), déplacements tracés seq 836 à 840, verdicts seq 841 et 842.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 25/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 1 refus de hook sur 1 tour, dû à une commande de la session ; 0 défaut de forge. Ce lot remonte 0 retour aux forges et garde 1 remarque au produit.

---

## Remarques restées au produit

| id | Remarque | Pourquoi elle reste au produit | Généralisable |
|---|---|---|---|
| RM-3 | Le hook `renommage-livrable` (TF-2737) a refusé un `git mv` de 5 livrables vers `old/`. La session a rejoué chaque déplacement par `scripts\renommer-livrable.mjs` du pilot, qui a tracé au ledger (seq 836 à 840). (ledger seq 846) | Le hook a joué son rôle : l'erreur était une forme de commande de la session, et le message du hook donnait la commande à jouer, livrable par livrable. | généralisable : non |

## Rattachement

Aucun retour envoyé aux forges sur ce lot : aucune commande de rattachement à jouer.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `renommer-livrable.mjs` a déplacé et tracé les 5 livrables du premier coup, y compris 2 fichiers que Foxit PDF Reader avait tenus ouverts au tour précédent.

## Ordre recommandé

Aucun retour à ordonner sur ce lot.

## La règle qui aurait évité le retour

Un livrable sous `output/` se déplace par `renommer-livrable.mjs`, jamais par `git mv`, `old/` compris.
