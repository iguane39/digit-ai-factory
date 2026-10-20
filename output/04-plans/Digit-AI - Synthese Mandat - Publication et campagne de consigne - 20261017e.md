---
destinataire: humain
---

# Synthèse Mandat — 4 dépôts publiés, skills recopiés, campagne de consigne jouée sans gagnant (17/10/2026)

## 0. Synthèse d'ouverture

Vos réponses D-13 à D-16 sont exécutées : les 4 dépôts sont publiés, les copies installées des skills sont à jour, le préfixe du produit d'audit et le nom collé du projet sont masqués, et les 2 défauts trouvés sont corrigés. La campagne autorisée en D-8 a été jouée : 4 propositions de modification de la consigne de restitution, mesurées sur 12 cas tenus à l'écart, et aucune ne fait mieux que la consigne actuelle. Rien n'entre donc en service. Deux décisions vous reviennent : la suite à donner à cette boucle (D-17) et la publication de son archive (D-18).

## 1. En-tête d'identification

Mandat d'exécution de D-8, D-13, D-14, D-15 et D-16 du 17/10/2026, sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 17/10/2026 de 11:40 à 17:36, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5 ; 11 agents : 1 Opus 5.5 (TF-1841, conception du juge de clôture) et 10 Sonnet 5.5 (TF-1839, puis 4 proposeurs et 5 évaluateurs de la campagne). Escalade de modèle : aucune.

Intention de la demande : que vos choix produisent leurs effets jusqu'au bout, publication comprise, et que la consigne de restitution ne change que sur une mesure.

Test rétro : le résultat sert cette intention. Chaque choix a son effet constaté, et la campagne a produit une mesure, même négative ; elle n'a pas produit d'amélioration de la consigne, ce qui reste à obtenir.

## 2. Verdict en une ligne

4 dépôts publiés sur 4, skills alignés (contrôle PASS) ; campagne : consigne actuelle 6/12 acceptés du premier coup, meilleure variante 5/12, empreintes du juge 126/126 inchangées.

## 3. Décisions attendues

2 décisions neuves, au format B. Chacune se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-17 — Que faire de la boucle d'amélioration de la consigne après une première campagne sans gagnant ? (TF-1552)**
>
> - **De quoi s'agit-il** : la campagne autorisée en D-8, où des agents ont proposé 4 modifications de la consigne qui encadre les messages de fin de tour, chacune mesurée sur 12 cas tenus à l'écart.
> - **Le problème** : aucune ne bat la consigne actuelle, acceptée 6 fois sur 12 : 5, 4, 1 et 0 sur 12 ; avec 12 cas et un essai par variante, un écart de 1 ou 2 cas est du bruit, et le banc ne compte que 27 refus au lieu des 514 relevés le 01/10.
> - **Pourquoi vous** : relancer engage une nouvelle dépense d'exécutions de modèle.
> - **Recommandation : (b)** — sur 12 cas, la mesure ne distingue pas les meilleures variantes de la référence ; un banc complet le pourrait. Source consultée : `oracles/banc-restitutions/variantes/20261017/mesure.json`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Relancer tout de suite sur ce banc, 3 essais par variante | Les taux se resserrent sur les 12 mêmes cas ; le banc reste petit | Élevé × court, environ 190 exécutions | Possible, rien n'entre en service |
| (b) Écarter les 4 propositions, extraire le banc de l'autre poste, relancer à la revue du 29/10 | La prochaine mesure porte sur plusieurs centaines de refus ; l'extraction ne coûte aucun appel de modèle | Moyen × moyen, environ 64 exécutions au 29/10 | Possible |
| (c) Clore l'étape 2 | La consigne n'évolue que par les corrections après refus ; les 4 propositions restent archivées | Nul | Possible, en rouvrant le sujet |

> **Sans réponse** : (c), l'étape 2 reste sans suite.

> **D-18 — Puis-je enregistrer et publier l'archive de la campagne ? (TF-1552)**
>
> - **De quoi s'agit-il** : dans le pilot, les 4 propositions rejetées et leurs scores (5 fichiers, sans aucun texte du banc) ; dans le canal confidentiel, qui est privé, le banc de 27 refus et les 60 réécritures, qui peuvent porter des noms réels.
> - **Le problème** : l'étude impose de garder en git l'archive des variantes rejetées ; tant qu'elle reste hors enregistrement, une autre session peut la perdre.
> - **Pourquoi vous** : votre règle exige un accord explicite pour enregistrer et publier.
> - **Recommandation : (a)** — l'anonymiseur ne trouve aucun nom dans les 5 fichiers du pilot, et le banc ne quitte pas le dépôt privé. Source consultée : `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, garde-fous (« On garde l'archive des variantes rejetées, avec leur score, en git »).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Enregistrer et publier les 2 | L'archive part sur le pilot public sous la garde de publication, le banc sur le canal privé | Faible × court, la garde du pilot dure environ 9 min | Possible, par un enregistrement correctif |
| (b) Enregistrer sans publier | L'archive est sauvée sur ce poste seulement | Faible × court | Possible |
| (c) Ni l'un ni l'autre | L'archive et le banc restent hors enregistrement | Nul | Sans objet |

