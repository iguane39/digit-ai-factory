# Lot de retours — Produit-64 → digit-ai-factory — 2026-10-01, indice c

**Émetteur** : produit `Produit-64` · **Cible** : le pilot `digit-ai-factory` (bibliothèque
de gabarits, famille `gd-guide-de-reference`) · **Origine** : la revue de lecture du guide
développeur `20261001b`, faite le 01/10/2026 par une session de ce produit.

Ce lot porte **2 retours**, mesurés pendant cette revue puis reproduits sur le générateur de la
famille. Il porte aussi **1 rattachement** : le retour RA-6 du lot `20261001a` se rapporte à un item
déjà au registre.

- **Contexte** : décision du porteur du 01/10/2026 — l'approbation d'environnement avant
  l'application d'un plan n'est plus exigée sur `env/dev` ni sur `env/uat`. Le rendu `20261001b` du
  guide a suivi, avec sa revue de lecture obligatoire (TF-0422). Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-01** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-factory (`digit-ai-factory`)

Les 2 défauts vivent dans la coquille et le générateur de la famille `gd-guide-de-reference`, hissée
depuis ce produit le 24/09 (RT-22) : chaque instance de la famille en hérite.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-29 | majeur | générique | **Le bandeau collant de la coquille n'a pas de plafond de hauteur : avec 14 vues, il garde 615 px sur 844 au téléphone, et il ne reste que 229 px pour lire.** Mesuré le 01/10/2026 sur le générateur de la famille, `gabarits/documents/guide-de-reference/generateur/construire-guide.py` (pilot à `4924bb89`), après un défilement de 3 000 px, dans une fenêtre de 390 × 844. `INSTANCE.md` rendue telle quelle (5 vues) : bas du bandeau à 256 px, soit 30 % de l'écran. La même source plus 9 vues minimales aux libellés du guide de ce produit (14 vues) : 615 px ; puis 286 px à 768 × 1024 et 196 px à 1280 × 800. Le guide de ce produit, rendu par son propre générateur avec la même coquille : 717 px sur 844, 127 px de lecture, mesure inchangée depuis le 24/09. **Cet item se rapporte à `TF-1355`** (candidat, lot de ce produit du 24/09, RD-24), qui vise l'oracle : `oracle-mobile` ne mesure pas cette part d'écran. Celui-ci vise la coquille elle-même : `composants/coquille-vues.css` pose `position: sticky; top: 0` à toutes les largeurs, et la barre des vues se replie en rangs sans borne. Le plafond de 25 % que `TF-1355` propose refuserait déjà l'instance de la famille. Aucune capture d'élément ne le montre : `render_page` neutralise les éléments collants le temps d'une capture (règle de V9, TF-1192), et la capture pleine page ne le peint qu'en tête. | Au-dessous de 760 px, que le bandeau cesse d'être collant, ou que la barre des vues tienne en une rangée défilante ou derrière un menu. Puis une fixture de la famille à 14 vues, jugée par la règle que `TF-1355` propose. Règle qui aurait évité le retour : tout élément collant a un plafond de hauteur à chaque largeur, mesuré après défilement — classe proposée `bandeau-collant-sans-plafond`. |
| RT-30 | mineur | générique | **Une amorce en gras suivie d'un deux-points devient un titre de pas, et son paragraphe s'ouvre sur « : ».** Reproduit le 01/10/2026 sur le même générateur : `INSTANCE.md` plus le paragraphe « **Ce qui diffère d'un environnement à l'autre** : les noms, les secrets, et l'approbation avant déploiement, exigée en production seulement. » rend `<h4 class="pas">…Ce qui diffère d'un environnement à l'autre</h4>` suivi de `<p>: les noms, les secrets, …</p>`. Cause : dans `promouvoir_pas`, la garde `suite_continue` teste `net[0] in ",;" or net[0].islower()`. Elle écarte la virgule et le point-virgule, le cas du 22/09 (« un paragraphe ouvrant sur une virgule »), mais pas le deux-points ; le reste, `m.group(2).strip()`, garde son « : ». Chez ce produit, dont le générateur porte la même garde : 6 paragraphes ouverts par « : » dans le guide servi `20261001b`, 5 au `20260924f`. Aucun oracle ne les voit : `check_html` PASS sur 42 règles, `render_page` PASS, forge-design 9/9 sur ce guide. | Que la garde tienne l'invariant qu'elle protège — le corps d'un pas ne s'ouvre jamais sur une ponctuation — plutôt que la liste des signes déjà vus : retirer le deux-points de tête du reste, ou laisser en gras une amorce suivie d'un deux-points, qui est une étiquette et non un titre. Une fixture à double sens au `--self-test` : la virgule du 22/09 toujours écartée, et aucun `<p>:` sur l'amorce à deux-points. Règle qui aurait évité le retour : une garde dont le déclencheur est une liste fermée — classe proposée au lot du 22/09, `regle-a-vocabulaire-ferme-muette-hors-liste`. |

