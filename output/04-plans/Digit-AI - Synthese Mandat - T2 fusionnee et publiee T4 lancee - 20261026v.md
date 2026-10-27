---
destinataire: humain
---

# Synthèse Mandat — T2 fusionnée et publiée, T4 lancée : quatre chantiers sur quatre en place (26/10/2026)

## 0. Synthèse d'ouverture

Les quatre chantiers de vos décisions sont maintenant dans le pilot publié. Une réponse courte n'est plus refusée quand le tour n'a rien écrit, et le compte rendu ne bloque plus que sur l'absence d'un bloc essentiel, une décision sans ses options, un verdict sans fait mesuré, une affirmation de complétude non sourcée, un écran qui diffère du fichier ou une décision non réservée. T4, la carte des forges avec son verrou avant « livré », vient de partir dans son arbre de travail. Deux choix laissés ouverts par T2 vous reviennent.

## 1. En-tête d'identification

Exécution de vos actions A-1 et A-2 (« A1 & A2 ») · sur le pilot digit-ai-factory et GitHub · le 26/10/2026 à 17:58 (heure de Paris, UTC+1) · Claude Opus 5.5 et 1 agent constructeur, publication 5b961d60 → f40f87b6, T4 lancée à 17:57.

Intention : faire baisser les refus de forme et vos interventions, puis fermer l'oubli des forges. Test rétro : la première partie est en service et mesurable dans 7 jours ; la seconde est lancée.

## 2. Verdict en une ligne

4 chantiers fusionnés sur 4, 13 recettes vertes sur 13 après fusion, pilot `0 0` avec GitHub, gabarit de restitution de 188 470 à 147 968 octets pour 130 Ko visés.

## 3. Décisions attendues

