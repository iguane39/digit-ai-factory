# Résultats du rejeu figé du passage à Opus 5.5 : effort et modèle par classe de tâche (2026-10-01)

Ce document rend le résultat du rejeu autorisé le 2026-10-01 par la décision humaine D-6 (a), qui joue le plan figé de l'étude `output/03-etudes/20261001-etude-opportunite-saut-opus-5-5.md`. Sur 6 tâches réelles de la Factory, 38 exécutions jugées par des contrôles automatiques montrent que le réglage actuel du poste, Opus 5.5 à l'effort `max`, ne réussit mieux sur aucune tâche et qu'il est de 4,6 à 9,9 fois plus lent par tâche close que les efforts `high` et `medium` (source : `resultats.jsonl` du banc, calculé par `analyse.mjs`). Opus 5.5 à l'effort `high` réussit ses 6 tâches sur 6. Le réglage qui en découle reste une décision humaine.

## Protocole joué

Le protocole a été figé avant le premier résultat ; cette section en rappelle les 4 pièces.

- **Tâches** : T1, restituer un tour de travail figé, jugée par `oracles/oracle-synthese.mjs` ; T2, réparer un défaut réinjecté dans `oracles/oracle-etude-opportunite.mjs`, jugée par 2 témoins, dont 1 caché, par la recette de l'oracle et par l'accord avec le correctif de référence sur 55 études réelles ; T3, analyser un prompt en 8 couches avec le skill `prompt-analyzer-l99`, jugée par `check_markdown.py`, le compte des 8 chapitres et la présence du prompt réécrit ; T4, écrire une étude d'opportunité sur la candidature TF-1392, jugée par `oracle-etude-opportunite.mjs` ; T5, corriger une page HTML porteuse de 4 défauts sans changer son texte visible, jugée par `check_html.py` et la comparaison des textes ; T6, extraire du registre les candidatures nées avant le 2026-09-17, jugée par comparaison aux 28 éléments attendus.
- **Configurations** : K1, Opus 5.5 à `max`, le réglage actuel ; K2, Opus 5.5 à `high` ; K3, Opus 5.5 à `medium` ; K4, Sonnet 5 à `high` ; K5, Opus 5 à `high`.
- **Exécution** : chaque exécution part d'une session neuve de Claude Code 2.1.280, sans intervention humaine, dans l'une des 4 copies de travail détachées du pilot au commit `e73c96e1` ; 30 exécutions, soit 6 tâches par 5 configurations, plus 8 répétitions de K1 et K3 sur T1 à T4 : 38 en tout ; ordre tiré au sort sur une graine fixe ; jouées le 2026-10-01 de 18:57 à 20:22 UTC, interruption comprise.
- **Critère figé** : « Une configuration est retenue pour une classe de tâches si son oracle passe au premier passage au moins aussi souvent que K1 et si la durée ou les jetons par tâche close baissent d'au moins 25 %. » (source : étude du 2026-10-01, section « Plan de rejeu contrôlé »). Une tâche close est une exécution réussie ; la consommation par tâche close divise celle de toutes les exécutions d'une case, échecs compris, par son nombre de réussites.

## Amendements et défaut restant

Avant le premier résultat, les entrées concrètes des 6 tâches ont été fixées, et 2 tâches diffèrent du plan de l'étude : T5 corrige une page au lieu de la critiquer, faute d'oracle qui juge une critique, et T6 extrait des candidatures du registre au lieu de régénérer un index. Le protocole a ensuite été amendé une fois, après 7 exécutions et avant la reprise : sa version 2 est figée le 2026-10-01 à 19:12:22 UTC, empreinte sha256 `31a0e0b5…`. La consigne de T2 interdisait de changer le verdict des études existantes, alors que le correctif de référence en change 2 sur 55 : elle poussait vers une réparation de surface. Le juge de T3 comptait en plus l'oracle de prémisse d'accès, que sa consigne ne nomme pas. Les 4 exécutions de la version 1 dont le juge ne changeait pas sont gardées : T1 sous K2, T5 sous K5 et sous K3, T6 sous K3.

