# Retours forges — Produit-03 — 20260908a

- **Contexte** : refonte d'un livrable HTML de mise en production sur demande du destinataire —
  *« le document disperse les informations dans plusieurs chapitres, ce qui perd le lecteur »* —
  puis constat, dans le même mandat, que **le numéro de version du document était faux et
  qu'aucun historique n'était enclenché**. Les deux faits sont remontés ici sur demande explicite
  du commanditaire, le 08/09/2026.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot, et ce qui le rend inconfortable.** Le livrable a passé, à chaque étape, les
trois oracles du socle et l'oracle de filtres : quatre verdicts verts, cinq fois de suite, sur
deux jours. Il a pourtant fallu que **le lecteur humain** signale les deux défauts qui comptaient :
les informations dispersées entre six chapitres, et une version qui ne bougeait pas. Le premier
défaut a **une classe déjà ouverte au référentiel**, `page-html-liste-renvoi-sans-detail`, créée
le 03/09 et marquée « reproduite » — nous l'avons reproduite une fois de plus. Le second a une
classe ouverte **et un mécanisme outillé**, qui n'a rien vu parce qu'il attendait un sceau que
personne n'avait posé, alors qu'un second sceau, écrit par une autre règle, enregistrait
tranquillement les quatre empreintes successives.

---

## `digit-ai-page-html` — ce que les oracles n'ont pas vu, et un faux positif

Le socle a tenu tout ce qu'il mesure. Ce lot porte sur ce qu'il ne mesure pas, et sur un mot dont
les deux sens se percutent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-41 | majeur | générique | **RÉCIDIVE de `page-html-liste-renvoi-sans-detail` : la classe déclare `check_html.py` et la critique d'implémentation comme oracles, et ni l'un ni l'autre ne l'a vue.** Le livrable `… - 20260907a.html` portait un listing de neuf actions dont le détail vivait dans **six chapitres** : le chapitre 3 reprenait et complétait les lignes du tableau du chapitre 2, les phases A′ et C n'entraient pas du tout dans le listing. `check_html.py` : `Verdict : PASS`, 36 règles. `render_page.py` : PASS dans trois états. `oracle-filtres-tableau.mjs` : PASS. Le défaut a été relevé par le destinataire, mot pour mot : *« le listing actuel affiche des informations, mais pas toutes les informations, et certaines autres sont reprises et / ou complétées dans les chapitres suivants »*. La classe existe depuis le 03/09 (fondée par TF-0757, « déjà remontée par un autre projet, reproduite ») : la connaissance était là, la mesure non | Rendre la classe **mesurable** plutôt que documentée : sur une page qui déclare un listing d'opérations, refuser qu'une ligne de tableau renvoie par ancre interne vers une section du même document qui porte, sur le même objet, une information absente de la ligne et de son détail. À défaut d'automatisme, une déclaration obligatoire `data-listing-exhaustif="<ce que le détail porte>"` que la critique d'implémentation lit et challenge |
| RA-42 | mineur | générique | **`RE_TH_SCORE` de `check_html.py` traite le mot « Indice » comme une colonne de score calculé, alors que c'est le nom que la maison donne au numéro de version d'un livrable.** Un tableau d'historique de document dont la colonne s'intitule « Indice » (valeurs `20260903a`, `20260907a`, `20260908a`) échoue : `L3 colonne calculée sans formule : « Indice » — la colonne qui ordonne le tableau doit publier son calcul et y renvoyer par aria-describedby`. Aucun calcul n'existe : ce sont des dates suffixées d'une lettre. Le motif est `^\s*(score\|note\|indice\|priorité\|…)\b` (`check_html.py:153`), et « indice » y côtoie « score » — or les règles 4 et 5 de `REGLES-PROJET.md` emploient « indice » exclusivement au sens de version. Contourné en renommant la colonne « Version », ce qui **efface le mot de la convention maison du document qui la respecte** | Corroborer le sens « score » avant d'accuser : n'appliquer la règle que si les valeurs de la colonne sont numériques ou fractionnaires. Ou exclure du motif les valeurs qui matchent `\d{8}[a-z]` — la forme même de l'indice maison |
| RA-43 | mineur | générique | **Le remède que la règle V16 prescrit dans son message n'existe pas dans le fichier d'où l'on part.** Le message dit : *« employer un fond PLEIN à encre blanche (`*-solid`) »*. Les jetons `--green-solid`, `--teal-solid`, `--amber-solid`, `--red-solid`, `--slate-solid`, `--violet-solid` sont bien définis, mais dans `references/charte-et-tokens.md` (lignes 47-48) — **pas dans `assets/boilerplate.html`**, qui ne définit que les quatre `*-fill`. Une page bâtie sur le boilerplate, comme le prescrit le skill, n'a aucun jeton `*-solid` sous la main : il faut aller les recopier d'un fichier de référence, à la main, ce qui est exactement le geste que l'embarquement de composants existe pour supprimer | Porter les six jetons `*-solid` dans `assets/boilerplate.html`, au même titre que les `*-fill`. Un remède cité par un message bloquant se trouve dans l'artefact de départ, sinon la règle facture au producteur le coût de sa propre application |

