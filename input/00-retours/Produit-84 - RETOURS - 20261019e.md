# Retours forges — Produit-84 — 20261019e

- **Contexte** : autre — exécution hors run, le 19/10/2026, des corrections demandées par l'utilisateur sur l'étude comparative Cloudflare + Supabase ou Azure, une page HTML de données
- **Références ledger** : `forge\ledger.jsonl` seq 31 à 36 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 19/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre non interrogé dans ce lot : le pilot rattache à l'accueil. RT-15 à RT-20 entrent comme neufs. RT-18 recoupe une consigne humaine répétée 4 fois chez un autre produit, sans règle exécutée au socle.

## digit-ai-forge-agents

Quatre défauts vus par l'utilisateur sur des captures, alors que tous les oracles du socle rendaient PASS.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-15 | majeur | générique | Étude `output\06-etudes\Produit-84 - Etude comparative - Pages Supabase ou Azure - 20261019e.html`, encadré des démarches, sans `colgroup`. Sonde à 1920 px : colonne « Équipes » à 41 % de largeur et 10 % de remplissage, colonne « Demandes à refaire » à 16 % et 93 %, ligne de 607 px. `render_page.py` rend PASS aux 7 largeurs. Après `colgroup` dérivé du contenu (heuristique de `references/composants.md`) : 347 px. Ledger seq 31 | Mesurer, par colonne, la part de largeur et le taux de remplissage (hauteur du contenu sur hauteur utile de la ligne) ; une colonne d'au moins 25 % remplie à moins de 50 %, à côté d'une colonne remplie à plus de 85 %, est un défaut |
| RT-16 | mineur | générique | Même page : la cellule « Équipes » est écrite avec des virgules, à côté de cellules en liste à puces ; la colonne « Ce qu'il faut faire » tient 3 à 4 points en un paragraphe. Deux remarques de l'utilisateur. `check_html.py` et `render_page.py` PASS. Ledger seq 32 | Signaler une cellule de 2 phrases ou plus, dont chacune ouvre sur un libellé suivi de deux-points, et deux cellules d'une même ligne de formes différentes |
| RT-18 | majeur | générique | Même page : 22 codes de règle (`ADR0302`, `OSP0901`, `AI-THIRD-01`) cités nus dans la prose, `check_html.py` PASS. L3 (d) ne repère que les empreintes et les jetons à tirets. Ledger seq 34 | Étendre L3 (d) aux codes de la forme lettres puis chiffres, hors `<code>` et hors glossaire ; exiger une infobulle qui dit ce que le code impose |
| RT-19 | mineur | générique | Même page, tableau `t-comp` : la première colonne nomme 19 composants sans définition ; L27 ne vise que les en-têtes de colonne. Ledger seq 35 | Étendre L27 aux en-têtes de ligne d'un tableau comparatif : ce que c'est, ce que ça fait, ce qui compte |

## digit-ai-factory

Deux règles de la doctrine ne se rencontrent pas au moment où une page HTML est écrite.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-17 | majeur | générique | Texte extrait de la même page : 807 phrases, 15 de plus de 35 mots (une de 102), 45 de plus de 25. `oracle-ecriture.mjs` sur ce texte : PASS, le seuil d'échec étant 7 phrases longues d'affilée. Le hook `ecriture` de `factory.mjs` ne joue qu'à l'écriture d'un `.md`. Ledger seq 33 | Jouer `oracle-ecriture` sur le texte extrait de tout `.html` écrit ; compter les phrases de plus de 35 mots sur l'ensemble, pas seulement en série |
| RT-20 | majeur | générique | Encart des coûts de la même page : 224 € contre 320 €, le pare-feu web réglé par Client-A étant compris côté Azure et absent côté Cloudflare + Supabase, sans le dire. Six relectures à l'aveugle ne l'ont pas relevé dans ces termes. Ledger seq 36 | Exiger, dans tout comparatif de coûts, une rubrique « compris, non compris » et la conséquence sur le périmètre comparé |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Déséquilibre des colonnes vu sur une capture au tour précédent, classé mineur sans être corrigé ni dit | colgroup dérivé du contenu, sonde de remplissage | oui, par RT-15 | Remonté en RT-15 |
| Ligne « Règles de Client-A » du comparatif, jugée sans objet par l'utilisateur : le socle est pensé pour Azure | ligne retirée ; les dérogations restent aux conditions du chapitre 1 | non | Corrigé sur place |
| Page sécurité officielle de Supabase non lue : la protection par Cloudflare des adresses de Supabase manquait, signalée par l'utilisateur d'après Gemini | lecture des pages sécurité, restrictions réseau et PrivateLink de Supabase, et des offres Cloudflare ; ligne « Protection » corrigée | non | Corrigé sur place |
| Relectures à l'aveugle : 7 passes, de nouveaux points graves à chaque passe (3, 0, 1, 3, 1, 6) | chaque point recompté à la source puis corrigé | non | Corrigé sur place |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque documentaire sur ce lot.

## Documents mûrs

Déclaré au lot 20261019d : « Etude comparative - Pages Supabase ou Azure » reste au produit.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

L'heuristique de largeurs de colonnes du socle, appliquée telle quelle, a ramené la ligne la plus haute de 607 à 347 px sans réglage à la main.

## Ordre recommandé

1. RT-17 et RT-18 : la règle existe, seul son oracle ne la voit pas.
2. RT-15 et RT-20 : défauts visibles du lecteur, sans aucune règle exécutée.
3. RT-16 et RT-19.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-15** : aucune règle ne mesure le remplissage des colonnes. Classe à créer : clé `colonnes-desequilibrees`, famille `page-html-socle`, libellé « Une colonne large reste presque vide pendant qu'une étroite étire la ligne ».
- **RT-16** : aucune règle ne voit une énumération en prose dans une cellule. Classe à créer : clé `cellule-enumeration-en-prose`, famille `page-html-socle`, libellé « Une cellule énumère plusieurs points en paragraphe, ou diffère de forme de ses voisines ».
- **RT-17** : E-2 n'est pas mesurée sur le HTML. Classe à créer : clé `ecriture-html-non-mesuree`, famille `hook-ou-gate`, libellé « Le plancher d'écriture n'est jugé que sur le Markdown ; le texte d'une page HTML lui échappe ».
- **RT-18** : L3 (d) ignore les codes de règle. Classe à créer : clé `code-regle-sans-infobulle`, famille `page-html-socle`, libellé « Un code de règle cité nu, sans ce qu'il impose ».
- **RT-19** : L27 ignore les en-têtes de ligne. Classe à créer : clé `entete-ligne-sans-definition`, famille `page-html-socle`, libellé « Un en-tête de ligne n'explique pas ce qu'il nomme ».
- **RT-20** : aucune règle de périmètre pour un comparatif de coûts. Classe à créer : clé `cout-perimetre-non-declare`, famille `gabarit-document`, libellé « Deux totaux comparés sans dire ce que chacun comprend ».
