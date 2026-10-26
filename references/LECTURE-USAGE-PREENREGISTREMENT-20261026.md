# Lecteur d'usage de la restitution — pré-enregistrement de l'essai hors service, 26/10/2026

Écrit le 26/10/2026, **avant toute lecture** : aucun lecteur n'a été lancé à cette date, ni sur un texte du banc ni sur un cas positif. La date du commit de ce fichier est la preuve d'antériorité : `scripts\compter-lecture-usage.mjs` refuse le comptage si une lecture est datée d'avant lui, ou si le manifeste des cas ou la consigne du lecteur ne portent plus l'empreinte inscrite en bas de ce fichier. Tout ce qui suit est donc écrit sans avoir vu un seul verdict de lecteur, et ne se corrige plus après le premier : un seuil jugé mal placé se discute dans le rapport, il ne se déplace pas.

## Ce qui est mesuré, et pourquoi

Décision humaine D-84 (a) du 26/10/2026, mot pour mot : « Essai hors service sur le banc. Le relecteur rejoue les restitutions du banc avec des seuils écrits d'avance ; rien ne change pour vos sessions ; la mise en service vous sera reposée avec les chiffres. » Budget accepté par l'humain : de 0,7 à 2,1 millions de jetons, une fois.

Le protocole est celui de l'option O3 de l'étude `output\03-etudes\20261021-etude-opportunite-relecteur-de-bon-sens-restitution.md` (sections 4 et 5, mesures M5 et M8). La question : un lecteur neuf, qui n'a que le texte d'une restitution et la consigne de `references\LECTURE-USAGE.md`, verrait-il avant l'affichage ce que l'humain a ensuite dû réclamer, sans crier sur les restitutions qui n'avaient rien de tel ? Deux nombres répondent : combien de cas où l'humain a dû réclamer le contenu, le lien ou ce qu'on attendait de lui le lecteur voit (le rappel), et combien de textes du banc il signale à tort.

Rien n'est branché. Ni `--prejuger`, ni le hook de fin de tour, ni `oracles\hook-restitution.mjs` ne changent. La mise en service est le second temps de l'étude : elle sera reposée à l'humain avec les chiffres, jamais déduite du verdict du comptage.

## Les cas

Ils sont rangés hors du dépôt, dans le canal confidentiel, parce qu'un texte peut porter un nom de client : `<racine>\_confidentiel\bancs\lecture-usage\` (un texte par fichier sous `textes\`, et le manifeste `cas.json`). Les identifiants sont neutres (`LU-01` à `LU-33`), dans un ordre mélangé par une graine inscrite au manifeste. L'étiquette n'est que dans le manifeste ; aucun texte ne la porte.

- **27 négatifs : les textes du banc des restitutions** (`oracles\banc-restitutions\restitutions.mjs`, corpus du canal). Le banc compte 27 refus, chacun avec le texte accepté qui l'a suivi. Les négatifs sont les 27 textes ACCEPTÉS, ceux de la mesure M5 de l'étude (de 3 473 à 48 463 caractères, médiane 6 808). Les 27 textes refusés ne sont pas retenus : ils ont été refusés pour leur forme (blocs absents, règles S1 à S6), et rien n'établit qu'ils étaient sans défaut d'usage. Un négatif est donc « un texte rendu après un refus, accepté par le juge de forme du moment, sans retour d'usage connu », pas « un texte prouvé sans défaut d'usage ».
- **6 positifs : des messages finaux réellement affichés, suivis d'un message humain qui réclame ce qui manquait.** Population cherchée : les transcriptions de sessions de ce poste, pilot et produits, du 01/10/2026 au 26/10/2026, par trois recherches de motifs dans les réponses humaines (l'une d'elles remonte au 20/09/2026). Un candidat est retenu seulement si les 4 conditions tiennent, relues à la main avec leur contexte : le texte est le dernier message de l'assistant avant la réponse humaine, sans autre message entre les 2 ; la réponse humaine réclame le contenu, le lien, le sens de ce qu'on lui demande ou ce qu'on attend de lui ; cette réponse a été écrite APRÈS l'affichage du texte (un message mis en file d'attente avant lui est écarté : un candidat l'a été à la vérification des horodatages) ; un lecteur du texte seul peut en principe voir le défaut (un écran qui ne correspond pas à celui de l'humain, un lien qui s'ouvre sur le mauvais compte ne se voient pas dans le texte). La preuve de chaque positif (session, lignes, horodatages, réponse humaine citée) est au manifeste, avec la liste des candidats écartés et leur motif. Un seul des 6 est le cas fondateur de TF-1936 (le 19/10/2026, relire la semaine 2 sans contenu ni lien) ; le second cas du 19/10 que décrit TF-1936 n'a pas été identifié dans les transcriptions de ce poste.

