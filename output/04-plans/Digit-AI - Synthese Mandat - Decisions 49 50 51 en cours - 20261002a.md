---
destinataire: humain
---

# Synthèse Mandat — vos décisions D-49, D-50 et D-51 sont exécutées ou en cours ; la campagne sur les candidatures tourne (02/10/2026)

## 0. Synthèse d'ouverture

Vos trois décisions sont en œuvre. Les 5 retours des deux lots refusés sont entrés au registre, et la cause de leur refus est remontée aux 2 produits, comme vous l'avez demandé. Le circuit de recette hébergée du pilot est actif et publié. Sa première exécution a révélé 9 recettes en défaut, propres à Linux ; elles sont corrigées et vertes dans un conteneur Linux, et la correction attend sa publication, que vous avez demandée en fin de travail. La campagne sur les candidatures a donné une fiche de décision à chacune des 201 : 46 vous reviennent, les 155 autres s'exécutent sans vous, et 9 agents y travaillent. À 11:28, 86 décisions sont closes au registre, chacune avec son contrôle rouge puis vert ; les 4 lots du pilot sont fusionnés dans la branche principale, et une règle bloquante neuve qu'un agent avait écrite en a été retirée, parce qu'une règle neuve vous revient. Un agent a supprimé par erreur un remisage temporaire d'un autre agent ; vos deux remisages sont intacts, et la consigne d'arrêt a été donnée. Rien n'est attendu de vous avant la fin de la campagne.

## 1. En-tête d'identification

- **quoi** — point d'étape : exécution de vos réponses « 49a, 50a, 51a », de votre demande de remonter la cause du refus aux produits, et première vague de la campagne sur les candidatures ; son résultat n'est pas encore mesurable.
- **sur quoi** — le pilot `digit-ai-factory` ; les forges `digit-ai-forge-ops`, `-conception`, `-data`, `-design`, `-tests` et `-audit` (commits locaux) ; les boîtes de travaux de 2 produits (Produit-12 et Produit-02, `input/00-travaux/`) ; GitHub Actions du pilot.
- **quand** — 2026-10-02 11:28 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début à 07:22, à la réception de votre réponse ; durée mesurée depuis 07:22.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; pilot de `f82270f2` à `9299a170` ; 8 agents de fiches et 9 agents d'exécution Sonnet 5 (routage par défaut, escalade : aucune) ; oracles joués : `ingerer-lot`, `oracle-boite-entree`, `simuler-recette-hebergee`, `oracles/self-tests.mjs`, `todo/self-test.mjs`, `oracle-todo`, `revue-hebdo --self-test`, `oracle-synthese`.
- **intention** — que vos trois décisions produisent leur effet, que les produits apprennent pourquoi leurs lots ont été refusés, et que le stock de candidatures se réduise sans vous poser ce qui ne vous revient pas. **Test rétro** : servie pour les deux premières décisions et pour la remontée aux produits, en cours pour la campagne, dont le résultat se mesurera aux clôtures.

## 2. Ce qui reste à mesurer, et par quoi

Le nombre des 67 décisions de la campagne encore ouvertes qui seront closes, chacune avec son contrôle rouge puis vert, mesuré par `node todo/oracle-todo.mjs` après l'écriture des résultats des agents ; et le verdict de la recette hébergée sur la correction Linux, mesuré par `gh run watch` après la publication de fin de travail.

## 3. Décisions attendues de l'humain

Aucune décision attendue de l'humain dans ce tour. Les 46 propositions qui vous reviennent seront posées à la revue hebdomadaire, 7 au plus par semaine.

Inventaire des bloquants — ce qui est bloqué, ce qui le lève, et ce qui se passe sinon :

- la clôture des 67 décisions restantes : la fin des 2 agents en cours, puis d'une seconde vague sur la moitié restante de forge-agents ; sans elle, elles restent décidées et ouvertes au registre ;
- le verdict de la recette hébergée sur la correction Linux : la publication que vous avez demandée en fin de travail ; sans elle, le circuit public reste rouge sur sa dernière exécution.
- la resynchronisation de la copie installée des skills : la fin des agents qui écrivent dans forge-agents ; sans elle, le contrôle des skills reste rouge sur ce poste.

## 4. Traité — avec sa preuve

