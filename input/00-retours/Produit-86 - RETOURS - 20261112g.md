# Retours forges — Produit-86 — 20261112g

- **Contexte** : run `20261112a-comptes-et-ecritures`, campagne du lot 2 rejouée jusqu'à couvrir les 138 attendus de Produit-84, et rapport livré.
- **Références ledger** : `forge\ledger.jsonl` seq 981 et 982 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 12/11/2026 est `todo/CLASSES.json` du pilot.

- RP-68 se rattache à `artefact-d-oracle-hors-gitignore-socle` : le gitignore socle hérité ne couvre pas un artefact d'atelier écrit sous `forge\`.
- RP-69 se rattache à `outil-qui-ecrit-sur-son-option-d-aide` : l'écrivain du ledger écrit une entrée là où il devrait refuser un appel mal formé.

## digit-ai-factory (gabarits)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-68 | mineur | générique | Le gabarit `gabarits/gitignore-produit`, instancié en `.gitignore` de Produit-86, exclut `__pycache__/` (ligne 58), puis finit par `!forge/**` (ligne 83). En gitignore, le dernier motif l'emporte : un cache Python écrit sous `forge/` redevient suivi. Mesuré le 12/11/2026 : `git check-ignore -v forge/zz_essai/__pycache__/x.pyc` rend `.gitignore:83:!forge/**`, et `git status` le liste en `??`. Cause du jour : un test importait `forge/etapes/conception/referentiel_source.py`. | Répéter après `!forge/**` les exclusions `forge/**/__pycache__/` et `forge/**/*.pyc`, comme le gabarit le fait déjà pour `forge/**/.env*`. |
| RP-69 | mineur | générique | Le gabarit `forge/ledger.py` affiche l'usage `python forge/ledger.py <type> --champ valeur ...`. Un appel `--champ clé=valeur` répété a écrit la seq 976 avec un seul champ, nommé « champ », sans run, oracle ni verdict, et a rendu le code 0. L'entrée amputée n'a été vue qu'en relisant la confirmation ; la seq 977 l'annule et la remplace. | Refuser un champ nommé `champ`, ou une entrée `oracles_verdict` sans `oracle` ni `verdict`, et donner dans l'aide un exemple réel : `--oracle smoke --verdict PASS`. |

## La règle qui aurait évité le retour

- `artefact-d-oracle-hors-gitignore-socle` (RP-68) : toute ré-inclusion large du gitignore socle répète après elle les exclusions d'atelier.
- `outil-qui-ecrit-sur-son-option-d-aide` (RP-69) : un écrivain de registre refuse un appel qui ne porte pas les champs obligatoires de son type, au lieu d'écrire une entrée.

## Remarques restées au produit

| Réf. ledger | Gravité | Remarque | Motif du maintien au produit |
|---|---|---|---|
| seq 979 | mineur | L'outil du lot 2 appelle 3 fonctions de Produit-84 sans paramètre, et 18 attendus restent « non jugés » (404). | Évolution de l'outil du produit, sans règle de forge en cause. Généralisable : non. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261109b et 20261112e) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucun refus de plateforme n'a été heurté sur ce lot. Les droits d'exécution que Supabase accorde d'office aux fonctions du schéma `public` concernent Produit-84, et sont portés par le rapport du lot 2 (§ 4), pas par une forge.

## Confirmations positives

- La reprise de couverture d'un job à l'autre a couvert les 138 attendus en 4 jobs, chacun jugé une fois, sans nouvelle signature du mandat.
