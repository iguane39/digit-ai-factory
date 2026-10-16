# Retours forges — Produit-61 — 20260905a

- **Contexte** : clôture du run 20260905a (ouverture → conception → design → development → tests → MEP qualif Railway)
- **Références ledger** : `forge\ledger.jsonl` seq 19, 20, 36, 37, 38, 39, 50, 51, 69, 70, 71, 72, 73, 74, 75, 76, 77 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-05

Ce lot rassemble ce que le run a coûté ou révélé sur six forges, en un jour de run complet. Chaque section se lit par forge : une phrase de contexte, puis un tableau où chaque ligne est un fait observé avec sa preuve, et une piste jamais obligatoire.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-conception (`digit-ai-forge-conception`)

Le runner d'oracles a demandé une lecture de son code pour comprendre un FAIL sur un référentiel neuf, et le sceau des vues a laissé T5 sans objet.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | majeur | générique | `run-oracles-conception.mjs <EXIGENCES.json>` sans `--seulement` rend FAIL : `oracle-retro-modele` juge EXIGENCES.json comme un RETRO-MODELE.md (RM1-RM5 FAIL au lieu de SANS_OBJET). Ledger seq 19. | déclarer un oracle non applicable au type d'artefact, ou router par nom de fichier |
| RC-2 | mineur | générique | `derive-les-vues` prescrit l'en-tête `source-sha256` mais `oracle-tracabilite` T5 attend aussi `corps-sha256` (TF-0818), que ni le skill ni vues.md ne documentent : la vue produite selon la doctrine sort SANS_OBJET sur T5. Ledger seq 20. | documenter le double sceau dans le skill et le gabarit de vue |

## forge-design (`digit-ai-forge-design`)

Trois oracles ont exigé des contournements d'écriture sur la maquette, et la revue 5 bis sur pages réelles a révélé un défaut de doctrine mobile que la maquette masquait.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | majeur | générique | `oracle-declencheurs` DE3 résout les déclarations par présence d'un jeton de classe ou de balise dans le sélecteur : `.bouton.fantome {background: transparent}` s'applique à TOUS les `.bouton`. Contournement : renommer la classe. Ledger seq 36. | apparier sur le sélecteur complet, pas sur un jeton |
| RD-2 | mineur | générique | `oracle-surcouche` SC1 juge NUL un `box-shadow` dont la valeur commence par `0` (« 0 -8px 24px var(--ombre) ») : la regex prend le premier offset pour une absence de contour. Contournement : la couleur en tête. Ledger seq 37. | analyser la valeur en composantes |
| RD-3 | mineur | générique | `check_maquette` C2 ne reconnaît une route implémentée que si sa valeur est `function|(|=>` : une table qui référence des fonctions nommées compte ses routes comme sans écran. Contournement : `r => fn(r)`. Ledger seq 38. | admettre un identifiant de fonction |
| RD-4 | majeur | produit+générique | La barre basse `position: sticky` de la doctrine mobile fait chevaucher le contenu (V4 sur 18 pages réelles, 4 largeurs, `forge/oracles/rendu-produit/`) tant que l'écran n'est pas une coquille défilante (`.ecran` hauteur fenêtre, `.contenu` défilant, barre statique). La maquette mono-fichier passait V4 par sa propre mise en page ; le défaut n'est apparu qu'au rendu produit. Ledger seq 76. | prescrire la coquille défilante dans le gabarit de maquette mobile et DESIGN.md, avec la règle print |
| RD-5 | mineur | générique | `render_page` `contenu_rogne` signale tout `<input>` dont la valeur dépasse la largeur (scrollWidth > clientWidth) alors qu'un champ texte défile nativement ; l'adresse a été passée en `<textarea>` pour obtenir PASS. Ledger seq 77. | exclure les champs de saisie de la mesure |

## forge-tests (`digit-ai-forge-tests`)

L'audit a coûté quatre passages complets et une demi-heure de diagnostic sur des causes qui tenaient à l'auditeur, pas au produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | bloquant | générique | La greffe `FORGE_TESTS_APP` importe `app.main` AVANT `conftest.py` : moteur et réglages figés à l'import (base du cwd, quota vision 20) ne voient pas l'environnement de conftest ; la suite passe seule et rend code 1 sous forge-tests (E-015 attend 409). Le premier audit a de plus vidé la base de démo servie (`backend/resto.db`) par le pan Down. Rapports a à c. Ledger seq 69. | documenter l'ordre d'import et prescrire un point de rebranchement, ou greffer après conftest |
| RT-2 | majeur | générique | Les cas `--generer` du pan data emploient un SQL invalide (`INSERT INTO IF NOT EXISTS`), une fixture `moteur` inexistante et `DROP … CASCADE` ; `_violer` attend `pytest.raises(Exception)` : une erreur de syntaxe FAIT PASSER le cas. `output/Produit-61-cas/test_genere_data.py`. Ledger seq 70. | partir d'une ligne valide par table et attendre IntegrityError |
| RT-3 | majeur | générique | Livrables refusés quatre fois (`DonneeNonSynthetique .jeux[9].cle`) parce qu'une clé de cas reprend la VALEUR de `FORGE_TESTS_LOGIN_PATH` (`/admin/connexion`), un chemin public lu dans `.env.forge-tests`. Ledger seq 71. | ne comparer que les noms qui ressemblent à un secret |
| RT-4 | majeur | générique | `INSTANCE_MONTER` remonte l'instance sans les secrets de la session (clé Anthropic) et `INSTANCE_DEMONTER` (`taskkill uvicorn.exe`) ne tue pas un uvicorn lancé par `uv run` : après l'audit, une instance sans clé occupe le port et le smoke M-3 rend 500. Ledger seq 72. | vérifier le port libre après DEMONTER et le déclarer sinon |
| RT-5 | mineur | générique | Le pan interface signale « création sans motif » sur `inscription.html` (page dédiée à la création du tenant) tandis que `oracle-panneau-tache` PA6 refuse le panneau adressable déclaré sur cette page faute de déclencheur dans le document : les deux oracles s'excluent sur une page-formulaire autonome. Ledger seq 73. | admettre la page dédiée comme troisième motif, des deux côtés |

