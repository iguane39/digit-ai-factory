---
destinataire: humain
---

# Synthèse Mandat — seules les décisions qui vous reviennent vous sont posées, 42a exécutée et 6 décisions prises sans vous (01/10/2026)

## 0. Synthèse d'ouverture

Votre règle est en place : avant d'être posée, chaque décision est analysée, et seules celles qui engagent une dépense, une publication, un geste irréversible, une règle de doctrine, une préférence entre options réelles ou l'écriture chez un produit vous parviennent désormais. Les autres sont exécutées et vous sont rendues pour information. Votre réponse 42a est appliquée. Les 6 autres décisions de la revue ont été exécutées sans vous, chacune sous un test rouge puis vert. Une seule question vous reste ce soir : la publication, qui vous revient par nature.

## 1. En-tête d'identification

- **quoi** — mise en place de votre règle sur les décisions, exécution de 42a, puis des 6 décisions qu'elle rend automatiques.
- **sur quoi** — le pilot `digit-ai-factory` (doctrine, gabarit de restitution, outil de revue, registre) et la forge `digit-ai-forge-agents` (skills `quality-oracles` et `digit-ai-page-html`).
- **quand** — 2026-10-01 19:06 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début à 18:06, heure de la première commande du tour ; durée mesurée 60 min.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; pilot de `014b2745` à `5ea8c422`, forge-agents de `994e516` à `2d752ea` ; aucun sous-agent ; escalade de modèle : aucune ; recettes jouées : `revue-hebdo --self-test`, `hook-lexique` et sa recette, `hook-restitution.test`, `generer-lisezmoi-output.test`, `pre-commit-index.test`, `oracles/self-test.mjs`, `todo/self-test.mjs`, `self-tests.mjs`, recettes de `quality-oracles` et `digit-ai-page-html` ; oracles joués : `oracle-todo`, `oracle-regle-sans-juge`, `oracle-skills`, `oracle-synthese`.
- **intention** — ne plus être sollicité pour ce que la logique tranche, sans perdre la vue sur ce qui se fait. **Test rétro** : servie ; la règle est outillée et pas seulement écrite, et rejouée sur la revue du jour elle ne pose plus que la décision de doctrine sur 7.

## 2. Verdict en une ligne

**Règle en place et outillée (revue rejouée : 1 décision posée sur 7) ; 42a exécutée ; 6 décisions prises sans vous, 4 correctifs sous test rouge puis vert ; 9 candidatures closes, registre vert, 170 recettes du pilot sur 171 puis skills installés alignés.**

## 3. Décisions attendues de l'humain

1 décision vous revient, au motif publication. La décision sur l'étude d'auto-amélioration, posée à 15:44, est relue sous votre règle et n'attend plus de réponse ce soir : sa première étape ne relevait pas de vous, et sa suite vous sera posée le 15/10 avec les mesures de cette étape.

> **D-48 — Faut-il publier les enregistrements locaux du pilot `digit-ai-factory` et de la forge `digit-ai-forge-agents` ?**
>
> Le pilot porte 9 enregistrements non publiés, dont 4 de ce mandat et 5 d'autres sessions du jour ; la forge en porte 1, le mien. Tant qu'ils restent sur ce poste, l'autre poste ne voit ni votre règle, ni les 10 candidatures neuves, ni les 4 correctifs.
>
> **Recommandation : (a).** Source consultée : la règle de publication de `REGLES-PROJET.md`, qui réserve tout envoi hors du poste à votre feu vert, et `git rev-list --count origin/main..HEAD` relu à 19:06. Les recettes sont vertes et le registre aussi : rien n'attend une correction avant l'envoi.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Publier les 2 dépôts maintenant ; la session pousse, envoi vérifié par `git rev-list` | simple × court | aucune |
| **(b)** Publier le pilot seul | simple × court | les 2 correctifs de forge restent invisibles à l'autre poste, et le registre y cite une empreinte de forge absente |
| **(c)** Ne rien publier ce soir | nul | l'autre poste peut frapper les mêmes numéros de candidature et refaire le même travail |

