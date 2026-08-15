# TODO-FORGE — registre des améliorations, mode opératoire

Référence chargée à la demande depuis le noyau `CLAUDE.md` (TF-0053).

Le registre structuré des améliorations vit dans `todo\` : source unique `TODO.jsonl`
(événements `creation`/`maj`/`ingestion`, écrivain unique : le pilot), vue générée `TODO.md`
(jamais éditée), archive `TODO-ARCHIVE.jsonl` (ids jamais réutilisés), `oracle-todo.mjs`
(R1-R10) à faire passer après toute écriture.

**Gouvernance** : tout entre en `candidat` ; seul un mandat humain (« décide TF-xxxx », un
export de TODO.html appliqué, ou un mandat global explicite) passe en `decide` — le décideur
et la date sont tracés (R6). Transitions : candidat→decide→en_cours→corrige|ecarte→archive.
Clôture `corrige` : `gains_constates`, `corrections_realisees`, `date_correction` exigés (R7).

**Intake** : lots des produits (règle 18), **lots des forges** (toute forge peut déposer un
lot ciblant n'importe quelle forge — même gabarit, remise dans `input\00-retours\`, préfixé
du projet ou de la forge émettrice), demandes humaines directes ; candidatures hors lot :
`input\01-candidatures\`. **Avant toute ingestion, confronter le lot au registre ET à
l'archive** : un lot déjà traité par un autre canal part en `old\` sans ingestion (incident
du 13/08 : 32 doublons créés puis retirés pour l'avoir omis). L'écriture DIRECTE dans
TODO.jsonl par une autre session est **interdite** — toute candidature passe par un sidecar
`.tf.jsonl` + `node todo\ingerer-lot.mjs <sidecar>`
(validation atomique, idempotente par sha du lot, ids frappés à l'ingestion). Le contournement
se détecte : règle **R10** de l'oracle (creation de session externe sans événement
`ingestion` — incident TF-0049).

**Prouver la boîte vide, à l'ouverture de tout run** — `node oracles\oracle-boite-entree.mjs`
(B1-B3, self-test 5/5, exit 0/1/2). Le 14/08, un lot `Produit-10 - RETOURS - 20260814b`
(5 candidatures) est resté dans `input\00-retours\` sans être ingéré pendant qu'un autre lot
du même jour l'était ; rien ne l'a signalé, et il a été trouvé par hasard en listant les
fichiers non suivis avant de poser un tag. La leçon tient en une phrase : **un registre à jour
ne dit rien de ce qui n'y est jamais entré** — l'oracle R1-R10 juge l'intégrité de ce qui est
DEDANS, jamais l'existence de ce qui est resté DEHORS. Trois défauts, tous mesurés sur le cas
réel : sidecar jamais ingéré (B1), sidecar édité APRÈS son ingestion — le registre en porte le
nom mais plus le contenu (B2), lot `.md` remis sans sidecar, donc ingérable par aucun canal et
invisible par construction (B3). Un sidecar brut au format produit est couvert par son dérivé
`.normalise.tf.jsonl` ingéré, et `old\` reste hors périmètre : le canal d'échappement
documenté plus haut n'est pas un défaut.

**Étude d'opportunité (TF-0155)** : avant de passer en `decide` un candidat qui **crée un
objet durable** (R-31), **touche ≥ 3 forges ou le noyau**, ou **porte un gain ≥ 3 avec une
preuve ≤ 2**, l'instruire via `gabarits\ETUDE-OPPORTUNITE.md` (livrable :
`output\03-etudes\`), jugée par `oracles\oracle-etude-opportunite.mjs` (E1-E7, self-test
`--self-test`). Sous le seuil : décision directe, pas de péage.

**À chaque campagne** : mettre à jour les items (date_correction, corrections_realisees,
**gains_constates exigés à la clôture**, version_forge_corrigee, produits_beneficiaires) puis
régénérer la vue **et la page** (`generer-page.mjs` → `TODO.html`, consultation humaine :
cases à décider + commentaires, export appliqué par `appliquer-export.mjs`). Le self-test
(`node todo\self-test.mjs`, fixtures à double sens) après toute évolution de l'outillage.

Consulter le registre à l'ouverture de tout run. `BOUCLE-AMELIORATION.md` reste le journal
narratif : il référence les ids TF, il ne duplique plus les listes.

## Insatisfactions — l'autre registre, et pourquoi il est séparé (TF-0287, 15/08)

Une **insatisfaction** n'est pas une amélioration : elle se **rouvre** (« ça ne va
toujours pas »), elle porte un délai dépôt→release, et son instruction est un dossier à
six blocs. Ce cycle de vie n'entre pas dans TF (candidat → décidé → corrigé → archivé) :
forcer l'un dans l'autre aurait déformé les deux (étude 20260815d, option O3 écartée).

- **Dépôt** : l'humain écrit UNE phrase et dépose ses captures — `gabarits\INSATISFACTION.md`,
  nommé `INSATISFACTION - <produit|a-identifier> - AAAAMMJJ<lettre>.md`, dans le canal des
  lots (`<produit>\forge\retours\` ou `<pilot>\input\00-retours\`). **Aucun sidecar exigé
  de lui** : c'est l'instruction qui le produira. Il n'écrit **jamais** le protocole.
- **Registre** : `insatisfactions\REGISTRE.jsonl` (écrivain unique : toi) — événements
  `depot` · `reouverture` · `instruction` · `cloture` ; vue `REGISTRE.md` générée.
- **Instruction** : `gabarits\AGENT-INSATISFACTION.md` (= AGENT-CAMPAGNE + les six blocs :
  reproduction aux conditions réelles · cause racine produit · **gates en défaut vérifiés,
  jamais présumés** (inexistant / aveugle / jamais joué — R-35) · solutions par
  destinataire · correctif et release par la voie du produit sous décision humaine ·
  retours forge en lot standard).
- **Contrôles** : `oracle-insatisfactions.mjs` (I1-I4 — il **publie aussi la mesure** :
  réouvertures et délai) et `oracle-boite-entree.mjs` **B4** (un dépôt jamais entré au
  registre est dénoncé ; B3 se tait sur ces fichiers, l'absence de sidecar y est voulue).
- **La mesure** : réouvertures par dossier, **cible zéro**. Un compteur qui monte accuse
  l'instruction, pas les forges.

Les constats d'une instruction reviennent au registre TF par la voie normale (candidats,
décision humaine) : les deux registres se parlent, ils ne se confondent pas.
