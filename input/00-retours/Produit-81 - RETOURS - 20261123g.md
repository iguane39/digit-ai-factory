# Retours forges — Produit-81 — 20261123g

- **Contexte** : support de présentation Design Authority de Produit-81 (indices a à i du 23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 50 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-37 (mineur) — Des indices remplacés laissés dans le dossier principal

**Le fait.** Le 23/11/2026, le porteur demande pourquoi les anciennes versions du support Design Authority sont toujours dans `output/Design Authority/`. Les indices a à h y étaient restés à côté de l'indice i. La convention du dépôt range les versions antérieures dans `output/old/<dossier>/` (déjà suivie pour l'audit) ; elle n'a pas été appliquée à chaque nouvel indice, et aucun contrôle ne l'a signalé. Corrigé dans le tour : a à f et h déplacés par `renommer-livrable.mjs`, avec trace dans `forge/renommages-livrables.jsonl`. L'indice g reste en place, ouvert dans PowerPoint (`git mv` refusé).

**Le coût, prouvé.** Un dossier de livraison encombré de 8 versions périmées, relevé par le porteur ; une question et un rangement en plus, sans perte.

**La règle qui aurait évité le retour.** À l'écriture d'un nouvel indice sous `output/`, l'indice qu'il remplace part dans `output/old/<dossier>/` dans le même tour, par le script de renommage tracé. **Clé proposée** : `indice-remplace-laisse-en-place`, famille `versionnement-livrable`, libellé « Un nouvel indice d'un livrable est écrit sous output/ et l'indice qu'il remplace reste dans le même dossier : le lecteur ne sait plus lequel fait foi ».

**Juge proposé.** Contrôle de fin de tour : sous `output/`, hors `old/`, un dossier qui porte plusieurs indices d'un même radical est signalé, avec la commande de déplacement de chacun des plus anciens.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes). Famille `versionnement-livrable` : `livrable-ecrase-sans-indice` vise l'inverse (pas de nouvel indice) ; aucune ne vise l'ancien indice non rangé. Clé neuve en `classe-a-creer`.

## Remarques restées au produit

- Indice g à déplacer une fois fermé dans PowerPoint — généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
