---
destinataire: humain
---

# Synthèse Conseil — 12 décisions à trancher, une qualification de noms et 4 gestes humains (17/10/2026)

## 0. Synthèse d'ouverture

Quinze sujets du registre attendent votre décision. Dix ont une fiche complète depuis le 15/10 et n'ont pas reçu de réponse : ils touchent les noms publiés, la doctrine de mise en production, une dépense de modèle et le démarrage des publications d'un produit. Un onzième, la purge des noms en clair, est déjà tranché ; il attend seulement que vous disiez lesquels des cinq noms sont sensibles. Quatre sujets sont arrivés les 15 et 16/10 et attendent que vous les déclariez décidés. S'y ajoute le classement des synthèses par mois, posé le 16/10. Quatre gestes ne peuvent être faits que par vous, dont la rotation des identifiants publiés. Rien n'a été modifié dans ce tour.

## 1. En-tête d'identification

Synthèse de conseil, réponse à la demande « liste en détails les décisions à traiter » du 17/10/2026, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 17/10/2026 de 07:55 à 08:00, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : avoir sous les yeux, en une fois, tout ce qui attend votre arbitrage, avec de quoi trancher chaque point sans rouvrir le registre.

Test rétro : le résultat sert cette intention. Chaque décision porte sa question, ce qu'il faut savoir, la recommandation sourcée et les options chiffrées. Le registre a été lu sur l'état publié, car ce poste a 23 enregistrements de retard et sa vue `todo\TODO.md` ne montrait pas les sujets des 15 et 16/10.

## 2. Verdict en une ligne

15 sujets en attente de décision humaine au registre publié : 10 fiches non tranchées, 1 qualification de noms, 4 candidats ; plus 1 décision du 16/10 hors registre et 4 gestes humains.

## 3. Décisions attendues

Les dix premières décisions ont déjà été posées le 15/10 dans la synthèse 20261015l, sous les numéros D-4 à D-13 ; vous demandez le détail, elles sont donc reprises en entier sous une numérotation neuve. Ordre : noms et histoire publiée d'abord, puis la doctrine, la dépense, les valeurs d'un produit, enfin les sujets neufs. Chaque décision se lit de la même façon : la question et le sujet du registre en titre, ce qu'il faut savoir, la recommandation et sa source, puis un tableau où chaque ligne est une option, avec son coût en complexité × durée et ce qu'elle ne fait pas ; la dernière ligne dit l'option qui s'applique si vous ne répondez pas.

