---
destinataire: humain
---

# Synthèse de mandat — synchronisation avec GitHub faite sur les quatorze dépôts, et la procédure qui tient deux postes sur des histoires réécrites (07/09/2026)

Le pilot et les treize forges de ce poste sont alignés sur GitHub. L'autre poste a travaillé toute la journée sur l'histoire réécrite d'hier : il s'est rebâti dessus, a publié douze commits au pilot (huit synthèses, une étude, des lots livrés dans six forges) et a réécrit une seconde fois la forge de design et la forge de tests. Ici, le pilot et trois forges avançaient en avance rapide ; ces deux forges divergeaient (mêmes contenus, autres empreintes) et ont été rebâties sur ce que GitHub publie, sans rien perdre. Rien n'a été poussé depuis ce poste : le seul commit local qui reste est celui de la forge des outils, retenu par sa porte depuis hier. Ce qui change pour vous : ce poste voit exactement ce que l'autre a publié, et la règle qui évite qu'ils se contredisent est écrite ci-dessous, en quatre gestes que chaque poste joue à l'ouverture. Ce qui est attendu de vous : la même décision que l'autre poste vous a posée ce soir sur la forge de développement, et deux restes propres à ce poste.

## 1. En-tête d'identification

- **quoi** — mandat humain « Synchronise avec github, comment synchroniser aussi avec l'autre machine qui travaille sur ce projet ? » : synchronisation de ce poste, puis la procédure des deux postes.
- **sur quoi** — le pilot `digit-ai-factory` et les treize forges de `c:\dev` sur ce poste ; rien d'écrit chez les produits, rien de poussé.
- **quand** — fin le **07/09/2026 à 20:55 (UTC+02:00)**, ≈ 15 minutes depuis votre demande.
- **qui** — Claude Fable 5.1 (extension VS Code), sans agent ; pilot `8c7030e` avant, `659e6dd` après (la version de l'autre poste, qui a encore publié un commit d'index à 20:46), cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

Pilot : en avance rapide de 13 commits (`8c7030e → 659e6dd`) ; trois lots du produit 61 arrivés hier dans la boîte, pseudonymisés et ingérés (TF-0869 à TF-0876) ; forge-audit, forge-data, forge-ops : avance rapide (1, 2, 2 commits) ; forge-design et forge-tests : divergentes, rebâties sur GitHub (`1063aed`, `4ebb0bc`, étiquettes reposées) ; sept forges déjà à jour ; forge-agents : un commit local non publié (`9454701`, porte FAIL 8) ; porte C1 à C5 sur le parc synchronisé : pilot et onze forges PASS, forge-agents et forge-development FAIL, forge-seo-geo FAIL sur sa branche locale seule.

## 3. Décisions attendues

Une seule décision est nouvelle pour ce poste ; elle est la même que celle posée par l'autre poste à 17:21, et une seule réponse suffit pour les deux. Le tableau se lit ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » sa complexité et sa durée, « Ce qu'elle exclut » ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction.