**Portée** : générique — toute instance de la famille `gd-guide-de-reference` y est exposée, et le
guide de ce produit porte les deux défauts.

## Rattachement — RA-6 du lot `20261001a` se rapporte à `TF-1282`

Le retour RA-6 du lot `Produit-64 - RETOURS - 20261001a`, remis ce matin, décrit le défaut
de `TF-1282` : candidat, lot de ce produit du 21/09, RD-14. `render_page.py --sections` ne capture
pas une section qui vit dans un onglet masqué : `TimeoutError`, aucune image. Ce n'est pas un défaut
neuf, c'est sa mesure du 01/10 : il tient toujours, au délai de 240 000 ms comme à 30 000 ms.

RA-6 aurait dû citer `TF-1282`, comme le gabarit de lot le demande, et le lot remis ne se modifie
pas. À l'ingestion, RA-6 gagne donc à rejoindre `TF-1282` plutôt qu'à ouvrir un item. S'il a déjà
reçu son id, ce produit le rectifiera par la voie `rectifie`, nature `annule`, dans un lot suivant.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La revue de lecture du `20261001b` déclarait 2 constats à 390 px que ses captures ne prouvaient pas : la capture du séquencement s'arrêtait à l'étape 4 de son schéma, et celle du schéma du pipeline unique ne laissait lire aucun libellé | figure et paragraphe recapturés à part, écran du téléphone lu à part ; constats réécrits sur ce qui se voit | non | rien de généralisable, parce que le contrôle prescrit a tenu : la revue a été relue capture par capture avant d'être jugée, et l'outil en défaut est un script de cette session, pas un outil du socle |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le guide reste rendu par le
générateur propre au produit, `tools/construire-reference-developpeur.py`. L'adoption de la famille
reste ouverte au registre du produit (RAF-125). RT-29 et RT-30 ont été reproduits sur le générateur
de la famille, à partir d'une copie de travail de son `INSTANCE.md`, gardée hors dépôt.

## Documents mûrs

Aucun document mûr nouveau sur ce lot. Relevé `LOT-MURS` du 01/10/2026
(`node forge/retours/oracle-lot.mjs --murs .`) : 8 documents d'`output/` à 5 versions datées ou
plus, les mêmes qu'au lot `Produit-64 - RETOURS - 20260924e`, qui les déclare. Le guide
développeur en compte 25 (dernière `20261001b`), le modèle de rapport d'audit 18 (dernière
`20261001a`).

## Confirmations positives

- `check_html.py`, `check_completude.py`, `render_page.py` sur 6 largeurs et
  `run-oracles-design.mjs` ont rendu au `20261001b` les mêmes verdicts et les mêmes relevés qu'au
  `20261001a` et au `20260924f` : la retouche n'a rien dégradé de ce qu'ils mesurent.
- `allouer-indice.mjs` a rendu l'indice `c` : le `b` avait été remis 5 minutes plus tôt par une
  autre session de ce produit, et aucun des deux lots n'a écrasé l'autre.

## Ordre recommandé

1. RT-29 — au téléphone, chaque instance à plusieurs vues perd sa surface de lecture, et la famille
   est la forme de référence des guides depuis R-57.
2. RT-30 — un correctif d'une ligne et une fixture.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-29** — aucune classe existante ne convient : `page-html-sticky-superposes` juge deux éléments
  collants qui se recouvrent, pas la part de l'écran qu'un seul retire à la lecture. Clé proposée
  `bandeau-collant-sans-plafond`, famille `page-html-socle`, libellé « Un bandeau collant croît avec
  son contenu (onglets repliés en rangs) sans plafond de hauteur : au téléphone il garde l'écran et
  ne laisse qu'une bande de lecture, et les captures d'élément, qui neutralisent les éléments
  collants, ne le montrent jamais ».
- **RT-30** — la classe qui convient est celle que le lot `Produit-64 - RETOURS - 20260922b`
  a proposée, et que le référentiel du pilot ne porte pas encore : clé
  `regle-a-vocabulaire-ferme-muette-hors-liste`, famille `regle-morte`, libellé « Une règle dont le
  déclencheur est une liste FERMÉE de termes rend PASS sur tout cas hors liste, y compris ceux
  qu'elle existe pour attraper, et son vert ne se distingue pas d'une absence de défaut ». Ici, le
  déclencheur est une liste fermée de signes, la virgule et le point-virgule, muette sur le
  deux-points.
