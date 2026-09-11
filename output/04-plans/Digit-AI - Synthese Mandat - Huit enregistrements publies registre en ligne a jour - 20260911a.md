---
destinataire: humain
---

# Synthèse de mandat — votre feu vert est exécuté : huit enregistrements publiés, le registre en ligne est à jour et vérifié sur une copie fraîche de ce qui est en ligne (11/09/2026)

Votre feu vert de ce matin est exécuté : les huit enregistrements qui attendaient en local — quatre de la session voisine, quatre de ce poste dont deux de registre — sont publiés après rejeu de la porte de publication, et une copie fraîche de ce qui est en ligne confirme que le registre y porte bien les quatre candidatures d'hier et les trois classes neuves, sans aucun nom interdit ni antériorité. Rien d'autre n'a bougé : les quatre candidatures restent à décider par vous, la chaîne d'intégration de la forge d'audit reste rouge jusqu'à votre mot sur la candidature qui la décrit, et l'ouverture de session a relevé qu'un produit hérité a treize artefacts en écart avec le socle — relevé, pas corrigé. Ce qui est attendu de vous : aucune décision fermée nouvelle ; vos mots sur les quatre candidatures, et les deux gestes que la règle vous réserve.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-11 (a) du 11/09/2026 : publication des enregistrements locaux du pilot, porte rejouée avant, mesure sur clone frais après.
- **sur quoi** — la factory `digit-ai-factory` (le pilot), branche `main`.
- **quand** — 2026-09-11 09:15 UTC+02:00 (Europe/Paris) ; votre message « 11a » est horodaté 09:05 et réaffirmé 09:07, durée ≈ 10 min, relevée à l'horloge et non estimée.
- **qui** — pilot `main` publié en `a6eaf1f` (`origin/main` = `HEAD`, 0/0) ; oracles joués : `oracle-nom-client-publie` (arbre avant push, puis clone frais), `oracle-todo` (sur le clone frais), `oracle-synthese`.

## 2. Verdict en une ligne

**D-11 (a) exécutée : porte de publication sur l'arbre en `a6eaf1f` PASS — 51 constats dont 50 antériorités de ma copie (remisage), 0 bloquant — puis push explicite du sha jugé `a72cdd8..a6eaf1f` (8 enregistrements : 4 de la session voisine, 4 de ce poste), `fetch` 0/0, `ls-remote` = `a6eaf1f` ; clone frais à branche unique de l'origine : 691 enregistrements, 44 références, 0 remisage, porte PASS 1 constat 0 antériorité 0 bloquant en 113 s, registre en ligne portant TF-1015, TF-1016, TF-1017, `CLASSES.json` 1.8.0 (65 classes), `oracle-todo` PASS sur ce clone, les 2 synthèses du 10/09 en ligne ; relevé d'héritage à l'ouverture : 1 produit, 13 artefacts dont 8 absents, 4 divergents, 1 incomplet — relevé, non traité.**

## 3. Décisions attendues de l'humain

Aucune décision fermée nouvelle n'attend l'humain dans ce tour : les quatre candidatures ouvertes hier (TF-1014 à TF-1017) attendent chacune votre mot « décide TF-#### », au tableau du bloc 8.

## 4. Traité — avec sa preuve

