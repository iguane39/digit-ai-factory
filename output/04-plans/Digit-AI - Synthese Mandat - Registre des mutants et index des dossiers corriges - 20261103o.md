---
destinataire: humain
---

# Synthèse Mandat — les 3 restes de la campagne d'hier sont corrigés et publiés, le registre des mutants est de nouveau exact (03/11/2026)

## 0. Synthèse d'ouverture

Les 3 restes ouverts de la campagne d'hier sont corrigés et publiés. Le registre des mutants de forge-development dit de nouveau la vérité : 19 survivants, tous classés, et un score de 97,09 % contre 85,76 % hier. Un mutant est une copie du code altérée exprès, et un survivant est une altération qu'aucun test ne détecte. La porte de mutation imprimait « PASS » sans avoir rien mesuré ; elle dit maintenant qu'elle n'a rien jugé. Dans le pilot, Git Bash 32 bits est enfin trouvé, et l'index des dossiers ne change plus selon le poste qui le régénère. L'autre item de votre action, la recette qui écrivait le registre d'observabilité, avait déjà été corrigé à 11:07 par une autre session : ma synthèse précédente le disait ouvert à tort. Rien n'attend de décision de votre part dans ce tour. La publication de mes 2 derniers commits du pilot attend D-161, que vous a posée une autre session sur le nom d'emprunt du produit de tests d'intrusion. Le remplacement de la consigne page HTML sur vos 2 comptes attend toujours votre geste.

## 1. En-tête d'identification

Exécution de votre réponse « A2 » du 03/11/2026 à l'action A-2 de la synthèse 20261103e, sur le pilot `digit-ai-factory` et forge-development. Période : 03/11/2026 de 14:45 à 16:37, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, 1 agent de campagne Sonnet 5.5 et 2 relectures d'intention.

Intention de la demande : corriger les restes ouverts sans vous laisser ce qui s'exécute seul.

Test rétro : le résultat sert cette intention. Chaque reste a sa correction publiée et rejouée, et aucun ne vous revient.

## 2. Verdict

TF-2068 est clos. Mesuré sur : mutmut rejoué par moi dans un conteneur neuf, de 15:24 à 15:25, périmètre les 653 mutants du job `mutation` de forge-development. Mes 2 commits de forge-development sont publiés : l'envoi a rendu `99f9bb9..16f515f`, et à 16:37 le seul commit local restant, de 15:38, vient d'une autre session. Le pilot porte mes 3 corrections publiées ; le registre et cette synthèse restent locaux, voir bloc 5.

## 3. Décisions attendues

Rien n'attend de décision de votre part dans ce tour.

D-161 : le nom d'emprunt du produit de tests d'intrusion, posée le 03/11 à 15:16 par une autre session, inchangée ; elle bloque aussi la publication de ce travail (bloc 5).

## 4. Traité

Chaque chiffre ci-dessous vient d'une commande que j'ai jouée dans ce tour, sauf mention « rapporté ».

**forge-development**

- **Registre des mutants** (forge-development 0e4f70c, agent de campagne) : 74 des 93 survivants sont tués par de nouveaux tests, et les 19 restants sont classés en 4 classes. Mon recompte dans un conteneur neuf donne 634 tués, 19 survivants, 653 mutants, et chacun des 19 figure au registre. Rapporté par l'agent, non recompté : 26 tests ajoutés, et la hausse de 288 mutants vient des commits 25e29a4 et 79eef0b, sans perte des anciens tests. Le seuil de 75 % et le périmètre muté ne bougent pas.
- **Porte de mutation muette** (forge-development 16f515f) : sans fichier de mesure, elle imprimait « mutation gate: PASS ». Elle imprime désormais « SKIP (non jugé) » avec son motif, comme les 3 portes corrigées hier sous TF-2059. 2 cas rouges et 1 cas vert ajoutés.
- **Vérifications** : `pytest` 568 passés et 1 sauté, `ruff` et `mypy` verts. Le workflow `double-gate` réussit ses 3 jobs sur 16f515f, en CI réelle.

**Le pilot**

- **Git Bash 32 bits** (pilot dacc2051) : le chemin candidat `%ProgramFiles(x86)%` n'était jamais développé, à cause des parenthèses du nom. Il l'est, et sur ce poste il donne `C:\Program Files (x86)`. Recette `consommateurs-skills` 38 PASS.
- **Index des dossiers** (pilot 781186b2) : l'index publié `input\README.md` comptait les fichiers non suivis par git présents sur le poste. Une copie de travail séparée, ou l'autre poste, régénérait donc un autre index et le jugeait périmé. Ce compte s'imprime maintenant sur le poste, et l'index ne dépend plus que du dépôt. L'oracle des index rend exit 0 dans une copie de travail neuve, contre un rouge avant. Recette du générateur 37 PASS.
- **Harnais complet** : joué de 14:56 à 16:16, 5 oracles sur 242 en défaut, aucun lié à ce tour. La recette du hook d'ouverture, rouge pendant le harnais, rend 62 PASS rejouée seule : 8 fichiers ont été écrits par d'autres sessions pendant son passage. Les 4 autres sont des états du parc, détaillés au bloc 5.

