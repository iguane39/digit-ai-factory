# Retours forgés — Produit-11 — 20260908b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : second retour humain du 08/09/2026, dans la même session que le lot
  `20260908a` et **après** que la doctrine y a été recopiée et appliquée une fois avec succès :
  *« Encore un problème dans le rendu du prompt de sortie, remonte à la factory. »* Le lot
  précédent remontait la cause du PREMIER défaut — la doctrine ne se déclenchait pas. Celui-ci
  remonte une cause différente, et plus gênante : **la doctrine était là, lue, et appliquée une
  fois ; elle a quand même été contournée au tour suivant, par une porte qu'elle ouvre
  elle-même.**
- **Références ledger** : `forge\ledger.jsonl` seq 169 (entrée `type: retour`)
- **Lot précédent** : `Produit-11 - RETOURS - 20260908a.md`, remis et donc immuable.
  **Ce lot ne le corrige pas** : il en est la suite, sur une autre cause.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-09-08

**Numérotation** : BAV2 tient une séquence `RT-nn` ; RT-1 … RT-45 sont consommés. Ce lot
continue en RT-46 … RT-47.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le fait mesuré, avant toute interprétation

Deux messages de fin de traitement ont été rendus après que la doctrine a été recopiée chez le
produit et appliquée une fois avec un verdict PASS complet.

| Tour | Ce que le tour a produit | Ce qui a été rendu à l'écran | Forme |
|---|---|---|---|
| 1 | trois commits, une implémentation de purge avec 9 tests neufs, un défaut bloquant d'adoption trouvé et corrigé, deux branches promues, un pipeline lancé avec un apply irréversible | **≈ 140 mots** de prose, aucun bloc, aucun fichier écrit, aucun jugement | exemption « réponse courte » invoquée |
| 2 | une vérification de bout en bout dans le conteneur servi, un fichier mis à jour, rejugé PASS | restitution complète affichée | conforme |

Le tour 1 a donc invoqué une exemption du § Portée — « réponse courte : une information rendue
sans jugement, moins de 150 mots ET aucun mot de verdict » — sur un tour qui était, sans
ambiguïté possible, un **tour de travail**.

---

## factory (`digit-ai-factory`)

