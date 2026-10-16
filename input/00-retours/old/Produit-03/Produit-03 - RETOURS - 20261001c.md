# Retours forges — Produit-03 — 20261001c

- **Contexte** : troisième retour humain du 01/10/2026, sur la demande d'un droit d'annuaire remise au commanditaire pour l'équipe identité. Il fixe la forme de toute demande à une équipe tierce, et le commanditaire demande qu'elle vaille « pour toute demande de tout projet ». Suite des lots `20261001a` (`RA-57`) et `20261001b` (`RA-58`).
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — aucune forme fixée pour une demande remise à une équipe tierce

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-59 | majeur | produit+générique | **Une demande à une équipe tierce, sans forme fixée.** Le 01/10, la restitution `20261001e` remettait au commanditaire une demande de droit pour l'équipe identité. Elle donnait l'objet et ses identifiants, mais ni pourquoi ce droit débloquait la situation, ni ce qu'il ajoutait. Elle se justifiait par la situation d'un autre produit, et portait une ligne « Rien d'autre : … » sans valeur pour le lecteur. Le commanditaire a dû fixer la forme lui-même : « Il doit expliquer pourquoi le droit doit être ajouté, ce qu'il fait en plus qui va permettre de débloquer la situation. Ne rappelle pas la situation sur un autre projet. Supprime la ligne Rien d'autre qui n'appporte rien aux lecteurs. Vérifie également qu'aucun nom d'aucune personne ne soit rajouté dans ce type de prompt […]. Et ne demande pas des droits d'admin, même temporaire, pour faire une action. […] pour toute demande de tout projet. » Rien dans la consigne de restitution ne fixe cette forme. S49 exige de dire comment faire un geste, et S52 et S53 encadrent les gestes sur l'écran d'une plateforme tierce. Aucune règle ne demande le pourquoi, la portée et la vérification, ni n'exclut un nom de personne ou des droits d'administration temporaires. Coût : 1 aller-retour humain, après les 2 de la matinée sur le même objet | (1) Une forme pour toute demande remise à une équipe tierce, dans tout projet, en 5 parties : ce que je demande ; pourquoi, soit ce que cela débloque ; ce que cela permet, et rien de plus ; ce qui se passera ensuite ; la vérification qui fera foi. (2) 5 exclusions : un nom de personne ou un renvoi vers une personne ; des droits d'administration, même temporaires, pour un compte personnel ; la situation d'un autre projet ; une ligne sans valeur pour le lecteur ; le geste ou le compte imposé à l'équipe. (3) Un contrôle de restitution sur toute demande remise en citation : présence d'un pourquoi et d'une vérification ; absence de « rien d'autre », de « temporairement » et de « droits d'administration » ; absence des noms de personnes que le produit déclare |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. S49 pousse à écrire le geste, et ne demande ni pourquoi ni portée ; S52 et S53 ne visent que les écrans d'une plateforme tierce. La règle manquante : une demande à une équipe tierce suit une forme en 5 parties, avec 5 exclusions.

La classe est proposée dans la famille `restitution-forme` : clé `demande-tierce-hors-forme`, libellé « Une demande remise à une équipe tierce ne suit aucune forme fixée : elle omet pourquoi l'objet débloque la situation, ce qu'il permet et la vérification qui fera foi, ou elle porte un nom de personne, une demande de droits d'administration, la situation d'un autre projet ou une ligne sans valeur ». Elle englobe la clé proposée par `RA-58`, `demande-tierce-prescrit-le-geste-et-le-compte`, que le pilot peut y rattacher.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La demande de droit pour l'équipe identité n'avait ni pourquoi, ni portée, et rappelait un autre produit | réécrite selon la forme ; la forme est la règle du produit, `docs/ops/demande-equipe-tierce.md`, citée par `CLAUDE.md` | oui | remonté ci-dessus en `RA-59` |
| La procédure de l'exploitant nommait 2 personnes à 5 endroits, dont 2 conditions de geste | les noms sont remplacés par des rôles, l'exploitant et le commanditaire | oui | remonté ci-dessus en `RA-59` (2) |
| Le runbook, le SLA et une étiquette d'infrastructure nomment des personnes | laissés tels quels | non | ce sont des traces, un contact d'astreinte et une validation datée, pas des demandes |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont une restitution, une procédure et une fiche du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20261001b`.

## Confirmations positives

- Le guide du projet commun adresse déjà toutes ses demandes à une équipe, jamais à une personne : la règle d'exclusion des noms y est tenue de fait. Le projet commun a inscrit la forme proposée le 01/10.

## Ordre recommandé

1. `RA-59` (1) et (2) : une consigne d'écriture, applicable dès son inscription à la consigne de restitution.
2. `RA-59` (3) : un contrôle lexical, à mesurer d'abord sur le corpus des restitutions pour son bruit.