Chaque positif porte des **ancres**, fixées au manifeste avant toute lecture : les passages du texte qui portent la demande que la réponse humaine conteste. Elles servent à décider, sans jugement après coup, si le lecteur a vu CE défaut-là.

## La règle de comptage

- Un lecteur neuf par texte, une lecture par texte. La première réponse valide est la seule. Aucune relecture « pour voir », aucun choix de la meilleure.
- Une réponse est valide si elle respecte le format de la rubrique (verdict cohérent avec la liste des signalements, 3 signalements au plus, chacun avec sa question, sa ligne citée et la question de l'humain). Une réponse invalide se rejoue UNE fois avec un lecteur neuf. Si la seconde est invalide aussi, elle compte contre l'essai : un positif non vu, un négatif signalé à tort. Aucun autre rejeu n'existe.
- Un signalement ne compte que si sa ligne citée existe dans le texte (aux majuscules, accents, espaces et signes de mise en forme près). Une citation inventée n'est jamais une preuve de rien ; sur un négatif, elle reste un faux signalement, puisque le lecteur a bien signalé.
- Tous les textes sont lus dans l'ordre de `node scripts\compter-lecture-usage.mjs --lister`, par le modèle et l'effort que le pilot nomme à son journal de campagne, et chaque sortie est enregistrée par `--enregistrer`, qui date la lecture.

## Ce qui compte comme « vu » pour un cas positif

Un positif est **vu** quand le lecteur a rendu le verdict `signale` ET qu'au moins un de ses signalements cite une ligne qui existe dans le texte ET dont la forme normalisée contient au moins une ancre du cas. Les autres issues :

- **signalé ailleurs** : le lecteur a signalé le texte, mais aucune ligne citée valide ne porte une ancre. Ce n'est pas un cas vu. Le comptage le publie à part, pour que le rapport puisse en parler, sans le compter.
- **non signalé** : verdict `utilisable`. Pas vu.
- **illisible** : voir la règle de comptage. Pas vu.

La question que le lecteur prête à l'humain ne sert pas à décider : seule la ligne citée est comparée aux ancres.

Un négatif est **signalé à tort** dès que le lecteur a rendu le verdict `signale`, quelle que soit la ligne citée.

## Les seuils

Ceux de l'étude (section 5), non modifiés :

- **rappel** : au moins 4 positifs vus sur 6 ;
- **faux signalements** : au plus 3 textes du banc signalés à tort sur 27, avec un seul lecteur (11 %) ;
- **moins de 6 positifs** : la mesure est donnée mais NON CONCLUANTE ;
- **au-dessus des seuils** (rappel ou faux signalements non tenus) : essai à deux lecteurs d'accord, ce qui double les jetons. Un cas n'est alors signalé que si les 2 lecteurs l'ont signalé ; un positif n'est vu que s'il l'est par les 2. Les seuils sont les mêmes. L'essai à deux lecteurs est une décision du pilot sur le verdict `AU_DESSUS_DES_SEUILS`, dans le budget que l'humain a accepté pour l'essai, et il se rend compte à l'humain ;
- **toujours au-dessus avec 2 lecteurs** : retenir O0 et O2 de l'étude (rien de plus que la règle ciblée TF-1936, puis les contrôles mécaniques) et écrire pourquoi.

Le nombre de positifs est 6, donc 4 vus. Pour tout autre nombre de positifs, le script garde la proportion de l'étude (4 sur 6) en l'arrondissant à l'entier supérieur, sans jamais descendre sous 4 ; ce cas n'est pas celui de cet essai.

Les verdicts du comptage : `TENU`, `AU_DESSUS_DES_SEUILS` (un lecteur) ou `NON_TENU` (2 lecteurs), `NON_CONCLUANT`, `INCOMPLET` (réponse manquante ou à rejouer), `INVALIDE_CHRONOLOGIE` (une lecture date d'avant ce fichier).

## Les limites de la mesure

- **Les négatifs sont tous des synthèses du pilot**, rédigées entre le 13/09/2026 et le 15/10/2026 ; **les positifs viennent surtout de sessions de produits** (4 sur 6), où les guides et les actions manuelles sont plus nombreux. Un lecteur peut donc séparer les 2 familles par leur style plutôt que par leur défaut d'usage. Cette différence n'est pas mesurable ici, et un taux de faux signalements mesuré sur des synthèses du pilot ne dit pas ce que le lecteur ferait sur les restitutions d'un produit.
- **Les faux signalements sont comptés sur les 27 textes**, comme l'écrit l'étude, alors que 17 seulement demandent quelque chose à l'humain selon le critère de la rubrique (l'étude en comptait 15 sur 27 avec un critère voisin, écrit autrement). En service, le lecteur ne serait appelé que sur ces 17 : le comptage publie donc à part les faux signalements de ces textes-là, sans qu'ils changent le verdict.
- **Un négatif n'est pas un texte sans défaut d'usage.** Si le lecteur en signale un à raison, il est compté à tort : c'est le prix d'une mesure qui n'est pas jugée après coup.
- **Le rappel mesure le défaut tel que l'humain l'a ressenti**, pas un défaut établi à part. Les 6 positifs sont un petit nombre : un cas de plus ou de moins déplace le rappel de 17 points.
- **La recherche des positifs se fait par motifs**, puis par lecture de chaque candidat : les cas que ces motifs n'attrapent pas n'y sont pas, et le rappel mesuré ne vaut que pour ceux qui y sont.
- **Un seul lecteur par texte** : le hasard d'un lecteur sur un cas n'est pas mesuré, seul l'essai à deux lecteurs le borne.
- **Les jetons réellement consommés** se relèvent à la fin avec `node scripts\relever-flotte.mjs --depuis <début> --journal <journal> --etiquette lecture-usage` ; l'étude estimait 33 lectures et 0,7 à 2,1 millions de jetons. Ici, 33 lectures.

## Les écarts à la lettre de la décision et de l'étude

- **« Le relecteur rejoue les restitutions du banc »** : les 27 textes acceptés du banc sont rejoués ; les 27 textes refusés, non (motif ci-dessus).
- **« Ne se joue que sur un texte qui demande quelque chose à l'humain »** : le critère est écrit et mécanique, mais l'essai remet quand même au lecteur les 10 textes du banc qui ne le satisfont pas, pour tenir le dénominateur de 27 de l'étude. La consigne du lecteur lui dit de rendre « utilisable » quand rien n'est demandé.
- **« Au moins 4 cas positifs vus sur 6 »** : « vu » est précisé par les ancres ci-dessus. Sans cette précision, « vu » se déciderait après coup.
- **Réponse illisible** : l'étude n'en parle pas ; la règle est ici (un rejeu, puis contre l'essai).

## Données figées

Lues par `scripts\compter-lecture-usage.mjs`. Les empreintes sont des SHA-256 : celle du manifeste est calculée sur les octets de `cas.json`, celle de la consigne sur le bloc entre les 2 repères de `references\LECTURE-USAGE.md`, fins de ligne unifiées.

```json
{
  "version": "1.0.0",
  "date": "2026-10-26",
  "decision": "D-84 (a) du 26/10/2026",
  "seuils": {
    "positifs_minimum": 6,
    "rappel_reference": { "vus": 4, "sur": 6 },
    "faux_signalements_max": 3,
    "textes_du_banc": 27
  },
  "cas": { "positifs": 6, "negatifs": 27 },
  "empreintes": {
    "manifeste_cas_json": "88eaf44a5fe8983263071e144ed4c6ae1158cbdaa3ef05d306fe078af542e787",
    "consigne_lecteur": "830c9af414e6a2dd2de1fde9f30e0b779801f6b80a097f3e8cf60827bd944b47"
  },
  "budget_jetons": { "minimum": 700000, "maximum": 2100000 }
}
```

## La commande de comptage

```
node scripts\compter-lecture-usage.mjs --reponses <dossier de réponses> [--reponses <dossier du second lecteur>]
```

Sans autre option, le manifeste est lu à `<racine>\_confidentiel\bancs\lecture-usage\cas.json`. Sortie : le rappel, les faux signalements, le verdict par rapport à ces seuils ; `--json` donne le détail cas par cas. Exit 0 quand le comptage est rendu, 1 quand une empreinte, un texte ou une date ne tient pas (aucun comptage), 2 pour un mauvais usage.

Revue : le 08/11/2026, jour de la revue de la relecture d'intention (plan de revue de l'étude). Ce jour-là, le résultat du comptage, les jetons réellement consommés et le nombre de règles de restitution nées d'un retour humain depuis le 21/10 se confrontent.
