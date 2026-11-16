# Retours forges — factory-digit-ai-fr — 20261116d

- **Contexte** : hors run, revue L99 en mode boucle du prompt « version traduite du site en six langues, SEO et GEO », passe 1, à la demande du créateur du 16/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 430.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Deux relecteurs aveugles du prompt réécrit ont relevé que la commande d'audit forge_tests du `CLAUDE.md` du produit vise `c:\dev\forge-digit-ai-fr`. Ce dossier n'existe pas : le dépôt s'appelle `c:\dev\Produit-87` depuis son renommage. Un prompt qui reprend la commande telle quelle audite un chemin absent.

---

## digit-ai-factory (`pilot`)

Aucun retour pour le pilot dans ce lot : le défaut est local au produit.

## La règle qui aurait évité le retour

Aucune règle neuve proposée : le défaut reste au produit.

## Remarques restées au produit

- Le chemin de l'audit forge_tests dans la table « Routage forge » du `CLAUDE.md` vise `c:\dev\forge-digit-ai-fr`, inexistant (`ls -d`, 16/11/2026). Correction au prochain run de version du produit. Généralisable : non, l'héritage du pilot ne porte pas ce chemin, il a été écrit à l'ouverture du produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
