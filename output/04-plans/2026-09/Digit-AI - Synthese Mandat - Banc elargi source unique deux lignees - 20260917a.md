---
destinataire: humain
---

# Synthèse de mandat — le banc du socle voyait une largeur sur six, et deux lignées du même socle portaient le même numéro (17/09/2026)

Vos deux mandats sont exécutés, et le banc du socle rend 322 cas sur 322. Avant de pouvoir y toucher, il a fallu régler autre chose : pendant que ce poste construisait ses règles sans pouvoir les publier, un autre publiait seize enregistrements, et les deux versions du socle portaient le même numéro. La fusion s'est bien passée — soixante fichiers sans heurt, trois à réunir à la main — et une décision prise ailleurs, qui assouplit une règle de lecture, a fait apparaître qu'une de mes pages d'essai ne mesurait plus ce qu'elle prétendait mesurer. Sur le fond, l'élargissement du banc a payé immédiatement : deux pages d'essai déclarées vertes depuis leur naissance étaient fautives sur petit écran, et personne ne l'avait vu parce que le banc ne regardait qu'une seule taille d'écran. La source unique des extensions est posée, avec la garantie qui manquait le plus : si le fichier de référence devient illisible, les contrôles s'arrêtent au lieu de rendre un feu vert. Ce qui est attendu de vous : de publier ce qui attend sur ce poste, et de trancher ce qu'on fait d'un poste qui ne peut pas publier.

## 1. En-tête d'identification

- **quoi** — exécution des décisions humaines D-14 (a) et D-15 (a) du 17/09/2026 : élargir le banc du socle à toutes ses largeurs et traiter ce qui rougit, puis poser une source unique pour les extensions jugées et faire dire au contrôle borné qu'il l'est.
- **sur quoi** — le socle `digit-ai-page-html`, dans `digit-ai-forge-agents`, **sur mandat** ; et le pilot `digit-ai-factory` : quatre contrôles, un référentiel neuf, une recette neuve, le registre.
- **quand** — 2026-09-17 de 08:20 à 12:55 CEST (UTC+02:00), durée ≈ 4 h 35, relevée à l'horloge du poste — dont environ 1 h 40 de banc joué deux fois.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrements `11fe59b`, `e07f252` (socle, locaux) et `7a9150e` (pilot, poussé) ; oracles exécutés : `self_test.py` du socle (322 cas), `render_page.py`, `lib-extensions-jugees.test.mjs`, `oracle-unicite`, `oracle-propagation`, `oracle-trace-mutation-mep`, `oracle-todo`, et la recette complète du pilot.

## 2. Verdict en une ligne

Le banc du socle joue désormais sa grille de 55 fixtures sur **six largeurs au lieu d'une** — 330 rendus au lieu de 55 — et l'élargissement a trouvé deux fixtures fausses du premier coup, déclarées vertes depuis leur naissance : `ctrl-rangee-alignee.html` tenait quatre contrôles sur 390 px de fenêtre, soit 85 px chacun, et `l29-table-hote-socle.html` posait son en-tête collant sur les lignes à 768 comme à 390 px ; banc **319/322** à l'élargissement, **322/322** après correction. Préalable imprévu : deux lignées du socle portaient toutes deux le numéro 1.22.0 — fusion mesurée à 60 fichiers sans conflit et 3 avec, tous trois des additions parallèles, et une décision humaine prise ailleurs (V18, la mesure de lecture au-delà du 2K, passée de 100 à 135 caractères par ligne) a fait devenir verte une de mes fixtures rouges, recalibrée en conséquence ; socle en 1.25.0. Le périmètre des extensions vit maintenant en donnée — deux rôles, chaque extension présente et absente motivée — lue par les quatre contrôles qui l'énuméraient ; recette neuve **11/11**, dont quatre sens rouges qui vérifient que le lecteur s'arrête au lieu de rendre une liste vide. La borne du contrôle de mise en production se déclare : un dossier au cinquième niveau rendait PASS sans un mot, il rend désormais son chemin en non-jugé. Registre : 3 constats clos avec leur descente, 1 ouvert, `oracle-todo` PASS, 309 actifs. Recette du pilot : **15/108**, la seule entrée apparue venant d'un dépôt frère mis à jour ce matin.

