# Lot de retours — Produit-64 → digit-ai-factory — 2026-09-13, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory` (pilot, gabarit de
restitution) · **Origine** : retour humain du 2026-09-13, mot pour mot — « S'il y a des bloquants
pour avancer, il faut les afficher pour que l'utilisateur puisse les traiter, et cela sans avoir à
fouiller dans un fichier quelque part. »

---

## R1 — Une restitution disperse ses bloquants et en définit au moins un par renvoi à un fichier

### Le fait mesuré

Session du 2026-09-13 sur ce produit, trois restitutions successives
(`RESTITUTION-20260913a`, `b`, `c`). À la troisième, une production était bloquée. Les éléments
qui la bloquaient étaient tous présents à l'écran, **et pourtant le destinataire n'a pas pu les
traiter** : ils étaient répartis entre **trois blocs différents**, et le plus important d'entre
eux n'était pas énoncé mais **désigné par un renvoi à une section d'un fichier**.

Répartition mesurée dans `RESTITUTION-20260913c` :

| Où le bloquant apparaissait | Ce qu'il en disait |
|---|---|
| Bloc 3, décision `D-4` | nommait « le préalable bloquant » et renvoyait à « la section `PRÉALABLE BLOQUANT` du prompt réécrit, au chapitre 8 section 3 de l'analyse L99 » — **le contenu du préalable n'était pas repris** |
| Bloc 5, « non traité » | trois puces, chacune avec son motif (`garde_fou`, `dependance_bloc_3` ×2, `dependance_externe`) — mais aucune ne dit ce qu'il faut faire pour les lever |
| Bloc 8, colonne « motif / raison » | quatre lignes portant `garde_fou`, `dependance_bloc_3`, `decision`, `presence` — la même information une troisième fois, sous une troisième forme |

Le destinataire devait donc recoller trois blocs **puis ouvrir un fichier** pour savoir que ce
qui l'empêchait d'avancer tenait en trois valeurs à fournir : le profil réel des apprenants, la
modalité de formation, et l'instance de validation. Ces trois valeurs — la seule chose
actionnable de tout le message — **n'apparaissaient nulle part en clair et rassemblées**.

### Pourquoi c'est un défaut de gabarit et pas un défaut de rédaction

Le gabarit `gabarits/RESTITUTION.md` (v2.21.0) n'a **aucun bloc dédié aux bloquants**. Il a un
bloc « non traité avec motif » (5), un bloc « décisions » (3), un bloc « prochaines actions » (8)
et un bloc « risques » (7). Un bloquant traverse les quatre : il est à la fois un non-traité, une
décision à rendre, une action à débloquer et un risque s'il dure. **Le gabarit garantit donc que
tout bloquant est écrit quatre fois, en quatre endroits, et nulle part en entier.**

La règle `S5` exige un motif par élément non traité ; elle ne demande à aucun moment que le motif
soit **actionnable**, ni que le bloquant soit **autoportant**. Une restitution parfaitement
conforme à S1-S41 peut laisser son lecteur incapable de débloquer quoi que ce soit — c'est
exactement ce qui a été mesuré, `oracle-synthese` ayant rendu PASS sur le message incriminé.

### La règle qui aurait évité le retour

**Aucune règle du socle ne le couvre.** Ni le gabarit de restitution, ni `oracle-synthese`
(S1-S41), ni la loi transverse n° 3 (« l'oubli n'existe pas ») n'exigent qu'un bloquant soit
énoncé en un seul endroit, en entier, sans renvoi. La règle § 4 de `quality-oracles` est donc
déclenchée : **domaine sans oracle → en définir un**.

**Règle proposée** — à écrire dans `gabarits/RESTITUTION.md`, et à jouer par `oracle-synthese` :

