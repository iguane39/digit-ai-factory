# Retours forges — Produit-84 — 20261019b

- **Contexte** : autre — demande humaine hors run du 19/10/2026 : « Travaille une nouvelle version du schéma d'architecture avec ce design », image d'une diapositive Client-A fournie
- **Références ledger** : `forge\ledger.jsonl` seq 16 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 19/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre non interrogé dans ce lot : le pilot rattache à l'accueil. RT-10 entre comme neuf.

## digit-ai-forge-agents

Un chevauchement de texte visible à l'œil sur la capture est passé sous V4.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-10 | mineur | générique | Page `output\05-architectures\Client-A - Architecture cible Produit-84 - Pages et Supabase - 20261019b.html`, rendue à 1 920 px le 19/10 : le `<text>` de premier niveau « Sources lues au 19/10/2026 » (x 1520, `text-anchor: end`, y 831) recouvrait le dernier libellé d'une légende groupée dans `<g transform="translate(80,818)">` sans `<title>`. `render_page.py --selector .diagram-wrap` : Verdict PASS, 0 constat V4. Défaut vu sur la capture seulement. Ledger seq 16 | Comparer en V4 les `<text>` de premier niveau aux `<text>` descendants des groupes frères sans titre, pas seulement aux groupes entiers ; fixture rouge : ce cas, réduit à une légende et un texte ancré à droite |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le texte de date est passé sous le filet de bas de diapositive | Corrigé sur place, rendu rejoué à PASS et capture relue | généralisable : oui, par RT-10 | Remonté en RT-10 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque documentaire sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Les trois oracles du socle (check_html, render_page, run-oracles-design) ont jugé PASS du premier coup une page dont les couleurs passaient déjà par des jetons, après les six passes du lot 20261019a.

## Ordre recommandé

1. RT-10 : un seul retour sur ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-10** : V4 ne descend pas dans les groupes sans titre quand il compare un texte isolé à ses voisins. Classe à créer : clé `oracle-faux-negatif-sur-rendu`, libellé « Un oracle de rendu rend vert sur un défaut visible à l'œil sur sa propre capture : le PASS couvre un chevauchement que seule la relecture trouve ».
