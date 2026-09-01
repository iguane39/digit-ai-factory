# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20260823a

- **Contexte** : construction des deux livrables **DAT** et **DEX** du produit à partir des
  gabarits de la bibliothèque, le 23/08/2026 — première utilisation réelle de ces deux familles
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`
- **Statut** : remis le 2026-08-23

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot, et sa mesure principale.** Les familles `dossier-architecture-technique` et
`dossier-exploitation` sont entrées au catalogue le 21/08 avec le statut **`ok`**. Le 23/08, la
**première tentative de produire un document réel** avec elles a rencontré **deux défauts dans
les squelettes eux-mêmes**, dont un qui les faisait échouer à l'oracle du socle.

Le fait qui compte n'est aucun des deux défauts pris isolément — ils sont corrigés, et le
correctif tient en quelques lignes de style. **Le fait qui compte est qu'un gabarit ait pu entrer
au catalogue en `ok` sans avoir jamais produit une seule page.** Les deux défauts n'étaient pas
subtils : le premier fait rendre FAIL au squelette livré, le second fait rendre un sommaire en
liste nue. Aucun des deux ne demandait de perspicacité — seulement d'essayer.

S'y ajoute un troisième retour, de nature différente : un défaut **de ma part**, dont la classe
est générique et qu'aucun mécanisme ne détecte.

---

## pilot (`digit-ai-factory`) — bibliothèque de gabarits, et détection des règles perdues

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-23 | bloquant | générique | **Les deux squelettes livrés le 21/08 échouaient à l'oracle du socle, sur leur propre feuille de style.** Mesuré le 23/08 : `check_html.py` rend **FAIL** sur `SQUELETTE.html` des deux familles, règle **L19**, à cause de `th, td { … overflow-wrap: anywhere }` — la déclaration casse un mot de prose en deux au milieu d'une ligne, sans césure ni trait d'union. Un dossier d'architecture comme un dossier d'exploitation sont pleins de prose dans leurs cellules. La troisième famille de la bibliothèque, `rapport-de-donnees`, ne porte pas cette déclaration et rend **PASS** : les deux squelettes du 21/08 l'ont héritée d'ailleurs. | Correctif appliqué et poussé (`anywhere` réservé à `th code, td code, th a, td a`), version des squelettes portée à 1.0.2. Ce qui reste à décider est au-dessus du correctif : **voir RA-25**. |
| RA-24 | majeur | générique | **Un composant déclaré sans style est INVISIBLE aux deux oracles.** Les squelettes portent `<nav class="toc">` et des entrées correctement annotées : la règle **L6** est satisfaite au sens mécanique, `check_html` rend PASS, et `render_page` aussi puisqu'il n'y a ni chevauchement ni troncature. Mais **aucune règle CSS ne vise `.toc`** : le sommaire se rend en liste numérotée nue, ce qu'aucun livrable du parc ne fait. Le défaut n'a été vu que par comparaison avec un livrable réel du même produit (`Client-A - Diagnostic - … - 20260821a.html`, qui porte le bloc `.toc` complet). Second défaut lié : les entrées mettaient le titre en texte nu suivi d'un tiret, au lieu de la forme à **deux `span`** que la charte attend — le style de titre n'avait donc rien sur quoi s'appliquer, même une fois la feuille ajoutée. | Règle mécanique proposée, peu coûteuse : **toute classe de composant de la charte présente dans le marquage doit être visée par au moins une règle CSS de la page**. `toc`, `toc-t`, `toc-d`, `ch-apprend`, `table-hote`, `repli-cartes`, `diagram-wrap`… La liste est fermée et connue ; le contrôle est un balayage de sélecteurs. C'est exactement la classe de défaut qu'un oracle de MARQUAGE ne peut pas voir. |
| RA-25 | bloquant | générique | **Un gabarit peut entrer au catalogue en statut `ok` sans avoir jamais produit une seule page.** C'est la cause commune de RA-23 et RA-24, et elle est structurelle. Les deux familles sont entrées le 21/08 en `ok` ; le 23/08, la première production réelle a rencontré deux défauts dont un bloquant, tous deux triviaux à voir **dès qu'on essaie**. Le README de la bibliothèque exige la provenance (« extrait de quatre occurrences réelles ») — donc que la forme vienne du réel — mais **rien n'exige que le squelette ait produit du réel**. Extraire une forme et savoir la rejouer sont deux choses. | Règle **G8 bis** proposée : un gabarit ne prend le statut `ok` qu'accompagné d'une **instance de preuve** — un document minimal produit depuis ce squelette, versionné à côté de lui, et **jugé PASS par les oracles de son format**. Le coût est d'une page par famille, payé une fois ; il aurait évité les deux défauts ci-dessus, et il vaut pour les 30 familles du catalogue. Pendant exact des fixtures rouge/verte que l'écosystème exige déjà de tout oracle. |
| RA-26 | majeur | générique | **Rien ne détecte qu'un livrable a été MODIFIÉ après avoir été jugé, sans changer d'indice.** Défaut de ma part, mais sa classe est générique et aucun mécanisme ne la voit. Le 23/08, j'ai écrasé quatre fois le même fichier `… - 20260823a.html` — correction de style, montée de version de gabarit, ajout de trois schémas, correction de chevauchements — alors que la **règle 5** dit : « l'indice est une lettre par itération du même jour ; une nouvelle version = un nouveau fichier daté, **jamais d'écrasement** ». Les états intermédiaires sont perdus. Aggravant qui montre que la connaissance de la règle ne suffit pas : **j'avais signalé le même défaut à la Factory une heure plus tôt** — un même numéro de version de gabarit désignant deux squelettes différents — et je l'ai reproduit sur mes propres livrables. | La règle est câblable, et sur une preuve qui existe déjà : **R-32 exige un journal d'oracles par livrable HTML**. Il suffit d'y consigner l'**empreinte du fichier jugé**, et de faire échouer un contrôle quand le fichier porte une empreinte différente de celle de son journal **à indice inchangé**. Un livrable modifié après jugement devient alors visible, sans rien demander à personne. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Mes pastilles de bande de schéma étaient un rectangle et un texte côte à côte, pas un groupe titré : `render_page` les a comptées comme des chevauchements | 14 pastilles regroupées dans un `<g>` porteur de `<title>` | non | La convention le dit déjà, noir sur blanc : « un nœud de schéma est UN objet ». Défaut de lecture de ma part, pas manque du référentiel |
| Mes cadres englobants recouvraient les nœuds qu'ils entourent | 9 cadres déclarés par `data-overlap-ok` avec leur raison écrite | non | Idem : la convention distingue explicitement le chevauchement subi du chevauchement déclaré. La règle ne dit pas « pas de chevauchement », elle dit « pas de chevauchement **non déclaré** » — et je l'ai comprise en la violant |
| Le numéro de version déclaré dans les deux `GABARIT.md` ne suit pas encore celui des squelettes (1.0.2) | non fait | **oui → RA-26** | Non fait volontairement : ces deux fichiers portaient, au moment du correctif, des modifications non committées d'une **autre session**, et je ne voulais pas les emporter. Mais la classe du défaut — un numéro de version qui désigne deux contenus — est exactement celle de RA-26, et elle est remontée à ce titre |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - DAT - Produit-03 - 20260823b.html` | `gd-dossier-architecture` · 1.0.0 à la prise, corrigé en 1.0.2 | **Le style du sommaire** (RA-24). Et **aucun emplacement prévu pour les schémas** hors la section 2 : le gabarit engage la règle D5 sur les schémas et renvoie au skill dédié, mais le squelette n'offre qu'une `<figure>` vide, sans le bloc `.diagram-wrap`, sans les classes SVG de la charte, sans le script d'infobulles | **Le sommaire rendu en liste numérotée nue.** C'est le premier élément qu'on lit, et il ne ressemblait pas à un livrable Digit-AI. Signalé par le destinataire, pas par un oracle | Le bloc CSS complet des schémas (palette sémantique, classes SVG, marqueurs, infobulles), trois schémas, et le style du sommaire | **générique** — les deux manques valent pour toute famille dont les documents portent des schémas |
| `Client-A - DEX - Produit-03 - 20260823b.html` | `gd-dossier-exploitation` · 1.0.0 à la prise, corrigé en 1.0.2 | Idem, et **aucune section ne prévoit de schéma** : un dossier d'exploitation gagne pourtant à montrer la topologie qu'il décrit et l'endroit où se place le retour arrière | Idem | Idem, plus deux schémas insérés dans des sections qui ne les prévoyaient pas | **générique** |

