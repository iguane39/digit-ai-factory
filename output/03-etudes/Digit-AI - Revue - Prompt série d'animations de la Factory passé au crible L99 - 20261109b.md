---
role: analyse L99 (8 couches, mode boucle ouvert d'office) du prompt « série d'animations présentant les pans fonctionnels de la Factory et de ses forges » du 09/11/2026 ; livrable principal au chapitre 8 (prompt réécrit, contrat de sortie, protocole de tests)
sources_de_verite: [C:\dev\digit-ai-forge-development, C:\dev\digit-ai-forge-data\CLAUDE.md, C:\dev\digit-ai-forge-conception, C:\dev\digit-ai-forge-design\oracles\oracle-motion.mjs, C:\dev\digit-ai-marketing\donnees\marque\LIVRABLES.md, C:\dev\digit-ai-forge-organization\registre-types.json, output\03-etudes\Digit-AI - Étude - Huit outils de motion design pour la Factory - 20261102t.md]
verifie_le: 2026-11-09
---

# Revue L99 — « Une série d'animations pour vendre la Factory et ses forges »

Prompt reçu le 09/11/2026, analysé au niveau **L99** *(analyse complète en 8 couches, chacune
relisant le prompt d'origine)*, en **mode boucle** *(le prompt réécrit est noté par des relecteurs
aveugles, sans l'analyse, jusqu'à ne plus porter de défaut grave)*. Les mesures ont été relevées le
09/11/2026 à partir de 16:25, sur le poste Dell-XPS-16.

**Ce qui change pour vous.** Votre prompt décrit bien les cinq pans, mais il ne dit ni ce qu'est
une animation, ni à qui elle parle, ni ce qu'elle a le droit d'affirmer. Or deux capacités que vous
citez ne sont pas outillées par les forges telles quelles : le TDD n'apparaît que dans 2 fichiers de
forge-development, et forge-data contrôle la discipline des données sans implémenter les couches
Bronze, Silver et Gold. Le prompt réécrit fixe un format (page HTML animée de 60 à 120 secondes),
un décideur par épisode, et une table de preuves qui interdit de montrer une capacité absente.
Deux relecteurs aveugles l'ont mesuré à 84 sur 100 ; il garde 13 majeurs, nommés au chapitre 8
avec leur correction, dont 5 déjà écrites et vérifiées.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt d'origine vaut 34 sur 100. L'intention est nette et le vocabulaire métier est riche, mais
le livrable n'est pas défini, et rien ne protège un support de vente contre une promesse fausse.

### Observe

Le prompt porte une demande de production et une demande d'idées. La production : « créer une série
de plusieurs animations qui permettent de présenter des pans fonctionnels spécifiques de la Factory
et ses forges ». Cinq pans suivent, chacun décrit par une chaîne d'étapes : de « la fiche produit » au
« déploiement » pour le premier, de « l'analyse Data de l'existant avec l'IA » aux « tests de données
de bout en bout » pour le deuxième. Le cinquième s'arrête net : « Le SEO/GEO sur les sites Web... ».
Les idées : « Propose d'autres idées d'animations à construire pour vendre les qualités de la
Factory & ses forges ». Le verbe « vendre » est la seule indication de finalité.

### Orient

L'auteur est le porteur de la Factory ; il connaît chaque forge et écrit dans sa langue de
concepteur (« Epic/Sprint », « couches Bronze, Silver & Gold »). Le destinataire réel des animations
est un prospect, qui ne connaît ni les forges ni leur vocabulaire. Le prompt sera exécuté par une
session qui produira des fichiers : il lance un run de production, dans le dépôt privé
`digit-ai-marketing`, dont la table `donnees\marque\LIVRABLES.md` liste onze types de livrables
commerciaux (L1 à L11) et aucune animation.

### Decide

Trois stratégies répondent à l'intention.

- **S1, tout produire d'un coup** : cinq animations et une liste d'idées dans le même run. C'est la
  lettre, mais cinq livrables visuels sans référence commune divergent en charte et en promesses.
- **S2, cadrer puis produire** : un cadrage commun (preuves, storyboards, format, idées), puis les
  cinq épisodes jugés un par un. Même périmètre que S1, mais le premier épisode fixe la barre.
- **S3, cadrer seulement** : storyboards et idées, production renvoyée à plus tard. Plus sûr, mais
  la demande dit « créer », pas « préparer ».

### Act

S2. Elle garde la lettre (cinq épisodes et des idées) et règle le risque principal : une animation
de vente qui affirme une capacité que les forges n'ont pas. Le cadrage porte la table des preuves
qui conditionne chaque affirmation à l'écran.

### Étalon

Le prompt idéal pour cette intention pose six choses : le lieu d'exécution, le format d'une
animation (support, durée, nombre de scènes, son ou silence), le décideur de chaque épisode, la
règle de preuve des affirmations, les garde-fous de publication et de noms, et un contrat de sortie
jugé par des oracles nommés.

La table suivante note le prompt d'origine. Une ligne vaut une dimension de la rubrique *(grille de
6 dimensions sur 100 points, fixée par la couche 1 de L99)* ; la dernière colonne justifie la note
par une citation.

