---
destinataire: humain
---

# Synthèse Conseil — décision D-177 consignée : la charge des produits se suit en 3 indicateurs séparés (05/11/2026)

## 0. Synthèse d'ouverture

Votre réponse est consignée : la charge se suivra en 3 indicateurs séparés, jamais additionnés. Ce sont le nombre d'interventions humaines, le temps humain et le temps agent. La construction du relevé les écrira tous les 3 ; le temps humain reste à valider à ce moment, car un écart entre 2 messages mêle réflexion et absence. Rien n'est construit : la construction attend votre « A1 ».

Livré : [Étude — Suivi des temps et des coûts par produit](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Suivi%20des%20temps%20et%20des%20couts%20par%20produit%20-%2020261105a.md)

## 1. En-tête d'identification

Suite de l'étude du suivi des temps et des coûts, au pilot `digit-ai-factory`. Période : 05/11/2026 de 15:02 à 15:05, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; aucun agent ; escalade de modèle : aucune.

Intention de la demande : trancher la lecture de la charge en retenant les 3 lectures, suivies séparément.

Test rétro : le résultat sert cette intention. La candidature au registre cite votre réponse mot pour mot et nomme les 3 indicateurs, sans les fondre en un seul.

## 2. Verdict en une ligne

D-177 consignée sur la candidature TF-2181, restée au statut `candidat` ; `oracle-todo` rend PASS avant et après l'écriture.

## 3. Décisions attendues

Aucune décision nouvelle : la construction se lance au bloc 8.

## 4. Traité

Le tour a écrit votre réponse au registre, sans toucher à l'étude.

- **Registre.** Un événement `maj` sur TF-2181 cite « 177 : A, b & c séparés » et décrit les 3 indicateurs. La candidature reste `candidat`, car passer en `decide` vaudrait un feu vert de construction que vous n'avez pas donné.
- **Étude.** Laissée telle quelle : c'est un livrable daté et enregistré, et sa section 1.1 posait déjà la question ; la réponse vit au registre.
- **Relecture d'intention :** sans objet, motif : le tour consigne mot pour mot une réponse que vous avez donnée.

## 5. Non traité

- **La construction du relevé** — motif : hors_mandat, votre message tranche D-177 sans demander la construction.
- **La validation du temps humain** — motif : hors_mandat, elle se fait pendant la construction, sur des sessions réelles.

## 8. Prochaines actions

Deux suites possibles ; A-1 d'abord, parce que chaque mois d'attente efface un mois de jetons.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Construire le relevé de fin de session avec les 3 indicateurs de charge, le marqueur du pilot et le référentiel de prix daté | TF-2181 | auto_ia | hors_mandat : la construction attend votre « A1 » | `todo/TODO.jsonl`, TF-2181 ; étude, section 4 | si rien n'est fait, chaque mois efface encore un mois de jetons |
| A-2 | Inscrire les 4 dépôts sans pseudonyme à la table des pseudonymes | neuve | auto_ia | hors_mandat : attend votre « A2 » | table hors dépôt, sous `_confidentiel` | si rien n'est fait, la porte de publication ne protège pas leurs noms |

## 9. Traces

- Décision consignée : événement `maj` de TF-2181 au registre `todo/TODO.jsonl`.
- Étude : `output/03-etudes/Digit-AI - Étude - Suivi des temps et des couts par produit - 20261105a.md`.
- Enregistrement : commit local au pilot, non publié ; son numéro se lit par `git log -1`.
