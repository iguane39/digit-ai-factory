---
destinataire: humain
---

# Point d'étape : vos décisions D-5 (a), D-6 (a) et D-7 (a) sont exécutées ; le rejeu de 38 exécutions tourne, son résultat n'est pas encore mesurable (01/10/2026)

Vos 3 décisions sont exécutées : l'étude, sa synthèse et la note de correction de l'analyse du 27 septembre sont enregistrées localement, sans envoi ; les 5 candidatures sont ouvertes au registre, celle du rejeu déjà décidée par votre réponse ; le rejeu est lancé. Ce qui change pour vous : dans 1 à 3 heures, la Factory aura sa première mesure contrôlée du couple modèle et effort sur 6 de ses propres tâches, jugée tâche par tâche par un contrôle automatique, et ce sont ces chiffres, pas la documentation de l'éditeur, qui fonderont les réglages. Rien n'est attendu de vous avant la fin du rejeu ; la restitution complète viendra avec ses résultats et les décisions qui en découlent.

## 1. En-tête d'identification

- **quoi** — point d'étape : exécution des décisions D-5 (a), D-6 (a) et D-7 (a) ; le rejeu est lancé et son résultat n'est pas encore mesurable.
- **sur quoi** — le pilot `digit-ai-factory` (1 commit local, 6 événements au registre) ; 4 copies de travail détachées du pilot sous `C:\Users\Sébastien\rj\` ; les fichiers du banc dans le répertoire temporaire de la session.
- **quand** — 2026-10-01, point fait à 20:58 heure de Paris (UTC+02:00) ; première mesure d'horloge du tour à 20:43 (18:43:58 UTC), prise à la réception de votre réponse ; durée mesurée ≥ 15 min.
- **qui** — session de pilotage Claude Opus 5.5 (contexte 1M), effort `max` ; pilot à `e73c96e1` ; sessions du banc : Claude Code 2.1.280, binaire de l'extension VS Code ; oracles joués : `oracle-todo.mjs`, `run-oracles.mjs`, `check_markdown.py`, `oracle-premisse-acces.mjs`, `oracle-ecriture.mjs`, le contrôle des 6 juges du banc, et `oracle-synthese` sur ce document.
- **intention** — savoir si le nouveau modèle permet à la Factory de faire le même travail plus vite, avec moins de jetons et moins de reprises, et quels réglages changer pour en tirer parti sans affaiblir la qualité. **Test rétro** : ce tour sert l'intention en lançant la seule mesure qui puisse départager les réglages sur les tâches de la Factory ; il ne la sert pas encore, aucun résultat n'étant mesuré.

## 2. Ce qui reste à mesurer, et par quoi

Les 38 exécutions du rejeu : le verdict du contrôle de chaque tâche, la durée, les jetons générés, relus et écrits par tâche close, le modèle et l'effort réellement servis, et les écarts de périmètre. Ils sont mesurés par le lanceur `rejeu.mjs`, dont les 6 juges ont été vérifiés (10 cas sur 10 conformes), et consignés ligne à ligne dans `resultats.jsonl` du banc, à la fin du rejeu, dans 1 à 3 heures.

## 3. Décisions attendues de l'humain

Rien n'attend votre décision avant la fin du rejeu ; les décisions sur ses résultats viendront avec la restitution complète.

## 4. Traité — avec sa preuve

- **D-7 (a), l'enregistrement local sans push** : commit `e73c96e1`, 16 fichiers : l'étude, sa synthèse et leurs journaux d'oracles, la trace du jugement de la synthèse, l'analyse du 27/09 avec sa note de correction, et 4 index de dossiers régénérés par le crochet du dépôt.
  - preuve : `git log --oneline -1` → `e73c96e1 Etude d opportunite « passage d Opus 5 a Opus 5.5 » […] (decision humaine D-7 (a) du 01/10 : enregistrement local, sans push)` ; `git show --stat` → 16 fichiers, 760 insertions ; index git vide et arbre propre après coup ; aucun push.
- **La note de correction de l'analyse du 27/09** : au 2026-09-27 à 16:44 UTC, le journal du hook portait 1 832 entrées, dont 1 391 de test et 441 de vraies sessions, qui comptent 96 refus (source : journal du hook, recalcul du 2026-10-01) ; le texte d'origine reste visible.
  - preuve : `run-oracles.mjs` → « CONFORME — 5 PASS, 4 SKIP, 0 échec » ; `check_markdown.py`, `oracle-premisse-acces.mjs` et `oracle-ecriture.mjs` → PASS sur l'analyse annotée.
- **D-5 (a), les 5 candidatures ouvertes** : TF-1557 (effort par classe de tâche), TF-1558 (session neuve par mandat), TF-1559 (le rejeu), TF-1560 (réglage du poste au nom de famille), TF-1561 (effort des sous-agents), chacune avec sa fiche de décision complète pour la revue hebdomadaire ; TF-1559 passée en « décidé » sur D-6 (a).
  - preuve : `node todo\journaliser.mjs --fichier <lot>` → « 6 événement(s) journalisé(s) », verdict du registre PASS avant et après ; `node todo\oracle-todo.mjs` → PASS ; `node todo\generer-vue.mjs` → « TODO.md générée — 779 actifs ».
- **D-6 (a), le rejeu lancé** : protocole figé le 2026-10-01 à 18:57:10 UTC avant le premier run, empreinte sha256 `8b51e9b5…`, 38 exécutions tirées au sort avec une graine fixe, 4 copies de travail en parallèle, plafond de 150 millions de jetons relus, 40 minutes au plus par exécution.
  - preuve : `PROTOCOLE.json` et la première ligne de `rejeu.log` (`protocole_fige`, 38 runs) ; contrôle des juges → « JUGES : 10/10 conformes » ; essai d'isolation à 1 run → Sonnet 5 servi, réponse « OK » en 3 s, plugin de mémoire absent des plugins chargés, aucun hook du projet.
- **Un piège évité, du rouge au vert, sur sa classe (harnais différent de la production)** : la commande `claude` installée en global est la version 2.1.107, quand vos sessions tournent sur la 2.1.280 et que seule celle-ci accepte l'effort `xhigh` ; le banc utilise le binaire 2.1.280 de l'extension.
  - preuve : `claude --version` → « 2.1.107 » ; binaire de l'extension `--version` → « 2.1.280 », effort accepté « low, medium, high, xhigh, max ».

## 5. Non traité — avec son motif

- Les résultats du rejeu — motif : impossible à prouver avant la fin des 38 exécutions, en cours.
- L'enregistrement des écritures au registre et de ses vues — motif : dépendance à une décision humaine, qui sera posée à la restitution complète ; D-7 couvrait l'étude, pas le registre.
- La consignation du résultat au référentiel des modèles en service et la clôture du re-test — motif : dépendance à une décision humaine, que le protocole réserve à l'humain.

## 6. Écarts à la lettre

- **D-6 (a) visait le rejeu figé de l'étude** → **j'ai précisé, avant tout résultat**, les entrées concrètes des 6 tâches : un dossier de tour figé, le défaut d'oracle réinjecté par l'inverse du correctif du 28/09, un prompt jamais analysé, la candidature TF-1392, une page à 4 défauts, une extraction du registre → **pourquoi** : l'étude nommait des classes de tâches, pas leurs entrées ; elles sont figées et empreintées dans le protocole.
- **L'étude prévoyait de « critiquer une page », jugée par la forge de design** → **j'ai fait** « corriger une page jusqu'au PASS du contrôle de conformité du socle » → **pourquoi** : une critique n'a pas d'oracle qui la juge, une correction en a un.
- **Les sessions du banc tournent sans les hooks du projet ni le plugin de mémoire** → **pourquoi** : le hook d'ouverture du pilot met à jour les 15 dépôts réels à chaque session, 38 fois ; le plugin aurait inscrit 38 sessions de banc dans votre mémoire de sessions. Les hooks et plugins de votre profil, dont le contrôle qualité à l'écriture, restent actifs.
- **Les sessions du banc finissent en 3 lignes, pas en 8 blocs** → **pourquoi** : sans hook de fin de tour rien ne jugerait ces 8 blocs, et la tâche de restitution mesure déjà ce savoir-faire.
- **Les 4 copies de travail vivent sous `C:\Users\Sébastien\rj\`, hors du dépôt** → **pourquoi** : un chemin court tient sous la limite de 260 caractères de Windows, le chemin le plus long du dépôt faisant 156 caractères.

## 7. Risques

- Le rejeu consomme votre quota et peut ralentir vos autres sessions ;
  - signal : un avertissement de limite d'usage dans une session ;
  - parade : l'arrêt automatique au plafond de 150 millions de jetons relus.
- Une session du banc écrit hors de sa copie de travail ;
  - signal : un écart de périmètre relevé dans `resultats.jsonl`, ou un dépôt réel modifié ;
  - parade : les copies sont détachées, l'écart est relevé à chaque exécution, et l'état des dépôts réels sera vérifié à la fin.
- Une exécution dépasse 40 minutes ;
  - signal : la marque d'arrêt forcé dans ses résultats ;
  - parade : l'arrêt du processus et de ses enfants, l'exécution comptée comme échouée.

## 8. Prochaines actions

Ordre du tableau : dans l'ordre où le rejeu les rend possibles ; aucune action humaine n'est due avant sa fin.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-10 | À la fin du rejeu, analyser `resultats.jsonl` : réussite par tâche et par configuration, durée et jetons par tâche close, application des critères figés (neuve) | auto_ia | `dependance_externe` — les 38 exécutions tournent en arrière-plan | moyen × moyen | aucun résultat ne ferme le re-test de routage |
| A-11 | Vérifier que les dépôts réels sont intacts, puis retirer les 4 copies de travail par `git worktree remove` (neuve) | auto_ia | `dependance_externe` — après la fin du rejeu | simple × court | 4 copies et leurs métadonnées restent sur le poste |
| A-12 | Rédiger la restitution complète, avec les résultats et les décisions qui en découlent (neuve) | auto_ia | `dependance_externe` — après l'analyse des résultats | simple × court | les résultats restent dans un fichier du banc, sans décision |

## 9. Traces

- Commit local : `e73c96e1` (16 fichiers) ; aucun push.
- Registre : `todo\TODO.jsonl` (6 événements, TF-1557 à TF-1561) et sa vue `todo\TODO.md`, non enregistrés.
- Banc : `PROTOCOLE.json` (sha256 `8b51e9b5…`), `rejeu.mjs`, `rejeu.log` et `resultats.jsonl`, dans le répertoire temporaire de cette session.
- Copies de travail : `C:\Users\Sébastien\rj\l1` à `l4`, détachées sur `e73c96e1`.
- Aucune page HTML livrée dans ce tour.
