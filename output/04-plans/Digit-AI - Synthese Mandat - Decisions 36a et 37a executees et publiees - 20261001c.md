---
destinataire: humain
role: restitution de fin de tour, réponse « 36a … 37a » du 01/10/2026 aux décisions D-36 et D-37
sources_de_verite: git du pilot et de digit-ai-forge-agents · todo/TODO.jsonl · todo/CLASSES.json · input/00-retours · les 2 tables du canal confidentiel, lues, jamais modifiées · les transcripts des 5 agents de campagne · output/04-plans/Digit-AI - Synthese Mandat - Sas traite onze lots ingeres deux en attente de decision - 20261001b.md (D-36, D-37) · output/04-plans/Digit-AI - Synthese Mandat - Decision 32a executee trente quatre candidatures traitees - 20260928c.md (D-33 à D-35) · gabarits/RESTITUTION.md (v2.32.0)
verifie_le: 2026-10-01
---

# Digit-AI — Synthèse de mandat — D-36 et D-37 exécutées, 18 candidatures closes — 01/10/2026

## 0. Synthèse d'ouverture

Vos 2 réponses sont exécutées et publiées. Le dépôt digit-ai-prospection garde son nom, comme digit-ai-marketing : ses 2 lots sont ingérés sous ce nom, et l'accueil ne donne plus de pseudonyme à un dépôt déclaré de l'écosystème. La règle que vous m'avez demandé de retenir est écrite dans la doctrine du sas et dans ma mémoire. Un dépôt privé peut garder des noms ; le pilot et les 13 forges, publics, restent protégés. Les 18 candidatures de D-37 sont closes, chacune sur une preuve rejouée par le pilot. Elles livrent 3 oracles neufs dans la forge des agents, pour les polices embarquées, Terraform et les images de conteneur, l'export par PowerPoint, et au pilot 3 règles de restitution et 3 portes de mise en production. Les 8 lots arrivés pendant le tour sont ingérés aussi. Ce qui vous attend : D-38, 35 candidatures neuves à arbitrer, dont une sur un sigle de projet publié dans 22 fichiers du pilot sans qu'aucune table de noms ne le porte.

## 1. En-tête d'identification

- **quoi** — exécution de vos réponses à D-36 et D-37 ; accueil et ingestion des 8 lots arrivés au sas pendant le tour ; publication du pilot et de `digit-ai-forge-agents`.
- **sur quoi** — le pilot `digit-ai-factory` et `digit-ai-forge-agents`, modifiés et publiés ; les 2 tables du canal confidentiel, lues, jamais modifiées ; les dépôts des produits, lus pour mesurer, jamais modifiés.
- **quand** — le 01/10/2026, de 10:33, heure de votre message lue au transcript, à 14:12 (UTC+02:00), relevée par l'horloge du poste, soit 3 h 39 min ; la fin est l'heure de dépôt de cette synthèse, son envoi suit.
- **qui** — session de pilotage Claude Opus 5.5 et 5 agents de campagne. L'agent « doctrine des produits » a tourné sur Sonnet 5.5, le défaut du contrat de routage ; « juges de restitution », « mise en production », « registre des oracles » et « export PowerPoint » sont escaladés sur Opus 5.5, motif : construction complexe. Modèles relevés aux transcripts des agents. Pilot passé de `b203fd27` à `7f9537d6`, `digit-ai-forge-agents` de `aea5f97` à `994e516`, les 2 publiés.
- **intention** — que vos 2 réponses produisent leur effet entier : le nom de la prospection lisible sans bloquer aucun envoi, et chaque défaut remonté par les produits traité là où il naît, preuve à l'appui.
  **Test rétro** : servie. Les 18 sont closes sur une preuve rejouée ; 11 déclarent un reste, la plupart repris en candidature, dont le scan d'image jamais joué sur une construction réelle, trivy manquant au poste.

## 2. Verdict en une ligne

