# Règles projet — DÉCIDÉES le 2026-08-06

**Les 17 règles sont adoptées** (décision humaine du 06/08). Arbitrages des conflits :
C1 = `Old\` autorisé pour les livrables mais **jamais versionné** (ignoré par git) ;
C2 = `git init` + **commits locaux par défaut** dès l'ouverture du run, remote/push sur GO
humain ; C3 = le nommage daté ne s'applique jamais au code ; C4 = journaux d'oracles
**versionnés** dans `forge\`.
Application : phase 0 du prompt produit (P0), vérifications pilot (S), et l'oracle
exécutable `oracles\oracle-conformite-projet.mjs` (O) — chaque n° de règle est un n° de finding.
Rattrapage des projets existants : au prochain run de version de chacun.

Sources : inventaire exécuté sur 11 dépôts (6 forges, produit pilote MiniVeille, Produit-12
— produit forge réel —, ASDMailManager, Produit-02.com, Transcript, BeefProject).
Annexe d'inventaire en fin de document. Mécanismes : **P0** = créé par la phase 0 du prompt
produit · **S** = vérifié par le pilot à l'ouverture de run · **O** = oracle conformité
projet (2e mandat) · **G** = gate humain.

## A. Structure de dossiers

| n° | Règle (binaire) | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 1 | `input\` existe à la racine ; tout entrant fourni par l'humain y vit | observée 7/11 (forges, Produit-12, Transcript…) | tous projets, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 2 | `output\` existe ; tout livrable généré destiné à l'humain y vit (rapports, PV, exports) | observée 3/11 (`digit-ai-forge-agents/output/`, Transcript, BeefProject) | tous, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 3 | `docs\` pour la documentation pérenne du produit (hors run) | observée 3/11 (development, tests, Produit-02) | produits, nouveaux | P0 | nul | option |
| — | `forge\` (ledger, étapes) : **déjà acté** au contrat d'interface §2, pour mémoire | Produit-12/forge/ | — | — | — | déjà appliqué |

## B. Nommage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 4 | Tout livrable documentaire est nommé `<Projet> - <Objet> - AAAAMMJJ<indice>.<ext>` — **le nom du PROJET prime sur l'émetteur** (Q3-bis tranchée par l'humain le 09/08 : « Produit-02 - Audit SEO - … », plus jamais « Digit-AI - … » en tête). Les fichiers historiques ne sont pas renommés | convention historique observée avec préfixe émetteur ; **décision humaine du 09/08** la corrige | **livrables uniquement** (input\, output\, docs\) — JAMAIS le code (conflit C3) | S+O | faible | **défaut** |
| 5 | L'indice est une lettre (a, b, c…) par itération du même jour ; une nouvelle version = un **nouveau fichier daté**, jamais d'écrasement | observée (`20260721b` → `20260721d`, `revue.md`/`revue-v2`) | livrables uniquement | S+O | faible | **défaut** |

## C. Versions et git

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 6 | Le code n'a qu'un magasin de versions : git. Aucune copie datée ni dossier `Old\` pour du code | générique (standard) + état de l'écosystème (6 dépôts git) | tous | O | nul | **défaut** |
| 7 | Quand un livrable documentaire est remplacé par une version plus récente, l'ancien migre dans `Old\` du même dossier (lisibilité du dossier courant — pas un magasin de versions) | **citée par toi** ; observée 1/30+ (`OptimAssur/old`) | livrables uniquement | S+O | faible | option (conflit C1) |
| 8 | Tout nouveau produit est `git init` à l'ouverture du run, avec commit initial + commits par étape (le **push/remote reste sur ton GO**) | gap constaté : Produit-12 sans git | produits, nouveaux | P0 | nul | **défaut** (conflit C2) |
| 9 | Commits en Conventional Commits français | observée (development 116 commits, campagnes forges) | tous dépôts git | S | nul | **défaut** |
| 10 | `.gitignore` socle dès la création : `.env`, `.venv/`, `__pycache__/`, `node_modules/`, `generated/`, artefacts de build | observée (9/11) | tous | P0+O | nul | **défaut** |

## D. Documentation du produit

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 11 | Chaque produit naît avec un `CLAUDE.md` d'après `gabarits\CLAUDE-PRODUIT.md`, **section « Routage forge » remplie** (verdict tests → forge_tests, évolution → run de version, déploiement → MEP ; boucle intérieure libre) — étendue le 06/08 : sans routage, les sessions ad hoc contournent les forges (constaté sur le correctif v0.2.0) | observée 11 projets maison ; absente du produit forge réel | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 12 | Chaque produit naît avec un `README.md` minimal : une phrase de quoi, 2 commandes de démarrage, lien CLAUDE.md | observée 8/11 ; absente d'Produit-12 | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |

### D bis. Socle documentaire `docs\projet\` (R-20..R-23 — décision humaine du 11/08, TF-0082)

**Principe directeur** : les fichiers de `docs\projet\` sont des **vues pour humains et agents** —
chacun **déclare sa source de vérité** (frontmatter YAML : `role`, `sources_de_verite`,
`verifie_le`) et ne la duplique jamais ; toute valeur volatile est datée ; **aucun secret,
jamais** (R-14 inchangée — dépôts au régime public). Déclencheurs de mise à jour : chaque étape
de run actualise ses fichiers (design/development → TECHNOS, MEP → COMPOSANTS-OPS…), vérification
à la clôture et à l'ouverture des runs de version (rattrapage : mécanisme existant).

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 20 | `docs\projet\` complet : `TECHNOS.md` (technologies + versions + liens, ancrées lockfiles), `COMPOSANTS-OPS.md` (hiérarchie/noms/types/IDs/URLs/IPs des composants déployés — depuis `ops etat`/plans/DOSSIER-MEP, instanciations datées, placeholders si dépôt public), `PARAMETRAGE.md` (signification des variables, URLs/ports par environnement — staging/prod en placeholders), `ACCES-TEST.md` (profils + comptes de démo locale), `COMMANDES.md` (install, dev, test, build, deploy staging, rollback, seed démo — blocs exécutables) ; chaque fichier ouvre par un frontmatter YAML (`role`, `sources_de_verite`, `verifie_le`). Noms **fixes** — documents vivants exemptés du nommage daté R-4 (ce ne sont pas des livrables). Autres fichiers admis seulement s'ils servent l'automatisation ou l'onboarding ET n'existent pas déjà sous forme machine (sinon renvoi) | manque constaté : les runs de version redécouvrent tout | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 21 | Fraîcheur TECHNOS : chaque `nom@version` du frontmatter `versions:` de `TECHNOS.md` correspond aux lockfiles/manifestes du produit (`package-lock.json`, `pyproject.toml`…) — une version divergente = FAIL | loi 4 : une donnée volatile est une donnée | produits | O | nul | **défaut** |
| 22 | Parité PARAMETRAGE ↔ `.env.example` : les noms de variables déclarés dans le frontmatter `variables:` de `PARAMETRAGE.md` et ceux de `.env.example` (R-13, qui reste la liste qui fait foi) sont identiques | double vérité interdite | produits | O | nul | **défaut** |
| 23 | `ACCES-TEST.md` : en-tête dur littéral « comptes de démonstration locale — jamais valides hors MODE_DEMO » présent, comptes créés par seed derrière drapeau `MODE_DEMO` (loi 2), **zéro motif de secret réel** (motifs d'oracle-secrets) ; tout accès d'environnement réel = référence `# à fournir :` (R-15 → non_testables) | R-14 + loi 2 + régime public | produits | O | nul | **défaut** |

