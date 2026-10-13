---
destinataire: humain
---

# Synthèse Mandat — campagne du matin reprise et close, relecteur du lecteur visé construit (13/10/2026)

## 0. Synthèse d'ouverture

Vos réponses 5a, 2a et 3a sont appliquées. La relecture par 2 IA qui jouent le lecteur visé existe désormais : elle signale une phrase seulement quand les 2 IA ne savent pas la redire, et elle ne bloque jamais une remise. Quand la même question revient d'une relecture à l'autre, elle est marquée « à vous montrer avant la remise ». Le refus de réécrire une phrase « parce que cela changerait un fait » doit désormais citer ce fait. La forge des agents est publiée et l'outil est installé sur votre poste. Une seule question reste : publier les 5 enregistrements du pilot faits depuis votre dernier feu vert.

## 1. En-tête d'identification

- **quoi** — mandat : « Avance sur tous les TODOs démarrés ce matin et interrompus », puis vos réponses « 1a, 4a » et « 5a, 2a, 3a ».
- **sur quoi** — forge `digit-ai-forge-agents`, `d75bda9` et `7e60830`, publiés ; pilot `digit-ai-factory`, publié jusqu'à `4536d105`, puis 5 enregistrements en local dont la fusion de `bf8ab1c9`.
- **quand** — 2026-10-13, de 17:39 à 21:15 UTC+02:00 (Europe/Paris), heure relevée par `date` à 21:10.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), avec 3 agents dans la soirée (1 Sonnet, 2 Opus) ; escalade : aucune.
- **intention** — que rien de ce que la campagne du matin avait commencé ne reste suspendu sans le dire, puis appliquer vos décisions. **Test rétro** : servie ; chaque sujet porte au registre son statut réel, et votre proposition du 26/09 d'un « persona » est construite.

## 2. Verdict en une ligne

**TENU — TF-1394 clos, TF-1392 construit et en attente de sa mesure au 2026-11-10 ; recette quality-oracles 476 PASS, harnais du pilot 208/208 ; forge publiée (rev-list 0 0), pilot en avance de 5.**

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient la suite : la publication du pilot attend D-6.

D-5, D-2 et D-3, posées à 19:55 et répondues « a » à 20:00, sont exécutées.

> **D-6 — Faut-il publier les 5 enregistrements du pilot `digit-ai-factory` faits depuis votre feu vert de 20:00 ?**
> Rappel : ils portent vos décisions du soir sur le relecteur (`oracles/oracle-ecriture.mjs`, `references/ECRITURE.md`), le registre et un index régénéré. Le hook de publication exige un feu vert par envoi.
> Recommandation : publier ; harnais 208/208 sur cet état.
> Source consultée : `git rev-list --left-right --count HEAD...@{u}` → 5 0 à 21:10.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier les 5 enregistrements | simple × court | aucune |
| (b) attendre | nul | l'autre poste ne voit pas la règle du sujet nommé ni le registre à jour |

Si rien n'est décidé : ces 5 enregistrements restent sur ce poste.

## 4. Traité — avec sa preuve

Depuis la synthèse de 19:55, vos 3 réponses sont exécutées.

- **Publication du pilot** (réponse 5a) : les 4 enregistrements en avance sont publiés, la synthèse comprise.
  - preuve : `git push` → « 03cc4af5..4536d105 HEAD -> main », `rev-list` 0 0.
- **Relecture par 2 IA qui jouent le lecteur visé** (réponse 2a, TF-1392) : `oracle-judge --lecteur-vise` dans quality-oracles 2.17.0, un constat retenu seulement si les 2 IA refusent, verdict toujours PASS. Au pilot, la règle du sujet nommé avertit quand une question de décision d'un document ne nomme rien.
  - preuve : recette quality-oracles 470 → 476 contrôles PASS, dont 12 cas à double sens sans appel de modèle, mutation rouge ; `oracle-ecriture` 24/24 ; bruit de la règle du sujet nommé 0 sur 411 documents ; skill installé en 2.17.0 dans les 2 profils, `oracle-skills` PASS.
