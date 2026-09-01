# Retours du run `Produit-12-20260805a` — à remettre au steering

Compilé le 2026-08-05 à la clôture du run (premier produit réel mené de bout en bout par la
forge : brief → production Railway). Chaque retour est un **candidat** pour la boucle
d'amélioration (`BOUCLE-AMELIORATION.md`) : une itération = un retour, une forge, une
proposition en diff, validation humaine avant application. Aucune écriture n'a été faite dans
les dépôts frères pendant le run. Référence ledger : `forge/ledger.jsonl` (seq 18 pour RT-1,
seq 29 pour ce document).

Convention : gravité **bloquant** (a bloqué ou failli bloquer une étape), **majeur** (a coûté
un aller-retour ou une découverte par lecture du code source), **mineur** (confort/precision).

---

## forge-tests (`digit-ai-forge-tests`)

Le run a coûté **1 aller-retour tests↔development** entièrement imputable à des conventions
non documentées de l'outil — le produit a dû être adapté à l'auditeur, ce qui est légitime,
mais ces conventions ont été découvertes en lisant le code des adaptateurs.

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RT-1 | majeur | `sonde_data` n'écoute que SQLAlchemy Engine : un backend sur `sqlite3` stdlib a ses pans data et migrations à `exercé = 0` sans message expliquant pourquoi (déjà consigné, ledger seq 18) | Repli `sqlite3.Connection.set_trace_callback` dans la sonde, ou a minima motif explicite « projet sans SQLAlchemy : pans data/migrations non mesurables » au rapport |
| RT-2 | majeur | La sonde API se greffe sur **`app.main.app`** (instance module) uniquement : une suite construite sur une app factory (`creer_app()` par test — pattern répandu) relève 0 couple sans diagnostic | Documenter la convention dans le README (« la suite doit exercer l'instance module ») et/ou accepter `FORGE_TESTS_APP="module:attribut"` ; émettre un avertissement quand la suite passe mais que le relevé est vide |
| RT-3 | majeur | Le pan migrations exige que **toutes les instructions des sections aller/retour/rejeu** passent au moteur pendant la suite, et l'attribution des contraintes exige des noms (`ck_*`/`uq_*`, format `<type>_<table>_<colonne>` pour SQLite) — deux conventions structurantes découvertes dans `adaptateurs/{migrations,data}.py` | Une page « Contrat du projet audité » dans le README : format de migrations attendu (`-- +migrate Up/Down`), nommage des contraintes, exercice par violation, instance module |
| RT-4 | mineur | Le relevé d'instructions de la sonde est borné aux **4 000 dernières** : un test de migrations qui ne tourne pas en fin de suite peut sortir de la fenêtre (nous avons dû nommer le fichier de test pour qu'il passe en dernier) | Borner par section plutôt que globalement, ou documenter la contrainte d'ordre |
| RT-5 | mineur | Confirmations positives à consigner : `--sortie` fonctionne, exit 3 sémantiquement clair, plus d'accident cp1252, G-1 respecté (aucune écriture dans le projet audité constatée) — les correctifs R-T1/T2/T3/T4/T5/T8 tiennent sur un projet réel | Clore ces entrées du backlog comme « vérifiées en conditions réelles » |

## forge-conception (`digit-ai-forge-conception`)

Étape la plus fluide du run : 4 oracles PASS à la première passe, vues scellées OK.

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RC-1 | mineur | `oracle-surface` : S1 émet un FAIL **par élément** non couvert, donc le verdict global tombe dès 1 élément non couvert — le paramètre `--seuil` de S2 (95 % par défaut) est de fait inopérant | Trancher : soit S1 en avertissement sous le seuil S2, soit supprimer `--seuil` et assumer 100 % |
| RC-2 | mineur | Champ `ton` : le gabarit ne prévoit que `*(à demander)*`, mais un brief peut le **déléguer à une observation** (« reprendre le ton du site X ») — le run l'a porté en hypothèse avec observation datée, hors gabarit | Documenter ce cas dans `derive-les-vues/references/vues.md` : ton fourni par délégation = hypothèse + source d'observation datée, pas de question humaine |

