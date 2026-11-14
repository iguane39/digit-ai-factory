# Retours forges — factory-digit-ai-fr — 20261114c

- **Contexte** : ouverture du run de version `forge-digit-ai-fr-20261114a`, 14/11/2026. L'écrivain du ledger a perdu l'identifiant du run à l'entrée d'ouverture.
- **Références ledger** : forge/ledger.jsonl seq 64.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'entrée `run_open` a été écrite avec `--run <identifiant>`, comme le champ `run` des ouvertures précédentes. `forge/ledger.py` retire cette option pour choisir un ledger d'archive, sans rien dire : l'entrée 62 est sortie sans identifiant de run, rectifiée par l'entrée 63.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-3 : l'écrivain du ledger avale l'identifiant d'un run qu'on ouvre.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-3 | **mineur** | générique | **`ledger.py` retire `--run` de la ligne de commande, même sur un `run_open`, et n'écrit pas le champ `run`.** Preuve : `python forge/ledger.py run_open --run forge-digit-ai-fr-20261114a …` a produit l'entrée 62 sans clé `run` ; le code (bloc `if "--run" in a`) consomme l'option comme sélecteur d'archive. Aucun message. | Sur un `run_open`, écrire `--run` comme champ `run`, ou refuser la commande en le disant. |

## La règle qui aurait évité le retour

RP-3 : aucune règle ne couvre une option de l'écrivain qui change de sens selon le type d'entrée. Classe proposée, à créer au pilot : clé `ecrivain-ledger-option-avalee`, famille `tracabilite-ledger`, libellé « L'écrivain du ledger consomme une option de commande sans l'écrire ni le dire ».

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
