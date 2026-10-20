---
destinataire: humain
---

# Synthèse Conseil — 4 sujets traitables tout de suite, 2 sur un mot de vous, le reste attend un choix, un geste ou un produit (15/10/2026)

## 0. Synthèse d'ouverture

Sur les 40 sujets ouverts du registre, quatre travaux ne demandent aucune décision : un défaut du pilot qui empêche 9 sujets d'atteindre leur produit, un rangement de comptes rendus, la mise à jour de la liste des modèles en service, et la préparation des fiches pour vos 13 décisions. Deux autres sujets, arrivés aujourd'hui, sont prêts à traiter dès que vous les déclarez décidés. Tout le reste attend un choix précis de votre part, un geste sur vos comptes, une échéance ou le travail d'un produit, que le pilot ne fait pas à sa place. Une question vous revient : lesquels je lance.

## 1. En-tête d'identification

Synthèse de conseil, réponse à la demande « Identifie les sujets que tu peux traiter dès maintenant » du 15/10/2026, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 15/10/2026 de 20:58 à 21:28, heure de Paris (UTC+02:00), soit 30 min. Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : savoir ce que la session peut faire avancer sans attendre personne, pour décider quoi lancer.

Test rétro : le résultat sert cette intention. Chaque sujet a été lu dans sa dernière note du registre, et pas seulement dans sa colonne d'attente ; l'émetteur des lots de travaux a été joué à blanc pour vérifier ce qui atteint vraiment les produits, ce qui a fait apparaître un défaut que la colonne ne montrait pas. Rien n'a été modifié, puisque la demande était d'identifier.

## 2. Verdict en une ligne

40 sujets ouverts : 4 traitables maintenant sans décision, 2 sur votre « décide », 11 suspendus à un choix précis, 2 à un geste humain, 4 à une échéance ou à un autre sujet, 22 à un produit ; 9 sujets ne peuvent atteindre leur produit depuis ce poste.

## 3. Décisions attendues

Une question, pour choisir ce que je lance.

> **D-1 — Quels sujets voulez-vous que je traite maintenant ?**
>
> Quatre travaux ne demandent aucune décision et restent dans le pilot. Les deux candidats du jour, TF-1820 et TF-1821, demandent d'abord que vous les déclariez décidés : tout sujet entre au registre en candidat, et seul un mandat humain le fait passer en décidé. Une fois décidés, l'un se corrige dans forge-audit, l'autre dans le pilot, où j'ai déjà le droit d'écrire et de publier.
>
> **Recommandation : (a).** Source consultée : `references/TODO-FORGE.md`, gouvernance ; `REGLES-PROJET.md` R-38 § 6, qui donne au pilot et aux forges le droit permanent de publier. Le défaut de localisation passe en tête : tant qu'il dure, 9 sujets ne peuvent pas atteindre leur produit depuis ce poste, et l'émetteur des lots les déclare « orphelins ».

| Option | Coût | Exclusions |
|---|---|---|
| (a) Les 4 travaux sans décision, plus TF-1820 et TF-1821, que vous déclarez décidés par cette réponse | Moyen × moyen | Rien n'est modifié chez un produit ; une correction du défaut de localisation entre au registre comme nouveau sujet, sous le même mandat |
| (b) Seulement les 4 travaux sans décision | Moyen × court | Les 2 candidats restent en attente |
| (c) Seulement le diagnostic du défaut de localisation | Faible × court | Les autres restent en l'état |
| (d) Rien pour l'instant | Nul | Les 9 sujets orphelins restent bloqués |

> **Si rien n'est décidé** : (d), rien n'est lancé.

## 4. Traité

Le classement des 40 sujets, avec ce qui bloque chacun. Sources : le registre de ce poste après la fusion de l'autre session (808a98ca), plié sujet par sujet dans sa dernière note ; l'émetteur des lots de travaux joué à blanc, `node todo/emettre-travaux.mjs --tous --essai`.

**Traitables maintenant, sans décision (4).**

- **Défaut de localisation des produits.** `emettre-travaux --tous --essai` rend « 9 constat(s) désignent un produit que le parc ne porte pas » : TF-1023, TF-1536, TF-1630, TF-1631, TF-1822, TF-1823, TF-1824, TF-1825, TF-1826. Le pilot reconnaît un produit au nom de ses lots ou de son dossier (`todo/localiser-produit.mjs`, lignes 69 à 99), et ces produits ne portent pas leur pseudonyme. Le diagnostic se fait en lecture ; la correction est dans le pilot.
- **3 indices de synthèse en double.** Le relevé d'ouverture signale 3 indices du 01/10 portés chacun par 2 comptes rendus ; le remède est un renommage dans le pilot.
- **Liste des modèles en service à dater.** Le relevé d'ouverture rend MS2 « version servie plus récente que la courante : claude-sonnet-5-5 » ; la liste est une donnée datée du pilot.
- **Fiches pour vos 13 décisions.** Préparer, pour chacune, la question, les options chiffrées et la recommandation, sans rien modifier.

