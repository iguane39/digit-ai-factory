# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-24, indice c

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html`
(`render_page.py`, option `--sections`) · **Origine** : la revue de lecture de la vue « Démarrer
un projet » du guide développeur, rendue le 24/09 à l'indice `20260924f`.

Ce lot porte **1 retour**, trouvé en lisant les captures que le socle prescrit pour la revue de
lecture : aucun des scripts du socle ne le signale.

- **Contexte** : demande du porteur du 24/09/2026 sur le guide développeur — dans l'onglet
  « Démarrer un projet », l'emplacement, le format et un exemple de la fiche produit, puis un
  dernier chapitre qui donne le prompt lançant la conception, l'implémentation, les tests et le
  déploiement. Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-24** — ce fichier et son sidecar déposés dans le sas d'arrivée du
  pilot `digit-ai-factory/input/00-retours/_arrivee/`, empreintes SHA-256 comparées des 2 côtés
  après la copie. L'original reste ici, historique du produit.

---

## digit-ai-page-html (`digit-ai-page-html`)

La capture par section, que le socle prescrit pour la revue de lecture, peint le bandeau collant
de la page au milieu de la section, et ce qui se trouve dessous ne se lit plus.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-25 | mineur | générique | `render_page.py --sections "<sélecteur>"` capture une section plus haute que la fenêtre avec le **bandeau collant de la page peint dans l'image**, à la hauteur où se trouvait le haut de la fenêtre : il y masque le contenu. Mesuré le 24/09 sur la vue « Démarrer un projet » du guide, rendue seule : à **1920 px**, 4 lignes sur 7 du tableau des champs de la fiche produit (« Cible », « Job principal », « Palier visé », « Ton de marque ») sont sous le bandeau ; à **390 px**, la dernière ligne d'un paragraphe du chapitre suivant. La même section, capturée avec le bandeau rendu statique, montre les 7 lignes. `render_page` rend **PASS, 0 bloquant** et n'annonce rien : la capture est la matière de la revue, et c'est elle qui cache | avant chaque capture de section, rendre statiques, ou masquer, les éléments `position: sticky` ou `fixed` qui ne sont pas dans la section, puis les rétablir ; nommer ces éléments dans la sortie. Fixture rouge : une page au bandeau collant et une section de 3 écrans de haut, dont une ligne repère se trouve sous le haut de la fenêtre au moment de la capture ; verte si la ligne repère est lisible dans l'image |

### RD-25 — Une capture de section où le bandeau collant cache le contenu

**Le fait mesuré.** Page du guide développeur, vue `G0` rendue seule, bandeau
`header.bandeau` en `position: sticky`. Commande :
`render_page.py <page> --widths 1920,390 --sections "#g0-9-…, #g0-lancer-…"`. Les deux captures de
section à 1920 portent, au tiers de leur hauteur, le bandeau entier : logo, champ de recherche,
bouton de thème et onglets. Le tableau des 7 champs de la fiche produit n'y montre que 3 lignes.
Les tuiles d'écran de la même exécution (tuiles 5 et 6 à 1920), et une capture Playwright de la
même section avec `header.bandeau{position:static}`, montrent les 7 lignes. Le masque se reproduit
à l'identique sur une seconde exécution, lancée après une correction du texte de la section. Verdicts de la page : `check_html` PASS
(42 règles, empreinte `80a50927d99d`), `render_page` PASS 0 bloquant sur 7 largeurs,
`run-oracles-design` PASS 9/9.

**Pourquoi c'est un défaut du socle.** Le gabarit `gabarit-revue-de-lecture.md` prescrit « une
capture par section » comme matière de la revue, et le boilerplate du socle pose lui-même un
bandeau collant. Toute page qui suit le socle expose donc sa revue à ce masque, et rien ne dit
au lecteur qu'une partie de l'image ne montre pas la page.

**Ce que le produit a fait chez lui.** Il a relu les lignes masquées sur une seconde capture,
bandeau rendu statique, et l'a déclaré dans sa revue
(`forge/travaux/REVUE-20260924f-guide-developpeur.md`). Le masque reste sur toute autre revue.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un titre de pas qui commence par un chiffre (« 4 règles… ») ne serait pas promu en titre par le générateur, qui exige une majuscule initiale, alors que le plancher d'écriture veut les valeurs en chiffres | titre reformulé, « Les exigences de la chaîne » | non | garde propre au générateur du guide |
| Les 2 prompts du guide qui invoquent la chaîne de fabrication n'ont pas la seconde ligne que son `README.md` déclare obligatoire | non corrigée, soumise au porteur (RAF-114) | non | les prompts sont ceux du porteur ; la règle existe déjà chez la chaîne |
| `GDE0601-R02`, cité dans la vue, ne s'ouvre pas en fiche | non corrigée, consignée au registre du produit (RAF-089) | non | défaut du générateur du guide |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le livrable est le guide
développeur, rendu par le générateur du produit.

## Confirmations positives

- **`oracle-ecriture` a refusé ce qu'il fallait** : un en-tête de colonne à tournure d'annonce et
  des valeurs en lettres dans le brouillon, puis 2 titres de la revue ; l'oracle passe après
  correction, et ses comptes sur la source du guide sont identiques avant et après l'ajout.
- **Les tuiles d'écran de TF-1131** ont montré ce que la capture de section cachait.
- **`run-oracles-design` est stable** : 9 oracles verts, 10 avertissements `oracle-tokens` et 9
  `oracle-taste`, les mêmes comptes qu'aux indices précédents.

## Ordre recommandé

1. **RD-25**, seul retour du lot : neutraliser les éléments collants hors de la section avant la
   capture, les nommer dans la sortie, et poser la fixture à ligne repère.

## La règle qui aurait évité le retour

- **RD-25** — la règle existe : la revue de lecture lit la page « comme le destinataire », sur les
  captures que le socle prescrit (`gabarit-revue-de-lecture.md`) ; une capture qui ne montre pas
  la page ne sert pas cette règle. Classe : `preuve-produite-mais-illisible`.
