# Retours forges — Produit-79 — 20261112b

- **Contexte** : série de relais Claude et Codex du 12/11/2026 sur les campagnes Meta de novembre ; en régénérant la fiche de relecture remise à l'exploitant, la session a trouvé que la version précédente citait des textes aux caractères corrompus, et qu'aucun contrôle ne l'avait vu
- **Références ledger** : `forge\ledger.jsonl` seq 1196 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Un document en Markdown peut citer des dizaines de lignes au texte corrompu (UTF-8 relu comme Windows-1252) et passer l'oracle d'écriture.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-27 — texte corrompu non vu par l'oracle d'écriture | moyen | générique | 12/11/2026 vers 10:53 : la fiche `output/06-rapports/Produit-79 - Fiche - Campagnes Codex de novembre à relire - 20261112d.md`, générée par script depuis un JSON réécrit à 10:50 en encodage corrompu, cite 69 lignes du type « ðŸŽ„ DÃ‰CEMBRE SE PRÃ‰PARE MAINTENANT. ». `oracle-ecriture.mjs` l'a jugée PASS (2981 mots) et le hook d'écriture n'a rien signalé ; la fiche a été remise à l'exploitant pour validation. Le défaut a été vu à 12:06, en comparant le JSON source à sa version corrigée. Mesure après correction : `grep -c "Ã\|ðŸ"` rend 69 sur l'indice d, 0 sur l'indice f. | Règle qui aurait évité le retour : aucune exécutée ; classe à créer `texte-corrompu-non-detecte` (famille `hook-ou-gate`). Proposition : l'oracle d'écriture, ou le hook qui le joue, accuse toute séquence typique d'un UTF-8 relu en Windows-1252 (« Ã© », « Ã¨ », « Ã  », « â€ », « ðŸ ») hors bloc de code. Le contrôle est une recherche de motifs, sans faux positif attendu sur un texte français. |

## Rattachement

Registre interrogé le 12/11/2026 : `node -e` sur `todo\CLASSES.json` du pilot, filtre des classes dont le texte répond à `/encod|mojibake|caractères corrompus/i` → 1 ligne trouvée. Cette classe, `porte-cle-courte-sans-frontiere`, cite des « blobs encodés », sans rapport avec ce défaut.

Aucun item recoupé.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fiche indice d citait les textes corrompus, et ses verdicts portaient sur une version plus ancienne des textes | corrigée le 12/11 à 12:11 : fiche régénérée depuis le lot corrigé 20261113a (indice f, 0 ligne corrompue), indice d rangé sous `old` | oui pour le contrôle d'encodage, remonté en RP-27 ; non pour le reste | corrigée au produit, le contrôle remonte en RP-27 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot ; verdicts repris du lot 20261112a, pas encore reçu par le pilot :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La comparaison pixel à pixel des 40 images corrigées avec leurs originales a borné le changement à la seule bande du pied : la vérification d'une retouche en série se prouve par une mesure, sans regarder les 40 images une à une.
