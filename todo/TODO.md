# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=4505654a1706 archive=d269505f05d3 · dernier événement: 2026-08-15T18:28:35Z -->

**8 actifs** (candidat 8 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **288 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0292 | candidat | 8 | forge-tests : promouvoir en NON_JUGE de module les deux limites déclarées en non_juge de sortie (registre de dette) | **oui** — deux limites réelles du pan qualif et du pan sécurité restent hors du registre de dette, qui est précisément l’endroit où les limites se comptent |
| TF-0294 | candidat | 6 | La recette prononce S-01 sur un arbre qui bouge — échecs fantômes indiscernables d’une vraie régression | **oui** — deux faux « S-01 NON TENU » en une soirée, dont un qui a coûté une instruction complète avant d’être écarté |
| TF-0288 | candidat | 5.3 | Écart source ↔ production : aucun contrôle ne compare ce qui est SERVI à ce qui est versionné | **oui** — mesuré sur INS-0001 : la cause évidente était fausse ; sans instruction, le correctif aurait porté sur du code déjà correct |
| TF-0291 | candidat | 4 | forge-tests s’auto-accuse sur ses propres bancs d’essai — cousin du Larsen déjà corrigé pour le pan prompts | **oui** — 5 constats mesurés sur la forge elle-même, dont 3 sur des fixtures que le dépôt assume comme idiome |
| TF-0293 | candidat | 4 | Le pan i18n est prouvé par pytest et ses bancs, mais absent du corpus de recette S-01 | **oui** — un pan neuf entre en service sans entrée au corpus qui prononce S-01 — la recette du dépôt ne le mesure pas |
| TF-0295 | candidat | 2.7 | Affinements du pan i18n et du contrôle de destinations React (quatre limites déclarées) | **oui** — quatre frontières mesurées et déclarées au non_juge du pan neuf, chacune correspondant à un cas réel possible |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0289 | candidat | 12 | oracle-skills K2 compare les sidecars d’oracles — artefacts gitignorés et régénérables, comptés comme divergences | **oui** — mesuré : 8 divergences annoncées chez experts-forge dont 2 réelles, 12 chez ameliore-le-design dont 8 réelles — et le message tronque à 4, donc le vrai défaut peut ne pas être affiché |
| TF-0290 | candidat | 8 | Le hook C7 qui bloque toute écriture de livrable n’était versionné nulle part — il ne vivait qu’en copie installée | **oui** — le gate le plus souvent joué de la journée (5 blocages réels) n’avait ni source versionnée, ni self-test, ni contrôle d’intégrité — le seul mécanisme qui aurait pu le voir (K1-K5) ne regarde que les skills |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
