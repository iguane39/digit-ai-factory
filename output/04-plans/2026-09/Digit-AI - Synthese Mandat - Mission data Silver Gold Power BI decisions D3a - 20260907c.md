---
destinataire: humain
---

# Synthèse de mandat — décisions D-3 (a) et D-4 (b) exécutées : les huit candidatures de la mission data décidées, l'étude et le registre publiés (07/09/2026)

Vos deux décisions sont exécutées : les huit candidatures nées de l'étude d'opportunité sont passées en statut décidé au registre des améliorations, et l'étude, l'analyse qui l'a fondée et le registre sont commités puis publiés sur le dépôt distant, la porte de publication ayant rendu vert. Ce que cela change pour vous : chacune des huit candidatures peut désormais ouvrir un mandat chez la forge qu'elle nomme, dans l'ordre des lots de l'étude, et rien de ce tour n'est resté sur le seul poste. Ce qui est attendu de vous : dire si les deux premiers lots, les moins coûteux, s'ouvrent dès maintenant dans des sessions chez les forges concernées, ou si tout attend l'ouverture de la mission.

## 1. En-tête d'identification

- **quoi** — mandat humain « D3a, D4b » sur la restitution de 14:48 : décision des huit candidatures dans l'ordre des lots (D-3 a), commit local et push (D-4 b).
- **sur quoi** — le pilot `digit-ai-factory` (registre `todo\TODO.jsonl`, étude et analyse sous `output\03-etudes\`, cette synthèse).
- **quand** — 2026-09-07 14:58 UTC+02:00 (Europe/Paris), durée ≈ 10 min depuis « D3a, D4b ».
- **qui** — pilot digit-ai-factory, commit fa447c6 (précédent 29d3ced).

## 2. Verdict en une ligne

8 événements de décision écrits (TF-0858 à TF-0865, candidat → décidé, registre PASS avant et après), commit fa447c6 publié (29d3ced..fa447c6 main → main, porte de publication PASS de C1 (aucun nom de client ni de produit publié) à C5 (dernière des cinq règles de la porte)).

## 3. Décisions attendues de l'humain

> **D-5 — Les deux premiers lots, L1 (import Databricks chez forge-data) et L2 (quatre barres au registre la-barre), s'ouvrent-ils dès maintenant ?**
> Les huit candidatures sont décidées mais aucun mandat n'est ouvert : un mandat de forge se joue dans une session ouverte chez la forge concernée, jamais depuis le pilot. Les lots L1 et L2 sont les moins coûteux de l'étude, simples ou moyens et courts, et ils débloquent les autres : L2 fixe le niveau de référence des trois oracles suivants, L1 rend le temps T1 (analyse de la couche brute) de la mission dérivable au lieu de manuel.
> **Recommandation : (a).** Source consultée : section 5.2 de l'étude d'opportunité 20260907a, table des lots, colonnes « effort » et « si non fait » ; ordre justifié « L1 et L2 d'abord parce qu'ils coûtent le moins et débloquent T1 et le niveau de référence de trois autres lots ».

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Ouvrir L1 et L2 maintenant, deux sessions (forge-data, forge-agents) | Deux runs de mandat, simple à moyen × court chacun | Rien : L3 (oracle de modélisation dimensionnelle chez forge-data) à L8 (plan de promotion du produit data chez forge-ops) attendent leur tour |
| (b) Ouvrir les huit lots à l'ouverture de la mission | Aucun coût aujourd'hui ; huit mandats concentrés au démarrage | Le niveau de référence des oracles n'est pas fixé avant leur construction |
| (c) Attendre une nouvelle décision | Aucun coût | Les candidatures restent décidées sans mandat, ce que la revue du 2026-09-21 constatera |

> **Si rien n'est décidé** : (c) — les huit candidatures restent en statut décidé au registre, sans mandat ouvert, jusqu'à la revue du 2026-09-21.

## 4. Traité — avec sa preuve

- Huit candidatures passées de candidat à décidé, décideur et date de décision portés (règle R6 du registre).
  - preuve : `journaliser.mjs --essai` → « essai — rien écrit | 8 evenement(s) » ; écriture réelle → « 8 événement(s) journalisé(s) », `verdict_avant PASS`, `verdict_apres PASS`, horodatages 2026-09-07T12:51:29Z, chaque ligne « maj decide ».
  - preuve : `oracle-todo.mjs` → `PASS` ; les deux vues générées du registre (Markdown et page) régénérées, « 84 actifs, 17 forges cibles », sceau f8d5308218b8.
- Étude d'opportunité alignée sur la décision (ligne « candidatures émises » : décidées le 07/09 par D-3 a).
  - preuve : `oracle-etude-opportunite.mjs` rejoué après l'édition → `PASS`, E1 à E10 tous PASS ; `check_markdown.py` → `PASS`, 0 échec, 1 avertissement M14 (le mot « TODO », légitime).
- Commit local de l'étude, de l'analyse L99 (analyse de prompt en huit couches), du registre et de ses vues, des index régénérés.
  - preuve : `git log -1` → « fa447c6 14:54 Etude d'opportunite 20260907a : preparation des forges … » ; 9 fichiers, dont 2 nouveaux sous `output\03-etudes\`.
- Publication sur le dépôt distant à travers la porte de publication.
  - preuve : `oracle-nom-client-publie.mjs` sur le dépôt → `PASS`, « C1-C5 digit-ai-factory aucun des 10 terme(s) du référentiel, ni des 14 nom(s) de produit de la table, dans les contenus, les noms de fichiers ni les messages de commit » ; `git push origin main` → « 29d3ced..fa447c6 main -> main », exit 0 ; `git status -sb` → « ## main » sans avance ni retard.

## 5. Non traité — avec son motif

- Aucun mandat de forge ouvert : attend D-5 ; un mandat se joue dans une session ouverte chez la forge, jamais ici.
- Les deux fichiers non suivis d'un lot de retours daté du 03/09 sous `input\00-retours\` (un lot d'un produit, désigné par son pseudonyme au registre, jamais par son nom) ne sont ni ajoutés ni ingérés : ils appartiennent à un autre tour et à un autre canal (ingestion de lot), hors du mandat « D3a, D4b ».
- Cette synthèse elle-même est commitée et publiée après le commit fa447c6, dans un second commit : la preuve du push ne pouvait pas être écrite avant d'exister.

## 6. Écarts à la lettre

- Vous avez demandé « D4b » (commit local et push) → j'ai poussé sans contournement de la porte de publication, après l'avoir rejouée à part → pourquoi : la porte est la règle, et son verdict est la preuve demandée au bloc 4.
- Aucun autre écart.

## 7. Risques

- **Candidatures décidées sans mandat** : signal = revue du 2026-09-21 trouvant TF-0858 à TF-0865 en statut décidé sans entrée `en_cours` ; parade = D-5 (a).
- **Publication de huit candidatures nommant des outils tiers** (Tabular Editor, dbt, Databricks) : signal = aucun, la porte ne juge que les noms de clients et de produits, et elle a rendu PASS ; parade = les noms d'outils publics ne sont pas des noms de clients, ce que le référentiel de la porte encode.
- **Dérive des sources externes de l'étude** : signal = une date citée (TMDL 2025-09, bundles 2024-04, dbt 2025-06) contredite à la revue ; parade = date de péremption de l'étude au 2026-11-07.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-13 | Ouvrir le mandat L2 chez forge-agents : quatre barres au registre la-barre (Kimball, dbt-core, Best Practice Analyzer + PBIP/TMDL) | TF-0859 | auto_ia | dependance_bloc_3 (D-5) | session ouverte dans `c:\dev\digit-ai-forge-agents`, skill `la-barre` mode pré-vol, puis `ledger` de mandat | les oracles des lots L3 à L5 (modéliser, transformer, modèle sémantique) se construisent sans niveau de référence |
| A-14 | Ouvrir le mandat L1 chez forge-data : extension d'`importer.mjs` au dialecte Databricks, profil 1.1.0, fixture double sens | TF-0858 | auto_ia | dependance_bloc_3 (D-5) | session ouverte dans `c:\dev\digit-ai-forge-data`, `references\RUN-MANDAT.md`, `write-an-oracle` pour la fixture | T1 se fait à la main |
| A-15 | Passer TF-0858 et TF-0859 en `en_cours` au registre à l'ouverture de leurs mandats | TF-0858, TF-0859 | auto_ia | dependance_bloc_3 (D-5) | `node todo\journaliser.mjs --fichier <maj.json>` | le registre ne reflète pas l'état réel |
| A-17 | Ouvrir les mandats L3 à L8 dans l'ordre de l'étude (L3, puis L4 : transformation sous gates, puis L5 à L7 en parallèle, L8 en dernier) | TF-0860 à TF-0865 | auto_ia | dependance_bloc_3 (D-5, puis un GO par lot) | un run de mandat par forge cible | voir colonne « si non fait » de la section 5.2 de l'étude |
| A-18 | Revue du verdict contre le « où » réel de la mission le 2026-09-21 | neuve | auto_ia | dependance_externe (mission non ouverte) | rejouer la section 2 de l'étude | le plan reste conditionnel sur XMLA et sur l'export Unity Catalog |
| A-19 | Répondre à D-5 | neuve | manuelle_utilisateur | decision : l'ouverture d'un mandat de forge est un GO humain (garde-fou « aucune écriture dans les dépôts frères hors mandat humain ») | répondre dans ce fil par `D-5 (a)`, `D-5 (b)` ou `D-5 (c)` | aucun mandat ne s'ouvre |

Ordre : A-19 conditionne A-13 à A-15 et A-17 ; A-13 avant A-14 parce que la barre dbt-core sert aussi au lot L4 ; A-18 à date fixe. Le commit et le push de cette synthèse sont faits dans ce tour, preuve dans le message de restitution qui l'accompagne.

## 9. Traces

- `todo\TODO.jsonl` — huit événements `maj decide` horodatés 2026-09-07T12:51:29Z ; `todo\TODO.md` et la page générée du registre — sceau f8d5308218b8.
- `output\03-etudes\20260907-etude-opportunite-mission-data-silver-gold-powerbi.md` — section 5, ligne « Candidature(s) émise(s) » mise à jour.
- `output\03-etudes\20260907-L99-mission-data-silver-gold-powerbi.md` — analyse source.
- commit `fa447c6` sur `main`, publié : `29d3ced..fa447c6 main -> main`.
- `~/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs` — verdict PASS C1-C5 avant push ; `.git/hooks/pre-push` — porte rejouée au push.
