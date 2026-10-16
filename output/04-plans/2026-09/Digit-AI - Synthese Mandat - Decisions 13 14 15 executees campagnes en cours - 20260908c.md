---
destinataire: humain
---

# Synthèse de mandat — vos trois réponses du matin exécutées : la forge des outils publiée, l'arbitrage des tables déposé dans le canal privé, quarante candidatures décidées et sept campagnes lancées (08/09/2026, point d'étape)

Vos trois réponses sont exécutées pour tout ce qui ne dépend que de moi. La forge des outils est publiée sur l'histoire réécrite, sa branche de sauvegarde supprimée et son paquet conservé. Le canal privé porte maintenant un fichier d'arbitrage qui vous présente, avec les noms réels que lui seul peut porter, les six pseudonymes en conflit et les dix ajouts, avec trois réponses possibles par ligne. Quarante candidatures sont décidées en bloc et publiées au registre, et sept campagnes de correction tournent en parallèle, une par dépôt cible, en commits locaux que je ne publierai que sur votre feu vert. Ce qui change pour vous : l'autre poste voit au prochain tirage quelles candidatures ce poste a prises, et rien n'est encore publié des corrections. Ce qui est attendu de vous : lire les six lignes du fichier d'arbitrage dans le canal et répondre ligne à ligne ; le reste attend les rapports des campagnes.

## 1. En-tête d'identification

