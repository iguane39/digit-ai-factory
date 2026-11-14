# Retours forges — Produit-84 — 20261104b

- **Contexte** : demande du porteur du 04/11/2026, mot pour mot : « Remonte à la Factory qu'un sujet qui aurait dû remonté à la Factory n'est pas remonté et qu'il y a un sujet à traiter sur le fait que les remontées ne se font pas correctement. »
- **Références ledger** : `forge\ledger.jsonl` seq 173 ; faits cités : seq 164, 169 à 171.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-04
- **Complétude** : 1 entrée `type: retour` écrite depuis le lot 20261104a (seq 173), relue le 04/11/2026 à 10:28 dans `forge\ledger.jsonl` ; elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le sujet non remonté.** Le 04/11/2026 à 10:23, la session a identifié l'écart du rapport d'audit au gabarit standard de forge-audit. Elle a reporté sa consignation à une action future, et le préjugement l'a laissé passer. Le porteur a dû demander « Pourquoi ce sujet n'est pas remonté à la Factory ? ». Consignation faite à 10:25 (seq 169 à 171), lot 20261104a remis à 10:26.
- **La veille.** Le 03/11/2026, une extension de skill demandée par le porteur avait été déclarée « rien de neuf » (seq 164, TF-2078).
- **Le sujet de fond.** La même classe revient malgré quatre correctifs.

## Factory (`digit-ai-factory`) — remontée des retours

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-43 | bloquant | générique | **Les remontées ne se font pas correctement, et chaque correctif ne fait que déplacer le défaut.** Au registre du pilot, la classe `remontee-declaree-nulle-apres-correction` compte 5 occurrences en 23 jours, sur 4 produits : TF-1643 (12/10, Produit-64), TF-1987 (24/10, Produit-85), TF-1982 (26/10, Produit-73), TF-2078 (03/11, ce produit) et RT-42 (04/11, ce produit, lot 20261104a). Chacune a été close par un durcissement de S48 visant une formulation (« rien à remonter », clôture de run inexistante, extension de skill) ; la suivante est passée par une autre formulation, ici « reste au produit, parce que le retour sera consigné ». Sur ce produit, deux jours de suite, c'est le porteur qui a déclenché la remontée. Ledger seq 173 (demande du porteur citée), seq 164 et 171. | Traiter la classe comme un sujet de conception, et non par un cinquième correctif de formulation. Juger la remontée sur le FAIT : le hook de fin de tour relève les frictions détectables du tour (message correctif ou « pourquoi » du porteur, FAIL d'un outil ou d'un oracle de forge, écart d'un livrable au gabarit de sa forge, motif `hors_mandat` sur une consignation) et les compare aux entrées `type: retour` du ledger écrites dans le tour. Sans entrée correspondante, la ligne de remontée est refusée, quelle que soit sa formulation. Règle qui aurait évité le retour : aucune ; S48 juge le texte du bloc 9, jamais le ledger. **RT-43** : classe existante `remontee-declaree-nulle-apres-correction`. |

## Rattachement

Registre interrogé le 04/11/2026 à 10:27 au pilot, `todo/TODO.jsonl`, sur la classe `remontee-declaree-nulle-apres-correction` et les titres portant « rien à remonter » ou « remontée » : 9 items, dont 4 de cette classe (TF-1643, TF-1982 et TF-1987 corrigés, TF-2078 au statut `decide`), plus TF-1946 (en cours, préférences du porteur), qui porte la préférence « Remonte à la Factory se fait toujours ». Les 4 autres items portent un autre sens de « remontée ».

Items recoupés : TF-1643, TF-1982, TF-1987, TF-2078, TF-1946.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le défaut est dans les contrôles du pilot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Une fois demandée, la remontée a été faite dans le tour, oracle du lot à PASS, avec la demande du porteur citée mot pour mot.

## Ordre recommandé

1. RT-43 : seul retour du lot ; il rend le porteur inutile comme déclencheur des remontées.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-43 : aucune ; S48 juge le texte du bloc 9, jamais le ledger du tour.
