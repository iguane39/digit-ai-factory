# Lot de retours — Produit-64 → pilot (page HTML « IA dans le Run ») — 2026-10-15, indice f

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire le générateur de la famille `gd-guide-de-reference` (`gabarits/documents/guide-de-reference/generateur/construire-guide.py`), et `forge-design`, c'est-à-dire `oracles/oracle-textes-application.mjs`.

**Origine** : session de conversation du 15/10/2026, vers 11:45 (heure de Paris), rendu de la page `Client-A - Proposition - IA dans le Run - 20261015a.html` par la famille, et sa critique de design.

Ce lot porte **2 retours** (RT-66 et RT-67).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## pilot (générateur `gd-guide-de-reference`) et forge-design (`oracle-textes-application`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-66 | majeur | générique | **Une page de la famille à la marque verte garde un voile d'accent bleu.** `composants/jetons.css` pose `--accent-voile: #EAF0FD` (sombre `#16233F`) ; `style_de_marque()` de `construire-guide.py` ne surcharge que `accent` et `accent_fonce`, à partir de l'en-tête. Mesuré le 15/10 : 10 cartes d'un schéma peintes en `rgb(234, 240, 253)` en clair et `rgb(22, 35, 63)` en sombre sur une page Client-A déclarée verte ; corrigé localement par une surcharge `:root{--accent-voile:#E6F3EB}`, 0 élément bleu ensuite (sonde au navigateur, 4 vues × 2 thèmes). Toute page de la famille qui emploie le voile, avec une autre marque que celle par défaut, hérite du bleu. | L'en-tête accepte `accent_voile` et `accent_voile_sombre`, ou le générateur dérive le voile de l'accent ; une recette rend une page verte et compte les couleurs de teinte bleue. |
| RT-67 | mineur | générique | **`oracle-textes-application` T4-2 prend « non vide » pour un état vide.** Sur la même page, 3 constats bloquants « état vide sans invitation à agir » visent l'infobulle du code `C2`, qui cite « plan Terraform non vide, écart déclaré/constaté » : aucun état vide n'existe. | Exclure les tournures négatives (« non vide », « pas vide ») et les attributs `title` des codes liés ; une fixture verte avec « plan non vide ». |

**Portée** : générique pour les 2 retours.

## La règle qui aurait évité le retour

- **RT-66** : classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` — la recette du générateur rend une page à marque déclarée et y cherche toute couleur de la marque par défaut.
- **RT-67** : classe `oracle-faux-positif` — fixture verte « non vide » au banc de T4-2.

## Rattachement

Registre interrogé le 15/10/2026 (`todo/TODO.jsonl`, sorties complètes) : « voile » 0 occurrence, « T4-2 » 0 occurrence. Aucun item existant.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Voile bleu sur la page verte | surcharge locale dans `tools/propositions/rendre-proposition-ia-run-html.py` | oui | proposé au pilot en RT-66 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de documents de la bibliothèque sur ce lot ; la page est rendue par le générateur de la famille `gd-guide-de-reference`, objet de RT-66.

## Documents mûrs

Aucun document mûr sur ce lot.
