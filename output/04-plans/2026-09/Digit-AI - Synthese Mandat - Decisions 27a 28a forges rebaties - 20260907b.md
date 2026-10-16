---
destinataire: humain
---

# Synthèse de mandat — décisions 27 et 28 exécutées : les dix forges rebâties sur leur histoire publiée, le chantier des schémas reporté chez la forge des outils, les trois branches du pilot supprimées (07/09/2026)

Vos deux décisions sont exécutées et le poste est déclaré prêt par le contrôle d'ouverture : les dix forges montrent la même histoire que leur dépôt public, et la mesure a prouvé que neuf d'entre elles n'avaient rien de propre à ce poste, leurs anciens commits de pseudonymisation étant déjà absorbés par l'histoire publiée. Le chantier des schémas, seul travail vraiment local, est reporté chez la forge des outils en trois commits avec son numéro corrigé, et la copie installée du skill est réalignée. Ce qui change pour vous : tout run peut s'ouvrir, mais le report des schémas reste non publié parce que la porte de publication de la forge des outils est rouge sur son histoire publiée elle-même, pour la raison que l'autre session avait constatée le 6 septembre ; les anciennes histoires et le report sont mis à l'abri dans des paquets git hors dépôt. Ce qui est attendu de vous : décider comment publier ces trois commits, et si les dix branches de sauvegarde créées ce matin se suppriment maintenant que leurs paquets existent.

## 1. En-tête d'identification

- **quoi** — mandat humain « 27a, 28a » sur la synthèse 20260907a : reconstruction des dix clones de forges (D-27 a), suppression des trois branches locales du pilot (D-28 a).
- **sur quoi** — les dix forges (conception, design, développement, tests, outils, seo-geo, organisation, audit, ops, données) ; le pilot `digit-ai-factory` pour ses branches et cette synthèse.
- **quand** — fin le **07/09/2026 à 10:30 (UTC+02:00)**, ≈ 45 min depuis votre décision.
- **qui** — Claude Fable 5.1 (extension VS Code), sans agent subordonné ; pilot `fa122c5` avant, cette synthèse part dans le commit suivant ; forge des outils `db3d391` (publié) → `43ef9a3` (local, trois commits devant).

## 2. Verdict en une ligne

