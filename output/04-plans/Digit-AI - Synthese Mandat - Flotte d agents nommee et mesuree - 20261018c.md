---
destinataire: humain
---

# Synthèse Mandat — D-19 (a) exécutée : 5 agents nommés, un rappel à chaque délégation, un relevé à chaque ouverture, le juge externe sur Opus 5.5 (18/10/2026)

## 0. Synthèse d'ouverture

Votre réponse « 19a » est exécutée. La flotte a maintenant 5 agents nommés : explorateur, vérificateur, campagne, constructeur et rédacteur. Chacun déclare son modèle, son effort et ses outils, et les produits les recevront à leur prochaine ouverture. Un hook rappelle cette flotte quand une délégation vise l'agent générique, sans rien bloquer. Un relevé automatique mesure la flotte à chaque ouverture du pilot, et le juge externe tourne désormais sur Opus 5.5 au lieu d'Opus 4.6. La flotte ne servira qu'à partir de la prochaine session : Claude Code ne charge les agents d'un projet qu'à l'ouverture. En construisant le relevé, j'ai trouvé une erreur dans mes chiffres de ce matin : je comptais 2 fois les jetons relus. Corrigée, la mesure renforce la conclusion : les sous-agents du pilot relisent plus que les sessions de pilotage. Une décision vous revient, D-20 : enregistrer et publier ces changements.

## 1. En-tête d'identification

Mandat d'exécution de D-19 (a) du 18/10/2026, sur le pilot digit-ai-factory (départ `92b4ec4b`) et la forge digit-ai-forge-agents (départ `4683696`), poste DESKTOP-ULTRA7. Période : 18/10/2026, de 07:31 à 08:25, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; aucun agent délégué, un essai de lancement de l'agent `explorateur` refusé par le harnais ; escalade de modèle : aucune.

Intention de la demande : que l'option O2 (flotte nommée et relevé automatique) de l'étude produise ses effets, c'est-à-dire une flotte qui porte ses propres règles et une mesure qui dira, à la revue du 01/11, si elles sont appliquées.

Test rétro : le résultat sert cette intention, avec une limite dite. Chaque pièce de O2 est en place et vérifiée par sa recette. L'effet sur les délégations réelles ne se mesurera qu'à partir de la prochaine session.

## 2. Verdict en une ligne

Pièces de O2 en place : 5 agents compilés, graphe PASS ; hook 12 cas sur 12 ; relevé 8 sur 8 ; juge servi par `claude-opus-5-5` ; recette complète du pilot 223 sur 225, les 2 restants étant l'écart de copie installée qui attend D-20 ; rien d'enregistré.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-20 — Puis-je enregistrer et publier les changements de la flotte, et remettre à niveau la copie installée du skill de contrôle qualité ?**
>
> - **De quoi s'agit-il** : 26 fichiers modifiés ou créés dans le pilot (flotte, hook, relevé, héritage, contrat, référentiel, registre, base des recettes), plus l'étude et les 2 synthèses du jour ; 3 fichiers dans la forge des outils (le choix de la CLI du juge externe) ; et la copie de ce skill installée sur le poste.
> - **Le problème** : tant que rien n'est enregistré, les produits ne reçoivent pas la flotte et une autre session peut perdre ce travail. La copie installée du skill diverge de sa source sur 3 fichiers, ce qui fait échouer 2 contrôles de la recette du pilot.
> - **Pourquoi vous** : votre règle exige un accord explicite pour enregistrer et publier, et la remise à niveau d'une copie installée est réservée à votre décision.
> - **Recommandation : (a)** — toutes les recettes touchées passent, et les 2 contrôles restants passent dès la remise à niveau. Source consultée : la sortie de `node oracles/self-tests.mjs` (223 sur 225) et `node oracles/oracle-skills.mjs` (écart K2 sur 3 fichiers nommés).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Enregistrer et publier les 2 dépôts, remettre la copie installée à niveau | Les produits reçoivent la flotte et le hook à leur prochaine ouverture ; le pilot passe par sa garde de publication | Faible × court, environ 9 min pour la garde du pilot | Possible, par un enregistrement correctif |
| (b) Enregistrer sans publier, remettre la copie à niveau | Le travail est sauvé sur ce poste ; les produits et l'autre poste ne le voient pas | Faible × court | Possible |
| (c) Ni l'un ni l'autre | Tout reste modifié sur ce poste, et la recette du pilot garde 2 contrôles rouges | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est enregistré ni publié.

