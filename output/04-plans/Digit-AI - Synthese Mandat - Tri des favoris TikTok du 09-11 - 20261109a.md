---
destinataire: humain
---

# Synthèse Mandat — tri des favoris TikTok du 09/11/2026

## 0. Synthèse d'ouverture

Vos favoris TikTok du 09/11 sont triés : 6 sont neufs depuis le tri du 02/11, et 5 parlent d'IA. Aucun ne justifie une étude poussée. 2 valent un essai court, sans rien installer : l'un pour mieux repérer les interfaces qui « font IA » dans nos pages, l'autre pour alléger le relevé affiché à l'ouverture de chaque session. Vous avez 3 réponses à donner : autoriser la publication du tri, refusée sans votre accord ; dire si l'on télécharge le seul favori resté illisible ; dire si les 42 favoris déjà triés doivent être relus.

Livré : [Tri des sujets Claude et IA des favoris TikTok](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Tri%20des%20sujets%20Claude%20et%20IA%20des%20favoris%20TikTok%20-%2020261109a.md)

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory`, avec une correction dans `digit-ai-forge-agents`. Période : 09/11/2026 de 14:17 à 14:48, heure de Paris, relevée par `date`, durée 31 minutes. Session pilote Claude Opus 5.5, skill `tri-de-sujets` 1.1.0 puis 1.1.1.

Intention de la demande : savoir, parmi les favoris ajoutés depuis le dernier tri, ce qui mérite un travail pour la Factory, sans ouvrir les vidéos.

Test rétro : le tableau dit, pour chaque sujet neuf, s'il faut une étude, un essai ou rien, avec sa source et l'existant consulté.

## 2. Verdict en une ligne

Tableau à PASS par `oracle-tri-de-sujets` sur 6 entrées et 5 lignes : 2 essais courts, 1 sujet à écarter, 2 sans suite, 1 contenu non qualifié.

## 3. Décisions attendues

Un bloquant :

- **Bloqué** : la publication du tri au dépôt public du pilot. **À fournir** : votre accord explicite, par exemple « GO publication du pilot ». **Sans accord** : le tri reste sur ce poste seulement, et l'autre poste ne le voit pas.

Répondez par exemple « 182a, 184a ».

> **D-182 — Le tri peut-il télécharger le favori TikTok du 09/11 resté illisible par sa légende et sa couverture, alors que les conditions de TikTok interdisent l'extraction automatisée ?**
>
> - **De quoi s'agit-il** : un favori dont la légende renvoie seulement au lien en bio de son auteur. Sa couverture titre « 9 dépôts GitHub » et ne montre qu'un dépôt, un outil libre d'enregistrement d'écran.
> - **Le problème** : la légende et la couverture ne disent pas s'il parle d'IA. Le télécharger s'écarte des conditions de TikTok, comme vos réponses 120b et 142b l'avaient accepté pour le tri du 02/11, qui ne valent pas pour celui-ci.
> - **Pourquoi vous** : c'est une question de doctrine envers les conditions d'un tiers, et le téléchargement est irréversible.
> - **Recommandation : (a)** — les listes de dépôts vues le 19/10 et le 02/11 ont toutes fini sans suite, et 1 contenu sur 6 ne change pas le tableau. Source consultée : la rangée TikTok du tableau de `references/PLATEFORMES-RESEAUX.md`, et le tri du 02/11.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ne pas télécharger | Le contenu reste non qualifié dans le fichier de rangement, et le prochain tri le reprend | Nul | Possible : choisir (b) plus tard |
| (b) Télécharger ce seul contenu | Je le télécharge une fois, le transcris en local, le range et mets le tableau à jour à l'indice suivant | Simple × court | Impossible pour le téléchargement ; la transcription se supprime |

> **Sans réponse** : (a), rien n'est téléchargé.

> **D-184 — Faut-il relire les 42 favoris TikTok de la page du 09/11 déjà triés le 19/10 ou le 02/11, que le tri du 09/11 a laissés à leur verdict ?**
>
> - **De quoi s'agit-il** : votre demande, « Traite les favoris Tiktok », vise une page de 48 favoris. J'ai trié les 6 neufs et rappelé en chiffres le verdict des 42 autres, sans les relire.
> - **Le problème** : le relecteur d'intention, rejoué 2 fois, lit votre demande comme visant les 48, et juge la restriction aux 6 neufs comme une dérive majeure. Relire les 42 referait un travail déjà rendu les 19/10 et 02/11, dont 32 contenus écoutés ou lus sur leurs images le 02/11.
> - **Pourquoi vous** : c'est un arbitrage sur le périmètre de votre demande, que seul vous pouvez lever.
> - **Recommandation : (a)** — aucun fait neuf ne vise ces 42 favoris, et le skill de tri soustrait par conception ce qui est déjà rangé. Source consultée : `input/Tiktok/rangement-20261102.json` et l'annexe de `output/03-etudes/20261019-tri-opportunites-favoris-tiktok.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Garder leurs verdicts | Le tri du 09/11 reste tel quel, avec son rappel chiffré des 42 | Nul | Possible : choisir (b) plus tard |
| (b) Relire les 42 | Je les relis par légende, couverture et source primaire, sans téléchargement, et le tableau sort à l'indice suivant avec les sujets dont le verdict change | Moyen × court | Possible : la nouvelle version s'ignore |

