# Retours forges — Produit-81 — 20261113a

- **Contexte** : question en lecture seule (« Donne le numéro de la version en Qualif »), hors run ouvert ; refus du hook de fin de tour.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 33 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-18 (mineur) — Une liste de tags et une écriture en dossier temporaire font d'une question un tour de travail

**Le fait.** Le 13/11/2026, la session a répondu en 6 lignes à une question en lecture seule : la version déployée en Qualification. Le hook de fin de tour a refusé la réponse : « tour de travail (1 écriture(s), 5 commande(s)) — écrit : commande à effet « git tag » ». La commande en cause, `git tag --sort=-creatordate | head -10`, ne fait que lister. La seule « écriture » était un `curl -o` vers le dossier temporaire de session. Rien n'avait été écrit dans le dépôt. La réponse courte, que `references/NIVEAUX.md` prévoit pour ce cas, a dû être réécrite en restitution complète en 9 blocs.

**Le coût, prouvé.** 1 refus du hook et 1 réécriture complète. Pour la publier, il a fallu 8 commandes de plus : écrire le retour, compiler ce lot, préjuger la restitution. Le tout pour une réponse d'un seul numéro de version.

**La règle qui aurait évité le retour.** `git tag` ne compte comme effet que s'il crée ou supprime un tag : un nom sans option de liste, ou `-d`. Les formes `-l`, `--list`, `--sort`, `--contains`, `-n` et `--points-at` sont des lectures. Une écriture sous le dossier temporaire de session ne fait pas d'un tour un tour de travail. C'est déjà la classe `ecriture-temporaire-comptee-tour-de-travail`, ici confirmée par un second produit.

**Juge proposé.** Un jeu de cas pour le classifieur du hook `restitution` : `git tag --sort=-creatordate` → lecture ; `git tag v1.2.0` → effet ; `git tag -d v1` → effet ; `curl -o <dossier temporaire de session>/x.html` → hors dépôt, sans effet.

## Rattachement

Registre interrogé le 13/11/2026 : `todo/CLASSES.json` du pilot (288 classes). Classe retenue : `ecriture-temporaire-comptee-tour-de-travail`, famille `hook-ou-gate`. Elle couvre l'écriture temporaire. Ce lot y ajoute la liste de tags prise pour un effet, même mécanisme de classement du tour.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
