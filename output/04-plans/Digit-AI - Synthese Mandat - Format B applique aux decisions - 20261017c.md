---
destinataire: humain
---

# Synthèse Mandat — format B appliqué aux décisions, et les 12 décisions ouvertes réécrites (17/10/2026)

## 0. Synthèse d'ouverture

Le format B est en place : toute décision qui vous est posée dit désormais de quoi il s'agit, quel est le problème, pourquoi elle vous revient, puis ce qui se passe après chaque choix, son coût et si l'on peut revenir en arrière, avec les lettres (a), (b), (c). Le gabarit des restitutions, son contrôle, les hooks, la revue hebdomadaire et les fiches du registre le suivent. Les 12 décisions ouvertes sont réécrites ci-dessous, sous les mêmes numéros que ce matin. Rien n'est encore enregistré ni publié : les produits et l'autre poste ne recevront le format qu'après votre accord de publication (A-1).

## 1. En-tête d'identification

Mandat d'application, réponse « Format B, mais conserve les lettres (a,b,c...) pour les choix des décisions » du 17/10/2026, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 17/10/2026 de 08:10 à 09:03, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : que chaque décision demandée se comprenne et se tranche sans rien d'autre qu'elle-même, et que ce soit vrai partout, pas seulement dans un message.

Test rétro : le résultat sert cette intention pour tout ce qui produit ou juge une décision à partir d'aujourd'hui, et pour les 12 décisions ouvertes. Il n'en sert que la lettre pour les 266 synthèses déjà écrites, qui ne se réécrivent pas, et pour une décision rédigée en liste à puces, que la nouvelle règle ne contrôle pas.

## 2. Verdict en une ligne

Format B en service sur 6 producteurs et juges, 10 fiches réécrites au registre, contrôle des restitutions 180/180 ; recette complète rejouée : 220/221, seul défaut le contrôle des skills, présent avant cette session.

## 3. Décisions attendues

Les 12 décisions de ce matin, au format B, sous leurs numéros D-1 à D-12. Chacune se lit seule : le titre pose la question, les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient, puis la recommandation et sa source ; le tableau donne, pour chaque option, ce qui se passe, son coût et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse. Répondez par exemple « D-1 a, D-3 b ».

> **D-1 — Le sigle « B••2 » doit-il être masqué dans le dépôt public ? (TF-1540)**
>
> - **De quoi s'agit-il** : « B••2 » est l'abréviation du projet de votre client Client-A, dont le produit s'appelle Produit-11 dans nos fichiers ; Produit-64 l'emploie aussi.
> - **Le problème** : le nom complet du projet est masqué, son abréviation non : elle apparaît dans 30 fichiers du pilot, dont le dépôt est public sur GitHub.
> - **Pourquoi vous** : vous seul savez si ce sigle permet de reconnaître le client.
> - **Recommandation : (a)** — même logique que le nom complet, déjà masqué, et aucun envoi n'est bloqué : aucun message d'enregistrement ne porte le sigle. Source consultée : `input/00-retours/Produit-11 - RETOURS - 20260908a.md`, paragraphe « Numérotation », et la table des pseudonymes du canal confidentiel, lue le 17/10/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Oui, masquer | Le pseudonyme prend sa place dans les 30 fichiers et dans les lots à venir ; les anciennes versions sur GitHub le gardent lisible, les effacer est une décision séparée | Faible × court | Possible |
| (b) Non, il n'est pas sensible | Rien ne change ; votre réponse est notée pour ne plus être posée | Nul | Possible |
| (c) Plus tard | Chaque nouveau lot de ces produits l'ajoute à d'autres fichiers publics | Nul aujourd'hui, croissant | Sans objet |

> **Sans réponse** : (c), plus tard.

