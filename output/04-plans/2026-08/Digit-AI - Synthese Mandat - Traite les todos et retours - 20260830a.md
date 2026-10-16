---
destinataire: humain
---

# Synthèse de mandat — « Traite les todos et retours » (30/08/2026)

Le registre des tâches et la boîte de retours de ce poste ont été relevés, et le travail
demandé n'a **pas** été exécuté ici : la copie de travail de ce poste est en retard de deux
jours sur la copie publiée, et surtout son historique est l'**ancienne version**, celle qui
portait encore les noms réels de clients avant qu'ils n'en soient retirés le 28 août. La copie
publiée a déjà traité ce même mandat, archivé deux cent neuf tâches et corrigé l'une des deux
tâches encore ouvertes ici. Travailler dans cette copie referait un travail déjà fait, et
tenter de la réunir à la copie publiée **remettrait en ligne les noms de clients qui viennent
d'en être effacés**. Ce qui est attendu de vous tient en un choix : autoriser la remise à
niveau de ce poste sur la copie publiée, en abandonnant les commits locaux qui en sont les
doublons non anonymisés — ou refuser, et dire alors comment vous voulez que ce poste vive avec
cet écart.

## 1. En-tête d'identification

- **quoi** — mandat humain « Traite les todos et retours », instruction et relevé d'état, sans écriture au registre.
- **sur quoi** — le pilot `digit-ai-factory` (`c:\dev\digit-ai-factory`), sa boîte d'entrée `input\00-retours\` et son registre `todo\TODO.jsonl`.
- **quand** — fin le **30/08/2026 à 08:36 (UTC+02:00)**, durée **≈ 25 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt local à `8caf46d` (`v1.17.30-168-g8caf46d`, 27/08/2026 08:08 +02:00).

## 2. Verdict en une ligne

Mandat **NON EXÉCUTÉ, sur blocage mesuré** : la copie locale est à 403 commits d'écart en avant et 408 en arrière de `origin/main`, ses 25 messages de commit propres portent 22 fois un nom de client réel que la copie publiée a purgé, et `origin/main` a déjà traité ce mandat le 28/08 (registre local 216 items / 8 actifs, registre publié 26 items / 23 actifs, 3269 événements d'archive contre 2325 ici).

## 3. Décisions attendues de l'humain

**Chapeau commun — l'histoire, une fois.** Le 27/08, dix dépôts de l'écosystème ont été
réécrits pour retirer un nom de client de leur historique ; le 28/08, la même opération a été
poussée plus loin sur le pilot — cinq organisations pseudonymisées, la boîte de retours retirée
du suivi et mise en liste d'exclusion, et l'anonymisation câblée dans la chaîne d'ingestion.
Cette réécriture a produit un historique **entièrement nouveau** côté publié : les mêmes
travaux, sous des empreintes de commit différentes et avec des messages nettoyés. Ce poste,
lui, n'a jamais reçu cette réécriture : il porte encore l'historique d'origine, arrêté au
27/08 au matin. Les deux branches partagent leur dernier ancêtre commun au 06/08. C'est
pourquoi l'écart n'est pas un simple retard : réunir les deux branches réintroduirait dans le
dépôt publié exactement ce que la purge en a retiré.

- **Décision 1 — comment cette copie de travail se réconcilie avec la copie publiée du pilot.** La copie installée sur cette machine porte l'historique d'avant la purge des noms de clients : 403 commits qui sont les doublons non anonymisés de commits déjà publiés sous une autre forme, plus 197 fichiers de la boîte de retours que la copie publiée ne publie plus. Recommandation instruite avant d'être posée, et sa source consultée : le message du commit `e748eaa` de `origin/main` (« La boite d'entree quitte GitHub »), qui écrit la décision humaine du 28/08 mot pour mot, et le motif d'exclusion `input/00-retours/` inscrit au fichier d'exclusion publié. Les commits locaux n'apportent aucun contenu absent d'en face : leurs 25 sujets propres correspondent aux mêmes travaux, réécrits.
  - **(a) Remettre cette copie à niveau sur la copie publiée**, en abandonnant les 403 commits locaux. *Coût* : les empreintes locales disparaissent, et tout travail non publié qui n'existerait que dans ces commits serait perdu — la vérification menée ici ne montre aucun contenu de ce genre, mais elle porte sur les sujets de commit et sur l'arbre, pas sur chaque différence. *Exclut* : de conserver la traçabilité locale par empreinte des travaux d'avant le 27/08.
  - **(b) Fusionner ou rebaser les deux branches.** *Coût* : réintroduit dans l'historique publié les 22 messages portant des noms de clients réels et les 197 fichiers de retours retirés — c'est-à-dire annule la purge du 27 et du 28/08. *Exclut* : de tenir la décision humaine du 28/08.
  - **(c) Laisser cette copie en l'état et travailler localement quand même.** *Coût* : chaque tour de travail refait ce que la copie publiée a déjà traité — la tâche de dédoublonnage des lots y est corrigée depuis le 28/08 — et l'écart grandit. *Exclut* : toute publication depuis cette machine, donc tout partage du travail qui y serait mené.
  - **Recommandation : (a), et pourquoi** — c'est la seule voie qui rend cette copie utilisable **sans** défaire la protection des noms de clients, et le coût qu'elle nomme est le seul des trois qui soit borné et vérifiable avant exécution.
  - **Si rien n'est décidé** : l'option (c) s'applique par défaut, puisqu'elle est l'état actuel — la copie reste inutilisable pour un travail publiable, et l'écart continue de croître à chaque tour joué ailleurs.