> **Si rien n'est décidé** : (c) Ne rien publier ce soir.

## 4. Traité — avec sa preuve

Pour information, comme le veut votre règle : ce qui a été fait, et décidé sans vous quand rien ne vous le rendait.

- **Votre règle est écrite et outillée** : R-58 (seules les décisions qui vous reviennent vous sont posées) dans `REGLES-PROJET.md`, bloc 3 de `gabarits/RESTITUTION.md` en version 2.33.0, point 6 de la revue dans `references/TODO-FORGE.md`, rappel du juge de fin de tour, mémoire de session. La fiche de décision porte un champ `ressort`, et `todo/revue-hebdo.mjs` ne pose que les décisions qui vous reviennent.
  - preuve : `revue-hebdo --self-test` → PASS, et FAIL quand le tri est retiré ; la revue rejouée sur les 7 fiches pose 1 décision, motif doctrine, et en rend 6 pour information ; `oracle-regle-sans-juge` → PASS, 58 règles déclarées.
- **42a est exécutée** : une voie proposée se relit désormais contre le processus du commanditaire étape par étape et acteur par acteur, et une option qui ajoute une étape est exclue. La classe `processus-du-commanditaire-reattribue` est créée, et une consigne est injectée sur tout message humain qui décrit ou corrige un processus.
  - preuve : `hook-lexique --self-test` → 45 PASS, 0 FAIL : les 3 messages réels du produit sont reconnus, 3 phrases voisines épargnées ; `hook-lexique.test` 11/11 ; `hook-restitution.test` 39/39.
- **Décidé sans vous, l'audit npm sous Windows** : `oracle-sca` lance désormais npm audit au lieu de rendre SKIP.
  - preuve : sur un projet npm sans dépendance, SKIP « exit null » avant, PASS après ; cas neuf rouge sur l'ancien appel ; recette `quality-oracles` 419/419.
- **Décidé sans vous, le poseur de composants par jonction** : il pose quand on l'appelle par une jonction, et refuse une pose vide.
  - preuve : 0 bloc posé et exit 0 avant, 1 bloc posé après ; cas neuf rouge sur l'ancienne garde ; recette `digit-ai-page-html` 468/468.
- **Décidé sans vous, l'index des livrables depuis un arbre lié** : le relevé git ignore la variable que git exporte aux crochets.
  - preuve : cas neuf rouge (livrable perdu) puis vert ; `generer-lisezmoi-output.test` 3/3, `pre-commit-index.test` 2/2.
- **Décidé sans vous, la règle de secret R-23** : elle lit la constante partagée, et une clé à tirets internes ou un jeton `ghs_` n'y échappe plus.
  - preuve : 2 cas rouges puis verts ; `oracles/self-test.mjs` → 124 PASS, 0 FAIL.
- **Décidé sans vous, 2 clôtures sur preuve** : le guide de référence, publié depuis le 28/09, et la recherche dans la page, réparée le 23/09.
  - preuve : `80c126f` et `b010251` présents ; `todo/journaliser.mjs` → PASS avant et après.
- **Décidé sans vous, l'étape 1 de l'étude d'auto-amélioration** : elle figurait dans les 2 options qui engageaient quelque chose, sans dépense ni règle neuve ; inscrite et décidée, sa suite est inscrite en attente de vous.
  - preuve : `oracle-todo` → exit 0 ; le registre compte 11 décisions ouvertes, 553 clôtures, 186 candidatures.
- **Le registre est à jour** : votre règle y entre, 9 candidatures sont closes avec leur descente, 2 classes sont créées.
  - preuve : `oracle-todo` → exit 0 ; `todo/self-test.mjs` → 58 PASS, 0 FAIL.
