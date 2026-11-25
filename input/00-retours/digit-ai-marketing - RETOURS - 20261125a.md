# Retours forges — digit-ai-marketing — 20261125a

- **Contexte** : production des documents Qualiopi à signer de 2 formations pour un client du produit (émargement, satisfaction à chaud, évaluation des acquis), sur des modèles fournis par le porteur.
- **Références ledger** : `forge\ledger.jsonl` seq 828 (entrée `type: retour`), livrables seq 825, verdicts seq 826.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 25/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 1 refus de hook sur 1 tour, dû à une commande de la session ; 0 défaut de forge. Ce lot remonte 0 retour aux forges et garde 1 remarque au produit.

---

## Remarques restées au produit

| id | Remarque | Pourquoi elle reste au produit | Généralisable |
|---|---|---|---|
| RM-1 | Le garde `garde-rm-variable` a refusé `rm -rf "$ROUGE"` avant l'épreuve rouge d'un vérificateur. La commande a été réécrite sans suppression, avec une copie dans un dossier neuf du répertoire temporaire. (ledger seq 828) | Le garde a joué son rôle : l'erreur était une forme de commande de la session, et le message du garde donnait le remède. | généralisable : non |

## Rattachement

Aucun retour envoyé aux forges sur ce lot : aucune commande de rattachement à jouer.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le convertisseur Markdown vers Word du 27/10/2026 a servi une troisième fois sans copie : 6 documents de plus au même format, avec 6 PASS sur 6 aux oracles Word et OOXML.

## Ordre recommandé

Aucun retour à ordonner sur ce lot.

## La règle qui aurait évité le retour

Une suppression ne passe jamais par une variable : la cible s'écrit en entier, ou la copie va dans un dossier neuf.
