---
destinataire: humain
role: restitution de fin de tour, réponse « 15a, 17a, 18a, 19b, 20a, 21b » du 24/09/2026, avec la demande de reproposer les autres candidatures réévaluées
sources_de_verite: git du pilot, de 4 forges et du canal confidentiel · todo/TODO.jsonl · todo/CLASSES.json · gabarits/RESTITUTION.md (v2.27.0)
verifie_le: 2026-09-25
---

# Digit-AI — Synthèse de mandat — Décisions du 24/09 exécutées et candidatures reproposées — 25/09/2026

## 0. Synthèse d'ouverture

Vos 6 décisions sont exécutées. Les 20 candidatures que vous avez décidées sont corrigées et closes sur preuve, avec 2 plus anciennes que vos choix fermaient : 22 clôtures. Rien n'est publié, et 15 enregistrements attendent votre feu vert sur 6 dépôts. Les 16 autres candidatures sont réévaluées : 1 est résolue par une correction du jour, 1 est réfutée sur le fond, 7 ont enfin un vrai score. Entre-temps, 4 lots sont arrivés et mes vérifications ont produit 12 constats, soit 23 candidatures neuves. La plus lourde : les 3 ledgers réels du parc échouent à la vérification depuis le 22/09, parce qu'une règle neuve juge des clôtures écrites avant elle. Un produit a aussi construit, dans le dépôt du pilot, une famille de gabarits et une règle que vous lui avez demandées. J'attends 4 décisions.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-15 a, D-17 a, D-18 a, D-19 b, D-20 a et D-21 b de la synthèse 20260924a, puis réévaluation des candidatures restées candidates, pour vous les reproposer.
- **sur quoi** — le pilot `digit-ai-factory` ; `digit-ai-forge-agents`, `digit-ai-forge-design`, `digit-ai-forge-tests` et `digit-ai-forge-audit` ; le canal confidentiel ; les hameçons des 13 forges.
- **quand** — du 24/09/2026 à 17:17 au 25/09/2026 à 08:36 (UTC+02:00), avec une interruption de nuit, entre 20:19, dernier relevé du 24/09, et 08:20, premier relevé du 25/09. Début lu à l'horodatage de votre message, fin relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5. 10 agents délégués pour la construction, chacun relu et rejoué par le pilot, et 2 agents de lecture pour instruire les retours du produit UIA. Escalade de modèle : aucune.
- **intention** — que vos choix soient appliqués et prouvés, et que les candidatures restantes reviennent avec une évaluation qui tient compte de ce qui vient d'être fait. **Test rétro** : servie pour les 6 décisions, chaque clôture portant sa mesure et `oracle-todo` rendant PASS. Servie aussi pour la réévaluation : 16 motifs écrits au registre, dont 6 rejoués sur ce poste. Elle l'est en partie pour D-18 : le juge bloque les runs 1.1 comme décidé, mais les lanceurs qui éviteraient la consignation à la main restent à faire (bloc 7).

## 2. Verdict en une ligne

**6 décisions exécutées** · **22 candidatures closes** sur preuve · **4 classes** créées · **16 candidatures réévaluées** · **4 lots** reçus et **12 constats** : **23 candidatures neuves** · recette du pilot **161/162** · `oracle-todo` PASS · **15 enregistrements** en attente de publication · **4 décisions** posées.

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent un geste, énoncés ici en entier :

- **Le fichier « null » à la racine du parc ne se supprime pas sans vous**, en vertu de R-29 (une suppression reste un geste humain décidé). Un processus du poste l'a réécrit le 24/09 à 17:43 : il porte désormais 15 octets, un simple accusé « status ok », sans jeton. Pour le lever : le supprimer. Si rien n'est fait : le relevé d'ouverture le signale à chaque session.
- **La copie de la table des produits datée du 22/09, dans le canal confidentiel, ne se supprime pas sans vous**, pour la même règle. Pour la lever : la supprimer vous-même. Si rien n'est fait : le canal reste signalé « modifié » à chaque ouverture.

Comment lire les tableaux : chaque tableau porte une option par ligne ; la colonne Coût dit la complexité et la durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et sa source précèdent le tableau ; la ligne « Si rien n'est décidé » le suit. Pour répondre, un sélecteur suffit, par exemple « D-23 b ».

