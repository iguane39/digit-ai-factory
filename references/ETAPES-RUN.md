# Étapes d'un run produit — détail opérationnel

Référence chargée à la demande depuis le noyau `CLAUDE.md` (TF-0053) : le noyau donne la
séquence, ce fichier donne le mode opératoire de chaque étape. À charger à l'ouverture de
l'étape concernée, pas d'un bloc.

## 1. Ouvrir le run

**Avant tout — deux commandes, quelques secondes, et un échec SUSPEND l'ouverture** (R-35,
décidée le 15/08) :

```
node oracles\self-tests.mjs          # les oracles savent-ils encore ECHOUER ? (I1)
node oracles\oracle-boite-entree.mjs # un lot est-il arrivé sans être pris ? (B1-B3)
node oracles\oracle-skills.mjs       # skills, hooks, câblages = versionnés et vivants ? (K1-K8)
```

Verdicts portés au ledger en `oracles_verdict`. La suspension n'est pas un excès de zèle :
des oracles qui ne savent plus refuser ne peuvent rien juger de ce qui suit, et un lot non
pris fausse tout ce qu'on croit savoir du reste-à-faire — on ouvrirait un run en croyant
connaître le travail en attente.

Le premier existe parce que chaque oracle portait sa recette à double sens sans que rien ne
l'appelle : il fallait y penser, oracle par oracle. Dès son premier passage, le 15/08, il a
trouvé que **`oracle-claude-md` — le gardien du plafond du noyau — n'avait aucun self-test**,
donc n'avait jamais été vu refuser quoi que ce soit. Le second existe parce qu'un lot de
5 candidatures est resté dans `input\00-retours\` sans être ingéré, découvert par hasard.

Le troisième existe parce qu'un skill vit en **deux exemplaires** — la source versionnée dans
une forge, et la copie sous `~\.claude\skills\` qui est celle que la session invoque. Mesure du
15/08 : sur 20 skills versionnés, **4 divergeaient et 5 n'étaient pas installés du tout**. Neuf
sur vingt n'étaient donc pas ce que le dépôt croyait livrer, dont `quality-oracles`, cité comme
loi transversale. Une règle corrigée dans un dépôt et absente de la copie installée n'a
strictement aucun effet. `--appliquer` remet à niveau ; il **refuse** d'écraser une copie plus
récente que sa source (K5) — le jour de son écriture, `prompt-analyzer-l99` installé était en
2.2.0 quand le dépôt en était à 2.1.0, et une synchronisation naïve aurait détruit une version.

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

**Gates par défaut (loi n° 6, TF-0237)** — sans décision humaine ajoutée (R-29) :
(a) la DA est **dérivée de l'expérience client visée** (formulée au brief ou reformulée à
l'accueil), et la dérivation est **consignée dans `DESIGN.md`** — chaque choix graphique
structurant motivé par cette expérience, jamais par défaut d'outillage ; (b) **généricité** :
`node <design>\oracles\oracle-taste.mjs <html>` PASS exigé (`cat-des-09`) ; (c) **baseline
visuelle** posée : `node <design>\oracles\oracle-baseline.mjs approuver` (`cat-des-08`).
Écart assumé possible mais explicite, jamais par omission (loi n° 3).

**Valider** : `node <design>\oracles\run-oracles-design.mjs <html> --tokens <tokens.css>
--json-only`, plus les gates (b) et (c) ci-dessus.

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

**5.0 — Smoke de frontière DÉPLOYÉE, avant toute mesure** *(RP-1, lot COMPTA du 14/08 —
obligatoire dès qu'une URL de production ou de staging est déclarée au produit)*.

Constat qui l'impose, et il est net : le run `20260814-tests-fournisseur-a` s'est conclu « boucle close,
pans mesurables au vert » **pendant que le login de production était en impasse totale** —
`GET /` → 303 vers `/.auth/login/aad` → 404. Mort depuis le premier déploiement, vu par aucun
test, découvert par l'humain **en cliquant, minutes après la clôture**. L'oracle MEP (M-1…M-5)
porte ce regard *à la mise en production* ; rien ne le portait en cycle de tests
post-déploiement. Un produit déjà en ligne était donc audité **sans que personne ne regarde ce
que voit son visiteur**.

Quatre contrôles, **sans identité**, joués sur l'instance déployée et consignés au ledger :

1. **santé** — la racine et l'endpoint de santé répondent ;
2. **chaîne d'entrée** — depuis la racine, suivre les redirections et exiger qu'elles
   aboutissent à une **mire identifiable** (200 + marqueur de contenu). Une chaîne qui finit en
   404, en boucle ou sur une trace technique est un défaut **bloquant** : la porte est murée ;
3. **en-têtes de sécurité** — verdict `forge-websec` sur l'origine déployée (R-33) ;
4. **surface d'exposition** — la documentation d'API (`/docs`, `/openapi.json`) est fermée si
   le produit ne l'expose pas volontairement.

Outillage réel, tout en lecture (aucune exécution active — R-33 ne s'applique donc pas) :

```
FORGE_TESTS_QUALIF_URL=<url-deployee>   # pans qualif : 1 et 2, sans identifiants
node scripts\capturer.mjs <url> --sortie <capture.json> --suivre-redirections
node oracles\oracle-exposition.mjs <capture.json>          # 3 (EX-1…EX-11)
```

depuis `<racine>\digit-ai-forge-websec`. La chaîne de redirections se lit **dans la capture**
(`--suivre-redirections`), qui donne aussi le contrôle 4 sur `/docs`. Verdicts au ledger en
`oracles_verdict`, l'URL auditée nommée.

Le smoke ne remplace pas l'audit : il regarde la **frontière**, là où l'audit regarde
l'intérieur. Un produit dont le smoke échoue ne « passe » pas au vert parce que ses pans
internes sont mesurés — le constat de frontière est porté au rapport et au dossier.

`uv run python -m forge_tests <racine-produit> --json` depuis
`<racine>\digit-ai-forge-tests`, stdout capturé et persisté dans
`etapes\tests\rapport-forge-tests.json`. Exit 0 = PASS, 3 = PARTIEL acceptable (consigner les
pans non couverts), 1 = FAIL → boucle de fermeture, 4 = refus G-1 (`--livrables` pointerait
DANS le projet audité — corriger le chemin, jamais contourner). Ajouter `--livrables
<dossier HORS du projet audité>` — par exemple
`<racine>\digit-ai-forge-tests\output\<projet>-livrables\` : cahiers de tests
(fonctionnel, technique) + jeux de données synthétiques + dashboard HTML, **puis copiés
datés dans `output\` du produit** (règle 16), ce qui est un geste explicite et non un
effet de bord de l'audit.

**Corrigé le 15/08 (TF-0271)** : cette ligne prescrivait `etapes\tests\livrables\`, chemin
qui — résolu depuis la racine produit — tombe DANS le projet audité. La garde **G-1** le
refuse (l'auditeur n'écrit pas chez l'audité) et le refuse désormais **bruyamment**
(message terminal + code de sortie 4, distinct des erreurs de génération). La prescription
fabriquait donc le refus à chaque run qui la suivait — deux exécutions perdues le 15/08.

**Boucle de fermeture bornée** : chaque item `actions[]` du rapport porte son `etape_cible` ;
router les `auto_ia` — `development` (code, câblage), `tests-suite` (cas générés À ADOPTER
ET EXÉCUTER — R-40 : trois états seulement, adopté/`non_testable` motivé/écarté par décision
nommée ; exécuté sous les gates de development), `design` (état/écran manquant à la promesse → artefacts design puis delta
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
**La boucle ne se clôt pas sur un solde d'adoption non nul (R-40)** :
`node oracles\oracle-adoption-tests.mjs <racine-produit>` rend PASS (solde nul par les trois
issues — les deux issues non-adoption se déclarent dans `forge\cas-ecartes.jsonl`) ou
SANS_OBJET motivé ; un FAIL est un reste-à-faire de la boucle, jamais un livrable clos.

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
acteur ET par ordre justifié. Contrôle exécuté : `node oracles\oracle-synthese.mjs
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

**Gate généricité rejoué (loi n° 6, TF-0237)** : `oracle-taste.mjs` PASS sur le rendu
implémenté — le rendu se juge en pixels, pas sur la maquette seule ; la baseline
(`oracle-baseline.mjs juger`) détecte toute dérive depuis l'approbation de l'étape 3.

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
