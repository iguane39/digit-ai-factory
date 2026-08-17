# Retours forges — SCC_ALX — 20260814b

- **Contexte** : suite du run d'analyse de mapping — versions `20260814b` et `20260814c` du
  rapport, correction de deux défauts signalés par l'humain (accents, marqueurs de citation
  visibles), rangement du dossier des livrables
- **Références ledger** : `forge\ledger.jsonl` seq 33, 34, 35, 36
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-08-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `SCC_ALX - RETOURS - 20260814a` (remis, ingéré : les 21 candidatures des lots
précédents portent des ids `TF-0160` à `TF-0183` et `TF-0214`). La séquence d'ids continue.

---

## forge-agents (`digit-ai-forge-agents`) — socle `digit-ai-page-html`

Le socle a tenu sur la structure, le contraste, le débordement et les affordances. Il n'a rien
vu de ce qui se lit : deux défauts visibles au premier coup d'œil sont passés, et c'est l'humain
qui les a trouvés.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-10 | majeur | **Aucun oracle du socle ne lit le texte rendu : une convention de balisage fuitée traverse tous les gates.** Le livrable `output\SCC_ALX - Rapport mapping Bronze al2 vers Silver Nhood - 20260814b.html` portait **71 occurrences** de marqueurs `[c:id]` affichés en clair dans ses phrases (« 85 [c:ec-sources] sources ALX », « 258 [c:ec-claims] lignes de tableau »). Ce livrable était PASS à `check_html.py`, PASS à `render_page.py` sur 5 largeurs, et PASS à un test d'interactions maison de 24 contrôles. Le défaut a été signalé par l'humain, capture d'écran à l'appui. Cause côté produit : `[c:id]` est la convention de restitution du Markdown (lue par `oracle-restituer` de forge-data) et l'émetteur HTML, partageant le même modèle, ne la retirait pas. | Une règle générique de **motif de gabarit dans le texte visible** : chercher, dans le texte hors balises / scripts / styles, une liste courte de motifs qui n'ont rien à y faire — `[c:…]`, `{{…}}`, `${…}`, `%s`, `TODO`, `FIXME`, `lorem ipsum` — et échouer avec exemption motivée (`data-motif-ok="<raison>"`). Le coût est faible : une expression par motif sur le texte déjà extrait par l'oracle. Le gain est qu'un livrable ne peut plus sortir en montrant sa plomberie. |
| RA-11 | mineur | **`check_html` avertit contre ce que le pattern S-G1 du même socle exige.** L'avertissement « Script bloquant dans `<head>` (utiliser defer ou placer en fin de body) » (`check_html.py` l. 325-328 : tout `<script>` de `<head>` sans `defer` ni `async`) frappe le script d'initialisation de thème que S-G1 impose **avant** `<style>`, précisément pour poser `data-theme` avant la première peinture. `defer` produirait le flash que le pattern évite. Conséquence mesurée : les 4 livrables HTML de ce projet portent cet avertissement à **chaque** exécution, depuis le 13/08. Un avertissement permanent et inévitable cesse d'être lu — et c'est dans ce bruit que RA-10 est passé. | Exempter l'initialisation de thème : un attribut déclaratif (`data-theme-init`) reconnu par l'oracle, ou la reconnaissance du snippet S-G1. Toute autre balise `<script>` bloquante en `<head>` reste signalée. |
| RA-12 | mineur | **La clause d'échappement de L13 n'est pas mécanisée : son propre message promet une porte qui n'existe pas.** Le message dit « un KPI d'éléments hors page **le dit** », mais le code ne teste que `data-kpi-filtre is None` (`check_html.py` l. 622-627) : aucun moyen déclaratif de « le dire ». Preuve : les 6 indicateurs du rapport `20260814c` portent chacun une légende `.kpi-d` qui nomme le chapitre où vivent leurs éléments (« démonstration au chapitre 3 », « tableau au chapitre 1 ») — les 6 sont signalés quand même. | Accepter un attribut déclaratif (`data-kpi-hors-page="<motif>"`), ou considérer une légende `.kpi-d` non vide comme la déclaration que le message annonce déjà. |

