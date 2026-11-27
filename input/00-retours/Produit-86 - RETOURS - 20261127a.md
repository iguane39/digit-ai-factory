# Retours forges — Produit-86 — 20261127a

- **Contexte** : maquette HTML de format de rapport de pentest (version a du 27/11/2026), refusée par le porteur sur deux points que les règles du socle couvrent déjà, puis refaite en version e le même jour.
- **Références ledger** : `forge\ledger.jsonl` seq 1062 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 27/11/2026 : `grep -E '"(TF-1969|TF-1742|TF-1763)"' todo/TODO.jsonl` → 9 lignes trouvées ; `grep -ciE "client-a-page-html.*(L18|L38|lisibilit)" todo/TODO.jsonl` → 0 ligne trouvée ; `grep -ciE "L18.*(motif|tiret|CWE|OWASP)" todo/TODO.jsonl` → 0 ligne trouvée.
Items recoupés : TF-1969 (L18 étendu aux codes lettres puis chiffres sans tiret, classe `code-regle-sans-infobulle`) et TF-1742 (L38 posé en avertissement, classe `page-html-liste-renvoi-sans-detail`). RA-3 et RA-4 sont des récidives de ces deux classes, sur des formes que les corrections n'ont pas couvertes.

## forge-agents (`digit-ai-forge-agents`, socle `digit-ai-page-html` et `client-a-page-html`)

Le livrable a coûté une version de plus : les deux règles existent, aucune ne s'est déclenchée sur cette page.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-3 | majeur | générique | La page `output/Produit-86 - Maquette - Format de rapport de pentest par Claude - 20261127a.html` citait 41 identifiants de constat (`EL-02`, `MO-01`…) et des codes `CWE-798`, `A07:2021`, `API2:2023`, `T4` sans lien ni infobulle ; mesuré le 27/11 : `check_html.py` de client-a-page-html PASS (il ne porte aucune règle L), `check_html.py` de digit-ai-page-html ne lève pas L18 (motif fermé `[ECH]\d+`, `Q-`, `RA-`, `RD-`, `ADR`, lettres puis chiffres sans tiret), `run-oracles-design` PASS 10/10. Porteur : « Ajoute les liens sur tous les codes … + Tooltip … (devrait déjà être prévu Factory) ». Ledger seq 1062. Classe `code-regle-sans-infobulle`. | Règle qui aurait évité le retour : L18 (jeton) de `references/lisibilite.md`. Élargir son motif à `[A-Z]{2,3}-\d{2,3}`, `CWE-\d+`, `A\d{2}:\d{4}`, `API\d+:\d{4}`, et porter L18 dans le `check_html.py` de client-a-page-html. |
| RA-4 | majeur | générique | Sur la même page, le tableau des constats (49 lignes) était doublé par un chapitre « Fiches détaillées » de 8 fiches, chaque ligne renvoyant par ancre à sa fiche ; L38 ne s'est pas déclenché, car la première cellule porte l'identifiant seul (`CR-01`) et le titre de la fiche visée ne commence pas par lui. Porteur : « Redondance entre les 2 listes, la première peut intégrer l'autre via accordéon, comme déjà demandé plusieurs fois à la Factory ». Corrigé en version e avec le composant `table-detail` (composants § 10). Ledger seq 1062. Classe `page-html-liste-renvoi-sans-detail`. | Règle qui aurait évité le retour : L38 et L17 de `references/lisibilite.md`. Faire reconnaître à L38 une cible dont l'`id` ou l'en-tête porte l'identifiant de la ligne, et porter L17 et L38 dans le `check_html.py` de client-a-page-html. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 41 constats sans fiche dans la maquette | 49 fiches au même gabarit en version e, sections déduites marquées ◇ | non | Choix de contenu propre à cette maquette, sans règle de forge en cause. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261109b, 20261112e, 20261112f, 20261125a et 20261126b) |

La maquette de rapport de pentest n'est pas mûre : elle est en cours de comparaison par le porteur.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : l'écart a été vu par le porteur, pas par un refus.

## Confirmations positives

- Le composant `table-detail` du socle a suffi tel quel : embarqué par `embarquer-composants.mjs --poser`, parité vérifiée, ouverture au clic, au lien et à l'adresse directe, dépliage à l'impression.

## Ordre recommandé

1. RA-3 : un motif élargi et la règle portée dans la charte Client-A couvrent la plainte la plus répétée, pour un effort borné au motif.
2. RA-4 : la reconnaissance de la cible par identifiant demande une mesure de bruit avant de passer L38 en échec.

## La règle qui aurait évité le retour

RA-3 : L18 (jeton). RA-4 : L38 et L17. Les deux règles existent ; leur motif et leur absence de la charte Client-A sont le trou.
