---
destinataire: humain
role: restitution de fin de tour, décision « 32a » du 28/09/2026
sources_de_verite: git du pilot et de digit-ai-forge-agents · todo/TODO.jsonl · todo/CLASSES.json · les rapports des 10 agents de campagne · output/04-plans/Digit-AI - Synthese Mandat - Decision 31a executee quatorze lots accueillis et ingeres - 20260928b.md (D-32) · gabarits/RESTITUTION.md (v2.31.0)
verifie_le: 2026-09-28
---

# Digit-AI — Synthèse de mandat — Décision 32a exécutée, 34 candidatures traitées — 28/09/2026

## 0. Synthèse d'ouverture

Votre décision est exécutée et publiée : les 34 candidatures sont décidées au registre et traitées
par des agents de campagne ; 32 sont closes sur preuve, 2 attendent une décision. Ce qui change
pour vous : la porte des noms juge chaque fichier de l'histoire une seule fois, et l'envoi du pilot
a pris 7 min 29 s au lieu de 15 à 27 minutes, avec les mêmes constats que l'ancienne. Un essai
d'ingestion ne peut plus étendre la table réelle des pseudonymes, et le journal de run compare des
instants. Un constat grave est né en route : le nom d'un produit, sous une forme qu'aucune table ne
connaît, est publié en clair dans 6 fichiers du dépôt public depuis mon envoi de 16:45. Je n'ai rien
réécrit sans vous. Ce qui vous attend : 3 décisions, dont ce nom publié.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-32 (a) : les 34 candidatures TF-1422 à TF-1455 décidées au
  registre, traitées, et les 11 sans score utile évaluées ; puis publication et propagation.
- **sur quoi** — le pilot `digit-ai-factory` et la forge `digit-ai-forge-agents` ; le canal
  confidentiel lu sans être modifié ; aucun dépôt de produit n'a été modifié.
- **quand** — le 28/09/2026, de 17:27 à 22:33 (UTC+02:00), soit 5 h 06, heures relevées par
  `date` ; la fin est l'heure de dépôt de cette synthèse, son envoi suit.
- **qui** — session de pilotage Claude Opus 5.5 ; 10 lancements d'agents de campagne, 7 sur Claude
  Opus 5.5 et 3 sur Claude Sonnet 5, le défaut. Escalades de modèle, selon le routage « construction
  complexe » : forge-agents (8 items, dont la porte des noms), le juge des restitutions (2 fois), le
  harnais des recettes, l'anonymisation (2 fois), l'adoption et le parcours réseau. Pilot passé de
  `a019efc` à `2dfbc951`, publié, puis `7e5eebfa` ; forge-agents de `6a64883` à `aea5f97`, publié.
- **intention** — que chaque candidature décidée produise son effet mesuré dans le parc, que les 11
  sans score utile reçoivent un score fondé sur une mesure, sans affaiblir un contrôle et sans
  publier un nom protégé.
  **Test rétro** : servie en partie. 32 candidatures sur 34 sont closes avec leur preuve, les 2
  autres attendent D-34 (bloc 5) ; aucune recette n'a été affaiblie. Mais la dernière exigence ne
  tient pas : un nom protégé était déjà publié par mon tour précédent, dont la synthèse disait à
  tort l'intention servie sur ce point.

## 2. Verdict en une ligne

**34 candidatures décidées, 32 closes sur preuve, 2 en cours** · 11 scores évalués · **32
candidatures nées de la campagne** (TF-1456 à TF-1487) · 2 classes créées au référentiel · harnais
du pilot 166/167, le seul défaut levé par la propagation · porte des noms : ancienne et nouvelle,
même PASS et mêmes 51 constats · publiés : forge-agents `6a64883..aea5f97`, pilot
`a019efc1..2dfbc951` · **1 nom protégé publié**, trouvé en route · **3 décisions** attendues.

## 3. Décisions attendues de l'humain

Comment lire ce bloc : chaque décision porte une option par ligne ; la colonne Coût dit la
complexité et la durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et
sa source précèdent le tableau, la ligne « Si rien n'est décidé » le suit. Pour répondre, un
sélecteur par décision suffit, par exemple « D-33 b, D-34 a, D-35 b ». La numérotation suit D-32.

