---
destinataire: humain
---

# Synthèse de mandat — synchronisation avec GitHub : le clone du pilot rebâti sur l'histoire publiée, la session des 3 et 4 septembre reportée, deux numéros de registre réconciliés (07/09/2026)

Votre demande de synchronisation est exécutée pour le pilot : son dépôt public et votre poste montrent la même histoire, et tout ce que ce poste avait produit seul les 3 et 4 septembre y figure désormais, publié. La divergence venait d'une réécriture de l'histoire faite le 6 septembre par l'autre session, pour retirer les noms de produits ; ce poste vivait encore sur l'histoire d'avant. Deux numéros de registre frappés ici en doublon de l'autre session ont reçu un numéro neuf, motif consigné. Ce qui change pour vous : le pilot est à jour et vert à l'ouverture, mais les dix forges restent en divergence sur ce poste, et le travail sur les schémas vit encore uniquement dans la forge des outils de ce poste, non publié. Ce qui est attendu de vous : décider si je rebâtis les forges de la même façon, et si les trois branches locales devenues inutiles se suppriment.

## 1. En-tête d'identification

- **quoi** — mandat humain « Synchronise avec github » : réconciliation du clone du pilot avec son dépôt publié, après réécriture d'histoire par l'autre session (06/09) ; mesure en lecture seule des dix forges.
- **sur quoi** — le pilot `digit-ai-factory` (arbre et histoire) ; les forges mesurées, non modifiées.
- **quand** — fin le **07/09/2026 à 09:40 (UTC+02:00)**, ≈ 30 min depuis l'ouverture de la session (09:12).
- **qui** — Claude Fable 5.1 (extension VS Code), sans agent subordonné ; pilot en version `475c13c` (v1.17.30-233) avant, `f9b650b` après, publié ; cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

Pilot publié : `origin/main` = `f9b650b`, 0 commit devant / 0 derrière, porte de publication (oracle du nom de client) PASS, `oracle-todo` PASS, deux synthèses reportées PASS à `oracle-synthese`, bancs 52/52 (outillage du registre) et 52/52 (conformité projet), 42 étiquettes réalignées ; les dix forges restent divergées sur ce poste (mesurées, non touchées).

## 3. Décisions attendues

Deux décisions restent, toutes deux nées de ce que la synchronisation a mesuré sans pouvoir le faire : les dépôts frères ne s'écrivent pas sans mandat, et une branche ne se supprime pas sans geste humain.

> **D-27 — Rebâtit-on de la même façon les dix forges de ce poste, toutes divergées de leur dépôt publié depuis la réécriture d'histoire du 6 septembre, dont la forge des outils qui porte seule le chantier des schémas ?**
> Chaque forge de ce poste montre une histoire réécrite côté publié et une histoire ancienne côté local ; par contenu, huit forges n'ont rien de propre à ce poste, et trois portent des commits que le dépôt publié n'a pas : la forge des tests et la forge d'audit un commit de pseudonymisation du 02/09 chacune (probablement absorbé par la réécriture, à vérifier par différence d'arbres), la forge des données un commit de retours d'un produit du 13/08, et la forge des outils les deux commits du chantier des schémas (03 et 04/09, douze fichiers du skill de schémas, jetons de couleur et de police) que le registre déclare clos et que personne n'a publié. La forge de développement n'a rien de local : sa branche n'a plus de suivi et elle est en retard de deux commits. Tant que rien n'est fait, l'ouverture de toute session déclare le poste « non prêt » et la règle de fraîcheur bloque tout run.
> **Recommandation : (a).** Source consultée : mesure par identifiant de contenu de chaque forge (`git cherry` dans les deux sens, sujets absents du publié), sortie du contrôle de fraîcheur `bootstrap --pull` (10 défauts), précédent de la reconstruction du 03/09 par l'autre session (commit `8e818b9`, synthèse `20260903d`), décision D-7 (a) du 04/09.
> Parce que la méthode vient d'être jouée sur le pilot sans perte (delta isolé par contenu, sauvegarde locale, étiquettes réalignées), que le chantier des schémas n'existe que sur ce poste, et qu'une forge rebâtie sans report d'abord mesuré est la seule façon de perdre ce travail.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** mandat sur les dix forges : pour chacune, sauvegarde locale de l'ancienne histoire, clone rebâti sur l'histoire publiée, étiquettes réalignées, report en un commit de ce que la différence d'arbres montre comme propre au poste (dont les douze fichiers des schémas chez la forge des outils, avec le texte du skill corrigé au numéro TF-0856), porte de publication rejouée ; publication de chaque forge sur votre GO | moyen × moyen | rien |
| **(b)** seulement la forge des outils (report des schémas) et la forge de développement (suivi de branche rétabli, avance rapide) ; les huit autres plus tard | simple × court | exclut un poste prêt : huit forges restent divergées et tout run reste bloqué par la règle de fraîcheur |
| **(c)** ne rien faire | rien | exclut tout run sur ce poste ; le chantier des schémas reste sur un seul disque |