## E. Environnements et configuration

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 13 | `.env.example` versionné et **exhaustif** : toutes les variables attendues — applicatives ET infra (ports, URLs, cible de déploiement, drapeaux `*_MODE_DEMO`) — valeurs par défaut sûres ou vides, en-tête « ne jamais renseigner de secret ici » | observée (design, tests, ASDMailManager, Produit-02 — en-tête littéral constaté) | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 14 | `.env` réel toujours gitignoré ; aucun secret committé, jamais | observée partout + loi pilot existante | tous | O | nul | **défaut** (quasi-loi déjà) |
| 15 | Les variables que la forge ne peut pas renseigner (clés tierces, identifiants) portent un commentaire `# à fournir :` dans `.env.example` — elles alimentent directement les `non_testables[]` de l'étape qualif (RT-6) | générique, prolonge RT-6 | produits | P0+S | faible | **défaut** |
| 24 | **URLs d'application par environnement** : tout environnement hébergé expose son application sous un hôte préfixé `<nom-appli>-<env>.<domaine>` avec env ∈ {`dev`, `qualif`, `production`} — ex. `https://produit-02-production.up.railway.app`. Le staging outillé de l'étape MEP se nomme **qualif** dans les URLs ; le local (`localhost`, `127.0.0.1`) est hors périmètre ; les hôtes non applicatifs (BDD…) aussi. Vérifié sur la table « URLs & ports par environnement » de `PARAMETRAGE.md` (placeholders `<…>`/`{…}` non jugés) | **décision humaine du 11/08** (TF-0090) | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |

