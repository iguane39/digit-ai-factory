# Retours forgés — Produit-11 — 20260827a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : production d'une présentation Design Authority sur l'architecture d'envoi de
  courriels, **à partir d'un document de référence fourni par le client** (`input\Client-A - Design
  Review - Architectures Web - 20260826c.pptx`). Demande explicite : *« Les documents générés
  pour l'utilisateur ne doivent pas aller dans input mais dans output. Et le fichier généré […]
  ne respecte pas du tout la charte Client-A du document fourni en entrée. Revois ta copie […]. »*
  Puis, à l'ouverture du livrable corrigé : *« Il y a un problème à l'ouverture du document. Et
  cela provoque des défauts dans l'affichage des contenus. Corrige et remonte à la Factory afin
  de prévenir ce genre de problème à l'avenir. Ainsi que le problème de respect du format
  entrant qui n'avait pas été pris en compte. »*
- **Références ledger** : `forge\ledger.jsonl` seq 165 (entrée `type: retour`)
- **Lot précédent** : `Produit-11 - RETOURS - 20260825b.md`, remis et donc immuable.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-27

**Numérotation** : Produit-11 tient une séquence `RT-nn` ; RT-1 … RT-35 sont consommés. Ce lot
continue en RT-36 … RT-38.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le fait mesuré, avant toute interprétation

Trois faits, dans l'ordre où le client les a rencontrés.

**1. Le livrable ne s'ouvrait pas proprement.** PowerPoint a affiché *« PowerPoint a détecté un
problème dans le contenu de … PowerPoint peut essayer de réparer la présentation »* et le client
a constaté des défauts d'affichage. Cause relevée dans le paquet dézippé :

```
ppt/slides/slide3.xml — ordre des enfants de <a:ln>
  connecteur 1 : solidFill -> srgbClr -> tailEnd          conforme
  connecteur 5 : prstDash -> solidFill -> srgbClr -> tailEnd   INVALIDE
  connecteur 6 : prstDash -> solidFill -> srgbClr -> tailEnd   INVALIDE
```

Le schéma `CT_LineProperties` impose `remplissage → prstDash → cap/join → headEnd → tailEnd`.
Le code plaçait `prstDash` en tête (`ln.insert(0, …)`). **`python-pptx` a écrit cet arbre sans
rien signaler**, `unzip -t` ne voit rien (l'archive est saine), et seul PowerPoint le découvre —
en proposant une réparation qui perd du formatage en silence.

**2. Le livrable ne respectait pas la charte du document d'entrée.** Le premier jet a déduit
l'identité visuelle d'un **histogramme des couleurs du XML** des diapositives. Or la couverture
de la référence est un **dégradé vert** porté par une **image** (`ppt/media/image1.png`,
`#006A2B → #3EA867`) : aucun comptage de couleurs de XML ne peut la voir. Le livrable est donc
sorti **bleu sur fond blanc**, hors charte.

Deuxième écart de la même cause : la géométrie a été relevée sur une **liste tronquée** de
formes (14 premières), d'où des cartes de 4 à 6 cm là où la référence en porte de
**9,83 × 11,23 cm** au pas de 10,44, remplissant la page de y=5,79 à y=17,02. Les pages étaient
creuses, et le premier réflexe a été de **rattraper le creux** par des rustines verticales au
lieu de corriger la cause.

