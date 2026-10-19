# Retours forges — Produit-02 — 20261018b

- **Contexte** : deux travaux hors run du 18/10/2026 sur l'agenda des évènements. D'abord la planification du relevé hebdomadaire, jamais lancé depuis le 16/09 (décision notée D-1 a). Ensuite la refonte de la page /agenda, mise en ligne sur D-148 (a). Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 451, 475 et 476 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-18
- **Complétude** : 3 retours de cette session destinés à la factory, seq 451, 475 et 476. Ils sont portés ici, chacun avec sa candidature au sidecar.
  - Le ledger porte aussi 7 retours vers les forges écrits par d'autres sessions et qu'aucun lot remis ne contient : seq 397, 399, 405, 406, 409, 411 et 425. Cette session ne les a pas instruits. Ils restent à compiler par leurs sessions, ou au prochain lot de clôture.
  - La seq 459 vise le produit lui-même et reste au produit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — vérifications non déclenchées et numéros de décision

Trois retours. Le premier suit un retour humain direct : la critique de rendu a été proposée à l'humain au lieu d'être jouée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-130 | majeur | générique | **La critique d'implémentation n'est déclenchée par rien hors run.** Refonte de /agenda le 18/10/2026 : la restitution a posé D-148 avec l'option « (a) faire juger le rendu par la critique d'implémentation de forge-design, puis envoyer ». Réponse humaine : « Pourquoi la critique n'est pas déjà faite. Je ne dois pas avoir à la valider manuellement. Elle doit être faite automatiquement. » Jouée ensuite, elle a trouvé 4 défauts réels absents des captures et des 147 contrôles du site : texte rogné par un masque (554 constats), contrôles désalignés d'une carte à l'autre (134), jours passés à 2,29:1, bouton sans intitulé dans le HTML servi. Ledger seq 475 ; rapport `forge/etapes/REVUE-IMPLEMENTATION-agenda-20261018.md`. | (a) Un hameçon de fin de tour, ou le hook de restitution, refuse une restitution d'un tour qui a modifié un fichier servi (`site/**/*.html`, CSS, JS) sans verdict de critique d'implémentation daté du tour. (b) S16 cesse de ne juger que les pages « citées comme livrées » : une page modifiée suffit. (c) Une option de décision qui commande une vérification jouable par l'IA est refusée (R-58). |
| RT-131 | majeur | générique | **Un numéro de décision réservé est repris par une autre session.** D-148 réservée à 14:17 UTC (seq 460, type `question_humain`), reprise à 14:35 UTC par une autre session du même produit (seq 464 à 467), qui consigne « D-148 a » pour sa propre question (seq 468). Deux D-148 sont ouvertes le même jour ; la réponse humaine « 148a » ne dit pas laquelle elle tranche. Le contrôle TF-1849 avertit celui qui pose sans réserver, il ne refuse pas un numéro déjà réservé. Dans la même session, la décision notée D-1 (seq 452, commit 7080d64) reprenait un numéro pris depuis l'ouverture du produit. Ledger seq 476. | (a) La réservation rend le prochain numéro libre et refuse un numéro déjà présent au registre. (b) Le préjugement de restitution refuse une D-N déjà réservée par une autre entrée `question_humain`. Récidive de la classe `designateur-de-decision-sans-reservation`. |
| RT-132 | mineur | générique | **Une promesse de cadence est livrée sans son porteur.** La page d'agenda livrée le 16/09/2026 (seq 259) annonçait aux visiteurs « La liste est relevée chaque semaine », et le script portait « relevé hebdomadaire ». Aucun planificateur ne le lançait : un seul relevé en 32 jours, constaté le 18/10 sur question de l'exploitant (0 cron dans les 8 workflows, 0 tâche planifiée au poste, 0 appel dans `server.mjs`). Ledger seq 451 ; corrigé au produit par `.github/workflows/agenda.yml` (commit 7080d64). | Un contrôle de livraison confronte toute cadence promise (texte servi, commentaire de script : « chaque semaine », « quotidien ») à un porteur qui survit à la session : planificateur, tâche planifiée, CI. Analogue produit de S67, qui ne juge que les promesses de prévenir écrites dans une restitution. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant ces travaux, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `check-distances.mjs` échoue depuis un chemin accentué (`S%C3%A9bastien`, exit 2). | Copie de travail déplacée sous `c:/dev` ; ledger seq 459. | non | Défaut du contrôle du produit, reste au produit. |
| `render_page.py` a jugé blanche (V9, 1,00:1) une icône dont le trait calculé est `rgb(45, 64, 71)` sur les 106 cartes visibles ; le constat disparaît avec l'icône. | Icône décorative retirée. | peut-être | Cause non établie : non remonté en candidature tant qu'il n'est pas reproduit. |
| La matrice d'états de `render_page.py` ne sait actionner que le filtre de tableau (`.tf-btn`) : ses 5 états sont NON JOUÉS sur un filtre maison. | États joués par un script Chrome dédié (repos, panneau ouvert, tout déplié, filtre sans résultat). | oui | Déclaré honnêtement par l'outil ; à considérer si d'autres produits portent des filtres maison. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les restitutions suivent `forge\RESTITUTION.md`, et le rapport de critique suit le squelette de `critique-implementation.md` de forge-design.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : la pose du secret d'Actions et les déploiements du 18/10 n'ont été ni refusés ni contraints.

## Confirmations positives

- **La critique d'implémentation sur instance servie** a trouvé 4 défauts réels que 147 contrôles et des captures ne voyaient pas.
- **La comparaison à une page de référence du même gabarit** a permis de séparer en quelques minutes les constats du socle de ceux de la page.
- **Le préjugement des restitutions** a signalé la décision non réservée avant l'affichage.

## Ordre recommandé

1. **RT-130** : majeur, suit un retour humain direct ; la proposition (a) ferme le trou pour tous les produits.
2. **RT-131** : majeur, récidive d'une classe connue ; la règle devient bloquante le 01/11/2026 sans couvrir ce cas.
3. **RT-132** : mineur, un contrôle de livraison de plus.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-130 suit un retour humain. La règle existe à moitié : `restitution-rendu-visuel-non-critique` (S16) exige un verdict de critique pour une page « citée comme livrée », et rien ne la fait jouer pour une page modifiée ; classe retenue `controle-ecrit-non-cable-a-son-etape`. RT-131 relève de `designateur-de-decision-sans-reservation`, dont la règle ne couvre pas la reprise d'un numéro réservé. RT-132 : **classe à créer**, clé proposée `cadence-promise-sans-porteur`, famille `livraison`. Libellé : « Un livrable promet une cadence automatique (relevé hebdomadaire, mise à jour quotidienne) et rien ne l'exécute : la promesse est servie aux utilisateurs, le traitement n'a lieu qu'une fois. »
