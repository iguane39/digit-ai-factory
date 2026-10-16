# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-21, indice a

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html` ·
**Origine** : migration des exemptions de recouvrement des 11 schémas du guide développeur, faite
au fil d'un tour de rédaction, comme la décision D-4 option (b) du 16/09 le prescrit.

Ce lot porte **1 retour**, trouvé en exécutant le geste de migration que le socle recommande. La
migration a marché : 366 exemptions en bloc ramenées à 51. Les 51 qui restent ne sont pas un
reste de paresse — elles décrivent une forme que le mécanisme par paire ne sait pas exprimer, et
l'échéance du 16/12 les rendra bloquantes.

- **Contexte** : ajout d'un chapitre au guide développeur, puis migration des exemptions au fil
  de la page rouverte. Hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-21** — les 2 fichiers déposés dans le sas d'arrivée du pilot `digit-ai-factory/input/00-retours/_arrivee/` (ignoré par git). Empreintes SHA-256 vérifiées identiques entre l'original et la copie du sas, pour les 2 fichiers — sidecar `158d2a6c…`. L'original reste ici, historique du produit. L'ingestion au registre du pilot appartient à l'humain : aucun identifiant `TF-####` n'est frappé tant qu'elle n'a pas eu lieu.

---

## RD-13 — La forme par paire de `data-overlap-ok` ne sait pas déclarer un CALQUE, et l'échéance du 16/12 rendra bloquantes des figures justes

### Le fait mesuré

Le socle recense depuis le 16/09 les exemptions de recouvrement posées en forme nue, et donne le
geste : `data-overlap-ok="<id de l'élément recouvert>"`, plusieurs identifiants séparés par des
espaces. Il pose une échéance au **2026-12-16**, après quoi le constat devient bloquant.

La migration a été faite ce jour sur les 11 schémas du guide développeur. Elle a marché, et par
la voie que le socle décrit lui-même comme la bonne : un nœud de schéma — sa boîte et ses textes —
vit dans un groupe portant un `<title>`, et le socle ne juge plus l'intérieur d'un groupe titré.

| Mesure | Avant | Après |
|---|---|---|
| Éléments exemptés en bloc | 366 | **51** |
| Constats V4 sur les 11 schémas, 7 largeurs | non mesurables — tout était exempté | **0** |
| Libellés de flèche jugés | 0 | tous |

Les **51 exemptions restantes portent toutes sur des traits** — les `path` des 2 figures de
branches, où 6 branches se croisent, se dérivent et fusionnent sur 20 moments. Un trait de branche
en croise d'autres par construction, et passe sous les cercles des moments par construction : un
graphe de branches est fait de cela.

### Pourquoi la forme par paire ne peut pas les couvrir

Le mécanisme lit `declare = pa.includes(b.el.id) || pb.includes(a.el.id)` : une déclaration nomme
**l'identifiant de l'élément recouvert**. Pour exempter N traits qui se croisent tous, il faut
donner un identifiant à chacun et lister dans chacun les N−1 autres — soit, sur la figure des
correctifs, 20 identifiants par trait et 400 déclarations pour une seule figure. Ce n'est pas une
difficulté d'écriture, c'est une impossibilité d'expression : la relation à déclarer n'est pas
« A recouvre B », c'est « ces éléments-là se recouvrent entre eux ».

Une tentative a été faite et mesurée avant d'écrire ce retour : déclarer `data-overlap-ok="traits"`
sur chaque trait ne marche pas, puisque aucun élément ne porte `id="traits"` — la déclaration ne
s'apparie jamais et tous les croisements redeviennent des constats.

### L'effet de l'échéance sur une figure juste

Au 16/12, ces 51 exemptions deviennent bloquantes. La figure, elle, sera toujours juste : aucun
libellé ne tombera dans une boîte voisine, et c'est déjà mesuré à 0. Un producteur aura alors
3 issues, et les 3 sont mauvaises : renoncer au graphe de branches, désactiver l'oracle, ou
inventer 400 déclarations que personne ne relira.

### La règle qui aurait évité le retour

`regle-qui-interdit-son-propre-remede` (registre) : **un contrôle qui prescrit un geste de
migration vérifie que le geste couvre les cas qu'il va refuser.** Le geste couvre le cas dominant,
le libellé posé sur sa boîte ; il ne couvre pas le calque, et c'est l'échéance qui le rend visible.

