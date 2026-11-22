# Retours forges — Produit-85 — 20261117a

- **Contexte** : demande humaine du 17/11/2026, « A part la vignette P1, je ne vois aucune nouvelle vignette sur la RC2. Vérifie et corrige les vignettes. […] Quel moyen simple et rapide peut-on mettre en place pour identifier les parcours plus simplement et rapidement avant l'affichage de la vignette du parcours après sauvegarde ? » La RC2 a été relue, P2 rétabli, et une commande de vérification ajoutée à la chaîne.
- **Références ledger** : `forge\ledger.jsonl` seq 145, 146 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 17/11/2026

---

Aucun retour aux forges sur ce lot : les deux retours du tour portent sur la lecture MTP de la RC2 et sur l'application DJI Fly, et restent au produit.

## Rattachement

Registre interrogé le 17/11/2026 : `grep -ciE "mtp|dji fly|map_preview" todo/TODO.jsonl` sur le pilot, sans borne → 2 lignes trouvées.

Item recoupé : aucun. Les 2 lignes portent TF-2006 (profil supabase de forge-audit), où « mtp » apparaît dans un autre mot.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un premier relevé MTP de la RC2 a rendu 17 parcours sur 21 et omis une vignette, sans erreur ; la session a d'abord conclu à la suppression de 3 parcours, démentie par le relevé suivant (seq 145). | `scripts/rc2/relever-rc2.ps1` relit chaque dossier jusqu'à deux listes identiques ; deux relevés suivants concordants à 21 parcours et 152 fichiers. | non | propre à la lecture MTP de la RC2 par ce produit |
| Ouvrir puis enregistrer un parcours dans DJI Fly remplace la vignette copiée par une capture de carte et réécrit le KMZ : passage sans arrêt, vitesse 2,5 m/s ; sur P12, l'enregistrement crée une copie où 0,1 m/s devient 2,5 m/s (seq 146). | `apdlb.rc2 etat` détecte la réécriture et la vignette remplacée, `--reprise` prépare l'envoi partiel ; P2 rétabli, envoi relu 4 sur 4 ; tests 88 sur 88. | non | propre aux missions DJI Fly de ce produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol APDLB - Missions | 4 | reste au produit, parce que chaque version est générée par `apdlb-fiches` depuis les missions du site et suit une évolution des missions, pas une reprise de forme |
| Fiches de vol Bray - Missions | 5 | reste au produit, parce que le même générateur `apdlb-fiches` la produit pour un autre site ; déjà déclarée au lot 20261116b |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le second relevé, joué pour vérifier l'état final au lieu de se fier au seul envoi, a démenti la fausse suppression avant toute action.

## Ordre recommandé

Aucun retour aux forges sur ce lot.
