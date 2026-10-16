# Retours forges — Produit-79 — 20261007f

- **Contexte** : production du QR-Code Wifi et de la page A5 « Wifi » du 07/10/2026 (`output\Produit-79 - Guide - QR-Code Wifi - 20261007h.svg`, `output\Produit-79 - Guide - Connexion Wifi A5 - 20261007g.html`)
- **Références ledger** : `forge\ledger.jsonl` seq 64, 65, 66 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## forge-agents (`digit-ai-forge-agents`)

Deux contrôles du socle `digit-ai-page-html` ont jugé rouge une page saine. Chacun a coûté un tour de lecture du script.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-7 | mineur | générique | `check_html.py` L19 annonce « exemption possible par data-coupure-ok=<raison> ». Posé sur le `<dd>` qui porte `overflow-wrap: anywhere`, l'attribut n'est pas honoré et L19 reste bloquant ; contourné en enveloppant la valeur dans `<code>` (ledger seq 64) | honorer `data-coupure-ok` sur l'élément visé par la règle CSS, ou retirer l'exemption du message |
| RA-8 | majeur | générique | `render_page.py` V4 lit les tracés d'un logo SVG inline comme des blocs de mise en page : 120 constats bloquants sur un seul logo, levés seulement en titrant chaque `<g>` du logo (ledger seq 66) | traiter un `<svg role="img">` porteur d'`aria-label` comme une figure unique, comme le groupe titré de TF-0424 |

## forge-design (`digit-ai-forge-design`)

Une police imposée par la marque du client ne peut pas se déclarer.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | mineur | générique | `oracle-slop` S3 juge « police réflexe » Cormorant Garamond, police de titre de la charte du domaine (`main.css` du site). Aucune voie de déclaration : le FAIL reste et passe au carnet des écarts (ledger seq 65) | lire les polices du dossier de marque du produit, ou un attribut `data-police-de-marque`, et exempter S3 pour elles |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le gris secondaire de la page mesurait 4,46:1 sur blanc | foncé à `#5d6d73` | non | défaut de la session, pris par la mesure de contraste avant remise |
| La mise à l'échelle CSS de la feuille A5 rognait la page à 390 px | feuille fluide à l'écran, A5 fixe à l'impression | non | défaut de la session, vu par `render_page.py` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : la page Wifi en est à sa première version.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le décodage du QR-Code par zxing-cpp sur 9 rendus (PNG de 70 à 1 600 px, PDF de 72 à 300 dpi) a servi d'oracle exécuté du domaine « QR-Code » ; il a validé l'emblème centré avant toute revue à l'œil.

## Ordre recommandé

1. RA-8 : un logo inline suffit à rendre toute page rouge.
2. RD-1 : chaque produit à charte imposée portera le même écart.
3. RA-7.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RA-7 : L19 de `check_html.py`, dont l'exemption annoncée n'est pas honorée.
- RA-8 : V4 de `render_page.py`, exemption TF-0424 limitée aux groupes titrés.
- RD-1 : S3 d'`oracle-slop`, sans voie pour une police de marque.