- **Décision 2 — le sort des 47 fichiers de lots de retours présents sur ce disque.** La boîte d'entrée de cette machine contient 47 fichiers de lots du produit Produit-02, tous déjà ingérés au registre local ; la copie publiée ne les suit plus et les a exclus du dépôt, et sa propre chaîne d'ingestion anonymise désormais les noms avant écriture. Recommandation instruite, et sa source consultée : le même message de commit `e748eaa`, qui dit explicitement « Le dossier reste sur le disque : il cesse d'etre publie », et qui indique que les fichiers ont été renommés côté publié pour que registre et disque concordent.
  - **(a) Conserver les fichiers sur le disque et les laisser sortir du suivi** avec la remise à niveau. *Coût* : les noms de fichiers de cette machine porteront encore le nom du produit alors que le registre publié le nomme autrement, jusqu'à ce que le renommage soit rejoué ici. *Exclut* : d'avoir registre et disque concordants immédiatement.
  - **(b) Rejouer ici le renommage appliqué côté publié**, après la remise à niveau. *Coût* : un traitement supplémentaire, à ne lancer qu'après la réconciliation sous peine de le refaire. *Exclut* : rien, mais l'ordre est contraint.
  - **(c) Supprimer les fichiers de ce disque.** *Coût* : perte de la source primaire des lots ; le registre publié en porte le contenu anonymisé, pas le texte original. *Exclut* : toute relecture ultérieure d'un lot dans sa forme reçue.
  - **Recommandation : (a), et pourquoi** — elle ne détruit rien et n'exige aucun traitement avant que la réconciliation ne soit tranchée ; l'option (b) reste ouverte ensuite et n'est pas urgente.
  - **Si rien n'est décidé** : les fichiers restent sur le disque et suivis par ce dépôt local, donc exposés à repartir vers le dépôt publié si la voie (b) de la réconciliation était retenue.

## 4. Traité — avec sa preuve

- **La boîte d'entrée a été contrôlée** : rien n'y attend d'être ingéré.
  - preuve : `node oracles\oracle-boite-entree.mjs` → verdict **PASS**, règle B1 « 23 sidecar(s) présent(s), tous ingérés », B2 « aucun sidecar édité après ingestion », B3 « aucun lot sans sidecar », B5 PASS ; les seuls B6 non verts sont **SANS_OBJET** sous dérogation tracée.
- **Le registre local a été contrôlé et son état relevé** : 8 tâches actives sur 216.
  - preuve : `node todo\oracle-todo.mjs` → verdict **PASS**, « 216 item(s) actif(s), 468 archivé(s) — registre intègre » ; dépliage des événements → 200 `corrige`, 8 `ecarte`, 3 `decide`, 5 `candidat`.
- **L'écart entre ce poste et la copie publiée a été mesuré**, et sa nature établie.
  - preuve : `git rev-list --left-right --count origin/main...main` → **408 / 403** ; dernier ancêtre commun `d639181` du 06/08 ; 25 sujets de commit locaux absents de `origin/main`, dont **22** portant un nom de client réel ; `git diff --name-status main origin/main` → **202** fichiers présents ici et absents de la copie publiée, dont **197** sous `input/00-retours/`.
- **La copie publiée a déjà exécuté ce même mandat** : établi par lecture de son historique, non supposé — 209 tâches y ont été archivées le 28/08.
  - preuve : `origin/main` porte le commit `3462f5b` « Traite tous les todos et retours : 4 lots ingeres, 209 items archives » et le commit `66c76d2` qui clôt la tâche de dédoublonnage des lots ; son registre compte **26 items / 23 actifs** contre 216 / 8 ici, et son archive **3269** événements contre 2325 ici ; ses tâches TF-0685 à TF-0703 n'existent pas dans le registre local.
