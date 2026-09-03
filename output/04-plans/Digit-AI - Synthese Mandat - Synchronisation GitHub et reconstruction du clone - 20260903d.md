---
destinataire: humain
---

# Synthèse de mandat — synchronisation de la factory et des forges avec GitHub (03/09/2026)

Les quatorze forges étaient déjà alignées sur GitHub et n'ont rien eu à recevoir ni à envoyer. La factory, elle, ne pouvait pas se synchroniser par une simple mise à jour : l'histoire publiée sur GitHub a été réécrite le 03/09 depuis un autre poste pour retirer les noms de clients, et ce clone portait encore l'ancienne histoire plus une session de travail du 01 et 02 septembre jamais enregistrée. Le clone a donc été rebâti sur la nouvelle histoire, le travail local a été reporté dessus, deux identifiants du registre frappés en double par les deux sessions ont été renumérotés, et l'ensemble a été publié après un passage vert de la porte de publication. Ce qui change pour vous : ce poste et GitHub disent désormais la même chose, et les gardes de fraîcheur le confirment. Ce qui est attendu de vous : quatre décisions courtes, dont une sur une ancienne branche de sauvegarde qui maintient la porte de publication rouge sur ce poste tant qu'elle existe.

## 1. En-tête d'identification

- **quoi** — mandat de synchronisation : mise à niveau du pilot et des treize forges plus la file d'attente avec leurs dépôts GitHub, reconstruction du clone du pilot sur l'historique réécrit, report de la session locale, publication.
- **sur quoi** — le pilot `digit-ai-factory` (écritures et publication) ; les quatorze dépôts frères relevés en lecture seule, aucun n'a été modifié.
- **quand** — fin le **03/09/2026 à 20:48 (UTC+02:00)** ; session ouverte à 09:44 sur ce poste, traitement effectif estimé à une heure et demie (le reste est attente).
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `3670336` après publication, base GitHub `21563be` avant.

## 2. Verdict en une ligne

