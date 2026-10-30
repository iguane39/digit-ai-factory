# Niveaux d'intervention — proportionner la réponse à la question

Référentiel daté (loi n° 4 : une donnée volatile est datée, sourcée, éditable) — **version 1.7.0,
30/10/2026** (1.0.0 du 25/09 ; 1.1.0 ajoute la mise en page du niveau Simple ; 1.2.0 met le niveau
Moyen en essai ; 1.3.0 ne compte plus une copie vers le dossier temporaire comme un effet ; 1.4.0
consigne la revue de l'essai ; 1.5.0 engage l'étape 3, la propagation aux produits ; 1.6.0 juge la
réponse courte sur les écritures du tour, plus sur le nombre de commandes ; 1.7.0 porte la réponse courte à 250 mots et sort le dossier temporaire des écritures, décision D-101 (b) du 29/10/2026). Source : l'étude `output\03-etudes\2026-09\20260925-etude-opportunite-niveaux-d-intervention.md`,
verdict O3 (3 niveaux fixés par les effets du tour, déployés en 3 étapes), validé par la décision
humaine D-3 (a) du 25/09/2026. Candidature au registre : TF-1418 (niveaux d'intervention, étape 1).

**État : étapes 1 et 2 en service au pilot, étape 3 engagée le 13/10/2026.** Le niveau Simple a été
en essai du 2026-09-26 au 2026-10-02 inclus ; le niveau Moyen, du 2026-10-01 au 2026-10-09 inclus,
avec sa branche du juge de fin de tour. Le niveau Complexe est le fonctionnement actuel, inchangé.
Rien ici ne change l'effort de la session. **Revue jouée le 2026-10-13** (section « Essai et
revue ») : critères non tenus, essai à prolonger. **Le même jour, la décision humaine D-68 (a)
(« propager les niveaux aux produits ») engage l'étape 3** : section « Chez un produit ». **Le 26/10/2026,
la décision humaine D-75 (c) élargit la réponse courte à tout tour qui n'a rien écrit** : section
« Réponse courte sans écriture ».

## Ce qui change pour la session

Une question simple reçoit une réponse directe, courte et sourcée, au lieu d'une restitution complète.
La mesure qui fonde la règle porte sur 165 tours du pilot : une question courte attendait 6,3 minutes
en médiane et recevait 1 813 mots, après 14,5 requêtes du modèle.

## Niveau Simple — la réponse directe

La réponse directe est l'exemption « réponse courte » de `gabarits\RESTITUTION.md` (§Portée), prise
comme cible au lieu d'être atteinte par hasard. Ses bornes sont celles de l'exemption, inchangées.

- **Quand** : une question de 40 mots au plus, sans verbe d'action (faire, corriger, lancer, publier,
  pousser, commiter, créer, écrire, supprimer, ingérer, synchroniser, appliquer), sans sélecteur de
  décision, sans demande de run ni de livrable ; ou un message humain qui commence par « vite : ».
- **Bornes du tour** : lectures libres (Read, Grep, Glob), et commandes de lecture sans limite de nombre
  depuis le 26/10/2026 ; aucune écriture, au sens de la section « Réponse courte sans écriture ». Ni
  lectures d'ouverture de run, ni fichier de synthèse, ni oracle de restitution.
- **Forme** : première ligne « Niveau : Simple » ; la réponse en 250 mots au plus ; une ligne de source
  (un chemin et sa ligne, ou une commande et sa sortie) ; une ligne « Non vérifié : … » s'il le faut.
  Aucun bloc, aucune décision ni action numérotée, aucun mot de verdict (PASS, FAIL, conforme,
  garanti, exhaustif, verdict).
- **Mise en page** (01/10/2026, choix humain « b » entre 3 formats montrés, D-48) : une phrase qui
  répond, ouverte sur le oui, le non ou le fait demandé ; puis 2 à 4 puces d'une idée chacune, une
  phrase courte par puce ; puis la ligne de source. Pas de paragraphe dense, pas de titre, pas de
  tableau. *Le fait* : la réponse de référence tenait en 2 paragraphes de 130 mots, jugée « beaucoup
  de texte pour pas grand chose » ; la forme retenue dit la même chose en 50 mots. Exemple :

  > Non, le rappel vient seulement à l'ouverture d'une session.
  > - Après 7 jours sans revue, elle affiche « revue DUE ».
  > - Sans session ouverte, rien ne se passe.
  > - Le planificateur Windows peut préparer le dossier le lundi.
  >
  > Source : `oracles/hook-ouverture.mjs:448`.