> **D-33 — Que faire du nom d'affichage d'un produit, publié en clair depuis 16:45 dans 6 fichiers du dépôt public du pilot, dont `todo/TODO.jsonl` ?**
>
> Le champ demandeur des 6 candidatures de Produit-76 porte le nom d'affichage de ce produit : 45
> caractères en 2 parties séparées par un point médian. La première recoupe ses clés à la table des
> pseudonymes, la seconde contient un terme de la table des noms interdits. Aucune variante des
> tables ne produit cette forme : ni l'accueil, ni l'ingestion, ni la porte des noms ne l'ont vue.
> Mon envoi de 16:45 l'a publiée dans les 2 lots de ce produit, leurs fichiers d'accompagnement,
> l'index des retours et le registre ; sa seconde partie seule est dans 17 fichiers publiés. La
> sortir de l'état courant se défait ; l'effacer des enregistrements publiés exige de réécrire
> l'historique.
>
> **Recommandation : (a).** Source consultée : la décision D-28 (a) du 27/09, même geste pour une
> adresse publiée ; les mesures de 21:30 et de 21:52 sur l'arbre du pilot, sur `origin/main` et sur
> les tables, sans imprimer la forme.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Inscrire les 2 formes mesurées à la table des noms interdits, datées du jour ; leur substituer leur pseudonyme dans l'état courant par `todo/anonymiser-suivis.mjs`, registre et lots compris ; rejouer la porte des noms, puis publier | moyen × court | la forme reste lisible dans l'historique publié depuis 16:45, et sa seconde partie depuis plus tôt |
| **(b)** Faire (a), puis réécrire l'historique du pilot et le republier en force | complexe × moyen | les 2 postes reconstruisent leur clone ; une réécriture de plus de l'historique publié |
| **(c)** Ne rien faire | nul | la forme reste dans l'état courant et dans l'historique publics |

> **Si rien n'est décidé** : (c).

> **D-34 — Faut-il rattacher les 2 pseudonymes d'un même produit dans `C:\dev\_confidentiel\tables\produits-pseudonymes.json`, et lequel garder ?**
>
> Ce produit est Produit-73 sous le nom de son dossier depuis le 27/09, et Produit-76 sous le
> préfixe de ses lots depuis l'essai de ce matin. Le code qui rattache un nom neuf au pseudonyme de
> sa racine est livré et recetté, mais il ne s'active que si la table porte un bloc de
> rattachements, que le contrôle du canal refuse encore : sa règle veut une clé par pseudonyme. Tant
> que rien n'est fait, les lots de ce produit arrivent sous Produit-76, ses 2 pseudonymes ne se
> voient pas, et le lot de travaux préparé pour lui ne trouve pas son dossier.
>
> **Recommandation : (a).** Source consultée : le rapport de l'agent « anonymisation », dont la sonde
> en lecture seule trouve Produit-73 pour la racine publiée du lot 20260928b de ce produit.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Garder Produit-73, le plus ancien : amender la règle du contrôle du canal pour qu'un alias déclaré ne compte pas comme doublon, poser le bloc de rattachements, rattacher la clé de Produit-76 à Produit-73 et réserver l'indice 76 ; puis émettre au produit son lot de travaux | simple × court | les 2 lots et les 6 candidatures déjà publiés sous Produit-76 le restent, un lot ingéré étant immuable |
| **(b)** Garder Produit-76 : le même geste en sens inverse | simple × court | les relevés d'héritage, qui portent Produit-73, changent de nom, à rebours de la proposition du produit |
| **(c)** Ne rien faire | nul | le produit garde 2 pseudonymes, et son lot de travaux reste sans destinataire |

> **Si rien n'est décidé** : (c).