Contrôle de fraîcheur : « Poste prêt », dix forges à jour (0 devant / 0 derrière, étiquettes sans désaccord), forge des outils « en avance de 3 commits » ; porte de publication de la forge des outils FAIL (14 messages de commit, dont 12 dans la branche de sauvegarde et 2 dans l'histoire publiée) ; pilot : trois branches supprimées, `main` seule.

## 3. Décisions attendues

Les deux décisions viennent de la porte de publication de la forge des outils, rouge pour deux causes distinctes : l'histoire publiée elle-même, que l'autre session doit réécrire, et les branches de sauvegarde que la reconstruction vient de créer.

> **D-29 — Comment publier les trois commits du chantier des schémas reportés chez la forge des outils, alors que la porte de publication rend FAIL sur deux messages de l'histoire déjà publiée ?**
> Le report est fait et propre : deux commits rejoués sans conflit sur l'histoire publiée, un troisième qui corrige le numéro dans le texte du skill, copie installée réalignée. Mais le hook de publication rejoue la porte sur tout l'historique, et deux commits publiés en août portent dans leur message un nom que la table des pseudonymes de ce poste enregistre comme nom de produit ; c'est le faux positif de frontière que l'autre session a décrit dans sa synthèse du 6 septembre et confié à sa forge des outils, dont le commit reste local chez elle pour la même raison. Tant que cette histoire n'est pas réécrite, aucun push de cette forge ne passe le hook, ni le sien ni le mien.
> **Recommandation : (a).** Source consultée : sortie de la porte (`oracle-nom-client-publie`, règle C5, 14 constats, localisés par `git merge-base --is-ancestor` : 12 dans la sauvegarde, 2 dans `origin/main`) ; synthèse publiée du 06/09 (décision D-24 et action A-58 de l'autre session) ; le paquet `digit-ai-forge-agents-main-schemas-20260907.bundle` qui met le report à l'abri.
> Parce que la prochaine réécriture de cette forge est déjà décidée ailleurs et emportera mes trois commits de toute façon ; les rejouer une fois sur l'histoire réécrite coûte moins qu'une publication forcée aujourd'hui, et le paquet enlève le risque de perte.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** attendre la réécriture de la forge des outils par l'autre session, puis rejouer les trois commits depuis le paquet sur l'histoire réécrite, porte PASS, publication sur votre GO | simple × court, au moment venu | rien, sinon le délai ; le paquet protège l'intervalle |
| **(b)** publier maintenant en contournant le hook (`git push --no-verify`, contournement explicite prévu par le hook) | simple × court | exclut une porte verte : publie trois commits propres sur une histoire déjà rouge, que la réécriture suivante devra reprendre |
| **(c)** ne rien faire | rien | exclut toute publication ; le chantier reste sur ce poste et dans son paquet |

> **Si rien n'est décidé** : (c), les trois commits restent locaux, le paquet sur le disque.

> **D-30 — Supprime-t-on maintenant les dix branches de sauvegarde `sauvegarde/ancienne-histoire-20260907` créées ce matin dans les forges, puisque leurs paquets git existent hors dépôt ?**
> La reconstruction a posé dans chaque forge une branche locale qui conserve l'ancienne histoire, jamais poussée ; ces histoires portent des messages de commit avec des noms réels, et la porte de publication, qui balaie toutes les branches, les compte : douze des quatorze constats de la forge des outils viennent de là. Chaque ancienne histoire est désormais recopiée dans un paquet git sous le dossier de sauvegarde du 07/09, vérifiable par `git bundle verify`, avec un LISEZMOI qui dit comment restaurer. Supprimer une branche est un geste réservé à l'humain par les règles du projet, comme pour D-28.
> **Recommandation : (a).** Source consultée : `git branch --list` dans les dix forges ; dossier `c:\dev\_sauvegarde-reconstruction-20260907` (onze paquets, `git bundle verify` PASS sur le paquet des schémas) ; précédent de la sauvegarde du 03/09 faite en paquets, et votre décision D-28 (a) du matin sur la branche identique du pilot.
> Parce qu'une porte de publication ne peut pas être verte tant que ces branches existent, et que le paquet conserve exactement ce que la branche conservait.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** supprimer les dix branches par l'outil, puis rejouer la porte sur la forge des outils (attendu : seuls les deux commits publiés restent rouges) | simple × court | rien : les paquets restent sur le disque |
| **(b)** supprimer les neuf branches des forges qui n'ont rien à publier, garder celle de la forge des outils jusqu'à sa publication | simple × court | exclut une mesure nette de la porte sur la forge des outils |
| **(c)** garder les dix | rien | exclut toute porte verte sur ce poste tant qu'elles existent |

> **Si rien n'est décidé** : (c), les dix branches restent et la porte reste rouge partout.

## 4. Traité — avec sa preuve

- **Mesure préalable des dix forges, en lecture seule** : fichiers propres à ce poste (aucun dans les dix), fichiers modifiés dont la version locale est inconnue de l'histoire publiée (3 chez conception, 3 tests, 12 outils, 6 seo-geo, 9 organisation, 3 ops, 8 données, 0 design, 0 développement, 0 audit), puis pour chacun le compte de noms réels (tables de la racine) dans la version locale et dans la version publiée.
  - preuve : script `classer-fichiers.mjs` du scratchpad → sur les 32 fichiers hors forge des outils, 27 « distant gagne » (le local porte plus de noms réels) et 5 « égal » dont la différence, inspectée masquée, montre le pseudonyme au publié et la forme réelle en local ; conclusion : l'histoire publiée gagne sur tous ; les commits locaux `77ffbac` (tests), `7bc1e4f` (audit), `fc5ddce` (données) sont absorbés.
- **Neuf forges rebâties** (conception, design, développement, tests, seo-geo, organisation, audit, ops, données) : branche de sauvegarde posée, `main` remis sur `origin/main`, suivi de branche rétabli, étiquettes réalignées.
  - preuve : pour chacune, `git rev-list --left-right --count HEAD...origin/main` → `0/0`, désaccords d'étiquettes 0 (3, 4, 3, 17, 13, 14, 1, 1, 11 étiquettes mises à jour), arbre propre, `@{u}` = `origin/main` ; développement `describe` → `v1.17.0-8-g053fdaf` (avant : sans suivi, 2 commits de retard).
- **Forge des outils rebâtie et chantier des schémas reporté** : essai de report dans un arbre de travail jetable (aucun conflit sur 12 fichiers), puis report réel : `9e405c2` (ex `bec13c2`, TF-0789) et `d506679` (ex `24308f6`, TF-0791 devenu TF-0856), puis `43ef9a3` : TF-0791 → TF-0856 et TF-0792 → TF-0857 dans cinq fichiers du skill (11 lignes).
  - preuve : `git cherry-pick bec13c2 24308f6` → deux commits, `git status` propre ; `git grep -c 'TF-079[12]'` → 0 fichier après, `TF-085[67]` → 5 fichiers ; `git rev-list --left-right --count` → `3/0`.
- **Copie installée des skills réalignée** : `node sync-skills.mjs --sync --vers installation` → 10 fichiers recopiés ; `--diff` → « aligné en CONTENU », exit 0.
- **Porte de publication jouée sur la forge des outils** : FAIL, règle C5 (nom de produit interdit dans un message de commit), 14 constats.
  - preuve : `oracle-nom-client-publie` → `verdict FAIL` ; localisation par `git merge-base --is-ancestor` → 12 constats dans `sauvegarde/ancienne-histoire-20260907` seulement, 2 (`2f2460d8`, `b83ae1b8`, août) dans `origin/main` ; aucun dans les trois commits reportés.
- **Pilot, D-28 (a)** : `git branch -D` sur les trois branches → « Deleted branch » × 3 ; `git branch --list` → `* main`.
- **Sauvegardes hors dépôt** : onze paquets git dans `c:\dev\_sauvegarde-reconstruction-20260907` (dix anciennes histoires, un paquet de la branche `main` de la forge des outils avec les schémas) et un LISEZMOI.
  - preuve : `git bundle verify` du paquet des schémas → « The bundle uses this hash algorithm: sha1 » (valide) ; tailles listées, 0,2 à 16,5 Mo.
- **Fraîcheur du poste** : `node bootstrap.mjs --pull` → « Poste prêt — présent, à jour, skills alignés (1 avertissement non bloquant) » ; quatorze dépôts à jour, forge des outils « en avance de 3 commit(s) ».
- **Lot du produit 03 nettoyé sur disque** : la porte de publication du pilot, dans sa version réalignée ce matin (elle voit désormais les noms de produits), a refusé le push de cette synthèse sur deux lignes de l'index de la boîte d'entrée qui citaient le nom du lot déposé le 03/09 ; la règle du mode opératoire prescrit `anonymiser-suivis --fichiers` pour un lot reçu sous un nom interdit, avant toute ingestion : le nom du client est réécrit en pseudonyme dans le nom des deux fichiers et dans leur contenu, le lot reste non suivi, l'index régénéré rend le produit sous son pseudonyme.
  - preuve : `oracle-nom-client-publie` via le hook → « PUBLICATION REFUSÉE », C5 × 2 sur `input/00-retours/README.md` ; après nettoyage, `grep -c -i` du nom réel du client dans les deux fichiers → 0 et 0, index lignes 20-21 → `Produit-03 - RETOURS - 20260903a` ; push `fa122c5..76fb053` accepté par la porte ; `git rev-list --left-right --count` → `0 0`.

## 5. Non traité — avec son motif

- **La publication des trois commits de la forge des outils** : *bloqué par un garde-fou*, le hook de publication rejoue la porte, rouge sur l'histoire publiée elle-même (D-29).
- **La suppression des dix branches de sauvegarde des forges** : *dépendance à une décision humaine*, D-30 (R-29 — la règle du projet qui réserve toute suppression à l'humain).
- **La porte de publication sur les neuf autres forges** : *écarté* — aucune n'a rien à publier (0 devant), et la porte y serait rouge par les seules branches de sauvegarde tant que D-30 n'est pas prise ; critère de réouverture : un commit local dans l'une d'elles.
- **La mise à jour du registre du pilot avec les nouveaux identifiants des commits des schémas** (la clôture de TF-0856 cite `24308f6`, devenu `d506679`) : *hors mandat*, le registre n'était pas dans la décision ; l'ancien identifiant reste lisible dans le paquet de sauvegarde et dans cette synthèse (A-71).
- **Les actions A-64, A-65 et A-67 de la synthèse du matin** (lot du produit 03, sidecar du produit 01, candidature d'allocateur) : *hors mandat*, non décidées.
- **L'ingestion du lot du produit 03 du 03/09** : *hors mandat* ; le lot, nettoyé, reste sur disque sous son pseudonyme, non suivi, pour l'oracle de la boîte d'entrée (A-64).

## 6. Écarts à la lettre

| Vous avez décidé | Ce qui est fait | Pourquoi |
|---|---|---|
| D-27 (a) : « report en un commit » | Trois commits chez la forge des outils : deux rejoués avec leur message d'origine, un pour la renumérotation | Les messages d'origine portent la preuve du chantier (mesures avant/après) que le registre cite ; le troisième isole la seule retouche de ce jour |
| D-27 (a) : « publication de chaque forge sur votre GO » | Aucune publication : neuf forges n'ont rien à publier, la dixième est retenue par sa porte | La porte est rouge sur l'histoire publiée (D-29) ; un GO n'aurait rien changé sans contournement |
| D-27 (a) : « sauvegarde locale de l'ancienne histoire » | Une branche par forge ET un paquet git hors dépôt | La branche seule rend la porte rouge ; le paquet conserve la même chose sans être vu par la porte (D-30) |

## 7. Risques

- **Le chantier des schémas reste non publié dans une forge dont l'histoire va être réécrite par l'autre session** ; une reconstruction faite sans rejouer les trois commits les perdrait du clone.
  - signal : forge des outils « DIVERGÉ » au contrôle de fraîcheur ; exemple de référence installé sans jetons (`oracle-tokens` T1 à 239).
  - parade : le paquet `digit-ai-forge-agents-main-schemas-20260907.bundle` ; A-68 rejoue depuis le paquet.
- **La table des pseudonymes de ce poste enregistre un pseudonyme de client comme nom de produit**, d'où le faux positif de la porte sur deux commits publiés ; le même faux positif frappera toute forge dont un message cite ce pseudonyme.
  - signal : constat C5 sur un message qui ne contient qu'un pseudonyme.
  - parade : chantier de frontière C5 confié par l'autre session à sa forge des outils (A-58 du 06/09) ; à ce poste, ne pas éditer la table à la main.
- **Deux tables de pseudonymes vivent sur deux postes et s'étendent seules** ; un même produit peut recevoir deux pseudonymes différents.
  - signal : deux lots d'un même produit ingérés sous deux pseudonymes ; un pseudonyme au publié absent de la table locale.
  - parade : constat à porter au registre avec l'allocateur de numéros (A-67), même cause : un référentiel qui s'étend sans lire le distant.
- **Les dix branches de sauvegarde rendent toute porte rouge sur ce poste** tant qu'elles existent.
  - signal : constats C5 localisés dans `sauvegarde/…` par `git merge-base --is-ancestor`.
  - parade : D-30.

## 8. Prochaines actions

Ordre de traitement : d'abord ce qui met le chantier des schémas à l'abri de la prochaine réécriture (D-29), puis la porte (D-30), puis le registre et les restes du matin.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-68 | TF-0856, TF-0857 | Si D-29 (a) : à la prochaine ouverture où la forge des outils rend « DIVERGÉ », rebâtir son clone sur l'histoire réécrite, rejouer les trois commits depuis le paquet (`git fetch <paquet> main:schemas-20260907` puis `git cherry-pick`), jouer la porte (attendu PASS), publier sur votre GO. | `auto_ia` | `dependance_bloc_3` — D-29. | Le chantier des schémas n'est jamais publié ; la copie installée seule le porte. |
| A-69 | TF-0856, TF-0857 | Si D-29 (b) : `git push --no-verify origin main` dans la forge des outils, puis consigner le contournement dans le message de la prochaine synthèse. | `auto_ia` | `dependance_bloc_3` — D-29. | Même effet que A-68 non faite. |
| A-70 | `neuve` | Si D-30 (a) : `git branch -D sauvegarde/ancienne-histoire-20260907` dans les dix forges, puis rejouer la porte sur la forge des outils et constater les deux constats restants. | `auto_ia` | `dependance_bloc_3` — D-30 ; R-29. | Toute porte reste rouge sur ce poste ; la mesure de A-68 est brouillée. |
| A-71 | TF-0856 | Journaliser au registre du pilot, sur TF-0856, les nouveaux identifiants des commits reportés (`9e405c2`, `d506679`, `43ef9a3`) à la place de `24308f6`, puis régénérer les vues. | `auto_ia` | `hors_mandat` — le registre n'était pas dans D-27. | La clôture cite un commit qui n'existe plus que dans un paquet. |
| A-64 | `neuve` | Ingérer le lot du produit 03 du 03/09 par `node todo/ingerer-lot.mjs`, régénérer les vues, vérifier la règle B1 (lot jamais ingéré) verte. | `auto_ia` | `hors_mandat` — non décidée ce matin. | Un lot arrivé le 03/09 reste non pris ; la boîte d'entrée reste rouge. |
| A-65 | `neuve` | Ré-empreinter le sidecar (fichier compagnon du lot) du produit 01 du 27/08 par `node todo/reempreinter-lot.mjs`, vérifier la règle B2 (sidecar édité après ingestion) verte. | `auto_ia` | `hors_mandat` — non décidée ce matin. | Ce qui a été ajouté au lot après ingestion n'entre nulle part. |
| A-67 | `neuve` | Ouvrir au registre la candidature « référentiels qui s'étendent sans lire le distant » : allocateur de numéros et table des pseudonymes, une classe pour les deux. | `auto_ia` | `hors_mandat` — constat en passant, confirmé par le faux positif C5 du jour. | Collisions et doubles pseudonymes se rejouent à chaque journée à deux sessions. |

## 9. Fichiers écrits ou modifiés dans ce tour

- Forges : dix branches `sauvegarde/ancienne-histoire-20260907` ; `main` = `origin/main` dans neuf forges ; forge des outils `main` = `43ef9a3` (trois commits locaux) ; aucun fichier de forge modifié hors ces commits.
- Copie installée des skills : 10 fichiers recopiés depuis la forge des outils.
- Pilot : trois branches supprimées ; cette synthèse, README d'output, `output/LISEZMOI.md` ; index `input/00-retours/README.md` régénéré ; le lot du produit 03 renommé et réécrit sur disque (non suivi).
- Hors dépôt : `c:\dev\_sauvegarde-reconstruction-20260907` (onze paquets git, un LISEZMOI).
