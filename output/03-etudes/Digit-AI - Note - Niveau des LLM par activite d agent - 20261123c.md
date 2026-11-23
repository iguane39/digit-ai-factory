---
lecteur: le porteur de la Factory, qui juge la pertinence de chaque LLM sur chaque activité d'agent et paie ses abonnements à Claude, Codex et Gemini
---

# Niveau des LLM par activité d'agent

Note du 23/11/2026, poste Dell-XPS-16. Elle reprend la note 20261123b avec Codex sur GPT-6.2-Sol, son modèle courant, et 6 activités de plus : image, vidéo, maquette, recherche web, analyse de données, relecture critique. Le 2e banc a tourné ce jour de 11:17 à 11:46.

## Ce qui change pour vous

Sur GPT-6.2-Sol, Codex réussit les 9 tâches du banc au premier essai, là où GPT-5.6-Sol en ratait 1 sur 3. Codex et Gemini génèrent des images avec un outil natif, Claude doit les dessiner par programme : c'est le seul écart net de capacité, et il joue en leur faveur.

Votre abonnement Codex à 20 € (source : votre message du 23/11) a absorbé les 10 appels du jour pour 9 % de sa fenêtre de 5 heures. Ni Codex ni Gemini ne suivent la Factory d'eux-mêmes ; ils exécutent ses contrôles quand Claude le leur demande.

## Le tableau

Le tableau se lit ligne à ligne : une activité, la note de chaque LLM de 0 à 10, puis la règle de la note. 10 est le meilleur. Claude a la meilleure note, seul ou à égalité, sur 11 activités sur 18, Codex sur 9, Gemini sur 12.

| Activité d'agent | Claude Sonnet 5.5, effort high | GPT-6.2-Sol, effort high | Gemini 4 Neon, effort High | Règle de la note |
|---|---|---|---|---|
| Écrire du code borné par des tests | 9 | 9 | 9 | note du relecteur aveugle ; les 3 passent 10 cas cachés sur 10 |
| Retoucher des fichiers en série | 10 | 9 | 10 | note du relecteur aveugle ; les 3 rendent 20 fiches justes sur 20 |
| Rédiger un texte court pour un client | 8 | 9 | 7 | note du relecteur aveugle ; Gemini y a glissé 1 raisonnement faux |
| Générer une image | 5 | 9 | 9 | note du relecteur aveugle ; Codex et Gemini par un outil natif, Claude par un programme de dessin |
| Produire une courte vidéo | 7 | 8 | 7 | note du relecteur aveugle sur 3 images extraites ; les 3 par ffmpeg, aucun outil natif de vidéo |
| Concevoir une maquette de page | 8 | 8 | 9 | note du relecteur aveugle sur les rendus à 375 et 1280 px |
| Chercher sur le web et sourcer | 6 | 5 | 7 | note du relecteur aveugle ; les 3 donnent 3 adresses qui répondent |
| Analyser des données | 10 | 10 | 10 | note du relecteur aveugle ; les 3 rendent les 3 valeurs justes |
| Relire un document à charge | 9 | 8 | 9 | note du relecteur aveugle ; les 3 trouvent les 5 défauts plantés |
| Tenir un ticket de file de bout en bout | 10 | 5 | 10 | 10 seul, 5 avec l'orchestrateur pour une partie ; Codex ne peut pas commiter sous bac à sable |
| Écrire des fichiers sans interface | 10 | 7 | 10 | 10 sans réglage, 7 après un réglage ; Codex exige de retirer `%TEMP%` de ses droits |
| Lancer des commandes git | 10 | 0 | 7 | 10 seul, 0 impossible ; Gemini n'y arrive qu'avec une autorisation générale |
| Respecter la consigne à la lettre | 6 | 10 | 10 | 10 moins 2 points par écart relevé : 2 chez Claude sur ses 9 tâches, 0 chez les 2 autres |
| Finir dans le délai | 10 | 10 | 8 | 10 fois la part des tâches finies avant le délai : Gemini a dépassé 400 s sur 2 tâches sur 9 |
| Rapidité | 10 | 5 | 3 | 10 fois la plus courte durée médiane (38 s) divisée par celle de l'agent : 38, 75 et 136 s |
| Économiser le quota Claude | 0 | 10 | 10 | 10 si la tâche ne coûte à Claude que son lancement, 0 si un agent Claude la fait |
| Exécuter les contrôles de la Factory | 10 | 10 | 10 | 10 si l'agent lance un oracle du pilot et en lit le verdict ; mesuré en lecture seule |
| Suivre la Factory de lui-même | 10 | 0 | 0 | 10 s'il charge ses règles, ses skills et ses hooks au démarrage ; Codex et Gemini n'en chargent aucun |

Le total n'a pas de sens, parce que les activités ne pèsent pas pareil. La relecture aveugle a noté sur le même barème les 2 bancs, à 2 jours d'écart : une différence de 1 point entre 2 colonnes reste dans le bruit.

