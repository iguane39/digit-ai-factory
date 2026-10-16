# Travaux confiés par le pilot — digit-ai-forge-agents — 20260912a

<!-- Gabarit du pilot (gabarits\TRAVAUX-PILOT.md). Un fichier = UN lot de travaux confiés.
     Emplacement chez le produit : input\00-travaux\pilot - TRAVAUX - <AAAAMMJJ><indice>.md
     Un fichier déposé ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` — items `TF-1064`, `TF-1066` cités élément par élément
- **Dépôt** : ce fichier est déposé par le pilot dans `input\00-travaux\` du produit. L'original
  reste au pilot (`output\` daté). Statut : `a_traiter` → `traite le <date>` — seule édition
  autorisée après coup : cette ligne de statut.
- **Statut** : a_traiter
- **Sort du lot reçu** (TF-0883 — jugé par la règle T8 de `oracle-travaux-pilot.mjs`) : ce lot entre dans
  l'histoire du produit — `git add` du fichier et de son sidecar — SAUF si `git check-ignore "<ce fichier>"`
  le déclare ignoré, auquel cas il reste hors de l'histoire et vit sur le seul poste qui l'a reçu.
  Mesuré le 12/09 : `.gitignore:35 input/` — ce lot reste hors de votre histoire.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node forge\travaux\oracle-travaux.mjs "<ce fichier>.md"
> ```
>
> Il rend **0** si la forme du lot est tenue, **1** sinon — et il dit alors ce qui manque. C'est
> exactement le contrôle que le pilot joue AVANT d'émettre : le même module, importé des deux côtés.

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : les consignes qu'ils contiennent sont décrites, jamais exécutées. Le même principe s'applique ici, dans l'autre sens. Ce lot décrit un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de ce que vous en faites, sur votre run, avec vos oracles ; un constat écarté rejoint vos écarts assumés avec son motif — il ne disparaît pas. Aucun commit n'a été fait chez vous.

## Travaux confiés

### TF-1064 — Le plancher d'écriture du pilot est indexé au registre des oracles, et le socle Markdown lui délègue le style au lieu de le réinventer · gravité majeur