- **Le fichier parasite signalé au démarrage a été inspecté sans être touché** : il ne contient aucun justificatif d'authentification.
  - preuve : lecture seule de `c:\dev\null` (10 927 octets, 24/08) → document HTML ; le seul motif sensible trouvé est `tokens.css?v=36bfd29e93d5`, une feuille de style, non un jeton.

## 5. Non traité — avec son motif

- **Les 8 tâches actives du registre local** (TF-0549, TF-0665, TF-0674, TF-0676, TF-0680, TF-0682, TF-0683, TF-0684) : *motif — dépendance à une décision humaine*. Les traiter ici écrirait dans un registre que la copie publiée a déjà dépassé ; six d'entre elles y sont déjà passées en `decide`, et deux y sont déjà closes.
- **La tâche de dédoublonnage des lots de travaux inclus dans un lot non traité** : *motif — écarté, déjà fait ailleurs*. Elle est corrigée sur `origin/main` par le commit `66c76d2`. Critère de réouverture : si la remise à niveau montrait que le correctif publié ne couvre pas le cas d'inclusion stricte mesuré ici.
- **La tâche du produit sans dépôt versionné** (TF-0549) : *motif — impossible à prouver ici*. Le répertoire visé est absent de cette machine.
- **La tâche du contrôle de mise en bloc qui accuse un sélecteur non applicable** (TF-0683) : *motif — hors mandat, et bloqué par un garde-fou*. Le contrôle incriminé n'existe dans aucun fichier de ce dépôt ; il vit chez une forge sœur, où toute écriture exige un mandat humain nommé, et aucun n'est déclaré dans cette session.
- **La tâche des six recettes dont la déclaration de cas n'est reconnue par rien** (TF-0684) : *motif — dépendance à une décision humaine*. Les six fichiers sont bien dans ce dépôt, mais la copie publiée a déjà statué dessus ; corriger ici produirait un troisième état du même fichier.
- **La remise à niveau du dépôt elle-même** : *motif — bloqué par un garde-fou*. Réécrire l'historique d'une copie de travail est un geste à effet non réversible, réservé à l'humain (règle R-29), et la consigne d'ouverture du poste le dit explicitement (« rebase ou merge à la main dans le dépôt »).

## 6. Écarts à la lettre

- **vous avez demandé** « Traite les todos et retours » → **j'ai fait** un relevé d'état et un dossier de décision, sans traiter une seule tâche ni ingérer un seul lot → **pourquoi** : la copie de travail de ce poste est une version antérieure à la purge des noms de clients du 28/08, et la copie publiée a déjà exécuté ce mandat. Traiter ici aurait produit un travail en double dans un registre périmé, et l'aurait rendu publiable seulement au prix de la réintroduction des noms purgés. L'écart est signalé plutôt que consommé en silence.
- Aucun autre écart.

## 7. Risques

- **La purge des noms de clients est annulée par une réunion des deux branches.**
  - signal : après une fusion ou un rebasage, `git log origin/main` fait réapparaître des messages nommant les six organisations pseudonymisées, et le dossier `input/00-retours/` redevient suivi.
  - parade : l'option (a) de la décision 1, qui abandonne les commits locaux au lieu de les réintégrer ; la ligne d'exclusion `input/00-retours/` déjà présente côté publié empêche la seule ré-adjonction des fichiers, pas celle des messages.
- **Un tour de travail joué sur ce poste écrase du travail plus récent.**
  - signal : un identifiant de tâche apparaît deux fois avec deux décisions différentes, ou une tâche close côté publié redevient candidate.
  - parade : ne rien écrire au registre de ce poste tant que la décision 1 n'est pas tranchée — c'est ce qui a été fait dans ce tour.
