# Retours forges — Produit-82 — 20261125d

- **Contexte** : déploiement de la recette du 25/11/2026 au commit `f7f6ed5`, sur GO du porteur (A-2), avec historique des conversations (EF-70) et éditeur du modèle en préfixe (EF-59). Le parcours navigateur public rend 61 étapes sur 61 sans jouer aucune étape EF-70.
- **Références ledger** : `forge\ledger.jsonl` seq 334, 335
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-25

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Produit, parcours navigateur public

Le retour porte sur un verdict de parcours public qui ne dit pas quelles exigences il n'a pas jouées.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-52 | mineur | générique | Le 25/11/2026, le parcours public de la recette a rendu « 61 étapes sur 61 au vert » et le code 0. Aucune des 7 étapes EF-70 ajoutées le matin n'y figure : dans `Produit-82/tests/e2e_navigateur.py`, elles suivent les étapes qui lisent le simulateur, réservées à la pile locale. La présence du code sur la recette n'a été constatée que par les actifs servis (`portail.js` porte `Produit-82-conversations:`). Preuve : `forge\etapes\version-20261125\recette\e2e-railway-recette-20261125.json`, ledger seq 334. **RT-52** : clé proposée `parcours-public-sans-couverture-declaree`. | Le rapport du parcours public liste les exigences du parcours local qu'il ne joue pas, en `non_juge`. Une exigence d'interface sans appel au simulateur se joue aussi sur l'instance hébergée, sur le modèle réel le moins coûteux. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le déployeur copie le dossier de travail (`preparer.py`, `copytree` de `portail/`) : avec une autre session en cours sur le portail, il aurait envoyé 70 lignes non commitées et 2 feuilles de direction à la recette | déploiement joué depuis une worktree git propre au commit poussé, fichiers ignorés reliés par lien physique, worktree retirée ensuite | oui, une option `--depuis-commit` du déployeur le rendrait mécanique | contourné, non corrigé |
| ENF-38 en échec au rapport de recette, comme au déploiement du 13/11 (ledger seq 308, 309) | non corrigé dans ce tour | non | ouvert |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le décompte ENF-38 du parcours public (6 organisations, 26 identités avant comme après) prouve que le parcours ne laisse aucun résidu sur la recette.

## Ordre recommandé

1. RT-52 : un parcours au vert qui ne joue pas la fonction livrée donne une fausse assurance au GO de mise en production.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit pas une correction humaine : l'écart a été relevé par la session en lisant le parcours public.
