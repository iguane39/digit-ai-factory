# Étude d'opportunité — écart servi ↔ versionné (TF-0288) — 20260817a

## Seuil de déclenchement (vérifié)

TF-0288 **crée un objet durable** (un contrôle d'écart nouveau — R-31) et touche
2 forges (`digit-ai-forge-tests`, `digit-ai-forge-ops`). Étude obligatoire avant `decide`.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.
Sources : TF-0288 (candidat du 15/08, constat en passant de l'instruction INS-0001),
`output/05-insatisfactions/INS-0001/INSTRUCTION.md` bloc b (« le menu EN complet EXISTE
dans la source — l'écart vit entre la source et ce que la production sert »).

## 1. Partition du problème

- **P-a Détection** : constater mécaniquement qu'une surface SERVIE diverge de ce que
  la SOURCE versionnée produit (le cas INS-0001 : HeaderEn.tsx porte 8 entrées / 36
  liens, la production en sert 3).
- **P-b Prévention** : faire que le déploiement lui-même ne puisse pas dériver
  (déployer un build tracé depuis une source tracée).
- **P-c Préalable** : un produit hors git n'a pas de « versionné » opposable — la
  comparaison n'a de sens que si la source de vérité existe (aggravant INS-0001 :
  ni git, ni CLAUDE.md sur digit-ai.fr).
- **P-d Appelant (R-35)** : qui joue le contrôle, et quand — sans appelant nommé, le
  contrôle n'existe pas.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Pan `i18n` de forge-tests (TF-0284) | `README.md` §Pan i18n : « Le pan lit le **build servi** […] Ni le code source (une locale peut y exister sans être servie) » | recouvre la parité ENTRE locales du servi ; ne compare jamais le servi à la source — le README l'exclut explicitement |
| Contrôle destinations React de forge-tests (TF-0283) | archive TF-0283 : « les 4 liens fautifs réels du 15/08 sont attrapés 4 sur 4 » — contrôle statique des `<Link>`/`<a>` des composants | recouvre la cohérence INTERNE de la source ; ne dit rien de ce que la production sert |
| Pan `qualif` de forge-tests | `README.md` §Pan qualif : « parcourt les routes UI » d'une « instance **servie et peuplée** » — page en erreur, console rouge, bouton sans effet | recouvre la santé du servi ; un menu amputé mais fonctionnel n'est en erreur nulle part |
| forge-ops `deployer/restaurer/etat` | `README.md` ops : « déployer mon produit avec bascule saine et retour arrière prouvé » ; `non_juge` : « santé applicative au-delà du healthcheck » | recouvre le GESTE de déploiement sain quand il passe par ops ; ne détecte pas la dérive d'un produit déployé par un autre canal (cas INS-0001) |
| `rendu-comparatif.mjs` (R-37, TF-0286) | `REGLES-PROJET.md` §Q : « le rendu se juge en pixels, pas en présence de liens » — avant/après d'une MÊME surface | recouvre la régression visuelle entre deux états ; ne compare jamais à la source versionnée |
| `oracle-skills.mjs` K2 (pilot) | verdict K2 : « la copie installée DIVERGE de \<source\> — c'est la copie qui s'exécute » | même CONCEPT (copie exécutée vs source versionnée), périmètre skills uniquement — preuve que le raisonnement est éprouvé, pas que le produit est couvert |
| R-37 al. 3 (rattrapage legacy) | `REGLES-PROJET.md` §Q : « rattrapage de la seule section Routage forge » au premier contact | recouvre le préalable P-c (poser git + routage) ; pas la détection P-a |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée ; le besoin est
défini par un incident interne mesuré (INS-0001) et l'instruction s'appuie sur les
mécanismes internes cités en section 2, tous exécutés les 15-17/08. La revue datée
(section 5) confrontera le contrôle au premier cas réel.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo cité (TF-0288) : « sans
  instruction, le correctif aurait porté sur du code déjà correct » — un développement
  inutile sur un défaut de déploiement, et un troisième « toujours pas » sur INS-0001.
- **O1 — contrôle de parité servi ↔ source chez forge-tests** : nouveau contrôle du pan
  i18n/interface — extraire la navigation des composants source (grammaire TF-0283) et
  des pages servies (lecture TF-0284), comparer entrée par entrée ; verdict machine,
  SKIP motivé si la source n'est pas accessible (P-c). Coût : ½-1 j, s'appuie sur deux
  grammaires déjà livrées. Exclut la prévention P-b (détecte, n'empêche pas).
- **O2 — empreinte de déploiement chez forge-ops** : `deployer` scelle une empreinte du
  build livré, `etat` la compare au servi. Coût : ½ j. Exclut tout produit déployé HORS
  ops — précisément le cas fondateur (digit-ai.fr n'a jamais vu ops) ; ne juge que ses
  propres déploiements.
- **O3 — les deux volets, chacun dans son domaine** : O1 (détection, jouable sur
  n'importe quel produit servi) + O2 (prévention, pour les déploiements outillés).
  Coût : 1-1,5 j sur deux dépôts. Exclut le mélange des domaines : tests juge, ops
  outille — aucune des deux forges ne porte le métier de l'autre.
- **O4 — règle pilot seule (étendre R-37 d'une obligation de comparaison)** : rejetée —
  une règle sans geste outillé n'est pas tenue hors run (constat fondateur de R-37
  lui-même : « une règle de vérification visuelle qui coûte plus qu'une commande n'est
  pas tenue »).

## 5. Verdict

- **Option retenue : O3** — la détection chez forge-tests (contrôle de parité
  servi ↔ source, SKIP motivé sans source accessible), la prévention chez forge-ops
  (empreinte scellée au `deployer`, comparée par `etat`) ; chaque volet dans le domaine
  de sa forge, aucun ne singe l'autre.
- **Coût** : 1-1,5 j sur deux dépôts ; dette assumée : un produit hors git reste
  détectable (O1 compare au working tree) mais sans version opposable — le SKIP le dit
  (P-c), et R-37 al. 3 pose le préalable au premier contact.
- **Candidature(s) émise(s)** : aucune nouvelle — TF-0288 existe ; décision : mandat
  global du 17/08 (« Traite tous les retours et tous les TODOs »), cette étude au dossier.
- **Plan de revue : 2026-09-15** — le contrôle a-t-il été joué sur un cas réel, et
  l'empreinte ops a-t-elle scellé au moins un déploiement ? Un contrôle jamais joué
  d'ici là est une décoration (R-35), à requalifier.
