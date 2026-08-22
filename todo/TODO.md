# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=6cb03981859b archive=acf69e8da61a · dernier événement: 2026-08-22T08:51:02.367Z -->

**11 actifs** (candidat 9 · décidé 0 · en cours 1 · corrigé 1 · écarté 0) · **469 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0324 | en_cours | 3 | Artefacts périodiques du run de delivery absents : RAID, rapport d'avancement, compte rendu, REX, suivi des bénéfices | **oui** — revérifié en session le 16/08 : 0 occurrence de RAID / compte rendu / rapport d'avancement / lessons learned sur les skills installés — aucun des cinq artefacts que réclame une mission longue n'a d'équivalent dans la forge |
| TF-0478 | candidat | 6.7 | quality-oracles : un verdict ne dit pas SUR QUEL CONTENU il a ete rendu — un CONFORME cite en restitution vieillit en silence, ni re-verifiable ni invalidable | **oui** — MESURE le 22/08 sur le parc reel, et le resultat est total : sur les 2 journaux d'oracles confrontables a leur cible, 2 portent un verdict PASS rendu AVANT une modification de la cible (etude i18n : cible modifiee 5,9 min apres le verdict ; etude portefeuille : 1,5 min apres). Deux « PASS » sont donc citables aujourd'hui alors qu'ils ne portent plus sur le contenu present, et RIEN ne les distingue d'un verdict frais. Echantillon petit (2 journaux) — mais le taux de perime y est de 2/2, et le mecanisme est structurel, pas accidentel. |
| TF-0475 | candidat | 3 | agents, design : 18 des 20 champs de frontmatter d'un SKILL.md ne sont posés nulle part — isolation de contexte, cadrage du déclenchement et restriction d'outils ne sont câblés sur aucun des 17 skills | **oui** — mesuré et non payé sur pièce : 17 SKILL.md sur 17 à deux champs, 18 champs disponibles à zéro occurrence, dont les trois seuls mécanismes de la plateforme capables d'isoler un contexte, de cadrer un déclenchement et de restreindre un outil |
| TF-0323 | corrige | 4 | Gouvernance de mission absente : ni registre de risques, ni parties prenantes, ni mesures de succès suivies | **oui** — revérifié en session le 16/08 : 0 occurrence de « risque » dans pilote-de-mission v1.0.0, 0 hit « parties prenantes » sur les skills installés — une mission client pilotée par la forge ne produit aucun des trois objets qu'un commanditaire attend en premier en comité de pilotage |

