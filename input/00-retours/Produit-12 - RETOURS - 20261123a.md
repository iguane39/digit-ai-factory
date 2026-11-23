# Retours forges — Produit-12 — 20261123a

- **Contexte** : hors run — migration du produit vers le mécanisme unique de reprise (R-64, D-224 (a)) et rangement de son dossier du Drive au modèle D-238 (a), sur réponse « A1 » du porteur le 23/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 459 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

La migration du produit est faite et le Drive est au modèle, mais oracle-reprise rend FAIL sur un contrôle étranger au Drive. Le lot n'est pas remis par cette session : la consigne du porteur interdit d'écrire dans le pilot pendant ce tour.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-53 | mineur | générique | RP11 d'oracle-reprise (TF-2697) rend FAIL la migration de reprise d'un produit Windows en `core.autocrlf=true` : 116 fichiers suivis sur 2 657 s'extrairaient autrement dans un clone neuf. Le remède proposé (poser `* text=auto eol=lf`) demande de réextraire 1 814 fichiers en CRLF dans l'arbre de travail, dont des fichiers aux modifications non enregistrées. RP1 à RP10 et RP12 passent, et synchro-drive rend `a_jour` avec 0 écart. Preuve : ledger seq 458, 459 ; `git ls-files --eol` (1 814 `i/lf w/crlf`) | Sortir RP11 du verdict de reprise (constat séparé ou AVERT), ou livrer avec lui un geste de renormalisation qui épargne les fichiers modifiés |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le dossier CIBLES (9,2 Go) n'a pas de place au modèle D-238 | rangé à la main dans `donnees`, lu sur place par `poste.py`, hors de `elements` | non | propre au volume de ce produit |

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

`ranger-drive.mjs` a rangé le dossier en un passage après le déplacement de CIBLES, sans rien supprimer, et le passage réel `reprise --pousser` a envoyé canal, coffre et mémoire sans geste humain.

## Ordre recommandé

1. RS-53, parce qu'il bloque le verdict de reprise de tout produit Windows sans `.gitattributes`.

## La règle qui aurait évité le retour

- RS-53 : classe proposée, à créer au pilot : `juge-qui-mele-un-controle-hors-perimetre` (famille `contrat-interface-forge`), pour un juge dont le verdict dépend d'un contrôle étranger à ce qu'il juge.
