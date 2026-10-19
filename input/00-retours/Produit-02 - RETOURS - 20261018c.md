# Retours forges — Produit-02 — 20261018c

> **Note de réception du pilot (19/10/2026, décision humaine D-43 (a) de la synthèse 20261019e)** : ce lot a été refusé à la porte le 19/10 parce que ses lignes « classe-a-creer » ne portaient pas de classe_proposee au sidecar. Au sidecar, la classe proposée de RT-133 est reprise mot pour mot de la section « La règle qui aurait évité le retour ». Famille « interaction » de RT-133, absente du référentiel, rattachée par le pilot à « affordance-ui ». Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : pages de réservation par gîte du site, troisième version du 18/10/2026, hors run. L'exploitant a demandé que changer de gîte ne ramène plus en haut de la page, et d'en faire « une règle générale des onglets en milieu de page pour la Factory ». Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 485 (type `retour`, destinataire `digit-ai-forge-design`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-18
- **Complétude** : 1 retour de cette session destiné aux forges, seq 485, porté ici avec sa candidature au sidecar.
  - Les retours de cette session vers le produit restent au produit : seq 442 (heure d'arrivée chez Beds24, corrigée depuis par la session du .fr) et seq 445 (jeton Railway rangé sous le mauvais nom).
  - Les retours vers les forges écrits par d'autres sessions et absents des lots remis ne sont pas instruits ici : ils restent à compiler par leurs sessions ou au prochain lot de clôture.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Forge design (`digit-ai-forge-design`) — onglets en milieu de page

Un retour, qui suit un retour humain direct sur un parcours de réservation mis en ligne le matin même.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-133 | majeur | générique | **Des onglets placés au milieu d'une page, qui mènent à des pages sœurs, ramènent le visiteur en haut à chaque clic.** Pages /reservation-<gîte> mises en ligne le 18/10/2026 au matin (commit 7cf9723) : les 5 onglets de gîte, sous le bandeau et au-dessus du calendrier, étaient de simples liens vers 5 pages ; chaque clic rechargeait la page et la ramenait en haut, le calendrier sortait de l'écran. Retour humain du même jour, capture à l'appui : « Lorsqu'on clique sur un autre gite dans la réservation, ne reviens pas en haut de la page, reste au même endroit sur la page. Fais en une règle générale des onglets en milieu de page pour la Factory. » Les 13 oracles de forge-design et `render_page.py` avaient tous passé sur ces pages : aucun ne clique un onglet après défilement. Corrigé au produit : les onglets restent de vrais liens (adresses indexables, parcours sans script), interceptés par le script, qui charge le gîte choisi sur place et met à jour titre, bandeau, liens de langue et adresse (`history.pushState`, retour arrière géré) ; mesure : 369 px de défilement conservés à 1 280 px, 0 rechargement. Ledger seq 485 ; revue `forge/etapes/REVUE-IMPLEMENTATION-reservation-20261018.md`. | (a) Règle de conception : un groupe d'onglets placé sous le premier écran ne provoque ni rechargement ni remontée. Voie préférée : contenu échangé sur place, adresse mise à jour, retour arrière géré, liens réels conservés pour le référencement et le parcours sans script. Voie minimale : chaque lien porte une ancre vers le groupe d'onglets. (b) Oracle jouable sur instance servie, à ajouter à la matrice d'états de `render_page.py` : faire défiler jusqu'au groupe d'onglets, cliquer un autre onglet, mesurer `scrollY` avant et après, écart toléré 2 px ; vérifier aussi qu'aucune navigation complète n'a eu lieu. Fixture rouge : deux pages sœurs dont les onglets de milieu de page sont de simples liens. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant ce travail, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La valeur rangée sous `RAILWAY_TOKEN` est un jeton de compte, que la ligne de commande Railway n'accepte que sous `RAILWAY_API_TOKEN`. | Contourné dans la session ; correction du nom proposée au produit, ledger seq 445. | non | Défaut de configuration du produit, reste au produit. |
| Le rendu statique d'une page dont la feuille de style se charge par chemin absolu (`/assets/…`) est jugé sans cette feuille par `run-oracles-design --rendu`. | Rendu rejoué sur l'instance servie, comme le prévoit l'outil. | peut-être | L'outil le déclare ; à rappeler dans son aide si d'autres produits s'y trompent. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la restitution suit `forge\RESTITUTION.md`, et la revue suit le squelette de `critique-implementation.md` de forge-design.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucun envoi ni déploiement n'a eu lieu dans ce travail avant la remise du lot.

## Confirmations positives

- **La critique d'implémentation sur instance servie**, comparée à deux pages de référence, a trouvé 3 défauts propres en quelques minutes (contraste des jours complets, bride de l'introduction, bouton inactif).
- **Le relevé de la session voisine du .fr** (offres Beds24 du départ tardif) a évité de recréer un extra Beds24 inutile : son registre disait déjà que l'option est une offre.

## Ordre recommandé

1. **RT-133** : seul retour du lot ; la proposition (b) rend la règle opposable sans jugement humain.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-133 suit un retour humain. Aucune règle de la forge design ne couvre la position de lecture lors d'une navigation entre pages sœurs. **Classe à créer**, clé proposée `onglets-de-milieu-de-page-qui-remontent-en-haut`, famille `interaction`. Libellé : « Un groupe d'onglets placé sous le premier écran mène à des pages sœurs par de simples liens : chaque clic recharge la page et ramène le lecteur en haut, loin du contenu qu'il comparait. »
