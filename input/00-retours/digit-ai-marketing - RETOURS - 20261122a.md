# Retours forges — digit-ai-marketing — 20261122a

- **Contexte** : autre — exécution, le 22/11/2026, du prompt réécrit par la revue L99 : page HTML autonome du programme d'autoformation à Claude Web et Claude Desktop, au socle `digit-ai-page-html`.
- **Références ledger** : `forge\ledger.jsonl` seq 813 (entrée `type: retour`), livrable seq 814.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 22/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : sur la page du programme, 21 séances à fiche dépliable, `oracle-filtres-tableau` a refusé à tort 1 colonne sur 5 colonnes à facette. Ce lot remonte 1 retour, tiré de 1 entrée du ledger, au pilot.

---

## digit-ai-forge-agents (`quality-oracles`)

L'oracle des filtres ne lit pas les lignes de détail comme le composant qu'il juge.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-232 | mineur | générique | **G12 compte les lignes de détail dans la première colonne.** Faits : le 22/11/2026, `oracle-filtres-tableau.mjs` a rendu FAIL G12 sur la colonne « Fait » : « 21 cellule(s) composite(s) sur 42 ». Les 21 cellules visées sont les `td colspan="7"` des lignes `tr[data-detail]` produites par `table-detail.js`. La boucle G12 lit `t.cellules`, tiré de toutes les `<tr>` du premier `<tbody>`, alors que `corps()` de `table-filters.js` exclut `tr[data-detail]` et `tr[data-tf-empty]`. Les 21 cellules réelles de la colonne portent `data-tf-valeur`. Contournement au produit : `data-tf-valeur="fiche"` sur la cellule de détail. (ledger seq 813) | Écarter `tr[data-detail]` et `tr[data-tf-empty]` des lignes lues par G11, G12 et G13 ; fixture rouge : 8 lignes à fiches dépliables, colonne 1 en `data-tf-valeur`. Classe existante : `oracle-faux-positif`. |

## Rattachement

Registre interrogé le 22/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-232 | `grep -i "oracle-filtres-tableau" todo/TODO.jsonl \| grep -ic "data-detail"` | 0 | voisins : TF-2196 (G12 créée, corrigé), TF-2249, TF-2279 et TF-2288 (G12, corrigés) ; aucun ne traite les lignes de détail |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le branchement d'une recherche plein texte sur le composant de filtres par `DigitAIRowVisibility.register` puis `api.appliquer()` a fonctionné du premier coup : compteur, état vide et « Tout réafficher » suivent, 17 cas Playwright sur 17.

## Ordre recommandé

1. RA-232, seul retour du lot.

## La règle qui aurait évité le retour

Un oracle qui juge un composant lit les lignes comme ce composant les lit ; la classe `oracle-faux-positif` couvre l'écart.