- **La machine qui a produit les commits du 28/08 n'est pas identifiée ici, et son état n'est pas connu.**
  - signal : une prochaine ouverture de poste montre `origin/main` encore avancé sans qu'aucune copie locale connue ne l'explique.
  - parade : acceptation déclarée pour ce tour — la recherche a été faite sur cette machine (aucun autre clone n'est à jour : le seul autre est à 169 commits de retard), et aller au-delà sortirait du mandat.
- **Un dépôt frère porte le même écart et personne ne l'a mesuré.**
  - signal : neuf forges sœurs sont signalées « DIVERGÉ » au démarrage de cette session, dans des proportions qui suggèrent la même réécriture.
  - parade : la décision 1, une fois tranchée pour le pilot, donne la règle à appliquer aux neuf autres ; aucune mesure n'a été faite sur elles dans ce tour, et c'est dit.

## 8. Prochaines actions

Ordre de traitement : la décision de réconciliation vient en premier parce qu'elle **conditionne toutes les autres** — aucune écriture au registre n'a de sens avant elle, et six des huit tâches actives sont déjà tranchées côté publié. Viennent ensuite l'exécution de cette décision, puis la vérification, puis les restes indépendants.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Trancher la **décision 1** ci-dessus : remettre ce poste à niveau sur la copie publiée, fusionner, ou rester en l'état. | `manuelle_utilisateur` | `decision` — arbitrage de risque : la voie (b) annule une protection de données décidée par vous le 28/08. | Le poste reste inutilisable pour tout travail publiable, et l'écart de 403 commits grandit à chaque tour joué ailleurs. |
| 2 | `neuve` | Trancher la **décision 2** ci-dessus : conserver, renommer ou supprimer les 47 fichiers de lots présents dans la boîte d'entrée de ce disque. | `manuelle_utilisateur` | `decision` — la suppression de sources primaires est un arbitrage, pas une mécanique. | Les fichiers restent suivis par ce dépôt local et repartiraient vers le dépôt publié si la voie (b) de la décision 1 était retenue. |
| 3 | `neuve` | Exécuter la remise à niveau du dépôt une fois la décision 1 rendue : `git -C c:\dev\digit-ai-factory fetch origin`, puis l'opération correspondant à la voie retenue. | `auto_ia` | `dependance_bloc_3` — attend la décision 1, et l'opération elle-même relève de R-29 (effet non réversible sur l'historique local). | Rien ne change : les tâches ne peuvent pas être traitées, et le prochain tour rejouera ce même relevé. |
| 4 | `neuve` | Rejouer la vérification de poste et les deux contrôles de registre après remise à niveau : `node bootstrap.mjs --pull`, `node oracles\oracle-boite-entree.mjs`, `node todo\oracle-todo.mjs`. | `auto_ia` | `dependance_bloc_3` — attend que l'action 3 soit faite. | On croirait le poste prêt sans l'avoir mesuré, et c'est exactement l'état qui a produit cet écart. |
| 5 | `neuve` | Mesurer le même écart sur les neuf forges sœurs signalées « DIVERGÉ » et appliquer la règle retenue en décision 1 : `node bootstrap.mjs --pull` puis, par dépôt, `git rev-list --left-right --count origin/main...main`. | `auto_ia` | `dependance_bloc_3` — la règle à appliquer sort de la décision 1 ; le relevé, lui, est de lecture seule et peut être lancé dès l'accord. | Neuf dépôts portent le même piège que le pilot, et le premier travail qui y sera poussé rouvrira la question des noms purgés. |
| 6 | TF-0549 | Instancier ou archiver le produit `Produit-07`, absent de cette machine — le geste appartient au produit, pas au pilot. | `manuelle_utilisateur` | `acces` — le répertoire cible n'existe pas sur ce poste. Trace mesurée : `ls -d /c/dev/Produit-07` rend `No such file or directory`, et `ls /c/dev` liste 30 entrées dont aucune de ce nom. | La règle d'héritage rendra ÉCHEC à chaque rejeu sur ce produit, et un ÉCHEC permanent finit par se lire comme du bruit. |
| 7 | `neuve` | Statuer sur les trois signalements d'ouverture de poste : le fichier `c:\dev\null` (page HTML de 10 927 octets, **aucun justificatif d'authentification** — vérifié en lecture seule), le lien symbolique brisé `c:\dev\digit-ai-forge-pilot_old`, et le clone périmé `c:\dev\_archive-digit-ai-forge-steering_old` (169 commits de retard). | `manuelle_utilisateur` | `irreversible` — supprimer un fichier, un lien ou un répertoire est un geste humain (R-29) ; le contrôle les déclare, il ne les efface pas. | Les trois signalements reparaissent à chaque ouverture de session et diluent les défauts réels au milieu du bruit. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Traite les todos et retours - 20260830a.md`
- Registre local relevé : `todo\TODO.jsonl` (216 items, 8 actifs) · archive locale : `todo\TODO-ARCHIVE.jsonl` (2325 événements)
- Boîte d'entrée relevée : `input\00-retours\` (47 fichiers, 23 lots ingérés)
- Contrôles exécutés : `oracles\oracle-boite-entree.mjs` (PASS) · `todo\oracle-todo.mjs` (PASS)
- Commits de la copie publiée cités : `e748eaa` (sortie de la boîte d'entrée du suivi, 28/08) · `3462f5b` (traitement du mandat, 209 items archivés) · `66c76d2` (dédoublonnage des lots) · `892f47a` (alias de forge-development)
- Point de divergence : `d639181` (06/08/2026) · tête locale `8caf46d` (27/08) · tête publiée `66c76d2` (28/08)
