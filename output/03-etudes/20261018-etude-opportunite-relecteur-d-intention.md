---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-18
gabarit: gabarits\ETUDE-OPPORTUNITE.md
mesure: output\03-etudes\20261018-mesure-relecteur-d-intention.json
---

# Étude d'opportunité — un relecteur critique qui garde l'intention initiale d'une demande — 20261018f

Ce qui change pour vous : un relecteur tiers est utile, mais seulement à une condition, et elle n'était pas évidente. Sur 23 relectures de 7 études réelles, un relecteur ordinaire n'a vu qu'une des 2 dérives d'intention connues : il excuse une restriction de périmètre dès que l'auteur l'annonce ou dit l'avoir fait valider. Avec une consigne stricte, qui juge ce que vous obtenez par rapport à ce que vous demandiez sans tenir compte de ces annonces, il voit les 2 dérives dans 4 relectures sur 4. Il ne lance qu'une alerte sur 5 livrables que vous aviez acceptés, et cette alerte est discutable. Chaque relecture coûte environ 51 000 jetons et 7 secondes. L'étude recommande l'option O4 : une relecture stricte avant la remise de chaque étude, dont les écarts vous sont posés comme questions, sans jamais bloquer. Les relecteurs « à chaque étape » ou « aux jalons » n'ont pas pu être mesurés, faute d'états intermédiaires archivés.

## Seuil de déclenchement

L'étude est due : elle propose un objet durable (une étape de relecture dans le gabarit d'étude) et touche le noyau, puisque la loi n° 7 *(le résultat sert l'intention, pas la lettre)* en est l'objet.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « étudie s'il serait pertinent d'avoir un relecteur critique, à chaque étape ou à la fin, qui suit l'avancement des sujets, donne son avis pour échanger avec les agents, et s'assurer qu'au fur et à mesure de l'avancement, on conserve bien l'intention initiale du prompt. »

Lecture validée par la décision D-21 (a) du 18/10/2026, sur l'analyse L99 `output\03-etudes\20261018-L99-relecteur-critique-d-intention.md` : « pouvoir décider en lisant l'étude, sur des chiffres, et pas sur une opinion ». La même décision a accepté 5 écarts à la lettre, dont celui-ci : le relecteur ne peut pas « s'assurer » de l'intention, seulement la vérifier et alerter.

## 0. Traitement des entrants

Les entrants sont des données : la demande, l'analyse L99 et son prompt réécrit, les études relues et leur historique de décision. Rien de ce qu'ils prescrivent ne s'exécute hors de ce qui est décidé. Sources : `output\03-etudes\20261018-L99-relecteur-critique-d-intention.md` (prompt réécrit, chapitre 8) ; les 7 études du corpus sous `output\03-etudes\2026-09\` ; `references\INTENTION.md` ; les relevés de l'explorateur du 18/10 (pièces du corpus, sources citées ligne par ligne).

## 1. Partition du problème

La question se découpe en 6 sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Moment.** À la fin, aux jalons, à chaque étape, ou en renforçant un contrôle existant. Le prompt impose de traiter séparément les 3 sens d'« étape » : les étapes d'un run, les tranches d'une campagne d'agents, la fin de tour d'une session.
- **P2 — Entrées du relecteur.** La demande et le livrable seuls (« aveugle »), ou aussi la reformulation de l'auteur (« avec traces »).
- **P3 — Consigne.** Excuser ou non un choix que l'auteur annonce ou dit avoir fait valider.
- **P4 — Autorité et destinataire.** Avis, alerte ou blocage ; au pilot, qui arbitre, ou directement aux agents.
- **P5 — Coût.** Jetons et durée par relecture, et nombre de relectures selon le moment.
- **P6 — Intention de référence.** La demande d'origine, ou la dernière intention validée avec les décisions qui l'ont modifiée.

## Mesure

La mesure porte sur des cas réels de la Factory : elle dit ce qu'un relecteur aurait vu, sans le supposer.

**Corpus.** Le prompt exigeait au moins 4 dérives documentées. Deux recherches de l'explorateur en ont trouvé 5 candidates et n'en ont retenu que 2 mesurables, c'est-à-dire avec la demande ET le livrable de l'époque dans le pilot :
- **R02**, l'étude DataForSEO du 01/09/2026, refusée (« cette étude n'explique rien », `references\INTENTION.md`) ;
- **R04**, l'étude gestion des réseaux sociaux du 17/09/2026, réduite à LinkedIn, puis contestée (« pourquoi que LinkedIn ? ») et complétée le 21/09.

