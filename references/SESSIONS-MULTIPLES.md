# Sessions multiples d'un produit : un registre qui avertit, une coordinatrice qui ne décide rien

Décision humaine D-218 (b) du 14/11/2026, réponse « 218b » du porteur à 18:01, consignée au ledger du produit `forge-digit-ai-fr`
(seq 173). La question posée : « Quelle organisation adopter pour coordonner les sessions multiples d'un même projet, et quel
mécanisme construire ? ». L'option (b) est un registre de revendication et un hook de visibilité qui avertit sans bloquer, avec
une revue le 01/12/2026. L'étude d'origine est `output/03-etudes/Digit-AI - Étude - Coordination des sessions multiples d'un
projet - 20261114c.md` (option O2) ; le mandat de construction, `forge-digit-ai-fr - Brief - Mandat de construction du registre
des sessions D-218b - 20261114n.md`, rangé chez le produit, en corrige quatre points.

Le fait : le 14/11/2026, cinq sessions travaillaient sur le même produit sans se voir, trois écrivaient dans les mêmes fichiers
(ledger, mobilisation, README), et l'indice 20261114g a été porté par deux livrables de radical distinct. Le même jour, D-218 a
été signée du nom de la session qui avait lancé la session du pilot qui la réservait (RP-25 du lot 20261114u du produit).

## Pourquoi ce fichier et pas une règle numérotée

La règle de fond existe déjà : ce qui appartient à une autre session se liste, sans y toucher (`gabarits/AGENT-CAMPAGNE.md`,
section « Rendre la main »), et le porteur décide (R-29, R-58). Ce qui manquait est un mécanisme et sa donnée : un registre, ses
événements, une élection, des hooks. Un mécanisme qui évolue vit dans `references/`, comme `references/GESTES-DISTANTS.md`. Si le
pilot veut une règle R-N opposable, elle citera ce fichier.

## Les règles (a) à (f), avec les corrections du mandat

Les six règles de l'étude restent, corrigées sur quatre points que le mandat a relevés. Chaque règle nomme ce qui l'exécute.

**(a) Visibilité.** Le hook SessionStart inscrit la session (`open` : identifiant, heure, racine, poste, chemin de sa
transcription). Le premier UserPromptSubmit pose son objet, les 200 premiers caractères de la première demande humaine. Un
fichier est revendiqué à sa première écriture par Write, Edit ou MultiEdit (PostToolUse). Correction : l'étude inscrivait tout à
l'ouverture, où aucun message n'existe encore et où la session ignore ce qu'elle écrira. Le porteur lit l'état par
`node <pilot>/scripts/sessions-actives.mjs --produit <dossier>`, et `--json` rend le même contenu en JSON.

**(b) Coordination.** La coordinatrice est la session vivante dont l'`open` est le plus ancien, comparé à la seconde ; à égalité,
l'identifiant le plus petit dans l'ordre lexical. Les quatre cas sont détaillés plus bas. Correction : la clôture se fait sur
SessionEnd. Stop se déclenche à la fin de CHAQUE tour, pas à la fin de la session : il ne fait que rafraîchir la preuve de vie.

**(c) Pouvoirs bornés.** La coordinatrice annonce l'état et peut revendiquer un fichier commun pour une session nommée. Elle ne
fait rien d'autre (section « Les pouvoirs de la coordinatrice »).

**(d) Adaptation au contexte.** Une session seule ne voit rien : aucun hook ne lui affiche quoi que ce soit, et le registre ne lui
coûte que ses propres lignes. Une session qui en trouve d'autres reçoit à chaque tour trois lignes au plus : la coordinatrice, les
sessions vivantes et leur objet, les conflits sur les chemins revendiqués. Avant d'écrire un chemin qu'une autre session vivante
tient, elle reçoit un avertissement qui nomme cette session et son objet. Le porteur prime toujours : une session à qui il parle
exécute sa demande et signale seulement le conflit.

