# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20261001f

- **Contexte** : cinquième retour humain du 01/10/2026 sur le même sujet. Il rectifie le lot `20261001d` (`RA-60`) : la boucle a fait un tour de plus, et sa cause principale n'est pas celle que ce lot nommait.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une étape que le processus du commanditaire ne contient pas, ajoutée 2 fois

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-63 | bloquant | produit+générique | **Une étape absente du processus, ajoutée 2 fois.** Le lot `20261001d` disait que l'agent confiait à une chaîne ce que le processus du commanditaire confie à l'administrateur Entra. La restitution qui a suivi, `20261001k` (12h41), a donc remis une demande d'inscription à l'administrateur. Le commanditaire l'a refusée à 13h20 : « Logiquement tu ne devrais rien demander à l'administrateur Entra avant que l'appli soit déployée, que l'on arrive sur la page de l'application pour ensuite compléter le formulaire de demande d'enregistrement de l'application. […] Pas de demande d'inscription de l'appli en amont. » La cause principale est donc ailleurs. En un jour, l'agent a ajouté 2 fois une étape que ce processus ne contient pas : une demande à un administrateur avant la visite, d'abord un droit pour la chaîne, puis une demande d'inscription. La fiche technique, sans laquelle Entra n'affiche pas le formulaire, est faite par la chaîne, sans approbation, comme en juillet ; l'approbation, que le commanditaire appelle « l'inscription », reste à l'administrateur. Coût : 7 retours humains sur ce sujet entre 09h46 et 13h20 | (1) **Relecture étape par étape** : `RA-60` (1) vérifie la voie acteur par acteur ; elle doit aussi vérifier qu'aucune étape n'est ajoutée au processus décrit. Une voie qui ajoute une étape est exclue, sauf demande explicite. (2) **Le prérequis, posé comme une décision** : quand un fait technique semble exiger une étape absente du processus, la restitution ne l'ajoute pas. Elle mesure d'abord les voies automatiques (loi n° 5). Elle pose ensuite une seule décision, avec la voie qui tient le processus tel quel et son risque mesuré. (3) **La classe proposée par `RA-60`** s'élargit : « … confie un geste à un autre acteur que celui que son processus nomme, ou y ajoute une étape qu'il ne contient pas » |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. `RA-60` (1), proposée le matin même, ne vérifiait que les acteurs : appliquée à la lettre, elle a produit la demande que le commanditaire a refusée. La règle manquante : un processus décrit par l'humain fixe ses étapes autant que ses acteurs.


> **Note de réception du pilot (01/10/2026, avant ingestion).** Le sidecar propose une classe que le référentiel `todo/CLASSES.json` ne porte pas encore ; elles sont nommées ici, comme l'exige l'ingestion (TF-1128) :
> - `processus-du-commanditaire-reattribue` (famille `restitution-forme`) : Une voie proposee a l humain confie un geste a un autre acteur que celui que son processus, deja decrit et consigne, nomme, ou y ajoute une etape qu il ne contient pas ; elle revient a chaque tour, faute d avoir relu le processus etape par etape et acteur par acteur.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La demande d'inscription à l'administrateur, remise à 12h41 | retirée, jamais transmise ; `scripts/controler-demande.mjs` refuse désormais toute demande en amont pour une inscription | oui | remonté ci-dessus en `RA-63` (1) |
| La chaîne d'inscription avait été retirée à 12h30 | réécrite : elle crée la fiche sans consentement, avec le seul compte qui le peut, ouvert le temps d'une exécution (`infra/lancer-fiche-entra.sh`) | non | traité au produit, `D-66` |
| Notre `RPC-19` au projet commun portait la demande écrite et « aucune chaîne ne crée » | suspendu à notre demande avant tout traitement ; correction consolidée après `D-66` | non | traité au projet commun |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont des restitutions et des fiches du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- La loi n° 5, reçue le 01/10, a donné la bonne méthode : 4 voies mesurées en 2 minutes ont montré qu'une seule identité peut créer la fiche, et qu'aucune demande n'est nécessaire pour y arriver.
- Une session voisine a relevé un risque que le premier jet sous-estimait : le compte partagé peut aussi attribuer des rôles sur toute la souscription. Le script de fenêtre en tient compte.

## Ordre recommandé

1. `RA-63` (1) avec `RA-60` (1) : une seule consigne de relecture, étapes et acteurs.
2. `RA-63` (2) : une consigne d'écriture des décisions.
3. `RA-63` (3) : l'élargissement de la classe, à l'ingestion de `RA-60`.
