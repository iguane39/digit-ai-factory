---
destinataire: humain
---

# Synthèse Mandat — campagne du matin reprise et close, 2 restes avancés (13/10/2026)

## 0. Synthèse d'ouverture

Vos réponses 1a et 4a sont appliquées. Le pilot est publié, et le harnais refusera à partir du 20/10 toute recette verte qui ne prouve pas qu'elle sait refuser un cas fautif. Les 2 décisions sur le relecteur sont reposées plus simplement ci-dessous : le « relecteur » n'est pas une personne, c'est une IA à qui l'on fait jouer le lecteur auquel le texte s'adresse. Une dernière question porte sur la publication des 3 enregistrements faits depuis votre feu vert.

## 1. En-tête d'identification

- **quoi** — mandat : « Avance sur tous les TODOs démarrés ce matin et interrompus », puis vos réponses « 1a, 2 pas compris, 3 pas compris qui est relecteur ?, 4a ».
- **sur quoi** — pilot `digit-ai-factory`, publié jusqu'à `efb3c06a`, puis `0a88a65c` et `f4a94bff` en local ; forge `digit-ai-forge-agents`, `9366b4d`, publiée.
- **quand** — 2026-10-13, de 17:39 à 19:55 UTC+02:00 (Europe/Paris), heure relevée par `date` à 19:50.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), avec 2 agents plus tôt dans la soirée (1 Sonnet, 1 Opus) ; escalade : aucune.
- **intention** — que rien de ce que la campagne du matin avait commencé ne reste suspendu sans le dire. **Test rétro** : servie ; chaque sujet de la campagne porte au registre son statut réel et l'acteur qui doit agir.

## 2. Verdict en une ligne

**TENU — 58 sujets sur 58 consignés, TF-1245 clos ; pilot publié `3ae01d60..efb3c06a` (rev-list 0 0) ; harnais 208/208, sens rouge 195/195, contrôle des cas rouges bloquant au 2026-10-20.**

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent la suite :
- la publication de la décision appliquée ce soir attend D-5 ;
- la construction du relecteur attend D-2.

D-1 et D-4, posées à 19:16 et répondues « a » à 19:20, sont exécutées.

> **D-5 — Faut-il publier les 3 enregistrements faits depuis votre feu vert sur le dépôt `digit-ai-factory` ?**
> Rappel : 2 portent votre décision sur le contrôle des cas rouges (`oracles/self-tests.mjs` et le registre), le troisième vient de la session d'installation (`installer.ps1`, seconde tentative sur échec réseau). Le hook de publication exige un feu vert par envoi.
> Recommandation : publier ; harnais 208/208 sur cet état.
> Source consultée : `git rev-list --left-right --count HEAD...@{u}` → 3 0 à 19:51.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier les 3 enregistrements | simple × court | aucune |
| (b) attendre | nul | l'autre poste ne verra pas le contrôle bloquant |

Si rien n'est décidé : la règle bloquante ne s'applique que sur ce poste.

> **D-2 — Faut-il ajouter une relecture par une IA qui joue le lecteur visé, telle que la décrit `output/03-etudes/20261013-etude-opportunite-juge-de-comprehension.md` ?**
> Rappel en clair : le « relecteur » n'est pas une personne. C'est une IA, une instance de Claude, à qui l'on dit « tu es un directeur sans formation technique » (le lecteur prévu par le document), et à qui l'on fait redire chaque phrase avec ses propres mots. Si elle n'y arrive pas, la phrase est signalée comme incompréhensible. C'est votre proposition du 26/09 : « un persona pour ce type de texte qui ne veut rien dire ».
> Ce que l'étude a mesuré : sur 22 textes du pilot, 4 avaient été jugés incompréhensibles par vous. Les contrôles actuels n'en trouvent aucun. Une seule IA en trouve 2, mais signale aussi à tort 3 à 8 textes clairs sur 18. Quand 2 IA doivent être d'accord pour signaler, elle en trouve toujours 2, et seulement 2 signalements à tort sur 18.
> Recommandation : l'ajouter avec 2 IA qui doivent être d'accord, en simple signalement au début, sans jamais bloquer la remise ; revue le 2026-11-10.

| Option | Coût | Exclusions |
|---|---|---|
| (a) ajouter la relecture à 2 IA, en signalement seulement | moyen × court | ne bloque rien avant une mesure sur 100 textes |
| (b) l'ajouter et bloquer la remise dès maintenant | moyen × court | environ 1 texte clair sur 9 serait bloqué à tort |
| (c) ne rien ajouter | nul | les textes incompréhensibles pour leur lecteur continuent de partir |

Si rien n'est décidé : seuls un glossaire et les listes de mots interdits jugent si un texte est compris.

> **D-3 — Quand ces 2 IA bloquent sur la même phrase, faut-il vous la montrer avant la remise du document, sans bloquer la remise, dans le dépôt `digit-ai-factory` ?**
> Rappel en clair : chez un produit, une carte d'une présentation a été jugée floue 3 fois par cette relecture, puis remise telle quelle au motif que la réécrire « changerait un fait », sans dire lequel. Vous l'avez trouvée incompréhensible après coup. Une autre règle proposée, « si les 2 IA ne sont pas d'accord, la phrase est floue », a été mesurée : elle signale à tort 9 textes clairs sur 18 sans trouver un texte de plus.
> Recommandation : quand la relecture repose la même question d'une lecture à l'autre, cette question vous est montrée avant la remise ; et un refus de réécrire doit citer le fait qu'il protège.

