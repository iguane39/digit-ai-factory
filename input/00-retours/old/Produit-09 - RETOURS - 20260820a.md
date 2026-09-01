# Retours forges — Produit-09 — 20260820a

- **Contexte** : étape 0 du produit *Site vitrine SCC.FR* — analyse de branchement au pipeline
  (livrable ***Client-A - Spec Branchement - Site vitrine SCC.FR - 20260819a.md***, référence
  normative du dossier). Aucun run n'est encore ouvert : ces retours sont ceux qu'une lecture
  du parc a coûtés **avant** la première ligne de code, et sept d'entre eux ont été
  **reconstatés au code le 2026-08-20** sur les dépôts présents au poste.
- **Références ledger** : **aucune** — aucun run ouvert sur ce produit à ce jour. La traçabilité
  est portée par le livrable *Branchement* (§1 à §4) et par les empreintes de dépôt citées
  retour par retour.
- **Dépôts lus** : `digit-ai-factory` HEAD `7a8fe7c` (TF-0385) et `digit-ai-forge-tests` HEAD
  `7d3ca37` (TF-0383), clonés au poste, **relus le 2026-08-20** ; `digit-ai-forge-development`
  `691e9cd` et `digit-ai-forge-conception` `9df0204`, lus en dépôt public le **2026-08-19**,
  **non clonés ici** — ce qui en vient est marqué *fait rapporté*.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<PILOT_ROOT>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-20

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Premier lot de ce produit : la séquence d'ids ouvre en **`RF-1`**. Le produit `Produit-10` est un
**autre** produit — ses ids `RA-xx` ne sont pas les nôtres ; deux de ses retours sont cités ici
parce que ce dossier les recoupe par un autre chemin.

---

## digit-ai-factory (`pilot`)

Le socle a été lu comme spécification, pas comme documentation : c'est lui qui dit ce qui valide
une étape. Deux points l'empêchent de jouer ce rôle pour un produit JS/TS.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RF-1 | majeur | **Les gates de l'étape development sont mono-écosystème Python, et le socle ne déclare aucune voie de sortie.** `references\ETAPES-RUN.md:161` prescrit pour valider l'étape : « `ruff check` + `pytest` au vert sur le produit » ; les disciplines d'auditabilité du même §4 nomment `app.main.app`, une couche SQL observable et des migrations `-- +migrate Up/Down`. Le produit SCC.FR est **Next.js (TS) + Strapi (JS)** : les deux commandes sont sans objet. Le mécanisme opposable existe — le manifeste `.forge\profile.toml` (P-18) — mais il n'est **pas dans le socle** : recherche du 2026-08-20 sur HEAD `7a8fe7c`, `profile.toml` compte **0 occurrence** dans `README.md`, `CONTRAT-INTERFACE.md`, `references\ETAPES-RUN.md` et `REGLES-PROJET.md`. Sa seule mention du dépôt est `INVENTAIRE.md:72`, où il figure comme entrée du **conductor** — c'est-à-dire du composant que `CONTRAT-INTERFACE.md:265` déclare inutilisable en headless (dette **D-V1, assumée le 14/08**). Le seul mécanisme de sortie est donc logé dans le seul composant écarté. | Nommer `.forge\profile.toml` dans `ETAPES-RUN` §4 comme **voie déclarée** de substitution des gates, avec une table minimale par écosystème (Node : `npm run lint`, `npm test`, `npm run build`), et faire porter au ledger le couple **(gate prescrit, gate réellement joué)**. Sans cela, un produit JS/TS ne peut clore l'étape development que par un écart écrit — donc à chaque fois, et par chaque produit. |
| RF-2 | majeur | **Deux passages du socle sont périmés, contredisent le contrat ou le code, et aucune règle de préséance n'est écrite.** (a) `README.md:166` : « Trois étapes sur quatre n'ont pas de point d'entrée natif chez leur forge : conception, design et development » — invalidé par `CONTRAT-INTERFACE.md` §5 **relu au 14/08** (conception : `run-oracles-conception.mjs` + 4 skills ; design : 4 skills + `run-oracles-design.mjs`). (b) `INVENTAIRE.md:68-70` (12/08), du conductor : « `main()` retourne toujours 0 — **aucune sortie machine** (le `SprintReport` est jeté) », alors que `conductor/__main__.py` écrit `_forge-output/run-report.json` et rend **0 / 1 / 2** (lecture publique `691e9cd` du 19/08). Les trois sources coexistent sans hiérarchie déclarée. | Corriger les deux passages ; **écrire la préséance une fois pour toutes** dans le socle (le dossier a dû la poser lui-même : *code lu > `CONTRAT-INTERFACE.md` §5 > README / INVENTAIRE*) ; et porter un `verifie_le` en frontmatter de `README.md` et `INVENTAIRE.md`, sur le patron déjà **imposé aux produits** pour `docs\projet\` (R-20). Un document de parc sans date de vérification est indiscernable d'un document à jour. |

