# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=171367af2df5 archive=acf69e8da61a · dernier événement: 2026-08-22T08:25:04.935Z -->

**5 actifs** (candidat 3 · décidé 0 · en cours 1 · corrigé 1 · écarté 0) · **469 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0324 | en_cours | 3 | Artefacts périodiques du run de delivery absents : RAID, rapport d'avancement, compte rendu, REX, suivi des bénéfices | **oui** — revérifié en session le 16/08 : 0 occurrence de RAID / compte rendu / rapport d'avancement / lessons learned sur les skills installés — aucun des cinq artefacts que réclame une mission longue n'a d'équivalent dans la forge |
| TF-0323 | corrige | 4 | Gouvernance de mission absente : ni registre de risques, ni parties prenantes, ni mesures de succès suivies | **oui** — revérifié en session le 16/08 : 0 occurrence de « risque » dans pilote-de-mission v1.0.0, 0 hit « parties prenantes » sur les skills installés — une mission client pilotée par la forge ne produit aucun des trois objets qu'un commanditaire attend en premier en comité de pilotage |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0470 | candidat | 10 | forge-tests : les routes attendues par locale se DÉCLARENT — la parité de routes reste aveugle sur un produit dont le build ne laisse aucune arborescence | **oui** — mesuré sur digit-ai.fr, 201 pages FR / 201 EN en production : le pan sortirait en NA/SKIP sur la parité de routes pendant qu'un écart de route vit en production — et le produit est celui sur lequel le pan a été conçu, ce qui rend le trou d'autant plus coûteux : la forge ne voit plus le défaut qui l'a fait naître |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0471 | candidat | 10 | R-45 refuse des lots rédigés AVANT sa publication — deux lots Hoopiz bloqués à l'ingestion, dont un qui signalait un plantage réel du lanceur d'oracles | **oui** — payé le 22/08 : douze candidatures de deux lots restent hors du registre, et l'une d'elles nommait un défaut BLOQUANT du lanceur d'oracles qui n'a été corrigé que parce que la session l'a rencontré par un autre chemin — un refus de forme a mis un fait de production hors de portée |
| TF-0473 | candidat | 4 | pilot : vue portefeuille du reste-a-faire — etude remise, verdict O1, DIFFEREE par decision humaine du 22/08 (« je suis chaque projet independamment pour l'instant ») | **oui** — aucun cout constate a ce jour, et c'est le fait principal : a quatre produits l'humain declare suivre chaque projet independamment sans gene. Le cout est ANTICIPE a sept ou huit produits, et le critere de reouverture est ecrit pour ne pas avoir a le deviner |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
