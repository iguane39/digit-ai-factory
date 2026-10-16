---
destinataire: humain
---

# Synthèse Mandat — ouverture de session VS Code : correctif repris, propagé aux 19 produits et borné par recette (13/10/2026)

## 0. Synthèse d'ouverture

Les sessions de la factory ne pourront plus être coupées à l'ouverture par l'extension VS Code, au pilot comme chez les produits. Le 12/10, le hook d'ouverture synchrone dépassait les 60 s que l'extension accorde ; le pilot a été corrigé le 13/10 à 16:35, mais les 19 produits portaient encore l'ancienne forme. Désormais, chaque produit répare son propre réglage dès sa prochaine ouverture, le contrat d'héritage exige la forme corrigée, et une recette refuse tout hook d'ouverture synchrone de plus de 45 s. Cette session-ci prouve le correctif dans le client : elle s'est ouverte dans VS Code et a reçu le relevé complet. Le correctif du pilot a été publié à 17:01 par une autre session de ce poste ; il reste votre accord pour publier le commit de ce tour.

## 1. En-tête d'identification

- **quoi** — votre demande : reprendre l'incident d'ouverture de session dans VS Code et ses corrections, puis l'anticiper pour ce projet et pour tous les projets qui utilisent la Factory.
- **sur quoi** — pilot `digit-ai-factory`, commit local `643d2f7b`, non publié ; 19 produits du parc relevés en lecture seule.
- **quand** — 2026-10-13, de 16:39 à 17:12 UTC+02:00 (Europe/Paris) ; ouverture relevée au transcript, heure de consignation par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `oracles/hook-ouverture.test.mjs`, `scripts/relever-heritage.test.mjs`, `scripts/recopier-heritage.test.mjs`, `oracles/hook-publication-hebergee.test.mjs`, `oracles/oracle-conformite-projet.mjs`, `oracles/self-tests.mjs`, `todo/journaliser.mjs`.
- **intention** — qu'aucune session de la factory, où qu'elle s'ouvre, ne soit plus perdue au démarrage par un hook trop long. **Test rétro** : servie ; le pilot est prouvé dans le client par cette session, et les produits sont réparés par un mécanisme éprouvé en recette, qui joue à leur prochaine ouverture.

## 2. Verdict en une ligne

**TENU — réparation des produits à l'ouverture et borne de 45 s livrées, recette hook-ouverture 17 PASS 0 FAIL avec sens rouge joué, R-47 nomme le motif manquant sur un vrai produit, self-tests sans défaut causé par ce tour.**

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient la suite, ce qui le lève, et ce qui se passe sinon :

- la publication du commit `643d2f7b` : votre décision D-2 ; sans elle, les produits ouverts depuis un autre poste ne se réparent pas.

> **D-2 — Publiez-vous le commit `643d2f7b` du pilot `digit-ai-factory`, qui fait réparer leur ouverture aux produits ?**
>
> Rappel du sujet : posée à 16:12 pour les commits du correctif, elle est levée pour eux, publiés à 17:01 par une autre session de ce poste (`git fetch` : origine à `b6e66279`). Elle porte désormais sur le seul commit de ce tour. Un push demande votre feu vert cité.
>
> **Recommandation : (a).** Source consultée : la recette et les self-tests de ce tour ; et cette session, ouverte dans VS Code avec le relevé reçu en entier.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant, avec votre feu vert cité | complexité faible · durée courte | aucune |
| (b) ne pas publier pour l'instant | aucun | les produits ouverts depuis un autre poste gardent l'ouverture synchrone |

> **Si rien n'est décidé** : (b) par défaut — les commits restent sur ce poste.

## 4. Traité — avec sa preuve

Ce tour a mesuré l'exposition du parc, puis livré trois parades et leur recette.

- **Exposition mesurée** : 19 produits sur 19 déclaraient le hook d'ouverture synchrone à 240 s, ainsi qu'un clone du pilot daté du 27/08 sous un produit ; aucun hook d'ouverture dans les réglages des 2 profils du poste.
  - preuve : lecture JSON des `SessionStart` de tous les `.claude/settings.json` du parc, sortie « SYNC t=240 node forge/hooks/factory.mjs ouverture --sans-readme » 19 fois.
- **Réparation par le produit lui-même** : `oracles/lib-ouverture-async.mjs`, appelé en premier geste par `oracles/hook-ouverture.mjs` chez un produit, passe la seule entrée d'ouverture en `async` avec `--contexte-json`. Lancé encore en synchrone, le hook rend aussitôt la main avec les règles de session.
  - preuve : recette, cas « TF-1635 — le hook lancé en synchrone chez un produit… » PASS ; permissions, autre hook, fins de ligne CRLF et indentation gardés. Sur une copie du réglage d'un vrai produit, `diff` ne montre que les 2 lignes du hook.
  - sens rouge : réparation retirée du hook, la recette rend 16 PASS et 1 FAIL ; fichier restauré.
