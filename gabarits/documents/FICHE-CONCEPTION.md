# Fiche de conception amont — à remplir AVANT d'écrire un document

> **Objet** fixer, avant la première ligne, ce que le document doit apprendre à son lecteur et
> sous quelle forme. Remplie par **l'agent** qui va écrire ; validée par **l'humain** pour les
> seuls documents à fort enjeu (critère au § 6).
> **Jugée par** `node oracles\oracle-gabarits-documents.mjs --fiche <fiche.md> [<document.md>]`
> (règle **G6**) — la fiche AVANT l'écriture, puis que le document la TIENT.
> **Provenance** étude d'opportunité du 14/09/2026
> (`output\03-etudes\20260914-etude-opportunite-conception-documentaire-amont.md`), option **O3**,
> **étape A**, sous la décision humaine **D-7 (a)**. Règle **D8** de `README.md` de ce dossier.
> **Version de la fiche : 1.0.0**

**Pourquoi cette fiche existe, et le chiffre qui la justifie.** Le rétro-test du 14/09/2026 a
classé 20 griefs réels de lecteurs portant sur des documents : **11 auraient été évités par une
conception fixée avant l'écriture — et par elle seule** ; 2 par un oracle existant qu'on aurait
joué, 2 par les deux, 5 par rien. Le seuil fixé d'avance était de 6. Les 11 se groupent en trois
causes, et la fiche vise exactement ces trois : un document **sans famille ni conception
préalable** (griefs 5, 8, 13, 14, 19), un **vocabulaire du lecteur non fixé** (18, 20), un
**format non dérivé du volume de contenu** (2, 10, 11, 12).

**Réserve de l'étude, reprise ici plutôt que tue.** Les 20 griefs ont été choisis et classés par
une seule session, **sans jugement à l'aveugle ni second classeur**. Le verdict est rendu sous
réserve, et la revue est fixée au **2026-10-14** : rejouer le rétro-test avec un second classeur
à l'aveugle. Cette fiche n'en prétend donc pas plus que ce que la mesure porte — elle ne promet
pas moins de retours, elle rend la conception **explicite et jugeable**.

**Ce que la fiche n'est pas.** Ce n'est pas un plan du document, ni un résumé, ni un livrable. Elle
est **jetée après usage** ou classée au document d'auteur : elle ne part jamais au lecteur.

---

## 1 · Le document

Ce qu'on s'apprête à écrire, et sous quelle famille. Trois lignes, et la première conditionne
tout le reste.

```
famille: {id de gabarits\documents\catalogue.jsonl, ex. gd-rapport-donnees}
titre_pressenti: {le titre de travail}
enjeu: {fort | ordinaire}    # critère au § 6 — « fort » exige une validation humaine
```

**Aucune famille ne résout ?** Ce n'est pas une case à forcer : c'est le signal que le catalogue a
un trou, et la classe `gabarit-famille-manquante` récidive à **13 sur 13** précisément parce que
ce signal était avalé. Remonter un candidat au registre, et le dire ici :
`famille: aucune — candidature remontée`.

## 2 · Le lecteur — défini par ce qu'il doit DÉCIDER

Quatre champs, et aucun n'est décoratif. Le lecteur se définit par ses décisions, **jamais par un
personnage** : l'étude du 14/09/2026 a mesuré qu'un rôle incarné ne fait pas trouver plus de
défauts.

```
decisions_attendues: {ce que le lecteur DÉCIDE ou FAIT avec ce document, en une phrase
  commençant par un verbe. « S'informer » n'est pas une décision}
savoir_prealable: {ce qu'il sait déjà, et qu'on ne réexpliquera donc pas}
vocabulaire_absent: {les mots de NOTRE métier qu'il n'a pas — chacun sera défini ou remplacé}
contexte_de_lecture: {où, quand, combien de temps, sur quel écran, seul ou en réunion}
```

