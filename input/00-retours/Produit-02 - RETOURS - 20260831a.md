# Retours forges — trois familles d'erreurs d'un agent, mesurées sur une session — 20260831a

- **Contexte** : session longue du 30 au 31/08/2026 sur `Produit-02.com` — corrections
  i18n, localisation d'adresses, mise en production, puis études de mesure et de campagnes.
  Mandat humain explicite de clôture : *« remonte à la factory les erreurs commises pour voir
  comment ne pas les reproduire la prochaine fois »*.
- **Références** : `forge/ledger.jsonl` seq 48, 49 et 50. Onze erreurs recensées, regroupées en
  **trois familles** — le regroupement est le contenu de ce lot, pas un habillage.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

**Fil conducteur de ce lot.** Une liste de onze mea culpa ne prévient rien : elle se lit une
fois et ne produit aucune règle. Regroupées par **mécanisme**, ces erreurs se ramènent à trois
familles, dont chacune admet un remède **mécanique et testable**. La première famille est la
plus coûteuse et la plus contre-intuitive : dans ses quatre cas, **la mesure était juste** —
c'est la conclusion qui dépassait ce que la mesure autorisait.

---

## Famille 1 — le périmètre de la mesure n'est pas le périmètre de la conclusion

Ce chapitre montre comment quatre incidents sans rapport apparent — une régression publicitaire,
une destruction évitée de justesse, un effacement qui n'effaçait rien, un compte faux — sont en
réalité le même défaut, et pourquoi trois questions mécaniques les auraient tous arrêtés.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-A1 | bloquant | **Une régression en production, sur de l'argent.** Mesure juste : aucune balise publicitaire dans le conteneur, aucun lien publicitaire sur la propriété de mesure. Conclusion tirée : « il n'y a pas de publicité ». Conclusion autorisée : « la publicité n'est pas **raccordée au site** ». Sur cette base, la catégorie publicitaire a été retirée du bandeau de consentement et le refus fixé **en dur**, en production — alors qu'un budget d'environ 100 €/mois tournait dans un compte que ni le conteneur ni la propriété n'interrogent. La modification rendait ces dépenses **définitivement inattribuables**. Découvert seulement parce que l'humain a mentionné son budget, six tours plus tard ; réparé le soir même. | Avant tout **retrait** d'une capacité au motif qu'elle n'est pas utilisée, exiger la vérification qu'elle ne l'est pas **ailleurs**. Si le périmètre extérieur n'est pas mesurable depuis la session, le **demander** — ne jamais le supposer vide. |
| RT-A2 | bloquant | **À un doigt de détruire 59 commits.** Le contrôle de perte a été joué sur les branches **principales** de neuf dépôts : zéro sujet local sans équivalent amont. La conclusion a été **étendue aux branches de sauvegarde sans rejouer le contrôle**, et la suppression recommandée. L'humain a choisi de vérifier d'abord : `forge-agents` portait **59 sujets absents de tout distant**, dans une branche dont le commit de tête dit lui-même « état non poussé ». | Un contrôle de perte se rejoue sur **chaque référence concernée**. Interdire l'extension d'une conclusion d'un sous-ensemble à son sur-ensemble sans nouvelle mesure. |
| RT-A3 | majeur | **Supprimer un nom pris pour effacer un objet.** Neuf étiquettes supprimées, effacement de l'historique non anonymisé annoncé. Mesure faite **après** : `git cat-file -t` rendait toujours « commit », et les identifiants d'espace de travail réels restaient lisibles par `git show`. Une étiquette retire une **référence**, jamais un **objet**. | Après tout geste destructif, **mesurer la cible**, pas sa référence. Un geste de suppression n'est prouvé que par l'échec d'une lecture de la cible. |
| RT-A4 | majeur | **Un compte déduit au lieu d'être lu.** « 18 entrées égarées » obtenu par soustraction — 26 moins 8 — de deux totaux qui ne mesuraient pas la même chose. Lecture faite ensuite : l'archive portait un run **complet et clos** de 24 entrées ; seules **2** étaient égarées. Le chiffre faux avait été porté dans une entrée de ledger et deux restitutions. | Un dénombrement se **lit**, il ne se déduit pas d'une différence entre deux totaux dont on n'a pas établi qu'ils portent sur le même objet. |

**Le remède commun, et il tient en trois questions.** Toute conclusion tirée d'une mesure énonce
le **périmètre** de cette mesure, puis on vérifie : *sur quoi la mesure a-t-elle porté ? sur quoi
la conclusion porte-t-elle ? le second est-il inclus dans le premier ?* Les quatre incidents
ci-dessus échouent à la troisième question, et aucun n'aurait survécu à sa formulation explicite.

---

## Famille 2 — des valeurs de contexte écrites comme des règles

