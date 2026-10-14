---
role: cascade du produit — intention, stratégie, tactique, opérationnel, puis test rétro (references/INTENTION.md) ; vue générée, jamais éditée à la main
sources_de_verite: [../../CASCADE-ISTO.json]
version: 1.0.0
verifie_le: AAAA-MM-JJ
gabarit: gd-cascade-produit
version_du_gabarit: 1.0.0
---

# Cascade du produit — <nom du produit>

**Version 1.0.0 du AAAA-MM-JJ · statut : <proposée | ratifiée le AAAA-MM-JJ (décision)>.** Règle : references/INTENTION.md 2.0.0. Vue générée depuis la source de la cascade par `generer-vue-cascade.mjs` (famille `gd-cascade-produit`) : la modifier, c'est modifier la source puis régénérer.

Ce document rattache chaque exigence du produit à un moyen choisi (une **tactique**), chaque moyen à un effet attendu (une **stratégie**), et chaque effet à ce que le demandeur cherche (l'**intention**). Une **alternative écartée** est l'autre moyen qu'on aurait pu prendre ; un **indicateur** dit à quoi l'on verra qu'un effet est atteint ; une **rupture** est un maillon qui ne remonte pas au niveau du dessus.

## Intention

Ce que le demandeur cherche, dans ses mots :

> « <la demande, dans les MOTS du demandeur> »
>
> — <document et section, ou message daté>

**Reformulation** : <ce que le demandeur cherche à obtenir, en une phrase>

**Validée** le AAAA-MM-JJ par <qui a validé : rôle ou nom> (<entrée de ledger type intention_validee (seq) ou décision D-N (option)>).

| Partie prenante | Rôle | Ce qu'elle cherche |
|---|---|---|
| PP-1 | <demandeur> | <ce qu'il cherche> |

**Arbitrage** : <obligatoire dès deux parties prenantes : quelle intention prime, et ce qui est garanti à l'autre>

**Contraintes** : C-1 <budget, droit, sécurité, plateforme, délai…> (<d'où elle vient>)

**Non-objectifs** : N-1 <ce que le produit ne cherche PAS à faire> (motif : <pourquoi c'est écarté>)

## Stratégie

Les effets que le produit doit produire. Le manque fonde chaque effet ; l'indicateur dit comment on le verra, la cible ce qu'on attend.

| Stratégie | Effet attendu | Manque qui le fonde | Indicateur | Valeur actuelle | Cible |
|---|---|---|---|---|---|
| **STR-1** | <ce qui devient possible chez l'utilisateur> | <le manque constaté qui fonde le besoin, jamais l'offre d'un outil> | <numérateur ÷ dénominateur> ; dénominateur : <sur quoi on le compte> ; lu : <où la mesure se lit> | <x sur y> — mesurée le AAAA-MM-JJ, <commande ou écran de mesure> | <la cible, par jalons si la valeur de départ est inconnue> |

## Tactique

Mode de lecture : une ligne par moyen retenu, dans l'ordre de la source ; la colonne « Alternative écartée » dit ce qu'on n'a pas pris et pourquoi, la dernière si ce pourquoi est écrit dans une source (« sourcée ») ou reconstruit par qui a rédigé la cascade (« reconstruite », à ratifier).

| Tactique | Stratégie | Moyen retenu | Alternative écartée, et pourquoi | Source | Statut |
|---|---|---|---|---|---|
| **TAC-1** | STR-1 | <la capacité du produit qui produit l'effet> | <l'autre moyen envisagé> — <pourquoi celui-ci et pas l'autre> | <d'où vient la justification> | <sourcée \| reconstruite> |

## Opérationnel

Mode de lecture : une ligne par tactique ; la troisième colonne liste les exigences qui la réalisent, la dernière les autres éléments qui la mettent en œuvre.

| Tactique | Stratégie | Exigences | Autres éléments |
|---|---|---|---|
| **TAC-1** | STR-1 | E-001 | ECR-1 (<ecran \| composant \| test \| commande_mep \| indicateur_exploitation \| controle_securite \| flux_donnees \| page_referencement \| document \| autre>) <ce que c'est> |

## Test rétro

{Verdict d'`oracle-cascade-isto` rejoué à la génération : règles en échec, exigences rattachées, puis les mesures M1 à M4. Cette partie ne se rédige pas : elle se génère.}

## Tenir la cascade à jour

1. Une exigence nouvelle cite sa tactique dans la source de la cascade, jamais dans cette vue.
2. Un changement déclare le plus haut niveau qu'il touche (I, S, T ou O) par une entrée d'historique, avec la décision qui l'a voulu.
3. Un élément qui sort reste dans la source, marqué `retiree`, avec son motif ou son remplaçant.
4. Juger la source : `node <PILOT_ROOT>/oracles/oracle-cascade-isto.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests>`.
5. Régénérer cette vue : `node <PILOT_ROOT>/gabarits/documents/cascade-produit/generateur/generer-vue-cascade.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests> --sortie <CASCADE.md>`.

| Version | Date | Niveau touché | Ce qui change | Décision |
|---|---|---|---|---|
| 1.0.0 | AAAA-MM-JJ | <I \| S \| T \| O : le plus haut niveau touché> | <ce qui change> | <D-N (option) ou entrée de ledger> |

*Gabarit : gd-cascade-produit · version du gabarit 1.0.0*
