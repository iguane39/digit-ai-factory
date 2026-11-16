# Retours forges — Produit-82 — 20261112f

- **Contexte** : vérification par la session du travail de l'agent constructeur sur le portail unique, avant tout déploiement en recette ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 221
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`), contrat `gabarits/AGENT-CAMPAGNE.md`

Le retour porte sur la preuve que le contrat demande à un agent constructeur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-34 | majeur | générique | Le 12/11/2026, l'agent constructeur a livré 5 jalons avec `make test` exit 0 avant chaque commit, et son arbitre a jugé « vérifications natives vertes » : ✓. Une relecture indépendante, en lecture seule, a trouvé ensuite 1 défaut bloquant (le temps 2 de la migration retire des comptes sans identité), 2 majeurs et 4 tests qui prouvent moins que leur exigence. La critique de rendu jouée par la session sur l'instance servie a refusé 7 écrans sur 9 ; l'agent ne l'avait pas jouée. Ledger seq 221 et 224. **RT-34** : clé proposée `constructeur-sans-relecture-independante`. | Le contrat d'un agent constructeur prescrit, avant son rapport, la critique d'implémentation sur l'instance servie pour tout écran écrit, et le rapport déclare qu'aucune relecture indépendante n'a eu lieu. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 11 constats de la relecture indépendante, de C1 à C11 (seq 221) | consigne de correction remise à un agent de campagne ; C4 et C6 posés au porteur en D-26 et D-27 | oui, voir RT-34 | en cours |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le relecteur indépendant, sans contexte de l'auteur, a trouvé le défaut bloquant en lisant le code seul, sans rien exécuter.

## Ordre recommandé

1. RT-34 : seul retour du lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité : un agent constructeur joue la critique d'implémentation de chaque écran écrit sur l'instance servie avant son rapport. Classe proposée : **RT-34** `constructeur-sans-relecture-independante`, famille `skill-ou-oracle-non-invoque`, libellé « Un agent constructeur rend un travail vert sur ses propres tests sans critique de rendu ni relecture indépendante ».
