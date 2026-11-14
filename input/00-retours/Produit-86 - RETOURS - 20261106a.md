# Retours forges — Produit-86 — 20261106a

- **Contexte** : clôture du run `20261106a-evolution-parcours-visiteur-anonyme`. Sur la lettre « 478a » du porteur, le parcours du visiteur anonyme a son propre fichier, et le pan `parcours-personas` de forge-tests passe de 2/4 à 4/4. Le porteur a demandé en même temps si les pentests s'exécutent correctement pendant les tests automatisés : la réponse, relue en base et sur le lab, a mis au jour les retours RP-43 et RP-44.
- **Références ledger** : `forge\ledger.jsonl` seq 607, 608 et 609 (entrées `type: retour`) ; seq 595 pour la relecture de l'exécution ; retours antérieurs cités : RP-24 et RP-25 (lot 20261105e).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 06/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 06/11/2026 : `todo/CLASSES.json` du pilot, 254 classes, filtré sur `rouge|skip|derive|convergence|resultat|faux-vert|invariant`. RP-43 se rattache à `controle-vrai-sur-le-mauvais-invariant` : le parcours mesurait l'état du job, grandeur corrélée, au lieu de la justesse de son résultat. Aucune classe ne décrit une suite rouge rendue en SKIP (RP-42) ni un apply Terraform qui rend PASS sans converger (RP-44) : chacun propose la sienne.

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-42 | majeur | générique | forge_tests a été joué alors que la suite backend du produit était rouge (1 test sur 616). Les pans api, data et migrations sont sortis en SKIP, avec le motif « couverture non mesurable tant que la suite est rouge ». Le verdict global est resté PARTIEL, le même que celui d'un jeu vert dont seuls des pans non demandés manquent. Mesure : rapport du 06/11 à 09:2x ; rejoué sur la suite verte, 167/167, 135/135 et 9/9, toujours PARTIEL. Ledger seq 607. | Une suite backend rouge rend FAIL, ou un verdict distinct de PARTIEL, qui nomme le test rouge ; jamais SKIP. |
| RP-43 | majeur | générique | Le porteur a dû demander si les pentests s'exécutent correctement pendant les tests automatisés. Les 34 parcours de bout en bout jugeaient l'état du job (SUCCEEDED) et la présence d'un constat, sans aucune assertion sur le contenu d'un constat. Une régression de l'outil qui relève de faux en-têtes absents serait passée verte. Aucun pan de forge-tests ne signale un parcours qui attend la fin d'un traitement sans juger son résultat. Ledger seq 608 ; vérité du lab relevée en seq 595. | Dans le pan des parcours, relever un parcours qui attend la fin d'un traitement (job, import, calcul) sans assertion sur son résultat, et exiger une vérité de référence relevée hors du produit, avec sa contre-épreuve. |

## digit-ai-forge-ops

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-44 | majeur | générique | À chaque plan, le fournisseur Terraform Docker annonce 5 conteneurs « mis à jour sur place » (sondes de santé, `memory_swap`) et ne les applique jamais. La sonde de WebGoat, désactivée au code depuis le 04/11 (commit `7264230`), n'a jamais atteint le conteneur, marqué « unhealthy » depuis 47 h. La chaîne de déploiement rend PASS après chaque apply sans vérifier que l'état converge. Mesure : `terraform plan` en lecture seule le 06/11, « Plan: 0 to add, 5 to change, 0 to destroy », sur une préproduction déployée la veille par la même chaîne. Ledger seq 609. | La chaîne re-planifie après l'apply et signale un plan non vide ; un attribut que le fournisseur ne sait pas changer sur place force le remplacement du conteneur. |

## La règle qui aurait évité le retour

- `suite-rouge-rendue-en-skip` (RP-42, classe proposée) : une suite rouge est un échec nommé, jamais une absence de mesure.
- `controle-vrai-sur-le-mauvais-invariant` (RP-43) : un parcours de traitement juge le résultat contre une vérité indépendante, pas seulement l'état final.
- `infra-appliquee-sans-convergence` (RP-44, classe proposée) : un déploiement n'est réussi que si le plan suivant est vide.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le parcours du visiteur anonyme, rangé avec ceux des 2 profils, faisait rejouer sa 404 voulue sous chaque compte | fichier à part qui ne nomme aucun profil, compte inexistant pour l'essai d'identifiants faux (commit `1a01d70`) ; parcours-personas 4/4 | oui | déjà remonté (RP-24) : le pan rattache un fichier à un profil dès qu'un mot, même un nom de constante, le cite |
| Le harnais de `test_exploitation` lisait en UTF-8 la sortie cp1252 du CLI enfant (exception de thread, test resté vert) | `PYTHONIOENCODING=utf-8` posé pour l'enfant (commit `1a01d70`) | non : propre au harnais de ce produit sous Windows | reste au produit, parce que le harnais est à lui ; consigné au ledger seq 606 |
| `mobiliser --verifier` retient le rapport forge-tests du 03/11 et masque celui du jour | aucune correction côté produit | oui | déjà remonté (RP-25) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105h) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le contrôle d'hygiène du produit (E-128) a relevé dans l'inventaire de couverture le nom d'un test que ce run venait de renommer, avant tout commit.
- Le jeu réel du pan `parcours-personas` a montré, route par route, ce qui avait changé : sous chaque profil, 5 routes à 200, et l'adresse inconnue absente.

## Ordre recommandé

RP-43 d'abord (c'est la question que le porteur a dû poser lui-même), puis RP-44, puis RP-42.