Un second défaut du même ordre a été trouvé après la reprise, et il n'est pas corrigé. Le juge de T3 exige un bloc de code après le chapitre 8, alors que le skill demande une « version optimisée, prête à copier-coller » sans en fixer la forme (`references/couches.md` du skill, ligne 307). Les 2 analyses jugées en échec, sous K4 et sous K5, ne manquent que ce critère : elles présentent leur prompt réécrit en citation (archive `06-T3-K4`, ligne 142, et archive `13-T3-K5`, ligne 162). Le critère à retenir est l'objet de la décision humaine D-8, en attente ; les résultats de T3 ci-dessous sont ceux du juge actuel.

## Résultats par classe de tâche

Comment lire : une ligne par tâche, une colonne par configuration ; chaque case donne les réussites sur les exécutions, puis la durée par tâche close, et un tiret marque une case sans aucune réussite. Source : `resultats.jsonl` du banc, calculé par `analyse.mjs`.

| Tâche | K1 Opus 5.5 `max` | K2 Opus 5.5 `high` | K3 Opus 5.5 `medium` | K4 Sonnet 5 `high` | K5 Opus 5 `high` |
|---|---|---|---|---|---|
| T1 restitution | 2/2 · 1 155 s | 1/1 · 185 s | 2/2 · 126 s | 1/1 · 337 s | 1/1 · 691 s |
| T2 réparation d'oracle | 0/2 · — | 1/1 · 88 s | 0/2 · — | 1/1 · 91 s | 0/1 · — |
| T3 analyse de prompt | 2/2 · 1 314 s | 1/1 · 270 s | 2/2 · 190 s | 0/1 · — (D-8) | 0/1 · — (D-8) |
| T4 étude d'opportunité | 2/2 · 1 027 s | 1/1 · 221 s | 2/2 · 162 s | 1/1 · 303 s | 1/1 · 719 s |
| T5 page HTML | 1/1 · 231 s | 1/1 · 48 s | 1/1 · 37 s | 1/1 · 146 s | 1/1 · 119 s |
| T6 extraction | 1/1 · 386 s | 1/1 · 61 s | 1/1 · 39 s | 1/1 · 42 s | 1/1 · 284 s |

Les jetons générés suivent la durée. Comment lire : jetons générés par tâche close, en milliers, même découpage. Source : la même, calculé par `analyse.mjs`.

| Tâche | K1 | K2 | K3 | K4 | K5 |
|---|---|---|---|---|---|
| T1 | 127,0 | 17,3 | 11,7 | 29,6 | 46,9 |
| T2 | — | 7,8 | — | 6,6 | — |
| T3 | 145,4 | 22,1 | 15,7 | — | — |
| T4 | 109,3 | 21,1 | 15,5 | 27,2 | 47,6 |
| T5 | 23,2 | 3,4 | 2,7 | 7,8 | 7,1 |
| T6 | 40,0 | 4,0 | 3,0 | 2,7 | 10,2 |

Les jetons relus par tâche close vont de 0,3 à 2,0 millions sous K2, K3 et K4, contre 1,8 à 11,3 millions sous K1 (source : `analyse.mjs`).

## Verdict du critère figé

Comment lire : pour chaque tâche, chaque configuration est comparée à K1 ; « retenue » veut dire qu'elle réussit au moins aussi souvent que K1 et baisse la durée ou les jetons par tâche close d'au moins 25 %, et le pourcentage donne la baisse de durée. Source : `analyse.mjs`.

| Tâche | K2 Opus 5.5 `high` | K3 Opus 5.5 `medium` | K4 Sonnet 5 `high` | K5 Opus 5 `high` |
|---|---|---|---|---|
| T1 | retenue, −84 % | retenue, −89 % | retenue, −71 % | retenue, −40 % |
| T2 | retenue, K1 n'a aucune réussite | non retenue, aucune réussite | retenue, K1 n'a aucune réussite | non retenue, aucune réussite |
| T3 | retenue, −79 % | retenue, −86 % | non retenue sous le juge actuel (D-8) | non retenue sous le juge actuel (D-8) |
| T4 | retenue, −78 % | retenue, −84 % | retenue, −70 % | retenue, −30 % |
| T5 | retenue, −79 % | retenue, −84 % | retenue, −37 % | retenue, −48 % |
| T6 | retenue, −84 % | retenue, −90 % | retenue, −89 % | retenue, −26 % |