## 3. Décisions attendues de l'humain

Les deux arbitrages précédents sont exécutés et clos. Ceux-ci naissent de ce que l'exécution a révélé : trois enregistrements du socle attendent sur un poste qui ne peut pas les publier, et c'est la troisième fois que ce blocage produit du travail en double.

> **D-16 — Que fait-on d'un poste qui produit du socle et ne peut pas le publier ?**
>
> Ce poste a construit des règles pendant trois jours sans pouvoir les pousser. Pendant ce temps, un autre poste publiait seize enregistrements sur le même socle, et les deux ont fini par porter le même numéro de version. La fusion s'est bien passée cette fois, mais elle a coûté une réconciliation, un recalibrage de page d'essai, et elle aurait pu coûter bien plus si les deux côtés avaient touché aux mêmes règles. Trois enregistrements attendent encore.
>
> **Recommandation : (a).** Source consultée : `oracles/hook-ouverture.mjs`, dont le relevé de ce matin affiche « DIVERGÉ (2 devant, 16 derrière) » sur ce dépôt — le parc sait déjà nommer l'état, mais personne ne le voit avant qu'il ait coûté ; et la mesure du jour, une version dupliquée pour trois jours sans publication.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Ouvrir le droit de publication du socle à ce poste | complexité simple × durée courte ; un réglage d'accès | exclut de continuer à produire du socle qui ne quitte pas la machine, et les collisions de version que cela fabrique |
| **(b)** Interdire à ce poste d'écrire dans le socle, et n'y remonter que des constats | complexité simple × durée courte | exclut toute correction éprouvée depuis ce poste : les trois correctifs du 15/09 n'auraient été que des tickets |
| **(c)** Continuer ainsi, en publiant à la main depuis un autre poste | rien de plus | exclut la régularité : la prochaine divergence dépendra du délai entre deux publications manuelles |

> **Si rien n'est décidé** : (c) s'applique — trois enregistrements attendent sur ce poste, et la prochaine divergence se règlera comme celle-ci, à la main.

> **D-17 — Le banc du socle est six fois plus long : garde-t-on ce prix tel quel ?**
>
> Jouer la grille sur toutes les largeurs a immédiatement trouvé deux défauts réels, donc la mesure valait son prix. Mais le banc complet demande désormais près de cinquante minutes au lieu d'une dizaine, et un banc qu'on n'a plus le temps de jouer finit par ne plus être joué du tout — ce qui coûterait davantage que l'angle mort qu'on vient de fermer.
>
> **Recommandation : (b).** Source consultée : `scripts/self_test.py` du socle, dont j'ai relevé qu'il porte déjà trois fonctions dédiées chacune à une largeur particulière — 2560 px, 390 px et 768 px. Le banc sait donc déjà séparer ce qui se joue partout de ce qui se joue à un endroit précis, et la grille peut faire de même sans rien perdre ; la durée, elle, est mesurée sur les deux passages complets de ce tour, environ cinquante minutes chacun contre une dizaine auparavant.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Garder les six largeurs sur toute la grille | environ cinquante minutes par passage | exclut de jouer le banc au fil de l'écriture : il devient un geste de fin de tour |
| **(b)** Deux largeurs par défaut, les six sur demande et en recette complète | complexité simple × durée courte | exclut de voir un défaut de largeur intermédiaire dès la première frappe, mais pas de le voir avant publication |
| **(c)** Revenir à une seule largeur | rien | exclut tout ce que ce tour vient de trouver, et rouvre l'angle mort qui a coûté deux fixtures fausses |

> **Si rien n'est décidé** : (a) s'applique — le banc reste complet et lent, ce qui est le côté sûr de l'erreur.

## 4. Traité — avec sa preuve

- **Deux lignées du socle réunies** — contrôle rouge → vert joué sur une copie *avant* le dépôt réel, et la classe nommée : une version choisie sur un poste qui ne peut pas publier n'est qu'une intention.
  - preuve : `git merge` sur un clone d'essai rend **60 fichiers sans conflit et 3 avec** ; les trois sont des additions parallèles — la ligne V18 (la mesure de lecture au-delà du 2K) du distant plus mes lignes V19 et V20, les deux jeux de cas du banc, les deux changelogs. Banc joué sur la copie **avant** application : **322/322**. Socle porté en **1.24.0** par l'enregistrement `11fe59b`.