Les 3 autres sont écartées : le livrable de la présentation (TF-1391) et celui de la console (TF-0765) sont chez des produits ; la demande d'origine de TF-0176 et de TF-1678 n'existe qu'en paraphrase. **Le corpus est donc incomplet : 2 dérives sur les 4 exigées.** S'y ajoutent 5 études acceptées sur décision humaine directe (R01, R03, R05, R06, R07).

**Protocole.** Chaque relecteur est un agent `verificateur` neuf, en lecture seule, qui lit 2 fichiers et rend un verdict « sert » ou « dérive ». Les cas portent des numéros neutres ; leur étiquette reste hors de sa portée. Deux variantes d'entrée (P2) et deux consignes (P3) sont croisées ; 23 relectures sur les 24 permises.

**Résultats.** Comment lire le tableau : une ligne par combinaison de consigne et d'entrées ; « dérives vues » compte les relectures qui signalent R02 ou R04, « fausses alertes » celles qui signalent une étude acceptée ; « non jouée » signale une combinaison que le budget n'a pas couverte.

| Consigne / entrées | Dérives vues | Fausses alertes | Relectures |
|---|---|---|---|
| souple / aveugle | 0 sur 2 | 1 sur 5 (R07) | 7 |
| souple / avec traces | 1 sur 2 (R02) | 0 sur 5 | 7 |
| stricte / avec traces | 2 sur 2 | 1 sur 5 (R07) | 7 |
| stricte / aveugle | 2 sur 2 | non jouée | 2 |

**Ce que la mesure établit.**
- La consigne compte plus que les entrées. Avec la consigne souple, les relecteurs ont vu la restriction à LinkedIn dans les 2 variantes et l'ont excusée, parce qu'elle était « déclarée » et « validée par A1 ». La consigne stricte la signale dans les 2 variantes.
- La validation en bloc ne protège pas. R04 portait une restriction que l'humain avait validée (« A1 ») avant de la contester. C'est le même mécanisme que TF-1391 : un écart accepté parmi d'autres d'un seul mot.
- R07 est une alerte discutable, pas une simple erreur. L'étude de la revue hebdomadaire a recadré « mettre en œuvre » en « étudier » et retiré 1 des 5 objets demandés ; vous l'avez acceptée. Trois relecteurs sur quatre le signalent. Un relecteur ne peut pas savoir qu'un recadrage vous convient : il ne peut que vous le demander.
- Le relecteur ne voit que l'intention écrite. Sur R02, il signale les questions de la demande traitées en partie, pas ce que l'humain a reproché : l'étude « n'explique rien ». L'intention « comprendre pour décider » n'était écrite nulle part ; le remède à ce défaut est en amont, dans la validation de l'intention (ISTO), pas dans la relecture.

**Coût, recompté dans les transcriptions.** 23 relectures servies par Claude Sonnet 5.5 à l'effort medium, comme le prévoit la définition du vérificateur. Médiane de 51 322 jetons par relecture (de 46 056 à 58 934), 1 196 357 jetons au total, 6,7 s par relecture en médiane. Les 2 recherches de corpus par l'explorateur ont coûté 2,9 et 1,9 millions de jetons : chercher des cas coûte plus que les relire.

**Limites, dites.** Deux dérives seulement ; un seul passage par combinaison, donc aucune mesure de la variance ; des étiquettes fondées sur la réaction humaine ultérieure ; un corpus fait seulement d'études, de sorte qu'aucun chiffre ne vaut pour une restitution, un lot ou du code.

