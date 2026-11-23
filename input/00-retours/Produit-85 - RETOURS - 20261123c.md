# Retours forges — Produit-85 — 20261123c

- **Contexte** : consigne du porteur du 23/11/2026, « arrête sur ce poste, je reprendrai sur l'autre poste », pendant la phase P5 du brief `output\apdlb\Digit-AI - Brief APDLB - Visionneuse 3D autonome - 20261122b.md`. La session a voulu arrêter l'entraînement Brush par le nom du processus.
- **Références ledger** : `forge\ledger.jsonl` seq 160 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 23/11/2026

---

Aucun retour aux forges sur ce lot : le retour du tour reste au produit, avec son motif ci-dessous.

## Rattachement

Registre interrogé le 23/11/2026 : `grep -ciE "stop-process|arret par nom|par PID" todo/TODO.jsonl` → 3 ligne(s) trouvée(s).

Item recoupé : TF-2689, candidat (un agent de campagne a arrêté des processus `node` par motif de ligne de commande, dont 2 recettes d'autres agents). Même classe de geste ; ici, le hook l'a refusé avant tout dégât. TF-2731 porte sur une tâche d'arrière-plan et ne recoupe pas.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Pour arrêter l'entraînement, la session a lancé `Get-Process brush_app \| Stop-Process -Force`, un arrêt par nom qui toucherait les processus d'autres sessions. Le hook `gestes-distants` l'a refusé (TF-1959, D-196 (b)). Aucun `brush_app` ne tournait : il s'était arrêté avec la session précédente (seq 160). | Le processus a été cherché par nom en lecture seule (`Get-Process`, `tasklist`) : aucun à arrêter. Un arrêt se fait par PID relevé (`taskkill /PID`). | non | le garde-fou a joué son rôle ; TF-2689 couvre déjà la classe au registre |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol APDLB - Missions | 4 | reste au produit, parce que chaque version est générée par `apdlb-fiches` depuis les missions du site ; déjà déclarée au lot 20261117b |
| Fiches de vol Bray - Missions | 5 | reste au produit, parce que le même générateur la produit pour un autre site ; déjà déclarée au lot 20261116b |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. Le refus vient d'un hook de la factory, pas de la plateforme.

## Confirmations positives

- Le hook `gestes-distants` a refusé l'arrêt par nom avant exécution, et son message donnait le remède (arrêt par PID).

## Ordre recommandé

Aucun retour aux forges sur ce lot.
