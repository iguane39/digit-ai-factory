# Prompt canonique — nouveau produit via la forge

**Autonome pour tout nouvel utilisateur** : rien n'est supposé installé. Créer un dossier vide
pour le produit, y copier ce fichier (source :
https://github.com/iguane39/digit-ai-forge-pilot), ouvrir une session Claude Code dans ce
dossier, coller le bloc rempli.

---

```
Nouveau produit via la forge Digit-AI. Le run vit ICI, dans ce projet.

Phase 0 — outillage (ne suppose RIEN d'installé, quel que soit mon système) :
1. Vérifie les prérequis : git ; gh (les forges sont publiques sous github.com/iguane39
   depuis le 10/08 — gh authentifié n'est requis que pour les dépôts d'engagement privés) ;
   node ≥ 18 ; uv ; python. S'il en manque, liste-les avec la commande d'installation
   adaptée à mon système, puis attends que je confirme.
2. Localise la forge : $FORGE_ROOT s'il est défini, sinon cherche un dossier contenant
   digit-ai-forge-pilot parmi : le parent de ce projet, c:\dev, ~/.digit-ai-forge.
   Si introuvable, installe-la :
     gh repo clone iguane39/digit-ai-forge-pilot ~/.digit-ai-forge/digit-ai-forge-pilot
     node ~/.digit-ai-forge/digit-ai-forge-pilot/bootstrap.mjs
   (bootstrap.mjs clone les 5 forges à côté du pilot et vérifie leurs points d'entrée —
   il doit finir sur « Poste prêt », sinon corrige ce qu'il signale avant de continuer.)
3. Si la forge était déjà installée : mets-la à jour — `git pull --ff-only` dans le pilot
   puis `node bootstrap.mjs --pull` (les correctifs des forges arrivent en continu ; un run
   démarre TOUJOURS sur les dernières versions, consignées au ledger).
4. Retiens la racine comme FORGE_ROOT pour toute la session.

Puis suis le CLAUDE.md du pilot avec ce dossier comme projet produit :
ledger et artefacts d'étapes sous forge\, code du produit à la racine.

Brief :
- Problème : [ce qui fait mal aujourd'hui]
- Cible : [qui l'utilise]
- Job principal : [le service rendu, en une phrase]
- Palier visé : [MVP | V1]
- Ton de marque : [3 mots concrets, ou délégation « reprendre le ton de <référence> » —
  résolue par observation datée, consignée en hypothèse, sans me suspendre]
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
« reprends le run » — l'orchestrateur refait la phase 0 (rapide si tout est en place), relit
`forge\ledger.jsonl` et reprend à l'étape suspendue, sans rejouer les étapes closes.
