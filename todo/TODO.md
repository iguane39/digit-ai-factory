# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=2270c5aa90df archive=88c26045fb6e · dernier événement: 2026-08-15T16:04:57Z -->

**8 actifs** (candidat 8 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **267 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0269 | candidat | 6 | fiche expert-ops-railway : domaines generes, renommage API-only, origine publique en variable (complement R6 lot 20260815a) | **oui** — un renommage de domaine a l aveugle (CLI muet), retrouve par exploration API ; a capitaliser pour ne plus le payer |

## digit-ai-forge-pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0267 | candidat | 6 | oracle-conformite-projet : juger mecaniquement le suffixe d environnement des URLs R-24 | **oui** — defaut de nommage livre et presente a l humain, un renommage de domaine + une mise a jour documentaire apres cloture |

## digit-ai-forge-seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0273 | candidat | 8 | forge-seo : crux.py sans clé sort en 1 sans écrire de trace — symétriser avec le non-mesurable tracé d’agents_ia | **oui** — asymétrie constatée sur pièce entre deux volets du même service cat-seo-06 |
| TF-0274 | candidat | 6 | forge-seo : les six test_*.py sont des scripts à main() invisibles de pytest — un runner unique éviterait l’oubli | **oui** — 10 vérifications lancées une à une par les campagnes du 15/08 — chaque brief a dû les énumérer, et rien n’attrape un fichier de test oublié |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0268 | candidat | 4.5 | forge-tests pan qualif : confronter les URLs auto-referentes des pages servies a l origine auditee | **oui** — defaut SEO reel (canonique localhost) livre en recette malgre 5 audits verts ; decouvert par ricochet d un renommage de domaine, corrige en run de version (26 tests ajoutes cote produit) |
| TF-0270 | candidat | 4 | forge-tests : data._repli_textuel est du code mort ancré sur backend/tests | **oui** — fonction jamais appelée, vérifiée au balayage de la campagne — zéro effet observable aujourd’hui, piège si rebranchée telle quelle |
| TF-0272 | candidat | 4 | forge-tests : requalifier en « assume » l’entrée NON_JUGE du pan prompts (exclusion forge/ déclarée) | **oui** — contrat du registre de dette : un énoncé neuf entre en todo tant qu’un humain ne l’a pas requalifié — l’entrée restera comptée en dette ouverte à chaque run |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0271 | candidat | 12 | pilot : ETAPES-RUN prescrit un --livrables DANS le projet audité — que G-1 refuse (désormais bruyamment, exit 4) | **oui** — deux exécutions perdues le 15/08 sur un refus G-1 dont le motif était enfoui — la prescription du pilot fabrique le refus à chaque run qui la suit |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
