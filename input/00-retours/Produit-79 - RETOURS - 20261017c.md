# Retours forges — Produit-79 — 20261017c

- **Contexte** : autre — refonte du tableau de bord d'acquisition et de réservations après le refus humain du 17/10/2026 (« Le dashboard est à revoir complètement »), exécution du prompt final 20261017w, étape 8
- **Références ledger** : `forge\ledger.jsonl` seq 265, 269, 270, 271, 272 (retours consignés à la revue du prompt), 278 et 279 (retours constatés à l'exécution), 280 (livrable)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 17/10/2026

---

## pilot (`digit-ai-factory`)

Le produit a dû inventer de zéro la forme d'un tableau de bord de pilotage : aucune famille du catalogue ne la porte.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-15 — tableau de bord de pilotage | majeur | générique | Catalogue des gabarits documentaires relu le 17/10/2026 : familles `rapport-de-donnees`, `dashboard-tests`, `tableau-bord-post-remediation`, `suivi-benefices` ; aucune ne porte entonnoir, filtre de période recalculant toute la page, comparaison à la même période un an plus tôt, structure par la cascade ISTO ni objectifs à échéance calculés. Le premier tableau de bord du produit (`Produit-79 - Dashboard - Acquisition et réservations - 20261017s.html`) a été refusé par l'exploitant sur ces sept points ; la refonte 20261017y a demandé une extraction mensuelle, une application de recalcul de 400 lignes et un test d'interactions écrits pour l'occasion (ledger, entrées 270 et 280). | Règle qui aurait évité le retour : aucune famille ne la porte. Proposition : une famille « tableau de bord de pilotage » au catalogue, structurée par ISTO, avec squelette, instance et oracles : commandes globales qui recalculent tout, bloc de lecture à 5 rubriques par graphique, total et part par tableau, objectifs avec formule. **RP-15 : clé proposée `gabarit-tableau-de-bord-analytique-absent`.** |

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Le socle `digit-ai-page-html` a laissé passer un tableau de bord sans valeur pour son lecteur, n'a rien dit de graphiques dessinés à la main, et son composant de barres empilées échoue à son propre rendu.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-11 — valeur informationnelle | majeur | générique | Page 20261017s : `check_html.py` PASS (47 règles), `oracle-filtres-tableau` PASS, `render_page.py` PASS aux 7 largeurs et dans les deux thèmes, `run-oracles-design` 6 sur 7 ; refusée le 17/10/2026 par l'exploitant : pas de filtre de période, pas de choix de l'objet, aucun graphique interprété (ni cause, ni fiabilité, ni verdict avec référence, ni action), tableaux sans total ni part, SWOT et recommandations sans détail (ledger, entrée 269). | Règle qui aurait évité le retour : aucune ; L7 et L10 exigent un chapeau et un exemple de lecture, jamais l'interprétation de chaque graphique. Proposition : pour une page de données de pilotage, un bloc de lecture par graphique et par tableau (fait, cause, fiabilité, verdict avec référence nommée, action), une ligne de total et une colonne de part par tableau, jugés par `check_html.py`. **RA-11 : clé proposée `tableau-de-bord-sans-valeur-informationnelle`.** |
| RA-12 — graphiques à la main | majeur | générique | Page 20261017s : 5 graphiques SVG écrits à la main par le générateur, aucun avec `tuiles-indicateurs.js`, `barres-empilees.js` ni `kpi-filter.js` ; aucun contrôle du socle ni de forge-design ne le signale (ledger, entrée 271). La refonte 20261017y emploie les tuiles, les filtres et la recherche du socle. | Règle qui aurait évité le retour : composants.md §14 et §15 les déclarent obligatoires (🔴), sans contrôle. Proposition : un contrôle qui exige le composant du socle pour une forme qu'il couvre (rangée de chiffres clés, barres empilées), ou une exemption motivée. **RA-12 : clé proposée `graphique-maison-hors-composant-du-socle`.** |
| RA-13 — barres empilées | majeur | générique | Page 20261017y, version intermédiaire avec 3 graphiques `barres-empilees.js` de 12 catégories : `render_page.py` rend V4 « text.graphe-axe « 0 » × text.graphe-axe « oct. 2025 » » à toutes les largeurs (14 constats), et des totaux de colonne qui se chevauchent dès que l'unité est un mot (« 9 158 sessions » × « 9 984 sessions », 6 largeurs). Totaux retirés, puis graphiques passés sur Apache ECharts 5.5.1 embarqué (ledger, entrée 278). | Règle qui aurait évité le retour : les fixtures du composant n'ont que 2 à 5 catégories. Proposition : l'étiquette 0 de l'axe vertical décalée de la première étiquette horizontale, des totaux masqués ou passés en infobulle quand ils ne tiennent pas, et une fixture de 12 catégories au banc. |
| RA-14 — graphique en canvas | majeur | générique | Page 20261017y, version intermédiaire : jetons `--cat-1` à `--cat-6` absents, barres ECharts presque blanches et légende sans pastille ; `render_page.py` PASS en clair et en sombre aux 7 largeurs, états ouverts compris. Défaut vu à la relecture des captures, corrigé dans le tour (ledger, entrée 279). | Règle qui aurait évité le retour : aucune ; le périmètre de non-mesure de `render_page.py` ne dit pas qu'un canvas n'est pas jugé. Proposition : le déclarer au périmètre de non-mesure, et mesurer le contraste des pixels de marque d'un canvas contre son fond. |

## digit-ai-forge-design (`digit-ai-forge-design`)

L'oracle de lieux communs juge la police de titres d'un client comme un réflexe d'auteur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-2 — police de marque | mineur | générique | `oracle-slop` S3 rend FAIL sur « police réflexe 'Cormorant Garamond' » pour les pages 20261017s et 20261017y ; c'est la police de titres de la charte du domaine (main.css du site du client), employée par les pages HTML du produit depuis le 08/10/2026 ; aucune voie de déclaration d'une police de marque du client n'a été trouvée dans la sortie de `run-oracles-design.mjs` (ledger, entrées 265 et 272). | Règle qui aurait évité le retour : l'exemption existe pour la charte Digit-AI, pas pour celle d'un client. Proposition : une police portée par la charte déclarée du client (dossier de marque ou `tokens.css` du produit) se déclare et sort du constat. |

## Rattachement

Registre interrogé le 17/10/2026 : `node -e "…"` sur `todo\TODO.jsonl`, filtre des entrées dont le titre ou le contenu répond à `/(barres-empil|canvas|oracle-slop|police r.flexe|Cormorant|tableau de bord analytique|valeur informationnelle|graphique.{0,20}main|SVG .{0,10}main)/i`, sans borne → 17 ligne(s) trouvée(s).
Items recoupés : TF-1053 (candidat, une page de données verte partout dont les cellules ne sont jamais comparées à leur source ; voisin de RA-11, qui porte sur l'interprétation et non sur la justesse), TF-1174 (candidat, page amputée qui passe les six oracles ; même famille que RA-11). Les 15 autres répondent au filtre par « oracle-slop » ou « canvas » sans recouper ces retours.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé ou constaté chez lui, et pourquoi cela ne remonte pas.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Coût par clic de référence écrit à la main (0,286 €) dans un texte de la page, alors que la donnée vaut 0,247 € | texte relié à la valeur calculée, page reconstruite, test 52/52 rejoué | non | erreur de rédaction de l'agent, corrigée dans le tour |
| Part française des clics de 2022–2023 écrite « 75 % à 90 % », données à 61 % à 93 % | recalculée depuis les données, deux textes corrigés | non | erreur de rédaction de l'agent, corrigée dans le tour |
| Entonnoir France qui rapportait des sessions à des clics (184,8 %) | étape des clics retirée, sessions françaises en point de départ | non | erreur de conception de l'agent, vue au premier essai dans Chromium |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le tableau de bord n'a pas de famille au catalogue (RP-15).

## Documents mûrs

Un document mûr : le tableau de bord `Produit-79 - Dashboard - Acquisition et réservations - 20261017y.html`. Verdict : reste au produit, parce que la famille qu'il instancierait n'existe pas encore au catalogue ; il est proposé comme instance de départ de RP-15 (commandes globales, bloc de lecture à 5 rubriques, totaux et parts, objectifs calculés, test d'interactions par recalcul indépendant de 52 contrôles).

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : les accès Google et Beds24 ont répondu sans refus.

## Confirmations positives

- Le composant de filtres du socle a tenu sur 14 tableaux re-rendus à chaque changement de période, par `api.rafraichir()`, sans perte de facette (TF-0769).
- `oracle-tokens` a rendu des corrections précises (couleur et police en dur), toutes tenues au deuxième passage.

## Ordre recommandé

1. RA-11 et RP-15 ensemble : ils définissent ce qu'un tableau de bord de pilotage doit dire, et la règle qui le vérifie.
2. RA-14 : un graphique invisible jugé conforme est le défaut le plus trompeur du lot.
3. RA-13, RA-12.
4. RD-2.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Chaque ligne nomme sa règle dans « Proposition esquissée ». Trois retours n'en trouvent aucune et proposent une classe : RP-15, clé `gabarit-tableau-de-bord-analytique-absent`, famille `gabarit-document`, libellé « Aucune famille du catalogue ne porte la forme d'un tableau de bord de pilotage » ; RA-11, clé `tableau-de-bord-sans-valeur-informationnelle`, famille `page-html-socle`, libellé « Un tableau de bord passe tous les oracles sans interpréter un seul de ses graphiques » ; RA-12, clé `graphique-maison-hors-composant-du-socle`, famille `page-html-socle`, libellé « Un générateur dessine ses graphiques à la main sans le composant du socle qui couvre la forme ».
