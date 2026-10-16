# Retours forges — Produit-62 — 20260908g

- **Contexte** : seizième retour humain sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset`, en quatre points sur les deux chapitres d'évolutions de la page (version `20260908k`) : présenter les listings Silver et Gold en arborescence schéma › table › colonne avec un statut à chaque niveau ; détailler les infobulles des schémas, tables et colonnes ; détailler la provenance (schémas, tables, colonnes citées) avec l'explication des champs employés ; expliquer à quoi servent les repères S1, S2, G5 avant les listings. Fait côté produit dans la version `20260908m`. Ce lot remonte les deux causes génériques : une projection d'évolutions ne dit rien de sa hiérarchie ni de la lecture d'un repère, et une provenance reste une chaîne de texte que rien n'oblige à résoudre en objets nommés.
- **Références ledger** : `forge\ledger.jsonl` seq 57 (retour humain et causes), seq 58 (page `20260908m` et verdicts), seq 59 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-08

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## forge-data (`digit-ai-forge-data`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-6 | majeur | générique | **Une projection d'évolutions par couche (RD-5, lot 20260908e) rend une liste PLATE : elle perd la hiérarchie schéma › table › colonne, ne porte de statut qu'à la ligne la plus fine, et laisse le lecteur reconstruire ce qui se passe au niveau d'un schéma.** Version `20260908k` : 119 lignes Silver et 278 lignes Gold, une par colonne, chacune répétant le nom de la table ; un schéma comme `lease_management` n'apparaissait nulle part comme objet, et rien ne disait « trois tables, dont deux créées ». Retour humain : « afficher une arborescence entre schéma, table et colonne afin de mieux percevoir les opérations à traiter avec le statut pour chaque niveau ». Correction produit `20260908m` : arborescence à trois niveaux (Silver 5 schémas, 11 tables, 118 colonnes ; Gold 2 schémas, 16 tables, 278 colonnes), statut agrégé au schéma (« 3 tables : 2 créées, 1 complétée, 1 à corriger »), statut par table (« table créée — 21 colonnes »), statut par colonne ; colonne « Niveau » filtrable pour ne garder qu'un étage. | Le format `couverture@1` / la projection d'évolutions rend un ARBRE (`{niveau, parent, objet, statut, statut_agrege}`) et non une liste plate ; le gabarit de restitution de forge-data en fait un tableau à trois niveaux avec filtre par niveau ; l'oracle de complétude vérifie que chaque niveau porte un statut et que l'agrégat d'un parent est cohérent avec ses enfants. |
| RD-7 | majeur | générique | **La provenance d'une colonne reste une CHAÎNE DE TEXTE : rien n'oblige à la résoudre en objets nommés (schéma, table, colonne) ni à expliquer les champs employés.** Version `20260908k` : la provenance affichait « commleases Lease_Start_Date (Amendment_Type 0), Lease_Start_Date de l'avenant courant, Lease_Move_In_Date, Lease_End_Date, LEASE_TERM » — un lecteur qui ne connaît pas Voyager ne sait ni où sont ces objets, ni ce que porte chacun. Retour humain : « dans la provenance, détaille les schémas, tables et colonnes de la provenance, ainsi qu'une explication des champs utilisés ». Correction produit : la provenance est analysée et chaque objet cité est résolu — `vyr.commleases.Lease_Start_Date` (Bronze Voyager, commentaire Yardi de la colonne), `lease_management.lease.lease_pkey` (Silver, commentaire Unity Catalog), `FAI_ART_FAC_BAIL_MOIS` (entrepôt hérité, description du mandat), `tenancy_schedule.dim_lease` (Gold proposée, commentaire du fichier de définition) — avec, pour chacun, sa couche et le rôle de son schéma ; mesure : 118 provenances Silver à infobulle détaillée. | Le champ `provenance` de la projection devient une LISTE d'objets `{couche, catalogue, schema, table, colonne, explication, source_de_l_explication}` au lieu d'une chaîne ; le rendu compose le texte, l'oracle vérifie que chaque objet cité existe dans le catalogue joint ou dans un dictionnaire déclaré (les objets d'un système jamais joint, RA-14 du lot 20260908c). |

## forge-agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-20 | mineur | générique | **Un identifiant de repère employé dans un tableau (S1, G5) n'a nulle part à être expliqué : L18 exige la glose d'un identifiant muet dans la CELLULE, jamais une légende du système de repères avant le tableau.** `check_html` L18 (« identifiant muet : un code sert la traçabilité, il ne se lit pas : joindre un title qui le développe ») était satisfait par l'infobulle de chaque cellule, et pourtant le lecteur demandait « à quoi servent les repères S1, S2, G5 ? ce n'est pas expliqué ». Une infobulle par cellule ne dit pas ce qu'EST un repère, ni combien il y en a, ni où ils vivent aussi. Correction produit : un tableau « À quoi servent les repères » précède chaque listing (S1 à S12, G1 à G9 : repère, objet, action, pourquoi), avec le rappel que le même identifiant vit dans le fichier de définition, dans le chapitre des objets et dans le listing. | L18 bis : quand un même préfixe d'identifiant apparaît sur plus de trois lignes d'une page (S1…S12, G1…G9, TF-####), la page porte une LÉGENDE du système d'identifiants — un tableau ou un paragraphe nommant ce que le préfixe désigne — avant le premier tableau qui l'emploie ; l'infobulle de cellule ne suffit pas. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Listings plats | arborescence à trois niveaux, statut agrégé, filtre par niveau | oui | remontée (RD-6) |
| Provenances non résolues | analyse et résolution de chaque objet cité, infobulle détaillée par couche | oui | remontée (RD-7) |
| Repères non expliqués | tableau des repères avant chaque listing, sous-chapitres au sommaire | oui | remontée (RA-20) |
| Infobulles des niveaux schéma et table | rôle du schéma rédigé pour les cinq schémas Silver et les deux schémas Gold ; commentaire réel pour chaque table | oui, candidat | le rôle d'un schéma n'existe nulle part dans Unity Catalog (aucun commentaire de schéma) : à instruire — un schéma sans commentaire est un défaut de la couche, déjà porté par le chantier S10 |
| Le chantier S11 (tables de test déplacées) n'avait pas de schéma d'accueil dans l'arborescence | réparti sur ses deux schémas réels | non | propre au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- Le composant de filtres du socle accepte une arborescence sans réglage : filtrer sur « Niveau = Colonne » ou sur un statut garde les lignes voulues, l'indentation reste lisible.
- Les commentaires de colonnes des fichiers de définition proposés, écrits le 7 septembre, contiennent déjà les chemins `FK -> schéma.table.colonne` : la résolution des provenances n'a demandé aucune rédaction nouvelle.
- `check_html`, `render_page` (trois largeurs), l'oracle des filtres et la mesure des en-têtes rendent PASS du premier coup sur les arborescences : la structure à trois niveaux ne heurte aucune règle du socle.

## Ordre recommandé

1. RD-6 — parce que la hiérarchie est la première lecture qu'une équipe data fait d'une proposition, et que la projection d'évolutions vient d'être proposée : autant qu'elle naisse en arbre.
2. RD-7 — parce qu'une provenance non résolue oblige chaque lecteur à connaître le système source.
3. RA-20 — une règle de légende, deux lignes d'oracle.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les trois items suivent un retour humain. Classes : RD-6 et RD-7 → `gabarit-famille-manquante` (famille `gabarit-document`, correspondance exacte : la projection d'évolutions proposée hier n'a ni forme hiérarchique ni provenance structurée) ; RA-20 → `lecture-tiers-non-jugee` (famille `skill-ou-oracle-non-invoque`, correspondance exacte : aucun oracle ne juge si un lecteur sans contexte comprend un système d'identifiants).
