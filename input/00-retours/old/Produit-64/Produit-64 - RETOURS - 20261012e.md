# Lot de retours — Produit-64 → pilot (méthode d'analyse d'un dépôt, contrôle de fraîcheur) — 2026-10-12, indice e

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `oracles/hook-ouverture.mjs` (contrôle de fraîcheur), la démarche `gabarits/DIAGNOSTIC-EXPLOITATION.md` et la grille de `quality-oracles` (classe « données »).

**Origine** : le développeur du produit Produit-11 a corrigé, le 12/10/2026, un rapport de coûts produit par une session de ce produit. Le porteur a ensuite demandé : « Pourquoi est-ce que tu ne l'as pas vu directement ? », puis : « il y a clairement une erreur faite à ne pas reproduire et donc à remonter à la Factory ».

Ce lot porte **1 retour**. Il annonce aussi une **rectification** du retour RT-34 (lot `Produit-64 - RETOURS - 20261012c`), qui sera déposée en forme dès que RT-34 aura son identifiant TF.

- **Contexte** : analyse des coûts Azure, menée en conversation, qui a conduit à lire le code de deux autres produits du parc (Produit-11, Produit-01). Hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-12** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`oracles/hook-ouverture.mjs`, `gabarits/DIAGNOSTIC-EXPLOITATION.md`, `quality-oracles`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-38 | majeur | générique | **Une session a recommandé de construire un correctif qui existait déjà depuis 13 jours, parce qu'elle a lu une copie locale périmée du dépôt d'un autre produit.** Le rapport `output/old/03-Syntheses/Client-A - Couts Applications IA - BAV D1 - 20261012a.md` affirmait que la chaîne Produit-11 « ne désactive jamais l'ancienne révision ». Il recommandait d'ajouter ce ménage (C-1), puis d'en désactiver à la main (C-2). **Mesure du 12/10/2026** : le clone `C:/dev/_Client-A/Produit-11` était à `46fb585`, daté du **14/09**, contre `cc788e5`, daté du **12/10**, pour `app-ia/main`, soit **290 commits de retard**. Le ménage existe depuis le commit `d1e9007` du **29/09** (`azure/borner-revisions.sh`, appelé deux fois par `deployment.yml`, avec 3 révisions gardées). Il a été écrit après **une panne de 4 jours** en développement : 133 révisions actives et 99,5 cœurs sur les 100 du quota. Trois fautes se cumulent. **(1)** Aucun `git fetch` : le contrôle de fraîcheur d'ouverture de session (`hook-ouverture.mjs`) ne juge que les dépôts de la Factory, jamais un dépôt produit que la session va lire. **(2)** Une absence a été prouvée par une recherche dans **un seul fichier** (`grep deactivate deployment.yml`), alors que le ménage vivait dans un script appelé. **(3)** Un indice vu n'a pas été suivi : la chute du coût du 29/09 était relevée, et son auteur déclaré « non identifié », sans que l'historique git de cette date soit relu. **Le même défaut touchait Produit-01** (116 commits de retard) : il a été neutralisé parce que cette analyse-là avait fait un `fetch` et lu `origin/main`. Les constats chiffrés (facture, métriques Azure) étaient justes ; seules les recommandations sur le code étaient fausses. Le développeur BAV l'a relevé : « juste sur le diagnostic, dépassé sur sa recommandation centrale ». | **(a)** Une règle de démarche, dans `DIAGNOSTIC-EXPLOITATION.md` et dans la grille de `quality-oracles` (classe « données ») : toute affirmation sur le code d'un dépôt **cite la référence lue** (sha et date) et l'**écart avec le distant**, mesuré par `git fetch` puis `git rev-list --count HEAD..<remote>/main`. Avec un écart non nul, on lit `<remote>/main`. **(b)** Une absence (« X ne fait pas Y ») se prouve par une recherche sur **tout le dépôt distant** (`git grep <motif> <remote>/main`), jamais sur un fichier. **(c)** Une variation d'une métrique à une date donnée fait relire `git log --since/--until` autour de cette date avant d'écrire « cause inconnue ». **(d)** En outil : une sonde `fraicheur-depot.mjs <chemin>` qui rend en avance / en retard / à jour, appelable par une session avant toute lecture de dépôt hors de la Factory. Elle peut être étendue au hook d'ouverture pour les dépôts listés par le produit. Fixtures : rouge (clone en retard de N commits, lecture de HEAD), verte (lecture de `<remote>/main` citée). |

