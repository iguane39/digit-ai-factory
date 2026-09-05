---
destinataire: humain
---

# Synthèse de mandat — « Fais tous les A » : le poste est propre, le produit 02 est rectifié, les quatre forges ont reçu leur descente (05/09/2026)

Votre mandat couvrait toutes les actions restantes de la dernière synthèse. Elles sont faites, sauf deux qui ne pouvaient pas l'être ici : l'une vit sur votre autre poste, l'autre dépendait d'une décision que vous n'avez pas prise et dont l'option par défaut tient. Concrètement : le poste ne porte plus aucun reste à sa racine, le contrôle des compétences installées est vert, le journal du produit 02 est rectifié et ses deux contrôles savent échouer, et chacune des quatre forges concernées a dans sa boîte d'entrée un lot jugé conforme qui lui confie ses chantiers. Un fait à connaître : une session vivante du produit 02 a écrit dans son journal quatre-vingt-dix secondes après le pilot, depuis la même queue, et le journal porte à nouveau deux numéros identiques — la classe même que ce mandat venait de rectifier, reproduite sous nos yeux ; le pilot a cessé d'y écrire, et la rectification appartient au produit. Ce qui change pour vous : plus rien n'attend le pilot ; ce qui reste attend une session chez chaque forge et chez le produit, que seul vous ouvrez. Ce qui est attendu de vous : ouvrir ces sessions quand vous le voudrez, et commettre chez le produit ce que le pilot y a déposé sans jamais l'enregistrer.

## 1. En-tête d'identification

- **quoi** — mandat humain « Fais tous les A » sur la synthèse 20260905d : remède des compétences installées (A-1), descente aux forges (A-13, A-18), rectification et contrôles du produit 02 (A-14, A-16), restes de la racine du parc (A-7) ; A-6 et A-17 déclarés non exécutables ici.
- **sur quoi** — le pilot `digit-ai-factory` (registre, classes, vues) ; les dépôts frères forge-design, forge-development, forge-conception, forge-tests (dépôt d'un lot dans leur boîte d'entrée, sur mandat, sans commit) ; le produit 02 (journal et deux contrôles, sur mandat, sans commit) ; la racine du parc et les compétences installées du poste.
- **quand** — fin le **05/09/2026 à 10:20 (UTC+02:00)**, durée ≈ 1 h 10 depuis votre mandat.
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `d0357dc` après publication (le commit suivant porte cette synthèse), base `168e9a7` avant.

## 2. Verdict en une ligne

7 actions sur 9 exécutées et prouvées (A-1, A-7, A-13, A-14, A-16, A-18 faites ; A-17 sans objet, A-6 hors de portée) : oracle des compétences **PASS**, R-42 (l'intégrité du journal de run) du produit 02 **PASS** à 10:03 puis **FAIL** à 10:15 sur une nouvelle collision écrite par la session vivante du produit (seq 76 et 77 restent rectifiés), ses deux contrôles CI5 (chaque contrôle possède un chemin d'échec) **PASS** avec recettes 3/3 et 4/4, quatre lots de descente **PASS** aux oracles de forme, racine du parc sans reste ; pilot publié `d0357dc`.

## 3. Décisions attendues

Rien de neuf n'attend de décision. La décision D-7 (nom du dépôt de file de tickets, synthèse 20260905c) reste ouverte ; son option par défaut, l'exception nommée, est en place et suffit.

## 4. Traité — avec sa preuve

