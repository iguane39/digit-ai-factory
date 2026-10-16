# Lot de retours — Produit-64 → digit-ai-factory — 2026-09-15, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory` (pilot, plancher
d'écriture `references/ECRITURE.md` et sa donnée `references/tics-redactionnels.json`) et le
socle `digit-ai-page-html` · **Origine** : retour humain du 2026-09-15 sur le livrable
`output/05-Kits/Client-A - Guide développeur POC-to-Prod - 20260915a.html`, mot pour mot —
« Arrête d'utiliser le terme "Ce que" comme "Ce que ce document tient…" "Ce qu'il ne tient pas".
**Déjà demandé plusieurs fois et remonté à la Factory plusieurs fois.** »

**Décision humaine qui fonde cette remise** : décision D-3, option (b), du 2026-09-15 —
« Un travail de la Factory sur la communication a été mis en œuvre, intégrer ces règles à ces
travaux. » Le travail visé est le plancher d'écriture `ECRITURE.md`, né du mandat du 12/09/2026,
et sa donnée `tics-redactionnels.json`.

- **Contexte** : retour humain sur un livrable documentaire, hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## RT-15 — La tournure « Ce que… » n'appartient à aucune famille du plancher d'écriture, et elle revient livrable après livrable

### Le fait mesuré

Le plancher d'écriture porte la règle **E-5** — « Ne pas annoncer, dire ; ne pas résumer en fin
de bloc » — et son juge, `oracle-ecriture.mjs`, la mécanise par les familles `annonce-vide` et
`cloture-resumante` de `EC-1`.

Sur le livrable du 15/09, l'oracle rend **PASS** en style (EC-1 à EC-6, 15 228 mots de prose
jugés). Le même livrable porte **84 occurrences** de la tournure « Ce que / Ce qu'il / Ce
qu'elle », dont **6 en titre de chapitre** et **20 en en-tête de colonne**. Le destinataire a
refusé le livrable sur ce seul point, en déclarant l'avoir déjà demandé plusieurs fois.

Occurrences les plus fréquentes, relevées dans `docs/REFERENCE-DEVELOPPEUR.md` :

| Forme | Occurrences | Exemple relevé |
|---|---|---|
| « Ce que » | 23 | « Ce que cette carte apprend en une phrase » |
| « ce que » | 15 | « ce que le chapitre va dire » |
| « Ce qu'il » | 11 | « Ce qu'il ne tient pas » |
| « ce qu'il » | 10 | « ce qu'il en coûte de ne pas la faire » |
| « Ce qu'elle » | 8 | « Ce qu'elle coûte » (en-tête de colonne) |
| autres formes | 17 | « ce qu'on », « Ce qu'on », « ce qu'elle » |

### Pourquoi le plancher ne l'attrape pas

`E-5` vise l'annonce **verbale** — « dans ce chapitre nous allons », « il est important de noter
que ». La tournure « Ce que X apprend » est une **nominalisation** : elle annonce sans employer
aucun des verbes que la famille `annonce-vide` reconnaît. Elle passe donc sous le filet, et elle
est d'autant plus répandue qu'elle a l'air rigoureuse — elle ressemble à un titre de chapitre
sérieux.

Le plancher dit lui-même où se règle ce cas : « **La donnée** : `references/tics-redactionnels.json`,
datée et sourcée ; **un retour humain de lisibilité y ajoute une tournure, une famille ou un
seuil** ; l'oracle ne change pas. » C'est exactement ce que ce retour demande.

### La règle qui aurait évité le retour

Une règle de style demandée plusieurs fois par un humain et remontée plusieurs fois entre dans la
donnée du plancher **à la première remontée**, sous forme de tournure ou de famille. Tant qu'elle
n'y est pas, elle tient à la mémoire de la session qui écrit — c'est-à-dire à rien.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-15 | majeur | générique | `oracle-ecriture.mjs` rend PASS sur un livrable portant **84** tournures « Ce que… », dont 6 en titre ; le destinataire l'a refusé sur ce seul point en déclarant l'avoir déjà demandé plusieurs fois. La famille `annonce-vide` d'`EC-1` ne reconnaît que des formes **verbales** ; la nominalisation « Ce que X apprend / porte / tient » n'y figure pas | ajouter à `tics-redactionnels.json` une famille `annonce-nominalisee` : « ce que … apprend / contient / porte / tient / dit / coûte / exclut », jugée à densité, **bloquante en titre** et en en-tête de colonne, avertissante dans le corps. Prévoir l'exemption du gabarit de restitution, qui **impose** « Ce qu'elle coûte / Ce qu'elle exclut » |

