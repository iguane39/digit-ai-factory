# Run de version (produit existant) — détail opérationnel

Référence chargée à la demande depuis le noyau `CLAUDE.md` (TF-0053).

Le cycle post-production n'est pas improvisé : c'est un **run de version** (retour RS-6 du
premier produit réel). Entrant : les retours consignés au ledger du run précédent
(`type: retour`, source `production` ou `produit`) + un brief delta. Le ledger du run N est
l'entrée du run N+1 — même projet, nouveau `run_open` chaîné (champ `run_precedent`,
contrôle R-19 de l'oracle de conformité).

Le run de version commence par le **rattrapage du socle** : `oracle-conformite-projet` sur le
projet, chaque FAIL corrigé (c'est ainsi que les produits antérieurs aux règles se mettent en
conformité — jamais en masse silencieuse hors run). Son entrant inclut les lots de
`forge\retours\` non encore traités.

Étapes rejouées **en delta** :
- **conception** : exigences nouvelles/modifiées dans `EXIGENCES.json` (ids retirés via
  `identifiants_retires`, jamais réaffectés), oracles rejoués sur le référentiel entier ;
- **design** : seuls les écrans touchés, oracles sur les artefacts modifiés ;
- **development** : delta sous les mêmes gates (ruff, pytest, traçabilité des exigences du
  delta) ;
- **tests** : **audit complet** (jamais en delta — la régression ne se voit qu'en entier) ;
- **MEP** : staging + qualif populée + GO, comme un premier run (M-4 avec un vrai N-1 cette
  fois).
