---
destinataire: humain
---

# Synthèse de mandat — la forge d'audit est publiée et vérifiée sur ce qui est en ligne, mais sa chaîne d'intégration hébergée est rouge depuis dix-sept jours sous une recette locale verte (10/09/2026)

Votre feu vert est exécuté : la forge d'audit est publiée avec son moteur qui sait qu'une seule remédiation répond à plusieurs règles, et j'ai vérifié ce qui est réellement en ligne — une copie fraîche, ses dépendances installées comme en intégration, sa batterie entière rejouée : tout est vert. En lisant ensuite la chaîne d'intégration hébergée au lieu de la supposer, j'ai trouvé qu'elle est rouge sur ce push comme sur les sept précédents depuis le 24 août, sur deux contrôles antérieurs et étrangers à ce travail, que la recette locale ne voit pas parce qu'elle rejoue les étapes sans l'environnement. C'est déposé au registre avec le fait que le journal des versions de cette forge dort depuis le 15 août. Rien n'a été corrigé sans vous : ce sont des candidatures. Ce qui est attendu de vous : un feu vert pour publier les enregistrements du registre qui s'accumulent en local — cinq, dont deux de la session voisine —, et vos décisions sur les quatre candidatures ouvertes aujourd'hui.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-10 (a) du 10/09/2026 : publication de la forge d'audit avec le moteur de couverture des règles, porte rejouée avant ; lecture de la chaîne d'intégration hébergée après le push ; deux constats en passant déposés au registre.
- **sur quoi** — `digit-ai-forge-audit` (publication, sous D-10 (a)) ; la factory `digit-ai-factory` (registre et restitution).
- **quand** — 2026-09-10 18:00 UTC+02:00 (Europe/Paris) ; votre message « 10a » est horodaté 17:49, durée ≈ 11 min, relevée à l'horloge et non estimée.
- **qui** — forge-audit `main` publié en `53ca664` (`origin/main` = `HEAD`) ; pilot local en `563b0cc`, `origin/main` en `a72cdd8` ; oracles joués : `oracle-nom-client-publie` (arbre avant push, puis clone frais), `tools\verifier.mjs` de forge-audit sur clone frais, `gh run view` (chaîne hébergée), `oracle-todo`, `oracle-synthese`.

## 2. Verdict en une ligne

**D-10 (a) exécutée : porte de publication sur l'arbre de forge-audit PASS — 1 constat, 0 antériorité, 0 bloquant, 16 références, 0 remisage, 0 arborescence liée — puis push explicite du sha jugé `03ec225..53ca664`, `fetch` 0/0, `ls-remote` = `53ca664` ; clone frais à branche unique : 39 enregistrements, 15 références, porte PASS 1/0/0 en 2 s, `couverte_par` ×5 au contrat de données, recette de couverture ×1 au workflow ; sur ce clone, `npm ci` puis `node tools\verifier.mjs` : exit 0, 11 groupes OK, 101 tests, 40 s ; CHAÎNE HÉBERGÉE : run `34498539196` ROUGE — `batterie` vert, `oracles` rouge sur ubuntu et windows, tests 61 (les deux) et 92 (ubuntu), les 7 tests neufs passent, et les 7 runs précédents depuis le 24/08 sont rouges sur les mêmes tests ; TF-1005 journalisé « publié » ; TF-1016 et TF-1017 ouverts, `CLASSES.json` 1.8.0 (65 classes), `oracle-todo` PASS ; pilot : 5 enregistrements locaux non poussés, dont 2 de la session voisine.**

## 3. Décisions attendues de l'humain

Une seule décision.

