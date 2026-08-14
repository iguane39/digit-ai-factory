# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=de1efd1315a3 archive=9719f58baecd · dernier événement: 2026-08-14T13:11:26Z -->

**2 actifs** (candidat 2 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **213 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0212 | candidat | 3 | forge-tests : treize findings pour un seul defaut, rien ne les regroupe par cause | **oui** — le dashboard affiche « KO 13 » la ou il y a UN probleme, cote auditeur. Le classement par risque est sature par 13 occurrences d une meme cause a risque 27, et chaque element en defaut engendre 4 cas derives — 52 propositions issues d un seul angle mort. La cle de regroupement est dans les donnees : |

## forge-websec

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0206 | candidat | 3 | forge-websec : prouver l'execution reelle du DAST sur un poste equipe de ZAP | **oui** — un oracle dont la branche principale n'a jamais tourne peut passer son self-test et echouer au premier usage reel |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
