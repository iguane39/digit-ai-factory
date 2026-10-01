# Lot de retours — Produit-64 → digit-ai-forge-agents — 2026-10-01, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-forge-agents` (source versionnée du
skill `digit-ai-page-html`, dont `scripts/render_page.py`) · **Origine** : la revue de lecture du guide
développeur `20261001a`, faite le 01/10/2026 par la session de ce produit.

Ce lot porte **1 retour**, mesuré pendant cette revue.

- **Contexte** : décision du porteur du 01/10/2026 — mettre à jour le guide du développeur
  (approbation humaine d'une demande de fusion écartée sur `env/dev` et `env/uat`, projet `POC-IA`
  retiré) ; rendu `20261001a` et sa revue de lecture obligatoire (TF-0422). Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-01** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-forge-agents (`digit-ai-forge-agents`)

La revue de lecture d'une page à 14 onglets n'a pas pu passer par la voie que le socle prescrit pour
elle : la capture une à une des sections modifiées.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-6 | majeur | générique | **`render_page.py --sections` ne rend aucune capture de section sur une page à onglets, alors que la même page se capture entière.** Le 01/10/2026, sur `output/05-Kits/Client-A - Guide développeur POC-to-Prod - 20261001a.html` (14 vues, 1 662 807 octets) : sans `--sections`, 6 largeurs capturées et `captures_manquees: []` ; avec `--sections` sur 11 sélecteurs d'identifiant de section, `captures_manquees: [1920, 1280, 390]`, motif « capture impossible a 1920 px : TimeoutError — page haute de 2492 px, delai 30000 ms », puis le même motif à `--timeout 240000` sur la seule largeur 1920 ; aucune image de section écrite. Le verdict reste PASS sur les familles lues dans le DOM, et l'outil le déclare lui-même en `non_juge`. Coût : la revue de lecture, qui prescrit « une capture par section », n'a pu se faire qu'avec un script de session — Playwright, page ouverte sur l'ancre de la section, détails dépliés, capture de l'élément seul : 33 captures, 11 sections à 1920 et 390 en clair et à 1280 en sombre. La revue du 24/09 avait déjà contourné de même, en rendant une vue seule hors dépôt (`forge/travaux/REVUE-20260924f-guide-developpeur.md`). | Que `--sections` capture l'élément seul (`locator.screenshot`) après l'avoir rendu visible, plutôt que la page entière dépliée ; ou qu'il ouvre l'onglet de la section par son ancre avant de la capturer. Une fixture à 2 onglets, dont la section visée vit dans l'onglet masqué, tiendrait le cas. Règle qui aurait évité le retour : aucune fixture de `render_page` ne joue `--sections` sur une page à onglets, que TF-0422 suppose pourtant — classe `oracle-chemin-prescrit-inoperant-sur-sa-cible`. |

**Portée** : générique — tout guide à vues ou à onglets rendu par le socle y est exposé.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La liste des moments du modèle de branches s'écrivait « 3. et 4. », « 5. et 6. », « 7. et 8. » : le navigateur la renumérote, et les moments 9 à 11 du schéma s'affichaient 6 à 8 | liste dégroupée en 11 entrées, de 1 à 11, sur le texte des infobulles du schéma | non | rien de généralisable, parce qu'une liste ordonnée se renumérote par conception et que `check_completude` déclare déjà l'ordre et le contenu des listes hors de sa mesure : c'est une rédaction de cette source |
| Le premier paragraphe de la règle `GDE0103-R05`, allongé à 69 mots, était servi comme chapeau de chapitre | la règle et son exception séparées en 2 paragraphes | non | rien de généralisable, parce que `check_html` L7 l'a refusé du premier coup : la règle du socle a tenu |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le guide est encore rendu
par le générateur propre au produit, `tools/construire-reference-developpeur.py`, l'adoption de la
famille `gd-guide-de-reference` restant ouverte au registre du produit (RAF-125).

## Documents mûrs

Aucun document mûr nouveau sur ce lot. Les 8 documents d'`output/` qui comptent 5 versions datées ou
plus (`node forge/retours/oracle-lot.mjs --murs .`, relevé le 01/10/2026) sont déclarés, chacun avec
son verdict, au lot `Produit-64 - RETOURS - 20260924e`. Le guide développeur, repris depuis
(24 versions, dernière `20261001a`), y est déclaré **remonté** : famille `gd-guide-de-reference`.

## Confirmations positives

- `check_html` L7 a refusé du premier coup le chapeau de 69 mots né de cette retouche (« chapeau de
  69 mots dans #vue-g0 ») ; corrigé, PASS sur 42 règles.
- `verifier-revue-de-lecture.mjs` a jugé le rendu `20261001a` avec sa revue : aucun constat sur ce
  livrable.
- `render_page.py` sans `--sections` : 6 largeurs capturées, et les mêmes relevés qu'au `20260924f`
  rejoué le même jour, largeur par largeur.

## Ordre recommandé

1. RA-6 — seul retour du lot ; une fixture à 2 onglets le tient, et elle protège toutes les revues de
   lecture des guides à vues.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RA-6 ne suit pas un retour humain : il a été trouvé pendant la revue de lecture. La règle qui
l'aurait évité est nommée dans sa proposition — une fixture de `render_page --sections` sur une page
à onglets, que TF-0422 suppose et qu'aucune fixture ne joue.
