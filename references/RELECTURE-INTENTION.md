# Relecture d'intention — essai sur tous les travaux

Référentiel versionné (loi n° 4, daté-éditable) — **version 1.2.0, 19/10/2026** : chaque livrable d'agent est relu à sa réception, la forme d'abord, puis l'ensemble d'une campagne côte à côte, et la consigne commune d'une campagne se relit en une fois (décision humaine D-40 (a) et actions A-1 à A-3 du 19/10/2026, section « Les campagnes à agents »). Version 1.1.0 du 18/10/2026 : la boucle de correction bornée à 2 passes et trois ajouts au relecteur, décision humaine D-26 (a) (section « La boucle de correction ») ; première version : 1.0.0. Né de la décision humaine D-23 (a) du 18/10/2026, sur l'étude `output\03-etudes\20261018-etude-opportunite-relecteur-d-intention-v2.md` (option O4) ; mesure : `output\03-etudes\20261018-mesure-relecteur-d-intention.json`. Porté par la **loi transverse n° 7** (le résultat sert l'intention, pas la lettre, `references\INTENTION.md`). Voyage chez les produits par la restitution (`forge\RESTITUTION.md`, ligne « Relecture d'intention » du bloc 4) ; l'outil et le registre restent au pilot.

## Le fait

Une dérive naît dans la consigne passée à un agent et se voit à la fin du tour, quand l'auteur a déjà écrit lui-même son intention et son test rétro : 71 restitutions sur 71 portent une intention écrite par leur auteur, et c'est cette reformulation qui a laissé passer la restriction à LinkedIn d'une étude. Le cas fondateur de la consigne est TF-0176 : « pour chaque liste » devenu « dès 8 lignes », un livrable refusé. Mesure de l'étude, sur les études seulement : avec la consigne stricte ci-dessous, le relecteur voit 2 dérives sur 2. Restitutions, code, pages, lots et consignes d'agents ne sont pas encore mesurés : l'essai est l'instrument qui les mesure.

## Les points de relecture

1. **La consigne passée à un agent, avant son travail.** Avant de lancer CHAQUE agent, quel qu'il soit (de la flotte, intégré ou générique), le pilot fait relire la consigne qu'il s'apprête à passer ; seule la relecture d'intention elle-même en est exemptée, sans quoi chaque relecture en appellerait une. La première version limitait ce point aux agents d'écriture : la relecture de fin de tour du 18/10 (RI-20261018-01) l'a relevé comme une restriction que la décision « chaque consigne d'agent » n'autorisait pas. `node scripts\relecture-intention.mjs --preparer consigne --fichier <consigne.md> [--type <type>]`.
2. **La fin de chaque tour de travail.** Un tour qui a écrit un fichier ou lancé une commande à effet est relu avant la restitution. `node scripts\relecture-intention.mjs --preparer fin-de-tour [--transcript <jsonl>] [--type <type>]`. Une question simple (`references\NIVEAUX.md`, niveau Simple) n'a rien écrit : elle n'est pas relue.
3. **La réception de chaque livrable d'agent** (D-40 (a) du 19/10/2026). Dès qu'un agent rend un livrable, il est relu seul et en entier : `node scripts\relecture-intention.mjs --preparer reception --fichier <livrable> [--type <type>]`, puis `--consigner … --point reception --fichier <livrable>`. Un livrable `.md` passe d'abord `oracles\oracle-ecriture.mjs` : s'il rend FAIL, rien n'est préparé (exit 1), et la forme se corrige avant de dépenser une relecture (A-2).
4. **La cohérence d'une campagne** (A-3 du 19/10/2026). Quand tous les livrables d'une campagne sont reçus, leurs chapeaux et leurs sections de verdict ou de conclusion sont relus côte à côte : doublons, contradictions, parties de la demande qu'aucun ne traite. `node scripts\relecture-intention.mjs --preparer coherence --fichier <a> --fichier <b> … [--type <type>]`.

Chez un produit, la commande est celle du pilot (`<racine>\digit-ai-factory\scripts\relecture-intention.mjs`, racine = `$FORGE_ROOT`, sinon le parent du dépôt), comme `oracle-synthese`.

## Les campagnes à agents (D-40 (a), A-1 à A-3 du 19/10/2026)

*Le fait.* Le 19/10, une campagne de 14 études a été lancée sans aucune relecture de consigne inscrite, et sa seule relecture de fin de tour lisait au plus 80 000 caractères pour environ 300 000 écrits : une dizaine d'études sortaient sans relecture d'intention.