- **Question répétée et motif cité** (réponse 3a, TF-1394 corrigé, recette rouge → vert) : une question reposée sur une phrase déjà refusée est marquée « à montrer à l'humain avant la remise » ; un refus de réécrire qui ne cite pas ce qu'il protège est signalé.
  - preuve : sens rouge et sens vert joués dans la même recette, 476 PASS ; forge publiée `9366b4d..7e60830`, `rev-list` 0 0.
- **Travail de plus tôt dans la soirée** : 57 clôtures de la campagne au registre, TF-1589 repris et publié, 35 recettes triées, contrôle des cas rouges bloquant au 2026-10-20, étude du relecteur livrée.
  - preuve : `journaliser.mjs` PASS avant et après ; sens rouge 160/195 → 195/195 ; `oracle-etude-opportunite` PASS.

## 5. Non traité — avec son motif

- La mesure de la relecture sur 100 textes, dont 10 refusés par un humain, avant toute bascule en blocage — motif : `decision`, la bascule vous reviendra à la revue du 2026-11-10.
- Le branchement du contrôle des redirections Windows dans les réglages du pilot (TF-1584) — motif : `decision`, posée ce matin sous D-74, inchangée.
- Les 3 contradictions de doctrine sur les dimensions d'audit (TF-1212) — motif : `decision`, elles relèvent de la doctrine.
- Le réglage d'effort des 2 profils du poste (TF-1557) — motif : `decision`, c'est votre réglage et il augmente la dépense.
- L'étape 2 de l'étude du rendement des sessions (TF-1552) — motif : `decision`, environ 70 exécutions de modèle, soit une dépense.

## 6. Écarts à la lettre

- **Votre réponse disait** « 2a », la forme recommandée par l'étude → **la règle du sujet nommé ne juge pas les synthèses de fin de tour** → **pourquoi** : une règle existante les tient déjà, et la variante qui les jugeait avertissait sur 48 synthèses sur 243, dont une décision tranchée sans difficulté.
- **L'étude citait** le gabarit de revue de lecture du socle des pages → **il n'a pas reçu de section « lecteur visé »** → **pourquoi** : cela touchait un second skill ; le mode d'emploi du relecteur renvoie vers ce gabarit.

## 7. Risques

- La règle du sujet nommé n'a été mesurée que sur 5 documents qui portent une question de décision.
  - signal : un avertissement qui accuse une question pourtant claire ;
  - parade : elle n'avertit que, et la revue du 2026-11-10 porte aussi sur elle.
- Une recette réécrit la page `output/03-etudes/20260919-etude-opportunite-plan-d-amelioration-post-audit.html` à chaque passage du harnais.
  - signal : ce fichier apparaît modifié après chaque harnais ;
  - parade : laissé tel quel, non enregistré.

## 8. Prochaines actions

Une action attend votre décision, une autre son échéance.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier les 5 enregistrements avec la citation de votre feu vert | `auto_ia` | `neuve` | `dependance_bloc_3` — attend D-6 | ils restent sur ce poste |
| **A-2** | Mesurer la relecture sur 100 textes et rendre la décision de bascule | `auto_ia` | TF-1392 | `borne_atteinte` — échéance du 2026-11-10 | la relecture reste un signalement |
| **A-3** | Répondre « D-6 a » ou « D-6 b » | `manuelle_utilisateur` | `neuve` | `decision` | rien ne se publie |

## 9. Traces

`todo/TODO.jsonl`, `oracles/oracle-ecriture.mjs`, `references/ECRITURE.md`, quality-oracles `scripts/lib/lecteur-vise.mjs` et `references/lecteur-vise.md`, journaux `/c/tmp/c18/st.out` et `/c/tmp/c18/push-fa.out`.
