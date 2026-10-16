# Retours forges — digit-ai-prospection — 20260928a

- **Contexte** : run digit-ai-prospection-run-20260928a, adoption d'un projet existant puis conception et découpage en agents
- **Références ledger** : `forge\ledger.jsonl` seq 39, 40, 41 (entrées `type: retour`) et seq 48 (rectification du texte de la seq 41)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, ignoré par git. L'original reste ici.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

---

## pilot (`digit-ai-factory`)

L'adoption du projet a coûté 3 allers-retours sur des textes et des scripts du pilot : une commande prescrite par le prompt d'adoption, un gabarit de documentation que l'oracle d'écriture du pilot refuse, et des README de produit qui décrivent les dossiers du pilot.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-1 | majeur | générique | Le gabarit `gabarits\docs-projet\FONCTIONNEL.md` porte, ligne 21, les en-têtes de colonne « Ce qu'il peut faire » et « Ce qu'il ne peut pas ». `oracles\oracle-ecriture.mjs` (règle EC-8) les refuse chez le produit qui instancie le gabarit : FAIL mesuré le 28/09/2026 sur `docs\projet\FONCTIONNEL.md`, corrigé à la main en « Droits » et « Limites ». | Renommer les deux en-têtes dans le gabarit, puis rejouer `oracle-ecriture` sur chaque gabarit de `gabarits\docs-projet\` instancié à vide. Règle qui aurait évité le retour : la classe `regle-neuve-sans-mesure-de-bruit`, une règle neuve mesure son bruit sur les textes qu'elle jugera chez les produits, gabarits du pilot compris. |
| RV-2 | majeur | générique | `PROMPT-PRODUIT-EXISTANT.md`, ligne 44 (étape 7), prescrit `node <FORGE_ROOT>\digit-ai-factory\scripts\readme-dossiers.mjs` depuis le produit. Le script refuse (`scripts\readme-dossiers.mjs`, lignes 66 et 67) : « refus : lance depuis C:\dev\digit-ai-prospection, ce generateur ecrirait dans c:\dev\digit-ai-factory — un autre depot. Ecrire dans un depot ou l on n est pas se declare : relancer avec `--base <depot>` ». La commande prescrite n'aboutit qu'avec `--base`, que le prompt ne donne pas. Mesuré le 28/09/2026. | Ajouter `--base "<chemin du produit>"` à la commande de l'étape 7. Règle qui aurait évité le retour : la classe `oracle-chemin-prescrit-inoperant-sur-sa-cible`, chaque commande d'un prompt de produit se joue sur un produit réel avant publication. |
| RV-3 | majeur | générique | `scripts\readme-dossiers.mjs`, ligne 239, choisit le rôle d'un dossier par `roleExistant(…) \|\| ROLES[rel] \|\| PLACEHOLDER`, et la table `ROLES` (lignes 88 à 112 ; clé `input` ligne 90, clé `output` ligne 103) porte les rôles rédigés pour les dossiers du pilot. Lancé avec `--base` sur un produit, il a donc posé dans `input\README.md` et `output\README.md` du produit « Entrants du pilot… » et « Livrables du pilot… les deux familles `05-` sont une collision DÉCLARÉE (TF-0339)… `LISEZMOI.md` », fichier absent du produit. Le rôle n'étant plus un placeholder, `--check` ne le signale pas. Constaté le 28/09/2026 en préparant un dépôt dans `output\`, corrigé à la main. | Sous `--base` hors du pilot, ne pas lire la table `ROLES` et poser le placeholder, que `--check` refuse déjà. Aucune classe existante ne couvre ce défaut : classe proposée `role-readme-du-pilot-pose-chez-le-produit`, famille `readme-role` (voir la section finale). |

## Conception (`digit-ai-forge-conception`)

La constitution du produit a été écrite sur le modèle de la fixture verte de la forge, et ce modèle porte un titre que l'oracle d'écriture du pilot refuse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | mineur | générique | La fixture `oracles\fixtures\constitution-verte\CONSTITUTION.md` porte, ligne 26, le titre « Ce que cette constitution ne couvre pas ». `oracle-ecriture.mjs` du pilot (EC-8) refuse ce titre chez le produit qui imite la fixture : FAIL mesuré le 28/09/2026 sur `forge\etapes\conception\CONSTITUTION.md`, renommé « Hors du champ de la constitution ». | Renommer le titre de la fixture, puis vérifier qu'`oracle-constitution` ne dépend pas de ce libellé. Règle qui aurait évité le retour : la classe `regle-neuve-sans-mesure-de-bruit`, les fixtures d'une forge servent de modèle et se mesurent contre les règles d'écriture du pilot. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'étude de phase 1 livrée le 28/09/2026 a été jugée descriptive par l'associé : « l'objectif est de travailler l'automatisation de la prospection, pas de nous expliquer ce qu'on fait déjà ». | Run réorienté vers la construction du dispositif, adoption par la forge, démarche acceptée par l'associé ; préférence consignée dans la mémoire de session. | non | Non généralisable, parce que la demande d'origine nommait l'étude comme livrable et qu'aucune règle de forge n'était engagée : le run n'était pas encore ouvert. Le protocole d'accueil du pilot (reformuler l'intention, attendre l'accord) a été appliqué à la reprise et a tenu. |
| L'entrée 41 du ledger porte un retour chariot à la place de la lettre r d'un chemin cité (`\readme`), introduit par l'échappement du script qui a écrit la charge. | Rectification par ajout (seq 48, type `rectification_contenu`), sans réécriture ; charges suivantes écrites par fichier et non par un heredoc. | non | Non généralisable, parce que la cause est l'outil d'écriture de la session et que le JSON de la ligne reste valide ; `ledger.mjs verify` ne juge pas le texte des champs libres, et une entrée de rectification libre suffit. |
| Les écarts de conformité de l'adoption (R-2, R-8, R-11, R-22, R-24) ont été comblés à la main avant le premier PASS d'`oracle-conformite-projet`. | Sections ajoutées au `CLAUDE.md`, `README.md`, `.env.example` et `docs\projet\` instanciés, frontmatter `destinataire` retiré de 2 fichiers. | non | Non généralisable, parce que c'est le parcours prévu de l'adoption : le script crée ce qui manque, l'oracle nomme le reste, le produit le comble. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les documents de `docs\projet\` viennent des gabarits `gabarits\docs-projet\`, hors bibliothèque ; le seul défaut rencontré sur eux est remonté en RV-1.

## Documents mûrs

Aucun document mûr sur ce lot : le dossier `output\` du produit ne contient encore aucun livrable daté.

## Confirmations positives

- `node bootstrap.mjs --pull` a rendu « Poste prêt » à l'ouverture, forges à jour.
- `scripts\adopter-projet-existant.mjs` a tenu son contrat sur un projet vivant : essai sans écriture, puis création du seul manquant, aucun fichier préexistant touché.
- Les générateurs de projection ont refusé des gabarits encore porteurs de marqueurs à remplir (TF-0647) : `ARCHITECTURE.md` et `MODELE-DONNEES.md` ont été instanciés avec des faits plutôt que laissés vides.
- `ledger.mjs append` a refusé une entrée `etape_close` sans `resume` (TF-1366, point c) : le défaut a été vu à l'écriture, pas à la vérification.
- Le double sceau des vues (TF-0818) : `oracle-tracabilite --vue CADRAGE-DESIGN.md` PASS après calcul des deux empreintes.
- Le self-test de forge-agents rend 55/55 après sa dormance du 11/08/2026 (TF-0025).

## Ordre recommandé

1. RV-2 : un argument manquant dans une commande, le coût le plus bas, et chaque adoption bute sur cette étape.
2. RV-3 : même script que RV-2 ; chaque produit adopté reçoit des README qui décrivent le pilot, et aucun contrôle ne le voit.
3. RV-1 : chaque produit qui instancie `FONCTIONNEL.md` prend le même FAIL d'écriture.
4. RC-1 : même classe que RV-1, sur une fixture que les produits imitent.

## La règle qui aurait évité le retour

Aucun retour remonté ci-dessus ne suit un retour humain : RV-1, RV-2 et RC-1 ont été trouvés par des contrôles exécutés (EC-8 d'`oracle-ecriture`, refus de `readme-dossiers.mjs`), RV-3 par la lecture d'un README avant un dépôt. Le seul retour humain du run, sur l'étude de phase 1, est resté au produit avec son verdict ; la règle qui l'aurait évité est l'étape 2 du protocole d'accueil du pilot, appliquée depuis la reprise.

Classe à créer pour RV-3, aucune clé du référentiel ne couvrant ce défaut :

- clé proposée : `role-readme-du-pilot-pose-chez-le-produit` ;
- famille : `readme-role` ;
- libellé : un générateur de README lancé sur un autre dépôt que le pilot remplit le bloc de rôle avec le texte rédigé pour le dossier homonyme du pilot ; le produit hérite d'une description fausse, et le contrôle du rôle ne la voit pas, puisqu'elle n'est plus un texte à remplir.
