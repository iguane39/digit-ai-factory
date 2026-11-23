# Lot de retours — Produit-64 → digit-ai-factory (une contrainte de forme non transposée au livrable, un indice alloué sans voir old) — 2026-11-23, indice c

**Émetteur** : produit `Produit-64` · **Cibles** : `digit-ai-factory`, skill `prompt-analyzer-l99` et `scripts/allouer-indice.mjs`.

**Origine** : session interactive du 23/11/2026. Le porteur a soumis un prompt à améliorer, qui ne posait qu'une contrainte de forme : « un chapitre synthétique au début, puis plusieurs chapitres de détails ensuite ». Après deux versions de la revue L99, il a relevé : « Le prompt ne respecte pas le format de sortie ». La session a émis la version c.

Ce lot porte **2 retours** (RT-80, RT-81).

- **Contexte** : une session de ce produit, hors run.
- **Références ledger** : `forge/ledger.jsonl`, seq 15 (retour RT-80) et seq 16 (retour RT-81).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé et remis le 2026-11-23.

---

## digit-ai-factory (skill prompt-analyzer-l99, allocation d'indice)

Les deux retours, leur fait mesuré et la correction proposée :

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-80 | majeur | générique | **La seule contrainte de forme du prompt soumis n'a pas été appliquée au livrable par le prompt réécrit.** Le porteur demandait « une proposition de contenus avec un chapitre synthétique au début, puis plusieurs chapitres de détails ensuite ». Les versions a et b de la revue (`output/old/03-Syntheses/Client-A - Revue - Prompt presentation ADO passe au crible L99 - 20261123a.md` et `…b.md`) ne l'appliquaient qu'à un sous-contenu, la page de présentation d'un produit (« En bref » puis 4 chapitres). La section « Livrable » du prompt réécrit ne fixait que le nom du fichier, et le point 10 du contrat de sortie mettait les mesures de l'étape 0 en tête du compte rendu, avant toute synthèse. Le porteur l'a relevé : « Le prompt ne respecte pas le format de sortie ». Version c : section « Format de sortie » (7 chapitres ordonnés, synthèse en premier), contrat porté à 11 points, dont le point 1 qui compare les titres du livrable à cette liste. | 1) `couches.md`, chapitre 8 : toute contrainte de forme écrite dans le prompt soumis devient une section « Format de sortie » du prompt réécrit, appliquée au livrable lui-même, et un point du contrat de sortie la juge (liste des titres, ordre). 2) Le chapitre 1 relève chaque contrainte de forme citée, et le chapitre 8 dit où chacune est tenue. 3) Fixture double sens : un prompt réécrit qui ne reprend la forme demandée que dans un sous-contenu → refusé ; un prompt qui porte la section et son point de contrat → accepté. |
| RT-81 | mineur | générique | **L'allocateur propose un indice déjà porté par une version supplantée du même jour.** Le 23/11/2026, `node C:/dev/digit-ai-factory/scripts/allouer-indice.mjs --dossier "output/03-Syntheses" --prefixe "Client-A - Revue - Prompt presentation ADO passe au crible L99 - " --jour 20261123 --extension .md` a rendu `a` alors que la version a de ce jour est sous `output/old/03-Syntheses/`, et que la version b y partait. Suivre l'outil aurait créé un second fichier `…20261123a.md` au contenu différent du premier. La session a pris `c` à la main. | 1) L'allocateur compte aussi les indices du jour présents sous le dossier `old` associé au dossier (R-7 bis), pour le même radical. 2) Fixture : dossier vide du jour, `old` portant `a` et `b` → `c` attendu. |

**Portée** : générique, pour les deux retours.

## La règle qui aurait évité le retour

- **RT-80** : classe `classe-a-creer`, classe proposée `contrainte-de-forme-demandee-non-transposee-au-livrable`, famille `contrat-interface-forge`. Le contrat de sortie du chapitre 8 jugeait la forme d'un sous-contenu et laissait celle du livrable libre, si bien que la seule consigne vérifiable du prompt soumis a échappé au contrat.
- **RT-81** : classe `allocateur-aveugle-a-la-regle-qu-il-sert`. L'allocateur sert la règle « une nouvelle version, un nouveau nom », mais ne voit pas le dossier où partent les versions remplacées.

## Rattachement

Registre interrogé le 23/11/2026 : `grep -iE "prompt-analyzer|L99" todo/TODO.jsonl | grep -icE "forme demand|format demand|contrainte de forme|structure demand"` → 0 ligne(s) trouvée(s). Registre interrogé le 23/11/2026 : `grep "allouer-indice" todo/TODO.jsonl | grep -icE "old|supplant|ancienne version|output.old"` → 1 ligne(s) trouvée(s), TF-0902, qui traite de la règle 7 et de deux versions qui cohabitent dans `output`, pas de l'indice proposé par l'allocateur.

## Remarques restées au produit

Rien à dire : aucune remarque n'est restée au produit, généralisable : non, parce que la version c corrige la revue et que le commit `aeb860e` porte la correction sur `dev`.

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : la revue `Client-A - Revue - Prompt presentation ADO passe au crible L99 - 20261123c.md` suit la forme du skill `prompt-analyzer-l99`. Son seul écart de fond est RT-80 ci-dessus, corrigé dans cette version, et `check_markdown.py` la rend PASS.

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs` le 23/11/2026 : 10 documents. Ce lot n'instruit pas leur forme ; les verdicts du lot `Produit-64 - RETOURS - 20261123a` restent inchangés, et ils sont rappelés ci-dessous.

| Document (versions) | Verdict |
|---|---|
| Guide développeur POC-to-Prod (30) | remonté : sa forme est la famille `gd-guide-de-reference` du pilot, publiée le 28/09/2026 |
| Modèle Rapport d'audit POC-to-Prod (24) | reste au produit, parce que sa forme relève du produit d'audit (`auditcore`) et non de la bibliothèque du pilot ; non instruit plus avant par cette session |
| Propositions ADR par domaine (16) | reste au produit, parce que sa matière est propre à Client-A ; forme non instruite par cette session, à juger par le porteur |
| Schéma Process POC-to-Prod End-to-end (14) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Référentiel POC-to-Prod - Audit (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Compliance Pack - Format & Contenus des contraintes (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Process Ingénierie POC-to-Prod - Consolidation et cible (7) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Matrice Contraintes ADR Light-Complet (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Catalogue ADR Client-A par domaine (5) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé. La poussée sur `dev` (commit `aeb860e`) a été acceptée sans politique heurtée.
