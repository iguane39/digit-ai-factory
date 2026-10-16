# Retours forges — Produit-05 — 20260831a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : retour **direct du client**, en cours de session, sur le rapport de synthèse
  `20260822c` puis sur ma propre correction `20260831a`. Deux défauts de **fond** trouvés par
  la lecture, à onze jours d'intervalle, sur un livrable **vert à quatre oracles** :
  1. le rapport annonçait une **décision qui n'a jamais été prise** — « le dimensionnement du
     lot 1, arbitré · décidé le 22 août 2026 par la direction » — alors que la seule trace est
     une recommandation du prestataire. Client : **« L'atelier du 22 août 2026 n'a rien
     tranché du tout. »**
  2. la colonne « conséquence faute de réponse » **chiffrait en tickets de support** le fait
     que des utilisateurs découvrent en production que leur mot de passe ne fonctionne plus.
     Client : **« Comment peut-on imaginer que l'on va faire une migration des clients de la
     v1 vers la v2 sans les prévenir ? Comment est-ce possible d'afficher ce genre
     d'ineptie ? »**

  Les deux défauts ont **traversé six versions** du rapport et **toutes** les portes
  automatiques. Ce lot remonte **six retours** : les quatre causes outillées de ces deux
  défauts, une cinquième trouvée en les instruisant, et une sixième constatée en écrivant ce
  lot — l oracle de lisibilité Markdown, issu du lot précédent, a refusé quatre fois ce
  fichier, dont deux fois à tort.
- **Références ledger** : aucun ledger dans ce projet (run hors pilot, skills appelés depuis
  Claude Code). Pièces : `output/v2-architecture-cible/07-arbitrage-l1-et-cohabitation.md` §1.1,
  `05-revue.md` §2 (écart E5), `09-travaux-par-lot.md` §lot 2,
  `adr-drafts/0029-organization-cutover-mechanics.md` ligne 23,
  `rapport/old/Digit-AI - … - 20260822c.html`, `rapport/REVUE.md` §2.
- **Lots précédents** : `20260820a`, `20260820b`, `20260821a`, `20260822a`, `20260822b`,
  `20260822c` — **tous remis**, donc immuables. Ce lot est un fichier neuf.
