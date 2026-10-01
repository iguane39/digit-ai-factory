---
destinataire: humain
---

# Synthèse de mandat : vos décisions D-1 (a), D-2 (a) et D-3 (a) sont exécutées, l'étude du passage à Opus 5.5 est jouée et retient de mesurer avant de régler ; 3 décisions vous attendent (01/10/2026)

Vos 3 décisions sont exécutées : les 2 fichiers du 27 septembre sont enregistrés localement, sans envoi, et l'étude est jouée dans cette session avec le prompt que vous avez validé ; elle passe ses 10 contrôles. Ce qu'elle change pour vous : une bonne part de la revue demandée avait déjà été faite le 25 septembre sur votre autre poste, et la fusion de ce soir l'a rendue visible ici. Restent 3 leviers, mesurés sur vos propres journaux de session (source : calcul de l'étude) : le niveau de réflexion tourne au maximum sans qu'aucune mesure le justifie, la relecture du contexte pèse environ 350 fois plus que la génération quel que soit le modèle, et le re-test du routage, dû depuis le 25 septembre, n'avait pas de protocole. L'étude retient de mesurer d'abord, par un rejeu figé de 6 tâches, avant de régler quoi que ce soit, et elle corrige un chiffre faux de l'analyse du 27. Ce qui est attendu de vous : dire si j'ouvre les 5 candidatures au registre, si vous autorisez la dépense du rejeu, et si j'enregistre l'étude.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-1 (a), D-2 (a) et D-3 (a) : enregistrement local des fichiers du 27/09, puis étude d'opportunité jouée avec le prompt réécrit validé, jusqu'au verdict de son oracle ; restitution.
- **sur quoi** — le pilot `digit-ai-factory` (1 commit local, 1 fichier d'étude) ; lectures seules : 7 pages de documentation officielle, les réglages du poste, les journaux de session du pilot et, pour leurs seuls champs de modèle et d'effort, ceux des sessions de produits présentes au journal du hook ; `CONTRAT-INTERFACE.md`, `references\MODELES-EN-SERVICE.json`, le registre.
- **quand** — 2026-10-01, fin à 20:18 heure de Paris (UTC+02:00) ; première mesure d'horloge du tour à 19:59 (17:59 UTC), prise à la réception de votre réponse ; durée mesurée ≥ 19 min.
- **qui** — session de pilotage Claude Opus 5.5 (contexte 1M), effort `max` par la variable de lancement de cette session ; pilot passé de `75c14b3d` (fusion faite par une autre session à 19:58) à `8f209e89` par mon enregistrement ; aucune délégation, escalade de modèle : aucune ; oracles joués : `oracle-etude-opportunite.mjs`, `run-oracles.mjs`, `check_markdown.py`, `oracle-ecriture.mjs`, `oracle-modeles-en-service.mjs`, et `oracle-synthese` sur ce document.
- **intention** — savoir si le nouveau modèle permet à la Factory de faire le même travail plus vite, avec moins de jetons et moins de reprises, et quels mécanismes changer pour en tirer parti sans affaiblir la qualité. **Test rétro** : l'étude sert cette intention en mesurant sur la Factory ce que les 2 modèles et leurs réglages coûtent en temps, en jetons et en refus, et en ne retenant que des réglages qu'un rejeu aura prouvés ; elle ne la sert pas encore entièrement, car aucun réglage n'est changé tant que le rejeu n'a pas été autorisé et joué.

## 2. Verdict en une ligne

**D-3 (a) : commit local `8f209e89`, 12 fichiers, sans push. D-1 (a) et D-2 (a) : étude jouée, `oracle-etude-opportunite.mjs` PASS sur E1 à E10, socle qualité conforme (4 PASS, 3 SKIP, 0 échec), lisibilité et écriture PASS ; verdict de l'étude : O2 (mesurer avant de régler) ; contrôle de fin tenu (tête du pilot inchangée, empreinte des réglages identique) ; 0 écriture au registre, 0 réglage modifié, 0 rejeu lancé.**

Ne vérifie pas : la justesse des déclarations de l'éditeur sur Opus 5.5, les journaux de votre autre poste, ni la qualité des réglages que le rejeu proposera.

## 3. Décisions attendues de l'humain

3 décisions, qui vous reviennent parce qu'elles écrivent au registre, engagent une dépense ou enregistrent dans git. Chacune se lit de haut en bas : la question, son sujet, la recommandation et sa source, puis un tableau dont chaque ligne est une option, avec son coût en deuxième colonne et ce qu'elle exclut en troisième, et enfin l'option qui s'applique si rien n'est décidé.

> **D-5 — Les 5 candidatures de l'étude s'ouvrent-elles au registre des améliorations ?**
>
> L'étude du passage à Opus 5.5 propose 5 candidatures : régler l'effort par classe de tâche, tenir les sessions courtes avec une session neuve par mandat, jouer le rejeu figé qui ferme le re-test de routage dû, ramener le réglage du poste de `claude-opus-5-5[1m]` au nom de famille `opus[1m]`, et déclarer l'effort des sous-agents. Le prompt que vous avez validé réserve leur ouverture à votre réponse, et une autre session écrit dans le pilot ce soir.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« tout entre en candidat », décision humaine ensuite) et la section « Candidatures proposées » de l'étude. Une candidature n'engage rien, et 3 des 5 ne servent qu'après le rejeu : les ouvrir maintenant évite qu'elles se perdent.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** ouvrir les 5 candidatures | effort simple × court | exclut leur perte si le rejeu tarde |
| **(b)** ouvrir seulement le rejeu et le réglage au nom de famille, qui ne dépendent d'aucune mesure | effort simple × court | exclut le suivi au registre de l'effort par classe, de la longueur des sessions et de l'effort des sous-agents |
| **(c)** n'en ouvrir aucune | effort nul | exclut toute trace hors de l'étude |

> **Si rien n'est décidé** : l'option (c) s'applique — les candidatures restent dans l'étude.

> **D-6 — Autorisez-vous la dépense du rejeu figé qui ferme le re-test de routage dû depuis le 25/09 ?**
>
> Le rejeu joue 6 tâches de la Factory (une restitution, une correction d'oracle, une analyse de prompt, une étude, une critique de page, une tâche mécanique) sous 5 configurations : Opus 5.5 à `max`, `high` et `medium`, Sonnet 5 à `high`, Opus 5 à `high`. Cela fait 38 exécutions en sessions neuves, dans un arbre de travail séparé, avec un plafond de 150 millions de jetons relus. Il consomme votre quota, la facturation étant probablement au forfait, ou de l'ordre de 70 à 110 $ au prix de liste (source : calcul de l'étude).
>
> **Recommandation : (a).** Source consultée : la section « Plan de rejeu contrôlé » de l'étude, `references\MODELES-EN-SERVICE.json` (re-test « dû » depuis le 2026-09-25, jamais clos) et `CLAUDE.md` du pilot (dépenses et gates restent humains). Sans rejeu, aucun réglage ne repose sur une mesure, et l'effort reste au maximum par défaut.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** autoriser le rejeu complet, 38 exécutions au plus | effort complexe × moyen ; quota, ou 70 à 110 $ au prix de liste (source : calcul de l'étude) | exclut un réglage décidé sans mesure |
| **(b)** autoriser un premier tiers : la restitution, l'analyse de prompt et l'étude, sous Opus 5.5 à `max` et à `medium` et sous Sonnet 5 à `high`, soit 9 exécutions | effort moyen × court ; environ le quart du coût | exclut toute conclusion sur le code, sur la critique de page et sur Opus 5 en référence |
| **(c)** ne rien autoriser maintenant | effort nul | exclut la fermeture du re-test ; l'effort reste au maximum sans mesure |

> **Si rien n'est décidé** : l'option (c) s'applique — rien n'est rejoué, le re-test reste dû.

> **D-7 — L'étude, ses journaux d'oracles et cette synthèse s'enregistrent-ils localement, avec une note de correction dans l'analyse du 27/09 ?**
>
> Ce tour a écrit l'étude `output\03-etudes\20261001-etude-opportunite-saut-opus-5-5.md` et cette synthèse ; le prompt de l'étude interdisait tout enregistrement pendant l'étude, et vos instructions de profil demandent une autorisation explicite. L'analyse du 27/09, déjà enregistrée, porte un chiffre faux sur le journal du hook de fin de tour, qui mêlait les entrées de test aux vraies sessions ; l'étude le corrige, l'analyse non.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain »), et vos instructions de profil (un enregistrement git exige votre autorisation explicite). Une note ajoutée garde le texte d'origine visible et signale la correction.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** enregistrer localement l'étude, ses journaux, cette synthèse et une note de correction ajoutée à l'analyse du 27/09, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** enregistrer sans toucher à l'analyse du 27/09 | effort simple × court | exclut la correction du chiffre dans le livrable enregistré |
| **(c)** ne rien enregistrer | effort nul | exclut la traçabilité : les fichiers restent non suivis |

> **Si rien n'est décidé** : l'option (c) s'applique — les fichiers restent sur disque, non enregistrés.

## 4. Traité — avec sa preuve

- **D-3 (a), l'enregistrement local sans push** : commit `8f209e89`, 12 fichiers : les 8 chemins du tour du 27/09 (l'analyse, sa synthèse, leurs 6 journaux d'oracles) et 4 index de dossiers régénérés par le crochet pré-enregistrement du dépôt.
  - preuve : `git log --oneline -1` → `8f209e89 Analyse L99 du prompt […] (decision humaine D-3 (a) du 01/10 : enregistrement local, sans push)` ; `git show --stat` → 12 fichiers, 1 015 insertions ; aucun push.
- **Une fusion en cours a d'abord bloqué l'enregistrement, puis s'est close** : à 19:59, `.git/MERGE_HEAD` présent, 4 chemins en conflit, 171 ajouts et 84 modifications indexés par une autre session ; une minute plus tard, commit de fusion `75c14b3d` et index vide. J'ai attendu cet état pour n'enregistrer que mes chemins.
  - preuve : `git status --porcelain` avant (171 A, 84 M, 4 UU) et après (9 fichiers non suivis) ; `git log --oneline -1` → `75c14b3d Fusion avec origin/main (79 commits de l autre poste, 27/09 au 01/10)…`.
- **Un effet de bord de mon enregistrement est corrigé, du rouge au vert, sur sa classe** : partiel enregistré pendant qu'un crochet régénère des index ; il avait laissé dans l'index git une version périmée de 4 index de dossiers (92 fichiers listés au lieu de 93), que le prochain commit de n'importe quelle session aurait emportée.
  - preuve : `git diff --cached --stat` → 4 fichiers en écart ; `git restore --staged` sur ces 4 chemins ; puis `git status --porcelain` → seul `.claude/worktrees/` non suivi, et `git diff HEAD --ignore-cr-at-eol` vide.
- **D-1 (a) et D-2 (a), l'étude est jouée et jugée** : 12 lignes de non-recouvrement citées, 8 sources datées, 7 opportunités reliées chacune à une différence et à une mesure, options O0 à O4, verdict O2, plan de rejeu figé, sections « Biais d'auto-évaluation » et « Répétabilité ».
  - preuve : `output\03-etudes\20261001-etude-opportunite-saut-opus-5-5.md` ; `oracle-etude-opportunite.mjs` → PASS sur ses 10 règles ; `run-oracles.mjs` → « CONFORME — 4 PASS, 3 SKIP, 0 échec » ; `check_markdown.py` → PASS ; `oracle-ecriture.mjs` → PASS, passé du rouge au vert après 2 corrections (un en-tête de colonne formulé en annonce, 4 chiffres sans source collée).
- **Le contrat de sortie C1 à C12 (les 12 critères d'acceptation du prompt) est tenu** : pour le dernier critère, C12, tête du pilot `8f209e89` inchangée, empreinte des réglages `a02492881429b1d8` identique avant et après ; fichiers modifiés : l'étude, ses 3 journaux d'oracles et l'index du dossier, régénéré par le hook d'écriture.
  - preuve : relevés de 18:01:20 et 18:14:28 UTC (`git rev-parse`, `git status --porcelain`, `sha256sum`).
- **Les 3 constats du 27/09, confiés à l'étude par l'option par défaut de D-4** : la génération figée au 10/08 et le re-test au seul changement de famille sont corrigés depuis le 25/09 par l'autre poste ; l'effort au maximum sans mesure devient les candidatures sur l'effort par classe et sur l'effort des sous-agents.
  - preuve : section 2 de l'étude (TF-1420, statut corrigé) ; `oracle-modeles-en-service.mjs` → PASS avec 2 avertissements (re-test dû, Opus 5 encore servi jusqu'au 2026-09-28).

## 5. Non traité — avec son motif

- Le rejeu figé — motif : dépendance à une décision humaine (D-6) ; c'est une dépense de quota ou d'argent.
- L'ouverture des 5 candidatures au registre — motif : dépendance à une décision humaine (D-5).
- L'enregistrement de l'étude et la note de correction de l'analyse du 27/09 — motif : dépendance à une décision humaine (D-7).
- La mesure des sessions de votre autre poste — motif : impossible à prouver ici, leurs journaux ne sont pas sur ce poste.
- Le retour du réglage du poste au nom de famille — motif : écarté de ce tour, c'est une candidature ; le réglage a été modifié aujourd'hui à 19:57, par vous ou par une autre session (critère de réouverture : D-5).

## 6. Écarts à la lettre

- **Le prompt fixait le livrable** à `output\03-etudes\20260927-etude-opportunite-saut-opus-5-5.md` → **j'ai écrit** `output\03-etudes\20261001-etude-opportunite-saut-opus-5-5.md` → **pourquoi** : le prompt prévoit la date du jour quand l'étude est jouée un autre jour.
- **Le prompt bornait la lecture des journaux** à 6 champs → **j'ai lu aussi** la présence de la clé `toolUseResult` sans son contenu, `isSidechain`, `isMeta`, `message.stop_reason` et la version du harnais → **pourquoi** : découper les tours et séparer les sous-agents ; aucun texte de message lu ni cité.
- **Le prompt désignait les journaux du pilot** → **j'ai lu aussi** les champs de modèle et d'effort des journaux des 52 sessions de produits présentes au journal du hook → **pourquoi** : ce journal mêle tout le parc du poste, et sans ce rattachement le taux de refus n'aurait aucun modèle.
- **C12 demandait qu'aucun fichier ne soit modifié hors du livrable** → **ont aussi bougé** l'index du dossier des études, régénéré par le hook d'écriture, et 3 journaux d'oracles → **pourquoi** : infrastructure obligatoire du pilot ; aucun contenu de ma main hors de l'étude.
- **C2 demandait l'intention « marquée à valider »** → **je l'ai marquée validée** par D-1 (a) du 01/10 → **pourquoi** : votre réponse l'a validée entre-temps.
- **D-3 (a) visait les fichiers du tour du 27/09** → **le commit porte aussi** 4 index de dossiers → **pourquoi** : le crochet pré-enregistrement du dépôt les ajoute ; leur copie périmée restée dans l'index a été retirée ensuite.
- **Le non-recouvrement notait « aucun candidat au 27/09, à reconfirmer »** → **la reconfirmation trouve** les travaux des 24 et 25/09 de l'autre poste → **pourquoi** : la fusion de ce soir les a apportés, et l'étude a resserré son périmètre sur ce qui restait ouvert.
- **Cette synthèse elle-même** est écrite hors du livrable de l'étude → **pourquoi** : la restitution de fin de tour est exigée par le pilot (R-44).

## 7. Risques

- Les mesures valent pour ce poste seulement ;
  - signal : la sortie de `oracle-modeles-en-service.mjs` sur l'autre poste diffère, ou ses restitutions citent un autre effort ;
  - parade : le rejeu, joué sur un seul poste, ne dépend pas des journaux.
- Le rejeu consomme votre quota et peut ralentir le travail du jour ;
  - signal : un avertissement de limite d'usage dans une session ;
  - parade : le plafond de 150 millions de jetons relus et l'option (b) de D-6.
- Le réglage épinglé garde vos sessions sur Opus 5.5 quand la version suivante sortira ;
  - signal : un avertissement « version antérieure encore servie » de `oracle-modeles-en-service.mjs` à l'ouverture ;
  - parade : la candidature sur le nom de famille (D-5).
- Une autre session écrit dans le pilot ce soir ;
  - signal : la tête du pilot bouge pendant le tour suivant ;
  - parade : chaque enregistrement ne porte que ses propres chemins, et l'index est vérifié après coup.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord, dans l'ordre des décisions qu'elles attendent ; puis l'action humaine qui les débloque toutes.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-6 | Ouvrir les candidatures retenues au registre par `node todo\journaliser.mjs --fichier <evenements.json>` (neuve) | auto_ia | `dependance_bloc_3` — attend D-5 (a) ou (b) | simple × court | les opportunités ne vivent que dans l'étude |
| A-7 | Jouer le rejeu figé dans un arbre de travail séparé, 38 exécutions au plus et 150 millions de jetons relus au plus, puis consigner le résultat au référentiel des modèles en service (neuve) | auto_ia | `dependance_bloc_3` — attend D-6 (a) ou (b) | complexe × moyen | le re-test reste dû et l'effort reste au maximum sans mesure |
| A-8 | Enregistrer localement l'étude, ses journaux d'oracles et cette synthèse, et ajouter la note de correction à l'analyse du 27/09, sans push (neuve) | auto_ia | `dependance_bloc_3` — attend D-7 (a) ou (b) | simple × court | les fichiers restent non suivis et le chiffre faux reste dans l'analyse enregistrée |
| A-9 | Trancher D-5, D-6 et D-7 en répondant par exemple « 5a, 6a, 7a » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` et `depense` — une écriture au registre, une dépense de quota et un enregistrement git attendent votre autorisation | simple × court | rien n'est ouvert, rejoué ni enregistré |

## 9. Traces

- Étude : `output\03-etudes\20261001-etude-opportunite-saut-opus-5-5.md`.
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Etude Opus 5.5 jouee et enregistrement local - 20261001g.md`.
- Commit local : `8f209e89` (12 fichiers), posé sur `75c14b3d` ; aucun push.
- Journaux d'oracles : `.oracles\output\03-etudes\20261001-etude-opportunite-saut-opus-5-5.md.oracles.json` et son historique.
- Scripts de mesure : `mesure-etude.mjs`, `mesure-hook.mjs` et `mesure-latence.mjs`, dans le répertoire temporaire de cette session, hors dépôt.
- Aucune page HTML livrée dans ce tour.
