# Gabarit — Fiche produit

**Famille** `gd-fiche-produit` · **Version du gabarit** 1.2.0 · **Écrite le** 13/10/2026 · **Révisée le** 15/10/2026 (1.2.0 : chapitre « Personas et usages », TF-1764, TF-1769, TF-1766)

> **Formats** HTML (rendu remis) · Markdown (source)
> **Règles engagées** D1 D3 D4 D6 D7 D11 (`gabarits\documents\README.md`)
> **Provenance** extraite de la fiche produit remise par `Produit-79` le 07/10/2026
> (`Produit-79 - Fiche produit - 20261007a.html`, quatre indices au 07/10), signalée par le retour
> RP-8 du lot `Produit-79 - RETOURS - 20261007a` (TF-1617). Le gabarit reprend la forme, jamais la matière.

## La règle qui commande toutes les autres

**La fiche ne porte aucune exigence qui ne soit pas dans le référentiel.** Elle se **dérive** du
référentiel d'exigences du produit (`forge\EXIGENCES.json` pour un produit instrumenté), qui reste la
source unique. Un chiffre de la fiche (« 36 exigences au palier MVP ») se retrouve en comptant les
lignes du chapitre 5 ; s'il ne s'y retrouve pas, c'est la fiche qui est fausse, jamais le chiffre
du référentiel. *Une fiche qui ajoute une exigence que le référentiel ne connaît pas est un second
référentiel, et deux référentiels se contredisent au mois suivant.*

## Quand l'employer

