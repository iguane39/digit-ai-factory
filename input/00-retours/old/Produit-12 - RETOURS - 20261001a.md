# Retours forges — Produit-12 — 20261001a

- **Contexte** : étude d'opportunité « cadrer le métier avant de produire » du 2026-10-01, exécutée sur
  la décision humaine D-6 (a), réponse « 6a » ; ce produit en est le cas d'école. Étude :
  `output\04-evolutions\Produit-12 - Etude opportunite cadrage metier et cascade - 20261001b.md`.
- **Références ledger** : `forge\ledger.jsonl` seq 188 à 194 (entrées `type: retour`), dont 191
  (RS-25), 192 (RC-6), 193 (RS-26) et 194 (RS-27).
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`
  (ignoré par git), jamais à la racine de `input\00-retours\` ; l'original reste ici. Statut :
  `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-01 dans le SAS d'arrivée du pilot (`<pilot>\input\00-retours\_arrivee\`),
  sur GO humain D-10 (a) — ce lot ne se modifie plus.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du produit :
la série RS s'arrêtait à RS-24 (lot 14), la série RC à RC-5 (lot 12).

---

## pilot (`digit-ai-factory`)

Ce que l'étude a mesuré sur la factory elle-même : sa doctrine de conception est écrite, outillée, et
n'atteint pas les produits ; sa doctrine de restitution ne distingue pas une anomalie d'un choix ; et
son générateur de pages d'étude produit des pages que son propre socle refuse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-25 | majeur | générique | **La cascade de l'intention et la fiche de conception amont ne descendent dans aucun produit.** `gabarits\HERITAGE.json` : 0 occurrence d'`INTENTION.md` et de `FICHE-CONCEPTION.md`, en local et sur `origin/main` (relevé du 2026-10-01). Leurs contrôles ne mordent que sur les études (E9, E10) et sur la présence d'un test rétro au bloc 1 des restitutions (S51). Mesuré chez ce produit : 4 reprises de forme sur 2 pages (ledger seq 169, 172, 173, 175) et 1 sur une 3e page (seq 166), toutes produites sans fiche ; les tests rétro des restitutions des 28, 29 et 30/09, présents, n'ont vu ni les dates de bail fausses (113 sur 161) ni les brouillons anachroniques (6 sur 18). | Ajouter `references\INTENTION.md` et `gabarits\documents\FICHE-CONCEPTION.md` à `HERITAGE.json` en copie conforme, et rappeler dans `CLAUDE-PRODUIT.md` que la fiche se remplit avant tout document remis par un produit et se juge par G6. Règle qui aurait évité le retour : la consigne du 01/09, « À appliquer sur tous types de demande » (`INTENTION.md` l. 21-23), écrite et jamais descendue. |
| RS-26 | majeur | générique | **Une invraisemblance mesurée a été présentée comme un choix à valider.** Le 29/09, « date d'entrée = plus ancien fichier (83 dossiers sur 183 en 2022-05) » figurait parmi 10 choix à confirmer (seq 180, 184), validés tels quels le 30/09 (seq 185). Le pic venait de la copie des fichiers à la reprise du portefeuille (retour du cabinet du 01/10, seq 189) ; les dates lues dans les baux le font disparaître (5 entrées au plus sur un mois, contre 84). | Dans `gabarits\RESTITUTION.md` : une mesure qui viole un invariant du métier se présente en anomalie — compte, dénominateur, cause probable, question qui la lève —, jamais en option ; règle candidate pour `oracle-synthese`. Aucune règle existante ne couvre ce cas : classe à créer. |
| RS-27 | majeur | générique | **Le générateur de pages d'étude produit des pages que le socle refuse.** `scripts\generer-page-etude.mjs` (dernier commit acf07c11, 28/09) : `check_html` L7 ×16 sur la page de l'étude du produit (aucun chapeau `.ch-apprend` émis), et ×9 sur l'étude du pilot du 19/09 régénérée le 01/10, dont la page d'origine, produite par la version antérieure, passe à 0 ; `render_page` : sommaire perdu sous 900 px (768 et 390 px) ; critique forge-design : `oracle-tokens` T3 ×3 sur `nav.toc` (espacements 6, 18 et 2 px). Le self-test du générateur rend 15/15 PASS sans jouer ces oracles. Conséquence : R-32 ter exige une page que R-32 et S36 refusent. Journal : `forge\oracles\Produit-12 - Etude opportunite cadrage metier et cascade - 20261001b.json`. | Émettre un chapeau `.ch-apprend` par chapitre (première phrase de la section), un sommaire collant ou replié sous 900 px, des espacements à l'échelle 4 pt ; faire jouer `check_html` et `render_page` au self-test sur une étude réelle. Règle qui aurait évité le retour : R-32 elle-même, que le générateur ne se joue pas. |

## forge de conception (`digit-ai-forge-conception`)