| Dimension | Points | Note | Justification |
|---|---|---|---|
| Clarté de l'intention | 20 | 12 | « présenter des pans fonctionnels » et « vendre » sont clairs ; « animation » ne l'est pas |
| Spécification | 20 | 4 | ni format, ni durée, ni nombre, ni langue, ni décideur visé |
| Garde-fous et contraintes | 15 | 2 | aucune limite sur les promesses, les noms de clients ou la publication |
| Ancrage et contexte | 15 | 8 | cinq pans décrits étape par étape ; aucune source, et un terme absent des forges (« fiche produit ») |
| Vérifiabilité de la sortie | 15 | 2 | aucun critère pour dire qu'une animation est réussie |
| Robustesse | 15 | 6 | « plusieurs » et « ... » laissent le périmètre ouvert à deux lectures |
| **Total** | **100** | **34** | aucun défaut bloquant, donc pas de plafond à 40 |

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

Le prompt n'enchaîne pas d'instructions : il énumère cinq sujets et ajoute une demande d'idées. La
couche examine donc les dépendances entre ses consignes, et en trouve une qui conditionne tout.

La demande d'idées dépend de la production : une idée « pour vendre les qualités » ne se classe
qu'avec la même règle de preuve que les cinq épisodes. Sans cette règle commune, la liste d'idées
peut promettre ce que les épisodes s'interdisent. Deuxième dépendance : les cinq pans partagent des
étapes (les tests apparaissent dans les pans 1, 2 et 3). Sans découpage explicite, trois épisodes
racontent la même chose, ou un seul en parle et les deux autres se taisent. Le prompt réécrit
assigne le détail des tests au pan 3 et garde aux pans 1 et 2 une seule scène de tests.

---

## Chapitre 3 — Blindspots · Inventaire maître

Le prompt ne contient aucun défaut bloquant, mais sept majeurs. Cinq tiennent à une même cause :
le livrable n'est décrit que par son sujet, jamais par sa forme ni par son lecteur.

La table suivante est l'inventaire de référence. Une ligne vaut un défaut, rangé par sévérité puis
par ordre d'apparition ; la colonne « Clos par » renvoie à la section du prompt réécrit (Ch8) qui le
ferme. Les défauts remontés du Ch4 portent la mention « remonté Ch4 ».

| # | Défaut | Sévérité | Clos par |
|---|---|---|---|
| 1 | « animation » sans format : vidéo, page HTML animée, GIF, diapositives animées ; chaque lecture change l'outillage | majeur | « Ce qu'est une animation » |
| 2 | Aucun décideur visé : « vendre » à qui ? Un DSI et une direction marketing n'attendent pas la même chose | majeur | table des épisodes, colonne « Décideur visé » |
| 3 | Aucune règle de preuve : une animation de vente peut montrer une capacité que les forges n'outillent pas (remonté Ch4) | majeur | ÉTAPE 0 point 5 et contrat de sortie |
| 4 | Aucun garde-fou de noms : les produits réels de la Factory sont des clients, leur nom ne doit pas paraître | majeur | « Garde-fous » |
| 5 | Aucun garde-fou de publication : un support de vente est fait pour sortir ; R-38 *(règle du pilot : rien ne se publie sans GO humain)* n'est pas rappelée | majeur | « Garde-fous » |
| 6 | Aucun critère de réussite ni oracle : rien ne dit quand une animation est finie | majeur | « Contrat de sortie », « Protocole de tests » |
| 7 | Lieu d'exécution non dit : le run doit vivre chez le produit `digit-ai-marketing`, jamais au pilot | majeur | « Rôle et lieu » |
| 8 | Pan 5 tronqué (« Le SEO/GEO sur les sites Web... ») : périmètre ouvert | mineur | table des épisodes, ligne 5 |
| 9 | « plusieurs animations » : cinq, ou plus avec les idées ? | mineur | « Ordre d'exécution » |
| 10 | Recouvrement des tests entre pans 1, 2 et 3 (Ch2) | mineur | « Fil commun » et storyboards du cadrage |
| 11 | Langue des animations non dite | mineur | prompt réécrit en français, sans mention ajoutée |
| 12 | Biais de la connaissance de l'auteur : vocabulaire de concepteur (« Epic/Sprint », « massification ») pour un lecteur prospect | mineur | « Scène » : titres et textes bornés, décideur visé |