*Pourquoi `vocabulaire_absent` est un champ et non une intention* : deux griefs du rétro-test
(18 et 20) sont exactement cela — « appartenir au tenant correspond-il à l'audience autorisée ? »
et « utilise le mot granularité plutôt que grain ». Un mot non fixé avant l'écriture se fixe dans
le retour.

## 3 · Les parties, et le TYPE DE CONTENU de chacune

Le plan, mais jugé sur autre chose qu'un plan : chaque partie déclare **ce qu'elle apprend au
lecteur** et **de quelle NATURE est son contenu**. Une partie qui ne peut pas écrire son
intention sans paraphraser son titre se supprime (règle D8).

```
parties:
  - titre: {…}
    intention: {la question du lecteur à laquelle elle répond / ce qu'elle lui permet de décider}
    type_de_contenu: {une valeur du vocabulaire fermé ci-dessous}
```

**Vocabulaire fermé des types de contenu**, tiré des deux référentiels établis que l'étude cite —
OASIS DITA 1.3 (2015-12-17 : concept, tâche, référence) et Information Mapping (Horn et al.,
1969 : concept, procédure, processus, principe, fait, structure, classification) :

| Type | Ce que la partie porte | Forme qui en découle |
|---|---|---|
| **concept** | ce qu'une chose EST, pourquoi elle existe | prose, un schéma si la structure est spatiale |
| **tache** | ce que le lecteur DOIT FAIRE, dans l'ordre | étapes numérotées, une action par étape |
| **procedure** | une suite de gestes normée, exécutée à l'identique | étapes numérotées, avec prérequis et preuve de fin |
| **processus** | ce qui SE PASSE, sans que le lecteur agisse | schéma de flux, ou étapes avec leur déclencheur |
| **principe** | une règle à appliquer, et ce qui arrive si on ne l'applique pas | énoncé + le fait qui le fonde |
| **fait** | une donnée constatée, datée, sourcée | tableau, ou phrase chiffrée avec sa formule (D9) |
| **structure** | de quoi une chose est composée | tableau de composants, ou arborescence |
| **classification** | comment on range, et selon quel critère | tableau à critère explicite |
| **reference** | ce qu'on consulte sans lire en entier | tableau triable, index, glossaire |

*Pourquoi fermé* : un vocabulaire ouvert laisse écrire « présentation » ou « contexte », qui ne
commandent aucune forme. Ici le type **dérive la forme**, et c'est tout son intérêt.

## 4 · Le format, DÉRIVÉ du volume et du contexte

Le format ne se choisit pas par habitude : il se **dérive** de ce qui précède. Quatre griefs du
rétro-test (2, 10, 11, 12) viennent d'un format non dérivé du volume.

```
format: {md | html | pdf | docx}
volume_attendu: {nombre de parties, et pour chaque tableau son nombre de lignes attendu}
justification: {la phrase qui relie le format au volume et au contexte de lecture du § 2}
```

Règles de dérivation déjà payées par des retours, et qui s'appliquent ici :

- un tableau de **8 lignes ou plus** embarque ses filtres (L4/L13, `oracle-filtres-tableau`) ;
- un tableau de **plus de 3 colonnes** se replie en cartes sous 900 px (**D3**) — un ascenseur
  horizontal rend consultable, pas lisible ;
- la largeur est une propriété de la **page**, pas du chapitre : le document est de lecture ou de
  données, il le déclare, et il ne mélange pas (**D10**, jugé par G5) ;
- un document long se découpe en **vues d'un fichier unique, pas en fichiers** (**D11**).

## 5 · Ce qui NE sera PAS dans ce document

La liste de ce qui part au **document d'auteur** ou à un document voisin, avec son renvoi. La
frontière se tranche par un critère d'**ACTION** : ce qui change ce que le lecteur FAIT reste
chez lui, même inconfortable ; ce qui ne change que ce que l'AUTEUR doit encore obtenir part
ailleurs (**D11**).