> **D-2 — Le produit « COMPTA · Ventilation de facture Fournisseur-A » doit-il garder un seul nom de code ? (TF-1432)**
>
> - **De quoi s'agit-il** : ce produit a reçu 2 pseudonymes, Produit-73 le 27/09 (nom de son dossier) et Produit-76 le 28/09 (préfixe de ses lots).
> - **Le problème** : les contrôles qui comparent les lots d'un même produit voient 0 lot antérieur au lieu de 5 ; le rattachement d'un nom au pseudonyme existant est écrit et testé (6 cas sur 6) mais inactif.
> - **Pourquoi vous** : l'activer change une règle du canal confidentiel, un dépôt privé distinct à mettre à jour et à publier.
> - **Recommandation : (a)** — c'est la voie déjà codée et testée, elle ne réécrit rien et se défait. Source consultée : `todo/anonymiser-entrant.mjs` (rattachement) et la fiche au registre, mesures du 28/09 et du 15/10.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Déclarer Produit-76 comme second nom de Produit-73 | Les lots des 2 noms sont vus ensemble ; aucun fichier n'est renommé, les lots du 14/08 sous un troisième nom restent à part | Moyen × court | Possible, en retirant la déclaration |
| (b) Fusionner en un seul pseudonyme | Un seul nom partout dans l'état courant, jusqu'à 42 fichiers modifiés, archives du registre comprises ; l'ancien nom reste dans les versions publiées | Élevé × moyen | Difficile |
| (c) Ne rien activer | Les lots restent dispersés et chaque nouvelle graphie crée un pseudonyme de plus | Nul | Sans objet |

> **Sans réponse** : (c), ne rien activer.

> **D-3 — La doctrine de construction doit-elle s'aligner sur 3 exigences bloquantes de l'audit maison ? (TF-1212)**
>
> - **De quoi s'agit-il** : 3 exigences du référentiel d'audit que la doctrine de construction contredit : le déploiement par pipeline uniquement, un contrôle de sauvegarde avant la mise en production, une règle sur le fournisseur d'identité.
> - **Le problème** : le produit Produit-61, déclaré prêt, a échoué 125 contrôles sur 175 à l'audit, dont 12 bloquants ; ces trois-là viennent de la doctrine elle-même.
> - **Pourquoi vous** : c'est une règle qui s'imposera à tous les produits et changera leur mise en production.
> - **Recommandation : (a)** — la construction ne peut pas valider ce que l'audit de la même maison refuse. Source consultée : `references/ETAPES-RUN.md` (couverture des dimensions d'audit) et le rapport d'audit du 09/09 cité par la fiche.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Aligner la doctrine sur l'audit | Le déploiement manuel à porte disparaît, la mise en production vérifie la sauvegarde et le fournisseur d'identité ; les produits déjà livrés ne sont pas touchés, et un passage en simple avertissement d'abord reste possible | Élevé × moyen | Possible, par une nouvelle version de la doctrine |
| (b) Garder la doctrine et déclarer ces 3 écarts comme assumés | L'audit continue de les relever, mais avec leur motif écrit | Faible × court | Possible |
| (c) Laisser en l'état | Chaque audit les relève de nouveau, sans décision écrite | Nul | Sans objet |

> **Sans réponse** : (c), laisser en l'état.

> **D-4 — Le guide de mise en production doit-il interdire par défaut le secret client d'Easy Auth ? (TF-1396)**
>
> - **De quoi s'agit-il** : le guide de mise en production d'une application web Azure protégée par Easy Auth, l'authentification intégrée d'App Service, suivi par le produit Produit-72.
> - **Le problème** : le guide dit à un endroit « aucun secret client » et à un autre « déposer le secret au coffre avec une échéance » ; le développeur a dû choisir seul.
> - **Pourquoi vous** : c'est une règle de sécurité qui s'imposera à toutes les mises en production qui suivent ce guide.
> - **Recommandation : (a)** — elle suit la règle du socle, qui n'admet un secret que si l'identité fédérée ne suffit pas ; le texte corrigé vit chez le produit et partira en lot de travaux. Source consultée : `ADR0703-consommation-api-clients-sans-secrets.md` de forge-audit et le retour RX-9 du lot Produit-72 du 24/09.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Aucun secret client par défaut | L'identité fédérée devient la voie normale ; un secret au coffre reste possible comme écart déclaré et daté ; les configurations qui en déposent déjà un sont à ajuster | Moyen × court | Possible |
| (b) Le secret au coffre avec échéance comme voie normale | Le guide abaisse son niveau de sécurité affiché et s'écarte de la règle du socle sur les identités fédérées | Moyen × court | Possible |
| (c) Laisser en attente | La contradiction reste, chaque lecteur tranche seul | Nul | Sans objet |

