# Retours forges — digit-ai-marketing — 20261125b

- **Contexte** : feuilles d'émargement Qualiopi d'un client du produit, portées de 4 à 8 lignes de participants sur une seule page, à la demande du porteur.
- **Références ledger** : `forge\ledger.jsonl` seq 830 (entrée `type: retour`), verdicts seq 829, livrables seq 831.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 25/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 1 refus de hook sur 1 tour, dû à une commande de la session ; 0 défaut de forge. Ce lot remonte 0 retour aux forges et garde 1 remarque au produit.

---

## Remarques restées au produit

| id | Remarque | Pourquoi elle reste au produit | Généralisable |
|---|---|---|---|
| RM-2 | Le garde `garde-rm-variable` a refusé une seconde fois une suppression par variable (`rm -f` dans un dossier temporaire d'épreuve rouge). C'est une récidive de RM-1 (lot 20261125a) dans la même session. La commande a été réécrite par copie sélective, sans suppression. (ledger seq 830) | Le garde a joué son rôle : l'erreur était une forme de commande de la session, et le message du garde donnait le remède. | généralisable : non |

## Rattachement

Aucun retour envoyé aux forges sur ce lot : aucune commande de rattachement à jouer.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Fixer les largeurs des colonnes a libéré 2 cm sur la feuille : les 8 lignes de signature gardent leur hauteur d'1 cm sur une seule page.

## Ordre recommandé

Aucun retour à ordonner sur ce lot.

## La règle qui aurait évité le retour

Une épreuve rouge se prépare par copie sélective dans un dossier neuf, jamais par suppression dans une copie.
