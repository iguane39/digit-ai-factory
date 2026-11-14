# Lot de retours — Produit-64 → digit-ai-factory (contrat d'un prompt réécrit par L99 sans oracle de lisibilité pour son livrable Markdown) — 2026-11-05, indice c

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, skill `prompt-analyzer-l99` (chapitre 8, contrat de sortie).

**Origine** : session interactive du 05/11/2026, contrôle du livrable de l'audit des règles de développement et de déploiement, entre 16:40 et 16:46 (heure de Paris). Le défaut a été relevé par la session elle-même, en rejouant l'oracle du registre `quality-oracles` sur le livrable.

Ce lot porte **1 retour** (RT-76).

- **Contexte** : une session de ce produit, hors run. Elle avait réécrit le prompt d'audit par `prompt-analyzer-l99` en mode boucle, puis contrôlé le livrable produit par ce prompt.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé et remis le 2026-11-05.

---

## digit-ai-factory (prompt-analyzer-l99, contrat de sortie du Ch8)

Le retour, son fait mesuré et la correction proposée au skill :

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-76 | mineur | générique | **Le contrat de sortie d'un prompt réécrit par L99 ne nomme pas l'oracle de lisibilité quand le livrable est en Markdown.** Le prompt `Client-A - Prompt - Audit des regles de developpement et de deploiement - 20261105e.md` (passe 4 de la boucle, 86/100 mesuré) prescrit pour la forme, au point 11 du contrat, le seul `check_html.py` sur la page HTML, « ou l'échec du générateur est cité au § 1 ». Le générateur a échoué, et la voie de repli a laissé le livrable Markdown sans aucun oracle de forme. Le 05/11 à 16:41, `check_markdown.py` rend sur l'audit `20261105f` (exit 1) 9 défauts : 4 M7 (chapitre ouvert par un tableau nu) et 5 M10 (tableau de plus de 12 lignes sans mode d'emploi). Les trois oracles propres au contrat rendaient tous PASS. Le livrable était déjà poussé sur `dev` et promu sur `main`. Correction faite en indice `g` (7 phrases ajoutées, `check_markdown.py` sans défaut), au prix d'une version de plus et d'un second commit. | 1) Le Ch8 de `prompt-analyzer-l99` nomme, dans le contrat de sortie, l'oracle de forme de **chaque** format que le livrable produit, et non du seul format HTML : `check_markdown.py` pour un Markdown, aux côtés du point 7 du `SKILL.md` (TF-0765) déjà écrit pour le HTML. 2) Une voie de repli du contrat (« si le rendu échoue, livrer le Markdown ») porte l'oracle du format de repli. 3) Fixture : un prompt réécrit dont le livrable est un Markdown et dont le contrat ne nomme pas `check_markdown.py` est refusé par le contrôle de forme du Ch8. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-76** : classe `l99-forme-sortie` (TF-0770), étendue de la sortie de l'analyse au livrable que le prompt réécrit fera produire. Aujourd'hui, la règle de forme de `couches.md` juge la sortie L99 elle-même par `check_markdown.py`. Elle ne demande pas que le contrat du prompt réécrit fasse jouer ce même oracle sur le livrable Markdown de l'exécutant.

## Rattachement

Registre interrogé le 05/11/2026 : `grep -i "check_markdown" todo/TODO.jsonl | grep -i -E "l99|prompt-analyzer|contrat"`, puis les items `prompt-analyzer` ou `L99` qui parlent de Markdown ou de lisibilité. Aucun item ne traite le contrat de sortie d'un livrable Markdown. Le plus proche est TF-0765 (règles du socle à nommer pour un livrable HTML), qui en est le pendant HTML.

## Remarques restées au produit

La remarque corrigée chez le produit, et si elle se généralise :

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 9 défauts M7 et M10 dans l'audit `20261105f` | indice `g` : une phrase d'ouverture et de lecture devant chacun des 7 tableaux visés, tris vérifiés sur les colonnes avant d'être écrits ; oracles du contrat rejoués sans échec (727/727 citations) ; commit `9b4b2a9` sur `dev` | oui | proposé à la factory en RT-76 |

## Retours sur les documents produits

Ce que le document contrôlé dans ce tour a coûté à son gabarit :

| Document | Ce qu'il a coûté au gabarit | Verdict |
|---|---|---|
| `output/03-Syntheses/Client-A - Audit - Regles de developpement et de deploiement et contre-propositions - 20261105g.md` | Gabarit `gd-guide-de-reference` déclaré en frontmatter, mais non rendu : `tools/adr-gouvernance/rendre-comparatif-html.py` lève ENOENT sur le catalogue du 13/10, rangé sous `output/old/` (mesuré le 05/11 à 16:42). L'outil porte en dur le contenu du comparatif du 13/10 : le rendre générique est un travail du produit. | reste au produit, parce que l'outil appartient à l'espace et non au pilot |

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs --murs .` le 05/11/2026 : 10 documents. Ce lot, consacré à RT-76, n'instruit pas leur forme ; le verdict ci-dessous l'écrit pour chacun.

| Document (versions) | Verdict |
|---|---|
| Guide développeur POC-to-Prod (30) | remonté : sa forme est la famille `gd-guide-de-reference` du pilot, publiée le 28/09/2026 |
| Modèle Rapport d'audit POC-to-Prod (22) | reste au produit, parce que sa forme relève du produit d'audit (`auditcore`) et non de la bibliothèque du pilot ; non instruit plus avant par cette session |
| Propositions ADR par domaine (16) | reste au produit, parce que sa matière est propre à Client-A ; forme non instruite par cette session, à juger par le porteur |
| Schéma Process POC-to-Prod End-to-end (14) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Référentiel POC-to-Prod - Audit (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Compliance Pack - Format & Contenus des contraintes (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Process Ingénierie POC-to-Prod - Consolidation et cible (7) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Matrice Contraintes ADR Light-Complet (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Catalogue ADR Client-A par domaine (5) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
