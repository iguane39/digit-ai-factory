---
destinataire: humain
---

# Synthèse de mandat — décision D-5 (a) exécutée : le lot L1 livré chez la forge des données, le lot L2 inscrit au registre des barres en attente de votre validation (07/09/2026)

Votre décision d'ouvrir tout de suite les deux premiers lots de préparation des forges est exécutée. Le premier lot est livré et clos : le verbe qui importe un schéma exporté sait lire le dialecte Databricks, ses clés déclarées mais jamais appliquées sont averties comme telles, et la preuve rejouée de la forge passe de soixante-treize à quatre-vingt-onze contrôles verts. Le second lot est écrit : les quatre barres de niveau ont chacune trois références atteignables, testées, et une recommandation ; le protocole exige que vous validiez ces références vous-même, en un tour, avant qu'elles ne passent au statut définitif. Ce qui change pour vous : le temps d'analyse de la couche brute de la mission peut s'appuyer sur un outil au lieu d'un travail manuel, et les trois oracles suivants ont leur niveau de référence prêt à être fixé. Ce qui est attendu de vous : valider les quatre barres, et dire si la copie installée du skill et les deux forges se publient.

## 1. En-tête d'identification

- **quoi** — mandat humain « 5a » sur la restitution de 15:05 : ouverture des lots L1 (import Databricks chez forge-data) et L2 (quatre barres au registre la-barre).
- **sur quoi** — la forge des données `digit-ai-forge-data` (commit local 41c85ef), la forge des outils `digit-ai-forge-agents` (commit local 2e86db4), le pilot `digit-ai-factory` (registre, catalogue, cette synthèse).
- **quand** — 2026-09-07 15:16 UTC+02:00 (Europe/Paris), durée ≈ 10 min depuis « 5a » (le contrôle de publication du tour précédent ayant occupé les premières minutes).
- **qui** — pilot digit-ai-factory 3e06408 ; skill `la-barre` (pas 1 à 4 et 6 joués, pas 5 soumis).

## 2. Verdict en une ligne

