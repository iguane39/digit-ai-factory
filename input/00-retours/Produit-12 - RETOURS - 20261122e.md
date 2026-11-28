# Retours forges — Produit-12 — 20261122e

> Annoté par le pilot le 28/11/2026 (D-247 (a)) : les noms de 2 correspondants des clients du produit, en titre de documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : run — version 0.9.1, plan de fiabilisation des brouillons 20261122b, banc réel de rédaction P-6, 22/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 438 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

La version 0.9.1 fait enfin rédiger les brouillons par Claude. Le banc réel qui l'a jugée a trouvé un défaut qu'aucun test ni aucune revue n'avait vu : quand le modèle estime qu'aucune réponse ne convient, il l'écrit en prose, et le produit déposait cette prose comme brouillon.

## development (`digit-ai-forge-development`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-46 | majeur | produit+générique | Un traitement de rédaction par IA sans sortie de refus convenue rend, quand le modèle juge qu'aucune réponse ne convient, un commentaire en prose (« Pas de brouillon… », « Je ne rédige… »). Le produit le déposait comme brouillon : 7 rédactions réelles sur 20 au banc du 22/11, plus 2 textes ouverts sur une ligne « Objet : ». Une première consigne de refus trop large a fait passer les refus à 18 sur 20, le modèle invoquant la règle des échanges internes pour des expéditeurs externes. Preuve : ledger seq 438, 440 ; `backend/app/services/redaction.py` (`MARQUE_SANS_BROUILLON`) ; commit 7ade2dd | Le gabarit d'un traitement de rédaction par IA prévoit une sortie de refus convenue, une ligne marquée suivie d'un motif, que le produit reconnaît. Elle est bornée aux cas où personne ne lira la réponse. Le taux de refus se mesure sur un banc réel avant toute mise en production |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le smoke réinjectait le jeu de démonstration dans la même boîte simulée, qui reprend les mêmes identifiants de message : 0 appel réel au premier essai | boîte dédiée au pas réel, commit ae95b11 | non | propre au simulateur du produit |
| La mesure d'issues du matin comptait une même réponse pour plusieurs brouillons d'un fil (57 réécrits, 50 au rejeu prudent) | règle d'appariement par objet bornée aux envois qui ne répondent à aucun mail connu | non | écart déclaré au dossier de mise en production |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres Correspondant-A | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres Correspondant-B | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees Correspondant-A | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees Correspondant-B | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Le banc réel de 20 mails, rejoué par le code du produit et non par un script à côté, a trouvé en trois passages le défaut de RS-46 puis l'excès de sa première correction. Il a coûté 0,70 USD. Le corpus versionné de 14 cas fictifs qui en est tiré rejoue la rédaction et le classement pour 0,04 USD et rend le pan « prompts » mesurable.

## Ordre recommandé

1. RS-46, parce qu'il touche tout produit qui fait rédiger un texte par un modèle libre de refuser.

## La règle qui aurait évité le retour

- RS-46 : classe proposée, à créer au pilot : `redaction-ia-sans-sortie-de-refus` (famille `contrat-interface-forge`), pour un traitement de rédaction par IA dont le refus n'a pas de forme convenue, si bien qu'un commentaire du modèle part comme texte rédigé.
