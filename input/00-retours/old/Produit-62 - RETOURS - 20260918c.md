# Retours forges — Produit-62 — 20260918c

- **Contexte** : une incapacité d'accès a été déclarée, écrite dans 2 synthèses et portée jusqu'au verdict de bascule d'une qualification — et elle était fausse. Le commanditaire l'a démentie d'une question. La règle qui l'aurait évitée avait été écrite par cette même session **24 heures plus tôt**, dans le lot `20260917e` (RF-26) : « nommer au moins DEUX chemins ». Elle n'a pas été appliquée à la session qui l'a produite.
- **Références ledger** : `forge\ledger.jsonl`, entrées du 2026-09-18 à 16:45 (`type: constat`), 17:00 (`type: mesure`) et 17:05 (`type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-18

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `gabarits\RESTITUTION.md` règle S25, et skill `prompt-analyzer-l99`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-30 | **bloquant** | générique | **La formule « seule voie » suffit à satisfaire la règle qui exige DEUX chemins essayés : l'échappatoire est une phrase, et elle a fait écrire un constat faux dans 2 synthèses jugées PASS.** Fait observé le 2026-09-18 : 4 appels ont été émis vers le rapport d'origine, **tous passant par l'espace de travail** (`groups/{id}/reports`, `groups/{id}/reports/{id}`), tous refusés en `401` ; la conclusion écrite fut « il n'existe aucun autre chemin, le portail et l'interface de programmation passent l'un comme l'autre par le même droit d'appartenance à l'espace ». Le commanditaire a demandé « tu n'as pas accès avec mon compte ? », et la vérification a rendu : `GET /v1.0/myorg/reports/87ff70a8…` → **200**, `GET /v1.0/myorg/reports` → **200**, `GET /v1.0/myorg/apps` → **200**. Le rapport est **partagé** (`isOwnedByMe` = `False`) : le scope personnel l'atteint sans appartenance à l'espace. **Ce que l'erreur a coûté** : un verdict de bascule portant une 4e condition inutile, un rapport de qualification entier à reprendre en version 2, et surtout un **écart réel resté invisible** — la comparaison des 2 rendus vivants, devenue possible, montre que la barre de pays du rapport reconstruit affiche **9** valeurs quand l'original en affiche **8** (HUN en plus), écart qu'aucun des 5 oracles verts ne pouvait voir puisqu'ils portaient tous sur la définition et jamais sur les valeurs rendues. **Le mécanisme, et c'est lui qui est générique** : la règle S25 d'`oracle-synthese` demande de « nommer au moins DEUX chemins, ou déclarer qu'un seul existe (« seule voie », « aucun autre chemin ») ». Elle juge donc la **forme de la déclaration**, jamais que les chemins aient été **essayés** ni qu'ils soient **différents** : 4 appels d'une même famille plus la phrase « seule voie » rendent PASS. Et RF-26, remis la veille par cette même session, formulait exactement la parade sans que rien ne l'oblige à l'appliquer à elle-même. | **(1)** S25 cesse d'accepter la formule seule : quand une incapacité est déclarée sur une ressource **atteignable par plusieurs API ou plusieurs scopes**, la restitution porte les **codes de retour de chemins de FAMILLES DIFFÉRENTES** — pour Power BI : scope espace de travail, scope personnel, applications, Fabric. Une famille = un préfixe d'URL distinct, pas une variante du même préfixe. **(2)** Fixture rouge du banc : 4 appels au même préfixe plus « seule voie » doivent rendre **FAIL** ; fixture verte : 2 préfixes distincts avec leurs codes. **(3)** Pour `prompt-analyzer-l99`, compléter la règle née de RF-26 : l'étape 0 d'un prompt qui désigne une ressource distante **énumère les scopes d'accès de la plateforme visée** avant de conclure, et un refus sur un seul scope n'est jamais un refus. **(4)** Doctrine à une phrase, pour la bibliothèque : *un refus prouve qu'une porte est fermée, jamais qu'il n'y en a qu'une.* |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le rapport de qualification `20260918a` portait le constat faux dans son chapitre d'ancre et dans son verdict de bascule | remplacé par la version `20260918c`, conduite sur les 2 rendus vivants ; la version remplacée est conservée sous `output\04-recettes-et-revues\old\` (règle 7) | non — le geste de versionnement est déjà doctrine ; c'est le constat faux qui est générique, et il est porté par RF-30 | resté au produit |
| Le modèle sémantique du rapport d'origine répond `404` en REST même quand le rapport répond `200` | déclaré tel quel dans la version 2 : la réconciliation garde pour référence les tables embarquées du fichier du 2025-12-08 | oui, en note du contrat `qualification-rapport@1` de RF-27 : accéder à un rapport n'implique pas d'accéder à son modèle, et les 2 dimensions ne se lèvent pas ensemble | remonté ici, en RF-30 (3) |
| La valeur de pays en trop (HUN) est un écart de **données**, pas de définition | ouverte en action A-135 et portée au verdict de bascule comme 1re condition | oui — c'est l'argument qui justifie la dimension « comparaison des rendus » du contrat de RF-27 : sans elle, 5 oracles verts et un écart réel | remonté ici |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de la bibliothèque sur ce lot : le rapport de qualification suit la forme prescrite par le prompt réécrit de l'analyse `20260917r`. Le manque déjà noté au lot `20260918b` se confirme et se précise — un gabarit « Qualification » devrait imposer, en plus des sections déjà listées, un **chapitre d'accès** dont la forme oblige à énumérer les scopes essayés avec leurs codes.

## Confirmations positives

- Le contrôle de fin de tour et les oracles de forme n'ont rien vu, et c'est attendu : aucun d'eux ne juge la **véracité** d'un constat. C'est le commanditaire qui a servi d'oracle, en une question — et c'est précisément ce que RF-30 cherche à ne plus lui faire porter.
- Le protocole de qualification a tenu : sa dimension « rendu » a été rejouée sur 2 rendus vivants sans adaptation, et c'est elle qui a fait apparaître l'écart.
- Le versionnement a fonctionné sans hésitation : la version fausse est conservée, la version 2 porte un indice neuf, et le document dit lui-même ce qu'il corrige.

## Ordre recommandé

1. **RF-30** — bloquant, et la correction tient en une condition ajoutée à S25 plus une paire de fixtures ; tant qu'elle manque, n'importe quelle session peut déclarer une impossibilité fausse et la faire juger PASS.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-30** → `controle-vrai-sur-le-mauvais-invariant` (famille `regle-morte`, correspondance **exacte** : S25 mesure la **forme de la déclaration** d'incapacité — une formule admise — là où l'invariant à protéger est que **plusieurs chemins réellement distincts** aient été essayés ; la règle est vraie sur ce qu'elle mesure et aveugle à ce qu'elle protège). Classe candidate, même famille, libellé proposé : `formule-admise-tenant-lieu-de-mesure` — « une règle accepte une FORMULE toute faite comme substitut à la mesure qu'elle exige ; écrire la formule coûte 3 mots, faire la mesure coûte un appel, et le contrôle ne distingue pas les deux ».
