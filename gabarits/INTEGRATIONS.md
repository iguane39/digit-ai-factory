---
role: le CONTRAT D'INTÉGRATION d'un produit — par service externe, où est la vérité, quelle sonde la donne en entier, et ce que l'API cache par rapport à l'interface
gabarit_de: R-51 (TF-0547, 24/08/2026)
verifie_le: 2026-08-24
---

# `INTEGRATIONS.md` — le contrat d'intégration d'un produit

## À quoi sert ce document, et pourquoi il n'est pas une documentation

**Le fait qui l'a produit.** Un produit dépendait de **onze** sources externes — hébergeur, registrar,
API d'audience, API de balises, console de recherche, ligne de commande d'un fournisseur de cloud,
moteur de réservation, intégration continue, réseau de diffusion, messagerie d'entreprise, et son
propre dépôt. Pour **aucune** le dépôt ne disait où se trouve la source faisant autorité, ni quelle
sonde donne une réponse exhaustive. Chaque session redécouvrait — et se trompait.

**Les écarts mesurés en une seule session**, tous du même genre : un champ d'API qui omet ce que la
console exige ; un `404` rendu sur `HEAD` pour des pages qui répondent `200` en `GET` ; un outil en
ligne de commande dont l'appel se casse sur une valeur non protégée et rend un message qui accuse la
mauvaise cause ; un moteur de réservation qui plafonne une valeur **en silence** et rabat une langue
sans le dire, avec des réponses identiques à l'octet près.

*Ce document n'est donc pas une documentation de confort : c'est la liste des endroits où une réponse
peut être fausse sans le dire.* Un service qui échoue bruyamment n'a pas besoin d'être ici. Un service
qui répond faux avec assurance, oui.

## La forme, et chaque colonne a coûté quelque chose

| Service | Source faisant autorité | Sonde exhaustive | Écart connu API ↔ interface | Vérifié le | Risque de faux silence |
|---|---|---|---|---|---|
| *nom du service* | *l'endroit qui fait foi — console, API, fichier* | *la commande qui rend la réponse COMPLÈTE, pas la première qui répond* | *ce que l'API omet, plafonne ou rabat sans le dire ; « aucun connu » est une réponse* | *AAAA-MM-JJ* | *oui / non — peut-il produire une décision fausse SANS rien signaler ?* |

**Pourquoi la sonde exhaustive et pas « l'API »** : une liste ne dit pas qu'elle est complète. La
colonne nomme la commande qui énumère — l'introspection d'un schéma, un `--format=json` complet, un
appel qui rend les champs de vérification — et non celle qui a répondu la première.

**Pourquoi l'écart connu** : c'est la colonne qui empêche la prochaine session de refaire l'erreur.
Elle se remplit avec ce qu'on a payé, jamais avec ce qu'on imagine.

**Pourquoi la date** : sans elle, l'entrée ne périme jamais et se lit comme un fait présent.

**Pourquoi le risque de faux silence** : il ordonne la lecture. Les services qui échouent bruyamment
sont sans danger — on les voit. Ceux qui peuvent produire un blocage ou une décision fausse **sans
rien signaler** sont les seuls à relire avant chaque geste qui les touche.

## Ce que ce contrat n'est pas

- **Ce n'est pas un inventaire de dépendances.** Une bibliothèque épinglée n'a rien à faire ici : elle
  ne répond pas, elle ne ment pas.
- **Ce n'est pas un guide d'installation.** Les secrets, les jetons et les procédures vivent ailleurs ;
  ici on dit seulement *où est la vérité et comment on la lit en entier*.
- **Ce n'est pas figé.** Un écart découvert s'y ajoute le jour où il est payé — c'est la seule façon
  qu'il ne soit pas payé deux fois.

## Contrôle

`node oracles/oracle-integrations.mjs <chemin/INTEGRATIONS.md>` — I1 à I4. Un produit sans ce fichier
rend **SANS_OBJET**, jamais un échec : le contrat s'instaure, il ne se réclame pas rétroactivement.
