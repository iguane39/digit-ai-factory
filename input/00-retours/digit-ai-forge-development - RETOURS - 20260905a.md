# Retours forges — digit-ai-forge-development — 20260905a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905a` (TF-0798), reçu dans
  `input\00-travaux\` de la forge et joué sur mandat humain du 05/09/2026 (« fais tous les A »).
- **Références ledger** : aucune — le dépôt `digit-ai-forge-development` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  local `00097b6` et aux recettes rejouées, citées ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-05

## Ce que le lot de travaux a produit (TF-0798)

Le lot confiait un seul travail, en trois parties, et les trois sont faites : la règle dans le
gabarit de projet, la recette double sens, le point de contrôle de MEP. Le tableau ci-dessous dit
ce qui a été écrit et par quelle preuve exécutée chaque partie se vérifie.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| (1) toute adresse de statique porte la version ou une empreinte, `Cache-Control` cohérent | Huitième discipline de production ajoutée à `docs\run-playbook.md` — la source unique des disciplines de livrable de la forge (TF-0007) : la règle, la mesure du 01/09/2026 qui la fait naître, le choix du mécanisme et son motif, les limites déclarées. Le compte affiché passe de sept à huit disciplines. | `run-oracles.mjs --profil digit-ai --niveau note` sur `docs\run-playbook.md` : **CONFORME — 4 PASS, 3 SKIP, 0 échec** |
| (2) recette double sens (statique nu → refus ; statique versionné → PASS) | Gate `conductor\gates\static_cache_gate.py` (contrôle statique, aucun réseau) + recette `tests\test_static_cache_gate.py`, 15 cas. Trois classes de constat : `statique-nu`, `cache-control-absent`, `cache-control-html-long`. | Le **même** projet instancié, joué deux fois : statiques nus → `exit 1`, 4 constats nommés ; après `?v={{ version_app }}` et `Cache-Control` déclaré → `exit 0`, `PASS`. `pytest` : **400 passed, 1 skipped** (385 avant) |
| (3) point de contrôle dans la discipline de MEP | Quatrième contrôle ajouté à la discipline « aucun déploiement n'est réussi avant d'avoir été vérifié CONTRE L'URL SERVIE » (TF-0574) : après déploiement, on compte les adresses de statiques de la page servie qui portent la version déployée et on compare ce nombre au nombre total d'adresses locales ; puis `curl -sI` sur le statique doit rendre une ligne `Cache-Control`. | Contrôle documenté, exécutable contre une URL servie — **non joué ici** : la forge n'a aucun déploiement à elle (écart déclaré ci-dessous) |

**Le mécanisme retenu, et pourquoi** — le lot laissait le choix ouvert. `?v=<version_app>` est le
**défaut de la forge**, l'empreinte de contenu est **acceptée à égalité**. Motif : le
versionnement par requête ne demande ni chaîne de construction, ni manifeste, ni réécriture de
noms — un global de gabarits suffit, et il couvre les pages rendues côté serveur, précisément
celles qu'aucun bundler n'empreinte. Refuser l'empreinte serait faux dans l'autre sens : la sortie
d'un bundler l'est déjà, et lui imposer en plus un `?v=` n'ajoute rien. La propriété exigée est la
même dans les deux cas — *l'adresse change quand le contenu change* — et c'est elle que le gate
juge, pas la forme.

**Ce qui n'a PAS été fait, et le motif mesuré** — trois points, tous déclarés plutôt qu'inventés :

- **`targets\fastapi-saas\copier.yml` n'a pas reçu de question `version_app`.** Le gabarit de
  projet de cette forge ne contient AUCUN fichier HTML : `scaffold.py` invoque copier sur un
  template externe (`gh:fastapi/full-stack-fastapi-template`), et la décision canonique 01 interdit
  de le forker. Une question posée dans `copier.yml` que le template externe n'exploite pas serait
  une affordance non câblée (loi n° 1) — exactement ce que le socle refuse. La règle du gabarit vit
  donc là où vivent les sept autres disciplines : en règle opposable dans `run-playbook.md` + gate
  exécutable joué sur le projet **instancié**. C'est aussi ce que le lot nomme comme moyen de
  vérification : « la recette du gabarit rend un constat sur un projet instancié ».
- **Le gate n'est pas câblé dans `.github\workflows\double-gate.yml`.** Joué sur le dépôt de la
  forge, il rend `PASS` avec un SKIP tracé : les deux pages HTML de `docs\` n'ont aucune référence
  de statique externe (tout est en ligne). Un job de CI qui ne juge rien est un vert décoratif ;
  `demo-markers` et `traceability` ne sont pas non plus dans la CI, pour la même raison.
- **`curl -sI` sur un statique d'un projet neuf n'a pas été joué.** Le second moyen de
  vérification du lot exige une instance servie ; la forge n'en déploie aucune, et instancier un
  projet réel demanderait le réseau, `copier`, et un déploiement — hors périmètre de ce lot. Le
  contrôle est écrit, borné et exécutable ; il sera joué à la première MEP d'un produit.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Le traitement de ce lot a buté une fois sur le gate d'écriture des oracles qualité, et le constat
ci-dessous est la RÉCIDIVE d'une classe close : le correctif D-33 (a) du 01/09 est en place dans le
code, et il ne protège pas le cas le plus fréquent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-21 | majeur | générique | Le delta neufs/préexistants de `qo-gate-write.mjs` (hook C7, D-33 (a) du 01/09) est **inopérant pour tout constat dont la ligne porte le chemin du fichier** — c'est-à-dire pour tous les constats de `run-oracles.mjs`. Le hook rejoue les oracles sur la version `HEAD` copiée dans un dossier temporaire ; le constat rendu porte alors ce chemin temporaire. L'identité comparée (`masque` : chiffres → `#`, espaces normalisés) laisse le chemin intact, donc les deux lignes ne se rencontrent jamais. **Mesure du 05/09/2026** : édition de 5 lignes dans `docs\run-playbook.md` de digit-ai-forge-development, dans un chapitre situé 250 lignes plus bas → BLOQUÉ « passe 1/3 » sur deux constats M7 visant les chapitres « Matrice de contexte (Phase −1) » (ligne 30) et « Options de cadrage du CLI » (ligne 193), **tous deux présents à l'identique dans `HEAD`** (vérifié en rejouant l'oracle sur `git show HEAD:…`, sortie mot pour mot identique). Une seule ligne a été reconnue préexistante : la ligne de bilan `❌ NON CONFORME — 1 oracle(s) en échec`, la seule qui ne porte pas de chemin. Coût payé : deux chapitres sans rapport avec l'édition ont dû être réécrits pour pouvoir livrer TF-0798 — le péage exact que D-33 (a) existe pour supprimer. | Normaliser le chemin dans `masque()` avant comparaison : remplacer le segment de chemin qui précède le nom de fichier par un jeton fixe (le hook connaît déjà `path.basename(chemin)`, qu'il emploie pour nommer la copie temporaire). Le banc `--self-test` gagnerait un cas ROUGE dédié — « deux exécutions du MÊME contenu depuis deux chemins différents rendent des constats PRÉEXISTANTS » — parce qu'aucun des cas actuels ne fait varier le chemin : ils comparent des lignes déjà identiques, et c'est pourquoi le défaut a survécu au banc. |