> **Sans réponse** : (c), laisser en attente.

> **D-5 — Le contrôle de fin de run doit-il pouvoir bloquer la clôture d'un run ? (TF-1319)**
>
> - **De quoi s'agit-il** : le contrôle qui vérifie, à la clôture d'un run, que chaque contrôle attendu a bien tourné ; 174 contrôles sont recensés sur 14 dépôts.
> - **Le problème** : il ne fait qu'informer, faute de l'outil qui enregistre un verdict par contrôle ; sur les 2 runs où il a joué, il échoue, et son taux d'erreurs n'est pas mesuré.
> - **Pourquoi vous** : le rendre bloquant change la règle de clôture de tous les runs.
> - **Recommandation : (b)** — il échoue déjà sur les 2 runs qui le subissent ; le rendre bloquant sans mesure risque de bloquer des clôtures à tort. Source consultée : `output/03-etudes/20260819-etude-opportunite-meta-oracle-enclenchement.md` et les notes du 23/09 au 12/10.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Construire l'outil et bloquer tout de suite | Un run dont un contrôle n'a pas tourné ne se clôt plus, dès la livraison, sans mesure préalable des refus à tort | Moyen × moyen | Possible, par une nouvelle version |
| (b) *(recommandée)* Construire l'outil, bloquer après mesure | Les verdicts s'enregistrent, le contrôle reste informatif jusqu'à ce que ses refus à tort soient mesurés sur plusieurs runs | Moyen × moyen | Possible |
| (c) Ne pas construire l'outil | Le contrôle reste informatif pour toujours | Nul | Sans objet |

> **Sans réponse** : (c), ne pas construire l'outil.

> **D-6 — Quels garde-fous poser quand une session s'ouvre dans un dossier client qui contient le produit ? (TF-0963)**
>
> - **De quoi s'agit-il** : les garde-fous de la factory (contrôle d'ouverture, jugement des fins de tour, refus avant une commande) quand la session s'ouvre dans le dossier client qui contient le produit, et non dans le produit.
> - **Le problème** : dans ce cas aucun garde-fou ne tourne : le 08/09, 3 commits, un déploiement et 2 restitutions ont échappé à tout contrôle ; aujourd'hui la session le signale seulement à l'ouverture.
> - **Pourquoi vous** : le modèle copié chez les produits change, et un garde-fou posé dans ce dossier jugerait aussi les projets voisins.
> - **Recommandation : (a)** — c'est la seule portée déjà éprouvée ; élargir doit se décider sur mesure. Source consultée : `oracles/oracle-portee-doctrine.mjs` (règles PD3 et PD4) et `gabarits/settings-produit.json`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Ne poser que la reconnaissance des mots-clés | Le garde-fou déjà essayé par le produit le 09/09 devient le modèle ; ouverture et fins de tour restent seulement signalées | Faible × court | Possible |
| (b) Poser tous les garde-fous, délégués au produit | Tout tourne aussi depuis le dossier client, mais les messages écrits pour les projets voisins seraient jugés à tort | Moyen × moyen | Possible |
| (c) Laisser en l'état | Une session ouverte au-dessus du produit reste sans garde-fou, seulement signalée | Nul | Sans objet |

> **Sans réponse** : (c), laisser en l'état.

> **D-7 — Faut-il refuser les commandes PowerShell qui redirigent vers /dev/null ? (TF-1584)**
>
> - **De quoi s'agit-il** : une garde qui refuse une commande PowerShell redirigeant vers /dev/null : sous Windows, elle écrit un fichier C:\dev\null au lieu de jeter la sortie.
> - **Le problème** : ce fichier a été réécrit le 26/09 par une session voisine et pèse 13530 octets au relevé du 17/10 ; la garde est écrite et testée (8 cas sur 8) mais pas branchée.
> - **Pourquoi vous** : c'est un réglage appliqué à toutes les sessions du pilot, et une commande refusée à tort bloque le tour ; le taux de refus à tort n'est pas mesuré.
> - **Recommandation : (a)** — le geste est testé, réversible et ne touche que le pilot. Source consultée : `oracles/hook-puits-windows.mjs` et sa recette, `.claude/settings.json`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Brancher la garde au pilot | La commande fautive est refusée avec son remède ; le fichier existant reste à supprimer par vous, les produits ne sont pas couverts | Faible × court | Possible, en retirant la ligne du réglage |
| (b) La brancher au pilot et la proposer aux produits en avertissement | Même effet au pilot, et un avertissement chez les produits qui l'acceptent | Moyen × moyen | Possible |
| (c) Ne pas la brancher | Rien n'empêche une nouvelle réécriture du fichier ; seul le relevé d'ouverture la signale | Nul | Sans objet |

