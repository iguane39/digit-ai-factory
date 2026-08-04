# Prompt canonique — démarrer un nouveau produit

Copier le bloc ci-dessous dans une session Claude Code ouverte dans
`c:\dev\digit-ai-forge-steering`, en remplaçant le brief entre crochets.

---

```
Nouveau produit via la forge.

Brief : [décrire le produit en quelques lignes — problème, cible, job principal, palier visé
(MVP/V1), et si connu : ton de marque en 3 mots concrets + contraintes reprises.
Ou joindre un CDC / pointer un dépôt existant.]

Suis le CLAUDE.md de ce dépôt : ouvre un run sous runs\, tiens le ledger, déroule
conception → design → development → tests en validant chaque étape par les oracles de la forge
concernée, et suspends-toi proprement (QUESTIONS.md) si un seuil de suffisance ou un champ non
dérivable exige ma réponse. Consigne toute hypothèse dans HYPOTHESES.md du run.

Améliorations des forges : propositions seulement, jamais d'application sans mon feu vert.

À la fin : synthèse — livrables produits, verdicts d'oracles, escalades de modèle, retours
collectés pour la boucle d'amélioration.
```

---

Reprise d'un run suspendu : ouvrir la même session, répondre aux questions de
`runs\<run>\QUESTIONS.md`, et demander « reprends le run <run-id> » — l'orchestrateur relit le
ledger et reprend à l'étape suspendue (reprise idempotente : les étapes closes ne sont pas rejouées).
