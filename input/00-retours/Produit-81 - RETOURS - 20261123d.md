# Retours forges — Produit-81 — 20261123d

- **Contexte** : support de présentation Design Authority de Produit-81 (indice f du 23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 46 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-33 (majeur) — Une règle du référentiel ADR citée comme en vigueur après son retrait

**Le fait.** Le 23/11/2026, le porteur indique que Python n'est plus une règle Client-A depuis la mise à jour des ADR. Le support Design Authority de Produit-81 (indices a à e) soumettait pourtant la décision D1 comme une dérogation à ADR0709 (« Python côté serveur »), d'après l'ADR local ADR-GXY-101 et le catalogue ADR du projet commun (version du 17/08/2026). Recherche faite le 23/11 : aucun dépôt du poste ne porte cette mise à jour, y compris le projet commun tiré le jour même.

**Le coût, prouvé.** Une décision sans objet présentée à la séance, relevée par le porteur. Un indice de plus (f), et une action du plan de remédiation (REM-ADR0709) qui restait ouverte à tort.

**La règle qui aurait évité le retour.** Un livrable qui cite une règle du référentiel ADR Client-A en donne la version et la date ; une mise à jour du référentiel est versée au projet commun avant d'être citée, pour que les produits la lisent au lieu de la reprendre de leurs propres ADR. **Rattachement proposé** : famille `donnees-perissables-en-dur`, voisine de la clé `etat-d-infrastructure-repris-de-la-documentation` proposée par RT-29 (lot 20261123a) ; ici, c'est le référentiel qui a changé hors des dépôts.

**Juge proposé.** Contrôle de livrable de synthèse : chaque identifiant ADR cité est retrouvé dans la dernière version datée du catalogue du projet commun ; un ADR absent, ou dont le texte a changé depuis la version citée, est signalé.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes). La plus proche, `compte-cite-en-dur-perime`, vise un compte cité en dur ; ici c'est une règle de référentiel. Rattaché à la clé proposée par RT-29, dans l'attente de sa création (`classe-a-creer`).

## Remarques restées au produit

- Statut d'ADR-GXY-101 (dérogation devenue sans objet) et ligne C# d'ADR-GXY-102 à mettre à jour dans `docs/adr/` — généralisable : non (documents propres à Produit-81).

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
