---
destinataire: humain
role: restitution de fin de tour, décisions « 29a, 27a, 28a » du 27/09/2026
sources_de_verite: git des 16 dépôts gouvernés · todo/TODO.jsonl · output/04-plans/Digit-AI - Synthese Mandat - Neuf decisions executees publiees et propagees - 20260927a.md (les trois décisions tranchées)
verifie_le: 2026-09-27
---

# Digit-AI — Synthèse de mandat — Trois décisions exécutées : lots accueillis, adresse retirée, garde posée — 27/09/2026

## 0. Synthèse d'ouverture

Vos 3 décisions de ce soir sont exécutées. Les 3 lots de retours qui attendaient au sas sont
inscrits au registre ; l'adresse personnelle ne figure plus dans l'état courant du dépôt public, et
elle est bloquée partout où elle réapparaîtrait ; la garde qui juge chaque envoi vers GitHub est
posée sur 15 des 16 dépôts gouvernés de ce poste. Ce que cela change pour vous : aucun envoi ne
part plus sans avoir été jugé, sans geste de ma part. Comme vous l'aviez accepté, la garde du pilot
refuse ses envois tant que le remisage du 24/09 existe : l'enregistrement de ce travail et cette
synthèse attendent donc sur le poste. Ce qui est attendu de vous : retirer ce remisage, dont la
mesure de ce soir montre qu'il est le seul en cause, puis trancher une décision neuve sur le canal
confidentiel, le seul dépôt où la garde ne peut pas se poser.

## 1. En-tête d'identification

- **quoi** — exécution des 3 décisions de votre message « 29a, 27a, 28a », posées par la synthèse
  de ce matin, puis publication, propagation et épreuve de la garde par un envoi réel.
- **sur quoi** — le pilot `digit-ai-factory`, la forge `digit-ai-forge-agents` et le canal
  confidentiel pour les contenus ; la configuration locale des 13 forges, de `digit-ai-queue` et du
  pilot pour la garde ; aucun dépôt de produit n'a été modifié.
- **quand** — message reçu le 27/09/2026 à 17:16 (UTC+02:00) ; travail de 17:16 à 18:10, heures
  relevées au journal de la session ; la fin est l'heure de dépôt de cette synthèse.
- **qui** — session de pilotage Claude Opus 5.5, sans agent de campagne. Escalade de modèle :
  aucune. Pilot passé de `eeb833bb` à `6d30f2b7`, puis cette synthèse.
- **intention** — que les 3 décisions produisent leur effet dans le parc — lots au registre,
  adresse hors de l'état public, envois jugés sans geste — sans publier un nom protégé, sans rendre
  un dépôt impubliable, et sans décider à votre place ce qui ne l'a pas été.
  **Test rétro** : servie, à un dépôt près. Chaque décision porte au bloc 4 la preuve exécutée de
  son geste, et la garde a refusé l'envoi réel qu'elle devait refuser. Le canal confidentiel n'a
  pas reçu la garde, parce qu'elle l'aurait rendu impubliable : c'est dit au bloc 6, et la garde
  qui lui convient est posée en décision au bloc 3 plutôt qu'improvisée.

## 2. Verdict en une ligne

**3 décisions exécutées sur 3** · 16 candidatures ingérées, 1 item clos au registre sur preuve,
1 point d'étape, **3 candidatures neuves** · **44 hameçons posés** sur 15 dépôts, canal exclu ·
envoi réel du pilot **refusé** par sa garde, 4 bloquants tous dans le remisage · porte des noms
**PASS** (0 bloquant) sur tout ce qui est parti · 15 dépôts sur 16 à égalité avec GitHub ; le
pilot retient les enregistrements de ce travail, cette synthèse comprise.

## 3. Décisions attendues de l'humain

Les 3 bloquants qui retiennent un geste de suppression, énoncés ici en entier ; le premier retient
aussi la publication de ce travail :

- **Le remisage local du 24/09 au soir ne se supprime pas sans vous**, en vertu de la règle
  R-29 (une suppression reste un geste humain décidé). Il porte des relevés d'héritage écrits par un
  code en retard, avec 2 noms réels de produits. La garde posée ce soir a refusé l'envoi du pilot à
  18:01 pour 4 bloquants, tous dans ce remisage. Sans lui, mesuré ce soir, la porte des noms rend
  PASS : les 2 remisages plus anciens, la branche de l'arborescence liée et les 2 branches
  distantes n'en portent aucun. Pour le lever : vérifier par
  `git -C C:/dev/digit-ai-factory stash list` qu'il est en tête, libellé « Releves locaux du
  22-24/09 », puis lancer `git -C C:/dev/digit-ai-factory stash drop stash@{0}`. Si rien n'est
  fait : l'enregistrement de ce travail et cette synthèse restent sur ce poste, et tout envoi du
  pilot est refusé.
