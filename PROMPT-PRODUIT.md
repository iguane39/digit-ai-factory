# Prompt canonique — nouveau produit via la forge

Ouvrir une session Claude Code dans `c:\dev\digit-ai-forge-steering` et coller ce bloc rempli.

---

```
Nouveau produit via la forge. Suis le CLAUDE.md de ce dépôt.

Brief :
- Problème : [ce qui fait mal aujourd'hui]
- Cible : [qui l'utilise]
- Job principal : [le service rendu, en une phrase]
- Palier visé : [MVP | V1]
- Ton de marque (3 mots concrets) : [ex. encre, papier, atelier]
- Contraintes reprises : [existant à respecter, ou « aucune »]
- Cible de déploiement : [docker local/staging (défaut) | autre, à préciser]

Déroule les 5 étapes (conception → design → development → tests → MEP) sous ledger,
chaque étape validée par les oracles de sa forge. Suspends-toi proprement (QUESTIONS.md)
si une décision me revient. Consigne tes hypothèses. Aucune écriture dans les dépôts
digit-ai-forge-* ; améliorations en proposition seulement.

Promesse : autonome du brief jusqu'au staging vérifié (oracle MEP 5/5).
La production attend mon GO, donné sur le DOSSIER-MEP.md que tu me présenteras.

À la fin : synthèse — livrables, verdicts d'oracles, escalades de modèle, retours collectés.
```

---

Reprise d'un run suspendu : « reprends le run <run-id> » — l'orchestrateur relit
`runs\<run-id>\ledger.jsonl` et reprend à l'étape suspendue, sans rejouer les étapes closes.
