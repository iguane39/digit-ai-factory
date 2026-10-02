---
destinataire: humain
---

# Synthèse de mandat : le rejeu est joué en entier ; Opus 5.5 à l'effort high réussit les 6 tâches, et l'effort max actuel n'est meilleur sur aucune ; 3 décisions nouvelles et 1 rappelée (01/10/2026)

Le rejeu autorisé par votre décision D-6 (a) est terminé : 38 exécutions sur 38, sous le plafond de jetons, sans rien écrire hors de ses copies de travail. Le résultat est net. Le réglage actuel de vos sessions, Opus 5.5 à l'effort maximal, ne réussit mieux sur aucune des 6 tâches de la Factory rejouées, et il met de 4,6 à 9,9 fois plus de temps par tâche réussie que les efforts élevé et moyen (source : document de résultats, calculé sur le banc). À l'effort élevé, Opus 5.5 réussit les 6 tâches ; à l'effort moyen, il en réussit 5 et manque la réparation de code, comme à l'effort maximal. Sonnet 5 tient la production standard. Ce qui est attendu de vous : dire si je plafonne l'effort de vos sessions au niveau élevé, si j'enregistre le résultat avec la clôture du re-test du routage, si je retire les 4 copies de travail du banc, et trancher le juge de l'analyse de prompt, toujours en attente.

## 1. En-tête d'identification

- **quoi** — fin du rejeu décidé par D-6 (a) : analyse des 38 exécutions selon le critère figé, vérification du périmètre du banc, document de résultats, restitution.
- **sur quoi** — le pilot `digit-ai-factory` : 1 document écrit, `output/03-etudes/20261001-etude-resultats-rejeu-opus-5-5.md`, avec ses journaux d'oracles et l'index du dossier régénéré par le hook ; lectures seules : les résultats et les archives du banc, les champs d'appel d'outil des 45 journaux de session du banc, les réglages du poste.
- **quand** — 2026-10-01, fin à 22:40 heure de Paris (UTC+02:00) ; travail repris à 22:23 (20:23:30 UTC), à la fin du rejeu, terminé à 20:22:11 UTC ; durée mesurée ≥ 17 min.
- **qui** — session de pilotage Claude Opus 5.5 (contexte 1M), effort `max` par la variable de lancement de cette session ; pilot à `f82270f2`, fusion faite par une autre session à 21:45 ; aucune délégation, escalade de modèle : aucune ; sessions du banc : Claude Code 2.1.280 ; contrôles joués : `analyse.mjs` et `perimetre.mjs` du banc, `run-oracles.mjs`, `check_markdown.py`, `oracle-ecriture.mjs`, `oracle-premisse-acces.mjs`, `oracle-autorite-decision.mjs`, et `oracle-synthese` sur ce document.
- **intention** — savoir si le nouveau modèle permet à la Factory de faire le même travail plus vite, avec moins de jetons et moins de reprises, et quels réglages changer pour en tirer parti sans affaiblir la qualité. **Test rétro** : ce tour sert l'intention, car il fonde sur une mesure contrôlée le réglage qui fait gagner le plus de temps, l'effort `high` à la place de `max`, sans perte de réussite sur les 6 tâches ; il ne la sert pas encore entièrement, car aucun réglage n'est changé sans votre décision, et les sessions longues de pilotage restent à vérifier à la revue du 2026-10-15.

## 2. Verdict en une ligne

**Rejeu joué en entier : 38 exécutions jugées, 131 932 479 jetons relus sur 150 millions ; critère figé appliqué : Opus 5.5 à `high` retenu sur les 6 tâches, Opus 5.5 à `medium` et Sonnet 5 à `high` sur 5, Opus 5 à `high` sur 4, Opus 5.5 à `max` meilleur sur aucune ; document de résultats conforme au socle qualité (5 PASS, 2 SKIP, 0 échec), lisibilité et écriture PASS ; 0 écriture du banc hors de ses copies ; 0 réglage modifié, 0 enregistrement git, 0 suppression.**

