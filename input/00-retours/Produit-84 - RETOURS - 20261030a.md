# Retours forges — Produit-84 — 20261030a

- **Contexte** : incident du 30/10/2026. Le porteur voit sur `Produit-84-hpr.pages.dev` la version « v1.06 », alors que l'étiquette déployée est `v1.8.0`, puis `v1.9.0`. Demande du porteur, même jour : « identifie pourquoi ça n'a pas été vu par le design, et remonte ce point à la Factory ».
- **Références ledger** : `forge\ledger.jsonl` seq 2, 93, 94, 95 et 96 (entrées `type: retour`) ; seq 92, 97 et 98 (verdicts, dont la rectification de chiffres des seq 93, 95 et 96, repris justes ici).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-30
- **Complétude** : 5 retours. Les seq 93 à 96 sont nés de l'incident. La seq 2, du 28/10/2026, n'avait été citée par aucun lot ; le relevé d'ouverture l'a signalée (TF-1988).

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **L'amont.** La page de l'amont écrit « v1.06 » en dur à trois endroits : le titre de l'onglet, l'écran de connexion et l'en-tête.
- **D-17, le 29/10/2026 à 16:39.** La numérotation `vX.Y.Z` arrive avec `.github/workflows/version.yml` : une étiquette à chaque fusion de `env/dev` dans `main`. La session a écrit elle-même dans ce fichier « partie de v1.6.0 (la page affiche v1.06) », sans relier la page à l'étiquette.
- **Les étiquettes.** `v1.6.0`, `v1.7.0` et `v1.8.0` sont posées le 29/10, `v1.9.0` le 30/10 à 08:18 UTC. La page affiche toujours v1.06.
- **Le design.** La forge design a été écartée « aucune page ni écran modifié » le 29/10 à 16:39 et à 17:02, puis le 30/10 à 08:13. Elle n'a été mobilisée que le 29/10 à 15:56, sur une correction d'`index.html` ; aucune étiquette n'existait encore.
- **Les oracles.** `run-oracles-design` a été joué ce jour-là (seq 76). Sur ses 23 oracles, 10 s'appliquent à cette page, et tous jugent sa forme. Aucun ne compare une valeur affichée à sa source.
- **La correction.** Commit local `625fd81`, sur `env/dev`, pas encore poussé. `scripts/construire.mjs` écrit l'étiquette dans la page. `tests/version/verifier_version_page.py` recalcule la version depuis git et la lit dans la page servie. Sur la page d'avant, ce test rend 0 cas conforme sur 4 : il voit le défaut.

## Factory (`digit-ai-factory`) — carte de mobilisation, traces partagées, familles de documents

3 défauts : 2 viennent de l'incident, le 3e de la seq 2, qui n'avait pas été remontée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-29 | majeur | générique | **Design écartée sur les fichiers touchés, pas sur l'affiché.** D-17 change le sens d'un texte affiché, la version, sans toucher `index.html`. `forge/mobilisation.jsonl` écarte la forge design avec le motif « aucune page ni écran modifié » le 29/10 à 16:39:57 UTC, puis à 17:02 et le 30/10 à 08:13. La session savait que la page affichait une version : elle l'a écrit en commentaire dans `version.yml`, sans lever le défaut. Résultat : 4 étiquettes posées, v1.06 à l'écran, vu par le porteur sur capture. Ledger seq 94. | (a) Dans `CARTE-FORGES.json`, la forge design répond à la question « un texte affiché change-t-il de sens ou de source ? », et non plus « un fichier servi est-il modifié ? ». (b) Un écart connu, noté en commentaire, se lève comme un défaut. **RT-29** : classe proposée `mobilisation-jugee-sur-fichiers-touches`. |
| RT-30 | majeur | générique | **2 sessions écrivent la même trace ; S85 juge la dernière ligne venue.** Ma ligne date de 08:18:35 UTC : évolution, avec design, development et tests mobilisées. Une autre session a écrit à 08:20:31 UTC : document. `mobiliser.mjs --verifier` a ensuite rendu `PRESENT`, avec `exiges: []`, sur la demande de l'autre session. La mienne exigeait `rapport-forge-tests`, que le verrou n'a pas demandé. À 09:24, ListAgents relevait 4 sessions nommées d'après ce produit. Ledger seq 95, corrigé par la seq 97. | Chaque ligne de `mobilisation.jsonl` porte l'identifiant de la session qui l'écrit. `--verifier` et S85 lisent la dernière ligne de la session qui restitue. **RT-30** : classe proposée `trace-de-mobilisation-partagee-entre-sessions`. |
| RT-31 | mineur | générique | **Pas de famille pour un cadrage de reprise.** Ce dossier rassemble le besoin, les configurations par environnement, les lots, la recette et les gestes distants à approuver. `gd-dossier-architecture` vise une remise à un comité, pas la préparation d'un Build. La fiche de conception a déclaré la famille « aucune », et G6 n'a jugé aucun gabarit. Ledger seq 2, du 28/10/2026. | Une famille `gd-cadrage-reprise` au catalogue. **RT-31** : classe existante `gabarit-famille-manquante`. |

