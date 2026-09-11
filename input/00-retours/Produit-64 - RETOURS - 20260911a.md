# Retours forges — Produit-64 — 20260911a

- **Contexte** : remise du lot `20260908a` au pilot, le 2026-09-11. Les deux retours de ce lot n'ont pas été trouvés en lisant le code du pilot : ils ont été rencontrés **en faisant le geste** que le gabarit prescrit.
- **Références ledger** : sans entrée `type: retour` — le lot naît d'une remise, pas d'une clôture de run.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le **sas d'arrivée** `<pilot>\input\00-retours\_arrivee\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : **remis le 2026-09-11** — les deux fichiers déposés dans le sas d'arrivée du pilot `digit-ai-factory\input\00-retours\_arrivee\` (ignoré par git, `.gitignore` ligne 26), empreintes SHA-256 vérifiées identiques aux originaux. L'ingestion et l'arbitrage appartiennent au pilot.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Le fait qui ouvre ce lot

Le gabarit de lot de retours — l'artefact que le pilot fait **voyager** chez chaque produit, et le seul texte qu'un producteur lit pour savoir où remettre — prescrit, ligne 11 : « copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` ». Notre copie est **conforme** : `sha256(forge\retours\GABARIT-LOT-RETOURS.md)` = `4fd1fdce8ba2b46774935ced6162bb31e614c9bfc2289b7aed413f37be954297`, identique à `gabarits\RETOURS-FORGES.md` du pilot. L'héritage est tenu ; c'est la **source** qui porte l'instruction périmée.

Or le pilot a construit le 08/09 (TF-0981) un **sas d'arrivée** `input\00-retours\_arrivee\`, ignoré par git, précisément pour qu'un lot au nom réel de client ne séjourne jamais dans un répertoire versionné — « la fenêtre ne se réduit pas : elle **disparaît** ». Le README du sas nomme le producteur comme celui qui y écrit. Le gabarit qui voyage jusqu'à ce producteur, lui, n'en dit pas un mot.

Nous n'avons déposé au bon endroit que parce que nous avons ouvert le README de la boîte d'entrée avant de copier. Un producteur qui applique son gabarit — c'est-à-dire qui fait ce qu'on lui demande — dépose au mauvais endroit.

## digit-ai-factory (`digit-ai-factory`)

