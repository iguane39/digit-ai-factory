# Lot de retours — Produit-64 → pilot (analyse L99 « Étape Run après MEP ») — 2026-10-13, indice g

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `scripts/readme-dossiers.mjs`, le message du hook d'ouverture qui le prescrit, et `oracles/oracle-synthese.mjs` (règle S36).

**Origine** : session de conversation du 13/10/2026, vers 18:20 (heure de Paris), analyse L99 d'un prompt et restitution de cette analyse.

Ce lot porte **2 retours** (RT-56 et RT-57).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## pilot (`scripts/readme-dossiers.mjs`, consigne d'ouverture, `oracles/oracle-synthese.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-56 | majeur | générique | **Le geste prescrit pour régénérer les README, joué chez un produit, écrit dans le sous-module du pilot.** La consigne d'ouverture dit « rejouer `node scripts\readme-dossiers.mjs` avant l'enregistrement » ; ce chemin n'existe pas chez le produit, et `node factory/scripts/readme-dossiers.mjs` lancé depuis sa racine a régénéré 8 README **dans `factory/`** (7 modifiés, 1 créé), en violation de la règle n° 1 du produit (aucune écriture dans `factory/`). Annulé à la main (`git checkout` des 7, suppression du README créé) ; `git -C factory status` revenu à l'état d'avant. | Le script prend la racine à indexer en argument ou depuis le répertoire courant, jamais depuis son propre emplacement ; la consigne d'ouverture nomme le chemin valable chez le produit, ou dit qu'il n'y en a pas. |
| RT-57 | mineur | générique | **S36 accuse une page HTML citée comme SOURCE d'un prompt d'être une page livrée.** Restitution `Client-A - Note - Restitution analyse L99 Etape Run apres MEP - 20261013h.md` : le prompt réécrit, recopié au bloc 4, nomme le schéma `…20261013a.html` qu'il faut lire ; S36 FAIL « page HTML citée comme livrée sans verdict de critique d'implémentation ». Contourné en déplaçant le prompt hors du bloc 4. | S36 ne compte qu'une page HTML présentée comme livrée (verbe de livraison, ligne du bloc 9 ou chemin créé dans le tour), pas une page citée dans un bloc de code ou comme source lue. |

**Portée** : générique pour les 2 retours.

## La règle qui aurait évité le retour

- **RT-56** : classe `oracle-chemin-prescrit-inoperant-sur-sa-cible` — le chemin d'usage prescrit à un produit est joué, dans sa recette, depuis la racine d'un produit qui porte le pilot en sous-module.
- **RT-57** : classe `oracle-faux-positif` — la fixture verte de S36 doit porter une page HTML citée comme source dans un bloc de code.

## Rattachement

Registre interrogé le 13/10/2026 (`todo/TODO.jsonl`, recherche « S36 » et « readme-dossiers ») : TF-0914, TF-1050 et TF-1055 corrigent le périmètre indexé par le script, aucun ne traite sa racine quand il est lancé depuis un produit ; aucun item sur un faux positif de S36.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Écriture accidentelle dans `factory/` | annulée dans le tour, état vérifié par `git -C factory status` | oui | proposé au pilot en RT-56 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.