## Forge design (`digit-ai-forge-design`)

Un défaut, à l'origine de l'incident.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | majeur | générique | **Aucun oracle ne compare l'affiché à sa source.** `Produit-84-hpr` affiche « v1.06 » sous l'étiquette `v1.8.0` ; quatre étiquettes ont été posées entre le 29/10 à 16:50 UTC et le 30/10 à 08:18 UTC. `run-oracles-design` a été joué sur `index.html` le 29/10 (ledger seq 76). Sur ses 23 oracles, 10 s'appliquent à cette page, et tous jugent la forme : slop, jetons, saisie, mouvement, images. Dans `oracles/`, `grep -ril "version affich\|source de vérité\|git describe"` ne trouve aucun contrôle de ce type. Rejoué le 30/10 sur la page d'avant puis sur la page corrigée, `run-oracles-design` rend les mêmes comptes : il ne voit pas l'écart. Ledger seq 93, corrigé par la seq 98. | Un oracle « valeur affichée ↔ source ». Le produit déclare ses valeurs dérivées (version, environnement, date de mise à jour) et la commande qui donne chacune. L'oracle lit la page servie et recalcule la source, sans lire le code qui l'écrit. Le modèle est `tests/version/verifier_version_page.py` de ce produit : 4 cas conformes sur 4 après la correction, 0 sur 4 avant. **RD-1** : classe proposée `valeur-affichee-en-dur-divergente-de-sa-source`. |

## Forge tests (`digit-ai-forge-tests`)

Un défaut, relevé en lançant la campagne exigée par la mobilisation.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-1 | mineur | générique | **Un banc RLS hors pgTAP n'est pas vu.** L'adaptateur `supabase` ne compte une table comme exercée que si un fichier pgTAP sous `supabase/tests/` la teste. Ce produit teste ses règles d'accès par l'API, dans `tests/rls/test_rls_dev.py` : 33 cas par rôle, joués à chaque fusion (ledger seq 87). Ces cas touchent 4 des 5 tables, par `/rest/v1/…`. `rapport-20261030.json` (forge-tests `f989006`) déclare pourtant ces 4 tables « inventoriée, jamais exercée » et une couverture de 0 %, avec un verdict bloquant. Sur les 7 constats, 5 portent sur ce pan Supabase. Ledger seq 96, corrigé par la seq 97. | Compter comme exercée une table qu'un fichier sous `tests/` appelle par l'API (`/rest/v1/<table>` ou `from_("<table>")`). Ou laisser le produit déclarer son banc. **RV-1** : classe proposée `banc-de-tests-hors-format-non-reconnu`. |

## Rattachement

Registre interrogé le 30/10/2026 à 09:25, sur `todo/TODO.jsonl` (5 548 lignes) :

- RD-1 : `grep -ci "version affich\|valeur affichée\|source de vérité" todo/TODO.jsonl` → 4 lignes trouvées, sortie complète.
- RT-29 : `grep -ci "aucune page ni écran\|fichier servi modifi" todo/TODO.jsonl` → 0 ligne trouvée.
- RT-30 : `grep -i "mobilisation.jsonl" todo/TODO.jsonl | grep -ci "session"` → 0 ligne trouvée.
- RV-1 : `grep -i "pgtap" todo/TODO.jsonl | grep -ci "exerc"` → 0 ligne trouvée.
- RT-31 : `grep -ci "dossier de cadrage de reprise\|gd-cadrage-reprise" todo/TODO.jsonl` → 0 ligne trouvée.

