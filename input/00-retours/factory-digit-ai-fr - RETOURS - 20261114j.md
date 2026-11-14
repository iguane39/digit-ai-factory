# Retours forges — factory-digit-ai-fr — 20261114j

- **Contexte** : remplace le lot 20261114i, refusé à la porte pour deux familles de classe inconnues. revue L99 d'un prompt sur la qualité des agents de la boucle de relecture, 14/11/2026. Deux frictions sont apparues : une ligne trompeuse du relevé des boucles, et une restitution affichée sans préjugement.
- **Références ledger** : forge/ledger.jsonl seq 89, 90.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Pour vérifier la prémisse « le score plafonne vers 80 », la session a joué le relevé des journaux de boucle du skill `prompt-analyzer-l99`. La sortie affichait « gain médian : 7 », puis, à la ligne suivante, « gain médian < 3 points → le mode redevient optionnel ». La règle n'était pas déclenchée, mais elle se lisait comme un verdict. La revue L99 a ensuite été affichée en chat sans passer par le gabarit de restitution. Le hook de fin de tour l'a refusée, d'où un doublon à l'écran.

---

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Ce chapitre porte un retour, RA-2 : le relevé des boucles imprime sa règle de revue sans condition.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RA-2 | **mineur** | générique | **`releve-boucles.mjs` imprime « gain médian < 3 points → le mode redevient optionnel » même quand le gain médian vaut 7.** Preuve : relevé sur `c:\dev\digit-ai-factory` du 14/11/2026 à 13:00 ; ligne 56 du script, impression inconditionnelle de `regle_de_revue`. | N'afficher la règle que si le gain médian est sous 3 points. Sinon, écrire « règle de revue non déclenchée (gain médian ≥ 3) ». |

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-9 : une revue L99 rendue chez un produit n'est pas suivie d'une restitution préjugée.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-9 | **mineur** | générique | **La revue L99, rendue en 8 chapitres, a été refusée par le hook de fin de tour (S1, S4) faute de blocs de restitution et de préjugement.** Preuve : hook restitution R-44 du 14/11/2026 à 13:10, FAIL BLOQUANT. Le `SKILL.md` de `prompt-analyzer-l99` ne mentionne pas la restitution chez un produit instrumenté. | Dans le `SKILL.md` de `prompt-analyzer-l99`, rappeler que, dans un projet de la factory, la revue est suivie d'une restitution écrite dans un fichier et préjugée avant l'affichage. |

## La règle qui aurait évité le retour

RA-2 : aucune règle n'oblige un script de relevé à séparer ses constats de ses rappels de règle. Classe à créer : `releve-affiche-une-regle-comme-un-verdict`, famille `affordance-ui`.

RP-9 : la règle de restitution existe (R-44), mais le skill qui produit le plus long rendu ne la rappelle pas. Classe à créer : `restitution-non-prejugee-hors-run`, famille `restitution-forme`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : les deux constats sont remontés ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
