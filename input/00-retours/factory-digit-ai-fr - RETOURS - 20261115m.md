# Retours forges — factory-digit-ai-fr — 20261115m

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction de la page de la forge de référencement de la version 2 du site, à partir du catalogue de la Factory et du README de la forge.
- **Références ledger** : forge/ledger.jsonl seq 300.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le rédacteur de la page de la forge de référencement a comparé le catalogue de la Factory au README de la forge. Les deux ne nomment pas les mêmes services, ni le même nombre de nœuds de l'audit. La page suit le catalogue et n'écrit aucun des chiffres en conflit.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-58 : le catalogue et le README de la forge de référencement ne couvrent pas les mêmes services.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-58 | **mineur** | générique | **Le catalogue et le README de la forge de référencement se contredisent.** Le catalogue nomme « Dérouler l'audit 87 nœuds » quand le README dit 89. Le README liste « Migrer une étude vers la grille courante », sans ligne au catalogue. Le catalogue porte « Redirections qui préservent le chemin (Cloudflare) », absent de la table du README. Ses mesures « 60/60 » et « 13/13 » ne disent pas ce qu'elles comptent. Preuve : `catalogue.jsonl` du pilot ; README de `digit-ai-forge-seo-geo` ; rapport du rédacteur de la page `forge-seo-geo`, le 15/11/2026. | Le contrôle de couverture catalogue ↔ README proposé en RP-56 (lot 20261115l) ; une mesure du catalogue nomme ce qu'elle compte. |

## La règle qui aurait évité le retour

- RP-58 : rien ne compare la liste des services du README d'une forge à ses lignes de catalogue. Classe à créer : `catalogue-readme-desynchronises`, la même que RP-56.

## Remarques restées au produit

- La page cite les services du catalogue, et l'écart est écrit dans ses « Manques signalés ». Généralisable : non, la cause générale est RP-56.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
