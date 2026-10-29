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
| 8 | Limite du harnais inconnue : aucun plafond documenté pour l'outil Agent ; l'outil Workflow, lui, vise moins de 10 agents par défaut et exige l'accord explicite de l'humain | majeur | Étape 0, relevé des limites |
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

Le prompt passe de 27 à 84 projetés. La réécriture garde l'intention, accélérer les campagnes, et la rend mesurable, outillée et bornée.

### Score

Comment lire le tableau : une ligne par dimension, la note avant et la note projetée après réécriture ; le score d'arrivée est une estimation de l'auteur, non mesurée par un relecteur aveugle.

| Dimension | Avant | Après (projeté, non mesuré) |
|---|---|---|
| Clarté de l'intention | 8 | 17 |
| Spécification | 3 | 17 |
| Garde-fous et contraintes | 2 | 13 |
| Ancrage et contexte | 9 | 13 |
| Vérifiabilité de la sortie | 2 | 13 |
| Robustesse | 3 | 11 |
| **Total** | **27** | **84 (projeté, non mesuré)** |

### Diagnostic

Intention juste, née d'un constat mesuré. Mais rien ne dit quoi optimiser, quoi livrer, ni comment prouver le gain. Le prompt réduit un problème à trois leviers (découpage, isolation, réception) au seul nombre d'agents.

### Prompt réécrit

```text
Suite de A-1 et A-2 (réponse de 17:31, 29/10/2026) : construis une nouvelle stratégie de
lancement des agents d'une campagne, qui calcule leur nombre au lieu de le fixer, pour réduire
la durée des campagnes.

OBJECTIF. Réduire la durée de bout en bout d'une campagne à agents (du lancement du premier
agent au dernier rapport traité), sous trois contraintes : zéro conflit de fusion entre agents,
jetons totaux de la campagne au plus 20 % au-dessus de la référence, aucune baisse du taux de
sujets clos.

ÉTAPE 0 — RÉFÉRENCE (lecture seule, avant toute écriture).
- Relève la campagne des 38 candidats du 29/10/2026 (session 2071e2c2, à partir de 16:10) avec
  `node scripts/relever-flotte.mjs --depuis <début> --journal <journal> --etiquette <campagne>` :
  durée par agent, jetons, appels d'outils, durée totale, conflits à la fusion.
- Relève les limites du harnais : plafond d'agents simultanés de l'outil Agent (documentation,
  sinon « non documenté »), règles de l'outil Workflow. N'émets aucun appel coûteux pour les
  mesurer.
- Si la campagne du 29/10 n'est pas finie, attends sa fin ; ne touche jamais une session en cours.

ÉTAPE 1 — RÈGLE DE DÉCOUPAGE.
- Pour chaque sujet, estime les fichiers touchés à partir des chemins qu'il cite ; un sujet sans
  chemin forme un groupe à part.
- Deux sujets qui partagent un fichier vont dans le même groupe (composantes connexes).
- Répartis les groupes entre agents en équilibrant la charge estimée : la durée d'une campagne est
  celle de son plus long agent.
- Le nombre d'agents est le résultat : min(nombre de groupes, plafond). Le plafond vit dans un
  référentiel daté et sourcé (loi n° 4), jamais dans le code.
- Un sujet trop petit pour payer le coût fixe d'un agent (lecture du contrat, relecture de
  consigne) se regroupe avec un autre du même dépôt.

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
- Le planificateur : un script qui lit une liste de sujets et rend groupes, nombre d'agents,
  isolation et modèle par agent, avec sa recette (une fixture où le découpage par dépôt crée un
  lot déséquilibré, une où deux sujets partagent un fichier). Place-le là où la doctrine place
  l'outillage des agents (forge-agents si c'est elle), appelé depuis le pilot.
- La règle : une section « Découpage d'une campagne » dans `gabarits/AGENT-CAMPAGNE.md`, qui
  impose l'appel au planificateur et les étapes 2 et 3, en avertissement d'abord (règle neuve).
- Le registre : A-1 et A-2 inscrits par `node todo/journaliser.mjs`, avec la mesure de
  référence.
- Une étude courte qui compare la référence au découpage calculé sur les mêmes 38 sujets, nommée
  selon R-4 et R-25 du pilot : `Digit-AI - Etude - Strategie de lancement des agents - 20261029<indice>.md`
  dans `output/03-etudes/`, indice par `node scripts/allouer-indice.mjs`.

ÉTAPE 5 — MESURE APRÈS.
- La prochaine campagne d'au moins 10 sujets applique la stratégie ; relève-la par
  `relever-flotte.mjs` et compare à la référence. L'item du registre ne se clôt que sur ce gain
  constaté.

GARDE-FOUS.
- Ne modifie pas une session ni une campagne en cours.
- N'utilise pas l'outil Workflow sans accord explicite de l'humain.
- Ne pose à l'humain que ce qui relève de lui : passer la règle en blocage, ou dépasser le seuil
  de jetons par jour des relectures. Le reste s'exécute et se rend pour information.

CONTRAT DE SORTIE (voir ci-dessous) : à tenir avant de rendre la main.
```

