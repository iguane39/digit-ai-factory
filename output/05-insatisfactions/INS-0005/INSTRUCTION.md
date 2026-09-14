# INS-0005 — « sur la page client, panier et commande sont inactifs et l'aide vide le panier »

**Produit** : produit-61 (le dépôt d'insatisfaction porte, dans son en-tête `produit:`, le
nom déclaré au dépôt — pseudonymisé ici, jamais recopié).
**Déposé** : 06/09/2026 à 18:53, par l'humain, une phrase (dépôt « d » du lot du jour, sans
capture ni URL).
**Instruit** : 14/09/2026 par le pilot, **en lecture seule** — aucun octet n'a été écrit chez
le produit ; instruction rétrospective, un correctif du produit lui-même étant intervenu entre
le dépôt et l'instruction (bloc e).

---

## a — Reproduction, aux conditions réelles

Le dépôt ne fournit pas l'URL de la page client ; la reproduction « aux conditions réelles »
(navigateur, pixels) n'est pas jouable ici. Ce chapitre s'appuie sur deux niveaux de preuve : une
mesure au navigateur **antérieure**, faite par le produit lui-même sur son environnement public
avant le correctif, et une reproduction **structurelle** sur les sources avant/après.

| Ce qui est vérifié | Comment | Résultat |
|---|---|---|
| Mesure au navigateur, avant correctif, sur l'environnement public | ledger du produit, entrée `retour` seq 88, 06/09/2026 16:55 | « mesuré en navigateur sur qualif : Panier défile jusqu'à la section (peu visible), Ma commande mène à l'aide, les quantités reviennent à 0 après Aide puis La carte » — cette mesure, faite par le produit avant de se corriger, confirme le dépôt humain point par point et est antérieure à toute instruction du pilot |
| Persistance du panier entre deux pages, avant correctif | lecture de `backend/app/static/app.js` (parent) | aucune trace de `localStorage` : les quantités saisies vivent uniquement dans le DOM de la page carte ; une navigation vers `/aide` charge une page différente, qui ne porte pas ce DOM — au retour sur la carte, les champs numériques repartent de la valeur servie par le serveur (`quantites`, absente hors erreur de formulaire), donc de 0 |
| Lien « Ma commande » sans commande active, avant correctif | lecture de `backend/app/templates/client/_base_client.html` (parent) et de la route `carte()` (`backend/app/routes/client.py`, parent) | le lien calcule `commande.jeton_public if commande else …`, mais la route qui rend la carte ne passe **jamais** de variable `commande` au gabarit — sur la page carte, ce lien pointait donc systématiquement vers `/r/{slug}/aide#ma-commande`, y compris pour un client qui avait déjà une commande en cours sur son appareil |
| Lien « Panier », avant correctif | lecture de `backend/app/templates/client/carte.html` (parent) et de `app.js` (parent) | la section `id="panier"` existait déjà : le lien `href="…#panier"` fonctionnait comme ancre native du navigateur, mais sans aucune mise en évidence ni changement de focus — un défilement bref jusqu'à une section visuellement identique aux autres, cohérent avec la mesure du ledger (« peu visible ») plutôt qu'une absence totale de réaction |
| État après correctif | lecture de l'état courant (identique au commit du correctif) | `localStorage` sauvegarde et restaure les quantités par restaurant (`rcc-panier:<slug>`), vidé uniquement à la création d'une commande ; un cookie `rcc_derniere_commande` (2 jours, borné au restaurant) fait retrouver la dernière commande de l'appareil ; le clic sur « Panier » déclenche un défilement, une mise en évidence (`.surligne`) et le focus du champ téléphone |

## b — Cause racine côté produit : trois défauts distincts, pas un

Ce chapitre nomme, pour chacun des trois symptômes du dépôt, le fichier et la ligne où vivait
le défaut.