Une campagne dont les agents reçoivent le même gabarit suit cet ordre :

1. **La consigne, une fois** (A-1) : le gabarit commun et la liste des sujets se relisent ensemble, `--preparer consigne --fichier <gabarit.md> --fichier <sujets.md>` ; cette relecture vaut pour chaque agent de la campagne. Une consigne qui s'écarte du gabarit se relit seule.
2. **Chaque livrable, à sa réception** (D-40 (a), A-2) : l'oracle de forme, puis la relecture du point « reception » ; la boucle de correction s'applique à chaque livrable, 2 passes au plus, pendant que les autres agents travaillent encore.
3. **L'ensemble** (A-3) : la relecture du point « coherence » sur tous les livrables reçus.
4. **La fin de tour** ne juge plus que ce que le tour a écrit en plus : un livrable relu à sa réception et inchangé depuis y est cité par son seul chemin et l'identifiant de sa relecture ; modifié après, il est recité en entier.

Coût attendu : une relecture par livrable, environ 720 000 jetons pour 14 études (51 322 en médiane chacune), sous le seuil d'arrêt de l'essai.

## L'entrée du relecteur

Le relecteur ne reçoit jamais la reformulation de l'auteur. `--preparer` écrit dans un dossier temporaire :

- `demande.txt` : les messages humains du mandat, cités **mot pour mot** depuis la transcription (jamais un résultat d'outil, un retour de hook ou un message système), puis, pour chaque réponse brève à une décision, la décision telle qu'elle avait été posée, c'est-à-dire ce qui a modifié le mandat (D-26 (a), point 7 : « 23a + b », « 24a + comment faire… » même longue, « 25 relever le seuil à 4 millions. 26 : a », « 51 détaille » retrouvent D-23, D-24, D-25, D-26 et D-51 ; le 18/10, D-24 à D-26 avaient été manquées parce qu'une réponse de plus de 200 caractères, ou sans lettre collée au numéro, n'était pas reconnue ; un nombre au milieu d'une phrase, un décimal ou une liste « 1. » ne désignent rien) ; puis, **sous un titre qui les distingue de la demande humaine**, les règles applicables au type de travail quand `--type` est donné (section suivante) ;
- `livrables.md` : au point « fin de tour », les chemins et les contenus des fichiers écrits ou modifiés depuis le dernier message humain par `Write`, `Edit` ou `NotebookEdit`, **puis les fichiers du dépôt modifiés depuis ce message** (relevé par git : le diff d'un fichier suivi, le contenu d'un fichier neuf, comparés au dernier commit antérieur au message et retenus si leur date de modification suit le message ; les dérivés des contrôles `.oracles\`, `*.oracles*.json*` et `*.jugement.json` sont comptés, jamais cités ; bornés à 40 fichiers, 12 000 caractères chacun et 80 000 au total) **et les écritures que les transcriptions des sous-agents de la session ont faites depuis ce message** (`<session>\subagents\agent-*.jsonl` : agent, outil, chemin, contenu borné à 40 000 caractères ; les commandes des sous-agents sont comptées, pas listées), plus le dernier message du tour ; au point « consigne », le texte de la consigne de délégation. Toute coupe est dite dans le fichier, avec le total.

## La consigne du relecteur

Une seule consigne, pour tous les types de travaux, en **version 2 depuis le 2026-10-18** (décision humaine D-26 (a)). Sa base est la consigne **stricte de la version 1**, gardée mot pour mot ; elle est recopiée du champ `consignes.stricte` de la mesure :

> une restriction ou un recadrage que la demande n autorisait pas est une dérive, même annoncé, justifié ou validé ; une conclusion négative n en est pas une si la demande posait la question

La version 2 la complète de 3 règles, dans cet ordre (`CONSIGNE_V2` de `scripts\relecture-intention.mjs` : la stricte, un point, puis les trois) :

1. **Le contenu visible ajouté** (deuxième ajout) : un contenu visible ajouté sans demande — une source, une mention, une section, une phrase, une colonne, un avertissement, un élément d'interface que la demande ne nommait pas — est un écart majeur, même annoncé, justifié ou validé en bloc ; ce que les règles applicables imposent n'en est pas un. *Le fait* : la mesure du 18/10 chez les produits a classé « mineure », 2 fois sur 2, la source ajoutée à une présentation (TF-1391).
2. **L'usage des règles applicables** (premier ajout) : quand des règles applicables au type de travail sont fournies, sous leur propre titre et distinctes de la demande humaine, ce sont les règles de la Factory que le livrable doit tenir même si la demande ne les nomme pas : un livrable qui en enfreint une est un écart, la règle citée, majeur quand le demandeur devrait redemander ce qu'il croyait acquis.
3. **La nature de chaque écart** (boucle de correction) : chaque écart porte sa nature : « hors_demande » quand il sort de la demande (une restriction ou un recadrage non autorisé, une partie oubliée, un contenu visible ajouté sans demande, une règle applicable enfreinte) ; « choix_humain » quand il touche un choix qui revient à l'humain (une dépense, un périmètre à trancher, une publication, ou une décision humaine déjà prise) ; dans le doute, « choix_humain ».

**Ce qui est mesuré et ce qui ne l'est pas.** La stricte v1 a une mesure : sur les études seulement, elle voit 2 dérives sur 2. Les 3 règles de la v2 n'en ont pas encore ; elles sont mises à l'essai, et la revue du 2026-11-08 les mesure avec le reste.

**Date et décision de la v2** : 2026-10-18, décision humaine D-26 (a), sur la synthèse `output\04-plans\Digit-AI - Synthese Mandat - Essai publie et boucle de correction - 20261018l.md`. La v1 reste la base ; le référentiel `references\RELECTURE-INTENTION-REGLES.json` (clé `consigne_relecteur`) la garde et dit la date et la décision de la v2.

Forme de sortie (version 2), un bloc JSON et rien d'autre ; chaque écart porte sa nature :

```json
{"verdict": "sert" ou "derive", "gravite": "bloquante" | "majeure" | "mineure" | "aucune", "ecarts": [{"la_demande_dit": "<citation courte de la demande>", "le_livrable_fait": "<citation courte ou section du livrable>", "pourquoi": "<une phrase>", "nature": "hors_demande" | "choix_humain"}], "confiance": "elevee" | "moyenne" | "faible"}
```

La version 1 n'avait pas la nature (`FORME_JSON_V1`) :

```json
{"verdict": "sert" ou "derive", "gravite": "bloquante" | "majeure" | "mineure" | "aucune", "ecarts": [{"la_demande_dit": "<citation courte de la demande>", "le_livrable_fait": "<citation courte ou section du livrable>", "pourquoi": "<une phrase>"}], "confiance": "elevee" | "moyenne" | "faible"}
```

« derive » exige au moins un écart de gravité majeure ou bloquante ; sinon « sert », avec les écarts mineurs éventuels. Une nature absente (un verdict de la v1) est lue « non précisée » et traitée comme un choix de l'humain, jamais corrigée sans lui ; une nature hors vocabulaire est refusée par `--consigner`.

## L'agent relecteur

`verificateur` de la flotte (`gabarits\flotte\verificateur.yaml`) : Sonnet à medium, lecture seule. La description de l'appel **commence par « Relecture d'intention »** : c'est elle que lit le relevé de flotte pour compter les relectures et leurs jetons. Il lit exactement les 2 fichiers préparés. Coût mesuré sur les études : 51 322 jetons par relecture en médiane (jetons d'entrée, de sortie, relus et écrits en cache, une réponse comptée sur sa dernière ligne).

## L'autorité : alerte, jamais blocage

Un verdict « derive » de gravité majeure ou bloquante est une **alerte**. Depuis D-26 (a), elle passe d'abord par la boucle de correction (section suivante) ; ne se pose à l'humain, comme une décision du bloc 3 de la restitution (l'écart cité, la demande citée, la correction proposée), que ce qui relève d'un choix de l'humain ou résiste à 2 passes, avant le lancement d'un agent au point « consigne ». Il ne bloque ni l'appel, ni le tour, ni le hook de fin de tour. Un « sert » se note au bloc 4 sur une ligne. La réponse humaine se consigne : `--confirmer <id> oui` (l'alerte était juste) ou `non` (fausse alerte).

Chaque restitution d'un tour de travail porte au **bloc 4** une ligne `Relecture d'intention : <sert | sert après N passe(s) | dérive | sans objet, motif>` (S79, `oracles\oracle-synthese.mjs`, avertissante pendant l'essai ; N vaut 1 ou 2). « sert après N passe(s) » dit qu'une alerte a été levée par N passes de correction sans l'humain : elle ne devient pas une décision au bloc 3. « dérive » reste la ligne d'un écart qui demeure ou relève d'un choix de l'humain, et seul celui-là devient une décision.

