# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=014e3de28e25 archive=37ef9ef2158a · dernier événement: 2026-08-15T15:13:46.130Z -->

**8 actifs** (candidat 8 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **252 archivés**.
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

## digit-ai-forge-pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0253 | candidat | 9 | oracle-boite-entree : normaliser les fins de ligne avant hachage (faux positifs CRLF apres checkout git) | **oui** — ouverture de run suspendue R-35, 12 faux findings, ~30 min de diagnostic et remediation manuelle sha-verifiee |
| TF-0254 | candidat | 6 | oracle-skills : option --appliquer --purger (orphelins de la copie installee) | **oui** — 2 passages d oracle supplementaires et un nettoyage manuel en pleine ouverture de run |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0256 | candidat | 4.5 | forge-tests : adaptateurs migrations/data aveugles sur disposition racine plate | **oui** — 2 pans non mesures sur les 5 audits du run malgre une surface data reelle (10 tables, contraintes nommees, migrations Up/Down testees) |
| TF-0257 | candidat | 4.5 | forge-tests : pan prompts en Larsen — exclure forge/ et les rapports de l auditeur de l inventaire | **oui** — 3 cycles de boucle consommes par le seul pan prompts, generation des livrables bloquee par un finding critique fantome |
| TF-0259 | candidat | 3 | forge-tests : message terminal explicite au refus G-1 de --livrables | **oui** — 2 executions completes d audit perdues (~5 min) avant diagnostic |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0252 | candidat | 8 | Avancement TF-0094 : aucun appelant côté campagnes d’agents — 10 campagnes de 3 à 41 min le 15/08, zéro émission | **oui** — journée du 15/08 : 10 campagnes d’agents (6 à 41 minutes chacune), 0 émission d’avancement — constaté par l’humain, invisible aux oracles (aucun ne juge le silence d’une campagne) |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
