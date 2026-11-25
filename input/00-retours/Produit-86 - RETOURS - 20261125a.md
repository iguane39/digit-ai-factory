# Retours forges — Produit-86 — 20261125a

- **Contexte** : run `20261125a-coordination-cdc-oracle-dast-040`. Produit-86 se coordonne avec la session de Produit-84 sur le lot 3 de sondes actives, aligne son contrat sur oracle-dast 0.4.0 et range les écarts de conformité de son dépôt.
- **Références ledger** : `forge\ledger.jsonl`, seq 1025 et 1036 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 25/11/2026 est `todo/CLASSES.json` du pilot.

- RP-73 se rattache à `exemption-hors-atteinte-par-le-chemin-prescrit` : la rectification par ajout que R-19 prescrit ne peut pas s'écrire par l'écrivain prescrit du ledger.
- RP-74 se rattache à `couverture-calculee-sur-enumeration-incomplete` : TF-2655 est clos alors que la moitié qui rend une API balayable n'est pas faite.

## digit-ai-factory (pilot)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-73 | majeur | générique | R-19 d'`oracles/oracle-conformite-projet.mjs` (ligne 1966) n'admet la rectification d'un `run_open` sans `run_precedent` que sous la forme `{type: "rectification_run_open", seq_vise, champ: "run_precedent", valeur, cause}`. Or `forge/ledger.py` (TF-2630) refuse tout champ nommé « champ » avant d'écrire. Mesuré le 25/11/2026 : `--champ run_precedent --valeur …` rend « `--champ` n'est pas un nom de champ », et rien n'est écrit. La forme que l'écrivain admet (seq 1023 : `champ_vise`, `run_precedent`) laisse R-19 en FAIL. Le produit n'a donc aucun remède. | Aligner R-19 sur un nom que l'écrivain admet (`champ_vise`, ou le champ rectifié porté sous son propre nom), puis dire ce nom dans le message du FAIL. Un test croisé joue l'exemple du message à travers `ledger.py --essai`. |

## digit-ai-forge-websec

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-74 | bloquant | générique | TF-2655 est clos « corrige » avec oracle-dast 0.4.0 (e82f961). Mais seule la moitié SKIP est faite : un rapport à 0 site rend bien `DAST-RIEN-EXPLORE`. En revanche, aucun départ d'une API n'est possible, ni par sa définition OpenAPI (`-openapiurl`, `-openapifile`) ni par une graine d'URL : `non_juge`, ligne 98. Sur l'API Supabase de Produit-84, la racine rend 404 sans lien, et la description OpenAPI a rendu 401 avec la clé `anon` (rapport du lot 1 de Produit-86, 10/11/2026). Le lot 3 de sondes actives ne peut donc rien explorer : chaque tir rendra SKIP. La fiche de sécurité de Produit-84 (`CDC-SEC-HPR-20261113a`) ne demande pas le GO Sécurité, faute de ce lot. | oracle-dast accepte une graine, sous l'une de deux formes : `--openapi-fichier <fichier local>` (ZAP `-openapifile`, avec pour cible l'origine autorisée), ou `--graine <fichier d'URL>`. Chaque URL est contrôlée contre l'origine et les exclusions de l'autorisation. Produit-86 sait produire l'une et l'autre depuis les attendus du mandat (tables et fonctions `rpc`). Réouvrir TF-2655 ou créer son successeur. |

## La règle qui aurait évité le retour

- `exemption-hors-atteinte-par-le-chemin-prescrit` (RP-73) : la forme de rectification qu'un oracle prescrit se joue à travers l'écrivain prescrit avant d'être publiée dans un message de FAIL.
- `couverture-calculee-sur-enumeration-incomplete` (RP-74) : un TF ne passe à « corrige » que si sa proposition est faite en entier, ou s'il est scindé, avec la part non faite rouverte sous un nouvel identifiant.

## Remarques restées au produit

| Réf. ledger | Gravité | Remarque | Motif du maintien au produit |
|---|---|---|---|
| ce lot | mineur | Sur ce poste, `uv run pytest` est refusé par la stratégie de contrôle d'application de Windows (os error 4551, `pytest.exe` bloqué). `uv run python -m pytest` passe. | Contrainte du poste, pas de la Factory. La commande du `CLAUDE.md` reste valable ailleurs. Généralisable : non. |
| ce lot | mineur | Le test de contrat E-154 attendait la synthèse d'oracle-dast 0.3.1. La 0.3.2 (fd2c608) ajoute la clé `formulaires`. Le test est aligné, 64 tests sur 64 passent. | Dérive de version suivie par le produit, comme prévu par son test de contrat. Généralisable : non. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests | 16 copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261109b, 20261112e, 20261112g, 20261112h et 20261113a) |
| Rapport de campagne du lot 2 (`output/Produit-86 - Rapport - Campagne du lot 2 sur l'API de Produit-84 - <date><indice>.md`) | 6 indices, 5 rangés sous `output/old/` le 25/11/2026 | reste au produit, parce que chaque indice suit une campagne rejouée sur une cible réelle et ne se généralise pas en gabarit |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucun refus de plateforme n'a été rencontré dans ce run.

## Confirmations positives

- La coordination entre sessions par message a tenu : Produit-84 a répondu aux 3 questions avec des faits datés, et a dit « non mesuré » là où son hook lui interdisait de lire son `.env`, au lieu de deviner.
- `scripts/renommer-livrable.mjs` a rangé 10 versions remplacées sous `output/old/`, chacune tracée au ledger (seq 1026 à 1035). R-7 bis passe.
