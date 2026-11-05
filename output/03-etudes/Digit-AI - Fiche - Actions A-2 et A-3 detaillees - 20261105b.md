---
destinataire: humain
role_destinataire: le porteur, qui choisit ce que la session traite après A-1
gabarit: gd-fiche-constat-precos
version_du_gabarit: 1.0.0
---

# Actions A-2 et A-3 de la synthèse du 05/11 : constat et préconisations

*05/11/2026 · refus du hook de fin de tour du 29/10 au 05/11 sur les 2 profils du poste ; registre TODO-FORGE*

## En bref

- **A-2, les refus du hook de fin de tour** : 83 en 7,5 jours, pour une cible de 15 par semaine.
- **Cause principale** : 36 refus sur 83 viennent d'un tour qui a écrit et se clôt sur un message court, souvent une attente d'agents.
- **Déjà résolu** : 14 refus, tous du 29/10, visaient des réponses de 151 à 250 mots que le seuil relevé à 250 mots admet depuis.
- **A-3, les 6 constats des agents** : 6 défauts connus, aucun bloquant, chacun d'environ une heure de travail.

## Constat

Comment lire : une ligne par forme de message refusé, comptée sur les 83 refus relevés ce matin dans les transcriptions des 2 profils.

| Forme du message refusé | Refus | Lecture |
|---|---:|---|
| Tour qui a écrit, clos sur un message court | 36 | la restitution complète était due |
| Réponse sans écriture de 151 à 250 mots | 14 | tous le 29/10, avant le seuil de 250 mots |
| Réponse sans écriture de plus de 250 mots | 13 | la restitution était due, rien n'a été préjugé |
| Message court portant un verdict, 18 à 250 mots | 12 | un verdict exige la restitution, même en 2 lignes |
| Verdict de plus de 250 mots | 6 | la restitution était due |
| Autres | 2 | non classés |
| **Total** | **83** | |

*Aucun écart entre la somme des lignes et le total.*

**1. Le premier levier est la fin d'un tour qui a écrit.**
- 36 refus sur 83 ; 3 le 05/11, dont 2 dans cette session, sur des messages d'attente pendant que des agents travaillaient.

**2. Le produit de pilotage des coûts et le pilot portent presque tout.**
- 38 refus pour le premier, 34 pour le pilot, soit 72 sur 83.

**3. Un verdict court déclenche une restitution complète.**
- 12 réponses de 18 à 250 mots, sans écriture, ont été refusées parce qu'elles disaient PASS ou FAIL.

**4. A-3 rassemble 6 défauts vus en passant par les agents du 05/11.**
- TF-2175 : `source-reader.js` porte le même commentaire fautif que le script de recherche, d'où un faux constat de cache.
- TF-2176 : `render_page` compte encore 2 constats d'alignement sur un en-tête invisible parce que rogné.
- TF-2177 : la règle du frontal nginx ne lit que `proxy_pass`, alors que 4 autres directives figent aussi leur amont.
- TF-2178 : un test de forge-audit échoue quand le dépôt de design voisin manque, ce qui est le cas en intégration continue.
- TF-2179 : une recette d'ouverture du pilot dépasse sa borne de 120 s quand plusieurs agents jouent en même temps.
- TF-2180 : une page de forge-design cite des règles périmées, et un bloc JSON de son registre est invalide.

## Préconisations

| # | Action | Gain par mois | Effort | Attention |
|---|---|---:|---|---|
| **1** | **Rappeler la restitution au lancement d'agents** : une leçon servie quand un tour qui a écrit lance un agent en arrière-plan. | jusqu'à 36 refus évités sur 8 jours | une heure | [décision : aucune, la règle existe déjà ; le rappel ne la change pas] |
| **2** | **Mesurer l'effet du préjugement rendu explicite** : rejouer le relevé le 12/11. | une mesure, pour savoir si TF-2171 suffit | 10 minutes | comparer à 78 refus par semaine |
| **3** | **Admettre un verdict court en lecture seule**, sa mesure citée, sans restitution complète. | jusqu'à 12 refus | une heure | [décision : à poser, c'est un assouplissement de la règle de restitution] |
| **4** | **Traiter les 6 constats d'A-3** par une campagne de 5 agents, un par dépôt. | 6 défauts fermés, dont 3 faux constats | une demi-journée | rejouer chaque recette avant publication |

## Rien à faire

Les 14 refus du 29/10 sur des réponses de 151 à 250 mots sont déjà résolus par le seuil de 250 mots de D-101 (b), décidé le même jour.

## Ordre conseillé

D'abord la première préconisation, qui vise le plus gros groupe. Ensuite la quatrième, sans décision, puis la mesure du 12/11, qui dira si la troisième vaut la question.

## Sources

Relevé en lecture seule des transcriptions du 05/11/2026 à 11:39 (515 fichiers, du 29/10 au 05/11) et son fichier de refus, classé à 15:45 ; registre `todo/TODO.jsonl`, TF-2175 à TF-2180.
