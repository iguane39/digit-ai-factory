---
destinataire: humain
role_destinataire: le porteur de Produit-X, qui approuve chaque geste distant et valide l'ordre des lots avant le Build
gabarit: gd-cadrage-reprise
version_du_gabarit: 1.0.0
---

# Produit-X — Cadrage de la reprise : portail de suivi des demandes

*02/11/2026 · portail de suivi des demandes, dépôt `produit-x`, branche de départ `main` · exemplaire ILLUSTRATIF, client pseudonymisé, aucune donnée réelle*

## Le besoin

> « Le portail doit repartir sur une base saine : un seul lieu de configuration, une recette que je peux rejouer, et rien qui parte en ligne sans que je l'aie dit. » — le porteur de Produit-X, 28/10/2026

- **Résultat attendu** : le portail tourne en recette avec ses trois configurations relevées, et le porteur a rejoué la recette de chaque lot.
- **Périmètre** : le portail web, son service de données et son nom de domaine de recette.
- **Hors périmètre** : l'application mobile, qui garde son propre cycle ; la production, traitée dans un cadrage de mise en production à part.

## Les configurations par environnement

| Élément | dev | recette | production | Source |
|---|---|---|---|---|
| Adresse du portail | `http://localhost:5173` | `https://recette.produit-x.example` | `https://portail.produit-x.example` | `config/environnements.yml` |
| Service de données | base locale du développeur | projet `produit-x-recette` | projet `produit-x-prod` | console du fournisseur de données, relevé du 02/11/2026 |
| Clé d'accès au service de données | variable `DATA_KEY` du poste | gestionnaire de secrets, entrée `recette/data-key` | gestionnaire de secrets, entrée `prod/data-key` | `docs/secrets.md` |
| Version du portail | version du dépôt | étiquette `v1.4.0` | étiquette `v1.3.2` | `git tag --list` au 02/11/2026 |
| Envoi de courriels | désactivé | boîte de test | service réel | `config/environnements.yml` |

*Deux écarts comptent pour la reprise : la production tourne une version derrière la recette, et l'envoi de courriels est réel en production seulement.*

## Les lots

| # | Lot | Contenu | Dépend de | Preuve de fin |
|---|---|---|---|---|
| 1 | Configuration unique | Un fichier de configuration lu par les trois environnements, sans valeur secrète | aucun | `node <produit-x>/scripts/verifier-config.mjs` rend le code 0 sur les trois environnements |
| 2 | Recette rejouable | Un jeu de données de recette et les parcours automatisés | 1 | le rapport de recette liste 12 parcours, tous au vert |
| 3 | Domaine de recette | Le nom de domaine de recette pointe sur le portail | 1 | la page d'accueil de recette répond avec la version `v1.4.0` |

## La recette

| Lot | Critère (oui ou non) | Qui le joue | Avec quoi | Où le résultat se lit |
|---|---|---|---|---|
| 1 | Aucune valeur secrète n'apparaît dans le fichier de configuration | le Build | `node <produit-x>/scripts/verifier-config.mjs` | sortie du script, code de retour |
| 2 | Les 12 parcours passent sur le jeu de données de recette | le Build, puis le porteur | `npm run recette` | `recette/rapport.html` |
| 3 | La page de recette affiche la version de l'étiquette déployée | le porteur | un navigateur | l'en-tête de la page de recette |

## Les gestes distants à approuver

| # | Geste | Cible distante | Effet | Réversible | Approbateur | État |
|---|---|---|---|---|---|---|
| 1 | Créer le projet de données de recette | fournisseur de données | Un projet vide, sans donnée de production, sur l'offre gratuite : aucune dépense | oui : suppression du projet | le porteur de Produit-X | approuvé le 02/11/2026 |
| 2 | Poser l'enregistrement de nom du domaine de recette | zone DNS du domaine | Le nom `recette.produit-x.example` pointe sur l'hébergement de recette | oui : suppression de l'enregistrement | le porteur de Produit-X | à approuver |
| 3 | Pousser la branche `reprise` | dépôt distant | La branche devient visible de toute l'équipe | non : l'historique publié ne se retire pas | le porteur de Produit-X | à approuver |

*Le Build ne joue que les gestes passés à `approuvé le JJ/MM/AAAA` : ici, le geste 1.*

## Sources

`config/environnements.yml` et `docs/secrets.md` du dépôt `produit-x` au commit `a1b2c3d`, liste des étiquettes du 02/11/2026, console du fournisseur de données du 02/11/2026.

*Gabarit : gd-cadrage-reprise · version du gabarit 1.0.0*
