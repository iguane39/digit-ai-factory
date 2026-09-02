# Retours forges — Produit-12 — 20260831a

- **Contexte** : clôture de la campagne forge-tests v0.4.0 (run `Produit-12-20260830b`,
  rapport `forge\etapes\tests\rapport-20260831.json`) — et **demande d'étude commanditée par
  l'utilisateur le 2026-08-31** : stratégie de tests et réduction des temps d'exécution sans
  perte de qualité, métriques du projet fournies à l'appui.
- **Références ledger** : `forge\ledger.jsonl` seq 93 (verdict de campagne), seq 96-97 (les retours)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-08-31 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RT s'arrêtait à RT-19 (lot 04).

---

## forge-tests (`digit-ai-forge-tests`)

La campagne v0.4.0 a coûté **67 minutes**, dont **~54 minutes de mutation** — 80 % du temps
pour un seul pan — pendant que la suite complète du produit (984 tests) tourne en **~52 s**.
Le premier retour est une **demande d'étude**, chiffrée ; le second, un défaut du détecteur
statique constaté sur pièces.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-20 | majeur | générique | **Demande d'étude approfondie : stratégie de tests et temps d'exécution des campagnes — le coût croît linéairement avec modules × mutants, et l'échantillonnage est déjà une concession au temps, pas une mesure choisie.** Mesuré sur la campagne v0.4.0 (2026-08-31) : durée totale 67 min, dont ~54 min de mutation — **115 mutants × ~37 s**, séquentiels. Or la suite complète du produit (984 tests) tourne en **~52 s** : ~37 s par mutant signifie que **chaque mutant rejoue une part quasi entière de la suite**, alors qu'une poignée de tests couvre la ligne mutée. L'échantillonnage actuel (3 mutants/module, plafond 400, `FORGE_TESTS_MUTANTS_PAR_MODULE`) borne la mesure par le budget temps : à couverture pleine du plafond, la mutation seule passerait à ~4 h (400 × 37 s). Et chaque campagne **rejoue tout**, même quand le delta du run ne touche que 10 modules sur 40 (lots A/B de ce run). Cadence mesurée au journal `forge\avancement.jsonl` : 0,57–0,60 module/min. Les axes demandés à l'étude : **sélection d'impact** (jouer les tests touchés par le diff, carte couverture module→tests, rejeu complet périodique en garde), **mutation ciblée par ligne** (ne rejouer par mutant que les tests couvrant la ligne mutée ; cache de verdicts des mutants inchangés entre campagnes, invalidé par empreinte du module et de sa suite), **parallélisation locale** (pytest-xdist pour la suite ; mutants en N processus — chaque test du produit monte déjà sa base SQLite isolée), **distribution multi-postes/serveurs** (file de mutants — le parc porte déjà `digit-ai-queue` —, agrégation au rapport), le tout sous un **garde-fou de non-perte** : sur un corpus de référence, la campagne optimisée rend le MÊME verdict que la campagne pleine (mêmes survivants, mêmes findings) — toute divergence est un défaut de l'optimisation, jamais un arrondi acceptable. Données fournies ci-dessous (« Données de mesure ») | Mener l'étude au niveau de la forge (elle vaut pour tout projet audité) ; livrer un plan par paliers, chaque palier avec son critère de non-perte exécutable ; le palier 1 le plus rentable est vraisemblablement la sélection par ligne mutée — il divise le coût du pan dominant sans toucher au périmètre mesuré |
| RT-21 | mineur | générique | **Le détecteur statique de codes déclarés ne voit pas une émission sous garde `try/except` : 4 faux écarts sur la campagne v0.4.0.** Les 4 divergences statiques publiées portent toutes sur les codes 400 neufs des lots A/B, et **tous les 4 sont exercés dynamiquement par le pan api de la même campagne** (api 483/483) — le constat statique contredit la mesure dynamique du même rapport, ledger seq 93 | Croiser le constat statique avec la couverture dynamique avant publication : un couple opération×code que le pan api a exercé n'est pas une divergence — le publier en « confirmé dynamiquement » plutôt qu'en écart |

### Données de mesure fournies à l'étude (RT-20)

Campagnes mesurées sur ce produit :

