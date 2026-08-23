---
role: revue RAID d'une mission — risques, hypothèses, incidents, dépendances, chacun avec son propriétaire et sa date
sources_de_verite: [items ouverts du registre, non_juge des oracles du run, dépendances déclarées au contrat d'interface]
verifie_le: {AAAA-MM-JJ}
cadence: {hebdomadaire | bimensuelle — donnée d'instance, jamais codée en spécification}
---

# Revue RAID — {Mission} — {AAAA-MM-JJ}

**Ce que cette revue est.** Les quatre choses qui peuvent faire dérailler une mission et qui ne se
voient pas dans un rapport d'avancement : ce qui **pourrait** arriver (risque), ce qu'on **croit
sans l'avoir vérifié** (hypothèse), ce qui **est déjà arrivé** (incident), et ce qu'on **attend de
quelqu'un d'autre** (dépendance). Un rapport d'avancement dit où on en est ; une revue RAID dit ce
qui peut faire mentir le rapport.

**Ce qu'elle n'est pas** : un second état. Un risque dont la cause vit au registre le CITE, il ne
le recopie pas.

**Règle dure, et c'est la seule qui compte ici** : *toute ligne porte un propriétaire nommé et une
date de relevé.* Un risque sans propriétaire est un vœu — personne ne le rouvrira. Une ligne dont
le propriétaire est « l'équipe » n'a pas de propriétaire.

## Risques — ce qui pourrait arriver

Ce qui n'est pas encore arrivé et qu'on veut voir venir. La probabilité et l'impact sont des
jugements assumés ; ce qui ne l'est pas, c'est la parade — elle est décidée, ou son absence est
écrite.

| # | Risque | Probabilité | Impact | Propriétaire | Relevé le | Parade décidée |
|---|---|---|---|---|---|---|
| R-01 | {ce qui pourrait arriver, en une phrase} | {faible \| moyenne \| forte} | {faible \| moyen \| fort} | {prénom nom} | {AAAA-MM-JJ} | {la parade, ou « aucune décidée » — le dire est une décision} |

## Hypothèses — ce qu'on croit sans l'avoir vérifié

Une hypothèse qui reste ouverte trop longtemps devient un risque. La colonne « à valider avant »
existe pour cela : sans date butoir, une hypothèse se découvre fausse au pire moment.

| # | Hypothèse | Ce qui casse si elle est fausse | À valider avant | Propriétaire | Statut |
|---|---|---|---|---|---|
| H-01 | {ce qu'on suppose} | {la conséquence, concrète} | {AAAA-MM-JJ} | {prénom nom} | {ouverte \| validée le AAAA-MM-JJ \| infirmée le AAAA-MM-JJ} |

## Incidents — ce qui est déjà arrivé

Un incident n'est pas un risque réalisé qu'on referme en silence : il reste ici avec son effet
MESURÉ, parce que c'est ce qui permettra d'estimer le suivant.

| # | Incident | Constaté le | Effet mesuré | Propriétaire | État |
|---|---|---|---|---|---|
| I-01 | {ce qui s'est produit} | {AAAA-MM-JJ} | {la mesure, pas l'impression} | {prénom nom} | {ouvert \| clos le AAAA-MM-JJ} |

## Dépendances — ce qu'on attend de quelqu'un d'autre

Chaque ligne dit de QUI on attend, pour QUAND, et ce qui s'arrête sans elle. La colonne de
relance est la plus révélatrice du tableau : une dépendance jamais relancée n'était pas bloquante.

| # | Dépendance | Attendue de | Attendue pour | Ce qui est bloqué sans elle | Relancée le |
|---|---|---|---|---|---|
| D-01 | {ce qu'on attend} | {qui, nommé} | {AAAA-MM-JJ} | {ce qui s'arrête, concrètement} | {AAAA-MM-JJ, ou « jamais » — et alors c'est un aveu} |

## Ce qui n'est pas jugé par un oracle

**Aucun oracle ne pèse un risque** — la probabilité et l'impact sont des jugements, et un script
qui les noterait fabriquerait une fausse précision. Ce qui **est** mécanisable et reste à faire :
un contrôle de FORME (toute ligne a un propriétaire nommé et une date, toute hypothèse a une date
butoir, toute dépendance non relancée depuis 30 jours est signalée). Entrée en file des candidats
plutôt que promesse tenue à moitié.
