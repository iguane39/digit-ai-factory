---
destinataire: humain
---

# Synthèse de mandat — les huit dépôts en attente sont publiés et les dix-sept du parc sont alignés sur GitHub ; la publication du pilot a exigé de pseudonymiser un nom de produit dans un message de commit, ce qui a réécrit son histoire locale ; il vous reste à décider du rattrapage des autres postes et de deux constats (13/09/2026)

La synchronisation demandée est faite. Tous les dépôts du parc sont désormais identiques en local et chez l'hébergeur, sans aucun travail en attente. La porte de publication a refusé le dépôt de pilotage : un message d'enregistrement écrit avant-hier portait le nom réel d'un produit. Le nom a été remplacé par son pseudonyme de référence avant publication, ce qui a changé l'identifiant des enregistrements non encore publiés sans toucher à une seule ligne de leur contenu. Conséquence pour vous : un autre poste qui détiendrait ce dépôt devra le remettre à niveau avant de travailler, et c'est la première décision. Deux faiblesses sont apparues en chemin et sont au registre : le contrôle des noms n'examine les messages qu'au moment de publier, quand le remède coûte cher, et le contrôle hébergé d'une forge est en échec depuis cinq jours sur un défaut étranger à ce qui vient d'être publié. Rien d'autre n'attend : le travail de la veille est en ligne.

## 1. En-tête d'identification

