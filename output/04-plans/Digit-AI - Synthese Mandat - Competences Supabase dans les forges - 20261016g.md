---
destinataire: humain
---

# Synthèse Mandat — Supabase outillé dans quatre forges et au pilot, publication du pilot à décider (16/10/2026)

## 0. Synthèse d'ouverture

Un produit Supabase trouve désormais, à chaque étape, l'outillage d'un produit Azure ou Databricks : un expert admis, une cible de plan de MEP, un profil d'audit, un profil-moteur et les garde-fous du dépôt. Les quatre forges sont publiées, et chaque ajout est passé du rouge au vert. Le pilot est enregistré sur ce poste mais pas publié : il diverge du distant sur la reprise entre postes, et le rebase bute sur 11 conflits. Une question vous revient : la publication du pilot.

## 1. En-tête d'identification

Synthèse de clôture du run de mandat « exécute le prompt », sur le prompt « Competences Supabase dans les forges », version b. Forges touchées : forge-agents, forge-ops, forge-audit, forge-data, et le pilot digit-ai-factory. Période : 16/10/2026 de 10:27 à 11:26, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5 ; 3 agents Opus 5.5, un par forge, en parallèle.

Intention de la demande : qu'un run de produit Supabase trouve à chaque étape son outillage, câblé et prouvé, sans fichier que rien n'appelle.

Test rétro : le résultat sert cette intention. Chaque ajout est appelé par le code qui sert Azure ou Databricks : le routeur d'experts envoie une demande Supabase à `ops-supabase`, `ops.mjs plan supabase` produit un plan jugé par O-5, `build-banc` charge le profil d'audit, et R-14 juge les fichiers du CLI.

## 2. Verdict en une ligne

5 surfaces livrées sur 5 visées, 5 passages du rouge au vert, 4 forges publiées (rev-list 0 0), pilot enregistré et non publié ; 0 valeur Supabase sans source datée.

## 3. Décisions attendues

Inventaire des bloquants :

- **Publication du pilot.** Ce qui est bloqué : l'envoi des garde-fous R-14 et du registre (TF-1832 à TF-1836). Ce qu'il faut fournir : votre accord sur D-2. Si rien n'est fourni : ils restent sur ce poste, et les produits ne reçoivent pas le motif du jeton Supabase.

Rappel de D-1, la couverture de forge-tests posée à 10:26 : close sans objet. Une relecture aveugle d'une autre session a montré que les lignes citées commentent un défaut corrigé (TF-0381), et ma recommandation (a) reposait sur cette mauvaise lecture.

> **D-2 — Le pilot peut-il publier ses enregistrements, une fois rebasé sur le distant ?**
>
> Le pilot a 18 enregistrements d'avance et 12 de retard (mesure de 11:26). Le rebase essayé à 10:28 bute sur 11 conflits : les deux postes ont câblé la reprise entre postes (TF-1736), et le distant porte déjà une fusion de ce travail (808a98ca). Je l'ai annulé, rien n'est perdu.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md` R-38, paragraphes 4 et 5, qui réservent la publication du pilot au porteur ; la règle de synchronisation déjà appliquée le 28/09 garde la version publiée et ne reporte que le travail propre à ce poste.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Je rebase en gardant la version publiée de la reprise, je reporte le travail propre à ce poste, je rejoue la recette, puis je publie avec `FORGE_PUSH_GO="D-2 (a) du 16/10" git push origin main` | Moyen × moyen | Aucune contrainte connue : la porte de publication juge l'envoi |
| (b) Laisser l'autre poste publier d'abord, puis rebaser | Nul tant que l'attente dure | Les produits n'ont pas le motif Supabase de R-14 |

> **Si rien n'est décidé** : (b), le pilot reste sur ce poste.

## 4. Traité

