---
destinataire: humain
---

# Synthèse Mandat — D-108 (b) appliquée aux forges ops et design (14/11/2026)

## 0. Synthèse d'ouverture

Votre choix est appliqué et publié. Un contrôle ne peut plus annoncer qu'une page animée est fluide sans avoir mesuré ses images, ni passer sous silence une capture d'écran manquante. Une tâche planifiée ne peut plus être déclarée en service sans la preuve d'une publication réellement lue après sa mise en route. Une surveillance séparée signale aussi chaque échéance passée sans publication. Le travail du 29/10 a été repris sur la version à jour de la forge de conception visuelle, qui ne diverge plus. Rien ne vous est demandé.

Livré : [Synthèse du 14/11, D-108 (b) appliquée](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20D-108%20%28b%29%20appliquee%20aux%20forges%20ops%20et%20design%20-%2020261114d.md)

## 1. En-tête d'identification

Exécution de votre réponse « 108b » à la synthèse 20261114c, sur forge-ops, forge-design et le pilot `digit-ai-factory`. Synthèse relevée le 14/11/2026 à 17:33, heure de Paris (`date`). Session pilote Claude Opus 5.5, 1 agent `campagne` Claude Sonnet 5.5 (forge-ops), 2 relectures d'intention.

Intention de la demande : qu'aucun PASS ni aucune mise en service ne repose plus sur une mesure absente, dans les 2 forges.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Les 2 défauts constatés le 29/10 sont refusés par une recette rejouée, et les 2 forges sont publiées.

## 2. Verdict

2 sujets clos sur 2 (TF-2560, TF-2561) ; forge-ops 870 PASS, 0 FAIL (843 avant) ; forge-design « Tout vert », 80 oracles et 183 règles, dans une copie propre ; 2 forges publiées, 0 commit d'écart.

## 3. Décisions attendues

Aucune décision ne vous revient.

Bloquants de ce tour, chacun avec ce qui le lève, sans geste de votre part :
- La cadence du contrôle d'échéances et le destinataire de son alerte se décident au run du produit qui a une tâche planifiée : ce run les lève.
- Le journal des relectures et le registre des décisions portent aussi le travail en cours d'une autre session : son propre enregistrement les lève.

## 4. Traité

- D-108 (b) consignée au registre : TF-2560 (forge-ops) et TF-2561 (forge-design).
- forge-ops, TF-2560, par un agent puis rejoué par moi :
  - « en service » exige une publication lue après la mise en service, par une colonne « En service depuis » ajoutée à la règle O-22 (le contrôle de mise en service d'une tâche planifiée), qui existait depuis le 29/10 ;
  - un contrôle d'échéances (`scripts/surveiller-echeances.mjs`) alerte, par une alerte nommée, sur chaque échéance passée sans publication lue ; il refuse d'être déclaré dans le planificateur même de la tâche qu'il surveille, et n'appelle aucune plateforme ;
  - garde-fou G-09 au registre de la forge ;
  - preuve : 870 PASS, 0 FAIL au rejeu ; publié 658c76d..926b57a.
- forge-design, TF-2561, par moi : le commit du 29/10 repris sur la forge à jour (49 commits), 4 conflits résolus ; 2 défauts de reprise corrigés (une variable disparue depuis le 29/10, une plage de règles écrite en dur contre la règle de TF-2293) ; recette verte dans une copie propre ; publié 165d274..8bd5d1a, la divergence est levée.
- TF-2562, candidat : 2 cas de la recette de forge-design comparent des chemins en respectant la casse, et rougissent dans le clone dont le fichier d'environnement local écrit « c:/dev ».

Relecture d'intention : sert après 1 passe (RI-20261114-03 dérive, corrigée ; RI-20261114-04 sert) : la consigne disait mal le partage entre la session et l'agent.

## 5. Non traité

- La cadence du contrôle d'échéances et le destinataire de son alerte, chez un produit — motif : `dependance_externe`, ils se décident au run du produit qui a une tâche planifiée.
- Le journal des relectures et le registre des décisions, modifiés aussi par une autre session en cours — motif : `garde_fou`, je n'enregistre pas le travail non enregistré d'une autre session.

## 6. Écarts à la lettre

- L'option (a) disait « en service exige l'identifiant d'une publication lue » → la règle existait déjà depuis le 29/10, l'agent l'a complétée par la date de mise en service → un identifiant lu avant la mise en route passait.
- Le message de sortie de l'oracle de fluidité ne cite plus ses règles par leur plage → elles vivent dans sa bibliothèque, que le contrôle des plages ne lit pas.

## 7. Risques

- Un produit dont la table des composants déclare une tâche « en service » sans la nouvelle colonne sera refusé par O-22 ; signal : un FAIL O-22 à son prochain contrôle ; parade : ajouter la date de mise en service.

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Rendre la recette de forge-design insensible à la casse du chemin et au fichier d'environnement local | TF-2562 | auto_ia | borne_atteinte : constaté en fin de tour | prochaine demande « TODOs et retours » | 2 faux échecs dans le clone de `C:\dev` |
| A-2 | Corriger les sujets décidés du registre par une campagne | neuve | auto_ia | borne_atteinte : 36 sujets décidés en attente | prochaine demande « TODOs et retours » | ils attendent la prochaine campagne |

## 9. Traces

Registre `todo\TODO.jsonl` (TF-2560 et TF-2561 clos, TF-2562 candidat) ; forge-ops 6b327d8, 926b57a ; forge-design 8bd5d1a ; relectures RI-20261114-03 et RI-20261114-04.