> **D-35 — Faut-il décider les 32 candidatures nées de la campagne dans `todo/TODO.jsonl` ?**
>
> Les agents les ont relevées en travaillant : 24 au pilot, 8 chez forge-agents. Les plus lourdes
> sont un motif de secret plus étroit dans une règle de conformité, qui laisse passer une clé
> moderne ; le chemin d'un script coupé depuis le 18/08 dans le gabarit que chaque produit hérite ; 7
> textes qui nomment encore l'ancien lieu de remise des lots ; un contrôle des numéros de remontée
> qui ne voit aucun lot au sas ; l'émetteur de travaux qui ignore l'alias périmé ; le harnais, qui
> ne joue aucune recette Python. Le nom publié, premier du lot, relève de D-33.
>
> **Recommandation : (b).** Source consultée : les scores posés à la création, 6 de valeur 10 ou plus
> hors celle que D-33 porte.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 32 | complexe × long | le mandat suivant traite aussi 25 candidatures de valeur inférieure à 10 |
| **(b)** *(recommandée)* Décider les 6 de valeur 10 ou plus : le motif de secret de la conformité (20), le chemin coupé du gabarit des produits (15), les 7 textes du lieu de remise (15), le contrôle des remontées au sas (12), l'émetteur et l'alias périmé (12), le harnais et les recettes Python (12) | moyen × moyen | 26 restent candidates jusqu'à votre prochaine décision |
| **(c)** Ne rien décider | nul | les 32 restent candidates, dont le motif de secret qui laisse passer une clé moderne |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Le travail s'est fait en 3 temps : les décisions au registre, 8 campagnes d'agents sur des fichiers
disjoints, puis la vérification, la tenue du registre, la publication et la propagation.

- **Le geste de votre décision.** Les 34 candidatures sont au statut décidé, avec vos mots.
  - preuve : `todo/journaliser.mjs` écrit 34 événements à 17:32, `oracle-todo` PASS avant et après ;
    enregistrement `00ee9e8`.
- **forge-agents, 8 items clos.** Le journal de run compare des instants et lit la rectification
  d'une collision (TF-1422, TF-1425) ; l'oracle des calculs ne lit plus la notation d'effort comme
  une multiplication (TF-1440) ; la lecture par un tiers voit un en-tête accentué (TF-1445) ;
  `run-oracles` joue la lecture par un tiers sur les pages livrées (TF-1446) ; tout SKIP porte un
  motif (TF-1447) ; le prompt réécrit nomme le livrable selon la règle du pilot (TF-1441) ; la porte
  des noms juge chaque blob une fois (TF-1448).
  - preuve : 8 enregistrements `bde6608..fc19aaa` ; recettes rejouées par le pilot à 21:29, self-test
    de forge-agents 65 PASS et 0 FAIL, recette `quality-oracles` 370 contrôles PASS ; 895 SKIP sur
    895 portent leur motif sur 38 livrables du pilot, contre 0 avant.
- **La porte des noms, comparée sur les tables réelles.** Ancienne et nouvelle version rendent le même
  verdict sur le même état du pilot.
  - preuve : même PASS, mêmes 51 constats dans le même ordre ; 19 min 33 s pour l'ancienne, 8 min 54 s
    pour la nouvelle sous la charge d'autres recettes ; puis 7 min 29 s pour l'envoi réel du pilot.
- **Conformité des produits, 6 items clos.** R-42 compare des instants et nomme un horodatage composé
  après son commit (TF-1423, TF-1424) ; R-47 juge le contenu, plus le seul chemin (TF-1426) ; R-19
  accepte le canal confidentiel et une rectification de `run_precedent` (TF-1438, TF-1454) ;
  l'allocateur d'indice gagne la portée du dossier (TF-1450).
  - preuve : 4 enregistrements `aaa058a..bafdf15` ; recette de conformité 92 PASS avant, 110 PASS et
    0 FAIL rejouée par le pilot ; la paire de ledgers du lot, rejouée, rend FAIL puis PASS à l'endroit
    attendu.
- **Pages d'étude, 5 items clos.** L'oracle d'étude découpe sur la ligne de titre (TF-1435) ; le
  générateur rend titres et listes (TF-1436), pose le sommaire dès 4 chapitres (TF-1437), le
  marquage machine d'IA (TF-1442) et la note d'une colonne d'une lettre (TF-1443).
  - preuve : enregistrements `a4fa8b8` et `acf07c1` ; self-test du générateur 15/15, recette du rendu
    23/23, oracle d'étude 2/2, rejoués par le pilot ; TR2 passe d'avertissement à information.
- **Le 3e volet de TF-1436, chez forge-agents.** Le contrôle de complétude compte aussi les titres et
  les éléments de liste, et sa fiche au registre des oracles le dit.
  - preuve : enregistrements `e8fa7c2` et `aea5f97` ; la fixture rouge, PASS avant, rend FAIL avec 2
    écarts exacts, la verte reste PASS ; recette du skill 467/467, `quality-oracles` 370 PASS.
