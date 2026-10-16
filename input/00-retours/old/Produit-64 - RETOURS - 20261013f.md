# Lot de retours — Produit-64 → pilot (report des lots c, d et e, que la porte refuserait pour classes inconnues) — 2026-10-13, indice f

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `gabarits/RESTITUTION.md`, le modèle de fiche de diagnostic, `oracles/oracle-synthese.mjs` et `oracles/hook-restitution.mjs`.

**Origine** : avertissement `LOT-SIDECAR` de `oracle-lot.mjs`, relevé le 13/10/2026 vers 17:40 (heure de Paris) : les sidecars des lots `20261013c`, `20261013d` et `20261013e` portent des classes inconnues de `CLASSES.json`. La porte du pilot les refusera (rejet atomique, registre intact). Les trois lots ont été copiés au sas avant que cet avertissement soit lu : le verdict d'ensemble de l'oracle était PASS.

Ce lot porte **4 retours** (RT-52 à RT-55). Chacun reprend un retour des lots c, d ou e, avec une classe proposée selon la forme `classe-a-creer`.

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`gabarits/RESTITUTION.md`, fiche de diagnostic, `oracles/oracle-synthese.mjs`, `oracles/hook-restitution.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-52 | majeur | générique | **Reprise de RT-48 (lot c) : un périmètre d'impact dénombré sur les seuls échecs, restitué comme le périmètre touché.** Relevé Azure DevOps filtré `resultFilter=failed` sur 1 projet sur 3 : « 2 projets touchés ». Le relevé complet (1 220 runs, 3 projets) en montre 4, dont 2 sauvés par la bascule de Trivy. Écart relevé par l'humain ; restitution PASS. | Un dénombrement d'impact dit le filtre qui l'a produit ; filtré sur l'issue, il s'écrit « N ont échoué », jamais « N touchés ». |
| RT-53 | majeur | générique | **Reprise de RT-49 (lot c) : un message d'attente qui clôt le tour pendant qu'une commande tourne, refusé par le hook après affichage.** 2 refus le 13/10 (S1, S3, S4, S6). | Admettre un relais de 3 lignes nommant la tâche en cours, ou dire au gabarit d'attendre dans le tour par une boucle bornée. |
| RT-54 | majeur | générique | **Reprise de RT-50 (lot d) : une préconisation sur un défaut présent dans plusieurs produits n'a proposé que des correctifs produit par produit.** 6 pipelines, 6 copies de Trivy ; fiches `20261013a` et `20261013b` sans source unique ni garde contre la réintroduction, alors qu'un gabarit partagé existait. Refus humain vers **16:45** (et non 13:00, comme écrit au lot d). | Défaut mesuré dans 2 produits ou plus : une ligne « cause commune » et au moins une action de classe (source unique, gabarit, règle ou contrôle), les correctifs immédiats déclarés provisoires. |
| RT-55 | mineur | générique | **Reprise de RT-51 (lot e) : un sigle de pipeline rattaché à un produit par devinette.** `VFS-*` lu comme la plateforme vidéo, alors que le dépôt est `VFS_Ventilation_Facturation_SFR` (COMPTA) ; 2 versions de fiche portaient « aucun run Trivy pour COMPTA » (201 runs en réalité). | Un sigle cité comme produit se résout par sa source (`repository.name`, étiquette de ressource) avant attribution. |

**Portée** : générique pour les 4 retours.

## La règle qui aurait évité le retour

- **RT-52** : clé proposée `denombrement-d-impact-filtre-sur-l-issue`, famille `restitution-forme`, libellé « Un dénombrement d'impact est restitué comme le périmètre touché alors qu'il a été filtré sur l'issue (échecs seulement) ou sur une partie du parc ».
- **RT-53** : clé proposée `tour-clos-sur-une-attente`, famille `hook-ou-gate`, libellé « Un tour se clôt sur un message d'attente pendant qu'une commande lancée dans le tour tourne encore, et le hook de restitution le refuse après affichage ».
- **RT-54** : clé proposée `preconisation-sans-cause-commune`, famille `restitution-forme`, libellé « Une préconisation sur un défaut présent dans plusieurs produits ne propose que des correctifs par produit, sans source unique ni garde contre la réintroduction ».
- **RT-55** : clé proposée `sigle-attribue-sans-resolution`, famille `restitution-forme`, libellé « Un sigle de pipeline, de dépôt ou de ressource est attribué à un produit sans être résolu par sa source ».

## Rattachement

Registre interrogé le 13/10/2026 (`todo/TODO.jsonl`) : aucun item pour ces 4 cas (voir les lots c, d et e). `CLASSES.json` (115 classes) relu : aucune clé ne convient. `correction-symptome-sans-classe` vise la correction du travail de l'agent, pas une préconisation au commanditaire. Les lots `20261013c`, `20261013d` et `20261013e` sont **remplacés** par celui-ci ; leurs retours RT-48 à RT-51 ne doivent pas être ingérés deux fois.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Classes inconnues dans 3 sidecars, vues après la copie au sas | Report dans ce lot, avec `classe-a-creer` ; avertissement `LOT-SIDECAR` lu avant la remise | oui | proposé au pilot dans la remarque ci-dessous |

Le verdict d'ensemble PASS de `oracle-lot.mjs` cache un avertissement qui annonce un refus certain à la porte. Pour qui ne lit que la ligne de verdict, le lot paraît bon. Piste : rendre `LOT-SIDECAR` bloquant chez le produit, puisque la porte le refuse toujours.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| « Comparatif des pipelines - Guide, IA Essentials, Cockpit IA » (`output/03-Syntheses/`) | 6 | reste au produit, parce que c'est une comparaison propre à trois chaînes Client-A, produite par une autre session de ce produit ; ce lot n'en a relevé aucune forme qui manque à la bibliothèque. À réexaminer par la session qui la tient. |
