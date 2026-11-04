# Retours forges — Produit-86 — 20261103c

- **Contexte** : revue du porteur sur la préproduction le 03/11/2026, run 20261103d-evolution-ergonomie : « le produit n'est absolument pas exploitable en l'état, beaucoup d'éléments ne respectent pas les principes de base de la Factory »
- **Références ledger** : `forge\ledger.jsonl` seq 241 (demande mot pour mot), 242 à 248 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 03/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 03/11/2026 : `grep -ciE "exploitab" todo/TODO.jsonl` → 15 lignes trouvées ; `grep -ciE "onboarding"
todo/TODO.jsonl` → 5 lignes trouvées ; `grep -ciE "aide de champ|aide contextuelle" todo/TODO.jsonl` → 0 ligne trouvée.
Classes existantes retenues : `surface-implicite-non-livree` (RC-2), `controle-joue-sur-fichier-pas-sur-instance-servie`
(RD-3), `lecture-tiers-non-jugee` (RT-10), `page-html-filtres-tableau` (RP-4), `instance-tls-locale-injoignable` (RD-5).
Deux retours n'en trouvent aucune et proposent la leur (RC-1, RP-3).

## Ce que la revue a relevé, et ce que le run en a fait

Douze remarques du porteur, toutes traitées dans le run 20261103d :
- la connexion se fait par adresse e-mail, dans un encart de 448 px (E-093, E-094) ;
- chaque champ porte une aide liée par `aria-describedby` (E-095) ;
- un accueil s'affiche à la première connexion (E-096) ;
- un formulaire modifié demande confirmation avant le départ (E-097) ;
- l'aide est refondue par tâche (E-098) ;
- le tableau des missions passe sous le composant de filtres du socle, trié du plus récent au plus ancien (E-099, E-100) ;
- la file d'approbation dit qui demande, qui décide, avant quand, et garde l'historique (E-101) ;
- la fiche mission est guidée par étapes (E-102) ;
- les indicateurs IA et exécution mènent à leur explication (E-103).

Les retours ci-dessous portent sur les forges qui ont laissé partir ces manques.

## forge-conception (`digit-ai-forge-conception`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | bloquant | générique | `oracle-surface` S4 accepte qu'un candidat obligatoire de la surface implicite soit écarté par la session elle-même. L'onboarding portait « `decide_par`: la session de build, par délégation de la fiche produit », et le porteur a jugé ce manque contraire aux exigences de la Factory dès la première revue. Mesuré dans `EXIGENCES.json` du produit : 10 écarts de surface implicite, décidés tous les 10 par la session, aucun par un humain. Ledger seq 242. | exiger pour un tel écart une décision humaine référencée (une D-N, ou une entrée `reponse_humain` du ledger), et refuser « décidé par la session ». |
| RC-2 | majeur | générique | La surface implicite tient l'aide utilisateur pour présente dès qu'un élément porte le mot « aide ». La page d'aide du produit, réduite à la liste des codes de refus (E-071), a satisfait le candidat. Rien ne demande non plus l'aide de chaque champ (à quoi il sert, comment le remplir), le filtre et le tri des listes, la garde contre la perte de saisie, ni un identifiant de connexion par e-mail. Mesuré sur la revue du 03/11 : 6 remarques sur 12 portent sur ces manques. Ledger seq 243. | ajouter à la typologie des candidats d'office l'aide de champ, le filtre et le tri des listes (le plus récent d'abord), la garde de saisie et l'accueil par rôle, chacun avec un critère vérifiable. |

## forge-design (`digit-ai-forge-design`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-3 | majeur | générique | La critique d'implémentation (13 oracles) a rendu PASS sur 10 pages servies qui n'avaient ni aide de champ, ni filtre de liste, ni garde de saisie, avec une mire de connexion pleine largeur. `oracle-exploitabilite` est resté SANS OBJET à chaque passage faute d'instance fournie, et l'agrégat ne l'a jamais signalé comme un manque. Joué sur l'instance servie le 03/11, il a trouvé 2 défauts dès le premier passage (X1 : aide de 6 006 px ; X3 : énumération brute). Ledger seq 244. | faire de l'absence d'instance un FAIL de l'agrégat pour une page d'application servie, et ajouter des règles d'aide de champ et de largeur de formulaire court. |
| RD-5 | majeur | générique | `oracle-exploitabilite` ne joint pas une instance servie en TLS auto-signé, et aucune option ne permet d'accepter ce certificat : sur la préproduction `https://127.0.0.1:8443`, il ne juge aucun écran. Il a fallu servir le même commit en HTTP local. Mesuré le 03/11 à 20:00 : 6 écrans jugés sur `http://127.0.0.1:8001`. Ledger seq 248. | une option d'acceptation du certificat bornée aux hôtes de boucle locale, la même que celle proposée à forge-tests (RT-5, lot 20261103a). |

## forge-tests (`digit-ai-forge-tests`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-10 | majeur | générique | Aucun pan de forge-tests ne juge l'exploitabilité d'un écran (aide, filtres, tri, garde de saisie). Les parcours par profil ne sont produits par la forge et exigés par aucun seuil : la session les a écrits à la demande du porteur, après une première livraison. Mesuré dans `rapport-20261103-evolution-acces-reprise.json` : tous les pans mesurés au seuil, et le produit jugé non exploitable le même jour. Ledger seq 245. | un pan « parcours par persona » qui exige un parcours par rôle déclaré, joué dans un navigateur contre l'instance servie. |

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-3 | bloquant | générique | Le run s'est clos en `pret_production_en_attente_GO` sur « 85 exigences MVP sur 85 tenues », pour un produit que le porteur juge « absolument pas exploitable ». Le compte d'exigences se mesure sur un référentiel écrit par la session, et aucune porte ne fait juger l'usage réel, par un humain ou par une persona, avant une restitution « prêt ». Mesuré le 03/11 : deux restitutions « prêt » (15:18, 16:54), puis 12 remarques du porteur. Ledger seq 246. | une porte d'exploitabilité avant « prêt » : un parcours par persona joué et capturé, puis une revue humaine des captures, au même titre que la barre externe B4. |
| RP-4 | majeur | générique | La table « Règles de socle applicables » du `CLAUDE.md` d'un produit est remplie par la session à l'ouverture, sans contrôle de complétude. Le portail porte un tableau de données et des textes d'application, mais ni la ligne « Page HTML de données » (composant `table-filters`, `oracle-filtres-tableau`) ni la ligne « Textes d'application » n'y figuraient. Le tableau est donc parti avec un filtre maison. Mesuré le 03/11 : `oracle-filtres-tableau` rend FAIL G1 sur le tableau servi (5 colonnes catégorielles sans `data-filterable`), puis PASS une fois le composant posé. Ledger seq 247. | un contrôle qui confronte les types de livrables présents (un `<table>` servi, un texte d'application) aux lignes de la table, et refuse une ligne manquante. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'émission d'un jeton d'agent n'était pas consignée à l'audit | événement `jeton_agent.emission` (qui, quel agent, quelle mission, jamais le jeton) | non | défaut de ce produit, corrigé et testé |
| Les règles V18, L2 et V23 se croisaient sur les écrans larges | doctrine du socle appliquée : `data-page="donnees"` pour les écrans d'application, `.lire` centrée pour l'aide et l'accueil | non | les messages de `render_page` donnaient les trois sorties admises ; c'est la session qui ne les avait pas suivies |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées du 03/11, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a et 20261103b) |

