---
destinataire: humain
---

# Synthèse Mandat — archives d'input et d'output classées en sous-dossiers (16/10/2026)

## 0. Synthèse d'ouverture

Les archives se parcourent maintenant par dossier, et non plus dans une liste de plusieurs centaines de noms. Les 740 lots de retours ingérés sont classés par émetteur, par exemple `input\00-retours\old\Produit-64\`. Les 129 candidatures archivées, les 100 études et les 30 lots de travaux des mois clos sont classés par mois. Un seul dossier reste à plat, `output\04-plans\` et ses 333 synthèses : le classer ferait dépasser à 51 chemins la longueur maximale qui garde le dépôt clonable sous Windows. Cet arbitrage vous revient (D-1). Le classement se rejoue en une commande, et rien n'est publié.

## 1. En-tête d'identification

Classement en sous-dossiers des gros dossiers d'`input\` et d'`output\` du pilot `digit-ai-factory`. Période : 16/10/2026 de 10:56 à 11:53, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, aucun agent ; deux autres sessions écrivaient dans le pilot pendant le tour (`digit-ai-factory-b0`, `digit-ai-factory-1e`).

Intention de la demande : pouvoir retrouver un document en ouvrant un dossier, sans faire défiler des centaines de fichiers.

Test rétro : le résultat sert cette intention pour 4 dossiers sur 5. Dans `output\04-plans\`, il n'en sert que la lettre tant que D-1 n'est pas tranchée.

## 2. Verdict en une ligne

999 fichiers classés dans 49 sous-dossiers ; `oracle-conformite-projet` rend 155 constats avant comme après ; recette complète 0 oracle en défaut sur 219, exit 1 sur 6 écritures d'autres sessions.

## 3. Décisions attendues

Inventaire des bloquants :

- **Classement d'`output\04-plans\`.** Ce qui est bloqué : le rangement des 333 synthèses. Ce qu'il faut fournir : votre choix sur D-1. Si rien n'est fourni : le dossier reste à plat.

> **D-1 — Faut-il classer les synthèses d'`output\04-plans\` par mois, au prix de relever le plafond de longueur des chemins ?**
>
> Le plafond de R-4 (alinéa TF-1015, votre décision du 11/09/2026) limite un chemin et son cache d'oracle à 150 caractères. Il protège le clonage du dépôt sous Windows : le 10/09, un clone a échoué sur 22 fichiers trop longs. Un sous-dossier `2026-09\` ajoute 8 caractères et fait passer 51 synthèses au-dessus. Un sous-dossier `09\` en ferait encore passer 17.
>
> **Recommandation : (a).** Source consultée : la mesure de ce tour, `oracle-conformite-projet` rejoué avant et après, 155 constats contre 206 avec le classement par mois.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Laisser `04-plans\` à plat | Nul | Le dossier reste long à parcourir |
| (b) Classer par mois et relever le plafond, avec `core.longpaths` exigé sur chaque poste | Moyen × court | Un clone sans `core.longpaths` échoue à nouveau, comme le 10/09 |

> **Si rien n'est décidé** : (a), le dossier reste à plat.

## 4. Traité

- **`input\00-retours\old\`, 740 fichiers en 42 sous-dossiers.** Un par émetteur, le préfixe du lot ; `INSATISFACTION\` pour les dépôts d'insatisfaction ; `historiques-sans-prefixe\` pour les 3 `RETOURS-FORGES*.md` antérieurs à la convention.
- **`input\01-candidatures\old\`, 129 fichiers en 4 sous-dossiers.** `2026-08\`, `2026-09\`, `2026-10\`, et `sans-date\` pour les 40 noms sans date.
- **`output\03-etudes\` et `output\06-travaux-confies\`, 130 fichiers.** Les mois clos sont en `2026-08\` et `2026-09\`. Le mois en cours reste à la racine, là où les producteurs écrivent et où l'allocation d'indice lit. Les 63 caches `.oracles\` suivent leur livrable.
- **Le classement est rejouable.** `node scripts\ranger-dossiers.mjs` déplace par `git mv`, refuse toute collision et ne touche pas aux fichiers non suivis. `--sec` affiche le plan sans rien déplacer. Rejoué sur l'état final, il trouve 0 fichier à déplacer.
- **Cinq lecteurs d'archive parcourent les sous-dossiers.** Le gabarit `oracle-lot-retours` (2 endroits, lu par les produits), `lib-retours-produit`, la règle B10 d'`oracle-boite-entree` et `generer-recidives`. Lus à plat, ils auraient perdu en silence tout lot classé. Mesure : la lecture voit 741 fichiers archivés.
- **R-7 bis compare les versions par famille.** Le sous-dossier de mois est retiré de la clé, donc ranger un mois clos n'éteint aucune détection de version restée hors `old\`.
- **Citations réécrites.** 67 citations de chemins déplacés, dans les références, les profils, les gabarits, les manifestes de banc et le code. Les livrables scellés, les registres et les journaux restent intacts (règle 5).
- **Rôles des README.** Chaque nouveau sous-dossier reçoit son rôle par motif dans `readme-dossiers.mjs`, et `--check` passe. `input\LISEZMOI.md` décrit le classement.
- **Défaut corrigé au passage.** Le rôle de `output\06-travaux-confies\` citait `gabarits\TRAVAUX-Produit-67.md`, un fichier qui n'existe pas : « pilot » y avait été pseudonymisé à tort le 20/09. Il cite maintenant `TRAVAUX-PILOT.md`.
- **Constat inscrit.** Le retour inexpliqué de 228 synthèses à leur ancien chemin est le candidat TF-1837, avec la piste d'une recette qui écrit dans l'arbre réel. Le registre a été enregistré avec une mise à jour de TF-1831 laissée en attente par la session `digit-ai-factory-b0`, dont le travail était fini.
- **Recettes.** `oracle-lot-retours` 92 sur 92, `readme-dossiers` 35 sur 35, familles numérotées 11 sur 11, banc des défauts échappés 3 sur 3, `generer-recidives` 13 sur 13, `oracle-boite-entree` 45 sur 45, et PASS sur la boîte réelle. Le banc de mutation, signalé par la session `digit-ai-factory-1e`, citait un lot passé en `old\` le matin : son manifeste est corrigé, 14 sur 14.
- **Recette complète, rejouée sur l'état enregistré.** `node oracles\self-tests.mjs`, de 11:30 à 11:51 : 0 oracle en défaut sur 219. Elle sort en code 1, parce que la garde I7 nomme 6 recettes qui auraient écrit dans l'arbre suivi. Les 6 constats portent sur des fichiers de `04-plans\` et des index que les autres sessions écrivaient pendant le passage ; aucun ne touche un dossier classé.
- **Enregistrement.** Commit 41226021 (1 062 renommages, 999 fichiers et 63 caches) et commit 7c8da928 (registre), tous deux locaux.

## 5. Non traité

- **`output\04-plans\`.** Motif : arbitrage avec une règle que vous avez décidée (D-1).
- **`output\01-revues-et-propositions\`, 22 fichiers.** Motif : le dossier se parcourt encore d'un coup d'œil.
- **Deux commentaires de forge-agents** citent encore l'ancien chemin d'une étude du 18/08. Motif : simples commentaires, sans effet sur l'exécution.

## 6. Écarts à la lettre

| Vous avez écrit | J'ai fait | Pourquoi |
|---|---|---|
| Classer chaque dossier et sous-dossier | Classé 5 dossiers sur 6 ; `04-plans\` laissé à plat | Le plafond de longueur de R-4 l'interdit sans votre décision (D-1) |
| Ranger dans de nouveaux sous-dossiers | Mois en cours laissé à la racine d'`output` | Les producteurs y écrivent, et l'allocation d'indice ne lit qu'un dossier |

## 7. Risques

- **Une autre session déplaçait des fichiers pendant le tour.**
  - Énoncé : entre 11:02 et 11:10, 228 synthèses sont revenues de `04-plans\2026-0x\` à la racine sans commande de cette session. Les sessions `digit-ai-factory-b0` et `digit-ai-factory-1e` disent ne pas en être l'auteur ; deux recettes complètes tournaient en même temps. Cause non identifiée, inscrite comme candidat.
  - Signal : un renommage dans `output\04-plans\` que ce commit ne contient pas.
  - Parade : l'état final a été vérifié fichier par fichier contre la table de correspondance, et le commit ne prend que les chemins de ce tour.
- **Un produit hors ligne lit sa copie de repli du gabarit.**
  - Énoncé : sa copie lit `old\` à plat et ne voit pas les lots classés.
  - Signal : un identifiant en double non détecté chez un produit.
  - Parade : la copie se remet à niveau à l'ouverture du produit (relais du gabarit, TF-1821).

## 8. Prochaines actions

Le rebase vient d'abord, parce que le pilot diverge de son distant et que ce classement touche 999 chemins. Le rangement suivant vient ensuite, parce que sa cadence dépend de D-1.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Rebaser le pilot sur son distant | auto_ia | prerequis : la publication attend votre feu vert | `git pull --rebase origin main` | Les numéros TF se croisent entre les postes |
| **A-2** | `neuve` | Ranger après chaque ingestion et chaque fin de mois | auto_ia | dependance_bloc_3 : la cadence suit D-1 | `node scripts\ranger-dossiers.mjs` | Les archives se remplissent à nouveau à plat |
| **A-3** | `neuve` | Trancher D-1 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | L'option par défaut s'applique |

## 9. Traces

- `scripts\ranger-dossiers.mjs`, commit 41226021 (local)
- Registre : TF-1837, commit 7c8da928 (local)
- `input\LISEZMOI.md`, section « Classement des archives en sous-dossiers »
- `oracles\oracle-conformite-projet.mjs:408`, plafond de chemin
