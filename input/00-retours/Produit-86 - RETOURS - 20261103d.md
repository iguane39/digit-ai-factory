# Retours forges — Produit-86 — 20261103d

- **Contexte** : application des lettres du porteur « 47b, 46b » du 03/11/2026, run 20261103e-evolution-l2-qualif-workers : connecteur Azure AI Foundry en qualification sur corpus fictif, machine des workers sur Azure
- **Références ledger** : `forge\ledger.jsonl` seq 302, 303 (réponses du porteur), 304 (ouverture du run), 306 à 309 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 03/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 03/11/2026 :
- `grep -ciE "mutation.*(place|arbre)|audit-mute" todo/TODO.jsonl` → 10 lignes trouvées, dont TF-2091 (« la campagne de mutation altère les sources du projet audité en place ») : RT-11 s'y rattache, classe existante `audit-mute-l-arbre-audite`.
- `grep -ciE "secret.*(session|transcription|canal)" todo/TODO.jsonl` → 23 lignes trouvées (TF-0842, TF-1216, TF-1217, TF-1221, TF-1464, TF-1514, TF-1556, TF-1736, TF-1993) ; aucune ne traite le passage d'un secret d'une session à la suivante. RP-5 propose sa classe.
- `grep -ciE "SkuNotAvailable|capacit[ée].*r[ée]gion|r[ée]gion de repli" todo/TODO.jsonl` → 0 ligne trouvée. RO-1 propose sa classe.
- `grep -ciE "ressource.*(cr[ée][ée]e dans le m[êe]me tour|neuve)" todo/TODO.jsonl` → 1 ligne trouvée, TF-1118 (geste destructif sans mesure de non-régression), autre défaut. RP-6 propose sa classe.

## forge-tests (`digit-ai-forge-tests`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-11 | majeur | générique | Rattaché à TF-2091. Pendant l'audit du 03/11 (rapport `rapport-20261103-l2-workers.json`), le pan mutation a écrit ses mutants dans l'arbre du produit : `backend/app/audit.py` a porté `empreinte(contenu) if contenu is None`, puis `egress.py` `PLAGES_INTERDITES - [...]`, visibles de toute commande parallèle. Un commit ou un déploiement lancé à ce moment aurait figé un mutant. Ledger seq 306. | muter une copie de travail (worktree ou dossier temporaire), ou poser un verrou que `deployer.sh` et `git commit` lisent. |

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-5 | majeur | générique | Une clé de fournisseur collée par le porteur dans une session (03/11 à 09:24) n'avait, à 21:31, aucune trace dans le produit : la session suivante a dû la relire dans la transcription de l'autre session pour la ranger au coffre local. Ledger seq 307. **RP-5** : clé proposée `secret-sans-canal-entre-sessions`. | un geste du pilot « ranger un secret » qui écrit la valeur au coffre du produit dès sa réception et consigne au ledger son nom et son empreinte courte. |
| RP-6 | mineur | générique | La règle des gestes destructifs groupés vaut aussi pour le retrait d'une ressource créée dix minutes plus tôt dans le même tour, sous la même décision, et jamais employée. Pour changer de région, la session a dupliqué le réseau et laissé l'original vide, avec une adresse publique facturée, en attendant D-48. Ledger seq 309. **RP-6** : clé proposée `ressource-neuve-retiree-comptee-geste-destructif`. | admettre dans la liste fermée de `GESTES-DISTANTS.md` le retrait d'une ressource créée dans le même tour et jamais employée, consigné au ledger avec son identifiant de création. |

## forge-ops (`digit-ai-forge-ops`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RO-1 | majeur | générique | La région de convention de la souscription Applications IA (northeurope) n'avait plus de capacité pour aucune taille de VM à deux cœurs : 6 tentatives `terraform apply` en échec 409 `SkuNotAvailable` le 03/11 entre 21:52 et 21:58, alors qu'`az vm list-skus` ne déclarait aucune restriction. Réussite en francecentral. Aucun gabarit de la forge ne prévoit de région de repli. Ledger seq 308. **RO-1** : clé proposée `region-de-convention-sans-repli-de-capacite`. | un gabarit Terraform qui porte une région de repli déclarée, ou qui sonde la capacité avant de créer le réseau. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le DNS de la machine des workers rendait une adresse IPv6 absente de la liste poussée : la destination listée était refusée (`RESOLUTION_MODIFIEE`) | résolution bornée à IPv4 dans `app/proxy_worker.py`, la machine n'ayant aucune sortie IPv6 | non | défaut de ce produit, corrigé et rejoué (preuve 7/7) |
| Le format `json_object` de l'API Responses exige le mot « json » dans l'entrée, pas seulement dans les instructions | consigne ajoutée à l'entrée du connecteur Foundry | non | contrainte du fournisseur, documentée dans le code |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées du 03/11, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261103c) |

## Garde-fou de plateforme relevé

Aucun nouveau garde-fou heurté dans ce run. GFP-005 (stratégie de contrôle d'application Windows) reste celui des lots 20261103a à 20261103c.

## Confirmations positives

- Le harnais d'injection de forge-agents-security s'est branché sans adaptation sur le vrai modèle par la passerelle : 34 charges, 0 réémise dans un acte, `oracle-corpus-injection` et `oracle-scan-toolcalls` PASS.
- La politique `app/egress.py` du socle a pu servir telle quelle de proxy réseau sur la machine des workers : la règle testée hors ligne est celle qui filtre en vrai.

## Ordre recommandé

1. RT-11 : un mutant figé par un commit concurrent passerait en production sans signal.
2. RO-1 et RP-5 : chacun a coûté un détour mesuré à ce run.
3. RP-6 : confort, et un petit coût d'hébergement en attente de décision.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucun retour humain : ce sont des frictions de la session pendant le run. La règle qui les aurait évités : un audit ne modifie jamais l'arbre qu'il audite (RT-11), et un secret reçu se range au coffre du produit dès sa réception (RP-5).

Trois retours n'ont aucune clé du référentiel qui convienne ; chacun propose sa classe :

- **RP-5** : clé proposée `secret-sans-canal-entre-sessions`, famille `contrat-interface-forge`, libellé « Un secret livré par l'humain dans une session n'a aucun canal vers la session suivante du même produit ».
- **RP-6** : clé proposée `ressource-neuve-retiree-comptee-geste-destructif`, famille `hook-ou-gate`, libellé « Le retrait d'une ressource créée dans le même tour et jamais employée est traité comme un geste destructif soumis à décision ».
- **RO-1** : clé proposée `region-de-convention-sans-repli-de-capacite`, famille `contrat-interface-forge`, libellé « Une région imposée par convention n'a pas de repli quand elle manque de capacité, et le plan ne le révèle qu'à la création ».
