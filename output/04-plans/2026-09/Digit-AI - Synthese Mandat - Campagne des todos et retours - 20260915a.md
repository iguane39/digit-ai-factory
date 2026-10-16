---
destinataire: humain
---

# Synthèse de mandat — les retours en attente sont entrés au registre et la campagne des cinquante améliorations décidées est close : vingt-sept corrigées, deux écartées, vingt et une restantes, chacune avec son motif

Tous les retours qui attendaient sont au registre et la boîte d'entrée est au vert. Les quatre plaintes sur le produit de restauration étaient déjà corrigées par le produit lui-même ; elles sont instruites et closes. Sur les cinquante améliorations décidées, six chantiers ont corrigé vingt-sept, en ont écarté deux comme doublons, et laissent les autres en attente d'un produit, d'une forge ou de toi. Rien n'est publié. La recette a aussi révélé des fichiers de configuration publiés sur deux de tes dépôts privés : c'est la décision la plus urgente.

## 1. En-tête d'identification

- **quoi** — mandat humain « Traite tous les todos et retours » (14/09), précisé par l'option « exécuter les 50 décidés/en cours » : boîte d'entrée traitée, puis campagne en six chantiers parallèles, consolidée au registre.
- **sur quoi** — le pilot `digit-ai-factory` et sept forges : agents, data, tests, design, organization, audit ; conception et development vérifiés sans écriture.
- **quand** — 2026-09-14 20:58 → 2026-09-15 00:45 UTC+02:00 (Europe/Paris), environ 3 h 45.
- **qui** — session Claude Opus 5 (contexte étendu), sept agents : Opus pour le pilot (en worktree isolé) et forge-agents, Sonnet pour data, tests, design, les quatre petites forges et l'instruction des insatisfactions ; escalade : aucune ; gabarit RESTITUTION 2.26.0.

## 2. Verdict en une ligne

**Boîte d'entrée FAIL → PASS ; campagne 50/50 traitée : 27 corrigés, 2 écartés, 21 restants motivés ; 31 candidatures créées (TF-1073 à TF-1103) ; oracle-todo, oracle-boite-entree, oracle-empreintes, oracle-insatisfactions PASS ; oracle-skills FAIL (4 K2, propagation à décider) ; 0 push.**

## 3. Décisions attendues de l'humain

Dix décisions ouvertes, numérotées de façon continue dans la session. Quatre sont nées de la consolidation (D-9 à D-12), les autres ont été posées au fil de la campagne. D-12 passe en premier parce qu'elle réduit un risque en cours ; D-9 ensuite parce qu'elle rend les corrections utilisables ; les autres suivent l'ordre de leur sélecteur.

Mode d'emploi des tableaux de ce chapitre : sous chaque bloc cité, trois lignes comparent trois options. La colonne « Ce qu'elle coûte » donne l'effort ou la présence demandée ; la colonne « Ce qu'elle exclut » donne ce que le choix rend impossible. La première ligne est toujours la recommandée, la dernière toujours l'inaction ; l'effet de l'inaction est redit sous le tableau.

