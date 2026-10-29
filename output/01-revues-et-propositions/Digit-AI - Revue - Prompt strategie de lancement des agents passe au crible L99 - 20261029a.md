# Revue L99 du prompt « nouvelle stratégie de lancement des agents »

Analyse faite le 29/10/2026 à 17:35, heure de Paris, sur le pilot `digit-ai-factory`, par la session pilote (Claude Opus 5.5), niveau L99, 8 couches.

Prompt analysé, cité mot pour mot :

> Suite A1, construis une nouvelle stratégie de lancement des agents et de leurs nombres pour optimiser les traitements

Contexte nécessaire pour le lire. « A1 » renvoie à l'action **A-1** *(première prochaine action de la réponse précédente, même session, 17:31)* : « former les groupes d'une campagne selon les fichiers touchés, un agent isolé par groupe ». Cette réponse portait aussi **A-2** : « aucune attente au premier plan pendant que des agents tournent ». Les deux venaient d'un constat mesuré sur la session des candidats du jour : 38 candidats, 6 lots par dépôt de 11, 5, 3, 2, 7 et 10 candidats, et deux attentes de 590 secondes au premier plan.

---

## Chapitre 1 — OODA : cadrage et étalon noté

Le prompt porte une intention juste et un contexte riche, mais il ne dit ni ce qu'il faut optimiser, ni ce qui sera livré, ni comment on saura que c'est mieux. Il obtient 27 sur 100.

**Observe.** Trois éléments explicites : un point de départ (« Suite A1 »), un objet (« stratégie de lancement des agents et de leurs nombres »), un but (« optimiser les traitements »). Aucun format de livrable, aucune mesure, aucune borne.

**Orient.** L'auteur est le porteur de la Factory. Il vient de lire que la session des candidats a lancé 6 agents pour 38 candidats, et que le plus gros lot fixait la durée. Son intention profonde : que les campagnes à agents finissent plus vite, sans payer plus cher ni se casser en conflits. Le destinataire est une session pilote, qui connaît la flotte nommée (`campagne`, `constructeur`, `verificateur`…) et le contrat `gabarits/AGENT-CAMPAGNE.md`.

**Decide.** Trois stratégies possibles :

1. Écrire une règle de découpage dans le contrat de campagne, sans outil. Rapide, mais une règle non câblée n'existe pas (loi n° 1 du pilot).
2. Construire un planificateur qui calcule les groupes et le nombre d'agents à partir des fichiers touchés, plus la règle qui l'impose, plus une mesure avant et après.
3. Lancer d'office une campagne à 38 agents pour mesurer. Coûteux, et contraire au constat déjà fait sur les conflits.

**Act.** La stratégie 2. Elle tient l'intention, se vérifie par une mesure, et se rejoue à chaque campagne.

**Étalon.** Le prompt idéal pour cette intention :

- nomme la grandeur à optimiser et ses contraintes : durée de bout en bout d'une campagne, sans conflit de fusion, sans hausse de jetons au-delà d'une borne dite ;
- part d'une mesure de référence, la campagne du 29/10, relevée par `scripts/relever-flotte.mjs` ;
- dit ce qui est livré : la règle, l'outil qui l'applique, sa recette, le registre mis à jour ;
- traite le nombre d'agents comme un résultat calculé, pas comme un chiffre choisi ;
- couvre l'attente des rapports (A-2), sans laquelle plus d'agents ne raccourcit rien ;
- dit ce qui reste à l'humain : seulement ce qui change la doctrine en blocage.

Comment lire le tableau suivant : une ligne par dimension de la rubrique, la note obtenue et sa raison ; le total est le score de départ du chapitre 8.

| Dimension | Points | Note | Raison |
|---|---|---|---|
| Clarté de l'intention | 20 | 8 | « optimiser les traitements » ne dit pas quoi : durée, jetons ou qualité |
| Spécification | 20 | 3 | ni livrable, ni format, ni périmètre de campagnes visées |
| Garde-fous et contraintes | 15 | 2 | rien sur les conflits, le coût, la session en cours |
| Ancrage et contexte | 15 | 9 | « Suite A1 » renvoie à un constat mesuré dans la même session |
| Vérifiabilité de la sortie | 15 | 2 | aucun critère qui dise que la nouvelle stratégie est meilleure |
| Robustesse | 15 | 3 | « leurs nombres » invite à fixer un chiffre plutôt qu'une règle |
| **Total** | 100 | **27** | sous le plafond de 40 qu'impose le défaut bloquant n° 1 |

