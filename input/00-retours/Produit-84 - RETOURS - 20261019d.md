# Retours forges — Produit-84 — 20261019d

- **Contexte** : autre — exécution hors run, le 19/10/2026, de la refonte de l'étude comparative Cloudflare + Supabase ou Azure, une page HTML de données
- **Références ledger** : `forge\ledger.jsonl` seq 27, 28 et 29 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 19/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre non interrogé dans ce lot : le pilot rattache à l'accueil. RT-12, RT-13 et RT-14 entrent comme neufs.

## digit-ai-forge-agents

L'utilisateur a vu un panneau de filtre transparent, que tous les oracles du socle avaient jugé conforme.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-12 | majeur | générique | Copie témoin de `output\06-etudes\Produit-84 - Etude comparative - Pages Supabase ou Azure - 20261019e.html`, sans les jetons `--surface`, `--r-sm`, `--sans` et `--muted` (8 déclarations retirées). `render_page.py --widths 1920 --etats-ouverts` déplie le premier panneau et rend `Verdict : PASS`. Une sonde Playwright sur la même copie mesure un fond `rgba(0, 0, 0, 0)` sur les 5 panneaux. L'utilisateur a vu ce défaut sur la version livrée. Ledger seq 27 | En état ouvert, mesurer le fond calculé de chaque panneau déplié et le premier élément au-dessus de lui (`elementFromPoint` sur une grille de points) ; un fond transparent ou un panneau recouvert est BLOQUANT |
| RT-13 | majeur | générique | `table-filters.css` lit `--surface`, `--blue`, `--muted`, `--r-sm` et `--sans` sans valeur de repli. Seul son commentaire d'en-tête le dit. Sur la page 20261019d, quatre de ces jetons manquaient. `embarquer-composants.mjs --constat` a rendu « 2 copie(s) à la parité de leur source » et `check_html.py` PASS. Ledger seq 28 | Donner une valeur de repli à chaque `var()` du composant, ou faire vérifier par `--constat` que la page hôte déclare chaque jeton consommé, dans les deux thèmes |
| RT-14 | mineur | générique | Le repli en cartes prescrit par `references/composants.md` masque `thead` (`display: none`), donc les boutons de filtre. Sonde à 390 px sur les tableaux `t-comp` et `t-lex` : les 5 `.tf-btn` ont une boîte de 0 × 0. Seul le champ de recherche reste utilisable, et `render_page.py` à 390 px rend PASS sans le signaler. Ledger seq 29 | En repli cartes, sortir les filtres de colonne au-dessus du tableau, ou déclarer dans le socle que la recherche les remplace à cette largeur |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Version d livrée sans relecture à l'aveugle par un lecteur neuf | 6 relectures à l'aveugle par des agents neufs sur la version e. Points graves par passe : 3, 0, 1, 3, 1, chacun recompté à la source puis corrigé. Le dernier corrigé : l'écart de coût de 96 € tenait à la taille de la base Azure retenue | non : la règle existe déjà dans la mémoire du produit | Corrigé sur place |
| Filtres livrés sans test de l'état ouvert | sonde de fond et de recouvrement jouée sur chaque panneau, en clair et en sombre | oui, par RT-12 | Remonté en RT-12 |
| Libellé court de chapitre « Ce », tronqué au premier mot par le constructeur de la page | table de libellés courts écrite à la main | non | Corrigé sur place |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque documentaire sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| « Etude comparative - Pages Supabase ou Azure » | 5 (20261019a à e) | reste au produit, parce que les 5 versions sont les reprises d'une même étude d'après les retours de l'utilisateur dans la journée du 19/10 (forme du tableau, lisibilité, couleurs, coûts, filtres), et non une forme qui reviendrait d'un document à l'autre |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Les relectures à l'aveugle par un agent neuf ont recalculé tous les totaux de l'encart des coûts, sans écart, et ont relevé deux contradictions graves que les oracles ne pouvaient pas voir : un coût absent d'un total, et une condition de prix manquante.

## Ordre recommandé

1. RT-12 : le défaut est passé devant l'utilisateur.
2. RT-13 : corriger le composant à la source supprime la cause.
3. RT-14.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-12** : aucune règle ne demande de juger le fond d'un panneau déplié. Classe à créer : clé `etat-ouvert-non-mesure`, famille `page-html-socle`, libellé « Un état déplié est rendu mais pas mesuré : un panneau transparent ou recouvert passe ».
- **RT-13** : aucune règle ne demande qu'un composant embarqué déclare et vérifie ses jetons. Classe à créer : clé `composant-jetons-non-verifies`, famille `page-html-socle`, libellé « Un composant consomme des jetons que l'hôte ne déclare pas, sans repli ni alerte ».
- **RT-14** : aucune règle ne relie le repli en cartes aux filtres de colonne. Classe à créer : clé `repli-cartes-filtres-masques`, famille `page-html-socle`, libellé « Le repli en cartes masque les en-têtes, et avec eux les filtres de colonne ».
