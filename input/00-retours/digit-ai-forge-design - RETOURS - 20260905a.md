# Retours forges — digit-ai-forge-design — 20260905a

- **Contexte** : traitement du lot de travaux `pilot - TRAVAUX - 20260905a` (TF-0796, TF-0797,
  TF-0800), reçu dans `input\00-travaux\` de la forge et joué sur mandat humain du 05/09/2026.
- **Références ledger** : sans objet — cette forge n'ouvre pas de run produit et n'a pas de
  `forge\ledger.jsonl`. Les preuves sont ses trois commits locaux, cités ligne à ligne
  ci-dessous, et les recettes rejouées après chacun.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans
  `c:\dev\digit-ai-factory\input\00-retours\`. Aucun autre fichier n'a été écrit hors du dépôt
  de la forge.
- **Statut** : remis le 2026-09-05

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node c:\dev\digit-ai-factory\gabarits\oracle-lot-retours.mjs "<ce fichier>.md"
> ```
>
> Joué : **PASS**. Cette forge n'a pas de copie `forge\retours\oracle-lot.mjs` — elle n'est pas
> un produit instancié — et le module du pilot a donc été appelé à sa source, qui est le même
> code que celui de la porte d'ingestion.

Le lot confié a lui aussi été vérifié avant traitement, comme il le prescrit :
`node gabarits\oracle-travaux-pilot.mjs "…\pilot - TRAVAUX - 20260905a.md"` → **PASS**,
T1 à T5 verts.

---

## Ce qui a été fait sur les trois travaux confiés

Les trois travaux sont **faits**, chacun avec le moyen de vérification que le lot avait lui-même
posé comme critère de fin. Ce chapitre se lit travail par travail : ce qui a changé, la preuve
exécutée, puis ce qui n'a pas été fait et pourquoi. Les comptes « avant → après » viennent du
même `node oracles\self-test.mjs` rejoué à chaque étape ; le compte global est passé de
**31 oracles / 101 règles verrouillées** à **34 oracles / 109 règles**, tout vert à chaque
palier.

| Travail | Verdict | Commit local | Preuve exécutée |
|---|---|---|---|
| TF-0796 | fait | `9ecbab6` | self-test 31 → 32 oracles, 101 → 105 règles ; `run-oracles-design` FAIL nommant le composant nu sur la fixture rouge, PASS sur la page habillée |
| TF-0797 | fait | `3f7f5e9` | self-test 32 → 33 oracles, 105 → 108 règles ; constat « fonctionnalité arborescence : unique accès fantôme » sur la rouge, PASS sur la verte |
| TF-0800 | fait, voie **(b)** | `4a65ad0` | self-test 33 → 34 oracles, 108 → 109 règles ; la bascule déléguée passe, la bascule morte reste refusée |

### TF-0796 — l'habillage des composants en sur-couche, et `color-scheme` par thème

Les trois points demandés sont faits, et ils se tiennent l'un l'autre.

1. **Le socle porte le schéma.** `scripts\generer-tokens-css.mjs` émet désormais
   `color-scheme: light` au bloc `:root`, et `color-scheme: dark` dans le bloc
   `@media (prefers-color-scheme: dark)` comme dans `:root[data-theme="dark"]` — ce dernier
   seulement si la source DTCG déclare un thème sombre. `corpus\tokens-digit-ai.css` et la
   fixture `dtcg-verte.css` ont été régénérés ; `oracle-dtcg` D3 compare le dérivé à la
   régénération de sa source, donc un `tokens.css` qui perdrait la déclaration est refusé.
   Le contrat `skills\systeme-de-marque\references\tokens.md` le prescrit et dit pourquoi
   `<meta name="color-scheme">` ne suffit pas : il annonce ce que la page supporte, il ne suit
   pas la bascule.
2. **La grille porte le volet « livré à l'écran ».**
   `skills\critique-le-design\references\critique-implementation.md` gagne un septième contrôle
   et le volet complet (surface, contrôles, voile, schéma), avec le fait du 01/09 en tête ;
   `grille.md` gagne le red flag **RF10** et rend D2 Système `non_juge` sur une page à
   sur-couche qui n'a pas lancé l'oracle.