---

## RT-16 — Le plancher d'écriture ne dit rien du bloc de code selon le lecteur, et un guide pour développeurs assistés par IA se retrouve avec des commandes que personne n'exécutera

### Le fait mesuré

Même livrable, même retour humain, mot pour mot : « Les développeurs IA ne sont pas des codeurs,
les lignes de code affichées doivent donc l'être uniquement si cela est strictement nécessaire.
Pour voir les trigrammes déjà pris, pas la peine de code "az repos list…", un simple check sur
l'URL du repo suffit. »

Relevé sur le livrable : **18 blocs de code**, dont **4 commandes de console** groupées dans une
seule règle. Les 14 autres sont des blocs qui se **recopient** — métadonnées de guide,
arborescence de dépôt, motifs de nommage — et le destinataire ne les conteste pas.

La distinction que le retour fait est donc précise, et le plancher ne la porte nulle part : un
bloc de code qu'on **recopie** est utile à tout lecteur ; un bloc qu'on **exécute** ne l'est qu'à
un lecteur qui exécute. Aucune des treize règles `E-1` à `E-13` ne s'en approche, et la typologie
`T1`-`T5` classe les textes par **lecteur** sans jamais en tirer de conséquence sur le code
affiché.

### La règle qui aurait évité le retour

Dans un texte de type `T2` — livrable documentaire — un bloc de code n'est admis que si le
lecteur nommé du document doit le reproduire tel quel. Un bloc destiné à être **exécuté** suppose
un lecteur qui exécute ; si le lecteur nommé ne l'est pas, le bloc se remplace par le geste
équivalent dans son outil, ou par le lien vers l'écran qui donne la même information.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-16 | majeur | générique | un livrable `T2` destiné à des développeurs assistés par IA portait **4 commandes de console** pour une vérification qui se fait à l'écran. Refus du destinataire. Aucune règle `E-1` à `E-13` ni aucune ligne de la typologie ne relie le **lecteur nommé** au **type de bloc de code** admis | ajouter au plancher une règle `E-14` : dans un texte `T2`, un bloc de code est admis s'il se **recopie**, pas s'il s'**exécute**, sauf lorsque le lecteur nommé du document est un exécutant. Juge possible : une famille d'`oracle-ecriture` qui relève les blocs de code dont la première ligne est une invocation de commande, et demande que le lecteur du document soit déclaré exécutant |

---

## RD-1 — L'oracle de rendu ne juge aucune famille d'image au-delà d'une certaine hauteur de page, et rien ne dit à l'auteur quelle hauteur reste jugeable

### Le fait mesuré

`render_page.py` du socle `digit-ai-page-html` a été joué le 15/09 sur une page de référence de
**15 228 mots**. Résultat, aux six largeurs de la grille par défaut :

| Largeur de fenêtre | Hauteur de page mesurée | Capture |
|---|---|---|
| 2560 px | **54 793 px** | échec, délai dépassé |
| 1280 px | **62 127 px** | échec, délai dépassé |
| 768 px | **98 079 px** | échec, délai dépassé |
| 390 px | **123 822 px** | échec, délai dépassé |

Quatre exécutions successives, échelles 0,4 · 0,35 · 0,3 · 0,25 · 0,2 · 0,12, délais de 45 s à
300 s : **aucune n'a produit d'image**. Deux d'entre elles ont tourné plus de trente minutes avant
d'être arrêtées.

L'oracle se comporte honnêtement — il rend PASS sur les familles lues au DOM et déclare V5 et V6
en `non_juge`, avec le motif exact. **Le défaut n'est pas là.** Il est qu'un auteur ne sait pas,
avant d'écrire, à partir de quelle hauteur son livrable cessera d'être jugeable visuellement, ni
que le temps qu'il passera à le découvrir se compte en dizaines de minutes par tentative.

