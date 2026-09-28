# Retours forges — COMPTA · Ventilation de facture Fournisseur-A — 20260928b

- **Contexte** : suite de la clôture du run `20260925-chaine-de-qualification` — deux défauts de l'anonymisation à l'entrée du pilot, révélés en jugeant le lot 20260928a après sa remise.
- **Références ledger** : `forge\ledger.jsonl` seq 98–99 (entrées `type: retour`) ; seq 97 pour l'écart de l'agent qui les a révélés.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` :
  le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) ; un lot
  au nom réel posé à la racine est refusé (règle LOT-SAS de l'oracle, TF-1054) —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-28

> **Note de réception du pilot, 28/09/2026.** Après l'accueil, un chemin du fichier
> d'accompagnement portait encore la forme du nom de dossier de ce produit, qui est à la table la clé
> de Produit-73 : la pseudonymisation du client l'a fait apparaître après le passage des noms de
> produits. Le pilot l'a remplacée par Produit-73 avant l'ingestion. Le reste du texte est celui du
> producteur.

---

## pilot (`digit-ai-factory`)

Un essai d'ingestion du lot 20260928a a révélé deux défauts de la chaîne d'anonymisation : l'un a écrit dans la table réelle des pseudonymes, l'autre disperse les lots de ce produit sous plusieurs noms. Le second touche l'ingestion du lot 20260928a lui-même, déjà au sas.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-11 | majeur | générique | **L'option `--registre` d'`ingerer-lot.mjs`, prévue pour les registres jetables, n'isole pas la table des pseudonymes.** Un essai sur une copie du registre étend la table réelle ; la garde d'`anonymiser-entrant.mjs` ne reconnaît un banc qu'à son nom de processus, `*.test.mjs` ou `--self-test`. *Mesuré le 28/09* : un essai du lot 20260928a, joué avec `--registre` sur une copie et sans `FORGE_PRODUITS_PSEUDO`, a écrit l'entrée Produit-76 à 07:45:43Z ; le registre réel est intact, la table réelle étendue. | Avec un `--registre` autre que celui par défaut, refuser d'étendre la table réelle, ou exiger `FORGE_PRODUITS_PSEUDO`. Classe : `banc-etend-referentiel-production`. |
| RV-12 | majeur | générique | **Un même produit porte un pseudonyme par graphie de son nom.** Ce produit est Produit-73 depuis le 27/09, sous la forme de son nom de dossier, et Produit-76 depuis le 28/09, sous la forme de son préfixe de lot ; ses lots du 14/08 sont archivés sous un troisième nom. *Mesuré le 28/09* : dans le sas, LOT-IDS rend « aucun identifiant repris des 0 lot(s) antérieur(s) du même produit », là où le dossier du produit en compte 5. | Rattacher un nom entrant au pseudonyme existant du même produit, reconnu par sa racine déclarée (`racine_produit`), avant d'en allouer un neuf. Classe proposée : `produit-a-plusieurs-pseudonymes`. |

**Portée** (R-45, 21/08) : les deux sont *génériques* — ils tiennent à la chaîne d'anonymisation du pilot, par où passent les lots de tous les produits.

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par l'agent de la session, le 2026-09-28. L'écart de l'agent qui a révélé RV-11, un essai sans tables jetables, est consigné au ledger (seq 97) avec sa pratique corrective : tout essai pose ses propres tables sous le répertoire temporaire.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- **L'ingestion rapproche un retour de sa correction d'origine** : sur le lot 20260928a, elle a rapproché le retour sur l'alias périmé de TF-0881 sans le déclarer doublon, et marqué les deux récidives de classe.
- **Le registre jetable tient** : l'essai n'a pas touché le registre réel, même empreinte avant et après.

## Ordre recommandé

1. RV-12 — il touche l'ingestion du lot 20260928a, déjà au sas : à trancher avant de l'ingérer.
2. RV-11 — un essai qui se croit isolé ne doit pas pouvoir étendre la table réelle.

## La règle qui aurait évité le retour

Aucun des deux ne suit un retour humain.

- **RV-11** — classe `banc-etend-referentiel-production`, famille `anonymisation`. La règle de la classe exige qu'un banc pose ses tables jetables et les désigne par `FORGE_NOMS_INTERDITS` et `FORGE_PRODUITS_PSEUDO` ; rien ne l'impose à un essai qui passe par `--registre`.
- **RV-12** — aucune clé ne convient : classe proposée **`produit-a-plusieurs-pseudonymes`**, famille **`anonymisation`**, libellé : « Un même produit reçoit un pseudonyme par graphie de son nom : ses lots se dispersent, et les règles qui comparent les lots d'un même produit n'en voient aucun ». Voisine : `anonymisation-portee-partielle`, qui vise les noms restés en clair, pas les noms dédoublés.
