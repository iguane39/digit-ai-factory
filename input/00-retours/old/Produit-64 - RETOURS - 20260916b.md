# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-16, indice b

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html` ·
**Origine** : suite immédiate du lot `20260916a`, sur mandat du porteur Client-A — « remonter à la
Factory encore une fois », décision du 2026-09-16 accompagnant D-6 option (b).

Les 2 retours de ce lot ont été trouvés **pendant l'application de la décision D-6**, en
jouant pour la première fois les oracles de `digit-ai-forge-design` sur une page que le socle
`digit-ai-page-html` déclarait conforme, puis en mesurant ce qu'aucun des 6 oracles ne
mesure. Le second est le plus grave de tous les retours remontés par ce produit : **une page
amputée des 3 quarts de son texte passe les 6 oracles.**

- **Contexte** : application d'une décision humaine sur un livrable documentaire, hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## RD-9 — Le socle nomme 3 oracles et jamais les 4 de la forge design ; une page verte aux 3 était rouge à 3 des 4

### Le fait mesuré

`digit-ai-page-html/SKILL.md` prescrit la chaîne de vérification d'une page : `check_html.py`,
`render_page.py`, `check_markdown.py`, puis la revue de lecture. **Aucune de ses références ne
nomme `digit-ai-forge-design`**, dont les oracles vivent pourtant dans le même écosystème et
jugent le même artefact. Un producteur qui suit le socle à la lettre ne les joue jamais.

Joués le 16/09 sur le guide développeur, que les 3 scripts du socle déclaraient PASS :

| Oracle de `digit-ai-forge-design` | Verdict | Ce qu'il a trouvé |
|---|---|---|
| `oracle-slop` | **FAIL** | 4 règles dures S1 — filets latéraux de 2, 3 et 4 px, marqueurs de page générée |
| `oracle-tokens` | **FAIL** | 59 écarts durs, dont 3 bloquants T1 (couleurs en dur `#FFFFFF`, `rgba(15,23,42,.55)`) et 56 T3 (espacements hors échelle 4 pt) |
| `oracle-mobile` | **FAIL** | M3 bloquant — barre fixe collée au bord haut sans `env(safe-area-inset-*)` : passage sous l'encoche |
| `oracle-images` | PASS | — |

3 verdicts rouges sur 4, sur une page que le socle venait de déclarer conforme, et
aucun de ces 3 défauts n'est visible aux 3 scripts du socle : le filet de 3 px ne
déborde pas, la couleur en dur contraste correctement, la barre fixe ne recouvre rien au
rendu de bureau.

### Pourquoi ce n'est pas un défaut de l'un ni de l'autre

Les 2 forges ont raison chacune dans son domaine, et c'est ce qui rend le cas intéressant :
le défaut est **entre** elles. Le socle qu'un producteur consomme pour fabriquer une page ne
dit pas que 4 autres oracles jugent cette même page. Le producteur ne peut pas jouer ce
qu'il ne sait pas exister, et il croit sa chaîne complète parce qu'elle est écrite comme telle.

### La règle qui aurait évité le retour

`controle-ecrit-non-cable-a-son-etape` (registre, famille `skill-ou-oracle-non-invoque`) :
**tout contrôle livré nomme l'étape, le hook ou la recette qui l'appelle, et un relevé vérifie
que l'appel existe.** Loi transverse n° 1 — toute affordance est câblée ou n'existe pas. Le
geste, peu coûteux : la section « Référentiel détaillé » de `digit-ai-page-html/SKILL.md`
nomme les 4 oracles de `digit-ai-forge-design`, avec la ligne de commande qui les joue,
au même endroit qu'elle nomme déjà ses 3 scripts et sa revue de lecture.

---

## RD-10 — Une page amputée des 3 quarts de son texte passe les 6 oracles

### Le fait mesuré

Pendant cette repasse, une édition du générateur a sorti un `append` de sa boucle de
regroupement de prose. Conséquence : **toute la prose sauf le dernier fragment de chaque
chapitre a disparu de la page rendue.** Le fichier livrable est passé de 11 996 à environ
3 000 mots visibles, et les 9 encadrés « Exemple de lecture » du guide sont tombés à zéro.

