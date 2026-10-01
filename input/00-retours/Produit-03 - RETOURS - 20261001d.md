# Retours forges — Produit-03 — 20261001d

- **Contexte** : quatrième retour humain du 01/10/2026, le plus grave du jour. Le commanditaire rappelle, pour la 3e fois depuis le 01/09, qui fait l'inscription d'une application dans l'annuaire Entra. Il demande que ce problème répété « ne soit plus jamais remonté et reproduit ». Suite des lots `20261001a` (`RA-57`), `20261001b` (`RA-58`) et `20261001c` (`RA-59`).
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — un processus décrit par le commanditaire est réattribué à un autre acteur, tour après tour

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-60 | bloquant | produit+générique | **Un processus consigné 3 fois, réattribué à chaque proposition.** Le commanditaire a décrit qui fait l'inscription d'une application Entra : le 01/09, au projet commun (« l'administrateur Entra autorisant manuellement, environnement par environnement ») ; le 29/09, au produit (« je remplirai le formulaire Entra pour que l'admin Entra fasse l'enregistrement de l'application ») ; le 01/10. Du 29/09 au 01/10, 5 écrits du produit ont pourtant confié la création à une chaîne, avec un droit Graph pour son compte : `CLAUDE.md` le 29/09, puis les restitutions `20261001c`, `d`, `e` et `g`. Un retour du produit a porté cette voie jusqu'au registre du projet commun. Le 01/10, le commanditaire est revenu 6 fois sur ce sujet entre 09h40 et 12h ; le 6e message dit : « Non, ça ne va pas. La chaine de déploiement ne doit pas créer l'inscription de l'application. Cette inscription est faite par l'Admin Entra uniquement. […] j'ai déjà remonté ce point il y a seulement quelques heures pour correction et je vois que ce n'est toujours pas fait. Pourquoi ? ». Les 4 causes sont mesurées. **(1)** Un même mot pour 2 actes : pour l'agent, « l'inscription » est l'objet de l'annuaire, qui doit exister avant tout formulaire ; pour le commanditaire, c'est l'enregistrement que l'administrateur fait à partir du formulaire. Chaque échange semblait d'accord. **(2)** Aucune proposition n'a été relue, acteur par acteur, contre le processus consigné. **(3)** 2 réponses intermédiaires ambiguës (« par la pipeline », « les droits à rajouter sur la connexion ») ont été lues dans le sens le plus large, celui de la chaîne. Elles répondaient à un autre point : la demande imposait à l'administrateur des commandes jouées avec son compte personnel. **(4)** Le précédent a été recopié sans être montré : en développement et en qualification, une chaîne avait créé l'objet en juillet, et le commanditaire n'en a vu que le formulaire. Ce qui a révélé l'écart est la partie « Pourquoi » qu'exige la forme de `RA-59` : écrite en clair, elle disait « la chaîne crée et tient l'inscription », et le commanditaire l'a refusée. Coût : 6 allers-retours humains en une matinée, et le site de production reste fermé un jour de plus | (1) **Relecture obligée** : avant de poser une décision ou de proposer une voie sur un sujet que l'humain a déjà décrit, la restitution cite ses mots datés, puis vérifie la voie acteur par acteur. Une voie qui confie un geste à un autre acteur que celui qu'il nomme est exclue, sauf demande explicite de sa part. (2) **Arrêt de boucle** : quand l'humain revient une 2e fois sur le même sujet, la restitution suivante s'ouvre sur la liste de ses messages sur ce sujet, mot pour mot, avant toute nouvelle voie. (3) **Un mot par acte** : un prérequis technique s'explique avec 2 mots distincts pour 2 actes, et l'acteur de chacun. (4) **Contrôle** : un bloc de décision dont le sujet a déjà été tranché porte un champ « Ce que l'humain a déjà dit de ce sujet », jugé non vide par l'oracle de restitution |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. `RA-59` fixe la forme d'une demande à une équipe tierce, et ses exclusions visent le contenu d'une demande, pas le choix de son destinataire. Aucune règle de la consigne de restitution n'impose de relire le processus que l'humain a décrit avant de proposer une voie, ni de s'arrêter quand il revient sur le même sujet. La règle manquante : un processus décrit par l'humain fixe les acteurs ; une proposition le cite et le respecte, acteur par acteur.

La classe est proposée dans la famille `restitution-forme` : clé `processus-du-commanditaire-reattribue`, libellé « Une voie proposée à l'humain confie un geste à un autre acteur que celui que son processus, déjà décrit et consigné, nomme ; elle revient à chaque tour, et l'humain la refuse à chaque fois, faute d'avoir relu le processus acteur par acteur ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La chaîne d'inscription créait et modifiait l'inscription de chaque environnement | retirée du service : elle refuse de s'exécuter ; aucune connexion ne reçoit de droit sur l'annuaire (`D-65`) | oui | remonté ci-dessus en `RA-60` |
| Rien ne disait, avant d'envoyer quelqu'un à une adresse, si le formulaire Entra s'y afficherait | un contrôle exécuté, `infra/verifier-formulaire-entra.sh` : sonde `prompt=none`, puis lecture du consentement | oui | proposé au projet commun (`RPC-19`, inscrit `RAF-145`) |
| La forme des demandes n'excluait pas le transfert à une chaîne d'un geste que l'équipe tierce fait elle-même | 6e exclusion de `docs/ops/demande-equipe-tierce.md`, jugée par `scripts/controler-demande.mjs`, qui refuse la demande retirée | oui | remonté ci-dessus en `RA-60` (1) |
| Le retour `RPC-16` au projet commun proposait d'écrire au guide le droit Graph des chaînes | corrigé par `RPC-19` ; le projet commun a rectifié `RAF-139` | non | traité au projet commun |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont des restitutions, une fiche de mise en production et un journal de décisions du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- La forme de `RA-59`, en vigueur depuis 11h10 le 01/10, a fait son office : sa partie « Pourquoi » a écrit la voie en clair, et l'humain a pu la refuser au tour suivant, au lieu de la découvrir après la pose du droit.
- Le projet commun a corrigé son registre dans le quart d'heure : `RAF-145` inscrit, `RAF-139` rectifié, sans réécrire son historique.

## Ordre recommandé

1. `RA-60` (1) et (2) : 2 consignes d'écriture, applicables dès leur inscription à la consigne de restitution.
2. `RA-60` (3) : une consigne de vocabulaire, à vérifier en lecture sur les restitutions qui expliquent un prérequis.
3. `RA-60` (4) : un champ et son contrôle, à mesurer d'abord sur le corpus des restitutions qui reposent une décision.
