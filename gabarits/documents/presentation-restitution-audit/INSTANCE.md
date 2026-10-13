---
destinataire: humain
role_destinataire: l'équipe produit et son responsable, qui lèvent les points bloquants et décident de l'ordre
gabarit: gd-presentation-restitution-audit
version_du_gabarit: 1.0.0
---

# Client-A · Restitution de l'audit Produit-X · 20261013a

> Trame de restitution des points bloquants (une diapositive par point). Chaque point renvoie au
> constat du rapport d'audit ; la criticité est celle du rapport, l'effort est celui du plan de
> remédiation. Exemplaire ILLUSTRATIF : client pseudonymisé, aucune donnée réelle.
> Gabarit : gd-presentation-restitution-audit · version du gabarit 1.0.0

---

## 1 · Titre

Client-A · Audit Produit-X · 13 octobre 2026 · présenté par l'auditeur

---

## 2 · Conclusion de l'audit

- Verdict du rapport : mise en production possible sous réserve de lever trois points
- Points bloquants : 3
- Périmètre audité : le produit en préproduction et sa chaîne de déploiement *(renvoi au rapport Client-A - Rapport d'audit - 20261009a)*

---

## 3 · Vue d'ensemble

| Id | Point bloquant | Criticité | Effort (complexité × durée) |
|---|---|---|---|
| D07-C3 | Les sauvegardes ne sont jamais restaurées | critique | moyen × court |
| D04-C1 | Le déploiement passe par un geste manuel | majeure | complexe × moyen |
| D09-C2 | Aucune alerte ne prévient d'une panne de nuit | majeure | simple × court |

---

## 4 · Les sauvegardes ne sont jamais restaurées

- **Synthèse du problème** : des sauvegardes sont produites chaque nuit, aucune restauration n'a été jouée depuis la mise en service *(constat D07-C3, rapport Client-A - Rapport d'audit - 20261009a)*
- **Criticité et effort** : critique · moyen × court
- **Risques et impacts** : une perte de données ne serait pas récupérable avec certitude ; tous les utilisateurs du produit sont concernés
- **Solution** : jouer une restauration complète en préproduction et consigner sa durée, clôture prouvée par le compte rendu de restauration daté

---

## 5 · Le déploiement passe par un geste manuel

- **Synthèse du problème** : la mise en ligne dépend d'une commande lancée à la main depuis un poste *(constat D04-C1, rapport Client-A - Rapport d'audit - 20261009a)*
- **Criticité et effort** : majeure · complexe × moyen
- **Risques et impacts** : une version non revue peut partir en production ; l'équipe ne peut pas rejouer un déploiement identique
- **Solution** : confier le déploiement à la chaîne d'intégration, poste d'équipe exclu, clôture prouvée par un déploiement réalisé sans intervention manuelle

---

## 6 · Aucune alerte ne prévient d'une panne de nuit

- **Synthèse du problème** : le produit n'envoie aucune alerte quand son point de santé répond en erreur *(constat D09-C2, rapport Client-A - Rapport d'audit - 20261009a)*
- **Criticité et effort** : majeure · simple × court
- **Risques et impacts** : une panne de nuit n'est découverte qu'au matin par les utilisateurs
- **Solution** : brancher une alerte sur le point de santé, vers l'astreinte, clôture prouvée par une alerte déclenchée à blanc

---

## 7 · Ordre de traitement

1. D07-C3, la perte de données est le seul risque irréversible
2. D09-C2, la correction la plus rapide, elle protège pendant les autres travaux
3. D04-C1, la plus longue, elle suppose les deux premiers points tenus

---

## 8 · Décisions attendues

- Confirmer l'ordre de traitement proposé
- Désigner le responsable de la restauration de sauvegarde