> **D-11 — Cinq enregistrements attendent en local sur le pilot, dont trois de registre que le paragraphe 4 de la règle de publication ne couvre pas : donne-t-on le feu vert de les publier ?**
>
> Depuis votre feu vert sur la publication du pilot cet après-midi, la copie locale a pris cinq enregistrements d'avance sur ce qui est en ligne : deux restitutions de la session voisine, ma restitution à jour, et deux enregistrements de registre — quatre candidatures ouvertes aujourd'hui, trois classes neuves, la clôture du réalignement marquée publiée. Les restitutions seules auraient pu partir d'office ; les enregistrements de registre les précèdent dans l'histoire et ne peuvent en être séparés sans la réécrire. Tant que rien ne part, le registre publié ignore quatre candidatures, et la synthèse en ligne reste celle de 17 h 16.
>
> **Recommandation : (a).** Source consultée : le noyau `CLAUDE.md`, garde-fou « git local dès la naissance, push sur GO humain (R-38 §4) » et `REGLES-PROJET.md` R-38 §4 — un feu vert sur un travail couvre sa restitution, tout autre contenu ramène au feu vert explicite ; c'est ce feu vert explicite que cette décision demande. La porte de publication sera rejouée sur l'arbre juste avant le geste, comme pour les trois dépôts publiés aujourd'hui, et la mesure de contrôle sur clone frais suivra.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) feu vert : publier les cinq enregistrements, porte rejouée avant | effort simple × court ; un push | exclut de relire les quatre candidatures avant qu'elles soient en ligne |
| (b) feu vert après lecture des quatre candidatures (TF-1014 à TF-1017) | effort moyen × court ; vous lisez quatre sidecars | exclut la publication immédiate ; la session voisine reste avec deux restitutions non publiées |
| (c) ne pas publier | effort nul | exclut que le registre en ligne reflète le registre réel ; chaque nouveau constat creuse l'écart |

> **Si rien n'est décidé** : l'option (c) s'applique — tout reste local ; la session voisine, prévenue, ne pousse que son propre sha si elle publie sous R-38 §4.

## 4. Traité — avec sa preuve

- **D-10 (a) — la forge d'audit est publiée, porte rejouée avant, et ce qui est en ligne est vérifié sur une copie fraîche.** Le premier `git push` a été refusé sur un sha mal saisi de ma part (`53ca664f`, objet inexistant — rien n'est parti) ; rejoué avec le sha complet.
  - preuve : `git worktree list` une seule arborescence, `stash` 0, 16 références (14 tags, `main`, `origin/main`), aucun tenant réel suivi (`config\tenants\exemple` seul) ; porte sur l'arbre **PASS, 1 constat, 0 antériorité, 0 bloquant** ; `merge-base --is-ancestor` vrai ; push `03ec225..53ca664` ; `fetch` : `origin/main` = `HEAD`, 0/0 ; `ls-remote` = `53ca664` ; clone frais à branche unique sur un préfixe de 41 caractères avec `core.longpaths` : **39 enregistrements, 15 références, porte PASS 1/0/0, 2 s** ; `couverte_par` ×5 dans `tools\verifier-rapport.mjs`, `couverture-plan` ×1 dans le workflow ; clone supprimé après mesure.
- **La batterie entière passe sur ce qui est publié, dépendances installées comme en intégration.** Sans `npm ci`, la recette de couverture seule échoue sur `js-yaml` absent — c'est l'absence de dépendances, pas le moteur ; avec `npm ci` tout passe.
  - preuve : second clone frais, `npm ci --ignore-scripts` exit 0 (2 s) ; `node tools\verifier.mjs` **exit 0, 40 s** — « [ok] [oracles] Batterie des oracles (101 tests — projet, rendu du rapport, porte de clôture) », « [ok] [batterie] Portes de la fiche sécurité » ; clone supprimé.
- **La chaîne d'intégration hébergée a été LUE après le push, et elle est rouge — avant ce travail, et à côté de lui.** Deux tests antérieurs : « EOL injoignable (forcé) » — SKIP hors CI, ÉCHEC sous `IN_CI` quand le registre de fraîcheur n'est pas joignable, et il ne l'est pas depuis le runner — sur ubuntu et windows ; « build-fiche rend le PDF et le RELIT » — navigateur absent — sur ubuntu. Les 7 tests neufs de couverture passent.
  - preuve : `gh run view 34498539196` — `batterie` success, `oracles (ubuntu-latest)` failure, `oracles (windows-latest)` failure ; `--log-failed` : `not ok 61` (les deux), `not ok 92` (ubuntu), « # fail 2 » et « # fail 1 » ; `gh run list --limit 8` : **8 échecs du 24/08 au 10/09**, les mêmes tests numérotés 54 et 85 le 07/09 ; `tests\oracles\maj-versions.test.mjs` lignes 237–247 (`if (IN_CI) assert.fail(…)` sinon `t.skip(…)`).