- **Contrat d'héritage 1.19.0** : le réglage d'un produit doit porter `factory.mjs ouverture --sans-readme --contexte-json`, et R-47 (la règle de conformité qui juge l'héritage chez un produit) comme le relevé d'héritage acceptent une liste de motifs.
  - preuve : `oracle-conformite-projet.mjs` sur un vrai produit rend « ne porte pas « forge/hooks/factory.mjs publication-hebergee » ni « factory.mjs ouverture --sans-readme --contexte-json » » ; `relever-heritage.test.mjs` 38 PASS, dont le cas neuf.
- **Borne de 45 s** : le seul hook d'ouverture synchrone du pilot, `hook-produits-intacts.mjs --empreinte`, passe de 120 à 45 s de délai ; la recette refuse tout hook synchrone au-delà, au pilot comme dans le gabarit produit.
  - preuve : cas « TF-1635 — tout hook SessionStart synchrone… borné à 45 s » PASS ; son sens rouge, un hook à 120 s, est refusé.
- **Constat dans le client** : cette session s'est ouverte dans VS Code à 16:39 et a reçu le relevé en contexte, section des gates R-44 comprise, au deuxième tour.
  - preuve : horodatage du transcript, 2026-10-13T14:39:51Z ; contexte reçu avec l'en-tête « hook SessionStart asynchrone ».
- **Non-régression** : `recopier-heritage.test.mjs` 20 PASS, `hook-publication-hebergee.test.mjs` 10 PASS, cliquet des recettes relevé de 14 à 17, de 37 à 38 et de 152 à 154 cas. Self-tests : 5 oracles en défaut sur 207 au premier passage ; 2 venaient de ce tour, des fixtures de R-47 qui portaient l'ancien réglage, corrigées et rejouées ; les 3 autres sont antérieurs et sans lien.
  - preuve : `node oracles/self-tests.mjs`, « 5/207 oracle(s) en défaut » ; puis `node oracles/self-test.mjs` 154 PASS 0 FAIL, avec un cas rouge neuf (hook synchrone refusé par R-47), et `node todo/ingerer-r47.test.mjs` 10 PASS 0 FAIL.
  - les 3 défauts antérieurs : `oracle-skills.mjs` attend une décision humaine connue (TF-0391) ; `oracle-empreintes.mjs` vise `scripts/installer-projet.test.mjs`, que ce tour ne touche pas ; `scripts/readme-dossiers.test.mjs` rend 28 PASS 0 FAIL rejoué seul.
- **Registre et mémoire** : 2 notes sur TF-1635 et TF-1636, et une mémoire du poste qui garde la règle des 45 s.
  - preuve : `journaliser.mjs` → « 2 événement(s) journalisé(s) ».

## 5. Non traité — avec son motif

- La publication des commits — motif : `dependance_bloc_3`, votre accord (D-2).
- La correction de fond de TF-1635 : partie bloquante disponible avant le premier geste, geste fait avant le tirage déclaré — motif : `decision`, le registre la laisse à arbitrer au pilot.
- Les blocages relevés à l'ouverture sans lien avec cet incident : 3 lots en attente depuis plus de 24 h, 14 lots au sas, défaut K3 du canal confidentiel — motif : `hors_mandat`, à traiter dans une session dédiée.
- La recopie directe des réglages chez les produits par cette session — motif : `hors_mandat`, aucun mandat d'écriture déclaré chez eux ; chaque produit se répare lui-même à son ouverture.

## 6. Écarts à la lettre

- **Vous demandiez** que le problème soit anticipé chez tous les projets → **la réparation joue à leur prochaine ouverture, pas aujourd'hui** → **pourquoi** : un réglage de produit ne s'écrit que par le produit, et cette session n'a aucun mandat chez eux.

## 7. Risques

- Un produit qui s'ouvre en synchrone pour la dernière fois rend la main sans relevé de fraîcheur.
  - signal : la section « Ouverture de session (TF-1635) » en tête du contexte ;
  - parade : le relevé complet arrive à l'ouverture suivante, et la section le dit.
- Le réglage modifié chez un produit reste à enregistrer dans son dépôt.
  - signal : `.claude/settings.json` modifié au `git status` du produit ;
  - parade : la section d'ouverture demande de l'enregistrer avec le travail du produit.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier le commit `643d2f7b` avec votre feu vert cité | `auto_ia` | TF-1635 | `dependance_bloc_3` — D-2 | les produits ouverts ailleurs gardent l'ouverture synchrone |
| **A-2** | Répondre à D-2 | `manuelle_utilisateur` | TF-1635 | `decision` | les commits restent sur ce poste |

## 9. Traces

`oracles/lib-ouverture-async.mjs`, `oracles/hook-ouverture.mjs`, `oracles/hook-ouverture.test.mjs`, `oracles/oracle-conformite-projet.mjs`, `oracles/self-test.mjs`, `todo/ingerer-r47.test.mjs`, `scripts/relever-heritage.mjs`, `scripts/relever-heritage.test.mjs`, `gabarits/HERITAGE.json`, `.claude/settings.json`, `oracles/baseline-recettes.json`, `todo/TODO.jsonl` (TF-1635, TF-1636), commit `643d2f7b`.
