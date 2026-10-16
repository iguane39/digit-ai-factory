---
destinataire: humain
role: restitution de fin de tour, décisions « 26a, 25a, 24b, 15b, 17a, 18a, 19a, 20a, 21b » du 26/09/2026
sources_de_verite: git des 16 dépôts gouvernés · todo/TODO.jsonl · output/04-plans/Digit-AI - Synthese Mandat - Parc synchronise et decisions des deux postes - 20260925a.md (les neuf décisions tranchées)
verifie_le: 2026-09-27
---

# Digit-AI — Synthèse de mandat — Neuf décisions exécutées, publiées et propagées — 27/09/2026

## 0. Synthèse d'ouverture

Vos 9 décisions d'hier sont exécutées, publiées sur GitHub et propagées sur ce poste. Ce que
cela change pour vous : une restitution qui vous demande d'agir sur l'écran d'un service extérieur
doit désormais citer la documentation officielle et le jour où elle a été lue, et, quand vous
demandez la marche à suivre, vous guider pas à pas en tête du message. Le journal de run refuse les
entrées vides, et les compétences installées ne se propagent plus sans contrôle de leur en-tête.
Ce qui est attendu de vous : 3 décisions neuves — accueillir 3 lots de retours arrivés pendant ce
travail, dont le premier attend depuis plus d'un jour, poser les gardes de publication sur ce poste,
traiter une adresse personnelle trouvée dans le dépôt public — puis les 3 suppressions laissées
avant-hier, toujours ouvertes.

## 1. En-tête d'identification

- **quoi** — exécution des 9 décisions de votre message « 26a, 25a, 24b, 15b, 17a, 18a, 19a,
  20a, 21b », posées par la synthèse du 25/09, puis publication et propagation.
- **sur quoi** — le pilot `digit-ai-factory`, 6 forges (`digit-ai-forge-agents`, `-audit`,
  `-conception`, `-design`, `-organization`, `-tests`) et le canal confidentiel ; aucun dépôt de
  produit n'a été modifié.
- **quand** — message reçu le 26/09/2026 à 08:27 (UTC+02:00) ; travail le 26/09 de 08:27 à 10:31,
  puis le 27/09 de 08:00 à 11:00, heures relevées au journal de la session ; la fin est l'heure de
  dépôt de cette synthèse, son envoi suit.
- **qui** — session de pilotage Claude Opus 5.5 ; 7 agents de campagne, un par dépôt : 6 forges
  le 26/09, forge-agents de nouveau le 27/09. Escalade de modèle : une, la campagne forge-agents du
  26/09, 9 items de construction, lancée sur Claude Opus 5.5 selon le routage « construction
  complexe » ; les 6 autres sur Claude Sonnet 5, le défaut. Pilot passé de `d47b566e` à `aa0f5f24`.
- **intention** — que chaque décision produise son effet dans le parc, mesuré, publié et propagé,
  sans publier un nom protégé et sans décider à votre place ce qui ne l'a pas été.
  **Test rétro** : servie. Chaque décision porte au bloc 4 la preuve exécutée de son geste ; les
  portes des noms sont PASS sur ce qui est parti. 2 restes sont dits au bloc 5 plutôt que
  maquillés en fait : le kit Google Ads à capitaliser, et le troisième volet de D-18, qui attend un
  outil non décidé.

## 2. Verdict en une ligne

**9 décisions exécutées sur 9** · **30 items clos** au registre sur preuve, 3 en cours, **6
candidatures neuves** · 15 dépôts sur 16 à égalité avec GitHub, le pilot par l'envoi qui emporte
cette synthèse · portes des noms **PASS** (0 bloquant) · harnais du pilot **1/164** en défaut, la
recette connue de reconstruction de clone (TF-1231) · banc des restitutions **71/71**, recette du
hook **37/37**, recette du démarrage **19/19**.

## 3. Décisions attendues de l'humain

Les 3 bloquants qui retiennent un geste de suppression, énoncés ici en entier :