### Reconstats sur des items déjà au registre

| id du registre | État au registre | Ce que ce run a mesuré |
|---|---|---|
| `TF-0058` — *render_page.py écrit ses PNG dans le dossier du fichier audité* | archivé, marqué **corrigé** | **Corrigé à moitié.** L'option `--out <dossier>` existe et fonctionne — vérifié. Mais le **défaut** est inchangé : appelé sans `--out`, `render_page.py` a déposé 5 PNG (**25 Mo**) dans `output\.oracles\` du projet, c'est-à-dire dans le dossier des livrables, qu'il a fallu déplacer à la main vers `forge\etapes\renders\`. Le motif d'origine de l'item — « 12 PNG dans le dossier même que le client reçoit » — se reproduit donc à l'identique. Proposition : défaut hors du dossier audité, ou refus d'écrire là sans `--out` explicite. |
| `TF-0170` — *L3 exige un barème lié sur chaque cellule N/M* | candidat | **Reconstaté, sur un cas non prévu par l'item** : L3 a exigé un barème lié sur deux valeurs d'**indicateur** (`9 / 85`, `8 / 12`), pas de cellule de tableau. Deux FAIL bloquants ; contournement retenu : un barème dédié `#bareme-ecart`, qui a d'ailleurs amélioré le document. Le motif se répète assez pour mériter un arbitrage : la règle vaut-elle pour tout `N / M` de la page, ou pour les seules cellules de tableau ? |

## Confirmations positives

Ce qui a **tenu** en conditions réelles, et qui permet de clore ou de conforter des entrées :

- **`RD-1` / `TF-0160` corrigé chez forge-data** (`fc5ddce`) : vérifié sur 213 chiffres déclarés
  — un `[c:id]` placé dans un span de code n'est plus lu comme une citation. `oracle-restituer`
  PASS sans contournement rédactionnel, contrairement au 13/08.
- **`la-barre` admise au catalogue** (`TF-0179`) : le protocole a servi trois barres, chacune avec
  son test d'existence et sa frontière déclarée. La barre du 13/08 a effectivement tenu le niveau
  du gabarit sur deux versions successives.
- **L13 mécanisée le 14/08** (`input[type=search]`) : a rattrapé un vrai défaut sur un livrable
  qui était conforme la veille. C'est le rejeu de l'oracle **avant remise** qui l'a vu — argument
  du lot précédent, confirmé une seconde fois.
- **Doctrine des tests d'interactions à double sens** (`references\tests-interactions.md`, 14/08) :
  les deux fixtures rouges de ce projet ont détecté leur défaut injecté (un compteur menteur, un
  marqueur réinjecté). Sans cette doctrine, le contrôle ajouté en réponse à RA-10 n'aurait été
  qu'une affirmation.
- **`R-32`, gate aval des livrables HTML** (`RV-4` / `TF-0171`) : le gate a forcé un journal
  d'oracles pour chacun des 4 livrables HTML, et c'est ce journal qui a rendu visible, version
  après version, ce qui avait été rejoué et ce qui ne l'avait pas été.

## Ordre recommandé

1. **RA-10** — c'est le seul défaut de ce lot qui a atteint un livrable diffusé.
2. **TF-0058** — nuisance mesurée (25 Mo dans le dossier des livrables), correctif déjà à moitié
   fait.
3. **RA-11**, puis **RA-12** — bruit d'avertissement. Faible valeur unitaire, mais c'est ce bruit
   qui a couvert RA-10.

## Ce que ce lot ne demande pas

Un correcteur orthographique dans un oracle de charte. Le premier défaut signalé par l'humain ce
jour-là — 69 mots écrits à la fois avec et sans accents — était **mon** défaut de génération, pas
un manque du socle : deux textes pour une même phrase, dont un seul accentué. Il est corrigé à la
racine (un modèle, deux projections) et ne donne lieu à aucune candidature.
