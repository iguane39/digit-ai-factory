---
destinataire: humain
role: restitution de fin de tour, réponse « continue » du 01/10/2026 à la question du 30/09 sur les lots du sas
sources_de_verite: git du pilot · todo/TODO.jsonl · input/00-retours · les 2 tables du canal confidentiel, lues et copiées hors dépôt, jamais modifiées · output/04-plans/Digit-AI - Synthese Mandat - Decision 32a executee trente quatre candidatures traitees - 20260928c.md (D-33 à D-35) · gabarits/RESTITUTION.md (v2.31.0)
verifie_le: 2026-10-01
---

# Digit-AI — Synthèse de mandat — Sas traité, 11 lots ingérés, 2 en attente de décision — 01/10/2026

## 0. Synthèse d'ouverture

Le sas des retours est traité : 11 lots sur 13 sont accueillis, relus à la main, ingérés au registre et publiés, soit 17 candidatures neuves. Ce qui change pour vous : les retours de 4 produits attendent votre arbitrage, dont les 2 demandes que vous avez faites le 30/09 sur les polices des présentations et sur les documents restés ouverts. La relecture a arrêté 2 noms que l'outillage laissait passer, le nom d'un produit écrit avec ses accents et un prénom. Les 2 lots du dépôt de prospection restent au sas. Les ingérer donnait un pseudonyme à son nom, et la porte des noms, le contrôle qui refuse un envoi portant un nom protégé, aurait alors bloqué les 3 dépôts qui le citent déjà. Ce qui vous attend : 2 décisions neuves, en plus des 3 du 28/09.

## 1. En-tête d'identification

- **quoi** — accueil et ingestion des lots de retours arrivés au sas du 28/09 au 30/09, sur votre réponse « continue » à la question du 30/09 ; puis publication du pilot.
- **sur quoi** — le pilot `digit-ai-factory` ; les 2 tables du canal confidentiel, lues et copiées hors dépôt, jamais modifiées ; aucune forge ni aucun dépôt de produit modifiés.
- **quand** — le 01/10/2026, de 09:39, heure de votre message lue au transcript, à 10:14 (UTC+02:00), relevée par l'horloge du poste, soit 35 min ; la fin est l'heure de dépôt de cette synthèse, son envoi suit.
- **qui** — session de pilotage Claude Opus 5.5, sans agent de campagne ; escalade de modèle : aucune. Pilot passé de `bd249acd` à `e3ccd9a1`, publié.
- **intention** — que les retours remontés par les produits entrent au registre sans qu'un nom protégé parte avec eux, et que ce qui attend votre arbitrage vous soit posé.
  **Test rétro** : servie pour 11 lots sur 13. Les 2 lots du dépôt de prospection attendent D-36 : les ingérer aurait tranché à votre place si son nom se protège.

## 2. Verdict en une ligne

**11 lots sur 13 accueillis et ingérés** · **17 candidatures** TF-1488 à TF-1504, `oracle-todo` PASS · 8 lots retouchés à la réception, 0 nom protégé au crible · 2 lots gardés au sas · TF-1505 née en route · pilot publié `bd249acd..e3ccd9a1` · **2 décisions neuves**, 3 rappelées.

## 3. Décisions attendues de l'humain

Comment lire ce bloc : les 3 décisions du 28/09 se rappellent en une ligne, inchangées ; les 2 neuves portent leurs options en tableau, la colonne Coût dit la complexité et la durée, la colonne Exclusions ce que retenir l'option ferme. Pour répondre, un sélecteur par décision suffit, par exemple « D-36 a, D-37 b ».

**D-33** : le nom d'affichage d'un produit publié en clair dans `todo/TODO.jsonl` et 5 autres fichiers du dépôt public, posée le 28/09 à 22:33, inchangée.

**D-34** : le rattachement des 2 pseudonymes d'un même produit dans `produits-pseudonymes.json`, posée le 28/09 à 22:33, inchangée.

**D-35** : la décision des 32 candidatures nées de la campagne du 28/09 dans `todo/TODO.jsonl`, posée le 28/09 à 22:33, inchangée.

