# Retours forges — Produit-62 — 20260908j

- **Contexte** : dix-neuvième retour humain sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset` — décision D-1 tranchée en option (a), puis « crée un nouveau fichier différent de celui existant qui reconstruis tout le Data Lineage déjà réalisé, mais uniquement avec ces 66 colonnes en cible, en respectant exactement le format du fichier HTML déjà généré ». Fait dans le livrable `20260908u`. Ce lot porte deux causes génériques découvertes en re-périmétrant, dont une **nuance sur RA-24 du lot 20260908i** : la sonde que ce lot signalait comme faux positif a, dans le même tour, attrapé un VRAI défaut — l'information compte, parce qu'un faux positif seul invite à retirer la règle.
- **Références ledger** : `forge\ledger.jsonl` seq 66 (décision et demande), seq 67 (livrable `20260908u`, périmètre et verdicts), seq 68 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-09

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## forge-agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-27 | majeur | générique | **Nuance opposable sur RA-24 : la sonde V15 attrape de VRAIS défauts, et la retirer coûterait plus que ses faux positifs.** Dans le tour qui a suivi le dépôt de RA-24, la même sonde a signalé un quatrième constat sur la page `20260908u`, de signature nettement différente des trois autres : en-tête à 58 px pour un `top` déclaré de 219, coupable `header.doc.colle` et non `nav.toc.colle`, **49 px masqués** au lieu de 10 ou 11, sur un tableau de **125 px** de haut au lieu de 25 203. Cause réelle, mesurée : le tableau des colonnes écartées du chapitre du périmètre était **VIDE** — le filtre du mode cible avait réduit la population source, et son titre annonçait pourtant 276 lignes. Aucun autre contrôle ne l'a vu : `check_html` PASS 39 règles, `oracle-filtres-tableau` PASS, la recette du chapitre ne comptait pas encore ce tableau. Autrement dit, la famille V15 a rendu un service qu'aucune autre sonde ne rend, le jour même où un lot la signalait comme bruyante. | Corriger V15 **sans la désarmer**, et c'est le point de ce retour : (1) la garde de RA-24 — ne pas mesurer quand `rt.bottom - rth.height < attendu`, l'en-tête étant alors bridé par la fin de son propre tableau ; (2) le `recul` choisi en position de LECTURE ; (3) **distinguer les deux signatures dans le message** : « bridé par la fin du tableau » (informatif) et « recouvert par un collant alors qu'il pouvait atteindre son `top` » (bloquant). Une règle qui sépare ses deux causes dans son texte ne s'apprend pas à ignorer — c'est ce que le faux positif de RA-24 était en train de produire. Fixture triple : tableau court (PASS), tableau vidé par un filtre en amont (FAIL, cas de ce tour), tableau haut recouvert (FAIL). |

## forge-data (`digit-ai-forge-data`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-11 | majeur | générique | **Un référentiel de lineage qui DÉCRIT ses cibles en prose au lieu de les NOMMER rend tout re-périmétrage indécidable à la machine.** Mesure sur les 34 lignes de mapping retenues : 21 nomment leur cible sous la forme `table.colonne` et se traitent seules ; **13 la décrivent** — « `dim_date` (granularité jour, attributs year, month_number…) », « `fact_lease_condition` (granularité bail × échéancier × mois) + vue pivot 1-3 — totaux dans `fact_lease_month` », « `billing.fact_debt_rollup` (aggregate_type LEASE) -> colonnes `receivable_*` de `fact_lease_month` », ou la table seule (« `dim_country` », « `dim_brand` »). Première règle essayée, « table nommée sans détail ⇒ table entière » : elle gardait **74 colonnes de `fact_lease_month` sur 74**, soit exactement le périmètre que la décision demandait de réduire, et le journal ne le disait pas. Il a fallu écrire **deux tables de rattachement déclarées** dans le produit — 20 colonnes du modèle vers leur ligne, et 11 lignes vers leurs colonnes cibles — chacune assortie de ce qui la justifie à l'écran, plus une assertion qui refuse une clé inconnue du mapping (quatre clés fautives au premier jet ne faisaient RIEN, en silence). Effet mesuré du passage de la prose au nommage : 84 colonnes Gold écartées au lieu de 47. | Le schéma `lineage@1` de forge-data porte un champ de cible **STRUCTURÉ** — `cibles: [{table, colonnes: [...], granularite?, entier: bool, motif}]` — et la prose reste dans un champ `commentaire` qui n'est jamais lu par un outil. L'oracle `tracer` refuse une cible qui ne nomme aucune colonne sans porter `entier: true` **et** son motif : c'est la seule forme qui rend un re-périmétrage rejouable. Règle générale qui vaut au-delà de ce schéma : *un référentiel dont un outil doit dériver une décision se lit par ses CHAMPS, jamais par ses phrases* — et quand la prose est inévitable, la dérivation se déclare dans une table revue, jamais approchée par ressemblance de noms. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le tableau des colonnes écartées était vide alors que son titre annonçait 276 lignes | la population entière du modèle est conservée (`champs_modele`) et ce tableau se construit dessus ; 276 lignes vérifiées au navigateur, contrôle ajouté à la recette | non | propre au produit — mais c'est ce défaut qui a fondé RA-27 |
| Quatre clés de la table de cibles déclarées ne correspondaient à aucune ligne du mapping, et ne faisaient donc rien | assertion qui refuse une clé inconnue avant toute génération | oui | remontée dans RD-11 |
| Le chapitre du périmètre gardait la prose de la page de découverte : « le chapitre précédent compte les 66 colonnes que le modèle contient. Celui-ci compte celles que le rapport montre : 66 » | chapeau, détail et glose écrits pour le mode cible ; 30 réécritures de texte comptées, une paire jamais trouvée arrête la génération | non | propre au produit : une page dérivée d'une autre hérite de ses phrases, pas seulement de ses chiffres |
| La page de référence annonçait « dix dimensions » là où la proposition en porte onze | corrigé dans le livrable au périmètre ; la page de référence n'est pas retouchée (règle 5 : une nouvelle version est un nouveau fichier) | non | propre au produit, déclaré au journal |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le livrable neuf emploie le type registré `Proposition` et un radical distinct de la page de référence, de sorte que R-7 bis n'y voit pas deux versions d'un même livrable mais deux livrables — ce que la demande humaine exigeait explicitement (« un nouveau fichier différent de celui existant »).

## Confirmations positives

- La règle **R-7 bis** et son `non_juge` (« deux formats d'un même livrable ne sont pas deux versions, l'extension entre dans la clé ») ont suffi à trancher seuls la question du nommage : deux livrables coexistent à la racine d'`output\` sans qu'aucun contrôle ne les confonde, parce que leurs radicaux diffèrent. Aucune décision humaine n'a eu à être posée.
- `check_html.py` est passé de 38 à 39 règles pendant le tour, et **les deux pages** — celle livrée en début de soirée et celle-ci — rendent PASS sur la version neuve sans une seule retouche. Une montée de socle silencieuse et sans dette : c'est le cas le plus rare et il mérite d'être dit.
- Le drapeau `--cible` d'un générateur unique évite la copie datée d'un script : le code n'a que git, et les deux livrables sortent de la même source, ce qui rend leur écart lisible par un `diff` de sortie et non par un `diff` de code.

## Ordre recommandé

1. RA-27 — parce qu'elle protège une règle utile d'un retrait que RA-24 seule rendrait tentant, et qu'un correctif qui désarme la sonde coûterait le défaut que ce tour a trouvé.
2. RD-11 — parce qu'elle conditionne tout re-périmétrage automatique d'un lineage, et que sans elle chaque produit réécrira sa propre table de rattachement à la main.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les deux items suivent une demande humaine et des mesures faites en y répondant. Classes : **RA-27** → `point-entree-declare-rouge-sur-toute-cible` (famille `regle-morte`, correspondance APPROCHÉE et volontairement la MÊME que RA-24 : l'item est la nuance de celui-là, et les séparer en deux classes ferait perdre le lien ; classe candidate `sonde-mesure-etat-hors-lecture`, dont le libellé devrait dire que la sonde mêle deux causes sous un seul message) ; **RD-11** → `gabarit-famille-manquante` (famille `gabarit-document`, correspondance exacte : le schéma de lineage n'a pas de forme pour une cible dont les colonnes ne sont pas nommées, et c'est cette absence de forme qui a forcé une table de rattachement chez le producteur).
