---
destinataire: humain
---

# Synthèse Mandat — 19 lots accueillis, 88 sujets corrigés et publiés dans 8 dépôts (22/11/2026)

## 0. Synthèse d'ouverture

Oui, ce qui ne vous revenait pas est fait. Les 19 lots arrivés sont entrés au registre ; un seul est renvoyé à son producteur avec la correction à faire. 88 sujets sont corrigés, rejoués et publiés dans le pilot et 7 forges, et l'étude que vous aviez demandée sur les relecteurs est écrite. Cinq décisions vous reviennent : une dépense de jetons, la sévérité d'une règle des pages, 2 règles de doctrine et le lieu d'une déclaration. Il vous reste aussi un geste : accepter la mise à jour des skills installés sur ce poste.

Livré : [Étude des relecteurs à angle distinct](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Relecteurs%20a%20angle%20distinct%20-%2020261122b.md) (C:\dev\digit-ai-factory\output\03-etudes\Digit-AI - Étude - Relecteurs a angle distinct - 20261122b.md)

## 1. En-tête d'identification

- **Quoi** : exécution de votre demande « Traite les retours et les TODOs ».
- **Sur quoi** : le pilot `digit-ai-factory` et 7 forges (agents, design, ops, tests, development, conception, observability), poste Dell-XPS-16.
- **Quand** : du 22/11/2026 à 17:39 au 23/11/2026 à 00:27, heure de Paris, relevé par `date`.
- **Qui** : Claude Opus 5.5, session pilote ; 13 agents `campagne`, 1 agent `redacteur` et 1 agent `verificateur`, Claude Sonnet 5.5 ; escalade de modèle : aucune.
- **Intention** : vider ce qui attend, lots de retours et sujets du registre, en exécutant tout ce qui ne vous revient pas.
- **Test rétro** : les lots sont entrés ou renvoyés, 92 sujets sur les 101 candidats ont leur sort, et il ne reste ouvert que ce qui attend votre réponse, une mission, l'autre poste ou un producteur. La synthèse sert cette intention, avec un oubli dit au bloc 5.

## 2. Verdict

