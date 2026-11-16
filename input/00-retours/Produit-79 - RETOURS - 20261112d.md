# Retours forges — Produit-79 — 20261112d

- **Contexte** : le 12/11/2026 à 16h28, l'exploitant relève qu'une échéance à l'heure a été confiée à GitHub, alors que D-128 (a) du 21/10 la réserve à Railway
- **Références ledger** : `forge\ledger.jsonl` seq 1211 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026

---

## pilot (`digit-ai-factory`)

Aucun retour pour les forges sur ce lot : l'écart tient à une décision propre à ce produit.

## Rattachement

Registre interrogé le 12/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 7 158 entrées dont le texte répond à `/(planificat|planning).{0,80}(jour même|replanif|trou|non couvert)|échéance.{0,40}non couverte/i` → 0 ligne trouvée.

Aucun item recoupé.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le workflow `reseaux-echeances-du-jour` (12/11, 15h56) fait jouer la garde et Instagram du jour par GitHub, alors que D-128 (a) réserve à Railway tout ce qui est à l'heure | non corrigée au 12/11 à 16h30 : la bascule sur Railway attend l'accès Railway (D-993) ; le passage du soir sert de passerelle selon D-992 | non, propre à la répartition GitHub et Railway de ce produit | reste au produit, parce que la règle enfreinte est une décision de ce produit |

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

- L'exploitant a relevé l'écart dans le tour même où il est apparu, en citant la règle enfreinte : le défaut a été consigné avant toute nouvelle écriture.
