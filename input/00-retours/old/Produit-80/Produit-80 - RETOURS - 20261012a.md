# Retours forges — Produit-80 — 20261012a

- **Contexte** : run de version 20261012-hub-version-1, ouvert sur les retours du commanditaire du 12/10/2026 après la première alimentation de l'instance locale par les 17 dépôts réels d'APP-IA ; lot remis en cours de run, à la demande du commanditaire (« remonte à la Factory »).
- **Références ledger** : `forge\ledger.jsonl` seq 315 à 318 (retours), 321 (mesure rouge de l'oracle d'exploitabilité), 324 (maquette jugée).
- **Remise au pilot** : copie dans `<pilot>\input\00-retours\_arrivee\`, avec le sidecar du même nom.
- **Statut** : remis le 12/10/2026

---

## Pilot (`digit-ai-factory`)

Les écrans du hub ont franchi toutes les portes du run produit sur le jeu de démonstration, puis le commanditaire les a jugés inexploitables à la première alimentation réelle.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-1 | bloquant | produit+générique | Critique d'implémentation (Renforcer puis PASS), `render_page.py` aux 7 largeurs, `check_maquette`, 2 458 tests backend et 585 d'interface : tous joués sur 2 projets de démonstration. À l'alimentation réelle, relevé à 1920 px le 12/10 : synthèse de la fiche 5 220 px en 4 colonnes déséquilibrées, complétude 20 630 px (une carte de 200 px par preuve), valeurs machine visibles (`not_assessed`, environnements sérialisés « url : … ; name : … »), libellés sur 4 lignes. Preuve : ledger seq 315 et 321, `forge\etapes\tests\exploitabilite-20261012-avant.json` (9 échecs). | Règle qui aurait évité le retour : aucune ne le couvre, d'où la classe à créer. Le produit a écrit `forge\oracles\oracle-exploitabilite.mjs` (5 règles X1 à X5 : hauteur hors tableau filtrable, densité de ligne, valeurs machine, colonnes déséquilibrées, libellés) ; piste : l'intégrer au socle ou à forge-design, et exiger que la critique d'implémentation se rejoue après la première alimentation réelle. |

Classe proposée pour RS-1 : `ecran-juge-sur-donnees-de-demonstration`, famille `affordance-ui`, libellé « Un écran est jugé sur le seul jeu de démonstration : aucun oracle ne mesure son exploitabilité au volume réel (hauteur par élément, colonnes déséquilibrées, valeurs machine brutes) ».

## Conception (`digit-ai-forge-conception`)

La surface du hub a été énumérée depuis la trajectoire ; trois usages attendus d'un registre n'y figuraient pas, et le commanditaire les a réclamés.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | majeur | générique | Ni la vue transverse (une même information pour tous les projets), ni la comparaison de deux projets ou plus, ni l'inventaire hiérarchique des ressources avec leur architecture n'ont été énumérés : 219 exigences, aucune sur ces usages ; le commanditaire les a demandés le 12/10. Preuve : ledger seq 317 et 318, DELTA-0002 (exigences E-500 à E-512 ajoutées en run de version). | Règle qui aurait évité le retour : la classe `surface-implicite-non-livree` existe, mais `enumere-la-surface` n'a pas de liste d'usages implicites par type de produit. Piste : pour un produit de type registre ou inventaire, faire énumérer d'office la vue transverse par attribut, la comparaison d'entités et le détail hiérarchique des objets observés. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'observation Resource Graph ne lisait qu'un abonnement (ledger seq 314) | réglage `HUB_AZURE_SUBSCRIPTION_IDS`, une seule requête sur tous les abonnements | non | propre au code d'observation du hub |
| Une nouvelle proposition de manifeste ne mettait pas la fiche à jour (seq 313) | `stock.propose` applique la proposition tant que le projet est proposé, test rouge puis vert | non | défaut d'un service du hub |
| Un `ruff format` lancé sur tout le backend a reformaté 33 fichiers étrangers au run (seq 326) | restauration depuis HEAD avant commit | non | erreur de la session, sans règle de forge en cause |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : `oracle-lot.mjs --murs` mesure 0 document repris cinq fois ou plus sous `output\`.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La règle TF-0780 (maquette validée avant le code d'une vue) a tenu : la maquette du run de version a été construite sur les données réelles, et ses critères chiffrés mesurés avant de la soumettre.
- Les oracles de forge-design ont relevé sur la maquette 13 espacements hors échelle, une bascule de thème sans persistance et un logo sans manifeste, tous corrigés avant soumission.

## Ordre recommandé

1. RS-1 : un oracle déjà écrit et joué est disponible chez le produit ; le défaut a coûté la confiance du commanditaire sur l'ensemble des écrans.
2. RC-1 : il touche chaque produit de type registre, dès sa conception.
