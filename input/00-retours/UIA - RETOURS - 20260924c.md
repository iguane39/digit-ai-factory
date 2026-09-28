# Retours forges — UIA (Produit-72) — 20260924c

- **Contexte** : tour additionnel après clôture du run `UIA-mandat-audit-poc-to-prod-20260923` (réponse humaine du 2026-09-24 à la décision D-3 : détailler les 5 écarts du modèle IAC et les rendre transférables automatiquement au projet IAC).
- **Références ledger** : `forge\ledger.jsonl` seq 104-109 (entrée `type: retour` visant une forge : seq 108).
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-09-24 (SAS du pilot)

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Retours au pilot (`digit-ai-factory`)

Rendre un constat « transférable automatiquement » d'un produit vers un autre a montré qu'aucun canal outillé n'existe dans ce sens : le transfert a dû passer par un entrant déposé à la main.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RX-12 | majeur | générique | Le 24/09, le porteur demande que les 5 écarts du modèle IAC, mesurés par la session d'UIA, soient « transférables automatiquement » au projet IAC. La boîte d'entrée `input\00-travaux\` d'un produit n'accepte que le pilot : `forge\travaux\oracle-travaux.mjs`, règle T2, exige un item `TF-xxxx` par élément. L'ingestion d'un lot de retours ne recopie pas `destinataire_produit` depuis le sidecar (`todo\ingerer-lot.mjs`, champs fixes de l'événement `creation`), si bien qu'un produit ne peut pas désigner le produit concerné. Le transfert s'est fait par 2 fichiers déposés dans `input\` du projet IAC, hors de tout juge de forme. | Accepter dans le sidecar d'un lot de retours un champ `destinataire_produit`, recopié au registre et soumis à décision humaine avant émission ; ou ouvrir la boîte d'entrée à un émetteur produit, avec un juge de forme dédié. Règle qui aurait évité le retour : aucune ne couvre le sens produit vers produit. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le détail des 5 écarts devait être lisible par un humain et exploitable par une session d'agent | 1 document Markdown aux champs d'un lot de travaux du pilot, plus 1 fichier machine de 5 lignes, déposés en copie dans `input\` du projet IAC | oui | généralisable, remonté ci-dessus en RX-12 : le format existe, le canal manque |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le détail des 5 écarts reprend la structure des lots de travaux du pilot (`gabarits\TRAVAUX-PILOT.md` : le fait, pourquoi cela vous concerne, ce qui est demandé, l'effort, la vérification, la conséquence), sans en être une instance.

## Confirmations positives

- Les champs d'un constat de lot de travaux (`blocConstat` de `todo\emettre-travaux.mjs`) ont suffi à écrire un retour inter-projets complet : 8 champs sur 8 renseignés pour les 5 constats, vérifiés par relecture JSON.

## Ordre recommandé

1. RX-12, seul retour du lot.

## La règle qui aurait évité le retour

Ce retour suit une demande humaine du 24/09 (« transférable également automatiquement au projet si besoin »). Aucune règle ni aucun outil du pilot ne couvre le transfert d'un constat d'un produit vers un autre. Aucune classe du référentiel ne le décrit : la classe proposée est `canal-produit-vers-produit-absent`, famille `contrat-interface-forge`, libellé « Un constat mesuré par un produit sur un autre produit n'a aucun canal outillé : la boîte d'entrée n'accepte que le pilot, et l'ingestion d'un lot de retours ne recopie pas le produit destinataire ».
