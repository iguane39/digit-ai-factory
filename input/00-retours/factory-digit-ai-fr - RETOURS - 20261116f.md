# Retours forges — factory-digit-ai-fr — 20261116f

- **Contexte** : hors run, demande du créateur du 16/11/2026 sur l'affichage des décisions, à la suite de la revue L99 du prompt de traduction en six langues.
- **Références ledger** : forge/ledger.jsonl seq 437, 438.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Une demande traitée en plusieurs tours a posé ses décisions en entier au premier tour, puis ne les a plus rappelées qu'en une ligne dans chaque point d'étape et dans le message final. Le créateur a dû redemander le détail. Retour, mot pour mot : « Elles sont affichées une première fois, puis l'IA recommence à travailler, réaffiche des prompts de sortie, et lors du prompt final, les décisions ne sont jamais affichées complètement, je suis obligé de redemander à chaque fois le détail des décisions. »

Dans le même tour, une décision posée sur un fait mal recompté a dû être remplacée.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte deux retours : RP-89 sur la règle d'affichage des décisions, RP-90 sur le recompte du mode boucle du skill d'analyse de prompt.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-89 | **majeur** | générique | **La règle TF-1429 de `gabarits/RESTITUTION.md` (ligne 132) impose le rappel d'une ligne d'une décision déjà posée, et S4 refuse le message sinon ; seule une demande explicite du porteur (TF-1851) rouvre le détail. Dans une demande à plusieurs tours, la décision n'apparaît donc plus qu'en une ligne au message final.** Preuve : D-229 et D-230 rappelées en une ligne, 34 occurrences dans le journal de la session précédente du produit, sans aucun affichage complet retrouvable ; le texte de D-230 n'a pu être reconstitué que depuis `forge/etapes/contenus/clips/DESCRIPTIONS-CLIPS.md` ; refus S4 du 16/11/2026 sur un rappel sans heure ni « inchangée » ; ledger du produit, entrée 437. | Le message FINAL d'une demande (restitution complète, pas un point d'étape) réaffiche au format B complet chaque décision ouverte posée pendant la session. Le rappel d'une ligne reste admis dans les points d'étape, et pour une décision d'une session antérieure s'il cite la question exacte et le fichier qui porte ses options. S4 et RÉSERVATION acceptent une décision réservée reposée en entier. |
| RP-90 | **mineur** | générique | **Au mode boucle de `prompt-analyzer-l99`, un relecteur a affirmé « 14 clips parlés en français ». Le recompte a lu le champ `sans_parole` de `data/v2/clips.json` (14 à faux) sans lire sa règle d'écriture : le champ n'est vrai que pour une description validée, et `DESCRIPTIONS-CLIPS.md` relève « musique seule, sans parole » sur les 15 clips. Une décision, D-239, a été posée sur cette prémisse fausse, puis remplacée par D-240.** Preuve : ledger du produit, entrées 435 et 438. | Dans `references/boucle.md`, étape 3 : un recompte qui lit un champ de données lit aussi sa règle d'écriture, et croise avec une seconde source quand le champ porte un fait. |

## La règle qui aurait évité le retour

- RP-89 : classe à créer `decision-rappelee-jamais-reaffichee` : une décision posée tôt dans une demande n'est plus jamais affichée en entier au message final.
- RP-90 : classe à créer `recompte-sur-champ-mal-lu` : un recompte confirme un fait par un champ de données dont le sens n'a pas été lu.

## Remarques restées au produit

- Le champ `sans_parole` de `data/v2/clips.json` vaut « faux » pour les 14 clips dont la description n'est pas encore validée, alors qu'aucun n'a de voix. Généralisable : non, propre au flux de validation des descriptions de ce produit ; à corriger au prochain run de version.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
