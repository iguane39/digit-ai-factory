# Retours forges — Produit-02 — 20261015a

> **Note de réception du pilot (18/10/2026, décision humaine D-24 (a) de la synthèse 20261018k)** : ce lot a été refusé à la porte le 18/10 (règle LOT-IDS) parce que ses deux identifiants RT-118 et RT-119 étaient déjà définis par le lot Produit-02 20261003b. Il est renuméroté à la réception : RT-118 devient RT-126 et RT-119 devient RT-127, premiers numéros libres. Au sidecar, la classe proposée de RT-126 est reprise mot pour mot de la section « La règle qui aurait évité le retour » ; RT-127, que cette section dit « non un retour humain : la règle existe (docstring du script), elle n est pas gardée », est rattaché à la classe existante regle-ecrite-sans-oracle-qui-la-joue. Aucun autre mot du lot n a changé ; l original reste chez le produit.

- **Contexte** : incident du 15/10/2026, session « CGV du .fr appliquées au .com », hors run. Le lot porte le retour humain du même jour sur une affirmation d'exhaustivité fausse, rendue en réponse à une question posée précisément sur ce point. Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 393 et seq 395 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-10-15
- **Complétude** : 2 entrées `type: retour` destinées à la factory ne figuraient dans aucun lot remis, les seq 393 et 395, écrites le 15/10. Elles sont portées ici et ont chacune leur candidature au sidecar. La seq 392 vise le produit lui-même (`destinataire: Produit-02.com`) et reste au produit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — affirmation d'exhaustivité et gate de restitution

Deux retours. Le premier est grave : la restitution a été jugée PASS alors que son affirmation centrale était fausse, et la question humaine portait exactement sur cette affirmation.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-126 | bloquant | générique | **À la question « Est-ce que le reste du site a été mis à jour ? », la session a répondu « Oui » et déposé une restitution PASS disant « tout le site en ligne est à jour » ; une capture humaine du pied de page de la première page l'a démentie le soir même.** Le balayage invoqué (273 pages du `sitemap.xml` de production, 0 résidu) ne cherchait que des marqueurs écrits par la session elle-même : les anciennes formulations des CGV (PayPal, ANCV, solde à l'arrivée, caution demandée à la réservation, « CGV (extrait) »). La source de vérité, le produit `.fr`, avait acté le même jour la reprise par une nouvelle société : décisions D-34 à D-37, CGV `20261015d` et contrat `20261015n` / modèle `20261015o` écrits entre 20:09 et 20:36 par une session parallèle. Mesure après le retour, sur l'arbre servi : le prénom de l'ancienne gérante sur 302 pages, « SARL » sur 288, son numéro sur 295. Quatre causes. (1) « À jour » a été jugé contre la liste de l'auteur, jamais contre la source de vérité relue au moment de répondre. (2) La source amont n'a été lue qu'une fois, à l'ouverture (18:38), alors qu'elle changeait pendant la session. (3) Le périmètre de la question (« le reste du site ») a été réduit en silence à celui de la tâche (les CGV). (4) Le gate de restitution juge la forme : il a rendu PASS sur une affirmation d'exhaustivité sans preuve de référence externe. Ledger seq 395 (type retour, gravité critique). | (a) Règle de restitution : toute affirmation d'exhaustivité (« tout », « entièrement », « à jour », « rien oublié », « oui » à une question de complétude) porte une ligne « Mesuré contre : <source de vérité>, relue à HH:MM, périmètre <n éléments> » ; le gate la refuse sans elle. (b) Avant toute clôture qui s'appuie sur un produit amont, relire celui-ci (date de dernière écriture et derniers commits) et déclarer l'écart. (c) Un inventaire d'exhaustivité se construit par les FAITS de la source (société, personnes, téléphones, services, montants), pas par les mots de l'ancienne version. Règle existante la plus proche : loi transverse n° 7 (`references\INTENTION.md`, test rétro), qui juge l'intention et non la vérité de la mesure ; aucune règle ne couvre l'affirmation d'exhaustivité. Fixture rouge : une restitution « tout est à jour » fondée sur une liste de marqueurs de l'auteur, sans ligne « Mesuré contre », doit être refusée. |
| RT-127 | mineur | générique | **`forge/ledger.py` numérote `seq` par le nombre de lignes + 1 (ligne 47), si bien qu'une entrée écrite le 15/10 a reçu seq 392 après des entrées 404 et 405.** Le ledger du produit portait déjà 13 seq en double (max 405 pour 391 lignes) avant la session ; le contrôle de suite du même script (lignes 81-82) les signale, mais l'écriture ne s'arrête pas. Un renvoi par numéro devient ambigu. Ledger seq 393 (type retour). | `seq = max(seq) + 1`, ou refus d'écrire tant que le contrôle de suite échoue. Règle la plus proche : la docstring du script (« `seq` strictement croissant depuis 1 »), écrite mais non gardée à l'écriture. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui, ce qu'il en a corrigé, et si le défaut se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le site `.com` en production nomme encore l'ancienne société, ses gérants et leurs numéros sur la quasi-totalité des pages. | Non corrigée à la remise du lot : la mise à jour complète du site est préparée en prompt (L99) et attend le GO de l'exploitant. | oui | Généralisable : remonté en RT-126 (c'est la conséquence, la classe est l'affirmation non mesurée). |
| Une option de décision proposée dans la même session promettait une mise à jour de livrets sur une plateforme sans voie d'écriture (StyQR : `OPTIONS` → `allow: GET,HEAD`, `POST` → 405). | Déclarée en écart au bloc 6 de la restitution suivante, guide fourni à l'exploitant. | non | Rien de généralisable de neuf : S25 et S65 couvrent déjà la preuve d'accès ; c'est leur application au moment de poser l'option qui a manqué. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — vérifié par la session le 15/10/2026 : les synthèses du jour suivent `forge\RESTITUTION.md`, pas un gabarit `gd-…` de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : le déploiement du 15/10 (CI « Contrôles » puis « Vérification de la production ») n'a été ni refusé ni contraint.

## Confirmations positives

- **La barrière qualité `qo-gate-write.mjs`** a refusé deux synthèses sur des chiffres non sourcés ; les versions déposées les sourcent toutes.
- **Le hook de restitution** a refusé deux affichages qui condensaient le fichier jugé : l'écran a repris le fichier en entier.

## Ordre recommandé

1. **RT-126** : bloquant ; la proposition (a) est une règle de gate de plus, sans toucher au harness, et elle aurait refusé la restitution fautive.
2. **RT-127** : mineur, une ligne de code.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-126 suit un RETOUR HUMAIN. Aucune règle du socle ne couvre l'affirmation d'exhaustivité : le test rétro (loi n° 7) juge l'intention, S3 exige un chiffre mais pas la source contre laquelle il est mesuré. **Classe à créer**, clé proposée `affirmation-d-exhaustivite-sans-reference-externe`, famille `hook-ou-gate`. Libellé : « Une restitution affirme qu'un ensemble est complet ou à jour en s'appuyant sur une liste de contrôle écrite par son auteur, sans relire la source de vérité au moment de répondre ni dire le périmètre mesuré : le gate rend PASS sur la forme et l'humain découvre l'écart. » RT-127 n'est pas un retour humain : la règle existe (docstring du script), elle n'est pas gardée.
