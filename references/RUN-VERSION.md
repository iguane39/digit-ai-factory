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

## Une vue nouvelle ne se code pas sans maquette VALIDÉE (TF-0780 — 02/09/2026)

**Le fait.** Sept vues d'une console de données ont été définies par un tableau
question / dimensions / mesures / action écrit par la session, puis codées, puis livrées — rien n'a
été montré au destinataire avant production, et le compagnon visuel n'a pas été offert « au motif
de l'autonomie ». Trois livraisons, trois refus, dont « on n'y comprend absolument rien ».

**La règle.** Un run de version qui touche une INTERFACE (vue, écran, page de données, console)
passe par l'étape design en delta (§ 3 des étapes de run) et porte au ledger une entrée
« maquette_validee » — fichier de la maquette, qui l'a validée, date — AVANT la première ligne de
code de la vue. Sans cette entrée, l'oracle d'état de forge refuse le run (règle portée par
quality-oracles, TF-0780). Une maquette n'est pas un luxe offert au destinataire : c'est le seul
moment où le refus coûte une image et non trois livraisons.

**Ce que la règle n'exige pas.** Une vue reprise à l'identique (correctif sans changement de
structure) n'a pas de maquette à faire valider ; la ledger le dit par une entrée « vue_inchangee »
avec le motif.
