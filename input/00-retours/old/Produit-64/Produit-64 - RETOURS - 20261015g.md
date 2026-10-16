# Lot de retours — Produit-64 → forge-agents (socle `digit-ai-page-html`, `check_html.py` L3 bis) — 2026-10-15, indice g

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-forge-agents`, c'est-à-dire le socle `digit-ai-page-html`, script `scripts/check_html.py`, règle L3 bis (infobulle qui recopie son porteur).

**Origine** : session de conversation du 15/10/2026, vers 17:50 (heure de Paris). Retour humain sur la page `Client-A - Proposition - IA dans le Run - 20261015a.html`, capture à l'appui : « Pourquoi sur ce type de schéma, j'ai encore des tooltips qui répètent le texte qui est dans le composant survolé ? Alors que j'ai déjà répété plusieurs fois que ça ne servait à rien ».

Ce lot porte **1 retour** (RT-68).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-15** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## forge-agents (socle `digit-ai-page-html`, `check_html.py`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-68 | majeur | générique | **Quatrième retour humain sur les infobulles qui recopient, et L3 bis ne voit toujours pas la forme la plus courante dans un schéma.** Un générateur de schéma pose sur chaque carte SVG un groupe `<g><title>C1 — <texte de la carte></title>…</g>`, alors que la carte affiche « C1 · N2 » puis le même texte coupé sur trois `<text>`. L3 bis compare à l'ÉGALITÉ, casse, ponctuation et espaces retirés : le préfixe de code et le niveau ajouté sur la carte suffisent à faire échouer l'égalité. Mesuré le 15/10 sur la page `20261015a` : **27 titres SVG sur 54 recopient leur groupe**, et **12 infobulles de code sur 58** recopient la ligne de tableau qui les porte ; `check_html` 46 règles n'en signale **aucun** (L3 n'avertit que sur 4 liens de navigation). La variante « contient sans rien ajouter » est écartée dans le code depuis le 08/09 faute de mesure (commentaire de L3 bis), mais ce trou n'apparaît pas dans le « Périmètre de NON-MESURE » publié par le script : l'auteur du générateur, qui a joué l'oracle, a lu un verdict sans réserve. Le générateur a été écrit le matin même avec ce titre recopié, justifié en commentaire par « nom accessible, et V4 ne les oppose pas » — le groupement exigé par `render_page` V4 pousse à poser un `<title>`, et rien ne dit quoi y mettre. | 1) L3 bis, voisinage étroit : juger le `<title>` d'un `<g>` contre le texte visible de CE groupe, chaque ligne de l'infobulle prise seule, débarrassée d'un préfixe de code (`[A-Z]\d+ —`) et d'une étiquette (`Statut`, `Indicateur :`…) ; une infobulle dont toutes les lignes figurent dans le groupe est une recopie. Même jugement pour le `title` d'un lien posé dans une ligne de tableau, contre le texte de la ligne. 2) Tant que la variante n'est pas posée, la nommer au périmètre de non-mesure publié. 3) `render_page` V4 et la doc d'infobulle disent ce qu'un `<title>` de groupe doit porter : ce que la marque ne montre pas. Mesure à rejouer : script de ce lot, sur le parc. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-68** : classe `oracle-perimetre-de-non-mesure-non-publie` — un trou connu de L3 bis (la recopie par inclusion) se publie au verdict tant qu'il n'est pas jugé ; l'auteur ne peut pas se fier à un PASS qui tait ce qu'il ne mesure pas.

## Rattachement

Registre interrogé le 15/10/2026 (`todo/TODO.jsonl`) : TF-0928 et TF-0954 (08/09, recopie de cellule, corrigés), TF-1593 (03/10, L3 bis étendue aux `<title>` SVG, corrigé), TF-1609 (12/10, recopie d'un texte affiché ailleurs). Aucun ne couvre la recopie par inclusion avec préfixe de code, ni le texte SVG coupé sur plusieurs `<text>`. Ce retour prolonge TF-1593.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Titres SVG et infobulles de code recopiés | `tools/propositions/rendre-proposition-ia-run-html.py` : infobulles de schéma composées de ce que la carte ne montre pas (apport, statut, indicateur, prérequis) ; dans une ligne de tableau, l'infobulle d'un code ne garde que ce que la ligne ne montre pas. Mesure : 27/54 → 0/54 titres SVG, 12/58 → 0/43 infobulles en ligne, page `20261015b` | oui | proposé à forge-agents en RT-68 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de documents de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.
