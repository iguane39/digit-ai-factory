---
lecteur: le porteur de la Factory, qui juge la pertinence de chaque LLM sur chaque activité d'agent
---

# Niveau des LLM par activité d'agent

Note du 23/11/2026, poste Dell-XPS-16. Elle reprend les mesures du banc du 21/11 (étude 20261121r) et des essais du même jour, sans aucun nouvel appel.

## Ce qui change pour vous

Chaque note vient d'une mesure, et sa règle de calcul est écrite à côté : vous pouvez la contester case par case. Une activité que rien n'a mesurée porte « n.m. », jamais une note devinée. Sur les 10 activités mesurées, Claude a la meilleure note sur 8, seul ou à égalité. Gemini l'a sur 6, Codex sur 2.

## Le tableau

Le tableau se lit ligne à ligne : une activité d'agent, la note de chaque LLM de 0 à 10, puis la règle qui la donne. 10 est le meilleur.

Les 3 colonnes désignent le modèle et l'outil qui l'a fait tourner :

- **Claude** : Sonnet 5.5 en agent `campagne`, Opus 5.5 en orchestrateur, par Claude Code ;
- **Codex** : `gpt-5.6-sol`, par Codex CLI sous bac à sable ;
- **Gemini** : Gemini 4 Neon (High), par Antigravity CLI sous bac à sable.

| Activité d'agent | Claude | Codex | Gemini | Règle de la note |
|---|---|---|---|---|
| Écrire du code borné par des tests | 9 | 9 | 9 | note du relecteur aveugle, tâche T1 ; les 3 passent 10 cas cachés sur 10 |
| Retoucher des fichiers en série | 10 | 5 | 10 | note du relecteur aveugle, tâche T2, premier essai ; Codex atteint 20 sur 20 à la reprise, encodage imposé |
| Rédiger un texte court pour un client | 8 | 7 | 7 | note du relecteur aveugle, tâche T3 ; Gemini y a glissé 1 raisonnement faux |
| Tenir un ticket de file de bout en bout | 10 | 5 | 10 | 10 seul, 5 avec l'orchestrateur pour une partie, 0 impossible ; Codex ne peut pas commiter sous bac à sable |
| Écrire des fichiers sans interface | 10 | 7 | 10 | 10 au premier essai, 7 après un réglage, 0 impossible ; Codex exige de retirer `%TEMP%` de ses droits |
| Lancer des commandes git | 10 | 0 | 7 | même règle ; Gemini n'y arrive qu'avec l'autorisation générale et 1 commande par appel |
| Respecter la consigne à la lettre | 6 | 8 | 10 | 10 moins 2 points par écart relevé au premier essai du banc : 2 chez Claude, 1 chez Codex, 0 chez Gemini |
| Rapidité | 10 | 8 | 3 | 10 fois la durée médiane la plus courte (35 s) divisée par celle de l'agent : 35, 43 et 124 s |
| Économiser le quota Claude | 0 | 10 | 10 | 10 si la tâche ne coûte à Claude que son lancement, 0 si un agent Claude la fait (43 000 à 62 000 jetons) |
| Piloter la Factory : hooks, oracles, restitution, décisions | 10 | 0 | 0 | 10 si les hooks de la Factory tournent dans l'outil, 0 sinon ; seul Claude Code les fait tourner |

Le total n'a pas de sens : les activités ne pèsent pas pareil. Le pilotage et la rédaction pour un client valent plus qu'une économie de quota, et cet arbitrage vous revient.

## 5 activités sans mesure

5 activités d'agent courantes n'ont aucune mesure pour les 3 LLM. Elles portent toutes « n.m. » :

- la construction complexe : architecture, code neuf d'ampleur ;
- la relecture d'un livrable produit par un autre agent ;
- la recherche web et la synthèse de sources ;
- la lecture d'un grand volume de fichiers ;
- les tâches mécaniques d'extraction, que la Factory confie à Haiku.

Les mesurer demande un 2e banc, de la même forme que celui du 21/11.

## Limites

- Chaque note vient d'un seul essai par case : c'est une indication, pas une capacité.
- Un seul modèle par fournisseur a été essayé ; Antigravity en sert 16 autres pour Gemini.
- Le poste DESKTOP-ULTRA7 n'a ni Codex ni Antigravity.

## Sources

- L'étude `Digit-AI - Étude - Plan multi-agents Claude Codex Antigravity - 20261121r.md` et son journal de banc `….banc.json`, pour les tâches T1 à T3, les durées, les jetons et les écarts.
- Les notes du 21/11 : 20261121f et 20261121q, pour les tickets, l'écriture et les commandes git.
- L'historique git de la file de Produit-79, lu le 23/11 : 4 tickets tenus par Claude et 5 livrés par Codex, les 12 et 13/11.
- `CONTRAT-INTERFACE.md` §4, pour le pilotage par Claude Code.
