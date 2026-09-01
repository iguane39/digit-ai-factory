# Retours forges — Produit-10 — 20260813b

- **Contexte** : étape de restitution HTML du run `20260813-scc-alx-mapping-bronze-silver`
  (construction d'un rapport HTML autonome sur le modèle d'un entrant client)
- **Références ledger** : `forge\ledger.jsonl` seq 11 et 12
- **Remise au pilot** : copier ce fichier dans `<pilot>\input\` — l'original reste ici.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `RETOURS-20260813a.md` (remis) — la séquence d'ids continue.

---

## forge-agents (`digit-ai-forge-agents`) — skill `digit-ai-page-html`

Premier usage du socle HTML sur un livrable réel de 193 Ko. Les deux oracles ont tenu et ont
attrapé de vrais défauts. Un défaut du socle lui-même, et une règle dont le seuil est trop bas.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-1 | **bloquant** | Les deux assets `find-in-page.js` et `table-filters.js` portent la séquence `</script>` dans leur commentaire d'usage (lignes 21 et 28 de `find-in-page.js`). Or la règle A1 du socle **exige** de les inliner : un livrable autonome ne charge rien. Inlinés tels quels, le navigateur ferme la balise au premier commentaire — le composant est tronqué, la recherche et les filtres ne se câblent pas, et la page ne le dit pas. Détecté ici par `check_html` (L11 signalait 5 littéraux `null` « dans `html > body` », symptôme du script devenu du texte), pas par un contrôle dédié. | Écrire `<\/script>` dans les commentaires des deux assets — la séquence reste lisible et ne ferme plus rien. Et une règle A1-bis dans `check_html.py` : un `<script>` inline contenant `</script` non échappé est un script tronqué, FAIL bloquant. |
| RA-2 | majeur | Le composant 6 (`composants.md`) place le repli en cartes à **640 px**, au motif que « sous 640 px, un tableau large dépasse le viewport ». La mesure dit autre chose : un tableau de 9 colonnes portant de la prose déborde jusqu'à **1 200 px** (bloquant V1 mesuré à 1 100 px : bord droit à 1 173 px). Le seuil de 640 px laisse donc une bande de 560 px où le tableau déborde sans que le repli ne s'active. | Formuler le seuil en fonction du nombre de colonnes plutôt qu'en pixels fixes, ou documenter le palier intermédiaire retenu ici : `overflow-wrap: anywhere` sur les cellules entre le seuil de repli et 1 200 px, `break-word` au-dessus. |
| RA-3 | mineur | `check_html.py` n'attribue pas au bon porteur le texte d'un `<script>` dont la balise a été fermée prématurément : le chemin rendu est `html > body`, ce qui envoie chercher le défaut dans le corps du document alors qu'il est dans un script. Le message est exact, sa localisation trompeuse. | Quand le porteur d'un littéral est `body` ou `html`, mentionner qu'un script mal fermé produit ce symptôme — l'utilisateur gagne l'aller-retour de diagnostic. |
| RA-4 | mineur | La checklist L3 exige `aria-describedby` sur toute cellule dont le texte entier correspond au motif `N/M`. Sur un tableau de mapping, ce motif est celui de **toutes** les cellules de disponibilité : 86 cellules pointant le même barème. La règle est juste, son application massive alourdit le HTML sans rien apprendre de plus au lecteur après la première. | Tolérer un barème déclaré **une fois par colonne** via `aria-describedby` sur le `<th>` (déjà exigé pour les colonnes calculées) plutôt que sur chaque cellule. |

## pilot (`digit-ai-forge-pilot`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RV-4 | majeur | L'entrant `input\Client-A - Rapport Client-C - Mapping Bronze ALX vers Silver - 20260812c.html`, livrable HTML produit par un run antérieur, échoue aux deux oracles du socle : `check_html.py` rend **FAIL avec 31 bloquants** (A1 : 3 requêtes réseau vers Google Fonts · L11 : 4 littéraux `NULL` en texte visible · L3 : 12 valeurs sans légende · L4 : 6 tables de 8 lignes ou plus sans filtre · L6 : 7 entrées de sommaire muettes · L7 : 7 chapitres sans chapeau) et `render_page.py` rend **FAIL avec 21 bloquants V2** de contraste à 1 440 px. Un livrable HTML est donc sorti sans qu'aucun gate ne l'ait mesuré. | `CONTRAT-INTERFACE.md` §2 bis exige la conformité pré-génération des gabarits ; il manque le symétrique en aval : tout HTML déposé dans `output\` passe `check_html.py` et `render_page.py` avant remise, et le verdict va au ledger. Mécanisable dans `oracle-conformite-projet` (une règle R-31 : tout `.html` de `output\` a son journal d'oracle sous `forge\`). |
| RV-5 | mineur | `BEST-PRACTICES-HTML.md` donne le token E4 comme `clamp(75vw, 1680px, 92vw)` (changelog du 13/08, version c) mais le `boilerplate.html` du skill porte encore `min(92vw, 1680px)` et bride la prose par `p, li { max-width: var(--prose) }` — ce que la doctrine L2 corrigée interdit explicitement. Les deux sources divergent sur le point que la règle vient de trancher. | Aligner le boilerplate sur le référentiel, ou dater l'écart dans le changelog du skill. |

## Confirmations positives

- **Les deux oracles du socle ont trouvé de vrais défauts, pas des formalités** : `check_html`
  a révélé le script tronqué (RA-1) que rien d'autre n'aurait signalé, et `render_page` a
  mesuré 21 contrastes insuffisants sur l'entrant de référence — dont des libellés à 2,48:1.
- **La palette de la charte n'est pas AA partout** : `--muted` (#64748B) sur `--blue-fill`
  rend 4,32:1. Assombri à #4B5A72 dans ce livrable (6,34:1). L'oracle a rendu la mesure, pas
  une opinion — c'est exactement ce qu'on lui demande.
- **Le pattern S-G1 fonctionne tel quel** : collé en quatre morceaux, la bascule est câblée,
  persistée et rejouée au rechargement (4 contrôles Playwright verts), et l'impression reste
  claire dans les deux thèmes.
- **Les composants du socle se câblent sans réécriture** : `initAll()` a injecté les filtres
  sur 7 colonnes de 6 tableaux, `find-in-page` surligne en `find-hit` (classe disjointe, le
  piège de collision documenté ne peut plus se produire).
- **Un test d'interactions attrape ce que les oracles statiques ne voient pas** : le KPI qui
  comptait 35 champs n'en filtrait que 34 (verdict « sous réserve » exclu de l'appariement).
  Aucun oracle du socle ne pouvait le voir — c'est une affordance câblée mais fausse.

## Ordre recommandé

1. **RA-1** (`</script>` dans les assets) — correctif de deux caractères dans deux fichiers,
   et il évite un livrable silencieusement cassé à chaque réemploi du socle.
2. **RV-4** (aucun gate en aval sur les HTML livrés) — c'est le trou qui a laissé sortir
   l'entrant de référence dans cet état.
3. **RA-2** (seuil de repli en cartes) — mesure disponible, reformulation du seuil.
4. **RV-5** (boilerplate ↔ référentiel) — une ligne, mais la divergence porte sur la règle
   la plus récemment tranchée.
5. RA-3, RA-4 — confort et précision.