**Geste proposé, 1 ligne dans la sonde.** Deux éléments qui déclarent le **même jeton** s'exemptent
mutuellement, en plus de la forme par identifiant :

```
declare = pa.includes(b.el.id) || pb.includes(a.el.id) || pa.some((x) => pb.includes(x))
```

`data-overlap-ok="calque-traits"` sur les 51 traits les exempte alors entre eux, **et rien
d'autre** : un trait qui recouvrirait un numéro de moment — l'élément qui porte le défaut réel,
lu à l'œil le 17/09 sur les moments 13 et 18 — reste un constat, puisque le numéro ne déclare pas
ce jeton. La propriété que le socle défend est conservée, et la forme devient exprimable.

---

## Remise

Ce lot vise **le socle `digit-ai-page-html`** pour son unique retour. Remise dans
`input/00-retours/_arrivee/` du pilot. Le sidecar
`Produit-64 - RETOURS - 20260921a.tf.jsonl` porte sa ligne, avec `racine_produit`,
conformément à la règle 8 du `CLAUDE.md` de ce produit.

**Aucune clé de classe n'est proposée à la création** : le retour porte une clé existante,
`regle-qui-interdit-son-propre-remede`.

## Ordre recommandé

Un seul retour, donc un seul ordre. Il est daté par l'échéance du socle : la forme nue devient
bloquante le 16/12, et une correction après cette date rend rouge un parc de figures justes.

## Remarques restées au produit

2 corrections de cette séance restent ici : elles portent sur le générateur de ce produit, et
leur classe est déjà au registre.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 11 schémas exemptaient 366 éléments en bloc, donc aucun de leurs recouvrements n'était jugé | chaque boîte et ses textes deviennent un nœud groupé et titré ; les libellés de flèche sortent de l'exemption | non | c'est le geste de migration que le socle prescrit, appliqué ; rien à remonter que sa limite, qui est l'objet de RD-13 |
| Un exemple de lecture renvoyait à « l'ordre donné plus bas », alors que l'ordre est au-dessus | le renvoi nomme son sujet | non | classe `restitution-bloquants-disperses` voisine, mais le défaut est de rédaction locale et aucun contrôle de page ne le voit — la revue de lecture l'a trouvé, et c'est son rôle |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` du pilot sur ce lot —
vérifié le 2026-09-21 : les pièces de cette séance sont un lot de retours, une revue de lecture et
une page HTML générée.

**Un gabarit du socle a été employé** pour la 4e fois : `references/gabarit-revue-de-lecture.md`,
toujours sans identifiant ni version affichée en en-tête ; le rattachement se fait par le chemin du
gabarit et la date de lecture, 2026-09-21.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `forge/travaux/REVUE-20260921a-guide-developpeur.md` | `gabarit-revue-de-lecture.md` — sans numéro de version affiché | rien de neuf depuis les lots du 16/09 et du 17/09 | rien : la revue a été tenue, la porte locale la juge PASS | rien de plus | générique, déjà remonté sous RD-8 — la revue de lecture obligatoire jouée par aucun contrôle du socle |

## Confirmations positives

- **Les 2 retours du lot du 17/09 sont traités par la Factory, et vérifiés ici.** Le rembourrage
  du composant d'infobulle est passé à l'échelle de 4 points le 19/09, et son commentaire cite le
  fait remonté : « 10/14 faisaient rougir toute page ». La sonde de visibilité masque désormais les
  éléments collants le temps de sa capture, sous `TF-1192`, en citant le lot `20260917a` et le
  retour `RD-12`. Mesure sur ce produit : `oracle-tokens` **PASS** contre 2 constats majeurs, et
  `render_page --etats-ouverts` **PASS** aux 7 largeurs contre FAIL à 3 840 et 2 560 px.
- **Le recensement a fait son travail.** C'est lui, et non un œil, qui a mis les 366 exemptions
  sous les yeux du producteur, avec le geste et l'échéance. La forme « recenser, dater, puis
  refuser » est la bonne : elle a produit une migration réelle dans le tour suivant.
- **Le groupage par `<title>` est un meilleur geste que la paire**, sur le cas dominant : il
  supprime l'exemption au lieu de la déclarer, et il donne au lecteur une infobulle par objet de
  schéma. Il mériterait d'être nommé dans le message du recensement, à côté de la forme par paire.
