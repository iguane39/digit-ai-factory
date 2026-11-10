# Retours forges — Produit-84 — 20261110b

- **Contexte** : le 10/11/2026, la session `3c08d011` joue les contrôles de la version v1.13.0 qualifiée, puis applique la décision D-180 (b) du porteur.
- **Références ledger** : `forge\ledger.jsonl` seq 279 et 280.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-10
- **Complétude** : 2 entrées `type: retour` écrites depuis le lot 20261110a (seq 279 et 280), relues le 10/11/2026 dans `forge\ledger.jsonl`. Elles vont toutes les 2 au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **L'analyse des bibliothèques** de forge-websec rend SKIP même sur un poste au repos : npm y répond trop lentement.
- **La campagne forge_tests** compte comme bloquants 2 mots de passe vides du gabarit qu'elle dépose elle-même.

## digit-ai-forge-websec — analyse des bibliothèques

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-18 | majeur | générique | **Complément de RU-16 (lot 20261110a) : le délai de 10 s de `oracle-sca` ne tient pas sur ce poste, même au repos.** (1) Poste libéré de toute campagne, `npm --version` prend 39 s, puis 20 s sans vérification de mise à jour (MESURÉ par `time`, 10/11/2026 vers 11:05). (2) `oracle-sca` rend SKIP « npm absent du poste » à chaque passage. (3) La preuve SCA du jour vient de l'analyse OSV de la chaîne de qualification 42782533913. Ledger seq 279. | Un délai réglable par variable d'environnement, et un message qui nomme le délai dépassé au lieu d'une absence. Règle qui aurait évité le retour : aucune. Classe : `oracle-faux-positif`. |

## digit-ai-forge-tests — gabarit déposé par la forge

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-19 | majeur | générique | **forge_tests accuse comme secrets les lignes vides de son propre gabarit.** (1) `rapport-20261110.json` : 2 des 7 constats bloquants sont gitleaks `generic-api-key` aux lignes 97 et 134 de `.env.forge-tests.exemple`. (2) Ce fichier est le gabarit que forge_tests dépose lui-même dans le projet (TF-0539), le 09/11 à 20:21. (3) Ces lignes valent `FORGE_TESTS_PASSWORD=` et `FORGE_TESTS_QUALIF_PASSWORD=`, sans valeur. Ledger seq 280. | Le pan sécurité exclut le gabarit qu'il dépose, ou gitleaks ignore une affectation vide. Règle qui aurait évité le retour : aucune. Classe : `oracle-faux-positif`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune : les 2 frictions sont généralisables.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : les 2 retours portent sur des oracles de la forge.

## Confirmations positives

- La copie chiffrée de l'état Terraform s'ajoute à une chaîne existante sans secret nouveau : la clé publique de sauvegarde, variable du dépôt, suffit.

## Ordre recommandé

1. RU-19 : il gonfle chaque campagne de 2 faux bloquants, sur tout produit qui garde le gabarit.
2. RU-18 : il prive l'analyse SCA de toute preuve sur un poste lent.
