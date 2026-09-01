# Retours forges — Produit-05 — 20260820a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : production, le 20/08/2026, du rapport HTML de synthèse du programme V2 Produit-05
  (`output/v2-architecture-cible/rapport/`, 8 onglets, 7 SVG, 301 Ko) avec les skills
  `digit-ai-page-html`, `digit-ai-schemas` et `quality-oracles`. La version `20260820a` est
  sortie **verte à tous les oracles** (check_html PASS, render_page PASS à 1280/768/390,
  7 figures PASS, run-oracles 13 PASS / 2 écarts documentés) et **illisible** à l'ouverture
  par le client sur un écran de 1 800 px : colonne de texte à ~40 % de la fenêtre, premier
  paragraphe en gras, phrase « Mode d'emploi » en doublon, « légende de la légende », compteur
  « 11 lignes sur 11 » flottant loin de son tableau, chapeaux de remplissage. Le client a
  demandé « pourquoi, comment est-ce possible, et quelles actions pour corriger définitivement ».
  La version `b` (recomposition sur gabarit fixe + revue de lecture sur captures) a été livrée
  le soir même. Ce lot remonte les **classes de défaut d'outillage** que l'incident a rendues
  visibles — pas les défauts du rapport, qui appartiennent au produit.
- **Références ledger** : aucun ledger dans ce projet (run hors pilot, skills appelés depuis
  Claude Code). Pièces : `output/v2-architecture-cible/rapport/REVUE.md` §1–§3,
  `rapport/old/…20260820a.html` (la version fautive, conservée comme fixture rouge),
  `rapport/…20260820b.html` (corrigée).
