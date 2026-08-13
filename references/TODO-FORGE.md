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