## forge-design (`digit-ai-forge-design`)

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RD-1 | majeur | `render_page.py` V4 signale comme chevauchement bloquant l'intersection **de formes internes d'une même icône SVG** (rect du corps d'enveloppe ∩ path du rabat, 23×8 px, signalé aux 5 largeurs) — faux positif de composition d'icône, contourné en fusionnant les formes en un seul path | V4 : ignorer les intersections entre enfants d'un même `<svg>` de petite taille (< ~48 px), qui relèvent du dessin, pas de la mise en page |
| RD-2 | mineur | `run-oracles-design.mjs` déclare `render_page.py` et `oracle-a11y.py` « NON LANCÉS » alors que Playwright était disponible sur le poste — l'orchestrateur du run a dû les lancer à la main (dont la copie `data-theme="dark"` pour le thème sombre) | Option `--rendu` qui les enchaîne quand l'environnement le permet (détection Playwright), copie sombre générée automatiquement |
| RD-3 | mineur | Confirmation : les 34 règles slop/tokens/motion sont passées en 2 passes sur une maquette réelle de 14 écrans ; T3 a attrapé un espacement 2px hors échelle — l'oracle fait son travail | — |

## forge-development (`digit-ai-forge-development`)

Le mode dégradé (construction directe sous gates rejoués) a bien fonctionné : 3 tranches Opus
séquentielles, 581 tests, 0 régression inter-tranches.

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RV-1 | majeur | Confirmation de R-V2 (adaptateurs amont) : la traçabilité `EXIGENCES.json` → tests a été portée par une **convention improvisée** (id `E-xxx` en docstring + grep) qui a tenu, mais n'est écrite nulle part | Standardiser cette convention (citation d'id en docstring, gate grep 100 %) dans le run-playbook — c'est un adaptateur amont à coût quasi nul, premier pas de R-V2 |
| RV-2 | mineur | Le produit construit devait être **compatible avec l'auditeur forge-tests** (instance module, SQLAlchemy, contraintes nommées, déclarations OpenAPI exactes) — découvert à l'étape 4, d'où l'aller-retour | Même contenu que RT-3, vu côté constructeur : une checklist « produit auditable » à appliquer dès la construction (cf. RS-2 côté steering) |

## forge-agents (`digit-ai-forge-agents`)

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RA-1 | mineur | `ledger.mjs` : 29 appends sans collision, verify PASS — le verrou Windows durci tient. Mais passer le JSON en argument shell est pénible sous PowerShell 5.1 (échappements) ; le run est passé par Git Bash | Mode `append <ledger> --fichier <payload.json>` pour éviter le quoting shell |
| RA-2 | mineur | Le routage par modèle a été appliqué en « affectation directe Opus » pour les 5 constructions (complexité manifeste) — jamais d'escalade depuis Sonnet, donc aucune mesure ne dit si Sonnet aurait suffi | Sur un prochain run, tenter 1 tranche en Sonnet pour calibrer la table (le ledger accumule la vérité mesurée) |
| RA-3 | majeur | quality-oracles (atelier hébergé par forge-agents) : l'entrée de registre « CDC de cadrage (contrat de sortie) » se déclenche sur **tous** les `.md` (`ext: [".md"]`, sans `trigger_files` ni `content_patterns`) — tout markdown qui n'est pas un CDC de cadrage est bloqué en livraison par le hook C6 (constaté sur ce document même, à sa publication) | Restreindre le déclencheur (motif de nom `*CDC*Cadrage*` ou motif de contenu `## SECTION 0`) ; règle générale : un oracle de gabarit documentaire ne doit jamais matcher une extension entière |

## steering (`digit-ai-forge-steering`) — auto-retours

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RS-1 | majeur | `CLAUDE.md` étape 2 et `CONTRAT-INTERFACE.md` D-C2 disent encore « verbe 4 absent » alors que `derive-les-vues` existe (R-C1 résolu le 04/08) — le run l'a utilisé avec son SKILL.md | Mettre à jour CLAUDE.md §2 et la table de dette (D-C2 soldée) |
| RS-2 | **bloquant évité** | L'aller-retour tests↔development n° 1 était **prévisible** : les conventions d'auditabilité de forge-tests (RT-2/RT-3) étaient connaissables avant de construire | Ajouter à l'étape development du CLAUDE.md une « discipline d'auditabilité » : instance module exposée, couche SQL observable (SQLAlchemy), contraintes nommées, `status_code`/`responses` exacts, tests citant les id d'exigences — le produit naît auditable, l'étape 4 ne renvoie plus en arrière |
| RS-3 | mineur | `ETAPE-MEP.md` M-3 cite « bande de risque critique (cotation forge-tests) » — le rapport forge-tests compte des findings par bande, pas des exigences ; le run a mappé sur l'impact ICE 5 du référentiel | Préciser la règle de sélection des smoke tests : exigences MVP à impact ICE max, ou mapping explicite |
| RS-4 | mineur | M-4 sur une **première version** : il n'existe pas de N-1 réelle ; le run a prouvé la mécanique (tags, volume, healthchecks) avec N-1 = N, limite déclarée | Documenter ce cas dans ETAPE-MEP.md comme preuve dégradée acceptée pour un premier déploiement |
| RS-5 | mineur | Le prompt canonique demande un ton « 3 mots concrets » mais accepte une délégation (« reprendre le ton du site X ») — le run a résolu par observation datée sans suspension ; utile de le rendre officiel | Même objet que RC-2, côté prompt canonique |

---

## Ordre recommandé

1. **RS-2 + RT-3** (checklist d'auditabilité, doc du contrat du projet audité) — supprime la
   cause du seul aller-retour du run ; gain immédiat sur tout prochain produit.
2. **RT-2** (sonde API : convention app factory) — le piège le plus silencieux (0 couple, 0 message).
3. **RT-1** (sonde data sqlite3) — déjà consigné, correctif esquissé.
4. **RD-1** (V4 intra-icône) — faux positif systématique sur toute maquette à icônes SVG.
5. **RS-1** (doc steering périmée) — 10 minutes, évite une confusion au prochain run.
6. Le reste au fil de l'eau (mineurs et confirmations).
