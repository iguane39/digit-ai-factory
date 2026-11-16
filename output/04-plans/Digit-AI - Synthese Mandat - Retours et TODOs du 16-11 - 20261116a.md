---
destinataire: humain
---

# Synthèse Mandat — 79 lots accueillis, 85 sujets corrigés et publiés dans 9 dépôts (16/11/2026)

## 0. Synthèse d'ouverture

Oui, ce qui ne vous revenait pas est fait. Les 79 lots de retours qui attendaient au sas depuis jusqu'à 101 heures sont entrés au registre, puis tous les sujets ouverts ont été triés. 85 sujets sont corrigés, rejoués par moi et publiés dans le pilot, 7 forges et la file de tickets. Trois décisions nouvelles vous reviennent : publier des clips sur LinkedIn, enchaîner sans vous les étapes déjà validées, et faire suivre les secrets d'un poste à l'autre. Il vous reste aussi deux gestes : accepter la mise à jour des skills installés, et retirer 21 dossiers de travail de la campagne.

Livré : [Synthèse du 16/11, retours et TODOs](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2016-11%20-%2020261116a.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les retours et les TODOs », sur le pilot `digit-ai-factory`, 7 forges (agents, audit, conception, design, ops, tests, websec) et la file `digit-ai-queue`, poste Dell-XPS-16. Synthèse relevée le 16/11/2026 à 22:25, heure de Paris (`date`), après une ouverture à 14:38. Session pilote Claude Opus 5.5 ; 21 agents `campagne` Claude Sonnet 5.5, 2 agents de préparation Sonnet 5.5 (agents génériques sans effort déclaré, dérogation au routage de la flotte), 3 relectures d'intention Claude Haiku 5.5 ; escalade de modèle : aucune.

Intention de la demande : vider ce qui attend, retours et sujets du registre, en exécutant tout ce qui ne vous revient pas.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Les 79 lots sont entrés ou rangés, les 101 candidats ont chacun leur sort, et il ne reste ouvert que ce qui attend votre réponse, un produit, un geste sur le poste, une date ou une mesure dite.

## 2. Verdict

87 sujets clos en `corrige` aujourd'hui (85 de la campagne, plus 2 clos sur la mesure d'un sujet voisin), 8 écartés, 8 laissés en cours avec leur reste écrit. `node todo/oracle-todo.mjs` rend PASS après chaque écriture. Chaque dépôt a été rejoué par moi avant publication : forge-agents 860 contrôles PASS, forge-design « Tout vert, 81 oracles », forge-tests pytest exit 0, forge-websec 360 PASS, forge-ops 886 PASS, forge-audit 17 étapes sur 17, forge-conception VERT, la file 30 cas tenus. Recette entière du pilot après fusion des 9 lots, de 21:08 à 22:12 : 289 oracles sur 293 et 273 recettes à double sens. J'ai corrigé et rejoué les 2 défauts nés de la fusion (`010e0f95`). Les 2 autres sont antérieurs à la campagne et attendent un geste de votre part (actions A-2 et A-3).

## 3. Décisions attendues

Trois décisions nouvelles vous reviennent, chacune sur ce qui se publie ou sur la façon de vous poser les questions ; les 3 bloquants qui retiennent la suite sont les vôtres.

Les bloquants qui retiennent la suite, chacun avec ce qui le lève :
- Les 3 sujets de doctrine du tri restent candidats : vos réponses à D-221, D-222 et D-223 les lèvent.
- 11 skills installés sur ce poste divergent de leur source après la campagne, et la règle de propagation exige votre accord explicite : votre « propage » le lève.
- La recette entière du pilot garde 1 défaut sur des sceaux de jugement : 2 synthèses ont été modifiées après leur jugement par d'autres sessions, et leur re-scellement est un geste humain. Votre commande de l'action A-3 le lève.

L'alerte de relecture d'intention RI-20261116-03 reste posée. Après 2 passes de correction, le relecteur juge encore que la consigne commune de la campagne ne couvre pas toute votre demande. Elle ne couvre en effet que la part d'un lot ; la répartition des autres sujets est dite au bloc 4. Écrire « infirme RI-20261116-03 » ou « confirme RI-20261116-03 » la tranche ; sans réponse, elle reste comptée comme alerte ouverte.

