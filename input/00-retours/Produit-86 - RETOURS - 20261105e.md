# Retours forges — Produit-86 — 20261105e

- **Contexte** : run `20261105b-evolution-e2e-complet-et-hygiene`, lettre « 472a » du porteur (ledger seq 531), qui exécute le prompt de la revue L99 20261105b. Le porteur demandait : « Remonte à la Factory pourquoi ces éléments n'ont pas été implémenté d'office dans la chaine de construction de l'application dès son démarrage et ce qui doit être mis en place pour que ce soit le cas les prochaines fois […] Ce n'est pas normal que ce soit moi qui m'en aperçoive au bout de 3 jours de développement », et, sur la machine Azure : « Pourquoi une demande changeant la cible pour la machine à utiliser n'a pas proposé d'office D-471 directement ».
- **Références ledger** : `forge\ledger.jsonl` seq 536 à 542 (entrées `type: retour`) ; retours antérieurs cités : seq 245 (lot 20261103c), RP-17 (lot 20261105b), RP-24 (lot 20261105c), RP-26 (lot 20261105d).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 241 classes, filtré sur `inventaire|composant|todo-produit|générat|journal|accroche|exigences-tenues|remplac|severite-declaree`. Classe existante retenue : `exigences-tenues-sans-parcours-des-personas` (RP-27, RP-28). Quatre retours proposent la leur, dans une famille existante : `inventaire-de-composants-sans-controle-de-fraicheur` (RP-29, famille `regle-morte`), `decision-remplacee-sans-retrait-de-ses-artefacts` (RP-30, déjà proposée par le lot 20261105d), `controle-produit-sans-accroche-de-run` (RP-31, famille `hook-ou-gate`), `page-generee-par-le-pilot-hors-oracles` (RP-32, famille `page-html-socle`), `journal-de-hook-dans-l-arbre-du-produit` (RP-33, famille `hook-ou-gate`).

## Pourquoi ce n'a pas été fait d'office — les causes mesurées

Les tests de bout en bout entre profils manquaient au 3ᵉ jour pour quatre raisons :
- 27 exigences sur 127 seulement étaient citées par un test de bout en bout ;
- 9 cases parcours × rôle sur 30 étaient couvertes ;
- les deux règles qui l'exigent (TF-1766, TF-2124) ne font qu'avertir ;
- chaque `run_close` du 03/11 au 05/11 a déclaré « prêt, en attente du GO » sur un forge-tests PARTIEL.

La machine Azure est restée pour deux raisons :
- la consigne qui la remplaçait n'a laissé aucune trace de ce qu'elle remplaçait ;
- l'inventaire des composants n'a pas été tenu à jour, et aucun oracle n'en juge la fraîcheur.

Le détail est au chapitre « Pourquoi ce n'a pas été fait d'office » de `output/Produit-86 - Étude - Couverture de bout en bout par parcours et par profil - 20261105c.md`.

