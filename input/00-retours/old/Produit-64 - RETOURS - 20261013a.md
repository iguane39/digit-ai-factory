# Lot de retours — Produit-64 → pilot (récidive de RT-43 : une mémoire de session ne tient pas le pré-jugement) — 2026-10-13, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `oracles/hook-restitution.mjs`, `oracles/oracle-synthese.mjs` et `gabarits/RESTITUTION.md`.

**Origine** : refus du hook de restitution (R-44) sur le message final d'une session de ce produit, le 13/10/2026 vers 11:10 (heure de Paris), demande « ajouter au comparatif des pipelines un schéma du pipeline Terraform attendu ».

Ce lot porte **1 retour** (RT-44).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`oracles/hook-restitution.mjs`, `oracles/oracle-synthese.mjs`, `gabarits/RESTITUTION.md`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-44 | majeur | générique | **Récidive de RT-43 le lendemain de sa remise, alors que la consigne était chargée en mémoire de session.** La mémoire `prejuger-restitution-avant-affichage`, écrite le 12/10 à la suite de RT-43, figurait dans l'index `MEMORY.md` chargé au démarrage de la session du 13/10. Le message final a quand même été affiché sans pré-jugement, et le hook l'a refusé après affichage : S1 (8 blocs absents), S3, S4, S6 bloquants ; un doublon de plus à l'écran. RT-43 est au sas du pilot (`input/00-retours/_arrivee/`, lot 20261012g) et n'a pas d'entrée au registre `todo/TODO.jsonl` à cette date (recherche « prejug », « jugee-apres-affichage », « 20261012g » : 0 ligne). | Confirme que les pistes (2) du lot 20261012g, une ligne dans le gabarit et le `RAPPEL`, ne suffisent pas seules : une consigne lue n'est pas un geste tenu. Priorité à la piste (1) de RT-43 (commande `prejuger` au verdict identique au hook) **et** à un contrôle qui la rende incontournable, par exemple un hook qui, au premier refus, signale l'absence de pré-jugement dans le transcript (piste 3) comme défaut distinct. |

**Portée** : générique, même périmètre que RT-43.

## Rattachement

Registre interrogé le 13/10/2026 (`todo/TODO.jsonl`, termes « prejug », « jugee-apres-affichage », « 20261012g ») : aucun item. Le retour se rattache à **RT-43** (lot `Produit-64 - RETOURS - 20261012g`, au sas), dont il est une mesure de récidive ; il ne propose pas de classe nouvelle.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Restitution affichée sans pré-jugement le 13/10 | Restitution réécrite dans un fichier, passée à `oracle-synthese.mjs` jusqu'au PASS, puis affichée telle quelle | oui | remonté : RT-44 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le refus du hook a été exact et actionnable : les quatre règles citées étaient bien absentes du message.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-44** : la classe proposée par RT-43, `restitution-jugee-apres-affichage`, convient ; aucune classe nouvelle.

## Ordre recommandé

1. **RT-44 avec RT-43 (1) et (3)** : instruire ensemble, parce que la récidive montre que le geste doit être outillé et mesuré, pas seulement rappelé.

## Note de réception du pilot (14/10/2026)

Le lot a été refusé à la porte le 14/10/2026 : ses classes ne figurent pas au référentiel `todo/CLASSES.json`. Le pilot les fait entrer par la voie prévue pour un défaut neuf (TF-1128) : `"classe": "classe-a-creer"` avec la classe proposée ci-dessous, rangée dans une famille existante. La classe se crée au référentiel à l'instruction du retour.

- `restitution-jugee-apres-affichage` — famille `restitution-forme` ; libellé : pilot (hook-restitution) : recidive de RT-43 le 13/10 - la consigne de prejugement chargee en memoire de session n a pas empeche un message final refuse apres affichage (avant la note : classe « restitution-jugee-apres-affichage » portée directement, inconnue du référentiel).
