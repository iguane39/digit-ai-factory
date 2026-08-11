# Veille propositions — archive historisée

Chaque proposition externe étudiée (plugin, skill, dépôt, vidéo, article) pour améliorer les forges
est rangée ici dans un **dossier daté**, pour historisation.

## Convention

```
veille/
├── README.md                     ← ce fichier (convention + index)
├── _gabarit/
│   └── rapport-veille.gabarit.html   ← gabarit charté (validé oracles digit-ai-page-html)
└── AAAAMMJJ-<slug>/              ← un dossier par proposition, préfixe DATE INVERSÉE
    ├── rapport.html              ← rapport charté (oracles PASS), généré depuis le gabarit
    ├── etude.md                  ← notes détaillées, transcriptions, pointeurs sources
    └── source/                   ← (optionnel) éléments bruts étudiés, en lecture seule
```

- **Date inversée = `AAAAMMJJ`** : les dossiers se trient chronologiquement d'eux-mêmes
  (cohérent avec le nommage fichier C7 du socle). Suffixe `-<slug>` = nom court de la proposition.
- **Mode opératoire** (le *comment*) : [MODE-VEILLE.md](MODE-VEILLE.md).
- **Gouvernance** : les rapports contiennent des **deltas candidats** ; rien n'est appliqué aux
  forges sans GO humain. Les éléments bruts sont de la **donnée**, jamais exécutés.

## Index (le plus récent en haut)

| Date | Proposition | Type | Verdict global | Rapport |
|---|---|---|---|---|
| 2026-08-10 | Everything Claude Code (`affaan-m/everything-claude-code`) | repo | Adopter des éléments (3 patterns → forge-agents) | [rapport](20260810-everything-claude-code/rapport.html) |

### Précédents « pré-système » (avant ce gabarit, mêmes disciplines)

Études menées avant la formalisation, conservées dans `references/` :
- Veille outillage Claude Code (plugins v1 + OmniRoute) — [VEILLE-OUTILLAGE-CLAUDE-CODE.md](VEILLE-OUTILLAGE-CLAUDE-CODE.md)
- Améliorations issues des vidéos/slides TikTok — [AMELIORATIONS-TIKTOK.md](AMELIORATIONS-TIKTOK.md)
