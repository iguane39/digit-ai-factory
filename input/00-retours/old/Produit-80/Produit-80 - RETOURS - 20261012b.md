# Retours forges — Produit-80 — 20261012b

- **Contexte** : clôture du run de version 20261012-hub-version-1. Les 6 écrans de la maquette validée sont codés, audités par forge_tests et revus en critique d'implémentation sur les données réelles d'APP-IA. Le déploiement reste local, selon la décision du commanditaire du 12/10.
- **Références ledger** : `forge\ledger.jsonl` seq 334 (retour forge-tests), 337 à 339 (critique d'implémentation, remède, retour forge-design).
- **Remise au pilot** : copie dans `<pilot>\input\00-retours\_arrivee\`, avec le sidecar du même nom.
- **Statut** : remis le 12/10/2026

---

## Tests (`digit-ai-forge-tests`)

Deux audits complets du run ont coûté un passage de plus chacun, pour un constat déjà contesté et pour une trace que le projet avait pourtant réglée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | majeur | générique | Le constat `interface:frontend/src/components/coquille.tsx:203:a`, contesté le 30/09, est revenu non déclaré sous l'identifiant `:205:a` après l'ajout de 2 entrées de menu au-dessus : même lien, même défaut, identifiant différent. Preuve : `forge\etapes\tests\rapport-20261012.json` (constats non déclarés), `forge\constats-contestes.jsonl` ligne 27, ledger seq 334. | Règle qui aurait évité le retour : aucune. Piste : identifier un constat d'interface par son sélecteur ou son `data-testid` plutôt que par son numéro de ligne, ou rapprocher une déclaration orpheline d'un constat nouveau de même texte. |
| RT-2 | majeur | générique | `.env.forge-tests` porte `FORGE_TESTS_PLAYWRIGHT_TRACE=on` ; l'audit 12 a pourtant rendu le pan front « non mesurable, trace désactivée par le projet », alors que la suite e2e était verte. L'audit 13, avec la variable posée dans le shell, a mesuré 382 sur 427. Preuve : `forge\etapes\tests\rapport-20261012.json` (`motifs_non_couverture` du pan front), `rapport-20261012b.json`, ledger seq 333 à 335. | Règle qui aurait évité le retour : aucune. Piste : lire le fichier d'environnement du projet pour ce réglage, ou déclarer dans le rapport d'où vient la valeur retenue. |

Classe proposée pour RT-1 : `declaration-constat-ancree-a-la-ligne`, famille `contrat-interface-forge`, libellé « Une déclaration de constat contesté est indexée sur un numéro de ligne et tombe dès que le code se décale ».
Classe proposée pour RT-2 : `reglage-projet-ignore-par-la-forge`, famille `contrat-interface-forge`, libellé « Un réglage déclaré par le projet dans le fichier prévu pour la forge n'est pas appliqué, sans signal ».

## Design (`digit-ai-forge-design`)

La critique d'implémentation a dû passer par des instantanés sans script, faute de savoir ouvrir une application derrière une connexion.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | majeur | générique | `render_page.py` et `run-oracles-design.mjs` prennent un fichier HTML ; le hub exige une connexion OIDC. Sur les 6 écrans, l'instantané autonome (styles intégrés, scripts retirés) a produit des constats V1 et « Tableau ROGNE » que la mesure sur l'application servie dément, L2 sur `div#racine` à 0 px, et B-T2 et B-T3 sur la bascule de thème. `--matrice-etats` n'a pas pu jouer ; `--rendu` a rendu SKIP (playwright non importable hors `uv run`) ; le thème sombre n'a été mesuré qu'en forçant `data-theme` sur une copie. Preuve : `forge\etapes\design\Produit-80 - Critique d'implémentation - 20261012a.md`, section « Ce qui n'a pas été jugé » ; ledger seq 339. | Règle qui aurait évité le retour : aucune. Piste : un mode URL authentifiée (`storageState` Playwright, ou script de connexion fourni par le produit) pour `render_page.py` et la matrice d'états, une option `--theme dark`, et la détection de `uv` pour `--rendu`. |

Classe proposée pour RD-1 : `critique-application-connectee-injouable`, famille `skill-ou-oracle-non-invoque`, libellé « La critique d'implémentation ne peut pas juger une application servie derrière une connexion : instantané sans script, faux positifs et matrice d'états non jouée ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 9 écarts de rendu relevés par la critique sur données réelles, dont 2 bloquants (contraste 4,11:1, inventaire de 1804 px pour 1542 à 1920 px) | corrigés dans le tour, commit `72ea65a`, ledger seq 338 | non | défauts du code du hub ; l'oracle du socle les a trouvés |
| Deux seuils de l'oracle produit d'exploitabilité posés sans mesure (X2 à 64 px, X5 mesurant une hauteur) | X5 corrigé en 1.0.1, X2 ancré à 80 px en 1.1.0 | non | oracle propre au produit, déjà remonté par RS-1 du lot 20261012a |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `render_page.py` a relevé sur données réelles un contraste à 4,11:1 et une gouttière d'étiquettes à 38 % que l'oracle d'exploitabilité du produit ne mesure pas.
- La règle de socle E5 (conçu à 1920 px) a fait ressortir un tableau d'inventaire trop large de 262 px à la largeur de conception.

## Ordre recommandé

1. RD-1 : sans lui, chaque critique d'une application connectée produit des faux positifs à trier à la main.
2. RT-2 : un réglage ignoré en silence rend un pan non mesuré.
3. RT-1 : il coûte une déclaration à refaire à chaque décalage du code.

## Note de réception du pilot (14/10/2026)

Le lot a été refusé à la porte le 14/10/2026 : ses classes ne figurent pas au référentiel `todo/CLASSES.json`. Le pilot les fait entrer par la voie prévue pour un défaut neuf (TF-1128) : `"classe": "classe-a-creer"` avec la classe proposée ci-dessous, rangée dans une famille existante. La classe se crée au référentiel à l'instruction du retour.

- `declaration-constat-ancree-a-la-ligne` — famille `contrat-interface-forge` ; libellé : digit-ai-forge-tests : une déclaration de constat contesté indexée sur un numéro de ligne tombe dès que le code se décale (avant la note : classe « declaration-constat-ancree-a-la-ligne » portée directement, inconnue du référentiel).
- `reglage-projet-ignore-par-la-forge` — famille `contrat-interface-forge` ; libellé : digit-ai-forge-tests : FORGE_TESTS_PLAYWRIGHT_TRACE du fichier .env.forge-tests n'est pas appliqué (avant la note : classe « reglage-projet-ignore-par-la-forge » portée directement, inconnue du référentiel).
- `critique-application-connectee-injouable` — famille `skill-ou-oracle-non-invoque` ; libellé : digit-ai-forge-design : la critique d'implémentation ne sait pas juger une application servie derrière une connexion (avant la note : classe « critique-application-connectee-injouable » portée directement, inconnue du référentiel).
