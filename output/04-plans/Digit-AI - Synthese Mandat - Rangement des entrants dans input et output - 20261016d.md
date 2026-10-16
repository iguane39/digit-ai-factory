---
destinataire: humain
---

# Synthèse Mandat — rangement des entrants dans input et output (16/10/2026)

## 0. Synthèse d'ouverture

La racine d'`input\` ne contient plus que ses fichiers d'index, et les deux boîtes d'entrée ne portent plus que ce qui attend encore un geste. J'ai déplacé 676 entrants déjà traités vers `old\` : 605 depuis `input\00-retours\`, 71 depuis `input\01-candidatures\`. Le paquet correctif du 13/10 a rejoint `input\04-outillage\old\` et l'étude du 16/08 est passée dans `output\03-etudes\`. `output\` était déjà rangé : l'autre poste y a réindexé les 3 synthèses en double. Tout est enregistré sur ce poste, rien n'est publié.

## 1. En-tête d'identification

Rangement des dossiers `input\` et `output\` du pilot `digit-ai-factory`, selon les règles de familles de `input\LISEZMOI.md`. Période : 16/10/2026 de 10:46 à 10:52, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, aucun agent.

Intention de la demande : retrouver des dossiers d'entrée et de sortie lisibles, où la racine de chaque famille ne montre que le travail en attente.

Test rétro : le résultat sert cette intention. Chaque fichier déplacé était prouvé traité par l'oracle de boîte d'entrée ou par le registre, et les 4 fichiers encore en défaut restent visibles à leur place.

## 2. Verdict en une ligne

677 fichiers rangés en 2 commits locaux ; `oracle-boite-entree` PASS sur `00-retours`, recette I3 des familles 11 sur 11, recette des README 35 sur 35.

## 3. Décisions attendues

Aucune décision ne vous revient dans ce tour. La publication du pilot reste soumise à votre feu vert, après le rebase de l'action A-1.

## 4. Traité

- **`input\00-retours\`, 605 fichiers vers `old\`.** `oracle-boite-entree` rendait B1 PASS : tous les sidecars de la racine étaient ingérés. Les 4 dépôts INSATISFACTION de Produit-61 suivent, car INS-0002 à INS-0005 sont clôturés dans `insatisfactions\REGISTRE.jsonl`. Les pièces jointes rejoignent leurs lots.
- **7 lots Produit-02 du 23 au 25/08 en double.** Ils existaient déjà dans `old\`. Les sidecars étaient identiques ; les `.md` de la racine ajoutaient les sections R-45 et R-46 du 26/08, 0 ligne retirée (`diff` sur les 7). La version complète remplace l'ancienne, et git garde l'historique.
- **`input\01-candidatures\`, 71 fichiers vers `old\`.** Les 4 fichiers que l'oracle juge en défaut restent à la racine (voir le bloc 5).
- **Racine d'`input\`.** Le paquet « Correctif Factory - Ouverture de session sous le delai client » du 13/10 a déjà donné TF-1635 et TF-1636 : il part dans `04-outillage\old\`. `input\etude.md`, une étude du pilot, devient `output\03-etudes\20260816-etude-skills-animation-motion.md`.
- **Lecteurs vérifiés.** `lib-retours-produit.mjs`, `generer-recidives.mjs` et `oracle-boite-entree.mjs` lisent aussi `old\`. Les autres mentions des lots sont des citations par nom. Aucun lecteur ne casse.
- **Enregistrement.** Commit 3784e55f (663 renommages, 7 remplacements, README régénérés), en `git commit --only` : les 3 fichiers modifiés par d'autres sessions restent hors du commit.
- **Constat en passant.** Sans `--registre`, `oracle-boite-entree` ignore le répertoire qu'on lui passe et juge `00-retours` à sa place (ligne 903). Il est inscrit comme candidat TF-1830, commit 6d535f72 ; le numéro TF-1829 était déjà pris sur l'autre poste.

## 5. Non traité

- **4 fichiers d'`input\01-candidatures\`.** Motif : ils relèvent d'un traitement, pas d'un rangement. La candidature DataForSEO de Produit-02 du 31/08 n'a jamais été ingérée sous sa forme brute, et sa forme normalisée a changé depuis son ingestion. `porte-publication-faux-positif-20260909a` a lui aussi changé depuis son ingestion.
- **Lot au sas `_arrivee`, déposé ce matin.** Motif : il demande un accueil puis une ingestion, et c'est une action du bloc 8.
- **Publication du pilot.** Motif : décision humaine (R-38). Le pilot a 12 commits de retard sur son distant, et les commits de ce poste en divergent : il faut d'abord le rebaser.

## 6. Écarts à la lettre

| Vous avez écrit | J'ai fait | Pourquoi |
|---|---|---|
| Ranger input et output | Rangé `input\` ; `output\` laissé tel quel | `output\` était déjà rangé, et l'autre poste y a réindexé les doublons |

## 7. Risques

- **Le rebase croise ce rangement.**
  - Énoncé : 12 commits distants touchent des README régénérés que ce rangement modifie aussi.
  - Signal : un conflit sur un `README.md` ou sur `output\LISEZMOI.md` pendant le rebase.
  - Parade : garder l'une ou l'autre version, puis rejouer `node scripts\readme-dossiers.mjs` avant `git rebase --continue`.

## 8. Prochaines actions

Le rebase vient d'abord, parce que l'accueil du lot et l'instruction des candidatures écrivent au registre que l'autre poste a aussi modifié.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Rebaser le pilot sur son distant | auto_ia | prerequis : les actions A-2 et A-3 écrivent au registre | `git pull --rebase origin main` | Les numéros TF se croisent entre les postes |
| **A-2** | `neuve` | Accueillir et ingérer le lot du sas | auto_ia | prerequis : rebase fait | `node todo\accueillir-lot.mjs`, puis `node todo\ingerer-lot.mjs <sidecar>` | Le lot devient un oubli dans 24 h (B9) |
| **A-3** | `neuve` | Instruire les 4 candidatures en défaut | auto_ia | prerequis : rebase fait | `node oracles\oracle-boite-entree.mjs input\01-candidatures --registre todo\TODO.jsonl` | Leur contenu ajouté depuis l'ingestion n'entre nulle part |
| **A-4** | `TF-1830` | Corriger la lecture d'argument d'oracle-boite-entree | auto_ia | decision : candidat en attente de votre arbitrage | `node todo\journaliser.mjs` à la décision | L'usage documenté de l'oracle juge un autre dossier |

## 9. Traces

- Commit 3784e55f (rangement), commit 6d535f72 (TF-1830), tous deux locaux
- `input\LISEZMOI.md`, règles des familles
- `oracles\oracle-boite-entree.mjs:903`
