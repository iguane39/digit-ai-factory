---
destinataire: humain
---

# Synthèse Mandat — campagne du matin reprise et close, 2 restes avancés (13/10/2026)

## 0. Synthèse d'ouverture

La campagne lancée ce matin sur vos 58 candidats est close. La session s'était arrêtée à 14:08 avec un agent encore au travail et les clôtures rédigées, mais jamais écrites au registre : 57 sujets restaient « décidés » sans le dire. Ils sont maintenant consignés, 49 corrigés et 8 en cours avec leur action. Le travail de l'agent interrompu est repris, vérifié et publié dans la forge des agents. Les 2 restes que la session pouvait porter ont avancé : toutes les recettes du pilot nomment désormais un cas rouge lisible, et l'étude du relecteur qui joue le lecteur visé est livrée. Il vous reste 4 décisions, dont le feu vert de publication du pilot : le hook de publication l'a refusée sans lui.

## 1. En-tête d'identification

- **quoi** — mandat : « Avance sur tous les TODOs démarrés ce matin et interrompus ».
- **sur quoi** — pilot `digit-ai-factory` (fusions `baf7d493` et `3b5e37dd`, registre `22cee592`, `14154c4c` et `b220821c`, non publiés) ; forge `digit-ai-forge-agents` (`23cdf03`, `9366b4d`, publiés).
- **quand** — 2026-10-13, de 17:39 à 19:16 UTC+02:00 (Europe/Paris), heure relevée par `date` à 19:11.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), avec 2 agents (1 Sonnet pour le tri des recettes, 1 Opus pour l'étude) ; escalade : aucune.
- **intention** — que rien de ce que la campagne du matin avait commencé ne reste suspendu sans le dire. **Test rétro** : servie ; chaque sujet de la campagne porte au registre son statut réel et l'acteur qui doit agir.

## 2. Verdict en une ligne

**TENU en local — 58 sujets sur 58 consignés (50 corrigés, 8 en cours), `oracle-todo` PASS avant et après ; harnais du pilot 208/208 après correction, sens rouge 195/195 ; publication du pilot en attente de votre feu vert.**

## 3. Décisions attendues de l'humain

Les 3 bloquants qui retiennent la suite :
- la publication du pilot attend D-1 ;
- la construction du relecteur attend D-2 ;
- le passage du contrôle des cas rouges en refus attend D-4.

> **D-1 — Faut-il publier les 14 enregistrements en avance du pilot `digit-ai-factory` ?**
> Rappel : le hook pre-push du dépôt `digit-ai-factory` a refusé l'envoi faute d'un feu vert humain cité. Les 14 enregistrements portent la clôture de la campagne, le tri des recettes, l'étude, et aussi l'installation Windows de la session de 18:14 (`installer.ps1`, `AGENTS.md`).
> Recommandation : publier ; le harnais complet est vert et le registre passe son oracle.
> Source consultée : sortie du hook pre-push du 13/10 à 19:10, `/c/tmp/c17/push-pilot.out`.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier les 14 enregistrements | simple × court | aucune |
| (b) attendre une relecture des enregistrements de la session d'installation | simple × court | l'autre poste reste sur l'état du matin |

Si rien n'est décidé : tout reste sur ce poste, et l'autre poste ne voit ni le registre clos ni l'étude.

> **D-2 — Faut-il construire en avertissement le relecteur décrit par `output/03-etudes/20261013-etude-opportunite-juge-de-comprehension.md` ?**
> Rappel : l'étude livrée ce soir mesure, sur 22 textes réels du pilot, que les juges actuels ne trouvent aucun des 4 textes que leur lecteur humain a refusés. Un relecteur qui redit chaque texte en une phrase en trouve 2, avec 2 refus à tort sur 18 quand 2 relecteurs doivent s'accorder.
> Recommandation : construire la forme à 2 relecteurs qui s'accordent, chargée par `oracle-judge`, en avertissement, revue le 2026-11-10.
> Source consultée : l'étude elle-même, `oracle-etude-opportunite` PASS sur ses 10 règles.

| Option | Coût | Exclusions |
|---|---|---|
| (a) construire à 2 relecteurs, en avertissement | moyen × court | aucun blocage avant une mesure sur 100 textes |
| (b) construire et bloquer tout de suite | moyen × court | 11 % de refus à tort, mesurés sur 18 textes seulement |
| (c) laisser en attente | nul | des textes incompris de leur lecteur continuent de partir |

Si rien n'est décidé : le sujet reste en cours, et la règle du vocabulaire du lecteur garde pour seul juge un glossaire.

> **D-3 — Faut-il faire remonter à l'humain la question qu'un relecteur répète, sans bloquer la remise d'un document du dépôt `digit-ai-factory` ?**
> Rappel : la même étude réfute la règle « un désaccord entre relecteurs vaut flou » : elle porte les refus à tort à 9 sur 18 sans trouver un texte de plus.
> Recommandation : remonter la question répétée avant la remise, et exiger qu'un motif « changerait un fait » cite ce fait.
> Source consultée : `output/03-etudes/20261013-etude-opportunite-juge-de-comprehension.md`, section des implications.

| Option | Coût | Exclusions |
|---|---|---|
| (a) remontée de la question répétée et citation du fait, sans blocage | simple × court | un passage flou peut encore partir, mais l'humain le sait |
| (b) blocage sur flou, 2 relecteurs, un désaccord vaut flou | moyen × moyen | 9 refus à tort sur 18 mesurés |
| (c) laisser en attente | nul | le cas de la carte remise 2 fois peut se reproduire |

Si rien n'est décidé : le sujet attend la construction du relecteur.

> **D-4 — Faut-il rendre bloquant le contrôle des cas rouges de `oracles/self-tests.mjs` ?**
> Rappel : I6 (l'invariant du harnais qui lit les cas rouges) avertit aujourd'hui. Après le tri de ce soir, 195 recettes vertes sur 195 nomment un cas rouge lisible ; pour 6 d'entre elles, ce cas est un signalement et non un refus.
> Recommandation : le rendre bloquant pour toute recette neuve, après 7 jours de grâce, comme la porte des lots depuis ce matin.
> Source consultée : sortie du harnais du 13/10 à 19:09, ligne « [SENS ROUGE] 194/195 », puis la recette d'installation corrigée.

| Option | Coût | Exclusions |
|---|---|---|
| (a) bloquant après 7 jours de grâce | simple × court | une recette neuve sans cas rouge nommé est refusée |
| (b) rester en avertissement | nul | une recette qui ne sait pas refuser peut entrer au vert |

Si rien n'est décidé : I6 reste un avertissement, et le taux peut redescendre sans que rien ne s'arrête.

## 4. Traité — avec sa preuve

La session du matin s'était arrêtée en attendant un agent ; voici ce qui a été repris, puis ce qui a avancé.

- **Socle des pages 1.28.1 (TF-1589)** : l'agent interrompu avait laissé une classe d'artefact `source-machine` non enregistrée. Une page lue par une machine se déclare, et 3 mesures écrites pour un lecteur humain sont nommées au périmètre de non-mesure au lieu d'être exemptées à la main.
  - preuve : diff relu, recette du socle 546 → 555 cas, 555/555 après fusion ; `git push` de `digit-ai-forge-agents` exit 0, `rev-list` 0 0 ; `oracle-skills` PASS, version 1.28.1 lue dans les 2 profils installés.
- **Registre de la campagne** : les 56 clôtures rédigées ce matin, plus celle de TF-1589, sont écrites.
  - preuve : `journaliser.mjs` verdict PASS avant et après, 57 événements ; avec TF-1553 clos à 12:56, 58 sujets sur 58.
- **Recettes du pilot (TF-1245)** : 35 recettes sans cas rouge lisible, lues une par une. 5 ne jouaient que l'état conforme et gagnent un vrai cas rouge, 30 avaient un cas rouge nommé autrement et le nomment désormais.
  - preuve : chaque cas neuf vérifié rouge par mutation ; harnais 160/195 → 195/195 recettes lisibles ; cliquet relevé.
- **Étude du relecteur (TF-1392, TF-1394)** : livrée sous `output/03-etudes/`, sur un corpus de 22 textes réels et 66 lectures.
  - preuve : `oracle-etude-opportunite` PASS, `oracle-ecriture` PASS, relecture par un tiers sans écart de calcul ; coût mesuré 199 541 jetons.
- **Harnais du pilot de nouveau vert** : la recette d'installation de cet après-midi hachait un fichier sans déclaration, et `oracle-empreintes` rougissait le harnais.
  - preuve : site déclaré dans `references/EMPREINTES.md` et marque de ligne posée ; `oracle-empreintes` FAIL → PASS ; recette d'installation 17/17.

## 5. Non traité — avec son motif

- Le branchement du contrôle des redirections Windows dans les réglages du pilot (TF-1584) — motif : `decision`, posée ce matin sous D-74, inchangée.
- Les 3 contradictions de doctrine sur les dimensions d'audit (TF-1212) — motif : `decision`, elles relèvent de la doctrine.
- Le réglage d'effort des 2 profils du poste (TF-1557) — motif : `decision`, c'est votre réglage et il augmente la dépense.
- L'étape 2 de l'étude du rendement des sessions (TF-1552) — motif : `decision`, environ 70 exécutions de modèle, soit une dépense.
- La reprise des sidecars chez Produit-02 (TF-1602) — motif : `hors_mandat`, c'est un geste du produit à sa prochaine remise.

## 6. Écarts à la lettre

- **La demande disait** « tous les TODOs démarrés ce matin » → **j'ai traité la campagne de 11:30 et ses restes, pas les 27 sujets en cours plus anciens qui attendent un produit, un autre poste ou une échéance** → **pourquoi** : ceux-là n'ont pas été interrompus, ils attendent un acteur extérieur, et leur action est écrite au registre depuis 10:54.
- **La demande disait** « avance » → **l'étude n'a pas été rendue en page HTML** → **pourquoi** : aucune étude livrée depuis le 19/09 n'en porte, et son oracle passe sur le Markdown.

## 7. Risques

- Les index de dossier modifiés par les sessions de l'après-midi ont été mis en réserve avant la fusion, puis régénérés.
  - signal : une ligne d'index qui manquerait pour une synthèse de l'après-midi ;
  - parade : la réserve reste dans `git stash list`, sous « index generes avant fusion camp1013e » ; `readme-dossiers` PASS au harnais.
- La page `output/03-etudes/20260919-etude-opportunite-plan-d-amelioration-post-audit.html` est réécrite par une recette à chaque passage du harnais, d'où une modification que personne n'a voulue.
  - signal : ce fichier apparaît modifié après chaque harnais ;
  - parade : laissé tel quel, non enregistré ; à corriger dans la recette du générateur de pages d'étude.

## 8. Prochaines actions

Les actions qui suivent dépendent de vos décisions ; aucune n'est en cours.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier le pilot avec la citation de votre feu vert | `auto_ia` | `neuve` | `dependance_bloc_3` — attend D-1 | l'autre poste reste sur l'état du matin |
| **A-2** | Construire le relecteur à 2 voix dans `digit-ai-forge-agents`, en avertissement | `auto_ia` | TF-1392 | `dependance_bloc_3` — attend D-2 | le sujet reste en cours |
| **A-3** | Faire passer I6 en bloquant après 7 jours de grâce | `auto_ia` | TF-1245 | `dependance_bloc_3` — attend D-4 | le contrôle reste un avertissement |
| **A-4** | Répondre aux 4 décisions, par exemple « D-1 a, D-2 a, D-3 a, D-4 a » | `manuelle_utilisateur` | `neuve` | `decision` | rien ne se publie ni ne se construit |

## 9. Traces

`todo/TODO.jsonl`, `references/EMPREINTES.md`, `scripts/installer-projet.test.mjs`, `output/03-etudes/20261013-etude-opportunite-juge-de-comprehension.md`, journaux `/c/tmp/c17/st-final.out` et `/c/tmp/c17/push-pilot.out`.