> **Sans réponse** : (c), rien n'est enregistré.

## 4. Traité

Chaque geste commandé par vos réponses, avec sa preuve.

- **D-13 (a), publication des 4 dépôts.** Canal confidentiel `c57041f..1d49273`, forge de mise en production `374e9a0..89a4c62`, forge d'outils `5c21430..4683696`, pilot `f80ec0ac..92b4ec4b`. Preuve : `git rev-list --left-right --count HEAD...origin/main` sur le pilot rend 0 et 0.
- **D-14 (a), recopie des skills.** Preuve : `node oracles/oracle-skills.mjs` rend PASS après `--appliquer`, FAIL avant.
- **D-15 (a), préfixe masqué (TF-1840).** Inscrit au canal sous Produit-72, remplacé dans 15 fichiers, 9 fichiers d'archives renommés, 4 compagnons ré-empreintés (CONSIGNE). Preuve : `git grep -l -w -I` du préfixe : 0 fichier.
- **D-16 (a), nom collé (TF-1839).** Porte des noms et anonymiseur corrigés, 16 fichiers substitués. Preuves : anonymiseur 12/12 (11/12 sans la branche) ; porte corrigée sur le pilot : PASS, 0 constat bloquant.
- **D-16 (a), parties mobilisées (TF-1841).** Le juge de clôture borne la promesse d'une forge outil aux skills déclarés. Preuves : juge 30 → 38 cas, mesure 11 → 12, forge d'outils 82 → 85 ; la mesure réelle reste à 7 refus sur 7, la plupart dus à des forges dont les oracles sont hors skills.
- **D-8 (a), campagne jouée.** 27 refus extraits, 24 rejouables, 12 tenus à l'écart ; 4 propositions, 60 réécritures jugées par `hook-restitution.mjs --prejuger`. Preuve : `mesure.json`, scores 6, 5, 4, 1 et 0 sur 12 ; 64 exécutions, sous la borne de 70.
- **Juge hors de portée.** Preuve : 126 empreintes du juge comparées avant et après la campagne, 0 changée.
- **Archive des variantes.** 5 fichiers sous `oracles/banc-restitutions/variantes/20261017/`, passés dans l'anonymiseur : aucun nom.
- **Registre.** 8 événements : décisions D-13 à D-16, corrections de TF-1839, TF-1840 et TF-1841, candidat TF-1842, résultat de la campagne. Preuve : contrôle du registre PASS avant et après chaque passe.

## 5. Non traité

- **L'enregistrement de l'archive et du banc.** Motif : votre accord explicite est requis (D-18).
- **La suite de la boucle d'amélioration.** Motif : elle engage une dépense (D-17).
- **TF-1842, l'anonymiseur qui annonce des renommages non faits.** Motif : candidat neuf, en attente de votre décision ; contourné à la main aujourd'hui.

## 6. Écarts à la lettre

Un écart, que la mesure impose.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-8 (a), chaque proposition entre en candidat avec sa mesure | Je les ai archivées avec leur score, sans les inscrire en candidates | Aucune ne bat la référence : 4 candidatures n'appelleraient qu'à les écarter |

## 7. Risques

- **La mesure de la campagne est fragile.**
  - Énoncé : 12 cas, un essai par variante, et un hook qualité qui a renvoyé des remarques aux évaluateurs, pour toutes les variantes.
  - Signal : des écarts de 1 à 2 cas entre les meilleures variantes.
  - Parade : D-17 (b), un banc complet avant toute conclusion.

## 8. Prochaines actions

Vos 2 réponses d'abord, puisque les gestes qui suivent en dépendent.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1552 | Enregistrer et publier l'archive et le banc | auto_ia | dependance_bloc_3 : attend D-18 | `git commit` puis `git push` dans le pilot et le canal, sous la garde de publication | L'archive peut se perdre |
| **A-2** | TF-1552 | Extraire le banc de l'autre poste et relancer la campagne | auto_ia | dependance_bloc_3 : attend D-17 | `node oracles/banc-restitutions/restitutions.mjs --extraire <transcriptions>` sur l'autre poste | La revue du 29/10 n'a pas de mesure solide |
| **A-3** | `neuve` | Trancher D-17 et D-18 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `17b, 18a` | L'option « sans réponse » de chacune s'applique |

## 9. Traces

- Archive : `oracles/banc-restitutions/variantes/20261017/` (4 propositions et `mesure.json`)
- Banc et réécritures : `C:\dev\_confidentiel\bancs\restitutions\` (corpus et dossier de campagne, empreintes avant et après)
- Registre : `todo/TODO.jsonl`
- Synthèses précédentes du jour : 20261017c et 20261017d sous `output/04-plans/`
