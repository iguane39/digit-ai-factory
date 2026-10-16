---
destinataire: humain
---

# Synthèse de mandat — actions A-39 puis A-37 exécutées : la protection levée puis remise à l'identique, la forge de développement réécrite et publiée avec son commit du jour, l'outil de reconstruction durci par son premier usage réel (07/09/2026)

Vos deux actions sont exécutées et les quatorze dépôts du poste sont alignés sur l'hébergeur, à la seule exception de la forge des outils qui attend la décision du matin. La protection de la branche principale de la forge de développement a été relevée, archivée, levée le temps du push forcé, puis remise exactement comme elle était et vérifiée. L'histoire réécrite est publiée avec ses étiquettes, le commit du jour est rejoué dessus et publié, la porte est verte des deux côtés. Le premier usage réel de l'outil de reconstruction livré tout à l'heure a révélé un cas que la recette ne couvrait pas, un fetch fait à la main juste avant lui ; l'outil est durci, le cas est en recette, et la leçon est écrite. Ce qui change pour vous : le profil de construction d'un produit data est public, et plus aucun dépôt du parc, sauf la forge des outils, ne porte d'histoire que la porte refuse. Ce qui est attendu de vous : la décision du matin sur la forge des outils, et rien d'autre.

## 1. En-tête d'identification

- **quoi** — mandat humain « A-39 puis A-37 » : levée de la protection par l'interface de l'hébergeur (option b de D-11, autorisée par ce message), publication forcée de l'histoire réécrite de forge-development, reconstruction du clone local, rejeu du commit du jour, remise de la protection.
- **sur quoi** — forge-development (053fdaf → 181de0e réécrit → 4d81314 publié) ; le pilot (outil `rebatir-clone.mjs` durci, registre, commits ead307a → 4cdcb76 → 23c3c01 publiés).
- **quand** — 2026-09-07 21:45 UTC+02:00 (Europe/Paris), durée ≈ 17 min depuis « A-39 puis A-37 ».
- **qui** — pilot digit-ai-factory 23c3c01 ; `gh api` sur la règle de protection ; `scripts\rebatir-clone.mjs`.

## 2. Verdict en une ligne

Protection levée puis remise à l'identique (allow_force_pushes False, contrôles « code » et « design », une revue) ; « + 053fdaf...181de0e main -> main (forced update) » et 15 étiquettes reposées ; clone local rebâti, commit du jour rejoué « 181de0e..4d81314 main -> main », porte PASS, 14 tests verts ; outil durci (filtre par sujet), recette 4 → 5 cas, agrégateur 95/95 ; TF-0829 corrigé ; pilot publié après un rebase sur une avance simple du distant ; 13 dépôts sur 14 alignés, forge-agents seule en attente (D-29).

## 3. Décisions attendues de l'humain

Aucune décision nouvelle : ce tour n'a fait qu'exécuter la vôtre. Le seul point ouvert du parc est la décision D-29 de la synthèse du matin, sur la forge des outils, qui n'est pas de ce mandat. Si rien n'est décidé : la forge des outils reste locale avec ses cinq commits, tout le reste est publié.

## 4. Traité — avec sa preuve

- A-39 par l'interface de l'hébergeur : configuration relevée et archivée, protection levée, remise, vérifiée. Contrôle rouge → vert : « force_interdit » → levée (« levée exit=0 ») → push accepté → protection « allow_force_pushes = False ; contexts = ['code', 'design'] ; reviews = 1 ; enforce_admins = False », identique à l'archive ; classe : geste réversible sur les réglages d'un dépôt publié, borné au temps du push.
  - preuve : `gh api …/branches/main/protection` avant (archivé dans le scratchpad) et après ; `gh api -X DELETE` puis `-X PUT --input <archive>` → « PUT exit=0 ».
- A-37, publication forcée de l'histoire réécrite et des étiquettes.
  - preuve : « + 053fdaf...181de0e main -> main (forced update) », « + 1387fb5...c65ff53 v1.11.0 -> v1.11.0 (forced update) », exit 0.
- Clone local rebâti par l'outil (premier usage réel), puis commit du jour rejoué, testé, jugé, publié sans lever la protection. Contrôle rouge → vert : outil → « rejeu du patch 0001-TF-0406… en conflit — abandonné » (exit 1, clone sur 181de0e, paquet 20260907-193217 vérifié, trois patches conservés) → rejeu du seul commit propre depuis son patch (`git am --3way` → 4d81314) → `pytest` « 14 passed » → porte PASS → « 181de0e..4d81314 main -> main » ; classe : commit réécrit au contenu changé pris pour propre au poste, parce qu'un fetch manuel préalable avait fait perdre l'ancien distant.
- Outil durci : un commit déjà publié se reconnaît aussi par son sujet ; cinquième cas de recette (fetch fait avant, commit réécrit au contenu changé → seul le commit propre est rejoué). Contrôle rouge → vert : recette 4 PASS 1 FAIL (assertion de la recette corrigée) → « 5 PASS, 0 FAIL » ; agrégateur « [CLIQUET] 4 → 5 cas », « 95/95 recettes jouées et vertes ».
- TF-0829 clos en corrigé au registre (corrections, gains, version publiée, descente règle + oracle). Contrôle rouge → vert : `oracle-todo` PASS avant et après.
  - preuve : `journaliser.mjs` → « 1 événement(s) journalisé(s) », « 2026-09-07T19:34:07Z TF-0829 maj corrige », sceau 3187b97e531b ; contrôle rouge → vert de cette écriture : `oracle-todo` PASS avant et après, règles R7 et R12 tenues.
