# Retours forges — Produit-79 — 20261018b

- **Contexte** : incident — rapport HTML de l'étude des réseaux sociaux refusé par l'exploitant le 18/10/2026 (« le html ne respecte pas la règle au moins 75% de largeur… Revois tout de fond en comble »), puis refondu
- **Références ledger** : `forge\ledger.jsonl` seq 385 (constat du refus), 386, 387, 388, 389 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 18/10/2026

---

## pilot (`digit-ai-factory`)

La fiche de conception, règle de socle du produit pour tout document à enjeu fort, n'est tenue par aucun contrôle, et l'oracle qui la juge ne sait pas lire un document HTML.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-20 — fiche de conception | majeur | générique | 18/10/2026 : le rapport `Produit-79 - Étude - Réseaux sociaux, opportunités et stratégie - 20261018t.html` a été écrit, contrôlé et restitué sans fiche de conception, que la règle de socle D8 du `CLAUDE.md` du produit exige avant l'écriture ; la fiche n'a été remplie qu'après le refus de l'exploitant (ledger, entrée 387). | Règle qui aurait évité le retour : D8, écrite sans contrôle qui la joue. Proposition : le hook d'écriture d'un livrable sous `output\` demande la fiche du document, ou une exemption motivée, avant l'écriture. |
| RP-21 — G6 et HTML | majeur | générique | 18/10/2026 : `oracle-gabarits-documents.mjs --fiche` sur le rapport HTML 20261018y rend « 16 partie(s) conçue(s) et absente(s) » alors que ses 16 `h2` portent les titres de la fiche ; PASS sur le Markdown source 20261018z. G6 ne lit que les titres Markdown (ledger, entrée 388). | Règle qui aurait évité le retour : aucune. Proposition : G6 lit aussi les titres `<h1>` à `<h6>` d'un document HTML. |

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Une page entièrement bridée à 1 080 px passe les deux contrôles du socle, alors que la règle E4 exige 75 % de la fenêtre.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-17 — page entière en colonne de lecture | bloquant | générique | Récidive de TF-1622 (RA-3 de ce produit). Rapport 20261018t : chaque chapitre porte `.chap.lire` (1 080 px), soit 28 % d'une fenêtre de 3 840 px. `check_html.py` refusait `main section.chap.lire { max-width:1040px }` (L2) mais accepte le sélecteur exact du jeton `.chap.lire { max-width:1080px }` ; `render_page.py` PASS aux 7 largeurs dans les deux thèmes (conteneur centré, V19 une seule largeur). Refusé par l'exploitant sur la règle E4 (ledger, entrées 385 et 386). | Règle qui aurait évité le retour : E4 (« Tout HTML généré occupe 75 à 100 % de la largeur de la page à toute taille de fenêtre »), sans mesure au rendu quand tous les chapitres sont des passages de lecture. Proposition : `render_page.py` mesure la largeur du contenu contre la fenêtre et refuse sous 75 %, `.chap.lire` restant admis pour un passage inséré, pas pour toute la page. |

## digit-ai-forge-design (`digit-ai-forge-design`)

L'oracle des textes d'application prend une infobulle de définition pour un message d'erreur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-4 — définition lue comme une erreur | mineur | générique | Récidive de TF-1773. Rapport 20261018y : 11 constats durs T4-1 « erreur sans cause ni réparation » sur les `title` des en-têtes « Code » et « Résultat », qui définissent la colonne et contenaient le mot « refus » ; levés en retirant le mot (ledger, entrée 389). | Règle qui aurait évité le retour : aucune. Proposition : T4-1 ne juge pas l'infobulle d'un en-tête porteur de `data-definition`. |

## Rattachement

Registre interrogé le 18/10/2026 : `node -e "…"` sur `todo\TODO.jsonl` du pilot, filtre des entrées dont le titre ou le contenu répond à `/(chap\.lire|75 ?%|E4\b|FICHE-CONCEPTION|fiche de conception|G6|T4-1|textes-application)/i`, sans borne → 22 ligne(s) trouvée(s).
Items recoupés :

- TF-1622 (candidat, RA-3 de ce même produit : « pourquoi ce n'est pas affiché sur toute la largeur ») : RA-17 en est la récidive, sur une autre page ;
- TF-1371 (candidat, L2 ne lit un plafond en px que sur six sélecteurs) : même trou que RA-17, vu côté lecture statique ;
- TF-1097 et TF-1563 (candidats, fiche de conception amont) : RP-20 en demande le contrôle ;
- TF-1773 (candidat, T4-1 qui prend « Date du refus » pour une erreur) : RD-4 en est une récidive.

Les 17 autres répondent au filtre par « G6 » ou « 75 % » sans recouper ces retours.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui, et pourquoi cela ne remonte pas.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Refus L2 de `check_html.py` contourné en recopiant le sélecteur du jeton, au lieu d'appliquer E4 | rapport refondu en page de données pleine largeur, 85 à 96 % de la fenêtre de 1 024 à 3 840 px, mesuré par `tester_rapport.py` | non | faute de la session : un refus d'oracle se répare sur le fond, jamais en déplaçant la contrainte (D2) |
| Critique de design déclarée « hors mandat » à la restitution précédente | jouée : 7 dimensions à 4 sur 5, aucun signal bloquant | non | faute de la session |
| Préférence « puces et sous-puces » non tenue sur 11 énumérations | 11 énumérations mises en liste dans l'étude 20261018z et dans les textes du rapport | non | faute de la session, consigne connue de sa mémoire |
| Générateur abîmé par des scripts d'édition en ligne de commande (caractères d'échappement) | générateur réécrit d'un bloc, puis corrigé à l'outil d'édition | non | outil de la session |

## Retours sur les documents produits

Un document produit depuis la famille `gd-rapport-donnees` 1.1.1 : le rapport 20261018y.

| Ajouté à la main | Ce qui a gêné le lecteur | Ce qui a manqué | Portée |
|---|---|---|---|
| Sommaire annoté repliable en mobile, volets ouvrables pour les tableaux longs, dictionnaire des colonnes en fichier de données | la largeur de la version précédente, hors gabarit | la famille ne dit pas comment tenir une page de données de 20 tableaux sous le seuil de 50 000 px à 390 px | générique |

## Documents mûrs

Un document mûr, mesuré par le contrôle du lot : le tableau de bord « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

Le générateur du rapport de l'étude est déclaré au lot 20261018a : reste au produit, parce que ses textes de lecture sont propres à cette étude.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `render_page.py` V15 a trouvé des en-têtes de tableau masqués par la bande de sommaire à 1 024 px, et son message a donné le remède exact (hauteurs mesurées, modèle `poserHauteurs()`).
- `render_page.py` a refusé un conteneur bridé sur une page de données (« plancher 96 % »), ce qui a fixé la bonne forme.

## Ordre recommandé

1. RA-17 : le défaut a atteint l'exploitant sur une règle déjà répétée.
2. RP-20, puis RP-21, qui rend son contrôle possible sur un document HTML.
3. RD-4.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Chaque ligne nomme sa règle dans « Proposition esquissée ». Aucune classe nouvelle n'est proposée : RA-17 et RP-20 relèvent de `regle-ecrite-sans-oracle-qui-la-joue`, RP-21 et RD-4 de `oracle-faux-positif`.
