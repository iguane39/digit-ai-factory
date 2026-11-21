# Retours forges — factory-digit-ai-fr — 20261115za

- **Contexte** : run `forge-digit-ai-fr-20261114a`, vérification de la reprise du travail de la v2 sur un autre poste : clone neuf du dépôt GitHub, restauration par le canal R-64, puis comparaison des pages servies avec ce poste.
- **Références ledger** : forge/ledger.jsonl seq 399.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le clone neuf passait tous les tests, mais il servait 14 pages de la v2 différentes de ce poste. Les seules différences étaient les empreintes de version de 3 feuilles et scripts (`?v=<sha des octets>`) : le clone extrayait ces fichiers en LF, ce poste les avait en CRLF. Il a fallu ajouter un `.gitattributes`, puis réextraire l'arbre de ce poste, pour obtenir 27 pages et 28 ressources identiques octet pour octet.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-76 : le socle produit ne fixe pas les fins de ligne, et un même commit s'extrait différemment selon le poste.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-76 | **mineur** | générique | **Le socle produit ne pose pas de `.gitattributes`. Sous Windows (`core.autocrlf=true`), les fins de ligne extraites varient d'un poste et d'une écriture à l'autre, et une application qui calcule l'empreinte de ses ressources sur leurs octets sert, pour le même commit, des pages différentes selon le poste.** Preuve : `forge/ledger.jsonl` du produit, entrée 398 ; `.gitattributes` du produit (commit `da07d8b`) ; `git ls-files --eol` avant correction : 262 fichiers stockés en LF et extraits en CRLF sur ce poste. | Ajouter au gabarit du socle produit un `.gitattributes` « * text=auto eol=lf », binaires déclarés ; et ajouter au contrôle de reprise R-64 (`oracle-reprise.mjs`) un essai qui compare l'arbre extrait d'un clone neuf à celui du poste. |

## La règle qui aurait évité le retour

- RP-76 : classe à créer `socle-fins-de-ligne-non-fixees` — le socle produit ne fixe pas les fins de ligne, et un même commit s'extrait différemment selon le poste.

## Remarques restées au produit

- Le produit porte désormais son `.gitattributes`, et son arbre est réaligné. Généralisable : oui, à tout produit développé sous Windows ; cause générale RP-76.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
