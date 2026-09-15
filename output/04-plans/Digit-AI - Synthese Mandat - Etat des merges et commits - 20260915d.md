---
destinataire: humain
---

# Synthèse de mandat — tout n'est pas encore commité, et une branche ancienne n'est pas fusionnée (15/09/2026)

Non, pas tout. Les forges ont toutes un arbre propre et une seule branche, main, sauf la forge de développement, qui garde une branche ancienne publiée : son contenu est déjà entièrement dans main, et je vous propose de la supprimer. Dans le pilot, ce qui reste non commité attend votre feu vert à la session voisine : le registre, ses vues, les lots de retours du jour et mes candidatures partent ensemble, sinon un clone frais deviendrait incohérent. Rien n'est publié : 116 commits attendent votre « publie », sans compter le commit de cette synthèse.

## 1. En-tête d'identification

- **quoi** : état des fusions et des commits dans les 16 dépôts de `c:\dev`, en réponse à votre question « Tout est mergé et commité ? ».
- **sur quoi** : le pilot, les 13 forges, le produit marketing et le dépôt de file d'attente, lus sans écriture.
- **quand** : 2026-09-15, de 16:30 à 16:45 UTC+02:00 (Europe/Paris), soit environ 15 min.
- **qui** : pilot digit-ai-factory 1a7e4f9, avec `git status`, `git branch --no-merged`, `git cherry`, `git ls-remote` et la porte des noms `oracle-nom-client-publie.mjs` du skill `quality-oracles`.

## 2. Verdict en une ligne

**16 dépôts sur main ; 1 branche non fusionnée (forge de développement, 115 commits, tous déjà présents dans main, porte des noms PASS) ; 0 arborescence liée, 0 remisage ; 14 dépôts à arbre propre, dont toutes les forges ; pilot 70 entrées non commitées, dont 24 à moi, toutes ingérées ; produit marketing 7 fichiers non suivis, hors mandat ; 116 commits à publier hors le commit de cette synthèse ; 0 publication.**

## 3. Décisions attendues de l'humain

