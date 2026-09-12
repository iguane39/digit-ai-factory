# Retours forges — digit-ai-forge-agents — 20260912a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260912a` (deux items, `TF-1064` et
  `TF-1066`), reçu dans `input\00-travaux\` de la forge et joué sur mandat humain du 12/09/2026
  (décision D-1 (b) de la synthèse 20260912a du pilot). L'ordre recommandé par le lot a été tenu :
  l'entrée au registre et le manifest d'abord, la grille de rendu ensuite, la délégation et le
  contrôle V en dernier. Le lot déposé porte désormais `traite le 2026-09-12` ; il reste hors de
  l'histoire de la forge (`.gitignore:35 input/`), comme le lot lui-même l'avait mesuré.
- **Références ledger** : aucune — `digit-ai-forge-agents` est une forge, pas un produit
  instancié : elle ne porte pas de `forge\ledger.jsonl` et son `ledger.jsonl` racine est un
  journal de PROMOTION de skills, dormant depuis le 23/07/2026 (seq 14). Aucun run n'y a été
  ouvert et rien n'y a été écrit. La preuve tient au commit local `a2cc83d` (aucun `git push` :
  le mandat l'interdit) et aux recettes rejouées citées ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-12

## Ce que le lot de travaux a produit

### TF-1064 — le plancher d'écriture du pilot est indexé, et le socle Markdown lui délègue le style

Les quatre parties demandées sont faites. Ce qui a demandé une décision est au (1) : **aucun
marqueur du manifest ne désignait le dépôt du pilot**. `{skilldir}` pointe le skill, `{skillsroot}`
la racine des skills, et une commande qui garde un marqueur non résolu ne tombe pas en erreur
franche — elle échoue au lancement, et `spawnSync` en échec se lit comme un `FAIL`. Sur une
fixture **rouge**, ce FAIL-là ressemble trait pour trait à la preuve attendue : le marqueur non
résolu serait devenu un **vert silencieux**. D'où un résolveur unique et un SKIP motivé.

| Ce qui est demandé | Ce qui a été fait | Preuve |
|---|---|---|
| (1) entrée de domaine au registre JSON et ligne homologue au `.md` | Domaine « Style rédactionnel d'un texte Markdown (plancher E-1..E-12 du pilot) », `type: cli`, `cmd: ["node", "{pilot}/oracles/oracle-ecriture.mjs", "{file}"]`, checklist EC-1..EC-6 telle que le lot la donne, `non_juge` **recopié de la sortie de l'oracle** (quatre lignes de `tics-redactionnels.json` + deux de l'oracle), `provenance`, statut `partiel` | `references\registre-oracles.json` v2.19.0 → **v2.20.0**, 56 → **57 oracles** · `references\registre-oracles.md` ligne 58, statut ⚙️ |
| `{pilot}` résolu, jamais deviné | `scripts\lib\pilot.mjs` : `FORGE_ROOT\digit-ai-factory`, sinon le dépôt **frère** `..\..\..\..\digit-ai-factory` du skill — l'ordre de `hooks-factory.mjs`. Une piste n'est retenue que si elle porte réellement `oracles\`. Pilot introuvable → **SKIP motivé qui NOMME les pistes**, jamais un PASS | `scripts\self-test.mjs` (résolution du script d'un oracle CLI + résolution des fixtures), `scripts\run-oracles.mjs` (`resolveCmd`, clé de cache) ; ligne verte du banc : `oracle délégué présent : oracle-ecriture.mjs` |
| (2) paire rouge/verte au manifest | `fixtures\ecriture-red.md` et `fixtures\ecriture-green.md` **extraites mécaniquement** des constantes `FIXTURE_ROUGE` / `FIXTURE_VERTE` du `--self-test` de l'oracle (littéral de gabarit évalué, pas retranscrit) : la paire du registre et celle de l'oracle jugent le **même contenu**, donc une dérive de l'un se voit chez l'autre. `attendu_red: ["FAIL"]`, `attendu_green: ["PASS"]`, et **cinq `attendu_messages_red`** réels | `fixtures\manifest.json` 53 → **54 fixtures** ; rouge : 693 mots de prose, **12 règles en FAIL** (8 familles EC-1, EC-2, EC-3, EC-4-gras, EC-4-emoji) ; verte : 304 mots, **PASS** malgré un bloc de code saturé de tournures interdites |
| (3) en-tête + option `--style` de `check_markdown.py` | En-tête : un paragraphe « LE STYLE EST DÉLÉGUÉ, PAS RÉIMPLÉMENTÉ » nomme L3, L12 et la règle « un paragraphe qui ÉNUMÈRE » (§3), et renvoie à l'oracle du pilot. `--style` résout le pilot (même règle que `{pilot}`), lance `node <pilot>\oracles\oracle-ecriture.mjs <fichier> --chemin-relatif <relatif>` et **fusionne** : FAIL de l'un = FAIL de l'ensemble. **Aucun motif n'est recopié** | `python check_markdown.py "…\references\ECRITURE.md" --style` → `Règles : M7, M10, M14, M18, EC-1, EC-2, EC-3, EC-4, EC-5, EC-6` · `Style : PASS — 1692 mots de prose jugés` · `Verdict : PASS`, exit 0. Sur la fixture rouge : `Style : FAIL`, 12 constats `[style]`, exit **1** |
| oracle injoignable | Dit **en clair** (`Style : SKIP — oracle de style INJOIGNABLE — pistes essayées : …`), porté au `non_juge` ET aux avertissements, verdict rendu sur les seules règles M. Jamais un PASS silencieux | mesuré en cours de run, avant correction de l'index de piste : la ligne SKIP nommait la piste fautive, c'est elle qui a servi au diagnostic |
| (4) section « Style — délégué » de `lisibilite.md` | Cinq lignes sous « Ce qui reste dehors » : ce que L3, L12 et §3 laissaient à la revue est jugé par `oracle-ecriture.mjs`, `--style` fusionne, aucun motif recopié, les seuils vivent dans la donnée du pilot | `references\lisibilite.md`, section `### Style — délégué` |