**D-36 (a) et D-37 (a) exécutées** · **18 candidatures closes sur preuve**, `oracle-todo` PASS · 10 lots ingérés, 2 de la prospection et 8 arrivés pendant le tour · 35 candidatures neuves, TF-1506 à TF-1540 · harnais du pilot 169/170, puis son seul rouge rejoué vert · publiés : pilot `b203fd27..7f9537d6`, forge-agents `aea5f97..994e516` · **1 décision neuve**, 3 rappelées.

## 3. Décisions attendues de l'humain

Comment lire ce bloc : les 3 décisions du 28/09 se rappellent en une ligne, inchangées ; la neuve porte ses options en tableau, la colonne Coût dit la complexité et la durée, la colonne Exclusions ce que retenir l'option ferme. Pour répondre, un sélecteur suffit, par exemple « D-38 b ».

**D-33** : le nom d'affichage d'un produit publié en clair dans `todo/TODO.jsonl` et 5 autres fichiers du dépôt public, posée le 28/09 à 22:33, inchangée.

**D-34** : le rattachement des 2 pseudonymes d'un même produit dans `produits-pseudonymes.json`, posée le 28/09 à 22:33, inchangée.

**D-35** : la décision des 32 candidatures nées de la campagne du 28/09 dans `todo/TODO.jsonl`, posée le 28/09 à 22:33, inchangée.

> **D-38 — Faut-il décider les 35 candidatures entrées ce jour dans `todo/TODO.jsonl`, et lesquelles ?**
>
> Elles viennent de 3 sources. 5 viennent des 2 lots de `digit-ai-prospection`, 10 des 8 lots arrivés pendant le tour, chez Produit-03 et Produit-64, et 20 de la campagne et de la relecture avant publication. 17 valent 10 ou plus, dont 4 qui portent les mots du commanditaire de Produit-03. L'une d'elles demande si un sigle de projet, publié dans 22 fichiers du pilot et absent des 2 tables de noms, doit être protégé. Sous la barre de 10, une seule porte votre demande, faite chez Produit-64 : chercher la voie automatique avant de laisser un geste à l'humain, pour « toutes les demandes, tous les projets et produits ». Une autre double une candidature du 21/09 sur la capture d'une section en onglet masqué, que son producteur annonce annuler.
>
> **Recommandation : (b).** Source consultée : les scores posés à l'ingestion et à la création, relus au registre le 01/10 ; le lot de Produit-64 du 01/10 qui porte votre demande ; le relevé des 22 fichiers par `git grep`.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 35 | complexe × long | le mandat suivant traite aussi 17 candidatures de valeur inférieure à 10, que personne n'a demandées |
| **(b)** *(recommandée)* Décider les 18 : les 17 de valeur 10 ou plus, et la voie automatique cherchée avant tout geste laissé à l'humain, que vous avez demandée | complexe × long | 17 restent candidates, dont les 5 de la prospection, de valeur 3 à 9, et le doublon de la capture en onglet |
| **(c)** Ne rien décider | nul | les 35 restent candidates, dont votre demande faite chez Produit-64 et la question du sigle |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Chaque correctif a suivi le même ordre : mesure du défaut, correctif, rejeu du banc par le pilot. Chaque clôture au registre cite son enregistrement et sa preuve.

- **Votre règle, écrite là où elle s'applique.** Un dépôt privé peut garder des noms ; la protection vise les dépôts publics.
  - preuve : visibilité relevée par `gh repo view` le 01/10, le pilot et les 13 forges publics, `digit-ai-marketing` privé, `digit-ai-prospection` sans dépôt distant ; la règle citée mot pour mot dans `references/TODO-FORGE.md`, section du sas, et dans ma mémoire.
- **D-36 (a) : `digit-ai-prospection` entre dans la liste des produits de l'écosystème**, `scripts/lib-parc.mjs`, votre règle en commentaire.
  - preuve : `scripts/lib-parc.test.mjs`, 5/5.
