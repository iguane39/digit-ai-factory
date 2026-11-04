---
destinataire: humain
---

# Synthèse Mandat — appel de preuve du générateur d'images et contrôle mensuel des modèles tiers (04/11/2026)

## 0. Synthèse d'ouverture

Le générateur d'images de forge-design est prouvé sur le modèle courant de Google : un appel payant a servi une image en 20 s, et l'oracle des images la juge conforme. Le contrôle des modèles d'OpenAI et de Gemini ne coûte plus 49 à 75 s à chaque revue hebdomadaire : il se rejoue une fois par mois, comme vous l'avez demandé. La revue d'une semaine donne la date du dernier contrôle et celle du prochain. Aucune décision ne vous revient. Le pilot reste à publier : son arbre porte le travail non enregistré d'autres sessions.

Livré : [Page-témoin du producteur d'images du 04/11/2026](../digit-ai-forge-design/output/01-pages-temoins/Forge%20Design%20-%20Page-Temoin%20Producteur%20Images%20-%2020261104a.html)

## 1. En-tête d'identification

Run de mandat « A2 & A3 : Tous les mois suffit », sur forge-design et le pilot `digit-ai-factory`. Période : 04/11/2026 de 15:12 à 15:21, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, sans agent ; escalade de modèle : aucune.

Intention de la demande : prouver par un appel réel que le générateur d'images marche sur un modèle courant, et ramener le contrôle des modèles tiers à un rythme mensuel.

Test rétro : le résultat sert cette intention. L'appel a servi l'image par le premier modèle de la liste, sans repli, et la revue d'une semaine après un contrôle ne rejoue plus l'oracle.

## 2. Verdict en une ligne

2 actions faites sur 2, chacune prouvée par son oracle ; forge-design publié, `git rev-list` à 0 0 ; pilot enregistré et non publié.

## 3. Décisions attendues

Aucune décision nouvelle ne vous revient.

## 4. Traité

- **Appel payant de preuve, forge-design, commit `d2a07c5`.** Ce matin, une autre session a changé les modèles du générateur sans appel réel (`9b89fd9`, TF-2111). Votre « A2 » a payé l'appel qui le prouve : à 15:14, `generer-images.mjs --seulement hero` a servi 1 image par `gemini-nano-banana-2.1` en 20 s, ramenée de 777 Ko à 179 Ko. La clé est lue dans le `.env` du pilot par l'option `--env`, sans être ni affichée ni copiée. `oracle-images` rend PASS sur 3 images, avec un avertissement de dimensions qui existait déjà en août. J'ai regardé l'image : un établi d'atelier avec de l'outillage électronique, sans marque lisible. Publié à 15:16, `git rev-list` 0 0.
- **Cadence mensuelle, pilot, commit `f27dfd39`.** `todo/revue-hebdo.mjs` lit son journal et ne rejoue `oracle-modeles-tiers` que si le dernier contrôle mesuré a 30 jours ou plus. Sinon, la section du dossier donne la date du dernier contrôle et celle du prochain. Un contrôle « non mesuré » ne compte pas, et `--modeles-tiers-forcer` rejoue l'oracle quand même. La recette passe sur 4 journaux et 2 lignes de commande ; une revue privée de cette cadence la fait échouer, parce que l'oracle s'y rejoue une semaine après. `references/TODO-FORGE.md` dit la même règle.
- **Registre.** TF-2111 et TF-2116 reçoivent chacun une note qui porte votre réponse, le commit et la preuve. `journaliser.mjs` rend 2 événements journalisés, et `oracle-todo` exit 0.
- **Coordination.** Une autre session traite les retours et la liste de travail du jour. Nous avons convenu par message qu'elle enregistrerait le registre, avec mes 2 notes, quand ses agents auront rendu.

## 5. Non traité

- **La publication du pilot** : motif, bloqué par un garde-fou ; le pilot a 30 commits d'avance et 2 de retard à 15:19. Le rebase exige un arbre propre, et l'arbre porte le travail non enregistré d'au moins 2 autres sessions, qu'un stash pourrait abîmer. Critère de réouverture : l'arbre rendu propre par ces sessions, puis le rebase et l'envoi sous le GO permanent `D-54 (b) du 03/10`.
- **Les 2 vignettes de la page-témoin** : motif, écarté ; elles restent celles du 11/08/2026, servies par un modèle aujourd'hui déprécié, et la page le dit. Une image suffit à prouver le modèle, et chaque vignette de plus coûte un appel payant.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| A-2, le changement de modèle avec un appel de preuve | l'appel de preuve seul, sur 1 image | le changement de modèle avait déjà été fait ce matin par une autre session, sans appel |
| A-3, la cadence mensuelle | la cadence, plus une option qui force le contrôle | un fournisseur qui annonce un arrêt entre 2 contrôles doit pouvoir être vérifié le jour même |

## 7. Risques

- **Arrêt annoncé entre 2 contrôles.** Énoncé : un arrêt publié juste après un contrôle n'apparaît qu'au contrôle suivant, jusqu'à 37 jours plus tard. Signal : une erreur de modèle inconnu chez un produit. Parade : `--modeles-tiers-forcer`, ou `node oracles/oracle-modeles-tiers.mjs` à la main.

## 8. Prochaines actions

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Publier le pilot quand son arbre est propre | aucun | auto_ia | dépendance, l'arbre porte le travail d'autres sessions | `git pull --rebase` puis `git push` sous `FORGE_PUSH_GO="D-54 (b) du 03/10"` | la cadence mensuelle reste locale |

## 9. Traces

- forge-design : `d2a07c5`, publié ; pilot : `f27dfd39`, enregistré et non publié.
- Registre : `todo/TODO.jsonl`, notes du 04/11 sur TF-2111 et TF-2116, non enregistrées, que l'autre session enregistrera.
- Journal de l'appel : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\a0b92278-318b-4727-aa5e-4ab9fb1eb010\scratchpad\mandat\appel-preuve.log`.
