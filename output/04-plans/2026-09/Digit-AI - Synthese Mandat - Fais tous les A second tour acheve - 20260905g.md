---
destinataire: humain
---

# Synthèse de mandat — second « fais tous les A » achevé : les sept items de forges sont clos, le pilot est à jour, quatre forges attendent votre feu vert de publication (05/09/2026)

Votre second mandat est exécuté. Les quatre forges ont instruit les lots déposés ce matin — chacune par un agent mandaté, avec ses propres oracles rejoués et une recette double sens par règle nouvelle — et ont remis leur compte rendu dans la boîte d'entrée du pilot ; les quatre comptes rendus sont jugés conformes, ingérés, et les sept items qui leur étaient confiés sont clos au registre avec leurs preuves. Le pilot a fait sa part (les gardes lexicales de l'oracle de restitution) et réaligné les compétences installées sur les sources que les forges venaient de changer. Ce qui change pour vous : les défauts remontés par le produit 02 le 01 septembre sont corrigés à la source, chez les forges qui les fabriquaient. Ce qui est attendu de vous : deux décisions — publier ou non les huit commits locaux des quatre forges (aucun n'a été poussé, la publication est un feu vert humain), et trier sept candidatures neuves nées des comptes rendus, dont trois visent le pilot et deux sont des récidives chez la forge des outils. Deux gestes chez le produit 02 restent différés : sa session écrivait encore il y a vingt minutes.

## 1. En-tête d'identification

- **quoi** — mandat humain « fais tous les A » (second, 05/09 après-midi) sur la synthèse 20260905e, achevé : A-24 (pilot), A-20 à A-23 (quatre forges, par agents), A-26 (clôtures), A-27 (compétences installées) ; A-25 et A-19 différés ; A-6 et A-17 inchangés.
- **sur quoi** — le pilot `digit-ai-factory` ; quatre dépôts frères (forge-design, forge-development, forge-conception, forge-tests) modifiés et commis localement sur mandat, jamais poussés ; le produit 02 lu seulement ; les compétences installées du poste.
- **quand** — fin le **05/09/2026 à 14:45 (UTC+02:00)**, ≈ 55 minutes depuis votre mandat, dont 45 de travail parallèle des forges.
- **qui** — Claude Fable 5.1 (extension VS Code) et quatre agents subordonnés (un par forge) ; pilot en version `43a0dbf` après publication, base `0d043a3` avant.

## 2. Verdict en une ligne

7/7 items de forges **corrigés** (TF-0796, TF-0797, TF-0800, TF-0798, TF-0799, TF-0804, TF-0803) sur preuves de leurs recettes (design 31 → 34 oracles et 101 → 109 règles ; development 385 → 400 tests ; conception 1/6 → 6/6 sur la branche neuve, self-test vert ; tests 1257 → 1286 cas) ; TF-0805 **corrigé** au pilot (13 → 14) ; 4 lots de retours **PASS** et ingérés (7 candidatures neuves) ; compétences installées **PASS** ; banc du pilot **93/93** ; pilot publié `43a0dbf` ; 8 commits locaux chez les forges **non publiés** (feu vert humain).

## 3. Décisions attendues

Les deux décisions découlent de la même règle : un dépôt frère ne se publie que sur feu vert humain, et tout constat nouveau entre en candidat jusqu'à votre tri.

> **D-8 — Publie-t-on maintenant les huit commits locaux des quatre forges, ou les relit-on d'abord ?**
> Les quatre agents ont commis chez leur forge, sans jamais pousser : quatre commits chez forge-design (habillage des composants en sur-couche et `color-scheme` par thème, registre des déclencheurs, bascule déléguée reconnue, lot de travaux archivé), un chez forge-development (huitième discipline et gate des statiques), deux chez forge-conception (frontières Unicode, 404 à la surface implicite), un chez forge-tests (recette générique de la 404). Chaque commit a été livré avec ses recettes rejouées et son compte rendu jugé conforme par l'oracle du pilot ; aucun n'a été relu ligne à ligne par vous. Tant qu'ils ne sont pas publiés, ce poste seul les porte, et les produits ne les reçoivent pas.
> **Recommandation : (a).** Source consultée : les quatre lots de retours dans `input\00-retours\` (verdicts PASS, comptes de cas avant → après, shas cités) et `CLAUDE.md` § garde-fous (« push sur GO humain »).
> Les preuves sont exécutées et non déclarées ; relire avant de publier est possible mais retarde la descente chez les produits que les défauts touchent.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** publier les huit commits maintenant, avance rapide, porte de publication rejouée sur chaque forge avant | simple × court : quatre `git push` après quatre passages de la porte | exclut une relecture humaine préalable ; un défaut passé sous les recettes se corrigera par un commit de plus |
| **(b)** relire les diffs des quatre forges, puis publier ce qui est validé | moyen × moyen : huit commits à lire, dont un oracle neuf de 400 lignes | exclut la descente immédiate ; les produits attendent |
| **(c)** ne pas publier | gratuit | exclut tout effet chez les produits ; ce poste seul porte le travail, exposé à un nettoyage |

> **Si rien n'est décidé** : (c) s'applique — les commits restent locaux, les produits ne reçoivent rien.

> **D-9 — Comment trie-t-on les sept candidatures nées des comptes rendus des forges ?**
> Trois visent le pilot : l'ingestion cache le nom d'une forge derrière un pseudonyme de produit (trois entrées parasites créées ce jour dans la table hors dépôt), le contrôle M-9 (la 404 jugée à la mise en production) fonde sa preuve sur « le contrôle du produit » alors que la recette générique existe désormais chez forge-tests, et M-9 ne juge pas l'adresse sans préfixe de langue ; une quatrième, vers le pilot aussi, dit que la forme Unicode prescrite dans le lot était trop large — ce que le pilot avait déjà retenu dans sa propre correction. Deux sont des récidives chez la forge des outils : le gate d'écriture impute à l'édition en cours des constats préexistants (trois forges sur trois l'ont payé aujourd'hui, une seule l'a écrit avec la cause racine). Une vise forge-conception : le référentiel d'exigences n'a aucun champ pour déclarer l'écart explicite d'un candidat de la surface implicite.
> **Recommandation : (a).** Source consultée : `todo\TODO.md` (TF-0806 à TF-0812, source, classe, récidive) et `references\TODO-FORGE.md` (tout entre en candidat, décision humaine, une récidive est l'information que la factory cherche).
> Les trois candidatures pilot sont petites et mesurées ; la récidive du gate d'écriture a coûté à trois agents le même jour et porte sa cause racine ; la quatrième pilot peut se clore aussitôt, le travail étant déjà fait.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider les sept en bloc : pilot d'abord (TF-0807, TF-0808, TF-0809, TF-0810 à clore comme déjà tenue), puis la récidive chez forge-agents (TF-0806 et TF-0812, un seul chantier), puis forge-conception (TF-0811) | simple × court pour la décision ; les chantiers ensuite, complexité simple à moyenne | exclut un tri fin ; une candidature jugée sans intérêt à l'instruction sera écartée avec son motif |
| **(b)** décider seulement les quatre du pilot | simple × court | exclut la récidive chez forge-agents, qui se reproduira au prochain lot de forge |
| **(c)** ne rien décider | gratuit | exclut toute instruction ; les sept restent candidates en tête des actifs |

> **Si rien n'est décidé** : (c) s'applique — les sept restent candidates, rien ne se dégrade, la table hors dépôt garde ses trois entrées parasites.

## 4. Traité — avec sa preuve

- **A-20 — forge-design, trois items clos** (recettes PASS, lot PASS) — classe : un composant ou un déclencheur que la grille ne jugeait pas ; contrôle rouge → vert : self-test de la forge 31 → 34 oracles, 101 → 109 règles. TF-0796 : `color-scheme` par thème émis par le générateur de jetons et verrouillé par l'oracle des jetons, volet « livré à l'écran » dans la grille, oracle neuf de sur-couche (fixture nue → FAIL nommant le composant, page habillée → PASS). TF-0797 : registre des déclencheurs en doctrine, oracle neuf à trois règles, zéro faux positif sur les 13 artefacts du dépôt. TF-0800 : voie (b), la délégation reconnue comme câblage, la bascule déléguée passe et la bascule morte reste refusée.
  - preuve : commits `9ecbab6`, `3f7f5e9`, `4a65ad0` (+ `98122d0`, lot archivé) ; lot `digit-ai-forge-design - RETOURS - 20260905a.md` PASS, sidecar vide (la seule récidive rencontrée était déjà remontée deux fois) ; trois événements de clôture journalisés.
- **A-21 — forge-development, un item clos** (tests 400/400 PASS, lot PASS) — classe : un statique servi nu que le gabarit propage ; contrôle rouge → vert : tests 385 → 400, double sens joué sur un projet instancié (statiques nus → exit 1, versionnés → exit 0). Huitième discipline du manuel de run, gate « static-cache » à trois classes de constat, quatrième contrôle après déploiement.
  - preuve : commit `00097b6` ; lot PASS et ingéré (1 candidature TF-0806, récidive du gate d'écriture) ; événement de clôture TF-0798.
- **A-22 — forge-conception, deux items clos** — classe : une garde lexicale à frontière ASCII ; une page de la surface implicite absente de la liste close ; contrôle rouge → vert : branche neuve du self-test 1/6 → 6/6, self-test global vert (11 oracles, 48 règles). TF-0799 : constantes partagées de frontière Unicode dans quatre oracles ; la forme prescrite par le lot mesurée trop large (3/5) et remplacée par la forme exacte (5/5). TF-0804 : la 404 par langue à la liste close avec les cinq critères de P-2, règle S4 de l'oracle de surface, en avertissement non bloquant faute de champ pour l'écart explicite.
  - preuve : commits `90d3767`, `0830694` ; lot PASS et ingéré (TF-0810, TF-0811, TF-0812) ; deux événements de clôture.
- **A-23 — forge-tests, la candidature instruite et close** — classe : un contrôle que chaque produit réécrit faute de générique ; contrôle rouge → vert : 1257 → 1286 cas, sept serveurs locaux dont six refus. Recette générique paramétrée par les préfixes de langue et l'URL de préproduction, trois cas de M-9, sortie JSON consommable, mesure partielle jamais PASS.
  - preuve : commit `23c7622` ; lot PASS et ingéré (TF-0808 récidive, TF-0809) ; événements de décision puis de clôture TF-0803 ; commande produit citée dans l'événement.
- **A-24 — TF-0805 clos au pilot** (self-test 14/14 PASS) — classe : une garde lexicale à frontière ASCII ; contrôle rouge → vert : self-test 13 → 14, trace « accès tenté … refusé » lue (preuve avant/après en UTF-8).
  - preuve : commit `6e92bd8` ; événement de clôture journalisé (PASS).
- **A-26 — les quatre lots jugés (PASS ×4), ingérés, les items clos (7/7)** : 7 candidatures neuves (TF-0806 à TF-0812), dont deux récidives marquées par l'ingestion.
  - preuve : `gabarits\oracle-lot-retours.mjs` PASS ×4 ; `todo\oracle-todo.mjs` PASS ; vues régénérées (15 ouverts, 16 fermés).
- **A-27 — compétences installées réalignées** — classe : une copie installée qui diverge de sa source ; contrôle rouge → vert : K2 (la copie installée d'une compétence est identique à sa source) FAIL sur quatre skills (les seules divergences étaient les chantiers du jour) → PASS après application.
  - preuve : `oracles\oracle-skills.mjs --appliquer` puis verdict PASS.
- **Un défaut du pilot vu en passant et consigné** : l'ingestion d'un lot de forge la pseudonymise comme un produit (trois entrées parasites ce jour).
  - preuve : sorties d'ingestion « Produit-60 », « Produit-61 », « Produit-62 » ; candidature TF-0807.
- **Publication du pilot** en avance rapide, six commits ce tour.
  - preuve : `git push` → jusqu'à `43a0dbf` ; porte de publication PASS au dernier passage.

## 5. Non traité — avec son motif

- **A-25 et A-19 (journal et contrôles du produit 02)** : *garde-fou* — sa session écrivait à 14:15 (seq 120 commise, quatre fichiers du pilot toujours non commis) ; le pilot n'écrit pas dans un journal où quelqu'un écrit ; A-25 se rejoue quand le journal est inchangé depuis plus d'une heure.
- **La publication des forges** : *dépendance à une décision humaine* — D-8.
- **Les sept candidatures neuves** : *tout entre en candidat* — D-9 ; TF-0810 est déjà tenue par le pilot (forme exacte de la frontière), à clore sur décision.
- **A-6 (l'autre poste)** : *impossible à prouver ici* — inchangé.
- **A-17 (nom du dépôt de file)** : *dépendance à une décision humaine* — D-7 non tranchée.
- **Les écarts de périmètre déclarés par les agents** (corrections de lisibilité préexistantes imposées par le gate d'écriture, maquette construite non reconstruite chez forge-design, gate non câblé en intégration continue chez forge-development) : *chez la forge* — déclarés dans leurs lots avec leur motif, non repris ici.

## 6. Écarts à la lettre

- A-20 à A-23 disaient « ouvrir une session chez chaque forge » → quatre agents mandatés l'ont fait en parallèle, sans publier → parce que le mandat autorise l'écriture chez les forges, pas leur publication (feu vert humain, D-8).
- Le lot de conception prescrivait une forme de frontière Unicode → la forge en a retenu une autre, mesurée plus juste, et l'a remontée → le pilot employait déjà la forme retenue ; l'écart est consigné (TF-0810) plutôt que masqué.
- Le brief de forge-design ne disait pas de laisser le lot de travaux non suivi → l'agent l'a commis dans l'historique de la forge → sans conséquence, le lot ne porte aucun nom réel ; la convention (lot non suivi) sera écrite dans les prochains briefs.
- Vous avez demandé « tous les A » → deux actions chez le produit 02 restent différées, mesure à l'appui → parce que la contrainte est physique, pas doctrinale.

## 7. Risques

- **Huit commits locaux non publiés** exposés à un nettoyage de poste.
  - signal : `git status` propre et `origin/main` inchangé chez une forge.
  - parade : D-8 ; les shas sont cités ici et dans le registre.
- **La table hors dépôt porte trois pseudonymes de forges** ; chaque lot de forge en ajoutera un.
  - signal : « produit du lot → Produit-NN » à l'ingestion d'un lot dont le préfixe est une forge.
  - parade : TF-0807 (D-9) ; les entrées se retirent en même temps que la correction, avec une rectification des demandeurs.
- **Le gate d'écriture continue d'imputer des constats préexistants** à chaque édition de document chez les forges.
  - signal : un agent qui corrige des défauts de forme hors de son lot pour pouvoir écrire.
  - parade : TF-0806 et TF-0812 (D-9), cause racine écrite par forge-development.
- **Le produit 02 garde deux seq 118** tant que la rectification n'est pas écrite.
  - signal : R-42 (l'intégrité du journal de run) FAIL persistant.
  - parade : A-25 au repos du produit.

## 8. Prochaines actions

Ordre de traitement : d'abord la publication des forges, parce qu'elle conditionne la descente chez les produits ; puis le tri des candidatures, parce que trois d'entre elles touchent le pilot et deux se reproduiront ; puis le produit au repos ; les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-28 | TF-0796, TF-0797, TF-0800, TF-0798, TF-0799, TF-0804, TF-0803 | Si D-8 (a) : jouer la porte de publication sur chaque forge (`oracle-nom-client-publie`), puis `git push` en avance rapide chez forge-design, forge-development, forge-conception, forge-tests. | `auto_ia` | `gate_gouvernance` — push sur feu vert humain (R-38, noyau § garde-fous). | Les produits ne reçoivent rien ; ce poste seul porte les huit commits. |
| A-29 | TF-0807, TF-0808, TF-0809, TF-0810 | Si D-9 (a) : instruire les candidatures pilot dans l'ordre — ingestion qui reconnaît un émetteur forge (retrait des trois entrées parasites, rectification des demandeurs), M-9 nommant la recette générique et jugeant la racine sans préfixe, TF-0810 close comme déjà tenue. | `auto_ia` | `dependance_bloc_3` — D-9. | Chaque lot de forge ajoute un pseudonyme parasite ; M-9 prescrit un contrôle à réécrire. |
| A-30 | TF-0806, TF-0812, TF-0811 | Si D-9 (a) : déposer un lot de travaux chez forge-agents (le delta neufs/préexistants du gate (la porte qui juge un fichier avant d'en autoriser l'écriture), cause racine : masque sans normalisation du chemin) et chez forge-conception (un champ d'écart explicite pour la surface implicite). | `auto_ia` | `dependance_bloc_3` — D-9 ; écriture chez une forge sur mandat. | Trois forges sur trois ont payé le gate aujourd'hui ; elles le paieront demain. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : relire sa queue, ajouter l'entrée de rectification de la seq 118 en un seul append, rejouer R-42 jusqu'à PASS. | `auto_ia` | `garde_fou` — session vivante (journal à 14:15) ; écrire pendant qu'elle écrit reproduit la collision du matin. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot (quatre fichiers, seuls non commis de son arbre). | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : `git status` du produit, quatre fichiers modifiés après son commit de 14:15. | Un nettoyage efface les chemins d'échec prouvés. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée ou forcée. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7 (synthèse 20260905c), non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Pilot : commits `6e92bd8`, `b985423`, `5a57f21`, `d7ad6d9`, `5df619d`, `4ab4d34`, `43a0dbf`, poussés ; cette synthèse part dans le commit suivant.
- Forges (commits locaux, non publiés) : forge-design `9ecbab6`, `3f7f5e9`, `4a65ad0`, `98122d0` · forge-development `00097b6` · forge-conception `90d3767`, `0830694` · forge-tests `23c7622`.
- Comptes rendus : `input\00-retours\digit-ai-forge-design - RETOURS - 20260905a.md`, `…forge-development…`, `…forge-conception…`, `…forge-tests…` (et sidecars), tous PASS, ingérés.
- Registre : `todo\TODO.jsonl` — TF-0796, TF-0797, TF-0798, TF-0799, TF-0800, TF-0803, TF-0804, TF-0805 corrigés ; TF-0806 à TF-0812 candidats ; vues `todo\TODO.md`, `todo\AVANCEMENT.md` (15 ouverts, 16 fermés).
- Poste : compétences installées réalignées (`oracles\oracle-skills.mjs --appliquer`, K2 PASS) ; synthèses du tour `…20260905f.md` (point d'étape) et celle-ci.
- Oracles rejoués : `gabarits\oracle-lot-retours.mjs` ×4 (PASS) · `todo\oracle-todo.mjs` (PASS) · `oracles\oracle-skills.mjs` (PASS) · `oracles\oracle-synthese.mjs --self-test` (14/14) · `oracles\self-tests.mjs` (93/93, banc entier vert pour la première fois depuis le 03/09) · `oracle-nom-client-publie` (PASS au dernier commit du pilot).
