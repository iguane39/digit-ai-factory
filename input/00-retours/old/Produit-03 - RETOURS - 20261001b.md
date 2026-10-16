# Retours forges — Produit-03 — 20261001b

- **Contexte** : second retour humain du 01/10/2026 sur la même décision, la création de l'inscription d'application de production. La demande préparée pour l'administrateur Entra lui faisait jouer 2 commandes « avec votre compte administrateur ». Le commanditaire a répondu que cette partie devait être traitée par la chaîne, et non par le compte personnel d'un utilisateur. Suite du lot `20261001a` (`RA-57`).
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une demande à une équipe tierce qui prescrit le geste et le compte

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-58 | majeur | produit+générique | **Une demande dictait le geste et le compte, pas le résultat.** La restitution `20261001c` remettait au commanditaire une demande pour l'administrateur Entra : « Les 2 commandes, avec votre compte administrateur », suivies de 2 commandes `az ad app permission`. Le texte reprenait celui d'une restitution du 30/09. Le commanditaire a répondu : « Cette partie-là devrait être traitée par la pipeline pas par le compte personnel d'un utilisateur. Identifie comment cela peut être fait par le pipeline. » Le guide commun, à l'étape 3 de sa mise en production, nomme pourtant l'acteur (« l'administration de l'annuaire »), le résultat (la permission posée) et la vérification qui fait foi ; il ne prescrit ni le compte ni les commandes. La chaîne voisine de CAL (définition 210) montre le partage réel : l'équipe identité pose le droit une fois, et la chaîne fait tout le reste. La restitution ne disait pas non plus pourquoi ce geste échappait à la chaîne : Microsoft réserve l'octroi d'une permission d'application sur Graph au rôle Privileged Role Administrator (« Grant tenant-wide admin consent to an application », lue le 01/10). Coût : 1 aller-retour humain, et une analyse refaite | (1) Une demande remise à une équipe tierce nomme le résultat attendu, le standard qui le décrit et la vérification qui fera foi ; elle ne prescrit ni le compte ni le geste, que l'équipe choisit avec son outillage. (2) Quand un geste échappe à la chaîne, la restitution dit pourquoi, avec sa source, pour que le lecteur ne prenne pas un geste manuel pour un choix. (3) Un oracle de restitution peut signaler « votre compte » ou « compte personnel » dans une demande destinée à une équipe tierce |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. S49 exige qu'une option qui commande un geste humain dise comment le faire : elle pousse à écrire le geste, pas à se demander s'il revient à un humain. La règle v2.16.0 interdit de faire créer à l'humain une ligne ou un fichier ; elle ne vise pas une équipe tierce. La règle manquante : une demande à une équipe tierce porte le résultat, la référence et la vérification, et le geste reste à l'équipe qui le possède.

La classe est proposée dans la famille `restitution-forme` : clé `demande-tierce-prescrit-le-geste-et-le-compte`, libellé « Une demande remise à une équipe tierce prescrit le geste et le compte qui l'exécute, au lieu du résultat attendu, du standard qui le décrit et de la vérification qui fera foi : le commanditaire lit un geste manuel là où il attend une chaîne ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La demande à l'administrateur Entra prescrivait 2 commandes avec son compte | réécrite le 01/10 : le résultat (le droit posé), l'étape 3 du guide commun et la vérification qui fera foi ; la fiche de mise en production dit le partage entre la chaîne et l'équipe identité (commit `3802c34`) | oui | remonté ci-dessus en `RA-58` |
| En septembre, la fédération du compte de production a été demandée, et son droit Graph oublié | à demander avec la nouvelle formulation ; mesuré le 01/10 : la fédération `ado-iac-prd` est posée, le droit Graph est absent | non | propre à ce produit ; le guide commun porte déjà les 2 objets dans la même étape |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont une restitution et une fiche du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20261001a`.

## Confirmations positives

- Lire la chaîne d'un produit voisin a donné le partage exact des rôles en une seule lecture : le droit est posé une fois par l'équipe identité, et la chaîne fait le reste.

## Ordre recommandé

1. `RA-58` (1) : une consigne d'écriture, sans outil ; elle aurait évité l'aller-retour.
2. `RA-58` (2) : la source d'une impossibilité, dite dans la restitution.
3. `RA-58` (3) : un contrôle lexical, à mesurer d'abord sur le corpus pour son bruit.