**Ce que ces deux lignes disent ensemble** : la bibliothèque de gabarits et le skill de schémas
existent séparément et **ne se rencontrent nulle part**. Le gabarit du DAT cite la règle D5 et
renvoie à `gd-schema-technique`, mais son squelette ne porte rien de ce qu'il faut pour l'appliquer.
Un projet qui suit le gabarit à la lettre produit un dossier d'architecture **sans schéma**, ou
avec un schéma hors charte. Proposition : que les squelettes des familles concernées embarquent
le bloc de style des schémas et le script d'infobulles, prêts à l'emploi, avec un emplacement
nommé par section susceptible d'en porter un.

## Confirmations positives

- **Les deux oracles du socle ont fait exactement leur travail sur le contenu.** `check_html` a
  nommé L19 avec le remède dans le message ; `render_page` a nommé chaque chevauchement avec ses
  dimensions et le pourcentage de recouvrement. Aucun des deux n'a produit de faux positif sur
  les 5 schémas et 65 infobulles finalement posés.
- **Le gabarit du DAT a résisté à une erreur de conception que j'allais commettre.** Sa section 2
  dit « par renvoi — **ne pas recopier** » et son verdict de non-recouvrement explique pourquoi :
  un DAT qui recopie la vue logique diverge au premier redéploiement. Sans cette consigne, j'aurais
  réécrit `ARCHITECTURE.md` dans le dossier.
- **La convention de superposition déclarée est bien écrite et bien placée.** Elle m'a coûté un
  aller-retour parce que je ne l'avais pas lue en entier, pas parce qu'elle manquait.

## Ordre recommandé

1. **RA-25** — c'est la cause, les deux autres défauts de squelette en sont les symptômes. Une
   instance de preuve par famille, payée une fois, et le catalogue cesse de promettre ce qu'il
   n'a pas essayé.
2. **RA-24** — mécanique, peu coûteux, et il attrape une classe entière que le marquage cache.
3. **RA-26** — la seule des quatre qui ne concerne pas les gabarits : elle rend visible un
   livrable modifié après jugement, sur une preuve qui existe déjà.
4. **RA-23** — déjà corrigé, listé pour la traçabilité et parce que sa cause est RA-25.
