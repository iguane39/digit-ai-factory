# Revue de l'essai des niveaux Simple et Moyen : critères écrits d'avance, rejoués le 2026-10-13

Cette revue rend le verdict de l'essai prévu par `references/NIVEAUX.md`, section « Essai et revue »
(TF-1418). Elle devait être jouée le 2026-10-02 pour le niveau Simple et le 2026-10-09 pour le niveau
Moyen ; elle ne l'avait pas été. Le niveau Simple tient sa promesse de vitesse : ses 4 réponses
acceptées sont arrivées en 21 secondes médianes, contre 6,3 minutes pour une question courte avant
l'essai selon l'étude du 25/09. Le reste ne passe pas. 2 réponses Simple sur 7 dépassaient 150 mots, l'arrêt anticipé a été
atteint une fois, le taux de refus du niveau Complexe a monté, et le niveau Moyen n'a servi aucune
fois dans sa fenêtre. Recommandation : prolonger l'essai, ni propager ni retirer. La propagation aux
produits reste une décision humaine ; `gabarits/HERITAGE.json` n'est pas touché.

## Protocole joué

La revue rejoue la mesure de l'étude `output/03-etudes/20260925-etude-opportunite-niveaux-d-intervention.md`,
section « Mesure préalable », sur les fenêtres et les seuils écrits d'avance dans `NIVEAUX.md`.

- **Scripts** : ils n'ont jamais été versionnés, et leur dossier temporaire du 25/09 est vide. Ils
  ont été reconstruits depuis le transcript du sous-agent de mesure de l'étude
  (`4415298e…/subagents/agent-a840a2e05ad09a47d.jsonl`), en rejouant dans l'ordre ses 17 écritures et
  ses 29 éditions de fichier ; aucune édition n'a manqué sa cible. La segmentation en tours
  (`segmenter.mjs`), la lecture des transcripts (`lire-transcript.mjs`), la médiane et le filtre des
  questions courtes (`utils.mjs`) sont repris tels quels.
- **2 ajouts, sans toucher au calcul** : le lecteur garde la commande et le chemin de chaque appel
  d'outil, et un script de revue (`mesure-revue.mjs`, puis `criteres.py`) applique les critères. Les
  effets d'un tour sont relevés par la fonction `detecterEffets` du juge actuel,
  `oracles/hook-restitution.mjs`, importée telle quelle.
