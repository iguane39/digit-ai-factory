---
destinataire: humain
---

# Synthèse de mandat — décision D-10 (a) exécutée : deux histoires réécrites et publiées avec leur commit du jour, la troisième réécrite et retenue par sa protection de branche (07/09/2026)

Votre décision d'étendre la réécriture d'histoire aux trois forges retenues est exécutée pour deux d'entre elles : la forge de design et la forge de tests ont chacune un paquet de sauvegarde vérifié, une histoire réécrite sur clone frais selon le mode opératoire du pilot, une porte de publication verte, une publication forcée avec leurs étiquettes reposées, et leur commit du jour rejoué puis publié sur l'histoire propre. La forge de développement a la même histoire réécrite prête et jugée verte, mais sa branche principale est protégée chez l'hébergeur : aucun push forcé n'y passe sans un geste sur cette protection, qui vous revient. Deux pièges rencontrés en route sont consignés au mode opératoire et à la mémoire du poste. Ce qui change pour vous : le thème Power BI et la composition des tests sont publics ; le profil de construction d'un produit data ne l'est pas encore. Ce qui est attendu de vous : lever ou faire lever, le temps d'un push, la protection de la branche principale de la forge de développement.

## 1. En-tête d'identification

- **quoi** — mandat humain « 10a » sur la restitution de 16:50 : réécriture d'histoire des trois forges retenues (mode opératoire TF-0752), rejeu des commits du jour, publication.
- **sur quoi** — forge-design (1b0069c → b5051c5 réécrit, 1063aed publié), forge-tests (609f3f1 → c5c0eb1 réécrit, 4ebb0bc publié), forge-development (053fdaf → 181de0e réécrit dans le scratchpad, non publié), le pilot (registre, mode opératoire, cette synthèse).
- **quand** — 2026-09-07 17:13 UTC+02:00 (Europe/Paris), durée ≈ 22 min depuis « 10a ».
- **qui** — pilot digit-ai-factory 3030cd4 ; `git filter-repo` 2.47.0 par le module Python ; `scripts/generer-remplacements-historique.mjs` du pilot ; porte `oracle-nom-client-publie`.

## 2. Verdict en une ligne

3 paquets de sauvegarde vérifiés ; 44 règles et 35 paires de noms dérivées des deux tables ; 3 histoires réécrites sur clone frais (design 70 → 69 commits, tests 182, development 266 → 264), porte PASS sur les trois clones réécrits ; 2 publications forcées (design : main + 14 étiquettes ; tests : main + 17 étiquettes) puis 2 commits du jour rejoués et publiés, porte PASS sur les clones locaux ; 1 réécriture retenue (development : protection de branche, `allow_force_pushes = False`) ; registre : TF-0867 et TF-0868 corrigés, TF-0829 décidé et en cours.

## 3. Décisions attendues de l'humain

Une seule décision reste, et elle porte sur la troisième forge du mandat : la forge de développement a son histoire réécrite et jugée verte dans un clone frais, son paquet de sauvegarde vérifié et son commit du jour sauvé en patch, mais la branche principale du dépôt publié est protégée chez l'hébergeur, ce qui interdit tout push forcé tant que la protection n'est pas levée ; ce geste sur les réglages du dépôt est réservé à l'humain par la doctrine du pilot.