**(e) Fichiers communs.** Correction : rien ne transite par la coordinatrice, qui ne lit les autres sessions qu'à son tour suivant.
Chaque fichier commun garde ou reçoit son propre écrivain sous verrou (section « Les fichiers communs »).

**(f) Applicabilité.** Ce que Claude Code permet, lu dans sa documentation le 15/11/2026 (https://code.claude.com/docs/en/hooks) :
chaque hook reçoit `session_id`, `transcript_path` et `cwd` ; un hook SessionStart reçoit `CLAUDE_ENV_FILE`, un fichier que le
harnais rejoue avant chaque commande Bash de la session ; Stop se déclenche à la fin de chaque tour ; SessionEnd n'a aucun contrôle
de décision et dispose de 1,5 s par défaut. Un hook PreToolUse qui sort en 0 sans décision laisse l'outil s'exécuter, et son
`additionalContext` entre au contexte de la session.

## L'identité de session : une seule source

Correction : l'étude lisait `process.env.CLAUDE_CODE_SESSION_ID`, qu'une session lancée depuis une autre hérite de sa mère.
`sessionCourante()`, dans `oracles/lib-session.mjs`, donne une source unique, dans cet ordre :

1. un identifiant passé par l'appelant (`--session`) : source `argument` ;
2. dans un hook, `session_id` de l'entrée standard : source `hook` ;
3. hors hook, `FORGE_SESSION_ID`, que le hook SessionStart de la session écrit au fichier `CLAUDE_ENV_FILE` : source
   `session_start` ; une session enfant qui joue ce hook pose son identifiant par-dessus celui qu'elle hérite ;
4. à défaut, `CLAUDE_CODE_SESSION_ID` : source `heritee_possible` ;
5. rien : identifiant nul, source `inconnue`.

Dans un hook, seule la source 2 vaut : une variable d'environnement peut venir d'une session mère, et l'inscrire referait le
défaut. Le registre, le ledger, la mobilisation et la réservation des D-N lisent cette source. `forge/ledger.py` écrit sur chaque
entrée nouvelle `session` (8 caractères) et `session_source`. Un sous-agent porte l'identité de sa session, et c'est voulu : il
travaille pour elle. Mesuré le 15/11/2026, le shell d'un agent voit le `CLAUDE_CODE_SESSION_ID` de sa session, et sa transcription
porte le même `sessionId`.

## Le registre `forge/sessions.jsonl`

Le registre est un fichier JSON Lines du produit, ajouté jamais réécrit, écrit dans l'arbre principal du dépôt et lu de tous les
arbres de travail liés. Il ne se commite jamais : c'est un motif exigé du `.gitignore` socle et un journal déclaré à la clé
`journaux_de_hooks` de `gabarits/HERITAGE.json`. Chaque écriture passe par `sousVerrou` (`oracles/lib-decisions.mjs`) : lecture,
décision et ajout dans la même section. C'est l'idée reprise des équipes d'agents, où une tâche se réclame sous verrou. Le
tableau se lit par ligne : l'événement, ce qu'il porte, puis le hook qui l'écrit.

| Événement | Ce qu'il porte | Écrit par |
|---|---|---|
| `open` | session, ts, racine, poste, chemin de la transcription | SessionStart, ou le premier hook qui trouve la session non inscrite |
| `objet` | les 200 premiers caractères de la première demande humaine | le premier UserPromptSubmit |
| `revendique` | un chemin relatif à la racine du produit | PostToolUse, à la première écriture ; `allouer-indice.mjs --reserver` |
| `revendique`, `role: "coordinatrice"` | sans chemin : la session se déclare coordinatrice ; avec un chemin et `pour` : un fichier commun revendiqué pour une session nommée | SessionStart ou UserPromptSubmit de l'élue ; `--revendiquer` |
| `libere` | le chemin rendu | SessionEnd |
| `vie` | une preuve de vie | Stop, au plus une fois toutes les 5 minutes ; SessionStart d'une session déjà inscrite |
| `close` | la raison de la fin | SessionEnd |
| `expire` | `cible`, la session constatée disparue | SessionStart ou UserPromptSubmit de la première session qui le constate |

**La vie.** La preuve de vie d'une session est son dernier événement, ou la date de modification de sa transcription (ou de celle
d'un de ses sous-agents) quand elle est plus récente. Une session est expirée 15 minutes après sa dernière preuve de vie. Un
`expire` vaut tant que la session n'a pas donné de preuve de vie postérieure : une session qui revient redevient vivante.

## L'élection et les quatre cas

Les quatre cas découlent d'une seule règle, la plus ancienne session vivante coordonne, et chaque session la calcule sur le même
registre.

1. Première : la plus ancienne session non expirée, par la date de son `open`. Seule, une session est coordinatrice.
2. Passation : quand la coordinatrice ferme (`close`), la suivante par ancienneté prend le rôle, et l'écrit à son prochain
   SessionStart ou UserPromptSubmit.
3. Disparition : une coordinatrice expirée est déclarée par la première session qui le constate (`expire`), et la suivante prend
   le rôle.
4. Double revendication : la date d'`open` la plus ancienne prime, comparée à la seconde, puis l'identifiant de session dans
   l'ordre lexical. L'élue dont la revendication est recouverte par une autre la réaffirme ; l'autre se range.

## Les pouvoirs de la coordinatrice

Ses pouvoirs sont bornés, et la commande qui les exerce refuse ce qui en sort.

- Elle annonce l'état : chaque session vivante reçoit, à chaque tour, le nom de la coordinatrice.
- Elle peut revendiquer un fichier commun pour une session nommée, par `node forge/hooks/factory.mjs sessions --revendiquer
  <chemin> --pour <session>`. C'est refusé quand la session qui l'appelle n'est pas la coordinatrice élue, quand la session nommée
  n'est pas vivante, ou quand une autre session vivante tient déjà le chemin.
- Elle ne décide rien qui relève du porteur (R-58) : dépense, publication, geste irréversible, doctrine, arbitrage, produit.
- Elle n'arrête ni ne relance aucune session, et elle n'écrit pas dans un chemin revendiqué par une autre session vivante.
- Le porteur prime toujours : une session à qui il parle exécute sa demande et signale seulement le conflit.

## Les hooks

Une seule commande, `node forge/hooks/factory.mjs sessions`, est câblée sur six événements par `gabarits/settings-produit.json`.
Aucun hook ne refuse un geste : jamais de code de sortie 2, c'est l'option (b). Le tableau se lit par événement : ce que le hook
écrit au registre, puis ce qu'il montre à la session.

| Hook | Ce qu'il écrit | Ce qu'il montre |
|---|---|---|
| SessionStart | `open`, ou `vie` pour une session déjà inscrite ; `FORGE_SESSION_ID` au fichier `CLAUDE_ENV_FILE` | rien |
| UserPromptSubmit | `objet` au premier tour ; `expire` et la revendication du rôle quand il y a lieu | 3 lignes au plus, dès qu'une autre session vit |
| PreToolUse (Write, Edit, MultiEdit) | rien | un avertissement si une autre session vivante tient le chemin |
| PostToolUse (Write, Edit, MultiEdit) | `revendique`, si la session ne tient pas déjà le chemin | rien |
| Stop | `vie`, au plus une fois toutes les 5 minutes | rien |
| SessionEnd | `libere` pour chaque chemin tenu, puis `close` | rien |

**Le budget.** Chaque hook rend la main en moins de 300 ms sur un registre de 1 000 lignes. Mesuré au banc de
`oracles/hook-sessions.test.mjs` le 15/11/2026, par le lanceur du produit (deux processus node), en médiane de 5 passages : de
103 ms (PostToolUse) à 201 ms (UserPromptSubmit), 290 ms au pire passage.

**La panne.** Un registre illisible ne bloque jamais une session. La panne se déclare une fois par session, au contexte d'un
événement qui en porte un, jamais en fin de tour, où un contexte relancerait le tour. Une ligne illisible est sautée, et un verrou
de plus de 5 s est repris.

## Les fichiers communs

Chaque fichier commun garde un écrivain sous verrou, et rien ne transite par la coordinatrice. Le tableau se lit par fichier : son
mécanisme, puis ce qu'il ne garantit pas.

| Fichier commun | Mécanisme | Ce qu'il ne garantit pas |
|---|---|---|
| `forge/ledger.jsonl` | il garde son verrou (TF-1575, `<ledger>.lock` exclusif) ; chaque entrée nouvelle porte `session` et `session_source` | `ledger.mjs` de forge-agents n'écrit pas encore ces deux champs |
| `forge/mobilisation.jsonl` | chaque ligne porte la session qui l'écrit, lue par `sessionCourante()` | rien de plus qu'avant : deux sessions écrivent chacune leurs lignes, jugées pour elle seule (TF-2045) |
| indices de livrables | `allouer-indice.mjs --reserver` réserve sous verrou la lettre rendue ; l'appel suivant d'une autre session la saute | deux postes ; une réservation dont la session a expiré |
| numéros D-N | rien ne change, en dehors de l'identité qui signe la réservation | deux postes (D-83 (a)) |
| `forge/gestes-en-cours.jsonl` | inchangé (TF-2084) | voir `references/GESTES-DISTANTS.md` |

## Ce que le mécanisme ne garantit pas

- Un autre poste reste invisible : le registre vit dans le dossier du produit, sur ce poste.
- Seules les écritures par Write, Edit et MultiEdit sont vues, pas une écriture par commande shell (un script, une redirection, un
  `git checkout`).
- Une session tuée sans SessionEnd n'est comptée vivante que jusqu'à son expiration, 15 minutes après sa dernière preuve de vie.
- Une session qui ne laisse aucune trace pendant 15 minutes, le temps d'une seule commande longue, est comptée expirée jusqu'à sa
  preuve de vie suivante.
- Une session enfant dont le projet ne joue pas le hook SessionStart hérite `FORGE_SESSION_ID` de sa mère, et rien ne distingue
  cette valeur de la sienne. Le hook est donc câblé chez les produits et au pilot.
- Un hook joué sous PowerShell n'a pas `CLAUDE_ENV_FILE`, et une commande PowerShell ne reçoit la variable que si le fichier n'est
  fait que d'affectations simples : l'identité retombe alors sur la variable héritée, et sa source le dit.
- Non mesuré de bout en bout : au 15/11/2026, aucun hook n'avait jamais écrit de fichier `CLAUDE_ENV_FILE` sur le poste (365
  dossiers sous `~/.claude/session-env/`, tous vides). Le banc rejoue le fichier par bash comme le harnais le décrit ; la première
  vérification réelle sera l'ouverture d'une session après l'héritage.

