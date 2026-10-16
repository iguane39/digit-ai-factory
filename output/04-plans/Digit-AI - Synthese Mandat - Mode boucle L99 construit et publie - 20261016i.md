---
destinataire: humain
---

# Synthèse Mandat — mode « L99 boucle » construit, publié et exercé une première fois (16/10/2026)

## 0. Synthèse d'ouverture

Le mode est en service. Pour l'utiliser, demandez « L99 boucle » ou « améliore ce prompt jusqu'à un score » dans n'importe quelle session du poste. L99 fait alors relire chaque version par un agent neuf qui n'a pas vu l'analyse. Il recompte les défauts de ce relecteur et s'arrête à zéro défaut majeur, ou quand une passe gagne moins de 3 points. Premier essai réel, sur le prompt Supabase de ce matin : au lieu d'un 93 projeté, la boucle affiche 84 mesuré et s'arrête après 2 passes. Elle nomme les 2 défauts majeurs qui restent, et ils sont transmis à la session qui exécute ce prompt. Hors de ce mode, L99 écrit désormais « projeté (non mesuré) ». Aucune décision ne vous revient dans ce tour.

## 1. En-tête d'identification

Exécution de votre décision « 1a » (D-1 de la synthèse 20261016f) : construire le mode boucle de `prompt-analyzer-l99`. Période : 16/10/2026 de 11:05 à 11:32, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, 1 agent relecteur Claude Opus 5.5.

Intention de la demande : obtenir de L99 des prompts réellement meilleurs, en bouclant jusqu'à un critère d'arrêt, sans relancer l'analyse à la main.

Test rétro : le résultat sert cette intention. Le premier exercice montre ce que la boucle apporte : un score mesuré à la place d'un score promis, et les défauts restants nommés au lieu d'être couverts par un 93.

## 2. Verdict en une ligne

Mode livré dans forge-agents (commit cf42278, publié, 0 commit d'écart avec `origin/main`) ; recette du skill 10 sur 10, paire boucle-l99 conforme dans la recette de quality-oracles, découverte des oracles 9 sur 9 ; TF-1831 clos en `corrige`, `oracle-todo` PASS.

## 3. Décisions attendues

Aucune décision ne vous revient dans ce tour. La publication du pilot vous est déjà posée par une autre session, en D-2 de sa synthèse 20261016g ; elle portera aussi ce tour.

## 4. Traité

- **Le mode.** `prompt-analyzer-l99` passe en 2.6.0. Le protocole vit dans `references/boucle.md` : arbitre figé avant la passe 1, relecteur aveugle, recompte de chaque défaut grave, garde de longueur de 15 %, arrêt à 0 bloquant et 0 majeur ou gain inférieur à 3 points, borne de 3 passes. `SKILL.md` gagne le niveau « L99 boucle », son déclencheur et la règle 10 (« le juge n'est jamais l'auteur »). Le Ch8 de `couches.md` écrit « projeté (non mesuré) » hors du mode.
- **L'oracle du mode.** `scripts/oracle-boucle-l99.mjs` juge le journal de boucle sur 7 règles, B1 à B7. Recette `scripts/self-test.mjs` : 10 sur 10, soit 2 verts et 8 rouges qui ne changent chacun qu'un élément du vert.
- **Registre des oracles.** L'oracle est inscrit au registre quality-oracles 2.43.0, en invocation explicite. Sa paire est au manifeste : la rouge reprend l'auteur qui se renote et affiche 93 projeté. La recette de quality-oracles rend FAIL sur la rouge avec ses 2 messages attendus, et PASS sur la verte.
- **Installation et livraison.** Les 2 skills sont installés au poste par `sync-skills.mjs --sync --vers installation`, et le contrôle d'écart les rend alignés. `versions-livrees.json` est soldé. Forge-agents est publiée et l'envoi est vérifié par `rev-list` : 0 commit d'écart avec `origin/main`.
- **Premier exercice réel.** Prompt Supabase b. Passe 1 : 84, 3 majeurs recomptés. Passe 2 : la version corrigée par la session du run, 1 353 mots contre 1 231 (+9,9 %), notée 84 par un relecteur neuf. Sont clos `oracle-secrets` et les comptes Azure. Restent ouverts l'idempotence (8, 10, 8 et 4 fichiers Supabase déjà présents dans les forges ops, audit, agents et data) et un contrôle de sources inapplicable aux `.json`. L'arrêt tombe sur « gain insuffisant ». Le journal, au format `.boucle.json` à côté du prompt, rend PASS à l'oracle, et les 2 majeurs restants sont transmis à la session du run.
- **Registre du pilot.** TF-1831 passe de `decide` à `corrige`, avec ses gains constatés et sa descente (règle et oracle). Un premier essai de clôture a été refusé par R7 et R12 ; il est corrigé et rejoué sur une copie jetable avant l'écriture.

## 5. Non traité

- **Échec TF-1492 (C) dans la recette de quality-oracles.** Motif : il juge le format d'un `main.tf` avec le binaire `terraform` du poste ; ce tour n'a touché ni cet oracle ni sa fixture. Instruction proposée en A-1.
- **Gain médian du mode sur plusieurs analyses.** Motif : un seul exercice à ce jour ; la mesure est due à la revue du 2026-11-16 (plan de revue de l'étude 20261016e).
- **Publication du pilot.** Motif : décision humaine (R-38), déjà posée par une autre session.

## 6. Écarts à la lettre

Aucun : le mode suit l'option (a) telle que l'étude la décrit.

## 7. Risques

- **Le relecteur rate ou invente des défauts.**
  - Énoncé : il est du même modèle que l'auteur ; ce matin, 2 de ses chiffres sur 5 prompts étaient faux.
  - Signal : un défaut retenu qu'un recompte à la source dément.
  - Parade : B3 refuse un défaut grave sans recompte ; 2 relecteurs pour un prompt de run.

## 8. Prochaines actions

L'instruction de l'échec Terraform vient d'abord, parce que la recette de quality-oracles reste rouge tant qu'il n'est pas tranché ; la revue du mode suit à sa date.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Instruire l'échec TF-1492 (C) : sortie de `terraform fmt` du poste contre l'attendu de T1 | auto_ia | hors du périmètre de ce tour | `node C:\dev\digit-ai-forge-agents\.claude\skills\quality-oracles\scripts\self-test.mjs` | La recette de quality-oracles reste rouge et masque un futur échec |
| **A-2** | TF-1831 | Mesurer le gain médian du mode sur les analyses faites d'ici là | auto_ia | revue datée de l'étude 20261016e | Relever les fichiers `*.boucle.json` sous `C:\dev` le 2026-11-16 | Le mode reste jugé sur un seul exercice |

## 9. Traces

- forge-agents, commit cf42278 (publié) : `.claude/skills/prompt-analyzer-l99/` (`SKILL.md`, `references/boucle.md`, `scripts/oracle-boucle-l99.mjs`, `scripts/self-test.mjs`, `fixtures/`), `.claude/skills/quality-oracles/` (registre 2.43.0, manifeste, paire boucle-l99), `versions-livrees.json`
- `output/04-plans/Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md.boucle.json`
- `todo/TODO.jsonl`, événements TF-1831 `decide` (09:13:20 Z) et `corrige` (09:31:58 Z)