Les 6 oracles ont été joués sur cette page amputée :

| Oracle | Verdict sur la page amputée |
|---|---|
| `check_html.py` (40 règles) | PASS, puis FAIL — mais sur L7 et L10 seulement, c'est-à-dire sur l'ABSENCE d'un chapeau et d'un exemple de lecture, jamais sur la disparition du texte |
| `render_page.py` (7 largeurs) | **PASS** |
| `check_markdown.py --style` | **PASS** — il juge la SOURCE, qui n'a pas bougé |
| `oracle-slop` | **PASS** |
| `oracle-tokens` | **PASS** |
| `oracle-mobile` | **PASS** |

Une page amputée n'a en effet ni débordement, ni contraste faible, ni marqueur de page
générée, ni couleur en dur, ni barre fixe mal posée. Elle est **parfaitement conforme et
presque vide.** Le défaut n'a été trouvé qu'en cherchant pourquoi `check_html` réclamait des
exemples de lecture absents — un symptôme indirect, sur 2 règles qui parlent d'autre chose.

### Ce que l'écart révèle

Les 6 oracles mesurent la FORME : débordement, contraste, recouvrement, jetons, marqueurs,
mesure de lecture. Aucun ne mesure la **COMPLÉTUDE** : que la page rendue porte ce que sa
source dit. C'est une grandeur corrélée prise pour l'invariant — tant qu'un générateur ne perd
rien, la forme et le contenu vont ensemble, et personne ne voit la substitution ; le jour où
la corrélation se rompt, 6 verdicts verts couvrent une page vide.

Ce cas est le plus dur de tous ceux remontés par ce produit parce qu'il ne dépend d'aucune
finesse : il ne demande pas de juger un chapeau, une pertinence ou une lisibilité. Il demande
de **compter**.

### La règle qui aurait évité le retour

`controle-vrai-sur-le-mauvais-invariant` (registre, 2026-09-09) : **un contrôle mesure
l'INVARIANT qu'il protège, jamais une grandeur qui lui est seulement corrélée.** Le geste, et
il est déjà écrit et joué chez nous — il est offert au socle tel quel :

```
rendu  = mots visibles du corps HTML (balises, commentaires, scripts et styles retirés)
source = mots visibles du Markdown dont il sort
si rendu < source : ARRÊT — la page porte moins de texte que sa source
```

Le seuil est volontairement grossier : un rendu porte EN PLUS les libellés du générateur
(menus, inventaires, légendes de schéma), il est donc normalement plus riche que sa source.
Un rendu plus pauvre est une perte, sans jugement à rendre. Implémentation et banc rouge/vert
chez nous dans `tools/construire-reference-developpeur.py`, fonctions `compter_mots_visibles`
et `verifier_completude` — rendu amputé : arrêt code 4 ; rendu complet : passe.

Le même contrôle vaudrait pour toute chaîne qui transforme une source en page : un gabarit
rendu, une synthèse publiée, un rapport d'audit.

---

## Remise

Ce lot vise **le socle `digit-ai-page-html`** pour ses 2 retours. Remise dans
`input/00-retours/_arrivee/` du pilot. Le sidecar
`Produit-64 - RETOURS - 20260916b.tf.jsonl` porte les 2 lignes, chacune avec
`racine_produit`, conformément à la règle 8 du `CLAUDE.md` de ce produit.

**Aucune clé de classe n'est proposée à la création** : les 2 retours portent des clés
existantes — `controle-ecrit-non-cable-a-son-etape` et `controle-vrai-sur-le-mauvais-invariant`.

## Ordre recommandé

Les 2 retours sont classés par gravité, et l'anaphore est assumée : chaque ligne s'ouvre sur
l'identifiant du retour parce que c'est lui qu'on vient chercher ici.

1. **RD-10**, sans comparaison : 6 verdicts verts sur une page vide est le pire état qu'une
   chaîne de vérification puisse atteindre, et le geste tient en 3 lignes — compter.
2. **RD-9**, immédiatement après : 3 oracles rouges sur 4, pour une page déclarée
   conforme, et le geste est une ligne de référence dans un fichier de skill.

