---
destinataire: humain
role: restitution de fin de tour, demande « Synchronise avec github » du 28/09/2026
sources_de_verite: git des 16 dépôts gouvernés · todo/TODO.jsonl · paquets de sauvegarde sous c:\dev\_sauvegardes\synchro-20260928\ · rapports des 2 agents d'analyse de la session · gabarits/RESTITUTION.md (v2.28.0)
verifie_le: 2026-09-28
---

# Digit-AI — Synthèse de mandat — Parc synchronisé et travail des deux postes réuni — 28/09/2026

## 0. Synthèse d'ouverture

C'est synchronisé : les 16 dépôts du parc sont à égalité avec GitHub. Ce poste portait 4 jours de
travail jamais publié. Entre-temps, l'autre poste avait refait et publié la plupart de vos décisions
du 24/09, sur vos réponses du 26/09. J'ai gardé sa version, déjà vérifiée et close sur preuve. J'ai
reporté par-dessus ce qui n'existait qu'ici : 4 lots de retours, les niveaux d'intervention, le
suivi des modèles par nom de famille, 4 classes de défaut et 3 ajouts dans 2 forges. Rien n'est
perdu, chaque variante écartée reste dans un paquet de sauvegarde. Pendant ce tour, une autre
session a intégré le gabarit de guide construit par un produit, sur votre décision rendue chez lui :
la question que je préparais n'a plus lieu d'être. Ce qui vous attend : 1 décision, accueillir les
11 lots de retours qui attendent au sas d'arrivée (la salle d'attente des lots de retours), puis
3 suppressions que je ne fais pas sans vous.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, sur votre message « Synchronise avec github ».
- **sur quoi** — les 16 dépôts gouvernés de `c:\dev` : le pilot `digit-ai-factory`, les 13 forges
  `digit-ai-forge-*`, `digit-ai-queue` et le canal confidentiel cloné sous `_confidentiel` ; aucun
  dépôt de produit n'a été modifié.
- **quand** — le 28/09/2026, de 08:54 à 10:54 puis de 14:30 à 14:38 (UTC+02:00) après une
  interruption de la session, soit 2 h 08 de travail ; heures relevées par `date`, la fin est
  l'heure de dépôt de cette synthèse, son envoi suit.
- **qui** — session de pilotage Claude Opus 5.5 ; 2 agents d'analyse en lecture seule sur Claude
  Sonnet 5, le défaut du routage, l'un pour `digit-ai-forge-agents`, l'autre pour 4 petits dépôts ;
  escalade de modèle : aucune. Pilot passé de `1a747f5`, tête locale jamais publiée, à `a464cb9`,
  tête publiée, puis à `73aca64` par mes 4 enregistrements, publiés sous `80c126f`.
- **intention** — que ce poste et GitHub portent le même état, sans perdre le travail d'aucun des
  2 postes, sans doublon d'une même décision et sans publier un nom que la table des pseudonymes
  protège.
  **Test rétro** : servie sur l'état, les 16 dépôts rendent `0 0` après le dernier `git fetch`, et
  sur le travail, rien de ce poste n'est perdu. Elle ne l'est qu'en partie sur la publication :
  mon envoi du pilot ne s'est pas terminé, c'est l'envoi d'une autre session qui a porté mes
  enregistrements ; et 11 lots au sas attendent votre décision (bloc 5).

## 2. Verdict en une ligne

**16 dépôts sur 16 à égalité avec GitHub** (`0 0` à 14:34, après `git fetch`) ·
**pilot** : 11 enregistrements et le travail non enregistré des 24 et 25/09 reportés en
4 enregistrements, publiés à 11:59:53 · **27 candidatures renumérotées** TF-1395 à TF-1421 ·
**3 enregistrements de forge** publiés (`digit-ai-forge-agents` 2, `digit-ai-forge-design` 1),
3 dépôts alignés sans rien perdre · harnais du pilot 165 recettes sur 165 vertes · porte des noms
PASS sur mes 2 envois de forge · **1 décision** attendue.

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent un geste de suppression, énoncés ici en entier :

- **Le fichier « null » de 22 octets, à la racine du parc, ne se supprime pas sans vous**, parce
  qu'une suppression reste un geste humain décidé. Une commande Windows l'a écrit le 25/09 à 08:56
  en croyant jeter sa sortie ; il ne porte qu'une réponse de refus, « Not Found », et aucun jeton.
  Pour le lever : le supprimer. Si rien n'est fait : le relevé d'ouverture le signale à chaque
  session.