| Campagne | Date | Suite produit | Mutation | Durée campagne | Rapport |
|---|---|---|---|---|---|
| v0.1.0 | 2026-08-05 | 581 tests, ~17 s | 37 mutants, 7 modules, 37/37 tués | non tracée finement | `rapport-forge-tests.json` |
| v0.2.x / v0.3.0 | 2026-08-05 → 08-08 | 581→~900 tests | périmètre élargi par chantiers A-1..A-3 | non tracée finement | `rapport-forge-tests-v0.2.0.json`, `-v0.2.2.json`, `-v0.3.0.json`, `-v0.3.0-20260808.json` |
| v0.4.0 | 2026-08-31 | 984 tests, **~52 s** (mesuré ce jour, poste du run) | **115 mutants, 39/40 modules, 92 tués (80 %), ~37 s/mutant, ~54 min au total** | **67 min** | `rapport-20260831.json` (247 Ko : couverture élément par élément, score par module, 23 survivants nommés) |

Autres pans de la v0.4.0 (part résiduelle des 13 min hors mutation) : api 483/483 · interface
233/235 · data 194/197 · migrations 27/27 (aller-retour-aller × 9) · qualif 79/79 sur instance
servie · prompts 0/15 · 94 findings (26 critique / 68 standard). Emplacements bruts :
`forge\etapes\tests\rapport-*.json`, `forge\avancement.jsonl` (cadence horodatée de la
mutation, entrée par module), `forge\ledger.jsonl` seq 17-21 et 92-93, suite
`backend\tests\` (test le plus lent : 0,38 s — aucun test n'est individuellement coûteux,
c'est le **nombre de rejeux** qui fait le coût).

## Remarques restées au produit

Trois constats de la campagne restent au produit, chacun avec son verdict de généralisation
écrit — aucun ne met la forge en cause.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Pan data 194/197 : trois contraintes uniques (`uq_generation_curseurs`, `uq_archive_mails`, `uq_archive_curseurs`) jamais violées par un test — seuil 100 % non tenu | non corrigée dans ce lot : trois tests de violation à écrire au prochain run de version | non | dette de tests du produit sur ses migrations 0008/0009 ; la mesure de la forge a nommé exactement les trois éléments, c'est le comportement attendu |
| Pan prompts 0/15 : les modèles du catalogue ne sont exercés par aucun cas | non corrigée : les cas d'épreuve des 15 modèles restent à écrire | non | le pan est nouveau côté forge et fonctionne ; c'est le produit qui ne l'alimente pas encore — à traiter au prochain run |
| 23 mutants survivants dont 10 dans le code des lots A/B | non corrigée : assertions à renforcer au prochain run, survivants nommés au rapport | non | le seuil global (70 %) est tenu à 80 % ; les survivants sont l'outil de travail normal du prochain run, pas un défaut de la forge |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session de clôture de campagne, le 2026-08-31.

## Confirmations positives

Trois mécanismes issus des lots précédents ont tenu en conditions réelles sur cette campagne.

- **Les chantiers A-1/A-2/A-3 de la campagne d'amélioration du 06/08 ont tenu en conditions
  réelles** : mutation sur 39/40 modules (contre 7 avant la campagne), les 4 exclusions
  nominatives et motivées au rapport, seuils explicites, justifiés, et le seuil par module
  métier joué (aucune compensation possible).
- **Le pan qualif (A-4, demande utilisateur d'origine RT-6)** : 79/79 routes parcourues sans
  erreur sur l'instance servie et peuplée.
- **Le mécanisme anti « mutant échappé » (RT-17, lot 04) a tenu** : suite du produit vérifiée
  INTACTE après restauration des mutants — 984 tests verts en fin de campagne.

## Ordre recommandé

L'ordre suit le rapport gain/effort : le poste de coût dominant d'abord.

1. **RT-20** — l'étude : la mutation est 80 % du coût de campagne et croît linéairement avec le
   périmètre ; chaque campagne future de chaque produit du parc la paie. La donnée fournie
   (37 s/mutant contre 52 s de suite complète) désigne déjà le levier dominant.
2. **RT-21** — le croisement statique/dynamique : supprime 4 faux constats par campagne, au prix
   d'une jointure entre deux sections d'un même rapport.
