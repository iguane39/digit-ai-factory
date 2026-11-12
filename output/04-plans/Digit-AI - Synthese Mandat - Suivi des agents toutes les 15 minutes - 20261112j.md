---
destinataire: humain
---

# Synthèse Mandat — suivi des agents toutes les 15 minutes, construit et prouvé, 12/11/2026

## 0. Synthèse d'ouverture

Vous saurez désormais si un agent long vit encore : dès qu'il dépasse 15 minutes, la session est réveillée toutes les 15 minutes, même son tour fini, et affiche « Suivi agents » avec l'état de chaque agent, son âge mesuré, ses tâches faites et restantes. Quatre bancs réels l'ont prouvé, chaque point tombant à 15 minutes à moins d'une demi-minute près, sans aucun refus du hook de fin de tour. Le suivi part chez 32 produits sur 34 à leur prochaine ouverture ; pour les 2 autres, il vous faut y ouvrir une session. Une limite reste : dans une session VS Code, le harnais ne garde pas tous les textes de l'assistant dans son transcript, et le contrôle après coup peut y sous-compter les points.

## 1. En-tête d'identification

Mandat : exécution du prompt « Suivi des agents toutes les 15 minutes », version g, sur votre « A1 ». Sur le pilot `digit-ai-factory` (commit 719d41ed au départ). Période : 12/11/2026, du premier relevé à 21:17 jusqu'au dernier à 23:26, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 7 sessions `claude -p` (4 bancs, 3 essais), avec 6 agents de banc en Haiku ; 1 relecteur d'intention.

Intention de la demande : savoir à tout moment si un agent long vit encore, ce qu'il a fait et ce qui lui reste, et que ce suivi tourne vraiment chez tous les produits.

Test rétro : le résultat sert cette intention ; le point est produit par un hook que le harnais relance à chaque fin de tour, et non par la mémoire de la session, et il voyage par le contrat d'héritage.

## 2. Verdict en une ligne

Suivi des agents construit et prouvé : 4 bancs au verdict attendu, oracle de relevé PASS sur les bancs, 200 synthèses rejouées sans changement de verdict, contrat d'héritage 1.61.0 vu par le relevé chez 32 produits sur 34.

## 3. Décisions attendues

Rien n'attend de décision : D-209 est tranchée par votre réponse « 209a », et le mandat a suivi le prompt version g.

## 4. Traité

Les points se groupent par étape du prompt ; chacun porte sa preuve.

