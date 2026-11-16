# Retours forges — digit-ai-marketing — 20261112f

- **Contexte** : autre — rectification du lot `digit-ai-marketing - RETOURS - 20261112e`, remis le 12/11/2026 pendant la revue L99 du prompt de publication LinkedIn des clips de la Factory.
- **Références ledger** : `forge\ledger.jsonl` seq 734 (entrée `type: rectification`, qui vise le retour seq 731).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 2 appels d'`allouerIndice` sur `output/03-publications` au jour 20261112, l'un en portée par défaut, l'autre en portée `dossier`. Ce lot remonte 1 retour, qui remplace RP-214 du lot 20261112e.

---

## Pilot (`digit-ai-factory`)

RP-214 décrivait l'allocateur comme aveugle aux autres radicaux ; il ne l'est que dans sa portée par défaut.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-215 | mineur | générique | **Rectification de RP-214 : seule la portée par défaut d'`allouer-indice.mjs` rend un indice que R-4 refuse.** Faits : depuis TF-1450, `porte: "dossier"` (CLI `--porte dossier`) compte tous les fichiers du dossier qui portent le jour ; le 12/11/2026 sur `output/03-publications`, cette portée rend « b », la portée par défaut « a », lettre déjà prise par un clip du même jour (`allouer-indice.mjs`, lignes 35 à 43). RP-214 affirmait le contraire ; un relecteur aveugle l'a démenti, la session l'a recompté. Le défaut qui reste : la valeur par défaut est `prefixe` alors que R-4 juge l'indice par dossier, et une consigne qui nomme l'outil sans l'option tombe dans la collision. (ledger seq 734) | Classer RP-214 sans suite. Faire de `porte: "dossier"` la valeur par défaut, ou faire refuser à l'outil une lettre déjà prise dans le dossier par un autre radical. Classe : `allocateur-aveugle-a-la-regle-qu-il-sert` proposée au lot 20261112e, à rattacher à TF-1450. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-215 | `grep '"TF-1450"' todo/TODO.jsonl` | 3 | TF-1450, corrigé : il a ajouté l'option `porte: "dossier"` sans en faire la valeur par défaut |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La relecture aveugle de la boucle L99 a démenti une prémisse du prompt réécrit et, par ricochet, un retour remis à la Factory dans le même tour.

## Ordre recommandé

1. RP-215, à lire avant RP-214.

## La règle qui aurait évité le retour

Le recompte d'une note avant de la remonter (TF-2202) : RP-214 a repris le constat d'un vérificateur sans lire l'en-tête complet du script.
