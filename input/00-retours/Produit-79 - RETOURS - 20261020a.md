# Retours forges — Produit-79 — 20261020a

- **Contexte** : incident — l'exploitant relève le 20/10/2026 une heure d'en-tête de restitution qui n'est pas réelle, alors qu'il avait demandé de ne plus en afficher
- **Références ledger** : `forge\ledger.jsonl` seq 706 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 20/10/2026

---

## pilot (`digit-ai-factory`)

L'heure du bloc 1 d'une restitution s'écrit encore sans relever l'horloge, et `oracle-synthese` la laisse passer.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-24 — heure d'en-tête composée, récidive de TF-1646 | majeur | générique | 20/10/2026, restitution de la décision D-128 : en-tête « Quand : 20/10/2026 19:52 heure de Paris, durée 4 min ». Aucune commande `date` dans le tour ; la restitution est affichée après 20:30, horloge relevée à 20:32:38 au tour suivant ; l'entrée 701 qui pose D-128 porte 17:51:44Z. La restitution avait passé `node forge/hooks/factory.mjs restitution --prejuger` (affichable, 0 bloquant). Réponse de l'exploitant : « pourquoi tu parles à nouveau d'heure alors que j'avais demandé à ne plus afficher d'heures qui ne sont pas réelles » (ledger, entrée 706). | Règle qui aurait évité le retour : aucune exécutée ; TF-1424 ne couvre que le `ts` du registre. **RP-24** : classe existante `horodatage-de-ledger-compose-a-la-main`. Proposition, celle de TF-1646 : une heure du bloc 1 sans sortie de `date` dans le tour est signalée par `oracle-synthese` ; une durée non mesurée s'omet. |

## Rattachement

Registre interrogé le 20/10/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 5 058 entrées dont le titre répond à `/(RESTITUTION bloc 1|horodatage-invente)/` → 2 ligne(s) trouvée(s).

Items recoupés :

- TF-1646 (candidat, « des heures d'en-tête de restitution composées au lieu d'être relevées ») : RP-24 en est la récidive, 8 jours plus tard, chez un autre produit ;
- TF-1424 (candidat, `ts` de registre composé) : même famille, autre support.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui, et pourquoi cela remonte ou non.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Heure composée dans l'en-tête de la restitution D-128 | mémoire de session `heures-reelles` : toute heure affichée se relève par `date` ou se cite d'un horodatage | oui | remonté en RP-24 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Un document mûr, mesuré par le contrôle du lot : « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La recherche au registre du pilot a retrouvé TF-1646 en une requête : le retour se rattache sans doublon.