> **D-16 — Faut-il supprimer, sur ce poste et sur GitHub, la branche ancienne de la forge de développement dont tout le contenu est déjà dans main ?**
>
> La forge de développement garde une branche de correctif née avant la réécriture de son histoire du 07/09. Elle ne partage aucun ancêtre avec main, et chacun de ses 115 commits a son équivalent dans main. Elle est publiée sur GitHub, et chaque clone neuf la récupère.
>
> **Recommandation : (a).** Source consultée : le mode opératoire de la réécriture dans `references/TODO-FORGE.md` (§ canal confidentiel, diagnostic d'un clone rebâti), qui énumère les références divergentes et n'en supprime aucune sans décision humaine (R-29).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Sauvegarder la branche en paquet, puis la supprimer sur ce poste et sur GitHub | environ 5 min, et le paquet reste sous `c:\dev\_sauvegardes\` | rien : son contenu est déjà dans main, commit par commit |
| (b) La garder, en l'écrivant comme exception connue | rien | un dépôt réduit à la seule branche main, et chaque diagnostic de clone la recensera encore |
| (c) Ne rien décider | rien | la même chose que (b), sans trace de la décision |

> **Si rien n'est décidé** : (c). La branche reste publiée, sans défaut de confidentialité mesuré.

## 4. Traité, avec sa preuve

- **Les 16 dépôts sont sur main, sans arborescence liée ni remisage.** Classe : aucune, c'est un relevé.
  - preuve : `git rev-parse --abbrev-ref HEAD` → main partout ; `git worktree list` → 1 par dépôt ; `git stash list` → 0 partout.
- **Une seule branche n'est pas fusionnée, et son contenu est déjà dans main.** Elle vient de l'histoire d'avant la réécriture du 07/09.
  - preuve : `git branch --no-merged main` → `fix/manifeste-opposable-avant-detection-stack` ; `git diff main...<branche>` → « no merge base » ; `git cherry -v main <branche>` → 115 lignes, toutes marquées « - », soit un équivalent présent dans main ; `git ls-remote` → publiée sur GitHub.
  - preuve : porte des noms sur la forge de développement → « verdict PASS », 1 constat d'information, 0 bloquant, aucun lié à la branche.
- **14 dépôts sur 16 ont un arbre propre, dont toutes les forges.** Leurs 58 commits non publiés sont tous commités.
  - preuve : `git status --porcelain` → 0 entrée dans chacune ; `git rev-list --count origin/main..main` → outils 16, design 11, données 7, exploitation 7, audit 6, développement 5, tests 5, conventions 1.
- **Dans le pilot, ce qui m'appartient et reste non commité est entièrement ingéré au registre.** Il s'agit de 8 fichiers de candidatures, créés les 14 et 15/09, et des 8 lots de retours du jour, soit 16 fichiers.
  - preuve : chaque nom de candidature figure au registre (1 mention chacun) ; `oracle-boite-entree` → PASS ; `oracle-todo` → PASS.

## 5. Non traité, avec son motif

- **Le registre, ses vues, les lots du jour et mes candidatures ne sont pas commités** — motif : `todo/TODO.jsonl` porte aussi le travail non enregistré de la session voisine, et les lots sans leurs événements d'ingestion rendraient un clone frais incohérent ; ils partent ensemble, après votre feu vert à cette session (D-11).
- **Les 46 autres entrées non commitées du pilot** — motif : elles appartiennent à la session voisine (juge des restitutions, contrôle d'ouverture, banc des défauts échappés, études et synthèses du 14/09, 6 candidatures déjà indexées), ou mêlent les deux sessions (le registre, ses vues et les index générés) ; je ne les touche pas avant votre feu vert.
- **Les 7 fichiers non suivis du produit marketing** — motif : ils datent des 11 et 12/09, précèdent ce mandat, et le pilot n'écrit pas chez un produit sans mandat. Parmi eux figurent un fichier verrou de bureautique et des documents clients en PDF, à trier par le produit.

## 6. Écarts à la lettre

Aucun écart : la question appelait un relevé, et il est fait sans écriture.

## 7. Risques

- **Une publication du pilot sans son registre.** Signal : un clone frais dont la boîte d'entrée trouve des lots sans ingestion. Parade : les lots et le registre ne partent qu'ensemble, par une seule commande après votre feu vert.
- **Des documents clients non suivis dans le produit marketing.** Signal : un `git add` en masse chez le produit. Parade : la porte de publication du produit, et le tri de ces fichiers par son prochain run.
- **Du travail présent sur un seul poste.** Signal : aucun, jusqu'à la panne. Parade : votre feu vert de publication, avec la porte des noms jouée avant chaque dépôt.

## 8. Prochaines actions

Six actions restent : une pour moi après votre réponse à D-16, quatre pour vous, et une pour l'environnement du poste.

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-1 | Appliquer la réponse à D-16 dans la forge de développement | neuve | auto_ia | dependance_bloc_3 (D-16) | `git bundle create c:\dev\_sauvegardes\digit-ai-forge-development-branche-ancienne.bundle fix/manifeste-opposable-avant-detection-stack`, puis `git branch -D` et `git push origin --delete` sur cette branche | la branche reste publiée et recensée à chaque diagnostic |
| A-2 | Publier les 9 dépôts prêts | neuve | manuelle_utilisateur | decision : R-38 (règle de publication du noyau) réserve la publication au feu vert humain | répondre « publie » ; l'agent joue la porte des noms puis `git push origin main` dans chaque dépôt | 116 commits restent sur ce seul poste |
| A-3 | Donner le feu vert d'enregistrement à la session voisine, puis enregistrer le registre, ses vues, les lots du jour et les candidatures | TF-1125, TF-1127, TF-1133 | manuelle_utilisateur | decision : l'enregistrement du travail d'une autre session vous revient | répondre dans la session voisine ; l'agent joue ensuite `node todo/generer-vue.mjs`, `node todo/generer-page.mjs` puis `git commit --only -- todo/ input/` | le registre du jour n'existe que sur ce poste |
| A-4 | Inscrire aux tables du canal confidentiel les fragments de noms de ressources, si vous les jugez confidentiels | TF-1134 | manuelle_utilisateur | acces : les tables vivent hors dépôt et ne s'écrivent qu'à la main ; mesuré ici, la porte des noms rend « verdict PASS » sans relever ces fragments | éditer `c:\dev\_confidentiel\tables\noms-interdits.json`, puis rejouer la porte des noms | la porte laisse passer ces fragments à chaque publication |
| A-5 | Activer le circuit hébergé, une fois sa simulation verte | TF-1018 | manuelle_utilisateur | decision : R-38 réserve l'activation d'un service hébergé au feu vert humain | `git mv ci/hebergee/recette-pilot.yml .github/workflows/recette-pilot.yml`, puis la publication | rien ne rejoue la recette du pilot à la publication |
| A-6 | Aligner la version de ruff du poste sur celle épinglée par la forge des tests | neuve | manuelle_dev | acces : installer un outil au poste est un geste d'environnement ; mesuré ici, `ruff --version` rend « ruff 0.15.21 » alors que `pyproject.toml` de la forge épingle « ruff==0.16.1 » | `uv tool install ruff==0.16.1` | la recette de cette forge reste rouge sur ce poste |

Ordre : A-1 d'abord, dès votre réponse à D-16, parce que la suppression doit précéder la publication pour partir avec elle ; A-2 et A-3 ensuite, quand vous voulez, puisque tout ce qu'elles publient ou enregistrent est sondé ; A-5 après une simulation verte, parce qu'elle en dépend ; A-4 et A-6 quand vous voulez, parce qu'elles ne bloquent rien.

Commits prêts, par dépôt, hors le commit de cette synthèse : pilot 58, outils 16, design 11, données 7, exploitation 7, audit 6, développement 5, tests 5, conventions 1.

## 9. Traces

- `../digit-ai-forge-development` : branche `fix/manifeste-opposable-avant-detection-stack`, tête f055f05, locale et publiée.
- Pilot : `git status --porcelain` → 70 entrées, classées par propriétaire dans cette synthèse.
- `../digit-ai-marketing` : 7 fichiers non suivis, dernier commit 05efebe du 12/09.
- Ce fichier : `output/04-plans/Digit-AI - Synthese Mandat - Etat des merges et commits - 20260915d.md`.