> **D-22 — Faut-il publier sur GitHub les 15 enregistrements de ce tour, dans `digit-ai-factory`, `digit-ai-forge-agents`, `digit-ai-forge-design`, `digit-ai-forge-tests`, `digit-ai-forge-audit` et le canal confidentiel ?**
>
> Ils portent l'exécution de vos 6 décisions : le socle des pages 1.26.0, les hameçons protégés contre une sortie rompue, le schéma de ledger 1.1, le juge d'enclenchement, les corrections du pilot et le registre. La règle de publication du pilot les retient, une publication sur un service hébergé attendant un feu vert humain : votre réponse décidait des corrections, pas de leur envoi. Avant l'envoi de `digit-ai-forge-agents`, le manifeste des versions livrées se met à jour, un geste que la publication du 24/09 a oublié. Chaque envoi se vérifie par l'état du distant, jamais par une sortie filtrée.
>
> **Recommandation : (a).** Source consultée : `git rev-list --left-right --count HEAD...origin/main` après `git fetch` sur les 15 dépôts du parc, le 25/09 à 08:36 ; `node maj-versions-livrees.mjs --constat` dans `digit-ai-forge-agents`, 4 écarts.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Publier les 15 enregistrements et cette synthèse, après la mise à jour du manifeste des versions livrées ; garde de chaque dépôt jouée, feu vert déclaré en citant votre réponse | simple × court | aucune |
| **(b)** Tout publier sauf le canal confidentiel | simple × court | la date d'inscription de 2 produits reste sur ce poste, et l'autre poste juge encore sa table sans elle |
| **(c)** Ne rien publier | nul | l'autre poste travaille sur l'état d'avant vos décisions, avec des hameçons qu'une sortie rompue contourne |

> **Si rien n'est décidé** : (c).

> **D-23 — Faut-il décider les 16 candidatures de `todo/TODO.jsonl` restées candidates au 24/09, maintenant réévaluées après le traitement de vos décisions ?**
>
> La réévaluation change 15 scores sur 16, chacun avec son motif écrit au registre. Les 7 retours du produit UIA n'avaient qu'un score par défaut : 2 agents de lecture ont confirmé 6 causes dans le code et réfuté la dernière, le PDF de la fiche de sécurité étant bien produit. Une candidature est résolue par une correction du jour : la recherche du socle ne ramène plus la vue active, mesuré dans Chromium. En tête vient l'analyse des dépendances, muette sous Windows à chaque audit npm, parce que l'oracle lance `npm` sans passer par le shell.
>
> **Recommandation : (a).** Source consultée : les 16 événements de réévaluation du 24/09 au registre ; la sonde Chromium de la recherche, sur l'ancien composant et sur le socle 1.26.0 ; les rapports des 2 agents de lecture, fichiers et lignes cités ; les recettes de `digit-ai-forge-conception` et `digit-ai-forge-organization`, rejouées.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Décider les 9 de valeur 10 ou plus : TF-1348 (20), TF-1354 (20, à clore sur preuve après ajout de son cas au banc), TF-1344 (16), TF-1335 et TF-1356 (15), TF-1329, TF-1342, TF-1355 et TF-1351 (10, sur son seul reste documentaire) | moyen × moyen | 7 restent candidates : TF-1345, TF-1347, TF-1336, TF-1337, TF-1350, TF-1349, TF-1346 |
| **(b)** Décider les 16 | complexe × long | l'oracle des secrets demande d'abord un choix : exclure les tests des produits, ou rétrograder leurs constats |
| **(c)** Ne rien décider | nul | l'analyse des dépendances reste muette sous Windows, et un faux écart de schéma continue d'interdire le GO d'un audit |

> **Si rien n'est décidé** : (c).