- **D-11 (a) — les huit enregistrements locaux sont publiés, porte rejouée avant, sha explicite.** Le push a été enchaîné mécaniquement sur le verdict de la porte, sous garde explicite — verdict PASS et 0 bloquant, sinon aucun geste.
  - preuve : `git worktree list` une seule arborescence ; `fetch` avant : `origin/main` = `a72cdd8`, 8 en avance, aucun nouvel enregistrement de la session voisine depuis hier 18 h 01 ; porte sur l'arbre **PASS, 51 constats — 1 verdict et 50 antériorités —, 0 bloquant**, passif d'antériorité 637 déclaré (ma copie tient l'ancienne histoire par le remisage, TF-1008) ; `merge-base --is-ancestor` vrai ; `git push origin a6eaf1f…:refs/heads/main` → `a72cdd8..a6eaf1f` ; `fetch` : `origin/main` = `HEAD` = `a6eaf1f`, 0/0 ; `ls-remote` = `a6eaf1f`.
- **Ce qui est en ligne est mesuré sur une copie fraîche, et c'est la mesure qui répond à « que porte le publié ? ».**
  - preuve : clone frais à branche unique sur un préfixe de 41 caractères avec `core.longpaths` : **691 enregistrements, 44 références, 0 remisage** ; porte **PASS, 1 constat — le verdict —, 0 antériorité, 0 bloquant, 113 s** ; `todo\TODO.jsonl` en ligne : TF-1015, TF-1016, TF-1017 présents ; `todo\CLASSES.json` en ligne : version 1.8.0, 65 classes ; `oracle-todo` sur le clone **PASS** ; `output\04-plans` en ligne : les synthèses d'indices 20260910f et 20260910g ; clone supprimé après mesure.
- **La session voisine est informée** que ses quatre restitutions sont en ligne et que `origin/main` = `a6eaf1f`.
  - preuve : message envoyé et accusé par la messagerie inter-sessions.

## 5. Non traité — avec son motif

- Les quatre candidatures d'hier — TF-1014 (contenu du référentiel du 21/08), TF-1015 (plafond de longueur de chemin), TF-1016 (journal de versions dormant), TF-1017 (recette locale verte, chaîne hébergée rouge) — motif : `gate_gouvernance`, tout entre en candidat et « décide TF-#### » est votre mot.
- La chaîne d'intégration hébergée de forge-audit, toujours rouge — motif : `gate_gouvernance`, c'est TF-1017.
- Le relevé d'héritage de l'ouverture de session — un produit hérité, 13 artefacts dont 8 absents, 4 divergents, 1 incomplet — motif : `hors_mandat`, toute écriture chez un produit hors run demandé est interdite par le noyau (« Produits autonomes ») ; le relevé est déposé au journal d'héritage, la reprise attend un mandat.
- La propagation des skills et le retrait du remisage — motif : `gate_gouvernance`, gestes humains (R-29 : dépenses, portes et suppressions restent humaines).
- Les 31 autres items du registre visant le pilot — motif : `borne_atteinte`, ce tour a exécuté votre feu vert et rien d'autre.

## 6. Écarts à la lettre

- **Vous avez demandé** D-11 (a), posée sur « cinq enregistrements ». **J'ai** poussé huit. **Pourquoi** : les trois de plus sont deux restitutions de la session voisine et ma synthèse d'hier soir, ajoutées entre le jugement de cette synthèse et son dépôt — la note de dépôt d'hier vous l'annonçait (« huit enregistrements d'avance… D-11 porte sur l'ensemble ») ; ce sont des restitutions, que R-38 §4 couvre de toute façon.
- **Vous avez demandé** un push après porte. **J'ai** enchaîné le push sur le verdict de la porte sans relecture humaine intermédiaire. **Pourquoi** : la garde était explicite — verdict PASS et 0 bloquant, sinon aucun geste — et votre feu vert portait sur ce geste précis ; le verdict est lu et cité ci-dessus, avant comme après.
- Aucun autre écart : rien d'autre que `main` n'a été poussé, aucun forçage, sha explicite, porte rejouée avant, mesure sur clone frais après.

## 7. Risques

- **La copie locale continue de rendre des antériorités que le publié n'a pas.**
  - signal : 50 antériorités dans le verdict local contre 0 sur le clone frais.
  - parade : lire tout verdict local avec cette réserve ; le retrait du remisage est A-11.
- **Quatre candidatures ouvertes sans décision perdent leur fraîcheur.**
  - signal : les mêmes lignes au bloc 8 dans trois synthèses consécutives.
  - parade : vos quatre mots, A-6 à A-9 ; à défaut, elles restent en `candidat` et le tableau de bord les compte.
- **La chaîne d'intégration de forge-audit reste rouge et redevient bruit de fond.**
  - signal : le prochain push de forge-audit sans lecture du run hébergé.
  - parade : lire `gh run view` après chaque push — inscrit à la synthèse d'hier ; la correction est A-1.
- **Le produit hérité diverge du socle et personne ne le corrige.**
  - signal : le relevé d'héritage de chaque ouverture de session répète 13 artefacts en écart.
  - parade : un run demandé chez ce produit, ou un mandat de propagation — A-5.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Rendre la recette de forge-audit fidèle à l'environnement de la chaîne hébergée (`CI=true`, `env:` des étapes, conditions non rejouables dites) et donner un seul verdict aux tests EOL et PDF, fixtures à double sens (TF-1017) | auto_ia | `gate_gouvernance` — attend « décide TF-1017 » ; à défaut, la chaîne hébergée reste rouge et cesse d'être lue | moyen × court |
| A-2 | Tenir ou retirer le journal des versions de forge-audit : entrée de rattrapage des 14 enregistrements, version figée, tag, `package.json` aligné — ou journal fermé avec sa date (TF-1016) | auto_ia | `gate_gouvernance` — attend « décide TF-1016 » ; à défaut, le journal décrit un dépôt figé au 14/08 | simple × court |
| A-3 | Écrire le plafond de longueur de chemin (R-4, sidecars compris), le jouer dans `oracle-synthese`, déclarer `core.longpaths` dans `bootstrap.mjs --rebatir` et le mode opératoire de clone (TF-1015) | auto_ia | `gate_gouvernance` — attend « décide TF-1015 » ; à défaut, le prochain clone profond échoue chez celui qui vérifie | simple × court |
| A-4 | Faire entrer dans le pack de dimensions de forge-audit les thèmes, preuves, livrables, barèmes et 9 ADR du référentiel du 21/08 (TF-1014) | auto_ia | `gate_gouvernance` — attend « décide TF-1014 » ; à défaut, chaque audit livre un référentiel que le commanditaire ne reconnaît pas | complexe × long |
| A-5 | Reprendre l'héritage du produit relevé à l'ouverture — 13 artefacts du socle (`forge\retours\`, gabarits, oracles) à réaligner (neuve) | auto_ia | `gate_gouvernance` — écriture chez un produit hors run demandé, attend un mandat ; à défaut, le relevé se répète à chaque ouverture | simple × court |
| A-6 | Décider TF-1017 — répondre « décide TF-1017 » ou l'écarter avec son motif (TF-1017) | manuelle_utilisateur | `decision` — tout entre en candidat, la décision est humaine ; sinon : A-1 ne se joue pas | simple × court |
| A-7 | Décider TF-1016 — répondre « décide TF-1016 » ou l'écarter avec son motif (TF-1016) | manuelle_utilisateur | `decision` — idem ; sinon : A-2 ne se joue pas | simple × court |
| A-8 | Décider TF-1015 — répondre « décide TF-1015 » ou l'écarter avec son motif (TF-1015) | manuelle_utilisateur | `decision` — idem ; sinon : A-3 ne se joue pas | simple × court |
| A-9 | Décider TF-1014 — répondre « décide TF-1014 » ou l'écarter avec son motif (TF-1014) | manuelle_utilisateur | `decision` — idem ; sinon : A-4 ne se joue pas | simple × court |
| A-10 | Jouer la propagation `node bootstrap.mjs --pull`, forge-agents étant publié avec le report (TF-1006) | manuelle_utilisateur | `decision` — la propagation engage toutes les sessions du poste (R-29) ; sinon : K2 (la copie installée des skills égale à sa source) reste rouge | simple × court |
| A-11 | Retirer le remisage du 01/09 si vous le décidez — `git stash drop stash@{0}` puis `stash@{1}` (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire et chaque verdict local porte 50 antériorités | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 à A-4 attendent chacune sa décision, A-5 attend un mandat ; parmi les vôtres, A-6 d'abord parce qu'une chaîne d'intégration rouge coûte à chaque push, puis A-7, A-8, A-9 qui n'ont d'autre coût qu'un mot, puis A-10 et A-11.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Huit enregistrements publies registre en ligne a jour - 20260911a.md` — ce document.
- Pilot : `git push origin a6eaf1f…:refs/heads/main` → `a72cdd8..a6eaf1f` ; enregistrements publiés : `54cc371`, `185fa34`, `49966b1`, `df5777b` (session voisine, restitutions), `0209299` (TF-1015), `ead11ae` (synthèse 20260910f à jour), `563b0cc` (TF-1016, TF-1017, TF-1005 « publié »), `a6eaf1f` (synthèse 20260910g).
- Clone de vérification à branche unique, préfixe de 41 caractères, `core.longpaths` : `a6eaf1f`, 691 enregistrements, porte PASS 1/0/0 en 113 s, `oracle-todo` PASS — supprimé après mesure ; verdicts conservés dans le bac à sable de session (`gate-clone-pilot-d11.json`, journal de la tâche).
- Verdict de la porte sur l'arbre avant push : bac à sable de session, journal de la tâche (51 constats, 0 bloquant, passif 637).
- `todo\HERITAGE-RELEVES.jsonl` — relevé d'héritage de l'ouverture de session du 11/09 (contrat 1.8.0, 1 produit, 13 artefacts) ; `todo\RECIDIVES.md`, `todo\observabilite\RECIDIVES.json`, `todo\observabilite\snapshots-recidives.jsonl` — tableau de bord régénéré (1 017 items, 201 classés).
- `output\04-plans\Digit-AI - Synthese Mandat - Forge d audit publiee CI hebergee rouge - 20260910g.md` — la synthèse précédente, dont D-11 est la décision exécutée ici.
- Aucun livrable HTML produit dans ce tour ; aucune écriture dans un dépôt frère ni chez un produit.
