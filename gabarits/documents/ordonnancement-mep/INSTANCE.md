---
destinataire: humain
role_destinataire: comité de changement — décide l'attribution de la fenêtre et le GO de bascule
---

# Ordonnancement des étapes de mise en production

**Projet** : Produit-03 (bibliothèque vidéo, trigramme BVI) · **Indice** : 20260903a ·
**Date** : 03/09/2026
**Commit de référence de ce document** : `main` au 03/09/2026 · **Artefact visé** : tag
`v1.4.0`, commit `0872840`
**Sources** : dossier de changement indice 20260827a (§ 2, § 3, § 6) · rétro-ingénierie des
constats d'audit 20260827a (statuts `RE-xxx`) · état réel du dépôt vérifié sur `main` au
03/09/2026
**Gabarit : gd-ordonnancement-mep** · **Version du gabarit : 1.0.0**

> Instance de démonstration de la famille. Elle est **réduite à 9 étapes sur 3 lots** là où le
> livrable d'origine en portait 48 sur 7 : ce qu'elle prouve est la FORME — colonnes fixes,
> vocabulaires fermés, dépendances par identifiant, section des inversions —, jamais
> l'exhaustivité d'un ordonnancement réel. Les noms de projet et de client sont des
> pseudonymes.

---

## 0. Comment lire ce tableau

**9 étapes, 3 lots, un seul ordre.** L'ordre n'est pas une préférence de rédaction : chaque
dépendance de la colonne *Dépend de* est une contrainte technique ou une contrainte d'autorité
établie. **Deux d'entre elles cassent la mise en production si elles sont inversées**, et elles
sont reprises au § 4.

| Nature | Ce que cela veut dire |
|---|---|
| **Décider** | Un arbitrage ou une signature. Ne produit aucun artefact technique, mais débloque ceux qui suivent. N'appartient pas au projet. |
| **Construire** | Un objet qui n'existe pas — code, pipeline, objet de plateforme, attestation. |
| **Corriger** | Un objet qui existe et porte un écart mesuré. |
| **Configurer** | Un réglage sur un objet existant. |
| **Exécuter** | Un geste du mode opératoire, à date et heure. |

**Colonne *Bloquant*** : `MEP` = sans lui, la mise en production ne peut pas être prononcée ·
`fenêtre` = sans lui, la fenêtre du jour J ne peut pas être engagée · `—` = l'écart peut être
assumé et signé.

**Ce que ce tableau ne couvre pas** : les écarts déclarés et maintenus hors du périmètre du
changement sont rassemblés au § 3, avec leur motif. Ils ne sont pas oubliés, ils sont exclus.

---

## 1. Lot L0 — Décisions et arbitrages (T-5 → T-2 jours)

| # | Objet | Nature | Ce qu'il y a à faire | Dépend de | Propriétaire | Bloquant | Preuve de fin |
|---|---|---|---|---|---|---|---|
| **S-01** | Population autorisée | Décider | Désigner la population sous forme d'**un groupe d'annuaire nommé, avec son effectif chiffré**. « Les collaborateurs » n'est pas une réponse exploitable. En l'état : l'attribution par rôle est désactivée et la liste des principaux autorisés est vide — **3 128 comptes invités** sont admis (relevé du 24/08). | — | Propriétaire métier | **MEP** | Nom du groupe et effectif chiffré, consignés au dossier |
| **S-02** | Identité de déploiement de production | Décider | Créer une identité dédiée, portée au seul groupe de ressources de production, **ou** faire contresigner la dérogation. En l'état, les deux chaînes qui touchent la production utilisent l'identité de développement, contributrice au niveau de la souscription. | — | RSSI (dérogation) ou Plateforme | **MEP** | Décision écrite : identité, rôles, périmètre, propriétaire |
| **S-03** | Fenêtre et horaires | Décider | Attribuer le créneau en comité et **dater** le calendrier relatif (J-1, J, J+1) en horaires absolus. La fenêtre initialement demandée le 26/08 est caduque. | — | Comité de changement | **fenêtre** | Créneau attribué, horaires absolus au dossier |

---

## 2. Lot L1 — Dépôt : construire et corriger (T-4 → T-2 jours)

| # | Objet | Nature | Ce qu'il y a à faire | Dépend de | Propriétaire | Bloquant | Preuve de fin |
|---|---|---|---|---|---|---|---|
| **S-04** | Chaîne d'enregistrement applicatif — restriction d'audience | **Construire** | La chaîne **ne porte aujourd'hui aucun des trois gestes d'audience** : zéro occurrence des trois réglages dans le fichier. Ajouter, **dans cet ordre impératif** : (1) attribution du groupe de S-01 à l'application d'entreprise, puis (2) bascule de l'attribution par rôle à « exigée », plus (3) un refus explicite du run si aucun groupe n'est fourni pour la production. **Inverser (1) et (2) coupe l'accès à tout le monde.** | S-01 | Projet | **MEP** | Run sur la production : attribution par rôle exigée et liste d'assignations non vide, relevées sur l'objet servi |
| **S-05** | Tests de recette d'audience | **Construire** | Deux tests, joints au dossier : un compte **du** groupe accède au service, un compte **hors** groupe est refusé. Le test négatif est le seul qui prouve quelque chose. | S-04, S-07 | Projet + IAM | **MEP** | Deux relevés horodatés |
| **S-06** | Destinataire d'alerte de disponibilité | Corriger | Destinataire nominatif unique pour un service en production : une absence suffit à ce que l'alerte ne réveille personne. Remplacer par une boîte d'équipe ou le canal du RUN. **Coût : une valeur.** | — | Projet + RUN | — | Valeur non nominative dans le fichier de variables de production |