## Garde-fou de plateforme relevé

Aucun nouveau garde-fou heurté dans ce run. GFP-005 (stratégie de contrôle d'application Windows) reste celui des lots 20261103a et 20261103b.

## Confirmations positives

- Le composant `table-filters` du socle et `oracle-filtres-tableau` se posent sur un portail FastAPI à CSP stricte sans adaptation : il a suffi d'un fichier d'amorce statique et des jetons reliés.
- Les messages de `render_page` nomment les trois sorties admises de L2 et V23 (colonne de lecture centrée, `data-page="donnees"`, `data-colonne-ok`) : la correction a pu suivre la doctrine sans lecture du code.

## Ordre recommandé

1. RP-3 : sans porte d'exploitabilité, un produit inutilisable peut être annoncé prêt.
2. RC-1 : un candidat obligatoire ne doit pas pouvoir être écarté par la session qui écrit le référentiel.
3. RP-4 : la table des règles de socle doit couvrir chaque type d'écran livré.
4. RD-3 : la critique d'implémentation doit dire qu'elle n'a pas jugé l'exploitabilité.
5. RC-2 et RT-10 : élargir la typologie et les parcours exigés.
6. RD-5 : confort, déjà couvert par RT-5 côté forge-tests.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours suivent un retour humain : la revue du porteur du 03/11/2026 (ledger seq 241). La règle qui l'aurait évité est double. D'une part, aucun écart de surface implicite ne doit pouvoir être décidé par la session (RC-1). D'autre part, aucune restitution « prêt » ne doit sortir sans un parcours par persona joué sur l'instance servie et revu par un humain (RP-3).

Deux retours n'ont aucune clé du référentiel qui convienne ; chacun propose sa classe :

- **RC-1** : clé proposée `ecart-de-surface-decide-par-la-session`, famille `contrat-interface-forge`, libellé « Un candidat obligatoire de la surface implicite est écarté par la session qui écrit le référentiel, sans décision humaine ».
- **RP-3** : clé proposée `pret-annonce-sans-usage-reel`, famille `hook-ou-gate`, libellé « Un run se déclare prêt pour la production sans qu'un parcours réel par persona ait été joué et revu ».
