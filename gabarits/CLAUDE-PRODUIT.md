# <NOM-PRODUIT> — CLAUDE.md

<!-- Gabarit du pilot (gabarits\CLAUDE-PRODUIT.md) : l'orchestrateur remplit les <…> à
     l'ouverture du run. La section « Routage forge » est OBLIGATOIRE et vérifiée par
     oracle-conformite-projet (règle 11) — ne pas la supprimer ni la vider. -->

<Une phrase : ce que fait le produit, pour qui.>

Ce produit est construit et maintenu par la forge Digit-AI. État du run : `forge\ledger.jsonl`.

**Précédence des règles (R-43, factory).** Quand la factory est impliquée — run, mandat,
campagne, ou toute session qui mobilise une forge — **ses règles priment sur celles de ce
projet** (`REGLES-PROJET.md` et `CLAUDE.md` du pilot, références chargées). Ce fichier peut
les **renforcer**, jamais les assouplir ni les contourner ; un conflit se tranche en faveur
de la factory et se consigne au ledger (`type: conflit_regles`, les deux règles citées).
Les hooks de la factory (`.claude\settings.json` ← `gabarits\settings-produit.json`,
`forge\hooks\factory.mjs`) s'exécutent ici : fraîcheur à l'ouverture, restitution jugée à la
fin de chaque tour de travail (`gabarits\RESTITUTION.md`).

## Routage forge — obligatoire

Deux boucles, une règle : la **boucle intérieure** (développer, itérer) est libre ; tout
**verdict** (valider, livrer, faire évoluer, déployer) passe par les forges. Contourner une
route ci-dessous, c'est perdre ce qu'elle garantit — si une session s'apprête à le faire,
elle s'arrête et le dit.

| Intention | Le chemin | Jamais |
|---|---|---|
| « Relance les tests », valider, clore | audit forge_tests : `uv run python -m forge_tests "<racine-de-ce-projet>" --json --sortie forge\etapes\tests\rapport-<AAAAMMJJ>.json` depuis `<FORGE_ROOT>\digit-ai-forge-tests` — exit 3 = PARTIEL acceptable documenté ; reprise ciblée : `--reprendre <rapport>` | conclure « tests OK » sur un pytest direct |
| Corriger une anomalie, faire évoluer | consigner le retour au ledger (`type: retour`) puis **run de version** : rouvrir une session ici, coller `PROMPT-PRODUIT.md` (brief delta) ou « reprends le run » | éditer le code et livrer hors run |
| Déployer | étape MEP du pilot, **selon la route déclarée au brief** (TF-0662) — *manuelle à porte* : staging → qualif populée → **GO humain** sur `forge\DOSSIER-MEP.md` ; *déploiement continu* (`ETAPE-MEP.md` §4 bis) : contrôles en CI, déploiement conditionné au vert, vérification de production placée sur le **commit déclencheur** — le GO humain y est **la poussée** | mise en prod à la main **hors** de la route déclarée ; et surtout : prescrire une route que le produit ne suit pas |
| Juger le rendu visuel | mode « critique d'implémentation » de forge-design (produit vs promesse du run) | verdict à l'œil |
| Signaler un défaut / retour sur les forges | consigner AU MOMENT MÊME au ledger (`type: retour`, `destinataire: <forge>`) — pas de mémoire de fin de run | retour oral perdu, ou modification d'un lot déjà remis |

