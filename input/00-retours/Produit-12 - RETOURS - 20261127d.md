# Retours forges — Produit-12 — 20261127d

> Annoté à la réception (pilot, 27/11/2026) : les noms de 2 correspondants des clients du produit, en titre de 4 documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : hors run — application de D-248 (a), D-249 (a), D-250 (b) à la revue L99 du prompt « rapport d'analyse des brouillons », le 27/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 558 (entrée `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

Le déplacement d'une revue vers les archives a d'abord été tenté par une commande de déplacement brute, que le garde du poste a refusée avant exécution. Le script prévu a fait le geste avec sa trace. Le retour reste au produit.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : le garde existe et a refusé le geste comme prévu.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un `mv` de la revue L99 d'indice b et de son journal vers `output/old/` a été refusé avant exécution par le garde TF-2737 (seq 558) | `renommer-livrable.mjs` a déplacé la revue et son journal `.boucle.json` en une commande, trace au ledger seq 556 | non | propre au geste de la session ; le garde a joué son rôle |

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

Aucun garde-fou de plateforme relevé sur ce lot. Le garde de renommage des livrables (TF-2737), un garde de la Factory et non de la plateforme, a refusé un `mv` sous `output/` avant exécution ; le script qu'il désigne a fait le geste.

## Confirmations positives

Le script de renommage déplace aussi le journal de boucle avec la revue, et laisse un renvoi que le hook de restitution suit.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