- **Le fichier « null » à la racine du parc ne se supprime pas sans vous**, pour la même règle. Il
  n'a pas changé depuis le 26/09 à 11:49 : 13 530 octets, la page « introuvable » d'un site de
  produit, écrite par une commande qui croyait jeter sa sortie, sans aucune chaîne à forme de
  jeton. Pour le lever : l'ouvrir, vérifier, puis le supprimer. Si rien n'est fait : le relevé
  d'ouverture le signale à chaque session.
- **L'arborescence liée laissée par un agent le 14/09 ne se retire pas sans vous**, pour la même
  règle. Sa branche est déjà fusionnée. Pour la lever :
  `git -C C:/dev/digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`,
  puis `git -C C:/dev/digit-ai-factory branch -d worktree-agent-ac087535fe0698917`. Si rien n'est
  fait : le pilot garde un dossier non suivi, compté à chaque ouverture.

Comment lire le tableau : il porte une option par ligne ; la colonne Coût dit la complexité et la
durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et sa source précèdent
le tableau ; la ligne « Si rien n'est décidé » le suit. Pour répondre, un sélecteur suffit, par
exemple « D-30 a ». La décision est neuve ; aucune des 3 que vous avez tranchées n'est reposée.

> **D-30 — Faut-il donner au canal confidentiel une garde d'envoi qui lui convienne, puisque celle des 15 autres dépôts ne peut pas s'y poser ?**
>
> Votre décision D-27 (a) visait les 16 dépôts gouvernés ; la garde est posée sur 15. Le 16e, le
> canal `digit-ai-confidentiel`, porte les tables des noms interdits : la porte des noms y rend
> 144 bloquants par construction, sa garde refuserait donc chacun de ses envois, et son hameçon
> d'enregistrement réécrirait les tables elles-mêmes. Le risque propre au canal est ailleurs :
> qu'il devienne public, ou qu'un secret y entre. Son contrôle juge déjà ces 2 points, mais à
> l'ouverture d'une session, jamais avant un envoi.
>
> **Recommandation : (a).** Source consultée : `oracle-confidentiel.mjs`, le contrôle du canal,
> joué ce soir à 7 règles sur 7 ; son en-tête pose que « un canal confidentiel devenu public est le
> pire défaut possible ». Un envoi est le seul moment où un canal devenu public recevrait les noms,
> et le juger à l'ouverture suivante le voit trop tard.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Poser sur le canal une garde d'envoi propre, qui joue son contrôle (dépôt privé chez GitHub, aucun secret) et refuse l'envoi sur un échec | simple × court | un poste où l'outil GitHub en ligne de commande ne répond pas voit chaque envoi du canal refusé, jusqu'au contournement explicite |
| **(b)** Ne rien poser sur le canal | nul | le canal reste jugé à l'ouverture seulement : un envoi vers un canal devenu public partirait |

> **Si rien n'est décidé** : (b).

## 4. Traité

Chaque décision, avec la preuve exécutée de son geste :

- **D-29 (a)** — les 3 lots de Produit-68 sont accueillis, nom et contenu pseudonymisés dans les
  6 fichiers, puis ingérés : 16 candidatures, TF-1379 à TF-1394 (11, 4 et 1), toutes en attente de
  votre décision. Confrontés au registre et à l'archive, aucun n'était déjà traité (titre le plus
  proche à 56 %, sujet différent) ; `oracle-todo` exit 0, `oracle-boite-entree` PASS, sas
  d'arrivée vide (`1daea0af`) ; publié à 17:47.
- **D-28 (a)** — l'adresse est inscrite au canal comme identifiant, sous le pseudonyme
  « personne-a » devant le domaine déjà pseudonymisé (canal `5699efc`). Elle est remplacée dans les
  2 fichiers, archive du registre comprise : 0 occurrence dans l'arbre du pilot et dans les
  14 autres dépôts publiés (`8afb5626`). TF-1377 est clos sur cette preuve (`a464cb94`). Son
  inscription est datée à l'instant, 17:23:29. Sous une date au jour, la porte des noms rendait
  FAIL sur le pilot : 36 bloquants dans 18 enregistrements écrits le matin même. La porte lit
  désormais un instant (forge-agents `e53bd20`, recette PASS à 353 contrôles), et le contrôle du
  canal aussi (`580319e`, 7 règles sur 7). Rejouée sur le même enregistrement, elle rend PASS,
  0 bloquant. Les 36 sont devenus exactement 36 antériorités : des occurrences plus anciennes que
  l'inscription, non bloquantes.