## digit-ai-forge-tests (`digit-ai-forge-tests`)

Aucun audit joué — le produit n'est pas construit. Ce qui suit vient de la confrontation des
prérequis déclarés des 15 adaptateurs (constante `POUR_COUVRIR`) à la stack du produit, **relue
au code le 2026-08-20** sur HEAD `7d3ca37`. Quatre des cinq pans qui comptent pour SCC.FR sont
hors mesure par **construction**, pas par défaut de configuration — et ce n'est pas la même
conversation.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RF-3 | majeur | **Le manifeste opposable `.forge\profile.toml` (P-18) n'est lu par aucun code de la forge : les racines sont en dur.** HEAD `7d3ca37`, recherche du 20/08 : `profile.toml` → **0 occurrence dans le code** (`--include=*.py`) ; il ne vit que dans `docs\` de la forge, qui **décrit** pourtant la cascade « manifeste → profil curé → inférence » (`CDC Forge - Framework Tests - 20260802a`, §« résolution de profil en cascade », et la spec `Correctif V1 manifeste opposable`). `resolve_profile`, `select_onramp`, `detect_stack` → **0 occurrence** elles aussi. Ce qui décide réellement : `disposition.py:94` `_ORDRE_CANDIDATS = ("backend", ".")`, `disposition.py:155` `cible / "backend"`, `execution.py:138` `(racine_execution(banc), banc / "backend", banc)`, `execution.py:498` `front = banc / "frontend"`. L'arborescence de SCC.FR est **`back/` + `front/`**, fixée au dossier : elle n'est pas vue, quel que soit le manifeste livré. Le pilot présente P-18 comme *primant sur toute détection* ; l'auditeur ne le lit pas. | Lire le manifeste comme branche ① de la cascade, ainsi que la forge le documente déjà. À défaut — et **dans tous les cas** — publier au rapport la **racine retenue et le motif du repli** : aujourd'hui un audit peut mesurer un dossier vide et rendre un verdict d'apparence normale. À traiter en premier : sans racine juste, les trois retours suivants mesurent le vide. |
| RF-4 | majeur | **Un seuil bloquant sans porteur hors Python.** `seuils.py:49-58` : `mutation_globale = 0,70`, `severite: "bloquant"`, `porte_sur: "score de mutation agrégé du pan back"`. `adaptateurs/mutation.py:47-51` exige « un environnement Python du projet (`backend/.venv` ou `.venv`) avec sa suite verte, et un paquet de sources sous `backend/` ». Sur un back Strapi (Node), le pan est en SKIP **par construction** et le seuil bloquant ne porte sur rien — alors que la justification du seuil **cite Stryker** (`seuils.py:54`), l'outil JS, qui n'est câblé nulle part. Le produit doit donc écrire noir sur blanc (hypothèse H-17 du dossier) qu'aucune métrique de robustesse de suite ne s'y substitue. | Soit un pan mutation JS (**Stryker** — le seuil est déjà écrit pour lui), soit déclarer le seuil **sans porteur dans l'écosystème mesuré**, et le dire au rapport. Un seuil bloquant qui ne porte sur rien est, au dashboard, indiscernable d'un seuil tenu : c'est la pire des deux formes de silence. |
| RF-5 | majeur | **Le pan `api` exige un objet ASGI importable, là où il n'a besoin que d'une surface.** `adaptateurs/api.py:20-24` + `CHAMPS_REQUIS = ("FORGE_TESTS_APP",)` (ligne 37) : il faut déclarer « l'application ASGI du projet (`FORGE_TESTS_APP = module:attribut`) ». `execution.py:407` attache de même l'extraction du schéma **OpenAPI** au domaine `backend` Python. Strapi est Node/Koa : le pan qui porte la **couverture de surface API** (chapitre T1) est hors mesure — et c'est l'un des deux chiffres que le run pilote du 04/08 met en avant (couverture API 8/8 au seuil 1.0). | Une **sonde HTTP sur instance servie** : schéma OpenAPI exporté, ou routes déclarées — `accessibilite` sait déjà le faire via `FORGE_TESTS_QUALIF_ROUTES`. Le pan compare des routes et des codes ; la provenance lui est indifférente. À défaut, que le motif de SKIP distingue **« écosystème non couvert »** de **« configuration manquante »** : les deux ne se traitent pas pareil, et une configuration réclamée pour un pan structurellement inatteignable use la crédibilité des actions qui, elles, comptent (même reproche que `Produit-10 RA-19`, 18/08, par un autre chemin). |
| RF-6 | bloquant | **Une obligation légale que le parc entier ne mesure pas — et un `non_juge` qui ne le dit pas.** SCC.FR est un site public français : **RGAA 4.1 / WCAG AA** y est une obligation, pas un objectif (NF-18 : 100 % des critères applicables, plancher projet 95 % ; NF-19 : contraste ≥ 4,5:1, navigation clavier complète). Or `adaptateurs/accessibilite.py`, `NON_JUGE`, exclut **nommément** « ni audit axe-core complet, ni contraste, ni navigation clavier », et pose que « le DOM est capturé à l'état **INITIAL** de chaque route » (ni menu ouvert, ni modale, ni message d'erreur). Recherche du parc le 20/08 : aucun autre pan ne les reprend — la seule autre occurrence de « contraste » est un **libellé d'action manuelle** (`livrables/libelles.py:131`, « vérifier l'accessibilité de l'écran : noms accessibles, contrastes, ordre des titres »), donc une délégation à l'humain, pas une mesure. Et les cinq livrables légaux (déclaration d'accessibilité avec taux, schéma pluriannuel, plan d'action annuel, mécanisme de signalement, voie de recours) ne sont produits par **aucune** forge. | (a) Le moins cher d'abord : que le `non_juge` dise que la famille **n'est couverte par aucun oracle du parc**. Un `non_juge` est une promesse de périmètre — c'est mot pour mot le reproche de `Produit-10 RA-17` sur `oracle-calculs`. (b) Côté pilot : instruire l'écart au dossier MEP — pour un produit public français, « prêt client » ne devrait pas pouvoir se prononcer sur une conformité **légale non mesurée**. (c) À terme, un pan `accessibilite-complet` (axe-core + contraste + clavier, sur états ouverts). En attendant, l'audit RGAA reste un **livrable humain externe à budgéter** : c'est la seule question réellement bloquante du dossier SCC.FR (Q-13). |
| RF-7 | mineur | **Le pan `i18n` a gagné son second point d'observation (TF-0383, 19/08) ; la moitié « ce que le visiteur reçoit » reste conditionnée à un build arborescent.** Constaté au code le 20/08 : `i18n.py:495` `_findings_catalogue` juge désormais le **catalogue source** — le correctif est là, et il compte. Mais `POUR_COUVRIR` (`i18n.py:46-51`) et `CHAMPS_REQUIS = ("FORGE_TESTS_I18N_BUILD",)` (ligne 61) conditionnent toujours la parité de **routes** et de **menus** à un dossier de build (`out/`, `dist/`, `_site/`), le pan « ne lisant AUCUN site distant ». Next.js en `output: 'standalone'` + ISR **n'émet pas** cette arborescence — c'est exactement la stack de SCC.FR, et exactement les défauts que ce pan est écrit pour attraper (EX-09 / NF-22 : parité de routes, page servie sous `/en` rendant du français). | Accepter une **racine servie** (`FORGE_TESTS_BASE_URL`, déjà employée par `accessibilite`) comme source alternative des routes, par crawl des liens. À défaut, écrire dans `POUR_COUVRIR` que les rendus **serveur / ISR** sont hors champ : ce serait alors une décision, pas une découverte au premier run. |

