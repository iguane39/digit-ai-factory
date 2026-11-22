# Retours forges — Produit-85 — 20261122a

- **Contexte** : demande humaine du 22/11/2026, « Récupère les photos du drone du domaine APDLB que tu n'as pas déjà ». Les 744 photos du vol du 18/11 ont été copiées et contrôlées dans `donnees\apdlb\vols\20261118`.
- **Références ledger** : `forge\ledger.jsonl` seq 150 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 22/11/2026

---

Aucun retour aux forges sur ce lot : le seul retour du tour porte sur une erreur de lecture de la session, et reste au produit.

## Rattachement

Registre interrogé le 22/11/2026 : `grep -ciE "arriere-plan|arrière-plan|background" todo/TODO.jsonl` sur le pilot, sans borne → 34 lignes trouvées.

Item recoupé : aucun. Les plus proches, TF-1132, TF-1649 et TF-1669, portent sur un tour clos pendant qu'une commande tourne, pas sur une heure lue au mauvais endroit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Pendant l'ingestion lancée en arrière-plan, la session a lu l'heure de sa propre commande `date` (15:28:32) comme la fin du processus, et a annoncé à tort un arrêt sans message ; l'ingestion s'est terminée normalement à 15:30:41 (seq 150). | Relance inutile arrêtée sans effet sur les fichiers ; correction dite à l'humain dans la restitution ; la fin d'une tâche en arrière-plan se juge à sa notification. | non | erreur de lecture propre à la session, aucun outil de la forge en cause |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol APDLB - Missions | 4 | reste au produit, parce que chaque version est générée par `apdlb-fiches` depuis les missions du site et suit une évolution des missions, pas une reprise de forme ; déjà déclarée au lot 20261117b |
| Fiches de vol Bray - Missions | 5 | reste au produit, parce que le même générateur `apdlb-fiches` la produit pour un autre site ; déjà déclarée au lot 20261116b |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La copie sans écrasement de `apdlb-ingestion`, avec empreinte relue après écriture, a rendu 744 copies conformes, confirmées par une comparaison indépendante des noms et des tailles.

## Ordre recommandé

Aucun retour aux forges sur ce lot.
