# Retours forges — factory-digit-ai-fr — 20261116e

- **Contexte** : hors run, revue L99 en mode boucle du prompt « version traduite du site en six langues, SEO et GEO », passes 1 et 2, à la demande du créateur du 16/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 431, 432.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le prompt réécrit fait suivre au run la chaîne A « traduis ce produit dans N langues » du pilot, et mesurer la traduction par le pan i18n de forge-tests. Deux relecteurs aveugles ont montré, outils lus à l'appui, que cette chaîne ne tient pas telle quelle sur ce produit. Le pan ne lit pas un site FastAPI rendu côté serveur, et la chaîne nomme quatre contrôles qui n'existent que chez un produit pionnier.

---

## digit-ai-forge-tests (`forge-tests`)

Ce chapitre porte un retour, RT-87 : le pan i18n ne mesure pas un site rendu côté serveur, et ne contrôle pas la péremption.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-87 | **majeur** | générique | **Le pan `i18n` ne lit qu'un build statique (`out`, `dist`, `build`, `_site`, `site`, `www`, `public`, ou `FORGE_TESTS_I18N_BUILD`) ou des catalogues `<locale>.json`. Un site FastAPI rendu côté serveur, aux contenus en Markdown, le fait passer en SKIP. Aucun contrôle ne signale une traduction devenue périmée quand sa source française change.** Preuve : `forge_tests/adaptateurs/i18n.py`, lignes 1331 à 1342 ; `grep -rniE "empreinte\|stale\|obsol"` sans résultat ; ledger du produit, entrée 431. | Documenter au README du pan la recette d'export statique d'un site rendu côté serveur ; ajouter un contrôle de péremption par empreinte de la source. |

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-88 : la chaîne A nomme des contrôles propres à un produit pionnier comme s'ils existaient partout.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-88 | **mineur** | générique | **`references/CHAINE-TRADUCTION.md` confie A1, A5 et A10 à `check-i18n`, `check-glossaire`, `check-traductions` et `check-seo`, marqués « existe ». Ils sont absents de Produit-87 (`ls scripts/`). Un prompt qui suit la chaîne à la lettre promet des oracles inexistants.** Preuve : lignes 58, 62 et 67 de la référence ; ledger du produit, entrée 432. | Dans la colonne « oracle » de la chaîne A, nommer le contrôle générique du pan i18n qui tient chaque étape, et marquer les `check-*` comme propres au produit pionnier. |

## La règle qui aurait évité le retour

- RT-87 : classe à créer `pan-i18n-sans-rendu-serveur` : un pan de contrôle suppose une forme de produit (build statique) sans le déclarer.
- RP-88 : classe à créer `oracle-cite-propre-a-un-produit` : une référence transverse nomme comme existant un oracle propre à un seul produit.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