## pilot (doctrine des runs, oracles, ledger, générateurs, hooks)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-27 | bloquant | générique | Au 3ᵉ jour, aucun test de bout en bout n'enchaînait les deux profils jusqu'aux jobs Docker ; 27 exigences sur 127 citées par un test de bout en bout, 9 cases parcours × rôle couvertes sur 30. TF-1766 et TF-2124 ne font qu'avertir ; les `run_close` seq 371, 418 et 521 ont déclaré « prêt » sur un forge-tests PARTIEL. Nouvelle occurrence de RP-17 (lot 20261105b), après le retour seq 245 (lot 20261103c) : troisième remontée du même manque, gravité montée. Ledger seq 536. | À la création d'un parcours au référentiel, exiger son test de bout en bout par rôle (ou un « sans objet » motivé) avant la clôture du run ; rendre TF-1766 et TF-2124 bloquantes dès le démarrage ; refuser un `run_close` « prêt » sur un forge-tests PARTIEL non motivé. |
| RP-29 | majeur | générique | `docs/projet/COMPOSANTS-OPS.md` est resté au texte du premier commit (03/11 à 11:31) pendant trois déploiements : ni la machine Azure, ni le Docker local, ni Foundry, et « Aucun composant inutilisé ». R-20 juge le vocabulaire des statuts, pas la fraîcheur face aux ressources réelles. Ledger seq 538. | À l'étape MEP, comparer l'inventaire aux sorties d'état (`ops.mjs etat`, `terraform state list` de chaque pile, `docker ps` filtré, `az resource list` des groupes déclarés) et refuser « prêt » sur un composant présent non inventorié. |
| RP-30 | majeur | générique | La consigne du 04/11 remplaçant la décision « 46b » a été consignée en « instruction directe », sans champ qui dise ce qu'elle remplace ni liste des artefacts à solder ; le porteur a dû demander la suppression lui-même. Reprend RP-26 (lot 20261105d) avec la question explicite du porteur. Ledger seq 539. | Ajouter `remplace` au vocabulaire de `reponse_humain` dans `ledger.py` et `ledger.mjs` ; quand il est posé, la session liste les artefacts de la décision remplacée et pose d'office la décision de leur sort, dans le même tour. |
| RP-31 | majeur | générique | Le produit a écrit un contrôle d'hygiène (E-128) qu'il ne peut accrocher ni à l'ouverture ni à la clôture d'un run : `forge/ledger.py` est un gabarit du pilot et `forge/hooks/factory.mjs` un relais. Ledger seq 540. | Une clé de `forge/PROFIL.json` (par exemple `controles_de_run`) que le hook de la factory joue à `run_open` et `run_close`, en avertissement, sortie au ledger. |
| RP-32 | mineur | générique | `todo/generer-todo-produit.mjs` produit une `TODO-PRODUIT.html` qui rend 7/11 à `run-oracles-design` en page éditoriale (S1, T3, V1 en clair et en sombre), à l'identique sur la version précédente. Ledger seq 541. | Rendre le gabarit du générateur conforme aux oracles de forge-design et jouer la critique dans sa recette. |
| RP-33 | mineur | générique | Le hook des rappels de leçons écrit `forge/lecons-rappels.jsonl` dans l'arbre du produit, non suivi par git, avec les commandes de la session ; un chemin du poste y a été lu comme un secret par le balayage E-082 du produit (pytest rouge, valeur de 113 caractères). Ledger seq 542. | Écrire ce journal hors de l'arbre du produit, ou l'ignorer par git et le déclarer aux produits comme journal de la factory. |

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-28 | majeur | générique | Le pan `parcours-personas` (TF-2123) rejoue en GET les routes d'un parcours sous chaque identité ; il ne juge aucun enchaînement entre profils (l'opérateur prépare, l'approbateur valide, l'agent agit, l'opérateur voit), demandé trois fois par le porteur (seq 193, 241, 450). Le test `test_parcours_complet.py` a dû être écrit à la main. Nouvelle occurrence de RP-17. Ledger seq 537. | Un pan qui joue, depuis `forge/matrice-droits.json` et une couverture déclarée, la suite des actions mutantes d'un parcours sous chaque profil, avec la contre-épreuve de chaque interdit. |

## Ce qui doit être mis en place pour que ce soit fait d'office

- **Au démarrage d'un produit** : un parcours déclaré n'existe qu'avec son test de bout en bout par rôle, ou son « sans objet » motivé (RP-27, RP-28).
- **À chaque développement** : une exigence ajoutée porte son test au même commit ; c'est déjà la règle du produit, que l'oracle d'exigences pourrait juger.
- **À chaque déploiement** : l'inventaire des composants est confronté aux ressources réelles (RP-29).
- **À chaque décision qui en remplace une autre** : ses artefacts sont listés et soldés dans le tour (RP-30).
- **À chaque run** : les contrôles du produit sont rejoués à l'ouverture et à la clôture (RP-31).

## La règle qui aurait évité le retour

- `inventaire-de-composants-sans-controle-de-fraicheur` (RP-29) : un inventaire n'est vrai qu'à la date où un oracle l'a comparé aux ressources réelles.
- `decision-remplacee-sans-retrait-de-ses-artefacts` (RP-30) : une décision qui en remplace une autre solde dans le même tour tout ce que la première a créé.
- `controle-produit-sans-accroche-de-run` (RP-31) : un contrôle que le produit ne peut pas faire jouer à chaque run n'est rejoué que si quelqu'un y pense.
- `page-generee-par-le-pilot-hors-oracles` (RP-32) : une page générée par le pilot passe les oracles qu'elle impose aux produits.
- `journal-de-hook-dans-l-arbre-du-produit` (RP-33) : un journal de la factory ne s'écrit pas dans l'arbre de travail d'un produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le test existant de l'agent IA attendait « Dernier tour de l'agent IA », libellé jamais servi (« Dernier tour de tests ») : sa boucle tournait 120 s à vide, puis lisait le message quand même | attente sur `.message--attente` « Dernier tour » ; 135 s → 19 s | non, défaut du test du produit | erreur de test, corrigée |
| E-112 et E-127, écrites par la session le 05/11, échouaient à `oracle-exigences` (absolus, terme subjectif) | reformulées ; `oracle-exigences` PASS | non | erreur de rédaction, corrigée |
| Lab WebGoat « unhealthy » au `docker ps` | non diagnostiqué ; le test complet vise Juice Shop | non | reste au produit, parce que c'est l'état d'un conteneur de ce poste |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105d) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- La contre-épreuve (mandat non signé : 409 `AGENT_INDISPONIBLE`) a été écrite avant le test nominal, et elle est passée du premier coup en local comme en préproduction.
- La lecture du journal et de la base servie a montré en une minute que l'échec du test complet venait du test, pas de l'application : un libellé jamais servi.

## Ordre recommandé

RP-27 et RP-28 d'abord (troisième remontée du même manque), puis RP-29 et RP-30 (le cas de la machine Azure), puis RP-31, puis RP-32 et RP-33.
