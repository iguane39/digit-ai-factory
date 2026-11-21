---
destinataire: humain
---

# Étude — Parcours d'accueil des nouveaux utilisateurs de la Factory, 21/11/2026

Run de conseil (`references/RUN-CONSEIL.md`) mené au pilot `digit-ai-factory` (commit 626b12e2) le 21/11/2026, sur le prompt réécrit de la revue `output/03-etudes/Digit-AI - Revue - Prompt aide aux nouveaux utilisateurs passe au crible L99 - 20261121c.md`. Lecture seule : aucun fichier de la Factory n'a été modifié pour produire cette étude. Le découpage en lots, avec leurs critères et leurs jalons, est dans `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121e.md`.

## 1. Le premier geste recommandé

Un nouveau venu n'a besoin que de savoir quoi dire après la bannière d'installation, et où il en est ensuite. Le premier geste se résume en cinq lignes.

1. Ouvrir Claude Code dans le dossier de son projet et coller la phrase d'usage du README ; attendre « FACTORY DIGIT-AI OPÉRATIONNELLE ».
2. Dire en une phrase ce qu'il veut obtenir, sur le modèle des intentions du routage d'accueil (« créer un produit », « faire évoluer », « auditer »…).
3. Lire seulement le bloc 0 de chaque réponse (ce qui a été fait, en clair) et le bloc 3 (ce qu'il a à décider).
4. Répondre à une décision par sa lettre collée au numéro (« 221a »), jamais par une phrase.
5. Ce que cela rapporte : un premier livrable de son vrai projet, jugé par un oracle, dès la première session, sans avoir lu la doctrine.

Ce geste existe déjà presque entièrement ; ce qui manque, c'est qu'on le lui dise au bon moment et qu'on lui montre ensuite sa progression. C'est l'objet du système recommandé au chapitre 5.

## 2. L'existant et les frictions mesurées

L'entrée dans la Factory est mûre : les 33 sujets du registre qui portent sur l'accueil ou l'installation sont tous corrigés. La friction se loge après, dans les premières réponses : chez les produits, 50 sessions sur 76 ont vu leur premier tour refusé par le contrôle de fin de tour en 30 jours.

### 2.1 Ce qui sert déjà l'accueil

Le tableau se lit ligne par ligne, dans l'ordre où un nouveau venu rencontre chaque pièce : ce qu'elle couvre, à quel moment, et ce qu'elle laisse à sa charge. La dernière colonne est la matière du système proposé.

| Pièce | Ce qu'elle couvre | Moment | Ce qu'elle laisse au nouveau venu |
|---|---|---|---|
| Phrase d'usage du `README.md` | Une seule phrase pour tous les cas | Avant tout | Savoir quoi dire après l'installation |
| Installateurs (`installer.ps1`, `installer.sh`) | Outils, pilot, 13 forges, skills, socle du projet, sans question | Installation | Rien : finit sur la bannière |
| Skill `accueil-factory` | Trouver le pilot, poser la phase 0, dérouler l'accueil | Première session d'un dossier non instrumenté | Rien sur la suite : il se tait dès que le projet est instrumenté |
| `references/ACCUEIL.md` | 7 étapes, de l'intention à l'accord, et un tableau de routage par intention | Premier message d'intention | Le tableau de routage est lu par la session, jamais montré au nouveau venu |
| `references/NIVEAUX.md` | La longueur des réponses selon que le tour écrit ou non | Chaque réponse | Il règle la session ; il n'explique rien à l'utilisateur |
| `PROMPT-PRODUIT.md` | Un brief en 7 champs préparé à l'avance | Avant un produit neuf | Rien pour un produit existant ou un mandat |
| `profils/` | 8 profils produit, standards et seuils par type | Accueil, puis chaque étape | Le profil retenu n'est jamais dit à l'utilisateur comme une aide |
| `catalogues/CATALOGUES.md` | 111 services, dont 93 prouvés et 18 déclarés | Étape 4 de l'accueil | Trop large pour un premier jour : aucun tri par situation |
| Lexique d'invocation (hook d'appel de skill) | Reconnaître une formule et appeler le skill | Chaque message | Les formules ne sont listées nulle part pour l'utilisateur |
| Skill `explique` | Dérouler un concept du simple à la maîtrise | Sur demande | Il faut savoir qu'il existe et quoi lui demander |
| Gabarit `gabarits/CLAUDE-PRODUIT.md` | Routage, « Je mobilise », retours, gestes distants | Chaque session chez le produit | Écrit pour la session, pas pour l'utilisateur |

### 2.2 Les mesures

