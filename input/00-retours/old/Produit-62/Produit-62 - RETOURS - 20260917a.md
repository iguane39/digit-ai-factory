# Retours forges — Produit-62 — 20260917a

- **Contexte** : friction observée en séance le 2026-09-17, sans retour humain sur la forge, à l'issue d'une bissection de 4 heures : un projet Power BI généré, jugé PASS par 22 contrôles de recette et 7 contrôles d'audit, ne rendait **aucun visuel** depuis le 2026-09-15 — la requête de chaque visuel était invalide (référence de source `{Entity, Name}` au lieu de `{Source: alias}`), le service acceptait le fichier, le rapport restait en « Chargement… » et l'export PDF rendait 2 pages vides après 560 s.
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: constat` du 2026-09-17 de 11:15 à 12:36
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-17

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-forge-data (verbe `restituer` / `reconcilier`) et digit-ai-forge-audit

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-21 | bloquant | générique | **Un livrable Power BI généré est déclaré livré sur la foi de contrôles qui lisent son FICHIER, et aucun oracle ne juge son RENDU.** Fait observé : le projet `Client-A - Projet Power BI - 20260916f` puis `20260917d` passe **22 contrôles** de recette (`generer-projet-powerbi.py`, P1-P22 : tables, colonnes, mesures, en-têtes « 70 / 70 repris au caractère près », relations, format) et **7 contrôles** d'audit (`auditer-modele-pbi.py`, A1-A7, Tabular Editor 2 + 71 règles BPA), est publié le 2026-09-16 (GO D-34 a), et **ne rend aucun visuel** : « Chargement de votre rapport… » sans fin dans le navigateur (capture humaine du 2026-09-17), export PDF `Succeeded` en **557 à 569 s** sur **6** configurations avec des PDF de **943 à 1 415 octets, 0 caractère**, quand le rapport du client sur la même capacité s'exporte en **41 s** avec **137 506 octets**. La cause, trouvée par bissection dans un espace d'essai (rapport minimal 21 s vide → forme de la référence de source) : `{"SourceRef": {"Entity": "…", "Name": "t1"}}` dans les expressions au lieu de `{"SourceRef": {"Source": "t1"}}`, plus trois défauts de forme (projections `active: false` non affichées, en-têtes hors `columnProperties`, alias de source en doublon). **Aucun de ces défauts n'est visible d'un contrôle qui lit le JSON** — le contrôle P6 « en-têtes repris » rendait PASS sur des en-têtes que personne ne voyait. Le seul oracle qui les voit est le RENDU : export PDF côté service, PDF rendu en image et lu (texte extrait, page affichée). Le 2026-09-15, le diagnostic « rendu infini » avait été attribué au coût DAX d'un croisement de 12 entités (1 256 374 512 combinaisons) : un invariant CORRÉLÉ (le coût de la requête) pris pour l'invariant protégé (le rendu du visuel) — le tableau ne rendait pas parce que sa requête était invalide, et il ne rendrait pas davantage sur une table. *Un contrôle qui lit le fichier prouve la forme du fichier, jamais ce que le lecteur voit.* | **(1)** Oracle de rendu Power BI dans forge-data (`oracle-rendre-pbi` ou volet de `restituer`) : à toute publication d'un rapport, `ExportTo` PDF → `GET …/exports/{id}/file` → PDF rendu en image (`pypdfium2`, autonome, pas de poppler) → verdict sur (a) durée < borne, (b) octets > plancher, (c) texte extrait non vide par page, (d) absence des libellés d'erreur du service (« Query has exceeded the available resources », « Something's wrong with one or more fields », « Couldn't load the data ») ; la capture rendue est jointe à la restitution comme preuve du bloc 4 (S36 le fait déjà pour une page HTML : « toute page HTML citée comme livrée porte le verdict de la critique d'implémentation » — un rapport Power BI est une page). **(2)** Règle de la recette de projet PBIP (forge-audit `verifier-modele-semantique` ou équivalent) : forme des expressions PBIR — `SourceRef.Source` référence un alias déclaré dans `From`, alias uniques, aucune projection `active: false`, en-têtes dans `columnProperties`. **(3)** Classe candidate au référentiel : `livrable-juge-sur-le-fichier-jamais-sur-le-rendu` (famille `regle-morte`, proche de `controle-vrai-sur-le-mauvais-invariant`). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Forme `SourceRef`, alias, projections, en-têtes du générateur | corrigés dans `generer-projet-powerbi.py` (fonctions `expr_champ`, `aliases`, `visuel`) ; contrôle P23 (alias uniques) ajouté ; rendu prouvé par PDF rendu en image (banc puis production, 22 s, 99 Ko, 2 pages avec données) | oui — c'est l'objet de RF-21 (2) | clos |
| Tableau de « Page 1 » croisant des colonnes brutes de deux faits | 4 colonnes brutes devenues 4 mesures SUM ; « Query has exceeded the available resources » → tableau rendu avec totaux | oui — règle de conception déjà connue de forge-data (une table par visuel de détail, des mesures pour l'agrégé) | clos |
| Outils de bissection écrits en séance (`bissecter-rapport.py`, `pbi_publier.py --rapport-seul`, `--liaison-simple`, `POWERBI_MYORG`) | conservés dans le produit, documentés en tête de fichier | partiellement — la publication d'un rapport seul sur un modèle publié est un besoin de toute bissection PBIP | resté au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les livrables touchés sont un projet au format Microsoft (PBIP) généré par le mandat et les outils Python du produit.

## Confirmations positives

- La restitution en point d'étape (v2.22.0, TF-0979) a permis de rendre compte d'un tour de 4 heures de mesures sans exemption ni fil d'avancement.
- L'inventaire des bloquants (S45) et le « Comment faire » par option (RF-20, la veille) ont rendu D-37 exécutable en un mot (« 37c »).
- La règle « un test proposé s'exécute » (règle 40) est ce qui a conduit à télécharger le PDF au lieu de se fier au `Succeeded` de l'export : sans elle, le rapport aurait été déclaré rendu.

## Ordre recommandé

1. RF-21 — le défaut a coûté 2 jours de mandat et deux diagnostics faux (capacité, nombre de tables) ; il touche tout produit qui génère ou publie un rapport Power BI par l'API, et l'oracle proposé est court à écrire (les outils du produit le jouent déjà à la main).

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-21** → `controle-vrai-sur-le-mauvais-invariant` (famille `regle-morte`, correspondance APPROCHÉE : la classe vise un contrôle qui mesure une grandeur corrélée à ce qu'il protège ; ici 29 contrôles mesuraient la forme du fichier et le coût DAX quand l'invariant protégé était « le lecteur voit le rapport »). Classe candidate, même famille, libellé proposé : `livrable-juge-sur-le-fichier-jamais-sur-le-rendu` — « un livrable dont l'usage est un rendu (page, rapport, écran) est jugé par des contrôles sur son fichier et jamais par son rendu exécuté : la forme est prouvée, ce que le lecteur voit ne l'est pas ».
