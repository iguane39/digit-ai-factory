# Retours forges — Produit-62 — 20260918b

- **Contexte** : exécution du protocole de qualification d'un rapport migré, écrit la veille par l'analyse de prompt `20260917r` et remonté en RF-27. Les 3 oracles que ce protocole exigeait et qui n'existaient nulle part ont été écrits, exécutés et rendus verts sur un cas réel — ils cessent d'être une proposition et deviennent du code repris tel quel. C'est la suite directe de RF-21 (l'oracle de rendu), RF-22 (l'oracle de fidélité de mise en page) et RF-27 (le contrat de qualification).
- **Références ledger** : `forge\ledger.jsonl`, entrées du 2026-09-18 à 15:29 (`type: mesure`, étape 0), 16:10 (`type: execution`, qualification) et 16:20 (`type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-18

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-forge-data (verbes `restituer` / `reconcilier`, migration de rapports)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-29 | majeur | générique | **Les 3 oracles réclamés par RF-21, RF-22 et RF-27 existent maintenant en code exécuté et vert sur un cas réel : ils sont à reprendre, pas à réécrire.** Fait observé le 2026-09-18 : le protocole de qualification a été exécuté de bout en bout sur le rapport « Tenancy Schedule Asset (prototype) », et les 3 contrôles qui manquaient ont été écrits puis joués. **(1) L'oracle de rendu** (`forge\etapes\data\qualifier-rendu.py`, schéma `qualification/rendu@1`) : `ExportTo` PDF, suivi jusqu'à `Succeeded`, **téléchargement BINAIRE** du fichier, rendu de chaque page en image par `pypdfium2`, extraction du texte, recherche de **7** libellés d'erreur du service. Mesure rendue : export **27,0 s** sous la borne de 60 s, **449 705** octets, **1** page, **2 235** caractères, **51,22 %** de pixels non blancs, **0** libellé d'erreur — là où le même rapport rendait un PDF de **1 415** octets et **0** caractère déclaré `Succeeded` le 2026-09-15. Le point qui n'allait pas de soi : `pbi_publier.appel` décode en UTF-8 et ne peut donc pas rapatrier un PDF ; le téléchargement se fait en binaire, sans quoi l'oracle ne voit rien. **(2) L'oracle de fidélité de mise en page** (`qualifier-mise-en-page.py`, schéma `qualification/mise-en-page@1`) : `Report/Layout` du PBIX (UTF-16-LE dans l'archive) comparé au `report.json` PBIR, objet par objet — nom, type, x, y, largeur, hauteur, plan, ordre, visibilité, au pixel près (tolérance 0,01), plus les ressources du design présentes et référencées. Mesure rendue : **21** objets comparés, **0** écart, **4** ressources. **(3) L'oracle de périmètre à l'OCCURRENCE** (`qualifier-perimetre.py`, schéma `qualification/perimetre@1`), qui comble un angle mort de la recette du produit : ses contrôles P5 et P6 comptent des objets de modèle **distincts** (75) et des couples (page, en-tête) **distincts** (70), quand le rapport affiche **83** occurrences ; deux occurrences partageant un en-tête comptent pour une, et un champ perdu dont l'en-tête existe ailleurs sur la même page passerait inaperçu. Mesure rendue : **83** occurrences couvertes sur 83, **0** champ en plus. *Trois oracles nommés depuis 2 jours dans des retours, écrits en une exécution, et verts sur le premier cas réel : ce qui manquait n'était pas la règle, c'était le code.* | **(1)** Reprendre les 3 scripts comme oracles de forge-data, sous les 3 schémas nommés, et les câbler aux étapes E4 (transposer), E5 (recette) et E7 (prouver le rendu) du runbook de migration remis en RF-24 — sans ce câblage, la procédure redevient de la discipline. **(2)** Chacun rend déjà un champ **`ne_prouve_pas`** en clair : le conserver au contrat, c'est la seule pièce qui empêche des verdicts verts de valoir une garantie de remplacement (l'exigence de RF-27). **(3)** Généraliser hors migration : appliqués avant et après toute évolution d'un rapport, ces 3 oracles forment une **recette de non-régression** de rapport Power BI. **(4)** Le verdict de bascule à 3 états — remplaçable / remplaçable sous conditions énumérées / non remplaçable — a été rendu sur un cas réel et a conclu « sous conditions », avec 4 conditions énumérées : la forme tient, elle peut entrer au contrat `qualification-rapport@1`. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 4 écarts de chiffres relevés par la réconciliation (garantie bancaire à zéro, loyer variable N-1, chiffre d'affaires certifié N-1, remises de rang 1) | déjà ouverts sous les actions A-112 et A-115 du produit, repris comme conditions de bascule | non — ce sont des écarts de chargement et de calcul propres à ce jeu de données | resté au produit |
| L'ancre de comparaison est un instantané du 2025-12-08, faute d'accès à l'espace du rapport d'origine | repli déclaré en tête du rapport de qualification, avec sa date et ce qu'il ne permet plus de juger | oui, déjà porté par RF-26 (la branche d'échec d'accès qui déclare son repli) | remonté via RF-26 |
| L'en-tête de colonne « ce que l'oracle ne prouve pas », exigé par le protocole, est refusé par le plancher d'écriture comme tournure d'annonce | renommé « Angle mort de l'oracle » — même contenu, un en-tête qui nomme au lieu de promettre | oui, et c'est une précision utile au contrat de RF-27 : le libellé de la colonne doit nommer, sa présence reste obligatoire | remonté ici, en RF-29 (2) |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de la bibliothèque sur ce lot : le rapport de qualification suit la forme prescrite par le prompt réécrit de l'analyse `20260917r`, qui n'est pas un gabarit du pilot. C'est un manque à noter — un gabarit « Qualification » (ancre déclarée, écarts non assumés, écarts assumés avec leur décision, une section par dimension avec son oracle et son angle mort, verdict de bascule fermé) rendrait la prochaine qualification comparable à celle-ci.

## Confirmations positives

- Le protocole écrit la veille a été exécuté **sans adaptation** : ses 6 dimensions, ses 3 classes de verdict et son étape 0 de prérequis d'accès ont tenu sur le premier cas réel, y compris la branche d'échec (401 → repli déclaré).
- La règle 40 du produit (« un test proposé s'exécute ») a été tenue à la lettre : les 3 oracles proposés la veille ont été écrits et joués dans le même tour, plutôt que cités comme à faire.
- Le rendu a été lu **à l'image** et non seulement par son verdict : bandeau, segments, barre de pays et grand tableau ont été vus, ce qui a fait apparaître un angle mort que le texte extrait ne montrait pas — les colonnes hors du cadre de l'export.

## Ordre recommandé

1. **RF-29** — le code existe, il est vert, et il ferme les 3 oracles réclamés par RF-21, RF-22 et RF-27 ; le reprendre coûte une relecture et un câblage, le réécrire coûterait une journée.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-29** → `controle-ecrit-non-cable-a-son-etape` (famille `skill-ou-oracle-non-invoque`, correspondance **approchée** : ici les contrôles n'existaient nulle part, et les règles qui les réclamaient — R1 du runbook, RF-21, RF-22 — vivaient dans des textes opposables sans code pour les jouer). Classe candidate, même famille, libellé proposé : `regle-nommee-sans-code-qui-la-joue` — « une règle est écrite, remontée et acceptée, et aucun code ne l'exécute : elle vaut une intention jusqu'à ce qu'un producteur l'écrive, et chaque produit la réécrit à sa façon ».
