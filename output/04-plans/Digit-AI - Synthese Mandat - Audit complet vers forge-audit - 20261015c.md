---
destinataire: humain
---

# Synthèse Mandat — « audit complet » ouvre désormais forge-audit, chez tous les produits (15/10/2026)

## 0. Synthèse d'ouverture

Un développeur qui tape « lance un audit complet du projet » chez un produit est maintenant dirigé vers la forge d'audit, et non plus vers la campagne de tests. Je l'ai vérifié en rejouant sa phrase exacte chez un produit dont les consignes portaient encore l'ancienne route : la session a ouvert la forge d'audit. Les 21 produits dont les consignes étaient périmées ont reçu un lot de travaux pour les corriger. Aucune décision ne vous est demandée.

## 1. En-tête d'identification

Application de votre décision « 1a » sur le routage de l'audit complet, dans le pilot digit-ai-factory et chez les produits du poste. Période : 15/10/2026 de 16:40 à 17:42, heure de Paris (UTC+02:00), soit 1 h 02. Session Claude Opus 5.5, sans agent ; rejeu par la CLI Claude Code de l'extension VS Code.

Intention de la demande : qu'une demande d'audit complet ouvre forge-audit chez n'importe quel produit, et que la correction tienne cette fois.

Test rétro : le résultat sert l'intention. La phrase de la capture a été rejouée chez un produit et a pris la bonne route. La correction tient sans attendre que chaque produit ait appliqué son lot, car le détrompeur agit dès le message saisi.

## 2. Verdict en une ligne

Rejeu de la phrase de la capture : route forge-audit, 0 appel à forge_tests ; recette complète du pilot 218 sur 218 ; 21 produits sur 21 ont reçu la route dans un lot de travaux.

## 3. Décisions attendues

Rien n'attend votre décision : D-1 a été tranchée par votre réponse « 1a », et tout ce qu'elle commandait est fait.

## 4. Traité

Chaque couche de la solution proposée est en place, avec sa preuve exécutée.

- **Détrompeur.** `oracles/hook-lexique.mjs` reconnaît une demande d'audit du produit et injecte la route forge-audit avant toute action. Sa recette passe de 48 à 58 cas, tous verts. Les 6 cas épargnés (audit SEO, audit de sécurité, audit d'un skill, relance des tests) en sont les rouges. Le premier jet en a fait échouer un, « l'audit des tests », qui passe après correction.
- **Rejeu chez un produit.** Chez Produit-83, `claude -p "lance un audit complet du projet"` en mode plan reçoit la ligne « [audit — hook-lexique] » dans son transcript. La session lit `digit-ai-forge-audit/tools` et cherche `forge/audit`, sans appel à forge_tests. Le `CLAUDE.md` de ce produit portait encore l'ancienne route.
- **Gabarit.** `gabarits/CLAUDE-PRODUIT.md` route « Auditer le produit » vers forge-audit, et la demande de l'humain vaut mandat. La commande est la vraie : `init-audit-workspace`, puis `verifier-rapport` et `build-rapport`. L'ancienne ligne citait `tools/verifier.mjs`, qui juge le dépôt de forge-audit et pas le produit. La section Commandes sépare l'audit complet et la campagne de tests.
- **Doctrine.** Le noyau du pilot, la table d'accueil et `references/RUN-VERSION.md` réservent « audit » à forge-audit. `oracle-claude-md` rend PASS, noyau à 6 139 octets sur 6 144.
- **Héritage.** `gabarits/HERITAGE.json` passe en 1.23.0 et exige le motif `init-audit-workspace` dans le `CLAUDE.md` du produit. Le relevé nomme 21 produits incomplets.
- **Conformité.** La règle 11 d'`oracle-conformite-projet` exige la route d'audit. Le cas rouge neuf passe, et sa recette rend 172 sur 172.
- **Lots de travaux.** `todo/emettre-travaux.mjs` dit de REMPLACER les 2 lignes fautives, pas de coller le motif, et un cas de recette le garde (37 sur 37). Un premier dépôt a montré un défaut de l'émetteur : 4 produits sans la route, parce que leur `CLAUDE.md` était déjà incomplet d'un autre motif. Après correction de la clé d'inclusion, ils sont 0 sur 21 à ne pas l'avoir, et 2 autres produits ont reçu un motif qui leur restait caché de la même façon.
- **Recettes réparées au passage.** 2 recettes avaient 11 cas rouges dès HEAD, sans lien avec ce travail : leur fixture ne portait pas la garde d'identité sortante exigée depuis ce matin. Les fixtures la portent, et la recette complète rend 218 sur 218.
- **Publication.** Les 4 commits du pilot (64f1524f, 177cd99d, 88d27c5f et celui de cette synthèse) sont envoyés : après `git fetch`, `git rev-list --left-right --count HEAD...origin/main` rend 0 et 0.
- **Registre.** `node todo/journaliser.mjs` passe TF-1735 de « décidé » à « corrigé », avec le rejeu en gain constaté ; `oracle-todo` rend PASS.