Relecture d'intention : sert, gravité mineure, 1 écart, verdict consigné sous RI-20261103-19 ; l'écart porte sur des fichiers d'autres sessions vus dans le dépôt partagé. La consigne de l'agent avait été relue avant le lancement, « sert » sous RI-20261103-10.

## 5. Non traité

- La publication de mon commit de registre d15e301a et de cette synthèse — motif : bloqué par un garde-fou ; à 16:35, `oracle-nom-client-publie` refuse l'envoi du pilot pour 27 constats d'un nom de produit réel, tous venus de fichiers et d'entrées de relecture d'autres sessions, en attente de D-161. `git rev-list --left-right --count` rend 13 0 à 16:35. Critère de réouverture : D-161 tranchée et ses fichiers pseudonymisés.
- Le compte de `references/PRODUITS.md`, qui cite 32 produits quand la source en constate 33 — motif : `hors_mandat`, il suit l'ingestion des retours de Produit-86 faite par une autre session à 15:33.
- Les 3 autres défauts d'état du parc (copies de skills en retard, un README d'`input` au rôle non rédigé, une note scellée en cours de modification) — motif : `hors_mandat`, ils viennent du travail en cours d'autres sessions.
- Le remplacement de la consigne page HTML sur vos 2 comptes (TF-1991) — motif : `acces`, voir A-1.

## 6. Écarts à la lettre

- Votre réponse « A3 » de 09:53 laissait TF-2068 en attente → je l'ai traité → votre réponse « A2 » de 14:45 le nommait, et elle est la plus récente.
- Votre action nommait TF-2067 → je n'y ai rien fait → une autre session l'avait corrigé et clos à 11:07, avant ma synthèse 20261103e, qui le disait ouvert à tort.
- La porte de mutation muette ne faisait pas partie des restes → je l'ai corrigée → je l'ai trouvée pendant le recompte, et c'est le défaut que TF-2059 a corrigé hier sur 3 autres portes.
- La recette du générateur d'index exigeait le compte des non suivis dans l'index → elle l'exige maintenant dans la sortie du générateur, et exige en plus un index identique avec ou sans fichier non suivi → votre décision D-20 (a) du 26/09 a posé qu'un index publié ne dépend pas du poste qui le régénère.
- Mes 2 premiers commits du pilot sont partis avec l'envoi d'une autre session → je ne les ai pas publiés moi-même → l'envoi du pilot porte toute la branche ; `git branch -r --contains` les montre sur le distant.

## 7. Risques

- **Mutants laissés survivants par choix de méthode** : 19 survivants restent classés équivalents, parce qu'aucune entrée du programme ne les distingue. L'agent estime que des tests qui inspectent le code interne en tueraient 13.
  - Signal : un survivant du registre qui cache un vrai défaut de comportement.
  - Parade : chaque classe du registre donne sa raison, et le job de mutation la remet en jeu à chaque envoi.
- **Mesure instable 1 fois sur 6** : rapporté par l'agent, non recompté, un rejeu a donné 635 tués et 18 survivants. L'écart va dans le sens favorable.
  - Signal : un score du job `mutation` différent de 97,09 % sans changement du code muté.
  - Parade : la mesure retenue est la plus basse, celle de mon recompte.

## 8. Prochaines actions

Ordre : une seule action reste, votre geste, car lui seul est hors de ma portée.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Remplacer la consigne page HTML sur vos 2 comptes, pour que les sessions hors dépôt lisent les bonnes polices | TF-1991 | manuelle_utilisateur | `acces` : API de la plateforme https://api.anthropic.com/v1/skills HTTP 401 et https://claude.ai/api/skills HTTP 403, relevés le 02/11/2026 ; identité de la session sans clé ; aucune identité de service ; script du dépôt `sync-skills.mjs` 0 mention du compte | suivre le guide de la synthèse 20261102k | si rien n'est fait, un brief écrit hors du dépôt peut reprendre Roboto et DM Sans |

## 9. Traces

- Registre : `todo/TODO.jsonl` ; relectures dans `todo/relectures-intention.jsonl`.
- Pilot : commits dacc2051 et 781186b2, publiés ; d15e301a, local.
- forge-development : commits 0e4f70c, 16f515f ; workflow `double-gate` 41653696757.
- Consigne de campagne : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\2071e2c2-a550-4861-af6a-8b64f7aafe28\scratchpad\campagne-tf2068.md`.
