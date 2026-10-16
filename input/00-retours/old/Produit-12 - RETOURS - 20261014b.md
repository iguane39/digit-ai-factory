# Retours forges — Produit-12 — 20261014b

- **Contexte** : autre — remontée immédiate sur mandat humain du 2026-10-14 (« Remonte ou rappelle à la Factory qu'un projet doit pouvoir être traité en autonomie par son développeur sur tous ses postes de façon automatique s'il a précisé un Google Drive (ou équivalent) »), à la suite de la décision D-44 (a) du même jour.
- **Références ledger** : `forge\ledger.jsonl` seq 296 (RS-31 chez le produit, RS-33 ici), entrée `type: retour` ; la réponse humaine D-44 (a) est la seq 295.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-14 dans le SAS d'arrivée du pilot (`<pilot>\input\00-retours\_arrivee\`), sur mandat humain du 14/10 (« Remonte ou rappelle à la Factory ») — ce lot ne se modifie plus.
- **Note de réception du pilot (14/10/2026)** : à l accueil, deux titres de page de la section « Documents mûrs » portaient le nom d un client du produit, absent des tables de noms ; ils sont remplacés ici par « [client du produit n° 1] » et « [client du produit n° 2] ». L original reste chez le produit. Aucune autre modification.
- **Note de réception du pilot (15/10/2026), renommage** : remis au sas du poste DESKTOP-ULTRA7 sous le nom « Produit-12 - RETOURS - 20261014a », le nom qu un AUTRE lot du produit, remis le même jour sur l autre poste (qualité du classement, RS-31 et RS-32), porte au registre publié. Les deux lots sont distincts et portent tous deux un RS-31. Celui-ci est renommé « 20261014b » à la fusion des deux postes ; son RS-31 est renuméroté RS-33, premier libre de la séquence du produit (le contrôle LOT-IDS de l ingestion refuse deux retours sous la même référence). L original reste chez le produit sous son nom d origine.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du produit : la série RS s'arrêtait à RS-30 (lot 17).

---

## pilot (`digit-ai-factory`)

Un développeur qui a déclaré un canal de reprise, et qui a demandé à pouvoir reprendre ailleurs, a trouvé son produit incomplet sur son autre poste ; le canal contenait pourtant tout ce qui manquait.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-33 | bloquant | générique | **La reprise d'un produit sur un autre poste du développeur reste manuelle, même quand un canal est déclaré et que le développeur l'a demandée.** Le 03/10, l'humain a demandé la reprise sur un autre PC (ledger seq 282 et 286). Un dossier Google Drive privé « Produit-12 - Reprise » a été créé, avec une notice `REPRISE.md` à suivre à la main. Il contient les 58 générateurs des pages d'exemple (9 et 49 fichiers sur le miroir local, vérifié le 14/10), les secrets et les entrants. Le 14/10, sur l'autre poste, une session a déclaré ces générateurs introuvables. L'humain a dû poser une décision (D-44) et les faire passer par git (commit 8d0d51c, seq 295). Le même jour, la session de ce poste a reproduit le défaut : elle a laissé le transport des entrants à l'humain (action A-3, `manuelle_utilisateur`, « canal à choisir »), alors que le Drive était déclaré dans la mémoire du projet et contenait déjà ces entrants. Aucune règle de la factory ne couvre ce cas : 0 occurrence de « Drive », « autre poste » ou « multi-poste » dans `REGLES-PROJET.md` et `CONTRAT-INTERFACE.md`. `references\TODO-FORGE.md` outille le seul pilot (`rebatir-clone`), et il écrit encore « ce que git ne synchronise pas entre deux postes se copie à la main ». Parole humaine : « Ce type d'erreurs ne doit plus se reproduire. C'est critique pour le travail des développeurs, leur efficacité, résilience. » | 1) Une règle : un produit dont le développeur a déclaré un canal de reprise (Google Drive ou équivalent) se reprend sur tous ses postes sans geste humain. 2) Le canal se déclare au `CLAUDE.md` du produit, par le gabarit `gabarits\CLAUDE-PRODUIT.md`, et dans un manifeste lisible par machine (`REPRISE.json` : source, cible, empreinte). 3) Le hook d'ouverture compare le manifeste au poste et restaure ce qui manque ou a vieilli, sans le demander. 4) La fin de tour pousse vers le canal ce qui a changé hors de git. 5) `RESTITUTION.md` refuse une action de transport entre postes laissée en `manuelle_utilisateur` quand un canal est déclaré. Ce qui ne doit pas partir vers un service hébergé, au sens de R-38, reste exclu du manifeste par une liste écrite. |

## Remarques restées au produit

Ce que le produit a constaté ce jour et garde chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les générateurs étaient hors de git depuis le 01/10 (D-14 (b)), alors que le motif de l'exclusion a été levé le même jour par la règle sur les dépôts privés | versionnés et poussés le 14/10 (D-44 (a), commit 8d0d51c) | oui | la classe, une règle humaine qui ne descend pas aux produits, est déjà remontée en RS-28 (lot 16) |
| L'archive de quittancement est extraite dans un dossier imbriqué (`input\ARCHIVES QUITT CRG\ARCHIVES QUITT CRG\`) | non corrigée, signalée à l'humain le 14/10 | non | propre à ce poste ; le manifeste proposé en RS-33 la rendrait identique sur tous les postes |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la restitution du 14/10 suit `RESTITUTION.md`, pas une famille de `gabarits\documents\`.

## Documents mûrs

Deux pages de ce produit ont été reprises cinq fois. Leur verdict est déclaré ici une fois pour toutes.

| Document | Versions | Verdict |
|---|---|---|
| « Exemple avant apres [client du produit n° 1] » | 5 | reste au produit, parce que ses versions (05/09 au 03/10) suivent pour l'essentiel celles de la norme de rangement du cabinet, de la v1 du 03/09 à la 2.5 du 03/10 : c'est la matière qui a changé, pas la forme, et cette norme est propre au métier du cabinet |
| « Exemple avant apres [client du produit n° 2] » | 5 | reste au produit, pour la même raison : 5 versions du 29/09 au 03/10, pendant que la norme passait de 2.1 à 2.5, sur le même gabarit de page |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- **Le canal de reprise a tenu son contenu** : le miroir local du Drive portait le 14/10 les 58 fichiers que l'autre poste cherchait. Le défaut n'est pas dans le transport, il est dans l'absence d'un geste automatique qui l'applique.
- **Le juge des restitutions a tenu la forme** : `oracle-synthese` a accusé et fait corriger six règles sur la restitution du 14/10 avant affichage.

## Ordre recommandé

1. **RS-33** — la règle et la ligne au gabarit `CLAUDE-PRODUIT.md` d'abord. C'est le geste le moins coûteux, et il fait connaître le canal à toute session. Viennent ensuite la restauration par le hook d'ouverture, puis la synchronisation de fin de tour.

## La règle qui aurait évité le retour

- **RS-33** : aucune règle n'existe. Le canal a été déclaré par l'humain le 03/10, mais il n'est écrit que dans une notice et dans la mémoire d'une session, et rien ne le joue. Classe `classe-a-creer` : reprise multi-poste déclarée et jamais câblée — clé proposée `reprise-multi-poste-declaree-non-cablee`, famille `heritage-produit` (complétée par le pilot à la réception du 15/10, motif du refus à la porte du 14/10 : classe_proposee absente).