---

## Remarques restées au produit

2 corrections de cette séance sont restées ici : elles portent sur le générateur de ce
produit, et leur classe est déjà au registre.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Sur une page devenue pleine largeur, une colonne de prose absorbait tout le surplus — 880 px pour des libellés de 20 caractères | une colonne portant un identifiant prend une largeur fixe, celle de son contenu ; les colonnes de prose se partagent le reste au prorata de leur besoin | non | classe `page-html-dictionnaire-colonnes` au registre depuis le 03/09, déjà remontée 2 fois. Une 3e remontée n'apprendrait rien ; le fait sert de preuve à RT-17 du lot `20260915b` |
| La page était plafonnée à 1 520 px et la prose à 1 080, pour un écran de 1 920 | tous les plafonds retirés sur décision du porteur : la page prend 96 % de la fenêtre, la prose remplit la colonne de contenu | **oui, et déjà couvert** | le socle publie son jeton E4 et son plafond V18 de 135 caractères, et V18 ne BLOQUE pas un paragraphe tenu par un conteneur déclaré — elle publie sa mesure. Le mécanisme est juste ; c'est le générateur qui en avait fait une contrainte. Rien à remonter |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` sur ce lot — vérifié le 2026-09-16 : les pièces de cette séance sont un lot de retours, une revue de lecture et une porte, aucune ne sort de la bibliothèque du pilot.

**Un gabarit du socle a été employé** pour la 2e fois : `digit-ai-page-html/references/gabarit-revue-de-lecture.md`, **sans identifiant `gd-…` ni version affichée en en-tête** — c'est précisément ce que le retour de forme ci-dessous signale pour la 4e fois. Le rattachement se fait donc par le CHEMIN du gabarit et par l'empreinte de son contenu au jour de l'emploi : `gabarit-revue-de-lecture.md`, version non affichée, lu le 2026-09-16. Aucun autre document de ce lot ne sort d'un gabarit de `gabarits/documents/`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `forge/travaux/REVUE-20260916a-guide-developpeur.md` | `gabarit-revue-de-lecture.md` — **sans numéro de version affiché** | le gabarit décrit une revue à faire, et ne dit pas COMMENT la rendre opposable : ni convention de nom, ni règle de rattachement au livrable, ni contrôle | rien : la revue a été tenue | une convention de nom (`REVUE-<AAAAMMJJ><indice>-<slug>.md`), une règle de rattachement (la revue NOMME le livrable), et une porte (`tools/verifier-revue-de-lecture.mjs`, banc rouge/vert 9/9, plancher d'entrée en service déclaré) | **générique** — c'est le geste que réclamait RD-8 (la revue de lecture déclarée obligatoire par le socle et jouée par aucun de ses contrôles, huitième retour du lot `20260916a`) ; il est écrit, joué, et offert au socle |

**Retour de forme, pour la 4e fois** : ni `ECRITURE.md`, ni `RETOURS-FORGES.md`, ni
`gabarit-revue-de-lecture.md` n'affichent de numéro de version en en-tête, alors que la règle
R-46 demande de rattacher un retour à « la version affichée en en-tête du document ».

## Confirmations positives

- **La revue de lecture tient sa promesse, et le chiffre le dit** : jouée pour la première fois
  le 16/09, elle a trouvé 7 défauts qu'aucun des 6 oracles ne voyait, puis 4 de plus dans la
  même séance. Le partage mécanique / lecture du socle est juste ; seule son exécution n'était
  pas opposable, et elle l'est maintenant chez ce produit.
- **V18 se comporte exactement comme son code l'annonce** : un paragraphe tenu par un conteneur
  `.lire` n'est jamais compté en défaut, sa mesure est publiée. C'est ce qui a permis de retirer
  un plafond de largeur sans échanger un défaut de lecture contre un rouge d'oracle.
- **Le plancher d'entrée en service marche comme le registre le prescrit** : la porte neuve a
  mesuré son bruit avant de mordre — 25 pages HTML dans `output/`, une seule avec sa revue —
  et déclare les 135 antérieures en `non_juge`, nommées, avec leur raison.
