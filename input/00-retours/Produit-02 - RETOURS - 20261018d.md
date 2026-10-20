# Retours forges — Produit-02 — 20261018d

> **Note de réception du pilot (19/10/2026, décision humaine D-43 (a) de la synthèse 20261019e)** : ce lot a été refusé à la porte le 19/10 parce que ses lignes « classe-a-creer » ne portaient pas de classe_proposee au sidecar. Au sidecar, la classe proposée de RT-134 est reprise mot pour mot de la section « La règle qui aurait évité le retour ». RT-135 et RT-136, dont cette section nomme la clé et la famille mais pas le libellé, sont retirés du sidecar et renvoyés au produit par un lot de travaux ; ils restent lisibles ci-dessous. Famille « rendu » de RT-134, absente du référentiel, rattachée par le pilot à « page-html-socle ». Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : seconde correction de la page /agenda du 18/10/2026, après le retour de l'exploitant sur la version mise en ligne sous D-148 (a). Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 494, 495 et 496 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-18
- **Complétude** : 3 retours de cette session destinés à la factory, seq 494, 495 et 496. Ils sont portés ici, chacun avec sa candidature au sidecar.
  - Les seq 451, 475 et 476 de la même session sont au lot 20261018b, déjà remis.
  - Les autres retours vers les forges sans lot remis (seq 397, 399, 405, 406, 409, 411 et 425) ne sont pas instruits par cette session ; ils restent à compiler par leurs sessions.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — jugement du rendu d'une interface

Trois retours. Les deux premiers suivent un retour humain direct, la même heure : une interface passée au vert par la critique d'implémentation et jugée « immonde » par son destinataire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-134 | majeur | générique | **Une demande de lisibilité a été lue à l'envers, et aucun contrôle ne l'a vu.** Demande du 18/10/2026 sur /agenda : « Tout en vertical sans profiter de la même largeur que les autres pages, à corriger » (3 colonnes de cartes dans 800 px). La refonte élargit le conteneur à 1 280 px et passe à 4 colonnes : les lignes de description restent à environ 30 caractères. La critique d'implémentation, `render_page.py` (V18 ne borne que le maximum, 135 caractères) et la relecture d'intention passent toutes. Retour humain : « J'indique que les textes sont trop verticaux et tu en ajoutes un de plus en largeur, alors qu'il aurait fallu en supprimer 1 pour arriver à 2 max. » Ledger seq 494. | (a) `render_page.py` borne aussi le MINIMUM de caractères par ligne d'un bloc de prose de plus de 3 lignes (repère : 45), en avertissement majeur. (b) La relecture d'intention reçoit la demande ET une mesure de la grandeur qu'elle vise : une demande sur la lisibilité se relit avec les caractères par ligne avant et après. |
| RT-135 | majeur | générique | **Un état capturé n'a jamais été regardé.** La critique a joué l'état « tout déplié » et capturé une carte dépliée ; seule la mesure de débordement horizontal (0) a été lue, jamais l'image. En production, déplier « Lire la suite » étirait toute la rangée sur des centaines de pixels vides, le texte complet tombant sous le lien. Retour humain : « Le rendu en cliquant sur Lire la suite est immonde, est-ce que ça a même été testé ? » La matrice d'états de `render_page.py` ne sait jouer que le filtre de tableau (`.tf-btn`) : sur un composant maison, ses états sont NON JOUÉS, et le jeu manuel qui les remplace n'a aucune règle. Ledger seq 495. | (a) La critique d'implémentation exige, pour chaque état joué, la lecture de sa capture et une phrase de jugement au rapport, que l'oracle de restitution vérifie. (b) Une mesure « vide créé » : la hauteur ajoutée aux voisins d'une rangée quand un élément s'ouvre, au-delà de 120 px = majeur. (c) La matrice d'états accepte un déclencheur déclaré par la page (`data-etat-ouvrir`). |
| RT-136 | mineur | générique | **Des ressources servies « immutable » sous un numéro de version qui ne change pas.** `/assets/agenda/agenda.css` et `agenda.js` sont servis « Cache-Control: public, max-age=604800, immutable » sous `?v=0.17.3`, le numéro du bandeau de consentement, inchangé entre deux livraisons du même jour : un visiteur passé entre les deux garde 7 jours l'ancienne feuille. La vérification de production compare l'empreinte du site servi, pas ce que reçoit un navigateur qui a la page en cache. Ledger seq 496. | Un contrôle de build refuse une ressource servie « immutable » dont le paramètre de version ne dérive pas de son contenu. Corrigé au produit par une empreinte du contenu dans l'adresse des deux fichiers. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant cette correction, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Une autre session a pris l'indice de lot « 20261018c » et RT-133 pendant ce travail. | Lot nommé « d », retours RT-134 à RT-136. | non | Lu au distant avant l'écriture ; rien à remonter. |
| La fenêtre de fiche hérite d'une règle de liste qui décale « Lieu / Tarif ». | Règle ciblée dans la feuille de l'agenda. | non | Vu à l'image, corrigé avant l'envoi. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les restitutions suivent `forge\RESTITUTION.md`, et le rapport de critique suit le squelette de `critique-implementation.md` de forge-design.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : les envois du 18/10 n'ont été ni refusés ni contraints.

## Confirmations positives

- **Les captures lues à l'image** ont révélé, dans la nouvelle version, un décalage de liste que les mesures ne voyaient pas.
- **La lecture du distant avant d'écrire** a évité de reprendre un indice de lot et un numéro de retour déjà pris le jour même.

## Ordre recommandé

1. **RT-135** : majeur ; la proposition (a) ferme la porte pour toute interface, en une règle de rapport.
2. **RT-134** : majeur ; la proposition (a) est une mesure de plus dans un outil existant.
3. **RT-136** : mineur, un contrôle de build.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-134 et RT-135 suivent un retour humain. Pour RT-134, la règle V18 existe et ne borne que le maximum : **classe à créer**, clé proposée `lisibilite-sans-borne-basse`, famille `rendu`, libellé : « Une demande de lisibilité est servie par un changement de mise en page qu'aucune mesure ne juge, la longueur de ligne n'étant bornée que par le haut. » Pour RT-135, la matrice d'états existe et déclare ses états NON JOUÉS, rien n'exige que les captures jouées à la main soient lues : **classe à créer**, clé proposée `etat-capture-jamais-regarde`, famille `rendu`. RT-136 : **classe à créer**, clé proposée `cache-immutable-version-figee`, famille `livraison`.
