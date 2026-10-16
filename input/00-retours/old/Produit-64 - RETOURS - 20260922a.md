# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-22, indice a

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html` ·
**Origine** : ajout d'une vue au guide développeur. En rejouant les oracles de `digit-ai-forge-design`
au-delà des quatre que le socle nomme, un défaut **déjà livré** est apparu.

Ce lot porte **1 retour**.

- **Contexte** : ajout d'une vue « Installation et configuration » au guide développeur Client-A,
  indice `20260922a`. Hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-22** — les 2 fichiers déposés dans le sas d'arrivée du pilot `digit-ai-factory/input/00-retours/_arrivee/` (ignoré par git). Empreintes SHA-256 vérifiées identiques entre l'original et la copie du sas, pour les 2 fichiers ; celle du sidecar, stable, est `9788de92…`. L'empreinte du lot n'est pas citée ici : elle porterait sur un fichier que cette ligne même modifie — la vérification a été faite après écriture, sur les deux copies. L'original reste ici, historique du produit. L'ingestion au registre du pilot appartient à l'humain : aucun identifiant `TF-####` n'est frappé tant qu'elle n'a pas eu lieu.

---

## RD-16 — Le périmètre de non-mesure du socle nomme QUATRE oracles de design ; le lanceur de la forge en joue NEUF, dont trois seulement en commun, et c'est l'un des six muets qui était rouge sur une page livrée

### Le fait mesuré

`check_html.py` et `render_page.py` publient tous deux, en fin de verdict, la ligne suivante —
mot pour mot, dans les deux sorties :

> **LES QUATRE ORACLES DE `digit-ai-forge-design` JUGENT CETTE MÊME PAGE ET N'ONT PAS ÉTÉ JOUÉS
> ICI** : oracle-slop (S1–S10) · oracle-tokens (T1–T8) · oracle-mobile (M1–M8) · oracle-images
> (I1–I7). […] Les jouer : `node <racine digit-ai-forge-design>/oracles/run-oracles-design.mjs
> <page.html>`

Le geste prescrit est juste ; l'inventaire ne l'est plus. Relevé le 2026-09-22 sur
`digit-ai-forge-design` v1.17.2-51-gfa48dfc :

| Ce que le socle annonce | Ce que `run-oracles-design.mjs` joue réellement |
|---|---|
| 4 oracles — slop, tokens, mobile, **images** | **9** — slop, tokens, **motion**, **bascule**, **taste**, mobile, **saisie**, **declencheurs**, **surcouche** ; **images absent** |

Les **six** que le socle ne nomme pas sont `oracle-motion`, `oracle-bascule`, `oracle-taste`,
`oracle-saisie`, `oracle-declencheurs` et `oracle-surcouche`. **Et l'écart joue dans les deux
sens** : `oracle-images`, que le socle nomme, ne figure pas dans la liste que le lanceur exécute —
son fichier `oracles/oracle-images.mjs` existe pourtant. Les deux inventaires ne se recoupent que
sur trois oracles : slop, tokens, mobile.

**Et c'est l'un d'eux qui était rouge sur une page déjà livrée.** Mesure faite dans les deux sens,
sur les deux indices :

| Page | `check_html` | `render_page` | les 4 oracles nommés | `run-oracles-design.mjs` (9) |
|---|---|---|---|---|
| `Client-A - Guide développeur POC-to-Prod - 20260921e.html`, **livrée le 21/09** | PASS | PASS | PASS | **FAIL — `oracle-surcouche` SC4, 2 écarts DURS** |
| `Client-A - Guide développeur POC-to-Prod - 20260922a.html`, après correction | PASS | PASS | PASS | PASS, 0 écart dur |

Les deux écarts SC4, relevés tels quels : *« aucune déclaration CSS `color-scheme` pour le thème
de base : les composants que le navigateur peint lui-même (top-layer, contrôles natifs, barres de
défilement, `::backdrop`) suivent le réglage du système »* et *« un thème sombre est déclaré […]
mais aucun `color-scheme: dark` ne l'accompagne : la page bascule, les composants natifs restent
clairs »*. Le défaut est réel et visible : sur une page qui propose une bascule de thème, la barre
de défilement et les contrôles natifs restaient clairs en thème sombre. Il a été livré.

### Pourquoi ce n'est pas la classe « périmètre de non-mesure non publié »

Le bloc **est** publié — c'est précisément l'acquis de `TF-1148` et `TF-1141`, et il a bien fait
son travail : c'est en le lisant que ce produit a joué la forge design. Le défaut est ailleurs, et
il est plus discret : **le bloc énumère**, et son énumération a vieilli pendant que la forge
citée grandissait. Un lecteur diligent qui fait exactement ce que la ligne dit — « jouer les
quatre » — reste aveugle à six oracles, dont celui qui était rouge, et en joue un septième
qui n'est plus au lanceur.

*Un périmètre de non-mesure qui nomme une liste devient faux dès que la liste bouge chez l'autre,
et rien ne relie les deux.* C'est la même cause que TF-0918 côté restitution — un compteur écrit
en dur ailleurs que là où il se calcule — appliquée à un contrat entre deux forges.