> **Si rien n'est décidé** : (c), le poste reste « non prêt » et les schémas ne sont publiés nulle part.

> **D-28 — Supprime-t-on les trois branches locales du pilot devenues inutiles : la sauvegarde de l'ancienne histoire faite ce matin, et deux branches de correction des squelettes de documents datées du 23/08 ?**
> La sauvegarde `sauvegarde/ancienne-histoire-20260907` conserve l'histoire d'avant réécriture, jamais poussée ; elle n'a plus d'objet dès que la publication de ce matin est jugée bonne. Les deux branches `fix/squelettes-coupure-mots` et `fix/squelettes-sommaire` reposent sur l'ancienne histoire et leurs commits propres ont chacun un équivalent par contenu dans l'histoire publiée : rien n'y vit qui ne soit déjà publié. Supprimer une branche est un geste réservé à l'humain par les règles du projet, c'est pourquoi la question vous revient.
> **Recommandation : (a).** Source consultée : `git cherry origin/main <branche>` sur les trois branches (11 commits sans équivalent sur chacune des deux branches de correction, tous des commits d'histoire réécrite dont le sujet est présent dans le publié ; les deux commits de correction eux-mêmes ont leur équivalent), `git branch --list`.
> Parce qu'une branche fondée sur une histoire abandonnée trompe le prochain contrôle de fraîcheur, et que tout ce qu'elles portent est déjà publié.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** supprimer les trois branches par l'outil, après relecture de la mesure ci-dessus | simple × court | rien : l'ancienne histoire reste dans le paquet de sauvegarde du 03/09 sur le disque |
| **(b)** supprimer seulement les deux branches de correction, garder la sauvegarde une semaine | simple × court | exclut un dépôt propre tout de suite ; la sauvegarde reste à supprimer plus tard |
| **(c)** garder les trois | rien | exclut un dépôt lisible : trois branches mortes à côté de `main` |

> **Si rien n'est décidé** : (c), les trois branches restent.

## 4. Traité — avec sa preuve

- **Mesure de la divergence avant tout geste** : 363 commits locaux contre 394 publiés par identifiant de commit ; par contenu (`git cherry`), 338 commits équivalents, 15 commits au même sujet dont seule la pseudonymisation change, et un vrai delta local limité à six commits des 03 et 04/09 ; diff des deux pointes : 2 fichiers propres à ce poste (deux synthèses), 246 fichiers propres au publié, 51 fichiers modifiés dont 41 ont leur version locale retrouvée dans l'histoire publiée (`git log --find-object`) et 10 sont exactement les fichiers réécrits par la pseudonymisation.
  - preuve : `git rev-list --left-right --count HEAD...origin/main` → `363 394` ; `git cherry origin/main HEAD` → 21 `+`, 338 `-` ; `git diff --name-status origin/main HEAD` → 2 A, 246 D, 51 M.
- **Delta local isolé et mis à l'abri** : cinq événements de registre (créations TF-0791 et TF-0792, trois mises à jour de TF-0791), cinq relevés d'héritage (un commité le 04/09, quatre non commités du 07/09), deux synthèses (03/09 d, 04/09 a), copiés dans le scratchpad avec l'identifiant de la pointe d'avant.
  - preuve : `git diff origin/main HEAD -- todo/TODO.jsonl` → 5 lignes `+` ; `git diff origin/main -- todo/HERITAGE-RELEVES.jsonl` → 5 lignes `+`.
- **Renumérotation par l'outil, sur copie, avant tout report** : TF-0791 → TF-0856 (4 lignes réécrites) et TF-0792 → TF-0857 (1 ligne), motif de collision consigné dans le champ source de chaque création, premiers numéros libres au publié (dont le registre atteint TF-0855).
  - preuve : `node todo/renumeroter.mjs … --registre <copie>` → `verdict_avant PASS, verdict_apres PASS` deux fois ; classe de défaut : collision de numéros entre deux sessions (TF-0481).
- **Clone rebâti sur l'histoire publiée** : branche `sauvegarde/ancienne-histoire-20260907` posée sur `475c13c` (jamais poussée), `main` remis sur `origin/main` (`8c7030e`), 42 étiquettes réalignées (40 mises à jour, 0 désaccord après contrôle une à une contre le distant), `git describe` → `v1.17.30-264-g8c7030e`.
  - preuve : `git fetch --tags --force` → 40 ; boucle de comparaison des étiquettes → « tags checked », aucune ligne MISMATCH.
- **Delta reporté** : cinq événements ajoutés au registre publié, cinq relevés au journal d'héritage, la synthèse du 03/09 réindicée `d` → `g` (l'indice `d` du 03/09 était pris par la synthèse de synchronisation de l'autre session ; les indices `e` et `f` aussi), numéros réécrits dans les deux synthèses, chacune close par une section d'annotation datée qui dit ce qui a changé et pourquoi.
  - preuve : `oracle-todo` → PASS ; `oracle-synthese` → PASS sur `…20260903g.md` et `…20260904a.md` (S1 à S6 vertes, 8 blocs présents).
- **Vues et index régénérés** : registre 76 actifs (sceau `d62b89cddf54`) dans `TODO.md`, la vue web du registre (régénérée à l'identique par son générateur, aucune page conçue dans ce tour) et `AVANCEMENT.md` (40 ouverts, 36 clos) ; README d'input et d'output ; index `LISEZMOI.md`.
  - preuve : `readme-dossiers --check` → PASS ; `generer-lisezmoi-output --verifier` → PASS, 226 livrables de 7 familles.
- **Bancs de recette rejoués sur l'arbre reconstruit** : outillage du registre et conformité projet.
  - preuve : `node todo/self-test.mjs` → 52 PASS, 0 FAIL ; `node oracles/self-test.mjs` → 52 PASS, 0 FAIL.
- **Commit de reconstruction et publication** : `f9b650b`, douze fichiers, message qui dit la méthode et la sauvegarde ; push accepté par la porte de publication ; le distant et le local coïncident.
  - preuve : hook `pre-push` (oracle du nom de client) → exit 0 ; `git push origin main` → `8c7030e..f9b650b` ; `git ls-remote origin refs/heads/main` → `f9b650b` ; `git rev-list --left-right --count HEAD...origin/main` → `0 0`.
- **Fraîcheur du pilot** : le contrôle d'ouverture rend le pilot à jour.
  - preuve : `node bootstrap.mjs --pull` → `[ok] digit-ai-factory (pilot) — présent, à jour`.
- **Mesure des dix forges, en lecture seule** : pour chacune, commits sans équivalent par contenu, puis sujets absents du publié.
  - preuve : conception 0 commit propre (12 devant / 19 derrière), design 0 (34/38), développement 0 (0/2, sans suivi de branche), tests 1 (`77ffbac`, TF-0764), outils 2 (`bec13c2` TF-0789, `24308f6` TF-0791 devenu TF-0856), seo-geo 0 (49/49), organisation 0 (31/31), audit 1 (`7bc1e4f`, TF-0764), ops 0 (5/5), données 1 (`fc5ddce`, 13/08).

## 5. Non traité — avec son motif

- **La reconstruction des dix forges** : *garde-fou*, aucune écriture dans les dépôts frères hors mandat humain ; mesurées seulement (D-27).
- **La correction du texte du skill de schémas chez la forge des outils (numéro TF-0791 à remplacer par TF-0856) et la publication de ses deux commits** : *garde-fou*, dépôt frère ; portée par D-27 (a) ou (b). Le message du commit `24308f6` garde l'ancien numéro, comme D-7 (a) le prévoyait.
- **L'ingestion du lot du produit 03 déposé le 03/09**, seul lot jamais ingéré de la boîte d'entrée (règle B1 (lot jamais ingéré par le registre, selon l'oracle de la boîte d'entrée), rouge) : *hors mandat*, la synchronisation ne comprend pas l'ingestion ; elle est désormais possible proprement puisque le registre publié est celui de ce poste (A-64). Son nom de fichier porte un nom interdit ; l'anonymiseur câblé à l'ingestion le nettoie, c'est pourquoi le lot est resté non suivi.
- **Le sidecar (fichier compagnon lisible par la machine d'un lot de retours) du produit 01 du 27/08, édité après son ingestion** (règle B2 (sidecar édité après son ingestion, selon le même oracle), rouge) : *hors mandat*, état hérité de l'histoire publiée, non causé par ce poste (A-65).
- **Les trois branches locales** : *dépendance à une décision humaine*, D-28 (R-29 — la règle du projet qui réserve toute suppression à l'humain).
- **Le README de la boîte d'entrée et le relevé d'héritage non commités à l'ouverture** : *écarté* — les README se régénèrent par hook et l'ont été ; les quatre relevés ont été reportés dans le commit. Critère de réouverture : un relevé du 07/09 absent du journal publié.

## 6. Écarts à la lettre

| Vous avez décidé | Ce qui est fait | Pourquoi |
|---|---|---|
| « Synchronise avec github » | Le pilot est synchronisé et publié ; les forges sont mesurées, pas synchronisées | Les dépôts frères ne s'écrivent pas hors mandat humain explicite ; la mesure est faite pour que la décision se prenne sur des faits (D-27) |
| D-7 (a) du 04/09 : « rebaser mes quatre commits » | Un seul commit de reconstruction reporte le delta | Six commits touchaient presque uniquement des vues générées, en conflit à chaque replay ; le précédent du 03/09 (autre session) a reporté sa session de la même manière, en un commit, et l'ancienne histoire reste lisible dans la branche de sauvegarde |
| D-7 (a) : « TF-0791 → TF-0803, TF-0792 → TF-0804 » | TF-0856 et TF-0857 | Les numéros 0803 et 0804 étaient libres le 04/09 ; le 07/09, le registre publié atteint TF-0855 ; l'outil refuse un numéro déjà pris |
| D-7 (a) parlait du push « sur GO » | Poussé dans ce tour | Votre demande de synchronisation vaut GO de publication pour le pilot ; rien d'autre n'a été poussé (ni la sauvegarde, ni les forges) |

## 7. Risques

- **Le chantier des schémas n'existe que sur ce poste, dans une forge divergée** ; une reconstruction de la forge des outils faite sans report le perdrait, alors que le registre publié le déclare clos.
  - signal : la forge des outils rebâtie sans que `24308f6` et `bec13c2` aient été reportés ; `oracle-tokens` T1 qui remonte à 239 sur l'exemple de référence installé.
  - parade : D-27 (a) ou (b) avec report mesuré par différence d'arbres ; en attendant, ne rien exécuter dans ce dépôt.
- **Deux sessions du pilot sur deux postes continuent de frapper des numéros en parallèle** ; la collision se reproduira à la prochaine journée à deux sessions.
  - signal : `git fetch` qui rend le pilot divergé ; deux créations sous un même numéro dans les deux registres.
  - parade : publier en fin de chaque tour (fait ce matin) ; l'allocateur qui lit le distant avant de frapper reste une candidature à ouvrir, comme la synthèse du 04/09 le disait déjà.
- **Le poste reste « non prêt » tant que les forges divergent** ; tout run lancé d'ici là s'arrête à la règle de fraîcheur.
  - signal : `bootstrap --pull` → « Poste NON prêt — 10 défaut(s) ».
  - parade : D-27.
- **Les deux synthèses reportées portent une section d'annotation en plus des huit blocs** ; un lecteur pourrait y voir une réécriture.
  - signal : une relecture qui compare avec la version du 04/09 sur l'ancienne histoire.
  - parade : l'annotation est datée, nomme ce qui a changé (numéros, indice) et l'outil qui l'a fait ; le contenu des huit blocs est intact et l'oracle le confirme PASS.

## 8. Prochaines actions

Ordre de traitement : d'abord ce qui rend le poste prêt et met le chantier des schémas à l'abri (D-27), puis la boîte d'entrée, puis le ménage des branches (D-28). Le tableau se lit ligne par ligne, dans l'ordre.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-62 | TF-0856, TF-0857 | Si D-27 (a) ou (b) : rebâtir le clone de la forge des outils sur son histoire publiée (sauvegarde locale, étiquettes), reporter les douze fichiers des schémas en un commit, corriger le numéro dans le texte du skill de schémas, rejouer sa porte de publication ; publier sur votre GO. | `auto_ia` | `dependance_bloc_3` — D-27. | Le chantier des schémas reste sur un seul disque ; le registre publié déclare clos un travail que personne ne peut installer. |
| A-63 | `neuve` | Si D-27 (a) : même méthode sur les neuf autres forges ; pour la forge de développement, rétablir le suivi de branche et avancer de deux commits ; pour les forges des tests, d'audit et des données, mesurer par différence d'arbres si leur commit propre est absorbé avant de le reporter. | `auto_ia` | `dependance_bloc_3` — D-27. | Le poste reste « non prêt » ; aucun run ne peut s'ouvrir. |
| A-64 | `neuve` | Ingérer le lot du produit 03 du 03/09 par `node todo/ingerer-lot.mjs` (l'anonymiseur câblé nettoie le nom interdit à l'entrée), régénérer les vues, vérifier B1 vert à `oracle-boite-entree`. | `auto_ia` | `hors_mandat` — la synchronisation ne comprend pas l'ingestion ; sans risque de collision maintenant que le registre est publié. | Un lot de retours arrivé le 03/09 reste non pris ; la boîte d'entrée reste rouge. |
| A-65 | `neuve` | Ré-empreinter le sidecar (fichier compagnon du lot) du produit 01 du 27/08 par `node todo/reempreinter-lot.mjs`, avec le motif de l'édition retrouvé dans l'histoire publiée, puis vérifier B2 vert. | `auto_ia` | `hors_mandat` — état hérité du publié, pas de ce tour. | Ce qui a été ajouté au lot après son ingestion n'entre nulle part. |
| A-66 | `neuve` | Si D-28 (a) : `git branch -D` sur `sauvegarde/ancienne-histoire-20260907`, `fix/squelettes-coupure-mots` et `fix/squelettes-sommaire` chez le pilot, puis `git branch --list` pour constater. | `auto_ia` | `dependance_bloc_3` — D-28 ; R-29. | Trois branches mortes restent à côté de `main` et trompent le prochain contrôle. |
| A-67 | `neuve` | Ouvrir la candidature « allocateur de numéros qui lit le distant avant de frapper » au registre, avec la classe de collision entre sessions, pour qu'elle soit décidée avec les autres. | `auto_ia` | `hors_mandat` — constat en passant, déjà nommé le 04/09 sans candidature. | La collision se rejoue à la prochaine journée à deux sessions. |

## 9. Fichiers écrits ou modifiés dans ce tour

- `todo/TODO.jsonl` (5 événements sous TF-0856 et TF-0857), `todo/HERITAGE-RELEVES.jsonl` (5 relevés), `todo/TODO.md`, la vue web du registre, `todo/AVANCEMENT.md`.
- `output/04-plans/… - Decisions 1a 2a 3a 4a - 20260903g.md` (réindicée, renumérotée, annotée), `output/04-plans/… - Decision 5a jetons digit-ai-schemas - 20260904a.md` (renumérotée, annotée), README d'input et d'output, `output/LISEZMOI.md`.
- Git : branche locale `sauvegarde/ancienne-histoire-20260907` ; `main` = `f9b650b`, publié ; 42 étiquettes réalignées. Aucun fichier touché dans les dépôts frères.
- Sur disque, non suivi : le lot du produit 03 du 03/09 (deux fichiers), pour `oracle-boite-entree`.