> **D-36 — Le dépôt `digit-ai-prospection` porte-t-il un nom public de l'écosystème, comme `digit-ai-marketing`, ou un nom de produit à protéger ?**
>
> Ses 2 lots du 28/09 attendent au sas. L'ingestion inscrit à la table des produits tout nom de lot qu'elle ne connaît pas : mesuré sur une copie jetable, ce dépôt y deviendrait Produit-80. Son nom était pourtant cité, à l'ouverture de ce tour, dans 18 fichiers suivis du pilot, de `digit-ai-forge-conception` et de `digit-ai-forge-agents`, dont les skills de propositions commerciales ; inscrit, chacun deviendrait bloquant pour la porte des noms. La liste des produits de l'écosystème, dans `scripts/lib-parc.mjs`, ne porte que `digit-ai-marketing`, déclaré public le 17/09.
>
> **Recommandation : (a).** Source consultée : la décision D-5 (a) du 17/09, même question pour `digit-ai-marketing` ; le relevé d'ouverture de ce matin, qui nomme ce dépôt « hors liste » et demande de l'inscrire ou de le déclarer hors périmètre ; le décompte des 18 fichiers dans les 3 dépôts.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Le déclarer nom public : l'ajouter à la liste des produits de l'écosystème, puis accueillir et ingérer ses 2 lots sous son nom, la table réelle intacte comme pour le lot du marketing ce matin | simple × court | exclut de cacher ce nom à l'avenir |
| **(b)** Le protéger : l'inscrire à la table, substituer son nom dans tous les fichiers suivis des 3 dépôts, puis ingérer ses lots sous pseudonyme et republier les 3 dépôts | moyen × moyen | son nom reste lisible dans l'historique déjà publié des 3 dépôts |
| **(c)** Ne rien décider | nul | ses 2 lots restent au sas, et le relevé d'ouverture les signale comme un oubli à chaque session |

> **Si rien n'est décidé** : (c).

> **D-37 — Faut-il décider les 18 candidatures entrées ce jour dans `todo/TODO.jsonl`, et lesquelles ?**
>
> Les 11 lots en ont porté 17 : 11 de Produit-03, dont 8 sur ses mises en production des 29 et 30/09, 4 de `digit-ai-marketing`, une de Produit-64 et une de Produit-78 ; la dernière est née de cet accueil. Les 4 du marketing portent vos mots du 30/09, « à intégrer côté Factory pour chaque document généré » et « remonte ça à la Factory » : un oracle des polices embarquées d'une présentation, l'export par PowerPoint dans le skill des présentations, la règle d'un document tenu ouvert, et le jugement d'un livrable hors du poste qui l'a produit. Leur score de valeur va de 4 à 20, et 14 valent 10 ou plus.
>
> **Recommandation : (b).** Source consultée : les scores posés à l'ingestion, et vos 2 décisions du 30/09 citées mot pour mot dans le lot du marketing.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 18 | complexe × long | le mandat suivant traite aussi 2 candidatures de valeur inférieure à 10, que personne n'a demandées |
| **(b)** *(recommandée)* Décider les 16 de valeur 10 ou plus ou demandées par vous : les 14 de valeur 10 ou plus, puis l'export par PowerPoint et le jugement hors du poste producteur | complexe × long | 2 restent candidates : la charte des présentations jugée sans le profil du client, et le canal entre produits |
| **(c)** Ne rien décider | nul | les 18 restent candidates, dont les 4 que vous avez demandées le 30/09 |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Chaque lot a suivi l'ordre du 28/09 : oracle des lots, accueil, relecture des noms, réception, ingestion. Les corrections se sont faites avant l'ingestion, qui fige l'empreinte d'un lot.

- **Le relevé avant tout geste.** Le sas portait 13 lots et non 12 : Produit-03 en a déposé un de plus le 30/09 à 16:45, après votre question.
  - preuve : relevé du sas à l'ouverture, 26 fichiers et son README ; le relevé d'ouverture de 09:39 rend les 16 dépôts à jour, et `git rev-list` rend `0 0` à 09:41 au pilot, au canal confidentiel et chez `digit-ai-forge-agents`.
