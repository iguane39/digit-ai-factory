---
destinataire: humain
---

# Synthèse de mandat — vos quatre décisions et vos quatre actions exécutées : le parc entier est publié, l'histoire de la forge de développement est réécrite, les tables de pseudonymisation sont arbitrées et fusionnées (08/09/2026)

Tout ce que vous avez accordé est fait. L'histoire de la forge de développement a été réécrite et republiée, protection de branche levée le temps du geste puis remise à l'identique et vérifiée, et le nom de domaine client qui y traînait depuis août a disparu. Les sept dépôts des campagnes sont publiés, les trois branches d'ancienne histoire supprimées après sauvegarde, et ce qui s'exécute sur le poste est de nouveau ce qui est versionné. Les six conflits de pseudonymes ont été tranchés un par un sur une preuve lue dans les tables, jamais sur une impression : trois désignaient le même produit écrit de deux façons, trois désignaient des produits distincts. Un de mes arbitrages a d'ailleurs été pris en défaut par la porte quelques minutes plus tard, et corrigé. Le fichier parasite est supprimé, les vingt-quatre candidatures du jour sont décidées. Ce qui est attendu de vous : rien d'obligatoire ; la campagne suivante attend votre mot quand vous le voudrez.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-16, D-17, D-18 et D-19, puis des actions A-48, A-64, A-57 et A-52 dans l'ordre que vous avez donné.
- **sur quoi** — la forge de développement (histoire réécrite et republiée), les sept dépôts des campagnes, trois forges portant une branche d'ancienne histoire, la copie installée des skills, le canal confidentiel (tables et arbitrage), le registre du pilot.
- **quand** — 2026-09-08 12:20 UTC+02:00 (Europe/Paris), durée ≈ 1 h 15 depuis votre message.
- **qui** — pilot digit-ai-factory d8a4f94 ; `scripts\rebatir-clone.mjs`, `scripts\generer-remplacements-historique.mjs`, `git filter-repo`, porte `oracle-nom-client-publie`, `oracle-skills`, `oracle-confidentiel`, `todo\journaliser.mjs`.

## 2. Verdict en une ligne

Histoire de la forge de développement réécrite (150 commits, 15 étiquettes) et republiée en force, porte PASS avant et après, protection remise identique sur 6 réglages comparés, clone rebâti et son commit de campagne rejoué puis publié, 411 tests verts ; 7 dépôts publiés sur 7, dont 2 par fusion ; 3 branches d'ancienne histoire supprimées, portes vertes ; skills propagés, contrôle PASS ; 6 conflits de tables tranchés (3 même produit, 3 pseudonymes neufs) puis 1 arbitrage rectifié après rejeu de la porte, tables fusionnées (64 produits, 10 clients), oracle du canal PASS, canal publié en 2 commits ; 24 candidatures décidées, registre PASS ; 1 fichier parasite supprimé ; 91 items clos au registre sur la journée.

## 3. Décisions attendues de l'humain

Aucune décision n'attend : vos quatre réponses couvrent tout ce qui était ouvert, et les deux arbitrages que j'ai rendus à votre place sont consignés avec leur preuve dans le canal privé, où vous pouvez les renverser ligne à ligne. Si rien n'est décidé : la campagne suivante ne démarre pas, les vingt-quatre candidatures restent décidées sans être ouvertes, et le parc reste dans l'état publié de ce midi.

## 4. Traité — avec sa preuve

- Histoire de la forge de développement réécrite depuis les tables du canal, puis republiée. Contrôle rouge → vert : porte FAIL sur un commit d'août portant un sigle client suivi d'un domaine → clone frais réécrit → PASS avant publication ; classe : un nom entré dans les tables après coup condamne une histoire déjà jugée verte.
  - preuve : paquet `digit-ai-forge-development-avant-filter-repo-20260908.bundle` vérifié exit 0 ; 39 règles de remplacement et 27 paires de noms dérivées des tables ; « New history written », 150 commits conservés ; porte sur le clone réécrit « PASS | bloquants 0 » ; « + 4d81314...9cda97c main -> main (forced update) » et les étiquettes reposées.
- Protection de branche levée le temps du geste et remise à l'identique, comparée réglage par réglage.
  - preuve : relevé archivé avant, remise « exit=0 », comparaison des six réglages (contrôles requis, mode strict, revues exigées, administrateurs soumis, poussée forcée, suppression) → « IDENTIQUE ».
- Clone local rebâti sur la nouvelle histoire, son commit de campagne rejoué puis publié, tests rejoués.
  - preuve : outil de reconstruction → « 1 patch rejoué », « 1 arborescence liée retirée », paquet vérifié, « après {head: fe3fd94, avance: 1, retard: 0} » ; `uv run pytest -q` → « 411 passed, 1 skipped » ; « 9cda97c..fe3fd94 main -> main ».
