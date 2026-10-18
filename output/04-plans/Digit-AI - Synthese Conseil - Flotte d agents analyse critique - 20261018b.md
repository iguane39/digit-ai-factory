---
destinataire: humain
---

# Synthèse Conseil — la flotte d'agents tient par ses gardes, pas par sa définition : 15 écarts mesurés et un remède recommandé (18/10/2026)

## 0. Synthèse d'ouverture

La flotte décrite par la doctrine, un pilote Opus et des agents d'exécution routés par modèle et par effort, n'est pas celle qui tourne. Sur 30 jours, ce poste a lancé 201 sous-agents : 191 étaient des agents génériques capables d'écrire partout, aucun n'a reçu l'effort de sa classe de tâche, et Haiku n'a été demandé qu'une fois sur 157 appels. Aucun ledger n'a consigné d'appel d'agent depuis le 25/09, et le journal des campagnes s'arrête au 01/10 : le tableau de routage ne reçoit plus de mesure. Ce qui tient, ce sont les gardes : un livrable n'est accepté que sur un oracle exécuté, et un agent n'écrit que dans un dépôt sans jamais pousser. L'étude recommande de donner à chaque agent un nom, un modèle, un effort et des outils déclarés, et de relever la flotte automatiquement à chaque ouverture. Une décision vous revient, D-19 : appliquer ce remède ou non.

## 1. En-tête d'identification

Conseil en lecture seule sur le pilot digit-ai-factory et les transcriptions de Claude Code du poste DESKTOP-ULTRA7, profil `~\.claude`, fenêtre du 18/09 au 18/10/2026. Période : 18/10/2026, de 07:13 à 07:30, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; aucun agent délégué ; escalade de modèle : aucune. Contrôles joués : `oracle-etude-opportunite.mjs`, `relever-contexte-sessions.mjs`, `hook-restitution.mjs --prejuger`.

Intention de la demande : savoir si l'organisation « un pilote, puis des agents d'exécution » est bien conçue et bien appliquée, ce qu'elle coûte, où elle échoue et quoi changer, avec de quoi décider.

Test rétro : le résultat sert cette intention. La critique repose sur 15 constats mesurés ce jour, séparés de 5 points qui tiennent, et les moyens d'amélioration sont 5 options fermées avec leur coût et ce qu'elles excluent ; une seule est recommandée.

## 2. Verdict en une ligne

Étude PASS sur les 10 contrôles de son gabarit : 191 agents génériques sur 201, effort transmis à 0 appel sur 157, Haiku demandé 1 fois sur 157, 0 invocation au ledger depuis le 25/09 ; option recommandée O2, moyen × court.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-19 — Faut-il câbler la flotte d'agents dans sa définition et la mesurer à chaque ouverture ?**
>
> - **De quoi s'agit-il** : les agents que le pilot et les produits lancent pour exécuter les tâches. Aujourd'hui, leur modèle, leur effort, leurs droits d'écriture et leur contrat dépendent de ce que la session écrit dans la consigne au moment de l'appel.
> - **Le problème** : les règles existent mais ne s'appliquent pas. Aucun appel sur 157 ne transmet l'effort, alors que la règle date du 13/10. Les produits délèguent 75 fois sur 97 sans modèle, donc à Opus. Une délégation d'écriture sur deux ne porte pas le contrat commun. Rien ne le mesure, et la correction de l’effort a été close au registre alors qu’elle ne touche aucun agent réellement lancé.
> - **Pourquoi vous** : le remède change la doctrine de routage du noyau, le coût des délégations, et ce que les produits reçoivent par l'héritage ; votre consigne veut aussi qu'une analyse s'arrête à son livrable.
> - **Recommandation : (a)** — corriger sans mesurer reproduirait le cas de TF-1561, clos sur un gain que personne ne voyait. Sources consultées : `output\03-etudes\20261018-etude-opportunite-flotte-d-agents.md`, constats M-05, M-06 et M-12 ; documentation Claude Code « Subagents », lue le 18/10/2026 : le modèle, l'effort et les outils se déclarent dans la définition de l'agent.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Appliquer O2 : flotte nommée et relevé automatique | 5 agents nommés (explorateur en Haiku, vérificateur et campagne en Sonnet, constructeur en Opus, rédacteur en Sonnet), chacun avec son effort et ses outils, propagés aux produits ; un hook avertit quand un appel vise l'agent générique ; le juge externe reçoit un modèle de la génération courante ; un relevé de la flotte à chaque ouverture ; revue le 01/11 sur des critères écrits | Moyen × court, plus un re-test de 2 classes (simple × court en appels de modèle) | Possible : retirer les définitions et le hook rend l'état actuel |
| (b) Appliquer O1 seulement : flotte nommée sans relevé | Les mêmes définitions, le hook et le juge ; aucun relevé, la revue se fait à la main | Moyen × court | Possible |
| (c) Ne rien changer | Les agents restent génériques, sans effort déclaré ; le tableau de routage reste sans mesure | Nul à court terme ; chaque délégation continue au modèle et à l'effort de la session | Sans objet |

