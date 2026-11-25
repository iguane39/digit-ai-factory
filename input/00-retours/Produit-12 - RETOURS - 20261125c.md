# Retours forges — Produit-12 — 20261125c

- **Contexte** : hors run — vérification des pièces jointes déposées dans le Dropbox du cabinet, puis correction demandée par le porteur le 25/11/2026 (version 0.9.4)
- **Références ledger** : `forge\ledger.jsonl` seq 510 et 511 (entrées `type: retour`, destinataire produit)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

Les pièces jointes sont bien lues et écrites dans le Dropbox du cabinet, mais 77 des 100 dernières étaient des images de signature, et 18 des 23 vraies pièces partaient à trier. Les 2 défauts sont propres au produit et corrigés dans la 0.9.4, commit local 5a36132, en attente de mise en production (D-243).

## pilot (`digit-ai-factory`)

Aucun retour pour le pilot sur ce lot : les défauts tiennent à la relève et au référentiel du produit, pas à une forge.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Images de signature intégrées au corps (Content-ID cité par `cid:` dans le HTML, sans disposition `attachment`) relevées comme pièces jointes : 77 des 100 dernières pièces rangées, 310 fichiers déposés depuis le 09/11 (seq 510) | 0.9.4 : une partie que le corps HTML affiche n'est plus une pièce (E-134) ; sur 13 mails réels, 20 pièces avant et 10 après, aucune vraie pièce perdue | non | propre à la relève du produit |
| 18 des 23 vraies pièces sous `_A_TRIER` : propriétaires rangés sous un regroupement (HAPPY, SOLIMA) absents du référentiel, et nom cité par la pièce ignoré quand l'expéditeur ne relie le mail à rien (seq 511) | 0.9.4 : propriétaires regroupés lus, hors mandats clos (E-135, 441 → 698) ; fiche désignée par le nom de fichier puis l'objet, mots de document exclus (E-136) ; rejeu sur 100 pièces : 4 rangées chez leur fiche, 0 mal placée | non | propre au référentiel du produit |

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

Le rangement à la norme de la 0.9.0 tient en production : chaque pièce relevée depuis le 09/11 est déposée, aucune n'est écrasée, et les pièces d'un mail relié vont dans le bon sous-dossier du locataire.

## Ordre recommandé

Aucun retour à ordonner pour le pilot sur ce lot.

## La règle qui aurait évité le retour

Sans objet : aucun retour pour le pilot.
