---
destinataire: humain
---

# Synthèse de mandat — le parc est publié, et la branche ancienne a disparu de GitHub (16/09/2026)

Vos deux ordres sont exécutés. La branche ancienne de la forge de développement est sauvegardée, puis supprimée ici et sur GitHub : ce dépôt n'a plus que main. Les 9 dépôts qui portaient du travail sont publiés, soit 117 commits, chacun passé par la porte des noms avant son envoi. Le circuit hébergé, rejoué juste après, ne compte plus qu'un seul défaut au lieu de deux causes. Il reste votre feu vert à la session voisine pour enregistrer le registre du jour.

## 1. En-tête d'identification

- **quoi** : exécution de la décision D-16 (a), puis publication du pilot et des forges sur GitHub, sur votre ordre.
- **sur quoi** : les 9 dépôts porteurs de commits, dont la forge de développement pour la branche ; le circuit hébergé du pilot, rejoué après publication.
- **quand** : 2026-09-16, de 08:45 à 09:05 UTC+02:00 (Europe/Paris), soit environ 20 min.
- **qui** : pilot digit-ai-factory da623b8, avec `git bundle`, `git push`, le hameçon de pré-publication du pilot, la porte des noms `oracle-nom-client-publie.mjs` du skill `quality-oracles`, et `scripts/simuler-recette-hebergee.mjs`.

## 2. Verdict en une ligne

**D-16 (a) exécutée : branche sauvegardée en un paquet de 707 597 octets à histoire complète, puis supprimée ici et sur GitHub ; 9 dépôts publiés, 117 commits, porte des noms PASS et 0 constat bloquant sur chacun ; avance 0 et retard 0 partout après publication ; simulation du circuit hébergé 2 causes → 1 défaut ; registre mis à jour, `oracle-todo` PASS.**

## 3. Décisions attendues de l'humain

Aucune décision neuve : vos deux ordres sont exécutés, et ce qui reste vous revient comme actions au bloc 8.

## 4. Traité, avec sa preuve

