---
destinataire: humain
---

# Synthèse de mandat — la synchronisation avec GitHub est suspendue avant toute écriture : sept dépôts portent la campagne du 14/09 jouée deux fois, une fois sur chaque poste, et le choix de la version qui fait foi vous revient (19/09/2026)

Rien n'a été publié ni modifié dans les dépôts. Huit dépôts sur quinze sont déjà identiques à GitHub. Les sept autres ne peuvent pas être synchronisés par un simple envoi : l'autre poste a publié, le 14/09 en début d'après-midi, les corrections de la campagne « traite tous les todos et retours », et ce poste a refait les mêmes corrections le 14/09 au soir, autrement, sans les publier. Les deux versions corrigent les mêmes défauts avec un code différent, et le registre des travaux du pilot a donné les mêmes trente-trois numéros à des sujets différents sur chaque poste. Une sauvegarde complète de chacun des sept dépôts est posée hors dépôt. Il vous est demandé une seule décision : quelle version fait foi, celle de GitHub ou une fusion au cas par cas.

## 1. En-tête d'identification

- **quoi** — mandat « Synchronise tout avec github » : relevé de l'écart de chaque dépôt du parc avec GitHub, simulation des fusions en mémoire, sauvegardes ; aucune fusion, aucun enregistrement, aucun push.
- **sur quoi** — le pilot `digit-ai-factory` et les quatorze dépôts frères de `c:\dev` (treize forges, `digit-ai-queue`) ; le canal confidentiel est à jour au relevé d'ouverture.
- **quand** — 2026-09-19 12:40 UTC+02:00 (Europe/Paris) ; première commande du tour vers 12:05 ; durée mesurée ≈ 35 min.
- **qui** — session Fable 5.1 chez le pilot, local `1514d3e4`, GitHub `eb90ae0c` ; aucune délégation, escalade : aucune ; contrôles joués : `git fetch` sur quinze dépôts, `git cherry` (équivalence des enregistrements), `git merge-tree --write-tree` (fusion simulée en mémoire, rien d'écrit), `git bundle verify` (sept sauvegardes), comparaison des événements du registre par script de lecture.

## 2. Verdict en une ligne

**8 dépôts sur 15 à jour (0 devant, 0 derrière) ; 7 divergents — pilot 16 devant / 96 derrière, forge-agents 12/16, forge-data 5/7, forge-design 2/11, forge-audit 1/6, forge-tests 1/5, forge-organization 1/1 ; fusion simulée : 41 fichiers en conflit (pilot 17, forge-agents 11, forge-data 10, forge-design 2, forge-organization 1, forge-audit 0, forge-tests 0) ; registre du pilot : 33 identifiants (TF-1073 à TF-1105) créés des deux côtés pour des sujets différents, 40 items mis à jour des deux côtés dont 6 avec un statut différent ; 7 sauvegardes vérifiées « is okay » ; 0 écriture dans les dépôts, 0 push.**

## 3. Décisions attendues de l'humain

Une décision.

> **D-1 — Pour les sept dépôts où la campagne du 14/09 a été jouée deux fois, la version publiée sur GitHub fait-elle foi, le travail de ce poste n'étant reporté dessus que là où GitHub n'a pas d'équivalent ?**
>
> Il s'agit des sept dépôts que ce poste et l'autre poste ont fait avancer chacun de leur côté depuis le 08/09 au 13/09. La comparaison des enregistrements montre que ce n'est pas un simple retard : les mêmes corrections existent en deux versions. Chez forge-data, les cinq enregistrements locaux du 14/09 au soir (cibles de lineage nommées par leurs champs, résolution DAX nommée, pied d'export traité comme une donnée, rapprochement avec un extrait, couverture mesurée) répondent un par un à cinq enregistrements publiés le même jour entre 13:35 et 14:05, avec un code différent. Pour forge-organization, l'enregistrement local et l'enregistrement publié portent le même titre et diffèrent de deux lignes. Du côté de forge-agents, quatre reprises du socle des pages existent en double, mais ce poste porte aussi du travail sans équivalent publié : le skill qui rend un document Word, le constructeur du référentiel d'appel d'offres, les trois barres de communication, le contrôle de transparence de l'article 50. Au pilot, le registre des travaux a frappé les mêmes trente-trois numéros sur chaque poste pour des sujets différents, et quarante items ont été mis à jour des deux côtés. La renumérotation des trente-trois items de ce poste, vers des numéros libres des deux côtés, ne vous est pas demandée : le mode opératoire du registre la prescrit et l'outil existe (plages de numéros au bloc 4 et à l'action A-2).
>
> **Recommandation : (a).** Source consultée : `scripts\rebatir-clone.mjs` (décision du 07/09 : sauvegarder, réaligner sur l'histoire publiée, rejouer le travail propre au poste, juger par la porte de publication avant tout push — « à recloner, pas à fusionner ») ; `references\TODO-FORGE.md` (collision d'identifiants : `node todo\renumeroter.mjs`, motif consigné dans l'item) ; `REGLES-PROJET.md` R-38 §4-5 (la publication est un feu vert humain) ; mesure du tour : ce qui est publié a déjà été tiré par l'autre poste, ce qui est local n'existe que dans ce clone.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) GitHub fait foi : chaque dépôt est réaligné sur sa version publiée, puis seul le travail local sans équivalent est rejoué dessus (skill Word, référentiel d'appel d'offres, barres, contrôle de l'article 50, les deux corrections de forge-design, celle de forge-audit, la note de forge-tests, les 33 items renumérotés et les synthèses du pilot), sous les bancs de chaque dépôt, puis publié | effort moyen × long ; les doublons locaux ne vivent plus que dans les sauvegardes | exclut de comparer les deux versions d'une même correction : quand celle de ce poste était meilleure, elle n'est pas retenue |
| (b) fusion au cas par cas : les 41 fichiers en conflit sont arbitrés un par un, la meilleure des deux versions est gardée ou les deux sont combinées, bancs rejoués, puis publication | effort complexe × très long ; chaque arbitrage de code est un jugement que vous ne verrez qu'après coup | exclut une histoire lisible : chaque dépôt garde deux séries d'enregistrements pour les mêmes corrections |
| (c) synchronisation partielle : seuls forge-audit et forge-tests (aucun conflit simulé) sont réalignés et publiés ; les cinq autres restent en l'état | effort simple × court | exclut la synchronisation demandée : cinq dépôts dont le pilot restent divergents, et l'écart grandit à chaque session de l'autre poste |

> **Si rien n'est décidé** : l'option (c) ne s'applique pas d'office non plus — rien n'est écrit ni publié, les sept dépôts restent divergents et sauvegardés.

## 4. Traité — avec sa preuve

- **L'écart de chaque dépôt avec GitHub est mesuré après rafraîchissement.**
  - preuve : `git fetch` puis `git rev-list --left-right --count HEAD...@{u}` sur quinze dépôts → 0/0 pour forge-agents-security, forge-conception, forge-development, forge-observability, forge-ops, forge-seo-geo, forge-websec, digit-ai-queue ; 16/96 pilot, 12/16 forge-agents, 5/7 forge-data, 2/11 forge-design, 1/6 forge-audit, 1/5 forge-tests, 1/1 forge-organization.
- **La divergence est une vraie double avancée, pas une histoire réécrite.**
  - preuve : `git merge-base HEAD origin/main` → un ancêtre commun daté du 08/09 au 13/09 dans chacun des sept dépôts (pilot `a3cde263` du 13/09 17:50) ; `git cherry -v origin/main HEAD` → tous les enregistrements locaux marqués « + » (aucun équivalent strict publié) ; `git diff --ignore-cr-at-eol --shortstat HEAD origin/main` → mêmes compteurs qu'en brut (l'écart n'est pas une affaire de fins de ligne).
- **Les fusions sont simulées sans rien écrire.**
  - preuve : `git merge-tree --write-tree --name-only HEAD origin/main` (git 2.52) → 17 fichiers en conflit au pilot (dont `todo/TODO.jsonl`, `oracles/oracle-synthese.mjs`, `oracles/hook-restitution.mjs`, `gabarits/RESTITUTION.md`, `REGLES-PROJET.md`), 11 chez forge-agents (dont `check_html.py`, `render_page.py`, `self_test.py`), 10 chez forge-data, 2 chez forge-design, 1 chez forge-organization (`registre-types.json`), 0 chez forge-audit et forge-tests.
- **Les collisions du registre sont comptées.**
  - preuve : script de lecture sur les lignes ajoutées à `todo/TODO.jsonl` depuis l'ancêtre commun → local : 97 lignes (33 créations, 45 mises à jour, 19 ingestions) ; GitHub : 570 lignes (100 créations, 416 mises à jour, 54 ingestions) ; « COLLISIONS (même id, contenu différent) 33 », plage TF-1073 → TF-1105 ; GitHub va jusqu'à TF-1169 ; 40 items mis à jour des deux côtés, statut différent d'un poste à l'autre pour TF-0960, TF-1027, TF-0938, TF-0964, TF-1025, TF-1067.
- **Les sept dépôts divergents sont sauvegardés hors dépôt.**
  - preuve : `git bundle create … --all` puis `git bundle verify` → « is okay » pour les sept fichiers `c:\dev\_sauvegardes\<dépôt>-avant-synchronisation-20260919.bundle`, HEAD d'avant consigné à côté (`…-HEAD.txt`).

## 5. Non traité — avec son motif

- La synchronisation des sept dépôts divergents (réalignement, rejeu, publication) — motif : dépendance à une décision humaine (D-1) ; choisir entre deux versions d'une même correction n'est pas un geste mécanique.
- forge-audit et forge-tests, dont la fusion simulée est sans conflit — motif : dépendance à une décision humaine (D-1) ; leurs enregistrements locaux appartiennent à la même campagne jouée deux fois, et toute écriture a été suspendue dès ce constat.
- Les modifications non enregistrées du pilot (index de dossiers et relevés régénérés par les hooks d'ouverture, 8 fichiers) et le lot non suivi « Produit-61 - Rapport d'audit - 20260909a » de la boîte d'entrée — motif : dépendance à une décision humaine (D-1) ; les index se régénèrent après réalignement, le lot reste sur disque, intact.
- Les fichiers non suivis des forges (cinq dossiers de captures approuvées chez forge-design, `input\` et `output\` chez forge-tests, un rapport chez forge-agents, une modification chez forge-conception) — motif : hors mandat ; non enregistrés par leur forge, ils ne se publient pas tels quels.
- Les deux dossiers non versionnés signalés à l'ouverture (« Digit-AI - SaaS Tests », « Produit-07 ») — motif : bloqué par un garde-fou ; rien à synchroniser, et tout geste sur eux est humain (R-29).

## 6. Écarts à la lettre

- **Vous avez écrit** « Synchronise tout avec github » → **j'ai fait** le relevé, la simulation et les sauvegardes, et je n'ai ni fusionné ni publié. **Pourquoi** : « synchroniser » suppose qu'une seule version de chaque correction existe ; ici il y en a deux, et retenir l'une écarte l'autre de l'histoire publiée — un choix difficile à défaire une fois poussé, que la règle « l'IA fait, l'humain décide » réserve à l'humain.
- Intention : « Synchronise tout avec github » — reconstruite : que ce poste et GitHub portent le même état, sans perdre le travail fait ici.
- Test rétro : le résultat livré sert la seconde moitié de l'intention (aucun travail local ne peut plus se perdre : sept sauvegardes vérifiées, et l'inventaire de ce qui n'existe qu'ici) ; il ne sert pas encore la première (sept dépôts restent divergents), qui attend D-1.

## 7. Risques

- L'écart grandit tant que les deux postes travaillent sans synchronisation ;
  - signal : à la prochaine ouverture, le relevé de fraîcheur affiche plus de 96 enregistrements de retard au pilot, ou de nouveaux numéros frappés au-delà de TF-1105 sur ce poste ;
  - parade : ne rien ingérer au registre de ce poste avant D-1 ; trancher D-1 avant toute nouvelle campagne.
- Des travaux de ce poste citent les trente-trois numéros qui seront renumérotés (synthèses du 15/09 et du 16/09, lots rendus aux produits) ;
  - signal : un lecteur cherche TF-1092 et trouve le sujet de l'autre poste ;
  - parade : `renumeroter.mjs` consigne le motif dans chaque item ; la table de correspondance sera écrite dans la synthèse de synchronisation.
- Une version locale meilleure que la version publiée est écartée par l'option (a) ;
  - signal : un défaut corrigé ici le 14/09 au soir reparaît dans un lot de retours ;
  - parade : les sauvegardes gardent le code local ; acceptation déclarée sinon.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, dans l'ordre d'exécution (les forges avant le pilot, parce que le registre du pilot cite leurs enregistrements ; la publication en dernier) ; puis l'action humaine qui les conditionne toutes.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Réaligner forge-audit, forge-tests, forge-organization, forge-design, forge-data et forge-agents sur leur version publiée, rejouer le seul travail local sans équivalent, jouer le banc de chaque forge (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 (a), ou (b) sous forme de fusion arbitrée ; à défaut, six forges restent divergentes | moyen × long |
| A-2 | Au pilot : renuméroter TF-1073 à TF-1105 de ce poste en TF-1170 à TF-1202 par `node todo\renumeroter.mjs`, réaligner sur la version publiée, reporter les items, synthèses et règles sans équivalent, régénérer les vues, jouer `oracle-todo` et les bancs du pilot (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 ; à défaut, le registre garde 33 numéros à double sens | moyen × long |
| A-3 | Publier les sept dépôts, porte des noms jouée par chaque hameçon de publication, puis rejouer le relevé de fraîcheur jusqu'à « poste prêt » (neuve) | auto_ia | `dependance_bloc_3` — attend A-1 et A-2 verts ; votre demande de synchronisation vaut feu vert de publication pour ce résultat ; à défaut, tout reste local | simple × court |
| A-4 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) » ou « D-1 (c) » ; l'exécution est faite par l'IA (neuve) | manuelle_utilisateur | `decision` — choisir laquelle de deux versions d'une même correction entre dans l'histoire publiée est un arbitrage réservé à l'humain ; sinon : les sept dépôts restent divergents et sauvegardés | simple × court |

## 9. Traces

- Sauvegardes : `c:\dev\_sauvegardes\<dépôt>-avant-synchronisation-20260919.bundle` et `…-HEAD.txt`, pour digit-ai-factory, digit-ai-forge-agents, digit-ai-forge-audit, digit-ai-forge-data, digit-ai-forge-design, digit-ai-forge-organization, digit-ai-forge-tests.
- Références comparées : pilot local `1514d3e4` / GitHub `eb90ae0c` (17/09 11:01) ; forge-agents `c81944e` / `1897ee8` ; forge-data `b24c90a` / `01980e1` ; forge-design `6c25710` / `6fb8d00` ; forge-audit `ae3dfd8` / `ff1549f` ; forge-tests `b3b0dd1` / `8bd2387` ; forge-organization `b92b971` / `487c6fc`.
- Outils existants repérés pour la suite : `scripts\rebatir-clone.mjs`, `todo\renumeroter.mjs`.
- Oracles : `oracle-synthese` sur ce fichier (verdict au journal homonyme).
- Aucune page HTML livrée dans ce tour.
