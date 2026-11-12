# Retours forges — Produit-86 — 20261112a

- **Contexte** : ouverture du run `20261112a-comptes-et-ecritures` ; l'isolation automatique de l'agent constructeur a échoué avant tout travail.
- **Références ledger** : `forge\ledger.jsonl` seq 950 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 12/11/2026 est `todo/CLASSES.json` du pilot. RP-63 s'y rattache à `controle-vrai-sur-le-mauvais-invariant` : la garde compare 2 écritures d'un même chemin au lieu du chemin lui-même.

## digit-ai-forge-agents

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-63 | majeur | générique | L'isolation automatique d'un agent a été refusée 2 fois le 12/11/2026 avec ce message : « Refusing to use … as an isolation worktree: git resolves its working tree to C:/dev/… ». La session a pour racine `c:\dev\_Client-A\Produit-86`, en minuscule, et git la résout en `C:/dev/…`. Résultat : 2 copies de travail vides et verrouillées, retirées à la main (ledger seq 950). | Comparer les chemins sans tenir compte de la casse de la lettre de lecteur sous Windows, ou normaliser la racine de session à l'ouverture. |

## La règle qui aurait évité le retour

- `controle-vrai-sur-le-mauvais-invariant` (RP-63) : sous Windows, un chemin se compare après normalisation de la lettre de lecteur.

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

- La copie créée par `git worktree add` hors de `.claude` a permis de lancer l'agent sans attendre une correction du harnais.
