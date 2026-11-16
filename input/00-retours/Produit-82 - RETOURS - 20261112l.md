# Retours forges — Produit-82 — 20261112l

- **Contexte** : clôture des corrections n° 2 avant recette et vérification par la session ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 237, 238, 239, 240
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : ses trois retours restent au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le parcours navigateur passait ses mots de passe en élément séparé, en local et dans le déployeur de recette ; argparse sort en exit 2 quand la valeur commence par un tiret, 2 fois sur 9 `make test` (seq 238) | forme `--option=valeur` aux deux sites, et un contrôle qui refuse toute liste d'arguments séparant encore l'option de sa valeur (commit 9754ff0) | non, défaut propre au code du produit | corrigée |
| Le double de test du cas HTTP 404 du balayage laissait la clé dans la console (seq 239) | double rendu fidèle par l'agent de correction n° 2 (commit 61dda38) | non | corrigée |
| Trois tests sautent encore quand un montage manque, hors de la liste de l'item 6 (seq 240) | non corrigée : sans effet sur la pile de `make test`, où ils ne sautent pas | non | reportée à une version ultérieure |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- L'agent de correction n° 2 a signalé le défaut du parcours navigateur au lieu de le corriger hors consigne ; la session a trouvé le second site, dans le déployeur, en recensant les appels.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucune correction humaine. La règle qui les aurait évités : quand un défaut est corrigé à un endroit, ses autres occurrences se recensent dans tout le dépôt au même moment.