- **D-49 (a), dérogation tracée** : les 2 lots sont entrés, 5 retours devenus candidatures (TF-1563 à TF-1567), dont 2 récidives et 3 classes à créer.
  - preuve : `node todo/ingerer-lot.mjs … --derogation-fichier` → « 4 candidature(s) ingérée(s) » et « 1 candidature(s) ingérée(s) » ; `oracle-boite-entree` → exit 0.
- **Votre demande sur D-49, la cause du refus** : mesurée en lecture seule chez les 2 produits. Leurs copies ENREGISTRÉES du gabarit et du contrôle de remise datent d'avant la règle des documents mûrs (contrôle en 1.0.0 et 1.1.0). Leur contrôle a donc rendu PASS honnêtement, et les copies à jour ne sont arrivées sur leur disque qu'à 19:58, après les remises de 17:56 et 18:43. Remontée par TF-1568 (Produit-12) et TF-1569 (Produit-02), plus TF-1570 au pilot pour la fenêtre entre une règle neuve de la porte et l'arrivée de l'héritage.
  - preuve : `git show HEAD:forge/retours/oracle-lot.mjs` → VERSION 1.0.0 et 1.1.0 ; le contrôle à jour rejoué sur les lots → FAIL sur la règle des documents mûrs ; `node todo/emettre-travaux.mjs` → « [DÉPOSÉ] … pilot - TRAVAUX - 20261002a.md » chez les 2 produits.
- **La consigne pour la prochaine fois** : à tout refus de lot, la restitution proposera en plus de transmettre le constat au produit, avec la cause mesurée. Elle est écrite dans `references/TODO-FORGE.md`, à la section du sas, et en mémoire de session.
  - preuve : commit `287e1710` ; `oracle-claude-md` → exit 0.
- **D-50 (a), activation et publication** : correctifs enregistrés, circuit déplacé dans `.github/workflows/`, banc et simulateur repointés, simulation VERTE sur le HEAD réel, publication faite.
  - preuve : `git push` → `f82270f2..0ab55f68  main -> main`, exit 0 ; `recette-pilot-hebergee.test` → 17 PASS, 0 FAIL ; simulation → « verdict VERT ».
- **Correction de la première exécution hébergée, contrôle rouge → vert** : 9 recettes sur 172 en défaut sous Linux seulement. Cause : des chemins convertis à la main en séparateur Windows avant `path.join`, et un crochet de recette écrit sans bit d'exécution (TF-1571, classe `livrable-juge-sur-le-seul-poste-producteur`).
  - preuve : exécution `36969890315` → « 9/172 oracle(s) en défaut » ; conteneur `node:20` après correction → `oracles/self-tests.mjs` exit 0 et `todo/self-test.mjs` 58 PASS 0 FAIL ; Windows → `oracles/self-tests.mjs` exit 0.
- **D-51 (a), fiches et tri** : 201 fiches de décision complètes au registre, 46 qui vous reviennent et 155 hors de votre ressort ; 153 décidées par la règle de tri, et les 2 déjà transmises aux produits passées en cours. J'ai repris la recommandation sur 1 fiche : le réglage de modèle du poste vous revient, il avait été changé à la main.
  - preuve : `node todo/journaliser.mjs` → « 201 événement(s) » puis « 157 événement(s) », verdict PASS avant et après ; contrôle de forme des 201 fiches → 0 défaut ; `revue-hebdo --self-test` → PASS.
- **Premiers résultats de la campagne, forge-ops et forge-conception** : forge-ops, un mot de passe en clair passait le contrôle de mise en production, il est maintenant refusé (TF-1217) ; forge-ops, les comptes de portes périmés sont remplacés par un renvoi (TF-1527, partie forge) ; forge-conception, les titres refusés par le contrôle d'écriture sont renommés dans 7 fixtures (TF-1508).
  - preuve : forge-ops `a1cc64a` et `1e1390f`, harnais 162 PASS 0 FAIL ; forge-conception `cf00fc5`, contrôle d'écriture FAIL → PASS, self-test vert.
- **forge-data** : la forge sait lire un classeur et le modèle d'un fichier de tableau de bord sans dépendance externe (TF-1226) ; la preuve sur ce second format repose sur une fixture construite d'après le format documenté.
  - preuve : `50f141c` ; self-test 368 → 380 PASS, 0 FAIL ; lecture d'un vrai classeur confirmée par une bibliothèque tierce.
