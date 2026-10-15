# Retours forges — Produit-82 — 20261014c

- **Contexte** : fin de la phase P3 du brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 27, 30 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-agents (`digit-ai-forge-agents`)

Le retour porte sur `oracle-sast.mjs` du skill `quality-oracles`, joué en gate P3 par `run-oracles` sur le dépôt `Produit-82/`.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-4 | mineur | générique | Le 14/10/2026, `oracle-sast.mjs` (ligne 45) accuse « injection SQL : chaîne concaténée/formatée dans execute() » sur `conn.execute("… ANY(%s)", (ids,))` dans `Produit-82/extensions/retention/purge.py` lignes 39 et 40. Le marqueur `%s` de psycopg est un paramètre lié, pas un formatage. Réécrire en paramètres nommés `%(ids)s` a suffi à rendre PASS, sans rien changer à la sûreté. Ledger seq 30. | Ne pas accuser `%s` ni `%(nom)s` quand `execute()` reçoit un second argument de paramètres. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `export.py` composait sa requête par une f-string pour un filtre optionnel, valeurs liées | requête statique `(%(client)s::text IS NULL OR …)` | non | l'oracle a jugé juste sur la forme ; rien à remonter |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Digit-AI - Fiche Produit Produit-82 - Specification - 20261014b.md` | gd-fiche-produit · 1.0.0 | un état « tranché » des arbitrages, distinct d'« ouvert » | aucun retour du lecteur à ce jour | colonne État avec date de décision, ligne D8 bis | générique, déjà remonté sous RT-6 |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Nouveau garde-fou, relevé avant tout déploiement :

- plateforme : Railway, hébergement retenu le 14/10/2026 (décision D8) ;
- mécanisme : stockage des journaux de la plateforme, indépendant de la région choisie ;
- effet : contrainte de résidence ; les journaux applicatifs, de déploiement et HTTP partent en US West ;
- portée : tout service déployé sur Railway, y compris en région EU West (Amsterdam) ;
- ce qu'il vise : la centralisation des journaux de la plateforme ;
- ce qu'il refuse : tout engagement contractuel de résidence des données dans l'Union européenne, sur aucun plan ;
- date du relevé : 14/10/2026, réponses publiques du support Railway sur station.railway.com ; ledger seq 28.

## Confirmations positives

- Le webhook de garde-fous d'agentgateway v1.6.0 a accepté le masquage au premier essai, sur le protocole lu dans `llm/policy/webhook.rs`.
- `oracle-sca.mjs` a de nouveau rendu PASS sur les dépendances épinglées des tests.

## Ordre recommandé

1. RA-4 : un faux positif bloquant pousse à réécrire du code sûr pour faire taire l'oracle.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain. RA-4 relève de la classe existante `oracle-faux-positif` : aucune classe neuve n'est proposée.