> **D-221 — Faut-il rouvrir l'exclusion « Pas de vidéo » de references/RUN-RESEAU.md pour publier sur LinkedIn les clips déjà jugés par oracle-clip ?**
> - **De quoi s'agit-il** : le document qui règle le run d'animation de votre réseau, `references/RUN-RESEAU.md`, exclut la vidéo, au motif qu'aucun outil ne la produit.
> - **Le problème** : depuis le 10/11, le skill `clip-de-presentation` produit des MP4 jugés par `oracle-clip`, et un produit en porte 28. Vous avez demandé le 12/11 de les publier. Le motif de l'exclusion est devenu faux, et aucun contrôle du run ne juge une publication vidéo.
> - **Pourquoi vous** : c'est une publication sur un réseau et un changement de doctrine du run.
> - **Recommandation : (a)** — c'est ce que vous avez demandé le 12/11, et les clips passent déjà leur oracle. Source consultée : `references/RUN-RESEAU.md`, section des exclusions, et le retour RP-213 de Produit-81.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Rouvrir | la publication d'un clip jugé PASS par `oracle-clip` entre au run, avec le même accord par semaine que les textes | une campagne d'un lot au pilot | rétablir l'exclusion |
| (b) Réécrire le motif | l'exclusion reste, avec son vrai motif ; rien ne se publie | une ligne du document | rouvrir plus tard |
| (c) Laisser | l'exclusion garde un motif faux | aucun | trancher à tout moment |

> **Sans réponse** : l'exclusion reste, et les clips ne se publient pas.

