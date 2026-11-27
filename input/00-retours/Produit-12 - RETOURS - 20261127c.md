# Retours forges — Produit-12 — 20261127c

> Annoté à la réception (pilot, 27/11/2026) : les noms de 2 correspondants des clients du produit, en titre de 4 documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : hors run — revue L99 en mode boucle du prompt « rapport d'analyse des brouillons », demandée par le porteur le 27/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 550 (entrée `type: retour`, destinataire forge-agents)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : à remettre

---

Le journal d'une boucle L99 a échoué à son oracle sur une forme que la procédure de la boucle ne montre pas. Le défaut a coûté une écriture du journal de plus, sans toucher au fond de la revue.

## forge-agents (`digit-ai-forge-agents`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-60 | mineur | générique | `oracle-boucle-l99.mjs` (règle B10) exige des nombres pour `verification_cloture.clotures` et `verification_cloture.defauts_crees`. `references/boucle.md`, étape 1 bis, nomme ces clés sans dire qu'elles sont des nombres, et l'exemple de journal ne montre pas `verification_cloture`. Un journal qui y range la liste des clôtures rend FAIL B10 sur les passes 2 et 3. Preuve : ledger seq 550 ; journal `output/Produit-12 - Revue - Prompt rapport des brouillons passé au crible L99 - 20261127b.md.boucle.json`, PASS après déplacement des listes vers `detail_clotures` et `detail_defauts_crees` | L'exemple de journal de `boucle.md` montre `verification_cloture` avec `clotures` et `defauts_crees` en nombres, et la liste détaillée sous une clé voisine |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

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

Le jugement apparié a tranché sans ambiguïté : aux passes 2 et 3, les 4 relecteurs ont préféré la version corrigée, avec 17 à 28 points d'écart. Les vérificateurs de clôture ont relevé 7 défauts créés par les corrections, tous recomptés et corrigés avant la relecture aveugle.

## Ordre recommandé

RS-60 seul sur ce lot.

## La règle qui aurait évité le retour

L'exemple d'un journal montre chaque clé que l'oracle juge, avec son type. Classe proposée : `exemple-de-journal-sans-cle-jugee` (famille `heritage-produit`), « Un exemple de journal omet une clé que son oracle juge, ou son type ».
