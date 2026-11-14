# Retours forges — Produit-02 — 20261102a

- **Contexte** : autre — affiche A4 d'accueil à 4 QR-codes, hors run de version, 02/11/2026.
- **Références ledger** : `forge\ledger.jsonl` seq 632, 633 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-11-02

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT au registre du pilot (dernier relevé : RT-142).

---

## Socle HTML (`digit-ai-page-html`)

Un contrôle de format accuse à tort tout document de plusieurs feuilles.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-143 | mineur | générique | **La mesure écran de `check_format_a4.py` ignore `--pages N`.** Mesuré le 02/11/2026 sur une affiche de 5 feuilles A4 : 4 largeurs d'écran rendent FAIL à 1565,5 mm contre une borne de 297 mm, alors que les 5 conditions d'impression passent à 5 pages sur 5. Contourné par `--sans-ecran`. | Borne écran à N × 297 mm, plus les marges entre feuilles. |

## Factory (`digit-ai-factory`)

Le verrou « livré » peut se satisfaire d'une preuve sans rapport avec le livrable.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-144 | majeur | générique | **`mobiliser.mjs --verifier` accepte un fichier de contrôle ancien.** Mesuré le 02/11/2026 : pour la forge design d'une demande de type document, il rend PRESENT en trouvant le `.oracles.json` d'une note d'août 2026. Le motif `output/**/*.oracles.json` est satisfait par n'importe quel fichier ancien. | Exiger un verdict daté après la demande et portant sur un fichier écrit depuis. |