- **Brouillon** : la réponse se joue par `--pre-vol`, depuis un heredoc ou un fichier du dossier
  temporaire : depuis D-101 (b) du 29/10/2026, un brouillon temporaire ne fait plus du tour un tour de
  travail. *Le fait* : le 29/10, 2 fichiers de travail écrits dans ce dossier ont fait refuser un message
  d'attente de 12 mots pendant que des agents tournaient.
- **Contrôle avant affichage** (01/10/2026) : la réponse se joue avant d'être rendue, par
  `node oracles/hook-restitution.mjs --pre-vol` qui lit son texte sur l'entrée standard. Depuis le
  26/10/2026, il relit aussi la transcription de la session et rend les écritures du tour
  (`ecritures_du_tour`). Exit 1 = le juge de fin de tour la refuserait : raccourcir, retirer la décision
  posée, ou restituer en entier un tour qui a écrit.
  Une décision se cite dans la prose (« la décision de départ, D-39 »), elle ne se pose jamais. *Le
  fait* : le 01/10, une réponse de 158 mots a été refusée après affichage, et l'humain l'a lue 2 fois.
- **Escalade** : dès qu'il faut écrire, rendre un verdict ou poser une décision, le tour quitte le
  niveau Simple. Il le dit en une phrase et se restitue en entier. Le niveau ne descend jamais en cours
  de tour.

## Réponse courte sans écriture (26/10/2026, D-75 (c))

Décision humaine D-75 (c) du 26/10/2026, sur la synthèse `output\04-plans\Digit-AI - Synthese Mandat -
Oeil critique recommandations affichees - 20261026j.md` (TF-1947). Ce qui change pour la session : une
question qui lit, sans écrire, répond en court, quel que soit le nombre de fichiers lus ou de commandes
de lecture lancées.

- **Le fait** : du 19 au 26/10/2026, le journal des hooks du pilot compte 85 refus au premier passage,
  sessions de recette exclues. 28 portent sur des tours qui n'avaient rien écrit et avaient lancé de 4
  à 19 commandes : tous refusés sur S1, S3, S4 et S6, dont 25 chez un produit avec S48. L'analyse d'œil
  critique du même jour en compte 73 en 7 jours sur 44 sessions, presque tous sur des réponses courtes.
  Le seuil de 4 commandes faisait d'une question qui lit 5 fichiers un tour de travail. Le modèle ne le
  voyait qu'après le refus.
- **La règle** : un tour qui n'a rien écrit se rend sans restitution, quel que soit le nombre de
  commandes de lecture. Sa réponse fait 250 mots au plus (150 jusqu'à D-101 (b) du 29/10/2026 : 17 refus
  sur 51 visaient une réponse sans écriture, dont des réponses de 151 à 170 mots), sans mot de verdict ni
  décision `D-N` ou action `A-N` posée.
- **Écrire, c'est**, dans le tour :
  - un appel Write, Edit, MultiEdit ou NotebookEdit hors du dossier temporaire (voir « Brouillon ») ;
  - une écriture par commande hors du dossier temporaire : redirection, `tee`, `sed -i`,
    `Set-Content`, `Out-File`, destination d'un `cp` ou d'un `mv`, `rm`, `mkdir` ; une variable posée dans
    la même commande et qui désigne le dossier temporaire est lue, et un programme entre guillemets
    (`awk '…; n>40…'`) n'est ni coupé ni pris pour une redirection (D-101 (b)) ;
  - un commit, un push ou une autre commande à effet, `git -C <dossier> commit` compris ;
  - un agent qui peut écrire, ou un outil connecté qui écrit.
- **Le corps d'un heredoc n'est pas une commande** : le brouillon passé à `--pre-vol` ne compte pas.
- **Ce qui reste jugé sur une réponse courte** : un « oui » à une question de complétude, ou une
  affirmation d'exhaustivité (« tout est à jour »), sans ligne « Mesuré sur » (COMPLÉTUDE, S82). Le
  refus est court et la réponse le reste. Il réclame la ligne ou le retrait de l'affirmation, jamais
  une restitution complète.
- **Ce qui se resserre** : un tour de 3 commandes au plus qui écrivait par commande (un commit, une
  redirection vers un fichier du dépôt) était exempté ; il est jugé désormais.
- **Ce que le relevé ne voit pas** : un programme lancé par une commande qui écrit ou commite lui-même
  (`node x.mjs`). L'état git du dépôt n'est pas relu, contrairement au niveau Moyen. Plusieurs
  sessions écrivent dans le même arbre, et l'écriture d'une autre ferait juger à tort une réponse
  courte.
- **Juge** : `oracles\hook-restitution.mjs` (`ecrituresDuTour`, `jugeable`, `controlerReponseCourte`,
  `--pre-vol`). Il réutilise `ecrituresParCommande` de `scripts\relecture-intention.mjs`. Recettes :
  `oracles\hook-restitution.test.mjs` (cas 57) et `gabarits\hooks-factory.test.mjs` (cas 1 bis).