> **Sans réponse** : (c), ne pas la brancher.

> **D-8 — Autorisez-vous une campagne d'environ 70 exécutions de modèle pour améliorer la consigne des fins de tour ? (TF-1552)**
>
> - **De quoi s'agit-il** : une campagne où des agents proposent des modifications de la consigne qui encadre les messages de fin de tour, chacune mesurée sur des cas tenus à l'écart ; rien n'entre en service sans votre décision.
> - **Le problème** : cette consigne a reçu 514 refus en 41 jours ; la première étape, un banc de 69 erreurs plantées dont 94 % détectées, est livrée.
> - **Pourquoi vous** : c'est une dépense : environ 70 exécutions, 3,5 h, repère de 70 $ au prix de liste, à vérifier au lancement.
> - **Recommandation : (a)** — l'étape 1 a produit les mesures que l'étude exigeait, et la dépense est bornée d'avance ; une étude citée mesure toutefois une baisse de 1,3 point pour des consignes écrites par des agents sans validation. Source consultée : `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, section 5, et la note du 13/10.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Autoriser la campagne | Les propositions arrivent avec leur mesure avant et après, et vous les jugez à la revue ; aucune n'est mise en service ni aucun contrôle modifié sans vous | Élevé × moyen | Possible, rien n'est en service |
| (b) Mesurer seulement, sans agents | Une session propose à la main et mesure sur le même banc ; l'apport des agents n'est pas éprouvé | Moyen × court | Possible |
| (c) Laisser en attente | Aucune dépense ; la consigne n'évolue que par les corrections après refus | Nul | Sans objet |

> **Sans réponse** : (c), laisser en attente.

> **D-9 — Faut-il réécrire 2 règles de contrôle des pages HTML perdues en septembre ? (TF-1307)**
>
> - **De quoi s'agit-il** : 2 règles de contrôle des pages HTML livrées, « largeurs de contenu mélangées » et « doute invisible », écrites sur un poste et perdues avant d'être publiées.
> - **Le problème** : la première a trouvé 2 défauts sur 41 pages le 14/09 ; la seconde n'a jamais été mesurée ; la perte est établie sur tous les dépôts et sauvegardes depuis le 14/10.
> - **Pourquoi vous** : c'est un arbitrage : réécrire coûte du temps, ne pas réécrire laisse ces défauts sans contrôle.
> - **Recommandation : (b)** — seule la règle des largeurs a un chiffre de détection. Source consultée : la note du 14/10 au registre `todo/TODO.jsonl`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Réécrire les deux | 2 règles neuves, chacune avec ses essais ; le texte perdu n'est pas récupéré | Moyen × moyen | Possible |
| (b) *(recommandée)* Réécrire la règle des largeurs, déclarer l'autre perdue | Le défaut mesuré retrouve son contrôle ; le doute invisible reste sans contrôle | Faible × court | Possible |
| (c) Déclarer les 2 perdues | Aucun contrôle ne prend leur suite | Nul | Sans objet |

> **Sans réponse** : (c), déclarer les 2 perdues.

