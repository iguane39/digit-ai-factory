---
destinataire: humain
---

# Synthèse Conseil — parcours d'accueil des nouveaux utilisateurs, étude complétée par des exemples, 21/11/2026

## 0. Synthèse d'ouverture

La nouvelle version de l'étude commence par ce que l'utilisateur gagne, en 3 points : il sait toujours quoi dire ensuite (3 phrases prêtes, adaptées à son dossier), il sait où il en est (« palier 2 sur 5 » et l'étape suivante), et il attend moins ses premières réponses (1 minute de réécriture évitée par refus, 344 minutes du 22/10 au 21/11/2026 chez les produits). Elle montre ensuite, à l'écran, une première semaine sur un projet fictif, ce que la boussole affiche à chaque palier selon la situation, et un exemple de réponse à « où en suis-je ? ». Un tableau sépare ce que le nouveau venu sait déjà de Claude Code de ce que la Factory fait autrement. Rien n'est construit : le premier lot, L-01 (la boussole à une ligne), se lance quand vous dites « GO L-01 ».

Livré : [Étude complétée](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Parcours%20d%20accueil%20des%20nouveaux%20utilisateurs%20-%2020261121g.md)

## 1. En-tête d'identification

Reprise de l'étude du run de conseil sur votre retour « ce qui est proposé n'est pas clair… Complète et fournis des exemples concrets ». Sur le pilot `digit-ai-factory` (commit 626b12e2). Le 21/11/2026, de 11:22 à 11:25, heure de Paris (UTC+01:00), heures relevées par `date`. Session pilote Claude Opus 5.5, aucun sous-agent.

Intention : que le porteur comprenne d'un coup ce que la proposition apporte à un nouveau venu, et puisse en juger sur des exemples.

Test rétro : la version répond aux 4 manques nommés dans le retour (ce qu'il gagne, les avantages, ce qu'il sait, des exemples), chacun dans un chapitre propre (chapitres 1, 6, 2, puis 3 à 5).

## 2. Verdict en une ligne

Étude complétée en 10 chapitres, dont 6 nouveaux ; fond inchangé, 1 mesure de gain ajoutée ; lisibilité Markdown PASS.

## 3. Décisions attendues

Aucune décision nouvelle : le lancement de chaque lot reste le GO prévu par le run de conseil.

- D-221 : rouvrir l'exclusion « Pas de vidéo » du run d'animation de réseau pour les clips jugés, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.
- D-227 : suivre la veille des notes de version des éditeurs dans le plan de mise à jour des compétences, posée le 21/11 à 11:23 par une autre session, inchangée.

## 4. Traité

- Chapitre 1 nouveau : les 3 gains, chacun avec ce qui change à l'écran, et ce que l'utilisateur ne gagne pas.
- Chapitre 2 nouveau : 7 lignes « ce qu'il sait de Claude Code / ce que la Factory fait autrement / ce que la boussole lui dit ».
- Chapitres 3 à 5 nouveaux : une première semaine racontée avant et après, 4 écrans d'exemple, les phrases du palier 1 pour 3 situations, une réponse complète à « où en suis-je ? ».
- Chapitre 6 nouveau : avantages comparés en 6 moments, chaque gain dit mesuré ou attendu.
- Mesure ajoutée M-11 (mesure 11) : 115 refus de premier passage chez les produits, réécrits en 1,0 minute en médiane, 344 minutes au total, du 22/10 au 21/11/2026, sur `.claude/hooks-journal.jsonl`.
- Oracles : hook d'écriture sans refus ; `check_markdown.py` PASS (M7, M10, M14, M18).
- Relecture d'intention : sans objet, aucun agent lancé ; le test rétro du bloc 1 est celui de la session sur son propre livrable.

## 5. Non traité

- La démarche par lots `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121e.md` n'est pas réécrite : son fond n'a pas changé, et l'étude complétée en résume les lots au chapitre 9 par ce que l'utilisateur voit de nouveau.
- Les gains « savoir quoi dire » et « savoir où il en est » restent attendus, non mesurés : leur mesure naît avec le lot L-01.

## 6. Écarts à la lettre

- Nouvelle version dans un nouveau fichier daté plutôt qu'une modification de l'étude « d », parce que la règle des projets veut qu'une version nouvelle soit un fichier nouveau ; la version « d » reste en place.

## 7. Risques

- Les exemples d'écran sont illustratifs : le texte réel de la boussole se fixera au lot L-01, et pourra différer.

## 8. Prochaines actions

Ordre : d'abord votre lecture, parce qu'elle conditionne le GO du premier lot.

1. Vous (humain) : relire l'étude complétée et dire « GO L-01 », ou nommer ce qui reste flou.
2. Moi (IA), sur votre accord : accueillir et ingérer les lots en attente, puis enregistrer les modifications locales, avant tout run.

## 9. Traces

- Étude complétée : `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121g.md`.
- Version précédente, conservée : `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121d.md`.
- Rien n'est enregistré dans git ni poussé.
