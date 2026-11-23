# Retours forges — Produit-85 — 20261123b

- **Contexte** : question du porteur du 23/11/2026 sur la durée de l'entraînement de la visite 3D APDLB, phase P5 du brief `output\apdlb\Digit-AI - Brief APDLB - Visionneuse 3D autonome - 20261122b.md`. La projection de durée donnée à 01:15 sous-estimait l'entraînement sur l'Intel Arc.
- **Références ledger** : `forge\ledger.jsonl` seq 158 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 23/11/2026

---

Aucun retour aux forges sur ce lot : le retour du tour reste au produit, avec son motif ci-dessous.

## Rattachement

Registre interrogé le 23/11/2026 : `grep -ciE "vitesse constante|projection de dur|duree projetee" todo/TODO.jsonl` → 0 ligne(s) trouvée(s).

Aucun item recoupé.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La restitution de 01:15 projetait l'entraînement en 1920 sur l'Intel Arc à 9,6 h au moins, en extrapolant à vitesse constante l'essai de 2 000 pas (0,82 à 0,94 s par pas, 3 à 4 millions de taches). Mesuré à 07:02 UTC : pas 9 001, 9,55 millions de taches, 2,1 à 2,4 s par pas, 6,74 h écoulées, soit 24 à 38 h au total (seq 158). | Dit au porteur dans le tour. L'entraînement en 1920 passe aussi sur la RTX 3090, où Bray a pris 61,4 min pour les mêmes réglages (ledger 107). Une durée Brush se projette désormais sur le coût par tache mesuré. | non | erreur de calcul de la session, aucun outil de la forge en cause |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol APDLB - Missions | 4 | reste au produit, parce que chaque version est générée par `apdlb-fiches` depuis les missions du site ; déjà déclarée au lot 20261117b |
| Fiches de vol Bray - Missions | 5 | reste au produit, parce que le même générateur la produit pour un autre site ; déjà déclarée au lot 20261116b |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- À 5 000 pas, l'entraînement en 1920 rend déjà 19,00 dB sur les 17 vues d'évaluation, au-dessus des 18,92 dB du rendu final de Bray.

## Ordre recommandé

Aucun retour aux forges sur ce lot.
