---
type: diagnostic
destinataire: humain
date: 2026-11-14
gabarit: aucun (livrable ad hoc, étape 1 du mandat)
---

# Diagnostic Factory — Sessions concurrentes sur forge-digit-ai-fr — 20261114b

## Méthode de mesure

`ListAgents` est absent de cette session (outil non chargé, erreur « No matching deferred tools found »). Le compte des sessions repose sur une **inférence** : les fichiers de transcription `.jsonl` du projet Claude Code `c--dev-forge-digit-ai-fr`, modifiés depuis moins de 8 heures au 14/11/2026 à 17:00 UTC+1. Ce repli ne voit que les sessions de CE poste (DESKTOP-ULTRA7) ; les sessions d'un autre poste (Dell-XPS-16) et les sessions cloud sont invisibles.

Cinq fichiers de transcription principale trouvés, chacun avec ses sous-agents. Trois ont été modifiés depuis moins de 30 minutes au moment du relevé (16:53, 16:51, 16:46) et sont présumés actifs. Deux sont terminés (14:43 et 08:34).

## Tableau des sessions

Le tableau ci-dessous répond à la question : qui fait quoi sur ce produit en ce moment, et quels fichiers se recoupent ? Chaque ligne est une session identifiée par son UUID de transcription. L'objet de travail cite la dernière demande humaine horodatée ; les fichiers sont ceux écrits dans le dépôt du produit (pas dans le scratchpad) ; les D-N sont les décisions réservées par cette session au registre pilot ou au ledger produit.

| # | UUID court | Plage horaire (UTC+1) | État inféré | Objet de travail (citation horodatée) | Fichiers du produit écrits | D-N posées |
|---|---|---|---|---|---|---|
| S1 | 74dc7ecb | 15:27 → 15:54 (27 min) | Actif | 15:51 — « A1a puis A2, puis A3, puis A4 » : exécution d'actions séquentielles, revues L99, lots RETOURS | `output/*.md` (revues L99), `forge/retours/*20261114p*` (lot RETOURS) — 4 commits | Aucune au registre pilot |
| S2 | f96aa196 | 11:53 → 15:55 (4 h 02) | Actif | 12:50 — « 67b, 68a, 69a + Améliore ce prompt : Envisage le fait que le coordinateur des agents… » : revue L99 de prompts, amélioration du prompt de coordination des sessions | `output/*20261114i*`, `output/*20261114j*`, `output/*20261114k*` (revues et prompts) — 0 commit, brouillons en scratchpad | D-215, D-216, D-217 au registre pilot (15:44) |
| S3 | 0cbc2262 | 08:36 → 15:54 (7 h 18) | Actif (sous-agents en cours) | 13:53 — « Pourquoi as-tu besoin d'une clé d'API de Claude ? Tu as déjà tout ce qu'il faut dans l'abonnement. » : run 20261114a, conception v2 du site, contrôle de compréhension, animation de sous-agents | `forge/ledger.jsonl`, `forge/mobilisation.jsonl`, `forge/etapes/conception/*`, `forge/BRIEF*`, `output/README.md`, `forge/retours/*20261114a-f*` — 2 commits (09:42, 10:23) puis travail non commité | D-9 à D-11 au ledger produit (via commits 10:42, 11:23) |
| S4 | 2c20204d | 10:31 → 14:43 (4 h 11) | Terminé | 10:31 — « Dans la conception et l'implémentation du refresh du site, pourquoi plusieurs agents ne sont pas utilisés… » : diagnostic d'architecture multi-agents, plan de délégation, brief de run | `forge/BRIEF*`, `forge/ledger.jsonl`, `forge/mobilisation.jsonl`, `output/README.md`, `output/*20261114e*`, `forge/retours/*20261114e-f*` — 4 commits (14:41) | Aucune au registre pilot |
| S5 | 8e1cf37c | 08:29 → 08:34 (5 min) | Terminé | 08:32 — « Pousse sur github & sur Drive : (…) factory.digit-ai.fr (…) » : sauvegarde du site vers Google Drive | `D:\10-Google Drive\dev\…\REPRISE.md` (hors dépôt) — 0 commit | Aucune |

**Compte inféré** : 5 sessions, dont 3 actives. Ce compte est une inférence, pas une mesure : une session qui n'écrit plus mais reste ouverte n'apparaît pas, et une session d'un autre poste n'apparaît pas non plus.

## Collisions mesurées

### 1. `forge/ledger.jsonl` — 3 sessions, conflit d'écriture

