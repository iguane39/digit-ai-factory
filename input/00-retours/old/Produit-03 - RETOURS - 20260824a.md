# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20260824a

- **Contexte** : mise à jour de la fiche sécurité puis conversion en PDF, le 24/08/2026 — un
  défaut découvert **par la conversion**, que les deux oracles de la page HTML avaient laissé passer
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot.** Le destinataire a demandé une chose simple : *« convertis la fiche Sécurité
en PDF »*. La fiche venait d'être mise à jour et déclarée conforme — `check_html` **PASS**,
`render_page` **PASS**. Le PDF produit rendait **1 132 mots** là où la page en portait **1 313**.
Deux sections entières et le pied de page manquaient. Le défaut n'était pas dans le PDF : il était
dans la page, depuis sa mise à jour, et **aucun des deux oracles ne l'avait vu**.

---

## socle `digit-ai-page-html` — ce que les oracles mesurent, et ce qu'ils ne mesurent pas

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-31 | bloquant | générique | **`render_page` rend PASS sur une page qui perd 28 % de son contenu, parce qu'il mesure la mise en forme de ce qui s'affiche et jamais ce qui a disparu.** Mesuré le 24/08 sur la fiche sécurité du produit. Le gabarit de fiche est une feuille A4 à **hauteur figée** — `.page{height:297mm; overflow:hidden}` — et le contenu ajouté la veille l'a dépassée : **boîte 1 123 px, contenu 1 441 px, 318 px sous la ligne de flottaison, 41 éléments feuilles porteurs de texte devenus invisibles**, dont la section 7 (contrat de service et observabilité), la section 8 (FinOps) et le pied de page qui porte la référence du document. À l'écran comme à l'impression : **aucun signal**. Les deux oracles ont rendu PASS. Le défaut n'a été découvert que parce que le destinataire a demandé un PDF et que j'ai comparé les mots du PDF à ceux de la page — **1 132 contre 1 313**. Un contrôle qui vérifie l'apparence de ce qui reste visible ne peut, par construction, rien dire de ce qui a été rogné : `overflow:hidden` **est** le mécanisme qui rend un défaut invisible à un oracle visuel. La version d'origine de la fiche tenait à **1 123 px pile** — d'où un défaut latent depuis toujours, révélé par le premier ajout de contenu. | Nouvelle règle de rendu, **bloquante** : pour tout élément dont le style calculé porte `overflow` à `hidden`, `clip` ou `scroll` **sans possibilité de défilement pour le lecteur** (impression, ou conteneur non focalisable), comparer `scrollHeight` à `clientHeight` et `scrollWidth` à `clientWidth`. Tout écart supérieur à 2 px est **du contenu perdu** : nommer le nombre d'éléments feuilles sous la ligne de flottaison et citer les trois premiers, comme le fait déjà L2 pour les largeurs. Deux lignes de mesure dans le contexte de page déjà ouvert, aucun outillage nouveau. Corollaire pour la bibliothèque de gabarits : **une hauteur de page est un plancher (`min-height`), jamais un plafond** — un gabarit qui fige `height` et masque le débordement transforme tout ajout futur en perte silencieuse. |
| RA-32 | mineur | générique | **Le message de remédiation de L2 conduit tout droit à une seconde violation de L2, et ne le dit pas.** Mesuré le 24/08 sur la page de réponses à l'audit. Premier passage : *« largeur de texte bridée : `p.lede` — 706 px pour 1 636 px disponibles […] poser la mesure de lecture sur le conteneur (`.chap.lire`), pas sur le texte »*. J'ai fait **exactement** ce que la phrase demande — retiré `max-width` des paragraphes, posé la mesure sur un conteneur enveloppant. Second passage : *« alignement entre frères empilés : `div.lire` sous `ul.kpis` — 1 080 px de texte contre 1 636 px pour le bloc voisin »*, quatre fois. La correction prescrite **crée** le second défaut, dont la levée exige un attribut — `data-mesure-lecture` — que le premier message ne mentionne pas. Deux passages d'oracle et une lecture d'un document conforme du même dépôt pour trouver la forme attendue. | La phrase de remédiation du cas « largeur bridée » nomme le geste **complet** en une fois : poser la mesure sur le conteneur **et** la déclarer par `data-mesure-lecture` dès lors que ce conteneur a des frères plus larges. Un message de remédiation qui décrit la moitié du geste coûte un aller-retour à chaque rencontre — et il est rencontré à chaque page de prose large. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fiche du 24/08 indice `a` tronquait ses sections 7 et 8 | Indice `b` : `min-height` au lieu de `height`, `overflow:visible`, et coupures d'impression protégées sur les lignes de tableau, les encarts et l'en-tête. La feuille coule sur une seconde page A4. Vérifié sur le PDF produit : la page 1 se termine après la section 6, la page 2 s'ouvre sur le titre de la section 7, rien n'est coupé en son milieu | **oui**, et c'est RA-31 | La correction locale est faite. La cause — un gabarit qui fige une hauteur et masque le débordement — vaut pour toute la bibliothèque de gabarits de fiche |
| Une légende de tableau s'écrasait en filet vertical : 87 px de large pour 661 px de conteneur, 7 lignes pour 8 mots | La légende sort du flux de la table et occupe la largeur du conteneur hôte | non | `render_page` **a vu ce défaut tout seul** et l'a nommé avec sa mesure. Rien ne manque à l'oracle sur ce point — voir les confirmations positives |
| Le PDF tronqué de l'indice `a` a été produit puis supprimé | Supprimé avant toute remise ; seul le PDF de l'indice `b` est livré | non | Hygiène de production locale. Aucun mécanisme d'écosystème en cause |

