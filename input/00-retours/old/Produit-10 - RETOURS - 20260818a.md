# Retours forges — Produit-10 — 20260818a

- **Contexte** : rattrapage complet des routes forge sur les livrables Client-C des 17 et
  18 août — ancrage des chiffres, lineages, assertions, jugement HTML, audit de tests,
  conformité socle. Trois livrables du 18/08 sont passés de « jamais jugés » à PASS.
- **Références ledger** : `forge\ledger.jsonl` seq 38 à 46
- **Remise au pilot** : copier ce fichier et son sidecar dans
  `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-18

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260814b` (remis et ingéré). La séquence d'ids continue
en `RA-13`.

---

## forge-agents (`digit-ai-forge-agents`) — socle `digit-ai-page-html`

Les deux oracles de rendu ont trouvé 146 défauts réels sur un livrable qui n'avait jamais été
jugé. Ils ont fait leur travail. Ce qu'ils n'ont pas su faire, c'est le dire quand ils ne
pouvaient plus juger.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-13 | majeur | **`render_page.py` n'a aucun garde-fou pour une page très haute : il devient muet au lieu de se déclarer incompétent.** Le livrable `output\Produit-10 - Rapport mapping Bronze alx vers Silver Client-C - 20260818a.html` (271 Ko, 45 tableaux) mesure **151 615 px** de haut à 390 px de large, **135 272** à 768 et **43 409** à 1280 — les tableaux passent en cartes sous 768, ce que le socle prescrit lui-même. `Page.screenshot` porte un délai **fixe de 30 s** (aucune option de ligne de commande), `--scale` n'accepte qu'un entier (`--scale 0.4` → « invalid int value »), et il n'existe ni capture par tronçons ni repli. Résultat mesuré : deux exécutions ont abouti en début de session (1280 et 1920, PASS, 0 bloquant), **aucune ensuite**, y compris après arrêt des processus Chromium. L'outil termine sur une trace Playwright brute (`TimeoutError: Page.screenshot: Timeout 30000ms exceeded`), pas sur un verdict. Un livrable **conforme** devient donc non jugeable passé une certaine longueur, sans que rien ne le dise. | Trois pistes cumulables : (a) `--timeout` en ligne de commande ; (b) `--scale` en flottant, ou capture par tronçons recollés ; (c) surtout — **un verdict `NON_MESURE` explicite** quand la capture échoue, portant les familles jugeables sans image (V1 et L2-largeur se lisent dans le DOM) et nommant celles qui restent non jugées (V2, V3, V4, V7). Aujourd'hui l'appelant doit écrire lui-même la mesure de substitution : ce projet l'a fait (`scripts\mesurer_debordement.py`, 45 lignes), et ce travail est intégralement réutilisable donc intégralement dupliqué au prochain run. |
| RA-14 | majeur | **Un verdict archivé ne dit pas sous quel jeu de règles il a été rendu.** La règle **A3** (« `<meta charset>` déclaré au 2470e octet — la spécification exige les 1024 premiers ») met en échec le livrable `output\Produit-10 - Rapport mapping Bronze al2 vers Silver Client-A - 20260814c.html`, **déclaré PASS le 14/08** et rejoué à l'identique le 18 : le fichier n'a pas changé, la règle est postérieure. Elle met aussi en échec le **gabarit du socle lui-même** (`Produit-10 - Gabarit Rapport de donnees HTML - 20260813a.html`), dont le `<head>` s'ouvre sur un long commentaire d'emploi. Conséquence : un journal d'oracles archivé (R-32) affirme un PASS qui n'est plus vrai, et rien dans le journal ne permet de le savoir sans rejouer. | Horodater le jeu de règles dans la sortie de `check_html.py` : un champ `version_regles` (date ou empreinte du fichier de règles) dans le JSON, que R-32 recopie au journal. Un journal plus ancien que la règle courante devient alors visiblement périmé, au lieu d'être faussement rassurant. Accessoirement : le gabarit livré par le socle devrait passer ses propres règles — ici il ne les passait plus. |
| RA-11 | mineur | **Reconstat, avec sa cause : l'avertissement « script bloquant dans `<head>` » avait une cause réelle et corrigeable.** Signalé au lot `20260814b` comme un faux positif permanent contre le script que S-G1 exige. Fait nouveau : après avoir placé `<meta charset>` et `<meta name="viewport">` en **toute première position** du `<head>` (correctif A3), l'avertissement **a disparu** des cinq livrables. Le bruit dénoncé le 14/08 n'était donc pas inévitable — il signalait une vraie mauvaise pratique d'ordre dans le `<head>`. | Requalifier la candidature : plutôt qu'exempter l'initialisation de thème, **préciser le message** — « charset et viewport doivent précéder tout script » — et l'illustrer dans le pattern S-G1, qui montre aujourd'hui le script sans dire ce qui doit venir avant. |

### Ce que le socle a rattrapé, et qu'il faut dire

