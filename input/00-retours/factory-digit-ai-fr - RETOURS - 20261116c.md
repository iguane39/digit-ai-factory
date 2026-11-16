# Retours forges — factory-digit-ai-fr — 20261116c

- **Contexte** : hors run, revue L99 en mode boucle du prompt « version traduite du site en six langues, SEO et GEO », à la demande du créateur du 16/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 427.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le mode boucle du skill d'analyse de prompt s'est ouvert d'office, parce que le prompt réécrit lancera un run qui écrit du code. Il a lancé deux relecteurs aveugles en arrière-plan. Le tour s'est clos sur un message d'attente, et le hook de fin de tour l'a refusé : blocs de restitution absents (S1), décision sans options (S4). Le score mesuré n'existait pas encore, donc aucune restitution complète n'était possible.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-86 : le skill d'analyse de prompt ne dit pas quoi rendre entre le lancement des relecteurs et leur retour.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-86 | **mineur** | générique | **Le mode boucle de `prompt-analyzer-l99` lance ses relecteurs aveugles en arrière-plan, et le SKILL.md (point 12) prescrit seulement une restitution préjugée, à l'affichage de la revue. Le tour qui attend les relecteurs a été refusé par le hook de fin de tour le 16/11/2026 (S1 et S4), même classe que la leçon L-006 (TF-1947).** Preuve : ledger du produit, entrée 427 ; refus du hook Stop dans la session du 16/11/2026 vers 13:43. | Ajouter au point 12 du SKILL.md : après le lancement des relecteurs, rendre un point d'étape préjugé, dont le bloc 2 nomme la mesure attendue (score des relecteurs) et l'outil (`oracle-boucle-l99.mjs`), jamais un message d'attente. |

## La règle qui aurait évité le retour

- RP-86 : classe à créer `skill-boucle-sans-point-d-etape` : un skill qui lance des agents en arrière-plan ne prescrit pas la forme du tour qui les attend.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