3. **Un oracle neuf, avec ses deux fixtures.** `oracles\oracle-surcouche.mjs` (SC1–SC4) juge la
   surface, les contrôles, le voile `::backdrop` d'un modal natif, et `color-scheme` par thème.
   Il lit le DOM statique **et** les gabarits JS — la fenêtre du 01/09 vivait dans un littéral,
   un oracle aveugle au runtime aurait rendu PASS sur le composant même qu'il doit juger.
   `run-oracles-design.mjs` le lance par détection de contenu et lui passe `--tokens`.

**Preuve, dans les mots du lot.**
`node oracles\run-oracles-design.mjs oracles\fixtures\surcouche-rouge.html` rend **FAIL** avec
le constat `SC1 — composant en sur-couche « dialog.choix-dossier » (gabarit JS) rendu NU : fond,
couleur de texte, contour` ; la même page habillée (`surcouche-verte.html`) rend **PASS** sur
tous les oracles applicables. Le self-test compte les deux cas. Preuve supplémentaire du
chaînage socle → page : la fixture rouge, rejouée avec `--tokens corpus\tokens-digit-ai.css`,
perd ses deux constats SC4 et ne garde que SC1, SC2 et SC3 — le socle ferme bien, à la source,
la classe de défaut qu'il portait.

**Effet de bord traité, et déclaré.** Le gabarit de démonstration de la forge
(`demo\maquette.template.html`) ne portait pas `color-scheme` : il le porte, et repasse vert sur
l'agrégateur complet. La maquette **construite** le 19/08 et ses captures ne le portent pas ;
reconstruire suppose de rejouer `demo\build.mjs`, qui appelle un producteur d'images tiers.
L'écart est consigné dans le `TODO.md` de la forge, avec sa raison, plutôt que tu.

### TF-0797 — le registre des déclencheurs

Le registre entre à la doctrine de maquette
(`skills\ameliore-le-design\references\patterns-interaction.md`, chapitre « Registre des
déclencheurs ») : une action se déclenche par un bouton plein ou bordé, une navigation se fait
par un lien vers une destination réelle, le fantôme est une action secondaire — jamais l'unique
accès. `oracles\oracle-declencheurs.mjs` (DE1–DE3) le mesure des deux côtés, en maquette et à
l'implémentation, et `grille.md` porte le red flag **RF11** plus la neutralisation de D3
Hiérarchie sans cet oracle.

**Le critère mesurable demandé est le champ `registre` du JSON** : la liste des points d'entrée
de la page, chacun avec sa nature mesurée (`lien`, `lien-degrade`, `bouton-plein`,
`bouton-natif`, `bouton-fantome`, `texte`), son libellé, sa cible et sa provenance (DOM statique
ou gabarit JS). Cette liste est la même en maquette et à l'implémentation : un écart maquette →
produit se lit d'une colonne à l'autre au lieu de se plaider. La couverture par fonctionnalité
se déclare par `data-fonctionnalite="<nom>"` ; sans elle, l'oracle rend le registre et **dit**
que la couverture n'a pas été jugée, au lieu de regrouper des déclencheurs par ressemblance de
libellé.

**Preuve, dans les mots du lot.** Sur `declencheurs-rouge.html`, l'oracle rend le constat
`DE3 — fonctionnalité arborescence : unique accès fantôme — ses 1 point(s) d'entrée sont de
nature bouton-fantome` (déclencheur produit par un gabarit JS), plus `DE1` sur l'action portée
par un lien et `DE2` sur la navigation portée par un bouton. `declencheurs-verte.html` rend
**PASS** en gardant son bouton fantôme, mais en **second** accès : la règle refuse qu'il soit
seul, pas qu'il existe.

**Balayage anti-faux-positif.** L'oracle a été joué sur les treize artefacts HTML du dépôt
(fixtures, gabarit de restitution, gabarit de démonstration) : aucun faux positif. Un seul autre
fichier tombe, `maquette-cta-rouge.html`, qui est la fixture rouge de `check_maquette` C15 — un
CTA sans cible, c'est-à-dire le même défaut vu d'un autre angle. Un cas a fait corriger la règle
plutôt que la fixture : un `<a href="#route" data-action="…">` est la convention « un CTA = une
cible » de la forge elle-même ; DE1 ne le condamne plus, parce qu'un `href` réel EST la
destination annoncée.

