# Retours forges — Produit-82 — 20261014e

- **Contexte** : fin de la phase P4 du brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, essai de restauration sur Railway, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 46, 47
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour complète RT-7 du lot `20261014d` pour le registre des garde-fous de plateforme.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-8 | mineur | générique | Le 14/10/2026, la CLI Railway 5.68.0 refuse à un agent la suppression d'un fichier de volume : « Refusing: agents cannot delete files. Ask a human to run… ». Sous Git Bash, un chemin distant `/sauvegardes/x` devient `C:/Program Files/Git/sauvegardes/x` sans `MSYS_NO_PATHCONV=1`, et deux envois ont atterri sous ce chemin. Ledger seq 46, 47. | Inscrire les deux contraintes au registre ; tout runbook Railway d'un produit dit qui supprime, et pose `MSYS_NO_PATHCONV=1` sous Git Bash. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Trois fichiers parasites sur le volume `postgres-volume` de la recette | suppression laissée à l'humain, commandes données à la restitution | oui | remonté sous RT-8 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Nouveau garde-fou, heurté le 14/10/2026 :

- plateforme : Railway, CLI 5.68.0 ;
- mécanisme : détection d'un agent par la CLI ;
- effet : refus (« agents cannot delete files ») de toute suppression de fichier de volume demandée par un agent ;
- portée : `railway volume files delete`, quel que soit le jeton ;
- ce qu'il vise : les suppressions irréversibles faites par un agent ;
- ce qu'il refuse : la suppression d'un fichier de volume sans geste humain ;
- date du relevé : 14/10/2026, ledger seq 46.

## Confirmations positives

- La restauration dans une base temporaire du service PostgreSQL a rendu les mêmes comptes que la base de l'instance.

## Ordre recommandé

1. RT-8 : il évite de laisser des fichiers parasites qu'un agent ne peut pas retirer.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain. RT-8 relève de la classe proposée au lot `20261014d` : **RT-8** : `garde-fou-plateforme-decouvert-au-deploiement`, famille `heritage-produit`, libellé « Une contrainte de plateforme connue d'aucun registre se découvre par essais au premier déploiement d'un produit ».
