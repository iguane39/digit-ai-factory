---
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
---

# Étude d'opportunité — vue portefeuille du reste-à-faire — 20260822a

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Franchi, deux fois plutôt qu'une : la proposition **crée un objet durable** (un générateur et
son référentiel de produits déclarés — R-31) **et touche le noyau** (`CLAUDE.md` devrait
nommer la vue, comme il nomme déjà TODO-FORGE). Score de la candidature TF-0462 : gain 4,
preuve 4, effort 4. L'étude est donc due avant tout passage en `decide`.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.

Sources : candidature **TF-0462** (registre `todo\TODO.jsonl`, créée le 22/08, statut
`en_cours` — volet instanciation fait) · lot `Bibliotheque-Video-IA-Ceetrus - RETOURS -
20260822a.md`, retour RA-16 · retour humain du 22/08 : *« je travaille sur 5 à 8 projets en
parallèle »* · mandat humain du 22/08 « a, b », qui a décidé le volet instanciation et laissé
celui-ci à l'étude.

## 1. Partition du problème

Découpage exhaustif et disjoint ; chaque option de la section 4 se rattache à une partition.

- **P1 — Où vit l'agrégat ?** Chez le pilot (un fichier de plus dans `output\`), chez chaque
  produit (dupliqué), ou nulle part (l'humain ouvre les quatre pages à la main).
- **P2 — Comment le pilot connaît-il la liste des produits ?** C'est la partition décisive :
  elle n'existe pas aujourd'hui. `bootstrap.mjs` porte une liste `FORGES`, jamais une liste de
  produits, et aucun autre fichier ne la tient.
- **P3 — Fraîcheur.** Un agrégat périmé est pire qu'aucun agrégat : il fait croire que le
  reste-à-faire a été regardé. Le patron existant du couple source scellée / projection
  générée répond à cette partition, à condition d'être appliqué au NIVEAU DE L'AGRÉGAT.
- **P4 — Lecture des dépôts frères.** Le pilot lirait N fichiers écrits ailleurs. Ce sont des
  entrants, donc de la donnée : leurs consignes se décrivent, ne s'exécutent jamais.
- **P5 — Écriture.** Refusée d'avance et sans débat : le verdict O3 du 17/08 tient, et la
  présente étude ne le rouvre pas.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Reste-à-faire par produit | `gabarits\docs-projet\TODO-PRODUIT.md` et `todo\generer-todo-produit.mjs`, dont l'usage déclaré est `generer-todo-produit.mjs <chemin>\docs\projet\TODO-PRODUIT.md` — un chemin, un produit | ne recouvre pas — mono-produit par construction ; c'est la brique à agréger, pas l'agrégat |
| Registre des améliorations de forge | `todo\generer-page.mjs`, sortie mesurée le 22/08 : « TODO.html générée — 155 items, 12 forges » | ne recouvre pas — agrège les FORGES, jamais les produits ; aucun item n'y porte de produit porteur |
| Consigne de restitution | `gabarits\RESTITUTION.md` v2.5.0, « il régit tout message de fin de traitement » — d'UN traitement | ne recouvre pas — un tour de travail, un produit ; c'est la source des lignes, pas leur somme |
| Exhaustivité de l'écosystème | `oracles\oracle-ecosysteme.mjs`, règles E1-E5, source de vérité déclarée : « la liste FORGES de `bootstrap.mjs` » | ne recouvre pas, et le prouve : la seule liste tenue par l'écosystème est celle des forges |
| Inventaire | `INVENTAIRE.md`, titre : « Inventaire des treize forges » | ne recouvre pas — treize forges, zéro produit |
| Boîte d'entrée des lots | `oracles\oracle-boite-entree.mjs`, règles B1-B7, périmètre `input\00-retours\` | ne recouvre pas — juge ce qui arrive au pilot, jamais ce qui reste ouvert chez un produit |
| Suivi de traitements longs | `scripts\avancement.mjs`, en-tête : « émetteur d'avancement des process longs », sortie `<run>\avancement.jsonl` | ne recouvre pas — avancement intra-run, horizon de quelques minutes |

## 3. État de l'art daté

**Non instruit**, déclaré comme tel plutôt que contourné, et voici le motif. L'objet est un
générateur déterministe qui lit N fichiers markdown d'un poste et en projette une page HTML
autonome — le patron est déjà en production ici (`todo\generer-page.mjs`,
`todo\generer-todo-produit.mjs`, `scripts\generer-architecture.mjs`), jugé par des oracles, et
la seule question ouverte est un référentiel de produits, qui est une décision d'organisation
et non un problème de veille externe. Aller chercher cinq sources externes datées sur
l'agrégation de listes de tâches produirait de la matière non applicable : la contrainte qui
décide ici est interne (aucune liste de produits n'existe), pas technique.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée, et le coût du statu quo est cité : quatre `TODO-PRODUIT.md`
  existent depuis le 22/08, portant 7 décisions attendues et 8 améliorations, réparties sur
  quatre dépôts. Sans agrégat, les lire suppose d'ouvrir quatre pages dans quatre dossiers —
  exactement le geste de rechargement de contexte que le retour du 22/08 désigne comme le coût
  à supprimer. Réfutation **partielle** cependant : à quatre produits, le coût reste faible ;
  c'est à sept ou huit qu'il devient le sujet.
- **O1 — un référentiel de produits déclarés, puis un générateur d'agrégat.** Un fichier
  `PRODUITS.md` (source datée-éditable, loi n° 4) listant chemin, nom et propriétaire de chaque
  produit ; un `todo\generer-portefeuille.mjs` qui lit les `docs\projet\TODO-PRODUIT.md` cités,
  ne garde que les lignes ouvertes, trie par acteur puis par ordre dérivé, et projette une page
  scellée. Coût : complexité moyen · durée moyen. Exclut O2 et O3.
- **O2 — découverte automatique, sans référentiel.** Le générateur balaie `c:\dev` et
  `c:\dev\_Nhood` à la recherche de `docs\projet\TODO-PRODUIT.md`. Coût : complexité simple ·
  durée court. Exclut O1. Défaut mesuré à l'usage du 22/08 : la sélection des produits a dû
  être arbitrée à la main (quatre dépôts sous la doctrine, trois hors doctrine parmi sept
  dépôts actifs) — un balayage aurait pris ce que le disque contient, pas ce que l'humain suit,
  et le résultat dépendrait de la machine.
- **O3 — étendre la page TODO-FORGE existante avec un onglet produits.** Coût : complexité
  simple · durée court. Exclut O1. Défaut : mélange deux registres dont la gouvernance diffère
  (TODO-FORGE a un écrivain unique et des ids frappés à l'ingestion ; les `TODO-PRODUIT.md`
  sont écrits par chaque produit), et le premier incident de confusion coûterait plus que
  l'agrégat ne rapporte.
- **O4 — agrégat porté par chaque produit.** Chaque produit projette la vue de tous les autres.
  Coût : complexité moyen · durée long. Exclut O1. Défaut rédhibitoire : N copies à tenir
  fraîches, et une écriture du pilot dans chaque dépôt frère à chaque changement — ce que le
  garde-fou interdit hors mandat.

## 5. Verdict

- **Option retenue** : **O1**, mais **différée** — l'agrégat n'est pas le premier manque.
  L'instruction a déplacé le sujet : ce qui bloque n'est pas la projection, c'est que **la liste
  des produits suivis n'existe nulle part** (partition P2). Tant qu'elle n'est pas écrite,
  n'importe quel agrégat sera soit incomplet, soit dépendant du contenu d'un disque. La
  première pierre est donc le référentiel de produits, qui a une valeur propre même sans page :
  il donne à `oracle-ecosysteme` un pendant côté produits, et il rend la règle de sélection du
  22/08 rejouable au lieu d'être arbitrée à la main.
- **Coût** : référentiel seul — complexité simple · durée court. Générateur et page —
  complexité moyen · durée moyen. Dette introduite : un fichier de plus à tenir frais, à
  couvrir par `oracle-fraicheur-doc` comme `INVENTAIRE.md` l'est déjà.
- **Candidature(s) émise(s)** : aucune candidature nouvelle — TF-0462 reste `en_cours` et porte
  ce verdict ; son volet instanciation est fait, son volet portefeuille attend la décision
  humaine sur O1. Une candidature distincte pour le seul référentiel de produits ne sera émise
  que si la décision humaine sépare les deux.
- **Plan de revue** : le 2026-09-05, ou plus tôt si un cinquième produit instancie son
  `TODO-PRODUIT.md`. Le verdict sera confronté à un fait mesurable et unique : le nombre de
  fois où il a fallu ouvrir plus de deux pages de reste-à-faire pour savoir quoi faire.
  À quatre produits, O0 tenait ; le seuil réel se lit là.
