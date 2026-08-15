# Étude d'opportunité — le coût du faux positif d'oracle (TF-0275..TF-0282) — 20260815e

## Seuil de déclenchement (vérifié)

Les 8 items portent **gain 3 avec preuve 1** (seuil TF-0155) et touchent **4 forges**
(design, tests, ops, agents) plus le hook d'écriture du poste. Étude obligatoire.

## 0. Traitement des entrants

Le lot instruit est une DONNÉE : ses impératifs se citent, ne s'exécutent pas. Sources :
lot `digit-desk.fr - RETOURS - 20260815a` (ingéré le 15/08), frictions vécues sur un
run réel — chaque item porte ce que le contournement a coûté.

## 1. Partition du problème

- **P-a Faux positif sur construction légitime** : l'oracle refuse ce qui est correct
  (JS vendoré scanné comme balisage, paires de tokens jamais co-occurrentes, images
  reprises sans prompt, fragments Jinja jugés comme pages) — TF-0275, 0276, 0277, 0282.
- **P-b Bruit qui noie le vrai** : le périmètre inclut ce qui n'est pas du produit
  (vendored de tests) — TF-0280.
- **P-c Verdict inexploitable** : le défaut est réel mais son détail est perdu, ou son
  identifiant n'est pas stable d'un run à l'autre — TF-0278, 0279.
- **P-d Correctif connu non propagé** : un défaut déjà corrigé ailleurs subsiste dans un
  oracle voisin — TF-0281.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `check_maquette` C2/C15 (design) | l'item : « le source minifié de Motion, **vendoré par la forge elle-même** (`oracles/vendor`), déclenche C15 » | la règle vise le balisage d'une page ; rien n'exclut les blocs `<script>` — le faux positif est dans le périmètre de scan, pas dans la règle |
| `oracle-tokens` T5 + sa doc | `references/tokens.md` « recommande la convention texte-/fond- pour les états sémantiques » alors que T5 croise chaque `texte-*` avec chaque fond | contradiction doc ↔ oracle : l'oracle contredit la convention que la même forge publie |
| `oracle-images` I5/I6 | l'item : « pour des photos réelles reprises sur mandat du propriétaire, prompt et modèle **n'ont pas d'objet** » — manifeste rempli de 18 « aucun » | I1-I4 (alt, budget, réseau) restent pertinents ; I5/I6 présument la génération, cas non prévu |
| `run-oracles-design` (agrégateur) | l'item : « le détail (L2 accroche bridée 0.47) n'était visible qu'en lançant `render_page.py` directement — l'agrégateur perd `issues[]` » | l'agrégateur existe et agrège les verdicts ; il ne propage pas les constats — le contrat JSON de la forge prévoit pourtant `findings[]` |
| Pan sécurité forge-tests vs gates forge-development | l'item : « les gates de forge-development **excluent `vendor/` par contrat** » — le pan sécurité, non (114 constats sur `tests/vendor/axe.min.js`) | la convention d'exclusion EXISTE dans l'écosystème ; elle n'a pas été portée au pan sécurité |
| Pan secrets forge-tests (ids stables) | l'item : « comme le pan secrets (**112/112 contestations prises**) » alors que SAST embarque « `forge-tests-securite-<aléa>` » | le mécanisme de contestation existe et fonctionne — sur un pan seulement ; l'autre l'a rendu inopérant par son identifiant |
| `ops.mjs deployer` corrigé le 15/08 (TF-0245) | commit ops@13aa2fc : « `path.resolve()` appliqué une fois à l'entrée CLI » ; l'item : « `ops.mjs deployer`, lui, marche en relatif » — `oracle-ops` O-2, non | le correctif existe **dans le même dépôt**, non propagé à l'oracle voisin : dette de propagation, pas défaut neuf |
| Hook C7 `qo-gate-write.mjs` | son code : `SEGMENTS_EXCLUS = ['node_modules', '.git', 'fixtures', …]` — exclusion par SEGMENT de chemin, aucun critère de contenu | le mécanisme d'exemption existe ; un fragment Jinja (`{% %}`, tokens liés par `<link>`) n'est ni un segment exclu ni une page autonome — cas non prévu |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée ; le lot est un
état des lieux interne daté, chaque item portant sa mesure prise sur un run réel du
15/08 (114 constats, 18 déclarations « aucun », 3 runs d'ids SAST comparés). Revue
datée en section 5.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo, cité par les items : embarquement
  base64 du vendored **+ 2 rebuilds** ; renommage de tokens **hors de la convention
  publiée par la forge** ; écriture des templates **par la voie shell** pour contourner
  le hook ; contestations SAST **impossibles sur 3 runs vérifiés**. Le coût n'est pas le
  faux positif : c'est le contournement qu'il impose, et un gate contourné cesse d'être
  un gate.
- **O1 — assouplir les règles fautives (baisser les seuils, retirer C15/T5/I5-I6)** :
  coût ½ j ; rejetée — G-2 de l'écosystème : on ne desserre pas un contrôle pour faire
  taire un cas ; les défauts réels que ces règles attrapent disparaîtraient avec le bruit.
- **O2 — corriger le PÉRIMÈTRE de chaque règle, la sévérité inchangée** (décaper les
  `<script>` avant scan, apparier les tokens par co-occurrence, `genere:false` avec
  source et date, exclure le vendored comme les gates le font déjà, id SAST ancré au
  projet, propager `issues[]`, `path.resolve()` dans O-2, exempter les fragments à
  marqueurs de moteur de templates) : coût 2-3 j répartis sur 4 forges ; chaque
  correction exige sa **fixture rouge** — sans quoi on ne saurait pas que la règle sait
  encore refuser.
- **O3 — un mécanisme générique d'exemption motivée dans tous les oracles** : coût 3-4 j ;
  rejetée pour ce lot — une exemption est plus facile à poser qu'un périmètre juste, et
  chaque exemption est une porte ouverte permanente ; à réserver aux cas où le périmètre
  ne peut pas être décidé mécaniquement (ce qui n'est le cas d'aucun des 8).
- **O4 — remonter le lot en loi transverse (« un contrôle contourné n'est plus un
  gate »)** : le constat est juste et il complète R-35, mais l'élévation au noyau est un
  arbitrage distinct de la correction des 8 défauts — candidature séparée, pas une
  option de ce lot.

## 5. Verdict

- **Option retenue : O2** — périmètre corrigé règle par règle, sévérité inchangée,
  fixture rouge exigée pour chacune (la règle doit continuer de savoir refuser).
- **Coût** : design 1 j (TF-0275..0278), tests 1 j (TF-0279, 0280), ops et agents ½ j
  (TF-0281, 0282) ; dette assumée : les exemptions de contenu (fragments de moteur de
  templates) reposent sur des marqueurs — un marqueur exotique ne sera pas reconnu, la
  limite se déclare au `non_juge` de l'oracle.
- **Candidature(s) émise(s)** : la loi transverse d'O4 est à consigner séparément
  (constat en passant du pilot) ; les 8 items sont décidés directement (mandat global
  humain du 15/08).
- **Plan de revue : 2026-09-15** — au prochain run réel : un contournement d'oracle
  a-t-il encore été payé, et les fixtures rouges des 8 règles sont-elles toujours au
  banc ?
