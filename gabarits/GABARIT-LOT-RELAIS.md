# Gabarit d'un lot de retours — relais vers le pilot

Ce fichier ne porte pas le gabarit : il dit où le lire (TF-1821, 15/10/2026). Le gabarit d'un lot
de retours vit au pilot, sous `gabarits/RETOURS-FORGES.md`, et s'y lit à chaque lot. Une règle
publiée au pilot s'applique donc au lot suivant sans recopie, et ce relais ne change pas d'une
version du gabarit à l'autre : le dépôt du produit le commet une fois.

## Où est le pilot

Le premier dossier existant de cette liste, dans cet ordre (le même que `forge/retours/oracle-lot.mjs`) :

1. `$FORGE_ROOT/digit-ai-factory` ;
2. le dossier `digit-ai-factory` voisin de ce produit ;
3. `c:/dev/digit-ai-factory` ;
4. `~/.digit-ai-forge/digit-ai-factory`.

## Ce qui se lit au pilot

Deux pièces s'ouvrent au pilot pour écrire un lot, sous ces chemins relatifs à sa racine :

| Pièce | Chemin au pilot |
|---|---|
| Le gabarit du lot : sections, sidecar, statut, remise au sas | `gabarits/RETOURS-FORGES.md` |
| Le référentiel des classes de défaut, dont la `classe` du sidecar est une clé | `todo/CLASSES.json` |

## Ce qui se joue chez le produit

- `node forge/retours/oracle-lot.mjs "<lot>.md"` juge la forme du lot avant sa remise, avec les règles du pilot.
- Pilot introuvable : le lot ne s'écrit pas de mémoire. Installer la factory (`AGENTS.md`, phase 0) ou exporter `FORGE_ROOT`.
