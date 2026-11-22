# Retours forges — Produit-85 — 20261117b

- **Contexte** : demande humaine du 17/11/2026, « ça ne fonctionne pas. Lorsque j'ouvre les parcours, les vignettes ne s'affichent pas, elles sont remplacées par des cartes des parcours. Pourtant, hier, pour la vignette P1, ça a fonctionné. Corrige pour toutes les vignettes. » P2 a été rétabli et l'envoi sur des parcours vides créés juste avant a été outillé.
- **Références ledger** : `forge\ledger.jsonl` seq 148 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 17/11/2026

---

Aucun retour aux forges sur ce lot : le seul retour du tour porte sur l'application DJI Fly, et restent au produit.

## Rattachement

Registre interrogé le 17/11/2026 : `grep -ciE "mtp|dji fly|map_preview" todo/TODO.jsonl` sur le pilot, sans borne → 2 lignes trouvées.

Item recoupé : aucun. Les 2 lignes portent TF-2006 (profil supabase de forge-audit), où « mtp » apparaît dans un autre mot.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Ouvrir un parcours dans DJI Fly, sans l'enregistrer, remplace son aperçu en mémoire par un dessin de carte : 11 parcours ouverts, fichiers intacts sur la RC2, cartes à l'écran ; le fichier vignette n'est relu qu'après un vol (seq 148). | `apdlb.rc2 envoi --avant/--apres` écrase des parcours vides créés juste avant l'envoi, repérés par leur date de création ; tests 91 sur 91. | non | propre aux missions DJI Fly de ce produit |

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

- La commande `etat` ajoutée au tour précédent a distingué en une passe le parcours réécrit (P2) des 11 parcours intacts.

## Ordre recommandé

Aucun retour aux forges sur ce lot.