- **Le remisage local du 24/09 au soir ne se supprime pas sans vous**, en vertu de la règle
  R-29 (une suppression reste un geste humain décidé). Il porte des relevés d'héritage écrits par un
  code en retard, avec 2 noms réels de produits ; c'est lui, et lui seul, qui fait refuser la porte des
  noms jouée sur le dossier du pilot. Pour le lever : vérifier par
  `git -C C:/dev/digit-ai-factory stash list` qu'il est en tête, libellé « Releves locaux du
  22-24/09 », puis lancer `git -C C:/dev/digit-ai-factory stash drop stash@{0}`. Si rien n'est fait :
  chaque envoi du pilot doit être jugé sur un paquet de la seule branche envoyée, comme ce tour l'a
  fait, et la garde de publication de D-27 ne peut pas être posée sur le pilot.
- **Le fichier « null » à la racine du parc ne se supprime pas sans vous**, pour la même règle. Il a
  changé depuis avant-hier : une autre session l'a réécrit le 26/09 à 11:49, en croyant jeter la
  sortie d'une commande. Il pèse 13 530 octets, c'est la page « introuvable » d'un site de produit,
  et il ne porte aucune chaîne à forme de jeton — 2 chaînes longues de 36 caractères,
  sans préfixe de jeton connu. Pour le lever : l'ouvrir, vérifier, puis le supprimer.
  Si rien n'est fait : le relevé d'ouverture le signale à chaque session.
- **L'arborescence liée laissée par un agent le 14/09 ne se retire pas sans vous**, pour la même
  règle. Sa branche est déjà fusionnée. Pour la lever :
  `git -C C:/dev/digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`,
  puis `git -C C:/dev/digit-ai-factory branch -d worktree-agent-ac087535fe0698917`. Si rien n'est
  fait : le pilot garde un dossier non suivi, compté à chaque ouverture.

Comment lire les tableaux : chaque tableau porte une option par ligne ; la colonne Coût dit la
complexité et la durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et sa
source précèdent le tableau ; la ligne « Si rien n'est décidé » le suit. Pour répondre, un sélecteur
suffit, par exemple « D-29 a, D-27 b, D-28 a ». Les 3 décisions sont neuves ; aucune des 9 que
vous avez tranchées n'est reposée. D-29 vient en tête parce qu'elle est pressée.

