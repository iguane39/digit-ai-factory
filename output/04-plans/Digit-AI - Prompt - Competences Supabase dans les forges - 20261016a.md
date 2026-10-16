# Prompt — Ajouter les compétences Supabase aux forges, sur le modèle d'Azure et de Databricks

Run de mandat transverse (`references\RUN-MANDAT.md`), ouvert depuis le pilot `digit-ai-factory`.

## Intention

Un produit construit sur Supabase (Postgres hébergé, authentification, stockage, fonctions Edge) doit être conçu, audité, testé et mis en production par les forges avec le même niveau d'outillage qu'un produit Azure ou Databricks aujourd'hui. Le résultat sert l'intention si un run de produit Supabase trouve, à chaque étape, sa fiche expert, sa cible de plan de MEP, son profil d'audit et son profil-moteur, chacun prouvé par une fixture rouge et une verte. Il n'en sert que la lettre s'il ajoute des fichiers que rien n'appelle (loi n° 1 : toute affordance est câblée ou n'existe pas).

## Modèle à reproduire : les 5 surfaces où Azure et Databricks existent (relevé du 16/10/2026)

| Surface | Existant Azure / Databricks | Équivalent Supabase attendu |
|---|---|---|
| forge-agents, fiches expert | `.claude/skills/experts-forge/fiches/expert-ops-azure.md`, `expert-data-platform-cloud.md` ; verdict d'admission `run-admission/verdict-ops-azure.json` | `expert-ops-supabase.md` admis par le même protocole (`run-admission/profil-admission.json`, `rubrique-armee.md`), verdict `verdict-ops-supabase.json` |
| forge-ops, cibles de plan | `scripts/ops.mjs` : `PLANS.azure` (l. 336), `PLANS["databricks-bundle"]` (l. 414) ; `oracles/oracle-ops.mjs` l. 117 (table `CLI`) ; `oracles/self-test.mjs` l. 173 et 191 | `PLANS.supabase` : 4 phases (provision, déploiement, healthcheck, rollback), placeholders, zéro credential, publication sur GO humain (R-38) ; entrée `supabase: "supabase "` dans `CLI` ; cible ajoutée aux deux boucles du self-test |
| forge-audit, profils | `profiles/azure/` et `profiles/databricks-lakehouse/` (README.md + bindings.json, contrôles AuditCore instanciés avec `verification_command` et `evidence`) | `profiles/supabase/` : RLS activée sur toute table exposée par l'API, clé `service_role` absente du code client, politiques de stockage, configuration d'auth, sauvegardes et restauration à un instant, restrictions réseau, SSL imposé |
| forge-data, profils-moteur | `references/profils-moteur/azure-sql.md`, `databricks.md`, `postgres.md` ; doctrine `LISEZMOI.md` | Décider par non-recouvrement (R-28) : Supabase est un Postgres. Soit `supabase.md` justifie ce qu'il ajoute à `postgres.md` (schémas `auth`, `storage`, politiques RLS, export `supabase db dump`), soit `postgres.md` gagne une section Supabase. Le verbe `importer` n'est étendu que si un artefact réel l'exige |
| pilot, garde-fous | `oracles/oracle-conformite-projet.mjs` l. 1489 (`PROFILS_AUTH`), `gabarits/gitignore-produit` l. 33-36, `REGLES-PROJET.md` R-14 | Fichiers d'authentification et dossiers locaux du CLI Supabase ajoutés à `PROFILS_AUTH` et au gabarit `.gitignore`, après lecture de la documentation officielle |

## Contraintes

- Chaque commande, nom de fichier ou chemin propre à Supabase se tire de la documentation officielle (supabase.com/docs), citée avec sa date de lecture dans le frontmatter `sources` (loi n° 4). Rien de mémoire.
- Aucune connexion à un projet Supabase vivant, aucun appel payant, aucun jeton dans un plan ou un fichier : les forges jugent des artefacts exportés (DDL, `config.toml`, migrations).
- Chaque ajout porte sa fixture rouge et sa verte ; l'oracle de la forge passe de rouge à vert et le self-test complet reste à exit 0.
- Un `createHash` neuf se déclare dans `references/EMPREINTES.md` et passe `oracle-empreintes` avant le harnais.
- Chaque surface s'enregistre au registre par `journaliser.mjs` (un item TF par forge, classe existante), avec la version de forge montée et son CHANGELOG.
- Forges : mandat permanent d'écriture et de push. Pilot : commit local, push sur GO humain.
- Hors périmètre sauf décision humaine : un profil forge-websec (clé `service_role` dans un bundle front) et un pitch marketing ; les proposer en candidats.

## Ordre

1. Lire la documentation Supabase (CLI, migrations, branching, RLS, sauvegardes) et dater chaque source.
2. forge-agents : fiche expert puis admission.
3. forge-ops : cible `supabase`, oracle et self-test.
4. forge-audit : profil `supabase`.
5. forge-data : décision R-28, puis profil ou section.
6. Pilot : garde-fous R-14 et gabarit `.gitignore`.
7. Clore : exigences tenues sur exigences posées, oracles exécutés avec leurs codes de sortie, restitution selon `gabarits\RESTITUTION.md`.
