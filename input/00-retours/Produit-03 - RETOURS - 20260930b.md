# Retours forges — Produit-03 — 20260930b

- **Contexte** : incident de production du 30/09/2026. La livraison de production (exécution 20260930.1, chaîne 209, branche `env/prd`) s'est arrêtée à l'étape `npm audit --audit-level=high`, sur 3 avis de sécurité publiés dans la nuit. Le feu vert donné le matin à l'exploitant reposait sur des contrôles qui ne rejouaient pas cette porte. Correctif urgent, décision `D-61 (a)` du commanditaire.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 30/09/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Dans RA-54, il a aussi remplacé par un rôle, entre crochets, le prénom de la personne que la procédure de l'exploitant désigne pour le feu vert (TF-1357). Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — un feu vert de lancement donné sur le verdict de la veille, et un oracle local qui mesurait le poste

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-54 | bloquant | produit+générique | **Le feu vert donné à l'exploitant ne rejouait pas les portes qui jugent une base externe.** Le 30/09 à 11h26, la restitution `20260930a` a remis à l'exploitant le message de lancement de la production. Ses vérifications d'avant lancement portaient sur le gabarit commun, la connexion de production et la stratégie d'authentification ; ni `npm audit` ni le scan d'image n'y figuraient. Or ces 2 portes jugent des bases qui changent la nuit. 3 avis GitHub sur `brace-expansion` avaient été publiés le 29/09 entre 23h44:58 et 23h45:39 UTC : `GHSA-6j4f-fj2g-mc7p` et `GHSA-qhr7-859c-m2p7`, élevés, et `GHSA-q2hr-2g5m-vwhr`, moyen (`https://api.github.com/advisories/<identifiant>`, champ `published_at`). Le même fichier de verrouillage avait passé la validation de `main` et la livraison de qualification le 29/09 ; la livraison de production s'est arrêtée à `npm audit`. La base de l'image bouge aussi : `libcrypto3` 3.5.9-r0 et `libpng` 1.6.59-r0 sont entrés dans Alpine 3.24 le 30/09, à 07h09 et 05h50. Rejouées sur le commit à lancer, les 2 portes ont pris moins de 5 minutes sur le poste : `npm audit` à 1, puis 0 après correctif, et `trivy` à 0 sur une image neuve. La procédure de l'exploitant disait déjà « Attendre le feu vert de [la personne que la procédure désigne] : il confirme que les contrôles du jour sont faits » : la liste de ces contrôles ne nommait pas ces portes | (1) Avant tout feu vert de lancement, rejouer le jour même, sur ce qui sera lancé, chaque porte de la chaîne qui juge une base externe : avis de dépendances, base de vulnérabilités, dépôt de paquets. (2) La restitution qui remet un guide de lancement (S53) porte la sortie de ces portes, datée du jour, et non celle de la qualification. (3) L'oracle de l'étape de mise en production du pilot peut refuser un feu vert dont la preuve des portes précède le jour du lancement |
| RA-55 | majeur | produit+générique | **Un scan d'image local, construit avec le cache du poste, rendait un verdict que la chaîne n'aurait pas rendu.** Pour anticiper l'étage 2, bloquant en production, l'image a été construite sur le poste (`docker build`), puis scannée par `trivy` 0.74.0, base du 30/09 à 13h11 UTC : 1 faille HIGH, `libexpat` CVE-2026-93990, installée en 2.8.4-r0, corrigée en 2.8.5-r0. Le journal de construction portait `#13 [runtime 2/7] RUN apk upgrade --no-cache` suivi de `#13 CACHED` : la couche de mise à jour venait d'une construction ancienne du poste. Reconstruite avec `docker build --no-cache`, l'image porte `libexpat` 2.8.5-r0 (publiée le 23/09 à 22h38), OpenSSL 3.5.9-r0 et `libpng` 1.6.59-r0, et `trivy` rend 0 faille HIGH ou CRITICAL. Sans la lecture du journal, le constat aurait conduit à un correctif inutile du `Dockerfile`, ou à une fausse alerte donnée au commanditaire. Le registre des oracles de `quality-oracles` n'a aucune ligne « image de conteneur » ; sa ligne « Sécurité : dépendances (SCA) » ne couvre pas la couche système | (1) Ajouter au registre la famille « Image de conteneur, vulnérabilités de la couche système » : `trivy image --severity HIGH,CRITICAL --exit-code 1` sur une image construite avec `docker build --no-cache`, jamais sur une image issue du cache local. (2) Qu'un oracle local qui construit une image dise en sortie s'il a réutilisé des couches (`CACHED` au journal) : c'est la règle de la classe `recette-locale-ne-rejoue-pas-l-environnement-de-la-ci`, appliquée aux constructions d'image |
| RA-56 | mineur | générique | **Un espace de travail git du produit ne tient pas dans le répertoire de session de l'agent.** `git worktree add` vers le répertoire de session a échoué 2 fois, avec `fatal: Could not reset index file to revision 'HEAD'`. Ce répertoire fait 138 caractères jusqu'à `wt-prd/` ; le plus long chemin suivi du produit en fait 154, `forge/Produit-03 - Synthese Mandat - Version 1.7.0 sur la branche de production et registre des retours au projet commun - 20260924a.md`. Cela fait 292 caractères, pour un plafond Windows de 260. Contourné par un chemin court hors du répertoire de session, `C:\Users\iguan\AppData\Local\Temp\wtbx-prd` | (1) Plafonner la longueur du titre libre des synthèses (`Synthese Mandat - <titre>`), en comptant le préfixe de répertoire le plus long où un agent travaille, répertoire de session compris. (2) Ou prescrire `core.longpaths=true` aux produits sous Windows, avec la preuve que leurs outils (npm, docker) le supportent |

