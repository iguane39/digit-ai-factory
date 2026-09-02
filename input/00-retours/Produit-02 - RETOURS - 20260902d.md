# Retours forges — Produit-02 — 20260902d

- **Contexte** : analyse des causes demandée par l'humain après la troisième inspection de la
  console v2 en production le 02/09 (« aucune réflexion dans les informations affichées, règles
  de la factory pas prises en considération, tests pas joués ou pas vus »).
- **Références ledger** : `forge\ledger.jsonl` seq 102 (entrée `type: retour`) ; analyse
  complète : `forge/etapes/ANALYSE-CAUSES-console-v2-20260902.md`.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-02

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "<ce fichier>.md"
> ```
>
> Il rend **0** si la forme du lot est tenue, **1** sinon.

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT du produit (dernier employé : RT-77, lot 20260902c).

---

## Factory (`digit-ai-factory`)

Sept défauts de base ont survécu à trois livraisons et quatre oracles verts. L'analyse jointe
prouve deux causes structurelles : la factory n'a aucun oracle de **sens** (ce que le lecteur
comprend) à côté de ses oracles de forme, et le routage « juger le rendu visuel → critique
d'implémentation de forge-design » n'est pas câblé — une session peut livrer sans l'invoquer,
et celle-ci l'a fait trois fois.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-78 | bloquant | générique | **Aucun oracle ne juge si un lecteur sans contexte comprend une page de données.** Fait : V6 de la console (huit comptes par marché, aucun mot-clé visible, aucun geste) a passé le contrat de sortie, l'oracle de filtres, le rendu et le test d'interactions ; l'humain : « on n'y comprend absolument rien ». Idem pour les en-têtes « doublon de volume » et « vu par Google » sans définition (`tableaux.js` ligne 144 : l'infobulle dit « Trier par »). Preuve : analyse jointe, chapitre 1 lignes 2 et 5 ; captures du 02/09. | Oracle **lecture par un tiers** au standard §3, bâti sur `oracle-llm.mjs` : un juge sans accès au brief ni au code reçoit l'instantané DOM et les captures, et doit expliquer chaque colonne, chaque ligne et le geste de chaque vue ; un « je ne sais pas » = FAIL. Câblé dans `settings-produit.json` sur le hook de restitution et dans le workflow de contrôles avant poussée en production. |
| RT-79 | bloquant | générique | **Le routage « juger le rendu visuel → critique d'implémentation de forge-design » n'est pas câblé.** Fait : `CLAUDE.md` du produit ligne 29 l'exige ; les skills `critique-le-design`, `ameliore-le-design`, `impeccable` sont installés ; aucune invocation dans la session ; trois revues visuelles « à l'œil » par la session auteur, trois livraisons. Preuve : journal de session du 02/09, `forge/captures/console-v2/REVUE-VISUELLE-console-v2-20260902.md` signé par la session. | Le hook de restitution refuse une restitution de livrable HTML dont les traces ne portent pas un verdict `critique-le-design` daté ; le gabarit de restitution ajoute la ligne « juge de design : <verdict, date> » au bloc 9. Une règle non câblée est une règle absente (loi des affordances). |
| RT-80 | majeur | générique | **L'auteur d'un brief juge son propre contrat de sortie.** Fait : les 22 critères du brief v2, les quatre oracles et les revues ont été écrits et exécutés par la même session (02/09, 13:00 → 13:52 UTC) ; les critères étaient vrais et le livrable illisible. La loi qualité interdit de juger son propre code ; rien n'interdit de juger ses propres critères. | Séparation obligatoire : le contrat de sortie d'un run est dérivé du brief par un agent distinct de l'exécutant, et le juge de lecture par un tiers (RT-78) ne reçoit jamais le contrat ; `oracle-etat-forge` vérifie au ledger que rédacteur du contrat et exécutant diffèrent. |
| RT-81 | majeur | générique | **Aucune règle n'impose un dictionnaire de colonnes.** Fait : aucun en-tête de la console n'a de définition, d'unité ni de source ; « valeur d'un séjour hors saison » affichée avec une source en €/an par point d'occupation, consommée par une formule « séjours × valeur » ; `oracle-calculs` SKIP (aucun calcul détecté dans un document sans nombres). Preuve : `console/index.html`, champs `CHAMPS_HYP` ; cadrage SEO ligne 40. | Règle de socle : tout tableau de données déclare ses colonnes (nom, définition ≥ 8 mots, unité, source, ordre) dans un fichier de données ; en-têtes, infobulles et glossaire générés depuis ce fichier ; `oracle-filtres-tableau` G7 « th sans `data-definition` = FAIL » ; `oracle-calculs` lit le dictionnaire et refuse une formule aux unités incomposables, et signale une hypothèse calculable depuis une donnée du dépôt (ici la grille tarifaire de `build/data.mjs`). |
| RT-82 | majeur | générique | **Les règles de largeur se contredisent sans arbitrage écrit** : colonne de lecture 68-90 ch pour la prose, pleine largeur pour les données. Fait : `.chapo { max-width: 90ch }` dans une page pleine largeur, signalé par l'humain comme « répété des dizaines de fois sans être définitivement corrigé » ; `render_page.py` mesure les débordements, jamais la sous-utilisation d'un conteneur. | Règle : une page marquée `data-page="donnees"` est pleine largeur ; un bloc de prose y prend la largeur de son conteneur ou tient en deux lignes ; `render_page.py` V-n « bloc de texte < 70 % de son conteneur sur une page de données » = défaut ; « tableau rogné dans un conteneur défilant à ≥ 1 280 px » = bloquant (déjà RT-75). |
| RT-83 | majeur | générique | **Une correction après retour humain traite le symptôme, jamais la classe.** Fait : hauteur de ligne en V7 corrigée en cachant la période (l'information « quand » a disparu) ; largeur corrigée pour les tableaux, pas pour la prose ; débordement à 390 px reclassé « acceptable ». Preuve : analyse jointe chapitre 3 ; commits `f4f56e3`, `beb0dcc`. | `oracle-synthese` refuse une restitution de correction sans « contrôle rouge → vert » nommé qui couvre toutes les occurrences de la classe sur la page ; le lot de retours cite, pour chaque retour humain, la règle qui l'aurait évité, ou déclenche la règle §4. |
| RT-84 | mineur | générique | **Aucune maquette validée avant le code d'une vue nouvelle.** Fait : V1 à V7 définies par un tableau « question · dimensions · mesures · action » écrit par la session ; le destinataire n'a rien vu avant la production ; le compagnon visuel du brainstorming n'a pas été offert au motif de l'autonomie demandée. | `oracle-etat-forge` refuse un run de version d'interface sans maquette validée au ledger (une ligne de données réelle, colonnes définies, geste) ; l'autonomie ne dispense pas de cette validation d'une minute. |

## digit-ai-page-html (`digit-ai-page-html`)

Le composant de filtres ordonne ses valeurs par tri de chaînes, et aucune règle ne dit qu'une
dimension temporelle se rend comme du temps.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-85 | majeur | générique | **Les valeurs de facette sont triées alphabétiquement** (`table-filters.js` ligne 56, `Object.keys(distinctes).sort()`) : « août 2025, avr. 2026, déc. 2025, févr. 2026 » dans la liste des mois de la console. Preuve : capture humaine du 02/09 (panneau « Mois »). | Le composant lit une valeur d'ordre sur la cellule (`data-v`, déjà proposé pour le tri en RT-72) pour ordonner les valeurs de facette ; à défaut, tri numérique puis chronologique quand la valeur se lit comme une date ; G8 « facette temporelle chronologique ». |
| RT-86 | majeur | générique | **L'heuristique de cardinalité prive la colonne clé de sa facette** (`table-filters.js` ligne 56 : facette seulement si 1 < n < lignes) : sur V1, huit marchés tous distincts, aucune facette « Marché » — le filtre le plus utile du tableau. Preuve : capture humaine du 02/09 (V1 sans filtre). | Règle : chaque en-tête d'un tableau de données est triable et filtrable, exemption motivée par colonne ; l'heuristique ne décide plus de l'existence d'une facette, seulement de sa forme (liste courte ou recherche) ; G7 « chaque th porte une facette ou `data-filter-col="off"` motivé ». |
| RT-87 | majeur | générique | **Aucune règle « le temps s'affiche comme du temps ».** Fait : fenêtres de campagne en V7 rendues par un libellé (« Vacances scolaires — Allemagne ») sans mois ; la source `donnees/calendrier-evenementiel.json` ne porte que de la prose (`periode`, `fenetre_recherche_amont`) par principe (« aucune date précise n'est inventée »). Preuve : capture humaine du 02/09 (V7) ; fichier de calendrier, clés `evenement, periode, source_dates, marches, fenetre_recherche_amont, requetes_candidates`. | Règle de socle : une dimension temporelle se rend en dates ou bornes de mois ordonnées, et une vue de fenêtres est une frise mensuelle ; schéma de calendrier avec `mois_debut`, `mois_fin`, `marches` en champs, la prose en commentaire ; `render_page.py` V-n « colonne temporelle sans valeur d'ordre » = défaut. |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot : les sept défauts signalés sont tous des
instances de classes remontées ci-dessus — vérifié par la session, le 02/09/2026, contre
le chapitre 1 de l'analyse jointe (sept lignes, sept règles).

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur cette analyse — vérifié par la session, le
02/09/2026.

## Confirmations positives

- **La demande humaine « sans corriger, identifie pourquoi » est le bon protocole** : la
  troisième correction de symptôme aurait produit un quatrième retour. L'analyse a trouvé
  deux causes structurelles que les corrections n'auraient jamais fermées.

## Ordre recommandé

RT-78 et RT-79 d'abord, ensemble (l'oracle de sens et le juge de design câblé ferment la
cause de six défauts sur sept) ; RT-80 et RT-81 ensuite ; RT-85 à RT-87 (composant et règle
du temps) ; RT-82, RT-83, RT-84 en dernier.
