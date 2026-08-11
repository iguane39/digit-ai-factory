---
role: signification de la configuration — miroir structuré de .env.example (R-20/R-22)
sources_de_verite: [.env.example]
verifie_le: {AAAA-MM-JJ}
variables:
  # exactement les noms de .env.example — l'oracle R-22 vérifie la parité
  - {PORT}
  - {DATABASE_URL}
---

# Paramétrage — {Produit}

> `.env.example` reste LA liste qui fait foi (R-13). Ce fichier explique chaque
> variable et donne les URLs/ports par environnement — staging/prod en placeholders.

## Variables

| Variable | Rôle | Format / exemple factice | Qui la fournit |
|---|---|---|---|
| {PORT} | {port d'écoute du back} | {8080} | défaut |
| {DATABASE_URL} | {connexion BDD} | {postgres://demo:demo@localhost:5432/demo} | `# à fournir :` hors local |

## URLs & ports par environnement

> **R-24 (décision du 11/08)** : tout hôte applicatif hébergé est préfixé
> `<nom-appli>-<env>.` avec env ∈ {`dev`, `qualif`, `production`} — ex.
> `https://produit-02-production.up.railway.app`. Le staging outillé de
> l'étape MEP s'appelle **qualif** dans les URLs. Local et BDD hors périmètre.

| Environnement | Front | Back/API | BDD | Notes |
|---|---|---|---|---|
| locale | {http://localhost:5173} | {http://localhost:8080} | {localhost:5432} | valeurs réelles OK (locales) |
| dev | {https://<nom-appli>-dev.<domaine>} | {https://<nom-appli>-api-dev.<domaine>} | {<HOTE_BDD_DEV>} | placeholders tant que non déployé |
| qualif | {https://<nom-appli>-qualif.<domaine>} | {https://<nom-appli>-api-qualif.<domaine>} | {<HOTE_BDD_QUALIF>} | staging de l'étape MEP (O-1…O-4) |
| production | {https://<nom-appli>-production.<domaine>} | {https://<nom-appli>-api-production.<domaine>} | {<HOTE_BDD_PROD>} | placeholders — GO humain requis |
