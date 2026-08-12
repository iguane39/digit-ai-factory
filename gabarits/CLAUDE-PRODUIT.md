# <NOM-PRODUIT> — CLAUDE.md

<!-- Gabarit du pilot (gabarits\CLAUDE-PRODUIT.md) : l'orchestrateur remplit les <…> à
     l'ouverture du run. La section « Routage forge » est OBLIGATOIRE et vérifiée par
     oracle-conformite-projet (règle 11) — ne pas la supprimer ni la vider. -->

<Une phrase : ce que fait le produit, pour qui.>

Ce produit est construit et maintenu par la forge Digit-AI. État du run : `forge\ledger.jsonl`.

## Routage forge — obligatoire

Deux boucles, une règle : la **boucle intérieure** (développer, itérer) est libre ; tout
**verdict** (valider, livrer, faire évoluer, déployer) passe par les forges. Contourner une
route ci-dessous, c'est perdre ce qu'elle garantit — si une session s'apprête à le faire,
elle s'arrête et le dit.

| Intention | Le chemin | Jamais |
|---|---|---|
| « Relance les tests », valider, clore | audit forge_tests : `uv run python -m forge_tests "<racine-de-ce-projet>" --json --sortie forge\etapes\tests\rapport-<AAAAMMJJ>.json` depuis `<FORGE_ROOT>\digit-ai-forge-tests` — exit 3 = PARTIEL acceptable documenté ; reprise ciblée : `--reprendre <rapport>` | conclure « tests OK » sur un pytest direct |
| Corriger une anomalie, faire évoluer | consigner le retour au ledger (`type: retour`) puis **run de version** : rouvrir une session ici, coller `PROMPT-PRODUIT.md` (brief delta) ou « reprends le run » | éditer le code et livrer hors run |
| Déployer | étape MEP du pilot : staging → qualif populée → **GO humain** (`forge\DOSSIER-MEP.md`) | `docker push` / mise en prod à la main |
| Juger le rendu visuel | mode « critique d'implémentation » de forge-design (produit vs promesse du run) | verdict à l'œil |
| Signaler un défaut / retour sur les forges | consigner AU MOMENT MÊME au ledger (`type: retour`, `destinataire: <forge>`) — pas de mémoire de fin de run | retour oral perdu, ou modification d'un lot déjà remis |

**Remontée automatique vers le pilot** : toute friction forge observée en session
(convention découverte en lisant du code, faux positif d'oracle, aller-retour subi) se
consigne immédiatement au ledger. À la clôture de tout run : compilation ledger → lot `.md`
+ **sidecar `.tf.jsonl`** (gabarit dans `forge\retours\`) avec contrôle de complétude — tout
retour du ledger a sa candidature, sinon le run le déclare — puis **copie automatique des
deux fichiers dans `<pilot>\input\`**. Le geste humain de remise disparaît ; la décision
humaine demeure (tout entre en candidat au registre TODO-FORGE).

Boucle intérieure (libre, sans verdict) : `<commandes locales : pytest, ruff, serveur de dev…>`

## Commandes

- Lancer : `<commande>`
- Tests locaux (boucle intérieure) : `<commande>`
- Audit complet (verdict) : voir Routage forge ci-dessus.

## Conventions locales

- Socle projet : règles `REGLES-PROJET.md` du pilot (nommage daté des livrables dans
  `output\`/`docs\`, `Old\` jamais versionné, `.env` jamais committé, commits Conventional
  Commits français — locaux par défaut, push sur GO humain ; socle documentaire R-20..R-23,
  types des livrables au registre d'organization R-25, URLs d'environnement
  `<appli>-{dev|qualif|production}` R-24 ; voie automatisée par défaut dans toute démarche
  proposée, actions restantes classées IA/développeur/utilisateur R-29 ; tout HTML
  autonome livré porte un thème clair par défaut et une bascule sombre câblée R-30).
- `docs\projet\` (R-20) : TECHNOS, COMPOSANTS-OPS, PARAMETRAGE, ACCES-TEST, COMMANDES,
  FONCTIONNEL, ARCHITECTURE, MODELE-DONNEES (+ vues ARCHITECTURE.html et MODELE-DONNEES.html
  générées par les scripts du pilot, jamais éditées) — vues à sources de vérité déclarées
  (frontmatter), créées à l'OUVERTURE du run (gabarits du pilot) puis mises à jour PAR
  L'ÉTAPE concernée (conception → FONCTIONNEL · design/development → TECHNOS/ARCHITECTURE ·
  development → MODELE-DONNEES ancré au schéma réel (R-26) · MEP → COMPOSANTS-OPS · toute
  évolution de config → PARAMETRAGE/COMMANDES) ; comptes de démo locale derrière
  `MODE_DEMO`, jamais de secret.
- `<conventions spécifiques au produit>`

## Reprise

Forge : `<FORGE_ROOT>` (sinon relire `PROMPT-PRODUIT.md`, phase 0). Le ledger
`forge\ledger.jsonl` porte l'état exact ; les étapes closes ne se rejouent pas.