### La règle qui aurait évité le retour

Un oracle qui dégrade son verdict au-delà d'un seuil publie ce seuil, et le refuse tôt plutôt que
de l'atteindre lentement. Une mesure de hauteur prise **avant** toute tentative de capture coûte
une milliseconde et rend le même service que quatre tentatives de trente minutes.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | majeur | générique | quatre exécutions de `render_page.py`, six échelles, délais jusqu'à 300 s : aucune image produite sur une page de 54 793 à 123 822 px de haut selon la largeur ; deux exécutions arrêtées après plus de trente minutes. Le verdict PASS ne porte alors que sur les familles du DOM, ce que l'oracle déclare — mais aucune documentation ne publie la hauteur au-delà de laquelle cela arrive | mesurer `scrollHeight` **avant** la capture et, au-delà d'un seuil publié, rendre immédiatement un constat nommé (« page trop haute pour être jugée visuellement, N px, seuil M px ») plutôt que de tenter puis d'expirer. Publier le seuil dans `zero-defaut-visuel.md` avec le geste de remède — découper la page — pour qu'un auteur le sache avant d'écrire |

---

## Remise

Ce lot vise `digit-ai-factory` pour `RT-15` et `RT-16` — plancher d'écriture et sa donnée — et le
socle `digit-ai-page-html` pour `RD-1`. Remise dans `input/00-retours/_arrivee/` du pilot. Le
sidecar `Produit-64 - RETOURS - 20260915a.tf.jsonl` porte les trois lignes, chacune avec
`racine_produit`, conformément à la règle 8 du `CLAUDE.md` de ce produit.

---

## Remarques restées au produit

Trois remarques du même retour humain sont restées ici, chacune avec son verdict de
généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les largeurs de colonne diffèrent d'un tableau à l'autre : 47 tableaux, **0** largeur déclarée | dictionnaire de largeurs par nature de colonne, posé une fois dans le générateur du produit | non | le socle porte déjà `dictionnaire-de-colonnes.md` et la classe `page-html-dictionnaire-colonnes` ; le défaut est que ce produit ne l'appliquait pas, pas que la règle manque |
| Le livrable réclamait « une largeur de page plus grande » | la page se déclare désormais page de données (`data-page="donnees"`), ce qui libère la pleine largeur, la prose restant en colonne déclarée | non | le socle porte déjà les deux doctrines de largeur et la déclaration qui les arbitre (L26, TF-0778) ; la remontée envisagée était fondée sur une prémisse fausse — le seuil n'est pas inadapté, la page était déclarée page de prose |
| Le livrable est une page unique de 15 228 mots | découpage en 11 pages | non pour la forme, **oui pour la mesure** | le découpage est un choix de produit ; mais la difficulté qui l'a rendu nécessaire est remontée sous **RD-1** |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` sur ce lot — vérifié le
2026-09-15. Le livrable qui a reçu les retours est un guide produit par un générateur propre au
produit (`tools/construire-reference-developpeur.py`) ; il ne porte ni identifiant `gd-…` ni
version de gabarit, parce qu'aucun gabarit de la bibliothèque ne couvre ce type de document.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a gêné le lecteur | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - Guide développeur POC-to-Prod - 20260915a.html` | aucun — générateur propre au produit | aucun gabarit de `gabarits/documents/` ne couvre un guide de règles à identifiants stables | la longueur : 15 228 mots en une page, et 12 remarques de forme au premier retour | le générateur entier, le découpage en chapitres, le sommaire annoté, les colonnes de lecture déclarées | générique — un gabarit « référentiel de règles » manque à la bibliothèque |

**Retour de forme sur le plancher d'écriture lui-même** : `ECRITURE.md`, reçu ici sous
`forge/ECRITURE.md`, **n'affiche aucun numéro de version en en-tête**. Il cite sa date de
naissance (12/09/2026) et son mandat, mais pas de version. Rattacher un retour à « la version
affichée en en-tête » (règle R-46) est donc impossible sur ce document, alors même qu'il est la
cible de deux des trois retours de ce lot. Le même constat avait été porté le 13/09 sur
`RETOURS-FORGES.md` ; il se répète ici sur un second texte normatif.
