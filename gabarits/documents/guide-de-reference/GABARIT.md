# Gabarit — Guide de référence multi-vues (guide du développeur, guide d'exploitation, manuel)

> **Famille** `guide-de-reference` · catalogue `gd-guide-de-reference`
> **Formats** Markdown — la SOURCE, un fichier unique tenu à jour, celui que les prompts citent —
> et HTML : un fichier autoportant à N vues, GÉNÉRÉ depuis la source, jamais édité à la main
> **Point de départ** générateur `generateur/construire-guide.py` · squelette `SQUELETTE.md` →
> `SQUELETTE.html` · instance `INSTANCE.md` → `INSTANCE.html` · composants `composants/`
> **Règles engagées** D1 D3 D4 D6 D7 D8 D10 D11 (`gabarits\documents\README.md`)
> **Provenance** première remontée par la règle R-57 (24/09/2026) : le guide du développeur de
> l'espace d'engagement `Produit-64` — 14 vues, 104 chapitres, une trentaine de versions générées
> entre le 15/09 et le 24/09/2026, jugées vertes par les oracles du socle et de forge-design, et
> dont le lecteur a dit de la forme, mot pour mot : « le format du guide du développeur et l'usage
> des composants utilisés […] sont vraiment tops ». **La forme seule est hissée ; aucune matière
> du guide d'origine n'est ici.**
> **Gabarit : gd-guide-de-reference** · **Version du gabarit : 1.0.0**

**Ce que ce document est, et ce qu'aucun autre ne fait.** Un guide de référence est le document
qu'un lecteur garde ouvert pendant qu'il TRAVAILLE : il y revient dix fois dans la journée, sur une
question précise, et y cherche une règle, un geste ou une commande. Ce n'est ni un dossier
d'architecture (`gd-dossier-architecture`, qui décrit une cible pour un comité), ni un dossier
d'exploitation (`gd-dossier-exploitation`, qui dit comment faire tourner un système en production),
ni un mode d'emploi de livrable (`gd-mode-emploi-dossier`, qui dit ce que contient un dossier remis).
C'est **le document de consultation d'un métier** : long, découpé en vues, parcouru par la
recherche autant que par la lecture.

**Pourquoi la famille existe, et le fait est daté.** Le guide d'origine a traversé en dix jours les
retours qui ont fondé trois règles de la bibliothèque : onze fichiers livrés quand le lecteur en
voulait un à onze vues (D11, TF-1142) ; des largeurs de chapitre qui alternaient sans raison (D10) ;
un registre d'arbitrages et un historique des versions servis au lecteur au lieu de rester à l'auteur
(G10). Sa forme finale tient ces trois leçons, et elle a été jugée par son lecteur. Sans famille, le
prochain guide les repaierait une par une.

---

## Structure — ce que la source porte

La source est **un seul fichier Markdown**, lisible tel quel dans un dépôt. Le découpage en vues ne
concerne QUE le rendu : la source ne se coupe jamais en fichiers.

### 0 · En-tête

```
---
marque: {marque qui signe le document}
objet: {Guide du développeur | Guide d'exploitation | …}
sous_titre: {le périmètre couvert}
description: {une phrase : ce que le guide couvre, en combien de vues}
role_destinataire: {qui lit ce guide, et ce qu'il DÉCIDE ou FAIT avec — installer, appliquer,
  livrer, exploiter}
version: {AAAAMMJJ<indice> du rendu}
source_affichee: {docs/NOM-DU-GUIDE.md — le chemin que les prompts citent}
cle_theme: {nom-du-guide}-theme
gabarit: gd-guide-de-reference
version_du_gabarit: 1.0.0
# facultatif : marque_html, favicon_lettre, anatomie (défaut « Niveau, Source, Exceptions »),
# accent, accent_fonce, accent_sombre, accent_fonce_sombre (jetons de marque, #RRGGBB)
---
```

Le **`role_destinataire` n'est pas décoratif** : chaque vue se juge à ce qu'elle permet à CE lecteur
de faire. Un chapitre qui ne change rien à ce qu'il fait n'a pas sa place dans le guide (D8).

### 1 · La vue d'entrée — « Démarrer »

La première vue est celle où le lecteur arrive, et la seule où la place existe pour le sommaire du
document en cartes (généré). Elle porte au moins **le parcours** — les étapes dans l'ordre, chacune
renvoyée à la vue qui la détaille — et **les questions les plus fréquentes**, chacune renvoyée à la
vue qui y répond. Une troisième pièce est recommandée : la **formule à coller dans un prompt** pour
qu'un agent applique le guide.

### 2 · Les vues de contenu