**Demande d'origine et diagnostic (étapes 0 à 2)**
- Faits de l'étape 0 remesurés à 21:18 ; un seul écart notable : la première écriture d'un journal d'avancement de produit date du 24/08 et non du 21/08.
  - preuve : `grep -c avancement gabarits/HERITAGE.json` rend 0 ; 35 dossiers `forge\` dont 18 avec journal ; 764 transcripts de sous-agents dans `~\.claude` depuis le 11/10, 270 dans `~\.claude-b` depuis le 02/10.
- La demande du 11/08 n'est pas citable mot pour mot : le registre écrit « demande explicite de l'opérateur en session » (TF-0094), et le plus ancien message humain encore lisible date du 22/09/2026.
  - preuve : le 13/08, la candidature `candidature-relais-avancement.tf.jsonl` cite « il n est pas sense y avoir un affichage de l avancement progressif toutes les 3 minutes ? » ; le 24/10, chez Produit-85, « fournis un point de situation tous les 10% d'avancement », dont la veille s'est éteinte à 30 minutes.
- Diagnostic : 279 sous-agents de plus de 15 minutes sur 30 jours, classés par `scripts/diagnostic-suivi-agents.mjs`, mesure de 21:40.
  - preuve : 10 cas tirés au hasard relus à la main, 10 concordants ; 30 indéterminés, soit 10,8 %, sous le seuil de 15 %.

Le tableau se lit ainsi : (a) la consigne ne nomme aucun fichier d'avancement, (b) l'agent n'y écrit pas, (c) la session ne le lit jamais, (d) elle le lit sans rien afficher pendant plus de 17 minutes, (e) suivi tenu.

| Dépôt | (a) | (b) | (c) | (d) | (e) | indéterminé |
|---|---|---|---|---|---|---|
| digit-ai-factory | 92 | 1 | 73 | 4 | 9 | 30 |
| produits hors table | 31 | 0 | 18 | 0 | 0 | 0 |
| Produit-82 | 3 | 0 | 5 | 0 | 0 | 0 |
| Produit-83 | 6 | 0 | 1 | 0 | 0 | 0 |
| Produit-12 | 3 | 0 | 0 | 0 | 0 | 0 |
| digit-ai-marketing | 2 | 0 | 0 | 0 | 0 | 0 |
| Produit-02 | 1 | 0 | 0 | 0 | 0 | 0 |

**Mécanisme (étape 3)**
- Le porteur du réveil est mesuré : un hook de fin de tour marqué `asyncRewake` tourne en arrière-plan et réveille la session quand il sort en code 2, même après la fin de son tour.
  - preuve : essai de 21:20 à 21:21, une session `claude -p` sur l'abonnement a fini son tour, puis a écrit « Suivi agents » 60 secondes plus tard sur le seul réveil du hook.
- Le hook `oracles/hook-suivi-agents.mjs` juge chaque agent de l'extérieur, à la dernière écriture de son transcript ou de son fichier d'avancement, et rappelle aussi le point pendant un tour de plus de 15 minutes.
  - preuve : recette `oracles/hook-suivi-agents.test.mjs`, 41 cas sur 41, dont le passage par le lanceur d'un produit factice.
- Les 2 juges de fin de tour reconnaissent la forme « point de suivi », par la règle S116 (forme du point de suivi) ; un faux point reste jugé.
  - preuve : `hook-restitution.test.mjs` 77 sur 77 ; 200 synthèses d'`output\04-plans\` jugées avant et après, 200 verdicts identiques ; la fixture « faux point » sort en 1.
- `gabarits/AGENT-CAMPAGNE.md` dit maintenant les clés lues (`ts`, `faits`, `restants`, `commande`, `fin_attendue`), la décision de TF-2463 et la fin du guetteur à armer à la main ; `gabarits/RESTITUTION.md` passe en 2.68.0 avec sa huitième exemption.
  - preuve : lecture des deux sections modifiées.

**Preuve par bancs (étape 5)**
- Mode : `claude -p --input-format stream-json` sur l'abonnement, un seul message, puis aucune entrée jusqu'aux points ; hooks réels du pilot.
  - preuve : `scripts/banc-suivi-agents.mjs`, réglages écrits dans chaque dossier de banc.
- Banc de bout en bout, agent de 35 minutes : points à 15,3 et 30,3 minutes, « actif » à chaque fois.
  - preuve : `oracle-suivi-agents` PASS, écarts 15,2, 15,1 et 5 minutes.
- Banc figé, rejoué une fois : au premier passage, l'agent de banc s'était tu à 9 minutes au lieu de 12 ; corrigé, il est « actif (preuve de vie il y a 3 min) » au point de 15 minutes et « présumé arrêté (preuve de vie il y a 18 min) » à celui de 30.
  - preuve : points de 22:08 et 22:24 dans le transcript du second banc.
- Banc commande longue : « commande longue (fin attendue 21:57) » au point de 15 minutes, jamais « présumé arrêté », puis « fini » une seule fois au point suivant.
  - preuve : `oracle-suivi-agents` PASS, écarts 15 et 6,2 minutes.
- Banc court, agent de 10 minutes : aucun point.
  - preuve : 0 message « Suivi agents » dans sa sortie ; l'oracle n'y trouve aucun agent à juger.
- Acceptation par le hook de fin de tour : aucun refus après un point, et `oracle-synthese` rejoué sur le texte exact de chaque point sort en 0.
  - preuve : 5 points rejoués, S116 PASS sur chacun ; seuls les tours de lancement ont été refusés, comme tout tour qui lance un agent.
- L'oracle de relevé `oracles/oracle-suivi-agents.mjs` a sa paire de fixtures et rejoint le registre de `quality-oracles`.
  - preuve : `--self-test` 5 sur 5 ; registre 2.61.0, `verifier-accord-registre` PASS, envoyé dans `digit-ai-forge-agents` (466ea25).

**Héritage (étape 4)**
- Le contrat d'héritage passe en 1.61.0 : le lanceur des produits connaît `suivi-agents`, avec un délai porté à 1 190 secondes pour la seule veille (valeur de réglage, non mesurée), et le gabarit de réglages câble les 2 entrées.
  - preuve : `relever-heritage.test.mjs` 49 sur 49 et `hooks-factory.test.mjs` 50 sur 50 ; le relevé du parc nomme le motif manquant chez 32 produits sur 34.
- 2 produits ne le recevront pas seuls, faute de réglages de hooks : Produit-77 (ni lanceur ni réglages) et Produit-67 (lanceur sans réglages).
  - preuve : relevé d'héritage du parc, 34 produits, mesure de 21:51.

**Harnais complet du pilot**
- Premier passage, de 21:54 à 23:09 : 4 oracles sur 262 en défaut, dont 3 de mon fait, que j'ai corrigés. La ligne de rappel du hook citait encore la 2.67.0 du gabarit de restitution, et la fixture verte de conformité ne câblait pas `suivi-agents`. Ma recette ne nommait pas son cas rouge dans le vocabulaire lu (règle I6).
  - preuve : rejoués seuls après correction, `hook-restitution.test` 77 sur 77, `hooks-factory.test` 50 sur 50, conformité 241 PASS et 0 FAIL, recette du suivi 41 sur 41 « à double sens ».
- Le quatrième défaut, `verifier-jugement` sur le parc réel, porte sur des livrables scellés d'autres sessions : il n'est pas de mon fait et reste à leur charge.
  - preuve : sortie du harnais, ligne « I4 — FAIL sur le parc », remède « re-sceller ou nouvel indice ».

**Registre et enregistrement**
- TF-2463 passe en « corrige », avec ses gains au banc et sa descente ; le constat sur le transcript VS Code entre en candidat sous TF-2472.
  - preuve : `todo/journaliser.mjs`, `oracle-todo` PASS avant et après chaque écriture.
- Le code est enregistré au pilot sous ba2a1b76, 15 fichiers, puis ses 3 correctifs et le cliquet des recettes dans un second commit. Une autre session du pilot l'a fusionné avec son lot pj (53f38801), en gardant mon paragraphe de cadence, puis a tout envoyé ; elle a aussi clos TF-2463 de son côté.
  - preuve : `git merge-base --is-ancestor ba2a1b76 origin/main` rend 0 ; `oracle-todo` PASS sur le registre qui porte les 2 clôtures.

Relecture d'intention : sert (RI-20261112-16), 2 écarts mineurs de votre ressort. Le point sur la session elle-même et le rappel au lancement d'un agent élargissent un peu le périmètre ; le prompt g les prévoyait. Le relecteur n'a lu qu'une partie d'un livrable de 2 167 lignes, sans les bancs.

## 5. Non traité

- Le point d'un agent qui survit à sa session fermée — motif : impossible à prouver ici ; une session fermée n'a plus de conversation, la limite est déclarée (S67) et l'oracle de relevé compte ce cas à part, sans échec.
- Une commande d'arrière-plan de la session — motif : écarté ; elle n'a ni transcript ni fichier d'avancement, et le harnais notifie déjà sa fin. Critère de réouverture : une commande d'arrière-plan muette plus de 15 minutes au relevé.
- Le contrôle après coup d'une session VS Code — motif : dépendance externe ; le harnais 2.1.322 n'y garde pas tous les textes de l'assistant, le constat entre au registre (TF-2472) et le hook compte les points qu'il a demandés pour tenir sa cadence.
- L'enregistrement des registres `todo/TODO.jsonl` et `decisions/REGISTRE.jsonl` — motif : bloqué par un garde-fou ; ils portent aussi des changements d'autres sessions, que je n'enregistre pas à leur place.

## 6. Écarts à la lettre

Quatre endroits où l'exécution s'écarte du texte du prompt g, chacun avec sa raison ; aucun ne touche votre demande.

| Le prompt disait | J'ai fait | Pourquoi |
|---|---|---|
| « un hook ne peut ni appeler un outil ni écrire dans la conversation » (étape 0.6) | le porteur est un hook de fin de tour en `asyncRewake`, qui réveille la session | la mesure contredit la liste, et le prompt dit qu'elle l'emporte |
| « le hook PreToolUse sur Agent peut nommer le fichier d'avancement » | un rappel après le lancement signale une consigne sans fichier, sans réécrire la consigne | réécrire l'entrée d'un outil exige de l'autoriser d'office, ce qui contournerait les permissions |
| banc figé : « cesse toute écriture à 12 minutes » | premier passage tu à 9 minutes, rejoué corrigé | défaut de l'agent de banc, pas du mécanisme : le hook a mesuré 6 minutes, ce qui était juste |
| commande de l'agent au premier plan | deux réglages du harnais relevés pour les seuls bancs | sans eux, le harnais bascule la commande en arrière-plan vers 175 secondes (TF-2463) |

## 7. Risques

- Chaque appel d'outil d'une session du pilot ou d'un produit paie le hook.
  - signal : environ 190 ms par appel, et de 325 à 430 ms une fois par minute sur un transcript de 7,6 Mo, mesurés à 21:58.
  - parade : `FORGE_SUIVI_AGENTS=0` le coupe pour une session.
- Un agent sans fichier d'avancement, pris dans une longue commande, sera dit « présumé arrêté » à tort.
  - signal : « présumé arrêté » suivi d'une nouvelle écriture du même agent.
  - parade : le rappel au lancement signale la consigne sans fichier, et la règle de TF-2463 fait annoncer `commande` et `fin_attendue`.

## 8. Prochaines actions

Les actions sont classées dans l'ordre où elles se font : la vôtre d'abord, parce qu'elle complète le parc, puis le relevé d'usage, qui attend une semaine de sessions réelles.

| Sélecteur | Item | Action | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | neuve | Équiper les 2 produits sans réglages de hooks | manuelle_utilisateur | decision | ouvrir une session Claude Code dans Produit-77 et Produit-67 et y accepter la phase 0 du pilot (skill `accueil-factory`), ou me donner mandat d'écrire chez eux | si rien n'est fait : ces 2 produits n'auront aucun point de suivi |
| A-2 | TF-2463 | Mesurer le suivi sur une semaine de sessions réelles | auto_ia | gate_gouvernance : relevé d'usage daté du 19/11 | `node oracles/oracle-suivi-agents.mjs --depuis 2026-11-12T22:40` | si rien n'est fait : le gain reste prouvé au banc seulement |

## 9. Traces

- Mécanisme : `oracles/lib-suivi-agents.mjs`, `oracles/hook-suivi-agents.mjs`, sa recette `oracles/hook-suivi-agents.test.mjs`.
- Oracle de relevé : `oracles/oracle-suivi-agents.mjs`.
- Bancs : `scripts/banc-suivi-agents.mjs`, `scripts/banc-agent-factice.mjs` ; diagnostic : `scripts/diagnostic-suivi-agents.mjs`.
- Juges amendés : `oracles/hook-restitution.mjs`, `oracles/oracle-synthese.mjs` (S116).
- Héritage et doctrine : `gabarits/HERITAGE.json`, `gabarits/hooks-factory.mjs`, `gabarits/settings-produit.json`, `gabarits/AGENT-CAMPAGNE.md`, `gabarits/RESTITUTION.md`, `.claude/settings.json`.
- Prompt exécuté : `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112g.md`.
