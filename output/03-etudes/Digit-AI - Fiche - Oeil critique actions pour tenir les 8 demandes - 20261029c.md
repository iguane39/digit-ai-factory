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

Sources : fiche 20261029b, `SKILL.md` 1.1.2 de forge-agents, registre `todo/TODO.jsonl`, scripts cités du pilot.
