---
destinataire: humain
lecteur: le porteur de la Factory, qui décide des process à garder, changer ou retirer
---

# Étude — un œil critique global sur les process de la Factory, des forges et des produits (20/10/2026)

Exécutée le 20/10/2026 sur votre réponse « exécute le prompt », lue comme D-59 (a). Prompt : chapitre 8 de `output\03-etudes\20261020-L99-oeil-critique-global-des-process.md`.

En bref : la Factory corrige vite (605 items corrigés sur 681 en 30 jours, délai médian 6 h), mais elle corrige surtout elle-même et ne retire presque rien. En 30 jours, son code et sa doctrine ont gagné 95 112 lignes et en ont perdu 6 762. Le gabarit de restitution est passé de 52 à 182 Ko en 7 semaines. 44 % des items du registre portent sur l'appareil de contrôle lui-même, et 2 refus de fin de tour sur 3 sanctionnent un format absent, pas un défaut de fond. L'œil critique proposé ici juge chaque process par ce qu'il rend aux demandes, et il a le droit de proposer des suppressions. Les 12 scénarios de la section 9 en sont les premiers résultats possibles.

## 1. L'intention, et ce que l'étude du matin en a manqué

Vos 2 demandes du 20/10/2026, citées mot pour mot :

1. « Je souhaite qu'un "agent" (à confirmer) s'assure de la logique des traitements qui tournent et puisse remonter ce qui lui parait incohérent dans les différents process, activités, résultats (comme cet exemple, mais pas que, cela doit être pris au sens large) afin d'améliorer en continu, d'un point de vue haut, tous les process de la Factory, des forges et des produits qui les utilisent. »
2. « L'intention n'est pas de vérifier qu'une correction est faite. L'intention est d'avoir un oeil critique sur les solutions mises en oeuvre, de façon globale […]. Prends de la hauteur sur l'intention pour s'assurer que les process construits et en cours sont les mieux à même de répondre aux demandes, et d'identifier automatiquement les process à améliorer, lesquels, comment, pourquoi, avec quels ajouts, modifications, optimisations et suppressions. »

L'étude du matin a pris l'exemple des 19 minutes pour le cadre. Elle a jugé si une correction tenait en service, alors que vous demandiez si les solutions elles-mêmes sont les bonnes. Son relecteur d'intention a rendu « sert » (`todo\relectures-intention.jsonl`, RI-20261020-12). Ses 3 constats (TF-1939 à TF-1941) sont repris ici comme 3 entrées parmi d'autres.

Comment lire le tableau : une ligne par phrase de la demande 2, avec la section de l'étude qui y répond.

| Phrase de la demande 2 | Section |
|---|---|
| « un oeil critique sur les solutions mises en oeuvre, de façon globale » | 2 (inventaire), 4 (périmètres) |
| « s'assurer que les process construits et en cours sont les mieux à même de répondre aux demandes » | 3 (critères et mesure) |
| « identifier automatiquement les process à améliorer » | 8 (mécanisme) |
| « lesquels, comment, pourquoi » | 4 et 9 |
| « avec quels ajouts, modifications, optimisations et suppressions » | 5 (leviers), 9 (scénarios) |
| « les périmètres sur lesquels intervenir » (consigne du prompt) | 4 |
| « les impacts de ces décisions dans les process et constructions » | 6 |
| « la façon dont cette amélioration continue aura des impacts sur la qualité » | 7 |
| « des scénarios d'amélioration (10 environ) » | 9 |

## 2. Inventaire des process, chiffré et recompté

Chaque chiffre a été recompté le 20/10/2026 entre 14:01 et 14:40, par `git`, `ls` et les scripts de la session. Comment lire : une ligne par famille de process, avec sa taille aujourd'hui et sa taille au 01/09/2026, pour voir la pente.

