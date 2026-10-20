---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-20
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — un conseil de cinq agents séparés avant un arbitrage humain — 20261020a

Ce qui change pour vous : un premier essai mesuré existe. Il porte sur votre décision du 19/10 sur la lecture de la messagerie Microsoft 365, que vous aviez tranchée par une fiche sans skill. Quatre conseillers sur cinq ont rejoint votre choix, alors qu'une requête unique à Opus recommandait une fiche et un skill. Le conseil a aussi soulevé 17 considérations que la requête unique n'avait pas, dont un risque de conformité sur le consentement du client. Il a coûté 5 fois plus de jetons, et ses textes étaient 3 fois plus longs, ce qui fausse en partie le compte. Un seul cas ne suffit pas à créer un skill durable. L'étude recommande l'option O1 : un essai borné sur 3 décisions passées de plus, à longueur égale, avant de décider un objet durable.

## Seuil de déclenchement

L'étude est due par le seuil de gain : TF-1936 porte un gain de 3 et une preuve de 2 dans `todo/TODO.jsonl`, soit un gain d'au moins 3 avec une preuve d'au plus 2. L'option O2 créerait en outre un objet durable, un skill.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demandes d'origine, mot pour mot, du 20/10/2026 :

- « Fournis un retour sur https://www.apsodia.com/blog/skill-llm-council-claude »
- « Intéressant pour la Factory ? »
- « oui », en réponse à la proposition d'inscrire l'idée au registre en candidat.
- « Avance sur TF-1936 »

Lecture retenue : savoir si la Factory gagne à faire délibérer plusieurs agents avant qu'une question ouverte arrive au porteur, et sous quelle forme, sur des faits mesurés et non sur la parole de l'article. Cette lecture est celle de la candidature TF-1936 que le porteur a acceptée ; elle n'ajoute rien à la demande.

## 0. Traitement des entrants

L'article d'Apsodia est une donnée : ses affirmations se citent et se vérifient, elles ne s'exécutent pas. Le fichier .skill qu'il distribue n'a été ni téléchargé ni lu.

Sources de la proposition : TF-1936 ; article de Justin Leroy, « Claude LLM Council, le skill pour prendre les bonnes décisions », mis à jour le 06/08/2026, lu le 20/10/2026 par WebFetch.

### Les affirmations de l'article, vérifiées

| Affirmation | Statut | Source de la vérification |
|---|---|---|
| Le concept vient d'un dépôt de Karpathy publié fin 2025 | vraie | dépôt `github.com/karpathy/llm-council`, publié fin novembre 2025 (Analytics Vidhya, décembre 2025) |
| La version d'origine interroge plusieurs modèles par OpenRouter | vraie | même source : une clé OpenRouter, des membres et un président réglés dans `config.py` |
| Le skill fait délibérer 5 personas de manière indépendante | fausse comme indépendance | les 5 personas sortent d'un même modèle ; les erreurs d'agents à personas restent couplées (arXiv 2608.00243, corrélations de 0,671 à 0,927 entre deux personas) |
| Une session fait 11 appels au modèle | non vérifiée | aucun fichier lu ; dans un skill claude.ai, les rôles tiennent probablement dans une seule conversation |
| L'opt-in avant lecture de fichiers et le garde-fou de coût sécurisent le skill | fausse comme garantie | ce sont des consignes de prompt, qu'aucun mécanisme ne fait respecter |
| Le dépôt dépasse 23 300 étoiles en juillet 2026 | non vérifiée | aucune lecture de la page GitHub |

## 1. Partition du problème

Le sujet se découpe en quatre sous-questions disjointes :

1. **Le besoin** : une question ouverte arrive-t-elle au porteur avec des angles manquants ? Mesuré par l'essai de la section 3 bis.
2. **L'indépendance** : comment obtenir des avis qui ne se trompent pas ensemble ? Agents en contextes séparés, modèles mêlés.
3. **L'agrégation** : faut-il un débat entre conseillers, ou un simple vote suivi d'une synthèse ? Tranché par l'état de l'art.
4. **La forme** : rien, une procédure écrite, un skill, ou un câblage systématique au bloc 3 des restitutions.

