# Étude — ce que les forges savent faire des bases de développement et de qualification

Étude du 29/10/2026, produite par l'exécution du prompt
`output\04-plans\Digit-AI - Prompt - Bases de donnees de dev et qualification dans les forges - 20261029a.md`.
Run de conseil ouvert depuis le pilot `digit-ai-factory`, lecture seule des dépôts, aucune base ouverte.

## Réponse

Aucun des trois scénarios n'est couvert par une forge au sens retenu : un script jugé par un oracle
et une paire de fixtures, pour au moins un moteur de forge-data ou la cible Docker local.

- **S1 — copie anonymisée de la production : absente.** Aucune forge ne masque une base. forge-tests
  l'a écartée par décision de cadrage : ses jeux sont « synthétiques uniquement ». 2 produits ont
  écrit leur propre outil, hors de toute forge.
- **S2 — jeu synthétique depuis une base vide : partiel.** forge-tests fabrique un jeu synthétique
  jugé, mais c'est un fichier JSON pour ses cahiers de tests, jamais chargé dans une base. Le pilot
  prescrit un seed de démonstration local, et son oracle ne juge que la fiche qui le décrit. La
  « fabrique de données » du contrat d'adaptateur de forge-tests est déclarée et non écrite.
- **S3 — remise à zéro à la demande : absente.** forge-tests monte une base neuve et y rejoue les
  migrations, mais pour juger ces migrations pendant un audit. forge-ops ne restaure que des
  releases de fichiers.

Ce que cela change pour un produit : il écrit lui-même son seed, son extrait anonymisé et sa remise
à zéro, sans gabarit ni oracle, et rien n'empêche un export de production d'arriver en recette.

## Comment ce relevé a été fait

