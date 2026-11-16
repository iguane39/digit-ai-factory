# Retours forges — Produit-79 — 20261112i

- **Contexte** : le 12/11/2026 à 21h21, l'exploitant choisit de corriger les campagnes N02 à N08 remises par Codex (D-995 a, D-996 a, D-997 a). Les images de Codex ne se régénèrent pas : son lot ne porte ni le texte des diapositives ni le générateur qui les a rendues.
- **Références ledger** : `forge\ledger.jsonl` seq 1237 (entrée `type: retour`). Cette entrée compte 105 textes recopiés ; le compte exact est 60, soit 12 textes par campagne sur les 5 campagnes reprises telles quelles.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026

---

## pilot (`digit-ai-factory`)

Un agent qui livre des images générées sans leurs données ni leur commande de rendu rend un livrable qu'on ne peut corriger qu'en le recopiant.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-35 — images livrées sans leur source | majeur | générique | Le lot de Codex `output/Produit-79 - Campagnes RS Meta - 20261113a` livre 40 images de carrousel, N01 à N08, sans fichier qui porte le texte des diapositives. Son générateur `scripts/render_carrousels.py` lit un autre jeu de 12 campagnes (`content/editorial.json`). Le 12/11/2026, corriger 7 carrousels a demandé de recopier 60 textes depuis les images et de relever les 7 couleurs d'accent pixel par pixel ; le générateur du produit qui en est sorti est `forge/etapes/reseaux/carrousel_style4.py`. | Règle qui aurait évité le retour : aucune au référentiel ; classe à créer `livrable-genere-sans-source` (famille `contrat-interface-forge`). Le gabarit de ticket `queue/protocole/schemas/ticket.md` exige, pour tout livrable d'images générées, le fichier de données et la commande qui les rendent ; le reçu les cite dans ses preuves, et la relecture du reçu rejoue la commande. |

## Rattachement

Registre interrogé le 12/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des entrées dont le texte répond à `/(image|visuel|carrousel).{0,80}(sans|absen).{0,40}(source|donn|générateur)/i` → 0 ligne trouvée.

Aucun item recoupé.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `annuler` retire une publication Facebook programmée mais garde son identifiant, et `programmer` saute toute publication qui a un identifiant : une correction ne se reprogramme pas sans éditer l'état à la main | contournée le 12/11 à 21h31 par un script qui retire la publication chez Meta et vide son identifiant ; une commande `reprogrammer` attend un run de version du produit | non : propre au programme de publication du produit | reste au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot ; verdicts repris du lot 20261112a :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les polices de Codex sont libres (EB Garamond 12 et Lato 2.0, licence OFL) : les paquets Debian les ont fournies en quelques secondes, et le rendu du produit reprend sa typographie à l'identique.
