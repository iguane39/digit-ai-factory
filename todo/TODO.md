# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=00dfc46e8108 archive=e0b33b386222 · dernier événement: 2026-08-13T07:44:14.088Z -->

**3 actifs** (candidat 3 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **147 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0149 | candidat | 4 | Encoder le rangement d'output\ en convention transverse (familles numérotées + old\) et trancher old\ vs Old\ (D-06) | **oui** — la divergence est constatée sur pièces : trois documents normatifs écrivent la même notion de trois façons (old\ / Old/ / Old\ non versionné) et le rangement du 13/08 a dû choisir sans convention ; sans D-xx, chaque prochaine campagne ou produit re-choisira, et les output\ divergeront à nouveau (c'est exactement ce que le mandat du 13/08 a dû rattraper sur 5 dépôts) |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0147 | candidat | 2 | Consigne de restitution versionnée pour les synthèses à l'humain — le seul delta positif de l'étude personas (pas de persona-juge) | **oui** — les synthèses de clôture et propositions de prochaines actions n'obéissent aujourd'hui à aucun format vérifiable — la forme varie d'un run à l'autre et le classement des restes (R-29) n'est garanti que par habitude ; coût non chiffré (aucun incident consigné), d'où preuve=1 et le passage par A/B avant toute généralisation |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0148 | candidat | 6 | Recette forge-tests : la section dette échoue (invariants-003/004 désynchronisés) — préexistant, prouvé par git stash | **oui** — la recette de la forge ne peut pas prononcer S-01 tant que la section dette est rouge — le registre de dette, source de vérité de ce qui reste à faire dans la forge, est désynchronisé de son contrôle |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
