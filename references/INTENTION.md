# La cascade de l'intention — Intention → Stratégie → Tactique → Opérationnel

Référentiel versionné (loi n° 4, daté-éditable) — **version 1.0.0, 01/09/2026**. Porté par la
**loi transverse n° 7** du noyau ; né du retour humain du 01/09/2026 (TF-0791) et décidé le
même jour (D-2, option a).

## Le fait fondateur

L'étude d'opportunité DataForSEO du 01/09 (20260901a) a répondu aux huit questions écrites de
sa candidature, rendu un verdict chiffré, passé ses contrôles de forme — et son destinataire
l'a refusée, mot pour mot : *« Le problème est que cette étude n'explique rien. Je ne sais pas
ce qu'on peut faire avec ces outils, les datas qu'ils permettent de récolter, pour quels
usages, avec quels intérêts, pourquoi 6 marchés et pas 7, quelles profondeurs, quels
périmètres ? »* Le défaut n'était pas dans l'exécution mais dans la **définition** : les
questions écrites étaient déjà tactiques et opérationnelles, et l'intention de l'utilisateur —
*comprendre pour décider lui-même* — n'était écrite nulle part. Répondre à la lettre d'une
demande peut donc échouer complètement à la servir.

## La règle, mot pour mot (retour humain du 01/09)

> « Intention > Stratégie > Tactique > Opérationnel, puis test rétro dans l'autre sens pour
> s'assurer que le résultat correspond à l'intention initiale de l'utilisateur. À appliquer
> sur tous types de demande, pas uniquement sur les études d'opportunité. »

## Les quatre niveaux, à la descente

1. **Intention** — ce que l'utilisateur cherche à obtenir, écrit **dans ses mots** (cité,
   jamais seulement reformulé). Si elle est reconstruite par l'agent, elle est **validée par
   l'utilisateur avant d'exécuter** — jouer un travail sur une intention devinée reproduit le
   défaut fondateur. L'intention est souvent un entonnoir ou une capacité (« comprendre pour
   décider »), pas la question littérale posée.
2. **Stratégie** — les décisions ou effets que le livrable doit permettre. C'est le manque
   (de donnée, de capacité, de preuve) qui définit le besoin — jamais l'offre d'un outil ou
   la commodité de l'agent.
3. **Tactique** — les moyens choisis, **chaque choix expliqué et justifié avec son
   alternative écartée** : un nombre de périmètre (« 6 marchés »), une profondeur, une
   cadence se motivent (« pourquoi 6 et pas 7 »). Un choix non justifié est une dette de
   confiance : le lecteur ne peut ni le contester ni se l'approprier.
4. **Opérationnel** — les chiffres, coûts, câblages, seuils. Chaque élément cite la ligne
   tactique qu'il sert ; ce qui ne sert rien est retiré.

## Le test rétro, à la remontée — avant toute restitution

Depuis **chaque élément opérationnel**, remonter sans rupture : Opérationnel → Tactique →
Stratégie → Intention. Une rupture de chaîne = un élément retiré, ou sa présence justifiée
par écrit. Deux vérifications complètent la remontée : les questions posées par l'utilisateur
(explicites ou dans un retour) sont **rejouées une à une** contre le livrable ; et tout terme
de domaine porte sa glose à son premier emploi — un lecteur qui ne connaît pas le domaine
doit pouvoir juger (même raisonnement que S9/S20/S23 des restitutions : une information non
comprise a le même effet qu'une information tue).

## Portée — tous types de demande

Études d'opportunité, runs produit, mandats transverses, runs de conseil, code : partout où
un livrable répond à une demande humaine. La profondeur s'adapte — une correction triviale ne
rédige pas quatre niveaux — mais la question se pose toujours : *le résultat sert-il
l'intention, ou la lettre ?* En cas de doute sur l'intention, on demande ; c'est le seul
aller-retour qui coûte moins qu'il ne rapporte.

## Contrôles

- **Études d'opportunité** : `oracles\oracle-etude-opportunite.mjs` — **E9** (section
  « Intention de l'utilisateur » présente, citation dans les mots du demandeur) et **E10**
  (test rétro présent et joué). Gabarit porteur : `gabarits\ETUDE-OPPORTUNITE.md`.
- **Le fond n'est pas mécanisable** et c'est déclaré : aucun oracle ne mesure qu'une
  remontée est *juste*, ni qu'une intention citée est *la vraie*. La validation de
  l'intention par l'utilisateur (niveau 1) est le seul contrôle du fond — humaine, tracée.

Première application : cadrage v2 puis étude v2 « données de recherche » du 01/09/2026
(`output\03-etudes\`). Mise à jour = nouvelle version + date.
