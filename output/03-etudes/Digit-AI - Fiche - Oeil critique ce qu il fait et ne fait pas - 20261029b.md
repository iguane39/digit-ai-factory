---
destinataire: humain
objet: ce que le skill oeil-critique fait et ne fait pas, confronté aux demandes d'amélioration continue du 03/09 au 26/10/2026
date: 2026-10-29
sources: ../digit-ai-forge-agents/.claude/skills/oeil-critique/SKILL.md (1.1.2), todo/oeil-critique-Dell-XPS-16.json, todo/oeil-critique-scelles.jsonl, oracles/hook-ouverture.mjs, études L99 du 03/09, 17/09, 20/10 et 21/10
---

# Œil critique : ce qu'il fait, ce qu'il ne fait pas (29/10/2026)

## En bref

- Sur 8 demandes, 2 sont tenues, 5 le sont en partie, 1 ne l'est pas.
- 1 seule exécution réelle, le 26/10, sur ce poste seulement : 44 sessions, 122 demandes, 5 majeures posées, 4 recommandations suivies sur 5.
- Depuis D-94 (a), le relevé d'ouverture rappelle de lancer l'analyse sur le poste dont le repère a plus de 7 jours ; le lancement reste manuel.
- Il lit les échanges du poste, jamais l'existant en lui-même : ni code mort, ni items clos, ni lots des produits.

## Constat

Comment lire : une ligne par demande, puis ce que le skill en fait.

| Demande, date | Réponse du skill | État |
|---|---|---|
| 03/09 : ne plus remonter 2 fois la même erreur, faire redescendre les corrections | Une règle enfreinte 2 fois appelle une barrière ; chez un produit, il lit et propose seulement | en partie |
| 17/09 : revue de l'existant, code mort, devenir des items traités, retours des produits | Rien de cela : sa source est la conversation, pas le dépôt ni le registre | non tenue |
| 20/10 matin : remonter les incohérences de tous les process, au sens large | Il voit les reprises et les refus de hook ; un process coûteux dont personne ne parle lui échappe | en partie |
| 20/10 après-midi : ajouts, modifications, optimisations et suppressions | Il liste des modifications ; une suppression n'y figure que pour une règle de style | en partie |
| 20/10 : petites corrections automatiques, validation des seules majeures | 9 motifs de majeure ; les automatiques s'exécutent dans le tour qui reçoit la liste | tenue |
| 20/10 : propositions régulières, sans intervention humaine | Rappel à 7 jours depuis le 29/10 ; le lancement reste votre geste | en partie |
| 20/10 : process attendus enclenchés, forges oubliées | La mission 5 le voit après coup ; la barrière à chaque demande est T4, chantier distinct | en partie |
| 21/10 : revue de code, intentions contre livraisons, répondre en une fois, architecture par palier | Les 4 missions sont écrites, plus une cinquième ; le palier mensuel n'a jamais tourné | tenue |

### Le tri entre automatique et majeur tient

Le 26/10, 5 majeures ont été posées avec une recommandation scellée, et 4 ont été suivies. Les corrections automatiques ont été faites dans le tour, avec leur commit.

### La régularité ne tient pas encore

1 exécution en 9 jours, aucune sur l'autre poste. Le rappel du 29/10 corrige l'oubli, pas la dépendance à votre geste.

### L'existant n'est pas regardé

Le skill ne lit que les transcripts et le journal git. Le code jamais appelé, les items clos sans gain mesuré et les lots des produits n'entrent pas dans l'analyse. Les outils existent pourtant : `scripts/relever-appelants.mjs` et `oracles/oracle-controles-injoignables.mjs`.

### Les process silencieux échappent

Un hook lent ou un contrôle qui ne trouve jamais rien ne laisse pas de trace dans la conversation. Exemple ouvert : TF-1956, 4 domaines d'oracle sans un échec en 662 passages.

## Préconisations

| # | Action | Gain | Effort | Attention |
|---|---|---|---|---|
| 1 | Lancer « œil critique » sur les 2 postes | 2e mesure des indicateurs : 47 reprises pour 122 demandes au 26/10 | simple × court | 3 jours de période sur ce poste, 9 sur l'autre |
| 2 | Exiger à chaque exécution au moins 1 suppression proposée, ou le motif de son absence | répond au « suppressions » du 20/10 | simple × court | modification du skill, à faire valider |
| 3 | Ajouter une mission « existant » : appelants, contrôles injoignables, items clos sans gain mesuré | couvre la demande du 17/09 | moyen × moyen | élargit le skill : décision humaine |
| 4 | Ajouter les process silencieux : durée des hooks lue aux transcripts, domaines d'oracle sans échec | couvre l'esprit du 20/10 matin | moyen × moyen | ne pas relancer les hooks pour mesurer |
| 5 | Juger la revue du 23/11 sur 3 exécutions au moins | évite de condamner un outil peu lancé | simple × court | sinon, prolonger l'essai |

## Rien à faire

- Pas d'hébergement GitHub, Railway ou routine cloud : aucun ne lit les transcripts du poste.
- Pas de contrôle des forges à chaque demande dans le skill : T4 (TF-1949) le porte déjà.

## Ordre conseillé

1, puis 2, puis 5 avant le 23/11 ; 3 et 4 ensuite, après décision.

Sources : `SKILL.md` 1.1.2 de forge-agents, repère et scellés de `todo/`, `oracles/hook-ouverture.mjs`, études L99 des 03/09, 17/09, 20/10 et 21/10 dans `output/03-etudes/`.