---

## Chapitre 4 — Factcheck · Audit des prémisses

Le prompt traite comme acquises des capacités des forges. Une animation de vente les montrera
comme vraies, donc chacune a été mesurée dans les dépôts le 09/11/2026. Deux sont partielles.

La table suivante classe chaque prémisse. Une ligne vaut une capacité citée par le prompt ; la
colonne « Mesure » donne la commande et son résultat ; une prémisse partielle remonte au Ch3 (#3).

| Prémisse citée | Mesure (09/11/2026) | Verdict |
|---|---|---|
| « l'implémentation avec Epic/Sprint » | `git -C digit-ai-forge-development grep -l -i -E "sprint\|epic\|TDD"` : 93 fichiers ; « epic » 548 occurrences | vrai |
| « TDD » | `git grep -l -i -E "\bTDD\b\|test-driven\|red.green"` dans forge-development : 2 fichiers (`docs/forge-process-schema.html`, un plan du 18/06) | partiel : cité, non outillé par un oracle de la forge |
| « la fiche produit » | `git -C digit-ai-forge-conception grep -l -i "fiche produit"` : 0 fichier ; la forge produit un PRD et `EXIGENCES.json` | vrai sur le fond, faux sur le mot |
| « l'implémentation des couches Bronze, Silver & Gold », « des flux » | `digit-ai-forge-data\CLAUDE.md` : « forge-data vérifie la **forme de la discipline**, pas le contenu des données » ; « silver » 133 et « bronze » 26 occurrences, surtout en fixtures | partiel : la forge contrôle, les produits implémentent |
| « tests de données de bout en bout », « stratégie de tests de bout en bout » | forge-tests et boucle de fermeture « ≤ 5 cycles » au `CLAUDE.md` du pilot | vrai |
| « les remontées des produits permettant de fournir les retours à la Factory » | `BOUCLE-AMELIORATION.md`, lots `<projet> - RETOURS`, `todo\TODO.jsonl` | vrai |
| « Le SEO/GEO sur les sites Web » | forge-seo-geo, « GEO » cité dans 26 fichiers ; mobilisée post-MEP et sur mandat | vrai |

Deux prémisses implicites portent sur l'outillage. FFmpeg est absent du poste (`which ffmpeg` :
aucun résultat le 09/11/2026), comme l'étude du 02/11/2026 l'avait relevé : une animation vidéo ne
peut pas être rendue sans installation. `oracle-motion.mjs` existe dans
`digit-ai-forge-design\oracles\` : une animation HTML a un oracle de mouvement, une vidéo n'en a
aucun. Les deux faits orientent le format vers une page HTML animée.

---

## Chapitre 5 — Premortem · Anticipation d'échec

Le scénario d'échec le plus probable n'est pas technique : c'est une animation réussie qui promet
trop, montrée à un prospect qui demande à voir.

1. **La promesse fausse.** L'épisode 2 montre « la Factory implémente vos couches Bronze, Silver,
   Gold ». Le prospect demande une démonstration ; forge-data ne fait que contrôler. Mécanisme : le
   prompt traite la liste de l'auteur comme un inventaire vérifié (Ch3 #3). Mitigation : table des
   preuves en ÉTAPE 0, trois statuts, aucune capacité absente à l'écran.
2. **Le nom du client à l'écran.** Pour figurer un artefact réel, la session reprend un écran d'un
   produit, avec le nom de l'enseigne. Mécanisme : aucun garde-fou de noms (Ch3 #4). Mitigation :
   artefacts figurés depuis les fixtures synthétiques, secteur générique à la place du nom.
3. **La vidéo qui ne sort pas.** La session choisit le MP4, découvre l'absence de FFmpeg, l'installe
   ou rend des images fixes. Mécanisme : format non défini (Ch3 #1). Mitigation : page HTML animée,
   MP4 seulement si FFmpeg est déjà présent.
4. **Cinq épisodes, cinq chartes.** Chaque épisode invente sa mise en scène. Mécanisme : aucun fil
   commun ni ordre (neuf, remonté au Ch3 #10). Mitigation : cadrage et storyboards d'abord, un
   épisode ne démarre qu'après le PASS du précédent.
5. **Le jargon intact.** « Massification », « Epic/Sprint » passent tels quels à l'écran.
   Mécanisme : biais de l'auteur (Ch3 #12). Mitigation : titre de 8 mots et texte de 25 mots au
   plus, décideur nommé par épisode.

---

## Chapitre 6 — Wargame · Stress-test adversarial

Trois lectures attaquent la direction de réécriture ; deux d'entre elles l'ont modifiée.

**L'utilisateur exigeant** veut pouvoir projeter l'épisode en rendez-vous et le mettre sur le site.
Une page HTML sans lecteur vidéo se projette dans un navigateur ; elle ne se poste pas sur un réseau
qui n'accepte que la vidéo. Le prompt réécrit garde la voie MP4 ouverte si FFmpeg est présent, et le
cadrage dit sinon ce qui manque.

**L'expert du domaine** relève que « Bronze, Silver, Gold » est le vocabulaire d'une plateforme
précise (architecture médaillon). L'afficher sans contexte suppose que le prospect l'utilise. Le
storyboard de l'épisode 2 doit nommer la cible d'après les preuves, pas d'après la liste de
l'auteur.

**Le contradicteur** produit 5 pages conformes au contrat et vides : des schémas génériques, des
textes de 25 mots qui ne disent rien. Le contrat exige donc qu'une scène montre un artefact réel
figuré, et que chaque affirmation renvoie à une ligne de la table des preuves.

Lentille robustesse : le prompt n'est ni un system prompt ni un template ; il lance un run. Le
calibrage compte : quatre outils de motion design relevés le 02/11/2026 recommandent Opus 5.5, et
le prompt n'impose aucun modèle, ce que le routage du pilot tranche (`CONTRAT-INTERFACE.md` §4).

---

## Chapitre 7 — Deepthink · Implications profondes

Prompt one-shot qui lance un run de production : les effets d'échelle ne s'appliquent pas, sauf un.
La série deviendra un modèle pour les épisodes suivants (les « autres idées ») ; la proposition
d'une ligne L12 dans `LIVRABLES.md` en fait un type de livrable durable, ce que le cadrage propose
sans l'écrire.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt réécrit retenu est mesuré à **84 sur 100** par deux relecteurs aveugles, contre 34
estimés pour l'original (note de l'analyse, non mesurée). C'est la passe 2 : les passes 3 et 4,
plus complètes, ont été notées plus bas et la règle de régression les a rejetées.

### Score et passes

La table suivante retrace la boucle. Une ligne vaut une passe, dans l'ordre ; « score » est la
note la plus basse des deux relecteurs, « majeurs » ceux qui ont tenu au recompte à la source.

| Passe | Notes des relecteurs | Score | Majeurs retenus | Écartés au recompte | Mots | Décision |
|---|---|---|---|---|---|---|
| 1 | 84 et 74 | 74 | 5 | 0 | 1 614 | continuer |
| 2 | 84 et 84 | **84** | 5 | 0 | 2 016 | **retenue** |
| 3 | 84 et 74 | 74 | 6 | 0 | 2 309 | rejetée : régression |
| 4, reprise de la 3 | 82 et 84 | 82 | 5 | 1 | 2 309 | rejetée : régression |

Raison de l'arrêt : régression. La passe 3 fermait les 5 majeurs de la passe 2 (vérifié par un
agent avec contexte), mais un relecteur l'a notée 74. Un de ses majeurs venait de la correction
(un exemple de source citant la ligne 12 au lieu de 14), ce qui a ouvert une passe de reprise
unique, notée 82. La règle garde donc la passe 2, mesurée 84, et le prompt ci-dessous est livré
avec ses majeurs connus. Les relecteurs ont noté la même version à 84 et à 74 : l'écart entre
passes tient autant au relecteur qu'au texte.

Journal : `Digit-AI - Revue - Prompt série d'animations de la Factory passé au crible L99 -
20261109b.md.boucle.json`, jugé PASS par `oracle-boucle-l99.mjs` le 09/11/2026.

### Majeurs ouverts dans le prompt retenu

Le prompt de la passe 2 est livré avec ces défauts. Une ligne vaut un défaut ; « vu à » dit quelle
relecture l'a trouvé ; la dernière colonne donne la correction déjà écrite et vérifiée en passe 3,
ou celle que proposait le relecteur. Les appliquer avant de lancer le prompt relève de vous.

| Défaut | Vu à | Correction |
|---|---|---|
| « PASS du précédent » contredit « livrer après 3 échecs » ; run unique non dit | passe 2 | passe 3 : épisode livré « non conforme » et série poursuivie, sauf nom réel, donnée client ou capacité absente |
| `date +%s` et `stat` sans shell nommé | passe 2 | passe 3 : toutes les commandes en Git Bash, chemins en slashs |
| contrôle des noms réglé pour 6 fichiers alors qu'il se joue par épisode | passe 2 | passe 3 : le cadrage et les pages déjà produites, puis les 6 à la fin, avec un commit initial |
| `controle-serie.mjs` sans schéma de la table « Preuves » ni format de `SCENES` | passe 2 | passe 3 : marqueurs `/* SCENES:debut */`, colonnes `id, capacité, pan, source, statut, relevé le` |
| script de chronométrage non spécifié | passe 2 | passe 3 : `chronometre-lecture.py`, attente de `data-etat="fin"`, fixture de 2 000 ms |
| aucun juge de la valeur commerciale | passe 3 | grille de 4 questions binaires (problème, gain, preuve visible, scène finale) |
| aucune priorité de coupe pour un run de 2 scripts, 1 cadrage et 5 pages | passes 3 et 4 | cadrage et épisodes 1 à 3 d'abord, arrêt propre permis, état écrit au cadrage |
| une scène « partielle » peut affirmer plus que sa preuve | passe 3 | formulation autorisée par preuve, contrôlée par `controle-serie.mjs` |
| `run-oracles-design` en `editoriale` jamais essayé sur une page à scènes | passe 3 | jouer d'abord sur une page témoin, règles hors champ en « non jugé » |
| fixtures rouges sans contenu imposé | passe 4 | une fixture rouge par règle contrôlée, dans `scripts/tests/fixtures/` |
| préfixe d'`allouer-indice` sans le « - » final | passe 4 | préfixe écrit en entier, par exemple `"Digit-AI - Cadrage - Série d'animations de la Factory - "` |
| version `prefers-reduced-motion` sans juge | passe 4 | option `--reduced-motion` du chronomètre, `data-etat="fin"` dans les deux modes |
| page « non conforme » sans marque de non-diffusion | passe 4 | mention « non conforme, ne pas diffuser » dans le `<title>` |

### Diagnostic en 3 lignes

- Force : cinq pans décrits étape par étape, dans un vocabulaire que les forges partagent en partie.
- Faiblesse : le livrable n'a ni forme, ni lecteur, ni critère de réussite.
- Risque principal : un support de vente qui affirme deux capacités que les forges n'outillent pas.

### Pourquoi le mode boucle a été ouvert

Le prompt réécrit lance un run qui écrit des fichiers chez un produit : c'est un des 3 cas
d'ouverture d'office (TF-2022 *(règle du skill : boucle ouverte d'office pour un prompt de run)*).
Deux relecteurs aveugles notent chaque passe.

### Prompt réécrit

Le prompt ci-dessous est la passe 2, mesurée à 84. Il se colle tel quel dans une session ouverte
dans `C:\dev\digit-ai-marketing`. Ses majeurs ouverts sont listés plus haut, avec leur correction.

```markdown
# Série d'animations « La Factory Digit-AI en action » : cadrage et cinq épisodes

