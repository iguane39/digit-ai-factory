# Gabarit — Cascade du produit (intention, stratégie, tactique, opérationnel)

**Famille** `gd-cascade-produit` · **Version du gabarit** 1.0.0 · **Écrite le** 14/10/2026

> **Formats** Markdown, généré depuis une source JSON au format `pilot/cascade-isto@1`
> **Règles engagées** D6 D8 D9 D11 (`gabarits\documents\README.md`)
> **Provenance** la cascade écrite par `Produit-12` le 02/10/2026 (lot `Produit-12 - RETOURS -
> 20261002a`, RS-29 et RS-30, TF-1678 et TF-1679) : 1 intention, 5 stratégies, 14 tactiques puis 15,
> 99 exigences sur 99 rattachées, une vue générée depuis une source JSON par un script du produit. Sa
> fiche de conception a dû déclarer `famille: aucune — candidature remontée`. La forme est reprise,
> jamais la matière : l'instance est fictive.

## La règle qui commande toutes les autres

**La vue ne s'écrit pas : elle se génère depuis la source de la cascade, et son test rétro est le
verdict de l'oracle.** La source fait foi (`references\INTENTION.md`, section « Le format commun de
la cascade, et son juge ») ; la vue est ce que lit le demandeur pour ratifier. *Une vue rédigée à la
main dérive de sa source à la première exigence ajoutée, et le demandeur ratifie alors un document
qui ne dit plus ce que le produit tient.*

## Quand l'employer

Tout produit tient sa cascade dès l'étape de conception de son run d'ouverture
(`references\ETAPES-RUN.md`, étape 2) et la met à jour à chaque run de version
(`references\RUN-VERSION.md`). La vue se génère :

- quand la cascade est soumise à la ratification du demandeur ;
- à chaque changement de la source, dans le même commit que lui ;
- avant la clôture d'un run, quand la porte R-60 a jugé la source.

Le livrable vit chez le produit sous `forge\etapes\conception\CASCADE.md`, à côté de sa source
`forge\etapes\conception\cascade\CASCADE.json`. Son nom résout cette famille (G8 : type
« cascade »).

**Frontière avec la fiche de conception** (`gabarits\documents\FICHE-CONCEPTION.md`). La fiche
conçoit UN document avant son écriture ; la cascade rattache TOUT le produit à son intention. Une
étude d'opportunité dont l'intention demande la stratégie et la tactique d'un produit produit sa
cascade (`gabarits\ETUDE-OPPORTUNITE.md`), pas une section d'étude.

## Structure — les six parties sont dues

| # | Partie | Porte | Type de contenu |
|---|---|---|---|
| 1 | **Intention** | Les citations du demandeur avec leur source, la reformulation, la validation tracée, les parties prenantes et leur arbitrage, les contraintes, les non-objectifs | fait |
| 2 | **Stratégie** | Un tableau : effet attendu, manque qui le fonde, indicateur avec sa formule, valeur actuelle datée, cible | principe |
| 3 | **Tactique** | Un tableau : moyen retenu, alternative écartée et pourquoi, source, statut de la justification | classification |
| 4 | **Opérationnel** | Un tableau par tactique : les exigences qui la réalisent, combien un test en cite, les autres éléments | reference |
| 5 | **Test rétro** | Le verdict d'`oracle-cascade-isto` rejoué à la génération, ses ruptures, ses mesures M1 à M4 | fait |
| 6 | **Tenir la cascade à jour** | La procédure, les deux commandes, l'historique des versions avec le niveau touché | procedure |

L'ordre suit la remontée qu'on demande au lecteur : il ratifie l'intention, puis les effets, puis
les moyens ; l'opérationnel et le test rétro lui montrent ce qui est réellement tenu.

## Le générateur et ses deux commandes

Le générateur vit dans la famille : `generateur\generer-vue-cascade.mjs`.

```
node <PILOT_ROOT>/gabarits/documents/cascade-produit/generateur/generer-vue-cascade.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests> --sortie <CASCADE.md>
node <PILOT_ROOT>/gabarits/documents/cascade-produit/generateur/generer-vue-cascade.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests> --sortie <CASCADE.md> --verifier
```