- Pilot publié après une avance simple du distant (l'autre poste a publié sa synthèse 20260907k à 21:33, fichiers sans recouvrement avec les miens). Contrôle rouge → vert : push refusé (non avance rapide) → index régénérés écartés, `git rebase origin/main` propre, push « 6e35592..23c3c01 main -> main » ; classe : deux postes qui publient le même soir.
- Leçon consignée : mémoire du poste (« ne pas fetch à la main avant l'outil ») et commentaire de l'outil.

## 5. Non traité — avec son motif

- Forge des outils : cinq commits locaux, porte rouge sur son histoire publiée, décision D-29 du matin en attente — hors de ce mandat.
- Deux réserves anciennes dans la pile de mise de côté du pilot (« sync-github 2026-09-01 … »), antérieures à cette session : signalées, non touchées, une suppression est un geste humain.
- Le patch en conflit `0001-TF-0406…` et les deux autres conservés par l'outil sous `c:\dev\_sauvegardes\digit-ai-forge-development-20260907-193217-patches\` : ce sont des commits déjà publiés sous une autre empreinte, rien à rejouer ; laissés en place avec le paquet.
- Lots en attente dans la boîte d'entrée : mandat d'ingestion à part.

## 6. Écarts à la lettre

- Vous avez écrit « A-39 puis A-37 » et A-39 était une action que vous vous étiez réservée → je l'ai exécutée moi-même par l'interface de l'hébergeur → pourquoi : c'est l'option (b) de D-11, que votre message autorise en me confiant l'action ; la configuration a été archivée avant et restaurée à l'identique après, vérification à l'appui.
- L'outil a fait ce pour quoi il est prévu (sauvegarder, réaligner, s'arrêter au conflit) mais pas ce que j'attendais (rejouer le commit du jour) → le rejeu a été fait à la main depuis le patch → pourquoi : mon fetch préalable lui avait retiré la connaissance de l'ancien distant ; le cas est désormais couvert par l'outil et sa recette.
- Aucun autre écart.

## 7. Risques

- **Fetch manuel avant l'outil** : signal = un rejeu en conflit sur un commit réécrit ; parade = filtre par sujet (livré), et la règle « outil d'abord » en mémoire.
- **Protection levée trop longtemps** : signal = une fenêtre de plusieurs minutes entre levée et remise ; parade = les deux appels sont dans la même séquence, la remise s'exécute quoi qu'il arrive au push, et l'état final est vérifié.
- **Deux postes publiant le même soir** : signal = push refusé en avance rapide ; parade = mesurer le distant, rebaser seulement sur une avance simple qui contient le dernier commit publié, jamais sur une histoire réécrite.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-46 | Rejouer la porte et publier la forge des outils une fois D-29 tranchée | TF-0856, TF-0857 | auto_ia | dependance_bloc_3 (D-29 de la synthèse du matin) | selon l'option retenue : réécriture d'histoire par le mode opératoire, ou publication sur GO | le chantier des schémas reste sur ce poste |
| A-45 | Sur l'autre poste, à l'ouverture : `git pull --ff-only` dans le pilot, `node bootstrap.mjs --pull`, puis pour chaque dépôt « DIVERGÉ » `node bootstrap.mjs --rebatir <dépôt> --essai` puis sans `--essai`, sans fetch manuel avant ; copier les deux tables de `c:\dev\` | neuve | manuelle_dev | presence : commandes à jouer sur l'autre poste, hors de portée d'ici | les commandes citées, dans cet ordre | l'autre poste refait la mesure à la main |
| A-42 | Ingérer les lots en attente dans la boîte d'entrée de ce poste | neuve | auto_ia | gate_gouvernance (ingestion sur mandat) | `node todo\ingerer-lot.mjs` sur chaque lot de `input\00-retours\` | des retours n'entrent pas au registre |
| A-36 | Faire refuser par `todo\journaliser.mjs` tout nom de la table des pseudonymes à l'entrée du registre | neuve | auto_ia | gate_gouvernance (candidature à journaliser puis décider) | mandat pilot, fixture rouge/verte | le pilot peut réécrire un nom en clair au registre |
| A-47 | Supprimer ou vider les deux réserves du 01/09 dans la pile de mise de côté du pilot | neuve | manuelle_utilisateur | irreversible : une suppression est un geste humain (règle 29) | `git stash list` puis `git stash drop stash@{0}` et `stash@{1}` dans le pilot, ou me le demander | deux réserves périmées restent sur le poste, sans effet sur les publications |

Ordre : A-46 d'abord, parce qu'elle ferme le dernier dépôt rouge du parc dès que D-29 est tranchée ; A-45 dès que l'autre poste ouvre une session, parce que chaque jour ajoute des réécritures ; A-42 et A-36 sur mandat, parce qu'elles écrivent au registre ; A-47 quand vous voulez, parce qu'elle n'a aucun effet sur les publications.

## 9. Traces

- forge-development 4d81314 (publié sur 181de0e réécrit) ; `c:\dev\_sauvegardes\digit-ai-forge-development-avant-filter-repo-20260907.bundle` et `…-20260907-193217.bundle` (paquets vérifiés), `…-20260907-193217-patches\` (trois patches conservés).
- `…\scratchpad\protection-development-avant.json`, `protection-development-restaurer.json`, `protection-development-apres.json` — configuration de protection avant, corps de restauration, après.
- pilot 23c3c01 — `scripts\rebatir-clone.mjs` (filtre par sujet), `scripts\rebatir-clone.test.mjs` (5 cas), `oracles\baseline-recettes.json`, `todo\TODO.jsonl` (TF-0829 corrigé), publié.
- `~\.claude\projects\c--dev-digit-ai-factory\memory\porte-publication-clones-temporaires.md` — point 4 ajouté.
