# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=9d9959c42899 archive=18c4f806356d · dernier événement: 2026-08-15T15:29:26.929Z -->

**14 actifs** (candidat 14 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **253 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0255 | candidat | 6 | run-oracles-conception : NON_JUGE quand l artefact d entree d un sous-oracle n existe pas | **oui** — verdict agrege inutilisable en l etat : l orchestrateur a du rejouer les 5 oracles un a un pour prononcer l etape |

## digit-ai-forge-ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0258 | candidat | 9 | fiche expert-ops-railway : 4 pieges du premier deploiement reel (D-P1 railway soldee) | **oui** — 8 tentatives de deploiement (succes a la 8e), 2 mandats humains intermedaires, ~1h30 de diagnostic dont l essentiel evitable avec ces 4 faits en fiche |

## digit-ai-forge-organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0265 | candidat | 1 | forge-organization / pilot : le registre des types n'est pas decouvrable depuis un projet | **oui** — 10 constats R-25 et un aller-retour complet de renommage sur 28 livrables |

## digit-ai-forge-pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0253 | candidat | 9 | oracle-boite-entree : normaliser les fins de ligne avant hachage (faux positifs CRLF apres checkout git) | **oui** — ouverture de run suspendue R-35, 12 faux findings, ~30 min de diagnostic et remediation manuelle sha-verifiee |
| TF-0254 | candidat | 6 | oracle-skills : option --appliquer --purger (orphelins de la copie installee) | **oui** — 2 passages d oracle supplementaires et un nettoyage manuel en pleine ouverture de run |
| TF-0266 | candidat | 1 | pilot : RUN-MANDAT exige un socle PASS que l'existant rend inatteignable | **oui** — 211 constats, 28 renommages, 30 messages de commit reecrits avant de pouvoir commencer l'audit demande |

## digit-ai-forge-seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0260 | candidat | 1 | forge-seo : agents_ia.py ne degrade pas quand les logs manquent | **oui** — volet crawlers IA de cat-seo-06 non delivre sur la mission auxportesdelabaie.fr du 15/08, refus sec du script sans --logs |
| TF-0261 | candidat | 1 | forge-seo : le crawler plafonne rend un chiffre plausible et faux | **oui** — 89 orphelines annoncees contre 10 reelles sur la mission du 15/08 ; une relance manuelle --max 320 pour obtenir le vrai chiffre |
| TF-0262 | candidat | 1 | forge-seo : le controle de balisage doit etre indifferent a l'ordre des attributs | **oui** — paye deux fois : une action du rapport precedent fondee sur un faux constat, puis la contre-verification manuelle du 15/08 |
| TF-0263 | candidat | 1 | forge-seo : confronter les sources d'inventaire d'URLs en indicateur de premier plan | **oui** — rapport precedent fonde sur 27 pct du site reel (79 pages sur 291) |
| TF-0264 | candidat | 1 | forge-seo : laboratoire et terrain divergent d'un facteur cinquante au noeud Performance | **oui** — verdict conforme rendu sur 21 ms labo contre 1162 ms TTFB p75 terrain sur la mission du 15/08 |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0256 | candidat | 4.5 | forge-tests : adaptateurs migrations/data aveugles sur disposition racine plate | **oui** — 2 pans non mesures sur les 5 audits du run malgre une surface data reelle (10 tables, contraintes nommees, migrations Up/Down testees) |
| TF-0257 | candidat | 4.5 | forge-tests : pan prompts en Larsen — exclure forge/ et les rapports de l auditeur de l inventaire | **oui** — 3 cycles de boucle consommes par le seul pan prompts, generation des livrables bloquee par un finding critique fantome |
| TF-0259 | candidat | 3 | forge-tests : message terminal explicite au refus G-1 de --livrables | **oui** — 2 executions completes d audit perdues (~5 min) avant diagnostic |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
