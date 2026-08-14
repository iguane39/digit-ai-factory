# Étapes d'un run produit — détail opérationnel

Référence chargée à la demande depuis le noyau `CLAUDE.md` (TF-0053) : le noyau donne la
séquence, ce fichier donne le mode opératoire de chaque étape. À charger à l'ouverture de
l'étape concernée, pas d'un bloc.

## 1. Ouvrir le run

Dans le projet produit, créer `forge\` (`ledger.jsonl` ouvert avec `run_open`, `BRIEF.md` avec
le brief reçu, `etapes\`). Si `PROMPT-PRODUIT.md` n'est pas à la racine du projet, l'y copier
depuis le pilot (auto-documentation et reprise). Écrivain unique du ledger : l'orchestrateur.
Les chemins d'étapes se lisent `<projet>\forge\etapes\…`.

**Socle projet** (`REGLES-PROJET.md`, décidé le 06/08) : créer `input\`, `output\`, `docs\`,
le `.gitignore` socle (`.env`, `.venv/`, `__pycache__/`, `node_modules/`, `generated/`,
`Old/`, sidecars d'oracles `*.oracles*.json[l]` avec exception `!forge/**` — TF-0065/C4), `.env.example` (toutes variables attendues, applicatives + infra, tierces marquées
`# à fournir :`), le `CLAUDE.md` du produit **d'après `gabarits\CLAUDE-PRODUIT.md`** (la
section « Routage forge » est obligatoire et remplie : c'est elle qui garantit que les
sessions ad hoc dans le produit passent par les forges pour tout verdict — tests, évolution,
déploiement — la boucle intérieure restant libre), le `README.md`, puis `git init -b main` +
commit initial — commits locaux à chaque étape, **remote/push sur GO humain seulement**.
Créer aussi `forge\retours\` avec une copie de `gabarits\RETOURS-FORGES.md` (le canal de
retours du produit — règle 18).

**Socle documentaire `docs\projet\` (R-20, TF-0086/TF-0091 — la création appartient à
l'ouverture)** : copier les **8 gabarits** de `gabarits\docs-projet\` (TECHNOS,
COMPOSANTS-OPS, PARAMETRAGE, ACCES-TEST, COMMANDES, FONCTIONNEL, ARCHITECTURE,
MODELE-DONNEES), renseigner chaque frontmatter (`role`, `sources_de_verite`, `verifie_le`)
et ce qui est déjà connaissable, puis générer les 2 projections :
`node <pilot>\scripts\generer-architecture.mjs docs\projet\ARCHITECTURE.md` et
`node <pilot>\scripts\generer-modele-donnees.mjs docs\projet\MODELE-DONNEES.md` (vues
JAMAIS éditées à la main — R-20 exige leur présence). Chaque étape actualise ensuite SES
fichiers : conception → FONCTIONNEL (vue d'`EXIGENCES.json`) · design/development → TECHNOS
(ancré lockfiles, R-21), ARCHITECTURE et COMMANDES · development → MODELE-DONNEES **depuis
le schéma réel** (provenance par table, R-26) · MEP → COMPOSANTS-OPS, PARAMETRAGE (URLs au
motif R-24) et ACCES-TEST — toute édition d'une source régénère sa vue. Produit à surface web : copier aussi `gabarits\web\robots.txt` (agents IA autorisés par
défaut — bloquer se décide et se consigne dans le fichier) et `gabarits\web\llms.txt`
(carte tenue par development/MEP, R-27). Produit importé : rattrapage explicite à
l'ouverture (socle créé depuis l'état constaté, `.env.example` reconstruit avant R-22).

**Valider** : `node <pilot>\oracles\oracle-conformite-projet.mjs <projet>` → PASS exigé avant
l'étape 2 ; rejouer l'oracle avant `run_close` — **un FAIL R-20 (socle incomplet) bloque la
clôture** (TF-0086 : un run s'était clos à 1 fichier sur 5 sans signal). Nommage : tout livrable copié dans
`output\`/`docs\` porte `<Projet> - <Objet> - AAAAMMJJ<indice>` — **le nom du projet prime
sur l'émetteur** (Q3-bis, décision humaine du 09/08) ; un livrable remplacé migre dans `Old\`
(jamais versionné) ; le code, lui, n'est jamais daté — git est son seul magasin.

## 2. Étape conception (mode dégradé, cf. contrat §5)

Appliquer les **4 verbes** documentés dans `<racine>\digit-ai-forge-conception\skills\` →
`ENTRANT.md`, `SURFACE.md`, `EXIGENCES.json` + vues, puis `derive-les-vues` →
`CADRAGE-DESIGN.md` (sha256 scellé). Un ton fourni par délégation (« reprendre le ton de X »)
se résout par observation datée consignée en hypothèse — pas de suspension. Loi 3 : la
surface implicite SaaS est proposée d'office en exigences candidates et s'écarte
explicitement (cf. `enumere-la-surface`).

**Valider** : `node <conception>\oracles\oracle-{exigences,tracabilite,surface,claims}.mjs
<EXIGENCES.json>`. Sous le seuil de suffisance → `bloque_question` : écrire `QUESTIONS.md`,
suspendre.

## 3. Étape design (mode dégradé, oracles natifs)

Appliquer la méthode `systeme-de-marque` (→ `tokens.css` + `MARQUE.md` + page témoin, puis
`DESIGN.md` dérivé : `node <design>\skills\systeme-de-marque\scripts\generer-design-md.mjs
--tokens … --marque … --nom <Produit> --sortie etapes\design\DESIGN.md` — la charte
consolidée, régénérée à toute évolution) puis, si le produit a une UI, `ameliore-le-design`
(→ maquette HTML autonome). Champs `ton` et `contraintes reprises` non dérivables → question
humaine si absents du brief.

**Valider** : `node <design>\oracles\run-oracles-design.mjs <html> --tokens <tokens.css>
--json-only`.

## 4. Étape development (mode dégradé — `conductor` inutilisable en headless, dette D-V1)

Construire le produit à la racine du projet à partir de `EXIGENCES.json` (périmètre MVP), de
`tokens.css` et de `DESIGN.md` (copié dans `design\DESIGN.md` du produit — c'est le fichier
que le gate design de forge-development linte).

**Source unique des disciplines : `docs\run-playbook.md` de forge-development** (TF-0007) —
en cas de divergence entre un résumé et le playbook, le playbook fait foi. En résumé :
modifications chirurgicales, simplicité d'abord, chaque exigence MVP tracée vers son
implémentation et son test ; **discipline d'auditabilité** (app en instance module
`app.main.app`, couche SQL observable, contraintes nommées `<type>_<table>_<colonne>`,
`responses=`/`status_code` exacts, migrations `-- +migrate Up/Down` exercées
aller/retour/rejeu, tests citant les id d'exigences — cf. « Contrat du projet audité » du
README de forge-tests) ; **disciplines de livrable** (lois 1, 2, 4) : zéro élément interactif
sans effet, artefacts de démonstration derrière `*_MODE_DEMO` absent par défaut, données
volatiles en base éditables datées sourcées.

**Valider** (gates rejoués) : `ruff check` + `pytest` au vert sur le produit ; chaque
exigence MVP a ≥ 1 test qui la cite par son id (gate grep 100 %).

> **Process longs — toutes étapes (TF-0094)** : tout traitement dépassant ~2 minutes
> (mutation, rendu, scan, migrations, déploiement, génération d'images) émet son
> avancement **toutes les 3 minutes** au format `gabarits\AVANCEMENT-PROCESS.md`
> (tableau 8 champs + `<run>/avancement.jsonl` ; émetteurs `scripts\avancement.*`).
> Un process long muet est en défaut de contrat.

## 5. Étape tests (mode natif)

`uv run python -m forge_tests <racine-produit> --json` depuis
`<racine>\digit-ai-forge-tests`, stdout capturé et persisté dans
`etapes\tests\rapport-forge-tests.json`. Exit 0 = PASS, 3 = PARTIEL acceptable (consigner les
pans non couverts), 1 = FAIL → boucle de fermeture. Ajouter `--livrables
etapes\tests\livrables\` : cahiers de tests (fonctionnel, technique) + jeux de données
synthétiques + dashboard HTML — copiés datés dans `output\` (règle 16).

**Boucle de fermeture bornée** : chaque item `actions[]` du rapport porte son `etape_cible` ;
router les `auto_ia` — `development` (code, câblage), `tests-suite` (cas générés à adopter,
assertions, jeux de données — exécuté sous les gates de development, sur propositions de la
forge), `design` (état/écran manquant à la promesse → artefacts design puis delta
development), `mep-config` (variable, peuplement — jamais dans le code), `forge` (défaut de
l'AUDITEUR → sort de la boucle produit, part au lot de retours — on ne corrige jamais le
produit pour contourner un bug de la forge). Chaque cycle se clôt par un RE-AUDIT COMPLET.
**Au plus 5 cycles toutes étapes confondues, extensibles à 7 si chaque cycle réduit
strictement le reste d'`auto_ia`** (mandat humain du 14/08 — l'ancienne borne de 3 laissait
des actions automatisables au rapport final) ; la boucle ne s'arrête pas tant qu'il reste des
`auto_ia` ET que la borne n'est pas atteinte — un rapport livré avec des `auto_ia` restants
en explique le motif (borne atteinte, ou dépendance à une action humaine préalable, p. ex.
configuration absente). Garde G-2 absolue : jamais d'assertion assouplie ni de seuil
requalifié — un échec résistant = retour consigné avec diagnostic. Les items `manuelle_dev`
et `manuelle_utilisateur` sont listés avec leur attendu détaillé (dashboard, onglet Actions)
— l'objectif : maximiser l'auto-traité, ne laisser en manuel que l'irréductible.

**Sécurité du produit livré (R-33, 14/08)** : les exigences ASVS curées de forge-websec
s'opposent dès la *conception* (profil `webapp`), la méthode de test s'exécute *ici*, et le
verdict websec est produit au *gate MEP* — **présent et non bloquant** par défaut, armable
produit par produit avec `[gates] websec_bloquant = true` (R-33 bis). Toute exécution **active** (DAST, fuzzing, injection
réelle, intrusion) est une voie **sur mandat humain**, jamais automatique — six garde-fous
exigibles avant exécution, détaillés en `REGLES-PROJET.md` §M. Même discipline pour la
dépense (R-34, §N) : un pan qui appelle un modèle payant s'active explicitement, sous plafond,
et publie ce qu'il a consommé — un audit lancé sans option ne coûte rien.

**Message de fin de traitement (v2, 14/08)** : toute clôture — de run, de campagne, de mandat —
suit `gabarits\RESTITUTION.md` : huit blocs dans l'ordre, **aucun ne disparaît** (un bloc vide
se dit en une ligne), en-tête **horodaté à l'heure près**, décisions en tête et en choix
fermés, non traités **avec leur motif**, risques avec leur signal, prochaines actions par
acteur ET par ordre justifié. Contrôle exécuté : `node oracles\oracle-restitution.mjs
<synthese.md>` (S1-S8, self-test double sens). Une CLI ou une recette en tient la forme
dégradée : horodatage · verdict · restes classés.

## 5 bis. Revue graphique d'implémentation (en PARALLÈLE de l'étape tests)

Regards indépendants : la fonction pour tests, la forme ici. Mode « critique
d'implémentation » de forge-design
(`skills\critique-le-design\references\critique-implementation.md`) — le produit jugé contre
SA promesse design (tokens du run, écrans/états, CTA, rendu 2 thèmes, voix). Sortie :
`etapes\design\revue-implementation.md`, écarts versés au ledger (`type: retour`,
`source: produit`, destinataire development). Verdict Refondre ou ≥ 1 bloquant → retour à
development (boucle bornée partagée avec l'étape tests). Un écart voulu se consigne en
hypothèse — la revue le classe « accepté », pas défaut.

## 6. Étape MEP (portée par le pilot — `ETAPE-MEP.md`)

Dockerfile/compose dans le produit, déploiement **staging** réel, `ROLLBACK.md` testé une
fois, oracle MEP M-1…M-5 exécuté (build, healthcheck ×3, smoke tests des exigences critiques
contre l'instance servie, rollback prouvé, scan secrets de l'image). Puis générer
`DOSSIER-MEP.md` et demander le **GO humain** — la production n'est jamais lancée sans lui ;
sans GO, clore en `pret_production_en_attente_GO` (état de succès).

## 7. Clore le run

Compiler les entrées `type: retour` du ledger en un **lot de retours** —
`forge\retours\<projet> - RETOURS - <AAAAMMJJ><indice>.md` + **sidecar `.tf.jsonl`** homonyme
(candidatures SANS id, gabarit `gabarits\RETOURS-FORGES.md` ; le préfixe projet est
obligatoire, décision 13/08) avec contrôle de complétude ledger↔lot — puis
**remise automatique** : copie des deux fichiers dans `<pilot>\input\00-retours\`. Ensuite `run_close`
au ledger avec le bilan, et synthèse à l'humain. Hors run, toute inspection/incident produit
son propre lot — un fichier par lot, jamais modifié après remise. **À réception d'un sidecar
dans `input\00-retours\`** (côté pilot) : le confronter d'abord au registre ET à l'archive
(un lot déjà traité par un autre canal part en `old\` sans ingestion), puis
`node todo\ingerer-lot.mjs <sidecar>` — validation atomique,
ids frappés, tout en `candidat` (l'automatique s'arrête là : la décision reste humaine),
oracle + vue régénérée.

## Contrat « prêt client »

Les seuls critères — tous mesurables, aucun « optimal »/« confiance » : oracles des étapes
1-3 verts · forge-tests exit 0 ou 3 avec seuils de couverture et de mutation tenus sur les
pans mesurés · oracle MEP 5/5 en staging · `DOSSIER-MEP.md` complet · traçabilité exigences
MVP → tests 100 % · ledger vérifié par `ledger.mjs verify`.
