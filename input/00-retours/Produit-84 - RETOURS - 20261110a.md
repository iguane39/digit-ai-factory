# Retours forges — Produit-84 — 20261110a

- **Contexte** : le 10/11/2026, la session `3c08d011` exécute A-32, A-33 et A-34 de la remédiation : schéma attendu enregistré, version v1.13.0 fusionnée et qualifiée, sauvegarde de `Produit-84-hpr` et restauration chronométrée.
- **Références ledger** : `forge\ledger.jsonl` seq 273, 274, 275, 277 et 278.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-10
- **Complétude** : 5 entrées `type: retour` écrites depuis le lot 20261109b (seq 273, 274, 275, 277 et 278), relues le 10/11/2026 dans `forge\ledger.jsonl`. Elles vont toutes les 5 au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **La restauration chronométrée** a échoué une fois : la copie portait des privilèges par défaut qu'un rôle réservé à Supabase est seul à pouvoir rejouer.
- **Le poste a ralenti** : un serveur local lancé la veille pour un banc tournait encore, et deux contrôles en ont souffert.
- **Deux décisions retirées** restent présentées au porteur comme en attente.
- **Une poussée** est partie dans la même commande qu'un contrôle qui rendait FAIL.

## digit-ai-forge-ops — restauration dans Supabase

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-15 | majeur | générique | **Une copie `pg_dump` ne se restaure pas telle quelle dans Supabase.** (1) Exécution 42784074400 du 10/11/2026 : `pg_restore --clean --single-transaction` des schémas `public` et `supabase_migrations` échoue sur « permission denied to change default privileges ». (2) La copie porte les privilèges par défaut de `supabase_admin` sur `public` ; le compte `postgres` n'est pas membre de ce rôle (`pg_auth_members` lu). (3) La transaction unique a laissé la base intacte. (4) Filtrer ces entrées du sommaire (`pg_restore --list`, puis `--use-list`) rend une restauration conforme en 52 s (exécution 42786008105). Ledger seq 278. | Mettre ce filtre dans le gabarit de restauration Supabase de forge-ops et inscrire la limite au registre des garde-fous de plateforme. Règle qui aurait évité le retour : aucune ; le gabarit ne connaît pas ce rôle. Classe : `garde-fou-plateforme-decouvert-au-deploiement`. |

## digit-ai-forge-websec — analyse des bibliothèques

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-16 | mineur | générique | **`oracle-sca` annonce « npm absent du poste » quand npm répond lentement.** (1) Le 10/11/2026, deux passages rendent SKIP avec cette cause, alors que npm 11.13.0 est installé. (2) `outilDisponible` lance `npm --version` avec un délai de 10 s ; une campagne forge_tests chargeait le poste. (3) Rejoué une fois le poste libéré, l'oracle rend PASS. Ledger seq 275. | Distinguer un délai dépassé (`ETIMEDOUT` : rejouer ou allonger) d'une absence (`ENOENT`), et nommer la vraie cause dans le manque. Règle qui aurait évité le retour : aucune. Classe : `oracle-faux-positif`. |

## digit-ai-forge-agents — serveurs de banc lancés en arrière-plan

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-17 | majeur | générique | **Un serveur local lancé pour un banc survit au tour et sature le poste.** (1) `wrangler pages dev`, lancé en arrière-plan le 09/11/2026 à 20:16 pour le banc d'accessibilité, tournait encore le 10/11. (2) Son `esbuild` avait consommé 25 880 s de processeur (MESURÉ par `Get-Process` à 10:38). (3) La campagne forge_tests, 2 minutes la veille, n'avait fini aucun pan après 15 minutes ; elle a repris dès l'arrêt du serveur et de 4 processus orphelins. Ledger seq 277. | Un banc qui lance un serveur l'arrête dans la même commande ; un contrôle de fin de tour liste les tâches d'arrière-plan encore actives. Règle qui aurait évité le retour : aucune. Classe proposée : `serveur-de-banc-orphelin`. |

## Factory (pilot) — décisions et remise

2 retours.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-59 | majeur | générique | **Une décision réservée puis retirée reste « en attente » pour S93.** (1) D-12 (seq 55, retirée seq 58) et D-178 (seq 228, retirée seq 231, remplacée par D-180) sont rappelées au porteur depuis le 29/10 et le 05/11. (2) `decisionsSansReponse` (`oracles\lib-decisions.mjs`) ne connaît qu'une sortie : une `reponse_humain` qui nomme la décision ; en écrire une serait faux, le porteur n'ayant jamais vu la question. (3) Trois autres, D-16, D-27 et D-172, avaient leur réponse sous un autre numéro et ont dû être rattachées à la main le 10/11. Ledger seq 273. | Un type de ledger `decision_retiree` (numéro, motif, remplaçante) que `decisionsSansReponse` traite comme une sortie ; un rattachement lu dans une réponse qui dit « D-N remplacée par D-M ». Règle qui aurait évité le retour : aucune. Classe proposée : `decision-retiree-rappelee-ouverte`. |
| RT-60 | majeur | générique | **3e occurrence de RT-58, sur une poussée cette fois.** (1) Le 10/11/2026, `check_markdown.py`, `git commit` et `git push` sont partis dans la même commande ; le contrôle rendait FAIL (M7 sur `docs/exploitation/restauration.md`, constat déjà présent avant la modification). (2) Corrigé, verdict PASS lu, puis poussé seul. Ledger seq 274. | La barrière de RT-58 doit couvrir tout geste de remise : copie au sas, commit, poussée. Règle qui aurait évité le retour : aucune barrière, seule la consigne écrite. Classe : `remise-sans-verdict`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune : chaque friction du tour est généralisable.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Nouveau garde-fou, décrit par RU-15 ; aucun identifiant GFP confirmé au registre :

- **Client** : Client-A (le pilot pseudonymise à l'accueil).
- **Plateforme** : Supabase, projet hébergé (Postgres 17).
- **Mécanisme** : le rôle `postgres` remis au client n'est pas membre de `supabase_admin` ; `ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin` lui est refusé.
- **Effet** : « permission denied to change default privileges » ; un `pg_restore` en transaction unique est annulé en entier.
- **Portée** : tout projet Supabase dans lequel on restaure une copie `pg_dump` du schéma `public`.
- **Ce qu'il vise** : protéger les privilèges par défaut posés par la plateforme elle-même.
- **Ce qu'il refuse** : de rejouer les entrées `DEFAULT ACL` de `supabase_admin` ; celles de `postgres` passent.
- **Date du relevé** : 10/11/2026, exécution 42784074400.

## Confirmations positives

- La transaction unique de `restauration.yml` a tenu sa promesse : après l'échec, les comptes de `Produit-84-hpr` étaient intacts.
- La chaîne de qualification a comparé pour la première fois le schéma réel de `Produit-84-hpr` au schéma attendu, et l'a jugé conforme.

## Ordre recommandé

1. RT-60 : 3e occurrence de la même classe, la barrière manque toujours.
2. RU-15 : tout produit qui restaure dans Supabase heurtera la même limite.
3. RU-17 : il fausse en silence les durées et les oracles suivants.
4. RT-59 : il présente au porteur des décisions qui n'existent pas.
5. RU-16 : un faux SKIP, levé en rejouant.
