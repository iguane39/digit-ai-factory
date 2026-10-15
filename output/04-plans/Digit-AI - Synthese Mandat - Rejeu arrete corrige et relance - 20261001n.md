---
destinataire: humain
---

# Point d'étape : le rejeu tourne en version 2 ; un défaut de mon banc, vu sur les 7 premières exécutions, l'a fait arrêter, corriger et relancer, et 33 des 34 exécutions relancées restent à jouer (01/10/2026)

Le rejeu tourne, mais pas celui que j'avais lancé : après 7 exécutions jugées, j'ai vu que le juge de la tâche « correction d'oracle » contredisait sa propre consigne. La consigne demandait que le verdict des études existantes ne change pas, alors qu'une vraie correction à la racine en change 2 sur 55 : elle poussait les modèles vers une correction de surface, puis les comptait en échec. Le juge de la tâche « analyse de prompt » exigeait aussi un contrôle que sa consigne ne nommait pas, et le banc ne gardait pas les livrables. J'ai arrêté, corrigé, vérifié les juges sur 11 cas connus, figé une version 2 du protocole et relancé 34 exécutions, dont 1 est déjà jouée et réussie ; les 4 premières de la version 1, toutes réussies et jugées sans changement, sont gardées. Ce que ça change pour vous : les résultats arriveront un peu plus tard, dans 1 à 2 heures, mais ils mesureront ce que chaque tâche demande vraiment. Rien n'est attendu de vous d'ici là.

## 1. En-tête d'identification

