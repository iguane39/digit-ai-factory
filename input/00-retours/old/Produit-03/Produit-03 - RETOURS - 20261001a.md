# Retours forges — Produit-03 — 20261001a

- **Contexte** : retour humain du 01/10/2026 sur la mise en production. Le site est livré, et la première connexion rend `AADSTS700038`. La procédure de l'exploitant du 30/09 et la restitution du produit `20260930f` présentaient cette erreur comme « normale » ou « voulue ». Le commanditaire avait pourtant décrit, dès le 29/09, le résultat qu'il attend : le formulaire Entra à la première connexion. Il a dû le redire 2 fois le 01/10.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — un écart au résultat attendu, présenté comme normal

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-57 | majeur | produit+générique | **Une erreur contraire au résultat attendu, présentée comme normale.** Le 29/09, le commanditaire décrit son résultat attendu, noté mot pour mot dans `DECISIONS.md` (`D-59 (a)`) : « lors de l'accès à l'application pour la première fois, je remplirai le formulaire Entra pour que l'admin Entra fasse l'enregistrement de l'application ». Le 30/09, la procédure de l'exploitant écrit de l'erreur `AADSTS700038` : « C'est normal à ce stade : le site est né fermé ». La restitution `20260930f` porte en titre « l'erreur de connexion est l'état voulu », et en bloc 6 « cette erreur est l'état voulu depuis que le site naît fermé ». Les faits étaient justes : identifiant provisoire, inscription absente, droit manquant au compte de déploiement. Le cadrage, lui, était faux : l'erreur était l'écart à fermer, pas l'état attendu. Le commanditaire a dû poser la question (« pourquoi il n'y a pas le formulaire pour demander l'inscription de l'application dans Entra comme habituellement ? »), puis corriger (« Non, ce qui est attendu, c'est l'affichage du formulaire […] Corrige en ce sens. »). Coût : 2 allers-retours humains. La règle « un processus que le commanditaire décrit est noté dans ses mots, jamais réinterprété » (`CLAUDE.md`) était tenue à la lettre, et manquée dans l'esprit : les mots étaient notés, mais l'état présenté comme attendu en contredisait le sens | (1) Un état qui contredit le résultat décrit par le commanditaire se restitue comme un écart, avec ce qui le fermera, jamais comme « normal », « attendu » ou « voulu » ; ces mots se réservent à ce que le commanditaire attend. (2) Une procédure qui annonce une erreur à l'exploitant dit d'abord le résultat attendu, puis l'erreur comme le signe d'un écart connu. (3) Un oracle de restitution peut signaler « normal », « attendu » ou « voulu » dans la même phrase qu'un code d'erreur (`AADSTS…`, HTTP 4xx ou 5xx) |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. La règle voisine du produit, un processus du commanditaire noté dans ses mots, juge la consignation de ses mots, pas le cadrage des états restitués ensuite. Aucune classe du référentiel ne porte ce défaut : la recherche de « normal », « attendu », « réinterprété » et « présenté comme » dans `forge\retours\CLASSES.json` ne rend aucune clé qui convienne. La règle manquante : un état qui contredit le résultat décrit par le commanditaire est un écart, et il se nomme ainsi.

La classe est proposée dans la famille `restitution-forme` : clé `ecart-au-resultat-attendu-presente-comme-normal`, libellé « Un état qui contredit le résultat décrit par le commanditaire est présenté comme normal, attendu ou voulu dans une restitution ou une procédure : le lecteur reçoit l'écart comme un choix, et c'est à lui de le contester ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'étape 3 de la procédure de l'exploitant disait de l'erreur « C'est normal à ce stade » | réécrite le 01/10 : le résultat attendu est le formulaire Entra, et l'erreur signale une inscription absente (commit `966ccde`) | oui | remonté ci-dessus en `RA-57` |
| L'inscription de production n'existe pas, faute du droit `Application.ReadWrite.OwnedBy` sur le compte de déploiement de production | décision `D-60` reposée au commanditaire ; demande à l'administrateur Entra préparée, identifiants résolus contre l'annuaire | non | propre aux droits de ce produit ; déjà signalé au projet commun (`RPC-16`, inscrit `RAF-139`) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont une procédure et des restitutions du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20260930b`.

## Confirmations positives

- Le relevé des voisins, prescrit par `CLAUDE.md` (« measure the NEIGHBOURS »), a tranché la cause en quelques lectures d'annuaire : les inscriptions de développement et de qualification, leur propriétaire et leur consentement, comparés à la production.

## Ordre recommandé

1. `RA-57` (1) : une consigne d'écriture, sans outil ; elle aurait évité les 2 allers-retours.
2. `RA-57` (3) : un contrôle lexical simple, à mesurer d'abord sur le corpus des restitutions pour son bruit.
3. `RA-57` (2) : la forme des procédures d'exploitant.