## Rôle et lieu

Tu es la session de production marketing de Digit-AI. Tu travailles dans le dépôt produit privé
`C:\dev\digit-ai-marketing` : le run vit chez le produit, jamais dans le pilot
`C:\dev\digit-ai-factory`. Tu suis la doctrine du pilot (son `CLAUDE.md` et
`references\ETAPES-RUN.md`) ; en cas de conflit avec une règle du produit, la règle du pilot prime
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
lui, en moins de deux minutes, sans rien affirmer que les forges ne font pas.

## ÉTAPE 0 — remesurer avant d'écrire

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
3. **Oracles.** Vérifier que ces fichiers existent (`~` désigne `C:\Users\<utilisateur>`) :
   - `C:\dev\digit-ai-forge-design\oracles\oracle-motion.mjs` et
     `C:\dev\digit-ai-forge-design\oracles\run-oracles-design.mjs` ;
   - `~\.claude\skills\digit-ai-page-html\scripts\check_html.py`, `render_page.py` et
     `check_markdown.py` ;
   - `~\.claude\skills\quality-oracles\scripts\oracle-claims.mjs` (la version des livrables, qui
     accepte `.md` et `.html` ; pas celle de forge-conception, qui lit un `EXIGENCES.json`) et
     `~\.claude\skills\quality-oracles\scripts\oracle-nom-client-publie.mjs`.
   Un oracle absent, ou qui ne sait pas juger l'objet qu'on lui donne, s'écrit « non jugé » dans
   le cadrage avec sa raison. Il ne compte jamais comme un PASS et ne se remplace pas par une
   relecture.