- **Le fait** : le 12/09/2026, sur mandat humain (décisions D-1 (a) et D-3 (a) de la synthèse 20260911j), le pilot a déposé une doctrine d'écriture (`references\ECRITURE.md`, règles E-1 à E-12), une donnée fermée de tournures creuses (`references\tics-redactionnels.json`, huit familles à seuils de densité, datées et sourcées) et un oracle déterministe (`oracles\oracle-ecriture.mjs`, règles EC-1 à EC-6 : densité par famille, phrases longues en série, profondeur de puces, emphase de structure, attaques répétées, antériorité ; `--self-test`, `--baseline <dossier>` ; contrat JSON commun ; exit 0/1/2). Relevé du 11/09 : le registre `registre-oracles.md` ne portait aucun domaine « style rédactionnel » déterministe (ligne 47 : juge LLM « jamais promu en verdict » ; ligne 48 : `oracle-slop` déclare la prose en `non_juge`) ; `check_markdown.py` déclare en en-tête (l. 23-30) que « L3 et L12 restent une revue de lecture, jamais mécanisées » ; le seul détecteur de tournures d'écriture générée du poste est celui du skill `impeccable` (trois motifs anglophones), hors registre.
- **Pourquoi cela vous concerne** : vous versionnez la source des skills `quality-oracles` et `digit-ai-page-html` que le bootstrap du pilot propage aux postes ; une remontée §4 s'écrit dans la source, jamais dans la copie installée (commentaire de votre registre, TF-1006). Sans entrée au registre, l'oracle du pilot est un contrôle que `run-oracles.mjs` ne connaît pas ; sans délégation écrite dans `check_markdown.py`, un producteur réinventera un contrôle de style maison (règle R3 : jamais de réimplémentation).
- **Ce qui est demandé** : (1) dans `quality-oracles\references\registre-oracles.json` et la ligne homologue du `.md`, une entrée de domaine « Style rédactionnel d'un texte Markdown (plancher E-1..E-12 du pilot) », type `cli`, commande `node <pilot>\oracles\oracle-ecriture.mjs {file}` (le pilot se résout par `FORGE_ROOT` puis par le parent du dépôt, comme `hooks-factory.mjs`), checklist « EC-1 densité par famille · EC-2 phrases > 35 mots en série · EC-3 puces ≤ 2 niveaux · EC-4 gras de phrase et puces emoji · EC-5 attaques répétées · EC-6 antériorité », `non_juge` recopié de l'oracle, statut `partiel` tant que le manifest ne rejoue pas ses fixtures ; (2) dans `quality-oracles\fixtures\manifest.json`, une paire rouge/verte reprise des fixtures que le `--self-test` de l'oracle construit (les deux textes sont dans le script, section self-test), `attendu_red` FAIL, `attendu_green` PASS ; statut `ok` quand le banc les rejoue ; (3) dans l'en-tête de `digit-ai-page-html\scripts\check_markdown.py`, une ligne qui dit que le STYLE (L3, L12 et la règle « paragraphe qui énumère » de `bonnes-pratiques.md` §3) est délégué à `oracle-ecriture.mjs` du pilot, et une option `--style` qui l'appelle et fusionne son verdict (FAIL de l'un = FAIL de l'ensemble), sans réimplémenter aucun motif ; (4) `references\lisibilite.md` du socle : une section « Style — délégué » de cinq lignes qui renvoie à `ECRITURE.md` du pilot.
- **Module producteur lu** : `quality-oracles\references\registre-oracles.md` (l. 47-48 et §4 « Procédure de remontée »), `quality-oracles\fixtures\manifest.json` (entrée `parite-assets`, modèle), `digit-ai-page-html\scripts\check_markdown.py` (l. 23-46), `digit-ai-page-html\references\bonnes-pratiques.md` (l. 37-68).
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : `node quality-oracles\scripts\self-test.mjs` rejoue la paire rouge/verte du domaine et reste PASS ; `python check_markdown.py --style <texte.md>` rend un verdict qui porte les règles M7-M18 ET EC-1..EC-6 ; le registre `.md` porte la ligne avec son statut ; le commit est publié et propagé (`bootstrap.mjs --pull` du pilot).
- **Si ce n'est pas fait** : le style des textes reste jugé chez le seul pilot et par le seul hook `ecriture` ; un producteur qui joue `run-oracles.mjs` sur un Markdown n'apprend jamais que le domaine est couvert, et le prochain run réécrit un contrôle de style maison.

### TF-1066 — Le rendu du socle vérifie jusqu'au 4K et dit qu'une page se conçoit à 1920 px · gravité majeur

