# Règles projet — proposition à décision

2026-08-06. **Rien n'est appliqué avant décision humaine.** Chaque règle est une ligne : coche,
écarte, ou amende (« toutes sauf n° X, Y » fonctionne). Énoncés binaires — ils deviendront
l'oracle « conformité projet » au 2e mandat.

Sources : inventaire exécuté sur 11 dépôts (6 forges, produit pilote MiniVeille, Produit-12
— produit forge réel —, ASDMailManager, Produit-02.com, Transcript, BeefProject).
Annexe d'inventaire en fin de document. Mécanismes : **P0** = créé par la phase 0 du prompt
produit · **S** = vérifié par le steering à l'ouverture de run · **O** = oracle conformité
projet (2e mandat) · **G** = gate humain.

## A. Structure de dossiers

| n° | Règle (binaire) | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 1 | `input\` existe à la racine ; tout entrant fourni par l'humain y vit | observée 7/11 (forges, Produit-12, Transcript…) | tous projets, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 2 | `output\` existe ; tout livrable généré destiné à l'humain y vit (rapports, PV, exports) | observée 3/11 (`digit-ai-forge-agents/output/`, Transcript, BeefProject) | tous, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 3 | `docs\` pour la documentation pérenne du produit (hors run) | observée 3/11 (development, tests, Produit-02) | produits, nouveaux | P0 | nul | option |
| — | `forge\` (ledger, étapes) : **déjà acté** au contrat d'interface §2, pour mémoire | Produit-12/forge/ | — | — | — | déjà appliqué |

## B. Nommage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 4 | Tout livrable documentaire est nommé `<Marque> - <Objet> - AAAAMMJJ<indice>.<ext>` (ex. `Digit-AI - PV Forge - … - 20260723a.md`) | observée massivement (14 fichiers agents, 7 tests, 2 conception…) | **livrables uniquement** (input\, output\, docs\) — JAMAIS le code (conflit C3) | S+O | faible | **défaut** |
| 5 | L'indice est une lettre (a, b, c…) par itération du même jour ; une nouvelle version = un **nouveau fichier daté**, jamais d'écrasement | observée (`20260721b` → `20260721d`, `revue.md`/`revue-v2`) | livrables uniquement | S+O | faible | **défaut** |

## C. Versions et git

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 6 | Le code n'a qu'un magasin de versions : git. Aucune copie datée ni dossier `Old\` pour du code | générique (standard) + état de l'écosystème (6 dépôts git) | tous | O | nul | **défaut** |
| 7 | Quand un livrable documentaire est remplacé par une version plus récente, l'ancien migre dans `Old\` du même dossier (lisibilité du dossier courant — pas un magasin de versions) | **citée par toi** ; observée 1/30+ (`OptimAssur/old`) | livrables uniquement | S+O | faible | option (conflit C1) |
| 8 | Tout nouveau produit est `git init` à l'ouverture du run, avec commit initial + commits par étape (le **push/remote reste sur ton GO**) | gap constaté : Produit-12 sans git | produits, nouveaux | P0 | nul | **défaut** (conflit C2) |
| 9 | Commits en Conventional Commits français | observée (development 116 commits, campagnes forges) | tous dépôts git | S | nul | **défaut** |
| 10 | `.gitignore` socle dès la création : `.env`, `.venv/`, `__pycache__/`, `node_modules/`, `generated/`, artefacts de build | observée (9/11) | tous | P0+O | nul | **défaut** |

## D. Documentation du produit

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 11 | Chaque produit naît avec un `CLAUDE.md` : quoi, commandes (build/test/run), conventions locales, pointeur vers `forge\ledger.jsonl` et la reprise | observée 11 projets maison (`AOFR`, `DPGFast`, `DriveOps`…) ; **absente du produit forge réel** | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 12 | Chaque produit naît avec un `README.md` minimal : une phrase de quoi, 2 commandes de démarrage, lien CLAUDE.md | observée 8/11 ; absente d'Produit-12 | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |

## E. Environnements et configuration

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 13 | `.env.example` versionné et **exhaustif** : toutes les variables attendues — applicatives ET infra (ports, URLs, cible de déploiement, drapeaux `*_MODE_DEMO`) — valeurs par défaut sûres ou vides, en-tête « ne jamais renseigner de secret ici » | observée (design, tests, ASDMailManager, Produit-02 — en-tête littéral constaté) | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 14 | `.env` réel toujours gitignoré ; aucun secret committé, jamais | observée partout + loi steering existante | tous | O | nul | **défaut** (quasi-loi déjà) |
| 15 | Les variables que la forge ne peut pas renseigner (clés tierces, identifiants) portent un commentaire `# à fournir :` dans `.env.example` — elles alimentent directement les `non_testables[]` de l'étape qualif (RT-6) | générique, prolonge RT-6 | produits | P0+S | faible | **défaut** |