- **Les recettes voisines restent vertes**, et la copie installée des skills est alignée.
  - preuve : `oracles/self-tests.mjs` → 170 sur 171, le seul écart étant la copie installée des 2 skills modifiés ; `oracle-skills --appliquer` puis `oracle-skills` → PASS.
- **Tout est enregistré en local**, par enregistrements ciblés.
  - preuve : `git log` → `43634c37` et `5ea8c422` au pilot, `2d752ea` à la forge.

## 5. Non traité — avec son motif

- L'exécution de l'étape 1 de l'étude d'auto-amélioration, 3 bancs à construire — motif : `borne_atteinte`, chantier moyen × court, ouvert au tour suivant.
- La suite de l'étude, des agents qui proposent des modifications de la consigne — motif : `decision`, elle touche à la doctrine et vous sera posée le 15/10.
- Un prénom réel cité dans la citation fondatrice du lot de retours g — motif : `hors_mandat`, un lot ingéré ne se réécrit plus, et le même prénom est déjà publié dans une fixture d'oracle.
- Les 47 autres retours qui portent une classe à créer — motif : `borne_atteinte`, ils passeront par la revue triée.

## 6. Écarts à la lettre

- **Vous avez écrit** « seules celles où je dois répondre me soient posées » → **j'ai fixé la liste des motifs qui vous rendent une décision : dépense, publication, irréversible, doctrine, arbitrage, produit** → **pourquoi** : une règle sans critère écrit se rejugerait à chaque tour ; cette liste reprend ce que la doctrine vous réserve déjà, et vous pouvez la changer.
- **Vous avez écrit** « je dois juste être informé » → **le bloc 4 sépare ce qui a été décidé sans vous, marqué comme tel** → **pourquoi** : vous pouvez revenir sur chaque décision sans relire le reste.

## 7. Risques

- Une décision qui vous revenait est prise sans vous ;
  - signal : vous revenez sur une décision marquée « sans vous » ;
  - parade : la liste des motifs est écrite dans la règle, la session la cite, et votre réponse prime toujours.
- La consigne du processus se déclenche sur des phrases qui ne décrivent pas un processus ;
  - signal : un rappel « processus » dans une session où aucun processus n'est en jeu ;
  - parade : la consigne n'impose rien, elle rappelle ; ses phrases voisines sont dans la recette.

## 8. Prochaines actions

Les actions sont triées, celle de l'IA d'abord ; la seconde suit votre réponse à D-48.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Construire les 3 bancs de l'étape 1, puis les rendre à la revue du 15/10 | `auto_ia` | TF-1551 | `borne_atteinte` — chantier moyen × court, au tour suivant | la suite de l'étude se décide sans mesure |
| **A-2** | Répondre à D-48 — par exemple « D-48 a » ; la session pousse ensuite | `manuelle_utilisateur` | neuve | `decision` — une publication vous revient | l'autre poste reste en retard de 10 enregistrements |

## 9. Traces

- Règle : `REGLES-PROJET.md` R-58 ; gabarit `gabarits/RESTITUTION.md` 2.33.0 ; mode opératoire `references/TODO-FORGE.md`.
- Outils : `todo/revue-hebdo.mjs`, `oracles/hook-lexique.mjs`, `oracles/hook-restitution.mjs`, `scripts/generer-lisezmoi-output.mjs`, `oracles/oracle-conformite-projet.mjs`.
- Forge : `digit-ai-forge-agents`, `.claude/skills/quality-oracles/scripts/oracle-sca.mjs` et `.claude/skills/digit-ai-page-html/scripts/embarquer-composants.mjs`, enregistrement `2d752ea`.
- Registre : `todo/TODO.jsonl`, TF-1550 à TF-1552 et 9 clôtures ; `todo/CLASSES.json` 1.28.0.
- Journal : `BOUCLE-AMELIORATION.md`, entrée du 01/10/2026 au soir.
- Commits locaux `43634c37` et `5ea8c422` au pilot, `2d752ea` à la forge ; rien n'est poussé.
