# Retours forges — Produit-79 — 20261113b

- **Contexte** : revue L99 du message de l'exploitant sur le relais Claude et Codex de la file, le 13/11/2026 ; pendant la revue, la garde de la file a refusé une écriture de Claude sans rapport avec un ticket
- **Références ledger** : `forge\ledger.jsonl` seq 1241 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## digit-ai-queue (`digit-ai-queue`)

La garde de claim bloque toute écriture d'un agent dès qu'un autre agent a laissé un ticket non commité, même quand l'écriture ne touche pas la file.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-37 — garde de claim qui bloque des écritures hors de la file | mineur | générique | 13/11/2026 vers 15:50 : un Edit de Claude sur un fichier du dossier temporaire de la session, hors du dépôt, a été refusé par le hook PreToolUse `queue/local/guard.sh`, qui appelle `queue/protocole/scripts/guard-claim.sh`. Message : « GUARD: changements non commités dans tickets/ — un claim doit être commité avant tout travail ». Cause : Codex venait d'écrire `queue/tickets/a-faire/T-2026-1113-004.md`, commité à 15:51:03. Les deux Edit suivants sont passés quelques secondes plus tard. | Règle qui aurait évité le retour : aucune exécutée ; classe à créer `garde-de-file-sans-regard-sur-la-cible` (famille `hook-ou-gate`). Proposition : la garde lit la cible de l'outil et ne bloque que les écritures sous `tickets/` ou `recus/`, ou hors du ticket réclamé par l'agent. |

## Rattachement

Registre interrogé le 13/11/2026 vers 15:59 : lecture de `todo\CLASSES.json` du pilot, filtre des classes dont le texte contient « garde », « hook trop », « bloque à tort » → 10 lignes trouvées, aucune sur une garde qui ignore la cible de l'écriture.

Items recoupés : aucun.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le relais Claude et Codex n'écrit aucun signe de vie : arrêts invisibles des deux côtés | non corrigée au 13/11 : la revue L99 du jour prescrit le run de refonte | oui pour la présence et la vue d'état, que la refonte propose en demande au dépôt digit-ai-queue | reste au produit jusqu'au run, la partie générique partira en demande |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La file a tenu son verrou par commit sur 9 tickets du 12 au 13/11 : aucun ticket réclamé deux fois.
