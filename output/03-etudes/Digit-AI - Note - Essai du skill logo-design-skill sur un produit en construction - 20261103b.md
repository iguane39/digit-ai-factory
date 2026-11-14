# Digit-AI - Note : essai du skill logo-design-skill sur un produit en construction

> Provenance : agent `redacteur` (Sonnet), essai de la décision D-156 (a) du 03/11/2026. Destinataire : humain (le porteur).
> Verdict de l'arbitre : oracle d'écriture rejoué avant remise, voir la section Contrôles.
> Hypothèses non résolues : le nom du produit n'est pas arrêté (le dossier s'appelle Produit-86, nom de travail) ; la qualité de goût des 3 logos n'est pas jugée, seul le porteur la tranche.

## Ce qui change pour vous

Le skill tient sa promesse sur la méthode et ne la tient pas sur le contrôle. Sa recherche dans la bibliothèque a écarté un de mes concepts avant qu'il soit dessiné, et sa planche de comparaison est prête à montrer. Son audit, lui, a rendu 100/100 à 6 fichiers dont 3 avaient des défauts visibles à 16 px. Je recommande de l'adopter comme référence, sans l'installer : `systeme-de-marque` y gagne une branche « produit sans logo » qui pointe vers sa méthode.

## Ce qui a été fait

Le dépôt `kaankiziltug/logo-design-skill` (licence MIT, version 1.4.5, dernier commit du 20/10/2026) a été cloné dans un dossier jetable : 1 560 fichiers, dont 1 432 logos de marques d'autrui (`TRADEMARKS.md` les exclut de la licence MIT). J'ai lu en entier le `SKILL.md` (17 853 octets) et les 6 scripts Python que j'ai exécutés : `svglib`, `svg_audit`, `search_library`, `concept_sheet`, `render_png`, `preview_sheet`. Aucun n'ouvre de connexion réseau ; `render_png` lance Chrome local sur un fichier local.

Le brief vient des sections 0 à 3 de la fiche produit du 03/11 : plateforme de pentest autorisé, ton sobre, technique, traçable, invariants de scope signé, preuve rejouable et gate humain. Trois concepts en SVG, sans texte vivant, une seule couleur (`#14202B`) :

| Concept | Idée | Type |
|---|---|---|
| A, Équerres | deux équerres bornent un carré : ce qui est hors cadre n'existe pas | abstrait |
| B, Maillon vide | trois carrés en chaîne, le dernier creux tant qu'un humain ne l'a pas signé | abstrait |
| C, P au pied détaché | un P dont le pied est coupé : l'outil s'arrête avant le dernier geste | lettre |

Le skill s'arrête pour une revue humaine avant le jeu d'icônes ; je m'y suis arrêté. `export_variants.py` et `presentation_board.py` n'ont pas été joués.

## Apports du skill

La recherche dans la bibliothèque a joué son rôle de test de familiarité. Mon premier concept A était un anneau ouvert autour d'un point ; `search_library.py --subject ring` a rendu `circleci` (anneau entaillé autour d'un point plein, noté exemplaire) et `opensource` (anneau à ouverture en trou de serrure). J'ai remplacé A avant de le dessiner.

Le rendu à taille réelle a montré ce que l'audit ne montre pas. À 16 px, B se réduit à des points en diagonale et C se lit « P! » à 64 px. Après un premier tour, j'ai épaissi A et B (équerres de 36 au lieu de 28, carrés de 64 au lieu de 56, trait du creux de 20 au lieu de 14 sur 256) ; B reste faible à 16 px.

L'épreuve de l'étagère (`preview_sheet.py --refs-industry security-identity`, 17 références) montre les 3 logos distincts de la catégorie, qui penche vers le rouge, le bouclier et le dégradé. C'est la meilleure pièce du skill.

## Limites du skill

`svg_audit.py` a rendu 100/100 aux 3 fichiers du premier tour comme aux 3 du second, avec zéro avertissement. Il vérifie la propreté d'un SVG (texte vivant, filtres, angles proches, centrage), pas la qualité d'un logo. Les 6 fichiers sont faits de rectangles, d'arcs et d'équerres exacts : le contrôle ne pouvait pas les prendre en défaut. Le jugement reste à celui qui regarde la planche.

## Contrôles de la forge de design

Rejoués sur une page-support de la planche (3 balises `img` avec `alt`, `width` et `height`, jetons posés), avec `run-oracles-design.mjs --rendu` : verdict PASS sur 12 juges (slop, tokens, motion, bascule, caractères de contrôle, taste, faits commerciaux, images, `render_page` clair et sombre, `oracle-a11y`). Le premier passage a échoué, par ma faute : la page-support nommait Inter, police réflexe (S3), et posait une pile de polices en dur (T2). Corrigé dans la page, pas dans les logos.

Seuls s'appliquent à une image : `oracle-images` (I1 à I7 : alt, plafonds de poids, zéro réseau, variantes qui rendent différemment) et, sur la page qui la porte, `render_page` et `oracle-a11y`. Sur un SVG nu, `oracle-tokens` échoue en T0 (aucun jeton déclaré) et trois juges rendent SKIP : ils ne s'appliquent pas. `oracle-barre-externe` demande une référence et un arbitrage humain sur captures : non joué. Aucun juge de la forge ne mesure la lisibilité d'un logo à 16 px ni sa distinction.

## Coût

Lecture du skill et de ses 6 outils : environ 103 Ko de texte, soit 30 000 jetons estimés. Session entière, brief et note compris : environ 115 000 jetons estimés, sous le plafond de 150 000. Durée : 349 secondes entre le clonage et la dernière planche, dont environ 1 minute d'exécution ; `run-oracles-design --rendu` prend 25 secondes.

## Verdict : adopter comme référence

1. Ne pas installer le skill ni sa bibliothèque : 1 432 marques d'autrui entreraient sur le poste, et `systeme-de-marque` n'a pas besoin de 17 Ko de consignes de plus.
2. Reprendre sa méthode dans `systeme-de-marque`, en branche « produit sans logo » : liste des clichés de la catégorie, 3 concepts d'idées différentes, test de familiarité contre une bibliothèque, rendu à 16 px et en une couleur, arrêt pour revue humaine.
3. Garder `concept_sheet.py` et `preview_sheet.py` comme outils de planche, code MIT lu en entier. Un contrôle de lisibilité à 16 px reste à créer dans la forge de design : proposition, rien n'est inscrit au registre.

## Sorties

- `C:\dev\_Client-A\Produit-86\output\logo-essai-20261103\` : `concept-a-equerres.svg`, `concept-b-maillon-vide.svg`, `concept-c-p-pied-detache.svg`, `planche-comparaison.png` et `planche-comparaison.svg`. Rien n'est commité.
- Mesures conservées : dossier `essais\logo\mesures\` du répertoire temporaire de la session (audits, sorties de `run-oracles-design`).

## Sources

`SKILL.md` et `scripts/` du clone du 03/11/2026 ; `TRADEMARKS.md` ; sorties de `search_library.py`, `svg_audit.py`, `concept_sheet.py`, `preview_sheet.py` ; sortie JSON de `node oracles\run-oracles-design.mjs … --rendu` ; fiche produit du 03/11/2026, sections 0 à 3.
