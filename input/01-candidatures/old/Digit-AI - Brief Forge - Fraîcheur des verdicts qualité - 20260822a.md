# Brief d'exécution — Fraîcheur des verdicts de `quality-oracles`

**Date** : 22/08/2026 · **Exécutant** : Claude Code (un seul) · **Remplace** : aucune

**Documents de référence, à l'itération exacte :**

| Référence | Itération retenue | Vérifié par |
|---|---|---|
| Skill `quality-oracles` installé | v2.6.1 (`SKILL.md` l.16) | lecture le 22/08/2026 |
| `scripts/run-oracles.mjs` | 216 lignes, tel qu'installé au 22/08/2026 | lecture intégrale |
| Dépôt `iguane39/digit-ai-forge-ops` | commit `f10e39d` (17/08/2026) | clone + lecture `scripts/ops.mjs`, `oracles/oracle-ops.mjs` |
| Dépôt `iguane39/digit-ai-forge-pilot` | commit `2a3d0ee` (22/08/2026) | clone + lecture registres `todo/` |
| Dépôt externe `garrytan/gstack` | commit `85fd9db`, v1.68.3.0 (21/08/2026) | clone + lecture `bin/gstack-evidence` (445 l.), `bin/gstack-wtree` (50 l.), `ship/SKILL.md` |

Aucune itération antérieure exclue : première itération de ce chantier.

**Source externe déclarée comme barre, non comme gabarit à copier** : `gstack-evidence` fournit
trois idées de conception (capture avant/après, liaison commande, notation à motif). Son
implémentation dépend de git et n'est pas transposable telle quelle — voir D3.

---

## 1. Contexte & objectif

Aucun verdict rendu par `run-oracles` ne dit sur **quel contenu** il a été rendu. Le journal
`<cible>.oracles.json` et l'historique `*-historique.jsonl` enregistrent le verdict, le profil,
le niveau et les échecs, jamais une empreinte du livrable jugé. Conséquence : un « CONFORME »
cité dans une restitution n'est ni re-vérifiable ni invalidable — il vieillit en silence pendant
que le fichier change.

Objectif : rendre chaque verdict **daté du contenu** et fournir un verbe qui note sa fraîcheur.
Le chantier ne modifie ni la grille de défauts, ni le registre, ni aucun oracle du pool.

## 2. Décisions actées

