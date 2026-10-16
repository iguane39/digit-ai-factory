# Retours forges — Produit-05 — 20260822a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : rétrospective demandée par le client à la clôture du rapport HTML de synthèse
  Produit-05. Fait mesurable : **quatre versions livrées** pour un seul document (`20260820a`,
  `b`, `c`, puis `20260821a`), et **quatre sujets ont demandé deux passages** — dont deux
  demandes explicites incomplètement traitées. Le client résume : « il a fallu plusieurs
  allers-retours pour les traiter » et « d'autres demandes n'ont pas été faites tout de
  suite, il a fallu demander plusieurs fois ».
- **Références ledger** : aucun ledger dans ce projet (run hors pilot). Pièces :
  `output/v2-architecture-cible/rapport/REVUE.md` §3 des versions successives,
  `rapport/old/` (les trois versions intermédiaires, conservées).
- **Lots précédents** : `20260820a` et `20260820b` (remis le 20/08), `20260821a` (à remettre).
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\`.
  **Remise soumise à validation humaine** (règle 18).
- **Statut** : remis le 2026-08-22

**Numérotation** : les lots précédents ont consommé RD-1 à RD-15 et RA-1 à RA-9. Ce lot
continue en RD-16 à RD-19 et RA-10.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Avertissement de méthode : ce qui relève de la discipline, pas de l'outillage

Ce lot serait malhonnête s'il n'ouvrait pas par là. **Sur les cinq causes identifiées, trois
relèvent de la conduite du run et d'aucun outil** :

1. **Correction à l'instance au lieu de la classe.** Un mot coupé signalé (« Utilisable ») a
   été corrigé en élargissant *cette* colonne, alors que la cause était une propriété CSS
   appliquée à toutes les cellules. Deux autres mots restaient coupés ailleurs ; le client les
   a trouvés au tour suivant. La contre-mesure est un réflexe, pas un outil : chercher le
   mécanisme fautif dans tout le fichier, pas le symptôme signalé.
2. **Absence de liste de contrôle sur une demande multiple.** Une demande de dix-sept points a
   été traitée sans tableau de suivi ; un point — le formatage des documents embarqués — est
   passé à la trappe et a dû être redemandé.
3. **Interprétation minimale non vérifiée.** « Le document est inclus » a été satisfait par un
   bloc de texte brut de 67 Ko : littéralement conforme, concrètement illisible. Personne n'a
   ouvert le résultat pour essayer de s'en servir.

Les cinq retours ci-dessous portent sur ce qui reste : **des défauts visibles, mécaniquement
détectables, qu'aucun oracle de la chaîne ne regarde aujourd'hui**. Chacun a coûté au moins un
aller-retour client sur ce projet.

## forge-design (`digit-ai-forge-design`) — skill `digit-ai-page-html`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-16 | majeur | **Aucun contrôle ne compare la largeur d'un bloc de texte à celle de ses blocs frères — c'est le défaut le plus coûteux du projet : trois allers-retours.** Signalé trois fois par le client, sous trois formes : « colonne de texte à 40 % de la fenêtre » (version a), « le texte d'intro devrait être sur toute la ligne » et « des textes qui vont à la ligne tout seuls sans raison » (version c), « les lotissements ne prennent qu'une partie de la largeur » (version c). Cause unique à chaque fois : de la prose bornée à 1 080 px placée **au-dessus de cartes ou de tableaux occupant 1 424 px**. L'oracle L2-rendu ne peut pas le voir : il vérifie qu'un bloc occupe la largeur *qui lui est offerte*, et un conteneur borné offre 1 080 px — le bloc les remplit, donc PASS. Ce qui saute aux yeux du lecteur, c'est la **rupture d'alignement entre frères**, que rien ne mesure. | Un contrôle de rendu : pour chaque conteneur, comparer la largeur de ses enfants directs de premier niveau. Si un bloc de texte fait moins de ~80 % de la largeur d'un frère visible, avertir en nommant les deux. Ce n'est pas un FAIL — une mesure de lecture délibérée est légitime — mais l'écart doit être **déclaré** (`data-mesure-lecture="…"`) plutôt que subi. Fixture rouge : la version `20260820c` de ce rapport, conservée dans `rapport/old/`. |
| RD-17 | majeur | **Aucun contrôle ne détecte un mot coupé en deux au rendu.** Trois occurrences signalées par le client sur deux versions : « Utilisabl / e », « Plateform / e », « 231 occurrenc / es ». Cause : `overflow-wrap: anywhere` — nécessaire sur les identifiants techniques et les chemins de fichier, ravageur sur du texte courant dans une colonne étroite. Aucun oracle ne le voit : le texte n'est ni tronqué (L1), ni en débordement (V1), ni en contraste insuffisant (V2). Il est simplement **illisible**, et c'est la première chose que voit un lecteur. | Détectable au rendu sans heuristique : parcourir les nœuds de texte, et pour chaque mot dont les fragments tombent sur deux lignes **sans trait d'union ni césure typographique**, avertir avec le mot et son sélecteur. Complément statique bon marché : signaler `overflow-wrap: anywhere` appliqué à un sélecteur de prose (`p`, `li`, `td` sans restriction), et suggérer de le réserver aux `code`, `a[href]` et cellules d'identifiants. |
| RD-18 | majeur | **Le rendu ne couvre aucun état d'échec ou d'interaction, et `--etats-ouverts` n'y suffit pas.** Deux défauts trouvés par le client, tous deux invisibles au rendu par défaut : le panneau de filtre **crée un ascenseur horizontal** à l'ouverture, et le bouton « Aucun » **détruit l'affichage** — le tableau se réduit à quelques pixels, sans un mot. L'option `--etats-ouverts` existe et a été utilisée : elle ouvre les `details` et le premier panneau de filtre, mais **elle ne produit aucun état d'échec** — filtre sans résultat, recherche sans correspondance, liste vide. Or c'est précisément là que les composants cassent, parce que personne ne les regarde. | Une **matrice d'états** standard, produite par l'outil et capturée : (a) au repos ; (b) tout déplié ; (c) filtre ouvert — sur la première *et* la dernière colonne, les deux ne débordent pas du même côté ; (d) **filtre ne laissant aucune ligne** ; (e) recherche sans correspondance. Chaque état donne sa capture et passe les mesures V1/V2/V4. Le coût est faible : les sélecteurs sont déjà connus du composant de filtres. |
| RD-19 | mineur | **Le workflow « auditer » ne prescrit rien pour une demande client multiple.** `SKILL.md` décrit la boucle de contrôle du livrable, mais ne dit rien de la traçabilité d'une demande de correction : sur dix-sept points reçus en une fois, seize ont été traités et le dix-septième — le formatage des documents embarqués — n'a été découvert que parce que le client l'a redemandé, avec un « Pourquoi ? ». Rien dans la chaîne ne rapproche la demande du livrable. | Ajouter au workflow un gabarit de **liste de contrôle de demande** : un tableau `point demandé → correction apportée → preuve (capture, mesure ou contrôle)`, à remplir avant remise et à joindre à `REVUE.md`. Un point sans preuve est un point non traité. C'est du process, mais c'est le process qui manquait — et il est aussi cheap qu'efficace. |

## forge-agents (`digit-ai-forge-agents`) — skill `quality-oracles`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-10 | majeur | **Aucune règle ne distingue « le contenu est présent » de « le contenu est exploitable ».** Le client a demandé que les documents sources soient inclus dans le livrable autoportant. Ils l'ont été — en blocs de texte brut, dont un de 67 Ko contenant une trentaine de tableaux Markdown. Tous les oracles passent : le contenu est là, la page est conforme, rien ne déborde. Il a fallu que le client écrive « il faut pouvoir formater les MDs, sinon c'est illisible », **puis le redemande une seconde fois**, pour qu'un lecteur à deux vues soit produit. La règle de lisibilité L10 impose déjà un mode d'emploi aux tableaux longs : le principe existe, il ne couvre simplement pas le contenu embarqué. | Étendre la famille lisibilité : un bloc préformaté au-delà d'un seuil (par exemple 4 Ko ou 80 lignes) doit offrir une **alternative de lecture** — mise en forme, sommaire, ou repli par sections — ou déclarer pourquoi le texte brut fait foi (`data-brut-fait-foi="…"`). Même logique que `data-filterable="off"` avec motif : ce qui est délibéré se déclare, ce qui est subi se corrige. Ce retour va de pair avec RD-14 du lot précédent, qui demande le composant lui-même : celui-ci demande la règle qui le rend obligatoire. |

## Confirmations positives

- **Les correctifs remontés le 20/08 sont en production et fonctionnent.** Les trois écarts que
  nous portions depuis deux versions ont disparu, et le rapport passe désormais 14 oracles sur
  14 sans aucun écart documenté.
- **`oracle-tokens` a trouvé quatre défauts réels** que la relecture humaine n'avait pas vus,
  dont un anneau de focus improvisé au lieu de tokens prescrits — un point d'accessibilité.
- **La règle L1 sur les textes coupés a confirmé un défaut signalé par le client** : elle avait
  raison sur le fond, c'est notre CSS qui coupait trop tôt. RD-17 ne demande pas de la
  remplacer mais de couvrir le cas voisin — le mot coupé sans césure.
- **`render_page --etats-ouverts` reste l'outil le plus utile de la chaîne** : sans lui, deux
  défauts d'état supplémentaires seraient passés. RD-18 propose de le pousser plus loin, pas de
  le refaire.

## Ordre recommandé

1. **RD-18** — la matrice d'états : deux défauts trouvés par le client sur ce seul projet,
   tous deux triviaux à reproduire une fois l'état capturé.
2. **RD-16** — la cohérence de largeur entre frères : le défaut le plus coûteux du projet,
   trois allers-retours, et il est mesurable en une dizaine de lignes.
3. **RD-17** — le mot coupé : trois occurrences signalées, détection sans heuristique.
4. **RA-10** — « présent » n'est pas « exploitable » : deux demandes du client pour l'obtenir.
5. **RD-19** — la liste de contrôle de demande : du process, mais c'est lui qui a laissé passer
   un point sur dix-sept.
