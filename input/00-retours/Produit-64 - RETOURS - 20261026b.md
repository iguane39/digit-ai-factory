# Lot de retours — Produit-64 → digit-ai-factory (absence conclue d'une réponse vide) — 2026-10-26, indice b

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, règle de preuve d'une absence (gabarit `gabarits/RESTITUTION.md`, S68, et `oracle-synthese`).

**Origine** : session de conversation du 26/10/2026, vers 10:35 (heure de Paris). Erreur relevée par la session elle-même, en répondant à la demande du porteur « Explique l'historique des modifications et vers quoi pointait l'ancienne connexion ».

Ce lot porte **1 retour** (RT-73).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-26** dans le sas d'arrivée du pilot. Les empreintes SHA-256 ont été comparées des deux côtés après la copie. L'original reste ici, dans l'historique du produit.

---

## digit-ai-factory (preuve d'une absence)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-73 | majeur | générique | **Une absence a été conclue d'une réponse `200` au corps `null`, lue dans un seul projet, et un correctif destructif en a été tiré.** En diagnostiquant le build Azure DevOps 17724, la session a lu `GET …/APP-IA/_apis/serviceendpoint/endpoints/a13c860e-…` → `200`, corps `null`, puis a écrit « l'ancienne connexion n'existe plus, supprimée puis recréée ». La restitution a été jugée PASS. Elle recommandait de remplacer le sujet de la règle fédérée, et un message à un administrateur Entra a été rédigé sur cette base. La relecture du même appel dans le projet `POC-IA` rend la connexion bien vivante (`azm-Produit-72-dev-wif`), avec 200 usages relevés dans son historique, dont un succès le 21/10. L'API des connexions de service est scopée par projet : un identifiant d'un autre projet rend `200` et `null`, pas `404`. Le remplacement aurait coupé 2 pipelines du bac à sable. | 1) Règle de preuve : « n'existe plus », « supprimé », « absent » sur une ressource de plateforme cite un essai qui distingue l'absence de la hors-portée : un `404`, une liste au niveau de l'organisation, ou l'essai répété sur chaque portée (projet, abonnement). Un `200` au corps vide ou `null` ne vaut jamais absence. 2) Contrôle d'`oracle-synthese`, extension de S68 : signaler « n'existe plus », « supprimé(e) », « a été supprimé » quand la preuve citée est un `200` ou un corps vide sans seconde portée. 3) Fixture rouge/verte : la restitution du 26/10 vers 09:21 en rouge, celle de 10:35 en vert. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-73** : classe `classe-a-creer`, proposée `absence-conclue-d-une-reponse-vide` : une ressource déclarée supprimée sur la foi d'une réponse réussie au corps vide, lue dans une seule portée.

## Rattachement

Registre interrogé le 26/10/2026 : `grep -i -E "n.existe plus|supprim[ée]+ .*connexion|200.*(vide|null)|corps (vide|null)|(vide|null).*200|port[ée]e? (du|de) projet|project-scoped|autre projet" todo/TODO.jsonl` → 14 items de création rendus, tous hors sujet (dont TF-0798, TF-0802, TF-0991, TF-1201 à TF-1206). Items voisins : S68 du gabarit (une absence se prouve par l'essai disponible), qui vise l'image et le `sitemap.xml` sans couvrir la réponse vide d'une API scopée ; TF-1009 (erreurs de mesure trouvées par contre-mesurage).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Diagnostic du build 17724 et message pour l'administrateur Entra | restitution corrigée dans la conversation : ajouter une seconde règle fédérée au lieu de remplacer la première | oui | proposé à la factory en RT-73 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé. Le comportement de l'API (`200` et `null` pour un identifiant d'un autre projet) ne refuse ni ne contraint aucun déploiement : il est décrit dans RT-73.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de documents de la bibliothèque sur ce lot.

## Documents mûrs

Déclaration reprise du lot `20261026a`, sans changement : aucune nouvelle série n'atteint 5 versions datées dans ce tour.

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

- La question suivante du porteur (« vers quoi pointait l'ancienne connexion ») a fait relire la ressource dans l'autre projet avant l'envoi du message à l'administrateur.

## Ordre recommandé

RT-73 seul.
