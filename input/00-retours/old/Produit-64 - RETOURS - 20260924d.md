# Lot de retours — Produit-64 → digit-ai-factory — 2026-09-24, indice d

**Émetteur** : produit `Produit-64` · **Cible** : le pilot `digit-ai-factory` (protocole de
commit et d'envoi d'un produit) · **Origine** : la publication du produit sur Azure DevOps le 24/09,
vérifiée sur un checkout propre du commit avant l'envoi.

Ce lot porte **1 retour**, trouvé en rejouant les portes du produit sur un worktree propre du commit
à envoyer : dans l'arbre de travail, les mêmes portes rendaient vert.

- **Contexte** : demande du porteur du 24/09/2026, « Pousse sur Azure DevOps, crée un premier tag de
  version », puis ses décisions du même jour sur la correction de la porte et sur le pin de la
  chaîne. Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre


> **Note de réception du pilot, 24/09/2026.** Le producteur a numéroté son retour RT-21, un
> identifiant que son lot `Produit-64 - RETOURS - 20260922c` définit déjà (règle LOT-IDS
> d'oracle-lot-retours) : deux retours différents auraient porté la même référence au registre. Il est
> renuméroté RT-22, premier numéro libre de la séquence. Le reste du texte est celui du producteur.

---

## digit-ai-factory (`digit-ai-factory`)

Deux portes du produit ont été annoncées vertes dans un message de commit alors qu'elles étaient
rouges sur un checkout propre du même commit : elles lisaient des fichiers présents sur le disque du
poste et absents de l'histoire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-22 | majeur | produit+générique | **Un verdict de porte cité dans un message de commit a été mesuré dans l'arbre de travail, pas sur le commit.** Le commit `0e98aff` du 24/09 annonce « Portes : perimetre 19/19, banc 9/9 […] chemins PASS ». Rejouées sur un worktree propre de ce commit (`git worktree add --detach`, condition exacte de l'agent de CI) : `verifier-perimetre-adr.mjs` → **18/19, exit 1**, contrôle 15 en « source illisible ou vide » sur 2 familles ; son banc → **8/9** ; `verifier-chemins-input-output.mjs` → **FAIL, 5 références sans cible**. Cause commune : les deux portes lisent des fichiers qui n'existent que sur ce poste — un sous-module privé que la CI ne clone jamais, un dossier ignoré par git, 2 synthèses jamais commitées. Envoyé tel quel, le commit rougissait la CI de `main`, verte sur ses 8 derniers runs | le protocole de commit et d'envoi d'un produit — ou un hameçon avant `git push` — rejoue les portes qu'un message de commit cite sur un worktree propre du commit, jamais sur l'arbre de travail, et le message ne cite que ce verdict-là ; une porte qui lit une source hors dépôt déclare « non jugé » quand cette source manque, au lieu d'échouer ou de passer en silence. Fixture rouge : un produit dont une porte lit un fichier ignoré par git, vert dans l'arbre de travail et rouge sur le worktree propre ; le protocole doit rendre le rouge |

### RT-22 — Une porte verte dans l'arbre de travail, rouge sur le commit qu'on envoie

**Le fait mesuré.** Le produit sert un périmètre normatif jugé par une porte de 19 contrôles. Le
contrôle 15, ajouté le 24/09, confronte le référentiel complémentaire aux textes de ses sources ; deux
de ces sources ne sont pas dans l'histoire du dépôt — l'une vit dans un sous-module privé que la CI
n'initialise jamais, l'autre dans un dossier ignoré par git. Dans l'arbre de travail du poste, où les
deux existent, la porte rendait 19/19 ; le message de commit l'a cité. Sur un worktree propre du même
commit, la porte rendait 18/19 et sortait 1. Le contrôle des chemins du produit rendait le même
écart : PASS dans l'arbre de travail, FAIL sur le worktree propre, avec 5 références vers des
fichiers ignorés ou jamais commités.

**Pourquoi c'est un défaut du pilot.** R-47 dit déjà qu'une recopie n'est tenue qu'une fois commise,
parce qu'un clone neuf, une CI ou un `git restore` ne l'auraient pas — pour les artefacts hérités.
Rien ne le dit pour le **verdict d'une porte**, alors que c'est lui qu'un message de commit cite et
qu'une publication croit. Le défaut se répète d'un produit à l'autre dès qu'une porte lit une entrée
hors de l'histoire.

**Ce que le produit a fait chez lui.** Le contrôle 15 déclare désormais « partiel » la famille dont la
source hors dépôt manque ; il reste rouge sur une source présente mais vide. Son banc passe de 9 à 11
cas, et 3 mutations de la correction sont toutes attrapées. La CI du produit a rendu le verdict partiel
déclaré, et reste verte. Le contrôle des chemins reste rouge sur un checkout propre ; l'écart est
consigné au registre du produit, sans correction.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le pin du sous-module de la chaîne, posé le 27/08, n'était plus atteignable depuis aucune branche du pilot, dont l'histoire a été réécrite depuis | pin avancé sur l'équivalent réécrit du même commit, retrouvé par son sujet et sa date d'auteur ; 12 chemins cités par le produit vérifiés, clone neuf avec sous-module rejoué | non | un seul produit du poste pinne le pilot en sous-module (relevé des `.gitmodules` sous `C:/dev`) ; à remonter si un second apparaît |
| Un comptage des retours chariot par `grep -c` sous Git Bash a rendu 106 sur un fichier qui n'en porte aucun, et un message de commit l'a repris avant l'envoi | message corrigé avant l'envoi ; octets comptés par `tr -cd` et `wc -c` | non | artefact d'un outil du poste, pas d'une règle du pilot |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le tour a publié le dépôt,
corrigé une porte et avancé un pin.

## Confirmations positives

- **Le hameçon d'ouverture du pilot a nommé la bonne classe de risque** : il signalait, au démarrage
  de la session, des artefacts « conformes sur le DISQUE, divergents de HEAD » ; c'est la même
  distinction entre disque et histoire qui a trouvé RT-22.
- **`oracle-synthese` a refusé une affirmation négative sur une ressource externe appuyée sur une
  seule sonde** (S22) ; la restitution a été reprise avec 3 sondes de 2 natures.

## Ordre recommandé

1. **RT-22**, seul retour du lot : rejouer sur un worktree propre du commit les portes qu'un message
   de commit cite, avant tout envoi, et poser la fixture au fichier ignoré.

## La règle qui aurait évité le retour

- **RT-22** — la règle existe pour les artefacts hérités (R-47 : une recopie n'est tenue qu'une fois
  commise) et pour une recette qui prétend rejouer la CI (elle pose l'environnement que le workflow
  déclare) ; aucune ne dit que le verdict cité dans un message de commit se mesure sur le commit.
  Classe : `recette-locale-ne-rejoue-pas-l-environnement-de-la-ci`.
