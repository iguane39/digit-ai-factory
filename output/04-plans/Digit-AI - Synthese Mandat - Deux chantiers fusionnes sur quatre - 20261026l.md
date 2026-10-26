---
destinataire: humain
---

# Synthèse Mandat — deux chantiers fusionnés sur quatre : décisions sans lettre et gestes destructifs groupés (26/10/2026)

## 0. Synthèse d'ouverture

Deux de vos quatre décisions de code sont en place dans le pilot. Un message qui ne cite pas la lettre d'une décision ouverte déclenche désormais un rappel avant tout geste. Les suppressions et changements de droits sur une ressource distante sont refusés tant qu'ils ne figurent pas dans un lot que vous avez approuvé en une seule fois. Ce second contrôle ne prend effet qu'à l'ouverture d'une nouvelle session. Les deux autres chantiers, le compte rendu allégé et la réécriture des écrits trop longs, tournent encore ; rien ne vous est demandé de neuf.

## 1. En-tête d'identification

Point d'étape · fusion des chantiers de vos réponses D-76 (c) et D-77 (b) amendée · sur le pilot digit-ai-factory · le 26/10/2026 à 16:23 (heure de Paris, UTC+1) · Claude Opus 5.5 et 2 agents de campagne, fusions 11955177 et d64336f6, locales.

Intention : réduire vos interventions tout en vous laissant la maîtrise des gestes risqués. Test rétro : les deux chantiers fusionnés servent l'intention, car un seul accord couvre désormais tous les gestes destructifs d'un tour.

## 2. Ce qui reste à mesurer, et par quoi

- Compte rendu allégé (T2) et réponse courte élargie : par `oracles/hook-restitution.test.mjs` au retour de l'agent constructeur.
- Concision et langue rejouées : par la recette d'`oracles/oracle-ecriture.mjs` au retour de son agent.
- Effet réel des 2 contrôles fusionnés : par la prochaine analyse d'œil critique, qui comptera les décisions tranchées sans lettre et les gestes destructifs sans lot.

## 3. Décisions attendues

Aucune décision nouvelle. Rappel : D-79, ordre de T4 et contrôle audit et data, posée à 16:02, inchangée.

## 4. Traité

- D-76 (c), TF-1958, fusionné (11955177) :
  - `references/PREFERENCES-PORTEUR.md` reçoit la ligne datée « un message qui ne cite pas la lettre d'une décision ouverte n'en vaut pas le choix » ;
  - `oracles/hook-lexique.mjs` rappelle les décisions ouvertes du dernier message quand votre message n'en cite aucune lettre, sans jamais bloquer ; « A1 » ou « 76c » ne déclenchent rien ;
  - `oracles/hook-lexique.test.mjs` : 20 PASS et 3 FAIL avant le correctif, 23 PASS après, rejoué sur le pilot fusionné ; hook d'ouverture 44 PASS.
- D-77 (b) amendée, TF-1959, fusionné (d64336f6) :
  - nouveau hook `oracles/hook-gestes-distants.mjs`, déclaré au pilot et chez les produits : une commande destructive distante est refusée sans lot approuvé ; le lot couvre tous les gestes d'un tour, vaut 24 h au plus et cite vos mots ;
  - référence `references/GESTES-DISTANTS.md` : liste fermée de 32 formes refusées, format du lot, limites déclarées ;
  - recettes rejouées sur le pilot fusionné : hook 74 PASS, relais des produits 25/25, héritage 46 PASS, `oracle-claude-md` PASS, hook de saisie 23 PASS.
- Index générés remis à l'état enregistré avant chaque fusion, sans perte.
- Relecture d'intention : sans objet pour ce point d'étape, les deux derniers chantiers n'étant pas rendus ; chaque agent a rejoué ses recettes contre la consigne citant vos mots.

## 5. Non traité

- Chantiers T2 et D-78 : en cours, non rendus.
- Publication du pilot : non faite, 10 commits d'avance sur GitHub ; elle suivra les 2 dernières fusions.
- Fichier des lots approuvés : son suivi par git reste à fixer à la première écriture ; je le suivrai, comme trace d'audit de vos approbations.

## 6. Écarts à la lettre

L'agent des gestes destructifs a élargi la liste nommée dans la consigne à des gestes de même effet (purge, retrait de droits par API, envoi en miroir), pour tenir « toutes les modifications de droits » de votre réponse ; chaque famille est justifiée dans la référence.

## 7. Risques

- Énoncé : le hook des gestes destructifs n'a pas été joué sur un appel réel, seulement en recette. Signal : un refus mal formulé à la première commande destructive. Parade : la prochaine session qui en rencontre un le relève, et l'œil critique le compte.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 dépend du retour des 2 agents.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1947 | Fusionner T2 et D-78 à leur retour, rejouer les recettes, publier le pilot | auto_ia | dependance_externe | retour des 2 agents lancés à 16:00, puis `git push origin main` | l'autre poste ne reçoit aucune de ces règles |
| **A-2** | TF-1949 | Lancer T4 selon votre réponse à D-79 | auto_ia | dependance_bloc_3 | réponse « 79c » ou autre lettre | les forges audit et data restent oubliées |

## 9. Traces

- Fusions 11955177 (TF-1958) et d64336f6 (TF-1959).
- `oracles/hook-lexique.mjs`, `oracles/hook-gestes-distants.mjs`, `references/GESTES-DISTANTS.md`.
- `todo/TODO.jsonl`, TF-1958 et TF-1959.