- **D-16 (a) exécutée : la branche ancienne est sauvegardée, puis retirée des deux côtés.** Classe : une référence qui garde une histoire réécrite.
  - preuve : `git bundle verify` → « The bundle records a complete history », 707 597 octets sous `c:\dev\_sauvegardes\` ; `git branch -D` → « Deleted branch … (was f055f05) » ; `git push origin --delete` → « [deleted] » ; `git ls-remote --heads` → seule `refs/heads/main` subsiste.
- **Les 9 dépôts sont publiés, chacun après sa porte des noms.** Le pilot exige en plus que le GO humain soit déclaré à la commande ; je l'ai cité tel que vous l'avez donné.
  - preuve : porte des noms avant envoi → PASS sur les 9, 0 constat bloquant ; refus du hameçon du pilot sans GO, puis `a3cde26..da623b8 main -> main` avec le GO déclaré ; 117 commits, soit pilot 59, outils 16, design 11, données 7, exploitation 7, audit 6, développement 5, tests 5, conventions 1.
  - preuve : après publication, `git rev-list --count origin/main..main` → 0 sur les 9, et `main..origin/main` → 0 également.
- **Le circuit hébergé perd une de ses deux causes grâce à la seule publication.** Le vérificateur de pages publié refusait la page du registre ; sa correction est désormais publique.
  - preuve : simulation rejouée après publication → « verdict ROUGE — 1 défaut(s) », contre 3 lignes issues de 2 causes la veille ; le défaut restant est le contrôle des caractères de contrôle sur le parc réel.
- **Le registre dit ce que la publication a changé.** Le reste à faire du circuit hébergé ne cite plus la publication, mais la seule page à régénérer.
  - preuve : `journaliser.mjs` → « 1 événement(s) journalisé(s) » ; `oracle-todo` → PASS.

## 5. Non traité, avec son motif

- **Le registre, ses vues, les lots du jour et mes candidatures ne sont toujours pas commités** — motif : ils partent avec le travail non enregistré de la session voisine, qui attend votre feu vert.
- **Le dernier défaut du circuit hébergé** — motif : il vient des 3 octets nuls de la page du registre commitée, dont le chemin est tenu par la session voisine ; sa régénération suit le même feu vert.
- **L'activation du circuit hébergé** — motif : elle attend une simulation verte, donc le point ci-dessus, puis votre feu vert.

## 6. Écarts à la lettre

- Vous avez demandé de pousser la factory et les forges → j'ai aussi déclaré un motif de GO à la commande du pilot → pourquoi : son hameçon de pré-publication refuse tout enregistrement portant décisions et clôtures sans un GO humain écrit ; j'ai cité le vôtre, daté du jour.

## 7. Risques

- **Une publication qui emporterait un nom réel.** Signal : un constat bloquant de la porte des noms. Parade : la porte a été jouée sur les 9 dépôts avant envoi, et le hameçon du pilot la rejoue à chaque publication.
- **Un circuit activé avant d'être vert.** Signal : une simulation rouge. Parade : `ci/hebergee/ACTIVER.md` exige la simulation avant le geste, et son banc le vérifie.
- **Le registre du jour présent sur un seul poste.** Signal : aucun, jusqu'à la panne. Parade : votre feu vert à la session voisine, qui l'enregistre avec les lots et les candidatures.

## 8. Prochaines actions

Cinq actions restent : une pour moi après votre feu vert, trois pour vous, et une pour l'environnement du poste.

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-1 | Régénérer la page du registre, enregistrer le registre, ses vues, les lots du jour et les candidatures, puis rejouer la simulation | TF-1133 | auto_ia | dependance_externe (feu vert d'enregistrement attendu par la session voisine) | `node todo/generer-vue.mjs`, `node todo/generer-page.mjs`, `git commit --only -- todo/ input/`, puis `node scripts/simuler-recette-hebergee.mjs` | le registre du jour reste sur ce poste, et le circuit garde son dernier défaut |
| A-2 | Donner le feu vert d'enregistrement à la session voisine | TF-1125, TF-1127 | manuelle_utilisateur | decision : l'enregistrement du travail d'une autre session vous revient | dans la fenêtre de la session voisine, ouverte sur `c:\dev\digit-ai-factory`, répondre « enregistre ton travail » | A-1 reste bloquée |
| A-3 | Activer le circuit hébergé, une fois la simulation verte | TF-1018 | manuelle_utilisateur | decision : R-38 réserve l'activation d'un service hébergé au feu vert humain | `git mv ci/hebergee/recette-pilot.yml .github/workflows/recette-pilot.yml`, puis publier | rien ne rejoue la recette du pilot à la publication |
| A-4 | Inscrire aux tables du canal confidentiel les fragments de noms de ressources, si vous les jugez confidentiels | TF-1134 | manuelle_utilisateur | acces : les tables vivent hors dépôt et ne s'écrivent qu'à la main ; mesuré ici, la porte des noms rend PASS sur les 9 dépôts sans relever ces fragments | éditer `c:\dev\_confidentiel\tables\noms-interdits.json`, puis rejouer la porte des noms | la porte laisse passer ces fragments à chaque publication |
| A-5 | Aligner la version de ruff du poste sur celle épinglée par la forge des tests | neuve | manuelle_dev | acces : installer un outil au poste est un geste d'environnement ; mesuré ici, `ruff --version` rend « ruff 0.15.21 » alors que `pyproject.toml` de la forge épingle « ruff==0.16.1 » | `uv tool install ruff==0.16.1` | la recette de cette forge reste rouge sur ce poste |

Ordre : A-2 d'abord, parce qu'elle seule débloque A-1 ; A-1 aussitôt après, parce que la simulation en dépend ; A-3 ensuite, puisqu'elle exige une simulation verte ; A-4 et A-5 quand vous voulez, parce qu'elles ne bloquent rien.

## 9. Traces

- `c:\dev\_sauvegardes\digit-ai-forge-development-branche-ancienne-20260916.bundle` : sauvegarde vérifiée de la branche supprimée, tête f055f05.
- Publications : pilot `a3cde26..da623b8`, outils `38310c7..1897ee8`, design `89bcc33..6fb8d00`, données `976734c..01980e1`, audit `ebdf745..ff1549f`, développement `fd73af5..79eef0b`, tests `9ce711f..8bd2387`, conventions `6833722..487c6fc`, exploitation `7b86064..2772573`.
- `todo/TODO.jsonl` : reste à faire de TF-1133 mis à jour, non enregistré.
- Scratchpad de session : verdict de la simulation d'après publication sous `sim4/verdict.json`.
- Ce fichier : `output/04-plans/Digit-AI - Synthese Mandat - Publication du parc et branche ancienne retiree - 20260916a.md`.