## F. Livrables et archivage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 16 | Les rapports finaux destinés à l'humain (DOSSIER-MEP, PV, revues) sont **copiés** dans `output\` au nommage daté (n° 4) — l'original de travail reste sous `forge\etapes\` | cohérence avec `digit-ai-forge-agents/output/` | produits | S | faible | **défaut** |
| 17 | Les journaux d'oracles (`*.oracles.json`, `*.oracles-historique.jsonl`) sont versionnés dans `forge\` (ce sont des preuves), ignorés partout ailleurs | observée : présents dans Produit-12/forge/ | produits | P0 (.gitignore) | nul | option (conflit C4) |

## Conflits à trancher (ta décision explicite)

- **C1 — `Old\` vs git (n° 6/7)** : deux magasins de versions divergent toujours. Proposition :
  git seul pour le code (n° 6) ; `Old\` réservé aux **livrables documentaires** comme rangement
  de lisibilité (les versions datées coexistent, `Old\` désencombre le dossier courant — git
  garde l'histoire de toute façon). Alternatives : (a) git seul partout, jamais d'`Old\` ;
  (b) la proposition ci-dessus ; (c) `Old\` seulement hors dépôts git. **Recommandé : (b).**
- **C2 — n° 8 vs garde-fou actuel** : le CLAUDE.md steering dit aujourd'hui « création du dépôt
  git du produit sur validation humaine ». La règle 8 inverserait : init + commits **locaux**
  par défaut (traçabilité dès la naissance), seuls remote/push restant sur ton GO. **Recommandé :
  adopter la règle 8** (le commit local est réversible, l'absence d'historique ne l'est pas).
- **C3 — nommage daté et code** : `main.py` ne s'appellera jamais `Digit-AI - main - 20260806a.py`.
  La règle 4 est scopée livrables ; le code suit les conventions de son langage. À confirmer.
- **C4 — journaux d'oracles** : versionnés = dossiers `forge\` chargés mais preuves rejouables ;
  ignorés = léger mais preuves perdues au clone. **Recommandé : versionnés (n° 17).**

## Après ta décision (2e mandat, non anticipé)

Les règles retenues s'encoderont dans : la **phase 0 de PROMPT-PRODUIT.md** (création du socle
P0), le **CLAUDE.md steering** (vérifications S, y compris rattrapage en run de version), et un
**oracle « conformité projet »** exécutable (contrôles O, binaires — le n° de règle devient le
n° de finding). Rattrapage des projets existants : appliqué au prochain run de version de
chaque produit, jamais en masse silencieuse.

---

## Annexe — inventaire (preuves)

| Dépôt | CLAUDE.md | README | .env.example | input\ | output\ | Old\ | git | fichiers datés |
|---|---|---|---|---|---|---|---|---|
| steering | ✔ | ✔ | — | ✔ | — | — | ✔ | 0 |
| conception | — | ✔ | — | — | — | — | ✔ | 2 |
| design | — | ✔ | ✔ | ✔ | — | — | ✔ | 1 |
| development | — | ✔ | — | ✔ | — | — | ✔ | 1 |
| tests | — | ✔ | ✔ | — | — | — | ✔ | 7 |
| agents | — | ✔ | — | ✔ | ✔ | — | ✔ | 14 |
| **Produit-12** (produit forge) | **—** | **—** | — | ✔ | — | — | **—** | 0 |
| ASDMailManager | — | ✔ | ✔ | ✔ | — | — | ✔ | 2 |
| Produit-02.com | — | ✔ | ✔ | ✔ | — | — | ✔ | 0 |
| Transcript | — | — | — | ✔ | ✔ | — | — | 0 |
| BeefProject | — | — | — | ✔ | ✔ | — | — | 2 |

`Old\` : une seule occurrence sur tout `c:\dev` (`OptimAssur/old`). CLAUDE.md : 13 occurrences
sur `c:\dev` (11 projets maison + steering + inZM), zéro dans les produits forge. Nommage daté :
motif `<Marque> - <Objet> - AAAAMMJJ<lettre>` vérifié sur 25+ fichiers, exclusivement documentaires.
