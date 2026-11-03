---
destinataire: humain
---

# Synthèse Mandat — les 18 gabarits de lecture tiennent la règle de largeur, D-154 exécutée (03/11/2026)

## 0. Synthèse d'ouverture

Votre choix est appliqué : les 18 gabarits de documents déclarent leur colonne de lecture, et les 20 instances de référence passent le contrôle de rendu, contre 18 en défaut hier. La largeur de lecture n'a pas changé. Le harnais complet du pilot n'a plus aucun rouge lié à ce sujet. Il en garde 3, tous venus du travail en cours d'autres sessions du poste, qui se lèveront quand elles l'enregistreront. Rien n'attend de décision de votre part. Le remplacement de la consigne page HTML sur vos 2 comptes attend toujours votre geste.

## 1. En-tête d'identification

Exécution de votre réponse « 154a » du 03/11/2026 à la synthèse 20261103b, sur le pilot `digit-ai-factory`. Période : 03/11/2026 de 10:26 à 11:47, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 et 1 relecteur d'intention.

Intention de la demande : rendre les gabarits de lecture conformes par la déclaration de colonne, sans toucher à leur largeur de lecture ni à la règle.

Test rétro : le résultat sert cette intention. Le contrôle de rendu passe sur toutes les instances, et ni la règle ni la mise en page n'ont bougé.

## 2. Verdict

TF-2066 est clos. Mesuré sur : `scripts/verifier-rendu-instances.mjs`, joué de 10:32 à 10:36, périmètre les 20 instances de `gabarits/documents/`. Le pilot est publié, 0 commit d'écart à 10:37.

## 3. Décisions attendues

Rien n'attend de décision de votre part dans ce tour.

## 4. Traité

Chaque chiffre ci-dessous vient d'une commande que j'ai jouée dans ce tour.

- **Colonne déclarée** (D-154 (a), pilot ffb2a0df) : le corps de chacun des 18 gabarits porte `data-colonne-ok`, dans son instance et dans son squelette. Premier rejeu : 13 instances réparées, 5 encore en défaut.
- **Bloc d'en-tête des 5 restants** : ces 5 gabarits ont un bloc d'en-tête de lecture (`.tete`) placé hors du corps, et eux seuls. Il porte la même déclaration, qui relève du même choix. Rejeu : `verifier-rendu-instances` 20 PASS, 0 FAIL.
- **Oracle des gabarits** : `oracle-gabarits-documents` exit 0, et son self-test 63/63.
- **Harnais complet** : joué de 10:37 à 11:43, 3 oracles sur 242 en défaut, aucun lié à la largeur. Les 3 sont des états du parc : copies de skills en retard sur 9 modifications non enregistrées de forge-agents, un README neuf d'`input`, une note scellée en cours de modification par une autre session.

Relecture d'intention : sert, gravité mineure, 1 écart, verdict consigné sous RI-20261103-09 ; l'écart porte sur des livrables d'une autre session vus dans le dépôt partagé.

## 5. Non traité

- Les 3 défauts d'état du parc relevés par le harnais — motif : `hors_mandat`, ils viennent du travail en cours d'autres sessions, et les corriger à leur place écraserait ce travail.
- Le remplacement de la consigne page HTML sur vos 2 comptes (TF-1991) — motif : `acces`, voir A-1.

## 6. Écarts à la lettre

- D-154 parlait d'un attribut sur le corps de chaque gabarit → je l'ai posé aussi sur le bloc d'en-tête de 5 d'entre eux → sans cela, ces 5 restaient rouges pour la même raison, et la décision n'était tenue qu'à moitié.

## 7. Risques

- **Contrôle de largeur levé sur ces documents** : un gabarit de lecture qui deviendrait vraiment trop étroit ne serait plus signalé par V23 (contenu sur 75 % au moins d'une fenêtre large).
  - Signal : une instance qui paraît perdue au milieu d'un grand écran.
  - Parade : la limite de 135 caractères par ligne reste jugée, et retirer l'attribut rétablit le contrôle.

## 8. Prochaines actions

Ordre : votre geste d'abord, car lui seul reste hors de ma portée.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Remplacer la consigne page HTML sur vos 2 comptes, pour que les sessions hors dépôt lisent les bonnes polices | TF-1991 | manuelle_utilisateur | `acces` : API de la plateforme https://api.anthropic.com/v1/skills HTTP 401 et https://claude.ai/api/skills HTTP 403, relevés le 02/11/2026 ; identité de la session sans clé ; aucune identité de service ; script du dépôt `sync-skills.mjs` 0 mention du compte | suivre le guide de la synthèse 20261102k | si rien n'est fait, un brief écrit hors du dépôt peut reprendre Roboto et DM Sans |
| A-2 | Corriger les restes ouverts : recette qui écrit le registre d'observabilité, registre des mutants périmé, candidat de chemin jamais développé | TF-2067, TF-2068 | auto_ia | `hors_mandat` : ouverts au tour précédent, hors de votre réponse | instruire et traiter ces candidats par R-58 (seules dépense, publication, irréversible, doctrine et arbitrage reviennent à l'humain) | si rien n'est fait, le registre des mutants ne sert plus de référence |

## 9. Traces

- Registre : `todo/TODO.jsonl` ; relecture dans `todo/relectures-intention.jsonl`.
- Pilot : commit ffb2a0df.
