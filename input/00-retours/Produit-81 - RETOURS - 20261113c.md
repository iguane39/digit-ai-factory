# Retours forges — Produit-81 — 20261113c

- **Contexte** : gestes de droits et de données en dev sous la décision D-199 (a), hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 36 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-20 (majeur) — Un retrait d'access policy Key Vault par l'API ARM passe sans lot, et le lot refuse de l'inscrire

**Le fait.** Le 13/11/2026, sous D-199 (a), la session devait retirer l'access policy orpheline `47e4950e` du coffre `kvcl3appgxyd1`. La CLI a refusé `az keyvault delete-policy`, parce que le coffre est en mode RBAC. La voie restante était l'API ARM : `az rest --method put …/vaults/kvcl3appgxyd1/accessPolicies/remove`. La session a voulu inscrire cette commande exacte au lot, mais `--poser` l'a refusée avec le message du joker (D-195 (b)), alors qu'elle n'en porte aucun. Jouée ensuite, la commande a retiré la policy sans que le hook la juge.

**Le coût, prouvé.** Un retrait de droits a été exécuté sans être jugé par la garde. L'accord humain existait (D-199 (a)), mais il n'a pas pu être tracé dans `forge/gestes-approuves.jsonl` : un tour de diagnostic perdu, et une trace d'accord absente pour ce geste.

**La règle qui aurait évité le retour.** La famille « Droits » couvre aussi les requêtes PUT ou PATCH sur `Microsoft.KeyVault/vaults/*/accessPolicies/*` (add, replace, remove), ainsi que `az keyvault set-policy` et `az keyvault delete-policy`. Quand `--poser` reçoit une commande hors de la liste fermée, son message le dit (« cette commande n'est pas un geste de la liste fermée »), au lieu du message du joker. **Clé proposée** : `garde-distante-point-de-droits-non-couvert`, famille `hook-ou-gate`, libellé « Un point d'accès de droits d'une plateforme couverte échappe à la liste fermée : le geste passe sans lot, et le lot refuse de l'inscrire ».

**Juge proposé.** Cas rouges dans `oracles/hook-gestes-distants.test.mjs` :
- `az rest --method put` sur `…/accessPolicies/remove` : refus attendu (exit 2) sans lot, passage avec un lot ;
- `--poser` sur cette commande : lot posé.

## Rattachement

Registre interrogé le 13/11/2026 : `todo/CLASSES.json` du pilot, famille `hook-ou-gate`. Aucune clé ne vise un point de droits absent de la liste fermée. Les deux plus proches visent autre chose : `garde-contournee-par-sortie-rompue` (SIGPIPE) et `garde-de-sortie-sur-le-texte-de-commande` (identité sortante). D'où une clé neuve en `classe-a-creer`.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé. Le refus d'`az keyvault delete-policy` sur un coffre en RBAC est un contrôle de la CLI, pas une stratégie de la plateforme ou du client : il est décrit au RT-20.