> **Sans réponse** : (c), rien ne change et les 4 candidatures ne sont pas déposées.

## 4. Traité

Chaque élément de l'analyse, avec la commande ou le fichier qui le prouve.

- **Relevé de la flotte sur 30 jours.** 169 sessions principales, 157 appels de l'outil Agent, 201 sous-agents. Preuve : script `flotte.mjs` du dossier temporaire de la session, joué sur `~\.claude\projects\` depuis le 2026-09-18, puis depuis le 2026-10-13 (28 appels, 0 avec effort).
- **Composition.** 191 `general-purpose`, 9 `Explore`, 1 `claude-code-guide`, 0 agent compilé, 0 appel de l'outil Workflow. Preuve : même script ; `grep` de `"name":"Workflow"` dans les transcriptions, 0 fichier.
- **Modèle et effort.** Pilot : 58 appels sur 60 nomment le modèle ; produits : 75 sur 97 l'héritent ; Sonnet 5.5 sert à `medium` 17 fois sur 17 depuis le 13/10. Preuve : même script, champs `model` et `effort` des appels et des réponses.
- **Contrat et privilèges.** 14 délégations d'écriture du pilot sur 31 citent le contrat commun ; 45 agents se disent en lecture seule avec un agent qui peut écrire. Preuve : lecture de la première consigne de chaque sous-agent du pilot ; le classement « écriture » se fait sur le libellé, c'est une heuristique.
- **Coût.** Sous-agents du pilot : 3,83 milliards de jetons relus en cache, autant que les sessions de pilotage (3,82) ; 52 158 jetons de contexte au départ et 41 appels d'outils en médiane. Preuve : même script, champ `usage`.
- **Contexte du pilotage.** 3 sessions sur 14 au-delà du seuil de 400 000 jetons, 54 % du relu au-delà. Preuve : `node scripts/relever-contexte-sessions.mjs --projet digit-ai-factory`, verdict AVERT.
- **Traçabilité.** 8 ledgers modifiés depuis le 25/09, 0 invocation datée d'après, 0 `modele_version` ; dernier journal de campagne au 01/10. Preuve : `grep` des 8 ledgers ; titres de `BOUCLE-AMELIORATION.md`.
- **Juge externe.** `oracle-judge.mjs` appelle `claude -p` sans modèle ; la CLI npm est en 2.1.107 ; 12 sessions de juge servies par `claude-opus-4-6` depuis le 13/10. Preuve : `oracle-judge.mjs` lignes 29 et 149 ; `package.json` de la CLI ; champ `version` des transcriptions.
- **État de l'art.** 5 sources datées, de décembre 2024 à septembre 2026, lues ce jour.
- **Étude.** `output\03-etudes\20261018-etude-opportunite-flotte-d-agents.md`. Preuve : `node oracles/oracle-etude-opportunite.mjs`, PASS sur les 10 contrôles du gabarit d’étude, de E1 (sections présentes) à E10 (test rétro écrit).

