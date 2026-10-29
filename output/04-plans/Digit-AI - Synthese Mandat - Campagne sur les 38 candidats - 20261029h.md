---
destinataire: humain
---

# Synthèse Mandat — campagne sur les 38 candidats du registre (29/10/2026)

## 0. Synthèse d'ouverture

Les 38 candidats sont traités : 32 sont corrigés ou construits, 1 est écarté sur mesure, et les 5 qui vous reviennent attendent votre choix, avec une sixième question née en route. Pour les produits, cela veut dire moins de faux refus et de nouveaux contrôles : pages HTML, conteneurs qui perdent leurs données, déploiements GitHub sous votre feu vert, Supabase, Cloudflare. Ces 6 questions sont prêtes, rédigées avec leurs options ; elles iront à la revue hebdomadaire du 05/11, sauf si vous voulez les trancher plus tôt. Rien d'autre ne vous attend.

## 1. En-tête d'identification

Exécution de votre demande « Avance sur les 38 candidats » du 29/10/2026, sur le pilot `digit-ai-factory` et 8 forges. Période : 29/10/2026 de 16:38 à 19:39, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 6 agents (3 de campagne Sonnet 5.5, 3 constructeurs Opus 5.5) et 3 relectures d'intention.

Intention de la demande : faire avancer chaque candidat du registre jusqu'à sa correction, ou jusqu'à la décision qui vous revient.

Test rétro : le résultat sert cette intention. Chaque candidat a un sort mesuré, et les seuls restants portent une fiche que vous pouvez trancher en une ligne.

## 2. Verdict

32 sujets clos sur 38, chacun avec sa recette rejouée rouge puis verte ; `oracle-todo` PASS après 86 événements ; 9 dépôts publiés, 0 commit d'écart après vérification.

## 3. Décisions attendues

Aucune décision ne vous est posée dans ce tour : les 6 fiches de décision sont au registre, prêtes pour la revue hebdomadaire du 05/11.

## 4. Traité

Six lots indépendants, un agent par lot, une consigne commune relue avant le lancement ; à chaque réception, la session a rejoué les recettes avant de publier et de clore.

- **Socle HTML et porte des noms** (forge-agents, socle 1.42.0, commits 25f896d et bea2a5e) : 10 corrigés, dont 3 règles neuves de rendu (panneau déplié, filtres masqués au repli, colonnes déséquilibrées) ; recette du socle 741 → 770/770, rejouée par la session.
- **Exploitation et sécurité agentique** (forge-ops, forge-agents-security) : conteneur à état sans volume refusé, déploiement GitHub Actions où votre feu vert devient une approbation d'environnement, plan Supabase à garde-fous, agents de workflow et serveur MCP Supabase jugés ; recettes 278 → 329 et 55 → 100, rejouées par la session.
- **Données, tests, développement** : Workers testables (date de compatibilité, pan de tests), Supabase au-delà de Postgres, décision écrite pour D1, R2 et Hyperdrive ; forge-data 449 PASS et 30 tests neufs verts, rejoués par la session.
- **SEO et audit** : référentiel Cloudflare et contrôle des redirections qui gardent le chemin ; profil GitHub en lecture seule pour l'audit ; recette forge-seo 378/378 et `npm test` 14/14, rejoués par la session.
- **Restitution** (pilot, gabarit 2.54.0, contrat d'héritage 1.43.0) : 7 corrigés, dont S88 (le champ « De quoi s'agit-il » écrit pour le lecteur) et S89 (un écart entre deux références git prouvé par le statut des fichiers) ; `oracle-synthese` 257 → 283/283, rejoué sur main.
- **Autres contrôles du pilot** : titre numéroté qui échappait à la règle des titres, texte d'une page HTML enfin jugé, retours de ledger restés sans lot comptés à l'ouverture, faux constat de visibilité retiré, pre-push gardé par un cas de recette ; recettes rejouées sur main.
- **Écarté sur mesure** : l'allègement de 4 domaines d'oracle, qui ne gagnerait pas plus d'1 s par jugement.
- **Registre et catalogue** : 15 classes de défaut créées (référentiel 1.54.0) ; 11 services ajoutés au catalogue, contrôle du catalogue PASS sur 64 points d'entrée ; TF-2025 proposé pour le seuil de la règle des phrases longues.
- **Publication** : les 8 forges sous leur GO permanent (D-53 (b) du 03/10), le pilot sous le sien (D-54 (b) du 03/10) ; skills du poste réalignés.

Relecture d'intention : sert, gravité mineure, verdict consigné sous RI-20261029-09 ; l'écart relevé est le compte du message de commit (31 au lieu de 32), sans effet sur le registre.

## 5. Non traité

- Les 6 questions qui vous reviennent (remesure d'un gain en service, périmètre d'un comparatif de coûts, citation d'une règle nommée, question à un tiers, copie périmée d'une consigne sur votre compte Claude, seuil des phrases longues) — motif : `decision`, à la revue du 05/11.
- Restes signalés par les agents, hors de leur lot — motif : `borne_atteinte` : la section « Composants à état » du gabarit d'exploitation des produits, la copie du composant de filtres chez forge-organization, la feuille du composant à reposer dans 10 pages du pilot, 3 hooks qui lisent encore le dossier courant brut, des nœuds de grille périmés dans forge-seo-geo, un octet de tabulation dans un README de forge-data.
- Recette d'ensemble du pilot non rejouée en entier : elle reste bloquée sur la recette d'amorçage, qui sollicite le réseau — motif : `borne_atteinte` ; les recettes touchées ont été jouées une à une.

## 7. Risques

- **3 sessions sur le même dossier du pilot** : deux autres sessions ont enregistré et publié pendant la campagne, sur ce poste et sur l'autre.
  - Signal : un envoi refusé, ou des fichiers modifiés qui ne sont pas les miens.
  - Parade : rebase des branches d'agents puis avance rapide, et `git commit --only` sur mes seuls chemins, comme fait ici.

## 8. Prochaines actions

Ordre : la revue d'abord, les restes ensuite, car ils n'en dépendent pas.

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | TF-1954, TF-1971, TF-1972, TF-1983, TF-1991, TF-2025 | manuelle_utilisateur | `decision` : 6 fiches au format B, doctrine, arbitrage ou publication | `node todo/revue-hebdo.mjs`, puis répondre aux 6 décisions à la revue du 05/11 | si rien n'est fait, ces 6 défauts restent sans règle et peuvent revenir |
| A-2 | neuve | auto_ia | `borne_atteinte` : 6 restes signalés par les agents | consigner chaque reste en candidat au registre, puis le traiter par R-58 | si rien n'est fait, ces restes se perdent dans les rapports d'agents |

## 9. Traces

- Registre : `todo/TODO.jsonl`, 86 événements par `todo/journaliser.mjs` ; classes `todo/CLASSES.json` 1.54.0 ; relectures RI-20261029-07 et RI-20261029-09 dans `todo/relectures-intention.jsonl`.
- Catalogue : `catalogues/catalogue.jsonl`, `catalogues/CATALOGUES.md`.
- Pilot : commits 121eb874, 1cc31c9c, 295e4c93, a34fe29e, a0208dde, 11e1576d.
- Forges : forge-agents 25f896d et bea2a5e ; forge-ops b8f4d19 à 10052b7 ; forge-agents-security b1500a8 et 0463807 ; forge-data ff99742 à 2a97e39 ; forge-development 98b192c à c1ff522 ; forge-tests f989006 ; forge-seo-geo 8d4348b ; forge-audit 3a724b5.