Remettre à un commanditaire le **périmètre fonctionnel d'un produit, en paliers**, au stade de la
conception, pour qu'il valide le périmètre, l'ordre de construction et les hypothèses. Ce n'est ni
une spécification technique (elle vit dans `docs\projet\`), ni un cahier de tests, ni une propale :
la fiche ne chiffre aucun coût et ne promet aucune date.

## Structure — les huit chapitres sont dus

Depuis la version 1.2.0, le chapitre 5 bis « Personas et usages » l'est aussi ; son absence est
signalée en avertissement, jamais en refus (FP8). Une fiche d'offre technique y ajoute des chapitres optionnels déclarés (section « Variante « offre
technique » » ci-dessous).

Les chapitres suivent la question que se pose le commanditaire, dans son ordre : de quoi parle-t-on et
que me demande-t-on, sur quoi s'appuie-t-on déjà, que couvre l'outil, que contient le premier lot, quel
est le détail, qu'est-ce qui reste à confirmer, qu'est-ce que je dois trancher, d'où cela vient-il.

| # | Chapitre | Porte | Ne porte pas |
|---|---|---|---|
| 1 | **En bref** | Les chiffres de la fiche (exigences par palier, hypothèses), la légende des identifiants, les décisions attendues | Aucun détail d'exigence |
| 2 | **Briques en place** | Ce que le produit réutilise au lieu de le reconstruire, avec la date et la source du relevé | Ce que le produit construira : c'est le chapitre 3 |
| 3 | **Domaines et socle** | Pour chaque domaine et pour le socle commun, le besoin couvert et le nombre d'exigences par palier | Les exigences elles-mêmes |
| 4 | **Le palier du premier lot** | Le contenu du premier palier, et ce qu'il remplace dans l'existant | Les paliers suivants |
| 5 | **Toutes les exigences** | Le référentiel : une ligne par exigence, avec son critère de recette | Toute exigence absente du référentiel |
| 5 bis | **Personas et usages** (dû depuis 1.2.0) | Le parcours testable de chaque persona et l'état de chaque usage, actif ou en attente | Un usage retiré parce qu'un composant manque |
| 6 | **Hypothèses à lever** | Chaque hypothèse, l'exigence qu'elle conditionne, qui peut la lever et avant quand | Les faits constatés |
| 7 | **Points laissés à l'arbitrage** | Chaque décision qui revient au commanditaire, ses options, leur exclusion | Une recommandation déguisée en fait |
| 8 | **Provenance** | Les sources lues, leur date, les contrôles exécutés | Toute source non datée |

**Chaque chapitre ouvre par 3 lignes**, dans cet ordre : ce que le lecteur y trouve (*Vous
trouverez…*), ce que le chapitre contient et ne contient pas, puis un **exemple de lecture** sur une
ligne réelle du tableau. L'exemple de lecture est le seul moyen, pour un lecteur non spécialiste, de
vérifier qu'il sait lire la table qui suit.

## Le chapitre « Personas et usages » (1.2.0)

**Des exigences tenues ne disent pas qu'un persona est servi.** Le 14/10/2026, une fiche portait 35
exigences, dont 34 tenues et testées, sans qu'aucun de ses 4 personas ait son usage servi en entier :
ni connexion par identifiant et mot de passe, ni libre-service des clés pour l'administrateur client,
ni documentation pour le développeur, ni page pour le délégué à la protection des données (TF-1764).
Le lendemain, un produit masquait les fonctions d'un fournisseur faute d'identifiants, contre la
demande humaine : « un composant manquant ne bloque pas l'implémentation ; l'usage reste présent,
inactif, avec motif et action par rôle » (TF-1769). Le chapitre porte deux tableaux.

1. **Les parcours des personas** : `Persona` · `Se connecter` · `Geste principal` · `Résultat
   attendu` · `Exigences` (celles que le parcours traverse) · `Parcours testé`. Chaque persona a un
   parcours testable de bout en bout ; la recette du produit joue un test par parcours.
2. **Les usages et leur état** : `Usage` · `Persona` · `Dépend de` (paramètre, clé d'API, service, ou
   `aucun`) · `État` · `Motif` · `Action par rôle`.

**Le parcours testé.** La colonne dit `non joué` au stade de la conception. Une fois joué, elle porte
la trace : **un vrai navigateur, sur l'adresse publique**, la date, et au moins une saisie inattendue
par formulaire. Le 15/10/2026, cinq parcours annoncés verts appelaient le portail par le réseau privé,
avec les seules saisies attendues ; la première connexion humaine sur l'adresse publique a rendu
« Application failed to respond » (TF-1766). Un parcours joué hors navigateur reste `non joué`.

**Un usage n'est jamais retiré.** Un usage dont un composant manque garde l'état `en attente` : il
reste rendu à l'écran, inactif, avec son motif et ce que chaque rôle fait pour le débloquer
(l'administrateur saisit la clé, l'utilisateur voit pourquoi le bouton est inactif).

`oracle-fiche-produit.mjs` juge le chapitre par sa règle **FP8, avertissante** : chapitre absent,
étape de parcours vide, parcours déclaré testé sans navigateur ni adresse publique datée, usage hors
du vocabulaire `actif` · `en attente`, usage en attente sans motif ou sans action. Elle n'abaisse
jamais le verdict.

## Variante « offre technique » — chapitres optionnels déclarés

Quand la fiche porte une **offre technique** (un produit bâti sur une base existante, un service à
déployer), le brief peut demander davantage que les huit chapitres. Le 14/10/2026, un brief en
imposait dix, dont l'architecture, le modèle de déploiement et une colonne de couverture, sans
équivalent au gabarit (TF-1704). La variante admet ces ajouts, et seulement eux :

| Chapitre optionnel | Porte | Se place |
|---|---|---|
| **Architecture** | Les composants et leurs flux, en figure (Mermaid admis dans la source Markdown) | après « Domaines et socle » |
| **Modèle de déploiement** | Où tourne le produit, qui l'exploite, ce qui reste à la charge du client | après « Architecture » |
| **Fournisseurs** | Les services tiers dont le produit dépend, et ce que chacun fournit | après « Modèle de déploiement » |
| **Risques** | Chaque risque, l'exigence qu'il menace et sa parade | juste avant « Hypothèses à lever » |

- **La colonne Couverture** s'ajoute au chapitre 5. Elle dit ce que la base couvre déjà de
  l'exigence, dans un vocabulaire fermé : `natif` · `configuration` · `extension` · `à développer`.
  Une couverture `natif` ou `configuration` sans essai dans le produit laisse le statut à
  `présent dans la base`.
- **Les identifiants** peuvent séparer fonctionnel et non fonctionnel par leur préfixe (`EF-01`,
  `ENF-01`) ; le chapitre 1 le déclare dans « Lire cette fiche ».
- **La déclaration est due.** Le chapitre 1 nomme les chapitres optionnels que la fiche porte : un
  chapitre absent de cette liste est un chapitre inventé. Les huit chapitres restent dus, et un
  chapitre optionnel ne remplace aucun d'eux. Il ouvre par les mêmes trois lignes.

`oracle-fiche-produit.mjs` juge la colonne Couverture quand elle existe (FP5) ; les chapitres
optionnels n'entrent dans aucun recomptage.

## Les vocabulaires fermés

- **Palier** : `MVP` (premier lot utile) · `V1` (lot suivant) · `V2` (plus tard). Une fiche peut
  n'en porter que deux ; elle n'en invente pas un quatrième sans le déclarer au chapitre 1.
- **Statut d'une exigence** : `fait constaté` (elle vient de la demande ou du site, et la source est
  citée ; tirée de l'existant, elle n'est constatée que par la **trace d'un essai dans le produit
  lui-même** : le geste ou la commande, sa date, son résultat) · `présent dans la base` (la fonction
  existe dans le code ou le produit de base, sans configuration ni essai dans ce produit) ·
  `hypothèse` (elle est proposée et doit être confirmée). Toute exigence `présent dans la base` ou
  `hypothèse` apparaît au chapitre 6 ; pour la première, ce qu'il reste à lever est l'essai.
- **Impact** : une note de 1 à 5 de la valeur attendue, **déclarée telle** (échelle dite au
  chapitre 1). La note exprime un jugement du référentiel, pas une mesure.
- **Identifiant** : `E-001`, stable d'une version de la fiche à l'autre. Une exigence retirée garde
  son numéro retiré ; elle n'est jamais réattribuée.

## Les refus de ce gabarit

- **Une exigence sans critère de recette.** Le critère est le test qui dira, à la livraison, si elle est
  tenue : sans lui l'exigence est une intention. La colonne est due à chaque ligne.
- **Un chiffre d'en-tête qui ne se recompte pas.** Les totaux du chapitre 1 et du chapitre 3 sont
  recalculés sur le chapitre 5 avant la remise (voir « Avant de remettre »).
- **Une hypothèse présentée comme un fait constaté.** C'est le défaut qui oriente une construction
  entière sur une supposition ; le statut est une colonne, pas une nuance de ton.
- **Une exigence constatée sur la seule présence d'une fonction dans la base.** Le code amont dit
  qu'une fonction existe, pas que ce produit la rend. Le 14/10/2026, trois exigences d'une fiche sur
  vingt-huit `fait constaté` ne l'étaient que par le code amont, et la première question de
  conformité l'a révélé (TF-1710) : sans trace d'essai, le statut est `présent dans la base`.
- **Un chapitre des coûts ou des dates.** La fiche porte un périmètre, pas un engagement.
- **Un jargon sans glose.** Un terme du métier du produit se définit à son premier emploi, au
  chapitre 1 (« Lire cette fiche »).

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête, frontmatter en `md`, bloc
d'identification en `html` :

```
role_destinataire: {qui lit cette fiche produit, et quelles décisions elle lui demande}
```

## Avant de remettre

1. Chaque total des chapitres 1 et 3 est **recompté** sur les lignes du chapitre 5 (palier par palier,
   domaine par domaine). Une somme qui ne tombe pas juste est une fiche non remise.
2. Chaque hypothèse du chapitre 6 renvoie à une exigence `hypothèse` du chapitre 5, et réciproquement.
3. Chaque brique du chapitre 2 porte la date de son relevé.
4. Rendu HTML jugé par `check_html.py` **et** `render_page.py --widths 1280,768,390` (D7).
5. Aucun `{…}` restant.
6. Chaque persona a son parcours, chaque usage son état ; un usage en attente porte son motif et
   l'action par rôle (chapitre « Personas et usages »).

Les points 1, 2, 3, 5 et 6 se jouent en une commande : `node oracles\oracle-fiche-produit.mjs <fiche>`
(règles FP1 à FP7 bloquantes, FP8 avertissante, sur la fiche HTML ou Markdown).

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas
dans ses décisions sort d'ici et vit dans le **document d'auteur** — un fichier distinct, tenu par
celui qui produit, cité en renvoi et jamais recopié :

- le **registre des arbitrages** encore ouverts, avec leur instance et leur état ;
- l'**historique des versions** du document et son statut de relecture ;
- les **notes de production** : sources à confirmer, sections à reprendre, questions à l'auteur.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le
lecteur FAIT reste chez lui, même quand elle est inconfortable : « cette règle n'est pas encore
opposable, appliquez-la et signalez tout écart » appartient au document du lecteur, parce qu'un
lecteur doit savoir sur quoi il s'engage. Une information qui ne change que ce que l'AUTEUR doit
encore obtenir part au document d'auteur. Le doute utile au lecteur se dit à l'endroit qui le
concerne ; le doute de l'auteur ne le suit pas. Les points laissés à l'arbitrage du chapitre 7 sont
des décisions du lecteur : ils restent. Le registre des arbitrages de l'auteur n'y entre pas.

**Un document long se découpe en VUES d'un fichier unique, pas en fichiers**, sauf demande
contraire de son lecteur : 11 fichiers à partager sont un coût pour lui, jamais pour son auteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `check_html.py` du socle `digit-ai-page-html` — charte, accessibilité, lisibilité ;
- `render_page.py` du même socle — zéro défaut visuel aux six largeurs, dont **V18** (mesure de
  lecture) et **V19** (une seule largeur de contenu) ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G13 ;
- pour le **fond** : `oracle-fiche-produit.mjs` du pilot, qui recompte la fiche sur elle-même (FP1 à
  FP7 : chiffres d'« En bref » et tableau des domaines sur le chapitre 5, hypothèses croisées avec
  les exigences, statut au vocabulaire fermé, critère de recette à chaque ligne, briques datées,
  aucun emplacement restant ; FP8, avertissante : parcours des personas et état des usages), et `oracle-ecriture.mjs` (tournures d'annonce en titre et en en-tête
  de colonne, EC-8). `oracle-couverture-exigences.mjs` ne juge pas la fiche : il juge le référentiel
  d'exigences du pilot lui-même (TF-1712).

## Limites du jugement

**Qu'une exigence soit la bonne.** Le critère de recette est présent et testable en forme ; qu'il
mesure ce que veut le commanditaire reste une relecture. **Que la fiche soit fidèle au référentiel** :
`oracle-fiche-produit.mjs` recompte la fiche sur son propre chapitre 5, il ne rouvre pas
`forge\EXIGENCES.json`, et une exigence absente des deux côtés passe.

## Boucle de retour

Le document produit porte `gabarit: gd-fiche-produit` et sa version, **visiblement**, en tête de
page. Un retour sur la **forme** se remet au pilot, par la section « Retours sur les documents
produits » du lot (`gabarits\RETOURS-FORGES.md`) ; un retour sur le **fond** — quelle exigence est due,
quel palier — se remet à l'étape de conception du produit.
