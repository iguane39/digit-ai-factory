# Retours forges — Produit-86 — 20261105c

- **Contexte** : clôture du run 20261105a-evolution-revue-porteur, après les lettres du porteur « 112b, 113a » puis « 115a » (arrivée de l'approbateur sur « À traiter », purge des missions de test de la préproduction, redéploiement), et sa remarque du 05/11 sur le format de restitution : « Le format de restitution ne correspond pas au format Factory. Déjà signalé sur d'autres produits. »
- **Références ledger** : `forge\ledger.jsonl` seq 441, 498 et 515 (entrées `type: retour`), 501, 502 et 516 (lettres du porteur)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 241 classes, filtré sur `restitution|prejug|avertiss|faux-positif|code-attendu`. Classes existantes retenues : `severite-declaree-invisible-au-consommateur` (RP-23), `oracle-faux-positif` (RP-24, RP-25). Aucune classe nouvelle proposée.

## pilot (hook de restitution, `mobiliser.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-23 | majeur | générique | Le préjugement de restitution rendait `affichable: true` avec 11 avertissements de forme (S78, S31, S32, S16, S18…) sur une restitution que le porteur a refusée : décisions hors format B, bloc 8 sans ses colonnes, pas d'inventaire des bloquants. La session n'a pas lu les avertissements, faute de code de sortie non nul. Déjà signalé sur d'autres produits (TF-1979 à TF-1987, 29/10). Ledger seq 498. | Rendre bloquants au préjugement les avertissements de forme des blocs 2, 3 et 8, ou faire sortir `--prejuger` en code non nul tant qu'un avertissement de forme subsiste. Constaté depuis : le préjugement sort désormais en 1 tant qu'un avertissement reste, ce qui a suffi à corriger 8 avertissements en deux passes. |
| RP-25 | majeur | générique | `mobiliser.mjs --verifier` juge le premier fichier qui répond au motif d'un livrable (`trouver()` de `oracles/lib-mobilisation.mjs`), puis sa date. Le 05/11, le rapport forge-tests du jour (`rapport-20261105-d112-d113.json`) est déclaré manquant, parce que `rapport-20261103-compteur-foundry.json` le précède dans le dossier. Deuxième occurrence (04/11 puis 05/11). Ledger seq 441. | Retenir, parmi les fichiers du motif, le plus récent, et ne déclarer « périmé » que si aucun n'est postérieur à la demande. |

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-24 | majeur | générique | Le pan `parcours-personas` rejoue sous chaque identité les routes relevées dans `tests/e2e/test_parcours_profils.py`, dont `/adresse-inconnue-e2e`, que le test E-069 attend précisément en 404. Il compte ce 404 en défaut (1 route sur 6 par persona) et rend 2/4 sous le seuil, en bloquant. Rapport `forge/etapes/tests/rapport-20261105-d112-d113.json`. Ledger seq 515. | Ne pas compter un code que le test porteur de la route attend (assertion 404, nom « inconnue »), ou laisser le produit déclarer les routes à code attendu dans `forge/matrice-droits.json`. |

## La règle qui aurait évité le retour

Aucune règle nouvelle : RP-23 relève de `severite-declaree-invisible-au-consommateur` et RP-24, RP-25 de `oracle-faux-positif`, dont les règles existent.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le test de mise en production rend FAIL sur E-108 et E-109 quand la machine Azure des workers est arrêtée, au lieu de dire « indéterminé » | non corrigé : démarrer la machine engage une dépense, laissée au porteur | non, propre à la chaîne du produit | reste au produit, parce que la preuve de sortie dépend de cette machine du produit |
| Une commande `docker exec … /srv/…` lancée depuis Git Bash voit son chemin réécrit ; le script de purge a refusé, faute de sauvegarde trouvée | relancée avec `MSYS_NO_PATHCONV=1`, comme le fait déjà `deployer.sh` | oui, déjà connu de la chaîne (`deployer.sh`) | erreur de la session, corrigée |
| Les anciens e2e créaient des missions sur la préproduction à chaque passage | les 9 parcours qui créent une mission ne se jouent qu'avec `PENTEST_E2E_ECRITURE=1` (D-113 a) | oui, porté par RP-17 du lot 20261105b | déjà remonté |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105b) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le refus du script de purge sans sauvegarde à manifeste a arrêté une purge mal lancée sans rien retirer : un garde-fou d'action irréversible a servi au premier usage.
- La répétition de la purge sur une copie de la sauvegarde, avant la préproduction, a montré le résultat exact (237 retirées, 4 gardées, audit intact) avant le geste.

## Ordre recommandé

RP-24 d'abord (il rend bloquant un produit conforme), puis RP-25 (deuxième occurrence), puis RP-23.