La première écrit la vue, la seconde refuse une vue retouchée à la main ou restée en retard sur sa
source (exit 1). La vue ne porte aucune date de génération : deux générations de la même source
rendent le même fichier. Le squelette et l'instance de cette famille sont eux-mêmes des sorties du
générateur, et sa recette le vérifie (`--self-test`).

## Les vocabulaires fermés

Ils sont ceux du format commun, jugés par `oracle-cascade-isto` : statut de justification
`sourcée` ou `reconstruite` (T1) ; niveau touché `I`, `S`, `T` ou `O` (H1) ; type d'un autre élément
dans le jeu fermé `TYPES_ELEMENTS` (T4). La vue ne les traduit pas : le lecteur les lit au glossaire
de la vue, en tête.

## Les refus de ce gabarit

- **Une vue éditée à la main.** Elle se corrige dans la source, puis se régénère.
- **Un test rétro rédigé.** Il est le verdict de l'oracle ; un test rétro écrit par l'auteur dit ce
  que l'auteur croit, pas ce que la chaîne tient.
- **Une stratégie sans indicateur chiffrable.** Le format l'exige (S1), la vue le montre.
- **Un élément retiré effacé.** Il reste, marqué retiré avec son motif : la vue le rend en clair.

## Le lecteur se déclare

La vue porte son lecteur dans son en-tête (`role` et `sources_de_verite`) ; pour la ratification,
la restitution qui l'accompagne le déclare :

```
role_destinataire: {le demandeur qui ratifie l'intention, les stratégies et les tactiques, puis les sessions qui ajoutent une exigence}
```

## Avant de remettre

1. `oracle-cascade-isto.mjs` rend PASS sur la source, avec `--exigences` et `--tests`.
2. La vue est régénérée et `--verifier` rend exit 0.
3. La source et la vue partent dans le même commit.

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas
dans ses décisions sort d'ici et vit dans le **document d'auteur** : un fichier distinct, tenu par
celui qui produit, cité en renvoi et jamais recopié :

- la **fiche de conception** de la cascade, et les hypothèses de rédaction ;
- les **notes de reconstruction** : d'où vient une alternative écartée qu'aucune source n'écrivait ;
- le **journal des générations** et des verdicts successifs, qui vit au ledger du produit.

**La frontière est un critère d'ACTION, pas de confort.** Ce qui casse la chaîne (cible à fixer,
justification reconstruite, exigence sans test) reste chez le lecteur : c'est ce qu'il ratifie ou
tranche. Ce qui ne change que le travail de l'AUTEUR part au document d'auteur.

**Un document long se découpe en VUES d'un fichier unique, pas en fichiers**, sauf demande
contraire de son lecteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `oracles\oracle-cascade-isto.mjs` du pilot : la source, F1 à H2 bloquants, M1 à M4 mesurés ;
- `generateur\generer-vue-cascade.mjs --verifier` : la vue tient sa source, à l'octet ;
- `oracles\oracle-conformite-projet.mjs` du pilot, règle R-60 : la source passe l'oracle avant la
  clôture d'un run (`REGLES-PROJET.md`) ;
- `oracle-gabarits-documents.mjs` du pilot : G1, G2, G4, G7, G8, G10, G13 sur la famille.

## Limites du jugement

**Le fond de la chaîne.** Que l'intention citée soit la vraie, qu'une tactique serve réellement sa
stratégie : seule la ratification humaine le tranche, et I2 exige qu'elle soit tracée. **La
couverture par les tests** : la vue compte les exigences qu'un test CITE, citée n'est pas testée.

## Boucle de retour

La vue porte `gabarit: gd-cascade-produit` et sa version, en tête et en pied. Un retour sur la
**forme** se remet au pilot, par la section « Retours sur les documents produits » du lot
(`gabarits\RETOURS-FORGES.md`) ; un retour sur le **format de la source** vise
`gabarits\CASCADE-ISTO.json` et son oracle.
