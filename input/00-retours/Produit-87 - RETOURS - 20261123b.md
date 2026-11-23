# Retours forges — Produit-87 — 20261123b

- **Contexte** : autre — retour du porteur sur le rapport d'audit POC-to-Prod de Prism livré le 23/11/2026 (indice c), hors run.
- **Références ledger** : sans objet, aucun run ouvert.
- **Références hors run** : `forge/hors-run.jsonl` seq 5 (entrée `type: retour`, TF-2260).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>\input\00-retours\_arrivee\` par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : a_remettre

Ce lot porte **1 retour**, qui suit un retour humain : le porteur a vu à l'écran un texte corrompu que quatre portes avaient laissé passer.

## digit-ai-forge-audit (`digit-ai-forge-audit`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-5 | majeur | générique | **Un rapport d'audit au texte corrompu a passé toutes les portes.** Le rapport `Client-A - PRM - Rapport d'audit POC-to-Prod - 20261123c.html` portait 6 273 séquences d'UTF-8 relu en Windows-1252 (« statuÃ©es », « DÃ‰COMPTÃ‰ »), et ses données 2 696. Le porteur les a vues à l'écran. Avant la livraison, quatre contrôles les avaient laissées passer : `verifier-rapport.mjs` (exit 0), la porte du client `verifier-rapport-audit.mjs` (CONFORME), `verifier-rapport-html.mjs` (aucune erreur d'encodage) et `oracle-caracteres-controle` de la critique d'implémentation (PASS). Cause : un `Get-Content` sans `-Encoding` puis un `Set-Content`, sous Windows PowerShell 5.1, pour changer une lettre du constructeur de données. Le fichier a été relu en Windows-1252 et réécrit en UTF-8. Correction : opération inverse vérifiée contre l'indice b, puis indice d ; 0 séquence sur 52 fichiers après correction. | Règle qui aurait évité le retour : la classe `texte-corrompu-non-detecte` existe au registre, mais aucune porte de forge-audit ne l'applique. Pistes : 1) `verifier-rapport.mjs` et `verifier-rapport-html.mjs` refusent les séquences `Ã[\x80-\xBF]`, `Â[\x80-\xBF]`, `â€` et U+FFFD, dans les données comme dans le rendu ; 2) `oracle-caracteres-controle` les ajoute à sa liste ; 3) fixture : un `rapport-data.json` passé par `Get-Content | Set-Content` sous PowerShell 5.1 est refusé. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-5** : classe `texte-corrompu-non-detecte`, déjà au registre, sans juge dans les portes de forge-audit ni dans la critique d'implémentation. La consigne de l'outil PowerShell (« pass -Encoding utf8 explicitly to Out-File/Set-Content ») couvrait l'écriture, pas la lecture par `Get-Content`.

## Rattachement

Registre interrogé le 23/11/2026 dans `todo/CLASSES.json` du pilot, par les mots « encod », « utf », « 1252 », « caract » : `texte-corrompu-non-detecte` décrit le même défaut, observé sur un document relu par l'oracle d'écriture. Ce retour en est une récidive sur une autre famille de portes.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Indice c du rapport corrompu, déjà livré | Constructeur réparé par réencodage inverse, contrôlé contre l'indice b (5 phrases témoins identiques, aucun « ? » introduit) ; indice d rendu et porte du client rejouée (CONFORME) ; indice c rangé sous `old/` | oui | remonté en RT-5 |
| Changement de lettre fait au shell | Les éditions suivantes passent par l'outil d'édition, qui garde l'UTF-8 | oui | couvert par RT-5 (une porte qui refuse vaut mieux qu'une consigne d'outil) |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - PRM - Rapport d'audit POC-to-Prod - 20261123c.html` | gd-rapport-audit-poc-to-prod · 1.0.2 | un contrôle d'encodage avant diffusion | accents illisibles à l'écran ; le porteur a demandé « pourquoi ça n'a pas été vu ? » | rien | générique (voir RT-5) |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `build-rapport --copie-output` a rangé l'indice c sous `old/` sans rien remplacer, et l'indice b, produit avant l'incident, a servi de référence pour contrôler la réparation.

## Ordre recommandé

1. **RT-5** : une seule expression régulière dans deux portes, et le défaut ne peut plus atteindre un lecteur.
