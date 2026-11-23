# Retours forges — Produit-81 — 20261123c

- **Contexte** : support de présentation Design Authority de Produit-81 (indice e du 23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 44 ; seq 45 ;` (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-31 (majeur) — Des pastilles de liste décalées sous leur texte, qu'aucun oracle ne mesure

**Le fait.** Le 23/11/2026, le porteur relève un décalage entre les puces et leur texte sur plusieurs diapositives du support Design Authority de Produit-81, quatre indices (a à d) après le premier rendu. Cause : l'aide de rendu posait la pastille à un décalage fixe (y + 0,08 po) quel que soit le corps du texte ; son centre tombait 0,056 po (4 pt) sous le milieu de la première ligne, sur 56 pastilles réparties sur 7 diapositives. Aucun des oracles joués ne mesure cette géométrie : `oracle-da-pptx` (format, débordement estimé, pied de page), `oracle-document-imprime` (débordement estimé) et la charte PPTX sémantique. La relecture des captures pleine page ne l'a pas vu non plus : un écart de 4 pt ne se voit qu'agrandi.

**Le coût, prouvé.** Un défaut visible présenté quatre fois comme conforme, relevé par le porteur. Un indice de plus (e).

**La règle qui aurait évité le retour.** Une pastille de liste se positionne d'après le corps de la première ligne de son texte (centre = haut du texte + marge haute + 0,55 × corps en Arial), jamais à un décalage fixe ; un oracle exécuté mesure l'écart pastille-ligne sur le fichier produit.

**Juge proposé.** `forge/etapes/da/oracle-puces-pptx.mjs` du produit, écrit dans le tour : pour chaque petite ellipse sans texte, il retrouve la zone de texte à sa droite et compare le centre de la pastille au milieu des capitales de la première ligne (tolérance 0,02 po ; zones ancrées au milieu ou en bas : non jugées, dites). Cas rouge : indice d, FAIL, 56 constats d'environ 4 pt. Cas vert : indice e, PASS, 56 mesurées. À reprendre au registre des oracles, domaine « Support imprimé ou projeté », et son équivalent HTML (marqueur de liste dessiné à la main).

## RT-32 (mineur) — Trois familles de codes au même préfixe dans un même support

**Le fait.** Le 23/11/2026, le porteur relève que les codes de domaine de l'audit (D01, D03, D04, et les actions REM-D03-01…) se confondent avec les décisions soumises à la séance (D1 à D4). Mesure faite ensuite : le code d'environnement D1 (« inscription D1 », « copie en D1 ») apparaissait aussi une vingtaine de fois, homonyme exact de la décision D1.

**Le coût, prouvé.** Une lecture ambiguë relevée par le porteur, corrigée dans le même indice que RT-31, sans coût séparé.

**La règle qui aurait évité le retour.** Dans un livrable, un préfixe de code court désigne une seule famille d'objets ; une autre famille s'écrit par son nom ou sous un préfixe distinct. **Clé proposée** : `codes-homonymes-dans-un-livrable`, famille `gabarit-document`, libellé « Un livrable agrège des référentiels qui ont chacun leur codification courte et laisse deux familles sous le même préfixe : le lecteur prend un domaine ou un environnement pour une décision ».

**Juge proposé.** Cas rouge d'un oracle de livrable de synthèse : inventaire des codes courts (lettre et chiffres) du texte affiché, groupés par préfixe ; un préfixe porté par des codes de longueurs ou de sources différentes (D1 et D01) est signalé.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes). RT-31 se rattache à la classe existante `oracle-faux-negatif-sur-rendu` (« un oracle de rendu rend vert sur un défaut visible à l'œil ») : ici le vert venait de ce qu'aucun oracle ne mesurait la géométrie. RT-32 : aucune classe proche ; clé neuve en `classe-a-creer`.

## Remarques restées au produit

- Diapositive 8 : première ligne du bandeau « Ouvert à ce jour » raccourcie pour tenir sur une ligne ; le refus mesuré le 13/11 reste en annexe C — généralisable : non (mise en page propre à ce support).

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
