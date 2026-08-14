# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=e9057cb7f20e archive=610fb0723376 · dernier événement: 2026-08-14T10:01:43Z -->

**12 actifs** (candidat 12 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **191 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0189 | candidat | 9 | pilot — règle 33 « sécurité offensive sur mandat » + branchement ASVS/WSTG aux étapes du run | **oui** — l'écosystème porte un contrat de sécurité que rien ne branche : il est payé et non opposé |
| TF-0202 | candidat | 9 | Règle « un pan qui dépense est sur mandat » + sonde de cadence sur les dates de dépréciation fournisseur | **oui** — la cadence est documentaire : une date de retrait de modèle connue à l'avance n'alerte personne, et l'arrêt de la plateforme Evals d'OpenAI au 2026-11-30 est déjà au calendrier |
| TF-0196 | candidat | 6 | Sidecar de retours : le schéma émis par les produits ne passe pas l'ingesteur R10 — normalisation à la main à chaque lot | **oui** — le lot a exigé une normalisation manuelle avant ingestion ; tout lot produit émis au même format la réclamera |
| TF-0197 | candidat | 6 | R-4 contre le gabarit d'étude : le pilot prescrit un nommage que son propre oracle de conformité refuse | **oui** — 5 études sur 5 en FAIL R-4 ; toute étude future héritera du même verdict, et un FAIL qu'on apprend à ignorer cesse d'être un oracle |

## forge-agents-security

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0188 | candidat | 2 | forge-agents-security — corpus d'injection versionné + mapping LLM Top 10 : l'exigence LLM01 est déclarée sans vérificateur | **oui** — une exigence de profil sans oracle est une exigence qui ne tient pas — elle passe le gate sans être opposée |

## forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0190 | candidat | 2 | forge-audit — mapping ADR <-> ASVS : la gouvernance et l'exécution citent des référentiels disjoints | **oui** — sans mapping, la conformité se déclare deux fois et se prouve zéro |

## forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0198 | candidat | 6 | taste-skill instruit comme BARRE externe (niveau de qualité d'interface générée), pas comme skill installé | **oui** — l'écosystème mesure le rendu (12 oracles design, oracle slop) mais rien ne PRESCRIT au constructeur les gestes qui évitent un rendu générique |
| TF-0199 | candidat | 4.5 | Extraire de taste-skill les règles vérifiables COMPATIBLES A1 vers le socle, avec attribution — et écarter nommément les autres | **oui** — des règles vérifiables existent en amont et l'écosystème les réinvente ou s'en passe ; sans extraction attribuée, il faudrait admettre le skill entier avec ses prescriptions interdites |

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0200 | candidat | 3 | forge-tests : pan `prompts` v0 — inventaire des prompts, ÉPINGLAGE des modèles, corpus Q/R, seuils — sans aucun appel modèle | **oui** — un remap d'alias fournisseur change le comportement sans qu'un commit ne bouge et personne ne le voit — claude-opus-4-1 a été retiré le 2026-08-05, neuf jours avant l'étude ; Google remappe ses alias -latest à dates fixes |
| TF-0201 | candidat | 2 | forge-tests + forge-agents : volet STABILITÉ des réponses par rejeu N fois, opt-in et sous gate budget | **oui** — sans rejeu, une réponse instable passe pour un succès ou un échec selon le hasard du run, et la non-régression mesurée ne veut rien dire |

## forge-websec

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0186 | candidat | 3 | forge-websec — référentiel WSTG curé : la méthode de test de sécurité, absente à 0 occurrence de l'écosystème | **oui** — le contrat ASVS de websec dit QUOI exiger et rien ne dit COMMENT le vérifier — le cas de test est réinventé à chaque campagne |
| TF-0187 | candidat | 3 | forge-websec — oracle-dast.mjs enveloppant ZAP : lève la dette D-W1, seule brique offensive automatisable | **oui** — aucune vérification active n'existe : la forge ne juge que la configuration et les dépendances, jamais le comportement de l'application servie |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