> Quand un traitement est arrêté, le **bloc 3 s'ouvre par l'inventaire des bloquants**, avant
> toute décision. Un bloquant y porte trois choses et rien de moins : **ce qui est bloqué**, **ce
> qu'il faut fournir ou décider pour le lever**, et **ce qui se passe si rien n'est fourni**. Un
> bloquant qui renvoie à un fichier, à une section ou à un autre bloc pour être compris **n'est
> pas énoncé** : le lecteur d'une restitution ne doit avoir à ouvrir aucun fichier pour savoir ce
> qui l'empêche d'avancer. Les blocs 5, 7 et 8 continuent de les porter sous leur angle propre ;
> c'est le bloc 3 qui en tient la liste opposable.

**Contrôle proposé** — `oracle-synthese`, règle neuve : si le bloc 5 porte au moins un motif de
la famille bloquante (`garde_fou`, `dependance_bloc_3`, `dependance_externe`,
`gate_gouvernance`), ou si le bloc 8 porte au moins une ligne `auto_ia` non exécutée, alors le
bloc 3 doit ouvrir par un inventaire de bloquants d'au moins autant d'entrées, et **aucune de ces
entrées ne contient de chemin de fichier ni de renvoi à une autre section**. Fixture rouge : le
message `RESTITUTION-20260913c` de ce produit. Fixture verte : le même message, bloquants
rassemblés en tête du bloc 3.

### Classe

**Aucune clé de `forge/retours/CLASSES.json` ne convient** — la famille `restitution-forme` ne
porte que trois classes (`restitution-action-humaine-geste-agent`,
`restitution-fichier-juge-mal-choisi`, `restitution-rendu-visuel-non-critique`) et une quatrième
hors sujet (`decision-humaine-rendue-restituee-sans-geste`). Aucune ne parle de l'énonciation des
bloquants.

**Clé proposée au pilot** : `restitution-bloquants-disperses`, famille `restitution-forme`,
libellé « Les bloquants d'un traitement arrêté sont répartis entre plusieurs blocs et au moins
l'un d'eux est défini par renvoi à un fichier : le lecteur doit recoller la restitution puis
ouvrir un document pour savoir ce qui l'empêche d'avancer ».

Le sidecar porte cette clé **neuve** conformément à la consigne du gabarit de lot — « Aucune clé
ne convient ? Le dire dans le `.md` […] et laisser le pilot créer la classe ». Voir **R2** :
cette consigne et la règle d'ingestion se contredisent.

| Score | Valeur | Motif |
|---|---|---|
| gain | 5 | touche tout message de fin de traitement de l'écosystème, quelle que soit la forge |
| preuve | 5 | retour humain littéral, et répartition comptée sur un message réel jugé PASS |
| effort | 2 | une clause de gabarit, une règle d'oracle, une paire de fixtures déjà disponible |

---

## R2 — Le gabarit de lot prescrit un remède que la règle d'ingestion refuse

### Le fait mesuré

`forge/retours/GABARIT-LOT-RETOURS.md` dit deux choses inconciliables, à quinze lignes d'écart :

> « Lot sans classe, ou à classe inconnue : **refusé à l'ingestion**, avec les clés proches. »

> « Aucune clé ne convient ? Le dire dans le `.md` (section « La règle qui aurait évité le
> retour ») et laisser le pilot créer la classe dans son référentiel : une classe ne se crée
> jamais dans un sidecar. »

Et `forge/retours/CLASSES.json` (v1.13.0, 12/09) le confirme côté référentiel : « Une clé absente
d'ici refuse le lot à l'ingestion ».

Un producteur qui rencontre un défaut réellement neuf — ce qui est le cas de **R1** — n'a donc
aucune sortie conforme : soit il invente une clé et son lot est refusé **en entier**, R2 compris ;
soit il range son retour sous une clé approximative, et il **corrompt le comptage des récidives**,
qui est la mesure même pour laquelle les classes ont été créées le 03/09. La troisième issue est
celle que tout le monde prendra : ne pas remonter le défaut neuf.

