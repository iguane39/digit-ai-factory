# Série d'animations « La Factory Digit-AI en action » : cadrage et cinq épisodes

## Rôle et lieu

Tu es la session de production marketing de Digit-AI. Tu travailles dans le dépôt produit privé
`C:/dev/digit-ai-marketing` : le run vit chez le produit, jamais dans le pilot
`C:/dev/digit-ai-factory`. Tu suis la doctrine du pilot (son `CLAUDE.md` et
`references/ETAPES-RUN.md`) ; en cas de conflit avec une règle du produit, la règle du pilot prime
(R-43, règle de précédence du pilot : renforcer oui, assouplir jamais).

## Intention du demandeur, mot pour mot

« je souhaite créer une série de plusieurs animations qui permettent de présenter des pans
fonctionnels spécifiques de la Factory et ses forges :
- La plateforme d'ingénierie logicielles avec la fiche produit, les spécifications fonctionnelles et
  techniques, le design, l'implémentation avec Epic/Sprint, TDD, les tests automatisés et le
  déploiement
- L'analyse Data de l'existant avec l'IA, la massification de ces analyses, la construction
  automatisée des résultats et consolidations, la construction d'une cible sur la Data Platform,
  l'implémentation des couches Bronze, Silver & Gold, avec les modèles de données, l'implémentation
  des flux et les tests de données de bout en bout.
- La construction d'une stratégie de tests de bout en bout, son implémentation et son exécution, et
  la correction des anomalies remontées, permettant de garantir une qualité logicielle sur les
  produits utilisant la Factory.
- Les principes d'amélioration continue de la Factory, avec les remontées des produits permettant de
  fournir les retours à la Factory, s'améliorant au fur et à mesure des produits conçus avec elle.
- Le SEO/GEO sur les sites Web...
Propose d'autres idées d'animations à construire pour vendre les qualités de la Factory & ses
forges. »

Le but est commercial : chaque animation fait comprendre à un décideur ce que la Factory fait pour
lui, en moins de 2 minutes, sans rien affirmer que les forges ne font pas.

## ÉTAPE 0 — remesurer avant d'écrire

Toutes les commandes de ce prompt se jouent dans l'outil Bash (Git Bash), jamais dans PowerShell,
qui n'a ni `which` ni `date +%s`. Les chemins s'y écrivent en slashs (`$HOME/.claude/skills/…`,
`C:/dev/…`).

Chaque mesure s'écrit dans le cadrage, section « Relevé d'ouverture », avec la commande, son
résultat et l'heure relevée par `date` dans la même commande.

1. **Lieu.** `git rev-parse --show-toplevel` doit rendre le dépôt `digit-ai-marketing`. Sinon,
   arrêter et le dire.
2. **Outils de rendu.** `node --version`, `which ffmpeg`, et
   `python -c "import playwright; print('pw ok')"` : c'est le Playwright Python, celui de
   `render_page.py`, qui sert au chronométrage ; `npx playwright` n'est pas installé dans ce dépôt
   et ne s'emploie pas. FFmpeg était
   absent du poste le 09/11/2026 : s'il l'est encore, aucune vidéo MP4 n'est produite, et le
   cadrage le dit. Ne rien installer.
3. **Oracles.** Vérifier que ces fichiers existent :
   - `C:/dev/digit-ai-forge-design/oracles/oracle-motion.mjs` et
     `C:/dev/digit-ai-forge-design/oracles/run-oracles-design.mjs` ;
   - `$HOME/.claude/skills/digit-ai-page-html/scripts/check_html.py`, `render_page.py` et
     `check_markdown.py` ;
   - `$HOME/.claude/skills/quality-oracles/scripts/oracle-claims.mjs` (la version des livrables, qui
     accepte `.md` et `.html` ; pas celle de forge-conception, qui lit un `EXIGENCES.json`) et
     `$HOME/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs`.
   Un oracle absent, ou qui ne sait pas juger l'objet qu'on lui donne, s'écrit « non jugé » dans
   le cadrage avec sa raison. Il ne compte jamais comme un PASS et ne se remplace pas par une
   relecture.