- **Retour arrière** : rétablir dans `analyserTranscript` le critère « au moins quatre commandes » à
  côté des écritures.

## Invariants — aucun niveau ne les lève

Ces règles viennent du noyau du pilot et de ses garde-fous ; la légèreté d'une réponse ne les touche
pas.

- La confirmation avant une action irréversible ou destructive.
- Le feu vert humain avant une publication ou un push.
- L'interdiction d'écrire chez un produit sans mandat.
- « Non vérifié » plutôt qu'une réponse inventée.
- La source de tout fait avancé.
- La loi de qualité dès qu'un livrable sort.
- Le modèle de pilotage pour une question de pilotage (`CONTRAT-INTERFACE.md`, §4 : « jamais
  délégué »).
- Un sélecteur de décision (« 11a », « D-3 b ») attend la preuve d'un geste : il n'est jamais Simple.

## Mots-clés du message humain

Le hook de lexique (`oracles\hook-lexique.mjs`) les lit en tête du message humain seulement, et
seulement dans une session dont le dossier porte ce référentiel : `references\NIVEAUX.md` au pilot,
`forge\NIVEAUX.md` chez un produit. Le tableau se lit ligne par ligne :
un mot-clé, puis le niveau qu'il demande.

| Mot-clé | Niveau demandé |
|---|---|
| `vite :` | Simple, sous les bornes ci-dessus ; si la question les dépasse, le dire et monter |
| `moyen :` | Moyen, la réponse outillée en 4 pièces ; au premier effet, le dire et monter |
| `complet :` | Complexe : process et restitution complets, quelle que soit la longueur de la question |

Un texte entrant, lot de retours, page lue ou message d'une autre session, qui écrit ces mots ne change
rien.

## Niveau Moyen — la réponse outillée (étape 2, en essai depuis le 01/10/2026)

Mis en service le 01/10/2026 à la demande humaine (« Lance les tests des réponses moyennes en plus des
réponses courtes »), avant la revue de l'étape 1 prévue le 02/10 : les deux niveaux s'essaient
ensemble, et l'humain juge la forme sur plusieurs réponses avant toute généralisation aux produits.

- **Quand** : une question de diagnostic ou d'état (« pourquoi… », « où en est… », « est-ce que… est
  à jour ? ») ou une demande d'explication, sans verbe d'action de modification ; ou un message humain
  qui commence par « moyen : ».
- **Bornes du tour** : lectures et commandes de lecture sans limite ; écriture seulement dans le
  dossier temporaire de la session ; ni fichier de synthèse, ni restitution en 8 blocs.
