# Retours forges — Produit-12 — 20261123b

- **Contexte** : run — synthèse de la première journée des brouillons rédigés par Claude en production (0.9.1), 23/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 460 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

Le job qui mesure l'usage des brouillons n'a jamais tourné au planificateur depuis sa mise en production. Sa période n'est pas semée en base et le code la lit avec un défaut forcé à 0 ; l'écran de supervision affiche pourtant 1 440 minutes.

## development (`digit-ai-forge-development`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-54 | majeur | générique | Un job planifié ajouté après la migration initiale n'est jamais échu. Sa période `periode_issues_minutes` vit dans le dictionnaire `DEFAUTS` mais n'est semée par aucune migration ; les 4 périodes plus anciennes le sont par `0001_init.sql`. `Job.periode_minutes` appelle `lire_entier(cle, 0)`, qui transmet « 0 » comme défaut et court-circuite `DEFAUTS`. Période 0, job jamais échu. L'écran de supervision lit `tous()`, qui fusionne `DEFAUTS`, et affiche 1 440 : le défaut est invisible. En production, aucun passage planifié du 22/11 16:26 UTC au 23/11 19:22 UTC ; mécanisme rejoué en local. La suite de tests ne joue jamais le planificateur sur une base neuve migrée. Preuve : ledger seq 460, 464 ; `backend/app/planificateur.py` l. 37-38, `backend/app/services/parametres.py` l. 36-49 | Le gabarit de développement exige, pour tout job planifié, un test qui migre une base neuve et constate le job échu au premier tick. Un paramètre lu par le code se lit sans défaut forcé, ou sa valeur se sème dans la migration qui l'introduit |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Forme des brouillons de Claude : en-tête « réponse incomplète » sous 5 formes dans 10 brouillons sur 15, Markdown dans un dépôt en texte brut, cabinet en copie traité comme destinataire | non corrigée, décision D-239 posée au porteur | non | propre à la consigne de rédaction du produit |
| Issue des brouillons non exposée brouillon par brouillon dans l'API | non corrigée, proposée dans la synthèse du 23/11 | non | propre au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres BERNARD | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres SAS CREER PROMOTION | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees BERNARD | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees SAS CREER PROMOTION | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Le bilan des passages par job, ajouté en 0.9.1 (P-11), a rendu le défaut visible en une lecture : le dernier passage du job des issues restait la relance manuelle de la veille.

## Ordre recommandé

1. RS-54, parce qu'un job planifié qui ne tourne pas ne produit ni erreur ni alerte, et que la supervision affiche la période attendue.

## La règle qui aurait évité le retour

- RS-54 : classe proposée, à créer au pilot : `job-planifie-jamais-echu-faute-de-periode-semee` (famille `regle-morte`), pour un traitement planifié dont la période, absente de la base, est lue avec un défaut forcé et rend le job jamais échu, sans erreur ni alerte.