## digit-ai-forge-development (`digit-ai-forge-development`)

**Fait rapporté, non reconstaté ce jour** : dépôt **non cloné** au poste ; lecture publique à
`691e9cd` le **2026-08-19**, consignée au livrable *Branchement* §1.2 et §3.1. Sans objet pour
SCC.FR — le conductor A→E est écarté (ADR-09 / H-15) au profit du pipeline pilot 5 étapes, ce que
le pilot a déjà assumé (D-V1). Consigné parce que le conflit **réapparaîtrait** au premier produit
sans authentification qui passerait par le conductor.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RF-8 | majeur | **Le contrat d'entrée expose une décision que le code écrase, et une cible unique qu'il ne déclare pas.** `cadrer()` (`conductor/cadrage.py`) accepte `bricks: [{name, decision: build \| buy \| skip}]` — mais les briques de t0, **`multi-tenancy`, `rbac`, `auth-sso`**, sont **forcées en `build` et non désactivables** (`catalog.py:T0_BRICKS`, `_merge_t0`). Pour une vitrine **sans espace connecté** (ADR-03 / Q-05 : redirection simple, aucune auth côté site), les trois sont sans objet : c'est un **conflit de contrat**, que la doctrine du parc dit de **remonter, jamais de contourner**. Second point du même ordre : `scaffold.py:TEMPLATE_REF = "gh:fastapi/full-stack-fastapi-template"`, et `targets/` ne contient que `fastapi-saas` — **une seule cible de scaffold**, qu'un produit Next.js/Strapi n'apprend qu'en lisant le code. | Rendre les briques t0 décidables en **`skip` avec motif** — le champ `decision` existe déjà, il suffit de cesser de l'écraser ; et **déclarer la mono-cible au contrat d'entrée** plutôt qu'au seul code. Un contrat qui accepte un argument sans effet coûte plus cher qu'un contrat qui le refuse. |

