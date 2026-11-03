# Retours forges — Produit-86 — 20261103a

- **Contexte** : clôture du run 20261103-build-socle-l1 (socle L1 hors ligne, Gate A, de la plateforme de pentest autorisé)
- **Références ledger** : `forge\ledger.jsonl` seq 42, 43, 44, 52, 53, 54, 77, 78, 80, 81, 103, 122, 158, 191 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 03/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 03/11/2026 : `grep -ciE "batch.py" todo/TODO.jsonl` → 0 ligne trouvée ;
`grep -ciE "mutation.*en place|mute.*en place|in place" todo/TODO.jsonl` → 0 ligne trouvée ;
`grep -ciE "surcouche" todo/TODO.jsonl` → 12 lignes trouvées ; `grep -ciE "demo_markers" todo/TODO.jsonl` → 0 ligne trouvée ;
`grep -ciE "find-in-page" todo/TODO.jsonl` → 27 lignes trouvées ; `grep -ciE "C tracer|no-ctracer|ctracer" todo/TODO.jsonl` → 0 ligne trouvée ; `grep -ciE "Set-Cookie|capturer.mjs" todo/TODO.jsonl` → 0 ligne trouvée.
Items recoupés : TF-1772 (run-oracles-design lançait oracle-surcouche sur le mot `::backdrop` d'un commentaire, corrigé) — RD-1
en est une récidive de classe par une autre voie (le mot `dialog` d'un script en ligne). Les lignes « find-in-page » portent
sur le comportement du composant (TF-1340, TF-1342, TF-1353, TF-1354), aucune sur son adresse non versionnée : RP-1 est neuf.

## forge-tests (`digit-ai-forge-tests`)

L'audit complet est sorti en ERREUR au premier lancement, puis a révélé une propriété de la mutation qui expose l'arbre audité.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | bloquant | générique | `forge_tests/adaptateurs/batch.py`, `analyser()` appelle `exerces()`, qui lit `backend/app/batch.py` sans tester sa présence (FileNotFoundError ligne 158) ; le rapport entier sort `{"verdict": "ERREUR"}`. Le même module, `sans_objet()`, rend pourtant NA pour ce produit (aucun `batch.py`, aucun `worker/`, aucun déclencheur), rejoué à la main le 03/11 à 11:38. Ledger seq 44. | tester `sans_objet()` avant `exerces()`, ou faire rendre `None` à `exerces()` quand `_sources()` est vide ; un pan qui plante ne devrait pas emporter le rapport des autres. |
| RT-2 | majeur | générique | La campagne de mutation altère les sources EN PLACE dans le projet audité : pendant l'audit du 03/11 (11:46-12:10), `git status` montrait `backend/app/comptes.py`, `config.py`, `configuration.py`, `findings.py`, `dlp.py`, `passerelle.py`, `pseudonymisation.py` modifiés tour à tour (par exemple `def creer_compte(conn, /, …)` au lieu de `*`). Une session qui commite ou édite pendant l'audit peut figer un mutant. Ledger seq 52. | muter une copie de travail (le `TemporaryDirectory` existe déjà dans `mutation.py`), ou poser un verrou `forge/AUDIT-EN-COURS` que les hooks de la factory lisent avant toute écriture sous `backend/`. |
| RT-3 | majeur | générique | Le pan `securite` joue la règle semgrep `django-no-csrf-token` sur les gabarits Jinja2 d'une application FastAPI : 10 constats **bloquants** (`approbations.html:11`, `base.html:34/50/56`, `connexion.html:10`, `finding.html:35`, `mission.html:39/49/56/64`), alors que chaque formulaire porte un champ caché `csrf` vérifié côté serveur. La règle ne reconnaît que la balise `{% csrf_token %}` de Django. `rapport-20261103-tour2.json`, 10 des 11 constats bloquants du pan. Ledger seq 77. | ne jouer les règles `python.django.*` que si `django` figure dans les dépendances du projet. |
| RT-4 | mineur | générique | `interface/creation` accuse `tableau.html` d'un écran de création sans motif : son « Créer une mission » est un lien vers la page dédiée `/missions/nouvelle`, que le même contrôle reconnaît en page dédiée. Le motif page dédiée n'est reconnu que sur la page elle-même, jamais sur la liste qui y mène. `rapport-20261103-tour2.json`. Ledger seq 78. | reconnaître le lien dont la cible est un gabarit portant le motif page dédiée. |
| RT-5 | majeur | générique | Le pan `qualif` ouvre Chromium par `navigateur.new_context(**options)` sans `ignore_https_errors` ni variable pour le déclarer (`forge_tests/adaptateurs/qualif.py` l. 2054, 0 occurrence de l'option dans `forge_tests`) : la seule instance servie et peuplée en Gate A, la préproduction derrière un frontal TLS auto-signé sur `https://127.0.0.1:8443`, est injoignable. Ledger seq 80. | variable `FORGE_TESTS_QUALIF_TLS_NON_VERIFIE=1`, bornée aux hôtes de boucle locale et publiée au rapport. |
| RT-6 | majeur | générique | Le pan `qualif` ne reconnaît pas le champ identifiant d'une mire standard : `_SELECTEUR_IDENTIFIANT` (`qualif.py` l. 1656) exige `type=email`, un `name` contenant mail, login ou user, ou `input[type=text]`. Un `<input name="identifiant" autocomplete="username">` sans attribut `type` n'est pris par aucun : session non ouverte, parcours anonyme de 2 routes au lieu de 6 (`rapport-20261103-tour4-reprise.json`, puis 89 affordances une fois `type="text"` ajouté). Corollaire : sous Git Bash, `FORGE_TESTS_QUALIF_CONNEXION=/connexion` devient `C:/Program Files/Git/connexion`. Ledger seq 81. | ajouter `input[autocomplete=username i]` et `input:not([type])` au sélecteur ; signaler un chemin converti par MSYS dans le message. |
| RT-7 | majeur | générique | Le pan `visuel` écrit le DOM rendu de chaque route dans `<cible>/.visuel/` (`adaptateurs/visuel.py`, `DOSSIER = ".visuel"`), donc dans l'arbre du projet audité, sans entrée `.gitignore`. Les captures portent le jeton de formulaire de la session (`connexion.html`, 32 caractères) : le balayage de secrets du produit (test E-082) passe au rouge, et un commit large l'emporterait. Mesuré le 03/11 à 14:00 : 5 fichiers. Ledger seq 103. | écrire les captures sous le dossier de livrables de la forge, ou caviarder champs cachés et cookies avant écriture, comme pour RW-1. |
| RT-8 | majeur | générique | Le tableau de bord que forge-tests dépose sous `output/` (`--copie-output`, ETAPE-MEP § 4) échoue à la critique d'implémentation de forge-design : `oracle-slop` FAIL (bandeaux `border-left` de 3 et 4 px, `#fff`, emoji), `oracle-tokens` FAIL (62 couleurs en dur), `oracle-motion` FAIL (aucun `prefers-reduced-motion`), `oracle-bascule` FAIL (aucun thème sombre). `check_html` et `render_page` passent. Mesuré le 03/11 sur `Produit-86 - Dashboard tests - 20261103g.html` : 4 oracles FAIL sur 12 applicables. Ledger seq 122. | faire passer le gabarit du tableau de bord par `run-oracles-design` dans la recette de forge-tests, sur les jetons du socle. |

## forge-design (`digit-ai-forge-design`)

La critique d'implémentation sur les pages réellement servies a trouvé de vrais défauts ; elle a aussi rendu « indéterminé » deux pages saines.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | majeur | générique | `run-oracles-design.mjs` lance `oracle-surcouche` dès que le mot `dialog` figure dans le document, script en ligne compris ; sur une page sans `<dialog>` (la mire de connexion, la page 404 anonyme), l'oracle rend SKIP (« aucun composant en sur-couche ») et l'agrégat tombe en SKIP exit 2. Mesuré le 03/11 sur deux rendus servis du produit ; récidive de classe de TF-1772. Ledger seq 53. | détecter la sur-couche sur l'arbre DOM (`<dialog>`, `[popover]`, `role=dialog`), comme le fait l'oracle lui-même, jamais sur le texte. |
| RD-2 | mineur | générique | `oracle-textes-application` rend 4 bloquants, dont 3 tiennent à son lexique. « Le jeton du formulaire est absent ou périmé. Rechargez la page » et « La ressource appartient à une autre mission. Ouvrez la mission concernée » sont lus sans cause ni réparation. « Revenez au tableau de mission » n'est pas reconnu comme une invitation. Un libellé `<option>` (« analyse : aucun trafic vers une cible ») est lu comme un état vide (T4-2). Mesuré le 03/11 à 14:30 : 3 pages FAIL avant reformulation, 10/10 PASS après ; seul l'état vide de la fiche mission était un vrai défaut d'écriture. Ledger seq 158. | ajouter absent, périmé, rechargez, ouvrez, revenez au lexique ; exclure les `<option>` de la détection d'état vide. |

## forge-development (`digit-ai-forge-development`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-1 | mineur | générique | `conductor.gates.demo_markers_gate` lit « fixture » comme un marqueur de démonstration : 8 modules du socle signalés, alors que les fixtures synthétiques du lab y sont l'objet même du Gate A. Contourné en écrivant la frontière dans chaque docstring (citation de `PENTEST_MODE_DEMO`). Ledger seq 42. | exclure un dossier `fixtures/synthetic-only` déclaré, ou accepter le marqueur `SYNTHETIC` comme frontière explicite. |

## forge-websec (`digit-ai-forge-websec`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RW-1 | majeur | générique | `scripts/capturer.mjs` écrit les en-têtes `Set-Cookie` avec la VALEUR du cookie, et `oracle-exposition` la recopie dans ses constats : la capture du staging, rangée sous `forge/etapes/websec/` pour être versionnée, portait le jeton de formulaire réel `produit86_csrf_connexion`. Vu par le balayage de secrets du produit (2 constats, 03/11). Ledger seq 54. | caviarder la valeur de chaque cookie à la capture et ne garder que son nom et ses attributs, que les règles EX-8 jugent seuls. |

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | mineur | générique | Les projections `ARCHITECTURE.html` et `MODELE-DONNEES.html` générées par `generer-architecture.mjs` et `generer-modele-donnees.mjs` chargent `find-in-page.js` sans version : `static_cache_gate` de forge-development les signale quand la porte est jouée sur la racine du produit (2 constats `statique-nu`, 03/11). Ledger seq 43. | versionner l'adresse de `find-in-page.js` par empreinte dans les deux générateurs. |
| RP-2 | majeur | générique | `relecture-intention.mjs --preparer fin-de-tour` range dans le LIVRABLE les fichiers non suivis du dépôt modifiés depuis le message humain, y compris ceux d'autres sessions du même arbre : une proposition de compteur Foundry et un plan d'observabilité d'une session distincte (inscrite à `forge/mobilisation.jsonl` à 14:07), et un essai de logo présent avant l'ouverture de la session. Le relecteur a rendu « dérive, majeure » sur ces deux seuls écarts (RI-20261103-14). Ledger seq 191. | ne retenir que les fichiers écrits par la session, et exclure ceux qu'une autre session déclare au registre de mobilisation ou qui préexistaient au premier message. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le balayage de secrets du produit lisait `mdp = os.environ.get(…)` comme un mot de passe | motif restreint aux valeurs littérales | non | règle propre au contrôle `app.cli balayer-secrets` du produit |
| Le journal de rejeu du corpus d'injection porte une charge encodée en base64 que la règle d'entropie lit comme un secret | dossier d'épreuve exclu du balayage, avec son motif écrit | non | propre au produit ; le corpus de forge-agents-security n'est pas en cause |
| Le contexte de construction Docker embarquait `.venv` et `var/` | `.dockerignore` en liste blanche | non | défaut de ce Dockerfile, déjà couvert par la doctrine M-5 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - 20261103g.html`) | 5 versions datées du 03/11 (c à g), une par audit ou reprise | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit (`--copie-output`, ETAPE-MEP § 4) : sa forme appartient à la forge, pas à un gabarit de la bibliothèque |

## Garde-fou de plateforme relevé

Garde-fou déjà au registre, confirmé par ce relevé : **GFP-005** (stratégie de contrôle d'application Windows), relevé le
03/11/2026 sous une forme que le registre ne décrit pas encore : `coverage` 7.x avertit « Couldn't import C tracer: DLL load
failed while importing tracer: Une stratégie de contrôle d'application a bloqué ce fichier » et retombe sur son traceur Python,
plus lent ; la suite reste verte, l'audit forge-tests s'allonge.

## Confirmations positives

- `ledger.mjs consigner` a écrit une entrée par oracle pour chaque lanceur du run (conception, design, development, websec, agents-security, data), sans recopie à la main.
- `oracle-corpus-injection` et `oracle-scan-toolcalls` jugent un journal produit par un harnais de produit sans adaptation : 34 charges, 167 appels, PASS.
- `generer-modele-donnees.mjs` accepte un `MODELE-DONNEES.md` généré depuis le schéma réel (16 tables).

## Ordre recommandé

1. RT-1 : un seul `if` rend l'audit possible sur tout produit Python sans lot ; c'est le meilleur rapport gain/effort.
2. RP-2 : deux sessions parallèles sur un même arbre font juger l'une sur le travail de l'autre.
3. RT-3 : dix faux bloquants par produit FastAPI ou Flask à formulaires, chaque audit.
4. RT-2 : le risque de figer un mutant dans un commit est silencieux et coûteux.
5. RW-1 et RT-7 : une capture écrite chez l'audité peut faire entrer un jeton dans un dépôt.
6. RD-1 : il fait tomber en « indéterminé » toute page sans dialogue qui charge un script ou une feuille commune.
7. RT-5 : sans lui, une qualif locale en TLS se contourne par un second service HTTP.
8. RT-6 : un compte fourni qui n'ouvre pas de session rend le pan qualif anonyme sans bloquer.
9. RT-8 : chaque produit livre un tableau de bord que la forge de design refuse.
10. RV-1, RP-1, RT-4, RD-2 : confort.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : tous viennent d'oracles ou de portes exécutés pendant le run.

Douze retours n'ont aucune clé du référentiel qui convienne ; chacun propose sa classe :

- **RT-1** : clé proposée `adaptateur-plante-emporte-le-rapport`, famille `contrat-interface-forge`, libellé « Un adaptateur d'audit plante sur une entrée absente au lieu de rendre sans objet, et le rapport entier sort en ERREUR ».
- **RT-2** : clé proposée `audit-mute-l-arbre-audite`, famille `hook-ou-gate`, libellé « Une campagne d'audit altère en place les sources du projet audité : une écriture ou un commit concurrent peut figer un mutant ».
- **RW-1** : clé proposée `capture-de-preuve-porte-un-jeton`, famille `contrat-interface-forge`, libellé « Une capture produite par un outil de forge conserve un jeton ou un cookie réel, et la preuve versionnée l'emporte dans le dépôt ».
- **RP-1** : clé proposée `ressource-statique-generee-sans-version`, famille `page-html-socle`, libellé « Une page générée par un script de la factory charge une ressource statique sans version ni empreinte ».
- **RT-3** : clé proposée `regle-de-framework-hors-framework`, famille `contrat-interface-forge`, libellé « Un audit applique une règle propre à un framework absent des dépendances du projet et produit des bloquants faux ».
- **RT-4** : clé proposée `motif-reconnu-sur-la-cible-pas-sur-le-lien`, famille `contrat-interface-forge`, libellé « Un contrôle reconnaît un motif sur la page qui le porte, mais pas sur la page qui y renvoie ».
- **RT-5** : clé proposée `instance-tls-locale-injoignable`, famille `contrat-interface-forge`, libellé « Un pan d'audit à navigateur ne peut pas joindre une instance locale servie en TLS auto-signé, faute d'option déclarée ».
- **RT-6** : clé proposée `mire-standard-non-reconnue`, famille `contrat-interface-forge`, libellé « Un pan d'audit ne reconnaît pas le champ identifiant d'une mire standard et poursuit en anonyme ».
- **RT-7** : rattaché à la clé proposée pour RW-1, `capture-de-preuve-porte-un-jeton` (même classe, autre pan).
- **RT-8** : clé proposée `livrable-de-forge-hors-critique`, famille `page-html-socle`, libellé « Un livrable HTML généré par une forge n'est pas jugé par la critique d'implémentation d'une autre forge et la refuse ».
- **RD-2** : clé proposée `lexique-de-langue-incomplet`, famille `contrat-interface-forge`, libellé « Un oracle d'écriture juge sur un lexique fermé qui ignore des formes courantes de la langue et produit des bloquants faux ».
- **RP-2** : clé proposée `perimetre-de-session-confondu`, famille `hook-ou-gate`, libellé « Un juge de fin de tour attribue à la session les fichiers qu'une autre session a écrits dans le même arbre ».
