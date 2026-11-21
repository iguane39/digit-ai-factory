# Retours forges — Produit-79 — 20261120a

- **Contexte** : suspension des empreintes de caution Beds24 et Stripe le 20/11/2026, diagnostic et décision D-998, sur un poste dont l'arbre avait 387 commits de retard sur origin/main
- **Références ledger** : `forge\ledger.jsonl` seq 1246, 1248, 1249 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Trois retours : deux outils du pilot qui lisent ou refusent mal le ledger du produit, et un guide de réglage de paiement prescrit sans mesure de son effet.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-224 — `reserver-decision.mjs` réserve sur un arbre en retard | majeur | générique | 20/11/2026 vers 21:04 : `reserver-decision.mjs --essai` a proposé D-990 en lisant `forge/ledger.jsonl` de l'arbre local, dont la dernière seq est 1181. `git show origin/main:forge/ledger.jsonl` porte déjà D-993 à D-997 et la seq 1242. L'arbre avait 387 commits de retard ; `git merge --ff-only` était bloqué par 12 fichiers recopiés par l'ouverture. Sans relecture du distant, D-990 serait sortie en doublon. | Règle qui aurait évité le retour : aucune exécutée. Proposition : prendre le maximum des D-N et des seq sur l'arbre et sur `origin/<branche>` après `git fetch`, ou refuser la réservation quand l'arbre est en retard. |
| RP-225 — `ledger.py` refuse `action_externe` | mineur | générique | 20/11/2026 vers 21:05 : `python forge/ledger.py action_externe --essai …` répond « type inconnu : action_externe ». Le produit utilise ce type pour tout geste sur une plateforme tierce (seq 843 du 27/10). Les seq 1243 et 1244 ont été écrites à la main. Même défaut que la seq 1180 du 12/11 pour `fusion` et `push`. | Ajouter `action_externe` et `constat` aux types de `ledger.py`, ou nommer le type qui les remplace. |
| RP-226 — réglage de paiement prescrit sans mesure de son effet | bloquant | générique | Le guide du 14/10 (`output/06-rapports/Produit-79 - Rapport - Synthèse caution par gîte - 20261014f.md`, étape 6) prescrivait des empreintes renouvelées à J+3, J+7 et J+11, avec une validité supposée de 7 jours. Mesure Stripe du 20/11 : 4 empreintes sur 6 tiennent 30 jours ; Beds24 ne libère jamais la précédente ; les renouvellements partent après le départ. Le 20/11, 2 600 € restaient bloqués sur 3 cartes, dont 400 € posés 5 jours après le départ. Le retour du 10/11 (seq 1181) n'a pas été vérifié avant les renouvellements suivants. | Règle qui aurait évité le retour : aucune exécutée. Proposition : tout guide qui prescrit un réglage de paiement chez un tiers porte la réservation test et la relecture mesurée de son effet (statut, durée de validité, annulation de la précédente) comme porte avant mise en service. |

## La règle qui aurait évité le retour

- RP-224 et RP-225 : aucune règle exécutée ne couvre ces cas.
- RP-226 : aucune règle exécutée. Classe à créer : clé `reglage-de-paiement-tiers-prescrit-sans-mesure`, famille `skill-ou-oracle-non-invoque`, libellé « Réglage de paiement chez un tiers prescrit sans réservation test ni relecture mesurée de son effet ».

## Rattachement

Registre interrogé le 20/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre `/reserver-decision|action_externe/i` → 14 ligne(s) trouvée(s).

Items recoupés :

- TF-1911 et TF-1939 (candidats) : une D-N réservée puis reprise par une autre session ; cause voisine, mais pas l'arbre en retard sur le distant. RP-224 s'y rattache sans les recouvrir.
- TF-1872 et TF-1961 (corrigés) : sans rapport avec le type `action_externe`.
- Aucun item ne couvre RP-225 ni RP-226 : ils entrent en candidats neufs.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui, et pourquoi cela remonte ou non.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Empreintes de caution répétées (seq 1246) | 24 réservations marquées `SANSEMPREINTE` par l'API Beds24, 24 sur 24 relues ; solution durable posée en D-998 | oui | remonté en RP-226 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il porte le texte d'un e-mail Beds24 propre aux gîtes de ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, déjà déclaré au lot 20261110a, pour la même raison.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, déjà déclaré au lot 20261110a : il instancie la famille proposée en RP-15 (lot 20261017c).

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le refus du hook `fichiers-env` sur un `sed` de `.env` a orienté vers `env-masque.mjs --cles` : la liste des clés est sortie sans qu'aucune valeur entre dans la transcription.
