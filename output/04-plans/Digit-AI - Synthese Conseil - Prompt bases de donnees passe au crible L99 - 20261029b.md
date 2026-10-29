---
destinataire: humain
---

# Synthèse Conseil — prompt sur les bases de développement et de qualification passé au crible L99, version a déposée (29/10/2026)

## 0. Synthèse d'ouverture

Votre question est claire sur les trois scénarios, mais elle se contente d'un « oui » trop facile : je la note 36 sur 100, et la version réécrite atteint 86 en projection, non mesurée. Le relevé de ce matin répond déjà en partie : la copie anonymisée de la production n'existe nulle part, les jeux synthétiques existent en partie chez forge-tests, et la remise à zéro d'une base n'existe pas. La version réécrite définit ce qu'est un process « couvert » pour qu'une ligne de gabarit ne passe pas pour un outil. Elle relève aussi un conflit : forge-tests interdit aujourd'hui toute donnée de production dans ses jeux, ce que le premier scénario remet en cause. Rien ne vous est demandé avant le lancement, sinon de dire « exécute le prompt ».

## 1. En-tête d'identification

Analyse L99 (8 couches du skill `prompt-analyzer-l99`) de la demande « Est-ce que dans la Factory et ses forges, il existe des process de traitement des BDDs… », reçue le 29/10/2026. Sur le pilot `digit-ai-factory` (commit 2b507dcc). Période : 29/10/2026 de 09:11 à 09:13, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, aucun agent.

Intention de la demande : savoir si un produit qui a une base de données trouve dans les forges de quoi alimenter et remettre à zéro ses bases de développement et de qualification, sans faire sortir de donnée personnelle de la production.

Test rétro : le résultat sert cette intention. Le prompt réécrit répond scénario par scénario avec la preuve de chaque réponse, et inscrit chaque manque au registre ; il ne s'arrête pas au oui ou au non.

## 2. Verdict en une ligne

Score 36 sur 100 avant, 86 projeté après (non mesuré) ; 1 défaut bloquant, 6 majeurs et 3 mineurs, tous clos dans la version a ; 8 dépôts relevés en lecture seule.

## 3. Décisions attendues

Rien n'attend de décision. Le prompt suit votre lettre : il inventorie, il ne construit pas. Le conflit entre le premier scénario et la règle de forge-tests est décrit dans l'étude, pas tranché ; les manques entreront au registre en propositions, et leur choix vous reviendra à la revue hebdomadaire.

## 4. Traité

Le score se lit dimension par dimension (avant → après projeté) : clarté de l'intention 13 → 18 sur 20, spécification 4 → 17 sur 20, garde-fous 2 → 13 sur 15, ancrage 9 → 14 sur 15, vérifiabilité 3 → 12 sur 15, robustesse 5 → 12 sur 15.

- **Cadrage (chapitre 1).** La demande pose une question fermée sur trois scénarios distincts. Son objet probable est plus large : combler le manque s'il existe. Trois voies : répondre oui ou non, inventorier et remonter les manques, ou construire tout de suite. Je retiens la deuxième, car construire relève de votre décision.
- **Dépendances entre scénarios (chapitre 2).** La remise à zéro reconstruit « à partir de » quelque chose que la demande ne nomme pas : c'est le premier ou le deuxième scénario, rejoué après une purge. Le premier scénario touche aussi la sauvegarde de production (règles M-17 et O-19 du dossier de mise en production) : restaurer une sauvegarde en développement sans masquage serait une fuite.
- **Inventaire des défauts du prompt d'origine** (classés par gravité ; chacun est clos dans la version a) :
  - bloquant : « process » n'est pas défini, et une simple mention suffirait à répondre « oui » ; mesuré, le seed de démonstration du pilot tient en une ligne de gabarit ;
  - majeur : la question est fermée, et rien ne dit quoi faire d'un manque ;
  - majeur : « anonymisées mais exploitables » n'a pas de barre ; une pseudonymisation par hachage reste une donnée personnelle au sens du RGPD ;
  - majeur : aucun garde-fou, alors que le premier scénario touche des données personnelles de production ;
  - majeur : les moteurs visés ne sont pas nommés, alors que forge-data en documente cinq ;
  - majeur : aucun format de réponse ni preuve exigée ;
  - majeur : un jeu de données « exploitable » doit suivre les migrations du schéma, la demande n'en dit rien ;
  - mineur : « qualification » s'écrit aussi recette, `qualif` ou staging dans la Factory ;
  - mineur : qui déclenche la remise à zéro, et comment on reconnaît une base corrompue ;
  - mineur : des produits ont peut-être déjà leurs scripts de seed, matière à remonter.
- **Factcheck et prémisse d'accès (chapitre 4).** Les sources sont les dépôts locaux, lus par `git grep -il` le 29/10/2026 à 09:11 avec le compte Windows du poste ; contrôle positif : 7 dépôts sur 8 rendent des fichiers. Mesuré sur : pilot, forge-data, forge-tests, forge-ops, forge-development, forge-conception, forge-websec et forge-agents, relue à 09:11, périmètre 8 dépôts sur 14. Ce relevé par mots-clés oriente l'étude, il ne la remplace pas.
  - Copie anonymisée de la production : absente. forge-data documente des exports (`references\profils-moteur\supabase.md:83-84`), qui ne masquent rien.
  - Jeu synthétique depuis une base vide : partiel. `forge_tests\livrables\jeux.py` fabrique des jeux pour les cahiers de tests, avec refus codés des courriels réels et des secrets ; le pilot prescrit un seed local (`gabarits\docs-projet\COMMANDES.md:68-71`).
  - Remise à zéro : absente. `ops.mjs restaurer` ne couvre que les releases de fichiers (`ETAPE-MEP.md:29-32`).