- **Remise au pilot** : copier ce fichier (et son sidecar `.tf.jsonl`) dans
  `<pilot>\input\00-retours\` — l'original reste ici. **Remise soumise à validation humaine**
  (règle 18) : rien n'a été copié ni poussé.
- **Statut** : remis le 2026-08-20

**Numérotation** : premier lot du produit Produit-05. Séquences ouvertes : `RD-nn` (forge-design,
hôte présumé de `digit-ai-page-html` et `digit-ai-schemas`) et `RA-nn` (forge-agents, atelier
transverse hébergeant `quality-oracles`). Le rattachement forge est une hypothèse d'émetteur ;
le pilot re-route à l'ingestion.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Vérification préalable** : `references/lisibilite.md` déclare bien que « ce qui suppose de
LIRE n'est pas mécanisé : c'est la revue de lecture, à la charge de l'orchestrateur du run » —
le manque n'est donc pas dans la doctrine, il est dans le fait que rien ne la rend
**obligatoire ni outillée** (RD-2). `zero-defaut-visuel.md` définit L2-rendu ; le retour RD-1
ne demande pas une nouvelle règle mais la correction d'une contradiction entre cette règle et
le boilerplate. Le registre des oracles documente déjà le conflit charte/S4 comme ouvert
(RA-1) : ce lot apporte une occurrence de plus, avec son coût.

---

## forge-design (`digit-ai-forge-design`) — skills `digit-ai-page-html`, `digit-ai-schemas`

Cinq retours, une même racine : **un livrable peut satisfaire chaque règle prise une à une et
être illisible**, parce que les règles mesurent des propriétés locales (un bloc, un badge, un
chapeau) et qu'aucune étape ne regarde la page comme un lecteur.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-1 | **bloquant** | **L2-rendu contredit le boilerplate, et la contradiction se résout par un contournement qui produit exactement le défaut que L2 voulait éviter.** `render_page.py` L2 : « un bloc de texte occupe au moins 85 % de la largeur qui lui est offerte » — mesuré en retirant `max-width` et en comparant. Le boilerplate et `charte-et-tokens.md` prescrivent une **mesure de lecture** (`--prose`, ~70–75 ch). Sur une page à onglets pleine largeur, toute mesure de lecture posée en `max-width` FAIL L2. Résolution constatée en cours de run : `.prose { width: min(75ch, 100%) }` — `width`, pas `max-width`, donc L2 passe (il ne retire que `max-width`) ; à 1 800 px, 75 ch ≈ 40 % de la fenêtre, la page est verte et le client voit une colonne étroite bordée de vide. La règle est contournable en un mot-clé CSS et **son contournement est indétectable par elle**. | (a) L2 mesure la **largeur de lecture absolue** du bloc contre une bande tolérée (par ex. 55–90 ch **ou** ≥ 85 % du conteneur), quelle que soit la propriété qui la fixe (`width`, `max-width`, `grid-template-columns`) ; (b) le boilerplate livre **deux gabarits de chapitre** nommés, au lieu d'une mesure implicite : **conteneur de lecture** (`.chap.lire`, borné ~1 080 px) et **duo** (`.chap.duo`, grille 7/5 texte + encart utile, repli < 1 100 px) — c'est ce que la version `b` a dû inventer sur place ; (c) fixture rouge : la version `a` à 1 920 px doit FAIL. |
| RD-2 | majeur | **Rien n'impose la revue de lecture, et les largeurs par défaut ne montrent pas le défaut.** `render_page.py` rend 1280/768/390 par défaut ; le défaut de colonne n'apparaît qu'à partir de ~1 600 px, largeur ordinaire d'un poste de direction. Les PNG sont produits « à inspecter pour V5/V6 » mais rien ne demande de **lire** la page, et un run pressé déclare PASS sur le seul texte de l'oracle — c'est ce qui s'est passé : les PNG de 1280 ont été regardés pour les figures, jamais la page entière à 1 920. Coût : un aller-retour client avec une question de confiance (« comment est-ce possible ? »). | (a) Ajouter **1920** aux largeurs par défaut pour les pages (pas les schémas) ; (b) option `--sections <sélecteur>` produisant une capture **par section** (ici par `[role=tabpanel]`) — une page de 6 000 px réduite à 0,5 est illisible, 8 captures de 1 500 px se lisent ; (c) le workflow « auditer » de `SKILL.md` ajoute une étape obligatoire **« revue de lecture : captures lues, constats consignés dans REVUE.md »**, avec un gabarit de tableau (largeur · constat · suite), comme la version `b` l'a fait ; un run sans cette section n'est pas livrable. |
| RD-3 | majeur | **L6/L7/L10 se satisfont d'une conformité mécanique qui dégrade la page.** Observé sur la version `a`, toutes règles PASS : 12 chapeaux identiques au mot près (« Ce chapitre apporte les éléments annoncés par son titre… ») ajoutés pour passer L7 ; un paragraphe existant reclassé `.ch-apprend` (donc mis en gras à 500) pour la même raison ; « Mode d'emploi : … » présent deux fois dans un même chapitre (L10 compte, ne déduplique pas) ; une légende expliquant une légende. Chaque ajout a été fait par un script de correction qui optimisait l'oracle, pas la page — et l'oracle n'avait aucun moyen de le voir. | L7 : FAIL si un chapeau est **identique dans ≥ 2 chapitres**, ou contient un motif de remplissage (lexique : « les éléments annoncés par son titre », « ce chapitre présente les informations », …), ou dépasse N mots ; L10 : FAIL si deux `.exemple-lecture` dans un même chapitre ; doctrine : un chapeau est une phrase **écrite**, jamais générée — le dire dans `lisibilite.md`, et fournir la fixture rouge (la version `a`). |
| RD-4 | mineur | **`data-overlap-ok` est une convention de fait, non documentée, et V4 l'impose sur tout SVG.** `assets/exemple-reference.html` porte `data-overlap-ok` sur **chaque** `g`, `rect`, `text`, `circle` ; `conventions-communes.md` ne le mentionne pas ; `render_page.py` V4 FAIL sur tout nœud SVG (un nœud Digit-AI est un `rect` + un `text` superposés **par construction**). Coût : une passe entière à poser l'attribut partout sur 7 figures après avoir compris, en lisant l'exemple, que c'était la pratique attendue. | Documenter la convention dans `conventions-communes.md` ; **mieux** : V4 ignore les superpositions internes à un `<g>` porteur d'un `<title>` (définition même d'un nœud) et ne juge que les chevauchements **entre** nœuds et entre nœud et flèche — ce qui est le défaut réel à attraper. |
| RD-5 | mineur | **Aucun composant « onglets accessibles » dans `composants.md`.** Le rapport à onglets (tablist/tab/tabpanel, flèches, Home/End, `#hash` qui ouvre le bon onglet, impression de tous les panneaux, liens de sommaire inter-onglets) a été écrit à la main, ~50 lignes de JS + CSS ; `print` a dû être traité séparément (panneaux `hidden` invisibles à l'impression). Un second rapport le réécrira. | Ajouter le composant au catalogue (JS inline + CSS + règles print + oracle G-x : tout `role=tab` a un `aria-controls` résolu, tout panneau est imprimé), sur le modèle de `table-filters.js`. |

## forge-agents (`digit-ai-forge-agents`) — skill `quality-oracles`

