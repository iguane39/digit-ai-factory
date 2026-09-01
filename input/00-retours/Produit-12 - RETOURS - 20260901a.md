# Retours forges — Produit-12 — 20260901a

- **Contexte** : retour utilisateur du 2026-09-01 sur le sélecteur de date de l'écran de
  génération (« on est obligé de cliquer dans le bord droit du composant alors qu'on devrait
  pouvoir y accéder partout ; vu la taille du composant, personne ne pense à cliquer tout à
  droite »), corrigé chez le produit dans la même session, et mandat de remontée à la
  factory. Ce lot complète le lot 09 de la veille (RV-5, règle « typé, proposé, borné ») :
  après le contenu du champ, sa **cible de geste**.
- **Références ledger** : `forge\ledger.jsonl` seq 109 (le correctif produit), seq 110 (le
  retour), seq 111 (la remise)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-09-01 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RV s'arrêtait à RV-5 (lot 09).

---

## forge-design (`digit-ai-forge-design`)

Le cas tient en une phrase : sur un champ de date natif, **la seule zone qui ouvre le
calendrier est une icône d'une vingtaine de pixels au bord droit** — le reste du champ, soit
l'essentiel de sa surface, n'y donne pas accès, et l'utilisateur l'a dit avec ses mots :
personne ne pense à cliquer là.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-6 | majeur | produit+générique | **La cible de geste d'un composant composite n'est un critère d'aucun référentiel : le comportement natif du navigateur fait la loi, et il est mauvais.** Mesuré sur l'écran de génération d'Produit-12 (retour utilisateur du 2026-09-01, capture à l'appui) : sur un `input type="date"`, seul le clic sur l'icône de calendrier au bord droit ouvre le sélecteur ; un clic sur le corps du champ — la quasi-totalité de sa surface — place un curseur de saisie, ce que l'utilisateur d'un champ de date ne demande presque jamais en premier geste. Le défaut est INVISIBLE aux audits : la campagne forge-tests v0.4.0 mesurait ce champ « câblé » (interface 233/235), et il l'était — l'affordance existait, c'est sa surface utile qui était de vingt pixels. Correctif produit livré le jour même, huit lignes de script global : clic n'importe où sur un champ date → `showPicker()`, garde sur `disabled`/`readOnly`, silence si le navigateur refuse le geste — et la saisie clavier reste entière (le focus par Tab n'ouvre rien, Échap ferme le calendrier et rend le champ éditable). Vaut d'un coup pour les quatre écrans porteurs de dates du produit | Ajouter à la grille RV-5 du lot 09 un quatrième volet : **« atteignable »** — la cible de geste d'un composant couvre TOUT le composant, jamais une fraction de sa surface (champ date → tout le champ ouvre le calendrier ; il en va de même pour tout composant dont l'affordance visible est plus large que sa zone active) ; le mode de saisie alternatif reste toujours ouvert (clavier au moins, pour l'accessibilité comme pour la vitesse). Et le critère se mesure : à la maquette comme à l'implémentation, un composant dont la zone active est plus petite que sa surface visible est un défaut nommé — c'est une mesure de géométrie, pas un jugement |

## Remarques restées au produit

Une seule remarque reste au produit, avec son verdict écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les quatre écrans porteurs de champs date (génération, statistiques courriels/stockage/IA) partageaient le même défaut de cible de clic | comportement 7 du script global (`app.js`) : la correction est UNE fois dans le socle de l'interface, pas quatre fois dans les écrans — 1 test de câblage, 73/73 sur les fichiers génération + interface | oui | c'est le cas fondateur de RV-6 ci-dessus, remonté avec sa mesure ; la leçon locale — corriger dans le socle du produit, pas écran par écran — est aussi celle que la grille propose à la forge |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session du 2026-09-01.

## Confirmations positives

Deux confirmations méritent d'être dites.

- **La grille « typé, proposé, borné » de la veille (RV-5) a tenu à l'usage** : le champ
  corrigé hier portait bien sa valeur proposée et ses bornes — le retour du jour ne porte
  que sur la cible de geste, c'est-à-dire précisément le volet que la grille ne couvrait
  pas encore. Les deux lots se complètent sans se recouvrir.
- **`showPicker()` suffit, sans bibliothèque** : huit lignes de JavaScript sans dépendance,
  dans le script global existant — la règle « atteignable » ne coûte aucun composant tiers.

## Ordre recommandé

Un seul retour ; il s'ingère avec le lot 09 de la veille, dont il est le quatrième volet.

1. **RV-6** — joindre « atteignable » à la grille RV-5 avant qu'elle ne soit versée au
   référentiel : une règle de champ qui dit quoi proposer mais pas comment l'atteindre
   laisserait le prochain écran refaire exactement ce défaut.
