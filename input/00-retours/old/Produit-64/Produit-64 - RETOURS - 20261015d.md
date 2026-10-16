# Lot de retours — Produit-64 → pilot (doublon remonté le 13/10) — 2026-10-15, indice d

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire la consigne « chercher au registre avant de remonter » et le gabarit des lots de retours.

**Origine** : session de conversation du 15/10/2026, vers 10:50 (heure de Paris), relecture du registre `todo/TODO.jsonl` pendant l'analyse L99 « IA dans le Run ».

Ce lot porte **1 retour** (RT-62).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## pilot (consigne de recherche au registre, gabarit des lots)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-62 | mineur | générique | **RT-56 du lot `20261013g` doublonne TF-1201.** Le lot déclarait « aucun item » sur le script de README lancé depuis un produit qui écrit chez le pilot. Or TF-1201 (14/09) porte exactement ce cas (« lancés depuis un dépôt produit sans --base écrivent chez le PILOT »), et TF-1667 et le commit pilot `4008bc99` du 14/10 l'ont traité. Cause : la recherche au registre avait été tronquée à 5 lignes par `head -5`, et la ligne de TF-1201 était la sixième. **RT-56 ne doit pas être ingéré comme neuf** : le rattacher à TF-1201. | La section « Rattachement » d'un lot cite la commande de recherche jouée et le nombre de lignes trouvées, sans troncature ; un « aucun item » se prouve par un compte, pas par une sortie tronquée. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-62** : classe `registre-doublon-non-detecte` — un doublon qu'une empreinte ou un compte complet aurait signalé avant la remise.

## Rattachement

Registre interrogé le 15/10/2026 (`todo/TODO.jsonl`, recherche de « readme-dossiers », sortie complète) : TF-1201 (création le 14/09), TF-1667 (correctif du 14/10, commit pilot `4008bc99`). RT-57 du lot `20261013g` (faux positif de S36) reste sans item correspondant.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Recherche au registre tronquée par `head` | recherche rejouée sans troncature le 15/10 | oui | proposé au pilot en RT-62 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.