Ne vérifie pas : la qualité des livrables au-delà des critères que nomme chaque consigne, les sessions longues de pilotage, ni Haiku 4.5, qui n'était pas au banc.

## 3. Décisions attendues de l'humain

3 décisions nouvelles, qui vous reviennent parce qu'elles modifient un réglage du poste, enregistrent dans git ou suppriment des fichiers, et 1 décision rappelée. Chacune se lit de haut en bas : la question, son sujet, la recommandation et sa source, puis un tableau dont chaque ligne est une option, avec son coût en deuxième colonne et ce qu'elle exclut en troisième, et enfin l'option qui s'applique si rien n'est décidé.

**D-8** : le critère du juge de l'analyse de prompt, posée le 01/10 à 22:00, inchangée.

> **D-9 — L'effort de vos sessions passe-t-il de `max` à `high` ?**
>
> Vos sessions tournent aujourd'hui à l'effort `max`, par la variable `CLAUDE_CODE_EFFORT_LEVEL` posée au lancement, qui prime sur le réglage `medium` déjà inscrit pour Opus 5.5 dans `~/.claude/settings.json`. Le rejeu montre qu'à l'effort `high` Opus 5.5 réussit les 6 tâches, de 4,6 à 6,3 fois plus vite par tâche réussie, et que `max` ne réussit mieux nulle part. Les sous-agents héritent de cet effort. Les 2 candidatures du registre sur l'effort par classe de tâche et sur l'effort des sous-agents attendent cette réponse.
>
> **Recommandation : (a).** Source consultée : le document de résultats, sections « Verdict du critère figé » et « Réglages que ce résultat fonde », et le schéma des réglages de Claude Code 2.1.280, où `maxEffortLevel` plafonne tout effort plus haut, variable de lancement comprise. Un plafond agit à chaque session sans geste de votre part, et une ligne retirée le lève.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** plafonner l'effort à `high` : j'ajoute `"maxEffortLevel": "high"` à `~/.claude/settings.json`, j'aligne sur `high` l'effort inscrit pour Opus 5.5, et je passe les 2 candidatures en « décidé » ; contrôle à la revue du 2026-10-15 | effort simple × court | exclut `max` tant que la ligne reste ; une tâche qui l'exigerait passe par son retrait |
| **(b)** régler l'effort à la main : vous tapez `/effort high` dans la zone de saisie de chaque nouvelle session | effort simple × court, à chaque session | exclut la tenue du réglage : une session lancée à `max` y reste si le geste est oublié |
| **(c)** garder `max` | effort nul | exclut le gain mesuré : de 4,6 à 9,9 fois plus de temps par tâche réussie, sans réussite de plus |

> **Si rien n'est décidé** : l'option (c) s'applique — vos sessions restent à `max`.

> **D-10 — Le résultat s'enregistre-t-il, avec la clôture du re-test du routage ?**
>
> Le rejeu ferme le re-test de la règle de routage, inscrit « dû » depuis le 25 septembre dans `references/MODELES-EN-SERVICE.json`, champ `clos_par` vide ; l'étude réserve sa consignation à votre décision. Le document de résultats `output/03-etudes/20261001-etude-resultats-rejeu-opus-5-5.md` et cette synthèse ne sont pas enregistrés, et le banc, soit le lanceur `rejeu.mjs`, les protocoles, les entrées figées, les résultats et les scripts d'analyse, pour 388 Ko, vit dans le dossier temporaire de cette session : il disparaîtra avec lui, alors que l'étude prévoit de le rejouer à chaque nouvelle version d'un modèle.
>
> **Recommandation : (a).** Source consultée : la section « Plan de rejeu contrôlé » de l'étude (« Le résultat se consigne au référentiel des modèles en service (`clos_par`) […] par décision humaine »), sa section « Répétabilité », et `CLAUDE.md` du pilot (git local, push sur feu vert humain). Le juge de l'analyse de prompt, encore ouvert, ne change pas la conclusion sur le routage.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** consigner le résultat au référentiel des modèles en service, re-test clos par le document de résultats ; clore au registre la candidature du rejeu ; verser le banc, sans les livrables archivés, sous `output/03-etudes/20261001-banc-rejeu-opus-5-5/` ; enregistrer localement le tout avec cette synthèse, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** enregistrer localement le document de résultats et cette synthèse seulement | effort simple × court | exclut la clôture du re-test, qui reste dû, et la conservation du banc |
| **(c)** ne rien enregistrer | effort nul | exclut la traçabilité : les fichiers restent non suivis et le banc disparaît |

