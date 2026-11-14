# Retours forges — Produit-79 — 20261110a

- **Contexte** : synchronisation du 10/11/2026 ; conflit de fusion sur `forge/hooks/factory.mjs` entre la recopie du pilot de ce poste et la version poussée par le poste B le 04/11
- **Références ledger** : `forge\ledger.jsonl` seq 1079 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 10/11/2026

---

## pilot (`digit-ai-factory`)

Le gabarit des hooks du pilot de ce poste ne connaît pas le hook `fichiers-env`, que le poste B a posé chez le produit ; la recopie l'enlève du produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-25 — hook `fichiers-env` absent du gabarit, retiré du produit par la recopie | majeur | générique | 10/11/2026 : le hook de reprise a recopié `gabarits\hooks-factory.mjs` du pilot (commit `8483b9fd`, à égalité avec son origin) dans `forge/hooks/factory.mjs`. Cette copie ne contient pas le nom `fichiers-env`, que le commit produit `846af92` du 04/11 (poste B, décision D-106 b) avait ajouté avec son entrée de `settings.json`. `git pull` a rendu un conflit sur `factory.mjs`, résolu à la main par l'union des noms. `oracles\hook-fichiers-env.mjs` est absent du pilot de ce poste : le lanceur écrit « hook fichiers-env SAUTÉ » et sort en 0, donc la règle « les .env ne transitent jamais » ne se joue pas ici. | Règle qui aurait évité le retour : aucune exécutée. Proposition : pousser au pilot `hook-fichiers-env.mjs`, le nom au gabarit et l'entrée au gabarit `settings-produit.json` ; et faire signaler par le contrôle d'héritage un nom de hook présent au produit et absent du gabarit, au lieu de l'écraser. |

## Rattachement

Registre interrogé le 10/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 6 865 entrées dont le titre ou le contenu répond à `/fichiers-env|D-106|hooks-factory/i` → 5 ligne(s) trouvée(s).

Items recoupés :

- TF-2150 (candidat, hook `lecons`) : même gabarit, autre hook, sans rapport avec la divergence entre postes ;
- TF-2154 et TF-2187 (candidats, recette `hooks-factory` en échec) : même fichier, défaut différent ;
- aucun item ne couvre `fichiers-env` : RP-25 entre en candidat neuf.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui, et pourquoi cela remonte ou non.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Conflit de fusion sur `forge/hooks/factory.mjs` | union des deux listes de noms, `node --check` vert, chaque hook de `settings.json` reconnu | oui | remonté en RP-25 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Deux documents mûrs, mesurés par le contrôle du lot :

- « Guide - E-mails Beds24 en HTML », 6 versions datées. Verdict : reste au produit, parce qu'il décrit les modèles d'e-mail d'une plateforme de réservation propre à ce produit et n'a pas de forme générique à verser au catalogue.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le refus du hook `remisage` sur `git stash pop` a orienté vers une voie sûre : correctif enregistré en fichier puis réappliqué par `git apply --3way`, sans toucher la pile partagée.
