# Retours forges — Produit-84 — 20261019c

- **Contexte** : autre — exécution hors run, le 19/10/2026, du prompt « Etude comparative fait-elle le job », qui refond une page HTML de données
- **Références ledger** : `forge\ledger.jsonl` seq 25 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 19/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre non interrogé dans ce lot : le pilot rattache à l'accueil. RT-11 entre comme neuf.

## digit-ai-forge-agents

Un nom de classe CSS ordinaire a fait échouer une page entière, sans que le message dise pourquoi.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-11 | mineur | générique | Page `output\06-etudes\Produit-84 - Etude comparative - Pages Supabase ou Azure - 20261019d.html`, cellules de tableau marquées `class="pv"` pour la partie verdict. `check_html.py` rend 95 échecs « L3 valeur sans légende », sans nommer la classe en cause. La raison n'apparaît qu'à la lecture du code : `pv` fait partie de `CL_VALEUR` (`kpi`, `badge`, `pastille`, `pv`, `chip-val`, `stat`), ligne 151. Classe renommée `pverdict`, PASS. Ledger seq 25 | Nommer dans le message L3 la classe qui fait de l'élément une « valeur » ; publier la liste des classes réservées dans la référence du socle |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Classe `pv` renommée `pverdict` dans la page | Corrigé sur place, `check_html.py` rejoué à PASS | généralisable : oui, par RT-11 | Remonté en RT-11 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque documentaire sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

V16 de `render_page.py` a relevé des étiquettes de couleur trop proches (écart de 6,5 sur l'échelle Delta-E), que la lecture d'une capture aurait pu laisser passer.

## Ordre recommandé

1. RT-11 : un seul retour sur ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-11** : aucune règle ne demande qu'un contrôle nomme le marqueur qui l'a déclenché. Classe à créer : clé `oracle-declencheur-non-nomme`, famille `page-html-socle`, libellé « Un contrôle échoue sur un marqueur réservé sans le nommer : l'auteur lit le code de l'oracle pour comprendre ».
