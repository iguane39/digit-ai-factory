# Retours forges — Produit-82 — 20261014f

- **Contexte** : retour humain sur la restitution de fin de P4 du brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 49, 50
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur la consigne de restitution (`gabarits\RESTITUTION.md`) et sur son juge `oracle-synthese`.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-9 | majeur | générique | Le 14/10/2026, la restitution `Produit-82 - Note Synthese P4 Recette Railway - 20261014f`, jugée PASS par `oracle-synthese` sur 63 règles, annonçait un service déployé sans en donner l'adresse au bloc 0 ni au verdict. L'adresse n'apparaissait qu'au bloc 4 et aux traces. Retour humain, mot pour mot : « L'URL n'est même pas fournie avec le prompt, ce n'est pas normal ». Ledger seq 49 et 50. **RT-9** : clé proposée `restitution-sans-acces-au-service-livre`. | Une règle de restitution : un service déployé ou une page publiée se nomme par son adresse cliquable au bloc 0 et en tête du verdict, avec le geste pour s'en servir (point d'accès, emplacement de la clé, commande d'essai). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Restitution de fin de P4 sans l'adresse du service | version `20261014g` : adresse au bloc 0 et en tête du verdict, commande d'essai rejouée | oui | remonté sous RT-9 |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Produit-82 - Note Synthese P4 Recette Railway - 20261014f.md` | gd-restitution · RESTITUTION.md 2.36.0 | un emplacement pour l'adresse du service livré | « L'URL n'est même pas fournie avec le prompt, ce n'est pas normal » | adresse, points d'accès, clés et commande d'essai en tête du verdict | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La commande d'essai écrite dans la restitution a été rejouée telle quelle avant la remise : réponse du service, 30 tokens d'usage.

## Ordre recommandé

1. RT-9 : le lecteur d'une restitution de déploiement cherche d'abord où le service répond.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit un retour humain. La règle qui l'aurait évité : une restitution qui annonce un service déployé ou une page publiée en donne l'adresse cliquable au bloc 0 et en tête du verdict. Classe proposée : **RT-9** : `restitution-sans-acces-au-service-livre`, famille `restitution-forme`, libellé « Une restitution annonce un service déployé ou une page publiée sans en donner l'adresse et le geste d'accès là où le lecteur lit d'abord ».