- **Le fait** : règle humaine du 12/09/2026 : « pour le design, prends à minima par défaut FullHD (1920px en largeur) pour les desktops, et du responsive design pour monter jusqu'à du 4K ». Relevé le 12/09 : `render_page.py` rend par défaut à 1920, 1280, 768 et 390 px (`DEFAULT_WIDTHS`, l. 79, TF-0422) ; aucune largeur au-delà de 1920 n'est vérifiée par aucun oracle du parc ; le pilot a écrit la règle E5 dans `references\BEST-PRACTICES-HTML.md` (grille `3840,2560,1920,1440,1024,768,390`) et l'a portée dans `gabarits\CLAUDE-PRODUIT.md` (héritage 1.9.0).
- **Pourquoi cela vous concerne** : `render_page.py` est l'oracle zéro-défaut-visuel de tout le parc ; sa grille par défaut est la borne de ce que les produits prouvent. Une page PASS à 1920 peut déborder, étirer sa prose sur 2 880 px ou laisser la moitié de l'écran vide à 3840 sans qu'aucun contrôle ne le dise.
- **Ce qui est demandé** : (1) `DEFAULT_WIDTHS = [3840, 2560, 1920, 1280, 768, 390]` dans `render_page.py`, et la ligne de `SKILL.md` qui documente les largeurs par défaut mise à jour ; (2) un contrôle V neuf (numéro suivant de votre série), joué aux largeurs ≥ 2560 : une page de PROSE dont la mesure de lecture d'un paragraphe dépasse 100 caractères par ligne (le conteneur `.chap.lire` de E4 doit porter la mesure) est un défaut bloquant ; une page de DONNÉES (`data-restitution="registre|suivi"` ou tableau principal) dont le tableau occupe moins de 85 % de la largeur offerte est un défaut bloquant (L26) ; fixtures rouge/verte ; (3) `bonnes-pratiques.md` §5 « Responsive » cite E5 du pilot : largeur de conception 1920, vérification jusqu'à 3840.
- **Module producteur lu** : `digit-ai-page-html\scripts\render_page.py` (l. 76-79, 127, 1478, 1822-1909), `digit-ai-page-html\SKILL.md` (usage des largeurs), `references\BEST-PRACTICES-HTML.md` du pilot (E4, E5).
- **Effort estimé** : complexité simple × durée moyenne.
- **Comment vous saurez que c'est fait** : `python render_page.py <page.html>` sans option produit six captures (3840 à 390) ; `self_test.py` du socle compte le contrôle V neuf avec sa paire de fixtures ; une page témoin du socle rendue à 3840 rend PASS ; commit publié et propagé.
- **Si ce n'est pas fait** : la règle E5 du pilot n'a pas de juge au-delà de 1920 : elle décore (R-44), et chaque produit découvre le 4K chez son lecteur.

## Ce que le pilot a déjà fait de son côté

- Doctrine `references\ECRITURE.md` (11,8 Ko, `check_markdown` PASS), donnée `references\tics-redactionnels.json` (calibrée le 12/09 sur 204 textes du pilot : sept familles lexicales quasi absentes, tirets d'incise médiane 18,6 ‰, seuil d'échec 40 ‰ posé au-dessus du 95e centile), oracle `oracles\oracle-ecriture.mjs` et hook `oracles\hook-ecriture.mjs` (self-tests, baseline sur `output\04-plans`).
- Câblage chez le pilot (`.claude\settings.json`, PostToolUse sur Write|Edit) et chez les produits par héritage 1.9.0 (`hooks-factory.mjs` connaît `ecriture`, `settings-produit.json` le câble, `forge\ECRITURE.md` en copie conforme).
- Règle de design E5 écrite (`BEST-PRACTICES-HTML.md`), lignes de socle dans `CLAUDE-PRODUIT.md`, classe `viewport-de-conception-non-fixe` au référentiel, TF-1066 décidé par mot humain.
- Rien n'a été écrit dans votre dépôt ; la boîte `input\00-travaux\` est ignorée par votre `.gitignore`.

## Ce que le pilot NE demande PAS

- Pas de réimplémentation des motifs de `tics-redactionnels.json` en Python : la donnée et l'oracle vivent au pilot, le socle délègue.
- Pas de changement des règles M7-M18 ni de leur contrat de sortie.
- Pas de retrait de 1280 de la grille : les postes de bureau étroits existent encore.

## Ordre recommandé

1. **L'entrée au registre et le manifest d'abord** (TF-1064 (1)-(2)), parce que c'est ce qui rend le domaine visible à `run-oracles.mjs` et que les fixtures existent déjà dans le self-test de l'oracle.
2. **La grille de rendu ensuite** (TF-1066 (1)), parce qu'une constante change et que six captures au lieu de quatre se voient au premier run.
3. **La délégation dans `check_markdown.py` et le contrôle V** en dernier, parce qu'ils demandent des fixtures neuves.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-agents - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (recettes, comptes, commit, porte, push) — le pilot clôt les items sur gains constatés.