- **Une fixture recalibrée** — contrôle rouge → vert rejoué, et la classe nommée : une fixture calibrée sur un seuil que la règle abandonne ne mesure plus ce qu'elle dit mesurer.
  - preuve : `v19-egalise-par-le-bas.html` attendait `v18_prose_etiree ×1` contre un plafond de 100 caractères par ligne ; la décision humaine du 15/09 l'a porté à 135 et le cas rendait `obtenu ×0`. Son conteneur ne borne plus rien : elle rend de nouveau **1 contre 0** pour sa verte, et le banc repasse à 322/322.
- **Le banc joue toutes les largeurs**, et ses deux lectures ne sont plus symétriques.
  - preuve : `run_rendu()` n'envoie plus `--widths 1440` — sans drapeau, `render_page` applique son périmètre. Une fixture rouge est jugée sur le **maximum** des largeurs, une verte sur la **somme** : un défaut n'a besoin de se voir qu'une fois, une promesse d'absence vaut partout. Le constat nomme la fenêtre.
- **Deux fixtures fausses trouvées du premier coup** — contrôle rouge → vert rejoué sur chacune, et la classe nommée : un vert qui ne vaut que pour la fenêtre où il a été obtenu.
  - preuve : banc **319/322** à l'élargissement. `ctrl-rangee-alignee.html` rendait `controles_desalignes ×1` à 390 px — quatre contrôles en grille fixe de quatre colonnes, soit 85 px chacun ; `l29-table-hote-socle.html` rendait `entete_pose_sur_lignes` et `entete_ne_colle_pas`, une fois à 768 px et une fois à 390 px. Après correction dans le sens que le socle prescrit ailleurs — la rangée se replie, la table se replie en cartes — **aucun constat sur les six largeurs**, et le banc rend **322/322**.
- **Le périmètre des extensions est une donnée**, et non plus quatre listes de code.
  - preuve : `references/EXTENSIONS-JUGEES.json` porte deux rôles — les livrables rendus à un humain, et ce qui se lit comme du texte pour un balayage — avec le motif de chaque extension **présente** et de chaque extension **absente** : `.pptx` y est déclaré absent avec la condition de son entrée, ce qu'une liste en dur ne sait pas faire. Les quatre contrôles le lisent : `verifier-jeu-livrables`, `verifier-jugement`, `oracle-propagation`, `oracle-unicite`.
- **La garantie d'une source unique** est éprouvée dans ses quatre sens rouges.
  - preuve : `node scripts/lib-extensions-jugees.test.mjs` rend **11/11 PASS**, dont quatre cas joués **dans un processus séparé** — le module met sa lecture en cache, et un cache chaud masquerait le défaut cherché. Référentiel illisible, sans rôle, rôle vide, rôle absent : le lecteur **s'arrête** au lieu de rendre une liste vide, parce qu'un balayage qui ne cherche rien rend un feu vert.
- **La borne de recherche se déclare** — contrôle rouge → vert joué sur pièce, et la classe nommée : un commentaire qui promet plus large que son code.
  - preuve : sur une arborescence fabriquée portant un dossier de mise en production au **cinquième** niveau, le contrôle rendait `PASS` sans un mot ; il rend désormais TM0 (la borne de recherche se déclare au verdict) en « `NON_JUGE` — recherche bornée à 4 niveaux : 1 branche(s) non descendue(s) », avec le chemin exact. Sur une arborescence sans branche coupée, aucun constat de borne. Self-test de l'oracle : **8/8**.
- **Aucun des quatre contrôles modifiés ne perd ce qu'il jugeait.**
  - preuve : `verifier-jeu-livrables` rend **38 findings avant comme après** sur la bibliothèque de gabarits, mesuré en remisant puis rappliquant mes modifications ; self-tests `oracle-unicite` **14/14**, `oracle-propagation` **8/8**, `oracle-trace-mutation-mep` **8/8**.
