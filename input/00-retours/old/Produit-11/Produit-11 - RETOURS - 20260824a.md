# Retours forges — Produit-11 — 20260824a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : mandat humain du 24/08 — correction des rattachements géographiques de Produit-11,
  puis remise d'un dossier d'arbitrage de onze décisions. Le destinataire a répondu aux onze,
  et a contesté **quatre d'entre elles pour leur RÉDACTION** : « E2 : Rien compris, aucune
  mise en contexte, aucune explication, tout à revoir dans la description », « E3 : Rien
  compris non plus », « F : Rien compris à V1, V3, V4, de quoi parle-t-on ? », et sur un
  cinquième point « On ne comprend pas de quoi on parle, expliquer le contexte complet
  clairement et simplement ». Puis, en clair : *« ne fais pas de simples références à des
  sujets ou des problèmes par des codes comme V4 ou autre. N'emploie pas des termes techniques
  d'expert sans contexte. L'humain doit pouvoir apprendre, comprendre, se rappeler le contexte,
  les problèmes, les choix, les solutions et les impacts sans lire simplement des codes qui ont
  été posés dans un document 3 jours avant. »*
- **Références ledger** : `forge\ledger.jsonl` seq 147 à 153
- **Lot précédent** : `Produit-11 - RETOURS - 20260818a.md`, remis et donc immuable.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-08-24

**Numérotation** : Produit-11 tient une séquence `RT-nn` ; RT-1 … RT-28 sont consommés. Ce lot
continue en RT-29 … RT-31.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Vérification préalable, faite avant rédaction** (doctrine du lot 20260817b : un retour qui
réclame l'existant se fait renvoyer). `gabarits\RESTITUTION.md` a été lu en entier (428 lignes,
v2.10.0) ainsi que `gabarits\JARGON-A-GLOSER.json`, `REGLES-PROJET.md` §I (règle 29) et
`gabarits\docs-projet\TODO-PRODUIT.md`. **La doctrine demandée existe déjà et couvre l'essentiel** :
S15 exige le rappel du sujet en 25 mots sans identifiant nu, S16 la recommandation et sa source,
S19 la conséquence de l'inaction, S20 la glose du jargon, S9 l'ouverture en langage commanditaire.
Les trois retours ci-dessous ne réclament donc **rien qui existe** : ils portent sur ce que ces
règles ne peuvent pas voir, et sur le fait qu'aucune d'elles n'a atteint cette session.

---

## pilot (`digit-ai-factory`)

### RT-29 — La doctrine de restitution n'atteint PAS une session qui travaille dans un dépôt produit — gravité **bloquant**