Remplir cette section AVANT d'écrire est ce qui empêche le registre d'arbitrages et l'historique
des versions d'arriver chez le lecteur — le refus humain du 15/09/2026, mot pour mot : « ça n'est
en aucun cas professionnel ».

## 6 · L'enjeu, et le critère de validation humaine

Qui valide cette fiche avant l'écriture. Le critère est **écrit**, pour qu'il ne se négocie pas au
cas par cas.

**L'enjeu est `fort` — validation humaine de la fiche exigée avant écriture — dès qu'UNE seule
de ces conditions est vraie :**

1. le document **sort de l'écosystème** : il est remis à un client, à un partenaire, à un
   fournisseur, à une autorité, ou il est publié ;
2. il **fonde une décision humaine engageante** : GO/NO-GO, mise en production, signature,
   engagement contractuel, arbitrage budgétaire ;
3. il porte des **chiffres opposables** — mesures publiées, taux, engagements de service ;
4. sa famille est **neuve ou non éprouvée** : aucune instance réelle n'a encore été remise, ou
   la famille est absente du catalogue (§ 1) ;
5. un **retour antérieur** de la même famille est resté non soldé.

Sinon l'enjeu est `ordinaire` : l'agent remplit la fiche, la fait juger par G6, et écrit. **La
fiche reste due dans les deux cas** — c'est la validation humaine qui est conditionnelle, jamais
la conception. *L'IA fait, l'humain décide* (loi transverse n° 5) : la voie automatisée est le
défaut, et c'est l'intervention humaine qui se justifie.

```
enjeu: {fort | ordinaire}
motif_enjeu: {la ou les conditions ci-dessus qui sont vraies, par leur numéro ; « aucune » si ordinaire}
valide_par: {qui a validé, et quand — obligatoire si enjeu: fort, « sans objet » sinon}
```

---

## Ce que la fiche coûte, mesuré

Le coût est le seul argument contre une conception amont, donc il se mesure plutôt qu'il ne se
suppose. Mesure faite le 20/09/2026 sur l'exemple rempli livré à côté
(`FICHE-CONCEPTION-EXEMPLE.md`), et reproductible.

Ce qui a été relevé : la fiche remplie tient en **28 lignes / 279 mots**, ce gabarit-ci en fait
**186** et se lit une fois, et le jugement par G6 prend **45 ms** (médiane de 5 passes, démarrage
de Node compris). Le détail et les commandes sont en pied de l'exemple.

**Ce qui n'est PAS mesuré, et se déclare plutôt que de s'estimer** : le temps que l'agent met à
REMPLIR la fiche. Aucun instrument ne le relève aujourd'hui ; l'annoncer serait une estimation
déguisée en mesure. Ce qu'on peut dire sans l'inventer : le coût réel n'est pas la fiche, c'est
**la pensée qu'elle force** — fixer le lecteur, trancher les types de contenu, dériver le format.
C'est précisément la dépense qu'on veut faire avant plutôt qu'après.

## Ce que G6 juge, et ce qu'il ne juge pas

La frontière, écrite pour qu'on ne la cherche pas. Le lecteur y apprend ce qu'un vert de G6 veut
dire — et surtout ce qu'il ne veut pas dire.

| G6 JUGE | G6 NE JUGE PAS |
|---|---|
| que les quatre champs du lecteur soient remplis | que la définition du lecteur soit JUSTE — c'est une relecture |
| que chaque partie porte une intention et un type de contenu du vocabulaire fermé | que l'intention soit pertinente, ni que le type choisi soit le bon |
| que l'intention ne soit pas la paraphrase du titre | la qualité de la prose |
| que le format soit justifié | que la justification soit exacte |
| qu'une fiche `enjeu: fort` porte son valideur | que le valideur soit la bonne personne |
| que le DOCUMENT porte les parties annoncées par sa fiche | que le contenu de chaque partie tienne son type — indécidable à la machine |

**Ce que G6 ne fera jamais** : décider à la place d'un humain qu'un document est bon. Un oracle
mesure une présence, jamais une valeur (README de ce dossier).
