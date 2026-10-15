---
role: cascade du produit — intention, stratégie, tactique, opérationnel, puis test rétro (references/INTENTION.md) ; vue générée, jamais éditée à la main
sources_de_verite: [INSTANCE.json]
version: 1.1.0
verifie_le: 2026-10-10
gabarit: gd-cascade-produit
version_du_gabarit: 1.0.0
---

# Cascade du produit — Produit-X, outil de réservation de salles

**Version 1.1.0 du 2026-10-10 · statut : ratifiée le 2026-10-10 (D-4 (a)) ; exemplaire ILLUSTRATIF, client pseudonymisé, aucune donnée réelle.** Règle : references/INTENTION.md 2.0.0. Vue générée depuis la source de la cascade par `generer-vue-cascade.mjs` (famille `gd-cascade-produit`) : la modifier, c'est modifier la source puis régénérer.

Ce document rattache chaque exigence du produit à un moyen choisi (une **tactique**), chaque moyen à un effet attendu (une **stratégie**), et chaque effet à ce que le demandeur cherche (l'**intention**). Une **alternative écartée** est l'autre moyen qu'on aurait pu prendre ; un **indicateur** dit à quoi l'on verra qu'un effet est atteint ; une **rupture** est un maillon qui ne remonte pas au niveau du dessus.

## Intention

Ce que le demandeur cherche, dans ses mots :

> « On perd une demi-heure par jour à chercher une salle libre, et les salles réservées restent vides. »
>
> — BRIEF.md, § Problème (brief du client)

**Reformulation** : Rendre aux équipes le temps perdu à trouver une salle, et rendre aux autres les salles réservées et inoccupées.

**Validée** le 2026-10-08 par la responsable des services généraux, demandeuse (ledger seq 12, entrée intention_validee).

| Partie prenante | Rôle | Ce qu'elle cherche |
|---|---|---|
| PP-1 | services généraux, demandeurs | des salles occupées quand elles sont réservées |
| PP-2 | équipes qui réservent | trouver une salle en moins d'une minute |

**Arbitrage** : Le temps des équipes prime ; la libération automatique d'une salle inoccupée est garantie aux services généraux, après un délai que les équipes connaissent.

**Contraintes** : C-1 aucun capteur de présence ne peut être posé dans les salles (BRIEF.md, § Contraintes)

**Non-objectifs** : N-1 gérer les équipements des salles (écrans, visioconférence) (motif : un autre outil les gère déjà)

## Stratégie

Les effets que le produit doit produire. Le manque fonde chaque effet ; l'indicateur dit comment on le verra, la cible ce qu'on attend.

| Stratégie | Effet attendu | Manque qui le fonde | Indicateur | Valeur actuelle | Cible |
|---|---|---|---|---|---|
| **STR-1** | Une équipe trouve et réserve une salle libre en moins d'une minute. | la recherche se fait salle par salle, dans trois calendriers différents (brief, § Problème) | réservations faites en moins de 60 s ÷ réservations ; dénominateur : réservations faites dans l'outil ; lu : journal des réservations | non mesurée : l'outil n'est pas encore en service | jalon 1, mise en service : la mesure est en place ; jalon 2 : la part se fixe sur le premier mois d'usage |
| **STR-2** | Une salle réservée et inoccupée redevient libre pour les autres. | les salles réservées restent vides : 41 réservations sur 120 sans présence relevée sur une semaine (relevé manuel des services généraux) | salles libérées ÷ réservations sans présence confirmée ; dénominateur : réservations sans présence confirmée à 15 min ; lu : journal des réservations | 0 sur 41 — mesurée le 2026-10-06, relevé manuel des services généraux, semaine du 29/09 | au moins 30 libérations sur 41 réservations sans présence, sur la première semaine mesurée |
| **STR-3** *(retirée : fusionnée dans STR-2 : la libération produit la même mesure (D-4 (a)))* | Les services généraux voient l'occupation réelle des salles. | aucune mesure d'occupation n'existe | heures occupées ÷ heures réservées ; dénominateur : heures réservées ; lu : journal des réservations | non mesurée : retirée avant mesure | sans objet |

## Tactique

Mode de lecture : une ligne par moyen retenu, dans l'ordre de la source ; la colonne « Alternative écartée » dit ce qu'on n'a pas pris et pourquoi, la dernière si ce pourquoi est écrit dans une source (« sourcée ») ou reconstruit par qui a rédigé la cascade (« reconstruite », à ratifier).

| Tactique | Stratégie | Moyen retenu | Alternative écartée, et pourquoi | Source | Statut |
|---|---|---|---|---|---|
| **TAC-1** | STR-1 | Une seule vue des salles libres, filtrée par heure et capacité, réservable en un geste. | synchroniser les trois calendriers existants — la synchronisation garderait trois écrans à consulter ; le brief demande « un seul endroit » | BRIEF.md, § Problème | sourcée |
| **TAC-2** | STR-2 | La présence se confirme d'un geste à l'arrivée ; sans confirmation à 15 minutes, la salle se libère. | des capteurs de présence — la contrainte C-1 interdit les capteurs ; la confirmation manuelle est le seul signal disponible | BRIEF.md, § Contraintes | reconstruite — ratifiée le 2026-10-10 (D-4 (a)) |

## Opérationnel

Mode de lecture : une ligne par tactique ; la troisième colonne liste les exigences qui la réalisent, la dernière les autres éléments qui la mettent en œuvre.

| Tactique | Stratégie | Exigences | Autres éléments |
|---|---|---|---|
| **TAC-1** | STR-1 | E-001, E-002, E-003 | ECR-1 (ecran) vue des salles libres |
| **TAC-2** | STR-2 | E-004, E-005 | IND-1 (indicateur_exploitation) libérations par jour |

## Test rétro

Verdict d'`oracle-cascade-isto` à la génération : **PASS**, 15 règle(s) tenue(s) sur 15.

- Rattachement des exigences : non jugé, le référentiel n'a pas été fourni à la génération.
- M1, cibles encore à fixer : aucune.
- M2, justifications reconstruites, à ratifier : TAC-2.
- M3, exigences sans test : non mesuré, le dossier des tests n'a pas été fourni à la génération.
- M4, stratégies non mesurées : STR-1, STR-3.

## Tenir la cascade à jour

1. Une exigence nouvelle cite sa tactique dans la source de la cascade, jamais dans cette vue.
2. Un changement déclare le plus haut niveau qu'il touche (I, S, T ou O) par une entrée d'historique, avec la décision qui l'a voulu.
3. Un élément qui sort reste dans la source, marqué `retiree`, avec son motif ou son remplaçant.
4. Juger la source : `node <PILOT_ROOT>/oracles/oracle-cascade-isto.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests>`.
5. Régénérer cette vue : `node <PILOT_ROOT>/gabarits/documents/cascade-produit/generateur/generer-vue-cascade.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests> --sortie <CASCADE.md>`.

| Version | Date | Niveau touché | Ce qui change | Décision |
|---|---|---|---|---|
| 1.0.0 | 2026-10-08 | I | cascade initiale, intention validée | ledger seq 12 |
| 1.1.0 | 2026-10-10 | S | STR-3 fusionnée dans STR-2 | D-4 (a) |

*Gabarit : gd-cascade-produit · version du gabarit 1.0.0*
