---
destinataire: {le lecteur : équipe ou comité qui décide des renforcements}
role_destinataire: {qui décide des renforcements, et ce qu'il décide à la lecture}
gabarit: gd-etude-reprise-activite
version_du_gabarit: 1.0.0
---

# {Produit} — Reprise d'activité et sauvegarde : {sujet}

{Une phrase : combien de temps le produit reste coupé, quelles données il perd.} Elle compare {N} états, dans cet ordre :

- **{État 1}** : {ce qu'il désigne} ;
- **{État 2}** : {ce qu'il désigne}.

Mesures faites le {JJ/MM/AAAA} entre {HH:MM} et {HH:MM} {UTC}, {en lecture seule} ; les commandes sont dans `{livrable}.mesures.md`. Chaque chiffre porte sa nature :

- **MESURÉ** : relevé ce jour par une commande ;
- **DÉCLARÉ** : affirmé par le porteur, consigné au ledger ;
- **DÉCOMPTÉ** : lu dans un document ou une page de fournisseur ;
- **ESTIMÉ** : jugement de l'auteur, avec son hypothèse.

{Ce qui n'a pas été lu, en une phrase : par exemple « aucune donnée de production n'a été lue ».}

## Synthèse

- **{État 1}** : {ce qui est sauvegardé, ou « aucune sauvegarde »}.
  - {Perte au pire et délai de reprise, avec la nature de chaque chiffre.}
- **{État 2}** : {ce qui est sauvegardé}.
  - {Perte au pire et délai de reprise, avec la nature de chaque chiffre.}
- **Renforcements** : {total} par an ({ESTIMÉ}), dont {part déjà prévue} ; aucun n'est engagé.

## Ce qui a été mesuré

| Brique | {État 1} | {État 2} |
|---|---|---|
| {brique} | {valeur} ({NATURE}, {HH:MM} {UTC}) | {valeur} ({NATURE}, {HH:MM} {UTC}) |

**Ce qui reste illisible**, et pourquoi :

- {élément illisible} : {motif}.

## Les dépendances

| Brique | Plateforme qui la sert | Ce qui casse quand elle tombe |
|---|---|---|
| {brique} | {plateforme} | {effet visible par l'utilisateur} |

## Les scénarios d'incident

Chaque cellule donne la **coupure**, soit le RTO *({durée d'indisponibilité avant reprise})*, puis la **perte** de saisies, soit le RPO *({durée de saisies perdues})*.

| Scénario | {État 1} | {État 2} | Nature |
|---|---|---|---|
| {panne d'une plateforme} | {coupure} ; perte {RPO} | {coupure} ; perte {RPO} | {NATURE} |
| {perte de données par un utilisateur} | {coupure} ; perte {RPO} | {coupure} ; perte {RPO} | {NATURE} |

**Calcul d'un délai d'incident** ({ESTIMÉ}, hypothèse par défaut) :

| Terme | Valeur | Hypothèse et source |
|---|---|---|
| Détection | {durée} | {hypothèse} |
| Décision | {durée} | {hypothèse} |
| Restauration | {durée, ou « non mesurée »} | {hypothèse, et date de la dernière restauration rejouée} |
| Vérification | {durée} | {hypothèse} |

## La politique de sauvegarde et de récupération

{Dire si une restauration a déjà été rejouée, dans quel état, à quelle date.}

| Donnée | {État 1} | {État 2} | Qui restaure |
|---|---|---|---|
| {donnée} | {ce qui la protège} | {ce qui la protège} | {rôle} |

**Procédure 1 — {restaurer quoi}** ({états concernés}).

1. {Geste.} Preuve de fin : {fait constatable}.
2. {Geste.} Preuve de fin : {fait constatable}.

## Les risques résiduels

| Id | Risque | État touché | Contrôle qui le couvre |
|---|---|---|---|
| RR-1 | {risque le plus grave} | {état} | {contrôle, ou « aucun »} |

## Les recommandations chiffrées

Aucune recommandation n'est engagée : chacune est une dépense que {le porteur} décide.

| Risque | Renforcement | Effet attendu ({ESTIMÉ}) | Prix | Coût annuel | Lot, retour arrière |
|---|---|---|---|---|---|
| RR-1 | {renforcement} | {effet, et son hypothèse} | {prix} ({DÉCOMPTÉ}, {source}, lue le {JJ/MM/AAAA}) | {calcul} = {montant} par an | {lot} ; {retour arrière} |
| **Total** | | | | **{montant} par an** : {part déjà prévue} | |

## Sources

| Source | Lue |
|---|---|
| {source} | {HH:MM} |

*Gabarit : gd-etude-reprise-activite · version du gabarit 1.0.0*
