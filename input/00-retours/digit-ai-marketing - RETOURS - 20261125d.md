# Retours forges — digit-ai-marketing — 20261125d

- **Contexte** : production des 2 programmes Qualiopi, des 2 devis et de la propale d'une seconde session de formation pour un client du produit ; les programmes PDF, rendus par Word, échouent à la règle DP4 d'un oracle de forge-design.
- **Références ledger** : `forge\ledger.jsonl` seq 860 (entrée `type: retour`), verdicts seq 859, production seq 861.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 25/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 3 PDF de programme sur 3 en échec DP4, dont 1 déjà livré et accepté le 12/11/2026 ; 0 défaut réel trouvé à l'œil sur les pages. Ce lot remonte 1 retour, tiré de 1 entrée du ledger, à forge-design.

---

## oracle-document-imprime (`digit-ai-forge-design`)

La règle d'équilibre des colonnes lit les colonnes d'un tableau comme des colonnes de page.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-16 | mineur | générique | **Faux positif DP4 sur un document Word à une colonne.** Faits : `run-oracles.mjs --profil digit-ai` sur les PDF de 2 programmes de formation, exportés par Word depuis un DOCX à une seule colonne de texte qui porte des tableaux à 2 et 3 colonnes. Constats : « colonnes déséquilibrées : la colonne de gauche (x=12.7 mm) finit à 263.6 mm, celle de droite (x=144.0 mm) à 178.1 mm — 85.4 mm d'écart » et, sur le second, 151.2 mm. Le programme de la session 1 du même client, déjà livré et accepté le 12/11/2026, rend le même constat (144.8 mm). Les pages relues à l'œil n'ont aucune colonne de page. (ledger seq 860) | DP4 ne juge que les pages où la colonne de droite porte du texte hors d'un tableau, ou s'applique aux seuls PDF issus d'un support à colonnes (PPTX, page HTML). Fixture : un DOCX à une colonne avec un tableau « Rubrique / Détail » de 9 lignes, exporté en PDF, PASS attendu. Classe `oracle-faux-positif`. |

## Rattachement

Registre interrogé le 25/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RD-16 | `grep -i "desequilibr\|déséquilibr" todo/TODO.jsonl` puis `grep -c "oracle-document-imprime" todo/TODO.jsonl` | 4 et 7 | voisins : TF-1966 (corrigé, aucun oracle ne mesurait l'équilibre des colonnes d'un tableau), TF-2385 (corrigé, création de la mesure d'équilibre pour une page imprimée), TF-2399 et TF-2452 (inscription de l'oracle au registre) ; aucun ne traite un faux positif sur un document Word |

## Remarques restées au produit

| id | Remarque | Pourquoi elle reste au produit | Généralisable |
|---|---|---|---|
| RM-4 | La police de titre de la charte, Montserrat, n'était plus installée au poste ; `lire-marque.mjs` l'a signalé, et la session l'a installée pour l'utilisateur courant avant l'export (ledger seq 861). | L'avertissement du skill a joué son rôle et donnait le remède ; l'installation est un geste du poste. | généralisable : non |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `oracle-claims` a refusé 2 montants d'une diapositive sans source et une incohérence entre 2 lignes « Calcul » des notes ; les 2 constats étaient réels.
- `oracle-document-imprime` (DP2) a relevé un contraste de 2,99:1 sur l'en-tête des devis : défaut réel, corrigé à 4,88:1.

## Ordre recommandé

Un seul retour sur ce lot : RD-16.

## La règle qui aurait évité le retour

Une mesure de mise en page dit à quel type de support elle s'applique, et un document à une colonne n'est pas jugé sur ses colonnes de page.