| # | Décision | Source |
|---|---|---|
| D1 | Ne construire **aucun** mécanisme d'empreinte neuf. Réutiliser le format existant `forge-ops/empreinte@1` — `{format, release, ts, fichiers:{chemin: sha256}}` | `digit-ai-forge-ops`, `scripts/ops.mjs` fonction `scellerEmpreinte` (l.86-93), commit `f10e39d` |
| D2 | Le hachage de contenu **existe déjà** dans `run-oracles.mjs` (`hashOf`, l.86-87, sha256 tronqué à 16 hex, servant la clé de cache l.88-92) mais n'est **jamais persisté** : ni dans le journal (l.196), ni dans l'historique (l.200). Le patch consiste à l'écrire, pas à le créer | lecture de `run-oracles.mjs` le 22/08/2026 |
| D3 | Le sha256 est calculé **complet** (non tronqué) dans l'empreinte persistée, pour rester lisible par `oracle-ops --empreinte`. La troncature à 16 reste réservée à la clé de cache | `oracle-ops.mjs` l.170-186 : le lecteur ne consomme que `empreinte.fichiers`, comparé par hachage complet |
| D4 | Granularité = **map chemin → sha256**, jamais un hash d'arbre unique. Un hash unique ne dit pas *quel* fichier a bougé ; la map rend des constats localisants, conformes au contrat de findings du standard §3 | `oracle-ops.mjs` l.183-186 (constats par fichier) |
| D5 | Le champ `release` de `empreinte@1` porte le chemin de la cible jugée. Le format n'est **pas** modifié : un lecteur `empreinte@1` existant reste compatible | vérifié par lecture : `oracle-ops.mjs` l.170 ne lit que `fichiers` |
| D6 | Capture de l'empreinte **avant et après** chaque exécution d'oracle ; divergence → empreinte omise du dossier + motif écrit → notée PÉRIMÉ, jamais FRAIS | `gstack-evidence` l.293-301, garde TOCTOU : « never certifying content the suite never ran » |
| D7 | Le verbe de notation prend un `--attendu` contenant la commande exacte attendue, comparée par sha256 | `gstack-evidence` `--expect-cmd`, l.385-388 |
| D8 | **PÉRIMÉ bloquant ou consultatif ?** — **à arbitrer**. Chez gstack le contrôle est consultatif (`ship/SKILL.md` l.1319 : « a failed CHECK never blocks; a failed RUN does »), la doctrine de la forge est plus dure (le gate d'écriture `qo-gate-write.mjs` bloque). **Bloque P4** | non tranché au 22/08/2026 |
| D9 | Le **format d'empreinte partagé** à l'échelle de l'écosystème n'est pas l'objet de ce brief : il fait l'objet d'une candidature séparée au registre du pilot. Ici, on consomme `empreinte@1` sans le toucher | candidature `candidature-empreinte-format-partage.tf.jsonl` du 22/08/2026 |

## 3. Prérequis

- Skill `quality-oracles` v2.6.1 installé — vérification : `grep 'version' /mnt/skills/user/quality-oracles/SKILL.md` renvoie `2.6.1`. Une autre version : **arrêt**, les numéros de ligne de D2 ne tiennent plus.
- Node exécutable — vérification : `node --version` renvoie une version ≥ 18 (le script utilise `node:crypto`, `node:fs`, top-level await absent).
- Lecture du dépôt `iguane39/digit-ai-forge-ops` — vérification : `git clone --depth 1 https://github.com/iguane39/digit-ai-forge-ops.git` réussit et `scripts/ops.mjs` contient `forge-ops/empreinte@1`.
- **Baseline anti-régression figée avant toute écriture** — vérification : `node /mnt/skills/user/quality-oracles/scripts/self-test.mjs` sort en 0 ; le **nombre de contrôles PASS est relevé et consigné** dans la restitution. Sans ce nombre, aucune phase ne démarre.

## 4. Plan phasé

| Phase | Contenu | Critère de sortie (binaire) |
|---|---|---|
| **P0** | Figer la baseline : self-test de `quality-oracles`, nombre de contrôles PASS relevé. Copier `run-oracles.mjs` en `run-oracles.mjs.baseline` hors arborescence du skill | `self-test.mjs` exit 0 **et** le nombre de contrôles est écrit dans la restitution |
| **P1** | Persister l'empreinte. Écrire dans le journal `<cible>.oracles.json` et dans chaque ligne d'historique un champ `empreinte = {format:"forge-ops/empreinte@1", release:<chemin cible>, ts, fichiers:{rel: sha256 complet}}`. Aucun autre champ du journal n'est modifié ni réordonné | Sur une cible **fichier** et une cible **dossier** : `empreinte.format === "forge-ops/empreinte@1"` **et** `Object.keys(empreinte.fichiers).length` égale le nombre de fichiers de `bilan_fichiers` (somme des 4 états) **et** `self-test.mjs` exit 0 avec le **même** nombre de contrôles qu'en P0 |
| **P2** | Garde TOCTOU. Capturer l'empreinte avant et après la passe d'oracles ; si elle diverge, **omettre** `empreinte` du journal et écrire `empreinte_absente_motif: "contenu modifié pendant la passe"`. Le verdict lui-même n'est pas altéré | Paire de fixtures **exécutée** : (rouge) un fichier de la cible est modifié pendant la passe → `empreinte` absente **et** `empreinte_absente_motif` présent ; (verte) contenu stable → `empreinte` présente. Les deux rejouées, sorties collées |
| **P3** | Verbe de notation : `node run-oracles.mjs <cible> --fraicheur [--attendu <commande>] [--age-max <h>] [--tolere <csv de chemins>]`. Lit le dernier enregistrement d'historique et rend **FRAIS / PÉRIMÉ / ABSENT** sur stdout au contrat JSON du standard §3 (exit 0/1/2), en lecture seule | Les **6 motifs** de PÉRIMÉ ont chacun leur fixture rejouée : verdict enregistré ≠ PASS · au-delà de `--age-max` · `--attendu` ne correspond pas · empreinte absente · empreinte malformée · un fichier hors `--tolere` a changé. **Plus** : mutation règle par règle — chaque motif cassé seul sur la fixture verte doit faire basculer le verdict. 6/6 fixtures + 6/6 mutations |
| **P4** | Branchement de la loi : PÉRIMÉ interdit la citation d'un CONFORME en restitution | **BLOQUÉE par D8.** Ne pas démarrer. Si D8 est tranché en cours de chantier, le critère devient : une restitution citant un verdict PÉRIMÉ est refusée par le gate, prouvé par une fixture rouge |

P1 → P2 → P3 sont séquentielles (P2 modifie ce que P1 écrit, P3 lit ce que P2 produit). P4 est bloquée.

## 5. Gates de validation

- **Par phase** : le critère binaire du §4, prouvé par exécution réelle. Une sortie collée, jamais résumée.
- **P1, P2, P3** : `node /mnt/skills/user/quality-oracles/scripts/self-test.mjs` rejoué après chaque phase — le nombre de contrôles PASS doit être **identique ou supérieur** à la baseline P0. Inférieur = régression, la phase est reprise.
- **Final** : `node run-oracles.mjs <fichiers modifiés> --profil digit-ai` → verdict CONFORME exigé. Un FAIL se corrige, ne se contourne pas.
- **Fixtures** : chaque paire rouge/verte est **exécutée**, jamais décrite. Un outil absent donne un SKIP motivé, jamais un verdict simulé.
- **Mutation (P3)** : la paire rouge/verte ne prouve que le tout ; seule la mutation motif par motif prouve que chaque contrôle sait échouer.

## 6. Écarts

**Zones interdites de modification :**

- Le **cache par hash** (`cacheKey`, l.88-92, `cachePath`, `.oracles-cache.json`). Cache et empreinte partagent le hachage mais servent deux buts opposés : le cache **évite** de rejouer, l'empreinte **invalide**. Les confondre casserait les deux. Le cache reste tronqué à 16, l'empreinte est complète.
- Le format `forge-ops/empreinte@1` et le dépôt `digit-ai-forge-ops` — ce chantier est **consommateur**, pas propriétaire.
- Le registre d'oracles, la grille de classes de défaut, les profils, tout oracle du pool.
- Les 7 items archivés de la classe empreinte (TF-0072, TF-0247, TF-0253, TF-0288, TF-0294, TF-0298, TF-0338) : ne rien y rouvrir.

**Écarts autorisés, à documenter** : le nom exact du verbe (`--fraicheur` ou autre) et les noms de drapeaux, si une collision avec un drapeau existant est constatée — la collision et le choix sont écrits dans la restitution.

**Découvertes hors périmètre** : à **lister et remonter** dans la restitution, jamais à corriger dans ce chantier.

## 7. Restitution

Livrables attendus :

1. `run-oracles.mjs` modifié, plus les fixtures de P2 et P3 rangées sous `fixtures/`.
2. Un compte rendu nommé `Digit-AI - Restitution Forge - Fraîcheur des verdicts qualité - {AAAAMMJJ}{x}.md` contenant :
   - le nombre de contrôles PASS de la baseline P0 et de chaque rejeu ;
   - les sorties **collées** des critères binaires de P1, P2, P3 ;
   - le résultat de la mutation 6/6 de P3, motif par motif ;
   - la sortie de `run-oracles` final ;
   - les écarts documentés et les découvertes hors périmètre remontées ;
   - l'état de P4 (bloquée) et le rappel que D8 attend un arbitrage.

Points nécessitant un arbitrage retour : **D8** (PÉRIMÉ bloquant ou consultatif) — bloque P4 et rien d'autre.