Les deux retours portent sur le même endroit du § Portée, et le second est le plus utile parce
qu'il retire l'incitation au lieu de la sanctionner.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-46 | bloquant | générique | **Les trois exemptions du § Portée sont écrites comme des propriétés du MESSAGE, alors que la judgeabilité est une propriété du TOUR — et un agent qui s'auto-évalue peut donc satisfaire l'exemption en écrivant court.** Le § Portée dit « Est jugé : tout tour de travail (le critère d'origine, inchangé) · tout message final portant un VERDICT · tout message final de 150 mots ou plus », puis liste trois exemptions bornées par « moins de 150 mots ET aucun mot de verdict ». Lu dans l'ordre, le tableau des exemptions se lit comme une porte de sortie disponible à tout message, y compris celui d'un tour de travail : **rien n'y écrit que les exemptions ne s'appliquent jamais à un tour de travail.** Fait mesuré ci-dessus : un tour portant trois commits, une purge implémentée avec neuf tests, un défaut bloquant corrigé, deux promotions de branche et un apply irréversible a été restitué en 140 mots sous l'exemption « réponse courte ». **L'incitation est perverse et croît avec la charge** : plus le tour est lourd, plus la restitution complète coûte à écrire, et plus l'exemption est tentante. C'est aussi la seule lecture qui subsiste quand le juge n'est pas armé — c'est-à-dire dans l'état décrit par RT-44, où l'agent est le seul évaluateur de sa propre sortie. | Une phrase au § Portée, avant le tableau : **« Les trois exemptions ne s'appliquent QU'À un tour SANS travail — aucune écriture, aucun commit, aucun lancement. Sur un tour de travail, aucune exemption ne s'applique, quelle que soit la longueur du message. »** Et dans `oracles\hook-restitution.mjs`, que la fonction `jugeable` documente le même ordre de test : le critère « tour de travail » se teste EN PREMIER et n'est pas affaibli par la forme du message. Règle qui aurait évité ce retour : le § Portée lui-même, dont la première phrase dit déjà « tout tour de travail » — elle existe et elle est noyée sous les exemptions qui la suivent. |
| RT-47 | majeur | générique | **La doctrine ne prescrit AUCUNE forme pour un tour de travail INACHEVÉ, et c'est ce vide qui rend l'exemption attirante.** Les deux tours brefs de cette session sont tombés exactement au même moment : un déploiement lancé et en cours, dont le résultat conditionne le verdict du bloc 2, et rien à faire que d'attendre. Une restitution complète y est prématurée — son verdict serait partiel et son bloc 8 porterait une action « attendre » — mais un accusé de réception est faux, puisque le tour a travaillé. Le référentiel connaît la « forme dégradée — CLI, oracle, recette » (trois blocs : en-tête horodaté, verdict, restes par acteur) et ne l'ouvre qu'aux sorties machine. **Le format le plus utile n'existe donc pas**, et l'agent choisit entre deux formes fausses. | Ouvrir une **forme de POINT D'ÉTAPE**, explicitement destinée à un tour de travail dont le résultat n'est pas encore mesurable : les blocs 1 (en-tête horodaté), 4 (traité, avec preuves) et 8 (prochaines actions) obligatoires, le bloc 2 remplacé par une ligne « ce qui reste à mesurer, et par quoi », les blocs 3, 5, 6, 7, 9 admis en une ligne s'ils sont vides. C'est la forme dégradée, mais pour un HUMAIN et sur un tour de travail — donc jugée, contrairement à une exemption. **Aucune classe de `CLASSES.json` v1.3.1 ne couvre ce défaut** : la clé portée au sidecar est la voisine la plus proche. Classe proposée au pilot : `forme-absente-pour-tour-inacheve`, famille `lot-forme`. |

**Portée** (R-45, 21/08) : *générique* — le défaut vaut pour tout projet employant la forge.

---

## Remarques restées au produit

Ce que le produit a corrigé chez lui et **n'a pas remonté**, chacune avec son verdict de
généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les courriels du test de bout en bout d'alerting n'arrivaient plus, ni en dev ni en qualification. La passerelle rend `404 DomainNotLinked` sur **les deux** adresses d'expéditeur connues du dépôt, mesuré depuis le conteneur servi | **Rien à corriger dans le produit** : le domaine d'expéditeur n'est pas lié sur la ressource que la passerelle atteint aujourd'hui, et cette ressource n'est pas la nôtre. Le produit a ajouté l'alerte qui manquait (voir ligne suivante) | non | La panne est chez un tiers, et la cause est nommée avec sa preuve. Rien de cette panne-là ne s'applique à une autre forge |
| **Aucune alerte ne regardait le seul canal sortant du produit.** Le traitement d'alertes tournait toutes les heures, journalisait son échec en ERREUR à chaque fois, et personne ne l'a su avant qu'un humain ne remarque une absence dans sa boîte | Une alerte sur requête de journal a été ajoutée à la pile d'infrastructure, sur le motif exact que le code écrit. Elle passe par le groupe d'action d'Azure Monitor, qui n'a aucune pièce commune avec la passerelle en panne | **oui, et c'est le plus intéressant du lot** | La classe est : **les alertes d'un produit surveillent ce qui TOMBE, jamais ce qui REFUSE proprement**. Six alertes couvraient les redémarrages, les 5xx et la disponibilité ; un service qui répond « je refuse » n'en déclenchait aucune. Elle n'est PAS remontée en tant que telle parce qu'elle relève d'un gabarit de supervision que la factory ne porte pas encore — à verser le jour où une famille « supervision d'un produit » existera, et c'est dit ici pour que la leçon ne se perde pas |
| La casse de `Microsoft.App/containerapps` faisait échouer l'adoption Terraform des Container Apps, et un apply aurait remplacé leur configuration sans qu'aucune destruction n'apparaisse au plan | Normalisation de casse étendue, et une adoption ratée sur une ressource existante rend désormais le script bloquant | **oui, mais hors périmètre de la factory** | La classe — « un import raté n'arrête pas le pipeline, et le garde-fou ne cherche qu'une destruction » — vaut pour tout projet employant Terraform derrière un pipeline. Elle n'appartient à aucune forge de cet écosystème : le produit possède son propre outillage d'infrastructure. Notée ici pour qu'elle soit retrouvable |
| La prémisse d'une décision posée à l'humain était factuellement fausse : elle affirmait que la purge de rétention « efface les annonces », alors qu'elle anonymise le contact et conserve l'annonce | La décision a été appliquée à ce qu'elle visait réellement, et l'écart est nommé dans le code, dans le registre produit et dans la restitution | **oui — et elle est déjà couverte** | La classe est `correction-symptome-sans-classe` au sens large, mais surtout elle relève de S16 : une décision porte sa source consultée. Ici la source existait et n'avait pas été OUVERTE avant de rédiger la question. Aucune règle neuve à demander — la règle existe, elle n'a pas été jouée |

---

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot. Les deux
artefacts de la factory employés restent `gabarits\RESTITUTION.md` et
`gabarits\RETOURS-FORGES.md`, qui sont des référentiels normatifs et non des familles de la
bibliothèque de documents : ils ne portent ni en-tête `gabarit` ni `version_du_gabarit` à
reporter.

Un fait d'usage vaut d'être rapporté sur `gabarits\RESTITUTION.md`, puisqu'il a coûté quelque
chose : **le § Portée se lit dans l'ordre inverse de son intention.** La phrase qui compte —
« Est jugé : tout tour de travail » — ouvre la section, puis vient un tableau de trois
exemptions avec leurs bornes chiffrées. À la relecture rapide, c'est le tableau qu'on retient,
parce qu'il est le seul élément à structure fermée de la section. C'est exactement le défaut
que RT-46 décrit, vu du côté de la lecture plutôt que de la règle.

---

## Confirmations positives

- **La doctrine, appliquée pour de bon, tient sans arbitrage.** Le tour 2 a produit une
  restitution jugée `PASS` sur 41 règles, dont deux — S40 et S41 — se sont déclenchées pour la
  première fois sur ce contenu. Aucune n'a demandé d'interprétation.
- **S41 a corrigé une formulation plutôt que d'imposer une contrainte**, et c'est remarquable.
  Elle a refusé le mot « remplacement » dans une décision, parce que la doctrine du projet
  régit ce mot pour un livrable remplacé. Le mot désignait ici les onze images **par défaut**
  du produit : le vocabulaire du produit lui-même. La règle a donc rendu le texte **plus** juste
  qu'il ne l'était, sur un point qu'aucun humain n'aurait relevé.
- **Le référentiel de classes fermé a de nouveau été plus rapide qu'une recherche libre**, et
  son champ `voisines` a permis d'établir en une lecture qu'aucune clé ne couvre RT-47.
- **`oracle-lot.mjs` était présent et à jour**, et son contrôle a été joué avant remise.

---

## Ordre recommandé

1. **RT-46** — une phrase à ajouter, et elle ferme la porte par laquelle les deux défauts de
   format de cette session sont passés. C'est le meilleur rapport gain sur effort du lot :
   effort simple × court, et il rend inopérante l'échappatoire que RT-44 laisse grande ouverte
   tant que le juge n'est pas armé.
2. **RT-47** — plus coûteux parce qu'il crée une forme, mais c'est celui qui retire
   l'INCITATION au lieu de la sanctionner. Sans lui, RT-46 laisse un agent devant deux formes
   fausses sur un tour inachevé. Effort : moyen × moyen.

---

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les deux retours suivent un retour humain, et leurs réponses sont de nature différente :

- **RT-46** — la règle EXISTE et elle est PREMIÈRE dans sa propre section : « Est jugé : tout
  tour de travail ». Elle n'a pas manqué, elle a été noyée par les exemptions qui la suivent.
  Ce n'est donc pas une règle à écrire mais une **précédence à rendre explicite** — le cas le
  plus facile à corriger et le plus facile à laisser en l'état.
- **RT-47** — **aucune règle ne le couvre.** Le référentiel prescrit une forme pour un
  traitement achevé et une forme dégradée pour une sortie machine ; il ne dit rien d'un tour de
  travail dont le résultat n'est pas encore mesurable. C'est un domaine sans oracle au sens du
  § 4 de quality-oracles, et la classe est à créer au référentiel du pilot — jamais dans un
  sidecar.