> **D-29 — Voulez-vous que j'accueille et ingère maintenant les 3 lots de retours arrivés au sas du pilot les 26 et 27/09, dont le premier a passé ce matin le délai de 24 heures ?**
>
> Le produit du lot de D-26, pseudonymisé Produit-68, a déposé 3 nouveaux lots dans
> `input\00-retours\_arrivee\`, le sas d'arrivée du pilot : le 26/09 à 10:35 et à 13:53, puis ce
> matin à 08:37. Le contrôle de la boîte d'entrée rend déjà un échec, règle B9 : le plus ancien attend
> depuis plus de 24 heures, et un lot qui attend au-delà n'est plus une arrivée mais un oubli.
> Accueillir pseudonymise le nom et le contenu ; ingérer inscrit les retours au registre comme
> candidatures, sans rien décider. Je ne l'ai pas fait : votre décision D-26 visait le lot du 24/09.
>
> **Recommandation : (a).** Source consultée : `oracles/oracle-boite-entree.mjs`, règle B9, rejoué à
> 10:57, et votre décision D-26 (a) du 26/09 pour le lot précédent du même produit. Accueillir ne
> décide rien : les candidatures qui en naissent vous attendront comme les autres.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* J'accueille puis j'ingère les 3 lots après les avoir confrontés au registre, et je publie l'enregistrement | simple × court | aucune |
| **(b)** Les laisser au sas jusqu'à un mandat qui le demande | nul | le contrôle de la boîte d'entrée rend un échec à chaque ouverture, et le deuxième lot passe le délai à 13:53 |

> **Si rien n'est décidé** : (b).

> **D-27 — Faut-il poser, sur les dépôts de ce poste, la garde de publication que la forge des agents fournit, pour que chaque envoi vers GitHub soit jugé sans geste de ma part ?**
>
> Aucun des 44 dépôts de ce poste ne porte aujourd'hui la garde qui juge un envoi avant son départ :
> avant chacun des envois de ce tour, j'ai joué à la main la porte des noms sur un paquet de la
> branche et le classement des enregistrements. La correction du 26/09 a rendu cette garde sûre même
> quand la sortie d'un envoi part dans un filtre qui échoue — le cas où, le 24/09, 13 envois sont
> partis malgré son refus. Elle se pose par `installer-hamecon-publication.mjs`, qui modifie la
> configuration locale de chaque dépôt, et la même commande la retire.
>
> **Recommandation : (b).** Sources consultées : la fiche des gardes de publication au registre
> `todo/TODO.jsonl`, qui porte le relevé du 26/09 — aucun des 44 dépôts de ce poste ne porte la
> garde d'envoi du parc ; la porte des noms jouée sur le dossier du pilot, refusée à cause de son
> remisage (synthèse du 25/09). Poser la garde sur le pilot avant le retrait du remisage ferait
> refuser tous ses envois.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Poser la garde sur les 16 dépôts gouvernés, pilot compris, dès maintenant | simple × court | tant que le remisage existe, tout envoi du pilot est refusé |
| **(b)** *(recommandée)* La poser sur les 15 dépôts gouvernés hors pilot maintenant, puis sur le pilot après le retrait du remisage | simple × court | le pilot reste jugé à la main jusqu'à ce retrait |
| **(c)** Ne rien poser | nul | chaque envoi reste jugé par la seule discipline de la session qui l'émet |

> **Si rien n'est décidé** : (c).

> **D-28 — Que faire de l'adresse électronique d'une personne, publiée depuis le 22/08 dans 2 fichiers du dépôt public du pilot ?**
>
> Le relevé des noms de personnes livré le 26/09 l'a trouvée à son premier passage : l'initiale et
> le nom d'une personne, devant un domaine déjà pseudonymisé, dans une candidature archivée,
> `input/01-candidatures/old/candidature-question-deja-repondue.tf.jsonl`, et dans l'archive du
> registre, `todo/TODO-ARCHIVE.jsonl`. Le dépôt du pilot est public. Je ne la recopie nulle part. La
> retirer de l'état courant est réversible ; l'effacer des enregistrements déjà publiés exige de
> réécrire l'historique et de le republier en force.
>
> **Recommandation : (a).** Sources consultées : le bloc de la borne de date de la porte des noms,
> `oracle-nom-client-publie.mjs` (une porte qui condamne un passé qu'on ne peut plus corriger sans
> réécrire l'histoire ne protège plus rien) et votre décision D-15 (b), qui a déjà fait réécrire
> l'archive du registre pour 3 noms. Inscrire l'adresse à la table la rend bloquante partout où elle
> réapparaîtrait.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* La remplacer par un pseudonyme dans les 2 fichiers, archive du registre comprise, et l'inscrire, datée du jour, à la table des noms interdits du canal | simple × court | elle reste lisible dans les enregistrements publiés depuis le 22/08 |
| **(b)** Faire (a), puis réécrire l'historique du pilot et le republier en force | complexe × moyen | les 2 postes reconstruisent leur clone ; quatrième réécriture d'historique du pilot |
| **(c)** Ne rien faire | nul | l'adresse reste dans l'état courant et dans l'historique publics |

> **Si rien n'est décidé** : (c).

## 4. Traité

Chaque décision, avec la preuve exécutée de son geste :

- **D-26 (a)** — le lot du sas a été accueilli et ingéré le 26/09 : 5 candidatures TF-1368 à
  TF-1372 au registre, pseudonymisées, `oracle-todo` exit 0, sas d'arrivée vide ; publié (`3ad9b327`).
- **D-15 (b)** — les 3 noms absents de tout message d'enregistrement sont inscrits à la table du
  canal comme Produit-73 à Produit-75, datés du 27/09 (canal `98023fe`, `oracle-confidentiel`
  7/7) ; leurs 40 occurrences sont pseudonymisées dans 13 fichiers du pilot, archive du registre
  comprise (`80f70e1a`) : 0 occurrence restante, `oracle-todo` PASS, porte des noms PASS.
- **D-17 (a)** — B2 et B7 restent manuels avec leur motif, B4 sans durée par défaut ; la chaîne de
  traduction et le gabarit du glossaire le disent (`864d1051`) ; TF-1318 clos.
- **D-18 (a)** — premier volet : le juge de l'enclenchement se joue à la clôture du run, à titre
  informatif (`551b19fe`). Second volet : le schéma 1.1 du journal de run rend obligatoire la liste
  des forges mobilisées, un journal en 1.0 restant jugé selon ses règles (forge-agents `4af8a07`,
  documenté par `8899d50d`). Le troisième volet attend l'outil nommé au bloc 5.
- **D-19 (a)** — les 12 candidatures du 23/09 sont closes sur preuve : TF-1326 (lanceur des
  oracles, SKIP motivé sans Python), TF-1327 (produit de marque sorti des balayages de forges,
  `oracle-empreintes` FAIL puis PASS sur le parc), TF-1328 et TF-1329 (table des produits datée,
  banc 10/10 contre 8/10), TF-1330 (sceaux, recette 20/20, 48 sceaux réels sans écart), TF-1331
  (catalogue de traductions sous un dossier de build), TF-1332 (4 citations et comptes
  périmés), TF-1333 (4 octets de contrôle, `oracle-pieges-regex` 2 constats puis 0), TF-1334
  (registre des oracles 2.27.0, 23 chemins absolus retirés), TF-1335 (manifeste de conception),
  TF-1336 (parité des filtres FAIL puis PASS) et TF-1337 (en-tête des skills jugé avant propagation).
- **D-20 (a)** — les index d'`output` ne dépendent plus du poste ni du moment (TF-1243, TF-1325,
  `4c2892b5`) : recettes 2/2 et 8/8, rouges sur l'ancien code.
- **D-21 (b)** — 9 des 10 candidatures du 24/09 sont closes : TF-1338 et TF-1339 (`a7eb51e3`),
  TF-1341, TF-1343, TF-1340 et TF-1353, TF-1357 (bruit 20 % puis 1,0 %), TF-1358 (recette 33/33),
  TF-1359 (recette 5/5) ; TF-1360 est fait côté forge et publié, sa repose sur le parc est D-27.
- **D-24 (b)** — le contrôle a été construit d'abord, la règle de restitution
  S52 (source officielle et date de lecture pour tout geste sur un écran tiers) : une action
  humaine qui vise l'écran d'une plateforme tierce doit les citer, d'après une liste de 15
  plateformes datée et sourcée ; mesurée sur les 195 restitutions à bloc 8 du pilot, elle en
  accuse 16, soit 17 actions toutes réellement sur une interface, **0 fausse accusation**. Le gabarit
  passe en 2.28.0, la classe `interface-tierce-ecrite-de-memoire` est créée avec S52 pour porteur,
  et TF-1362, TF-1363 et TF-1364 y sont rattachés (`6d46075f`, `34c25744`).
- **D-25 (a)** — les 7 candidatures du lot Google Ads sont traitées : TF-1361, par la règle
  S53 (un guide écran par écran en tête du message), bloquante au hook quand vous demandez la
  procédure — 5 demandes réelles reconnues sur 5, 0 sur 130 messages ordinaires ; TF-1362 et
  TF-1363 clos, TF-1364 en cours (14 faits au référentiel des fournisseurs, `8e3283a4`), TF-1365
  (garde des promesses, forge-agents `9615a63`), TF-1366 (journal de run qui refuse les entrées
  vides, recette 31 puis 47 cas), TF-1367 (numéro doublé nommé en tête, et `seq` fourni refusé :
  l'ancien outil écrivait le numéro 2 à 2 reprises en annonçant « entrée 3 »).
- **Publication** — 6 forges et le canal envoyés entre 08:20 et 08:21, pilot
  `d47b566e..dd6a62f6` à 08:33 ; second envoi à 10:49 pour forge-conception et forge-organization,
  à 10:50 pour forge-agents, puis le pilot avec cette synthèse. Avant chaque envoi : contrôle
  d'avance R-38 avec votre feu vert, porte des noms PASS sur un paquet de la seule branche envoyée.
- **Propagation** — skills propagés 2 fois par `bootstrap --pull`, après chaque envoi des forges,
  rejeu `oracle-skills` PASS, le contrôle d'en-tête des skills joué au second passage sans refus ;
  consommateurs rejoués après chacune, au même résultat : forge-design, forge-data et forge-tests
  verts, forge-audit rouge sur une dérive antérieure du 23/09 (TF-1374, bloc 5).

## 5. Non traité

- **Le kit Google Ads à capitaliser** (TF-1364) — motif : c'est une construction à part, complexe ×
  long — 5 pièces éprouvées chez le produit à ranger et recetter dans une forge hors de tout
  produit ; ce tour s'est borné au référentiel, qui porte les 14 faits.
- **Le juge de l'enclenchement bloquant** (TF-1319, troisième volet de D-18) — motif : il le devient
  à la livraison de l'outil qui consigne un verdict par oracle, outil dont la construction n'est pas
  décidée.
- **La copie vendorisée de forge-audit qui dérive depuis le 23/09** (TF-1374) — motif : candidature
  neuve, en attente de décision ; son remède, re-vendorer après relecture de la source, est écrit.
- **Les candidatures neuves TF-1373, TF-1375, TF-1376, TF-1377 et TF-1378** — motif : nées en passant,
  elles attendent votre décision comme toutes les autres.
- **Les 3 lots de Produit-68 arrivés au sas les 26 et 27/09** — motif : hors du mandat des 9
  décisions, qui ne visait que le lot du 24/09 ; posés en D-29.
- **Les 3 suppressions** — motif : gestes humains (R-29), inventaire en tête du bloc 3.

## 6. Écarts à la lettre

- **Vous avez demandé** D-15 (b), inscrire les 3 noms et corriger leurs occurrences. **J'ai aussi**
  réordonné localement 4 enregistrements non publiés du 27/09 pour que la correction précède les
  2 qui portaient encore les noms. **Pourquoi** : la porte des noms rend bloquante toute
  occurrence d'un arbre daté du jour même de l'inscription ; le contenu final est identique octet
  pour octet, l'ancienne tête reste au journal de références de git.
- **Vous avez demandé** D-19 (a) pour TF-1337, qu'une porte joue le contrôle d'en-tête des skills.
  **J'ai** branché le contrôle sur la propagation, à chaque `bootstrap --pull`, et corrigé dans
  forge-conception le skill qu'il a refusé à son premier passage (1 048 caractères depuis le 08/09).
  **Pourquoi** : la garde avant enregistrement livrée le 26/09 ne se pose que sur demande et n'est
  posée sur aucun poste.
- **Vous avez demandé** D-24 (b), mesurer les fausses accusations sur le corpus. **J'ai** mesuré sur
  les 195 restitutions du pilot, pas sur celles des produits. **Pourquoi** : les restitutions d'un
  produit vivent dans ses sessions, que le pilot ne lit pas hors d'un run demandé.
- **Le lot demandait** S53 bloquante quand la procédure a déjà été redemandée. **J'ai** rendu le
  guide bloquant dès que votre dernier message demande la procédure. **Pourquoi** : le hook ne lit
  que votre dernier message ; une demande explicite suffit à rendre un tableau de plus inutile.
- **Vous avez demandé** D-25 (a) pour TF-1366 et TF-1367. **J'ai aussi** fait refuser par le journal
  un numéro fourni dans l'entrée, que l'agent a trouvé en chemin. **Pourquoi** : c'est l'invariant
  même de TF-1367, un numéro attribué une seule fois, et l'ancien outil le violait sans concurrence.

## 7. Risques

- **S52 et S53 vont avertir sous des restitutions de produits** qui laissent des gestes sur des
  écrans tiers : 8,2 % du corpus du pilot, davantage chez un produit qui publie des campagnes.
  - signal : un avertissement S52 ou S53 sous la réponse d'une session de produit.
  - parade : le message dit quoi écrire ; une plateforme absente de la liste s'y ajoute, datée et
    sourcée, sans version de l'oracle.
- **Le journal de run refuse désormais ce qu'il acceptait** : une session qui écrirait une entrée
  vide, un argument en trop ou un numéro reçoit un refus.
  - signal : `[LEDGER FAIL]` avec le champ ou l'argument nommé.
  - parade : le message redonne l'usage ; un journal en 1.0 garde ses règles.
- **Un skill mal formé bloque la propagation de son dépôt** à chaque ouverture.
  - signal : un défaut « frontmatter refusé » au relevé d'ouverture, dépôt et skill nommés.
  - parade : corriger le SKILL.md dans la forge, publier ; les autres dépôts se propagent.
- **Le sas porte 3 lots, dont le premier a passé ce matin le délai de 24 heures.**
  - signal : `oracle-boite-entree` rend FAIL B9 à chaque ouverture ; le deuxième lot passe le délai
    à 13:53.
  - parade : D-29 (a).
- **Le remisage du pilot fait toujours refuser la porte jouée sur son dossier.**
  - signal : FAIL de la porte des noms sur `stash@{0}`.
  - parade : juger chaque envoi sur un paquet de la branche envoyée, jusqu'au retrait du remisage.

## 8. Prochaines actions

Les actions ci-dessous sont triées, celles de l'IA d'abord. L'ordre : le sas en tête, parce que son
premier lot a passé le délai ; puis ce qui suit vos autres réponses, puis la construction laissée ;
côté humain, trancher d'abord, puis le remisage, qui conditionne la garde du pilot.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Accueillir puis ingérer les 3 lots du sas : `node todo\accueillir-lot.mjs`, puis `node todo\ingerer-lot.mjs` sur chaque fichier d'accompagnement `.tf.jsonl` que l'accueil dépose | `auto_ia` | neuve | `dependance_bloc_3` — suit D-29 | le contrôle de la boîte d'entrée rend un échec à chaque ouverture |
| **A-2** | Exécuter D-27 et D-28 selon vos réponses : poser la garde par `node <forge-agents>\.claude\skills\quality-oracles\scripts\installer-hamecon-publication.mjs` sur les dépôts retenus ; pseudonymiser l'adresse par `node todo\anonymiser-suivis.mjs` après son inscription au canal | `auto_ia` | TF-1360, TF-1377 | `dependance_bloc_3` — attend D-27 et D-28 | les envois restent jugés à la main, et l'adresse reste publiée |
| **A-3** | Capitaliser le kit Google Ads dans une forge : générateur de l'import web confronté aux modèles, relevé en lecture seule, fichier des changements, rangés dans une forge hors de tout produit | `auto_ia` | TF-1364 | `borne_atteinte` — construction complexe × long, hors de ce tour qui exécute 9 décisions | le kit reste chez le produit et se réécrit au prochain |
| **A-4** | Trancher D-29, D-27 et D-28, reprises en entier au bloc 3 — répondre par exemple « D-29 a, D-27 b, D-28 a » | `manuelle_utilisateur` | neuve | `decision` — accueillir un lot, poser une garde et effacer une donnée publiée vous reviennent | (b) s'applique à D-29, (c) à D-27 et D-28 |
| **A-5** | Retirer le remisage du 24/09 : `git -C C:\dev\digit-ai-factory stash list` doit le montrer en `stash@{0}`, libellé « Releves locaux du 22-24/09… », puis `git -C C:\dev\digit-ai-factory stash drop stash@{0}` ; preuve : la porte des noms jouée sur le dossier du pilot rend PASS | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | la porte reste rouge sur le dossier, et la garde de D-27 ne se pose pas sur le pilot |
| **A-6** | Ouvrir `C:\dev\null`, vérifier qu'il ne porte aucun jeton, puis le supprimer ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | le relevé d'ouverture le signale à chaque session |
| **A-7** | Retirer l'arborescence liée du 14/09 : `git -C C:\dev\digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`, puis `git -C C:\dev\digit-ai-factory branch -d worktree-agent-ac087535fe0698917` ; preuve : `git -C C:\dev\digit-ai-factory worktree list` ne liste plus que le pilot | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | le pilot garde un dossier non suivi, compté à chaque ouverture |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Pilot : `d47b566e..dd6a62f6` publié le 27/09 à 08:33 ; puis `864d1051` (D-17), `c788f999`
  (TF-1332), `8e3283a4` (TF-1364), `6d46075f` (S52, S53), `39837d05` (TF-1337), `34c25744` et
  `4192ebd3` (registre), `551b19fe` et `8899d50d` (D-18), `1cfbc20b` (registre), `f0491cc1`
  (boucle d'amélioration), `aa0f5f24` (cliquet des recettes), puis cette synthèse.
- Forges : forge-agents `eb5799f`…`9615a63` publiés à 08:21, puis `4af8a07`, `f4bfe7b` et
  `108d2fb` publiés à 10:50 ; forge-organization `463d257` et forge-conception `d48b927` à 10:49 ;
  canal `cdc79b4` et `98023fe` à 08:21.
- Registre `todo/TODO.jsonl` : 28 événements (26 clôtures, 2 en cours), 5 créations, puis
  6 événements (4 clôtures, 1 point d'étape, 1 création) ; `oracle-todo` PASS avant et après chaque lot.
- Sorties des portes, des contrôles d'avance, des recettes et des harnais : fichiers de la session,
  hors dépôt (`sondage/`, `consommateurs/`, `consommateurs-2/`, `harnais-2.txt` à `harnais-4.txt`).
- Aucune page HTML livrée dans ce tour.
