# Retours forges — Produit-12 — 20261125d

- **Contexte** : hors run — route à porte de la version 0.9.4 jusqu'au dossier de MEP, sur la réponse « 243a » du porteur le 25/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 521 (entrée `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

La route à porte de la 0.9.4 passe : oracle de MEP 5 sur 5, forge_tests PARTIEL identique à la 0.9.3, 0 constat nouveau. Le seul accroc du tour est une commande d'effacement que le garde-fou du poste a refusée avant exécution, comme prévu.

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : le garde-fou a refusé une commande mal écrite par la session, et la commande du dossier de MEP n'efface rien.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La préparation du build M-1 commençait par un `rm -rf` dont la cible passait par une variable ; le hook garde-rm-variable l'a refusé avant exécution (seq 521) | commande réécrite avec le chemin en entier, sans effacement, sur un dossier neuf | non | propre à la session, le garde-fou a joué son rôle |

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

La route à porte se rejoue sans friction d'une version à l'autre : l'arbre réduit aux fichiers du build, retenu le 23/11, a donné une image de 2,5 Mo du premier coup, et le retour arrière sans migration se prouve en servant l'image précédente sur la base du staging.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
