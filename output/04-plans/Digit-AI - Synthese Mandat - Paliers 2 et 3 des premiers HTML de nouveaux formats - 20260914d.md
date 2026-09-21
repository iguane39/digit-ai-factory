---
destinataire: humain
---

# Synthèse de mandat — les trois règles sont écrites au socle, le premier format démuni a son point de départ, et la règle a trouvé le défaut dans le modèle de référence lui-même (14/09/2026)

Vos deux arbitrages sont exécutés. Les trois règles de composition vivent maintenant dans le socle des pages web, avec chacune sa paire d'exemples — un qui doit échouer, un qui doit passer — et la famille de livrables la plus employée parmi celles qui n'avaient rien reçoit sa page vide et son exemplaire rempli. Le fait le plus instructif du tour n'est aucun des deux : c'est que la règle sur les largeurs, une fois posée, a trouvé le défaut que votre retour du 11 septembre décrivait **dans le modèle de référence de la maison lui-même** — trois chapitres bridés et trois pleins, sur le squelette dont tous les rapports de données sont tirés. Le défaut n'était donc pas propre à un document : il était hérité. Je dois aussi vous signaler deux erreurs que j'ai commises en écrivant ces règles : chacune rendait un verdict favorable sur l'exemple écrit exprès pour la faire échouer, et ce sont ces exemples qui les ont attrapées. Ce qui est attendu de vous : un arbitrage sur le modèle de référence, qu'on ne corrige pas sans vous puisque tous les documents futurs en sortiront.

## 1. En-tête d'identification

- **quoi** — exécution des décisions humaines D-6 (a) et D-7 (b) du 14/09/2026 : écriture des trois règles de composition dans le socle, puis production du point de départ de la famille de rang 1.
- **sur quoi** — le socle `digit-ai-page-html`, porté par le dépôt voisin `digit-ai-forge-agents` **sous mandat** ; et le pilot `digit-ai-factory` (catalogue, registre, bibliothèque de gabarits).
- **quand** — 2026-09-14 13:20 CEST (UTC+02:00), durée ≈ 1 h 10, relevée à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrement `1d568b5` ; socle `digit-ai-forge-agents`, enregistrement `d75d76e`, skill porté en 1.22.0. Oracles exécutés : `check_html.py` (41 règles, empreinte `6d1f8858afdf`), `render_page.py` (27 familles, empreinte `134b408b62d7`), `self_test.py` du socle (272 cas), `oracle-gabarits-documents.mjs` — G1 : une famille porte sa doctrine et au moins un exemplaire ; G2 : l'exemplaire est rempli ; G3 : le marquage passe le contrôle du socle ; G4 : le document rend son gabarit et sa version, visiblement ; G5 : le point de départ est déclaré et son chemin vérifié sur disque, `oracle-todo.mjs`.

## 2. Verdict en une ligne

Les trois règles de **portée de page** sont écrites, documentées et jouées — L32 (un même ensemble n'est énuméré qu'une fois par page) dans `check_html.py`, V19 (la largeur de contenu est une propriété de la page) et V20 (une information qui lève un doute est visible au repos) dans `render_page.py` — toutes trois **avertissantes** à leur entrée, avec six exemples à double sens ; recette du socle **272 cas, 271 verts**, l'unique échec portant sur V9 — un actif visuel indiscernable de son fond — étant **environnemental** (Pillow absent de ce poste), la règle mordant de nouveau après installation ; jeu de règles **40 → 41** (`695359b17ff5` → `6d1f8858afdf`), familles de rendu **25 → 27** (`0542e111208d` → `134b408b62d7`) ; bruit mesuré **avant** mise en service sur les dépôts consommateurs — L32 sur **372 pages HTML de huit dépôts, un seul constat**, et c'est sa propre fixture rouge ; V19 et V20 sur les **41 pages livrables** rendues au navigateur, **zéro V20 et deux V19**, tous deux sur `gd-rapport-donnees` (squelette et instance), soit la famille dont le document a produit TF-1038 — des **vrais positifs** ; recette du pilot **13 oracles en défaut sur 107 contre 14** avant, même liste moins un ; **deux erreurs** commises en écrivant les règles, chacune rendant vert sur sa propre fixture rouge, trouvées par ces fixtures et consignées ; TF-1074 décidé puis **clos** `corrige` avec sa descente, TF-1038 portant la mesure du jour ; rang 1 outillé — `ordonnancement-mep` reçoit `SQUELETTE.html` et `INSTANCE.html`, `check_html` **PASS sans un seul avertissement** sur les deux, `render_page` PASS à 1920 px, `oracle-gabarits-documents` PASS G1-G5 ; couverture des familles déclarant `html` : **3 → 4 squelettes**, **14 → 13** sans point de départ.

