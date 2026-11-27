# Retours forges — Produit-84 — 20261126a

- **Contexte** : le 26/11/2026, la session `66c124ca` relève le reste à faire du produit sur consigne du porteur (« A1 à A11 »). En listant les exécutions GitHub, elle trouve trois workflows planifiés en échec depuis 13 jours.
- **Références ledger** : `forge\ledger.jsonl` seq 342.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-26
- **Complétude** : 1 entrée `type: retour` écrite au ledger après le lot 20261113c (seq 342), relue le 26/11/2026 dans `forge\ledger.jsonl`.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Une panne de 13 jours est restée invisible** : la sonde, la dérive nocturne et la copie de sauvegarde hors Supabase ont échoué à chaque passage, et aucune ouverture de session ne l'a dit.

## digit-ai-factory — relevé d'ouverture du produit

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-26 | bloquant | générique | **Workflows planifiés en échec non signalés à l'ouverture.** (1) `gh run list -w Sonde` : dernier succès le 13/11/2026 à 14:50 UTC, puis échec à chaque passage jusqu'au 26/11 ; même chose pour la dérive nocturne (dernier succès le 13/11 à 09:28) et la sauvegarde hors Supabase (13/11 à 08:41). (2) Cause commune : le jeton de gestion Supabase rend 401 « Invalid access token », dans le `.env` comme dans les secrets GitHub `dev` et `hpr`, posés le 06/11 à 15:04 ; échéance de 7 jours probable (ESTIMÉ). (3) Les ouvertures de session du 25/11 et du 26/11 ont relevé la fraîcheur des dépôts, les retours et l'héritage, rien sur ces échecs. (4) La panne a été trouvée par hasard, en cherchant pourquoi une PR Dependabot échouait. | À l'ouverture d'un produit qui déclare un dépôt GitHub, lire les dernières exécutions des workflows à déclencheur `schedule` et dire, par workflow, la date du dernier succès quand elle dépasse 24 heures. Avertissant. Règle qui aurait évité le retour : aucune. Classe proposée : `panne-planifiee-invisible`, famille `hook-ou-gate`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Le remplacement du jeton et le passage à un compte de service relèvent du produit : plan de remédiation 20261126a, section 3.6, et décision D-186. Généralisable : non, c'est un geste propre à ce compte Supabase.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le retour porte sur le relevé d'ouverture de la Factory.

## Confirmations positives

- TF-2655 tient : oracle-dast 0.5.0 (forge-websec 9e3a714, 25/11/2026) balaie une API depuis sa définition OpenAPI locale, ce qui lève le blocage du lot 3 de Produit-86.
- La garde des `.env` a refusé deux lectures en ligne de commande dans ce tour ; la mesure est passée par un script du produit qui n'affiche aucune valeur.

## Ordre recommandé

1. RU-26 : tout produit dont un jeton de service expire entre deux sessions le reproduit.
