---
destinataire: humain
---

# Synthèse Mandat — vos quatre décisions sont exécutées : notre juge de restitution est corrigé, le contrôle des secrets est affiché, un registre de dette existe, et l'étude conclut que la conception en amont aurait évité 11 griefs sur 20 ; une décision vous attend (14/09/2026)

Vos quatre décisions sont faites. Le contrôle qui juge chacune de nos restitutions refuse désormais l'action impossible à exécuter qu'il laissait passer, sans refuser aucune des 106 synthèses déjà rendues ; la correction s'applique d'elle-même dans tous les produits. Le contrôle des fichiers d'identifiants mal placés est maintenant affiché à chaque ouverture de session. Les notes de fin de chantier restées en archive ont un registre où chacune est soit une limite assumée, soit un travail à instruire. L'étude sur la conception documentaire est rendue : sur vingt reproches réels de lecteurs, onze auraient été évités par une fiche remplie avant d'écrire le document, là où il en fallait six pour justifier la démarche. La construction n'est pas lancée : le classement des vingt reproches n'a eu qu'un seul juge. Ce qui est attendu de vous : dire si l'on fait d'abord confirmer ce classement par un second juge à l'aveugle avant de construire, et répondre toujours sur la rotation des identifiants.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-6 (a), D-9 (a), D-7 (a) et D-8 (a) du 14/09/2026 (« 6a, 9a, 7a, 8a ») : relevé d'ouverture étendu aux secrets et au registre de dette ; correction de la règle S13 (toute action humaine doit être exécutable telle quelle) du juge de restitution ; étude d'opportunité « conception documentaire en amont » jouée avec mesure ; sept classes nouvelles, registre de dette du pilot, neuf candidatures ; coordination avec une autre session du pilot sur l'écriture du registre.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules sur les lots de retours, le canal confidentiel et des sources externes.
- **quand** — 2026-09-14, horodatage mesuré 13:06 UTC+02:00 (registre, 11:06:15 UTC) pour les quatre décisions ; redéposée le 2026-09-15 à 12:08 UTC+02:00 avec deux deltas (retrait d'un faux site de scellement du banc, deux classes posées pour l'autre session du pilot) ; durée mesurée depuis votre message ≥ 1 h.
- **qui** — pilot `a3cde26` (aucun enregistrement fait) ; session Opus 5 ; deux délégations au modèle Sonnet pour l'étude (mesure et rétro-test : 276 557 tokens ; état de l'art : 116 817 tokens) ; escalade de modèle : aucune.

## 2. Verdict en une ligne

**D-9 (a) : S13 corrigée, self-test 19/19, taux d'accusation 0 sur 106 synthèses, preuve rouge → vert sur le défaut réel, TF-1085 close avec sa descente ; D-6 (a) : relevé d'ouverture étendu, recette 1/1 ; D-8 (a) : 7 classes nouvelles, plus 2 posées pour l'autre session du pilot (83 au total), registre de dette de 64 entrées (49 assumées, 15 à instruire), 7 candidatures (TF-1090 à TF-1096) ; D-7 (a) : étude rendue, rétro-test amont seul 11/20 pour un seuil de 6, option O3 sous réserve, `oracle-etude-opportunite` PASS 10/10, 2 candidatures (TF-1097, TF-1098) ; `oracle-todo` exit 0, 316 items ; `oracle-empreintes` PASS après retrait d'un faux site de scellement du banc ; 0 enregistrement, 0 push.**

## 3. Décisions attendues de l'humain