Ce chapitre rassemble trois défauts d'un même prompt réécrit, tous relevés par l'humain et aucun
par l'agent : un instantané devenu contrainte, une valeur observable figée, une contrainte posée
sans son point de bascule.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-B1 | majeur | **Un instantané transformé en contrainte de conception.** Le prompt réécrit portait « 43 impressions, 13 requêtes, 6 jours actifs — conçois pour ce volume ». Le site a six jours d'existence : ce chiffre aura disparu dans trois semaines. Une console conçue pour 43 lignes devient inutilisable au premier millier. L'humain l'a vu avant l'agent : *« on peut espérer beaucoup plus dans les semaines à venir »*. | Une conception se donne une **plage** — ici de dix lignes à quelques milliers, plafonnée par les 25 000 lignes que rend l'interface source — jamais une valeur courante. Un instantané informe le contexte, il ne contraint pas. |
| RT-B2 | majeur | **Une valeur observable figée à l'écriture.** Le prompt portait « la fenêtre s'arrête à J-2 ». La latence mesurée le 31/08 est bien de J-2 — vérifiée, la source ne rendant rien après le 29/08 — mais elle oscille et s'allonge. Figée en dur, elle produira un jour une fenêtre tronquée, lue comme un recul alors que rien n'aura baissé. La règle auto-adaptative était disponible et n'a pas été vue : demander jusqu'à aujourd'hui, prendre la **dernière date rendue**. | Quand une valeur peut être **observée à l'exécution**, interdire de la figer à l'écriture. Un seuil écrit en dur est un pari sur la stabilité d'un tiers. |
| RT-B3 | majeur | **Une contrainte posée comme une loi, sans son point de bascule.** Le prompt portait « contrainte d'architecture, non négociable : n'introduis pas de backend ». Vrai aujourd'hui ; **faux dès l'étape suivante du plan déjà livré**, où deux tactiques exigent des appels authentifiés qu'une page statique exposerait. Le niveau intermédiaire — une seule fonction authentifiée au frontal — avait été écarté trop vite. L'humain a demandé « pourquoi statique et pas dynamique ? » ; la réponse honnête était que ce n'était pas une loi mais un arbitrage. | Toute contrainte d'architecture **nomme la condition qui l'invaliderait**. Une contrainte sans point de bascule est un dogme, et se fait contourner en silence quand elle devient fausse. |

**Le remède commun.** Toute valeur chiffrée ou contrainte inscrite dans une consigne déclare son
**statut** : **observée** — donc à ré-observer à l'exécution, jamais figée ; **décidée** — donc à
ré-arbitrer, et nommant la condition qui l'invaliderait ; ou **contextuelle** — qui informe et ne
contraint pas. Une valeur sans statut se lit comme une loi : c'est ainsi que les trois ci-dessus
ont été écrites, et lues.

---

## Famille 3 — une formule d'invocation lue comme une tournure

Ce chapitre isole un défaut d'un genre différent des deux précédents : il ne porte pas sur un
raisonnement mais sur la reconnaissance d'une intention, et il a la particularité de **ne laisser
aucune trace** — ce qui le rend invisible tant que personne ne le cherche.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-C1 | majeur | **Un skill invocable, disponible, jamais invoqué — trois fois.** L'humain a ouvert trois messages par « Améliore le prompt : » suivi d'une demande. L'agent a lu la formule comme un préambule et exécuté la demande. Or « améliore ce prompt » figure **littéralement** dans la liste de déclencheurs du skill `prompt-analyzer-l99`, présent dans l'environnement. C'est l'humain qui a fini par demander pourquoi le skill n'était pas exécuté. **Ce qui rend l'erreur insidieuse** : le travail rendu à chaque fois était réel et accepté — une refonte de stratégie, une réparation de régression. Rien ne signalait le manque, puisque quelque chose de valable était livré à la place. **Aggravant** : le prompt ainsi ignoré valait **39/100** à l'analyse, avec quatre défauts bloquants — dont un qui aurait fait transformer un site statique en application sans décision humaine. La construction fautive avait commencé quand l'humain a interrompu. | Quand une formule du message figure **littéralement** dans les déclencheurs d'un skill disponible, la traiter comme une **invocation**, non comme une tournure : la coïncidence littérale prime sur l'interprétation contextuelle. En cas de doute réel, poser la question en une ligne plutôt que d'exécuter la suite — le coût d'un aller-retour est d'une minute, celui d'une construction lancée sans analyse se compte en tours. |

---

## Remarques restées au produit

Ce chapitre liste ce que le produit a corrigé chez lui sans le remonter, et dit pour chacun
pourquoi la classe du défaut ne mérite pas — ou mérite — de monter.

| Remarque | Corrigé au produit | Pourquoi elle reste, ou monte |
|---|---|---|
| Un nom de constante réutilisé pour deux listes différentes dans un même contrôle, `INTERDITS` : le code marchait par le seul ordre d'exécution, et un déplacement l'aurait cassé en silence | oui, renommé | **Reste.** Défaut d'écriture ordinaire, sans classe généralisable. |
| Un mélange d'infinitifs et d'impératifs sur les libellés d'action italiens | partiellement — deux clés alignées, le registre d'ensemble non tranché | **Reste**, et attend une relecture native. Question de langue, pas de forge. |
| Une correction appliquée au résolveur de chemin d'un journal, mais **pas à son appelant**, qui figeait toujours l'ancien identifiant : la correction était donc **inerte**, et sa documentation affirmait pourtant qu'elle était faite | oui | **Monte** — voir ci-dessous. |