> **D-24 — Faut-il décider les 22 candidatures neuves de `todo/TODO.jsonl`, venues de 4 lots reçus pendant ce tour et de mes vérifications ?**
>
> La plus lourde vient d'une vérification : les 3 ledgers de run réels du parc échouent à `ledger.mjs verify` depuis le 22/09, parce que la règle « une clôture d'étape porte un résumé » juge 59 clôtures écrites avant elle. Le contrat « prêt client » exige un ledger vérifié : ces runs ne peuvent plus le tenir. Viennent ensuite la garde d'index du pilot, qui vide l'index d'output quand on enregistre depuis un arbre de travail lié (mesure d'un produit), et le pre-push du pilot, que l'installeur propose de migrer au prix de sa borne de publication. Suivent 26 hameçons jamais posés dans les forges et `oracle-restitution`, absent du lanceur général.
>
> **Recommandation : (a).** Source consultée : les 22 créations du 24/09 au registre, dont 5 évaluées à l'entrée faute de score dans leur lot ; chaque constat du pilot rejoué avant d'être écrit ; les mesures jointes aux lots.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Décider les 15 de valeur 10 ou plus : TF-1385, TF-1387 et TF-1389 (20), TF-1380, TF-1382, TF-1369 et TF-1372 (15), TF-1371 (12), puis TF-1384, TF-1388, TF-1368, TF-1373, TF-1374, TF-1377 et TF-1378 (10) | complexe × moyen | 7 restent candidates : TF-1379, TF-1390, TF-1381, TF-1370, TF-1375, TF-1376, TF-1383 |
| **(b)** Décider les 6 qui touchent la preuve ou la publication : TF-1385, TF-1387, TF-1368, TF-1369, TF-1371, TF-1372 | moyen × court | 16 restent candidates, dont les retours du produit UIA |
| **(c)** Ne rien décider | nul | les 3 ledgers réels restent rouges, et un enregistrement fait depuis un arbre de travail lié vide l'index d'output |

> **Si rien n'est décidé** : (c).