---

## Chapitre 2 — Chainlogic : la chaîne implicite

Le prompt est court, mais il suppose une chaîne : plus d'agents donnent plus de parallélisme, donc des traitements plus rapides. Deux maillons sont faux tels quels.

- **Si** on lance plus d'agents **alors** le travail avance en parallèle : vrai seulement si les agents ne touchent pas les mêmes fichiers. Les 11 candidats de forge-agents visaient presque tous le socle HTML.
- **Si** le travail avance en parallèle **alors** la campagne finit plus tôt : vrai seulement si la session pilote traite chaque rapport à son arrivée. Avec des attentes de 590 secondes au premier plan, un rapport arrivé à la 1re minute attend 9 minutes.
- **Donc** « optimiser les traitements » demande trois leviers à la fois : le découpage, l'isolation, la réception des rapports. Le prompt n'en nomme qu'un, le nombre.

---

## Chapitre 3 — Blindspots : inventaire maître

Ce chapitre est la liste de référence des défauts ; chaque défaut bloquant ou majeur est fermé au chapitre 8.

Comment lire le tableau : une ligne par défaut, classée par sévérité puis par ordre d'apparition ; la colonne « Fermé par » renvoie à la partie du prompt réécrit qui le corrige.

| N° | Défaut | Sévérité | Fermé par |
|---|---|---|---|
| 1 | Aucun critère de réussite : rien ne dira si la nouvelle stratégie est meilleure que l'ancienne | bloquant | Étape 0 et contrat de sortie |
| 2 | « optimiser » sans grandeur : durée, jetons et qualité tirent dans des sens opposés | majeur | Étape 1, objectif et contraintes |
| 3 | Livrable non défini : une note, une règle, un script ou les trois | majeur | Étape 4 |
| 4 | « leurs nombres » pousse à fixer un chiffre ; le bon nombre dépend de chaque campagne | majeur | Étape 2, nombre calculé |
| 5 | A-2, l'attente des rapports, absente ; sans elle le gain du parallélisme se perd | majeur | Étape 3 |
| 6 | Conflits d'écriture non traités : même dépôt sans copie isolée, registre `todo/TODO.jsonl` à écrivains uniques | majeur | Étape 2, isolation, et garde-fous |
| 7 | Coûts fixes par agent ignorés : lecture du contrat, relecture d'intention de chaque consigne (**D-23** *(décision du 18/10/2026 : toute consigne d'agent relue avant lancement)*) | majeur | Étape 2, borne de coût |
| 8 | Plafond d'agents non cité : `references/PARALLELISME-CLAUDE-CODE.md` fixe 20 sous-agents simultanés par session et 16 agents pour un workflow (relevé du 2026-10-19) ; la réponse de 17:31 disait à tort n'en avoir trouvé aucun, et l'outil Workflow exige l'accord explicite de l'humain | majeur | Étape 0, plafond lu dans ce fichier |
| 9 | Session des candidats encore en cours : la changer en vol couperait ses agents | majeur | garde-fous |
| 10 | Rapport à la doctrine non dit : changer le contrat de campagne est-il une décision humaine ? | majeur | Étape 4, avertissement d'abord |
| 11 | Routage par modèle (**§4** *(section 4 de `CONTRAT-INTERFACE.md` : quel modèle pour quel rôle)*) non relié au découpage | mineur | Étape 2 |
| 12 | Aucune durée de mesure après mise en service | mineur | Étape 5 |

---

## Chapitre 4 — Factcheck : les prémisses

Le prompt ne contient qu'une prémisse vérifiable, la référence « A1 », et elle tient.