**Mesure de la surface** : le référentiel porte 74 classes ; aucune clé réservée du type
`a-classer`, `provisoire` ou `classe-neuve` n'existe — vérifié par filtrage sur
`/creer|nouvelle|indetermin|inconnu|a-classer|provisoire/` → **aucune**.

### La règle qui aurait évité le retour

La classe `regle-qui-interdit-son-propre-remede` (famille `hook-ou-gate`) énonce déjà le défaut
généralisé : « Un contrôle BLOQUANT refuse la correction que son propre message de refus
RECOMMANDE. » Sa règle exige « un cas qui JOUE cette correction et qui doit PASSER — la fixture
du remède est aussi obligatoire que la fixture du défaut ». Cette règle existe et **n'a pas été
appliquée à l'ingestion des lots** : aucune fixture ne joue le cas « le producteur suit la
consigne "aucune clé ne convient" ».

**Remède proposé** : réserver dans `CLASSES.json` une clé `classe-a-creer`, acceptée à
l'ingestion **à la condition** que le `.md` du lot porte la clé proposée, sa famille et son
libellé — ce que ce lot fait. Le pilot crée alors la vraie classe et réindexe le retour. Le lot
n'est plus refusé, et la classe ne se crée toujours pas dans un sidecar.

### Classe

`regle-qui-interdit-son-propre-remede` — récidive du défaut généralisé, sur un nouveau porteur
(la porte d'ingestion des lots, là où la classe avait été fondée sur d'autres contrôles).

| Score | Valeur | Motif |
|---|---|---|
| gain | 4 | débloque la remontée de tout défaut neuf, c'est-à-dire la matière première du mandat d'amélioration continue |
| preuve | 5 | les deux citations sont dans le même fichier, à quinze lignes d'écart, et R1 en est l'instance vécue |
| effort | 2 | une clé réservée, une condition d'ingestion, une fixture |

---

## Remise

Ce lot vise `digit-ai-factory`. Remise dans `input/00-retours/` du pilot, préfixée du nom du
produit émetteur. Le sidecar `Produit-64 - RETOURS - 20260913a.tf.jsonl` porte les deux
lignes, chacune avec `racine_produit` conformément à la règle 8 du `CLAUDE.md` de ce produit —
sans ce champ, le lot entre sans que l'héritage du produit soit jugé.

---

## Remarques restées au produit

Aucune remarque n'est restée au produit. Les deux défauts de ce lot sont des défauts de la
Factory — l'un du gabarit de restitution, l'autre du gabarit de lot et de sa porte d'ingestion ;
aucun des deux ne se corrige dans `Produit-64`, qui ne fait que les subir. La règle 1 du
`CLAUDE.md` de ce produit interdit d'ailleurs toute écriture dans `factory/`.

## Retours sur les documents produits

Deux retours, chacun rattaché à son gabarit d'origine.

| Retour | Gabarit rattaché | Ce que le document a coûté |
|---|---|---|
| **R1** | `gabarits/RESTITUTION.md`, **version 2.21.0 du 11/09/2026**, affichée en en-tête du fichier | aucun bloc ne porte les bloquants : il a fallu les répartir entre les blocs 3, 5 et 8 pour rester conforme, et le lecteur ne les a retrouvés nulle part rassemblés. Champ manquant : un inventaire des bloquants en tête du bloc 3. |
| **R2** | `gabarits/RETOURS-FORGES.md`, reçu ici sous `forge/retours/GABARIT-LOT-RETOURS.md`, en-tête sans numéro de version — seul l'identifiant d'exemple `gd-xxx` y figure | consigne et interdiction à quinze lignes d'écart. Rédiger ce lot a coûté la lecture des 74 clés du référentiel, la recherche d'une clé réservée qui n'existe pas, puis le choix assumé de porter une clé neuve en sachant que la porte la refuserait. Champ manquant : une clé `classe-a-creer`. |

