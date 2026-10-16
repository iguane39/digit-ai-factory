---
destinataire: humain
---

# Synthèse Conseil — prompt Supabase passé au crible L99, version b déposée (16/10/2026)

## 0. Synthèse d'ouverture

Votre prompt tient debout : je le note 79 sur 100, et la version b atteint 93 en projection. Il lui manquait surtout une forge : forge-tests traite déjà les variables Databricks, et votre table des surfaces l'oubliait. La version b mesure les surfaces au lieu de les lister, recadre la règle R-28 et ancre chaque point par son nom de symbole. Elle est déposée dans `output\04-plans\` et enregistrée sur ce poste. Une question vous revient : inclure forge-tests dans le run.

## 1. En-tête d'identification

Synthèse de l'analyse L99 (8 couches du skill `prompt-analyzer-l99`) du prompt « Ajouter les compétences Supabase aux forges », version a du 16/10/2026. Période : 16/10/2026 de 10:23 à 10:26, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, aucun agent.

Intention de la demande : obtenir un prompt de run qui donne à un produit Supabase le même outillage qu'un produit Azure ou Databricks, sans fichier que rien n'appelle.

Test rétro : le résultat sert cette intention. Chaque surface de la version b a été retrouvée par `git grep` dans les dépôts, et la surface oubliée l'a été par la même mesure.

## 2. Verdict en une ligne

Score 79 sur 100 avant, 93 projeté après ; 2 défauts majeurs et 4 mineurs, tous clos dans la version b ; 0 bloquant.

## 3. Décisions attendues

Inventaire des bloquants :

- **Périmètre du run.** Ce qui est bloqué : le lancement du run avec la version b. Ce qu'il faut fournir : votre accord sur D-1. Si rien n'est fourni : la version b s'exécute sans la ligne forge-tests.

> **D-1 — Le run Supabase doit-il couvrir forge-tests en plus des cinq forges que vous aviez listées ?**
>
> Votre intention dit « testé », et forge-tests réclame déjà par pan les variables Databricks (`forge_tests/noyau.py:116`, `forge_tests/actions.py:339`). Votre table ne la cite pas. La version b lui donne une ligne « créer ou écarter avec motif », ce qui élargit votre périmètre.
>
> **Recommandation : (a).** Source consultée : `git grep -il databricks` rend 4 fichiers suivis dans forge-tests le 16/10/2026, et la loi n° 3 du noyau (« l'oubli n'existe pas ») demande qu'une surface s'écarte explicitement.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Garder la ligne forge-tests de la version b | Faible × court | Aucune contrainte connue |
| (b) La retirer et revenir aux cinq surfaces de la version a | Nul | Un produit Supabase testé par forge-tests n'aura pas ses variables sollicitées par pan |

> **Si rien n'est décidé** : (b), la ligne est retirée avant le lancement.

## 4. Traité

- **Prémisses mesurées dans les dépôts.** Les chemins cités existent : fiches `expert-ops-azure.md` et `expert-data-platform-cloud.md`, `verdict-ops-azure.json`, profils d'audit `azure/` et `databricks-lakehouse/`, profils-moteur, `PROFILS_AUTH`, gabarit `.gitignore`. Les lignes 414, 117, 173, 191 et 1489 tombent juste.
- **Défaut majeur 1, surface oubliée.** Le compte `git grep -il databricks` par dépôt donne forge-agents 10, forge-audit 43, forge-data 22, forge-ops 4, forge-tests 4. La version b en fait une étape 0 rejouable et une sixième ligne de table.
- **Défaut majeur 2, valeurs Supabase écrites de mémoire.** Le prompt interdit d'écrire de mémoire, puis affirme RLS, PITR, SSL et restrictions réseau. La version b les déclare hypothèses, et un contrôle sans page datée sort du profil.
- **Défauts mineurs.** R-28 encadre la naissance d'une forge, pas le choix entre profil et section : la version b renvoie à `references/profils-moteur/LISEZMOI.md` du dépôt forge-data. `PLANS.azure` commence ligne 334, pas 336. R-14 vit dans `oracle-conformite-projet.mjs:1478`, pas dans `REGLES-PROJET.md`. Le rollback Supabase n'est peut-être pas natif ; la phase doit le dire.
- **Accès à la documentation mesuré.** `curl -L` anonyme depuis ce poste rend 200 sur 3 pages de supabase.com/docs, le 16/10/2026 à 10:25. La version b rejoue cette mesure et porte la branche d'échec.
- **Ajouts de la version b.** Un contrat de sortie, un protocole de tests à 3 cas par forge, le parallélisme des forges indépendantes et le nom de synthèse selon R-4 et R-25.
- **Enregistrement.** `git commit --only` local, 844b7af9 ; la version a reste intacte.

## 5. Non traité

- **Exécution du run.** Motif : hors demande, vous avez demandé le prompt.
- **Publication du pilot.** Motif : décision humaine (R-38) ; le pilot a 9 commits d'avance et 12 de retard, à rebaser avant.

## 6. Écarts à la lettre

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| Cinq surfaces listées | Une étape 0 qui les mesure, et une sixième ligne pour forge-tests | Le relevé déclaré ratait une forge (D-1) |
| « Décider par non-recouvrement (R-28) » | Décider selon la doctrine de `LISEZMOI.md` du dépôt forge-data | R-28 encadre la naissance d'une forge |
| Lignes de code comme ancres | Symboles d'abord, lignes datées | Les lignes dérivent entre deux postes |
| Ordre strictement séquentiel | Forges ops, audit, data et tests en parallèle après forge-agents | Elles ne dépendent pas l'une de l'autre |

## 7. Risques

- **Le pilot diverge de son distant.**
  - Énoncé : 9 commits locaux, 12 distants ; le run touchera le pilot à l'étape des garde-fous.
  - Signal : `git rev-list --left-right --count HEAD...origin/main` différent de « N 0 ».
  - Parade : l'étape 0 de la version b impose `git fetch` puis rebase avant tout commit.

## 8. Prochaines actions

Le rebase vient d'abord, parce que le run écrit au pilot ; le lancement suit votre réponse à D-1.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Rebaser le pilot sur son distant | auto_ia | dependance_bloc_3 : attend votre feu vert pour le run | `git pull --rebase origin main` | Le run commit sur un pilot en retard de 12 |
| **A-2** | `neuve` | Lancer le run avec la version b | auto_ia | dependance_bloc_3 : attend D-1 | Ouvrir une session et coller le fichier `Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md` | Les produits Supabase restent sans outillage |
| **A-3** | `neuve` | Trancher D-1 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | L'option par défaut s'applique |

## 9. Traces

- `output/04-plans/Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md` (commit 844b7af9, local)
- Skill `prompt-analyzer-l99`, `references/couches.md`
