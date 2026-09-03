---
destinataire: humain
---

# Synthèse de mandat — surveillance des récidives entre les runs (03/09/2026, après votre décision D-2 en option a)

Vous avez décidé que le compteur des récidives soit relu par un mécanisme et non par une lecture humaine. C'est câblé : un plan de surveillance vit chez le pilot, il rejoue le tableau de bord et compare six compteurs au relevé précédent, l'ouverture du pilot le joue chaque semaine, et le premier passage réel a été exercé aujourd'hui avec un verdict de dérive rendu. La candidature qui le demandait est close avec sa descente. Ce qui change pour vous : une récidive, une classe ou un produit non équipé de plus apparaîtra en rouge dans le relevé d'ouverture, sans que rien ne soit appliqué à votre place. Rien n'attend de décision ce tour ; deux gestes restent les vôtres, inchangés depuis ce matin.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-2 (a) : plan de surveillance forge-observability chez le pilot, lanceur, cadence tenue par l'ouverture, premier passage exercé, clôture de la candidature.
- **sur quoi** — le pilot `digit-ai-factory` seul ; forge-observability consommée en lecture, rien n'y est écrit.
- **quand** — fin le **03/09/2026 à 14:40 (UTC+02:00)**, durée **≈ 25 minutes** depuis la décision.
- **qui** — session pilot Claude Fable 5.1, dépôt à `6e9a514` plus l'arbre de travail décrit au bloc 9.

## 2. Verdict en une ligne

TF-0790 décidé, mis en œuvre et clos avec descente : plan à deux sondes, lanceur prouvé rouge et vert (recette 4/4), premier passage réel rendu « données insuffisantes » puis « PASS, aucune dérive » au second relevé, cadence hebdomadaire tenue par le hook d'ouverture, oracle du registre PASS — recette entière du pilot : exit 0, 91 oracles et recettes joués (90 + la recette du lanceur), 0 en défaut, cliquet tenu.

## 3. Décisions attendues

Rien n'attend de décision ce tour : la décision D-2 est exécutée, et les deux gestes humains encore ouverts sont des actions déjà posées ce matin (bloc 8).

## 4. Traité — avec sa preuve

