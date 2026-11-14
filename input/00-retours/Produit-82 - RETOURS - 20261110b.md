# Retours forges — Produit-82 — 20261110b

- **Contexte** : déploiement en recette des vues du portail codées d'après la maquette TCO validée (décision D-20 (a)), run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 198, 199
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-10

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur la recette d'un produit qui garde sa base d'un déploiement à l'autre.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-26 | majeur | générique | La recette Railway du 10/11/2026 à 22:28 UTC rend T4 et le contrôle positif de T6 en FAIL (429, `budget_exceeded`). La recette de 15:47 UTC avait consommé le budget de client-b : 90 tokens sur une fenêtre glissante de 24 h (`Produit-82\config\Produit-82.yaml` l.204 à 211). La base de recette persiste. `make test` repart au contraire d'une base vide (`down -v`), et ces deux tests y passent. Preuve : `Produit-82\reports\rapport-tests-railway-recette.md`. Ledger seq 198. **RT-26** : clé proposée `recette-non-rejouable-sur-base-persistante`. | Une recette qui consomme un état borné dans le temps déclare sa période de rejeu, ou crée son propre état à chaque passage. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `test_vues_tco.py` charge `/portail/vues.py` et `/portail/serveur.py` par leur chemin ; l'image de recette ne les embarquait pas, d'où EF-44 et EF-45 en FAIL `FileNotFoundError` (ledger seq 199) | `COPY portail /portail` dans `outils.Dockerfile` et copie au contexte dans `preparer.py` ; image reconstruite, module chargé | oui : l'image de recette porte ce que la pile locale monte pour les tests | corrigé au produit |
| T4 et T6 non rejouables dans les 24 h qui suivent une recette (RT-26) | non corrigé : prochaine recette datée après la fenêtre | voir RT-26 | à corriger au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le parcours des nouvelles vues joué sur les adresses publiques de la recette rend 41 étapes sur 41, comme en local.

## Ordre recommandé

1. RT-26 : une recette rouge par état, et non par code, se lit comme une régression.