- **Documentation lue et datée.** 9 pages de supabase.com/docs et 3 fichiers du dépôt officiel `supabase/cli`, lus le 16/10/2026 de 10:30 à 10:46. Aucune valeur Supabase n'est écrite de mémoire.
- **forge-agents, expert `ops-supabase` admis (TF-1832).** La baseline A a été figée par une session neuve sans outil, avant le corpus (commit 85d95d7). Le juge rend MATERIEL sur 5 axes (exit 0), et la contre-épreuve générique NON_MATERIEL sur 0 (exit 1). Commit 5f56df3, self-test 73 PASS.
- **forge-ops, cible `supabase` (TF-1833).** O-5 rend « cible inconnue » avant l'ajout (exit 1), PASS sur la verte (exit 0), FAIL sur les deux rouges. Le retour arrière est une migration corrective, car la documentation ne décrit aucune migration « down ». La restauration PITR est marquée geste humain irréversible. Commit 374e9a0, self-test 208 PASS, recompté ici.
- **forge-audit, profil `supabase` (TF-1834).** 7 contrôles sourcés : RLS, clé secrète, bundle client, stockage, auth, sauvegardes, réseau et SSL. Un vérificateur de profils entre en CI : exit 1 avant câblage, exit 0 après. Commit 6a4aef4, version 1.19.0, `tools/verifier.mjs` 14 étapes sur 14, recompté ici.
- **forge-data, profil-moteur (TF-1835).** Décision écrite : un fichier `supabase.md` qui hérite de `postgres.md`, et le verbe `importer` n'est pas étendu. La garde d'inventaire rend 1 FAIL avant câblage, 382 PASS après. Commit 3c14112.
- **Pilot, garde-fous (TF-1836).** R-14 reconnaît `.supabase/access-token` et `.env.keys` : 185 PASS et 1 FAIL avant le motif, 186 PASS après. Le gabarit `.gitignore` ignore aussi `supabase/.temp/` et `.branches` : FAIL sur l'ancien gabarit, 10 PASS sur le nouveau. Commits locaux 8cac7905 et 184002a1.
- **Secrets.** `git grep -E` des motifs `sb_secret_`, JWT `eyJ` et `<ref>.supabase.co` sur les fichiers des 4 commits de forge : 0 occurrence. Aucun `createHash` neuf.
- **Prompt b corrigé.** forge-tests est sans objet ; les mentions Azure de forge-development (Azure DevOps) et de forge-conception (terme SSO) reçoivent un écart motivé ; le contrôle de secrets nommé est celui qui existe. La version a passe dans `old\`.
- **Recette complète du pilot.** `node oracles/self-tests.mjs` rend 218 oracles verts sur 219, exit 1. Le défaut est `banc-mutation.test.mjs` (12 PASS, 2 FAIL) : son manifeste vise `input/00-retours/produits-anciens - RETOURS - 20260906a.md`, déplacé ce matin par la session qui range `input\`. Ce défaut n'est pas imputable à ce run, et la session de rangement en est informée.

## 5. Non traité

- **Publication du pilot.** Motif : dependance_bloc_3, elle attend D-2.
- **Profil forge-websec et pitch marketing.** Motif : hors périmètre du prompt, sauf décision humaine ; non inscrits en candidats, faute de mesure qui les fonde.
- **Contrôles d'audit écartés faute de source** : retour arrière des migrations, `jwt_expiry`, `--no-verify-jwt`, MFA, `[auth.rate_limit]`. Motif : la documentation lue ne fixe pas de valeur à juger.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « La version de forge montée et son CHANGELOG » | Version et CHANGELOG pour forge-audit (1.19.0) ; registre des experts 0.6.0 pour forge-agents ; rien pour forge-ops et forge-data | Ces deux forges n'ont ni fichier de version ni CHANGELOG, et poser un tag reviendrait à improviser un run de version |
| « Chaque surface s'enregistre au registre » | Un item par forge et un pour le pilot, créés, décidés et clos le même jour | Votre « exécute le prompt » vaut décision ; les gains sont mesurés |
| Rebaser le pilot avant tout commit | Rebase annulé, commits locaux sur le pilot divergent | 11 conflits sur un travail hors de ce run (D-2) |

## 7. Risques

- **Le pilot diverge de son distant.**
  - Énoncé : 18 enregistrements locaux, 12 distants, et la reprise entre postes écrite des deux côtés.
  - Signal : `git rev-list --left-right --count HEAD...origin/main` différent de « N 0 ».
  - Parade : D-2 (a), qui garde la version publiée.
- **Les clés héritées de Supabase expirent fin 2026.**
  - Énoncé : la documentation lue le 16/10 annonce la dépréciation des clés `anon` et `service_role`.
  - Signal : une page `api-keys` qui change, relue à la prochaine `challenge_date` du profil-moteur.
  - Parade : l'expert et le profil d'audit visent déjà les clés `sb_publishable_` et `sb_secret_`.

## 8. Prochaines actions

La publication vient d'abord, parce que les produits attendent le motif R-14 ; le reste est sans dépendance.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1836 | Rebaser le pilot en gardant la reprise publiée, rejouer la recette, publier | auto_ia | dependance_bloc_3 : attend D-2 | `git pull --rebase origin main` puis `FORGE_PUSH_GO="D-2 (a) du 16/10" git push origin main` | Le motif Supabase de R-14 n'atteint pas les produits |
| **A-2** | `neuve` | Trancher D-2 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-2 (a)` | L'option par défaut s'applique |

## 9. Traces

- forge-agents 85d95d7 et 5f56df3 ; forge-ops 374e9a0 ; forge-audit 6a4aef4 ; forge-data 3c14112 (publiés)
- Pilot 8cac7905 et 184002a1 (locaux) ; `todo/TODO.jsonl` TF-1832 à TF-1836
- `output/04-plans/Digit-AI - Prompt - Competences Supabase dans les forges - 20261016b.md`
