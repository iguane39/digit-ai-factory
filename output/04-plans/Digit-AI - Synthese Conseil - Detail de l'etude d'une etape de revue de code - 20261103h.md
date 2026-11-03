---
destinataire: humain
---

# Synthèse Conseil — détail de l'étude d'une étape de revue de code (03/11/2026)

## 0. Synthèse d'ouverture

Vous demandez le détail de la seconde action : faut-il étudier une revue de code systématique avant chaque mise en production ? Les 2 revues d'essai ont trouvé des failles sérieuses que nos contrôles laissent passer, mais à un prix élevé et sans preuve encore qu'elles soient toutes réelles. Je recommande l'étude, qui chiffrera ce prix avant tout engagement ; rien ne change sans votre réponse.

## 1. En-tête d'identification

Conseil sur le pilot `digit-ai-factory`, réponse à « Détaille A2 ». Période : 03/11/2026 à 15:12, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : comprendre la décision cachée derrière la seconde action avant de la trancher.

Test rétro : la décision se lit en entier, avec ses chiffres, ses options et ce qui se passe sans réponse.

## 3. Décisions attendues

**D-152** : correction des failles du second produit relu, posée le 02/11 à 17:12, inchangée.

> **D-153 — Après 2 essais, faut-il étudier une étape de revue de code par un seul agent dans la forge de sécurité ?**
>
> - **De quoi s'agit-il** : une revue en lecture seule, appuyée sur `referentiels/classes-attaque.md` de `digit-ai-forge-websec`, qui s'ajouterait aux contrôles d'une mise en production.
> - **Le problème** : les 2 essais trouvent 4 constats élevés que nos contrôles ne jugent pas, pour 545 163 jetons. Mais aucun n'est rejoué, donc la part de faux constats reste inconnue, et le plafond n'a pas de compteur : le second agent s'estimait à 215 000 jetons pour 294 940 mesurés. Une étape obligatoire coûterait ce prix à chaque produit.
> - **Pourquoi vous** : une étape de plus s'imposerait à tous les produits et consommerait votre abonnement.
> - **Recommandation : (a)** — le gain est assez net pour une étude, qui tranchera le coût et les règles. Source consultée : les 2 rapports de revue.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lancer l'étude | Une étude au gabarit compare une étape obligatoire, une étape sur demande et une revue limitée aux zones sensibles. Rien ne change avant votre choix | Moyen × moyen | Possible : l'étude conclut, rien ne s'engage |
| (b) Garder la revue sur demande | La consigne reste réutilisable, sans étape ni étude, et chaque revue se décide à part | Nul | Possible : étudier plus tard |

> **Sans réponse** : (b), la revue reste sur demande.

## 4. Traité

Le texte de la décision vient de la restitution du 02/11, relue dans la transcription de la session.

- **Source** : la question réservée à `decisions/REGISTRE.jsonl` est identique mot pour mot à la tête affichée, relevée par `grep`.
- **Lien avec D-152** : le rejeu des failles du second produit mesurerait la part de faux constats, la donnée qui manque pour chiffrer l'étape.

Relecture d'intention : sans objet, motif : réponse de lecture qui recopie une décision déjà posée.

## 5. Non traité

Rien n'est resté de côté : la demande portait sur la seule seconde action.

## 8. Prochaines actions

La décision D-153 profite du rejeu de D-152 ; les 2 restent à votre main.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Décider de corriger les failles du second produit relu | `TF-2057` | manuelle_utilisateur | decision : écriture chez un produit | D-152 à `decisions/REGISTRE.jsonl` | si rien n'est fait : la version en attente garde ses failles |
| A-2 | Décider d'étudier une étape de revue de code | `TF-2057` | manuelle_utilisateur | decision : règle commune aux produits | D-153 à `decisions/REGISTRE.jsonl` | si rien n'est fait : chaque revue reste à demander |

## 9. Traces

- Décision : D-153 à `decisions/REGISTRE.jsonl`, réservée le 02/11/2026.
- Synthèse précédente : `output/04-plans/Digit-AI - Synthese Mandat - Favicon du produit de pentest en thème sombre - 20261103g.md`.
