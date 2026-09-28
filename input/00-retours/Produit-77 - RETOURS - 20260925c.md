# Retours forges : Produit-77, 20260925c

<!-- Gabarit du pilot (forge\retours\GABARIT-LOT-RETOURS.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS : le lot suivant est un nouveau fichier daté. -->

- **Contexte** : autre. Même session que les lots `Produit-77 - RETOURS - 20260925a` et
  `20260925b`, déjà remis : ce retour est né après eux, en rejouant la conformité de l'héritage
  du produit avant de la citer.
- **Références ledger** : `forge\ledger.jsonl` seq 143 (entrée `type: retour`).
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de
  `input\00-retours\` ; l'original reste ici, historique du produit.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

---

## pilot (`digit-ai-factory`)

R-47 rend rouge la conformité du produit sur trois fichiers qu'elle n'a pas lus, et prescrit un
remède qui détruirait des preuves.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-4 | mineur | générique | **Le contrôle « fichiers d'apparence secrète suivis sous `forge\` » de R-47 juge le CHEMIN et jamais le contenu.** `oracle-conformite-projet.mjs` (commit `e6e4b46`, ligne 987) teste le motif `secret` sur les chemins suivis, puis prescrit `git rm --cached`. Mesuré le 25/09, même FAIL avec et sans l'héritage : `forge/etapes/audit/input/03 - Sécurité & secrets/.gitkeep` (0 octet), le rapport `Client-A - CIA - Scan secrets gitleaks - 20260821a.json` (0 constat, aucun champ de valeur), `forge/etapes/tests/preuve-secrets-20260817a.json` (aucun champ de valeur). Appliqué, le remède retire du dépôt la preuve d'une analyse de secrets. Aucune voie d'exemption déclarée. | Lire le contenu avant d'accuser (fichier vide, rapport d'analyse à 0 constat), ou admettre une exemption datée et motivée, dans le carnet des écarts assumés ou dans `.oracles-exemptions.json`. |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot : vérifié par l'agent de la session, le
25/09/2026. Les trois fichiers restent suivis, et le constat reste rouge chez le produit tant que
le pilot n'a pas tranché RS-4.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : même mesure que pour le lot 20260925a, 0 document à 5 versions
datées ou plus sous `output\`.

## Confirmations positives

- La ligne des artefacts hérités de R-47 est juste : 16 artefacts hérités présents et à jour sur la
  branche de l'héritage, et les 12 absences nommées une à une sur une branche qui ne l'a pas.

## Ordre recommandé

1. RS-4 : seul retour du lot, de gravité mineure ; il laisse un FAIL permanent chez tout produit
   qui range une preuve d'analyse de secrets sous `forge\`.

## La règle qui aurait évité le retour (TF-0779)

Classe existante, et ce retour en est une récidive : `oracle-faux-positif` (famille
`regle-morte`), « un oracle rend rouge sur un artefact conforme : le verdict opposé cesse d'être
prononçable, et l'auteur apprend à ignorer ». La règle qui l'aurait évité est celle du skill
quality-oracles, § 3 : un oracle observe l'artefact réel, jamais son seul nom.
