# Retours forges — factory-digit-ai-fr — 20261114zb

> **Annoté à la réception le 23/11/2026** : ce lot a été refusé à la porte le 23/11/2026 (les cinq lignes du sidecar portaient une famille du référentiel au lieu d'une clé de classe). Clés choisies à la lecture des retours : RP-35 devient `nommage-lot-sans-issue` (famille `versionnement-livrable`) ; RP-36 devient `oracle-faux-positif` (famille `regle-morte`) ; RP-37 devient `oracle-faux-positif` (même règle que RP-21) ; RP-38 devient `recette-verdict-non-prononcable` (famille `regle-morte`) ; RP-39 devient `perimetre-de-session-confondu` (famille `hook-ou-gate`). Reportées au sidecar et à la section « La règle qui aurait évité le retour ». Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : run `forge-digit-ai-fr-20261114a`. La maquette de la page de la forge des tests a été construite et vérifiée par un agent `constructeur`. Le 27e lot de retours de la journée a été refusé par le hook de nommage.
- **Références ledger** : forge/ledger.jsonl seq 192, 193, 194, 195, 196.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le constructeur a rendu la maquette `signature-b2.html`. Ses vérifications ont fait apparaître 10 frictions. Les 4 qui touchent des outils de la Factory sont regroupées ici par outil, en retours RP-36 à RP-39 ; les autres restent au produit. Le même jour, le 27e lot de retours du produit n'a plus trouvé de nom conforme : c'est RP-35. Ce lot porte lui-même un indice à deux lettres. Il est donc refusé par le même hook, et ce refus est déclaré ici.

---

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Ce chapitre porte trois retours : RP-35 sur le nommage, RP-36 sur `check_html.py`, RP-37 sur `render_page.py`.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-35 | **majeur** | générique | **`oracle-nommage.mjs` n'accepte qu'une lettre après la date (`\d{8}[a-z]\.`, ligne 46).** Un produit qui remet plus de 26 lots dans la journée n'a plus de nom conforme. Le 14/11/2026, les indices a à z sont tous pris, dans `forge/retours/` comme au sas du pilot. Le 27e lot, `20261114za`, a été jugé et remis par `oracle-lot.mjs`, puis refusé par le hook C7. | Accepter un indice d'une ou deux lettres (`\d{8}[a-z]{1,2}\.`), dans l'oracle et dans R-4, ou ouvrir un indice numérique après z. |
| RP-36 | **majeur** | générique | **`check_html.py` juge mal une page dont les jetons sont dans une feuille liée.** Trois effets : « :root absent » vient d'un test littéral sur le seul HTML (ligne 761) ; le contrôle A5 déclare la feuille « non parsable », car il compte 2 règles pour 13 956 caractères, commentaires compris ; EC-8 ne reçoit pas la déclaration `titres_imposes` du Markdown source (lignes 5633 à 5672). Preuve : frictions F2 à F4 du rapport du constructeur, sur `forge/etapes/design-v2/studio/signature-b2.html`. | Lire les feuilles locales liées pour `:root` et A5. Ignorer les commentaires au comptage. Transmettre `titres_imposes` du Markdown source à EC-8. |
| RP-37 | **mineur** | générique | **`render_page.py` relève aussi 2 défauts V7 par mesure dans un SVG animé figé, sur des calques invisibles.** Ils s'ajoutent aux V4 de RP-21 (lot 20261114s). Preuve : 8 mesures de la maquette, 38 V4 et 2 V7 chacune, tous dans le SVG. | Étendre le correctif de RP-21 à V7. |

## digit-ai-forge-design (`digit-ai-forge-design`)

Ce chapitre porte un retour, RP-38 : un verdict d'oracles ne dit pas avec quelle version des oracles il a été rendu.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-38 | **mineur** | générique | **Les oracles de forge-design ont changé pendant une batterie de vérification (commit 903d524, à 18:40).** `oracle-saisie` est passé de PASS à SANS OBJET sur la même page, sans que la batterie le sache. Preuve : friction F6 du rapport du constructeur ; verdict valable pour HEAD 7bf0b3e. | Faire porter à chaque verdict de `run-oracles-design.mjs` la version (sha) des oracles joués, et la comparer au verdict précédent. |

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-39 : les hameçons attribuent à la session parente les appels d'un sous-agent.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-39 | **mineur** | générique | **Les hameçons consignent les appels d'un sous-agent sous l'identifiant de la session parente.** La ligne 88 de `forge/lecons-rappels.jsonl` vient d'une commande du constructeur, sans que rien ne permette de le savoir. Preuve : friction F8 du rapport du constructeur. | Porter dans chaque ligne l'identifiant de l'agent appelant, quand le hook le reçoit, à côté de celui de la session. |

## La règle qui aurait évité le retour

- RP-35 : la règle R-4 fixe un indice sans en borner le nombre, alors que l'oracle qui la juge le borne à 26. Classe : `nommage-lot-sans-issue` (famille `versionnement-livrable`).
- RP-36 : le socle juge une page par son seul HTML, alors que la direction B centralise ses jetons dans une feuille. Classe : `oracle-faux-positif` (famille `regle-morte`).
- RP-37 : même règle que RP-21. Classe : `oracle-faux-positif` (famille `regle-morte`).
- RP-38 : un verdict sans la version de son juge. Classe : `recette-verdict-non-prononcable` (famille `regle-morte`).
- RP-39 : une trace qui ne dit pas qui l'a produite. Classe : `perimetre-de-session-confondu` (famille `hook-ou-gate`).

## Remarques restées au produit

- F7 : le texte source a changé à 18:28, pendant la construction, sans que l'agent en soit prévenu. Généralisable : non, c'est un défaut de coordination de l'orchestrateur de ce run.
- F9 : le port 8766 était pris par un serveur d'une autre session. F10 : une capture trop précoce montre l'arc de chargement de la vidéo. Généralisable : non, ce sont des conditions locales.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
