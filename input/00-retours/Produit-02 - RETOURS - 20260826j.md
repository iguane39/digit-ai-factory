# Retours forges — Produit-02.com — 20260826j

- **Contexte** : l'exploitant signale, mot pour mot, « j'ai encore le doublon du prompt de
  sortie ». L'enquête sur ce doublon a trouvé sa cause dans le dispositif de restitution
  lui-même, puis une seconde cause dans la règle qui refusait, et une troisième classe en
  ouvrant deux scripts de vérification que rien n'appelait.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 79, 80, 81
  (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Un défaut que le référentiel avait déjà corrigé, puis décorrigé

Ce chapitre existe parce que les trois retours de ce lot partagent une même forme, et qu'elle
n'apparaît qu'en les lisant ensemble.

Le doublon signalé n'est pas un défaut de rédaction : c'est une **conséquence mécanique**. Le
gate de restitution est un hook `Stop` ; il juge **après** l'affichage. Un refus ne peut donc
plus retirer ce qui est déjà à l'écran, et le lecteur relit huit blocs à chaque fois. Trois
refus dans la session, quatre affichages.

Or le référentiel **portait déjà le remède** — sa version 2.1.0 prescrit une *« synthèse en
fichier jugée avant affichage »*. Sa version 2.4.0 a remplacé ce dispositif par un gate `Stop`
pour le rendre bloquant, et a réintroduit du même coup ce que la 2.1.0 avait supprimé. Sa
version 2.5.0 a reçu **exactement le même retour humain** — « le prompt de résultat s'affiche
2 fois » — et y a répondu en déclassant six règles en avertissantes, c'est-à-dire en réduisant
la **fréquence** des refus plutôt qu'en supprimant leur **coût**. La preuve que le symptôme
n'était pas la cause tient en une ligne : les trois refus d'aujourd'hui portent tous sur des
règles restées bloquantes.

Les deux autres retours sont la même forme, à un étage différent. **Une règle qui juge le motif
de surface plutôt que la chose visée** : S3 refuse un verdict mesuré parce que le nom compté
n'est pas dans sa liste de neuf mots. **Un contrôle que rien n'invoque** : deux scripts d'audit
ont accumulé trois défauts sans qu'aucun signal ne parte. Dans les trois cas, le dispositif
avait l'apparence de fonctionner.

## `digit-ai-factory`

Trois retours, sur un gate qui juge trop tard, une règle qui juge un lexique, et des contrôles
que rien ne joue.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-61 | majeur | générique | **Le gate de restitution juge APRÈS l'affichage, donc chaque refus duplique le message.** R-44 câble `oracle-synthese` sur un hook `Stop` : le refus arrive quand la réponse est déjà à l'écran, et ne peut plus la retirer. **N refus = N+1 affichages de huit blocs** pour un seul message utile. **Mesure de la session du 26/08 : trois refus successifs, quatre affichages**, et le retour humain qui ouvre ce lot. **Le référentiel porte déjà le remède** : sa v2.1.0 prescrit une « synthèse EN FICHIER jugée avant affichage ». Sa **v2.4.0** l'a remplacée par le gate `Stop` pour le rendre bloquant — et a réintroduit le défaut. Sa **v2.5.0** a reçu le même retour humain (« le prompt de résultat s'affiche 2 fois ») et a déclassé six règles en avertissantes : c'est le **symptôme** (refuser moins souvent) et non la **cause** (juger après avoir affiché). Preuve que les deux ne se confondent pas : **les trois refus d'aujourd'hui portent tous sur des règles restées BLOQUANTES** — S3 deux fois, S4 une fois. | Rendre le pré-jugement en fichier **praticable et prescrit**, plutôt que laissé à la discipline. Fait ici côté produit et proposé comme forme de référence : `forge\hooks\prejuger-restitution.mjs` résout le pilot exactement comme le relais de hooks déjà livré, délègue à `oracle-synthese` sans réimplémenter aucune règle, et rend 0/1/2 — la restitution s'écrit dans un fichier, se corrige jusqu'au PASS, et n'est affichée qu'ensuite ; le gate n'a alors plus rien à refuser. Deux façons de le rendre opposable : le livrer avec le gabarit au même titre que l'oracle de lot, ou faire que le gate, au premier refus, **exige** le passage par fichier au lieu de re-solliciter une réponse directe. |
| RT-62 | majeur | générique | **La règle S3 juge le VOCABULAIRE de la mesure, pas sa présence.** Son détecteur `_CHIFFRES` n'accepte un nombre que s'il compte l'un de **neuf** noms — `test`, `finding`, `règle`, `cas`, `item`, `constat`, `élément`, `commit`, `pan` — ou s'il forme un ratio `N/M` ou un pourcentage. **Mesure reproduite en rejouant le détecteur sur les verdicts refusés** : « 70 pages modifiées, 70 conformes en production, 0 en défaut » → **FAIL** ; « 446 fichiers, 7 essais, 3 en intégration continue, 2 workflows » → **FAIL** ; « 4 tests négatifs » → **PASS**. **Deux des trois refus de la session viennent de là**, sur des verdicts portant des comptes explicites et vérifiables. **L'effet est l'inverse de l'intention** : la règle existe pour refuser « tout s'est bien passé », et elle pousse l'auteur à **habiller** son verdict d'un mot admis plutôt qu'à le mesurer — j'ai fini par écrire « 4 tests négatifs » pour passer, alors que « 70 pages sur 70 conformes » était le fait le plus utile au lecteur. **Seconde occurrence de la même classe, le même jour** : S17 refuse « entrée 78 » dans les blocs 3 et 8, où 78 désigne une entrée de registre et non une position dans une liste ; sa regex reconnaît le motif de surface, pas la chose visée. | Juger la **présence d'une mesure**, jamais le mot qui la porte. Deux formes tiennent la propriété sans lexique : accepter **tout nombre suivi d'un substantif**, ou — plus robuste et plus proche de l'intention — exiger **deux grandeurs numériques distinctes** dans le bloc verdict, qu'aucune tournure ne contourne et qu'aucun ajout de mot ne satisfait à bon compte. La règle générale derrière les deux occurrences : **une liste fermée de mots dans un oracle est une dette qui grandit à chaque domaine nouveau**, et son coût ne se paie pas en faux positifs visibles mais en verdicts reformulés pour plaire au détecteur. |
| RT-63 | majeur | produit+générique | **Un script de vérification qu'aucune recette n'invoque n'est pas un contrôle : c'est une décoration, et il pourrit sans que rien ne le signale.** `build\audit-browser.mjs` et `build\audit-prod.mjs` portaient **trois défauts dormants**, tous antérieurs au chantier du jour. **(1)** Ils pilotaient un panneau de calendrier retiré de la page depuis longtemps : `document.querySelector('.cal-panel').scrollIntoView()` levait une exception, donc les scripts échouaient **avant** de rendre leur verdict. **(2)** La liste de pages d'`audit-browser` nommait en français les pages des cinq langues à slugs localisés — `es/reservation.html` au lieu de `es/reserva.html` — soit **10 codes 404 à chaque exécution**, un bruit qui noyait les vrais constats. **(3)** L'hôte tiers du moteur de réservation était compté comme échec réseau à chaque audit local. **Aucun des deux n'est appelé par `package.json` ni par les deux workflows d'intégration continue** : les trois défauts n'ont été trouvés qu'en ouvrant les fichiers pour une autre raison. Remis en état ici — `audit-browser` rejoué rend « Aucun problème navigateur détecté » sur **73 pages**, `audit-prod` rend **PROD OK** sur le déploiement du jour. | Tout script de vérification livré dans un produit est **soit câblé** à une recette qui le joue, **soit déclaré non joué avec son motif**. Un troisième état — ni câblé ni déclaré — est un contrôle qui **ment par sa seule présence** : sa lecture rassure, son exécution échoue, et personne ne fait ni l'une ni l'autre. C'est la transposition, au niveau du **dépôt**, de ce que la loi transverse dit déjà au niveau du verdict : un ✓ sans oracle exécuté n'est pas un ✓. Contrôle possible côté socle : lister les scripts d'un produit qui portent un `assert`, un `issues.push` ou un `process.exitCode`, et vérifier que chacun est nommé par une recette ou par une déclaration explicite. |

