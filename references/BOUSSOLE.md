# Boussole de l'utilisateur — niveau, note sur 100 et état du projet

La boussole dit à chaque utilisateur de la Factory où il en est et quoi faire ensuite, sur tous ses projets et tous ses postes. Elle est née de l'étude `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121h.md` et de sa démarche `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121i.md`, construites sur le GO du porteur « Go L01 à L06 » du 21/11/2026. Le calcul vit dans `scripts/boussole.mjs` ; sa recette est `scripts/boussole.test.mjs`.

## 1. Ce que la boussole affiche

Le relevé d'ouverture (`oracles/hook-ouverture.mjs`, au pilot comme chez les produits) porte, juste après les gates, une section « Boussole de l'utilisateur ». La session la reprend telle quelle en tête de sa première réponse. Exemple :

```text
Boussole — vous : niveau 4 · 57/100. Ce projet : neuf, aucun run ouvert.
Dites par exemple : « Je veux créer un produit : … » · « Je veux concevoir pour un type de produit précis : … »
Services utiles pour aller plus loin : Audit forge-tests (forge-tests) · Sécurité du livrable (forge-websec).
Prochain jalon : première étape de mise en production close (+3).
```

Les phrases d'intention sont lues dans le tableau de routage de `references/ACCUEIL.md`, et les services dans `catalogues/catalogue.jsonl` (prouvés seulement, dans les forges que l'utilisateur n'a pas encore mobilisées) : rien n'est recopié dans le code.

## 2. Les deux dimensions

La boussole sépare ce qui suit l'utilisateur de ce qui appartient au projet ouvert.

- **Le niveau de l'utilisateur** se calcule sur les journaux de run (`forge/ledger.jsonl`) de tous les projets instrumentés de la racine du poste, plus le projet ouvert. Les copies d'un même projet (début de journal identique) comptent une fois.
- **L'état du projet** dit seulement le projet ouvert : neuf, existant, run en cours, ou le pilot.

## 3. Niveaux et note

Le tableau se lit du niveau 1 au niveau 5 : le niveau suivant s'atteint par le jalon de la dernière colonne, et chaque passage exige les précédents.

| Niveau | Nom | Ce que la boussole ajoute | Passage au suivant |
|---|---|---|---|
| 1 | Découverte | 3 phrases d'intention | J-01 premier livrable vert |
| 2 | Premiers résultats | lire les blocs 0 et 3, trouver ses livrables | J-02 première décision tranchée |
| 3 | Décideur | trancher une décision par sa lettre | J-03 premier run clos |
| 4 | Praticien | 5 services utiles | J-04 premier lot de retours, ou J-08 second run ouvert |
| 5 | Autonome | le prochain jalon seulement | — |

La **note** vaut le nombre de jalons prouvés sur 30, ramené sur 100 et arrondi ; chaque jalon vaut donc environ 3 points. Les 30 jalons : 8 gestes (J-01 à J-08), 5 étapes closes (J-09 conception à J-13 mise en production), 4 types de run (J-14 complet, J-15 version, J-16 mandat, J-17 conseil), 13 forges mobilisées (J-18 à J-30). La liste fait foi dans `JALONS` de `scripts/boussole.mjs`.

## 4. Niveau annoncé, question unique, contradiction

Trois règles tiennent la boussole honnête quand les traces manquent.

- **Annoncé** : l'utilisateur peut dire son niveau ; la session joue `node <pilot>/scripts/boussole.mjs --annoncer <1-5>`. Le niveau affiché porte « annoncé » ; la note ne compte que des jalons prouvés.
- **Contredit** : une décision ouverte tranchée sans sa lettre (hook du lexique, TF-1958) fait redescendre un niveau annoncé d'un cran ; l'annonce disparaît quand elle rejoint le prouvé.
- **Poste vierge** : sans aucune trace, aucune progression ni dossier synchronisé, la boussole demande une seule fois « Avez-vous déjà utilisé la Factory ailleurs ? » ; la réponse se joue par `--debutant`, `--annoncer <n>` ou `--recuperer`.

## 5. Progression et dossier synchronisé

La progression de l'utilisateur vit hors de tout dépôt, dans `~/.digit-ai/progression.json` (`FORGE_UTILISATEUR_DIR` le remplace sous recette) : niveau, note, jalons datés avec la nature de leur preuve, **aucun nom de projet ni chemin**. Quand l'utilisateur nomme un dossier synchronisé (Google Drive, OneDrive, Dropbox), la session joue `--declarer-canal "<dossier>"` ; à chaque calcul, la boussole lit `<dossier>/digit-ai-progression.json`, fait l'union des jalons (la date la plus ancienne gagne, aucun jalon ne se perd) et réécrit les deux copies. C'est le modèle du canal de reprise R-64, sans aucune API de service tiers : le dossier est synchronisé par le client du service.

## 6. Ce qui s'y raccorde

Chaque lot du 21/11/2026 se câble sur un fichier existant ; le tableau se lit par lot.

| Lot | Câblage |
|---|---|
| L-01 Boussole sur tous les projets | `scripts/boussole.mjs`, section du relevé dans `oracles/hook-ouverture.mjs` |
| L-02 Niveau annoncé et contenus | `--annoncer`, `--debutant`, `--contredire` ; skill `ou-en-suis-je` de forge-agents ; formule « où en suis-je ? » au lexique de `oracles/hook-lexique.mjs` |
| L-03 Traces normalisées | `gabarits/ledger.py` : `--type_run` à `run_open` et `--etape_norme` à `etape_close`, refusés hors liste, avertis absents ; lecture normalisée des journaux passés dans `scripts/boussole.mjs` |
| L-04 Progression synchronisée | `--declarer-canal`, `--recuperer` ; union des jalons à chaque calcul |
| L-05 Friction de premier tour | `estPremierTour` et `consignePremierTour` de `oracles/hook-lexique.mjs` : au premier message humain d'une session, la consigne de préjuger la réponse avant de l'afficher |
| L-06 Préférences par utilisateur | `fichierPreferences` de `scripts/boussole.mjs` : `~/.digit-ai/PREFERENCES-UTILISATEUR.md`, quand il existe, remplace `references/PREFERENCES-PORTEUR.md` dans le relevé |

## 7. Suivi des bénéfices

La première revue est fixée au 2027-01-15 dans la démarche par lots : sessions de produit au premier tour refusé (départ : 50 sur 76 du 22/10 au 21/11/2026), ouvertures de run qui déclarent leur type (départ : 8 sur 29), sessions dont le relevé porte la boussole, postes qui lisent un fichier de progression.
