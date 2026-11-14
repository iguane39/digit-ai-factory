# Retours forges — Produit-84 — 20261105a

- **Contexte** : exécution de la décision D-171 (a) du porteur (réponse « 171a » du 04/11/2026) : la forme POC-to-Prod devient le rendu par défaut du rapport d'audit de forge-audit (TF-2145).
- **Références ledger** : `forge\ledger.jsonl` seq 189, 190, 191.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-05
- **Complétude** : 3 entrées `type: retour` écrites depuis le lot 20261104e (seq 189 à 191), relues le 05/11/2026 à 09:20 dans `forge\ledger.jsonl` ; elles vont au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le portage** : un agent constructeur a porté la forme POC-to-Prod dans forge-audit (3 commits : 28aa645, c95a344, cbe658e). La session a rejoué les portes (lint-agnostic, porte de forme 22/22, critique de design PASS, CI locale 16/16), puis publié cbe658e sous le mandat permanent des forges.
- **Le push** : refusé une première fois (403) sous l'identité du profil de session, accepté sous celle du propriétaire des forges.
- **Les restes** : le kit autonome garde l'ancienne forme, et un faux positif de V15 a coûté un cycle au gabarit.

## Factory (`digit-ai-factory`) — identité du mandat de push des forges

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-46 | majeur | générique | **Le mandat permanent de push des forges ne dit pas sous quelle identité il s'exerce.** (1) `CLAUDE.md` du pilot, ligne 86 : « Forges : mandat permanent d'écriture et de push » ; aucune identité nommée. (2) 05/11/2026 09:17, depuis un profil de session dont `GH_CONFIG_DIR` désigne le compte d'un client : `git push` de digit-ai-forge-audit rend 403, « Permission to iguane39/digit-ai-forge-audit.git denied to SebPC-Client-A ». (3) 09:18, la même commande sous `env -u GH_CONFIG_DIR` publie `c95a344..cbe658e`. (4) L'agent constructeur, dont le contrat ne cite pas le mandat, a signalé comme suspect le push légitime d'une autre session (08:41:54) et demandé un GO humain. Ledger seq 189. | Nommer l'identité de push des forges dans le mandat, et la faire choisir pour la seule commande par le hook pre-push des forges ou par un lanceur unique. Citer le mandat dans `gabarits\AGENT-CAMPAGNE.md`. Règle qui aurait évité le retour : aucune ; le mandat est écrit sans son identité. **RT-46** : classe proposée `mandat-de-push-sans-identite`. |

## Forge audit (`digit-ai-forge-audit`) — rendus dérivés de la forme par défaut

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-10 | mineur | générique | **Le kit autonome n'a pas suivi le rendu par défaut.** Après `28aa645`, `build-rapport-standalone` sort encore l'ancienne forme, et son import est déjà cassé (constat TF-2131). Le libellé du schéma reste « Schéma d'architecture » dans le rendu anglais, parce que la porte exige ce marqueur. Relevé par l'agent constructeur, rapport final du 05/11/2026 à 09:14. Ledger seq 190. | Le kit autonome appelle le même rendu que `build-rapport`, et le marqueur du schéma ne dépend plus de la langue. Règle qui aurait évité le retour : `livrable-derive-non-regenere`, dont la descente n'a pas atteint ce kit. |

## Forge agents (`digit-ai-forge-agents`) — oracle de rendu de page

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-11 | mineur | générique | **V15 de `render_page.py` accuse un élément rogné par un ancêtre.** Sur le rapport POC-to-Prod du 05/11/2026 : 11 bloquants par thème, dont l'en-tête masqué des cartes de synthèse, invisible à l'écran. Le gabarit a dû réduire cet en-tête à une boîte de 1 px pour passer. Ledger seq 191. | V15 tient compte du rognage par un ancêtre (`overflow` hors `visible`). Règle qui aurait évité le retour : aucune ; classe `oracle-faux-positif`. |

## Rattachement

Registre interrogé le 05/11/2026 au pilot, `todo/TODO.jsonl` :

- TF-2145 (D-171 (a)), clos ce jour en `corrige` : ces 3 retours en sont les restes.
- TF-2131 : constat de l'import cassé du kit autonome, repris par RU-10.
- Mandat de push : `todo/CLASSES.json` n'a aucune entrée sur l'identité de publication.

Items recoupés : TF-2145, TF-2131.

## Remarques restées au produit

- Régénérer l'audit de ce produit dans la nouvelle forme, après correction de ses données (clés de synthèse, résumé D00, actions par constat, criticité de D01) : c'est un geste de ce produit. Généralisable : non.
- La porte du client (projet commun) contredit AuditCore sur 4 points : 17 dimensions contre 18, un score exigé pour une dimension hors périmètre, une criticité exigée partout, des blocs JSON compilés comme du JavaScript. Ces contradictions relèvent du projet commun du client, pas de la Factory. Généralisable : non pour la Factory.

## Retours sur les documents produits

- `gd-rapport-audit` : corrigé ce jour au catalogue 1.13.0 (forme de référence, porte, relecture de D-2).

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le 403 de RT-46 est un défaut de droit du compte employé, pas une limite de la plateforme.

## Confirmations positives

- La porte de publication du dépôt de forge (`FORGE_PUSH_GO`) et le contrôle d'agnosticité ont laissé passer un push propre, sans nom de client : 0 finding sur 429 fichiers.

## Ordre recommandé

1. RT-46 : il conditionne chaque push de forge depuis un profil lié à un client.
2. RU-10, puis RU-11.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-46 : aucune ; le mandat est écrit sans son identité.
- RU-10 : `livrable-derive-non-regenere`.
- RU-11 : aucune.
