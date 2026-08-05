# Prompt canonique — nouveau produit via la forge

**Ce fichier vit à la racine du projet produit, pas dans le steering.** Créer le dossier du
nouveau projet, y copier ce fichier, ouvrir une session Claude Code dans ce dossier, coller le
bloc rempli.

---

```
Nouveau produit via la forge Digit-AI. Le run vit ICI, dans ce projet.

Steering : localise c:\dev\digit-ai-forge-steering (ou $FORGE_ROOT\digit-ai-forge-steering) ;
s'il est absent, clone-le (gh repo clone iguane39/digit-ai-forge-steering) puis exécute
`node bootstrap.mjs` dedans. Suis ensuite son CLAUDE.md avec ce dossier comme projet produit :
ledger et artefacts d'étapes sous forge\, code du produit à la racine.

Brief :
- Problème : [ce qui fait mal aujourd'hui]
- Cible : [qui l'utilise]
- Job principal : [le service rendu, en une phrase]
- Palier visé : [MVP | V1]
- Ton de marque (3 mots concrets) : [ex. encre, papier, atelier]
- Contraintes reprises : [existant à respecter, ou « aucune »]
- Cible de déploiement : [docker local/staging (défaut) | autre, à préciser]

Déroule les 5 étapes (conception → design → development → tests → MEP) sous ledger,
chaque étape validée par les oracles de sa forge. Suspends-toi proprement (forge\QUESTIONS.md)
si une décision me revient. Consigne tes hypothèses. Aucune écriture dans les dépôts
digit-ai-forge-* ; améliorations en proposition seulement.

Promesse : autonome du brief jusqu'au staging vérifié (oracle MEP 5/5).
La production attend mon GO, donné sur le forge\DOSSIER-MEP.md que tu me présenteras.

À la fin : synthèse — livrables, verdicts d'oracles, escalades de modèle, retours collectés.
```

---

Reprise d'un run suspendu : rouvrir une session **dans le projet produit** et demander
« reprends le run » — l'orchestrateur relit `forge\ledger.jsonl` et reprend à l'étape
suspendue, sans rejouer les étapes closes.
