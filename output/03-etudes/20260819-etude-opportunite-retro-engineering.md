# Étude d'opportunité — rétro-engineering d'un ou plusieurs projets — 20260819a

Instruite au gabarit `gabarits\ETUDE-OPPORTUNITE.md`. Périmètre d'écriture de cette
instruction : ce fichier et son sidecar de candidature. Aucune forge créée, aucun service
construit, aucun skill modifié, aucun commit — la décision reste humaine (R-29).

Première des trois études du mandat du 19/08 (besoins : rétro-engineering ·
rétro-documentation · forge-consulting). Les deux suivantes la citent.

## Seuil de déclenchement (vérifié AVANT rédaction)

- **Crée un objet durable** — oui : toute option de construction produit au minimum un
  service catalogué, ses oracles et ses surfaces d'intégration (R-31,
  `REGLES-PROJET.md` l.239). **Porte franchie.**
- **Touche ≥ 3 forges ou le noyau** — oui : l'acquisition d'un existant mobilise au moins
  conception (entrant), data (schémas), tests (surface exécutable).
- **Gain ≥ 3 avec preuve ≤ 2** — oui : gain estimé 4, preuve 2 (aucun incident consigné,
  demande humaine directe). Étude obligatoire par les trois portes.

## 0. Traitement des entrants

La demande instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.

- **Demande humaine du 19/08** (session pilot, prompt réécrit L99 validé « vas ») :
  « Rétro-engineering d'un ou plusieurs projets existants (code, paramétrage, data,
  services) pour en reconstruire la compréhension. »
- **Antériorité au registre** : `grep -iE "conseil|consulting|retro"` sur
  `todo\TODO.jsonl` exécuté le 19/08/2026 — 14 hits, tous homonymes (« retrouver »,
  « rétroactivité », « conseil de réparation K7 ») : **aucun candidat existant** sur ce
  sujet. Cette étude n'écrase aucune instruction antérieure.

## 1. Partition du problème

- **P1 — Acquisition** : lire un projet existant (code, configuration/paramétrage,
  schémas de données, services exposés) et en reconstruire un modèle vérifiable.
- **P2 — Restitution** : projeter ce modèle en documents pour des audiences — territoire
  de l'étude 2 (rétro-documentation), exclu ici.
- **P3 — Hébergement** : service dans une forge existante vs nouvelle forge vs skill.
- **P4 — Régime de preuve** : comment juger qu'une rétro-compréhension est exacte —
  confrontation au code exécutable, jamais déclaration.

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation vérifiable, relue le 19/08/2026 en lecture seule.

| Existant examiné | Citation | Verdict |
|---|---|---|
| Skill `qualifie-l-entrant` — types d'entrant | `%USERPROFILE%\.claude\skills\qualifie-l-entrant\SKILL.md` l.3 : « produit à reprendre, produit à faire évoluer, produit tiers à répliquer » ; l.38-40 : seuils de suffisance par type (« dépôt lisible et ≥ 1 point d'entrée énuméré ») | **recouvre PARTIELLEMENT** — le tronc de l'acquisition existe, mais borné à la suffisance pour UNE conception (ENTRANT.md) ; ni paramétrage, ni data, ni services au protocole |
| Catalogue — qualification prouvée | `catalogues\CATALOGUES.md` l.10, cat-con-01 : « qualifier mon idée, CDC ou produit existant en entrant exploitable », preuve « run pilote 04/08/2026 — chaîne complète exercée » | recouvre partiellement — même borne que ci-dessus, mais prouvé, donc socle de composition |
| Run de version — flux produit existant | `README.md` l.113-116 : « Faire évoluer ou remédier LE produit de CE dossier (run de version) » ; `references\RUN-VERSION.md` l.4-9 : « le ledger du run N est l'entrée du run N+1 » | ne recouvre pas — présuppose un produit DÉJÀ construit par la forge, avec ledger ; un projet tiers arrive sans ledger |
| Skill `enumere-la-surface` | `SKILL.md` l.3 : surfaces énumérées « d'un CDC ou d'un dépôt existant » ; exclusion : « la surface d'un produit déjà construit à des fins de test (→ Forge Tests, qui l'énumère depuis le code exécutable) » | recouvre PARTIELLEMENT — l'énumération fonctionnelle depuis dépôt existe, mais oriente conception, sans volets data/paramétrage/services |
| forge-tests — inventaire sans exécution | `catalogues\CATALOGUES.md` l.52, cat-tst-05 : « cartographier la surface de test sans rien exécuter », statut *déclaré*, « non exercé isolément sur cas réel » | recouvre partiellement — surface de TEST seulement, et non prouvé |
| forge-data — schéma et base | `catalogues\CATALOGUES.md` l.94, cat-dat-06 : « dériver un brouillon d'assertions et de contrat depuis le schéma exporté » (prouvé TF-0139) ; l.96, cat-dat-08 : « exécuter des requêtes SQL en lecture seule » (prouvé RD-3, 7,2 M lignes) | recouvre le volet DATA de l'acquisition — rien à créer de ce côté, à composer |
| forge-audit — référentiel POC-to-Prod | `catalogues\CATALOGUES.md` l.110, cat-aud-01 : « auditer la gouvernance et l'architecture de mon produit vers la production » | ne recouvre pas — l'audit JUGE contre un référentiel, il ne reconstruit pas un modèle du produit |
| Skill `github-repo-analyzer` | `SKILL.md` l.1-15 : « grille canonique en 8 dimensions notées /5 (activité, architecture, qualité, sécurité…) », livrables MD + HTML | recouvre l'audit de SANTÉ d'un dépôt — une note, pas un modèle fonctionnel ; aucun volet paramétrage/services |
| Registre des insatisfactions | `insatisfactions\REGISTRE.jsonl`, grep exécuté le 19/08/2026 : 0 occurrence rétro/conseil | ne recouvre pas — et aucun coût payé n'est consigné : la preuve du besoin est la demande humaine, pas une facture |

