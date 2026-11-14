# Retours forges — Produit-86 — 20261106e

- **Contexte** : clôture du run `20261106e-correctifs-premier-job-client`. Le vérificateur des forges mobilisées rendait « manque » sur 2 livrables que la demande ne touche pas. Suivre son remède a fait passer pour périmés 3 livrables produits pendant le run.
- **Références ledger** : `forge\ledger.jsonl` seq 681 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 06/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 06/11/2026 : `todo/CLASSES.json` du pilot, 254 classes. La classe `regle-qui-interdit-son-propre-remede` décrit un contrôle qui refuse la correction que son message recommande ; elle porte sur un refus bloquant, quand ici le remède suivi périme d'autres livrables. RP-50 s'y rattache, faute d'une classe plus juste.

## pilot (mobilisation)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-50 | mineur | générique | `mobiliser.mjs --verifier` rendait MANQUE sur `DESIGN.md` et `tokens.css`, que la demande ne touche pas. Son remède : les déclarer inchangés dans une nouvelle ligne de trace (`--verdicts`). Or cette ligne porte une nouvelle heure de demande, 14:37:00. Le vérificateur juge dès lors périmés tous les livrables produits depuis la demande d'origine, de 14:13:51 : le rapport forge-tests (14:27), `DOSSIER-MEP.md` (14:36) et les verdicts websec (14:36). Suivre le remède a fait passer de 2 manques à 3 autres. Preuve : `forge/mobilisation.jsonl` du 06/11/2026 ; ledger seq 681. | Une ligne `--verdicts` qui amende la même demande (même session, même texte) garde l'heure de la première ligne, ou porte un champ `ts_demande` repris d'elle. |

## La règle qui aurait évité le retour

- `regle-qui-interdit-son-propre-remede` (RP-50) : le remède qu'un contrôle donne ne doit pas faire échouer le contrôle sur autre chose.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 3 livrables jugés périmés existent bien et ont été écrits pendant le run | rien n'est retouché : réécrire les fichiers pour leur donner une heure plus récente maquillerait la mesure ; l'écart est déclaré à la restitution | oui | remonté (RP-50) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261106d) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le refus du vérificateur sur une déclaration d'inchangé mal nommée (`DESIGN.md` au lieu de `design-md`) nomme les identifiants attendus : il s'est corrigé en un essai.
