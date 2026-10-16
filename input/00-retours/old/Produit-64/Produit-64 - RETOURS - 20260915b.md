# Lot de retours — Produit-64 → digit-ai-factory — 2026-09-15, indice b

**Émetteur** : produit `Produit-64` · **Cibles** : `digit-ai-factory` (pilot — registre des
classes, gabarits de document) et le socle `digit-ai-page-html` · **Origine** : second lot de
retours humains du 2026-09-15 sur le livrable
`output/05-Kits/Client-A - Guide développeur POC-to-Prod - 20260915b/`, mot pour mot —
« beaucoup de défauts déjà remontés de multiples fois sur d'autres documents et sur d'autres
projets, qui devraient maintenant être complètement traités et appliqués à tous les documents,
mais qui ne le sont toujours pas. Remonte ces sujets à la Factory pour comprendre pourquoi ces
défauts arrivent encore, identifier comment les éradiquer complètement et faire en sorte que ces
types de défaut ne se reproduisent plus. »

**Décision humaine qui fonde cette remise** : décision D-1, option (b), du 2026-09-15 — remontée
seule, **sans contrôle local** chez le produit. Ce lot est donc le seul levier existant sur les
quatre défauts qu'il décrit : s'il n'est pas traité, ils reviendront.

- **Contexte** : second lot de retours humains sur un livrable documentaire, hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## RT-17 — Quatre classes créées le 3 septembre se reproduisent le 15 septembre dans un livrable neuf, écrit par une session qui avait le registre sous la main

### Le fait mesuré

Le 15/09/2026, un guide développeur de onze pages est livré. Il passe les deux oracles du socle.
Le destinataire humain relève **huit défauts**. **Quatre d'entre eux portent déjà une classe au
registre `CLASSES.json`, toutes créées le 2026-09-03** — soit douze jours plus tôt.

| Défaut relevé le 15/09 | Classe au registre | Créée le | Fondée par |
|---|---|---|---|
| tailles de colonne fausses, tableaux à grands vides | `page-html-dictionnaire-colonnes` | 2026-09-03 | TF-0777 |
| schémas et tableaux mal dimensionnés en largeur | `page-html-largeur-lecture-donnees` | 2026-09-03 | TF-0771, TF-0778 |
| onglets `G0` à `G8` sans signification pour un lecteur neuf | `lecture-tiers-non-jugee` | 2026-09-03 | TF-0774 |
| six schémas et une barre de navigation codés sans maquette validée | `maquette-absente-avant-code` | 2026-09-03 | TF-0780 |

Mesures des défauts eux-mêmes, prises sur le livrable :

| Grandeur | Valeur |
|---|---|
| Colonnes de tableau sans largeur déclarée, sous `table-layout: fixed` | **61 sur 126**, soit 48 % |
| Rapport largeur/hauteur des schémas, rendus à `width: 100 %` | de **2,46** à **9,00** |
| Libellés de navigation sans aucun mot | **9 sur 11** |
| Maquettes validées avant codage des schémas et de la navigation | **0** |

### Pourquoi le registre n'a rien empêché

La session qui a produit ce livrable **avait `CLASSES.json` sous la main** : elle l'a ouvert
pendant le même tour, pour classer un autre retour. Le registre est consulté pour **classer un
retour entrant**, jamais pour **contraindre un livrable sortant**. Il mémorise ; il ne mord pas.

Une cinquième classe du même jour nomme exactement ce phénomène : **`boucle-retour-sans-descente`**,
fondée par TF-0757 — « une correction close au pilot ne redescend pas sous une forme que le
producteur rencontre ». Le fait le plus instructif de ce retour est donc que **cette classe a
elle-même récidivé** : elle décrit sa propre cause, et douze jours plus tard la cause opère
encore.

### La règle qui aurait évité le retour

Une classe close au registre descend chez les producteurs sous une forme **qu'ils rencontrent en
produisant** — un contrôle jouable, une entrée de liste de vérification affichée au moment
d'écrire, un hook — et pas seulement sous la forme d'une entrée de référentiel qu'il faut penser
à consulter. Tant qu'une classe n'a pas de porteur exécutable, sa fermeture chez le pilot ne
prédit rien sur le terrain.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-17 | **bloquant** | générique | quatre classes créées le 2026-09-03 (TF-0777, TF-0771/0778, TF-0774, TF-0780) se reproduisent le 2026-09-15 dans un livrable neuf, mesuré : 61 colonnes sur 126 sans largeur, rapports de schéma jusqu'à 9:1, 9 libellés de navigation sur 11 sans mot, 0 maquette. La session productrice avait le registre ouvert dans le même tour | faire porter chaque classe fermée par un **exécutable** : soit un contrôle du socle qui la joue, soit une entrée d'une liste de vérification de production que le producteur RENCONTRE (hook `PreToolUse` sur écriture de livrable, ou section obligatoire du `CLAUDE.md` produit). Publier au registre, pour chaque classe, la colonne « jouée par » — et considérer comme **non close** toute classe dont cette colonne est vide |