**Retour de forme sur ce gabarit lui-même** : `gabarits/RETOURS-FORGES.md` n'affiche **aucun
numéro de version en en-tête**, alors que R-46 demande de rattacher un retour à « l'id `gd-…` ou
la version affichée en en-tête du document ». Un gabarit qui exige un rattachement de version et
n'en publie pas rend sa propre règle inapplicable à lui-même. `gabarits/RESTITUTION.md` le fait,
lui, et c'est ce qui a permis de renseigner la première ligne de ce tableau.

Aucun autre document de ce lot n'est issu d'un gabarit de la bibliothèque.

---

## R3 — L'oracle mobile de forge-design exige un seuil de repli que le socle HTML ne pose pas

### Le fait mesuré

Deux règles de l'écosystème se contredisent sur le **seuil** du repli en cartes des tableaux.

- **Le socle** `digit-ai-page-html` pose le repli sous `@media (max-width: 900px)` — c'est le
  boilerplate lui-même qui l'écrit, avec son motif en commentaire (TF-0900 : au-dessus de 900 px
  le conteneur ne défile pas, sous 900 px le repli masque le `thead` et rien ne peut plus casser
  un élément collant).
- **`oracle-mobile.mjs` de forge-design**, règle `M4`, cherche une règle de repli sous une requête
  média dont le `max-width` est **inférieur ou égal à 768 px** — et ne la trouve pas.

Résultat sur une page conforme au socle, bâtie sur son boilerplate sans un octet de mise en page
maison : **`FAIL` bloquant, « 5 table(s) sans reflow en cartes sous 768 px : défilement horizontal
forcé »**.

**La mesure qui tranche** : `render_page.py` à 768 px rend **zéro constat `V1`** — aucun
débordement horizontal. Le repli fonctionne à 768 px, puisque 900 le couvre.

**Et l'oracle se contredit dans sa propre sortie** : la même exécution porte un finding `info` de
la même règle `M4` — « thead masqué sous le seuil, mais les étiquettes sont restituées cellule par
cellule (`content: attr(data-label)`) : c'est le repli en cartes prescrit par le socle digit-ai,
pas une amputation (TF-0857) ». L'oracle reconnaît le mécanisme du socle **et** le condamne, dans
le même verdict.

### Ce que cela coûte

Toute page bâtie sur le boilerplate du socle est **bloquée d'office** par `M4` dès qu'elle porte
un tableau. Deux issues pour son auteur, mauvaises toutes les deux :

1. **Écrire une requête média à 768 px qui redéclare le même repli** — un bloc mort, sans effet
   sur le rendu, existant pour satisfaire un contrôle. C'est un contournement, et il se propagera
   par imitation dans toutes les pages du parc.
2. **Laisser le `FAIL`** — et habituer les auteurs à ignorer un bloquant de `oracle-mobile`, ce
   qui désarme la règle le jour où elle dit vrai.

C'est la seconde qui a été retenue ici, avec la mesure contraire consignée : le constat est laissé
rouge dans la critique d'implémentation, motif à l'appui.

### La règle qui aurait évité le retour

La classe `deux-regles-du-socle-inconciliables` existe et nomme exactement ce défaut. Ce qui
manque n'est pas la règle, c'est son application entre **deux appareils différents** : le socle
`digit-ai-page-html` et les oracles de `forge-design` sont versionnés séparément, et rien ne
compare leurs seuils.

**Remède proposé** : `M4` lit le seuil de repli **du socle** au lieu de le fixer en dur — soit par
un jeton publié (`--replier`, qui existe déjà dans le socle), soit en acceptant tout `max-width`
**supérieur ou égal** à 768 px, puisqu'un seuil plus large couvre le cas mesuré. La fixture verte
est disponible : la page livrée aujourd'hui.

### Classe