Pilot **à jour sur GitHub** (`21563be..3670336`, avance rapide), 14/14 forges déjà à jour, porte de publication **PASS** sur la branche publiée, registre **PASS**, banc du pilot 92/93 (le défaut restant préexistait à l'ouverture).

## 3. Décisions attendues

Les quatre décisions découlent d'un même fait : l'histoire du pilot a été réécrite ailleurs, et ce poste en portait encore des traces — une branche de sauvegarde, des étiquettes de version, un registre qui avait avancé en parallèle. Tout ce qui pouvait se résoudre sans arbitrage l'a été ; reste ce qui touche à une suppression, à ce que désignent les versions, ou au périmètre.

> **D-1 — Supprime-t-on la branche locale de sauvegarde du 30/08, qui porte l'ancienne histoire avec les noms réels et maintient la porte de publication rouge sur ce poste ?**
> Une branche de sauvegarde créée le 30/08 par une session précédente vit encore dans ce clone : quatre cent six enregistrements de l'ancienne histoire, noms de clients compris. Elle n'est jamais poussée, mais la porte de publication juge le dépôt entier, branches comprises, et la voit : sur ce poste, la porte reste rouge tant que la branche existe, alors que la branche publiée est propre. Son contenu a déjà été mis à l'abri dans un paquet git vérifié, hors de tout dépôt publié.
> **Recommandation : (a).** Source consultée : sortie de `oracle-nom-client-publie.mjs`, la porte de publication (verdict FAIL, 200 constats, tous attribués à des enregistrements hors de la branche publiée) et vérification du paquet de sauvegarde (« is okay », 26 240 803 octets) ; `references\REGLES-PROJET.md` — règle R-29 (suppressions, dépenses et gates réservées à un geste humain).
> L'option (a) rend la porte verte sur ce poste sans rien perdre : le paquet se relit et se restaure d'une commande.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** supprimer la branche, le paquet de sauvegarde faisant foi | simple × court : une commande, rejouer la porte ensuite | exclut de retrouver la branche par son nom dans le clone ; elle se restaure depuis le paquet |
| **(b)** garder la branche telle quelle | gratuit aujourd'hui ; porte rouge à chaque passage sur ce poste, à lire et à écarter à la main | exclut un verdict vert de la porte sur ce clone, donc tout contrôle automatique de publiabilité ici |
| **(c)** garder la branche mais la renommer pour la marquer comme jamais publiable | simple × court ; ne change rien au verdict de la porte | exclut aussi le vert de la porte ; n'apporte qu'un signal de lecture |

> **Si rien n'est décidé** : (b) s'applique — la branche reste, la porte de publication reste rouge sur ce poste, la branche publiée reste propre.

> **D-2 — Ré-étiquette-t-on les quarante-deux versions du pilot sur la nouvelle histoire, ou laisse-t-on les étiquettes pointer sur la lignée réécrite séparée où elles sont aujourd'hui ?**
> Les quarante-deux étiquettes de version (de la 1.7.0 à la 1.17.30) ont bien été réécrites côté GitHub, mais elles désignent une lignée réécrite distincte de la branche publiée : deux cent trente-sept enregistrements qui partent de la même origine que la nouvelle histoire et ne la rejoignent jamais. Ce n'est pas une fuite — la porte de publication les a jugés propres — mais tout clone ramène cette lignée en plus, et une version ne désigne plus un point de la branche publiée.
> **Recommandation : (a).** Source consultée : relevé des étiquettes (42 locales réalignées sur les 42 distantes ; la 1.17.30 pointe hors de la branche publiée, base commune à la réécriture, 237 enregistrements de côté) ; `references\RUN-VERSION.md` — règle R-19 (les versions se tiennent au ledger).
> Chaque enregistrement étiqueté a son équivalent sur la branche publiée, au même sujet et à la même date : le réalignement se fait par correspondance, sans réécrire aucune histoire.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** ré-étiqueter par correspondance de sujet et de date, puis publier les étiquettes | moyen × court : un script de correspondance, un contrôle un à un, une publication forcée des seules étiquettes | exclut de conserver les objets d'étiquette produits par la réécriture ; la lignée séparée devient orpheline et disparaît des clones futurs |
| **(b)** laisser les étiquettes où elles sont | gratuit | exclut qu'une version désigne un point de la branche publiée ; chaque clone continue de ramener 237 enregistrements de côté |
| **(c)** supprimer les étiquettes distantes et ne garder que le ledger | simple × court | exclut toute remontée à une version par git ; le ledger devient la seule mémoire des versions |

> **Si rien n'est décidé** : (b) s'applique — rien ne change, la porte reste verte, les clones portent la lignée de côté.

> **D-3 — Comment traite-t-on les sept références du pilot que le noyau ne cite pas, défaut que le contrôle du noyau signale déjà sur la version publiée avant ce mandat ?**
> Le contrôle du noyau vérifie deux choses : que le fichier d'instructions reste sous son plafond de taille, et que chaque document de référence est cité par lui. La première tient (le noyau a été compressé le 01/09 pour y faire entrer la loi n° 7). La seconde échoue sur sept documents — patrons éprouvés, empreintes, dépôts mis de côté, chaîne de traduction, intégrations fournisseurs, production de documents bureautiques, règles de non-répétition — et elle échouait déjà à l'identique sur la version GitHub d'avant ce mandat : ce n'est pas une régression, c'est un défaut hérité que la synchronisation rend visible.
> **Recommandation : (b).** Source consultée : sortie de `oracles\oracle-claude-md.mjs`, le contrôle du noyau, sur ce poste (verdict FAIL : N3 (chaque document de référence doit être cité par le noyau) sept fois ; N1 (le plafond de taille du noyau) PASS) et la même sortie rejouée sur le noyau tel que publié (même verdict, mêmes sept documents).
> Citer sept documents de plus dans un noyau déjà au plafond ferait tomber N1 ; un index cité une seule fois par le noyau porte les sept références sans lui coûter plus d'une ligne.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** citer les sept documents directement dans le noyau | simple × court, mais retire d'autres phrases pour tenir le plafond | exclut de garder le noyau tel qu'il est ; chaque référence future coûtera la même négociation |
| **(b)** créer un index des références cité une fois par le noyau, et faire lire l'index par le contrôle | moyen × court : un fichier d'index, une ligne au noyau, le contrôle étendu à la citation transitive | exclut la lecture directe depuis le noyau ; deux sauts au lieu d'un pour atteindre un document |
| **(c)** déclarer les sept documents hors noyau et les exclure du contrôle | simple × court | exclut qu'un document de référence oublié soit jamais signalé : le contrôle perd sa raison d'être |

> **Si rien n'est décidé** : (c) de fait, sans le dire — le contrôle reste rouge à chaque passage et finit par être ignoré.

> **D-4 — Ingère-t-on maintenant les cinq lots de retours restés sur disque, dont quatre portent encore le nom réel du produit dans leur nom de fichier ?**
> Cinq lots de retours (dix fichiers, dix constats au total) sont arrivés dans la boîte d'entrée du pilot les 01 et 02 septembre et n'ont été ingérés par aucune des deux sessions : trois du produit 12, deux du produit 02. Ils sont restés hors du suivi git, à dessein : quatre d'entre eux portent le nom réel du produit dans leur nom de fichier, et l'anonymiseur d'entrée doit les passer avant tout enregistrement. Les ingérer relève de l'ouverture d'un run ou d'un mandat de traitement des retours, pas d'une synchronisation.
> **Recommandation : (a).** Source consultée : relevé de `input-retours\` (cinq lots, aucun de leurs constats retrouvé dans `todo\TODO.jsonl` ni dans `todo\TODO-ARCHIVE.jsonl` côté GitHub) et `references\TODO-FORGE.md`, qui fait passer l'oracle de boîte d'entrée à l'ouverture de tout run.
> L'ingestion est un geste d'agent, borné et outillé (anonymisation à l'entrée, contrôle de collision d'identifiants) ; le laisser attendre fait courir dix constats réels sans décision.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** mandater l'ingestion des cinq lots au prochain tour | simple × court : une commande par lot, anonymisation comprise, puis vos décisions sur dix candidats | exclut de laisser les lots dans la boîte ; dix candidatures de plus vous seront soumises |
| **(b)** les laisser dans la boîte jusqu'au prochain run produit | gratuit | exclut tout traitement de ces dix constats d'ici là ; le contrôle de boîte d'entrée les signalera à chaque ouverture |
| **(c)** les écarter comme périmés | simple × court | exclut dix constats jamais lus — dont trois du pilot lui-même |

> **Si rien n'est décidé** : (b) s'applique — les lots restent sur disque, non suivis, signalés à chaque ouverture.

## 4. Traité — avec sa preuve

- **Quatorze dépôts frères relevés** (treize forges et la file d'attente) : chacun sur `main`, zéro enregistrement devant, zéro derrière, aucune modification locale — rien à faire.
  - preuve : relevé git par dépôt après `git fetch --prune`, quatorze lignes `devant=0 derriere=0 modifs_locales=0`.
- **La divergence du pilot qualifiée** : 438 enregistrements locaux contre 464 distants depuis une base commune du 05/08 ; 434 des 438 sujets locaux existent côté GitHub sous forme réécrite, les 4 autres aussi, sous un nom de produit pseudonymisé ; l'ancien nom de produit apparaît 28 fois dans l'arbre local, zéro fois dans l'arbre GitHub.
  - preuve : `git cherry` (332 équivalents, 102 non), comparaison des sujets (434 communs), `git grep` sur les deux arbres (28 contre 0).
- **L'ancienne histoire mise à l'abri**, session locale comprise, puis la branche de travail retirée du clone.
  - preuve : paquet `c:\dev\_sauvegardes\digit-ai-factory-ancienne-histoire-20260903.bundle`, `git bundle verify` : « is okay », 94 348 803 octets.
- **La branche principale rebâtie** sur la nouvelle histoire GitHub, suivi distant reposé.
  - preuve : `git status -sb` → `## main...origin/main`, base `21563be`.
- **La session locale du 01-02/09 reportée** : loi transverse n° 7 au noyau, référence `references\INTENTION.md`, référence `references\SEO-RECHERCHE.md`, gabarit d'étude et son oracle (contrôles E9 (la section intention de l'utilisateur est présente et substantielle) et E10 (le test rétro remontant à l'intention est écrit)), deux études, quatre synthèses, sidecars de verdicts (le fichier de verdicts qui accompagne chaque document).
  - preuve : commit `3670336`, 49 fichiers, 1 868 lignes ajoutées, 89 retirées ; self-test de l'oracle d'étude 2/2 PASS (verte PASS, rouge FAIL sur E2, E8, E9, E10).
- **Les quatre synthèses locales réindexées** de f/g/h/i en h/i/j/k, GitHub ayant déjà pris a à g pour le 01/09 ; titres, renvois internes et sidecars mis en cohérence.
  - preuve : quatre fichiers renommés, seize fichiers réécrits par substitution simultanée ; contrôle des README de dossiers `--check` : PASS.
- **Deux identifiants du registre renumérotés** : la cascade d'intention devient TF-0791 et l'ingestion de l'expertise SEO chez la forge de référencement devient TF-0792, parce que TF-0751 et TF-0752 avaient été frappés en parallèle par l'autre session pour d'autres sujets ; motif consigné dans l'événement de création ; mentions mises à jour dans les cinq fichiers qui les citaient et dans la mémoire du poste.
  - preuve : quatre événements ajoutés au registre ; `oracle-todo` : PASS ; vue `todo\TODO.md` régénérée, 11 actifs, empreinte des actifs `6c3ad3ee6084`.
- **Les quarante-deux étiquettes de version réalignées** sur celles de GitHub (les locales pointaient toutes sur l'ancienne histoire).
  - preuve : `git fetch --tags --force` : 42 mises à jour ; 0 étiquette locale absente du distant.
- **Porte de publication jouée trois fois**, jusqu'au vert sur ce qui est publié : le clone entier d'abord (FAIL, 200 constats, tous sur des enregistrements hors branche publiée), la branche seule avec les anciennes étiquettes (FAIL, 200), la branche seule avec les étiquettes réalignées (PASS).
  - preuve : `oracle-nom-client-publie` sur un clone à branche unique : verdict PASS, un seul constat d'information, zéro bloquant sur les quatre angles C1 à C4 (contenus, noms de fichiers, messages, historique).
- **Publication** de la branche principale, en avance rapide, sans forçage.
  - preuve : `git push` → `21563be..3670336 main -> main` ; distant et local à `3670336` ; garde de fraîcheur rejouée : « digit-ai-factory (pilot) — présent, à jour (3670336) ».
- **Banc du pilot rejoué** après reconstruction.
  - preuve : `oracles\self-tests.mjs` 92/93 (seul défaut : l'oracle des skills sur le parc réel, règle K2 (les empreintes des skills installés sur le poste sont relevées à l'ouverture), déjà rouge à l'ouverture de session) ; `oracles\self-test.mjs` conformité projet 45/45.
- **Contrôle du noyau rejoué et comparé** au noyau publié : même verdict des deux côtés.
  - preuve : N1 PASS et N3 FAIL sept fois sur ce poste ; N3 FAIL sept fois, mêmes documents, sur le noyau tel que publié avant ce mandat.
- **Mémoire du poste écrite** : où sont les paquets de sauvegarde, ce qui a été renuméroté, ce qui reste à ingérer.
  - preuve : fichier de mémoire créé et indexé (voir traces).

## 5. Non traité — avec son motif

- **Les cinq lots de retours de la boîte d'entrée** : *hors mandat* — l'ingestion relève de l'ouverture d'un run ou d'un mandat de retours ; décision D-4.
- **La branche de sauvegarde du 30/08** : *geste humain* — supprimer est réservé à l'humain (R-29) ; son paquet est fait ; décision D-1.
- **Les étiquettes de version sur la lignée séparée** : *dépendance à une décision humaine* — D-2 ; rien n'a été réécrit côté GitHub.
- **Les sept références non citées par le noyau** : *dépendance à une décision humaine* — D-3 ; défaut hérité, identique sur la version publiée.
- **La règle K2 de l'oracle des skills** : *hors mandat* — remède nommé par la garde d'ouverture, propre au poste, sans lien avec la synchronisation.
- **Six changements de statut locaux de TF-0741** (étude DataForSEO du produit 02, passée « en cours » ici les 01 et 02/09) : *écartés* — GitHub a clos cet item le 02/09 avec sa propre étude ; réappliquer des statuts antérieurs le rouvrirait. Critère de réouverture : si l'étude locale « cadrage v2 », reportée dans le commit, doit compter comme livrable de cet item, un événement de rectification le dira.
- **Le journal des hooks de ce poste** (fichier ignoré par git, réécrit à chaque session) : *écarté* — il cite encore les quatre synthèses sous leurs anciens indices ; c'est un état machine, pas un savoir partagé, et il se réécrit seul.
- **La seconde copie du pilot, le fichier « null » à la racine du parc et le lien symbolique brisé** signalés par la garde d'ouverture : *geste humain* — trois suppressions, réservées à l'humain (R-29), sans lien avec ce mandat.

## 6. Écarts à la lettre

- Vous avez demandé de synchroniser → pour la factory, je n'ai pas fusionné : j'ai rebâti le clone sur l'histoire distante et reporté le travail local par-dessus → parce que l'histoire distante a été réécrite pour retirer des noms de clients, et qu'une fusion aurait réintroduit les 438 anciens enregistrements, noms compris (la synthèse GitHub du 03/09 le nomme comme risque).
- Synchroniser incluait publier → j'ai poussé la branche principale sans vous redemander → parce que la demande le portait, que la publication est une avance rapide sans forçage, et que la porte de publication était verte sur ce qui partait ; les étiquettes, elles, n'ont pas été touchées côté distant (D-2).
- Le travail local devait être reporté tel quel → deux identifiants ont changé de numéro et quatre synthèses d'indice → parce que les mêmes numéros et les mêmes indices avaient été pris entre-temps par l'autre session ; les anciens numéros restent lisibles dans le motif consigné.
- Rien ne demandait de créer des fichiers hors dépôt → deux paquets git ont été écrits dans un dossier de sauvegardes à la racine du parc → parce qu'une histoire portant des noms réels ne doit vivre ni dans un dépôt publié ni nulle part où un contrôle ne la voit ; le dossier est nommé et déclaré ici.

## 7. Risques

- **L'autre poste** — celui qui a réécrit l'histoire — a peut-être du travail non publié ; sa prochaine publication rencontrera l'enregistrement de ce soir.
  - signal : un `git push` refusé là-bas pour non-avance-rapide.
  - parade : un `git pull --ff-only` suffit avant de publier, l'enregistrement de ce soir ne touche que des fichiers que l'autre session n'avait pas modifiés depuis la base commune (noyau, gabarit d'étude, oracle d'étude, registre par ajout).
- **Ce poste porte encore des traces de l'ancienne histoire** : la branche du 30/08 et les objets git des enregistrements retirés, jusqu'au prochain nettoyage interne de git.
  - signal : la porte de publication rouge sur le clone entier alors que la branche publiée est verte.
  - parade : D-1 pour la branche ; les objets non référencés ne partent jamais dans une publication.
- **Un clone neuf ramène la lignée d'étiquettes séparée** (237 enregistrements réécrits, propres) et un lecteur peut y voir une seconde histoire.
  - signal : `git log --all` qui montre deux lignées depuis le 05/08.
  - parade : D-2 ; en attendant, la porte de publication les a jugés sans nom interdit.
- **Deux sessions ont frappé les mêmes numéros** entre le 01 et le 03/09, et rien ne l'empêchera la prochaine fois qu'un poste reste hors ligne plusieurs jours.
  - signal : le contrôle de collision de l'ingestion qui annonce un identifiant déjà publié.
  - parade : rejouer la garde de fraîcheur avant tout tour de travail (elle refuse désormais un clone divergent) ; l'outil de renumérotation existe et son motif se consigne.
- **Les quatre lots portant un nom réel dans leur nom de fichier** restent sur disque, non suivis ; un `git add` global les enregistrerait.
  - signal : la porte de publication rouge sur l'angle C2 (noms de fichiers) après un enregistrement.
  - parade : ingestion par l'outil (anonymisation à l'entrée), jamais d'ajout global ; le hook de fin de tour rejoue la porte des secrets.

## 8. Prochaines actions

Ordre de traitement : les actions d'agent qui ne dépendent d'aucune décision viennent en tête ; puis celles qui attendent une décision de ce message, dans l'ordre des décisions ; les gestes humains ferment la liste parce qu'ils ne bloquent rien d'autre.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | `neuve` | Rejouer le remède de l'oracle des skills nommé par la garde d'ouverture : `node oracles\oracle-skills.mjs --racine "C:\dev"` puis relire son verdict (règle K2). | `auto_ia` | `hors_mandat` — préparation du poste, pas synchronisation ; mandat « poste prêt » ou ouverture du prochain run. | La garde d'ouverture continue d'annoncer « poste non prêt » à chaque session et le banc du pilot reste à 92/93. |
| A-2 | `neuve` | Ingérer les cinq lots de la boîte d'entrée par `node todo\ingerer-lot.mjs` (anonymisation à l'entrée, contrôle de collision), puis soumettre les dix candidats. | `auto_ia` | `dependance_bloc_3` — D-4. | Dix constats réels (dont trois sur le pilot) restent sans lecture ni décision ; la garde d'ouverture les signale à chaque session. |
| A-3 | `neuve` | Supprimer la branche locale du 30/08 (`git branch -D sauvegarde/avant-remise-a-niveau-20260830`) et rejouer la porte de publication sur le clone entier jusqu'au PASS. | `auto_ia` | `dependance_bloc_3` — D-1 ; suppression réservée à l'humain par R-29, exécutée par l'agent une fois décidée. | La porte reste rouge sur ce poste ; tout contrôle automatique de publiabilité y est inutilisable. |
| A-4 | `neuve` | Ré-étiqueter les 42 versions sur la branche publiée par correspondance de sujet et de date, vérifier une à une, puis publier les étiquettes seules. | `auto_ia` | `dependance_bloc_3` — D-2. | Les versions ne désignent aucun point de la branche publiée ; chaque clone ramène 237 enregistrements de côté. |
| A-5 | `neuve` | Créer l'index des références cité par le noyau et étendre le contrôle du noyau à la citation par l'index ; rejouer le contrôle du noyau (N1 et N3) jusqu'au PASS. | `auto_ia` | `dependance_bloc_3` — D-3. | Le contrôle du noyau reste rouge à chaque passage et cesse d'être lu. |
| A-6 | `neuve` | Sur l'autre poste, avant tout travail : `git pull --ff-only` dans le dépôt du pilot, puis vérifier que la garde d'ouverture rend « à jour (3670336) ». | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 dit « le vôtre sur un autre poste » et la garde d'ouverture d'ici ne relève que ce clone. | La prochaine publication depuis l'autre poste est refusée, ou pire, forcée par-dessus l'enregistrement de ce soir. |
| A-7 | `neuve` | Décider du sort des trois restes signalés par la garde d'ouverture : la seconde copie du pilot (`c:\dev\_archive-digit-ai-forge-steering_old`), le fichier `c:\dev\null` (à lire avant suppression : il peut contenir une réponse authentifiée), le lien brisé `c:\dev\digit-ai-forge-pilot_old`. | `manuelle_utilisateur` | `irreversible` — trois suppressions, R-29 ; la garde les déclare et ne les efface pas. | La garde d'ouverture répète les trois avertissements à chaque session ; la copie morte reste un piège pour une session qui s'y ouvrirait. |