- « A1 » existe : la réponse de 17:31 de cette session porte A-1, identifiant `neuve`, acteur `auto_ia`. **Vrai.**
- Prémisse implicite « plus d'agents, c'est plus rapide » : **faux tel quel**, remontée au chapitre 3 (défauts n° 5 et n° 6).
- Prémisse d'accès : le prompt ne désigne aucune ressource distante ; les fichiers du pilot sont lus localement. Aucune étape 0 d'accès n'est due.

---

## Chapitre 5 — Premortem : cinq façons d'échouer

Imaginons la stratégie livrée et jugée décevante un mois plus tard. Voici les causes les plus probables, de la plus à la moins probable.

1. **Une règle sans outil.** La session écrit un paragraphe dans `AGENT-CAMPAGNE.md` ; la campagne suivante découpe encore à la main, par dépôt. Mécanisme : une règle de jugement s'oublie sous charge. Parade : un script qui calcule le découpage, appelé par la règle.
2. **Un nombre gravé.** La stratégie dit « 12 agents » ou « un agent par candidat ». Mécanisme : le chiffre vaut pour la campagne du 29/10, pas pour une campagne de 5 sujets. Parade : le nombre est la sortie d'un calcul, sous un plafond déclaré dans un référentiel daté.
3. **Des conflits de fusion.** Plus d'agents dans le même dépôt, sans copie isolée. Mécanisme : index git partagé, fichiers communs. Parade : une copie isolée (worktree) par agent dès que deux agents visent le même dépôt, et des groupes formés sur les fichiers.
4. **Pas de mesure, donc pas de preuve.** Mécanisme : sans référence relevée avant, aucun « mieux » n'est démontrable, et l'item du registre ne peut pas se clore sur gains constatés. Parade : relever la campagne du 29/10 avant de changer quoi que ce soit.
5. **Le gain mangé par l'attente.** Mécanisme : la session pilote dort 10 minutes au premier plan pendant que les rapports s'accumulent. Parade : A-2 dans la même stratégie, avec une réception rapport par rapport.

Les causes 1, 2 et 4 escaladent les défauts n° 3, 4 et 1 ; la cause 5 escalade le n° 5.

---

## Chapitre 6 — Wargame : trois attaques

L'étalon résiste aux trois rôles, mais le contradicteur montre où un exécutant pourrait tenir la lettre sans servir l'intention.

**L'utilisateur exigeant.** Il veut savoir combien de temps il gagne. La stratégie doit donc rendre un chiffre : durée de la campagne de référence, durée simulée ou mesurée avec le nouveau découpage. Une stratégie sans ce chiffre ne sert pas sa demande.

**L'expert du domaine.** Il relève trois points. Le découpage par fichiers suppose de connaître les fichiers touchés avant le travail : il faut une estimation, tirée des chemins cités par chaque candidat, et un groupe à part pour ceux qui n'en citent aucun. La durée d'une campagne est celle de son plus long agent : équilibrer la charge compte autant que le nombre. Enfin, chaque agent paie un coût fixe ; un candidat d'une ligne ne justifie pas un agent à lui seul.

**Le contradicteur.** Trois conformités paresseuses possibles : une étude de dix pages sans aucun changement en service ; un script qui découpe par dépôt comme avant, mais avec un nom neuf ; un plafond fixé si haut qu'il ne borne rien. Chacune se ferme par le contrat de sortie : un outil exécuté sur la campagne du 29/10, un résultat comparé, un plafond sourcé.

**Lentille robustesse.** La stratégie deviendra une instruction d'agent réutilisée à chaque campagne. Deux risques. Elle entre en collision avec la relecture d'intention par agent (D-23) et la relecture commune de campagne (**D-47** *(décision du 19/10/2026 : une campagne se relit en trois temps, consigne commune une fois)*) : la stratégie doit dire quelle relecture s'applique à un lot de N agents. Elle suppose aussi une capacité du harnais, le nombre d'agents simultanés, que personne n'a mesurée.

---

## Chapitre 7 — Deepthink : effets à l'échelle

La stratégie s'appliquera à toutes les campagnes du pilot et, par l'héritage, chez les produits. Trois effets de second ordre.