**1. « L'aide vide le panier » — absence de persistance, `backend/app/static/app.js`.** Avant
correctif, le script ne connaissait que le DOM courant : `formPanier.addEventListener('input',
recalculer)` recalculait le total en mémoire, sans jamais rien écrire hors de la page. Naviguer
vers `/aide` (un besoin légitime : lire les règles Wero, contacter, mentions légales) chargeait
une autre page, donc un autre DOM vierge. Ce n'est pas l'aide qui « vide » le panier : rien ne
l'a jamais rempli ailleurs que dans une page qu'on vient de quitter. Corrigé par les fonctions
`sauver()` / `restaurer()` ajoutées à la même zone du fichier (clé `rcc-panier:` + slug).

**2. « Le bouton commande est inactif » — `backend/app/templates/client/_base_client.html`,
navigation basse.** Le lien « Ma commande » dépendait d'une variable `commande` que la route de
la carte (`backend/app/routes/client.py::carte()`, avant correctif) ne fournissait jamais : pour
tout visiteur revenu sur la carte après avoir commandé, ce lien retombait systématiquement sur
la page d'aide, jamais sur le suivi de sa commande réelle — d'où la perception d'un bouton qui
« ne mène nulle part d'utile ». Corrigé par l'ajout d'une fonction `derniere_commande()` (nouveau
code dans `client.py`) qui lit un cookie posé à la création de la commande, et par le passage de
cette valeur au gabarit sur la carte et sur l'aide.

**3. « Le bouton panier est inactif » — absence de retour perceptible,
`backend/app/static/app.js`.** Le lien existait et fonctionnait comme ancre HTML ordinaire, mais
sans aucun signal (pas de défilement animé si `scroll-behavior` n'était pas posé pour l'ancre,
pas de mise en évidence, pas de changement de focus) : sur un écran mobile où la section panier
ressemble aux sections de plats qui la précèdent, l'effet pouvait passer inaperçu — exactement
la mesure « peu visible » du ledger. Corrigé par `montrerPanier()` (défilement fluide, classe
`.surligne` avec un délai de retrait, focus du champ téléphone).

## c — Gates en défaut : vérifiés, jamais présumés

Pour chacun des trois défauts, ce chapitre nomme le contrôle qui aurait dû le voir, dit lequel
des trois cas s'applique et l'appuie sur une preuve lue.

| Défaut | Quel contrôle aurait dû voir | Pourquoi il n'a pas vu | Preuve |
|---|---|---|---|
| Perte du panier après un passage par l'aide | seuil `couverture_surface_interface` (pan interface, bloquant) | **aveugle** — ce seuil vérifie qu'un formulaire est câblé (soumission, validation), pas qu'un état de saisie survit à une navigation entre deux pages différentes ; aucune règle de persistance inter-pages n'entre dans son périmètre déclaré | `forge/etapes/tests/rapport-20260905g.json`, `seuils.couverture_surface_interface` : « porte_sur : affordances (bouton, lien, formulaire) câblées » — la persistance n'y figure pas |
| « Ma commande » sans lien vers une commande réelle sur l'appareil | seuil `couverture_surface_qualif` (pan qualif, bloquant, « routes UI parcourues sans erreur sur une instance servie et peuplée ») | **aveugle** — ce seuil juge l'absence d'erreur serveur ou de console en échec sur une route, pas la pertinence de la destination d'un lien qui répond 200 sans erreur ; le lien vers `/aide#ma-commande` est une route valide, donc invisible à ce contrôle | `forge/etapes/tests/rapport-20260905g.json`, `seuils.couverture_surface_qualif` |
| Bouton « Panier » peu visible (ancre sans mise en évidence) | aucun | **inexistant** — aucun contrôle relu ne mesure la perceptibilité d'une action (défilement visible, changement de focus) au-delà de sa présence dans le DOM ; c'est une dimension d'expérience, pas de câblage | absence de tout seuil de ce nom dans `forge/etapes/tests/rapport-20260905g.json` |

