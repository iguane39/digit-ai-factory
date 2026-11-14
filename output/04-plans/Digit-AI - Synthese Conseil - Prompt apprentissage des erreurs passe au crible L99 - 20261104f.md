---
destinataire: humain
---

# Synthèse Conseil — prompt d'étude « Claude Code apprend de ses erreurs » passé au crible L99 (04/11/2026)

## 0. Synthèse d'ouverture

Votre prompt est réécrit et noté 84 sur 100 par 2 relecteurs aveugles, contre 27 au départ. La Factory a déjà l'essentiel de ce que vous demandez : un registre de 2 144 sujets, 227 classes d'erreurs, 520 récidives comptées et une mémoire par projet. Une étude du 03/09/2026 avait déjà conclu sur ce sujet. Le prompt réécrit fait donc partir l'étude de cet existant. Il la concentre sur 2 maillons faibles : une erreur connue n'est pas relue avant le geste suivant, et ce que la Factory apprend redescend mal chez les produits. Il reste 5 défauts moyens, listés avec leur correction. Vous pouvez lancer l'étude telle quelle, ou demander d'abord ces corrections.

Livré : [Revue L99 du prompt d'étude sur l'apprentissage par les erreurs](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20apprentissage%20des%20erreurs%20passe%20au%20crible%20L99%20-%2020261104a.md)

## 1. En-tête d'identification

Analyse de prompt L99 en mode boucle, au pilot `digit-ai-factory`. Période : 04/11/2026 de 15:27 à 15:49, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 8 agents `verificateur` : 6 relecteurs aveugles et 2 vérificateurs de clôture ; escalade de modèle : aucune.

Intention de la demande : obtenir un prompt qui lance une étude d'opportunités utile, pour que Claude enregistre ses erreurs et leurs solutions par produit, remonte les erreurs génériques à la Factory et réduise les récidives d'un produit à l'autre.

Test rétro : le résultat sert cette intention. Le prompt réécrit cite votre intention mot pour mot et en garde les 4 mouvements : enregistrer, annoter les solutions, remonter, partager. Il y ajoute la relecture avant d'agir et la redescente, sans lesquelles l'objectif « limiter des erreurs répétitives » ne se tient pas.

## 2. Verdict en une ligne

Score mesuré à 84 sur 100, contre 27 au départ, en 3 passes. La boucle s'arrête faute de gain : 84, puis 84. Il reste 5 majeurs, 0 bloquant. Journal de boucle PASS à `oracle-boucle-l99`.

## 3. Décisions attendues

Aucune décision ne vous revient : lancer l'étude ou corriger d'abord le prompt se choisit au bloc 8.

## 4. Traité

- **Analyse en 8 couches**, écrite dans la revue. Elle part d'un fait : la Factory couvre déjà presque tout ce que le prompt suppose absent. La classe `boucle-retour-sans-descente` compte 36 sujets et 28 récidives (`todo/RECIDIVES.md`, lu à 15:35). La mémoire sur les longs heredoc porte 12 morsures malgré la leçon écrite : écrire une leçon n'empêche pas de la répéter.
- **Boucle de réécriture.** 3 passes, notées chacune par 2 relecteurs aveugles. À chaque passe, chaque défaut grave a été recompté à la source par une commande : 14 retenus, 1 démenti. Avant les passes 2 et 3, un vérificateur qui ne note pas a trouvé 8 défauts créés par les corrections, tous corrigés avant la relecture.
- **Oracles joués sur la revue.** `check_markdown.py` rend PASS. `oracle-ecriture.mjs` rend exit 0, après le passage en chiffres de 32 nombres écrits en lettres. `oracle-boucle-l99.mjs` rend PASS sur le journal. Une comparaison par `diff` prouve que le prompt inclus dans la revue est identique à celui de la passe 3.
- **Relecture d'intention :** sans objet, motif : au relevé d'ouverture, l'essai avait déjà franchi son plafond de 4 000 000 jetons par jour, et ce plafond demande d'arrêter l'essai.

## 5. Non traité

- **Les 5 majeurs ouverts** : motif, borne de la boucle atteinte sans gain. Ce sont la définition de l'erreur sans cas limites, le choix de l'erreur de produit du jeu d'essai, des risques non gradués par option, une boucle de tests qui omet le jeu d'essai, et un fichier d'événements sans emplacement. Leurs corrections sont écrites au chapitre 8 de la revue, sans relecture aveugle.
- **L'exécution de l'étude** : motif, vous avez demandé d'améliorer le prompt, pas de le lancer.
- **La publication du pilot** : motif, non demandée ; l'enregistrement reste local.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « fournir à Claude Code la capacité » | l'étude part des 9 existants mesurés et étudie ce qui manque | la capacité existe déjà en partie |
| « partagées à tous les produits » | l'étude traite la redescente sous la règle qui interdit au pilot d'écrire chez un produit sans run | le pilot n'écrit pas chez les produits |
| « Travaille sur une étude » | l'étude recommande 1 option et propose un sujet au registre, au statut « candidat » ; vous décidez | l'arbitrage vous revient |

## 7. Risques

- **Valeurs qui vieillissent.** Énoncé : le registre reçoit des lots dans la journée, et les chiffres de l'étape 0 dérivent. Signal : un écart entre le prompt et la remesure. Parade : le prompt exige de remesurer, et de signaler à part tout écart de plus de 10 %.

## 8. Prochaines actions

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer l'étude avec le prompt réécrit tel qu'il est, noté 84 | neuve | auto_ia | attend votre « A1 » : lancer un run se demande | chapitre 8 de la revue, bloc « Prompt réécrit » | l'étude n'existe pas et les récidives restent au niveau mesuré |
| A-2 | Appliquer d'abord les 5 corrections au prompt, le faire relire par 2 relecteurs aveugles, puis lancer l'étude | neuve | auto_ia | attend votre « A2 » : 1 passe de plus a coûté ici de 31 000 à 43 000 jetons par agent | chapitre 8 de la revue, « Les 5 majeurs ouverts » | l'étude part avec 5 défauts moyens connus |

## 9. Traces

- Revue : `output/03-etudes/Digit-AI - Revue - Prompt apprentissage des erreurs passe au crible L99 - 20261104a.md`.
- Journal de boucle : même chemin, suffixe `.boucle.json`.
- Passes du prompt : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\6f67c906-a169-46fe-8511-7988d35b1555\scratchpad\l99-erreurs\prompt-p1.md`, `prompt-p2.md` et `prompt-p3.md` dans ce même dossier.
- Enregistrement : commit local `223dd259` au pilot, non publié.