## La règle qui aurait évité le retour

- `RA-54` : aucune règle ne le couvre. Les classes voisines jugent une recette locale contre la CI (`recette-locale-ne-rejoue-pas-l-environnement-de-la-ci`) ou un chiffre cité en dur que sa source a dépassé (`compte-cite-en-dur-perime`). Aucune ne juge l'âge du verdict sur lequel repose un feu vert. La règle manquante : un feu vert de lancement repose sur des portes rejouées le jour du lancement, dès qu'elles jugent une base externe. La classe est proposée dans la famille `hook-ou-gate` : clé `verdict-de-porte-perime-au-lancement`, libellé « Un feu vert de lancement repose sur le verdict passé des portes qui jugent une base externe mouvante (avis de sécurité, base de vulnérabilités, dépôt de paquets) : le même commit, vert en qualification, est refusé le lendemain en production, et le lancement de l'exploitant est perdu ».
- `RA-55` : la règle de la classe `recette-locale-ne-rejoue-pas-l-environnement-de-la-ci` le couvre : « une recette qui prétend rejouer la CI pose l'environnement que le workflow déclare […] et DIT en sortie chaque condition qu'elle ne peut pas rejouer ». Ici, l'environnement est une construction neuve. Le domaine « image de conteneur » n'a pas d'oracle au registre : c'est le cas de la règle § 4 de `quality-oracles`, et la proposition (1) le définit.
- `RA-56` : la règle de la classe `chemin-de-livrable-au-dela-du-plafond-de-la-plateforme` (`TF-1015`) le couvre : un plafond de longueur du chemin relatif, et `core.longpaths` déclaré, jamais supposé. Ce retour y ajoute une mesure : le répertoire de session de l'agent, où le harnais range les fichiers temporaires, est l'un de ces chemins profonds.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le fichier de verrouillage portait `brace-expansion` 1.1.18 et 5.0.9, visés par les 3 avis | `npm audit fix` : 2 paquets, 6 lignes ; correctif urgent `630f874` sur `env/prd`, report `2e4dd72` vers `env/dev` ; avant et après, mêmes 27 fichiers lintés, 31 tests sur 31, 68 fichiers exportés identiques | non | propre aux dépendances du produit ; la classe du verdict périmé est remontée en `RA-54` |
| La chaîne de production reconstruit l'image, et rejoue donc `npm audit` contre la base du jour | déjà signalé au projet commun (`RPC-02`, `RAF-100`) ; coût mesuré transmis en `RPC-17` le 30/09 | non | relève du modèle de promotion du projet commun, pas d'une forge |
| La fiche de mise en production ne nommait pas ces portes dans les contrôles du jour | étape « 3 bis » ajoutée à `docs/ops/mep-production.md`, et règle écrite dans `CLAUDE.md` | oui | remonté en `RA-54` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les fichiers modifiés sont des fiches et un fichier de verrouillage du produit, sans gabarit.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris cinq fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20260930a`.

## Confirmations positives

- La porte `npm audit` bloquante sur le chemin qui déploie (`R-03`, audit du 18/08) a tenu : elle a refusé avant toute construction. Rien n'a été construit ni livré, et la production est restée dans son état, à 503.
- Le correctif urgent sur la branche de production, suivi pour la 3e fois (après 3903 et 3919), a demandé 1 commit et 1 report, sans toucher à la chaîne.

## Ordre recommandé

1. `RA-54` (1) et (2) : le geste coûte moins de 5 minutes, et il évite un lancement d'exploitant perdu ; (3) ensuite, si le pilot veut un juge.
2. `RA-55` (1) : une ligne de registre ferme un domaine sans oracle ; (2) la rend sûre.
3. `RA-56` : il ajoute une mesure à une classe déjà ouverte.