- **L'oracle des lots, avant l'accueil.**
  - preuve : `gabarits/oracle-lot-retours.mjs` sur les 13 lots du sas, sortie 0 pour chacun.
- **L'accueil à blanc, puis sur une copie du sas hors dépôt.** Les lots de 3 produits passent sous Produit-03, Produit-64 et Produit-78 ; les noms des 2 dépôts de l'écosystème restent en clair, aucune table ne les portant.
  - preuve : `todo/accueillir-lot.mjs --essai`, sortie 0, 26 fichiers et 0 refus ; la même fonction jouée sur la copie rend 26 écrits et 0 refus, et le sas réel garde ses 27 entrées.
- **La relecture des noms, à la main et au crible.** J'ai lu les 13 lots pseudonymisés. Un crible lâche, insensible aux accents, à la casse et aux séparateurs, a cherché les 117 formes des 2 tables et des dossiers du poste ; la liste des mots à majuscule des 26 fichiers a servi aux prénoms. 2 noms passaient : le nom de Produit-03 écrit avec ses accents, en titre de ses 8 lots, et un prénom cité par un lot.
  - preuve : crible lâche, 18 occurrences, dont les 8 titres et 10 faux positifs tirés de « calcul » et de « pris moins » ; `anonymiser()` rend Produit-03 pour la forme sans accent et laisse intacte la forme accentuée ; liste des mots à majuscule, 1 seul prénom ; les 3 identifiants longs sont un numéro de requête d'API et 2 identifiants de rôle Microsoft Graph, dont la constante publique.
- **L'accueil réel de 11 lots.** Les 2 lots de la prospection sont sortis du sas le temps de la commande, puis y sont revenus.
  - preuve : `todo/accueillir-lot.mjs` à 09:52:07, 22 écrits sur 22, 0 refus ; empreintes SHA-256 des 4 fichiers de la prospection identiques avant et après ; les 22 fichiers déposés égalent octet pour octet les copies relues.
- **8 lots retouchés à la réception, chacun annoté d'une note du pilot.** Le titre des 8 lots de Produit-03 porte Produit-03 ; dans le lot 20260930b, le prénom laisse place à un rôle entre crochets.
  - preuve : contrôle rouge puis vert, la forme accentuée passe de 8 occurrences à 0 et le prénom de 1 à 0 ; 8/8 notes posées ; le script d'édition, joué en essai puis en réel, vérifie chaque remplacement avant d'écrire ; `oracle-lot-retours` PASS sur les 11 lots, règle des numéros repris comprise.
- **L'ingestion, d'abord répétée sur un registre et des tables jetables.** La répétition a rendu les mêmes 17 candidatures sans étendre aucune table ; l'ingestion réelle a suivi.
  - preuve : répétition, 11 sorties 0 et `oracle-todo` PASS sur le registre jetable ; `todo/ingerer-lot.mjs` réel de 09:57:31 à 09:58:00, 11 sorties 0, TF-1488 à TF-1504 ; empreintes des 2 tables réelles identiques avant et après.
- **Le lot du marketing, ingéré sous son nom public.** D-5 (a) du 17/09 a déclaré `digit-ai-marketing` nom public de l'écosystème, mais l'écrivain de la table l'aurait réinscrit. Le lot est donc ingéré avec une copie de la table qui porte ce seul nom en plus, en identité.
  - preuve : sur copie jetable, `pseudoProduit` rend Produit-79 pour le marketing, Produit-80 pour la prospection, et laisse le pilot en clair ; 4 candidatures au demandeur `digit-ai-marketing` ; table réelle à la même empreinte.
- **Le registre tenu.** Une note mesurée à TF-1456, la forme accentuée publiée dans 13 fichiers depuis le 21/08, et la candidature TF-1505, l'écrivain de la table qui ignore les noms publics décidés.
  - preuve : `todo/journaliser.mjs` en essai puis en réel, 2 événements ; `oracle-todo` PASS sur 2 620 lignes ; `oracle-boite-entree` compte 193 fichiers d'accompagnement, tous ingérés, et rend toutes ses règles PASS sauf celle du sas, rouge sur les 2 lots gardés.
