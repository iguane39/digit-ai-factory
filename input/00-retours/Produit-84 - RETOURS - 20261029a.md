# Retours forges — Produit-84 — 20261029a

- **Contexte** : préparation de la reprise de Produit-84 sur Cloudflare, GitHub et Supabase, du 28/10 au 29/10/2026 ; demande du porteur du 29/10/2026 à 09:45 « Remonte à la Factory ».
- **Références ledger** : `forge\ledger.jsonl` seq 8, 9, 14 et 19 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-29
- **Complétude** : 4 retours consignés au journal de ce produit depuis son ouverture, seq 8, 9, 14 et 19 ; aucun n'avait été remis. Ils sont portés ici, chacun avec sa candidature au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Factory (`digit-ai-factory`) — restitution et outillage de session

Trois défauts relevés pendant la préparation : un sur la forme de la restitution, deux sur des écrivains de trace.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-26 | majeur | générique | **Le livrable écrit n'est pas lié dans la synthèse d'ouverture, seconde demande humaine.** Le 29/10/2026 à 09:40, la restitution du guide `output/04-cadrages/Produit-84 - Guide - Lot 0 ouverture des comptes options et paiements - 20261029b.md` ne le nomme qu'aux blocs 8 et 9, sans lien ; `factory.mjs restitution --prejuger` l'a jugée affichable (exit 0). Retour du porteur, mot pour mot : « le prompt de restituation doit afficher le ou les fichiers qu'elle a générés et qui sont attendus par l'utilisateur dans le chapitre 0, en fin de chapitre, comme par exemple ce fichier (…), idéalement avec son lien pour que l'utilisateur puisse le voir directement et l'ouvrir rapidement et facilement ». Même demande que TF-1973, remontée par ce produit le 20/10/2026 et toujours candidate. Ledger seq 19. | Règle qui aurait évité le retour : aucune ne couvre un fichier livré ; S70 (`gabarits/RESTITUTION.md`, R-61 point 4) n'exige l'adresse qu'à un SERVICE déployé. (a) Le bloc 0 se clôt par une ligne « Livré : » portant un lien Markdown cliquable vers chaque livrable écrit dans le tour sous `output\`. (b) `oracle-synthese` compare les livrables écrits du tour, lus dans la transcription, aux liens de fin du bloc 0, avertissant puis bloquant. Fixture rouge : la restitution du 29/10/2026 à 09:40. **RT-26** : clé proposée `livrable-absent-du-bloc-0`, celle de TF-1973. |
| RT-27 | mineur | générique | **`mobiliser.mjs --verdicts` ignore en silence le champ `demande` du fichier qu'il lit.** Le squelette rendu par `--preparer` ne porte pas ce champ ; la session l'y a ajouté, et la trace du 29/10/2026 à 08:36:00 UTC est sortie avec `"demande": null`. `--verifier` a rendu PRESENT sans rien signaler. Il a fallu rejouer avec l'option `--demande`. Ledger seq 14. | (a) Le squelette porte `"demande": "<résumé>"` et `--verdicts` le lit. (b) À défaut, `--verdicts` refuse une écriture sans demande, comme `--type`. **RT-27** : clé proposée `champ-de-fichier-ignore-par-l-ecrivain`. |
| RT-28 | mineur | générique | **`forge/ledger.py` refuse le type que `oracle-conformite-projet` prescrit.** R-19 prescrit une entrée `rectification_versions_forges` ; `ledger.py`, gabarit du pilot, la refuse comme type inconnu, et `ledger.mjs` l'écrit en la déclarant hors vocabulaire. `ledger.py --verifier` le dit encore le 29/10/2026 à 09:36 : « seq 7 : type « rectification_versions_forges » hors du vocabulaire du pilot ». `run_open` n'invite pas non plus à porter `versions_forges`. Voisin de TF-1454 (corrigé le 28/09, côté oracle), sans le couvrir. Ledger seq 9. | Ajouter `rectification_versions_forges` au vocabulaire de `ledger.py` et `versions_forges` à `run_open`. Règle qui aurait évité le retour : aucune ; un test croisé entre types prescrits par les oracles et vocabulaire des écrivains manque. |

## Forge conception (`digit-ai-forge-conception`)

Un défaut relevé à la qualification de l'entrant, le 28/10/2026.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | majeur | générique | **Les skills de conception ne nomment pas le dossier de leurs livrables.** `qualifie-l-entrant`, `enumere-la-surface` et `redige-les-exigences` disent « ENTRANT.md en dépôt » ; `mobiliser.mjs --verifier` n'accepte que `forge/etapes/conception/EXIGENCES.json`. Écrit d'abord sous `forge/conception`, le livrable a été jugé MANQUE, puis déplacé et ses renvois réécrits. Ledger seq 8. | Nommer `forge/etapes/conception/` dans le démarrage rapide des trois skills. Règle qui aurait évité le retour : la liste des livrables exigés de `mobiliser.mjs`, que les skills ne citent pas. |

