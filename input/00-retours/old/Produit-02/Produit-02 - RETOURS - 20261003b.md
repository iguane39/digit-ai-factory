# Retours forges — Produit-02 — 20261003b

- **Contexte** : statut Google Ads et Google Analytics du 03/10/2026, versions 20261003b et 20261003c, et étude d'amélioration des pages HTML qu'elles ont motivée. Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 378 à 385 (8 entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-10-03
- **Complétude** : 8 entrées `type: retour` destinées aux forges ou à la factory ne figuraient dans aucun lot remis : les seq 378 à 385, écrites le 03/10. Toutes sont portées ici et ont chacune leur candidature au sidecar. La seq 376 a été remise par le lot 20261003a.
- **Étude jointe** : `output\05-notes-et-prompts\Produit-02 - Etude amelioration des pages HTML - 20261003a.md` (oracle-etude-opportunite PASS), verdict O2 : composants et règles au socle.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Socle des pages HTML et oracles — lisibilité des données

Huit retours, dont trois suivent un retour humain du jour. Le fond commun : le socle ne fournit ni graphique, ni tuile, ni règle qui juge le contenu d'une infobulle ou la cohérence d'un indicateur. Chaque produit réécrit ces éléments à la main, et les retours humains se répètent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-118 | majeur | générique | **Infobulles qui répètent la page malgré le retour du 08/09 (TF-0954, toujours candidat) ; L3 pousse à poser un title redondant.** MESURE DU 03/10/2026. Version 20261003b : l'entonnoir affiche « 54 visites engagées » et son infobulle répète « 54 visites engagées » avec la définition déjà au lexique ; les infobulles des barres répètent le montant écrit au-dessus. Retour humain mot pour mot : « J'ai déjà remonté que des tooltips qui affichent ce qu'on a par ailleurs sur la page, ça n'a pas d'intérêt et que les tooltips doivent fournir des informations complémentaires. Pourquoi ce n'est pas le cas ici ? ». Causes : TF-0954 (08/09, même retour sur un autre produit) est au statut candidat, aucune règle ni gabarit ne le porte, et rien ne l'apporte dans le contexte d'une session produit ; L3 exige « title, aria-label, aria-describedby ou légende visible » sur toute valeur, et le title est la voie la plus courte : la session a posé « Statut de S1 » sur les pastilles pour passer L3. Correctif produit (20261003c) : légendes par aria-describedby, infobulles de compléments seulement. Proposition : règle d'oracle « infobulle redondante » (le title répète le texte visible de la cible ou de son voisinage immédiat → rouge) ; L3 recommande aria-describedby ; trancher TF-0954. Ledger seq 378 (type retour). | Règle d'oracle « infobulle redondante » (le title répète le texte visible de sa cible ou de son voisinage → rouge) ; L3 recommande aria-describedby plutôt que title ; trancher TF-0954. |
| RT-119 | majeur | générique | **Graphiques à une seule série alors que la demande et la donnée en portaient plusieurs ; le socle n'a aucun composant de graphique ni palette validée.** MESURE DU 03/10/2026. Version 20261003b : dépense par jour, par pays et par heure en barres d'une seule couleur, le détail par pays relégué à l'infobulle, alors que la demande disait « graphique argent, avec pays et montants ». Retour humain : « pourquoi est-ce qu'on n'est pas passé à un histogramme avec plusieurs valeurs par colonne, avec différentes couleurs ? Pourquoi est-ce que l'affichage reste aussi simple alors que c'était demandé ? ». Cause : digit-ai-page-html/assets ne contient aucun composant de graphique ; chaque page écrit son SVG à la main, et la voie la plus simple est la série unique ; la palette catégorielle validée du skill dataviz n'est branchée nulle part au socle. Correctif produit (20261003c) : barres empilées par pays (jour, heure) et par appareil (pays), palettes validées par validate_palette.js en clair et en sombre, filets de 2 px, légendes. Proposition : asset « barres empilées » (vertical, horizontal) avec palette en jetons et infobulle par segment ; avertissement d'oracle quand un graphique n'a qu'une série alors que sa source déclarée en a plusieurs. Ledger seq 379 (type retour). | Asset « barres empilées » (vertical, horizontal), palette catégorielle en jetons validée en clair et en sombre, infobulle par segment ; avertissement d'oracle « série unique » quand la source déclarée en porte plusieurs. |
| RT-120 | majeur | générique | **Détail des lignes en prose dense ; la grille de KPI du socle n'est qu'un extrait de code, sans comparaison ni écart.** MESURE DU 03/10/2026. Version 20261003b : le détail d'une campagne est une liste de phrases (« Groupe « Capacite », plafond 0,90 € par clic : 192 impressions, 20 clics… »). Retour humain : « Revois le format du détail de chaque ligne pour être plus simple à lire, avec moins de texte et plus de KPIs, via des tuiles par exemple ». Cause : composants.md section 1 « Grille de KPI » est un extrait, pas un asset embarquable ; il ne porte ni comparaison ni écart (état de l'art : valeur, comparaison, écart absolu et relatif — Zebra BI, 2026-09-23). Correctif produit (20261003c) : tuiles par chapitre et par groupe, mots-clés en barres compactes. Proposition : asset « tuiles d'indicateurs » (valeur, libellé, comparaison, écart, tendance optionnelle) et règle de lisibilité : un détail de plus de N chiffres en prose passe en tuiles. Ledger seq 380 (type retour). | Asset « tuiles d'indicateurs » (valeur, libellé, comparaison, écart, tendance optionnelle) ; règle de lisibilité : un détail chiffré dense en prose passe en tuiles. |
| RT-121 | bloquant | générique | **Un compte faux publié : Google Analytics rend deux valeurs du même indicateur selon le niveau de détail, et aucun oracle ne confronte deux valeurs d'un même indicateur.** MESURE DU 03/10/2026. Version 20261003b, livrée PASS 15/15 : « 54 visites sur 63 sont engagées : celles des 2 et 3 octobre, à 0 ce midi, sont maintenant comptées » et un rapport visites/clics de 108,3 % le 2 octobre. Faux : au grain du jour, l'API Google Analytics rend 64 visites dont 40 engagées, et 0 engagée les 2 et 3 octobre ; 54 vient de la somme des engagedSessions d'un rapport à la minute (dimension dateHourMinute), qui ne rejoue pas le compte du jour ; 108 % vient d'un rapport joint à sessionGoogleAdsCampaignName qui compte 13 sessions le 2 octobre contre 5 au grain du jour. Découvert en préparant la version c, par une 3e requête au grain du jour. Correctif produit : le grain du jour est la référence déclarée, l'engagement retiré du tableau à la minute, l'écart écrit. Proposition : règle « même indicateur, deux valeurs » (un même libellé d'indicateur porte deux nombres différents dans la page → rouge) ; consigne de sonde : une somme sur un rapport à dimension fine ne remplace jamais le total du rapport au grain de l'indicateur. Ledger seq 381 (type retour). | Règle « même indicateur, deux valeurs » (même libellé, deux nombres différents dans la page → rouge) ; consigne de sonde : une somme sur un rapport à dimension fine ne remplace jamais le total au grain de l'indicateur. |
| RT-122 | mineur | générique | **Faux positif : le nombre qui termine une infobulle, suivi de l'attribut x= de la barre suivante, est lu comme une multiplication.** MESURE DU 03/10/2026. oracle-calculs rend 17 constats bloquants « unité de FLUX consommée comme unité unitaire » sur la version c : le texte « clics vers la réservation (Google Ads) : 2"/> 26,69 27 sept. <rect class="seg c1" x="148.6" » est lu comme « 2 × … ». Contournement subi : terminer chaque infobulle par une ligne de mots (« source : API Google Ads »). Proposition : l'oracle lit le texte rendu (sans balises ni attributs), jamais le source HTML brut. Fixture verte : un SVG dont les title finissent par un nombre. Ledger seq 382 (type retour). | L'oracle lit le texte rendu, jamais le source HTML brut ; fixture verte : un SVG dont les title finissent par un nombre. |
| RT-123 | mineur | générique | **Faux positif : un champ de recherche plein texte pris pour un téléphone à cause du mot « mobile » dans son exemple de saisie.** MESURE DU 03/10/2026. oracle-saisie SA1, 3 constats durs : « champ « q-t-resa » au format connu (tel) rendu en type="search" », sur des champs dont l'exemple de saisie contient « mobile » (l'appareil des visiteurs). Contournement : data-type-motive sur chaque champ. Proposition : l'inférence de type ne lit pas le placeholder, ou exige un indice fort (label, name, autocomplete=tel). Ledger seq 383 (type retour). | L'inférence de type ne lit pas le placeholder, ou exige un indice fort (label, name, autocomplete=tel). |
| RT-124 | mineur | générique | **Deux règles inconciliables : dataviz prescrit l'étiquette directe dans un segment, render_page la juge en chevauchement.** MESURE DU 03/10/2026. render_page V4 rend 7 constats « rect.seg × text.dans, intersection 100 % du plus petit » sur les parts écrites dans les segments d'une barre empilée, étiquetage direct que le skill dataviz recommande (labels directs, encodage secondaire pour les paires de couleurs proches). Contournement : la part reportée après le total. Proposition : V4 exempte un texte déclaré étiquette de sa marque (classe ou attribut) contenu dans son rectangle. Ledger seq 384 (type retour). | V4 exempte un texte déclaré étiquette de sa marque (classe ou attribut) contenu dans son rectangle. |
| RT-125 | mineur | générique | **E3 et E7 ne reconnaissent pas les dates au format français JJ/MM/AAAA.** MESURE DU 03/10/2026. L'étude « Produit-02 - Etude amelioration des pages HTML - 20261003a » porte 5 sources datées « 13/03/2026 », « 23/09/2026 »… et un plan de revue « le 15/10/2026 » : E3 rend « 0 source(s) datée(s) » et E7 « plan de revue absent ou non daté ». La regex exige l'année en tête (20\d{2}[-/.]?\d{2}…). Passé à 2026-03-13 pour obtenir PASS, contre la convention de date française des livrables. Proposition : reconnaître JJ/MM/AAAA. Fixture : la même étude aux deux formats. Ledger seq 385 (type retour). | Reconnaître JJ/MM/AAAA à E3 et E7 ; fixture : la même étude aux deux formats. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui, ce qu'il en a corrigé, et si le défaut se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les infobulles, les graphiques à une série, le détail en prose et le compte faux de la version 20261003b. | Version 20261003c : infobulles de compléments, barres empilées, tuiles, référence au grain du jour ; barrière qualité 15 PASS et forge-design PASS. | oui | Généralisable : remonté en RT-118 à RT-121. |
| Le classement des recherches tapées (dans la cible, proche, hors cible) par liste de mots propre au domaine. | Écrit dans le générateur du produit, déclaré « classement par liste de mots » dans la page. | non | Rien de généralisable : la liste dépend de l'offre du domaine. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — vérifié par la session le 03/10/2026 : le statut est bâti sur `boilerplate.html` du skill digit-ai-page-html et l'étude sur `gabarits\ETUDE-OPPORTUNITE.md`, hors de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : le statut HTML compte trois versions, toutes du 03/10/2026, et aucun verdict humain ne dit sa forme réussie.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucune contrainte de plateforme n'a refusé ni contraint un déploiement, ce statut n'a rien déployé.

