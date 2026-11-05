---
destinataire: humain
---

# Synthèse Conseil — décision D-173 (b) appliquée au prompt de suivi des temps et des coûts (05/11/2026)

## 0. Synthèse d'ouverture

Votre choix est appliqué au prompt réécrit. L'étude montrera 3 lignes de résultat : le seuil d'inactivité retenu, l'écart entre les 2 décomptes de jetons et le verdict de la règle qui rattache une session à un produit. Les calculs iront dans la restitution du run. Le prompt est prêt à lancer ; il garde les 10 défauts moyens de la revue d'hier, que l'action A-2 corrige avant le lancement.

Livré : [Revue L99 du prompt de suivi des temps et des coûts](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20suivi%20des%20temps%20et%20couts%20des%20produits%20passe%20au%20crible%20L99%20-%2020261104c.md)

## 1. En-tête d'identification

Suite de la revue L99 (analyse de prompt en 8 couches qui relisent le prompt d'origine) du 04/11/2026, au pilot `digit-ai-factory`. Période : 05/11/2026 de 11:11 à 11:12, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; aucun agent ; escalade de modèle : aucune.

Intention de la demande : appliquer l'option (b) de D-173 au prompt d'étude.

Test rétro : le résultat sert cette intention. Le paragraphe de démonstration et la ligne 9 du contrat de sortie portent maintenant l'option (b), mot pour mot dans son contenu.

## 2. Verdict en une ligne

D-173 (b) appliquée en 5 retouches de la revue ; `oracle-ecriture.mjs` rend exit 0 et `check_markdown.py` PASS.

## 3. Décisions attendues

Aucune décision nouvelle : lancer l'étude se choisit au bloc 8.

## 4. Traité

Le tour a appliqué votre choix au prompt et rejoué les oracles de la revue.

- **Prompt réécrit.** Le paragraphe suspendu dit maintenant que l'étude montre une ligne de résultat par preuve, et la ligne 9 du contrat exige ces 3 lignes dans l'étude et les calculs dans la restitution. Les mentions « Suspendu » ont disparu : 0 occurrence dans la revue, mesurée par `grep -c`.
- **Chapitre 8 de la revue.** La note sur les écarts avec le texte mesuré, le rappel du contrat et la ligne de la démonstration aux écarts à la lettre citent D-173 (b) et sa date. La note dit aussi que ces 2 passages n'ont pas été relus à l'aveugle.
- **Oracles.** `oracle-ecriture.mjs` rend exit 0, `check_markdown.py` rend PASS. La copie du prompt au dossier de travail a été extraite de nouveau de la revue.
- **Relecture d'intention :** sans objet, motif : le tour applique mot pour mot une option que vous avez choisie ; l'alerte d'hier sur la démonstration (RI-20261104-02) est consignée comme confirmée.

## 5. Non traité

- **Les 10 majeurs ouverts** — motif : borne_atteinte, la boucle d'hier s'est arrêtée sur la régression de sa passe 2 ; leurs corrections restent écrites au chapitre 8 de la revue.
- **L'exécution de l'étude** — motif : hors_mandat, votre message tranche D-173 sans demander le lancement.

## 8. Prochaines actions

Deux façons de lancer l'étude, désormais conformes à D-173 (b).

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer l'étude avec le prompt réécrit tel qu'il est, noté 86 | neuve | auto_ia | hors_mandat : lancer un run attend votre « A1 » | chapitre 8 de la revue, bloc « Prompt réécrit » | si rien n'est fait, l'étude reste à écrire et l'historique des jetons continue de s'effacer |
| A-2 | Appliquer d'abord les 10 corrections au prompt, le faire relire par 2 relecteurs aveugles, puis lancer l'étude | neuve | auto_ia | hors_mandat : attend votre « A2 » ; 1 passe de plus a coûté hier de 31 000 à 41 000 jetons par agent | chapitre 8 de la revue, « Les 10 majeurs ouverts » | si on ne le fait pas, l'étude part avec 10 défauts moyens connus |

## 9. Traces

- Revue modifiée : `output/03-etudes/Digit-AI - Revue - Prompt suivi des temps et couts des produits passe au crible L99 - 20261104c.md`.
- Synthèse d'hier : `output/04-plans/Digit-AI - Synthese Conseil - Prompt suivi des temps et couts passe au crible L99 - 20261104h.md`.
- Alerte confirmée : `todo/relectures-intention.jsonl`, RI-20261104-02.
- Enregistrement : commit local au pilot, non publié ; son numéro se lit par `git log -1`.
