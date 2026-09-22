---
role: référentiel DÉCLARÉ des produits que la Factory suit — la première pierre du verdict O1 de l'étude du 22/08 sur la vue portefeuille (partition P2), rouvert sous TF-1313 le 22/09/2026
sources_de_verite: [todo/TODO.jsonl et todo/TODO-ARCHIVE.jsonl (créations, champs demandeur et source), output/03-etudes/20260822-etude-opportunite-vue-portefeuille.md, oracles/fraicheur-claims.json (claim produits-connus-du-registre)]
verifie_le: 2026-09-22
---

# Référentiel des produits suivis

Ce fichier dit **quels produits la Factory suit**, sous leur seul pseudonyme, avec les faits que le
registre versionné établit sur chacun et l'état que l'humain leur déclare. Il répond à la partition
P2 de l'étude du 22/08 — « comment le pilot connaît-il la liste des produits ? » —, que l'étude
jugeait décisive et qui était restée sans réponse : la seule liste déclarée du parc était celle des
**forges**, dans `bootstrap.mjs`. Le lecteur y trouvera la liste, ce qu'elle mesure, pourquoi elle
diffère des trois autres comptes du parc, et comment elle se tient à jour.

## Les produits

Le registre connaît **17 produits connus du registre** par leurs lots — c'est-à-dire cités dans les
champs `demandeur` ou `source` d'au moins une création, sous la forme `Produit-NN`. Ce compte est
jugé par le claim `produits-connus-du-registre` d'`oracles\fraicheur-claims.json` : le jour où un
produit neuf remet son premier lot, l'oracle de fraîcheur échoue jusqu'à ce que sa ligne soit
ajoutée ici. Les dates et les comptes viennent du registre et valent sur tous les postes ; l'état,
lui, se **déclare** et ne se devine pas.

**Comment lire le tableau.** Une ligne par produit, triée par numéro de pseudonyme ; aucun produit
connu du registre n'en est exclu. Les deux dates sont la première et la dernière création du
registre qui cite le produit — elles bornent son activité sous la doctrine, pas sa vie propre. La
colonne des créations compte ces items, archive comprise. L'état déclaré et son motif sont les deux
seules colonnes qu'un humain renseigne ; toutes les autres se recalculent depuis le registre.

| Produit | Première remontée | Dernière remontée | Créations au registre | État déclaré | Motif de l'état |
|---|---|---|---|---|---|
| Produit-01 | 11/08/2026 | 27/08/2026 | 36 | à qualifier | — |
| Produit-02 | 08/08/2026 | 16/09/2026 | 86 | à qualifier | — |
| Produit-03 | 21/08/2026 | 03/09/2026 | 43 | à qualifier | — |
| Produit-04 | 22/08/2026 | 27/08/2026 | 10 | à qualifier | — |
| Produit-05 | 20/08/2026 | 31/08/2026 | 45 | à qualifier | — |
| Produit-07 | 24/08/2026 | 24/08/2026 | 1 | jamais instancié au constat du 24/08 | TF-0549 : répertoire à moitié instancié et hors dépôt git ; instanciation décidée (option a), exécution laissée au produit et non constatée depuis |
| Produit-09 | 20/08/2026 | 08/09/2026 | 11 | à qualifier | — |
| Produit-10 | 13/08/2026 | 08/09/2026 | 90 | à qualifier | — |
| Produit-11 | 11/08/2026 | 14/09/2026 | 83 | à qualifier | — |
| Produit-12 | 16/08/2026 | 07/09/2026 | 39 | à qualifier | — |
| Produit-60 | 05/09/2026 | 05/09/2026 | 1 | à qualifier | — |
| Produit-61 | 05/09/2026 | 14/09/2026 | 39 | à qualifier | — |
| Produit-62 | 05/09/2026 | 21/09/2026 | 61 | à qualifier | — |
| Produit-64 | 08/09/2026 | 22/09/2026 | 30 | à qualifier | — |
| Produit-65 | 03/09/2026 | 03/09/2026 | 2 | à qualifier | — |
| Produit-66 | 11/09/2026 | 16/09/2026 | 7 | à qualifier | — |
| Produit-67 | 22/09/2026 | 22/09/2026 | 2 | à qualifier | — |

Les trois états admis sont ceux de l'étude : **vivant**, **mis de côté**, **jamais instancié**. « À
qualifier » n'en est pas un quatrième : c'est l'aveu qu'aucune déclaration n'a encore été faite,
écrit plutôt que remplacé par une supposition tirée de la dernière date de remontée.

## Pourquoi quatre sources rendent quatre comptes

Le parc compte ses produits de quatre façons, et elles ne mesurent pas la même chose. Les confondre
est précisément ce qui rendait la question insoluble.

- **Le registre** : 17, par les lots remontés. C'est le seul compte qui prouve une activité sous la
  doctrine, et c'est celui que ce référentiel prend pour base.
- **La table des pseudonymes** du canal confidentiel (`scripts\lib-confidentiel.mjs`, hors dépôt) :
  environ quatre fois plus d'entrées. Elle pseudonymise tout nom de produit rencontré dans un texte,
  y compris ceux qui n'ont jamais été instrumentés ; elle n'est pas une liste de produits suivis.
- **Le relevé d'ouverture** (`oracles\hook-produits-intacts.mjs`) : un scan du disque, qui dit ce
  qu'un poste porte à l'instant, jamais ce que la Factory suit.
- **Le localisateur** (`todo\localiser-produit.mjs`) : les produits dont les lots sont retrouvables
  sur le poste qui l'exécute. Son résultat change d'un poste à l'autre, et c'est pourquoi il n'est
  PAS recopié ici : un fait qui dépend du poste, écrit dans un fichier suivi, réécrit ce fichier à
  chaque changement de poste — défaut déjà payé par l'index de `output\` (TF-1243).

## Ce que ce référentiel ne dit pas

Il ne donne aucun chemin ni aucun nom réel : le pilot ne fait entrer aucun nom de produit dans un
fichier suivi (`scripts\lib-pseudonyme-produit.mjs`, décision du 03/09). Pour atteindre le dépôt
d'un produit, le pseudonyme se résout par le canal confidentiel, puis `todo\localiser-produit.mjs`
le retrouve sur le poste. Il ne porte pas non plus la **vue** portefeuille : l'étude la diffère
explicitement, et ce référentiel est la condition qu'elle posait avant de la construire.
