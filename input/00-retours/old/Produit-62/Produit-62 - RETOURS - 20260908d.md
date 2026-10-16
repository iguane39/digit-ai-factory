# Retours forges — Produit-62 — 20260908d

- **Contexte** : treizième retour humain sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset`, sur la page HTML de proposition (version `20260908e`) : « Formatte tous les tooltips pour qu'ils soient plus lisibles, notamment avec des puces et sous-puces si besoin. » Captures : infobulles natives (`title`) de sept objets d'affilée séparés par « · », sur cinq lignes serrées, et une infobulle de colonne Unity Catalog affichée en un seul bloc. Corrigé côté produit dans la version `20260908g` : contenu structuré (une puce par objet, sous-puces pour le schéma, la colonne, la source), rendu par un composant d'infobulle HTML au survol et au focus, le `title` natif conservé et lui aussi mis en forme (sauts de ligne, puces). Ce lot porte la cause de socle.
- **Références ledger** : `forge\ledger.jsonl` seq 47 (retour humain et cause), seq 48 (page `20260908g` et verdicts), seq 49 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-08

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## forge-agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-15 | majeur | générique | **Le socle ne connaît qu'une forme d'infobulle, l'attribut `title` natif, que ni L3 ni aucune règle ne jugent sur sa LISIBILITÉ : un `title` de sept objets concaténés est conforme et illisible.** Règle L3 (« jeton codé sans légende : title, aria-label ou barème lié attendus ») et L27 (`data-definition` sur les `th`) exigent la présence d'une légende, jamais sa forme ; `assets\` de `digit-ai-page-html` ne porte aucun composant d'infobulle (`table-filters`, `find-in-page`, `kpi-filter` seulement). Mesure sur la version `20260908e` : 3 153 cellules à `title`, dont 2 527 portent plusieurs objets ; la plus longue concatène 7 objets et 700 caractères en un paragraphe ; le navigateur affiche le `title` en texte brut, sans mise en forme, après un délai, et le coupe. Retour humain : « formatte tous les tooltips […] puces et sous-puces ». Correction produit `20260908g` : `describe_items()` rend une structure (objet, texte, sous-précisions) ; le `title` natif garde la structure en texte (« • objet — texte », « ◦ précision », sauts de ligne respectés par Chrome, Edge et Firefox) ; un composant `#infobulle` (`role="tooltip"`, fixe, 520 px au plus, repositionné pour rester à l'écran, fermé à la sortie, au défilement et par Échap, `title` natif neutralisé pendant l'affichage pour éviter le doublon) reconstruit les puces depuis le `title` — une seule source de vérité, 0 octet dupliqué ; mesure Playwright : 7 puces, 8 sous-puces, 520 × 438 px, dans l'écran, `title` restauré à la sortie ; `check_html` PASS. | Composant `infobulle` dans le socle (`assets\infobulle.js` + `.css`, embarqué comme `table-filters`) : contenu structuré depuis le `title` ou un `<template>` lié par `aria-describedby`, survol et focus clavier, Échap, repositionnement ; règle L3 bis : un `title` de plus de N caractères (200 ?) ou portant plus de deux objets (« · », « ; ») sans structure (sauts de ligne ou puces) = constat « légende illisible » ; BEST-PRACTICES § I4 : « une infobulle est une liste, pas un paragraphe ». |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Infobulles en paragraphe | structure objet / texte / sous-précisions, rendue en puces par le composant et en texte à puces dans le `title` | oui | remontée (RA-15) |
| Doublon `title` + composant (deux bulles) | `title` déplacé en `data-title` pendant l'affichage, restauré à la sortie | oui | inclus dans RA-15 |
| Poids de la page (données dupliquées dans `data-tip`) | composant reconstruit depuis le `title` ; 1,25 Mo contre 2,06 Mo avec duplication | oui | inclus dans RA-15 |
| Composant non atteignable au clavier sur les cellules (pas de `tabindex`) | focus géré si un élément `.bulle` reçoit le focus ; les cellules ne sont pas rendues focusables (3 153 arrêts de tabulation seraient pires) ; le `title` natif reste pour les lecteurs d'écran | oui, candidat | à instruire au socle : quel accès clavier pour 3 000 infobulles ? (non remonté comme défaut) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- Les navigateurs respectent les sauts de ligne dans `title` : la mise en forme texte du `title` suffit déjà à rendre lisible une infobulle native à puces, sans composant.
- `check_html` L3 continue de PASS avec le `title` structuré : la règle et la forme ne se gênent pas.

## Ordre recommandé

1. RA-15 — un composant de dix lignes et une règle de forme ferment la classe pour toutes les pages de données.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

L'item suit un retour humain. Classe : RA-15 → `page-html-dictionnaire-colonnes` (famille `page-html-socle`, voisine : la légende existe, c'est sa FORME qui manque ; classe candidate `page-html-legende-illisible`).