K2 est retenue sur les 6 tâches, K3 et K4 sur 5, K5 sur 4 (source : `analyse.mjs`). Aucune configuration ne réussit moins souvent que K1, sauf K4 et K5 sur T3 sous le juge actuel.

## Les échecs, examinés un par un

- **T2 sous K1, 2 fois, et sous K3, 2 fois** : les 4 réparations passent les 2 témoins et la recette, puis divergent de la référence sur la seule étude `output/03-etudes/20260812-etude-opportunite-forges.md`. Relues dans leurs archives, elles ne lisent une section que sous un titre de niveau 2, et cette étude range son tableau de non-recouvrement sous un titre de niveau 3 : l'oracle réparé y écrit « aucune ligne au tableau de non-recouvrement », quand la réparation de K2 y lit « 5 ligne(s) de non-recouvrement, toutes citées » (archives `16-T2-K1` et `11-T2-K2`, rejouées sur l'étude le 2026-10-01). L'échec est réel et étroit : 1 étude accusée à tort sur 55. Il a coûté 664 et 1 211 secondes sous K1, 76 et 92 secondes sous K3 (source : `resultats.jsonl`).
- **T2 sous K5** : la réparation passe les témoins et la recette, mais ne lit plus ni le tableau ni les sources des études réelles. Sur l'étude du 2026-08-14, où la référence lit les deux, elle écrit « aucune ligne au tableau de non-recouvrement » et « 0 source(s) datée(s) » ; les 55 études divergent de la référence, et 16 changent de verdict (source : archive `03-T2-K5`, rejouée le 2026-10-01). Les études réelles sont en fins de ligne Windows, ce qui est la piste ; la cause exacte n'est pas isolée.
- **T3 sous K4 et sous K5** : les 2 analyses passent `check_markdown.py` et portent leurs 8 chapitres ; seul manque le bloc de code, voir la section des amendements.

## Hypothèses de l'étude

- **H1**, à qualité égale Opus 5.5 à `medium` ou `high` égale Opus 5.5 à `max` en moins de temps et de jetons : tenue pour `high` sur les 6 tâches ; tenue pour `medium` sur 5, et `medium` échoue comme `max` sur la réparation d'oracle.
- **H2**, Sonnet 5 tient la qualité sur la production standard : tenue sur T1, T2, T4, T5 et T6 ; T3 attend D-8.
- **H3**, à effort égal, moins de restitutions refusées au premier passage sous Opus 5.5 que sous Opus 5 : non tranchée, K2 et K5 réussissant chacun leur unique restitution.
- **H4**, une session neuve par tâche réduit les jetons relus par tâche close : non mesurée, toutes les exécutions du banc partant d'une session neuve, sans bras de comparaison en session longue.

## Variance

Les 8 répétitions rejouent K1 et K3 sur T1 à T4, pour mesurer l'écart entre 2 exécutions identiques. Les 8 paires rendent le même verdict ; l'écart de durée dans une paire va de 0,5 % à 82 %, pour T2 sous K1, joué en 1 211 puis 664 secondes, quand l'écart entre K1 et K2 ou K3 est d'un facteur 4,6 à 9,9 (source : `resultats.jsonl`, calculé par `analyse.mjs`).

## Consommation du banc

Le banc a relu 131 932 479 jetons, sous le plafond de 150 millions, dont 119 635 474 pour les 38 exécutions jugées (source : ligne finale de `rejeu.log`, et `analyse.mjs`). Au prix de liste, les 38 exécutions jugées vaudraient 98,30 $ : c'est un indicateur, pas un montant facturé, le poste étant connecté par abonnement. K1 en porte 55,65 $, soit 57 %, pour 8 réussites sur 10 ; K2, 6,25 $ pour 6 réussites sur 6 (source : `analyse.mjs`).