- **A-1 — le contrôle des compétences installées est vert** — classe : une copie installée qui diverge de sa source ; contrôle rouge → vert : K2 (la copie installée d'une compétence est identique à sa source) FAIL (un fichier en trop dans la copie, une fixture portant un nom de produit) → K2 PASS. L'orphelin est parti en quarantaine datée, pas effacé.
  - preuve : `oracles\oracle-skills.mjs --purger` puis verdict PASS ; le banc du pilot n'a plus de défaut.
- **A-7 — les trois restes de la racine du parc sont traités** : le fichier « null » lu avant suppression (une page HTML capturée, aucun jeton ni cookie, une seule occurrence du mot « token » dans le nom d'une feuille de style), puis supprimé ; le lien symbolique brisé supprimé ; la seconde copie du pilot mise en paquet git avec ses deux branches, son stash et ses modifications non commises, vérifiée, puis supprimée.
  - preuve : recherche de jeton dans « null » : 0 en-tête d'authentification ; `git bundle verify` : « is okay » (40 603 826 octets), deux fichiers de rustines (39 lignes chacun) à côté ; `ls` : les trois chemins n'existent plus.
- **A-14 — le journal du produit 02 est rectifié** en forme lisible par le contrôle — classe : un remède prescrit en prose qu'aucun contrôle ne lit ; contrôle rouge → vert : R-42 FAIL (deux seq 76, deux seq 77) → R-42 PASS « intégrité tenue sur 120 entrées, deux seq [RECTIFIÉ] » mesuré à 10:03. Une ligne ajoutée (seq 118), aucune réécrite, le mandat cité dans l'entrée. **Puis, à 10:04, une session vivante du produit a écrit sa propre seq 118** depuis la même queue, quatre-vingt-dix secondes après la mienne, et a commis les deux : la classe même que TF-0794 décrit (deux sessions, même queue, pas de verrou), reproduite sur pièce. R-42 est donc repassé FAIL sur ce seul écart (« seq 118 là où 119 était attendu »), les seq 76 et 77 restant [RECTIFIÉ]. Le pilot n'écrit plus dans ce journal tant qu'une session y vit : la rectification de la seq 118 est un geste du produit (bloc 8).
  - preuve : `oracle-conformite-projet` sur le produit à 10:03 : R-42 PASS ; à 10:15 : R-42 FAIL sur la seq 118, deux [RECTIFIÉ] ; `git log` du produit : commit `fe4a6d0` à 10:04 « ledger seq 118 » portant les deux entrées.
- **A-16 — les deux contrôles statistiques du produit 02 savent échouer** — classe : un contrôle déclaré sans chemin d'échec (être déclaré n'est pas être rendu) ; contrôle rouge → vert : CI5 FAIL (deux contrôles nommés) → CI5 PASS. Chacun porte trois sorties écrites : 0 (identités tenues), 1 (verdict : couverture des réservations tracées < 80 % ; identité K = L + M < 95 % ou K/L = 1,10 < 90 %), 2 (mesure impossible déclarée par le contrôle lui-même : données absentes, message explicite, plus de trace brute) ; les seuils sont posés avec marge sur les valeurs réelles (92,2 % ; 99,9 % ; 100 %). Les recettes prouvent les trois sens, dont un verdict sur un classeur fabriqué où K ≠ L + M.
  - preuve : `build\tests\test_check-ecarts.mjs` 3/3 et `test_check-ht-ttc.mjs` 4/4 « double sens prouvé » ; oracle des contrôles injoignables sur le produit : CI5 PASS (CI2 (aucun chemin d'outil externe codé en dur) et CI4 (chaque contrôle est exercé par une recette) restent FAIL, préexistants, hors de ce mandat) ; quatre fichiers modifiés, non commis.
- **A-13 — trois lots de travaux déposés** (verdict de forme PASS ×3) chez forge-design (TF-0796, TF-0797, TF-0800), forge-development (TF-0798) et forge-conception (TF-0799, TF-0804), chacun avec le constat, la demande, l'effort, le moyen de vérification, ce que le pilot a déjà réalisé, ce qu'il ne demande pas et l'ordre justifié ; la boîte d'entrée de forge-conception créée selon la convention transverse.
  - preuve : `gabarits\oracle-travaux-pilot.mjs` sur les trois lots : T1 (moyen de vérification par élément) à T5 (l'ordre recommandé porte son motif) PASS (un refus T2 (référence au registre par élément) au premier passage, section renommée) ; `git status` des trois forges : un fichier non suivi chacune, aucun commit.
- **A-18 — la candidature du contrôle générique de la 404 versée chez forge-tests** : entrée au registre du pilot (TF-0803, candidat), lot de retours déposé dans la boîte d'entrée de forge-tests (créée), avec sidecar et classe.
  - preuve : `gabarits\oracle-lot-retours.mjs` : PASS (deux refus au premier passage, R-45 (remarques restées au produit, verdict par remarque) et R-46 (retours rattachés à leur gabarit), formules exactes posées) ; `journaliser` PASS.
- **Deux classes de défaut créées au référentiel** : « surface implicite non livrée » (fondée par TF-0802) et « garde lexicale à frontière ASCII » (fondée par TF-0799 et TF-0805) ; TF-0804 (404 dans la surface implicite, forge-conception) décidée sur votre mandat ; TF-0805 (même défaut de garde chez le pilot, engagement pris dans le lot de conception) en candidat.
  - preuve : `todo\CLASSES.json` (deux entrées datées, sourcées) ; `oracle-todo` PASS après chaque écriture (une écriture refusée pour classe hors référentiel, corrigée avant d'insister) ; vues régénérées (23 actifs).
- **Publication du pilot** en avance rapide.
  - preuve : `git push` → `168e9a7..b08318b main -> main` ; porte de publication PASS au commit précédent, rejouée au suivant.

## 5. Non traité — avec son motif

- **A-6 (l'autre poste)** : *impossible à prouver ici* — ce poste n'atteint pas l'autre ; la commande reste la même (`git pull --ff-only` puis `git fetch --tags --force`).
- **A-17 (renommer le dépôt de file de tickets)** : *dépendance à une décision humaine* — D-7 non tranchée ; l'exception nommée tient par défaut.
- **Les commits chez les forges et chez le produit** : *garde-fou* — déposer dans une boîte d'entrée est réversible, entrer dans un historique est un geste dont le dépôt est seul auteur (mandat du 23/08, doctrine du canal) ; chaque dépôt commet sur sa session.
- **L'instruction des chantiers chez les forges** : *chez la forge* — les lots décrivent et argumentent, ils ne commandent rien ; la forge juge sur son run.
- **CI2 et CI4 du produit 02** (chemins d'outil en dur, un contrôle sans recette) : *chez le produit* — préexistants, hors des actions A.
- **TF-0805** : *tout entre en candidat* — l'engagement du pilot est au registre, à décider.

## 6. Écarts à la lettre

- Vous avez demandé « tous les A » → deux ne sont pas exécutés, et c'est dit plutôt que simulé → parce que l'un exige un accès que ce poste n'a pas, l'autre une décision que vous n'avez pas prise.
- A-13 disait « mandater un run » → j'ai déposé chez chaque forge un lot de travaux jugé conforme, sans ouvrir de run → parce que l'outil d'émission du pilot ne connaît que les produits, et qu'un run chez une forge s'ouvre sur votre session, pas depuis le pilot.
- A-7 disait « décider du sort » des trois restes → ils ont été supprimés, après lecture et sauvegarde → parce que votre mandat vaut décision, et que la sauvegarde rend le geste réversible.
- A-16 ne fixait aucun seuil → deux seuils de verdict ont été posés chez le produit (couverture 80 %, identités 95 % et 90 %) → parce qu'un chemin d'échec sans condition n'échoue jamais ; les seuils sont en tête de chaque contrôle, avec la mesure réelle qui les fonde, et le produit reste libre de les changer.
- Rien ne demandait de créer des classes → deux classes sont entrées au référentiel → parce que l'écrivain du registre refuse une clé hors référentiel, et qu'une classe se crée chez le pilot, jamais dans un sidecar.

## 7. Risques

- **Un lot déposé qu'aucune session ne lit** : les quatre boîtes d'entrée attendent une ouverture.
  - signal : le lot toujours en statut `a_traiter` au prochain relevé du pilot.
  - parade : le relevé d'ouverture du pilot voit les boîtes des forges ; les gestes sont au bloc 8.
- **Les modifications non commises chez le produit 02** peuvent être perdues par un nettoyage.
  - signal : `git status` propre chez le produit alors que CI5 repasse au rouge.
  - parade : le geste de commit est au bloc 8, une ligne ; les chemins d'échec sont aussi décrits dans cette synthèse.
- **Deux sessions écrivent dans le même journal de produit** — le pilot sur mandat, la session du produit sur son run — et la collision s'est produite dans la minute.
  - signal : deux seq identiques à quatre-vingt-dix secondes d'écart, R-42 FAIL sur le dernier seq.
  - parade : le pilot n'écrit plus dans un journal où une session vit ; le contrat §3 dit de relire la queue immédiatement avant l'append ; l'attribution sous verrou est au backlog de la forge des outils (A-15, synthèse 20260905a).
- **Les seuils posés chez le produit** rougissent un jour sur une baisse légitime de la couverture.
  - signal : `check-ecarts.py` exit 1 avec une couverture entre 70 et 80 %.
  - parade : le seuil est une constante nommée en tête du fichier, avec sa mesure fondatrice ; le produit l'ajuste et le dit.

## 8. Prochaines actions

Ordre de traitement : d'abord le commit chez le produit, parce qu'il protège un travail déjà prouvé ; puis les sessions chez les forges, dans l'ordre de votre tri (design, développement, conception, tests) ; les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-25 | TF-0794 | Depuis la session vivante du produit 02 : ajouter à `forge\ledger.jsonl` une entrée `rectification_horodatage` avec `entrees: [{seq: 118, cause: "deux sessions, même queue (117), seq attribué sans verrou"}]` — une ligne, aucune réécriture —, puis rejouer `node <PILOT_ROOT>\oracles\oracle-conformite-projet.mjs .` jusqu'à R-42 PASS. | `manuelle_utilisateur` | `decision` — le pilot n'écrit plus dans un journal où une session vit (c'est cette écriture concurrente qui vient de produire la collision), et c'est au produit de dire quelle entrée porte quoi ; trace mesurée : R-42 FAIL « seq 118 là où 119 était attendu », commit `fe4a6d0` du produit à 10:04 portant les deux seq 118. | Le produit garde un R-42 rouge, et la prochaine session repart d'une queue ambiguë. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre `build\stats\check-ecarts.py`, `build\stats\check-ht-ttc.py` et leurs deux recettes (déposés par le pilot, non commis ; le journal, lui, a été commis par la session du produit à 10:04). | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont le produit est seul auteur (mandat du 23/08) ; trace mesurée : `git status` du produit, quatre fichiers modifiés. | Un nettoyage du dépôt efface les chemins d'échec prouvés. |
| A-20 | TF-0796, TF-0797, TF-0800 | Ouvrir une session chez forge-design : elle trouve `input\00-travaux\pilot - TRAVAUX - 20260905a.md`, joue l'oracle de forme cité en tête, instruit les trois travaux et remet son lot de retours au pilot. | `manuelle_utilisateur` | `acces` — une session chez une forge s'ouvre sur votre poste, pas depuis le pilot ; trace mesurée : le lot est déposé, non suivi, verdict T1-T5 PASS. | Trois défauts de rendu se reproduisent aux prochains runs de produits. |
| A-21 | TF-0798 | Ouvrir une session chez forge-development : même geste sur son lot (statiques versionnés dès le gabarit, contrôle de MEP). | `manuelle_utilisateur` | `acces` — même raison ; trace mesurée : lot déposé, T1-T5 PASS. | Chaque MEP d'un produit neuf peut livrer une page cassée à l'écran sans qu'aucun contrôle le voie. |
| A-22 | TF-0799, TF-0804 | Ouvrir une session chez forge-conception : même geste sur son lot (frontières Unicode des gardes, 404 dans la surface implicite). | `manuelle_utilisateur` | `acces` — même raison ; trace mesurée : lot déposé, boîte créée, T1-T5 PASS. | Les référentiels d'exigences en français paient des refus faux ; la 404 reste hors de la surface proposée. |
| A-23 | TF-0803 | Ouvrir une session chez forge-tests : elle trouve `input\00-retours\digit-ai-factory - RETOURS - 20260905a.md` et son sidecar (le fichier de candidatures qui accompagne le lot), ingère la candidature du contrôle générique de la 404 et la décide chez elle. | `manuelle_utilisateur` | `acces` — même raison ; trace mesurée : lot déposé, R-45/R-46 PASS. | Chaque produit réécrit son contrôle de 404, ou ne peut pas prouver M-9. |
| A-24 | TF-0805 | Décider la candidature du pilot sur ses propres gardes lexicales (frontières Unicode dans `oracle-synthese`), puis l'instruire avec fixture double sens. | `auto_ia` | `gate_gouvernance` — tout entre en candidat, décision humaine. | S21 continue de ne jamais atteindre un motif accentué, et l'engagement pris envers forge-conception reste lettre morte. |
| A-6 | `neuve` (reprise de la synthèse 20260903d) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot, puis vérifier que la garde d'ouverture rend « à jour ». | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée, ou forcée par-dessus les enregistrements récents. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7 (synthèse 20260905c), non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Pilot : commits `b08318b` (classe « surface implicite non livrée », TF-0803, TF-0804) et `d0357dc` (classe « garde lexicale », TF-0805), poussés ; cette synthèse part dans le commit suivant ; `todo\CLASSES.json` · `todo\TODO.jsonl` · vues `todo\TODO.md`, `todo\AVANCEMENT.md`.
- Poste : `c:\dev\_sauvegardes\archive-digit-ai-forge-steering_old-20260905.bundle` (+ deux rustines `.patch`) ; `~\.claude\skills\quality-oracles\.quarantaine\<horodatage>\` (orphelin K2).
- Produit 02 : `forge\ledger.jsonl` (seq 118 du pilot, commis par la session du produit dans `fe4a6d0` avec sa propre seq 118) ; non commis : `build\stats\check-ecarts.py` · `build\stats\check-ht-ttc.py` · `build\tests\test_check-ecarts.mjs` · `build\tests\test_check-ht-ttc.mjs`.
- Forges (non commis) : `digit-ai-forge-design\input\00-travaux\pilot - TRAVAUX - 20260905a.md` · `digit-ai-forge-development\input\00-travaux\pilot - TRAVAUX - 20260905a.md` · `digit-ai-forge-conception\input\00-travaux\pilot - TRAVAUX - 20260905a.md` (+ `input\LISEZMOI.md`) · `digit-ai-forge-tests\input\00-retours\digit-ai-factory - RETOURS - 20260905a.md` et `.tf.jsonl` (+ `input\LISEZMOI.md`).
- Oracles rejoués : `oracles\oracle-skills.mjs` (PASS) · `oracle-conformite-projet` sur le produit 02 (R-42 PASS) · `oracle-controles-injoignables` sur le produit 02 (CI5 PASS) · `gabarits\oracle-travaux-pilot.mjs` ×3 (PASS) · `gabarits\oracle-lot-retours.mjs` (PASS) · `todo\oracle-todo.mjs` (PASS) · `oracle-nom-client-publie` (PASS).