## Confirmations positives

- **Le composant d'infobulle du socle** (`infobulle.js`) rend une infobulle structurée sur un rectangle SVG, à la souris et au clavier, sans modification : vérifié dans un navigateur le 03/10/2026.
- **Le validateur de palette du skill dataviz** a tranché deux palettes en quelques secondes, et a refusé un gris (chroma trop faible) avant qu'il n'entre dans la page.

## Ordre recommandé

1. **RT-121** : un compte faux est sorti PASS ; la règle « même indicateur, deux valeurs » ferme cette voie.
2. **RT-118** : troisième occurrence d'un retour humain déjà candidat (TF-0954).
3. **RT-119 et RT-120** : les deux assets du verdict O2 de l'étude jointe, en un lot.
4. **RT-122 à RT-125** : faux positifs et règles inconciliables, correctifs locaux avec fixtures.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Trois retours suivent un RETOUR HUMAIN du 03/10/2026 :
- **RT-118** : la classe existe, `lecture-tiers-non-jugee`, et la candidature aussi (TF-0954), restée sans règle. Récidive à rattacher.
- **RT-119** : **classe à créer**, clé proposée `graphique-a-serie-unique-quand-la-donnee-en-porte-plusieurs`, famille `page-html-socle`. Libellé : « Le socle ne fournit aucun composant de graphique : chaque page écrit son SVG à la main et retient la série unique, la plus simple, même quand la demande et la donnée portent plusieurs séries (pays, appareils) ; aucune règle ne le relève. »
- **RT-120** : **classe à créer**, clé proposée `detail-chiffre-en-prose-faute-de-composant-de-tuiles`, famille `page-html-socle`. Libellé : « Le détail chiffré d'une ligne s'écrit en phrases faute de composant de tuiles embarquable ; la grille de KPI du socle est un extrait sans comparaison ni écart. »

Les autres viennent de mesures de session :
- **RT-121** : **classe à créer**, clé proposée `meme-indicateur-deux-valeurs-selon-le-grain-de-la-source`, famille `tracabilite-ledger`. Libellé : « Un indicateur est calculé en sommant un rapport à dimension fine (minute, jointure publicitaire) au lieu du rapport à son propre grain ; deux valeurs du même indicateur coexistent, et aucun oracle ne les confronte. »
- **RT-122, RT-123, RT-125** : `oracle-faux-positif`.
- **RT-124** : `deux-regles-du-socle-inconciliables`.