**Remontée automatique vers le pilot** : toute friction forge observée en session
(convention découverte en lisant du code, faux positif d'oracle, aller-retour subi) se
consigne immédiatement au ledger. À la clôture de tout run : compilation ledger → lot `.md`
+ **sidecar `.tf.jsonl`** (gabarit dans `forge\retours\`) avec contrôle de complétude — tout
retour du ledger a sa candidature, sinon le run le déclare — puis **copie automatique des
deux fichiers dans `<pilot>\input\00-retours\`** (nommés `<projet> - RETOURS - …`, le préfixe
projet est obligatoire). Le geste humain de remise disparaît ; la décision
humaine demeure (tout entre en candidat au registre TODO-FORGE).

Boucle intérieure (libre, sans verdict) : `<commandes locales : pytest, ruff, serveur de dev…>`

## Règles de socle applicables — remplies à l'ouverture, selon le type de livrable (TF-0765)

*Pourquoi cette section existe* : un brief a exigé « tri et filtres » sans nommer la règle ni le
composant du socle, et la console est partie avec un tri maison jugé conforme par ses propres
oracles — l'humain a dû redemander « comme demandé par la factory ». Une règle que le producteur ne
rencontre pas au moment où il produit n'existe pas pour lui. À l'ouverture du run, la session
remplit ce tableau pour chaque type de livrable du produit, et le brief de chaque livrable le cite.

| Type de livrable | Règles de socle qui s'appliquent | Composant / oracle |
|---|---|---|
| Page HTML de données (tableau, console, tableau de bord) | `references/BEST-PRACTICES-HTML.md` du pilot § I (pleine largeur, sommaire, alignement, dictionnaire de colonnes, temps structuré) ; L4 filtres de tableau, G1-G6 | composant `table-filters` du skill `digit-ai-page-html` ; `oracle-filtres-tableau.mjs` (joué à chaque écriture d'un `.html` par le hook `page-html`) ; `check_html.py`, `render_page.py` |
| Page HTML de prose (rapport, fiche, note) | socle `digit-ai-page-html` (charte, tokens, print) ; doctrine documentaire D1-D9 (`gabarits/documents/README.md` du pilot) | `check_html.py`, `render_page.py`, famille de gabarit du catalogue |
| <autre type de ce produit> | <règles> | <composant / oracle> |

Un type absent de ce tableau n'a pas de règle de socle déclarée : le déclarer « aucune » est une
décision, l'omettre est un oubli (loi n° 3).

## Commandes

- Lancer : `<commande>`
- Tests locaux (boucle intérieure) : `<commande>`
- Audit complet (verdict) : voir Routage forge ci-dessus.

## Conventions locales

- Socle projet : règles `REGLES-PROJET.md` du pilot (**`input\` en LECTURE SEULE pour tout
  producteur** — un livrable généré ne s'y écrit jamais, pas même à côté de sa référence : il
  va sous `output\`, dans le sous-dossier existant qui correspond, TF-0688 ;
  nommage daté des livrables dans
  `output\`/`docs\`, `old\` VERSIONNÉ pour les livrables documentaires — le code, lui,
  n'a que git, jamais de copie datée (C1/TF-0150, 13/08) —, `.env` jamais committé, commits Conventional
  Commits français — locaux par défaut, push sur GO humain ; socle documentaire R-20..R-23,
  types des livrables au registre d'organization R-25, URLs d'environnement
  `<appli>-{dev|qualif|production}` R-24 ; voie automatisée par défaut dans toute démarche
  proposée, actions restantes classées IA/développeur/utilisateur R-29 ; tout HTML
  autonome livré porte un thème clair par défaut et une bascule sombre câblée R-30 ;
  **aucun livrable publié sur un service hébergé** — artifact, page web, partage cloud —
  **sans GO humain préalable consigné** : un livrable est un fichier autoportant sur
  disque, chez le produit, et le retrait d'une publication fautive est un geste humain
  consigné R-38).
- `docs\projet\` (R-20) : TECHNOS, COMPOSANTS-OPS, PARAMETRAGE, ACCES-TEST, COMMANDES,
  FONCTIONNEL, ARCHITECTURE, MODELE-DONNEES (+ vues ARCHITECTURE.html et MODELE-DONNEES.html
  générées par les scripts du pilot, jamais éditées) — vues à sources de vérité déclarées
  (frontmatter), créées à l'OUVERTURE du run (gabarits du pilot) puis mises à jour PAR
  L'ÉTAPE concernée (conception → FONCTIONNEL · design/development → TECHNOS/ARCHITECTURE ·
  development → MODELE-DONNEES ancré au schéma réel (R-26) · MEP → COMPOSANTS-OPS, qui porte
  DEUX inventaires — les composants DÉPLOYÉS **et** les environnements de DONNÉES interrogés,
  avec leur hôte, leur profil de connexion et le mode d'accès de chaque catalogue (TF-0594) ;
  un produit qui ne déploie rien y déclare quand même ce qu'il LIT · toute
  évolution de config → PARAMETRAGE/COMMANDES) ; comptes de démo locale derrière
  `MODE_DEMO`, jamais de secret.
- `<conventions spécifiques au produit>`

## Lexique d'invocation (RV-6, étendu aux produits par TF-0723)

**Une formule du message qui figure LITTÉRALEMENT dans les déclencheurs d'un skill disponible
est une INVOCATION, jamais une tournure.** La coïncidence littérale prime sur l'interprétation
contextuelle ; en cas de doute réel, poser la question en une ligne AVANT d'exécuter la suite —
l'aller-retour coûte une minute, une construction lancée sans l'analyse due se compte en tours.
*Le fait qui a créé cette règle* : trois messages ouverts par « Améliore le prompt : » ont été
lus comme un préambule et exécutés sans le skill d'analyse présent dans l'environnement — le
travail rendu à la place était réel et accepté, donc RIEN ne signalait le manque (un skill non
invoqué ne laisse ni erreur ni journal, seule l'absence de son livrable propre le trahit) ; le
prompt ainsi ignoré valait 39/100 avec quatre défauts bloquants, et la construction fautive
avait commencé quand l'humain a interrompu. À l'ouverture de tout run : lister les skills
disponibles et leurs déclencheurs.

## Référentiels

Ce sur quoi la mesure peut — ou ne peut PAS — s'appuyer. **Une réponse par ligne, et « absent »
est une réponse valide** : ce qui est refusé est le silence. Rempli UNE FOIS à l'ouverture du
premier run ; le `run_open` du ledger le recopie (TF-0373).

| référentiel | état | ce qu'il donne à la mesure |
|---|---|---|
| **exigences** | `<chemin>` ou `absent — <motif>` | le seul terme de comparaison EXTERNE des cas dérivés ; sans lui, un cas généré sur une garde fausse CONFIRME le bug au lieu de le révéler |
| **anomalies** | `<chemin>` ou `absent — <motif>` | ce que le CLIENT sait déjà de ses défauts (export JSONL de son gestionnaire de tickets, `FORGE_TESTS_ANOMALIES`) |
| **contrat_interface** | `<chemin>` ou `absent — <motif>` | ce que le produit promet à ses appelants (OpenAPI, schéma, cahier) |

*Pourquoi cette section existe* : treize anomalies clients ont vécu trois semaines dans un board
pendant que six campagnes d'audit tournaient sans savoir qu'elles existaient. Le défaut n'était
pas de ne pas les avoir trouvées — c'était que **leur absence n'ait jamais été un terme déclaré
de la mesure**. Un rapport ne peut pas dire « au vert » sans dire **« au vert CONTRE QUOI »**.

## Reprise

Forge : `<FORGE_ROOT>` (sinon relire `PROMPT-PRODUIT.md`, phase 0). Le ledger
`forge\ledger.jsonl` porte l'état exact ; les étapes closes ne se rejouent pas.

**Le pilot se désigne `<PILOT_ROOT>`, JAMAIS par le nom de son dépôt** (TF-0367, 18/08). Le
renommage du 17/08 a cassé en silence les `CLAUDE.md` qui écrivaient
`<FORGE_ROOT>\digit-ai-forge-pilot\…` : commande introuvable, aucun alias, aucune note — et
deux copies mises de côté (`_old`, `_vide`) portent un oracle **d'apparence valide**, dont
celui de `_old` aurait rendu un verdict plausible sous un jeu de règles périmé. Le nom du dépôt
du pilot n'est donc plus une information qu'un produit doit connaître. Résolution en phase 0,
dans cet ordre :

1. `$PILOT_ROOT` s'il est posé — l'humain a le dernier mot ;
2. sinon, le frère de `<FORGE_ROOT>` qui porte la **signature** du pilot :
   `oracles\oracle-conformite-projet.mjs` **ET** `todo\TODO.jsonl` **ET** `todo\oracle-todo.mjs`
   **ET** `REGLES-PROJET.md` **ET** `CONTRAT-INTERFACE.md`, et qui ne porte **pas** de
   `PERIME.md` à sa racine.

```bash
# sans connaître le nom du dépôt — à jouer depuis la racine du produit
node -e "const{existsSync:e,readdirSync:r}=require('fs'),{join:j}=require('path');
const R=process.env.FORGE_ROOT||'..';const S=['oracles/oracle-conformite-projet.mjs',
'todo/TODO.jsonl','todo/oracle-todo.mjs','REGLES-PROJET.md','CONTRAT-INTERFACE.md'];
const c=r(R,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>j(R,d.name))
.filter(p=>!e(j(p,'PERIME.md'))&&S.every(f=>e(j(p,f))));
if(c.length!==1){console.error('pilot NON RESOLU : '+c.length+' candidat(s) — poser PILOT_ROOT');
process.exit(c.length?2:1)}console.log(c[0])"
```

Deux candidats indiscernables ne se tranchent **jamais en silence** : la commande sort en
échec et demande `PILOT_ROOT`. Référence exécutable et son `non_juge` :
`<PILOT_ROOT>\oracles
esoudre-pilot.mjs [--json]`.
