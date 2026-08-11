---
role: composants déployés — vue consolidée depuis forge-ops et le dossier MEP (R-20)
sources_de_verite: ["ops.mjs etat <cible>", "forge/etapes/mep/DOSSIER-MEP.md", "plan forge-ops (O-5)"]
verifie_le: {AAAA-MM-JJ}
environnements: [locale, staging, production]
---

# Composants Ops — {Produit}

> Actualisé à CHAQUE étape MEP depuis `ops.mjs etat` + le plan forge-ops.
> Instanciations datées. Sur dépôt public : valeurs d'infra réelles en placeholders,
> l'instanciation vit dans le dossier MEP du run.

## Hiérarchie (depuis la racine)

```
{produit}
├── {front}            — type: {statique|SPA} · id: {<ID_COMPOSANT>}
├── {api}              — type: {service HTTP} · id: {<ID_COMPOSANT>}
│   └── {bdd}          — type: {PostgreSQL managé} · id: {<ID_COMPOSANT>}
└── {taches}           — type: {worker} · id: {<ID_COMPOSANT>}
```

## Inventaire par environnement

| Composant | Type | Environnement | ID | URL | IP | Vérifié le |
|---|---|---|---|---|---|---|
| {api} | {service} | staging | {<ID>} | {<URL_STAGING>} | {<IP|n/a>} | {AAAA-MM-JJ} |
| {api} | {service} | production | {<ID>} | {<URL_PROD>} | {<IP|n/a>} | {AAAA-MM-JJ} |

## Cible d'exploitation forge-ops

| Cible | Plan (O-5) | Dernière release | Journal |
|---|---|---|---|
| {locale|railway|gcp|azure|aws} | {plan-<cible>.json — PASS} | {release} | {n événements} |
