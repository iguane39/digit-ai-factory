# Niveaux d'intervention — proportionner la réponse à la question

Référentiel daté (loi n° 4 : une donnée volatile est datée, sourcée, éditable) — **version 1.2.0,
01/10/2026** (1.0.0 du 25/09 ; 1.1.0 ajoute la mise en page du niveau Simple ; 1.2.0 met le niveau
Moyen en essai). Source : l'étude `output\03-etudes\20260925-etude-opportunite-niveaux-d-intervention.md`,
verdict O3 (3 niveaux fixés par les effets du tour, déployés en 3 étapes), validé par la décision
humaine D-3 (a) du 25/09/2026. Candidature au registre : TF-1418 (niveaux d'intervention, étape 1).

**État : étapes 1 et 2 en essai au pilot seul.** Le niveau Simple est en essai du 2026-09-26 au
2026-10-02 inclus ; le niveau Moyen, du 2026-10-01 au 2026-10-09 inclus, avec sa branche du juge de
fin de tour. Le niveau Complexe est le fonctionnement actuel, inchangé. Rien ici ne change l'effort
de la session.

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
- **Bornes du tour** : lectures libres (Read, Grep, Glob) ; 3 commandes au plus ; aucune écriture. Ni
  lectures d'ouverture de run, ni fichier de synthèse, ni oracle de restitution.
- **Forme** : première ligne « Niveau : Simple » ; la réponse en 150 mots au plus ; une ligne de source
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
- **Brouillon** : la réponse se joue par `--pre-vol` depuis un heredoc, jamais depuis un fichier écrit
  par Write ou Edit, même temporaire. *Le fait* : le 01/10, 3 brouillons écrits dans le dossier
  temporaire ont fait du tour un tour de travail ; `--pre-vol` a rendu exit 0, puis le juge de fin de
  tour a exigé la restitution complète.
- **Contrôle avant affichage** (01/10/2026) : la réponse se joue avant d'être rendue, par
  `node oracles/hook-restitution.mjs --pre-vol` qui lit son texte sur l'entrée standard (une des 3
  commandes). Exit 1 = le juge de fin de tour la refuserait : raccourcir, ou retirer la décision posée.
  Une décision se cite dans la prose (« la décision de départ, D-39 »), elle ne se pose jamais. *Le
  fait* : le 01/10, une réponse de 158 mots a été refusée après affichage, et l'humain l'a lue 2 fois.
- **Escalade** : dès qu'il faut écrire, lancer une 4e commande, rendre un verdict ou poser une décision,
  le tour quitte le niveau Simple. Il le dit en une phrase et se restitue en entier. Le niveau ne
  descend jamais en cours de tour.

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
seulement dans une session dont le dossier porte ce référentiel. Le tableau se lit ligne par ligne :
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
  humain.
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