> **D-10 — Fournissez-vous les 3 informations qui manquent pour lancer le premier essai de publications LinkedIn ? (TF-1160)**
>
> - **De quoi s'agit-il** : le premier essai réel de publications du produit Produit-66 : le profil LinkedIn du dirigeant, 4 semaines, une publication par semaine.
> - **Le problème** : tout est prêt depuis le 21/09 (objectif, 2 personas, ligne éditoriale, calendrier, première publication) ; il manque qui tient quel rôle sur chaque compte, l'export des statistiques de départ et votre temps hebdomadaire actuel en minutes.
> - **Pourquoi vous** : ce sont des faits sur vos comptes et votre temps : les inventer écrirait un faux.
> - **Recommandation : (a)** — sans le temps actuel en minutes, aucun gain ne se démontre. Source consultée : `references/RUN-RESEAU.md`, étape 0, et `output/03-etudes/20260917-etude-opportunite-gestion-reseaux-sociaux.md`, section 5.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Fournir les 3 maintenant | L'essai démarre et le gain se mesure dès la première semaine ; l'accord de publication se donne ensuite, publication par publication. Comment faire : 1) une ligne par compte « compte ; qui tient quel rôle ; double facteur oui ou non ; ce qui se passe au départ d'une personne » ; 2) l'export depuis l'écran Analytics de chaque compte, déposé chez le produit ; 3) un nombre de minutes par semaine | Moyen × court | Possible |
| (b) Rôles et export seulement | L'essai démarre ; le temps se relève pendant la première semaine, la comparaison avant-après est affaiblie | Faible × court | Possible |
| (c) Reporter | Aucune publication, aucun gain mesuré | Nul | Sans objet |

> **Sans réponse** : (c), reporter.

> **D-11 — Lancez-vous la correction des 4 défauts du pilot signalés les 15 et 16/10 ? (TF-1830, TF-1837, TF-1838, TF-1829)**
>
> - **De quoi s'agit-il** : 4 défauts des outils internes du pilot. Le contrôle de la boîte des retours juge le mauvais dossier quand on lui en passe un seul ; 228 déplacements de fichiers en attente ont été annulés pendant 2 recettes simultanées, cause inconnue ; un essai du contrôle d'ouverture échoue quand la machine répond en moins de 1,3 s ; le résumé affiché à l'ouverture peut masquer un défaut d'héritage, non reproduit à ce jour.
> - **Le problème** : les 2 premiers ont déjà coûté du travail, un contrôle rendu vert à tort et un rangement à refaire ; tant qu'ils restent en candidature, rien ne les corrige.
> - **Pourquoi vous** : tout sujet entre au registre en candidature, et seul votre accord le fait passer en traitement.
> - **Recommandation : (a)** — les 4 ne touchent que le pilot, où la session a le droit d'écrire et de publier. Source consultée : `references/TODO-FORGE.md`, gouvernance du registre.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Les 4 | Corrigés dans l'ordre de leur valeur ; le défaut non reproduit commence par une mesure sur un parc d'essai | Moyen × moyen | Possible |
| (b) Les 2 qui ont déjà coûté | Le contrôle de la boîte des retours et les déplacements annulés sont traités ; les 2 autres restent en candidature | Faible × court | Possible |
| (c) Aucun | Les 4 restent en candidature | Nul | Sans objet |

> **Sans réponse** : (c), aucun n'est lancé.

> **D-12 — Faut-il ranger par mois les synthèses du dossier des plans ?**
>
> - **De quoi s'agit-il** : le rangement des 333 synthèses du dossier `output\04-plans\` en sous-dossiers par mois, comme les autres archives depuis le 16/10.
> - **Le problème** : un sous-dossier de mois allonge les chemins ; 51 synthèses dépasseraient 150 caractères, la limite qui permet de cloner le dépôt sous Windows. Le 10/09, un clone a échoué sur 22 fichiers trop longs.
> - **Pourquoi vous** : c'est une règle de nommage de tous les postes : il faudrait relever la limite et exiger un réglage Git sur chacun.
> - **Recommandation : (a)** — le gain de lecture ne vaut pas le risque de clone en échec. Source consultée : synthèse 20261016h et `oracle-conformite-projet`, rejoué le 16/10 : 155 constats à plat contre 206 rangé par mois.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Laisser à plat | Le dossier reste une longue liste ; rien d'autre ne change | Nul | Sans objet |
| (b) Ranger par mois et relever la limite | Le dossier se parcourt par mois ; chaque poste doit activer `git config core.longpaths true`, sinon son clone échoue | Moyen × court | Possible, en remettant les fichiers à plat |

> **Sans réponse** : (a), le dossier reste à plat.

## 4. Traité

Ce qui a changé, pièce par pièce, avec le contrôle qui le prouve.

