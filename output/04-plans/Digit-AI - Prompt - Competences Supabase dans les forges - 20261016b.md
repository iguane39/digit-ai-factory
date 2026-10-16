# Prompt — Ajouter les compétences Supabase aux forges, sur le modèle d'Azure et de Databricks

Version b du 16/10/2026, réécrite par `prompt-analyzer-l99` à partir de la version a (même dossier).
Run de mandat transverse (`references\RUN-MANDAT.md`), ouvert depuis le pilot `digit-ai-factory`.

## Intention

Un produit construit sur Supabase (Postgres hébergé, authentification, stockage, fonctions Edge)
doit être conçu, audité, testé et mis en production par les forges avec le même outillage qu'un
produit Azure ou Databricks aujourd'hui. Le résultat sert l'intention si un run de produit Supabase
trouve, à chaque forge où Databricks ou Azure ont une surface, son équivalent Supabase, prouvé par
une fixture rouge et une verte et appelé par le code qui sert déjà Azure ou Databricks. Il n'en sert
que la lettre s'il ajoute des fichiers que rien n'appelle (loi n° 1 : toute affordance est câblée
ou n'existe pas).

## ÉTAPE 0 — prérequis mesurés avant tout travail

1. **Fraîcheur des dépôts.** `git fetch` sur le pilot et sur chaque forge touchée ; tout dépôt en
   retard se rebase avant le premier commit (deux postes publient sur les mêmes dépôts).
2. **Accès à la documentation.** Mesuré le 16/10/2026 à 10:25 : `curl -L` anonyme, poste local,
   code 200 sur trois pages (`/docs/guides/local-development/cli/getting-started`,
   `/docs/guides/database/postgres/row-level-security`, `/docs/reference/cli/introduction`).
   Rejouer la mesure à l'ouverture. En cas d'échec : essayer WebFetch, puis le dépôt public
   `supabase/supabase` (dossier `apps/docs`) ; si tout échoue, s'arrêter en `bloque_question`.
   Aucune valeur Supabase ne s'écrit de mémoire.
3. **Relevé des surfaces par mesure, pas par liste.** Pour chaque dépôt du parc, compter
   `git grep -il databricks` et `git grep -il azure`. Le relevé du 16/10/2026 donne Databricks dans
   forge-agents (10 fichiers), forge-audit (43), forge-data (22), forge-ops (4), **forge-tests (4)**
   et le pilot (36) ; Azure en plus dans forge-development (29) et forge-conception (1). Toute
   forge où l'un des deux comptes est non nul reçoit une décision écrite : surface Supabase à
   créer, ou écart motivé. La table ci-dessous est un point de départ, pas un plafond.
   *Correctif du 16/10/2026, relecture aveugle d'une autre session* : les 4 fichiers de
   forge-tests commentent un défaut corrigé (TF-0381, variables Databricks réclamées à tort), les
   mentions Azure de forge-development visent Azure DevOps (hôte git et pipelines), celle de
   forge-conception un terme SSO d'`oracle-ears`. Aucune n'est une surface à reproduire : chacune
   reçoit un écart motivé.
   **Idempotence (ajout du 16/10/2026, seconde relecture aveugle).** Compter aussi
   `git grep -il supabase` dans chaque dépôt. Après le run du 16/10/2026, il rend 9 fichiers dans
   forge-agents, 8 dans forge-ops, 10 dans forge-audit, 4 dans forge-data et 15 au pilot. Une surface
   déjà présente s'audite contre le contrat de sortie ; elle ne se recrée pas. Seul ce qui y manque
   se complète.
4. **Ancrage par symbole.** Les numéros de ligne de la table datent du 16/10/2026 et dériveront :
   l'exécutant retrouve chaque point par son symbole (`PLANS.azure`, `const CLI`, `PROFILS_AUTH`),
   jamais par la ligne.

## Surfaces à reproduire (relevé du 16/10/2026)

| Surface | Existant Azure / Databricks | Équivalent Supabase attendu |
|---|---|---|
| forge-agents, fiches expert | `.claude/skills/experts-forge/fiches/expert-ops-azure.md`, `expert-data-platform-cloud.md` ; verdicts `run-admission/verdict-ops-azure.json` (et `-aws`, `-gcp`, `-railway`) | `expert-ops-supabase.md` admis par le même protocole (`run-admission/profil-admission.json`, `rubrique-armee.md`), verdict `verdict-ops-supabase.json` |
| forge-ops, cibles de plan | `scripts/ops.mjs` : entrée `azure` de `PLANS` (l. 334), `PLANS["databricks-bundle"]` (l. 414) ; `oracles/oracle-ops.mjs`, table `CLI` (l. 117) ; `oracles/self-test.mjs`, deux boucles de cibles (l. 173 et 191) | Entrée `supabase` : 4 phases (provision, deploiement, healthcheck, rollback), placeholders, zéro credential, publication sur GO humain (R-38) ; `supabase: "supabase "` dans `CLI` ; cible ajoutée aux deux boucles du self-test. Le rollback cite ce que la documentation offre réellement ; s'il n'existe pas de retour arrière natif des migrations, la phase le dit et décrit la voie retenue (migration corrective, restauration à un instant) |
| forge-audit, profils | `profiles/azure/`, `profiles/databricks-lakehouse/` (README.md + bindings.json, contrôles AuditCore avec `verification_command` et `evidence`) | `profiles/supabase/`. Contrôles candidats, chacun à confirmer par une page datée de la documentation avant d'entrer : RLS activée sur toute table exposée par l'API, clé `service_role` absente du code client, politiques de stockage, configuration d'auth, sauvegardes et restauration à un instant, restrictions réseau, SSL imposé. Un contrôle sans source datée sort du profil et devient candidat |
| forge-data, profils-moteur | `references/profils-moteur/azure-sql.md`, `databricks.md`, `postgres.md` ; doctrine `references/profils-moteur/LISEZMOI.md` | Décision écrite selon la doctrine de `LISEZMOI.md` (référentiel versionné, pas un verbe) : soit `supabase.md` dit ce qu'il ajoute à `postgres.md` (schémas `auth`, `storage`, politiques RLS, export par le CLI), soit `postgres.md` gagne une section Supabase. Le verbe `importer` ne s'étend que sur une fixture d'export réel, prouvée par non-recouvrement (R-28, comme le prévoit `LISEZMOI.md` l. 25) |
| forge-tests | `forge_tests/noyau.py` l. 116, `forge_tests/actions.py` l. 339, `tests/test_tf_0381_action_sans_issue.py` : variables `DATABRICKS_*` réclamées par pan | **Sans objet** (correctif de l'étape 0) : ces lignes commentent un défaut corrigé, aucune surface à reproduire ; écart motivé au bilan. Décision initiale, conservée pour trace : les variables Supabase (URL de projet, clé publique) sont-elles sollicitées par pan selon la même règle (R-48), et les tests de base de données du CLI sont-ils un pan testable ? Créer ou écarter avec motif |
| pilot, garde-fous | `oracles/oracle-conformite-projet.mjs`, contrôle R-14 (l. 1478) et motif `PROFILS_AUTH` (l. 1489) ; `gabarits/gitignore-produit` l. 33-36 | Fichiers d'authentification et dossiers locaux du CLI Supabase ajoutés à `PROFILS_AUTH` et au gabarit `.gitignore`, chacun tiré d'une page datée de la documentation ; fixture rouge (fichier versionné) et verte dans le self-test de conformité |

## Contraintes

- Toute commande, nom de fichier, chemin ou capacité propre à Supabase se tire de la documentation
  officielle (supabase.com/docs), citée avec sa date de lecture (loi n° 4). Le support de la
  source dépend du type de fichier : le frontmatter `sources` en Markdown ; un tableau `sources[]`
  dont chaque entrée porte `url` et `lu_le` en JSON, comme `profiles/supabase/bindings.json` ; un
  commentaire daté qui cite l'adresse en `.mjs`. Les éléments Supabase écrits dans ce prompt sont des hypothèses à confirmer, pas des
  faits.
- Aucune connexion à un projet Supabase vivant, aucun appel payant, aucun jeton dans un plan ou un
  fichier : les forges jugent des artefacts exportés (DDL, `config.toml`, migrations).
- Chaque ajout porte sa fixture rouge et sa verte ; l'oracle de la forge passe de rouge à vert, le
  self-test complet reste à exit 0, et la nouvelle entrée est appelée par le même code qui appelle
  l'entrée Azure ou Databricks (preuve : `git grep` du symbole).
- Un `createHash` neuf se déclare dans `references/EMPREINTES.md` et passe `oracle-empreintes`
  avant le harnais.
- Chaque surface s'enregistre au registre par `journaliser.mjs` (un item TF par forge, classe
  existante), avec la version de forge montée et son CHANGELOG.
- Forges : mandat permanent d'écriture et de push, push vérifié par `git rev-list`. Pilot : commit
  local (`git commit --only`), push sur GO humain.
- Hors périmètre sauf décision humaine : un profil forge-websec (clé `service_role` dans un bundle
  front) et un pitch marketing ; les proposer en candidats.

## Ordre

1. ÉTAPE 0, puis lecture de la documentation (CLI, migrations, branching, RLS, sauvegardes), une
   source datée par fait utilisé.
2. forge-agents : fiche expert puis admission. La fiche fixe le vocabulaire des étapes suivantes.
3. forge-ops, forge-audit, forge-data et forge-tests : indépendants entre eux, parallélisables
   (`CONTRAT-INTERFACE.md` §4 pour le routage des agents).
4. Pilot : garde-fous R-14 et gabarit `.gitignore`.
5. Clore selon `references\RUN-MANDAT.md` et `gabarits\RESTITUTION.md`.

## Contrat de sortie

- Une ligne par forge de l'ÉTAPE 0 : surface créée (chemin) ou écart motivé ; aucune forge au
  compte Databricks non nul sans ligne.
- Par surface créée : oracle rouge puis vert, codes de sortie relevés ; self-test de la forge à
  exit 0 ; symbole appelé (sortie de `git grep`).
- Zéro valeur Supabase sans source datée (contrôle : chaque fichier neuf porte `sources` au
  frontmatter, et chaque commande du plan ops figure dans une page citée).
- Zéro jeton, URL de projet réelle ou clé dans les fichiers ajoutés. Aucun oracle `oracle-secrets`
  n'existe dans le parc : le contrôle est un `git grep -E` des motifs `sb_secret_…`,
  `eyJ….…` et `<ref de 20 lettres>.supabase.co` sur les fichiers du commit, sortie relevée.
- Items TF journalisés, versions montées, CHANGELOG à jour, push des forges vérifié.
- Synthèse nommée selon R-4 et R-25 : `Digit-AI - Synthese Mandat - Competences Supabase dans les
  forges - AAAAMMJJ<indice>.md`, dans `output\04-plans\`, jugée PASS par `oracle-synthese`.

## Protocole de tests

Chaque forge joue son oracle sur trois cas : la fixture verte (plan ou profil complet), la fixture
rouge (phase `rollback` vide, table sans RLS, fichier d'auth versionné), et un cas limite (cible
`supabase` sans commande `supabase ` en phase de déploiement). Boucle bornée à 3 itérations par
surface ; au-delà, livrer avec la liste des écarts résiduels.