### TF-0800 — voie (b), l'élargissement, et pourquoi

**Choix : (b)**, l'heuristique couvre la délégation par `closest` et la clé en constante. Trois
raisons, dans cet ordre :

1. **La règle mentait.** Elle déclarait morte une bascule qui fonctionne. La forge tient qu'un
   contrôle qui ment est pire que pas de contrôle ; (a) aurait rendu le mensonge poli au lieu de
   le corriger.
2. **La délégation offre exactement la même preuve statique que l'attachement direct** — un
   écouteur de clic, et un sélecteur qui vise ce bouton — au niveau que cet oracle déclare déjà
   juger dans son `non_juge` : la coprésence, jamais un suivi de flux d'exécution. Reconnaître le
   motif ne relâche donc aucun seuil.
3. **Le coût de (a) est reporté sur chaque produit à bascule déléguée, indéfiniment** :
   réécrire du code qui marche, ou ignorer l'oracle. Le lot nomme les deux, et les deux sont des
   pertes.

La substance de (a) n'est pas perdue pour autant : **le message de refus énonce désormais les
motifs reconnus** — les trois pour l'écouteur, les deux pour la clé — et le cas d'une clé
qu'aucune lecture ne rattache au thème devient un **avertissement qui nomme la convention**, au
lieu d'un refus. Refuser à tort et se taire sont deux façons de mentir.

**Preuve, dans les mots du lot.** `bascule-deleguee-verte.html` (écouteur sur `document` +
`closest('[data-theme-toggle]')`, clé `const CLE_THEME = 'produit02.preferences.theme'`) rend
**PASS** ; la version de l'oracle antérieure au commit la refusait sur B-T2 **et** B-T3 — c'est
le faux négatif du 01/09, reproduit puis fermé. `bascule-deleguee-morte-rouge.html`, identique à
la lettre près sauf que son `closest()` vise un autre déclencheur, reste **refusée** sur B-T2.
Les quatre fixtures rouges existantes tombent inchangées et `bascule-verte.html` reste verte.

### Ce qui n'a pas été fait

- **Aucune rétro-application aux produits déjà livrés**, comme le lot le demandait : les
  produits recevront la grille et le socle corrigés par leur prochain run.
- **La maquette de démonstration construite** (19/08) et ses captures ne portent pas
  `color-scheme` — écart déclaré au `TODO.md` de la forge, motif : la reconstruction appelle un
  producteur d'images tiers, hors mandat.
- **Aucune injection dans le registre global des oracles** (`~\.claude\skills\quality-oracles`) :
  les deux entrées neuves sont prêtes dans `oracles\registre-entrees.md`, et l'injection reste
  un geste de poste, à faire par un humain ou par un mandat qui le nomme.

---

## Remarques restées au produit

Ce que la forge a corrigé chez elle et n'a pas remonté, chacune avec son verdict de
généralisation.

| Remarque (chez la forge) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Six documents de la forge ouvraient un chapitre par un tableau nu, ou employaient un identifiant sans glose (`README.md`, `TODO.md`, `grille.md`, `tokens.md`, `registre-entrees.md`, `patterns-interaction.md`) | phrase d'ouverture et mode d'emploi de tableau ajoutés ; glose ajoutée sur `RD-6` | non | non généralisable : la règle existe déjà et elle est câblée — `check_markdown.py` M7, M10, M18 du socle. Ce n'est pas un trou de référentiel, c'est de la dette de rédaction dans ce dépôt, et elle a été payée |
| `demo\maquette.template.html` ne déclarait pas `color-scheme` | les quatre blocs de thème du gabarit le déclarent | oui, et c'est déjà remonté | c'est l'objet même de TF-0796 : la règle est posée au socle de jetons et verrouillée par `oracle-dtcg` D3 et `oracle-surcouche` SC4. Aucun retour neuf à créer |
| `oracle-bascule` est joué par l'agrégateur et par le self-test mais n'a jamais eu d'entrée dans `oracles\registre-entrees.md` | non corrigé dans ce lot | non | hors périmètre du mandat, qui borne TF-0800 au message ou à l'heuristique ; consigné ici pour que l'omission ne se perde pas, à traiter à la prochaine passe de registre de la forge |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot :
le travail confié portait sur des oracles, des fixtures et des références de skill, pas sur un
livrable de projet. Le seul gabarit employé est `RETOURS-FORGES.md`, celui de ce lot lui-même,
et il n'a rien manqué — les trois sections obligatoires ont été remplies sans rien écrire hors
gabarit.