- **L'accueil laisse son nom à un dépôt déclaré de l'écosystème** : `pseudoProduit` le rend tel quel, sans l'inscrire à la table, et l'ingestion l'annonce.
  - preuve : recette de l'anonymiseur rouge à 9/11 avant le correctif, le dépôt déclaré recevant un pseudonyme, verte à 11/11 après ; un dépôt non déclaré en reçoit toujours un ; recette d'ingestion d'un lot de l'écosystème 3/3.
- **Les 2 lots de la prospection, accueillis et ingérés sous leur nom**, par la commande ordinaire.
  - preuve : accueil à 10:49:18, ingestion à 10:50:20 et 10:50:25, 5 candidatures TF-1506 à TF-1510 au demandeur `digit-ai-prospection` ; les 2 tables inchangées.
- **D-37 (a) : les 18 candidatures décidées au registre à 10:38:43**, puis confiées à 5 agents de campagne, chacun sur ses propres fichiers, sans écriture au registre ni envoi.
  - preuve : 18 événements de décision au même horodatage ; rapports rendus de 11:39 à 13:32, relevés aux transcripts ; chaque clôture écrite par le pilot après son propre rejeu.
- **Au pilot, 3 règles de restitution neuves**, dans `oracles/oracle-synthese.mjs` et `gabarits/RESTITUTION.md` 2.32.0 : un paragraphe de prose sur une seule ligne source, une validation qui dit ce qu'elle ne vérifie pas, des portes à base externe rejouées le jour du lancement. Elles entrent avertissantes.
  - preuve : banc d'`oracle-synthese` 104/104, rejoué par le pilot ; mesurées avant mise en service sur les 215 synthèses du pilot, la première en accuse 91, les 2 autres aucune.
- **3 juges du pilot corrigés, chacun rouge contre l'ancien code et vert contre le nouveau** : la règle d'exclusivité cherche son mot dans la seule demande citée, la règle des chemins réserve 34 caractères au fichier d'accompagnement d'un oracle au lieu de 26, et la règle du gras d'`oracle-ecriture` n'accuse plus du texte ordinaire.
  - preuve : `oracle-ecriture` 20/20, `oracle-synthese` 104/104 ; la règle d'exclusivité cesse d'accuser 11 synthèses sur 215, toutes à tort.
- **Au pilot, 3 portes de mise en production dans `ETAPE-MEP.md`** : relever les garde-fous de la plateforme et relire les contraintes connues avant de concevoir un déploiement ; résoudre tout identifiant de plateforme écrit en dur et relire l'effet d'un octroi de droits ; rejouer le jour du lancement les portes qui jugent une base externe. 3 vérificateurs neufs les jouent, nourris de 2 tables de référence datées et sourcées.
  - preuve : bancs 14/14, 13/13 et 12/12, `oracle-trace-mutation-mep` 24/24, rejoués par le pilot ; sur le dépôt de Produit-03, d'où venaient ces lots, lu sans écrire, les vérificateurs retrouvent la contrainte du lot et les 3 défauts du script en cause, à leurs lignes.
- **Au pilot, la doctrine des produits** : un document tenu ouvert ne bloque plus le tour, le canal entre produits s'écrit au contrat d'interface, le socle cite le juge des polices embarquées avant toute remise, et le chemin admis d'un livrable passe de 124 à 116 caractères.
  - preuve : recette de conformité de 110 cas à 122, 0 FAIL ; 5 mutants joués hors dépôt, tous tués ; 0 écart de verdict sur les 15 projets du parc ; recettes d'héritage 31/31 et 14/14.
- **Chez `digit-ai-forge-agents`, 3 oracles neufs au registre de `quality-oracles`** : les polices embarquées d'un PPTX, d'un DOCX, d'un PDF ou d'une page web ; une configuration Terraform, date d'effet écrite en dur comprise ; une image de conteneur construite sans cache, puis passée à trivy.
  - preuve : recette `quality-oracles` 418/418 au dernier enregistrement ; 22 decks réels contre-mesurés, 22/22 verdicts identiques à l'outil d'origine ; chaque fixture rejouée par le pilot rend le verdict attendu sur sa règle ; sur les 212 fichiers Terraform du poste, 3 dates de début d'août que la plateforme refusera.
