---
destinataire: humain
---

# Synthèse Mandat — vos réponses 1a, 2a et 3b exécutées, reprise multi-poste prête à publier (15/10/2026)

## 0. Synthèse d'ouverture

Vos trois réponses sont exécutées. Le travail de ce matin est publié, l'effort de réflexion du poste est revenu au niveau élevé, et la reprise d'un produit d'un poste à l'autre est construite. Un produit qui déclare son dossier synchronisé retrouve à l'ouverture ce qui lui manque, sans rien copier à la main. Il envoie en fin de tour ce qui a changé, si vous avez donné votre feu vert pour ce produit. Les produits recevront ce câblage d'eux-mêmes à leur prochaine ouverture. Ce travail a été fusionné avec celui que l'autre poste a publié entre-temps, et toutes les recettes sont vertes, sauf un rouge plus ancien. Il ne manque que votre feu vert pour le publier.

## 1. En-tête d'identification

- **quoi** — exécution de vos réponses « 1a, 2a, 3b » aux trois décisions de la synthèse 20261015d, jusqu'à la publication exclue.
- **sur quoi** — pilot `digit-ai-factory` : publié jusqu'à `55a1105c` ; locaux non publiés `c609bfb7` (reprise multi-poste), `808a98ca` (fusion de 28 enregistrements de l'autre poste), `8d11de37` (deux corrections nées de la fusion) ; réglages Claude du poste.
- **quand** — 2026-10-15, de 18:47 à 21:20 UTC+02:00 (Europe/Paris), heure relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5, sans agent ; escalade : aucune ; une seconde session du même poste a proposé une résolution de la même fusion, comparée puis écartée ; outils joués : `git push`, `git merge`, `oracle-modeles-en-service`, `journaliser`, `oracle-todo`, harnais `self-tests` 2 fois, recettes ciblées, `oracle-empreintes`, `oracle-coherence-restitution`.
- **intention** — qu'un développeur reprenne son produit sur n'importe lequel de ses postes sans rien copier à la main, et que les deux postes du pilot ne se contredisent pas. **Test rétro** : le mécanisme sert l'intention, jugé sur le cas réel du 14/10 rejoué (58 générateurs absents, restaurés sans geste) ; il ne la servira chez Produit-12 qu'après publication et son manifeste écrit à sa prochaine ouverture.

## 2. Verdict en une ligne

**TENU, publication en attente de votre feu vert — 3 décisions exécutées ; harnais complet après fusion 218/221, les 2 défauts nés de la fusion corrigés et rejoués verts (34/34, 90/90), 1 rouge préexistant identique sur l'arbre publié (96/98) ; reprise multi-poste : recette 8/8 dont le cas du 14/10.**

## 3. Décisions attendues de l'humain

Une décision vous revient, la publication. Les bloquants :

- la publication de `c609bfb7`, `808a98ca` et `8d11de37` : ce qui la lève, votre feu vert cité au contrôle avant envoi ; sans lui, l'autre poste ne voit pas la reprise multi-poste et peut reprendre les mêmes numéros.

> **D-4 — Publiez-vous les 3 enregistrements locaux du pilot qui portent la reprise multi-poste et sa fusion avec l'autre poste ?**
>
> Rappel du sujet : ils portent la règle de reprise, le moteur et son juge, le hook câblé chez les produits, la règle du juge des restitutions qui refuse un transport laissé à l'humain, la fusion des 28 enregistrements publiés par l'autre poste pendant ce travail, et deux corrections nées de cette fusion. Le contrôle avant envoi les refuse sans un feu vert humain cité, et je n'en invente pas.
>
> **Recommandation : (a).** Le harnais complet est vert hors un rouge plus ancien, présent à l'identique sur l'arbre publié. Chaque heure locale de plus expose à une nouvelle collision de numéros avec l'autre poste, qui a déjà repris quatre de mes numéros pendant ce tour. Source consultée : sortie du contrôle avant envoi (« PUBLICATION REFUSEE - un enregistrement en avance exige le GO humain explicite (R-38 par. 4-5) ») et `git status -sb` (« ahead 3 »).

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant, avec votre feu vert cité au contrôle avant envoi, après une nouvelle fusion si l'autre poste a encore publié | complexité faible · durée courte (environ 9 min de contrôle) | aucune |
| (b) garder local | aucun | l'autre poste ne voit ni la reprise ni la fusion, et le risque de collision de numéros grandit |

> **Si rien n'est décidé** : l'option (b) s'applique, les enregistrements restent locaux.

> **D-2 du 14/10 (règles perdues du socle des pages, TF-1307), posée le 14/10 à 12:10 : inchangée.**

## 4. Traité — avec sa preuve

- **D-1 (a), publication** des 5 enregistrements du matin, feu vert cité.
  - preuve : `git push` → « 1f1d27f7..55a1105c main -> main ».
- **D-2 (a), effort du poste à « high »**, TF-1557 clos, MS5 (effort conforme à la table) PASS.
  - preuve : `oracle-modeles-en-service` → MS5 FAIL (« medium ») → PASS, « conforme à la table ».
