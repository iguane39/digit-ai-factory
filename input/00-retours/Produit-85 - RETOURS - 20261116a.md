# Retours forges — Produit-85 — 20261116a

- **Contexte** : demande humaine du 16/11/2026, « La RC2 est branchée, copie les parcours de vol dessus. Est-ce que les vignettes sont bien prévues pour les visualiser sur la RC2 ? Si non, ajoute les avant copie. » Les vignettes manquaient à la chaîne ; elles ont été ajoutées, puis les 9 missions de Pontorson ont été copiées sur la RC2. La copie a mis au jour une réécriture des missions par DJI Fly après chaque vol.
- **Références ledger** : `forge\ledger.jsonl` seq 135 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 16/11/2026

---

Aucun retour aux forges sur ce lot : le seul retour du tour porte sur l'application DJI Fly et reste au produit.

## Rattachement

Registre interrogé le 16/11/2026 : `grep -ciE "dji fly|kmz|waypoint|map_preview|vignette" todo/TODO.jsonl` sur le pilot, sans borne → 1 ligne trouvée.

Item recoupé : aucun. La seule ligne, TF-1881 (candidat), porte sur la méthode de mesure d'un classement par planches d'images, sans rapport avec DJI Fly.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| DJI Fly réécrit le KMZ d'une mission 1 à 2 min après la fin de son vol. Mesure du 16/11/2026 sur les 7 missions de Bray copiées le 25/10 : dernières photos à 10:23:58, 11:06:32 et 12:05:34, réécritures à 10:25:19, 11:08:29 et 12:06:58. Les coordonnées et les hauteurs restent les mêmes, mais les points intermédiaires passent de `toPointAndStopWithDiscontinuityCurvature` à `toPointAndPassWithContinuityCurvature`, soit un passage en courbe sans arrêt (4 missions relues sur 4). La vignette copiée ne s'affiche qu'après cette réécriture. Un second vol suivrait la version en courbes, que la garde d'obstacles n'a pas jugée. | Le porteur en est averti dans la restitution. Le module `apdlb.rc2` produit désormais les vignettes et l'envoi vers la RC2 (`tests/test_rc2.py`, 9 tests passent). La fiche de vol et le guide RC 2 sont à mettre à jour au prochain tour. | non | comportement propre à DJI Fly et à ce produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol Bray - Missions | 5 | reste au produit, parce que chaque version est générée par `apdlb-fiches` depuis les missions du site : sa forme vit dans le code du produit, et chaque version suit une évolution des missions, pas une reprise de forme |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le hook `garde-rm-variable` a refusé une suppression dont la cible passait par une variable. La commande réécrite sur un chemin écrit en entier est passée du premier coup.

## Ordre recommandé

Sans objet : aucun retour aux forges sur ce lot.
