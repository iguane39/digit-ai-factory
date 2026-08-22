# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=a6ab99d54499 archive=99370aa79320 · dernier événement: 2026-08-22T07:48:35.848Z -->

**6 actifs** (candidat 3 · décidé 0 · en cours 2 · corrigé 1 · écarté 0) · **466 archivés**.
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
| TF-0470 | candidat | 10 | forge-tests : les routes attendues par locale se DÉCLARENT — la parité de routes reste aveugle sur un produit dont le build ne laisse aucune arborescence | **oui** — mesuré sur produit-07, 201 pages FR / 201 EN en production : le pan sortirait en NA/SKIP sur la parité de routes pendant qu'un écart de route vit en production — et le produit est celui sur lequel le pan a été conçu, ce qui rend le trou d'autant plus coûteux : la forge ne voit plus le défaut qui l'a fait naître |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0462 | en_cours | 4 | pilot : aucune vue PORTEFEUILLE n'existe, et la vue par produit n'est instanciee nulle part — le gabarit TODO-PRODUIT n'a jamais ete pose dans un seul produit | **oui** — une decision prise le 17/08 (TF-0318, vue du reste-a-faire hors session) n'a produit aucun fichier dans aucun produit cinq jours plus tard — le gabarit existe, la doctrine existe, et le developpeur qui devait en beneficier declare le 22/08 qu'il n'a pas de liste exploitable |
| TF-0471 | candidat | 10 | R-45 refuse des lots rédigés AVANT sa publication — deux lots Produit-05 bloqués à l'ingestion, dont un qui signalait un plantage réel du lanceur d'oracles | **oui** — payé le 22/08 : douze candidatures de deux lots restent hors du registre, et l'une d'elles nommait un défaut BLOQUANT du lanceur d'oracles qui n'a été corrigé que parce que la session l'a rencontré par un autre chemin — un refus de forme a mis un fait de production hors de portée |
| TF-0469 | candidat | 7.5 | pilot : la recette du pilot devient ROUGE parce qu'un CANDIDAT est ecrit en prose dense — un contributeur casse la recette de tous, et paie zero | **oui** — une recette poussee ROUGE sur main sans que rien ne l'ait signale a celui qui l'a rendue rouge, et un correctif impossible par la voie evidente puisque le texte fautif appartient a un lot deja ingere |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