## Modèles et versions

Le tableau se lit par rôle : le modèle demandé, le modèle servi, et la trace qui le relie.

| Rôle | Outil et version | Modèle demandé | Modèle servi | Trace |
|---|---|---|---|---|
| Claude, tâches | Claude Code 2.1.318, agents `campagne` et `redacteur` | `sonnet`, effort `high` | `claude-sonnet-5-5` | transcriptions des agents |
| Codex, tâches | Codex CLI 0.171.0 | `gpt-6.2-sol` par `-m`, effort `high` | non relu au service | appel éphémère ; `~/.codex/config.toml` désigne `gpt-6.2-sol` depuis ce jour |
| Gemini, tâches | Antigravity CLI 1.5.14 | `gemini-4-neon-high` par `--model` | « Gemini 4 Neon (High) » | journal d'Antigravity |
| Relecteurs aveugles et orchestrateur | Claude Code 2.1.318 | `opus` | `claude-opus-5-5` | transcriptions |

Les lignes code, retouche et rédaction de Claude et de Gemini viennent du 1er banc, le 21/11 ; toutes les autres du 2e banc.

## Vos abonnements

Claude porte 10 fois le budget des 2 autres ; cette section dit ce que chaque abonnement a absorbé.

- **Codex, offre Plus à 20 €** (source : votre message du 23/11) : les 10 appels du jour, à l'effort `high`, ont pris 9 % de la fenêtre de 5 heures et 3 % de la fenêtre de 7 jours, relus par le serveur de Codex à 11:41. À ce rythme, la fenêtre de 5 heures tient environ 110 tâches de cette taille et la semaine environ 330 ; cette projection est estimée, pas mesurée.
- **Gemini par Antigravity, compte Google à 20 €** (source : votre message du 23/11) : le quota restant n'est pas lisible en ligne de commande ; non mesuré. Chaque tâche du 2e banc a pris de 33 616 à 118 126 jetons.
- **Claude, offre à 200 €** (source : votre message du 23/11) : un agent Claude prend de 43 609 à 103 166 jetons par tâche sur les 2 bancs ; le quota restant n'a pas été lu.

Ces chiffres ne confirment pas qu'un abonnement à 20 € (source : votre message du 23/11) ne peut porter qu'une petite part du travail : Codex a gardé 91 % de sa fenêtre après 10 appels. La vraie limite est ailleurs : ni Codex ni Gemini ne portent les contrôles de la Factory. Chaque tâche déléguée demande donc à Claude de la lancer, puis d'en juger le résultat.

## Codex et Gemini dans la Factory

Codex et Gemini ont reçu chacun, en lecture seule au pilot, les mêmes 4 questions. Leurs réponses concordent :

- au démarrage, ils chargent `AGENTS.md`, qui ne porte que l'installateur, et pas `CLAUDE.md` ;
- ils n'ont aucun des 42 skills de la Factory, seulement les leurs : génération d'images et Figma chez Codex, 5 outils d'Antigravity chez Gemini ;
- ils lancent `oracle-ecriture.mjs` et en lisent le verdict, code 0 et PASS ;
- ils citent la loi n° 5 de `CLAUDE.md` quand on le leur demande.

Les hooks de la Factory ne tournent que dans Claude Code. Sans eux, un agent n'a ni restitution jugée, ni réservation des décisions, ni porte de publication. Codex et Gemini peuvent donc travailler pour la Factory comme exécutants de tickets, Claude orchestrant et jugeant ; ils ne peuvent pas la piloter.

## Activités encore sans mesure

5 activités de projet n'ont aucune mesure pour les 3 LLM, et portent « n.m. » :

- la construction complexe : architecture, code neuf d'ampleur ;
- la lecture d'un grand volume de fichiers ;
- les tests de bout en bout d'une application ;
- l'audit de sécurité ;
- le déploiement.

## Limites

- 1 essai par case : chaque note est une indication, pas une capacité.
- Claude a été mesuré sur Sonnet 5.5, pas sur Opus 5.5 ; Gemini sur Neon, pas sur Argon ni Hydrogen.
- La recherche web est notée sur la qualité des sources ; l'exactitude des faits cités n'a pas été vérifiée.
- Le prompt de Codex a précisé l'encodage des fichiers au 2e banc, d'après l'échec du 1er.

## Sources

- Le journal du 2e banc, à côté de cette note : appels, durées, jetons, verdicts d'oracle, relectures aveugles.
- L'étude `Digit-AI - Étude - Plan multi-agents Claude Codex Antigravity - 20261121r.md` et son journal, pour le 1er banc.
- Les notes 20261121f et 20261121q, pour les tickets, l'écriture et git.
- Le serveur de Codex (`account/rateLimits/read`), relu le 23/11 à 11:41.