## Retours sur les documents produits

Deux documents produits depuis la bibliothèque sur ce lot, et **c'est leur production qui a fait
apparaître RA-31 et RA-32**.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - IAC - Fiche Sécurité Mise à disposition - Dev - 20260824a.html` | `gd-fiche-securite` · statut `porte_ailleurs`, gabarit porté par `digit-ai-forge-audit/deliverables/templates/fiche-securite.template.md` — le document ne porte **aucune version de gabarit dans son en-tête**, et c'est déjà un manque en soi | La feuille A4 est bâtie sur `height:297mm` + `overflow:hidden`. Le gabarit ne dit nulle part que la hauteur est un **plafond**, ni ce qui arrive au contenu qui la dépasse. Il ne prévoit pas non plus de seconde page | Le destinataire a demandé le PDF de cette fiche. Le PDF rendait **1 132 mots pour 1 313 dans la page** : sections 7 et 8 et pied de page absents. Le manque a été constaté **sur le livrable remis**, pas supposé | `min-height` à la place de `height`, `overflow:visible`, et les règles de coupure d'impression `break-inside:avoid` sur les lignes de tableau, les encarts, l'en-tête et le pied — aucune n'était dans le gabarit | **générique** — tout gabarit de fiche à format fixe porte le même défaut |
| `Client-A - Reponses a l'audit du 18 aout - Produit-03 - 20260824a.html` | socle `digit-ai-page-html` · **1.13.0** (`digit-ai-forge-agents/.claude/skills/digit-ai-page-html`) | Rien ne manque au boilerplate. Ce qui manque est **dans le message de remédiation de L2** : il prescrit de déplacer la mesure de lecture sur le conteneur, sans dire qu'il faut alors la **déclarer** par `data-mesure-lecture` | Pas de lecteur externe sur ce document à ce stade : le coût a été payé par l'auteur — deux passages d'oracle et la lecture d'un document conforme d'un autre dépôt pour retrouver la forme attendue | Un conteneur `.lire` portant la mesure, plus l'attribut `data-mesure-lecture` avec sa raison. Et une règle CSS de largeur de légende, celle-là correctement diagnostiquée par l'oracle | **générique** — rencontré à chaque page de prose large |

## Confirmations positives

- **`render_page` a détecté seul un défaut qu'aucune relecture humaine n'aurait attrapé** : une
  légende de tableau écrasée à 87 px pour 661 px de conteneur, *« 7 lignes pour 8 mots »*. La
  mesure était dans le message, la cause était déductible, la correction a tenu du premier coup.
  C'est le contre-exemple exact de RA-31 : quand l'oracle mesure la **bonne grandeur**, il est
  meilleur qu'un relecteur.
- **La règle L2 sur la largeur de lecture a eu raison sur le fond.** Le reproche de RA-32 porte sur
  la **formulation** de la remédiation, pas sur le diagnostic : la page était effectivement mal
  composée, et elle est meilleure après correction.
- **La règle 5 a joué.** Le défaut appelait une nouvelle itération du même jour : indice `b`, fichier
  nouveau, indice `a` conservé tel quel. Rien n'a été écrasé, et l'historique montre le défaut
  autant que sa correction.

## Ordre recommandé

1. **RA-31** — c'est le seul défaut de cet écosystème qui fasse rendre **PASS à un document
   amputé**. Tant qu'il tient, un oracle vert ne prouve pas qu'un document est complet : il prouve
   que ce qu'on en voit est bien composé. Deux lignes de mesure suffisent à fermer l'écart.
2. **RA-32** — une phrase à rallonger dans un message existant, pour un aller-retour épargné à
   chaque page de prose large.