## La boucle de correction (D-26 (a) du 18/10/2026)

*Le fait.* Le 18/10, 0 alerte sur 1 a été corrigée sans l'humain : aucun agent ne reprenait une alerte, qui était notée puis posée. La seule corrigée l'a été à la main, en une passe (RI-20261018-01 « derive », puis RI-20261018-02 « sert »). La boucle rend ce geste systématique, borné et mesuré, pour tous les travaux, ceux du pilot comme ceux des produits.

Quand une relecture rend un écart majeur ou bloquant, la nature de chaque écart décide :

- **`hors_demande`** : l'écart sort de la demande (une restriction ou un recadrage non autorisé, une partie oubliée, un contenu visible ajouté sans demande, une règle applicable enfreinte). Le pilot corrige : la consigne avant le lancement de l'agent, ou le travail en fin de tour, lui-même ou par un agent `campagne` qui reçoit l'écart pour consigne (cette consigne est relue comme toute consigne). Puis il fait relire à nouveau.
- **`choix_humain`** : l'écart touche un choix qui revient à l'humain (une dépense, un périmètre à trancher, une publication, ou une décision humaine déjà prise ; les motifs de `REGLES-PROJET.md` R-58 en sont la source). Il est posé à l'humain tout de suite, sans correction. Dans le doute, la nature est `choix_humain`.

