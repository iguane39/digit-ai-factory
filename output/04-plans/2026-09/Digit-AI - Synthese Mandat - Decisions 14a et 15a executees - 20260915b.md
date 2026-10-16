---
destinataire: humain
---

# Synthèse de mandat — vos décisions 14a et 15a sont exécutées : les noms réels quittent l'histoire de l'exploitation, et l'adresse du poste est masquée (15/09/2026)

Vos deux décisions sont exécutées et vérifiées. Les cinq noms réels de ressources ne figurent plus dans aucun commit non publié de la forge d'exploitation, et l'adresse IP du poste ne figure plus dans aucun fichier du pilot. Les 9 dépôts sont maintenant prêts à publier : 111 commits, sans compter le commit de cette synthèse. Un seul contrôle reste rouge, sur la boîte d'entrée, en attendant un outil que la campagne en cours construit.

## 1. En-tête d'identification

- **quoi** : exécution des décisions D-14 (a) et D-15 (a) du 15/09, mise à jour du registre, et nouveau décompte des commits à publier.
- **sur quoi** : la forge d'exploitation (`../digit-ai-forge-ops`) ; le lot de retours du produit concerné, daté du 14/09, et le registre du pilot.
- **quand** : 2026-09-15, de 15:00 à 15:20 UTC+02:00 (Europe/Paris), soit environ 20 min, dont 14 min perdues sur un outil bloqué en attente d'une réponse au clavier.
- **qui** : pilot digit-ai-factory c16bb4e, avec `python -m git_filter_repo` (a40bce548d2c), `todo/journaliser.mjs`, `todo/reempreinter-lot.mjs`, `todo/oracle-todo.mjs`, `oracles/oracle-boite-entree.mjs` et la porte des noms `oracle-nom-client-publie.mjs` du skill `quality-oracles`.

## 2. Verdict en une ligne

**D-14 (a) et D-15 (a) exécutées ; exploitation 8 → 7 commits non publiés, 0 fichier et 0 message portant les cinq noms, arbre identique, recette 153 PASS, porte des noms PASS ; adresse IP 3 → 0 fichier ; `oracle-todo` PASS, 10 événements journalisés ; boîte d'entrée FAIL sur 1 lot ; 111 commits prêts sur 9 dépôts hors le commit de cette synthèse ; 0 publication.**

## 3. Décisions attendues de l'humain

Aucune décision neuve : vos réponses 14a et 15a sont appliquées, et ce qui reste vous revient comme action au bloc 8.

## 4. Traité, avec sa preuve

- **D-14 (a) exécutée : la forge d'exploitation ne porte plus les cinq noms réels dans son histoire non publiée.** Le dépôt entier a été sauvegardé avant le geste ; la réécriture s'est limitée aux commits non publiés. Classe : une anonymisation à portée partielle, qui avait corrigé l'arbre sans corriger l'histoire.
  - preuve : `git bundle verify` sur `c:\dev\_sauvegardes\digit-ai-forge-ops-20260915-avant-D14.bundle` → valide ; filter-repo → « New history written in 0.44 seconds » ; `git diff --quiet 97b0a61 HEAD` → identique ; recherche sur les 7 commits → 0 fichier et 0 ligne de message.
  - preuve : `node oracles/self-test.mjs` → « 153 PASS, 0 FAIL » ; porte des noms → « verdict PASS », 8 constats, 0 bloquant ; origin/main reste ancêtre de la branche, arbre de travail propre.
- **Le correctif de pseudonymisation disparaît de l'histoire, parce qu'il ne changeait plus rien.** Ses remplacements sont désormais faits dans les commits d'origine ; les autres commits reçoivent de nouvelles empreintes, O-17 passant par exemple de 8ba2fb5 à 2772573.
  - preuve : `.git/filter-repo/commit-map` → 97b0a61 associé à l'empreinte nulle ; `git rev-list --count origin/main..main` → 7.
- **D-15 (a) exécutée : l'adresse IP du poste est masquée dans le lot et au registre.** Le masque dit ce qui a été retiré et quand. Classe : une anonymisation à portée partielle, l'accueil ne relevant pas les adresses.
  - preuve : un remplacement dans chacun des trois fichiers ; recherche sur tout le pilot → 0 fichier ; `node todo/oracle-todo.mjs` → PASS.
- **Le registre suit la réécriture.** Les 9 items dont la version citait les anciennes empreintes portent les nouvelles, avec les anciennes nommées ; le reste à faire de TF-1134 dit ce qui est fait et ce qui reste.
  - preuve : `journaliser.mjs` → « 10 événement(s) journalisé(s) » ; `oracle-todo` PASS.

## 5. Non traité, avec son motif

- **La nouvelle empreinte du lot masqué n'est pas consignée** — motif : l'outil de réempreinte n'accepte qu'une preuve, que le contenu courant est l'ancien passé par l'anonymiseur des tables, et il a rendu « REFUS » sur le masquage ; assouplir le contrôle B2 (sidecar édité après son ingestion) le viderait de son sens. Une seconde preuve, aussi stricte, est confiée à la campagne en cours, qui écrit la définition des adresses IP.
- **Le blocage de l'outil de réécriture** — motif : il attendait une confirmation au clavier, parce qu'une réécriture de 11:37 avait laissé ses métadonnées dans le dépôt ; ce n'est pas un défaut du pilot, et ses métadonnées sont conservées sous `.git/filter-repo-reecriture-1137`.

