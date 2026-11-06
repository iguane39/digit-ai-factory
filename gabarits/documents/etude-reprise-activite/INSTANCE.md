---
destinataire: comité de pilotage de Produit-X (DSI, sécurité, exploitation)
role_destinataire: le comité de pilotage de Produit-X, qui décide quels renforcements de sauvegarde financer avant la mise en production
gabarit: gd-etude-reprise-activite
version_du_gabarit: 1.0.0
---

# Produit-X — Reprise d'activité et sauvegarde : portail de suivi des demandes

Cette étude dit combien de temps le portail reste coupé et quelles saisies il perd quand une plateforme tombe. Elle compare 2 états, dans cet ordre :

- **Actuel** : le portail en recette, sur l'hébergeur de pages, la forge de code et le service de données de l'entreprise ;
- **Cible** : le portail en production, à construire au lot L4.

Mesures faites le 06/11/2026 entre 09:10 et 09:55 UTC, en lecture seule ; les commandes sont dans `Produit-X - Étude - Reprise d'activité du portail - 20261106a.mesures.md`. Chaque chiffre porte sa nature :

- **MESURÉ** : relevé ce jour par une commande ;
- **DÉCLARÉ** : affirmé par le porteur, consigné au ledger ;
- **DÉCOMPTÉ** : lu dans un document ou une page de fournisseur ;
- **ESTIMÉ** : jugement de l'auteur, avec son hypothèse.

Aucune donnée de production n'a été lue : la production n'existe pas encore.

## Synthèse

- **Actuel** : une sauvegarde quotidienne, gardée chez le fournisseur de données seulement.
  - 7 sauvegardes réussies, restauration à un instant choisi désactivée (MESURÉ, 09:40 UTC).
  - Perte au pire : 24 heures. Délai de reprise : 2 jours ouvrés (ESTIMÉ, partie 4).
- **Cible** : la restauration à un instant choisi ramène la perte à 2 minutes (DÉCOMPTÉ, documentation du fournisseur).
  - Elle n'existe pas encore (MESURÉ, 09:40 UTC), et aucune restauration n'a été rejouée (DÉCLARÉ, ledger, entrée 31).
- **Renforcements** : 1 284 USD HT par an (ESTIMÉ), dont 1 260 déjà prévus au lot L4 ; aucun n'est engagé.

## Ce qui a été mesuré

| Brique | Actuel | Cible |
|---|---|---|
| Page | hébergeur de pages, réponse 302 derrière la porte de connexion (MESURÉ, 09:12 UTC) | même hébergeur, domaine de production à poser |
| Code | dépôt privé de l'entreprise, chaîne réussie le 04/11/2026 (MESURÉ, 09:15 UTC) | même dépôt |
| Base | projet de recette, active, 2 Go (MESURÉ, 09:40 UTC) | projet de production, taille supérieure (cadrage, ligne 88) |
| Sauvegardes | 7 quotidiennes, restauration à un instant choisi désactivée (MESURÉ, 09:40 UTC) | restauration sur 7 jours, copie hebdomadaire hors du fournisseur (cadrage, ligne 90) |
| Copie hors fournisseur | aucune (MESURÉ, 09:18 UTC) | compartiment dédié à construire |

**Ce qui reste illisible**, et pourquoi :

- l'offre de l'organisation chez le fournisseur de données : le jeton de lecture ne porte que les projets (code 403) ;
- la taille des données de production : elle n'existe pas encore.

## Les dépendances

| Brique | Plateforme qui la sert | Ce qui casse quand elle tombe |
|---|---|---|
| Page | hébergeur de pages | le portail ne s'ouvre plus |
| Code | forge de code | les correctifs sont bloqués, la page reste servie |
| Données | service de données | la page s'ouvre, mais aucune demande ne s'affiche |

## Les scénarios d'incident

