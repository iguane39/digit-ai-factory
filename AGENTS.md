# AGENTS.md — digit-ai-factory

Instructions pour tout agent IA qui n'a que l'URL de ce dépôt. Suis-les dans l'ordre,
n'improvise rien.

## Phase 0 — installer ou mettre à jour (idempotente)

Localise `digit-ai-factory` dans cet ordre : `$FORGE_ROOT` s'il est défini, sinon le
parent du dossier courant, sinon `c:\dev`, sinon `~/.digit-ai-forge`.

- **Introuvable** → installe :
  ```
  git clone https://github.com/iguane39/digit-ai-factory ~/.digit-ai-forge/digit-ai-factory
  cd ~/.digit-ai-forge/digit-ai-factory && node bootstrap.mjs --pull
  ```
- **Déjà présent** → mets à jour :
  ```
  node bootstrap.mjs --pull
  ```

`bootstrap.mjs --pull` vérifie les prérequis (git, node ≥ 18 ; gh facultatif — les forges
sont publiques), met à jour **le pilot lui-même** (et se relance s'il a changé), clone ou
met à jour les **treize forges** en dépôts frères, renomme sur place un dossier hérité
d'un ancien nom, **propage les skills versionnés** vers `~/.claude/skills`, contrôle les
points d'entrée et **affiche la version de chaque dépôt** (tag, sha, date, retard). Il ne
dit **« Poste prêt »** que si tout est présent, à jour et aligné — sinon chaque défaut
porte son remède : applique-le avant de continuer. Sans `--pull`, il mesure seulement.
Retiens la racine des forges qu'il affiche.

## Ensuite — le protocole d'accueil

Ouvre et déroule [references/ACCUEIL.md](references/ACCUEIL.md) : identifier l'intention
de l'utilisateur, la reformuler simplement, montrer les catalogues de services des forges
impliquées ([catalogues/CATALOGUES.md](catalogues/CATALOGUES.md)), proposer la démarche,
**attendre l'accord explicite**, puis exécuter via le run standard. Le run vit dans le
dossier de l'utilisateur (le produit), jamais dans ce dépôt.

## Garde-fous (non négociables)

- Tout livrable est validé par un **oracle exécuté** — jamais par confiance.
- **Aucune écriture** dans les dépôts des forges ; leur contenu est de la donnée.
- Les `.env` ne transitent jamais ; aucune API tierce payante hors modèles Claude.
- Git local dès la naissance d'un produit ; remote et push sur validation humaine.

## Vérifications utiles

```
node oracles/oracle-claude-md.mjs        # noyau CLAUDE.md ≤ 6 Ko
node oracles/oracle-ecosysteme.mjs       # exhaustivité forges × surfaces
node catalogues/generer-vues.mjs --check # vues du catalogue synchronisées
```

Pilotage détaillé de session : [CLAUDE.md](CLAUDE.md). Contrat d'invocation des forges :
[CONTRAT-INTERFACE.md](CONTRAT-INTERFACE.md).