- **La copie de la table des produits datée du 22/09, restée dans le dossier du canal
  confidentiel, ne se supprime pas sans vous**, pour la même raison. Git ne la suit pas ; elle
  porte des noms réels et aucune information que l'histoire du canal n'ait déjà. Pour la lever : la
  supprimer. Si rien n'est fait : elle reste lisible sur ce poste, hors de toute porte de
  publication.

Comment lire le tableau : il porte une option par ligne ; la colonne Coût dit la complexité et la
durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et sa source précèdent
le tableau ; la ligne « Si rien n'est décidé » le suit. Pour répondre, un sélecteur suffit, par
exemple « D-31 a ». La numérotation reprend après D-30, la dernière posée par l'autre poste le 27/09.

> **D-31 — Voulez-vous que j'accueille et ingère maintenant les 11 lots de retours qui attendent au sas `input\00-retours\_arrivee\` de ce poste, dont 3 depuis le 25/09 ?**
>
> Le sas `input\00-retours\_arrivee\` est la salle d'attente, ignorée par git, où un produit dépose
> son lot, nom réel compris. Le 25/09, un produit encore absent de la table des pseudonymes y a
> déposé 3 lots ; le contrôle d'ouverture les déclare oubliés, passé 24 heures. Aujourd'hui, 3
> autres produits y ont déposé 8 lots : Produit-76 à 09:34 et 09:50, inscrit à la table à 09:45
> par un processus que ce tour n'a pas lancé ; Produit-64 à 11:02 et 12:02 ; un produit encore
> hors table, 4 lots entre 11:23 et 12:16. `todo\accueillir-lot.mjs` pseudonymise le nom et le
> contenu d'un lot, puis `todo\ingerer-lot.mjs` verse ses retours au registre comme candidatures,
> sans rien décider.
>
> **Recommandation : (a).** Source consultée : `oracles/oracle-boite-entree.mjs`, règle B9 (un lot
> qui attend au sas plus de 24 heures est un oubli), et vos réponses D-26 (a) du 26/09 et D-29 (a)
> du 27/09, données pour les lots précédents de ce même sas.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* J'accueille et j'ingère les 11 lots, après avoir vérifié qu'aucun lot neuf n'arrive plus ; j'enregistre au canal confidentiel les inscriptions à la table, puis je publie | moyen × court | aucune |
| **(b)** J'accueille et j'ingère les 3 lots du 25/09 seulement | simple × court | les 8 lots d'aujourd'hui passeront à leur tour le délai de 24 heures, dès demain à 09:34 |
| **(c)** Les laisser au sas | nul | le contrôle d'ouverture rend un échec à chaque session, et l'inscription de Produit-76 n'existe que sur ce poste |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Le relevé d'ouverture disait 6 dépôts divergés ; la mesure a montré que ce n'était pas une
réécriture d'histoire mais un même travail fait 2 fois, et c'est ce qui a fixé la méthode.

- **Le relevé avant tout geste.** Le pilot portait 11 enregistrements locaux jamais publiés contre
  35 publiés par l'autre poste ; `digit-ai-forge-design` 1 contre 1, `digit-ai-forge-tests` 1 contre
  2, `digit-ai-forge-agents` 4 contre 13, `digit-ai-forge-audit` 1 contre 1, le canal confidentiel
  1 contre 5. Les 10 autres dépôts rendaient `0 0`.
  - preuve : `git fetch` puis `git rev-list --left-right --count HEAD...origin/main` sur les 16
    dépôts au début du tour, après 08:54 ; base commune du pilot `68de89b`, publiée : aucune
    histoire réécrite.
- **Le même travail avait été fait 2 fois.** Vous aviez répondu aux décisions du 24/09 sur ce
  poste le 24/09 au soir ; il les avait exécutées sans les publier. L'autre poste, ne voyant rien
  de publié, vous les a reposées le 25/09, et vous y avez répondu le 26/09. Il les a exécutées de
  nouveau, puis publiées les 26 et 27/09. Au registre, 27 items avaient été décidés ou clos des 2
  côtés, et les numéros TF-1368 à TF-1394 frappés des 2 côtés pour des sujets différents.
  - preuve : `git cherry -v origin/main HEAD` au pilot, 11 enregistrements sans équivalent publié ;
    comparaison des 2 registres par script, 137 événements locaux contre 110 publiés ; rapports
    des 2 agents d'analyse, enregistrement par enregistrement.
- **Tout ce qui allait être écarté est sauvegardé avant le moindre alignement.** Un paquet git de
  la branche locale de chacun des 6 dépôts divergés, le différentiel du travail non enregistré du
  pilot, l'archive de ses 12 fichiers non suivis ; à la reprise, un paquet de la branche locale du
  gabarit.
  - preuve : `git bundle verify` rend OK sur les 7 paquets, sous `c:\dev\_sauvegardes\synchro-20260928\`.
- **Le pilot repart de la version publiée, et reçoit par-dessus le travail propre à ce poste.**
  Sont reportés 37 fichiers, dont 30 à l'octet et 7 retouchés pour la renumérotation ou le
  renommage : 4 lots de retours, 2 lots de constats, 2 études, 7 synthèses des 24 et 25/09 avec
  leurs sceaux, le sceau de la synthèse publiée du 24/09, les niveaux d'intervention et le suivi
  des modèles. Et 3 fichiers sont fusionnés à 3 voies sur leur version publiée,
  `CONTRAT-INTERFACE.md`, `oracles/hook-ouverture.mjs` et `oracles/baseline-recettes.json`, sans
  conflit une fois les fins de ligne normalisées.
  - preuve : `scripts/verifier-jugement.mjs` sur `output/04-plans`, 43 livrables scellés vérifiés,
    aucun modifié après jugement ; `gabarits/oracle-lot-retours.mjs` PASS sur les 4 lots, dont
    R-49 (le sidecar, fichier d'accompagnement d'un lot, porte encore son empreinte d'ingestion).
- **Le registre réunit les 2 postes sans doublon.** Registre publié gardé tel quel ; 64 événements
  de ce poste ajoutés, 68 écartés parce que l'autre poste avait redécidé ou clos les mêmes items ;
  27 créations renumérotées TF-1395 à TF-1421 par `todo/renumeroter.mjs`, le motif consigné dans
  chacune ; 20 notes de synchronisation.
  - preuve : `todo/renumeroter.mjs` rend PASS avant et après sur 27 renumérotations sur 27 ;
    `todo/oracle-todo.mjs` PASS sur le registre fusionné de 2399 lignes.
- **4 classes de défaut créées ici le 24/09 entrent au référentiel**, `todo/CLASSES.json` 1.23.0,
  chacune pointée vers le contrôle que l'autre poste a publié pour le même défaut.
  - preuve : `oracle-todo` rouge sur la règle R9 (un item ne recule pas dans le temps) avec les
    rattachements datés du 24/09, vert après les avoir redatés au 28/09.
- **La synthèse locale du 25/09 au matin prend l'indice g**, parce que l'indice a du même jour est
  publié par l'autre poste et cité par sa synthèse du 27/09.
  - preuve : son sceau reste valide, contenu inchangé, parmi les 43 vérifiés ci-dessus.
- **Le hook d'enregistrement du pilot appelait un script disparu.** La copie installée venait de
  la variante locale du 24/09 ; elle est remplacée par la copie versionnée publiée.
  - preuve : `scripts/verifier-hooks-git.mjs` rouge sur H1, puis vert, 3 gardes appelées sur 3.
- **`digit-ai-forge-design` : la règle SA7 (un motif de saisie doit compiler sous le drapeau v)
  reçoit sa documentation et une garde.** Sur un Node plus ancien que la version 20, la règle
  accusait tout motif ; elle s'y déclare désormais non jugée.
  - preuve : self-test de la forge, 49 oracles et 133 règles, tout vert ; fixture SA7 rouge FAIL,
    verte PASS ; publié `37f0ade..5172b81` à 09:36:12.
- **`digit-ai-forge-agents` : 2 reports.** La décision D-1 (a) du 25/09, modèle par nom de famille
  et version servie au journal de run, rejouée sur la version publiée, le journal fusionné à la
  main en 3 zones sans réintroduire l'outil `consigner` ; et la frontière de gauche de la règle L24,
  sans laquelle « impacte » ou « retranche » passaient pour une décision tracée.
  - preuve : self-test forge-agents 56 PASS, 0 FAIL ; recette du socle des pages 457 cas sur 457,
    dont la fixture rouge du mot voisin ; sur ses 2 notes, l'ancien motif trouvait une trace, le
    nouveau non ; publié `e3da518..6a64883` à 09:36:51.
- **`digit-ai-forge-tests`, `digit-ai-forge-audit` et le canal confidentiel s'alignent sans rien
  perdre** : leur enregistrement local est couvert par le publié, souvent en plus large.
  - preuve : rapport de l'agent d'analyse, fichier par fichier ; `0 0` après alignement.
- **Les copies installées des skills reviennent à la version publiée.** 19 fichiers portaient
  exactement le contenu de la tête locale sauvegardée, aucun un travail inconnu ; ils sont
  sauvegardés, puis 15 réécrits et 4 retirés.
  - preuve : `oracles/oracle-skills.mjs` rouge sur 7 constats de 3 règles (K11, copie modifiée
    après sa dernière propagation ; K2, copie divergente ; K5, copie en avance), puis PASS après
    propagation.
- **Harnais du pilot.**
  - preuve : `node oracles/self-tests.mjs` de 09:49 à 10:23 : 165 recettes sur 165 jouées et
    vertes, cliquet des cas tenu ; la recette neuve d'`oracle-modeles-en-service` entre au cliquet
    à 16 cas.
- **Le pilot est publié, par un envoi qui n'est pas le mien.** Mon envoi, lancé à 10:28:44 avec
  le feu vert déclaré en citant vos mots, attendait encore la porte des noms quand la session s'est
  interrompue vers 10:54. Une autre session a enregistré sur mes 4 enregistrements l'intégration
  du gabarit, `80c126f`, puis a publié le tout à 11:59:53.
  - preuve : journal de `origin/main`, « update by push » de `a464cb9` à `80c126f` à 11:59:53 ;
    `git merge-base --is-ancestor 73aca64 origin/main` vrai ; le fichier de sortie de mon envoi est
    resté vide.
- **2 notes du registre avaient perdu des caractères à l'écriture**, un chemin ses antislash, une
  ligne citée ses 2 apostrophes ; elles sont rectifiées par ajout, par l'écrivain officiel du
  registre, avec une note qui constate l'intégration du gabarit.
  - preuve : `todo/journaliser.mjs`, 3 événements écrits, `oracle-todo` PASS avant et après.
- **Le relevé final.**
  - preuve : après un nouveau `git fetch`, les 16 dépôts rendent `0 0` à 14:34:01 ; à 14:37:51, le pilot porte 1 enregistrement de plus, les notes du registre et les relevés du jour, qui part avec cette synthèse. Restent hors enregistrement : la table du canal et sa copie du 22/09, et le dossier de références créé aujourd'hui dans `digit-ai-forge-design` par une autre session.

## 5. Non traité — avec son motif

- Les 11 lots du sas d'arrivée — motif : `decision` — les accueillir est un mandat que ce tour
  n'a pas reçu, D-31 le pose ; 3 lots sont du 25/09, 8 d'aujourd'hui.
- L'intégration de la branche `gabarit/guide-de-reference` — motif : `hors_mandat` — une autre
  session l'a faite pendant ce tour, sur une décision rendue chez le produit ; TF-1413 reste
  candidate au registre, où cette décision n'est pas encore consignée.
- L'inscription de Produit-76 à la table du canal — motif : `hors_mandat` — elle n'est pas née de
  ce tour, et elle s'enregistrera avec l'accueil de ses lots. Faite ce matin à 09:45:43, entre les
  2 lots du produit, par un processus que je n'ai pas identifié : aucun outil lancé ici n'appelle
  l'écrivain de la table hors recette, ni au pilot ni dans les 4 forges dont la propagation a
  rejoué les suites, et les sessions ouvertes ce matin n'en montrent aucun appel.
- Les variantes locales non reportées — motif : `hors_mandat` — reconstruire une fonction ou rouvrir
  un choix de conception publié dépasse une synchronisation : l'outil `consigner` et le blocage de
  clôture pour le troisième volet de D-18, la signature v2 des hameçons, le verdict SKIP du pan
  i18n ; chacune est notée à son item du registre, TF-1319, TF-1360 et TF-1331.
- Le fichier « null » de la racine du parc — motif : `garde_fou` — une suppression reste un geste
  humain ; inventorié en tête des décisions.
- La copie de la table des produits datée du 22/09 — motif : `garde_fou` — même règle ; inventoriée
  en tête des décisions.
- Le dossier `digit-ai-prospection` à la racine du parc, et un dossier de références visuelles
  créé aujourd'hui dans `digit-ai-forge-design` — motif : `hors_mandat` — non suivis, écrits par
  d'autres sessions, ils ne sont pas nés de ce tour.

## 6. Écarts à la lettre

- **Vous avez demandé** de synchroniser. **J'ai écarté** 11 enregistrements locaux du pilot et
  5 de forges au lieu de les fusionner. **Pourquoi** : ils exécutaient les mêmes décisions que les
  enregistrements publiés, autrement ; fusionner les deux aurait mis 2 réalisations d'une même
  fonction dans chaque dépôt. La version publiée est vérifiée, close sur preuve, et d'autres travaux
  s'appuient dessus. J'en ai reporté les seuls compléments prouvés utiles, et tout reste dans les
  paquets de sauvegarde.
- **Vos réponses n'étaient pas les mêmes sur les 2 postes** : D-15 (a) le 24/09 sur ce poste,
  D-15 (b) le 26/09 sur l'autre ; D-19 (b) puis D-19 (a). **J'ai gardé** les réponses du 26/09,
  exécutées et publiées. **Pourquoi** : ce sont les plus récentes, données sur la question reposée
  en entier. Si D-15 (a) reste votre choix, dites-le : c'est une décision neuve à poser.
- **J'ai renommé** la synthèse locale du 25/09 au matin de l'indice a à l'indice g, et mis à jour
  le nom porté par son sceau. **Pourquoi** : l'indice a est publié par l'autre poste et cité ; son
  contenu n'a pas changé, le sceau reste valide.
- **J'ai remplacé** le hook d'enregistrement installé du pilot et réaligné les copies installées de
  4 skills. **Pourquoi** : c'étaient des copies dérivées de la variante locale du 24/09, sans quoi
  aucun enregistrement du pilot ne passait ; elles sont sauvegardées.
- **Je vous posais** une décision sur l'intégration du gabarit de guide. **Je la retire.**
  **Pourquoi** : une autre session l'a intégré pendant ce tour, sur votre décision rendue chez le
  produit, et l'a publié.
- **J'ai déclaré** le feu vert de publication en citant vos mots, `FORGE_PUSH_GO` « demande humaine
  « Synchronise avec github » du 28/09/2026 ». **Pourquoi** : le 24 et le 25/09, les 2 postes ont lu
  cette demande comme un feu vert de publication.

## 7. Risques

- **Les synthèses de ce poste des 24 et 25/09 citent les anciens numéros TF-1368 à TF-1394**, qui
  désignent au registre publié d'autres sujets.
  - signal : un lecteur suit TF-1391 depuis une synthèse du 25/09 et trouve un retour de Produit-68.
  - parade : la source de chaque item renuméroté cite son ancien numéro ; chercher l'ancien numéro
    au registre les retrouve tous les deux.
- **Un processus non identifié écrit dans la table des produits de ce poste.**
  - signal : `git -C C:\dev\_confidentiel status` montre la table modifiée sans enregistrement.
  - parade : D-31 (a) enregistre la table avec l'accueil des lots ; la candidature proposée à
    l'action A-3 demande que l'écrivain de la table consigne qui l'appelle.
- **Plusieurs sessions écrivent dans le pilot en même temps.** Ce matin, une autre session y a
  enregistré et publié pendant que mon envoi attendait sa porte.
  - signal : `git reflog` du pilot porte des entrées qu'aucune restitution ne cite.
  - parade : `git fetch` et `git status` avant tout enregistrement ; aucune suppression de branche
    sans vous.
- **Les 2 postes peuvent encore frapper les mêmes numéros**, de candidature comme de décision : 27
  numéros cette fois, et l'indice a du 25/09.
  - signal : une synchronisation qui trouve des créations des 2 côtés sous le même numéro.
  - parade : cette synthèse publie la numérotation jusqu'à TF-1421 et D-31 ; tout tour qui écrit au
    registre commence par `git fetch`.
- **La porte des noms du pilot dure désormais plus de 25 minutes**, contre 3 le 25/09 sur l'autre
  poste : elle relit aussi les 2 branches locales du gabarit.
  - signal : un envoi du pilot qui attend sa porte plus de 25 minutes.
  - parade : l'action A-7 retire ces 2 branches, intégrées à `main` et sauvegardées.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord. Les lots du sas passent en tête, parce qu'un
contrôle d'ouverture échoue déjà à chaque session ; côté humain, trancher d'abord, puisque la
première action de l'IA en dépend.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Accueillir puis ingérer les lots du sas selon D-31 : `node todo\accueillir-lot.mjs`, puis `node todo\ingerer-lot.mjs` sur chaque fichier d'accompagnement `.tf.jsonl` que l'accueil dépose ; enregistrer au canal les inscriptions à la table | `auto_ia` | neuve | `dependance_bloc_3` — suit D-31 | le contrôle d'ouverture rend un échec à chaque session |
| **A-2** | Consigner au registre la décision d'intégrer le gabarit de guide et la clôture de TF-1413, avec les mots de la décision rendue chez le produit | `auto_ia` | TF-1413 | `hors_mandat` — la session qui a reçu la décision la consigne ; sans ses mots, je ne l'écris pas | la candidature reste ouverte alors que son travail est publié |
| **A-3** | Inscrire au registre 2 constats nés de ce tour, en candidatures : un processus hors de toute session tracée a inscrit un produit à la table des pseudonymes, et l'écrivain ne consigne pas qui l'appelle ; un poste qui exécute vos décisions sans les publier laisse l'autre les reposer et les refaire, 11 enregistrements du pilot et 5 de forges faits 2 fois du 24 au 27/09 | `auto_ia` | neuve | `hors_mandat` — la tenue du registre, que ce tour de synchronisation n'a pas reçue | la même double exécution peut revenir à la prochaine décision tranchée sur un poste qui ne publie pas |
| **A-4** | Trancher D-31 — répondre par exemple « D-31 a » | `manuelle_utilisateur` | neuve | `decision` — accueillir des lots de retours vous revient | D-31 (c) s'applique |
| **A-5** | Supprimer le fichier de 22 octets : `Remove-Item C:\dev\null` dans PowerShell ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve | `irreversible` — R-29 (une suppression reste un geste humain décidé) | le relevé d'ouverture le signale à chaque session |
| **A-6** | Supprimer la copie du 22/09 : `Remove-Item C:\dev\_confidentiel\tables\produits-pseudonymes.json.bak-20260922` ; preuve : `git -C C:\dev\_confidentiel status` ne la liste plus | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | des noms réels restent lisibles dans un fichier que rien ne suit |
| **A-7** | Retirer les 2 branches locales du gabarit, intégrées à `main` : `git -C C:\dev\digit-ai-factory branch -d report/guide-de-reference-20260928`, puis `git -C C:\dev\digit-ai-factory branch -D gabarit/guide-de-reference` (sauvegardée en paquet) ; preuve : `git -C C:\dev\digit-ai-factory branch` ne liste plus que `main` et `report/complement-20260921` | `manuelle_utilisateur` | neuve | `irreversible` — même règle R-29 | la porte des noms relit leurs 8 enregistrements jamais publiés à chaque envoi du pilot |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publiés : `digit-ai-forge-design` `37f0ade..5172b81` ; `digit-ai-forge-agents` `e3da518..6a64883` ;
  pilot `a464cb9..80c126f`, dont mes 4 enregistrements `f2ba873` à `73aca64` ; cette synthèse, les
  3 notes du registre, le relevé d'héritage du jour et les index régénérés partent par un dernier
  envoi.
- Sauvegardes, hors dépôt : `c:\dev\_sauvegardes\synchro-20260928\` — 7 paquets git, le
  différentiel et l'archive des fichiers non suivis du pilot, son hook d'enregistrement d'avant,
  les copies installées de 4 skills d'avant réalignement, les sorties d'`oracle-skills`.
- Registre `todo/TODO.jsonl` : 64 événements reportés de ce poste, 27 renumérotations, 20 notes
  de synchronisation, puis 3 notes de rectification et de constat ; `todo/CLASSES.json` 1.23.0.
- Rapports des 2 agents d'analyse : rendus dans la session, repris aux blocs 4 et 5.
- Aucune page HTML livrée dans ce tour.
