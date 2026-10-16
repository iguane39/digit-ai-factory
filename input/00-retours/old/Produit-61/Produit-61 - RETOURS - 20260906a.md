# Retours forges — Produit-61 — 20260906a

- **Contexte** : retour humain après la clôture du run 20260905a (premier essai de la qualif par le commanditaire)
- **Références ledger** : `forge\ledger.jsonl` seq 82 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-06

Ce lot porte un seul retour, humain, qui a failli coûter un secret commité. Il se lit en une section : le fait, sa preuve, la règle qui manque.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le commanditaire a voulu tester la lecture d'ardoise avec sa propre clé et n'a trouvé aucun fichier local pour la poser.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-3 | bloquant | générique | Le 06/09, l'humain a saisi la clé Anthropic dans `.env.example` (versionné) parce qu'aucun `.env` local n'existait ; il pensait que la factory exigeait un `.env` créé d'office avec les valeurs attendues. `git diff --stat .env.example` : 1 ligne modifiée, clé de 108 caractères préfixée `sk-ant-`. REGLES-PROJET R-13, R-14, R-15 exigent `.env.example` exhaustif, `.env` gitignoré et `# à fournir`, mais aucune règle ne prescrit la création du `.env` local ni la documentation de son chargement (`uv run --env-file`). Ledger seq 82. | à l'ouverture du run : créer `.env` (copie de `.env.example`, valeurs `# à fournir` vides) déjà gitignoré, documenter la commande de lancement avec `--env-file` dans COMMANDES.md et CLAUDE.md ; étendre l'oracle R-14 pour refuser un `.env.example` dont une variable `# à fournir` porte une valeur non vide |

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec le verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Aucun `.env` local, commandes de lancement sans chargement de variables | `.env` créé à la racine (gitignoré), `.env.example` restauré à sa version commitée, `--env-file ../.env` dans CLAUDE.md, COMMANDES.md, README.md et la configuration d'audit | oui | remonté ci-dessus, RP-3 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot. Vérifié par le pilot du run, le 06/09/2026.

## Confirmations positives

- Le `.gitignore` du socle (R-10, R-14) a bien exclu le `.env` créé : `git check-ignore .env` le confirme, le secret n'est jamais entré dans l'index.
- La pose d'une variable et le redéploiement de qualif par l'API Railway (`variableUpsert`, `serviceInstanceRedeploy`) ont tenu sans geste manuel.

## Ordre recommandé

1. RP-3 : deux lignes de gabarit d'ouverture et un contrôle d'oracle évitent un secret commité.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit un retour humain. Aucune règle existante du socle ne couvre la création du `.env` local ni le contrôle qu'un `.env.example` reste vide de secrets ; la classe la plus proche du référentiel est `surface-implicite-non-livree` (une attente implicite du commanditaire que le socle ne livre pas), et le pilot est invité à créer la classe « secret saisi dans le fichier d'exemple ».
