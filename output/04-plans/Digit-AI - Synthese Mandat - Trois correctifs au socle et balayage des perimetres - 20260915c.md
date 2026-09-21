---
destinataire: humain
---

# Synthèse de mandat — le socle est corrigé sur ses trois défauts, et le balayage a trouvé la même classe chez lui (15/09/2026)

Vos deux mandats sont exécutés, et le banc du socle rend 278 cas sur 278. Le socle partagé porte désormais les trois correctifs que la bibliothèque avait éprouvés, chacun avec une paire de pages d'essai qui prouve le défaut d'un côté et sa disparition de l'autre ; son banc complet reste vert. Le balayage des contrôles a produit un résultat plus nuancé que je ne l'espérais : sur cent-dix-neuf points suspects, deux sont de vrais défauts de structure, mais aucun des deux n'a encore coûté quoi que ce soit sur ce parc — ils se paieront à la première famille de document nouvelle. En revanche, en ouvrant le socle pour le corriger, j'ai trouvé chez lui exactement le défaut que vous m'aviez fait chercher ailleurs : son propre banc d'essai ne regarde qu'une taille d'écran sur six, ce qui explique pourquoi la recette fautive a vécu si longtemps sans être vue. Ce qui est attendu de vous : une décision sur la correction de ce banc, et une sur ce qu'on fait des deux défauts non payés.

## 1. En-tête d'identification

- **quoi** — exécution des décisions humaines D-12 (a) et D-13 (a) du 15/09/2026 : porter au socle les trois correctifs éprouvés avec leurs fixtures, puis balayer les contrôles à la recherche d'un périmètre de mesure écrit en dur.
- **sur quoi** — le socle `digit-ai-page-html`, dans `digit-ai-forge-agents`, **sur mandat** ; et le pilot `digit-ai-factory` : ses 97 contrôles exécutables, son registre, ses vues.
- **quand** — 2026-09-15 de 16:26 à 17:05 CEST (UTC+02:00), durée ≈ 40 min, relevée à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrements `d6a642a` (socle, local) et `61c4792` (pilot, poussé) ; oracles exécutés : `self_test.py` du socle (278 cas), `render_page.py`, `check_markdown.py`, `oracle-todo.mjs`, `oracle-skills.mjs`, et la recette complète du pilot.

## 2. Verdict en une ligne

Le socle passe en **1.23.0** : trois passages de doctrine corrigés — la recette de sommaire collant de L25 (au-delà de trois chapitres, un sommaire visible en permanence), la forme de badge de son chapitre des composants, et le sens de l'égalisation de **V19** — chacun accompagné de sa preuve, et **quatre fixtures neuves en deux paires à double sens** : la paire du sommaire rend **1 constat contre 0** à 390 px, la paire de l'égalisation rend **1 contre 0** à 2560 px ; self-test du socle **278/278**, empreintes de règles inchangées — **41** règles et **27** familles. Le balayage a lu **97** contrôles, rendu **19** candidats bruts, et les a instruits un par un : **2 vrais défauts** — quatre listes divergentes de « ce qui est un livrable », et un commentaire qui promet plus large que son code — **2 périmètres bornés légitimement**, **6 seuils de règle** hors classe et **6 faux positifs** ; conséquence mesurée des deux défauts sur ce parc : **nulle à ce jour**, zéro `.pdf` et zéro `.pptx` sous `output/`, zéro dossier de mise en production dans les quatorze dépôts. Trouvé **hors** du périmètre balayé, en ouvrant le socle : son self-test rend la grille principale des fixtures à **1440 px** — la même classe, chez le fournisseur des règles, et sa fixture verte de V19 rend V18 à 2560 px. Registre : **5** constats décidés ou ouverts, `oracle-todo` PASS, **308** actifs. Recette du pilot : **14/107**, dont un transitoire dû à mon propre enregistrement du socle.

## 3. Décisions attendues de l'humain

Les deux arbitrages précédents sont exécutés et clos ; ceux-ci naissent de ce qu'ils ont trouvé. Le premier porte sur le banc d'essai du socle, le second sur deux défauts réels qui n'ont encore rien coûté.

