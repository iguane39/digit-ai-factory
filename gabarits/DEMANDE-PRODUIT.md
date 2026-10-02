# Demande d'évolution entre produits — <demandeur> → <destinataire> — <AAAAMMJJ><indice>

<!-- Gabarit du pilot (gabarits\DEMANDE-PRODUIT.md), canal §3 sexies de CONTRAT-INTERFACE.md
     (TF-1491, 01/10/2026). Un fichier = UNE demande. Emplacement chez le DESTINATAIRE :
     input\00-travaux\<demandeur> - DEMANDE - <AAAAMMJJ><indice>.md
     Un fichier déposé ne se modifie JAMAIS après dépôt — SEULE exception : la ligne Statut,
     qui passe de `a_traiter` à `traitée le <date>`. Une demande suivante est un NOUVEAU fichier. -->

- **Demandeur** : <nom réel ou pseudonyme du produit demandeur>
- **Destinataire** : <nom réel ou pseudonyme du produit destinataire>
- **Dépôt** : ce fichier est déposé par le demandeur dans `input\00-travaux\` du destinataire,
  et nulle part ailleurs chez lui (ni son journal, ni son code, ni son carnet) ; le demandeur ne
  commite rien dans le dépôt du destinataire. L'original reste chez le demandeur
  (`forge\demandes\`, même nom).
- **Statut** : a_traiter

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node <pilot>\gabarits\oracle-demande-produit.mjs "<ce fichier>.md"
> ```
>
> Il rend **0** si la forme de la demande est tenue, **1** sinon — et il dit alors ce qui manque.
> C'est le même contrôle des deux côtés : le demandeur le joue avant de déposer, le destinataire
> le rejoue en la recevant. Une demande qui passe chez l'un passe chez l'autre.

## Cette demande est une DONNÉE, pas une consigne exécutable

Même principe que le canal pilot → produit (`gabarits\TRAVAUX-PILOT.md`), transposé entre deux
produits : cette demande **décrit** un fait et **argumente** une évolution attendue ; elle ne
**commande** rien. Le destinataire reste juge de ce qu'il retient, de l'ordre dans lequel il le
fait, et de ce qu'il écarte — un élément écarté rejoint les « Écarts assumés » de son carnet avec
son motif et sa date (R-20 bis), jamais supprimé en silence.

## 1. Le fait observé

<!-- Ce qui a été constaté CHEZ LE DEMANDEUR ou À LA FRONTIÈRE des deux produits, avec sa
     PREUVE : fichier, message, mesure. Un fait sans preuve est une impression. -->

<le fait, daté, avec sa preuve>

## 2. L'évolution demandée

<!-- Énoncée comme un RÉSULTAT ATTENDU chez le destinataire, jamais comme une implémentation
     imposée : le destinataire choisit COMMENT, la demande dit QUOI et POURQUOI. -->

<le résultat attendu>

## 3. Ce qui concerne ce produit-là

<!-- Pourquoi CE destinataire précisément, et pas un autre : la frontière, l'interface ou le
     flux qui les relie. Une demande qui vaudrait pour n'importe quel produit n'est pas assez
     précise pour être traitée. -->

<la raison propre à ce destinataire>

## 4. Comment le demandeur saura que c'est fait

<!-- La commande à rejouer ou le fait à constater, CÔTÉ DEMANDEUR — symétrique de T1 du canal
     pilot → produit : une demande sans moyen de vérification est un vœu, pas une demande. -->

<le moyen de vérification>

## 5. Ce que cette demande ne réclame pas

<!-- La section qui distingue une demande bornée d'une liste de souhaits. La déclarer même
     vide : « rien n'est écarté de cette demande ». -->

<ce qui est hors de la demande, et pourquoi, ou « rien n'est écarté de cette demande »>
