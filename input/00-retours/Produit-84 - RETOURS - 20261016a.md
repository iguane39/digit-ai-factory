# Retours forges — Produit-84 — 20261016a

- **Contexte** : autre — retour humain sur une fiche A4 bilingue (note de sécurité Supabase) déclarée tenue sur une page alors qu'elle n'y tenait pas
- **Références ledger** : `forge\ledger.jsonl` seq 1, 2 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier, de son sidecar et de sa pièce jointe dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

Pièce jointe : `Produit-84 - RETOURS - 20261016a - PJ - oracle-format-a4.py`. C'est l'oracle écrit dans le tour pour mesurer la demande : 4 largeurs d'écran, le média print à la largeur imprimable, 5 configurations d'impression. Il sort en 1 si un cas dépasse une page.

## Rattachement

Registre interrogé le 16/10/2026 : `grep -i -E 'A4|une page|format de page|nombre de pages|page-count|impression|@page|media print|print-to-pdf' todo/TODO.jsonl | wc -l` → 404 ligne(s) trouvée(s). Lecture des titres par `grep -i -E '"(titre|title)":"[^"]*(A4|une page|format d|impression|imprim)' todo/TODO.jsonl` → 49 titres lus en entier.

Items recoupés : TF-1020 (forge-audit : une fiche PDF sort sur deux pages sur un seul environnement). Le défaut est voisin, mais propre au juge de forge-audit et sans lien avec une demande de l'humain. TF-1351 (une fiche sécurité livrée en PDF A4) demande un format, sans le mesurer. Aucun item ne porte un oracle de format imprimé pour le socle des pages HTML : RT-1 et RT-2 entrent comme neufs.

## digit-ai-forge-agents (`digit-ai-page-html`, `client-a-page-html`)

La demande « une page A4 » a été déclarée tenue alors que la fiche faisait 374 mm de haut à l'écran et 2 pages imprimée avec des marges ordinaires.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | majeur | produit+générique | La fiche `output\02-fiches\…\20261016a.html` passait `check_html` (PASS), `render_page` sur 7 largeurs (PASS) et `run-oracles-design` (PASS). Mesure rejouée après le retour humain : écran 210 × 374 mm ; PDF A4 marges 10 mm avec en-têtes : 2 pages ; marges par défaut de Chrome (0,4 in) : 2 pages. Deux causes : aucune feuille bornée à 297 mm à l'écran, et une règle `@media (max-width: 720px)` sans `screen`, déclenchée à l'impression parce que la largeur imprimable d'un A4 est d'environ 698 px. Le boilerplate du socle écrit lui aussi `@media (max-width: 640px)` sans `screen`. | Aucune règle ne couvre ce retour (§ 4 de quality-oracles) : il manque un oracle de format imprimé. Esquisse : l'oracle joint, sorti en 1 si un cas dépasse ; dans le socle, `@media screen and (max-width: …)` pour toute règle de petit écran. Classe proposée, **RT-1** : `format-demande-non-mesure-chez-le-lecteur`, famille `page-html-socle`, libellé « Une demande de format explicite (une page A4) est déclarée tenue sur une mesure faite dans une seule condition de rendu, jamais dans celles du lecteur ». |

## pilot (`digit-ai-factory`)

La restitution a annoncé « Fiche A4 tenue sur 1 page » sur une seule mesure, et l'humain a dû redemander.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-2 | majeur | générique | Restitution du 16/10/2026 à 10:22 : « Fiche A4 tenue sur 1 page ». La mesure venait de `chrome --print-to-pdf --no-pdf-header-footer` avec `@page { margin: 0 }`, une condition que ni l'écran ni une impression ordinaire ne reproduit. Retour humain mot pour mot : « Le document ne tient pas sur une page A4 … Que les demandes de format soient réellement respectées. » `oracle-synthese` a rendu le message affichable. | La règle qui aurait évité le retour : R-61 (« N exigences sur M tenues ») ne s'applique qu'au mot « livré » et ne prend pas les demandes de format. Esquisse : une demande de format du message humain (pages, format de papier, nombre de diapositives, longueur) devient une exigence de la restitution, avec la sortie de l'oracle qui la mesure dans les conditions du lecteur. Classe : `controle-vrai-sur-le-mauvais-invariant` (le nombre de pages d'un PDF à marges nulles a été mesuré, au lieu de « tient chez le lecteur »). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fiche ne tenait pas sur une page A4 | Version `20261016b` : feuille 210 × 297 mm, marges étroites 12,7 mm, zone utile 270 mm, corps 9 pt, règle mobile limitée à `screen` ; l'oracle joint rend 10 cas sur 10 PASS, et Chrome et Edge imprimant avec leurs réglages par défaut donnent 1 page | oui | Remontée en RT-1 et RT-2 |
| Le premier état de l'oracle joint se trompait deux fois : média print mesuré à 794 px au lieu de 698, puis PDF produits en média écran | Corrigé dans l'oracle avant tout verdict (largeur imprimable calculée, `emulate_media(print)`) | oui | Porté par l'oracle joint à RT-1 : un oracle de format doit imprimer en média print, à la largeur imprimable |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. La fiche part du boilerplate du skill `client-a-page-html`, qui n'est pas une famille de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Les oracles `check_html.py`, `render_page.py` et `run-oracles-design.mjs` ont relevé et fait corriger un contraste insuffisant, des bandeaux latéraux et une couleur en dur. Ils jugent bien ce qu'ils mesurent ; seul le format leur échappe.

## Ordre recommandé

1. RT-1 : l'oracle existe déjà en pièce jointe, et `screen` est un mot à ajouter au boilerplate. Gain immédiat pour toute fiche imprimée.
2. RT-2 : la règle de restitution reprend le format demandé comme exigence et cite la sortie de l'oracle RT-1.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-1** : aucune règle existante. C'est un domaine sans oracle, d'où la classe proposée `format-demande-non-mesure-chez-le-lecteur` (famille `page-html-socle`).
- **RT-2** : R-61 du pilot, à étendre aux demandes de format ; la classe existante est `controle-vrai-sur-le-mauvais-invariant`.