> **D-14 — Faut-il corriger le banc d'essai du socle, qui ne joue sa grille principale qu'à une taille d'écran sur six ?**
>
> En ouvrant le socle pour appliquer vos trois correctifs, j'ai trouvé que sa grille principale de pages d'essai tourne à une seule largeur de fenêtre. Toute famille de défaut qui ne se manifeste qu'ailleurs n'a de page d'essai que si quelqu'un écrit expressément une fonction pour elle — et c'est précisément ce qui a laissé la recette de sommaire vivre sans preuve pendant toute son existence. Une de ses pages d'essai vertes est d'ailleurs fautive à une largeur où elle n'est jamais jouée.
>
> **Recommandation : (a).** Source consultée : `oracles/self-tests.mjs` du pilot, entrée `../scripts/verifier-rendu-instances.mjs` — le même défaut y a été corrigé aujourd'hui, et le passage au périmètre complet n'y a rendu **aucun** défaut neuf sur le parc, pour un coût qui est du temps de recette et rien d'autre.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Jouer la grille principale du socle sur toutes ses largeurs, et traiter ce qui rougit | complexité moyenne × durée moyenne ; le banc du socle devient six fois plus long, et des fixtures vertes peuvent rougir | exclut de garder un banc rapide au prix de verts qui ne valent que pour une fenêtre |
| **(b)** Ne corriger que la fixture verte de V19, qui est fautive à 2560 px | complexité simple × durée courte | exclut le reste du banc : les autres verts gardent le même angle mort, non mesuré |
| **(c)** Laisser le banc en l'état, le constat ouvert au registre | rien | exclut toute assurance sur les fixtures vertes du socle, dont les verts ne valent que pour 1440 px |

> **Si rien n'est décidé** : (c) s'applique — le constat reste au registre avec sa mesure, et les verts du banc du socle continuent de ne valoir que pour une fenêtre.

> **D-15 — Que fait-on de deux défauts réels dont la conséquence mesurée est nulle ?**
>
> Le balayage a trouvé deux vrais défauts de structure : quatre contrôles décident chacun dans leur coin quelles extensions de fichier sont jugées, et leurs listes ne coïncident pas ; et un contrôle annonce chercher partout puis borne sa recherche. Sur le parc d'aujourd'hui, ni l'un ni l'autre n'a le moindre effet : les fichiers qui échapperaient n'existent pas encore. Les corriger maintenant, c'est payer avant d'avoir mal ; attendre, c'est parier que personne ne produira la famille de document qui les réveille.
>
> **Recommandation : (a).** Source consultée : `todo/RECIDIVES.md`, relevé du 15/09 — 74 classes de défaut, 129 récidives. Dans ce parc, une classe laissée ouverte revient, et le coût de la corriger monte avec le nombre de contrôles qui l'ont recopiée entre-temps.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Poser une source unique pour les extensions jugées, et faire dire au contrôle borné qu'il l'est | complexité simple × durée courte ; quatre contrôles à faire lire au lieu d'énumérer | exclut d'attendre le premier livrable qui tombe dans le trou pour s'en apercevoir |
| **(b)** Attendre la première famille de livrable neuve, et corriger alors | rien maintenant | exclut la prévention : la famille neuve sera livrée avant qu'on sache qu'elle n'était pas jugée |
| **(c)** Laisser les deux constats au registre, sans échéance | rien | exclut toute correction : un candidat sans décision ne devient jamais un travail |

> **Si rien n'est décidé** : (c) s'applique — les deux constats restent au registre avec leur mesure, et le compteur de récidives les suivra.

## 4. Traité — avec sa preuve

- **Le socle porte les trois correctifs, et chacun est prouvé par une paire de pages d'essai à double sens.**
  - preuve : `python3 scripts/self_test.py` du socle rend **278/278 cas passés**, dont les six cas neufs : `l25-sommaire-static-sous-900.html · sommaire_perdu attendu ×1 obtenu ×1`, `l25-sommaire-bande-mobile.html · attendu ×0 obtenu ×0`, `v19-egalise-par-le-bas.html · v18_prose_etiree attendu ×1 obtenu ×1`, `v19-egalise-par-le-haut.html · attendu ×0 obtenu ×0`.
- **La recette de sommaire de L25 fournit désormais la bande que son commentaire promettait — contrôle rouge → vert joué sur pièce, et la classe nommée : un commentaire qui promet ce que son code ne fait pas.**
  - preuve : la fixture qui applique la recette d'avant rend `[BLOQUANT] Sommaire perdu au defilement` à 390 px ; celle qui applique la recette d'après rend `Verdict : PASS` à la même largeur. Même page, mêmes chapitres, une ligne de CSS d'écart. Constat **TF-1081** clos avec sa descente.
