# Retours forges — Produit-86 — 20261112b

- **Contexte** : run `20261112a-comptes-et-ecritures`. En préparant le lot 3 de pentest sur Produit-84 (sondes actives non destructives, D-484 (c)), la session a lu l'outil de scan dynamique de forge-websec qui doit les jouer.
- **Références ledger** : `forge\ledger.jsonl` seq 952 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 12/11/2026 est `todo/CLASSES.json` du pilot. RP-64 s'y rattache à `documentation-d-outil-differente-de-sa-sortie` : l'en-tête de l'outil annonce un mode actif que son exécution ne joue pas.

## digit-ai-forge-websec

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-64 | bloquant | générique | `oracles/oracle-dast.mjs` (forge-websec 092393c) accepte `--mode actif` et exige `actif_autorise: true` dans l'autorisation (lignes 27 et 184). L'exécution lance pourtant toujours `zap-baseline.py`, la passe passive, avec les mêmes arguments dans les deux modes (lignes 334 à 344). L'outil ne sait pas non plus porter un en-tête (jeton de service d'une porte d'accès), borner le débit (10 requêtes par minute au mandat), ni exclure des chemins (envoi de courriel, effacement). Mesuré le 12/11/2026 par lecture ; ZAP absent du poste. Le lot 3 de Produit-86 ne peut pas jouer (ledger seq 952). | Un mode actif réel (`zap-full-scan.py`, ou une politique de règles actives non destructives) et des options d'en-tête, de débit et d'exclusion, toutes portées par le fichier d'autorisation, chacune prouvée par une fixture. |

## La règle qui aurait évité le retour

- `documentation-d-outil-differente-de-sa-sortie` (RP-64) : un mode annoncé par un outil a sa fixture qui prouve qu'il change ce que l'outil exécute.

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

- Le garde-fou d'autorisation de l'outil (cible exacte, fenêtre, accord écrit) est déjà celui dont un mandat signé a besoin : Produit-86 pourra produire ce fichier depuis le mandat.
