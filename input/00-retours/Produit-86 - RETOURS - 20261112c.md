# Retours forges — Produit-86 — 20261112c

- **Contexte** : run `20261112a-comptes-et-ecritures`. En préparant l'installation de ZAP sur le poste pour le lot 3 de pentest sur Produit-84, la session a relu la voie « poste » de l'outil de scan dynamique de forge-websec.
- **Références ledger** : `forge\ledger.jsonl` seq 954 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 12/11/2026 est `todo/CLASSES.json` du pilot. RP-65 s'y rattache à `documentation-d-outil-differente-de-sa-sortie` : l'outil annonce une passe passive par défaut, et sa voie « poste » joue une attaque.

## digit-ai-forge-websec

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-65 | bloquant | générique | Dans `oracles/oracle-dast.mjs` (forge-websec 092393c), quand ZAP est trouvé sur le poste en `zap.bat` ou `zap.sh`, l'outil lance `-cmd -quickurl <cible> -quickout <rapport>` quel que soit le mode demandé. `-quickurl` est l'attaque rapide de ZAP : exploration, puis scan actif. Une passe demandée passive joue donc un scan actif, et `actif_autorise: true` n'est jamais exigé sur cette voie. Mesuré le 12/11/2026 par lecture de la branche de construction des arguments. Ce défaut est distinct de RP-64 (lot 20261112b), où le mode actif reste passif sur la voie Docker. | En mode passif, la voie « poste » joue l'exploration et les règles passives seulement ; elle n'attaque qu'en mode actif autorisé. Une fixture par voie et par mode relève la commande réellement lancée. |

## La règle qui aurait évité le retour

- `documentation-d-outil-differente-de-sa-sortie` (RP-65) : chaque voie d'exécution d'un outil a sa fixture, qui prouve que le mode annoncé est celui qu'elle lance.

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré au lot 20261109b) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- La voie Docker de l'outil reste passive dans les deux modes : elle n'attaque jamais par erreur.
