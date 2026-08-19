# Run de conseil — quand le livrable est une trajectoire, pas un logiciel ni un seul document

Quatrième voie d'exécution (avec `ETAPES-RUN.md`, `RUN-VERSION.md` et `RUN-MANDAT.md`),
née du GO humain du 19/08/2026 sur l'étude
`output\03-etudes\20260819-etude-opportunite-forge-consulting.md` (verdict O1 : orchestrer
l'existant, jamais une forge dédiée). Une mission de conseil reprend des besoins, des
problématiques d'exploitation (charge, performance, temps de réponse, coûts), des CDC,
des spécifications ou des architectures — et rend un diagnostic, des recommandations, un
lotissement planifié avec démarche de ROI, puis **passe la main aux forges** lot par lot.

Différence avec le run de mandat : le mandat livre UN document et s'arrête ; le conseil
livre une **trajectoire multi-lots** dont chaque lot devient l'entrant d'un run de build.

## Ce que le socle exige quand même (invariant, jamais négocié)

Identique au run de mandat (`RUN-MANDAT.md` §« Ce que le socle exige ») : socle du run
complet, ledger dès l'ouverture (`run_open`, `invocation` par service mobilisé,
`oracles_verdict`, `retour`, `run_close`), fraîcheur (`--ff-only` + `bootstrap --pull`),
routage et mesure (CONTRAT-INTERFACE §4/§4 bis). S'y ajoute : **lecture seule absolue
sur le SI étudié** — un run de conseil ne modifie jamais le système qu'il instruit.

## La séquence (cinq blocs, l'existant orchestré)

1. **Reprendre (C1)** — qualifier la matière reçue par `qualifie-l-entrant`
   (forge-conception) : CDC, spécifications, architectures, produit existant. Si la
   compréhension complète d'un existant est requise : **mode rétro-modèle**
   (`RETRO-MODELE.md`, oracle RM1-RM5). Une problématique d'exploitation sans document
   s'instruit directement au bloc 2.
2. **Diagnostiquer (C2)** — objectiver avant de recommander :
   `gabarits\DIAGNOSTIC-EXPLOITATION.md` — chaque mesure exécutée et sourcée
   (forge-data `mesurer_base.py` en lecture seule pour les bases ; forge-audit sur
   mandat pour la gouvernance ; forge-observability pour les sondes). Jugé par
   `oracles\oracle-livrable-conseil.mjs` (LC1-LC5).
3. **Recommander (C3)** — directions, solutions, corrections, optimisations : chaque
   recommandation **ancrée aux mesures** du diagnostic (id `M-xx`), alternatives
   fermées, arbitrages assumés. Une solution existante à challenger passe par
   `contre-expertise` ; un avis sans mesure n'entre pas au livrable.
4. **Lotir et planifier (C4)** — `gabarits\DEMARCHE-ROI.md` : lots « utiles,
   utilisables, utilisés » (les trois critères par lot, binaires), trajectoire de
   construction et de migration (applications ET bases — plans forge-ops `plan <cible>`
   + oracle O-5 pour les cibles cloud), plan daté par `pilote-de-mission`, chiffrage
   commercial délégué à `digit-ai-propale` s'il y a propale. Jugé par le même oracle.
5. **Remettre aux forges (C5)** — le contrat d'interface : chaque lot GO sort comme
   **entrant de build** — `PROMPT-PRODUIT.md` rempli (nouveau produit) ou brief delta
   d'un run de version (produit existant) — déposé dans le dossier du produit, tracé au
   ledger (`invocation` vers la voie choisie). Le conseil ne construit rien lui-même :
   il alimente les runs qui construisent.

## Ce qui ne s'applique PAS (et ne se singe pas)

- Pas d'`EXIGENCES.json` scellé au niveau mission — chaque LOT qui part en build aura sa
  conception à 4 verbes dans SON run.
- Pas de MEP portée par le conseil — la MEP appartient au run de build de chaque lot,
  avec ses gates M-1…M-5 et son GO humain.
- Pas de moteur de diagnostic automatique — le diagnostic est instruit par mission,
  l'oracle juge le LIVRABLE (mesures sourcées, recommandations ancrées), pas le système.
- Aucune API tierce payante hors modèles Claude ; aucun credential exposé (plans
  forge-ops plan-first).

## Gates humains

GO humain à trois points incompressibles : acceptation du diagnostic (fin du bloc 2),
choix des lots et de la trajectoire (fin du bloc 4), lancement de chaque run de build
(bloc 5, un GO par lot). `bloque_question` entre deux, jamais de réponse inventée.

## Clôture

Livrables nommés R-4 dans `output\`, oracle-livrable-conseil PASS sur diagnostic et
démarche ROI (journaux sous `forge\oracles\`), synthèse au format
`gabarits\RESTITUTION.md`, `run_close` au ledger. Le suivi des bénéfices (section 4 de
la démarche ROI) porte ses rendez-vous datés : chaque revue est un mini-mandat qui
compare les mesures d'alors aux promesses des lots.
