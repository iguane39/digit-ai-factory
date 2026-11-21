# Retours forges — factory-digit-ai-fr — 20261115a

- **Contexte** : run `forge-digit-ai-fr-20261114a`, refonte du texte de la page de la forge des tests. Le créateur demande de mettre à jour le fait daté de la section « La preuve ».
- **Références ledger** : forge/ledger.jsonl seq 208.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le créateur, le 15/11/2026 : « 222a en mettant à jour, cerrtaines dates semblent anciennes par rapport à tout ce qui a été fait depuis ». J'ai cherché sur le poste une campagne de tests plus récente que celle du 17/08/2026, menée jusqu'à son terme. Il n'y en a aucune.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-40 : les campagnes de tests des produits ne tiennent plus de journal de tours.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-40 | **majeur** | générique | **Depuis le 09/09/2026, aucune campagne de tests d'un produit n'a de journal de tours.** Du 01/09 au 09/11/2026, j'ai relevé 31 rapports d'audit de la forge des tests, sur 6 produits : tous sont PARTIEL, avec une boucle « en_cours ». 30 portent 0 tour. Le dernier, arrêté au 4e tour le 09/09, laisse 17 anomalies. Le seul `journal-boucle.jsonl` du poste s'arrête au 06/09/2026. La dernière campagne mesurée jusqu'à son terme reste celle du 17/08/2026, citée par le README. Preuve : `find c:/dev -path '*forge/etapes/tests/*' -name 'rapport-*.json'`, champ `boucle.convergence.tours`. | Rendre le journal de tours obligatoire à l'étape tests d'un run : la campagne ne se clôt pas sans lui. Relever chaque semaine les campagnes terminées, produit par produit, et signaler au pilot tout rapport PARTIEL sans tour au journal. |

## La règle qui aurait évité le retour

RP-40 : la définition de fin d'une campagne existe (README de la forge, « Une campagne se termine »), mais rien n'oblige un run à la tenir ni à tracer ses tours. Classe à créer : `campagne-tests-sans-journal-de-tours`, famille `tracabilite-ledger`.

## Remarques restées au produit

- La page de la forge des tests garde le fait du 17/08/2026, daté et présenté comme la dernière campagne mesurée jusqu'à son terme. Elle y ajoute un rapport d'audit du 09/11/2026, sans nommer le produit. Généralisable : non, c'est le contenu de cette page.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