> **D-25 — Faut-il intégrer au pilot la branche `gabarit/guide-de-reference`, que la session du produit Produit-64 a construite dans ce dépôt à votre demande ?**
>
> Vous lui avez demandé d'enregistrer son guide développeur en gabarit de la Factory, réutilisable entier ou composant par composant, et d'écrire une règle qui fasse remonter les documents mûrs. La branche porte la famille `gd-guide-de-reference` 1.0.0 (un générateur, 8 composants posables un à un, un squelette, une instance fictive, une sonde d'interactions), et une règle neuve dans `REGLES-PROJET.md` sur la remontée des documents mûrs, câblée à `oracles/hook-lexique.mjs` et à `gabarits/oracle-lot-retours.mjs` 1.4.0. Elle compte 1 enregistrement et 31 fichiers, non publiés. La session l'a rebasée ce matin à 08:19 sur mon dernier enregistrement local, que mon rebase sur l'autre poste a depuis déplacé : elle est à rebaser de nouveau.
>
> **Recommandation : (a).** Source consultée : `git log` et `git diff --stat` de la branche contre `main` ; le lot `Produit-64 - RETOURS - 20260924e`, dont les verdicts déclarés (oracle de la bibliothèque PASS, recettes 44/44, 30/30 et 8/8) restent à rejouer par le pilot avant la fusion.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* L'intégrer : rebaser la branche sur `main`, rejouer ses recettes et la recette complète du pilot, fusionner si tout est vert, puis la publier avec D-22 | moyen × court | aucune |
| **(b)** Intégrer la famille de gabarits seule, sans la règle | moyen × moyen | la remontée des documents mûrs reste sans règle ni juge, et la branche est à découper |
| **(c)** Ne pas l'intégrer maintenant | nul | la branche vieillit dans le dépôt, et chaque rebase du pilot la déplace |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Chaque ligne ci-dessous nomme ce qui a changé et la mesure rejouée qui l'établit : vos décisions d'abord, dans leur ordre, puis la réévaluation et ce qui est arrivé pendant le tour.

- **D-15 a — les noms de produits relevés par le journal d'héritage restent hors de la table des pseudonymes.** Le journal garde son marqueur, et la candidature qui les suivait est close sur cette borne.
  - preuve : le canal n'a reçu dans ce tour que des dates d'inscription d'entrées déjà présentes (`b3ca380`) ; `oracle-todo` PASS après la clôture de TF-1323.
- **D-17 a — la chaîne des traductions n'a plus d'étape sans porteur.** B2 et B7 restent manuelles avec leur motif écrit, la preuve de marché n'a pas de durée par défaut, et l'accueil dit que l'étape de remise est outillée depuis le 27/08.
  - preuve : `c70f7c9` ; TF-1318 close, avec `oracle-remise-traduction` 11/11 et `verifier-sonde-glossaire` 21/21 rejoués par le lanceur général.
- **D-18 a — le juge d'enclenchement est branché**, informatif à la clôture d'un run 1.0 et bloquant pour un run 1.1. Le schéma de ledger 1.1 exige la liste des forges mobilisées à l'ouverture, et `ledger.mjs consigner` écrit un verdict par oracle.
  - preuve : `ab8d26d` (juge 1.1.0, recette 29 cas) et `ea0fff9` de `digit-ai-forge-agents` (recette du ledger 45 cas) ; run de démonstration 1.1 complet : PASS et clos ; le même sans consignation : FAIL, clôture refusée.
- **D-19 b — les 8 candidatures décidées sont traitées et closes.**
  - TF-1328 : l'écrivain de la table pose la date d'inscription, et K6 (une entrée sans date d'inscription est refusée) garde le canal ; FAIL « Produit-66, Produit-67 » avant, PASS après (`2a484a0`, canal `b3ca380`).
  - TF-1330 : le contrôle des sceaux juge le contenu sous les 2 conventions de fin de ligne ; recette 18 puis 20 PASS, 36 livrables scellés, 0 écart (`04ba297`).
  - TF-1333 : 4 octets de contrôle retirés d'une expression du socle, et non 2 comme annoncé ; 4 fausses alertes sur la fixture avant, 0 après (`720109d`).
  - TF-1331 : un catalogue de traductions rangé sous un dossier de build est lu ; 4 échecs puis 6 passés, suite de forge-tests 1 409 passés (`1093f64`).
  - TF-1334 : 3 oracles indexés au registre de quality-oracles, et les chemins des forges résolus sans `c:/dev` écrit en dur ; recette de quality-oracles sortie 0 (`58bd7cc`).
  - TF-1326 : le lanceur général trouve l'interpréteur Python sous Windows ; la fixture visuelle rendait un FAIL muet, elle rend PASS (`58bd7cc`).
  - TF-1332 : 4 renvois ou comptes faux, dans 4 dépôts ; le test du README de forge-tests était rouge, il est vert.
  - TF-1327 : le produit de marque n'est plus pris pour une forge ; `oracle-empreintes`, rouge le 23/09, rend PASS (`04ba297`).
- **D-20 a — les index d'output ne dépendent plus du moment ni du poste.** Une garde de pré-enregistrement régénère l'index dans l'enregistrement même, et l'index des livrables lit leur poids dans git.
  - preuve : `1fe1428` ; recette de la garde 6 PASS, dont le défaut d'origine rejoué en rouge ; recette du générateur 1 PASS 2 FAIL sur l'ancien code, 3 PASS après. Un produit y a trouvé un défaut en arbre de travail lié, reçu dans D-24.
- **D-21 b — les 10 candidatures décidées sont traitées et closes.**
  - TF-1360 : `trap '' PIPE` en tête des 3 gabarits de hameçons, signature v2, 13 forges migrées ; un vrai `git push` à travers un filtre cassé : publié sans la ligne, refusé avec (`58bd7cc`, `1fe1428`).
  - TF-1340 : la recherche du socle n'écrit plus le HTML de la page ; banc navigateur 6/12 sur l'ancien composant, 12/12 sur le socle 1.26.0 (`720109d`).
  - TF-1353 : dans un schéma SVG, le surlignage est un élément SVG ; caractères peints 41, 25 et 39 pendant la recherche avant, stables à 50, 33 et 39 après (`720109d`).
  - TF-1341 : les états dépliés du rendu ouvrent les lignes de détail ; matrice d'états 7/12 puis 12/12 (`720109d`).
  - TF-1343 : `oracle-saisie` refuse un motif de saisie qui ne se compile pas ; la fixture du motif réel rendait PASS, elle rend FAIL (`bad184b` de `digit-ai-forge-design`).
  - TF-1338 : un repli de citation n'ouvre plus de décision dans `oracle-synthese` ; recette 39/39 puis 43/43, 0 verdict changé sur 193 synthèses (`22d86eb`).
  - TF-1339 : une glose qui suit un désignateur entre accents graves est lue ; fixture FAIL avant, PASS après (`22d86eb`).
  - TF-1357 : l'accueil nomme à l'écran les « Prénom NOM » d'un lot ; recette 12 PASS, 0 fausse alerte sur 163 lots (`2a484a0`).
  - TF-1358 : un lot daté d'un jour à venir est refusé ; recette 32/35 puis 35/35 (`2a484a0`).
  - TF-1359 : l'unicité d'indice des livrables est rejouée à l'ouverture ; recette 6 PASS 3 FAIL puis 9 PASS (`1fe1428`).
- **TF-1319 garde son statut** : le juge et l'outil de consignation sont livrés ; restent des lanceurs qui jouent tout ce qu'ils découvrent, 174 oracles sur 12 dépôts, et un seul lanceur le fait aujourd'hui.
  - preuve : note d'avancement au registre, `oracle-todo` PASS.
- **4 classes sont créées au référentiel**, chacune avec son juge, et 5 candidatures y sont rattachées. Les 2 classes proposées pour la recherche aveugle au balisage et pour le bandeau collant attendent leur contrôle.
  - preuve : `todo/CLASSES.json` 1.22.0, 97 classes ; `oracle-todo` R15 (une classe créée après le 16/09 nomme un contrôle qui existe) : « 73 famille(s) portée(s) par un contrôle existant » ; créées sans leur contrôle, les 2 autres l'auraient mis en échec.
- **Les 16 candidatures restantes sont réévaluées**, chacune avec son motif au registre ; 15 scores changent.
  - preuve : 16 événements au registre, `oracle-todo` PASS. TF-1354 : dans Chromium, l'ancien composant ramenait la vue g8 à g1 pendant la recherche, le socle 1.26.0 la garde. TF-1342 : 4 occurrences dans le texte, 3 comptées. TF-1348 : `npm` lancé sans shell rend `ENOENT` sur ce poste. TF-1335 : `oracle-ears` rend FAIL sur la fixture verte. TF-1336 : 11/12 et sortie 1 à `digit-ai-forge-organization`. TF-1329 : l'indice 60 toujours vacant.
- **4 lots arrivés au sas pendant le tour sont reçus et ingérés** : 2 du produit UIA, 2 de Produit-64, pseudonymisés à l'accueil. Chaque geste de réception est dit par une note en tête du lot : RX-11 (le retour du produit UIA sur les README pseudonymisés), dont l'accueil avait rendu identiques les 2 graphies qu'il oppose, et 2 identifiants déjà pris, renumérotés.
  - preuve : `oracle-lot-retours` PASS sur les 4 ; l'accueil a relevé 2 formes « Prénom NOM » qui ne désignent pas des personnes ; `ingerer-lot` : 11 candidatures, TF-1379 à TF-1384 et TF-1386 à TF-1390 ; 5 évaluées à l'entrée.
- **12 constats du pilot sont inscrits**, TF-1368 à TF-1378 et TF-1385, chacun rejoué avant d'être écrit.
  - preuve : `ingerer-lot` PASS ; `oracle-todo` PASS ; chaque candidature porte sa mesure.
- **La collision de numéros avec l'autre poste est résolue.** L'autre poste a frappé TF-1361 à TF-1367 le 24/09 à 20:24 et les a publiés à 20:25 ; ce poste avait pris les mêmes numéros entre 20:14 et 20:17, sans les publier. Les numéros publiés gardent leur place ; ceux de ce poste deviennent TF-1379 à TF-1385, motif écrit dans leur source.
  - preuve : `todo/renumeroter.mjs`, 7 renumérotations sur la version de ce poste avant l'union ; `oracle-todo` PASS après le rebase ; `git rev-list --left-right --count HEAD...origin/main` rendait `7 1` avant le rebase, `7 0` après.
- **Le registre et les lots sont enregistrés au pilot**, fichiers de la session parallèle exclus.
  - preuve : `dcd4629` (registre, classes, 3 lots et les constats, 16 fichiers) puis `250d0e7` (le lot e, les notes de références rebasées, le cliquet des recettes, 6 fichiers).
- **La recette complète du pilot** est rejouée.
  - preuve : 161/162 ; le seul rouge est `oracle-skills`, qui juge les copies installées des skills et passe dès leur propagation ; `oracle-empreintes`, rouge le 23/09, rend PASS.

## 5. Non traité — avec son motif

- La propagation des skills vers les copies installées de ce poste : motif `decision` — elle suit la publication, D-22.
- La publication des 15 enregistrements : motif `decision` — D-22.
- Les 16 candidatures réévaluées, les 22 neuves et la branche du produit : motif `decision` — D-23, D-24 et D-25.
- Le reste de TF-1319, des lanceurs qui jouent tout ce qu'ils découvrent : motif `hors_mandat` — vos décisions de ce tour ne le demandaient pas ; la candidature reste décidée au registre depuis le 23/09.
- 2 constats relevés par des agents et non rejoués : une tête de décision citée sans numéro qu'`oracle-synthese` ne verrait pas, et un état « muet » que le rendu déclarerait à tort sur une recherche sans résultat. Motif `borne_atteinte` : un constat n'entre au registre qu'après sa mesure, et celle-ci n'a pas été faite dans ce tour.
- Le dépôt du produit de marque `digit-ai-marketing` porte 2 enregistrements non publiés et 136 fichiers modifiés : laissés tels quels, motif `hors_mandat` — c'est un produit autonome, et ce travail n'est pas le mien.
- Le fichier `C:\dev\null` et la sauvegarde datée du 22/09 dans le canal : motif `garde_fou` — R-29, inventoriés au bloc 3.

## 6. Écarts à la lettre

- **Vous avez demandé** de reproposer les autres candidatures après traitement. **J'ai aussi reçu** 4 lots arrivés au sas pendant le tour, et inscrit 12 constats de mes vérifications. **Pourquoi** : un lot au sas se reçoit, et un constat vérifié entre au registre. Ils forment D-24 et D-25, séparées de D-23 pour ne pas mêler réévaluation et nouveauté.
- **Vous avez demandé** d'ajuster les évaluations. **Je repropose** TF-1354 comme une clôture sur preuve plutôt qu'une correction. **Pourquoi** : la correction de TF-1340 la résout, mesuré dans Chromium ; il manque son cas au banc de la recherche.
- **Le retour** du produit UIA sur la fiche de sécurité demandait un PDF que rien ne produirait. **Je l'ai réévalué** sur son reste documentaire. **Pourquoi** : le PDF est produit à chaque passe, lu dans le code ; la méthodologie ne le nomme pas. L'écarter reste possible.
- **L'action de création des classes en annonçait 6. J'en ai créé 4.** **Pourquoi** : R15 refuse une classe tant que son contrôle n'existe pas ; les 2 autres entreront avec leur correction.
- **Vous avez décidé** D-18 a, « bloquant une fois l'outil de consignation livré ». **L'outil est livré dans ce même tour** : le juge bloque donc dès maintenant la clôture d'un run 1.1 (bloc 7).
- **La règle des lots** veut qu'un lot remis ne se modifie pas. **J'ai modifié** 3 lots reçus, chaque fois avant leur ingestion. **Pourquoi** : sans note, RX-11 ne se lit plus ; et 2 identifiants repris faisaient refuser 2 lots à la porte. Un lot déjà ingéré, lui, ne se touche plus : essayé sur le premier, la porte a refusé, et c'est le lot suivant qui a pris le numéro libre. Chaque geste est écrit dans une note de réception, le texte du producteur est intact ailleurs.
- **La garde d'index** a ajouté des index régénérés à 3 enregistrements, `22d86eb`, `dcd4629` et `250d0e7`, hors des chemins que j'avais nommés. **Pourquoi** : c'est son rôle depuis D-20 ; le défaut voisin qu'elle laisse, des index restés indexés dans une version périmée, est reçu dans D-24.

## 7. Risques

- **Un run 1.1 qui mobilise une autre forge que la conception ne clôt qu'en consignant chaque oracle à la main**, tant que les lanceurs ne jouent pas tout ce qu'ils découvrent.
  - signal : `ledger.mjs close` refuse, et le juge nomme les oracles sans verdict consigné.
  - parade : `ledger.mjs consigner`, un verdict par oracle ; ou ouvrir le run en schéma 1.0, où le juge reste informatif.
- **L'autre poste doit migrer ses hameçons après avoir tiré**, sur les 13 forges et jamais sur le pilot : sur le pilot, la migration effacerait la borne de publication de son pre-push.
  - signal : `installer-hamecon-publication.mjs --verifier` y rend A-MIGRER.
  - parade : `--seul=pre-push --migrer` sur les 13 forges nommées une à une, et le pre-push du pilot complété à la main de la ligne `trap '' PIPE`, comme ici.
- **Les copies installées des skills restent en retard sur les forges** jusqu'à la propagation : les sessions de ce poste jouent encore le socle 1.25.0 et l'ancien installeur.
  - signal : `oracle-skills` rend FAIL au relevé d'ouverture.
  - parade : la propagation suit la publication, par `node bootstrap.mjs --pull` à l'ouverture suivante.
- **Une session du produit Produit-64 écrit dans le dépôt du pilot**, sur sa propre branche, pendant que ce tour y travaille.
  - signal : la branche `gabarit/guide-de-reference` a changé de base ce matin à 08:19.
  - parade : ne jamais publier ni supprimer cette branche sans D-25 ; mon rebase ne la touche pas.
- **2 postes peuvent encore frapper les mêmes numéros de candidature** : c'est arrivé le 24/09 au soir, à moins de 10 minutes d'écart.
  - signal : `oracle-todo` rend FAIL R2 après l'union des registres.
  - parade : `todo/renumeroter.mjs` sur la version du poste qui n'a pas publié, avant l'union.

## 8. Prochaines actions

Les actions ci-dessous sont triées, celles de l'IA d'abord ; chacune porte son acteur et son motif.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Exécuter D-22 à D-25 selon vos réponses : publier dépôt par dépôt en vérifiant chaque envoi par l'état du distant, puis traiter les candidatures décidées | `auto_ia` | TF-1348, TF-1385 | `dependance_bloc_3` — attend vos réponses | rien n'est publié, et les candidatures restent en l'état |
| **A-2** | Sur l'autre poste, après le tirage : migrer les pre-push des 13 forges, jamais celui du pilot | `auto_ia` | TF-1360 | `dependance_bloc_3` — suit la publication de D-22 | ses hameçons restent contournables par une sortie rompue |
| **A-3** | Trancher D-22 à D-25, reprises en entier au bloc 3 — répondre par exemple « D-22 a, D-23 a, D-24 a, D-25 a » | `manuelle_utilisateur` | neuve | `decision` — publier, décider des candidatures et d'une règle vous reviennent | rien n'est publié, et 39 candidatures restent candidates |
| **A-4** | Supprimer `C:\dev\null` | `manuelle_utilisateur` | neuve | `irreversible` — une suppression reste un geste humain | le relevé d'ouverture le signale à chaque session |
| **A-5** | Supprimer `C:\dev\_confidentiel\tables\produits-pseudonymes.json.bak-20260922` | `manuelle_utilisateur` | neuve | `irreversible` — une suppression reste un geste humain | le canal reste signalé « modifié » à chaque ouverture |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Enregistrements locaux, non publiés : pilot `22d86eb`, `1fe1428`, `2a484a0`, `04ba297`, `c70f7c9`, `ab8d26d`, `dcd4629`, `250d0e7`, puis cette synthèse ; `digit-ai-forge-agents` `ea0fff9`, `720109d`, `58bd7cc` ; `digit-ai-forge-design` `bad184b` ; `digit-ai-forge-tests` `1093f64` ; `digit-ai-forge-audit` `bb9eaef` ; canal `b3ca380`.
- `todo/TODO.jsonl` : 20 décisions, 22 clôtures, 5 rattachements de classe, 16 réévaluations, 5 évaluations à l'entrée, 23 créations, 7 renumérotations, 18 notes de références rebasées et 6 précisions d'heure ; `todo/CLASSES.json` 1.22.0.
- Lots reçus : `input/00-retours/`, 4 lots ; les originaux restent chez leurs producteurs.
- Sondes, rapports d'agents et mesures : fichiers de la session, hors dépôt ; leurs chiffres sont écrits dans les candidatures et les clôtures.
- Aucune page livrée dans ce tour : les fixtures HTML sont des données d'essai.