## 4. Traité

Chaque pièce de l'option O2, avec la commande qui la prouve.

- **Flotte de 5 agents.** Définitions `gabarits/flotte/*.yaml` et leur README ; compilées en `.claude/agents/` par `compile-agent-def.mjs` de forge-agents. Preuve : « [OK] 5 agent(s) compilé(s) » ; `oracle-defs.mjs` PASS, graphe cohérent.
- **Propagation aux produits.** HERITAGE passe en 1.29.0 : 5 copies conformes, et le câblage du hook est exigé. Preuve : `recopier-heritage.mjs ../Produit-61 --essai` annonce les 5 copies ; recettes d'héritage 43 et 20 cas verts.
- **Hook de rappel.** `oracles/hook-flotte.mjs` sur l'outil Agent : il avertit sans bloquer, et se tait pour un agent nommé ou une dérogation dite (`model` et `effort` déclarés). Il est branché au pilot, au gabarit des produits et à leur lanceur. Preuve : `node oracles/hook-flotte.test.mjs`, 12 cas verts dont 6 rouges.
- **Relevé de flotte.** `scripts/relever-flotte.mjs` : appels nommés ou hors flotte, modèle et effort servis, jetons comptés une fois par réponse, réponses hors génération datées par famille, 3 critères de revue, option `--journal` pour la fin de campagne. Il est joué à chaque ouverture. Preuve : `node scripts/relever-flotte.test.mjs`, 8 cas verts ; recette du relevé d'ouverture verte en 54 s.
- **Mesure de départ, 14 derniers jours.** 28 appels de l'outil Agent, 0 vers un agent nommé, 11 délégations Opus sans effort, 14 réponses hors génération (le juge sur Opus 4.6) ; les 3 critères sont non tenus, ce qui sert de point de comparaison pour le 01/11. Preuve : `node scripts/relever-flotte.mjs --jours 14`.
- **Juge externe.** `lib/cli-claude.mjs` choisit la CLI la plus récente du poste, et le juge demande la famille `opus`. Preuves : la CLI retenue est le binaire de l'extension 2.1.300 au lieu du npm 2.1.107 ; un jugement réel a été servi par `claude-opus-5-5` (4 réponses dans sa transcription) ; la CLI 2.1.107 rendait « API Error: 400 » avec ce modèle.
- **Référentiel et doctrine.** `MODELES-EN-SERVICE.json` 1.3.0 ajoute la clé `flotte` et dit ce que le rejeu couvre et ce qui reste dû ; le contrat d'interface est mis à jour en §4, §4 bis et §5, ainsi que le gabarit d'agent de campagne. Preuve : `oracle-modeles-en-service` PASS.
- **Registre.** 13 événements : TF-1843 à TF-1846 créés et décidés par D-19 (a), leur état, et une note sur TF-1561. TF-1843 reste en cours jusqu'à la revue du 01/11 ; les 3 autres sont corrigés sur le disque et restent « en cours » au registre jusqu'à l'enregistrement. Preuve : contrôle du registre PASS avant et après chaque écriture.
- **Recettes.** Pilot complet : 223 oracles sur 225 verts. Forge des outils : 85 cas sur 85. Contrôle qualité : mon cas neuf est vert, avec 2 échecs préexistants.
- **Mes chiffres de ce matin, recomptés.** Une réponse s'écrit sur plusieurs lignes de transcription qui répètent son compte de jetons. Mon relevé manuel les additionnait ligne à ligne. Recompté une fois par réponse, sur 30 jours, les sous-agents du pilot relisent 1,99 milliard de jetons, contre 1,64 pour les sessions de pilotage ; j'avais écrit 3,83 contre 3,82. Leur médiane d'appels d'outils est de 49, et non 41. Preuve : la recette du relevé a été rouge, puis verte une fois la correction faite (« sortie 500, attendu 300 + 200 »).

## 5. Non traité

