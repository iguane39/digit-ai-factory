---
destinataire: humain
---

# Synthèse de mandat — décision D-9 (a) exécutée : quatre dépôts publiés, trois forges retenues par une histoire publiée qui porte des noms de produit (07/09/2026)

Votre décision de supprimer les branches de sauvegarde et de publier a donné quatre publications vertes : la forge des données, la forge d'audit, la forge d'exploitation après une pseudonymisation de deux lignes, et le pilot. Trois forges restent retenues, et pas par ce qu'elles viennent de livrer : leur histoire déjà publiée porte des noms de produit dans des messages de commit, et pour la forge de tests les étiquettes de version conservent en plus l'ancienne histoire. C'est la classe de défaut que la forge des outils connaît depuis le 6 septembre, et que le registre porte déjà pour la forge de développement ; deux candidatures neuves la consignent pour les deux autres. Ce qui change pour vous : les verbes de la couche Gold, de l'audit du modèle sémantique et de la mise en production d'un produit data sont publics ; le thème Power BI, le profil de construction et la composition des tests ne vivent que sur ce poste. Ce qui est attendu de vous : décider si ces trois forges rejoignent le mandat de réécriture d'histoire déjà confié pour la forge des outils.

## 1. En-tête d'identification

- **quoi** — mandat humain « 9a » sur la restitution de 16:31 : suppression des branches de sauvegarde des cinq forges rebâties le matin, publication des six forges et du pilot.
- **sur quoi** — forge-data (41c85ef → 10cca3b), forge-audit (0a172f3 → 03ec225), forge-ops (6ba986f → 538ccb1), pilot (6f3d69f → 0ebb620) publiés ; forge-design (d49db27), forge-development (a7c2ecf), forge-tests (acbeb35) retenus en local.
- **quand** — 2026-09-07 16:45 UTC+02:00 (Europe/Paris), durée ≈ 14 min depuis « 9a ».
- **qui** — pilot digit-ai-factory 0ebb620 ; porte de publication `oracle-nom-client-publie` (règle C5 : nom de produit dans un message de commit ou un fichier suivi) rejouée sur sept dépôts.

## 2. Verdict en une ligne

5 branches de sauvegarde supprimées ; 4 push acceptés (data, audit, ops après pseudonymisation de 2 lignes, pilot) ; 3 push refusés (design : 2 commits publiés ; development : 3 commits publiés ; tests : 7 commits publiés et 13 joignables par 33 étiquettes de version) ; 2 candidatures neuves (TF-0867, TF-0868), registre PASS ; aucun contournement de porte.

## 3. Décisions attendues de l'humain