> **D-10 — Fait-on d'abord confirmer par un second juge à l'aveugle le classement des vingt reproches de lecteurs, avant de construire la fiche de conception en amont ?**
>
> L'étude a mesuré sur vingt reproches réels portant sur des documents qu'une fiche remplie avant l'écriture en aurait évité onze, pour un seuil fixé à six. Mais la même session a choisi et classé les reproches, sans second juge ; l'étude du matin sur les personas a montré qu'un classement à l'aveugle peut défaire un gain qu'on croyait tenir.
>
> **Recommandation : (a).** Source consultée : `output\03-etudes\20260914-etude-opportunite-conception-documentaire-amont.md` section 5 (réserves, « un seul classeur pour le rétro-test ») et `output\03-etudes\20260914-personas-mesure-protocole.md` section 4 (jugement anonymisé, étiquettes mélangées). Un second classement coûte une session et protège une construction de plusieurs jours de travail d'agent.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** faire reclasser les 20 reproches par une session neuve à l'aveugle, puis construire l'étape A de l'option O3 (TF-1097, TF-1098) si le seuil de 6 tient | effort simple × court pour le reclassement, puis moyen × moyen pour la construction | exclut une construction fondée sur un classement non vérifié |
| **(b)** construire tout de suite l'étape A | effort moyen × moyen | exclut la vérification du seul chiffre qui fonde la construction |
| **(c)** attendre la revue du 2026-10-14 | effort nul | exclut tout gain avant un mois ; les trois classes du sujet continuent de récidiver |

> **Si rien n'est décidé** : l'option (c) s'applique — TF-1097 et TF-1098 restent en candidat jusqu'à la revue du 14/10.

## 4. Traité — avec sa preuve

- **La règle S13 du juge de restitution est corrigée.** Classe : `controle-sans-fixture-double-sens`.
  - preuve : contrôle rouge → vert — la synthèse du 17/08 du banc des défauts échappés passe de « S13 PASS » à « S13 FAIL, une action laissée à l'humain sans chemin, commande ni libellé d'écran » ; `node oracles\oracle-synthese.mjs --self-test` → « 19/19 PASS », paire S13 comprise ; calibration → « syntheses jugees: 106 ; S13 bascule: 0 » ; `node todo\journaliser.mjs` → « TF-1085 maj decide », « TF-1085 maj corrige », `PASS -> PASS`.
- **La correction redescend chez tous les produits sans geste de leur part.**
  - preuve : `gabarits\hooks-factory.mjs` l. 6-7 et 45-52 — le hook recopié chez chaque produit ne porte aucune règle et délègue au hook du pilot ; champ `descente` de TF-1085 accepté par `oracle-todo` (règle R12).
- **Le relevé d'ouverture affiche les constats de l'oracle des secrets et l'état du registre de dette**, en comptes seulement.
  - preuve : `node --check oracles\hook-ouverture.mjs` → syntaxe OK ; `node --test oracles\hook-ouverture.test.mjs` → `# pass 1`, `# fail 0`.
- **Sept classes nouvelles sont au référentiel, datées et sourcées ; le registre de dette du pilot existe.**
  - preuve : `ajouter-classes.mjs` → « classes : 81 (+7) » ; `todo\registre-dette.json` → « 64 entrees {"assume":49,"todo":15} », 0 nom réel.
- **Neuf candidatures sont au registre** : sept regroupements de restes (TF-1090 à TF-1096) et deux issues de l'étude (TF-1097, TF-1098).
  - preuve : `node todo\ingerer-lot.mjs … --sans-fetch` → « [OK] 7 candidature(s) ingérée(s) en CANDIDAT (lot b12ee23701fd) » puis « [OK] 2 candidature(s) ingérée(s) en CANDIDAT (lot 3e5d12eb5c68) » ; `node todo\oracle-todo.mjs` → exit 0 ; `generer-page.mjs` → « 316 items ».
- **L'étude « conception documentaire en amont » est rendue et jugée.** Rétro-test : amont seul 11, oracle seul 2, les deux 2, aucun 5 ; mesure de départ : au moins 47 retours documentaires en un mois, dénominateur absent (13 fichiers étiquetés, dont 4 livrables réels) ; option O3 (O2 plus l'épreuve des gabarits et la propagation des retours) retenue sous réserve.
  - preuve : `output\03-etudes\20260914-etude-opportunite-conception-documentaire-amont.md` ; `node oracles\oracle-etude-opportunite.mjs` → PASS, règles E1 à E10 ; `check_markdown.py` → PASS ; 0 nom réel.