> **D-12 — Veux-tu vérifier et faire tourner les identifiants des fichiers de configuration publiés sur tes dépôts, puis les faire retirer du suivi par un run chez chaque produit ?**
> Un fichier de configuration d'intégration continue est publié sur la branche principale d'un produit de gestion de messagerie et dans trois de ses branches ; un fichier de configuration npm est publié sur un second produit. Les deux dépôts sont privés et t'appartiennent. Aucun contenu n'a été lu : on ne sait pas s'ils portent de vrais identifiants. S'ils en portent, l'historique les garde même après suppression, et seule une rotation les neutralise.
> **Recommandation : (a).** Source consultée : le message de la règle SP2 (porteur de secret dans un dépôt qui ne l'ignore pas) d'`oracles/oracle-secrets-hors-perimetre.mjs` (« seule une rotation de l'identifiant réduit le risque »), la règle R-14 de `REGLES-PROJET.md` et le garde-fou de `CLAUDE.md` (« les `.env` ne transitent jamais »).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Tu ouvres les deux fichiers, fais tourner les identifiants réels, puis je prépare un run par produit pour les retirer du suivi et les ignorer | Environ 15 min de ta présence par identifiant, puis un run court par produit | Rien : l'exposition est close |
| (b) Retirer seulement du suivi, sans rotation | Un run court par produit | La protection de ce qui est déjà dans l'historique |
| (c) Ne rien faire | Nul | Toute réduction du risque |

> **Si rien n'est décidé** : (c) les fichiers restent publiés dans l'historique de deux dépôts privés.

> **D-9 — Veux-tu propager vers ton poste les skills modifiés par la campagne, puis rejouer les suites des forges qui les consomment ?**
> La campagne a modifié quatre skills versionnés (pages HTML, barre de qualité, oracles de qualité, proposition commerciale) et en a créé un (documents Word). Leur copie installée, celle que ton poste exécute, a encore l'état d'avant la campagne : le contrôle K2 (dérive entre skill versionné et copie installée) le signale sur les quatre. Les corrections de ce soir ne servent à aucune session tant que la copie n'est pas mise à jour. Une propagation a déjà cassé la suite d'une forge voisine le 8 septembre.
> **Recommandation : (a).** Source consultée : `gabarits/AGENT-CAMPAGNE.md` §« Gate de propagation des skills » (un K2 sur un skill touché se règle dans la même session, sur décision humaine explicite) et TF-0965 dans `todo/TODO.jsonl` (rejouer les suites consommatrices).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Propager, puis rejouer les suites de forge-tests, forge-design et forge-audit | Complexité moyenne × environ 20 min | Rien : un rouge éventuel est vu tout de suite |
| (b) Propager sans rejouer les suites | Complexité faible × 2 min | La détection d'une casse chez un consommateur |
| (c) Ne pas propager | Nul | L'usage des corrections de ce soir sur le poste |

> **Si rien n'est décidé** : (c) le poste continue d'exécuter les skills dans leur état d'avant la campagne.

> **D-3 — Veux-tu que le rapport d'audit joint au lot du produit de restauration reste hors du dépôt du pilot ?**
> Le lot d'audit est arrivé avec un rapport de 370 Ko et son plan de 125 remédiations, qui décrivent les faiblesses de sécurité d'une application exposée sur Internet. Le pilot se publie ; le rapport est pseudonymisé mais laissé non suivi. Le fond de l'audit est déjà porté au registre par l'item qui en est issu.
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot (aucun livrable publié sans GO humain, R-38), `REGLES-PROJET.md` règle 7 (ce qui entre dans `old\` est une version remplacée d'un livrable du dépôt, pas un artefact reçu) et `references/TODO-FORGE.md` (l'artefact reçu reste chez le produit).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Le ranger dans le sas ignoré par git, l'original restant au produit | Complexité faible × 1 min | La lecture du rapport depuis un autre poste sans passer par le produit |
| (b) Le versionner à côté de l'étude jointe | Complexité faible × 2 min, 430 Ko d'historique | La confidentialité des remédiations au prochain push |
| (c) Le laisser non suivi dans la boîte d'entrée | Nul | Un fichier orphelin qu'un ajout global peut embarquer |

> **Si rien n'est décidé** : (c) les deux fichiers restent non suivis dans la boîte d'entrée.

> **D-5 — Veux-tu écarter l'item sur le skill d'appel à l'API Claude pour absence d'objet dans le parc ?**
> L'item demandait qu'un skill livré par l'éditeur documente une combinaison de paramètres. Ni le pilot ni aucune forge ne versionne ce skill ; le sondage du 8 septembre a conclu qu'il n'y avait rien à éditer, et l'item attend depuis qu'on choisisse entre le fermer et le requalifier.
> **Recommandation : (a).** Source consultée : l'historique de TF-0838 dans `todo/TODO.jsonl` (mise à jour du 08/09) et `references/TODO-FORGE.md` (transition `ecarte` avec motif, R7).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Écarter : « sans objet, skill de l'éditeur non éditable dans le parc » | Complexité faible × 2 min | Une note d'usage locale |
| (b) Requalifier en note d'usage locale dans les références du pilot | Complexité faible × 15 min | La fermeture de l'item |
| (c) Le laisser en cours | Nul | Un compteur d'items ouverts qui compte un travail impossible |

> **Si rien n'est décidé** : (c) l'item reste en cours, sans objet.

> **D-6 — Veux-tu allumer par défaut le ciblage par ligne mutée de forge-tests, maintenant que sa vérification est faite ?**
> Le ciblage réduit une campagne de mutation aux lignes couvertes. Il était livré éteint jusqu'à ce qu'une recette prouve qu'il ne laisse échapper aucun mutant. Cette recette a été jouée sur un banc réel : même liste de survivants avec et sans ciblage, dix mutants sur douze ciblés. Le drapeau est resté éteint.
> **Recommandation : (a).** Source consultée : TF-0749 dans `todo/TODO.jsonl` (« reste éteint jusqu'à sa vérification ») et TF-0748 (le palier 1 conditionne la bascule à la seule non-perte), avec la recette `recette/non_perte_ciblage.py` de forge-tests.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Allumer par défaut par un commit dédié et réversible | Complexité faible × 10 min | Rien : le drapeau permet de l'éteindre |
| (b) Laisser éteint, activable par projet | Nul | Le gain de durée des campagnes de mutation |
| (c) Ne pas trancher | Nul | L'aboutissement de l'intention de l'item |

> **Si rien n'est décidé** : (c) le ciblage reste éteint.

> **D-7 — Veux-tu garder, pour qualifier un appel d'offres, le type d'entrant « cahier des charges » plutôt que d'en créer un nouveau dans la forge de conception ?**
> La construction outillée du référentiel d'exigences d'un appel d'offres est livrée chez la forge des agents. La décision du 11 septembre ne mandatait que cette forge, et la frontière avec la forge de conception n'a jamais été tranchée ; le mode opératoire des appels d'offres qualifie déjà ces dossiers comme cahiers des charges, à titre transitoire.
> **Recommandation : (a).** Source consultée : `references/RUN-AO.md` (étape A1, régime transitoire) et la décision D-3 (a) du 11/09 sur TF-1026 dans `todo/TODO.jsonl`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Garder « cahier des charges », part conception écartée pour l'instant, à rouvrir après un premier usage réel | Complexité faible × 2 min | Une qualification dédiée avant le premier usage |
| (b) Créer maintenant le type « appel d'offres » dans `qualifie-l-entrant` | Complexité moyenne × 1 h chez forge-conception | Rien, mais un type conçu sans cas réel |
| (c) Ne pas trancher | Nul | La clôture de l'item |

> **Si rien n'est décidé** : (c) la part conception reste ouverte, sans propriétaire.

> **D-8 — Veux-tu décider maintenant la correction des octets nuls de la page du registre ?**
> Le générateur de la page de consultation du registre écrit trois octets nuls là où des items citent une séquence d'échappement. Chaque régénération les réécrit — encore ce soir —, chaque commit de vues les publie, et le contrôle des caractères du self-test du registre rougit. Le défaut est au registre depuis le 12 septembre, en candidat.
> **Recommandation : (a).** Source consultée : `references/TODO-FORGE.md` (seul un mandat humain fait passer un candidat en décidé) et la mesure du 14/09 consignée sur TF-1067 dans `todo/TODO.jsonl` (trois octets nuls dans la page commise).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Décider TF-1067 et le corriger dans la foulée | Complexité faible × 20 min | Rien |
| (b) Le décider pour une campagne ultérieure | Nul maintenant | Un self-test rouge et une page corrompue republiée d'ici là |
| (c) Le laisser candidat | Nul | La correction elle-même |

> **Si rien n'est décidé** : (c) la page du registre reste porteuse d'octets nuls.

> **D-10 — Veux-tu valider, en un tour dédié, les trois barres de qualité externes proposées pour les livrables de communication ?**
> Trois références ont été proposées et testées : proposition commerciale privée, mémoire technique d'appel d'offres, publication destinée aux entreprises. Le protocole de la barre exige qu'un humain valide une référence par cible avant qu'aucun skill ne s'en serve ; cette étape ne se saute pas et n'a pas eu lieu.
> **Recommandation : (a).** Source consultée : le protocole du skill `la-barre` (étape 5, non sautable, `la-barre/references/registre-barres.md` chez forge-agents) et la décision humaine du 11/09 sur TF-1028 dans `todo/TODO.jsonl`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Un tour dédié où je te présente chaque référence | Environ 15 min de ton attention | Rien |
| (b) Attendre le premier livrable de communication réel | Nul maintenant | L'usage des barres d'ici là |
| (c) Ne rien décider | Nul | La clôture de l'item et le branchement des barres |

> **Si rien n'est décidé** : (c) les trois barres restent inertes.

> **D-11 — Veux-tu fermer faute d'objet l'item sur le gabarit de schéma différentiel, que deux campagnes n'ont pas pu reproduire ?**
> L'item demande d'exclure certains éléments d'une règle de chevauchement dans le schéma différentiel de base de données. Le canevas est livré et mesuré depuis le 8 septembre ; deux campagnes n'ont trouvé aucun chevauchement à quatre largeurs. Sans la page du produit qui produit le défaut, il n'y a rien à corriger.
> **Recommandation : (a).** Source consultée : `references/TODO-FORGE.md` (transition `ecarte` avec motif) et la note du 14/09 sur TF-0938 dans `todo/TODO.jsonl`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Écarter : « non reproduit en deux campagnes, à rouvrir sur lot avec page » | Complexité faible × 2 min | Rien : un retour du produit le rouvrirait |
| (b) Demander la page au produit par un lot de travaux | Complexité faible × 10 min, une action chez le produit | La fermeture d'ici là |
| (c) Le laisser ouvert | Nul | Un item ouvert sans objet démontré |

> **Si rien n'est décidé** : (c) l'item reste ouvert.

## 4. Traité

- **Boîte d'entrée** — `oracle-boite-entree` FAIL → PASS (B1 — lot jamais ingéré — ×4, B2 — lot modifié après ingestion — ×5, B3 — lot sans fichier de candidatures —, B4 — insatisfaction absente du registre — ×4 → 0) :
  - 4 lots pseudonymisés et ingérés, 12 candidatures (TF-1073 à TF-1084) ;
  - 5 rouges B2 réparés par `reempreinter-lot --par-rapprochement` (CONSIGNE ×5), classe consignée TF-1085 (anonymisation-portee-partielle) ;
  - étude jointe rangée à part (son fond est porté par TF-1084), classe consignée TF-1087 (oracle-faux-positif).
- **Insatisfactions** — contrôle B4 de la boîte FAIL → PASS et `oracle-insatisfactions` PASS (I1-I4) : INS-0002 à INS-0005 instruites en lecture seule et closes `corrige` (release du produit `a9d56b1`) ; identifiants de démonstration retirés des dossiers (0 occurrence) ; gates en défaut repris en classes TF-1088 à TF-1091.
- **Campagne, 27 corrigés** — événements `corrige` avec gains et `descente`, `oracle-todo` PASS ; chacun nomme son contrôle rouge → vert au registre :
  - pilot (fusion `f28eb644`, 11 commits, diff 17 fichiers +708/−14 identique sans CR) : TF-0987, 0988, 0978, 0956, 0979, 0986, 0989, 0985, 0962 — oracle-synthese 19/19 → 23/23, hook-restitution 20/20, conformité 66 → 68 ;
  - forge-agents (12 commits) : TF-0969 (135 → 12 accusations sur 1 022 pages), 0968 et 0973 (0 écart sur 82 pages), 0970, 0847, 1027, 1006, 0961 ;
  - forge-data (5 commits) : TF-0974, 0972, 0976, 0975, 0971 — self-test 218 → 278, rejoué par le pilot ;
  - forge-tests (`b3b0dd1`) : TF-0748, 0749 — recette de non-perte PASS, 12 mutants, survivants identiques ;
  - forge-organization (`b92b971`) : TF-0977 ; TF-1066 (forge-design `568ebab`, régression V18 réparée, self-test 2 FAIL → 0) ; TF-1064 vérifié dans les deux forges.
- **2 écartés** — TF-0960 (doublon strict de TF-0889) et TF-0947 (doublon de TF-0940), motif nommant l'original comme l'exige R14 (règle du registre sur les doublons stricts).
- **Registre des empreintes** — site `construire-referentiel-ao.mjs` déclaré ; `oracle-empreintes` FAIL → PASS.
- **Constats consignés** — 31 candidatures TF-1073 à TF-1103 ; récidives rattachées à TF-0965 (deux occurrences), TF-1067 et TF-1085 ; note de réexamen sur TF-0967.

## 5. Non traité

- **13 items en cours, chacun avec son reste nommé au registre** : TF-0940 (retirer l'ancien moteur de schéma), 1026 (part conception, D-7), 1030 et 1023 (attendent la naissance de digit-ai-marketing), 1028 (D-10), 0938 (D-11), 0791 (gains aux prochaines demandes), 0964 (volet a en candidature TF-1101), 0923 (deux volets réalisables, non faits), 0838 (D-5), 0682 (réalisation chez un produit), 0836 et 0982 (réalisation dans une forge tierce).
- **8 items encore décidés** : TF-0549, 0674, 0676, 1024, 1031 (réalisation chez un produit, hors mandat : les produits sont autonomes) ; TF-0963 (piste 2, arbitrage humain) ; TF-1025 (fixture qui attend TF-1021) ; TF-1029 (après TF-1023, par ordre humain).
- **Propagation des skills** — non faite : décision humaine (D-9).
- **Secrets publiés** — rien n'a été lu ni touché : décision humaine (D-12), candidature TF-1093.
- **Rapport d'audit joint** — non versionné : D-3.

## 6. Écarts à la lettre

- Intention : « Traite tous les todos et retours ».
- Test rétro : les retours sont tous entrés et la boîte d'entrée est au vert, ce qui sert entièrement l'intention sur ce volet. Pour les todos, la campagne a exécuté les cinquante items décidés ou en cours, sur l'option que tu as choisie ; vingt-neuf sont clos. Les vingt et un restants ne sont pas des oublis : chacun porte un motif extérieur (produit autonome, forge tierce, décision humaine, mesure future), et ce qui dépend de toi est posé en décision. Les quatre-vingt-seize candidats n'ont pas été décidés : c'était hors de l'option retenue, et c'est ce qui ne sert pas encore l'intention prise à la lettre.
- Vous avez demandé de traiter tous les retours → le rapport d'audit joint est resté hors suivi → confidentialité de 125 remédiations de sécurité (D-3).
- Deux items de forge-data sont clos sur un format voisin (texte PBIR et CSV au lieu des binaires `.pbix` et `.xlsx`), écart déclaré par l'agent ; le reste est repris en candidature (TF-1098).

## 7. Risques

- **Identifiants réels exposés dans deux dépôts privés.** Signal : commits `741ef3a` et `247fede` dans l'historique. Parade : D-12 (a).
- **Le poste exécute des skills périmés.** Signal : `oracle-skills` K2 FAIL sur quatre skills. Parade : D-9 (a), puis rejeu des suites consommatrices.
- **Octets nuls republiés à chaque régénération des vues** (encore ce soir). Signal : `oracle-caracteres-controle` FAIL sur `todo/TODO.html`. Parade : D-8 (a).
- **Règles neuves sur des corpus réduits** (échantillon de 79 pages, formats texte en data). Signal : premiers usages réels. Parade : TF-1097 (mesure de bruit industrialisée) et TF-1098.

## 8. Prochaines actions

Tri : auto_ia d'abord, puis humain. Parmi les auto_ia, A-39 vient en premier parce qu'elle ferme un risque de sécurité dès ta réponse ; A-36 ensuite parce qu'elle rend les corrections utilisables ; les suivantes sont des consignations courtes. Côté humain, A-40 passe d'abord parce qu'elle réduit un risque en cours.

| A-N | Action | Id | Acteur | Motif / raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-39** | Préparer un run par produit pour retirer du suivi et ignorer les deux fichiers publiés | TF-1093 | auto_ia | dependance_bloc_3 (D-12) | lot de travaux vers les deux produits, `gabarits/TRAVAUX-PILOT.md` | Si rien n'est fait : les fichiers restent suivis et republiés à chaque push |
| **A-36** | Propager les skills puis rejouer les suites de forge-tests, forge-design et forge-audit | TF-0965 | auto_ia | dependance_bloc_3 (D-9) | `node oracles\oracle-skills.mjs --appliquer` | Si rien n'est fait : le poste exécute d'anciennes règles |
| **A-24** | Décider TF-1067 au registre et corriger le générateur de la page | TF-1067 | auto_ia | dependance_bloc_3 (D-8) | `node todo\journaliser.mjs --fichier <decision.json>` puis `todo/generer-page.mjs` | Si rien n'est fait : la page du registre est corrompue à chaque régénération |
| **A-17** | Allumer le drapeau du ciblage par un commit dédié chez forge-tests | TF-0749 | auto_ia | dependance_bloc_3 (D-6) | `forge_tests/adaptateurs/mutation.py`, défaut de `FORGE_TESTS_MUTATION_CIBLAGE` | Si rien n'est fait : les campagnes de mutation restent entières |
| **A-14** | Consigner l'issue de D-5, D-7 et D-11 au registre | TF-0838 | auto_ia | dependance_bloc_3 (D-5, D-7, D-11) | `node todo\journaliser.mjs --fichier <evenements.json>` | Si rien n'est fait : trois items restent ouverts sans objet |
| **A-42** | Retirer le worktree fusionné du chantier pilot | `neuve` | auto_ia | garde_fou (suppression d'un répertoire) | `git worktree remove .claude/worktrees/agent-ac087535fe0698917` | Si rien n'est fait : un clone de travail périmé reste sur le poste |
| **A-40** | Ouvrir les fichiers publiés et faire tourner les identifiants réels chez leurs émetteurs | TF-1093 | manuelle_utilisateur | acces — trace mesurée : sortie de `node oracles\oracle-secrets-hors-perimetre.mjs` au 15/09, « 8 porteur(s) de secrets DANS un dépôt qui ne les IGNORE PAS, état le plus grave : PUBLIE » ; lecture interdite à l'IA par le garde-fou « les `.env` ne transitent jamais » | ouvrir les fichiers que liste `node oracles\oracle-secrets-hors-perimetre.mjs` (état PUBLIE) | Si rien n'est fait : des identifiants réels restent valides dans l'historique |
| **A-25** | Trancher D-12, D-9, D-3, D-5, D-6, D-7, D-8, D-10 et D-11 | TF-1028 | manuelle_utilisateur | decision | lire le bloc 3 de `output/04-plans/Digit-AI - Synthese Mandat - Campagne des todos et retours - 20260915a.md`, puis répondre par sélecteur, par exemple « D-12 (a), D-9 (a) » | Si rien n'est fait : dix sujets restent suspendus |
| **A-41** | Donner le GO de publication des huit dépôts modifiés | `neuve` | manuelle_utilisateur | decision (R-38 : push sur GO humain) | répondre « push » ; le pilot joue alors `git push` dépôt par dépôt derrière la porte des noms | Si rien n'est fait : les corrections restent sur ce seul poste |

## 9. Traces

- `todo/TODO.jsonl` (40 clôtures du 14/09, 31 créations TF-1073 à TF-1103), `todo/TODO.md`, `todo/RECIDIVES.md`
- `insatisfactions/REGISTRE.jsonl`, `output/05-insatisfactions/INS-0002/` à `INS-0005/`
- `input/00-retours/`, `input/01-candidatures/`
- `references/EMPREINTES.md`
- enregistrements locaux : pilot `144c0b4d`, `5d0f157e`, `f28eb644` ; forges : agents `bdeaa12`…`c81944e`, data `880e2d8`…`b24c90a`, tests `b3b0dd1`, design `568ebab` `6c25710`, organization `b92b971`, audit `ae3dfd8`
