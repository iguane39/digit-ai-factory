# Retours forges — Produit-86 — 20261110c

- **Contexte** : clôture du run `20261110c-tables-dns-ecrans`. Le run apporte les tables déclarées au mandat, l'approbation d'avance à la signature, un journal d'audit sérialisé et 2 écrans au volume réel.
- **Références ledger** : `forge\ledger.jsonl` seq 882 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 10/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 10/11/2026 : `todo/CLASSES.json` du pilot. RP-62 se rattache à `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` : l'isolation d'un agent suit le dossier courant de la session, et non le produit que la consigne nomme.

## digit-ai-forge-agents

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-62 | majeur | générique | Un agent constructeur lancé avec isolation a reçu une copie de travail du dépôt de Produit-84, et non de Produit-86. La session venait d'y lire des migrations, si bien que son dossier courant était Produit-84. L'agent s'est arrêté sans rien écrire, et la relance a coûté environ 5 minutes (ledger seq 882). | Nommer dans l'appel le dépôt de la copie isolée, ou refuser l'isolation quand le dossier courant n'est pas le produit de la session. |

## La règle qui aurait évité le retour

- `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` (RP-62) : une isolation se fonde sur le produit désigné, jamais sur le dossier courant.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La chaîne d'audit se rompait sous 2 écritures simultanées | `BEGIN IMMEDIATE` avant la lecture du dernier maillon (`15df2ae`), test de course avec mutant | oui : tout journal chaîné dans SQLite | reste au produit, parce que c'est son code ; la classe est déjà couverte par RP-58 (contrôle serveur) |
| La fiche réelle d'une mission dépasse X1 après la correction calée sur un peuplement synthétique | réserve ouverte (seq 912) | non : propre au portail | reste au produit, parce que c'est son écran |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré au lot 20261109b) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le constructeur a vérifié son dépôt avant d'écrire, et s'est arrêté net quand ce n'était pas le bon.