**Portée** : *générique*. Le défaut ne dépend d'aucun contenu : il frappe toute édition d'un `.md`
ou `.html` déjà porteur d'un constat, dans n'importe quel dépôt de l'écosystème.

## Remarques restées au produit

Deux constats sont restés dans le dépôt de la forge, chacun avec son verdict de généralisation
écrit — aucun des deux n'a été corrigé au passage, l'un et l'autre étant hors du périmètre du lot.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `uv run mypy` rend **exit 1** sur le dépôt de la forge, avant comme après ce lot : `tests\test_tf_0375_cat_dev_03_approval.py:130 — Missing type arguments for generic type "dict"`. Le job `code` de `double-gate.yml` joue `uv run mypy` : la porte code de la forge est donc rouge sur `main`. | Pas corrigée — sans rapport avec TF-0798, et le lot dit de ne pas élargir. État mesuré avant : 1 erreur / 112 fichiers ; après : 1 erreur / 114 fichiers — aucune erreur neuve. | non | Le fait est propre à ce dépôt (une annotation manquante dans un test). La classe « la porte code d'une forge est rouge sur `main` et personne ne le voit » serait généralisable, mais aucune clé de `CLASSES.json` ne la couvre — voir « La règle qui aurait évité le retour ». |
| Le « Catalogue de services » du `README.md` de la forge est **généré depuis `catalogues\catalogue.jsonl` du pilot** et ne porte donc pas le service neuf (gate `static-cache`). La forge ne peut pas l'y ajouter : écrire dans un dépôt frère est interdit hors mandat. | Pas corrigée — le README n'a pas été touché, pour ne pas faire diverger une vue de sa source. | non | Le mécanisme est prévu et sain (source unique chez le pilot) ; il manque seulement une regénération côté pilot. Rien de généralisable : c'est le fonctionnement normal du catalogue, signalé ici pour que la regénération soit programmée. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le travail a porté sur le
code de la forge et sur `docs\run-playbook.md`, qui est un document propre à la forge et ne dérive
d'aucun gabarit de `gabarits\documents\`.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce lot, et elles méritent d'être consignées
autant que le défaut ci-dessus.