- Registre des sujets, mesuré sur `todo/TODO.jsonl` à 00:27 : 88 sujets passés en corrigé dans ce mandat (5 étaient déjà faits à l'arrivée), 4 laissés en cours sur une décision, candidats ramenés de 101 à 9 ; `oracle-todo` PASS avant et après chaque écriture.
- Recette entière du pilot après fusion des 5 lots : 298 oracles sur 305 ; les 7 rouges existent aussi sur la version de départ 09a1d13c, ou tiennent à un budget de temps sous charge (rejouée par l'agent de fusion).
- Forges rejouées par moi avant publication : agents 145 PASS, quality-oracles 865 contrôles, socle des pages 944 sur 944 (mesurés à un tour précédent, `agent-fag/rejeu-pilote.txt`) ; design « Tout vert — 84 oracles » ; ops 924 PASS ; development 5 étapes sur 5 ; conception 289 OK ; tests 23 défauts du corpus sur 23 ; observability 47 PASS.
- Publications : 8 dépôts poussés, chacun à 0 commit d'écart après `git fetch`.

## 3. Décisions attendues

5 décisions nouvelles vous reviennent. Elles portent sur ce que la campagne n'a pas pu trancher seule : une dépense de jetons pour mesurer les relecteurs, la sévérité d'une règle qui juge le rendu des pages, la largeur des écrans d'application, le renommage des livrables par commande, et le lieu où un dépôt déclare comment il s'authentifie pour publier.

Les bloquants qui retiennent la suite, chacun avec ce qui le lève :
- Les skills installés sur ce poste divergent de leur source après la campagne, et la propagation exige votre accord explicite : votre « propage » le lève.
- Les sujets TF-2691, TF-2737, TF-2776 et TF-2411 restent en cours : vos réponses à D-234 à D-237 les lèvent.
- Les 13 lots de factory-digit-ai-fr attendent leur correction chez le producteur : sa prochaine remise au sas la lève.
- Les compétences à créer (TF-2746 à TF-2749, TF-2751) attendent une mission de leur domaine : la première mission la lève.
- Le rattrapage des 14 produits de l'autre poste (TF-2750) attend une session sur ce poste : son ouverture le lève.
- TF-2613 et TF-2624 attendent D-221 et D-223 : votre réponse les lève.

Rappel des décisions déjà posées :
- D-221 : rouvrir l'exclusion « Pas de vidéo » pour publier les clips sur LinkedIn, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers d'environnement d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.
- D-231 : confier dès maintenant à Codex et à Antigravity le code borné par des tests de la file de Produit-79, posée le 21/11 à 17:36, inchangée.

> **D-233 — Faut-il lancer le banc réduit de l'étude des relecteurs à angle distinct, environ 1,5 million de jetons sur votre abonnement, après un recompte gratuit des journaux ?**
> - **De quoi s'agit-il** : l'agent `relecteur` relit les livrables en aveugle ; l'étude 20261122b compare 2 généralistes à des relecteurs qui portent chacun un angle (prémisses, texte neuf, intention, lecteur visé).
> - **Le problème** : le « 73 % » de l'étude du 06/11 est un plafond probable, pas une valeur, et ses 3 pourcentages ne se recoupent pas. Rien ne dit aujourd'hui si les angles trouvent plus de défauts graves à coût égal.
> - **Pourquoi vous** : le banc est une dépense de jetons, estimée à 1 503 828, plafond demandé 1 600 000.
> - **Recommandation : (a)** — le recompte ne coûte rien, et le banc ne part que si le recompte passe un seuil fixé d'avance. Source consultée : l'étude 20261122b, section des options.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Recompte, puis banc sous porte | je recompte les journaux et étiquette chaque grave par angle ; le banc de 3 textes contre 3 bras ne part que si le seuil est passé | 0 jeton, puis 1 600 000 au plus | arrêter avant le banc |
| (b) Recompte seul | je recompte les journaux, sans banc | 0 jeton d'agent | lancer le banc plus tard |
| (c) Ne rien faire | les relecteurs restent des généralistes | aucun | trancher à tout moment |

> **Sans réponse** : rien n'est lancé, et la question du 15/11 reste sans mesure.

> **D-234 — La règle V28 du socle des pages accuse 22 pages livrées sur 117 : faut-il la passer en avertissement, recalibrer ses seuils, ou examiner les 22 pages une à une ?**
> - **De quoi s'agit-il** : la règle V28 (piste de droite vide) de `render_page.py`, dans le socle `digit-ai-page-html` qui juge le rendu de toutes les pages livrées, refuse une page dont la colonne de droite reste vide sur un grand écran.
> - **Le problème** : mesurée le 22/11 sur 117 pages livrées, elle en accuse 22 ; la seule lue en capture ne montre aucun défaut visible. Elle bloque aujourd'hui sans mesure de son bruit.
> - **Pourquoi vous** : la sévérité d'une règle de rendu est une décision de doctrine du socle.
> - **Recommandation : (a)** — 19 % d'accusation sans défaut vu ne justifie pas un blocage, et le précédent V25 a pris ce chemin. Source consultée : `zero-defaut-visuel.md` de forge-agents, mesure du lot fag.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Avertissement | V28 avertit au lieu de bloquer, comme V25 | un commit dans forge-agents | la repasser bloquante |
| (b) Recalibrer | un agent examine les 22 pages et ajuste les seuils | une campagne d'un lot | revenir aux seuils d'avant |
| (c) Laisser | V28 reste bloquante | aucun | trancher à tout moment |

> **Sans réponse** : V28 reste bloquante sur les 22 pages.

> **D-235 — Sur un écran d'application à navigation latérale, faut-il retirer la navigation de la mesure de largeur, ou créer une sortie « écran d'application » qui dispense les règles de largeur ?**
> - **De quoi s'agit-il** : les règles L2 (largeur de lecture), V17 (largeur du conteneur comparée à la fenêtre) et V18 (largeur maximale de lecture) du socle `digit-ai-page-html`, qui jugent la largeur des textes sur les écrans larges.
> - **Le problème** : sur un écran à navigation latérale, brider la prose échoue à L2 et la libérer échoue à V18 au-delà de 2 560 px. Aucun texte ne dit laquelle des 2 règles prime.
> - **Pourquoi vous** : c’est un arbitrage entre 2 règles, et l'option (b) ouvre une dispense nouvelle.
> - **Recommandation : (a)** — elle ne change aucune règle, seulement ce que la mesure compte, et c'est la proposition du retour. Source consultée : le rapport du lot fde et le sujet TF-2776.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Retirer la navigation de la mesure | une navigation déclarée (`nav`, `aside` ou un attribut) sort de la mesure de V17 et L2 | un lot dans forge-agents | remettre la mesure |
| (b) Sortie « écran d'application » | `data-page="application"` dispense V13, V17 et L2, la bride passe à un bloc déclaré | un lot et une règle de doctrine | retirer la sortie |
| (c) Laisser | la contradiction reste, chaque produit contourne | aucun | trancher à tout moment |

> **Sans réponse** : TF-2776 reste ouvert, et les écrans à navigation latérale échouent à l'une des 2 règles.

> **D-236 — Faut-il qu'un hook refuse le renommage d'un livrable de output par mv ou git mv, et impose un script qui trace le renommage ?**
> - **De quoi s'agit-il** : la réservation d’indice de `scripts/allouer-indice.mjs`, qui donne à chaque livrable du dossier `output/` un nom unique du jour, et le lien « Livré » des restitutions, qui ouvre ce livrable d’un clic depuis la synthèse.
> - **Le problème** : la réservation d’un indice libre est faite par la campagne ; un `mv` fait par commande reste invisible, et un renommage silencieux casse le lien « Livré » d'une restitution.
> - **Pourquoi vous** : refuser un geste est une décision de doctrine.
> - **Recommandation : (a)** — le renommage par script est déjà la voie du pilot, et le refus ne vise que `output/`. Source consultée : le rapport du lot pe et `references/RENOMMAGES-LIVRABLES.jsonl`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Refuser et tracer | un hook refuse `mv` et `git mv` sous `output/`, un script renomme et trace au ledger avec renvoi | une campagne d'un lot au pilot | retirer le hook |
| (b) Avertir seulement | le hook avertit, sans refuser | une campagne d'un lot | retirer l'avertissement |
| (c) Laisser | rien ne change | aucun | trancher à tout moment |

> **Sans réponse** : TF-2737 reste ouvert sur sa moitié « renommage ».

> **D-237 — Où un dépôt doit-il déclarer son mode d'authentification distant, et le signalement d'un git push nu doit-il informer ou bloquer ?**
> - **De quoi s'agit-il** : la consigne d’authentification d’un clone de dépôt, qui dit à une session comment envoyer ses commits vers le serveur distant, par un jeton enregistré sur le poste ou par la fenêtre de connexion du navigateur.
> - **Le problème** : le 09/11, un `git push` nu a échoué sans fenêtre avant que la session relise la consigne du clone ; rien ne déclare ce mode par dépôt.
> - **Pourquoi vous** : choisir le lieu de la déclaration engage le socle des produits, et le blocage d'un geste est de la doctrine.
> - **Recommandation : (c)** — un seul cas est mesuré, et le tri du 10/11 attendait une seconde occurrence avant toute barrière. Source consultée : le sujet du registre sur ce push et le rapport du lot pd.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Clé git du clone, information | une clé de configuration du clone déclare le mode, un hook informe | un lot au pilot | retirer la clé |
| (b) Fichier du socle hérité, blocage | un fichier hérité déclare le mode, un hook bloque le push nu | un lot et une version d'héritage | retirer le fichier |
| (c) Attendre une seconde occurrence | le sujet reste ouvert, sans barrière | aucun | trancher à tout moment |

> **Sans réponse** : TF-2411 reste ouvert, sans barrière.

## 4. Traité

- **Registre des décisions réuni avec l'autre poste** : la D-230 locale (banc multi-agents) est devenue D-232, motif écrit au registre (75942d14).
- **Boîte d'entrée** : 19 lots accueillis par `todo/accueillir-lot.mjs` ; un lot de Produit-79 réindexé 20261120b à la réception ; 18 ingérés, 28 sujets nés (TF-2766 à TF-2793). Le lot `digit-ai-marketing - RETOURS - 20261122b` est refusé (2 classes sans libellé), cause mesurée chez le producteur, sujet TF-2794, lot de travaux déposé dans sa boîte.
- **Tri sous R-58** : 91 candidats décidés et répartis en 12 lots (09a1d13c) ; consigne commune relue « sert » (RI-20261122-04).
- **Pilot, 5 lots fusionnés** (fusion 0ed3f0ae, publiée en 42a8d5b3), 60 sujets corrigés dont 4 déjà faits, contrôle rouge puis vert pour chaque correction neuve :
  - le contrôle de remise d'un lot refuse ce que la porte refusera, et le chemin complet suit chaque lien « Livré » (TF-2761, TF-2782) ;
  - un hook nouveau refuse l'arrêt de processus par motif et le relevé non filtré de l'environnement ; 12 commandes courantes essayées par moi, seules les 2 visées refusées (TF-2689, TF-2721) ;
  - le catalogue ne dit plus « prouvé » sans exécution réelle, et un registre de 24 compétences rend ses verdicts de péremption (TF-2719, TF-2743) ;
  - le socle des produits reçoit un `.gitattributes` (héritage 1.79.0), la section « Sessions multiples » (1.80.0) et deux types de ledger (1.81.0).
- **Forges, 28 sujets corrigés dont 1 déjà fait**, chacun avec un cas rouge puis vert au banc de sa forge, publiées : observability 0c417b7, ops 46f2ab6, development 5776310, design bf5f9af, tests 6815bf0, conception 9edada3, agents d944364. Les plus utiles pour vous : un appel d'IA sans réglage pour le modèle servi, sans sortie de refus ou avec un repli silencieux est refusé (TF-2774, TF-2775, TF-2766), et une version qui touche l'IA ou le courrier ne passe plus en production sur une porte allégée (TF-2771).
- **Étude TF-2726** : écrite, `oracle-etude-opportunite` et `oracle-ecriture` PASS rejoués par moi, enregistrée (3b876731) ; sa suite est D-233.
- **Registre** : 94 événements écrits par `todo/journaliser.mjs`, chaque clôture avec sa descente et chaque récidive avec sa barrière ; publié.

Relecture d'intention : sert (RI-20261122-04, consigne commune de la campagne).

## 5. Non traité

- **TF-2682** (graphie d'un produit public inscrite à la table des pseudonymes) — motif : `borne_atteinte`, il m'a échappé au tri ; il reste candidat.
- **13 lots de factory-digit-ai-fr** à la racine de la boîte — motif : `dependance_externe`, refusés le 21/11 et renvoyés au producteur (TF-2758), ils attendent sa correction.
- **TF-2746 à TF-2749 et TF-2751** (compétences à créer) — motif : `dependance_externe`, chaque lot du plan du 21/11 démarre à une mission du domaine, qui n'est pas arrivée.
- **TF-2750** (14 produits de l'autre poste) — motif : `hors_mandat`, il se joue sur l'autre poste.
- **TF-2613 et TF-2624** — motif : `dependance_bloc_3`, ce sont D-221 et D-223.
- **Restes des agents, non tirés en candidats** — motif : `borne_atteinte`, ils sont écrits dans les rapports des lots :
  - `ledger.mjs` de forge-agents n'admet ni `action_externe`, ni `constat`, ni l'identité de session ;
  - le plan `aws` de forge-ops prescrit encore App Runner, et forge-development prescrit `uv run pytest` ;
  - l'étape de mise en production du pilot ne cite pas le contrôle O-32 (porte de version) ;
  - 5 fichiers `.visuel` suivis de forge-tests sont réécrits à chaque recette (« arbre instable », présent dès la version de départ) ;
  - les README de 13 forges portent un tableau de services resté à la v1.6.0 ;
  - les correctifs chez Produit-12 (connecteur d'IA, simulateur de courrier, essai simulé, clé `FORGE_TESTS_PANS_CENTRAUX`).
- **6 rouges préexistants de la recette du pilot** (`hook-page-html`, S93 d'`oracle-synthese`, `verifier-jugement`, `oracle-skills`, `verifier-rendu-instances`, `generer-lisezmoi-output`) — motif : `borne_atteinte`, ils existent sur 09a1d13c et sont hors de la campagne.
- **Le sigle d'un produit resté en clair dans 4 lots** — motif : `garde_fou`, aucune table ne le porte et il est déjà dans 18 fichiers publiés ; noté à TF-1540.

## 6. Écarts à la lettre

- Vous avez demandé de traiter les TODOs → j'ai traité les 101 candidats, pas les 27 sujets décidés et les 78 en cours plus anciens → parce que ceux-ci attendent un produit, un geste, une date ou l'autre poste (42 portent l'attente « produit »).
- Vous avez demandé de traiter les retours → l'étude TF-2726 décrit le banc sans le lancer → parce que le banc est une dépense, posée en D-233.

## 7. Risques

- **Le hook nouveau de garde des commandes peut refuser une commande légitime.** Signal : un refus sur une commande sans arrêt de processus ni relevé d'environnement. Parade : son banc couvre 108 cas, et le refus nomme la forme à employer.
- **Les produits existants rendront R-47 en échec tant qu'ils n'ont pas recopié le `.gitattributes`.** Signal : le relevé d'héritage à leur ouverture. Parade : la recopie est faite à leur prochaine ouverture ; la normalisation (`git add --renormalize .`) reste leur geste.
- **Les copies de travail de la campagne restent dans le dossier temporaire de la session.** Signal : `git worktree list` les montre. Parade : toutes les branches sont fusionnées et publiées ; rien ne s'y perd.

## 8. Prochaines actions

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Écrire « propage » pour que je joue `node oracles\oracle-skills.mjs --appliquer` sur les skills modifiés (forge-agents, quality-oracles, digit-ai-page-html, experts-forge, redige-les-exigences) | neuve | manuelle_utilisateur | decision : règle de propagation, la mise à jour des skills installés exige votre accord explicite | ce message | les sessions du poste exécutent les anciennes versions |
| A-2 | Répondre à D-233 à D-237, et si vous le souhaitez à D-221, D-223 et D-231, en écrivant dans ce fil la lettre collée au numéro (« 233a ») ; la réponse s'inscrit à `decisions/REGISTRE.jsonl` | TF-2726, TF-2691, TF-2776, TF-2737, TF-2411 | manuelle_utilisateur | decision : dépense, doctrine et arbitrage | ce message | les 5 sujets restent en cours |
| A-3 | Trier TF-2682 et tirer en candidats les restes des agents listés au bloc 5 | TF-2682 | auto_ia | borne_atteinte : tirés en fin de mandat, après minuit ; reprise : votre message « trie » dans ce fil | votre « trie » | ils restent dans les rapports, hors du registre |
| A-4 | Rejouer la recette des 13 lots de factory-digit-ai-fr quand le producteur les remettra | TF-2758 | auto_ia | dependance_externe : le producteur corrige ses lots | sa prochaine remise au sas | ses sujets restent hors du registre |

## 9. Traces

- Registres : `todo/TODO.jsonl` (commits 09a1d13c et 42a8d5b3), `decisions/REGISTRE.jsonl` (75942d14, D-233 à D-237 réservées), `todo/relectures-intention.jsonl` (RI-20261122-04).
- Lots : `input/00-retours/` ; lot de travaux `C:\dev\digit-ai-marketing\input\00-travaux\pilot - TRAVAUX - 20261122a.md`.
- Étude : `output/03-etudes/Digit-AI - Étude - Relecteurs a angle distinct - 20261122b.md`.
- Pilot : fusion 0ed3f0ae, publication `78fb345e..42a8d5b3`.
- Forges : `9527914..0c417b7` (observability), `884643b..46f2ab6` (ops), `01d6063..5776310` (development), `1080927..bf5f9af` (design), `56537c4..6815bf0` (tests), `cfe1d95..9edada3` (conception), `c5f57b3..d944364` (agents).
- Rapports et rejeux des lots : dossier temporaire de la session, `agent-<lot>/` et `rapports/`.
