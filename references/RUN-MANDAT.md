# Run de mandat transverse — quand le livrable est un document, pas un logiciel

Troisième voie d'exécution (avec `ETAPES-RUN.md` et `RUN-VERSION.md`), née du retour RV-1
du run SCC_ALX (13/08/2026) : un mandat forge-data (analyse de mapping), forge-audit
(gouvernance), forge-seo (audit post-MEP) ou tout mandat dont le livrable est un
**document ou un verdict** n'a ni conception à 4 verbes, ni design, ni development, ni
MEP — et le run SCC_ALX a dû improviser ce que cette page encode désormais.

## Ce que le socle exige quand même (invariant, jamais négocié)

1. **Socle projet complet** : `input\`/`output\`/`docs\`/`forge\`, git local dès
   l'ouverture, `oracle-conformite-projet.mjs` PASS — un mandat transverse vit dans un
   projet conforme comme les autres (R-1…R-27, R-32).
2. **Ledger dès l'ouverture** : `run_open` avec `versions_forges` (R-19), une entrée
   `invocation` par service de forge mobilisé, `oracles_verdict` pour chaque oracle
   exécuté, `retour` pour chaque friction, `run_close` au bilan.
3. **Fraîcheur** : pull pilot `--ff-only` + `node bootstrap.mjs --pull` avant tout.
4. **Routage et mesure** : CONTRAT-INTERFACE §4/§4 bis, escalades consignées
   (« aucune » compris).

## La séquence (remplace les 5 étapes du run produit)

1. **Ouvrir** — socle + git + oracle de conformité PASS ; le mandat reformulé en une
   phrase au ledger (qui demande quoi, sur quel périmètre, avec quelle preuve attendue).
2. **Cadrer la preuve** — AVANT de produire : quels oracles jugeront le livrable ?
   (forge-data : `oracle-tracer`/`oracle-profiler`/`oracle-restituer` ; forge-audit :
   ses gates ; HTML : `check_html.py` + `render_page.py` — R-32). Domaine sans oracle →
   en définir un (standard `quality-oracles`) puis le remonter au registre. Les
   arbitrages de nommage entrant vs R-4 se tranchent ICI (R-4 alinéa RV-2 : le pilot
   prime, correspondance au ledger).
3. **Produire sous oracles** — le livrable se construit par éditions chirurgicales,
   chaque chiffre tracé à sa source (forge-data : marqueurs `[c:id]`), aucune écriture
   hors du projet (les bases connectées se lisent en LECTURE SEULE — requêtes archivées
   avec leurs résultats sous `forge\etapes\<mandat>\mesures\`).
4. **Juger** — tous les oracles cadrés au pas 2 exécutés, verdicts au ledger ; un FAIL
   se corrige ou se déclare (boucle bornée ≤ 3, G-2 : jamais d'assouplissement).
5. **Clore** — livrable nommé R-4 dans `output\` (journal d'oracles sous
   `forge\oracles\` — R-32 pour le HTML), lot `<projet> - RETOURS - AAAAMMJJ<i>.md` +
   sidecar remis à `<pilot>\input\00-retours\`, `run_close`, synthèse **au format
   `gabarits\RESTITUTION.md`** (8 blocs, horodatée, jugée par `oracle-synthese.mjs`).

## Ce qui ne s'applique PAS (et ne se singe pas)

- Pas d'`EXIGENCES.json` scellé ni de 4 verbes — le mandat cadre, le ledger trace.
- Pas d'étape design ni de tokens — sauf si le livrable est une page HTML : alors le
  socle `digit-ai-page-html` s'applique en entier (charte, G1 clair strict, favicon-lettre,
  E4, standard H).
- Pas de MEP ni de GO production — la remise du livrable EST la fin du run ; le seul
  gate humain est celui que le mandat déclare.
- Pas de boucle de fermeture forge-tests — les oracles du domaine tiennent ce rôle.

Contrat « prêt à remettre » (tous mesurables) : conformité projet PASS · oracles du
domaine PASS (ou écarts déclarés) · traçabilité des chiffres 100 % · ledger vérifié ·
lot de retours remis.
