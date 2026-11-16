# Retours forges — Produit-79 — 20261113a

- **Contexte** : le 13/11/2026, l'exploitant demande de relancer le relais avec Codex pour améliorer les textes des publications de novembre. Claude écrit le ticket T-2026-1113-001, puis veut corriger un chiffre faux de son contexte avant le premier commit.
- **Références ledger** : `forge\ledger.jsonl` seq 1240 (entrée `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

La garde de la file traite un ticket que son auteur n'a encore remis à personne comme un ticket de l'autre agent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-36 — garde de la file qui bloque l'auteur avant remise | mineur | générique | Le 13/11/2026, `queue/local/guard.sh` (hook PreToolUse sur l'édition) a refusé à Claude de corriger son propre ticket `queue/tickets/a-faire/T-2026-1113-001.md`, encore non suivi par git : « GUARD: édition d'un ticket non réclamé ». Le contexte du ticket portait un chiffre faux (« piscine » 7 fois au lieu de 5 sur 7 textes Facebook). La seule voie a été de supprimer le fichier et de le réécrire en entier, 118 lignes. | Règle qui aurait évité le retour : aucune au référentiel ; classe à créer `garde-file-bloque-auteur-avant-remise` (famille `hook-ou-gate`). La garde laisse passer l'édition d'un ticket de `a-faire/` que `git ls-files` ne connaît pas encore : tant qu'il n'est pas commité, il n'est remis à aucun agent. |

## Rattachement

Registre interrogé le 13/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des entrées dont le texte répond à `/(guard|garde).{0,80}(ticket).{0,80}(réclam|claim|non commit|auteur)/i` → 0 ligne trouvée.

Aucun item recoupé.

## Remarques restées au produit

Sur ce lot, aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot ; verdicts repris du lot 20261112i :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `check-ticket.sh` a rendu son verdict en moins d'une seconde, et `relais.mjs attendre` a rendu la main à 9 minutes comme annoncé, code 4.