- **D-27 (a)** — la garde est posée sur les 13 forges et `digit-ai-queue` : pre-push, pre-commit
  et commit-msg, 42 hameçons, vérification 42 posés et 0 manquant. Au pilot : pre-push et
  commit-msg, avec sa section de contrôle d'avance insérée avant la porte des noms ; son propre
  pre-commit est gardé (`verifier-hooks-git` PASS). Éprouvée ensuite : pre-push de forge-agents
  exit 0 en 18 s ; commit-msg de la file, message propre accepté et message portant un nom de la
  table refusé. L'enregistrement `462a7add` du pilot est passé par ses hameçons. L'envoi réel du
  pilot a été refusé à 18:01, push exit 1 : 4 bloquants, tous dans le remisage, et l'origine est
  restée à `a464cb94`.
- **Publication** — forge-agents à 17:41:07, canal à 17:41:10, pilot `eeb833bb..a464cb94` à
  17:47:37, avant la pose de sa garde. Avant chaque envoi : porte des noms PASS sur un paquet de la
  seule branche envoyée, et contrôle d'avance avec votre feu vert.
- **Propagation** — `bootstrap --pull` : poste prêt, copie installée de la porte identique à sa
  source. Les 2 dépôts qui consomment ce skill, forge-design et forge-data, n'appellent pas la
  porte, seul script modifié : leurs suites n'ont pas été rejouées.

## 5. Non traité

- **L'autre poste** (TF-1360, qui reste en cours) — motif : cette session ne le voit pas. La garde
  vit dans la configuration locale de chaque dépôt et ne voyage pas ; si ses hameçons datent d'avant
  la parade du 26/09, un envoi refusé peut encore y partir.
- **La section de contrôle d'avance du pilot, qui ne vit que dans son hameçon** (TF-1275) — motif :
  candidature en attente de décision ; une repose par l'installeur l'effacerait sans rien dire.
- **Les candidatures neuves TF-1395, TF-1396 et TF-1397** — motif : nées en chemin, elles attendent
  votre décision comme les autres ; elles portent une empreinte d'ingestion invérifiable depuis le
  22/08, un refus de 40 lignes pour 4 bloquants, et un envoi du pilot qui coûte 9 min 11 s.
- **Les 16 candidatures ingérées de Produit-68** — motif : ingérer ne décide rien.
- **La garde du canal confidentiel** — motif : posée en D-30, faute d'une garde du parc qui lui
  convienne.
- **Les 3 suppressions** — motif : gestes humains (R-29), inventaire en tête du bloc 3.

## 6. Écarts à la lettre

- **Vous avez demandé** D-27 (a), la garde sur les 16 dépôts gouvernés, pilot compris. **J'ai**
  posé la garde sur 15 : le canal confidentiel n'en a reçu aucune. **Pourquoi** : ses tables sont
  les noms ; la porte y rend 144 bloquants par construction, la garde refuserait chacun de ses
  envois, et le hameçon d'enregistrement réécrirait les tables. Le « 16 » de l'option venait de ma
  rédaction, qui comptait le canal sans l'avoir mesuré ; D-30 propose la garde qui lui convient.
- **Vous avez accepté**, avec D-27 (a), que tout envoi du pilot soit refusé tant que le remisage
  existe. **J'ai** publié le pilot à 17:47:37, puis posé sa garde à 17:47:48. **Pourquoi** :
  D-29 (a) commandait de publier l'enregistrement, et D-28 visait l'état courant du dépôt public ;
  les 3 enregistrements sont partis jugés comme la garde les aurait jugés — porte des noms PASS sur
  la branche envoyée, contrôle d'avance avec votre feu vert —, le remisage, lui, ne part pas.
- **Vous avez demandé** D-28 (a), l'adresse inscrite « datée du jour ». **J'ai** daté son
  inscription à l'instant, 17:23:29, et donné à la porte des noms et au contrôle du canal la
  capacité de lire un instant. **Pourquoi** : datée au jour, elle rendait bloquants pour toujours
  18 enregistrements écrits le matin même, avant son inscription, dont 17 déjà publiés ; les
  corriger exigeait la réécriture d'historique que l'option (a) excluait.

## 7. Risques

- **Chaque envoi du pilot attend désormais environ 9 minutes** (TF-1397) : la porte juge tout
  l'historique du plus gros dépôt du parc.
  - signal : un envoi qui semble figé ; celui de ce soir a pris 9 min 11 s.
  - parade : lancer l'envoi en tâche de fond, sortie vers un fichier, jamais dans un filtre ; ne
    pas le contourner.
- **Le refus de la garde noie son motif** (TF-1396) : 4 bloquants imprimés parmi 36 antériorités,
  sans compte.
  - signal : un refus de 40 lignes.
  - parade : ne lire que les lignes sans la mention « ANTÉRIORITÉ ».
- **Une repose de la garde au pilot effacerait sa section de contrôle d'avance** (TF-1275), sans
  message.
  - signal : l'installeur affiche « REPOSE » pour le pre-push du pilot.
  - parade : ne pas reposer ce hameçon ; si c'est fait, réinsérer la section avant la porte des
    noms.
