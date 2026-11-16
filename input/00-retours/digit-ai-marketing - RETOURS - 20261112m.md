# Retours forges — digit-ai-marketing — 20261112m

- **Contexte** : autre — décision D-187 (c) du dirigeant le 12/11/2026 : les publications LinkedIn de la page de Digit-AI et de son profil ne portent plus la mention « rédigé avec l'aide d'une IA ». Ses mots : « 187c pas une exception. Une demande de l'utilisateur qui s'occupera de relire, modifier et poster les textes sur LinkedIn manuellement. »
- **Références ledger** : `forge\ledger.jsonl` seq 781 et 782 (entrées `type: retour`), décision seq 776, rectification des familles seq 783.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : sur la version 20261112d de la série LinkedIn, `oracle-transparence` rend FAIL sur 30 textes sur 30, et la règle RR4 de `oracle-run-reseau` rend FAIL sur 15 semaines sur 15. Ce lot remonte 2 retours, tirés de 2 entrées du ledger, au pilot et à 1 forge.

---

## Pilot (`digit-ai-factory`)

Le porteur demande que la règle de transparence évolue ; il ne demande pas d'exception.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-222 | majeur | générique | **La règle de transparence n'a aucun cas pour un texte qu'une personne relit, modifie et publie elle-même.** Faits : le 12/11/2026, le porteur a retiré la mention des publications LinkedIn de Digit-AI (D-187 (c)), parce qu'il relit, modifie et publie chaque texte à la main. La règle décidée par TF-1030 et reprise par `references/PLATEFORME-LINKEDIN.md` section 3 l'exige pourtant. RR4 rend FAIL sur 15 semaines sur 15 de la version 20261112d. (ledger seq 781) | Faire évoluer la règle : un contenu qu'une personne nommée relit, modifie et publie elle-même, sous sa responsabilité éditoriale, ne porte pas la mention ; la publication déclare ce responsable, et RR4 le lit au lieu d'exiger la mention. Classe à créer : `regle-de-transparence-sans-cas-de-responsabilite-editoriale-humaine`. |

## oracle-transparence (`digit-ai-forge-agents`)

L'oracle ne sait pas lire qu'un contenu est publié sous la responsabilité éditoriale d'une personne.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-231 | majeur | générique | **`oracle-transparence` ne lit que la mention dans le texte.** Faits : après D-187 (c), les 30 textes de la version 20261112d le font échouer. Leur frontmatter pourrait nommer qui les relit et les publie, mais l'oracle ne connaît aucun champ pour le déclarer. (ledger seq 782) | Accepter un champ de frontmatter, par exemple `responsable_editorial`, appuyé sur une décision consignée. Le verdict devient alors un PASS motivé (« sans mention, responsabilité éditoriale de X, décision D-N »), et reste FAIL sans ce champ. Classe à créer : `oracle-sans-declaration-de-responsable-editorial`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-222 | `grep -i "transparence" todo/TODO.jsonl \| grep -i -c -E "relu\|responsabilit\|editorial\|éditorial\|exception\|humain"` | 6 | voisin : TF-1030 (règle de transparence décidée le 11/09/2026, D-3 a) ; aucun ne traite la responsabilité éditoriale d'une personne |
| RA-231 | `grep -i "oracle-transparence" todo/TODO.jsonl \| grep -i -c "frontmatter"` | 2 | voisin : TF-1442 (marquage machine des pages générées, corrigé le 28/09/2026) ; aucun ne traite la déclaration d'un responsable éditorial |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le conflit de règles a été posé en décision au lieu d'être tranché en silence : le porteur a répondu par une lettre, et la session a pu agir.

## Ordre recommandé

1. RP-222, parce que la règle commande l'oracle.
2. RA-231.

## La règle qui aurait évité le retour

Aucune règle ne prévoit qu'une personne publie elle-même, sous sa responsabilité, un texte rédigé avec une IA ; la colonne « Proposition esquissée » propose les deux classes.
