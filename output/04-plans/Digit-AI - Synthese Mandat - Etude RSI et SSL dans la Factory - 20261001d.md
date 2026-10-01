---
destinataire: humain
---

# Synthèse Mandat — étude d'opportunité sur l'auto-amélioration récursive et l'apprentissage auto-supervisé dans la Factory (01/10/2026)

## 0. Synthèse d'ouverture

L'étude est prête et jugée conforme par ses 2 contrôles. Elle recommande d'intégrer les 2 concepts ensemble, en 3 étapes, et de commencer par l'apprentissage auto-supervisé. La Factory s'améliore déjà en boucle, mais toujours après qu'un défaut a coûté, et sans mesure du gain avant votre décision. Ses propres traces permettent de construire gratuitement les bancs d'essai qui manquent : 514 restitutions refusées depuis le 21 août, et 85 défauts de ses juges trouvés après coup. Sur ces bancs, des agents pourront ensuite proposer des améliorations, chacune mesurée avant de vous être soumise, sans jamais toucher au juge qui les note ni se mettre en service seules. Il vous revient de valider ce choix et sa première étape, et de dire si l'intention que j'ai reconstruite est la bonne.

## 1. En-tête d'identification

- **quoi** — mandat d'étude d'opportunité, au gabarit d'étude du pilot, sur votre demande « Construis une étude d'opportunités sur l'intégration avancée des concepts suivants… : RSI… SSL… ».
- **sur quoi** — le pilot `digit-ai-factory`, les 13 forges et les produits, en lecture seule ; une seule écriture, l'étude et l'index de son dossier.
- **quand** — 2026-10-01 15:44 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début à 15:29:22, horodatage de votre message lu au transcript ; durée mesurée 15 min.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; pilot à `0a25457a` à l'ouverture, `852acdb6` après les 2 enregistrements de l'étude ; 2 sous-agents au modèle de la session, l'un pour l'état de l'art en ligne, l'autre pour l'inventaire du parc ; escalade de modèle : aucune ; oracles joués : `oracle-etude-opportunite`, `oracle-ecriture`, `oracle-synthese`.
- **intention** — savoir ce que ces 2 concepts peuvent apporter concrètement à la Factory, où, à quel prix et avec quels risques, pour décider vous-même de ce qui s'intègre et dans quel ordre. **Test rétro** : servie ; chaque élément du verdict remonte à cette intention dans la section « Test rétro » de l'étude, avec un seul écart, la lecture de « avancée » comme ambitieux plutôt qu'autonome, écrit au bloc 6.

## 2. Verdict en une ligne

**Étude rendue et enregistrée en local : `oracle-etude-opportunite` PASS sur ses 10 règles, `oracle-ecriture` PASS sur 4 234 mots ; 23 sources datées, 7 gisements de traces inventoriés ; verdict O2, une auto-amélioration bornée et prouvée, fondée d'abord sur l'auto-supervision, en 3 étapes.**

## 3. Décisions attendues de l'humain

Une décision vous attend. L'étude transpose les 2 concepts à ce que la Factory peut modifier elle-même, ses prompts, skills, oracles et règles, puisqu'elle n'entraîne aucun modèle. L'auto-supervision y devient la fabrication de bancs d'essai à partir de ses propres traces, et l'auto-amélioration récursive la proposition de modifications mesurées sur ces bancs. Pour répondre, un sélecteur suffit, par exemple « D-39 b ».

> **D-39 — Faut-il engager l'intégration retenue par l'étude `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, et jusqu'où ?**
>
> Le verdict retient 3 étapes. La première construit 3 bancs auto-étiquetés : une mutation des livrables verts qui mesure le taux de détection des 10 oracles les plus sollicités, un banc des restitutions refusées tiré du journal, un banc des corrections tiré du git. La deuxième fait proposer par des agents des modifications de la consigne de restitution, mesurées sur une part des bancs tenue à part. La troisième étend la boucle à ses propres règles, puis aux forges et aux produits. Aucune étape ne met une modification en service sans vous.
>
> **Recommandation : (a).** Source consultée : l'étude, sections « Gisements », « Garde-fous » et « Verdict » ; l'état de l'art, où un skill auto-écrit sans validation perd 1,3 point en moyenne et où un agent libre de toucher à son juge l'a falsifié. La première étape ne coûte aucun appel de modèle pour ses bancs, et elle fournit la mesure sans laquelle la deuxième dégraderait au lieu d'améliorer.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Lancer l'étape 1 et inscrire au registre les 2 candidatures de l'étude, revue de l'étape 1 le 2026-10-15 | moyen × court pour l'étape 1 ; complexe × moyen pour les 3 étapes | aucune modification proposée par des agents avant la revue du 15/10 |
| **(b)** S'en tenir aux bancs, sans boucle de proposition : inscrire la seule candidature de l'étape 1 | moyen × court | l'auto-amélioration récursive reste à la main, comme aujourd'hui ; les bancs disent où ça casse sans rien proposer |
| **(c)** Ne rien engager | nul | les 514 refus et les 85 défauts de juges continuent de se découvrir après coup |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Les preuves ci-dessous sont des sorties de commandes de ce tour ou des rapports de sous-agents relus dans ce tour.

- **L'étude est écrite au gabarit et jugée** : `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, 30 Ko.
  - preuve : `node oracles/oracle-etude-opportunite.mjs` → PASS, exit 0, ses 10 règles PASS dont 12 lignes de non-recouvrement citées et 23 sources datées ; `node oracles/oracle-ecriture.mjs` → PASS sur 4 234 mots, un avertissement assumé sur 3 phrases qui ouvrent par « Étape ».