4. **Marque.** Lire `donnees\marque\MARQUE.md`, `DESIGN.md` et `LIVRABLES.md`. La table des types
   de livrables de `LIVRABLES.md` va de L1 à L11 au 09/11/2026 et ne contient aucune animation : le
   cadrage propose une ligne L12 (public, format, skill, gates, sortie), sans modifier
   `LIVRABLES.md`.
5. **Preuves par capacité.** Pour chaque capacité nommée dans l'intention, chercher sa source dans
   les forges (`git -C C:\dev\<forge> grep -n -i "<terme>"`) et dans le pilot (`INVENTAIRE.md`,
   `fiches\<forge>.md`). Classer chaque capacité :
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
| 4 | Amélioration continue : retours des produits par lots, registre du pilot, forges qui progressent | pilot (`BOUCLE-AMELIORATION.md`, `references\TODO-FORGE.md`) | direction de la transformation |
| 5 | SEO et GEO des sites web | forge-seo-geo | direction du marketing digital |

Une capacité **partielle** se montre pour ce qu'elle est, par exemple « chez les produits construits
avec la Factory » plutôt que « la forge data implémente ». Une capacité **absente** ne se montre pas
et se liste dans le cadrage.

## Ce qu'est une animation dans cette série

- **Format** : une page HTML autoportante, un seul fichier sans ressource réseau, qui joue un
  scénario animé en CSS et JavaScript. Lecture, pause, scène précédente et suivante, à la souris et
  au clavier.
