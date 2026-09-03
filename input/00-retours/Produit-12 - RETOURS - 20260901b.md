# Retours forges — Produit-12 — 20260901b

- **Contexte** : troisième retour utilisateur sur capture d'écran en trois jours, et mandat
  explicite de remontée (« remonte à la factory d'utiliser des composants qui sont user
  friendly et s'intégrant dans le Look&Feel de l'application, pas des trucs moches sortis de
  nulle part » ; « mets-le sous forme de bouton, pas de lien […] remonte également ce point »).
  L'objet : la fenêtre de choix du dossier racine (E-054), stylée aux jetons et verte aux
  tests serveur, rendue chez l'utilisateur au style par défaut sombre du navigateur, avec un
  déclencheur lisible comme un lien. Corrigé chez le produit dans la même session ; ce lot
  généralise. Il prolonge les lots 09 (RV-5, contenu des champs) et 10 (RV-6, cible de
  geste) : après le champ et son geste, **l'arrivée du rendu à l'écran**.
- **Références ledger** : `forge\ledger.jsonl` seq 115 (le correctif produit), seq 116 à 118
  (les retours), seq 119 (la remise)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-09-01 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RV s'arrêtait à RV-6 (lot 10), la série RD à RD-7 (lot 03).

---

## forge-design (`digit-ai-forge-design`)

Le cas tient en une phrase : **un composant peut être conforme dans le dépôt et hideux à
l'écran** — la fenêtre d'arborescence portait ses styles aux jetons, et l'utilisateur a
photographié une boîte noire aux boutons bruts du navigateur, ouverte par un déclencheur
qui ne ressemblait pas à un bouton.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-7 | majeur | produit+générique | **Aucun référentiel n'exige qu'un composant généré par script et affiché en sur-couche porte TOUT son habillage depuis les jetons, sans rien laisser au rendu par défaut du navigateur.** Mesuré sur Produit-12 (capture utilisateur du 2026-09-01, mots de l'utilisateur : « des trucs moches sortis de nulle part ») : la fenêtre `dialog` de choix du dossier racine, stylée dans `app.css` et verte aux tests serveur (campagne v0.4.0 api 483/483 ; suite 989/989 le jour du correctif), s'est affichée en boîte sombre aux boutons natifs. Deux mécanismes génériques, tous deux invisibles aux audits serveur : un élément en sur-couche (top-layer) est peint par le navigateur pour tout ce que la feuille ne fixe pas explicitement, et sans `color-scheme` déclaré, un poste en mode sombre peint ces rendus natifs en sombre au milieu d'une page claire. Correctif produit livré le jour même : habillage explicite de chaque élément de la fenêtre (fond, texte, états, icônes du référentiel clonées par `<template>` — zéro tracé ni couleur dans le script), et `color-scheme` déclaré par thème dans `tokens.css` | Volet « **livré à l'écran** » à joindre à la grille des lots 09-10 : (1) tout composant — y compris généré par script, y compris en sur-couche — porte fond, texte, états et icônes depuis les jetons, et le rendu par défaut du navigateur n'est jamais un habillage ; (2) le socle de jetons déclare `color-scheme` pour chacun de ses thèmes ; (3) la critique d'implémentation regarde les composants DYNAMIQUES (fenêtres, listes chargées) et pas seulement les écrans au chargement |
| RV-8 | majeur | produit+générique | **La sémantique des déclencheurs n'est un critère d'aucun référentiel : une action habillée en lien trompe l'affordance.** Le point d'entrée unique de la fenêtre — le déclencheur « Parcourir… » — était un bouton de variante « fantôme », sans fond ni bordure : il se lisait comme un lien, voire comme du texte, et l'utilisateur l'a dit avec ses mots (« mets-le sous forme de bouton, pas de lien. Le lien a une signification particulière, tout comme le bouton à la sienne »). Le premier retour de la veille sur ce composant (« je ne vois pas de changement ») avait la même racine : une fonctionnalité livrée dont le point d'entrée ne se voyait pas. Correctif produit : vraie apparence de bouton (`btn btn-petit` + icône) | Registre des déclencheurs dans la grille design : une **action** (ouvrir une fenêtre, lancer un traitement) se déclenche par un **bouton qui a l'air d'un bouton** ; un **lien** navigue ; la variante « fantôme » est réservée aux actions secondaires d'un contexte déjà actionnable et n'est **jamais l'unique accès** à une fonctionnalité. Critère mesurable en maquette comme à l'implémentation : lister les points d'entrée de fonctionnalité et vérifier leur famille visuelle |

## forge-development (`digit-ai-forge-development`)

La cause racine du rendu périmé n'est pas une affaire de style mais de socle, et c'est
l'objet du retour RD-8 (le versionnage des adresses de fichiers statiques) : ce que la
mise en production change sur le serveur n'arrive pas sur les postes.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-8 | majeur | produit+générique | **Le socle produit sert les fichiers statiques nus — sans version dans l'adresse ni en-tête de cache — et une MEP ne change alors pas ce que les navigateurs affichent** tant que leur heuristique de fraîcheur n'expire pas. Mesuré le 2026-09-01 sur Produit-12 : `curl -sI` sur `app.css` de production → 200, feuille à jour (le style du composant y est), **aucun `Cache-Control`** — pendant que le poste de l'utilisateur rendait une feuille d'avant le composant. Effet vicieux constaté : les deux fichiers expirent à des moments différents (heuristique = fraction de l'âge du fichier), donc un poste peut tenir un script NEUF avec une feuille VIEILLE — la fonctionnalité marche et s'affiche cassée, le pire état pour un retour utilisateur. Correctif produit : version de l'application en global de gabarits, `?v={{ version_app }}` sur les trois fichiers statiques des quatre gabarits de tête | Critère de socle : **toute adresse de fichier statique porte la version de l'application** (ou une empreinte du contenu), posé dès le gabarit de projet ; et la route MEP le vérifie — une mise en production dont les statiques ne sont pas versionnés livre un serveur à jour et des écrans d'hier |

