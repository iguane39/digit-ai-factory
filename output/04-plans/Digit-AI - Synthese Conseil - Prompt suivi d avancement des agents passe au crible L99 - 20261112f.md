---
destinataire: humain
---

# Synthèse Conseil — prompt « suivi d'avancement des agents » passé au crible L99 (analyse de prompt en 8 couches), 12/11/2026

## 0. Synthèse d'ouverture

Le suivi que vous aviez demandé existe au pilot depuis le 11/08 et a été réécrit 3 fois, mais il ne contraint que l'agent qui écrit son avancement : rien n'oblige la session à le lire ni à vous le montrer, et rien ne voyage chez les produits. C'est pourquoi il n'a tourné que chez 18 produits sur 35. Le prompt réécrit commande un mécanisme qui juge de l'extérieur si l'agent vit encore, affiche toutes les 15 minutes ses tâches faites et restantes, couvre aussi la session elle-même, et part chez les produits à leur prochaine ouverture. Votre demande est notée 37 sur 100. La version livrée n'est pas mesurée, pour une raison de protocole dite au bloc 4. Une décision vous attend : exiger la preuve par bancs, ou garder le suivi comme visé, puisque vous aviez écrit « idéalement ». Ensuite, dites « exécute le prompt ».

Livré : [Revue L99 du prompt](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20suivi%20d%20avancement%20des%20agents%20passe%20au%20crible%20L99%20-%2020261112a.md) · [Prompt réécrit](output/04-plans/Digit-AI%20-%20Prompt%20-%20Suivi%20des%20agents%20toutes%20les%2015%20minutes%20-%2020261112e.md)

## 1. En-tête d'identification

Analyse L99 en mode boucle (skill `prompt-analyzer-l99`, 8 couches, relecteurs aveugles) de la demande « Certains agents tournent pendant des heures… toutes les 15 minutes, avec les tâches exécutées et celles restants à faire ». Sur le pilot `digit-ai-factory` (commit 9d4c4f21). Période : 12/11/2026, du premier relevé à 17:36 jusqu'à 19:21, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 12 sous-agents de relecture et de vérification, en lecture seule.

Intention de la demande : savoir à tout moment si un agent long vit encore, ce qu'il a fait et ce qui lui reste, et que ce suivi tourne vraiment chez tous les produits.

Test rétro : le résultat sert cette intention après une passe de relecture d'intention. Le prompt vise le relais vers vous et le transport chez les produits, les 2 maillons qui manquaient ; il ne réécrit pas une 4e fois la règle d'émission.

## 2. Verdict en une ligne

Demande notée 37 sur 100 ; passe 1 mesurée 69 par 2 relecteurs aveugles ; version livrée non mesurée, dérivée d'une reprise notée 82 et 40, le 40 tenant à un compte corrigé depuis.

## 3. Décisions attendues

Le seul bloquant qui retient l'exécution complète :
- la preuve par bancs de l'étape 5 du prompt `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112e.md`, qui attend votre réponse à la décision ci-dessous.

> **D-209 — Le suivi des agents toutes les 15 minutes doit-il être exigé et prouvé par des bancs, ou rester un réglage visé sans preuve, comme le laissait entendre le mot idéalement ?**
> - **De quoi s'agit-il** : l'étape 5 du prompt `Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112e.md` fait tourner 4 agents de test (35, 12, 20 et 10 minutes) et un contrôle qui relit les transcripts, avant de déclarer le suivi livré.
> - **Le problème** : vous avez écrit « Idéalement, lorsqu'un agent s'exécute plus de 15 minutes ». La preuve par bancs transforme ce souhait en exigence, et rallonge le mandat d'environ 1 h 30 de bancs.
> - **Pourquoi vous** : c'est un arbitrage entre la charge du mandat et la certitude qu'il marche ; les 3 corrections précédentes, du 11/08 au 12/11, ont été closes sans aucune mesure d'usage.
> - **Recommandation : (a)** — votre phrase « assure toi qu'elle puisse être complétée et exécutée correctement » demande une preuve, et seul un banc la donne. Source consultée : le registre `todo/TODO.jsonl`, clôture du 12/11 « aucun gain chiffré avant usage ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Exiger et prouver | le mécanisme est construit, puis prouvé par les 4 bancs et le contrôle des transcripts ; un banc rouge rend le mandat en échec | environ 1 h 30 de bancs, non mesuré | aucun : la preuve ne change rien chez les produits |
| (b) Viser sans preuve | le mécanisme est construit et transporté chez les produits, sans bancs ; il se mesure à l'usage | aucun banc ; le risque d'une 4e règle qui ne tourne pas | lancer les bancs plus tard |
| (c) Rien ne change | le prompt n'est pas exécuté | aucun | trancher plus tard |

> **Sans réponse** : le prompt s'exécute jusqu'à l'étape 4 si vous le lancez, et la synthèse du mandat dira que la preuve n'est pas jouée.

## 4. Traité

Le score se lit dimension par dimension, demande d'origine puis passe 1 mesurée (le plus bas des 2 relecteurs) : clarté 12 → 16 sur 20, spécification 7 → 12 sur 20, garde-fous 3 → 12 sur 15, ancrage 6 → 12 sur 15, vérifiabilité 4 → 9 sur 15, robustesse 5 → 8 sur 15.

