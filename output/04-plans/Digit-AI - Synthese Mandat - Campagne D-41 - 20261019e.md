---
destinataire: humain
---

# Synthèse Mandat — campagne D-41 (a), suites des études des favoris TikTok, 19/10/2026

## 0. Synthèse d'ouverture

La campagne que vous avez lancée est faite : 12 des 15 suites des études sont réalisées, vérifiées et publiées dans 3 forges. Les forges SEO, de conception et de design ont désormais leurs nouveaux référentiels et leurs nouvelles règles, et le pilot porte 6 améliorations en local. 3 suites attendent un choix qui vous revient : l'assouplissement d'une porte de sécurité, la propagation aux postes et aux produits, et le sort d'un skill qui vit hors de la Factory. La 4e attendue, l'essai vidéo, patiente jusqu'à la prochaine mise en production, comme prévu.

## 1. En-tête d'identification

Exécution de la décision D-41 option (a) : 15 candidats tirés des 14 études du 19/10, dans le pilot `digit-ai-factory` et les forges `digit-ai-forge-seo-geo`, `digit-ai-forge-design`, `digit-ai-forge-conception` et `digit-ai-forge-agents`. Période : 19/10/2026 de 17:50 à 19:30, heure de Paris (UTC+02:00), heure de fin relevée par `date`. Session pilote Claude Opus 5.5 ; 5 agents `campagne` sur Sonnet, effort high ; 2 agents `verificateur` pour la relecture de la consigne et de la cohérence.

Intention de la demande : faire exécuter les suites des 14 études, les plus utiles d'abord, sans laisser aucun candidat sans traitement.

Test rétro : le résultat sert cette intention. Chacun des 15 candidats est soit clos sur un gain constaté, soit arrêté sur un obstacle nommé qui vous est posé.

## 2. Verdict en une ligne

12 candidats sur 15 clos en « corrigé », 2 en attente de votre décision, 1 en attente d'une mise en production ; 13 commits, dont 7 publiés dans 3 forges ; toutes les recettes rejouées au vert.

## 3. Décisions attendues

Les 3 bloquants qui retiennent la campagne sont posés ci-dessous, chacun dans sa décision. La publication du pilot reste en attente.

- **Porte de sécurité des agents** : le calibrage est arrêté ; il faut votre accord pour requalifier la fixture qui juge dangereux tout agent portant Bash ; sans réponse, la porte reste rouge sur toute la flotte.
- **Propagation des skills modifiés** : l'installation sur le poste est arrêtée ; il faut votre choix entre propager tout de suite ou passer d'abord en avertissement ; sans réponse, le poste garde les anciennes versions.
- **Skill LinkedIn** : la correction est arrêtée, faute de source dans les dépôts ; il faut votre choix de rattachement ; sans réponse, la règle sans source reste en service.

**D-38** : publication du pilot sur GitHub, posée le 19/10 à 12:08, inchangée.

