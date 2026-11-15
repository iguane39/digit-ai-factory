---
destinataire: humain
---

# Synthèse Mandat — skills propagés, ménage, tri et alertes expliquées (15/11/2026)

## 0. Synthèse d'ouverture

Les 3 actions demandées sont faites. Les 11 skills installés sur ce poste sont à jour, et le contrôle de propagation rend PASS. Les 2 dossiers restés sur le disque sont supprimés. Les 12 sujets candidats sont décidés, car aucun ne relevait de vous. L'explication des alertes est ci-dessous, avec une décision : je vous recommande de cacher les fixtures à l'hébergeur plutôt que de fermer les alertes une à une, parce qu'une vraie alerte future se noierait parmi 190 fausses.

Livré : [Synthèse du 15/11, skills, ménage, tri et alertes](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Skills%20propages%2C%20menage%2C%20tri%20et%20alertes%20expliquees%20-%2020261115a.md)

## 1. En-tête d'identification

Exécution de votre réponse « A1, A3, A4 + explique A2 » à la synthèse 20261114e, sur le pilot `digit-ai-factory` et ce poste. Synthèse relevée le 15/11/2026 à 08:36, heure de Paris (`date`). Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : remettre le poste à jour, faire le ménage, trier les sujets nés de la campagne et comprendre le geste des alertes avant de le décider.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Les skills installés ne divergent plus de leur source, les dossiers restés sont retirés, chaque candidat a un statut motivé, et vous pouvez trancher les alertes sans autre lecture.

## 2. Verdict

`oracle-skills` PASS, 0 divergence (11 avant) ; 2 dossiers supprimés, 0 trace dans git ; 12 candidats décidés, registre PASS (`node todo/oracle-todo.mjs`).

## 3. Décisions attendues

Une décision vous revient : comment traiter les alertes de l'hébergeur (votre A-2).

Bloquants de ce tour, chacun avec ce qui le lève :
- Les 190 alertes de dépendances restent affichées sur forge-websec et forge-agents : votre réponse à D-220 ci-dessous les lève.
- Les 12 sujets décidés attendent leur correction : la règle du tri prévoit de les corriger dans le même tour, mais vous avez demandé le tri seul ; votre « A1 » ci-dessous lève ce bloquant, par une campagne.

**Ce que sont ces alertes.** L'hébergeur lit les fichiers qui listent les bibliothèques d'un dépôt (les manifestes) et signale chaque bibliothèque dont une version connue est vulnérable. 2 forges gardent exprès de tels fichiers : ce sont des fixtures, des exemples piégés qui prouvent que leur contrôle des dépendances dit bien « échec » devant une version vulnérable (Django 1.4, lodash 4.17.15, requests, flask). Rien de cela n'est installé ni exécuté. L'hébergeur ne fait pas la différence : 155 alertes sur forge-websec, dont 18 critiques, et 35 sur forge-agents. L'agent du lot les a relevées le 14/11 : aucune ne vient d'un fichier hors des fixtures.

**Pourquoi ce n'est pas un risque, mais un défaut quand même.** Aucune alerte ne désigne un code qui tourne. Mais 190 fausses alertes rendent la liste illisible : le jour où une vraie bibliothèque du dépôt devient vulnérable, son alerte arrive au milieu des autres.

**Pourquoi je ne l'ai pas fait seul.** Fermer une alerte, c'est écrire chez l'hébergeur, hors du dépôt : la règle de publication exige votre GO pour tout geste sur un service hébergé.