> **D-11 — Levez-vous la protection de la branche principale de la forge de développement le temps d'un push forcé, ou m'autorisez-vous à la lever et à la remettre moi-même par l'interface de programmation de l'hébergeur ?**
> L'histoire réécrite de la forge de développement est prête dans le clone frais du scratchpad, jugée verte par la porte, son paquet de sauvegarde vérifié ; le commit du jour est sauvé en patch. La protection de la branche principale, relevée chez l'hébergeur, interdit le push forcé et exige des contrôles ; la synthèse du 6 septembre avait déjà laissé cette forge de côté pour la même raison, et le registre le porte depuis le 5 septembre. Une protection se lève et se remet en deux appels à l'interface de programmation ; le geste est réversible, mais il ouvre la branche à toute écriture pendant le temps du push, et c'est pourquoi la doctrine le réserve à l'humain.
> **Recommandation : (b).** Source consultée : `gh api repos/iguane39/digit-ai-forge-development/branches/main/protection` → « allow_force_pushes = False ; required_status_checks = True » ; les deux candidatures du registre sur la forge de développement (histoire du dépôt, messages de commit) ; synthèse 20260906n (« Forge-development non réécrite : sa branche principale est protégée … la levée est votre geste ») ; mode opératoire de réécriture d'histoire du pilot (« vérifier la protection AVANT de réécrire »).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Vous levez la protection dans les réglages de l'hébergeur, je pousse en force et rejoue le commit du jour, vous remettez la protection | Deux gestes de votre part, un push forcé et un push ordinaire de ma part, simple × court | Rien |
| (b) Vous m'autorisez à lever puis remettre la protection par l'interface de programmation (`gh api -X DELETE …/protection`, push, puis restauration à l'identique de la configuration relevée) | Un GO de votre part, quatre gestes d'agent, simple × court ; la configuration d'avant est archivée et restaurée, le résultat vous est montré | Rien, si le jeton de l'hébergeur a le droit d'administration ; sinon repli sur (a) |
| (c) Laisser forge-development en local | Aucun coût | Le profil `data-transformation` reste sur ce poste ; la porte de la forge reste rouge sur son histoire publiée |

> **Si rien n'est décidé** : (c) — le clone réécrit du scratchpad disparaît avec la session, le paquet de sauvegarde et les règles permettent de rejouer la passe plus tard.

## 4. Traité — avec sa preuve

- Sauvegardes entières des trois forges avant réécriture.
  - preuve : `git bundle create … --all` puis `git bundle verify` → forge-design 16 Mo, forge-development 1,1 Mo, forge-tests 3,1 Mo sous `c:\dev\_sauvegardes\` ; HEAD d'avant : 1b0069c, 053fdaf, 609f3f1.
- Règles dérivées des deux tables hors git, jamais écrites à la main.
  - preuve : `generer-remplacements-historique.mjs` → « regles_contenu_et_messages: 44, paires_noms_de_fichiers: 35 ».
- Trois histoires réécrites sur clone frais de ce qui est publié.
  - preuve : `python -m git_filter_repo --replace-text --replace-message --filename-callback --force` → « Completely finished » ; design 70 → 69 commits (b5051c5), tests 182 (c5c0eb1), development 266 → 264 (181de0e) ; porte sur chaque clone réécrit → `PASS`, « aucun des 10 terme(s) du référentiel, ni des 14 nom(s) de produit ».
- forge-design publiée avec son commit du jour. Contrôle rouge → vert : porte FAIL (2 constats C5 (nom de produit dans un message de commit) dans l'histoire publiée) → PASS sur le dépôt publié et sur le clone local ; classe : histoire publiée portant un nom de produit.
  - preuve : « + 1b0069c...b5051c5 main -> main (forced update) », « v1.11.0 -> v1.11.0 (forced update) » ; clone local `reset --hard origin/main` puis `git am` → « commit du jour rejoué : 1063aed » ; self-test → « Tout vert — 35 oracles, 111 règles » ; porte PASS ; « b5051c5..1063aed main -> main ».
- forge-tests publiée avec son commit du jour. Contrôle rouge → vert : porte FAIL (20 constats C5) → PASS sur le dépôt publié ; sur le clone local, FAIL (13 commits encore atteignables) → PASS après retrait de l'arborescence liée ; classe : histoire publiée portant un nom de produit, plus une copie de travail oubliée.
  - preuve : « + 609f3f1...c5c0eb1 main -> main (forced update) », « v1.9.0 -> v1.9.0 (forced update) » ; `git am` → « 4ebb0bc » ; `pytest` hors le fichier de TF-0866 → « [100%] » ; `git worktree list` → `…/Temp/avant f1aff99 (detached HEAD)` ; `git rev-list --all --count` 262 → 183 après `git worktree prune` ; porte PASS ; « c5c0eb1..4ebb0bc main -> main ».
- Pièges consignés : mode opératoire du pilot complété (tables à désigner hors `c:\dev`, arborescences liées, lancement du module Python) et mémoire du poste.
  - preuve : `references\TODO-FORGE.md`, paragraphe « Ce que la quatrième passe a appris » ; mémoire `porte-publication-clones-temporaires.md`.
- Registre : TF-0867 et TF-0868 décidés puis corrigés (corrections, gains, versions publiées, descente), TF-0829 décidé et en cours. Contrôle rouge → vert : `oracle-todo` PASS avant et après.
  - preuve : `journaliser.mjs` → « 6 événement(s) journalisé(s) », 2026-09-07T15:11:07Z ; vues régénérées, sceau 47b72fdb6db6.

## 5. Non traité — avec son motif

- Publication de forge-development : la protection de branche interdit le push forcé ; sa levée est un geste humain (D-11).
- Reconstruction du clone local de forge-development : après publication seulement ; le commit du jour a7c2ecf est sauvé en patch dans le scratchpad, à rejouer.
- Le dossier temporaire `…/Temp/avant` de forge-tests : son enregistrement est retiré, ses fichiers sont laissés en place ; supprimer un dossier est un geste humain.
- Forge des outils : hors de ce mandat (D-29).

## 6. Écarts à la lettre

- Vous avez demandé « 10a » (les trois forges) → deux publiées, la troisième réécrite sans publication → pourquoi : la protection de branche de l'hébergeur refuse le push forcé, et sa levée n'est pas un geste d'agent sans votre GO.
- Le mode opératoire prescrit « toute autre copie locale … à recloner, pas à fusionner » → les clones locaux ont été rebâtis par `fetch` puis `reset --hard origin/main` dans le même dossier, sans reclonage → pourquoi : même résultat sur l'histoire, sans supprimer un dossier du parc (geste humain) ; l'arborescence liée résiduelle a été vue et retirée, et la porte PASS le prouve.
- Aucun autre écart.

## 7. Risques

- **Clone réécrit du scratchpad perdu avant D-11** : signal = session fermée avant la levée de protection ; parade = le paquet de sauvegarde, les règles et le patch permettent de rejouer la passe en quelques minutes.
- **Étiquettes reposées non reprises ailleurs** : signal = un autre poste avec les anciennes étiquettes ; parade = mode opératoire (« à recloner »), `fetch --tags --force --prune-tags`.
- **Tables étendues après coup** : signal = la porte rougit à nouveau sur une histoire réécrite aujourd'hui, comme le 07/09 sur celles du 06/09 ; parade = le générateur lit les tables au moment du geste, une nouvelle passe reste possible, paquet à l'appui.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-37 | Publier forge-development en force depuis le clone réécrit, rejouer a7c2ecf sur le clone local rebâti, porte, push ordinaire, remettre la protection | TF-0829 | auto_ia | dependance_bloc_3 (D-11) | `git push --force origin main --tags` dans `…/scratchpad/rw-development`, puis `git fetch`/`reset --hard`/`git am` dans `c:\dev\digit-ai-forge-development`, porte, `git push` | le profil `data-transformation` reste sur ce poste |
| A-31 | Corriger TF-0866 (identifiant de test cassé par pseudonymisation) | TF-0866 | auto_ia | gate_gouvernance (candidat) | mandat forge-tests puis pilot (`todo/anonymiser-suivis.mjs`) | toute suite `pytest -x` de forge-tests s'arrête avant de jouer |
| A-36 | Faire refuser par `todo\journaliser.mjs` tout nom de la table des pseudonymes à l'entrée du registre | neuve | auto_ia | gate_gouvernance (candidature à journaliser puis décider) | mandat pilot sur `todo/journaliser.mjs`, fixture rouge/verte | le pilot peut réécrire un nom en clair au registre |
| A-32 | Consigner aux fiches d'audit le premier run réel de chaque oracle nouveau | neuve | auto_ia | dependance_externe (mission non ouverte) | `fiches/<forge>.md` du pilot | les oracles restent exercés sur fixtures seulement |
| A-18 | Revue du verdict de l'étude contre le « où » réel de la mission le 2026-09-21 | neuve | auto_ia | dependance_externe (mission non ouverte) | rejouer la section 2 de l'étude | le plan reste conditionnel |
| A-38 | Répondre à D-11 | neuve | manuelle_utilisateur | decision : lever une protection de branche chez l'hébergeur est un geste réservé à l'humain | répondre dans ce fil par `D-11 (a)`, `D-11 (b)` ou `D-11 (c)` | forge-development reste locale |

Ordre : A-38 d'abord, parce qu'elle conditionne A-37 ; A-36 ensuite, parce qu'elle supprime à la source une classe payée deux fois aujourd'hui ; A-31 dès que TF-0866 est décidé ; A-32 et A-18 à l'ouverture de la mission, parce qu'elles n'ont pas de matière avant.

## 9. Traces

- `c:\dev\_sauvegardes\digit-ai-forge-{design,development,tests}-avant-filter-repo-20260907.bundle` — paquets vérifiés.
- `…\scratchpad\regles-20260907\remplacements.txt` et `filename-callback.py` — règles du geste (jamais copiées dans un dépôt) ; `…\scratchpad\rw-development` — clone réécrit 181de0e ; `…\scratchpad\patches\development\0001-*.patch` — commit du jour.
- `..\digit-ai-forge-design` 1063aed, `..\digit-ai-forge-tests` 4ebb0bc — publiés sur histoire réécrite.
- `references\TODO-FORGE.md` — paragraphe « Ce que la quatrième passe a appris » ; `todo\TODO.jsonl` — événements 2026-09-07T15:11:07Z ; `todo\TODO.md` sceau 47b72fdb6db6.
- `~\.claude\projects\c--dev-digit-ai-factory\memory\porte-publication-clones-temporaires.md` — mémoire du poste.