- **quoi** — point d'étape : arrêt du rejeu en version 1 sur un défaut du banc, correction des juges, gel d'une version 2 du protocole et relance ; le résultat n'est pas encore mesurable.
- **sur quoi** — le banc de rejeu (lanceur, juges, protocole) dans le répertoire temporaire de la session, et les 4 copies de travail du pilot sous `C:\Users\Sébastien\rj\` ; rien d'écrit dans les dépôts hors de ce point d'étape.
- **quand** — 2026-10-01, point fait à 21:18 heure de Paris (UTC+02:00) ; première mesure d'horloge du tour à 21:07 (19:07:39 UTC), prise à la réception de votre question ; durée mesurée ≥ 11 min.
- **qui** — session de pilotage Claude Opus 5.5 (contexte 1M), effort `max` ; pilot à `e73c96e1` ; sessions du banc : Claude Code 2.1.280 ; contrôles joués : les 11 cas de contrôle des juges du banc, et `oracle-synthese` sur ce document.
- **intention** — savoir si le nouveau modèle permet à la Factory de faire le même travail plus vite, avec moins de jetons et moins de reprises, et quels réglages changer pour en tirer parti sans affaiblir la qualité. **Test rétro** : corriger le juge sert l'intention, car un juge plus strict que la consigne aurait fait conclure à tort qu'un modèle ou un effort échoue ; ce tour ne la sert pas encore, aucun résultat de la version 2 n'étant mesuré.

## 2. Ce qui reste à mesurer, et par quoi

Les 33 exécutions de la version 2 encore à jouer : le verdict du juge de chaque tâche, la durée, les jetons générés, relus et écrits par tâche close, le modèle et l'effort servis, les écarts de périmètre, et le livrable archivé. Ils sont mesurés par le lanceur `rejeu.mjs` en version 2, dont les juges passent les 11 cas de contrôle, et consignés dans `resultats.jsonl` du banc, à la fin du rejeu, dans 1 à 2 heures.

## 3. Décisions attendues de l'humain

Rien n'attend votre décision avant la fin du rejeu ; les décisions sur ses résultats viendront avec la restitution complète.

## 4. Traité — avec sa preuve

- **Le rejeu en version 1 est arrêté** : le lanceur et ses 4 sessions de banc sont arrêtés à 21:09 ; 7 exécutions étaient jugées, 4 en cours ont été interrompues.
  - preuve : `taskkill` sur le lanceur et ses 4 sessions ; contrôle des processus après coup : 0 lanceur, 0 session de banc ; `resultats-v1.jsonl` → 7 lignes.
- **Le défaut du banc est corrigé, du rouge au vert, sur sa classe : un juge plus strict que sa consigne** : sur la correction d'oracle, l'oracle défectueux et le correctif de référence diffèrent de verdict global sur 2 études sur 55 et de liste de règles sur 4 (source : mesure du 2026-10-01 à 21:10) ; la consigne v1 interdisait ce changement, et les 2 exécutions jugées (Opus 5 et Sonnet 5 à `high`) avaient corrigé la règle E3 (les sources datées de l'état de l'art) seule, en laissant le même défaut sur la règle sœur E2 (les citations du tableau de non-recouvrement).
  - preuve : consigne v2 « corrige-la à sa racine, pour toutes les règles du fichier qu'elle touche » ; juge v2 : témoin E3, témoin caché E2, recette, et comportement identique au correctif de référence sur les 55 études ; contrôle des juges : 11 cas conformes, dont « correctif de symptôme, E3 seul » refusé (témoin E2 en échec, 2 divergences).
- **Le juge de l'analyse de prompt est aligné sur sa consigne** : la réussite tient au contrôle de lisibilité, aux 8 couches et au prompt réécrit ; le verdict de l'oracle de prémisse d'accès reste relevé, sans compter dans la réussite.
  - preuve : cas de contrôle « analyse L99 conforme connue » → réussi.
- **Le livrable et le diff de chaque exécution sont désormais archivés** dans `banc/livrables/`, pour audit et rejugement.
  - preuve : fonction d'archivage du lanceur v2, appelée après chaque jugement.
- **Le protocole v2 est figé avant la reprise** : le 2026-10-01 à 19:12:22 UTC, empreinte sha256 `31a0e0b5…`, avec ses 5 amendements écrits et motivés ; exécutions gardées : T1 sous Opus 5.5 à `high` (réussie, 185 s), la page sous Opus 5 à `high` (réussie, 119 s), la page sous Opus 5.5 à `medium` (réussie, 37 s), l'extraction sous Opus 5.5 à `medium` (réussie, 39 s) ; 34 à jouer ; consommation du banc à la reprise : 15 997 960 jetons relus, sur un plafond de 150 millions (source : relevé du lanceur).
  - preuve : `PROTOCOLE-v2.json` et la première ligne de `rejeu.log` (`protocole_v2_fige`).
- **La reprise tourne** : à 21:15, la première exécution v2 est jugée : la tâche sur l'oracle défectueux, sous Sonnet 5 à `high`, réussie en 91 s sous le juge v2, alors que sous la consigne v1 la même configuration n'avait réparé que la règle E3 ; un cas ne fait pas une mesure, le résultat reste à lire sur l'ensemble.
  - preuve : `rejeu.log` → `{"n":5,"tache":"T2","config":"K4","reussite":true,"duree_s":91}` ; `resultats.jsonl` → 5 lignes.

## 5. Non traité — avec son motif

- Les résultats de la version 2 — motif : impossible à prouver avant la fin des 33 exécutions encore à jouer, en cours.
- Les livrables des 7 exécutions de la version 1 — motif : écarté, le banc v1 ne les gardait pas ; les 3 exécutions jugées sous un juge changé sont rejouées, les 4 gardées n'ont pas de livrable archivé (critère de réouverture : un doute sur l'une d'elles, qui se rejouerait).
- L'enregistrement des écritures au registre — motif : dépendance à une décision humaine, posée à la restitution complète.

## 6. Écarts à la lettre

- **Le protocole était figé avant tout résultat** → **je l'ai amendé après 7 exécutions** → **pourquoi** : les amendements corrigent un défaut du banc mesuré indépendamment des réponses des modèles, la contradiction entre la consigne et le correctif de référence ; ils sont écrits et motivés dans le protocole v2 avant la reprise, et les résultats v1 sont conservés tels quels.
- **La consigne de la correction d'oracle disait « le verdict ne doit pas changer »** → **la consigne v2 dit « corrige à la racine, pour toutes les règles touchées »** → **pourquoi** : la première consigne interdisait la bonne correction.
- **Le juge de l'analyse de prompt comptait la prémisse d'accès** → **il ne la compte plus dans la réussite** → **pourquoi** : la consigne ne la nomme pas ; elle reste mesurée.

## 7. Risques

- Un amendement fait après des premiers résultats peut passer pour un ajustement au résultat voulu ;
  - signal : un écart entre les conclusions v2 et les 7 lignes de la version 1, conservées ;
  - parade : le motif de chaque amendement est une mesure qui ne dépend d'aucune réponse de modèle, et le contrôle des juges est rejoué sur des cas fixes.
- Le rejeu consomme votre quota et peut ralentir vos autres sessions ;
  - signal : un avertissement de limite d'usage dans une session ;
  - parade : l'arrêt automatique au plafond de 150 millions de jetons relus, consommation passée comprise.

## 8. Prochaines actions

Ordre du tableau : dans l'ordre où le rejeu les rend possibles ; aucune action humaine n'est due avant sa fin.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-10 | À la fin du rejeu, analyser `resultats.jsonl` : réussite par tâche et par configuration, durée et jetons par tâche close, application des critères figés (neuve) | auto_ia | `dependance_externe` — les 34 exécutions de la version 2 tournent en arrière-plan | moyen × moyen | aucun résultat ne ferme le re-test de routage |
| A-11 | Vérifier que les dépôts réels sont intacts, puis retirer les 4 copies de travail par `git worktree remove` (neuve) | auto_ia | `dependance_externe` — après la fin du rejeu | simple × court | 4 copies et leurs métadonnées restent sur le poste |
| A-12 | Rédiger la restitution complète, avec les résultats et les décisions qui en découlent (neuve) | auto_ia | `dependance_externe` — après l'analyse des résultats | simple × court | les résultats restent dans un fichier du banc, sans décision |

## 9. Traces

- Banc : `PROTOCOLE.json` (v1, sha256 `8b51e9b5…`), `PROTOCOLE-v2.json` (sha256 `31a0e0b5…`), `rejeu.mjs`, `rejeu-v1.log`, `resultats-v1.jsonl`, `rejeu.log`, `resultats.jsonl`, `livrables/`, dans le répertoire temporaire de cette session.
- Copies de travail : `C:\Users\Sébastien\rj\l1` à `l4`, détachées sur `e73c96e1`.
- Aucun enregistrement git dans ce tour ; aucune page HTML livrée.