| Famille | Aujourd'hui | Au 01/09/2026 | Source |
|---|---|---|---|
| Règles du projet (R) | 49 | 34 | `REGLES-PROJET.md` |
| Règles de restitution (S) | 83 | 34 | `oracles\oracle-synthese.mjs` |
| Gabarit de restitution | 182 Ko | 52 Ko | `gabarits\RESTITUTION.md` |
| Noyau `CLAUDE.md` | 6,1 Ko | 6,1 Ko | plafonné par `oracle-claude-md.mjs` |
| Oracles du pilot | 90 | 37 | `oracles\*.mjs` hors tests |
| Scripts du pilot | 62 | 18 | `scripts\*.mjs` hors tests |
| Gabarits, références | 19, 29 | — | `gabarits\`, `references\` |
| Classes de défaut | 161 | — | `todo\CLASSES.json` |
| Hooks du pilot | 14 entrées sur 5 événements | — | `.claude\settings.json` |
| Skills installés | 34 | — | `~\.claude\skills\` |
| Forges | 13 dépôts, 304 commits en 30 jours, dont 173 dans forge-agents | — | `git log --since=2026-09-20`, recompté |
| Produits suivis | 39 dépôts | — | relevé d'ouverture du 20/10 |
| Contexte injecté à l'ouverture d'une session du pilot | 22 858 caractères (médiane de 31 sessions) | — | transcripts du 13/10 au 20/10 |

Appels réels des process du 20/09 au 20/10 (relevé d'agent sur 933 transcripts et 70 284 appels d'outils, intégré après la première remise) :

- sur 606 process, aucun process suivi par git n'est orphelin ; les 86 orphelins sont des modules Python non suivis, embarqués dans les skills de forge-agents ;
- au pilot, 192 process sur 210 sont appelés, et 18 ne sont que câblés ;
- 5 gabarits et références n'ont été lus par aucune session en 30 jours : `AVANCEMENT-PROCESS.md`, `GABARIT-LOT-RELAIS.md`, `INSATISFACTION.md`, `INTEGRATIONS.md`, `PRODUCTION-OOXML.md`. Recompte partiel : 4 mentions de `INSATISFACTION.md`, qui peuvent viser `AGENT-INSATISFACTION.md` ;
- les plus appelés sont le skill `quality-oracles` (3 075 appels, dont 799 depuis des produits), le skill `digit-ai-page-html` (3 060) et `oracle-synthese.mjs` (2 426, et 6 262 lignes, le plus gros process suivi).

## 3. Critères d'adéquation aux demandes, et première mesure

Un process est « le mieux à même de répondre aux demandes » s'il améliore ce que reçoit le demandeur sans coûter plus qu'il ne rend. Comment lire : une ligne par critère du prompt, avec la mesure de ce cycle, sa source, et ce qu'elle dit.

| Critère | Mesure du 20/10/2026 | Source | Lecture |
|---|---|---|---|
| a. Acceptation au premier passage | Non mesurée par livrable ; approchée par le critère b | relevé A | Il faudrait relier chaque reprise au livrable qu'elle vise |
| b. Reprises demandées par l'humain | 787 messages humains en 30 jours, dans 228 sessions, prompts de scripts exclus. Sur un échantillon de 60 : 27 nouvelles demandes, 18 réponses de décision, 12 reprises, 3 autres. Environ 1 message sur 5 est une reprise (intervalle à 95 % : 12 à 32 %) | relevé A (agent, échantillon classé à la main, graine 20261020) | Une demande sur 5 environ revient corriger ce qui a été rendu |
| c. Attente humaine | 395 min d'envois git au premier plan du 06/10 au 20/10 ; 141 min perdues par la régression du pre-push ; 134 min de reprise après 149 refus de fin de tour | étude du matin, section 1 bis | L'attente vient surtout des gardes, pas du travail |
| d. Charge de décision humaine | 47 décisions posées du 17/10 au 20/10 (D-13 à D-59), dont 19 le 18/10 ; au moins 125 messages de réponse courte (« 58a ») en 30 jours. Le registre ne garde ni la réponse ni son délai | `decisions\REGISTRE.jsonl`, recompté ; relevé A | Environ 12 décisions par jour arrivent à l'humain |
| e. Coût | 55 relectures d'intention depuis le 18/10 ; 2 385 011 jetons pour les 30 premières ; 22 858 caractères injectés à chaque ouverture | `todo\relectures-intention.jsonl`, relevé de flotte, transcripts | Les contrôles par agent coûtent cher |
| f. Défauts échappés | 166 items de la famille « règle morte » sur 681, dont 82 faux positifs d'oracle et 40 contrôles « vrais sur le mauvais invariant » | `todo\TODO.jsonl`, items du 20/09 au 20/10 | Les contrôles eux-mêmes produisent des défauts |
| g. Process sans demande, demande sans process | Aucun process suivi n'est orphelin ; 5 gabarits et références ne sont lus par aucune session en 30 jours ; forge-observability n'a aucun commit en 30 jours. Les demandes sans process ne sont pas mesurées | relevé d'agent sur 606 process ; `git log`, recompté | Le parc est employé ; c'est sa taille, pas son abandon, qui coûte |

3 mesures structurelles complètent ce tableau :

- **La Factory travaille surtout sur elle-même.** 303 des 681 items du registre (44 %) portent sur l'appareil de contrôle : règles mortes (166), oracles ou skills non invoqués (91), hooks et gardes (46).
- **Elle ajoute 14 fois plus qu'elle ne retire.** Du 20/09 au 20/10, hors livrables : 963 fichiers ajoutés contre 195 supprimés, et 95 112 lignes ajoutées contre 6 762 retirées. Seul le noyau `CLAUDE.md`, plafonné par un oracle, n'a pas grossi.
- **Le contrôle de fin de tour sanctionne surtout la forme.** Sur 250 refus du 20/09 au 20/10, la règle S6 (actions sans acteur) apparaît 173 fois, S4 (décision sans choix fermé) 164 fois, S3 (verdict sans fait) 162 fois et S1 (bloc absent) 161 fois. Viennent ensuite PRÉJUGEMENT (57), S48 (38) et AFFICHAGE (36). 77 des 83 règles S n'apparaissent dans aucun refus ; leur effet au préjugement, avant affichage, n'est pas mesuré.

## 4. Périmètres d'intervention

Comment lire : un périmètre par ligne ; « Sert bien » et « Sert mal » disent ce que la mesure montre pour les demandes ; la dernière colonne renvoie aux scénarios.

| Périmètre | Sert bien | Sert mal | Scénarios |
|---|---|---|---|
| Noyau et gouvernance | Noyau plafonné à 6 Ko et stable ; décisions tracées | 49 règles R ; aucune règle n'a de date de revue ni de critère de retrait | 1, 11 |
| Restitution et décisions | Reprise de contexte entre sessions ; décisions au format fermé | Gabarit ×3,5 en 7 semaines ; 2 refus sur 3 pour format absent | 2, 3 |
| Qualité et oracles | Correction rapide (6 h de délai médian) | 82 faux positifs, 2 023 jugements SKIP, 4 domaines sans échec sur 662 passages | 4, 5 |
| Hooks et garde-fous | Garde des noms efficace pour un dépôt public | 22 858 caractères à chaque ouverture ; 21 familles d'avertissements récurrents | 6 |
| Registres et boucle d'amélioration | Tout constat entre au registre | 681 items en 30 jours, 40 % déclarés récidives ; gain constaté sur le lieu de la correction | 7 |
| Publication et postes | Porte de publication à 35 s depuis TF-1937 | Numéros (TF, D, indices) frappés en double entre 2 postes | 8 |
| Agents et flotte | Relevés délégués rapides | 33 % des appels vers un agent nommé ; un relecteur d'intention a laissé passer la dérive du matin | 9 |
| Forges de chaîne | Conception à MEP outillée | Peu de commits en 30 jours : conception 15, development 2, tests 23 ; leur usage par les produits n'est pas mesuré | 10 |
| Forges transverses | forge-agents très active (173 commits) | forge-observability : 0 commit en 30 jours, alors qu'elle porte l'observation continue | 10 |
| Produits | Retours par lots (14 lots, 5 produits en 30 jours) | Gabarit hérité de 25,8 Ko, plus de 4 fois le noyau du pilot ; aucune insatisfaction inscrite depuis le 14/09 | 11, 12 |

## 5. Façons d'intervenir, et la preuve exigée pour chacune

Comment lire : un levier par ligne, avec quand l'employer et ce qu'il faut prouver avant d'agir.

| Levier | Quand | Preuve exigée avant d'agir |
|---|---|---|
| Ajouter | Une demande qu'aucun process ne sert, mesurée sur le corpus | La demande récurrente (au moins 3 occurrences) et l'existant le plus proche, cité |
| Modifier | Un process qui sert mal sa demande (reprises, faux positifs) | Le défaut mesuré et un cas rouge qui passe vert après |
| Optimiser | Un process juste mais coûteux (attente, jetons) | La durée ou le coût mesuré, avant et après, en service |
| Fusionner | 2 process qui jugent la même chose | Les 2 rejoués sur le même corpus : le fusionné trouve au moins autant |
| Supprimer | Un process que rien n'appelle, ou qui ne trouve rien et coûte | Rejeu sur l'historique ou banc des défauts échappés (TF-1073) : aucun défaut ne passe. Une garde de sécurité ou de confidentialité ne se supprime jamais sur son seul silence |
| Automatiser | Un geste humain répété qu'une voie automatique peut faire (loi n° 5) | Les voies essayées et leurs codes de retour |
| Rendre à l'humain | Un contrôle automatique qui se trompe plus qu'il ne protège | Son taux de faux positifs mesuré, et le jugement humain qui le remplace |

## 6. Impacts des interventions

Chaque intervention se juge sur 6 axes. Comment lire : une ligne par axe, avec la question à poser et la source de la réponse.

| Axe | Question | Où le mesurer |
|---|---|---|
| Process dépendants | Qui appelle ce process, qui le cite ? | `git grep` du nom ; hooks ; relevé B |
| Recettes et oracles | Quelle recette du harnais le rejoue, et faut-il un cas neuf dans ses fixtures rouge et verte ? | harnais du pilot, bancs de fixtures |
| Produits par l'héritage | Combien de produits reçoivent la règle ou le gabarit ? | relevé d'héritage (R-47), 39 produits |
| Charge humaine | Ajoute-t-il ou retire-t-il une décision, une attente ? | critères c et d de la section 3 |
| Coût | Jetons et minutes par passage | relevé de flotte, transcripts |
| Réversibilité | Peut-on revenir en arrière, et en combien de gestes ? | git ; une suppression se garde en historique |

## 7. Effet de l'amélioration continue sur la qualité

L'amélioration continue n'a d'effet que si sa boucle se ferme : observer, proposer, décider, puis mesurer l'effet en service. Comment lire : un indicateur par ligne, avec sa valeur de départ, son horizon et l'effet attendu sur la qualité.

| Indicateur | Type | Départ (20/10/2026) | Effet attendu sur la qualité |
|---|---|---|---|
| Reprises humaines par message | Résultat, sur un mois | Environ 20 % (de 12 à 32 %) | Les livrables servent l'intention dès le premier passage |
| Refus de fin de tour pour format absent | Avancé, à la semaine | 161 à 173 sur 250 en 30 jours | Le format coûte moins, l'attention va au fond |
| Lignes ajoutées par ligne retirée | Avancé, à la semaine | 14 | La Factory cesse de grossir sans contrepartie |
| Taille du gabarit de restitution | Avancé | 182 Ko | Une session lit moins de règles, et les applique mieux |
| Part des items qui portent sur l'appareil de contrôle | Résultat | 44 % | Le travail revient aux livrables des produits |
| Faux positifs d'oracle par mois | Résultat | 82 items en 30 jours | Un vert et un rouge se croient |
| Attente humaine au premier plan | Avancé | 395 min en 14 jours (envois git) | Moins de temps perdu à attendre |

Le risque inverse existe : alléger peut laisser passer des défauts. C'est pourquoi chaque suppression passe la preuve de la section 5, et pourquoi les défauts échappés (critère f) restent suivis.

## 8. Le mécanisme de l'œil critique

L'œil critique combine des relevés déterministes, qui mesurent, et un agent de jugement, qui lit ces mesures contre les demandes et propose. Comment lire : une ligne par élément du mécanisme.

| Élément | Contenu |
|---|---|
| Entrées | Les scripts de ce cycle, rejouables : envois et hooks, croissance, ajouts et suppressions, refus par règle, registre sur 30 jours, process appelés ou orphelins, contexte injecté ; plus le corpus de demandes filtré (relevé A) |
| Cadence | Relevés : chaque semaine, à coût nul en jetons. Jugement : chaque mois, ou quand un indicateur de la section 7 franchit un seuil |
| Sortie | Au plus 5 propositions par cycle, au gabarit de la section 9, classées par gain attendu ; au moins 1 suppression ou fusion par cycle si une candidate passe la preuve |
| Autorité | Il juge et propose ; le pilot décide ; rien n'est retiré sans la preuve de la section 5 |
| Mesure de lui-même | Part de ses propositions acceptées, gain constaté en service 1 mois après, et faux constats |
| Retrait | S'il n'a fait accepter aucune proposition en 2 cycles, ou si l'humain trouve plus d'incohérences que lui, il est revu ou retiré |

Comparaison des formes, sur ce cycle. Les scripts déterministes ont produit les mesures les plus fortes (croissance, refus par règle, registre), sans jeton. Les agents de relevé ont coûté de 30 000 à 96 000 jetons chacun, et un chiffre d'agent sur 2 recompté s'écartait de la source. L'un d'eux a aussi échoué, faute d'avoir l'outil que ma consigne exigeait. Le jugement, lui, ne se scripte pas : relier une reprise humaine au process qui l'a causée, ou voir que l'exemple d'une demande a été pris pour son cadre, demande un modèle fort. La combinaison est donc retenue : scripts pour mesurer, agent pour juger.

## 9. Scénarios d'amélioration

12 scénarios, classés par gain attendu. Chacun porte : déclencheur, process visé, diagnostic, levier, existant le plus proche, impact, gain, coût et mesure de succès. Répartition comptée en fin de section.

**Scénario 1 — Un budget de taille pour la restitution.**

- Déclencheur : `gabarits\RESTITUTION.md` est passé de 52 à 182 Ko et de 34 à 83 règles S entre le 01/09 et le 20/10 (`croissance.sh`).
- Process visé : gabarit de restitution et `oracle-synthese`.
- Diagnostic : chaque défaut de restitution ajoute une règle ; aucune ne sort.
- Levier : optimisation et fusion. Un plafond, comme celui du noyau ; toute règle neuve en fusionne ou en retire une autre.
- Existant le plus proche : `oracle-claude-md.mjs`, qui plafonne `CLAUDE.md` à 6 Ko. Le scénario étend ce plafond au gabarit.
- Impact : les produits héritent du gabarit ; recette d'`oracle-synthese` à rejouer ; réversible.
- Gain : une restitution plus courte à écrire et à lire, moins de refus.
- Coût : moyen × court.
- Mesure de succès : gabarit sous le plafond, et refus de fin de tour en baisse sur 1 mois.

**Scénario 2 — Retirer les règles S qui ne refusent rien.**

- Déclencheur : 77 des 83 règles S n'apparaissent dans aucun des 250 refus du 20/09 au 20/10 (`regles-qui-refusent.mjs`).
- Process visé : `oracle-synthese`.
- Diagnostic : à mesurer d'abord. Une règle peut agir au préjugement, avant tout refus.
- Levier : suppression ou passage en avertissement, après rejeu.
- Existant le plus proche : la classe « règle morte » du registre, qui traite une règle à la fois. Le scénario traite le stock.
- Impact : recette d'`oracle-synthese` ; produits ; réversible.
- Gain : moins de règles à appliquer à chaque tour.
- Coût : moyen × moyen.
- Mesure de succès : chaque règle retirée rejouée sur les 45 restitutions scellées, sans défaut nouveau laissé passer.

**Scénario 3 — Une réponse courte n'est pas une restitution manquée.**

- Déclencheur : environ 2 refus sur 3 sanctionnent un format absent (S1, S3, S4, S6 : 161 à 173 refus sur 250). Ils tombent souvent sur un message court ou un point d'étape.
- Process visé : hook de fin de tour, `references\NIVEAUX.md`.
- Diagnostic : le niveau du message n'est pas reconnu avant le jugement, et la session réécrit une restitution complète pour une réponse simple.
- Levier : modification. Le hook classe le niveau d'abord, puis applique la grille de ce niveau.
- Existant le plus proche : `references\NIVEAUX.md` (niveau Simple), qui existe mais ne prévient pas ces refus.
- Impact : hook du pilot et des produits ; réversible.
- Gain : une part des 134 min de reprise après refus mesurées du 06/10 au 20/10 (relevé d'agent, non recompté).
- Coût : moyen × court.
- Mesure de succès : refus S1 à S6 divisés par 2 en 1 mois, sans baisse de la qualité des restitutions de travail.

**Scénario 4 — Les faux positifs d'oracle traités comme une famille.**

- Déclencheur : 82 items « oracle-faux-positif » et 40 « contrôle vrai sur le mauvais invariant » en 30 jours (`registre-30j.mjs`).
- Process visé : les oracles du socle et du pilot.
- Diagnostic : chaque faux positif est corrigé dans son oracle, puis le suivant arrive. Les règles naissent sans mesure de leur bruit sur un corpus large.
- Levier : modification. Toute règle neuve passe un corpus de bruit commun (pilot, forges, produits) avant d'être bloquante.
- Existant le plus proche : la classe « regle-neuve-sans-mesure-de-bruit », qui constate le défaut sans l'empêcher.
- Impact : chaque forge qui écrit des oracles ; réversible.
- Gain : moins d'items, et des verdicts qu'on croit.
- Coût : moyen × moyen.
- Mesure de succès : faux positifs de 82 à moins de 30 par mois.

**Scénario 5 — Un oracle ne juge qu'au moment où il peut trouver quelque chose.**

- Déclencheur : 4 domaines sans échec sur 662 passages, et 2 023 jugements SKIP depuis le 20/09 (TF-1941).
- Process visé : `run-oracles` à chaque écriture de document.
- Diagnostic : des domaines tournent à chaque écriture sans rien trouver, et d'autres rendent SKIP faute de pouvoir juger.
- Levier : optimisation. Le domaine est déclenché à la publication plutôt qu'à chaque écriture, et un domaine SKIP n'est plus lancé sur ce type de fichier.
- Existant le plus proche : TF-1941, qui propose la mesure.
- Impact : hooks d'écriture ; aucune garde de sécurité retirée ; réversible.
- Gain : temps d'écriture et bruit en moins.
- Coût : simple × court.
- Mesure de succès : durée des hooks d'écriture en baisse, sans défaut échappé nouveau.

**Scénario 6 — L'ouverture de session ne dit que ce qui a changé et ce qui demande un geste.**

- Déclencheur : 22 858 caractères injectés à chaque ouverture ; 21 familles d'avertissements récurrents, dont 7 reviennent après leur « corrigé » ; « Visibilité NON mesurée » dans 30 sessions sur 55 (TF-1940).
- Process visé : `oracles\hook-ouverture.mjs` et le relevé d'ouverture.
- Diagnostic : un relevé complet à chaque ouverture devient un bruit de fond, qu'on ne lit plus.
- Levier : suppression des répétitions et modification. N'afficher que le différentiel depuis la dernière session et ce qui demande une action.
- Existant le plus proche : le relevé lui-même. Le scénario en retire les répétitions.
- Impact : toutes les sessions du pilot ; réversible.
- Gain : contexte libéré, alertes de nouveau lues.
- Coût : moyen × court.
- Mesure de succès : contexte d'ouverture divisé par 3 ; aucun avertissement répété plus de 5 sessions sans item ouvert.

**Scénario 7 — Un gain se constate là où l'utilisateur le vit.**

- Déclencheur : TF-1555 clos le 13/10 sur un gain mesuré à blanc, puis 25 envois réels ont attendu jusqu'au 20/10 (TF-1939). Dans l'échantillon de 5 items corrigés, les 5 gains sont mesurés sur bancs ou fixtures.
- Process visé : la clôture des items (`references\TODO-FORGE.md`).
- Diagnostic : le gain est vrai sur le lieu de la correction, pas toujours en service.
- Levier : modification. Pour un item qui touche l'expérience de l'humain, le gain se remesure en service une semaine après.
- Existant le plus proche : « clôture sur gains constatés ».
- Impact : registre et forges ; réversible.
- Gain : une régression vue en 1 semaine, et non en 8 jours par l'humain.
- Coût : simple × court.
- Mesure de succès : aucune régression trouvée par l'humain sur un item clos depuis moins de 30 jours.

**Scénario 8 — Un seul distributeur de numéros pour les 2 postes.**

- Déclencheur : les mémoires de session décrivent des numéros TF et D frappés des 2 côtés, puis renumérotés. Le relevé d'ouverture du 20/10 signale 3 indices de livrable partagés.
- Process visé : `scripts\reserver-decision.mjs`, `allouer-indice.mjs`, numérotation TF.
- Diagnostic : chaque poste numérote localement, et la fusion coûte une renumérotation manuelle.
- Levier : modification. Les numéros se réservent sur le distant avant usage, ou portent un suffixe de poste.
- Existant le plus proche : `reserver-decision.mjs`, local à un poste.
- Impact : 2 postes, registres ; réversible.
- Gain : plus de renumérotation à la fusion.
- Coût : moyen × court.
- Mesure de succès : 0 collision de numéro sur 1 mois.

**Scénario 9 — Un seul relecteur d'intention, mesuré.**

- Déclencheur : 5 mécanismes jugent l'intention (règle S51, relecture d'intention, contre-expertise, arbitre de la-boucle, relecteur aveugle L99). Celui qui tourne partout a rendu « sert » sur l'étude que vous avez rejetée (RI-20261020-12). 55 relectures depuis le 18/10.
- Process visé : relecture d'intention et ses voisins.
- Diagnostic : le relecteur voit la demande, mais il ne vérifie pas que l'exemple n'est pas devenu le cadre.
- Levier : fusion et modification. Un relecteur unique, avec une question ajoutée : « le livrable a-t-il pris un exemple de la demande pour son périmètre ? ».
- Existant le plus proche : `references\RELECTURE-INTENTION.md`, en essai jusqu'au 01/11/2026.
- Impact : sessions et agents ; produits ; réversible.
- Gain : moins de jetons, plus de dérives vues.
- Coût : moyen × court.
- Mesure de succès : la dérive du matin détectée au rejeu ; coût par relecture en baisse.

**Scénario 10 — Les forges servent les demandes des produits avant celles du pilot.**

- Déclencheur : 52 % des sujets de commit des forges citent un TF du pilot (157 sur 304, recompté). forge-observability n'a aucun commit en 30 jours.
- Process visé : priorisation du travail des forges.
- Diagnostic : à confirmer. Les forges avancent surtout au rythme des défauts du pilot. La forge chargée d'observer ne bouge pas.
- Levier : modification de la priorisation ; fusion ou mise en sommeil déclarée d'une forge inactive.
- Existant le plus proche : la revue hebdomadaire des propositions (`references\TODO-FORGE.md`).
- Impact : 13 forges ; réversible.
- Gain : non chiffré ; il dépend de la part du travail des forges tirée par les produits, que ce cycle n'a pas mesurée.
- Coût : moyen × moyen.
- Mesure de succès : part des items d'origine produit dans le travail des forges, suivie chaque mois.

**Scénario 11 — Ce que les produits n'emploient pas ne leur est plus imposé.**

- Déclencheur : le gabarit `gabarits\CLAUDE-PRODUIT.md` que reçoit chaque produit pèse 25,8 Ko, contre 6 Ko pour le noyau plafonné du pilot. Ce que les produits appellent réellement n'est pas encore mesuré : le diagnostic ci-dessous est une hypothèse.
- Process visé : gabarit `gabarits\CLAUDE-PRODUIT.md`, hooks et règles hérités.
- Diagnostic : l'héritage pousse tout le pilot vers 39 produits, qu'ils l'emploient ou non.
- Levier : suppression dans l'héritage, avec maintien au pilot.
- Existant le plus proche : le relevé d'héritage (R-47).
- Impact : 39 produits ; réversible par réinstallation.
- Gain : sessions des produits plus légères.
- Coût : moyen × moyen.
- Mesure de succès : contexte d'ouverture des produits en baisse, et défauts des produits stables.

**Scénario 12 — Les insatisfactions des produits deviennent la première source de l'œil critique.**

- Déclencheur : 5 insatisfactions instruites (`output\05-insatisfactions\`), sur 2 produits : menus, comptes de démonstration, panier inactif. La dernière date du 14/09 ; depuis, aucune, alors qu'environ 1 message humain sur 5 est une reprise (section 3, critère b). Le gabarit `gabarits\INSATISFACTION.md` n'a été lu par aucune session en 30 jours (relevé d'agent).
- Process visé : le registre des insatisfactions (`insatisfactions\REGISTRE.jsonl`), la chaîne tests et MEP des forges, et l'œil critique lui-même.
- Diagnostic : le process qui devait recueillir le mécontentement ne reçoit plus rien ; les reprises passent dans la conversation et s'y perdent.
- Levier : automatisation et ajout. Une reprise détectée dans la conversation crée son insatisfaction ; chacune remonte au process qui aurait dû la voir, et devient un cas du banc des défauts échappés.
- Existant le plus proche : le banc des défauts échappés (TF-1073), aujourd'hui de 9 cas.
- Impact : forge-tests et forge-design ; produits ; réversible.
- Gain : les contrôles apprennent de l'utilisateur final.
- Coût : moyen × court.
- Mesure de succès : chaque insatisfaction nouvelle a son cas au banc dans la semaine.

Répartition comptée : 10 périmètres touchés sur 10 ; 6 scénarios de suppression, fusion ou allègement (1, 2, 5, 6, 9, 11) ; 3 qui touchent les produits (10, 11, 12) ; 2 sur la publication et les hooks (6, 8).

## 10. État de l'art daté

Comment lire : une source par ligne, avec sa date, ce qu'elle apporte et le scénario ou le critère qu'elle soutient.

| Source | Date | Apport | Rattachement |
|---|---|---|---|
| Google Cloud, rapport DORA « State of AI-assisted Software Development », https://blog.google/technology/developers/dora-report-2025/ | 23/09/2025 | L'IA amplifie les forces et les dysfonctions d'une organisation ; peu d'équipes gagnent en débit sans hausse des échecs | Critère a, section 7 |
| Anthropic, « Effective context engineering for AI agents », https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | 29/09/2025 | Le plus petit ensemble de jetons à fort signal ; des outils qui se recouvrent sont un échec courant | Scénarios 1, 6, 9 |
| Anthropic, « Building effective agents », résumé par plusieurs sources secondaires (l'original n'a pas été relu ici) | 12/2024 | Commencer par le système le plus simple qui marche, n'ajouter de complexité que si le gain est clair | Section 8 |
| Hu, Lu, Clune, « Automated Design of Agentic Systems » (ADAS), ICLR | 2025 | Un méta-agent peut concevoir et améliorer des systèmes d'agents | Section 8 |
| Robeyns et al., « A Self-Improving Coding Agent », https://arxiv.org/abs/2504.15228 | 04/2025 | Un agent qui modifie son propre code pour son coût, sa vitesse et ses résultats | Section 8 |
| Adams et al., « People systematically overlook subtractive changes », Nature 592 | 04/2021, hors de la fenêtre de 24 mois | On pense à ajouter avant de retirer : 11 % de 651 propositions retiraient quelque chose | Section 5, scénarios 1, 2 |

5 sources ont moins de 24 mois. La 6e est plus ancienne, et citée parce qu'elle explique le rapport de 14 lignes ajoutées pour 1 retirée.

## 11. Ce que l'étude n'a pas mesuré

- L'effet des 77 règles S au préjugement, avant affichage : aucune trace n'en est gardée.
- L'acceptation au premier passage par livrable, et le lien de chaque reprise au process qui l'a causée : l'échantillon de 60 messages donne une part, pas une cause.
- Le délai et le sens des réponses aux décisions : le registre ne garde que leur pose.
- Les process internes des produits : seuls leurs appels aux process de la Factory sont relevés.
- Le texte original de « Building effective agents » : seules des sources secondaires ont été lues.
- Ce que chaque produit emploie de son héritage, process par process : le relevé des appels distingue les sessions de produits en bloc, pas produit par produit. Le scénario 11 reste une hypothèse.
- Les appels de 9 process dont le nom est partagé (dont `self-test.mjs`, 22 fichiers) : leurs comptes sont des planchers.
- Jetons dépensés : 307 195 par les 5 sous-agents (relecture des consignes 30 151, demandes 98 088, forges et lots 43 443, appels des process 98 704, relecteur aveugle 36 809) ; session principale non relevée par appel. Total sous le budget de 600 000.