> **Si rien n'est décidé** : l'option (c) s'applique — rien n'est enregistré.

> **D-11 — Les 4 copies de travail du banc sont-elles retirées ?**
>
> Le rejeu a tourné dans 4 copies de travail du pilot, détachées au commit de l'étude, sous `C:\Users\Sébastien\rj\`. Elles occupent 1 014 Mo et restent inscrites à la liste des copies de travail du dépôt. Leur contenu utile, le livrable et le diff de chaque exécution, est archivé dans le banc. Les retirer supprime des fichiers, ce que vos instructions de profil réservent à votre autorisation explicite.
>
> **Recommandation : (a).** Source consultée : `git worktree list` (4 copies détachées à `e73c96e1`), l'archive `livrables/` du banc (34 exécutions) et vos instructions de profil sur la suppression de fichiers. Rien ne se rejoue sur ces copies : un prochain rejeu en recrée des neuves.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** retirer les 4 copies par `git worktree remove` | effort simple × court | exclut un examen sur les copies elles-mêmes ; les archives du banc restent |
| **(b)** les garder jusqu'à la revue du 2026-10-15 | effort nul | exclut l'usage de 1 014 Mo de disque jusque-là |

> **Si rien n'est décidé** : l'option (b) s'applique — les copies restent.

## 4. Traité — avec sa preuve

- **Le rejeu est joué en entier** : 34 exécutions de la version 2 et 4 de la version 1, gardées ; fin à 20:22:11 UTC, sans arrêt forcé ni dépassement de délai ; 131 932 479 jetons relus en tout, sous le plafond de 150 millions.
  - preuve : dernière ligne de `rejeu.log` → `{"evenement":"fin","arret":"34 exécutions jouées","cache_lu_cumule":131932479,"fin":"2026-10-01T20:22:11.107Z"}` ; `resultats.jsonl` → 38 lignes ; tâche de fond close sur le code 0.
- **Le critère figé est appliqué aux 38 exécutions** : Opus 5.5 à `high` est retenu sur les 6 tâches, avec une durée par tâche réussie en baisse de 78 à 84 % là où `max` réussit ; Opus 5.5 à `medium` est retenu sur 5 tâches, Sonnet 5 à `high` sur 5, Opus 5 à `high` sur 4 (source : `analyse.mjs`).
  - preuve : `analyse.mjs` → « Verdicts du critère figé », reportés au document de résultats ; sur chaque réponse des 38 exécutions, le modèle et l'effort servis sont ceux de la configuration (« anomalies de service : aucune »).
- **Les 7 échecs sont examinés un par un, et 5 sont réels** : les 4 réparations d'oracle sous Opus 5.5 à `max` et à `medium` ne lisent une section que sous un titre de niveau 2, et accusent à tort l'étude du 12/08, dont le tableau est sous un titre de niveau 3 ; celle d'Opus 5 ne lit plus aucune étude réelle, avec 55 divergences sur 55. Les 2 autres, des analyses de prompt sous Sonnet 5 et Opus 5, ne manquent que le bloc de code que le juge exige à tort.
  - preuve : la fonction de lecture des sections, relue dans les 4 archives ; l'archive d'une réparation sous `max`, rejouée sur l'étude du 12/08 → « aucune ligne au tableau de non-recouvrement », celle sous `high` → « 5 ligne(s) de non-recouvrement, toutes citées » ; celle d'Opus 5, sur l'étude du 14/08 → « 0 source(s) datée(s) ».
