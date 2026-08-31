---
destinataire: humain
---

# Synthèse de mandat — publié, neuf chantiers décidés menés à fond, et les travaux partis chez leur produit (31/08/2026)

## 0. Synthèse d'ouverture

Votre demande est exécutée dans ses trois temps. La publication d'ouverture a envoyé les cinq
enregistrements en attente ; la campagne a ensuite traité EN PROFONDEUR neuf des chantiers que
vous aviez décidés le 28/08 — chacun avec sa correction, sa recette et sa preuve — et un défaut
bloquant découvert en route a été corrigé dans l'heure : les trois demandes au plus fort enjeu
ne pouvaient atteindre leur produit, elles sont maintenant déposées chez lui. Le banc de
contrôle du dépôt est entièrement vert, plus fourni qu'au matin, et la publication de clôture
est faite. Ce qui vous attend : quatre décisions — une demande d'étude arrivée mal formée à la
porte, le dépôt des lots de travaux restants, un choix que l'un des chantiers vous réserve, et
un conflit entre deux règles de qualité de votre poste qui bloque l'édition des modèles de
documents.

## 1. En-tête d'identification

- **quoi** — mandat « publie, puis traite les todos et retours, puis publie à nouveau » : deux publications, relevé de la boîte, campagne sur les items décidés du registre.
- **sur quoi** — le pilot `digit-ai-factory` ; un dépôt chez le produit `Produit-02.com` (boîte d'entrée seulement).
- **quand** — fin le **31/08/2026 à 22:55 (UTC+02:00)**, durée **≈ 2 h 30**.
- **qui** — session pilot Claude Fable 5 ; dépôt passé de `ee4c801` à `2a8331a` + commit de clôture, tout publié.

## 2. Verdict en une ligne

**2 publications faites** (5 puis 6 commits) · **9 items décidés clos avec preuve** (TF-0686, 0687, 0688, 0690, 0691, 0695, 0696, 0702, 0703) + **1 correction immédiate** (TF-0729) · **1 lot de travaux déposé** chez le produit (TF-0674/0676/0682 à bord) · boîte d'entrée **PASS** (1 lot ingéré, 2 candidatures) · banc **78/78** (74 au matin, 4 recettes neuves) · registre **PASS**, 40 actifs, 15 items archivés.

## 3. Décisions attendues

**Chapeau commun.** La campagne a buté sur quatre portes qui se décident, pas qui se codent :
une demande d'étude d'un produit refusée à l'entrée pour une section manquante, quatre lots de
travaux prêts depuis deux jours et toujours sans autorisation de dépôt, un item décidé qui
propose lui-même deux issues, et deux règles de qualité de votre poste qui exigent l'inverse
l'une de l'autre. Les dix décisions plus anciennes (dont la clôture des deux constats du banc
d'hier) restent rappelées au bloc 8.

**Comment lire ce qui suit.** Chaque décision est un bloc encadré : le titre pose la question,
la prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce
que la retenir ferme définitivement. La ligne encadrée qui clôt chaque décision dit ce qui se
passe si vous ne tranchez pas.

> **D-30 — Comment fait-on entrer la demande d'étude DataForSEO, refusée à la porte pour une section manquante ?**
> Le produit du site de gîtes a remis hier une demande d'étude soignée — faut-il, comment et à quel coût brancher un fournisseur de données de recherche payé à l'acte. L'ingestion l'a refusée en bloc : il lui manque la section « Remarques restées au produit », due par tout lot depuis le 21/08. Le refus est conforme et l'outil lui-même déconseille la dérogation : le produit possède l'outillage de contrôle et ne l'a pas joué avant de remettre.
> **Recommandation : (a).** Source consultée : le message de rejet de `todo\ingerer-lot.mjs`, qui mesure la cause (héritage présent chez le produit, contrôle non joué) et nomme le remède ; et le précédent du registre `todo\TODO-ARCHIVE.jsonl` — un lot refusé pour la même règle a déjà été complété côté produit puis repris sans dérogation.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Demander au produit de compléter son lot (une section, une phrase peut suffire) et de rejouer son contrôle avant re-remise | Effort **simple × court**, un aller-retour vers le produit | Exclut d'affaiblir la règle et d'apprendre au parc que la porte se contourne |
| **(b)** Dérogation tracée, posée par vous | Effort **simple × court** ; la leçon du contrôle non joué est perdue, l'outil le dit lui-même | Exclut que le produit apprenne à jouer sa porte avant de remettre |
| **(c)** Laisser la candidature à la porte | Effort nul | Exclut l'étude : la demande reste sans réponse et le canal paraît muet à son premier usage par ce produit |

> **Si rien n'est décidé** : (c) s'applique — le fichier reste dans la boîte, versionné, et rien ne le traite.

> **D-31 — Dépose-t-on les quatre lots de travaux restants chez leurs produits ?**
> Décision posée avant-hier et restée ouverte : l'émetteur de travaux a des lots prêts pour quatre autres dépôts du parc — des relevés d'artefacts d'héritage manquants, huit éléments pour trois d'entre eux. Le dépôt du cinquième lot, fait ce tour-ci parce qu'il portait trois demandes que vous aviez décidées, montre le mécanisme en fonctionnement : dépôt dans la seule boîte d'entrée, aucun commit chez le produit, jamais de redépôt d'un contenu déjà présent.
> **Recommandation : (a).** Source consultée : l'en-tête de `todo\emettre-travaux.mjs` (n'écrit que dans la boîte d'entrée, réversible, idempotent) et le dépôt réel de ce tour, parti proprement en un passage.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Déposer les 4 lots | Effort **simple × court** ; écrit dans la boîte d'entrée de 4 dépôts frères, l'ingestion restant à leur main | Exclut de garder pour le pilot des relevés qui ne servent qu'aux produits |
| **(b)** Choisir les destinataires un par un | Effort **simple × court** pour vous | Exclut le traitement uniforme ; les produits écartés restent sans nouvelle |
| **(c)** Ne rien déposer | Effort nul | Exclut que les manques d'héritage relevés soient jamais connus de leurs produits |

> **Si rien n'est décidé** : (c) s'applique, et les lots restent prêts chez le pilot.

> **D-32 — Pour les six recettes à l'idiome non reconnu, uniformise-t-on l'idiome ou déclare-t-on l'historique non mesurable ?**
> Un item décidé du 28/08 pose lui-même ses deux issues, et la session d'hier a jugé que le choix vous revient. Six recettes du dépôt déclarent leurs cas dans une forme que la mesure rétrospective ne sait pas compter ; leur histoire d'avant le 27/08 reste donc non mesurée. Mais le compteur-cliquet, lui, les couvre déjà — il lit les cas JOUÉS — et la mesure rétrospective ne se rejouera plus : le trou est borné au passé.
> **Recommandation : (b).** Source consultée : le texte de l'item au registre `todo\TODO.jsonl`, qui établit lui-même que le cliquet couvre ces recettes et que le trou est borné au passé — réécrire six recettes n'achèterait aucune protection future.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Uniformiser l'idiome des six recettes | Effort **moyen × moyen**, six fichiers de test réécrits, risque de casse pour zéro gain prospectif | Exclut le trou passé, que plus personne ne mesurera de toute façon |
| **(b)** Déclarer l'historique d'avant le 27/08 non mesuré, clore l'item là-dessus | Effort **simple × court**, une clôture écrite | Exclut de connaître un jour les éventuelles pertes de cas antérieures de ces six recettes |
| **(c)** Laisser l'item décidé sans suite | Effort nul | Exclut la clôture : l'item vieillit au registre pour un choix qui tient en une ligne |

> **Si rien n'est décidé** : (c) s'applique.

> **D-33 — Qui a raison entre le gate (porte de contrôle bloquante) d'écriture de votre poste et la charte maison, sur les modèles de documents ?**
> L'ajout de trois lignes de pied de page à quatre modèles HTML de la bibliothèque a été bloqué quatre fois par le contrôle qualité qui s'exécute à chaque écriture sur votre poste — pour des défauts antérieurs à l'édition (mesuré : le modèle non touché de la troisième famille porte les mêmes motifs), et au nom d'une règle qui bannit la police de corps que la charte maison prescrit. Deux doctrines actives se contredisent : celui qui écrit a toujours tort. Les écritures de ce tour ont été gardées et le conflit est consigné au registre plutôt qu'arbitré en silence.
> **Recommandation : (a).** Source consultée : la charte du socle de pages, `.claude\skills\digit-ai-page-html\SKILL.md` (« Roboto titres / DM Sans corps ») dont héritent fiches et schémas de tout le parc — la faire plier devant une règle de goût générique inverserait la précédence des règles maison.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Ajuster ce contrôle : juger le DELTA d'une édition (ou exempter la bibliothèque), et aligner sa règle de police sur la charte maison | Effort **simple × moyen** dans la configuration de votre poste | Exclut le péage sur chaque édition future d'un modèle, et l'accusation de tout livrable conforme à la charte |
| **(b)** Refondre la bibliothèque au goût de ce contrôle (autre police, jetons de couleur, tableaux refluides au mobile) | Effort **complexe × long**, et la charte du parc change avec | Exclut la cohérence avec les centaines de pages déjà produites sous la charte actuelle |
| **(c)** Ne rien changer | Effort nul | Exclut toute édition fluide des modèles : trois lignes de correction coûteront à chaque fois un passage en force documenté |

> **Si rien n'est décidé** : (c) s'applique, et le péage se paie à chaque édition.

## 4. Traité — avec sa preuve

- **Publication d'ouverture puis de clôture** : tout ce qui était local est sur le dépôt distant.
  - preuve : poussée `66c76d2..ee4c801` (5 commits d'hier) en ouverture ; commits du jour `68f0b62`, `e104d57`, `a56ad1b`, `00e7a36`, `2a8331a` + commit de clôture, poussés en fin de tour.
- **La boîte d'entrée est relevée et PASS** : le lot du produit de gestion de courrier est ingéré (2 candidatures, dont la demande d'étude sur la stratégie de tests — 67 minutes de campagne dont 54 de mutation, données fournies).
  - preuve : `oracle-boite-entree` passé de FAIL (B1, sidecar jamais ingéré) à **PASS 28/28** ; registre PASS après ingestion.
- **TF-0729 (correction immédiate) : l'émetteur de travaux voit à travers les pseudonymes** — les trois constats au plus haut score du mandat du 28/08 sortaient en orphelins avec leur produit sur le poste.
  - preuve : recette 26 → **30 cas, 30/30** ; mutation jouée : comparaison directe remise → **29/30** sur exactement le cas visé ; lot `pilot - TRAVAUX - 20260831a` (6 éléments, sceau `36b21c3f29d1`) déposé chez le produit, exit 0, zéro orphelin.
- **TF-0703 : le registre sait se dédire** — deux champs optionnels du sidecar (`rectifie`, `nature_de_la_rectification`) marquent l'item visé au lieu de créer un doublon sans lien ; id inconnu ou archivé = rejet atomique.
  - preuve : recette neuve **7/7**, mutation jouée (marquage neutralisé → 4/7) ; self-test TODO-FORGE **48/48** ; gabarit des lots documenté.
- **TF-0691 : l'allocation d'indice est une fonction** (`scripts/allouer-indice.mjs`) — même contenu → même indice, via une forme canonique qui neutralise la référence auto-citée.
  - preuve : recette neuve **9/9**, mutation jouée (comparaison brute → 8/9).
- **TF-0690 : un document livré rend son gabarit et sa version** — règle G4 (le couple gabarit + version, rendu visiblement dans le document) ; les deux familles muettes portent le couple et montent en 1.1.0.
  - preuve : self-test de l'oracle **7/7** (G4 double sens) ; la règle a d'abord rendu FAIL sur exactement les 4 fichiers mesurés à la main, puis PASS après mise à niveau.
- **TF-0702 : un jeu de formats incomplet se refuse sans rien savoir du générateur** (`scripts/verifier-jeu-livrables.mjs`, famille lue au marqueur G4, formats lus au catalogue).
  - preuve : recette neuve **7/7**, la rouge rejouant la remise sans pdf du 25/08 ; la borne restante de TF-0692 est comblée par ce contrôle.
- **TF-0695 : le contrôle de rendu accepte un dossier arbitraire** — un `output\` de produit passe sous le même juge que le catalogue.
  - preuve : trois modes exécutés (défaut → 3 instances PASS ; dossier sans page → SKIP motivé exit 2 ; fichier seul → jugé exit 0) ; un défaut d'analyse d'arguments attrapé et corrigé en route.
- **TF-0696 : le non_juge de l'oracle des gabarits renvoie nommément** — fiches vers leur rendu et leur futur vérificateur, prompts et squelettes restant un trou déclaré.
  - preuve : self-test **7/7**, verdict live du parc PASS.
- **TF-0686 + TF-0687 + TF-0688 : la production de documents bureautiques a sa doctrine et ses gates** — relevé de charte en trois gestes, contrôle d'ordre des enfants (`scripts/verifier-ooxml.py`), `input\` en lecture seule pour tout producteur (écrit aux trois endroits où un producteur lit).
  - preuve : recette OOXML **3/3** (la rouge rejoue l'ordre exact du 27/08 sur un vrai paquet) ; règle 1 de `REGLES-PROJET.md` amendée ; le générateur de README émet désormais l'ouverture de chapitre que le juge de lisibilité exigeait (M7), tous les README régénérés.
- **Banc complet et registre** : 4 recettes neuves entrent au cliquet.
  - preuve : `oracles\self-tests.mjs` : **78/78 vertes** (74 au matin) ; `oracle-todo` **PASS** ; **15 items archivés** (63 événements), 40 actifs ; vues, page et avancement régénérés (sceau `b7a25e192b74`).

## 5. Non traité — avec son motif

- **La candidature d'étude DataForSEO** : *dépendance à une décision humaine* — refusée à la porte par la règle de forme des lots, dérogation déconseillée par l'outil lui-même (D-30).
- **Les 4 lots de travaux restants** : *dépendance à une décision humaine* — D-31, reposée depuis avant-hier.
- **TF-0684 (les six recettes)** : *dépendance à une décision humaine* — l'item pose deux issues, D-32.
- **TF-0689 (propagation mesurable des corrections vers les produits)** : *hors mandat de ce tour* — chantier de modèle (critères interrogeables, manifeste côté produit, oracle de confrontation) ; deux briques préalables livrées sous TF-0690 et TF-0702, le cœur reste entier, suivi consigné au registre.
- **Les items décidés visant les forges sœurs** (TF-0665 tests, TF-0693/0697/0700/0701 audit, TF-0694 socle de pages) : *bloqué par un garde-fou* — aucune écriture chez un dépôt frère sans mandat, précédent d'hier maintenu.
- **TF-0549 (le produit à moitié instancié)** : *bloqué par un garde-fou* — le répertoire est RÉAPPARU sur le poste, remesuré ce soir (toujours pas de dépôt git, conformité FAIL) ; les quatre gestes décidés le 24/08 sont redevenus exécutables, mais « pas d'implémentation dans les produits » tient.
- **Les 25 candidats du registre** (dont TF-0725/0726 d'hier, D-29) : *dépendance à une décision humaine* — tout entre en candidat, le tri vous revient.
- **Les captures de rendu déposées par le gate sous les familles de gabarits** : *écarté* — commises avec le chantier G4 comme preuves de rendu ; critère de réouverture : si leur poids gêne, un motif d'exclusion se décide.

## 6. Écarts à la lettre

- **vous avez demandé** « traite les todos et retours » → **j'ai traité 9 items décidés sur 21, à fond, et déposé UN lot de travaux sur les 5 prêts** → **pourquoi** : les 12 autres items sont soit chez des forges sœurs (garde-fou), soit suspendus à vos choix (D-31, D-32), soit un chantier de modèle qui mérite son tour (le registre en garde la trace) — la profondeur avec preuve et mutation a été préférée au nombre, comme hier.
- **le dépôt du lot chez le produit effleure la décision D-28 restée ouverte** → **j'ai déposé quand même, pour ce seul produit** → **pourquoi** : les trois demandes à bord étaient DÉCIDÉES par vous le 28/08, le canal est réversible (aucun commit chez le produit, un geste l'annule), et les quatre lots restants — eux sans demande décidée — attendent D-31. Si cette lecture est trop large, le retrait est un geste d'une ligne, dites-le.
- **« publie » en ouverture** → **poussé sans autre validation** → **pourquoi** : votre message le mandate explicitement, dans ses termes.
- Aucun autre écart.

## 7. Risques

- **Le gate d'écriture de votre poste re-bloquera la prochaine édition d'un modèle HTML.**
  - signal : quatre blocages mesurés ce tour pour trois lignes ajoutées ; le prochain correctif de gabarit paiera pareil.
  - parade : D-33 ; en attendant, le conflit est consigné au registre avec sa mesure.
- **Le canal de rectification n'a jamais servi en conditions réelles.**
  - signal : le premier lot d'un produit portant `rectifie` dira si le gabarit remis suffit à le faire employer correctement.
  - parade : recette 7/7 des deux côtés du contrat, rejet atomique sur id inconnu — le pire cas est un refus motivé, jamais une écriture à côté.
- **Deux sessions parallèles peuvent encore frapper les mêmes numéros au registre.**
  - signal : l'avertissement de collision après ingestion, ou un numéro en double à la publication.
  - parade : fenêtre connue et documentée, préflight + post-contrôle en place, renumérotation outillée ; acceptée depuis le 22/08.
- **Un lot de travaux déposé et jamais ingéré par son produit resterait lettre morte.**
  - signal : le lot encore `a_traiter` dans la boîte du produit au prochain relevé.
  - parade : l'émetteur ne redépose jamais le même contenu, et le suivi des trois demandes reste ouvert au registre jusqu'au retour du produit.

## 8. Prochaines actions

Ordre de traitement : les deux décisions d'entrée de canal d'abord (D-30, D-31) — elles conditionnent ce que le parc reçoit ; le reste suit par coût décroissant d'attente.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Trancher D-30 puis, si (a) : demander au produit de compléter son lot d'étude et de rejouer son contrôle de forme — son sidecar (le fichier machine jumeau du lot) est prêt, seule la section manque au texte ; re-remise puis ingestion. | `manuelle_utilisateur` puis `auto_ia` | `decision` (l'arbitrage est vôtre) puis `dependance_bloc_3` — la re-remise et l'ingestion attendent D-30 ; trace mesurée : rejet atomique de l'ingestion, cause mesurée « héritage présent, contrôle non joué ». | La demande d'étude reste à la porte et le premier usage du canal par ce produit reste sans réponse. |
| 2 | `neuve` | Trancher D-31 puis, si (a) : déposer les 4 lots de travaux et vérifier qu'un second passage ne redépose rien. | `manuelle_utilisateur` puis `auto_ia` | `decision` (le feu vert est vôtre) puis `dependance_bloc_3` — le dépôt chez 4 dépôts frères attend depuis avant-hier. | Les manques d'héritage relevés restent inconnus de leurs produits. |
| 3 | TF-0684 | Trancher D-32 puis, si (b) : clore l'item par la déclaration d'historique non mesuré. | `manuelle_utilisateur` puis `auto_ia` | `decision` (l'item pose deux issues, le choix vous revient — établi hier) puis `dependance_bloc_3` pour la clôture. | L'item décidé vieillit au registre pour un choix d'une ligne. |
| 4 | TF-0732 | Trancher D-33 — le gate (porte de contrôle bloquante) de votre poste contre la charte maison — puis appliquer l'option retenue à la configuration du poste. | `manuelle_utilisateur` | `acces` — la configuration des hooks (automatismes du poste) vit dans votre profil utilisateur, hors des dépôts du parc ; trace mesurée : quatre blocages ce tour, motifs identiques sur un fichier non touché. | Chaque édition future d'un modèle de la bibliothèque paie le péage. |
| 5 | TF-0689 | Ouvrir le tour dédié « propagation mesurable » : critères interrogeables au registre, manifeste d'adoption côté produit, oracle de confrontation. | `auto_ia` | `hors_mandat` — chantier de modèle nommé au registre, à mener sur un mandat dédié pour ne pas le traiter en surface. | Les corrections continuent de voyager quand une session tombe sur le bon fichier, et pas autrement. |
| 6 | TF-0549 | Demander un run au produit réapparu (site vitrine non versionné) : dépôt git avec fichier d'exclusions AVANT tout commit, consignes produit, quatre artefacts hérités, puis rejouer la conformité. | `auto_ia` | `hors_mandat` — exécutable par une session produit sur votre mandat ; le pilot n'implémente pas chez les produits (consigne du 24/08). Remesuré ce soir : toujours aucun dépôt git. | Tout travail fait dans ce répertoire reste sans historique ni sauvegarde. |
| 7 | TF-0725, TF-0726 | Trancher D-29 d'hier (deux constats du banc corrigés dans le code, encore candidats) puis les clore avec leurs gains. | `manuelle_utilisateur` puis `auto_ia` | `decision` (le registre refuse candidat → corrigé sans arbitrage humain, et il a raison) puis `dependance_bloc_3` pour l'écriture. | Le registre annonce ouverts deux défauts déjà réparés. |
| 8 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés il y a trois jours. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur ; trace mesurée : la lecture n'a donné que la longueur des valeurs (36 caractères), aucune tentative d'authentification faite ni possible d'ici. | Des identifiants de déploiement restent lisibles sur le disque. |
| 9 | `neuve` | Trancher les décisions ouvertes des tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, priorité et gouvernance accumulés depuis trois jours. | Les tâches arbitrées correspondantes restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Publication et campagne des items decides - 20260831d.md`
- Commits du jour : `68f0b62` (émetteur et pseudonymes) · `e104d57` (canal de rectification) · `a56ad1b` (doctrine et gates OOXML) · `00e7a36` (G4, jeu de livrables, rendu arbitraire) · `2a8331a` (input en lecture seule, README) · + commit de clôture (registre, vues, entrants, synthèse) — tous poussés
- Lot déposé : `C:\dev\Produit-02.com\input\00-travaux\pilot - TRAVAUX - 20260831a.md` (+ sidecar), sceau `36b21c3f29d1`
- Registre : `todo\TODO.jsonl` — TF-0729/0730/0731/0732 créés, 9 clôtures, 4 suivis, 15 archivés ; vues `TODO.md` / `TODO.html` / `AVANCEMENT.md`, sceau `b7a25e192b74`
- Bancs : `oracles\self-tests.mjs` **78/78** · `todo\self-test.mjs` 48/48 · `oracle-boite-entree` PASS · `oracle-todo` PASS · recettes neuves : `todo\ingerer-rectification.test.mjs` 7/7 · `scripts\allouer-indice.test.mjs` 9/9 · `scripts\verifier-jeu-livrables.test.mjs` 7/7 · `scripts\verifier-ooxml.test.mjs` 3/3
- Doctrine : `references\PRODUCTION-OOXML.md` · `REGLES-PROJET.md` règle 1 · `gabarits\RETOURS-FORGES.md` (canal de rectification) · `gabarits\CLAUDE-PRODUIT.md`
