# Retours forges — Produit-79 — 20261112a

- **Contexte** : affichage du calendrier des réseaux sociaux demandé par l'exploitant le 12/11/2026 ; le workflow hébergé qui programme les publications échoue depuis le 03/11 sans que personne en soit averti
- **Références ledger** : `forge\ledger.jsonl` seq 1185 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Un workflow hébergé qui publie au nom du client peut échouer pendant des jours : aucun contrôle du poste ni de la session ne le relève.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-26 — workflow de publication en échec 9 jours sans alerte | majeur | générique | 12/11/2026 09:25 : `gh run list --workflow reseaux-programmer.yml` rend 5 exécutions en échec, du 03/11 17:04 au 12/11 08:10 UTC. Le journal de la dernière dit « vérification en échec : rien n'est programmé » : la vérification rejoue la semaine du 19/10 en tête et bute sur « 4 instagram : 2026-10-22T12:30 est à moins de 15 minutes ou passé ». Les semaines du 09/11 et du 16/11, validées par fusion (demandes 2 et 3), n'ont ni état ni entrée au journal des publications. Trois publications datées du 09 au 12/11 ne sont pas parties. Le défaut a été vu par hasard, parce que l'exploitant a demandé à voir le calendrier. | Règle qui aurait évité le retour : aucune exécutée ; classe à créer `automatisation-hebergee-en-echec-sans-alerte` (famille `hook-ou-gate`). Proposition : le relevé d'ouverture interroge les workflows hébergés du produit (`gh run list`) et signale tout workflow dont les N dernières exécutions sont en échec ; côté produit, une garde de programmation écarte une publication passée au lieu de bloquer les semaines suivantes. |

## Rattachement

Registre interrogé le 12/11/2026 09:28 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 7 045 entrées dont le texte répond à `/workflow…(échec|silenc)/i` → 1 ligne trouvée.

Items recoupés :

- TF-1072 (candidat, `digit-ai-forge-development`) : un contrôle hébergé en échec depuis le 08/09 que rien sur le poste ne signalait. C'est le même mécanisme, constaté sur une forge et non chez un produit : RP-26 le généralise aux workflows des produits.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La garde de `programmer_publications.py` rejoue les semaines passées et bloque les suivantes | non corrigée au 12/11 09:28 : la correction attend la décision D-990 de l'exploitant et passe par un run de version | non, propre au code de ce produit | reste au produit, la partie surveillance remonte en RP-26 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le relevé d'ouverture a signalé le retard du dépôt sur son distant : la lecture s'est faite après mise à jour, et la semaine du 16/11 fusionnée ce matin figure au calendrier.