## Confirmations positives

Ce qui a tenu, sur pièces — et qui devrait clore les entrées « à vérifier » correspondantes.

- **Le contrat d'entrée du pilot a absorbé un dossier amont hétérogène sans reformatage.** Les six
  livrables SCC.FR (**1 869 lignes**) entrent comme entrant typé **`cdc`** ; le seuil de suffisance
  (« ≥ 1 objet métier **et** ≥ 1 rôle ») est atteint largement — 9 entités, 6 personas. Aucune
  suspension `bloque_question` de ce chef. Le brief à 7 champs a fait son travail : deux champs
  seulement se sont révélés non dérivables (`ton`, `contraintes reprises`), et la forge les
  **nomme** comme tels.
- **La doctrine « trois états » est ce qui a rendu la question répondable.** `natif` / `degrade`
  consigné / **refus explicite** : `DefaultBadRunner` lève une `NotImplementedError` **nommée**
  plutôt que de rendre un faux vert, et `require_isolation_for_real_effects` (TF-0103.1) refuse par
  `IsolationRequiredError` au lieu de retomber en silence sur le stub. Un parc qui préfère
  l'exception nommée au vert de complaisance est auditable **en lecture, sans exécution** — c'est
  ce qui a permis de lever la question d'état des runners *(fait rapporté, 19/08)*.
- **`CONTRAT-INTERFACE.md` §5 est le seul document du parc qui porte son état à jour et ses dettes
  numérotées** — c'est lui, et lui seul, qui a permis de **dater** les deux passages périmés de
  RF-2. Une table de dettes qui se relit est un actif, pas de la paperasse.
- **Le schéma `EXIGENCES.json` rend la conversion mécanique — et il attrape ce que le format pivot
  laissait passer.** `critere` **chaîne unique, exactement un** a fait apparaître **7** critères
  d'acceptation multi-clauses (EX-03, EX-07, NF-01, NF-10, NF-15, NF-16, NF-18) qu'un dossier relu
  deux fois n'avait pas vus ; `statut_epistemique` force chaque « fait » à porter une source
  citable. Correspondance livrable par livrable établie, **sans perte** *(fait rapporté, 19/08)*.
- **TF-0383 tient sur notre cas.** Le second point d'observation du pan `i18n` (catalogue source)
  est bien au code au 20/08 (`i18n.py:495`) : il réduit d'autant le retour RF-7, qui ne porte plus
  que sur la parité de routes.

## Ordre recommandé

1. **RF-3** (manifeste / racines en dur) — il **conditionne** RF-4, RF-5 et RF-7 : sans racine
   juste, ces pans mesurent le vide, et un rapport d'apparence normale le masque. Effort le plus
   faible du lot pour le gain le plus large : tout produit qui n'est pas `frontend/` + `backend/`
   est concerné.
2. **RF-1** (gates JS/TS au socle) — même famille, côté pilot. Sans lui, chaque produit JS/TS
   refait le même écart écrit pour clore son étape development.
3. **RF-6** (RGAA) — le seul écart à conséquence **légale**. Le pan complet est cher, mais le volet
   (a) — dire au `non_juge` que **personne** ne couvre — coûte une ligne et évite qu'un lecteur
   cesse de chercher.
4. **RF-2** (socle périmé + préséance écrite) — coût faible ; économise à chaque nouveau produit la
   lecture de code que ce dossier a payée.
5. **RF-5** puis **RF-4** (`api`, puis `mutation`) — deux pans à porter hors Python. La surface API
   compte dans la couverture affichée ; le seuil de mutation, lui, ne bloque personne — il trompe.
6. **RF-7** (i18n, à moitié traité par TF-0383) puis **RF-8** (conductor, sans objet tant qu'il
   n'est pas réintroduit).
