---
destinataire: humain
---

# Synthèse Mandat — réponses 75c, 76c, 77b, 78c et 80b : quatre chantiers lancés, D-79 expliquée (26/10/2026)

## 0. Synthèse d'ouverture

Vos réponses sont prises avec leurs amendements : une seule décision groupée pour tous les gestes destructifs d'un tour, une réécriture automatique au lieu d'un blocage pour les écrits trop longs, et la langue de l'utilisateur comme langue attendue. La recommandation de l'œil critique s'affiche désormais toujours. Quatre chantiers de code tournent en parallèle, chacun dans un arbre de travail isolé ; je les vérifie et les fusionne à leur retour. Pour D-79, la recommandation (b) tenait au conflit avec T2 ; lancée maintenant, T2 rend (c) préférable juste après elle, et je repose la décision en entier.

## 1. En-tête d'identification

Point d'étape · exécution de vos réponses D-75 (c), D-76 (c), D-77 (b) amendée, D-78 (c) amendée et D-80 (b) · sur le pilot digit-ai-factory et la forge digit-ai-forge-agents · le 26/10/2026 à 16:02 (heure de Paris, UTC+1) · Claude Opus 5.5, commit 97f5c198 au pilot, 4 agents lancés à 16:00.

Intention : réduire vos interventions et les refus de forme, tout en vous laissant la maîtrise des gestes risqués et des choix de doctrine. Test rétro : le tour sert l'intention, car chaque amendement que vous avez écrit est porté mot pour mot dans la consigne de son chantier.

## 2. Ce qui reste à mesurer, et par quoi

- T2 et la réponse courte élargie : par la recette `oracles/hook-restitution.test.mjs` et la taille de `gabarits/RESTITUTION.md`, au retour de l'agent constructeur.
- Barrière des décisions sans lettre, gestes destructifs groupés, concision et langue rejouées : par les recettes que chaque agent ajoute, rejouées par moi avant la fusion.

## 3. Décisions attendues

> **D-79 — Faut-il avancer, avant T2 et T3, le contrôle de fin de tour qui exige forge-audit et forge-data quand la demande les appelle ?**
>
> - **De quoi s'agit-il** : la part de T4 (TF-1949) qui vérifie, avant « livré », la trace des forges que la demande appelle, ou T4 entière : carte des forges, 13 verdicts motivés, verrou et héritage réduit.
> - **Le problème** : aucune trace de forge-audit sur une douzaine de demandes d'audit, aucune de forge-data sur les demandes de données. Vous demandez pourquoi la recommandation était (b) et non (c) : T4 entière modifie le même hook de fin de tour que T2, que votre réponse 75c vient de lancer ; menées ensemble, les deux campagnes se marcheraient dessus. Une fois T2 fusionnée, ce conflit disparaît et (c) apporte plus.
> - **Pourquoi vous** : c'est l'ordre des transformations que vous avez arrêté par 69a.
> - **Recommandation : (c)** — T4 entière ferme l'oubli de toutes les forges, pas seulement audit et data, et elle peut partir dès la fusion de T2, sans conflit. La recommandation scellée à 15:15 était (b), avant votre réponse 75c ; elle reste au journal. Source consultée : diagnostic 20261026a, §d-T4, et la consigne du chantier T2.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Garder l'ordre de T4, après T3 | Les forges audit et data restent oubliées jusque-là | nul | sans objet |
| **(b)** Avancer le seul contrôle audit et data, maintenant | Une règle de fin de tour ; le reste de T4 garde son ordre | simple × court | retirer la règle |
| **(c)** *(recommandée)* Lancer T4 entière dès la fusion de T2 | Carte, 13 verdicts motivés, verrou et héritage réduit, sans attendre T3 | moyen × moyen | revenir à l'ordre de 69a |

> **Sans réponse** : (a), T4 garde son ordre.

## 4. Traité

- Choix notés au journal du scellé par `scelle.mjs devoiler` : D-75 c, D-76 c, D-77 b, D-78 c ; bilan 4 accords sur 4, recommandation vue avant le choix.
- D-80 (b) appliquée :
  - skill `oeil-critique` 1.1.2 : la recommandation est scellée puis affichée ; forge publiée, `0 0` avec GitHub, installé sur les 2 profils ;
  - `gabarits/RESTITUTION.md` : la variante « recommandation scellée » est retirée, gardée comme historique ; `oracles/hook-restitution.test.mjs` 56/56.
- Registre : TF-1958 (D-76), TF-1959 (D-77 amendée), TF-1960 (D-78 amendée) créés et décidés ; TF-1947 (T2) passé en cours ; `journaliser` 8 événements écrits ; commit 97f5c198.
- Quatre agents lancés à 16:00, chacun dans un arbre de travail isolé, sur des fichiers disjoints :
  - constructeur : T2 et réponse courte pour tout tour sans écriture (`oracles/hook-restitution.mjs`, `gabarits/RESTITUTION.md`, `references/NIVEAUX.md`) ;
  - campagne : barrière des décisions sans lettre (`oracles/hook-lexique.mjs`, une ligne de préférence) ;
  - campagne : gestes destructifs distants approuvés en un seul lot, hook PreToolUse neuf ;
  - campagne : concision et langue d'un écrit destiné à un tiers, rejouées 3 passes au plus au lieu de bloquer (`oracles/oracle-ecriture.mjs`).
- Relecture d'intention : sans objet pour ce point d'étape, les livrables de code ne sont pas encore rendus.

## 5. Non traité

- Fusion et vérification des 4 chantiers : en attente de leur retour.
- Publication du pilot : non faite, plusieurs commits locaux depuis 15:01 ; elle suivra la fusion.

## 6. Écarts à la lettre

Aucun écart : chaque amendement de votre réponse est repris dans la consigne de son chantier, mot pour mot pour D-77 et D-78.

## 7. Risques

- Énoncé : T2 retire la plupart des blocages du hook de fin de tour. Signal : une restitution qui perd une information utile à votre reprise. Parade : l'agent doit lister les règles restées bloquantes et pourquoi ; je relis cette liste avant la fusion.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 dépend du retour des agents, A-2 de votre réponse à D-79.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1947 | Vérifier, fusionner et publier les 4 chantiers | auto_ia | dependance_externe | retour des 4 agents lancés à 16:00, recettes rejouées, puis `git push origin main` | les décisions restent sans effet |
| **A-2** | TF-1949 | Lancer T4 selon votre réponse à D-79 | auto_ia | dependance_bloc_3 | réponse « 79c » ou autre lettre | les forges audit et data restent oubliées |
| **A-3** | TF-1957 | Lancer l'analyse d'œil critique sur l'autre poste | manuelle_utilisateur | presence : `extraire.mjs` ne lit que les transcripts de ce poste | taper « œil critique » dans une session du pilot de l'autre poste | la moitié des échanges reste non analysée |

## 9. Traces

- `todo/oeil-critique-scelles.jsonl`, choix de D-75 à D-78.
- `todo/TODO.jsonl`, TF-1947 et TF-1958 à TF-1960.
- `gabarits/RESTITUTION.md`, variante retirée ; forge digit-ai-forge-agents, skill `oeil-critique` 1.1.2.
- Commit 97f5c198.
