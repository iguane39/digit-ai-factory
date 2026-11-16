# Retours forges — Produit-82 — 20261112g

- **Contexte** : vérification par la session des corrections de l'agent de campagne sur le portail unique, avant tout déploiement en recette ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 227, 228, 229
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-design, `oracle-declencheurs`

Le retour porte sur la règle DE3, qui juge le fond des boutons.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-35 | majeur | générique | Le 12/11/2026, DE3 refusait 7 écrans du portail pour des boutons de ligne sans fond. L'agent de correction a mesuré la contre-épreuve : PASS sans `table-filters.css`, FAIL avec. DE3 applique la règle `.tf-actions button { background: none }` de la feuille du socle à tous les boutons de la page, alors qu'elle ne vise que la barre d'actions du composant de filtres. Le produit a contourné en redéclarant le fond de `.bouton` après la feuille, sans changer le rendu (commit `a5d51ef`). Ledger seq 227. **RT-35** : clé proposée `oracle-de3-selecteur-hors-conteneur`. | DE3 lit le style calculé par le navigateur, jamais une règle à sélecteur descendant appliquée hors de son conteneur. |

## quality-oracles, `oracle-secrets`

Le retour porte sur 2 règles de gitleaks que l'oracle relaie sans les rétrograder.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-36 | majeur | générique | Le 12/11/2026, `oracle-secrets --versionne` sur la racine du dépôt rend FAIL avec 3 bloquants, tous faux. Sur `.env.forge-tests.exemple`, lignes 92 et 126, `generic-api-key` prend pour valeur le nom de la variable 2 lignes plus bas : l'affectation est vide dans tout l'historique et le fichier est en CRLF. Sur le ledger, seq 139, `curl-auth-user` se déclenche sur une phrase de prose sans option `-u`. Matchs relus avec `gitleaks --redact`. Ledger seq 228. **RT-36** : clé proposée `oracle-secrets-affectation-vide`. | L'oracle rétrograde une valeur capturée après un saut de ligne et un `curl-auth-user` sans `-u` ni `--user`, comme il rétrograde déjà les empreintes d'un journal d'oracles (TF-1701). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Heure écrite sans relevé d'horloge dans le constat de seq 228 (« 21:30 » au lieu de 20:53) | rectifiée par seq 229, le ledger restant en ajout seul | non, la règle TF-1424 existe déjà | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- L'agent de correction a mesuré une contre-épreuve avant d'attribuer un refus à l'oracle, au lieu de changer l'apparence des boutons pour le faire taire.

## Ordre recommandé

1. RT-36 : il empêche tout produit conforme de rendre son dépôt vert.
2. RT-35 : le contournement au produit tient, mais chaque page qui sert le composant de filtres le paiera.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucune correction humaine. La règle qui les aurait évités : un oracle qui relaie un outil tiers rétrograde les motifs connus pour produire des faux positifs, et chaque oracle de style lit la cascade calculée par le navigateur.