- **La recette gagne un contrôle et un défaut**, et le défaut ne vient pas de ce tour.
  - preuve : **15 oracles en défaut sur 108** — 108 et non 107, la recette neuve des extensions y entrant. La comparaison des deux listes rend une seule entrée apparue : `oracle-empreintes.mjs (parc réel)`, dont le constat nomme `digit-ai-forge-design/oracles/oracle-dtcg.mjs`, un site de scellement arrivé avec la mise à jour du parc de ce matin. Constat **TF-1091**, ouvert.
- **Registre tenu et travail du pilot publié.**
  - preuve : `oracle-todo` rend PASS, **309** actifs ; TF-1087, TF-1088 et TF-1089 décidés puis clos avec leur descente, TF-1091 ouvert en candidat. Enregistrement `7a9150e` poussé sur `claude/html-quality-new-formats-qhfgvj`.

## 5. Non traité — avec son motif

- **Les trois enregistrements du socle** — motif : accès, éprouvé à 12:50 — `git -C /home/user/digit-ai-forge-agents push origin main` rend `access denied by the git proxy: iguane39/digit-ai-forge-agents is not in this session's authorized repository set`, erreur HTTP 403 ; l'API GitHub de cette session est bornée au même ensemble, seule autre voie existante. C'est ce blocage qui a produit la collision de version, et l'objet de la décision D-16.
- **Le site de scellement non déclaré** — motif : hors mandat, D-14 (a) et D-15 (a) portaient sur le banc du socle et sur les périmètres de mesure ; il est arrivé par la mise à jour du parc, et sa déclaration demande de lire un dépôt frère pour la dire juste.
- **Les quatre défauts de forme du socle relevés le 15/09** — motif : hors mandat, toujours, et le mandat de ce tour ne les couvrait pas davantage que celui d'avant-hier.
- **La durée du banc** — motif : dépendance à un arbitrage, la ramener est l'objet de la décision D-17 et engage un choix de méthode, pas un réglage.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 14a » — jouer la grille du socle sur toutes ses largeurs, et traiter ce qui rougit | Fait — banc 319/322 à l'élargissement, deux fixtures corrigées, 322/322 après | Conforme à la lettre. **J'ai corrigé les fixtures plutôt que les règles** : dans les deux cas la règle avait raison et la page d'essai avait tort |
| « 15a » — une source unique pour les extensions, et le contrôle borné qui le dit | Fait, et la source unique est une **donnée** datée et motivée, pas une constante | Conforme à la lettre. **Le choix de la donnée** est un ajout : une liste qui grandit quand une famille naît est périssable, et la loi transverse n° 4 la veut éditable et sourcée |
| (non dit) | J'ai fusionné deux lignées divergentes du socle avant de pouvoir exécuter le mandat | **Préalable assumé**, mesuré avant d'agir : la fusion a été jouée sur un clone d'essai, banc compris, et n'a été appliquée au dépôt qu'une fois verte. Travailler sur une base périmée aurait produit une troisième lignée |
| (non dit) | J'ai retenu la valeur du distant là où nos deux versions se contredisaient | Elle était **publiée et décidée** ; la mienne ne l'était pas. Un poste qui ne peut pas publier n'arbitre pas contre un poste qui a publié |
| (non dit) | J'ai recalibré une fixture que je venais d'écrire | Une décision prise ailleurs avait déplacé le seuil qu'elle mesurait. **Une fixture devenue verte** parce que la règle a bougé n'est pas un faux positif : c'est une fixture qui ne mesure plus rien |

## 7. Risques

- **Le banc devient trop long pour être joué**, et cesse de l'être.
  - signal : un prochain tour enregistre un changement de socle sans que le banc ait tourné.
  - parade : c'est l'objet de la décision D-17, et l'option recommandée garde les six largeurs là où elles comptent — en recette complète, avant publication.
- **La prochaine divergence porte sur les mêmes règles**, et la fusion se passe mal.
  - signal : un relevé d'ouverture affiche « DIVERGÉ » avec des fichiers de règles des deux côtés.
  - parade : c'est l'objet de la décision D-16 ; en attendant, la méthode de ce tour est écrite dans le changelog du socle — clone d'essai, banc joué avant application, valeur publiée qui l'emporte.
