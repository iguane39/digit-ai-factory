# Retours forges — factory-digit-ai-fr — 20261115s

- **Contexte** : run `forge-digit-ai-fr-20261114a`, construction du socle de la version 2 du site sous `/v2` par un agent `constructeur`, du 15/11/2026 à 10:27 au 15/11/2026 à 11:46.
- **Références ledger** : forge/ledger.jsonl seq 328, 330, 331, 332, 333.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le constructeur du socle de la version 2 a livré ses 9 items, avec 254 tests au vert et le site actuel inchangé. En route, il a relevé 5 frictions de forge : une variable d'environnement héritée qui casse la recette, des contrôles de rendu qui jugent une animation en mouvement, et des règles d'oracle qui se contredisent. Chacune a coûté un arbitrage à la main.

---

## Les forges concernées

Ce chapitre porte 5 retours, RP-64 à RP-68, un par friction.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-64 | **mineur** | générique | **la session de l'agent herite FORGE_ROOT=C:/dev/digit-ai-factory/.claude/worktrees, dossier sans catalogue : la recette du produit tombe en 102 erreurs de fixture (FileNotFoundError catalogue.jsonl) avant toute modification** Destinataire : `digit-ai-factory`. Preuve : uv run pytest -q au commit 168735e : 4 failed, 16 passed, 102 errors ; FORGE_ROOT=c:/dev : 122 passed. | voir le rapport du constructeur |
| RP-65 | **mineur** | générique | **render_page V4 juge les chevauchements des scenes empilees d'une animation SVG (montrees une a une par opacite) : 34-35 constats bloquants par largeur sur la page de la forge des tests, tous internes au dessin clip-05 ; l'exemption svgFigure ne vaut que pour un SVG sans <text>** Destinataire : `digit-ai-page-html`. Preuve : rendu/normal/v2_outils_forge-tests-clair.json : v4_overlap 35 (390) et 34 (1440), tous g.c5-* ou formes du dessin. | voir le rapport du constructeur |
| RP-66 | **mineur** | générique | **render_page V2 et V9 mesurent des elements en cours d'animation d'entree ou de fondu (opacite proche de 0) : contraste 1,01:1 d'une encre sombre sur papier clair (libelle du dessin), sceau-mini a 1,06:1 (couleur dominante = papier) ; l'outil n'emule pas prefers-reduced-motion ni n'attend la fin des animations** Destinataire : `digit-ai-page-html`. Preuve : v2_outils_forge-tests-clair.json : v2_contrast text.c5-lib ratio 1.01:1 fill oklch(0.245 0.02 55) sur rgb(247,243,235) ; tout-visible/v2_outils_forge-audit-clair.json : v9 svg.sceau-mini 1.06:1. | voir le rapport du constructeur |
| RP-67 | **mineur** | générique | **oracle-motion R9 refuse tout jeton de duree > 300 ms, quel que soit son usage, alors que R4 ne borne que les transitions d'interface et que le brief du run autorise --duration-reveal jusqu'a 640 ms ; au studio, R9 etait SANS OBJET faute de feuille de jetons liee a la page jugee** Destinataire : `digit-ai-forge-design`. Preuve : run-oracles-design.mjs --tokens static/v2/tokens.css --origine : R9 majeur sur --duration-reveal (480 ms) et --duration-tampon (560 ms) ; v-run-b-final.json : R9 SANS OBJET. | voir le rapport du constructeur |
| RP-68 | **mineur** | générique | **oracle-conformite-projet R-26 rend SANS_OBJET sur MODELE-DONNEES.md parce que la phrase d'instruction du gabarit (« remplacer le corps par « sans objet — aucune persistance » ») contient la formule d'exemption ; les 4 tables ne sont pas jugees** Destinataire : `digit-ai-factory`. Preuve : node oracles/oracle-conformite-projet.mjs C:/dev/wt/v2-socle --regles R-26 : SANS_OBJET (exemption explicite) ; generer-modele-donnees.mjs ecrit aussi « (sans objet) ». | voir le rapport du constructeur |

## La règle qui aurait évité le retour

- RP-64 : classe à créer `environnement-agent-herite` — une session d'agent hérite d'une variable d'environnement qui pointe vers un dossier sans la ressource attendue.
- RP-65 : classe à créer `oracle-faux-positif-animation` — un contrôle de rendu juge un état transitoire ou les scènes empilées d'une animation comme un défaut de page.
- RP-66 : classe à créer `oracle-faux-positif-animation` — un contrôle de rendu juge un état transitoire ou les scènes empilées d'une animation comme un défaut de page.
- RP-67 : classe à créer `regles-d-oracle-en-conflit` — deux règles d'un même oracle se contredisent, ou une règle contredit le brief du run.
- RP-68 : classe à créer `exemption-lue-dans-la-consigne-du-gabarit` — un contrôle lit la formule d'exemption dans la phrase d'instruction d'un gabarit non remplacé et rend SANS_OBJET à tort.

## Remarques restées au produit

- 3 écarts restent au produit, consignés au journal : la dette de style de code de `app/contenu.py` et `tests/test_forge.py`, le clic de lecture vidéo sans tête dans Edge, et `docs/projet/ACCES-TEST.md`. Généralisable : non, ils sont propres à ce produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
