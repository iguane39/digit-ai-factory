---
role: commandes canoniques du produit — copiables par un humain, parsables par un agent (R-20)
destinataire: humain
sources_de_verite: [package.json scripts, Makefile, CLAUDE.md produit]
verifie_le: {AAAA-MM-JJ}
---

# Commandes — {Produit}

> Un bloc par usage. Si une commande change, ce fichier change dans le même commit.

## Installer

```bash
{npm ci}
```

## Configurer l'environnement local

Le `.env` local est créé par le hook d'ouverture depuis `.env.example` (valeurs `# à fournir :`
vides) et n'est jamais écrasé s'il existe. **Une valeur ne s'écrit QUE là** : `.env.example` est
versionné, il ne porte que des NOMS de variables (R-13, TF-0869). S'il faut le refaire à la main :

```bash
cp .env.example .env        # puis renseigner les lignes « # à fournir : » dans .env, jamais dans l'exemple
```

Le chargement du `.env` n'est pas implicite — la commande le nomme :

```bash
{uv run --env-file .env python -m {module}}   # Python (uv)
{node --env-file=.env {serveur.js}}           # Node
```

## Lancer en développement

```bash
{npm run dev}   # front sur :5173, API sur :8080
```

## Tester

```bash
{npm test}
{uv run python -m forge_tests . --json}   # audit forge-tests
```

## Builder

```bash
{npm run build}
```

## Déployer en staging (forge-ops — via le pilot, GO humain pour la prod)

```bash
node {<ops>}/scripts/ops.mjs plan {cible} {build} --sortie plan.json
node {<ops>}/oracles/oracle-ops.mjs --plan plan.json   # O-5 PASS exigé
```

## Restaurer (rollback)

```bash
node {<ops>}/scripts/ops.mjs restaurer {cible}
```

## Seed de démonstration (locale uniquement)

```bash
{MODE_DEMO=1 npm run seed}   # crée les comptes d'ACCES-TEST.md
```
