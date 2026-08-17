# Run de version (produit existant) — détail opérationnel

Référence chargée à la demande depuis le noyau `CLAUDE.md` (TF-0053).

Le cycle post-production n'est pas improvisé : c'est un **run de version** (retour RS-6 du
premier produit réel). Entrant : les retours consignés au ledger du run précédent
(`type: retour`, source `production` ou `produit`) + un brief delta. Le ledger du run N est
l'entrée du run N+1 — même projet, nouveau `run_open` chaîné (champ `run_precedent`,
contrôle R-19 de l'oracle de conformité).

Au rattrapage, corriger aussi les **références au nom courant du pilot** dans les chemins
absolus de PROMPT-PRODUIT/CLAUDE.md — fait d'époque : le renommage `forge-steering` →
`forge-pilot` du 09/08 (TF-0062) prescrivait une jonction de compatibilité « à ne supprimer
qu'après rattrapage » ; elle a disparu avant preuve (dette D-14, soldée le 17/08 par TF-0332).
Depuis le 17/08, PAS de jonction : un chemin périmé échoue fort et déclenche le rattrapage —
le critère rejouable (`git grep`) remplace la béquille silencieuse. Le run de version commence par le **rattrapage du socle** : `oracle-conformite-projet` sur le
projet, chaque FAIL corrigé (c'est ainsi que les produits antérieurs aux règles se mettent en
conformité — jamais en masse silencieuse hors run). Son entrant inclut les lots de
`forge\retours\` non encore traités.

**Produit importé** (dépôt repris, jamais passé par un run — TF-0086) : le rattrapage est un
mode explicite, pas un correctif au fil de l'eau — créer `docs\projet\` complet depuis
`gabarits\docs-projet\` (8 fichiers ; FONCTIONNEL rédigé depuis le code, chaque affirmation
datée ; MODELE-DONNEES **extrait du schéma réel constaté** — migrations/ORM/DDL cités en
provenance, R-26 —, ARCHITECTURE relevée de l'arborescence et des flux observés, puis les
2 vues régénérées), reconstruire `.env.example` depuis le code (R-13) AVANT que R-22 ne juge
la parité, puis dérouler l'oracle. Consigné au ledger comme `rattrapage_import`.

Étapes rejouées **en delta** :
- **conception** : exigences nouvelles/modifiées dans `EXIGENCES.json` (ids retirés via
  `identifiants_retires`, jamais réaffectés), oracles rejoués sur le référentiel entier ;
- **design** : seuls les écrans touchés, oracles sur les artefacts modifiés ;
- **development** : delta sous les mêmes gates (ruff, pytest, traçabilité des exigences du
  delta) ;
- **tests** : **audit complet** (jamais en delta — la régression ne se voit qu'en entier) ;
- **MEP** : staging + qualif populée + GO, comme un premier run (M-4 avec un vrai N-1 cette
  fois).
