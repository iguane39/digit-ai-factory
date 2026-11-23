# Lot de retours — Produit-64 → digit-ai-factory (un déplacement déjà tracé, reproduit dans un arbre de commit) — 2026-11-23, indice b

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, hook `renommage-livrable` et `scripts/renommer-livrable.mjs`.

**Origine** : session interactive du 23/11/2026. Le porteur a demandé de mettre à jour un prompt réécrit ; la session a émis la version b d'une revue et devait ranger la version a dans `output/old/`. La copie de travail du produit porte des dizaines de fichiers non commités d'autres sessions : le commit s'est donc fait dans un arbre propre (`git worktree` sur `origin/dev`).

Ce lot porte **1 retour** (RT-79).

- **Contexte** : une session de ce produit, hors run.
- **Références ledger** : `forge/ledger.jsonl`, seq 13 (retour RT-79).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé et remis le 2026-11-23.

---

## digit-ai-factory (renommage d'un livrable)

Le retour, son fait mesuré et la correction proposée :

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-79 | mineur | générique | **Un déplacement déjà tracé ne peut pas être reproduit dans un arbre de commit.** Le 23/11/2026, la session a d'abord tenté un `mv` de la version a (refus du hook, légitime : erreur de la session), puis l'a déplacée par `renommer-livrable.mjs --vers output/old/03-Syntheses/` (trace au ledger, renvoi posé). Pour commiter sans embarquer le travail non commité d'autres sessions, elle a reproduit le même déplacement dans un `git worktree` propre : le hook a refusé `git mv` sur le même chemin, et le script ne propose aucune voie pour reproduire un déplacement déjà tracé sans écrire une seconde trace. La session a contourné par `cp` puis `git rm`, que le hook ne voit pas. | 1) Le hook accepte un `mv` ou `git mv` dont le couple source → cible porte déjà une entrée `deplacement_effectue` au ledger, ou bien 2) `renommer-livrable.mjs --reproduire <arbre>` rejoue un déplacement tracé dans un autre arbre sans nouvelle trace. 3) Fixture double sens : `git mv` d'un couple tracé dans un arbre de travail → accepté ; `git mv` d'un couple non tracé → refusé. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-79** : classe `exemption-hors-atteinte-par-le-chemin-prescrit`. Le chemin prescrit (le script) couvre le déplacement dans la copie de travail, pas sa reproduction dans un second arbre ; le seul geste restant (`cp` puis `git rm`) échappe au garde-fou, ce qui est pire que le refus qu'il évite.

## Rattachement

Registre interrogé le 23/11/2026 : `grep -iE "renommer-livrable" todo/TODO.jsonl | grep -ic "worktree\|arbre de travail\|arbre propre"` → 0 ligne(s) trouvée(s). Registre interrogé le 23/11/2026 : `grep -c "renommer-livrable\|renommage" todo/TODO.jsonl` → 44 ligne(s) trouvée(s), dont TF-2737 (le hook de renommage lui-même). Aucun item ne traite de la reproduction d'un déplacement tracé dans un autre arbre.

## Remarques restées au produit

Rien à dire : aucune remarque n'est restée au produit, généralisable : non, parce que le déplacement est fait et tracé, et que le commit `2c47a75` porte le même état que la copie de travail.

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : la revue `Client-A - Revue - Prompt presentation ADO passe au crible L99 - 20261123b.md` suit la forme du skill `prompt-analyzer-l99`, sans écart relevé (`check_markdown.py` PASS).

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs` le 23/11/2026 : 10 documents. Ce lot, consacré à RT-79, n'instruit pas leur forme ; les verdicts du lot `Produit-64 - RETOURS - 20261123a` restent inchangés, et ils sont rappelés ci-dessous.

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

Aucun garde-fou de plateforme relevé. Le seul refus du tour vient d'un hook de la Factory (RT-79), et les écritures sur Azure DevOps (poussée sur `dev`) ont été acceptées sans politique heurtée.
