---
destinataire: humain
role_destinataire: l'équipe d'exploitation de Produit-X, qui choisit les actions à mener et leur ordre
gabarit: gd-fiche-constat-precos
version_du_gabarit: 1.0.0
---

# Produit-X — Coûts d'hébergement : constat et préconisations

*14/10/2026 · environnements de recette et de production · exemplaire ILLUSTRATIF, client pseudonymisé, aucune donnée réelle*

## En bref

- **Coût** : 240 € en septembre, **~320 € par mois** au rythme d'octobre.
- **63 %** de ce coût en octobre vient d'un seul composant : le **service d'indexation** de recette.
- **La recette ne reçoit plus de données** depuis le 08/10, à cause d'un jeton expiré.
- **Gains possibles** : ~135 € par mois en gestes simples, ~20 € de plus avec une tâche planifiée.

## Constat

| Composant | Taille | Sept. | Du 1er au 13/10 | Lecture |
|---|---|---:|---:|---|
| Indexation, recette | 4 cœurs, toujours allumée | 150 € | 85 € | **Taille de production, en recette** |
| Indexation, production | 4 cœurs | 50 € | 30 € | Normal |
| Stockage des journaux | 120 Gio | 30 € | 14 € | **Rétention de 365 jours** |
| Base de données | petite | 10 € | 5 € | Normal |
| **Total** | | **240 €** | **134 €** | |

*La somme des lignes égale le total : aucun écart.*

**1. L'indexation de recette a la taille de la production.**
- Elle utilise 4 % de ses 4 cœurs sur 30 jours, contre 61 % en production.

**2. La recette est à l'arrêt depuis 6 jours.**
- Le jeton du connecteur a expiré le 08/10 : 2 140 échecs d'import d'affilée au 14/10.

**3. Les journaux sont gardés un an, sans besoin écrit.**
- 120 Gio conservés pour une consultation relevée sur les 30 derniers jours.

## Préconisations

| # | Action | Gain par mois | Effort | Attention |
|---|---|---:|---|---|
| **1** | **Renouveler le jeton** du connecteur de recette, puis relancer l'import. | Recette rétablie | 20 min | Mettre la date d'expiration au calendrier de l'équipe |
| **2** | **Réduire l'indexation de recette** à 1 cœur, la production garde ses 4. | ~110 € | 1 h | Imports plus lents en recette, acceptables |
| **3** | **Ramener la rétention des journaux** à 30 jours. | ~25 € | 30 min | Irréversible pour les journaux déjà effacés |
| **4** | **Éteindre l'indexation de recette la nuit** par une tâche planifiée. | ~20 € | 1 jour, recette comprise | La tâche doit se rallumer avant 7 h |

**Rien à faire** sur la base de données : elle est déjà au plus petit niveau proposé.

**Ordre conseillé** : 1 tout de suite, puis 2 et 3 dans la semaine, puis 4 dans une évolution planifiée.

## Sources

Facturation du fournisseur (septembre et du 1er au 13/10/2026), métriques d'utilisation du processeur, journaux du connecteur de recette, dépôt d'infrastructure au commit `a1b2c3d`.

*Gabarit : gd-fiche-constat-precos · version du gabarit 1.0.0*
