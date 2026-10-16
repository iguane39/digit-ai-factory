# Retours forges — UIA (Produit-71) — 20260924a

- **Contexte** : tour additionnel après clôture du run `UIA-mandat-audit-poc-to-prod-20260923` (demande humaine du 2026-09-24).
- **Références ledger** : `forge\ledger.jsonl` seq 86-88 (entrées `type: retour` seq 88).
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Retours à `digit-ai-forge-audit` (méthodologie POC-to-Prod + compliance-pack)

| Réf | Gravité | Portée | Le fait | Piste |
|---|---|---|---|---|
| RX-7 | majeur | générique | La fiche sécurité de mise à disposition est conçue pour tenir sur 1 page A4 et le compliance-pack la déclare « vérifiable par rendu Playwright A4 → 1 page », mais la liste des livrables (méthodologie §6) ne produit que le HTML. Le **PDF A4**, format attendu par la sécurité pour diffusion et impression, n'est généré par aucune étape de l'audit. Un destinataire l'a redemandé. | Ajouter à la méthodologie §6 et au prompt d'audit la génération de la fiche en **PDF A4** (rendu Playwright/WeasyPrint, contrôle : 1 page, 210×297 mm), à côté du HTML ; l'inscrire au tableau des livrables attendus. |

## Remarques restées au produit

- Aucune remarque de portée purement produit n'est restée : le PDF A4 a été généré pour UIA dans ce tour, à côté de la fiche HTML. **Généralisable : non** (le livrable produit ici est propre à UIA ; la règle, elle, est remontée ci-dessus).

## Retours sur les documents produits

- La fiche sécurité PDF a été rendue depuis le gabarit `Client-A - Modèle Fiche Sécurité Mise à disposition - Dev` (version du gabarit : 20260710a) : le gabarit déclarait déjà l'aptitude A4 mais aucune consigne ne demandait de matérialiser le PDF. Le rendu confirme que le gabarit tient sur 1 page A4 sans débordement.
