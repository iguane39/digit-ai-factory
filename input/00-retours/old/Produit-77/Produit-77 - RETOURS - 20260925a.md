# Retours forges : Produit-77, 20260925a

<!-- Gabarit du pilot (forge\retours\GABARIT-LOT-RETOURS.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS : le lot suivant est un nouveau fichier daté. -->

- **Contexte** : autre. Session de mise au modèle de branches du projet commun, 24 et 25/09/2026 ;
  les trois retours sont nés le 25/09 en écrivant les entrées de ledger du jour, quand le juge
  d'intégrité a été joué sur le ledger du produit et sur des ledgers jetables.
- **Références ledger** : `forge\ledger.jsonl` seq 141 (entrée `type: retour`), et seq 137 (la
  rectification d'horodatage qui porte les mesures de RS-3).
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de
  `input\00-retours\` ; l'original reste ici, historique du produit.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

---

## forge des agents (`digit-ai-forge-agents`)

Le vérificateur d'intégrité du ledger rend des verdicts faux dans les deux sens dès qu'un ledger
mêle deux écritures de l'heure, ce que son propre `append` provoque.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | majeur | générique | **`ledger.mjs verify` compare les horodatages comme des chaînes, sans les ramener à un même fuseau.** `append` horodate en UTC (`new Date().toISOString()`, suffixe `Z`, ligne 342), alors que le ledger de ce produit écrit l'heure de Paris avec son décalage (`+02:00`) ; la monotonie se juge par `e.ts < tsMax` (ligne 610). Mesuré le 25/09 sur deux ledgers jetables de deux entrées, commit `ea0fff9` : (a) seq 2 écrite 15 minutes APRÈS la seq 1, mais en UTC (`09:30:00+02:00` puis `07:45:00.000Z`) : exit 1, « horodatage décroissant », à tort ; (b) seq 2 écrite 15 minutes AVANT la seq 1 (`07:45:00.000Z` puis `09:30:00+02:00`) : exit 0, PASS, à tort. | Comparer des instants (`Date.parse`), jamais des chaînes ; ou refuser à l'`append` un horodatage dont la forme diffère de celle du fichier. La paire de fixtures est donnée ci-dessous. |

Les deux ledgers jetables, tels qu'ils ont été joués (cas (a) puis cas (b)) :

```
{"seq":1,"ts":"2026-09-25T09:30:00+02:00","type":"run_open"}
{"seq":2,"ts":"2026-09-25T07:45:00.000Z","type":"retour"}

{"seq":1,"ts":"2026-09-25T07:45:00.000Z","type":"run_open"}
{"seq":2,"ts":"2026-09-25T09:30:00+02:00","type":"retour"}
```

## pilot (`digit-ai-factory`)

La règle R-42 de `oracle-conformite-projet` porte le même défaut que RA-1 ; et les heures de
ledger écrites d'estimation reviennent chez ce produit, sans classe pour les compter.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-2 | majeur | générique | **R-42 compare les horodatages comme des chaînes (`ts < tsMax`, ligne 1302), comme RA-1.** Mesuré le 25/09 sur les deux mêmes ledgers jetables, posés chacun dans une racine jetable, `oracle-conformite-projet.mjs <racine> --regles R-42`, commit `e6e4b46` : cas (a) R-42 FAIL « horodatage décroissant », à tort ; cas (b) R-42 PASS « horodatages non décroissants », à tort. | Même correctif que RA-1, dans R-42 et dans toute lecture de ledger qui juge un ordre ; la paire de RA-1 sert de fixture aux deux. |
| RS-3 | majeur | produit+générique | **Des sessions produit écrivent l'heure d'une entrée de ledger en la composant au lieu de la relever.** Six entrées de ce ledger portent une heure POSTÉRIEURE à leur propre commit, mesurée le 25/09 par `git log -S` : seq 127 (commit `c74568b` 18:57:16, écrite 19:35), 128 (`faabeb3` 19:23:04, écrite 19:25), 132 et 133 (`9efe790` 15:38:37, écrites 16:30 et 16:35), 134 (`f4544c7` 16:15:39, écrite 17:05), 135 (`c09dd94` 16:24:58, écrite 17:30). Deux sessions, deux jours. La 127 a fait paraître la 128 en recul, et R-42 était rouge sur `env/dev`, sans rectification. Une branche en cours porte deux autres reculs, seq 134 et 135. La famille `horodatage-invente` du référentiel ne porte aucune classe. | Donner au produit, par l'héritage, un écrivain de ledger qui relève l'heure au format du fichier : le contrat 3 veut un horodatage machine, et l'outil qui l'attribue vit dans la forge des agents, hors de l'héritage du produit. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Recul d'horodatage de la seq 128, déjà fusionné sur `env/dev` | Rectification par ajout, seq 137 ; `ledger.mjs verify` et R-42 PASS, la 128 imprimée [RECTIFIÉ] | oui | Généralisable : la cause est remontée ci-dessus en RS-3, la rectification elle-même est propre à ce ledger. |
| Le vérificateur des déclencheurs de rejeu du produit ne classait dans aucune famille la chaîne d'infrastructure ajoutée sous `infra/`, son motif étant ancré à la racine | Motifs ajoutés aux familles outil et autonomie, vu rouge puis vert, demande de fusion 3845 | non | Rien de généralisable à une forge : l'outil est propre au produit, écrit pour la politique de sécurité IA du groupe, et aucune forge ne le fournit. |
| L'artefact de plan publié par le gabarit Terraform du dépôt commun Client-A embarque l'état en clair | Non corrigé ici : le gabarit appartient au dépôt commun | oui | Généralisable, mais hors factory : remonté au dépôt commun, ledger seq 140. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : la mesure `--murs` du juge des lots en version 1.4.0 (branche
`gabarit/guide-de-reference` du pilot) rend 0 document à 5 versions datées ou plus sous `output\`.

## Confirmations positives

- La rectification par ajout (TF-0794) est consommée par les deux juges : après la seq 137,
  `ledger.mjs verify` rend PASS sur 141 entrées et R-42 PASS, la seq 128 restant imprimée
  [RECTIFIÉ]. Le remède prescrit solde bien le défaut qu'il vise.
- `ledger.mjs verify` accumule les écarts au lieu de s'arrêter au premier (TF-0410) : sur la
  branche en cours qui porte trois reculs, les trois sont nommés.

## Ordre recommandé

1. RA-1, parce que l'`append` de la forge des agents est ce qui introduit l'écriture UTC dans un
   ledger qui écrit l'heure locale : c'est la source du mélange.
2. RS-2, même correctif, puisque R-42 est le juge que joue la conformité de chaque produit.
3. RS-3, qui demande une classe et un écrivain hérité.

## La règle qui aurait évité le retour (TF-0779)

- **RA-1 et RS-2** : aucune règle existante ne couvre des horodatages à fuseaux mêlés. Classe
  proposée : clé `horodatages-compares-comme-chaines`, famille `regle-morte`, libellé « Un
  contrôle compare des horodatages ISO comme des chaînes sans les ramener à un même fuseau : une
  entrée postérieure écrite en UTC est accusée de recul, un vrai recul écrit avec décalage passe ».
- **RS-3** : la règle existe (contrat d'interface 3, horodatage machine attribué à l'écriture),
  mais l'outil qui la tient n'est pas hérité par le produit. Classe proposée : clé
  `horodatage-de-ledger-compose-a-la-main`, famille `horodatage-invente`, libellé « Une session
  écrit l'heure d'une entrée de ledger en la composant au moment de rédiger au lieu de la relever :
  l'heure suit ou précède son propre commit, et le recul apparaît chez l'entrée suivante ».
