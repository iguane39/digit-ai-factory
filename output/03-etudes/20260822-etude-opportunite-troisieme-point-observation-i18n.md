# Étude d'opportunité — un troisième point d'observation pour le pan i18n — 20260822a

Instruite au gabarit `gabarits\ETUDE-OPPORTUNITE.md`, sur mandat humain du 22/08 (« traite
tous les todos et retours à faire »), pour l'item **TF-0463**. Périmètre d'écriture : ce
fichier et sa candidature. Aucun code de forge modifié par cette instruction.

## Seuil de déclenchement (vérifié AVANT rédaction)

- **Crée un objet durable** — oui : un point d'observation est un mécanisme permanent du pan,
  avec son extracteur, ses seuils et ses fixtures (R-31, `REGLES-PROJET.md` l.239).
  **Porte franchie.**
- **Touche ≥ 3 forges ou le noyau** — non : forge-tests seule.
- **Gain ≥ 3 avec preuve ≤ 2** — non : gain 5, preuve 5 (quatre défauts mesurés en production).
  Étude due par la première porte.

## 0. Traitement des entrants

La candidature instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.

- **TF-0463** (lot `digit-ai-fr - RETOURS - 20260822a`, ingéré le 22/08) : sur digit-ai.fr,
  201 pages FR / 201 EN en production, **aucun des deux points d'observation du pan i18n ne
  s'applique**.
- Faits cités par l'entrant et revérifiés en lisant le code du pan le 22/08 : `next.config.ts`
  porte `output: "standalone"` (aucune arborescence de pages sur le disque — hors champ par la
  décision explicite de TF-0405) ; le produit n'a pas de catalogue de chaînes (ses locales sont
  des composants dupliqués `Footer.tsx` / `FooterEn.tsx`), donc `catalogue_i18n.py` ne trouve
  aucune source.
- Fait aggravant, cité par l'entrant : **le produit est celui sur lequel le pan a été conçu** —
  l'étude fondatrice du 15/08 (une route sur 201, un menu à 4 entrées contre 9) a été faite ici.

## 1. Partition du problème

- **P1 — La source observée.** D'où le pan tire ce qu'il compare : arborescence servie,
  catalogue de chaînes, ou une troisième source encore non nommée.
- **P2 — Le déclenchement.** Comment le pan choisit son point d'observation, et ce qu'il rend
  quand aucun ne s'applique (aujourd'hui : NA/SKIP silencieux sur un produit à défauts réels).
- **P3 — Le coût de possession.** Un point d'observation de plus se maintient, se teste et se
  déclare ; trois points calibrés chacun sur un produit différent est précisément le mécanisme
  qui a produit ce trou.
- **P4 — Le régime de preuve.** Ce qu'un troisième point saurait affirmer, et ce qu'il
  déclarerait explicitement ne pas juger.

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation vérifiable, relue le 22/08/2026.

| Existant examiné | Citation | Verdict |
|---|---|---|
| Point 1 — build servi | `forge_tests\adaptateurs\i18n.py` : extraction sur l'arborescence servie, parité de routes et de menus | **ne couvre pas** un produit `standalone` : aucune page sur le disque, écarté par décision TF-0405 |
| Point 2 — catalogue de chaînes | `forge_tests\catalogue_i18n.py` (TF-0383) : complétude, paramètres, constance des libellés | **ne couvre pas** un produit sans catalogue — locales en composants dupliqués, forme dominante du parc selon l'entrant |
| Chrome partagé (TF-0464, corrigé le 22/08) | `i18n.py` : repère étendu à `<footer>` et rôles ARIA — recette `test_tf_0464_chrome_partage.py`, 5 cas | recouvre **partiellement** : corrige la cécité au pied de page, mais reste DANS le point 1 (exige une arborescence servie) |
| Métadonnées (TF-0466, corrigé le 22/08) | `constats_metadonnees()` + `test_tf_0466_metadonnees.py`, 5 cas | recouvre partiellement : compare une page servie à sa référence — même dépendance au point 1 |
| Chaînes littérales déclarées (TF-0465/0467, corrigé le 22/08) | `constats_chaines()` + `test_tf_0465_0467_chaines_et_lang.py`, 8 cas | **recouvre le cas de l'entrant sans arborescence** : la présence d'une chaîne déclarée se mesure sur une page servie quelconque, sans catalogue ni parité de routes |
| Signes d'i18n | `i18n.py`, `_signes_i18n()` : preuves POSITIVES qu'un produit prétend être multilingue | ne recouvre pas : décide s'il faut mesurer, pas comment |
| Garde des locales muettes | `i18n.py` : « aucune entrée de navigation lisible … parité NON jugée » | ne recouvre pas : déclare l'absence de mesure, ne la remplace pas |