## Remarques restées au produit

Une seule remarque reste au produit, avec son verdict écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le fil d'affichage de la fenêtre (chemin courant, icônes dossier/fichier/parent, débordement des noms longs) manquait de hiérarchie visuelle | pastille au jeton `surface-2` pour le chemin, icônes du référentiel du produit clonées par `<template>`, `overflow-wrap` sur les entrées | non | c'est de la mise au point locale sur les jetons et icônes propres à ce produit ; la classe générique — l'habillage complet d'un composant dynamique — est remontée en RV-7 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session du 2026-09-01.

## Confirmations positives

- **La fonctionnalité E-054 elle-même a tenu** : l'utilisateur a ouvert la fenêtre, vu son
  compte Dropbox réel (dossiers et fichiers distingués) et navigué — le retour ne porte que
  sur le rendu et l'affordance, pas sur le comportement. Le service qui neutralise le dossier
  racine pour partir de la racine du compte a fait exactement ce que l'exigence promet.
- **La série de la grille se compose bien** : RV-5 (contenu du champ), RV-6 (cible de geste),
  RV-7/RV-8 (arrivée du rendu et sémantique du déclencheur) se complètent sans se recouvrir —
  trois lots, trois volets d'une même grille de composants.

## Ordre recommandé

1. **RD-8** — le versionnage des statiques d'abord : sans lui, tout correctif design livré
   (y compris ceux de RV-7 et RV-8, et ceux des lots 09-10) peut rester invisible sur les
   postes, et chaque correctif suivant s'expose au même faux retour « rien n'a changé ».
2. **RV-7** — l'habillage complet des composants dynamiques, qui clôt la classe « conforme
   au dépôt, hideux à l'écran ».
3. **RV-8** — le registre des déclencheurs, qui clôt la classe « fonctionnalité livrée que
   personne ne voit ».
