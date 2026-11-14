---
destinataire: humain
---

# Synthèse Mandat — D-209 appliquée au prompt de suivi des agents, 12/11/2026

## 0. Synthèse d'ouverture

Votre réponse est appliquée : le suivi des agents toutes les 15 minutes sera exigé et prouvé par des agents de test avant d'être déclaré livré. Le prompt porte désormais ce choix dans une nouvelle version, et la précédente reste telle que vous l'avez reçue. Il ne reste qu'à lancer la construction : relisez le prompt, puis écrivez « exécute le prompt ».

Livré : [Prompt réécrit, version g](output/04-plans/Digit-AI%20-%20Prompt%20-%20Suivi%20des%20agents%20toutes%20les%2015%20minutes%20-%2020261112g.md)

## 1. En-tête d'identification

Mandat : application de la réponse « 209a » à la décision D-209. Sur le pilot `digit-ai-factory` (commit 048dc4ce). Période : 12/11/2026, de 19:52 à 19:53, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, aucun agent.

Intention de la demande : que le suivi des agents soit prouvé avant d'être déclaré livré, et non seulement écrit.

Test rétro : le résultat sert cette intention ; l'étape de preuve du prompt n'est plus conditionnelle, et un banc rouge rend le mandat en échec.

## 2. Verdict en une ligne

D-209 (a) appliquée au prompt, version g : 2 passages modifiés, `check_markdown.py` PASS et `oracle-ecriture` PASS.

## 3. Décisions attendues

Rien n'attend de décision : D-209 est tranchée par votre réponse « 209a ».

## 4. Traité

Le prompt de la version e était scellé à sa remise ; la réponse s'applique donc dans un nouveau fichier daté, à l'indice suivant.

- Étape 5 du prompt : elle dit que le porteur a tranché le 12/11/2026 et que le suivi est exigé et prouvé ; la condition « sans réponse, elle ne se joue pas » est retirée.
  - preuve : `grep -c` rend 2 mentions de D-209 et de « 209a » dans la version g.
- Contrat de sortie, critère 4 : les 4 bancs et l'oracle de relevé y sont exigés sans condition.
  - preuve : `check_markdown.py` PASS, `oracle-ecriture` PASS sur la version g.
- En-tête du prompt : la version g dit qu'elle remplace la version e, selon la règle 5 de `REGLES-PROJET.md`.
  - preuve : lecture de la ligne 3 du fichier.

Relecture d'intention : sans objet, la réponse à une décision s'applique telle quelle, sans reformulation.

## 5. Non traité

- Exécution du prompt — motif : hors_mandat ; elle attend votre « exécute le prompt ».

## 8. Prochaines actions

Les actions sont classées dans l'ordre où elles se font, parce que chacune attend la précédente ; il n'en reste qu'une, la vôtre.

| Sélecteur | Item | Action | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | neuve | Lancer la construction du suivi | manuelle_utilisateur | decision | relire `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112g.md`, puis écrire « exécute le prompt » | si rien n'est fait : le suivi reste une règle écrite qui ne tourne pas |

## 9. Traces

- Prompt, version g : `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes - 20261112g.md`.
- Synthèse de la revue : la synthèse Conseil du même dossier, indice 20261112f, qui posait D-209.