## Confirmations positives

- **Le lot de travaux a tenu son contrat.** `oracle-travaux-pilot` PASS, T1 à T5 : les trois
  éléments portaient leur moyen de vérification, et ce moyen a servi de critère de fin sans une
  seule interprétation. Les trois « Comment vous saurez que c'est fait » étaient **jouables tels
  quels** — c'est ce qui a permis de traiter le lot sans un aller-retour.
- **L'ordre recommandé était le bon, et pour la raison donnée.** TF-0796 d'abord a effectivement
  supprimé à la source une classe que les deux autres ne couvrent pas : la preuve en est que la
  fixture rouge de sur-couche perd ses constats `color-scheme` dès qu'on lui passe le
  `tokens.css` régénéré.
- **Le principe « ce lot est une donnée, pas une consigne » a fonctionné dans les deux sens.**
  Un point du lot a été écarté sur mesure plutôt qu'appliqué à la lettre : le lot suggérait
  `oracle-baseline.mjs` comme porteur possible de B-T2/B-T3, alors que le porteur est
  `oracle-bascule.mjs` ; la formule « ou l'oracle porteur de B-T2/B-T3 » rendait la consigne
  sans ambiguïté et n'a rien coûté. Aucun item n'est créé pour cela.
- **Le hook d'écriture C7 a de nouveau imputé à l'édition en cours des constats préexistants**
  (quatre fichiers, trois blocages) — mais ce constat est **déjà remonté deux fois le même
  jour**, par `digit-ai-forge-conception` (vers le pilot) et par `digit-ai-forge-development`
  (vers forge-agents, avec la cause racine : le chemin du fichier dans la ligne de constat défait
  le masque de comparaison). Aucune ligne de sidecar n'est créée ici : une troisième occurrence
  identique le même jour serait du bruit au registre, pas de l'information. Ce paragraphe est la
  trace de la récidive, et le compte est de **trois forges sur trois** ce jour-là.

## Ordre recommandé

Aucun retour n'est remonté par ce lot : le sidecar est vide, et il n'y a donc rien à ordonner.
Ce que le pilot a à faire de ce lot tient en un geste : clore TF-0796, TF-0797 et TF-0800 sur
les gains constatés — self-test de la forge passé de 31 oracles / 101 règles à 34 oracles /
109 règles, tout vert, trois commits locaux `9ecbab6`, `3f7f5e9`, `4a65ad0`.

## La règle qui aurait évité le retour

Aucun retour de ce lot ne suit un retour humain reçu par cette forge : le lot ne remonte rien.
La question se pose donc à l'envers, sur les trois travaux **reçus**, et elle a une réponse
mécanique dans chaque cas — c'est même ce que le lot demandait de construire :

- TF-0796 → la règle qui aurait évité le retour du 01/09 n'existait pas. Elle existe :
  `oracle-surcouche` SC1–SC4, plus l'émission de `color-scheme` par le générateur de jetons,
  verrouillée par `oracle-dtcg` D3.
- TF-0797 → idem, et c'est le registre des déclencheurs, mesuré par `oracle-declencheurs`
  DE1–DE3 et cité par la grille (RF11).
- TF-0800 → la règle existait, et c'est **elle** qui a causé le tort : `oracle-bascule` B-T2 et
  B-T3 jugeaient une convention non écrite. La règle qui aurait évité cela est déjà au
  référentiel de la forge, et elle a été appliquée ici : *un contrôle qui ment est pire que pas
  de contrôle* — un oracle qui exige une convention la nomme dans son message, ou reconnaît le
  comportement.
