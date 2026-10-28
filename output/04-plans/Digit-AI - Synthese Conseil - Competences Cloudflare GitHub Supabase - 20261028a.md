---
destinataire: humain
---

# Synthèse Conseil — compétences Cloudflare, GitHub et Supabase identifiées, 17 propositions au registre (28/10/2026)

## 0. Synthèse d'ouverture

L'étude est faite : les trois plateformes sont inventoriées en entier, 793 fonctionnalités datées du jour, et 17 compétences manquantes sont inscrites au registre des propositions. Pour vous, cela veut dire que la Factory sait désormais ce qui lui manque. Il manque surtout la plateforme d'applications de Cloudflare et la sécurité des automatisations de GitHub, deux sujets qu'aucune forge ne traite aujourd'hui alors que vos produits les touchent déjà. Supabase avait été outillé le 16/10 ; seuls ses manques sont listés. Je recommande de construire d'abord trois compétences peu coûteuses, qui protègent ce qui existe déjà. Le choix vous revient à la revue hebdomadaire, ou plus tôt si vous le demandez.

## 1. En-tête d'identification

Run de conseil, exécution du prompt « Competences Cloudflare GitHub Supabase dans les forges » version a, sur le pilot `digit-ai-factory` et en lecture des 13 forges. Période : 28/10/2026 de 09:35 à 10:07, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 3 agents `redacteur` Sonnet 5.5, un par plateforme, en parallèle.

Intention de la demande : savoir quelles compétences construire dans les forges pour travailler sur des produits qui emploient Cloudflare, Cloudflare Pages, GitHub, GitHub Actions et Supabase.

Test rétro : le résultat sert cette intention. La liste complète existe, et chaque fonctionnalité à approfondir débouche sur une compétence rattachée à une forge, à un véhicule existant et à un item du registre.

## 2. Verdict en une ligne

793 lignes datées sur 190 entrées d'index (112, 36 et 42, toutes présentes, relues à 10:04) ; 17 propositions écrites, `oracle-todo` exit 0 ; étude et inventaire PASS au contrôle d'écriture.

## 3. Décisions attendues

Rien n'attend de décision dans ce tour. Les 17 propositions entrent au registre au statut candidat, et leur choix vous revient à la revue hebdomadaire, comme pour toute proposition. Si vous voulez lancer plus tôt les trois premières, dites-le.

## 4. Traité

- **Accès mesuré.** 8 adresses sur 8 à 200, à 09:22 puis à 09:36, `curl -sL` anonyme depuis ce poste.
- **Catalogues.** Cloudflare : 205 lignes, dont Pages (51) et Workers (42). GitHub : 313 lignes, dont Actions (111). Supabase : 275 lignes. Chaque ligne porte son adresse, sa date, son niveau et son motif ; le contrôle des agents ne trouve aucun champ vide.
- **Relecture du pilot.** 6 lignes rouvertes sur 6 à 200, nom présent dans la page. 3 niveaux Cloudflare changés : Agents descend en « connaître », Web Analytics et KV montent en « approfondir ».
- **Existant mesuré.**
  - 0 fichier du parc cite `wrangler`, Workers, R2, D1 ou Turnstile.
  - 0 fichier cite `pull_request_target`, `actionlint`, `zizmor` ou `id-token: write`.
  - 5 produits du poste portent des workflows Actions, et aucun n'emploie `pull_request_target`.
  - Aucun produit du poste n'emploie de bibliothèque Supabase.
- **Faits datés relevés.**
  - Cloudflare : « Start new projects with Workers ».
  - GitHub : `pull_request_target` sera bloqué par défaut en dépôt public le 02/12/2026.
  - Supabase : les suites TLS CBC peuvent être retirées dès le 10/11/2026.
- **Registre.** TF-1994 à TF-2010 écrits par `journaliser.mjs`, verdict PASS avant et après ; un fait corrigé avant l'écriture (`claude-code-action` est dans 1 workflow, pas 3).
- **Renvoi cassé corrigé** dans la fiche des faits fournisseurs : la procédure DNS de forge-ops était citée sous un chemin qui n'existe pas. Elle pointe désormais sur la section G-03 et sur son script de vérification.
- **Livrables.** L'étude et l'inventaire, en Markdown et en données JSON, sont dans `output\03-etudes\`. Le contrôle d'écriture a d'abord rendu exit 1 (un titre, un nombre en lettres), puis exit 0 après correction. Le balayage des formes de secret ne trouve rien.

Relecture d'intention : sans objet, motif : la relecture de la consigne des agents, rappelée par le hook, n'a pas été jouée avant leur lancement ; les catalogues ont été relus à réception par la session pilote, échantillon compris.

## 5. Non traité

- **Construction des compétences** : motif `hors_perimetre`, le prompt identifie et planifie ; les 17 propositions attendent votre choix.
- **Plan GitHub du compte** : motif `dependance_externe`, `gh api user` rend le champ vide, et il décide de ce qui est disponible en dépôt privé.
- **Trace des forges mobilisées** : motif `hors_perimetre`, l'outil refuse de s'exécuter hors d'un produit (exit 2 au pilot).

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| un item par manque « approfondir » | un item par compétence, qui regroupe plusieurs fonctionnalités d'un même véhicule et d'une même forge | 71 manques Supabase seuls auraient donné 71 items, illisibles à la revue |
| tracer les forges par `mobiliser.mjs` | aucune trace | l'outil ne s'exécute que chez un produit ; le prompt le prescrivait à tort |

## 7. Risques

- **Documentation mouvante.** Énoncé : une page change après le 28/10. Signal : la date de lecture de la ligne. Parade : relire la page le jour de la construction, comme le demande chaque item.
- **Échéance TLS Supabase.** Énoncé : un futur produit Supabase emploierait des clients anciens. Signal : un produit Supabase créé avant le 10/11/2026. Parade : TF-2006.

## 8. Prochaines actions

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | TF-2000, TF-2005, TF-2001 | manuelle_utilisateur | décision de construire, revient au porteur | répondre « A-1 » pour lancer un mandat sur les trois compétences P1, ou attendre la revue hebdomadaire | les motifs wrangler, la protection côté serveur des 14 dépôts et le contrôle des workflows restent absents |
| A-2 | TF-1994 à TF-1996, TF-2006, TF-2010 | manuelle_utilisateur | décision de construire, revient au porteur | répondre « A-2 » pour un mandat Cloudflare sur le modèle du 16/10 | le premier produit Cloudflare se déploie par essais |
| A-3 | neuve | auto_ia | non exécutée : la publication du pilot suit le GO permanent R-38 §6 au prochain envoi groupé | `git push origin main` sous la porte de publication | l'étude reste sur ce poste |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Competences Cloudflare GitHub Supabase - 20261028a.md`.
- Inventaire : `output/03-etudes/Digit-AI - Inventaire - Fonctionnalites Cloudflare GitHub Supabase - 20261028a.md` et son `.json`.
- Registre : `todo/TODO.jsonl`, TF-1994 à TF-2010.
- Prompt exécuté : `output/04-plans/Digit-AI - Prompt - Competences Cloudflare GitHub Supabase dans les forges - 20261028a.md`.
- Renvoi corrigé : `references/INTEGRATIONS-FOURNISSEURS.md`, section Cloudflare.
