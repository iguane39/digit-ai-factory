# Lot de retours — Produit-64 → pilot (un sigle de pipeline attribué au mauvais produit, et un erratum d'heure) — 2026-10-13, indice e

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `gabarits/RESTITUTION.md` et le modèle de fiche de diagnostic.

**Origine** : écart relevé par la session elle-même le 13/10/2026 vers 17:35 (heure de Paris), en lisant les droits du registre `cl3acrclient-aaaidev` : les dépôts d'images `vfs/*` sont accordés à l'identité « VentilationDesFactureSFR », ce qui contredisait la fiche Trivy livrée deux heures plus tôt.

Ce lot porte **1 retour** (RT-51) et **1 erratum** sur le lot `20261013d`.

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`gabarits/RESTITUTION.md`, fiche de diagnostic)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-51 | mineur | générique | **Un sigle de pipeline a été rattaché à un produit par devinette, et deux versions de livrable l'ont porté.** Les pipelines `VFS-*` ont été lus comme ceux de la plateforme vidéo, alors que leur dépôt est `VFS_Ventilation_Facturation_SFR`, c'est-à-dire COMPTA. La fiche Trivy `20261013b` puis `20261013c` affirmait « aucun run Trivy relevé pour COMPTA », alors que VFS-CI, de COMPTA, en compte 201. La définition de pipeline, lue par l'API dans le même relevé, portait le nom du dépôt : une ligne suffisait. | Une règle de restitution : un sigle de pipeline, de dépôt ou de ressource cité comme un produit se résout par sa source (champ `repository.name` de la définition de pipeline, étiquette de la ressource) avant d'être attribué ; à défaut, il s'écrit tel quel, sans nom de produit. |

**Portée** : générique ; tout relevé de parc qui regroupe des pipelines par produit.

## Erratum sur le lot 20261013d

Le lot `Produit-64 - RETOURS - 20261013d` (RT-50) date le refus humain « vers 13:00 ». L'heure réelle est **vers 16:45** (heure de Paris). Le lot remis n'est pas modifié ; cette ligne fait foi.

## Rattachement

Registre interrogé le 13/10/2026 (`todo/TODO.jsonl`, termes « sigle », « acronyme », « nom de pipeline ») : 21 lignes portent « sigle » ou « acronyme », aucune sur l'attribution d'un sigle à un produit. Voisin de **RT-48** (lot 20261013c) : même relevé, même pente, conclure sur ce qu'on croit lire plutôt que sur la source.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| VFS attribué à la plateforme vidéo | Fiche Trivy passée en version `20261013d` : VFS = COMPTA, IAC_Release_Container = Vidéo IA | oui | remonté : RT-51 |
| Heure erronée dans le lot d | Erratum dans ce lot | non | resté au produit |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Note de réception du pilot (14/10/2026)

Le lot a été refusé à la porte le 14/10/2026 : ses classes ne figurent pas au référentiel `todo/CLASSES.json`. Le pilot les fait entrer par la voie prévue pour un défaut neuf (TF-1128) : `"classe": "classe-a-creer"` avec la classe proposée ci-dessous, rangée dans une famille existante. La classe se crée au référentiel à l'instruction du retour.

- `sigle-attribue-sans-resolution` — famille `anonymisation` ; libellé : pilot (restitution, fiche de diagnostic) : un sigle de pipeline (VFS) rattache a un produit par devinette, porte par deux versions de livrable (avant la note : classe « sigle-attribue-sans-resolution » portée directement, inconnue du référentiel).