En une phrase : **trois des quatre défauts de l'entrant sont désormais couverts** par les
correctifs du 22/08, et le quatrième (parité de routes sur un produit sans arborescence) est le
seul qui exigerait un troisième point d'observation.

## 3. État de l'art daté

**Non instruit**, et le motif est double, chacun vérifiable. (1) La question posée n'est pas
« comment mesure-t-on une traduction » — sujet où l'état de l'art abonde — mais « où observer
un produit dont le build ne laisse pas d'arborescence » : c'est une question d'outillage
interne au pan, sans littérature transposable. (2) Les correctifs du 22/08 (TF-0464 à TF-0467)
ont changé le périmètre du problème pendant l'instruction : instruire un état de l'art sur une
question qui vient de rétrécir aurait daté l'étude avant sa décision. Le plan de revue (§5)
rouvre explicitement ce point si le verdict est reconduit.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : RETENUE en partie, réfutée en partie. Retenue pour les trois défauts
  déjà couverts par les correctifs du 22/08 — mesuré : `constats_chaines` voit « Réponse
  courte » sans arborescence ni catalogue, `constats_metadonnees` voit les tags non traduits.
  Réfutée pour la parité de ROUTES : sur un produit `standalone`, aucun mécanisme ne dit
  aujourd'hui qu'une route existe en FR et pas en EN, et le coût du statu quo est nommé par
  l'entrant — une route sur 201 manquante était le constat fondateur du pan.
- **O1 — troisième point d'observation « site en ligne »** : mesurer sur les URL servies
  (sitemap, robots, crawl borné) au lieu du disque. Coût : dépendance réseau dans un pan
  aujourd'hui hors-ligne, gouvernance d'accès, et un troisième calibrage — exactement le
  mécanisme qui a produit le trou. Exclue à ce titre tant qu'une mesure ne prouve pas que le
  cas est fréquent.
- **O2 — lire la SOURCE plutôt que le build** : dériver les routes des fichiers de pages du
  dépôt (`app/`, `pages/`), indépendamment du mode de build. Coût : un extracteur par
  framework, avec le risque de dire faux sur les routes dynamiques. Exclue seule, retenue
  comme brique de O3.
- **O3 — déclaration par le projet, mesurée par le pan** : le produit déclare ses routes
  attendues par locale (fichier versionné, sur le modèle de `FORGE_TESTS_I18N_CHAINES` livré le
  22/08) ; le pan compare le déclaré au servi ou à la source, et **déclare non jugé** ce qui
  n'est pas déclaré. Coût : une convention de plus, à écrire une fois par produit multilingue.
  **Cohérente avec ce qui vient d'être livré** : rien de déclaré, rien de jugé.
- **O4 — différer jusqu'à une seconde occurrence** : attendre qu'un deuxième produit du parc
  présente le même trou avant de construire. Coût : le trou reste ouvert sur digit-ai.fr, mais
  les défauts qu'il masquait sont désormais vus par trois autres chemins.

## 5. Verdict

- **Option retenue** : O3 — déclaration des routes attendues par locale, jugée par le pan, non
  jugé déclaré pour le reste.
- **Coût** : complexité moyen × durée court (un lecteur de déclaration, une comparaison, deux
  fixtures) ; dette assumée : une convention de plus à connaître pour les produits multilingues.
- **Candidature émise** : `input\01-candidatures\candidature-routes-declarees-i18n.tf.jsonl`
  (sidecar, en attente de GO humain — rien n'est construit par cette étude).
- **Plan de revue** : 2026-09-22 — si aucun produit n'a déclaré ses routes d'ici là, le verdict
  bascule sur O4 (différer) et la candidature est retirée ; si un second produit `standalone`
  arrive avant, l'état de l'art (§3) est instruit à ce moment.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé O0-O4 tenu ; chaque ligne de non-recouvrement citée ;
état de l'art déclaré non instruit avec son motif ; O0 traitée explicitement, partie par partie.