Le relevé lit le pilot et les 13 forges à leur commit du jour, après `node bootstrap.mjs --pull`
(29/10/2026 à 09:34). Il cherche en français et en anglais : anonymis, pseudonymis, masquage,
masking, seed, faker, jeu de données, test data, subset, reset, truncate, `pg_dump`, `pg_restore`,
`db dump`, `sqlpackage`, branching, réinitialisation et vidage de base. Il exclut `output\`,
`input\`, `todo\`, les dépendances et les fichiers `.jsonl`. Chaque trouvaille a été relue à sa
ligne. Les 14 fiches de forge (`fiches\*.md`) ont été lues : aucune ne déclare de capacité sur les
bases de développement ou de qualification.

L'échelle de couverture, du plus faible au plus fort :

- *mention* : un texte en parle ;
- *gabarit* : un modèle à remplir ;
- *script* : un geste exécutable ;
- *script jugé* : un script avec un oracle et une paire de fixtures rouge et verte.

## Matrice scénario × forge

Chaque ligne est un dépôt à son commit ; chaque cellule donne le niveau atteint pour un scénario,
puis la preuve. Une cellule vide signifie qu'aucune trouvaille n'a survécu à la relecture. Les
lignes sont classées de la plus fournie à la plus vide ; seules les six premières portent une
trouvaille.

| Dépôt (commit) | S1 copie anonymisée | S2 jeu synthétique | S3 remise à zéro |
|---|---|---|---|
| forge-tests (1a4925f) | *mention*, contre : décision (c) « synthétiques uniquement », CDC du 02/08 ligne 513 ; garde-fou G-4, spec du noyau ligne 236 | *script jugé*, hors base : `forge_tests\livrables\jeux.py`, refus codés, recette README ligne 1673 ; capacité 4 « fabrique de données » non écrite, spec ligne 69, CDC ligne 187 | *script jugé*, finalité d'audit : migrations rejouées sur base neuve par testcontainers, README ligne 1451 |
| pilot (9d9bde7c) | | *gabarit* : `gabarits\docs-projet\COMMANDES.md:68-71`, `ACCES-TEST.md:13` ; règle 23 de `REGLES-PROJET.md` ; l'oracle juge la fiche, pas le seed (`references\EXIGENCES-PROJET.json:366`) | |
| forge-audit (ee0c944) | *mention* : ADR0506 ligne 49 « jeu de données représentatif mais non sensible pour les environnements amont » ; CTL-D16-04 (`core\controls\D16.json:117`), classification des colonnes personnelles, preuve Azure par masquage dynamique (`profiles\azure\bindings.json:244`) | *mention* : `core\dimensions\doctrine.yaml:1404` « Données de test représentatives en recette » | |
| forge-conception (5c23ab3) | *mention* : fixtures d'oracle seulement, « la recette se fait sur un extrait anonymisé » | *gabarit* : exigence de socle « données de démonstration invisibles en production », `schema-referentiel.md:178` | *mention* : branching Supabase lu dans sa seule page d'intégration GitHub, `patron-plateformes-workers-supabase-actions.md:258` |
| forge-data (3c14112) | *mention* : export `supabase db dump --data-only`, `references\profils-moteur\supabase.md:84` ; aucun masquage | | |
| forge-agents (2e2adfb) | *mention* : schéma d'exemple « Iso-prod · anonymisé », `digit-ai-schemas\assets\exemple-reference.html:1297` | | |
| forge-ops (5991a6b) | | | (`ops.mjs restaurer` ne couvre que les releases de fichiers, `ETAPE-MEP.md:29-32` du pilot ; restauration Supabase en dernier recours humain, `scripts\ops.mjs:493`) |
| forge-organization (b0ecaf5) | | (type « Jeu de donnees » au registre, `registre-types.json:154` : un nom, pas un outil) | |
| forge-development (bec2b5f) | | | |
| forge-design (10541a6) | | | |
| forge-seo-geo (8d26f1f) | | | |
| forge-observability (5e4bfad) | | | |
| forge-agents-security (279a7f1) | | | |
| forge-websec (ddade63) | | | |

Les cellules entre parenthèses ne montent à aucun niveau : elles disent pourquoi la case reste vide.

Mesuré sur : pilot et 13 forges aux commits de la matrice, relue à 09:40, périmètre 14 dépôts.

## Contradictions de doctrine

2 règles écrites s'opposent au scénario S1 ; l'étude les décrit sans les trancher.

- **forge-tests, décision (c) du cadrage** (`docs\Digit-AI - CDC Forge - Framework Tests - 20260802a.md`,
  ligne 513) : « synthétiques uniquement, ce qui rend le garde-fou G-4 automatiquement tenu et
  supprime toute question d'anonymisation ». La docstring de `forge_tests\livrables\jeux.py` le
  redit : « rien de ce qui sort d'ici ne vient du produit audité ». Une copie anonymisée de la
  production rouvre la question que cette décision ferme.
- **forge-audit, ADR0506** : la séparation des environnements « exige un jeu de données
  représentatif mais non sensible ». La règle admet une donnée issue de la production si elle n'est
  plus sensible, ce que forge-tests refuse par principe. Les deux lectures ne donnent pas le même
  verdict sur un extrait masqué.

Un troisième écart touche l'anonymisation elle-même. Une pseudonymisation déterministe garde une
donnée personnelle au sens du RGPD ; la barre d'une anonymisation est l'avis 05/2014 du groupe de
l'article 29 (individualisation, corrélation, inférence). Aucun texte de la Factory ne pose cette
distinction.

## Outils déjà écrits chez les produits

Le relevé a lu les fichiers suivis de 23 produits instanciés, sans rien y écrire. Cinq portent un
outil pertinent ; 17 n'en portent aucun, et un sixième ne montre que des fixtures de test.

- **Produit-01** : `backend\scripts\anonymize.py`, 422 lignes, deux modes. `synthesize` génère un
  jeu entièrement synthétique ; `pseudonymize` remplace les colonnes personnelles d'un export par
  des valeurs déterministes sous clé secrète. Il est né d'une remédiation d'audit citée « REM-ADR0620 »,
  absente de forge-audit dans toute son histoire. Son mode `pseudonymize` produit une donnée
  pseudonymisée, pas anonymisée.
- **Produit-77** : `scripts\generer-extrait-anonymise.mjs`, 219 lignes. Il produit un extrait
  anonymisé d'un classeur réel qui garde sa structure (feuilles masquées, formules et valeurs en
  cache, cellules fusionnées) et retire toute identité. Il répond à une exigence bloquante du
  produit qui interdit la donnée réelle en test.
- **Produit-61** : `backend\app\seed.py`, seed applicatif.
- **Produit-71** : script `prisma:migrate`, qui crée la base absente avant les migrations.
- **Un produit absent de la table des pseudonymes** : un seed de démonstration et cinq migrations
  qui chargent des données de référence.

Ces outils sont la matière d'une compétence de forge : deux d'entre eux règlent déjà S1 sur leur
périmètre, chacun à sa façon, sans oracle commun.

## Manques remontés au registre

Chaque manque entre au registre en `candidat`, par `node todo\journaliser.mjs` ; la décision de
construire revient au porteur.

| Item | Scénario | Forge pressentie | Manque |
|---|---|---|---|
| TF-2011 | S1 | forge-data, avec forge-tests | aucune copie anonymisée, et la doctrine de forge-tests l'écarte |
| TF-2012 | S2 | forge-tests, avec forge-data | capacité 4 « fabrique de données » déclarée et non écrite ; aucun seed chargé en base |
| TF-2013 | S3 | forge-ops, avec forge-tests | aucune remise à zéro d'une base hors production |
| TF-2014 | S1 et S2 | forge-audit | aucun contrôle opposable sur la donnée personnelle hors production |

Le tableau se lit ligne par ligne : un item, le scénario qu'il couvre, la forge qui le porterait,
puis le manque mesuré ci-dessus.
