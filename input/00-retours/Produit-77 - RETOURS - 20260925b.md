# Retours forges : Produit-77, 20260925b

<!-- Gabarit du pilot (forge\retours\GABARIT-LOT-RETOURS.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS : le lot suivant est un nouveau fichier daté. -->

- **Contexte** : autre. Même session que le lot `Produit-77 - RETOURS - 20260925a`, remis
  le même jour et donc immuable : ce retour est né après sa remise, en préparant la résolution du
  conflit de ledger que la fusion de deux demandes parallèles du produit provoquera.
- **Références ledger** : `forge\ledger.jsonl` seq 142 (entrée `type: retour`).
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de
  `input\00-retours\` ; l'original reste ici, historique du produit.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

---

## forge des agents (`digit-ai-forge-agents`)

Le remède que le pilot prescrit à une collision de seq depuis TF-0794 est consommé par R-42 et
refusé par l'outil de la forge des agents : le même ledger est intègre pour l'un, rompu pour l'autre.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-2 | majeur | générique | **`ledger.mjs verify` ne consomme pas la rectification d'une collision de seq, alors que R-42 du pilot la consomme.** Mesuré le 25/09 sur un ledger jetable de six entrées (ci-dessous) : seq 1, 2 et 3, puis 2 et 3 d'une branche parallèle, puis une `rectification_horodatage` (seq 4) qui nomme les seq 2 et 3 dans `entrees[]` avec les quatre champs dus. R-42 de `oracle-conformite-projet` (commit `e6e4b46`) : PASS, les deux seq imprimées [RECTIFIÉ]. `ledger.mjs verify` (commit `ea0fff9`) : exit 1, « ligne 4 : seq 2 attendu 4 (append-only rompu) », et la rectification déclarée [SANS OBJET], sa passe ne traitant que les horodatages. | Porter dans `verify` la règle de TF-0794 telle que R-42 la tient : un seq en double ou en recul nommé par une rectification ultérieure est [RECTIFIÉ], la suite reprend au plus haut seq vu. Le ledger ci-dessous sert de fixture aux deux juges. |

Le ledger jetable, tel qu'il a été joué :

```
{"seq":1,"ts":"2026-09-25T09:00:00+02:00","type":"run_open"}
{"seq":2,"ts":"2026-09-25T09:10:00+02:00","type":"retour"}
{"seq":3,"ts":"2026-09-25T09:20:00+02:00","type":"retour"}
{"seq":2,"ts":"2026-09-25T09:30:00+02:00","type":"retour"}
{"seq":3,"ts":"2026-09-25T09:40:00+02:00","type":"retour"}
{"seq":4,"ts":"2026-09-25T09:50:00+02:00","type":"rectification_horodatage","resume":"collision de seq par deux branches paralleles","entrees":[{"seq":2,"ts_consigne":"2026-09-25T09:30:00+02:00","ts_reel_estime":"2026-09-25T09:30:00+02:00","cause":"deux branches, meme queue (1), fusionnees l'une apres l'autre"},{"seq":3,"ts_consigne":"2026-09-25T09:40:00+02:00","ts_reel_estime":"2026-09-25T09:40:00+02:00","cause":"meme collision"}]}
```

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Deux demandes de fusion ouvertes du produit ajoutent chacune des seq au ledger à partir de 134 : la seconde fusionnée entrera en conflit | Pas encore : la résolution suivra la fusion de la première, en gardant les deux blocs et en ajoutant une rectification qui nomme les seq en collision | oui | Généralisable : la collision elle-même est le cas normal que le contrat 3 amendé prévoit ; ce qui ne l'est pas, le juge qui la refuse, est remonté ci-dessus en RA-2. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : la mesure `--murs` du juge des lots en version 1.4.0 rend
0 document à 5 versions datées ou plus sous `output\`, comme pour le lot 20260925a.

## Confirmations positives

- R-42 du pilot consomme la rectification d'une collision de seq exactement comme TF-0794 le
  prescrit : la suite reprend au plus haut seq vu, et les seq en collision restent imprimés.

## Ordre recommandé

1. RA-2 : c'est le seul retour de ce lot, et il conditionne le jugement du ledger du produit dès
   que ses deux demandes de fusion ouvertes seront intégrées.

## La règle qui aurait évité le retour (TF-0779)

La règle existe : TF-0794, au contrat d'interface 3 amendé et dans R-42. Elle n'a pas été portée
dans le second juge de la même règle. Classe proposée : clé `deux-juges-d-un-meme-contrat-divergent`,
famille `contrat-interface-forge`, libellé « Deux outils jugent la même règle d'un contrat partagé
et l'un reçoit une correction que l'autre n'a pas : le même fichier est PASS chez l'un et FAIL chez
l'autre ». Classe voisine écartée : `boucle-retour-sans-descente`, qui vise la descente d'une
correction vers un producteur, pas l'écart entre deux juges.
