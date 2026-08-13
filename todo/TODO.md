# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=8c1bf61f050d archive=c02d5e65401d · dernier événement: 2026-08-13T13:42:44.443Z -->

**9 actifs** (candidat 9 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **151 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0159 | candidat | 2 | Tendance du dashboard forge-tests : historiser au-delà de n-1 (multi-runs) avec points cliquables | **oui** — sans historique, la progression d'un produit sur 3 audits et plus n'est lisible nulle part — chaque campagne de fermeture perd la vue d'ensemble que la barre fixe comme niveau |

## organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0150 | candidat | 6 | Trancher le VERSIONNEMENT de old\ : C1 disait « jamais versionné » mais les old\ posés le 13/08 sont suivis par git — divergence à résoudre | **oui** — trois documents normatifs énoncent deux règles opposées sur le versionnement de old\ — une session qui suit C1 gitignore, une qui suit l'état de fait commite : incohérence garantie au prochain rangement |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0151 | candidat | 6 | Gabarit AGENT-CAMPAGNE : rappeler de régénérer les registres DÉRIVÉS du code après toute modification de leurs sources | **oui** — la dérive registre↔source a coûté une recette rouge non vue pendant une campagne ; le gabarit qui cadre toutes les campagnes ne prévient pas la classe entière de ce défaut |
| TF-0152 | candidat | 6 | Pages veille et témoin BestPractices : défauts check_html.py préexistants (L3/L4/L5) révélés au passage de la règle largeur 75-100 % | **oui** — le gabarit veille propage ses défauts à chaque rapport de veille futur (badges illisibles hors contexte, pas de bascule sombre) ; le témoin BestPractices est cité comme modèle par BEST-PRACTICES-HTML.md alors qu'il échoue à l'oracle du skill qu'il illustre — un témoin non conforme enseigne le défaut |
| TF-0156 | candidat | 6 | R-31 — généraliser le critère d'admission R-28 à TOUT objet durable (forge, skill, référentiel, règle, profil), R-28 devenant son cas particulier « forge » | **oui** — constaté sur pièces le 13/08 : pour trancher la création d'un skill, l'étude a dû raisonner par symétrie avec R-28 faute de règle couvrant les objets non-forge — le précédent existe donc déjà, non encodé, et sera re-improvisé au prochain cas |
| TF-0157 | candidat | 6 | Champ `motif_ecart` obligatoire à la transition vers `ecarte` — fermer la perte structurelle de la mémoire des refus | **oui** — trou prouvé par lecture de l'oracle (aucune exigence sur `ecarte`) ; effet non encore constaté puisque aucun item n'est en `ecarte` à ce jour — la parade est posée avant le premier écart, pas après |
| TF-0158 | candidat | 6 | S-G1 : « prefers-color-scheme à la 1re visite » contredit « clair par défaut » vécu — trancher le standard pour tous les livrables | **oui** — le même standard S-G1 appliqué à la lettre a déjà coûté un retour humain sur un livrable réel ; chaque page livrée à un lecteur en OS sombre reproduira la plainte tant que le standard n'est pas tranché |
| TF-0154 | candidat | 3 | Généraliser le contrôle pré-génération des gabarits HTML (§2 bis) à toutes les forges qui en portent — inventaire, passage aux oracles, câblage, sidecar TODO automatique | **oui** — sans contrôle systématique, chaque annonce de règle (R-30 le 12/08, E4 et H le 13/08) laisse dériver silencieusement tous les gabarits non repassés — le défaut n'est vu qu'après livraison, par l'humain, comme sur le rapport de tests du 13/08 |
| TF-0155 | candidat | 3 | Gabarit versionné « étude d'opportunité » + son oracle + câblage au registre — figer la grille qui n'existe qu'en une ligne de journal | **oui** — la grille des études n'est écrite nulle part comme spécification : un agent de campagne mandaté pour instruire une proposition n'a aucun document à lire, et chaque étude est re-improvisée (3 en 2 jours, 12 et 13/08) ; coût en temps non chiffré (aucun incident consigné), d'où preuve=2 — le trou est prouvé sur pièces, son coût ne l'est pas |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