- **La forme de badge donnée en exemple par le socle est celle que sa propre règle refusait, et elle est remplacée — contrôle rouge → vert déjà au banc, et la classe nommée : une doctrine qui diverge de sa fixture verte.**
  - preuve : les deux fixtures du double sens existaient **déjà** et étaient **déjà** branchées — `v16-etats-pastel.html` (5 constats attendus) contre `v16-etats-pleins.html` (0). Le banc portait la réponse pendant que la doctrine portait le défaut. Coût mesuré sur le pilot : **108 → 0**. Constat **TF-1082** clos avec sa descente.
- **Le sens de l'égalisation des largeurs est écrit, et la paire qui le prouve n'existait pas.**
  - preuve : section neuve « V19 — l'égalisation se fait vers le CONTENEUR DE LECTURE, jamais vers la pleine largeur », adossée à deux fixtures neuves qui rendent `v18_prose_etiree=1` contre `0` à 2560 px. Constat **TF-1085** clos avec sa descente.
- **Une fixture verte du socle est fautive à une largeur où elle n'est jamais jouée, et c'est déclaré plutôt que tu.**
  - preuve : `v19-largeur-homogene.html`, la fixture verte d'origine de V19, rend `v18_prose_etiree=1` à 2560 px — elle est elle-même égalisée par le bas. Le banc ne portait donc aucune preuve du bon côté avant celle écrite aujourd'hui. Écrit dans le commentaire de la fixture neuve et au registre.
- **Le balayage a lu 97 contrôles et instruit ses 19 candidats un par un, avec la distinction qui manquait.**
  - preuve : sortie du balayage — « fichiers balayés : 97 · candidats bruts : 19 », répartis en `extensions-en-dur` ×8, `seuil-nomme` ×6, `profondeur-figee` ×3, `cibles-tronquees` ×2. Un périmètre de **mesure** — ce sur quoi le contrôle statue — n'est pas un périmètre d'**affichage**, qui n'est un défaut que si le compte total disparaît.
- **Deux vrais défauts trouvés, chacun avec sa conséquence mesurée et non supposée.**
  - preuve : quatre contrôles énumèrent « ce qui est un livrable » et divergent — `.pdf` jugé par un seul sur quatre (**TF-1087**) ; et `dossiersMep()` annonce « où qu'ils vivent » puis borne à quatre niveaux (**TF-1088**). Mesure du coût : `find` sur `output/` rend **233 `.md`, 49 `.json`, 23 `.jsonl`, 10 `.png`, 6 `.html`** — zéro `.pdf`, zéro `.pptx` ; et `find` sur les quatorze dépôts rend **zéro** fichier de dossier de mise en production. Les deux défauts sont structurels et non payés.
