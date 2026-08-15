# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=ee8fde5189ac archive=b770d2621930 · dernier événement: 2026-08-15T07:19:03.603Z -->

**6 actifs** (candidat 6 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **226 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0227 | candidat | 9 | digit-ai-forge-agents : aucun oracle du socle ne lit le TEXTE RENDU — une convention de balisage fuitee traverse tous les gates | **oui** — un livrable diffuse montrait sa plomberie ; correction en aval = retrait des marqueurs a l'emission, ajout d'une annexe de 213 lignes pour ne pas perdre la tracabilite, un L10 rattrape au passage, un controle et une seconde fixture rouge ecrits, et un rejeu complet des cinq oracles. Comptage verifie fichier par fichier : 71 occurrences dans 20260814b, zero dans 20260813a — la chaine v1 emettait depuis un modele sans marqueurs. |
| TF-0228 | candidat | 6 | digit-ai-forge-agents : check_html avertit contre le script que le pattern S-G1 du meme socle EXIGE en <head> | **oui** — quatre livrables x une dizaine d'executions d'oracle = un avertissement toujours present, jamais actionnable, qui a servi de bruit de fond a un vrai defaut. Verifie dans le code de l'oracle et dans le pattern, non deduit. |
| TF-0229 | candidat | 6 | digit-ai-forge-agents : la clause d'echappement de L13 n'est pas mecanisee — son message promet une porte qui n'existe pas | **oui** — avertissement non actionnable a chaque rejeu, sur un document qui satisfait deja l'esprit de la regle. Aucun contournement possible sans rendre cliquables des indicateurs qui comptent des elements absents de la page — ce qui serait une affordance mensongere. |
| TF-0230 | candidat | 6 | digit-ai-forge-agents : TF-0058 archive comme corrige ne l'est qu'a moitie — render_page ecrit toujours ses PNG dans le dossier du fichier audite par defaut | **oui** — 25 Mo dans le dossier des livrables, decouverts au rangement demande par l'humain ; deplacement manuel puis realignement des journaux R-32 qui pointaient les anciens chemins. output est passe de 26 Mo a 1,2 Mo apres deplacement. |
| TF-0231 | candidat | 3 | digit-ai-forge-agents : arbitrer la portee de L3 (TF-0170) — barème lié exigé sur des valeurs d'INDICATEUR, pas seulement de cellule de tableau | **oui** — deux FAIL bloquants a l'emission, resolus par l'ajout d'un bareme et d'un aria-describedby ; un aller-retour d'emission complet. Message d'oracle cite dans le journal R-32 du livrable. |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0226 | candidat | 3 | forge-tests : ruff est configure mais aucun pas de la recette ne l'execute — 18 depassements dorment | **oui** — mesure au 14/08 : ruff rend 19 erreurs et aucun des 13 pas de recette ne l appelle — le controle existe sur le disque, pas dans le processus |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