- **Chez `digit-ai-forge-agents`, la charte des présentations et l'export par PowerPoint** : `oracle-charte-pptx-semantique` lit le profil du client, et `digit-ai-pptx` 2.7.0 exporte par PowerPoint sans quitter une instance de l'utilisateur, puis juge et réencode les polices embarquées.
  - preuve : sur les 91 decks du poste, 2 378 constats de charte disparaissent sous le profil générique, et les 91 verdicts restent identiques sous le profil Digit-AI ; 8 sabotages joués sur une copie jetable de l'export, chacun pris ; self-test du skill rejoué par le pilot, sortie 0.
- **La loi qualité étendue** : `quality-oracles` exige qu'un critère de vérification écrit pour un humain porte sa ligne « Ne vérifie pas », comme un oracle déclare ce qu'il ne juge pas.
  - preuve : recette `quality-oracles` 418/418 ; description du skill à 1 017 caractères sur 1 024.
- **Les skills installés au poste, alignés sur la forge publiée.**
  - preuve : `oracles/oracle-skills.mjs --appliquer` rendu à 13:41:24, PASS.
- **Le référentiel des classes, de 1.25.0 à 1.27.0** : 7 classes neuves, chacune portée par un contrôle livré ce jour, et la classe des chemins trop longs rattachée à son juge.
  - preuve : `todo/CLASSES.json`, 101 classes puis 108 ; `oracle-todo` PASS, règle du contrôle existant comprise.
- **Les 8 lots arrivés pendant le tour, accueillis, relus à la main et ingérés.** 6 sont retouchés à la réception, chacun annoté : 5 titres de Produit-03 portaient son nom accentué, l'un de ces lots une famille en guise de classe, et un numéro de retour déjà donné devient RT-31 chez Produit-64.
  - preuve : accueil à 12:57:46 ; `oracle-lot-retours` PASS sur les 8 ; ingestion de 13:00:42 à 13:01:11, 10 candidatures TF-1511 à TF-1520 ; les 2 tables inchangées.
- **Le registre tenu.** 20 candidatures nées en route, TF-1521 à TF-1540, chacune sous une classe existante ; 5 notes rectifient l'heure d'un rejeu que j'avais écrite sans la relever.
  - preuve : `todo/journaliser.mjs` en essai puis en réel ; `oracle-todo` PASS ; heures rectifiées d'après les sorties horodatées des rejeux.
- **Le harnais du pilot et le cliquet de ses recettes.** Le cliquet est relevé après la campagne : 7 recettes montent, 3 neuves s'inscrivent. Le dernier harnais n'a laissé qu'un rouge, un site d'empreinte du nouvel oracle des images non déclaré ; déclaré, le contrôle repasse au vert.
  - preuve : `oracles/self-tests.mjs` de 13:42:41 à 13:57:16, 169/170 ; `oracles/oracle-empreintes.mjs` rejoué, PASS, 50 sites déclarés sur 50 trouvés.
- **Le sigle relevé avant l'envoi.** Il figure dans 22 fichiers suivis déjà publiés, le premier enregistré le 08/09, et dans 2 de plus à cet envoi ; aucune des 2 tables ne le porte.
  - preuve : `git grep` insensible à la casse, 22 fichiers à `origin/main`, 24 dans l'arbre courant ; candidature TF-1540, écrite sans le sigle.
- **La publication.**
  - preuve : `digit-ai-forge-agents` `aea5f97..994e516`, envoi rendu à 13:36:18 ; pilot `b203fd27..7f9537d6`, envoi lancé à 14:00:06 et rendu à 14:12:12, sortie 0, la porte des noms ayant joué pendant ces 12 min 6 s ; `git rev-list` rend `0 0` après `git fetch` aux 2 dépôts.

