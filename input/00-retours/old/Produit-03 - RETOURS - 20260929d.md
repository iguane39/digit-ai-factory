# Retours forges — Produit-03 — 20260929d

- **Contexte** : la première livraison de production du 29/09/2026 (exécution 15504) est refusée par une stratégie Azure de la souscription, posée le 03/07. L'amorçage de production « sans authentification au premier passage », conçu le 21/09 avec l'agent, ne pouvait pas passer : personne n'avait relevé les stratégies `Deny` de la portée cible. Suite des lots `20260929a` et `20260929b` (`RA-48`, `RA-49`), sur les vérifications d'avant production.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 29/09/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — un garde-fou de la plateforme cible, jamais relevé avant de concevoir le déploiement

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-51 | bloquant | produit+générique | **Une stratégie `Deny` de la souscription interdisait l'ordre de déploiement retenu, et rien ne l'a relevée.** La stratégie `ApplicationsIA_ForceAuthentification`, posée le 03/07/2026 sur toute la souscription, refuse d'écrire la configuration `web` d'une Web App dont l'authentification n'est pas active. Le 21/09, l'amorçage de production a été conçu « authentification désactivée au premier passage », deux décisions humaines à l'appui, sans qu'aucune étape n'interroge les stratégies de la portée cible. Le 29/09, la livraison 15504 est refusée : `(RequestDisallowedByPolicy) Resource 'web' was disallowed by policy. Reasons: 'Authentificaton de la webapp obligatoire'`. Relevé du même jour par l'API : `siteAuthEnabled` à `True` en développement et en qualification, conformes, à `False` en production. **La leçon existait dans la maison** : un produit voisin a heurté la même stratégie le 31/08 et l'a documentée dans sa chaîne d'infrastructure. Elle n'a atteint ni ce produit, ni la factory (aucune occurrence dans `todo\` ni `gabarits\` du pilot, relevé du 29/09), ni le guide du projet commun | (1) Ajouter aux vérifications d'avant conception d'un déploiement le relevé des stratégies `Deny` de la portée cible, `az policy assignment list --scope <portée>` puis la règle de chacune, jugées contre la séquence prévue ; c'est le domaine « Configuration d'infrastructure » proposé en `RA-48`, qui gagnerait cette règle. (2) Donner à la factory un registre des garde-fous de plateforme par souscription cliente, alimenté par les lots des produits, pour qu'une contrainte trouvée par un produit serve au suivant. (3) Faire publier par le feu vert d'une mise en production ce qu'il n'a pas vérifié (`RA-49`), dont les stratégies de la plateforme |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour : ni les gabarits de mise en production, ni le registre des oracles, ni les vérifications d'avant lancement ne demandent de relever les stratégies de la plateforme cible. C'est le cas de la règle § 4 de `quality-oracles` (domaine sans oracle → en définir un). L'oracle manquant se joue en lecture seule, par la commande que la proposition (1) décrit.

La classe n'existe pas au référentiel. Elle est proposée dans la famille `skill-ou-oracle-non-invoque` : clé `garde-fou-de-plateforme-non-releve`, libellé « Une contrainte imposée par la plateforme cible, une stratégie Deny par exemple, n'est relevée par aucune étape avant la conception d'un déploiement, et la séquence retenue se heurte à elle à l'exécution ; une contrainte déjà trouvée par un produit voisin ne circule pas ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'amorçage de production sans authentification heurte la stratégie de la souscription | décision à prendre par le commanditaire (`D-59`) ; voie recommandée : la Web App « née fermée », comme le voisin | oui | remonté ci-dessus en `RA-51`, et au projet commun (`RPC-15`, à transmettre) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les documents en cause sont la fiche de mise en production et le commit d'amorçage du 21/09, écrits à la main ; ce qui leur a manqué est remonté en `RA-51`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris cinq fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20260929c`.

## Confirmations positives

- La chaîne de livraison s'est arrêtée à la première écriture refusée, sans rien changer : la Web App de production garde sa configuration de création, et le retour arrière n'avait rien à défaire.
- La relance d'infrastructure du 29/09 (exécution 15502) a appliqué exactement le plan attendu, `1 to add, 0 to change, 0 to destroy`, avec la date de budget calculée à l'application (`2026-09-01T00:00:00Z`), correction du lot `20260929a` en conditions réelles.

## Ordre recommandé

1. `RA-51` (1) d'abord : une commande en lecture seule, jouée avant de concevoir, aurait évité le refus ; (2) ensuite, parce qu'il fait circuler les contraintes déjà trouvées.
