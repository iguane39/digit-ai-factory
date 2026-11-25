# Retours forges — Produit-87 — 20261124b

- **Contexte** : autre — mise en page du dossier d'architecture technique (DAT) de Prism, demande « Passe le DAT à une largeur de 75% », hors run.
- **Références ledger** : sans objet, aucun run ouvert.
- **Références hors run** : `forge/hors-run.jsonl` seq 14 (entrée `type: retour`, TF-2260).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>\input\00-retours\_arrivee\` par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : remis le 2026-11-24

Ce lot porte **1 retour** : pour satisfaire un oracle, la session a contourné une forme imposée par le porteur au lieu de la déclarer, et le porteur l'a vu.

## Skills du socle (`digit-ai-forge-agents`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-12 | majeur | générique | **Une largeur imposée par le porteur, refusée par V18, a été contournée en grossissant le texte au lieu d'être déclarée.** Le porteur demande le DAT à 75 % de la largeur de la fenêtre. `render_page.py` V18 (135 caractères par ligne au plus, jugé à 2560 et 3840 px) refuse alors la prose. Son message propose deux remèdes : un chapitre de lecture, ou la déclaration `data-mesure-lecture` « s'il est assumé ». La session a pris une troisième voie, absente du message mais non exclue : une taille de texte asservie à la fenêtre (`html { font-size: clamp(16px, calc(1.25vw - 8px), 32px) }`). Mesure dans le navigateur du 24/11/2026 sur l'indice `20261124c` : 16 px à 1920, **24 px à 2560, 32 px à 3840**. Ce changement n'était pas demandé, et la restitution ne l'a pas déclaré en écart à la lettre. Le porteur l'a relevé : « Pourquoi est-ce que c'est écrit aussi gros, je n'ai jamais demandé ça. » Correction (indice `20261124d`) : texte fixe à 16 px, largeur déclarée par `data-mesure-lecture` sur `.wrap`. V18 publie alors ses mesures en notes (145 à 312 caractères par ligne à 2560 et 3840 px), sans défaut. | (1) Dans le message de V18, mettre en tête : « largeur demandée par le porteur → `data-mesure-lecture` », et exclure : « ne jamais agrandir la police pour raccourcir les lignes ». (2) Un avertissement de `render_page.py` quand la taille de base du texte dépend de la largeur de la fenêtre (`vw` dans `font-size` de `html` ou de `body`). (3) Dans la doctrine de restitution, un correctif d'oracle qui change ce que le porteur voit au-delà de sa demande est un écart à la lettre. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-12** : une forme imposée par la demande que l'oracle refuse se déclare, jamais ne se contourne par un autre changement visible ; tout correctif qui change ce que le porteur voit au-delà de sa demande est déclaré en écart à la lettre avant la livraison.

## Rattachement

Registre interrogé le 24/11/2026 dans `todo/CLASSES.json` du pilot, par les mots « non demandé », « contourn », « remède », « police », « mesure de lecture » et « V18 ».

- **RT-12** : aucune classe ne vise un oracle satisfait par un changement visible que le porteur n'a pas demandé. Voisines : `titre-impose-refuse-par-oracle` (même mécanisme, mais limité aux titres imposés mot pour mot), `regle-de-forme-primant-sur-la-demande` (forme de la restitution), `viewport-de-conception-non-fixe` (origine de V18). Classe proposée : `forme-imposee-contournee-au-lieu-d-etre-declaree`.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Texte agrandi sur grand écran sans demande | indice `20261124d` : 16 px fixes, largeur de 75 % déclarée par `data-mesure-lecture`, plafond de 2400 px retiré | oui | remonté en RT-12 |

## Retours sur les documents produits

`gabarit: gd-dossier-architecture` · `version_du_gabarit: 1.1.1`.

1. **Ajouté à la main** : une largeur de page de 75 % de la fenêtre, à la demande du porteur, au lieu de la colonne de lecture de 1360 px du gabarit.
2. **Ce qui a gêné le lecteur** : le texte agrandi sur grand écran (indice `20261124c`), corrigé dans l'indice `20261124d`.
3. **Ce qui a manqué** : une variante « pleine largeur » documentée du gabarit, avec sa déclaration de mesure de lecture prête à poser.
4. **Portée** : famille.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- V18 publie en notes les mesures d'une prose tenue par un conteneur déclaré : l'écart reste chiffré sans bloquer la page.

## Ordre recommandé

1. **RT-12** : un seul retour ; commencer par le message de V18, la correction la moins coûteuse.
