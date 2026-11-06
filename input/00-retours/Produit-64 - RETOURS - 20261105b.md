# Lot de retours — Produit-64 → digit-ai-factory (agents d'arrière-plan coupés en mode non interactif) — 2026-11-05, indice b

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, exemption des messages d'attente de `oracles/hook-restitution.mjs` (TF-1649) et gabarit d'orchestration des agents.

**Origine** : session non interactive (`claude -p`) du 05/11/2026, audit des règles de développement et de déploiement, entre 14:54 et 15:24 (heure de Paris). Erreur relevée par le porteur à la reprise : « Ton tour précédent s'est terminé pendant que tes agents de lecture tournaient en arrière-plan : en mode `-p`, la session s'arrête quand ton tour finit, et Claude Code a coupé les agents restants au bout de 10 minutes. »

Ce lot porte **1 retour** (RT-75).

- **Contexte** : une session de ce produit, hors run (audit documentaire, 17 agents de lecture prévus).
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé le 2026-11-05 ; remise consignée au bas de ce fichier.

---

## digit-ai-factory (exemption des messages d'attente, orchestration des agents)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-75 | majeur | générique | **En mode non interactif, un tour clos sur un message d'attente arrête la session et coupe les agents d'arrière-plan.** Le 05/11/2026, la session a lancé 17 agents de lecture en arrière-plan, puis a clos son tour sur un message d'attente (« En attente des derniers relevés… ; je reprends dès leur arrivée »). Le hook de fin de tour l'a admis, au titre de l'exemption créée par TF-1649 (message d'attente de trois lignes tant qu'une tâche du tour n'est pas revenue). En `claude -p`, la session s'est arrêtée avec le tour, et Claude Code a coupé les agents restants au bout de 10 minutes. Deux relevés ont été perdus : la lecture des ADR, réduite à 10 sur 20, et un relevé de pièces de Design Authority. Il a fallu une reprise humaine et trois agents de plus (20 lancés au lieu de 17). Les fichiers `tasks/<id>.output` des agents étaient vides (0 octet) : les relevés n'existaient que dans les notifications. | 1) En session non interactive, l'exemption de TF-1649 ne s'applique pas. Le hook refuse une fin de tour tant qu'une tâche ou un agent d'arrière-plan du tour n'est pas revenu, et son message dit de relancer au premier plan. La détection du mode non interactif est *à établir* : non vérifiée dans cette session. 2) Le gabarit d'orchestration écrit la règle « en `-p`, tout agent se lance au premier plan (`run_in_background: false`) et le tour ne se clôt pas avant leurs résultats ». C'est la consigne donnée par le porteur à la reprise. 3) Tout agent de lecture écrit son relevé dans un fichier du dossier de travail, au lieu de le rendre seulement dans son message : la perte se limite alors à ce qui n'est pas encore écrit. 4) Fixture : une session simulée qui lance un agent d'arrière-plan et clôt sur une attente, refusée en non interactif, admise en interactif. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-75** : classe `tour-clos-sur-une-attente` (TF-1649). La correction de TF-1649 admet le message d'attente ; elle est juste en interactif, où la session survit au tour, et dangereuse en non interactif, où elle ne survit pas.

## Rattachement

Registre interrogé le 05/11/2026 : `grep -i -E "arri.re-plan|background" todo/TODO.jsonl` → 6 ligne(s) trouvée(s), dont TF-1132 (agent de campagne qui s'arrête en attendant une vérification d'arrière-plan, corrigé au gabarit AGENT-CAMPAGNE), TF-1649 (exemption des messages d'attente, corrigé), TF-1669 (récidive, écarté). Aucun item ne traite le mode non interactif.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Relevés perdus de l'audit du 05/11/2026 | relance au premier plan de la suite des ADR, du compte des écartées et du relevé DA1 ; pièce 1/3 des ADR réécrite sur disque depuis le message reçu | oui | proposé à la factory en RT-75 |

## Retours sur les documents produits

| Document | Ce qu'il a coûté au gabarit | Verdict |
|---|---|---|
| `output/03-Syntheses/Client-A - Audit - Regles de developpement et de deploiement et contre-propositions - 20261105f.md` | Le rendu HTML par la famille `gd-guide-de-reference` a échoué. L'outil de l'espace `tools/adr-gouvernance/rendre-comparatif-html.py` ouvre en dur le catalogue ADR du 13/10, passé dans `output/old/` (erreur ENOENT mesurée). Sa fonction `fiches_gde0201` attend 23 règles, alors que le guide en compte 25 depuis la v1.2 (lu dans le code, non exécuté). Le livrable est remis en Markdown seul. | reste au produit, parce que l'outil appartient à l'espace et non au pilot : réparation à inscrire au registre RESTE-A-FAIRE du produit |

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs --murs .` le 05/11/2026 : 10 documents. Ce lot, consacré à RT-75, n'instruit pas leur forme ; le verdict ci-dessous l'écrit pour chacun.

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

Aucun garde-fou de plateforme relevé. La coupure des agents au bout de 10 minutes après la fin de session en `-p` est un comportement de Claude Code, rapporté par le porteur et non mesuré par la session ; elle sert de contexte à RT-75.