**La classe qui monte : une correction qui n'atteint pas son appelant est inerte, et sa
documentation ment alors deux fois.** Le cas mesuré : le résolveur avait été corrigé le 26/08
pour rendre le chemin de doctrine, sa docstring l'affirmait, et le point d'entrée continuait de
lui passer un identifiant figé — si bien que dix-huit entrées sont parties dans une archive
pendant quatre jours sans que rien ne le signale, et que l'oracle de vérification certifiait la
mauvaise pièce. **Proposition** : une correction de chemin, de cible ou de portée n'est complète
que lorsque ses appelants sont vérifiés ; et une docstring qui affirme un correctif devrait être
la dernière chose écrite, pas la première.

---

## Retours sur les documents produits

**Aucun document produit depuis un gabarit `gd-…`.** Aucun des gabarits de
`gabarits\documents\` n'a servi sur cette session : les livrables produits — deux études et un
plan de campagnes — sont bâtis sur le **socle de page HTML** du skill `digit-ai-page-html`, qui
ne relève pas du périmètre de R-46. La section est déclarée vide pour ce périmètre, elle n'est
pas omise.

Trois observations tombent hors de ce périmètre et sont consignées ici faute de canal plus
juste — elles visent le socle de page HTML, et remontent à `digit-ai-page-html` par le sidecar.
La première est la plus coûteuse : **le socle livre une déclaration que son propre contrôle
refuse.**

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-D1 | majeur | **Le gabarit de page HTML échoue à son propre oracle, dès l'installation.** Son squelette pose `th, td { … overflow-wrap: anywhere }` sur **toute** cellule ; la règle **L19** du contrôle qui l'accompagne refuse précisément cette propriété sur de la prose et n'en tolère l'usage que sur des identifiants techniques. Tout document bâti sur le gabarit et comportant un tableau de texte échoue donc à L19 **sans que son auteur ait rien écrit**. Mesuré deux fois sur un livrable de cette session ; la surcharge ne suffit pas, l'oracle lisant la déclaration et non la cascade — il a fallu **retirer la déclaration du squelette lui-même**. | Retirer `overflow-wrap: anywhere` du sélecteur `th, td` du squelette, et le réserver à une classe explicite pour les cellules d'identifiants. Un gabarit ne devrait jamais livrer une déclaration que son propre contrôle refuse. |
| RT-D2 | majeur | **La classe `.chap.lire` viole la règle de largeur que son propre fichier énonce.** Le squelette déclare que « le conteneur occupe 75-100 % de la fenêtre à toute taille » ; `.chap.lire` plafonne à 1 080 px, soit **56 %** d'une fenêtre de 1 920. Employée comme son nom l'invite — envelopper un chapitre — elle place tout le document sous le plancher déclaré. Constaté par le destinataire humain, pas par l'oracle : *« le passage à 50 % de largeur au lieu des minimums 75 % de la règle »*. | Nommer la classe pour ce qu'elle est — un **passage** de lecture inséré dans une mise en page large, jamais l'enveloppe d'un chapitre — ou l'exempter explicitement de la règle de largeur en le documentant à l'endroit où on la lit. |
| RT-D3 | mineur | **Le gabarit ne prévoit rien entre le niveau 3 et le corps de texte.** Les styles s'arrêtent à `h3` ; un document qui a besoin d'un quatrième niveau — ici, une fiche par outil dans une grille — doit le styler lui-même, et déclenche au passage l'avertissement « saut de hiérarchie de titre » s'il ne prend pas garde à intercaler un `h3`. | Prévoir un `h4` au squelette, ou documenter que le gabarit s'arrête volontairement à trois niveaux et que le quatrième relève d'un composant. |

---

## Ce que ce lot ne couvre pas, et c'est dit

Ce dernier chapitre borne la portée du lot, pour qu'on ne lui prête pas une exhaustivité qu'il
n'a pas.

- **Les onze erreurs recensées sont celles de cette session, sur ce produit.** Rien n'établit
  qu'elles soient représentatives d'autres sessions ou d'autres agents.
- **Aucune des trois familles n'a été éprouvée comme règle.** Les remèdes proposés sont formulés
  pour être testables, ils n'ont pas été testés — ni sur une fixture, ni sur un rejeu.
- **Deux erreurs de la session ne rentrent dans aucune famille** et ont déjà été remontées
  séparément : un livrable illisible ayant passé tous les oracles de forme (`digit-ai-page-html`,
  ledger seq 34) et un marqueur de destinataire posé sur un référentiel, qui le faisait juger
  comme une synthèse (corrigé localement, ledger seq 33).
