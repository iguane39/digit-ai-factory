# Retours forges — un oracle qui vérifie la présence, et une accusation portée à tort — 20260825c

- **Contexte** : l'exploitant demande pourquoi `forge-seo-geo` n'a pas vu une dérive de
  `llms.txt` que je venais de lui signaler. L'enquête donne deux réponses : la forge ne
  regarde effectivement pas le contenu de ce fichier — et **la dérive que je lui reprochais
  de ne pas voir n'existait pas**. J'avais comparé deux grandeurs qui ne mesurent pas la
  même chose, puis mis en cause un outil sur cette base.
- **Références** : `digit-ai-forge-seo-geo`, nœud 58 « Accès & Directives IA » ;
  `seo/analyse/11-geo/06-acces-directives-ia/_fiche.md` du projet ; commit `dae294f`.
  Lots précédents : `20260823c`, `20260824a`/`b`, `20260825a`/`b`.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce que j'ai affirmé, et ce qui était vrai

Ce chapitre ouvre sur mon erreur plutôt que sur celle de la forge, parce que c'est elle qui
a orienté toute l'enquête — et parce qu'une accusation portée à un outil coûte plus cher
qu'une simple erreur de lecture.

J'ai annoncé à l'exploitant que `llms.txt` annonçait des capacités fausses sur les cinq
gîtes, tableau comparatif à l'appui, et j'en ai tiré que la forge SEO-GEO aurait dû le voir.
Vérification faite ensuite :

| Source | Le Chalet | Le J1 | Le Saloon | Le Familial |
|---|---|---|---|---|
| ce que le **site affiche** (`capCourt`) | 2 pers. | 2-6 | 4-6 | 6-10 |
| ce que **`llms.txt`** annonce | 2 pers. | 2-6 | 4-6 | 6-10 |
| `capMin`/`capMax` de `data.mjs` | 1-2 | 1-6 | 3-6 | 5-10 |

`llms.txt` est **rigoureusement conforme** à ce que le site affiche. Ce que j'avais pris pour
un minimum commercial était `capMin`, le **seuil du filtre de recherche** — combien de
personnes peuvent chercher et voir ce gîte. Deux notions différentes, légitimement
différentes. Surfaces et prix concordent également sur les cinq, et les maximums
correspondent à ce que Beds24 accepte réellement.

## Les deux retours

Le premier porte sur mon erreur, le second sur l'écart de portée qui, lui, existe bel et
bien — mais n'a rien laissé passer dans ce cas précis.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-30 | majeur | **Deux grandeurs comparées sans vérifier qu'elles mesurent la même chose.** J'ai rapproché `capMin` d'un texte commercial parce que les deux ressemblaient à une capacité minimale, sans jamais chercher ce que `capMin` sert à faire — il suffisait de suivre son unique usage, le filtre de la page réservation. La conclusion a été livrée à l'exploitant sous forme d'un tableau d'écarts, puis **retournée contre un outil de la forge**. C'est la huitième occurrence en trois jours de la famille remontée au lot `20260823c`, avec une variante inédite : la source n'était ni partielle ni périmée, elle était **hors sujet**. Comparer deux valeurs justes ne prouve rien tant que leur définition n'est pas établie. | Étendre RT-11 d'un cran : avant de conclure d'un écart entre deux valeurs, **établir que les deux mesurent la même grandeur**. Le test praticable tient en une question — *qui consomme cette valeur, et pour quoi faire ?* Suivre l'usage d'une donnée coûte quelques secondes ; ici, cela aurait évité une affirmation fausse, une accusation infondée et un aller-retour complet. Corollaire opposable : **une mise en cause d'un outil de la forge se vérifie avant d'être formulée**, au même titre qu'un constat de défaut. |
| RT-31 | mineur | **Le nœud 58 vérifie la présence des directives IA, jamais leur exactitude.** Sa question d'audit est explicite : « Les agents des moteurs génératifs peuvent-ils accéder au site, et les directives IA sont-elles posées ? » Sa source requise est un crawl de `robots.txt` et `llms.txt`. Son constat sur ce projet porte entièrement sur l'accès : *« le serveur répond HTTP 200 et 17 421 octets à l'identique à un navigateur, à GPTBot, à ClaudeBot et à PerplexityBot »*. Exact, et sans rapport avec le contenu. Mesuré par ailleurs : `llms` n'apparaît que **deux fois** dans tout le code Python de la forge, jamais pour en lire le contenu. Un `llms.txt` annonçant des tarifs périmés passerait donc le nœud sans une remarque — et le fichier existe précisément pour être lu par des modèles, qui le reprendront sans le vérifier. | Un nœud distinct, « cohérence des directives IA », qui confronte ce que `llms.txt` affirme aux données du site : tarifs, capacités, surfaces, URLs, langues déclarées. Peu coûteux parce que le fichier est structuré. À défaut, que le nœud 58 **déclare sa portée** dans son `non_juge` — « présence et accessibilité, jamais exactitude du contenu » — pour que « les directives IA sont posées » ne se lise pas comme « les directives IA sont justes ». |