- **TF-1017 déposé — recette locale verte, chaîne hébergée rouge : l'environnement n'est pas rejoué.** Classe neuve `recette-locale-ne-rejoue-pas-l-environnement-de-la-ci` (famille hook-ou-gate).
  - preuve : lot `dfab60c7afd2`, pseudonymisation 0 échec, `oracle-todo` **PASS** ; classe fondée par TF-1017, signalée « classe suspecte » par l'ingestion (moins de 30 jours après deux voisines) et comptée par la contre-métrique — voulu.
- **TF-1016 déposé — le journal des versions de forge-audit est dormant.** Classe neuve `journal-de-versions-dormant` (famille versionnement-livrable).
  - preuve : `git log -- CHANGELOG.md` dernier enregistrement 2026-08-15 ; `git log e979c0f..HEAD` = **14 enregistrements** sans entrée ; dernier tag `v1.17.0` du 17/08 ; `package.json` version `1.0.0` ; lot `b13c9ef48952`, `oracle-todo` **PASS** ; classe fondée par TF-1016, « classe suspecte » comptée — voulu.
- **TF-1005 journalisé « publié ».** L'événement porte la porte avant push, le push, la vérification sur clone frais, la batterie sur ce clone et l'état rouge de la chaîne hébergée.
  - preuve : `journaliser.mjs` « 1 événement(s) journalisé(s) », `oracle-todo` **PASS** ; les quatre vues du registre régénérées par leurs générateurs, exit 0 chacun ; enregistrement local `563b0cc`.
- **La session voisine est informée** de la publication, des deux constats et de la consigne de push par sha explicite.
  - preuve : message envoyé et accusé par la messagerie inter-sessions.

## 5. Non traité — avec son motif

