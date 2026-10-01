# Retours forges — Produit-78 — 20260928a

- **Contexte** : clôture du run Produit-78-20260928-mandat-etude (mandat : étude d'opportunités sur l'outillage de l'animation des réseaux sociaux d'Produit-02, décision D-1 (a) du 28/09/2026)
- **Références ledger** : `forge\ledger.jsonl` seq 27, 28, 29, 30, 31, 32, 33 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

Le run a adopté un projet existant, puis produit une étude et sa page. 5 frictions touchent le pilot : un oracle d'étude, le générateur de page, un contrôle de conformité et l'adoption.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | majeur | générique | `oracles\oracle-etude-opportunite.mjs`, règle E3 : le texte est découpé sur CHAQUE occurrence de « état de l'art ». Une 2e mention dans l'introduction de la section a réduit le bloc lu à 2 mots : « 0 source(s) datée(s) » rendu sur une étude qui en portait 21. E2 suit le même découpage. Preuve : ledger seq 27, verdict de première passe. | Découper sur la ligne de titre (`^##.*état de l'art`), pas sur la première occurrence du mot. |
| RP-2 | majeur | générique | `scripts\generer-page-etude.mjs` (rendu de `lib-vue-html.mjs`) : une liste numérotée Markdown de 8 éléments sort en un seul paragraphe ; les titres « ## » deviennent des h3 sous le h1 (saut signalé par `check_html.py` et `oracle-a11y`) ; le pied de page répète l'indice. `check_completude.py` rend PASS à 100,3 % : il compte des mots, et la perte de structure n'est vue que par la revue de lecture. Preuve : ledger seq 28, `forge\etapes\etude\REVUE.md`. | Rendre les listes numérotées ; faire des « ## » des h2 ; ajouter au contrôle de complétude un décompte des listes et des titres. |
| RP-3 | mineur | générique | `scripts\generer-page-etude.mjs` ne pose aucun sommaire sur une étude de 17 chapitres : avertissement L6 de `check_html.py`, alors que L25 attend un sommaire visible en permanence au-delà de 3 chapitres. Preuve : ledger seq 29. | Générer le sommaire latéral du socle dès 4 chapitres. |
| RP-4 | mineur | générique | `oracles\oracle-conformite-projet.mjs`, R-19 : `RE_CLE_DEPOT` refuse la clé « digit-ai-confidentiel », nom réel du dépôt que `bootstrap.mjs` liste au parc ; la forme proposée, « digit-ai-forge-confidentiel », ne désigne aucun dépôt. Rectifié par ajout au journal (seq 3). Preuve : ledger seq 30. Même classe que TF-0801 (digit-ai-queue). | Ajouter `digit-ai-confidentiel` aux exceptions nommées de R-19. |
| RP-5 | mineur | générique | `scripts\adopter-projet-existant.mjs` sur un projet documentaire, sans logiciel ni site : l'héritage pose `robots.txt` et `llms.txt`, et R-13 exige au moins une variable dans `.env.example`, d'où `FORGE_ROOT` déclarée pour passer. Les 8 fichiers de `docs\projet\` se remplissent de « sans objet ». Preuve : ledger seq 31. | Un type de projet « documentaire » à l'adoption, qui écarte les artefacts web et relâche R-13 en le déclarant. |

## quality-oracles, dans l'atelier des skills qualité (`digit-ai-forge-agents`)

Un oracle et une règle de la même forge se contredisent : la notation d'effort prescrite fait échouer le contrôle des calculs.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RQ-1 | majeur | générique | `scripts\oracle-calculs.mjs`, règle U2 (N4, `lib\mesure.mjs`) : la forge prescrit l'effort en « complexité × durée » (E8, gabarit RESTITUTION). U2 accuse toute ligne qui porte ×, un compte d'événements (« nuits ») et un prix mensuel. Sur une page HTML, un tableau ou une liste entière forme une seule ligne : 4 constats bloquants sur une page dont la source Markdown passe. Levé côté Markdown en rangeant les options en listes, et côté HTML par une exemption datée jusqu'au 2026-12-02. Preuve : ledger seq 26 et 32. | Ignorer le × placé entre deux mots du vocabulaire de complexité et de durée ; juger une page HTML cellule par cellule et élément de liste par élément. |

## prompt-analyzer-l99 (`digit-ai-forge-agents`)

Le prompt réécrit de l'analyse du matin a prescrit un nom de livrable que la factory refuse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | mineur | générique | Dans un projet de la factory, le chapitre 8 a prescrit « <Projet> - <Objet> - <Type> - AAAAMMJJa » ; R-25 exige le type en 2e segment (« Étude »). Coût : un renommage après les contrôles, puis leur rejeu complet. Preuve : ledger seq 25 et 33. | Au chapitre 8, dans un projet de la factory, nommer le livrable selon R-4 et R-25 et citer la règle. |

## La règle qui aurait évité le retour

2 retours n'ont pas de classe au référentiel ; chacun porte la clé réservée `classe-a-creer` et une classe proposée.

- RP-2 : clé proposée `generateur-perd-la-structure-de-sa-source`, famille `page-html-socle`, libellé « Un générateur de page perd une structure de sa source, liste numérotée ou niveau de titre, sans qu'aucun contrôle ne le voie : le compte de mots reste égal ».
- RP-5 : clé proposée `adoption-sans-type-de-projet`, famille `heritage-produit`, libellé « L'adoption pose l'héritage d'un produit web sur un projet documentaire : fichiers de site et variables exigés sans objet ».

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Des barres obliques inverses ont disparu de 4 chemins de `CLAUDE.md`, avalées par un script de remplacement lancé en ligne de commande | chemins rétablis avec l'outil d'édition, avant tout nouvel enregistrement | non | Erreur de la session, pas de la forge : aucune règle de forge n'était en cause. |
| Le générateur de README a refusé d'écrire depuis le produit sans `--base .`, alors que l'adoption le nomme comme « geste suivant » sans cette option | relancé avec `--base .`, comme le message de refus l'indiquait | non | Le refus nomme son remède : le coût est d'une commande, pas d'un aller-retour. |
| L'étude désignait Seb par un pronom que rien ne permettait de connaître | pronom remplacé par le prénom | non | Défaut de rédaction de la session, sans règle de forge en cause. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. L'étude a suivi le gabarit `gabarits\ETUDE-OPPORTUNITE.md` du pilot, hors de la bibliothèque `gabarits\documents\` : il ne porte ni identifiant `gd-` ni version. La remarque ci-dessous le concerne, à titre d'information.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output\APDLB - Étude d'opportunités - Automatisation des réseaux sociaux - 20260928a.md` | ETUDE-OPPORTUNITE.md du pilot (TF-0155), sans numéro de version | une variante pour une étude faite chez un produit : « Seuil de déclenchement » et « Candidature(s) émise(s) » visent les chantiers du pilot | non rapporté à ce jour : le lecteur n'a pas encore lu l'étude | synthèse pour le décideur, matrice d'automatisation, grille des réseaux, registre des contraintes, questions ouvertes, annexe technique | générique |

## Documents mûrs

Aucun document mûr sur ce lot : aucun document du produit n'a été repris 5 fois, et aucun verdict de lecteur n'a été rendu.

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| aucun | — | — | — | — | reste au produit, parce qu'aucun document n'est mûr |
