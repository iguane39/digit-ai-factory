# Retours forges — Produit-03 — 20260929c

- **Contexte** : retour humain du 29/09/2026 sur la restitution affichée dans le chat de l'extension VS Code, capture d'écran à l'appui. Mot pour mot : « Il y a encore un défaut sur les textes des chapitres 0 & 1 qui s'affiche encore en colonne, sans prendre toute la ligne. Remonte à la Factory pour correction. »
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 29/09/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — la prose des restitutions est coupée à la main, et le chat l'affiche en colonne

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-50 | majeur | générique | **Le chat rend chaque saut de ligne de la source.** Une restitution dont les paragraphes de prose sont coupés à la main, vers 100 caractères, s'affiche dans le chat de l'extension VS Code en colonne étroite, là où un paragraphe écrit sur une seule ligne prend toute la largeur. Preuve, sur la restitution `20260929c` de ce produit : les coupures de la capture tombent exactement sur celles de la source, ligne 42 close sur « J'ai », ligne 43 sur « La », et ainsi de suite ; dans la même capture, les étapes de liste écrites sur une ligne occupent la largeur. **Mesure du 29/09** sur les restitutions dont le bloc 0 est titré, un paragraphe comptant comme coupé dès que sa prose court sur 2 lignes source consécutives hors liste, tableau, citation, titre et code : 41 sur 47 (87,2 %) dans `output\04-plans\` du pilot ; 3 sur 21 chez ce produit, les 3 du 29/09, les précédentes étant écrites sur une ligne. Le défaut vient du pilot : ses propres restitutions sont coupées, et `gabarits\RESTITUTION.md` (v2.31.0), lui-même coupé à la main, ne dit nulle part comment écrire un paragraphe. Aucune règle d'`oracle-synthese` ne le juge : les 3 restitutions du jour rendent `PASS` sur 53 règles | (1) Écrire dans `gabarits\RESTITUTION.md` que la prose des blocs et de l'introduction du guide s'écrit un paragraphe par ligne source, sans retour à la ligne manuel, avec la raison : le chat rend le saut de ligne simple. (2) Une règle d'`oracle-synthese` qui accuse tout paragraphe de prose courant sur plusieurs lignes source consécutives, listes, tableaux, citations et code exclus ; paire de recette : le bloc 0 de `20260929c` tel quel en `FAIL`, le même bloc sur une ligne en `PASS`. Taux d'accusation mesuré ci-contre, 87,2 % du corpus du pilot : la règle entre avertissante, comme la v2.5.0 le prescrit. (3) La reprendre dans le rappel du hook `Stop`, que l'agent lit au moment de réécrire |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour : ni `gabarits\RESTITUTION.md`, ni `oracle-synthese`, ni le rappel du hook ne disent comment écrire un paragraphe de prose, et le texte du gabarit, coupé lui-même vers 100 caractères, sert de modèle à l'imitation. C'est le cas de la règle § 4 de `quality-oracles` (domaine sans oracle → en définir un) : l'oracle manquant est un contrôle de forme du rendu d'une restitution dans le chat, qui se joue sur la source seule.

La classe n'existe pas au référentiel. Elle est proposée dans la famille `restitution-forme` : clé `restitution-prose-coupee-en-dur`, libellé « La prose d'une restitution est coupée à la main en lignes courtes : le chat rend chaque saut de ligne, et le paragraphe s'affiche en colonne étroite au lieu d'occuper la largeur ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les blocs 0 et 1 des 3 restitutions du 29/09 sont coupés à la main | la restitution suivante écrit chaque paragraphe sur une ligne, et la mesure le vérifie avant affichage | oui | remonté ci-dessus en `RA-50` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le document en cause est une restitution, qui suit `gabarits\RESTITUTION.md` (version 2.31.0, du 28/09) ; ce qui a gêné le lecteur est remonté en `RA-50`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris cinq fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20260929b`.

## Confirmations positives

- Les éléments de liste et les cellules de tableau écrits sur une ligne s'affichent sur toute la largeur, dans la même capture : la forme correcte existe déjà dans les restitutions, il suffit de l'étendre aux paragraphes.

## Ordre recommandé

1. `RA-50` (1) et (3) d'abord : une phrase au gabarit et au rappel du hook suffit à changer l'écriture dès la session suivante ; (2) suit, avec la paire de recette.