- **forge-design** : une règle mesure la hauteur d'un bandeau collant au téléphone (TF-1355), et un dixième oracle juge si une action exigée est perceptible (TF-1219), par une convention neuve qui relie un bouton à son exigence.
  - preuve : `2f99611` et `117d1f8` ; fixtures rouges FAIL, vertes PASS ; self-test 51 oracles, 138 règles vertes.
- **forge-tests, contrôle rouge → vert par item** : 7 décisions corrigées (TF-1210, 1211, 1216, 1218, 1229, 1407, 1419), chacune avec son cas de recette qui échoue avant et passe après.
  - preuve : 8 commits de `6c095ce` à `81377c9` ; suite de tests exit 0 ; recette du corpus 13 sections sur 13, 23 défauts du banc rouge détectés.
- **forge-audit, contrôle rouge → vert par item** : 9 décisions corrigées (TF-1208, 1209, 1220, 1408, 1276, 1344, 1374, 1376, 1397) ; le rapport de démonstration passe de 21 échecs à 0 au contrôle de page, et de 124 bloquants à 0 au rendu.
  - preuve : 8 commits de `fcc0272` à `ea3d646` ; recettes 188 PASS sur 189, 1 cas non joué motivé et antérieur ; harnais du dépôt 13 étapes sur 13.
- **Pilot, troisième lot, contrôle rouge → vert par item** : 14 décisions corrigées sur sa branche, 4 bloquées avec leur motif (TF-1351 et TF-1463 visent une forge, TF-1520 un script de produit, TF-1547 une transmission au produit).
  - preuve : branche `worktree-agent-a30d86c0476355e71` à `693c2d48` ; `oracles/self-tests.mjs` exit 0 et `todo/self-test.mjs` 58 PASS 0 FAIL dans son arbre.
- **forge-agents, socle des pages, contrôle rouge → vert par item** : 3 décisions corrigées (TF-1282, TF-1356, TF-1370) ; une capture de section échouée n'efface plus celle de la page, les bandeaux collants sont neutralisés et nommés à la capture par section, et le rapport dit quel état de la page il a mesuré.
  - preuve : `dc64465`, `cafa2d5`, `9fdb71d` ; chaque cas de recette échoue sans la correction et passe avec ; recette du socle 483 sur 484, le seul échec étant antérieur et sans rapport ; pour les bandeaux, l'effet visuel décrit par le produit n'a pas été reproduit sur ce poste.
- **Pilot, quatrième lot, contrôle rouge → vert par item** : 14 décisions corrigées sur sa branche, 4 bloquées avec leur motif (3 visent une forge, 1 un produit privé).
  - preuve : branche `worktree-agent-a576abdf8d21a41a4` à `c3c2d8ec` ; `todo/self-test.mjs` 58 PASS 0 FAIL ; `oracles/self-tests.mjs` sans défaut hors `oracle-skills`, qui constate la copie locale des skills désynchronisée, état antérieur.
- **Pilot, deuxième lot, contrôle rouge → vert par item** : 14 décisions corrigées sur sa branche, 4 bloquées avec leur motif (2 visent une forge, 1 un produit, 1 non reproduit en 20 rejeux).
  - preuve : branche `worktree-agent-a02b36b293d32cca1` à `f9a80766` ; dans son arbre, `oracles/self-tests.mjs` rend 3 défauts sur 173 et `todo/self-test.mjs` 56 PASS 2 FAIL, que l'agent attribue au dépôt frère introuvable depuis un arbre imbriqué ; ces harnais rendaient exit 0 dans l'arbre principal, je les y rejouerai après fusion.
- **Fusion des 4 lots du pilot** : 4 branches fusionnées une à une après relecture de leur diff ; conflits résolus sur le script de recopie d'héritage, le contrat d'héritage (passé en version 1.15.0 pour porter les 2 évolutions concurrentes), le catalogue des gabarits, le crochet de restitution et leurs recettes.
  - preuve : commits `286603c7`, `e3baf419`, `eca622a8`, `fe5e92d2` ; `recopier-heritage.test` 20 PASS, `hook-restitution.test` 42/42, `oracle-gabarits-documents --self-test` 44/44, `oracle-empreintes` PASS, `todo/self-test.mjs` 58 PASS 0 FAIL, `oracle-todo` PASS.
- **Écarts de doctrine retirés à la fusion** : la règle bloquante de revue de lecture (TF-1372) est retirée, le reformatage du gabarit de restitution (TF-1534) écarté de la fusion, puis rejoué par la seconde vague sur le texte fusionné.
  - preuve : commit `3a38e453` ; `oracles/self-test.mjs` 130 PASS 0 FAIL après retrait.