`deux-regles-du-socle-inconciliables` — récidive, sur une paire d'appareils que la classe n'avait
pas encore vue : le socle HTML et un oracle de forge-design, versionnés séparément.

| Score | Valeur | Motif |
|---|---|---|
| gain | 4 | débloque toute page du parc bâtie sur le boilerplate et portant un tableau |
| preuve | 5 | l'oracle se contredit dans sa propre sortie, et le rendu à 768 px mesure zéro débordement |
| effort | 1 | une comparaison de seuil à inverser dans `M4` |

---

## R4 — Le registre des oracles n'a pas de domaine « support de diapositives », et chaque projet redérive le sien

### Le fait mesuré

Ce produit avait besoin de juger un **support de formation au format diapositives**. Le registre
des oracles de `quality-oracles` ne porte aucun domaine qui le couvre. Le seul contrôle existant,
`tools/design-authority/oracle-da-pptx.mjs`, est **local à ce produit** et **spécifique aux
Design Authority** : trois de ses huit règles sont écrites en dur pour ce type de séance — pied de
page « DESIGN AUTHORITY — », couverture portant « DESIGN AUTHORITY », et faits attendus passés en
paramètre.

Cinq de ses huit règles, en revanche, sont **des règles de format Client-A et rien d'autre** :
16:9, les trois polices, la palette, l'heuristique de débordement, l'hygiène du paquet. Elles ne
doivent rien à la Design Authority.

**Ce qui a été fait, faute de mieux** : `tools/formation/oracle-support-formation-pptx.mjs`, dérivé
par copie, cinq règles inchangées et trois réécrites. Verdict `PASS` sur le support livré ce jour,
après deux corrections que son heuristique n'avait pas vues et que le rendu PowerPoint a montrées.

### Ce que cela coûte

Deux copies d'un même contrôle vivent désormais dans le même produit, et **elles divergeront**.
Le jour où la palette Client-A change, ou où l'heuristique de débordement est corrigée, il faudra
s'en souvenir deux fois. C'est la classe de défaut que la parité des composants du socle HTML
existe pour éliminer, transposée aux oracles.

Et le prochain produit Client-A qui livrera un support de diapositives — un kickoff, un comité, une
revue — recopiera une troisième fois.

### La règle qui aurait évité le retour

La règle § 4 de `quality-oracles` — « domaine sans oracle → en définir un, puis le remonter au
registre » — a été suivie pour la première moitié : l'oracle est défini. La seconde moitié n'est
pas jouable depuis ici : le registre vit dans le skill, hors du périmètre de ce produit, et la
règle 1 du `CLAUDE.md` interdit d'écrire dans ce qui n'est pas à nous.

**Remède proposé** : porter au registre un domaine « Support de diapositives Client-A (parité de
format) », servi par un oracle **paramétré** plutôt que dupliqué — le pied de page attendu, le mot
de couverture et la règle de contenu deviennent des options (`--pied`, `--couverture`,
`--contenu <module|faits>`), les cinq règles de format restent communes. Les deux oracles de ce
produit deviennent alors deux **invocations**, pas deux copies.

### Classe

`oracle-remplace-par-controle-maison` — ici dans sa variante la plus coûteuse : le contrôle maison
n'a pas remplacé un oracle existant, il a été **écrit faute d'oracle**, et il en existe maintenant
deux exemplaires à tenir.

| Score | Valeur | Motif |
|---|---|---|
| gain | 3 | tout produit Client-A livrant un support de diapositives, et les deux copies déjà présentes ici |
| preuve | 5 | les deux fichiers existent côte à côte dans ce dépôt, cinq règles identiques sur huit |
| effort | 2 | trois paramètres à extraire, un domaine à inscrire au registre |

---

## R5 — Une revue de lecture peut se déclarer faite sur une capture où rien n'est lisible

### Le fait mesuré