- **Durée** : 60 à 120 secondes en lecture continue, de 5 à 8 scènes.
- **Manifeste de scènes** : chaque page déclare ses scènes dans un seul tableau JavaScript,
  `const SCENES = [{ titre, texte, duree_ms, preuves: ["P-01", …] }, …]`, qui pilote la lecture.
  `preuves` cite les identifiants de la table « Preuves » du cadrage que la scène affirme.
- **Scène** : un titre de 8 mots au plus, un texte de 25 mots au plus, un visuel animé (schéma de
  flux, artefact figuré : nom de fichier, verdict d'oracle, extrait de tableau). Ni voix off, ni
  musique.
- **Fil commun** : le problème du décideur, ce que la Factory fait étape par étape, un artefact
  réel figuré, ce que le décideur y gagne. Un chiffre affiché porte sa source et sa date dans la
  table « Preuves » du cadrage.
- **Accessibilité** : `prefers-reduced-motion` respecté par une version sans mouvement lisible,
  contraste AA, texte réel et non image de texte.
- **Charte** : les jetons de `donnees\marque\`. Un rendu générique est un défaut (loi 6 du pilot).

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

1. ÉTAPE 0, puis le cadrage : relevé, table des preuves, storyboard des 5 épisodes, idées,
   proposition L12.
2. Épisode 1, jugé par le protocole ci-dessous. Chaque épisode suivant démarre après le PASS du
   précédent.
3. Restitution de fin de tour selon `gabarits\RESTITUTION.md` du pilot.

## Garde-fous

- Aucun nom réel de client ni de produit, ni à l'écran ni dans les fichiers. Un produit se désigne
  par son secteur générique (« un acteur de l'immobilier commercial »).
- Aucune donnée client : les artefacts figurés viennent des fixtures synthétiques des forges.
- Rien ne se publie : les fichiers restent sur disque, dans `output\` du produit. La mise en ligne,
  sur le site ou sur un réseau, attend un GO humain (R-38 du pilot).
- Aucune installation de logiciel, aucune API payante, aucun service hébergé.

## Livrables et noms

Les noms suivent `<Projet> - <Type> - <Objet> - AAAAMMJJ<indice>.<ext>` : le projet ouvre le nom
(R-4 du pilot), le type est le premier mot du 2ᵉ segment et figure au registre
`C:\dev\digit-ai-forge-organization\registre-types.json` (R-25 du pilot). Sortie :
`output\03-publications\`. L'indice de chaque fichier s'obtient par
`node C:\dev\digit-ai-factory\scripts\allouer-indice.mjs --dossier output\03-publications --prefixe "<nom sans date>" --jour AAAAMMJJ --extension <.md ou .html>`.
Le script ne réserve rien : deux appels sans fichier écrit entre eux rendent la même lettre.
Écrire chaque fichier sous son nom avant d'allouer l'indice du suivant.

- `Digit-AI - Cadrage - Série d'animations de la Factory - AAAAMMJJ<indice>.md` ;
- cinq fichiers `Digit-AI - Présentation - Animation <n> <pan> - AAAAMMJJ<indice>.html`.

## Contrat de sortie

- **Cadrage** : sections « Relevé d'ouverture », « Preuves » (une ligne par capacité des 5 pans,
  avec source et statut), « Storyboards » (5 épisodes de 5 à 8 scènes), « Autres idées » (6 au
  moins, 7 colonnes), « Proposition L12 », « Non jugé ». `check_markdown.py` rend exit 0.