- **Le gabarit `RETOURS-FORGES.md` et `oracle-travaux-pilot.mjs` ont fonctionné sans friction.**
  L'oracle du lot de travaux, joué avant traitement comme le lot le demande, rend **PASS** sur
  T1 à T5 en une seconde — la consigne « un geste, une seconde » est tenue au pied de la lettre.
- **La posture « SKIP tracé » de la forge (P-06) s'est révélée juste sur un cas neuf.** Joué sur
  le dépôt de la forge, le gate `static-cache` ne trouve aucune adresse à juger : il rend `PASS`
  **avec un `skipped` nommé** plutôt qu'un vert muet. Sans cette convention déjà en place, le
  premier réflexe aurait été de câbler le gate en CI et d'y installer un vert décoratif.
- **La convention de recette double sens de la forge s'applique telle quelle à une règle neuve.**
  Le contrat des gates existants (`GateVerdict`, CLI `0`/`1`/`2`, fixture rouge + fixture verte
  dans le même fichier de test) a couvert TF-0798 sans qu'aucune convention nouvelle soit
  inventée — c'est ce qui a permis de livrer la recette en même temps que la règle.

## Ordre recommandé

Un seul retour est remonté, mais son rang mérite d'être dit, parce qu'il pèse sur tout le reste.

1. **RV-21 — la normalisation du chemin dans le delta de `qo-gate-write.mjs`.** Meilleur rapport
   gain/effort de l'écosystème à ce jour : le correctif tient en une ligne de `masque()` plus un
   cas de banc, et il rend effectif un correctif du 01/09 qui protège aujourd'hui exactement zéro
   édition réelle. Tant qu'il n'est pas fait, toute session qui édite un document déjà endetté paie
   la dette entière ou contourne le gate — et un gate contourné n'est plus un gate.

## La règle qui aurait évité le retour (TF-0779)

Le retour RV-21 ne suit pas un retour humain : il a été trouvé par un contrôle exécuté (le hook C7
lui-même, qui a bloqué). La règle est donc nommée pour la classe, comme le demande TF-0779, et une
classe manquante est signalée au pilot plutôt que créée ici.

- **RV-21** est couvert par une classe EXISTANTE : `gate-ecriture-juge-fichier-entier`
  (famille `hook-ou-gate`), fondée par la décision D-33 (a) du 01/09/2026. Le retour entre donc
  **marqué récidive** : la règle existe, le code qui l'applique existe, et il ne s'applique pas au
  cas nominal. C'est précisément l'information que le référentiel de classes cherche — une
  correction qui n'a pas atteint la réalité qu'elle visait. La cause n'est pas une règle absente
  mais une **identité de constat trop naïve** : comparer des lignes de sortie d'outil sans
  normaliser ce qui varie mécaniquement d'une exécution à l'autre.
- **Aucune clé ne convient** pour le premier constat resté au produit (« la porte code d'une forge
  est rouge sur `main`, et rien ne le fait remonter »). Les classes de la famille `hook-ou-gate` ne
  couvrent que le gate d'écriture ; la famille `regle-morte` vise un contrôle qui rend PASS à tort,
  or ici le contrôle rend correctement FAIL — c'est le fait que personne ne le regarde qui est le
  défaut. Le pilot est invité à créer la classe dans son référentiel s'il la juge fondée : une
  classe ne se crée jamais dans un sidecar. Ce constat n'a donc **pas** de ligne de sidecar.