- **Sessions** : S3 (commits à 10:42 et 11:23, puis modifications non commitées à 15:41 et 16:35) et S4 (commit à 15:41, même fichier). Le fichier est aussi dirty dans le working tree.
- **Source de la mesure** : `git log --all --format="%H %ai %s" --since="2026-11-14T00:00:00"` croisé avec `git diff-tree --no-commit-id -r --name-only <sha>`, et `git status --short`.
- **Effet** : le ledger est append-only ; deux sessions qui y écrivent ne perdent pas de lignes, mais leurs numéros de séquence (`seq`) peuvent entrer en collision — le même problème que TF-0794 (01/09/2026, deux séquences 76 et deux 77). Aucune porte de séquence n'est active chez ce produit.
- **Cause** : S3 a ouvert le run 20261114a et y inscrit la conception ; S4 a inscrit le plan de délégation et des lots de retours. Les deux écrivent au ledger parce que le run est du ressort de S3 mais que S4 y contribue (question d'architecture et brief ajouté). Aucune des deux ne sait ce que l'autre a inscrit.

### 2. `forge/mobilisation.jsonl` — 3 sessions

- **Sessions** : S3 (commits à 10:42 et 11:23) et S4 (commit à 15:41). Aussi modifié dans le working tree.
- **Source** : mêmes commandes git que ci-dessus.
- **Effet** : le fichier enregistre les mobilisations de forge ; le verrou « livré » de la restitution (S85/S86 d'oracle-synthese, v2.57.0) lit la dernière ligne de la session ET la dernière du fichier. Si S4 écrit après S3, la dernière ligne du fichier est celle de S4, et le verrou de S3 lit une mobilisation qui n'est pas la sienne — exactement le bug de TF-2045.
- **Cause** : les deux sessions mobilisent des forges pour le même run.

### 3. `output/README.md` — 2 sessions

- **Sessions** : S3 (commit à 10:42) et S4 (commit à 15:41).
- **Source** : `git diff-tree`.
- **Effet** : fichier régénéré par `node scripts/readme-dossiers.mjs` ; chaque session le régénère après avoir écrit un livrable. Pas de perte de contenu si la dernière régénération voit tous les fichiers, mais un commit qui embarque un README incomplet est possible.

### 4. Indices de livrables dans `output/`

Ce tableau répond à la question : deux sessions ont-elles pris le même indice pour des livrables différents ? Comment le lire : les lignes sont triées par heure croissante (UTC+1) ; « Radical » donne le type de livrable ; « → old/ » signale un fichier déplacé dans le sous-dossier des versions remplacées ; « Session probable » est inférée du commit ou de la proximité temporelle. Un indice partagé par deux radicaux distincts dans le même dossier serait une collision. Verdict : aucune collision d'indice constatée.

| Indice | Radical | Heure | Session probable |
|---|---|---|---|
| 20261114a | Revue L99 — Prompt refresh du site | 10:12 | S3 (commit 10:42) |
| 20261114b | Prompt — Refresh (→ old/) | 10:28 | S3 |
| 20261114c | Prompt — Refresh (→ old/) | 10:38 | S3 |
| 20261114d | Prompt — Refresh du site v2 | 10:42 | S3 (commit 10:42) |
| 20261114e | Prompt — Refresh du site v2 | 11:39 | S4 (commit 15:41) |
| 20261114f | Revue L99 — direction B (→ old/) | 13:34 | S2 |
| 20261114g | Revue L99 — direction B (v2) | 14:17 | S2 |
| 20261114h | Revue L99 — amélioration agents | 14:16 | S2 |
| 20261114i | Revue L99 — coordination sessions | 16:52 | S2 (commit 16:52 par S1) |
| 20261114j | Prompt — coordination sessions | 16:51 | S2 |
| 20261114k | Revue L99 — défauts corrections | 15:38 | S2 |

Pas de collision d'indice constatée entre deux radicaux distincts au même indice dans le même dossier. Le relevé initial du porteur (16:27) n'est pas reproduit à cette heure : les indices sont distincts. La collision signalée visait peut-être une version intermédiaire déplacée dans `old/` depuis.

### 5. Décisions D-N

- S2 a posé D-215, D-216, D-217 au registre pilot à 15:44 (session f96aa196). Ces décisions portent sur les corrections à apporter au prompt de coordination.
- S3 a posé des décisions au ledger du produit (D-9 à D-11, via le registre commun du poste), pas au registre pilot.
- Pas de collision de numéro constatée : les deux mécanismes (registre pilot et registre commun du produit) opèrent sur des plages distinctes.

### 6. `forge/gestes-en-cours.jsonl`

Le fichier est **absent** du produit (`ls` rend une erreur). Aucune session de ce produit ne consigne ses gestes distants. Le mécanisme TF-2084 n'est donc pas opérant ici : si deux sessions lançaient un geste distant sur la même ressource, aucune ne le verrait.

## Cause commune

Les cinq sessions travaillent sur le même produit, au même moment, parce que le porteur a demandé un run de version (v2 du site) qui mobilise plusieurs chantiers : conception (S3), architecture multi-agents (S4), revue L99 de prompts (S2), exécution d'actions correctives (S1), et sauvegarde (S5). Aucune des sessions n'a de visibilité sur les autres : pas de `gestes-en-cours.jsonl`, pas de coordinatrice, pas de message inter-sessions, pas de fichier de revendication. Chaque session calcule ses séquences, ses indices et ses mobilisations en ne voyant que l'état du disque à l'instant où elle lit, ce qui suffit quand une seule session écrit, et ne suffit plus quand trois écrivent.
