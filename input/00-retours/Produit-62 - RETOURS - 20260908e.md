# Retours forges — Produit-62 — 20260908e

- **Contexte** : quatorzième retour humain sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset`, en trois demandes sur la page HTML de proposition (version `20260908g`) : employer « granularité » plutôt que « grain » ; ajouter deux chapitres « Évolutions Silver » et « Évolutions Gold » listant les tables et colonnes créées ou modifiées par couche avec leur provenance ; ajouter un chapitre « schéma des bases Silver et Gold » où les tables et champs ajoutés ou modifiés portent des couleurs distinctes. Fait côté produit dans la version `20260908i` (1 439 emplois de « granularité », 0 de « grain » ; 119 lignes d'évolutions Silver et 278 lignes Gold avec provenance par colonne ; schéma de 40 cartes de tables et 429 puces de colonnes colorées et marquées d'un glyphe). Ce lot renvoie les trois demandes à la factory : le vocabulaire est celui de forge-data, les deux chapitres et le schéma n'existent dans aucun gabarit ni oracle.
- **Références ledger** : `forge\ledger.jsonl` seq 50 (retour humain et causes), seq 51 (page `20260908i` et verdicts), seq 52 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-08

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## forge-data (`digit-ai-forge-data`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-4 | mineur | générique | **Le vocabulaire de forge-data dit « grain » ; le destinataire lit « granularité ».** Le mot « grain » vient du schéma `modele-dimensionnel@1` (champ et messages d'`oracle-modeliser`, règle M-x « grain déclaré »), des gabarits de restitution de forge-data et des commentaires du DDL Gold rédigés à sa suite (« Grain de la table « Etat locatif » »). Retour humain, mot pour mot : « Utilise le mot granularité plutôt que grain ». Mesure sur la version `20260908g` : 33 emplois de « grain » dans la page, dont 25 issus du générateur et 8 recopiés des commentaires DDL. Correction produit : substitution au rendu, accords refaits (« la granularité », « à la granularité »), 0 emploi restant ; les fichiers DDL et JSON livrés le 7 septembre gardent « grain » (versions remises, non réécrites). | Glossaire de forge-data (et `gabarits\GLOSSAIRE.md` du pilot) : « granularité » est le terme de restitution, « grain » reste admis dans les schémas machine (`modele-dimensionnel@1`) avec la note « rendu : granularité » ; `oracle-restituer` R-x : un terme du glossaire employé sous sa forme machine dans un livrable destiné à l'humain = avertissement. |
| RD-5 | majeur | générique | **Aucune projection « évolutions par couche » n'existe : la liste des tables et colonnes créées, ajoutées ou corrigées, avec leur provenance, se reconstitue à la main depuis les DDL, le mapping et Unity Catalog.** Le lineage déclaré (`lineage@1`) porte les sorties en `etat: propose` et les transformations, mais pas la vue « ce qui change dans chaque couche, colonne par colonne, et d'où ça vient » — c'est pourtant la première question d'une équipe data qui reçoit une proposition. Retour humain : « Évolutions Silver avec les tables et les colonnes rajoutées et/ou modifiées en Silver et leurs provenances ; Évolutions Gold idem ». Correction produit : `relever-commentaires-uc.py` étendu (types, action créer/modifier, ordre des colonnes, lues dans les DDL proposés) ; générateur : 119 lignes Silver (6 tables créées, 3 complétées, 2 colonnes corrigées, 6 tables déplacées) et 278 lignes Gold (colonnes reprises de la Gold existante distinguées des ajoutées par comparaison avec Unity Catalog ; provenance = ligne de mapping « Silver ← Bronze » quand la colonne y est citée, sinon Gold existante, clé de substitution, colonne technique ou commentaire DDL) ; tableaux filtrables avec cartes de comptage. | Verbe forge-data `projeter-evolutions` (ou sortie d'`oracle-tracer`) : depuis `lineage@1` + les DDL proposés + le catalogue joint, produire par couche la liste { table, colonne, type, évolution (créée / ajoutée / reprise / corrigée / déplacée), provenance } au format CSV et Markdown, jugée par un oracle de complétude (chaque colonne d'un DDL proposé a une évolution et une provenance) ; le gabarit de restitution de forge-data en fait un chapitre obligatoire. |

## forge-agents (`digit-ai-forge-agents`, skills `digit-ai-page-html` et `digit-ai-schemas`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-16 | majeur | générique | **Aucun composant ni gabarit ne dessine un schéma de base de données DIFFÉRENTIEL (tables et colonnes existantes, ajoutées, modifiées) ; le skill de schémas produit du SVG que `render_page` V4 lit comme des chevauchements de frères (RA-x du 7 septembre).** Retour humain : « un chapitre avec le schéma des BDD Silver et Gold, avec les tables et champs ajoutés ou modifiés de couleurs différentes ». Correction produit : grille HTML de cartes de tables (contour bleu = créée, ambre = modifiée ou étendue, gris = existante), une puce par colonne (bleu ＋ ajoutée, rouge ✎ corrigée, gris ● reprise ou existante citée), clés de substitution listées sous chaque fait, légende couleur + glyphe + libellé, infobulle par colonne ; mesure : 40 cartes (24 Silver dont 6 créées et 4 modifiées ; 15 Gold dont 2 étendues, plus la vue), 429 puces ; `check_html` PASS après trois corrections (L1 points de suspension et L11 « NULL » recopiés des commentaires DDL, L19 coupure de mot sur les puces, L7 chapeau de 67 mots). Coût : un composant écrit chez le produit, sans relation dessinée (les liens sont en texte). | `digit-ai-schemas` : gabarit « schéma de base différentiel » en HTML (grille de cartes, puces de colonnes, états créée / modifiée / corrigée / reprise / existante avec couleur ET glyphe, liens de clés en texte ou en flèches CSS), alimenté par la projection d'évolutions de RD-5 ; `render_page` V4 : exclure les enfants d'un même `.tbl-card` comme il exclut déjà les groupes SVG titrés. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| « grain » dans la page | substitution au rendu avec accords, 0 emploi restant ; les livrables du 7 septembre (DDL, JSON, rapport) gardent le mot : versions remises | oui | remontée (RD-4) |
| Chapitres Évolutions Silver / Gold | 119 + 278 lignes avec provenance, cartes de comptage, filtres | oui | remontée (RD-5) |
| Schéma des bases | grille HTML différentielle, 40 cartes, 429 puces, légende | oui | remontée (RA-16) |
| Commentaires DDL portant « … » et « NULL » recopiés dans le texte visible | nettoyés au rendu (« , etc. », « valeur vide ») | oui, candidat | un texte relevé d'une source machine n'est pas un texte de lecture : à instruire (non remonté : L1 et L11 l'ont vu) |
| Accords de genre après substitution automatique (« le granularité ») | table d'accords dans le générateur | non | propre au run |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- `check_html` L1 et L11 ont refusé les points de suspension et le littéral « NULL » recopiés des commentaires DDL : deux défauts de lecture réels, vus avant l'humain.
- Les commentaires des DDL proposés, écrits le 7 septembre pour la relecture, suffisent à alimenter la provenance de 397 colonnes sans nouvelle rédaction.
- La comparaison avec Unity Catalog distingue sans ambiguïté les 25 colonnes reprises de la Gold existante des colonnes ajoutées.

## Ordre recommandé

1. RD-5 — parce que la projection d'évolutions est la vue que toute équipe data demande en premier et qu'elle se dérive mécaniquement de ce que forge-data possède déjà.
2. RA-16 — parce que le schéma différentiel est sa forme visuelle et qu'il manque un gabarit HTML compatible avec les oracles.
3. RD-4 — un mot dans un glossaire.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les trois items suivent un retour humain. Classes : RD-4 → `lecture-tiers-non-jugee` (famille `skill-ou-oracle-non-invoque`, voisine : un terme machine rendu tel quel au lecteur) ; RD-5 → `gabarit-famille-manquante` (correspondance exacte : aucune famille de gabarit ni de projection ne couvre les évolutions par couche) ; RA-16 → `gabarit-famille-manquante` (correspondance exacte : aucun gabarit de schéma de base différentiel).
