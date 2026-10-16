# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-21, indice b

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html` ·
**Origine** : revue de lecture de l'indice `20260921d` du guide développeur, une page à douze
vues dont une seule est peinte à la fois.

Ce lot porte **1 retour**, trouvé en exécutant le geste que le socle prescrit lui-même pour la
revue de lecture obligatoire. La revue a été tenue — mais pas par le chemin prescrit, qui ne
produit aucune image sur une page à onglets, et qui prescrit en échouant un remède sans effet.

- **Contexte** : ajout d'une douzième vue au guide développeur, puis revue de lecture de cette
  vue. Hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-21** — les 2 fichiers déposés dans le sas d'arrivée du pilot `digit-ai-factory/input/00-retours/_arrivee/` (ignoré par git). Empreintes SHA-256 vérifiées identiques entre l'original et la copie du sas, pour les 2 fichiers — lot `a4a0ecfe…`, sidecar `e86fa217…`. L'original reste ici, historique du produit. L'ingestion au registre du pilot appartient à l'humain : aucun identifiant `TF-####` n'est frappé tant qu'elle n'a pas eu lieu.

---

## RD-14 — `--sections` et `--selector` ne capturent PAS un panneau masqué, et perdent au passage la capture de page

### Le fait mesuré

`check_html.py` publie, dans son périmètre de non-mesure, le geste qui produit la matière de la
revue de lecture obligatoire : *« Produire la matière (`render_page.py <page> --sections "…"`) »*.
L'aide de `render_page.py` décrit ce que l'option fait : *« sélecteur CSS des sections à capturer
UNE PAR UNE en plus de la page — un panneau masqué est rendu visible le temps de sa capture »*.

Sur une page à onglets, où une seule vue porte `display: block` et les autres `display: none`,
ce chemin ne rend aucune image. Isolé sur une fixture de 10 lignes, page de **900 px** de haut,
2 sections dont une masquée :

| Ce qui est demandé | Résultat | Images produites |
|---|---|---|
| aucune option de section | **PASS**, capture faite | `…-w1280.png` |
| `--sections 'section.vue.active'` — la section **visible** | **PASS**, capture faite | `…-w1280.png` + `…-w1280-section01.png` |
| `--sections 'section.vue[data-vue=b]'` — la section **masquée** | `capture impossible : TimeoutError`, 30 000 ms | **aucune** — la capture de page est perdue elle aussi |
| `--sections 'section.vue'` — les 2, dont la masquée | `capture impossible : TimeoutError`, 30 000 ms | **aucune** |

Le même comportement sur le livrable réel, une page de 2 297 à 2 323 px : `--sections` à
30 000 ms, puis à **180 000 ms**, puis `--selector` sur la vue masquée à 30 000 ms — 3 échecs,
`TimeoutError` à chaque fois, aucune image. La même page sans option de section rend ses 7
largeurs en quelques secondes.

### Pourquoi c'est un défaut du socle, et pas de la page

Trois raisons, dans cet ordre.

**Le remède prescrit est faux, et il coûte cher à réfuter.** Le message dit : *« Augmenter
`--timeout`, réduire `--scale`, ou assumer l'écart déclaré. »* Les trois sont sans effet : un
élément qui n'a pas de boîte n'en aura pas davantage après 180 secondes, et `--scale` ne change
rien à une hauteur nulle. Il a fallu 3 exécutions, dont une de 3 minutes, pour l'établir.

**L'échec d'une section emporte la capture de page.** C'est la conséquence la plus lourde : un
auteur qui suit le geste prescrit perd aussi l'image qu'il aurait eue sans lui, donc V5 et V6
passent en non jugées — alors qu'elles étaient jugeables une commande plus tôt.

**Le verdict reste PASS.** L'outil rend **PASS** dans les 4 cas du tableau, y compris ceux
où il n'a produit aucune image. Le périmètre de non-mesure le dit, et c'est honnête — mais un
verdict vert sur une revue de lecture qui n'a rien pu lire est exactement ce que TF-0422
cherchait à empêcher.

### Le contournement fabriqué pour obéir

Épingler la vue sur une **copie de travail**, hors de `output/`, par une surcharge CSS injectée
avant `</head>` :

```css
.js .vue { display: none !important }
.js .vue[data-vue="composants"] { display: block !important }
```

Cette copie n'est pas le livrable : elle en diffère d'une règle de style, et l'onglet actif y
reste surligné sur la mauvaise entrée. La revue le déclare comme une limite de capture. C'est un
contournement fabriqué par un auteur de bonne foi pour exécuter une obligation du socle.

### La règle qui aurait évité le retour