- **Premortem, les 5 causes d'échec les plus probables** : réponse « oui » sur la foi du seed de démonstration ; un agent qui ouvre une base réelle pour « vérifier » ; un « non » sans suite, perdu ; une anonymisation proposée qui n'est qu'un hachage ; une recherche en français seul, qui manque `seed`, `faker` ou `fixture`. Chacune a sa parade dans la version a.
- **Wargame (chapitre 6).** L'expert des données de test distingue extraction partielle, masquage cohérent entre tables, génération synthétique, branches de base et remise à zéro par migrations : l'échelle à quatre niveaux du prompt les couvre. Il relève surtout le conflit de doctrine avec `jeux.py`, qui interdit « rien de ce qui sort d'ici ne vient du produit audité ». Le contradicteur rendrait un tutoriel générique : le contrat exige chemin, ligne et commit par cellule.
- **Deepthink (chapitre 7)** : question ponctuelle, effets d'échelle non pertinents.
- **Prompt réécrit déposé** : `output\04-plans\Digit-AI - Prompt - Bases de donnees de dev et qualification dans les forges - 20261029a.md`, avec définitions des scénarios, étape 0, échelle de couverture, contrat de sortie et protocole de tests.
- **Changelog de la version a**, chaque ajout rattaché au défaut qu'il corrige :
  - échelle mention, gabarit, script, script jugé ; « couvert » au seul dernier niveau (bloquant) ;
  - remontée de chaque manque au registre par `journaliser.mjs` (majeur, question fermée) ;
  - barre d'anonymisation : avis 05/2014 du groupe de l'article 29, repris par la CNIL (majeur) ;
  - aucune connexion à une base, aucun dump, aucune donnée réelle (majeur, garde-fous) ;
  - cinq moteurs de forge-data et la cible Docker local (majeur, périmètre) ;
  - matrice scénario × forge et étude nommée selon R-4 et R-25 (majeur, format) ;
  - jeu aligné sur la version de schéma courante (majeur, migrations) ;
  - glossaire des noms de la qualification, déclencheur de la remise à zéro, relevé chez les produits (mineurs).
- **Contrôles joués** : `oracle-ecriture` sur le prompt réécrit, exit 0, 21 règles PASS ; `hook-restitution --prejuger` sur cette synthèse.

Relecture d'intention : sert.

## 5. Non traité

- **Exécution du prompt** : hors du périmètre d'une analyse, motif `hors_perimetre` ; elle attend votre « exécute le prompt ».
- **Score mesuré** : le 86 est projeté par l'auteur ; la relecture aveugle du mode boucle n'a pas été jouée, motif `hors_perimetre`.
- **6 forges non relevées ce matin** (design, seo-geo, organization, audit, agents-security, observability) : motif `hors_perimetre`, l'étape 1 du prompt les couvre.

## 6. Écarts à la lettre

Tous relèvent de la manière d'exécuter ; aucun n'ajoute au livrable un contenu que vous n'avez pas demandé.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « est-ce qu'il existe » | répondre, puis inscrire chaque manque au registre en proposition | un constat se remonte toujours ; la décision de construire reste la vôtre |
| « process » | 4 niveaux, « couvert » au seul niveau script jugé par un oracle | une mention ne doit pas compter comme un outil |
| « anonymisées mais exploitables » | barre de l'avis 05/2014 et critères d'exploitabilité nommés | le hachage n'anonymise pas |
| la Factory et ses forges | plus un relevé en lecture seule des scripts déjà présents chez les produits | un seed de produit peut devenir la compétence d'une forge |

## 7. Risques

- **Conflit de doctrine** : le premier scénario contredit la règle de `jeux.py`. Parade : l'étude le décrit, la proposition au registre le pose.
- **Faux négatif** : une recherche par mots-clés manque un process nommé autrement. Parade : lecture des 14 fiches de forge avant la recherche.

## 8. Prochaines actions

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | neuve | manuelle_utilisateur | lancer le run revient au porteur | relire le prompt réécrit, puis écrire « exécute le prompt » | l'étude n'est pas produite, aucun manque n'entre au registre |
| A-2 | neuve | auto_ia | non exécutée : dépend de A-1 | `node bootstrap.mjs --pull`, puis rejouer le relevé de l'étape 0 sur les 14 dépôts | inventaire bâti sur un relevé de 8 dépôts |

## 9. Traces

- Prompt réécrit : `output\04-plans\Digit-AI - Prompt - Bases de donnees de dev et qualification dans les forges - 20261029a.md`.
- Mesures du 29/10/2026 : `git grep -il` sur 8 dépôts à 09:11, commits relevés (forge-data 3c14112, forge-tests 1a4925f, forge-ops 5991a6b).
- Indices rendus par `node scripts\allouer-indice.mjs` : a pour le prompt, b pour cette synthèse.