## Périmètre et fuites

Les 45 journaux de session des 4 copies de travail portent 1 100 appels d'outils, dont 135 écritures : aucune écriture hors de sa copie de travail, aucune commande visant les dépôts réels de `C:\dev`, aucun enregistrement git (source : `perimetre.mjs`, qui lit les seuls champs d'appel d'outil). 2 commandes `git log --oneline -3` sont relevées, sous T3 et sous T6, où l'historique ne donne aucune réponse ; aucune sous T2, où il est interdit. Sur chacune des réponses des 38 exécutions, le modèle et l'effort servis sont ceux de la configuration (source : champ `transcript` de `resultats.jsonl`).

## Limites

- 1 ou 2 exécutions par case : les écarts de durée et de jetons, d'un facteur 4,6 à 9,9, dépassent de loin la variance mesurée ; l'égalité de réussite, elle, ne voit pas un défaut rare.
- Les tâches durent de 37 secondes à 24 minutes ; une session de pilotage longue, qui enchaîne des dizaines de tours, n'est pas rejouée.
- Les sessions du banc tournent sans les hooks du projet : la qualité au premier passage est celle du contrôle de chaque tâche, pas celle du juge de fin de tour du pilot.
- Haiku 4.5, qui tient les tâches mécaniques au §4 de `CONTRAT-INTERFACE.md`, n'est pas rejoué ; Fable 5.1 non plus, qui ne tient plus de rôle à ce tableau.
- Les juges contrôlent les critères que nomme chaque consigne, pas toute la qualité d'un livrable : une étude plus fine sous `max` ne se voit pas ici.
- Le nombre de réécritures demandées par les contrôles à l'écriture n'est pas isolé : les journaux mêlent leurs passages et leurs refus.
- Le banc est écrit et lancé par une session Opus 5.5 à `max` ; ses verdicts viennent de scripts, pas d'un avis de modèle.

## Réglages que ce résultat fonde

Le poste lance aujourd'hui ses sessions Opus 5.5 à l'effort `max` par la variable `CLAUDE_CODE_EFFORT_LEVEL`, posée au lancement, qui prime sur le réglage `medium` de `modelSettings` dans `~/.claude/settings.json` (source : environnement de la session de pilotage et fichier de réglages, relevés le 2026-10-01). Le résultat fonde 3 réglages, du plus solide au moins solide :

1. Passer les sessions Opus 5.5 de `max` à `high` : retenu sur les 6 tâches, sans un échec, de 4,6 à 6,3 fois plus rapide par tâche close (source : `analyse.mjs`).
2. Garder Sonnet 5 en production standard, comme le §4 de `CONTRAT-INTERFACE.md` le prévoit : retenu sur 5 tâches, T3 en attente de D-8.
3. Réserver `medium` aux restitutions, études, pages et extractions, jamais aux réparations de code : retenu sur 5 tâches, il échoue 2 fois sur 2 sur la réparation d'oracle.

Le contrôle après réglage existe déjà : le taux de refus au premier passage par le juge de fin de tour, mesuré à 9,1 % sous Opus 5.5 à `max` (source : étude du 2026-10-01, journal du hook), se relève à la revue du 2026-10-15. Seuil proposé : une hausse de plus de 5 points ramène le réglage précédent. Ces réglages sont des décisions humaines, inscrites au registre comme candidatures TF-1557 et TF-1561.

## Banc et traces

Le banc vit dans le dossier temporaire de la session qui l'a joué : le lanceur `rejeu.mjs`, les protocoles `PROTOCOLE.json` et `PROTOCOLE-v2.json`, les entrées figées des 6 tâches, les résultats `resultats.jsonl` et `resultats-v1.jsonl`, les journaux `rejeu.log` et `rejeu-v1.log`, le livrable et le diff de chaque exécution dans `livrables/`, et les scripts `analyse.mjs` et `perimetre.mjs`. Il disparaît avec ce dossier s'il n'est pas versé au dépôt, alors que l'étude prévoit de le rejouer à chaque nouvelle version d'un modèle du tableau.
