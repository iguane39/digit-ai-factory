---
destinataire: humain
---

# Synthèse de mandat — D-13 (a) exécutée : le pilot et la forge d'audit sont publiés et vérifiés sur copie fraîche, la chaîne hébergée est lue — Windows au vert pour la première fois depuis dix-huit jours, Linux rouge sur une cause neuve, déposée (11/09/2026)

Votre feu vert est exécuté. Le pilot est publié avec le motif du feu vert déclaré au contrôle d'avance, la porte des noms rejouée par le hook, et une copie fraîche de ce qui est en ligne porte bien le contrôle du geste, le plafond de chemin, le contrôle d'avance et les cinq clôtures. La forge d'audit est publiée avec sa version étiquetée. La chaîne d'intégration hébergée a été lue aussitôt : le job Windows passe au vert pour la première fois depuis le vingt-quatre août, la batterie aussi ; le job Linux reste rouge, mais sur une cause qui n'a plus rien à voir avec les huit runs précédents — le PDF de la fiche y sort sur deux pages parce que les polices du thème n'existent pas sur ce runner et que rien ne les embarque. Ce constat est déposé au registre comme candidature, en ligne d'office selon la règle étendue hier. Aucune décision fermée nouvelle : vos mots sur cette candidature et sur les enregistrements d'héritage des produits restent au tableau.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-13 (a) du 11/09/2026 : publication du pilot et de la forge d'audit (tag compris), mesure sur clone frais, lecture du run hébergé, constat en passant déposé.
- **sur quoi** — le pilot `digit-ai-factory` ; le dépôt frère `digit-ai-forge-audit` ; la chaîne hébergée de ce dernier.
- **quand** — 2026-09-11 11:00 UTC+02:00 (Europe/Paris) ; votre message « 13a » est horodaté 10:49, durée ≈ 11 min, relevée à l'horloge et non estimée.
- **qui** — pilot `main` publié en `233d582` puis `0da9a54` (candidature, ce tour) ; forge-audit `main` publié en `ebdf745`, tag `v1.18.0` ; oracles joués : `verifier-avance-publication` (hook pre-push, motif de GO déclaré), `oracle-nom-client-publie` (hooks des deux dépôts, puis clone frais du pilot), `oracle-todo` (clone frais et local), `oracle-synthese --self-test` (clone frais), `gh run view`, `oracle-synthese`.

## 2. Verdict en une ligne