> **D-27 — Levez-vous la protection de la branche principale de la forge de développement le temps d'un push forcé, pour que l'histoire réécrite et jugée verte par l'autre poste soit publiée, ou préférez-vous qu'un poste la lève et la remette lui-même par l'interface de programmation, sur votre mot ?**
> Les deux postes ont mesuré la même chose : la forge de développement porte cinq messages de commit avec un nom de produit, son histoire réécrite est prête et verte (l'autre poste l'a rejouée sur son clone frais aujourd'hui), et sa branche principale refuse tout push forcé — protection classique, push forcé interdit, revue obligatoire, deux contrôles. Lever la protection est un réglage du propriétaire du dépôt ; un poste peut le faire par l'interface de programmation avec votre compte, mais c'est un geste sur un réglage d'hébergeur, pas sur un fichier : il vous revient de dire qui le fait.
> **Recommandation : (a).** Source consultée : `gh api repos/…/branches/main/protection` (push forcé interdit, revue, contrôles `code` et `design`) ; la synthèse de l'autre poste de 17:21 (D-11, même question) ; la mesure de la porte sur cette forge ce soir (FAIL 5, messages).
> Un réglage levé et remis par vous, entre deux messages, laisse une trace que vous tenez ; c'est la voie la plus courte et la plus lisible.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** vous levez « Allow force pushes » sur `main`, vous le dites, le poste qui répond publie et vous remettez la protection | simple × court : deux clics avant, deux clics après | exclut qu'un poste touche au réglage |
| **(b)** un poste lève et remet la protection lui-même par l'interface de programmation, sur votre mot | simple × court, sans clic | exclut de tenir vous-même la trace du réglage |
| **(c)** ne rien faire | gratuit | exclut la porte verte sur cette forge ; cinq messages restent publics |

> **Si rien n'est décidé** : (c) s'applique — la forge de développement publie sur une porte rouge.

## 4. Traité — avec sa preuve

- **Synchronisation du pilot** — classe : un clone en retard sur ce que l'autre poste a publié ; contrôle rouge → vert : « en retard de 12 » → « à jour » ; trois fichiers régénérés par les hooks (deux README, le LISEZMOI) écartés avant l'avance rapide, aucun commit local.
  - preuve : `git pull --ff-only` puis `git fetch --tags --force` ; `HEAD = origin/main = c04c4b6` ; les douze commits distants sont ceux de l'autre poste du 07/09 (09:22 à 17:21).
- **Trois forges en avance rapide** (audit, data, ops) — classe : des commits publiés par l'autre poste que ce poste n'avait pas ; contrôle rouge → vert : « en retard » → « à jour » sur les trois.
  - preuve : `03ec225`, `10cca3b`, `538ccb1` égaux à `origin/main`.
- **Deux forges divergentes rebâties** (design, tests) — classe : deux réécritures indépendantes de la même histoire, l'une ici hier, l'autre là-bas aujourd'hui ; contrôle rouge → vert : « en avance de 23, en retard de 23 » et « en avance de 100, en retard de 101 » → « à jour ». Avant de rebâtir, chaque sujet de commit local a été cherché dans l'histoire publiée : les seuls absents sont des sujets que la réécriture de l'autre poste a pseudonymisés davantage — aucun travail propre à ce poste n'y vivait.
  - preuve : `git reset --hard origin/main` puis étiquettes forcées ; `1063aed` et `4ebb0bc` égaux à `origin/main`, 14 et 17 étiquettes.
- **Sept forges déjà à jour** (agents-security, conception, development, observability, organization, seo-geo, websec) et **forge-agents inchangée** (`db3d391` publié, `9454701` local).
  - preuve : `HEAD = origin/main` sur les sept ; `db3d391` ancêtre de `origin/main` chez forge-agents.
- **Mesure du parc après synchronisation** — porte C1 (la première des quatre règles sur les noms de clients) à C5 (les noms de produits) sur les quatorze clones : pilot et onze forges PASS ; forge-agents FAIL 8 (contenus courants, cinq réels et trois faux positifs, décision D-24 d'hier) ; forge-development FAIL 5 (messages, D-27) ; forge-seo-geo FAIL 8 sur sa branche locale de sauvegarde seule (D-25 d'hier).
  - preuve : verdicts relevés dépôt par dépôt ; branches locales `sauvegarde/20260809` encore présentes ici chez conception, design, organization, seo-geo et tests (l'autre poste a supprimé les siennes, décision D-9 de son côté).
- **Trois lots du produit 61 arrivés hier après-midi** (un run clos le 05/09, un deuxième tour de retours) — classe : une boîte d'entrée qui s'est remplie pendant que ce poste ne regardait pas ; pseudonymisés sur disque (six fichiers renommés, aucun nom réel restant), jugés et ingérés.
  - preuve : `oracle-lot-retours` PASS ×3 ; huit candidatures en candidat (TF-0869 à TF-0876) ; `oracle-todo` PASS.
- **La procédure des deux postes, écrite** — en mémoire du poste et ci-dessous (bloc 8, A-6), en quatre gestes par dépôt : chercher, comparer, avancer ou rebâtir, jamais fusionner.
  - preuve : note de mémoire complétée ; la même règle figure au mode opératoire du pilot (« toute autre copie locale est devenue incompatible : à recloner, pas à fusionner »).

## 5. Non traité — avec son motif

- **Aucun push depuis ce poste** : *rien à pousser* — ce poste n'a aucun commit que GitHub n'ait pas, hors celui de forge-agents retenu par sa porte (D-24 d'hier).
- **Les branches locales de sauvegarde de cinq forges** : *irréversible* — R-29 (la règle qui réserve toute suppression à l'humain) ; l'autre poste a supprimé les siennes sur sa décision D-9, ce poste attend la vôtre (A-62).
- **La forge de développement** : *dépendance à une décision humaine* — D-27.
- **Quatre dépôts d'insatisfaction du même produit** (canal `INSATISFACTION - …`, arrivés hier à 19:07) : *hors demande* — leur canal est l'instruction (`output-insatisfactions\`), pas l'ingestion ; laissés non suivis, à instruire au prochain tour.
- **Les produits** : *autonomes* — non synchronisés par le pilot ; leurs commits d'hier restent locaux, le produit décide seul de sa publication.
- **La lecture détaillée des huit synthèses de l'autre poste** : *hors demande* — leurs décisions ouvertes (D-11 de 17:21 = D-27 ici) et leurs actions restent portées par leur propre fil.

## 6. Écarts à la lettre

- « Synchronise avec github » → lu comme : aligner ce poste sur GitHub, pousser ce qui est en avance et vert → rien n'était à pousser, tout a été tiré → parce que GitHub est la vérité partagée des deux postes, et que le seul commit local est retenu par une règle que vous connaissez.
- Deux forges ont été rebâties par `reset --hard` plutôt que reclonées → même effet, plus court, et les fichiers non suivis (baselines, boîtes d'entrée) survivent → parce que le clone ne portait aucun travail propre, vérifié sujet par sujet.
- La question sur l'autre machine reçoit une procédure, pas un geste → parce que ce poste n'atteint pas l'autre ; la procédure est écrite en A-6 pour être jouée là-bas telle quelle.

## 7. Risques

- **Deux postes qui réécrivent la même histoire le même jour** produisent deux lignées différentes ; c'est arrivé aujourd'hui pour design et tests, sans perte parce que personne n'avait commis dessus entre-temps.
  - signal : « en avance de N, en retard de N » au `git fetch`.
  - parade : un seul poste réécrit ; l'autre rebâtit ; la décision de réécrire se prend dans un seul fil (ce que le registre TF-0829 porte déjà).
- **Un poste qui fusionne au lieu de rebâtir** réintroduit une histoire ancienne avec ses noms.
  - signal : un `git pull` sans `--ff-only` qui crée un commit de fusion.
  - parade : A-6, quatre gestes, jamais de fusion ; la porte refuse le push qui suivrait.
- **Le commit local de forge-agents** vieillit tant que D-24 n'est pas tranchée ; si l'autre poste publie sur cette forge entre-temps, il faudra le rejouer par-dessus.
  - signal : forge-agents « en avance de 1, en retard de N ».
  - parade : D-24 (a) au plus tôt ; sinon `git rebase origin/main` du seul commit, porte, push.

## 8. Prochaines actions

Ordre de traitement : d'abord la procédure de l'autre poste, parce qu'elle conditionne tout travail là-bas ; puis la forge de développement ; puis les restes de ce poste. Le tableau se lit ligne par ligne : la colonne « Identifiant » renvoie à l'item du registre, « Action » dit le geste, « Acteur » qui le fait, « Motif / raison » pourquoi il n'est pas déjà fait, et la dernière colonne ce qui se passe s'il ne l'est pas.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-6 | `neuve` (reprise) | Sur l'autre poste, pour le pilot et chaque forge : (1) `git fetch origin --tags --force` ; (2) `git merge-base --is-ancestor HEAD origin/main` ; (3) si oui, `git pull --ff-only` ; si non, `git bundle create <hors dépôt> --all` puis `git reset --hard origin/main` ; (4) jamais `git merge` ni `git pull` sans `--ff-only`. Un clone qui refuse le (3) est toujours un clone à rebâtir (2 et 3), pas à fusionner. Les fichiers non suivis (boîtes d'entrée, baselines) survivent au `reset`. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : deux forges divergentes ce soir, rebâties ici par cette même procédure. | Une fusion réintroduit une histoire ancienne avec ses noms ; la porte refuse le push suivant. |
| A-63 | TF-0829 | Si D-27 (a) : après votre mot, publier forge-development en force depuis un clone réécrit (paquet, règles, passe, porte C1 à C5 PASS), rebâtir le clone local, puis vous rendre la main pour remettre la protection ; si D-27 (b) : lever et remettre la protection par l'interface de programmation autour du même geste. | `auto_ia` | `dependance_bloc_3` — D-27 ; R-38 pour le push forcé. | Cinq messages restent publics ; la forge publie sur une porte rouge. |
| A-58 | TF-0855, TF-0824 | Si D-24 (a) (posée hier) : lot chez forge-agents (cinq mentions, frontière de C5), réécriture, publication de `9454701`. | `auto_ia` | `dependance_bloc_3` — D-24, non tranchée. | Le contrat de sortie reste sur ce poste. |
| A-62 | `neuve` | Si vous le décidez comme D-13, D-16 et D-25 : `git branch -D sauvegarde/20260809` chez conception, design, organization, seo-geo et tests sur ce poste, porte rejouée (attendu PASS partout). | `auto_ia` | `dependance_bloc_3` — R-29, une suppression est humaine ; D-25 d'hier n'en couvrait qu'une. | Le relevé de parc de ce poste reste rouge sur seo-geo. |
| A-60 | `neuve` | Si D-26 (a) (posée hier) : créer les huit classes et journaliser les huit constats. | `auto_ia` | `dependance_bloc_3` — D-26, non tranchée. | Huit récidives que rien ne comptera. |
| A-61 | TF-0830 à TF-0855 | Présenter le tri des candidatures neuves d'hier au prochain tour, en tenant compte de celles que l'autre poste a décidées aujourd'hui (TF-0858 à TF-0868). | `auto_ia` | `borne_atteinte` — ce tour est une synchronisation. | Les candidatures attendent sans rang. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — session du produit vivante hier. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Pilot : `8c7030e → 659e6dd` en avance rapide (treize commits de l'autre poste, 07/09) ; étiquettes forcées ; `todo\TODO.jsonl` — TF-0869 à TF-0876 créés (lots du produit 61) ; cette synthèse dans le commit qui suit.
- Forges : audit `03ec225`, data `10cca3b`, ops `538ccb1` (avance rapide) ; design `1063aed`, tests `4ebb0bc` (rebâties, `reset --hard origin/main`, étiquettes forcées) ; sept forges inchangées ; forge-agents `db3d391` publié + `9454701` local.
- Mesure de la porte C1 à C5 sur les quatorze clones : 11 PASS + pilot ; FAIL forge-agents (8 contenus), forge-development (5 messages), forge-seo-geo (8 messages, branche locale seule).
- Branches locales `sauvegarde/20260809` restantes sur ce poste : conception, design, organization, seo-geo, tests.
- Mémoire du poste : règle des deux postes consignée (GitHub est la vérité ; chercher, comparer, avancer ou rebâtir, jamais fusionner).
- Oracles rejoués : `oracle-nom-client-publie` ×14 · `gabarits\oracle-lot-retours.mjs` ×3 (PASS) · `oracle-todo` (PASS) ; aucun livrable produit ce tour hors cette synthèse.
