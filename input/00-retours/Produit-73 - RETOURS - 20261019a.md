# Retours forges — Produit-73 — 20261019a

- **Contexte** : clôture du run `20261019-osp0901-exigences-implementables` — mise en conformité du produit à la politique de sécurité OSP0901 v1.0 (développement assisté par IA), décision humaine D-20 (a).
- **Références ledger** : `forge\ledger.jsonl` seq 125–126 (entrées `type: retour`, destinataire pilot) ; seq 124 et 127 pour l'ouverture et la clôture du run.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` :
  le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) ; un lot
  au nom réel posé à la racine est refusé (règle LOT-SAS de l'oracle, TF-1054) —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-10-19

---

## pilot (`digit-ai-factory`)

Deux artefacts recopiés du pilot à l'ouverture de session empêchent le produit de tenir ses propres portes : l'un échoue au lint que la CI du produit joue sur tout le dépôt, l'autre ne peut pas porter le réglage de sécurité qu'une politique d'entreprise impose désormais.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-13 | mineur | générique | **`forge/ledger.py`, recopié de `gabarits/ledger.py` à l'ouverture, échoue au lint du produit.** La CI du produit lance `ruff check .` sur tout le dépôt ; le fichier n'est pas encore suivi par git, mais le premier commit qui l'inclurait casserait la porte. *Mesuré le 19/10* : `ruff check .` → 7 erreurs, toutes dans `forge/ledger.py` (UP009, E401, I001, F401 ×2, E741, UP017), 0 dans le code du produit. | Rendre `gabarits/ledger.py` conforme aux règles ruff usuelles, ou poser son exclusion (`extend-exclude`) dans ce que l'héritage recopie chez le produit. Classe proposée : `heritage-non-conforme-aux-portes-du-produit`. |
| RV-14 | majeur | générique | **Le réglage de l'assistant ne peut pas porter une exigence de sécurité propre au produit.** La politique OSP0901 v1.0 (AI-DEV-04) interdit l'exécution et le commit automatiques de code généré ; le réglage qui le bloquerait vit dans `.claude/settings.json`, recopié depuis le pilot à chaque ouverture. *Mesuré le 19/10* : le relevé d'héritage de l'ouverture annonce 10 artefacts « MIS À JOUR à l'instant » en mode « copie identique », et déclare que « si l'un d'eux portait une modification locale, elle a été écrasée ». | Admettre une surcouche de permissions par produit, préservée par l'héritage (par exemple l'approbation requise pour `git commit`, `git push` et l'exécution de commandes), ou l'inscrire au gabarit pour les produits soumis à une politique de développement assisté. Classe proposée : `reglage-securite-produit-ecrase-par-heritage`. |

**Portée** (R-45, 21/08) : les deux sont *génériques* — ils tiennent aux artefacts hérités du pilot, que tous les produits reçoivent.

## Remarques restées au produit

- Trois constats du plan de réponse rédigé dans cette session, faux sur le code (neutralisation des formules déjà en place, documentation interactive déjà coupée en Azure, tests OCR existants), ont été corrigés au produit : erreur de la session, pas d'une forge. Généralisable : non.
- Les 3 tests de signature d'image en erreur sur le poste (WSL sans `/bin/bash`) se reproduisent sur le commit de départ : environnement du poste, consigné au produit. Généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. La stratégie de contrôle d'applications de Windows a bloqué `pip-audit` sur le poste (« Une stratégie de contrôle d'application a bloqué ce fichier ») ; c'est une contrainte du poste, pas d'une plateforme cible, et la CI rejoue la porte.

## Confirmations positives

- **Le refus du remisage sans étiquette a protégé l'arbre** : un `git stash` nu, prévu pour prouver un rouge → vert, a été refusé par le hook (TF-1754) ; la preuve a été faite par copies, sans toucher la pile partagée.
- **L'audit forge_tests a localisé ses PARTIEL** : chaque pan non couvert porte son motif et le geste pour le couvrir.

## Ordre recommandé

1. RV-14 — il bloque une exigence d'une politique de sécurité en vigueur depuis le 08/10/2026.
2. RV-13 — il ne casse rien tant que le fichier reste hors de git.

## La règle qui aurait évité le retour

Aucun des deux ne suit un retour humain.

- **RV-13** — aucune clé ne convient : classe proposée **`heritage-non-conforme-aux-portes-du-produit`**, famille **`heritage-produit`**, libellé : « Un artefact recopié du pilot chez un produit échoue aux portes que la CI du produit joue sur tout son dépôt ». Voisine : `artefact-d-oracle-hors-gitignore-socle`, qui vise un artefact d'atelier non ignoré, pas un code hérité non conforme.
- **RV-14** — aucune clé ne convient : classe proposée **`reglage-securite-produit-ecrase-par-heritage`**, famille **`heritage-produit`**, libellé : « Un réglage de sécurité que le produit doit porter vit dans un fichier que l'héritage recopie à l'identique, et toute modification locale est écrasée à l'ouverture suivante ». Voisine : `reglage-projet-ignore-par-la-forge`, qui vise un réglage posé mais lu trop tôt, pas un réglage écrasé.
