# Retours forges — Produit-62 — 20260915b

- **Contexte** : friction interne observée en séance, sans retour humain, et celle-ci a failli abîmer un livrable destiné à un service tiers. Le générateur d'index de dossiers du pilot écrit un `README.md` dans **chaque** sous-dossier d'`output\`, y compris à l'intérieur d'un livrable-dossier dont le format est imposé par un tiers — ici un projet Power BI, dont l'arborescence est lue par Microsoft Fabric. Neuf fichiers d'index se sont ainsi retrouvés dans le projet, dont quatre sous le dossier de définition du modèle sémantique, et le client de publication les emportait dans sa charge.
- **Références ledger** : `forge\ledger.jsonl`, entrées du 2026-09-15 (défaut mesuré, parade, lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-15

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `scripts\readme-dossiers.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-17 | majeur | générique | **Le générateur d'index écrit un `README.md` à l'intérieur d'un livrable-dossier au format imposé par un tiers, et ce fichier part ensuite dans la charge envoyée au service.** Fait observé le 2026-09-15 : `node scripts\readme-dossiers.mjs --base .` a déposé **9 fichiers d'index** dans `output\Client-A - Projet Power BI - 20260911b\`, dont `Tenancy Schedule Asset.SemanticModel\definition\README.md`, `…\definition\tables\README.md`, `…\definition\cultures\README.md` et trois dans l'arborescence du rapport. Le dossier est passé de **29 à 37 fichiers**. Mesure de l'effet : le client de publication, qui envoie à l'interface de programmation Fabric **tout fichier trouvé sous le dossier du modèle**, comptait **26 parties au lieu de 22** pour le modèle sémantique et **6 au lieu de 3** pour le rapport. Un fichier inconnu sous `definition\` est au mieux refusé par le service, au pire accepté dans un modèle qui n'est plus celui qui a été recetté. Le même générateur a signalé au passage « rôle non rédigé » sur un de ses propres fichiers, c'est-à-dire qu'il crée un défaut de conformité dans un dossier dont personne ne rédigera jamais les rôles, puisqu'il n'appartient pas au produit mais à Microsoft. *Un format imposé par un tiers n'est pas un dossier de travail : y écrire, fût-ce un index, c'est modifier un livrable sans le savoir.* | **(1)** Le générateur reconnaît les livrables-dossiers au format imposé et **n'y descend pas** : une marque suffit — un fichier `.format-impose` à la racine du dossier, ou la présence d'un manifeste tiers connu (`*.pbip`, `*.SemanticModel`, `*.Report`, `.platform`, `package.json`…). **(2)** À défaut de marque, une liste d'exclusion déclarée par le produit, lue par le générateur (le ledger de ce produit portait déjà, le 2026-09-14, une décision implicite désignant ce dossier comme « livrable-dossier au format imposé » — l'information existait, rien ne la lisait). **(3)** Fixture double sens : un dossier ordinaire d'`output\` reçoit son index (PASS), un dossier portant la marque n'en reçoit aucun, à aucune profondeur (PASS), et le décompte des fichiers du dossier marqué est identique avant et après passage. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le client de publication emportait les fichiers étrangers au format | une liste de noms étrangers (index de dossier, résidus d'explorateur) est écartée de la charge à quelque profondeur qu'ils soient, et un contrôle de recette l'éprouve : 9 fichiers étrangers sur le disque, 0 dans la charge | oui, mais c'est une parade, pas la cause : tout producteur qui publie un dossier vers un tiers devrait ignorer ce qui n'appartient pas au format — versé en remarque, la cause est remontée en RF-17 | resté au produit |
| Les index déposés dans le projet ont été commis avec le tour | non corrigé : les supprimer les ferait revenir au prochain passage du générateur, et supprimer des fichiers est un geste humain (R-29) | non | resté au produit, action ouverte |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le livrable touché est un projet au format Microsoft, produit par ce mandat et non par un gabarit du pilot.

## Confirmations positives

- Le générateur a nommé lui-même le fichier fautif dans sa sortie (« rôle non rédigé » sur un README du projet), ce qui a mis la puce à l'oreille avant toute publication : sans cette ligne, les neuf index seraient partis vers le service.
- Le client de publication construisait déjà sa charge par une fonction unique, ce qui a permis d'écarter les fichiers étrangers en un seul endroit et de l'éprouver par une fixture rouge réelle plutôt que simulée.

## Ordre recommandé

1. RF-17 — un générateur qui écrit dans un livrable au format imposé abîme silencieusement ce livrable ; le défaut n'a été vu ici que parce qu'une publication vers un tiers était en cours, et il touche tout produit qui livre un dossier structuré.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

L'item ne suit pas un retour humain mais une friction observée en séance. Classe : **RF-17** → `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` (famille `regle-morte`, correspondance APPROCHÉE : la classe vise un outil qui agit sur un emplacement sans vérifier ce qu'il y trouve ; ici le générateur descend dans tout sous-dossier sans regarder si ce dossier lui appartient. Classe candidate `generateur-ecrit-dans-un-format-impose`, même famille, libellé proposé : « un script du socle écrit dans un livrable-dossier dont le format est imposé par un tiers : le livrable change sans que personne ne l'ait décidé, et le défaut ne se voit qu'au moment de la livraison »).