> **D-43 — Faut-il requalifier la fixture de sécurité qui juge dangereux tout agent portant Bash, pour calibrer oracle-scan-agentdef ?**
>
> De quoi s'agit-il : la porte de sécurité des agents `oracle-scan-agentdef.mjs`, qui vit dans `digit-ai-forge-agents-security` ; son self-test impose que la fixture `rouge-bash-seul.yaml` reste rouge.
>
> Le problème : la porte rend FAIL sur les 5 agents de la flotte sur 5, et sur 55 des 71 agents d'Everything Claude Code ; elle ne distingue donc plus un agent ordinaire d'un agent dangereux.
>
> Pourquoi vous : requalifier cette fixture assouplit une porte de sécurité, ce qu'aucun agent ne fait sans votre accord.
>
> **Recommandation : (a).** Source consultée : la mesure de l'agent de campagne du 19/10 à 18:26, 5 FAIL sur 5, et l'étude `output\03-etudes\20261019-etude-opportunite-packs-agents-skills-tiers.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Requalifier : Bash seul passe, Bash avec une capacité dangereuse réelle reste rouge | Un agent de flotte ordinaire passe ; les fixtures rouges de combinaison dangereuse restent rouges | Simple × court | Annuler le commit dans la forge |
| (b) Garder la porte et exiger une dérogation écrite pour chaque agent qui porte Bash | Les 5 agents de la flotte reçoivent une dérogation datée | Simple × court | Retirer les dérogations |
| (c) Ne rien changer | La porte reste rouge sur toute la flotte | Nul | Sans objet |

> **Sans réponse** : (c), la porte reste telle quelle.

> **D-44 — Faut-il propager maintenant aux skills installés les modifications de conception et de design, sachant que 6 produits verront le contrôle de surface échouer tant qu'ils n'écartent pas les 3 nouveaux éléments ?**
>
> De quoi s'agit-il : les copies installées de `qualifie-l-entrant`, `enumere-la-surface`, `redige-les-exigences`, `derive-les-vues` et `systeme-de-marque`, que `node oracles/oracle-skills.mjs` déclare divergentes de leurs sources publiées.
>
> Le problème : le contrôle de surface de `digit-ai-forge-conception` 1.5.0 exige 16 éléments au lieu de 13 ; 6 produits dont le référentiel en porte 13 rendraient FAIL à leur prochain run de conception.
>
> Pourquoi vous : la propagation touche les produits, et l'outil demande une décision explicite avant `--appliquer`.
>
> **Recommandation : (b).** Source consultée : le rapport de l'agent de la forge de conception, qui relève les 6 produits par recherche texte, et `oracles\oracle-skills.mjs`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Propager tout de suite, par `node oracles/oracle-skills.mjs --appliquer` joué par moi | Les postes ont les nouvelles versions ; les 6 produits échouent au contrôle de surface jusqu'à ce qu'ils écartent les 3 éléments | Simple × court | Réinstaller les versions précédentes |
| (b) Rendre d'abord les 3 nouveaux éléments avertissants jusqu'au 30/11, puis propager | Aucun produit n'échoue ; chacun voit l'avertissement et a 6 semaines pour trancher | Simple × court | Remettre la règle bloquante |
| (c) Ne pas propager | Les postes gardent les anciennes versions et le contrôle des skills reste rouge | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est propagé.

> **D-45 — Faut-il corriger le skill linkedin-post-generator sur le compte claude.ai, ou le déclarer hors de la Factory ?**
>
> De quoi s'agit-il : le skill `linkedin-post-generator`, dont la seule copie est synchronisée depuis votre compte claude.ai, hors de tout dépôt de `C:\dev`.
>
> Le problème : sa page `references/algorithme-best-practices.md` affirme « 70 % de la portée totale » en une heure sans source, ce que `references\RUN-RESEAU.md` refuse dans un skill.
>
> Pourquoi vous : le skill vit sur votre compte, et le rattacher ou non à la Factory est un choix de périmètre.
>
> **Recommandation : (a).** Source consultée : recompté par moi à 19:33, `grep` des `SKILL.md` nommés `linkedin-post-generator` dans les dépôts `C:\dev\digit-ai-*` rend 0 fichier, et l'item TF-1157 qui le disait déjà hors de toute forge.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Le déclarer hors de la Factory et le signaler dans le référentiel des runs de réseau | Le skill reste tel quel, mais un run de réseau sait que ses chiffres ne sont pas sourcés | Simple × court | Retirer la mention |
| (b) Le reprendre dans `digit-ai-forge-agents` comme source versionnée, corrigée | La règle sans source est retirée et le skill passe sous les contrôles des forges | Moyen × court | Retirer le skill de la forge |
| (c) Ne rien faire | La règle sans source reste dans le skill | Nul | Sans objet |

> **Sans réponse** : (c), le skill reste tel quel.

## 4. Traité

La campagne a exécuté 12 candidats, vérifié chaque livraison, clos les items au registre et publié 3 forges.

- **12 candidats clos en « corrigé ».** `node todo/journaliser.mjs` a écrit 14 événements, `verdict_apres` PASS, après une première tentative refusée par la règle R16 du registre (2 items en cours sans motif d'attente), rouge puis vert.
- **Recettes rejouées par moi après les agents.** Forge SEO : 243 cas sur 243. Forge de design : self-test tout vert, 56 oracles. Forge de conception : self-test vert, exit 0. Pilot : `relever-flotte` 16 PASS, `relever-contexte-sessions` 10 PASS, `oracle-ecriture` 37 cas sur 37.
- **3 forges publiées.** `git rev-list --left-right --count HEAD...@{u}` rend 0 et 0 après envoi pour `digit-ai-forge-seo-geo` (2 commits), `digit-ai-forge-design` (3 commits) et `digit-ai-forge-conception` (2 commits).
- **Relevé de flotte depuis le début de la campagne.** 35 appels d'agents, 100 % vers un agent nommé, les 3 critères tenus.
- Relecture d'intention : sert pour la consigne, consignée sous RI-20261019-21, et sert pour la cohérence des livrables, sous RI-20261019-24. Le seul écart, mineur et de votre ressort : 2 fiches du pilot attribuent à votre réponse « 41a » le choix de l'option de leur étude, alors que vous avez décidé d'exécuter le candidat qui la portait.

Les 12 suites réalisées, par dépôt :

| Dépôt | Candidat | Réalisé | Commit |
|---|---|---|---|
| `digit-ai-forge-seo-geo` | TF-1901 | Référentiel daté des gestes Google vérifiés | 9f165c7 |
| `digit-ai-forge-seo-geo` | TF-1902 | Comptes alignés sur les 89 nœuds de la grille | 8e85e5c |
| `digit-ai-forge-design` | TF-1912 | Annonces de 2 skills absents retirées | f649f01 |
| `digit-ai-forge-design` | TF-1904 | 3 règles de mouvement en avertissement | 6c5a6b1 |
| `digit-ai-forge-design` | TF-1911 | 7 règles tirées des skills tiers, avec attribution | 5f278a2 |
| `digit-ai-forge-conception` | TF-1906 | Cadre juridique des logiciels compilés | 69d6b02 |
| `digit-ai-forge-conception` | TF-1908 | Surface implicite portée de 13 à 16 éléments | 4de419f |
| pilot | TF-1907 | Pic de simultanéité au relevé de flotte | 6e6782f2 |
| pilot | TF-1900 | Fiche du jeton d'abonnement | 5eac9085 |
| pilot | TF-1913 | Poids des skills mesuré, veille des 3 dépôts | 8c5cdc7d |
| pilot | TF-1909 | Limite du pilotage d'écran écrite | 2baf3665 |
| pilot | TF-1905 | Revue datée des listes de tournures | b5e501c0 |

La partie pilot de TF-1908, le `Sitemap` en adresse complète du gabarit `robots.txt`, est au commit b218e0d2.

## 5. Non traité

Ces éléments restent ouverts ; les 2 premiers sont arrêtés et leurs bloquants sont posés au bloc 3.

- **TF-1914, porte de sécurité des agents** — motif : dependance_bloc_3, l'item vise `digit-ai-forge-agents-security` et requalifier sa fixture attend D-43.
- **TF-1910, skill LinkedIn** — motif : dependance_bloc_3, aucune source éditable sous `C:\dev`, attend D-45.
- **La propagation des skills modifiés** — motif : dependance_bloc_3, attend D-44.
- **TF-1903, essai de vidéo de lancement** — motif : decision, votre option (a) le fait attendre la prochaine mise en production d'un produit.
- **La publication du pilot** — motif : decision, déjà posée en D-38 ; le pilot porte 16 commits locaux et le distant en a 1 de plus.
- **`decisions\REGISTRE.jsonl` et `todo\relectures-intention.jsonl`** — motif : hors_mandat, ils portent aussi des lignes d'autres sessions.
- **Les constats signalés par les agents** — motif : decision, ils entrent au registre à la prochaine revue : 2 lignes de la grille SEO encore à 87, un faux positif de la règle SA1 sur `one-time-code`, 2 défauts préexistants de la recette globale du pilot.

## 6. Écarts à la lettre

Vous avez demandé d'exécuter les 15 candidats. 12 sont faits, 3 ne le sont pas, pour un motif nommé au bloc 5. TF-1914 avait été attribué par erreur à `digit-ai-forge-agents` : l'agent l'a établi sans rien forcer. Les agents ont déclaré leurs propres écarts, comme une section juridique de 24 lignes là où l'étude en annonçait 8, ou des règles de design restreintes pour limiter le bruit.

## 7. Risques

- **Les règles de design neuves sont bavardes.**
  - Énoncé : M10, M11 et R14 lèvent des avertissements sur 600 à 1 000 pages des autres dépôts.
  - Signal : des avertissements ignorés dans les revues de design.
  - Parade : la revue du 16/11 retire toute règle dont la moitié des avertissements n'est pas confirmée.
- **L'usage professionnel d'un abonnement Claude personnel reste ouvert.**
  - Énoncé : la fiche du jeton consigne que les conditions grand public d'Anthropic excluent un usage commercial.
  - Signal : le compte du poste est un abonnement Max personnel.
  - Parade : faire lire les conditions par un conseil, ou passer à une offre Team, qui est une dépense.

## 8. Prochaines actions

Vos 3 réponses viennent d'abord, parce que chaque action qui suit en dépend.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1914 | Calibrer la porte de sécurité des agents selon l'option retenue | auto_ia | dependance_bloc_3 : attend D-43 | `node oracles/self-test.mjs` dans `digit-ai-forge-agents-security` | La porte reste rouge sur toute la flotte |
| **A-2** | TF-1908 | Propager les skills modifiés, après le passage éventuel en avertissement | auto_ia | dependance_bloc_3 : attend D-44 | `node oracles/oracle-skills.mjs --appliquer` | Les postes gardent les anciennes versions |
| **A-3** | TF-1910 | Appliquer le choix sur le skill LinkedIn | auto_ia | dependance_bloc_3 : attend D-45 | `node todo/journaliser.mjs --fichier <maj.json>` | La règle sans source reste en service |
| **A-4** | `neuve` | Trancher D-43, D-44 et D-45 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `43a 44b 45a` | Les 3 suites restent en attente |

## 9. Traces

- `todo\TODO.jsonl`, TF-1900 à TF-1914, 29 événements du 19/10
- `todo\relectures-intention.jsonl`, RI-20261019-21 et RI-20261019-24
- `decisions\REGISTRE.jsonl`, D-43 à D-45 réservées à 19:20
- Commits publiés : 9f165c7 et 8e85e5c, f649f01, 6c5a6b1 et 5f278a2, 69d6b02 et 4de419f
- Commits locaux du pilot : 6e6782f2, 5eac9085, 8c5cdc7d, 2baf3665, b5e501c0 et b218e0d2
