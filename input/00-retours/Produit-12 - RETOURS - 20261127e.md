# Retours forges — Produit-12 — 20261127e

> Annoté à la réception (pilot, 27/11/2026) : les noms de 2 correspondants des clients du produit, en titre de 4 documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : hors run — cycle planifié de la boucle d'amélioration des brouillons, le 27/11/2026 à 15:00 (tâche « Produit-12 - Boucle brouillons »)
- **Références ledger** : `forge\ledger.jsonl` seq 560 à 566 (entrées `type: retour`, destinataire produit pour 560 à 565, pilot pour 566)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : remis le 2026-11-27

---

Le cycle a relevé la production, relu les brouillons tranchés et trouvé trois défauts de rédaction nouveaux. Il a aussi mesuré que les accusés courts servent plus que les autres brouillons. Ces constats restent au produit. Un seul retour va au pilot : l'écrivain du ledger ne sait pas rectifier un fait faux d'un retour.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-61 | mineur | générique | Le 27/11/2026 à 15:10, une heure fausse du retour seq 562 (09:43 au lieu de 08:43) n'a pu se corriger que par un nouveau retour (seq 565). `forge/ledger.py`, copie du gabarit du pilot, refuse « rectification_retour » comme type inconnu, alors que ce ledger l'a employé le 01/10/2026 (seq 222). Ses rectifications par ajout couvrent les versions de forges, le `run_open`, l'horodatage, les forges mobilisées et les doublons, pas le champ d'un retour. Preuve : ledger seq 222, 562 et 565 ; sortie « type inconnu : rectification_retour » | Un type `rectification_retour` (`seq_vise`, `champ`, `valeur`, `cause`) dans `gabarits/ledger.py` et `ledger.mjs`, que le compilateur de lots applique au retour visé |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le brouillon 240 confirme un rendez-vous à la place de la gestionnaire, sans rien connaître de son agenda ; troisième engagement non tranché après 225 et 230 (seq 560) | pas encore : proposition P1, consigne de rédaction, corpus R-20, décision D-251 | non | propre à la consigne de rédaction du produit |
| Le brouillon 237 vouvoie et salue par prénom et nom une partenaire que la gestionnaire tutoie dans le même fil, comme le 234 (seq 561) | pas encore : proposition P2, corpus R-21, décision D-251 | non | propre à la consigne de rédaction du produit |
| Le brouillon 238 répond à un mail adressé d'abord à un collègue du cabinet ; la garde E-141 ne joue que pour une boîte en copie (seq 562, heure rectifiée seq 565) | pas encore : proposition P3, règle de dépôt, corpus R-22, décision D-251 | non | propre à la règle de dépôt du produit |
| Les accusés courts donnent 2 brouillons utilisés sur 10, contre 5 sur 51 pour les autres ; l'option (a) de D-247 aurait fait baisser le taux de 0,115 à 0,098 (seq 563) | recommandation de D-247 passée de (a) à (b) ; indicateur des accusés courts proposé pour le relevé de la boucle | non | propre aux règles du cabinet et à la mesure de la boucle |
| `uv run pytest` est refusé par la stratégie de contrôle d'application du poste ; `uv run python -m pytest` démarre (seq 564) | pas encore : commande à corriger dans les documents du produit, ou exécutable à autoriser | non | propre au poste |

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

Aucun garde-fou de plateforme relevé sur ce lot. Le refus de `pytest` vient de la stratégie de contrôle d'application du poste, pas d'une plateforme.

## Confirmations positives

Le premier cycle lancé par la tâche planifiée a tourné sans intervention : relevé en lecture seule, code 0, fenêtre reprise à la fin du relevé précédent. Le brouillon 232, parti retouché, confirme la correction E-139 de la 0.9.5 : la gestionnaire a gardé l'accusé et retiré la règle inventée.

## Ordre recommandé

RS-61 seul, sans dépendance.

## La règle qui aurait évité le retour

Toute entrée de ledger qui peut porter un fait faux a sa rectification par ajout, nommée dans l'écrivain.

Classe proposée au pilot : `retour-de-ledger-sans-rectification-par-ajout` (famille `tracabilite-ledger`), un fait faux d'une entrée retour du ledger n'a aucun type de rectification par ajout dans l'écrivain.
