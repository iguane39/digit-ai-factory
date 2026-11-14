# Retours forges — Produit-84 — 20261110c

- **Contexte** : le 10/11/2026, la session `0bb2525a` rédige la réponse du porteur au référent sécurité, puis réémet la fiche sécurité de qualification à la demande du porteur.
- **Références ledger** : `forge\ledger.jsonl` seq 292.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-10
- **Complétude** : 1 entrée `type: retour` écrite par cette session (seq 292), relue le 10/11/2026 dans `forge\ledger.jsonl`. Elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **La fiche sécurité de qualification** est restée à sa version du 04/11 alors que l'environnement avait changé de version ; la session l'a jointe telle quelle à un courriel, et le porteur a dû demander sa réémission.

## digit-ai-factory — fiche sécurité de mise à disposition

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-20 | majeur | générique | **Une fiche sécurité de mise à disposition n'est pas réémise quand la version servie change.** (1) La fiche `CDC-SEC-HPR-20261104a` cite v1.10.0 (`afcbe76`) ; v1.13.0 (`a6d72f5`) est qualifiée et servie depuis le 10/11 (exécution 42782533913). (2) Entre les deux : 36 corrections de l'audit, restauration rejouée, test d'intrusion du 09/11, bibliothèques sorties du CDN. (3) La session a joint la version du 04/11 au courriel du référent sécurité, avec une liste des écarts, au lieu de la réémettre. Le porteur, mot pour mot : « ça aurait d'ailleurs dû être fait, vu les écarts depuis la génération de la précédente fiche. » (4) Réémise le 10/11 : 16 champs sur 29 changés. Ledger seq 292. | Une barrière, pas une règle : `verifier-fiche-securite.mjs` gagne une règle FS12 qui compare la version citée à la dernière étiquette déployée sur l'environnement, et la chaîne de qualification, ou le hook de fin de tour, la joue. Règle qui aurait évité le retour : aucune. Classe : `livrable-derive-non-regenere`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- La fiche de dev `CDC-SEC-DEV-20261029b` est aussi en retard sur dev ; sa réémission est une action du produit. Généralisable : non, le cas général est RU-20.

## Retours sur les documents produits

- Fiche `CDC-SEC-HPR-20261110a`, construite depuis le gabarit `gd-fiche-securite` : le gabarit ne porte aucun champ « version servie » distinct ; la version se glisse dans le texte de l'URL, où aucun contrôle ne la lit.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le retour porte sur un gabarit et un oracle de la Factory.

## Confirmations positives

- La fiche se reconstruit depuis son fichier de données en une commande, et ses 5 oracles se rejouent à l'identique : la réémission a pris un tour.

## Ordre recommandé

1. RU-20 : seul retour du lot.
