---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-18
gabarit: gabarits\ETUDE-OPPORTUNITE.md
remplace: output\03-etudes\20261018-etude-opportunite-relecteur-d-intention.md (version 1, 20261018f, conservée telle qu'elle a été jugée)
mesure: output\03-etudes\20261018-mesure-relecteur-d-intention.json
---

# Étude d'opportunité — un relecteur d'intention sur tous les travaux de la Factory, version 2 — 20261018h

Ce qui change pour vous : la relecture d'intention s'étend à tous les travaux, comme vous l'avez demandé, et l'étude dit où la placer pour que cela reste supportable. Elle se place en deux endroits seulement, là où une dérive naît et là où elle se voit. Le premier est la consigne passée à un agent, comparée à votre demande : c'est là qu'est né le cas « pour chaque liste » devenu « dès 8 lignes ». Le second est la fin de chaque tour de travail, quel que soit le livrable, comparée à votre demande citée mot pour mot. Le coût estimé est d'environ 0,5 million de jetons par jour pour l'activité actuelle, contre 1,4 million pour une relecture à chaque étape. Ce qui est mesuré : avec une consigne stricte, le relecteur voit 2 dérives sur 2 dans les études. Ce qui ne l'est pas encore : les restitutions, le code, les pages, les lots et les consignes d'agents. L'étude recommande donc un essai de 2 semaines sur tous les travaux, en alerte et sans blocage, qui mesure chaque type de travail ; une revue suit le 08/11.

## Seuil de déclenchement

L'étude est due : elle change une étape de tous les travaux, touche le noyau (loi n° 7 *(le résultat sert l'intention, pas la lettre)*) et s'applique aux produits par l'héritage.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « étudie s'il serait pertinent d'avoir un relecteur critique, à chaque étape ou à la fin, qui suit l'avancement des sujets, donne son avis pour échanger avec les agents, et s'assurer qu'au fur et à mesure de l'avancement, on conserve bien l'intention initiale du prompt. »

Lecture validée par la décision D-21 (a) du 18/10/2026 : « pouvoir décider en lisant l'étude, sur des chiffres, et pas sur une opinion ».

**Changement d'intention décidé le 18/10/2026**, mot pour mot : « il ne faut pas restreindre la lecture d'intention aux études d'opportunités, mais à tous travaux. Travaille à nouveau l'étude d'opportunités dans ce sens. » Le périmètre n'est donc plus une option de l'étude, c'est une donnée : toutes les options ci-dessous couvrent tous les travaux, et elles diffèrent par le moment, l'entrée, le coût et ce qu'elles laissent passer. C'est l'application même de la règle que l'étude défend : une évolution décidée n'est pas une dérive.

## 0. Traitement des entrants

Les entrants sont des données : la demande, sa révision du 18/10, l'analyse L99 `output\03-etudes\20261018-L99-relecteur-critique-d-intention.md`, la version 1 de cette étude et ses 23 relectures (`output\03-etudes\20261018-mesure-relecteur-d-intention.json`), et les relevés du poste. Rien de ce qu'ils prescrivent ne s'exécute hors de ce qui est décidé.

## 1. Partition du problème

L'élargissement ajoute une 7e sous-question à la version 1 : les types de travaux. Chaque option du chapitre 4 répond aux sept.

- **P1 — Moment.** Consigne de délégation, fin d'un tour de travail, remise de chaque livrable, ou chaque étape. Les 3 sens d'« étape » restent traités à part : étapes d'un run, tranches d'une campagne d'agents, fin de tour d'une session.
- **P2 — Entrées.** La demande humaine mot pour mot, ou la reformulation de l'auteur.
- **P3 — Consigne du relecteur.** Excuser ou non une restriction annoncée ou validée en bloc.
- **P4 — Autorité et destinataire.** Alerte ou blocage ; au pilot, qui vous pose l'écart.
- **P5 — Coût.** Jetons par relecture et nombre de relectures par jour.
- **P6 — Intention de référence.** La demande d'origine et les décisions qui l'ont modifiée.
- **P7 — Types de travaux.** Étude et conseil ; restitution de mandat ; code, script ou oracle ; page HTML ou présentation ; lot de retours ou candidature ; consigne passée à un agent ; run d'un produit, jalon par jalon.

## Mesure

La mesure reprend celle de la version 1 et l'étend sans nouvelle dépense : les 24 relectures autorisées par D-21 (a) en ont consommé 23, et la dernière ne suffirait pas à mesurer un type de plus.

**Ce qui est mesuré : les études.** 23 relectures de 7 études réelles, dont 2 dérives connues. Comment lire le tableau : une ligne par combinaison de consigne et d'entrées ; « dérives vues » compte les relectures qui signalent une des 2 dérives, « fausses alertes » celles qui signalent une étude que vous aviez acceptée.