**Diagnostic mesuré**
- Chaîne au registre : TF-0094 du 11/08 (l'agent émet), candidature du 13/08 (le relais manque), D-41 a du 19/10 (canal fichier), TF-2434 et TF-2463 du 12/11 ; preuve : lecture de `todo/TODO.jsonl`, `todo/TODO-ARCHIVE.jsonl` et `gabarits/AGENT-CAMPAGNE.md`, lignes 273 à 315.
- Transport absent : `grep -c avancement gabarits/HERITAGE.json` rend 0 à 17:36.
- Couverture : 18 produits portent un journal `forge/avancement.jsonl` sur 35 dossiers `forge\` hors forges et hors fixtures ; preuve : `find /c/dev -maxdepth 5`, recompté après qu'un relecteur a relevé 37.
- Volume : 980 sous-agents dont les fichiers ont changé en 30 jours, 267 à plus de 15 minutes, 142 à plus de 60, le plus long à 1 002 minutes ; preuve : script de relevé du dossier de travail, à 17:37 ; un vérificateur en a recompté 986, 273 et 146 un peu plus tard, la fenêtre ayant glissé.

**Boucle de relecture**
- Passe 1 : 76 et 69, 9 majeurs retenus, 1 écarté au recompte (l'outil Workflow existe dans la session).
- Passe 2 : 40 et 40, un bloquant créé par la réécriture (conservation des transcripts mal mesurée, sur les seuls fichiers de session) ; vérification de clôture : 7/9 défauts fermés, 5/5 défauts créés refermés avant la relecture.
- Reprise : 82 et 40 ; le 40 tient au dénominateur 37, présent mot pour mot dans les 3 passes (`grep -c` rend 1 dans chacune).
- Arrêt : règle de régression, passe gardée 1, journal jugé PASS par `oracle-boucle-l99.mjs`.
- Version livrée : la reprise, avec les 9 défauts qu'elle portait recensés et fermés, hors boucle, non mesurée. Livrer la passe 1 aurait remis le même bloquant et 9 majeurs que la passe 2 fermait.

**Livrables et contrôles**
- Revue L99 en 8 chapitres et prompt réécrit : `check_markdown.py` PASS et `oracle-ecriture` PASS sur les 2 fichiers.
- Constat sur la règle de régression de la boucle, ajouté à l'essai en cours TF-2026 par `todo/journaliser.mjs` ; `oracle-todo` PASS avant et après.
- Décision D-209 réservée par `scripts/reserver-decision.mjs`, PASS.

Relecture d'intention : sert après 1 passe (RI-20261112-12 rendait une dérive majeure, RI-20261112-13 rend « sert », 2 écarts mineurs de votre ressort, posés en D-209 et au bloc 6).

## 5. Non traité

- Exécution du prompt — motif : hors_mandat ; elle attend votre « exécute le prompt ».
- Score de la version livrée — motif : borne_atteinte ; le protocole de boucle ne permet pas de seconde reprise, et la version livrée n'a pas été relue à l'aveugle.

## 6. Écarts à la lettre

Ils relèvent de la manière d'exécuter ; le durcissement de votre « idéalement » est posé à part, en D-209.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « un agent » | sous-agents, Workflow et la session elle-même quand un de ses tours dépasse 15 minutes | le mot n'était pas borné |
| « toutes les 15 minutes » | l'agent garde son émission de 3 minutes dans un fichier ; seul le point affiché passe à 15 | l'émission fine sert de preuve de vie et de contenu |
| « analyse la demande initiale » | la retrouver mot pour mot, puis diagnostiquer les cas réels | la demande seule n'explique pas pourquoi elle n'a tourné que quelques fois |
| « dans les prochaines màjs des produits » | par le contrat d'héritage, reçu à l'ouverture ; aucune écriture directe chez un produit | aucun mandat d'écriture n'est déclaré chez eux |

## 7. Risques

- Bruit : 267 agents longs en 30 jours donneraient beaucoup de points.
  - Signal : plus d'un point par fenêtre de 15 minutes dans une même session.
  - Parade : un seul point par session regroupe ses agents (étape 3.2 du prompt).
- Faux arrêts : un agent vivant dans une commande longue serait dit arrêté.
  - Signal : « présumé arrêté » suivi d'une nouvelle écriture du même agent.
  - Parade : état « commande longue » et banc dédié dans le prompt.

## 8. Prochaines actions

Les actions sont classées dans l'ordre où elles se font : la décision d'abord, parce qu'elle fixe l'étape de preuve, puis le lancement, puis la revue datée du 16/11. La colonne Acteur dit qui agit.

| Sélecteur | Item | Action | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | D-209 | Choisir si le suivi doit être prouvé par des bancs | manuelle_utilisateur | decision | répondre « 209a », « 209b » ou « 209c » ; options au bloc 3 de `output/04-plans/Digit-AI - Synthese Conseil - Prompt suivi d avancement des agents passe au crible L99 - 20261112f.md` | si rien n'est fait : la preuve par bancs n'est pas jouée |
| A-2 | neuve | Lancer la construction du suivi | manuelle_utilisateur | decision | relire `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112e.md`, puis écrire « exécute le prompt » | si rien n'est fait : le suivi reste une règle écrite qui ne tourne pas |
| A-3 | TF-2026 | Revoir la règle de régression de la boucle de relecture | auto_ia | gate_gouvernance : revue de l'essai datée du 16/11 | revue de l'essai de la boucle L99, constat du 12/11 joint à TF-2026 dans `todo/TODO.jsonl` | si rien n'est fait : la règle livrera encore une passe moins bonne que la suivante |

## 9. Traces

- Revue : `output/03-etudes/Digit-AI - Revue - Prompt suivi d avancement des agents passe au crible L99 - 20261112a.md`, et son journal `.boucle.json`.
- Prompt réécrit : `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112e.md`.
- Relecture d'intention : RI-20261112-12, puis sa passe 1.