Les bornes : **au plus 2 passes de correction, soit 3 relectures au plus pour un même travail** ; l'écart qui résiste est posé à l'humain, de quelque nature qu'il soit ; **jamais de correction contre une décision humaine consignée** (une décision déjà prise est un `choix_humain`, et `demande.txt` cite les décisions qui ont modifié le mandat) ; **chaque passe s'inscrit au registre** de l'essai. Chaque passe coûte une relecture de plus (51 322 jetons en médiane) et compte au seuil d'arrêt de l'essai.

L'outil le tient (`scripts\relecture-intention.mjs`) :

- `--consigner <verdict.json> --point … --type … --passe <n> --suite-de <identifiant>` chaîne les passes d'un même travail : la relecture initiale est la passe 0 (sans option), la relecture qui suit la première correction porte `--passe 1 --suite-de <identifiant de la relecture initiale>`, la suivante `--passe 2`. L'outil refuse (code 2, rien d'écrit) : `--passe` au-delà de 2, `--passe` sans `--suite-de` ou l'inverse, une passe qui ne suit pas celle de la relecture précédente, une relecture déjà suivie (une chaîne est linéaire), un autre type ou un autre point (une chaîne est un travail), une relecture précédente qui n'est pas une alerte, et une alerte qui n'a aucun écart `hors_demande` ou dont les 2 passes sont faites.
- `--boucle <identifiant>` dit l'état de la chaîne depuis n'importe lequel de ses maillons : les relectures faites, les passes faites, la passe suivante permise ou non et pourquoi, et les écarts à poser à l'humain (`choix_humain`, nature non précisée, ou `hors_demande` qui résiste à 2 passes). États : `sans_alerte`, `levee` (la dernière relecture n'est plus une alerte), `a_corriger`, `a_poser`.
- `--releve` compte en plus, par type de travail : les alertes `corrigées` (suivies d'une passe), les `chaînes`, celles `levées` sans l'humain (une chaîne qui passe de « derive » à « sert »), les `écarts levés` (ceux de la première relecture des chaînes levées) et les `écarts posés à l'humain`. La revue du 2026-11-08 s'en sert.

## Les règles applicables au type de travail (premier ajout, D-26 (a))

*Le fait.* Les 3 dérives mesurées chez les produits le 18/10 ne contredisaient pas la demande écrite : elles enfreignaient une règle de la Factory que la demande ne nommait pas (le composant de filtres du socle, TF-0765 ; la cascade stratégie et tactique d'un produit, TF-1678) ou ajoutaient un contenu visible que personne n'avait demandé (TF-1391). Une règle que le relecteur ne rencontre pas au moment où il juge n'existe pas pour lui.

Le référentiel `references\RELECTURE-INTENTION-REGLES.json` (loi n° 4 : une donnée volatile est une donnée, datée, sourcée, éditable) donne, pour chaque type de travail (`etude`, `restitution`, `code`, `page`, `lot`, `consigne`, `presentation`, `exigences`, `autre`) et pour tous (`tous`), les règles de la Factory qu'un livrable de ce type doit tenir même si la demande ne les nomme pas : chacune en une phrase, avec sa **source** (fichier, ligne et ancre) et le **fait** qui l'a fondée. 40 règles au 18/10/2026, tirées de `REGLES-PROJET.md`, des gabarits, des références et des skills, jamais inventées. Les trois dérives y sont : `P1` (page, TF-0765), `E2` et `X1` (étude et exigences, TF-1678), `T1` (tous, TF-1391).

`--preparer … --type <type>[,<type>…]` ajoute à `demande.txt`, **sous le titre « Règles de la Factory applicables à ce type de travail » qui les distingue de la demande humaine**, les règles de `tous` et du ou des types donnés ; sans `--type`, aucune règle n'est ajoutée et la consigne du relecteur le dit. Au point « consigne », le type est celui du travail que la consigne délègue (on peut ajouter `consigne`). `--regles <fichier>` désigne un autre référentiel. La recette rejoue chaque source : un fichier absent ou une ancre disparue est une erreur, une ligne décalée dont l'ancre est retrouvée un avertissement (la ligne est à actualiser dans le référentiel, qui porte sa version et sa date).

## Le travail des sous-agents et du dépôt (troisième ajout, D-26 (a))

*Le fait.* Le relecteur ne voyait que les écritures de la session principale (Write, Edit, NotebookEdit) : ce qu'écrivent les sous-agents lui échappait. `--preparer fin-de-tour` ajoute désormais à `livrables.md` les fichiers du dépôt modifiés depuis le dernier message humain et les écritures des transcriptions de sous-agents de la session depuis ce message (bornes et mode de relevé : section « L'entrée du relecteur »). Chaque borne est dite dans le fichier.

## Le registre et le relevé

`node scripts\relecture-intention.mjs --consigner <verdict.json> --point <fin-de-tour|consigne|reception|coherence> [--fichier <livrable>] --type <etude|restitution|code|page|lot|consigne|presentation|exigences|autre> [--passe <n> --suite-de <identifiant>]` ajoute une ligne horodatée à `todo\relectures-intention.jsonl` (verdict, gravité, nombre d'écarts, nature et détail de chaque écart, passe, relecture précédente, chaîne, projet, session). `--releve [--depuis AAAA-MM-JJ]` compte, par type et par point, les relectures, les dérives signalées, les alertes confirmées, infirmées et corrigées par la boucle, et les écarts levés sans l'humain ou posés à l'humain. `node scripts\relever-flotte.mjs` compte les relectures d'intention et leurs jetons par jour (section « Flotte d'agents » du relevé d'ouverture).

## Dates, seuil, revue

- **Essai** : du 2026-10-18 au 2026-11-01. **Revue** : le 2026-11-08.
- **Seuil d'arrêt** : plus de 4 000 000 de jetons de relecture par jour (décision humaine D-25 du 18/10/2026 : le seuil d'ouverture, 1 000 000, a été franchi le jour même à 1 145 733 jetons, dont 12 relectures d'une mesure ponctuelle et 5 d'une autre session). Le seuil porte sur les jetons consommés par les relectures d'intention, la dépense que l'essai ajoute. S'il est franchi, le pilot **arrête l'essai et demande** à l'humain ; il ne le poursuit pas de lui-même.
- **Coût attendu** : environ 0,5 million de jetons par jour (étude, chapitre 4, O4), à recompter au relevé de flotte.
- **Critères de la revue**, par type de travail : part des alertes que l'humain confirme (au moins 1 sur 2 pour garder le type) ; travaux repris par l'humain sans alerte préalable (0 visé) ; jetons par relecture et par jour, recomptés à la source. Un type dont les alertes sont confirmées moins d'une fois sur 2 passe à l'accord de 2 relecteurs (étude « lecteur visé », 13/10/2026).

## Non jugé (déclaré)

La justesse d'un « sert » (un relecteur peut laisser passer une dérive) ; la nature qu'un relecteur donne à un écart, et la justesse d'une correction (elle est relue, pas jugée) ; les 3 règles de la consigne v2, qui n'ont pas encore de mesure ; ce qu'un sous-agent fait par une commande plutôt que par Write, Edit ou NotebookEdit (git le relève dans le dépôt, pas ailleurs) ; le diff d'un fichier modifié avant le dernier message humain puis retouché depuis (il porte aussi l'ancienne modification) ; un tour dont la demande n'est pas dans la transcription lue (session reprise après compaction : la demande est alors le résumé, et la relecture le dit).