### Contrat de sortie

Le livrable est accepté si chacun de ces points est vrai, preuve exécutée à l'appui :

- la référence du 29/10 est chiffrée : durée totale, durée du plus long agent, jetons, conflits, avec la commande qui l'a produite ;
- le planificateur, rejoué sur les 38 sujets du 29/10, rend un nombre d'agents, des groupes et une durée estimée inférieure à la référence ;
- sa recette passe, et sa fixture rouge échoue sur l'ancien découpage par dépôt ;
- aucun nombre d'agents n'est écrit en dur dans la règle ni dans le script : le plafond se lit dans un référentiel daté ;
- `gabarits/AGENT-CAMPAGNE.md` porte la section de découpage, d'attente et de réception ;
- A-1 et A-2 figurent au registre, `node todo/oracle-todo.mjs` PASS ;
- l'étude porte un nom conforme à **R-4** *(règle du pilot : le nom du projet ouvre le nom du fichier)* et **R-25** *(règle du pilot : le type, pris au registre des types, est le premier mot du deuxième segment)*.

### Protocole de tests du livrable

Le livrable mêle du code et un document ; chaque partie a son oracle.

- **Code (planificateur)** : exécution réelle sur trois jeux d'essai. Le jeu nominal : les 38 sujets du 29/10. Le cas limite 1 : 3 sujets dans un seul dépôt qui partagent un fichier, attendu un seul agent. Le cas limite 2 : 20 sujets sans aucun chemin cité, attendu le plafond, sans erreur.
- **Document (règle et étude)** : présence des sections nommées, chiffres sourcés, oracle de lisibilité Markdown du socle.
- **Boucle bornée** : générer, tester contre le contrat, corriger, 3 itérations au plus ; après 3 échecs, livrer avec la liste des écarts restants.

### Changelog

Comment lire la liste : chaque ajout du prompt réécrit renvoie au défaut du chapitre 3 ou à la cause du chapitre 5 qu'il ferme.

- Objectif chiffré et trois contraintes : défaut n° 2, cause n° 4.
- Étape 0, référence et limites du harnais : défauts n° 1 et n° 8, cause n° 4.
- Nombre calculé sous plafond daté : défaut n° 4, cause n° 2.
- Groupes par fichiers et équilibrage de charge : défaut n° 6, causes n° 3 et attaque de l'expert.
- Copie isolée par agent qui partage un dépôt : défaut n° 6, cause n° 3.
- Relecture commune D-47 et coût de N relectures : défaut n° 7, effet à l'échelle n° 1.
- Étape 3, réception sans attente : défaut n° 5, cause n° 5.
- Étape 4, script plus règle plus registre plus étude : défaut n° 3, cause n° 1.
- Avertissement d'abord, décision humaine seulement pour le blocage : défaut n° 10.
- Ne pas toucher la session en cours : défaut n° 9.
- Étape 5, mesure après : défaut n° 12.

### Écarts à la lettre

Comment lire le tableau : une ligne par endroit où le prompt réécrit s'écarte de votre texte ; tous relèvent de la manière d'exécuter, aucun n'ajoute un contenu visible à un livrable que vous n'avez pas demandé.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « Suite A1 » | « Suite de A-1 et A-2 » | sans A-2, plus d'agents ne raccourcit rien (chapitre 2) ; un exemple de la demande illustre, il ne borne pas | Manière d'exécuter |
| « leurs nombres » | un nombre calculé sous un plafond daté | un chiffre fixe ne vaut que pour une campagne | Manière d'exécuter |
| « optimiser les traitements » | réduire la durée, sous zéro conflit et au plus 20 % de jetons en plus | « optimiser » sans grandeur ne se vérifie pas ; le seuil de 20 % est une proposition de l'analyse, à ajuster | Manière d'exécuter |
| (rien sur le livrable) | un script, une règle en avertissement, le registre et une étude | une règle non câblée n'existe pas (loi n° 1) | Manière d'exécuter |
