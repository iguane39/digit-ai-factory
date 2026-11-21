---
destinataire: humain
---

# Synthèse Conseil — parcours d'accueil des nouveaux utilisateurs de la Factory, 21/11/2026

## 0. Synthèse d'ouverture

L'entrée dans la Factory est déjà au point : les 33 sujets remontés sur l'accueil et l'installation sont tous corrigés. La perte de temps d'un nouveau venu vient après la bannière : il ne sait pas quoi dire ni où il en est, et chez les produits, 50 sessions sur 76 voient leur première réponse refusée puis réécrite pour une raison de forme. Je recommande une « boussole » : à chaque ouverture, une ligne dit le palier atteint (5 paliers, chacun prouvé par un verdict réel) et la prochaine action, adaptée à la situation du projet. Elle se construit en 4 lots, dont un premier qui rend service seul. Rien n'est construit : le premier lot, L-01 (la boussole à une ligne), se lance quand vous dites « GO L-01 ».

Livré : [Étude du parcours d'accueil](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Parcours%20d%20accueil%20des%20nouveaux%20utilisateurs%20-%2020261121d.md) · [Lots du parcours d'accueil](output/03-etudes/Digit-AI%20-%20Proposition%20-%20Lots%20du%20parcours%20d%20accueil%20-%2020261121e.md)

## 1. En-tête d'identification

Run de conseil (`references/RUN-CONSEIL.md`) sur le prompt réécrit de la revue L99 (analyse de prompt en 8 couches) du même jour, exécuté sur votre consigne « exécute le prompt ». Sur le pilot `digit-ai-factory` (commit 626b12e2). Le 21/11/2026, de 11:06 à 11:15, heure de Paris (UTC+01:00), heures relevées par `date`. Session pilote Claude Opus 5.5, aucun sous-agent.

Intention : qu'un utilisateur qui maîtrise Claude Code obtienne dès sa première session un livrable utile de son vrai projet, jugé vert, puis gagne en autonomie par paliers, sans lire la doctrine d'abord.

Test rétro : la recommandation sert cette intention ; elle agit au moment mesuré comme le plus coûteux (la première réponse) et travaille sur le vrai projet, pas sur un exercice.

## 2. Verdict en une ligne

Boussole recommandée, notée 6 critères sur 6 contre 2 et 2,5 pour les deux autres options ; démarche en 4 lots PASS à l'oracle du livrable de conseil.

## 3. Décisions attendues

Aucune décision nouvelle : le lancement de chaque lot est le GO prévu par le run de conseil, et la question du lot L-04 (des préférences propres à chaque utilisateur) reste ouverte dans l'étude jusqu'à ce que vous la portiez.

- D-221 : rouvrir l'exclusion « Pas de vidéo » du run d'animation de réseau pour les clips jugés, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.

## 4. Traité

- Inventaire de 11 pièces d'accueil existantes, chacune avec ce qu'elle couvre et ce qu'elle laisse au nouveau venu (étude, chapitre 2.1).
- 10 mesures en lecture seule, chacune sourcée et datée (étude, chapitre 2.2), dont : 50 sessions de produit sur 76 au premier tour refusé, et 241 refus au premier passage sur les 2 règles de forme S1 *(un bloc toujours présent manque)* et S4 *(une décision posée sans ses options)*, du 22/10 au 21/11/2026, mesurés sur `.claude/hooks-journal.jsonl` ; 2 journaux de run sur 15 seulement avec un verdict entièrement vert.
- Rubrique de 6 critères recopiée du prompt avant les options ; 3 options sur l'axe « où vit l'aide », notées ; boussole recommandée, 5 paliers, 7 briques chacune raccordée ou ajoutée, aucune ne remplace l'existant.
- Démarche en 4 lots jalonnés du 2026-12-04 au 2027-01-08, revue des bénéfices le 2027-01-15.
- Oracles du contrat : `oracle-livrable-conseil.mjs` PASS sur la démarche (LC1, LC2, LC4, LC5) ; `check_markdown.py` PASS sur l'étude et sur la démarche (M7, M10, M14, M18) ; `oracle-conformite-projet.mjs --regles R-4` (règle de nommage des livrables) sans constat sur mes fichiers du jour.
- Contrôle d'autorité des décisions sur l'étude : A1 et A3 rouges à la première écriture (classe : une question ouverte rédigée comme une décision affirmée), verts après reformulation en « question ouverte pour le porteur ».
- Nommage R-4 de la revue L99 : rouge sur l'indice « a » (classe : indice du jour pris 72 s plus tôt par une session concurrente dans `output/03-etudes/`), vert après réindexation en « c » par `scripts/allouer-indice.mjs`, consignée à `references/RENOMMAGES-LIVRABLES.jsonl` ; le lien de la synthèse précédente est corrigé.
- Relecture d'intention : sans objet, aucun agent lancé ; le test rétro du bloc 1 est celui de la session sur son propre livrable.