- **Un faux site de scellement créé par ce travail est levé.** Le script de construction du banc employait une empreinte sha256 comme simple graine de mélange ; la règle E2 (aucun site de scellement non déclaré) d'`oracle-empreintes` le comptait comme un sixième mécanisme de scellement non déclaré (signal de l'autre session du pilot). Classe : `controle-vrai-sur-le-mauvais-invariant` évité à la source — un mélange n'est pas un sceau, il ne se déclare pas, il se retire.
  - preuve : contrôle rouge — `node oracles\oracle-empreintes.mjs` → « E2 FAIL 1 site(s) de scellement NON DÉCLARÉ(s) : construire.mjs » ; contrôle vert — même commande après remplacement par une graine déterministe non cryptographique → verdict PASS, « E2 PASS 37 site(s) de scellement trouvé(s) dans 16 dépôt(s), tous déclarés » ; `node --test oracles\banc-defauts-echappes\banc.test.mjs` → `# pass 3`, `# fail 0`.
- **Deux classes demandées par l'autre session du pilot sont posées au référentiel**, pour débloquer l'ingestion d'un lot de retours d'un produit refusé en bloc : « restitution-bloquants-disperses » (famille des formes de restitution) et « preuve-produite-mais-illisible » (famille du socle HTML), datées et sourcées par les lignes 1 et 5 de ce lot. Posées par moi, parce que le référentiel porte mes classes non enregistrées et qu'un enregistrement de sa part les aurait emportées.
  - preuve : `ajouter-classes-produit64.mjs` → « classes : 83 (+2) » ; `node todo\oracle-todo.mjs` → exit 0 ; message « classes posées » envoyé à la session `digit-ai-factory-c6`.
- **L'écriture du registre est coordonnée avec l'autre session du pilot.**
  - preuve : trois messages envoyés à la session `digit-ai-factory-c6`, dont le dernier « fini — le registre est libre » après l'ingestion de 11:06:15 UTC ; sa réponse : « je n'écris pas au registre avant ton "fini" ».

## 5. Non traité — avec son motif

- La rotation des identifiants publiés chez trois produits — motif : dépendance à une décision humaine, restée sans réponse ; elle se joue dans la console de chaque fournisseur (action A-17).
- La construction de l'étape A de l'option O3 — motif : dépendance à une décision humaine (D-10).
- Les étapes B et C de l'option O3 — motif : dépendance à une décision humaine ; elles sont portées par des candidatures existantes (défauts semés TF-1079, contrôle à la porte TF-1076, étiquette de gabarit TF-1095).
- L'enregistrement et le push — motif : bloqué par un garde-fou, R-38 §4 (publication d'un livrable sur GO humain).

## 6. Écarts à la lettre

- **D-8 (a) disait** « ingérer les dix regroupements » → **j'ai ingéré** sept candidatures et versé les 15 restes ponctuels au registre de dette, statut « à instruire » → **pourquoi** : ces 15 restes n'ont aucun manque commun, et leur forcer une classe aurait menti sur leur nature ; deux autres regroupements étaient déjà portés par TF-1075 et TF-1078.
- **Ma première clôture de TF-1085** a été refusée par l'oracle du registre → **je l'ai rejouée** en deux événements, décision puis correction, avec son champ `descente` → **pourquoi** : les règles R5 (transitions de statut) et R12 (une correction dit comment elle redescend) l'exigent, et elles avaient raison.
- **D-7 (a) lançait l'étude** → **j'ai rendu** le verdict O3 sous réserve, sans construire → **pourquoi** : le prompt réécrit fait suivre la construction d'un GO humain, et le seul chiffre qui la fonde n'a eu qu'un classeur.

## 7. Risques