**D-13 (a) exécutée : pilot — `git push` explicite `c37732c..233d582` (2 enregistrements), `FORGE_PUSH_GO` posé, `PUSH_EXIT=0`, 88 s hooks compris, `ls-remote` = `233d582`, 0/0 ; clone frais à branche unique : `233d582`, 701 enregistrements, 1 435 fichiers, contrôle GESTE présent, S42 (la règle de longueur de chemin de l'oracle de synthèse) présent, `verifier-avance-publication` présent, `RESTITUTION.md` 2.21.0, clôture TF-1019 présente, `oracle-todo` PASS, `oracle-synthese --self-test` 19/19, porte PASS 1 constat 0 antériorité 0 bloquant en 95 s ; forge-audit — `53ca664..ebdf745`, `PUSH_EXIT=0`, 4 s, tag `v1.18.0` poussé (`e9b80eb`) ; run hébergé `34581219111` : `batterie` success, `oracles (windows-latest)` SUCCESS (rouge depuis le 24/08), `oracles (ubuntu-latest)` failure sur 1 test (110, PDF : 2 pages pour un maximum de 1, 125 pass, 1 skip motivé), le test EOL est SKIP motivé sur les deux runners ; TF-1020 ingéré (lot `8beafca17d9a`, récidive comptée de la classe de TF-1017), `oracle-todo` PASS, enregistrement `0da9a54` classé `candidature` par le contrôle d'avance (R-38 §5, publié d'office avec ce document).**

## 3. Décisions attendues de l'humain

Aucune décision fermée nouvelle n'attend l'humain dans ce tour : la candidature TF-1020 attend votre mot « décide TF-1020 », et les gestes réservés (publication des produits, runs de personnalisation, mandat forge-agents) restent au tableau du bloc 8.

## 4. Traité — avec sa preuve

- **Le pilot est publié sous D-13 (a), motif déclaré au contrôle d'avance, porte rejouée par le hook.**
  - preuve : avant push `origin/main` = `c37732c`, 2 en avance (`610e943` explicite, `233d582` restitution) ; `FORGE_PUSH_GO="D-13 (a) du 11/09/2026" git push origin 233d582…:refs/heads/main` → `c37732c..233d582`, **`PUSH_EXIT=0`, 88 s** ; `ls-remote` = `233d582` ; `fetch` : 0 en avance, 0 en retard.
- **Ce qui est en ligne chez le pilot est mesuré sur une copie fraîche.**
  - preuve : clone à branche unique sous `%TEMP%` (`core.longpaths`) : `HEAD` = `233d582`, **701 enregistrements, 1 435 fichiers** ; `oracles\hook-restitution.mjs` porte `controlerGeste`, `oracles\oracle-synthese.mjs` porte S42, `scripts\verifier-avance-publication.mjs` présent, `gabarits\RESTITUTION.md` « version 2.21.0 », `todo\TODO.jsonl` porte la clôture TF-1019 ; `oracle-todo` **PASS** ; `oracle-synthese --self-test` **19/19** ; porte **PASS, 1 constat, 0 antériorité, 0 bloquant, 95 s** ; clone supprimé après mesure.
- **La forge d'audit est publiée et étiquetée.**
  - preuve : `git push origin ebdf745…:refs/heads/main` → `53ca664..ebdf745`, **`PUSH_EXIT=0`, 4 s** (porte du hook comprise) ; `ls-remote` = `ebdf745` ; `git tag -a v1.18.0` puis `git push origin v1.18.0` → « [new tag] », tag distant `e9b80eb`.
- **Le run hébergé est lu, et son verdict est inscrit ici — pas supposé.**
  - preuve : `gh run watch 34581219111` puis `gh run view` : **`batterie` success · `oracles (windows-latest)` success · `oracles (ubuntu-latest)` failure** ; `--log-failed` : `# pass 125`, `# fail 1`, `# skipped 1` ; `ok 61 … # SKIP` (EOL, motif mesuré) sur les deux runners ; `not ok 110` sur ubuntu seul : « build-fiche sort 1 : … PDF REFUSÉ (FAIL) : P3 2 pages pour un maximum de 1 : le tirage a débordé », `expected: 'JUGE'`, `actual: 'ECHEC'` ; le même test rend `ok 110` sur windows.
- **TF-1020 déposé — la fiche PDF sort sur deux pages sur le runner Linux et P3 (la règle du juge PDF sur le nombre de pages) la refuse : les polices du thème n'y existent pas.** Classe existante de TF-1017 (la recette ne rejoue pas l'environnement), récidive comptée — voulu.
  - preuve : `config\tenants\exemple\theme\theme.css` : `--font-body: system-ui, Segoe UI, Roboto, Arial, sans-serif` ; `.github\workflows\ci.yml` : aucune installation de police, aucune `@font-face` ; `ingerer-lot.mjs` « [OK] 1 candidature(s) ingérée(s) en CANDIDAT (lot `8beafca17d9a`) » ; `oracle-todo` **PASS** ; vues régénérées ; enregistrement `0da9a54` ; `verifier-avance-publication` : **PASS, `0da9a54:candidature`**.

## 5. Non traité — avec son motif

- La correction du rouge Linux (police embarquée dans le thème ou installée par le workflow, « polices » ajoutée aux conditions rejouées par la recette) — motif : `gate_gouvernance`, c'est TF-1020, et « décide TF-1020 » est votre mot ; A-1.
- La publication des douze enregistrements d'héritage chez les produits — motif : `gate_gouvernance`, dépôts clients ; A-6.
- La doctrine de la dimension D17 et les champs `a_completer` des neuf ADR — motif : `gate_gouvernance`, contenu du commanditaire ; A-3.
- Le lint d'agnosticité étendu au pack de doctrine ; S42 bloquante et les 7 livrables au-dessus de la borne ; le câblage du contrôle d'avance dans l'installeur de forge-agents — motifs inchangés depuis la synthèse précédente (`borne_atteinte`, `gate_gouvernance`, `hors_mandat`) ; A-2, A-4, A-5.
- La personnalisation chez les produits des fichiers instanciés — motif : `hors_mandat`, geste du produit dans son run ; A-7.

## 6. Écarts à la lettre

- **Vous avez demandé** « 13a » — publier le pilot et la forge d'audit, poser le tag, lire le run. **J'ai** fait les quatre, puis déposé une candidature et l'ai publiée d'office. **Pourquoi** : « constat en passant → candidat » est un garde-fou du noyau, et R-38 §5, écrit sous D-12 (a), couvre un enregistrement qui ne porte qu'une candidature en `candidat` — le contrôle d'avance l'a classé ainsi.
- **Le run hébergé reste rouge sur Linux après un push présenté comme « publié et vérifié ».** **J'ai** inscrit le rouge ici avec sa cause mesurée au lieu de le corriger dans la foulée. **Pourquoi** : la cause est neuve (polices du runner, pas le moteur d'impression) et se corrige par un choix — embarquer une police libre ou l'installer en CI — qui engage le rendu de tous les audits ; la règle (4) de TF-1017 demande de lire et d'inscrire, et c'est fait.
- Aucun autre écart : sha explicites, aucun forçage, porte rejouée par les hooks, mesure sur clone frais, aucune écriture chez un produit ni dans un dépôt frère dans ce tour.

## 7. Risques

- **Le rouge Linux redevient un bruit de fond si personne ne le lit à chaque push.**
  - signal : un run rouge dont la restitution ne nomme pas le test.
  - parade : la lecture est inscrite ici et à A-1 ; la correction TF-1020 rend le tirage indépendant du runner.
