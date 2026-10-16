# Retours forges — Produit-02 — 20261003a

- **Contexte** : statut Google Ads et Google Analytics du 03/10/2026, construit selon ISTO, hors run. Le lot porte le retour humain du même jour sur la publication d'un livrable en artifact. Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 376 (type `retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-10-03
- **Complétude** : 1 entrée `type: retour` destinée à la factory ne figurait dans aucun lot remis, la seq 376, écrite le 03/10. Elle est portée ici et a sa candidature au sidecar. Les entrées antérieures ont été remises par les lots 20261001a et 20261001b.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — garde de publication

Un retour, qui suit un retour humain. La règle existe au pilot (R-38) ; c'est son chemin jusqu'à la session produit et jusqu'à l'outil qui publie qui manque.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-117 | bloquant | générique | **Un livrable de produit a été proposé en artifact « recommandé », puis publié sur claude.ai, alors que R-38 interdit toute publication hébergée sans GO humain préalable et consigné.** Le 03/10, à la question de livraison du statut Google Ads et Google Analytics, la session propose « Fichier + Artifact privé (Recommended) ». L'exploitant le coche, et le rapport est publié en artifact privé à 12 h 44. Retour humain du même jour, mot pour mot : « J'ai demandé à ne jamais créer d'artefact dans Claude Code, pourquoi c'est encore proposé ? ». Trois causes mesurées. (1) Le `CLAUDE.md` du produit renvoie au socle `REGLES-PROJET.md` du pilot sans écrire R-38, et aucune mémoire du produit ne la cite : la règle n'entre pas dans le contexte d'une session produit. (2) Le seul crochet `PreToolUse` branché sur l'outil Artifact (`settings.json` utilisateur, motif `present_files\|mcp__.*__upload\|Artifact`, vers `qo-gate.mjs`) juge la QUALITÉ du fichier, pas le droit de publier : il a refusé un fragment HTML, puis laissé passer le document complet. (3) Les instructions de l'outil Artifact du harness incitent à publier sans demande et à proposer la publication ; faute de règle chargée, elles priment. Une case cochée dans une question que l'agent a rédigée et recommandée n'est pas le GO préalable et consigné que R-38 exige. Ledger seq 376 (type retour). | (a) Un crochet `PreToolUse` sur l'outil Artifact, actions `publish` et `pin`, qui REFUSE sauf GO consigné au ledger (entrée `reponse_humain` citant R-38), à côté de `qo-gate.mjs`. (b) R-38 écrite en clair dans le gabarit `CLAUDE.md` produit (« Conventions locales ») et dans le `CLAUDE.md` utilisateur. (c) Interdire aussi de PROPOSER une publication hébergée comme option d'une question, pas seulement de publier. Fixture rouge : un appel `Artifact` `publish` sans GO consigné doit être refusé. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui, ce qu'il en a corrigé, et si le défaut se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'artifact publié le 03/10 reste en ligne, privé. | Non corrigée : son retrait attend la décision de l'exploitant, parce qu'une suppression est irréversible (R-38 point 2 : le retrait se consigne). | oui | Généralisable : remonté en RT-117. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — vérifié par la session le 03/10/2026 : le statut HTML du 03/10 est bâti sur le gabarit `boilerplate.html` du skill digit-ai-page-html, pas sur un gabarit `gd-…` de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : le statut du 03/10 est la première version HTML de cette série, les précédentes étant en Markdown.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucune contrainte de plateforme n'a refusé ni contraint un déploiement pendant ce statut, qui n'a rien déployé.

## Confirmations positives

- **La barrière qualité `qo-gate-write.mjs`** a refusé la première version du statut sur 9 oracles en échec, et la version déposée passe 16 oracles sans échec : la porte a forcé un livrable conforme.

## Ordre recommandé

1. **RT-117** : seul retour du lot, bloquant ; la proposition (a) se pose sans toucher au harness.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-117 suit un RETOUR HUMAIN. La règle existe, R-38 (`REGLES-PROJET.md`, 17/08, TF-0302), mais aucune garde ne l'applique au moment de l'appel de l'outil, et le texte n'atteint pas le contexte d'une session produit. **Classe à créer**, clé proposée `regle-de-publication-sans-garde-sur-l-outil`, famille `hook-ou-gate`. Libellé : « Une règle interdit un canal de sortie (publication hébergée) sans GO consigné, mais le seul crochet branché sur l'outil de ce canal juge la qualité du fichier, et la règle n'est pas chargée dans les sessions produit : l'agent propose puis emploie le canal, et la garde laisse passer. »
