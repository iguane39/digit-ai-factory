# Retours forges — Produit-82 — 20261014h

- **Contexte** : question humaine sur la conformité du produit à sa fiche, brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 56, 57, 58
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur le vocabulaire fermé « statut d'une exigence » du gabarit `gd-fiche-produit`.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-11 | majeur | générique | Le 14/10/2026, la fiche `Digit-AI - Fiche Produit Produit-82 - Specification - 20261014c` (gabarit `gd-fiche-produit` 1.0.0) portait 28 exigences en `fait constaté`. Trois ne l'étaient que par la présence de la fonction dans le code amont, sans configuration ni essai dans le produit : EF-10, EF-16, ENF-13. Le gabarit admet « fait constaté » quand l'exigence vient « de l'existant ». La question humaine « est-ce que le produit développé répond à la fiche produit ? » l'a révélé. Ledger seq 56 à 58. **RT-11** : clé proposée `exigence-constatee-sur-l-existant-sans-essai-dans-le-produit`. | Séparer au gabarit « présent dans la base » et « vérifié dans le produit », ce dernier exigeant la trace d'un essai. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 3 exigences en `fait constaté` sans essai | fiche `20261014d` : passées en `hypothèse` avec leur motif ; 3 autres prouvées par mesure | oui | remonté sous RT-11 |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Digit-AI - Fiche Produit Produit-82 - Specification - 20261014c.md` | gd-fiche-produit · 1.0.0 | un statut « présent dans la base, non vérifié dans le produit » | « est-ce que le produit développé répond à la fiche produit ? » | la mesure exigence par exigence, à la restitution | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La sonde de disponibilité, les métriques et l'absence de contenu stocké se sont vérifiées en trois appels, sans rien modifier.

## Ordre recommandé

1. RT-11 : une fiche qui surestime son produit se fait démentir par la première question de conformité.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une question humaine. La règle qui l'aurait évité : une exigence ne passe en `fait constaté` qu'avec la trace d'un essai dans le produit lui-même. Classe proposée : **RT-11** : `exigence-constatee-sur-l-existant-sans-essai-dans-le-produit`, famille `gabarit-document`, libellé « Une exigence est déclarée constatée parce que la fonction existe dans la base, sans essai dans le produit livré ».
