# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=47bc9faa23c8 archive=686e36202d72 · dernier événement: 2026-08-14T12:10:02Z -->

**4 actifs** (candidat 4 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **204 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## forge-agents-security

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0207 | candidat | 3 | forge-agents-security : cinq categories du LLM Top 10 restent NON couvertes, dont une a portee gratuite | **oui** — le profil chatbot du pilot s'appuie sur le LLM Top 10 ; cinq categories sur dix sans regle, dont une atteignable sans depense |

## forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0204 | candidat | 9 | forge-audit : une etape de CI est ROUGE sur main depuis le 12/08 — derive de fixture non rattrapee a la release | **oui** — une etape de verification en echec sur main depuis deux jours ; toute regression reelle qu'elle attraperait serait desormais invisible dans le bruit |
| TF-0205 | candidat | 3 | forge-audit : les citations « OWASP ASVS 5.0 » du corpus emploient la numerotation de chapitres d'ASVS 4.0.x | **oui** — 44 fichiers citent un referentiel sous une numerotation qui n'est pas la sienne ; le mapping ADR/ASVS construit le 14/08 en herite |

## forge-websec

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0206 | candidat | 3 | forge-websec : prouver l'execution reelle du DAST sur un poste equipe de ZAP | **oui** — un oracle dont la branche principale n'a jamais tourne peut passer son self-test et echouer au premier usage reel |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