- **Chaque animation** : un fichier, 0 requête réseau, commandes au clavier, version
  `prefers-reduced-motion`. Chaque contrôle a son juge, qui ne juge que son objet :

  | Contrôle | Juge et commande |
  |---|---|
  | 5 à 8 scènes ; somme des `duree_ms` entre 60 000 et 120 000 ; titres de 8 mots au plus, textes de 25 au plus ; chaque identifiant de `preuves` existe dans la table « Preuves » avec le statut attesté ou partiel | `scripts\controle-serie.mjs <fichier.html> <cadrage.md>`, écrit par la session dans le dépôt, avec une fixture rouge et une verte qu'il doit distinguer avant de juger une page |
  | durée réelle de la lecture continue, à 10 % près de la somme déclarée | lecture chronométrée par un script Python avec Playwright ; Playwright Python absent à l'ÉTAPE 0 : « non jugé » |
  | charte, accessibilité, impression | `python ~\.claude\skills\digit-ai-page-html\scripts\check_html.py <fichier.html>` exit 0 |
  | rendu sans défaut visuel, sans requête réseau | `python ~\.claude\skills\digit-ai-page-html\scripts\render_page.py <fichier.html>` PASS |
  | finition des transitions CSS (règles R1 à R14) ; ne mesure ni la durée du scénario ni les textes | `node C:\dev\digit-ai-forge-design\oracles\oracle-motion.mjs <fichier.html>` PASS |
  | critique d'implémentation, jouée en dernier : la même commande imprime `date +%s` puis `stat -c %Y <fichier.html>`, et le verdict ne compte que si la date de modification est antérieure ; les deux valeurs s'écrivent au cadrage | `node C:\dev\digit-ai-forge-design\oracles\run-oracles-design.mjs <fichier.html> --rendu --type-page editoriale --tokens donnees\marque\tokens.css` |
  | aucun montant sans source | `node ~\.claude\skills\quality-oracles\scripts\oracle-claims.mjs <fichier.html>` PASS ; il ne juge pas les affirmations de capacité, que juge `controle-serie.mjs` |
  | aucun nom réel de client ou de produit | les 6 fichiers copiés seuls dans un dossier temporaire initialisé par `git init` puis `git add`, et `node ~\.claude\skills\quality-oracles\scripts\oracle-nom-client-publie.mjs <ce dossier>` PASS ; jamais sur le dépôt entier, privé, qui peut garder des noms |

- 0 capacité « absente » à l'écran : toute affirmation passe par une scène du manifeste et ses
  `preuves`.

## Protocole de tests du livrable

- **Jeu d'essai** par épisode : lecture continue complète ; lecture avec `prefers-reduced-motion` ;
  navigation au clavier seul ; ouverture sans réseau.
