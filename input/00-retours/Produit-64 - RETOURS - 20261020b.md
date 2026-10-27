# Lot de retours — Produit-64 → digit-ai-factory (restitution, bloc 3, format B S78) — 2026-10-20, indice b

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, gabarit `gabarits/RESTITUTION.md`, bloc 3, format B (S78), et `oracle-synthese`.

**Origine** : session de conversation du 20/10/2026, vers 11:10 (heure de Paris). Retour humain, mot pour mot : « Ces explications sont bien meilleures que celles précédentes. Prend cette base pour les futures explications et remonte ce point à la Factory pour généralisation. »

Ce lot porte **1 retour** (RT-71).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-20** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-factory (`gabarits/RESTITUTION.md`, bloc 3, S78)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-71 | majeur | générique | **Le format B (S78) tenu à la lettre laisse une décision écrite dans le vocabulaire de l'auteur ; l'humain a dû demander une réexplication, puis l'a jugée « bien meilleure ».** Mêmes décisions D-1 à D-3, même format B, deux écritures : `forge/travaux/RESTITUTION-20261020a-gabarit-mode-demande-de-fusion.md` (première pose, préjugée affichable) et `RESTITUTION-20261020b-d1-d2-d3-reexpliquees-mail-architecture.md` (réexplication). Ce qui a changé, mesuré entre les deux : 1) « De quoi s'agit-il » nommait l'objet par son nom interne (« la garde de source de l'étage `Cible` ») ; il dit désormais pourquoi l'objet existe et ce qu'il fait (« le gabarit regarde d'où vient la demande avant toute action Azure ») ; 2) D-3 énumérait 7 objets dans une seule phrase, désormais en liste, précédée de la raison d'être du banc ; 3) « Le problème » ne donnait qu'un côté, il donne désormais les deux côtés du compromis (accès qui dure / preuves effacées) ; 4) « Pourquoi vous » dit la portée réelle (« s'impose à toutes les applications… une règle de travail des équipes, pas un détail technique »). Le préjugement rendait les deux versions affichables : aucune règle ne voit la différence. | 1) Ajouter à S78 quatre consignes de contenu : la raison d'être de l'objet avant son nom ; aucun nom interne (étage, variable, identifiant de code) sans ce qu'il fait ; une énumération de 3 éléments ou plus dans « De quoi s'agit-il » en liste ; « Le problème » dit les deux côtés quand l'option recommandée a un coût. 2) Contrôle d'`oracle-synthese` : signaler un « De quoi s'agit-il » dont le premier syntagme est un identifiant en code non suivi d'une glose, et une énumération en ligne de 3 éléments ou plus (S80 l'interdit déjà hors citation). 3) Fixture rouge/verte : les D-1 à D-3 des deux restitutions citées, la première rouge, la seconde verte. 4) Écrire ainsi dès la première pose : une réexplication demandée est un coût évité. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-71** : classe `classe-a-creer`, proposée `decision-ecrite-dans-le-vocabulaire-de-l-auteur` — une décision conforme au format nomme son objet par le nom que lui donne l'auteur, sans dire pourquoi il existe ni ce qu'il fait, et l'humain doit demander une réexplication pour trancher.

## Rattachement

Registre interrogé le 20/10/2026 : `grep -i "se comprend\|format B\|De quoi s'agit\|réexpli\|jargon" todo/TODO.jsonl` → 3 items recoupés.
Items recoupés : TF-0932 (gloser les termes techniques d'une page HTML, forge-agents), TF-1045 (redescente de JARGON-A-GLOSER), TF-1064 (style rédactionnel jugé par aucun oracle). Aucun ne porte sur le contenu des trois lignes du format B (S78) ni sur la première pose d'une décision.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Explications de décisions trop proches du vocabulaire du gabarit | mémoire du produit `decisions-expliquees-pour-le-lecteur` : ce modèle s'applique dès la première pose | oui | proposé à la factory en RT-71 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de documents de la bibliothèque sur ce lot.

## Documents mûrs

Relevé par `node forge/retours/oracle-lot.mjs --murs .` le 20/10/2026 : 10 documents à 5 versions datées ou plus sous `output/`. Déclaration reprise du lot `20261020a`, pas encore ingéré au pilot.

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

- Le format B (S78) lui-même : l'humain a tranché les trois décisions en une ligne (« 1a, 2…, 3a ») dès qu'elles ont été écrites pour lui. Le cadre est bon, c'est son remplissage qui fait la différence.

## Ordre recommandé

RT-71 seul.
