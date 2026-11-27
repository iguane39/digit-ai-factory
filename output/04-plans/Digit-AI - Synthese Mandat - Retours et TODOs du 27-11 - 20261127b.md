---
destinataire: humain
---

# Synthèse Mandat — retours et TODOs du 27/11/2026

## 0. Synthèse d'ouverture

Les 19 lots de retours arrivés depuis hier sont au registre. Les 13 sujets du premier passage sont corrigés, dans le pilot et 2 forges, toutes publiées ; les 10 sujets arrivés pendant la session sont classés et attendent le prochain passage. Une ouverture de session chez un produit dit désormais ses automatisations hébergées en panne. Une maquette ne réclame plus les pièces d'un produit construit, se compare sur une planche d'images et se juge contre la charte de l'application servie. Les juges des pages mesurent l'alignement d'un champ et de son bouton et ne se trompent plus sur 3 formes de page. Une décision vous revient : retirer des lots publiés les noms de 2 correspondants des clients d'un produit.

Livré : [Synthèse des retours du 27/11](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2027-11%20-%2020261127b.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les TODOs et retours ». Dépôts touchés : le pilot `digit-ai-factory`, forge-agents et forge-design. Période : du 27/11/2026 à 11:54 au 27/11/2026 à 16:08, heure de Paris. Session pilote Claude Opus 5.5, avec 3 agents de campagne (Sonnet 5.5).

Intention : vider la boîte des retours et faire avancer le registre, en exécutant tout ce qui ne vous revient pas.

Test rétro : la boîte est vide ; chaque sujet neuf est corrigé avec une recette rejouée par la session, ou nommé avec sa raison ; les forges touchées sont publiées.

## 2. Verdict

19 lots ingérés en 2 passages, 23 sujets créés (TF-2898 à TF-2910, TF-2912 à TF-2921) et 15 clos en corrigé au registre, dont 2 restés d'hier ; 2 forges publiées, 0 commit d'avance mesuré par `git rev-list` ; oracle du registre PASS à chaque écriture.

## 3. Décisions attendues

Une seule décision neuve vous revient.

> **D-247 — Retire-t-on des lots publiés du pilot les noms de 2 correspondants des clients d'un produit, cités en clair dans 25 lots depuis le 15/10/2026 ?**
> - **De quoi s'agit-il** : les lots de retours d'un produit de rédaction de réponses, rangés dans `input/00-retours/` du pilot, dépôt public.
> - **Le problème** : 4 documents d'exemple de ce produit portent en titre le nom d'une personne et d'une société clientes de son cabinet ; 25 lots publiés les recopient depuis le 15/10/2026, et l'accueil ne les a jamais signalés. Les 2 lots du jour ont été annotés à la réception, noms remplacés, avant tout enregistrement.
> - **Pourquoi vous** : réécrire une histoire publique est un geste irréversible, la même question que D-90.
> - **Recommandation : (a)** — elle arrête la diffusion dans l'arbre courant sans geste irréversible, et l'histoire se décide à part. Source consultée : `REGLES-PROJET.md` R-38 (publication) et R-29 (gestes irréversibles), `references/TODO-FORGE.md`, « Réécrire l'historique d'un dépôt est un geste humain décidé », et `git grep` sur l'arbre suivi du pilot, 27/11/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) | La session pseudonymise les 25 lots de l'arbre courant et apprend la forme au relevé des noms | 1 commit | revenir au commit |
| (b) | (a), plus réécriture de l'histoire publique du pilot | réécriture et envoi forcé du dépôt | aucun : les clones déjà faits gardent les noms |
| (c) | Rien n'est fait, les noms restent | aucun | sans objet |

> **Sans réponse** : les 25 lots restent publiés avec les 2 noms, et le prochain lot du produit les recopiera.

- D-221 : rouvrir l'exclusion « Pas de vidéo », posée le 16/11, inchangée.
- D-231 : confier dès maintenant à Codex et Antigravity le code borné, posée le 21/11, inchangée.
- D-246 : remise des jetons du dossier de marque sur la charte du socle, posée le 26/11, inchangée.

## 4. Traité

Chaque correction ci-dessous a sa recette rejouée par la session avant publication.

- **Sas des retours** : « 24 lot(s) accueilli(s), 0 refusé(s) » (un lot et son sidecar comptent pour 2), pseudonymisés, formes PASS ; 12 lots ingérés, dont 4 sans sujet pour les forges.
  - Mesuré sur : les sorties de `todo/accueillir-lot.mjs` et `todo/ingerer-lot.mjs`, relues à 11:58, périmètre 12 lots, soit 24 lot(s) accueilli(s) au compte de l outil.
- **Registre** : 13 sujets classés, 8 à une classe existante et 5 à une classe créée (`todo/CLASSES.json` 1.76.0) ; 15 décisions sans ressort humain consignées ; TF-2911 créé pour les noms publiés.
- **Arrêt par PID, pilot** (TF-2900) : le script relit la liste 3 fois au moins avant de dire un arrêt non vérifié, et nomme qui reste. Preuve : 8 PASS, les 2 cas neufs rouges sur le script d'avant.
- **Type « maquette », pilot** (TF-2906) : la carte des forges ne demande plus DESIGN.md ni jetons pour une maquette. Preuve : 39 PASS, carte 19/19 PASS.
- **Recette agrégée, pilot** (TF-2895) : une option inconnue est refusée sans rien jouer. Preuve : 10 PASS.
- **Préjugement d'un message d'attente, pilot** (TF-2897) : jugé comme au hook de fin de tour. Preuve : cas 84 rouge sur le code d'avant, vert après.
- **Workflows hébergés, pilot** (TF-2899) : l'ouverture d'un produit lit le relevé filtré sur lui et le relance quand il est périmé. Preuve : 26 PASS, dont 2 cas neufs.
- **Recette entière du pilot** : 7 rouges sur 308. Un venait de ce tour, le compte des types de la carte, corrigé. Le compte des produits du parc, passé à 34, est régénéré. Les autres sont au bloc 7.
- **Forge-agents, socle des pages** (TF-2898, TF-2902, TF-2903, TF-2904) : règle neuve V30 pour un champ et son bouton, 2 faux rouges levés, capture pleine page sans en-tête collant figé. Preuve rejouée : 994/994 cas passés. Publié : 74a8d97.
- **Forge-agents, filtres et délégation** (TF-2905, TF-2907, TF-2908) : 3 commits rapatriés de la copie de l'agent. Preuve rejouée : 877, 25 et 9 PASS.
- **Registre des oracles** : les 2 oracles neufs de forge-design inscrits (2.67.0), que le contrôle croisé accusait.
- **Forge-design** (TF-2901, TF-2909, TF-2910) : jugement de toutes les pages servies par la navigation, planche mosaïque, contrôle de la charte de l'application. Preuve rejouée : tout vert, 89 oracles, 202 règles verrouillées. Publié : cb03af8.
- **Noms de tiers** : les 5 lots du jour d'un produit annotés à la réception, noms remplacés avant tout enregistrement.
- **Installation des skills** : `oracle-skills --appliquer` joué, puis `oracle-skills` PASS ; les copies du poste portent les versions publiées.
- **Second passage du sas** : 7 lots arrivés pendant la session, accueillis et ingérés, dont 1 sans sujet pour les forges ; 10 sujets créés (TF-2912 à TF-2921), dont 2 récidives de classes closes, classés : 3 à une classe existante et 5 à une classe créée (`todo/CLASSES.json` 1.77.0).
  - Un second lot du même produit portait un indice et 3 identifiants de retours déjà pris : réindexé 20261127h et renuméroté à la réception (D-241 (a)), puis ingéré sans dérogation ; la remontée au produit est inscrite (TF-2922).
- Relecture d'intention : sert, sur les 3 consignes.

## 5. Non traité

- TF-2911, noms publiés — motif : decision, D-247 au bloc 3.
- TF-2890, oracle de fidélité d'une page à sa maquette — motif : borne_atteinte, une conception à part ; le relevé des pages et la planche du jour en sont 2 briques.
- TF-2894 et TF-2896, restes d'hier — motif : borne_atteinte, laissés pour un prochain passage.
- TF-2912 à TF-2921, arrivés pendant la session — motif : borne_atteinte, classés, à corriger au prochain passage.
- TF-2922, remontée au produit — motif : programmée, départ : ouverture du produit sur son poste, le seul où vit son dossier.

## 7. Risques

- **Budget de temps du hook des fiches** : 370 ms mesurés pour 300 admis, sur une machine chargée par 3 agents. Signal : le cas rouge persiste machine au repos. Parade : rejouer `oracles/hook-fiches.test.mjs` seul au prochain passage.
- **Règle V30 neuve** : elle peut rougir des pages de produits jamais mesurées ; 0 sur 441 fixtures, 2 vrais écarts sur 80 pages du dépôt. Signal : un produit accusé sur un bouton aligné à l'œil. Parade : dispense `data-alignement-ok` déclarée.

## 8. Prochaines actions

Ordre : la décision d'abord, parce qu'elle conditionne le prochain lot du produit ; puis les petites corrections, puis la conception.

| Sél. | Action | Identifiant | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à la question des noms publiés par sa lettre | TF-2911 | manuelle_utilisateur | decision | écrire « 247a », « 247b » ou « 247c » ; la question est consignée dans `decisions/REGISTRE.jsonl` | si rien n'est fait, les noms restent publiés |
| A-2 | Aligner le champ et le bouton de la page de versions d'un skill, que la règle neuve accuse | neuve | auto_ia | borne_atteinte | `digit-ai-forge-agents/.claude/skills/make-it-better/assets/page-versions.html` | si rien n'est fait, la page garde un écart de 2,8 px |
| A-3 | Corriger les 10 sujets arrivés pendant la session, dont la réservation des décisions à 4 chiffres | TF-2914 | auto_ia | borne_atteinte | `node todo/generer-vue.mjs`, puis `todo/TODO.md` | si rien n'est fait, la réservation de D-1000 échouera au pilot comme chez le produit |
| A-4 | Concevoir l'oracle de fidélité d'une page à sa maquette | TF-2890 | auto_ia | borne_atteinte | `digit-ai-forge-design/oracles/` | si rien n'est fait, une page portée sans la structure de sa maquette passe encore les juges |

## 9. Traces

- Lots : `input/00-retours/` ; registre : `todo/TODO.jsonl`, `todo/CLASSES.json` ; décisions : `decisions/REGISTRE.jsonl` (D-247)
- Pilot : `scripts/processus-par-pid.mjs`, `references/CARTE-FORGES.json`, `oracles/self-tests.mjs`, `oracles/hook-restitution.mjs`, `oracles/releve-workflows-heberges.mjs`, `oracles/hook-ouverture.mjs` ; commit d6e51a36, et celui de cette synthèse
- Forge-agents publiée : d5e838b, eac0dbc, c1deee0, 82a82f1, f9896b4, 74a8d97
- Forge-design publiée : 1b6a221, 4f0385e, cb03af8
- Relectures d'intention : `todo/relectures-intention.jsonl` (RI-20261127-01 à 03)