Six familles de règles ont trouvé des défauts réels sur une chaîne de transposition jamais
jugée. Elles ne sont pas des faux positifs et n'appellent aucune candidature — elles sont
listées ici parce qu'un lot qui ne remonte que des frictions donne une image fausse du socle.

| Règle | Ce qu'elle a trouvé | Verdict |
|---|---|---|
| L4 | 10 tableaux de 8 à 39 lignes sans filtre ni tri, parce que l'émetteur les exemptait dès que la 1re colonne était un compteur | défaut réel, corrigé |
| L3 | 118 valeurs `n/N` sans barème lié, 6 jetons codés affichés nus, 1 colonne de classement sans formule | défaut réel, corrigé |
| L10 / L7 | 9 chapitres de données sans exemple de lecture, 1 chapeau de moins de 40 caractères | défaut réel, corrigé |
| L11 | le littéral `NULL` rendu en prose 12 fois | défaut réel, corrigé par citation `<code>` |
| L1 | requêtes SQL abrégées lues comme du texte tronqué — l'exemption `data-ellipse-ok` existait et couvrait exactement ce cas | règle juste, échappement adéquat |
| V1 | à 390 px, les blocs SQL élargissaient le **document entier** à 861 px | défaut réel, corrigé au gabarit |

L'arbitrage **TF-0231** (un barème porté par un ancêtre vaut pour les valeurs qu'il contient)
a permis de lier **45 tableaux avec 45 barèmes** au lieu de plusieurs centaines de cellules :
l'ergonomie annoncée tient à l'échelle. **RA-4** rend le même service sur le `<th>` d'une
colonne de classement.

---

## factory (`digit-ai-factory`, ex `digit-ai-forge-pilot`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-15 | majeur | **Le renommage du dépôt casse en silence les chemins écrits dans les CLAUDE.md des projets consommateurs.** Le `CLAUDE.md` de ce projet portait `node <FORGE_ROOT>\digit-ai-forge-pilot\oracles\oracle-conformite-projet.mjs .`, écrit le 13/08. Le dépôt a été renommé `digit-ai-factory` le 17/08 (commit `a113351`, « le dépôt s'appelle digit-ai-factory »). Le chemin n'existe plus ; la commande de la route forge échoue en « fichier introuvable ». Aucun alias, aucun shim, aucune note de migration : il a fallu lister `C:\dev` et reconnaître le dépôt à son contenu, en écartant `digit-ai-forge-pilot_old` et `digit-ai-forge-pilot_vide` qui subsistent tous deux et **contiennent un `oracles\oracle-conformite-projet.mjs` d'apparence valide** — celui de `_old` date du 17/08 et aurait rendu un verdict plausible sous un jeu de règles périmé. | (a) Une note de migration dans le dépôt renommé, listant les chemins que les projets consommateurs écrivent en dur ; (b) mieux : que les CLAUDE.md générés désignent le pilot par une **variable** (`<PILOT_ROOT>`) résolue à la reprise, comme `<FORGE_ROOT>` l'est déjà — le renommage d'un dépôt ne devrait pas être un événement pour ses consommateurs ; (c) au minimum, que les copies `_old` et `_vide` soient déplacées hors du chemin de recherche, ou marquées d'un fichier `PERIME` que la phase 0 sache lire. |

### Ce que le socle a rattrapé, côté conformité

`oracle-conformite-projet` a trouvé **7 FAIL** sur des livrables qui allaient être remis :

- **R-25** — deux types de livrables improvisés (« Analyse », « Bilan ») absents du registre
  d'organization. La relecture humaine ne les avait pas vus ; le message nomme les 32 types
  admis, ce qui a rendu la correction immédiate (« Étude », « Revue »).
- **R-32** — les trois livrables HTML du 18/08 n'avaient **aucun** journal d'oracles. Le gate
  aval a fait exactement ce pour quoi il existe.

---

## Ce que ce lot ne remonte pas

- **La duplication des émetteurs HTML de ce projet** (trois scripts quasi identiques dérivés
  l'un de l'autre) est un défaut **du projet**, pas du socle. Elle est consignée au ledger
  seq 46 comme dette à consolider, et n'a pas sa place dans un lot de retours.
- **L'absence de tests sur les 20 scripts Python du projet**, signalée par l'audit
  `forge_tests` (verdict PARTIEL). Même raison : c'est le projet qui doit trancher s'il teste
  ses scripts de production de livrable, l'audit a raison de le dire.

---

## Contrôle de complétude

| Contrôle | Résultat |
|---|---|
| Champs obligatoires du sidecar (titre, contenu, forges_cibles_initiales, score, preuve_du_cout, schema, demandeur, source, date_demande) | 4/4 candidatures complètes |
| Forge nommée dans le titre du lot | oui — `Produit-10 - RETOURS - 20260818a` |
| Aucun id frappé dans le sidecar (les ids sont attribués à l'ingestion) | vérifié |
| Chaque retour porte un fait observé avec sa preuve chiffrée | vérifié |
| Chaque retour porte une proposition, jamais une plainte seule | vérifié |