| Consigne / entrées | Dérives vues | Fausses alertes | Relectures |
|---|---|---|---|
| souple / aveugle | 0 sur 2 | 1 sur 5 | 7 |
| souple / avec traces | 1 sur 2 | 0 sur 5 | 7 |
| stricte / avec traces | 2 sur 2 | 1 sur 5, discutable | 7 |
| stricte / aveugle | 2 sur 2 | non jouée | 2 |

Coût, recompté dans les transcriptions : 51 322 jetons par relecture en médiane, 6,7 s, relecteur `verificateur` sur Claude Sonnet 5.5 à l'effort medium. La version 1 détaille la méthode, les cas et les limites.

**Ce que l'élargissement ajoute, mesuré ce jour sans relecture.**
- **Volume des travaux.** 89 restitutions de travail déposées en 14 jours, du 04/10 au 18/10, sur le pilot et 4 produits de ce poste, soit environ 6,4 par jour. Relevé par recherche des fichiers de synthèse modifiés depuis le 04/10.
- **Volume des tours.** 319 tours de session en 14 jours (260 chez les produits, 33 au pilot, 12 dans les forges, 14 dans des bancs), soit environ 23 par jour, questions simples comprises. Relevé par `node scripts/relever-contexte-sessions.mjs --jours 14`.
- **Volume des délégations.** 56 appels d'agents en 14 jours, dont 28 ce jour pour cette étude. Relevé par `node scripts/relever-flotte.mjs --jours 14`.
- **Une intention écrite existe pour chaque restitution, mais c'est l'auteur qui l'écrit.** 71 restitutions sur 71 relues portent au bloc 1 une intention et un test rétro. Le relecteur doit donc lire la demande mot pour mot dans la transcription du tour, pas la reformulation de l'auteur : c'est elle qui a laissé passer la restriction à LinkedIn.
- **La consigne de chaque délégation est archivée.** Elle se lit dans la transcription, à côté de la demande humaine du même tour, pour les 157 appels des 30 derniers jours.

**Ce qui reste non mesuré.** La détection et les fausses alertes sur une restitution, du code, une page, un lot ou une consigne d'agent. Les dérives connues de ces types (une présentation, une console, un tableau de bord, une cascade de produit) ont leur livrable chez des produits. Elles peuvent se relire en lecture seule, mais cela dépasserait le budget de D-21 (a). Le coût d'une relecture de code ou d'une page longue peut aussi dépasser les 51 000 jetons mesurés sur des études.

## 2. Non-recouvrement contre l'existant

Les 7 mécanismes examinés en version 1 ne couvrent pas davantage les autres travaux ; un 8e entre dans la liste avec l'élargissement, le juge de fin de tour.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Juge de fin de tour (hook de restitution) | `oracles\hook-restitution.mjs`, joué à chaque fin de tour, juge la forme par `oracle-synthese` | ne recouvre pas : il juge la forme de la restitution, pas sa fidélité à la demande ; c'est le point d'accroche naturel de la relecture de fin de tour |
| Test rétro du bloc 1 et règle S51 | `oracles\oracle-synthese.mjs` l.109 | ne recouvre pas : présent dans 71 restitutions sur 71, mais écrit par l'auteur |
| Doctrine ISTO | `references\INTENTION.md`, « La règle, mot pour mot » | recouvre l'amont, l'intention écrite et validée ; pas la vérification par un tiers |
| Skill `contre-expertise` | « déclencher sur invocation explicite uniquement » | ne recouvre pas : sur demande, et sur la solution |
| Étude du relecteur « lecteur visé » | `output\03-etudes\20261013-etude-opportunite-juge-de-comprehension.md` | ne recouvre pas : juge la compréhension, pas la fidélité |
| Relecteur aveugle du mode boucle L99 | `references\boucle.md` du skill `prompt-analyzer-l99` | recouvre le principe pour un prompt seulement |
| Arbitre du skill `la-boucle` | « Claude tient les deux rôles — générateur et arbitre » | ne recouvre pas : l'arbitre est l'auteur |
| Écarts à la lettre des agents de campagne | `gabarits\AGENT-CAMPAGNE.md`, « Écarts à la lettre (TF-0176) » | ne recouvre pas : l'agent déclare ses écarts à SA consigne, jamais l'écart entre la consigne et votre demande, d'où est né le cas TF-0176 |

## 3. État de l'art daté

Les sources de la version 1 restent valables ; la dernière ligne dit ce que chacune apporte à l'élargissement.