## `pilot` — deux mécanismes de scellement qui s'ignorent, et un historique que rien n'exige

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-44 | majeur | générique | **RÉCIDIVE de `livrable-ecrase-sans-indice` : deux sceaux coexistent, écrits par deux règles, et ils s'ignorent.** La règle 5 est outillée par `scripts/verifier-jugement.mjs`, qui pose un sceau `<fichier>.jugement.json` et refuse ensuite toute modification à indice inchangé — mais **seulement si le sceau a été posé**, et un livrable non scellé est un état déclaré, pas un défaut. Or la règle R-32 fait écrire, **au moment exact où le livrable passe ses oracles pour la première fois**, un journal `forge/oracles/<livrable>.json` qui porte un champ `sha256_livrable`. C'est un sceau, sous un autre nom, dans un autre dossier. Mesure : le fichier `… - 20260907a.html` a été modifié **quatre fois** après jugement, les 7 et 8 septembre, et **les quatre empreintes successives sont dans le journal**, chacune dans son commit (`e4cb8d3`, `8746d95`, `a84c96d`, `41ae348`) — avec des champs `rejoue_apres`, `rejoue_apres_2`, `rejoue_apres_3`, `rejoue_apres_4` que j'ai ajoutés au fil de l'eau : **un journal de version bricolé à l'intérieur du sceau qui aurait dû refuser la modification**. Rien n'a rien dit | Faire du journal R-32 le sceau qu'il est déjà : à l'écriture, si `livrable` est inchangé et que `sha256_livrable` diffère de la valeur consignée, refuser et exiger un nouvel indice. Ou faire lire ce journal par `verifier-jugement.mjs` comme sceau équivalent. Le geste coûte peu : les deux fichiers portent la même empreinte du même artefact |
| RA-45 | majeur | générique | **Aucune règle n'exige d'un livrable documentaire qu'il porte son propre historique de versions**, et le manque se paie côté lecteur. Le document `… - 20260907a.html` a été remis à des administrateurs pour préparer une mise en production : il affichait « indice 20260907a » et rien d'autre, alors qu'il avait changé quatre fois en deux jours. Un lecteur qui l'avait ouvert la veille n'avait **aucun moyen** de savoir ce qui avait bougé. Ni la doctrine documentaire (`gabarits/documents/README.md`, D1-D9), ni les 36 règles de `check_html.py` n'appellent un bloc d'historique. Le journal R-32 garde bien la trace machine — dans un fichier que le destinataire du livrable n'ouvre jamais. Constat du commanditaire : *« aucun historique n'est enclenché »* | Exiger un bloc « Historique du document » — version, date, ce qui change — dans tout livrable documentaire remis, et le rendre mesurable : une page qui déclare un indice porte une section d'historique dont la première ligne est l'indice courant. La classe correspondante reste à créer : elle est **voisine** de `livrable-ecrase-sans-indice` sans se confondre avec elle — l'une porte sur l'écrasement du fichier, l'autre sur ce que le lecteur peut savoir de ce qu'il lit |

## La règle qui aurait évité le retour

