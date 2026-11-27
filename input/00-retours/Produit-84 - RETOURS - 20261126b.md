# Retours forges — Produit-84 — 20261126b

- **Contexte** : le 26/11/2026, l'agent de campagne de la session `66c124ca` arrête par PID les processus d'un banc Lighthouse (Chrome et serveur Python) après sa mesure.
- **Références ledger** : `forge\ledger.jsonl` seq 349.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-26
- **Complétude** : 1 entrée `type: retour` écrite au ledger après le lot 20261126a (seq 349), relue le 26/11/2026 dans `forge\ledger.jsonl`.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Un arrêt réussi annoncé non vérifié** : le script d'arrêt par PID conclut trop tôt.

## digit-ai-factory — scripts/processus-par-pid.mjs

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-27 | mineur | générique | **Arrêt annoncé non vérifié à tort.** (1) `processus-par-pid.mjs arreter` sur un Chrome lancé pour un banc Lighthouse (PID 83424). (2) Sortie : « arrêt NON vérifié ». (3) Relecture de la liste des processus quelques secondes plus tard : PID absent. (4) La liste des processus de Windows se met à jour avec retard, et le script ne relit qu'une fois. | Relire la liste quelques fois, à intervalle court, avant de conclure. Règle qui aurait évité le retour : aucune. Classe proposée : `verification-trop-tot`, famille `script-de-poste`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune remarque n'est restée au produit : le retour porte sur un script du pilot. Généralisable : sans objet.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le retour porte sur un script de poste.

## Confirmations positives

- L'arrêt par PID, et non par nom, a gardé intacts les autres Chrome du poste.

## Ordre recommandé

1. RU-27 : tout banc qui lance un navigateur sous Windows le reproduit.