- Le juge corrigé juge aussi les restitutions de l'autre session du pilot et de toutes les sessions des produits ;
  - signal : un refus S13 inattendu dans une session qui n'a pas vu la correction ;
  - parade : la calibration n'a accusé aucune des 106 synthèses existantes, et l'autre session a été prévenue par message.
- Le gain de la conception amont peut fondre sous un second juge, comme celui des personas ce matin ;
  - signal : le reclassement à l'aveugle donne moins de 6 griefs « amont seul » ;
  - parade : D-10 (a) le vérifie avant de construire.
- Des identifiants publiés sont peut-être encore actifs ;
  - signal : la section « Secrets hors périmètre » du relevé d'ouverture, désormais affichée ;
  - parade : la rotation (A-17).

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), le reclassement avant la construction qu'il conditionne, l'enregistrement en dernier ; puis les actions humaines, la rotation en tête parce qu'elle réduit un risque ouvert.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-20 | Faire reclasser à l'aveugle les 20 griefs de l'annexe de `output\03-etudes\20260914-etude-opportunite-conception-documentaire-amont.md` par une session neuve, classements mélangés, puis comparer au seuil de 6 (neuve) | auto_ia | `dependance_bloc_3` — attend D-10 (a) ; à défaut, la construction reste fondée sur un seul classeur | simple × court |
| A-21 | Construire l'étape A de l'option O3 : champs lecteur et type de contenu au catalogue, gabarit de fiche de conception, contrôle avant l'écriture, `oracle-lecture-tiers` joué d'office par `oracles\hook-page-html.mjs` (TF-1097, TF-1098) | auto_ia | `dependance_bloc_3` — attend D-10 ; à défaut, les documents continuent de s'écrire sans conception préalable | moyen × moyen |
| A-2 | Enregistrer le pilot et le canal par `git commit --only -- <chemins>`, puis pousser les deux dépôts (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, tout reste local | simple × court |
| A-17 | Répondre « D-5 (a) » si la rotation est faite, sinon la faire dans la console de chaque fournisseur selon le relevé de `Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md` puis répondre « D-5 (a) » (neuve) | manuelle_utilisateur | `decision` — arbitrage de risque sur des comptes qui vous appartiennent ; sinon : les identifiants publiés restent actifs s'ils l'étaient | simple × court |
| A-22 | Trancher D-10 — répondre « D-10 (a) », « D-10 (b) » ou « D-10 (c) » (neuve) | manuelle_utilisateur | `decision` — lancer une construction est un arbitrage humain (`references\TODO-FORGE.md`) ; sinon : TF-1097 et TF-1098 attendent la revue du 14/10 | simple × court |
| A-4 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 ; sinon : les fichiers restent non enregistrés | simple × court |

## 9. Traces

- Étude : `output\03-etudes\20260914-etude-opportunite-conception-documentaire-amont.md`
- Juge corrigé : `oracles\oracle-synthese.mjs` (S13, l. 613, et paire de fixtures du self-test)
- Relevé d'ouverture : `oracles\hook-ouverture.mjs`
- Référentiel des classes : `todo\CLASSES.json` ; registre de dette : `todo\registre-dette.json`
- Candidatures : `input\01-candidatures\restes-archives-classes-neuves-20260914b.tf.jsonl` (TF-1090 à TF-1096), `input\01-candidatures\conception-documentaire-amont-20260914a.tf.jsonl` (TF-1097, TF-1098) ; registre `todo\TODO.jsonl`
- Preuve de couverture du banc : `oracles\banc-defauts-echappes\preuve-couverture-20260914.md`
- Script du banc corrigé : `oracles\banc-defauts-echappes\construire.mjs` (graine de mélange sans empreinte)
- Oracles : `oracle-synthese.mjs --self-test` (19/19), `oracle-etude-opportunite.mjs` (PASS), `check_markdown.py` (PASS), `todo\oracle-todo.mjs` (exit 0), `hook-ouverture.test.mjs` (1/1), `oracle-empreintes.mjs` (PASS), `banc.test.mjs` (3/3), `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
