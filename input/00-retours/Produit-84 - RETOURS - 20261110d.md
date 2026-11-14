# Retours forges — Produit-84 — 20261110d

- **Contexte** : le 10/11/2026, la session `11da6aa3` répond à deux questions sur l'étude de reprise d'activité, puis la réécrit à l'indice 20261110b.
- **Références ledger** : `forge\ledger.jsonl` seq 294.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-10
- **Complétude** : 1 entrée `type: retour` écrite par cette session depuis le lot 20261110c (seq 294), relue le 10/11/2026 dans `forge\ledger.jsonl`. Elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le préjugement d'une restitution** refuse une réponse courte que le hook de fin de tour accepte.

## digit-ai-factory — préjugement de la restitution

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-21 | majeur | générique | **`--prejuger` ne sait pas juger une réponse courte.** (1) Le 10/11/2026 vers 10:50 UTC, un tour sans écriture rend une réponse de 256 mots ; le hook de fin de tour la refuse et demande de préjuger la suivante. (2) Le brouillon suivant, 207 mots, « Niveau : Simple », passé à `factory.mjs restitution --prejuger`, rend `affichable: false`, S1 et S4 bloquants, comme une restitution complète. (3) Affiché tel quel, ce même texte est accepté par le hook de fin de tour, qui applique l'exemption « réponse courte sans écriture » (`references\NIVEAUX.md`). Ledger seq 294. | `--prejuger` lit les écritures du tour dans le transcript, ou prend un drapeau `--reponse-courte`, puis applique `controlerReponseCourte` au lieu des blocs. Règle qui aurait évité le retour : aucune. Classe : `oracle-faux-positif`. |