Les deux retours portent sur le **canal de remise des lots** et sur la manière dont son protocole est publié. Usage réel : la remise du lot `20260908a`, le 11/09.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-13 | majeur | générique | **Le sas d'arrivée est câblé chez le pilot et absent de l'artefact que les produits lisent.** `gabarits\RETOURS-FORGES.md` ligne 11 prescrit toujours `<pilot>\input\00-retours\`. Dernier commit du gabarit : `b78d506`, **2026-09-08** — le jour même où le sas est né — et il ne le mentionne pas. Mesure du 11/09 sur le pilot : `git check-ignore` confirme que `_arrivee\` est ignoré (`.gitignore` ligne 26), et **deux lots portant un nom réel de client sont, à cet instant, à la racine du répertoire SUIVI** — `Produit-62 - RETOURS - 20260911a.md` et `Produit-11 - RETOURS - 20260911a.md`, tous deux `INDEXABLE` (un `git add -A` les emporte). Trois jours après la construction du remède, la fenêtre que le sas devait faire disparaître est ouverte deux fois dans la même journée. | Porter la destination dans le gabarit qui voyage — c'est une ligne — et la faire juger : `oracle-lot-retours.mjs` est déjà des deux côtés du canal et connaît le chemin du lot qu'il juge ; une règle qui refuse un lot posé à la racine, en nommant le sas, ferait du protocole une affordance câblée plutôt qu'une consigne de README. |
| RT-14 | majeur | générique | **Le protocole du sas n'existe que dans un dossier que git ne peut pas porter.** `input\00-retours\_arrivee\README.md` est le seul texte qui décrit la règle (« un produit y dépose son lot tel qu'il est, nom réel compris », puis `accueillir-lot.mjs`, puis `ingerer-lot.mjs`). Mesure : `git ls-files input/00-retours/_arrivee` → **0 fichier**, et `git log` sur ce README → **aucun commit**. Le README **suivi** du dossier parent y renvoie pourtant par un lien relatif, ligne 19 : `[_arrivee\](_arrivee/README.md)`. Sur un clone frais du pilot, le dossier n'existe pas, le lien est mort, et la seule description de la règle est introuvable — alors que la règle, elle, continue de s'appliquer. | Domicilier le protocole dans un texte **versionné** (le README suivi du parent, ou `references\`), et ne laisser dans le sas qu'un rappel. Un dossier ignoré est le bon endroit pour des **données** qu'on ne veut pas publier ; c'est le mauvais endroit pour la **règle** qui dit quoi y mettre. |

**Portée** : les deux retours sont *génériques*. RT-13 vaut pour tout produit ou forge qui remet un lot — c'est-à-dire tout l'écosystème. RT-14 vaut pour quiconque clone le pilot.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Notre ligne de statut de lot, une fois éditée après la remise, faisait diverger l'empreinte du fichier déposé de celle de l'original | Le `.md` a été recopié au sas après l'édition du statut ; les deux côtés sont de nouveau identiques (`981c566f…`) | non | Ordre des gestes propre à cette session : le gabarit autorise l'édition du statut après coup, il ne dit simplement pas laquelle des deux copies fait foi ensuite. Le sidecar, lui, n'a pas bougé, et c'est lui qui porte l'idempotence d'ingestion. Rien à remonter tant que R-49 juge sur le sidecar. |
| Un script d'édition a inséré des octets nuls dans le lot en interpolant `\00-retours` dans une chaîne Python non brute (`\00` = échappement octal) | Fichier restauré depuis git, réécrit avec des chaînes brutes et une assertion « aucun octet nul » avant écriture | non | Défaut d'outillage de session, sans rapport avec la chaîne : le chemin Windows du pilot contient une séquence qui est aussi un échappement. Le geste de réparation — assertion avant écriture — est du bon sens, pas une règle de socle. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot : le seul livrable touché est un support PowerPoint de Design Authority, hors famille de gabarit de document, et les deux retours ci-dessus portent sur le canal de remise, pas sur un document.

## Confirmations positives

- **Le sas fait exactement ce qu'il promet**, une fois trouvé : `git check-ignore -v` rend `.gitignore:26 input/00-retours/_arrivee/` sur le lot déposé sous son nom réel. Le nom « Produit-64 » ne peut pas entrer par mégarde dans un commit du pilot. Le mécanisme est juste ; seule sa publication manque.
- **`oracle-lot.mjs` hérité rend PASS sur le lot `20260908a`** (R-45 et R-46 verts, R-49 `SANS_OBJET` chez le produit), du premier coup, sans dérogation — le juge voyage avec son gabarit depuis le 24/08 et il tient.
- **Le relevé d'héritage du 11/09 a nommé de lui-même ce qu'il ne tenait pas** : deux artefacts recopiés sur le disque mais absents de l'histoire du dépôt, avec le geste de réparation. La classe `releve-heritage-juge-arbre-pas-histoire` est déclarée par l'outil au lieu d'être découverte par un lecteur — c'est le comportement attendu.

## Ordre recommandé

1. **RT-13 d'abord** : une ligne dans le gabarit qui voyage, et le geste que chaque producteur fait redevient le bon. C'est le meilleur rapport gain sur effort du lot, et il referme une fenêtre qui s'est rouverte deux fois le 11/09.
2. **RT-14 ensuite** : déplacer le protocole vers un texte versionné demande de trancher son domicile (README parent ou `references\`), donc un arbitrage court avant l'écriture.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Pour **RT-13**, la règle existe et porte même son nom dans le socle : *une affordance est câblée ou n'existe pas* (loi n° 1), citée par le README du sas lui-même. Le sas est câblé ; l'instruction qui y mène ne l'est pas. Classe retenue : **`boucle-retour-sans-descente`** — une correction close au pilot qui ne redescend pas sous une forme que le producteur rencontre. C'est la classe que RT-7 nommait le 31/08 ; ce lot en est une **récidive**, mesurée sur le canal des retours lui-même.

Pour **RT-14**, aucune clé du référentiel ne couvre exactement le défaut. La plus proche est **`capacite-hors-versionnement-de-forge`** — une chose exercée dans un run réel qui ne vit que dans un dossier ignoré par git, sans source lisible ni histoire, qu'un clone frais ne peut pas rejouer. La différence est la nature de l'objet : une *capacité* dans la classe existante, une *règle normative* ici. Le défaut, lui, est identique — **un texte opposable domicilié là où l'histoire du dépôt ne va pas**. Je retiens cette classe pour ne pas bloquer l'ingestion, et je propose au pilot soit d'élargir son libellé aux textes normatifs, soit de créer une classe sœur `regle-de-canal-domiciliee-hors-versionnement` dans la famille `contrat-interface-forge`.
