# Retours forges — Produit-86 — 20261106b

- **Contexte** : suite de la clôture du run `20261106a-evolution-parcours-visiteur-anonyme`, dont le lot `20261106a` était déjà remis. Avant d'afficher le feu vert de production, la porte d'audit des dépendances a été rejouée le jour même, et elle n'a rien jugé.
- **Références ledger** : `forge\ledger.jsonl` seq 617 (entrée `type: retour`) ; seq 616 pour l'audit rejoué à la main.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 06/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 06/11/2026 : `todo/CLASSES.json` du pilot, 254 classes, filtré sur `skip|manifeste|dependances|recette`. RP-45 se rattache à `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` : l'oracle cherche les dépendances à un emplacement fixe (`package-lock.json`, `requirements.txt`) alors que le produit les déclare ailleurs (`uv.lock`).

## digit-ai-forge-websec

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-45 | majeur | générique | `oracle-sca` rend SKIP « aucun manifeste reconnu (package-lock.json ou requirements.txt attendu) » sur un produit Python qui déclare ses dépendances par `pyproject.toml` et `uv.lock`. Sur un `requirements.txt` exporté de `uv.lock`, il rend encore SKIP : « pip-audit absent du poste ». La porte d'audit des dépendances n'a donc rien jugé, sans que ce soit dit comme un manque. Mesure : 2 SKIP le 06/11 à 09:53 ; `uvx pip-audit` sur l'export à 09:55, 25 paquets, 0 vulnérabilité connue. Ledger seq 617. | Lire `uv.lock` ou `poetry.lock` (ou les exporter), lancer `pip-audit` par `uvx` quand il manque, et rendre le SKIP d'une porte de production comme un manque nommé. |

## La règle qui aurait évité le retour

- `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` (RP-45) : un contrôle cherche ce qu'il juge là où le produit le déclare réellement.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Audit des dépendances rejoué à la main pour le feu vert du jour | `uv export --no-dev --frozen`, puis `uvx pip-audit` ; rapport `forge/etapes/ops/pip-audit-20261106.json` (commit `8bd7d8f`) | oui | remonté ci-dessus (RP-45) : le geste revient à la forge |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261106a) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le préjugé de restitution a refusé un feu vert de production sans sortie datée de la porte d'audit des dépendances : c'est lui qui a fait découvrir que cette porte ne jugeait rien.

## Ordre recommandé

RP-45 seul.
