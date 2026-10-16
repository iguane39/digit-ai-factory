# Retours forges — Produit-82 — 20261014a

- **Contexte** : ouverture du run `Produit-82-20261014-ouverture`, juste après l'adoption du dispositif par `installer-projet.mjs`.
- **Références ledger** : `forge\ledger.jsonl` seq 3, 4, 5, 6 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

L'humain a demandé si la factory était opérationnelle sur ce produit. L'installateur a répondu oui ; l'oracle de conformité a répondu non au même instant. Combler l'écart a demandé de lire le code de l'oracle.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | majeur | générique | Le 14/10/2026, `scripts\installer-projet.mjs` rend « FACTORY DIGIT-AI OPÉRATIONNELLE », 8/8 contrôles verts, exit 0, sur `C:\dev\Produit-82`. Au même instant, `oracles\oracle-conformite-projet.mjs` rend FAIL sur ce projet : R-12 (`README.md` absent), R-13 (`.env.example` absent), R-20 (`docs\projet\` absent). Ledger seq 3. | Jouer `oracle-conformite-projet` dans l'installateur et afficher ses FAIL comme reste à faire de l'ouverture du run. Règle qui aurait évité le retour : aucune ne relie le bandeau de l'installateur à l'oracle de conformité. |
| RT-2 | majeur | générique | Après l'adoption, aucun geste outillé ne pose le socle d'ouverture de run : `docs\projet\` instancié, `README.md`, `.env.example`, entrée `run_open`. La session a lu `oracle-conformite-projet.mjs` l. 1775-1900 pour connaître les exigences, puis joué l'oracle trois fois : 3 FAIL, puis 4 FAIL (R-23 ×3, R-26), puis PASS. Ledger seq 4. **RT-2** : clé proposée `adoption-sans-ouverture-de-run`. | Un script `ouvrir-run.mjs` qui copie les gabarits `docs-projet`, pose `README.md` et `.env.example`, écrit `run_open` et liste les marqueurs à remplir. Aucune règle ne couvre ce geste. |
| RT-3 | mineur | générique | `oracle-conformite-projet` range en `non_juge` les marqueurs non instanciés d'un `CLAUDE.md` posé le jour même : « verifie_le=non daté — antériorité déclarée, jamais un défaut de produit ». Le gabarit `CLAUDE-PRODUIT.md` ne porte pas de `verifie_le`, donc un `CLAUDE.md` né après TF-1119 (15/09) n'en sera jamais justiciable. Ledger seq 5. | Dater l'antériorité par la date d'adoption consignée au carnet d'écarts ou par le premier commit. Règle concernée : R-20 ter étendu aux fichiers hérités (TF-1119). |
| RT-4 | mineur | générique | `scripts\adopter-projet-existant.mjs` ne connaît que `--type documentaire`. Une passerelle d'API sans site public reçoit donc `robots.txt` et `llms.txt`, que R-27 réserve au produit à surface web, et R-20 ter avertit sur `llms.txt` à chaque ouverture (9 marqueurs). Écart consigné au carnet du produit le 14/10/2026. Ledger seq 6. **RT-4** : clé proposée `type-de-projet-binaire-a-l-adoption`. | Un type « service sans site public » qui écarte `robots.txt` et `llms.txt` comme le type documentaire, sans exempter R-13. Règle concernée : R-27 et TF-1439. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Huit fiches de `docs\projet\` instanciées depuis les gabarits, sans aucun code encore | statut « déclaré » et mention « sans objet » datée, projections HTML générées par les scripts du pilot | oui | remonté sous RT-2 |
| Fiche d'accès : les noms des tenants fictifs étaient lus comme des identifiants en clair (R-23) | lignes retirées, les clés API renvoyées aux variables `CLIENT_A_API_KEY` et `CLIENT_B_API_KEY` | non | rien de généralisable : la règle a jugé juste, la fiche était mal remplie |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `bootstrap --pull` : 16 dépôts à jour, poste prêt, le 14/10/2026.
- `ledger.mjs append --fichier` et `verify` : 6 entrées écrites et jugées intègres sous le schéma 1.1, sans aucune reprise.
- Les scripts `generer-architecture.mjs` et `generer-modele-donnees.mjs` ont produit leurs projections au premier essai, l'exemption « sans objet » comprise.

## Ordre recommandé

1. RT-1 : un bandeau vert qui contredit l'oracle trompe l'humain sur la question même qu'il pose.
2. RT-2 : le script d'ouverture supprime la lecture du code de l'oracle et éteint RT-1 sur le fond.
3. RT-3, puis RT-4.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : ils viennent tous de la confrontation entre l'installateur et l'oracle de conformité. Deux classes sont proposées. **RT-2** : `adoption-sans-ouverture-de-run`, famille `heritage-produit`, libellé « L'adoption pose l'héritage mais aucun geste outillé ne pose le socle d'ouverture de run ». **RT-4** : `type-de-projet-binaire-a-l-adoption`, famille `heritage-produit`, libellé « L'adoption ne distingue que documentaire et site web, et un service sans site public reçoit les artefacts d'un site ».