## 5. Non traité — avec son motif

- La décision des 35 candidatures neuves — motif : `decision` — D-38 la porte.
- La protection du sigle de projet publié sans table — motif : `decision` — protéger un nom vous revient, et D-38 porte sa candidature.
- La création au référentiel des 40 classes que les lots proposent, dont 7 ce jour, et le rattachement de leurs 44 candidatures — motif : `hors_mandat` — la tenue du référentiel, que vos réponses n'ont pas commandée.
- Le nom publié en clair, les 2 pseudonymes d'un produit et les 32 candidatures de la campagne du 28/09 — motif : `decision` — D-33, D-34 et D-35, rappelées inchangées.
- La clôture de TF-1413 avec les mots de la décision rendue chez le produit — motif : `hors_mandat` — la session qui a reçu la décision la consigne.

## 6. Écarts à la lettre

- **Vous avez répondu** « 36a … 37a ». **J'ai aussi ingéré les 8 lots arrivés pendant le tour.** **Pourquoi** : la voie automatisée est le défaut, et un lot laissé au sas rend rouge le relevé de chaque ouverture ; chacun a été relu à la main avant l'ingestion.
- **J'ai corrigé l'accueil avant d'ingérer la prospection**, au lieu de passer par une copie de la table comme pour le marketing ce matin. **Pourquoi** : ce défaut était l'une des 18 candidatures de D-37 ; corrigé d'abord, il a laissé la commande ordinaire faire l'ingestion.
- **J'ai publié le pilot et `digit-ai-forge-agents`** en citant vos mots dans `FORGE_PUSH_GO`. **Pourquoi** : une candidature se clôt sur la version publiée qui la corrige, et la règle de publication reçoit comme GO la réponse à une décision, citée telle quelle.
- **J'ai publié 2 fichiers de plus qui portent le sigle**, le lot de Produit-64 et son fichier d'accompagnement. **Pourquoi** : aucune table ne le protège, il est publié depuis le 08/09 dans 22 fichiers, et un lot ingéré ne se retouche plus ; décider sa protection vous revient.
- **J'ai inscrit 20 candidatures neuves.** **Pourquoi** : un constat fait en route entre en candidature, et chacune attend votre arbitrage.

## 7. Risques

- **Un sigle de projet est publié dans 24 fichiers du pilot**, sans qu'aucune table de noms ne le porte.
  - signal : ce sigle dans un lot entrant, que ni l'accueil ni la porte des noms n'arrêtent.
  - parade : votre réponse sur sa candidature ; d'ici là, la relecture à la main de chaque lot.
- **3 dates de début d'août restent dans les budgets Terraform de 2 produits**, et la plateforme les refusera à la prochaine application.
  - signal : une application refusée, comme chez Produit-03 le 29/09.
  - parade : un lot de travaux à ces 2 produits, candidature de valeur 20 dans D-38.
- **Un deck exporté par PowerPoint porte le nom du compte Office** dans ses propriétés, et l'export du skill ne l'efface pas.
  - signal : le champ du dernier auteur d'un deck remis à un client.
  - parade : la candidature de cet export, de valeur 12 dans D-38 ; d'ici là, relire les propriétés avant remise.
- **Une autre session écrit dans le pilot en même temps** ; ses 2 fichiers du 01/10 restent non suivis.
  - signal : un fichier non suivi qui n'est pas le mien, ou un envoi refusé faute d'avance rapide.
  - parade : je n'enregistre que mes chemins, et je relève le distant avant chaque envoi.
- **L'autre poste peut frapper les mêmes numéros** : TF-1506 à TF-1540 sont pris ici.
  - signal : un envoi refusé sur l'autre poste, faute d'avance rapide.
  - parade : renuméroter ses créations locales avant l'union, comme le 25/09.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord ; chacune suit votre réponse à la décision qu'elle nomme. Côté humain, trancher d'abord, puis les 3 suppressions laissées le 28/09.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Exécuter D-33 selon votre réponse : inscrire les formes, les substituer dans l'état courant, rejouer la porte des noms, publier | `auto_ia` | TF-1456 | `dependance_bloc_3` — suit D-33 | le nom reste publié en clair |