- **Boucle bornée** : produire, juger contre le contrat, corriger, 3 itérations au plus par épisode
  (déléguer au skill `la-boucle` s'il est installé). Après 3 passes en échec, livrer avec la liste
  des écarts restants.
```

### Contrat de sortie

Le contrat est embarqué dans le prompt réécrit (section « Contrat de sortie »). En clair : un
cadrage Markdown à 6 sections jugé par `check_markdown.py` ; 5 pages HTML autoportantes de 5 à
8 scènes et de 60 à 120 secondes. Chaque contrôle a son juge, qui ne juge que son objet : scènes,
durées, mots et preuves par `controle-serie.mjs` (écrit par la session, avec fixtures), durée réelle
par un chronométrage Playwright, charte par `check_html.py`, rendu par `render_page.py`, transitions
par `oracle-motion.mjs`, montants par `oracle-claims.mjs`, noms par `oracle-nom-client-publie.mjs`,
critique d'implémentation par `run-oracles-design.mjs`. Un oracle absent ou inadapté s'écrit
« non jugé », jamais PASS. Aucune capacité absente à l'écran.

### Protocole de tests du livrable

Livrable substantiel (page HTML et document), protocole déclenché. Jeu d'essai par épisode :
lecture continue, lecture avec `prefers-reduced-motion`, clavier seul, ouverture sans réseau.
Boucle bornée à 3 itérations par épisode, déléguée à `la-boucle` s'il est installé ; au-delà,
livraison avec écarts listés.

### Changelog

Chaque ligne relie une modification du prompt réécrit au défaut qu'elle ferme. Les lignes suivent
l'ordre des sections du prompt, puis viennent les corrections de la passe 2. La colonne de droite
renvoie au chapitre ou à la relecture qui a trouvé le défaut. Les corrections des passes 3 et 4,
rejetées, n'y figurent pas : elles sont dans la table des majeurs ouverts.

| Modification | Défaut fermé |
|---|---|
| Section « Rôle et lieu » : dépôt `digit-ai-marketing`, R-43 | Ch3 #7 |
| ÉTAPE 0 : outils, oracles, marque, preuves par capacité | Ch3 #1, #3 ; Ch4 ; Ch5 #1 et #3 |
| Table des épisodes avec forges et décideur | Ch3 #2, #8 ; Ch5 #5 |
| Section « Ce qu'est une animation » | Ch3 #1, #10, #12 ; Ch5 #3, #4, #5 |
| Section « Autres idées » à 7 colonnes | Ch2 (règle de preuve commune) |
| Garde-fous noms, données, publication, installation | Ch3 #4, #5 ; Ch5 #2 |
| Noms R-4 et R-25, types « Cadrage » et « Présentation » | règle de nommage du skill (TF-1441) |
| Contrat de sortie et protocole | Ch3 #6 ; Ch6 contradicteur |
| Passe 2 : chemin et commande de chaque oracle, `oracle-claims` des livrables désigné | relecteurs de la passe 1 : oracle ambigu, oracle sans commande |
| Passe 2 : manifeste `SCENES` et `controle-serie.mjs` ; `oracle-motion` borné aux transitions | relecteurs de la passe 1 : durée sans méthode de mesure |
| Passe 2 : contrôle des noms sur un dossier temporaire neuf, jamais sur le dépôt privé entier | relecteur de la passe 1 : l'oracle prend un dépôt, pas un fichier |
| Passe 2 : arguments complets d'`allouer-indice`, fichier écrit avant l'indice suivant | relecteur de la passe 1 et vérificateur : appel nu en échec, aucune réservation |
| Passe 2 : Playwright Python au lieu de `npx playwright` | vérificateur de la passe 2 : `npx` absent du dépôt |

### Écarts à la lettre

Chaque ligne dit ce que vous avez écrit, ce que le prompt réécrit fait, et pourquoi. Toutes sont des
écarts de **manière d'exécuter** : aucun n'ajoute à l'écran un contenu que vous n'avez pas demandé.

| Vous avez écrit | Le prompt réécrit | Pourquoi |
|---|---|---|
| « une série de plusieurs animations » | cinq épisodes, un cadrage commun d'abord, chaque épisode après le PASS du précédent | une barre commune, fixée par le premier épisode (Ch5 #4) |
| « animations » | page HTML animée de 60 à 120 s, 5 à 8 scènes, sans voix ni musique ; MP4 seulement si FFmpeg est présent | FFmpeg absent du poste ; `oracle-motion` juge le HTML, rien ne juge une vidéo (Ch4) |
| « pour vendre » | un décideur nommé par épisode | un message de vente parle à quelqu'un (Ch3 #2) |
| les cinq pans tels quels | une capacité partielle se dit pour ce qu'elle est ; une absente ne paraît pas | TDD et couches Bronze, Silver, Gold partiels (Ch4) |
| « Propose d'autres idées » | 6 idées au moins, 7 colonnes, 8 pistes à vérifier | rendre les idées comparables et sourcées (Ch2) |
| « Le SEO/GEO sur les sites Web... » | le périmètre de forge-seo-geo | les points de suspension laissent le pan ouvert (Ch3 #8) |
