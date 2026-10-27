# Retours forges — Produit-03 — 20261019a

- **Contexte** : le 19/10/2026, un plan de remédiation des pipelines a posé 4 décisions à l'humain. Le contrôle de réservation a accepté des numéros déjà affichés le 02/10.
- **Références ledger** : `forge\ledger.jsonl` seq 2 à 9 (entrées `question_humain`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — un registre des décisions neuf ne connaît pas les numéros déjà affichés

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-78 | majeur | générique | **Le registre des décisions du produit est né vide, et la réservation a accepté des numéros déjà pris.** Le 19/10 à 12h07, `forge/ledger.jsonl` n'existait pas. `python forge/ledger.py question_humain --decision D-68 …` a d'abord refusé (« la première entrée d'un ledger doit être `run_open` »), puis a accepté D-68 à D-71 après un `run_open` (seq 2 à 5). Or ces 4 numéros avaient déjà été posés à l'humain le 02/10, dans 3 restitutions sous `forge/` (`… - 20261002d.md`, `… - 20261002g.md`, `… - 20261002h.md`) : D-68 « Validez-vous les quatre écarts du prompt réécrit à votre texte ? », D-71 « Valide-t-on la répétition de création de zéro … ». La collision n'a été vue qu'en relisant une ancienne restitution pour en copier la forme ; renumérotation en D-72 à D-75 (seq 6 à 9). `grep -rhoE "\bD-[0-9]{2,3}\b" forge/*.md DECISIONS.md` donne D-71 comme plus haut numéro déjà affiché. | Amorcer le registre du produit à sa première écriture : relever les D-N déjà affichés (restitutions de `forge/`, `DECISIONS.md`) et refuser une réservation qui en reprend un. Le pilot a fait cet amorçage pour lui-même (TF-1872, registre amorcé D-13 à D-33). |

## Rattachement

Registre interrogé le 19/10/2026 : `grep -n "RÉSERVATION\|reserver-decision\|question_humain" todo/TODO.jsonl` → 6 ligne(s) trouvée(s).
Items recoupés : TF-1849 (réservation au registre du produit, corrigé le 18/10 ; ce retour en est un cas non couvert : le registre neuf, non amorcé) et TF-1872 (amorçage du registre du pilot seulement). Classe `designateur-de-decision-sans-reservation`, déjà close : récidive.

## La règle qui aurait évité le retour

Un registre de réservation ne vaut que s'il connaît les numéros déjà affichés : il s'amorce sur l'historique avant d'accepter la première réservation.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| D-68 à D-71 réservés à tort | réservation refaite sous D-72 à D-75 ; les entrées 2 à 5 sont déclarées caduques dans la restitution du jour | oui | remonté ci-dessus en `RA-78` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le refus d'une première entrée qui n'est pas `run_open` a bien empêché une écriture sans contexte.

## Ordre recommandé

1. `RA-78` : un seul retour.