---

## 3. Lot L2 — Objets de plateforme hors dépôt (T-2 jours → J-1)

| # | Objet | Nature | Ce qu'il y a à faire | Dépend de | Propriétaire | Bloquant | Preuve de fin |
|---|---|---|---|---|---|---|---|
| **S-07** | Groupe d'annuaire et attribution | **Configurer** | Créer ou retenir le groupe nommé en S-01, puis **l'attribuer à l'application d'entreprise**. Cette attribution précède obligatoirement la bascule faite par S-04. | S-01, S-04 | IAM | **MEP** | Groupe attribué, effectif relevé |
| **S-08** | Environnement de déploiement et son approbation | **Construire** | **N'existe pas.** L'étage de déploiement de la chaîne de livraison y est adossé : sans lui, la livraison ne peut pas s'exécuter. Le créer et y poser une approbation : **deux approbateurs nommés, approbateur ≠ demandeur**. | S-03 | Administration de la plateforme | **MEP** | Environnement créé, approbation attestée, relevé horodaté |
| **S-09** | Chemin privé, résolution de nom et certificat | **Construire** | Point d'accès privé vers le service de production **créé et en attente d'approbation**, route de production configurée mais **désactivée**, résolution de nom et certificat en place. Demande formelle à T-2 jours. Sans ce chemin, la bascule est reportée : **couper l'accès public sans chemin privé rend le service injoignable**. | S-03 | Plateforme | **fenêtre** | Confirmation écrite de la plateforme, point d'accès visible en attente |

---

## 4. Les deux inversions qui cassent la MEP

Le reste du tableau se réordonne sans dommage. **Ces deux-là, non.**

1. **S-07 avant la bascule de S-04** — attribuer le groupe à l'application d'entreprise
   **avant** d'exiger l'attribution par rôle. Inversé, **l'accès est coupé pour tout le
   monde**, y compris pour les comptes de test : plus personne ne peut constater la panne
   depuis l'intérieur.
2. **S-09 avant le verrouillage réseau du jour J** — le chemin privé doit être en place ET
   contrôlé par le domaine **avant** que l'accès public soit coupé. Inversé, et si le chemin
   privé ne fonctionne pas, **le service n'est joignable par aucun chemin** et le diagnostic se
   fait à l'aveugle, dans la fenêtre.

---

## 5. Écarts déclarés, maintenus hors du chemin de MEP

Ces points sont **exclus, pas oubliés**. Chacun porte son motif ; aucun ne conditionne
l'ouverture du service.

| Objet | Statut | Motif de l'exclusion | Décision attendue de |
|---|---|---|---|
| Scripts en ligne dans la politique de sécurité de contenu | accepté, **mesuré** | Écart chiffré : 5 679 octets pour 101 empreintes distinctes, au-delà de la limite de 4 096 octets du paramètre du serveur ; un jeton de session exigerait un moteur serveur que l'export statique n'a pas. | RSSI |
| Signature des images de conteneur | ouvert | Scan de vulnérabilités et nomenclature logicielle en place ; la signature relève du socle de construction, pas de ce changement. | Socle de build / RSSI |
| Médias versionnés dans le dépôt (130 Mo) | ouvert | 9 fichiers suivis, réembarqués à chaque construction ; la migration vers un stockage objet est instruite par une décision d'architecture séparée. | Projet |
| Conséquence du palier d'hébergement retenu | assumé | Instance unique, sans emplacement de bascule ni mise à l'échelle : chaque livraison ultérieure provoque une interruption de quelques minutes. Acceptable pour un service éditorial non critique, à réexaminer si l'usage croît. | Porteur |

---

## 6. La lecture pour le comité

Sur les 9 étapes de cet ordonnancement, **une seule est du code manquant qui touche la
sécurité du service** : les trois gestes de restriction d'audience de S-04, aujourd'hui absents
du fichier. **Deux sont des objets de plateforme qui n'existent pas** et bloquent l'exécution —
l'environnement de déploiement et son approbation (S-08), le chemin privé (S-09). **Trois sont
des décisions ou des signatures** qui n'appartiennent pas au projet (lot L0). Le reste est du
mode opératoire déjà écrit et une correction de valeur.

**Le produit est prêt ; ce qui manque est essentiellement de l'autorité et deux objets de
plateforme.**
