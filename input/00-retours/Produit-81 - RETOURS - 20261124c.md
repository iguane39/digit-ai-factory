# Retours forges — Produit-81 — 20261124c

- **Contexte** : taille du texte du DAT de Produit-81 corrigée à la demande du porteur (24/11/2026) : le texte grossissait avec la largeur de l'écran. Produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 59 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 24/11/2026

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-46 (majeur) — Le plafond de mesure de lecture tenu en gonflant la police, sans qu'aucun oracle ne le voie

**Le fait.** Le 24/11/2026, le DAT de Produit-81 reprend la feuille de style du DAT de Prism, colonne à 75 % de la fenêtre. Elle porte `html { font-size: clamp(16px, calc(1.25vw - 8px), 48px) }`. Mesure au rendu : texte courant à 24 px à 2 560 px et à 41 px à 3 840 px, titre principal à 88 px. Le porteur : « Pourquoi est-ce que c'est écrit aussi gros, je n'ai jamais demandé ça. » La cause est dans le socle de rendu. V18 plafonne la prose à 135 caractères par ligne dès 2 560 px. L2 refuse la bride posée sur le paragraphe. Sur une colonne de 2 544 px, gonfler la racine est la voie la plus courte pour tenir les deux, et `render_page` la juge PASS. `check_html` et la critique d'implémentation ne disent rien non plus. La session de Produit-81 a copié la règle telle quelle et lu le verdict sans regarder la page à 2 560 px.

**Le coût, prouvé.** Un DAT remis à l'indice `20261124g`, le schéma seul à l'indice `20261124h` pour garder son lien valide, deux passes complètes de vérificateurs, et un lecteur qui reçoit un texte deux fois et demie trop grand sur son écran.

**La règle qui aurait évité le retour.** Un plafond de mesure de lecture se tient par la largeur du conteneur de lecture (`.lire`, `data-mesure-lecture`), jamais par la taille du texte. La taille du texte courant rendu reste bornée aux grandes largeurs, par exemple à 20 px au plus à 2 560 et 3 840 px. **Clé proposée** : `regle-tenue-en-gonflant-la-police`, famille `page-html-socle`, libellé « Un plafond de mesure de lecture (caractères par ligne) est tenu en faisant grossir la police avec la fenêtre au lieu de borner le conteneur de lecture : la page passe les oracles et le texte devient démesuré sur un grand écran ».

**Juge proposé.** V18 de `render_page`, ou une règle sœur, mesure la taille calculée du texte courant à 2 560 et 3 840 px et refuse au-delà du seuil. Son message de remède nomme le conteneur de lecture, jamais la police. Fixture rouge : la racine en `clamp(16px, calc(1.25vw - 8px), 48px)` du 24/11/2026 ; fixture verte : racine à 16 px et prose dans `.lire` à 1 080 px.

## Rattachement

Registre interrogé le 24/11/2026 : `todo/CLASSES.json` du pilot (331 classes).

- RT-46 : `deux-regles-du-socle-inconciliables` vise deux règles qu'aucun auteur ne peut tenir ensemble. Ici elles se tiennent ensemble par un conteneur de lecture, mais la voie la plus courte est un contournement que rien ne juge. `viewport-de-conception-non-fixe` vise la largeur de référence absente, or elle est fixée (E5). Clé neuve en `classe-a-creer`.

## Remarques restées au produit

- La page de Prism porte la même racine fluide : sa session est seule juge de sa correction. Signalé ici pour mémoire. Généralisable : oui, couvert par RT-46.

## Retours sur les documents produits

- **Gabarit** : `gd-dossier-architecture`, version `1.1.1`.
- **Ajouté à la main** : la racine fixée à 16 px et le conteneur de lecture de la prose, dans la couche propre à Produit-81 du générateur.
- **Gêne du lecteur** : le porteur a relevé un texte démesuré sur son écran (voir RT-46).
- **Manque** : le squelette ne prescrit ni la taille du texte courant ni le conteneur de lecture d'une page large.
- **Portée** : valable pour la famille.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
