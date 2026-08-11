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

| Environnement | Front | Back/API | BDD | Notes |
|---|---|---|---|---|
| locale | {http://localhost:5173} | {http://localhost:8080} | {localhost:5432} | valeurs réelles OK (locales) |
| staging | {<URL_FRONT_STAGING>} | {<URL_API_STAGING>} | {<HOTE_BDD_STAGING>} | placeholders — résolus par l'environnement du run |
| production | {<URL_FRONT_PROD>} | {<URL_API_PROD>} | {<HOTE_BDD_PROD>} | placeholders — GO humain requis |
