# Lot de retours — Produit-64 → digit-ai-factory (garde R-62, `oracles/hook-identite-sortante.mjs`) — 2026-10-20, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, garde `PreToolUse` `oracles/hook-identite-sortante.mjs` (R-62, TF-1716).

**Origine** : session de conversation du 20/10/2026, vers 10:40 (heure de Paris), pendant les exécutions de preuve du mode « demande de fusion » du gabarit Terraform (RAF-166).

Ce lot porte **1 retour** (RT-70).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-20** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-factory (`oracles/hook-identite-sortante.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-70 | mineur | générique | **La garde R-62 refuse une commande dont l'adresse n'est pas dans la requête HTTP, et vers le service git de l'organisation de l'utilisateur.** La commande refusée enchaînait `git -c user.email=<adresse de l'utilisateur> commit` dans un dépôt d'essai, puis `curl` vers `https://dev.azure.com/Client-A-DevOps/...` avec un en-tête `Authorization: Bearer`, sans adresse. Motif affiché : « IDENTITÉ SORTANTE REFUSÉE (R-62) — cette requête vers un service tiers porte une adresse électronique ». Or l'adresse était l'auteur d'un commit **local**. `dev.azure.com/Client-A-DevOps` n'est pas un tiers : c'est l'organisation Azure DevOps de l'utilisateur, où ses commits portent cette adresse par règle (identité git Client-A via `includeIf`). Coût mesuré : une commande rejouée en deux temps, d'abord le commit avec `git config user.email`, ensuite l'envoi seul. Aucune donnée ne serait partie chez un tiers. | 1) Ne juger que le texte de la **requête** (URL, en-têtes, corps de `curl` ou `Invoke-WebRequest`), pas le reste de la commande : un `git -c user.email=… commit` n'émet aucune requête. 2) Admettre une liste d'hôtes **propres à l'utilisateur** (`FORGE_HOTES_PROPRES`, par exemple `dev.azure.com/<organisation>`), déclarée par l'humain comme `FORGE_IDENTITES`. 3) Banc : la commande du 20/10 passe ; la forme du 14/10 (adresse dans `User-Agent` vers une API publique) reste refusée. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-70** : classe `classe-a-creer`, proposée `garde-de-sortie-sur-le-texte-de-commande` — une garde qui doit juger une requête lit la commande entière : elle confond une donnée locale avec une donnée émise, et le service de l'utilisateur avec un tiers.

## Rattachement

Registre interrogé le 20/10/2026 : `grep -i "identite-sortante\|identité sortante\|R-62" todo/TODO.jsonl` → 2 items recoupés.
Items recoupés : TF-1716 (création de la garde, corrigé le 15/10) et TF-0963 (R-62 citée). Aucun ne traite le faux positif sur une adresse d'auteur git ni sur un hôte de l'organisation de l'utilisateur.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Boîte des retours du projet commun aveugle aux noms de produit accentués | `tools/projet-commun/lib-retours.mjs` : `git -c core.quotepath=off` ; banc du projet commun 60/60, cas RT-V13 rouge puis vert | non | outil propre au projet commun, corrigé au commit `09c9145` |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de documents de la bibliothèque sur ce lot.

## Documents mûrs

Relevé par `node forge/retours/oracle-lot.mjs --murs .` le 20/10/2026 : 10 documents à 5 versions datées ou plus sous `output/`. Aucun lot antérieur ne les nommait.

| Document | Versions | Verdict |
|---|---|---|
| Guide développeur POC-to-Prod | 30 | remonté : sa forme est la famille `gd-guide-de-reference` du pilot depuis le 28/09/2026 (règle R-57) |
| Modèle Rapport d'audit POC-to-Prod | 22 | reste au produit, parce qu'il est régénéré par `propager-pack.mjs` à chaque version du pack Client-A ; ses versions suivent le pack, pas une forme manquante |
| Catalogue ADR Client-A par domaine | 5 | reste au produit, parce qu'il est régénéré à chaque bump du dépôt de gouvernance Client-A (outils `actualiser-catalogue-depot.mjs`) |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA | 6 | reste au produit, parce qu'il est déjà rendu par le générateur de la famille `gd-guide-de-reference` ; ses versions suivent le parc des produits Client-A |
| Propositions ADR par domaine | 16 | reste au produit, parce qu'il porte des propositions d'ADR propres à Client-A ; la série est close depuis le 30/06/2026 |
| Schéma Process POC-to-Prod End-to-end | 14 | reste au produit, parce que c'est un schéma de la méthode Client-A ; la série est close depuis le 08/07/2026 |
| Référentiel POC-to-Prod - Audit | 10 | reste au produit, parce que son contenu est le référentiel Client-A, et que sa forme générique vit au produit d'audit `digit-ai-forge-audit` |
| Compliance Pack - Format & Contenus des contraintes | 10 | reste au produit, parce qu'il décrit le pack Client-A ; série close depuis le 10/07/2026 |
| Process Ingénierie POC-to-Prod - Consolidation et cible | 7 | reste au produit, parce qu'il est propre à la méthode Client-A ; série close depuis le 01/09/2026 |
| Matrice Contraintes ADR Light-Complet | 6 | reste au produit, parce qu'elle est propre au périmètre Client-A ; série close depuis le 08/07/2026 |

## Confirmations positives

Aucune confirmation positive sur ce lot.

## Ordre recommandé

RT-70 seul.