---

## RD-2 — Un oracle rend PASS sans publier ce qu'il ne mesure pas, et deux verdicts verts font croire un travail fini

### Le fait mesuré

Le livrable du 15/09 passe les deux contrôles du socle :

| Contrôle | Verdict | Étendue |
|---|---|---|
| `check_html.py` | **PASS** sur les 11 pages | 40 règles, empreinte `695359b17ff5` |
| `render_page.py` | **PASS** sur les 11 pages | 6 largeurs, captures produites |

Les **huit** défauts relevés par le destinataire humain sont **tous hors du champ** de ces deux
contrôles. Aucun ne juge :

- la largeur **utile** d'une colonne, par rapport au contenu qu'elle porte ;
- la **densité d'information** d'un schéma, ni son étirement au-delà de sa taille naturelle ;
- le **sens** d'un libellé de navigation pour un lecteur qui découvre le document ;
- l'**appartenance** d'un chapitre à son lecteur déclaré.

Ce n'est pas une défaillance des oracles : c'est leur périmètre. Le défaut est que ce périmètre
**n'est publié nulle part**.

### L'asymétrie qui aggrave le cas

`render_page.py` publie un bloc `non_juge` à chaque exécution, et il est précis — il a d'ailleurs
déclaré lui-même, le 15/09, que les familles d'image n'étaient pas jugées faute de capture.
`check_html.py`, lui, rend « Verdict : PASS » et le nombre de règles jouées, **sans une ligne sur
ce qu'il ne regarde pas**.

Une session qui obtient deux verts sur onze pages a toutes les raisons de croire son travail
fini. Elle le croit d'autant plus que l'un des deux oracles publie honnêtement ses limites : le
silence de l'autre se lit comme une absence de limite, pas comme une absence de publication.

### La règle qui aurait évité le retour

Un oracle publie son **périmètre de non-mesure** au même endroit et avec la même visibilité que
son verdict. Un verdict sans périmètre déclaré n'est pas lisible : il dit ce qui a été mesuré et
laisse croire que le reste n'existe pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-2 | majeur | générique | `check_html.py` rend « PASS, 40 règles » sans aucun bloc de non-mesure, là où `render_page.py` publie son `non_juge` à chaque exécution. Huit défauts relevés par un humain sur un livrable **doublement vert** : largeur utile des colonnes, densité des schémas, sens des libellés de navigation, appartenance d'un chapitre à son lecteur | ajouter à `check_html.py` un bloc `non_juge` permanent, au même format que celui de `render_page.py`, énumérant les familles hors de son champ — au minimum : utilité des largeurs déclarées, densité et proportion des figures, sens des libellés, adéquation contenu/lecteur. Le rendre obligatoire au contrat commun des oracles du registre `quality-oracles` : **un verdict sans périmètre de non-mesure n'est pas un verdict complet** |

---

## RT-18 — Aucun gabarit de document ne distingue le contenu destiné au LECTEUR du contenu destiné au PRODUCTEUR

### Le fait mesuré

Retour humain du 15/09/2026, mot pour mot : « Est-ce que les sujets non tranchés doivent être
dans le document à destination des développeurs ? […] pour que les sujets qui concernent le
créateur du fichier n'arrivent pas à destination des lecteurs du fichier, ça n'est en aucun cas
professionnel… »

Trois contenus destinés au **producteur** figuraient dans un guide destiné à des **développeurs** :

| Contenu | Destinataire réel | Ce qu'il apporte au développeur |
|---|---|---|
| Registre des sept arbitrages, avec leur instance et leur état | l'auteur du document et la Design Authority | rien : il ne peut ni les trancher ni les suivre |
| Historique des versions du document | l'auteur | rien |
| Mention « statut projet, non opposable » en bandeau de chaque page | l'auteur et l'instance de relecture | ambigu : utile sur une règle, décourageant en bandeau permanent |

Aucun gabarit de `gabarits/documents/` ne porte cette distinction, et aucun contrôle ne la juge.
Le résultat est arrivé chez le lecteur.

### La frontière qui manque, et son critère

La distinction n'est pas « supprimer les incertitudes » — un développeur doit savoir si la règle
qu'il applique est opposable. Elle tient à un critère d'action :

- une information qui change **ce qu'un lecteur fait** reste dans le document du lecteur —
  par exemple « cette règle n'est pas encore opposable, appliquez-la et signalez tout écart » ;
- une information qui change seulement **ce que l'auteur doit obtenir** part dans le document de
  l'auteur — le registre des arbitrages, l'historique des versions, le statut de relecture.

