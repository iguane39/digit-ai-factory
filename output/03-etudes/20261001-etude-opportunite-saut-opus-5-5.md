---
role: étude d'opportunité — instruction d'un candidat entre `candidat` et `decide` (TF-0155) — le passage d'Opus 5 à Opus 5.5 dans la Factory et ses forges, jouée sur le prompt réécrit du 27/09/2026 (décisions D-1 (a) et D-2 (a) du 01/10/2026)
destinataire: humain
sources_de_verite: [output/03-etudes/20260927-L99-saut-opus-5-vers-opus-5-5.md (prompt réécrit, chapitre 8.3), platform.claude.com/docs (vue d'ensemble, prix, nouveautés, guide de rédaction et guide de migration d'Opus 5.5, effort ; lus le 2026-10-01), code.claude.com/docs/en/model-config (lu le 2026-10-01), CONTRAT-INTERFACE.md §4 et §4 bis (version fusionnée le 2026-10-01), references/MODELES-EN-SERVICE.json (v1.0.0 du 2026-09-25), journaux de session du poste (champs d'usage seulement), .claude/hooks-journal.jsonl]
verifie_le: 2026-10-01
---

# Étude d'opportunité — Le passage d'Opus 5 à Opus 5.5 : que changer dans la Factory et ses forges, et que garder — 20261001a

**Ce que le lecteur va apprendre.** Le passage a eu lieu le 22/09/2026 au soir, et la Factory a
déjà rattrapé son retard de doctrine le 25/09 sur l'autre poste : les modèles se désignent par leur
nom de famille, la version servie est mesurée à chaque ouverture, et un re-test de la règle de
routage est inscrit comme dû. Ce qui reste ouvert tient en 3 points, tous mesurés ici sur les
journaux de ce poste (source : journaux de session, calcul du 2026-10-01). L'effort de réflexion
tourne à `max` sans qu'aucune mesure l'ait justifié, alors que la documentation d'Opus 5.5 conseille
de partir de `medium`. Le volume dominant est la relecture du contexte, environ 473 000 jetons par
réponse (même source), un levier qui ne dépend pas du modèle. Le re-test de routage, dû depuis le
25/09, n'a pas de protocole exécutable. Le verdict retient O2 : mesurer d'abord par un rejeu figé de 6 tâches de la
Factory, qui ferme le re-test dû, puis régler l'effort, la longueur des sessions et l'effort des
sous-agents par étapes. Aucune réécriture de doctrine n'est retenue tant qu'une mesure ne la
justifie pas.

---

## Seuil de déclenchement (vérifié avant écriture)

Le seuil du gabarit est franchi par 2 de ses 3 conditions, ce qui rend l'étude obligatoire.

- **Touche au moins 3 forges ou le noyau** : oui. Le réglage d'effort et de modèle s'applique à toutes
  les sessions du poste, pilot, forges et produits, et le tableau de routage vit au contrat
  d'interface du noyau.
- **Gain au moins 3 avec une preuve au plus 2** : oui. Les gains annoncés par l'éditeur sont élevés et
  leur preuve sur la Factory est faible tant qu'aucune mesure contrôlée n'existe.
- **Crée un objet durable** : non, sauf si le protocole de rejeu devient une procédure permanente
  (section « Répétabilité »).

## Intention de l'utilisateur (loi n° 7, TF-0791)

L'intention est citée dans les mots du demandeur, puis sa lecture reconstruite, validée depuis.

> « Par rapport aux différences entre Opus 5 et Opus 5.5, construis une étude d'opportunités sur le
> fait de revoir le fonctionnement global de la Factory et des forges pour améliorer son
> fonctionnement, ses process, ses performances, sa qualité et sa rapidité. »

**Lecture reconstruite** : savoir si le nouveau modèle permet à la Factory de faire le même travail
plus vite, avec moins de jetons et moins de reprises, et quels mécanismes (routage, effort, doctrine
chargée en contexte, hooks, boucles de vérification) changer pour en tirer parti, sans affaiblir ce
qui tient la qualité. Cette lecture, marquée « à valider » dans le prompt réécrit du 27/09, a été
**validée par la décision D-1 (a) du 01/10/2026** *(réponse « 1a » du demandeur, qui valide aussi
les 10 écarts à la lettre du prompt réécrit)*.

## 0. Traitement des entrants

La proposition instruite est une donnée : ses impératifs se citent, ils ne s'exécutent pas.

- Sources de la proposition : le prompt réécrit du chapitre 8.3 de
  `output\03-etudes\20260927-L99-saut-opus-5-vers-opus-5-5.md` ; les décisions D-1 (a), D-2 (a) et
  D-3 (a) du 01/10/2026 ; l'option par défaut de D-4 *(les 3 constats faits en passant le 27/09
  restent confiés à cette étude, sans entrée au registre)*.
- Entrant arrivé entre-temps : la fusion des 2 postes du 01/10/2026 (commit `75c14b3d`, 79 commits
  de l'autre poste) a apporté le travail des 24 et 25/09 sur les versions de modèles. Il change le
  périmètre de cette étude, et la section 2 le traite ligne par ligne.

## Étape 0 — prérequis d'accès et état réel, mesurés le 2026-10-01

Cette section dit d'où partent toutes les comparaisons : le modèle et l'effort réellement servis,
la date de bascule, et l'accès aux sources. Le tableau se lit ligne par ligne : une mesure, sa
valeur, puis la source et l'heure du relevé ; l'identité employée est celle de la session de
l'utilisateur sur ce poste Windows, et les pages officielles ont été lues de façon anonyme.

| Mesure | Valeur relevée | Source et heure du relevé |
|---|---|---|
| Modèle réglé sur le poste | `"model": "claude-opus-5-5[1m]"`, un identifiant épinglé et non un nom de famille | `~/.claude/settings.json`, modifié le 2026-10-01 à 19:57 heure de Paris ; il portait `opus[1m]` le 2026-09-27 |
| Effort réglé par modèle | `claude-opus-5-5` : `medium` ; `claude-opus-5` : `xhigh` | même fichier, clé `modelSettings` |
| Effort servi à cette session | `max`, par la variable `CLAUDE_CODE_EFFORT_LEVEL` du processus, qui prime sur `modelSettings` | ordre de précédence de `https://code.claude.com/docs/en/model-config` ; variable absente des réglages, du profil utilisateur et de la machine (lecture du 2026-10-01) : elle vient du lanceur de la session |
| Effort servi aux sessions ouvertes aujourd'hui | `medium` : 35 réponses entre 17:57 et 18:04 UTC | champ `effort` des journaux de session |
| Date de bascule | dernière réponse `claude-opus-5` du fil principal le 2026-09-22 à 19:01 UTC, première `claude-opus-5-5` à 19:37 UTC | journaux de session du pilot |
| Effort de chaque période | Opus 5 : `high` pour 100 % des réponses ; Opus 5.5 : `max` 1 638, `xhigh` 102, `medium` 35 | champ `effort`, réponses dédoublonnées |
| Facturation | inconnue : aucune clé d'API ni jeton d'accès dans l'environnement, un fichier d'identification de compte présent, ce qui indique une connexion par compte (forfait probable) | relevé de présence seulement, aucune valeur lue ; les coûts sont donc exprimés en jetons, et en prix de liste comme indicateur relatif |
| Accès aux sources officielles | 7 pages en 200 le 2026-10-01 à 18:01:21 UTC (vue d'ensemble, prix, guide de migration, nouveautés, guide de rédaction, effort, réglage des modèles de Claude Code) | `curl -s -L -o /dev/null -w '%{http_code}'` ; contrôle positif : la vue d'ensemble, même identité ; aucun repli nécessaire |
| Corpus de mesure | 68 fichiers de journaux dans le dossier du pilot (18 sessions principales, 50 fichiers de sous-agents), 7 641 réponses dédoublonnées ; journal du hook de fin de tour : 1 849 entrées | lecture par script des seuls champs `type`, `timestamp`, `effort`, `message.id`, `message.model`, `message.usage`, `message.stop_reason` |
| Appels directs à l'interface de programmation | aucun dans le code des 15 dépôts `digit-ai-*`, hors une fixture de test d'oracle | recherche du 2026-10-01, après la fusion |
| État de départ pour le contrôle de fin | tête du pilot `8f209e89`, arbre propre hors `.claude/worktrees/`, empreinte des réglages `a02492881429b1d8` | relevé du 2026-10-01 à 18:01:20 UTC |

**Écarts de lecture déclarés.** Pour découper les tours, le script a lu 3 marques de structure en
plus des champs prévus : la présence de la clé `toolUseResult` (sans son contenu), `isSidechain` et
`isMeta`. Pour attribuer chaque verdict du hook à un modèle, il a lu les champs `message.model` et
`effort` des journaux des sessions de produits que ce journal contient. Aucun texte de message n'a
été lu ni cité.

## Les différences entre Opus 5 et Opus 5.5, en 3 familles

Des différences documentées, une seule famille agit sur la Factory telle qu'elle fonctionne, et
c'est celle des réglages. Le tableau se lit ligne par ligne : une différence, sa famille (A pour la
surface de l'interface de programmation, B pour les réglages du harnais et les prix, C pour une
capacité déclarée par l'éditeur), ce qu'elle touche dans la Factory, et la mesure qui le dit.

| Famille | Différence documentée (pages lues le 2026-10-01) | Touche la Factory ? | Mesure ou motif |
|---|---|---|---|
| A | Réflexion non désactivable, `tool_choice` forcé refusé, blocs de réflexion liés au modèle et à la conversation, usage de l'ordinateur par la seule boîte à outils | non : sans objet | aucun appel direct dans le code du parc ; même constat dans la synthèse de conseil du 24/09 |
| B | Effort par défaut `medium` au lieu de `high`, et davantage de réflexion par tour à `xhigh` et `max` | oui | effort servi : `max` à 92 % des réponses d'Opus 5.5 |
| B | Prix : 4 $ en entrée, 20 $ en sortie, 0,20 $ en relecture du cache, 8 $ en écriture d'une heure, contre 5 $, 25 $, 0,50 $ et 10 $ pour Opus 5, par million de jetons | oui | toutes les écritures du cache du poste sont des écritures d'une heure ; la relecture domine le volume |
| B | Le nom de famille `opus` suit la dernière version ; un identifiant épingle | oui | le réglage du poste épingle `claude-opus-5-5` depuis le 2026-10-01 |
| B | Texte entre appels d'outils rendu en blocs de réflexion | non | le harnais Claude Code l'affiche ; aucun client maison |
| C | À `medium`, Opus 5.5 égale ou dépasse Opus 5 à `high` en code et en travail d'analyse, en moins d'étapes et de jetons | à mesurer | déclaration « in Anthropic's testing » |
| C | Génération des jetons de sortie plus rapide de plus de 30 % | à mesurer | déclaration de l'éditeur, page « Prompting Claude Opus 5.5 » |
| C | Rapports plus clairs, moins de chiffres faux ou de sources erronées, meilleure revue de code | à mesurer | déclaration de l'éditeur |
| C | Lecture des graphiques et captures plus juste, meilleure tenue des longues exécutions autonomes | hors étude | aucune mesure de la Factory ne porte sur ces points aujourd'hui |

## 1. Partition du problème

Le sujet se découpe en 6 sous-questions disjointes ; chaque option de la section 4 se rattache à
l'une d'elles, et la dernière liste ce qui reste dehors.

- **P1 — L'effort** : à quel niveau faire travailler chaque classe de tâche, sessions et sous-agents.
- **P2 — Le contexte relu** : la taille du contexte à chaque réponse, la longueur des sessions et le
  poids de ce qui est chargé à l'ouverture.
- **P3 — Le routage** : quel modèle pour quel rôle, au prix réel et à qualité égale, et la clôture du
  re-test dû depuis le 25/09.
- **P4 — La qualité et les reprises** : la part des restitutions refusées au premier passage, et la
  doctrine écrite pour compenser les défauts des modèles précédents.
- **P5 — La répétabilité** : ce qui doit se passer au prochain changement de version.
- **P6 — Hors étude** : ce qu'aucune différence documentée ne touche, ou qu'aucune mesure ne relie à un
  goulot (liste en fin d'étude).

## Mesure — les 5 axes, par période

Les 5 axes du demandeur reçoivent chacun une métrique et une source ; les valeurs viennent du
corpus de ce poste (source : journaux de session et journal du hook, calcul du 2026-10-01). Le
tableau se lit ligne par ligne : un axe, sa métrique, puis la valeur sous Opus 5 à l'effort `high`
et sous Opus 5.5 à l'effort `max`, la configuration servie dans chaque période. La dernière colonne
dit ce que la ligne permet de conclure, compte tenu des facteurs de confusion de la section suivante.

| Axe | Métrique et source | Opus 5, `high` | Opus 5.5, `max` | Portée de la ligne |
|---|---|---|---|---|
| Rapidité | latence médiane d'une réponse à contexte inférieur à 200 000 jetons (journaux, première ligne de la réponse) | 5,0 s | 4,5 s | observé : la période Opus 5.5 à `max` répond un peu plus vite ; attribution au modèle renvoyée au rejeu (H1) |
| Rapidité | latence médiane d'une réponse Opus 5.5 à contexte inférieur à 100 000 jetons, selon l'effort | sans objet | `max` 4,5 s ; `xhigh` 3,1 s ; `medium` 2,2 s | l'effort pèse du simple au double sur la latence ; l'échantillon `medium` est petit (33 réponses) |
| Rapidité | durée de travail médiane d'un tour (temps de modèle et d'outils, attentes de plus de 30 min exclues) | 214 s | 1 099 s | non comparable : les tours d'Opus 5.5 portent 58 réponses en médiane contre 11 |
| Performances | jetons de sortie par réponse (journaux, `usage.output_tokens`) | 1 257 | 1 339 (`xhigh` : 884 ; `medium` : 347) | observé : le volume généré suit le niveau d'effort ; confondu par les tâches, à confirmer par le rejeu |
| Performances | jetons relus en cache par réponse | 272 144 | 473 039 | le contexte relu est 350 fois plus volumineux que la sortie |
| Performances | prix de liste d'une réponse au mélange mesuré d'Opus 5.5 (calculé) | 0,320 $ | 0,162 $ | à mélange égal, Opus 5.5 coûte la moitié d'Opus 5 |
| Qualité | part des restitutions refusées au premier passage du hook de fin de tour (sessions réelles du parc) | 24,8 % (26 sur 105, 15 sessions) | 9,1 % (6 sur 66, 26 sessions) | baisse compatible avec la déclaration « rapports plus clairs », non prouvée : effort, doctrine et juge ont changé |
| Process | temps d'outil moyen par appel, et reprise médiane après un refus | 3,2 s ; 0,9 min | 3,8 s ; 1,2 min | les hooks et outils ne sont pas le goulot de ces périodes |
| Fonctionnement | contexte relu à la première réponse d'une session (doctrine, harnais et sorties de l'ouverture) | 58 566 jetons | 58 738 jetons | stable depuis septembre ; ce n'est pas lui qui gonfle le contexte |
| Fonctionnement | routage réel des sous-agents du pilot (réponses par modèle et effort) | Opus 5 `high` : 2 863 | Opus 5.5 `max` : 389 ; Sonnet 5 : 450 à `high` et 456 à `max` | les sous-agents héritent de l'effort de la session |

**Comment lire le prix de liste.** Le mélange mesuré d'une réponse d'Opus 5.5 à `max` est de
473 039 jetons relus, 5 020 écrits en cache d'une heure et 1 339 générés (source : journaux,
calculé le 2026-10-01). Appliqué aux prix officiels lus le 2026-10-01, le même mélange coûte
0,162 $ sur Opus 5.5, 0,320 $ sur Opus 5, 0,286 $ sur Fable 5.1 et 0,128 $ sur Sonnet 5 (source :
calcul sur `https://platform.claude.com/docs/en/about-claude/pricing`). Haiku 4.5 ne peut pas porter
ce mélange : sa fenêtre est de 200 000 jetons (source : vue d'ensemble des modèles). Sur le mélange réel de la Factory, Sonnet 5 n'est
donc moins cher qu'Opus 5.5 que d'un facteur 1,26, et non 2 comme le disent les prix d'entrée et de
sortie, parce que les 2 modèles relisent le cache au même prix. Avec une facturation au forfait,
ces montants ne se paient pas : ils mesurent un poids relatif.

**Ce que dit la latence selon le contexte.** Sur Opus 5.5 à `max`, la latence médiane passe de 4,5 s
sous 200 000 jetons à 6,3 s au-delà de 600 000 (source : journaux, 1 643 réponses, calcul du
2026-10-01). 3 sessions ont atteint le million : 996 611 jetons (Fable 5.1), 967 062 et 966 542
(Opus 5.5). La longueur des sessions coûte donc du temps à chaque réponse, quel que soit le modèle.

## Facteurs de confusion

Comparer la période Opus 5 et la période Opus 5.5 ne compare pas 2 modèles : 7 autres choses ont
changé en même temps. Le tableau se lit ligne par ligne : un facteur, sa mesure, et son effet sur
les comparaisons de la section précédente. Aucune phrase de cette étude n'attribue un écart au
modèle seul ; toute affirmation de cet ordre renvoie au plan de rejeu.

| Facteur | Mesure | Effet sur la comparaison |
|---|---|---|
| Effort | 100 % `high` sous Opus 5 ; 92 % `max` sous Opus 5.5 (1 638 réponses sur 1 775) | le modèle et l'effort ont changé le même soir : tout écart de volume ou de latence mêle les deux |
| Tâches | tours d'Opus 5 : 11 réponses en médiane ; tours d'Opus 5.5 à `max` : 58 | les mandats longs (fusion des postes, campagnes, études) tombent dans la seconde période |
| Doctrine de restitution | 53 765 octets le 2026-09-01, 94 532 le 2026-09-22, 118 403 le 2026-10-01 ; juge passé de 143 203 à 360 022 octets | le taux de refus au hook se mesure avec un juge qui a changé de règles entre les périodes |
| Harnais | Claude Code 2.1.259 à 2.1.273 sous Opus 5 ; 2.1.280 sous Opus 5.5 | la version du harnais a changé avec le modèle |
| Longueur des sessions | relecture moyenne de 272 144 jetons par réponse contre 473 039 | des sessions plus longues sous Opus 5.5, d'où plus de relecture et plus de latence |
| Taille d'échantillon | fil principal : 390 réponses en 5 sessions sous Opus 5, 1 775 en 8 sessions sous Opus 5.5 | la période Opus 5 du fil principal est courte : le pilot tournait alors surtout sous Fable 5.1 |
| Deux postes | les journaux de l'autre poste ne sont pas lisibles d'ici ; le registre, lui, est fusionné | les mesures valent pour ce poste seulement |

**Correction d'un chiffre de l'analyse du 27/09.** L'analyse L99 citait « 708 refus sur 1 829 verdicts
du hook de fin de tour » (source : chapitre 6 de l'analyse). Ce compte mêlait 1 391 entrées écrites
par les recettes automatiques du hook (sessions nommées « test » ; source : journal du hook) et 458
entrées de vraies sessions. Sur les seules vraies sessions,
le journal compte 99 refus, 165 acceptations et 194 avertissements (source : journal du hook,
calcul du 2026-10-01). Le constat de fond tient, avec un ordre de grandeur différent.

## 2. Non-recouvrement contre l'existant

Une bonne part de ce que le prompt du 27/09 demandait existe déjà depuis le 25/09, sur l'autre
poste, et la fusion l'a rendu visible ici. Le tableau se lit ligne par ligne : l'existant examiné,
la citation qui en fait foi, puis ce qu'il recouvre de cette étude et ce qu'il laisse ouvert.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `CONTRAT-INTERFACE.md` §4, version fusionnée le 2026-10-01 | « Le modèle se désigne par son NOM DE FAMILLE, jamais par un identifiant (décisions humaines D-1 (a) et D-2 (a) du 25/09/2026) » | recouvre le suivi des versions et le pilotage sur Opus : l'étude ne les refait pas |
| `references\MODELES-EN-SERVICE.json`, version 1.0.0 du 2026-09-25 | `re_test_regle_de_challenge` : statut « du » depuis le 2026-09-25, `clos_par` vide | recouvre le déclencheur ; ne recouvre pas le protocole exécutable, que la section « Plan de rejeu » fournit |
| `oracles\oracle-modeles-en-service.mjs` | joué le 2026-10-01 : PASS, avec 2 avertissements, Opus 5 encore servi (3 462 réponses, fichier le plus récent du 2026-09-28) et re-test dû | recouvre la détection d'une version nouvelle ou d'un épinglage |
| Synthèse de conseil « Agents et nouvelles versions de modèles », 2026-09-24 | « Les forges n'appellent pas l'API Anthropic en direct : les changements d'API […] ne touchent aucun code de forge » | recouvre la famille A, déclarée sans objet ici |
| Synthèse de mandat « modèles suivis par famille », 2026-09-25 | « Pilotage Opus au contrat, au noyau et dans les 2 réglages du poste » ; « effort max conservé » | recouvre le choix du pilotage ; ne recouvre pas la mesure de l'effort, conservé sans mesure |
| TF-1420 *(registre : génération de modèles figée au 10/08)*, statut corrigé | « la génération de modèles est figée au 10/08 (Fable 5, Opus 5) alors que le pilotage tourne sur Fable 5.1 depuis le 02/09 » | recouvre le 1er constat du 27/09 |
| TF-1421 *(registre : modèle des agents compilés)*, statut corrigé | « un agent compilé ne déclare ni modèle ni effort et hérite ceux de la session » | recouvre le modèle des agents compilés ; ne recouvre pas leur effort, toujours hérité |
| TF-1419 *(registre : contrôle d'épinglage de forge-tests)*, statut candidat | « le contrôle d'épinglage prend les identifiants Claude en service […] pour des alias mouvants » | hors étude : déjà au registre |
| `BOUCLE-AMELIORATION.md`, campagne du 2026-08-10 | « faut-il une passe Opus 5 ? » → « non aux réécritures, oui aux défauts mesurés » | ne recouvre pas : principe repris, aucune réécriture de doctrine sur la réputation d'un modèle |
| Étude « revue hebdomadaire de l'existant », 2026-09-17 | verdict O1 : « étendre le plan de sondes et le relevé d'ouverture existants, sans objet neuf » | ne recouvre pas : elle sonde les descentes de doctrine, pas les modèles ; sa manière (pas d'objet neuf) est reprise |
| Protocole de mesure « personas par phase », 2026-09-14 | « Ce protocole fixe, avant tout résultat, ce qui sera mesuré et comment on le jugera » | ne recouvre pas : patron repris pour le plan de rejeu |
| Skill `claude-api`, sous-commandes `prompt-audit` et `migrate` | « Audit existing prompts, skills, and tool descriptions for dated patterns ("cruft") written for older models » | ne recouvre pas : instrument disponible pour P4, non joué ici |

## 3. État de l'art daté

Les sources sont la documentation de l'éditeur, lue le jour même, parce que le modèle exécutant a une
connaissance fiable qui s'arrête en juin 2026, avant sa propre mise en service. Chaque ligne donne la
page, sa date de lecture et ce qu'elle établit.

- « Models overview », documentation Anthropic, `https://platform.claude.com/docs/en/about-claude/models/overview`,
  lue le 2026-10-01 : « start with Claude Opus 5.5 for most workloads. Use Claude Fable 5.1 for
  demanding reasoning […] or when your evals on Claude Opus 5.5 at higher effort still fall short » ;
  Opus 5 rangé parmi les modèles hérités ; retrait d'Opus 5.5 « not sooner than September 22, 2027 ».
- « Pricing », documentation Anthropic, `https://platform.claude.com/docs/en/about-claude/pricing`, lue le
  2026-10-01 : prix par modèle, relecture du cache à 0,05 fois le prix d'entrée sur Opus 5.5.
- « What's new in Claude Opus 5.5 », documentation Anthropic, lue le 2026-10-01 : les 4 ruptures de l'interface ;
  « At the same effort setting the model tends to think more per turn than Claude Opus 5, most of all
  at xhigh and max ».
- « Prompting Claude Opus 5.5 », documentation Anthropic, lue le 2026-10-01 : « generates output tokens more than
  30 percent faster than Claude Opus 5 » ; « Reserve xhigh and max for work where you've measured a
  quality gain » ; « To get less thinking, lower the effort level first ».
- « Effort », documentation Anthropic, `https://platform.claude.com/docs/en/build-with-claude/effort`, lue le
  2026-10-01 : `low` recommandé pour les sous-agents ; « Run an effort sweep on your own evals rather
  than carrying settings over from an earlier model ».
- « Migrating to Claude Opus 5.5 », documentation Anthropic, lue le 2026-09-27 puis le 2026-10-01 : « Re-run your
  effort sweep », « Re-evaluate model-specific prompt instructions », « Test in a development
  environment before switching production traffic ».
- Claude Code, « Model configuration », `https://code.claude.com/docs/en/model-config`, lue le
  2026-10-01 : `opus` résolu en Opus 5.5 ; la variable d'environnement prime sur les réglages ; Opus
  5.5 démarre à `medium`.

## Carte des opportunités

Le pluriel « opportunités » du demandeur se traite ici : 7 opportunités, chacune reliée à une
différence des familles B ou C et à une mesure du corpus. Le tableau se lit ligne par ligne :
l'opportunité, la différence qui la fonde, le mécanisme de la Factory qu'elle touche, la mesure, le
gain attendu dans l'unité de sa métrique, et la candidature qui la porterait. Les options de la
section 4 sont des paquets de ces lignes.

| N° | Opportunité | Différence (famille) | Mécanisme touché | Mesure qui la fonde | Gain attendu | Candidature |
|---|---|---|---|---|---|---|
| 1 | Régler l'effort par classe de tâche au lieu de `max` partout | défaut `medium`, plus de réflexion par tour à `max` (B, C) | réglage des sessions | latence à moins de 100 000 jetons : 4,5 s à `max`, 3,1 s à `xhigh`, 2,2 s à `medium` | secondes par réponse et jetons de sortie par tâche close, à qualité égale | C-1 |
| 2 | Tenir les sessions courtes : une session neuve par mandat, et un seuil de contexte | relecture du cache au prix fort en volume (B) | longueur des sessions, compaction | 473 039 jetons relus par réponse ; latence de 4,5 s à 6,3 s selon le contexte ; 3 sessions au million | jetons relus par tâche close ; latence | C-2 |
| 3 | Fermer le re-test dû de la règle de routage par un rejeu figé | prix au mélange réel, recommandation officielle (B) | §4 bis et référentiel des modèles en service | re-test dû depuis le 2026-09-25, `clos_par` vide ; Sonnet 5 moins cher d'un facteur 1,26 seulement | coût par tâche close à qualité égale, par classe | C-3 |
| 4 | Ramener le réglage du poste au nom de famille | nom de famille contre identifiant (B) | `~/.claude/settings.json` | `claude-opus-5-5[1m]` depuis le 2026-10-01, contre la règle du 25/09 | 0 session épinglée au prochain changement de version | C-4 |
| 5 | Régler l'effort des sous-agents | `low` recommandé pour les sous-agents (B) | agents compilés et appels de sous-agents | 456 réponses de sous-agents Sonnet 5 à `max`, 389 d'Opus 5.5 à `max` | jetons et durée des campagnes | C-5 |
| 6 | Tester la prédiction « rapports plus clairs, moins de refus » à effort égal | communication plus claire (C) | hook de fin de tour, doctrine de restitution | refus au premier passage : 24,8 % contre 9,1 %, comparaison confondue | taux de refus au premier passage, à effort et juge égaux | intégrée à C-3 |
| 7 | Alléger la doctrine chargée, seulement là où une mesure le permet | réévaluer les consignes écrites pour le modèle précédent (C) | gabarits et oracles de restitution | doctrine de restitution multipliée par 2,2 en un mois ; contexte d'ouverture stable à 58 738 jetons | jetons de contexte et refus au hook | écartée pour l'instant |

## 4. Options — jeu fermé O0-O4

Les 5 options sont des paquets cumulatifs des opportunités de la carte, du statu quo à la refonte.
Chacune porte son contenu, son coût en complexité × durée et ce qu'elle exclut.

- **O0 — ne rien faire.** Effort `max` pour toutes les sessions et leurs sous-agents, sessions longues,
  réglage épinglé, re-test dû laissé ouvert. **Réfutée** par un coût constaté : à moins de 100 000
  jetons de contexte, une réponse à `max` met 4,5 s contre 2,2 s à `medium`, et génère 1 339 jetons
  contre 347 (source : journaux, calcul du 2026-10-01) ; le re-test de routage reste ouvert depuis
  le 2026-09-25 sans que rien ne le ferme ; le réglage épinglé laissera passer la prochaine version.
- **O1 — régler sans mesurer.** Passer tout le poste à `medium`, comme le défaut de l'éditeur, et
  revenir au nom de famille. Coût : simple × court. Exclut toute mesure de la qualité perdue ou
  gagnée ; repose sur des déclarations de l'éditeur, pas sur la Factory. Réfutée : la Factory
  n'accepte un livrable que sur le verdict d'un oracle exécuté, et ce réglage n'en aurait aucun.
- **O2 — mesurer d'abord, puis régler par étapes.** Jouer le plan de rejeu figé ci-dessous, qui ferme
  le re-test dû (opportunités 3 et 6) ; en déduire l'effort par classe de tâche, sessions et
  sous-agents (1 et 5) ; tenir les sessions courtes (2) ; revenir au nom de famille (4). Chaque
  réglage s'applique d'abord à un seul dépôt et à une seule classe de tâches. Coût : moyen × moyen,
  plus la dépense en jetons du rejeu, soumise au feu vert humain. Exclut toute réécriture de
  doctrine dans ce cycle.
- **O3 — O2, plus l'audit de la doctrine de compensation dès maintenant.** Passer gabarits, oracles et
  `CLAUDE.md` à la sous-commande `prompt-audit` en parallèle du rejeu (opportunité 7). Coût :
  complexe × long. Exclut la prudence de la leçon du 10/08 : alléger des règles nées de défauts
  mesurés, avant de savoir si ces défauts ont disparu, rouvrirait des classes de défauts.
- **O4 — refondre le routage selon la recommandation de l'éditeur.** Opus 5.5 par défaut pour tous les
  rôles, Fable 5.1 sur escalade, Sonnet 5 pour le mécanique, sans rejeu. Coût : moyen × court. Exclut
  la règle de challenge du §4 (partir du modèle le moins cher plausible) et sa mesure.

## 5. Verdict

- **Option retenue : O2** — mesurer d'abord par un rejeu figé de 6 tâches de la Factory, puis régler
  l'effort, la longueur des sessions, l'effort des sous-agents et le nom de famille, par étapes.
- **Coût** : complexité moyen × durée moyen pour la préparation et l'exploitation ; la dépense du
  rejeu est estimée à environ 110 millions de jetons relus, 3,4 millions écrits en cache et
  1,1 million générés, soit de l'ordre de 70 à 110 $ au prix de liste si la facturation était au
  jeton (source : calcul du 2026-10-01 sur 38 exécutions en sessions neuves) ; au forfait, c'est du
  quota. Aucune dette de doctrine nouvelle.
- **Candidature(s) émise(s)** : 5 candidatures proposées (C-1 à C-5, section « Candidatures
  proposées »), non déposées au registre : cette étude n'écrit rien d'autre qu'elle-même.
- **Plan de revue** : 2026-10-15, sur les résultats du rejeu s'il a été autorisé, sinon sur 2 semaines
  de journaux à effort réglé par classe, avec les mêmes métriques que la section « Mesure ».
- **Test rétro** : chaque élément opérationnel du verdict remonte jusqu'à l'intention.
  - Le rejeu figé (opérationnel) mesure effort × modèle par classe de tâche (tactique) pour régler la
    Factory sur des mesures et non sur la réputation d'un modèle (stratégie), ce qui sert « le même
    travail plus vite, avec moins de jetons et de reprises, sans affaiblir la qualité » (intention).
  - L'effort par classe (opérationnel) agit sur la latence et le volume généré (tactique), donc sur
    la rapidité et les performances (stratégie et intention).
  - La session neuve par mandat (opérationnel) agit sur le contexte relu, le volume dominant
    (tactique), donc sur les performances et la rapidité (intention).
  - Le nom de famille au réglage (opérationnel) garde la détection des versions (tactique), donc la
    capacité de refaire cette revue au prochain saut (stratégie), ce qui sert le « fonctionnement »
    du demandeur.
  - L'effort des sous-agents (opérationnel) réduit le coût des campagnes (tactique et performances).
  - Questions du demandeur rejouées une à une : « fonctionnement » répond par P3 (routage) et P5
    (répétabilité) ; « process » par la ligne « Process » de la mesure, qui ne désigne pas les hooks
    comme goulot ; « performances » par le volume relu et le prix au mélange réel ; « qualité » par
    le taux de refus au premier passage et la prédiction 6 ; « rapidité » par la latence selon
    l'effort et le contexte. Aucun élément du verdict n'est retiré par cette remontée.

## Plan de rejeu contrôlé (protocole figé le 2026-10-01, non exécuté, feu vert de dépense requis)

Ce protocole fixe, avant tout résultat, ce qui sera rejoué, comment, et sur quels critères on
conclura. Il est écrit sur le modèle du protocole « personas par phase » du 14/09 et il ferme, une
fois joué, le re-test de la règle de challenge inscrit au référentiel des modèles en service.

**Hypothèses.** H1 : à qualité égale, Opus 5.5 à `medium` ou `high` égale Opus 5.5 à `max` sur les
tâches de la Factory, en moins de temps et de jetons. H2 : Sonnet 5 tient la qualité sur la classe
« production standard ». H3 : à effort égal, la part des restitutions refusées au premier passage
est plus basse sous Opus 5.5 que sous Opus 5. H4 : une session neuve par tâche réduit les jetons
relus par tâche close sans perte de qualité.

**Tâches figées (6)**, rejouées dans une copie isolée du dépôt (arbre de travail séparé), jamais sur
la branche principale, chacune avec son oracle :

- T1 : rédiger la restitution d'un tour fixé, jugée par `oracle-synthese.mjs` ;
- T2 : corriger un défaut d'oracle d'une forge sur une fixture rouge, jugé par sa recette ;
- T3 : analyser un prompt fixé en 8 couches, jugé par `check_markdown.py` et `oracle-premisse-acces.mjs` ;
- T4 : écrire une étude d'opportunité sur un candidat fixé, jugée par `oracle-etude-opportunite.mjs` ;
- T5 : critiquer une page HTML fixée, jugée par `run-oracles-design.mjs` ;
- T6 : une tâche mécanique (régénérer et vérifier un index), jugée par son contrôle.

**Configurations (5)** : K1 Opus 5.5 à `max` (l'état actuel) ; K2 Opus 5.5 à `high` ; K3 Opus 5.5 à
`medium` ; K4 Sonnet 5 à `high` ; K5 Opus 5 à `high`, référence historique tant qu'il est servi.
Chaque exécution part d'une session neuve. 30 exécutions (6 tâches × 5 configurations), plus 8
répétitions de K1 et K3 sur T1 à T4 pour mesurer la variance : 38 au total.

**Métriques**, relevées par le même script que cette étude : durée de travail, jetons générés, relus et
écrits par tâche close, verdict de l'oracle de la tâche au premier passage, nombre de réécritures
demandées par les hooks, intervention humaine (0 attendue).

**Critères de conclusion, figés.** Une configuration est retenue pour une classe de tâches si son
oracle passe au premier passage au moins aussi souvent que K1 et si la durée ou les jetons par tâche
close baissent d'au moins 25 %. Arrêt : au terme des 38 exécutions, ou au plafond de 150 millions de
jetons relus. Le résultat se consigne au référentiel des modèles en service (`clos_par`) et au
registre des runs avec `modele_version`, par décision humaine.

## Biais d'auto-évaluation

Cette étude est écrite par Opus 5.5, à l'effort `max`, sur le gain d'Opus 5.5 : son avis sur
lui-même ne vaut rien comme preuve. 3 parades sont tenues. Toutes les déclarations de l'éditeur sont
rangées en famille C et étiquetées comme telles. Le verdict ne recommande ni de changer de modèle ni
de garder celui-ci : il recommande de mesurer, et les mesures prévues sont jugées par des oracles
qui ne dépendent pas du modèle. Les écarts favorables à Opus 5.5 relevés ici (latence, refus au
hook) sont déclarés confondus, au même titre que les écarts défavorables (volume relu).

## Répétabilité

Le prochain changement de version sera détecté : depuis le 25/09, `oracle-modeles-en-service.mjs` lit
à chaque ouverture du pilot les versions servies, et inscrit le re-test comme dû. Ce qui manquait
était la manière de le jouer, et c'est le plan de rejeu ci-dessus : 6 tâches figées, 5
configurations, mêmes métriques, rejoué à chaque version nouvelle d'un modèle du tableau. 2
conditions le gardent utile. Le réglage du poste doit rester au nom de famille : un identifiant
épinglé, comme `claude-opus-5-5[1m]` aujourd'hui, garde la session sur une version quand la suivante
sort, et la détection mesure alors une version servie qui ne bouge plus. Les tâches figées doivent
rester inchangées d'un rejeu au suivant, sinon les rejeux ne se comparent pas.

**Pourquoi la règle de re-test n'a pas joué en septembre.** Le §4 ne se révisait qu'« à chaque
changement de famille », et Fable 5.1 comme Opus 5.5 sont restés dans la famille Claude 5. La règle
est corrigée depuis le 25/09 (TF-1420, statut corrigé) : toute nouvelle version d'un modèle du
tableau déclenche désormais le re-test.

## Hors étude

Ces mécanismes ne sont touchés par aucune différence des familles B ou C, ou aucune mesure ne les
relie à un goulot ; chacun porte son critère de réouverture.

- **Famille A, l'interface de programmation** : sans objet tant que le parc n'appelle pas l'interface ;
  réouverture au premier appel direct relevé dans le code.
- **Lecture des graphiques et captures** (critique de rendu de forge-design) : réouverture si un rendu
  jugé conforme est contesté sur un détail visuel.
- **Usage de l'ordinateur et mode rapide** : non employés par la Factory ; réouverture à leur premier
  usage.
- **Contrôle d'épinglage de forge-tests** : déjà au registre sous TF-1419 ; réouverture à sa décision.
- **Allègement de la doctrine** (opportunité 7) : réouverture si le rejeu confirme H3, la baisse des
  refus au premier passage à effort et juge égaux.

## Candidatures proposées

5 candidatures découlent du verdict. Aucune n'est déposée : le prompt de cette étude interdit
d'écrire au registre, et leur ouverture vous revient.

- **C-1 — Effort par classe de tâche** : régler l'effort de chaque classe sur le résultat du rejeu, à
  commencer par un dépôt ; tant que le rejeu n'a pas eu lieu, rien ne change.
- **C-2 — Session neuve par mandat et seuil de contexte** : ouvrir une session neuve par mandat, et
  déclarer un seuil de contexte au-delà duquel la session se clôt et se reprend ; mesure de clôture :
  jetons relus par tâche close.
- **C-3 — Plan de rejeu** : jouer le protocole figé ci-dessus, sur feu vert de dépense ; il ferme le
  re-test dû et teste les hypothèses H1 à H4.
- **C-4 — Réglage du poste au nom de famille** : remplacer `claude-opus-5-5[1m]` par `opus[1m]`, comme
  la règle du 25/09 le demande, et rejouer `oracle-modeles-en-service.mjs`.
- **C-5 — Effort des sous-agents** : déclarer l'effort des agents compilés et des sous-agents de
  campagne, `low` ou `medium` selon la classe, au lieu de l'héritage de la session.

Tu veux que j'ouvre ces candidatures ?
