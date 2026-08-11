# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=0229237e00f8 archive=c2ad329a55b3 · dernier événement: 2026-08-11T14:21:52Z -->

**5 actifs** (candidat 4 · décidé 0 · en cours 1 · corrigé 0 · écarté 0) · **91 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0019 | candidat | 1.5 | Premier appel réel Gemini (lever R-D3) | non |
| TF-0020 | candidat | 1 | Producteur d'images complet | non |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0095 | candidat | 3 | Côté produits : robots.txt ouvert aux agents IA par défaut + llms.txt généré au socle web | **oui** — sans socle, chaque produit repasse par l'audit seo pour découvrir le même écart — le nœud 58 le détecterait produit par produit au lieu d'être réglé une fois à la naissance |
| TF-0094 | candidat | 2.7 | Avancement obligatoire de tout process long : réalisé / en cours / RAF / ETA, émis toutes les 2 à 5 min | **oui** — payé en réel le 11/08 sur Approval2 : 10 min d'attente aveugle, puis diagnostic obtenu seulement en inspectant l'arbre de processus Windows et le fichier muté en vol — la mutation en était au 1er module sur 70 et le run demandait >30 h, sans que rien ne l'ait signalé |

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0073 | en_cours | 1 | Rapatrier la production du CSV d'actions scoré (livrables-gen.py de la mission) — complément de TF-0056 | **oui** — le BOM du CSV réel trahit déjà un producteur hors forge |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
