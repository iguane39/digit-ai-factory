# Retours forges — Produit-76 — 20260825a

- **Contexte** : clôture du run `20260825-audit-gate1b-et-conformite-factory` — audit POC-to-Prod (Gate 1b) au Compliance Pack du kit 20260821a, et rattrapage du socle projet aux règles de la factory.
- **Références ledger** : `forge\ledger.jsonl` seq 23, 25, 26 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le rattrapage du socle projet s'est fait sans friction sur 32 règles ; une seule a coûté un
aller-retour, et pour une raison que le message d'erreur ne disait pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-1 | majeur | générique | `oracle-conformite-projet` R-24 juge l'URL d'environnement **telle qu'elle est écrite** dans la table de `PARAMETRAGE.md`. Une URL entourée de backticks markdown — usage courant dans un tableau — est capturée **avec le backtick final** : la chaîne lue devient `https://…net\`` et ne peut alors correspondre à aucune entrée `ecarts_r24`, qui porte l'URL nue. L'écart déclaré reste donc en FAIL, et le message répète la règle de nommage (« le premier label d'hôte doit finir par -dev… ») au lieu de signaler la non-correspondance. Mesuré le 25/08 sur ce produit : écart déclaré en frontmatter, FAIL maintenu ; backticks retirés de la table, PASS immédiat. | Normaliser l'URL capturée (retirer la ponctuation markdown de fin) avant comparaison avec `ecarts_r24` ; à défaut, quand un écart déclaré existe pour un hôte proche, le dire (« écart déclaré pour `<url>`, URL lue `<url'>` — elles diffèrent »). |

## forge-audit / RefAudit (kit d'audit POC-to-Prod Client-A)

Le kit a tenu de bout en bout : le gate de format, l'extraction du plan auto-porté, les trois
contrôles runtime et la matrice de couverture ont tous rendu un verdict exploitable. Deux
défauts ont néanmoins été rencontrés, l'un produisant une donnée fausse, l'autre mettant le
produit en défaut sur une forme qu'il ne maîtrise pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | majeur | générique | `compliance-pack/maj-versions.mjs` a rendu **`1.0.dev5`** en `version_actuelle` pour `httpx` — une **pré-version**, que la politique de fraîcheur du kit interdit explicitement (méthodologie §4, point 5 : « Jamais de pré-version en `version_actuelle` ni en cible »). Le résumé de sortie affichait pourtant `prerelease_ignorees: 0` : le filtre ne reconnaît pas le suffixe PEP 440 `.devN`. Interrogation directe de PyPI le même jour (25/08) : `info.version = 0.28.1`, dernière **stable**. La valeur a été rectifiée à l'audit, rectification tracée dans le composant. Le validateur ne voit pas le défaut : le `check 10` juge la *résolution* de la version, jamais sa *stabilité*. | Étendre le filtre de pré-version aux suffixes `.devN` et `.postN`, et **incrémenter `prerelease_ignorees`** quand une version est écartée — un compteur à zéro alors qu'une pré-version est sortie masque le défaut plutôt que de le signaler. Éventuellement, ajouter au `check 10` un contrôle de stabilité de `version_actuelle`. |
| RA-2 | majeur | générique | Le modèle `Client-A - Modèle Rapport d'audit POC-to-Prod - 20260821a.html` **ne passe pas les oracles du socle HTML Digit-AI**, et les 4 défauts sont dans son **propre moteur** : deux `<h1>`, aucun `:root` de tokens CSS, et deux règles de surlignage non inline (`.brand-mark { display:flex }`, `mark.adr-hl { padding:0 1px }`). Mesuré le 25/08 par `check_html.py --output json`, jeu de règles `b10762163897` (29 règles), sur le rapport instancié. Les mêmes 4 défauts apparaîtront sur **tout** rapport issu de ce modèle. Le produit ne peut pas les corriger : le prompt d'audit lui interdit de toucher au moteur (« seules les données changent »), et la règle R-32 du socle projet exige pourtant un gate aval sur ce livrable. **Les deux règles se contredisent, et c'est le produit qui porte l'écart.** | Corriger le modèle à la source (un seul `<h1>`, tokens en `:root`, surlignage inline) pour que R-32 et le gate de format du kit puissent être verts en même temps. À défaut, déclarer explicitement dans le kit que ses livrables sont hors périmètre du socle HTML, pour que le produit n'ait pas à arbitrer seul. |

## Remarques restées au produit

Ce que le produit a corrigé chez lui et n'a pas remonté, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `output\` sert à la fois de dossier de livrables (règle 2 / D-15) et de racine d'exécution de l'application en mode local (`app/config.py:_runtime_root` renvoie la racine du dépôt) : les deux usages se marchent dessus. | `.gitignore` ignorant **nommément** les artefacts d'exécution (`output/history.json`, `output/jobs/`, `output/auth-admin.db`, `output/*.xlsx`), les familles numérotées restant versionnées ; collision documentée dans `output\LISEZMOI.md` et tracée en A-04 du `TODO-PRODUIT.md`. | non | Le conflit naît d'un choix propre à ce produit — écrire son runtime dans le dépôt — et non d'une règle de la factory. La règle 2 n'a pas à prévoir qu'une application écrive dans `output\` : c'est l'application qui doit en sortir. |
| Les 20 derniers commits précèdent l'adoption des Conventional Commits français (règle 9) : l'oracle reste en FAIL sur une fenêtre glissante de 20 commits. | Écart assumé et daté (E-01 du `TODO-PRODUIT.md`) ; les commits suivants sont conformes et l'écart se résorbe mécaniquement. | non | La règle prévoit déjà ce cas — elle juge une fenêtre glissante, précisément pour que l'écart s'efface sans réécrire l'histoire. Rien à changer : le mécanisme fonctionne comme prévu. |
| Le drapeau de démonstration attendu par R-23 (`MODE_DEMO`) n'existe pas : la frontière est portée par `APP_ENV` (`local` vs `azure`). | Écart assumé (E-02) ; le comportement exigé — la démo n'existe pas hors du poste local — est tenu et **couvert par deux tests exécutés**. | non | Le nom du drapeau diverge, l'intention est tenue et prouvée. Renommer toucherait la configuration de tous les postes pour un gain nul. C'est un cas particulier de produit importé, pas une classe. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot. Les livrables du
run viennent du **kit d'audit Client-A** (modèle de rapport, gabarit de fiche sécurité, gabarit de
présentation Design Authority), traité comme un entrant : les retours qui le concernent sont
remontés ci-dessus (RA-1, RA-2) et non ici, puisque ces gabarits n'appartiennent pas à la
bibliothèque de la factory.

Les huit fichiers de `docs\projet\` ont en revanche été instanciés depuis `gabarits\docs-projet\`
et n'ont appelé **aucun ajout hors gabarit** : la structure a couvert le besoin d'un produit
importé, y compris le cas — non prévu à l'origine — d'un `COMPOSANTS-OPS.md` sans environnement
de données interrogé, que la section « déclarée même vide » a permis de traiter proprement.

## Confirmations positives

- **R-32 (gate aval des livrables HTML)** a tenu son intention exacte : joué pour la première
  fois sur ce produit, il a révélé que **trois livrables déjà remis à des humains** n'avaient
  jamais été mesurés (448, 12 et 10 écarts). Le fait que la règle n'exige pas un PASS mais la
  **consignation du verdict** est ce qui a permis de l'appliquer sans bloquer le run.
- **R-47 (héritage du pilot)** a détecté quatre artefacts absents et deux périmés sur un produit
  qui portait pourtant un `forge\` complet — exactement le cas que la règle décrit.
- **L'échelle de résolution** (méthodologie §4, point 15) a évité trois « non vérifié » : `pip`
  absent du venv → `importlib.metadata` ; `pytest-cov` absent → `coverage.py` ; HTTP en timeout
  sur l'environnement déployé → `az` CLI, puis reprise du smoke avec un délai long. Les trois
  voies retenues sont journalisées.
- **`verifier-couverture-fonctionnelle.mjs`** a produit le constat le plus utile de l'audit :
  12 endpoints sur 35, découverts par confrontation du code au manifeste — un chiffre qu'aucune
  lecture de couverture d'instructions (65 %) n'aurait donné.

## Ordre recommandé

1. **RA-1** — meilleur rapport gain/effort : un filtre de suffixe PEP 440 et un compteur qui
   s'incrémente. Sans cela, chaque audit peut produire une recommandation de montée vers une
   pré-version, et le validateur ne la verra pas.
2. **RA-2** — corriger le modèle à la source lève une contradiction entre deux règles opposables,
   sur tous les projets audités à la fois.
3. **RV-1** — confort, mais le temps perdu est invisible : rien n'indique que la déclaration
   d'écart a été faite au bon endroit.