## 5. Non traité

- **Application des lots chez les produits.** Motif : hors_mandat, un produit corrige son propre dépôt à son prochain travail, et le pilot n'écrit pas chez lui.
- **Les 2 produits sans hook de saisie.** Motif : hors_mandat, `apdlb-com-livrets` et `Produit-12` ne seront protégés qu'après application de leur lot, faute de détrompeur câblé chez eux.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Appliquer les 5 corrections | J'ai aussi corrigé la commande forge-audit du gabarit, la clé d'inclusion de l'émetteur et 2 fixtures | La commande citée jugeait le mauvais dépôt, l'émetteur cachait le motif à 4 produits, et la recette complète devait être verte pour juger le reste |

## 7. Risques

- **Détrompeur trop large.**
  - Énoncé : « le rapport d'audit du projet est prêt » reçoit aussi la ligne de route.
  - Signal : une session qui lance forge-audit sans qu'on le lui demande.
  - Parade : la ligne ne bloque rien et dit seulement la route ; limite déclarée dans le module.
- **Lots non appliqués.**
  - Énoncé : un produit qui n'ouvre pas sa boîte d'entrée garde son ancienne ligne de routage.
  - Signal : le relevé d'héritage de chaque ouverture du pilot, qui le nomme incomplet.
  - Parade : le détrompeur couvre déjà les produits relayés, soit 19 sur 21.

## 8. Prochaines actions

Il reste une seule action, donc aucun ordre à trancher, et elle vient après la publication déjà faite, parce qu'un produit lit le pilot du poste qui l'héberge : chacun lit son lot à sa prochaine session.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1735 | Appliquer le lot de travaux à la prochaine session de chaque produit | auto_ia | hors_mandat : le produit écrit seul dans son dépôt | `input\00-travaux\pilot - TRAVAUX - 20261015*.md` chez chaque produit | Le `CLAUDE.md` du produit garde l'ancienne ligne, et seul le détrompeur le corrige |

## 9. Traces

- Commits du pilot 64f1524f, 177cd99d, 88d27c5f et celui de cette synthèse, publiés
- `oracles/hook-lexique.mjs` et `oracles/hook-lexique.test.mjs`
- `gabarits/CLAUDE-PRODUIT.md` et `gabarits/HERITAGE.json` (1.23.0)
- `oracles/oracle-conformite-projet.mjs` et `oracles/self-test.mjs`
- `todo/emettre-travaux.mjs`, `todo/emettre-travaux.test.mjs` et `todo/ingerer-r47.test.mjs`
- `CLAUDE.md`, `references/ACCUEIL.md` et `references/RUN-VERSION.md`
- `todo/TODO.jsonl` : TF-1735 décidé puis corrigé
- Transcript du rejeu sous `~\.claude\projects\c--dev-Produit-83\`
