# Retours forges — Produit-79 — 20261112c

- **Contexte** : l'exploitant demande, le 12/11/2026, que les publications partent « sans avoir besoin de ce poste, y compris pour Instagram ce soir et les autres fois » ; une semaine programmée le jour même dépendait du poste, et la préparation automatique du jeudi aurait doublé des campagnes posées à la main
- **Références ledger** : `forge\ledger.jsonl` seq 1205 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Un planificateur hébergé qui ne se replanifie qu'à ses propres tours laisse sans déclencheur toute échéance ajoutée entre deux tours.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-28 — échéance ajoutée entre deux tours d'un planificateur hébergé, sans déclencheur | majeur | générique | 12/11/2026 : la tâche Railway du produit planifie les 7 jours suivants à chacun de ses tours (`tour.py` appelle `planning.planifier`) ; son filet passe à 7h07 et 8h07 UTC. N01, programmée à 12h32, n'avait aucun tour avant le lendemain : le relevé `railway-planning.json` portait `"echeances": []` à 09h07, et la garde de 17h30 comme l'Instagram de 19h00 dépendaient d'une session restée ouverte sur le poste. Corrigé au produit le 12/11 à 15h56 : le workflow `reseaux-echeances-du-jour`, lancé après chaque programmation, joue ces échéances ; passage 43242648733 en attente à 15h58. | Règle qui aurait évité le retour : aucune exécutée ; classe à créer `echeance-ajoutee-entre-deux-tours` (famille `hook-ou-gate`). Proposition : toute chaîne qui ajoute une échéance à un planificateur hébergé déclenche aussitôt une replanification, ou un exécutant qui couvre l'intervalle jusqu'au tour suivant ; le contrôle d'ouverture compare les échéances du jour au dernier relevé du planificateur. |

## Rattachement

Registre interrogé le 12/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 7 158 entrées dont le texte répond à `/(planificat|planning).{0,80}(jour même|replanif|trou|non couvert)|échéance.{0,40}non couverte/i` → 0 ligne trouvée.

Aucun item recoupé. RP-26 (lot 20261112a) traite un workflow de publication en échec sans alerte, pas une échéance sans déclencheur.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La préparation automatique du jeudi (`preparer_jeudi`) aurait préparé et fusionné la semaine du 23/11 en plus des campagnes N06 à N08 posées à la main | corrigée le 12/11 à 15h56 : `reseaux-preparer` saute une semaine dont le fichier porte déjà des publications (demande de fusion n° 5) | non, propre à la chaîne de publication de ce produit | reste au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot ; verdicts repris du lot 20261112a :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le contrôle `programmer_publications.py prochaine`, joué sur les fichiers réels avant la fusion, a rendu 17h30 puis 19h00 puis rien : la correction s'est prouvée sur l'état du jour avant d'être publiée.