## 9. Traces

- Publication : commit `3670336` sur `main`, poussé (`21563be..3670336`), 49 fichiers.
- Reportés : `CLAUDE.md` · `references\INTENTION.md` · `references\SEO-RECHERCHE.md` · `gabarits\ETUDE-OPPORTUNITE.md` · `oracles\oracle-etude-opportunite.mjs` (v1.2.0) · `output\03-etudes\20260901-etude-dataforseo-cadrage-v2.md` · `output\03-etudes\20260901-etude-opportunite-donnees-de-recherche.md` · `output\04-plans\…20260901h.md`, `…20260901i.md`, `…20260901j.md`, `…20260901k.md` et leurs sidecars sous `.oracles\output\`.
- Registre : `todo\TODO.jsonl` — TF-0791 (création, décidé, en cours) et TF-0792 (création) ; vue `todo\TODO.md` régénérée (11 actifs), page associée régénérée par le même générateur.
- Sauvegardes hors dépôt : `c:\dev\_sauvegardes\digit-ai-factory-ancienne-histoire-20260903.bundle` (94 348 803 octets) · `c:\dev\_sauvegardes\digit-ai-factory-branche-avant-remise-a-niveau-20260830.bundle` (26 240 803 octets), tous deux « is okay » à la vérification.
- Non suivis, en attente d'ingestion : dix fichiers dans `input\00-retours\` (cinq lots, produits 12 et 02).
- Oracles rejoués : `oracle-nom-client-publie` (PASS sur la branche publiée) · `todo\oracle-todo.mjs` (PASS) · `oracles\oracle-etude-opportunite.mjs --self-test` (2/2) · `oracles\oracle-claude-md.mjs` (N1 PASS, N3 FAIL ×7, identique au publié) · `oracles\self-tests.mjs` (92/93) · `oracles\self-test.mjs` (45/45) · `scripts\readme-dossiers.mjs --check` (PASS) · `bootstrap.mjs --pull` (pilot à jour).
- Mémoire du poste : `~\.claude\projects\c--dev-digit-ai-factory\memory\reconstruction-clone-historique-reecrit-20260903.md`, indexée dans `MEMORY.md`.
