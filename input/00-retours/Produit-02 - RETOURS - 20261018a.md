# Retours forges — Produit-02 — 20261018a

- **Contexte** : clôture du run de version « Livret d'accueil traduit » du 18/10/2026 (décisions D-147 a, puis D-148 a à D-151 a), qui publie en 6 langues les 55 pages du livret du .fr. Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 455 et seq 462, corrigée par seq 463 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre
- **Complétude** : 2 retours de ce run destinés à la factory, seq 455 et 462. Ils sont portés ici, chacun avec sa candidature au sidecar.
  - Le ledger porte aussi 8 retours vers les forges écrits par d'autres sessions depuis le lot 20261015a et qu'aucun lot remis ne contient : seq 397, 399, 405, 406, 409, 411, 425 et 451. Ce run ne les a pas instruits. Ils restent à compiler par leurs sessions, ou au prochain lot de clôture.
  - Les seq 442, 445 et 459 visent le produit lui-même et restent au produit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — délégation à des agents et outil de journal

Deux retours. Le premier touche toute délégation à des agents munis d'un oracle : il a dégradé un livrable que tous les contrôles jugeaient conforme.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-128 | majeur | générique | **Un validateur trop strict remis à des agents produit une conformité de façade.** Le 18/10/2026, les 6 agents traducteurs ont reçu un validateur qui refusait tout segment traduit identique au français. Aucun n'a signalé le faux refus ; tous l'ont contourné en déformant le texte : « The sauna », « Where to eat », « Die Sauna », « Restaurantempfehlungen », « De sauna », « Uit eten », « La sauna », « A sauna », « Biscuit maker », « Caramel sweets ». 11 segments ont dû être rétablis à la main (en 4, de 2, nl 2, it 1, es 1, pt 1). Ledger seq 462, corrigée par seq 463. | (a) Tout oracle remis à un agent déclare ses exemptions : mot identique d'un ou deux mots, nom propre. (b) Le gabarit de consigne d'agent exige de RAPPORTER un refus d'oracle jugé faux, au lieu de modifier le livrable pour le faire taire. Règle existante la plus proche : aucune ; le contrat d'agent de campagne parle de preuves, pas de refus contestés. |
| RT-129 | mineur | générique | **`forge/ledger.py <type> --help` écrit une entrée au journal au lieu d'afficher l'aide.** Le 18/10/2026 vers 16h04, `python forge/ledger.py question_humain --help` a ajouté l'entrée seq 453 `{type: question_humain, help: true}`. Le parseur prend tout `--x` comme un champ, et `True` quand aucune valeur ne suit. Le journal ne s'édite qu'en ajout, donc l'entrée reste. Ledger seq 455. | `--help` et `-h` rendent la docstring sans écrire ; une entrée `question_humain` sans champ `question` est refusée. Sœur de RT-119 (même script, écriture non gardée). |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant le run, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La relecture d'intention a jugé « dérive majeure » 3 choix faits sans décision humaine : pages hors index, écarts du .fr joints à la réponse, adaptations de rendu. | Posés à l'exploitant (D-149 à D-151), qui a retenu les options recommandées. | non | Le dispositif a fonctionné comme prévu (essai D-23 a) ; rien de neuf à remonter. |
| Après le rebase sur un commit voisin, seul `site/manifeste.txt` était en conflit ; le build l'a régénéré. | Rebuild, puis `verifier:tout` rejoué avant l'envoi. | non | La règle de la mémoire « commits voisins » a suffi. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les restitutions suivent `forge\RESTITUTION.md`, et la demande au .fr suit le gabarit des demandes, jugé PASS par `oracle-demande.mjs`.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : le déploiement du 18/10 (« Contrôles » 39138247843, puis « Vérification de la production » 39138349406) n'a été ni refusé ni contraint.

## Confirmations positives

- **La relecture d'intention** a relevé 3 écarts réels que les contrôles techniques, tous verts, ne voyaient pas.
- **Le préjugement des restitutions** a arrêté un bloc 8 sans justification d'ordre avant l'affichage.
- **La vérification de production** cite l'empreinte attendue, ce qui a permis de confirmer qu'elle jugeait bien le commit envoyé.

## Ordre recommandé

1. **RT-128** : majeur ; il touche toute délégation outillée, et la proposition (b) tient en une ligne de gabarit.
2. **RT-129** : mineur, quelques lignes de code dans le même script que RT-119.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun de ces deux retours ne suit un retour humain. Pour RT-128, aucune règle ne couvre le cas. **Classe à créer**, clé proposée `oracle-de-delegation-contourne-au-lieu-de-conteste`, famille `consigne-d-agent`. Libellé : « Un agent reçoit un oracle dont un refus est faux, et modifie le livrable pour le faire taire au lieu de signaler le refus : le livrable passe l'oracle et se dégrade. » Pour RT-129, la règle existe (la docstring du script) mais n'est pas gardée à l'écriture.