## 5. Non traité

- L'étude elle-même n'est pas jugée par `oracle-livrable-conseil.mjs`, qui ne reconnaît que les titres « Diagnostic d'exploitation » et « Démarche ROI » : c'est pourquoi le découpage en lots est sorti dans un second fichier, au gabarit qu'il juge.
- Page HTML autoportante du run de conseil (bloc C5) : écart, parce que le prompt validé demandait un Markdown seul ; le pilot n'a pas de journal de run où le consigner, il est donc consigné ici.
- Valeur de départ du délai jusqu'au premier livrable vert : non mesurable aujourd'hui (M-07), faute de verdicts entièrement verts dans les journaux de run.

## 6. Écarts à la lettre

- 2 fichiers au lieu d'un : l'étude suit l'ordre du prompt, la démarche par lots est séparée pour que l'oracle du conseil la juge.
- Un lot L-03 côté Factory, pas côté utilisateur : la friction la plus fréquente vient de la forme des réponses de la session, qu'aucune aide à l'utilisateur ne réduit.

## 7. Risques

- Les comptes du journal des hooks ne distinguent pas un débutant d'un habitué : M-04 mesure la friction de première réponse de toute session.
- Collision d'indice dans `output/04-plans/` : la revue « Prompt mise a jour competences … 20261121a » d'une autre session est arrivée à 11:06, après ma synthèse « 20261121a » de 11:02 ; c'est à cette session de se réindexer, je n'ai pas touché à son fichier.
- Le poste reste non prêt et la boîte d'entrée bloquante (2 lots de plus de 24 h, 43 lots au sas) : à traiter avant le premier lot.

## 8. Prochaines actions

Ordre : d'abord ce qui débloque le premier lot, parce qu'il rend service seul.

1. Vous (humain) : dire « GO L-01 » pour lancer le lot L-01 (boussole minimale) en run de version au pilot, ou corriger l'étude.
2. Moi (IA), sur votre accord : accueillir et ingérer les lots en attente, puis enregistrer les modifications locales, avant tout run.
3. Vous (humain) : dire si vous voulez porter la question des préférences par utilisateur (L-04) en décision.
4. Moi (IA), sur votre demande : produire la page HTML de l'étude.

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121d.md`.
- Démarche par lots : `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121e.md`.
- Revue L99 réindexée : `output/03-etudes/Digit-AI - Revue - Prompt aide aux nouveaux utilisateurs passe au crible L99 - 20261121c.md`.
- Scripts de mesure, hors dépôt : `C:\Users\SBASTI~1\AppData\Local\Temp\claude\14c1dda92227c354\798946e4-e116-45cd-aec8-bf79dafa3067\scratchpad\frictions.mjs` et `C:\Users\SBASTI~1\AppData\Local\Temp\claude\14c1dda92227c354\798946e4-e116-45cd-aec8-bf79dafa3067\scratchpad\delai.mjs`.
- Rien n'est enregistré dans git ni poussé.
