---
destinataire: humain
---

# Étude — Parcours d'accueil des nouveaux utilisateurs de la Factory, version complétée, 21/11/2026

Cette version remplace, pour la lecture, `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121d.md`, que le porteur a jugée floue : elle dit d'abord ce que l'utilisateur gagne, ce qu'il sait et ne sait pas, puis montre à l'écran, exemple par exemple, ce que la proposition change. Les mesures, la comparaison des options et les lots sont repris, sans changement de fond. Run de conseil (`references/RUN-CONSEIL.md`) au pilot `digit-ai-factory`, commit 626b12e2, en lecture seule.

Les exemples d'écran sont **illustratifs** : ils portent sur un projet fictif, un « outil interne de planning d'équipe », et montrent ce que la boussole afficherait une fois construite. Rien de cela n'existe encore.

## 1. Ce que l'utilisateur gagne, en trois points

Le nouveau venu gagne trois choses, et chacune se voit à l'écran dès la première session.

1. **Il sait toujours quoi faire ensuite.** Aujourd'hui, après la bannière « FACTORY DIGIT-AI OPÉRATIONNELLE », il lit « Pour commencer, dites ce que vous voulez obtenir » et doit deviner les formulations qui marchent. Avec la boussole, chaque ouverture de session lui propose 3 phrases prêtes à dire, choisies d'après son dossier : code présent ou non, type de produit, run en cours.
2. **Il sait où il en est.** Aujourd'hui, sa progression est éparse dans un journal de run qu'il ne lit pas. Avec la boussole, une ligne lui dit « palier 2 sur 5 », ce qu'il a prouvé pour l'atteindre (un verdict d'oracle daté) et ce que le palier suivant lui apporte.
3. **Il attend moins ses premières réponses.** Aujourd'hui, chez les produits, 50 sessions sur 76 voient leur première réponse refusée par le contrôle de fin de tour, puis réécrite (M-04). Chaque refus coûte une réécriture d'environ 1 minute en médiane, 344 minutes au total sur 30 jours chez les produits (M-11). Le lot L-03 supprime cette réécriture au premier tour.

Ce que l'utilisateur ne gagne pas : la boussole n'apprend rien sur Claude Code, qu'il connaît déjà, et ne fait aucun travail à sa place ; elle lui évite de chercher la Factory dans sa doctrine.

## 2. Ce que le nouveau venu sait, et ce qu'il ne sait pas

Un utilisateur de Claude Code arrive avec de vraies compétences ; ce qui lui manque n'est pas l'outil, c'est le mode d'emploi propre à la Factory. Le tableau se lit ligne par ligne : à gauche ce qu'il sait déjà, au milieu ce que la Factory fait autrement, à droite ce que la boussole lui dit, et quand.

| Ce qu'il sait déjà de Claude Code | Ce que la Factory fait autrement | Ce que la boussole lui dit, et quand |
|---|---|---|
| Écrire une demande libre | Certaines formules appellent un skill (« l99 », « barre… », « améliore ce skill ») ; une intention claire déclenche un run | Palier 1 : 3 phrases d'intention adaptées à son dossier |
| Lire une réponse en prose | Toute réponse de travail suit 9 blocs ; seuls le bloc 0 (ce qui a été fait) et le bloc 3 (ce qu'il doit décider) le concernent d'abord | Palier 2 : « lisez le bloc 0 et le bloc 3 » |
| Répondre « oui » ou « vas-y » | Une décision se tranche par sa lettre collée au numéro (« 3a ») ; un « oui » ne vaut pas choix | Palier 3 : l'exemple de réponse, avec la lettre de sa propre décision |
| Trouver un fichier produit par Claude | Les livrables vont dans `output/`, le journal du run et ses étapes dans `forge/` | Palier 2 : le chemin exact de son premier livrable |
| Juger lui-même si un résultat est bon | Un résultat n'est accepté que sur verdict d'un oracle exécuté | Palier 2 : le nom de l'oracle et son verdict |
| Installer des skills et des hooks | 13 forges, 111 services, dont 93 prouvés (M-12) | Palier 4 : les 5 services utiles à sa situation, pas les 111 |
| Corriger un outil qui le gêne | Il ne modifie pas les forges : il remonte un lot de retours | Palier 5 : comment remettre son premier lot |

## 3. Une première semaine, avant et après

Ce récit suit une utilisatrice ou un utilisateur fictif, appelé ici « le nouveau venu », sur le projet fictif d'outil de planning, qui a déjà du code. Il montre où la boussole intervient et ce qu'elle évite ; les heures sont inventées pour l'exemple.

**Jour 1, aujourd'hui.** Il colle la phrase d'usage ; la bannière s'affiche. Il écrit « peux-tu regarder mon appli ? ». La session ouvre une démarche d'accueil, lui reformule son intention et lui demande l'accord. Il dit « oui ». Le premier compte rendu arrive en 9 blocs, avec des identifiants qu'il ne connaît pas ; il ne sait pas lequel lire. Une décision lui est posée ; il répond « ok pour moi » ; la session lui redemande la lettre.

**Jour 1, avec la boussole.** Après la bannière, il lit :

```text
Boussole — palier 1 sur 5 : installé.
Votre dossier contient du code (TypeScript, 184 fichiers, aucun run ouvert).
Pour commencer, dites par exemple :
  « Fais évoluer ce produit : ajouter l'export du planning en PDF »
  « Audite ce produit »
  « Teste et corrige ce produit »
Prochain palier : votre premier livrable jugé vert.
```

Il copie la première phrase. Le run de version s'ouvre directement, sans reformulation hésitante.

**Jour 2, avec la boussole.** À l'ouverture, il lit :

```text
Boussole — palier 2 sur 5 : premier livrable vert.
Livrable : output/Planning - Spec - Export PDF - 20261122a.md, oracle-exigences PASS le 22/11 à 10:41.
Dans chaque compte rendu, lisez d'abord le bloc 0 (ce qui a été fait) et le bloc 3 (ce que vous décidez).
Une décision vous attend : D-3. Répondez par sa lettre, par exemple « 3a ».
Prochain palier : votre première décision tranchée.
```

Il répond « 3b » du premier coup.

**Jour 5, avec la boussole.** Le run de version est clos ; la ligne d'ouverture devient :

```text
Boussole — palier 4 sur 5 : premier run clos.
Pour un produit web existant comme le vôtre, les 5 services les plus utiles :
  revue graphique du rendu · audit forge-tests · audit de sécurité du livrable · étape de mise en production · audit SEO-GEO
Prochain palier : ouvrir seul un run, ou remettre votre premier lot de retours.
```

**Jour 7, avec la boussole.** Il ouvre lui-même un second run de version sans demander d'aide : palier 5 atteint, la ligne d'ouverture disparaît. S'il tape « où en suis-je ? », il obtient encore le détail.

## 4. Ce que dit la boussole à chaque palier, selon la situation

La boussole n'a pas un discours unique : au palier 1, ce qu'elle propose dépend de ce qu'elle trouve dans le dossier. Le tableau se lit par situation détectée : la trace qui la révèle, puis les 3 phrases proposées, tirées du tableau de routage de `references/ACCUEIL.md`.

| Situation détectée | Comment elle est détectée | Les 3 phrases proposées au palier 1 |
|---|---|---|
| Produit neuf | dossier vide, ou sans code | « Crée un produit : <ce qu'il doit faire, pour qui> » · « Aide-moi à clarifier mon idée de produit » · « Voici mon cahier des charges, qualifie-le » |
| Produit existant | code présent, aucun run ouvert | « Fais évoluer ce produit : <le changement> » · « Audite ce produit » · « Teste et corrige ce produit » |
| Mandat transverse | demande d'audit, de SEO ou de conseil dans le premier message, ou dépôt d'un tiers déclaré | « Audite le SEO et le GEO de <adresse du site> » · « Fais un audit complet de ce produit » · « Conseille-moi sur <la problématique> » |

Les paliers suivants ont le même message pour tous, rempli avec les traces du projet. Le tableau se lit dans l'ordre des paliers : la trace qui prouve le passage, ce que la ligne d'ouverture affiche, et le moment où elle se tait.

| Palier | Trace qui le prouve | Ce que la ligne affiche | La ligne se tait |
|---|---|---|---|
| 1 — Installé | dossier `forge/` présent, bannière rendue | situation détectée et 3 phrases | au premier run ouvert |
| 2 — Premier livrable vert | premier verdict d'oracle entièrement vert au journal de run | chemin du livrable, oracle et heure, « lisez les blocs 0 et 3 » | au troisième livrable vert |
| 3 — Première décision tranchée | première réponse humaine consignée au journal de run | la décision tranchée et ce qu'elle a arrêté | après 2 décisions tranchées |
| 4 — Premier run clos | premier `run_close` au journal de run | les 5 services utiles à sa situation | au deuxième run clos |
| 5 — Autonome | un run ouvert sans aide demandée, ou un premier lot de retours remis | plus rien | définitivement |

Le côté ludique tient à cela : un compteur qui avance, une étape suivante nommée, et rien qui ne soit gagné sans preuve. Il n'y a ni points ni badges décoratifs, que la loi transverse 1 du `CLAUDE.md` (« toute affordance est câblée ou n'existe pas ») exclurait.

## 5. Exemple de réponse à « où en suis-je ? »

La ligne d'ouverture tient en peu de mots ; le détail se demande. Voici ce que rendrait le skill de détail au jour 2 de l'exemple.

```text
Où en êtes-vous — projet « Planning », 22/11/2026 à 10:55

Palier 2 sur 5 : premier livrable vert.
  Atteint le 22/11 à 10:41 : output/Planning - Spec - Export PDF - 20261122a.md, oracle-exigences PASS.

Ce que vous savez faire maintenant :
  · lancer une évolution par une phrase ;
  · trouver vos livrables dans output/ ;
  · lire un compte rendu par ses blocs 0 et 3.

Prochain palier : première décision tranchée.
  D-3 vous attend : « L'export PDF doit-il inclure les absences ? »
  Répondez « 3a » (oui), « 3b » (non) ou « 3c » (en option).

Pour aller plus loin, sur demande :
  « explique-moi ce qu'est un oracle » · « montre-moi les services utiles à mon projet »
```

## 6. Avantages comparés : aujourd'hui et avec la boussole

Le tableau met côte à côte ce que vit le nouveau venu aujourd'hui et ce qu'il vivrait avec la proposition. Il se lit ligne par ligne, chaque ligne étant un moment du parcours ; la dernière colonne dit d'où vient le gain, mesuré ou attendu.

| Moment | Aujourd'hui | Avec la boussole | Nature du gain |
|---|---|---|---|
| Après la bannière | « Pour commencer, dites ce que vous voulez obtenir » | 3 phrases prêtes, adaptées au dossier | attendu, non mesuré |
| Première réponse | refusée puis réécrite dans 50 sessions de produit sur 76 | affichée une fois | mesuré : environ 1 minute par refus évité, 344 minutes sur 30 jours (M-04, M-11) |
| Lecture d'un compte rendu | 9 blocs, sans savoir lesquels lire | « lisez les blocs 0 et 3 » | attendu, non mesuré |
| Première décision | répondue en phrase, redemandée | répondue par lettre du premier coup | attendu, non mesuré |
| Choix des services | 111 services au catalogue | 5 services pour sa situation | attendu, non mesuré |
| Progression | invisible, dans le journal de run | « palier n sur 5 » et l'étape suivante | attendu, non mesuré |

Les gains « attendus » se mesureront à la revue du 2027-01-15, prévue dans la démarche par lots, à partir du délai jusqu'au premier livrable vert que la boussole calculera elle-même.

## 7. Les mesures qui fondent la proposition

Chaque ligne est une mesure exécutée en lecture seule le 21/11/2026, avec sa source rejouable ; les identifiants `M-xx` (mesure numéro xx) sont ceux cités plus haut. Les comptes du journal des hooks excluent les sessions de recette, de banc et de test. M-11 et M-12 sont nouvelles dans cette version.

| id | Mesure | Valeur | Source |
|---|---|---|---|
| M-01 | Sujets du registre portant sur l'accueil ou l'installation | 33, tous corrigés, aucun ouvert | `todo/TODO.jsonl`, dernier état de 1 911 sujets, 21/11/2026 11:05 |
| M-02 | Jugements de fin de tour du 22/10 au 21/11/2026 | 835 : 679 chez un produit, 88 au pilot, 68 non attribués | `.claude/hooks-journal.jsonl` du pilot, 21/11/2026 11:08 |
| M-03 | Refus au premier passage, même période | 122 chez un produit, 25 au pilot, 18 non attribués | même source |
| M-04 | Sessions dont le premier tour jugé est refusé | 50 sur 76 chez un produit, 8 sur 14 au pilot | même source |
| M-05 | Règles les plus souvent bloquantes au premier passage | S1 *(un bloc toujours présent manque)* 121, S4 *(une décision posée sans ses options)* 120 | même source, champ `bloquantes` |
| M-06 | Refus au premier passage sur un tour sans écriture | 92 sur 167 | même source |
| M-07 | Journaux de run avec un verdict d'oracle entièrement vert | 2 sur 15 | `forge/ledger.jsonl` des 15 produits instrumentés, 21/11/2026 11:07 |
| M-08 | Préférences chargées chez un produit | celles du seul porteur | `references/PREFERENCES-PORTEUR.md`, ligne 3 |
| M-09 | Profils produit disponibles | 8 | `profils/LISEZMOI.md` |
| M-10 | Échanges du 20 au 29/10/2026 sur ce poste | 146 demandes, 41 reprises, 18 consignes répétées | relevé d'ouverture, section « Œil critique » |
| M-11 | Temps entre un refus au premier passage et le jugement suivant, chez les produits | 115 refus, médiane 1,0 minute, quartiles 0,7 et 1,9, 344 minutes au total, 1 réécriture en médiane et 4 au plus | même journal que M-02, 21/11/2026 11:22 |
| M-12 | Services au catalogue | 111, dont 93 prouvés et 18 déclarés | `catalogues/CATALOGUES.md`, version 1.9.0 du 16/11/2026 |

## 8. Les options écartées, en bref

La rubrique de 6 critères (simple, intuitif, progressif, ludique, pertinent, productif) a été figée avant la comparaison ; la version précédente porte le tableau complet. Deux options ont été écartées.

- **Le tuteur des blocages** (expliquer à l'utilisateur chaque refus ou oracle rouge) : 2 critères sur 6. Les refus les plus fréquents tiennent à la forme des réponses de la session (M-05) ; expliquer S1 à l'utilisateur ne lui fait rien gagner.
- **Le produit-école** (un projet d'entraînement scénarisé) : 2,5 critères sur 6. Il retarde le premier livrable utile et fait travailler hors du vrai projet.
- **La boussole**, retenue : 6 critères sur 6.

## 9. Ce qui se construit, et dans quel ordre

La proposition se construit en 4 lots, détaillés avec leurs critères et leurs jalons dans `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121e.md`. Le tableau dit, pour chaque lot, ce que l'utilisateur voit de nouveau quand il est livré ; il se lit dans l'ordre de construction.

| Lot | Ce que l'utilisateur voit de nouveau | Jalon |
|---|---|---|
| L-01 Boussole minimale | la ligne d'ouverture, palier et 3 phrases (exemples du chapitre 3, jour 1) | 2026-12-04 |
| L-02 Contenus des paliers | les messages des paliers 2 à 5 et la réponse à « où en suis-je ? » (chapitre 5) | 2026-12-11 |
| L-03 Friction de premier tour | sa première réponse s'affiche une fois, sans réécriture (M-11) | 2026-12-18 |
| L-04 Préférences par utilisateur | ses propres préférences remplacent celles du porteur, si le porteur le décide (M-08) | 2027-01-08 |

## 10. Ce que la boussole ne fait pas

Ces limites sont voulues ; elles évitent que l'aide devienne une seconde doctrine à entretenir.

- Elle ne remplace pas l'accueil : la phrase d'usage, l'installateur et le skill `accueil-factory` restent l'entrée, la boussole prend le relais après la bannière.
- Elle ne recopie aucune règle : chaque phrase affichée est lue dans sa source au moment de l'affichage (routage d'`ACCUEIL.md`, profils, catalogue, journal de run).
- Elle ne contourne aucun contrôle : elle explique comment lire et répondre, elle ne fait sauter aucune gate.
- Elle ne pose aucune question : la situation se détecte dans le dossier.
- Elle se tait au palier 5.

Le choix des préférences par utilisateur (L-04) reste une question ouverte pour le porteur, et chaque lot ne part en construction que sur son accord, comme le prévoit la section « Gates humains » du mode opératoire du run de conseil.