## Ce que ce retour ne couvre pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

**Aucune modification n'a été faite dans la factory.** Les trois retours portent sur des
mécanismes qui lui appartiennent — le gate R-44, les règles S3 et S17 d'`oracle-synthese`, la
doctrine des contrôles livrés. Le produit n'a corrigé que chez lui : un script de pré-jugement,
et ses deux scripts d'audit. La proposition de RT-62 en particulier **n'est pas implémentée** :
changer un détecteur d'oracle sans rejouer son banc de fixtures rouges est exactement ce que la
forge interdit, et ce banc n'est pas ici.

**Le pré-jugement reste une discipline, pas une garantie.** Le script livré côté produit rend le
geste possible en une commande, mais rien n'oblige à le jouer : c'est précisément ce que la
proposition de RT-61 demande de câbler. Tant que ce n'est pas fait, le doublon peut revenir.

**La mesure du coût s'arrête à cette session.** Trois refus, quatre affichages, sur un seul
produit et une seule journée. Si d'autres produits du parc subissent le même gate, le coût est
multiplié d'autant, et **personne ne l'a mesuré** — ce lot ne l'établit que là où il a été vu.

## Remarques restées au produit

Ce que le produit a corrigé — ou délibérément pas — chez lui, chacune avec son verdict de
généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le doublon d'affichage subi trois fois dans la session | Ajout de `forge\hooks\prejuger-restitution.mjs` : la restitution s'écrit dans un fichier, se juge, se corrige, et n'est affichée qu'au PASS. Il ne porte aucune règle propre — il résout le pilot comme le relais de hooks et délègue à l'oracle du gate | oui | **Généralisable → remonté en RT-61.** Le script est la forme de référence proposée ; la décision de le livrer avec le gabarit ou de l'imposer au premier refus appartient à la factory. |
| Trois défauts dormants dans deux scripts d'audit du produit | Scénario mort remplacé par la seule assertion qui a encore un objet — le moteur est présent, sa source est bien Beds24, cinq gîtes au sélecteur ; liste de pages localisée via la table du générateur plutôt qu'une seconde copie ; hôte tiers exclu du constat d'échec réseau | oui | **Généralisable → remonté en RT-63.** Le correctif est local, mais la cause — un contrôle que rien n'invoque — ne l'est pas. |
| Le bandeau de consentement recouvrait le haut de page sur les captures de contrôle | Le script de capture le referme avant de photographier, et neutralise les animations de révélation via la préférence d'animations réduites, que la feuille de style du site honore déjà | non | **Rien de généralisable ici**, mais c'est la pièce technique qui manquait à RT-58 (lot 20260826h) pour câbler une capture pleine page automatique. Consignée pour que ce retour-là n'ait pas à la redécouvrir. |
| 15 clés de traduction orphelines par langue et 1,6 Ko de données mortes servies à chaque visite | Retirées des 7 fichiers de langue ; charge utile réduite de 3745 à 1821 octets ; `booking.js` de 207 à 74 lignes | non | **Rien de généralisable** — c'est la dette normale d'une suppression de fonctionnalité, payée dans le même mouvement. Consignée parce qu'elle mesure ce qu'un encart supprimé laisse derrière lui quand on ne regarde que le HTML. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Ce lot naît d'un
retour humain sur la forme des restitutions et de l'enquête qui a suivi ; il ne produit ni ne
consomme de livrable de la bibliothèque. La section est **déclarée vide, elle n'est pas omise**.