> **D-1 — Le sigle de projet employé par deux produits est-il un nom à protéger ? (TF-1540, ex-D-4 du 15/10)**
>
> Deux produits se désignent par un même sigle de quatre caractères. Aucune des deux tables de protection ne le porte, donc la porte de publication ne l'a jamais arrêté. Il figurait dans 22 fichiers publiés le 01/10, et dans 30 fichiers suivis le 15/10. Aucun message de commit ne le porte : l'inscrire ne bloquerait aucun envoi. Il n'y a que vous pour savoir s'il désigne une identité à protéger. Le décider oui ouvre aussi la purge commune avec les cinq noms de TF-1323.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl`, fiche de TF-1540 instruite le 15/10, notes des 02/10, 12/10 et 13/10. Inscrire est réversible et peu coûteux ; ne rien faire laisse le sigle gagner des fichiers à chaque lot.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Oui : inscrire le sigle aux tables, le substituer dans l'état courant des fichiers suivis, rejouer la porte de publication | Moyen × court | Ne nettoie pas l'histoire publiée ; exception à l'immutabilité du registre à accepter |
| (b) Non : consigner au registre que le sigle n'est pas sensible | Faible × court | Le sigle reste publié tel quel |
| (c) Ne rien décider pour l'instant | Faible × court | Chaque nouveau lot des deux produits l'ajoute à d'autres fichiers |

> **Si rien n'est décidé** : (c), le sigle reste non protégé.

> **D-2 — Faut-il déclarer le pseudonyme récent d'un produit comme alias de l'ancien, dans le canal confidentiel ? (TF-1432, ex-D-5 du 15/10)**
>
> Un même produit a reçu deux pseudonymes selon la graphie de son nom, le 27 et le 28/09. Les règles qui comparent les lots d'un même produit n'en voient aucun : l'oracle de lot voit 0 lot antérieur contre 5 dans le dossier. Le code de rattachement est livré et rejoué, 6 cas sur 6, mais reste en sommeil tant que le canal confidentiel ne déclare pas l'alias. Il faut aussi amender la règle d'unicité de l'oracle du canal, puis publier ce dépôt privé.
>
> **Recommandation : (a).** Source consultée : fiche de TF-1432 au registre, `todo/anonymiser-entrant.mjs`. L'alias ne réécrit rien et se défait en retirant le bloc ; la fusion coûte beaucoup plus pour le même effet.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Activer l'alias : amender la règle d'unicité, poser le bloc de rattachements | Moyen × court | Ne renomme aucun fichier déjà écrit ; ne rattache pas le troisième nom du 14/08 |
| (b) Fusionner : un seul pseudonyme, remplacé dans la table et dans jusqu'à 42 fichiers suivis | Élevé × moyen | N'efface pas l'ancien de l'histoire publiée ; exception à l'immutabilité des archives |
| (c) Ne rien activer | Faible × court | Chaque graphie nouvelle ouvre un pseudonyme de plus |

> **Si rien n'est décidé** : (c), le code reste en sommeil.

> **D-3 — Faut-il aligner la doctrine sur le référentiel d'audit pour trois contrôles bloquants ? (TF-1212, ex-D-7 du 15/10)**
>
> Un produit a franchi toutes les portes de construction puis échoué 125 contrôles sur 175 du référentiel d'audit de la maison, dont 12 contrôles bloquants. Trois viennent d'une contradiction de doctrine : la route de déploiement manuelle à porte contre le pipeline exclusif, l'absence de contrôle de sauvegarde à l'oracle de mise en production, l'absence de règle sur le fournisseur d'identité. La couverture des cinq domaines sans propriétaire est déjà déclarée, en avertissement. Aligner change le parcours de mise en production de tous les produits ; le taux de produits verts qui rougiraient n'est pas mesuré.
>
> **Recommandation : (a).** Source consultée : fiche de TF-1212, `references/ETAPES-RUN.md`, commit e9b8af51. La doctrine ne peut pas valider ce que l'audit de la même maison refuse.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Aligner : pipeline exclusif, contrôle de sauvegarde à l'oracle MEP, règle sur le fournisseur d'identité | Élevé × moyen | Pas bloquant d'emblée si vous préférez un avertissement d'abord ; ne touche pas les produits livrés |
| (b) Garder la doctrine et déclarer les trois écarts comme assumés au référentiel, avec leur motif | Faible × court | Les produits échouent ces trois contrôles, de façon assumée |
| (c) Laisser en l'état | Faible × court | Chaque audit les relève de nouveau, sans décision consignée |

> **Si rien n'est décidé** : (c), les contradictions restent.

> **D-4 — Quelle posture le guide de mise en production retient-il pour le secret d'Easy Auth ? (TF-1396, ex-D-10 du 15/10)**
>
> Le guide écrit à un endroit qu'aucun secret client n'est créé, et à un autre qu'un secret est déposé au coffre avec une échéance. Le développeur du produit a dû trancher seul entre les deux. C'est un choix de doctrine de sécurité : il engage toutes les mises en production suivantes. Le texte corrigé vit chez le produit, donc l'option retenue part en lot de travaux.
>
> **Recommandation : (a).** Source consultée : fiche de TF-1396, retour RX-9 du 24/09, décision d'architecture `ADR0703-consommation-api-clients-sans-secrets.md` de forge-audit. Elle s'aligne sur la règle du socle qui n'admet un secret que si l'identité fédérée ne suffit pas.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Aucun secret client par défaut, identité fédérée ; le secret au coffre devient un écart déclaré et borné | Moyen × court | Les configurations qui déposent déjà un secret sans le déclarer sont à ajuster |
| (b) Le secret au coffre avec échéance devient la voie normale | Moyen × court | Abaisse le niveau affiché et s'écarte de la règle du socle |
| (c) Laisser en attente | Faible × court | Chaque lecteur continue de trancher seul |

> **Si rien n'est décidé** : (c), la contradiction reste dans le guide.

> **D-5 — Faut-il construire l'outil qui consigne un verdict par contrôle, et rendre bloquant le juge de clôture ? (TF-1319, ex-D-11 du 15/10)**
>
> Le juge qui confronte les contrôles découverts aux verdicts consignés au journal d'un run est livré et joué à la clôture, à titre informatif. 174 contrôles sont découverts sur 14 dépôts. Pour qu'il devienne bloquant, il manque l'outil qui consigne un verdict par contrôle ; une variante écrite le 24/09 existe en sauvegarde. Sur les journaux réels, le juge échoue sur les deux runs du seul produit qui déclare ses forges ; son taux de faux rejets n'est pas mesuré.
>
> **Recommandation : (b).** Source consultée : fiche de TF-1319, notes du 23/09 au 12/10, étude du 19/08 sur le méta-oracle. Le rendre bloquant avant de mesurer ses faux rejets risquerait de bloquer des clôtures à tort.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Reprendre l'outil et le blocage à la clôture depuis la sauvegarde | Moyen × moyen | Bloque dès la livraison, sans mesure préalable des faux rejets |
| (b) Reprendre l'outil seul ; juge informatif jusqu'à une mesure des faux rejets sur plusieurs runs | Moyen × moyen | Aucune clôture bloquée tant que la mesure n'est pas faite |
| (c) Ne pas construire l'outil | Faible × court | Le juge ne pourra jamais devenir bloquant |

> **Si rien n'est décidé** : (c), le juge reste informatif.

> **D-6 — Quels garde-fous proposer à un dossier de travail qui englobe un produit ? (TF-0963, ex-D-8 du 15/10)**
>
> Quand une session s'ouvre au-dessus du produit, aucun garde-fou de la doctrine ne s'exécute. Le 08/09, plusieurs heures de travail, trois commits, un déploiement et deux restitutions ont échappé à tout contrôle. La détection est livrée : la session nomme le défaut à l'ouverture. Reste à décider ce que le gabarit d'héritage pose au dossier englobant. Un garde-fou posé là juge aussi les messages écrits pour les dossiers voisins.
>
> **Recommandation : (a).** Source consultée : fiche de TF-0963, `oracles/oracle-portee-doctrine.mjs` règles PD3 et PD4, `gabarits/settings-produit.json`. C'est la seule portée déjà éprouvée par le produit, le 09/09.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Ne proposer que le garde-fou du lexique, déjà posé et vérifié par le produit, validé en gabarit | Faible × court | Ouverture, restitution et refus avant outil restent seulement signalés |
| (b) Proposer tous les garde-fous, chacun délégué au produit par chemin préfixé | Moyen × moyen | Ne protège pas les dossiers voisins d'un jugement à tort |
| (c) Laisser en l'état | Faible × court | Une session ouverte au-dessus du produit reste hors doctrine |

> **Si rien n'est décidé** : (c), seule la détection subsiste.

> **D-7 — Faut-il brancher la garde qui refuse la redirection vers /dev/null sous PowerShell ? (TF-1584, ex-D-9 du 15/10)**
>
> Sous Windows, une redirection vers `/dev/null` jouée par PowerShell écrit un fichier `C:\dev\null`. Ce fichier est passé de 117 octets à une page entière le 26/09, réécrit par une session voisine (fiche de TF-1584), et il pèse toujours 13530 octets ce matin (source : relevé d'ouverture du 17/10, `oracles/hook-ouverture.mjs`). La garde est écrite et testée, 8 cas sur 8, mais elle n'est pas branchée dans `.claude/settings.json`. Elle refuse la commande entière ; son taux de faux positifs n'est pas mesuré.
>
> **Recommandation : (a).** Source consultée : fiche de TF-1584, `oracles/hook-puits-windows.mjs`, commit 0a8fd4c9. Le geste est réversible, testé, et ne touche que le pilot.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Brancher la garde en refus chez le pilot | Faible × court | Ne supprime pas le fichier existant ; ne couvre pas les produits |
| (b) La brancher chez le pilot et proposer aux produits un câblage en avertissement | Moyen × moyen | Le câblage produit reste une décision par produit |
| (c) Ne pas la brancher | Faible × court | Rien n'empêche une nouvelle réécriture du fichier |

> **Si rien n'est décidé** : (c), la garde reste dormante.

> **D-8 — Autorisez-vous une campagne d'environ 70 exécutions de modèle pour proposer des modifications de la consigne de restitution ? (TF-1552, ex-D-6 du 15/10)**
>
> Des agents proposeraient des modifications de la consigne qui cadre les fins de tour, chacune mesurée sur une part des cas tenue à l'écart. Aucune n'entrerait en service sans votre décision. L'étape 1 est livrée : 69 mutations, 94 % détectées (source : gains constatés de TF-1552 au registre), 26 restitutions refusées sur 26 toujours refusées. La dépense est chiffrée à environ 70 exécutions, 3,5 h, repère 70 $ au prix de liste (source : note du 13/10 de TF-1552 au registre, à vérifier au lancement). Le gain n'est pas garanti : une étude citée mesure une baisse de 1,3 point en moyenne pour des skills auto-écrits sans validation.
>
> **Recommandation : (a).** Source consultée : fiche de TF-1552, note du 13/10, `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md` section 5. L'étape 1 a produit les mesures que l'étude exigeait ; la dépense est bornée d'avance.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Autoriser la campagne sur la seule consigne de restitution, jugée à la revue, mesures en main | Élevé × moyen, environ 70 exécutions | Aucune mise en service sans vous, aucun oracle modifié |
| (b) Mesure seule : une session propose à la main, mesurée sur le même banc | Moyen × court | La boucle de proposition par agents n'est pas éprouvée |
| (c) Laisser en attente | Faible × court | La consigne n'évolue que par les corrections après refus |

> **Si rien n'est décidé** : (c), aucune dépense.

> **D-9 — Faut-il réécrire les deux règles de contrôle des pages perdues sur les deux postes ? (TF-1307, ex-D-12 du 15/10)**
>
> Deux règles du socle des pages HTML, « largeurs de contenu mélangées » et « doute invisible », écrites sur un poste et jamais publiées, ont disparu des deux postes et des sauvegardes. La perte est établie depuis le 14/10. La première a relevé 2 constats sur 41 pages le 14/09 ; la seconde n'a aucune mesure. Une autre règle porte aujourd'hui l'ancien numéro de la première.
>
> **Recommandation : (b).** Source consultée : fiche de TF-1307, note du 14/10. Seule la règle de largeurs a un chiffre de détection.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Réécrire les deux comme candidatures neuves, avec juge et essais dans les deux sens | Moyen × moyen | Ne récupère pas le texte perdu |
| (b) Réécrire la règle de largeurs, déclarer l'autre perdue | Faible × court | Le doute invisible reste sans contrôle |
| (c) Clore en déclarant la perte des deux | Faible × court | Aucun contrôle ne les remplace |

> **Si rien n'est décidé** : (c), la perte des deux est déclarée.

> **D-10 — Fournissez-vous les trois valeurs qui manquent pour démarrer le premier cas réel de publications ? (TF-1160, ex-D-13 du 15/10)**
>
> Le premier cas réel prévoit le profil LinkedIn du dirigeant, sur 4 semaines, une publication par semaine. L'objectif, les 2 personas, la ligne éditoriale, le calendrier et la première publication sont déposés chez le produit depuis le 21/09. Il manque trois faits qu'aucune IA ne peut poser sans les inventer : qui tient quel rôle sur chaque compte, l'export de départ des statistiques, et votre temps hebdomadaire actuel en minutes. La fiche de l'émetteur s'écrit en rôles, jamais avec un identifiant ni un mot de passe.
>
> **Recommandation : (a).** Source consultée : fiche de TF-1160, `references/RUN-RESEAU.md` étape 0, étude du 17/09 section 5. Sans le temps actuel en minutes, aucun gain ne se démontre.
>
> Comment faire : 1) répondre une ligne par compte, « compte ; qui tient quel rôle ; double facteur oui ou non ; ce qui se passe au départ d'une personne » ; 2) exporter les statistiques depuis l'écran Analytics de chaque compte et déposer le fichier dans le dossier des mesures du produit ; 3) donner un nombre de minutes par semaine, programmation comprise.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Fournir les trois valeurs maintenant, en une réponse | Moyen × court | L'accord de publication se donne ensuite, lot par lot |
| (b) Rôles et export seulement ; le temps se relève pendant la première semaine | Faible × court | La comparaison avant-après est affaiblie |
| (c) Reporter | Faible × court | Aucune publication, aucun gain mesuré |

> **Si rien n'est décidé** : (c), le dossier reste sans publication.

> **D-11 — Déclarez-vous décidés les quatre sujets arrivés les 15 et 16/10 ?**
>
> Tout sujet entre au registre en candidat ; seul votre mandat le fait passer en décidé. Les quatre touchent le pilot seul. TF-1830, score 10, coût payé : l'oracle de la boîte d'entrée ignore le répertoire passé sans `--registre` et juge `input\00-retours` à sa place ; le remède tient en une condition, ligne 903. TF-1837, score 9, coût payé : 228 déplacements en attente sous `output\04-plans` ont été annulés pendant deux recettes concurrentes, cause non identifiée. TF-1838, score 8 : un cas de la recette du hook d'ouverture échoue quand le relevé met moins de 1 300 ms. TF-1829, score 4 : le résumé R-47 de l'ouverture peut masquer un « DÉFAUT PERSISTANT » ; non reproduit, à mesurer d'abord sur un parc jetable.
>
> **Recommandation : (a).** Source consultée : `todo/TODO.jsonl` publié, créations de TF-1829, TF-1830, TF-1837 et TF-1838 ; `references/TODO-FORGE.md`, gouvernance. Les quatre sont dans le pilot, où la session a le droit permanent d'écrire et de publier.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Les quatre, par ordre de score ; TF-1829 commence par la mesure | Moyen × moyen | Rien chez un produit |
| (b) TF-1830 et TF-1837 seuls, les deux au coût payé | Faible × court | TF-1838 et TF-1829 restent candidats |
| (c) Aucun | Nul | Les quatre restent candidats |

> **Si rien n'est décidé** : (c), les quatre restent candidats.

> **D-12 — Faut-il classer les synthèses d'`output\04-plans\` par mois, au prix de relever le plafond de longueur des chemins ? (posée le 16/10, synthèse 20261016h)**
>
> Les autres archives sont classées en sous-dossiers depuis le 16/10. Classer les 333 synthèses par mois ferait dépasser à 51 chemins le plafond de 150 caractères, qui garde le dépôt clonable sous Windows : un clone a échoué sur 22 fichiers trop longs le 10/09. Un essai de ce classement est aussi le terrain de TF-1837.
>
> **Recommandation : (a).** Source consultée : synthèse 20261016h, `oracle-conformite-projet` rejoué le 16/10, 155 constats contre 206 avec le classement par mois.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Laisser `04-plans\` à plat | Nul | Le dossier reste long à parcourir |
| (b) Classer par mois et relever le plafond, `core.longpaths` exigé sur chaque poste | Moyen × court | Un clone sans `core.longpaths` échoue de nouveau |

> **Si rien n'est décidé** : (a), le dossier reste à plat.

## 4. Traité

La liste a été tirée du registre publié, sujet par sujet, dans sa dernière note et sa fiche de décision.

- **Registre lu sur l'état publié.** `git show origin/main:todo/TODO.jsonl`, plié par la même fonction que la vue (`todo/lib-action.mjs`, `actionDe`) : 15 sujets en « décision humaine », 1 en « geste humain » ; dernier événement le 16/10 à 09:31 UTC.
- **TF-1323, déjà tranché.** Votre réponse du 15/10 à D-3 retient l'option (b) : vous dites d'abord lesquels des cinq noms restés hors table sont sensibles, et l'histoire publiée n'est purgée que si l'un l'est, en une passe commune avec le sigle de D-1. Aucun nom n'est écrit ici ; ils vous sont représentés hors dépôt sur demande, action A-2.
- **Gestes que seul vous pouvez faire.** TF-1090, la rotation des identifiants publiés chez trois produits : le relevé d'ouverture compte 8 porteurs dans des dépôts qui ne les ignorent pas, dont des publiés. Le fichier `C:\dev\null` (13530 octets, source : relevé d'ouverture du 17/10), et deux répertoires non versionnés du parc, `Digit-AI - SaaS Tests` et `Digit-ai.fr`, dont la suppression est un geste humain (R-29).
- **Décisions des 15 et 16/10 déjà réglées.** D-2 de la synthèse 20261016g, la publication du pilot, est exécutée : les enregistrements sont sur `origin/main`. D-1 des synthèses 20261016c et 20261016f sont exécutées par les travaux qui ont suivi.

## 5. Non traité

- **Les décisions elles-mêmes.** Motif : la demande était de les lister ; aucune n'est appliquée.
- **La remesure des chiffres des fiches.** Motif : ils datent des notes du 15/10 et d'avant ; seule la taille du fichier `C:\dev\null` est relue ce matin, dans le relevé d'ouverture.
- **Le fichier des cinq noms présenté le 15/10.** Motif : il vivait dans le dossier temporaire d'une autre session ; je ne l'ai pas cherché, pour ne pas écrire ces noms dans ce tour.

## 6. Écarts à la lettre

Deux écarts, tous deux faits pour servir la demande de détail.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Lister les décisions | J'ai reposé en entier dix décisions déjà posées le 15/10 | La règle est de rappeler en une ligne une décision inchangée ; vous demandez le détail |
| Lister les décisions | J'ai lu le registre publié plutôt que la vue locale | Ce poste a 23 enregistrements de retard ; la vue locale omettait TF-1830, TF-1837 et TF-1838 |

## 7. Risques

- **Ce poste travaille sur un état périmé.**
  - Énoncé : le tirage d'ouverture a échoué, deux README locaux bloquent la mise à jour, et le poste a 23 enregistrements de retard.
  - Signal : « Poste NON prêt » au relevé d'ouverture.
  - Parade : action A-1, avant tout travail sur ces décisions.
- **Un lot attend au sas d'arrivée depuis 34 h.**
  - Énoncé : le relevé d'ouverture le classe bloquant ; son producteur croit son travail remonté.
  - Signal : la section « Boîte d'entrée » du relevé d'ouverture.
  - Parade : action A-3.

## 8. Prochaines actions

Vos décisions passent par la conversation : répondez par exemple « D-1 a, D-3 b ». Les actions auto_ia attendent votre accord.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Remettre ce poste à jour : mettre de côté les deux README générés, tirer le distant, régénérer les README | auto_ia | attend votre accord | `git stash push -- output/04-plans/README.md output/LISEZMOI.md` puis `node bootstrap.mjs --pull` | Tout travail part d'un état en retard de 23 enregistrements |
| **A-2** | TF-1323 | Vous représenter les cinq noms hors table dans un fichier hors dépôt | auto_ia | attend votre accord | Lecture de l'histoire de `todo/HERITAGE-RELEVES.jsonl` | La qualification ne peut pas se faire |
| **A-3** | `neuve` | Accueillir puis ingérer le lot resté au sas d'arrivée | auto_ia | attend votre accord | `node todo\accueillir-lot.mjs` puis `node todo\ingerer-lot.mjs <sidecar>` | Les retours d'un produit restent non traités |
| **A-4** | TF-1323 | Dire, nom par nom, si chacun des cinq noms est sensible | manuelle_utilisateur | decision | Répondre dans la conversation après A-2, par exemple « 1 oui, 2 non… » | Aucune purge ni inscription ne peut être décidée |
| **A-5** | TF-1090 | Faire la rotation des identifiants publiés chez les produits | manuelle_utilisateur | geste sur vos comptes | `node oracles/oracle-secrets-hors-perimetre.mjs` pour la liste, puis la console de chaque fournisseur | Des identifiants publiés restent valides |
| **A-6** | TF-1584 | Lire puis supprimer le fichier `C:\dev\null` | manuelle_utilisateur | suppression, geste humain (R-29) | `Get-Content C:\dev\null -TotalCount 20` puis `Remove-Item C:\dev\null` | Une page entière reste écrite hors de tout dépôt |
| **A-7** | `neuve` | Supprimer ou versionner les répertoires `Digit-AI - SaaS Tests` et `Digit-ai.fr` du parc | manuelle_utilisateur | suppression, geste humain (R-29) | Ouvrir `C:\dev` dans l'Explorateur et vérifier leur contenu avant de les supprimer | Ce qu'on y écrit n'est suivi par rien |
| **A-8** | `neuve` | Trancher D-1 à D-12 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | L'option de repli de chacune s'applique |

## 9. Traces

- Registre : `origin/main:todo/TODO.jsonl`, au commit f80ec0ac
- Plié par : `todo/lib-action.mjs`, fonction `actionDe`, sur une copie dans le dossier temporaire de la session
- Fiches de décision du 15/10 : `output/04-plans/Digit-AI - Synthese Mandat - Six travaux faits et onze fiches - 20261015l.md`, D-3 à D-13
- Décisions du 16/10 : synthèses 20261016c, 20261016f, 20261016g et 20261016h sur `origin/main`
- Relevé d'ouverture du 17/10 : `oracles/hook-ouverture.mjs`