En une phrase : l'acquisition existe en fragments prouvés (entrant, surface, data, tests)
mais personne n'assemble un modèle complet multi-volets d'un projet tiers, et le volet
paramétrage/services n'est au protocole de personne.

## 3. État de l'art daté

Sources relevées par recherche web exécutée le 2026-08-19 ; les chiffres marqués
« relayé » proviennent de sources secondaires, non vérifiés à la source primaire.

- **Thoughtworks Technology Radar** — technique « Using GenAI to understand legacy
  codebases » (thoughtworks.com/radar, consulté le 2026-08-19) : l'approche est
  installée dans l'industrie (outils cités : CodeConcise, Driver AI, bloop, Cody).
- **Thoughtworks CodeConcise** — compression du rétro-engineering de 6 semaines à 2
  (relayé par softwareseni.com, consulté le 2026-08-19).
- **METR, essai contrôlé randomisé (2025-07)** — développeurs expérimentés **19 % plus
  lents** avec IA sur des bases matures complexes, temps brûlé à vérifier des sorties
  subtilement fausses (metr.org, consulté le 2026-08-19). C'est l'argument central du
  régime de preuve P4 : une rétro-compréhension non confrontée à l'exécutable coûte
  plus qu'elle ne rapporte.
- **EPAM ART (AI Reverse-engineering Tool)** — structures de code, zones de
  modernisation, BRD générés (solutionshub.epam.com/solution/art, consulté le
  2026-08-19).
- **Gartner (relayé par entrans.ai, consulté le 2026-08-19)** — 40 % des projets de
  modernisation legacy incorporeraient du rétro-engineering assisté IA d'ici 2026,
  contre moins de 10 % en 2023. Le risque documenté : règles métier hallucinées,
  plausibles et fausses, propagées dans le système cible.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : RÉFUTÉE. Le statu quo laisse le tronc borné à la conception
  (cat-con-01) : un projet tiers dont on veut la compréhension SANS lancer une
  conception n'a aucun point d'entrée, et les volets paramétrage/services ne sont au
  protocole d'aucun objet versionné (tableau §2, lignes 1, 4, 5). Coût : chaque
  reprise réelle improvise l'acquisition, sans régime de preuve — exactement le mode
  d'échec documenté par METR (§3).
- **O1 — service « rétro-modèle » adossé à l'existant** : étendre le protocole
  d'extraction de `qualifie-l-entrant`/forge-conception d'un mode « modèle complet »
  (fonctionnel + technique + paramétrage + data + services), par COMPOSITION des
  capacités prouvées (cat-dat-06/08 pour la data, cat-tst-05 pour la surface
  exécutable), avec un oracle de confrontation au code (P4 : toute affirmation du
  modèle cite fichier + ligne, échantillon rejoué). Coût : quelques jours + oracle +
  fixtures ; dette : le mode vit dans un skill déjà chargé. Exclut : la restitution
  par audiences (étude 2).
- **O2 — nouvelle forge dédiée (forge-retro)** : 14e dépôt. Coût de possession
  permanent : bootstrap, fiche d'audit, catalogue, self-test, non-recouvrement R-31 —
  pour un contenu qui serait à 70 % de la composition d'existant (tableau §2). Exclue
  par ce ratio, tant qu'un run réel n'a pas prouvé que le service déborde son hôte.
- **O3 — skill transverse hors pipeline** : un skill autonome dupliquerait le protocole
  d'extraction de `qualifie-l-entrant` au lieu de l'étendre — deux protocoles
  divergeraient à la première révision. Exclue.
- **O4 — fusion avec la rétro-documentation (étude 2)** : un seul objet
  acquisition + restitution. Instruite comme l'exige le mandat : la fusion est retenue
  au niveau de la CHAÎNE (le modèle de O1 est l'entrée unique de la restitution),
  mais pas au niveau de l'objet — les régimes de preuve diffèrent (confrontation au
  code ici, fidélité au modèle et adéquation d'audience là), et un objet unique
  cumulerait les deux dettes. La couture est un contrat d'artefact, pas un objet
  commun.

## 5. Verdict

- **Option retenue** : O1 — service « rétro-modèle » par extension de
  `qualifie-l-entrant`/forge-conception, composition des capacités data et tests
  prouvées, oracle de confrontation au code dès la v0 (R-31).
- **Coût** : 3-5 jours (protocole étendu + oracle + fixtures rouge/verte + entrée
  catalogue) ; dette assumée : le volet « services exposés » naîtra déclaré, prouvé au
  premier run réel.
- **Candidature émise** : `input\01-candidatures\candidature-retro-modele.tf.jsonl`
  (sidecar, en attente de GO humain — rien n'est construit par cette étude).
- **Plan de revue** : 2026-09-19 — confronter le verdict au premier run réel de reprise
  d'un projet tiers ; si aucun run n'a eu lieu, requalifier la preuve du besoin.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé tenu ; chaque ligne de non-recouvrement citée ;
sources datées ou marquées relayées ; O0 traitée explicitement.
