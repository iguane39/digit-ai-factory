# Retours forges — Produit-82 — 20261113l

- **Contexte** : déploiement de l'usage sans code sur la recette, nettoyage de ses résidus de tests et création des organisations décidées par le porteur (D-30 a) ; run `Produit-82-20261110-version`, étape `version-20261113-usage-sans-code`.
- **Références ledger** : `forge\ledger.jsonl` seq 303
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La page Conversation affiche une bulle vide, sans message ni geste, quand le modèle finit sa réponse sans texte (ledger seq 303) | non corrigé dans ce tour : correction à confier par consigne | non | ouverte |
| Le parcours public limitait chaque réponse d'un modèle réel à 20 tokens ; les modèles réels de la recette raisonnent avant de répondre et rendaient un texte vide à cette limite (sonde du 13/11/2026 : `reasoning_tokens` 20 pour gpt-6-luna et gpt-6.1-terra, texte vide pour claude-haiku-5-5 sous 200 tokens) | limite portée à 400 tokens, parcours public 61 étapes sur 61 ; commit à faire après celui de l'agent du masque, qui modifie le même fichier | non | corrigée |
| La fiche des accès ne listait pas les identités créées sur la recette par `deployer.py --organisations` | `Produit-82/scripts/acces_complets.py` les lit et les vérifie, commit `7ff5337`, 18 sessions sur 18 | non | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le nettoyage de la recette en mode vérification a listé chaque objet à supprimer avant toute écriture : la liste a révélé 3 identités de démonstration et un compte de campagne qu'il fallait garder.
- La campagne de recette laisse 315 organisations avant comme après elle : la règle des campagnes sans résidu tient sur l'instance hébergée.

## Ordre recommandé

Sans objet : ce lot ne porte aucune candidature.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle qui aurait évité la remarque sur le parcours : une limite de tokens posée à un test sur modèle réel se mesure d'abord sur ce modèle, raisonnement compris.
