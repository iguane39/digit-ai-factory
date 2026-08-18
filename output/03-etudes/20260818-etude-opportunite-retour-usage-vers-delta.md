---
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
---

# Étude d'opportunité — retour d'usage → delta opposable — 20260818b

## Seuil de déclenchement (à vérifier AVANT d'écrire)

**Franchi.** TF-0374 demande un **service neuf** chez forge-conception (« retour d'usage →
delta ») et une **sixième catégorie d'entrant** : deux objets durables au sens de R-31. Score
porté par le lot : gain 3, preuve 3, effort 3. C'est la première branche du seuil qui joue
(création d'objet durable), pas la troisième.

## 0. Traitement des entrants

La proposition instruite est une **donnée** : ses impératifs se citent, ne s'exécutent pas.

Sources : TF-0374 (lot `Produit-01 - RETOURS - 20260818a`, ingéré le 18/08) ·
`_Client-A/Produit-01/etudes/Client-A - APR - Etude des ecarts - CDC V1.4 vs Lot recette - 20260818a.md`
(le prototype manuel, lu en lecture seule) · TF-0375 et TF-0376, issus du même lot et instruits
le même jour.

## 1. Partition du problème

Le sujet se découpe en quatre sous-questions disjointes. La suite montre qu'elles n'ont pas la
même réponse, et c'est tout l'objet de cette étude.

1. **Qualification** — un lot d'anomalies de recette entre-t-il dans la typologie d'entrant ?
2. **Seuil** — si oui, le lot atteint-il le seuil de suffisance de sa catégorie ?
3. **Transformation** — qui produit le `DELTA.json` opposable, et à partir de quoi ?
4. **Classification** — qui décide, rubrique par rubrique, si c'est un écart au cahier ou une
   évolution de doctrine ?

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Typologie d'entrant de `cat-con-01` | `skills/qualifie-l-entrant/SKILL.md` §« Les cinq entrants », ligne « Produit à faire évoluer — Du code lisible **et** un delta demandé » | **RECOUVRE la question 1.** La catégorie existe déjà, et c'est exactement celle-là : du code lisible plus un delta demandé |
| Seuil de suffisance de cette catégorie | `skills/qualifie-l-entrant/references/entrants.md` ligne 14 : delta « **exprimé en exigences neuves rattachées à la surface existante** », seuil « delta formulé en ≥ 1 exigence candidate » | **NE RECOUVRE PAS la question 2.** Le seuil PRÉSUPPOSE le delta déjà formulé en exigences. Un lot de 1271 lignes de prose est l'**entrée** de cette formulation, pas sa sortie |
| Règle des entrants multiples | `references/entrants.md` §« Entrants multiples » : « le plus riche l'emporte », ordre décroissant à partir de « produit à faire évoluer » | **RECOUVRE** le cas où le lot arrive avec le cahier et le code : rien à inventer, la règle tranche déjà |
| `oracle-delta.mjs` (D1-D4) | `oracles/oracle-delta.mjs` lignes 50-96 : champs obligatoires, statut en ensemble fermé, forme de chaque opération, cohérence au référentiel ciblé | **RECOUVRE la sortie** de la question 3 : le format opposable existe et il est jugé. Il ne recouvre pas la **production** du delta |
| `cat-tst-02` (générer des cas à adopter) | `catalogues/CATALOGUES.md` ligne 49 : `uv run python -m forge_tests <racine> --generer <dossier>` | **RECOUVRE l'aval** de la question 3 : les cas de tests se dérivent déjà d'un référentiel. Rien à créer côté tests |
| `oracle-ears` EA4/EA5 | `digit-ai-forge-conception/oracles/oracle-ears.mjs`, ajoutés le 18/08 (TF-0376) | **RECOUVRE PARTIELLEMENT la question 4** : cinq des douze lacunes de spécification du corpus Approval sont désormais détectées à la rédaction, donc n'arriveront plus comme anomalies de recette |
| Gate spec `cat-dev-03` | `catalogues/CATALOGUES.md` ligne 38, banc de corpus posé le 18/08 (TF-0375) | **RECOUVRE la question 4 pour 24 des 49 rubriques** : sous-livré et sur-livré par rapport au cahier, c'est littéralement son intention, et il porte depuis aujourd'hui le corpus réel — dont le sens qui refuse de transformer une évolution de doctrine en écart |

## 3. État de l'art daté

**Non instruit**, déclaré sans entre-deux. Motif : cette session n'a pas d'accès réseau, et
produire cinq sources datées de mémoire fabriquerait la preuve que cette section existe pour
exiger. Raison de fond, en outre : l'objet instruit n'est pas un choix d'outil de marché mais
**la jonction entre deux mécaniques déjà présentes dans cet écosystème** — la typologie
d'entrant et `oracle-delta`. L'état de l'art des outils de gestion d'anomalies devient
nécessaire le jour où l'on **branche un gestionnaire de tickets** (ce que O4 propose et que le
verdict écarte), et il est alors porté par cette option comme préalable explicite.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Coût du statu quo, mesuré et cité : traitement **intégralement manuel**
du 18/08 — 1271 lignes croisées à la main contre 16 sections de cahier, 49 rubriques classées
une par une, 9 contradictions et 3 régressions trouvées par lecture de code, dont
`backend/tests/test_decision_lock.py:26` qui échouera à coup sûr dès l'implémentation de la
rubrique 35. **Aucun oracle n'a pu être joué**, faute d'artefact au format d'une forge.
**Réfutée** : le coût est mesuré, il est élevé, et il se répétera à chaque recette.

