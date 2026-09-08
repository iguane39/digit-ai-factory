# Retours forges — Produit-62 — 20260907a

- **Contexte** : clôture du run de mandat `20260907-lineage-tenancy-schedule-asset` (forge-data, lecture seule), puis retour humain du 2026-09-07 : « Le prompt de sortie ne respecte pas le format attendu pour 3 & 8, pourquoi ? Corrige puis remonte à la factory pour correction. »
- **Références ledger** : `forge\ledger.jsonl` seq 5 (écart déclaré R-35), seq 10 (retour humain sur la forme de la restitution), seq 11 (constat de cause)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit).
- **Statut** : remis le 2026-09-07

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## pilot (`digit-ai-factory`)

Le fichier de synthèse de fin de mandat (`output\20260907-synthese-lineage-tenancy-schedule-asset.md`) a été jugé **PASS** par `oracle-synthese` (S1 à S37) avant affichage. Le **message affiché** au destinataire n'était pas ce fichier : c'était une reformulation condensée, dont les blocs 3 (décisions) et 8 (actions) avaient perdu la forme prescrite. Le destinataire l'a vu et demandé la correction. Cause mesurée, en trois faits.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-1 | majeur | générique | **Le juge porte sur un FICHIER, la restitution est un MESSAGE.** `hook-restitution.mjs` (entête : « la synthèse EN FICHIER jugée avant affichage », TF-0249) juge le fichier marqué `destinataire: humain` ; rien ne compare le message effectivement affiché à ce fichier. Mesure : le fichier passe S1-S37 (`forge\oracles\2026-09-07-oracle-synthese.json`, verdict PASS) ; le message affiché portait au bloc 3 des décisions en prose sans bloc de citation, sans tableau `Option / Ce qu'elle coûte / Ce qu'elle exclut`, sans ligne d'option par défaut, et au bloc 8 un tableau à quatre colonnes avec acteurs « vous » / « IA » au lieu du vocabulaire gelé `manuelle_utilisateur` / `auto_ia`, sans colonne motif ni « comment (exécutable) », sans marque `(neuve)`. Retour humain mot pour mot : « Le prompt de sortie ne respecte pas le format attendu pour 3 & 8, pourquoi ? ». | Règle qui aurait évité le retour : `RESTITUTION.md` v2.1.0 (TF-0249) dit que la synthèse en fichier est jugée avant affichage, mais aucune règle ne dit que le message affiché EST le fichier. Proposer : (1) une règle S38 « le message de fin de tour reproduit le fichier jugé, blocs 0 à 8, sans reformulation » ; (2) que `hook-restitution.mjs` compare le dernier message assistant du transcript au fichier jugé (empreinte des blocs 3 et 8 au minimum) et refuse l'arrêt si le message n'en contient pas les sélecteurs `D-N` avec tableau d'options et les lignes `A-N` avec acteur du vocabulaire gelé ; (3) dire dans le rappel du hook que la longueur du message n'est pas un motif de condensation (les consignes générales de concision de l'assistant ont primé sur R-44 — R-43 dit le contraire). |
| RF-2 | majeur | générique | **Sans socle hérité, rien ne juge le message — et le run de mandat sur un existant l'autorise en silence.** `RUN-MANDAT.md` (TF-0266, R-35) : sur un projet antérieur à la doctrine, l'oracle de conformité se joue et les écarts partent au ledger sans bloquer. Ici le projet était un dossier `input\` avec un PBIX ; le socle minimal posé (`forge\`, `output\`, `docs\`) n'incluait ni `.claude\settings.json` ni `forge\hooks\factory.mjs` : le hook `Stop` n'a jamais tourné, la restitution n'a été jugée que parce que l'agent a lancé `oracle-synthese` à la main sur le fichier. L'écart R-35 a été déclaré (ledger seq 5) mais l'absence de hook n'y figurait pas comme conséquence. Mesure : `ls .claude` absent ; `forge\hooks` absent ; `oracle-conformite-projet` non joué. | Règle qui aurait évité le retour : `HERITAGE.json` (R-47) pose `forge\hooks\factory.mjs` et `settings-produit.json`, mais `RUN-MANDAT.md` ne rend pas cet héritage OBLIGATOIRE avant le premier tour d'un mandat sur existant. Proposer : au pas 1 de `RUN-MANDAT.md`, « socle du RUN complet » inclut explicitement `scripts\recopier-heritage.mjs .` + `.claude\settings.json` avant toute écriture, même sur existant (R-35 borne les FAIL antérieurs, pas l'installation des hooks) ; et le relevé d'ouverture nomme « restitution non jugée » parmi les familles non protégées quand le hook `Stop` manque (`familles_protegees` de HERITAGE.json 1.8.0). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le message de fin de mandat a été réémis en reproduisant les blocs 0 à 8 du fichier jugé, sans reformulation | réémission dans la même session, ledger seq 10-11 | oui | remontée ci-dessus (RF-1) |
| Le socle du produit n'a ni `CLAUDE.md` ni hooks : le dossier n'est pas un produit logiciel mais un dossier de mandat documentaire | non corrigé dans ce tour : héritage à poser au premier run de construction (lot L1), écart déclaré au ledger seq 5 | oui | remontée ci-dessus (RF-2) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — la synthèse suit `gabarits\RESTITUTION.md` v2.16.0 (référentiel normatif, pas un gabarit de `gabarits\documents\`) et le rapport suit le contrat de `oracle-restituer` (frontmatter `chiffres` + `lineage_ref`).

## Confirmations positives

- `oracle-synthese` (S1-S37) a tenu en conditions réelles sur une première rédaction : 5 règles rouges (S5, S13, S14, S24, S16, S23, S37 sur trois passes), chacune avec son geste réparateur lisible, jusqu'au PASS. Les messages de S24 (recherche par nom vs par structure) ont fait trouver deux objets réels manqués par la recherche par nom (`vyr.man_rgp_fam_art`, tables `*intcurrencyexchangerates` par pays).
- `oracle-tracer` T7 (environnement de chaque dataset), `oracle-modeliser` M1-M6 et `oracle-restituer` R5 (couverture des nombres de prose) ont tenu sur des artefacts réels d'un workspace Databricks.

## Ordre recommandé

1. RF-1 — parce qu'il rend inutile tout le reste de la chaîne de restitution : un fichier PASS que le lecteur ne voit pas ne protège personne ; correctif dans le hook, sans nouveau gabarit.
2. RF-2 — parce qu'il explique pourquoi RF-1 n'a pas été rattrapé mécaniquement ici, et vaut pour tout mandat futur sur un existant.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les deux retours suivent un RETOUR HUMAIN. Pour RF-1, la règle la plus proche est `RESTITUTION.md` v2.1.0 / TF-0249 (« synthèse EN FICHIER jugée avant affichage ») : elle couvre le jugement, pas l'identité entre fichier jugé et message affiché — c'est la règle manquante, proposée en S38. Classe la plus proche du référentiel : `restitution-fichier-juge-mal-choisi` (famille `restitution-forme`, « le hook juge une analyse au lieu de la restitution ») ; la classe exacte serait « le message affiché diverge du fichier jugé », à créer par le pilot si la nuance est retenue. Pour RF-2, la règle est R-47 / `HERITAGE.json` (héritage posé avant le premier tour) ; classe la plus proche : `heritage-avertissement-tardif` (famille `heritage-produit`) — ici l'avertissement n'est pas arrivé tard, il n'est pas arrivé du tout, parce qu'aucun hook d'ouverture n'était posé pour le porter.
