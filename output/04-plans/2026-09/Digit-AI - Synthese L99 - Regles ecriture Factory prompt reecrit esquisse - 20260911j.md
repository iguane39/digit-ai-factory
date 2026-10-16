---
destinataire: humain
---

# Synthèse L99 — le prompt « règles d'écriture de la Factory » est analysé et réécrit, une esquisse de liste pour votre profil est livrée, un constat est au registre ; il vous reste à valider la lecture de votre intention et à dire quand installer la liste (11/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en huit couches est déposée et passe l'oracle de lisibilité, et le prompt réécrit est prêt à lancer le mandat. Ce que l'analyse change pour vous : la Factory juge déjà la forme de chacun de ses textes à chaque tour, mais elle n'en juge jamais le style, et c'est cette lacune que votre demande vise juste. En revanche, la page Wikipédia citée est un guide de détection qui se déclare lui-même non probant : la retourner en interdits fabriquerait une prose aplatie que ses propres auteurs déconseillent. Le prompt réécrit garde votre intention entière mais la fonde sur des normes de rédaction, met les signes d'écriture générée dans une donnée datée plutôt que dans des règles, nomme le juge et le mécanisme de propagation, et borne la liste pour votre profil à douze règles subordonnées aux consignes de projet. Cette liste est fournie dès maintenant en esquisse. Rien de ce tour n'est publié. Ce qui est attendu de vous : valider ou corriger la lecture de votre intention et les dix écarts à la lettre, dire si la liste s'installe dans votre profil maintenant ou après épreuve, et décider du constat mis au registre.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation RV-6 (la règle du noyau qui fait de « Améliore ce prompt » un appel de skill, jouée par le hook `hook-lexique`) sur le prompt « améliorer tous les textes générés par la Factory, règles d'écriture à ne pas casser, liste de base pour le profil Claude » ; analyse L99 complète (8 couches), prompt réécrit, contrat de sortie, protocole de tests, esquisse de la liste profil ; un constat en passant journalisé au registre des candidats.
- **sur quoi** — le pilot `digit-ai-factory` (seul dépôt écrit) ; lectures seules sur les skills installés (`digit-ai-page-html`, `quality-oracles`, `systeme-de-marque`, `impeccable`), sur `digit-ai-forge-design` et `digit-ai-forge-data` (glossaires, oracle de slop), et sur sept sources externes (Wikipédia FR et EN, ISO 24495-1, agent-style, skill Microsoft, guides francophones de détection 2026).
- **quand** — 2026-09-11 16:20 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 15:55 (aucun horodatage du message reçu n'est disponible à l'outillage) ; durée mesurée ≥ 25 min.
- **qui** — pilot local `8e454c4`, bâti sur `2ab5125` (enregistrement d'une autre session à 14:09, huit candidatures du lot Produit-62) ; `origin/main` relu par `git status -sb` : le pilot est **16 enregistrements en avance**, dont un le mien ; session Fable 5.1, une délégation (agent Explore, modèle Opus, relevé en lecture seule des règles d'écriture existantes ; escalade : aucune) ; oracles joués : `check_markdown.py` avec ses quatre règles de lisibilité du Markdown : M7 (ouverture de chapitre par ce que le lecteur apprend), M10 (mode de lecture de chaque tableau), M14 (marqueurs de travail laissés dans le texte), M18 (glose de tout identifiant à son premier emploi) ; `todo\ingerer-lot.mjs`, `todo\oracle-todo.mjs`, `oracle-synthese` (ce document).

## 2. Verdict en une ligne

**Prompt d'origine 32/100 → prompt réécrit 88/100 (projeté) ; 19 défauts inventoriés dont 3 bloquants, tous clôturés au changelog ; 10 écarts à la lettre soumis un à un ; `check_markdown.py` PASS, exit 0, zéro défaut ; 1 candidature ingérée en candidat (lot 0c390a0a56d8, TF-1064, classe existante `regle-ecrite-sans-oracle-qui-la-joue`), `oracle-todo` exit 0, vues régénérées (282 actifs, 72 classes, 126 récidives) ; 1 enregistrement local `8e454c4` (8 fichiers), 0 push ; esquisse de liste profil de 12 règles livrée, non éprouvée par oracle.**

## 3. Décisions attendues de l'humain

Trois décisions.