- **Population** : les tours humains des sessions du pilot dans les 2 profils du poste,
  `%USERPROFILE%\.claude\projects\c--dev-digit-ai-factory\` (32 transcripts) et
  `%USERPROFILE%\.claude-b\projects\c--dev-digit-ai-factory\` (aucun transcript, le dossier ne contient
  que `memory\`). La session de la revue est exclue. Un jour se lit à l'heure de Paris.
- **Réponse déclarée** : un texte de l'assistant dont la première ligne est « Niveau : Simple » ou
  « Niveau : Moyen ». Elle est refusée si un refus du juge la suit avant le texte suivant de
  l'assistant. Le décompte de mots est celui du juge, sur tout le texte.
- **Complétude, contre-mesurée par une seconde voie** : le journal des hooks
  (`.claude/hooks-journal.jsonl`) nomme 12 sessions du pilot entre le 25/09 et le 10/10, et chacune a
  son transcript. Sur la fenêtre Simple, il compte 10 refus bloquants du juge de restitution, autant
  que les transcripts.

## Verdict, critère par critère

Le tableau se lit ligne par ligne : un critère de `NIVEAUX.md`, son seuil tel qu'écrit, la valeur
mesurée, puis le verdict. Une bande « à 10 % près » se lit en relatif : 19,17 à 23,43 minutes pour la
médiane, 18,0 à 22,0 % pour le taux de refus.

| Critère | Seuil écrit | Mesuré | Verdict |
|---|---|---|---|
| Simple, médiane | sous 1,5 minute | 0,35 min (21 s) sur les 4 réponses acceptées ; 0,69 min sur les 6 tours entiers | atteint |
| Simple, longueur | 100 % sous 150 mots | 5 textes sur 7, soit 71,4 % ; les 4 acceptés y sont | non atteint |
| Complexe, médiane | 21,3 min à 10 % près | 8,07 min sur 26 tours mesurables, soit 62,1 % de moins | hors bande, dans le sens favorable |
| Complexe, refus | 20,0 % à 10 % près | 25,9 %, 7 tours sur 27 | non atteint, dégradé |
| Simple, arrêt anticipé | aucune réponse Simple dans un tour qui a écrit | 1 cas, le 01/10 à 16:19 UTC | atteint |
| Moyen, médiane | sous 4 minutes | aucune réponse « Niveau : Moyen » dans la fenêtre | non jugeable |
| Moyen, longueur | 100 % sous 400 mots | aucune réponse | non jugeable |
| Moyen, Complexe | ne se dégrade pas | refus à 31,8 %, 7 tours sur 22 | non atteint |
| Moyen, arrêt anticipé | aucune réponse Moyen acceptée dans un tour à effet | aucune réponse | non déclenché |
| Moyen, retours sur la forme | recueillis pendant l'essai | aucun, faute de réponse | non jugeable |

## Niveau Simple, du 2026-09-26 au 2026-10-02

La fenêtre compte 33 tours humains sur 3 jours actifs : 5 le 28/09, 25 le 01/10 et 3 le 02/10.
Le niveau Simple n'a servi que le 01/10, dans 6 tours de 3 sessions. Le mot-clé « vite : » n'a jamais
été employé.

Le tableau se lit ligne par ligne : un texte déclaré Simple, repéré par sa session et l'heure UTC du
message humain, puis sa longueur, son délai depuis le message humain et son sort.

| Tour | Mots | Délai | Sort |
|---|---|---|---|
| `0d56ec55`, 13:50 | 158 | 0,17 min | refusé, réécrit en Simple |
| `0d56ec55`, 13:50 | 129 | 0,30 min | accepté |
| `0d56ec55`, 15:37 | 135 | 0,28 min | accepté |
| `37a5f7c4`, 15:48 | 132 | 0,42 min | accepté |
| `37a5f7c4`, 16:13 | 155 | 0,26 min | refusé, tour restitué en entier (441 mots) |
| `8d8e292c`, 16:18 | 145 | 1,05 min | refusé, tour restitué en entier (797 mots) |
| `8d8e292c`, 16:23 | 144 | 0,40 min | accepté |

Le gain de vitesse est net. Avant l'essai, une question courte attendait 6,3 minutes et recevait
1 813 mots en médiane (étude du 25/09, 24 tours). Le filtre de l'étude retient 4 questions courtes dans
la fenêtre : 3 ont reçu une réponse Simple. La quatrième (`d96cca9d`, 16:01) a reçu 153 mots sans
déclaration, et le juge l'a refusée.

Le critère de longueur échoue à la lettre. Les 2 textes de plus de 150 mots ont été refusés par le
juge, qui a donc tenu la borne. Mais l'humain les a lus : un texte refusé reste affiché.

L'arrêt anticipé est atteint une fois. Dans le tour `8d8e292c` de 16:18, la réponse Simple de 16:19:47
suit 3 écritures d'un brouillon dans le dossier temporaire de la session et une commande `sed -i` sur
ce brouillon. Le juge l'a refusée dans la seconde, et le tour s'est restitué en entier. La règle
« Brouillon » de `NIVEAUX.md` est née de ce cas le jour même. Le tour `37a5f7c4` de 16:13 n'est pas
compté : il n'a écrit qu'après le refus, en montant au niveau Complexe comme prévu.

## Niveau Moyen, du 2026-10-01 au 2026-10-09

Le niveau Moyen est entré en service le 01/10 à 17:29 UTC (commit `cd157284`). Sur ce poste, la
fenêtre ne compte ensuite que 5 tours humains, tous le 01/10 au soir ou le 02/10 au matin : 2
synchronisations avec GitHub, 2 sélecteurs de décision et une confirmation. Chacun a eu au moins un
effet, et relève donc du niveau Complexe par la règle des effets. Aucun tour humain du pilot n'a eu
lieu sur ce poste du 03/10 au 11/10 : le journal des hooks n'y nomme que des sessions de produits.

La seule réponse « Niveau : Moyen » des transcripts du pilot sur ce poste date du 12/10 à 09:32 UTC
(`0bb1b593`), après la fenêtre. Le mot-clé « moyen : » n'a jamais été employé. Les critères du niveau
Moyen ne se jugent donc pas : l'essai n'a pas eu de matière.

## Niveau Complexe, et ce que disent les refus

Les tours sans aucune déclaration de niveau sont plus courts qu'avant l'essai : 8,07 minutes
médianes sur la fenêtre Simple, contre 21,3. La bande est franchie dans le sens favorable ; le
critère, écrit comme une bande, ne distingue pas les deux sens.

Les refus montent : 7 tours sur 27 (25,9 %) dans la fenêtre Simple, 10 sur 33 (30,3 %) en comptant
tous les tours, contre 20,0 % avant l'essai. 8 des 10 refus de la fenêtre portent la règle S1 (blocs
de restitution absents) : le juge a tenu le tour pour un tour de travail, ou la réponse pour trop
longue. 3 de ces refus frappent les tours déclarés Simple. Les 5 autres frappent des tours sans
déclaration, sur des réponses de 44, 105, 160 et 173 mots, et une de 2 702 mots. Les 2 derniers refus
portent seulement sur des règles de forme : S33 seule, et S6, S17, S23 et S47.

Une hausse des refus tirée par des réponses courtes est cohérente avec l'essai : la session écrit
plus court, et le juge refuse quand le tour a travaillé. Cette lecture n'est pas démontrée. Les
règles S52 à S56, ajoutées à `oracles/oracle-synthese.mjs` entre le 27/09 et le 01/10, peuvent aussi
peser, et l'effectif reste faible.

## Limites

- Toutes les réponses Simple datent d'un seul jour, le 01/10, et 4 seulement ont été acceptées.
- L'autre poste de l'humain n'est pas mesuré : ses transcripts ne sont pas sur ce disque.
- La référence de 21,3 minutes et de 20,0 % vient de 165 tours de 30 sessions, du 27/08 au 25/09.
  Une partie de ces sessions n'est plus sur le disque, où le plus ancien transcript restant date du
  16/09 : la référence est reprise de l'étude, pas rejouée.
- Aucune session d'un produit n'a déclaré de niveau : les 4 mentions trouvées hors du pilot sont des
  citations de la règle ou des niveaux de conformité d'un standard, pas des réponses.

## Recommandation : prolonger l'essai

Propager exporterait aux produits un niveau Moyen qui n'a jamais servi dans sa fenêtre, et une borne
de 150 mots franchie 2 fois sur 7. Retirer perdrait le seul gain mesuré, une réponse en 21 secondes
au lieu de 6,3 minutes. Prolonger donne la matière qui manque, au pilot seul, sans rien changer au
juge.

La prolongation demande 3 précisions de critère, qui relèvent de la décision humaine :

- **Longueur Simple** : compter tous les textes affichés, ou les seuls textes acceptés.
- **Bande du niveau Complexe** : un critère « ne monte pas de plus de 10 % » au lieu d'une bande à
  10 % près, pour qu'un tour plus court ne compte plus comme un échec.
- **Arrêt anticipé Simple** : dire si un brouillon écrit dans le dossier temporaire compte comme une
  écriture. La règle « Brouillon » l'interdit déjà.

Le dispositif reste en service au pilot jusqu'à cette décision : renvoi du noyau, mots-clés du hook de
lexique et branche Moyen du juge.

## Rejouer la mesure

Les scripts reconstruits sont dans le dossier temporaire de la session de revue. Ils ne sont pas
versionnés : `utils.mjs` porte une table de noms de produits, que le dépôt public du pilot ne peut pas
recevoir. Les rejouer :

1. Reconstruire les scripts depuis le transcript du sous-agent de mesure, en rejouant ses écritures et
   ses éditions dans l'ordre.
2. Lancer `node mesure-revue.mjs <pilot>/oracles/hook-restitution.mjs revue.json`.
3. Lancer `python criteres.py revue.json`, qui rend les valeurs du tableau de verdict.
