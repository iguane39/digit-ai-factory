---
role: suivi des bénéfices — ce que la mission a réellement changé, mesuré avant et après
sources_de_verite: [gains constatés des items clos du registre, mesures avant/après du produit]
verifie_le: {AAAA-MM-JJ}
cadence: {mensuel pendant la mission, puis à 3 mois après la clôture — donnée d'instance}
---

# Suivi des bénéfices — {Mission} — {AAAA-MM-JJ}

**La règle dure, et elle est impitoyable** : *un bénéfice porte sa mesure AVANT et sa mesure APRÈS,
ou il se déclare non mesuré.* Il n'y a pas de troisième possibilité. Un bénéfice annoncé sans
mesure avant est un bénéfice qu'on ne pourra jamais contester — donc jamais croire.

**Pourquoi la mesure « après » se prend PLUS TARD, et pourquoi c'est écrit ici** : un bénéfice
constaté le jour de la livraison mesure l'enthousiasme, pas l'effet. La cadence du gabarit prévoit
donc une reprise à trois mois, et une ligne dont l'« après » est vide à cette échéance se déclare
**non mesurée** — jamais « acquise par construction ».

## Bénéfices mesurés

Un bénéfice n'entre ici que s'il porte ses DEUX chiffres et leur date. La colonne d'attribution
dit ce qui l'a produit — sans elle, un bénéfice réel serait attribué à la mauvaise cause.

| # | Bénéfice | Mesure AVANT | Mesure APRÈS | Prise le | Écart | Attribuable à |
|---|---|---|---|---|---|---|
| {B-01} | {ce qui a changé, pour qui} | {le chiffre, avec son unité et sa date} | {le chiffre, même unité} | {AAAA-MM-JJ} | {l'écart, en unité et en %} | {ce qui l'a produit — l'item, la livraison, la décision} |

## Bénéfices attendus, pas encore mesurés

Cette table est celle qu'on préfère oublier. La colonne « pourquoi pas encore » interdit de la
laisser pourrir : sans motif, une ligne y reste indéfiniment et le suivi devient décoratif.

| # | Bénéfice attendu | Mesure AVANT (prise ?) | Pourquoi pas encore mesuré | Mesurable à partir du |
|---|---|---|---|---|
| {B-02} | {l'attendu} | {le chiffre, ou « JAMAIS PRISE » — et alors le bénéfice ne sera jamais démontrable} | {acces \| presence \| decision \| délai d'observation} | {AAAA-MM-JJ} |

## Bénéfices abandonnés

Ce qu'on n'attend plus, et qui doit cesser d'être promis ailleurs. Un bénéfice abandonné en
silence continue de circuler dans les présentations.

| Bénéfice | Motif de l'abandon | Décidé par | Le |
|---|---|---|---|
| {ce qu'on n'attend plus} | {pourquoi} | {prénom nom} | {AAAA-MM-JJ} |

## Ce qui n'est pas jugé par un oracle

L'**attribution** d'un bénéfice n'est pas mécanisable : qu'une baisse de 30 % vienne de la
livraison ou de la saison est un jugement, et un script qui trancherait fabriquerait une fausse
causalité. Ce qui **est** mécanisable, et c'est le plus utile : *aucun chiffre sans son avant, sa
date et son unité*. Le contrôle existe déjà pour les affirmations chiffrées d'un document de
pilotage (`oracles\oracle-fraicheur-doc.mjs`, balayage F-CLASSE) ; l'appliquer à ce gabarit est une
entrée en file des candidats.
