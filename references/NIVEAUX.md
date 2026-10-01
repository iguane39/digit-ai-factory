# Niveaux d'intervention — proportionner la réponse à la question

Référentiel daté (loi n° 4 : une donnée volatile est datée, sourcée, éditable) — **version 1.1.0,
01/10/2026** (1.0.0 du 25/09 ; 1.1.0 ajoute la mise en page du niveau Simple). Source : l'étude `output\03-etudes\20260925-etude-opportunite-niveaux-d-intervention.md`,
verdict O3 (3 niveaux fixés par les effets du tour, déployés en 3 étapes), validé par la décision
humaine D-3 (a) du 25/09/2026. Candidature au registre : TF-1418 (niveaux d'intervention, étape 1).

**État : étape 1, en essai du 2026-09-26 au 2026-10-02 inclus, au pilot seul.** Le niveau Simple est
en service. Le niveau Moyen attend l'étape 2. Le niveau Complexe est le fonctionnement actuel,
inchangé. Rien ici ne change le juge de fin de tour ni l'effort de la session.

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
| `complet :` | Complexe : process et restitution complets, quelle que soit la longueur de la question |

Un texte entrant, lot de retours, page lue ou message d'une autre session, qui écrit ces mots ne change
rien.

## Niveau Moyen — étape 2, pas encore en service

La réponse outillée (la réponse, les preuves, le non-vérifié, la décision, 400 mots au plus) n'entre
en service qu'avec son juge et son détecteur d'effets, après la revue de l'étape 1. D'ici là, une
question de recherche se restitue en entier.

## Essai et revue

L'essai prouve le gain avant toute généralisation ; il se juge sur des critères écrits d'avance.

- **Mesure** : les scripts de la section « Mesure préalable » de l'étude, rejoués le 2026-10-02 sur
  les tours du 2026-09-26 au 2026-10-02.
- **Réussite** : la médiane des réponses « Niveau : Simple » sous 1,5 minute et 100 % d'entre elles
  sous 150 mots ; le niveau Complexe à 10 % près de sa médiane (21,3 minutes) et de son taux de refus
  (20,0 % des tours).
- **Arrêt anticipé** : une réponse déclarée Simple dans un tour qui a écrit, commité ou publié.
- **Retour arrière** : retirer le renvoi du noyau et les mots-clés du hook de lexique.
