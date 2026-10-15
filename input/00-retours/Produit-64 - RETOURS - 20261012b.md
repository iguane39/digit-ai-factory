# Lot de retours — Produit-64 → digit-ai-forge-agents (digit-ai-page-html) — 2026-10-12, indice b

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-forge-agents`, skill
`digit-ai-page-html` (`scripts/check_html.py`, règle L12 et une règle à créer) · **Origine** : retour
du porteur du 12/10/2026 sur la page « Comparatif des pipelines », indice `20261012b` : « Pour chaque
ligne de la comparaison, fournis également les actions à mettre en oeuvre pour remédiation. Utilise
des puces pour la lisibilité des écarts et actions. Aurait dû être vu par la Factory. »

Ce lot porte **2 retours**, mesurés sur la page fautive et sur sa correction. Il fait suite au lot
`Produit-64 - RETOURS - 20261012a` (RT-31, infobulles) remis le même jour sur la même page.

- **Contexte** : synthèse comparative des pipelines du guide développeur, d'IA Essentials et de
  Cockpit IA, générée par un script de session, jugée par les quatre familles d'oracles du socle
  avant chaque remise. Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-12** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-forge-agents (`digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-58 | majeur | générique | **Un tableau d'écarts dont aucune ligne ne dit quoi faire passe tous les oracles.** Mesuré le 12/10/2026 sur `output/old/03-Syntheses/Client-A - Comparatif des pipelines - Guide, IA Essentials, Cockpit IA - 20261012b.html` : `check_html.py` PASS sur 43 règles (empreinte `319a59adaf68`), `render_page.py` PASS, `run-oracles-design.mjs` PASS. Le tableau `#t-comparaison` porte deux colonnes de statut (Conforme, Au-delà, Partiel, Écart, Non mesuré). **21 lignes sur 26** y portent au moins un « Écart » ou un « Partiel », et **aucune** ne porte d'action ni de lien vers une action : les remèdes vivaient dans un autre tableau, `#t-modifs`, sans renvoi ligne à ligne. Le lecteur devait rapprocher les deux à la main. Aucune règle du socle ne relie une valeur d'écart à un remède : L3 juge la légende des statuts, L10 l'exemple de lecture, L27 la définition des colonnes, rien ne juge ce que la ligne demande de faire. Correction faite chez ce produit : indice `20261012c`, colonne « Remédiation » en puces par cible, chaque action liée à sa modification (`#mod-nn`), « aucune action » écrit avec son motif quand le point est tenu ; mesure : 26 lignes sur 26 avec remédiation, 31 modifications sur 31 atteintes depuis la comparaison. | Une règle de complétude : dans un tableau qui porte une colonne de statut dont une valeur se déclare défavorable (vocabulaire déclaré par la page, `data-statut-defavorable`, ou liste du socle : Écart, Partiel, Non conforme, KO, FAIL), chaque ligne défavorable porte une cellule d'action ou un lien interne vers une action, sinon FAIL. Une ligne favorable dit « aucune action » plutôt que rien. Fixtures : rouge (21 lignes en écart sans action), verte (même tableau avec colonne Remédiation), verte (renvoi `#action-nn` par ligne). |
| RT-33 | moyen | générique | **Une cellule qui énumère plusieurs faits en prose, séparés par des points-virgules, passe L12.** Même page, même mesure : **25 cellules de constat sur 52** enchaînent 2 faits ou plus par « ; » (exemple PC-07 : « aucun contrôle ; et 9 commits servis en production ne sont jamais passés par env/dev ni env/uat »). Le porteur a demandé des puces. L12 ne voit rien, pour deux raisons mesurées dans `check_html.py` : elle ne vise que les énumérations `clé — valeur`, et elle ne se déclenche qu'au-delà de trois éléments ; aucune cellule n'en a trois. Correction faite chez ce produit : constats et actions en listes à puces dans la cellule (`ul.cellule`), découpés sur le point-virgule hors balise. | Étendre L12 aux cellules de tableau : à partir de deux segments séparés par « ; » (espace insécable comprise) dans une cellule d'une colonne de texte, avertissement, avec le geste « une liste à puces par fait ». Garder le seuil de quatre pour la prose courante, où le point-virgule reste une ponctuation. Fixtures : cellule rouge à deux faits, cellule verte en liste. |

**Portée** : générique — tout livrable de type comparatif, audit, revue ou matrice d'écarts rendu par
le socle y est exposé.

## Rattachement — sans objet

Registre interrogé le 12/10/2026 (`todo/TODO.jsonl`, termes « remédiation », « action corrective »,
« tableau », « écart », « comparatif ») : aucun item ne vise une page HTML. `TF-1234` et `TF-1235`
portent sur le plan d'amélioration joint à un audit de forge-audit, pas sur la règle d'une page.
`TF-1350` porte sur L19, sans rapport.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le générateur séparait les écarts (chapitre 4) et les remèdes (chapitre 5) sans relier les lignes | table `REMEDES` alignée sur la comparaison, avec une assertion de longueur ; contrôle de session « chaque MOD est atteinte depuis la comparaison » | oui | remonté : RT-58 |
| Cinq actions décrites dans la comparaison n'avaient pas de repère au tableau des modifications | ajoutées en MOD-22 à MOD-26 | non | rien de généralisable : défaut de rédaction de cette page, rendu visible par la correction de RT-58 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la page est générée par un
script de session, sur les jetons de la charte Client-A et les composants embarqués du socle
(`table-filters.js`, `table-filters.css`, `find-in-page.js`, parité vérifiée par
`embarquer-composants.mjs --constat`).

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : aucun appel à une plateforme n'a été fait pour cette
correction.

## Documents mûrs

Aucun document mûr nouveau sur ce lot. Relevé `LOT-MURS` du 12/10/2026
(`node forge/retours/oracle-lot.mjs --murs .`) : les mêmes documents d'`output/` à 5 versions datées
ou plus qu'au lot `Produit-64 - RETOURS - 20261001c`.

## Confirmations positives

- Les quatre familles d'oracles rendent sur l'indice `20261012c` les mêmes verdicts qu'au `20261012b` :
  l'ajout d'une huitième colonne en listes n'a créé ni débordement, ni chevauchement, ni rognage, aux
  six largeurs et dans les cinq états de la matrice.
- Le repli en cartes du socle tient une cellule à liste imbriquée sans réglage supplémentaire.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-58** — aucune classe existante ne convient. Clé proposée `ecart-sans-remede-par-ligne`, famille
  `page-html-socle`, libellé « Un tableau déclare des écarts par ligne (colonne de statut défavorable)
  sans dire, ligne à ligne, l'action qui les lève : les remèdes vivent ailleurs ou nulle part, et
  aucune règle de forme ne relie une valeur d'écart à une action ».
- **RT-33** — la classe qui convient est la famille de L12, élargie. Clé proposée
  `enumeration-en-prose-sous-le-seuil`, famille `page-html-socle`, libellé « Une énumération de faits
  enchaînés par des points-virgules dans une cellule échappe à la règle des énumérations, bornée aux
  paires clé — valeur et à plus de trois éléments ».

## Ordre recommandé

1. RT-58 — c'est le défaut que le porteur a vu en premier : un comparatif sans remède ne sert pas à
   décider.
2. RT-33 — un avertissement et deux fixtures.

## Note de réception du pilot (14/10/2026)

Renuméroté RT-32 → RT-58 à la réception : RT-32 était déjà défini par le lot 20261012a du même produit (LOT-IDS), et RT-57 était le dernier numéro pris (lot 20261013g).