`--chemin-relatif` n'est pas passé au hasard : la liste d'antériorité du pilot est faite de chemins
**relatifs à une racine de dépôt** (`CLAUDE.md`, `gabarits/RESTITUTION.md`…). `check_markdown.py`
donne donc le chemin relatif au pilot quand le fichier y vit, sinon au dépôt git qui le porte —
un produit qui hérite d'un `CLAUDE.md` reçoit ainsi la même exemption que l'original, ce qui est
le comportement juste : c'est le **même** texte normatif antérieur à la doctrine.

### TF-1066 — la grille monte au 4K, et un contrôle y juge ce que 1920 taisait

Les trois parties demandées sont faites. Deux choses n'étaient pas prévisibles avant de mesurer : le **numéro** du contrôle neuf (V17 était déjà pris par la checklist canonique, d'où **V18**) et le **seuil** de sa première branche, qui entre en conflit avec le token de lecture du socle — c'est l'objet du retour RA-3 (retour de `digit-ai-forge-agents` n° 3) ci-dessous.

| Ce qui est demandé | Ce qui a été fait | Preuve |
|---|---|---|
| (1) `DEFAULT_WIDTHS` étendu | `DEFAULT_WIDTHS = [3840, 2560, 1920, 1280, 768, 390]`. **1280 conservé** — le lot l'exigeait, et c'est la largeur où le repli des tableaux se déclenche (`ROGNAGE_DONNEES_MIN_VIEWPORT`) | `scripts\render_page.py` l. 88 ; `python render_page.py <page>` sans option rend **six** captures |
| ligne d'usage et `SKILL.md` | Ligne d'usage du module, bloc `bash` du SKILL (« défaut : 3840, 2560, 1920, 1280, 768, 390 px »), paragraphe citant **E5** (conception à 1920, vérification jusqu'à 3840), et la ligne de revue de lecture | `scripts\render_page.py` (docstring), `SKILL.md` |
| (2) contrôle V neuf aux largeurs ≥ 2560 | **V18**, et non V17 : V17 est **déjà pris** par `conteneur_bride_donnees` dans `references\zero-defaut-visuel.md` (ligne 33) — la série de la checklist canonique va plus loin que celle des libellés de `render_page.py`. Deux branches : **(a)** prose dont la mesure de lecture dépasse **100 caractères par ligne** ; **(b)** tableau principal d'une page de données sous **85 %** de la largeur offerte | `render_page.py` : `MESURE_LARGE_JS`, familles `v18_prose_etiree` et `v18_tableau_etrique` (bloquantes), jouées **seulement** si `width >= 2560` ; ligne de la checklist `zero-defaut-visuel.md` |
| la mesure | `Range.selectNodeContents` + `getClientRects` : une boîte **par ligne réellement peinte**. `caractères / lignes` est donc un fait du rendu, pas une approximation `largeur / (0,5 × font-size)` qui dépend de la fonte servie. Conservatrice : la dernière ligne est partielle, le compte sous-estime la capacité | sonde du 12/09, même page à trois largeurs : `.chap.lire` 1080 px → **134** cpl (identique à 1920, 2560, 3840) ; colonne 820 px → **114** ; non bridée → **228** à 2560 et **342** à 3840 |
| fixtures rouge/verte | Quatre, deux paires, chacune à **une déclaration près** : `v18-prose-etiree.html` / `v18-prose-mesuree.html` (le chapitre de lecture), `v18-donnees-tableau-etrique.html` / `v18-donnees-tableau-plein.html` (le plafond en pixels nus). Chaque page porte **deux attentes** — celle de sa famille et **zéro** de l'autre : c'est ce qui prouve que les branches mesurent deux choses | mesuré à 2560 px : rouge prose **2 / 0** (FAIL), verte prose **0 / 0** (PASS), rouge données **0 / 1** (FAIL), verte données **0 / 0** (PASS) |
| `self_test.py` les compte | `run_rendu_large()`, branche à part jouée à **2560 px** : `CAS_RENDU` se joue à 1440, là où les deux défauts n'existent pas — quatre verts à 1440 n'auraient rien prouvé | **256/256** → **264/264** cas passés, exit 0 |
| (3) `bonnes-pratiques.md` §5 cite E5 | Première puce 🔴 de « Responsive & adaptation PDF » : viewport de conception 1920, vérification jusqu'à 3840, grille par défaut, et V18 nommée avec ses deux défauts | `references\bonnes-pratiques.md` §5 |

**V18 dit où elle a regardé.** Une grille jouée sans largeur ≥ 2560 publie au `non_juge` :
« V18 NON JOUÉE : aucune largeur >= 2560 px dans cette grille … ne pas lire ce silence comme une
page vérifiée jusqu'à 3840 px (règle E5) ». Un vert qui se lirait « la page tient au 4K » serait
faux, et c'est exactement la classe de défaut que ce lot corrige ailleurs.

## digit-ai-factory (`digit-ai-factory`)

Trois retours, tous nés de la mesure elle-même — aucun n'était visible avant d'avoir joué les
règles sur des artefacts réels. Ils portent les identifiants **RA-3** (retour de
`digit-ai-forge-agents` n° 3 : le conflit entre E4 et le plafond de E5), **RA-4** (n° 4 :
le déclenchement du domaine « style » laissé fermé) et **RA-5** (n° 5 : l'échec préexistant
du banc de `quality-oracles`) — la séquence RA continue celle du lot du 05/09/2026.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-3 | majeur | générique | **Le plafond de 100 caractères par ligne de TF-1066 et le token `.chap.lire` de E4 ne peuvent pas tenir ensemble.** Mesure du 12/09, `Range.getClientRects`, même page à trois largeurs : `.chap.lire { max-width: 1080px }` — le conteneur de lecture que le socle **prescrit** — rend **134 caractères par ligne** en 16 px, à 1920 comme à 2560 comme à 3840. Une colonne de 820 px en rend encore **114**. Appliqué à la lettre, le contrôle demandé condamnerait donc la forme que le gabarit prescrit, sur toute page conforme à E4, dès 2560 px. Parade posée pour ne pas livrer un oracle qui crie sur l'usage légitime : un paragraphe **tenu** par un conteneur de lecture déclaré (`.lire`, `[data-mesure-lecture]`) n'est pas bloqué, et sa mesure est **publiée en non mesurable** — l'écart est visible, jamais tu. Ce qui est bloqué est la prose qu'**aucun** conteneur ne tient : 228 cpl à 2560, 342 à 3840 | Arbitrer entre les deux textes et n'en garder qu'un : soit **resserrer `.chap.lire`** (720 px mesure 89 cpl — la fixture verte le prouve), soit **porter le plafond de E5 à 135**. Règle qui aurait évité le retour : aucune — E4 et E5 ont été écrites à onze jours d'intervalle sans qu'un contrôle ne confronte l'une à l'autre sur un artefact les appliquant toutes deux (classe `deux-regles-du-socle-inconciliables`) |
| RA-4 | majeur | générique | **Le domaine « style » est indexé sans déclencheur automatique, et c'est un écart assumé, pas un oubli.** L'entrée porte `ext: []` : `run-oracles.mjs` ne jugera aucun `.md` de lui-même. Motif écrit au `non_juge` de l'entrée : brancher tout `.md` du parc sur le plancher E-1..E-12 n'est pas mandaté au 12/09, **aucune mesure de bruit n'existe sur les produits** (le calibrage du 12/09 porte sur 204 textes **du pilot**), et l'oracle écrit lui-même la leçon N4 — « un oracle qui crie sur l'usage légitime se fait désactiver dans la semaine ». Le domaine reste donc joignable par invocation explicite, par le hook `ecriture` du pilot et par `check_markdown.py --style` | Jouer `oracle-ecriture.mjs --baseline` sur les `output\` de deux ou trois produits avant de poser `ext: [".md"]`, et fixer le taux de PASS attendu comme le pilot l'a fait pour lui-même (95 %). Tant que la mesure n'existe pas, le déclenchement automatique resterait une décision sans chiffre (classe `regle-neuve-sans-mesure-de-bruit`) |
| RA-5 | mineur | générique | **Le banc de `quality-oracles` porte un échec préexistant, sans rapport avec ce lot, et il rend le contrat « self-test PASS » non prononçable.** `node scripts\self-test.mjs` rend **1 échec** — `fixture sca/red : verdict PASS, attendu FAIL\|SKIP` — **avant** toute modification de ce run : mesuré en rejouant le banc sur `HEAD` par `git stash` des seuls fichiers touchés, même échec unique. Cause : `oracle-sca.mjs` rend `PASS` (« aucune vulnérabilité connue sur les dépendances épinglées vérifiées ») là où l'outil externe ou le réseau ne répond pas — le manifest tolère `SKIP` pour ce motif, l'oracle ne le rend pas. Une **non-mesure** sort donc en vert | Faire rendre `SKIP` motivé plutôt que `PASS` quand aucune base n'a effectivement répondu (`dependant_outil` est déjà déclaré au manifest pour ce cas). **Aucune classe de `CLASSES.json` ne convient** : la plus proche, `controle-sans-fixture-double-sens`, vise l'absence de banc, or le banc existe et c'est la **règle qui a cessé de mordre**. Classe à créer par le pilot, proposition de libellé : *un oracle qui n'a pas pu mesurer rend PASS au lieu de SKIP — la non-mesure se lit comme un vert* |

**Portée** : les trois sont *génériques*. RA-3 vaut pour tout produit qui applique E4 et sera jugé
par V18 ; RA-4 pour tout produit dont les `.md` entreraient au plancher d'écriture ; RA-5 pour
tout run qui cite « self-test quality-oracles PASS » comme preuve.

## Remarques restées au produit

Deux constats sont restés ici, et aucun des deux ne quitte ce dépôt : le premier est une dérive de numérotation interne au skill, le second une montée de version que le mandat borne au périmètre écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le numéro de contrôle demandé par le lot (« le numéro suivant de votre série V ») était **ambigu** : `render_page.py` étiquette ses familles jusqu'à V16 dans ses commentaires, tandis que `references\zero-defaut-visuel.md` — la checklist canonique, transversale à la forge — porte déjà un **V17** (`conteneur_bride_donnees`) et un « V15 ter ». Le contrôle neuf a donc été numéroté **V18** | La série est réalignée : la checklist reçoit la ligne V18, `SKILL.md` annonce « V1–V18 » (il annonçait V1–V16, déjà périmé de deux crans), et la ligne « Rendu HTML / visuel » du registre des oracles passe de « V1–V7 » à « V1–V18 » | non | Rien de généralisable : c'est une dérive de synchronisation **interne à ce skill** entre trois endroits qui nomment la même série (commentaires du script, checklist, SKILL.md). Elle ne coûte rien à un autre dépôt, et la parade est locale — la checklist fait foi. Si la dérive se reproduit sur une troisième série, elle deviendra une classe |
| Les deux skills touchés portent une version au frontmatter (`metadata.version`) : `digit-ai-page-html` 1.20.0 et `quality-oracles` 2.13.0 | Montées en **mineur** (1.21.0 et 2.14.0) : un contrôle neuf et une option neuve, aucune rupture de contrat de sortie | non | Le manifeste `versions-livrees.json` de la forge n'a **pas** été touché : il vit à la racine du dépôt, hors du périmètre d'écriture que le mandat borne à `.claude\skills\`. L'écart de version qu'il portera sera relevé par `oracle-etat-forge` (O3) à la prochaine session de forge, ce qui est son rôle — rien à généraliser |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : ce run n'a produit que
du code de skill, des références de skill et des fixtures. Le seul document au gabarit est **ce
lot de retours lui-même** (`gabarits\RETOURS-FORGES.md`), et il n'a rien coûté hors gabarit — les
sections R-45 et R-46 étaient présentes et suffisantes.

## Confirmations positives

- **Le contrat JSON commun des oracles tient d'un dépôt à l'autre.** `oracle-ecriture.mjs` a été
  branché sur le banc de `quality-oracles` et sur `check_markdown.py` sans qu'aucune de ses lignes
  ne bouge : `verdict` / `findings` / `non_juge` / exit 0-1-2 ont suffi, y compris pour distinguer
  `FAIL` de `AVERT` et de `SKIP` à la fusion.
- **La leçon TF-0362 (`attendu_messages`) paye.** Les cinq messages attendus verrouillent EC-2,
  EC-3, EC-4-gras, EC-4-emoji et une famille de densité. Sans eux, la fixture rouge resterait
  `FAIL` par une seule famille de densité et les quatre règles de structure pourraient mourir en
  silence — exactement le scénario que le champ existe pour empêcher.
- **La fixture verte de l'oracle d'écriture prouve que citer n'est pas commettre.** Elle porte un
  bloc de code saturé de tournures interdites et rend `PASS` à 304 mots de prose. Rejouée depuis
  le banc de `quality-oracles`, hors de son dépôt d'origine : même verdict.
- **`--self-test` de l'oracle du pilot et le banc du registre jugent le même contenu.** Les deux
  fixtures sont extraites mécaniquement des constantes du script, pas retranscrites : une dérive
  de l'une se verra chez l'autre.
- **La borne de V18 se vérifie dans les deux sens.** La fixture rouge de prose rend **0** constat
  à 1920 px et **2** à 2560 : le seuil n'est pas décoratif, il décide.

## Ordre recommandé

1. **RA-3 d'abord** — c'est le seul qui bloque un usage : tant que E4 et le plafond de E5 se
   contredisent, tout produit conforme à E4 dépend de la parade posée ici (l'exemption des
   conteneurs de lecture déclarés). Un arbitrage, une ligne à changer dans l'un des deux textes,
   et la parade peut disparaître. Gain immédiat, effort minime.
2. **RA-5 ensuite** — il coûte peu (un `SKIP` motivé à la place d'un `PASS`) et il rend de nouveau
   prononçable la phrase « banc de `quality-oracles` vert », que plusieurs runs citent en preuve.
3. **RA-4 en dernier** — il demande une campagne de mesure sur des produits, donc du temps
   machine ; rien n'en dépend tant que le déclenchement automatique n'est pas voulu.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RA-3** — aucune règle existante ne l'aurait évité. E4 (21/08) et E5 (12/09) sont deux règles
  du **même** référentiel, chacune juste prise seule, et leur incompatibilité n'apparaît que sur
  un artefact qui les applique **toutes les deux** — donc au moment d'écrire l'oracle, jamais à la
  lecture. La classe existe déjà : `deux-regles-du-socle-inconciliables`. Ce qui manque est le
  **geste** : une règle neuve du référentiel devrait être confrontée, avant service, aux formes
  que le socle prescrit (ici : rendre le boilerplate et mesurer).
- **RA-4** — la règle qui l'aurait évité existe et a été tenue : `regle-neuve-sans-mesure-de-bruit`
  prescrit de mesurer le bruit avant mise en service. C'est pour l'avoir tenue que le déclenchement
  automatique reste fermé, et l'écart est écrit dans le `non_juge` de l'entrée de registre plutôt
  que laissé au silence.
- **RA-5** — **aucune clé de `CLASSES.json` ne convient**, et rien n'a été forcé : ce retour n'a
  donc **pas** de ligne au sidecar. La plus proche, `controle-sans-fixture-double-sens`, vise un
  contrôle **sans** banc dans les deux sens ; ici le banc existe, la fixture rouge est là, et
  c'est la règle qui a cessé de mordre parce que l'oracle rend `PASS` quand il n'a pas mesuré.
  Classe à créer par le pilot dans son référentiel — proposition de libellé : *un oracle qui n'a
  pas pu mesurer rend `PASS` au lieu de `SKIP` : la non-mesure sort en vert, et le banc qui la
  couvre déclare une preuve qu'il n'a pas*.
