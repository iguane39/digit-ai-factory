# Retours forges — Produit-81 — 20261124b

- **Contexte** : DAT de Produit-81 remis au format du DAT de Prism, à 75 % de la largeur de l'écran, à la demande du porteur (24/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 58 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-45 (majeur) — Deux DAT du même client, au même gabarit, rendus dans deux formats

**Le fait.** Le 24/11/2026, les DAT de Produit-81 et de Prism, deux produits du même client, sont produits le même jour au gabarit `gd-dossier-architecture` 1.1.1 par deux sessions parallèles. Le gabarit prescrit les 8 sections du noyau ; son squelette HTML est à la charte Digit-AI. Chaque session a donc inventé son rendu Client-A. Prism : page écrite à la main, encart « À retenir » en 4 cartes, sommaire latéral, chapitres « Sources » et « Lexique ». Produit-81 : générateur Markdown sur la coquille des schémas Client-A, sans ces chapitres. Le porteur : « Pourquoi les 2 DATs n'ont pas le même format alors qu'ils utilisent les 2 la même base ? Pourquoi autant d'écarts ? ». En reprenant le format de Prism, la session de Produit-81 a copié une feuille de style que la session de Prism modifiait encore : une taille de texte fluide est apparue entre deux lectures, à quelques minutes d'écart.

**Le coût, prouvé.** Un DAT entier remis en forme (indice `20261124e`), un indice de plus pour le schéma seul (`20261124f`, pour garder ses liens valides), une feuille de style copiée deux fois, deux passes complètes de vérificateurs.

**La règle qui aurait évité le retour.** Une famille de gabarit porte un squelette au rendu de chaque client servi (ici, la charte Client-A). Avant d'écrire une instance, la session liste les instances de la même famille chez les autres produits du client et reprend la plus récente comme forme de référence. **Clé proposée** : `rendu-divergent-entre-produits-du-client`, famille `gabarit-document`, libellé « Deux produits d'un même client instancient la même famille de gabarit dans deux rendus différents, faute de squelette au rendu du client et de recherche de l'instance sœur ».

**Juge proposé.** `oracle-gabarits-documents --livrable` compare la structure d'une instance (titres de chapitres, encarts, feuille de style) à celle de la dernière instance de la même famille chez le même client, et signale l'écart.

## Rattachement

Registre interrogé le 24/11/2026 : `todo/CLASSES.json` du pilot (331 classes).

- RT-45 : `gabarit-famille-manquante` vise une famille absente ; `gabarit-sans-parite-de-theme` vise un thème clair ou sombre manquant. Aucune clé ne vise deux rendus d'une même famille chez un client. Clé neuve en `classe-a-creer`.

## Remarques restées au produit

- La page du schéma seul `20261124d` renvoyait au DAT `20261124c`, rangé dans `old/` : corrigé par l'indice `20261124f` — généralisable : non, propre à cette remise en forme.

## Retours sur les documents produits

- **Gabarit** : `gd-dossier-architecture`, version `1.1.1`.
- **Ajouté à la main** : encart « À retenir », chapitres « Sources » et « Lexique », tableaux des instances par environnement et de la feuille de route, tous repris du DAT de Prism.
- **Gêne du lecteur** : le porteur a relevé que les deux DAT n'avaient pas le même format (voir RT-45).
- **Manque** : aucun squelette au rendu Client-A ; les chapitres « Sources » et « Lexique » ne sont pas prévus par le gabarit.
- **Portée** : valable pour la famille.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