> **D-1 — La lecture reconstruite de votre intention et les dix écarts à la lettre sont-ils validés, et le mandat « règles d'écriture » se lance-t-il avec le prompt réécrit ?**
>
> Le prompt réécrit cite vos mots mais s'en écarte à dix endroits, tous listés au bloc 6 : « tous les textes » devient une typologie fermée à cinq types avec des exclusions (code, données, citations, contrats, histoire) ; Wikipédia passe de « règle à suivre » à « source d'une donnée de signes », la doctrine se fondant sur des normes de rédaction (la norme ISO 24495-1 du langage clair, les règles canoniques d'Orwell, Strunk & White et Pinker) ; « à ne pas casser » devient doctrine + donnée + oracle déterministe + câblage ; « appliquées aux forges et aux produits » devient héritage et lots de travaux, parce que le pilot n'écrit pas chez eux ; « de façon importante » reçoit des indicateurs et une baseline ; la liste profil est bornée et subordonnée ; la finalité est dite (servir le lecteur, pas échapper à la détection) ; la précédence plancher / voix de marque est arbitrée ; la langue est fixée ; seuls les textes neufs et modifiés sont visés. La loi n° 7 (le résultat sert l'intention, pas la lettre) interdit de jouer un mandat sur une intention devinée : c'est vous qui validez la lecture.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` (« si elle est reconstruite par l'agent, elle est VALIDÉE par le demandeur avant d'exécuter »), `references\RUN-MANDAT.md` (forme d'un mandat transverse), `REGLES-PROJET.md` R-44 (« une consigne s'exécute ou décore ») et le registre `quality-oracles` §4 (« domaine sans oracle → définir + remonter »).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) valider la lecture et les dix écarts, lancer le mandat avec le prompt réécrit tel quel | effort complexe × long (relevé de l'existant, doctrine, donnée, oracle avec fixtures et baseline, câblage dans trois juges, héritage, lots de travaux, mesure) | exclut une simple liste d'interdits : chaque règle de cadence sera une règle de densité, et aucun mot isolé ne sera interdit |
| (b) valider avec amendements — répondre « D-1 (b) sauf écart n° X » | même effort, plus la reprise du prompt sur les points amendés avant le lancement | exclut un lancement dans ce tour : le prompt est réédité, rejugé, puis joué |
| (c) ne pas lancer le mandat maintenant | effort nul | exclut toute suite : le style des textes reste sans juge, la candidature reste en candidat |

> **Si rien n'est décidé** : l'option (c) s'applique — le prompt réécrit reste déposé dans l'analyse, le mandat n'est pas joué.

> **D-2 — La liste de douze règles pour votre profil Claude s'installe-t-elle après épreuve, maintenant telle quelle, ou pas du tout ?**
>
> Il s'agit de l'esquisse livrée au chapitre 8 de l'analyse : douze règles d'une phrase, sur la phrase et le lecteur, ouvertes par « les consignes de projet priment ». Elle n'a pas encore été éprouvée : le contrat du prompt réécrit exige qu'une restitution écrite sous ces règles passe `oracle-synthese` avant installation, parce que le profil s'applique à toutes vos sessions et n'est jugé par aucun oracle ; une règle mal formulée ferait boucler le hook de fin de tour. L'installation est un geste d'agent (écriture dans votre fichier de profil), sur votre feu vert.
>
> **Recommandation : (a).** Source consultée : `gabarits\RESTITUTION.md` (blocs et tableaux imposés, que la liste ne doit pas contredire), `REGLES-PROJET.md` R-43 (les règles de la factory impliquée priment), `CLAUDE.md` du pilot, garde-fou « livrable accepté sur le seul verdict d'un oracle exécuté ».

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) éprouver l'esquisse (une restitution écrite sous ces règles, jugée PASS) puis l'installer dans le profil | effort simple × court (une restitution d'essai, un jugement, une écriture dans le profil) | exclut une installation dans ce tour |
| (b) installer l'esquisse maintenant, telle quelle | effort simple × court | exclut la preuve : un défaut de formulation se verra au premier tour bloqué par le hook de fin |
| (c) ne pas installer | effort nul | exclut tout effet hors Factory : les règles ne vivront que dans les projets qui les câblent |

> **Si rien n'est décidé** : l'option (c) s'applique — l'esquisse reste dans l'analyse, rien n'est écrit dans votre profil.

> **D-3 — La candidature née du constat en passant est-elle décidée ?**
>
> Il s'agit du fait relevé en chemin : le style rédactionnel des textes de la Factory n'est jugé par aucun oracle déterministe du registre, trois règles de prose sont écrites et se déclarent elles-mêmes non mécanisées, et le seul détecteur de tics d'écriture générée du poste (trois motifs anglophones) est hors registre. La candidature est rattachée à une classe existante (« règle écrite sans oracle qui la joue ») ; l'ingestion l'a marquée « classe suspecte » parce que la classe a été créée il y a un jour sans clôture fondatrice, ce qui est une contre-métrique du tableau de bord, pas un refus. Son remède est le mandat de D-1 : si D-1 est (a), la candidature se rattache au mandat ; sinon elle attend un porteur.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine, clôture sur gains constatés »), `todo\CLASSES.json` (règle de la classe : « une règle sans juge ni candidature n'entre pas dans un texte opposable »).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) accepter la candidature et la rattacher au mandat de D-1 | effort simple × court (une décision journalisée) ; le remède est porté par le mandat | exclut un traitement séparé : la candidature se clôt avec le mandat, sur gains constatés |
| (b) accepter la candidature comme chantier distinct, sans le mandat | effort complexe × moyen (un oracle sans la doctrine qui le fonde) | exclut la doctrine positive : l'oracle naîtrait sans plancher écrit, et jugerait des mots |
| (c) laisser en candidat | effort nul | exclut tout porteur : le style reste sans juge |

> **Si rien n'est décidé** : l'option (c) s'applique — la candidature reste en candidat et compte à la contre-métrique.

## 4. Traité — avec sa preuve

- **L'analyse L99 est déposée et jugée** : huit chapitres, étalon noté, inventaire de 19 défauts (3 bloquants, 15 majeurs, 1 mineur), factcheck de quatre prémisses (une fausse quant à la nature, une fausse, une vraie, une invérifiable), cinq causes d'échec, trois attaques et lentille de robustesse, implications d'échelle, prompt réécrit, contrat de sortie, dix écarts à la lettre, protocole de tests, esquisse de liste profil, changelog, sources.
  - preuve : `C:\dev\digit-ai-factory\output\03-etudes\20260911-L99-regles-d-ecriture-factory.md` ; `check_markdown.py` → « Règles : M7, M10, M14, M18 — Verdict : PASS — Aucun défaut de lisibilité mécanisable détecté », exit 0.
- **Le score est mesuré dimension par dimension** : 32/100 avant (clarté 12/20, spécification 5/20, garde-fous 3/15, ancrage 4/15, vérifiabilité 3/15, robustesse 5/15), 88/100 projeté après.
  - preuve : tableau « Score avant → après » du chapitre 8 du fichier cité.
- **L'existant a été relevé en lecture seule, avec citations** : 41 règles S de synthèse, 31 règles L de lisibilité HTML, 4 règles M de Markdown, le contrat de voix `voix.md`, deux référentiels de jargon, la rubrique du juge LLM, les trois motifs de prose du détecteur `impeccable`, le contrat d'héritage (13 artefacts, version 1.8.0).
  - preuve : relevé de l'agent Explore (58 lectures, aucune écriture) ; extraits cités dans l'analyse avec fichier et ligne (`check_markdown.py` l. 23-30, `check_html.py` l. 603, `lisibilite.md` L30, `antipatterns.mjs` l. 212-245, `HERITAGE.json` 1.8.0).
- **Sept sources externes ont été lues et classées en deux familles** (normes de rédaction / catalogues de signes).
  - preuve : section « Sources externes consultées » du chapitre 8 ; lectures du 11/09 par l'outil de lecture web (Wikipédia FR : sept familles d'indices et la mise en garde « ne constituent en aucun cas des preuves » ; Wikipédia EN : « no single sign is definitive » ; ISO 24495-1 : quatre principes ; agent-style : 21 règles).
- **Un constat en passant est au registre en candidat, classé sur une classe existante** (TF-1064, `regle-ecrite-sans-oracle-qui-la-joue`).
  - preuve : `node todo\ingerer-lot.mjs … --sans-fetch` → « [OK] 1 candidature(s) ingérée(s) en CANDIDAT (lot 0c390a0a56d8) — la décision reste humaine », un avertissement « CLASSE SUSPECTE » ; `node todo\oracle-todo.mjs` → exit 0.
- **Les vues du registre sont régénérées.**
  - preuve : `generer-vue.mjs` → « TODO.md générée — 282 actifs, 21 forges cibles (sceau actifs 4c7804a42562) » ; `generer-page.mjs` → « 282 items, 21 forges » ; `generer-recidives.mjs` → « 72 classe(s), 126 récidive(s), 21 relevé(s) ».
- **Tout est enregistré localement, sur les seuls chemins du tour, et l'état du dépôt est relu à la source.**
  - preuve : `git commit --only` → `8e454c4`, « 8 files changed, 1113 insertions(+), 38 deletions(-) » ; `git status -sb` → `main...origin/main [ahead 16]` ; les fichiers modifiés par d'autres sessions (`input\00-retours\README.md`, `input\README.md`, `output\LISEZMOI.md`) sont laissés hors de l'enregistrement.

## 5. Non traité — avec son motif

- Le mandat lui-même (doctrine `ECRITURE.md`, donnée de tics, oracle `oracle-ecriture.mjs`, câblage, héritage 1.9.0, lots de travaux, mesure) — motif : dépendance à une décision humaine (D-1) ; la loi n° 7 interdit de jouer un mandat sur une intention reconstruite non validée, et l'appel du skill fait du message entier l'entrant du L99, pas une commande d'exécution.
- L'épreuve et l'installation de la liste profil — motif : dépendance à une décision humaine (D-2) ; le profil est hors du pilot et s'écrit sur votre feu vert.
- Le push du pilot (`2ab5125..8e454c4`, un enregistrement) — motif : bloqué par un garde-fou, R-38 §4-5 ; `8e454c4` porte un livrable explicite (l'analyse), donc hors de la couverture d'office du paragraphe 5.
- La mesure sur corpus des tournures françaises candidates (« il est important de noter », « plongeons », « à l'ère de », « crucial », « robuste ») — motif : dépendance à une décision humaine (D-1) ; c'est le premier geste de la donnée de tics, qui se joue avec le mandat ; en attendant, l'analyse les marque « à mesurer ».

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prompt : … » → **j'ai fait** l'analyse L99 complète (8 couches) avec prompt réécrit, et non une simple réécriture → **pourquoi** : le lexique RV-6 du noyau fait de « Améliore ce prompt » un appel du skill `prompt-analyzer-l99`, dont le livrable est cette analyse.
- **Vous avez écrit** « Fournis une liste de règles de base » → **j'ai fait** une esquisse de douze règles, livrée dans l'analyse, marquée non éprouvée, et non installée → **pourquoi** : le message entier est l'entrant du skill ; le profil est global et sans oracle, et le contrat exige une épreuve contre `oracle-synthese` avant installation (D-2).
- **Vous n'avez rien demandé** sur le registre → **j'ai** journalisé une candidature → **pourquoi** : noyau, garde-fous : « constat en passant → candidat » ; la classe existait, aucune classe neuve n'a été créée.
- **Les dix écarts entre votre prompt et le prompt réécrit** (typologie fermée et exclusions ; Wikipédia reclassée en source de donnée ; doctrine + donnée + oracle ; héritage et lots de travaux ; indicateurs et baseline ; textes neufs et modifiés seulement ; liste profil bornée et subordonnée ; finalité « pour le lecteur » ; précédence plancher / voix ; langue) sont détaillés poste par poste au chapitre 8 de l'analyse, section « Écarts à la lettre », et se valident ou se rejettent un à un par D-1.

## 7. Risques

- Le mandat, une fois lancé, produit quand même une liste d'interdits parce que c'est le livrable le plus rapide à mécaniser ;
  - signal : une règle de la doctrine qui interdit un mot ou un signe isolé, ou un oracle dont une fixture rouge ne porte qu'un tic ;
  - parade : le contrat de sortie du prompt réécrit l'interdit en toutes lettres (« aucun mot ni signe de ponctuation isolé interdit »), et la baseline à 95 % sur le corpus PASS récent refuse un oracle qui crie.
- L'oracle naît et condamne les textes normatifs de la Factory (`RESTITUTION.md`, `REGLES-PROJET.md`) écrits en tirets et en majuscules d'emphase ;
  - signal : un FAIL sur un fichier de doctrine non modifié dans le tour ;
  - parade : antériorité déclarée dans la typologie (jugés à leur prochaine modification), cas limite n° 3 du protocole de tests (attendu SKIP, jamais FAIL).
- La liste profil, si elle est installée sans épreuve (D-2 (b)), fait boucler le hook de fin de tour ;
  - signal : un même tour refusé deux fois par `oracle-synthese` sur une règle de structure ;
  - parade : D-2 (a) ; l'esquisse ne porte aucune règle de structure, mais seule l'épreuve le prouve.
- Deux sessions écrivent le même jour dans le pilot et se croisent sur le registre ;
  - signal : un enregistrement d'une autre session apparu pendant le tour (vu : `2ab5125` à 14:09) ;
  - parade : `git status` relu avant chaque enregistrement, `commit --only` sur les seuls chemins du tour, comme fait ici ; acceptation déclarée pour le reste.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), classées par dépendance — ce qui attend D-1 avant ce qui attend D-2 et D-3, le push en dernier parce qu'il attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Jouer le mandat avec le prompt réécrit (chapitre 8 de l'analyse) : relevé de l'existant, doctrine `references\ECRITURE.md`, donnée `references\tics-redactionnels.json` mesurée sur le corpus, `oracles\oracle-ecriture.mjs` avec fixtures et baseline ≥ 95 %, câblage dans `check_markdown`, `oracle-synthese` et `check_html`, registre §4, `HERITAGE.json` 1.9.0, un lot de travaux par forge concernée, tableau des indicateurs (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 ; à défaut, le mandat n'est pas joué | complexe × long |
| A-2 | Rééditer le prompt réécrit sur les écarts amendés, rejouer le L99 sur la seule section modifiée et faire juger la lisibilité, si D-1 (b) (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 (b) ; à défaut, le prompt reste tel quel | simple × court |
| A-3 | Éprouver l'esquisse de liste profil : écrire une restitution d'essai sous ces douze règles, la faire juger PASS par `oracle-synthese`, puis l'insérer dans votre fichier de profil Claude (neuve) | auto_ia | `dependance_bloc_3` — attend D-2 (a) ; à défaut, rien n'est écrit dans le profil | simple × court |
| A-4 | Journaliser les décisions D-1 à D-3 (`journaliser.mjs`), rattacher TF-1064 au mandat, régénérer les vues, rejouer `oracle-todo` (TF-1064) | auto_ia | `dependance_bloc_3` — attend D-1 et D-3 ; à défaut, la candidature reste en candidat | simple × court |
| A-5 | Pousser le pilot (`2ab5125..8e454c4` et l'enregistrement de cette synthèse), `FORGE_PUSH_GO` posé avec le motif, porte des noms rejouée par le hook pre-push (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain qui conditionne le geste) — attend le GO de A-9 : `8e454c4` porte un livrable explicite, R-38 §4 ; à défaut, tout reste local | simple × court |
| A-6 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) sauf écart n° X », ou « D-1 (c) » ; le mandat est joué par l'IA (neuve) | manuelle_utilisateur | `decision` — loi n° 7 : une intention reconstruite est validée par le demandeur avant exécution ; sinon : le mandat n'est pas joué | simple × court |
| A-7 | Trancher D-2 — répondre « D-2 (a) », « (b) » ou « (c) » ; épreuve et installation par l'IA (neuve) | manuelle_utilisateur | `decision` — le profil est votre fichier, hors du pilot ; sinon : rien n'est écrit dans le profil | simple × court |
| A-8 | Trancher D-3 — répondre « D-3 (a) », « (b) » ou « (c) » ; journalisation par l'IA (TF-1064) | manuelle_utilisateur | `decision` — la décision sur un candidat est humaine ; sinon : la candidature reste en candidat | simple × court |
| A-9 | Donner le feu vert de publication de `8e454c4` — répondre « pousse le pilot » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'un enregistrement portant un livrable explicite est un GO humain ; sinon : le pilot reste 16 en avance, en local | simple × court |

## 9. Traces

- Analyse L99 : `output\03-etudes\20260911-L99-regles-d-ecriture-factory.md` (enregistrement `8e454c4`).
- Sidecar de la candidature : `input\01-candidatures\style-redactionnel-sans-oracle-20260911a.tf.jsonl` (lot 0c390a0a56d8) ; registre `todo\TODO.jsonl` (TF-1064) ; vues `todo\TODO.md`, `todo\RECIDIVES.md` et la page générée du registre.
- Enregistrement local : `8e454c4` (8 fichiers) ; cette synthèse et les index régénérés sont enregistrés à sa suite.
- Oracles : `check_markdown.py` (PASS, 1 passe), `todo\ingerer-lot.mjs` (OK, 1 candidature), `todo\oracle-todo.mjs` (exit 0), `oracle-synthese` sur ce fichier (verdict au journal `.oracles-historique.jsonl` homonyme).
- Aucune page HTML livrée dans ce tour.