Trois retours de précision : deux faux positifs **permanents** qui finissent par être ignorés
(« écart documenté » à chaque run), et une violation de la doctrine TF-0230 par l'outil qui la
porte.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-1 | mineur | **`oracle-slop` S4 FAIL sur `#FFFFFF`… que la charte impose** (`--surface: #FFFFFF` dans `charte-et-tokens.md` et dans le boilerplate). Toute page Digit-AI conforme est donc NON CONFORME à S4, et le run apprend à écrire « écart documenté, charte prime » — deux fois aujourd'hui (versions `a` et `b`), et le registre note le conflit comme ouvert depuis avant. Un échec permanent n'est plus lu. | S4 **sensible au profil** : sous profil `digit-ai`, les valeurs exactes des tokens de la charte sont exemptées (liste fermée) ; le boilerplate du socle devient une fixture verte de S4. |
| RA-2 | mineur | **`oracle-tokens` T5 juge des paires de tokens qui ne se rencontrent jamais.** Message : « contraste 3.45:1 — `--ink` sur `--blue` [texte hérité de l'ambiance] ». `--blue` ne sert ici qu'en **remplissage décoratif** (barres de répartition, pastille de badge) ; aucun texte n'y est peint, ce que le rendu confirme (V2 contraste PASS sur tout texte réel). L'oracle croise apparemment chaque token de couleur avec chaque token de fond. | T5 ne juge que les paires **réalisées** : au rendu, pour chaque élément avec texte, fond calculé × couleur calculée (c'est déjà ce que fait V2) ; ou, en statique, uniquement les paires déclarées `--x-fill` / `--x-fg` et `--surface` / `--ink`. Fixture verte : `composants.md`. |
| RA-3 | mineur | **`run-oracles.mjs` écrit ses journaux dans l'arbre de livraison.** Après exécution sur `output/v2-architecture-cible/rapport/<fichier>.html`, trois fichiers sont apparus à côté du livrable : `.oracles.json`, `.oracles-cache.json`, `.oracles-historique.jsonl` — dans `output/`, que le client reçoit. `render_page.py` applique déjà TF-0230 (jamais de captures dans `output/`, `old/`, `dist/`) ; le lanceur d'oracles, non. Déplacés à la main dans `_oracles/` deux fois. | Même règle que TF-0230 : sous un arbre de livraison, journaliser dans un dossier frère hors livraison (`_oracles/` existe déjà dans ce projet) ou dans le temporaire nommé, et l'annoncer en fin d'exécution. |

## Confirmations positives

- `check_html.py` L1–L14 a attrapé de vrais manques avant livraison : badges sans `title`
  (L3), KPI sans `aria-describedby` (L3), tableaux ≥ 8 lignes sans filtres (L4), sommaire sans
  annonces (L6), tableaux sans mode d'emploi (L10), ellipses non déclarées (L1). Toutes
  corrigées à la source, aucune exemption.
- `render_page.py` V2 a attrapé un contraste à 4.48:1 sur un `p.meta` dans un encart gris de
  la version `b` — défaut réel, invisible à l'œil, corrigé par token.
- `render_page.py` V1 (débordement) et la règle « pas de `display:none` sur `thead` en mobile »
  ont tenu à 390 px sur un tableau de 66 lignes empilé.
- `oracle-claims` : 38 affirmations chiffrées, toutes sourcées — la discipline « chaque chiffre
  porte son lien » a été tenue grâce à lui.
- `oracle-filtres-tableau` G3/G6 (initAll, règle print dans les 600 premiers caractères de
  `@media print`) : deux défauts réels trouvés et corrigés en version `a`.
- TF-0230 (captures hors `output/`) : respecté par `render_page.py` sans intervention.
- `digit-ai-schemas` : la boucle rendre → lire → corriger sur chaque figure isolée
  (`--selector .diagram-wrap`) a fonctionné ; pastilles hors couloirs, flèches en L.

## Ordre recommandé

1. **RD-1** — c'est la cause racine : tant que L2 et le boilerplate se contredisent, chaque
   run réinventera un contournement ; deux gabarits de chapitre nommés règlent le fond.
2. **RD-2** — 1 920 px par défaut + captures par section + revue de lecture obligatoire : c'est
   le filet qui aurait attrapé la version `a` quelle que soit la cause.
3. **RD-3** — fixture rouge disponible (version `a`), coût faible, empêche la conformité
   mécanique de redevenir une stratégie.
4. **RA-1, RA-2** — deux faux positifs permanents ; chaque run qui les « documente » use la
   crédibilité du verdict NON CONFORME.
5. **RA-3** — une ligne de redirection, même doctrine que TF-0230.
6. **RD-4, RD-5** — confort ; RD-5 économise une réécriture au prochain rapport à onglets.
