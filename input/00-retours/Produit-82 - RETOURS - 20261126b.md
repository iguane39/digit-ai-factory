# Retours forges — Produit-82 — 20261126b

- **Contexte** : portage de la maquette Tenon aux chartes Fit-Retail et Digit-AI, sous /Fit-Retail2 et /Digit-AI. La critique d'implémentation a été jouée sur six pages servies, derrière une connexion.
- **Références ledger** : `forge\ledger.jsonl` seq 375, 376
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-26

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-design, orchestrateur run-oracles-design

Le retour porte sur une page servie enregistrée avec des chemins d'actifs relatifs.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-57 | mineur | générique | Le 26/11/2026, `run-oracles-design --rendu --instance --etat-connexion` sur une page du portail enregistrée par Playwright, dont les feuilles sont en `/actifs/…`, a rendu 4 oracles en FAIL bloquant : oracle-tokens T0 « aucun token déclaré », oracle-bascule B-T2 à B-T4, oracle-surcouche SC1 et SC2, render_page V1 à 390 px. Aucun constat ne disait que les feuilles et scripts n'avaient pas été intégrés. Les mêmes pages réécrites en `http://127.0.0.1:8095/actifs/…` rendent 15/15 PASS. La convention a été trouvée en lisant l'artefact d'une étape antérieure du produit. Preuve : `forge\ledger.jsonl` seq 375, `forge\etapes\version-20261126-tenon-chartes\critique-*.json`. | Avec `--instance`, résoudre les chemins relatifs contre l'origine de l'instance. À défaut, un constat unique « N feuilles ou scripts non intégrés : chemins relatifs sans origine » remplace les FAIL qui en découlent. |

## digit-ai-forge-design et digit-ai-factory, source de la charte HTML de Digit-AI

Le retour porte sur un dossier de marque resté en retard sur la charte du socle.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-58 | majeur | générique | Le 26/11/2026, la direction /Digit-AI a d'abord été construite sur `digit-ai-marketing\donnees\marque\tokens.css`, support « pages et documents HTML », relevé du 11/09 : Roboto pour les titres, DM Sans pour le corps. Le socle `digit-ai-page-html` (`references\charte-et-tokens.md`, C1 et C2) dit Montserrat et Inter depuis le 23/09 (D-5 (a), D-11 (a)), Roboto et DM Sans en replis. Aucun oracle n'a vu l'écart : la critique d'implémentation rendait 15/15 PASS sur la charte périmée. La mise à jour du skill, vue en cours de session, l'a révélé. Preuve : `forge\ledger.jsonl` seq 376. | Régénérer `tokens.tokens.json` et `tokens.css` du support HTML depuis la charte du socle. Ajouter à la recette de quality-oracles une comparaison des polices du dossier de marque avec C1 et C2 du socle. |

## Remarques restées au produit

- Sur la direction Digit-AI, oracle-slop relevait DM Sans (S3) et le blanc pur #FFFFFF (S4), deux conflits que le dossier de marque déclarait déjà. Corrigé sur place : `data-police-de-marque="DM Sans, Roboto"` sur la page et blanc teinté #FEFEFF (généralisable : non, propre à la charte).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `render_page.py --etat-session` a jugé 12 rendus servis derrière une connexion, à 7 largeurs, sans aucune préparation propre au produit.
- La critique d'implémentation a trouvé les deux écarts de charte de Digit-AI avant la remise.

## Ordre recommandé

1. RT-58 : tout produit qui lit le dossier de marque pour une page HTML part sur des polices périmées, sans qu'aucun oracle le signale.
2. RT-57 : le faux FAIL coûte un aller-retour à chaque produit qui critique une page servie.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. Pour RT-57, la règle est qu'un oracle qui n'a pas pu charger une ressource le dit, au lieu de juger la page comme si elle n'en avait pas. Pour RT-58, une décision de charte se propage à toutes ses sources déclarées, dont le dossier de marque, et un contrôle compare ces sources entre elles. Classes proposées : `ressource-non-integree-jugee-absente` pour RT-57, `source-de-charte-en-retard-sur-la-decision` pour RT-58.
