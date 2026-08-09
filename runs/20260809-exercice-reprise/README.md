# Exercice de reprise d'un run interrompu — TF-0038 (2026-08-09)

La promesse du contrat — « `bloque_question` suspend le run proprement (état persisté au
ledger, reprise idempotente) » — n'avait jamais été testée. Cet exercice la met à l'épreuve
sur un run synthétique (aucun produit réel touché, gouvernance des produits autonomes
respectée).

**Dispositif** : `ledger.jsonl` synthétique — run ouvert, étape conception ouverte, une
invocation, puis `question_humain` (état `bloque_question`, 2 questions, `QUESTIONS.md`
écrit). Intégrité vérifiée par `ledger.mjs verify` (forge-agents) avant et après.

**Résultat : 3/3 PASS** (`node exercice.mjs`) :
- E1 — une session neuve reconstitue l'état exact depuis le seul ledger (étape courante,
  blocage, questions en attente) ;
- E2 — la procédure de reprise détecte le run vivant et **ne rouvre pas** (pas de doublon de
  `run_open`) ;
- E3 — `reponse_humain` débloque, l'étape suspendue redevient la seule actionnable.

**Constat honnête (reste ouvert)** : la reconstitution d'état est *procédurale* — chaque
session la réimplémente en lisant le ledger ; cet exercice en a écrit l'embryon exécutable
(`etatDepuisLedger`). Si un troisième usage apparaît, en faire un outil partagé (candidature
à ce moment-là, pas avant).
