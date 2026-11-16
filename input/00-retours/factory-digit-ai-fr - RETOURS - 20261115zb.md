# Retours forges — factory-digit-ai-fr — 20261115zb

- **Contexte** : run `forge-digit-ai-fr-20261114a`, retour humain du 15/11/2026 vers 20:05 sur une capture de l'accueil de la v2 : « Il y a un problème de colonnes sur toutes les pages. Corrige. Et comment la Factory n'a pas vu ce problème avant moi ? Remonte à la Factory. »
- **Références ledger** : forge/ledger.jsonl seq 406, 407 (décision D-233), 408, 409, 410, 411, 412.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'humain a vu sur une capture ce qu'aucun contrôle n'a signalé : la v2 laissait la droite du cadre vide sur la plupart des pages. Mesuré à 1 440 px par un contrôle écrit dans le tour (`forge/etapes/tests/outils-v2/colonnes_vides.py`), 9 pages sur 10 laissaient de 39 à 66 % du cadre vide à droite, sur 480 à 2 160 px de haut. Deux causes de gabarit : l'accueil réservait deux colonnes au bandeau de projection alors que le clip y est masqué jusqu'à sa date, et la page segmentée gardait une marge animée vide sur 60 % de sa hauteur. L'humain a tranché la forme de la correction (D-233 (b) : centrer la colonne quand la page n'a pas de marge). Après correction, le contrôle passe sur 21 pages à 4 largeurs (84 mesures), les 330 tests du produit passent, et la critique de forge-design ne porte aucun constat nouveau par rapport à son archive du 15/11.

---

## digit-ai-page-html (`skill`)

Ce chapitre porte deux retours, RP-80 et RP-82 : une dispense de mise en page posée trop haut éteint la règle qui voyait ce défaut, et aucune règle ne juge une piste de grille vide.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-80 | **majeur** | générique | **La règle L2 « conteneur de lecture calé à gauche » de `render_page.py` existe pour ce défaut exact (refus humain du 21/08 : « la moitié de la page vide à droite »). La v2 l'a éteinte en posant `data-colonne-ok` sur `<main>`, avec un motif écrit par l'agent (« la largeur bornée est la thèse ») : `closest('[data-colonne-ok]')` dispense alors toute la page, et aucune décision humaine n'a validé cette dispense.** Preuve : `templates/v2/page-contenu.html` avant le commit de ce lot ; `render_page.py` lignes 1261 à 1278 ; ledger du produit, entrée 408. Après le retrait de la dispense et le centrage, L2 ne relève aucun bloquant sur les 5 pages rejouées. | N'accepter `data-colonne-ok` que sur le conteneur brideur lui-même, jamais sur un ancêtre ni sur `main` ou `body`. Lister chaque dispense posée, avec son motif, dans le `non_juge` du verdict. Chez un produit, consigner une dispense de mise en page comme décision humaine. |
| RP-82 | **majeur** | générique | **Aucun oracle ne juge une piste de grille réservée sans contenu : marge animée vide sur 60 % de la hauteur d'une page, bandeau à deux colonnes avec une seule figure. L2 compare un conteneur à son parent ; débordement, contraste et chevauchement jugent des éléments présents, jamais une place vide.** Preuve : `forge/etapes/tests/outils-v2/colonnes_vides.py`, rouge sur 9 pages sur 10 avant correction et vert sur 84 mesures après ; ledger du produit, entrée 410. | Intégrer à `render_page.py` une règle d'équilibre par tranches de 40 px. L'encre visible compte le texte, les médias, les fonds et les cadres ; un élément collant compte sur la hauteur de son parent. La règle échoue quand l'encre laisse plus de 25 % du cadre vide à droite, avec plus de 15 points d'écart avec la gauche, sur plus de 600 px de haut. Le contrôle du produit sert de point de départ. |

## digit-ai-forge-design (`forge-design`)

Ce chapitre porte un retour, RP-81 : la campagne de rendu n'a jamais montré l'état réellement servi.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-81 | **majeur** | générique | **Les rendus et la critique de la v2 ont été joués en mode « tout visible », clips forcés. L'état servi réel, où chaque clip reste masqué jusqu'à sa date de publication (jusqu'au 23/02/2027), n'a jamais été rendu. La feuille de style avait prévu ce cas par une demi-largeur vide (« un écran seul garde la largeur d'un écran »), que personne n'a vue.** Preuve : `forge/etapes/tests/outils-v2/README.md` (mode « tout visible » pour les critères 3, 4, 5, 7, 10 et 13) ; `static/v2/styles.css` avant le commit de ce lot ; ledger du produit, entrée 409. | Rendre et critiquer une page à visibilité pilotée par des données dans ses deux états extrêmes : aucun élément conditionnel visible, puis tous visibles. L'écrire dans la consigne de campagne de forge-design et l'offrir en option de l'outil de rendu par lot. |

## digit-ai-factory (`pilot`)

Ce chapitre porte deux retours, RP-83 et RP-84 : la reprise sur un autre poste ne régénère pas une base dérivée, et le 28e lot d'un jour n'a pas de nom recevable.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-83 | **mineur** | générique | **Sur un poste neuf restauré par le canal R-64, `data/site-v2.db` (base de catalogue de la v2, ignorée par git et absente du canal) est créée vide au démarrage local : les 13 pages de forge de la v2 rendent 404 sans erreur. Seule l'image Docker la régénère, et ni le hook `reprise` ni la notice ne le disent.** Preuve : `GET /v2/outils/forge-design` rendait 404 sur ce poste, puis 200 après `scripts/generer_catalogue.py --racine vendor-v2 --base data/site-v2.db` (13 forges, 111 services) ; ledger du produit, entrée 411. | Ajouter à `REPRISE.json` une liste « regenerer » de commandes, que `reprise --restaurer` joue après la copie. À défaut, faire signaler par le contrôle de reprise une base ignorée par git, ni copiée ni régénérée. |
| RP-84 | **mineur** | générique | **Le 28e lot du 15/11 n'a aucun nom que les deux outils du pilot acceptent. `allouer-indice.mjs` refuse le 15/11, ses 26 lettres étant prises, et propose de dater du lendemain. `oracle-lot-retours` 1.9.0 refuse le lendemain (LOT-DATE, jour à venir) et rend SANS_OBJET sur un double suffixe, donc ne juge pas la forme de ce lot.** Preuve : sortie des deux outils sur ce lot, nommé d'abord `20261116b` puis `20261115zb` ; ledger du produit, entrée 412. | Admettre un double suffixe (za, zb…) dans les deux outils : l'allocateur le propose après z, et l'oracle le juge comme une lettre simple. |

## La règle qui aurait évité le retour

- RP-80 : classe à créer `echappatoire-colonne-trop-large` : une dispense déclarative posée sur un ancêtre éteint une règle de rendu pour toute la page.
- RP-81 : classe à créer `rendu-sans-etat-reel` : la vérification visuelle ne rend que l'état de test, jamais l'état servi.
- RP-82 : classe à créer `piste-de-grille-vide` : une colonne réservée sans contenu n'est jugée par aucune règle.
- RP-83 : classe à créer `reprise-base-derivee-vide` : une base dérivée ignorée par git n'est ni copiée ni régénérée à la reprise.
- RP-84 : classe à créer `nommage-lot-sans-issue` : l'allocateur d'indice et le juge de lot n'acceptent aucun nom commun pour le 28e lot d'un jour.

## Remarques restées au produit

- Le produit porte la correction : l'accueil met son animation en marge quand le clip est masqué, et la colonne se centre sans marge (D-233 (b)). Le catalogue passe en colonnes de flux, et le cartouche et la note de marge deviennent collants. La dispense `data-colonne-ok` est retirée. Généralisable : oui, par RP-80 à RP-82.
- Le contrôle `colonnes_vides.py` est versionné dans `forge/etapes/tests/outils-v2/`, avec les autres outils de vérification de la v2. Généralisable : oui, par RP-82.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Note de réception du pilot (16/11/2026)

Le lot a été refusé tel quel à l'ingestion : la famille de ses classes proposées n'existe pas au référentiel `todo/CLASSES.json`. Le pilot l'a ramenée, avant ingestion, à la famille connue la plus proche :

- classe proposée « echappatoire-colonne-trop-large » : famille « oracles », inconnue du référentiel, ramenée à « page-html-socle »
- classe proposée « rendu-sans-etat-reel » : famille « oracles », inconnue du référentiel, ramenée à « page-html-socle »
- classe proposée « piste-de-grille-vide » : famille « oracles », inconnue du référentiel, ramenée à « page-html-socle »
