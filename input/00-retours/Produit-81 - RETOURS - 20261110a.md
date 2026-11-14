# Retours forges — Produit-81 — 20261110a

- **Contexte** : ouverture de l'environnement de qualification (HPR), décision du porteur D-9 (a) du 10/11/2026, hors run ouvert ; reprend aussi deux retours du 09/11/2026 restés sans lot depuis plus de 24 h (relevé d'ouverture, TF-2260).
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 1, 2, 14 ;` (entrées `type: retour`) ; seq 12 reste au produit (section dédiée).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-10

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-13 (majeur) — Lot de gestes de droits posé sans relever toutes les ressources protégées de la chaîne

**Le fait.** Le 10/11/2026, pour ouvrir HPR, la session a posé une décision groupée (D-9) qui listait les autorisations des deux chaînes sur les deux environnements Azure DevOps HPR. Elle n'avait pas relevé la connexion de service `azrm-gxy-hpr-wif`, qui n'autorisait aucune chaîne, alors qu'en D1 les deux chaînes sont autorisées sur leur connexion. Le run d'infrastructure HPR (18883) s'est arrêté sur `Checkpoint.Authorization`, et une seconde décision de droits (D-10) a dû être posée.

**Le coût, prouvé.** Un run bloqué en attente, une seconde décision humaine pour un geste qui aurait dû figurer dans la première, contrairement à TF-1959 (« une décision pour toutes les modifs en une fois »).

**La règle qui aurait évité le retour.** Avant de poser un lot de droits pour un environnement neuf, relever par `pipelines/pipelinePermissions` toutes les ressources protégées que la chaîne compilée référence (environnements, connexions de service, dépôts de gabarits, groupes de variables, pools) et les comparer à l'environnement modèle. **Clé proposée** (RT-13) : `lot-de-gestes-sans-releve-des-ressources-protegees`, famille `hook-ou-gate`, libellé « Un lot de gestes de droits est posé pour un environnement neuf sans relever toutes les ressources protégées que la chaîne référence ; un droit manquant bloque le run et impose une seconde décision ».

**Juge proposé.** Le hook `gestes-distants`, au `--poser` d'un lot qui autorise une chaîne sur une ressource Azure DevOps, compare la liste aux ressources protégées de la chaîne compilée (API `preview` puis `pipelinePermissions`) et nomme celles qui manquent.

## RT-14 (mineur) — Noms de personnes cités dans une réponse à l'écran

**Le fait.** Le 09/11/2026, le porteur a corrigé une réponse qui citait des personnes relevées dans les attributions de rôle Azure. Aucune règle écrite ne l'interdisait : TF-1676 autorise les noms réels dans un dépôt privé, rien ne couvre l'écran.

**Le coût, prouvé.** Une correction du porteur, consignée depuis en préférence (« Aucune personne nommée dans une réponse », 09/11).

**La règle qui aurait évité le retour.** Désigner une personne par son rôle à l'écran, et dire où la retrouver. Classe proposée en rattachement : `classe-a-creer`, clé `personne-nommee-a-l-ecran`, famille `restitution-forme`, libellé « Une restitution cite une personne par son nom ou son adresse au lieu de son rôle ».

**Juge proposé.** `oracle-synthese` signale une adresse électronique de personne dans une restitution.

## RT-15 (mineur) — Premier push tenté sans le jeton OAuth az

**Le fait.** Le 09/11/2026, un `git fetch` et un `git push` nus ont été lancés avant de relire la consigne d'authentification du clone. Ils ont échoué sans fenêtre (`credential.interactive never`), puis le push a réussi avec le jeton az.

**Le coût, prouvé.** Une tentative perdue ; le verrou du clone a évité la fenêtre d'identification.

**La règle qui aurait évité le retour.** Un script de push du produit qui porte le jeton az, plutôt qu'une consigne en mémoire. Classe proposée : `classe-a-creer`, clé `git-distant-sans-jeton-prescrit`, famille `hook-ou-gate`, libellé « Une commande git distante est lancée sans le mode d'authentification prescrit pour ce dépôt ».

**Juge proposé.** Un hook avant outil qui refuse `git push` ou `git fetch` vers dev.azure.com sans `http.extraheader`.

## Rattachement

Registre interrogé le 10/11/2026 : `todo/CLASSES.json`, clés filtrées sur `geste|autoris|lot de|ressource prot|pipelinePermission|droit` → aucune clé ne couvre un lot de gestes de droits incomplet ; les plus proches (`restitution-action-humaine-geste-agent`, `lot-de-travaux-mauvais-module-producteur`) visent un autre défaut. D'où trois clés neuves en `classe-a-creer`.

## Remarques restées au produit

- `forge/hors-run.jsonl seq 12 ;` refus attendu du garde rm-variable sur une commande de nettoyage du dossier temporaire, réécrite aussitôt au chemin écrit en entier. Le garde a fonctionné ; aucune règle nouvelle. Généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
