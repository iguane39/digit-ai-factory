# Retours forges — digit-ai-marketing — 20261112a

- **Contexte** : autre — retour humain du 12/11/2026 sur les supports de formation Fit-Retail : « j'ai des défauts comme ceux-là qui s'affichent lorsque j'ouvre Powerpoint, corrige », capture à l'appui (« Cliquez pour ajouter un titre » sur l'intercalaire 01).
- **Références ledger** : `forge\ledger.jsonl` seq 709 (entrée `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 25 espaces réservés de titre vides relevés sur 5 decks livrés, tous passés par les oracles du socle. Ce lot remonte 1 retour, tiré d'1 entrée du ledger, à 1 forge.

---

## oracle-pptx, oracle-charte-pptx-semantique et digit-ai-pptx (`digit-ai-forge-agents`)

Un deck sort avec une invite d'espace réservé visible à l'ouverture, et aucun oracle du socle ne le voit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-20 | majeur | produit+générique | **Aucun oracle ne voit un espace réservé de titre resté vide.** Faits : Les 5 supports de formation Fit-Retail livrés les 13/10, 26/10 et 09/11/2026 portaient 25 espaces réservés de titre vides (`p:ph type="title"`, sans `a:t`), sur la couverture et chaque intercalaire. PowerPoint y affiche « Cliquez pour ajouter un titre » par-dessus le titre posé en zone libre ; l'humain l'a vu à l'ouverture le 12/11. Cause : le générateur du produit définit un espace réservé de titre sur ses masques sombres, puis pose le titre en zone libre comme l'exige S1. `oracle-pptx` et `oracle-polices-embarquees` rendaient PASS sur les 5 decks, `oracle-charte-pptx-semantique` ne relevait que S5. Essai du 12/11 : remplir l'espace réservé avec le titre fait échouer S1 (8 constats) et S2 (4 constats, le numéro pris pour un sur-titre). Corrigé chez le produit : espaces vides retirés, masques sans espace réservé. (ledger seq 709) | `oracle-pptx` refuse tout espace réservé vide sur une diapositive (hors `ftr`, `sldNum`, `dt`), avec la paire de fixtures. `digit-ai-pptx` dit qu'un masque de couverture ou d'intercalaire ne porte pas d'espace réservé de titre quand le titre se pose en zone libre. Règle qui aurait évité le retour : aucune ne juge l'invite visible en mode édition. Classe : `oracle-faux-negatif-sur-rendu`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-20 | `grep -c -i -E "Cliquez pour ajouter\|espace r[ée]serv[ée] (de titre )?vide\|placeholder (de titre )?vide\|empty placeholder" todo/TODO.jsonl` | 0 | aucun |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| S5 relève 5 à 10 termes proscrits par deck (« profil », « limite », « itération », « propale ») sur les 5 supports | pas encore : relevés antérieurs à cette correction, identiques avant et après | non | le lexique de la marque vise les propositions ; à trancher à la prochaine version des supports |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `allouer-indice` en portée dossier a rendu 5 indices distincts du jour (20261112a à e) dans un même dossier.

## Ordre recommandé

1. RA-20, seul retour du lot.

## La règle qui aurait évité le retour

RA-20 suit un retour humain ; aucune règle ne juge l'invite d'un espace réservé vide, et sa colonne « Proposition esquissée » nomme la classe existante `oracle-faux-negatif-sur-rendu`.
