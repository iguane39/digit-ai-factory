# Retours forges — préparer le réceptacle d'un secret plutôt que le décrire en prose — 20260824c

- **Contexte** : l'exploitant fait remarquer que, sachant qu'il va me fournir un jeton API
  Cloudflare, j'aurais dû préparer d'avance le fichier destiné à le recevoir au lieu de lui
  dicter des noms de variables dans un message. La remarque est juste et se généralise : le
  même défaut s'est produit trois fois en deux jours, avec trois fournisseurs différents.
- **Références** : session des 23 et 24/08/2026 sur `Produit-02.com`, `.env` et
  `.env.example` du projet. Lots précédents du même run : `20260823a` à `20260824b`.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Trois fournisseurs, trois fois le même aller-retour évitable

Ce chapitre pose les faits avant d'en tirer une règle, parce que c'est leur répétition — et
non leur gravité individuelle — qui justifie un artefact.

Pour chacun des trois services intégrés pendant ce run, j'ai demandé un secret en décrivant
en prose, dans un message de conversation, le nom des variables et les portées à cocher. À
chaque fois l'humain a dû reporter cette prose vers un fichier, et à chaque fois quelque
chose s'est perdu en route.

| Service | Ce que j'ai fait | Ce qu'il en a coûté |
|---|---|---|
| Railway | dicté `RAILWAY_TOKEN` en prose | le CLI attend `RAILWAY_API_TOKEN` pour un jeton de **compte** ; message d'erreur trompeur, diagnostic complet nécessaire |
| OVH | dicté quatre lignes de portées en prose | **deux jetons créés pour rien** — le premier avec des chemins vides, le second sans `GET /domain/zone` |
| Cloudflare | j'allais recommencer | évité par la remarque de l'exploitant |

Le fichier `.env.example` du projet, pourtant **committé et fait pour ça**, ne documentait que
Railway. Les quatre clés OVH que j'ai ajoutées à `.env` le 23/08 n'y ont jamais été reportées :
un développeur reprenant le dépôt aujourd'hui ne saurait pas qu'elles existent.

## Ce que la Factory doit porter

Deux artefacts, l'un de comportement, l'autre de contrôle. Le second existe pour que le
premier ne dépende pas de la mémoire de la session.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-20 | majeur | **Un secret attendu se prépare, il ne se décrit pas.** Quand une session sait qu'un identifiant va lui être fourni, la prose est le pire véhicule : elle oblige l'humain à transcrire, elle ne survit pas à la conversation, et elle laisse le nom exact de la variable à l'interprétation. Mesuré ici : trois fournisseurs, trois aller-retours, dont **deux jetons OVH créés pour rien**. Le geste juste tient en une phrase — écrire d'abord la clé vide dans le fichier de configuration, avec en commentaire la procédure de création, les portées exactes et la commande de vérification, puis demander uniquement de coller la valeur. | Règle de socle : **avant de demander un secret, en préparer le réceptacle.** La clé vide et son commentaire vont dans le fichier de configuration ignoré par git ; le même bloc, valeurs vides, va dans le gabarit committé. La demande à l'humain se réduit alors à « colle la valeur ici », sans nom de variable à retenir. Le commentaire porte trois champs : où créer, quelles portées, comment vérifier. |
| RT-21 | mineur | **Le gabarit d'environnement n'est confronté à rien.** `.env.example` est committé et documente le contrat de configuration du projet, mais rien ne vérifie qu'il couvre les clés réellement lues par le code. Preuve : `.env` porte onze clés, `.env.example` n'en documentait que sept. Les quatre clés OVH ajoutées le 23/08 étaient invisibles pour quiconque reprend le dépôt — et la même chose se serait produite avec Cloudflare. | Oracle de parité de configuration : toute clé lue par le code ou présente dans `.env` a son entrée, valeur vide, dans le gabarit committé — et réciproquement, une clé du gabarit que rien ne lit est signalée. Fixture rouge : un `.env` portant une clé absente du gabarit. Coût faible, il s'agit de comparer deux listes. |

## Ce qui a été fait dans la foulée

Ce chapitre distingue le correctif local, appliqué immédiatement, du correctif de fond qui
appartient à la Factory.

Le réceptacle Cloudflare est en place dans `.env` — `CLOUDFLARE_API_TOKEN` et
`CLOUDFLARE_ACCOUNT_ID`, vides, commentés. Le gabarit `.env.example` reçoit les blocs OVH et
Cloudflare qui lui manquaient. Trois pièges découverts pendant le run y sont désormais écrits
plutôt que perdus : la distinction `RAILWAY_TOKEN` / `RAILWAY_API_TOKEN`, l'obligation de
cliquer « + » après chaque portée OVH sous peine d'obtenir un jeton à chemins vides, et le
fait que la page OVH de création se sert en `GET` mais renvoie 404 en `HEAD`.

## Confirmation positive

- **La remarque vient de l'humain, encore une fois.** Quatrième fois en deux jours après la
  capture Railway, le texte illisible et l'apex HTTPS. Ce lot n'est pas un mea culpa : c'est
  la preuve que le retour d'usage attrape des choses qu'aucun oracle du dépôt ne cherche, et
  qu'il faut donc l'outiller plutôt que s'en remettre à lui.

## Ordre recommandé

1. **RT-20** — c'est la règle de comportement, elle vaut pour toute session et tout
   fournisseur, et son coût de mise en œuvre est nul.
2. **RT-21** — le contrôle qui rend la règle vérifiable au lieu de reposer sur la discipline.