- **L'enregistrement et la publication.**
  - preuve : enregistrement `e3ccd9a1`, 26 fichiers, crible lâche des 500 lignes ajoutées sans forme protégée ; `git push` lancé à 10:03:28 et rendu à 10:11:40, sortie 0, `bd249acd..e3ccd9a1`, la porte des noms ayant joué pendant ces 8 min 12 s ; `git rev-list` rend `0 0` après `git fetch`.

## 5. Non traité — avec son motif

- Les 2 lots de `digit-ai-prospection`, gardés au sas — motif : `decision` — D-36 les porte.
- La décision des 18 candidatures neuves — motif : `decision` — D-37 la porte.
- La création au référentiel des 21 classes que les lots proposent depuis le 28/09, dont 9 ce jour — motif : `hors_mandat` — la tenue du référentiel, que votre réponse n'a pas commandée.
- Le correctif des accents à l'accueil et celui des noms publics à l'écrivain de la table — motif : `decision` — TF-1456 relève de D-35, TF-1505 de D-37.
- Le nom publié en clair, les 2 pseudonymes d'un produit et les 32 candidatures de la campagne — motif : `decision` — D-33, D-34 et D-35, rappelées inchangées.

## 6. Écarts à la lettre

- **Vous avez répondu** « continue » à la question d'accueillir et d'ingérer 12 lots. **J'en ai accueilli et ingéré 11, et gardé 2 au sas.** **Pourquoi** : 13 lots y étaient, un de plus étant arrivé le 30/09 à 16:45 ; et ingérer ceux de la prospection donnait un pseudonyme à son nom, ce qui tranchait sa protection à votre place.
- **J'ai publié** en citant vos mots dans `FORGE_PUSH_GO`. **Pourquoi** : la question prévoyait un envoi après la relecture des noms, et cette relecture est faite ; votre réponse est le seul feu vert, cité tel quel.
- **J'ai ingéré le lot du marketing avec une copie de la table**, et non par la commande seule. **Pourquoi** : la commande seule l'aurait réinscrit sous un pseudonyme, contre D-5 (a) ; la copie ne porte que ce nom en plus, et la table réelle reste intacte.
- **J'ai retouché 8 lots avant de les ingérer.** **Pourquoi** : un lot ingéré ne se modifie plus ; chaque retouche est dite par une note de réception, et le reste du texte est celui du producteur.
- **J'ai ajouté** une note à TF-1456 et la candidature TF-1505. **Pourquoi** : les 2 défauts sont nés de cet accueil, et un constat fait en route entre en candidature.

## 7. Risques

- **La forme accentuée d'un nom de produit est publiée** dans 13 fichiers depuis le 21/08, et ni l'accueil ni la porte des noms n'en voient aucune.
  - signal : un titre de lot ou un index qui porte un nom de produit accentué.
  - parade : la relecture à la main de chaque lot entrant, jusqu'au correctif de TF-1456.
- **Le marketing porte 2 noms au registre** : Produit-66 pour ses candidatures du 16/09, son nom public depuis ce matin.
  - signal : une règle qui compare les lots de ce produit et n'en voit qu'une part.
  - parade : le même dédoublement que D-34 ; rien n'est réécrit au registre, un lot ingéré étant immuable.
- **Une autre session écrit dans le pilot en même temps**, sur le modèle par défaut du poste, depuis 09:51.
  - signal : un fichier non suivi qui n'est pas le mien, ou un envoi refusé faute d'avance rapide.
  - parade : je n'enregistre que mes chemins, et je relève le distant avant chaque envoi.
- **L'autre poste peut frapper les mêmes numéros** : TF-1488 à TF-1505 sont pris ici.
  - signal : un envoi refusé sur l'autre poste, faute d'avance rapide.
  - parade : renuméroter ses créations locales avant l'union, comme le 25/09.