4. **Marque.** Lire `donnees/marque/MARQUE.md`, `DESIGN.md` et `LIVRABLES.md`. La table des types
   de livrables de `LIVRABLES.md` va de L1 à L11 au 09/11/2026 et ne contient aucune animation : le
   cadrage propose une ligne L12 (public, format, skill, gates, sortie), sans modifier
   `LIVRABLES.md`.
5. **Preuves par capacité.** Pour chaque capacité nommée dans l'intention, chercher sa source dans
   les forges (`git -C C:/dev/<forge> grep -n -i "<terme>"`) et dans le pilot (`INVENTAIRE.md`,
   `fiches/<forge>.md`). Classer chaque capacité :
   - **attestée** : une source dit que la forge le fait, et un oracle, un gabarit ou un script
     l'outille ;
   - **partielle** : citée sans outillage, ou faite chez des produits construits avec la Factory
     et non par une forge ;
   - **absente** : aucune source.
   Relevé du 09/11/2026, à reconfirmer et non à recopier :
   - TDD : `git grep -l -w TDD` rend 2 fichiers de `digit-ai-forge-development` (4 sans `-w`),
     aucun oracle de la forge ne le contrôle ;
   - « fiche produit » : 0 occurrence dans `digit-ai-forge-conception`, qui produit un PRD et un
     `EXIGENCES.json` ;
   - le `CLAUDE.md` de `digit-ai-forge-data` dit qu'elle « vérifie la forme de la discipline, pas
     le contenu des données » : l'implémentation des couches Bronze, Silver, Gold et des flux se
     fait chez les produits ;
   - Epic et Sprint : cités dans 93 fichiers de `digit-ai-forge-development`.

## Les cinq épisodes demandés

Chaque ligne donne le pan, les forges où chercher les preuves et le décideur à qui l'épisode parle.

| # | Pan | Forges à lire | Décideur visé |
|---|---|---|---|
| 1 | Ingénierie logicielle : fiche produit, spécifications fonctionnelles et techniques, design, Epic et Sprint, TDD, tests automatisés, déploiement | forge-conception, forge-design, forge-development, forge-tests, forge-ops | DSI, directeur technique |
| 2 | Data : analyse de l'existant par l'IA, massification, résultats et consolidations automatiques, cible Data Platform, couches Bronze, Silver, Gold, modèles de données, flux, tests de données de bout en bout | forge-data, forge-tests | directeur des données |
| 3 | Tests de bout en bout : stratégie, implémentation, exécution, correction des anomalies | forge-tests | responsable qualité, DSI |
| 4 | Amélioration continue : retours des produits par lots, registre du pilot, forges qui progressent | pilot (`BOUCLE-AMELIORATION.md`, `references/TODO-FORGE.md`) | direction de la transformation |
| 5 | SEO et GEO des sites web | forge-seo-geo | direction du marketing digital |

Une capacité **partielle** se montre pour ce qu'elle est, par exemple « chez les produits construits
avec la Factory » plutôt que « la forge data implémente ». Une capacité **absente** ne se montre pas
et se liste dans le cadrage.

## Ce qu'est une animation dans cette série

- **Format** : une page HTML autoportante, un seul fichier sans ressource réseau, qui joue un
  scénario animé en CSS et JavaScript. Lecture, pause, scène précédente et suivante, à la souris et
  au clavier.
- **Durée** : 60 à 120 secondes en lecture continue, de 5 à 8 scènes.
- **Manifeste de scènes** : chaque page déclare ses scènes en JSON, entre les marqueurs
  `/* SCENES:debut */` et `/* SCENES:fin */`, sous la forme
  `const SCENES = [{ "titre": "", "texte": "", "duree_ms": 0, "preuves": ["P-01"] }]`. Ce tableau
  pilote la lecture. `preuves` cite les identifiants de la table « Preuves » que la scène affirme.
  À la fin de la dernière scène, la page pose `document.body.dataset.etat = "fin"`.
- **Table « Preuves » du cadrage** : colonnes `id | capacité | pan | source | statut | relevé le`,
  `id` au format `P-NN`, `statut` parmi `attestée`, `partielle`, `absente`. `source` vaut
  `chemin:ligne`, le chemin relatif à `C:/dev` (`digit-ai-forge-data/CLAUDE.md:14`), découpé au
  dernier deux-points ; une capacité `absente` porte `—`.
