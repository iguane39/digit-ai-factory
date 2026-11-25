# Retours forges — Produit-12 — 20261123c

- **Contexte** : run — version 0.9.2, job des issues planifié et forme des brouillons de Claude (D-239 (b)), 23/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 468, 469, 470 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

La 0.9.2 est construite, auditée et passée au staging. Ses mesures contre Claude reviennent au porteur, parce que le garde-fou des fichiers d'environnement ne laisse plus la session passer une clé à un processus.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-55 | majeur | générique | Le hook `fichiers-env` (D-106 (b)) refuse tout code qui nomme un fichier d'environnement, même quand rien n'est affiché. Trois procédures du produit passent une clé à un processus par le chemin de son fichier : `evals/jouer_corpus.py` (`CLE_FICHIER`), `forge/etapes/mep/smoke_staging.py` (`SMOKE_CLE_FICHIER`) et le banc réel. Le 23/11, la session ne peut plus les jouer ; le 22/11, elle les jouait parce que le chemin était écrit dans un script et non dans la commande, ce que le hook ne voit pas. Le corpus, le banc des 15 mails réels et le pas « E-041 réel » de la 0.9.2 reviennent au porteur. Preuve : ledger seq 468 ; message de refus « un code de lecture de fichier nomme `.env.recette` » | Un geste du pilot lance une commande avec une valeur d'un fichier d'environnement dans son environnement, sans l'afficher ni la rendre (par exemple `scripts/avec-secret.mjs --env <fichier> --cle CLAUDE_CLE_API -- <commande>`), et le message de refus le cite |

## tests (`digit-ai-forge-tests`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-56 | mineur | générique | Deux constats « bloquants » semgrep `incomplete-sanitization` apparaissent le 23/11 sur `backend/app/assets_rapport/table-filters.js` l. 126-127. Le fichier n'a pas changé depuis `6660e50`, et le rapport du 22/11 ne les portait pas (101 constats contre 103). La ligne visée est un `replace(',', '.')` dont le résultat part à `parseFloat` pour trier une colonne : ce n'est pas un assainissement. Preuve : ledger seq 469 ; `forge/etapes/tests/rapport-20261123.json` contre `rapport-20261122c.json` | Le rapport dit qu'un constat est nouveau par la règle et non par le code (version des règles, dernier commit du fichier), et un `replace` suivi d'une conversion numérique n'est pas classé bloquant |

## development (`digit-ai-forge-development`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-57 | mineur | générique | La version servie se lit à deux endroits, `pyproject.toml` et la constante `VERSION` de `app/__init__.py`, et aucun test ne les compare. L'image 0.9.2 construite depuis `2eedc6b` répondait « 0.9.1 » sur `/sante` : vu au M-2 du staging seulement, après un audit complet et 1 475 tests verts. Preuve : ledger seq 470 ; correction et test de parité au commit `c0d8db2` | Le gabarit de produit Python lit la version à une seule source (`importlib.metadata.version`), ou livre un test de parité |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Playwright absent de l'environnement du backend pour `qualif_populee.py` | `uv run --with playwright==1.62.0`, la version dont les navigateurs sont installés au poste | non | déjà déclarée au lot 20261122g, propre à l'outillage du produit |
| Constante `VERSION` restée à 0.9.1 | corrigée et testée, commit `c0d8db2` | oui | remontée en RS-57 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres BERNARD | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres SAS CREER PROMOTION | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees BERNARD | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees SAS CREER PROMOTION | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Le healthcheck sur volume neuf du M-2 a prouvé, sur une instance servie, ce qu'aucun test ne montrait seul : les 5 jobs, dont celui des issues, sont passés par le planificateur au premier tick.

## Ordre recommandé

1. RS-55, parce qu'il renvoie au porteur toute mesure qui appelle un fournisseur d'IA réel, dans tous les produits qui suivent la même procédure.
2. RS-57, parce qu'une version mal annoncée fausse le contrôle après mise en production.
3. RS-56, parce qu'un faux bloquant entraîne à ignorer la classe des bloquants.

## La règle qui aurait évité le retour

- RS-55 : classe proposée, à créer au pilot : `garde-secret-sans-voie-vers-un-processus` (famille `hook-ou-gate`), pour un garde-fou qui interdit de lire un secret sans offrir de geste qui le transmette à un processus sans l'afficher.
- RS-56 : classe proposée, à créer au pilot : `constat-nouveau-par-la-regle-pas-par-le-code` (famille `contrat-interface-forge`), pour un constat d'outil qui apparaît sans changement du code jugé et que le rapport ne distingue pas.
- RS-57 : classe proposée, à créer au pilot : `version-servie-a-deux-sources` (famille `heritage-produit`), pour une version déclarée à deux endroits du gabarit, sans contrôle de parité.
