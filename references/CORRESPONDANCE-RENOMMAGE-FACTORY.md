# Table de correspondance §3 bis — renommage `digit-ai-forge-pilot` → `digit-ai-factory`

Référentiel versionné (CONTRAT-INTERFACE §3 bis : toute évolution d'un référentiel à
identifiants s'EMBARQUE avec sa table, jamais après). Écrite en **fenêtre A** (étude
20260817i, séquence O1), AVANT tout déplacement — gate n°1 franchi le 17/08 (décision
humaine : `digit-ai-factory`, les 6 sites hors motif payés en connaissance de cause).

## 1. Nom du dépôt et clés de ledger (`versions_forges`, R-19)

| Ancien | Nouveau | Depuis |
|---|---|---|
| `digit-ai-forge-pilot` (clé canonique R-19) | `digit-ai-factory` | fenêtre B (gate n°2) |
| `pilot` (clé courte, antériorité Approval2 11/08) | antériorité déclarée — jamais réécrite ; `cleCanonique` proposera `digit-ai-factory` | — |
| URL `github.com/iguane39/digit-ai-forge-pilot` | `github.com/iguane39/digit-ai-factory` — GitHub redirige l'ancien URL ; **l'ancien nom ne sera JAMAIS réutilisé** (la réutilisation casse définitivement les redirections) | fenêtre B |

Conséquence R-19 (site payé du gate n°1) : le motif `RE_CLE_DEPOT` d'`oracle-conformite-projet.mjs`
devient `/^(digit-ai-forge-[a-z0-9_-]+|digit-ai-factory)$/` en fenêtre B — le pilot est la
seule exception nommée au motif des 13 forges.

## 2. Identifiants de schéma — GELÉS (espace de noms historique)

| Identifiant | Statut | Motif |
|---|---|---|
| `pilot/catalogue@1` | **inchangé, préfixe gelé** | R-39 §B alinéa « identifiants stables » : un id renuméroté casse toute traçabilité ; le préfixe `pilot/` devient un espace de noms HISTORIQUE (comme un fait d'époque), coût 0 site contre 8 sites + 4 consommateurs pour un passage en `@2` |
| `pilot/fraicheur-claims@1` | **inchangé, préfixe gelé** | idem |

Un identifiant FUTUR de schéma du dépôt naîtra sous `factory/…@1` ; les deux gelés ne
migrent jamais.

## 3. Le mot « pilot » comme RÔLE (hors périmètre, décision explicite)

~337 occurrences du mot « pilot » désignent le RÔLE (piloter les forges), pas le dépôt —
hors périmètre du renommage par décision du gate n°1 (classe e. de l'énumération 20260817i),
jamais par omission. Le dépôt s'appelle factory ; le rôle de pilotage garde son nom.

## 4. Histoire et archives — jamais réécrites

`todo\TODO-ARCHIVE.jsonl`, `todo\TODO.jsonl`, `output\**`, `input\**`, ledgers des
produits, `BOUCLE-AMELIORATION.md` (entrées antérieures), `insatisfactions\REGISTRE.jsonl` :
les occurrences de l'ancien nom y sont des FAITS D'ÉPOQUE (classe a.). La liste blanche
`todo\normaliser-lot.mjs` accepte les DEUX noms tant qu'un lot antérieur peut arriver
(classe c.) — sa réduction est le dernier geste de la séquence.