## Ce qui a été fait côté projet

Bien que la dérive n'existât pas, le fichier était **écrit en dur** dans `build.mjs` : juste par
la vigilance de son auteur, non par construction. Il est désormais dérivé de `data.mjs` et
des fichiers de langue, et un contrôleur `check-llms.mjs` confronte le résultat aux sources.
Deux défauts réels ont été corrigés au passage — cinq langues sur sept étaient absentes, et
l'atout affiché était identique pour les cinq gîtes, donc sans valeur distinctive.

Le contrôleur déclare ce qu'il ne juge pas, ce qui est exactement ce que RT-31 demande au
nœud 58.

## Remarques restées au produit

> Section ajoutée le **2026-08-26**, après l'arrivée du gabarit `RETOURS-FORGES.md`
> (`TF-0626`) : ce lot avait été rédigé sans lui et ne portait donc ni R-45 ni R-46.
> L'ajout est **purement additif** — aucun retour, aucun chiffre, aucune formulation
> d'origine n'a été touché. Le contenu ci-dessous est reconstitué depuis les commits
> de la fenêtre du lot.

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Corrigé chez le produit | Verdict de généralisation |
|---|---|
| Écriture de `llms.txt` dérivé des sources et de `build/check-llms.mjs` qui le confronte à `data.mjs`. | **Généralisable → REMONTÉ en RT-31** : un nœud d'oracle vérifiait la présence des directives, jamais leur exactitude. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des gabarits de `gabarits\documents\`
n'a servi sur ce projet : aucun document du dépôt ne porte d'identifiant `gd-…`. La section
est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46, qui vise les livrables issus de
`gabarits\documents\`, et est consignée faute de canal plus juste : **ce lot lui-même a été
produit sans son gabarit de méthode**, `RETOURS-FORGES.md` étant absent du dépôt jusqu'à
`TF-0626` du 26/08/2026. C'est la cause directe de l'ajout rétroactif signalé ci-dessus.

## Confirmations positives

- **La question de l'exploitant a produit plus que la réponse attendue.** Elle m'a fait
  vérifier une affirmation que j'avais livrée sans la contrôler, et c'est ainsi que l'erreur
  a été trouvée — pas par un oracle.
- **La fiche du nœud 58 est irréprochable dans ce qu'elle dit.** Verdict `partiel`, preuve
  `T1`, constat factuel et daté. Le défaut n'est pas qu'elle mente : c'est qu'elle réponde à
  une question plus étroite que celle qu'on croit lui poser — même famille que RT-13.

## Ordre recommandé

1. **RT-30** — c'est la règle de méthode, elle vaut pour toute session, et son coût est nul.
2. **RT-31** — l'écart de portée du nœud 58, à traiter avec RT-13 du lot `20260824a` dont il
   partage exactement la forme.