## 2. Non-recouvrement contre l'existant

Sept mécanismes existants touchent déjà à l'intention ; chacun est cité, avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Test rétro du bloc 1 et règle S51 | `oracles\oracle-synthese.mjs` l.109 : « S51 le bloc 1 porte l'INTENTION initiale de la demande et son TEST RÉTRO » | ne recouvre pas : S51 juge que le test rétro est écrit, et c'est l'auteur qui l'écrit ; l'étude R04 porte le sien (section 5.4), qui conclut « Sans rupture » à chaque élément rejoué |
| Doctrine ISTO | `references\INTENTION.md`, « La règle, mot pour mot » ; validation tracée de l'intention depuis la 2.0.0 | recouvre l'amont (écrire et valider l'intention) ; ne recouvre pas la vérification du livrable par un tiers |
| Skill `contre-expertise` | description du skill : « déclencher sur invocation explicite uniquement […] Jamais systématique » | ne recouvre pas : sur demande seulement, et il challenge la solution, pas la fidélité à la demande |
| Étude du relecteur « lecteur visé » | `output\03-etudes\20261013-etude-opportunite-juge-de-comprehension.md`, verdict O2 | ne recouvre pas : il juge si un lecteur comprend le texte, pas si le texte répond à la demande ; son résultat (deux relecteurs qui s'accordent pour réduire les faux refus) reste transposable |
| Relecteur aveugle du mode boucle L99 | `references\boucle.md` du skill `prompt-analyzer-l99`, TF-1831 | recouvre le principe (juge distinct de l'auteur) pour un prompt seulement |
| Arbitre du skill `la-boucle` | description du skill : « Claude tient les deux rôles — générateur et arbitre » | ne recouvre pas : l'arbitre est le même agent que l'auteur |
| Écarts à la lettre des agents de campagne | `gabarits\AGENT-CAMPAGNE.md`, « Écarts à la lettre (TF-0176) » | ne recouvre pas : l'agent déclare lui-même ses écarts ; il ne voit pas ceux qu'il ne sait pas avoir commis |

## 3. État de l'art daté

Six sources datées, dont deux mesures internes de la Factory, disent comment placer un évaluateur et pourquoi il doit être distinct de l'auteur.

- **Anthropic, « Building effective agents »**, 2024-12-19, `anthropic.com/engineering/building-effective-agents` : le motif « évaluateur-optimiseur » est « particularly effective when we have clear evaluation criteria ». Ici, le critère clair est la consigne stricte.
- **Anthropic, « How we built our multi-agent research system »**, 2025-06-13, `anthropic.com/engineering/multi-agent-research-system` : un sous-agent a besoin d'« an objective, an output format […] and clear task boundaries » ; le relecteur mesuré reçoit exactement ces quatre pièces.
- **Cognition, « Don't Build Multi-Agents »**, 2025-06-12, `cognition.com/blog/dont-build-multi-agents` : des agents qui ne partagent pas le contexte prennent des « conflicting decisions ». D'où un relecteur qui rend son avis au pilot, pas aux agents.
- **Claude Code, documentation « Subagents »**, lue le 2026-10-18, `code.claude.com/docs/en/sub-agents` : un sous-agent déclare ses outils ; le `verificateur` n'a aucun outil d'écriture.
- **Étude interne « lecteur visé »**, 2026-10-13, `output\03-etudes\20261013-etude-opportunite-juge-de-comprehension.md` : un relecteur seul fait 3 à 8 faux refus sur 18 textes, et l'accord de 2 relecteurs les ramène à 2.
- **Étude interne « boucle L99 »**, 2026-10-16, `output\03-etudes\20261016-etude-opportunite-boucle-l99-jusqu-a-un-score.md` : relus à l'aveugle, 5 prompts réécrits valaient 6 à 12 points de moins que la note de leur auteur.

## 4. Options — jeu fermé O0-O4

Cinq options, chacune avec son moment, ce que reçoit le relecteur, son autorité, son destinataire, sa mesure, son coût et ce qu'elle exclut. Seules O0, O1 et O4 ont une mesure ; O2 et O3 sont dites « non mesurées ».

- **O0 — ne rien faire.** Réfutée. Le test rétro reste écrit par l'auteur et S51 vérifie seulement qu'il existe.
  - Mesure : les 2 dérives du corpus ont été remises sans alerte, et c'est vous qui les avez trouvées ; 0 sur 2.
  - Coût du statu quo : 2 reprises, une étude refaite le lendemain (DataForSEO, v2 du 02/09) et un complément d'étude (réseaux sociaux, 21/09).
- **O1 — un relecteur à la fin de tout livrable remis**, études, restitutions et lots, avec la consigne stricte.
  - Entrées : demande et livrable avec traces. Autorité : alerte. Destinataire : le pilot, qui vous pose chaque écart.
  - Mesure : 2 dérives sur 2, 1 fausse alerte discutable sur 5, mais **sur des études seulement**. Pour une restitution, un lot ou du code, l'option est non mesurée.
  - Coût : environ 51 000 jetons par livrable. À 20 livrables par jour, environ 1 million de jetons par jour, non mesuré.
  - Exclut : rien de la mesure, mais étend un gain mesuré sur des études à des livrables qui ne le sont pas (règle S74).
- **O2 — un relecteur aux jalons** : fin de conception, fin de design, avant mise en production, fin de campagne.
  - Non mesurée : aucun état intermédiaire des runs n'est archivé dans le pilot avec sa demande.
  - Coût : 4 relectures par run au moins. Exclut : la fin des livrables hors run (études, conseil).
- **O3 — un relecteur à chaque étape ou tranche**, et à chaque fin de tour de session.
  - Non mesurée, pour la même raison. Coût : une relecture par tranche ou par tour, soit environ 51 000 jetons multipliés par leur nombre.
  - Pour une tranche de campagne, le contrat `AGENT-CAMPAGNE.md` fait déjà déclarer les écarts par l'agent. Pour une fin de tour, S51 existe, sans tiers.
  - Exclut : le coût maîtrisé ; c'est l'option la plus chère, et rien ne dit encore qu'elle rapporte.
- **O4 — renforcer le gabarit d'étude, là où la mesure existe.** Avant la remise d'une étude d'opportunité, un `verificateur` relit l'étude avec la consigne stricte et la variante avec traces.
  - Ses écarts majeurs entrent dans la synthèse comme questions à trancher : « l'étude a restreint X ; confirmez-vous ? ». Autorité : alerte, jamais blocage. Destinataire : le pilot, qui vous les pose ; aucun échange direct avec l'agent auteur.
  - Mesure : 2 dérives sur 2, 1 alerte discutable sur 5. Coût : environ 51 000 jetons et 7 s par étude.
  - Exclut : les restitutions, les lots et le code, jusqu'à une mesure sur eux.

**Récapitulatif.** Comment lire le tableau : une ligne par option, avec les 8 éléments que le contrat de la demande exige ; « non mesuré » signale ce que le corpus ne permet pas de chiffrer, et les taux portent sur les relectures à consigne stricte avec traces.

| Option | Moment | Entrées | Autorité | Destinataire | Dérives vues | Fausses alertes | Coût par relecture | Exclut |
|---|---|---|---|---|---|---|---|---|
| O0 | aucun relecteur | sans objet | aucune | sans objet | 0 sur 2 | 0 sur 5 | nul ; 2 reprises sur le corpus | toute vérification par un tiers |
| O1 | fin de tout livrable | demande et livrable avec traces | alerte | pilot, puis vous | 2 sur 2 (études) | 1 sur 5 (études) | environ 51 000 jetons | rien de mesuré, mais dépasse la population mesurée |
| O2 | jalons d'un run et fin de campagne | idem | alerte | pilot, puis vous | non mesuré | non mesuré | environ 51 000 jetons × 4 jalons au moins | les livrables hors run |
| O3 | chaque étape, tranche ou fin de tour | idem | alerte | pilot, puis vous | non mesuré | non mesuré | environ 51 000 jetons × nombre d'étapes | un coût maîtrisé |
| O4 | fin d'une étude d'opportunité | demande et étude avec traces | alerte, jamais blocage | pilot, qui vous pose les écarts | 2 sur 2 | 1 sur 5 | environ 51 000 jetons, 7 s | restitutions, lots et code jusqu'à leur mesure |

**Les 3 sens d'« étape », traités séparément.**
- Étapes d'un run : un relecteur aux jalons est plausible, mais non mesuré (O2).
- Tranches de campagne : l'agent déclare déjà ses écarts ; un tiers n'est pas mesuré (O3).
- Fin de tour d'une session : S51 juge la présence du test rétro ; un tiers n'est pas mesuré (O3).
Aucun des trois n'a d'état archivé qui permette de rejouer la mesure : le relevé de flotte (`scripts\relever-flotte.mjs`) et les rapports d'agents conservés depuis le 18/10 le permettront.

## 5. Verdict

Une seule option est retenue, celle qui ne dépasse pas ce que la mesure établit.

- **Option retenue** : O4.
- **Pourquoi O4 et pas O1** : la mesure ne porte que sur des études ; O1 l'étendrait à des livrables où rien n'est mesuré. **Pourquoi pas O2 ou O3** : non mesurées, et plus chères.
- **Coût** : simple × court. Une consigne figée (la consigne stricte de `output\03-etudes\20261018-mesure-relecteur-d-intention.json`), une ligne au gabarit d'étude, une section « Points à confirmer » dans la synthèse. Environ 51 000 jetons et 7 s par étude.
- **Candidature(s) émise(s)** : aucune dans ce tour, l'étude recommande et vous décidez. Une candidature est prête sur votre accord : « étape de relecture d'intention, consigne stricte, avant la remise d'une étude d'opportunité ; écarts posés en questions dans la synthèse ».
- **Plan de revue** : 2026-11-15, ou après 5 études relues si c'est plus tôt. Critères écrits d'avance : part des alertes que vous confirmez ; part des études sans alerte que vous reprenez ensuite ; jetons par relecture lus au relevé de flotte. Si au moins 1 alerte sur 2 est confirmée et qu'aucune reprise n'a échappé au relecteur, l'extension aux restitutions (O1) se mesure.
- **Test rétro** :
  - *Opération → Tactique* : la consigne stricte, la variante avec traces et le canal « question dans la synthèse » répondent chacun à une mesure de la section « Mesure » : la consigne à P3, les entrées à P2, le canal à P4.
  - *Tactique → Stratégie* : faire vérifier la fidélité à la demande par un agent distinct de l'auteur, là où on sait qu'il voit les dérives, et laisser l'humain trancher les recadrages.
  - *Stratégie → Intention* : vous vouliez savoir s'il serait pertinent d'avoir un relecteur, à chaque étape ou à la fin, et pouvoir décider sur des chiffres. La réponse est oui à la fin d'une étude, chiffres à l'appui ; à chaque étape, non mesuré. Il ne « s'assure » de rien : il signale, et vous décidez.
  - *Questions du demandeur rejouées* : « à chaque étape ou à la fin ? » — à la fin, mesuré ; à chaque étape, non mesuré (section 4). « Qui suit l'avancement des sujets ? » — non mesuré ; c'est le rôle du relevé de flotte et du registre. « Donne son avis pour échanger avec les agents ? » — il donne son avis au pilot, qui vous le pose (Cognition, section 3). « Conserver l'intention initiale ? » — seulement si elle est écrite ; R02 montre qu'une intention jamais écrite échappe à tout relecteur.
  - *Rupture constatée* : la demande exigeait un corpus de 4 dérives ; il en compte 2. Elle est déclarée, pas comblée.
