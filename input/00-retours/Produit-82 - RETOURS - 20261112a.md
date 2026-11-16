# Retours forges — Produit-82 — 20261112a

- **Contexte** : le porteur cherche les comptes de test pour se connecter lui-même aux environnements du produit, et n'en trouve aucun index ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 43, 200, 201
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur ce que `docs\projet\ACCES-TEST.md` doit donner à l'humain qui veut tester lui-même.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-27 | majeur | générique | Le 12/11/2026, le porteur demande : « Tu es sensé avoir un fichier avec tous les comptes de tests sur tous les environnements pour que je puisse m'y connecter et faire mes propres tests, pourquoi ce n'est pas le cas ? ». Les règles R-20 et R-23 de `REGLES-PROJET.md` bornent `ACCES-TEST.md` aux comptes de démonstration locale. Elles réduisent tout environnement réel à une référence « # à fournir : ». Aucune règle n'exige, par environnement déployé, l'adresse, l'identifiant et la variable du mot de passe de chaque compte, ni la mise à jour de la fiche au déploiement. Ledger seq 200. **RT-27** : clé proposée `acces-test-limite-a-la-demo-locale`. | R-20 : `ACCES-TEST.md` indexe chaque environnement déployé (adresse, identifiant, variable du secret, fichier ignoré qui porte la valeur, date de vérification). L'étape MEP et tout déploiement de recette la mettent à jour dans le même tour. Un oracle compare les environnements de `COMPOSANTS-OPS.md` à ceux d'`ACCES-TEST.md`. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `docs\projet\ACCES-TEST.md` datait du 14/10 et disait la recette « sans objet », alors qu'elle tourne depuis le 15/10 ; il citait 2 variables inexistantes (`ADMIN_UI_IDENTIFIANT`, `ADMIN_UI_MOTDEPASSE`) ; ledger seq 201 | fiche réécrite par environnement ; chaque compte de recette vérifié par une connexion scriptée le 12/11 ; `oracle-conformite-projet` R-20, R-20 ter et R-23 PASS | oui, voir RT-27 | corrigé au produit |
| Le seq 43 (RT-7) est parti dans le lot `20261014d`, dont la ligne de références disait « seq 38 à 42 » : le relevé d'ouverture le croyait sans lot depuis 27 jours | rattaché ici, sans nouvel identifiant : RT-7 reste son identifiant | non | corrigé au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La vérification de chaque compte par une connexion scriptée a trouvé en une passe un nom de champ faux (`mdp` au lieu de `mot_de_passe`) avant de conclure : un compte n'est dit utilisable qu'après une session ouverte.

## Ordre recommandé

1. RT-27 : le porteur ne peut pas tester lui-même un produit déployé sans redemander ses accès.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une question humaine. La règle qui l'aurait évité : tout déploiement met à jour, dans le même tour, l'index des comptes de test de l'environnement déployé. Classe proposée : **RT-27** : `acces-test-limite-a-la-demo-locale`, famille `heritage-produit`, libellé « La fiche d'accès ne donne pas à l'humain les comptes de test des environnements déployés ».
