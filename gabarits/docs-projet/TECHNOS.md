---
role: technologies du produit — vue ancrée sur les lockfiles (R-20/R-21)
sources_de_verite: [package-lock.json, pyproject.toml]
verifie_le: {AAAA-MM-JJ}
versions:
  # nom: "version exacte du lockfile" — l'oracle R-21 vérifie la correspondance
  {exemple}: "{1.0.0}"
---

# Technologies — {Produit}

> Vue générée/actualisée depuis les lockfiles à chaque étape design/development.
> Une version modifiée dans un lockfile sans mise à jour ici = FAIL R-21.

## Langages & runtimes

| Techno | Version | Rôle | Lien |
|---|---|---|---|
| {Python} | {3.12} | {backend} | {https://www.python.org} |

## Frameworks & librairies clés

| Techno | Version | Rôle | Lien |
|---|---|---|---|
| {exemple} | {1.0.0} | {…} | {https://…} |

## Données & stockage

| Techno | Version | Rôle | Lien |
|---|---|---|---|
| {PostgreSQL} | {16} | {BDD principale} | {https://www.postgresql.org} |

## Outillage (build, tests, qualité)

| Techno | Version | Rôle |
|---|---|---|
| {pytest} | {8.x} | {tests} |
