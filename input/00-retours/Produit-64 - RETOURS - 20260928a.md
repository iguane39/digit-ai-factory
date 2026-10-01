# Lot de retours — Produit-64 → digit-ai-factory — 2026-09-28, indice a

**Émetteur** : produit `Produit-64` · **Cible** : le pilot `digit-ai-factory` (bibliothèque
de gabarits de documents, famille `gd-guide-de-reference` ; harnais des recettes) · **Origine** :
l'intégration au `main` du pilot, décidée par le porteur le 28/09/2026, de la famille
`gd-guide-de-reference` et de la règle R-57 remontées par le lot `20260924e` (RT-22).

> **Note de réception du pilot, 28/09/2026.** Le producteur a numéroté RT-25 le premier retour
> de ce lot. Le pilot avait donné ce numéro, le 25/09, à un retour du lot
> `Produit-64 - RETOURS - 20260924e`, qui est ingéré, donc immuable (R-49). Le RT-25 de ce lot-ci
> devient RT-28, premier numéro libre après RT-26 de ce lot et RT-27 du lot `20260928b` ; RT-26
> garde le sien. Le « RT-22 » cité ci-dessus est le numéro que le producteur avait donné à son
> retour du 24/09, renuméroté RT-25 à la réception du 25/09. Le reste du texte est celui du producteur.

Ce lot porte **2 retours**, tous deux trouvés en rejouant les recettes du pilot sur le report.

- **Contexte** : décision du porteur du 28/09/2026, réponse « 1a, 2a » à la restitution du produit :
  intégrer la branche au pilot et rejouer toutes ses recettes (D-1 a), garder le seuil de maturité
  à 5 versions datées (D-2 a). Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-28** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.
- **Travail livré** : le commit `80c126f` du pilot, branche `report/guide-de-reference-20260928`,
  **au `main` du pilot le 28/09/2026 à 11:00** par avance rapide depuis `73aca64` — **non publié**
  (R-38 : `main` porte 5 commits en avance sur l'origine, les 4 de la synchronisation du 28/09 et
  celui-ci). C'est un REPORT de `3941463`, jamais une avance rapide de la branche d'origine : fait sur
  `a464cb9` (`8a69a4c`), puis rebasé sur les quatre commits que la synchronisation a enregistrés à
  10:25-10:27. La branche `gabarit/guide-de-reference` reste à `3941463` : c'est la seule référence
  qui garde atteignable `9131ecb`, l'enregistrement de ce poste jamais publié. Entrée en vigueur de
  R-57 déplacée au 29/09 (R-33 bis). Le travail en attente de la synchronisation n'a pas été touché :
  il a été enregistré par sa session avant la fusion.

---

## digit-ai-factory (`digit-ai-factory`)

Le report s'est intégré sans toucher au travail de la synchronisation du 28/09. Deux angles morts se
sont montrés en rejouant les recettes, l'un dans la famille remontée par ce produit, l'autre dans
le harnais des recettes.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-28 | majeur | générique | `construire-guide.py --constat` (famille `gd-guide-de-reference`) ne compare que les **13 blocs propres à la famille**, jamais les **4 blocs du socle** qu'elle embarque (`COMPOSANT-EMBARQUE` : `find-in-page.js`, `table-filters.js`, `table-filters.css`, `table-detail.js`). Mesuré le 28/09 : le `SQUELETTE.html` du commit `3941463` embarque `find-in-page.js` à l'empreinte `sha256:108b35a7313c…`, le socle installé est à `sha256:c12d95c744a5…` (TF-1340, 26/09) — et `--constat` rend « 13 bloc(s) », sans un mot sur les 4 autres. Une page qui porte un composant du socle périmé passe donc la parité, et le verdict ne dit pas ce qu'il n'a pas regardé | faire comparer à `--constat` les blocs `COMPOSANT-EMBARQUE` au socle résolu (le chemin que `poser_socle` résout déjà par `realpath`), ou le faire déléguer à la vérification du socle ; à défaut, publier dans le verdict « 4 blocs du socle non comparés ». Fixture rouge : une page portant un `find-in-page.js` d'une version antérieure, verte une fois régénérée |
| RT-26 | majeur | générique | `oracles/self-tests.mjs` accuse **« CAS PERDUS : ./bootstrap.test.mjs : 19 → 17 cas, 2 DISPARU(S) »** à chaque passage sur ce poste, et sort donc 1. Le cliquet a été relevé de 17 à 19 le 27/09 par l'autre poste (`aa0f5f2`, « démarrage 17 -> 19 »), où le cas « bootstrap 5 bis (TF-1337) » est joué ; sur ce poste, le même banc écrit « 5 bis : NON JOUÉ — le contrôle de frontmatter de forge-agents est absent de ce poste » et rend 17/17. Rejoué le 28/09 à l'identique sur un clone vierge de `a464cb9` et sur le report : 17/17 des deux côtés. Aucun cas n'a été retiré, et le harnais le lit comme une perte | ne pas compter un cas que son banc déclare NON JOUÉ, ou tenir le cliquet par poste ; et faire dire au constat quel cas manque et pourquoi, le banc le sachant déjà. Fixture rouge : un banc qui rend 17 avec un cas NON JOUÉ face à un cliquet de 19, vert s'il n'est pas accusé ; et un banc qui rend 17 SANS cas non joué, toujours accusé |

