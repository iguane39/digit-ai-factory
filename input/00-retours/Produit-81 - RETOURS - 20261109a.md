# Retours forges — Produit-81 — 20261109a

- **Contexte** : incident de conseil — faux négatif sur les droits de l'utilisateur, hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl` seq 5 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (a coûté un aller-retour à l'utilisateur et aurait coûté du temps à un tiers).

## RT-9 (majeur) — Absence de droit conclue d'un relevé lu dans une seule portée

**Le fait.** Le 09/11/2026, pour savoir si l'utilisateur pouvait se connecter seul à la base de dev, la session a relevé ses droits Azure avec `az role assignment list --all --assignee <oid>` — **sans** `--include-groups`. Ce relevé ne rend que les attributions **directes** (2 « Key Vault Secrets Officer » sur d'autres coffres) et masque les droits **hérités de groupe**. La session a conclu « 0 rôle sur Applications IA, vous ne pouvez rien faire vous-même », puis a rédigé un message Teams orientant l'utilisateur vers une **tierce personne** pour obtenir les accès — tierce personne qui détient **exactement les mêmes droits** (Contributor hérité de groupe). Mesuré ensuite avec le bon drapeau : `az role assignment list --assignee <oid> --include-groups` → `Contributor | Group | /subscriptions/88206ed7…`.

**Le coût, prouvé.** L'utilisateur a perdu plusieurs tours (relevé des droits, message Teams rédigé), a dû corriger lui-même le diagnostic, et la demande au tiers — si envoyée — aurait fait perdre du temps à une personne qui ne pouvait rien ajouter. Double perte : conseil faux + orientation inutile vers un tiers (contraire à la loi n° 5, voie automatique / autonome d'abord).

**La règle qui aurait évité le retour.** Avant d'affirmer une absence de droit, interroger les droits **effectifs** (`--include-groups`, ou l'API `effectivePermissions`), pas les seules attributions directes ; et ne router un geste vers un tiers qu'après avoir prouvé que ni la session ni l'utilisateur ne peuvent le faire.

**Juge proposé.** Un contrôle de restitution : quand une action laisse un geste à un tiers (`manuelle_*`) sous motif `acces`, exiger dans la trace que le relevé de droits ait été fait en portée effective (héritage de groupe compris), pas seulement en attributions directes.

## Rattachement

Registre interrogé le 09/11/2026 : `grep -n "include-groups\|role assignment\|faux negatif\|absence-conclue" todo/TODO.jsonl` → 2 ligne(s) trouvée(s), toutes deux l'item **TF-1985**.
Items recoupés : **TF-1985** (`absence-conclue-d-une-reponse-vide` — une connexion de service déclarée supprimée sur un 200 au corps null lu dans une seule portée). Même classe, même règle : une absence conclue d'une mesure lue dans une seule portée. Ce retour la **recoupe** sur une autre surface (droits RBAC hérités de groupe) ; à marquer récidive si la classe est close, la correction n'ayant pas redescendu jusqu'à cette session.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