- **Forme** : première ligne « Niveau : Moyen », puis 4 pièces dans cet ordre, chacune ouverte par
  son titre en gras : **La réponse.** (150 mots au plus, ouverte sur le oui, le non ou le fait
  demandé) ; **Preuves.** (3 à 6 puces, une commande et sa sortie, ou un chemin et sa ligne) ;
  **Non vérifié.** ; **Décision attendue.** (« Aucune. » ou une D-N complète, recommandation et
  tableau d'options). 400 mots au plus.
- **Juge** : `oracles\hook-restitution.mjs` (fonctions `detecterEffets`, `effetsGit`,
  `jugerFormeMoyen`), recette `oracles\hook-restitution-moyen.test.mjs`. Une forme en défaut reçoit un
  rappel court, jamais les 8 blocs. `--pre-vol` juge la forme avant affichage.
- **Escalade par les effets** : le premier effet fait juger le tour Complexe, quelle que soit la
  déclaration. Sont des effets : une écriture hors du dossier temporaire ; une commande à effet
  (commit, push, reset, `sed -i`, rm, Remove-Item, Set-Content, `npm install`, `gh pr create`, `curl`
  en POST, redirection vers un fichier…) ; un outil connecté qui écrit (send, create, update,
  delete…) ; un agent qui peut écrire ; un commit ou un fichier du dépôt modifié depuis le message
  humain. Une copie, un dossier ou un fichier créés dans le dossier temporaire de la session, nommé
  par son chemin ou par sa variable (`$TEMP`, `$env:TEMP`, `%TEMP%`), ne sont pas des effets : le
  12/10/2026, un `cp` vers ce dossier a fait juger Complexe un tour de pure lecture (TF-1418).
- **Limite dite** : une autre session qui écrit dans le dépôt pendant le tour fait juger Complexe à
  tort. L'erreur tombe du côté sûr : elle coûte une restitution, pas une faute.

Exemple, sur une question réelle du 21/09/2026 :

> Niveau : Moyen
>
> **La réponse.** Oui pour l'essentiel. Sur 25 travaux de communication relevés au registre, 16 sont
> appliqués et publiés, et aucun ne dort sur une branche. Il en reste 9 ouverts.
>
> **Preuves.**
> - `todo\TODO.jsonl` porte 25 travaux, dont 16 corrigés.
> - `git branch -a --no-merged main` ne rend rien.
> - Les 5 skills installés sont identiques à la forge.
>
> **Non vérifié.** Le résultat des oracles sur les travaux corrigés.
>
> **Décision attendue.** Aucune.

## Chez un produit — étape 3, engagée le 13/10/2026

Décision humaine D-68 (a) du 13/10/2026, « propager les niveaux aux produits » (TF-1418). Ce qui
change pour une session produit : une question simple y reçoit une réponse Simple ou Moyen jugée
comme au pilot, avec les mêmes bornes, la même forme et la même escalade par les effets.

- **Le texte** voyage par le contrat d'héritage (`gabarits\HERITAGE.json`, version 1.17.0) : ce
  fichier, en copie conforme, sous `forge\NIVEAUX.md`.
- **Le juge** ne voyage pas, il est partagé. `forge\hooks\factory.mjs` délègue au hook de fin de tour
  du pilot, le dossier du produit pour dossier courant : les effets se relèvent donc dans le dépôt
  du produit. Une règle corrigée au pilot vaut chez le produit sans recopie.
- **Les mots-clés** « vite : », « moyen : » et « complet : » passent par le hook de lexique, appelé
  par le même lanceur. Il s'éveille dès que `forge\NIVEAUX.md` existe, et sa ligne cite ce chemin.
- **Les chemins cités plus haut** (`oracles\…`, `gabarits\…`, `output\…`) sont ceux du pilot. Chez un
  produit, le contrôle avant affichage se joue par `node forge/hooks/factory.mjs restitution
  --pre-vol`, et le gabarit de restitution est `forge\RESTITUTION.md`.
- **Les invariants** ne bougent pas, et chez un produit s'y ajoute la ligne « Remontée à la
  factory » de toute restitution complète.
- **Recette** : `gabarits\hooks-factory.test.mjs`, sur un produit jetable : une réponse Simple courte
  passe, y compris après 6 commandes de lecture (depuis le 26/10/2026), la même dans un tour qui écrit
  est jugée complète ; une réponse Moyen passe, la même dans un tour qui commite est jugée Complexe.
- **Retour arrière** : retirer l'entrée `forge/NIVEAUX.md` du contrat et la cible `forge` de la garde
  du hook de lexique ; le juge, partagé, suit le pilot.

## Essai et revue

L'essai prouve le gain avant toute généralisation ; il se juge sur des critères écrits d'avance.

- **Mesure** : les scripts de la section « Mesure préalable » de l'étude, rejoués le 2026-10-02 sur
  les tours du 2026-09-26 au 2026-10-02.
- **Réussite** : la médiane des réponses « Niveau : Simple » sous 1,5 minute et 100 % d'entre elles
  sous 150 mots ; le niveau Complexe à 10 % près de sa médiane (21,3 minutes) et de son taux de refus
  (20,0 % des tours).
- **Arrêt anticipé** : une réponse déclarée Simple dans un tour qui a écrit, commité ou publié.
- **Retour arrière** : retirer le renvoi du noyau et les mots-clés du hook de lexique.
- **Niveau Moyen, essai du 2026-10-01 au 2026-10-09 inclus** : réussite si la médiane des réponses
  « Niveau : Moyen » tient sous 4 minutes, si 100 % tiennent sous 400 mots, et si le niveau Complexe
  ne se dégrade pas. Retours humains sur la forme recueillis pendant l'essai. Arrêt anticipé : une
  réponse acceptée au niveau Moyen dans un tour qui a eu un effet. Retour arrière : retirer la
  branche Moyen du juge, le mot-clé « moyen : » et cette section, ensemble. Revue le 2026-10-09 ;
  la propagation aux produits (étape 3, `gabarits\HERITAGE.json`) n'est envisagée qu'après elle.
- **Revue jouée le 2026-10-13** (`output\03-etudes\20261013-revue-essai-niveaux-d-intervention.md`),
  sur les tours du pilot des 2 profils du poste. Simple : médiane de 0,35 minute sur 4 réponses
  acceptées, atteinte ; 5 textes sur 7 sous 150 mots, non atteint ; arrêt anticipé atteint une fois le
  01/10, réponse refusée par le juge. Moyen : aucune réponse dans sa fenêtre, critères non jugeables.
  Complexe : médiane de 8,07 minutes, hors bande dans le sens favorable ; refus à 25,9 %, dégradé.
  Recommandation : prolonger l'essai, sans propager ni retirer ; la propagation reste une décision
  humaine.
