# Lot de retours — Produit-64 → pilot (une préconisation qui corrige les cas observés sans traiter la cause commune) — 2026-10-13, indice d

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `gabarits/RESTITUTION.md`, le modèle de fiche de diagnostic et `oracles/oracle-synthese.mjs`.

**Origine** : refus humain du 13/10/2026 vers 13:00 (heure de Paris), mot pour mot : « Ta réponse ne donne pas de solution pour que le problème ne se reproduise pas, elle fournit une solution uniquement pour les produits impactés, mais sans généraliser à tous les produits. Propose une solution viable dans le temps. »

Ce lot porte **1 retour** (RT-50).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`gabarits/RESTITUTION.md`, fiche de diagnostic, `oracles/oracle-synthese.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-50 | majeur | générique | **Une préconisation sur un défaut présent dans plusieurs produits n'a proposé que des correctifs produit par produit.** Le diagnostic des 404 de Trivy a mesuré 6 pipelines locaux, chacun avec sa propre copie de Trivy (de 1 à 40 lignes, 4 façons d'installer, 3 versions). Les deux versions de la fiche (`20261013a`, `20261013b`) et les décisions D-38 et D-39 ne proposaient que de poser le même correctif dans chaque pipeline. Elles ne prévoyaient ni source unique ni garde contre la réintroduction, alors que le dépôt héberge déjà un gabarit de pipeline partagé (`gabarits/pipelines/terraform-infra.yml`) né exactement de ce constat le 22/09. C'est l'humain qui a relevé l'absence de solution durable. Les deux restitutions étaient PASS à `oracle-synthese`. | Une règle de préconisation : quand un défaut est mesuré dans 2 produits ou plus, la fiche porte une ligne « cause commune » et au moins une action de classe (source unique, gabarit partagé, contrôle qui empêche la réintroduction), en plus des correctifs immédiats, qui sont alors déclarés provisoires. Juge possible : une fiche ou une décision qui énumère au moins 2 produits dans ses actions, sans aucune action portant sur un gabarit, une source commune, une règle ou un contrôle. |

**Portée** : générique ; vaut pour tout diagnostic de parc (pipelines, dépendances, configuration) chez tout produit qui en couvre plusieurs.

## Rattachement

Registre interrogé le 13/10/2026 (`todo/TODO.jsonl`, termes « généralis », « cause commune », « par produit », « tous les produits », « symptôme ») : aucun item sur ce cas. S37 couvre une correction **du travail de l'agent** (contrôle rouge → vert ou classe nommée), pas une préconisation **adressée au commanditaire** pour un défaut de parc. Parent de **RT-48** (lot 20261013c) : même diagnostic, et même pente, raisonner sur les cas vus plutôt que sur la population.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Préconisations limitées aux produits en échec | Fiche passée en version `20261013c` : socle Trivy commun en 5 couches (gabarit partagé, miroir interne, surveillance, règle et contrôle, migration), et correctif immédiat déclaré provisoire | oui | remonté : RT-50 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Note de réception du pilot (14/10/2026)

Le lot a été refusé à la porte le 14/10/2026 : ses classes ne figurent pas au référentiel `todo/CLASSES.json`. Le pilot les fait entrer par la voie prévue pour un défaut neuf (TF-1128) : `"classe": "classe-a-creer"` avec la classe proposée ci-dessous, rangée dans une famille existante. La classe se crée au référentiel à l'instruction du retour.

- `preconisation-sans-cause-commune` — famille `restitution-forme` ; libellé : pilot (restitution, fiche de diagnostic) : une preconisation sur un defaut present dans plusieurs produits ne propose que des correctifs produit par produit, sans source unique ni garde contre la reintroduction (avant la note : classe « preconisation-sans-cause-commune » portée directement, inconnue du référentiel).
