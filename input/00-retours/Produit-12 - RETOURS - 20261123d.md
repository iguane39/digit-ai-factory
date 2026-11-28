# Retours forges — Produit-12 — 20261123d

> Annoté par le pilot le 28/11/2026 (D-247 (a)) : les noms de 2 correspondants des clients du produit, en titre de documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : mise en production de la version 0.9.2 après le banc réel (D-240 (a)), 23/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 481 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : remis le 2026-11-23

---

La 0.9.2 est en production depuis le 23/11 à 22:50, au second envoi. Le premier envoi de la route de mise en production a été refusé parce qu'il portait tout le dépôt suivi.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-58 | mineur | générique | La commande de mise en production du gabarit, `railway up` sur l'arbre de `git archive <commit>`, envoie tout le dépôt suivi : 1,5 Go ici, presque tout dans `output/`. Le 23/11 à 22:48, l'envoi est refusé par une page d'erreur Cloudflare, sans déploiement créé. La 0.9.1 était passée le 22/11 avec le même volume. Les dossiers que `.dockerignore` exclut du build partent quand même à l'envoi. Réduit à 2,5 Mo en retirant ces dossiers, l'envoi de 22:50 passe (déploiement `cf33ff66`). Preuve : ledger seq 481 ; `forge/DOSSIER-MEP.md` section 22 | La route de mise en production réduit l'arbre envoyé aux fichiers du build, en appliquant `.dockerignore` à l'arbre de `git archive` ou en générant un `.railwayignore`, et distingue un refus d'envoi d'un échec de build |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La clé de recette reste illisible par la session | banc joué sur la clé de production, sur GO explicite du porteur, passée par un tube depuis `railway ssh` | non | déjà remontée en RS-55 au lot 20261123c |

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

Le contrôle après mise en production a confirmé en 13 points, dont un appel réel à Claude, ce que le banc avait mesuré.

## Ordre recommandé

1. RS-58, parce qu'un envoi refusé à la porte de production retarde une version déjà jugée.

## La règle qui aurait évité le retour

- RS-58 : classe proposée, à créer au pilot : `envoi-de-deploiement-sans-filtre-du-build` (famille `heritage-produit`), pour une route de déploiement qui envoie des fichiers que le build exclut.