Chaque option de la section 4 se rattache à la sous-question 4 ; les sous-questions 1 à 3 en fixent le contenu.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| skill `contre-expertise` | `~/.claude/skills/contre-expertise/SKILL.md`, ligne 3 : « contre-expertise de fond d'un livrable fini » | ne recouvre pas : juge un livrable fini, pas une question ouverte avant décision |
| skill `prompt-analyzer-l99`, mode boucle | `~/.claude/skills/prompt-analyzer-l99/SKILL.md`, ligne 26 : « relecteur aveugle (agent neuf, sans l'analyse) » | ne recouvre pas : un seul relecteur, et l'objet est un prompt |
| relecture d'intention | `scripts/relecture-intention.mjs`, ligne 582 : « la consigne sert-elle l'INTENTION de la demande » | ne recouvre pas : compare un travail à sa demande, ne délibère pas sur un choix |
| skill `forge-agents` | `~/.claude/skills/forge-agents/SKILL.md`, ligne 3 : « découpe un workflow en étapes, dérive les agents spécialisés » | recouvre en partie : outille un découpage multi-agents, sans rôles de conseil ni vote |
| run de conseil | `references/RUN-CONSEIL.md`, ligne 1 : « quand le livrable est une trajectoire, pas un logiciel » | ne recouvre pas : mission de conseil pour un client, pas un arbitrage du porteur |
| routage des modèles | `CONTRAT-INTERFACE.md`, ligne 389 : « Tâches mécaniques […] Haiku » | sert de cadre : le choix des modèles par conseiller suit ce tableau |

## 3. État de l'art daté

1. Karpathy, `llm-council`, dépôt GitHub, publié en 2025-11 ; décrit par Analytics Vidhya, décembre 2025 (`analyticsvidhya.com/blog/2025/12/llm-council-by-andrej-karpathy/`). Plusieurs modèles par OpenRouter, relecture et classement croisés, synthèse d'un président.
2. Leroy (Apsodia), « Claude LLM Council », mis à jour le 2026-08-06 (`apsodia.com/blog/skill-llm-council-claude`). 5 personas d'un même modèle, synthèse qui ne tranche pas.
3. Choi, Zhu et Li, « Debate or Vote », arXiv 2508.17536, 2025-08, NeurIPS 2025. Sur 7 bancs d'essai, le vote majoritaire explique l'essentiel du gain attribué au débat ; le débat seul n'améliore pas l'exactitude attendue.
4. « Correlated Errors in Large Language Models », arXiv 2506.07962, 2025-06. Les modèles les plus exacts ont les erreurs les plus corrélées.
5. « From Single to Societal », arXiv 2511.11789, 2025-11. Les agents à personas se conforment davantage à ceux qui partagent leur persona.
6. « The Chameleon's Limit », arXiv 2604.24698, 2026-04. Des agents à profils distincts convergent vers un comportement homogène.
7. « More Debate, Same Evidence », arXiv 2608.00243, 2026-08. Corrélations d'erreurs de 0,671 à 0,927 entre l'avocat et l'expert ; le sceptique se découple sur 2 jeux de données sur 4.

Ce que l'état de l'art fixe pour la Factory : voter plutôt que débattre, séparer les contextes, mêler les modèles, garder un rôle sceptique.

## 3 bis. Essai mesuré du 20/10/2026

**Protocole, fixé avant l'essai.** Le cas est la décision du 19/10 sur la lecture de messagerie Microsoft 365 (D-37 du registre `decisions/REGISTRE.jsonl`, n = 37). Il est rédigé dans `cas.md` à partir des faits de TF-1888 et TF-1889, sans la réponse humaine. Le bras A est une requête unique à Opus, 450 mots au plus. Le bras B réunit 5 agents en contextes séparés, 300 mots au plus chacun : contradicteur sur Opus, premiers principes sur Sonnet, expansionniste sur Haiku, regard extérieur sur Haiku, exécutant sur Sonnet. Aucun débat ni président : le vote est compté. Un agent `verificateur` sur Sonnet compte ensuite les considérations distinctes. Il reçoit les deux analyses sous les noms X et Y, sans savoir comment elles ont été produites.

**Résultats.**

| Mesure | Bras A, requête unique | Bras B, conseil de 5 |
|---|---|---|
| Recommandation | fiche et skill en lecture seule | fiche d'abord, skill conditionné : 4 voix sur 5 |
| Accord avec votre choix du 19/10, une fiche sans skill (TF-1889, « D-37 (b) ») | non | oui |
| Considérations distinctes sur 31 au total | 14, dont 4 propres | 27, dont 17 propres |
| Jetons des agents | 33 375 | 166 854, soit 5,0 fois plus |
| Plafond de longueur | 450 mots | 1 500 mots |

Parmi les 17 considérations propres au conseil, le compteur en retient 5 dont l'absence pourrait faire prendre une mauvaise décision : le connecteur lit des messageries que l'administrateur du client a refusé d'ouvrir ; « écritures exclues » n'est qu'une phrase ; le connecteur n'est peut-être pas présent dans une session sans interface ; on ignore sous quelle identité l'accès s'ouvre ; les corps d'emails stockés n'ont ni propriétaire ni purge. Parmi les 4 propres à la requête unique, le compteur retient les seuils qui feraient changer d'avis, et le lien avec votre demande « la plus automatisée ».

**Limites de l'essai.**

- Un seul cas : le résultat est un signal, pas une preuve.
- Le conseil disposait de 3 fois plus de mots ; une part des 17 considérations vient de la longueur et non de la pluralité.
- Le titre de Y annonçait « cinq contributions » : le compteur savait que Y était composite.
- Les consignes des agents n'ont pas été relues par la relecture d'intention avant leur lancement.
- Les 30 000 jetons environ de contexte fixe de chaque agent pèsent l'essentiel du coût, et non le raisonnement.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : réfutée. L'essai montre qu'une requête unique a laissé passer un risque de conformité et recommandé autre chose que votre choix. Le statu quo laisse chaque question ouverte arriver au bloc 3 avec ces angles manquants.
- **O1 — essai borné sur 3 décisions passées de plus, à longueur égale** : 3 arbitrages du registre dont la réponse humaine est connue, bras A au même plafond de 1 500 mots que le bras B, compteur aveugle aux deux noms. Coût : simple × court, environ 600 000 jetons. Exclut tout objet durable avant le résultat.
- **O2 — skill `conseil-avant-arbitrage` au pilot** : 5 agents séparés aux modèles mêlés, vote compté, synthèse qui ne tranche pas, lancé à la demande du porteur. Coût : moyen × moyen, environ 170 000 jetons par usage. Exclut le câblage automatique. Prématuré : il repose sur un seul cas.
- **O3 — câbler le conseil à chaque décision d'arbitrage du bloc 3** : chaque D-N au motif « arbitrage » reçoit un conseil avant affichage. Coût : complexe × long, environ 170 000 jetons par décision. Exclusion : heurte le seuil de 4 000 000 jetons par jour de l'essai de relecture d'intention, déjà approché le 19/10 avec 1 921 528 jetons.
- **O4 — importer le skill d'Apsodia** : exclue. Le fichier est distribué hors dépôt, sans code relisible, et ses garde-fous sont des consignes de prompt.

## 5. Verdict

- **Option retenue** : O1, un essai borné sur 3 décisions passées de plus, à longueur égale.
- **Coût** : complexité simple · durée court ; environ 600 000 jetons ; aucune dette, rien ne s'installe.
- **Candidature(s) émise(s)** : aucune nouvelle ; TF-1936 reste `candidat`, et cette étude lui est rattachée. Passer en `decide` reste votre décision.
- **Plan de revue** : 2026-11-03, ou au retour de l'essai O1 s'il revient avant. Si le conseil rejoint la réponse humaine plus souvent que la requête unique sur au moins 3 cas sur 4, et garde au moins 3 considérations propres à risque par cas à longueur égale, O2 s'instruit. Sinon, TF-1936 s'écarte.
- **Test rétro** :
  - Opérationnel : 3 essais à longueur égale.
  - Tactique : séparer le gain de la pluralité du gain de la longueur.
  - Stratégie : ne créer un objet durable que sur une preuve d'au moins 3.
  - Intention : savoir si la Factory gagne à faire délibérer plusieurs agents avant un arbitrage, sur des faits mesurés.
  - Question « Intéressant pour la Factory ? » : oui sur un cas, avec un coût 5 fois plus élevé ; à confirmer par O1.