La revue de lecture du 13/09 sur une page HTML livrée a rendu « **aucun constat appelant une
correction** ». Le lendemain, le destinataire a ouvert le fichier et relevé « pleins de défauts
graphiques, comme s'ils n'avaient pas été revus ». **Cinq défauts** ont ensuite été trouvés à
l'œil, dont un sommaire collant qui recouvrait le contenu et la moitié d'un sommaire sans accents.

**La cause est mécanique, et elle est mesurable.** `render_page.py` produit par défaut une capture
**pleine page**. Sur ce livrable, elle mesurait **3840 × 19012 pixels** à 1920 px de large, et
**780 × 45480** à 390 px. Une fois ramenée à la taille d'affichage du relecteur, la première
rendait **404 × 2000** pixels et la seconde **34 × 2000** — des facteurs de réduction de **9,5**
et **23**. À cette échelle, un corps de texte de 16 pixels occupe moins de deux pixels de haut :
**il n'y a rien à lire**.

La revue a donc été déclarée faite sur des images où aucun constat ne pouvait être vu. Elle
n'était pas superficielle : elle était **impossible**.

### Pourquoi le socle ne l'empêche pas

La doctrine de la revue de lecture est écrite et elle est bonne : capturer, **ouvrir et lire** les
captures, consigner chaque constat. Elle mentionne l'option de capture par section, mais comme une
**option parmi d'autres**, sans jamais dire **quand elle cesse d'être optionnelle**.

Or il existe un seuil objectif : au-delà d'un certain rapport hauteur/largeur, la capture pleine
page n'est plus lisible par quiconque la réduit pour la regarder. Sur ce livrable, le rapport
était de **5:1** à 1920 px et de **58:1** à 390 px.

### La règle qui aurait évité le retour

**Aucune.** La revue de lecture est la partie explicitement **non mécanisée** du socle — « ce qui
suppose de LIRE n'est pas mécanisé ». C'est légitime. Mais rien ne garantit que ce qui est donné à
lire soit **lisible**, et cela, c'est un contrôle mécanique.

**Règle proposée**, à écrire dans les règles de lisibilité et à jouer par le script de rendu :

> Quand la capture pleine page d'une largeur dépasse un rapport hauteur/largeur de **4:1**, elle
> n'est pas une pièce de revue : le script **produit d'office** les captures par section et le
> signale dans sa sortie. Une revue de lecture qui ne cite que des captures pleine page au-delà de
> ce rapport est déclarée **non tenue**, jamais verte.

**Contrôle proposé** : le script de rendu connaît déjà les deux dimensions de chaque capture.
Ajouter le rapport à sa sortie, et un finding « capture pleine page non lisible à l'échelle,
capture par section requise pour la revue » au-delà de 4:1. Fixture rouge disponible : la page
livrée le 13/09. Fixture verte : la même page en captures par section, où les cinq défauts se
voient.

### Classe

**Aucune clé du référentiel ne convient.** La famille des défauts de restitution parle de la forme
d'un message ; celle des oracles non invoqués parle d'un contrôle non joué — ici le contrôle **a
été joué**, et c'est sa **sortie** qui était inexploitable.

**Clé proposée au pilot** : `preuve-produite-mais-illisible`, famille
`skill-ou-oracle-non-invoque`, libellé « Un contrôle est joué, sa sortie est produite, et elle est
inexploitable par celui qui doit la lire — l'étape humaine qui s'appuie dessus se déclare alors
faite sans avoir pu avoir lieu ».

| Score | Valeur | Motif |
|---|---|---|
| gain | 5 | touche toute revue de lecture du parc, sur tout livrable long — et la revue est la seule barrière non mécanisée du socle |
| preuve | 5 | deux rapports mesurés (5:1 et 58:1), un verdict « aucun constat », et cinq défauts trouvés le lendemain par l'humain |
| effort | 1 | un rapport à calculer et un finding à émettre, dans un script qui connaît déjà les deux dimensions |