- **Huit candidats sont écartés, et le motif de chacun est écrit.**
  - preuve : deux périmètres bornés sont **déclarés et motivés** dans leur propre commentaire — `relever-heritage.mjs` (« cherché sur DEUX niveaux seulement… au-delà, on ne trouve plus l'artefact du produit mais une copie ») et `oracle-adoption-tests.mjs` (« un walk sans borne sur `C:\dev` ne revient pas ») ; six seuils nommés sont des **seuils de règle**, où la valeur *est* la règle, dont un seul recopie une source — `PLAFOND = 6144` contre « Noyau ≤ 6 Ko » du fichier de pilotage, recopie exacte et sans divergence.
- **Le défaut le plus lourd du tour vit hors du périmètre que le balayage couvrait — `scripts/self_test.py` du socle, et non un contrôle du pilot.**
  - preuve : `run_rendu()` de `scripts/self_test.py` du socle passe `--widths 1440` en dur ; les autres largeurs ne sont jouées que par des fonctions dédiées. C'est pourquoi la correction de L25 a dû créer sa propre fonction à 390 px plutôt que d'entrer dans la grille. Constat **TF-1089**, ouvert.
- **Quatre défauts de forme du socle sont déclarés comme antérieurs, et vérifiés comme tels.**
  - preuve : `check_markdown.py` rend FAIL sur `references/lisibilite.md` — M7 (un chapitre qui ouvre sur des données), M14 ×2 (de la plomberie interne en clair), M18 (un identifiant employé sans sa glose) et sur `SKILL.md` (M18). La **même mesure jouée sur la version extraite de l'enregistrement précédent** rend les mêmes constats : aucun n'est de ce tour. Constat **TF-1090**, ouvert.
- **La recette du pilot ne perd rien, et sa quatorzième entrée est expliquée plutôt que passée sous silence.**
  - preuve : `node oracles/self-tests.mjs` rend **14 oracles en défaut sur 107** contre 13 avant ce tour ; la comparaison des deux listes rend une seule entrée apparue, `oracle-skills.mjs (parc réel)`, dont le constat est « la copie installée DIVERGE de `digit-ai-forge-agents/.claude/skills/digit-ai-page-html` sur 9 fichier(s) » — c'est-à-dire **l'effet de mon propre enregistrement du socle**, et non une régression.
- **Registre tenu et travail publié.**
  - preuve : `oracle-todo` rend PASS, **308** actifs ; TF-1081, TF-1082 et TF-1085 décidés puis clos avec leur descente, TF-1087 à TF-1090 ouverts en candidats. Enregistrement `61c4792` poussé sur `claude/html-quality-new-formats-qhfgvj`.

## 5. Non traité — avec son motif

- **La synchronisation de la copie installée du socle** — motif : gate de gouvernance, le remède que l'oracle nomme lui-même est `node oracles/oracle-skills.mjs --appliquer`, étiqueté « décision humaine ». La divergence est par ailleurs transitoire : le hook d'ouverture de session resynchronise, comme il l'a fait ce matin après l'enregistrement d'hier.
- **Les deux défauts du balayage** — motif : dépendance à un arbitrage, leur correction est l'objet de la décision D-15, et aucun des deux n'a de conséquence mesurée à ce jour.
- **Le banc d'essai du socle** — motif : dépendance à un arbitrage, sa correction est l'objet de la décision D-14 et peut faire rougir des fixtures vertes, ce qui engage un tour entier.
- **Les quatre défauts de forme du socle** — motif : hors mandat, D-12 (a) portait sur trois correctifs nommés ; les corriger au passage aurait élargi un mandat que vous aviez borné.
- **Le socle n'est toujours pas publié** — motif : accès, éprouvé à l'instant — `git -C /home/user/digit-ai-forge-agents push origin main` rend `access denied by the git proxy: iguane39/digit-ai-forge-agents is not in this session's authorized repository set`, erreur HTTP 403 ; l'API GitHub de cette session est bornée au même ensemble, seule autre voie existante.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 12a » — mandat pour les trois correctifs, avec leurs fixtures | Fait — trois passages de doctrine corrigés, quatre fixtures neuves en deux paires, self-test du socle 278/278 | Conforme à la lettre. **Une des trois paires existait déjà** : pour le badge, le banc portait la réponse et la doctrine portait le défaut ; je n'ai donc pas écrit de fixture de plus, je l'ai citée |
| « 13a » — balayer les 107 contrôles et déclarer chaque périmètre trouvé en dur | Fait sur **97** fichiers exécutables, hors fichiers de test | **Restriction assumée et chiffrée** : les 107 entrées de la recette comptent des fichiers de test, qui sont des contrôles de contrôle et n'ont pas de périmètre de mesure propre. Les 97 balayés sont les exécutables du pilot |
| (non dit) | J'ai déclaré 4 défauts de forme du socle sans les corriger | **Périmètre tenu**, au prix d'un socle qui reste en défaut sur son propre oracle de forme. Les corriger aurait élargi un mandat borné à trois correctifs |
| (non dit) | J'ai ouvert un constat sur le banc du socle, trouvé hors du périmètre balayé | Le balayage portait sur le pilot ; le défaut le plus lourd était chez le fournisseur, et le taire pour rester dans le périmètre aurait été un choix de confort |

## 7. Risques

- **Le socle corrigé ne quitte jamais ce poste, et les correctifs meurent avec la session.**
  - signal : une prochaine ouverture relève toujours « en avance de N commits (travail local non poussé) » sur le dépôt du socle.
  - parade : deux enregistrements y attendent désormais, `d75d76e` et `d6a642a` ; l'action qui les publie porte sa trace d'échec mesurée, et elle est en tête des actions humaines.
- **Le banc du socle garde son angle mort, et une correction future rend vert ce qui ne l'est pas.**
  - signal : une règle neuve du socle naît avec une fixture verte à 1440 px et se révèle fautive sur un livrable réel.
  - parade : c'est l'objet de la décision D-14, et le constat porte déjà sa preuve — une fixture verte existante qui rougit à 2560 px.
- **Les deux défauts non payés sont refermés parce qu'ils ne coûtent rien aujourd'hui.**
  - signal : quelqu'un lit « conséquence nulle » et conclut que le sujet est réglé.
  - parade : la mesure est écrite dans les deux constats — ce n'est pas « pas de défaut », c'est « défaut non encore payé », et la distinction est dans le texte du registre.
- **La copie installée du socle reste désynchronisée et le poste juge avec l'ancienne doctrine.**
  - signal : un prochain relevé d'ouverture ne montre aucune montée de version du socle installé.
  - parade : aucune règle n'a changé — 41 règles et 27 familles, empreintes identiques — donc aucun verdict ne dépend de cette synchronisation ; seule la doctrine lue par un humain diffère.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-41** | Répondre `D-14` et `D-15` par leur lettre — par exemple « D-14 a, D-15 a » | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, corriger le banc du socle peut faire rougir des fixtures vertes et engage un tour entier, et corriger un défaut non payé est un arbitrage de priorité. Fichier à lire d'abord : `todo/TODO.md`, entrées TF-1087, TF-1088 et TF-1089 | les options par défaut (c) et (c) s'appliquent : le banc du socle garde son angle mort, et les deux défauts attendent la famille de livrable qui les réveillera |
| **A-42** | Publier les enregistrements `d75d76e` et `d6a642a` du socle depuis un poste autorisé | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `acces` — tentative jouée à 17:00 : `git -C /home/user/digit-ai-forge-agents push origin main` rend `access denied by the git proxy: iguane39/digit-ai-forge-agents is not in this session's authorized repository set`, erreur HTTP 403 ; l'API GitHub de la session est bornée au même ensemble, seule autre voie existante | les trois règles du 14/09 et les trois correctifs du 15/09 ne vivent que sur ce poste |
| **A-43** | Synchroniser la copie installée du socle sur sa source | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, le remède est étiqueté « décision humaine (TF-0391) » par l'oracle qui le nomme. Commande : `node oracles/oracle-skills.mjs --appliquer` | l'oracle des skills reste en défaut jusqu'à la prochaine ouverture de session, qui resynchronise |
| **A-35** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des sept tours reste sur une branche latérale |
| **A-44** | Corriger le banc du socle pour qu'il joue sa grille sur toutes ses largeurs | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-14 (option (a)) | les fixtures vertes du socle continuent de ne valoir que pour une fenêtre sur six |
| **A-45** | Poser une source unique pour les extensions jugées, et faire dire au contrôle borné qu'il l'est | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-15 (option (a)) | quatre contrôles continuent de diverger sur ce qu'ils jugent, sans qu'aucune source ne tranche |
| **A-38** | Décider le sort des candidats TF-1075 à TF-1090 encore en attente | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | les constats restent en attente, et le compteur de récidives les ignore |
| **A-39** | Tenir la revue datée : familles outillées, constats produits par les règles neuves, retours humains par famille | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude du 14/09 n'est jamais confronté aux faits |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ces deux jours étant des items de forge.

## 9. Traces

- `digit-ai-forge-agents/.claude/skills/digit-ai-page-html/` en **1.23.0** — `references/lisibilite.md` § L25, `references/composants.md` § 2, `references/zero-defaut-visuel.md` § V19, `scripts/self_test.py` et quatre fixtures neuves ; enregistrement `d6a642a`, **local, non publié**.
- `scripts/verifier-rendu-instances.mjs` du pilot — le périmètre se lit dans le socle, corrigé au tour précédent et joué ici.
- `todo/TODO.jsonl`, `todo/TODO.md`, `todo/TODO.html`, `todo/RECIDIVES.md` — 308 actifs ; TF-1081, TF-1082 et TF-1085 clos avec leur descente, TF-1087 à TF-1090 ouverts.
- `output/04-plans/Digit-AI - Synthese Mandat - Cinq familles de cadence et le controle aveugle - 20260915a.md` et `… - Verification des deux arbitrages deja executes - 20260915b.md` — les deux synthèses précédentes du jour.
- Enregistrement `61c4792` sur `claude/html-quality-new-formats-qhfgvj`, poussé ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Aucune page HTML de livraison n'a été produite dans ce tour** — les quatre fixtures écrites sont des pages d'ESSAI, dont l'objet est d'échouer d'un côté et de passer de l'autre ; la critique d'implémentation ne s'y applique pas, et les vingt-quatre pages du tour précédent restent sur le leur : **non jouée**, faute de mandat forge-design.