- **Les 2 dernières analyses de prompt sont jugées et ne changent rien à D-8** : sous Opus 5.5 à `high` et à `max`, elles portent leur prompt réécrit en bloc de code et réussissent ; elles réussiraient sous l'un ou l'autre critère, et D-8 ne touche que les analyses de Sonnet 5 et d'Opus 5.
  - preuve : `resultats.jsonl`, exécutions 32 et 35 → réussite sous le juge actuel, qui exige le bloc de code.
- **Le banc n'a rien écrit hors de ses copies de travail** : 45 journaux de session, 1 100 appels d'outils, 135 écritures, toutes dans leur copie ; aucune commande visant les dépôts réels de `C:\dev`, aucun enregistrement git, aucun lancement de l'ouverture du pilot.
  - preuve : `perimetre.mjs` → `ecritures_hors_couloir: []`, `nb_commandes_visant_c_dev: 0`, `commandes_a_effet: []` ; 2 commandes `git log --oneline -3` relevées, sous l'analyse de prompt et l'extraction, aucune sous la réparation d'oracle, où l'historique est interdit.
- **Le document de résultats est écrit et contrôlé** : `output/03-etudes/20261001-etude-resultats-rejeu-opus-5-5.md`, avec ses tableaux par tâche, ses échecs, ses hypothèses, sa variance, ses limites et les 3 réglages qu'il fonde.
  - preuve : `run-oracles.mjs` → « CONFORME — 5 PASS, 2 SKIP, 0 échec », une source ajoutée au seuil de 25 % qu'il signalait ; `check_markdown.py` → PASS ; `oracle-ecriture.mjs` → PASS, avec 1 avertissement d'anaphore assumé dans un tableau ; `oracle-premisse-acces.mjs` et `oracle-autorite-decision.mjs` → sans objet.
- **Constaté, fait par une autre session : vos écritures au registre et mes 2 points d'étape du rejeu sont enregistrés** : le commit `df604d02` porte les 6 événements des candidatures nées de l'étude et les 2 synthèses, sur votre décision « commit avant fusion » que rapporte son message.
  - preuve : `git log -1` sur la synthèse du premier point d'étape → `df604d02` ; `git show --stat df604d02` → `todo/TODO.jsonl` (6 lignes ajoutées) et la synthèse du second point d'étape.

## 5. Non traité — avec son motif

- Le plafond d'effort et le passage des 2 candidatures en « décidé » — motif : dépendance à une décision humaine (D-9) ; c'est un réglage du poste.
- La consignation au référentiel, la clôture du re-test et de la candidature du rejeu, le versement du banc et l'enregistrement git — motif : dépendance à une décision humaine (D-10).
- Le retrait des 4 copies de travail, annoncé comme action de l'IA dans mes 2 points d'étape — motif : dépendance à une décision humaine (D-11) ; c'est une suppression de fichiers.
- Le rejugement des analyses de prompt — motif : dépendance à une décision humaine (D-8).
- Les hypothèses sur les refus de restitution d'Opus 5.5 face à Opus 5, et sur les sessions neuves — motif : impossible à prouver sur ce banc, qui joue 1 restitution par modèle et ne compare aucune session longue (critère de réouverture : la revue du 2026-10-15, sur les journaux réels).
- Haiku 4.5, modèle des tâches mécaniques — motif : écarté, absent du plan figé (critère de réouverture : une campagne mécanique qui en compare 2 tranches).

## 6. Écarts à la lettre

