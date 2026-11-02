---
role: résultat de l'essai autorisé par la réponse humaine 127a, sur l'outil d'audit de sécurité de Cloudflare
destinataire: humain
---

# Essai borné de l'audit de sécurité de Cloudflare — 20261102k

N'adoptez pas l'outil de Cloudflare : la règle fixée avant l'essai l'écarte pour son coût. Il retrouve les 8 failles visées, mais une simple requête à un agent les retrouve aussi, pour 20 fois moins de jetons. Le manque de nos contrôles, lui, est confirmé : ils n'en voient aucune. La suite utile est donc d'essayer une revue par agent unique sur un vrai dépôt, pas d'installer cet outil. Ce résultat vaut pour une seule cible, écrite par un modèle, et sans doute trop facile.

Demande : « 127a », sur la décision « Autorisez-vous l'essai borné de l'audit de sécurité de Cloudflare sur un dépôt semé de failles, soit 3 150 000 jetons au plus ? ». Le protocole vient de `output/03-etudes/Digit-AI - Étude - Audit de securite par agents de Cloudflare - 20261102f.md`, section 3 ter.

## Résultat par approche

La cible compte 1 052 lignes, 12 failles semées et 2 leurres, listés dans un dépôt séparé que personne n'a ouvert avant la notation. Les 4 failles P sont celles que nos contrôles savent voir, les 8 failles Q celles qu'ils ne jugent pas. Chaque ligne est une approche, notée par un script écrit avant le jeu.

| Approche | Failles Q sur 8 | Failles P sur 4 | Constats | Constats sans faille semée | Jetons |
|---|---|---|---|---|---|
| A, nos contrôles de `digit-ai-forge-websec` | 0 | 4 | 12 | 4 | 0 |
| B, une requête unique à un agent | 8 | 4 | 14 | 0 | 106 865 |
| C, l'outil de Cloudflare, 1 passage | 8 | 3 | 16 | 3 | 2 185 298 |

L'approche C a manqué la dépendance vulnérable (P2) : son plan ne contenait aucune unité sur le verrou de dépendances. Les 4 constats sans faille semée de l'approche A sont 3 actions de workflow non épinglées et 1 permission de workflow trop large ; je ne les compte pas en défaut, car ce sont de vrais écarts de configuration.

## Les 6 critères

Les seuils ont été fixés avant le jeu. Chaque ligne donne le seuil, la mesure et le verdict.

| Critère | Seuil | Mesure | Verdict |
|---|---|---|---|
| C1, rappel hors de nos contrôles | au moins 5 failles Q sur 8 | 8 sur 8, sur 1 seul passage | Tenu |
| C2, manque de nos contrôles | au plus 1 faille Q | 0 | Tenu |
| C3, apport face à la requête unique | au moins 2 failles Q de plus | 0 de plus | Non tenu |
| C4, précision | au plus 20 % sans faille, aucun leurre confirmé, au plus 1 leurre en attente | 3 sur 16, soit 18,75 % ; aucun confirmé ; 1 constat cite le leurre L1 | Tenu |
| C5, vérification adverse | écarte au moins 50 % des candidats sans faille, garde 100 % des autres | Non jugé : 3 candidats sans faille, sous le minimum de 4. Le vérificateur a gardé les 16, dont les 13 qui portent une faille | Non jugé |
| C6, coût | au plus 1 500 000 jetons par passage, 150 000 pour B | C : 2 185 298 ; B : 106 865 | Non tenu pour C |

**Règle de décision appliquée : « C6 non tenu : le skill est écarté pour coût ».** Les 2 autres suites prévues se lisent ainsi : l'étude d'adoption de la vérification adverse ne s'ouvre pas, car C5 n'est pas tenu ; le référentiel des classes d'attaque reste proposé, car C1 est tenu.

Le constat qui cite L1 porte en réalité sur une vraie injection SQL ; il cite le leurre comme point de comparaison. Il compte quand même au critère C4, tel qu'il était écrit.

## Conséquences pour la Factory

- **Le manque de `digit-ai-forge-websec` est mesuré.** Ses contrôles voient les 4 failles de configuration et aucune des 8 failles de code.
- **Une revue par agent unique le comble sur cette cible.** 106 865 jetons pour 12 failles sur 12, sans leurre retenu.
- **La vérification adverse reste sans réponse.** Elle n'a écarté aucun candidat, mais presque tous portaient une vraie faille : la cible ne permet pas de la juger.

## Limites

- **Cible probablement trop facile.** Écrite par un modèle, courte, avec des failles typiques. Que la requête unique trouve tout le suggère. Sur un vrai dépôt, l'écart peut être tout autre, dans les 2 sens.
- **Aucun constat confirmé.** Tout reste en attente de validation, parce que le code cible n'a pas été exécuté.
- **Un seul modèle.** Sonnet, pour tous les agents, sans le vérificateur d'une autre taille prévu au passage 2.
- **Trace et plan de validation non comparés.** L'approche C rend pour chaque constat une trace, des preuves et un plan de validation, contrôlés par 2 validateurs. Cet apport qualitatif n'entre dans aucun critère, et je ne l'ai pas mesuré.

## Écarts au protocole

- **Le passage 2 n'a pas été joué.** Le passage 1 a coûté 2 185 298 jetons. Sur le plafond de 3 150 000, il restait trop peu pour un second passage, et le critère C6 avait déjà échoué. C1 vaut donc sur un seul passage.
- **Écriture de la cible hors C6.** La cible a coûté 303 744 jetons et la relecture des validateurs 54 126. Total de l'essai : 2 650 033 jetons, sous le plafond.
- **Liste scellée dans un dépôt séparé**, pas dans le premier commit de la cible, sinon les joueurs auraient pu la lire. Les appels d'outils des agents relevés par script montrent 0 accès interdit.
- **Rapport de l'approche B non écrit.** Un garde-fou de l'environnement a refusé le fichier ; le calage de longueur à 20 % près n'a donc pas été contrôlé. Ses constats sont bien au fichier de résultats.
- **Déroulé de l'outil adapté à l'orchestration.** Le plan et les chasseurs lisent les consignes par renvoi au lieu de les recevoir copiées ; le parent a délégué le plan à un agent, pour ne pas orienter la chasse, et assemblé les résultats par script. 28 invocations sur 30.
- **Contrôle d'exposition rejoué sur `public/`**, où se trouve le fichier d'en-têtes : à la racine, il s'abstient.
- **Validateurs joués sans modification dans un conteneur** sans réseau et en lecture seule, parce qu'ils refusent de tourner sous Windows.