Aucune clé du référentiel ne convient. La plus proche, `regle-qui-interdit-son-propre-remede`,
décrit un contrôle qui refuse la correction qu'il recommande ; ici le contrôle ne refuse rien —
il prescrit un chemin qui n'atteint pas sa cible, et un remède sans effet quand ce chemin échoue.

Classe proposée : **`oracle-chemin-prescrit-inoperant-sur-sa-cible`**, famille
**`contrat-interface-forge`** — *le chemin d'usage PRESCRIT par un oracle pour produire sa matière
échoue sur la cible même qu'il nomme, et son message d'échec prescrit un remède sans effet ;
l'auteur de bonne foi fabrique un contournement pour obéir, et ce contournement n'est pas le
livrable.*

### Proposition esquissée, jamais obligatoire

Trois gestes, du moins cher au plus utile.

1. **Nommer la cause au lieu du délai.** Un élément dont la boîte mesure 0 × 0, ou dont un
   ancêtre porte `display: none`, se déclare *section non peinte* — pas *TimeoutError*. Le
   message prescrit alors le bon geste, et l'auteur ne perd pas 3 minutes.
2. **Ne pas perdre la capture de page.** L'échec d'une section est un constat de section ; la
   capture pleine page reste due.
3. **Rendre la section visible pour de bon**, comme l'aide le promet : poser
   `display: block !important` sur la cible et ses ancêtres masqués le temps de la capture, puis
   restaurer — le geste que ce produit a dû écrire à la main.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-14 | majeur | générique | `--sections` et `--selector` sur un panneau masqué rendent `TimeoutError` et **aucune** image, et font perdre la capture de page ; verdict **PASS** malgré tout. Fixture de 10 lignes, page de 900 px : la section **visible** passe, la **masquée** expire à 30 000 ms. Sur le livrable réel : 3 échecs à 30 000, 180 000 et 30 000 ms | déclarer *section non peinte* au lieu de *TimeoutError* ; garder la capture de page ; démasquer la cible et ses ancêtres le temps de la capture |

## Remarques restées au produit

3 constats de cette séance restent ici : ils portent sur la source du guide, pas sur le socle.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un onglet ajouté sans porte d'entrée : le tableau d'accueil ne menait pas à la nouvelle vue, et la carte de couverture ignorait son sujet | 2 lignes ajoutées, « Neuf portes » → « Dix portes », « onze sujets » → « douze sujets » | non | défaut de rédaction propre à ce guide ; aucun oracle de forme ne peut savoir qu'une vue mérite une entrée au sommaire d'accueil — c'est la revue de lecture qui l'a vu, et c'est son rôle |
| 2 chapeaux de vue au-delà du plafond de 60 mots | scindés en 2 paragraphes chacun | non | `check_html` L7 l'a vu et l'a refusé : le socle fait son travail, rien à remonter |
| 4 en-têtes de colonne PROMETTAIENT au lieu de nommer | renommés : Rôle · Effet · Réponse · Périmètre · Le symptôme · La parade | non | `check_markdown --style` EC-8 l'a vu et l'a refusé ; le socle fait son travail |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` du pilot sur ce lot —
vérifié le 2026-09-21 : les pièces de cette séance sont un lot de retours, une revue de lecture
et une page HTML générée.

**Un gabarit du socle a été employé** pour la 5e fois : `references/gabarit-revue-de-lecture.md`,
toujours sans identifiant ni version affichée en en-tête ; le rattachement se fait par le chemin
du gabarit et la date de lecture, 2026-09-21.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `forge/travaux/REVUE-20260921d-guide-developpeur.md` | `gabarit-revue-de-lecture.md` — sans numéro de version affiché | de quoi déclarer une **limite de capture** : le gabarit prévoit les largeurs lues, pas le cas où la matière a dû être fabriquée autrement que par le chemin prescrit | rien : la revue a été tenue, la porte locale la juge PASS | un paragraphe « Limite de capture, déclarée », placé avant les constats | générique — toute page à onglets rencontrera le même besoin |

## Confirmations positives

- **Le contrôle local de revue de lecture a fait son travail.** `verifier-revue-de-lecture.mjs`
  a refusé l'indice `20260921d` tant que sa revue n'existait pas, l'a acceptée ensuite, et c'est
  ce refus qui a mené à la découverte de RD-14 : sans obligation de capturer, personne n'aurait
  essayé de capturer une vue masquée.
- **L7 et EC-8 ont chacun trouvé un défaut réel sur du texte neuf**, tous deux invisibles à la
  relecture : 2 chapeaux au-delà du plafond, 4 en-têtes de colonne formulés en promesse.
- **Le socle tient sur une page de 12 vues** : `check_html` PASS aux 42 règles, les 4 oracles de
  la forge design PASS, `render_page` PASS aux 7 largeurs en états ouverts.