Trois des cinq retours désignent une classe existante, dont **deux récidives** :
`page-html-liste-renvoi-sans-detail` (RA-41) et `livrable-ecrase-sans-indice` (RA-44). C'est
l'information que ce lot apporte de plus utile : deux corrections déjà passées par la Factory ne
sont pas redescendues jusqu'ici sous une forme qui les rende inévitables — l'une est restée une
ligne de référentiel sans oracle, l'autre un mécanisme qui attend un geste préalable que rien ne
rappelle.

**Deux retours n'ont pas de clé qui convienne**, et le sidecar en porte donc la plus proche, faute
de pouvoir créer une classe depuis un lot :

- **RA-45** — « un livrable remis ne porte pas son historique de versions » : porté sur
  `livrable-ecrase-sans-indice`, famille `versionnement-livrable`. La classe à créer serait
  *`livrable-sans-historique-lisible`* — le défaut n'est pas l'écrasement du fichier, c'est
  l'impossibilité pour le lecteur de savoir ce qui a changé depuis sa dernière lecture.
- **RA-42** et **RA-43** — un faux positif d'une règle du socle sur un mot de la convention
  maison, et un remède prescrit absent de l'artefact de départ : portés sur
  `page-html-dictionnaire-colonnes`, famille `page-html-socle`, faute de mieux. Les classes à
  créer seraient *`regle-socle-faux-positif-sur-convention-maison`* et
  *`remede-prescrit-absent-du-boilerplate`*.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les informations du mode opératoire étaient réparties entre six chapitres, le listing n'était pas exhaustif, et les phases A′ et C n'y figuraient pas | Document reconstruit autour d'un **déroulé unique** de 26 étapes, généré depuis une source de données unique : chaque étape porte objectif, quand, dépendance, gestes, commandes, résultat attendu, livrable, ce qu'on transmet et ce qu'on fait en cas d'échec | **oui** | Remonté en RA-41 |
| Le fichier avait été modifié quatre fois à indice inchangé, et ne portait aucun historique | Nouvel indice `20260908a` (nouveau fichier, l'ancien n'est pas écrasé) et chapitre « Historique du document » ouvert, avec l'écart des quatre modifications **déclaré dans le document lui-même** | **oui** | Remonté en RA-44 et RA-45 |
| Cinq pastilles d'acteur indiscernables entre elles (écart de couleur 2,7 à 9,4 pour un seuil de 20) | Une seule teinte neutre, l'acteur se lit à son libellé | non | La règle V16 du socle a fait son travail le jour de son arrivée — c'est le remède qui manquait au boilerplate, remonté en RA-43 |
| Colonne « Acteur » à 4,34:1 sur le fond teinté introduit par l'alternance de lignes | Encre grise foncée sur cette colonne | non | Conséquence locale d'un choix de mise en forme local |
| Le détail des lignes était rendu en paragraphes denses | Puces et sous-puces, une idée par ligne | non | Choix de rédaction, demandé par le lecteur |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output/Client-A - Ordonnancement des etapes de MEP - Produit-03 - 20260908a.html` | **aucun gabarit de la bibliothèque** — la famille la plus proche du catalogue, `gd-dossier-mep`, est déclarée `porte_ailleurs` (format Markdown, étape MEP du pilot). Forme bâtie sur le socle `digit-ai-page-html` **1.18.0** (version affichée en en-tête du document, rubrique « Gabarit ») | Aucune structure de référence pour un mode opératoire : ni la notion d'étape porteuse de son propre détail exécutable, ni le bloc d'historique de versions. Les deux ont été inventés ici | La dispersion en six chapitres du premier jet, et l'absence d'historique — les deux défauts remontés en RA-41 et RA-45 | Le déroulé unique (26 étapes, source de données unique produisant le HTML et son jumeau Markdown), le chapitre « Historique du document », l'alternance de fond par paire ligne + détail, les jetons de contraste sur la colonne d'acteur | **générique** — un mode opératoire d'exploitation est un type de document courant ; c'est le deuxième lot consécutif (avec RA-37 du 20260903a) à signaler l'absence de cette famille |
