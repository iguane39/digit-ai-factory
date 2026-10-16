# Lot de retours — Produit-64 → digit-ai-factory — 2026-09-28, indice b

**Émetteur** : produit `Produit-64` · **Cible** : le pilot `digit-ai-factory` (porte de
publication) · **Origine** : la publication du `main` du pilot sur GitHub, décidée par le porteur le
28/09/2026 (D-3 (a)), et exécutée par la session de ce produit.

Ce lot porte **1 retour**, mesuré pendant cette publication.

- **Contexte** : décision du porteur du 28/09/2026, réponse « 3a » : publier le `main` du pilot
  (5 enregistrements : les 4 de la synchronisation du 28/09 et le report de la famille
  `gd-guide-de-reference`). Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-28** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.
- **Travail livré** : `a464cb9..80c126f main -> main` sur `github.com/iguane39/digit-ai-factory`,
  sortie 0, sous `FORGE_PUSH_GO="D-3 (a) du 28/09"` — le garde de publication a été joué en entier,
  jamais contourné.

---

## digit-ai-factory (`digit-ai-factory`)

La porte de publication a tenu : elle a classé les 5 enregistrements, exigé le GO, puis balayé
l'histoire. Elle a pris 5 fois plus de temps que le pilot ne l'écrit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-27 | majeur | générique | La porte de publication du pilot (`.git/hooks/pre-push` : `verifier-avance-publication.mjs`, puis `oracle-nom-client-publie.mjs`) a pris **27 min 19 s** le 28/09 (`git push` lancé à 11:32:34, rendu à 11:59:53, sortie 0) ; le même matin, la publication d'une autre session tournait encore **après 24 min** quand son processus s'est arrêté, sans rien envoyer. Le pilot écrit pourtant « la porte de publication prend trois à cinq minutes » (`scripts/hooks-git/pre-commit`, ligne 29). La mesure situe la durée dans l'oracle : processus lancé à 11:32:36, en activité jusqu'à la fin, 41,5 s de calcul propre après 19 min — le reste en appels `git` successifs sur tout l'historique (angle C4 : contenus et noms de fichiers de toute l'histoire). Une porte de près d'une demi-heure, dont le message de refus propose lui-même `git push --no-verify`, invite au contournement qu'elle interdit | rendre C4 **incrémental** : l'histoire ne change pas, un verdict par commit se garde tant que les tables de référence ne changent pas (clé : l'empreinte des tables) ; ou lire les objets par un seul `git cat-file --batch` au lieu d'un appel par objet ; et remplacer « trois à cinq minutes » par la durée mesurée. Fixture : deux publications successives, la seconde ne rebalaie que les commits neufs |

### RT-27 — Une porte annoncée à 5 minutes qui en prend 27

**Le fait.** Deux publications du même dépôt, le même matin, sur le même poste : l'une s'arrête sans
avoir rien envoyé après plus de 24 min, l'autre aboutit en 27 min 19 s. Rien n'était bloqué : la
porte avançait, lentement.

**Ce que ça coûte.** Une publication décidée par l'humain met une demi-heure à partir, et une session
interrompue pendant ce temps ne publie rien. Le texte qui annonce trois à cinq minutes fait lire
cette durée comme une panne.

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par la session du produit, le
28/09/2026 : la publication ne touche que le pilot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- **La borne du GO (R-38 par. 4-5) a tenu** : jouée à blanc, `verifier-avance-publication.mjs`
  classe les 5 enregistrements en avance « GO explicite requis » et refuse sans GO ; avec
  « D-3 (a) du 28/09 », il laisse passer. Le GO nommait bien les 5.
- **La porte des noms de client a rendu PASS** sur les 5 enregistrements : le crochet ne sort 0 que
  sur ce verdict, et la publication est partie.

## Ordre recommandé

1. RT-27 — chaque publication du pilot paie cette durée, et chacune est une occasion de
   contournement.

## La règle qui aurait évité le retour

- **RT-27** — aucune classe existante ne convient : clé proposée
  `duree-de-porte-annoncee-contredite-par-la-mesure`, famille `hook-ou-gate`, libellé « La durée
  qu'un texte annonce pour une porte (un crochet, un garde) diffère d'un ordre de grandeur de sa
  durée mesurée, et une porte lente invite au contournement qu'elle interdit ».