**3. Le livrable a été écrit dans `input\`.** Le dossier `output\` du projet porte pourtant déjà
une arborescence explicite (`02 - Présentation Design Authority`). Aucune règle écrite n'a été
trouvée dans le dépôt : `grep -rilE "dans output|livrables produits"` sur `docs\` et `forge\` ne
rend aucune consigne de destination.

---

## factory (`digit-ai-factory`)

La production d'un livrable **à partir d'un document de référence client** n'est outillée par
aucun gabarit ni aucune procédure : ni relevé de charte, ni contrôle de validité du paquet, ni
destination déclarée. Les trois défauts ci-dessus sont les trois marches manquantes de ce même
escalier, et aucun n'est propre à ce projet.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-36 | **bloquant** | générique | Un paquet OOXML généré peut être **invalide sans que rien ne le signale à la génération**. `python-pptx` a écrit `prstDash` avant `solidFill` dans `a:ln` (ordre imposé par `CT_LineProperties`) ; l'archive est saine (`unzip -t` : *No errors detected*), la bibliothèque n'a pas bronché, et c'est **PowerPoint chez le client** qui a demandé à « réparer ». Une réparation perd du formatage en silence : le défaut se paie donc deux fois, à l'ouverture puis à l'impression. Preuve : ordre relevé sur `slide3.xml`, connecteurs 5 et 6, cité ci-dessus. | Un **contrôle d'ordre des enfants, bloquant avant écriture**, dans tout producteur de `.pptx`/`.docx`/`.xlsx`. Écrit ici en 14 lignes : il compare l'ordre trouvé à la séquence du schéma pour `a:ln` et `a:rPr`, refuse d'écrire, et **nomme la diapositive et la forme**. Après correctif : 120 blocs `a:ln` et 186 blocs `a:rPr` contrôlés, 0 en faute. Le contrôle est réutilisable tel quel. |
| RT-37 | **majeur** | générique | Quand un document de référence est fourni, la charte est **déduite** au lieu d'être **relevée**. Un histogramme des couleurs du XML ne voit pas ce qui vit dans une image : la couverture verte de la référence (`media/image1.png`, dégradé `#006A2B → #3EA867`) est restée invisible, et le livrable est sorti bleu. Même cause pour la géométrie, relevée sur une liste de formes **tronquée** : cartes de 4–6 cm contre 11,23 cm réels, donc des pages creuses « rattrapées » par des rustines. Preuve : 11 médias dans la référence, dont 9 icônes 256×256 monochromes directement réemployables, et une grille mesurable au centième de cm. | Une procédure de **relevé de charte**, à jouer AVANT d'écrire une ligne, en trois gestes : (1) inventaire de `ppt\media` avec dimensions et couleurs dominantes — c'est là que vit l'identité ; (2) extraction **complète** (jamais tronquée) de la géométrie et de la typographie d'une diapositive de contenu, run par run ; (3) **réemploi** des ressources de la référence plutôt que réinvention. Corollaire à écrire noir sur blanc : *une page creuse est un symptôme de grille mal relevée, pas un espace à combler.* |
| RT-38 | mineur | générique | La **destination des documents produits** n'est déclarée nulle part. Le livrable a été écrit dans `input\`, à côté du document de référence, alors que `output\` porte une arborescence dédiée. Preuve : aucune consigne trouvée dans le dépôt (`grep -rilE "dans output\|livrables produits"` sur `docs\` et `forge\` : rien). La convention existait — dans la tête du client et dans la structure des dossiers — mais nulle part où un producteur la lirait. | Une ligne dans la procédure de production : `input\` est **en lecture seule** (ce que le client fournit), `output\` reçoit ce que le projet produit, et le sous-dossier se choisit dans l'arborescence existante plutôt que d'en créer un. Contrôlable : un producteur qui écrit sous `input\` peut être refusé. |

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le générateur de la présentation vit dans un répertoire de travail temporaire, hors dépôt : le livrable n'est pas reproductible par un tiers. | Non corrigée dans ce lot. | non | Le choix de versionner ou non un générateur de support de séance appartient au produit. La **classe** — « un livrable non reproductible » — est déjà couverte par la doctrine de traçabilité du projet ; rien de neuf à remonter. |
| `python-pptx` a été installé dans le venv de développement, pas dans `azure\backend-requirements.txt`. | Volontaire : l'image déployée ne doit pas porter une dépendance de bureautique. | non | Propre au produit, et c'est la bonne décision ici. Aucune classe généralisable : le principe « ne pas embarquer une dépendance qu'aucun code déployé n'importe » est déjà tenu et documenté dans ce fichier de dépendances. |
| Trois pannes de déploiement consécutives ont eu la même cause racine : les routes de `azure\standalone_backend.py` ne sont chargées par aucune suite de tests. | Non corrigée : un essai de fumée sur ce point d'entrée reste à écrire. | **oui** | Généralisable — mais la classe appartient à `forge-tests` et **a déjà été remontée** : c'est RT-26 du lot 20260818a (« rien ne confronte ce que le code APPELLE à ce que l'instance SERT »). Ce lot ne la redemande pas ; il en constate la troisième récidive. |

---

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits\documents\` dans ce lot — et cette
absence **est** le retour RT-37 ci-dessus.

Le livrable a été produit à partir d'un **document de référence client**, pas d'un gabarit de la
factory. Il n'existe donc ni `gabarit` ni `version_du_gabarit` à reporter : la case est vide
parce que la fabrique n'a rien à cet endroit-là. C'est précisément ce qui a permis aux trois
défauts de passer — aucun garde-fou n'existait entre « voici un document de référence » et
« voici le livrable ».

Ce que le destinataire a **dit**, et qui vaut mieux qu'une intuition d'auteur :

- *« ne respecte pas du tout la charte Client-A du document fourni en entrée »* — le mot *« du
  tout »* est le fait à retenir : ce n'était pas un écart de nuance, c'était la mauvaise couleur
  de marque sur la couverture ;
- *« cela provoque des défauts dans l'affichage des contenus »* — la réparation de PowerPoint
  n'est pas neutre, elle dégrade ce que le destinataire lit ;
- *« fournis un schéma d'architecture de la solution »* — le support n'en portait aucun. Une
  Design Review d'architecture sans schéma d'architecture : le gabarit manquant aurait imposé
  cette section.

Ce qu'il a fallu **ajouter à la main**, et qui devrait vivre dans un gabarit : le relevé de
charte (palette, polices, grille, ressources), le contrôle de validité du paquet, la section
« schéma d'architecture », et la règle de destination `output\`.
