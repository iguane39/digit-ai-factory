# Prompt canonique — nouveau produit via la forge

**Autonome pour tout nouvel utilisateur** : rien n'est supposé installé. Créer un dossier vide
pour le produit, y copier ce fichier (source :
https://github.com/iguane39/digit-ai-factory), ouvrir une session Claude Code dans ce
dossier, coller le bloc rempli.

---

```
Nouveau produit via la forge Digit-AI. Le run vit ICI, dans ce projet.

Phase 0 — outillage (ne suppose RIEN d'installé, et ne me pose AUCUNE question) :
1. Lance l'installateur depuis ce dossier, tout de suite :
     Windows : powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr https://raw.githubusercontent.com/iguane39/digit-ai-factory/main/installer.ps1 -UseBasicParsing -OutFile ([IO.Path]::GetTempPath()+'digit-ai-installer.ps1'); & ([IO.Path]::GetTempPath()+'digit-ai-installer.ps1')"
     ailleurs : curl -fsSL https://raw.githubusercontent.com/iguane39/digit-ai-factory/main/installer.sh | sh
   Il pose lui-même git, node ≥ 18 et uv en portée utilisateur (sans droit administrateur),
   installe ou met à jour le pilot et les treize forges, propage leurs skills, installe ce
   projet, et vérifie le tout par des contrôles exécutés.
2. S'il finit sur « INSTALLATION INCOMPLÈTE », applique le remède de chaque contrôle rouge et
   relance-le. Rends-moi la bannière « FACTORY DIGIT-AI OPÉRATIONNELLE » telle quelle.
3. Retiens la racine qu'il affiche comme FORGE_ROOT pour toute la session.

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

Délégation aux agents — avant la première étape, écris au brief du run qui prend quelle activité
(agents nommés de la flotte du pilot, gabarits\flotte\ ; un `subagent_type` par appel) :
- Tu gardes le pilotage, les décisions, la restitution et le ledger : un agent ne décide rien
  et n'écrit jamais au ledger.
- `explorateur` lit, extrait et compte ; `relecteur` relit à l'aveugle, en lecture seule, sans shell ;
  `verificateur` rejoue une recette ou un oracle et dit si c'est fait ; `redacteur` écrit un document
  sous gabarit ; `campagne` écrit dans UN dépôt sous gabarits\AGENT-CAMPAGNE.md ; `constructeur`
  prend la construction complexe (maquette, architecture, code neuf d'ampleur).
- Pour chacune des 5 étapes (conception, design, development, tests, MEP), le brief nomme l'agent
  de chaque activité, ou dit « session seule » avec son motif : un brief sans cette ligne est incomplet.
- Des agents qui écrivent en parallèle travaillent sur des arbres disjoints (`git worktree add`, un
  par agent). `isolation: "worktree"` est refusée depuis une racine de session en minuscule
  (`c:\…`, TF-2443) : ouvre la session sur la racine canonique (`C:\…`), ou lance les agents sans
  isolation sur des arbres créés à la main.

Promesse : autonome du brief jusqu'au staging vérifié (oracle MEP au complet, `ETAPE-MEP.md`).
La production attend mon GO, donné sur le forge\DOSSIER-MEP.md que tu me présenteras.

À la fin : synthèse — livrables, verdicts d'oracles, escalades de modèle, retours collectés.
```

---

Reprise d'un run suspendu : rouvrir une session **dans le projet produit** et demander
« reprends le run » — l'orchestrateur refait la phase 0 (rapide si tout est en place), relit
`forge\ledger.jsonl` et reprend à l'étape suspendue, sans rejouer les étapes closes.