### La règle qui aurait évité le retour

Tout gabarit de document déclare son **lecteur**, et porte la frontière avec son critère
d'action, plus le renvoi vers le document d'auteur qui accueille ce qui sort. Sans cette
frontière écrite dans le gabarit, chaque producteur la retrace de mémoire, et le contenu de
gouvernance descend chez le lecteur final.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-18 | majeur | générique | trois contenus d'auteur — registre de sept arbitrages, historique de versions, bandeau de statut projet — livrés dans un guide dont le lecteur déclaré est un développeur. Refus humain, mot pour mot : « ça n'est en aucun cas professionnel ». Aucun gabarit de `gabarits/documents/` ne porte la distinction, aucun contrôle ne la juge | ajouter à chaque gabarit de document un champ **`lecteur`** obligatoire et une section **« ce qui sort vers le document d'auteur »**, avec le critère d'action — une information qui change ce que le lecteur FAIT reste, une information qui ne change que ce que l'auteur doit OBTENIR sort. Juge possible : une famille de `check_markdown.py` qui relève dans un document à `lecteur` déclaré les marqueurs de contenu d'auteur (registre d'arbitrages, historique de versions, statut de relecture) |

---

## Remise

Ce lot vise `digit-ai-factory` pour `RT-17` et `RT-18` — registre des classes et gabarits de
document — et le socle `digit-ai-page-html` pour `RD-2`. Remise dans
`input/00-retours/_arrivee/` du pilot. Le sidecar `Produit-64 - RETOURS - 20260915b.tf.jsonl`
porte les trois lignes, chacune avec `racine_produit`, conformément à la règle 8 du `CLAUDE.md`
de ce produit.

**Deux clés de classe sont proposées à la création**, aucune clé existante ne couvrant le sujet :
`oracle-perimetre-de-non-mesure-non-publie` pour `RD-2` et `contenu-d-auteur-livre-au-lecteur`
pour `RT-18`. `RT-17` porte la clé existante `boucle-retour-sans-descente`, dont il est une
récidive documentée.

---

## Remarques restées au produit

Cinq défauts du même retour humain sont restés ici : ils se corrigent dans le livrable, et leur
classe existe déjà au registre. Ils sont donc portés en **preuve** de `RT-17`, pas remontés une
neuvième fois.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Tableaux à grands vides, colonnes mal dimensionnées | toutes les colonnes portent une largeur, ou aucune ; le tableau n'est plus étiré au-delà de son contenu | non | classe `page-html-dictionnaire-colonnes` déjà au registre depuis le 03/09 — remonter une neuvième fois n'apprendrait rien ; le fait sert de preuve à **RT-17** |
| Schémas étirés sur toute la largeur | rendu à la taille naturelle, plafonné à 100 %, aligné à gauche, rapport ≤ 3:1 | non | classe `page-html-largeur-lecture-donnees` déjà au registre — idem, preuve de **RT-17** |
| Onglets `G0` à `G8` sans signification | libellés en toutes lettres, décision humaine D-2 option (b) du 15/09 | non | classe `lecture-tiers-non-jugee` déjà au registre — preuve de **RT-17** |
| Schéma des trois couches à l'envers, schémas existants non réutilisés | couches inversées avec leur flèche renommée ; contenu des diagrammes de `GDE0201` repris | non | classe `maquette-absente-avant-code` déjà au registre — preuve de **RT-17** |
| Onze fichiers HTML au lieu d'un fichier à onze vues | fichier unique, onze vues, une seule peinte | **oui** | remonté sous **RT-18** au titre de la forme attendue d'un livrable documentaire long : aucun gabarit ne dit si un document long se découpe en fichiers ou en vues |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` sur ce lot — vérifié le
2026-09-15. Le livrable qui a reçu les retours est produit par un générateur propre au produit.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a gêné le lecteur | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - Guide développeur POC-to-Prod - 20260915b/` | aucun — générateur propre au produit | aucun gabarit ne couvre un référentiel de règles à identifiants stables, ni ne dit si un document long se découpe en fichiers ou en vues d'un fichier | huit défauts de rendu au premier coup d'œil, dont quatre déjà classés au registre depuis douze jours | le générateur entier, ses six schémas, sa navigation, ses largeurs de colonne | générique — un gabarit « référentiel de règles » et une doctrine de découpage manquent à la bibliothèque |

**Retour de forme, répété pour la deuxième fois** : ni `ECRITURE.md` ni `RETOURS-FORGES.md`
n'affichent de numéro de version en en-tête, alors que la règle R-46 demande de rattacher un
retour à « la version affichée en en-tête du document ». Le constat a été porté le 13/09 sur le
gabarit de lot, le 15/09 sur le plancher d'écriture, et il se répète ici.