- **Un livrable imprimé dont la conformité dépend des polices de la machine.**
  - signal : deux runners, deux comptes de pages pour le même HTML.
  - parade : police embarquée (`@font-face` versionnée) — proposition (a) de TF-1020.
- **Les enregistrements d'héritage restent locaux chez douze produits.**
  - signal : `git status` de chaque produit : 1 en avance sur son origine.
  - parade : A-6, par les sessions des produits ou votre mot produit par produit.
- **Le contrôle d'avance vit encore dans un hook non versionné.**
  - signal : une re-pose de l'hameçon l'efface.
  - parade : A-5 sous mandat forge-agents (A-8).

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Embarquer une police libre dans le thème de la fiche (ou l'installer dans le workflow), ajouter « polices » aux conditions rejouées par `tools/verifier.mjs`, fixture P3 à double sens, puis lire le run (TF-1020) | auto_ia | `gate_gouvernance` — attend « décide TF-1020 » ; à défaut, le job Linux reste rouge et le compte de pages dépend de la machine | simple × court |
| A-2 | Étendre `tools/lint-agnostic.mjs` de forge-audit au pack `core/dimensions/doctrine.yaml` (neuve) | auto_ia | `borne_atteinte` — porte de fusion hors du mandat du jour ; à défaut, un nom entré hors de l'importeur ne serait pas vu | simple × court |
| A-3 | Compléter la doctrine de D17 et les champs `a_completer` des neuf ADR, puis poser `tools/verifier-referentiel.mjs` en étape de CI (TF-1014) | auto_ia | `gate_gouvernance` — contenu du commanditaire ; à défaut, le juge reste hors CI | moyen × long |
| A-4 | Rendre S42 bloquante au hook et traiter les 7 livrables au-dessus de la borne (TF-1015) | auto_ia | `gate_gouvernance` — renommer un livrable publié est une décision (R-4, `old\`) ; à défaut, un clone profond échoue encore sur ces 7 | simple × court |
| A-5 | Porter le contrôle d'avance dans `installer-hamecon-publication.mjs` de forge-agents (neuve) | auto_ia | `hors_mandat` — dépôt frère non couvert, attend A-8 ; à défaut, le bloc du hook local disparaît à la prochaine pose | simple × court |
| A-6 | Faire pousser les 12 enregistrements d'héritage par les sessions des produits, ou donner le GO produit par produit — répondre « pousse <produit> » (neuve) | manuelle_utilisateur | `decision` — dépôts clients, la publication d'un produit n'est pas un geste du pilot ; sinon : la remise à niveau reste locale à ce poste | simple × court |
| A-7 | Demander un run chez chaque produit dont les fichiers instanciés sont à personnaliser — répondre « run <produit> » (neuve) | manuelle_utilisateur | `decision` — un produit ne se modifie que dans son run ; sinon : les fichiers instanciés restent des gabarits nus | simple × court |
| A-8 | Donner le mandat d'écriture sur forge-agents pour A-5 — répondre « mandat A-5 » (neuve) | manuelle_utilisateur | `decision` — aucune écriture dans un dépôt frère hors mandat ; sinon : A-5 ne se joue pas | simple × court |
| A-9 | Décider TF-1020 — répondre « décide TF-1020 » ou l'écarter avec son motif (TF-1020) | manuelle_utilisateur | `decision` — tout entre en candidat, la décision est humaine ; sinon : A-1 ne se joue pas | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 attend A-9, A-2 ne dépend de rien, A-3 attend le commanditaire, A-4 attend votre choix de renommage, A-5 attend A-8 ; parmi les vôtres, A-9 d'abord parce qu'un run rouge coûte à chaque push, A-6 ensuite parce que la remise à niveau ne vaut que publiée, puis A-7 et A-8 qui n'ont d'autre coût qu'un mot.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - D-13 a executee pilot et forge publies CI lue - 20260911e.md` — ce document.
- Pilot : push `c37732c..233d582` (motif de GO `D-13 (a) du 11/09/2026`) ; clone de vérification sous `%TEMP%` : 701 enregistrements, 1 435 fichiers, porte PASS 1/0/0 — supprimé après mesure ; `input\01-candidatures\fiche-pdf-deux-pages-sur-runner-sans-polices-forge-audit-20260911a.tf.jsonl` (TF-1020, lot `8beafca17d9a`) ; enregistrement `0da9a54` (candidature seule).
- Forge-audit : push `53ca664..ebdf745`, tag `v1.18.0` (`e9b80eb`) ; run hébergé `34581219111` (batterie vert, windows vert, ubuntu rouge sur le test 110) ; runs précédents `34498539196`, `34133936024` (rouges sur les tests 61 et 92).
- `output\04-plans\Digit-AI - Synthese Mandat - Quinze actions traitees publication en attente - 20260911d.md` — la synthèse précédente, dont D-13 est la décision exécutée ici, en ligne en `233d582`.
- Aucun livrable HTML produit dans ce tour ; aucune écriture chez un produit ni dans un dépôt frère autre que le push de forge-audit.
