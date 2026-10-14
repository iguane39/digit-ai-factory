# Retours forges — Produit-80 — 20261012c

- **Contexte** : clôture des tests du run de version 20261012-hub-version-1. Le lot 20261012b était déjà remis quand l'audit 15 a rendu ce retour ; il n'est pas modifié.
- **Références ledger** : `forge\ledger.jsonl` seq 341 (audit 15 et reprise ciblée), 342 (retour), 343 (clôture des tests).
- **Remise au pilot** : copie dans `<pilot>\input\00-retours\_arrivee\`, avec le sidecar du même nom.
- **Statut** : remis le 12/10/2026

---

## Tests (`digit-ai-forge-tests`)

Sur un code backend identique, un audit a mesuré 5 pans et le suivant les a perdus, à cause d'un délai que le projet ne peut pas régler.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-3 | majeur | générique | `forge_tests/execution.py` ligne 240 fixe `timeout=900` pour la suite backend sous coverage. Audit 14 : api 675/675, data 582/583, migrations 66/66. Audit 15 et sa reprise `--reprendre`, sur un backend identique (`git diff --stat 7b527c2 72ea65a -- backend` vide) : api, data, migrations, batch et fichiers « non mesurés, délai de 900 s dépassé ». La suite seule prend 398 s sur le poste. Preuve : `forge\etapes\tests\rapport-20261012c.json`, `rapport-20261012d.json`, `rapport-20261012e.json` ; ledger seq 341 et 342. | Règle qui aurait évité le retour : aucune. Piste : un réglage du délai dans `.env.forge-tests`, ou un délai proportionné à la durée de la suite seule, avec la durée atteinte écrite dans le motif. |

Classe proposée pour RT-3 : `reglage-projet-ignore-par-la-forge`, déjà proposée par RT-2 du lot 20261012b ; ici le réglage n'existe pas du tout.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Clôture des tests sur une mesure composite (audit 15 pour le front, l'interface, la qualification et les prompts ; audit 14 pour les pans backend) | déclarée au ledger seq 343, avec la preuve que le backend n'a pas changé | non | contournement local, en attendant RT-3 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La reprise ciblée `--reprendre` a rejoué les seuls pans non mesurés en 15 minutes, sans remonter la pile.

## Ordre recommandé

1. RT-3 : tant que le délai est fixe, chaque audit de ce produit peut perdre ses pans backend.

## Note de réception du pilot (14/10/2026)

Le lot a été refusé à la porte le 14/10/2026 : ses classes ne figurent pas au référentiel `todo/CLASSES.json`. Le pilot les fait entrer par la voie prévue pour un défaut neuf (TF-1128) : `"classe": "classe-a-creer"` avec la classe proposée ci-dessous, rangée dans une famille existante. La classe se crée au référentiel à l'instruction du retour.

- `reglage-projet-ignore-par-la-forge` — famille `contrat-interface-forge` ; libellé : digit-ai-forge-tests : le délai de 900 s de la suite backend sous coverage est fixé dans le code, sans réglage du projet (avant la note : classe « reglage-projet-ignore-par-la-forge » portée directement, inconnue du référentiel).
