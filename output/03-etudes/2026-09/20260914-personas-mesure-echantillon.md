---
role: échantillon de l'étude d'opportunité « personas par phase » du 14/09/2026 — dix défauts échappés, listés AVANT la reconstitution des livrables, la baseline et les fiches, conformément au protocole figé à 09:12
fige_le: 2026-09-14
sources_de_verite: [output/03-etudes/20260914-personas-mesure-protocole.md, input/00-retours/ et input/00-retours/old/ (lots de retours, pseudonymisés), todo/TODO.jsonl, todo/CLASSES.json, historiques git en lecture seule de digit-ai-factory, digit-ai-forge-agents, digit-ai-forge-audit et de deux dépôts produits désignés par leur pseudonyme]
---

# Échantillon — dix défauts échappés (14/09/2026)

Cet échantillon fixe les dix défauts que les relectures devront retrouver. Chacun a été trouvé par
un humain ou un aval après que ses contrôles automatiques avaient rendu vert, et chacun a un
livrable récupérable dans son état d'avant correction. La liste est arrêtée avant toute relecture.

**Mode de lecture** : une ligne par défaut échappé, désigné `E-NN` *(défaut échappé n° NN de la
sélection)* ; les lignes sont groupées par phase dans l'ordre de la factory. La colonne
« récupération » dit d'où vient le livrable relu : un commit git vérifié (A) ou la citation du lot
(B). Les produits sont désignés par leur pseudonyme de lot.

| Id | Phase | Livrable | Source du retour | Défaut, en une phrase | Trouvé par | Récupération |
|---|---|---|---|---|---|---|
| E-02 | conception | canevas de fiche sécurité (forge-audit) | `old\Produit-03 - RETOURS - 20260824b.md`, RA-33 (ligne du lot) | le canevas demande comment on s'authentifie, jamais qui est effectivement admis | propriétaire métier, après un audit, un comité et une revue de sécurité | A — forge-audit `1d8b57b` |
| E-10 | conception | rapport d'arbitrage d'un produit | `Produit-05 - RETOURS - 20260831a.md`, RA-13 (ligne du lot) | le rapport affirme une décision de direction dont la seule trace est une recommandation du prestataire | le client | B — citation du lot ; **cas limite** : fait extérieur au livrable |
| E-03 | design | squelettes de documents HTML du pilot | `old\Produit-03 - RETOURS - 20260823a.md`, RA-24 (ligne du lot) | le sommaire est balisé mais aucune règle de style ne le vise | l'humain, au premier document réel | A — pilot `92b415e^` |
| E-15 | design | jetons de couleur des badges de statut | `Produit-62 - RETOURS - 20260908a.md`, RA-7 (ligne du lot) ; `todo\TODO.jsonl` (récidive de la classe `page-html-teinte-refus`) | trois fonds pastel de luminance voisine rendent les badges indiscernables | retour humain direct | B — valeurs citées au registre |
| E-06 | development | logos du produit (variante couleur et variante blanche) | `Produit-02 - RETOURS - 20260825b.md`, RT-28 (ligne du lot) | la variante blanche reçoit le contenu de la variante couleur | l'exploitant, en production | A — Produit-02 `8d08677` |
| E-07 | development | chaînes traduites en espagnol et portugais | `Produit-02 - RETOURS - 20260826d.md`, RT-51 à RT-53 (lignes du lot) | une substitution de terme change le genre du nom sans corriger les accords éloignés | l'exploitant, relecture humaine | A — Produit-02 `b12085c^` |
| E-08 | development | installateur du hameçon de publication (forge-agents) | `digit-ai-forge-agents - RETOURS - 20260907a.md`, RC-1 (ligne du lot) | l'oracle est appelé sans lui désigner ses tables, qui ont déménagé ensuite | les dépôts aval, forcés au push sans contrôle | A — forge-agents `bfdb251^` ; **cas limite** : fait extérieur au livrable |
| E-01 | MEP | fiche d'accès de test d'un produit | `Produit-61 - RETOURS - 20260906c.md`, RP-5 (ligne du lot) | des identifiants triviaux figurent en clair et s'affichent sur une qualification publique | le commanditaire, en une minute | A — Produit-61 `6e23fce` |
| E-05 | MEP | porte de fraîcheur de déploiement | `Produit-02 - RETOURS - 20260826i.md`, RT-60 (ligne du lot) | la porte ne compare que l'empreinte de la page d'accueil | mesure directe en production | A — Produit-02 `a210525^` |
| E-04 | restitution | synthèse de fin de tour du pilot | `old\Produit-03 - RETOURS - 20260822a.md`, RA-13 | une action laissée au développeur ne porte ni chemin, ni commande, ni écran | le commanditaire, cinq jours après | A — pilot `fb01f38` |

## Ce que l'échantillon ne couvre pas

La phase de **tests** n'y figure pas : son seul candidat (une suite de bout en bout muette après un
correctif de sécurité, lot `Produit-11 - RETOURS - 20260911b.md`, RT-62, ligne du lot) n'a pas de livrable
récupérable, et sa citation décrit le défaut lui-même. Cinq autres candidats en récupération B ont
été écartés pour la même raison : relire une citation qui énonce le défaut ne mesure rien.
L'échantillon retenu couvre quatre phases de la factory et la restitution.

## Retrait après reconstitution (14/09/2026, avant toute relecture)

Le contrôle des livrables reconstitués, fait par l'auteur de l'étude et non par l'agent qui les a
produits, a trouvé deux fuites. Dans le livrable de **E-06**, une phrase ajoutée à la
reconstitution énonçait l'identité des deux logos : elle a été retirée, et la recherche de la
formule rend 0 occurrence. Le livrable de **E-10** ne se relit qu'à travers des fragments que
l'auteur du retour a choisis autour du défaut, et son en-tête décrivait la contradiction à
trouver : la sélection elle-même fuit, aucune retouche ne la répare. **E-10 est retiré de la
mesure.** Le livrable de **E-15** portait une note de contraste reprise de l'explication du
retour ; elle a été retirée.

La mesure porte donc sur **9 livrables**, et le protocole s'applique tel qu'il est écrit : seuil ramené à
la même proportion (au moins 2 livrables de plus que la baseline sur 9), verdict **sous réserve**.
Le seul cas limite « fait extérieur au livrable » restant est **E-08**.