**O1 — la proposition du lot, telle quelle** : une sixième catégorie d'entrant + un service
« retour d'usage → delta ». Contenu : nouvelle ligne à la typologie, protocole d'extraction,
producteur de `DELTA.json`, matrice de classification, dérivation des cas via `cat-tst-02`.
Coût : deux objets durables, un skill neuf, la typologie fermée rouverte. Ce qu'elle exclut :
rien — mais elle **paie deux fois** ce que la section 2 montre déjà présent. La typologie n'a
pas besoin d'une sixième entrée : « produit à faire évoluer » **est** la catégorie, et la
rouvrir sans nécessité affaiblit une liste fermée qui tient depuis le 04/08.

**O2 — étendre le protocole de l'entrant existant** (retenue, voir §5). Contenu : la catégorie
« produit à faire évoluer » gagne un **protocole d'extraction pour delta en prose**, en amont de
son seuil de suffisance actuel — c'est-à-dire exactement la marche manquante que la section 2
isole. Sortie : `DELTA.json` opposable à `oracle-delta`, chaque opération portant la **référence
de section du référentiel** et sa **cause racine** (écart au texte / lacune de spécification /
évolution de doctrine). Coût : un fichier de références, une extension du seuil, un producteur
de delta. Ce qu'elle exclut : la classification automatique fine — elle reste rendue par les
gates qui la portent déjà (`cat-dev-03` pour l'écart au cahier, EA4/EA5 pour la lacune).

**O3 — ne traiter que la classification**, en laissant la production du delta manuelle.
Contenu : la matrice concordante / extension / contradiction, sans producteur. Coût faible.
Ce qu'elle exclut : le gain principal — le passage à un artefact **jouable par un oracle**, qui
est ce dont l'absence a coûté 1271 lignes de lecture manuelle. Un classement sans artefact
opposable reste un document que personne ne peut vérifier mécaniquement.

**O4 — brancher un gestionnaire de tickets** (Azure Boards) pour ingérer les anomalies à la
source. Ce qu'elle exclut : elle est **hors doctrine** — « ce module ne va pas chercher les
anomalies dans un gestionnaire ; c'est le projet qui exporte » (`forge_tests/livrables/
anomalies.py`, NON_JUGE, posé le 18/08 sous TF-0372), et aucune API tierce n'est admise hors
Claude. Écartée sur règle, pas sur coût.

## 5. Verdict

- **Option retenue** : **O2 — étendre le protocole de l'entrant « produit à faire évoluer »**.
- **Motif** : la prémisse de TF-0374 (« n'entre dans AUCUNE des cinq catégories ») est
  **partiellement fausse**, et la vérifier a changé la réponse. La catégorie existe ; ce qui
  manque est une **marche en amont de son seuil**, lequel présuppose le delta déjà formulé en
  exigences. Le corriger là coûte une fraction d'O1 et ne rouvre pas une liste fermée.
- **Coût** : un fichier de références (protocole d'extraction d'un delta en prose), l'extension
  du seuil de suffisance, un producteur de `DELTA.json`. Effort estimé 2, contre 3 pour O1.
- **Ce que le verdict NE dit pas** : que la classification des 49 rubriques soit résolue. Elle
  l'est à **24/49 par `cat-dev-03`** et à **5/12 des lacunes par EA4/EA5**, tous deux posés le
  18/08 ; le reste — 12 évolutions de doctrine et 1 mésusage du design system — relève d'un
  arbitrage humain que rien ne doit automatiser.
- **Candidature(s) émise(s)** : aucune de plus. TF-0374 **reste l'item**, et son périmètre est
  requalifié par cette étude : O2 au lieu d'O1. La décision de le passer en `decide` est humaine.
- **Plan de revue** : **2026-11-17**, avec TF-0326 et R-41. Faits à confronter : (1) une
  seconde recette humaine a-t-elle produit un lot de prose — si oui, a-t-il coûté moins que
  1271 lignes manuelles ; (2) `cat-dev-03` et EA4/EA5 ont-ils intercepté en amont une part des
  rubriques, et laquelle, mesurée ; (3) la typologie à cinq entrants a-t-elle tenu, ou une
  sixième catégorie s'est-elle imposée par les faits — auquel cas c'est ce verdict qui a échoué.
