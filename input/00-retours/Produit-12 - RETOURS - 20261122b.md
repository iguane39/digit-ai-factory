# Retours forges — Produit-12 — 20261122b

- **Contexte** : autre — revue L99 du prompt de diagnostic et de plan de la chaîne des brouillons, 22/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 412 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Un nom de livrable hors registre est passé par tous les contrôles du tour qui l'a écrit ; seule la conformité de projet, jouée après coup, l'a vu.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-39 | mineur | produit+générique | Le statut des brouillons remis le 22/11/2026 à 10:19 porte le type « Statut », absent du registre des types (41 types). `oracle-conformite-projet.mjs --regles R-25` rend FAIL sur ce fichier. Pourtant, dans le tour qui l'a écrit, l'oracle d'écriture a rendu PASS, le préjugement de restitution a rendu la sortie 0, et le hook de fin de tour a accepté la ligne « Livré ». Aucun des trois ne lit R-25. Preuve : ledger seq 412, sortie de `oracle-conformite-projet.mjs . --regles R-25,R-4` du 22/11/2026 | Juger R-25 et R-4 sur chaque fichier que la ligne « Livré » d'une restitution lie, dans le préjugement et dans le hook de fin de tour. Aujourd'hui, la règle n'est jugée qu'à la conformité de clôture, quand le nom ne se change plus |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un accent grave dans un texte passé en ligne de commande a exécuté une commande en lecture (`railway ssh`, sans effet) et amputé le texte | texte réécrit par l'outil d'écriture | non | déjà couvert par la leçon L-003 du registre, rappelée par le hook avant la commande |

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

Le juge des lots a refusé le lot 20261122a tant que ses documents mûrs n'étaient pas déclarés, puis l'a remis au sas : la porte a tenu.

## Ordre recommandé

1. RS-39, parce que le contrôle existe déjà dans la conformité de projet et qu'il suffit de le jouer plus tôt.

## La règle qui aurait évité le retour

RS-39 ne suit pas un retour humain : la session l'a trouvé en jouant la conformité. La règle existe, R-25, mais aucune porte du tour ne la joue. Classe proposée, à créer au pilot : `type-de-livrable-juge-seulement-a-la-cloture` (famille `hook-ou-gate`) — le type d'un livrable daté n'est jugé que par la conformité de clôture, et un nom hors registre passe tous les contrôles du tour qui l'écrit.