- **78 clôtures au registre**, chacune avec ses gains mesurés et sa descente : forges audit (9), tests (7), ops (1), conception (1), data (1), design (2), et les 4 lots du pilot (57).
  - preuve : `node todo/journaliser.mjs` → « 163 événement(s) » puis « 12 événement(s) », verdict PASS avant et après ; commit `76d166ce`.
- **Seconde vague, forge-audit et forge-tests, contrôle rouge → vert par item** : 4 décisions corrigées (TF-1345, TF-1346, TF-1351, TF-1347) — la veille des dépendances lit les espaces de travail et nomme le bon remplaçant, la fiche du pack de conformité est livrée au format que son imprimeur accepte, et les routes imbriquées ne produisent plus 3 faux liens cassés.
  - preuve : forge-audit `0b76c7d4`, recettes 196 PASS et 1 cas non joué motivé, harnais 13/13 ; forge-tests `722cda5a`, 1 451 tests verts, recette du corpus tenue ; registre « 8 événement(s) », verdict PASS.
- **Seconde vague au pilot, contrôle rouge → vert par item** : 4 décisions corrigées — les 4 textes qui citaient un compte de portes de mise en production périmé renvoient au document de référence (TF-1527), la citation de règle erronée est corrigée (TF-1410), le gabarit de restitution tient un paragraphe par ligne à contenu identique (TF-1534), et le générateur de pages d'étude rend une page que le socle accepte (TF-1566).
  - preuve : commits `574a6641`, `3b7e75f7`, `6c8267d0`, `5beb038b` ; noyau sous plafond, `oracle-claude-md` PASS ; gabarit 1 150 → 553 lignes, 0 différence de contenu sur 115 248 caractères ; page d'étude : 9 → 0 échecs au contrôle de page et 3 → 0 sommaires perdus, self-test du générateur 15 → 22 cas ; `todo/self-test.mjs` 58 PASS ; registre « 8 événement(s) », PASS, commit `634cf601`.
- **Régression du juge des restitutions corrigée, contrôle rouge → vert** : le durcissement d'une règle par un agent refusait toute restitution sans décision qui portait l'inventaire des bloquants, pourtant exigé par une autre règle, et ne reconnaissait plus l'ouverture « Aucune décision » de la forme prescrite (TF-1571).
  - preuve : commits `4b9da686` et `3f16275f` ; self-test du juge 114/114, dont 2 cas neufs dans les deux sens ; 12 synthèses récentes rejugées, 12 PASS, dont une que le juge fusionné refusait et que le juge d'avant acceptait.
- **Incident maîtrisé** : un agent a supprimé un remisage temporaire d'un autre agent, la pile étant commune aux arbres du pilot.
  - preuve : `git stash list` → vos 2 remisages intacts ; consigne d'arrêt envoyée aux 3 agents du pilot encore actifs ; la fusion de chaque branche contrôlera qu'elle ne porte que ses propres changements.
- **Vérifications de clôture déjà rendues** : 12 clôtures prouvées par rejeu de leur oracle ; 3 fiches réfutées, qui restent ouvertes (TF-1410, TF-1530, TF-1487).
  - preuve : `oracle-empreintes` → PASS, `oracle-regle-sans-juge` → PASS, `readme-dossiers.test` → 20 PASS, `hook-restitution.test` → 39/39 ; pour TF-1487, un test direct rapporte un constat de la ligne 24 en ligne 3.

## 5. Non traité — avec son motif

- La clôture des 67 décisions restantes de la campagne — motif : `dependance_externe`, 2 agents de la première vague tournent encore (forge-agents, clôtures sur preuve) ; la seconde moitié de forge-agents suivra.
- La décision sur la règle bloquante de revue de lecture — motif : `decision`, elle sera posée à la revue hebdomadaire, motif doctrine.
- La resynchronisation de la copie installée des skills — motif : `dependance_externe`, après la fin des agents de forge-agents.
- La publication de la correction Linux et des commits de la campagne — motif : `dependance_externe`, vous l'avez demandée en fin de travail.
- La création des 3 classes proposées par les lots du jour — motif : `decision`, elles figurent parmi les 46 propositions de la revue hebdomadaire.
- Les 4 décisions bloquées du troisième lot du pilot — motif : `hors_mandat`, elles visent une forge ou un produit ; elles seront réaffectées à leur dépôt à la fin de la vague.