**Ce qui a été vérifié avant de conclure** (R-35/bloc c) : l'hypothèse « la forge n'a pas vu » a
été confrontée à la définition écrite de chaque seuil dans le rapport de tests lui-même — les
trois lectures citées montrent que les trois défauts n'entraient dans le périmètre déclaré
d'aucun contrôle existant, plutôt que d'accuser un pan qui n'était pas en cause.

## d — Solutions, par destinataire

**PRODUIT (produit-61)** — déjà fait, remis par la voie du produit (bloc e) :
1. conserver les quantités du panier sur l'appareil entre deux pages (E-076) ;
2. faire mener « Ma commande » à la dernière commande réelle de l'appareil, avec un message
   explicite quand il n'y en a pas (E-077) ;
3. rendre l'action « Panier » perceptible : défilement, mise en évidence, focus (E-078).

**FORGES** — deux trous à couvrir, proposés en candidature (aucune écriture de ce dossier) :
- un contrôle de persistance d'état client entre deux navigations d'une même session
  (pan interface ou pan qualif, forge-tests) ;
- un contrôle de perceptibilité d'une action déclarée « affordance » (au minimum : la cible
  d'une ancre est-elle visible dans le viewport après le clic, pas seulement atteinte par l'URL).

**PILOT** — rien à consigner au-delà de ces deux candidatures : pas de constat de doctrine
distinct de celui déjà nommé.

## e — Correctif et release : CONSTATÉ, par la voie du produit

Le produit a livré ce correctif de lui-même, par un run de version régulier — rien n'a été
exécuté par cette instruction, seul l'état existant est constaté.

- **Commit** `a9d56b1` (06/09/2026 19:11), run de version 20260906, exigences E-076, E-077,
  E-078 ajoutées au référentiel scellé ;
- **Tests** dédiés dans `backend/tests/test_version_20260906.py` :
  `test_E077_ma_commande_mene_a_la_derniere_commande_de_l_appareil` (message sans commande,
  cookie posé à la commande, lien vers le suivi réel après, cookie borné au restaurant) et
  `test_E076_E078_crochets_du_panier_conserve` (présence du slug pour la conservation du panier,
  section panier ciblée, script portant `rcc-panier:` et `data-vider-panier`) ;
- **MEP** : `forge/DOSSIER-MEP.md`, section « Run de version 20260906 » — M-3 smoke PASS,
  **`forge/etapes/tests/parcours-client-qualif.json` : 4/4 au navigateur, nommément sur E-076,
  E-077, E-078** — c'est une preuve au navigateur réel, pas seulement une preuve de source ;
- **Confirmation indépendante et postérieure** : l'audit du 09/09/2026 mesure de nouveau la
  qualif servie, parcours 4/4 rejoué, sans régression signalée sur ces trois exigences ;
- **État courant** : `app.js`, `client.py`, `_base_client.html`, `carte.html` identiques entre le
  commit du correctif et l'état lu ce jour ;
- **Production** : toujours non déployée à ce jour (GO humain Q-01 ouverte) ; le correctif vit
  sur l'environnement qualif, seul environnement public du produit.

## f — Retours aux forges

Aucun lot nouveau porté par ce dossier : les deux candidatures du bloc d (persistance d'état
inter-navigations, perceptibilité d'une affordance) sont consignées ici en candidature, pas
écrites ailleurs — la décision de les instruire en TF reste humaine.

---

## Verdict proposé

**`corrige`** — les trois symptômes du dépôt sont nommément couverts par les exigences E-076,
E-077, E-078, testés en unitaire et **rejoués au navigateur sur l'environnement servi** (preuve
la plus forte des quatre dossiers de ce lot, la seule qui inclue une mesure navigateur avant ET
après). Réserve : cette instruction n'a pas rejoué elle-même le parcours navigateur ; elle
s'appuie sur les preuves déjà produites par le produit (ledger seq 88 avant, rapport
`parcours-client-qualif.json` après), qu'elle n'a pas pu recontrôler faute d'URL et d'instance
en service sur ce poste.
