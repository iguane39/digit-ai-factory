# Lot de retours — Produit-64 → pilot (régénération des README : consigne inexécutable, puis écrasement de README rédigés et écriture dans un dossier gelé) — 2026-10-13, indice b

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `scripts/readme-dossiers.mjs` et `oracles/hook-ouverture.mjs` (consigne R-44 affichée à l'ouverture).

**Origine** : session du 13/10/2026, mise à jour du comparatif des pipelines ; geste de la session à 17:34 (heure de Paris), découvert et annulé par elle dans la minute.

Ce lot porte **1 retour** (RT-45).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`scripts/readme-dossiers.mjs`, `oracles/hook-ouverture.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-45 | majeur | générique | **La consigne d'ouverture fait rejouer `readme-dossiers.mjs` sur tout le produit, et le script écrase alors les README rédigés à la main et écrit dans un dossier gelé.** (1) La consigne affichée à l'ouverture dit « rejouer `node scripts\readme-dossiers.mjs` avant l'enregistrement » : chez ce produit, `scripts/` n'existe pas (`MODULE_NOT_FOUND`), et le script du pilot lancé sans `--base` refuse (« ce generateur ecrirait dans c:\dev\digit-ai-factory — un autre depot »). (2) Relancé avec `--base C:/dev/_Client-A/Produit-64`, il a réécrit le 13/10 à 17:34:17-18 **41 README suivis par git dont la version suivie était rédigée à la main** (aucune marque « Généré par », aucun bloc `ROLE`) : le texte de chaque dossier a été remplacé par « _(rôle à rédiger …)_ » et une table générée. Exemple : `output/03-Syntheses/README.md`, dont le paragraphe « Synthèses navigables et schémas de process produits pour l'engagement… » et le tableau des rôles par fichier ont disparu. (3) Il a **créé 22 README non suivis**, dont `output/07-Standards Client-A/baseline-iso-91-20260710b/README.md` — dossier que le `CLAUDE.md` du produit déclare « ne se modifie jamais » (témoin de non-régression) — et 20 dans `compliance-pack/__tests__/fixtures/`, où un fichier de plus peut changer le résultat d'un banc. Tout a été annulé par la session : 41 `git checkout`, 22 suppressions, 0 trace restante au contrôle par horodatage. | (a) La consigne donne la commande exacte et bornée : chemin du pilot, `--base`, et `--racines` limité au dossier écrit, pas tout `input,output`. (b) Le script ne réécrit pas un README dont la version suivie n'a pas sa marque : il reprend le texte existant dans le bloc `ROLE`, ou il s'abstient et le signale. (c) Il n'écrit dans aucun dossier qui se déclare gelé (LISEZMOI « ne se modifie jamais ») ni sous `__tests__/` ou `fixtures/`. |

**Portée** : générique. Tout produit qui suit la consigne d'ouverture est exposé ; les items voisins `TF-1610` et `TF-1620` ont borné `input\` le 12/10, pas `output\`, et ne traitent ni l'écrasement d'un README rédigé ni les dossiers gelés.

## Rattachement

Registre interrogé le 13/10/2026 (`todo/TODO.jsonl`, termes « readme-dossiers », « readme » croisé avec « écras », « perd », « baseline », « gel », « fixture », « __tests__ », « ROLE:DEBUT ») : voisins `TF-1610`, `TF-1620` (README créés en masse sous `input\`, corrigés le 12/10), `TF-1509` (rôles du pilot posés chez un produit, corrigé), `TF-1470` et `TF-1506` (`--base .` ajouté au prompt d'adoption). Aucun ne couvre l'écrasement des README rédigés, l'écriture dans un dossier gelé, ni la commande de la consigne d'ouverture.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 41 README rédigés écrasés, 22 README créés, dont un dans le témoin gelé | annulation immédiate : `git checkout` des 41, suppression des 22 créés à 17:34, contrôle par horodatage à 0 | oui | remonté : RT-45 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le refus du script sans `--base` est juste : il a empêché une écriture dans le dépôt du pilot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-45** : aucune classe existante ne convient.
  - Clé proposée : `regeneration-ecrase-contenu-redige`
  - Famille : `outillage-generation`
  - Libellé : « Un générateur de fichiers d'index réécrit un fichier rédigé à la main, ou écrit dans un dossier gelé, faute de vérifier la marque du fichier suivi et le statut du dossier »

## Ordre recommandé

1. **RT-45 (a)**, parce qu'une consigne qui donne la bonne commande, bornée au dossier écrit, évite le geste large.
2. **RT-45 (b) et (c)**, parce qu'ils protègent même quand la commande large est lancée.

## Note de réception du pilot (14/10/2026)

Le lot a été refusé à la porte le 14/10/2026 : ses classes ne figurent pas au référentiel `todo/CLASSES.json`. Le pilot les fait entrer par la voie prévue pour un défaut neuf (TF-1128) : `"classe": "classe-a-creer"` avec la classe proposée ci-dessous, rangée dans une famille existante. La classe se crée au référentiel à l'instruction du retour.

- `regeneration-ecrase-contenu-redige` — famille `readme-role` ; libellé : Un generateur de fichiers d index reecrit un fichier redige a la main, ou ecrit dans un dossier gele, faute de verifier la marque du fichier suivi et le statut du dossier (avant la note : famille « outillage-generation » inconnue).