Une vue par sujet que le lecteur traite d'un tenant : installer, appliquer des standards, livrer,
exploiter. Chaque vue s'ouvre par `## Titre — annonce` puis, facultatif mais recommandé, le
commentaire qui fixe son libellé de menu, son annonce et son **inventaire** :

```
## Standards de code — les trois règles opposables
<!-- vue: cle="standards" libelle="Standards de code" annonce="nommer, verrouiller, journaliser"
     inventaire="Cette vue porte … — ce qu'elle contient, et ce qui la distingue de sa voisine." -->
```

Le libellé de menu est **en toutes lettres**, jamais un code nu (« G4 » ne dit rien à qui découvre
le document — neuf libellés sur onze étaient dans ce cas sur le guide d'origine). L'inventaire dit ce
que la vue PORTE : c'est la phrase qui évite d'ouvrir trois vues pour trouver la bonne.

### 3 · La vue « Référence »

Le vocabulaire du guide, **défini une fois** (terme, sens dans ce guide, vue où il sert), et les
contacts par sujet. Un terme de métier employé sans définition est un défaut du guide, pas du lecteur.

## Anatomie d'un chapitre — quatre niveaux, tous rendus

| Niveau | Dans la source | Au rendu | Type de contenu |
|---|---|---|---|
| Vue | `## Titre — annonce` | un onglet, une page, son menu latéral | selon la vue |
| Chapitre | `### 3 — Titre`, ou `` ### `CODE-R01` — Titre `` | pastille (rang ou code), gouttière, rail, chapeau | `tache`, `principe`, `reference`… |
| Pas | un paragraphe qui s'ouvre sur un titre en gras (« **Installer l'éditeur.** ») | sous-titre au menu latéral, filet | `procedure` |
| Pièce | tableau, bloc de code, encadré `>` | tableau outillé, bloc repliable, encadré | `reference`, `fait` |

- **Le chapeau** est le premier paragraphe substantiel du chapitre : il dit ce que le chapitre
  APPREND, jamais ce que son titre annonce déjà (règle L7 du socle). Chaque vue a aussi le sien.