Chaque cellule donne la **coupure**, soit le RTO *(durée d'indisponibilité avant reprise)*, puis la **perte** de saisies, soit le RPO *(durée de saisies perdues)*. Une panne ne perd aucune saisie déjà enregistrée : perte 0.

| Scénario | Actuel | Cible | Nature |
|---|---|---|---|
| Hébergeur de pages seul | durée de la panne ; perte 0 | durée de la panne ; perte 0 | ESTIMÉ, partie 3 |
| Service de données seul | durée de la panne ; perte 0 | durée de la panne ; perte 0 | ESTIMÉ, partie 3 |
| Suppression par un utilisateur | 2 jours ouvrés ; 24 heures par la sauvegarde de la veille | 2 jours ouvrés ; 2 minutes | ESTIMÉ, 4 termes |
| Migration fautive | 2 jours ouvrés plus la restauration ; 24 heures au plus | 2 jours ouvrés plus la restauration ; 2 minutes | ESTIMÉ, 4 termes ; sauvegardes MESURÉES |
| Région du fournisseur perdue | non borné ; tout, les sauvegardes étant dans la même région | 2 jours ouvrés plus la restauration ; 7 jours par la copie hebdomadaire | ESTIMÉ ; région MESURÉE |

**Calcul d'un délai d'incident** (ESTIMÉ, hypothèse par défaut faute de source au cadrage) :

| Terme | Valeur | Hypothèse et source |
|---|---|---|
| Détection | 0,5 jour ouvré au plus | un utilisateur voit l'erreur ; aucune alerte |
| Décision | 0,5 jour ouvré au plus | le porteur décide de restaurer |
| Restauration | non mesurée | jamais rejouée (ledger, entrée 31) ; durée liée à la taille |
| Vérification | 1 jour ouvré au plus | le porteur relit les demandes touchées |

## La politique de sauvegarde et de récupération

Aucune restauration n'a jamais été rejouée, dans aucun état.

| Donnée | Actuel | Cible | Qui restaure |
|---|---|---|---|
| Demandes et pièces jointes | 7 sauvegardes quotidiennes | restauration sur 7 jours et copie hebdomadaire | le porteur |
| Comptes de connexion | annuaire de l'entreprise | annuaire de l'entreprise | l'administrateur de l'annuaire |
| Code | dépôt de l'entreprise et postes | dépôt de l'entreprise et postes | l'équipe |

**Procédure 1 — restaurer la base depuis la sauvegarde de la veille** (actuel).

1. Créer un projet vide chez le fournisseur. Preuve de fin : le projet répond.
2. Charger la sauvegarde choisie. Preuve de fin : le nombre de demandes égale celui du relevé de la veille.
3. Pointer le portail sur le nouveau projet. Preuve de fin : la page de recette affiche les demandes.

## Les risques résiduels

| Id | Risque | État touché | Contrôle qui le couvre |
|---|---|---|---|
| RR-1 | perte de toute la base si la région du fournisseur est perdue | les 2 | copie hors fournisseur, absente |
| RR-2 | durée de restauration inconnue le jour de l'incident | les 2 | exercice chronométré, absent |
| RR-3 | incident vu tard, après une demi-journée | les 2 | sonde de la page, absente |

## Les recommandations chiffrées

Aucune recommandation n'est engagée : chacune est une dépense que le porteur décide (R-29).

| Risque | Renforcement | Effet attendu (ESTIMÉ) | Prix | Coût annuel | Lot, retour arrière |
|---|---|---|---|---|---|
| RR-1 | export complet chaque semaine, rangé chez l'entreprise (sans achat) | perte de la région : de « tout » à 7 jours | sans objet | 0 USD par an | dès maintenant ; arrêter l'export |
| RR-2 | restauration à un instant choisi sur la recette pendant 1 semaine, puis restauration chronométrée | délai connu avant la production | 0,14 USD par heure (page de tarifs du fournisseur, DÉCOMPTÉ, lue le 06/11/2026) | 0,14 × 168 = 23,52, soit 24 USD pour 1 exercice par an | lot L3 ; désactiver l'option |
| RR-3 | sonde horaire de la page par la chaîne du dépôt (sans achat) | détection en 1 heure | sans objet | 0 USD par an | lot L3 ; désactiver |
| Cible | restauration sur 7 jours et taille supérieure pour la base de production | perte de 2 minutes | 100 USD par mois, plus 5 USD de taille (page de tarifs du fournisseur, DÉCOMPTÉ, lue le 06/11/2026) | (100 + 5) × 12 = 1 260 USD par an | lot L4 ; désactiver l'option |
| **Total** | | | | **1 284 USD par an** : 1 260 déjà prévus au lot L4 | |

## Sources

| Source | Lue |
|---|---|
| API de l'hébergeur de pages (projets, domaines) | 09:12 |
| API de la forge de code (dépôts, chaînes) | 09:15 |
| API du fournisseur de données (projets, sauvegardes) | 09:40 |
| Pages de tarifs des trois fournisseurs | 09:50 à 09:55 |

*Gabarit : gd-etude-reprise-activite · version du gabarit 1.0.0 · exemplaire ILLUSTRATIF, client pseudonymisé, aucune donnée réelle*