## 5. Non traité

- **Le dépôt des 4 candidatures dans la boîte d'entrée.** Motif : votre consigne arrête une analyse à son livrable ; elles sont rédigées dans l'étude, section 5, et se déposent sur votre réponse à D-19.
- **L'autre poste et l'autre profil.** Motif : leurs transcriptions ne sont pas sur ce poste ; les chiffres ne valent que pour DESKTOP-ULTRA7.
- **Le coût en euros de la flotte.** Motif : les transcriptions donnent des jetons, pas une facture ; la conversion dépend du forfait, que je ne lis pas.
- **L'enregistrement des 2 fichiers produits.** Motif : votre consigne demande un accord explicite pour enregistrer après une analyse.

## 6. Écarts à la lettre

Aucun écart : vous avez demandé une analyse critique et des moyens d'amélioration ; j'ai livré une étude d'opportunité qui porte les deux, et rien n'a été modifié dans les forges, les produits ou le registre.

## 7. Risques

- **Les chiffres viennent d'un seul poste.**
  - Énoncé : l'autre poste porte peut-être d'autres usages, par exemple plus de délégations chez les produits.
  - Signal : une revue du 01/11 dont les chiffres divergent fortement entre postes.
  - Parade : le relevé de l'option (a), joué à l'ouverture sur chaque poste.
- **Un hook trop strict bloquerait le travail.**
  - Énoncé : un appel légitime à l'agent générique serait refusé.
  - Signal : des avertissements nombreux sur des tâches qui n'entrent dans aucun des 5 agents.
  - Parade : le hook avertit d'abord et ne bloque qu'après la revue du 01/11.
- **Un effort plus bas peut faire échouer une tâche.**
  - Énoncé : Haiku ou un effort `low` sur une vérification qui demandait plus.
  - Signal : un oracle rouge sur une tâche d'explorateur ou de vérificateur.
  - Parade : l'escalade prévue au §4 du contrat, consignée par le relevé.

## 8. Prochaines actions

Les gestes de l'IA d'abord, qui attendent tous votre réponse ; votre décision ensuite.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Déposer les 4 candidatures de l'étude dans la boîte d'entrée, puis les ingérer | auto_ia | dependance_bloc_3 : attend D-19 | `node todo/ingerer-lot.mjs <fichier de lot>` | Les constats restent hors du registre |
| **A-2** | `neuve` | Générer les 5 agents nommés, le hook d'avertissement, la ligne d'effort Sonnet et le modèle du juge | auto_ia | dependance_bloc_3 : attend D-19 (a) ou (b) | `compile-agent-def.mjs` de forge-agents, puis recette | Les délégations gardent le modèle et l'effort de la session |
| **A-3** | `neuve` | Écrire `scripts/relever-flotte.mjs` avec sa recette et le brancher à l'ouverture | auto_ia | dependance_bloc_3 : attend D-19 (a) | `node scripts/relever-flotte.mjs` | La revue du 01/11 n'a pas de mesure |
| **A-4** | `neuve` | Enregistrer l'étude et cette synthèse | auto_ia | dependance_bloc_3 : votre accord explicite, quelle que soit l'option | `git commit --only -- <2 fichiers>` | Les 2 fichiers restent hors enregistrement |
| **A-5** | `neuve` | Trancher D-19 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `19a` | L'option (c) s'applique |

## 9. Traces

- Étude : `output\03-etudes\20261018-etude-opportunite-flotte-d-agents.md`
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Conseil - Flotte d agents analyse critique - 20261018b.md`
- Relevés : `flotte.mjs`, `flotte-30j.json` et `flotte-depuis-1310.json`, dans le dossier temporaire de la session
- Rien n'est enregistré ni poussé.
