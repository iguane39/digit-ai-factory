# Retours forges — UIA (Produit-72) — 20260924b

- **Contexte** : tour additionnel après clôture du run `UIA-mandat-audit-poc-to-prod-20260923` (demande humaine du 2026-09-24 : écarts Easy Auth et Entra face au projet IAC, prompt de réalignement pour le développeur).
- **Références ledger** : `forge\ledger.jsonl` seq 89-103 (entrées `type: retour` seq 96-101, dont 98-101 visent une forge).
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-09-24 (SAS du pilot)

> **Note de réception du pilot, 24/09/2026.** Dans RX-11, le texte du producteur opposait deux
> graphies : le NOM RÉEL du client, que portent les noms de fichiers du produit, et son pseudonyme
> « Client-A », que le générateur a écrit dans les tables. L'accueil pseudonymise le nom réel partout,
> si bien que les deux graphies se lisent désormais pareil (« `Client-A - UIA - …` pour des fichiers
> nommés `Client-A - UIA - …` », « Client-A devient Client-A »). Lire : les tables listent
> `Client-A - UIA - …` pour des fichiers nommés `<nom réel du client> - UIA - …`, et le nom réel
> est réécrit « Client-A » dans les rôles rédigés à la main. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Retours à `digit-ai-forge-audit` (méthode POC-to-Prod, cible de réalignement, guide développeur)

Comparer l'authentification d'UIA au projet IAC, pris pour modèle, a montré que 2 verdicts de la méthode reposent sur la lecture du code, et qu'une règle du guide en contredit une autre.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RX-8 | majeur | générique | La cible de réalignement du 01/09 juge `RC-22` « ALIGNÉ » chez IAC sur la lecture de `infra/appservice.tf:35`. L'état servi de `CL3_APP_IAC_HPR` le 24/09 montre que le justificatif fédéré n'est pas employé : `clientSecretSettingName` absent (`infra/appservice.tf:142`, volontaire), redirection servie en `response_type=id_token`, justificatif de qualification posé sur l'identité système. La documentation Microsoft (mise à jour du 20/05/2026) exige `clientSecretSettingName = OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID` et décrit le repli en flux implicite. Le contrôle IAC `verifier-reglages-servis.sh` rend 0 écart sans lire ce réglage. | Juger `RC-22` et `RC-23` sur l'état servi : relire `registration.clientSecretSettingName`, le sujet du justificatif et le `response_type` de la redirection. Règle qui aurait évité le retour : `RC-27` (relire l'état servi par 2 chemins), non appliquée au verdict de `RC-22`. |
| RX-9 | majeur | générique | Le guide développeur `20260924f` se contredit : `GDE0401-R02` écrit « aucun secret client, aucun mot de passe de principal », et le déroulé de mise en production du même guide dépose le secret de l'inscription au coffre avec une échéance (étape 6.3, recette point 6). `RC-22` écrit qu'aucun secret client n'est créé quand une identité fédérée suffit. | Trancher dans le guide : voie sans secret documentée pour App Service, secret au coffre en repli déclaré comme écart. |
| RX-10 | majeur | générique | L'audit d'UIA du 23/09 a capturé l'authentification une seule fois, vers 15h11 UTC, au milieu de 4 écritures d'un autre compte (15h07 à 15h16 UTC, journal d'activité Azure). Le rapport affirme « Easy Auth devant l'API (redirection forcée) », faux dès 15h16 UTC. | Lire le journal d'activité sur la fenêtre de l'audit, re-capturer les réglages de sécurité à la remise, et imprimer l'heure de mesure à côté de chaque constat servi. |

## Retours au pilot (`digit-ai-factory`)

Régénérer les index du produit, comme la doctrine le demande après chaque écriture, a écrit dans le produit des noms et des rôles qui n'y existent pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RX-11 | majeur | générique | `node scripts\readme-dossiers.mjs --base C:/dev/_Client-A/Produit-71` applique la pseudonymisation du pilot (D-37) aux README du produit : les tables listent `Client-A - UIA - …` pour des fichiers nommés `Client-A - UIA - …`, et le texte des rôles rédigés à la main est réécrit (« Client-A » devient « Client-A »). Les rôles racines d'`input\` et d'`output\` posés à l'adoption décrivaient le pilot (« Livrables du pilot », `LISEZMOI.md` absent du produit). | Ne pseudonymiser que les README du pilot, ou sur option explicite ; ne poser aucun rôle par défaut propre au pilot chez un produit. Règle qui aurait évité le retour : aucune ne couvre la portée du générateur hors du pilot. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 2 rôles racines d'`input\` et d'`output\` du produit décrivaient le pilot | réécrits pour l'espace d'audit d'UIA, sans nom de client, puis `readme-dossiers.mjs --check` rendu PASS | oui | généralisable, remonté ci-dessus en RX-11 |
| 19 README de sous-dossiers créés sans rôle par le générateur | rôles rédigés d'après la méthodologie d'organisation d'audit du client | non | rien de généralisable : le générateur signale déjà un rôle non rédigé, et c'est ce signal qui a fait rédiger ces rôles |
| Les 14 écarts d'authentification d'UIA (note du 24/09) | non corrigés dans ce tour : prompt de réalignement remis pour un run de version | non | rien de généralisable au-delà de RX-8 et RX-10 : le reste tient au code et au déploiement d'UIA |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. La note d'écarts, le prompt de réalignement et l'analyse L99 suivent la forme des prompts de réalignement Client-A du 01/09 et la spécification du skill `prompt-analyzer-l99`, pas un gabarit de `gabarits\documents\`.

## Confirmations positives

- `oracle-premisse-acces.mjs` a tenu sur une analyse réelle : il a exigé l'heure, l'identité, le contrôle positif et une seconde famille d'accès pour les 2 prémisses d'accès, et l'analyse les portait.
- `prompt-analyzer-l99`, joué comme oracle du domaine « Prompts », a trouvé 2 défauts bloquants dans un prompt que l'auteur croyait fini, dont un démarrage impossible sur base neuve.
- `check_markdown.py` a refusé 6 chapitres sans ouverture ni mode de lecture, corrigés avant remise.

## Ordre recommandé

1. D'abord RX-8 : un modèle qui passe pour aligné sera recopié par les autres produits, flux implicite compris.
2. Puis RX-10, qui protège tous les rapports d'audit à venir d'un constat périmé à sa remise.
3. Une ligne à trancher dans le guide ensuite, pour RX-9.
4. Enfin RX-11, qui touche chaque produit régénérant ses index.

## La règle qui aurait évité le retour

Aucun de ces 4 retours ne suit un retour humain : tous viennent d'une mesure de ce tour. Leur règle est nommée dans la colonne « Proposition esquissée » quand elle existe (`RC-27` pour RX-8) ; RX-11 n'en a aucune, et le pilot est invité à en définir une (loi `quality-oracles`, règle 4 : domaine sans oracle, en définir un).
