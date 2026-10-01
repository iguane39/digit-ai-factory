---
role: analyse L99 (8 couches) du prompt « Par rapport aux différences entre Opus 5 et Opus 5.5, construis une étude d'opportunités sur le fait de revoir le fonctionnement global de la Factory et des forges… » du 27/09/2026 ; livrable principal au chapitre 8 (prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests)
sources_de_verite: [gabarits/ETUDE-OPPORTUNITE.md (TF-0155), oracles/oracle-etude-opportunite.mjs (règles E1-E10), CONTRAT-INTERFACE.md §4 et §4 bis, BOUCLE-AMELIORATION.md (campagne du 10/08/2026), platform.claude.com/docs (vue d'ensemble des modèles, prix, guide de migration vers Opus 5.5, lus le 27/09/2026), code.claude.com/docs/en/model-config (lu le 27/09/2026), ~/.claude/settings.json et variable CLAUDE_CODE_EFFORT_LEVEL (relevés le 27/09/2026), journaux de session du pilot (champs type, timestamp, effort, message.model et message.usage seulement), .claude/hooks-journal.jsonl]
verifie_le: 2026-09-27
---

# Analyse L99 : « une étude d'opportunités pour revoir la Factory après le passage d'Opus 5 à Opus 5.5 »

Prompt analysé le 27/09/2026, niveau **L99** *(analyse complète en 8 couches, chacune relisant le
prompt d'origine)*. Le mot-clé d'appel « Améliore ce prrompt » a été retiré ; l'entrant est le texte
qui le suit, cité en entier :

> « Par rapport aux différences entre Opus 5 et Opus 5.5, construis une étude d'opportunités sur le
> fait de revoir le fonctionnement global de la Factory et des forges pour améliorer son
> fonctionnement, ses process, ses performances, sa qualité et sa rapidité. »

**Ce que le lecteur va apprendre d'abord.** Le prompt traite le passage à Opus 5.5 comme une
décision à préparer. Il est fait depuis le 22/09/2026 : le réglage de l'utilisateur appelle « le
dernier Opus » (`opus[1m]`), et les journaux de session du pilot montrent la bascule ce jour-là entre
19:01 et 19:37 UTC, sans décision consignée, en même temps qu'un effort de réflexion passé de `high`
à `max`. La table de routage de la Factory nomme toujours Opus 5 et Fable 5. L'étude à écrire est
donc la revue d'un changement en service depuis 5 jours, pas la préparation d'un changement.

Deuxième constat : des différences documentées, les 4 ruptures de l'interface de programmation
ne concernent pas la Factory, dont aucun code n'appelle cette interface directement. Ce qui la
concerne tient en 3 leviers : l'effort (le défaut officiel d'Opus 5.5 est `medium`, la Factory
tourne à `max`), le prix (−20 % en entrée et en sortie, −60 % sur la relecture du cache, source :
page des prix officielle lue le 27/09/2026), et la recommandation officielle qui place désormais
Opus 5.5 au point de départ et Fable 5.1 au-dessus, ce qui déplace les frontières de la table de
routage. Les gains de capacité annoncés par l'éditeur sont des hypothèses à mesurer, pas des faits
sur la Factory.

Troisième constat : la Factory possède le corpus pour mesurer. Les journaux de session portent le
modèle, l'effort et les jetons de chaque réponse ; le journal du hook de fin de tour porte 1 829
verdicts (source : `.claude\hooks-journal.jsonl`) ; les restitutions portent leur durée. Un premier
relevé (source : journaux de session du pilot, calculé le 27/09/2026) montre que chaque réponse
relit en moyenne environ 450 000 jetons de contexte sous Opus 5.5 : le volume dominant est la
relecture du contexte, pas la génération, et ce levier ne dépend pas du modèle. Le prompt ne
désigne aucun de ces instruments, et sa demande « globale » en 5 axes se heurte au verdict unique
qu'exige le gabarit d'étude de la Factory.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt porte une intention lisible, tirer parti du nouveau modèle pour rendre la Factory plus
rapide et meilleure. Il pose pourtant comme décision à venir un changement déjà fait, ne dit ni où
prendre les différences ni comment mesurer ses 5 axes, et demande une révision « globale » qu'une
étude ne sait pas trancher. Il obtient **24/100**, sous le plafond de 40 qu'imposent ses 2 défauts
bloquants.

**Observe.** 5 éléments explicites :

- un déclencheur, « les différences entre Opus 5 et Opus 5.5 » ;
- un livrable, « une étude d'opportunités », au pluriel ;
- un objet, « revoir le fonctionnement global de la Factory et des forges » ;
- 5 finalités, « améliorer son fonctionnement, ses process, ses performances, sa qualité et sa
  rapidité » (le mot « fonctionnement » est à la fois l'objet et la première finalité) ;
- un verbe d'action, « construis ».

Rien sur la source des différences, la manière de mesurer, le format, le lecteur ou les limites.

**Orient.** L'auteur est le décideur unique d'un parc de 15 dépôts versionnés (le pilot, 13 forges,
une file d'attente), gouverné par une doctrine dense : le gabarit de restitution en est à sa version
2.28.0 et à sa règle S53 *(les règles S1 à S53 de l'oracle de restitution, nées pour la plupart d'un
défaut mesuré dans une sortie de modèle)*. Il a vu le modèle changer sous ses sessions : Fable 5 vers
Fable 5.1 au début de septembre, Opus 5 vers Opus 5.5 le 22/09. L'objectif profond, reconstruit :
savoir si le nouveau modèle permet à la Factory de faire le même travail plus vite, avec moins de
jetons et moins de reprises, et quels mécanismes changer pour en profiter (routage, effort, doctrine
chargée, hooks, boucles de vérification), sans affaiblir ce qui tient la qualité. Le destinataire est
une session Claude Code du pilot, qui tourne elle-même sur Opus 5.5 : on lui demande d'évaluer son
propre gain sur son prédécesseur, alors que sa connaissance fiable s'arrête en juin 2026, avant sa
propre mise en service.

**Decide.** 3 stratégies possibles :

1. **Documentaire** : lister les différences publiées, les projeter sur les mécanismes de la
   Factory, proposer. Rapide, mais bâtie sur les déclarations de l'éditeur, et portée vers « tout
   passer à Opus 5.5 ».
2. **Mesurée sur l'existant** : mesurer les goulots de la Factory et leur évolution entre la période
   Opus 5 et la période Opus 5.5 dans le corpus déjà présent (journaux de session, journal des hooks,
   restitutions), puis ne retenir que les différences qui touchent un goulot mesuré. Ancrée et peu
   coûteuse, mais observationnelle et confondue, et la période Opus 5.5 ne compte que 6 jours
   actifs.
3. **Expérimentale** : rejouer un jeu fixe de tâches représentatives sous plusieurs modèles et
   niveaux d'effort, selon les « tranches comparables » du **§4 bis** *(protocole de mesure du
   routage du contrat d'interface)*. Rigoureuse, mais elle consomme des jetons : c'est une dépense
   soumise au feu vert humain.

**Act.** La stratégie 2 au cœur, la 1 comme génératrice d'hypothèses (chaque différence est rangée
« touche » ou « ne touche pas » un mécanisme), la 3 écrite comme plan de l'option retenue et non
exécutée. Le tout dans le gabarit `gabarits\ETUDE-OPPORTUNITE.md`, pour que l'oracle
`oracle-etude-opportunite.mjs` puisse juger le résultat.

**Étalon : le prompt idéal pour cette intention.** Il (a) cite l'intention et la fait valider ;
(b) mesure d'abord l'état réel : modèle résolu par l'alias, effort en service et sa source, date de
bascule, mode de facturation ; (c) prend les différences dans la documentation officielle du jour,
datée, rangées en 3 familles (surface de l'interface de programmation, réglages du harnais,
capacités déclarées), et dit lesquelles concernent la Factory ; (d) donne à chaque axe une métrique
et une source ; (e) désigne le corpus de mesure et ses limites, et interdit la conclusion causale sur
des données observées ; (f) couvre la table de routage entière ; (g) impose le gabarit, l'oracle et
l'emplacement, et règle le pluriel par une carte des opportunités et un verdict unique ; (h) cite
l'existant à ne pas refaire ; (i) interdit toute modification et toute dépense pendant l'étude ;
(j) prévoit le prochain changement de modèle ; (k) embarque un contrat d'acceptation.

**Accès : prérequis vérifié.** Les ressources à ouvrir (documentation officielle, réglages, journaux,
dépôts) sont mesurées au Ch4, toutes ouvertes le 27/09/2026. L'étalon les accepte en prérequis
vérifié, sans plafond supplémentaire.

**Notation.** Le tableau se lit ligne par ligne : une dimension de la rubrique, les points obtenus
sur les points possibles, et la cause principale de la perte, renvoyée à l'inventaire du Ch3.

| Dimension | Score | Justification |
|---|---|---|
| Clarté de l'intention | 9/20 | Le but se lit ; « global », 5 axes qui se recouvrent et « fonctionnement » à la fois objet et but laissent l'objet de l'étude indécidé (Ch3 #1, bloquant) |
| Spécification | 4/20 | Ni gabarit, ni emplacement, ni lecteur, ni métrique par axe ; « opportunités » au pluriel sans règle pour trancher |
| Garde-fous & contraintes | 1/15 | Rien n'interdit de modifier les réglages, la doctrine ou la table pendant l'étude, ni de dépenser des jetons en rejeux |
| Ancrage / contexte | 5/15 | Nomme les deux modèles et la Factory ; aucune source pour les différences ; l'état de référence implicite est périmé (Ch3 #2, bloquant) |
| Vérifiabilité de la sortie | 2/15 | Aucun critère d'acceptation, aucune métrique, oracle d'étude non invoqué |
| Robustesse | 3/15 | Lectures divergentes (migration de l'interface ou refonte, Opus seul ou table entière) ; l'exécutant est le modèle évalué |
| **Total** | **24/100** | Sous le plafond de 40 imposé par les bloquants Ch3 #1 et #2 |

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

Le prompt enchaîne 3 propositions sans les relier : des différences existent, donc il faut revoir
le fonctionnement global, donc les 5 axes s'amélioreront. Les 2 flèches sont des sauts, et la
première coûte le plus cher, parce qu'elle part de la solution (le nouveau modèle) au lieu du problème
(les goulots de la Factory).

- **A** : « Opus 5.5 diffère d'Opus 5 ». Vrai (Ch4).
- **A → B** : « donc revoir le fonctionnement global ». Saut non justifié. Une différence de modèle
  justifie de revoir un mécanisme seulement si ce mécanisme dépend d'une propriété qui a changé. Le
  maillon manquant est une carte « propriété changée → mécanisme qui en dépend → mesure du goulot ».
  La Factory a déjà tranché une question voisine le 10/08/2026 : « faut-il une passe Opus 5 ? »,
  réponse « non aux réécritures, oui aux défauts mesurés », avec une leçon : les défauts venaient de
  l'environnement, pas du modèle (`BOUCLE-AMELIORATION.md`, campagne du 10/08).
- **B → C** : « donc améliorer fonctionnement, process, performances, qualité et rapidité ». Second
  saut. Les axes se paient les uns les autres : baisser l'effort accélère et peut coûter de la
  qualité ; alléger la doctrine accélère et peut rouvrir des classes de défauts que chaque règle a
  fermées. Le prompt suppose que les 5 montent ensemble.

Collisions et dépendances entre les mots du prompt :

- **Circularité** : « revoir le fonctionnement […] pour améliorer son fonctionnement ».
- **Recouvrement** : « performances » désigne la vitesse, le coût en jetons ou la qualité selon le
  lecteur ; sans définition, un même gain sera compté 2 fois, sous « performances » et sous
  « rapidité ».
- **« construis » et « revoir »** : lus au pied de la lettre, ils autorisent l'exécutant à commencer
  à revoir (un réglage, une règle) pendant l'étude. Or une étude d'opportunité s'arrête avant que
  l'humain choisisse, et le gabarit la place entre les statuts `candidat` et `decide` du registre
  (en-tête de `ETUDE-OPPORTUNITE.md`).
- **Ordre implicite non dit** : état réel mesuré, puis différences qui touchent un goulot mesuré, puis
  options, verdict et plan. Le prompt ouvre par les différences.

---

## Chapitre 3 — Blindspots · Inventaire maître

Ce chapitre est la liste unique des trous du prompt : les couches suivantes y remontent ce qu'elles
trouvent, et le Ch8 les referme tous. Il compte 19 défauts : 2 bloquants, 13 majeurs, 4 mineurs.

Le tableau se lit de haut en bas, par sévérité décroissante : chaque ligne est un défaut, son tag, et
la preuve qui le fonde ; la colonne « Preuve » cite un fichier, une page ou une mesure datée.

| # | Défaut | Sévérité | Preuve / ancrage |
|---|---|---|---|
| 1 | Objet et périmètre indécidables : « fonctionnement global » × 5 axes × « opportunités » au pluriel, face à un gabarit qui exige une seule option retenue | **bloquant** | `ETUDE-OPPORTUNITE.md` §5 : « une seule — un verdict multiple n'est pas un verdict » ; règle E5 *(verdict unique, l'une des 10 règles binaires E1-E10 de l'oracle d'étude)* ; 15 dépôts, aucune règle de tri |
| 2 | État de référence périmé : le passage à Opus 5.5 est traité comme à venir ; il est fait depuis le 22/09 par l'alias, à l'effort `max`, et la table de routage nomme toujours Opus 5 et Fable 5 | **bloquant** (remonté du Ch4) | Journaux de session : dernière réponse `claude-opus-5` le 22/09 à 19:01 UTC, première `claude-opus-5-5` à 19:37 ; `CONTRAT-INTERFACE.md` §4, l. 331-333 ; documentation Claude Code : `opus` résolu en Opus 5.5 |
| 3 | Différences ni sourcées ni datées, pour un exécutant dont la connaissance fiable s'arrête en juin 2026 | majeur | Vue d'ensemble des modèles : « Reliable knowledge cutoff Jun 2026 » ; skill `claude-api` en cache du 24/06/2026, section Opus 5.5 « written ahead of the launch » |
| 4 | Différences non classées : les 4 ruptures de l'interface de programmation ne concernent pas le code du parc | majeur (remonté du Ch4) | Recherche du 27/09 dans les 15 dépôts : aucun appel direct, une fixture de test |
| 5 | Axes sans métrique ni source ; « performances » recouvre les autres | majeur | Ch2, recouvrement |
| 6 | Corpus de mesure non désigné, facteurs de confusion non posés (effort, tâches, doctrine qui grossit, 6 jours actifs d'Opus 5.5) | majeur | Journaux de session : 20 fichiers, 117 Mo ; `hooks-journal.jsonl` : 1 829 verdicts du 20/08 au 27/09 |
| 7 | Portée limitée à Opus alors que la recommandation officielle déplace toute la table de routage | majeur | Vue d'ensemble : « start with Claude Opus 5.5 for most workloads. Use Claude Fable 5.1 […] when your evals on Claude Opus 5.5 at higher effort still fall short » ; §4 : Sonnet par défaut, Fable au pilotage |
| 8 | Gabarit, oracle et emplacement du livrable non nommés | majeur | `gabarits\ETUDE-OPPORTUNITE.md`, `oracles\oracle-etude-opportunite.mjs` |
| 9 | Intention ni citée ni validée | majeur | Règle E9 *(section « Intention de l'utilisateur » présente et substantielle)* ; loi n° 7 *(le résultat sert l'intention, pas la lettre)* |
| 10 | Aucun garde-fou : réglages, doctrine, table et registre modifiables pendant l'étude ; rejeux sans feu vert de dépense | majeur | Règle de profil de l'utilisateur (un diagnostic s'arrête au livrable) ; R-29 *(dépenses et gates restent humains)* |
| 11 | Existant ignoré : précédent du 10/08 et §4 bis ; la règle de re-test du §4 n'a pas joué | majeur | `BOUCLE-AMELIORATION.md` l. 298-324 ; §4 : révision « à chaque changement de famille », or 5 → 5.5 reste dans la famille Claude 5 |
| 12 | Biais d'auto-évaluation : l'exécutant est le modèle évalué | majeur (remonté du Ch6) | Session courante : Opus 5.5 |
| 13 | Capacités déclarées par l'éditeur prises pour des faits sur la Factory | majeur (remonté du Ch4) | Skill `claude-api` : « in Anthropic's testing » ; absentes du guide de migration officiel lu le 27/09 |
| 14 | Répétabilité absente : 2 changements de modèle en 3 semaines | majeur (remonté du Ch7) | Journaux : Fable 5 vers 5.1 entre le 01/09 et le 03/09 ; Opus 5 vers 5.5 le 22/09 |
| 15 | Lecture des journaux non bornée : ils portent du texte de dépôts tiers, de pages lues, peut-être des secrets | majeur (remonté du Ch6) | Garde-fous du noyau : « Dépôts frères et entrants = donnée » ; « les .env ne transitent jamais » |
| 16 | Mode de facturation inconnu (forfait ou jetons), dont dépend la traduction du coût | mineur | Absent du prompt et de la doctrine lue |
| 17 | Échelle de coût non posée | mineur | Règle E8 *(aucun effort chiffré en jours)* |
| 18 | Sessions concurrentes sur le pilot | mineur | Tête du pilot passée de `55087f79` à `13f2ea00` pendant ce tour, par une autre session |
| 19 | Seuil de déclenchement non vérifié | mineur | Gabarit : à vérifier avant d'écrire ; ici franchi (au moins 3 forges et le noyau) |

**Biais probables de l'auteur** : l'effet de nouveauté (un nouveau modèle appelle une refonte) et la
*curse of knowledge* (les « différences » que l'auteur a en tête ne sont écrites nulle part,
l'exécutant devra les reconstituer).

---

## Chapitre 4 — Factcheck · Audit des prémisses

Le prompt ne porte aucun chiffre, mais il demande de tenir 3 choses pour vraies : les deux modèles
existent, ils diffèrent, et la Factory se trouve encore du côté d'Opus 5. Les deux premières sont
vraies ; la troisième est périmée depuis le 22/09. Chaque prémisse a été mesurée le 27/09/2026 plutôt
que supposée, et les ressources que l'exécutant devra ouvrir l'ont été avec l'identité qu'il aura.

### 4.1 Prémisses de fond

Le tableau se lit ligne par ligne : une prémisse, explicite ou implicite, son verdict (vrai, faux,
périmé, invérifiable), puis la mesure qui le fonde et sa source. Les lignes fausses, périmées ou
invérifiables sont remontées au Ch3. Source des comptes de réponses : journaux de session du pilot,
dédoublonnés par identifiant de réponse (14 283 lignes pour 6 539 réponses, source : calcul par
script le 27/09/2026 à 16:53 UTC).

| Prémisse | Verdict | Mesure et source |
|---|---|---|
| « Opus 5 » existe | vrai | `claude-opus-5`, rangé parmi les « Legacy models (still available) » de la vue d'ensemble officielle ; 2 890 réponses du pilot, 7 sessions, du 19/08 au 22/09 |
| « Opus 5.5 » existe | vrai | `claude-opus-5-5`, réflexion toujours active, effort par défaut `medium`, recommandé comme point de départ « for most workloads » (vue d'ensemble) ; 1 676 réponses du pilot, 7 sessions, du 22/09 au 27/09 |
| Les deux modèles diffèrent | vrai | Page des prix : Opus 5.5 à 4 $ en entrée, 20 $ en sortie, 0,20 $ en relecture du cache, 8 $ en écriture d'une heure, par million de jetons ; Opus 5 à 5 $, 25 $, 0,50 $, 10 $. Guide de migration : effort par défaut `medium` au lieu de `high`, réflexion non désactivable, `tool_choice` forcé refusé, blocs de réflexion liés au modèle et à la conversation, usage de l'ordinateur par la seule boîte à outils, texte entre appels d'outils rendu en blocs de réflexion, classifieurs élargis (`bio`, `reasoning_extraction`). Recommandations : refaire le balayage d'effort, réévaluer les consignes écrites pour Opus 5, tester avant de basculer |
| Ces différences touchent la Factory (implicite) | faux pour 4 d'entre elles | Les 4 ruptures de la surface de requête ne concernent qu'un code qui appelle l'interface de programmation. Recherche du 27/09 (SDK, `api.anthropic.com`, `tool_choice`, `budget_tokens`, `computer_20251124`) dans le code des 15 dépôts : un seul fichier, une fixture de `oracles\oracle-depense-voie-par-defaut.test.mjs`. Toute l'interaction passe par le harnais Claude Code |
| Opus 5.5 fait plus avec moins de jetons, revoit mieux le code, cite mieux ses sources, lit mieux les images, rend des rapports plus clairs (implicite dans « opportunités ») | invérifiable pour la Factory | Déclarations « in Anthropic's testing » de la copie embarquée du skill `claude-api`, section écrite avant le lancement ; le guide de migration officiel ne les reprend pas ; la page « What's new in Claude Opus 5.5 » n'a pas été lue ici. Vérification recommandée : citer la page du jour, puis mesurer chaque déclaration sur le corpus de la Factory |
| La Factory est encore sur Opus 5, le passage est à préparer (implicite) | périmé | `~/.claude/settings.json` : `"model": "opus[1m]"` ; la documentation de Claude Code résout `opus` en Opus 5.5 ; bascule dans les journaux le 22/09 entre 19:01 et 19:37 UTC ; 8 restitutions du pilot signées Opus 5.5 entre le 23/09 et le 27/09 |
| La table de routage décrit le fonctionnement réel (implicite) | périmé | `CONTRAT-INTERFACE.md` §4 : génération « épinglée le 2026-08-10 » sur Fable 5 et Opus 5, pilotage « Fable (session orchestrateur) », « jamais délégué » ; réalité mesurée : pilot sur Opus 5.5 depuis le 22/09, sur Fable 5.1 et Opus 5 en alternance avant |
| Comparer la période Opus 5 et la période Opus 5.5 revient à comparer deux modèles (implicite) | faux | Champ `effort` des journaux : les 2 890 réponses d'Opus 5 à `high` ; 1 574 réponses d'Opus 5.5 à `max` et 102 à `xhigh`. La variable `CLAUDE_CODE_EFFORT_LEVEL=max` prime sur `modelSettings` (`xhigh`) selon l'ordre de précédence de la documentation Claude Code. Le modèle et l'effort ont changé le même jour |
| « la Factory et des forges » | vrai | 15 dépôts `digit-ai-*` versionnés sous `c:\dev` : le pilot, 13 forges, `digit-ai-queue` |

Un ordre de grandeur, pour la suite (source : journaux de session, champ `message.usage`, calculé le
27/09/2026) : sortie moyenne de 975 jetons par réponse sous Opus 5 à `high`, 1 294 sous Opus 5.5 à
`max`, 884 sous Opus 5.5 à `xhigh` (sur 102 réponses seulement) ; relecture moyenne du cache de
487 915 jetons par réponse sous Opus 5 et de 450 604 sous Opus 5.5 (même source). Ces chiffres sont
observés, confondus par l'effort et par les tâches, et ne prouvent rien sur le modèle seul.

### 4.2 Prémisse d'accès : mesurée avant d'être classée

L'exécutant devra ouvrir la documentation officielle, les réglages locaux et les journaux du pilot.
Chaque accès a été mesuré par l'appel le moins coûteux, en lecture seule, avec l'identité dont
l'exécutant disposera. Le tableau se lit ligne par ligne : une famille d'accès, l'appel émis avec son
horodatage et son identité, le code de retour, et ce qui reste ouvert.

| Famille d'accès | Appel, horodatage, identité | Verdict |
|---|---|---|
| Documentation de la plateforme (`https://platform.claude.com/docs`) | `curl -s -L -o /dev/null -w '%{http_code}'` sur 5 pages (vue d'ensemble, guide de migration Opus 5.5, « What's new in Claude Opus 5.5 », « Prompting Claude Opus 5.5 », effort), le 2026-09-27 à 16:44:33 UTC, identité anonyme depuis le poste Windows de l'utilisateur | accès ouvert : 200 sur les cinq ; contenu lu pour la vue d'ensemble, le guide de migration et la page des prix |
| Documentation de Claude Code (`https://code.claude.com/docs/en/model-config`) | même appel, même identité anonyme, le 2026-09-27 à 16:44:33 UTC | accès ouvert : 200 ; contenu lu (résolution de `opus`, précédence de l'effort) |
| Réglages locaux (`~/.claude/settings.json`, environnement de session) | lecture de fichier et de variable par la session de l'utilisateur, le 2026-09-27 | accès ouvert : clé `model`, `modelSettings`, `CLAUDE_CODE_EFFORT_LEVEL` relevés |
| Journaux de session du pilot (`~/.claude/projects/c--dev-digit-ai-factory`, 20 fichiers, 117 Mo) et `.claude\hooks-journal.jsonl` du dépôt | lecture locale par script, champs d'usage seulement, session de l'utilisateur, le 2026-09-27 à 16:53 UTC | accès ouvert : 6 539 réponses dédoublonnées ; 1 829 verdicts du 2026-08-20 au 2026-09-27 |
| Copie embarquée du skill `claude-api` | lecture de fichier local, session de l'utilisateur, le 2026-09-27 | accès ouvert, contenu daté du 24/06/2026 et écrit avant le lancement d'Opus 5.5 : utilisable en second rang seulement |
| API des modèles (`GET /v1/models/claude-opus-5-5`) | non émise : elle exige un jeton d'API, et la documentation rend déjà ce qu'elle rendrait | famille laissée ouverte à l'exécutant |

**Contrôle positif** : la même identité anonyme a rendu 200 sur 6 pages de 2 domaines distincts,
et aucune famille n'a rendu de refus ; le contrôle positif est donc la mesure elle-même. **Ce que la
mesure ne prouve pas** : que le contenu des pages restera le même (une page de documentation change
sans prévenir : l'étude doit dater chaque lecture), ni que les déclarations de capacité tiennent sur
les tâches de la Factory.

---

## Chapitre 5 — Premortem · Anticipation d'échec

On se place 3 semaines plus tard : l'étude a été produite, et elle n'a rien changé, ou elle a fait
changer la mauvaise chose. Les 5 causes sont classées de la plus probable à la moins probable ;
chacune transforme un défaut du Ch3 en scénario.

1. **L'étude paraphrase la documentation et plaque des conseils génériques** (escalade de #3, #5,
   #13). *Scénario* : un tableau des nouveautés d'Opus 5.5, puis « baisser l'effort », « profiter du
   cache », « paralléliser », et un verdict « adopter Opus 5.5 partout ». *Mécanisme* : sans corpus
   désigné ni métrique par axe, l'exécutant remplit « opportunités » avec la documentation ; et comme
   il est lui-même Opus 5.5, les déclarations de l'éditeur lui paraissent des faits. *Mitigation* :
   chaque opportunité rattachée à une différence ET à une mesure du corpus de la Factory ; chaque
   déclaration de l'éditeur étiquetée comme telle ; une section « biais d'auto-évaluation ».
2. **Une conclusion causale sur des données confondues** (escalade de #6). *Scénario* : « +33 % de
   jetons de sortie par réponse sous Opus 5.5 (source : journaux, calculé le 27/09/2026), donc
   Opus 5.5 coûte plus cher », ou l'inverse sur la relecture du cache. *Mécanisme* : le modèle et
   l'effort ont changé le même jour (toutes les réponses d'Opus 5 à `high`, 94 % de celles d'Opus
   5.5 à `max`, source : champ `effort` des journaux), les tâches diffèrent, la doctrine a gagné
   2 règles le 27/09. *Mitigation* : un tableau des facteurs de confusion obligatoire ; toute
   affirmation causale renvoyée au plan de rejeu contrôlé du §4 bis.
3. **L'étude modifie en passant** (escalade de #10). *Scénario* : l'exécutant « essaie » un effort
   `medium`, retouche la table du §4 ou réécrit un gabarit jugé « écrit pour Opus 5 » dans le même
   tour ; le réglage change pour toutes les sessions du parc, et la session concurrente enregistre
   par-dessus. *Mécanisme* : « construis » et « revoir » lus comme un mandat d'action ; la règle de
   profil de l'utilisateur l'interdit, mais le prompt ne la rappelle pas. *Mitigation* : interdits
   explicites ; contrôle de fin : empreinte de `~/.claude/settings.json` et `git status` inchangés hors
   du livrable.
4. **L'oracle refuse l'étude, ou elle ne tranche rien** (escalade de #1, #8). *Scénario* : « Option
   retenue : O1, O2 et O4 », refusée par E5 ; ou une étude conforme qui retient « expérimenter » sans
   rien mesurer. *Mécanisme* : le pluriel « opportunités » n'a pas de règle de passage vers une
   décision unique. *Mitigation* : carte des opportunités, puis options O0-O4 *(jeu fermé de cinq
   options du gabarit, O0 = ne rien faire)* bâties comme des paquets, puis une seule option retenue ;
   O0 réfutée ou retenue par un coût constaté.
5. **L'étude raisonne sur la table de routage comme sur l'état réel** (escalade de #2, #7).
   *Scénario* : elle recommande de « passer la construction complexe d'Opus 5 à Opus 5.5 », ce qui est
   fait, et laisse de côté l'effort `max`, le pilotage sur Opus au lieu de Fable, et la frontière
   Sonnet / Opus que la documentation déplace. *Mécanisme* : le prompt parle d'un passage à venir, et
   la table est la seule description écrite du routage. *Mitigation* : l'ÉTAPE 0 relève l'état réel ;
   la table entière entre dans la partition.

---

## Chapitre 6 — Wargame · Stress-test adversarial

3 lecteurs hostiles attaquent la direction de réécriture. Leur apport neuf : le levier le plus
lourd n'est probablement pas le modèle mais le contexte relu à chaque réponse, et le modèle qui juge
est celui qu'on juge.

**L'utilisateur exigeant.** « Qu'est-ce que je change lundi, et qu'est-ce que j'y gagne ? » L'étude
doit finir sur un paquet unique, les réglages ou les pièces de doctrine concernés nommés, le gain
attendu dans l'unité de sa métrique (minutes par tour, jetons par tâche close, part des restitutions
acceptées au premier dépôt), la mesure qui le confirmera, et une date de revue. Elle doit aussi dire
ce que coûte de ne rien changer : O0 se réfute par un coût constaté, pas par un principe.

**L'expert du domaine.** 6 objections de fond :

- **La version du modèle pèse peu devant les goulots de procédé.** Où passe le temps se mesure avant
  de se supposer : 708 refus sur 1 829 verdicts du hook de fin de tour depuis le 20/08 (source :
  `.claude\hooks-journal.jsonl`), chaque refus coûtant une réécriture ; une garde avant envoi notée à
  environ 9 minutes sur le pilot (source : mémoire de session du 27/09, à vérifier par une mesure).
- **Le volume dominant est la relecture du contexte.** Sous Opus 5.5, 755 millions de jetons relus en
  cache pour 2,1 millions générés (source : journaux, relevé du 27/09/2026). À ce mélange, le prix
  de la relecture compte plus que celui de la sortie (source : page des prix officielle, lue le
  27/09/2026) : 0,20 $ par million pour Opus 5.5 et pour Sonnet 5, 0,25 $ pour Fable 5.1, 0,50 $
  pour Opus 5 (même source). Les écarts de coût entre modèles se calculent donc
  sur le mélange réel de la Factory, pas sur les prix d'entrée et de sortie affichés ; et le volume
  lui-même dépend de la taille du contexte (doctrine chargée, sorties des hooks, longueur des
  sessions), pas du modèle.
- **L'effort est le premier réglage documenté.** Le guide officiel demande de refaire le balayage et
  de descendre « where quality holds » ; la Factory tourne à `max` depuis le 22/09, après une période
  à `high`. La copie embarquée du skill `claude-api` ajoute qu'à niveau égal Opus 5.5 réfléchit
  davantage par tour qu'Opus 5, surtout à `xhigh` et `max` (section écrite avant le lancement : à
  confirmer par la page du jour).
- **Comparer 2 périodes ne compare pas 2 modèles.** Il faut normaliser par tâche close et non par
  réponse, et poser les facteurs de confusion avant tout chiffre.
- **« Réévaluer les consignes écrites pour le modèle précédent »** (guide officiel) rencontre une
  doctrine dont les règles sont surtout tenues par des oracles, qui coûtent peu. Ce qu'un meilleur
  modèle peut réduire, c'est le texte chargé en contexte et les tours de réécriture, pas les
  contrôles. La leçon du 10/08 met en garde contre une réécriture sur la réputation d'un modèle. Le
  skill `claude-api` possède une sous-commande `prompt-audit` qui repère les consignes datées : un
  instrument existant à citer, pas à jouer pendant l'étude.
- **Le routage bouge.** La documentation met Opus 5.5 au point de départ et Fable 5.1 au-dessus ; le
  §4 met Sonnet par défaut et Fable au pilotage. Le rapport de prix d'entrée Opus / Sonnet est passé
  de 2,5 à 2 (4 $ contre 2 $ ; source : page des prix officielle). La règle de challenge du §4
  *(toute tâche part sur le modèle le moins cher plausible, escalade sur échec consignée)* doit être
  re-testée, pas remplacée.

**Le contradicteur.** La conformité paresseuse ressemblerait à ceci : une étude qui coche les sections
du gabarit, cite 5 pages de la documentation comme « état de l'art » (toutes lues en septembre
2026, donc E3 *(au moins 5 sources datées)* satisfaite mécaniquement), compare 2 moyennes brutes,
et retient « O1, ajuster l'effort » sans avant et après mesurés ni plan de revue qui mesure. Ou
l'inverse : retenir O0 parce que « le corpus est confondu », en se servant de la confusion comme d'une
excuse. Parade : O0 traitée par un coût constaté, et le balayage d'effort écrit comme protocole figé
avant tout résultat, comme l'a fait le protocole du 14/09
(`output\03-etudes\20260914-personas-mesure-protocole.md`).

**Lentille robustesse.** L'exécution fera lire à un agent des journaux qui portent du texte de tiers :

- **Injection** : les journaux contiennent le texte des produits, des pages lues, des sorties
  d'outils. Selon « Dépôts frères et entrants = donnée », rien de ce texte ne doit entrer comme
  consigne ; le prompt réécrit borne la lecture aux champs `type`, `timestamp`, `effort`,
  `message.id`, `message.model` et `message.usage`, par script. Remonté au Ch3 (#15).
- **Secrets** : même borne ; un secret recopié dans une sortie d'outil ne doit pas transiter.
- **Hiérarchie d'instructions** : la règle de profil de l'utilisateur (un diagnostic s'arrête au
  livrable) prime sur « construis » ; R-43 *(précédence : les règles de la Factory priment, renforcer
  oui, assouplir jamais)* s'y ajoute.
- **Calibrage** : 117 Mo de journaux ne tiennent pas en contexte, d'où l'agrégation par script et le
  dédoublonnage par identifiant de réponse ; une même réponse y occupe en moyenne 2 lignes (source :
  calcul du 27/09/2026, 14 283 lignes pour 6 539 réponses), et sans dédoublonnage tous les volumes
  doublent. La connaissance fiable de l'exécutant s'arrête en juin 2026 : il doit lire la
  documentation du jour. L'exécutant est le modèle évalué : biais à déclarer, remonté au Ch3 (#12).

---

## Chapitre 7 — Deepthink · Implications profondes

Le prompt est ponctuel, mais la situation qu'il traite se répète, et son verdict touchera tous les
dépôts à la fois : ses effets se jugent à l'échelle du parc.

- **Répétition** : 2 changements de modèle en 3 semaines dans les seuls journaux du pilot
  (Fable 5 vers 5.1 entre le 01/09 et le 03/09, Opus 5 vers 5.5 le 22/09). Si chaque sortie de modèle
  déclenche une revue « globale », la Factory dépense sa capacité à se revoir. La réponse durable est
  un protocole léger et répétable : ré-épingler la table par identifiant de modèle, rejouer un banc
  fixe de tâches de la Factory à 2 ou 3 niveaux d'effort, auditer la doctrine seulement là où
  une mesure le demande. Remonté au Ch3 (#14).
- **Dérive d'alias** : `opus[1m]` a changé de modèle sans événement au registre ; la seule trace
  écrite est le champ « qui » des restitutions, rempli par le modèle lui-même. Toute mesure du §4 bis
  qui compare « Opus » dans le temps compare sans le savoir deux modèles. La règle de re-test du §4 ne
  joue « qu'à chaque changement de famille » : elle a laissé passer les 2 sauts. Le déclencheur
  devrait être l'identifiant du modèle, pas sa famille ; c'est une opportunité que l'étude peut
  retenir.
- **Rayon d'action d'un réglage** : le modèle et l'effort sont réglés au niveau de l'utilisateur,
  donc pour les 24 dossiers de projets présents sous `~/.claude/projects` (pilot, forges, produits).
  Un changement d'effort s'applique à tout le parc d'un coup : raison de ne rien régler pendant
  l'étude, et de prévoir un déploiement par étapes (un dépôt, une classe de tâches).
- **Doctrine de compensation** : les règles S1 à S53 du gabarit de restitution sont nées pour la
  plupart d'un défaut de sortie d'un modèle. Si Opus 5.5 rapporte vraiment plus clairement
  (déclaration de l'éditeur), la part des refus au hook de fin de tour doit baisser à effort égal :
  c'est une prédiction réfutable, que l'étude peut poser. Si la part ne baisse pas, la doctrine ne
  dépend pas du modèle, et l'alléger serait une erreur.
- **Autoréférence** : une étude écrite par Opus 5.5 qui recommande Opus 5.5 n'a de crédit que par ses
  chiffres. La règle de la Factory, « livrable accepté sur le seul verdict d'un oracle exécuté »,
  s'étend ici : le verdict s'appuie sur des mesures, jamais sur l'avis du modèle sur lui-même.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt passe de **24 à 88/100** (projeté). Le gain vient de 3 choses : l'état réel mesuré avant
d'écrire, des différences sourcées et rangées selon qu'elles touchent ou non la Factory, et un objet
borné par la mesure plutôt que par le mot « global ».

### 8.1 Score avant → après

Une ligne par dimension ; la colonne « Levier » renvoie au défaut du Ch3 qui explique le gain.

| Dimension | Avant | Après | Levier |
|---|---|---|---|
| Clarté de l'intention | 9 | 18 | objet défini : un passage constaté, une carte des opportunités, un verdict (#1, #2) |
| Spécification | 4 | 17 | gabarit, emplacement, lecteur, métrique par axe (#5, #8) |
| Garde-fous & contraintes | 1 | 14 | interdits de modification et de dépense, lecture des journaux bornée (#10, #15) |
| Ancrage / contexte | 5 | 14 | ÉTAPE 0 mesurée, sources officielles datées, corpus désigné (#2, #3, #6) |
| Vérifiabilité de la sortie | 2 | 13 | oracle E1-E10 et contrat C1-C12 *(12 critères d'acceptation embarqués dans le prompt)* |
| Robustesse | 3 | 12 | facteurs de confusion, biais d'auto-évaluation, table entière (#6, #7, #12) |
| **Total** | **24** | **88** | |

### 8.2 Diagnostic en 3 lignes

- Force : l'intention, tirer parti du nouveau modèle pour une Factory plus rapide et plus sûre, est
  claire et légitime.
- Faiblesse bloquante : le prompt prépare un passage déjà fait, sur un objet « global » qu'aucune
  étude ne peut trancher en une option.
- Faiblesse majeure : il ne dit ni où prendre les différences ni comment mesurer, alors que la
  documentation du jour et un corpus de mesure complet sont à portée.

### 8.3 Prompt réécrit (prêt à coller)

```text
Produis une étude d'opportunité : « Le passage d'Opus 5 à Opus 5.5 : que faut-il changer dans
la Factory et ses forges pour gagner en rapidité, en coût et en qualité, et que faut-il garder ? »
Tu écris UN seul fichier ; tu ne modifies rien d'autre.

INTENTION (à citer telle quelle en section « Intention de l'utilisateur », marquée « à valider »)
« Par rapport aux différences entre Opus 5 et Opus 5.5, construis une étude d'opportunités sur
le fait de revoir le fonctionnement global de la Factory et des forges pour améliorer son
fonctionnement, ses process, ses performances, sa qualité et sa rapidité. »
Lecture reconstruite, à valider : savoir si le nouveau modèle permet à la Factory de faire le
même travail plus vite, avec moins de jetons et moins de reprises, et quels mécanismes
(routage, effort, doctrine chargée en contexte, hooks, boucles de vérification) changer pour en
tirer parti, sans affaiblir ce qui tient la qualité.

ÉTAPE 0 — PRÉREQUIS D'ACCÈS ET ÉTAT RÉEL (lecture seule, avant toute rédaction)
1. Réglages : relever la clé "model" et les "modelSettings" de ~/.claude/settings.json, la
   variable CLAUDE_CODE_EFFORT_LEVEL, et l'ordre de précédence de l'effort donné par
   https://code.claude.com/docs/en/model-config. Relevé du 27/09/2026 à reconfirmer :
   "opus[1m]" résolu en Opus 5.5 ; effort "max" par la variable, qui prime sur "xhigh".
2. Journaux de session du pilot (~/.claude/projects/c--dev-digit-ai-factory/*.jsonl) : par
   script, lire UNIQUEMENT les champs type, timestamp, effort, message.id, message.model et
   message.usage ; dédoublonner par message.id (une réponse occupe plusieurs lignes) ; dater
   la bascule (dernière réponse claude-opus-5, première claude-opus-5-5) et relever l'effort de
   chaque période. Aucun contenu de message n'entre dans le contexte ni dans l'étude.
3. Facturation (forfait ou jetons) : la relever si elle se mesure, sinon la déclarer inconnue et
   exprimer les coûts en jetons.
4. Sources officielles : pour chaque page, consigner le code de retour et l'heure de lecture.
   https://platform.claude.com/docs/en/about-claude/models/overview
   https://platform.claude.com/docs/en/about-claude/pricing
   https://platform.claude.com/docs/en/models/opus-5-5/migration-guide
   https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5
   https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
   https://platform.claude.com/docs/en/build-with-claude/effort
   Contrôle positif : la vue d'ensemble, lue avec la même identité. Familles de repli, dans
   l'ordre : la documentation de Claude Code, puis la copie embarquée du skill claude-api,
   déclarée datée (cache du 24/06/2026, écrite avant le lancement). Si aucune famille ne
   répond : ne rien compléter de mémoire ; conduire l'étude sur le seul corpus interne, dire ce
   que ce repli ne permet plus de juger (les capacités déclarées), et demander à l'humain s'il
   rouvre l'accès réseau ou accepte ce périmètre.

DIFFÉRENCES : 3 FAMILLES, TRAITÉES À PART
- (A) Surface de requête de l'interface de programmation (réflexion non désactivable,
  tool_choice forcé refusé, blocs de réflexion liés au modèle, boîte à outils d'usage de
  l'ordinateur) : inventorier les appels directs dans le code des 15 dépôts digit-ai-* (relevé
  du 27/09 : aucun, une fixture de test). Inventaire vide = famille déclarée sans objet en une
  ligne.
- (B) Réglages du harnais et prix : alias, effort par défaut (medium) et effort en service,
  fenêtre de contexte, prix par million de jetons de chaque modèle de la table (entrée, sortie,
  écriture et relecture du cache), appliqués au mélange réel de jetons de la Factory, où la
  relecture du cache domine.
- (C) Capacités déclarées par l'éditeur (jetons par tâche, revue de code, sources citées,
  lecture visuelle, clarté des rapports) : chacune est une HYPOTHÈSE citée avec sa page et sa
  date de lecture, jamais un fait sur la Factory.

LES 5 AXES : UNE MÉTRIQUE ET UNE SOURCE CHACUN
- rapidité : durée d'un tour et d'une restitution (horodatages des journaux ; champ « quand »
  des restitutions d'output\04-plans) ;
- performances : jetons de sortie, de cache lus et de cache écrits PAR TÂCHE CLOSE, pas par
  réponse (journaux ; tables de campagne de BOUCLE-AMELIORATION.md) ;
- qualité : part des restitutions acceptées au premier passage du hook de fin de tour
  (.claude\hooks-journal.jsonl : verdicts PASS, FAIL, AVERTISSEMENT par session), retours
  humains, insatisfactions\REGISTRE.jsonl ;
- process : coût en temps des étapes, gates et hooks (garde avant envoi, ouverture de
  session, boucles d'oracles) ;
- fonctionnement : table de routage (CONTRAT-INTERFACE.md §4) et volume de doctrine chargé en
  contexte à l'ouverture d'une session, en jetons.

MESURE : CE QUE LE CORPUS PERMET, ET CE QU'IL NE PERMET PAS
- Comparer la période Opus 5 et la période Opus 5.5 sur le corpus existant, avec un tableau des
  facteurs de confusion : effort (toutes les réponses d'Opus 5 à high, l'essentiel d'Opus 5.5 à
  max au relevé du 27/09), tâches, doctrine qui grossit, longueur des sessions, taille de
  l'échantillon Opus 5.5.
- Aucune conclusion causale sur ces seules données : toute phrase « Opus 5.5 fait mieux ou moins
  bien » renvoie au plan de rejeu contrôlé.
- Le rejeu contrôlé (mêmes tâches, modèles et niveaux d'effort croisés, « tranches comparables »
  de CONTRAT-INTERFACE.md §4 bis) est ÉCRIT comme plan, protocole figé avant tout résultat sur le
  modèle de output\03-etudes\20260914-personas-mesure-protocole.md. Il n'est PAS exécuté : il
  consomme des jetons, c'est une dépense qui attend un feu vert humain.
- Section « Biais d'auto-évaluation » : l'exécutant est Opus 5.5 et juge son propre gain ; le
  verdict ne s'appuie que sur des mesures.

PORTÉE
- Cœur : Opus 5 → Opus 5.5.
- Obligatoire aussi : la table de routage entière (Fable 5.1, Opus 5.5, Sonnet 5, Haiku 4.5), car
  la documentation recommande Opus 5.5 comme point de départ et Fable 5.1 au-dessus, quand le §4
  met Sonnet par défaut et Fable au pilotage.
- « Fonctionnement global » : n'entrent dans l'étude que les mécanismes qu'une différence des
  familles B ou C touche ET qu'une mesure relie à un goulot constaté. Les autres tiennent chacun
  en une ligne « hors étude », avec leur critère de réouverture.

GABARIT, ORACLE, EMPLACEMENT
- Suivre gabarits\ETUDE-OPPORTUNITE.md section par section.
- Le pluriel « opportunités » se traite ainsi : une carte des opportunités (une ligne chacune :
  différence en cause, mécanisme touché, mesure, gain attendu dans l'unité de la métrique,
  candidature proposée), puis des options O0-O4 bâties comme des PAQUETS d'opportunités, puis
  UNE option retenue.
- Non-recouvrement, une citation par ligne : CONTRAT-INTERFACE.md §4 et §4 bis ;
  BOUCLE-AMELIORATION.md, campagne du 10/08/2026 (« faut-il une passe Opus 5 ? » : non aux
  réécritures, oui aux défauts mesurés) ;
  output\03-etudes\20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.md ; le
  protocole de mesure du 14/09 ; les sous-commandes prompt-audit et migrate du skill
  claude-api ; todo\TODO.jsonl (aucun candidat sur ce sujet au 27/09/2026, à reconfirmer).
- Section « Répétabilité » : comment le verdict s'appliquera au prochain changement de modèle
  (2 en 3 semaines : Fable 5 → 5.1 début septembre, Opus 5 → 5.5 le 22/09), et pourquoi
  la règle de re-test du §4, qui ne joue « qu'à chaque changement de famille », n'a pas joué.
- Livrable : output\03-etudes\20260927-etude-opportunite-saut-opus-5-5.md (date du jour si
  l'étude est jouée un autre jour).
- Remise conditionnée à : node oracles\oracle-etude-opportunite.mjs <livrable> → PASS (E1-E10).

INTERDITS
- Modifier un réglage (modèle, effort, variable d'environnement), la table de routage, un
  gabarit, une règle, un hook, un CLAUDE.md ou le registre todo\ ; enregistrer dans git ;
  pousser.
- Lancer un rejeu, un balayage d'effort ou une session de comparaison.
- Citer le contenu d'un message des journaux.
- Présenter une déclaration de l'éditeur comme un fait mesuré sur la Factory.
L'étude se termine par les candidatures proposées et une question à l'humain :
« tu veux que j'ouvre ces candidatures ? ».

FORME
- Lecteur : l'humain qui décide, qui n'a pas lu la documentation des modèles.
- Chaque section ouvre par ce que le lecteur va apprendre ; chaque tableau dit comment le lire ;
  chaque identifiant (TF-, R-, E, O, §) est glosé à sa première occurrence ; chaque chiffre
  porte sa source et sa date.
- Coût sur l'échelle complexité × durée de la Factory, jamais en jours.

CONTRAT DE SORTIE (vérifié point par point avant remise)
C1  oracle-etude-opportunite.mjs rend PASS (E1-E10).
C2  L'intention est citée mot pour mot, marquée « à valider », avec la lecture reconstruite.
C3  L'ÉTAPE 0 figure, datée : modèle résolu, effort et sa source, effort de chaque période,
    date de bascule, facturation (ou « inconnue »), code de retour de chaque page lue.
C4  Chaque différence est rangée en A, B ou C ; A tient en une ligne si l'inventaire est vide.
C5  Chacun des 5 axes a sa métrique, sa source et sa valeur pour chaque période.
C6  Le tableau des facteurs de confusion figure ; aucune phrase n'attribue un écart au modèle
    sans renvoyer au plan de rejeu.
C7  Chaque ligne de la carte des opportunités cite une différence (B ou C) ET une mesure.
C8  La table de routage entière est examinée ; la recommandation officielle est citée et datée.
C9  Une seule option retenue ; O0 réfutée ou retenue par un coût constaté ; plan de revue daté.
C10 Le plan de rejeu contrôlé est écrit (tâches, modèles, niveaux d'effort, métriques, critère
    d'arrêt) et marqué « non exécuté, feu vert de dépense requis ».
C11 Les sections « Biais d'auto-évaluation » et « Répétabilité » sont présentes.
C12 Aucun fichier modifié par cette session hors du livrable (git status comparé avant et
    après) ; empreinte de ~/.claude/settings.json identique avant et après ; aucun contenu de
    message de journal cité.
Si un point échoue après 3 passes de correction, remettre avec la liste des écarts restants.
```

### 8.4 Contrat de sortie (rappel)

Les 12 critères C1-C12 sont embarqués dans le prompt. Ils sont tous binaires : un oracle exécuté
(C1), une présence vérifiable par lecture (C2 à C11), un état du dépôt et des réglages vérifiable par
`git status` et par empreinte (C12).

### 8.5 Changelog tracé

Chaque ligne relie un ajout du prompt réécrit au défaut qu'il ferme ; la lecture va de l'ajout vers sa
justification, dans l'ordre du prompt.

| Ajout | Défaut fermé |
|---|---|
| Titre en question, « un seul fichier » | Ch3 #1 (bloquant) · #10 · Ch5 #3 |
| Intention citée, lecture reconstruite à valider | Ch3 #9 |
| ÉTAPE 0 : réglages, bascule, effort par période, facturation, sources avec code de retour, contrôle positif, replis | Ch3 #2 (bloquant) · #3 · #16 · Ch4 |
| 3 familles de différences ; A sans objet si l'inventaire est vide ; prix appliqués au mélange réel | Ch3 #4 · #13 · Ch5 #1 · Ch6 expert |
| 5 axes, une métrique et une source chacun | Ch3 #5 · Ch2 (recouvrement de « performances ») |
| Mesure : facteurs de confusion, pas de causalité, rejeu écrit en plan | Ch3 #6 · Ch5 #2 · Ch6 expert |
| Section « Biais d'auto-évaluation » | Ch3 #12 · Ch6 lentille · Ch7 autoréférence |
| Portée : table entière ; « global » borné aux mécanismes touchés ET mesurés | Ch3 #1 · #7 · Ch5 #5 |
| Gabarit, carte, paquets O0-O4, verdict unique, oracle, emplacement | Ch3 #1 · #8 · #19 · Ch5 #4 |
| Non-recouvrement nommé | Ch3 #11 |
| Section « Répétabilité » | Ch3 #14 · Ch7 |
| Lecture des journaux bornée aux champs, par script, dédoublonnée | Ch3 #15 · Ch6 lentille |
| Interdits (réglages, doctrine, registre, git, rejeu) | Ch3 #10 · #18 · Ch5 #3 |
| Forme et échelle de coût | Ch3 #17 |
| Contrat C1-C12 | vérifiabilité (Ch1) |

### 8.6 Écarts à la lettre

Vous avez écrit une demande ; le prompt réécrit s'en écarte aux 10 endroits ci-dessous. Chaque ligne
est à valider séparément : un écart non validé ne doit pas passer avec le reste. 3 d'entre eux
changent le périmètre et méritent une lecture attentive : le n° 3 l'élargit, les n° 4 et 8 le
restreignent.

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « Par rapport aux différences entre Opus 5 et Opus 5.5 » | les différences de la documentation officielle du jour, datées, rangées en 3 familles ; celle de l'interface de programmation déclarée sans objet si le parc ne l'appelle pas | une différence non datée ou sans prise sur la Factory ferait une étude hors sujet (Ch3 #3, #4) |
| 2 | (implicite : un passage à préparer) | la revue d'un passage fait le 22/09, mesurée sur l'état réel | le passage est en service depuis 5 jours (Ch3 #2) |
| 3 | « Opus 5 et Opus 5.5 » | cœur Opus 5 → 5.5, plus toute la table de routage (Fable 5.1, Sonnet 5, Haiku 4.5) | ÉLARGISSEMENT : la documentation déplace les frontières de la table. Refusez cet écart si vous visez Opus seul |
| 4 | « revoir le fonctionnement global de la Factory et des forges » | seuls les mécanismes touchés par une différence ET reliés à un goulot mesuré ; les autres listés « hors étude », avec critère de réouverture | RESTRICTION : une revue globale ne se tranche pas en une option (Ch3 #1) |
| 5 | « améliorer son fonctionnement, ses process, ses performances, sa qualité et sa rapidité » | 5 axes gardés, chacun défini par une métrique et une source ; « fonctionnement » lu comme routage et doctrine chargée | sans métrique, un axe ne se mesure pas et 2 axes comptent le même gain (Ch2) |
| 6 | « une étude d'opportunités » | une carte des opportunités, des options O0-O4 en paquets, une seule retenue | le gabarit exige un verdict unique (E5) |
| 7 | « construis » | « produis une étude » : un seul fichier écrit, rien d'autre modifié | une étude s'arrête avant la décision ; votre règle de profil le demande |
| 8 | (rien) | le rejeu contrôlé écrit en plan, non exécuté | RESTRICTION : c'est une dépense, soumise à votre feu vert ; sans lui, le verdict peut être « mesurer d'abord » |
| 9 | (rien) | sections « Biais d'auto-évaluation » et « Répétabilité » | AJOUT : l'exécutant est le modèle évalué ; 2 changements de modèle en 3 semaines (Ch6, Ch7) |
| 10 | (rien) | intention reconstruite, à valider | règle E9 : une intention reconstruite se valide par son auteur |

### 8.7 Protocole de tests du livrable

Le livrable est un document texte (Markdown) jugé par des oracles existants ; le protocole est donc
court. Ce n'est pas une page HTML : les règles de socle des pages (filtres de tableau et garde-fous de
leur composant) sont sans objet.

- **Oracles** : `oracle-etude-opportunite.mjs` (E1-E10) ; `check_markdown.py` du socle
  `digit-ai-page-html` pour la lisibilité (M7 *(ouverture de section)*, M10 *(mode de lecture des
  tableaux)*, M14 *(plomberie et marqueurs de travail)*, M18 *(identifiant glosé)*) ;
  `oracles\oracle-ecriture.mjs` pour les règles d'écriture E-1 à E-14 de `references\ECRITURE.md`
  (à ne pas confondre avec E1-E10 de l'oracle d'étude) ; `git status` et une empreinte de
  `~/.claude/settings.json` pour C12.
- **Jeu d'essai minimal** : (1) cas nominal : documentation en 200, journaux lisibles, 2 périodes
  présentes ; (2) cas limite : documentation injoignable, l'étude le déclare daté, se replie sur la
  copie embarquée et retire la famille C du verdict ; (3) cas limite : aucun écart mesurable entre
  les périodes, ou période Opus 5.5 jugée trop courte, O0 ou « mesurer d'abord » est alors retenu
  plutôt qu'une option sans matière.
- **Boucle bornée** : générer, confronter à C1-C12, corriger ; 3 itérations au plus, puis remise avec
  la liste des écarts restants. Si le skill `la-boucle` est présent dans l'environnement d'exécution,
  il porte l'itération au lieu d'une boucle réécrite à la main.
