---
destinataire: humain
---

# Synthèse Mandat — vos décisions D-61 (a), D-62 (a) et D-63 sont exécutées : 3 dépôts publiés, règle des sources gardée, charte unique actée (12/10/2026)

## 0. Synthèse d'ouverture

Le travail de la campagne est publié, et l'autre poste le recevra à sa prochaine ouverture. La règle sur les sources des contenus reste en place, avec ses contrôles en simple avertissement. Pour la marque, il n'y avait plus vraiment 2 chartes : depuis votre décision du 22/09, le Web emploie déjà la police des présentations. Vous avez gardé cet état. Le corpus de design est aligné. Il reste à corriger le dossier de marque, dans une session ouverte chez ce produit. Aucune décision ne vous est demandée.

## 1. En-tête d'identification

- **quoi** — votre réponse « 61a, 62a, 63 », avec la question « Il n'y a pas une charte différente entre Powerpoint & Web ? », puis votre choix « Garder l'état actuel ».
- **sur quoi** — pilot `digit-ai-factory` (publié jusqu'à `a44c6e70`), `digit-ai-forge-agents` (publié jusqu'à `6226968`), `digit-ai-forge-design` (publié jusqu'à `966b9a8`).
- **quand** — 2026-10-12, de 14:27 à 15:00 UTC+02:00 (Europe/Paris), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune.
- **intention** — rendre la campagne visible partout et fixer une charte de marque sans ambiguïté. **Test rétro** : servie. Les 3 dépôts sont publiés et la charte est écrite au registre ; le dossier de marque reste à mettre en accord.

## 2. Verdict en une ligne

**3 dépôts publiés sur 3 (écart 0 0 vérifié pour chacun), 3 décisions consignées au registre (PASS avant et après), corpus de design aligné avec sa recette verte (52 oracles).**

## 3. Décisions attendues de l'humain

Rien n'attend de décision ; les 2 bloquants qui retiennent la suite sont datés :

- le dossier de marque du produit `digit-ai-marketing` : une session ouverte chez ce produit ; sans elle, il déclare encore Roboto et DM Sans pour les pages.
- le lot de travaux de ce produit : un émetteur de lots qui reconnaisse ce produit comme destinataire ; sans lui, la demande ne lui parvient que par une session ouverte chez lui.

## 4. Traité — avec sa preuve

Les 3 décisions sont exécutées dans l'ordre de votre réponse.

- **D-61 (a), publication** : le pilot et forge-agents sont publiés ; le manifeste des versions livrées de forge-agents est mis à jour avant l'envoi.
  - preuve : `git push` exit 0 pour chacun, `e11ffcff..f28b2b5a` puis `f28b2b5a..a44c6e70` au pilot, `074ad42..6226968` à forge-agents ; `git rev-list --left-right --count` → `0 0` pour les 2 ; `maj-versions-livrees.mjs --livrer` exit 0. Un 1er envoi du registre a été refusé par le serveur (« fatal error in commit_refs ») ; le 2e est passé.
- **D-62 (a), règle des sources** : la règle est gardée entière, ses 2 contrôles restent avertissants.
  - preuve : `journaliser.mjs` → « 3 événement(s) journalisé(s) », verdict PASS avant et PASS après.
- **D-63, charte** : j'ai mesuré l'état des sources. Le dossier de marque déclare 2 chartes depuis le 11/09, mais le socle des pages emploie Montserrat et Inter depuis votre décision du 22/09 (`boilerplate.html`, lignes 108 et 109). Sur votre choix, le corpus de forge-design et son thème Power BI passent à Montserrat et Inter, avec Roboto et DM Sans en repli.
  - preuve : recette de forge-design « Tout vert — 52 oracles » avant ; 2 vérifications rouges après le seul changement du corpus (le thème Power BI dérivé ne suivait plus) ; à nouveau « Tout vert — 52 oracles » après sa régénération ; commit `966b9a8` publié.

## 5. Non traité — avec son motif

- Le dossier de marque de `digit-ai-marketing` — motif : `dependance_externe`, session à ouvrir chez ce produit ; le dépôt porte aussi du travail non enregistré d'une autre session.
- Le lot de travaux pour ce produit — motif : `dependance_externe`, `emettre-travaux.mjs --essai` répond « aucun produit du parc ne correspond » pour ce nom.
- L'écart D4 de l'oracle DTCG du corpus, un document du socle modifié depuis le 14/09 — motif : `hors_mandat`, rouge avant ce tour et sans lien avec les polices.

## 6. Écarts à la lettre

- **Vous avez demandé** « s'il y a une charte différente, rester comme ça et l'acter » → **je vous ai d'abord montré que le Web suivait déjà la charte des présentations, puis j'ai acté l'état choisi** → **pourquoi** : les 2 lectures de « rester comme ça » menaient à des gestes opposés.

## 7. Risques

- Le dossier de marque reste en contradiction avec le reste du parc tant qu'il n'est pas corrigé.
  - signal : une page générée depuis le dossier de marque en Roboto ;
  - parade : appliquer TF-1023 dans une session du produit.

## 8. Prochaines actions

Une action reste ouverte, et le registre la porte.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Dans une session ouverte chez `digit-ai-marketing`, appliquer TF-1023 : polices du dossier de marque, régénération des jetons, section « Supports » de `MARQUE.md` | `auto_ia` | TF-1023 | `dependance_externe` — session du produit | le dossier de marque contredit la charte actée |

Traces : `todo/TODO.jsonl` (TF-1023, TF-1581, TF-1582), `digit-ai-forge-design` `corpus/tokens-digit-ai.tokens.json`.