La conception d'un produit produit ses exigences et sa surface, jamais le modèle de son métier : c'est
le trou que les 2 défauts de raisonnement de l'étude ont traversé.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-6 | majeur | générique | **Aucun artefact de conception ne porte le modèle du métier d'un produit** : ni processus, ni glossaire, ni invariants avec leur source de vérité, leur fenêtre de validité et leurs exceptions. `CONSTITUTION.md` porte les invariants d'un projet sans source ni période, et ce produit n'en a pas. Conséquences mesurées le 2026-10-01 : dates de bail tirées de la date des fichiers (290 sur 298 sur l'échantillon, 519 sur 541 chez un propriétaire) ; 113 dates d'entrée sur 161 fausses ; 71 quittances sur 93 classées pièces de candidature par une règle qui comparait ces dates ; 6 brouillons d'exemple sur 18 nourris de faits postérieurs au mail. 4 contrôles écrits sur un cadrage métier, I1 à I4, les voient tous (scripts `forge\etapes\conception\cadrage-metier\`). | Un volet « cadrage métier » à l'étape de conception : la carte des processus, un glossaire au format du glossaire opposable, les invariants dans `CONSTITUTION.md` avec leur source de vérité, leur fenêtre de validité et leurs exceptions, chacun traduit en contrôle exécutable chez le produit ; dû au niveau Complexe de l'étude du 25/09. Aucune règle existante ne couvre la classe : classe à créer. |

## Remarques restées au produit

Ce que l'étude a constaté chez le produit et qui reste chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Dates de bail tirées de la date des fichiers, ledger seq 188 | non corrigée par l'étude ; la norme 2.2, en cours dans une autre session, lit le bail | oui | la classe est remontée en RC-6 ; le correctif reste au produit, par un run de version |
| Brouillons d'exemple anachroniques et critère de l'exigence E-095 sans condition de date, seq 190 | non corrigés ; run de version à décider | oui | la classe est remontée en RC-6 ; le critère d'E-095 reste au produit |
| Allers-retours de format des pages d'exemple | non corrigés : les pages sont déjà validées par le cabinet | oui | remonté en RS-25 |
| Retour du cabinet du 01/10 sur la date d'entrée, seq 189 | consigné | non | propre au portefeuille d'un propriétaire repris en mai 2022 |

## Retours sur les documents produits

Un seul document de ce lot sort d'une famille du catalogue ; les pages d'exemple des 13, 14 et 29/09
n'en avaient aucune, et c'est l'objet de RS-25.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Produit-12 - Etude opportunite cadrage metier et cascade - 20261001b.md` | gd-etude-opportunite (portée ailleurs : `gabarits\ETUDE-OPPORTUNITE.md`), fiche de conception 1.0.0 | aucune place pour un seuil de réussite fixé avant la mesure, ni pour un cas d'école mesuré ; le catalogue ne déclare ni lecteur ni types de contenu pour la famille | aucun retour du lecteur à la date du lot : l'étude est remise le 2026-10-01 | sections « Seuil de réussite », « Cas d'école », « Rétro-test », « Contre-épreuve », et 4 annexes de mesure | générique |

## Confirmations positives

- **G6 se joue depuis un produit**, sur une fiche puis sur le document qui la tient : PASS en 2 passes,
  sans adaptation, par `<PILOT_ROOT>\oracles\oracle-gabarits-documents.mjs --fiche`.
- **Le juge des études se joue depuis un produit**, en local et dans sa version publiée : mêmes
  verdicts (10 règles sur 10) ; le correctif TF-1435, qui découpe les sections sur leur titre, tient.
- **La provenance des dates écrite par la norme 2.2** (« contenu : date d'effet du bail », « aucune
  date lue : date de la copie en masse ») a rendu la mesure des dates de bail possible en une passe.

## Ordre recommandé

1. **RS-25** — 2 lignes dans `HERITAGE.json` : le coût le plus bas, et la condition des 2 autres,
   puisqu'une doctrine qui ne descend pas ne s'applique pas.
2. **RC-6** — le volet cadrage métier à la forge de conception : il couvre les défauts les plus
   coûteux mesurés, les dates de bail, les brouillons et la règle des quittances.
3. **RS-27** — le générateur de pages : tant qu'il n'est pas corrigé, chaque étude remise porte une
   page en échec, au produit comme au pilot.
4. **RS-26** — la règle de restitution, une fois les invariants écrits, puisqu'elle s'appuie sur eux.

## La règle qui aurait évité le retour

- **RS-25** : `INTENTION.md` l. 21-23, « À appliquer sur tous types de demande » — écrite le 01/09,
  jamais câblée vers les produits.
- **RC-6** : aucune. Classe à créer : clé `fait-metier-sans-source-de-verite`, famille
  `contrat-interface-forge`, libellé « Une donnée métier dérivée par un produit (date, rôle,
  rattachement, contexte d'une réponse) n'a ni source de vérité déclarée, ni invariant, ni fenêtre de
  validité : l'agent prend une métadonnée technique pour le fait, ou une information postérieure pour
  une information connue, et aucun contrôle ne le voit ».
- **RS-27** : R-32 (gate aval des livrables HTML), que le self-test du générateur ne joue pas ; classe
  `fixture-jugee-par-son-seul-oracle`.
- **RS-26** : aucune. Classe à créer : clé `invraisemblance-presentee-en-choix`, famille
  `restitution-forme`, libellé « Une mesure qui viole un invariant du métier est présentée à l'humain
  comme un choix à valider, sans son signal d'anomalie ni sa cause probable : l'humain valide un
  artefact ».
