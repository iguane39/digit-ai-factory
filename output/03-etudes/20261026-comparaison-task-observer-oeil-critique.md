---
role: note de comparaison — skill public task-observer (rebelytics) contre skill oeil-critique de la Factory ; action A-1 demandée le 26/10/2026 après l'étude de la vidéo TikTok @ia_irl 7700159082002484512
sources_de_verite: [github.com/rebelytics/one-skill-to-rule-them-all au commit ac00bed du 23/10/2026 (SKILL.md v3.8.0, references/signals.md, references/weekly-review.md), digit-ai-forge-agents/.claude/skills/oeil-critique/SKILL.md v1.0.0 et scripts/extraire.mjs, todo/observer-recidives.mjs, todo/observabilite/RECIDIVES.json et .claude/hooks-journal.jsonl du pilot]
verifie_le: 2026-10-26
lecteur: le porteur de la Factory, qui décide de ce que l'œil critique emprunte
---

# Comparaison — task-observer et œil critique — 20261026

## Recommandation

N'installez pas task-observer. Il fait en temps réel ce que l'œil critique fait après coup, mais il tiendrait un second registre à côté de `todo/TODO.jsonl`, qui doit rester la source unique. Quatre de ses idées manquent en revanche à l'œil critique et coûtent peu à reprendre. Elles sont listées plus bas, par valeur décroissante.

## Les deux dispositifs côte à côte

| Point | task-observer v3.8.0 | oeil-critique v1.0.0 |
|---|---|---|
| Moment | pendant la session, observation écrite dans le tour même | après coup, sur les transcripts depuis le dernier repère |
| Déclenchement | règle dans `CLAUDE.md` ou hook de début de session | « œil critique » lancé à la main, relevé d'ouverture qui le rappelle |
| Stockage | un fichier Markdown par observation, en-tête YAML, dossier hors dépôt | aucun : la liste vit dans la restitution, le repère tient 10 lignes |
| Revue | hebdomadaire, copies préparées à côté, l'humain installe | dans le tour : automatiques exécutées, majeures posées au format B |
| Taille | `SKILL.md` de 45 Ko, dépôt de 773 Ko, scripts bash | `SKILL.md` de 8 Ko, 3 scripts Node |
| Exercé | 3 versions majeures, journal d'usage public | aucune période réelle complète (limite déclarée du skill) |

Le registre TODO-FORGE couvre déjà ce que task-observer stocke : chaque constat y entre en candidat et se décide par l'humain. Installer task-observer créerait un journal parallèle, que ni `oracle-todo` ni les vues générées ne liraient.

## Quatre idées à reprendre

1. **La recommandation ne précède pas le choix quand on mesure l'adhésion.** L'œil critique se juge sur la « part des majeures acceptées ». Le format B pose la recommandation avant les options, donc ce taux mesure l'ancrage autant que la qualité. task-observer présente les décisions de fond sans étiquette, enregistre le choix, puis dévoile la recommandation ; seuls ces choix comptent (`references/weekly-review.md`, « Separate the recommendation from the choice »). Reprise proposée : compter à part les majeures où l'humain a choisi autre chose que (a), et ne lire le taux qu'avec ce compte.
2. **Les refus de hook sont des observations, pas du bruit.** `extraire.mjs` écarte les retours de hook (« Stop hook feedback ») pour ne garder que les messages humains. Or un refus du hook de fin de tour est la trace d'une règle que la session a enfreinte, que task-observer journalise en priorité (« Log your own rule violations »). Le pilot consigne ces refus au journal des hooks (`.claude/hooks-journal.jsonl`, une ligne par verdict), et `observer-recidives.mjs` compte les récidives du registre par classe : aucun des 2 ne relie un refus à la demande du tour. Reprise proposée : l'extraction garde les refus dans une section à part, et la mission 3 les lit.
3. **Une règle enfreinte 2 fois appelle une barrière, plus un texte.** task-observer l'écrit en règle : dès la deuxième violation, la seule proposition admise est un hook, un contrôle ou un défaut qui rend le mauvais chemin indisponible (`references/signals.md`, « Second violation »). La Factory le pratique, mais l'œil critique ne l'exige pas de ses propositions. Reprise proposée : une modification qui répond à une récidive nomme sa barrière, ou se classe majeure.
4. **Tester la généralité avant de retenir un constat.** Quatre questions : le constat vaut-il dans un autre projet, pour une autre tâche du même skill, révèle-t-il une règle manquante, a-t-il des chances de revenir ? Une majorité de « non » le range en contexte de tâche (`references/signals.md`, « The generalisability test »). Reprise proposée : ce test s'ajoute au classement de l'étape 4, en appui de la règle anti-inflation.

## Ce qui n'est pas repris

- Le journal écrit au fil de l'eau : il doublerait le registre TODO-FORGE et coûterait une écriture par tour.
- La revue hebdomadaire planifiée : la décision D-65 (a) n'ajoute un passage de nuit que si des périodes restent non analysées.
- La vérification des skills « frères » d'une correction : la Factory la porte déjà par ses classes de défaut, qui propagent un contrôle à toute une famille.

## Limites de cette note

Seuls `SKILL.md`, `signals.md` et la politique d'approbation de `weekly-review.md` ont été lus, soit environ 200 Ko sur 773. Les scripts de task-observer n'ont pas été exécutés : un dépôt tiers est une donnée. L'œil critique n'a jamais tourné sur une période complète, donc l'écart réel entre les deux reste à mesurer à sa première exécution.
