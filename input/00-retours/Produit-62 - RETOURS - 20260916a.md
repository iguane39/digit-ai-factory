# Retours forges — Produit-62 — 20260916a

- **Contexte** : tour d'analyse L99 du 2026-09-16 (retour humain « gros problèmes avec le rapport Power BI généré, une seule table de faits et pas 4 ») — un retour humain qui révèle un défaut de lisibilité d'un livrable, et une friction d'outillage observée en séance sur le geste d'héritage.
- **Références ledger** : `forge\ledger.jsonl`, entrées du 2026-09-16 (`type: constat` origine humain, `type: retour` × 2, `type: conflit_regles`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-16

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-forge-data (`oracle-modeliser.mjs`, format `modele-dimensionnel@1`) et digit-ai-factory (gabarit de mode d'emploi d'un livrable-dossier)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-18 | majeur | produit+générique | **Un choix d'architecture tranché par l'humain n'est plus lisible dans le livrable 9 jours plus tard, et l'humain le prend pour un défaut.** Fait observé le 2026-09-16 : le commanditaire écrit « le rapport Power BI généré ne respecte pas les bonnes pratiques, par exemple l'utilisation d'une seule table de fait, et pas 4 comme actuellement ». Or les **4** tables de faits appliquent sa propre décision D-3 (c) du 2026-09-07 (« étoile pour le modèle sémantique + vue à plat de transition », ledger seq 13), et la déclaration machine `Client-A - Modele Dimensionnel Tenancy Schedule Asset - 20260911h.json` porte la matrice de bus à **4** processus, jugée conforme par `oracle-modeliser`. Le mode d'emploi du projet livré (`output\Client-A - Projet Power BI - 20260915b\LISEZMOI.md`) compte « Tables : 15 » et ne dit **nulle part** pourquoi il y a quatre tables de faits, ni quelle décision les fonde, ni pourquoi une table de détail à plat doit les accompagner. L'oracle qui juge le modèle vérifie la matrice de bus, les clés et les granularités — jamais qu'un lecteur du livrable peut retrouver le POURQUOI. *Une décision qui ne vit que dans le ledger n'est pas portée par le livrable qu'elle a façonné : le lecteur la redécouvre comme un défaut, et il a raison de poser la question.* Coût : un tour d'analyse complet (55 minutes) pour établir que le « défaut » était une décision. | **(1)** Le format `modele-dimensionnel@1` gagne, par table de faits, un champ `pourquoi` en prose destinée au lecteur (le processus métier servi, la décision qui le fonde) et `oracle-modeliser` le juge présent et non vide. **(2)** Le gabarit de mode d'emploi d'un livrable-dossier (LISEZMOI) porte une section « Choix d'architecture et décisions qui les fondent », alimentée depuis le ledger (`type: decision`) — un livrable façonné par N décisions les cite. **(3)** Fixture double sens : un modèle à 4 faits sans `pourquoi` FAIL, le même avec ses 4 `pourquoi` PASS. |

## digit-ai-factory (pilot, `scripts\recopier-heritage.mjs` et hook d'ouverture)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-19 | mineur | générique | **Le geste d'héritage refuse d'agir à cause de fichiers que le hook d'ouverture vient lui-même de recopier sans les commettre.** Fait observé le 2026-09-16 : `oracle-conformite-projet` rend R-47 FAIL (« 1 absent : forge/LEXIQUE.json ») et prescrit `node scripts\recopier-heritage.mjs .` ; le geste rend « GARDE — rien écrit (relancer avec --forcer, ou traiter les cibles listées) », exit 2, parce que `forge/RESTITUTION.md`, `forge/retours/CLASSES.json` et `forge/ECRITURE.md` sont modifiés-non-commis — et ces trois fichiers ont été recopiés **par le hook d'ouverture de la même session** (« 3 artefact(s) MIS À JOUR à l'instant depuis le pilot »). Il a fallu un commit intermédiaire des trois artefacts pour que le geste prescrit accepte d'instancier le lexique. La garde est juste (ne pas écraser du travail local) ; ce qu'elle protège ici est la sortie du pilot lui-même. Coût : un aller-retour et un commit de plus dans le tour. | **(1)** La garde du geste distingue une cible modifiée-non-commise **conforme au gabarit du pilot** (recopie de l'ouverture, empreinte égale à la source) d'une cible réellement personnalisée : la première ne bloque pas. **(2)** Ou bien le hook d'ouverture, qui sait qu'il vient de recopier, propose la ligne `git add … && git commit` en une seule commande copiable — il l'affiche déjà en trois morceaux. **(3)** Fixture : une cible recopiée-non-commise identique à la source ne fait pas basculer le geste en essai ; une cible modifiée par le produit le fait toujours. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le lexique du client (`grain` → « granularité ») vivait dans `docs\projet\LEXIQUE.md`, lisible par les recettes du produit et par aucun oracle du socle | `forge\LEXIQUE.json` instancié depuis le gabarit du pilot le 2026-09-16 et rempli du terme avec ses deux citations (ledger seq 50 et 99) ; S46 et EC-7 le lisent désormais | déjà généralisé par le pilot (TF-1045, gabarit `LEXIQUE-PRODUIT.json` du 2026-09-16) — c'est la réponse à la demande RP-04 du lot 20260911a | clos |
| Le type « Analyse » n'est pas au registre R-25 des types de livrables | le livrable a été nommé « Audit » avant remise ; aucun type nouveau improvisé | non — le registre est fermé à dessein | clos |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les livrables du tour sont une analyse L99 (skill `prompt-analyzer-l99`) et une restitution au gabarit `RESTITUTION.md`, tous deux jugés PASS par leurs oracles.

## Confirmations positives

- Le hook de lexique d'invocation a reconnu « Améliore ce prompt » comme un appel de `prompt-analyzer-l99` et l'a dit avant toute action : la classe `skill-non-invoque-lexique` n'a pas eu à jouer.
- Le gabarit `LEXIQUE-PRODUIT.json` est arrivé au pilot le jour même où un produit en avait l'usage, avec l'exemple exact du terme concerné : la boucle de retour RP-04 → TF-1045 a redescendu jusqu'au producteur.
- `oracle-synthese` S45 (inventaire des bloquants en tête du bloc 3) a refusé une première écriture qui répartissait quatre bloquants entre les blocs 3, 5, 7 et 8 : le lecteur les trouve maintenant énoncés en un seul endroit.

## Ordre recommandé

1. RF-18 — un livrable qui ne porte pas les décisions qui l'ont façonné se fait contester par celui-là même qui les a prises ; le défaut touche tout produit dont le modèle résulte d'arbitrages humains.
2. RF-19 — confort : la garde est juste, elle bloque seulement le mauvais cas.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-18** → `lecture-tiers-non-jugee` (famille `skill-ou-oracle-non-invoque`, correspondance APPROCHÉE : la classe vise l'absence d'oracle sur la compréhension d'un lecteur sans contexte ; ici le lecteur a le contexte — il a pris la décision — et ne la retrouve pas dans le livrable). Classe candidate, même famille, libellé proposé : `choix-d-architecture-decide-non-porte-par-le-livrable` — « une décision humaine qui façonne un livrable vit dans le ledger et pas dans le livrable : son auteur la redécouvre comme un défaut ».
- **RF-19** → `regle-qui-interdit-son-propre-remede` (famille `hook-ou-gate`, correspondance APPROCHÉE : la classe vise un contrôle bloquant qui refuse la correction qu'il recommande ; ici le geste prescrit par l'oracle est bloqué par la sortie d'un autre outil du même socle, le hook d'ouverture).
