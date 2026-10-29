---
destinataire: humain
objet: actions pour que le skill oeil-critique tienne les 8 demandes d'amélioration continue, lancement automatique exclu
date: 2026-10-29
sources: output/03-etudes/Digit-AI - Fiche - Oeil critique ce qu il fait et ne fait pas - 20261029b.md, ../digit-ai-forge-agents/.claude/skills/oeil-critique/SKILL.md (1.1.2), todo/TODO.jsonl (TF-1949, TF-1954 à TF-1956)
---

# Œil critique : 4 actions pour tenir les 8 demandes (29/10/2026)

## En bref

- 4 actions couvrent les 6 demandes non tenues ou tenues en partie ; le lancement automatique est exclu, comme demandé.
- Toutes modifient le seul skill et réemploient des scripts du pilot déjà en service ; aucune ne crée de hook.
- 3 constats du 20/10 attendent au registre, en candidat, d'être lus par l'outil : TF-1954 à TF-1956.
- Effort total : moyen × moyen, en 2 lots.

## Constat

Comment lire : une ligne par demande non tenue ou tenue en partie, avec ce qui manque.

| Demande, date | Ce qui manque | Action |
|---|---|---|
| 03/09 : faire redescendre les corrections chez les produits | Le skill ne vérifie pas qu'une correction de la période a atteint les produits | 1 |
| 20/10 : process attendus enclenchés, forges oubliées | Constat après coup seulement | 1 |
| 17/09 : revue de l'existant, code mort, items traités, retours des produits | Aucune lecture du dépôt ni du registre clos | 2 |
| 20/10 après-midi : suppressions | Aucune rubrique « à supprimer » | 2 |
| 20/10 matin : incohérences de tous les process | Les process silencieux, sans trace dans la conversation | 3 |
| 21/10 : architecture par palier | Palier mensuel jamais déclenché, faute de date au repère | 4 |

### La matière existe, le skill ne la lit pas

Code non appelé, contrôles injoignables, relevé d'héritage des produits, traces de mobilisation des forges : chaque source a déjà son script au pilot.

### Le palier n'a pas de déclencheur

Le skill annonce « un palier par mois », mais son repère ne garde aucune date de dernier palier. Il ne compare pas non plus ses indicateurs d'une exécution à l'autre.

## Préconisations

| # | Action | Gain | Effort | Attention |
|---|---|---|---|---|
| 1 | Lire les traces des produits : `scripts/relever-heritage.mjs` pour les corrections non redescendues, `forge/mobilisation.jsonl` pour les forges écartées | demandes du 03/09 et du 20/10 ; 432 manques sur 27 produits au relevé du 29/10 | simple × court | mobilisation lisible à la clôture de T4 (TF-1949) ; chez un produit, proposer seulement |
| 2 | Mission « existant » : `scripts/relever-appelants.mjs`, `oracles/oracle-controles-injoignables.mjs`, items clos avec gain remesuré (TF-1954), lots reçus ; au moins 1 suppression proposée par exécution, ou son motif | demandes du 17/09 et du 20/10 après-midi | moyen × moyen | élargit le skill : décision humaine ; supprimer une règle reste majeur |
| 3 | Process silencieux : durée des hooks lue aux transcripts, avertissements qui survivent à leur correction (TF-1955), domaines d'oracle sans un échec (TF-1956) | demande du 20/10 matin | moyen × moyen | lire les journaux, ne jamais relancer un hook |
| 4 | Repère : date du dernier palier, palier joué au-delà de 30 jours, indicateurs comparés à l'exécution précédente | demande du 21/10, et preuve du progrès avant la revue du 23/11 | simple × court | 1er palier dû le 20/11 |

## Rien à faire

- Pas de lancement planifié : exclu par votre demande, et D-94 (a) a retenu le rappel à 7 jours.
- Pas de nouveau hook ni de nouvel agent : les 4 actions passent par le skill et des scripts existants.

## Ordre conseillé

Lot 1, simple : 4 puis 1. Lot 2, après décision : 2 puis 3.

## 3. Décisions attendues

> **D-95 — Faut-il mettre en œuvre les actions de la fiche 20261029c pour que l'œil critique tienne les 8 demandes ?**
> - **De quoi s'agit-il** : 4 actions sur le skill, 1 et 4 simples, 2 et 3 qui l'élargissent à l'existant et aux process silencieux.
> - **Le problème** : 6 demandes sur 8 ne sont tenues qu'en partie ou pas du tout, et la revue du skill tombe vers le 23/11.
> - **Pourquoi vous** : les actions 2 et 3 changent le périmètre de l'outil que vous avez commandé ; c'est un arbitrage entre couverture et coût de chaque exécution.
> - **Recommandation : (b)** — seules les actions 2 et 3 tiennent les demandes du 17/09 et du 20/10 matin, et elles réemploient des scripts existants. Source consultée : cette fiche.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lot 1 seul | Actions 4 puis 1 : paliers datés, indicateurs comparés, traces des produits lues | simple × court | revenir au commit précédent du skill |
| (b) Lots 1 et 2 | Les 4 actions, dans l'ordre 4, 1, 2, 3 ; chaque exécution lit davantage de sources | moyen × moyen ; exécutions plus longues, sous le plafond d'un million de jetons | revenir au commit précédent du skill |
| (c) Rien | Le skill reste en 1.1.2 | aucun | sans objet |

> **Sans réponse** : rien ne change, le skill reste en 1.1.2.

## 8. Prochaines actions

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | neuve | auto_ia | `dependance_bloc_3` : attend D-95 ; ensuite, modification du skill dans forge-agents, self-tests rejoués, puis publication | `../digit-ai-forge-agents/.claude/skills/oeil-critique/` | 6 demandes restent tenues en partie ou pas du tout |

Sources : fiche 20261029b, `SKILL.md` 1.1.2 de forge-agents, registre `todo/TODO.jsonl`, scripts cités du pilot.