- **Remise au pilot** : copier ce fichier et son sidecar `.tf.jsonl` dans
  `<pilot>\input\00-retours\`. **Remise soumise à validation humaine** (règle 18) —
  **accordée explicitement par le client** (« remonte à la factory ce type d'erreurs afin de
  trouver des solutions pour s'assurer de ne pas les reproduire à l'avenir »).
- **Statut** : remis le 2026-08-31

**Numérotation** : un identifiant de retour porte le préfixe de la forge visée — `RD-*` pour
forge-design, `RA-*` pour forge-agents — et n'est jamais réutilisé. Les lots précédents ont
consommé RD-1 (*premier retour forge-design de ce produit, sur l'oracle de largeur*) jusqu'à
RD-22 (*le plus récent : un identifiant codé doit porter son sens*), et RA-1 (*premier retour
forge-agents, sur la revue de lecture non outillée*) jusqu'à RA-12 (*un livrable Markdown ne
reçoit aucun contrôle de lisibilité*). Ce lot continue en cinq identifiants neufs :
RD-23 (*un badge de statut doit résoudre vers sa preuve*), RA-13 (*vérifier l'autorité
d'une décision affirmée*), RA-14 (*tester si une conséquence déclarée est livrable*),
RA-15 (*écrire la fiche expert « migration de plateforme brownfield »*),
RA-16 (*rapprocher un effectif annoncé du cardinal réel*) et
RD-24 (*ni l'emphase ni un retour à la ligne ne doivent casser l'adjacence entre un jeton et
sa glose*).

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-agents (`digit-ai-forge-agents`) — skill `quality-oracles`

Trois retours, une seule famille : **aucun oracle ne juge la substance d'une affirmation** —
qui a le droit de la faire, si sa conséquence est livrable, si son compte est juste. Les
quatre portes du projet (`check_html`, `render_page`, `run-oracles`, contrôles projet) sont
vertes sur un rapport qui annonçait une décision inexistante et une mise en production que
personne n'accepterait. Ce n'est pas un défaut de format : c'est un angle mort de fond.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RA-13 | **bloquant** | générique | **Aucun domaine ne vérifie l'AUTORITÉ d'une décision affirmée : un livrable peut écrire « Décision / Décideur : \<le prestataire\>, pour \<le client\> » et sortir vert.** Fait, cité mot pour mot du livrable : `07-arbitrage-l1-et-cohabitation.md` §1.1 porte un tableau **Objet / Décision / Date / Décideur / Ce qu'elle tranche / Statut de C1**, avec **`Décideur : Sébastien (Digit-AI), pour Produit-05`** et **`Statut de C1 : clos par arbitrage`**. Le prestataire y enregistre, au nom du client, une décision que le client n'a pas prise. Le rapport HTML a ensuite **propagé** l'affirmation en **cinq endroits** — titre de chapitre « Le dimensionnement du lot 1, **arbitré** », badge d'onglet « dimensionnement de L1 arbitré », entrée de sommaire, énoncé de la question H3 « le périmètre du lot 1, lui, est **tranché depuis le 22 août 2026** », et ligne de contre-expertise « **tranché par décision** ». **Verdict des portes : `check_html` PASS, `render_page` PASS, `run-oracles` 14 PASS / 0 FAIL, 14 contrôles projet PASS.** Le défaut est allé **jusqu'au client**, qui l'a corrigé d'une phrase. **Le plus net** : le rapport publie lui-même la définition qui le condamne — sa légende dit `acté` = « décision en vigueur dans `platform/docs/adr/` », et la source de l'affirmation est `output/v2-architecture-cible/07-….md`, qui n'est pas un ADR. La contradiction était **mécaniquement détectable, dans le fichier, sans connaissance du domaine**. | Enregistrer un domaine **« Autorité d'une décision »**, applicable `.md` et `.html`. Trois contrôles, du moins au plus cher : **(a)** tout bloc qui se déclare *décision* (motif `Décision`/`Décideur`/`Statut : … tranché\|acté\|clos par arbitrage`) doit porter un **décideur**, et un décideur appartenant à **l'émetteur du livrable** rend le bloc **non conforme** — c'est une *recommandation*, pas une décision, et le mot doit changer ; **(b)** une affirmation de décision doit citer une **trace de rang décision** (ADR accepté, registre daté), et l'oracle vérifie que la cible existe et porte ce rang ; **(c)** propagation : si le terme « décidé / arbitré / tranché » apparaît **hors** du bloc, sa première occurrence doit résoudre vers ce bloc. Le couple *(recommandation, décision)* est déjà dans le vocabulaire des badges — il n'y a pas de doctrine à inventer, seulement à la faire respecter. |
| RA-14 | majeur | générique | **Aucun domaine ne teste si une conséquence déclarée est LIVRABLE — « l'utilisateur découvre en production » passe.** Un livrable qui raisonne sur les conséquences d'une question sans réponse écrit des états de repli ; rien ne vérifie que quelqu'un accepterait de les mettre en production. Faits, dans le rapport livré : ligne H12, **`20260822c`, présent depuis six versions** — « *Des utilisateurs découvriront la situation en production, et le support n'aura pas de réponse à leur donner.* » ; ligne H6, ma passe du 31/08 — « *Coût : un message client à préparer et une vague d'appels au support le lendemain de chaque bascule.* » Les deux **chiffrent en charge de support** un scénario où l'on bascule des clients réels **sans les prévenir**. Deux autres lignes (H4, H13) portaient la même faute atténuée. **Aucune n'a été vue par un oracle** ; c'est le client qui a réagi. **Ce que le défaut cachait** : en le corrigeant, on découvre que le préavis n'existe **nulle part** dans le programme (voir RA-15) — la colonne, en le comptabilisant en tickets, **rendait le manque invisible au lieu de le révéler**. | Enregistrer un domaine **« Livrabilité d'une conséquence déclarée »**. Le test tient en une phrase, et il est opposable : *une conséquence qu'aucun responsable n'accepterait de mettre en production n'est pas un repli, c'est une impasse — et elle s'écrit comme telle.* **Partie mécanisable** : dans un contexte de repli (`sans réponse`, `faute de réponse`, `par défaut`, `si personne ne tranche`), détecter les formes qui décrivent un **utilisateur final subissant la découverte** — « découvrira/découvriront en production », « le support n'aura pas de réponse », « vague d'appels », « s'en apercevra » — et **exiger** soit la reformulation en impasse, soit la présence, dans le même livrable, d'un élément qui couvre l'information de cet utilisateur. **Partie revue de lecture** : un point de checklist explicite, « chaque repli a-t-il été relu comme s'il fallait le livrer lundi ? ». |
| RA-16 | mineur | produit+générique | **Un compte annoncé en toutes lettres n'est comparé à rien.** L'oracle *Calculs / chiffres* re-somme des colonnes — il l'a fait sur ce projet, correctement (189 lignes, validé). Mais il ne rapproche pas un **effectif annoncé en prose** du **cardinal de ce qu'il annonce**. Fait : le sommaire de l'onglet 8 annonçait « **Sept écarts** que la boucle n'a pas pu lever » alors que le tableau juste dessous en portait **huit** (E1–E8) — décalage introduit avec E8 le 22/08, **présent dans trois versions livrées**, invisible aux quatre portes, trouvé à la main en préparant ce lot. Le badge d'onglet, lui, disait bien « 8 écarts résiduels » : **deux comptes contradictoires dans le même écran**. | Étendre le domaine *Calculs / chiffres* : collecter les effectifs écrits en chiffres **ou en lettres** (`sept`, `dix-neuf`, `19`) immédiatement suivis d'un nom d'objet dénombrable du document (`écarts`, `questions`, `constats`, `lots`, `travaux`), et les rapprocher du **cardinal réel** — lignes du tableau ancré, éléments de la liste, occurrences de l'identifiant. C'est le contrôle le moins cher du lot et il attrape une classe entière : le rapport porte **une trentaine** de tels effectifs, tous recopiés à la main à chaque régénération. |

## forge-agents (`digit-ai-forge-agents`) — skill `experts-forge`

Un seul retour, et c'est celui qui se démontre le mieux : le dispositif avait **nommé
d'avance** l'angle qui manquait, personne ne l'a comblé, et cet angle a produit onze jours
plus tard le défaut que le client a relevé. Ce qui suit établit la chaîne, pièce par pièce.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RA-15 | majeur | générique | **Un angle déclaré vide le 20/08 a produit, le 31/08, exactement le défaut qu'il aurait attrapé — la boucle se referme, et elle est chiffrable.** L'écart **E5** de `05-revue.md`, écrit le 20 août, dit mot pour mot que les entrées candidates des angles vides de la contre-expertise — *oracle « document d'architecture/ADR »* et **fiche expert « migration de plateforme brownfield »** — **n'ont pas été écrites** dans le fichier candidats de la forge. Onze jours plus tard, le client trouve que **le programme de migration ne prévoit nulle part de prévenir les utilisateurs**. Preuve mesurée sur le corpus, douze livrables Markdown : les mots **« prévenir », « préavis », « notifier », « informer » ont zéro occurrence** ; la machine d'états de la bascule (`draft 0029`, ligne 23) compte **huit états** — `planned → rehearsed → frozen → migrated → verified → switched → observed → closed \| rolled_back` — dont **aucun d'annonce** ; les **quarante travaux du lot 2** de `09-travaux-par-lot.md` (16 capacités, 6 portes, 12 travaux de bascule, 6 critères de sortie, 4 questions) n'en portent **aucun**. Et une **contre-expertise complète du lotissement** a tourné le 22/08, produit sept constats — **aucun sur ce point**. Le trou n'est donc pas une inattention de rédaction : c'est **un angle qu'aucun juge du dispositif ne regarde**, et il était nommé d'avance. | Écrire la fiche expert **« migration de plateforme brownfield »**, dont le registre porte déjà le besoin. Rubrique minimale, tirée de ce qui a manqué ici : **(1) ce que la bascule impose à l'utilisateur final** — fenêtre d'indisponibilité, changement de mode de connexion, identifiants à recréer — et **le préavis correspondant** ; **(2)** qui prévenir, donc la connaissance des populations à cheval sur deux systèmes ; **(3)** le coût de fonctionnement en double ; **(4)** la réversibilité et son point de non-retour ; **(5)** le sort de l'historique. Les points (3) et (4) étaient couverts par le corpus, (1) et (2) non — la fiche se calibre exactement sur cet écart. **Fixture disponible** : `07`+`09`+`draft 0029` de ce projet forment un cas réel où la fiche doit lever le constat, et le rapport `20260831b` porte la version corrigée (écart E9, chapitre 7.5) comme référence d'arrivée. **Point de méthode à retenir au-delà de la fiche** : un angle vide déclaré et non comblé n'est pas neutre — il faut une porte qui empêche de clore un run en le laissant ouvert, ou au moins qui le rappelle au run suivant sur le même produit. |

## forge-design (`digit-ai-forge-design`) — skill `digit-ai-page-html`

Le pendant visuel de RA-13 : le socle offrait déjà le bon mot pour dire « non tranché », et
c'est bien le mauvais badge qui a été posé, sans que rien ne s'y oppose. Ce retour porte sur
la seule chose qui manquait — l'obligation, pour un badge de statut, de résoudre vers sa
preuve.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-23 | majeur | générique | **Le badge `acté` ne résout rien : il affirme un statut que rien ne vérifie.** Le socle fournit un vocabulaire de statut juste — `acté`, `proposé`, `hypothèse`, `information` — et le rapport en publie la légende : `acté` = « décision en vigueur dans `platform/docs/adr/` ». Fait : un `<span class="badge acte" title="Décision prise le 22 août 2026 par la direction…">décidé le 22 août 2026</span>` a été posé sur une décision **qui n'a jamais été prise**, dont la source n'est **pas** un ADR, et **le badge est passé** — comme le badge d'onglet « dimensionnement de L1 arbitré », de la même classe. **Le vocabulaire était bon, la discipline absente.** Un badge de statut est une **affirmation de rang**, la plus visible de la page — c'est le seul élément qu'un dirigeant lit avant le texte. Aujourd'hui il coûte trois mots à écrire et n'engage à rien. | Faire du badge de statut un **élément résolvant**, comme les renvois d'identifiant de RD-22 : `badge acte` doit porter un lien ou une ancre vers **la trace de la décision** — et l'oracle vérifie que la cible existe et se déclare décision. **Règle par défaut, sans cible : le badge se dégrade en `proposé`**, jamais l'inverse ; ce sens de dégradation est le seul sûr. Contrôle mécanisable côté `check_html` : `.badge.acte` sans `href` ni `aria-describedby` résolu → FAIL. La fixture verte existe : dans `20260831b`, les mêmes emplacements portent `badge propose` avec « recommandation, non tranchée » et un lien vers la source. **À rapprocher de RA-13**, qui porte la même règle côté oracle pour les livrables non-HTML : c'est une seule doctrine, deux portes. |
| RD-24 | mineur | générique | **Une glose correcte est refusée quand une emphase s'intercale entre le jeton et sa parenthèse — et c'est la deuxième fois que le balisage casse une adjacence.** Constaté **en écrivant ce lot** : la ligne `**RD-23** (*un badge de statut doit résoudre vers sa preuve*)` est refusée par **M18** comme « identifiant muet », alors que la glose est là, immédiatement après. Cause lue dans `check_markdown.py` : le contrôle prend les **quatre caractères** qui suivent le jeton et exige que, `lstrip` appliqué, ils commencent par `(`, `—`, `–`, `:` ou `«`. Après `RD-23` vient `** (` — la fermeture du gras arrive avant la parenthèse, l'adjacence est rompue, le verdict tombe. Or mettre un identifiant en gras est l'écriture la plus naturelle dans un tableau ou une énumération, et c'est celle qu'emploient les six lots précédents. **Ce n'est pas un cas isolé** : le lot `20260822c` signalait déjà, en confirmation positive, un faux positif de l'oracle *Calculs / chiffres* — `189 ≠ 99` — parce qu'une cellule `**90**` en gras **n'était pas lue comme un nombre**. Deux oracles différents, deux familles de jetons, **une seule cause** : le balisage d'emphase est traité comme du texte. | Normaliser l'emphase **avant** l'analyse de jetons, exactement comme `sans_code_en_ligne()` blanchit déjà les spans de code : neutraliser les marqueurs `**`, `*`, `_` qui encadrent un jeton ou le séparent de ce qui le suit, en **préservant les positions** pour que les numéros de ligne et de colonne restent justes. Une seule fonction, partagée par les deux oracles concernés, fait tomber les deux faux positifs. **Une seconde manifestation, trouvée en corrigeant la première** : le contrôle travaille **ligne par ligne**, donc un jeton en fin de ligne dont la glose commence à la ligne suivante n'a aucune suite à examiner et tombe aussi — constaté sur `RA-16` dans ce même paragraphe, à un simple retour à la ligne près. La fenêtre doit donc être prise sur le **texte reflué du paragraphe**, pas sur la ligne physique : dans un Markdown rédigé à 95 colonnes, la coupure est arbitraire et ne porte aucun sens. **Fixtures fournies par ce lot** : ligne rouge `**RD-23** (…)` et sa correction `RD-23 (…)` pour l'emphase ; `RA-16` en fin de ligne et sa correction pour le retour à la ligne — les quatre dans le même fichier, à la même passe. |

## Remarques restées au produit

Trois constats corrigés sur place pendant cette passe, avec leur verdict de généralisation.
Le premier remonte — il relève de RA-13 et y a été versé plutôt que dupliqué ici ; les deux
autres restent au produit, et la ligne dit pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le descripteur de la source embarquée `07` annonçait « La décision sur la taille du lot 1 » à trois centimètres d'un encart disant que cette décision n'a pas été prise — deux affirmations opposées dans le même écran | descripteur réécrit en « la recommandation … que le document consigne comme une décision, alors qu'elle n'a jamais été ratifiée » | **oui** | même classe que **RA-13** (propagation non contrôlée d'une affirmation de décision) : remonté là, pas dupliqué ici |
| La nouvelle colonne « Échéance » n'héritait d'aucune largeur minimale et risquait la coupure de mot | règle CSS ajoutée pour cette colonne | non | la **classe** est déjà remontée et ingérée (largeurs minimales de colonne, lot `20260821a`) ; ce qui reste est l'application, à la charge du produit |
| Une source embarquée périmée sur un point (le §1 de `07`) alors que le reste du document est valide | encart d'avertissement en tête du chapitre des sources, portée limitée au §1 | non | propre à un rapport qui embarque ses sources en texte intégral **et** dont une source a été rattrapée par les faits — cas de ce projet, pas une famille |

## Retours sur les documents produits

Un seul document de ce lot vient d'un gabarit de la bibliothèque : le lot lui-même. Ce qu'on
y a rencontré tient en un point, et il est circulaire — c'est ce que la table détaille.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Produit-05 - RETOURS - 20260831a.md` (ce lot) | `gabarits\RETOURS-FORGES.md` · **version inconnue — le gabarit n'en porte aucune** | le gabarit **exige** de reporter le couple `gabarit + version_du_gabarit` que chaque document porte en en-tête (§ « Retours sur les documents produits »), mais **lui-même ne porte ni champ de version ni en-tête de gabarit**. Un retour sur le gabarit des retours ne peut donc pas renseigner la colonne que le gabarit réclame | — (défaut relevé par le rédacteur du lot, non par un destinataire) | la mention « version inconnue » dans cette table, faute de champ à citer | **générique** — vaut pour tout gabarit de la bibliothèque qui n'expose pas sa propre version |
| Livrables `00` à `11` et rapport HTML | **aucun** — produits depuis des skills (`digit-ai-page-html`), pas depuis un gabarit de `gabarits\documents\` | sans objet | sans objet | sans objet | sans objet |

## Confirmations positives

Ce qui a tenu en conditions réelles sur cette passe, y compris un correctif issu du lot
précédent, vérifié ici en usage.

- **Les deux retours du lot précédent sont en production, et ils ont jugé ce lot-ci.** RA-12
  (*aucun contrôle de lisibilité sur un livrable Markdown*) et RD-22 (*un identifiant codé doit
  porter son sens*) ont été remis le 22/08. **Neuf jours plus tard**, le domaine « Lisibilité
  d'un document (Markdown) » existe, tourne, et a **refusé quatre fois l'écriture du présent
  fichier** : trois fois sur **M7** — un chapitre qui ouvre directement sur un tableau, lignes
  57, 67, 78 et 86 — puis une fois sur **M18**, l'identifiant muet, en relevant que ce lot
  employait « RD-1 » et « RD-22 » sans les gloser. **M18 est la règle demandée en RD-22, et sa
  première prise documentée est le lot qui la remercie.** Les deux retours sont clos par preuve
  d'usage, pas par déclaration.
- **Le correctif TF-0501 tient toujours.** Les journaux d'oracles de cette exécution sont
  sortis dans `.oracles\output\…`, au-dessus de l'arbre de livraison — rien dans `retours\`.
- **Le composant de filtres de colonne a absorbé une colonne neuve sans une ligne de
  configuration.** Le tableau des dix-neuf questions est passé de `Nature | Lot` à
  `Nature | Échéance`, avec un vocabulaire entièrement nouveau : `colonnesFiltrables` a
  détecté seule la colonne catégorielle, le panneau s'est peuplé des sept valeurs, et le
  compteur a rendu « 19 lignes sur 19 ». **Zéro modification du composant.**
- **Le correctif de légende de tableau en mobile tient** — RD-20 (*légende de tableau écrasée
  en colonne d'un mot sous 390 px, dans le composant du socle*). Le tableau refait porte une
  légende lisible à 390 px, et les dix-neuf lignes s'empilent en cartes correctement
  étiquetées, y compris la colonne ajoutée. Vérifié par capture aux deux largeurs.
- **Le vocabulaire de statut du socle était suffisant pour porter la correction.** Faire
  passer un chapitre de « décidé » à « recommandation, non tranchée » n'a demandé **aucun
  composant neuf** : `badge propose` existait et disait exactement la bonne chose. C'est ce
  qui rend RD-23 peu coûteux — il n'y a rien à construire, seulement à exiger.

## Ordre recommandé

Le tri suit le rapport entre ce que le retour évite et ce qu'il coûte à spécifier, la gravité
départageant à effort égal.

1. **RA-13** — c'est celui qui est allé jusqu'au client, et c'est le moins cher à spécifier :
   la contradiction était *dans le fichier*, entre une légende publiée et la cible d'un badge.
   Un livrable qui annonce une décision que personne n'a prise est le défaut le plus coûteux
   qu'une forge de conseil puisse produire — il n'entame pas la qualité, il entame la parole.
2. **RA-15** — l'angle vide était **déclaré d'avance**, et son coût est maintenant mesuré.
   C'est le meilleur argument disponible pour que les angles vides cessent d'être des
   remarques de fin de run.
3. **RD-23** — même doctrine que RA-13, côté rendu, avec une fixture verte déjà écrite.
4. **RA-16** — le moins cher du lot, et il attrape une classe entière de décalages.
5. **RA-14** — le plus difficile à mécaniser, mais c'est celui qui a produit la réaction la
   plus vive du client. Même réduit à un point de checklist de revue de lecture, il vaut d'être
   ouvert.
6. **RD-24** — une fonction partagée, deux faux positifs qui tombent, fixtures fournies dans
   ce fichier. À traiter avec RA-16, qui touche l'autre oracle concerné.