Chaque ligne est une mesure exécutée en lecture seule le 21/11/2026, avec sa source rejouable ; les identifiants `M-xx` (mesure numéro xx) sont cités par les causes et les recommandations qui suivent. Les comptes du journal des hooks excluent les sessions de recette, de banc et de test.

| id | Mesure | Valeur | Source |
|---|---|---|---|
| M-01 | Sujets du registre portant sur l'accueil ou l'installation | 33, tous au statut corrigé, aucun ouvert | `todo/TODO.jsonl`, dernier état par identifiant, filtre sur accueil, installation, phase 0, bannière, première session, onboarding, lexique ; 1 911 sujets lus, 21/11/2026 11:05 |
| M-02 | Jugements de fin de tour, du 22/10 au 21/11/2026 | 835 : 679 chez un produit, 88 au pilot, 68 non attribués | `.claude/hooks-journal.jsonl` du pilot, champ `reservation.cible`, 21/11/2026 11:08 |
| M-03 | Refus au premier passage sur la même période | 122 chez un produit, 25 au pilot, 18 non attribués | même source |
| M-04 | Sessions dont le premier tour jugé est refusé | 50 sur 76 chez un produit, 8 sur 14 au pilot | même source, premier jugement de chaque session |
| M-05 | Règles les plus souvent bloquantes au premier passage, tous lieux | S1 *(un bloc toujours présent manque)* 121, S4 *(une décision posée sans ses options)* 120, S6 *(actions sans acteur ni ordre)* 24, S48 *(retour sans lot)* 17 | même source, champ `bloquantes` |
| M-06 | Refus au premier passage sur un tour qui n'avait rien écrit | 92 sur 167 | même source, champ `ecritures` |
| M-07 | Journaux de run des produits portant un verdict d'oracle entièrement vert après l'ouverture du run | 2 sur 15 | `forge/ledger.jsonl` des 15 produits instrumentés de la racine, événements `run_open` et `oracles_verdict`, 21/11/2026 11:07 |
| M-08 | Préférences chargées à l'ouverture chez un produit | celles du seul porteur, aucun fichier par utilisateur | `references/PREFERENCES-PORTEUR.md`, ligne 3 ; aucune occurrence d'un fichier de préférences par utilisateur dans `references/`, `oracles/`, `scripts/` |
| M-09 | Profils produit disponibles | 8 | `profils/LISEZMOI.md`, inventaire |
| M-10 | Échanges du 20 au 29/10/2026 sur ce poste | 146 demandes, 41 reprises, 18 consignes répétées | relevé d'ouverture de la session, section « Œil critique », 21/11/2026 |

### 2.3 Ce que les mesures disent

Trois lectures s'en dégagent, et chacune oriente une partie du système.

- **L'entrée est résolue, la suite ne l'est pas** (M-01, M-04). L'installation et l'accueil ont absorbé 33 corrections ; la première réponse, elle, est refusée dans deux sessions de produit sur trois.
- **La friction la plus fréquente touche la forme des réponses, pas le fond** (M-05, M-06). S1 et S4 pèsent 241 refus à elles deux : la session doit réécrire sa réponse, et le nouveau venu attend. Ce coût ne se corrige pas par une aide à l'utilisateur ; il se corrige dans la Factory, d'où un lot dédié (L-03).
- **La progression n'est pas lisible aujourd'hui** (M-07). Seuls 2 journaux de run sur 15 portent un verdict entièrement vert : le délai jusqu'au premier livrable vert, indicateur principal de la rubrique, n'a donc pas de valeur de départ fiable. Il se mesurera à partir du premier lot, qui calcule ce délai lui-même.

Une quatrième lecture touche l'adaptation : les préférences chargées chez un produit sont celles du porteur (M-08). Un nouvel utilisateur hérite donc de règles personnelles qui ne sont pas les siennes, comme « seul le compte du porteur publie ».

### 2.4 Hypothèse de population

Ce chapitre déclare qui l'on aide, faute que la demande le précise. Hypothèse retenue : des développeurs ou consultants à l'aise avec git, node et la ligne de commande, sous Windows ou macOS, qui maîtrisent Claude Code (sessions, `CLAUDE.md`, skills, hooks, agents) et arrivent avec un produit neuf, un produit existant à faire évoluer, ou un mandat transverse (audit, SEO-GEO, conseil). Aucune trace du dépôt ne la contredit ; M-08 la complète : ces utilisateurs ne publient pas pour la Factory, leurs retours passent par lots.

## 3. La rubrique, figée avant les options

La rubrique est celle du prompt, recopiée telle quelle ; elle a été posée avant la comparaison des options du chapitre 4 et n'a pas été retouchée ensuite.

