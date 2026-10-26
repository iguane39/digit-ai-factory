# <NOM-PRODUIT> — CLAUDE.md

<!-- Gabarit du pilot, réduit par T4 (TF-1949) : l'orchestrateur remplit les <…>. « Routage forge » est OBLIGATOIRE (R-11). -->

<Une phrase : ce que fait le produit, pour qui.>

Construit et maintenu par la forge Digit-AI ; état du run : `forge\ledger.jsonl`.

**Précédence (R-43).** Quand la factory est impliquée, ses règles priment sur celles de ce projet : ce fichier les renforce,
jamais ne les assouplit ; un conflit se tranche pour la factory et se consigne au ledger (`type: conflit_regles`). Ses hooks
(`forge\hooks\factory.mjs`) jugent l'ouverture et chaque fin de tour (`forge\RESTITUTION.md`, `forge\NIVEAUX.md`).

## Routage forge — obligatoire

La boucle intérieure est libre ; tout verdict (valider, livrer, faire évoluer, déployer) passe par les forges.
**Je mobilise** : avant de travailler, la session range la demande dans un type de `<PILOT_ROOT>\references\CARTE-FORGES.json`
et donne à chacune des 13 forges « mobilisee » ou « ecartee » avec son motif, selon la demande et le profil
(`forge\PROFIL.json`) ; la carte privilégie, elle ne fige pas. Écrivain : `node <PILOT_ROOT>\scripts\mobiliser.mjs --preparer
--type <type> --sortie <f>`, puis `--verdicts <f>` ; trace `forge\mobilisation.jsonl`, une ligne à l'écran, « Je mobilise : … ».
Avant « livré », chaque forge mobilisée a ses livrables (S85, `--verifier`). Types de ce produit : `<types de la carte>`.

- Tests : forge_tests, `--sortie forge\etapes\tests\rapport-<AAAAMMJJ>.json` ; jamais « tests OK » sur un pytest direct.
- Audit du produit : forge-audit (`init-audit-workspace`, `forge\audit\<AAAAMMJJ>`) ; jamais forge_tests.
- Évolution : retour au ledger, puis run de version ; jamais de code livré hors run.
- Déploiement : étape MEP par la chaîne du produit, GO humain sur `forge\DOSSIER-MEP.md` ; jamais lancé d'un poste.
- Détail des routes, demandes entre produits : `<PILOT_ROOT>\references\CLAUDE-PRODUIT-DETAIL.md`.

**Retours et noms.** Une friction forge se consigne au ledger au moment même (`type: retour`, 4 réponses du test de
généralité). À la clôture, lot `<projet> - RETOURS - …` et sidecar `.tf.jsonl` au sas `<pilot>\input\00-retours\_arrivee\`,
jamais ailleurs dans `input\`. Le lot porte le vrai nom du projet ; le pilot, public, pseudonymise à l'accueil, jamais le
produit. Un dépôt PRIVÉ (`gh repo view --json visibility`) garde les noms réels (règle humaine du 01/10/2026).

**Gestes destructifs distants : une décision groupée, jamais une par commande (TF-1959, D-77 (b) amendée
du 26/10/2026)** : « une décision pour toutes les modifs en une fois, pas une décision à chaque fois qu'il
y a une suppression ou modification de droits ». Le fait : un dépôt d'essai et son état Terraform supprimés
alors qu'une décision humaine les réservait à plus tard, et 4 attributions de rôles Azure DevOps
tentées (403, 401). Ce que la session fait : (1) regrouper TOUS les gestes destructifs distants prévus dans
le tour (`az … delete`, `terraform destroy`, attribution de droits, `gh repo delete`, `git push --force`…) en
UNE décision au bloc 3, liste complète avec commande, cible, effet et retour arrière ; (2) après
l'approbation, écrire le lot par `node forge\hooks\factory.mjs gestes-distants --poser --lot <lot.json>`
(`forge\gestes-approuves.jsonl`, 24 h au plus). Le hook `gestes-distants` refuse toute autre commande
destructive distante avec ce remède ; lectures et déploiements ordinaires passent. Liste fermée et format du
lot : `references\GESTES-DISTANTS.md` du pilot.

## Règles de socle applicables

Une ligne par type de livrable de ce produit, d'après la table du détail ; un type absent est un oubli (loi n° 3). Un livrable
de sécurité se juge par les oracles de forge-websec, jamais par un contrôle reconstruit en lisant le code (TF-1046).

| Type de livrable | Règles de socle | Composant / oracle |
|---|---|---|
| <autre type de ce produit> | <règles> | <composant / oracle> |

## Commandes

- Lancer : `<commande>`
- Boucle intérieure, libre et sans verdict (tests locaux, serveur de dev) : `<commande>`

## Conventions locales

- `REGLES-PROJET.md` du pilot : `input\` en lecture seule, livrables datés sous `output\`, **`.env` jamais committé**,
  push sur GO humain ; **aucun livrable publié sur un service hébergé sans GO humain consigné**, jamais proposé en option
  (R-38) ; **aucune donnée d'identité de l'utilisateur vers un service tiers sans sa demande** (R-62). Des hooks y veillent.
- Écart au socle : retour dans le tour (TF-1048) ; `ts` du ledger relevé à l'écriture (TF-1424) ; une version tenue
  ouverte n'arrête pas la nouvelle (TF-1503).
- `<conventions spécifiques au produit>`

## Lexique d'invocation (RV-6)

Une formule qui figure littéralement dans les déclencheurs d'un skill est une invocation ; au doute, une question d'une
ligne avant d'exécuter.

## Référentiels

Une réponse par ligne ; « absent » est valide, le silence non (TF-0373).

| référentiel | état |
|---|---|
| exigences | `<chemin>` ou `absent — <motif>` |
| anomalies | `<chemin>` ou `absent — <motif>` |
| contrat_interface | `<chemin>` ou `absent — <motif>` |
| lexique | `forge\LEXIQUE.json` ou `absent — <motif>` |

## Reprise

Forge : `<FORGE_ROOT>`. Le pilot se désigne `<PILOT_ROOT>`, jamais par le nom de son dépôt (TF-0367) : `$PILOT_ROOT`,
sinon le frère de `<FORGE_ROOT>` qui porte `oracles\oracle-conformite-projet.mjs`, `todo\TODO.jsonl`,
`todo\oracle-todo.mjs`, `REGLES-PROJET.md` et `CONTRAT-INTERFACE.md`, sans `PERIME.md` ; deux candidats ne se tranchent
jamais en silence. Référence : `<PILOT_ROOT>\oracles\resoudre-pilot.mjs`.

## Reprise sur un autre poste (R-64)

**Canal de reprise** : `forge\REPRISE.json` ou `absent — un seul poste`. Plusieurs postes : la session l'écrit d'après
`<PILOT_ROOT>\gabarits\REPRISE.json` ; le hook `reprise` restaure et envoie ; les secrets ne transitent jamais par lui.