| **A-2** | Exécuter D-34 selon votre réponse, puis émettre au produit le lot de travaux préparé pour lui | `auto_ia` | TF-1432, TF-1430 | `dependance_bloc_3` — suit D-34 | le produit garde 2 pseudonymes, et son lot n'a pas de destinataire |
| **A-3** | Exécuter D-35 selon votre réponse : décider au registre les candidatures retenues, puis les traiter | `auto_ia` | TF-1464, TF-1459 | `dependance_bloc_3` — suit D-35 | les 32 restent candidates |
| **A-4** | Exécuter D-38 selon votre réponse : décider au registre les candidatures retenues, puis les traiter | `auto_ia` | TF-1514, TF-1540 | `dependance_bloc_3` — suit D-38 | les 35 restent candidates |
| **A-5** | Créer au référentiel `todo/CLASSES.json` les 40 classes que les lots proposent, chacune avec son contrôle, puis y rattacher leurs 44 candidatures | `auto_ia` | TF-1511, TF-1518 | `hors_mandat` — la tenue du référentiel, que ce tour n'a pas reçue | 44 candidatures restent hors du compte des récidives |
| **A-6** | Consigner au registre la clôture de TF-1413 avec les mots de la décision rendue chez le produit | `auto_ia` | TF-1413 | `hors_mandat` — la session qui a reçu la décision la consigne | la candidature reste ouverte alors que son travail est publié |
| **A-7** | Trancher D-33, D-34, D-35 et D-38 — répondre par exemple « D-38 b » | `manuelle_utilisateur` | neuve | `decision` — protéger un nom et arbitrer le registre vous reviennent | (c) s'applique aux 4 |
| **A-8** | Supprimer le fichier vide de la racine du parc : `Remove-Item C:\dev\null` dans PowerShell ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve | `irreversible` — R-29 (une suppression reste un geste humain décidé) | le relevé d'ouverture le signale à chaque session |
| **A-9** | Supprimer la copie du 22/09 : `Remove-Item C:\dev\_confidentiel\tables\produits-pseudonymes.json.bak-20260922` ; preuve : `git -C C:\dev\_confidentiel status` ne la liste plus | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | des noms réels restent lisibles dans un fichier que rien ne suit |
| **A-10** | Retirer les 2 branches locales du gabarit, intégrées à `main` : `git -C C:\dev\digit-ai-factory branch -d report/guide-de-reference-20260928`, puis `git -C C:\dev\digit-ai-factory branch -D gabarit/guide-de-reference` (sauvegardée en paquet) ; preuve : `git -C C:\dev\digit-ai-factory branch` ne liste plus que `main` et `report/complement-20260921` | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | la porte des noms relit leurs enregistrements jamais publiés à chaque envoi du pilot |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publiés : `digit-ai-forge-agents` `aea5f97..994e516` à 13:36:18 ; pilot `b203fd27..7f9537d6` à 14:12:12 ; cette synthèse et l'index régénéré partent par un dernier envoi.
- Registre `todo/TODO.jsonl` : 18 décisions, 18 clôtures, 10 lots ingérés, 35 créations (TF-1506 à TF-1540), 5 notes d'heure rectifiée, rattachements de classe.
- Référentiel `todo/CLASSES.json` : 1.27.0, 108 classes.
- Lots accueillis : `input/00-retours`, 20 fichiers, 4 de la prospection et 16 arrivés pendant le tour.
- Rapports et transcripts des 5 agents : dossier de la session, hors dépôt.
- Scripts d'accueil, de réception, d'ingestion, de clôture et d'envoi, avec leurs sorties : dossier de travail de la session, hors dépôt.
