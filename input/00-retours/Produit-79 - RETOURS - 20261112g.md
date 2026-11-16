# Retours forges — Produit-79 — 20261112g

- **Contexte** : le 12/11/2026 à 19h53, l'exploitant demande une relecture éditoriale des campagnes de réseaux sociaux N02 à N08, remises par Codex et déjà programmées sur Facebook. La relecture trouve 0 photo du domaine sur 35 images, alors que le contrôle des publications avait rendu 66 contrôles tenus et 0 échec.
- **Références ledger** : `forge\ledger.jsonl` seq 1229 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026

---

## pilot (`digit-ai-factory`)

Un contrôle qui ne s'applique qu'aux contenus d'une catégorie choisie par leur auteur laisse passer tout contenu que l'auteur range ailleurs.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-32 — contrôle conditionné à une catégorie que l'auteur choisit | majeur | générique | Le contrôle des publications du produit (`forge/etapes/reseaux/programmer_publications.py`, commande `verifier`) refuse une présentation de gîte sans photo de la piscine, mais seulement pour les piliers « Domaine » et « Dates libres ». Les 8 campagnes remises par Codex le 12/11/2026 annoncent des gîtes nommés sur des nuits précises, et sont rangées « Conversion » et « Agenda ». Le contrôle a rendu 66 tenus et 0 échec le 12/11 à 12h09 ; la relecture du soir compte 0 image sur 40 qui montre un gîte ou la piscine. | Règle d'écriture d'oracle à verser à `write-an-oracle` : un contrôle se déclenche sur ce que le contenu FAIT (ici, nommer des gîtes sur des nuits, ce que porte le champ `garde`), jamais sur une catégorie que son auteur déclare. Garde-fou : le jeu d'essais rouge de chaque oracle porte un cas « même contenu, autre catégorie » qui doit rester refusé. |

## Rattachement

Registre interrogé le 12/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 7 202 entrées dont le texte répond à `/(contrôle|oracle|règle).{0,60}(ne (joue|s.applique) que|conditionn).{0,80}(type|pilier|catégorie|étiquette)/i` → 0 ligne trouvée.

Aucun item recoupé.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le contrôle « présentation de gîte sans photo de la piscine » ne juge que 2 piliers sur 4 | non corrigée au 12/11 à 20h05 : la correction passe par un run de version du produit ; d'ici là, la relecture éditoriale du 12/11 tient lieu de contrôle pour N02 à N08 | oui pour le principe, remonté en RP-32 ; non pour la liste des piliers | reste au produit pour le code, principe remonté |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot ; verdicts repris du lot 20261112a :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le serveur du calendrier du .fr répond en lecture publique : le stock de décembre et les prix par durée se mesurent en quelques secondes, ce qui a permis de proposer des séjours réservables plutôt que des dates supposées.

## Note de réception du pilot (16/11/2026)

Le lot a été refusé tel quel à l'ingestion : la famille de ses classes proposées n'existe pas au référentiel `todo/CLASSES.json`. Le pilot l'a ramenée, avant ingestion, à la famille connue la plus proche :

- classe proposée « controle-conditionne-a-une-categorie-declaree » : famille « oracle », inconnue du référentiel, ramenée à « regle-morte »