## 3. Décisions attendues de l'humain

> **D-8 — Corrige-t-on le modèle de référence des rapports de données, ou déclare-t-on ses largeurs comme une exception ?**
>
> La règle sur les largeurs, jouée sur les quarante et une pages livrables du parc, a trouvé exactement deux documents en défaut : la page vide du modèle de rapport de données, et son exemplaire rempli. Trois de leurs chapitres sont bridés à mille quatre-vingts points et trois prennent mille trois cent cinquante — c'est le défaut que votre retour du 11 septembre décrivait, hérité par tout document tiré de ce modèle. Le corriger change ce que produiront toutes les instanciations futures ; le déclarer en exception revient à dire que l'alternance est voulue ici.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl`, item TF-1038, qui porte votre retour mot pour mot — « homogénéise la largeur des contenus de la page principale pour ne pas avoir des grandes largeurs mixées avec des petites largeurs » — et la mesure du 14/09 que je viens d'y inscrire. Un modèle qui porte le défaut que le retour dénonce le rejouera à chaque emploi.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Corriger le modèle : une seule largeur pour toutes ses sections | complexité simple × durée courte ; toute instanciation future change d'allure | exclut la colonne de lecture étroite sur ce modèle — un rapport de données devient plein partout |
| **(b)** Déclarer ses sections en exception motivée | complexité simple × durée courte | exclut la correction : le défaut reste, déclaré plutôt que réparé, et chaque document tiré du modèle le porte |
| **(c)** Ne rien faire pour l'instant | rien | exclut la clôture de TF-1038 : le constat reste ouvert avec sa mesure, et le prochain rapport le reproduira |

*Si rien n'est décidé* : (c) s'applique — la mesure reste au registre, le modèle reste tel quel.

> **D-9 — Continue-t-on les rangs suivants, ou s'arrête-t-on au premier ?**
>
> Le premier format démuni est outillé : la famille qui sert à ordonnancer une mise en production a maintenant sa page vide et son exemplaire rempli, et les deux naissent conformes aux règles neuves. Douze familles déclarant produire des pages web restent sans point de départ, rangées par usage réel. L'étude bornait ce travail aux trois premiers rangs tant que la mesure du 15 octobre n'existe pas.
>
> **Recommandation : (b).** Source consultée : `output/03-etudes/20260914-etude-opportunite-premiers-html-nouveaux-formats.md` § 5, où le troisième palier est explicitement borné aux trois premiers rangs, avec son critère de réouverture — et le § 0 bis, qui déclare que le coût du démarrage à froid reste non démontré faute de mesure.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Traiter les douze familles restantes | complexité complexe × durée longue | exclut la mesure intermédiaire : douze modèles produits avant de savoir si le premier tient |
| **(b)** Traiter les rangs 2 et 3, puis s'arrêter jusqu'à la revue | complexité moyenne × durée moyenne | exclut les neuf autres jusqu'au 15 octobre |
| **(c)** S'arrêter au rang 1 | rien de plus | exclut toute comparaison : un seul modèle neuf ne dit pas si le patron se généralise |

*Si rien n'est décidé* : (c) s'applique — le rang 1 vous reste acquis et rien d'autre ne part.

## 4. Traité — avec sa preuve

- **Les trois règles de composition sont écrites dans le socle, sous votre mandat, et le skill est porté en 1.22.0.**
  - preuve : dépôt `digit-ai-forge-agents`, enregistrement `d75d76e` ; `check_html.py --version-regles` rend **41 règles, empreinte `6d1f8858afdf`** (contre 40 et `695359b17ff5` avant) ; `render_page.py` passe de **25 à 27 familles** (`134b408b62d7`) ; copie installée du skill synchronisée et vérifiée à la même empreinte.
- **Chaque règle est jouée dans les DEUX sens, par sa propre paire d'exemples.**
  - preuve : `python3 scripts/self_test.py` du socle → `l32-double-enumeration.html attendu L32 obtenu L32` · `l32-enumeration-unique.html attendu (aucune règle) obtenu (aucune)` · `v19-largeurs-melangees.html attendu largeurs_melangees ×1 obtenu ×1` · `v19-largeur-homogene.html ×0 obtenu ×0` · `v20-doute-invisible.html ×1 obtenu ×1` · `v20-doute-visible.html ×0 obtenu ×0` ; **271/272 cas passés**.
- **L'unique échec de la recette n'est pas le mien — contrôle rouge → vert rejoué, et la cause nommée.**
  - preuve : `v9-logo-invisible.html` rendait `obtenu ×0` ; cause lue dans la sortie de `render_page.py` : « V9 non jugée : Pillow absent de l'environnement » ; après `pip install pillow`, la même fixture rend **`[BLOQUANT] V9 actif visuel indiscernable de son fond — meilleur contraste 1.01:1 sur 15360 pixels opaques`**. Défaut d'environnement, pas de règle.
- **Bruit mesuré AVANT mise en service, sur les dépôts qui consomment le socle — et il ne se raconte pas, il se compte.**
  - preuve : L32 jouée sur **372 pages HTML de huit dépôts** → `{"lues": 372, "L32": 1}`, et l'unique page touchée est `l32-double-enumeration.html`, sa propre fixture rouge. V19 et V20 jouées au navigateur sur les **41 pages livrables** du parc → `{"lues": 41, "V19": 2}`, zéro V20.
- **Les deux constats V19 sont des VRAIS POSITIFS, et ils portent sur le modèle de référence de la maison.**
  - preuve : les deux pages touchées sont `gabarits/documents/rapport-de-donnees/SQUELETTE.html` et son `INSTANCE.html` ; mesure au navigateur à 1920 px : **six sections sœurs, trois à 1 080 px (80 % de la largeur offerte) et trois à 1 350 px (100 %)**. C'est mot pour mot le défaut de TF-1038, dans le squelette dont tous les rapports de données sont tirés.
- **Deux erreurs commises en écrivant les règles, trouvées par leurs propres fixtures — contrôle rouge → vert rejoué, et la classe nommée.**
  - preuve : (1) L32 bornait l'identifiant par une frontière de mot, or le texte d'une ligne de tableau est concaténé sans séparateur — sonde : `'RP-01Une police distante chargee au demarragebloqu'` — la règle **rendait VERT sur sa propre fixture rouge** ; borne changée en `(?![0-9-])`, la fixture rouge rend `L32 double enumeration : 9 identifiants`. (2) V19 cherchait `.chap, main > section` et ne voyait, sur le squelette de référence, **que les trois sections bridées** — toutes à 1 080 px, donc un seul groupe, donc vert ; mesure du DOM : les trois sections pleines vivent sous `div.doc-corps` et ne sont ni `.chap` ni filles directes de `main`. Elle compare désormais des **sœurs**, par parent. Classe commune : un contrôle qui reconnaît sa cible par la forme d'un sélecteur plutôt que par la relation qu'il prétend mesurer.
- **Les trois règles sont documentées là où un producteur les cherchera.**
  - preuve : `references/lisibilite.md` § L32 (le fait, les trois bornes et pourquoi chacune, l'exemption déclarée, le bruit mesuré, et la borne trouvée en écrivant la règle) ; `references/zero-defaut-visuel.md` § V19 et V20, avec le **recouvrement déclaré** entre V19 et la famille `l2_freres` plutôt que masqué ; `check_markdown.py` rend `PASS` sur `zero-defaut-visuel.md`, et sur `lisibilite.md` les quatre défauts relevés **préexistaient** — mesure par remisage : 4 avant, 4 après.
- **Le registre porte la clôture et la mesure.**
  - preuve : `node todo/journaliser.mjs` → 3 événements, `verdict_avant: PASS -> verdict_apres: PASS` ; TF-1074 `maj decide` (décideur humain, 14/09) puis `maj corrige` avec sa `descente` nommant la règle et l'oracle qui la joue ; TF-1038 porte la mesure du 14/09. `oracle-todo` PASS.
- **Le rang 1 a son point de départ, et il naît CONFORME aux règles qui viennent d'être posées.**
  - preuve : `gabarits/documents/ordonnancement-mep/SQUELETTE.html` et `INSTANCE.html`, dérivés du squelette de référence et portant les cinq sections de la doctrine de la famille ; `check_html.py` rend **`Verdict : PASS` + « Aucun problème détecté »** sur les deux — ni échec, ni avertissement ; `render_page.py` rend `Verdict : PASS` à 1920 px ; `oracle-gabarits-documents` rend PASS avec G1 à G5 verts sur la famille. **Aucune de ses sections ne porte `.chap.lire`** : une seule largeur de contenu, là où le squelette de référence en porte deux.
- **La couverture du catalogue a bougé, et elle est mesurée.**
  - preuve : extraction rejouée sur `gabarits/documents/catalogue.jsonl` → `html: 20 | {"squelette":4,"aucun":13,"generateur":2,"canevas":1}`, contre 3 squelettes et 14 sans point de départ au début du tour.
- **Le relevé d'empreintes du parc a vu le changement de socle, et le dit.**
  - preuve : `node scripts/relever-empreintes-skills.mjs` → « RÈGLES DU SOCLE CHANGÉES depuis le relevé du 2026-09-14T10:36:20.253Z — 1 skill : digit-ai-page-html `be924780bad8` → `eed4cd7de09f` (225 → 231 fichiers) […] check_html : 40 règles (`695359b17ff5`) → 41 règles (`6d1f8858afdf`) ».
- **La recette complète du pilot ne perd rien au changement de socle, et gagne un oracle.**
  - preuve : `node oracles/self-tests.mjs` après la montée du socle rend **13 oracles en défaut sur 107**, contre **14** avant — même liste, moins `verifier-rendu-instances.mjs` qui passe désormais au vert. Aucun défaut neuf.
- **Travail enregistré et publié côté pilot.**
  - preuve : enregistrement `1d568b5` poussé sur `claude/html-quality-new-formats-qhfgvj`.

## 5. Non traité — avec son motif

- **Le socle n'est pas publié** — motif : accès, éprouvé et non affirmé — la commande `git -C /home/user/digit-ai-forge-agents push origin main` a été jouée le 14/09 et rend `access denied by the git proxy […] not in this session's authorized repository set`, erreur HTTP 403. L'enregistrement `d75d76e` existe en local et attend un poste autorisé.
- **Le modèle de référence `gd-rapport-donnees` n'est pas corrigé** — motif : dépendance à une décision humaine, le corriger change toute instanciation future ; c'est l'objet de la décision D-8.
- **Les rangs 2 et suivants ne sont pas outillés** — motif : dépendance à une décision humaine ; c'est l'objet de la décision D-9.
- **Les quatre candidats TF-1075, TF-1076, TF-1077 et TF-1038 ne sont pas décidés** — motif : dépendance à une décision humaine, le passage de candidat à décidé exige un décideur et sa date.
- **Rien** d'autre : la recette complète du pilot a rendu son verdict avant cette synthèse et il est porté au bloc 4.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 6a » — me mandater pour écrire les trois règles dans le socle | Écrites et enregistrées **en local** chez le dépôt voisin, **non publiées** | La publication a été tentée et refusée : erreur HTTP 403 du relais, le dépôt n'étant pas dans l'ensemble autorisé de cette session. **Restriction subie, pas choisie** : le travail est fait et attend un poste qui peut publier |
| « 7b » — écrire le point de départ du **premier rang** | Le rang 1, et lui seul | Conforme à la lettre. **Aucun écart** |
| (non dit) | J'ai installé deux dépendances sur ce poste : une version de `playwright` alignée sur le navigateur préinstallé, et `pillow` | Sans la première, l'oracle de rendu ne démarrait pas ; sans la seconde, une famille entière n'était pas jugée et la recette rendait un faux échec. **Écriture ajoutée** hors des dépôts, sur l'environnement |
| (non dit, et c'est une erreur de ma part) | Mes deux premières versions de règles rendaient VERT sur leur propre fixture rouge | Corrigées avant enregistrement, et **ce sont les fixtures qui les ont trouvées**. Consignées dans le code, dans la documentation et dans le journal du skill plutôt que tues |

## 7. Risques

- **Le socle est modifié en local et jamais publié : deux vérités coexistent.**
  - signal : un autre poste joue `check_html.py` et rend 40 règles avec l'empreinte `695359b17ff5`, pendant que celui-ci en rend 41.
  - parade : le relevé d'empreintes du pilot compare à chaque ouverture de session et **nomme l'écart** ; la ligne du 14/09 le dit déjà. La publication reste à faire depuis un poste autorisé, et elle est portée au bloc 8.
- **Les deux constats V19 sur le modèle de référence sont pris pour du bruit et la règle est desserrée.**
  - signal : quelqu'un propose de relever le seuil de V19 ou d'exempter `.chap.lire` en bloc.
  - parade : la mesure est écrite des deux côtés — au journal du skill et à TF-1038 — avec les largeurs exactes, 1 080 contre 1 350 px sur six sections sœurs ; et c'est le retour humain du 11/09 qui décrit ce défaut, pas la règle qui l'invente.
- **Les trois règles restent avertissantes indéfiniment et personne ne les durcit.**
  - signal : au 15 octobre, aucune n'est passée bloquante et le compteur de constats n'a pas bougé.
  - parade : la revue datée du 2026-10-15 porte explicitement la question du nombre de constats produits par ces règles ; une revue sans réponse est elle-même un constat.
- **Le nouveau point de départ vieillit sans que personne le rejoue.**
  - signal : un rapport d'ordonnancement produit dans six mois porte une version de gabarit qui ne correspond plus au squelette.
  - parade : G4 exige que le couple gabarit et version soit **rendu visiblement** sur le document, et G5 vérifie le chemin du point de départ sur disque à chaque passage de la recette du pilot.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes de ce jour.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-19** | Répondre `D-8` et `D-9` par leur lettre — par exemple « D-8 a, D-9 b » | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, corriger un modèle dont sortiront tous les documents futurs, et fixer jusqu'où aller, vous appartiennent. Fichier à lire d'abord : `gabarits/documents/ordonnancement-mep/INSTANCE.html` | les options par défaut (c) et (c) s'appliquent : le modèle de référence garde son défaut, et les douze familles restantes restent démunies |
| **A-20** | Publier l'enregistrement `d75d76e` du socle depuis un poste autorisé sur `digit-ai-forge-agents` | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `acces` — tentative RÉELLEMENT jouée le 14/09 : `git -C /home/user/digit-ai-forge-agents push origin main` rend `remote: access denied by the git proxy: iguane39/digit-ai-forge-agents is not in this session's authorized repository set` puis `fatal: […] The requested URL returned error: 403`. La même commande depuis un poste autorisé | les trois règles ne vivent que sur ce poste ; tout autre poste continue de juger avec 40 règles, et l'écart se lira comme une panne |
| **A-21** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des quatre tours reste sur une branche latérale |
| **A-22** | Corriger le modèle `gd-rapport-donnees` : une seule largeur de contenu pour ses six sections | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-8 (option (a) ou (b)) | le défaut du 11/09 reste dans le modèle, et chaque rapport de données le reproduit |
| **A-23** | Outiller les rangs 2 et 3 — `rapport-mapping` et `consolidation-process` : page vide et exemplaire | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-9 (option (a) ou (b)) | douze familles déclarant produire des pages web restent sans point de départ |
| **A-24** | Décider le sort des candidats TF-1038, TF-1075, TF-1076 et TF-1077 | auto_ia | action `neuve`, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | quatre constats restent en attente, et le compteur de récidives les ignore |
| **A-25** | Tenir la revue datée : nombre de constats produits par L32, V19 et V20 sur le parc, et retours humains par famille outillée contre famille démunie | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | les trois règles restent avertissantes sans qu'on sache si elles ont servi, et l'hypothèse du coût de démarrage reste indémontrable |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ce jour étant des items de forge.

## 9. Traces

- `digit-ai-forge-agents`, enregistrement `d75d76e` — socle `digit-ai-page-html` 1.22.0 : L32 dans `scripts/check_html.py`, V19 et V20 dans `scripts/render_page.py`, six fixtures, `scripts/self_test.py`, `references/lisibilite.md`, `references/zero-defaut-visuel.md`, `SKILL.md`. **Non publié** (voir A-20).
- `gabarits/documents/ordonnancement-mep/SQUELETTE.html` et `INSTANCE.html` — le point de départ du rang 1 ; `check_html` PASS sans avertissement, `render_page` PASS à 1920 px.
- `gabarits/documents/catalogue.jsonl` — `ordonnancement-mep` passe de `aucun` à `squelette` ; couverture 4 squelettes, 2 générateurs, 1 jeu de canevas, 13 sans point de départ.
- `todo/TODO.jsonl`, `todo/TODO.md`, `todo/TODO.html`, `todo/RECIDIVES.md` — TF-1074 clos avec sa descente, TF-1038 porte la mesure du jour ; `oracle-todo` PASS.
- `output/06-travaux-confies/pilot - TRAVAUX - 20260914a.md` — le lot qui spécifiait les trois règles, désormais exécuté.
- Enregistrement `1d568b5` sur `claude/html-quality-new-formats-qhfgvj`, poussé ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Les pages HTML citées comme livrées dans ce tour** — le squelette et l'exemplaire de `ordonnancement-mep` — portent le verdict de la critique d'implémentation : **non jouée**, faute de mandat forge-design dans ce tour ; les deux oracles de rendu et de marquage du socle sont verts, et ce n'est pas la même chose, donc c'est dit plutôt que tu.