- **Le coût de relecture monte avec N.** Une relecture d'intention par agent, à N = 15, coûte 15 relectures. Le seuil de l'essai est de 4 000 000 jetons par jour (relevé d'ouverture du 29/10/2026). Un découpage plus fin peut le franchir.
- **La fusion devient le goulot.** Quinze copies isolées produisent quinze branches à réunir par la session pilote. Le temps gagné en parallèle peut se perdre en réunion séquentielle si les groupes ne sont pas vraiment disjoints.
- **Un bon outil se propage.** Un planificateur fiable servira aussi aux produits et à l'œil critique. C'est un argument pour le placer chez forge-agents, qui outille les agents, plutôt qu'au pilot seul.

---

## Chapitre 8 — Synthèse et prompt réécrit

Le prompt passe de 27 à 78 sur 100, score mesuré par des relecteurs indépendants en 5 passes. La boucle s'arrête parce que la passe 5 ne gagne plus que 2 points, sous le seuil de 3. Trois défauts majeurs restent ouverts ; ils sont nommés plus bas, et le prompt n'est pas présenté comme fini.

### Pourquoi la boucle a été ouverte, puis prolongée

Mode boucle ouvert d'office (**TF-2022** *(règle du skill 2.7.0 du 29/10/2026 : la session ouvre la relecture indépendante sans mot-clé dans trois cas)*) : le prompt lance une campagne d'agents qui écrivent, et l'analyse avait relevé un défaut bloquant. Le score de 84 d'abord écrit ici était projeté ; mesuré, il valait 40.

Boucle prolongée de 3 à 5 passes après la passe 3, à la demande humaine du 29/10/2026 (« essaie encore 2 boucles pour voir si ça améliore les résultats »), puis sous la règle **TF-2024** *(skill 2.8.0 : extension jusqu'à 5 passes quand la dernière gagne encore au moins 3 points avec des défauts graves ouverts)*. La passe 3 gagnait 3 points et gardait 4 majeurs : l'extension est déclarée au journal avec son motif.

### Score

Comment lire le tableau : une ligne par passe ; le score retenu est la plus basse des deux notes des relecteurs, et seul un défaut vu par les deux est retenu, après vérification dans les fichiers.

| Passe | Mots | Notes des 2 relecteurs | Score retenu | Gain | Bloquants et majeurs retenus | Décision |
|---|---|---|---|---|---|---|
| 1 | 681 | 60 et 40 | 40 | — | 1 bloquant, 4 majeurs | continuer |
| 2 | 929 | 69 et 70 | 69 | +29 | 6 majeurs | continuer |
| 3 | 1 214 | 72 et 74 | 72 | +3 | 4 majeurs | continuer, extension à 5 |
| 4 | 1 407 | 76 et 79 | 76 | +4 | 3 majeurs | continuer |
| 5 | 1 537 | 81 et 78 | **78 (mesuré)** | +2 | 3 majeurs | arrêter : gain inférieur à 3 |

Le score de départ, 27, est celui de l'étalon du chapitre 1, noté par l'auteur de la revue. Le journal des passes est à côté de cette revue, en `.boucle.json`, et l'oracle `oracle-boucle-l99.mjs` le juge PASS.

Ce que les passes 4 et 5 ont rapporté : 6 points en deux passes, contre 32 pour les passes 2 et 3. Chaque passe coûte environ 200 000 jetons, soit 2 relecteurs. Le gain ralentit nettement après la passe 3, et le prompt grossit de 27 % entre la passe 3 et la passe 5.

### Diagnostic

Intention juste, née d'un constat mesuré. Le prompt d'origine ne disait ni quoi optimiser, ni quoi livrer, ni comment prouver le gain, et réduisait trois leviers (découpage, isolation, réception) au seul nombre d'agents. La relecture indépendante a trouvé ce que l'auteur ne voyait pas : un script de mesure qui ne mesure pas les durées, et un plafond d'agents déjà consigné au pilot.

### Majeurs ouverts à l'arrêt

Ces trois défauts, vus par les deux relecteurs de la passe 5, restent dans le prompt livré. Celui qui l'exécute doit les trancher en premier :

1. **Règle « b inférieur à a » incohérente** : b est un coefficient unique de la régression, la condition vaut donc pour les 38 sujets ou pour aucun. Correction proposée : la remplacer par un critère global, un agent de plus tant que le gain estimé sur le plus long groupe dépasse a, ou la supprimer et laisser la borne de jetons limiter le fractionnement.
2. **Réception non modélisée** : l'objectif compte jusqu'au traitement du dernier rapport, en série, alors que le modèle ne minimise que le plus long agent. Correction proposée : mesurer à l'étape 0 la durée de traitement d'un rapport et minimiser la durée du plus long agent plus N fois cette durée.
3. **Relecture mal comptée** : **D-47 (a)** *(décision du 19/10/2026 : une campagne se relit en trois temps, consigne commune, chaque livrable à sa réception, puis cohérence)* impose une relecture par livrable, son coût croît avec N. Correction proposée : budget de relecture = consigne + N × réception + cohérence, et ces deux relectures ajoutées à l'étape 3.

Deux constats, vus chacun par un seul relecteur mais revenus à plusieurs passes, méritent d'être lus. L'isolation `worktree` de l'outil Agent ne copie que le dépôt de la session : le 29/10, aucun lot de forge n'en portait. Et la régression sur 6 lots qui mêlent agents `campagne` et `constructeur` peut rendre une pente nulle ou négative, cas que le prompt ne traite pas.

### Prompt réécrit (passe 5, score mesuré 78)

```text
Construis une nouvelle stratégie de lancement des agents d'une campagne, qui calcule leur nombre
au lieu de le fixer, pour réduire la durée des campagnes. Elle reprend deux actions proposées le
29/10/2026 dans la session pilote 2071e2c2 :
- A-1 : former les groupes d'une campagne selon les fichiers touchés, un agent isolé par groupe ;
- A-2 : aucune attente au premier plan pendant que des agents tournent.

OBJECTIF. Réduire la durée de bout en bout d'une campagne à agents, mesurée du lancement du premier
agent au traitement du dernier rapport, sous trois contraintes : zéro conflit de fusion entre
agents, jetons des agents de lot au plus 20 % au-dessus de la référence, aucune baisse du taux de
sujets clos.

DÉCLENCHEUR. Ne commence que lorsque la campagne de référence est close : les 6 fichiers
`*.meta.json` des agents « Lot A » à « Lot F » portent `"finished":true`. Sinon, rends la main
sans rien écrire, en disant combien de lots restent ouverts.

ÉTAPE 0 — RÉFÉRENCE (lecture seule : aucune écriture, pas d'option --journal).
- Entrée : les 38 sujets de `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\2071e2c2-a550-4861-af6a-8b64f7aafe28\scratchpad\candidats.md`
  (blocs « ### TF-xxxx »), et l'ancien découpage dans `lots.md` du même dossier. Lis-les
  seulement ici ; leur copie dans les fixtures se fait à l'étape 4.
- Agents de la campagne : seulement les sous-agents de
  `~\.claude\projects\c--dev-digit-ai-factory\2071e2c2-a550-4861-af6a-8b64f7aafe28\subagents\`
  dont la description commence par « Lot » (types `campagne` ou `constructeur`, lancés à
  17:10-17:12 heure de Paris, soit 16:10-16:12 en UTC dans les transcripts). Les relectures
  d'intention (`verificateur`) se comptent à part, en coût de relecture ; les autres sous-agents sont
  exclus.
- Durées : pour chaque agent de lot, premier et dernier horodatage de son transcript. Durée totale
  = heure de traitement du dernier rapport, lue dans la transcription principale
  `2071e2c2-a550-4861-af6a-8b64f7aafe28.jsonl`, moins le premier lancement.
- Jetons : jetons de sortie et jetons relus des agents de lot, tirés de leurs transcripts ; même
  méthode avant et après. `node scripts/relever-flotte.mjs --depuis 2026-10-29 --json` ne filtre
  pas par session : ne t'en sers que pour recouper.
- Taux de sujets clos : sujets passés à `corrige` au registre `todo/TODO.jsonl` sur les 38 lancés.
- Conflits de fusion : git ne garde pas trace d'un conflit résolu. Pour la référence, cherche
  « CONFLICT » et les reprises de fusion dans la transcription principale ; les lots sans copie
  isolée (lots A à D, dans les forges) sont déclarés non mesurables. Pour l'après, la session
  consigne à chaque réception le code de retour de son `git merge`, `git rebase` ou
  `git cherry-pick` et la liste des fichiers en conflit.
- Plafond d'agents : lis `references/PARALLELISME-CLAUDE-CODE.md` (20 sous-agents simultanés par
  session, 16 agents à la fois pour un workflow, relevé du 2026-10-19). Ne refais la recherche que
  si sa date de revue est passée. Ne crée aucun second référentiel ; signale la constante
  LIMITE_SOUS_AGENTS_SIMULTANES écrite en dur dans relever-flotte comme un écart à la loi n° 4.

ÉTAPE 1 — RÈGLE DE DÉCOUPAGE.
- Pour chaque sujet, estime les fichiers touchés : les chemins cités, puis chaque nom de module
  cité sans extension, résolu par `git ls-files | grep <nom>` dans les dépôts de son champ
  « forges ». Environ 23 sujets sur 38 ne citent aucun fichier à extension. Un sujet non résolu va
  avec les sujets de son lot d'origine (`lots.md`) ou de son dépôt, jamais seul dans un groupe
  supposé indépendant. Le planificateur rend la part de sujets dont les fichiers sont estimés.
- Deux sujets qui partagent un fichier vont dans le même groupe (composantes connexes).
- Modèle de durée, calibré sur la référence : régression de la durée mesurée d'un lot sur son
  nombre de sujets, durée = a + b × sujets, ajustée sur les 6 lots ; publie a, b et les résidus.
  Six points ne donnent pas de durée par sujet : dis-le, et déclare en limite le mélange de lots
  `campagne` et `constructeur`. Le même modèle estime l'ancien découpage et le nouveau : on
  compare estimation à estimation. Si aucun découpage ne bat l'ancien sous la borne de jetons,
  dis-le avec les chiffres, sans retoucher le modèle, et n'écris pas la règle de l'étape 4.
- Modèle de jetons, calibré de même sur les 6 lots : jetons d'un lot = c + d × sujets ; publie c,
  d et les résidus, avec les mêmes limites. c est le coût de démarrage d'un agent en jetons ; le
  coût de relecture est un terme à part, mesuré à l'étape 0.
- Nombre d'agents : le plus petit N, sous le plafond, qui minimise la durée estimée du plus long
  agent tant que N × c + d × 38 + coût de relecture reste sous 1,2 × les jetons de référence,
  relectures comprises des deux côtés. Un sujet dont la durée marginale b est inférieure à a,
  l'ordonnée à l'origine du modèle de durée, se regroupe avec un autre du même dépôt.

ÉTAPE 2 — LANCEMENT.
- Copie isolée (isolation worktree) pour tout agent qui partage un dépôt avec un autre agent.
- Modèle et effort selon CONTRAT-INTERFACE.md §4 : `campagne` par défaut, `constructeur` sur
  complexité manifeste, escalade consignée.
- Relecture : une relecture commune de la consigne et de la liste des sujets (D-47), pas une par
  agent, si la doctrine en vigueur le permet ; sinon dis le coût de N relectures.
- Aucun agent n'écrit au registre `todo/TODO.jsonl` : la session pilote clôt à réception.

ÉTAPE 3 — RÉCEPTION (A-2).
- Aucune attente au premier plan pendant que des agents tournent : chaque agent signale sa fin.
- Chaque rapport se traite à son arrivée (fusion, recettes, clôture), sans attendre les autres.
- Si un message d'attente doit être rendu, c'est un point d'étape préjugé par
  `node oracles/hook-restitution.mjs --prejuger <fichier>`.

ÉTAPE 4 — LIVRABLES.
- Fixtures : après `git fetch` et `git status`, copie `candidats.md` et `lots.md` dans les
  fixtures du planificateur, versionnées dans son dépôt.
- Le planificateur : un script qui lit une liste de sujets et rend en JSON les groupes, le nombre
  d'agents, l'isolation et le modèle par agent, la durée et les jetons estimés, avec sa recette
  (une fixture où le découpage par dépôt crée un lot déséquilibré, une où deux sujets partagent un
  fichier). Place-le là où la doctrine place l'outillage des agents (forge-agents si c'est elle),
  appelé depuis le pilot.
- La règle : une section « Découpage d'une campagne » dans `gabarits/AGENT-CAMPAGNE.md`, qui
  impose l'appel au planificateur et les étapes 2 et 3, en avertissement d'abord (règle neuve).
- Le registre : A-1 et A-2 inscrits par `node todo/journaliser.mjs`, avec la mesure de référence.
- Une étude courte qui compare la référence au découpage calculé sur les mêmes 38 sujets, nommée
  selon R-4 et R-25 du pilot : `Digit-AI - Etude - Strategie de lancement des agents - 20261029<indice>.md`
  dans `output/03-etudes/`, indice par `node scripts/allouer-indice.mjs`.

ÉCRITURE ET PUBLICATION.
- Avant toute écriture : `git fetch` et `git status` dans chaque dépôt touché.
- Commits limités à tes chemins : `git commit --only -- <chemins>`, jamais un `git add` suivi d'un
  commit nu ; le registre ne s'écrit que par `todo/journaliser.mjs`.
- Publication : le pilot et forge-agents sous le GO permanent de R-38 §6
  (`FORGE_PUSH_GO`), envoi vérifié par `git rev-list --left-right --count HEAD...@{u}`.

ÉTAPE 5 — MESURE APRÈS (hors de ce tour).
- La prochaine campagne d'au moins 10 sujets applique la stratégie et se mesure comme à l'étape 0.
  L'item du registre reste ouvert jusque-là et ne se clôt que sur ce gain constaté.

GARDE-FOUS.
- Ne modifie pas une session ni une campagne en cours.
- N'utilise pas l'outil Workflow sans accord explicite de l'humain.
- Ne pose à l'humain que ce qui relève de lui : passer la règle en blocage, ou dépasser le seuil
  de jetons par jour des relectures. Le reste s'exécute et se rend pour information.

CONTRAT DE SORTIE — à tenir avant de rendre la main, chaque point avec sa preuve exécutée.
Branche négative : si aucun découpage ne bat l'ancien sous la borne de jetons (étape 1), le
point 2 devient « le planificateur rend les deux estimations chiffrées, durée et jetons, et leur
écart », le point 5 est « sans objet, règle non écrite », et A-1 est inscrit au registre avec ce
constat négatif ; les autres points restent dus. Branche positive : les points tels qu'écrits.
1. la référence est chiffrée sur les 6 agents de lot : durée totale, durée du plus long agent,
   jetons, taux de sujets clos, conflits, avec les commandes qui l'ont produite et ce qu'elles ne
   mesurent pas ;
2. le planificateur, rejoué sur `candidats.md`, rend un nombre d'agents, des groupes sans fichier
   commun, une durée estimée inférieure à l'estimation de l'ancien découpage par le même modèle, et
   des jetons estimés sous 1,2 × la référence ;
3. sa recette sort en 0, sa fixture rouge échoue sur l'ancien découpage par dépôt, et
   `candidats.md` et `lots.md` sont versionnés dans ses fixtures ;
4. aucun nombre d'agents n'est écrit en dur dans la règle ni dans le script : le plafond se lit
   dans `references/PARALLELISME-CLAUDE-CODE.md` ;
5. `gabarits/AGENT-CAMPAGNE.md` porte la section de découpage, d'attente et de réception ;
6. A-1 et A-2 sont au registre, `node todo/oracle-todo.mjs` sort en 0 ;
7. l'étude porte un nom conforme à R-4 et R-25 ;
8. l'étape 5 est inscrite comme ouverte, avec son déclencheur et sa commande de mesure ;
9. chaque dépôt écrit est publié, écart avec le distant 0 0.
```

### Contrat de sortie

Le contrat est désormais dans le prompt, en 9 points, avec une branche négative depuis la passe 5, sous « CONTRAT DE SORTIE ». À la passe 1, il était annoncé mais absent : les deux relecteurs l'ont relevé. Ses points couvrent la référence chiffrée sur les 6 agents de lot, le planificateur rejoué sur `candidats.md`, sa recette, le plafond lu dans `references/PARALLELISME-CLAUDE-CODE.md`, la section de `gabarits/AGENT-CAMPAGNE.md`, le registre, le nom de l'étude selon **R-4** *(règle du pilot : le nom du projet ouvre le nom du fichier)* et **R-25** *(règle du pilot : le type, pris au registre des types, est le premier mot du deuxième segment)*, l'étape 5 ouverte et la publication vérifiée.

### Protocole de tests du livrable

Le livrable mêle du code et un document ; chaque partie a son oracle.

- **Code (planificateur)** : exécution réelle sur trois jeux d'essai. Le jeu nominal : les 38 sujets de `candidats.md`. Le cas limite 1 : 3 sujets dans un seul dépôt qui partagent un fichier, attendu un seul agent. Le cas limite 2 : 20 sujets sans aucun chemin cité, attendu un rattachement à leur dépôt, sans erreur.
- **Document (règle et étude)** : présence des sections nommées, chiffres sourcés, oracle de lisibilité Markdown du socle.
- **Boucle bornée** : générer, tester contre le contrat, corriger, 3 itérations au plus ; après 3 échecs, livrer avec la liste des écarts restants.

### Changelog

Comment lire la liste : chaque ajout du prompt renvoie au défaut qu'il ferme, du chapitre 3 ou d'une passe de relecture.

- Objectif chiffré et trois contraintes : défaut n° 2, cause n° 4.
- Nombre calculé sous le plafond de `references/PARALLELISME-CLAUDE-CODE.md` : défauts n° 4 et n° 8, passe 1.
- Groupes par fichiers et copie isolée : défaut n° 6, cause n° 3.
- Réception sans attente : défaut n° 5, cause n° 5.
- Script plus règle plus registre plus étude : défaut n° 3, cause n° 1.
- Mesure de référence par les transcripts des sous-agents, plus par `relever-flotte` seul, qui ne mesure pas les durées : bloquant de la passe 1.
- Contrat de sortie écrit dans le prompt : passe 1.
- A-1 et A-2 recopiés dans le prompt : passe 1.
- Déclencheur sur la fin de la campagne, filtre des seuls agents « Lot », heure en heure de Paris et en UTC : passe 2.
- Liste des 38 sujets nommée, modèle de durée calibré, comparaison estimation contre estimation : passe 2.
- Taux de sujets clos et jetons au contrat, règles de commit et de publication : passe 2.
- Étape 5, mesure après, hors du tour : défaut n° 12.
- Noms de module résolus par `git ls-files`, régression de durée sur les 6 lots, conflits mesurés au geste de fusion, copie des fixtures à l'étape 4 : passe 3.
- Modèle de jetons, coût de démarrage et coût de relecture séparés, branche négative du contrat : passe 4.

### Écarts à la lettre

Comment lire le tableau : une ligne par endroit où le prompt réécrit s'écarte de votre texte ; tous relèvent de la manière d'exécuter, aucun n'ajoute un contenu visible à un livrable que vous n'avez pas demandé.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « Suite A1 » | « Suite de A-1 et A-2 » | sans A-2, plus d'agents ne raccourcit rien (chapitre 2) ; un exemple de la demande illustre, il ne borne pas | Manière d'exécuter |
| « leurs nombres » | un nombre calculé sous un plafond daté | un chiffre fixe ne vaut que pour une campagne | Manière d'exécuter |
| « optimiser les traitements » | réduire la durée, sous zéro conflit et au plus 20 % de jetons en plus | « optimiser » sans grandeur ne se vérifie pas ; le seuil de 20 % est une proposition de l'analyse, à ajuster | Manière d'exécuter |
| (rien sur le livrable) | un script, une règle en avertissement, le registre et une étude | une règle non câblée n'existe pas (loi n° 1) | Manière d'exécuter |