Items recoupés :

- TF-1866 : une affirmation d'exhaustivité d'une restitution porte « Mesuré sur : <source de vérité> ». Voisin de RD-1 par le principe, il ne couvre pas un texte affiché par une application.
- TF-1002 : sans rapport ; « source de vérité » y désigne la variable d'environnement d'un contrôle.
- TF-2008, corrigé le 29/10/2026 : il a ajouté les tests pgTAP à forge-tests. Voisin de RV-1, il ne reconnaît pas un banc écrit hors de pgTAP.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| « v1.06 » en dur à trois endroits de la page | marque `__CDC_VERSION__` remplacée à la construction ; la construction s'arrête si une marque manque ou si aucune étiquette n'est lisible | oui, par RD-1 | défaut du produit, corrigé au commit `625fd81` |
| Les clones de la chaîne n'avaient pas les étiquettes | `fetch-depth: 0` dans les 4 tâches qui construisent la page | non | propre à la façon dont ce produit lit sa version |
| Commentaire de `version.yml` devenu faux | corrigé dans le même commit | oui, par RT-29 (b) | erreur de session |
| 3 chiffres faux écrits au ledger, seq 93, 95 et 96 | rectifiés par les seq 97 et 98, après mesure (grep du banc, ListAgents, décompte des oracles) | non | erreur de session, rattrapée avant la remise |

## Retours sur les documents produits

Ce lot ne contient aucun document produit depuis un gabarit de la bibliothèque.

## Documents mûrs

Ce lot ne contient aucun document mûr : aucun document n'a été repris 5 fois, et aucun lecteur n'a rendu de verdict.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **`run-oracles-design`** rend les mêmes comptes avant et après la correction : aucune régression de forme. Ces comptes servent de témoin sur un fichier de 440 Ko.
- **`allouer-indice.mjs`** a rendu l'indice « a » libre pour ce lot.
- **La garde `rm` sur une variable** a refusé une suppression dans le scratchpad avant toute exécution, avec le remède à suivre.

## Ordre recommandé

1. RD-1 : un texte faux reste à l'écran sans qu'aucun contrôle ne le voie. Le défaut existe dans tout produit qui affiche une version ou un environnement.
2. RT-29 : il aurait fait mobiliser la forge design à D-17. Il suffit de changer une question de la carte.
3. RT-30 : un verrou qui juge la demande d'une autre session ne garantit rien dès que 2 sessions travaillent sur le même produit.
4. RV-1, puis RT-31.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RD-1 et RT-29 viennent d'un retour humain : la capture d'écran du porteur, le 30/10/2026. Aucune règle existante ne les couvre. Selon la règle § 4 de quality-oracles, il faut donc définir un oracle nouveau : c'est la proposition de RD-1.

Classes proposées, chacune dans une famille existante de `todo/CLASSES.json` :

- **RD-1** : clé proposée `valeur-affichee-en-dur-divergente-de-sa-source`, famille `donnees-perissables-en-dur`. Libellé : « Une valeur affichée par l'application (version, environnement, date) est écrite en dur ou dérivée sans contrôle, et diverge de sa source sans qu'aucun oracle ne relise la page servie contre cette source ».
- **RT-29** : clé proposée `mobilisation-jugee-sur-fichiers-touches`, famille `skill-ou-oracle-non-invoque`. Libellé : « Une forge est écartée parce qu'aucun de ses fichiers n'est touché, alors que la demande change le sens ou la source de ce qu'elle juge ».
- **RT-30** : clé proposée `trace-de-mobilisation-partagee-entre-sessions`, famille `tracabilite-ledger`. Libellé : « Plusieurs sessions d'un même produit écrivent la même trace de mobilisation, et le verrou juge la dernière ligne, quelle que soit la session qui restitue ».
- **RV-1** : clé proposée `banc-de-tests-hors-format-non-reconnu`, famille `regle-morte`. Libellé : « Un adaptateur de couverture ne reconnaît qu'un format de test et déclare jamais exercé ce qu'un banc d'un autre format exerce à chaque fusion ».

La session a trouvé RT-30 et RV-1 en exécutant la mobilisation ; ils ne viennent pas d'un retour humain. RT-31 garde sa classe existante, `gabarit-famille-manquante`.