| Option | Coût | Exclusions |
|---|---|---|
| (a) vous montrer la question répétée, sans bloquer | simple × court | une phrase floue peut encore partir, mais vous le savez avant |
| (b) bloquer dès que les 2 IA ne sont pas d'accord | moyen × moyen | 9 signalements à tort sur 18 mesurés |
| (c) ne rien changer | nul | le cas de la carte remise 2 fois peut se reproduire |

Si rien n'est décidé : cette question attend la réponse à D-2, dont elle dépend.

## 4. Traité — avec sa preuve

Depuis la synthèse de 19:16, vos 2 réponses ont été exécutées.

- **Publication du pilot** (réponse 1a) : les 15 enregistrements en avance sont publiés, la synthèse comprise.
  - preuve : `git push` → « 3ae01d60..efb3c06a HEAD -> main », `rev-list` 0 0, feu vert cité dans `FORGE_PUSH_GO`.
- **Contrôle des cas rouges bloquant** (réponse 4a, TF-1245 corrigé) : à partir du 2026-10-20, une recette verte qui ne nomme aucun cas rouge met le harnais en échec ; d'ici là, l'avertissement donne cette date.
  - preuve : recette `oracles/lib-sens-rouge.test.mjs` 20 → 23 cas ; bascule neutralisée par mutation → FAIL, restaurée → PASS ; harnais 208/208, sens rouge 195/195.

- **Travail de plus tôt dans la soirée** : 57 clôtures de la campagne écrites au registre, TF-1589 repris et publié dans la forge des agents, 35 recettes triées, étude du relecteur livrée, recette d'installation déclarée.
  - preuve : `journaliser.mjs` PASS avant et après ; recette du socle 555/555 ; sens rouge 160/195 → 195/195 ; `oracle-etude-opportunite` PASS ; `oracle-empreintes` FAIL → PASS.

## 5. Non traité — avec son motif

- Le branchement du contrôle des redirections Windows dans les réglages du pilot (TF-1584) — motif : `decision`, posée ce matin sous D-74, inchangée.
- Les 3 contradictions de doctrine sur les dimensions d'audit (TF-1212) — motif : `decision`, elles relèvent de la doctrine.
- Le réglage d'effort des 2 profils du poste (TF-1557) — motif : `decision`, c'est votre réglage et il augmente la dépense.
- L'étape 2 de l'étude du rendement des sessions (TF-1552) — motif : `decision`, environ 70 exécutions de modèle, soit une dépense.
- La reprise des sidecars chez Produit-02 (TF-1602) — motif : `hors_mandat`, c'est un geste du produit à sa prochaine remise.

## 6. Écarts à la lettre

- **Votre réponse disait** « 4a », bloquant pour toute recette neuve → **le contrôle bloque toute recette sans cas rouge, ancienne ou neuve** → **pourquoi** : les 195 recettes existantes sont déjà en règle, donc seules une recette neuve ou une régression peuvent être refusées ; distinguer les anciennes n'aurait servi qu'à laisser passer une régression.
- **La demande disait** « tous les TODOs démarrés ce matin » → **les 27 sujets en cours plus anciens, qui attendent un produit, un autre poste ou une échéance, n'ont pas été touchés** → **pourquoi** : ils n'ont pas été interrompus, leur action est écrite au registre depuis 10:54.

## 7. Risques

- Le 2026-10-20, une recette ajoutée d'ici là sans cas rouge nommé fera échouer le harnais.
  - signal : la ligne « [SENS ROUGE] … AVERTISSEMENT jusqu'au 2026-10-20 » apparaît au harnais ;
  - parade : la ligne nomme chaque recette en cause, et une phrase « cas rouge : … » dans sa sortie suffit à la régler.
- Une recette réécrit la page `output/03-etudes/20260919-etude-opportunite-plan-d-amelioration-post-audit.html` à chaque passage du harnais.
  - signal : ce fichier apparaît modifié après chaque harnais ;
  - parade : laissé tel quel, non enregistré.

## 8. Prochaines actions

Les actions suivantes dépendent de vos décisions ; aucune n'est en cours.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier les 3 enregistrements avec la citation de votre feu vert | `auto_ia` | `neuve` | `dependance_bloc_3` — attend D-5 | l'autre poste ne voit pas le contrôle bloquant |
| **A-2** | Ajouter la relecture à 2 IA dans `digit-ai-forge-agents`, en signalement | `auto_ia` | TF-1392 | `dependance_bloc_3` — attend D-2 | le sujet reste en cours |
| **A-3** | Répondre, par exemple « D-5 a, D-2 a, D-3 a » | `manuelle_utilisateur` | `neuve` | `decision` | rien ne se publie ni ne se construit |

## 9. Traces

`oracles/lib-sens-rouge.mjs`, `oracles/self-tests.mjs`, `todo/TODO.jsonl`, `output/03-etudes/20261013-etude-opportunite-juge-de-comprehension.md`, journaux `/c/tmp/c17/st-d4.out` et `/c/tmp/c17/push-pilot2.out`.