## Câblage

Chez un produit, `gabarits/settings-produit.json` câble `forge/hooks/factory.mjs sessions` sur les six événements, exigé par
`gabarits/HERITAGE.json` 1.68.0, et l'ouverture du produit ajoute les entrées manquantes à son `.claude/settings.json` (TF-1755).
Au pilot, `.claude/settings.json` câble `oracles/hook-sessions.mjs` sur SessionStart seulement : le pilot n'a pas de dossier
`forge/`, et le hook n'y pose que l'identité. Sources : `oracles/lib-session.mjs`, `oracles/lib-sessions.mjs`,
`oracles/hook-sessions.mjs`, `scripts/sessions-actives.mjs`, `scripts/allouer-indice.mjs`. Recettes : `oracles/hook-sessions.test.mjs`,
`scripts/sessions-actives.test.mjs`, `scripts/allouer-indice.test.mjs`, `gabarits/ledger.test.mjs`, et les cas 22 et 23 de
`gabarits/hooks-factory.test.mjs`.

## Revue du 01/12/2026

La revue décide du passage, ou non, à l'option (c), le blocage de l'écriture sur un chemin revendiqué. Ses critères viennent de
l'étude :

- le registre a été peuplé par au moins 3 sessions d'un même produit ;
- aucune collision n'a été relevée sur les fichiers communs pendant la période ;
- le porteur lit l'état des sessions en une commande.