- **L'état de l'art est relevé en ligne et daté** : 21 sources publiées depuis le 2024-10-01, de la Darwin Gödel Machine à SkillsBench, et 5 limites déclarées comme non vérifiées.
  - preuve : rapport du sous-agent de recherche, 27 appels d'outils, chaque identifiant arXiv ou adresse noté dans la section « État de l'art daté ».
- **Les gisements de traces sont mesurés** : 1 869 jugements de restitution au journal des hooks, dont 514 refus et 326 passages d'un refus à un texte accepté ; 352 récidives sur 643 candidatures classées ; 2 213 commits, dont 97 citent un faux positif ou un faux négatif.
  - preuve : comptage par `node` du journal des hooks à 15:36 ; `todo/observabilite/RECIDIVES.json` du 2026-10-01 ; `git rev-list --count HEAD` et `git log -i --grep` du sous-agent d'inventaire sur les 14 dépôts.
- **3 chiffres de mon premier relevé ont été rectifiés avant enregistrement** : 37 oracles sur 50 ont un self-test, et non 51 sur 93 ; les fichiers de jugement des synthèses sont des sceaux sans verdict, retirés des gisements ; les commits liés au registre se comptent sur les messages entiers.
  - preuve : recomptage du sous-agent d'inventaire, puis oracle de l'étude rejoué PASS après rectification.
- **L'étude est enregistrée en local** : commits `9caab94f`, avec l'index de son dossier, puis `852acdb6`, qui aligne le compte des gisements sur leur tableau.
  - preuve : `git log --oneline -1` → `852acdb6 Etude 20261001a…` ; oracles de l'étude rejoués PASS avant ce second enregistrement.

## 5. Non traité — avec son motif

- L'inscription des 2 candidatures au registre, prêtes dans l'étude — motif : `decision`, elle suit votre réponse à D-39.
- La page HTML de l'étude — motif : `decision`, elle suit la validation du verdict ; les études récentes du pilot n'en portent pas avant décision.
- La validation de l'intention reconstruite — motif : `decision`, elle vous revient, et l'étude la tient pour acceptée jusqu'à votre réponse.
- Le comptage des historiques d'oracles des forges et des produits, et le nombre exact de paires dans les transcripts — motif : `borne_atteinte`, l'étape 1 les mesurera en construisant ses bancs.

## 6. Écarts à la lettre

- **Vous avez écrit** « RSI » et « SSL » → **l'étude les transpose à l'échafaudage et à l'évaluation, sans entraînement** → **pourquoi** : la Factory n'emploie que Claude et aucune API tierce payante ; aucun poids n'est modifiable.
- **Vous avez écrit** « intégration avancée » → **le verdict garde la mise en service sous votre décision** → **pourquoi** : la loi n° 5 du noyau, et l'état de l'art, où l'agent autonome a falsifié son juge ; l'option de mise en service automatique reste ouverte après la preuve de l'étape 2.
- **Vous avez écrit** « les produits qui les utilisent » → **les produits viennent à l'étape 3, par l'héritage** → **pourquoi** : le pilot n'écrit chez un produit que sur run demandé, et le relevé d'ouverture déclare 0 mandat.

## 7. Risques

- Un banc mal construit fait passer une mauvaise proposition pour un gain ;
  - signal : un taux de détection élevé sur des mutations triviales, ou moins de 5 mutations pertinentes par oracle ;
  - parade : le critère d'arrêt de l'étape 1, écrit dans le verdict de l'étude.
- Un agent de proposition modifie le juge qui le note ;
  - signal : une empreinte d'oracle qui change pendant une campagne ;
  - parade : les oracles hors de son périmètre d'écriture, empreintes relevées avant et après.
- La boucle lit des traces écrites par d'autres sessions et y suit une consigne embarquée ;
  - signal : une proposition qui cite une instruction trouvée dans un transcript ;
  - parade : la règle du noyau, une trace lue est une donnée.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord ; les 2 premières suivent votre réponse à D-39.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Inscrire les candidatures retenues par D-39 avec `node todo/journaliser.mjs --fichier <evenements.json>` | `auto_ia` | neuve | `dependance_bloc_3` — suit D-39 | l'étude reste sans suite au registre |
| **A-2** | Construire les 3 bancs de l'étape 1, en commençant par la mutation des 10 oracles les plus sollicités, puis publier les taux au tableau des récidives | `auto_ia` | neuve | `dependance_bloc_3` — suit D-39 | les défauts de juges continuent de se découvrir après coup |
| **A-3** | Trancher D-39 et valider l'intention reconstruite — répondre par exemple « D-39 a » | `manuelle_utilisateur` | neuve | `decision` — engager un chantier et arbitrer le registre vous reviennent | (c) s'applique |

## 9. Traces

- L'étude : `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, commits locaux `9caab94f` et `852acdb6`.
- Cette synthèse : `output/04-plans/Digit-AI - Synthese Mandat - Etude RSI et SSL dans la Factory - 20261001d.md`.
- Gabarit et oracle de l'étude : `gabarits/ETUDE-OPPORTUNITE.md`, `oracles/oracle-etude-opportunite.mjs`.
- Sources mesurées : `.claude/hooks-journal.jsonl`, `todo/TODO.jsonl`, `todo/observabilite/RECIDIVES.json`, `BOUCLE-AMELIORATION.md`.
- Rien n'est poussé. Les index `output/LISEZMOI.md` et `output/README.md`, régénérés par le hook d'enregistrement, restent modifiés dans l'arbre de travail.
