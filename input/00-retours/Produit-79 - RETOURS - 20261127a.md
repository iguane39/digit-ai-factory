# Retours forges — Produit-79 — 20261127a

- **Contexte** : autre — refonte de la stratégie Facebook et Instagram avec Claude, Codex et Gemini, le 27/11/2026, hors run
- **Références ledger** : `forge\ledger.jsonl` seq 1273, 1275, 1278 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : a_remettre

---

Convention de gravité : bloquant, majeur, mineur.

## pilot (`digit-ai-factory`)

La réservation des numéros de décision ne lit pas les numéros à 4 chiffres : le produit a franchi D-999 le 25/11/2026.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RX-1 | majeur | générique | Le 27/11/2026 vers 14h16, `scripts/reserver-decision.mjs --question` inscrit D-1000 au ledger (seq 1274) puis répond « D-1000 n'apparaît pas au ledger après l'écriture : l'inscription n'est pas prouvée ». Cause : `D_NUMERO = /(?<![\p{L}\p{N}_])D\s*-?\s*(\d{1,3})(?![\p{N}])/giu`, `oracles/lib-decisions.mjs` ligne 41, qui exclut tout numéro de 4 chiffres ; le maximum lu reste 999, et la réservation suivante reproposerait D-1000. Le préjugement de la restitution (`hook-restitution.mjs --prejuger`) lit aussi « D-100 » au lieu de D-1000 à D-1002 (seq 1275). | Porter le motif à `\d{1,5}` ; recette rouge sur un ledger qui porte D-1000. Règle qui aurait évité le retour : aucune, le motif a été écrit pour 3 chiffres. |

## forge-agents (`digit-ai-forge-agents`)

Le skill `delegue-a-codex-et-gemini` a servi aux 3 gestes ; un seul a échoué.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RX-2 | mineur | générique | Le 27/11/2026 vers 14h31, `agent-tiers.mjs relire --agent antigravity --json` rend FAIL en 16 s, statut « json illisible », erreur « jetski: no output produced — a tool required the "command" permission that headless mode cannot prompt for, so it was auto-denied ». Le 2e essai, avec une ligne « n'exécute aucune commande » ajoutée en tête de consigne, rend PASS en 537 s (seq 1278). | Le lanceur ajoute d'office cette ligne à la consigne de `relire` pour Antigravity, et rend un motif lisible au lieu de « json illisible » ; jamais `--dangerously-skip-permissions`. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 20 publications Facebook programmées du 19/10 au 26/11 font 0 à 4 vues : l'application Meta « APDLB pilotage » est en mode développement (seq 1273, rectifiée seq 1276) | guide de passage en mode public remis à l'exploitant, publication Facebook à la main d'ici là | oui | la classe vaut pour tout produit qui publie par une application Meta : remontée en garde-fou de plateforme ci-dessous |
| La régénération des README lancée sur tout `output\` a créé 98 README dans des dossiers d'agence | retirés le jour même, repérés à leur date de création | non | erreur de la session, que la consigne d'ouverture interdit déjà (« jamais sur tout le produit ») |

## Retours sur les documents produits

Aucun document produit depuis un gabarit du catalogue sur ce lot ; la stratégie suit la famille `etude-opportunite`, sans écart relevé.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot, aux mêmes verdicts que le lot 20261125a :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie une famille proposée qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Nouveau garde-fou :

- plateforme : Meta (Facebook, API Graph) ;
- mécanisme : mode de l'application dans le tableau de bord développeur ;
- effet : le contenu publié par une application en mode développement n'est visible que des personnes qui ont un rôle sur l'application ;
- portée : toute page Facebook alimentée par une application en mode développement ; Instagram n'est pas touché ;
- vise : les applications en cours de développement ;
- refuse : la diffusion publique des publications, sans erreur ni avertissement à l'appel (codes 200) ;
- heurté le : du 19/10 au 26/11/2026, constaté le 27/11/2026 (ledger seq 1273) ; source : `https://developers.facebook.com/docs/development/build-and-test/app-modes`, lue le 27/11/2026.

## Confirmations positives

- Le geste `concevoir` du skill `delegue-a-codex-et-gemini` a rendu 2 stratégies complètes sur le même brief (Codex 595 s, Gemini 689 s), comparées à une proposition de Claude figée avant lecture.
- Le geste `image` a rendu 6 aquarelles au format 4:5, toutes utilisables (Codex 77 à 153 s, Gemini).
- Les relectures tierces ont trouvé, chacune de son côté, les mêmes graves : nuits de Pâques, gardes manquantes, « moins de monde » sans source ; 15 graves ont tenu au recompte.
- `programmer_publications.py verifier` a trouvé 3 défauts réels de la publication 207 (format, ratios, piscine) que ni la relecture de Claude ni le premier jet n'avaient vus.

## Ordre recommandé

1. RX-1, parce qu'il touche tous les produits qui passent D-999 et fausse la réservation suivante.
2. RX-2, parce qu'il coûte un essai de 16 s puis un second geste de 9 minutes.

## La règle qui aurait évité le retour

- RX-1, classe proposée `numero-de-decision-a-quatre-chiffres-ignore` : aucune règle ne couvre la largeur du numéro ; règle § 4 de quality-oracles, une recette rouge sur un ledger qui porte D-1000.
- RX-2, classe proposée `relecteur-tiers-sans-consigne-d-outil` : aucune règle ne couvre la consigne d'outil d'un relecteur tiers ; la recette du skill (`self-test.mjs`) gagnerait un cas « modèle qui tente une commande en lecture seule ».