- **La source unique devient un point de panne** pour quatre contrôles à la fois.
  - signal : un contrôle rend un verdict vide ou refuse de démarrer après une édition du référentiel.
  - parade : c'est exactement ce que les quatre sens rouges de la recette vérifient — le lecteur s'arrête plutôt que de rendre une liste vide, et un arrêt se voit là où un vert faux ne se voit pas.
- **Les deux fixtures corrigées dans le mauvais sens**, et une règle du socle s'assouplit sans le dire.
  - signal : un livrable réel reproduit l'un des deux défauts sans qu'aucun contrôle ne parle.
  - parade : aucune règle n'a été touchée — seules deux pages d'essai ont changé, et dans le sens que le socle prescrit partout ailleurs : une rangée se replie, une table se replie en cartes.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-46** | Répondre `D-16` et `D-17` par leur lettre — par exemple « D-16 a, D-17 b » | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, ouvrir un droit de publication et choisir la cadence d'un banc engagent la façon de travailler du parc, pas un réglage. Fichier à lire d'abord : `todo/TODO.md`, entrées TF-1089 et TF-1091 | les options par défaut (c) et (a) s'appliquent : la prochaine divergence se règlera à la main, et le banc restera lent |
| **A-47** | Publier les enregistrements `d75d76e`, `d6a642a`, `11fe59b` et `e07f252` du socle depuis un poste autorisé | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `acces` — tentative jouée à 12:50 : `git -C /home/user/digit-ai-forge-agents push origin main` rend `access denied by the git proxy: iguane39/digit-ai-forge-agents is not in this session's authorized repository set`, erreur HTTP 403 ; l'API GitHub de la session est bornée au même ensemble, seule autre voie existante | quatre enregistrements du socle, dont la fusion des deux lignées, ne vivent que sur ce poste |
| **A-35** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des huit tours reste sur une branche latérale |
| **A-48** | Déclarer le site de scellement de forge-design à la table des empreintes | auto_ia | action `neuve`, **non exécutée** — motif : `hors_mandat`, il est arrivé par la mise à jour du parc et sort de D-14 (a) comme de D-15 (a). Commande de vérification : `node oracles/oracle-empreintes.mjs` | la recette du pilot garde un quinzième oracle en défaut, et un site de scellement reste invisible au registre |
| **A-49** | Ramener la durée du banc du socle en gardant les six largeurs en recette complète | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-17 (option (b)) | le banc reste à environ cinquante minutes, et finit par ne plus être joué au fil de l'écriture |
| **A-38** | Décider le sort des candidats TF-1075 à TF-1091 encore en attente | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | les constats restent en attente, et le compteur de récidives les ignore |
| **A-39** | Tenir la revue datée : familles outillées, constats produits par les règles neuves, retours humains par famille | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude du 14/09 n'est jamais confronté aux faits |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ces trois jours étant des items de forge.

## 9. Traces

- `digit-ai-forge-agents/.claude/skills/digit-ai-page-html/` en **1.25.0** — `scripts/self_test.py` (grille sur six largeurs), les deux fixtures corrigées, et la fusion des deux lignées ; enregistrements `11fe59b` et `e07f252`, **locaux, non publiés**.
- `references/EXTENSIONS-JUGEES.json` — source unique, deux rôles, chaque extension présente et absente motivée.
- `scripts/lib-extensions-jugees.mjs` et `scripts/lib-extensions-jugees.test.mjs` — le lecteur et sa recette, 11/11.
- `oracles/oracle-trace-mutation-mep.mjs` — règle TM0, la borne de recherche se déclare au verdict.
- `todo/TODO.jsonl`, `todo/TODO.md`, `todo/TODO.html`, `todo/RECIDIVES.md` — 309 actifs ; TF-1087, TF-1088 et TF-1089 clos avec leur descente, TF-1091 ouvert.
- Enregistrement `7a9150e` sur `claude/html-quality-new-formats-qhfgvj`, poussé ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Aucune page HTML de livraison n'a été produite dans ce tour** — les pages touchées sont des pages d'ESSAI du banc, dont l'objet est d'échouer d'un côté et de passer de l'autre ; la critique d'implémentation ne s'y applique pas, et les vingt-quatre pages de la bibliothèque restent sur le leur : **non jouée**, faute de mandat forge-design.