> **D-220 — Comment traiter les 190 alertes de dépendances que l'hébergeur affiche sur forge-websec et forge-agents, toutes portées par des fixtures volontairement vulnérables ?**
> - **De quoi s'agit-il** : les manifestes de fixtures sont déclarés dans `fixtures/sca/FIXTURES-VULNERABLES.json` (forge-websec) et `.claude/skills/quality-oracles/references/fixtures-vulnerables.json` (forge-agents) ; la recette de chaque forge tient cette liste exacte.
> - **Le problème** : l'hébergeur lit ces manifestes comme des dépendances réelles ; ses alertes ne distinguent pas les fixtures.
> - **Pourquoi vous** : 2 des 3 voies écrivent chez l'hébergeur ou y laissent un état visible ; c'est un choix sur ce qui s'y publie.
> - **Recommandation : (a)** — elle supprime la cause au lieu de l'effet : les vieilles versions des fixtures reçoivent de nouvelles failles publiées, et chacune rouvrirait une alerte sous (b). Source consultée : le relevé de l'agent du lot ws (`gh api repos/<propriétaire>/digit-ai-forge-websec/dependabot/alerts`, 14/11).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Cacher les fixtures à l'hébergeur | les manifestes de fixtures prennent un nom que l'hébergeur ne lit pas (par exemple `requirements.fixture.txt`) ; la recette les recopie sous leur vrai nom dans un dossier temporaire avant de jouer le contrôle ; l'hébergeur ne voit plus de manifeste et devrait clore les alertes de lui-même, à vérifier au relevé suivant | 1 lot par forge, par un agent, publié sous le mandat permanent des forges | renommer les fichiers |
| (b) Fermer les alertes une à une | 190 appels à l'hébergeur depuis cette session, motif « risque toléré : fixture de test » | quelques minutes ; chaque faille publiée plus tard sur ces versions rouvre une alerte (fréquence non mesurée) | rouvrir les alertes |
| (c) Laisser en l'état | rien ne change | une vraie alerte future arrive noyée parmi 190 | trancher à tout moment |

> **Sans réponse** : les alertes restent affichées, sans risque réel ; la question revient à la prochaine synthèse.

## 4. Traité

- A-1 : les 11 skills (quality-oracles, forge-agents, experts-forge, prompt-analyzer-l99, digit-ai-page-html, digit-ai-schemas, systeme-de-marque, studio-de-direction, critique-le-design, ameliore-le-design, redige-les-exigences) sont remis à niveau par `node oracles\oracle-skills.mjs --appliquer`, puis l'oracle rejoué sans option rend PASS.
  - Les recettes des dépôts qui consomment ces skills ont été rejouées avant et après : forge-tests, forge-data et forge-audit PASS les 2 fois ; forge-design INDÉTERMINÉ les 2 fois, sa recette dépassant le délai de 600 s du rejeu (elle était verte au rejeu complet du 14/11).
  - Les sources copiées sont lues dans les clones de `C:\dev\digit-ai-factory\.claude\worktrees\` ; vérifié : ces clones sont propres et au même commit que les forges publiées (fa881de, 7bf0b3e, 25ab9fe).
- A-3 : `C:\dev\_wt-fb` et `C:\dev\_wt-pilot-pg` sont supprimés. Ils étaient tenus par 2 commandes `python3` lancées le 14/11 à 17:48 par les agents des lots fb et pg, figées depuis ; je les ai arrêtées, et les 2 agents confirment qu'elles n'écrivaient rien.
- A-4 : les 12 candidats TF-2567 à TF-2578 sont décidés sous R-58 (la règle du tri : ce qui ne touche ni dépense, ni publication, ni geste irréversible, ni doctrine, ni arbitrage, ni produit se décide sans vous). Les 12 sont des corrections techniques de recettes ou d'oracles ; aucun ne double un sujet ouvert.

Relecture d'intention : sans objet, motif : ce tour n'écrit aucune consigne d'agent.

## 5. Non traité

- La correction des 12 sujets décidés — motif : `garde_fou`, vous avez demandé le tri ; je la propose en A-1.
- Les alertes de l'hébergeur — motif : `dependance_bloc_3`, D-220.

## 6. Écarts à la lettre

- A-4 disait « trier » : la règle du tri décide aussi, sans vous, ce qui ne relève pas de vous ; les 12 sont donc passés en « décidé », et non laissés en proposition.
- Le skill de tri de sujets n'a pas servi : il trie des sujets d'étude, pas des candidats du registre ; j'ai suivi la règle du registre.

## 7. Risques

- La mise à jour des skills lit encore ses sources dans les anciens clones de `.claude\worktrees`, et non dans `C:\dev` ; signal : un écart de commit entre les deux, que l'ouverture de session ne contrôle pas ; parade : supprimer ces anciens clones, le geste proposé le 14/11 dans la synthèse 20261114b.

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Corriger les 12 sujets décidés TF-2567 à TF-2578 par une campagne | neuve | auto_ia | garde_fou : périmètre demandé | votre « A1 » | ils attendent la prochaine demande « TODOs et retours » |
| A-2 | Appliquer l'option retenue de D-220 | neuve | auto_ia | dependance_bloc_3 : D-220 | votre réponse à D-220 | les 190 alertes restent affichées |

## 9. Traces

Registre `todo\TODO.jsonl` (12 décisions R-58) ; journal de propagation `~\.claude\propagations-skills.jsonl` (entrées du 15/11 à 08:11) ; numéro D-220 réservé au registre des décisions.
