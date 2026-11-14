# Retours forges — Produit-86 — 20261105d

- **Contexte** : question du porteur du 05/11/2026, hors run : « Qu'est-ce que la machine Azure des Workers ? Il n'y a pas d'Azure dans le projet aujourd'hui. » La session avait posé une décision (D-469, démarrer cette machine) en la décrivant comme active, alors que l'exécution est passée sur le Docker du poste le 04/11 (D-49). D-469 retirée.
- **Références ledger** : `forge\ledger.jsonl` seq 527 (entrée `type: retour`), 303 (lettre « 46b »), 373 (consigne D-49)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 241 classes, filtré sur `remplac|decision|infra|orphelin|premisse`. Aucune classe ne décrit une décision humaine qui en remplace une autre sans retirer ce que la première a créé : RP-26 propose la sienne.

## pilot (gabarit de décision, doctrine des décisions)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-26 | majeur | générique | D-49 (04/11, exécution sur le Docker du poste) a remplacé D-46 b (03/11, machine Azure des workers) sans retirer ce que D-46 b avait créé : 11 ressources Azure (groupe `CL3_APP_PTS_D1`, 15 éléments dans l'état Terraform `infra/workers`), deux exigences (E-108, E-109) et leurs contrôles au smoke de MEP, qui rendent FAIL à chaque déploiement. La session a ensuite posé D-469 (démarrer la machine) en la décrivant comme « la machine qui lance les tests d'intrusion des missions client », d'après le seul smoke, sans lire l'exécuteur servi (`PENTEST_EXECUTEUR=docker-local`) ; le porteur a relevé l'erreur. Ledger seq 527. | À la réponse qui remplace une décision, lister ce que la décision remplacée a créé (infrastructure, exigences, contrôles) et le retirer ou le marquer ; dans le gabarit de décision, « De quoi s'agit-il » cite où l'application emploie l'objet (fichier, variable servie). |

## La règle qui aurait évité le retour

- `decision-remplacee-sans-retrait-de-ses-artefacts` (RP-26) : une décision qui en remplace une autre retire, ou marque comme retiré, tout ce que la première a créé ; une ressource n'est décrite dans une décision qu'après lecture de l'endroit où l'application l'emploie.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Aucun test de bout en bout n'enchaîne opérateur, approbateur, agent IA et jobs Docker | décision D-470 posée au porteur | oui, porté par RP-17 du lot 20261105b | déjà remonté |
| Le lab WebGoat du poste est signalé « unhealthy » par `docker ps` | non diagnostiqué, signalé au porteur | non | reste au produit, parce que c'est l'état d'un conteneur de ce poste |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105c) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- La question du porteur a été vérifiée par la configuration servie, l'état Terraform et la liste des ressources Azure avant toute réponse : trois mesures concordantes.

## Ordre recommandé

RP-26 seul.