**Le constat, mesuré sur ce dépôt.** `Produit-11` ne porte **aucun** `CLAUDE.md`,
**aucun** dossier `.claude\`, et aucune occurrence de « restitution » ou « synthèse » dans ses
huit fichiers de `docs\projet\`. Le hook qui rend la règle opposable —
`oracles\hook-restitution.mjs`, bloquant depuis la v2.4.0 — vit chez le pilot et **nulle part
ailleurs**.

**Conséquence, mesurée sur la session du 24/08** : environ dix messages de fin de traitement ont
été remis à l'humain. **Aucun** ne portait la structure en huit blocs. Aucun ne portait de bloc 0.
Aucun n'a été jugé, ni signalé, ni refusé — parce qu'il n'y avait ni doctrine chargée ni oracle
armé. Le défaut n'a été découvert que par la contestation humaine, cinq heures et onze décisions
plus tard.

**C'est exactement le défaut que la v1 de RESTITUTION.md décrit d'elle-même** — « elle n'était
citée par aucun run […] une convention qu'aucun run ne charge ne s'applique pas : elle décore ».
La v2 a corrigé le point pour les runs du pilot en la citant à `references\ACCUEIL.md` étape 5 et
à `gabarits\AGENT-CAMPAGNE.md`. **Une session ouverte directement dans un dépôt produit ne passe
par aucune de ces deux portes.** Or c'est le mode de travail réel : les cinq derniers mandats Produit-11
ont tous été conduits depuis le dépôt produit.

**Demande.** Que la doctrine voyage avec le produit, pas avec le pilot. Deux voies, la seconde
étant la moins chère :

1. le socle documentaire produit (règle 20) accueille un neuvième fichier, ou une section, qui
   **cite** RESTITUTION.md et la rend chargeable hors pilot ;
2. **ou** un `CLAUDE.md` produit, posé à l'ouverture du run de version au même titre que
   `.env.example` (R-13), qui renvoie à la doctrine et arme le hook côté produit.

Sans l'une des deux, la règle est tenue **chez celui qui l'a écrite** et nulle part où elle est
consommée — et le contrôle bloquant donne un faux sentiment de couverture.

### RT-30 — Un désignateur INVENTÉ par l'agent échappe à S15 comme à S20 — gravité **majeur**

**Le fait.** Le dossier remis le 24/08 nommait ses objets par des codes que **l'agent venait de
créer dans la même session** : `V1`, `V2`, `V3`, `V4` pour quatre contrôles de plausibilité
géographique, et `A1`, `B2`, `E2` pour les décisions elles-mêmes. Réponse du destinataire :
« Rien compris à V1, V3, V4, de quoi parle-t-on ? ».

**Pourquoi les deux règles existantes ne le voient pas :**

- **S15** interdit l'identifiant nu comme **sujet d'une décision**, et son exemple est `TF-0469` —
  un identifiant **de registre**, écrit ailleurs, avant. Elle vise ce que le lecteur ne peut pas
  connaître. Un code que l'agent vient d'introduire *dans le même message* passe le test de forme
  si une phrase de sujet l'accompagne — et c'était le cas : les décisions portaient bien leur
  rappel. Ce qui a manqué, c'est que **le code a ensuite servi de raccourci** dans les renvois,
  les tableaux et les blocs suivants, sans jamais redire ce qu'il désigne ;
- **S20** glose le jargon depuis un référentiel **fermé**, alimenté par les termes qui ont déjà
  coûté un aller-retour. Un désignateur créé le jour même **ne peut pas y être** : le référentiel
  est, par construction, en retard d'un aller-retour sur l'agent qui invente.

**Ce que ça coûte.** Le lecteur ne peut pas apprendre ni se rappeler un code dont l'unique
définition vit dans un message qu'il a lu une fois. La forme paraît conforme, la lecture est
impossible, et l'aller-retour est complet : ici, quatre décisions sur onze ont dû être
redemandées.

**Demande.** Une règle symétrique de S20, du côté de l'**émission** et non du référentiel : un
désignateur que l'agent crée pour nommer un objet (contrôle, oracle, lot, phase) **n'est pas
admis comme sujet ni comme renvoi** dans les blocs 0, 3 et 8 — l'objet s'y nomme par ce qu'il
fait, en mots. Le code reste licite dans les blocs de preuve (4, 5) et dans les fichiers.
Contrôle possible et bon marché : un jeton de la forme `[A-Z][0-9]{1,2}` ou `[A-Z]{1,3}-[0-9]+`
qui apparaît dans les blocs 0/3/8 **sans être suivi d'une glose dans la même puce** est un défaut
— indépendamment de tout référentiel, donc sans le retard structurel de S20.

### RT-31 — Un dossier de plusieurs décisions n'a aucun endroit pour son contexte COMMUN — gravité **majeur**

**Le fait.** Le dossier du 24/08 portait **onze décisions**, toutes issues d'une même enquête :
des annonces immobilières rattachées à la mauvaise commune, découvertes en corrigeant une
anomalie. S15 demande à chaque décision un rappel de sujet d'au moins 25 mots. Appliquée onze
fois à des décisions qui partagent la même histoire, la règle laisse deux issues, mauvaises
toutes les deux :

- **répéter** le contexte commun onze fois — le dossier devient illisible par sa longueur ;
- **le supposer connu** et n'écrire que le delta — c'est ce qui a été fait, et c'est ce qui a
  produit « aucune mise en contexte ».

Le bloc 0 ne résout pas la question : il tient l'**état**, la **conséquence** et **l'attendu** en
un paragraphe, pas l'exposé d'un problème et de sa chaîne causale.

**La demande humaine dit exactement le besoin**, mot pour mot : *« L'humain doit pouvoir
apprendre, comprendre, se rappeler le contexte, les problèmes, les choix, les solutions et les
impacts »*. Six choses, dont **trois** — apprendre, comprendre, se rappeler — ne sont couvertes
par aucune règle du bloc 3, qui traite les décisions comme indépendantes.

**Demande.** Quand le bloc 3 porte **trois décisions ou plus issues d'un même sujet**, il ouvre
par un **contexte commun** — ce qu'on a cherché, ce qu'on a trouvé, pourquoi ces décisions
existent — dont chaque rappel de sujet devient le delta. La règle rend alors S15 tenable :
25 mots suffisent quand le socle est posé au-dessus, et ne suffisent jamais quand il ne l'est pas.

---

## Ce que ce lot NE demande pas

- **Rien sur S16, S19, S21** : recommandation + source, conséquence de l'inaction, trace mesurée
  d'une impossibilité. Les trois règles couvrent leur objet, et le dossier du 24/08 les tenait —
  ce n'est pas ce que le lecteur a contesté.
- **Rien sur le format en huit blocs lui-même** : il n'a pas été mis en défaut, il n'a pas été
  employé. C'est l'objet de RT-29.
- **Aucune anomalie produit** : les défauts géographiques appartiennent à Produit-11 et vivent dans son
  `docs\projet\TODO-PRODUIT.md`, créé le 24/08 — lequel manquait, ce qui est un écart à la
  règle 20 du corpus, corrigé par le produit sans qu'un retour soit nécessaire.