L1 livré et clos : self-test forge-data 73 → 91 PASS, 0 FAIL, TF-0858 en corrigé ; L2 écrit : 4 barres en statut todo, 12/12 références atteignables (HTTP 200), TF-0859 en cours ; 2 commits locaux non poussés ; gate K2 (alignement de la copie installée d'un skill versionné) rouge sur la-barre, un fichier de retard, à lever sur votre décision.

## 3. Décisions attendues de l'humain

> **D-6 — Validez-vous les quatre références recommandées comme barres de niveau de la mission data ?**
> Le protocole de la-barre impose que la référence retenue pour chaque cible soit validée par l'humain en un seul tour, jamais par l'agent : une barre choisie seule est une barre facile. Pour chaque cible, trois candidats ont passé le test d'existence, un seul est recommandé, les deux autres sont nommés comme survivants ou compléments. Cible modéliser : les techniques de modélisation dimensionnelle du Kimball Group. Cible transformer : dbt-core, déjà barre d'un autre verbe. Cible modèle sémantique : la collection officielle de règles du Best Practice Analyzer de Tabular Editor. Cible format de projet Power BI : la documentation Microsoft des projets PBIP avec la spécification TMDL en second localisateur.
> **Recommandation : (a).** Source consultée : les quatre entrées ajoutées au registre `registre-barres.md` de la-barre, champs `candidats_survivants` et `justification` ; standards de forge-data (Kimball retenu sans oracle) ; profil Power BI de forge-audit qui cite déjà les règles du Best Practice Analyzer.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Les quatre, telles que recommandées | Un passage des quatre entrées en statut ok, simple × court | Rien : les compléments nommés restent cités dans chaque entrée |
| (b) Une partie (nommer les cibles retenues, ou un autre candidat survivant) | Une itération sur les entrées non retenues, simple × court | Les oracles dont la barre n'est pas validée se construisent sans niveau de référence |
| (c) Aucune : rejouer la recherche de candidats | Un nouveau pas 2 et un nouveau test d'existence, moyen × court | Le lot L2 reste ouvert, les lots L3 (oracle de modélisation dimensionnelle) à L5 (oracle du modèle sémantique) attendent |

> **Si rien n'est décidé** : (c) — les quatre entrées restent en statut todo, aucune ne sert de barre, et TF-0859 reste en cours.

> **D-7 — La copie installée de la-barre se propage-t-elle, et les deux forges et le pilot se publient-ils ?**
> Le gate d'alignement des skills est rouge sur un seul fichier, le registre des barres que ce mandat vient d'enrichir : ce qui s'exécute sur le poste est la copie installée, et elle a un fichier de retard sur le dépôt. La règle veut que cet écart se règle dans la même session, sur décision humaine explicite. Par ailleurs, le commit de forge-data et celui de forge-agents sont locaux, et le contrat de campagne réserve la publication au pilot sur GO humain ; forge-agents portait déjà trois commits non poussés avant ce tour, avec une porte de publication rouge sur son histoire publiée, constat du 6 septembre.
> **Recommandation : (a).** Source consultée : gabarit de campagne du pilot, section « Gate de propagation des skills » (« se règle DANS la même session : --appliquer sur décision humaine explicite ») et section « Git » (« JAMAIS de push … la publication est une décision humaine qui passe par le pilot ») ; synthèse 20260907b pour l'état de forge-agents.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Propager la copie installée, pousser forge-data et le pilot, laisser forge-agents en local | Trois gestes d'agent, simple × court ; la porte de publication rejouée sur chaque push | La publication de forge-agents, dont la porte est rouge pour une cause antérieure à ce tour |
| (b) Propager seulement, ne rien pousser | Un geste d'agent | Toute publication : les trois dépôts restent en avance locale |
| (c) Ne rien faire | Aucun coût | La copie installée reste en retard : le skill qui s'exécute ne connaît pas les quatre barres |

> **Si rien n'est décidé** : (c) — K2 reste rouge et rien n'est publié.

## 4. Traité — avec sa preuve

- Lot L1 : le verbe importer de forge-data lit le dialecte Databricks (sortie de `SHOW CREATE TABLE`), détecté ou déclaré, avec commentaires en ligne rattachés, clés informationnelles averties, types imbriqués repliés en le disant.
  - preuve : `node scripts/importer.mjs fixtures/schema-databricks-verte.sql` → « sortie OK dialecte databricks compte {tables: 2, colonnes: 10, assertions: 14} », avertissements « PRIMARY KEY (id_commande) est INFORMATIONNELLE sur Databricks », « type imbriqué « ARRAY<STRING> » (ventes.tags) » ; `oracle-profiler.mjs` sur le brouillon → `PASS` ; `oracle-contractualiser.mjs` → `PASS` ; fixture rouge (vue seule) → exit 2, « aucune instruction CREATE TABLE reconnue ».
  - preuve : `oracles/self-test.mjs` → « Self-test forge-data : 91 PASS, 0 FAIL » (73 avant ce tour, 18 contrôles ajoutés au bloc « importer.mjs (dialecte Databricks, TF-0858) »).
  - preuve : commit local forge-data `41c85ef` 15:14, « main...origin/main [ahead 1] », 8 fichiers (verbe, self-test, deux fixtures, profil 1.1.0, LISEZMOI, CLAUDE.md, README).
- TF-0858 clos en corrigé au registre, avec corrections, gains, version de forge et descente (règle + oracle, R12 : une clôture redescend chez les producteurs). Contrôle rouge → vert : le bloc Databricks du self-test, absent avant (73 PASS), passe à 18 contrôles PASS (91) ; classe traitée : dialecte de moteur documenté au profil mais non consommé par le verbe.
  - preuve : `journaliser.mjs` → « 1 événement(s) journalisé(s) », `verdict_avant PASS`, `verdict_apres PASS`, « 2026-09-07T13:15:00Z TF-0858 maj corrige » ; vues régénérées, sceau 211a7f272cfa ; contrôle rouge → vert de cette clôture : `oracle-todo` PASS avant et après l'écriture, règles R7 et R12 tenues (gains, corrections, date, descente présents).
- Lot L2 : quatre barres écrites au registre de la-barre, pas 1 à 4 et 6 joués, pas 5 soumis (D-6).
  - preuve : `test_existence.py --liste` → « verdict global: PASS », « 12/12 reference(s) atteignable(s) », HTTP 200 sur chaque candidat (exécuté le 07/09) ; commit local forge-agents `2e86db4` 15:14, « main...origin/main [ahead 4] ».
- TF-0859 et TF-0858 passés en cours à l'ouverture des mandats (règle R5).
  - preuve : `journaliser.mjs` → « 2 événement(s) journalisé(s) », avant PASS après PASS, horodatages 2026-09-07T13:08:11Z.
- Entrée cat-dat-06 du catalogue du pilot mise à jour (entrée Databricks, preuve TF-0858, date de challenge 2026-09-07) et vues régénérées. Contrôle rouge → vert : avant, l'entrée ne citait que le DDL Postgres et le régénérateur laissait CATALOGUES.md inchangé ; après, l'entrée porte le dialecte Databricks et le régénérateur réécrit la vue.
  - preuve : `generer-vues.mjs` → « CATALOGUES.md régénéré », « section README déjà à jour ».
- Gate d'alignement des skills joué après modification d'un skill versionné.
  - preuve : `oracle-skills.mjs` → `FAIL`, un seul constat, K2 sur la-barre : « la copie installée DIVERGE … sur 1 fichier(s) : references/registre-barres.md — c'est la copie qui s'exécute ».

## 5. Non traité — avec son motif

- Pas 5 du protocole la-barre (validation des références) : non sautable, réservé à l'humain — attend D-6 ; les quatre entrées restent `todo`.
- Propagation de la copie installée de la-barre et publication des deux forges : gestes sur décision humaine explicite — attendent D-7.
- Commit du pilot (registre, catalogue, cette synthèse) : attend le verdict de l'oracle de synthèse, dans ce tour, preuve dans le message de restitution ; sa publication attend D-7.
- Lots L3 à L8 : non ouverts, hors du mandat « 5a » qui ne nommait que L1 et L2.
- Le dialecte Databricks de l'import est validé sur fixture synthétique seulement, comme le traducteur Unity Catalog avant lui : aucun export réel n'est disponible avant l'ouverture de la mission, ce qui est déclaré au profil §5.

## 6. Écarts à la lettre

- Vous avez demandé « 5a » (ouvrir L1 et L2 « dans des sessions chez les forges ») → j'ai joué les deux mandats depuis cette session du pilot, en écrivant dans les dépôts des forges → pourquoi : le mandat humain est ce qui autorise l'écriture chez une forge, et le contrat de campagne (périmètre d'écriture, vérifications natives vertes avant commit, commits locaux sans push) a été tenu à l'identique ; une session séparée aurait produit les mêmes commits.
- L'étude prévoyait pour L2 « quatre entrées `statut: todo` → `ok` après test d'existence » → les entrées restent `todo` après le test → pourquoi : le passage à `ok` exige le pas 5, validation humaine, que le protocole interdit de sauter.
- Aucun autre écart.

## 7. Risques

- **Copie installée en retard** : signal = K2 rouge à la prochaine ouverture de session ; parade = D-7 (a) ou (b).
- **Clé informationnelle prise pour une garantie** : signal = une assertion `unique` dérivée d'une clé Databricks utilisée sans mesure ; parade = l'avertissement du verbe nomme la mesure à faire (`mesurer_base.py`), et le profil §1 le documente.
- **Détection de dialecte trompée** : signal = un export Postgres contenant par hasard un marqueur Databricks (nom à trois segments) ; parade = `--dialecte postgres` force le dialecte, et le manifeste dit toujours lequel a été appliqué.
- **Barres validées sans lecture** : signal = D-6 (a) rendu en moins de temps qu'il n'en faut pour ouvrir les quatre localisateurs ; parade = chaque entrée nomme ses candidats survivants pour que le choix reste contestable après coup.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-21 | Passer les quatre barres en statut ok au registre et clore TF-0859 en corrigé | TF-0859 | auto_ia | dependance_bloc_3 (D-6) | édition des quatre champs `statut` de `registre-barres.md`, puis `node todo\journaliser.mjs --fichier <cloture.json>` | les oracles des lots L3 à L5 (modéliser, transformer, modèle sémantique) se construisent sans niveau de référence |
| A-22 | Propager la copie installée de la-barre (lever K2) | neuve | auto_ia | dependance_bloc_3 (D-7) | `node oracles\oracle-skills.mjs --appliquer` puis rejeu sans option | le skill qui s'exécute ignore les quatre barres |
| A-23 | Pousser forge-data et le pilot à travers la porte de publication | neuve | auto_ia | dependance_bloc_3 (D-7) | `git push origin main` dans `c:\dev\digit-ai-forge-data` puis dans le pilot | les commits restent locaux, un second poste ne les voit pas |
| A-24 | Ouvrir le lot L3 chez forge-data : oracle « modéliser », format `modele-dimensionnel@1`, fixtures double sens | TF-0860 | auto_ia | dependance_bloc_3 (D-6, la barre Kimball doit être validée avant) | `write-an-oracle` dans `c:\dev\digit-ai-forge-data`, run de mandat | Gold jugée à l'œil |
| A-25 | Ouvrir le lot L4 (transformer : oracle chez forge-data, profil data du manifeste chez forge-development, composition forge-tests) | TF-0861 | auto_ia | dependance_bloc_3 (D-6, barre dbt-core) | trois runs de mandat, ordre data → development → tests | Silver et Gold construites hors gates |
| A-26 | Ouvrir les lots L5 à L8 | TF-0862 à TF-0865 | auto_ia | dependance_bloc_3 (D-6 pour L5, puis un GO par lot) | un run de mandat par forge cible | voir la colonne « si non fait » de la section 5.2 de l'étude |
| A-27 | Répondre à D-6 et D-7 | neuve | manuelle_utilisateur | decision : validation d'une barre (pas 5) et publication sont des gestes humains par règle | répondre dans ce fil par `D-6 (a)` et `D-7 (a)`, ou les lettres choisies | rien ne se valide, rien ne se propage, rien ne se publie |

Ordre : A-27 conditionne tout ; A-22 et A-23 dès D-7 parce qu'ils ne coûtent qu'un geste chacun ; A-21 dès D-6 parce qu'il clôt L2 ; A-24 avant A-25 parce que Gold se conçoit avant de se construire ; A-26 ensuite.

## 9. Traces

- `..\digit-ai-forge-data\scripts\importer.mjs`, `..\digit-ai-forge-data\oracles\self-test.mjs`, `..\digit-ai-forge-data\fixtures\schema-databricks-verte.sql`, `..\digit-ai-forge-data\fixtures\schema-databricks-rouge.sql`, `..\digit-ai-forge-data\references\profils-moteur\databricks.md` (1.1.0), `..\digit-ai-forge-data\references\profils-moteur\LISEZMOI.md` — commit local 41c85ef.
- `..\digit-ai-forge-agents\.claude\skills\la-barre\references\registre-barres.md` — quatre entrées en fin de fichier, commit local 2e86db4.
- `todo\TODO.jsonl` — événements 2026-09-07T13:08:11Z (en cours ×2) et 2026-09-07T13:15:00Z (TF-0858 corrigé) ; `todo\TODO.md` sceau 211a7f272cfa.
- `catalogues\catalogue.jsonl` (cat-dat-06), `catalogues\CATALOGUES.md` régénéré.
- `oracles\oracle-skills.mjs` — verdict FAIL K2 la-barre, un fichier.
- `output\03-etudes\20260907-etude-opportunite-mission-data-silver-gold-powerbi.md` — section 5.2, lots L1 et L2.