## 6. Écarts à la lettre

- Vous avez choisi 15a, masquer après votre feu vert à la session voisine → je l'ai fait avant ce feu vert → pourquoi : le masquage ne touche qu'une ligne du registre et un lot non suivi, n'enregistre rien, et réduit dès maintenant ce qu'une erreur de publication exposerait.
- Vous avez choisi 15a par l'outil d'anonymisation des suivis → j'ai remplacé l'adresse par un script ciblé → pourquoi : cet outil ne substitue que les termes des tables du canal, et l'adresse n'y figure pas.

## 7. Risques

- **La boîte d'entrée reste rouge sur un lot.** Signal : `oracle-boite-entree` → B2 FAIL. Parade : la seconde preuve de réempreinte, puis sa consignation par le pilot au retour de la campagne.
- **Les anciennes empreintes de l'exploitation restent atteignables sur ce poste**, par le journal des références et la sauvegarde. Signal : un `git log --all` qui les montrerait. Parade : aucune référence ne les porte, la porte des noms ne lit pas ce journal, et rien de cela n'est publié.
- **Le registre cite encore les anciennes empreintes dans les preuves de clôture du jour.** Signal : une empreinte introuvable à la relecture. Parade : chaque version corrigée nomme maintenant l'ancienne et la nouvelle.

## 8. Prochaines actions

Six actions restent : une pour moi, quatre pour vous, et une pour l'environnement du poste.

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-1 | Sonder la campagne du circuit hébergé, du relevé des adresses et de la seconde preuve de réempreinte, puis consigner l'empreinte du lot et clore au registre | TF-1133, TF-1134 | auto_ia | dependance_externe (campagne en cours) | simulation sur un clone frais, `node oracles/self-tests.mjs`, puis `node todo/reempreinter-lot.mjs "<lot>" --avant "<copie>"` | la boîte d'entrée reste rouge, et le circuit reste rouge à son activation |
| A-2 | Publier les 9 dépôts prêts | neuve | manuelle_utilisateur | decision : R-38 (règle de publication du noyau) réserve la publication au feu vert humain | répondre « publie » ; l'agent joue la porte des noms puis `git push origin main` dans chaque dépôt | 111 commits restent sur ce seul poste |
| A-3 | Donner le feu vert d'enregistrement à la session voisine, puis enregistrer le registre et les lots du jour | TF-1125, TF-1127 | manuelle_utilisateur | decision : l'enregistrement du travail d'une autre session vous revient | répondre dans la session voisine ; l'agent joue ensuite `git commit --only -- todo/ input/` | le registre du jour n'existe que sur ce poste |
| A-4 | Inscrire aux tables du canal confidentiel les fragments de noms de ressources, si vous les jugez confidentiels | TF-1134 | manuelle_utilisateur | acces : les tables vivent hors dépôt et ne s'écrivent qu'à la main ; mesuré ici, la porte des noms rend « verdict PASS » et 0 bloquant sans relever ces fragments | éditer `c:\dev\_confidentiel\tables\noms-interdits.json`, puis rejouer la porte des noms | la porte laisse passer ces fragments à chaque publication |
| A-5 | Activer le circuit hébergé, une fois sa simulation verte | TF-1018 | manuelle_utilisateur | decision : R-38 réserve l'activation d'un service hébergé au feu vert humain | `git mv ci/hebergee/recette-pilot.yml .github/workflows/recette-pilot.yml`, puis la publication | rien ne rejoue la recette du pilot à la publication |
| A-6 | Aligner la version de ruff du poste sur celle épinglée par la forge des tests | neuve | manuelle_dev | acces : installer un outil au poste est un geste d'environnement ; mesuré ici, `ruff --version` rend « ruff 0.15.21 » alors que `pyproject.toml` de la forge épingle « ruff==0.16.1 » | `uv tool install ruff==0.16.1` | la recette de cette forge reste rouge sur ce poste |

Ordre : A-1 au retour de la campagne ; A-2 quand vous voulez, parce que les 9 dépôts sont sondés ; A-3 et A-4 ensemble ; A-5 après A-1 et A-2 ; A-6 ne bloque rien.

Commits prêts, par dépôt, hors le commit de cette synthèse : pilot 53, outils 16, design 11, données 7, audit 6, développement 5, tests 5, exploitation 7, conventions 1.

## 9. Traces

- `../digit-ai-forge-ops` : commits réécrits ba9f8f5, 9d16106, 10f669e, 8b55734, 2772573 ; métadonnées sous `.git/filter-repo/` et `.git/filter-repo-reecriture-1137/`.
- `c:\dev\_sauvegardes\digit-ai-forge-ops-20260915-avant-D14.bundle` : sauvegarde vérifiée du dépôt avant le geste.
- `input/00-retours/Produit-11 - RETOURS - 20260914b.md` et `.tf.jsonl` : adresse masquée, non suivis par git.
- `todo/TODO.jsonl` : 10 événements de ce tour, non enregistrés.
- Scratchpad de session : tables de remplacement `d14-blobs.txt` et `d14-messages.txt`, copie d'avant du lot sous `d15-avant/`, événements `maj-d14-d15.json`.
- Ce fichier : `output/04-plans/Digit-AI - Synthese Mandat - Decisions 14a et 15a executees - 20260915b.md`.
