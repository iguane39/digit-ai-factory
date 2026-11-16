# Retours forges — digit-ai-marketing — 20261112k

- **Contexte** : autre — mise à jour de la ligne éditoriale LinkedIn le 12/11/2026, après un échange du dirigeant avec une session Codex, et question du dirigeant : « Codex a fini mais tu n'as pas repris automatiquement, pourquoi ? ».
- **Références ledger** : `forge\ledger.jsonl` seq 773 et 774 (entrées `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 9 réponses du dirigeant appliquées ou mises en décision, environ 2 minutes entre la sortie de Codex, écrite à 17:53, et la reprise, relevée à 17:55 après la question du dirigeant. Ce lot remonte 2 retours, tirés de 2 entrées du ledger, au pilot et à 1 forge.

---

## digit-ai-communication (`digit-ai-forge-agents`)

La republication avec avis, un usage courant de LinkedIn, n'a aucun modèle de publication.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-29 | majeur | générique | **`contrats-publication.json` n'a qu'un modèle pour LinkedIn, de 150 à 300 mots, et la republication avec avis n'en a aucun.** Faits : une republication avec avis s'affiche au-dessus de la publication d'origine ; avec ce modèle, le lecteur reçoit jusqu'à 600 mots avant la vidéo. Le dirigeant a fixé le 12/11/2026 une cible de 50 à 120 mots pour ses republications. `oracle-run-reseau` (RR2) jugera ces textes contre le modèle de 150 à 300 mots, ou ne les jugera pas. (ledger seq 773) | Un modèle `republication-avec-avis` (LinkedIn, 50 à 120 mots, accroche, clôture par une question ou un appel, 3 mots-dièse au plus, pièce requise : la publication d'origine), décrit au preset « publication réseau ». Classe à créer : `modele-de-publication-manquant-pour-un-usage-reel`. |

## Pilot (`digit-ai-factory`)

Un relais vers un autre agent, hors de la file de tickets, n'a prévu aucune reprise.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-220 | majeur | générique | **La session a confié un travail à Codex hors de la file, sans surveillance ni reçu, et n'a pas repris quand il a fini.** Faits : à 17:12, briefing écrit pour une session Codex ouverte par le dirigeant, avec un fichier de sortie désigné, et action « appliquer la proposition de Codex » annoncée en `auto_ia`. Codex a écrit sa sortie à 17:53 ; la session n'a pas repris, et le dirigeant a dû demander pourquoi. La file `digit-ai-queue` porte ce relais avec un reçu, mais son routage ne prévoit pas d'échange de fond sur la communication avec Codex. (ledger seq 774) | Tout relais vers un autre agent hors de la file pose une surveillance de son fichier de sortie (Monitor jusqu'à son apparition) ou passe par un ticket ; une action `auto_ia` qui attend un autre agent porte son moyen de reprise, sinon elle est `manuelle_utilisateur` (« dites-moi quand c'est fini »). Classe à créer : `relais-vers-un-autre-agent-sans-reprise`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-29 | `grep -i "republication" todo/TODO.jsonl \| grep -i -c "modèle\|modele\|contrat"` | 0 | aucun |
| RP-220 | `grep -i -E "relais\|handoff\|passage de main" todo/TODO.jsonl \| grep -i -c "codex\|agent"` | 6 | voisins : TF-1111 (attente posée après l'action observée), TF-1182 (point d'étape non reconnu) ; aucun ne traite la reprise après un relais à un autre agent |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Codex a tenu les limites du briefing : un seul fichier écrit, aucune donnée modifiée, aucun commit.

## Ordre recommandé

1. RP-220, parce qu'il touche tout relais entre agents.
2. RA-29.

## La règle qui aurait évité le retour

Aucune règle ne demande de moyen de reprise à une action qui attend un autre agent, ni de modèle pour la republication ; la colonne « Proposition esquissée » propose les deux classes.