### Ce que ce produit a corrigé chez lui, et qui ne répare pas la cause

Le compteur « douze vues » du sommaire de ce guide était écrit en dur dans son générateur ; il se
**déduit** désormais du nombre de vues, pour la même raison. C'est une correction locale : elle ne
dit rien de l'inventaire du socle, qui est le sujet de ce retour.

### La règle qui aurait évité le retour

Un périmètre de non-mesure qui RENVOIE vers un autre outil nomme le **point d'entrée** de cet
outil, jamais l'inventaire de ce qu'il contient — ou bien il lit cet inventaire à l'exécution.
Une liste recopiée d'une forge à l'autre se périme en silence, et son verdict vert se lit comme
une absence de limite alors qu'il n'est qu'une absence de mise à jour.

### Proposition esquissée, jamais obligatoire

Trois gestes, du moins cher au plus utile.

1. **Ne plus compter dans la prose.** Remplacer « LES QUATRE ORACLES » par « LES ORACLES DE
   `digit-ai-forge-design` », et garder le geste — qui est déjà le bon : `run-oracles-design.mjs`
   les joue tous, quel que soit leur nombre. Coût : deux chaînes dans deux scripts.
2. **Lire l'inventaire au lieu de l'écrire.** Le socle sait déjà résoudre la racine de la forge
   design pour composer la commande ; il peut y lister `oracles/oracle-*.mjs` et nommer ce qu'il
   trouve. Le bloc devient exact par construction, et c'est le mécanisme que `--familles` de
   `render_page.py` applique déjà à ses propres familles de constats — « un consommateur la LIT
   au lieu d'en tenir une copie ».
3. **Une fixture à double sens sur le contrat lui-même** : un faux `digit-ai-forge-design`
   portant 3 oracles et un autre en portant 5, et le bloc de non-mesure du socle qui doit nommer
   3 puis 5. C'est la seule forme qui prouve que le bloc lit l'autre forge au lieu de réciter.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-16 | majeur | générique | Le périmètre de non-mesure de `check_html.py` et `render_page.py` annonce **4 oracles** de `digit-ai-forge-design` ; `run-oracles-design.mjs` en joue **9** (relevé du 22/09 sur v1.17.2-51-gfa48dfc). Les deux inventaires ne se recoupent que sur **3** oracles, et `oracle-images` que le socle nomme n'est pas au lanceur. `oracle-surcouche`, absent des 4 nommés, rend **FAIL, 2 écarts durs SC4** sur `Client-A - Guide développeur POC-to-Prod - 20260921e.html`, **page livrée le 21/09** avec `check_html` PASS, `render_page` PASS et les 4 oracles nommés PASS. Défaut réel : sans déclaration CSS `color-scheme`, barres de défilement et contrôles natifs restent clairs quand la page bascule en thème sombre | cesser de compter dans la prose (« LES ORACLES DE… ») ; lister `oracles/oracle-*.mjs` à l'exécution comme `--familles` le fait déjà pour les familles de constats ; fixture à double sens sur une forge factice à 3 puis 5 oracles |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le compteur « douze vues » du sommaire du guide était écrit en dur dans le générateur ; un onglet ajouté l'aurait laissé faux sans qu'aucun oracle ne le dise | il se déduit de `len(vues)` | **non** — c'est la même cause que RD-16 (un compte recopié loin de l'endroit où il se calcule), mais le défaut est propre à ce générateur et il est clos |
| `color-scheme: light` / `dark` absents des blocs de jetons du générateur | les deux déclarations posées ; `run-oracles-design.mjs` FAIL 2 durs → PASS | **non** — c'est le défaut que RD-16 permet de VOIR, pas la cause ; la cause est l'inventaire périmé |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` du pilot sur ce lot.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output/05-Kits/Client-A - Guide développeur POC-to-Prod - 20260922a.html` | aucun — générateur propre au produit | rien de neuf depuis `RD-15` du 21/09 | rien de mesuré : la vue neuve a été lue sur captures, en thème clair et sombre | rien de plus | déjà remonté sous RD-15 |
| `forge/travaux/REVUE-20260922a-guide-developpeur.md` | `gabarit-revue-de-lecture.md` — sans numéro de version affiché | rien de neuf | rien : la porte locale la juge PASS | rien de plus | déjà remonté sous RD-8 |

## Confirmations positives

- **Le bloc de non-mesure a fonctionné** : c'est en le lisant que ce produit est allé jouer la
  forge design, et c'est ce geste qui a trouvé le défaut. Le retour porte sur son inventaire, pas
  sur son existence — la doctrine `quality-oracles` §3 a rendu ici exactement ce qu'elle promet.
- **`run-oracles-design.mjs` est un bon point d'entrée** : un seul appel, neuf oracles, un verdict
  agrégé et le détail par oracle en JSON. Le geste prescrit par le socle était déjà le bon ; seule
  la phrase qui l'introduit comptait à tort.
- **La correction se mesure des deux côtés** : FAIL 2 durs sur l'indice livré, PASS sur le
  suivant, sur les 9 oracles, avec les trois scripts du socle inchangés au vert dans les deux cas.