- La correction de la chaîne hébergée rouge (tests à un seul verdict, recette qui pose `CI=true` et dit ce qu'elle ne peut pas rejouer) — motif : `gate_gouvernance`, c'est la candidature TF-1017, et « décide TF-1017 » est votre mot ; D-10 (a) disait « publier », pas « corriger ».
- Une entrée au journal des versions et un tag pour la publication de ce jour — motif : `gate_gouvernance`, c'est TF-1016 : la convention est dormante depuis 14 enregistrements, une ligne isolée ne l'aurait pas restaurée, et tenir ou retirer la convention est une décision.
- Le push des cinq enregistrements locaux du pilot — motif : `gate_gouvernance`, c'est la décision D-11.
- Le chantier de contenu du référentiel du 21/08 (TF-1014) et le plafond de longueur de chemin (TF-1015) — motif : `gate_gouvernance`, candidatures en attente de votre mot.
- La propagation des skills et le retrait du remisage — motif : `gate_gouvernance`, gestes humains (R-29 : dépenses, portes et suppressions restent humaines), inchangés depuis la synthèse précédente.
- Le ledger des versions du pilot (R-19) pour cette publication — motif : `dependance_bloc_3`, il n'existe aucune version de forge-audit à y inscrire tant que TF-1016 n'est pas décidée ; le sha `53ca664` tient lieu de version dans TF-1005.

## 6. Écarts à la lettre

- **Vous avez demandé** « 10a » — publier la forge d'audit, porte rejouée avant. **J'ai** publié exactement l'enregistrement jugé, sans entrée de journal ni tag, puis lu la chaîne hébergée et déposé deux candidatures. **Pourquoi** : publier plus que le sha jugé aurait ramené au feu vert explicite (R-38 §4) ; lire la chaîne hébergée après un push, c'est ne pas supposer ; « constat en passant → candidat » est un garde-fou du noyau — les candidatures restent locales, en `candidat`.
- **Vous avez demandé** une publication vérifiée. **J'ai** d'abord vérifié la recette de couverture sur un clone sans dépendances, qui a échoué sur `js-yaml` absent, puis rejoué avec `npm ci` comme en intégration. **Pourquoi** : la première mesure ne mesurait pas le moteur mais l'absence d'installation ; elle est dite ici pour qu'on ne la relise pas comme un défaut du moteur.
- Aucun autre écart : rien d'autre que `main` de forge-audit n'a été poussé, aucun forçage, porte rejouée avant, sha explicite.

## 7. Risques

- **Une chaîne d'intégration rouge depuis dix-sept jours n'est plus un signal.**
  - signal : un push de forge-audit dont le run est rouge sans que la restitution le nomme ; un nouveau test cassé qui se fond dans le rouge existant.
  - parade : lire `gh run view` après chaque push de forge et l'inscrire à la restitution — fait ici ; la correction est A-2.
- **La recette locale verte donne confiance sur ce que la chaîne hébergée refuse.**
  - signal : `tools\verifier.mjs` exit 0 le jour où le run hébergé est rouge — c'est l'état d'aujourd'hui.
  - parade : TF-1017 (2) et (1) : un seul verdict par situation, l'environnement posé par la recette ; en attendant, la lecture du run est la seule mesure qui compte.
- **Le registre en ligne diverge du registre réel tant que D-11 n'est pas tranchée.**
  - signal : `origin/main` du pilot à `a72cdd8` pendant que la copie locale porte quatre candidatures de plus.
  - parade : la décision D-11 ; la session voisine, prévenue deux fois, pousse son sha explicitement si elle publie.
- **Trois classes neuves en un jour, toutes signalées suspectes.**
  - signal : la contre-métrique du tableau de bord (`RECIDIVES.md`) monte de trois.
  - parade : c'est voulu et compté — chaque classe est fondée par une candidature mesurée ; si l'une d'elles ne reçoit jamais de second retour, elle se fusionne dans sa voisine à la revue.
- **Le premier push refusé aurait pu passer inaperçu si la mesure n'avait pas été relue.**
  - signal : un script qui enchaîne push et vérification sans arrêter sur `PUSH_EXIT` ≠ 0.
  - parade : la vérification par `ls-remote` après le push a montré `03ec225` encore en ligne ; le script s'arrête désormais sur le premier échec — corrigé pour ce tour, non généralisé.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Pousser les cinq enregistrements locaux du pilot, porte rejouée avant, mesure sur clone frais après (TF-1005) | auto_ia | `gate_gouvernance` — attend D-11 ; à défaut, le registre en ligne ignore quatre candidatures | simple × court |
| A-2 | Rendre la recette de forge-audit fidèle à l'environnement de la chaîne hébergée (`CI=true`, `env:` des étapes, conditions non rejouables dites) et donner un seul verdict aux deux tests (EOL, PDF), fixtures à double sens (TF-1017) | auto_ia | `gate_gouvernance` — attend « décide TF-1017 » ; à défaut, la chaîne hébergée reste rouge et cesse d'être lue | moyen × court |
| A-3 | Tenir ou retirer le journal des versions de forge-audit : entrée de rattrapage des 14 enregistrements, version figée, tag, `package.json` aligné — ou journal fermé avec sa date (TF-1016) | auto_ia | `gate_gouvernance` — attend « décide TF-1016 » ; à défaut, le journal décrit un dépôt figé au 14/08 | simple × court |
| A-4 | Écrire le plafond de longueur de chemin (R-4, sidecars compris), le jouer dans `oracle-synthese`, déclarer `core.longpaths` dans `bootstrap.mjs --rebatir` et le mode opératoire de clone (TF-1015) | auto_ia | `gate_gouvernance` — attend « décide TF-1015 » ; à défaut, le prochain clone profond échoue chez celui qui vérifie | simple × court |
| A-5 | Faire entrer dans le pack de dimensions de forge-audit les thèmes, preuves, livrables, barèmes et 9 ADR du référentiel du 21/08 (TF-1014) | auto_ia | `gate_gouvernance` — attend « décide TF-1014 » ; à défaut, chaque audit livre un référentiel que le commanditaire ne reconnaît pas | complexe × long |
| A-6 | Reprendre les 31 items restants du registre visant le pilot, TF-0959 et TF-0992 en tête de score (TF-0959) | auto_ia | `borne_atteinte` — hors de la décision du tour ; à défaut, l'écart entre le registre et l'état réel croît | complexe × très long |
| A-7 | Trancher D-11 — répondre « D-11 (a) », « (b) » ou « (c) » ; le `git push` est joué par l'IA (TF-1005) | manuelle_utilisateur | `decision` — R-38 §4 réserve au feu vert tout enregistrement qui n'est pas une restitution ; sinon : tout reste local | simple × court |
| A-8 | Décider TF-1017 — répondre « décide TF-1017 » ou l'écarter avec son motif (TF-1017) | manuelle_utilisateur | `decision` — tout entre en candidat, la décision est humaine ; sinon : A-2 ne se joue pas | simple × court |
| A-9 | Décider TF-1016 — répondre « décide TF-1016 » ou l'écarter avec son motif (TF-1016) | manuelle_utilisateur | `decision` — idem ; sinon : A-3 ne se joue pas | simple × court |
| A-10 | Décider TF-1015 — répondre « décide TF-1015 » ou l'écarter avec son motif (TF-1015) | manuelle_utilisateur | `decision` — idem ; sinon : A-4 ne se joue pas | simple × court |
| A-11 | Jouer la propagation `node bootstrap.mjs --pull`, forge-agents étant publié avec le report (TF-1006) | manuelle_utilisateur | `decision` — la propagation engage toutes les sessions du poste (R-29) ; sinon : K2 (la copie installée des skills égale à sa source) reste rouge | simple × court |
| A-12 | Retirer le remisage du 01/09 si vous le décidez — `git stash drop stash@{0}` puis `stash@{1}` (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 attend D-11, A-2 à A-5 attendent chacune sa décision, A-6 ne dépend de rien ; parmi les vôtres, A-7 d'abord parce qu'elle remet le registre en ligne, A-8 ensuite parce qu'une chaîne d'intégration rouge coûte à chaque push, puis A-9, A-10, A-11, A-12 qui n'ont d'autre coût qu'un mot.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Forge d audit publiee CI hebergee rouge - 20260910g.md` — ce document.
- Forge-audit : `git push origin 53ca664…:refs/heads/main` → `03ec225..53ca664` ; `origin/main` = `53ca664` ; run hébergé `34498539196` (rouge), runs précédents rouges depuis le 24/08 ; `tests\oracles\maj-versions.test.mjs` (`IN_CI`), `tests\oracles\verifier-pdf.test.mjs` ; `CHANGELOG.md` dernier enregistrement 2026-08-15.
- Clones de vérification à branche unique, préfixe de 41 caractères, `core.longpaths` : `53ca664` (39 enregistrements, porte PASS 1/0/0) et le second avec `npm ci` (`tools\verifier.mjs` exit 0, 11 groupes, 101 tests) — supprimés après mesure ; verdicts conservés dans le bac à sable de session (`gate-clone-audit.json`, journaux des tâches).
- `input\01-candidatures\ci-hebergee-rouge-environnement-non-rejoue-forge-audit-20260910a.tf.jsonl` (TF-1017, lot `dfab60c7afd2`) ; `input\01-candidatures\journal-de-versions-dormant-forge-audit-20260910a.tf.jsonl` (TF-1016, lot `b13c9ef48952`) ; `todo\CLASSES.json` 1.8.0 ; `todo\TODO.jsonl` (TF-1005 maj « publié », TF-1016, TF-1017) ; les quatre vues du registre régénérées (`todo\TODO.md`, `RECIDIVES.md`, `AVANCEMENT.md` et la page du registre) ; enregistrement local `563b0cc`.
- Pilot, enregistrements locaux non poussés au-dessus de `a72cdd8` : `54cc371` et `185fa34` (session voisine, restitutions), `0209299` (TF-1015), `ead11ae` (synthèse 20260910f à jour), `563b0cc` (TF-1016, TF-1017, TF-1005).
- `output\04-plans\Digit-AI - Synthese Mandat - Trois decisions executees moteur de couverture reference realignee publications - 20260910f.md` — la synthèse précédente, dont D-10 est la décision exécutée ici.
- Aucun livrable HTML produit dans ce tour ; aucune écriture chez le produit porteur des références.