- **Mes 2 points d'étape annonçaient le retrait des 4 copies de travail comme une action de l'IA** → **je ne l'ai pas fait** → **pourquoi** : c'est une suppression de fichiers, que vos instructions de profil réservent à une autorisation explicite ; D-11 la pose.
- **Le plan de l'étude comptait le nombre de réécritures demandées par les contrôles** → **il n'est pas isolé** → **pourquoi** : les journaux du banc mêlent les passages du contrôle à l'écriture et ses refus, et les hooks du projet étaient coupés ; la qualité est jugée par le contrôle de chaque tâche.
- **Ma recommandation sur D-8 voulait le critère décidé avant de connaître les 2 dernières analyses** → **le rejeu s'est terminé avant votre réponse** → **pourquoi** : il tournait en arrière-plan ; les 2 analyses réussissent sous les 2 critères, et le choix ne dépend donc pas d'elles.

## 7. Risques

- L'effort `high` n'est pas mesuré sur les sessions longues de pilotage ;
  - signal : à la revue du 2026-10-15, un taux de refus au premier passage par le juge de fin de tour supérieur de plus de 5 points aux 9,1 % mesurés sous `max` ;
  - parade : retirer la ligne de plafond, qui rend `max` aussitôt.
- Le plafond vaut pour tous les modèles et pour les sous-agents ;
  - signal : une tâche qui échoue à `high` et réussit à `max` ;
  - parade : un plafond par modèle, dans le même fichier, ou le retrait de la ligne.
- Une autre session écrit dans le pilot ce soir, au registre et dans des scripts ;
  - signal : des fichiers modifiés qui ne sont pas les miens à `git status` ;
  - parade : chaque enregistrement ne porte que mes chemins, vérifiés avant et après.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, dans l'ordre des décisions qu'elles attendent ; puis l'action humaine qui les débloque toutes.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-13 | Rejuger les 7 analyses de prompt sur leurs archives avec le critère retenu, et reporter les 2 verdicts au document de résultats (neuve) | auto_ia | `dependance_bloc_3` — attend D-8 (a) | simple × court | les analyses de Sonnet 5 et d'Opus 5 restent comptées en échec sur un critère que la consigne ne nomme pas |
| A-14 | Plafonner l'effort à `high` dans `~/.claude/settings.json`, aligner l'effort inscrit pour Opus 5.5, passer les 2 candidatures en « décidé » par `node todo\journaliser.mjs` (neuve) | auto_ia | `dependance_bloc_3` — attend D-9 (a) | simple × court | vos sessions restent à `max` |
| A-15 | Consigner le re-test clos au référentiel des modèles en service, clore la candidature du rejeu, verser le banc sous `output/03-etudes/20261001-banc-rejeu-opus-5-5/`, enregistrer localement mes seuls chemins, sans push (neuve) | auto_ia | `dependance_bloc_3` — attend D-10 (a) ou (b) | simple × court | le re-test reste dû et le banc disparaît avec la session |
| A-16 | Retirer les 4 copies de travail par `git worktree remove` (neuve) | auto_ia | `dependance_bloc_3` — attend D-11 (a) | simple × court | 1 014 Mo restent occupés |
| A-17 | Trancher D-8, D-9, D-10 et D-11 en répondant par exemple « 8a, 9a, 10a, 11a » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — un critère de juge, un réglage du poste, un enregistrement git et une suppression attendent votre autorisation | simple × court | rien n'est réglé, enregistré ni retiré |

## 9. Traces

- Document de résultats : `output/03-etudes/20261001-etude-resultats-rejeu-opus-5-5.md`, et ses journaux d'oracles sous `.oracles/output/03-etudes/`.
- Cette synthèse : `output/04-plans/Digit-AI - Synthese Mandat - Rejeu joue effort high retenu sur 6 taches - 20261001k.md`.
- Banc, dans le dossier temporaire de cette session : `rejeu.mjs`, `PROTOCOLE.json`, `PROTOCOLE-v2.json`, `resultats.jsonl`, `resultats-v1.jsonl`, `rejeu.log`, `rejeu-v1.log`, `analyse.mjs`, `analyse.txt`, `perimetre.mjs`, `livrables/`.
- Copies de travail : `C:\Users\Sébastien\rj\l1` à `l4`, détachées sur `e73c96e1`.
- Aucun enregistrement git dans ce tour ; aucune page HTML livrée.