**Traitables sur votre « décide » (2).**

- TF-1820 : la version des gabarits du kit d'audit reste à 1.0.0, et rien ne la fait monter.
- TF-1821 : le gabarit des lots et le référentiel des classes sont encore recopiés chez les produits et dérivent.

**Suspendus à un choix précis de votre part (11).**

- TF-0963 : quels hameçons poser à une racine qui englobe des produits.
- TF-1160 : 3 valeurs à fournir (objectifs, personas sources, calendrier).
- TF-1212 : 3 contradictions de doctrine à arbitrer (route de déploiement, sauvegarde, fournisseur d'identité).
- TF-1307 : réécrire ou abandonner 2 règles perdues sur les deux postes.
- TF-1319 : ouvrir ou non le troisième volet, chez forge-agents.
- TF-1323 et TF-1540 : purger ou non l'histoire publiée, une opération irréversible, et qualifier un sigle de projet.
- TF-1396 : choisir une option de la fiche sur le secret d'Easy Auth.
- TF-1432 : activer la règle au canal confidentiel.
- TF-1552 : engager une dépense d'exécutions de modèle, chiffrée dans la note du 13/10 au registre.
- TF-1584 : brancher un hook dans les réglages de Claude Code du pilot.

**Suspendus à un geste humain (2).**

- TF-1090 : changer les identifiants publiés chez les produits, sur chaque compte.
- TF-1736 : donner le feu vert de publication à la session digit-ai-factory-12, dans sa conversation.

**Suspendus à une échéance ou à un autre sujet (4).**

- TF-1372 et TF-1392 : revue le 10/11/2026.
- TF-1205 et TF-1430 : suivent TF-1432.

**Suspendus à un produit (22).** TF-0549, TF-0674, TF-0682, TF-1023, TF-1031, TF-1078, TF-1159, TF-1536, TF-1547, TF-1568, TF-1569, TF-1592, TF-1601, TF-1602, TF-1630, TF-1631, TF-1634, TF-1822, TF-1823, TF-1824, TF-1825, TF-1826. Le geste revient au produit ; le pilot n'y intervient que sur un run demandé dans le produit.

## 5. Non traité

- **Les sujets eux-mêmes.** Motif : la demande était d'identifier ; la suite attend D-1.
- **L'état des lots de travaux chez chaque produit.** Motif : les lots récents ne citent pas le numéro des sujets, et le relevé par numéro est incomplet ; il ne change pas le classement, puisque ces gestes reviennent aux produits.
- **La cause exacte des 9 orphelins.** Motif : c'est le premier des travaux proposés en D-1.

## 6. Écarts à la lettre

Un écart, sans effet sur la demande.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Identifier les sujets traitables | J'ai aussi joué l'émetteur des lots à blanc | La colonne d'attente disait « produit » pour 9 sujets qui n'atteignent aucun produit depuis ce poste |

## 7. Risques

- **9 sujets confiés à des produits ne leur parviennent pas.**
  - Énoncé : la colonne d'attente les montre « en attente du produit », alors que l'émetteur ne trouve pas ces produits ici.
  - Signal : la ligne « [ORPHELINS] » de `emettre-travaux --essai`.
  - Parade : le diagnostic proposé en D-1.

## 8. Prochaines actions

Votre choix passe en premier, parce qu'il fixe ce que je lance.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Lancer les travaux retenus en D-1, le défaut de localisation en tête | auto_ia | dependance_bloc_3 : attend D-1 | `node todo/emettre-travaux.mjs --tous --essai` | 9 sujets restent sans destinataire |
| **A-2** | TF-1736 | Donner le feu vert de publication dans la conversation de la session digit-ai-factory-12 | manuelle_utilisateur | decision | Y répondre, par exemple « feu vert pour publier » | Ce poste reste en retard et les produits ne reçoivent pas la reprise multi-poste |
| **A-3** | `neuve` | Trancher D-1 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | L'option par défaut s'applique |

## 9. Traces

- Registre : `todo/TODO.jsonl` de ce poste, après la fusion 808a98ca de l'autre session
- Localisation : `todo/localiser-produit.mjs`, lignes 69 à 99
- Scripts de lecture de cette session, dans son dossier temporaire : `ouverts.mjs`, `travaux.mjs`
