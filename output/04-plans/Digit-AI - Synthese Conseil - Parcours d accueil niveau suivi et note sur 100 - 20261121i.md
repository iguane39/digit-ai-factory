---
destinataire: humain
---

# Synthèse Conseil — parcours d'accueil : niveau qui suit l'utilisateur, niveau annoncé ou récupéré, note sur 100, 21/11/2026

## 0. Synthèse d'ouverture

Vos trois retours sont intégrés. L'utilisateur ne repart plus de zéro à chaque projet : son niveau se calcule sur tous ses projets du poste, et chaque projet garde seulement son propre état. Il peut annoncer son niveau, qui est alors marqué « annoncé » et vérifié par l'usage ; sur un poste vierge, une seule question lui est posée ; et il récupère sa progression d'un autre poste par le dossier Drive qu'il utilise déjà pour ses reprises. La progression compte 5 niveaux et une note sur 100, tirée de 30 jalons réels ; seuls les jalons prouvés comptent. Un écueil mesuré : aujourd'hui, les traces de la plupart des jalons manquent, d'où un lot qui les rend fiables. La démarche passe à 6 lots. Rien n'est construit : le premier lot, L-01 (la boussole sur tous les projets), se lance quand vous dites « GO L-01 ».

Livré : [Étude, version intégrée](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Parcours%20d%20accueil%20des%20nouveaux%20utilisateurs%20-%2020261121h.md) · [Lots, version intégrée](output/03-etudes/Digit-AI%20-%20Proposition%20-%20Lots%20du%20parcours%20d%20accueil%20-%2020261121i.md)

## 1. En-tête d'identification

Reprise de l'étude du run de conseil sur votre consigne « intègre », portant sur 3 retours : le départ de zéro à chaque projet, le niveau annoncé ou récupéré du Drive, une progression jusqu'à 100. Sur le pilot `digit-ai-factory` (commit 626b12e2). Le 21/11/2026, de 12:12 à 12:17, heure de Paris (UTC+01:00), heures relevées par `date`. Session pilote Claude Opus 5.5, aucun sous-agent.

Intention : que la boussole accompagne un utilisateur sur toute sa pratique de la Factory, sur tous ses projets et tous ses postes, avec une progression fine et vraie.

Test rétro : chaque retour a son chapitre (2 et 3 pour le suivi et l'annonce, 4 pour le Drive, 5 pour la note) et son lot (L-01, L-02, L-04, et L-03 (lot des traces rendues fiables)).

## 2. Verdict en une ligne

Étude « h » et démarche « i » à 6 lots ; oracle du livrable de conseil PASS sur les 4 règles qu'il juge ; 4 mesures nouvelles, dont 30 étapes closes au nom normalisé sur 1 382.

## 3. Décisions attendues

Aucune décision nouvelle : le lancement de chaque lot reste le GO prévu par le run de conseil, et la question du lot L-06 (des préférences propres à chaque utilisateur) reste ouverte dans l'étude.

- D-221 : rouvrir l'exclusion « Pas de vidéo » du run d'animation de réseau pour les clips jugés, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.
- D-227 : suivre la veille des notes de version des éditeurs dans le plan de mise à jour des compétences, posée le 21/11 à 11:23 par une autre session, inchangée.

## 4. Traité

- Niveau de l'utilisateur séparé de l'état du projet, calculé sur tous les journaux de run du poste, avec 4 sources ordonnées (étude, chapitre 2).
- Niveau annoncé, marqué et vérifié par l'usage ; question unique sur poste vierge ; 3 écrans d'exemple (chapitre 3).
- Progression synchronisée par le canal de reprise existant, règle R-64 (reprise d'un poste à l'autre par un dossier synchronisé) ; exemple de fichier, sans nom de projet (chapitre 4).
- 5 niveaux et une note sur 100 tirée de 30 jalons, chacun avec sa trace ; exemple : 17 jalons donnent 57 sur 100 (chapitre 5).
- Mesures ajoutées, en lecture seule à 12:12 et 12:15 sur les 15 journaux de run des produits : 8 ouvertures de run sur 29 déclarent leur type, 3 produits sur 15 tracent la mobilisation des forges, 30 étapes closes sur 1 382 portent un nom normalisé, 15 produits sur 15 ont un lot de retours.
- Oracles : `oracle-livrable-conseil.mjs` PASS sur la démarche (LC1, LC2, LC4, LC5) ; `check_markdown.py` PASS sur l'étude et la démarche ; `oracle-conformite-projet.mjs --regles R-4` (règle de nommage des livrables) sans constat sur les 2 fichiers.
- Relecture d'intention : sans objet, aucun agent lancé ; le test rétro du bloc 1 est celui de la session sur son propre livrable.

## 5. Non traité

- Les jalons non lisibles aujourd'hui (types de run, forges mobilisées, une partie des étapes) ne sont pas recalculés pour le passé : le lot L-03 rend leurs traces fiables pour la suite, motif : réécrire les journaux passés modifierait l'historique des produits.
- La note de 57 sur 100 de l'exemple n'est pas mesurée sur un utilisateur réel, motif : la boussole n'existe pas encore ; c'est un calcul illustratif.

## 6. Écarts à la lettre

- Vous proposiez d'aller jusqu'à 100 paliers → j'ai gardé 5 niveaux et ajouté une note sur 100 → parce que 100 paliers prouvés chacun par une trace distincte seraient pour la plupart artificiels.

## 7. Risques

- 2 groupes de 3 journaux de run commencent à l'identique, signe de copies d'un même projet : les comptes par projet sont un peu gonflés ; parade : le calcul de L-01 dédoublonne les journaux avant de compter.
- Tant que L-03 n'est pas livré, la note sous-compte un utilisateur expérimenté ; parade : la démarche n'affiche la note que si au moins la moitié des ouvertures de run déclarent leur type.

## 8. Prochaines actions

Ordre : d'abord votre lecture, parce qu'elle conditionne le GO du premier lot.

1. Vous (humain) : relire l'étude « h » et dire « GO L-01 », ou nommer ce qui reste à reprendre.
2. Moi (IA), sur votre accord : accueillir et ingérer les lots en attente, puis enregistrer les modifications locales, avant tout run.

## 9. Traces

- Étude intégrée : `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121h.md`.
- Démarche intégrée : `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121i.md`.
- Versions précédentes, conservées : études « d » et « g », démarche « e », dans `output/03-etudes/`.
- Rien n'est enregistré dans git ni poussé.