> **D-81 — Faut-il rendre de nouveau bloquants le contrôle GESTE et l'heure non relevée (S84), passés en avertissement par T2 ?**
>
> - **De quoi s'agit-il** : GESTE refuse une réponse qui, après votre lettre de décision, rejoue la restitution au lieu d'exécuter l'option choisie ; S84 refuse une heure d'en-tête écrite sans relevé d'horloge.
> - **Le problème** : T2 ne garde bloquants que les contrôles qui protègent d'un faux vert sur un fait ; l'agent a classé GESTE et S84 hors de cette catégorie. Or GESTE protège directement de votre intervention répétée (le 11/09, une synthèse renvoyée 2 fois à l'identique après « 11a »), et l'heure fausse est une récidive notée 6 fois en mémoire.
> - **Pourquoi vous** : c'est la doctrine de restitution que T2 vient d'alléger sur votre décision.
> - **Recommandation : (b)** — GESTE sert votre objectif de ne pas intervenir deux fois ; l'heure se relève sans coût par une commande, son avertissement suffit. Source consultée : rapport du chantier T2, section « À trancher par l'humain ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Garder les deux en avertissement | Un geste non exécuté ou une heure estimée passent avec un avertissement | nul | sans objet |
| **(b)** *(recommandée)* Rendre GESTE bloquant, garder S84 en avertissement | Une lettre de décision exige la preuve du geste ; l'heure reste avertie | simple × court | repasser GESTE en avertissement |
| **(c)** Rendre les deux bloquants | Le geste et l'heure sont tous deux exigés | simple × court | repasser en avertissement |

> **Sans réponse** : (a), les deux restent en avertissement.

> **D-82 — Faut-il lever la borne « sans mot de verdict » de la réponse courte ?**
>
> - **De quoi s'agit-il** : une réponse courte sans écriture ne doit pas contenir les mots PASS, conforme, garanti, exhaustif ou verdict ; sinon elle repasse en restitution complète.
> - **Le problème** : la borne a fait refuser 3 réponses courtes en 7 jours (23, 94 et 94 mots) ; sans elle, une réponse courte pourrait affirmer « conforme » sans fichier jugé qui le mesure.
> - **Pourquoi vous** : c'est une borne de la doctrine des niveaux, que votre réponse 75c a élargie sans la retirer.
> - **Recommandation : (a)** — 3 refus par semaine coûtent moins qu'une affirmation de conformité non mesurée dans une réponse que rien ne juge. Source consultée : rapport du chantier T2, section « Écarts à la lettre ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Garder la borne | Une réponse courte qui rend un verdict passe en restitution complète | nul | sans objet |
| **(b)** Lever la borne | Une réponse courte peut dire PASS ou conforme sans restitution | simple × court | rétablir la borne |
| **(c)** Lever la borne si la réponse cite la commande qui mesure | « conforme » passe en court avec sa source, sinon restitution | simple × court | rétablir la borne |

> **Sans réponse** : (a), la borne reste.

## 4. Traité

- T2 fusionné (commits f40ef7c9 et c9c55f65 de l'agent) : réponse courte pour tout tour sans écriture ; blocs 2, 6 et 7 facultatifs ; blocage réduit aux motifs dits au bloc 0 ; GESTE, DÉTAIL, PROCÉDURE, S6, S48, S80, S83 et S84 en avertissement ; `gabarits/RESTITUTION.md` en 2.50.0, historique sorti dans `gabarits/RESTITUTION-HISTORIQUE.md`.
- Conflits de fusion résolus :
  - `gabarits/HERITAGE.json` : les deux versions 1.37.0 et 1.38.0 réunies en 1.39.0 ; 2 entrées d'artefacts en double fusionnées, ce qui a rétabli l'exigence du hook des gestes distants chez les produits (`relever-heritage` 45 PASS et 1 FAIL avant, 46 PASS après) ;
  - `gabarits/hooks-factory.test.mjs` : phrase de bilan de T2 gardée.
- Recettes rejouées sur le pilot fusionné : hook de restitution 58/58, `oracle-synthese --self-test` 242/242, relais des produits 26/26, hook d'ouverture 44 PASS, héritage 46 et 20 PASS, gestes distants 74 PASS, hook de saisie 23 PASS, niveau Moyen 21/21, R17 5 PASS, relecture d'intention 76 PASS, `ledger.py` 22 PASS, `oracle-ecriture` exit 0, `oracle-claude-md` PASS.
- Registre : TF-1947 annoté, en cours pour la taille du gabarit ; TF-1949 passé en session.
- Publication : `git push origin main` de 5b961d60 à f40f87b6, puis `0 0` mesuré par `git rev-list`.
- T4 lancée à 17:57 dans un arbre de travail isolé, consigne citant vos mots sur les forges à ne jamais oublier.
- D-81 et D-82 réservées par `scripts/reserver-decision.mjs`.
- Relecture d'intention : sans objet pour ce tour, qui fusionne des chantiers vérifiés par leurs recettes ; la relecture se fera sur T4 à son retour.

## 5. Non traité

- Gabarit de restitution à 130 Ko : non atteint, 147 968 octets ; il faut sortir les justifications de chaque règle, reste de TF-1947.
- « 8 blocs » encore écrit dans `CLAUDE.md` et 5 autres références : à mettre à jour en « 9 blocs, dont 3 facultatifs ».
- La recette `oracles/banc-restitutions/restitutions.mjs` recopie l'ancienne liste des règles bloquantes au lieu de la lire au hook.

## 6. Écarts à la lettre

Le chantier T2 exige désormais les blocs 0 et 9, qui ne l'étaient pas : au pilot, aucune synthèse ne les omet depuis le 13/10, et la mesure chez les produits n'est pas faite.

## 7. Risques

- Énoncé : moins de règles bloquantes laisse passer des restitutions moins régulières. Signal : une reprise de contexte qui manque d'une information que vous attendiez. Parade : la prochaine analyse d'œil critique compare refus et reprises avant et après.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-2 et A-3 sont des suites de T2, A-1 attend T4.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1949 | Fusionner T4 à son retour, rejouer ses recettes, publier | auto_ia | dependance_externe | retour de l'agent constructeur lancé à 17:57, puis `git push origin main` | les forges restent oubliées |
| **A-2** | TF-1947 | Sortir les justifications du gabarit pour atteindre 130 Ko, et remplacer « 8 blocs » dans les 6 références | auto_ia | dependance_externe | après la fusion de T4, qui touche les mêmes fichiers | le gabarit reste chargé de 18 Ko de trop |
| **A-3** | TF-1947 | Appliquer vos réponses à D-81 et D-82 | auto_ia | dependance_bloc_3 | réponses « 81b, 82a » ou autres lettres | les deux contrôles restent dans leur état actuel |

## 9. Traces

- Publication f40f87b6 sur GitHub.
- `gabarits/RESTITUTION.md` 2.50.0, `gabarits/RESTITUTION-HISTORIQUE.md`, `gabarits/HERITAGE.json` 1.39.0.
- `todo/TODO.jsonl`, TF-1947 et TF-1949 ; `decisions/REGISTRE.jsonl`, D-81 et D-82.
