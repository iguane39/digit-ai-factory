# Retours forges — Produit-12 — 20261001b

- **Contexte** : autre — remontée immédiate sur mandat humain du 2026-10-01 (réponse « 14b », « remonte encore une fois à la Factory pour prise en compte »), à la suite de la restitution de la norme de rangement 2.2 ; s'y joint le retour au socle consigné le même jour.
- **Références ledger** : `forge\ledger.jsonl` seq 219 (RS-28) et 209 (RV-10), entrées `type: retour` ; la réponse humaine est la seq 218.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-01 dans le SAS d'arrivée du pilot (`<pilot>\input\00-retours\_arrivee\`), sur mandat humain du 01/10 (« remonte encore une fois à la Factory », ledger seq 218) — ce lot ne se modifie plus.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du produit : la série RS s'arrêtait à RS-27 (lot 15), la série RV à RV-9 (lot 12).

---

## pilot (`digit-ai-factory`)

La règle humaine qui autorise les noms réels dans un dépôt privé existe depuis ce matin, à un seul endroit ; chez ce produit, deux sessions du même jour ont continué d'anonymiser, et l'humain a dû refuser l'anonymisation une fois de plus.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-28 | majeur | générique | **La règle humaine du 01/10/2026 « Les dépôts privés peuvent conserver des données de type nom » n'atteint pas les produits.** Elle n'est écrite qu'au §3 sexies de `CONTRAT-INTERFACE.md` (canal des demandes entre produits, commit 1223e2f3 du 01/10). Chez ce produit, dont le dépôt est privé (`gh repo view` → `"visibility":"PRIVATE"`), le même jour : une session a posé « les 2 propriétaires, jamais dans un fichier versionné », anonymisé 2 lignes du référentiel des exigences avant commit (ledger seq 195, 204, 213, 214) et remonté 27 entrées de ledger et 1 ligne d'index nominatives (seq 216) ; une autre a proposé d'anonymiser le code de la norme de rangement avant commit (décision D-14 (a), seq 211). L'humain a refusé : « l'anonymisation ne s'applique pas aux projets privés, remonte encore une fois à la Factory pour prise en compte » (seq 218), et la norme est tenue hors de git en attendant. Le `CLAUDE.md` du produit garde « Un livrable qui cite du courrier réel est anonymisé avant d'entrer dans output\ ». Précédent : lot Produit-78 du 28/09, RP-11 (un outil du pilot pseudonymise le nom du client dans son propre dépôt privé). | Porter la règle du 01/10 au gabarit `gabarits\CLAUDE-PRODUIT.md` et au `CLAUDE.md` de tout produit dont le dépôt est privé : un dépôt privé versionne les noms réels de tiers ; la pseudonymisation ne s'applique qu'à ce qui sort vers un dépôt public (le pilot, une forge publique), lot de retours compris, que le pilot pseudonymise à l'accueil ; retirer des produits privés toute obligation d'anonymiser leur ledger, leurs référentiels ou leur code. Règle qui aurait évité le retour : la règle humaine du 01/10 elle-même, écrite au contrat d'interface et jamais descendue aux produits. |

## digit-ai-forge-design (et le socle `digit-ai-page-html`)

Une règle du socle accuse une page conforme sur le seul mot d'un en-tête de colonne.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-10 | mineur | générique | **`check_html.py`, règle L28, accuse comme colonne de dates une colonne de catégories dont l'en-tête contient le mot « date ».** Mesuré le 2026-10-01 sur la page avant / après d'un propriétaire (jeu de 42 règles, empreinte 80a50927d99d) : FAIL L28 sur l'en-tête « Ce qui date l'entrée », où « date » est un verbe, et sur « Date du fichier lue dans », colonne de libellés de sources ; aucune de leurs cellules ne porte une date. PASS après renommage des en-têtes en « Pièce qui fixe l'entrée » et « Source du préfixe AAAA-MM-JJ » (ledger seq 209). | Ne juger une colonne comme temporelle que si une part de ses cellules porte des dates, ou n'y lire « date » que comme nom en tête d'en-tête. Retour trouvé par un oracle, non par un humain. |

## Remarques restées au produit

Ce que le produit a constaté ce jour et garde chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La porte des principes 1 à 3 de la constitution du produit compte les fichiers à trier, compte des colocataires réunis comme deux entrées, et compte la marque « 0000-00 » comme un mois (ledger seq 208 et 215) | le premier point levé dans la norme (un fichier à trier ne retient plus de date) ; les 2 autres ouverts, script de l'étude cadrage métier | non | le script mesure des invariants propres à ce métier ; la classe générale, un invariant traduit en contrôle exécutable, est déjà remontée en RC-6 (lot 15) |
| L'ordre du nom et du prénom d'un bail écrit tout en capitales, et l'orthographe d'un nom que le bail et les autres pièces écrivent différemment | lexique des prénoms appris sur le dossier, nom de famille partagé avec la caution, vote des autres pièces ; tests fictifs ajoutés | non | règles de lecture propres aux documents de ce cabinet |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la page avant / après, sa revue de lecture et la restitution suivent le socle des pages HTML et `RESTITUTION.md`, pas une famille de `gabarits\documents\`.

## Confirmations positives

- **Le canal des demandes entre produits porte déjà la bonne règle** : le §3 sexies de `CONTRAT-INTERFACE.md` distingue dépôt privé et dépôt public ; RS-28 demande seulement de l'étendre aux produits.
- **Le juge des lots se joue tel quel depuis un produit** : `forge\retours\oracle-lot.mjs` sur ce lot, avant remise.
- **Les sceaux `jugement.json` datent une écriture** : la rectification d'horodatage du ledger (seq 212) s'est appuyée sur l'heure de scellement d'une note, à la seconde.

## Ordre recommandé

1. **RS-28** — une ligne au gabarit `CLAUDE-PRODUIT.md` et un rappel aux produits : c'est le geste le moins coûteux, et il évite à chaque produit privé un tour de décision et une passe d'anonymisation inutiles.
2. **RV-10** — un ajustement de la règle L28 : un faux positif coûte un renommage, pas une décision.

## La règle qui aurait évité le retour

- **RS-28** : la règle humaine du 01/10/2026, « Les dépôts privés peuvent conserver des données de type nom » (`CONTRAT-INTERFACE.md`, §3 sexies) — écrite pour le canal des demandes, jamais descendue aux produits ; classe `boucle-retour-sans-descente`.
- **RV-10** : retour trouvé par un oracle et non par un humain ; classe `oracle-faux-positif`.
