# Retours forges — un mot juste dans une phrase juste, et pourtant le mauvais mot — 20260825e

- **Contexte** : complément demandé par l'exploitant après le lot `20260825d`. Ce lot-là
  traitait la méthode de recherche et l'audit `forge-seo-geo` ; il laissait deux angles
  morts que l'exploitant a nommés — la **production** des traductions, et leur **détection
  outillée**. Le cas qui les révèle est mesurable : `it.mjs` contient **99 occurrences** du
  mot « gîte » dans des phrases parfaitement traduites en italien, où ce mot signifie
  « excursions ».
- **Références** : `build/i18n/it.mjs` du projet, `build/check-traductions.mjs`, sondes
  Google Suggest et liens interlangues Wikipédia. Lots précédents : `20260823c` à
  `20260825d`.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Le défaut qu'aucun contrôle existant ne peut voir

Ce chapitre isole ce qui distingue ce cas de tous les défauts de traduction déjà outillés :
ici, rien n'est incomplet, rien n'est recopié, rien n'est mal écrit.

Les contrôles disponibles cherchent trois choses, et le défaut échappe aux trois.

| Contrôle | Ce qu'il cherche | Verdict sur `it.mjs` |
|---|---|---|
| pan i18n de forge-tests | complétude des clés, parité des routes, densité de mots-outils | **PASS** — et il le déclare : « la JUSTESSE d'une traduction n'est PAS jugée » |
| `check-traductions.mjs` (ce projet) | chaînes identiques au français, donc recopiées | **0 signalement** sur les 99 occurrences |
| relecture humaine d'un italophone | la phrase est-elle correcte ? | **elle l'est** — c'est de l'italien juste |

*« Regalatevi una parentesi di relax nei nostri gîte, alle porte della baia di
Mont-Saint-Michel »* est une phrase italienne irréprochable. Elle emploie simplement un mot
qui, en italien, désigne des sorties à la journée. Un relecteur natif ne le corrigerait pas
nécessairement : il y verrait un emprunt au français, pas une erreur.

Deux sources indépendantes établissent le problème. **Google Suggest** : `gite organizzate
mont saint michel`, `gite in giornata da parigi`, `gite in barca da bonifacio`. **Wikipédia**,
par ses liens interlangues : « Gîte rural » possède un article dédié en anglais et en
néerlandais — le mot y est un emprunt lexicalisé — et **aucun équivalent** en allemand,
espagnol, italien ni portugais.

## Les deux retours

Le premier fixe la connaissance et la rend contrôlable ; le second déplace la contrainte au
moment où le mot entre, plutôt qu'après.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-34 | majeur | **La connaissance terminologique n'a nulle part où vivre.** « Gîte est un faux ami en italien » a été établi par deux sources aujourd'hui, et n'existe aujourd'hui que dans une conversation. Aucun fichier du projet ne porte, par langue, le terme retenu, les termes proscrits et le motif. Conséquence directe : la prochaine session réécrira le mot, et aucun contrôle ne le verra — mesuré, 99 occurrences dans un seul fichier de langue. Le défaut est d'autant plus tenace que **tout est correct par ailleurs** : clés complètes, phrases justes, aucune recopie. | Un **glossaire terminologique par langue**, artefact de projet et non de forge : pour chaque terme métier, le mot retenu, les mots proscrits, et le **motif** de la proscription — c'est le motif qui empêche qu'on le rétablisse par ignorance. Une donnée, pas du code. Le contrôle devient alors trivial : chercher les termes proscrits dans chaque fichier de langue, échouer bruyamment. Fixture rouge : un fichier de langue employant un terme déclaré proscrit. À rapprocher de **RT-9** (une valeur porte sa source et sa date) : ici, un choix de vocabulaire porte son motif. |
| RT-35 | majeur | **Rien n'impose de consulter la terminologie avant d'écrire.** Même avec un glossaire, le contrôle n'attrape le mot qu'**après coup** : la traduction est écrite, relue, commitée, puis rejetée. Le coût est réel — sur ce projet, corriger les 99 occurrences après écriture est un travail sans rapport avec celui d'avoir ouvert le glossaire au départ. Et l'angle mort ne tient pas à ce projet : **tout produit multilingue de la forge le partage**, puisque aucune étape ne prescrit d'où vient le vocabulaire d'une locale. | Règle de socle : **toute production de traduction part du glossaire du projet ; un terme métier ne se traduit pas au fil de l'eau.** Si le glossaire n'existe pas encore, l'établir est la première étape de la traduction, pas une régularisation ultérieure. Corollaire utile, tiré de ce cas : un terme n'est **pas** traduisible par défaut — un emprunt peut être lexicalisé dans une langue cible (« gîte » en anglais et en néerlandais, article Wikipédia dédié) et absent ou trompeur dans une autre. Le glossaire tranche par langue, jamais globalement. |

## Ce que ces deux retours ne couvrent pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos, et parce que c'est
précisément la discipline que les lots précédents réclament aux oracles.

La **justesse** d'une traduction reste hors de portée : aucun script ne dira si un registre
est adapté ni si une tournure sonne juste. Ce qui devient contrôlable, c'est l'emploi d'un
terme **déclaré proscrit** — rien de plus. Et le glossaire lui-même n'a de valeur que si les
termes qu'il porte ont été établis par des sources, ce que **RT-32** du lot précédent exige.

## Remarques restées au produit

> Section ajoutée le **2026-08-26**, après l'arrivée du gabarit `RETOURS-FORGES.md`
> (`TF-0626`) : ce lot avait été rédigé sans lui et ne portait donc ni R-45 ni R-46.
> L'ajout est **purement additif** — aucun retour, aucun chiffre, aucune formulation
> d'origine n'a été touché. Le contenu ci-dessous est reconstitué depuis les commits
> de la fenêtre du lot.

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Corrigé chez le produit | Verdict de généralisation |
|---|---|
| Création de `build/i18n/glossaire.json` et de `build/check-glossaire.mjs` chez le produit. | **Généralisable → REMONTÉ en RT-34 et RT-35**, dont ces deux fichiers sont la mise en œuvre. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des gabarits de `gabarits\documents\`
n'a servi sur ce projet : aucun document du dépôt ne porte d'identifiant `gd-…`. La section
est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46, qui vise les livrables issus de
`gabarits\documents\`, et est consignée faute de canal plus juste : **ce lot lui-même a été
produit sans son gabarit de méthode**, `RETOURS-FORGES.md` étant absent du dépôt jusqu'à
`TF-0626` du 26/08/2026. C'est la cause directe de l'ajout rétroactif signalé ci-dessus.

## Confirmations positives

- **Le pan i18n de forge-tests déclare exactement sa portée** et passe au vert à juste titre.
  Il n'a rien laissé passer : ce défaut est hors de son périmètre, et il le dit lui-même.
  C'est le modèle que RT-34 et RT-35 cherchent à compléter, pas à corriger.
- **Le croisement de deux sources a produit un verdict par langue**, là où une seule en
  donnait un faux : « gîte » se garde en anglais et en néerlandais, se remplace en allemand,
  espagnol et portugais, et **doit** disparaître en italien. C'est RT-32 appliqué le jour même
  de sa remontée.

## Ordre recommandé

1. **RT-34** — le glossaire ; sans lui, RT-35 n'a pas de support et le contrôle n'a pas de
   référence.
2. **RT-35** — la règle de méthode, qui déplace la contrainte en amont et vaut pour tout
   produit multilingue de la forge.