- Trois branches d'ancienne histoire supprimées, portes rejouées.
  - preuve : « Deleted branch sauvegarde/ancienne-histoire-20260907 » trois fois, avec l'empreinte d'origine ; porte « PASS | bloquants 0 » sur chacune des trois forges.
- Sept dépôts publiés, la porte jouée avant chacun, deux par fusion pour ne pas fausser les empreintes citées au registre.
  - preuve : « 538ccb1..7b86064 », « 10cca3b..28a2b0c », « 1063aed..949f08f », « 4ebb0bc..c0e4e73 », « bfdb251..aff3cde », « e2744ac..a3577db », « 9cda97c..fe3fd94 » ; recette du socle rejouée après fusion « 208/208 cas passés » ; tous les dépôts mesurés à « 0/0 » ensuite.
- Copie installée des skills remise à niveau. Contrôle rouge → vert : contrôle de propagation FAIL sur 28 fichiers de trois skills → propagation appliquée → « "verdict": "PASS" » ; classe : ce qui s'exécute cesse d'être ce qui est versionné dès qu'une campagne touche un skill.
- Six conflits de tables tranchés sur preuve, puis un arbitrage rectifié. Contrôle rouge → vert : après application, l'oracle du canal refusait deux clés pour un même pseudonyme → les deux clés déjà pseudonymisées retirées → PASS ; puis la porte rejouée sur le parc rendait deux constats sur trois dépôts → la troisième clé déjà pseudonymisée retirée → portes vertes ; classe : une clé déjà pseudonymisée entrée dans une table de noms réels devient mécaniquement un nom interdit.
  - preuve : décisions et preuves consignées dans le canal (trois « même », trois « neuf ») ; oracle du canal « K5 PASS chaque pseudonyme désigne un seul produit » ; tables à 64 produits et 10 clients ; canal publié « 03fa0c7..d8e3a4d » puis « d8e3a4d..c49a434 ».
- Tables libres du poste mises hors d'usage après report des dix ajouts clients, jamais supprimées.
  - preuve : « ajouts_clients: 10 » ; les deux fichiers renommés en `*.fusionne-2026-09-08.json` à la racine du parc.
- Vingt-quatre candidatures du jour décidées en bloc pour la campagne suivante.
  - preuve : `journaliser.mjs` → « 24 événement(s) journalisé(s) » ; `oracle-todo.mjs` → PASS ; registre : 91 clos, 28 décidés, 30 candidats, 4 en cours.
- Fichier parasite supprimé de la racine du parc, son contenu relu une dernière fois avant le geste.
  - preuve : contenu affiché (objet JSON de statut de mode, 44 octets), puis « supprime : OUI ».

## 5. Non traité — avec son motif

- Rectification des artefacts déjà publiés sous un pseudonyme que l'arbitrage a déplacé : mesurée, aucune trouvée dans les fichiers suivis après retrait des clés fautives ; il n'y avait donc rien à rectifier.
- Les trois items laissés en cours ce matin : inchangés, leurs restes sont nommés au registre.
- Le lot du 3 septembre : suivi et publié, son nom ne figurant dans aucune table ; il reste à rattacher à un produit si vous voulez qu'il porte un pseudonyme.
- La campagne suivante sur les vingt-quatre candidatures décidées : attend votre mot, parce qu'une campagne engage sept agents et des écritures dans des dépôts publiés.

## 6. Écarts à la lettre

- Vous avez demandé « A-48, 64, 57 & 52 » dans cet ordre → j'ai joué A-57 avant A-48 → pourquoi : la fusion des tables consomme l'arbitrage, elle ne peut pas le précéder.
- Vous m'avez délégué A-57, que j'avais qualifiée de décision humaine → je l'ai rendue moi-même, sur des preuves lues dans les tables, et j'ai consigné chaque ligne avec son critère dans le canal → pourquoi : votre message me la confie explicitement ; les décisions y sont réversibles ligne à ligne, et deux d'entre elles se lisent comme des faits vérifiables plutôt que comme des choix.
- Le script de fusion des tables n'a pas servi → pourquoi : il refuse tant qu'un conflit subsiste, et les conflits venaient d'être tranchés dans l'autre sens ; les dix ajouts clients ont été reportés à la main, puis les fichiers libres renommés comme le script l'aurait fait.
- Aucun autre écart.

## 7. Risques

