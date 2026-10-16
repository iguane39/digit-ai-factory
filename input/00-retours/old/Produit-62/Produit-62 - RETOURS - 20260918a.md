# Retours forges — Produit-62 — 20260918a

- **Contexte** : le hameçon de restitution du pilot a REFUSÉ un message de fin de tour en le comparant à la synthèse d'un **autre tour**, déposée 2 h 24 plus tôt. Le refus était donc calculé contre le mauvais document, et ses 3 constats d'écart écran / fichier portaient sur un texte que le message n'avait jamais prétendu rendre. Récidive de la classe `restitution-fichier-juge-mal-choisi`, sur la borne exacte que TF-1184 (17/09) laissait ouverte 6 heures plus tôt.
- **Références ledger** : `forge\ledger.jsonl`, entrées du 2026-09-18 à 08:20 (`type: retour`) et 08:25 (`type: execution`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-18

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `oracles\hook-restitution.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-28 | **bloquant** | générique | **Un fichier RELU DU DISQUE prime systématiquement sur un fichier réellement ÉCRIT dans le tour, et le gate refuse alors un message conforme en le comparant au mauvais document.** Fait observé le 2026-09-17 sur ce produit : la synthèse du tour est `output\05-syntheses\Client-A - Note Synthese Audit L99 Prompt Qualification - 20260917s.md`, écrite par l'outil `Write`, modifiée à **17:52:06** ; le hameçon a jugé l'écran contre `output\05-syntheses\Client-A - Note Synthese Runbook Migration Remis Factory Tenancy Schedule Asset - 20260917q.md`, modifiée à **15:28:01**, synthèse d'un tour **antérieur et déjà restitué**. Les 3 constats du refus portaient donc sur un texte étranger : « options par défaut : 2 dans le fichier jugé, 3 à l'écran », « actions du fichier jugé : A-94 — actions affichées : aucune », « l'écran avance 17, 24, 91, 100, 401 que la trace ne porte pas ». **Le mécanisme, lu dans le code** : `syntheseDuTour` construit `chemins = [...cheminsEcrits, ...relusDuDisque(cheminsEcrits)]` puis parcourt la liste **à l'envers** (`for (let i = chemins.length - 1; i >= 0; i--)`) ; les candidats du disque étant **ajoutés en queue**, ils sont examinés **avant** tout fichier écrit par l'outil. `relusDuDisque` s'était déclenché parce qu'un chemin écrit n'existait plus — la synthèse avait été **renommée pour tenir S42**, le plafond de longueur de chemin, exigé par le gate lui-même. **Deux règles du même référentiel se contredisent donc** : tenir S42 fait perdre la reconnaissance du fichier jugé. Le commentaire de TF-1184 nomme lui-même le cas resté ouvert — « deux fichiers marqués auraient fait juger l'écran contre le mauvais document » — et le tri par date de modification qu'il ajoute ne le referme pas, puisqu'il ne s'applique qu'entre candidats du disque et jamais entre disque et écritures du tour. Coût mesuré : un message de fin de tour conforme, dont le fichier rend PASS sur 51 règles, refusé ; une réécriture complète de 8 blocs. | **(1)** Ordre de priorité explicite : un fichier **passé par un outil d'écriture dans le tour** prime toujours sur un fichier relu du disque — concrètement, examiner `cheminsEcrits` d'abord, et ne descendre aux candidats du disque que si aucun n'est marqué. **(2)** À défaut, trier l'ensemble des candidats — écrits **et** relus — par date de modification décroissante, ce qui aurait suffi ici (17:52 contre 15:28) ; l'ordre actuel n'est un tri que sur l'un des deux ensembles. **(3)** Faire suivre les renommages : quand un chemin écrit n'existe plus, retenir en priorité, dans son dossier, le fichier dont le contenu porte le même titre de niveau 1 ou la même date-indice, plutôt que le plus récent quelconque. **(4)** Fixture rouge à ajouter au banc : 2 fichiers marqués `destinataire: humain` dans le même dossier, l'un écrit dans le tour et renommé, l'autre plus ancien et intact — le gate doit juger le premier. Sans cette fixture, la borne se rouvrira une 3e fois. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le renommage qui a déclenché le défaut venait de S42 : le nom initial de la synthèse dépassait le plafond de longueur de chemin | noms raccourcis dès l'écriture pour les 2 livrables du tour | non — c'est une discipline de nommage locale ; l'interaction entre S42 et la reconnaissance du fichier jugé, elle, est générique et portée par RF-28 | resté au produit |
| Un chemin Windows écrit depuis un littéral Python non brut a transformé `\2026` en octet 0x82 (échappement octal), corrompant 2 chemins de la synthèse | corrigé, chemins rétablis, `oracle-caracteres-controle` rejoué | déjà remonté le 2026-09-17 (synthèse 20260917o) ; l'octet 0x82 échappe au balayage, dont la plage s'arrête à 0x1f — noté au ledger, pas rouvert en retour distinct | resté au produit |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de la bibliothèque sur ce lot : ce lot suit `forge\retours\GABARIT-LOT-RETOURS.md`, qui est le gabarit du canal lui-même, et il est jugé par `oracle-lot.mjs` — rien à signaler sur sa forme.

## Confirmations positives

- Le gate a bien **refusé** l'arrêt : le mécanisme de blocage fonctionne, et c'est sa cible qui était fausse. Un gate qui laisse passer aurait coûté plus cher.
- Le message de refus **nomme le document jugé**, ce qui a permis de diagnostiquer la mauvaise sélection en une lecture au lieu de réécrire à l'aveugle les 8 blocs. Sans cette ligne, le défaut se serait soldé par une réécriture inutile et serait resté invisible.

## Ordre recommandé

1. **RF-28** — bloquant, et la correction tient en un ordre de parcours ; la fixture rouge à 2 fichiers marqués est ce qui empêche la 3e récidive.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-28** → `restitution-fichier-juge-mal-choisi` (famille `restitution-forme`, correspondance **exacte** : le hameçon de fin de tour juge un autre document que celui qui porte la restitution du tour). C'est la **2e occurrence** de cette classe en 24 heures, la 1re ayant été corrigée le 17/09 par TF-1184 sur le volet « fichier renommé » ; le volet resté ouvert est l'**ordre de priorité entre écritures du tour et relectures du disque**, que le correctif n'a pas fixé et que son propre commentaire annonçait.
