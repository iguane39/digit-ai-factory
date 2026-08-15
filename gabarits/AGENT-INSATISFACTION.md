# Gabarit d'agent d'instruction — une insatisfaction, six blocs (TF-0287)

Ce gabarit **complète** `gabarits\AGENT-CAMPAGNE.md` : tout son contrat s'applique
(périmètre d'écriture, écarts à la lettre, §Avancement, §Synthèse jugée). Il ajoute ce
qui est propre à l'instruction d'une insatisfaction.

**La règle qui fonde ce gabarit** : l'humain a déposé une phrase. Il n'a pas écrit le
protocole, et il ne l'écrira plus jamais — c'est ici qu'il vit. Un dossier instruit qui
n'a pas ses six blocs n'est pas instruit : `oracle-insatisfactions` I3 nomme celui qui
manque.

## Bloc a — Reproduction, aux conditions réelles

Reproduire **dans les conditions du dépôt**, pas dans des conditions confortables : la
largeur de la capture (pas « responsive en général »), la langue servie, le contenu réel
(pas une fixture). Un défaut visuel se reproduit en pixels ; un défaut de contenu se
reproduit sur la donnée servie.

Si la reproduction échoue : ce n'est **pas** une clôture. C'est soit une donnée manquante
(demandée **UNE** fois, jamais deux), soit un verdict `non_reproduit` motivé disant
exactement ce qui a été tenté.

## Bloc b — Cause racine côté produit

Le défaut **dans le produit**, nommé au fichier et à la ligne. Pas « le menu est mal
configuré » : le composant, l'attribut, la donnée. Si la cause est ailleurs que là où le
symptôme apparaît, le dire — c'est fréquent, et c'est ce qui fait rouvrir un dossier
quand on ne le dit pas.

## Bloc c — Gates en défaut, vérifiés et jamais présumés

Pour **chaque** défaut trouvé : quel oracle, quel test, quel gate **aurait dû** le voir,
et pourquoi il ne l'a pas vu. Trois causes possibles, et une seule est vraie à la fois :

- **inexistant** — aucun contrôle ne couvre cette dimension (alors : candidature à en
  créer un) ;
- **aveugle** — le contrôle existe, il couvre la dimension, mais son périmètre ou sa
  règle laisse passer ce cas (alors : correction de périmètre, **fixture rouge** exigée) ;
- **jamais joué** — le contrôle existe et verrait le défaut, mais rien ne l'appelle sur
  ce chemin (alors : R-35, l'appelant est à nommer).

**L'hypothèse « la forge n'a pas vu » se VÉRIFIE** : on lance le contrôle sur le cas réel
avant de conclure. Accuser un gate qui n'était pas en cause coûte une campagne pour rien.

## Bloc d — Solutions, par destinataire

Trois destinataires, jamais confondus :

| Destinataire | Ce qui lui revient | Par quelle voie |
|---|---|---|
| **PRODUIT** | le correctif du défaut | bloc e |
| **FORGE(S)** | la règle, l'oracle, le périmètre à corriger | bloc f (lot sidecar) |
| **PILOT** | ce qui relève de la doctrine ou du registre | candidats TF |

Chaque solution porte son coût et ce qu'elle exclut. Une solution qui touche trois forges
ou crée un objet durable déclenche l'étude d'opportunité (TF-0155) avant décision.

## Bloc e — Correctif et release, par la voie du produit

Le correctif se fait **par la voie normale du produit** (`RUN-VERSION.md` : socle, delta,
**tests entiers**) — jamais un patch à chaud parce que « c'est urgent ». Depuis le 15/08,
R-37 s'applique aussi : toucher une UI engage le rendu en pixels avant/après et, si le
produit est multilingue, le verdict de parité.

**Décision humaine préservée (R-29)** : l'instruction est automatique, la mise en
production ne l'est pas. Et si un run ou une session vit déjà sur ce produit, le
correctif lui est **remis** (consigné au dossier), jamais imposé par-dessus — les
produits sont autonomes.

## Bloc f — Retours aux forges, par le canal standard

Lot `<projet> - RETOURS - AAAAMMJJ<i>` + sidecar, remis à `<pilot>\input\00-retours\`
(règle 18) — jamais d'écriture directe dans une forge, jamais de correction spontanée.
Les constats en passant deviennent des candidats TF ; la décision reste humaine.

## Ce que l'instruction écrit au registre

À l'ouverture : `depot` (si le pilot ne l'a pas déjà fait). À la fin : `instruction`
avec ses six blocs déclarés, puis `cloture` avec son verdict (`corrige`,
`non_reproduit`, `preference`) et sa release s'il y en a une. Le registre est
`insatisfactions\REGISTRE.jsonl`, écrivain unique : le pilot — l'agent **rapporte**, le
pilot écrit.

## Contrôle

`node oracles\oracle-insatisfactions.mjs` (I1-I4, self-test double sens) et
`node oracles\oracle-boite-entree.mjs` (B4 : un dépôt jamais entré au registre est
dénoncé). La synthèse finale suit `gabarits\RESTITUTION.md` et passe `oracle-synthese`
avant affichage.