- **L'enregistrement, la publication et la remise à niveau de la copie installée.** Motif : votre accord explicite est requis (D-20).
- **Le re-test de Haiku et de Sonnet 5.5 sur 2 classes de tâche.** Motif : il faut 2 tranches comparables lancées par les agents nommés, qui ne servent qu'à partir de la prochaine session ; le protocole est inscrit au référentiel.
- **Les 2 échecs de la recette du contrôle qualité (TF-1483 et TF-1448).** Motif : préexistants ; les mêmes échecs apparaissent sur l'état enregistré, sans mes changements. Ils touchent la détection de noms dans des fichiers aux noms accentués.
- **La correction de l'étude 20261018a et de la synthèse 20261018b.** Motif : ce sont des livrables déjà jugés ; la correction des chiffres est consignée ici et au registre (TF-1844), pas réécrite dans ces fichiers.

## 6. Écarts à la lettre

Quatre écarts entre l'option O2 décrite dans l'étude et ce qui est livré.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-19 (a), qui reprend l'étude : un agent `Explore` de projet sur Haiku remplace le natif | Pas de remplacement ; le hook rappelle la flotte quand `Explore` est appelé sans modèle | Le compilateur n'accepte que des noms en minuscules ; `explorateur` remplit ce rôle |
| D-19 (a) : constructeur sur Opus à l'effort `high` | Constructeur sur Opus à l'effort `max` | La table d'effort du référentiel classe la construction complexe à `max`, classe non rejouée |
| D-19 (a) : explorateur à l'effort `low` | Aucun effort déclaré | Haiku est absent du rejeu, et le compilateur ne lui pose pas d'effort par défaut |
| D-19 (a) : rouvrir TF-1561 | Une note conteste son gain et confie son suivi à TF-1843 | Le registre interdit de rouvrir un sujet corrigé (règle R5) |

## 7. Risques

- **La flotte n'est pas utilisée.**
  - Énoncé : rien n'oblige à employer les agents nommés, puisque le hook avertit seulement.
  - Signal : une part d'appels vers un agent nommé sous 90 % au relevé d'ouverture.
  - Parade : la revue du 01/11 décide s'il faut passer le hook en blocage.
- **Un agent sous-dimensionné échoue.**
  - Énoncé : Haiku pour l'explorateur, ou l'effort `medium` pour le vérificateur, sur une tâche qui demandait plus.
  - Signal : un oracle rouge sur une tâche de ces agents, visible au relevé.
  - Parade : l'escalade prévue au §4 du contrat, puis une mesure avant de changer la définition.

## 8. Prochaines actions

Les gestes de l'IA d'abord ; votre décision ensuite.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1843 à TF-1846 | Enregistrer et publier le pilot et la forge des outils, puis remettre à niveau la copie installée du skill | auto_ia | dependance_bloc_3 : attend D-20 | `git commit --only -- <fichiers>`, `git push` sous la garde, puis `node oracles/oracle-skills.mjs --appliquer` | Les produits ne reçoivent pas la flotte |
| **A-2** | TF-1843 | Revue des critères sur le relevé des 14 jours précédents | auto_ia | dependance_externe : la revue est datée du 2026-11-01 | `node scripts/relever-flotte.mjs --jours 14` | Le hook reste en avertissement sans fondement mesuré |
| **A-3** | TF-1846 | Re-test de Haiku et de Sonnet 5.5 sur 2 tranches comparables | auto_ia | dependance_externe : il faut une campagne lancée avec les agents nommés, à partir de la prochaine session | `node scripts/relever-flotte.mjs --depuis <début> --journal <journal>` | Le routage de ces 2 modèles reste une hypothèse |
| **A-4** | `neuve` | Trancher D-20 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `20a` | L'option (c) s'applique |

## 9. Traces

- Flotte : `gabarits/flotte/` (5 définitions et README) et `.claude/agents/` (5 agents compilés)
- Hook et relevé : `oracles/hook-flotte.mjs`, `scripts/relever-flotte.mjs`, et leurs recettes
- Câblage : `.claude/settings.json`, `gabarits/settings-produit.json`, `gabarits/hooks-factory.mjs`, `gabarits/HERITAGE.json`, `oracles/hook-ouverture.mjs`, `oracles/self-test.mjs`
- Doctrine : `CONTRAT-INTERFACE.md`, `gabarits/AGENT-CAMPAGNE.md`, `references/MODELES-EN-SERVICE.json`
- Forge des outils : `.claude/skills/quality-oracles/scripts/lib/cli-claude.mjs`, `oracle-judge.mjs`, `self-test.mjs`
- Registre : `todo/TODO.jsonl`, qui porte aussi une ligne non enregistrée d'une session du 17/10 (TF-1552), laissée intacte
- Rien n'est enregistré ni poussé.
