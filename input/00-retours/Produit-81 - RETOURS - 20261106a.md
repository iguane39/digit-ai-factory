# Retours forges — Produit-81 — 20261106a

- **Contexte** : le 06/11/2026, le porteur répond aux 31 fiches du reste à faire de la remédiation de l'audit 20261029a. La session exécute, entre autres, deux opérations SQL ponctuelles sur D1 par la chaîne GXY_App (classification, libellés traduits).
- **Références ledger** : aucun run ouvert au produit (`forge\ledger.jsonl` absent) ; lot remis hors run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-06
- **Complétude** : 2 retours, relevés dans le tour ; ils vont au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Les lancements** : la session lance à 11:07 deux runs manuels de GXY_App, 18586 (libellés) puis 18587 (classification), sur le même commit.
- **L'annulation** : le verrou exclusif de l'environnement `gxy-dev` ne garde que le run le plus récent. Le 18586 est annulé sans démarrer ; il a fallu relever la cause, puis le relancer après la fin du 18587.
- **Le script des libellés** : il avait passé 2 fois sur un SQL Server 2022 jetable, reconstruit d'après le jeu fictif du dépôt. En D1, il échoue au run 18595 : `ID_TRADUCTION_LIB` y est une colonne d'identité (Msg 544). Corrigé, il passe au run 18598.

## forge-tests (`digit-ai-forge-tests`) — validation d'un script SQL de données

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-3 | majeur | générique | **Un script SQL validé sur une base jetable échoue sur la cible, parce que la base jetable est reconstruite d'après le jeu fictif et non d'après le schéma réel.** (1) `infra/sql/traductions/01-libelles-it-lb-ru-zh.sql` passe 2 fois sur SQL Server 2022 jetable : 979 libellés posés, puis 0. (2) Run GXY_App 18595, 06/11/2026 : « Cannot insert explicit value for identity column in table 'GAL_TRADUCTION_LIB' » (Msg 544). (3) Le jeu fictif `infra/sql/seed-dev-d1.sql` insère des identifiants explicites ; la base D1 (copie de HPR) déclare la colonne en identité. (4) Correction : lecture de `COLUMNPROPERTY(..., 'IsIdentity')`, rejouée sur des tables avec et sans identité, puis run 18598 réussi. | Avant tout script de données, la base d'essai se construit depuis le schéma de la cible (`sqlpackage /Action:Extract`, ou un relevé `INFORMATION_SCHEMA` et `COLUMNPROPERTY`), et non depuis le jeu fictif. Règle qui aurait évité le retour : aucune. |

## Pilot (`digit-ai-factory`) — opérations manuelles d'une chaîne derrière un verrou exclusif

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-4 | majeur | générique | **Deux lancements manuels d'une même chaîne derrière un verrou exclusif : le plus ancien est annulé sans message.** (1) Runs GXY_App 18586 et 18587, lancés à 11:07 avec deux valeurs du paramètre `operationSqlD1`. (2) 18586 : « Controles de securite » `canceled`, run `canceled`, jamais démarré. (3) Le verrou exclusif d'un environnement Azure DevOps ne garde que le run le plus récent (comportement « runLatest » par défaut). (4) Coût : un diagnostic et un relancement, 1 h 20 de décalage sur le run des libellés. | Une chaîne qui expose des opérations manuelles derrière un verrou exclusif déclare `lockBehavior: sequential`, ou la session enchaîne ses lancements en attendant la fin du précédent. Règle qui aurait évité le retour : aucune. |

## Rattachement

Registre du pilot non interrogé pour ces deux sujets dans ce tour : rattachement à faire à l'accueil.

## Remarques restées au produit

- Le garde « rm-variable » a refusé une suppression dont la cible passait par une variable ; la commande a été réécrite avec le chemin en entier. C'est le hook qui fonctionne comme prévu. Généralisable : non.
- Un cache Redis de 60 minutes a servi des libellés vides après l'échec du run 18595. La session a attendu l'expiration plutôt que de changer un réglage hors Terraform. Généralisable : non, propre au produit.

## Retours sur les documents produits

- `gd-restitution` : aucun écart sur le gabarit ; rien à dire sur les documents produits dans ce tour.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Nouveau garde-fou, décrit par ses champs :
- **client** : Produit-81 (dépôt privé, nom réel) ;
- **plateforme** : Azure DevOps, environnements de déploiement ;
- **mécanisme** : verrou exclusif d'un environnement, comportement par défaut « runLatest » ;
- **effet** : un run en attente du verrou est annulé sans message dès qu'un run plus récent le demande ;
- **portée** : toute chaîne dont plusieurs runs manuels visent le même environnement ;
- **ce qu'il vise** : éviter deux déploiements concurrents ;
- **ce qu'il coûte** : une opération manuelle perdue, à relancer (RP-4).

## Confirmations positives

- Le contrôle final du script des libellés (`THROW` s'il reste un libellé vide) a fait échouer le run 18595 au lieu de le laisser vert sans effet.

## Ordre recommandé

1. RP-3 : il touche toute validation de script de données.
2. RP-4 : il touche toute chaîne à opérations manuelles.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RP-3 : aucune ; la base d'essai est construite par la session, sans règle sur sa source. Classe proposée : `verification-sur-substitut-non-representatif`.
- RP-4 : aucune ; le comportement du verrou n'est écrit nulle part dans les gabarits.
