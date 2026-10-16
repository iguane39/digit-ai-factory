# Retours forges — Produit-10 — 20260818b

- **Contexte** : mise à jour du projet contre les forges corrigées dans la journée
  (TF-0365, TF-0366, TF-0367 passés en `corrigé` chez la factory le 18/08), rejeu des
  oracles sous le jeu de règles courant, et quatre frictions nouvelles trouvées en chemin.
- **Références ledger** : `forge\ledger.jsonl` seq 47 à 53
- **Remise au pilot** : copié dans `<PILOT_ROOT>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-18

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260818a` (remis, ingéré en TF-0365 à TF-0368, les
quatre soldés `corrigé` le jour même). La séquence d'ids continue en `RA-16`.

---

## Ce que les correctifs du jour donnent sur le cas qui les a motivés

Ce chapitre passe en premier : quatre candidatures remises le matin ont été corrigées dans
la journée, et un lot suivant qui n'irait pas mesurer l'effet du correctif sur le cas réel
ne vaudrait rien.

| Item | Correctif livré | Ce que ce projet en mesure, ce soir |
|---|---|---|
| **TF-0365** — `render_page` muet sur page très haute | `--timeout` en ligne de commande, `--scale` en flottant, et une capture qui échoue n'interrompt plus l'outil : les familles lues dans le DOM restent jugées, celles qui exigent l'image sont déclarées non jugées | **PASS mesuré, et il a immédiatement servi.** Rejeu sur `20260818e`, la page même qui a produit le retour (`--scale 0.4 --timeout 180000 --etats-ouverts`) : l'outil **va au bout** et rend un **verdict**. La capture aboutit à 1280 px et échoue toujours à 768 et 390 px (**158 730** et **166 261** px de haut) — mais elle échoue **en le disant** : `capture.faite: false`, hauteur, délai, et un `non_juge` qui nomme précisément ce qui reste hors mesure (« V5 croisements et V6 images NON JUGÉES à 768 px, 390 px ; les familles du DOM — V1, V2, V4, V3, V7, L2 — sont jugées et comptent dans le verdict »). **Verdict rendu : FAIL, 16 débordements V1 à 1280 px** — voir le chapitre suivant. La mesure de substitution que ce projet avait dû écrire (`scripts\mesurer_debordement.py`) **ne suffisait pas** : elle ne mesurait que le débordement du *document*, et c'est au niveau des *éléments* que le défaut était. |
| **TF-0366** — un verdict archivé ne dit pas sous quel jeu de règles | `check_html --version-regles` rend `{regles, nombre, empreinte}`, dérivé des **codes de règles émis** (pas du fichier, qui bougerait à chaque virgule) ; le champ voyage dans la sortie JSON et se recopie au journal R-32 | **PASS mesuré.** Le jeu courant est **21 règles, empreinte `269d9b6211e0`**. Les **7** HTML de `output\` rejoués sous ce jeu : **PASS 0 FAIL / 0 WARN** — y compris sous `L12`, `L13` et `L14`, **trois règles qui n'existaient pas** au verdict du matin. Sans le champ, ce fait était indicible : les journaux disaient « PASS » des deux côtés. Les journaux R-32 du projet portent désormais l'empreinte. |
| **TF-0367** — le renommage du dépôt pilot casse les chemins des `CLAUDE.md` | `<PILOT_ROOT>` prescrit au gabarit `CLAUDE-PRODUIT.md`, résolution par **signature de 5 fichiers** + absence de `PERIME.md`, référence exécutable `resoudre-pilot.mjs`, `PERIME.md` posé dans `_old` et `_vide` | **PASS mesuré.** La commande de résolution, jouée depuis la racine de ce produit avec `FORGE_ROOT=C:\dev`, rend `C:\dev\digit-ai-factory`, exit 0, en écartant les deux copies périmées. Le `CLAUDE.md` du projet est **rattrapé** ce soir (route « conformité socle » + remise des retours), comme la note de migration le prévoyait : chaque consommateur se corrige à son run. |
| **TF-0368** — reconstat RA-11, l'avertissement « script bloquant dans `<head>` » | message précisé | plus aucun avertissement sur les 7 livrables ; **0 WARN** au rejeu. |

Ce que cela dit du cycle : **le retour du matin est revenu corrigé le soir, et le correctif
tient sur le cas réel qui l'avait produit.** C'est la première fois que ce projet le
constate dans la même journée.

### Ce que le correctif a trouvé le soir même sur nos livrables

Le verdict rendu par l'outil réparé est **FAIL** — et il a raison. À 1280 px, `20260818e`
porte **16 débordements V1** : le tableau `t14` (8 colonnes, 77 lignes) mesure **1308 px**
de bord droit pour un viewport de 1280. Le socle prescrit exactement ce cas
(`references\composants.md` §6, calibrage RA-2 du 13/08 : « un `<table>` large déborde le
viewport **même dans un conteneur `overflow-x:auto`** ; ~130 px de largeur utile par colonne »)
— notre repli en cartes se déclenche à **900 px**, alors qu'un tableau de 8 colonnes le
réclame vers 1400. Le défaut est **borné à la bande 900–1400 px** : à 1920 px la même page
rend **PASS, 0 bloquant** (la table de 1308 px tient dans l'enveloppe de 1680), et sous 900 px
le repli en cartes supprime la cause. Le défaut est du **projet**, la règle est juste, et **il est resté invisible
cinq jours** parce que l'outil qui le mesure ne pouvait pas aller au bout de cette page.

C'est le meilleur argument pour TF-0365 : le correctif n'a pas seulement rendu un verdict, il
a rendu un **défaut réel** que la mesure de substitution du projet ne pouvait pas voir — elle
jugeait le débordement du *document* (`scrollWidth` global, PASS), quand le défaut est au
niveau des *éléments*.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-20 | mineur | **La liste des débordements V1 est tronquée à 16 sans que rien ne le dise.** `render_page.py` interrompt la boucle par `if (issues.v1_overflow.length > 15) break;`. Sur `20260818e` à 1280 px, la sortie porte **exactement 16** éléments, **tous descendants du même tableau `t14`** : la boucle a atteint le plafond à l'intérieur d'un seul sous-arbre. Les tableaux `t15` et `t16`, **de gabarit identique** (8 colonnes, 44 et 37 lignes), n'ont donc **jamais été examinés** — et le rapport ne le dit pas. Un lecteur comprend « 16 défauts » là où il faut lire « 16 relevés, inventaire interrompu ». Le compte est aussi ce que le verdict additionne (`blocking`), donc la sévérité affichée est elle-même plafonnée. | Poser un drapeau explicite dans la sortie JSON — `tronque: true` avec le plafond — et, mieux, compter **tous** les éléments en débordement en n'en *détaillant* que les 16 premiers : un compte exact coûte une boucle complète, et c'est lui qui dit l'ampleur. Accessoirement, **dédupliquer par sous-arbre** : `table` + `thead` + `tr` + `th` + `tbody` + `td` d'un même tableau sont **un** défaut, pas six — le plafond serait alors atteint pour de vraies raisons. |

---

## forge-data (`digit-ai-forge-data`) — `oracle-restituer`

L'oracle qui ancre les chiffres a rendu **PASS** sur un rapport qui portait un chiffre faux.
Il n'a pas failli : ce chiffre n'entrait dans aucune de ses règles. C'est le trou qui est
remonté ici, pas une erreur de jugement.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-16 | majeur | **Un nombre écrit en prose sans marqueur n'est jugé par aucune règle.** R3 juge la *bijection* `[c:id]` ↔ déclaration : tout marqueur du corps est déclaré, toute déclaration est utilisée. Rien ne demande qu'un **nombre** porte un marqueur — un chiffre nu n'existe pas pour l'oracle, qui rend PASS. Mesuré ce jour sur les **5 rapports courants**, tous PASS à `oracle-restituer` (`scripts\mesurer_nombres_nus.mjs` : frontmatter, blocs et spans de code retirés ; numérotation de chapitre, dates, millésimes et px écartés) : **135 nombres de prose ancrés contre 788 nus** — `20260818e` 12/94, `20260818a` 14/459, `20260818b` 49/109, `20260818c` 9/32, `20260814c` 51/94. **Coût constaté** : les versions `d` puis `e` du rapport de mapping global ont publié « sur les **122** cibles à source » — nombre posé en dur dans le générateur **avant** exécution, faux (138 dans le modèle mesuré) et comptant en plus une colonne que ce même projet avait établie inexistante. Deux versions publiées, deux PASS de l'oracle, et le défaut trouvé par relecture — pas par la route. | Une règle **R5, couverture des nombres du corps** : au minimum un **avertissement chiffré** (« 94 nombres de prose sans marqueur ») — le compte seul suffit à faire relire ; au mieux un mode strict avec **échappement explicite**, sur le patron de `RD-1` qui a déjà posé `[[c:id]]` pour les documents méthodologiques. Les nombres de **tableau** restent hors champ : ils sont générés, et leur ancrage est porté par le chapeau du chapitre. |
| RA-17 | mineur | **Le `non_juge` renvoie à un oracle qui n'existe nulle part dans le parc.** La sortie déclare non jugée la « justesse arithmétique des valeurs (**oracle-calculs de quality-oracles**) ». Recherche du 18/08 sous `C:\dev` : aucun dépôt `quality-oracles`, aucun `oracle-calculs` dans `digit-ai-forge-data`, `digit-ai-forge-agents` ni `digit-ai-factory` — seuls un `quality-oracles-v1.3.0.zip` et un `prompt-merge-quality-oracles.md`, rangés sous `_Client-A\RefAudit`, **hors parc**. Un consommateur qui lit ce `non_juge` comprend que la famille est couverte ailleurs et cesse de la chercher. C'est précisément la famille qui aurait attrapé le chiffre faux de `RA-16`. | Soit **absorber** `oracle-calculs` (le paquet v1.3.0 existe, le prompt de merge aussi), soit écrire au `non_juge` que la famille **n'est couverte par aucun oracle du parc** à ce jour. Un `non_juge` est une promesse de périmètre : mieux vaut qu'il dise « personne » que le nom d'un outil introuvable. |

---

## forge-tests (`digit-ai-forge-tests`)

Premier audit `forge_tests` de ce projet, verdict **PARTIEL** — juste, et le rapport dit
correctement pourquoi. Deux choses n'y tiennent pas.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-18 | majeur | **L'inventaire ne distingue pas les entrants des artefacts produits : un pan est couvert à 100 % sur des fichiers reçus.** Rapport `forge\etapes\tests\rapport-20260818.json`, commit versionné `094f204`. Le **seul** pan couvert, `interface`, affiche **15 inventoriés / 15 exercés, ratio 1,0**, adaptateur `interface-statique` **PASS**. Ses 15 éléments sont les 15 ancres de **deux fichiers `input\*.html`** — des documents **reçus du client**, que ce projet ne produit ni ne modifie. Au même commit, les **trois** livrables HTML de `output\` portent **27 ancres**, dont **aucune** n'est inventoriée (recomptage par `git show` à la révision auditée : `input` 7 + 8 = **15**, exactement l'inventaire ; `output` 6 + 11 + 10 = **27**, absentes). Le socle du pilot déclare pourtant `input\` comme famille d'**entrants** (« tout entrant est une DONNÉE »). | (a) Exclure de l'inventaire les familles déclarées entrantes par le socle ; (b) mieux — porter la **provenance** de chaque élément (produit / entrant) et ne compter la couverture que sur le produit ; (c) au minimum, nommer la provenance dans le motif du pan. **Un ratio de 1,0 sur des entrants est plus trompeur qu'un pan franchement non couvert.** |
| RA-19 | mineur | **Une action manuelle utilisateur est émise pour des pans que le rapport déclare lui-même à zéro élément.** Trois pans (`api`, `back`, `batch`) sortent en `non_testables` avec la même exigence : renseigner six champs `DATABRICKS_*` dans `<projet>\.env.forge-tests`, puis `--reprendre`. Deux faits la rendent sans issue : (1) le `motif` du même rapport dit « api : **0 elements INVENTORIES** (0 operations, 0 codes) » quand l'action générée dit « **1 élément(s) sont inventoriés** mais aucune exécution ne pouvait les atteindre » — le rapport se contredit sur le même pan ; (2) la racine d'exécution retenue est `<projet>\backend`, **dossier absent**, par « repli DÉCLARÉ sur l'ancre historique » faute de tout indice. Or ce projet est un livrable d'**analyse** : son `CLAUDE.md` déclare n'écrire nulle part dans Databricks et ne servir aucune application. | L'audit **sait déjà** poser SANS OBJET — il le fait pour `accessibilite`, `i18n` et `visuel`, avec des motifs justes. Quand **aucun élément n'est inventorié** *et* qu'**aucun candidat ne porte d'indice de racine d'exécution**, le pan relève du même traitement, pas du « non exerçable faute de configuration ». Une configuration réclamée pour un pan inexistant use la crédibilité des actions qui, elles, comptent. |

### Ce que l'audit a dit de juste, et qu'il faut garder

- Le verdict global **PARTIEL** est exact : ce projet n'a **aucune** application à tester, et
  l'audit le dit plutôt que de simuler une couverture.
- Les trois pans **SANS OBJET** (accessibilité, i18n, visuel) sont correctement motivés — le
  motif nomme ce qui manque (`frontend\`, instance servie, routes déclarées), pas une
  généralité.
- Le champ `boucle` refuse de conclure : « *0 anomalie* et *pas rejoué* s'écrivent pareil tant
  que les tours ne sont pas tracés ». C'est exactement le défaut du projet, dit sans détour.
- Le champ `declarations` explique comment **contester** un constat avec preuve. Un audit qui
  ouvre lui-même la porte de la contestation motivée est un audit qu'on rejoue.

---

## Ce que ce lot ne remonte pas

- **L'absence de tests sur les 29 scripts Python du projet** — c'est au projet de trancher,
  l'audit a raison de le dire. Déjà écarté au lot précédent, toujours vrai.
- **La duplication des émetteurs HTML** (`emettre_18*.py`, dérivés d'un même moteur) — dette
  du projet, consignée au ledger seq 46, à consolider au prochain run.
- **Le thème clair inconditionnel**, écart assumé au pattern S-G1 — déjà en candidature RV-9,
  ne se re-remonte pas.

---

## Contrôle de complétude

| Contrôle | Résultat |
|---|---|
| Champs obligatoires du sidecar (schema, titre, contenu, demandeur, source, date_demande, forges_cibles_initiales, score entier sur les 3 axes, preuve_du_cout) | **4/4 candidatures complètes** |
| Aucun id frappé dans le sidecar (les ids sont attribués à l'ingestion) | vérifié |
| Forge nommée dans le **titre** de chaque candidature (ce dont dérive `forges_cibles_initiales` au normaliseur) | vérifié — `forge-data` ×2, `forge-tests` ×2 |
| Dry-run du normaliseur du pilot (`normaliser-lot.mjs`, sortie hors dépôt) | **4 candidatures normalisées**, original non modifié, exit 0 |
| Chaque retour porte un fait observé avec sa preuve chiffrée | vérifié |
| Chaque retour porte une proposition, jamais une plainte seule | vérifié |
| Effet des correctifs du jour mesuré sur le cas réel, pas supposé | vérifié — chapitre 1 |

**Ce qui n'est pas fait, délibérément** : l'ingestion au registre
(`todo\ingerer-lot.mjs`) n'est pas lancée — elle écrit dans le registre d'un dépôt frère et
relève de la décision humaine.