- **La candidature est décidée, mise en cours, puis close, par l'écrivain unique du registre.**
  - preuve : trois événements journalisés par `todo/journaliser.mjs` sur TF-0790 — `decide` (décideur : humain, D-2 option a, 03/09), `en_cours`, puis `corrige` avec `descente` (règle : section « Revue des classes » de `BOUCLE-AMELIORATION.md` et fiche de la forge ; oracle : la recette du lanceur et `derive.mjs` joué par l'ouverture) ; `oracle-todo` avant et après chaque écriture : PASS → PASS ; règle R12 satisfaite.
- **Le tableau de bord expose ses compteurs à une sonde.**
  - preuve : `todo/generer-recidives.mjs --json todo/observabilite/RECIDIVES.json` écrit et affiche douze compteurs (items, items classés, récidives, classes, familles, classes sans fondateur, retours à classe suspecte, relevés, produits relevés, produits non équipés, manques d'héritage) — sortie exécutée : `recidives 0, classes 30, produits_non_equipes 5, manques_heritage 76` ; la vue Markdown est générée dans le même passage.
- **Le plan de surveillance est écrit au format de la forge, avec ses seuils.**
  - preuve : `todo/observabilite/plan-recidives.json`, format `forge-observability/plan@1`, deux sondes — `commande` (régénère le tableau de bord, capture le compteur de récidives, `max_delta 0`) et `rapport_json` (six compteurs, `max_delta 0` sur récidives, classes, produits non équipés, retours à classe suspecte) ; accepté par `observer.mjs` (un plan mal formé est refusé par la forge, rien n'est appendu).
- **Le lanceur joue la forge depuis le pilot sans rien y écrire, et il est prouvé par le geste.**
  - preuve : `todo/observer-recidives.mjs` (forge résolue comme le lanceur des hooks ; observer puis derive ; verdict et seq lus dans le ledger) ; recette `todo/observer-recidives.test.mjs` : **4 PASS, 0 FAIL** — un seul relevé rend « données insuffisantes » (exit 2) et jamais un vert, deux relevés identiques rendent PASS, une récidive de plus rend FAIL en nommant la sonde, une forge absente rend SANS_OBJET.
- **Le premier passage réel est exercé — N-1 (règle de non-répétition : un travail planifié s'exerce avant d'être déclaré en place) — deux fois pour obtenir un verdict.**
  - preuve : ledger `todo/observabilite/snapshots-recidives.jsonl` — snapshot 1 (sondes `ok:true`, valeurs `recidives 0, classes 30, produits_non_equipes 5`), verdict `donnees_insuffisantes` ; snapshot 2, verdict `derive` **PASS** : « aucune dérive entre les deux snapshots comparés » ; un troisième passage à la demande : PASS, seq 3.
- **La cadence hebdomadaire est tenue par l'ouverture du pilot, jamais bloquante.**
  - preuve : `oracles/hook-ouverture.mjs` — section « Surveillance des récidives » ; rejoué avec `--sans-bootstrap`, il rend « dernier relevé du 2026-09-03T12:32:30Z (0.0 j) — prochain passage dans 7.0 j ; à la demande : node todo/observer-recidives.mjs » ; au-delà de sept jours il joue le lanceur et rend le verdict en une ligne (PASS, premier relevé, ou DÉRIVE avec ses constats).
- **La forge et la boucle portent la trace du premier plan réel.**
  - preuve : `fiches/forge-observability.md`, section « Premier plan réel — surveillance des récidives du pilot » (la fiche disait « premier plan réel à consigner ici ») ; `BOUCLE-AMELIORATION.md`, § Revue des classes : « décidée le 03/09 (D-2, option a) et câblée le jour même ».
- **Les vues du registre sont régénérées et le registre reste intègre.**
  - preuve : `generer-vue.mjs`, `generer-page.mjs`, `generer-recidives.mjs` rejoués (9 actifs, 30 classes, 2 relevés d'héritage) ; `oracle-todo` sur le vrai registre : **PASS**.
- **Recette entière du pilot rejouée.**
  - preuve : `oracles/self-tests.mjs` — exit 0, 91 oracles et recettes joués (90 + la recette du lanceur), 0 en défaut, cliquet tenu.

## 5. Non traité — avec son motif

- **La pose du lanceur chez les cinq produits sans hooks** : *garde-fou nommé* — N-5 (règle de non-répétition : le pilot n'écrit pas chez un produit) ; inchangé depuis ce matin, action A-7.
- **Le GO de publication** : *gate de gouvernance* — R-38 (règle de projet : aucun push sans GO humain) ; action A-8.
- **Un relais du FAIL vers un canal humain (mail, messagerie)** : *hors mandat* — la forge le déclare hors périmètre v0 ; le relevé d'ouverture est le canal, et il est lu à chaque session.
- **Un seuil sur `manques_heritage`** : *écarté pour ce tour* — ce compteur bouge légitimement à chaque montée de version du contrat d'héritage (72 → 81 ce matin quand un artefact a été ajouté) ; le surveiller à `max_delta 0` crierait à chaque évolution voulue. Il est capturé, pas seuillé. Critère de réouverture : un mois de contrat stable.
- **L'exercice de la branche « DÉRIVE » du hook d'ouverture sur le parc réel** : *borne atteinte* — elle est prouvée sur fixture (cas rouge de la recette du lanceur) ; la provoquer sur le vrai registre demanderait d'y écrire une récidive fictive, ce qui polluerait un registre suivi par git.

## 6. Écarts à la lettre

| Vous avez décidé (D-2, option a) | Ce qui est fait | Pourquoi |
|---|---|---|
| « laisser le pilot écrire le plan de sonde chez lui, premier passage exercé à la main » | Plan chez le pilot, premier passage exercé, **et** la cadence hebdomadaire câblée dans le hook d'ouverture | Un plan dont la cadence est documentaire redevient une intention (N-1) ; le câblage n'ajoute aucune action automatique, seulement une lecture |
| la candidature proposait une dérive « sur ces trois compteurs » (récidive, classe, produit non protégé) | Quatre compteurs seuillés (les trois, plus les retours à classe suspecte), six capturés | La contre-métrique du tableau de bord se surveille avec le compteur, sinon une clé neuve fait baisser le compteur sans dérive |

## 7. Risques

- **Un compteur qui ne bouge jamais ne prouve pas l'absence de récidive : il peut prouver l'absence de lots classés.**
  - signal : `recidives` reste à 0 pendant que `items_classes` reste à 0 dans les snapshots.
  - parade : la revue des classes lit `items_classes` ; un registre sans lot classé après une quinzaine est une candidature de relance des producteurs, pas un succès.
- **Le hook d'ouverture ajoute un passage de surveillance à une ouverture déjà longue.**
  - signal : ouverture du pilot au-delà des trois minutes de délai du hook.
  - parade : le passage ne se joue qu'une fois par semaine, sous un délai propre de trois minutes, et rend « passage NON rendu » sans bloquer.
- **Renommer une sonde du plan se lit comme une disparition (limite v0 de la forge).**
  - signal : un FAIL « disparition » après une édition du plan.
  - parade : le plan porte son rôle en tête ; renommer une sonde se fait avec un snapshot de transition, et le FAIL se lit avant d'être corrigé, jamais effacé.

## 8. Prochaines actions

Ordre de traitement : les deux gestes humains de ce matin restent ouverts et gardent leur ordre ; aucune action d'agent n'est en attente.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-7 | `neuve` (reprise de la synthèse 20260903b, même geste) | Poser le lanceur de hooks et la configuration produit chez les cinq produits qui n'en ont aucun, nommés au relevé d'ouverture avec leurs familles non protégées. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (N-5, votre mandat du 23/08). Trace mesurée : compteur `produits_non_equipes` = 5 dans le snapshot 1 du 03/09. | Ces cinq produits ne reçoivent ni les classes, ni le hook du lexique, ni aucune descente ; la sonde continuera de compter 5. |
| A-8 | `neuve` (reprise de la synthèse 20260903b, même geste) | Donner le GO de publication du pilot (treize commits locaux en avance après celui-ci). | `manuelle_utilisateur` | `decision` — R-38, aucun push sans GO humain. Trace mesurée : `git fetch` a expiré ce matin, la collision distante n'est pas vérifiée. | Les règles neuves et la surveillance ne vivent que sur ce poste. |

## 9. Traces

- Registre : TF-0790 `decide` → `en_cours` → `corrige` avec descente, par `todo\journaliser.mjs` (PASS → PASS à chaque écriture) ; `todo\oracle-todo.mjs` PASS.
- Compteurs : `todo\generer-recidives.mjs --json` → `todo\observabilite\RECIDIVES.json`.
- Plan : `todo\observabilite\plan-recidives.json` (`forge-observability/plan@1`, deux sondes) ; ledger `todo\observabilite\snapshots-recidives.jsonl` (3 snapshots, seq 1 à 3).
- Lanceur : `todo\observer-recidives.mjs` ; recette `todo\observer-recidives.test.mjs` 4/4.
- Cadence : `oracles\hook-ouverture.mjs` § « Surveillance des récidives » — rejoué, ligne rendue.
- Documents : `fiches\forge-observability.md` § « Premier plan réel » ; `BOUCLE-AMELIORATION.md` § Revue des classes.
- Vues régénérées : `todo\TODO.md`, la vue de consultation, `todo\RECIDIVES.md` (2 relevés d'héritage).
- Recette entière : `oracles\self-tests.mjs` — exit 0, 91 oracles et recettes joués (90 + la recette du lanceur), 0 en défaut, cliquet tenu.
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Surveillance des recidives TF-0790 - 20260903c.md` — jugée par `oracle-synthese` avant affichage.
- Commit local : commit de clôture du 03/09 sur `main`, chemins de ce tour seulement — aucun push.
