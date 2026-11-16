# Retours forges — Produit-82 — 20261113n

- **Contexte** : redéploiement de la recette avec le masque des réponses en flux ; la campagne de recette y laisse une identité de plus ; run `Produit-82-20261110-version`, étape `version-20261113-usage-sans-code`.
- **Références ledger** : `forge\ledger.jsonl` seq 309, 310
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le nettoyage d'une instance de test laisse la table des anciens comptes du portail ; les tests de migration rejoués sur la recette recréent l'un d'eux, `maj`, en identité, et le décompte des campagnes rend FAIL (25 identités avant, 26 après ; ledger seq 309) | correction confiée à un agent de campagne par `forge/etapes/version-20261113/CONSIGNE-NETTOYAGE-ANCIENS-COMPTES.md` | non | ouverte |
| La session a écrit 166 anciens comptes au ledger et dans la consigne, chiffre lu sur une liste affichée ; le recompte sur la sauvegarde en donne 151 (ledger seq 310) | consigne corrigée, commit `20c9d7a`, et l'agent prévenu | non | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le décompte des campagnes, posé le matin même, a signalé au premier redéploiement une identité recréée par les tests sur la recette.

## Ordre recommandé

Sans objet : ce lot ne porte aucune candidature.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle qui aurait évité la remarque sur le chiffre : un chiffre écrit au ledger se compte à sa source.