## Confirmations positives

- **Le référentiel de restitution documente ses propres versions, et c'est ce qui a permis de
  dater le défaut.** Sans le journal des versions 2.1.0, 2.4.0 et 2.5.0 — chacune avec le retour
  humain qui l'a motivée —, le doublon aurait été traité comme un défaut neuf. Il a pu être
  reconnu comme une **régression documentée**, ce qui change la proposition du tout au tout.
- **L'oracle du gate est utilisable seul, sur un fichier.** `oracle-synthese` accepte un chemin
  et rend un verdict JSON. C'est ce qui rend le pré-jugement possible en une commande, sans
  réimplémenter la moindre règle — un oracle qui ne serait invocable que par son hook aurait
  rendu RT-61 insoluble côté produit.
- **Les messages d'échec portent le geste qui répare.** S17 ne s'est pas contenté de refuser :
  il a cité la ligne fautive en entier, ce qui a permis de voir immédiatement que « entrée 78 »
  était pris pour une position. Un message qui nomme la pièce est ce qui a transformé un refus
  en constat opposable.

## Ordre recommandé

1. **RT-61** — d'abord, parce qu'il coûte au lecteur à chaque tour de chaque produit, et parce
   que sa correction est déjà écrite dans le référentiel : il s'agit de rétablir un dispositif
   documenté, pas d'en inventer un.
2. **RT-62** — ensuite, parce qu'il est la cause immédiate de deux des trois refus mesurés :
   traiter RT-61 sans lui réduirait le coût du refus sans réduire le nombre de refus injustifiés.
3. **RT-63** — enfin, parce qu'il ne coûte rien tant que personne ne lit les scripts concernés —
   et que c'est précisément ce qui le rend facile à repousser indéfiniment.