**Portée** : générique. Toute session qui analyse, audite ou recommande sur un dépôt dont elle n'est pas l'auteur y est exposée, et le parc compte plusieurs clones de produits tiers sous `C:/dev/_Client-A`.

### Rectification annoncée de RT-34 (lot `20261012c`)

RT-34 porte deux faits faux sur le produit Produit-11 : « la chaîne n'a jamais désactivé une seule révision » et « rien n'empêche la récidive ». Ce qui est vrai : depuis le 29/09 (`d1e9007`), Produit-11 garde 3 révisions par un script qui lui est propre. Le **fond** de RT-34 reste valable, et il sort même renforcé : la prescription `azure` de `digit-ai-forge-ops` ne borne toujours pas les révisions, et le produit a dû écrire son propre script **après une panne de quota**, pas seulement après une facture. Une ligne de sidecar `"rectifie":"TF-…"`, de nature `fait_errone`, sera déposée dès que l'identifiant TF de RT-34 sera connu.

## Rattachement

Registre interrogé le 12/10/2026 (`todo/TODO.jsonl`, termes « git fetch », « clone local », « copie locale », « en retard de … commits », « branche distante ») : aucun item ne vise la fraîcheur d'un dépôt **lu** par une session.

- `TF-1008` (clone frais pour une porte de publication) et `TF-0877` (`rebatir-clone.mjs`) traitent de la fraîcheur d'un dépôt **publié** par la Factory, pas d'un dépôt analysé.
- La classe `releve-heritage-juge-arbre-pas-histoire` est voisine (le disque du poste au lieu de l'état versionné), sans couvrir l'analyse d'un dépôt tiers.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Rapport BAV avec deux recommandations fausses | Indice `20261012e` : C-1 marquée faite par l'équipe, C-2 retirée, C-5 réévaluée à environ 150 € par mois ; indice `a` déplacé dans `output/old/` | oui | remonté : RT-38 |
| Analyse sur clone local sans `fetch` | Mémoire de session du produit `fetch-avant-analyse-depot-produit` | oui | remonté : RT-38, propositions (a) et (d) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot. La fiche APR2 a été déclarée au lot `Produit-64 - RETOURS - 20261012d`.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. Le quota de 100 cœurs d'un environnement Container Apps en consommation, cité en RT-38, est une limite de plateforme qui a **refusé** la création de pods chez Produit-11 (« exceeded quota: consumption, requested: …cpu=1k, used: 99500, limited: 100k »). Il a été heurté par le produit Produit-11, pas par ce produit, et c'est à Produit-11 de le remonter.

## Confirmations positives

- La lecture de `origin/main` après `fetch`, faite pour Produit-01, a tenu : le dimensionnement, la variable d'environnement et l'absence de règle d'échelle relevés le 12/10 ont été revérifiés sur la branche distante, sans écart.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucune classe existante ne convient.

- Clé proposée : `analyse-de-depot-sur-copie-perimee`
- Famille : `donnees-perissables-en-dur`
- Libellé : « Une session affirme ce que fait ou ne fait pas le code d'un dépôt d'après une copie locale non synchronisée, ou d'après une recherche limitée à un fichier, sans citer la référence lue ni son écart avec le distant : un correctif déjà livré est recommandé comme manquant. »

## Ordre recommandé

1. **RT-38 (a) et (b)** : deux règles d'écriture, effet immédiat sur toutes les sessions.
2. **RT-38 (d)** : la sonde, qui rend la règle vérifiable.
3. **RT-38 (c)**.
