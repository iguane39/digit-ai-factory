# Retours forges — Produit-86 — 20261109b

- **Contexte** : clôture du run `20261109a-jeton-par-le-env`. Le jeton d'accès est rangé depuis le `.env`, la règle Service Auth est appliquée dans Produit-84, et le pentest authentifié de `Produit-84-dev.pages.dev` est fait. forge_tests a rendu SKIP sur 3 pans à 2 jeux sur 3 : la suite backend sous couverture dépassait son délai par défaut de 900 s.
- **Références ledger** : `forge\ledger.jsonl` seq 751 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 09/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 09/11/2026 : `todo/CLASSES.json` du pilot. RP-56 se rattache à `controle-vrai-sur-le-mauvais-invariant` : un délai de calcul est lu comme un défaut du code mesuré. À défaut d'une classe plus juste, il propose aussi la sienne au sidecar.

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-56 | majeur | générique | forge_tests rend SKIP sur les pans api, data et migrations quand la suite backend sous couverture dépasse 900 s, son délai par défaut. C'est arrivé à 2 jeux sur 3 le 09/11/2026, pendant que le poste jouait aussi la préproduction. Le verdict global reste PARTIEL, et ne distingue pas un délai dépassé d'une suite rouge sans lire `motifs_non_couverture`. Avec `FORGE_TESTS_DELAI_BACKEND_S=1800`, le 3e jeu rend 173/173, 140/140 et 12/12. Ledger seq 751. | Un verdict dédié (`DELAI_DEPASSE`) au lieu de SKIP, et un délai proportionné à la durée mesurée de la suite du produit. |

## La règle qui aurait évité le retour

- `delai-lu-comme-defaut` (RP-56, classe proposée) : un contrôle interrompu par son délai le dit comme tel, sans se confondre avec un défaut ni avec une absence.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La charge maximale du mandat n'était pas appliquée par l'outil des jobs | intervalle tiré de la charge, budget sous la durée du ticket (`74fb5f6`) | non : propre au produit | reste au produit, parce que c'est son code |
| Un conteneur créé mais pas encore démarré était lu comme sorti, puis retiré | l'état `created` vaut « en cours » (`9085d74`) | non : propre au lanceur du produit | reste au produit, parce que c'est son code |
| Une fausse clé de test passait dans le rapport de forge-tests par le nom des cas paramétrés | identifiants nommés (`74fb5f6`) | oui : tout produit dont les cas paramétrés portent de faux secrets | reste au produit, parce que le remède est dans ses tests et que le balayage du produit l'a pris |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261109a) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le contrôle R-61 bis a relevé, à la clôture, que l'oracle d'exploitabilité joué n'était pas consigné au ledger du run.
- Le balayage des secrets du produit a pris une fausse clé recopiée par un outil tiers dans un rapport, avant tout commit.
