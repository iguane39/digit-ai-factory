# Retours forges — Produit-82 — 20261014b

- **Contexte** : fin de la phase P2 du brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`, arrêt obligatoire avant validation humaine.
- **Références ledger** : `forge\ledger.jsonl` seq 9, 14, 15, 16, 17, 18, 19 (seq 19 rectifie la classe de la seq 17)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-agents (`digit-ai-forge-agents`)

Les trois retours portent sur le lanceur `run-oracles.mjs` du skill `quality-oracles`, joué en gate P2 sur le dépôt `Produit-82/`.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | mineur | générique | Le 14/10/2026, `run-oracles.mjs Produit-82/ --profil digit-ai` rend la SCA en SKIP : « aucun manifeste (requirements.txt / package.json) détecté ». Le fichier `Produit-82/tests/requirements.txt` existe ; `oracle-sca.mjs Produit-82/tests` joué seul rend PASS. Ledger seq 14. | Chercher les manifestes dans les sous-dossiers (hors `node_modules`, `.venv`), ou écrire au SKIP que seule la racine est lue. |
| RA-2 | mineur | générique | Gitleaks (règle `generic-api-key`) signale 2 secrets dans `_oracles-journal.json` : ce sont des empreintes SHA-256 de fichiers, indexées par des chemins contenant `make_htpasswd` et `masquer_secrets`. Le journal rangé comme preuve sous `forge\etapes\p2\` rend donc rouge `oracle-secrets`. Ledger seq 15. | Exclure les journaux d'oracles de la passe gitleaks, ou préfixer les empreintes par `sha256:`. |
| RA-3 | mineur | générique | Sur un dossier qui porte un `.env` ignoré par git, un `htpasswd` et la sortie de `docker compose config`, `run-oracles` rend FAIL secrets. Il juge le disque et non le contenu versionné. Rien ne signale non plus que `docker compose config` recopie en clair les variables de `env_file`. Ledger seq 16. | Une option qui ne juge que `git ls-files -co --exclude-standard`, et une mention au registre sur `docker compose config`. |

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-5 | mineur | générique | Le `.gitignore` socle ignore `*.oracles.json` et `.oracles/`, mais pas `_oracles-journal.json` ni `_oracles-journal-historique.jsonl`, que `run-oracles` écrit à la racine d'un dossier jugé. Les deux sont apparus dans `git status` sous `Produit-82/`. Ledger seq 17, classe rectifiée en seq 19. **RT-5** : clé proposée `artefact-d-oracle-hors-gitignore-socle`. | Ajouter `_oracles-journal*.json*` au gabarit `gitignore-produit`. |
| RT-6 | mineur | générique | Le gabarit `gd-fiche-produit` 1.0.0 impose huit chapitres. Le brief humain impose dix sections, dont l'architecture en Mermaid, le modèle de déploiement et un tableau EF/ENF à colonne « couverture » (`natif`, `configuration`, `extension`, `à développer`), sans équivalent au gabarit. Conflit consigné au ledger seq 9 ; seq 18. | Une variante « fiche produit d'offre technique », ou des chapitres optionnels déclarés au gabarit. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `docker compose config` recopie les clés des tenants en clair dans la preuve remise | `scripts/masquer_secrets.py` filtre la sortie, cible `make config` | oui | remonté sous RA-3 |
| Un commentaire YAML contenant le texte littéral dollar-accolades faisait échouer le démarrage de la passerelle : agentgateway développe les variables sur tout le fichier, commentaires compris (`crates/agentgateway/src/config.rs` l.39) | commentaire réécrit sans la syntaxe | non | comportement amont, consigné en découverte hors périmètre de la restitution |
| Une clé API avec budget exige `metadata.name`, ce que `schema/config.md` ne dit pas (`crates/agentgateway/src/http/apikey.rs` l.511) | `name` ajouté aux trois clés | non | comportement amont, consigné en découverte hors périmètre |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Digit-AI - Fiche Produit Produit-82 - Specification - 20261014a.md` | gd-fiche-produit · 1.0.0 | chapitres architecture, déploiement, fournisseurs, risques ; colonne couverture | aucun retour du lecteur à ce jour | les dix sections du brief, recomptage des totaux par script | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `oracle-gabarits-documents.mjs` (G6) a jugé la fiche de conception au premier essai et dit précisément ce qu'il ne juge pas.
- `check_markdown.py` (M7, M10) a trouvé sept chapitres ouverts par un tableau nu, sur deux documents ; corrigés en une passe.
- `oracle-sca.mjs`, joué seul sur `Produit-82/tests`, a rendu PASS sur quatre dépendances épinglées.

## Ordre recommandé

1. RA-3 : un gate de secrets qui juge le disque pousse à ranger les preuves ailleurs que là où elles servent.
2. RA-2 puis RT-5 : ils ferment deux bruits qui suivent RA-3.
3. RA-1, puis RT-6.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain ; tous viennent des gates de P1 et de P2. Une classe est proposée. **RT-5** : `artefact-d-oracle-hors-gitignore-socle`, famille `heritage-produit`, libellé « Un outil de la forge écrit un artefact d'atelier dans l'arbre d'un produit, et le gitignore socle hérité ne le couvre pas ».