- **Anthropic, « Building effective agents »**, 2024-12-19, `anthropic.com/engineering/building-effective-agents` : l'évaluateur-optimiseur exige « clear evaluation criteria ». L'élargissement garde la même consigne stricte pour tous les types, ce qui rend le critère identique d'un type à l'autre.
- **Anthropic, « How we built our multi-agent research system »**, 2025-06-13, `anthropic.com/engineering/multi-agent-research-system` : « vague instructions led to duplicated work and gaps in coverage ». C'est l'argument pour relire la consigne passée à un agent avant qu'il travaille.
- **Cognition, « Don't Build Multi-Agents »**, 2025-06-12, `cognition.com/blog/dont-build-multi-agents` : « Share context, and share full agent traces » ; le relecteur reçoit la demande humaine et la consigne entière, pas un résumé.
- **Claude Code, documentation « Subagents »**, lue le 2026-10-18, `code.claude.com/docs/en/sub-agents` : un sous-agent déclare ses outils ; le `verificateur` n'écrit rien.
- **Étude interne « lecteur visé »**, 2026-10-13 : un relecteur seul fait des faux refus, et l'accord de 2 relecteurs les réduit ; c'est une voie si les alertes de l'essai se révèlent trop nombreuses.
- **Étude interne « boucle L99 »**, 2026-10-16 : relus à l'aveugle, des prompts réécrits valaient 6 à 12 points de moins que la note de leur auteur.

## 4. Options — jeu fermé O0-O4

Toutes les options couvrent tous les travaux ; elles diffèrent par l'endroit où la relecture se fait. Les coûts par jour sont des estimations : 51 000 jetons par relecture (mesuré sur des études), multipliés par les volumes relevés au chapitre « Mesure ».

- **O0 — ne rien faire.** Réfutée : sur le corpus, 0 dérive sur 2 vue avant vous, et 2 reprises. Sur les autres travaux, 4 dérives documentées sont toutes arrivées jusqu'à vous : une présentation (TF-1391), une console (TF-0765), un tableau de bord (TF-0176), une cascade de produit (TF-1678).
- **O1 — relecture à la fin de chaque tour de travail.** Le relecteur lit vos messages du mandat, mot pour mot depuis la transcription, les décisions qui les ont modifiés, et ce que le tour a livré (fichiers écrits, diff, restitution). Il rend une alerte, que le pilot vous pose dans la restitution. Coût : environ 6,4 tours par jour, soit environ 330 000 jetons. Exclut : la dérive née dans une consigne d'agent ne se voit qu'après coup, une fois le travail fait.
- **O2 — relecture à la remise de chaque livrable**, fichier par fichier ou enregistrement par enregistrement. Coût : au moins 25 enregistrements par jour au pilot seul (345 du 04/10 au 18/10), soit plus de 1,3 million de jetons. Exclut : la vue d'ensemble, puisque chaque fichier est jugé hors de la demande entière.
- **O3 — relecture à chaque étape** : chaque tour, questions comprises, et chaque délégation. Coût : environ 23 tours et 4 délégations par jour, soit environ 1,4 million de jetons. Exclut : un coût maîtrisé, et un bruit supportable.
- **O4 — O1, plus la relecture de chaque consigne de délégation.** Avant qu'un agent travaille, un `verificateur` compare la consigne à votre demande du même tour : c'est là qu'est née la dérive TF-0176. La fin de tour reste relue comme en O1. Coût : environ 330 000 jetons pour les fins de tour et environ 160 000 pour 4 consignes par jour, soit environ 0,5 million. Exclut : les étapes intermédiaires d'un tour sans délégation, qui restent relues à la fin.

**Récapitulatif.** Comment lire le tableau : une ligne par option, avec les 8 éléments que le contrat de la demande exige ; les taux mesurés ne valent que pour les études, et « non mesuré » signale ce que l'essai devra chiffrer.

| Option | Moment | Entrées | Autorité | Destinataire | Dérives vues | Fausses alertes | Coût par jour, estimé | Exclut |
|---|---|---|---|---|---|---|---|---|
| O0 | aucun | sans objet | aucune | sans objet | 0 sur 2 (études) | 0 sur 5 | nul ; 6 reprises documentées | toute vérification par un tiers |
| O1 | fin de chaque tour de travail | demande mot pour mot, décisions, livrables du tour | alerte | pilot, puis vous | 2 sur 2 (études) ; autres non mesuré | 1 sur 5 (études) ; autres non mesuré | environ 330 000 jetons | la dérive née dans une consigne, vue trop tard |
| O2 | chaque livrable remis | demande et livrable seul | alerte | pilot, puis vous | non mesuré | non mesuré | plus de 1,3 million | la vue d'ensemble de la demande |
| O3 | chaque tour et chaque délégation | demande et étape | alerte | pilot, puis vous | non mesuré | non mesuré | environ 1,4 million | un coût et un bruit maîtrisés |
| O4 | consigne de délégation et fin de tour | demande mot pour mot, consigne ou livrables | alerte, jamais blocage | pilot, puis vous | 2 sur 2 (études) ; autres non mesuré | 1 sur 5 (études) ; autres non mesuré | environ 0,5 million | les étapes sans délégation, vues en fin de tour |