### RT-28 — La parité de la famille ne voit pas le socle qu'elle embarque

**Le fait.** Entre le 24/09, où la famille a été écrite, et le 28/09, où elle est entrée au `main`,
le socle `digit-ai-page-html` a changé sa recherche (TF-1340 : le conteneur n'est plus réécrit ;
TF-1353 : un `<tspan>` dans les schémas SVG). Les pages de la famille, régénérées au report, portent
la nouvelle version, et le report dit ce qui a changé. Mais l'outil qui promet la parité —
« `--constat` rejoue la parité » — l'aurait laissée passer : sur la page d'avant, il rend 13 blocs,
et seul le composant de recherche de la famille, retouché le jour même, sort « PÉRIMÉ ».

**Pourquoi c'est de la bibliothèque.** Toute page produite par le générateur de la famille embarque
les 4 blocs du socle. Un produit qui rejoue `--constat` avant de livrer croit sa page à jour.

### RT-26 — Un cliquet de cas qui dépend du poste

**Le fait.** Les deux postes du porteur jouent le même banc `bootstrap.test.mjs`. Il compte 19 cas
là où forge-agents porte son contrôle de frontmatter, 17 ailleurs, et il le dit lui-même. Le cliquet
ne retient que le plus haut des deux.

**Ce que ça coûte.** L'agrégateur est rouge sur ce poste quoi qu'on fasse, et un harnais toujours
rouge apprend à ne plus lire ses « CAS PERDUS » — y compris le jour où un cas disparaîtra vraiment.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le guide développeur du produit n'embarque toujours pas les composants de la famille (rail en `::before`, RAF-084) | non corrigée dans ce tour : RAF-125, dont le prérequis — la famille au `main` du pilot — est levé le 28/09 | oui | déjà **remonté** par le lot `20260924e` (RT-22, RD-27, complément à RD-17) : rien de neuf à remonter |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot : les 8 documents qu'`oracle-lot-retours` 1.4.0 mesure sous
`output\` (`documentsMurs`, seuil 5 versions datées) sont ceux que le lot `20260924e` a déclarés, aux
mêmes nombres de versions (23, 17, 16, 14, 10, 10, 7, 6). La section n'est due qu'à partir du 29/09 ;
elle est portée ici volontairement.

## Confirmations positives

- **TF-1340 ferme dans le socle ce que RD-17 demandait.** La recherche du socle du 26/09 ne réécrit
  plus le conteneur : la famille régénérée avec elle rend la sonde d'interactions 21/21, dont « après
  une recherche effacée, un filtre s'ouvre encore ». Le relevé brut que la famille passe en `getHTML`
  ne sert plus qu'avec un socle antérieur — `COMPOSANTS.md` et l'en-tête du composant le disent
  désormais. Les gardes de ré-initialisation du socle (`data-tf-ready`, `data-td-ready`) rendent
  sans effet le recâblage que la famille fait après chaque frappe.
- **La note de synchronisation de TF-1413 a tenu** : « un report de 3941463 sur main, jamais une
  avance rapide ». Le report a été fait deux fois — sur `a464cb9`, puis sur les quatre commits que la
  synchronisation a enregistrés à 10:25-10:27 — et les quatre fichiers communs (le lexique et son
  banc, le registre des classes, les cliquets) n'ont demandé que des ajouts.
- **La combinaison des niveaux (TF-1418) et de la consigne R-57 dans `hook-lexique`** tient : 39/39
  au self-test, 11/11 au banc, dont les cas « vite : » joués dans le dossier du pilot.

## Ordre recommandé

1. RT-26 — tant que le harnais est rouge sur ce poste pour un cas non joué, il ne peut pas servir de
   porte : chaque passage exige de relire à la main pourquoi il est rouge.
2. RT-28 — la parité de la famille promet plus qu'elle ne mesure ; la correction est locale au
   générateur de la famille.

## La règle qui aurait évité le retour

- **RT-28** — classe `oracle-perimetre-de-non-mesure-non-publie` : la parité rend son verdict sur
  13 blocs sans publier qu'elle ne mesure pas les 4 blocs du socle.
- **RT-26** — classe `controle-vrai-sur-le-mauvais-invariant` : le cliquet protège « aucun cas
  retiré » et mesure « combien de cas ont été joués », grandeur qui varie aussi avec le poste.