- **Un pas** naît d'une amorce en gras qui est un titre : 60 caractères au plus, une majuscule
  initiale, une ponctuation finale ou quatre mots au moins. Trois pas sont TYPÉS par leur premier
  mot : « Vérification » (la preuve qui clôt un geste), « Attention » (le piège), « Exemple de
  lecture » (ce qu'il faut voir dans le tableau qui précède — dû sous tout tableau de 8 lignes, L10).
- **L'anatomie d'une règle** — `**Niveau : obligatoire**`, `**Source** : …`, `**Exceptions** : …`,
  en tête du chapitre — remonte en bandeau sous le titre ; le corps ne porte plus que la règle.
- **Un chapitre dont le titre s'ouvre sur un code** a sa FICHE : ce code, cité ailleurs dans le
  guide, s'ouvre en fenêtre sans quitter la vue où on le lit.
- **`<!-- deplier:etapes -->`** devant un tableau d'étapes range chaque pas « Étape N · … », et ses
  vérifications, dans la ligne N : le détail vit dans sa ligne, derrière un chevron.

## Les composants — entiers ou à la carte

Le guide entier se construit par le générateur. Chaque composant se pose aussi **seul**, dans une
page qui n'est pas un guide, par le même outil et scellé par l'empreinte de sa source :
`python generateur/construire-guide.py --poser <page.html> --composants <a.css,a.js>`, puis
`--constat <page.html>` pour rejouer la parité. Le catalogue des composants — ce que chacun fait,
son contrat de marquage, ses dépendances et les défauts qu'il ferme — vit dans **`COMPOSANTS.md`**.

| Composant | Fichiers | Ce que le lecteur en voit |
|---|---|---|
| Coquille multi-vues | `coquille-vues.css` `coquille-vues.js` | les onglets, une vue peinte à la fois, l'adresse profonde |
| Menu latéral des chapitres | `sommaire-chapitres.css` `sommaire-chapitres.js` | le plan de la vue à deux niveaux, le chapitre courant marqué |
| Hiérarchie chapitres et pas | `hierarchie-chapitres.css` | pastille, gouttière, rail, pas typés |
| Recherche et ses résultats | `recherche-resultats.css` `recherche-resultats.js` | le tableau des occurrences par vue, un clic y mène |
| Fenêtre modale à onglets | `modale.css` `modale.js` | le fichier source Markdown, la fiche d'un code cité |
| Tableaux | `tableaux.css` | largeurs tenues, repli en cartes, lignes dépliables |
| Bascule de thème | `bascule-theme.css` `bascule-theme.js` | clair par défaut, sombre retenu |
| Jetons | `jetons.css` | la marque, aliasable sur celle de la page hôte |

## S'en servir

1. **Copier** `SQUELETTE.md` chez le projet, en `docs\<NOM-DU-GUIDE>.md` : c'est la source, non
   datée, tenue à jour.
2. **Remplir** chaque emplacement `{…}` ; un emplacement laissé tel quel est un défaut.
3. **Générer** le rendu daté, sous `output\` (nommage R-4) :
   `python <pilot>\gabarits\documents\guide-de-reference\generateur\construire-guide.py docs\<NOM>.md --sortie "output\<famille>\<Marque> - <Objet> - AAAAMMJJ<i>.html"`.
   Le générateur refuse de livrer une page qui a PERDU de la prose (compte des mots rendus contre
   ceux de la source), ou dont les composants du socle n'ont pas été posés.
4. **Juger** la page par les oracles de la liste ci-dessous — tous, et chaque vue rendue seule
   (`--vues <cle>`) : une vue masquée n'est pas mesurée par la sonde de rendu.

## Ce que ce document ne fait JAMAIS

Quatre exclusions, chacune protégeant le guide d'un document voisin qui le ferait dériver.

- **il ne décrit pas une cible d'architecture** : trajectoire, exigences non fonctionnelles et
  risques appartiennent au dossier d'architecture (`gd-dossier-architecture`) ;
- **il ne remplace pas le runbook d'exploitation** : démarrer, arrêter, restaurer, tourner un
  secret relèvent du dossier d'exploitation (`gd-dossier-exploitation`) — le guide y renvoie ;
- **il ne tranche aucune règle** : il rend opposable ce qui a été décidé ailleurs, et cite la
  source de chaque règle. Une règle qu'on veut changer se rouvre là où elle a été décidée ;
- **il ne se découpe pas en fichiers** : un guide long est un fichier à N vues (D11) ; le lecteur
  qui le reçoit par courriel reçoit tout.

## Oracles

Ce que la machine juge sur une page de cette famille, et ce qui reste une lecture.

| Contrôle | Invariant tenu |
|---|---|
| `check_html.py` du socle (G3) | le marquage : 42 règles, dont L4 (filtres dès 8 lignes), L7 (chapeaux), L8 (liens), L10 (exemple de lecture) |
| `render_page.py` du socle, page entière ET chaque vue seule | le rendu aux six largeurs : débordements, contrastes, alignements — une vue masquée n'est pas mesurée |
| `run-oracles-design.mjs` de forge-design | slop, jetons, mobile, bascule, goût, saisie, déclencheurs, surcouche |
| `check_completude.py` du socle, et la garde du générateur | la page porte au moins les mots de sa source |
| `generateur/sonde-interactions.py` | les composants MARCHENT : onglets, adresse profonde, menu latéral en fin de page, recherche et résultats, filtres après une recherche effacée, fenêtre source et retour du focus, fiche d'un code, thème, téléphone |
| `construire-guide.py --constat` | chaque composant posé est la copie exacte de sa source |
| `oracle-gabarits-documents.mjs` (G1-G5, G7, G10-G12) | doctrine et instance, fil gabarit + version rendu, largeur de page déclarée, lecteur et frontière |
| relecture humaine — **due, et non mécanisable** | que chaque chapitre serve le lecteur déclaré, et que chaque règle citée soit à jour à sa source |

## Boucle de retour

Un manque constaté sur ce gabarit remonte par la section **« Retours sur les documents produits »**
du lot de retours du projet (R-46), avec le couple `gd-guide-de-reference` + version. Et un guide
produit depuis ce gabarit qui s'en ÉCARTE assez pour mûrir à son tour remonte par la section
**« Documents mûrs »** (R-57) : c'est ainsi que la famille elle-même est née.

---

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire` : celui qui TRAVAILLE avec le
guide ouvert. Tout ce qui n'entre pas dans ce qu'il fait sort d'ici et vit dans le **document
d'auteur** — un registre distinct, cité en renvoi et jamais joint :

- le **registre des arbitrages** en cours sur le guide, et les options écartées ;
- l'**historique des versions** du rendu et son statut de relecture ;
- les **reste-à-faire** de l'auteur : chapitres à compléter, retours non encore traités.

**La frontière est un critère d'ACTION, pas de confort.** « Cette règle n'est pas encore opposable :
appliquez-la, et signalez tout écart » reste chez le lecteur — elle change ce qu'il fait. « Nous
hésitons à fusionner les vues 3 et 4 » part au document d'auteur. C'est exactement le refus humain
du 15/09/2026 sur le guide d'origine : « ça n'est en aucun cas professionnel ».