- **Le relevé d'ouverture restera rouge** sur les 2 lots gardés au sas.
  - signal : la règle du sas d'`oracle-boite-entree`, rouge à chaque ouverture.
  - parade : D-36.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord ; chacune suit votre réponse à la décision qu'elle nomme. Côté humain, trancher d'abord, puis les 3 suppressions laissées le 28/09.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Exécuter D-33 selon votre réponse : inscrire les formes, les substituer dans l'état courant, rejouer la porte des noms, publier | `auto_ia` | TF-1456 | `dependance_bloc_3` — suit D-33 | le nom reste publié en clair |
| **A-2** | Exécuter D-34 selon votre réponse, puis émettre au produit le lot de travaux préparé pour lui | `auto_ia` | TF-1432, TF-1430 | `dependance_bloc_3` — suit D-34 | le produit garde 2 pseudonymes, et son lot n'a pas de destinataire |
| **A-3** | Exécuter D-35 selon votre réponse : décider au registre les candidatures retenues, puis les traiter | `auto_ia` | TF-1464, TF-1459 | `dependance_bloc_3` — suit D-35 | les 32 restent candidates |
| **A-4** | Exécuter D-36 selon votre réponse : accueillir et ingérer les 2 lots de `digit-ai-prospection` | `auto_ia` | TF-1505 | `dependance_bloc_3` — suit D-36 | les 2 lots restent au sas |
| **A-5** | Exécuter D-37 selon votre réponse : décider au registre les candidatures retenues, puis les traiter | `auto_ia` | TF-1498, TF-1501 | `dependance_bloc_3` — suit D-37 | les 18 restent candidates |
| **A-6** | Créer au référentiel `todo/CLASSES.json` les 21 classes que les lots proposent, chacune avec son contrôle, puis y rattacher leurs retours | `auto_ia` | TF-1491, TF-1503 | `hors_mandat` — la tenue du référentiel, que ce tour n'a pas reçue | 23 retours restent hors du compte des récidives |
| **A-7** | Consigner au registre la clôture de TF-1413 avec les mots de la décision rendue chez le produit | `auto_ia` | TF-1413 | `hors_mandat` — la session qui a reçu la décision la consigne | la candidature reste ouverte alors que son travail est publié |
| **A-8** | Trancher D-33 à D-37 — répondre par exemple « D-36 a, D-37 b » | `manuelle_utilisateur` | neuve | `decision` — protéger un nom et arbitrer le registre vous reviennent | (c) s'applique aux 5 |
| **A-9** | Supprimer le fichier vide de la racine du parc : `Remove-Item C:\dev\null` dans PowerShell ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve | `irreversible` — R-29 (une suppression reste un geste humain décidé) | le relevé d'ouverture le signale à chaque session |
| **A-10** | Supprimer la copie du 22/09 : `Remove-Item C:\dev\_confidentiel\tables\produits-pseudonymes.json.bak-20260922` ; preuve : `git -C C:\dev\_confidentiel status` ne la liste plus | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | des noms réels restent lisibles dans un fichier que rien ne suit |
| **A-11** | Retirer les 2 branches locales du gabarit, intégrées à `main` : `git -C C:\dev\digit-ai-factory branch -d report/guide-de-reference-20260928`, puis `git -C C:\dev\digit-ai-factory branch -D gabarit/guide-de-reference` (sauvegardée en paquet) ; preuve : `git -C C:\dev\digit-ai-factory branch` ne liste plus que `main` et `report/complement-20260921` | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | la porte des noms relit leurs 8 enregistrements jamais publiés à chaque envoi du pilot |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié : pilot `bd249acd..e3ccd9a1` à 10:11:40 ; cette synthèse et l'index régénéré partent par un dernier envoi.
- Registre `todo/TODO.jsonl` : 11 ingestions, 17 créations (TF-1488 à TF-1504), une note à TF-1456, une création (TF-1505).
- Lots accueillis : `input/00-retours`, 22 fichiers ; les 2 lots de la prospection au sas `input/00-retours/_arrivee`, que git ignore.
- Scripts d'accueil sur copie, de réception, de répétition et d'ingestion, avec leurs sorties : dossier de travail de la session, hors dépôt.
