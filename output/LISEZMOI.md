# output\ — rangement (13/08/2026, amendé le 18/08/2026 — TF-0339)

Livrables du pilot rangés en dossiers numérotés par famille ; **une seule version à la
racine de chaque dossier, versions antérieures dans `old\`** (mandat humain du 13/08).
Le nom des fichiers ne change jamais (`<Projet> - <Objet> - AAAAMMJJ<indice>`, règle
`references\ETAPES-RUN.md`) : seul leur emplacement change.

| Dossier | Famille | Contenu |
|---|---|---|
| `01-revues-et-propositions\` | Revues et propositions d'écosystème | Revue Écosystème 20260808a (+ sidecars `.oracles*`), Proposition Tuyauterie cognitive 20260809a |
| `02-schema-ecosysteme\` | Schéma d'écosystème (HTML) | version courante : `20260820a.html` (V14, forge-seo-geo — TF-0412) ; `old\` : 20260810a.png, 20260811h.html, 20260812a.html, 20260812b.html, 20260813a.html + `.oracles\` (rendus 20260811h) |
| `03-etudes\` | Études d'opportunité | opportunité forges (12/08), forge-data × moteurs (12/08), personas agents (13/08) |
| `04-plans\` | Plans stratégiques | stratégie tests e2e (13/08) |
| `05-catalogues-readmes-forges\` | Sections catalogue proposées aux README des forges | 13 sections + LISEZMOI (générées depuis `catalogues\catalogue.jsonl`) |
| `05-insatisfactions\` | Dossiers d'instruction des insatisfactions (TF-0287) | un dossier par insatisfaction (`INS-XXXX\`), chemins portés par `insatisfactions\REGISTRE.jsonl` |

**Deux familles portent le numéro 05, et ce n'est pas une erreur à corriger — c'est une
erreur à DÉCLARER (TF-0339, 18/08).** `05-insatisfactions\` a été créée sans prendre le
premier numéro libre, qui était 06 : la collision est réelle et contraire à D-15. Elle n'est
pourtant PAS résolue par un renumérotage, et R-39 al. 2 dit pourquoi — « le numéro s'attribue à
la création et ne se renumérote JAMAIS : un renumérotage casse les chemins portés par les
registres à événements figés ». Vérifié avant d'écrire ces lignes, et c'est ce qui tranche :
les DEUX familles sont citées dans des registres figés — `todo\TODO.jsonl` porte les deux,
`todo\TODO-ARCHIVE.jsonl` et `insatisfactions\REGISTRE.jsonl` portent
`05-insatisfactions\` (dont le dossier d'INS-0001). Déplacer l'une ou l'autre romprait des
chemins que ces registres ne réécrivent jamais. Ce qui rend la collision tenable : le numéro est
LOCAL au dépôt, le nom de famille est canonique (D-16) — c'est le nom qui identifie, le numéro
qui ordonne. **Conséquence opérationnelle : la prochaine famille créée ici prend `06-`.**

Correspondance des anciens chemins (références des documents antérieurs à ce rangement,
notamment les événements du registre `todo\TODO.jsonl`, jamais réécrits) :

- `output\Digit-AI - Revue Forge - …` → `output\01-revues-et-propositions\…`
- `output\Digit-AI - Proposition Forge - …` → `output\01-revues-et-propositions\…`
- `output\Forge Pilot - Schéma Écosystème - …` → `output\02-schema-ecosysteme\…` (ou `…\old\`)
- `output\.oracles\` → `output\02-schema-ecosysteme\old\.oracles\`
- `output\20260812-etude-*.md`, `output\20260813-etude-*.md` → `output\03-etudes\…`
- `output\20260813-plan-*.md` → `output\04-plans\…`
- `output\20260812-catalogues-readmes-forges\` → `output\05-catalogues-readmes-forges\`

Même méthode appliquée le 13/08 aux `output\` des forges : agents (01-pv, 02-skills),
design (01-pages-temoins), organization (01-etudes, 02-composants), seo (01-decisions,
02-veille). forge-audit_nhood était déjà conforme (modèle d'origine : `01-…`/`07-…` + `old\`).