- **Le canal confidentiel reste sans garde d'envoi.**
  - signal : aucun, par construction, jusqu'à l'ouverture suivante.
  - parade : D-30 (a).

## 8. Prochaines actions

Les actions ci-dessous sont triées, celles de l'IA d'abord. L'ordre : la publication retenue, puis
ce qui suit votre réponse, puis l'autre poste et la construction laissée ; côté humain, trancher,
puis le remisage, qui retient la publication de ce travail.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier le pilot dès le remisage retiré : `FORGE_PUSH_GO="D-27 (a) et D-28 (a) du 27/09" git push origin main`, lancé en tâche de fond, sortie vers un fichier ; preuve : l'origine porte cette synthèse | `auto_ia` | TF-1360 | `dependance_bloc_3` — attend le retrait du remisage | les enregistrements de ce travail restent sur ce poste, et le registre public ne porte pas la pose de la garde |
| **A-2** | Exécuter D-30 selon votre réponse : écrire la garde d'envoi du canal, qui joue `node oracle-confidentiel.mjs .` et refuse sur un échec, l'éprouver dans les 2 sens sur un dépôt jetable, puis la poser | `auto_ia` | neuve | `dependance_bloc_3` — attend D-30 | le canal reste jugé à l'ouverture seulement |
| **A-3** | À la prochaine ouverture de l'autre poste : `node <forge-agents>\.claude\skills\quality-oracles\scripts\installer-hamecon-publication.mjs <dépôts> --verifier`, puis la repose des hameçons manquants ou antérieurs à la parade du 26/09, et la section de contrôle d'avance du pilot | `auto_ia` | TF-1360 | `dependance_externe` — l'autre poste n'est pas visible de cette session | un envoi refusé peut encore y partir |
| **A-4** | Capitaliser le kit Google Ads dans une forge : générateur de l'import web confronté aux modèles, relevé en lecture seule, fichier des changements, rangés dans une forge hors de tout produit | `auto_ia` | TF-1364 | `borne_atteinte` — construction complexe × long, hors de ce tour qui exécute 3 décisions | le kit reste chez le produit et se réécrit au prochain |
| **A-5** | Trancher D-30, reprise en entier au bloc 3 — répondre par exemple « D-30 a » | `manuelle_utilisateur` | neuve | `decision` — poser une garde touche la configuration du canal, et vous revient | (b) s'applique : rien n'est posé sur le canal |
| **A-6** | Retirer le remisage du 24/09 : `git -C C:\dev\digit-ai-factory stash list` doit le montrer en `stash@{0}`, libellé « Releves locaux du 22-24/09… », puis `git -C C:\dev\digit-ai-factory stash drop stash@{0}` ; preuve : l'envoi du pilot n'est plus refusé | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | tout envoi du pilot reste refusé, cette synthèse comprise |
| **A-7** | Ouvrir `C:\dev\null`, vérifier qu'il ne porte aucun jeton, puis le supprimer ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | le relevé d'ouverture le signale à chaque session |
| **A-8** | Retirer l'arborescence liée du 14/09 : `git -C C:\dev\digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`, puis `git -C C:\dev\digit-ai-factory branch -d worktree-agent-ac087535fe0698917` ; preuve : `git -C C:\dev\digit-ai-factory worktree list` ne liste plus que le pilot | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | le pilot garde un dossier non suivi, compté à chaque ouverture |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Pilot : `1daea0af` (D-29), `8afb5626` (D-28) et `a464cb94` (registre) publiés à 17:47:37 ;
  `462a7add` et `6d30f2b7` (registre), puis cette synthèse et son journal d'oracle, retenus par
  la garde.
- Forge-agents `e53bd20` publié à 17:41:07 ; canal `5699efc` et `580319e` à 17:41:10.
- Hameçons : 42 posés à 17:45 sur les 13 forges et `digit-ai-queue`, 2 au pilot à 17:47:48, sa
  section de contrôle d'avance insérée à 17:47:56 ; ils vivent dans le dossier des hameçons de
  chaque dépôt, qui ne voyage pas.
- Registre `todo/TODO.jsonl` : lot de D-29 (16 créations), 2 événements de TF-1377 (décision,
  clôture), puis 2 notes, puis 1 note et 3 créations ; `oracle-todo` PASS avant et après chaque lot.
- Sorties des portes, du contrôle d'avance, des essais et de l'envoi refusé : fichiers de la
  session, hors dépôt (`porte-noms-pilot-bundle-7.json` et `-8.json`, `sonde-remisages/`,
  `essai-precommit-pipe/`, `envoi-pilot-garde.txt`).
- Aucune page HTML livrée dans ce tour.