## 6. Écarts à la lettre

- **Vous avez répondu** « 49a » → **la dérogation a aussi couvert une seconde règle**, celle des identifiants déjà pris → **pourquoi** : l'outil applique une dérogation à toutes les règles de forme d'un lot ; le lot de Produit-12 réemploie trois identifiants de son lot du 06/09, et l'ingestion l'a tracé.
- **Vous avez répondu** « 51a » → **j'ai repris le tri d'une fiche, et 3 fiches de clôture se sont révélées fausses à la vérification** → **pourquoi** : une fiche se vérifie contre le code avant de clore, jamais sur sa seule recommandation.

## 7. Risques

- Le quatrième lot du pilot a écrit une règle de doctrine neuve, une revue de lecture exigée à côté de chaque page livrée, et 2 règles avertissantes du juge des restitutions, alors qu'une règle neuve vous revient ; ses 14 items tiennent en un seul commit ;
  - signal : un ajout à `REGLES-PROJET.md` ou à `oracles/oracle-synthese.mjs` dans le diff de sa branche ;
  - parade : avant fusion, je retire ces ajouts de doctrine et je les porte à la revue hebdomadaire comme propositions.
- Une modification d'un agent du pilot est passée dans la branche d'un autre par la pile de remisages commune ;
  - signal : à la fusion, un fichier modifié qu'aucun item de la branche ne justifie ;
  - parade : relecture du diff de chaque branche contre la liste de ses items avant fusion.
- Un agent d'exécution casse une recette d'un dépôt qu'il ne juge pas ;
  - signal : un harnais rouge au moment de fusionner ses commits ;
  - parade : je rejoue les harnais du pilot et de chaque forge avant la publication de fin de travail.
- 2 agents du pilot modifient le même fichier dans leurs arbres séparés ;
  - signal : un conflit à la fusion de leurs branches ;
  - parade : fusion une branche à la fois, harnais rejoué après chacune.

## 8. Prochaines actions

Les actions sont triées dans l'ordre où elles deviennent possibles ; aucune n'attend votre geste.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Relire les résultats des 2 agents en cours et écrire leurs clôtures au registre par `todo/journaliser.mjs` | `auto_ia` | neuve | `dependance_externe` — les agents tournent | 67 décisions restent ouvertes |
| **A-2** | Lancer la seconde vague sur la moitié restante de forge-agents, TF-1487 compris | `auto_ia` | neuve | `dependance_externe` — après la première moitié, même dépôt | 20 décisions restent ouvertes |
| **A-3** | Rejouer les harnais du pilot et des forges touchées, puis publier le pilot et les forges, enfin suivre la recette hébergée par `gh run watch` | `auto_ia` | TF-1571 | `dependance_externe` — votre demande de publier en fin de travail | le circuit public reste rouge |
| **A-4** | Rendre la restitution complète de la campagne, et le dossier de revue des 46 propositions qui vous reviennent | `auto_ia` | neuve | `dependance_externe` — après les clôtures | la revue de la semaine prochaine part sans dossier |

## 9. Traces

- Commits du pilot : `0988b7fa`, `0ab55f68` (publiés), `287e1710`, `9299a170` (locaux).
- Forges : `digit-ai-forge-ops` `a1cc64a`, `1e1390f` ; `digit-ai-forge-conception` `cf00fc5` ; `digit-ai-forge-data` `50f141c` ; `digit-ai-forge-design` `2f99611`, `117d1f8` ; `digit-ai-forge-tests` `6c095ce` à `81377c9` ; `digit-ai-forge-audit` `fcc0272` à `ea3d646` (locaux).
- Fusions au pilot : `286603c7`, `e3baf419`, `eca622a8`, `fe5e92d2` ; retrait de règle `3a38e453` ; clôtures `76d166ce` (locaux).
- Forge-agents : `dc64465`, `cafa2d5`, `9fdb71d` (locaux).
- Registre : `todo/TODO.jsonl`, TF-1563 à TF-1571 créées, 201 fiches et 157 décisions consignées.
- Lots de travaux : `input/00-travaux/pilot - TRAVAUX - 20261002a.md`, chez les 2 produits.
- Exécution hébergée : GitHub Actions `36969890315` (rouge, avant correction).
- Aucune page HTML livrée dans ce tour.