- **quoi** — exécution du feu vert de publication (« synchronise avec github ») : porte de publication jouée sur chaque dépôt, pseudonymisation d'un nom de produit dans un message d'enregistrement local du pilot avant publication, publication de huit dépôts, relevé de l'état des contrôles hébergés, deux constats en passant journalisés au registre.
- **sur quoi** — les huit dépôts qui portaient du travail non publié : le pilot `digit-ai-factory`, `digit-ai-forge-agents`, `digit-ai-forge-design`, `digit-ai-forge-development` (les quatre du mandat de la veille), puis `digit-ai-forge-tests`, `digit-ai-forge-organization`, `digit-ai-forge-data` et le canal confidentiel (travaux d'autres sessions, datés des 8 et 11/09) ; les dix-sept dépôts du parc relevés à la fin.
- **quand** — 2026-09-13 17:50 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 17:05 (relevé de l'état des quatre dépôts) ; durée mesurée ≥ 45 min.
- **qui** — pilot local `4c60e1f`, publié ; session Opus 5 (contexte étendu), aucune délégation (escalade : aucune) ; oracles joués : `oracle-nom-client-publie` (porte des noms, 5 dépôts, 4 passes sur le pilot), `verifier-avance-publication` (borne du feu vert, R-38 §4-5), `oracle-confidentiel` (visibilité privée du canal, vérifiée chez l'hébergeur), `ingerer-lot` (2 candidatures), `oracle-todo`, les hameçons `pre-push` des huit dépôts, et l'interrogation des contrôles hébergés par l'outil en ligne de commande de l'hébergeur.

## 2. Verdict en une ligne

**8 dépôts publiés et 17/17 alignés (local = origine, 0 en avance, 0 en retard) ; porte des noms : 1 refus initial sur le pilot (3 constats bloquants sur un message d'enregistrement), puis PASS après pseudonymisation ; réécriture de l'histoire locale non publiée du pilot : 23 enregistrements ré-identifiés, contenu inchangé (`git diff` entre l'ancien et le nouveau sommet : 0 ligne) ; canal confidentiel : `oracle-confidentiel` PASS (visibilité privée confirmée chez l'hébergeur) ; contrôles hébergés : forge-agents vert, forge-development ROUGE depuis le 08/09 (3 erreurs de longueur de ligne, fichiers étrangers au lot publié), pilot et forge-design sans contrôle déclenché ; 2 candidatures ingérées (TF-1071, TF-1072, les deux marquées récidive), `oracle-todo` PASS, 290 actifs ; 3 enregistrements du pilot publiés dans le tour.**

## 3. Décisions attendues de l'humain

Deux décisions neuves. Les trois décisions ouvertes de la veille (sélecteurs D-6, D-7 et D-8 : le conflit entre la colonne de lecture et le plafond de caractères du contrôle 4K, la récidive de l'encadré du gabarit de lot de travaux, les deux constats techniques) restent pendantes et se tranchent par leur sélecteur ; leur forme complète est dans la synthèse du 12/09 citée au bloc 9, désormais publiée.

> **D-9 — Le rattrapage des autres postes après la réécriture de l'histoire locale du pilot est-il préparé maintenant par une note de procédure déposée, ou laissé au constat du prochain poste qui ouvrira le dépôt ?**
>
> Il s'agit de la conséquence directe de la publication : pour retirer un nom de produit d'un message d'enregistrement jamais publié, les vingt-trois enregistrements en attente ont changé d'identifiant, leur contenu restant identique au caractère près. Tout poste ou clone qui détient encore l'ancienne suite verra sa mise à jour en avance rapide refusée, et devra se réaligner par contenu plutôt que par fusion. Le parc a déjà payé ce cas en septembre et la méthode est connue ; ce qui manque est une note datée, déposée là où le prochain poste la lira avant d'essayer.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md` (« l'histoire ne se réécrit pas : on rectifie par ajout » — la réécriture n'a été possible que parce que rien n'était publié) et `references\PATRONS-EPROUVES.md` (mécanismes payés une fois, réutilisables tels quels) ; la mémoire de session du 07/09 sur le réalignement d'un clone après réécriture (méthode par contenu, sauvegarde, un enregistrement de report).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) déposer une note de procédure datée dans les références du pilot, citée par le protocole d'accueil, et la publier | effort simple × court | exclut que le prochain poste découvre le refus sans méthode sous la main |
| (b) prévenir seulement l'autre poste de vive voix, sans note | effort nul | exclut la trace : le prochain réalignement, dans un mois, repartira de zéro |
| (c) ne rien faire : le poste qui butera lira le message de refus de l'outil | effort nul | exclut toute préparation : le refus arrive au milieu d'un run, quand le temps manque |

> **Si rien n'est décidé** : l'option (c) s'applique — aucune note n'est déposée, le rattrapage se fera au constat.

> **D-10 — Le contrôle hébergé rouge de la forge de développement se corrige-t-il maintenant par un run mandaté, ou attend-il l'ouverture de cette forge ?**
>
> Il s'agit du contrôle requis de cette forge, en échec depuis le 8 septembre sur trois lignes de code trop longues, dans deux fichiers que le travail publié hier ne touche pas. La mesure a été faite chez l'hébergeur sur les deux dernières exécutions : mêmes trois erreurs, cinq jours d'écart. La correction est un reformatage sans effet sur la logique, mais elle s'écrit dans un dépôt frère, ce que le pilot ne fait que sur mandat. Tant qu'il est rouge, ce contrôle bloquera la première demande de fusion qui en dépendra.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fou « aucune écriture dans les dépôts frères hors mandat humain » ; `todo\CLASSES.json`, règle attachée à la classe de la candidature : « toute publication d'une forge lit le run de contrôle hébergé et l'inscrit à la restitution ».

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) lancer un run mandaté qui reformate les trois lignes, vérifie le retour au vert chez l'hébergeur, et fait jouer ce contrôle par la recette locale de la forge | effort simple × court, plus un enregistrement et une publication de cette forge | exclut que la forge découvre seule un défaut vieux de cinq jours |
| (b) laisser la forge le traiter à sa prochaine ouverture, sur la candidature déposée | effort nul maintenant | exclut une date : la branche principale reste rouge sans échéance |
| (c) écarter : trois lignes trop longues ne gênent personne | effort nul | exclut le retour au vert : le contrôle requis restera un obstacle à la première fusion |

> **Si rien n'est décidé** : l'option (b) s'applique — la candidature attend l'ouverture de la forge.

## 4. Traité — avec sa preuve

- **Les huit dépôts qui portaient du travail non publié sont publiés, et le parc entier est aligné.**
  - preuve : `git push` de chacun — forge-agents `3d16b96..38310c7`, pilot `d65c578..a0da07b` puis `a0da07b..4f5ce52` et `4f5ce52..4c60e1f`, forge-design `072518d..89bcc33`, forge-development `fe3fd94..fd73af5`, forge-tests `e30f536..9ce711f`, forge-organization `905ae78..6833722`, forge-data `0052f19..976734c`, canal confidentiel `c49a434..7a070e0` ; relevé final sur les 17 dépôts du parc après `git fetch` : tous « aligné », aucun `ahead`, aucun `behind`.
- **La porte des noms a refusé le pilot, et c'est elle qui a tenu.** Trois constats bloquants portant sur un message d'enregistrement écrit le 11/09 par une session produit.
  - preuve : sortie du hameçon `pre-push` → « PUBLICATION REFUSEE », trois lignes « nom de produit interdit … dans un MESSAGE de commit » ; `oracle-nom-client-publie` joué à la main → verdict FAIL, 3 bloquants ; recherche dans la plage en attente → un seul enregistrement en cause, et aucun fichier suivi ne portait le nom.
- **Le nom a été remplacé par son pseudonyme de référence avant publication, sans toucher au contenu.** Le pseudonyme vient de la table du canal confidentiel, pas d'un choix de circonstance.
  - preuve : table lue → `C:\dev\_confidentiel\tables\produits-pseudonymes.json` ; réécriture bornée à la plage non publiée → « Ref 'refs/heads/main' was rewritten », 23 enregistrements ; **contrôle d'intégrité : `git diff` entre l'ancien sommet et le nouveau → 0 ligne de différence** ; message publié → « ingestion du lot de retours Produit-62 20260911b (TF-1050) » ; contrôle rouge → vert : porte des noms FAIL (3 bloquants) puis PASS (0 bloquant) après retrait de la sauvegarde de réécriture et de l'entrée de mise de côté, qui gardaient l'ancien message accessible.
- **Le feu vert humain a été déclaré à chaque publication, comme la règle l'exige.**
  - preuve : chaque `git push` porté par `FORGE_PUSH_GO` citant votre mot du 13/09 ; `verifier-avance-publication` accepte le motif et laisse passer les enregistrements de classe explicite.
- **Le canal confidentiel a été publié après vérification de sa visibilité chez l'hébergeur.**
  - preuve : `node oracle-confidentiel.mjs .` → verdict PASS (visibilité privée, tables valides, aucun secret) ; deux enregistrements du 08/09 portant les dates d'inscription des tables et un pseudonyme neuf.
- **Les trois forges publiées hors mandat de la veille ont été mesurées avant publication.**
  - preuve : pour chacune, porte des noms → PASS, 0 bloquant ; arbre de travail → 0 fichier non enregistré ; sujets relevés (recette de non-perte, type « CV » au registre des types, provenance typée d'une colonne et projection des évolutions), tous datés des 8 et 11/09, tous d'autres sessions.
- **L'état des contrôles hébergés est relevé pour les quatre dépôts du mandat.**
  - preuve : forge-agents → exécution « completed success » ; forge-development → « double-gate completed failure » sur l'enregistrement publié **et** sur le précédent du 08/09, avec exactement les mêmes trois erreurs de longueur de ligne (101, 109 et 111 caractères pour un plafond de 100) dans deux fichiers Python ; `git show --name-only` de l'enregistrement publié → trois fichiers, aucun fichier Python ; pilot et forge-design → aucune exécution déclenchée.
- **Deux constats en passant sont au registre, tous deux marqués récidive par l'ingestion.** TF-1071 : la porte ne juge les messages qu'au moment de publier, alors qu'aucun hameçon `commit-msg` n'existe. TF-1072 : le contrôle hébergé rouge non vu depuis le poste.
  - preuve : `ingerer-lot` → « 1 candidature ingérée (lot cd0bccb3e93e) » puis « (lot 2a1218adb110) » ; récidives nommées — la première rattachée à seize clôtures antérieures de la même classe, la seconde à TF-1017 dont la règle dit déjà « toute publication d'une forge lit le run de contrôle hébergé et l'inscrit à la restitution » ; `oracle-todo` → PASS ; vues régénérées → 290 actifs, 74 classes, 129 récidives.
- **Les index de dossiers du pilot suivent les livrables du 12/09, et le dépôt est propre.**
  - preuve : `readme-dossiers.mjs` et `generer-lisezmoi-output.mjs` rejoués, six index enregistrés en `4f5ce52` ; `git status -sb` final → `main...origin/main`, aucun fichier modifié.

## 5. Non traité — avec son motif

- La correction des trois lignes trop longues de la forge de développement — motif : hors mandat ; écriture dans un dépôt frère, soumise en D-10.
- La note de procédure de rattrapage après réécriture d'histoire — motif : dépendance à une décision humaine (D-9).
- Le hameçon `commit-msg` qui refuserait un nom de produit à l'écriture d'un message — motif : dépendance à une décision humaine ; la candidature TF-1071 est en candidat, son remède touche l'installeur de hameçons qui vit chez forge-agents.
- Les trois décisions ouvertes de la veille (sélecteurs D-6, D-7 et D-8) — motif : dépendance à une décision humaine ; elles n'ont pas été tranchées et restent lisibles dans la synthèse du 12/09, publiée.
- Le rejeu du harnais de recettes du pilot et du banc du registre des oracles — motif : hors mandat ; ce tour est une publication, aucun code n'a été modifié depuis leur dernier passage du 12/09.

## 6. Écarts à la lettre

- **Vous avez écrit** « synchronise avec github » → **j'ai fait** la publication des huit dépôts en attente, et non des seuls quatre que l'action de publication de la veille nommait. **Pourquoi** : « synchroniser » ne se borne pas à un sous-ensemble ; les quatre autres portaient du travail d'autres sessions, mesuré avant publication (porte verte, arbre propre, sujets relevés) et sans surprise.
- **Vous avez écrit** « synchronise avec github » → **j'ai d'abord réécrit** un message d'enregistrement local du pilot, ce qui a changé l'identifiant de vingt-trois enregistrements. **Pourquoi** : la porte refusait la publication à cause d'un nom de produit réel, et les deux seules issues étaient la correction ou le contournement explicite du garde-fou ; le contournement aurait publié le nom, ce que la porte existe pour empêcher. Rien n'était publié, donc rien d'irréversible : le contenu est identique et l'ancien sommet reste joignable localement.
- **Vous n'avez rien demandé** sur le registre → **j'ai** journalisé deux candidatures et enregistré les index régénérés. **Pourquoi** : garde-fou du noyau, « constat en passant → candidat » ; et un index périmé est un défaut déclaré.

## 7. Risques

- Un autre poste détenant le dépôt de pilotage ne pourra plus le mettre à jour en avance rapide ;
  - signal : une mise à jour refusée avec « divergent branches » ou « non-fast-forward » à l'ouverture d'une session ailleurs ;
  - parade : D-9 (a) ; sans elle, le poste concerné se réaligne par contenu, méthode déjà employée dans le parc, sans note sous la main.
- Le contrôle requis rouge de la forge de développement bloquera la première demande de fusion qui en dépend ;
  - signal : une fusion refusée pour contrôle manquant sur cette forge ;
  - parade : D-10 (a) ; sinon acceptation déclarée, la candidature attend l'ouverture de la forge.
- Le même défaut de nom dans un message se reproduira au prochain enregistrement écrit par une session pressée ;
  - signal : une publication refusée par la porte sur un message, comme aujourd'hui ;
  - parade : le hameçon demandé par TF-1071 ; d'ici là, la porte du `pre-push` reste le filet, et le coût du remède reste une réécriture.
- Une publication faite sans lire le contrôle hébergé laisse une branche rouge invisible depuis le poste ;
  - signal : un contrôle en échec sur un enregistrement publié le jour même, comme mesuré aujourd'hui ;
  - parade : TF-1072 porte la règle, déjà écrite pour TF-1017 et non descendue ; ce tour l'a appliquée à la main.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), classées par dépendance — ce qui attend D-9 avant ce qui attend D-10, puis ce qui attend les décisions de la veille ; ensuite les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-12 | Déposer `references\PROCEDURE-RATTRAPAGE-HISTOIRE.md` (réalignement par contenu d'un dépôt dont l'histoire locale a été réécrite : sauvegarde de la suite locale, comparaison des arbres, enregistrement de report des travaux non repris), la citer dans le protocole d'accueil et l'index des références, publier (neuve) | auto_ia | `dependance_bloc_3` — attend D-9 (a) ; à défaut, aucune note n'existe quand le refus tombera | simple × court |
| A-13 | Lancer un run mandaté chez la forge de développement : reformater les trois lignes trop longues, jouer la recette locale, vérifier le retour au vert du contrôle hébergé, faire jouer ce contrôle par la recette locale, remettre un lot de retours au pilot (TF-1072) | auto_ia | `dependance_bloc_3` — attend D-10 (a) ; à défaut, la branche principale de cette forge reste rouge sans échéance | simple × court |
| A-14 | Journaliser les décisions D-9 et D-10 (`node todo\journaliser.mjs --fichier <evenements.json>`), régénérer les vues, rejouer `oracle-todo` (TF-1071, TF-1072) | auto_ia | `dependance_bloc_3` — attend D-9 et D-10 ; à défaut, les deux candidatures restent en candidat | simple × court |
| A-15 | Exécuter les décisions de la veille restées ouvertes dès qu'elles sont tranchées : arbitrage de la colonne de lecture, correction de l'encadré du gabarit de lot de travaux, correction du générateur de la page du registre et mesure du bruit sur les documents des produits (TF-1067, TF-1068, TF-1069, TF-1070) | auto_ia | `dependance_bloc_3` — attend D-6, D-7 et D-8 ; à défaut, quatre candidatures restent en candidat et le harnais du pilot reste à 105 recettes vertes sur 107 | complexe × moyen |
| A-16 | Rejouer la baseline de l'oracle d'écriture sur les textes écrits depuis le 12/09 et resserrer les seuils de la donnée de tournures (TF-1064, TF-1066) | auto_ia | `dependance_bloc_3` — attend l'échéance du 10/10 fixée par la décision de la veille ; à défaut, les seuils du 12/09 restent | simple × court |
| A-17 | Trancher D-9 — répondre « D-9 (a) », « (b) » ou « (c) » ; le dépôt de la note est fait par l'IA (neuve) | manuelle_utilisateur | `decision` — la préparation d'un rattrapage engage les autres postes, pas seulement celui-ci ; sinon : aucune note n'est déposée | simple × court |
| A-18 | Trancher D-10 — répondre « D-10 (a) », « (b) » ou « (c) » ; le run de forge est joué par l'IA (neuve) | manuelle_utilisateur | `decision` — écrire dans un dépôt frère demande un mandat humain ; sinon : la candidature attend l'ouverture de la forge | simple × court |
| A-19 | Trancher les trois décisions de la veille restées ouvertes — répondre par leurs sélecteurs D-6, D-7 et D-8 suivis de l'option choisie ; leur forme complète est dans la synthèse du 12/09 (TF-1067, TF-1068, TF-1069, TF-1070) | manuelle_utilisateur | `decision` — un arbitrage de doctrine et deux décisions sur candidats ; sinon : les quatre candidatures restent en candidat | simple × court |

## 9. Traces

- Dépôts publiés : `digit-ai-factory` (`4c60e1f`), `digit-ai-forge-agents` (`38310c7`), `digit-ai-forge-design` (`89bcc33`), `digit-ai-forge-development` (`fd73af5`), `digit-ai-forge-tests` (`9ce711f`), `digit-ai-forge-organization` (`6833722`), `digit-ai-forge-data` (`976734c`), canal confidentiel (`7a070e0`).
- Enregistrements du pilot faits dans ce tour : la pseudonymisation du message (histoire locale réécrite, ancien sommet `dbbdfee` → nouveau `a0da07b`), les index de dossiers (`4f5ce52`), les deux candidatures et le registre (`4c60e1f`).
- Registre : `todo\TODO.jsonl` (TF-1071, TF-1072 créés, tous deux marqués récidive) ; vues `todo\TODO.md`, `todo\RECIDIVES.md` et la page générée.
- Candidatures : `input\01-candidatures\nom-client-dans-message-de-commit-20260913a.tf.jsonl` (lot cd0bccb3e93e), `input\01-candidatures\ci-forge-development-rouge-depuis-le-08-09-20260913a.tf.jsonl` (lot 2a1218adb110).
- Décisions de la veille, forme complète : `output\04-plans\Digit-AI - Synthese Mandat - Trois forges jouees plancher propage - 20260912b.md`, bloc 3.
- Oracles : porte des noms `oracle-nom-client-publie` (5 dépôts ; sur le pilot : FAIL puis PASS), `verifier-avance-publication` (borne du feu vert), `oracle-confidentiel` (PASS), `ingerer-lot` (2 lots), `oracle-todo` (PASS, 3 passes), hameçons `pre-push` des huit dépôts, contrôles hébergés relevés sur les quatre dépôts du mandat.
- Aucune page HTML livrée dans ce tour.