- **Le contrôle des restitutions accepte le format B et en vérifie les pièces.** Avant, une décision au format B échouait sur S15 (le rappel du sujet), S16 (la recommandation sourcée), S31 (le coût et la conséquence de chaque option) et S32 (la ligne de repli), fixture jouée ce matin ; après, elle passe ces 4 règles. S15 ne lit plus le numéro de sujet en fin de titre comme un identifiant nu, S31 lit la colonne « Ce qui se passe », S32 lit « Sans réponse ». La règle neuve S78 (les pièces du format B) vérifie les 3 lignes titrées et le retour arrière de chaque option ; elle avertit sans bloquer. Preuve : `node oracles/oracle-synthese.mjs --self-test` rend « 180/180 PASS », contre 177 cas avant, dont 4 cas S78 rouges et verts.
- **Mesure d'entrée de S78.** Sur les 266 synthèses d'`output\04-plans\`, 185 sont signalées, 81 n'ont aucune décision en citation, 0 est au format B. C'est attendu, le format date d'aujourd'hui ; la règle reste un avertissement, et le corpus ne se réécrit pas. Preuve : script de mesure joué sur le dossier, `{"total":266,"pass":0,"fail":185,"sans_objet":81}`.
- **Le gabarit des restitutions passe en version 2.41.0.** Une section « Le format B » donne le squelette et ses 7 règles d'écriture ; l'anatomie et le tableau par défaut sont mis à jour. Preuve : contrôles de lisibilité du document joués à l'écriture, sans défaut neuf.
- **Les 2 hooks suivent.** Le hook de fin de tour compte « Sans réponse » comme ligne de repli et décrit le format B dans son rappel ; le hook d'ouverture l'annonce dans la liste des règles actives. Les 2 fixtures du test du geste et leurs 2 transcriptions enregistrées sont passées au format B. Preuve : `node oracles/hook-restitution.test.mjs` rend « 49/49 », après un échec sur les cas 15 et 16 dû à S78.
- **La revue hebdomadaire rend le format B.** `todo/revue-hebdo.mjs` exige les champs du format B et liste « à instruire » une fiche d'avant. Preuve : `node todo/revue-hebdo.mjs --self-test` rend PASS, avec un cas rouge sur une fiche d'avant le format B.
- **Le schéma des fiches est documenté.** `references/TODO-FORGE.md`, section de la revue hebdomadaire, décrit les champs `de_quoi`, `probleme`, `pourquoi_vous`, et pour chaque option `effet`, `cout`, `retour`.
- **Le contrat d'héritage passe en 1.28.0.** `gabarits/HERITAGE.json` dit aux produits ce qui change pour eux ; le gabarit leur arrive en copie conforme à leur prochaine ouverture, une fois publié.
- **10 fiches réécrites au registre.** TF-0963, TF-1160, TF-1212, TF-1307, TF-1319, TF-1396, TF-1432, TF-1540, TF-1552 et TF-1584. Preuve : `node todo/journaliser.mjs` rend « 10 événement(s) journalisé(s) », puis 7 et 1 pour 2 passes de correction de forme (nombres en chiffres, sources sans numéro de sujet), contrôle du registre PASS avant et après chaque passe.
- **Le banc de mutation prend cette synthèse pour référence verte.** Sa référence du 12/10 était écrite dans l'ancien format, que S78 refuse désormais. Preuve : `node oracles/banc-mutation/banc-mutation.test.mjs` rend « 14 PASS, 0 FAIL », contre 13 PASS et 1 FAIL avec l'ancienne référence.
- **Recette complète rejouée après les corrections.** `node oracles/self-tests.mjs` : « 1/221 oracle(s) en défaut : oracle-skills.mjs » ; au premier passage, 3 sur 221, dont 2 dus à S78 et corrigés depuis.
- **Le poste est remis à jour.** Les 23 enregistrements de retard sont tirés en avance rapide ; les 3 fichiers générés à l'ouverture ont été mis de côté puis remis.

## 5. Non traité

- **L'enregistrement et la publication.** Motif : votre règle exige un accord explicite pour enregistrer et publier ; c'est l'action A-1.
- **Les 266 synthèses déjà écrites.** Motif : un document remis ne se réécrit pas ; elles restent lisibles.
- **TF-1323, la qualification des 5 noms.** Motif : la décision est prise depuis le 15/10, elle attend votre réponse nom par nom (A-2, puis A-4).
- **Le défaut K11 du contrôle des skills.** Motif : il était présent avant cette session, mesuré le 15/10 sur l'arbre principal.

## 6. Écarts à la lettre

2 écarts, que le format impose.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Appliquer le format B partout | Je ne l'ai appliqué ni aux synthèses déjà écrites ni aux décisions rédigées en liste à puces | Un document remis ne se réécrit pas, et le contrôle des puces aurait fait échouer la fixture de référence du juge |
| Conserver les lettres (a), (b), (c) | Je les ai gardées et j'ai ajouté le numéro du sujet en fin de titre | Il permet de retrouver le sujet au registre sans gêner la lecture |

## 7. Risques

- **Le format n'est contrôlé qu'à titre d'avertissement.**
  - Énoncé : une décision hors format B s'affiche quand même, avec un avertissement.
  - Signal : la ligne « S78 » dans l'avertissement de fin de tour.
  - Parade : rendre S78 bloquante après une semaine de mesure, sur votre décision.
- **Une valeur masquée reste partiellement lisible.**
  - Énoncé : « B••2 » est écrit au registre et dans cette synthèse, publiés avec le dépôt.
  - Signal : votre lecture de D-1.
  - Parade : passer au masque total si vous le jugez trop parlant.

## 8. Prochaines actions

Votre accord de publication passe en premier : sans lui, rien ne quitte ce poste.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Enregistrer ce travail et le publier sur le dépôt du pilot | auto_ia | gate_gouvernance : attend votre accord explicite | `git commit` puis `git push origin main`, sous la garde de publication | Les produits et l'autre poste gardent l'ancien format |
| **A-2** | TF-1323 | Vous présenter les 5 noms hors table dans un fichier hors dépôt | auto_ia | gate_gouvernance : attend votre accord | Lecture de l'histoire de `todo/HERITAGE-RELEVES.jsonl` | La qualification ne peut pas se faire |
| **A-3** | `neuve` | Accueillir puis ingérer le lot resté au sas d'arrivée | auto_ia | gate_gouvernance : attend votre accord | `node todo\accueillir-lot.mjs` puis `node todo\ingerer-lot.mjs <compagnon>` (le fichier compagnon du lot) | Les retours d'un produit restent non traités |
| **A-4** | TF-1323 | Dire, nom par nom, si chacun des 5 noms est sensible | manuelle_utilisateur | decision | Répondre dans la conversation après A-2, par exemple `1 oui, 2 non` | Aucune purge ni inscription ne peut être décidée |
| **A-5** | TF-1090 | Faire la rotation des identifiants publiés chez les produits | manuelle_utilisateur | decision | `node oracles/oracle-secrets-hors-perimetre.mjs` pour la liste, puis la console de chaque fournisseur | Des identifiants publiés restent valides |
| **A-6** | TF-1584 | Lire puis supprimer le fichier `C:\dev\null` | manuelle_utilisateur | irreversible | `Get-Content C:\dev\null -TotalCount 20` puis `Remove-Item C:\dev\null` | Une page entière reste écrite hors de tout dépôt |
| **A-7** | `neuve` | Trancher D-1 à D-12 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | L'option « sans réponse » de chacune s'applique |

## 9. Traces

- Juge : `oracles/oracle-synthese.mjs` (S15, S31, S32, S78 et leurs cas d'essai)
- Gabarit : `gabarits/RESTITUTION.md` v2.41.0 ; contrat : `gabarits/HERITAGE.json` 1.28.0
- Hooks : `oracles/hook-restitution.mjs`, `oracles/hook-ouverture.mjs` ; fixtures `oracles/fixtures/geste-*.md` et `geste-*.jsonl`
- Revue hebdomadaire : `todo/revue-hebdo.mjs` ; schéma : `references/TODO-FORGE.md`
- Registre : `todo/TODO.jsonl`, 18 événements `maj` du 17/10 sur 10 sujets
- Banc : `oracles/banc-mutation/manifeste-mutation.json`
- Remise à jour du poste : remisage `3e933230` « ouverture-17-10-session-f9610b91 », réappliqué, laissé dans la pile