- **Un arbitrage de pseudonyme rendu sans le métier** : signal = un artefact publié sous un numéro qui désigne un autre produit ; parade = les six décisions sont consignées avec leur preuve dans le canal et se renversent ligne à ligne ; la porte a déjà rattrapé une de mes erreurs le jour même.
- **Une clé déjà pseudonymisée dans une table de noms réels** : signal = la porte condamne un pseudonyme légitime dans un dépôt sain ; parade = la règle est écrite dans le fichier d'arbitrage, à porter dans l'oracle du canal à la campagne suivante.
- **Deux postes sur le même parc** : signal = un push refusé pour non-avance rapide ; parade = fusionner, jamais rebaser quand des empreintes sont citées ailleurs.
- **Une histoire réécrite deux fois en deux jours** : signal = un clone d'un autre poste devenu incompatible ; parade = ce poste est rebâti, l'autre doit l'être aussi avant son prochain travail sur cette forge.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-65 | Ouvrir la campagne suivante sur les vingt-quatre candidatures décidées, la cause de la suite de tests muette d'abord, puis la parité du composant embarqué et les items de doctrine | TF-0888, TF-0912 à TF-0917, TF-0919 à TF-0935 | auto_ia | gate_gouvernance (une campagne engage sept agents et des écritures dans des dépôts publiés) | dossiers d'items depuis le registre, puis un agent par dépôt sous `gabarits\AGENT-CAMPAGNE.md` | vingt-quatre constats mesurés restent décidés sans correction |
| A-63 | Remettre à niveau la copie embarquée du composant de filtres dans le skill des schémas, puis rejouer la parité | TF-0919 | auto_ia | dependance_bloc_3 (à jouer dans la campagne A-65, le dépôt étant maintenant publié) | `node .claude/skills/digit-ai-page-html/scripts/embarquer-composants.mjs --ecrire` dans `..\digit-ai-forge-agents`, puis `--constat` | une copie embarquée diverge de sa source dans un dépôt publié |
| A-66 | Porter dans l'oracle du canal la règle apprise aujourd'hui : une clé déjà pseudonymisée n'entre jamais dans une table de noms réels, avec sa fixture rouge | neuve | auto_ia | gate_gouvernance (candidature à journaliser puis décider) | `node todo/journaliser.mjs --fichier <evenement.json>` puis campagne sur le canal | le même arbitrage refera le même défaut |
| A-67 | Sur l'autre poste, à sa prochaine ouverture : rebâtir le clone de la forge de développement, dont l'histoire a été réécrite une seconde fois aujourd'hui | TF-0829 | manuelle_dev | presence : commandes à jouer sur l'autre poste, hors de portée de ce poste — mesure locale « forge-development 0/0 » ne dit rien de l'autre machine | `node bootstrap.mjs --pull` puis `node bootstrap.mjs --rebatir ..\digit-ai-forge-development` | l'autre poste travaillera sur une histoire incompatible |
| A-68 | Rattacher le lot de retours du 3 septembre à un produit, pour qu'il porte un pseudonyme comme les autres | neuve | manuelle_utilisateur | decision : le rattachement suppose de savoir quel produit a émis ce lot, information que ce poste n'a pas | répondre ici avec le nom du produit émetteur ; le lot concerné est `input\00-retours\Produit-65 - RETOURS - 20260903a.md` et je l'inscris au canal et le renomme | un lot reste nommé sans pseudonyme dans un dépôt publié |

Ordre : A-65 en premier dès votre mot, parce que tout le reste y est inclus ; A-63 dans son cadre ; A-66 avec elle, parce que c'est la leçon du jour ; A-67 dès que l'autre poste ouvre une session, parce que chaque heure ajoute des commits sur une histoire qu'il ne connaît pas ; A-68 quand vous voulez.

## 9. Traces

- `..\digit-ai-forge-development` fe3fd94 publié sur l'histoire réécrite 9cda97c ; `c:\dev\_sauvegardes\digit-ai-forge-development-avant-filter-repo-20260908.bundle` et son relevé de tête.
- Dépôts publiés : pilot a3577db puis d8a4f94, `..\digit-ai-forge-ops` 7b86064, `..\digit-ai-forge-data` 28a2b0c, `..\digit-ai-forge-design` 949f08f, `..\digit-ai-forge-tests` c0e4e73, `..\digit-ai-forge-agents` aff3cde.
- `c:\dev\_confidentiel` c49a434 — tables arbitrées et `arbitrages\20260908-D13-fusion-tables-poste-A.md` avec les six décisions, leurs preuves et la rectification.
- `c:\dev\_noms-interdits.fusionne-2026-09-08.json` et `_produits-pseudonymes.fusionne-2026-09-08.json` — anciennes tables du poste, hors d'usage, conservées.
- scratchpad `rw-dev-20260908\` — règles de réécriture, clone réécrit, relevés de protection avant et après.