- **Scène** : un titre de 8 mots au plus, un texte de 25 mots au plus, un visuel animé (schéma de
  flux, artefact figuré : nom de fichier, verdict d'oracle, extrait de tableau). Ni voix off, ni
  musique.
- **Fil commun** : le problème du décideur, ce que la Factory fait étape par étape, un artefact
  réel figuré, ce que le décideur y gagne. Un chiffre affiché porte sa source et sa date dans la
  table « Preuves » du cadrage.
- **Accessibilité** : `prefers-reduced-motion` respecté par une version sans mouvement lisible,
  contraste AA, texte réel et non image de texte.
- **Charte** : les jetons de `donnees/marque/`. Un rendu générique est un défaut (loi 6 du pilot).

## Autres idées d'animations

Propose au moins 6 idées en plus des 5 épisodes. Pour chacune : capacité vendue, décideur visé,
forges mobilisées, preuve (chemin), statut attesté ou partiel, effort en épisodes-équivalents, rang.
Pistes à vérifier contre les preuves, sans les retenir d'office :
- un run complet, de l'idée à la mise en production, en 90 secondes ;
- « un ✓ sans oracle exécuté n'est pas un ✓ » : la qualité jugée par des oracles (`quality-oracles`) ;
- la sécurité du livrable et des agents (forge-websec, forge-agents-security) ;
- l'audit d'un produit existant (forge-audit) ;
- la reprise d'un produit existant par rétro-modèle (skill `qualifie-l-entrant`) ;
- la direction artistique dérivée de la marque (skill `systeme-de-marque`) ;
- la mise en production gardée par un GO humain (forge-ops, `ETAPE-MEP.md` du pilot) ;
- la traçabilité des exigences jusqu'aux tests.

## Ordre d'exécution

1. ÉTAPE 0, puis les deux scripts de contrôle (`controle-serie.mjs`, `chronometre-lecture.py`),
   chacun validé sur ses fixtures rouge et verte avant toute page.
2. Le cadrage : relevé, table des preuves, storyboard des 5 épisodes, idées, proposition L12.
3. Les épisodes 1 à 5, dans l'ordre et dans le même run, chacun jugé par le protocole ci-dessous.
   Un épisode qui obtient tous ses PASS ouvre le suivant. Un épisode encore en échec après 3
   itérations est livré marqué « non conforme », ses écarts consignés au cadrage, et le suivant
   démarre quand même. Exception : un écart de nom réel, de donnée client ou de capacité
   « absente » à l'écran arrête la série ; la restitution le dit.
4. Restitution de fin de tour selon `gabarits/RESTITUTION.md` du pilot. Si le tour s'interrompt
   avant l'épisode 5, elle nomme le dernier épisode jugé.

## Garde-fous

- Aucun nom réel de client ni de produit, ni à l'écran ni dans les fichiers. Un produit se désigne
  par son secteur générique (« un acteur de l'immobilier commercial »).
- Aucune donnée client : les artefacts figurés viennent des fixtures synthétiques des forges.
- Rien ne se publie : les fichiers restent sur disque, dans `output/` du produit. La mise en ligne,
  sur le site ou sur un réseau, attend un GO humain (R-38 du pilot).
- Aucune installation de logiciel, aucune API payante, aucun service hébergé.

## Livrables et noms

Les noms suivent `<Projet> - <Type> - <Objet> - AAAAMMJJ<indice>.<ext>` : le projet ouvre le nom
(R-4 du pilot), le type est le premier mot du 2ᵉ segment et figure au registre
`C:/dev/digit-ai-forge-organization/registre-types.json` (R-25 du pilot). Sortie :
`output/03-publications/`. L'indice de chaque fichier s'obtient par
`node C:/dev/digit-ai-factory/scripts/allouer-indice.mjs --dossier output/03-publications --prefixe "<nom sans date>" --jour AAAAMMJJ --extension <.md ou .html>`.
Le script ne réserve rien : deux appels sans fichier écrit entre eux rendent la même lettre.
Écrire chaque fichier sous son nom avant d'allouer l'indice du suivant.

- `Digit-AI - Cadrage - Série d'animations de la Factory - AAAAMMJJ<indice>.md` ;
- 5 fichiers `Digit-AI - Présentation - Animation <n> <pan> - AAAAMMJJ<indice>.html`.

## Contrat de sortie

- **Cadrage** : sections « Relevé d'ouverture », « Preuves » (une ligne par capacité des 5 pans,
  avec source et statut), « Storyboards » (5 épisodes de 5 à 8 scènes), « Autres idées » (6 au
  moins, 7 colonnes), « Proposition L12 », « Non jugé ». `check_markdown.py` rend exit 0.
- **Chaque animation** : un fichier, 0 requête réseau, commandes au clavier, version
  `prefers-reduced-motion`. Chaque contrôle a son juge, qui ne juge que son objet :

  | Contrôle | Juge et commande |
  |---|---|
  | 5 à 8 scènes ; somme des `duree_ms` entre 60 000 et 120 000 ; titres de 8 mots au plus, textes de 25 au plus ; chaque identifiant de `preuves` existe dans la table « Preuves » avec le statut attesté ou partiel | `scripts/controle-serie.mjs <fichier.html> <cadrage.md>`, écrit par la session dans le dépôt, avec une fixture rouge et une verte qu'il doit distinguer avant de juger une page |
  | durée réelle de la lecture continue, à 10 % près de la somme déclarée | `python scripts/chronometre-lecture.py <fichier.html>`, écrit par la session : ouvre la page dans Chromium sans fenêtre, lance la lecture, attend `data-etat="fin"` (150 s au plus) et imprime la durée en millisecondes ; sa fixture verte, 2 scènes de 1 000 ms, doit mesurer 2 000 ms à 10 % près ; Playwright Python absent à l'ÉTAPE 0 : « non jugé » |
  | charte, accessibilité, impression | `python $HOME/.claude/skills/digit-ai-page-html/scripts/check_html.py <fichier.html>` exit 0 |
  | rendu sans défaut visuel, sans requête réseau | `python $HOME/.claude/skills/digit-ai-page-html/scripts/render_page.py <fichier.html>` PASS |
  | finition des transitions CSS (règles R1 à R14) ; ne mesure ni la durée du scénario ni les textes | `node C:/dev/digit-ai-forge-design/oracles/oracle-motion.mjs <fichier.html>` PASS |
  | critique d'implémentation, jouée en dernier parmi les juges de la page : `stat -c %Y <fichier.html>` relevé juste avant et juste après la commande, dans le même appel ; le verdict ne compte que si les deux valeurs sont égales, et elles s'écrivent au cadrage ; toute retouche de la page, même après le contrôle des noms, refait la critique | `node C:/dev/digit-ai-forge-design/oracles/run-oracles-design.mjs <fichier.html> --rendu --type-page editoriale --tokens donnees/marque/tokens.css` |
  | aucun montant sans source | `node $HOME/.claude/skills/quality-oracles/scripts/oracle-claims.mjs <fichier.html>` PASS ; il ne juge pas les affirmations de capacité, que juge `controle-serie.mjs` |
  | aucun nom réel de client ou de produit | à chaque épisode, le cadrage et les pages déjà produites, puis à la fin les 6 fichiers, copiés seuls dans un dossier temporaire neuf, `git init`, `git add` et un commit initial au message neutre (« série »), et `node $HOME/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs <ce dossier>` PASS ; jamais sur le dépôt entier, privé, qui peut garder des noms |

- 0 capacité « absente » à l'écran : toute affirmation passe par une scène du manifeste et ses
  `preuves`.

## Protocole de tests du livrable

- **Jeu d'essai** par épisode : lecture continue complète ; lecture avec `prefers-reduced-motion` ;
  navigation au clavier seul ; ouverture sans réseau.
- **Boucle bornée** : produire, juger contre le contrat, corriger, 3 itérations au plus par épisode
  (déléguer au skill `la-boucle` s'il est installé). Après 3 passes en échec, appliquer la règle
  de l'« Ordre d'exécution », point 3, et livrer avec la liste
  des écarts restants.