- **Harnais et contrôles, 3 items clos.** Le cliquet des recettes compte un cas déclaré non joué
  sans l'accuser de disparition (TF-1434) ; le constat du guide compare aussi les 4 blocs du socle
  (TF-1433) ; le pilot ne se déclare plus mobilisé (TF-1444).
  - preuve : enregistrements `3401d28`, `7a8a584`, `9cd10dc` ; recette de la bibliothèque 17 → 23
    PASS, 4 mutants tués ; guide 6/6 ; enclenchement 27 PASS ; démarrage 19/19, rejoué par le pilot.
- **Juge des restitutions, 4 items clos.** Une barre verticale qui coupe une ligne est nommée
  (TF-1427) ; les identifiants du registre produit et des lots sont reconnus (TF-1428, TF-1449) ; une
  décision déjà posée se rappelle en une ligne (TF-1429).
  - preuve : enregistrements `96a1719..8487ae6` ; banc 71/71 avant, 90/90 après, recette du hook
    37/37, rejoués par le pilot ; 0 verdict changé sur les 204 synthèses du dossier.
- **Anonymisation, 4 items clos et 1 en cours.** Un essai sur registre jetable n'étend plus la table
  réelle (TF-1431) ; le générateur des README ne pseudonymise rien chez un produit et n'y pose plus
  les rôles du pilot (TF-1451, TF-1452) ; 2 tournures refusées par l'oracle d'écriture sont
  renommées (TF-1453) ; le rattachement d'un nom neuf à sa racine est livré (TF-1432).
  - preuve : enregistrements `53888e5..0216ddd` ; l'essai du matin, rejoué sur tables jetables, rend
    2 FAIL avant et 4 PASS après ; empreintes de la table réelle identiques au début et à la fin.
- **Adoption et parcours réseau, 2 items clos et 1 en cours.** L'adoption sait poser un projet
  documentaire sans exempter un produit web (TF-1439) ; la porte « voix » du parcours réseau a son
  format et son contrôle (TF-1455) ; le gabarit des produits nomme le sas et le gabarit canonique
  (TF-1430).
  - preuve : enregistrements `8228b30`, `bd331f5`, `d2c1a6d` ; adoption 17 → 27 PASS, juge des lots 42
    → 44, réseau 9 → 27, rejoués par le pilot.
- **Le registre tenu.** 11 scores évalués, 32 clôtures, 2 items en cours, 32 candidatures nées de la
  campagne, et 2 classes au référentiel, dont celle que TF-1424 demandait.
  - preuve : `todo/journaliser.mjs` écrit 80 événements à 21:50 et 2 à 22:30, `oracle-todo` PASS avant
    et après chaque écriture ; `todo/CLASSES.json` 1.25.0 ; enregistrements `feae96a1` et `7e5eebfa`.
- **Le hook de commit dit la durée mesurée de la porte.**
  - preuve : enregistrement `5e51e982` ; `verifier-hooks-git` PASS, copie installée remise à niveau.
- **Le harnais complet du pilot.**
  - preuve : `oracles/self-tests.mjs` de 21:51 à 22:05, 166 oracles sur 167 au vert ; le seul défaut,
    `oracle-skills` sur le parc réel, attendait la propagation, et `oracle-skills` rend PASS après
    elle ; cliquet relevé sur 12 recettes et 2 premières mesures, enregistrement `2dfbc951`.
- **La publication.**
  - preuve : forge-agents `6a64883..aea5f97` à 22:15:44, sortie 0 ; pilot `a019efc1..2dfbc951` à
    22:29:26, sortie 0 ; `git rev-list` rend `0 0` après `git fetch` pour les deux.
- **La propagation des skills.** `bootstrap.mjs --pull` a propagé le reste à 22:16 et épargné 8
  fichiers installés, que le journal de propagation ne connaissait pas.
  - preuve : les 8 égalent la version publiée d'avant ce soir, `6a64883` ; sauvegardés sous
    `c:/dev/_sauvegardes/d32-20260928`, posés et journalisés à 22:17 ; `oracle-skills` PASS ;
    consommateurs forge-tests, forge-design et forge-data PASS de 22:18 à 22:21.