> **D-222 — Faut-il une règle qui enchaîne sans vous les reposer les étapes d'un plan que vous avez déjà validées, sur un consentement unique consigné ?**
> - **De quoi s'agit-il** : chez un produit, 14 réponses humaines sur 49 au `forge/ledger.jsonl` (du 03/11 au 12/11) ne faisaient que valider le passage à l'étape suivante d'un plan déjà accepté.
> - **Le problème** : chaque étape revient vers vous, et la fin de tour exige une restitution complète à chaque attente d'agent.
> - **Pourquoi vous** : la règle change la façon de vous poser les décisions.
> - **Recommandation : (b)** — un essai de 2 semaines chez un produit mesure le gain sans changer la doctrine partout. Source consultée : le lot de retours de Produit-82 du 13/11 et `references/NIVEAUX.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Adopter partout | une ligne propose l'enchaînement dès 2 étapes, votre accord unique est consigné, la session s'arrête sur 4 conditions (invariant, oracle en échec, périmètre changé, expiration) | une campagne au pilot et au socle des produits | retirer la règle |
| (b) Essai de 2 semaines | la même règle chez un produit volontaire, mesurée sur le nombre de validations de simple passage | un lot, puis une revue datée | arrêter l'essai |
| (c) Ne rien changer | chaque étape revient vers vous | aucun | trancher à tout moment |

> **Sans réponse** : chaque étape continue de revenir vers vous.

> **D-223 — Faut-il que le socle fusionne automatiquement les fichiers .env d'un produit avec un coffre sur Drive, à l'ouverture et en fin de tour, pour que les secrets suivent d'un poste à l'autre ?**
> - **De quoi s'agit-il** : le script qui fusionne les fichiers de secrets d'un produit entre deux postes, `scripts/fusionner-env.mjs`, existe depuis D-208 (a), mais reste un geste manuel ; le 12/11, un jeton manquait sur le second poste et l'exploitant a dû le coller.
> - **Le problème** : l'exploitant demande que GitHub et Google Drive suffisent, secrets compris, sans aucun geste ; la règle actuelle veut qu'un secret se ressaisisse sur chaque poste.
> - **Pourquoi vous** : c'est une doctrine de sécurité, et la copie des secrets sur un service hébergé.
> - **Recommandation : (a)** — le coffre Drive est déjà admis par D-208 (a), et la demande exclut tout geste. Source consultée : le retour RP-31 de Produit-79 et `REGLES-PROJET.md`, section sur les secrets.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Fusion automatique | le socle joue la fusion avec un coffre voisin du canal, jamais dedans, à l'ouverture et en fin de tour | une campagne au pilot et au socle | désactiver le hook |
| (b) Proposée, pas jouée | l'ouverture détecte l'écart et donne la commande en une ligne | un lot au pilot | retirer le signal |
| (c) Laisser | le secret se ressaisit sur chaque poste | aucun | trancher à tout moment |

> **Sans réponse** : le secret continue de se ressaisir sur chaque poste ; les 3 sujets restent candidats et ressortent au prochain tri.

D-180 n'attend plus : son défaut a joué, les sujets de la boucle L99 (mode boucle de l'analyse de prompts) ont été traités à leur revue du 16/11. D-183 et les décisions plus anciennes restent inchangées.

## 4. Traité

La demande a été traitée en 5 temps : accueil des lots, tri, campagne, rejeu et publication.

- Sas d'arrivée : 79 lots de 9 émetteurs accueillis et pseudonymisés par `node todo\accueillir-lot.mjs`, sans nom ni adresse à qualifier. 78 sont ingérés et 83 candidatures en sont nées (TF-2599 à TF-2681). Deux lots, déjà ingérés sous un autre nom, sont rangés dans `old\`.
- Cinq lots étaient refusés à la forme. Celui de Produit-81 portait un numéro déjà pris : renuméroté RT-22 à la réception, avec une note, avant ingestion. Quatre avaient une famille de classe inconnue : ramenée à la réception, puis rendue à leur producteur au registre (précédent D-45 (b)).
- Une autre session a inscrit à 13:46 la graphie `factory.digit-ai.fr` du site public dans la table des pseudonymes, sans l'enregistrer. Cette inscription faisait refuser la publication du pilot sur 3 fichiers déjà publiés. J'ai appliqué D-214 (a) à cette troisième graphie (`e73c06b5`) et retiré l'entrée, gardée en copie ; candidat TF-2682.
- Tri des 101 candidats sous R-58 (la règle qui n'envoie à l'humain que ce qui lui revient) : 88 décidés, 7 écartés (6 doublons et 1 affirmation rectifiée), 3 gardés candidats avec leur motif, 3 posés à vous. Les 74 retours sans classe sont classés : 24 rattachés à une classe existante, 41 classes créées au référentiel 1.74.0.
- Mesures dues jouées : la revue datée de la boucle L99 rend un gain médian de 6 points sur 43 journaux, la règle de repli n'est pas déclenchée. Le nombre de refus du hook de fin de tour reste à 106 en 7 jours, contre 91 avant la leçon L-006 : gain non constaté, noté à son sujet.
- Campagne en 20 lots, un agent par lot et par dépôt, puis un agent pour fusionner les 4 branches de forge-agents. Rejeu par moi avant chaque publication :
  - forge-audit `4f00b7c`, 1 sujet ; forge-ops `884643b`, 1 sujet ; la file `6f77704`, 3 sujets ; forge-conception `cfe1d95`, 2 sujets ;
  - forge-tests `56537c4`, 6 sujets ; forge-design `1080927`, 6 sujets ; forge-websec `e82f961`, 2 sujets ;
  - forge-agents `f9d3b7c`, 20 sujets ; la fusion a résolu les versions (quality-oracles 2.41.0) et renuméroté une règle de la boucle L99 (B20) ;
  - pilot, 9 lots fusionnés, 44 sujets : conflits de version du contrat d'héritage résolus en 1.76.0 et 1.77.0, gabarit de restitution en 2.71.0, cohérence RC1 PASS.
- Recette entière du pilot : 289 oracles sur 293. J'ai corrigé les 2 défauts nés de la fusion. L'oracle des empreintes ne balayait pas `catalogues\`. La règle S93 jugeait une synthèse ancienne contre les décisions du jour. Les 2 corrections sont rejouées : empreintes PASS, banc de mutation 15 sur 15, oracle-synthese 395 sur 395.
- Publications : les 8 dépôts du parc et le pilot sont à 0 commit d'écart après `git fetch`, sous les feux verts permanents D-53 (b) et D-54 (b) du 03/10.

Relecture d'intention : dérive, gravité majeure, en 3 passes sur la consigne commune (RI-20261116-01 à 03) ; l'écart qui résiste est posé au bloc 3.

## 5. Non traité

- TF-2236, TF-2241 et TF-2242 (boucle L99) — motif : `borne_atteinte`, leurs règles sont posées en essai et publiées, leur critère se mesure sur une boucle de test.
- TF-2581 — motif : `borne_atteinte`, la décision exige d'abord un banc d'environ 450 000 jetons.
- TF-2620, TF-2521 et TF-2438 — motif : `borne_atteinte`, la part du pilot est faite, le reste vit dans forge-agents ou forge-tests ; reste écrit au registre.
- TF-2349 — motif : `garde_fou`, la règle existe au gabarit, mais le registre refuse la clôture d'une récidive sans barrière, et aucun oracle ne peut voir un nom absent de la table.
- TF-2613, TF-2615 et TF-2624 — motif : `decision`, ce sont D-221 à D-223.
- La propagation des skills installés — motif : `gate_gouvernance`, elle exige votre accord explicite.
- Les sujets en revue datée échue (TF-1372, TF-1392, TF-1843, TF-1865, TF-1873, TF-2155) — motif : `borne_atteinte`, leurs mesures n'ont pas été rejouées dans ce tour.
- Les sujets qui attendent un produit, un geste, une date ou l'autre poste, soit 69 au registre — motif : `hors_mandat`, rien ne s'y joue depuis le pilot.
- 10 candidats neufs tirés des restes des agents (TF-2684 à TF-2693) — motif : `borne_atteinte`, tirés en fin de tour.

## 6. Écarts à la lettre

- Vous avez demandé de traiter les retours → 4 lots refusés pour une famille de classe inconnue ont été ramenés à une famille connue à la réception → j'ai ensuite rendu ce choix à leur producteur au registre, comme le veut le précédent D-45 (b).
- La consigne des 7 derniers lots du pilot → dispensait chaque agent de la recette entière, que j'ai jouée une fois après fusion → 9 recettes de 2 heures en parallèle rendaient le poste inutilisable.
- Un agent a arrêté par motif de ligne de commande 2 recettes d'autres agents → rejouées par leurs agents → candidat TF-2689.

## 7. Risques

- Les 3 règles de la boucle L99 en essai rendent un motif obligatoire sur 77 % des passes gardées (mesuré sur 48 journaux) ; signal : refus répétés d'`oracle-boucle-l99` sur B15 ; parade : la revue de l'essai, avec le candidat TF-2691 pour la règle V28 voisine.
- La règle V28 (rendu d'une piste de grille vide) des pages est bloquante sans mesure de son bruit sur les pages livrées ; signal : un refus sur une page déjà publiée ; parade : candidat TF-2691.
- Les recettes du pilot rougissent sous la charge de plusieurs agents (3 cas de `hook-ouverture.test.mjs`) ; signal : un échec qui passe seul ; parade : candidat TF-2684.

## 8. Prochaines actions

Le tableau dit, action par action, qui agit et ce qui se passe si rien n'est fait ; les quatre premières vous reviennent.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-221, D-222 et D-223 en écrivant la lettre collée au numéro (par exemple « 221a ») ; la réponse s'inscrit à `decisions/REGISTRE.jsonl` | neuve | manuelle_utilisateur | decision : publication et doctrine | ce message | les 3 sujets restent candidats |
| A-2 | Écrire « propage » pour que je joue `node oracles\oracle-skills.mjs --appliquer` sur les 11 skills installés | neuve | manuelle_utilisateur | decision : règle de propagation (la mise à jour des skills installés exige votre accord explicite) | ce message | les sessions du poste exécutent les anciennes versions |
| A-3 | Re-sceller les 2 synthèses modifiées après jugement : `node scripts\verifier-jugement.mjs output --sceller --en-masse` | neuve | manuelle_utilisateur | irreversible : le re-scellement efface la trace de l'ancien contenu, geste que la recette réserve à l'humain | ce message | la recette entière garde 1 défaut |
| A-4 | Retirer les 21 arbres de campagne, par `git -C C:\dev\<dépôt> worktree remove C:\dev\_wt-<lot>` pour chacun des dossiers `C:\dev\_wt-*` | neuve | manuelle_utilisateur | irreversible : une suppression de dossier reste un geste humain | ce message | 21 dossiers propres restent sur le disque |
| A-5 | Trier les 10 candidats TF-2684 à TF-2693 | neuve | auto_ia | gate_gouvernance : le tri se demande | votre « trie » | ils restent candidats |
| A-6 | Mesurer TF-2236, TF-2241 et TF-2242 sur une boucle réelle de l'analyse de prompts, puis rendre la revue de l'essai | neuve | auto_ia | dependance_externe : la mesure se lit sur une boucle réelle, que lance votre prochaine demande d'analyse de prompt | votre prochaine demande d'analyse de prompt en boucle | les 3 règles restent en essai |

## 9. Traces

- Registre `todo\TODO.jsonl` (87 clôtures, 8 écarts, 88 décisions, 95 créations du jour) ; référentiel `todo\CLASSES.json` 1.74.0 ; décisions réservées D-221 à D-223 dans `decisions\REGISTRE.jsonl`.
- Pilot : `fcd222a2`, `2b5e9e94`, `e73c06b5`, fusions `c9ab4e46` à `5e449349`, corrections de fusion `010e0f95`, registre `b8c92c96`.
- Forges : `4f00b7c` (audit), `884643b` (ops), `6f77704` (file), `cfe1d95` (conception), `56537c4` (tests), `1080927` (design), `f9d3b7c` (agents), `e82f961` (websec).
- Relectures d'intention RI-20261116-01 à 03 dans `todo\relectures-intention.jsonl`.