## digit-ai-forge-seo-geo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0476 | candidat | 10 | forge-seo-geo : le noeud 57 accepte un taux de citation sans plan de mesure — le controle « pas de verdict affirmatif sans la donnee nommee » (TF-0264) ne capte que la famille CrUX | **oui** — mesure sur les artefacts reels : noeud_exige_terrain() rend False sur la source du noeud 57 et True sur celle du noeud 31 (predicat litteral "crux") ; la reserve « ne jamais presenter le taux comme une metrique de suivi fiable » compte 1 occurrence dans le referentiel et 0 dans la fiche que l'auditeur remplit. Le cout se paie dans un livrable client remis : la forge a deja produit un rapport d'audit reel, et le service de runs recurrents (cat-seo-05) transformerait ce taux en tendance — sur une grandeur dont la litterature 2026 mesure que la marque explique 1,5 % de la variance |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0470 | candidat | 10 | forge-tests : les routes attendues par locale se DÉCLARENT — la parité de routes reste aveugle sur un produit dont le build ne laisse aucune arborescence | **oui** — mesuré sur digit-ai.fr, 201 pages FR / 201 EN en production : le pan sortirait en NA/SKIP sur la parité de routes pendant qu'un écart de route vit en production — et le produit est celui sur lequel le pan a été conçu, ce qui rend le trou d'autant plus coûteux : la forge ne voit plus le défaut qui l'a fait naître |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0471 | candidat | 10 | R-45 refuse des lots rédigés AVANT sa publication — deux lots Hoopiz bloqués à l'ingestion, dont un qui signalait un plantage réel du lanceur d'oracles | **oui** — payé le 22/08 : douze candidatures de deux lots restent hors du registre, et l'une d'elles nommait un défaut BLOQUANT du lanceur d'oracles qui n'a été corrigé que parce que la session l'a rencontré par un autre chemin — un refus de forme a mis un fait de production hors de portée |
| TF-0479 | candidat | 7.5 | veille : le prompt de veille ne debouche sur AUCUN canal d'entree au registre — ce qu'une veille trouve n'a pas de chemin norme vers une candidature | **oui** — MESURE le 22/08 sur les deux registres : sur 473 items TF ecrits depuis l'origine, 2 seulement ont une veille pour source — 0,4 %, alors que la veille est un canal declare de l'ecosysteme et qu'elle a produit trois documents d'etude (ETUDE-EVERYTHING-CLAUDE-CODE, VEILLE-OUTILLAGE-CLAUDE-CODE, AMELIORATIONS-TIKTOK). Le canal existe, il produit, et sa production n'atteint pas le registre : c'est le dernier kilometre qui manque, pas la veille. |
| TF-0474 | candidat | 4.5 | pilot : cinq mécanismes d’empreinte sha256 coexistent sans format commun — la même classe de défaut est redécouverte forge par forge | **oui** — sept items archivés de la même classe, traités un par un, aucun n’ayant produit de convention : TF-0072, TF-0247, TF-0253, TF-0288, TF-0294, TF-0298, TF-0338. Deux redécouvertes strictes établies par lecture des titres au registre — le défaut de fins de ligne de TF-0072 (forge-seo) rejoué en TF-0253 (pilot), et le trou de scellement de TF-0288 rejoué en TF-0298 (forge-ops, canary). Anti-doublon exécuté le 22/08/2026 sur les 2338 événements des deux registres : aucun item existant ne porte le format partagé — une seule occurrence sur le motif « format/empreinte commun », TF-0298, qui traite un point de scellement manquant dans UNE forge, pas la convention. |
| TF-0473 | candidat | 4 | pilot : vue portefeuille du reste-a-faire — etude remise, verdict O1, DIFFEREE par decision humaine du 22/08 (« je suis chaque projet independamment pour l'instant ») | **oui** — aucun cout constate a ce jour, et c'est le fait principal : a quatre produits l'humain declare suivre chaque projet independamment sans gene. Le cout est ANTICIPE a sept ou huit produits, et le critere de reouverture est ecrit pour ne pas avoir a le deviner |
| TF-0477 | candidat | 4 | La loi 4 dit ou vit une donnee volatile, jamais qu'une note ne doit pas la RECOPIER — la derive se detecte claim par claim, sur un seul document, et la classe se re-paye | **oui** — mesure executee le 22/08 sur le clone au commit 6aa0b20 : fraicheur-claims.json porte 6 claims, TOUS sur INVENTAIRE.md — zero claim sur un README de forge, alors que les deux derniers defauts avoues de cette classe (TF-0311, TF-0334) etaient dans le README de forge-tests ; et le seul document couvert porte environ 81 assertions de denombrement (mesure par proxy, ids TF, versions et dates retires — chiffre approximatif et declare comme tel) pour 6 sondes, soit moins d'une sur dix. Cout deja paye et trace au registre : TF-0113 et TF-0115 (6 derives en deux campagnes), TF-0311 puis TF-0334 sur le meme fichier, TF-0247 (3 citations perimees dont la correction change l'empreinte de grille), TF-0358 (sous-chemin perime), TF-0456 (dates de README). Le score porte un arbitrage a revoir : l'effort est note 3 parce que la regle est bon marche mais le balayage ne l'est pas ; si la forge tranche pour la seule regle de redaction, l'effort tombe a 1 et la valeur double. |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