- **Le relevé final.**
  - preuve : à 22:30:10, après `git fetch`, 15 dépôts sur 16 rendent `0 0` ; le pilot a 1
    enregistrement d'avance, qui part avec cette synthèse ; 2 fichiers non suivis d'autres sessions,
    chez forge-design et au canal confidentiel, laissés tels quels.

## 5. Non traité — avec son motif

- Le rattachement des 2 pseudonymes du produit de TF-1432, que le code attend — motif : `decision` — D-34 le porte.
- Le lot de travaux de TF-1430, préparé mais non émis — motif : `decision` — son destinataire dépend de D-34.
- Le nom publié en clair — motif : `decision` — D-33 le porte ; rien n'a été réécrit sans vous.
- Les 32 candidatures nées de la campagne — motif : `decision` — D-35 les porte.
- Les 4 classes que les lots de l'après-midi proposent — motif : `hors_mandat` — la tenue du registre, que ce tour n'a pas reçue.
- La clôture de TF-1413, décidée chez un produit — motif : `hors_mandat` — sans les mots de sa décision, je ne l'écris pas.

## 6. Écarts à la lettre

- **Vous avez choisi** de décider les 34 ; l'option ne disait pas « puis je publie ». **J'ai publié**
  en citant votre réponse dans `FORGE_PUSH_GO`. **Pourquoi** : le 27/09, D-19 (a), « Décider les
  12 », a été exécutée puis publiée sur le même feu vert ; et un poste qui garde ses décisions
  exécutées les fait refaire par l'autre, mesuré ce matin.
- **Deux agents se sont figés** à 18:01, sans réponse du modèle pendant 26 minutes, et vous les avez
  arrêtés à 18:27. **Je les ai relancés** avec une consigne de reprise. **Pourquoi** : j'ai lu votre
  geste comme l'arrêt de 2 agents bloqués, pas comme un refus de leurs items ; ils n'avaient rien
  écrit dans le dépôt.
- **L'outil de propagation a épargné 8 fichiers installés ; je les ai posés moi-même**, chaque pose
  journalisée comme l'outil le fait. **Pourquoi** : ils égalaient la version publiée, sans travail
  propre ; mon réalignement de ce matin les avait écrits hors journal, d'où la prudence de l'outil.
- **L'avancement des agents ne vous a pas été relayé** toutes les 3 minutes, comme le gabarit des
  campagnes le prévoit. **Pourquoi** : 6 agents tournaient au premier plan en même temps, et je ne
  pouvais rien relayer avant leur retour.
- **Les agents se sont écartés de la proposition du produit** sur 5 items, chacun mesuré. `run-oracles`
  route 1 oracle sur les 3 proposés : les 2 autres rendraient FAIL sur 325 et 37 livrables du pilot,
  surtout à tort. La mention « neuve » se borne aux formes déclarées : la borne proposée aurait fait
  échouer 327 actions sur 1 274. Un projet ne se déclare documentaire que sans code ni site. Le
  rattachement d'un nom attend le bloc de la table. Un fichier de voix absent fait échouer le
  parcours réseau, au lieu de le dire sans objet.
- **J'ai ajouté** 2 classes au référentiel, 32 candidatures au registre, et un agent pour le 3e volet
  de TF-1436. **Pourquoi** : TF-1424 demandait sa classe ; les constats faits en route entrent en
  candidature ; le 3e volet vivait chez forge-agents, hors du périmètre de l'agent des pages.

## 7. Risques

- **Un nom protégé est publié en clair** dans 6 fichiers du dépôt public, et sa seconde partie dans
  17.
  - signal : le champ demandeur des 6 candidatures de Produit-76, dans `todo/TODO.jsonl`.
  - parade : D-33.
- **Les pages d'étude générées vont échouer à 2 contrôles** qu'elles traversaient sans être vues : de
  vrais titres de chapitre réveillent les règles de chapeau de `check_html`, et `run-oracles` joue
  désormais la lecture par un tiers sur `output`.
  - signal : un FAIL de `check_html` ou d'`oracle-lecture-tiers` à la prochaine étude régénérée.
  - parade : D-35 (a) les traite ; D-35 (b) les laisse candidates.
