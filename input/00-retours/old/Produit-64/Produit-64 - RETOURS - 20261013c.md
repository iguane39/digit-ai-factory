# Lot de retours — Produit-64 → pilot (un dénombrement d'impact filtré sur les échecs, et une restitution encore jugée après affichage) — 2026-10-13, indice c

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `gabarits/RESTITUTION.md`, `oracles/oracle-synthese.mjs` et `oracles/hook-restitution.mjs`.

**Origine** : question humaine du 13/10/2026 vers 11:45 (heure de Paris), « Pourquoi uniquement 2 projets touchés ? », posée sur un diagnostic des erreurs 404 de Trivy dans les pipelines Azure DevOps ; puis refus du hook de restitution (R-44) sur deux messages finaux de la même session.

Ce lot porte **2 retours** (RT-48, RT-49).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`gabarits/RESTITUTION.md`, `oracles/oracle-synthese.mjs`, `oracles/hook-restitution.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-48 | majeur | générique | **Un périmètre d'impact a été dénombré sur les seuls échecs, et la restitution l'a présenté comme le périmètre touché.** Le premier relevé interrogeait l'API Azure DevOps avec `resultFilter=failed` sur un seul projet sur 3. Il a conclu à « 2 projets touchés » (Produit-11, APR), et la décision D-38 a été posée sur ce périmètre. Le relevé complet de tous les runs terminés (1 220 runs, 3 projets) montre 4 pipelines qui ont subi la panne : 2 ont échoué, et 2 ont été sauvés par la bascule automatique de Trivy (runs 15412 et 16236, `BLOB_UNKNOWN` puis « Trying to download artifact from other repository »). C'est l'humain qui a relevé l'écart. La restitution était PASS à `oracle-synthese`. | Une règle de restitution : un dénombrement d'impact (« N projets touchés », « seuls X concernés ») dit le filtre qui l'a produit (issue, projet, période) ; s'il est filtré sur l'issue, il s'écrit « N ont échoué », jamais « N touchés ». Juge possible : une phrase qui porte un compteur d'impact et un verbe « touché / concerné / affecté » sans mention de filtre ni de périmètre interrogé, comme S22 pour un négatif. |
| RT-49 | majeur | générique | **Deuxième et troisième récidive de RT-43 dans la même session, sous une forme non couverte : un message d'attente qui clôt le tour.** Après le premier refus de 11:40, la restitution a été pré-jugée et PASS. Mais deux messages suivants (« le relevé tourne en arrière-plan… ») ont clos le tour pendant qu'une commande tournait, et le hook les a refusés après affichage (S1, S3, S4, S6). Un message d'attente n'est pas un rendu, et le hook n'a pas de forme admise pour lui. Le « point d'étape » de la v2.25.0 exige les blocs 1, 4 et 8 pleins, et donc une restitution. | Deux pistes : (1) admettre un relais d'attente de 3 lignes quand une commande lancée dans le tour tourne encore, si elle est nommée par son identifiant de tâche ; (2) sinon, dire dans le gabarit qu'on ne clôt pas un tour sur une attente : on attend la fin de la commande dans le tour (boucle d'attente bornée). |

**Portée** : générique ; RT-48 vaut pour tout diagnostic qui compte des victimes, RT-49 pour toute session qui lance un traitement long.

## Rattachement

Registre interrogé le 13/10/2026 (`todo/TODO.jsonl`, termes « dénombr », « filtr… échec », « seulement les runs en échec », « impact ») : aucun item sur le filtrage d'un dénombrement par l'issue. RT-49 se rattache à **RT-43** (lot 20261012g) et à **RT-44** (lot 20261013a), dont il mesure une forme nouvelle : l'attente qui clôt un tour.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| « 2 projets touchés » au lieu de « 2 ont échoué » | Relevé complet des 3 projets, fiche passée en version `20261013b` (constat 3), D-38 remplacée par D-39 | oui | remonté : RT-48 |
| Message d'attente refusé deux fois par le hook | Attente faite dans le tour par une boucle bornée, puis restitution pré-jugée | oui | remonté : RT-49 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Note de réception du pilot (14/10/2026)

Le lot a été refusé à la porte le 14/10/2026 : ses classes ne figurent pas au référentiel `todo/CLASSES.json`. Le pilot les fait entrer par la voie prévue pour un défaut neuf (TF-1128) : `"classe": "classe-a-creer"` avec la classe proposée ci-dessous, rangée dans une famille existante. La classe se crée au référentiel à l'instruction du retour.

- `denombrement-filtre-sur-l-issue` — famille `restitution-forme` ; libellé : pilot (restitution) : un denombrement d impact filtre sur les echecs a ete restitue comme le perimetre touche (2 projets au lieu de 4) (avant la note : classe « denombrement-filtre-sur-l-issue » portée directement, inconnue du référentiel).
- `restitution-jugee-apres-affichage` — famille `restitution-forme` ; libellé : pilot (hook-restitution) : recidive de RT-43 sous une forme non couverte - un message d attente clot le tour pendant qu une commande tourne (avant la note : classe « restitution-jugee-apres-affichage » portée directement, inconnue du référentiel).