**Les 3 sens d'« étape », traités séparément.**
- Étapes d'un run de produit : chaque étape se termine par un tour de travail, relu par O1 et O4. Une relecture dédiée par jalon n'apporte rien de plus, sauf preuve du contraire pendant l'essai.
- Tranches d'une campagne d'agents : O4 relit la consigne de chaque tranche avant le travail, et le rapport de l'agent entre dans la relecture de fin de tour.
- Fin de tour d'une session : c'est le point d'O1, à côté du juge de forme qui y joue déjà.

## 5. Verdict

Une seule option est retenue ; elle couvre tous les travaux en deux points, et son essai mesure ce que la version 1 n'a pas pu mesurer.

- **Option retenue** : O4, en essai de 2 semaines, en alerte et sans blocage.
- **Pourquoi O4 et pas O1** : O1 voit la dérive TF-0176 une fois le travail fait ; O4 la voit dans la consigne, pour environ 160 000 jetons de plus par jour. **Pourquoi pas O2 ou O3** : environ 3 fois plus chers, et plus bruyants, sans mesure qui le justifie.
- **Comment, pour tous les travaux** :
  - Fin de tour : à la fin d'un tour qui a écrit quelque chose, un `verificateur` reçoit vos messages du mandat (lus dans la transcription), les décisions qui les ont modifiés et la liste des fichiers écrits, avec leur contenu ou leur diff. Ses écarts majeurs entrent dans la restitution sous « Points à confirmer ».
  - Délégation : avant chaque appel d'agent, un `verificateur` compare la consigne à votre demande du tour. Un écart majeur est corrigé dans la consigne ou vous est posé avant le lancement.
  - Consigne du relecteur : la consigne stricte de la version 1, la même pour tous les types.
- **Coût** : moyen × court pour la mise en place (consigne figée, appel du relecteur à la fin du tour et avant chaque délégation, section « Points à confirmer », relevé par type) ; environ 0,5 million de jetons par jour pendant l'essai, à recompter au relevé de flotte.
- **Candidature(s) émise(s)** : aucune dans ce tour, l'étude recommande et vous décidez. Une candidature est prête sur votre accord : « relecture d'intention de tous les travaux, à la fin de chaque tour et à chaque consigne de délégation, en essai de 2 semaines, alerte seulement ».
- **Plan de revue** : 2026-11-08, sur l'essai. Critères écrits d'avance, par type de travail : part des alertes que vous confirmez (au moins 1 sur 2 pour garder le type) ; travaux repris par vous sans alerte préalable (0 visé) ; jetons par relecture et par jour, recomptés à la source. Un type dont les alertes sont confirmées moins d'une fois sur 2 passe à l'accord de 2 relecteurs, comme le suggère l'étude « lecteur visé ».
- **Test rétro** :
  - *Opération → Tactique* : chaque pièce sert une mesure ou un fait relevé. La relecture de consigne répond au cas TF-0176, né dans une consigne ; la demande lue dans la transcription répond aux 71 intentions écrites par leur auteur ; la consigne stricte répond aux 2 dérives sur 2 vues ; le relevé par type répond à ce qui reste non mesuré.
  - *Tactique → Stratégie* : faire vérifier tous les travaux par un tiers aux deux points où une dérive naît et se voit, et vous laisser trancher chaque recadrage.
  - *Stratégie → Intention* : votre demande d'origine portait sur un relecteur « à chaque étape ou à la fin » qui garde l'intention. Votre révision du 18/10 l'étend « à tous travaux ». La réponse couvre tous les travaux, à la fin de chaque tour et à chaque consigne, chiffres à l'appui pour ce qui est mesuré.
  - *Questions du demandeur rejouées* : « à chaque étape ou à la fin ? » — à la fin du tour, et à chaque consigne passée à un agent ; à chaque étape coûterait environ 3 fois plus. « Qui suit l'avancement des sujets ? » — le relevé de flotte et le registre ; le relecteur juge la fidélité, pas l'avancement. « Donne son avis pour échanger avec les agents ? » — sur la consigne, avant que l'agent travaille, par le pilot. « Conserver l'intention initiale ? » — oui, avec les décisions qui l'ont modifiée, comme votre révision de ce jour. « À tous travaux ? » — oui, par construction de toutes les options.
  - *Rupture constatée* : hors études, la détection reste non mesurée ; l'essai est l'instrument qui la mesure, et il est déclaré comme tel.