> **D-10 — Les trois forges retenues (design, développement, tests) rejoignent-elles le mandat de réécriture d'histoire déjà confié pour la forge des outils ?**
> Les trois refus ont la même cause et aucune ne tient à ce mandat : des messages de commit déjà publiés portent un nom de produit, la porte de publication balaie toute l'histoire, et une branche principale protégée refuse le push forcé. La forge de tests cumule une seconde cause de même nature, ses étiquettes de version conservant l'ancienne histoire. La forge de développement porte déjà cette classe au registre depuis le 5 septembre, les deux autres viennent d'y entrer. La synthèse du matin a confié à l'autre session, en décision D-29, la réécriture de l'histoire de la forge des outils selon le mode opératoire du pilot ; étendre ce mandat aux trois forges évite trois chantiers séparés, et les trois commits de ce jour se rejouent ensuite sur l'histoire réécrite.
> **Recommandation : (a).** Source consultée : sorties de `oracle-nom-client-publie` sur les trois dépôts, localisation par `git merge-base --is-ancestor` ; registre TF-0813 et TF-0829 (forge-development : « la porte C5 y reste FAIL, et la branche main protégée refuse tout push forcé ») ; synthèse 20260907b, décision D-29 et action A-68 (rejeu par `cherry-pick` sur l'histoire réécrite).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Étendre le mandat de réécriture d'histoire aux trois forges, puis rejouer les trois commits de ce jour et publier | Trois réécritures selon le mode opératoire du pilot, complexe × moyen, chacune suivie d'un push forcé que la protection de branche doit autoriser le temps du geste | Rien : les étiquettes de forge-tests se reposent sur l'histoire réécrite |
| (b) Contourner la porte sur les trois commits du jour (`git push --no-verify`) | Un geste par forge, simple × court | Une porte verte : trois commits propres publiés sur des histoires rouges, que la réécriture suivante devra reprendre ; la protection de branche refuse de toute façon un push forcé ultérieur sans geste humain |
| (c) Laisser les trois forges en local | Aucun coût | La mission s'ouvrirait avec un thème, un profil et une composition de tests connus de ce poste seul |

> **Si rien n'est décidé** : (c) — les trois commits restent locaux, TF-0867 et TF-0868 restent candidats, la revue du 2026-09-21 le constatera.

## 4. Traité — avec sa preuve

- Branches de sauvegarde supprimées dans les cinq forges rebâties le matin (audit, design, ops, développement, tests), forge-data n'en ayant plus.
  - preuve : « Deleted branch sauvegarde/ancienne-histoire-20260907 (was 7bc1e4f) » (audit), « (was f99e293) » (design), « (was 748538d) » (ops), « (was 247f9ec) » (développement), « (was 23c7622) » (tests) ; forge-data : « (pas de branche de sauvegarde) ».
- Quatre publications à travers la porte, sans contournement.
  - preuve : `git push origin main` → « 41c85ef..10cca3b » (forge-data), « 0a172f3..03ec225 » (forge-audit), « 6ba986f..538ccb1 » (forge-ops), « 6f3d69f..0ebb620 » (pilot), exit 0 chacun ; `git status -sb` → « main...origin/main » sans avance.
- forge-ops : cause du premier refus localisée et corrigée. Contrôle rouge → vert : porte FAIL (2 constats C5 dans `references/GESTES-EXPLOITATION.md`, lignes 51 et 85, nom d'un produit dans une source de lot de retours) → push accepté après remplacement par le pseudonyme de la table de la racine ; classe traitée : nom de produit en clair dans un fichier suivi.
  - preuve : `oracle-nom-client-publie` → « forge-ops: FAIL … nom de produit interdit … dans le contenu d'un fichier suivi » ; table `C:\dev\_produits-pseudonymes.json` → « Produit-03 » ; commit `538ccb1` 16:42 ; push exit 0.
- Trois refus qualifiés par leur cause, chacune située dans l'histoire publiée.
  - preuve : forge-design → 2 constats C5, commits 6cd6c92 et c42683e, « dans origin/main (publié) » ; forge-development → 3 constats C5 (a6f7746, 468bb36, 3cbdcb7), tous « dans origin/main » ; forge-tests → 20 constats C5, « publiés 7 | hors origin/main 13 », `git for-each-ref` → 33 étiquettes de version dont v1.17.4 sur l'histoire publiée.
- Deux candidatures journalisées pour les deux forges dont le registre ne portait pas encore la classe. Contrôle rouge → vert de l'écriture : `oracle-todo` PASS avant et après.
  - preuve : `journaliser.mjs` → « 2 événement(s) journalisé(s) », « 2026-09-07T14:43:21Z TF-0867 creation candidat », « TF-0868 creation candidat » ; vues régénérées, « 87 actifs », sceau e1716f108dd7.

## 5. Non traité — avec son motif

- Publication de forge-design, forge-development, forge-tests : refusée par la porte pour une histoire publiée ; la réécriture d'histoire est un geste humain par décision (D-10), jamais un contournement d'agent.
- Étiquettes de version de forge-tests : conservées, elles sont publiées chez l'hébergeur (33) ; les retirer ou les reposer relève de la réécriture d'histoire.
- Forge des outils : hors de ce mandat, sa porte reste rouge pour la cause de D-29.

## 6. Écarts à la lettre

- Vous avez demandé « 9a » (supprimer les branches et pousser les six forges et le pilot) → quatre dépôts publiés, trois retenus → pourquoi : la porte de publication a refusé pour une cause antérieure à ce mandat, et son contournement n'est pas un geste d'agent.
- D-9 (a) ne prévoyait pas d'édition de contenu → deux lignes de forge-ops ont été pseudonymisées → pourquoi : la cause était dans le contenu et non dans l'histoire, la correction est celle que la doctrine du pilot prescrit (table des pseudonymes, jamais un nom de produit dans une forge), chirurgicale et vérifiée par la porte.
- Aucun autre écart.

## 7. Risques

- **Trois commits locaux perdus à une prochaine reconstruction de clone** : signal = une reconstruction « sur l'histoire publiée » sans rejeu ; parade = les hachages sont au registre (TF-0861, TF-0863) et à cette synthèse, et les paquets git du matin conservent les histoires.
- **Réécriture d'histoire qui décale les étiquettes** : signal = une étiquette v1.x pointant hors de l'histoire réécrite ; parade = le mode opératoire du pilot repose les étiquettes, TF-0868 le dit.
- **Pseudonyme périmé** : signal = un nouveau nom de produit absent de la table de la racine ; parade = la porte le refuse avant publication, comme aujourd'hui.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-34 | Étendre le mandat de réécriture d'histoire aux trois forges, rejouer d49db27, a7c2ecf, acbeb35 par `cherry-pick` sur l'histoire réécrite, reposer les étiquettes de forge-tests, publier | TF-0867, TF-0868, TF-0829 | auto_ia | dependance_bloc_3 (D-10) | mode opératoire de réécriture du pilot, une session par forge, porte rejouée avant push | les trois lots restent sur ce poste |
| A-31 | Corriger TF-0866 (identifiant de test cassé par pseudonymisation) | TF-0866 | auto_ia | gate_gouvernance (candidat) | mandat forge-tests puis pilot (`todo/anonymiser-suivis.mjs`) | toute suite `pytest -x` de forge-tests s'arrête avant de jouer |
| A-32 | Consigner aux fiches d'audit le premier run réel de chaque oracle nouveau | neuve | auto_ia | dependance_externe (mission non ouverte) | `fiches/<forge>.md` du pilot | les oracles restent exercés sur fixtures seulement |
| A-18 | Revue du verdict de l'étude contre le « où » réel de la mission le 2026-09-21 | neuve | auto_ia | dependance_externe (mission non ouverte) | rejouer la section 2 de l'étude | le plan reste conditionnel |
| A-35 | Répondre à D-10 | neuve | manuelle_utilisateur | irreversible : réécrire une histoire publiée est un geste humain par règle | répondre dans ce fil par `D-10 (a)`, `D-10 (b)` ou `D-10 (c)` | trois forges restent locales |

Ordre : A-35 d'abord, parce qu'elle conditionne A-34 ; A-31 dès que TF-0866 est décidé, parce qu'un geste simple débloque toute suite de tests ; A-32 et A-18 à l'ouverture de la mission, parce qu'elles n'ont pas de matière avant.

## 9. Traces

- `..\digit-ai-forge-ops\references\GESTES-EXPLOITATION.md` — lignes 51 et 85 pseudonymisées, commit 538ccb1, publié.
- `..\digit-ai-forge-design` d49db27, `..\digit-ai-forge-development` a7c2ecf, `..\digit-ai-forge-tests` acbeb35 — commits locaux retenus.
- `todo\TODO.jsonl` — événements 2026-09-07T14:43:21Z (TF-0867, TF-0868) ; `todo\TODO.md` sceau e1716f108dd7.
- `~\.claude\skills\quality-oracles\scripts\oracle-nom-client-publie.mjs` — porte rejouée sur les sept dépôts ; `C:\dev\_produits-pseudonymes.json` — table des pseudonymes.
- `output\04-plans\Digit-AI - Synthese Mandat - Decisions 27a 28a forges rebaties - 20260907b.md` — décision D-29, action A-68.