## F. Livrables et archivage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 16 | Les rapports finaux destinés à l'humain (DOSSIER-MEP, PV, revues) sont **copiés** dans `output\` au nommage daté (n° 4) — l'original de travail reste sous `forge\etapes\` | cohérence avec `digit-ai-forge-agents/output/` | produits | S | faible | **défaut** |
| 17 | Les journaux d'oracles (`*.oracles.json`, `*.oracles-historique.jsonl`) sont versionnés dans `forge\` (ce sont des preuves), ignorés partout ailleurs | observée : présents dans Produit-12/forge/ | produits | P0 (.gitignore) | nul | option (conflit C4) |
| 18 | `forge\retours\` existe (gabarit inclus) ; chaque lot de retours forges est un fichier `RETOURS-<AAAAMMJJ><indice>.md` — un fichier par lot, ids en séquence continue par produit, **jamais modifié après remise** ; remise = copie dans `input\` du pilot | **mandat humain du 06/08** ; format éprouvé 2× (Produit-12/forge/RETOURS-FORGES*.md) | produits, nouveaux + rattrapage | P0+S+O | faible | **adoptée** (décision 06/08) |

## G. Circuit des conventions (D-13) — traçabilité organization → pilot

Aboutissement de Q-B (TF-0039, constat du 11/08). Le circuit — proposition `D-xx` chez
organization → remise au pilot → **décision humaine** → encodage ici + oracle — a été
traversé en réel une première fois : **D-03/Q3-bis → règle 4 → oracle de conformité**
(les deux documents se référencent). État de chaque proposition, sans raccourci : rien
n'est encodé sans décision, rien de décidé n'est laissé sans encodage tracé.

| D-xx (organization, décidées 08-09/08) | Encodage corpus | État |
|---|---|---|
| D-01 `output/` ≠ artefacts de build | règle 2 (`dist/` hors périmètre : pas un livrable) | encodée |
| D-02 indice obligatoire + archivage `Old\` sans effacement | règles 5 et 7 | encodée — reste ouvert : emplacement/graphies de `Old` (→ TF-0084) |
| D-03 préfixe = nom du projet (Q3-bis) | règle 4 | **encodée — cas d'école du circuit** |
| D-04 taxonomie des types, registre `registre-types.json` | aucune règle corpus | en attente de décision pilot : opposable aux produits ? (→ TF-0084) |
| D-05 `CLAUDE.md` point d'entrée, compléments référencés | règle 11 + gabarit `CLAUDE-PRODUIT.md` | encodée |
| D-06 `input/` = fourni par l'humain · `output/` = ce qui sort | règles 1 et 2 | encodée — la précision « la doctrine n'est pas une sortie » reste une proposition (→ TF-0084) |
| D-07 artefacts de traçabilité : patron optionnel | non-obligation explicite | sans objet |
| D-08→D-11 livrable HTML sortant : charte + autonomie + généré | mécanisme livrable, pas socle projet : `references\BEST-PRACTICES-HTML.md` + socle `digit-ai-page-html` + recette `check_html`/`render_page` (loi qualité) | couvertes — **défaut constaté** : le contrôle réseau exécutable annoncé par D-10 est absent de `check_html.py` (→ TF-0085) |
| D-12 composant partagé : inliner, jamais installer en douce | garde-fou pilot « aucune écriture dans les dépôts frères hors mandat » | encodée |
| D-13 le circuit lui-même | CLAUDE.md pilot, ligne de gouvernance Q-B | encodée |
| D-14 `forge-steering` → `forge-pilot` | répercuté partout (bootstrap, README, schéma) | constatée |

Q4 (conventions internes aux fichiers) reste ouverte **côté organization** — pas une
décision pilot tant qu'aucune proposition n'est remise.

## Conflits à trancher (ta décision explicite)

- **C1 — `Old\` vs git (n° 6/7)** : deux magasins de versions divergent toujours. Proposition :
  git seul pour le code (n° 6) ; `Old\` réservé aux **livrables documentaires** comme rangement
  de lisibilité (les versions datées coexistent, `Old\` désencombre le dossier courant — git
  garde l'histoire de toute façon). Alternatives : (a) git seul partout, jamais d'`Old\` ;
  (b) la proposition ci-dessus ; (c) `Old\` seulement hors dépôts git. **Recommandé : (b).**
- **C2 — n° 8 vs garde-fou actuel** : le CLAUDE.md pilot dit aujourd'hui « création du dépôt
  git du produit sur validation humaine ». La règle 8 inverserait : init + commits **locaux**
  par défaut (traçabilité dès la naissance), seuls remote/push restant sur ton GO. **Recommandé :
  adopter la règle 8** (le commit local est réversible, l'absence d'historique ne l'est pas).
- **C3 — nommage daté et code** : `main.py` ne s'appellera jamais `Digit-AI - main - 20260806a.py`.
  La règle 4 est scopée livrables ; le code suit les conventions de son langage. À confirmer.
- **C4 — journaux d'oracles** : versionnés = dossiers `forge\` chargés mais preuves rejouables ;
  ignorés = léger mais preuves perdues au clone. **Recommandé : versionnés (n° 17).**

## Après ta décision (2e mandat, non anticipé)

Les règles retenues s'encoderont dans : la **phase 0 de PROMPT-PRODUIT.md** (création du socle
P0), le **CLAUDE.md pilot** (vérifications S, y compris rattrapage en run de version), et un
**oracle « conformité projet »** exécutable (contrôles O, binaires — le n° de règle devient le
n° de finding). Rattrapage des projets existants : appliqué au prochain run de version de
chaque produit, jamais en masse silencieuse.

---

## Annexe — inventaire (preuves)

| Dépôt | CLAUDE.md | README | .env.example | input\ | output\ | Old\ | git | fichiers datés |
|---|---|---|---|---|---|---|---|---|
| pilot | ✔ | ✔ | — | ✔ | — | — | ✔ | 0 |
| conception | — | ✔ | — | — | — | — | ✔ | 2 |
| design | — | ✔ | ✔ | ✔ | — | — | ✔ | 1 |
| development | — | ✔ | — | ✔ | — | — | ✔ | 1 |
| tests | — | ✔ | ✔ | — | — | — | ✔ | 7 |
| agents | — | ✔ | — | ✔ | ✔ | — | ✔ | 14 |
| **Produit-12** (produit forge) | **—** | **—** | — | ✔ | — | — | **—** | 0 |
| ASDMailManager | — | ✔ | ✔ | ✔ | — | — | ✔ | 2 |
| Produit-02.com | — | ✔ | ✔ | ✔ | — | — | ✔ | 0 |
| Transcript | — | — | — | ✔ | ✔ | — | — | 0 |
| BeefProject | — | — | — | ✔ | ✔ | — | — | 2 |

`Old\` : une seule occurrence sur tout `c:\dev` (`OptimAssur/old`). CLAUDE.md : 13 occurrences
sur `c:\dev` (11 projets maison + pilot + inZM), zéro dans les produits forge. Nommage daté :
motif `<Marque> - <Objet> - AAAAMMJJ<lettre>` vérifié sur 25+ fichiers, exclusivement documentaires.
