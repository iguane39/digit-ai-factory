# Retours forges — Produit-82 — 20261113m

- **Contexte** : vérification du masque des réponses en flux (D-31 a), correction de la réponse vide et redéploiement de la recette ; run `Produit-82-20261110-version`, étape `version-20261113-usage-sans-code`.
- **Références ledger** : `forge\ledger.jsonl` seq 306, 307
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `test_enf35_cle_personnelle_refusee_sur_un_modele_de_client_b` a rendu 401 sur une clé neuve à 1 passe complète de `make test` sur 2, et passe rejoué seul 3 fois (ledger seq 306) | non corrigé : la cause, sans doute le délai d'application d'une clé neuve, reste à mesurer | non | ouverte |
| Reconstruire le portail sur la pile locale a recréé le filtre des garde-fous, et la passerelle a gardé son ancienne adresse : chaque appel au modèle a rendu 503, parcours local à 61 étapes sur 76 (ledger seq 307) | contourné par le redémarrage des 3 passerelles, 76 sur 76 ensuite ; la cible `make` n'est pas corrigée | non | ouverte |
| La page Conversation montrait une bulle vide quand un modèle finissait sans texte (ledger seq 303, lot 20261113l) | message et geste d'un autre modèle, commit `628f464`, parcours local 75 puis 76 sur 76 | non | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La critique d'implémentation, rejouée après la correction de la page Conversation, a été jouée sur une instance servie et peuplée, avec une session par rôle.

## Ordre recommandé

Sans objet : ce lot ne porte aucune candidature.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle qui aurait évité la remarque sur la pile locale : une cible qui reconstruit un service redémarre ceux qui gardent son adresse.
