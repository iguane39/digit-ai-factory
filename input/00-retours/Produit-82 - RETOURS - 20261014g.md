# Retours forges — Produit-82 — 20261014g

- **Contexte** : retour humain sur la restitution de fin de P4 du brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 52, 53, 54
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur la consigne de restitution et sur son juge `oracle-synthese`, au bloc du verdict.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-10 | majeur | générique | Le 14/10/2026, la restitution `Produit-82 - Note Synthese P4 Recette Railway - 20261014g`, PASS sur 65 règles, déclare « P4 close » et « le brief mené jusqu'au bout ». Le service ne sert pourtant que des réponses de mock. Aucune clé de fournisseur n'est posée, la console est injoignable et l'adresse n'a pas de page d'accueil. Ouverte dans un navigateur, l'adresse rend 401. Retour humain, mot pour mot : « Comment est-ce qu'on peut considérer que le produit est fini et livré ? ». Ledger seq 52 à 54. **RT-10** : clé proposée `verdict-de-livraison-sur-critere-de-brief-sans-usage-reel`. | Un verdict de livraison dit ce qu'un utilisateur peut faire du livrable à l'instant, en plus du critère de sortie du brief, et nomme ce qui manque pour un usage réel. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Verdict « livré » sur une instance de recette | restitution `20261014h` : critère du brief tenu, produit non utilisable, manques nommés | oui | remonté sous RT-10 |
| `/v1/models` annonce 8 modèles, dont seul le mock répond | déclaré à la restitution, décision posée | non | relève du produit |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Produit-82 - Note Synthese P4 Recette Railway - 20261014g.md` | gd-restitution · RESTITUTION.md 2.36.0 | une rubrique « ce que l'utilisateur peut faire à l'instant » au verdict | « Comment est-ce qu'on peut considérer que le produit est fini et livré ? » | l'état d'usage réel, mesuré par 3 appels | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La mesure qui a tranché a pris 3 appels : la page d'accueil, un modèle réel et la liste des modèles.

## Ordre recommandé

1. RT-10 : un verdict de livraison démenti par le premier clic coûte la confiance du lecteur dans tous les verdicts suivants.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit un retour humain. La règle qui l'aurait évité : un verdict de livraison est mesuré du point de vue de l'utilisateur, par l'usage réel du livrable, et pas seulement contre le critère de sortie du brief. Classe proposée : **RT-10** : `verdict-de-livraison-sur-critere-de-brief-sans-usage-reel`, famille `restitution-forme`, libellé « Un verdict déclare livré ce qui tient le critère d'un brief, sans dire ce qu'un utilisateur peut en faire à l'instant ».