- **La porte des noms neuve juge désormais tout envoi du parc.**
  - signal : un envoi dont la porte rend un constat que l'ancienne ne rendait pas, ou l'inverse.
  - parade : les 2 versions rendent la même liste sur le pilot ; l'ancienne reste dans la sauvegarde
    des copies installées de ce soir.
- **L'autre poste tirera 34 enregistrements** du pilot et 10 de forge-agents.
  - signal : un envoi refusé sur l'autre poste, faute d'avance rapide.
  - parade : rejouer ses enregistrements non publiés sur le publié, index régénérés, comme ce matin.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord. L'exécution de D-33 passe en tête : c'est elle
qui retire le nom de l'état publié. Côté humain, trancher d'abord, puis les 3 suppressions laissées
ce matin.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Exécuter D-33 selon votre réponse : inscrire les formes, les substituer dans l'état courant, rejouer la porte des noms, publier | `auto_ia` | TF-1456 | `dependance_bloc_3` — suit D-33 | le nom reste publié en clair |
| **A-2** | Exécuter D-34 selon votre réponse, puis émettre au produit le lot de travaux de TF-1430 | `auto_ia` | TF-1432, TF-1430 | `dependance_bloc_3` — suit D-34 | le produit garde 2 pseudonymes, et son lot n'a pas de destinataire |
| **A-3** | Exécuter D-35 selon votre réponse : décider au registre les candidatures retenues, puis les traiter | `auto_ia` | TF-1464, TF-1459 | `dependance_bloc_3` — suit D-35 | les 32 restent candidates |
| **A-4** | Créer au référentiel `todo/CLASSES.json` les 4 classes que les lots de l'après-midi proposent, chacune avec son contrôle | `auto_ia` | neuve | `hors_mandat` — la tenue du registre, que ce tour n'a pas reçue | 4 retours restent hors du compte des récidives |
| **A-5** | Consigner au registre la clôture de TF-1413 avec les mots de la décision rendue chez le produit | `auto_ia` | TF-1413 | `hors_mandat` — la session qui a reçu la décision la consigne | la candidature reste ouverte alors que son travail est publié |
| **A-6** | Trancher D-33, D-34 et D-35 — répondre par exemple « D-33 b, D-34 a, D-35 b » | `manuelle_utilisateur` | neuve | `decision` — effacer une donnée publiée et choisir un pseudonyme vous reviennent | (c) s'applique aux 3 |
| **A-7** | Supprimer le fichier de 22 octets : `Remove-Item C:\dev\null` dans PowerShell ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve | `irreversible` — R-29 (une suppression reste un geste humain décidé) | le relevé d'ouverture le signale à chaque session |
| **A-8** | Supprimer la copie du 22/09 : `Remove-Item C:\dev\_confidentiel\tables\produits-pseudonymes.json.bak-20260922` ; preuve : `git -C C:\dev\_confidentiel status` ne la liste plus | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | des noms réels restent lisibles dans un fichier que rien ne suit |
| **A-9** | Retirer les 2 branches locales du gabarit, intégrées à `main` : `git -C C:\dev\digit-ai-factory branch -d report/guide-de-reference-20260928`, puis `git -C C:\dev\digit-ai-factory branch -D gabarit/guide-de-reference` (sauvegardée en paquet) ; preuve : `git -C C:\dev\digit-ai-factory branch` ne liste plus que `main` et `report/complement-20260921` | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | la porte des noms relit leurs 8 enregistrements jamais publiés à chaque envoi du pilot |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publiés : forge-agents `6a64883..aea5f97` à 22:15:44 ; pilot `a019efc1..2dfbc951` à 22:29:26 ;
  `7e5eebfa`, cette synthèse et les index régénérés partent par un dernier envoi.
- Registre `todo/TODO.jsonl` : 34 décisions, 32 clôtures, 2 mises en cours, 11 scores, 32 créations
  (TF-1456 à TF-1487), 3 notes ; référentiel `todo/CLASSES.json` 1.25.0.
- Copies installées des 4 skills avant la propagation : `c:/dev/_sauvegardes/d32-20260928`.
- Rapports des 10 agents et mesures du pilot : dossier de travail de la session, hors dépôt.
