# Run de mandat transverse — quand le livrable est un document, pas un logiciel

Troisième voie d'exécution (avec `ETAPES-RUN.md` et `RUN-VERSION.md`), née du retour RV-1
du run Produit-10 (13/08/2026) : un mandat forge-data (analyse de mapping), forge-audit
(gouvernance), forge-seo-geo (audit post-MEP) ou tout mandat dont le livrable est un
**document ou un verdict** n'a ni conception à 4 verbes, ni design, ni development, ni
MEP — et le run Produit-10 a dû improviser ce que cette page encode désormais.

## Ce que le socle exige quand même (invariant, jamais négocié)

1. **Socle du RUN complet** : `input\`/`output\`/`docs\`/`forge\`, git local dès
   l'ouverture — et TOUT ce que le mandat produit est conforme (nommage R-4 des
   livrables, journaux d'oracles R-32, ledger).
   **Et l'héritage s'installe AVANT la première écriture, existant compris** (TF-0892) :
   `node <pilot>\scripts\recopier-heritage.mjs .` puis `.claude\settings.json` câblant
   `forge\hooks\factory.mjs`. R-35/TF-0266 borne les FAIL portant sur des fichiers
   ANTÉRIEURS ; elle ne dispense JAMAIS d'installer les hooks, qui ne jugent que ce que
   le mandat écrit à partir de maintenant. Mesuré le 07/09 : socle posé sans héritage,
   `.claude\` et `forge\hooks\` absents — **aucun hook n'a tourné de tout le mandat**, et
   le défaut de forme de la restitution n'a été vu que par son destinataire.
   Quand le hook `Stop` manque, le relevé d'ouverture NOMME les familles laissées sans
   protection (`familles_protegees` de `gabarits\HERITAGE.json`, 1.8.0) — au minimum
   **`restitution-forme` : « la restitution ne sera jugée par rien »** —, jamais un
   « écart R-35 » anonyme : un écart déclaré sans sa conséquence ne se décide pas.
   **Sur un projet né sous la doctrine** : `oracle-conformite-projet.mjs` PASS, comme
   les autres. **Qui est « un existant » se MESURE, jamais ne se déclare** (TF-0906) :
   TF-0266 ne couvre qu'un dépôt dont le **premier commit est ANTÉRIEUR au `run_open`**
   du mandat. Un dépôt `git init` par le mandat lui-même n'a rien d'antérieur : tout ce
   qu'il porte a été écrit par ce run, et aucun FAIL n'y est un écart déclarable.
   *Mesuré le 07/09* : un produit créé le jour même a été traité comme un existant —
   six synthèses ont déclaré « socle hors mandat, écarts R-35 », la conformité est
   restée FAIL toute la journée sur six règles, neuf tours ont été rendus sans mécanisme
   de jugement, et six retours humains ont porté sur des règles déjà écrites.
   Le geste : `git log --reverse --format=%aI | head -1` comparé au `run_open` — s'il
   n'y a pas d'antériorité, on installe et on corrige, on ne déclare pas.
   **Sur un existant antérieur à la doctrine (TF-0266, amendé le 15/08)** :
   l'oracle se JOUE quand même (R-35 — son verdict est l'état des lieux, consigné au
   ledger en `oracles_verdict`), mais un FAIL portant sur des fichiers ANTÉRIEURS au
   mandat ne bloque pas le run : les constats partent en **écarts déclarés au ledger**
   (liste, jamais un total anonyme). Le rattrapage du projet entier est une décision du
   propriétaire du projet, pas un préalable du mandat — exiger l'inverse contredisait
   le garde-fou « le pilot n'intervient jamais dans un produit hors d'un run demandé »
   (constaté le 15/08 : 206 constats R-4 sur des fichiers antérieurs, un renommage de
   28 fichiers imposé pour un mandat d'audit SEO).
2. **Ledger dès l'ouverture** : `run_open` avec `versions_forges` (R-19), une entrée
   `invocation` par service de forge mobilisé, `oracles_verdict` pour chaque oracle
   exécuté, `retour` pour chaque friction, `run_close` au bilan.
3. **Fraîcheur** : pull pilot `--ff-only` + `node bootstrap.mjs --pull` avant tout.
4. **Routage et mesure** : CONTRAT-INTERFACE §4/§4 bis, escalades consignées
   (« aucune » compris).

## La séquence (remplace les 5 étapes du run produit)

1. **Ouvrir** — socle + git + **héritage installé et hooks câblés** (invariant 1 :
   `recopier-heritage.mjs` puis `.claude\settings.json`, avant la première écriture,
   existant compris) + oracle de conformité PASS ; le mandat reformulé en une
   phrase au ledger (qui demande quoi, sur quel périmètre, avec quelle preuve attendue).
2. **Cadrer la preuve** — AVANT de produire : quels oracles jugeront le livrable ?
   (forge-data : `oracle-tracer`/`oracle-profiler`/`oracle-restituer` ; forge-audit :
   ses gates ; HTML : `check_html.py` + `render_page.py` — R-32). Domaine sans oracle →
   en définir un (standard `quality-oracles`) puis le remonter au registre. Les
   arbitrages de nommage entrant vs R-4 se tranchent ICI (R-4 alinéa RV-2 : le pilot
   prime, correspondance au ledger).
   **Un mandat qui livre un mapping, un modèle, un DDL ou une reconstruction livre AUSSI
   sa recette EXÉCUTÉE** (TF-0905, règle 40 « un test proposé s'exécute ») : la couverture
   (combien d'objets de la source retrouvés dans la cible, combien d'orphelins nommés) et
   la cohérence (chaque affirmation du livrable confrontée à l'état réel) se MESURENT
   avant la remise, jamais après le retour humain. Un test jouable en LECTURE SEULE se
   joue : `hors_mandat` et `borne_atteinte` ne sont pas des motifs recevables pour lui —
   les seuls motifs qui tiennent sont ceux qui nomment un accès manquant, avec sa trace.
   *Mesuré le 07/09* : trois niveaux de tests proposés, aucun exécuté ; joués après le
   retour, ils ont rendu 38 colonnes et 22 mesures orphelines et une incohérence — que la
   reconstruction aurait perdues.
3. **Produire sous oracles** — le livrable se construit par éditions chirurgicales,
   chaque chiffre tracé à sa source (forge-data : marqueurs `[c:id]`), aucune écriture
   hors du projet (les bases connectées se lisent en LECTURE SEULE — requêtes archivées
   avec leurs résultats sous `forge\etapes\<mandat>\mesures\`).
4. **Juger** — tous les oracles cadrés au pas 2 exécutés, verdicts au ledger ; un FAIL
   se corrige ou se déclare (boucle bornée ≤ 3, G-2 : jamais d'assouplissement).
5. **Clore** — livrable nommé R-4 dans `output\` (journal d'oracles sous
   `forge\oracles\` — R-32 pour le HTML).
   **Toute proposition remise à un humain se remet AUSSI en page HTML autoportante**
   (TF-0895) — socle `digit-ai-page-html`, R-32 — sauf écart déclaré au ledger avec son
   motif. Le Markdown est la source, la page est le livrable : *mesuré le 07/09*, un
   mandat a rendu un rapport, un CSV, deux JSON, trois propositions et deux synthèses
   toutes jugées PASS, et zéro page ; le destinataire a répondu « aucun fichier HTML n'a
   été généré […] il doit faire partie intégrante de la proposition », et la page a dû
   être produite après coup avec trois passes d'oracles.
   **La forme du nom, en clair — elle ne vit plus seulement dans l'oracle** (TF-0898) :
   `<Marque> - <Objet> - AAAAMMJJ<indice>.<ext>`, par exemple
   `Client-A - Rapport de mapping - 20260907b.html`. **Jamais** `20260907-objet.ext` :
   cette forme-là est l'exception ÉCRITE des seules études d'`output\03-etudes` du pilot
   (`gabarits\ETUDE-OPPORTUNITE.md`), et c'est elle qu'un agent a recopiée pour onze
   livrables d'un mandat, faute de la voir démentie ici. L'indice s'alloue par
   `node <pilot>\scripts\allouer-indice.mjs`, jamais à la main. Le contrôle se joue seul,
   sans socle installé et avant la remise :
   `node <pilot>\oracles\oracle-conformite-projet.mjs <projet> --regles R-4`.
   Puis : lot `<projet> - RETOURS - AAAAMMJJ<i>.md` +
   sidecar remis à `<pilot>\input\00-retours\`, `run_close`, synthèse **au format
   `gabarits\RESTITUTION.md`** (8 blocs, horodatée, jugée par `oracle-synthese.mjs`).

## Ce qui ne s'applique PAS (et ne se singe pas)

- Pas d'`EXIGENCES.json` scellé ni de 4 verbes — le mandat cadre, le ledger trace.
- Pas d'étape design ni de tokens. **Mais la page HTML, elle, n'est pas une option**
  (TF-0895, pas 5) : toute proposition remise à un humain en porte une, et le socle
  `digit-ai-page-html` s'y applique alors en entier (charte, G1 clair strict,
  favicon-lettre, E4, standard H). Ce qui reste facultatif est le TRAVAIL de design,
  pas le LIVRABLE.
- Pas de MEP ni de GO production — la remise du livrable EST la fin du run ; le seul
  gate humain est celui que le mandat déclare.
- Pas de boucle de fermeture forge-tests — les oracles du domaine tiennent ce rôle.

Contrat « prêt à remettre » (tous mesurables) : conformité JOUÉE — PASS sur projet né
sous la doctrine, verdict consigné + écarts antérieurs déclarés sur existant (TF-0266) ·
livrables du RUN conformes (R-4, R-32) · oracles du domaine PASS (ou écarts déclarés) ·
traçabilité des chiffres 100 % · **recette exécutée quand le livrable est un mapping, un
modèle, un DDL ou une reconstruction — couverture et cohérence chiffrées (TF-0905)** ·
ledger vérifié · lot de retours remis.
