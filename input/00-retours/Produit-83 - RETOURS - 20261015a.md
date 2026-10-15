# Retours forges — Produit-83 — 20261015a

- **Contexte** : ouverture du run de version `Produit-83-20261015-construction`, demande humaine du 15/10/2026
- **Références ledger** : `forge\ledger.jsonl` seq 34 (reponse_humain) et 35 (retour)
- **Remise au pilot** : copie dans `<pilot>\input\00-retours\_arrivee\`, avec le sidecar.
- **Statut** : a_remettre

---

## Pilot (`digit-ai-factory`)

Le commanditaire demande que le produit livré soit complet au regard de sa fiche, et qu'un composant manquant ne retire aucun usage.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-7 | majeur | générique | Demande humaine du 15/10/2026, citée dans `forge\BRIEF-DELTA-20261015.md` : le produit livré doit couvrir toutes les exigences de la fiche, les personas et tous leurs usages ; un paramètre, une clé d'API ou un composant manquant ne doit pas bloquer l'implémentation ; l'usage reste présent, inactif, avec son motif et l'action à mener selon le rôle. Chez ce produit, la règle tirée de la décision D8 (« aucune fonction Creditsafe visible sans identifiants ») allait à l'inverse, et le gabarit `gd-fiche-produit` 1.0.0 ne porte ni personas ni usages par persona. | Une règle de socle, avec son oracle : chaque exigence de la fiche a son implémentation et son test ; chaque usage qui dépend d'un composant a un état « en attente » rendu à l'écran, avec le motif et l'action par rôle. Une section « Personas et usages » dans le gabarit `gd-fiche-produit`. Règle qui aurait évité le retour : aucune, d'où la règle § 4 de quality-oracles. |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par Claude, le 2026-10-15.

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output\Digit-AI - Fiche produit Beef Project - Prospection - 20261014a.html` | gd-fiche-produit · 1.0.0 | une section Personas et usages, et l'état « en attente de composant » de chaque usage | le commanditaire a demandé, le 15/10/2026, la réponse aux personas et à tous leurs usages, que la fiche ne portait pas | à ajouter au prochain indice de la fiche | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Aucune sur ce lot : il n'ouvre qu'un retour.

## Ordre recommandé

1. RT-7, seul retour du lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-7 suit un retour humain. Aucune règle du socle ne couvre la complétude d'un produit contre sa fiche ni l'état d'un usage en attente de composant : c'est un domaine sans oracle, et la règle § 4 de quality-oracles s'applique.