## forge-ops (`digit-ai-forge-ops`)

Le plan Railway a guidé les gestes ; l'oracle et la fiche ont laissé deux trous.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RO-1 | majeur | générique | `oracle-ops` O-1/O-3 exigent `COURANT` et `journal.jsonl` ; sur Railway le pointeur et l'historique sont tenus par la plateforme et `ops.mjs` ne porte que `plan` : FAIL sur un déploiement sain et restauré (`m4-rollback-qualif.json` PASS). Ledger seq 74. | adaptateur Railway ou SANS_OBJET déclaré |
| RO-2 | mineur | générique | `railway up -p <id> -e qualif -s web .` rend « Indexing… prefix not found » (exit 1) sur un dossier non lié ; `railway link` puis `railway up --ci` réussit. `railway-up-qualif-1.log`. Ledger seq 75. | écrire dans la phase provision que `link` est requis même avec `-p` |

## forge-organization (`digit-ai-forge-organization`)

Le composant de filtres du socle a tenu ; son oracle a exigé une duplication inline que la CSP rend coûteuse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-1 | majeur | générique | `oracle-filtres-tableau` G3/G6 exigent l'initialisation et la règle print DANS le document ; une application dont JS et CSS sont des assets externes (CSP `script-src 'self'`) doit dupliquer un script inline sous nonce et une règle `@media print`. `historique.html`. Ledger seq 50. | admettre l'initialisation par asset déclaré |

## pilot (`digit-ai-factory`)

Deux retours sur l'outillage transverse du pilot : un hook d'écriture et un skill.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | majeur | générique | Le hook `qo-gate-write` juge un TEMPLATE de maquette (placeholders `/*TOKENS*/`) comme un livrable et bloque sur des constats qui disparaissent au build. Ledger seq 39. | reconnaître un template par ses placeholders et juger le fichier construit |
| RP-2 | mineur | générique | Le skill claude-api prescrit les fallbacks côté serveur par défaut, mais `messages.parse` ne documente pas la combinaison avec le paramètre beta ; non activé sur ce produit, écart déclaré. Ledger seq 51. | documenter la combinaison ou dire qu'elle est exclue |

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec le verdict de généralisation de chacune.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le menu « ⋯ » d'un plat débordait du viewport à 390 px (V1) | panneau ancré en `position: absolute` | non | disposition propre à la carte de plat |
| Le champ « Nouveau nom » d'une catégorie était rogné dans la colonne des flèches | panneau « Modifier » pleine largeur, étiquette et bouton empilés | non | découpage propre à cet écran |
| Le lecteur d'ardoise rendait 500 sans clé d'API | refus nommé (E-021) au lieu d'une erreur muette | oui | remonté indirectement par RT-4 (la cause était l'instance sans secrets) ; la règle « un tiers absent refuse avec sa cause » est déjà au socle (EA6) |
| La 404 servait une page HTML aux ressources et sans `noindex` | 404 nu par extension ou Accept, en-tête `X-Robots-Tag` | non | déjà couvert par M-9 et la recette générique |
| Les codes émis par 42 routes HTML n'étaient pas déclarés | `responses=` généré depuis le rapport du pan api | non | règle déjà portée par le pan api |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot : les fiches `docs/projet` viennent des gabarits de projet du pilot et ne portent pas de couple `gabarit` + `version_du_gabarit` en en-tête, ce qui empêcherait d'ailleurs un retour de s'y appliquer. Vérifié par le pilot du run, le 05/09/2026.

## Confirmations positives

- Le déploiement Railway par jeton de compte et API GraphQL (TF-0704 à TF-0735) a tenu de bout en bout : provision, domaine nommé au premier déploiement, rollback par `deploymentRollback`, sans `railway login`.
- La recette générique `quatre_cent_quatre.py` (TF-0803) a prouvé M-9 en un appel une fois `--marqueur-menu` fourni.
- `verifier-secours.mjs` (TF-0512) a relu `ROLLBACK.md` sans faux positif.
- Les oracles design (`--rendu`) sur pages réelles ont trouvé sept défauts que la maquette ne montrait pas : la revue 5 bis vaut son coût.

## Ordre recommandé

1. RT-1 (bloquant, cause de trois audits perdus) — une ligne de documentation et un point de rebranchement.
2. RT-2 (des cas générés qui passent sur une erreur de syntaxe sont pires qu'aucun cas).
3. RD-4 (défaut de doctrine mobile, invisible sur maquette mono-fichier).
4. RO-1 et RT-3, puis le reste.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : tous viennent d'oracles ou de mesures. Les classes déclarées au sidecar sont les plus proches du référentiel `CLASSES.json` v1.2.0 ; aucune classe n'y décrit exactement « un oracle de l'auditeur altère l'environnement de l'audité » (RT-1, RT-4) ni « deux oracles s'excluent sur un cas légitime » (RT-5) : le pilot est invité à les créer.