> **Sans réponse** : (a), rien ne change.

## 4. Traité

Mesuré sur : la page du 09/11, le rangement du 02/11 et l'annexe du tri du 19/10, relus à 14:17, périmètre 48 favoris.

- **Périmètre.** 48 favoris et 7 liens du panneau de notifications, écartés. 32 favoris rangés le 02/11, 10 le 19/10, 6 neufs ; une recherche indépendante des identifiants redonne ces 3 nombres.
- **Lecture.** 6 contenus par leur légende et leur couverture, 3 par leur dépôt lu via l'API GitHub : `heydamir/unslop`, `Panniantong/Agent-Reach`, `deepseek-ai/dsh-superagent-prototype`. Rien n'a été téléchargé.
- **Existant.** Les 3 skills de design de la vidéo d'@unefille.ia sont déjà étudiés le 14/08 et le 19/10. Les 9 marqueurs d'`unslop` ont été comparés aux règles S1 à S10 d'`oracle-slop` : 4 couverts, 5 absents.
- **Correction en cours de lecture.** J'avais d'abord compté 4 marqueurs absents ; S7 juge les grilles de cartes, pas les éléments qui pulsent, donc 5.
- **Tableau.** `oracle-tri-de-sujets` à PASS, 6 entrées et 5 lignes ; enregistré au pilot par les commits `2db9a5a3` et `e227975c`. Le second ajoute le rappel chiffré des 42 favoris déjà triés, après la première relecture d'intention.
- **Skill `tri-de-sujets` 1.1.1.** `tri.mjs` refusait un JSON écrit par une redirection PowerShell, à cause de sa marque d'ordre d'octets. Cas rouge ajouté puis corrigé : self-test 43 sur 43. Publié dans `digit-ai-forge-agents` de `4658bdd` à `838271c`, `git rev-list` rend 0.
- **README d'`input\Tiktok\`.** Les 2 rôles manquants sont rédigés, comme l'exige le relevé d'ouverture.

Relecture d'intention : dérive, après 1 passe de correction, consignée sous RI-20261109-02 et RI-20261109-03. L'écart qui résiste porte sur le périmètre, posé en D-184 ; les autres relèvent des règles de la Factory (mandat d'écriture des forges, README) ou de vos choix (D-182, publication).

## 5. Non traité

- **Le favori illisible** — motif : decision, posée en D-182.
- **Les 2 essais courts** — motif : decision, le choix de ce qui se lance vous revient (action A-2).
- **La publication du pilot** — motif : gate_gouvernance, la porte de publication a refusé l'envoi sans votre accord.
- **La copie installée du skill** — motif : hors_perimetre, elle reste en 1.1.0 jusqu'à la prochaine ouverture de session, qui la met à jour d'elle-même.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « Traite les favoris Tiktok » | Tri des 6 favoris neufs ; les 42 autres gardent le verdict de leur tri, rappelé en chiffres dans le livrable | Ils sont déjà triés le 19/10 ou le 02/11 ; le filtre « Claude et IA » de ces tris n'a écarté aucun des 6 |

Le relecteur d'intention lit votre demande comme visant les 48 favoris : la question est posée en D-184.

## 7. Risques

- **Favoris publiés.** Une fois publié, le tableau montre 5 de vos favoris sur l'IA dans un dépôt public. Signal : votre gêne à le lire en ligne. Parade : le contenu non qualifié et le détail restent hors du dépôt.

## 8. Prochaines actions

A-1 d'abord, car tant que le pilot n'est pas publié, le tri n'existe que sur ce poste ; A-2 ensuite, parce qu'un essai se choisit sur le tableau publié.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Autoriser la publication du pilot, qui porte le tri et un commit d'une autre session sur la loi n° 8 | neuve | manuelle_utilisateur | decision : la porte de publication R-38 exige votre accord explicite | répondre « GO publication du pilot » ; la session joue alors `FORGE_PUSH_GO="<vos mots>" git push origin main` | si rien n'est fait : le tri reste sur ce poste seulement |
| A-2 | Dire quels essais lancer : `unslop` contre `oracle-slop`, le relevé d'ouverture allégé, les 2 ou aucun | neuve | manuelle_utilisateur | decision : ce qui se lance vous revient | relire la section « Les 2 essais proposés » de `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261109a.md`, puis répondre par exemple « essai unslop » | si rien n'est fait : les 2 sujets restent au tableau, sans effet |

## 9. Traces

- Tableau : `output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261109a.md`, commits `2db9a5a3` et `e227975c`, non publiés.
- Relectures d'intention : `RI-20261109-02` et `RI-20261109-03`.
- Rangement, ignoré par git : `input/Tiktok/rangement-20261109.json`.
- Skill : `digit-ai-forge-agents/.claude/skills/tri-de-sujets/`, commit `838271c`, publié.
- Décisions : `D-182` et `D-184` à `decisions/REGISTRE.jsonl`.
- Sources lues le 09/11/2026 : `https://github.com/heydamir/unslop`, `https://github.com/Panniantong/Agent-Reach`, `https://github.com/deepseek-ai/dsh-superagent-prototype`.
