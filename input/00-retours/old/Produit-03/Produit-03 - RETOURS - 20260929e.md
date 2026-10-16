# Retours forges — Produit-03 — 20260929e

- **Contexte** : retour humain du 29/09/2026, après le refus de la première livraison de production par une stratégie de la souscription. Mot pour mot : « Pourquoi cela n'a pas été vu précédemment ? Puisque c'est ce que nous faisons sur toutes les applications Client-A. Remonte à la Factory & Produit-64 pour que ça ne se reproduise plus. » L'enquête du même jour montre que les 2 contraintes en cause étaient déjà connues du produit. Suite du lot `20260929d` (`RA-51`).
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 29/09/2026, au sas d'arrivée du pilot ; version corrigée redéposée le 30/09/2026, avant ingestion : le compte partagé porte toujours sa permission Graph, et le relevé des voisins est ajouté

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une contrainte du client déjà connue du produit, et jamais consultée au moment de concevoir

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-52 | bloquant | produit+générique | **La contrainte était connue, deux fois, et la conception l'a ignorée.** (1) **Une leçon restée en commentaire.** La stratégie de la souscription qui interdit une Web App sans authentification avait été heurtée le 23/07 en qualification, et le produit l'avait écrite : commit `6614f20`, « active Easy Auth Entra sur HPR (policy auth webapp obligatoire) », et, dans `infra/hpr.tfvars`, « Obligatoire ici : Azure Policy « Authentification de la webapp obligatoire » sur la souscription ». Ce commentaire ne gouvernait que la qualification : aucune règle, aucun contrôle, aucune ligne de guide ne l'a portée vers la production. (2) **Une description humaine réinterprétée.** Le 21/09, le commanditaire a décrit le processus Client-A, un formulaire Entra traité par l'administrateur Entra. L'agent l'a rapporté à l'assistant du portail, qui crée un mot de passe, et l'a écarté comme contraire à la doctrine sans secret, au lieu de l'inscrire comme la contrainte du client qu'il était (restitution `20260921j`). Le même jour, l'ordre de déploiement a été tranché sur son coût (restitution `20260921i`) : l'option qui déployait sans authentification a été retenue, et aucune des 2 options ne citait la stratégie. Le 29/09, la livraison 15504 est refusée. L'enquête mesure aussi un droit perdu en silence : les inscriptions de développement et de qualification avaient été créées par le compte partagé, qui porte toujours une permission Graph, et les 3 comptes dédiés qui l'ont remplacé le 16/09 n'en ont aucune. Le contrôle du standard des comptes ne regarde que 4 rôles Azure, et la fiche de mise en production écrivait depuis le 07/09 cette permission comme acquise pour le compte de production : c'était la cible, jamais mesurée. Pourtant 8 comptes dédiés voisins la portent, dont celui d'une production depuis le 22/09 : le relevé des voisins du 22/09 n'a regardé que les rôles Azure | (1) Faire promouvoir toute contrainte apprise dans un environnement : un commentaire de la forme « Obligatoire ici : … » devient une règle du produit, jugée par un contrôle, et une entrée du registre des garde-fous de plateforme proposé en `RA-51`. (2) Quand l'humain décrit un processus de son organisation, l'inscrire comme contrainte, avec ses mots, au lieu de le réinterpréter ; s'il semble contredire une doctrine du produit, poser la contradiction en décision, sans écarter le processus. (3) Avant toute option d'un ordre de déploiement, relire les contraintes connues du produit : commentaires « Obligatoire », décisions, registre des garde-fous, et citer celles qui rendent une option impossible, pas seulement plus chère. (4) Étendre le contrôle du standard des comptes aux permissions Graph, pour qu'un changement d'identité de déploiement ne retire pas un droit en silence, et relever chez les voisins les permissions d'annuaire autant que les rôles Azure |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. La classe voisine, `regle-ecrite-sans-oracle-qui-la-joue`, vise une règle écrite dans un texte opposable du produit. Ici, la contrainte n'était écrite que dans un commentaire de configuration, et dans la parole de l'humain : 2 formes que rien ne promeut en règle. La règle manquante : une contrainte connue d'un environnement, ou décrite par l'humain comme la pratique de son organisation, est inscrite comme contrainte du produit et consultée avant toute conception de déploiement.

La classe est proposée dans la famille `skill-ou-oracle-non-invoque` : clé `contrainte-client-connue-non-consultee`, libellé « Une contrainte du client ou de sa plateforme, déjà connue du produit, écrite en commentaire d'un environnement ou décrite par l'humain, n'est pas consultée quand on conçoit le déploiement suivant, et l'option retenue se heurte à elle ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'amorçage de production sans authentification heurte la stratégie de la souscription | décision `D-59 (a)` du commanditaire : le site naît fermé, demande de fusion 3919 fusionnée sur `env/prd` | oui | remonté ci-dessus en `RA-52`, en `RA-51`, et au projet commun (`RPC-15`, `RPC-16`, transmis le 29/09) |
| L'inscription d'application de production n'existe pas, et aucun compte du produit ne peut la créer | le commanditaire la demandera par le formulaire Entra ; la demande sans secret est préparée | oui | remonté au projet commun en `RPC-16` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les documents en cause sont 2 restitutions du 21/09, qui suivent `gabarits\RESTITUTION.md`, et un fichier de variables ; ce qui leur a manqué est remonté en `RA-52`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris cinq fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20260929d`.

## Confirmations positives

- La mesure a répondu au « pourquoi » en moins d'une heure, parce que le produit avait écrit ce qu'il savait, commit et commentaire datés : la trace existait, il manquait seulement qu'elle soit lue au bon moment.

## Ordre recommandé

1. `RA-52` (3) d'abord : relire les contraintes connues avant de proposer un ordre de déploiement ne coûte qu'une recherche, et aurait évité le refus ; (1) et (4) ensuite, qui rendent la relecture automatique ; (2), qui touche la manière dont l'agent écoute l'humain.