## Rattachement

Registre interrogé le 29/10/2026 :

- RT-26 : `grep -i "bloc 0\|synthèse d'ouverture" todo/TODO.jsonl | grep -i "lien\|fichier\|livrable\|chemin"` → 3 lignes trouvées, sortie complète.
- RT-27 : `grep "mobiliser" todo/TODO.jsonl | grep -i "demande"` → 1 ligne trouvée, sortie complète.
- RT-28 : `grep -i "rectification_versions_forges" todo/TODO.jsonl` → 3 lignes trouvées, sortie complète.
- RC-1 : `grep -i "ENTRANT.md en dépôt\|chemin-livrable-non-nomme" todo/TODO.jsonl` → 0 ligne trouvée.

Items recoupés :

- TF-1973, le livrable lié en fin de bloc 0 : RT-26 en est la seconde demande humaine.
- TF-0904 et TF-1587 : sans rapport avec RT-26.
- TF-1949, le verrou « livré » : sans rapport avec RT-27.
- TF-0801 et TF-1454, la lecture des rectifications par R-19, tous deux corrigés : voisins de RT-28, sans le couvrir.
- Pour RC-1 : aucun.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le cadrage du 29/10/2026 cite le menu GitHub « Billing and plans », devenu « Billing and licensing » | le guide du lot 0 porte le bon libellé ; le cadrage se corrige à son indice suivant | non | libellé d'une plateforme tierce, propre à ce dossier |
| `.env.example` cite encore `Produit-84-dev` et le cadrage du 28/10 | à aligner sur les noms CDC | non | dérive d'un fichier de ce produit après le renommage du 29/10 |
| Une question saisie à la main au journal (seq 16) sous D-1, renumérotée D-4 par `reserver-decision.mjs` | seule D-4 vaut ; le journal ne se réécrit pas | non | erreur de session, l'outil prescrit l'a rattrapée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le guide du lot 0 déclare la famille `gd-guide-de-reference` dans sa fiche de conception, sans reprendre le gabarit lui-même.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document repris cinq fois et plus le 29/10/2026, et aucun verdict de lecteur n'a été rendu.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **`reserver-decision.mjs`** a refusé de reprendre un numéro de décision : il a pris D-4 au-dessus des décisions D1 à D3 du deck, et non le D-1 saisi à la main.
- **`allouer-indice.mjs`** a donné l'indice « b » au guide du 29/10, l'indice « a » étant déjà porté par le cadrage, ce qui évite le défaut d'indice partagé signalé à l'ouverture.
- **La relecture d'intention** a fait retirer du guide un bloc de corrections du cadrage que personne n'avait demandé.

## Ordre recommandé

1. RT-26 : seconde demande humaine de la même règle en 9 jours, effort faible, et elle touche chaque restitution qui livre un fichier.
2. RC-1 : un livrable déplacé et ses renvois réécrits à chaque produit qui mobilise la conception.
3. RT-27, puis RT-28 : traces correctes après un geste de plus, coût faible mais répété.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-26 suit un retour humain : aucune règle existante ne le couvre. S70 de `gabarits/RESTITUTION.md` ne vise qu'un service déployé, ce qui déclenche la règle § 4 de quality-oracles : la proposition (b) de RT-26 définit le contrôle d'`oracle-synthese` qui manque. RT-27, RT-28 et RC-1 ont été trouvés par la session, sans retour humain.

Classes proposées, aucune clé du référentiel ne convenant :

- **RT-26** : clé proposée `livrable-absent-du-bloc-0`, famille `restitution-forme`, libellé « Le livrable construit n est ni lié ni nommé par son chemin complet en fin de synthèse d ouverture » (celle de TF-1973).
- **RT-27** : clé proposée `champ-de-fichier-ignore-par-l-ecrivain`, famille `contrat-interface-forge`, libellé « Un écrivain de trace lit un fichier d entrée mais ignore en silence un champ que l utilisateur y a mis, faute de l avoir prévu ».
- **RT-28** : clé proposée `type-prescrit-hors-vocabulaire-de-l-ecrivain`, famille `tracabilite-ledger`, libellé « Un oracle prescrit un type d entrée de ledger que l écrivain du gabarit refuse ou déclare hors vocabulaire ».
