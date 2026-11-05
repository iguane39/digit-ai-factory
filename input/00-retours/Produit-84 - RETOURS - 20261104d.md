# Retours forges — Produit-84 — 20261104d

- **Contexte** : question du porteur du 04/11/2026, mot pour mot : « Le rapport d'audit ne respecte toujours pas le format attendu du rapport d'audit de la Factory, pourquoi ? »
- **Références ledger** : `forge\ledger.jsonl` seq 180.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-04
- **Complétude** : 1 entrée `type: retour` écrite depuis le lot 20261104c (seq 180), relue le 04/11/2026 à 10:54 dans `forge\ledger.jsonl` ; elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Deux rendus hors format.** L'audit complet du 04/11 a été rendu deux fois par le moteur générique de forge-audit, la seconde après réalignement sur `rapport-audit.template.md`. Les deux gates de la forge étaient verts.
- **Le standard du client.** Pour un produit Client-A, il vit dans le projet commun `Produit-64`. Rien ne l'a désigné à la session.

## Factory (`digit-ai-factory`) — routage d'un audit chez un client qui a son standard

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-44 | bloquant | générique | **Le routage d'audit ignore le standard d'audit du client.** Pour un produit Client-A, le format attendu vit dans le projet commun `C:\dev\_Client-A\Produit-64` : prompt `Client-A - Prompt Audit POC-to-Prod - 20261019a.md`, modèle `Client-A - Modèle Rapport d'audit POC-to-Prod - 20261019a.html`, tenant `tenants/client-a` (260 contraintes sur 2 packs, dont le périmètre normatif de Client-A) et porte `output/07-Standards Client-A/compliance-pack/verifier-rapport-audit.mjs`. Le hook-lexique et le CLAUDE.md du produit routent vers forge-audit générique ; le produit n'est pas branché au projet commun (0 mention dans `CLAUDE.md` et `.claude/`), alors que l'ouverture charge déjà ses `CONVENTIONS-CLIENT.md`. La session a fabriqué un tenant à 185 contraintes du core. Mesure du 04/11/2026 à 10:52 : la porte du client rend NON CONFORME (5 anomalies bloquantes) le rapport que les deux gates de forge-audit déclaraient diffusable. Ledger seq 180. | Le routage d'audit lit d'abord le standard du client : projet commun déclaré par `CONVENTIONS-CLIENT.md` ou par le skill `projet-commun-client-a` (prompt, modèle, tenant, porte). Il ne retombe sur forge-audit générique qu'en l'absence de standard. La mobilisation `audit` exige la porte du client quand elle existe. Un tenant réel ne se fabrique jamais quand le client en publie un. Règle qui aurait évité le retour : aucune ; le routage TF-1735 ne connaît que forge-audit. **RT-44** : classe proposée `standard-client-ignore-par-le-routage`. |

## Rattachement

Registre interrogé le 04/11/2026 au pilot, `todo/TODO.jsonl`, sur « projet commun », « Produit-64 » et « tenant » avec « audit » : 2 items, TF-1000 et TF-1209 (corrigés), sur la charte d'exemple et l'emplacement du tenant, sans rapport avec le routage vers le standard du client.

Items recoupés : aucun.

## Remarques restées au produit

- Brancher ce produit au projet commun, puis refaire le rapport au modèle Client-A : gestes de ce produit. Généralisable : non ; la cause générale est RT-44.

## Retours sur les documents produits

- `gd-rapport-audit` : la famille renvoie au moteur générique comme forme de référence. Chez un client qui publie son modèle, c'est le modèle du client qui fait foi (RT-44).

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le projet commun porte une porte exécutable (`verifier-rapport-audit.mjs`) : c'est elle qui a mesuré l'écart en une commande.

## Ordre recommandé

1. RT-44 : seul retour du lot ; il coûte un audit complet refait.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-44 : aucune ; le routage TF-1735 ne connaît que forge-audit.