- **D-3 (b), reprise multi-poste**, les 5 gestes du lot, TF-1736 clos (`oracle-todo` PASS) : règle R-64 (reprise multi-poste sans geste humain), gabarit du manifeste et section R-64 du gabarit produit, moteur et juge `oracle-reprise` (RP1 à RP5), hook `reprise` à l'ouverture et en fin de tour, règle S77 (transport entre postes laissé à l'humain) du juge des restitutions, héritage 1.26.0, classe `reprise-multi-poste-declaree-non-cablee`.
  - preuve : `oracle-reprise.test` → 8/8, dont RP4 FAIL sur 58 fichiers absents puis PASS après restauration, et un envoi refusé sans feu vert ; `hooks-factory.test` → 20/20 ; `oracle-synthese --self-test` → 177/177 ; RC1 PASS (2.40.0).
- **Fusion avec les 28 enregistrements de l'autre poste**, 11 fichiers en conflit résolus à partir du côté publié ; numéros renumérotés (S75 → S77, restitution 2.40.0, héritage 1.26.0, classes 1.40.0, cas du lanceur 12) ; leur héritage 1.24.0 ajoute mes 2 entrées chez chaque produit à son ouverture.
  - preuve : `relever-heritage` 41/41, `recopier-heritage` 20/20, conformité 184/184, `ingerer-r47` 10/10, `oracle-empreintes` PASS, `oracle-todo` PASS.
- **2 défauts révélés par le harnais après fusion (218/221), corrigés** : la recette du hook d'ouverture jugeait le doublon de hook tous événements confondus, conflit de sens né de la fusion ; le juge des lots se taisait sous un chemin à nom court Windows, défaut plus ancien, corrigé en 1.8.1.
  - preuve : `hook-ouverture.test` 33/34 → 34/34 ; `oracle-lot-retours.test` 89/90 → 90/90.
- **4 défauts nés du travail avant fusion**, trouvés par le premier harnais (215/220) et corrigés.
  - preuve : conformité 163/172 → 172/172, `ingerer-r47` 8/10 → 10/10, `oracle-empreintes` FAIL → PASS, sens rouge lu sur 205/205 recettes au second harnais.

## 5. Non traité — avec son motif

- La publication des 3 enregistrements — motif : `dependance_bloc_3`, D-4.
- Le rouge K11 (copie installée identique à un état antérieur de sa source) d'`oracle-skills` (96/98), identique sur l'arbre publié exporté — motif : `hors_perimetre`, antérieur à ce travail ; annoté sur TF-1611, dont il peut être une récidive.
- Le manifeste de reprise de Produit-12 — motif : `hors_perimetre`, geste de la session du produit, que son gabarit guide à sa prochaine ouverture ; aucun mandat d'écriture chez lui n'est déclaré.

## 6. Écarts à la lettre

- **Vous avez choisi (b), « décider les 5 gestes »** → **je les ai aussi exécutés et clos** → **pourquoi** : l'action A-3 de la synthèse précédente, que votre choix déclenchait, disait « décider et traiter selon l'option choisie ».
- **Le lot proposait que le hook restaure « sans le demander » tout ce que porte le canal** → **les secrets en sont exclus dans les deux sens, quelle que soit la liste du manifeste** → **pourquoi** : le garde-fou du pilot « les .env ne transitent jamais » prime ; un secret se ressaisit sur chaque poste.
- **Je n'ai touché au juge des lots que pour son lancement direct** → hors de la reprise demandée → **pourquoi** : le harnais le rendait rouge sur ce poste, et le défaut faisait passer un lot sans jugement, en silence.

## 7. Risques

- L'autre poste peut publier encore avant moi et reprendre S77, 2.40.0 ou 1.26.0.
  - signal : `git status -sb` « behind » au moment de publier ;
  - parade : nouvelle fusion avant l'envoi, numéros vérifiés à ce moment-là, comme ce soir.
- Deux postes qui modifient le même fichier entre deux synchronisations : le plus récent gagne.
  - signal : ligne « écrasé(s) par plus récent, version précédente sauvegardée » à l'ouverture du produit ;
  - parade : la version écrasée reste sous `~/.digit-ai-forge/reprise/sauvegardes/`.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Refusionner si besoin, puis publier les 3 enregistrements avec votre feu vert cité | `auto_ia` | TF-1736 | `dependance_bloc_3` — D-4 | l'autre poste ne voit pas la reprise |
| **A-2** | Instruire le rouge K11 d'`oracle-skills` | `auto_ia` | TF-1611 | `dependance_bloc_3` — réouverture par décision | la recette reste rouge au harnais |
| **A-3** | Répondre à D-4 | `manuelle_utilisateur` | TF-1736 | `decision` | les enregistrements restent locaux |

## 9. Traces

`REGLES-PROJET.md` (section AS), `gabarits/REPRISE.json`, `gabarits/CLAUDE-PRODUIT.md`, `gabarits/HERITAGE.json`, `gabarits/settings-produit.json`, `gabarits/hooks-factory.mjs`, `gabarits/oracle-lot-retours.mjs`, `oracles/oracle-reprise.mjs`, `oracles/hook-reprise.mjs`, `oracles/oracle-synthese.mjs`, `references/EMPREINTES.md`, `todo/TODO.jsonl`, `todo/CLASSES.json`, enregistrements `c609bfb7`, `808a98ca`, `8d11de37`.