- **quoi** — exécution des réponses « 13 via le repo privé intermédiaire, 14a, 15a » à la synthèse précédente : publication de la forge des outils, dépôt de l'arbitrage des tables dans le canal, décision en bloc et campagnes sur les candidatures attribuées à ce poste.
- **sur quoi** — la forge des outils (edfdb2e publié), le canal confidentiel (03fa0c7 poussé), le pilot (6a33b3e publié, registre en cours d'extension), six forges cibles en écriture par agents (tests, design, exploitation, développement, données, socle des pages chez la forge des outils).
- **quand** — 2026-09-08 07:55 UTC+02:00 (Europe/Paris), durée ≈ 20 min depuis vos réponses ; campagnes en cours (première émission de la campagne design : « démarrage 07:50, durée prévue 45-60 min »).
- **qui** — pilot digit-ai-factory 6a33b3e ; porte `oracle-nom-client-publie` (copie installée) avec les tables du canal ; `todo\journaliser.mjs`, `todo\oracle-todo.mjs` ; sept agents de campagne sous `gabarits\AGENT-CAMPAGNE.md`.

## 2. Verdict en une ligne

Forge des outils : branche de sauvegarde supprimée, porte PASS (1 constat informatif C1-C5), « 0e0c223..edfdb2e main -> main », 0 en avance 0 en retard ; canal : fichier d'arbitrage écrit (6 conflits, 10 ajouts), oracle du canal PASS, « 76de5fe..03fa0c7 HEAD -> main » ; registre : « 40 événement(s) journalisé(s) », oracle PASS, « b18f17d..6a33b3e main -> main », puis 2 candidatures neuves (TF-0913, TF-0914) journalisées, oracle PASS (4 AVERT de récidive, attendus) ; 7 campagnes lancées sur 42 items, 0 rapport reçu.

## 3. Décisions attendues de l'humain

Aucune décision nouvelle : vos trois réponses couvrent ce tour. Le seul geste qui vous reste est la lecture des six lignes du fichier d'arbitrage dans le canal, qui est une action et non un choix fermé, parce que chaque ligne se tranche au vu d'un nom réel que je ne reproduis pas ici. Si rien n'est décidé : les deux tables continuent de vivre, ce poste désigne celles du canal à chaque geste.

## 4. Traité — avec sa preuve

- Forge des outils publiée après suppression de la branche de sauvegarde (paquet vérifié présent). Contrôle rouge → vert : porte FAIL 14 constats hier soir → branche supprimée, porte rejouée avec les tables du canal → PASS ; classe : porte jugeant une branche locale jamais poussée et une table périmée.
  - preuve : `ls c:\dev\_sauvegardes` → « digit-ai-forge-agents-20260908-051717.bundle » ; « Deleted branch sauvegarde/ancienne-histoire-20260907 (was 24308f6) » ; porte → « verdict PASS constats 1 » ; `git push` → « 0e0c223..edfdb2e main -> main » ; « 0 0 » en avance/retard.
- Fichier d'arbitrage des tables écrit dans le canal privé, avec l'extension de la table des produits que l'ingestion du matin avait faite (un produit ajouté, 61 → 62 clés), canal commité et poussé.
  - preuve : script d'écriture → « {"conflits":6,"ajouts":10,"libres":["Produit-60","Produit-63",…]} » ; `node oracle-confidentiel.mjs .` → « oracle canal PASS » ; « 76de5fe..03fa0c7 HEAD -> main ».
- Quarante candidatures décidées en bloc au registre (les vingt-trois nées ici, plus celles des forges tests, design, exploitation, développement, données), vues régénérées, publiées.
  - preuve : `journaliser.mjs` → « 40 événement(s) journalisé(s) » ; `oracle-todo.mjs` → « PASS » ; « b18f17d..6a33b3e main -> main ».
- Sept campagnes lancées en parallèle, une par dépôt cible, chacune sur un dossier d'items écrit depuis le registre, sous le contrat de campagne (écriture dans le seul dépôt cible, vérifications natives vertes, commits locaux, jamais de push).
  - preuve : dossiers écrits → « décisions 40 dossiers 7 items 42 » ; six dépôts cibles mesurés propres et alignés avant lancement (« dirty=0 0/0 » pour tests, design, ops, development, data, agents) ; première émission d'avancement reçue de la campagne design (« HEAD 1063aed, arbre propre, self-test.mjs vert de départ (35 oracles, 111 règles) »).
- Deux constats du matin journalisés comme candidatures (l'alias court pris avant le nom complet ; l'index de la boîte qui écrit le nom des fichiers non suivis), chacun avec une classe du référentiel.
  - preuve : `journaliser.mjs` → « 2 événement(s) journalisé(s) » ; `oracle-todo.mjs` → « PASS » (R13 : classes `porte-cle-courte-sans-frontiere` et `anonymisation-portee-partielle` reconnues).

## 5. Non traité — avec son motif

- Fusion effective des tables : attend votre lecture des six lignes dans le canal, parce que chaque ligne se tranche au vu d'un nom réel.
- Clôture des quarante-deux items : attend les rapports des sept campagnes, puis ma vérification par sondage ; rien n'est clos au registre avant.
- Publication des corrections : GO humain après les rapports (règle 38), aucun push fait par les agents.
- Le commit des deux candidatures neuves au pilot : différé tant que la campagne pilot écrit dans le même dépôt, pour ne pas mêler son index au mien.
- Le lot du 03/09 non suivi, le fichier `null` à la racine du parc, les deux réserves du 01/09 : inchangés, motifs de la synthèse précédente.

## 6. Écarts à la lettre

- Vous avez répondu « 13 : via le repo privé intermédiaire ? » comme une question → j'ai pris la réponse pour un oui et déposé l'arbitrage dans le canal → pourquoi : le canal est le seul endroit où un nom réel peut s'écrire, et la lecture ligne à ligne y est possible sans rien recopier ici ; si vous vouliez autre chose, le fichier se retire par un commit.
- L'option (a) de D-14 nommait forge-audit parmi les forges de ce poste → aucune campagne audit lancée → pourquoi : aucune candidature ouverte ne la cible.
- L'option (a) de D-14 laissait la forge des outils à l'autre poste → une campagne y écrit quand même, bornée au seul skill du socle des pages → pourquoi : huit des vingt-trois candidatures nées ici ciblent ce skill, et l'option (a) donnait ces vingt-trois à ce poste ; l'agent a interdiction de toucher un autre skill de ce dépôt.
- Aucun autre écart.

## 7. Risques

- **Deux postes sur la forge des outils le même matin** : signal = un push refusé en avance rapide, ou un conflit sur `quality-oracles` ; parade = campagne bornée au skill du socle des pages, rebase seulement sur avance simple, jamais sur histoire réécrite.
- **Collision de numéros** (TF-0913 et TF-0914 frappés ici pendant que l'autre poste journalise) : signal = push du pilot refusé ; parade = fetch avant commit, renumérotation par `todo\renumeroter.mjs` avant publication.
- **Un agent qui clôt par assouplissement** : signal = un rapport « corrige » sans sortie native avant/après, ou un seuil changé ; parade = vérification par sondage des commits avant toute clôture, G-2 absolue.
- **Campagne pilot et registre dans le même dépôt** : signal = un commit d'agent qui emporte `todo/` ; parade = interdiction explicite dans son prompt, et lecture de chaque commit avant intégration.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-54 | Recevoir les sept rapports, vérifier chaque commit par sondage (diff, vérification native rejouée), clore ou renvoyer au registre avec gains constatés, régénérer les vues, journaliser la campagne | TF-0889 à TF-0911 et items des forges attribuées | auto_ia | dependance_externe (rapports des agents en cours) | rapports puis `node todo/journaliser.mjs --fichier <clotures.json>`, `node todo/generer-vue.mjs`, `node todo/generer-page.mjs` | quarante-deux items restent décidés sans correction constatée |
| A-55 | Commiter les deux candidatures neuves au pilot après la fin de la campagne pilot, puis publier | TF-0913, TF-0914 | auto_ia | dependance_externe (campagne pilot en cours dans le même dépôt) | `git add todo/TODO.jsonl todo/TODO.md todo/TODO.html` puis `git push origin main` dans `c:\dev\digit-ai-factory` | l'autre poste ne voit pas les deux constats |
| A-48 | Fusionner les tables selon vos six réponses, renommer mes fichiers libres, rejouer la porte sur les quatorze dépôts, rectifier les pseudonymes périmés au registre | neuve | auto_ia | dependance_bloc_3 (lecture humaine des six lignes) | `node scripts/fusionner-tables-confidentielles.mjs` après édition du canal, puis porte par dépôt | deux tables continuent de vivre |
| A-56 | Publier les commits des campagnes après vérification, forge par forge | TF-0889 à TF-0911, TF-0833 à TF-0847, TF-0866, TF-0875, TF-0876, TF-0886, TF-0748, TF-0749 | auto_ia | gate_gouvernance (publication sur GO humain, règle 38) | `git push origin main` dans chaque forge, porte jouée avant | les corrections restent locales à ce poste |
| A-57 | Lire les six lignes du fichier d'arbitrage et inscrire par ligne `neuf`, `même` ou `écarter` ; refuser un ajout client s'il y a lieu | neuve | manuelle_utilisateur | decision : chaque ligne se tranche au vu d'un nom réel | ouvrir `c:\dev\_confidentiel\arbitrages\20260908-D13-fusion-tables-poste-A.md`, renseigner la colonne Décision, puis me dire « D-13 arbitré » | six pseudonymes restent ambigus entre les deux postes |
| A-52 | Supprimer le fichier `c:\dev\null` | neuve | manuelle_utilisateur | irreversible : supprimer un fichier est un geste humain (règle 29) ; contenu lu par deux sondes | `Remove-Item c:\dev\null` | un fichier parasite reste à la racine du parc |

Ordre : A-54 dès le premier rapport, parce que chaque clôture non vérifiée est un item qui ment ; A-55 juste après la fin de la campagne pilot, parce que deux écrivains dans un même index se mêlent ; A-57 quand vous voulez, parce que A-48 en dépend et que les campagnes n'en dépendent pas ; A-56 en dernier, parce qu'elle publie et demande votre feu vert ; A-52 à votre convenance.

## 9. Traces

- `..\digit-ai-forge-agents` — HEAD edfdb2e publié ; `c:\dev\_sauvegardes\digit-ai-forge-agents-20260908-051717.bundle`.
- `c:\dev\_confidentiel\arbitrages\20260908-D13-fusion-tables-poste-A.md`, `c:\dev\_confidentiel\tables\produits-pseudonymes.json` — canal 03fa0c7 poussé.
- pilot 6a33b3e — `todo\TODO.jsonl` (40 décisions) publié ; TF-0913 et TF-0914 en arbre de travail, non commités.
- scratchpad `campagne-d14\` — sept dossiers d'items et `decisions.json` ; `evenements-a51.json`.
- Campagnes : sept agents en cours, dépôts `..\digit-ai-forge-{tests,design,ops,development,data,agents}` et `.` (pilot), commits locaux à venir.
