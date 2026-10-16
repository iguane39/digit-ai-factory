# Retours forges — Produit-82 — 20261014i

- **Contexte** : consigne humaine de finir l'implémentation après une restitution de clôture P4, brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 60, 61, 62
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur la définition de « livré » pour tout produit, quelle que soit sa forge.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-12 | majeur | générique | Le 14/10/2026, le run Produit-82 a clos P2, P3 et P4 avec 10 exigences sur 35 non tenues. Le service déployé n'avait ni page d'accueil ni console joignable : sa racine rendait « api key authentication failure: no API Key found ». La restitution l'a pourtant présenté comme livré. L'humain a répondu : « Il faut que tout soit implémenté, que l'administrateur de l'appli n'ait qu'à saisir les clés à la fin pour que cela soit utilisable complètement. Et remonte ce point à la Factory pour les futurs produits ». Ledger seq 60 et 61. Le tour suivant a implémenté les 10 exigences et la saisie guidée des clés, en une recette de 33 tests. **RT-12** : clé proposée `livraison-partielle-presentee-comme-produit`. | Règle de livraison au socle : un produit n'est « livré » que si toutes les exigences de sa fiche sont implémentées et testées. Seuls les secrets (clés de fournisseurs, jetons) restent à saisir par l'administrateur, par un geste guidé unique et documenté. Un run qui s'arrête avant le dit, et sa restitution liste ce qui manque. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le pool PostgreSQL amont se fige parfois 30 s : « pool timed out », console et budgets bloqués, avec 4 connexions ouvertes sur 20 permises (ledger seq 62) | `maxConnections` porté à 20 (défaut amont 5) ; reprises dans `scripts/console.py` et le portail, sans doubler une écriture ; 5 recettes sur 5 au vert | non, propre à agentgateway | contourné au produit, défaut amont à signaler |
| L'identifiant d'un modèle contient « / » ; la console rendait 404 sur sa suppression | identifiant encodé dans le chemin (`scripts/console.py`) | non | corrigé au produit |
| Des éditions faites par script Python en mode texte sous Windows ont écrit `entree.sh` en CRLF ; sur Railway, `retention` et `recette` redémarraient en boucle sur « Syntax error: word unexpected » | `preparer.py` force le LF du script copié dans l'image ; fichiers modifiés ramenés en LF | oui, tout produit qui édite des scripts shell depuis Windows | corrigé au produit |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Produit-82 - Note Synthese P4 Recette Railway - 20261014g.md` | RESTITUTION.md, version du gabarit 2.36.0 | un contrôle « toutes les exigences de la fiche tenues » avant le mot « livré » | « Comment est-ce qu'on peut considérer que le produit est fini et livré ? » | la mesure exigence par exigence, puis l'implémentation | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le mode hybride d'agentgateway a suffi à tout piloter à chaud par son API : clients, rotation, suspension, fournisseurs et saisie des clés, sans fork.

## Ordre recommandé

1. RT-12 : chaque futur produit refera l'aller-retour tant que « livré » n'a pas de définition opposable.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une consigne humaine. La règle qui l'aurait évitée : avant d'écrire « livré », la restitution confronte chaque exigence de la fiche à un test du produit, et seuls les secrets peuvent rester à la main de l'administrateur. Classe proposée : **RT-12** : `livraison-partielle-presentee-comme-produit`, famille `restitution-forme`, libellé « Un produit est restitué comme livré alors que des exigences de sa fiche ne sont ni implémentées ni testées, au-delà des seuls secrets à saisir ».
