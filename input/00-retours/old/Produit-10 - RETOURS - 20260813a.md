# Retours forges — Produit-10 — 20260813a

- **Contexte** : clôture du run `20260813-scc-alx-mapping-bronze-silver` (analyse de mapping
  Bronze → Silver sur un workspace Databricks réel, mandat forge-data)
- **Références ledger** : `forge\ledger.jsonl` seq 6 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier dans `<pilot>\input\` — l'original reste ici
  (historique du produit).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-data (`digit-ai-forge-data`)

Premier usage des trois oracles sur un cas réel connecté (workspace Databricks, 7,2 M de lignes
mesurées). Les trois ont tenu et ont rendu un verdict utile. Deux frictions et un manque.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-1 | majeur | `oracle-restituer` R3 tombe en FAIL quand le rapport **parle** de sa propre convention : écrire « chaque nombre porte son marqueur `[c:id]` » dans la prose est lu comme une citation d'un chiffre nommé `id`, jamais déclaré. Message obtenu : « [c:id] utilisé au corps mais jamais déclaré au frontmatter ». Un document qui explique sa méthode de traçabilité ne peut donc pas la citer. | Ignorer les occurrences situées dans un span de code (entre backticks), ou reconnaître une séquence d'échappement (`[[c:id]]`). |
| RD-2 | mineur | Le type d'assertion `motif` attend le paramètre `regex`, mais l'en-tête de `oracle-profiler.mjs` documente le jeu de types sans nommer leurs paramètres — l'information n'est lisible que dans la constante `TYPES` du code. Un premier essai avec `motif` a produit 5 FAIL P2 identiques. | Lister les paramètres attendus par type dans le commentaire d'en-tête, ou les nommer dans le message d'erreur (« type motif : paramètres attendus objet, regex »). |
| RD-3 | majeur | Aucun service du catalogue ne couvre la **prise de mesure** sur une base connectée : `cat-dat-06` importe un schéma exporté (fichier seul, jamais de connexion) et `cat-dat-07` traduit un export de lineage. Pour produire un rapport à chiffres sourcés, le pilot a dû écrire son propre exécuteur SQL (`scripts\dbx_sql.py`, 110 lignes : appel API Statement Execution, suivi du statement, refus de toute requête non lecture-seule, archivage du couple requête/résultat sous `forge\etapes\data\mesures\`). Sans lui, aucun `[c:id]` n'aurait de source vérifiable. | Service `cat-dat-08` « Mesurer une base connectée » : exécuteur en lecture seule qui archive chaque requête avec son résultat brut et son identifiant, de sorte que `oracle-restituer` puisse remonter d'un chiffre à sa requête. Le script de ce run est un point de départ éprouvé sur Databricks. |
| RD-4 | mineur | `oracle-tracer` T6 exige que `sortie` désigne une colonne d'un dataset déclaré en `sorties`. Pour un mapping **proposé et non encore exécuté**, la sortie est une colonne cible qui n'est pas encore alimentée : le lineage passe, mais rien ne distingue un lineage constaté d'un lineage projeté. Contourné ici par `confiance.methode`, en texte libre. | Champ optionnel `etat: constate \| propose` au niveau du lineage, jugé par T5. |

## pilot (`digit-ai-forge-pilot`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RV-1 | majeur | Le protocole d'accueil route « discipliner ses données » vers forge-data, mais l'étape 7 d'`ACCUEIL.md` n'offre que deux voies d'exécution : `ETAPES-RUN.md` (run produit 5 étapes) ou `RUN-VERSION.md`. Un mandat forge-data n'est ni l'un ni l'autre : il n'y a ni conception, ni design, ni MEP, et le livrable est un document. Le run a été conduit en appliquant le socle projet (R-1..R-27, oracle PASS) puis les oracles forge-data, sans référence qui le décrive. | Une troisième voie dans `ACCUEIL.md` : `RUN-MANDAT.md` (mandat transverse — forge-data, forge-audit, forge-seo) précisant ce que le socle exige quand le livrable est un document et non un logiciel. |
| RV-2 | mineur | Conflit de nommage non arbitré : l'entrant humain (`input\prompt_analyse_*.md`) impose au livrable le nom `mapping_bronze_alx_silver_<client>_<AAAAMMJJ><indice>.md`, tandis que R-4 impose `<Marque> - <Type> <Objet> - AAAAMMJJ<indice>` dans `output\`. Les deux ne peuvent pas être satisfaits. Arbitré en faveur de R-4 et consigné au ledger (seq 1, champ `note_nommage`), mais la règle ne dit pas laquelle prime. | Un alinéa à R-4 : le nommage du pilot prime sur celui demandé par un entrant, la correspondance étant consignée au ledger. |
| RV-3 | mineur | `PARAMETRAGE.md` du gabarit `docs-projet\` met un commentaire en première ligne du bloc `variables:` du frontmatter. L'oracle R-22 lit les entrées `- NOM` consécutives immédiatement après `variables:` : le commentaire vide la liste, et la parité `.env.example` ↔ `PARAMETRAGE.md` tombe en FAIL sur un fichier pourtant correctement rempli (7 variables signalées non documentées alors qu'elles l'étaient). | Déplacer le commentaire au-dessus de la clé `variables:` dans le gabarit, ou tolérer les lignes de commentaire dans le bloc. |

## Confirmations positives

- `bootstrap.mjs --pull` : 13 forges mises à jour, 13 preuves vérifiées, « Poste prêt » — sans intervention.
- `oracle-conformite-projet` : a **attrapé un vrai défaut** (RV-3, parité R-22 rompue) avant tout livrable,
  et son message localisait exactement les 7 variables concernées. 20 PASS / 5 SANS_OBJET / 0 FAIL à la clôture.
- `oracle-restituer` : a refusé le rapport tant qu'un marqueur non déclaré subsistait (RD-1) — le faux positif
  est réel, mais la règle fait exactement ce qu'elle promet : aucun chiffre non ancré ne passe.
- `oracle-tracer` et `oracle-profiler` : PASS sur des artefacts de 35 correspondances au grain colonne et
  20 assertions, produits par génération et non à la main.
- `ledger.mjs` : `verify` PASS à chaque ajout, y compris sous PowerShell via `--fichier`.
- Garde-fou lecture seule tenu : aucune écriture sur le workspace Databricks, refus programmé de toute
  requête non `SELECT`/`SHOW`/`DESCRIBE`.

## Ordre recommandé

1. **RD-3** (service de mesure connectée) — meilleur rapport gain/effort : c'est le manque qui a coûté le plus
   de travail dans ce run, et le code écrit ici est réutilisable tel quel.
2. **RD-1** (faux positif `[c:id]` en span de code) — correctif de quelques lignes, débloque la rédaction
   de tout document méthodologique.
3. **RV-3** (gabarit `PARAMETRAGE.md`) — correctif d'une ligne dans un gabarit, évite un FAIL trompeur à
   chaque nouveau projet.
4. **RV-1** (voie de run pour un mandat transverse) — la plus structurante, donc la plus coûteuse ; à arbitrer.
5. RD-2, RD-4, RV-2 — confort et précision.