- **Simple** : une seule phrase ou commande pour entrer ; aucune lecture de doctrine requise avant le premier livrable.
- **Intuitif** : à tout moment, l'aide sait dire en une phrase la prochaine action et pourquoi.
- **Progressif** : 5 paliers au plus, chacun avec un critère de passage lu dans une trace existante (verdict d'oracle, journal de run, registre), jamais déclaratif.
- **Ludique** : la progression est visible (palier atteint, prochain palier, ce qu'il débloque) ; aucune récompense qui ne soit la trace d'un verdict réel (lois transverses 1 et 6 du `CLAUDE.md`).
- **Pertinent et adapté** : le parcours se dérive de l'état détecté du projet (situation, profil produit, forges mobilisées), sans questionnaire ; une question au plus, seulement si la réponse change le parcours.
- **Productivité rapide** : indicateur principal, le délai entre l'ouverture de la première session et le premier livrable jugé vert sur le vrai projet ; indicateur secondaire, les refus de hook par session sur les 5 premières sessions.

## 4. Trois options, notées contre la rubrique

Les trois options divergent sur un seul axe : **où vit l'aide**. L'option A la place dans l'état du vrai projet, l'option B dans l'instant du blocage, l'option C dans un projet à part.

- **A — La boussole.** Un calcul en lecture seule de l'état du projet (journal de run, profil, mobilisation des forges) rend le palier atteint et la prochaine action ; une ligne s'affiche à l'ouverture de chaque session, et un skill donne le détail quand l'utilisateur demande « où en suis-je ? ».
- **B — Le tuteur des blocages.** Les hooks existants ajoutent une explication destinée à l'utilisateur chaque fois qu'un oracle rend rouge ou qu'une réponse est refusée.
- **C — Le produit-école.** Un projet d'entraînement scénarisé, avec des quêtes à accomplir avant de passer à son vrai projet.

Le tableau se lit par ligne de critère : chaque cellule dit si l'option tient le critère (oui, non, partiel) et pourquoi en quelques mots. La dernière ligne compte les critères tenus ; un « partiel » compte pour un demi.

| Critère | A — Boussole | B — Tuteur des blocages | C — Produit-école |
|---|---|---|---|
| Simple | oui : rien à apprendre, une ligne à l'ouverture | oui : rien à appeler | non : un second projet à installer et à finir |
| Intuitif | oui : la prochaine action est toujours affichée | partiel : ne parle qu'au moment d'un blocage | oui, mais seulement dans le scénario |
| Progressif | oui : paliers lus dans le journal de run | non : aucun palier, des explications isolées | oui : quêtes ordonnées |
| Ludique | oui : palier atteint et prochain palier visibles, chacun adossé à un verdict | non | partiel : quêtes, mais sur un projet fictif |
| Pertinent et adapté | oui : dérivé de la situation et du profil du projet | partiel : adapté au blocage, pas au projet | non : un scénario unique |
| Productivité rapide | oui : le premier livrable est celui du vrai projet | partiel : ne réduit pas les refus, que l'utilisateur ne cause pas (M-05) | non : le premier livrable est fictif |
| **Critères tenus** | **6** | **2** | **2,5** |

**Option recommandée : A, la boussole.** B est écartée parce que les refus les plus fréquents viennent de la forme des réponses de la session (M-05), pas d'une erreur de l'utilisateur : lui expliquer S1 ne lui fait rien gagner. C est écartée parce qu'elle retarde le premier livrable utile et contredit la règle d'accueil qui veut que la session travaille dans le dossier du projet. Ce que B vise réellement, la friction des refus, est repris au lot L-03 côté Factory.

## 5. Le système recommandé, palier par palier

La boussole compte cinq paliers, chacun avec un critère de passage lu dans une trace qui existe déjà ; l'aide de chaque palier dit quand elle s'efface, pour ne jamais devenir du bruit.

Le tableau se lit dans l'ordre des paliers, du premier contact à l'autonomie. Pour chacun : ce que fait l'utilisateur, ce que dit la boussole, la trace qui prouve le passage, et le moment où l'aide de ce palier se tait.

| Palier | L'utilisateur | La boussole | Trace du passage | L'aide s'efface |
|---|---|---|---|---|
| P1 — Installé | colle la phrase d'usage | après la bannière : la situation détectée (dossier vide, code présent, mandat) et trois phrases d'intention adaptées, tirées du tableau de routage d'`ACCUEIL.md` et du profil | `forge/` présent et bannière rendue | au premier `run_open` du journal de run |
| P2 — Premier livrable vert | dit son intention, accepte la démarche | « lisez le bloc 0 et le bloc 3 » ; où est le livrable ; ce que veut dire le verdict | premier `oracles_verdict` entièrement PASS après l'ouverture du run | au troisième livrable vert |
| P3 — Première décision tranchée | répond par une lettre | comment répondre (« 221a ») et ce que la décision arrête | premier `reponse_humain` du journal de run | après deux décisions tranchées |
| P4 — Premier run clos | mène une démarche jusqu'au bout | les 5 services du catalogue les plus utiles à sa situation et à son profil, au lieu des 111 | premier `run_close` du journal de run | au deuxième run clos |
| P5 — Autonome | ouvre seul un run de version ou remet un lot de retours | plus rien à l'ouverture ; « où en suis-je ? » reste disponible | premier lot de retours remis, ou second `run_open` sans aide demandée | définitivement |

Chaque brique dit si elle s'ajoute à l'existant, le remplace ou s'y raccorde, et sur quel fichier elle se câble ; le tableau se lit ligne par ligne, et aucune ligne ne remplace une pièce existante.

| Brique | Relation à l'existant | Câblage dans le dépôt |
|---|---|---|
| Calcul du palier, en lecture seule | s'ajoute | un script du pilot sous `scripts/`, qui lit `forge/ledger.jsonl`, `forge/PROFIL.json` et `forge/mobilisation.jsonl` du produit |
| Ligne d'ouverture | se raccorde | relevé d'ouverture du produit (le hook SessionStart déjà posé par le socle) |
| Trois phrases d'intention de P1 | se raccorde | lues dans le tableau de routage de `references/ACCUEIL.md` et dans `profils/`, jamais recopiées |
| Lecture des blocs 0 et 3, réponse par lettre | se raccorde | renvoi à `gabarits/RESTITUTION.md` et au référentiel de jargon `gabarits/JARGON-A-GLOSER.json` |
| Cinq services de P4 | se raccorde | filtrés depuis `catalogues/catalogue.jsonl` et `references/CARTE-FORGES.json` |
| Détail « où en suis-je ? » | s'ajoute | un skill du pilot propagé par `bootstrap.mjs`, déclaré au lexique d'invocation |
| Accueil de la première session | inchangé | `accueil-factory` et `references/ACCUEIL.md` restent l'entrée ; la boussole prend le relais après la bannière |

## 6. Le lot minimal et la trajectoire

Le lot minimal se construit en un seul run et rend service seul : le calcul du palier et la ligne d'ouverture (L-01). Les lots suivants ajoutent les contenus des paliers (L-02), réduisent la friction des refus côté Factory (L-03), puis adaptent les préférences à chaque utilisateur si vous le décidez (L-04). Chaque lot porte ses critères « utile, utilisable, utilisé » et son jalon dans la proposition de lots citée en tête ; chacun ne devient un run de construction que sur votre GO.

## 7. La maintenance

L'aide ne recopie aucune doctrine : chaque contenu affiché est lu dans sa source à l'instant de l'affichage, ce qui la tient à jour sans entretien propre. Trois changements la périmeraient et doivent la faire relire : un renommage des événements du journal de run (`run_open`, `oracles_verdict`, `reponse_humain`, `run_close`), une refonte du tableau de routage d'`ACCUEIL.md`, et un changement des blocs 0 et 3 de `gabarits/RESTITUTION.md`. La recette du calcul de palier, jouée sur des journaux de run factices, détecte le premier ; les deux autres se repèrent par le renvoi nommé dans la brique.

## 8. Risques et décisions qui vous reviennent

Trois risques demeurent, et deux décisions relèvent de vous plutôt que de la session.

- **Risque : une mesure de départ absente.** M-07 empêche de dire aujourd'hui combien de temps prend un premier livrable vert ; le gain du système ne se prouvera qu'après le premier lot, à la revue du 2027-01-15.
- **Risque : une ligne d'ouverture de plus.** Le relevé d'ouverture est déjà long ; une ligne mal placée serait lue comme du bruit. Le critère « utilisable » de L-01 borne la ligne à une seule, en tête.
- **Risque : un compte biaisé.** Le journal des hooks ne distingue pas un nouveau venu d'un habitué ; les 50 sessions sur 76 de M-04 mesurent la friction de première réponse de toute session, pas celle d'un débutant seul.
- **Question ouverte pour le porteur : des préférences par utilisateur (L-04) ?** M-08 montre qu'un nouvel utilisateur hérite des préférences du porteur ; les séparer touche la doctrine de chargement des préférences, qui relève du porteur.
- **Question ouverte pour le porteur : le GO de chaque lot.** Chaque lot ne part en construction que sur son accord, lot par lot, comme le prévoit la section « Gates humains » du mode opératoire du run de conseil.
