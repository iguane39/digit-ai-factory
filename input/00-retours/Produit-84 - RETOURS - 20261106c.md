# Retours forges — Produit-84 — 20261106c

- **Contexte** : le 06/11/2026, le porteur demande un schéma des agents lancés après sa question sur la sécurité par défaut dans la Factory. Le schéma est rendu au canevas « flux temporel » du skill `client-a-schemas`.
- **Références ledger** : `forge\ledger.jsonl` seq 238.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-06
- **Complétude** : 2 entrées `type: retour` écrites depuis le lot 20261106b (seq 236 et 238), relues le 06/11/2026 à 11:00 dans `forge\ledger.jsonl`. La seq 238 va au sidecar. La seq 236 appartient à la session `1a69e60e`, encore ouverte, qui la remet dans son propre lot.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le rendu brut** : la page instancie le squelette `template-multi-bandes.html` du skill, sans retouche de style. `check_html.py` du skill passe.
- **La critique d'implémentation** : `run-oracles-design --rendu` rend 5 oracles en échec, dont 81 bloquants de jetons et 453 de rendu.
- **La correction** : 2 passes de post-traitement ramènent la page à PASS, sans changer son rendu. 10 oracles sont verts, 9 sans objet.

## client-a-schemas (skill de poste) et forge-design — gabarits du skill face aux oracles du socle

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-54 | majeur | générique | **Le gabarit du skill `client-a-schemas`, instancié tel quel, échoue à la critique d'implémentation de la forge design.** (1) `oracle-tokens` : 81 bloquants T1, des couleurs en dur dans les classes `svg-*`. (2) `render_page` : 453 bloquants, dont 413 V4, des cadres `svg-frame` qui contiennent leurs nœuds par construction. (3) `oracle-slop` : 10 constats, dont DM Sans non déclarée comme police de marque et `#fff`. (4) `oracle-motion` : une transition sans `prefers-reduced-motion`. (5) V23 : `.page` bridée à 1 400 px, soit 73 % d'une fenêtre de 1 920 px. Mesuré le 06/11/2026 sur `output\03-prompts\Produit-84 - Schema - Agents de la boucle L99 Securite par defaut - 20261106c.html`. Ledger seq 238. | Mettre les gabarits `assets\template-*.html` au socle : couleurs, polices et espacements par jetons `:root` ; `data-overlap-ok` par paire sur les `svg-frame` ; largeur `clamp(75vw, 1680px, 92vw)` ; `data-police-de-marque` sur `<html>` ; réduction du mouvement. Ajouter au flux du skill l'étape `run-oracles-design --rendu`. Règle qui aurait évité le retour : aucune ; le skill ne nomme pas la critique d'implémentation. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- La page du produit sortait du gabarit en échec ; elle est corrigée dans le tour et passe ses oracles. Généralisable : oui, par le gabarit, d'où RT-54.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot : l'écart est dans les gabarits du skill de schémas, voir RT-54.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : l'écart est dans un gabarit de skill.

## Confirmations positives

- L'exemption V4 par paire déclarée a gardé le jugement nœud contre nœud : 0 croisement de flèche et 0 débordement de texte, mesurés à 1 920 et 390 px.

## Ordre recommandé

1. RT-54 : seul retour du lot ; chaque schéma Client-A rendu par ce skill reprend les mêmes échecs.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-54 : aucune ; le skill `client-a-schemas` ne fait pas passer ses pages par `run-oracles-design`. Classe proposée : `gabarit-skill-rouge-aux-oracles-du-socle` (famille `page-html-socle`).
